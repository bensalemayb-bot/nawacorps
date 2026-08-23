import { NextResponse } from "next/server";
import { z } from "zod";
import { buildExtractPrompt } from "@/lib/extract-prompt";
import { clientIp, hashIp } from "@/lib/iphash";
import { askLlmJson } from "@/lib/llm";
import { prisma } from "@/lib/prisma";
import { notifyTelegram } from "@/lib/telegram";

/**
 * POST /api/chat/finalize — cloture d une conversation : extraction, ecriture,
 * notification.
 *
 * UNE REGLE DOMINE TOUTES LES AUTRES : les messages du visiteur ne se perdent
 * dans AUCUN scenario. Modele indisponible, JSON illisible, schema inattendu,
 * Telegram muet — la Conversation est ecrite quoi qu il arrive. Ce qu on peut
 * perdre, c est l analyse ; jamais la trace de quelqu un qui a pris le temps
 * d ecrire.
 *
 * ORDRE : schema, idempotence, debit, extraction, ecriture transactionnelle,
 * notification. L idempotence passe AVANT le debit et l extraction : rejouer
 * une finalisation deja faite ne doit ni consommer de quota, ni compter dans
 * le debit, ni ecrire quoi que ce soit.
 */

const FENETRE_DEBIT_MS = 60 * 60 * 1000;
const MAX_PAR_IP = 10;
const ACTION = "finalize";
const MAX_CARACTERES_TOTAL = 8000;

const SchemaRequete = z.object({
  sessionId: z.string().uuid(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(1500),
      }),
    )
    .min(2)
    .max(16),
  reason: z.enum(["completed", "abandoned"]),
});

/**
 * Schema de ce que le modele est cense rendre. TOLERANT a dessein : un champ
 * absent devient null plutot que de faire echouer l extraction entiere. Le
 * JSON brut est de toute facon conserve dans Conversation.extracted, donc rien
 * n est perdu si le modele deborde du schema.
 */
const SchemaExtraction = z.object({
  name: z.string().nullish().transform((v) => v ?? null),
  phone: z.string().nullish().transform((v) => v ?? null),
  email: z.string().nullish().transform((v) => v ?? null),
  commerce_type: z.string().nullish().transform((v) => v ?? null),
  commerce_name: z.string().nullish().transform((v) => v ?? null),
  need_summary: z.string().nullish().transform((v) => v ?? ""),
  services: z.array(z.string()).nullish().transform((v) => v ?? []),
  urgency: z
    .enum(["immediat", "ce_trimestre", "plus_tard", "inconnu"])
    .nullish()
    .transform((v) => v ?? "inconnu"),
  quality_score: z.coerce.number().int().min(1).max(5).nullish().transform((v) => v ?? 1),
});

const etoiles = (n: number) => "★".repeat(Math.max(1, Math.min(5, n)));

export async function POST(req: Request) {
  let brut: unknown;
  try {
    brut = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible." }, { status: 400 });
  }

  // 1. Schema.
  const analyse = SchemaRequete.safeParse(brut);
  if (!analyse.success) {
    return NextResponse.json(
      {
        error: "Requête invalide.",
        issues: analyse.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 },
    );
  }
  const { sessionId, messages, reason } = analyse.data;

  const total = messages.reduce((n, m) => n + m.content.length, 0);
  if (total > MAX_CARACTERES_TOTAL) {
    return NextResponse.json(
      { error: `Conversation trop longue (${total} caractères, maximum ${MAX_CARACTERES_TOTAL}).` },
      { status: 400 },
    );
  }

  // 2. Idempotence — avant tout le reste. Le widget peut appeler deux fois :
  //    bouton « Terminer » puis pagehide, ou un sendBeacon rejoue au retour
  //    d un onglet. La seconde tentative repart sans rien ecrire.
  const dejaVue = await prisma.conversation.findUnique({ where: { sessionId } });
  if (dejaVue) {
    return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
  }

  // 3. Debit.
  const ipHash = hashIp(clientIp(req.headers));
  const recentes = await prisma.rateLimit.count({
    where: { ipHash, action: ACTION, createdAt: { gt: new Date(Date.now() - FENETRE_DEBIT_MS) } },
  });
  if (recentes >= MAX_PAR_IP) {
    return NextResponse.json({ error: "Trop de finalisations, réessayez plus tard." }, { status: 429 });
  }
  await prisma.rateLimit.create({ data: { ipHash, action: ACTION } });

  // 4. Extraction.
  const systeme = await buildExtractPrompt();
  const resultat = await askLlmJson(systeme, messages);

  // 4bis. Modele muet ou illisible : on enregistre quand meme.
  if ("unavailable" in resultat) {
    await prisma.conversation.create({
      data: { sessionId, messages, summary: null, extracted: undefined, ipHash },
    });
    try {
      await notifyTelegram("💬 Conversation non analysée (IA indispo) — à lire en base");
    } catch {
      console.warn("[finalize] Telegram en échec — conversation enregistrée malgré tout");
    }
    return NextResponse.json({ ok: true, analyzed: false }, { status: 200 });
  }

  const extrait = SchemaExtraction.safeParse(resultat.data);
  if (!extrait.success) {
    // Le modele a rendu du JSON, mais hors schema. Meme reflexe : on garde
    // tout, y compris le JSON brut, et on laisse un humain trancher.
    await prisma.conversation.create({
      data: {
        sessionId,
        messages,
        summary: null,
        extracted: resultat.data as object,
        ipHash,
      },
    });
    try {
      await notifyTelegram("💬 Conversation non analysée (IA indispo) — à lire en base");
    } catch {
      console.warn("[finalize] Telegram en échec — conversation enregistrée malgré tout");
    }
    return NextResponse.json({ ok: true, analyzed: false }, { status: 200 });
  }

  const d = extrait.data;
  const avecCoordonnees = d.name !== null && d.phone !== null;

  // 5. Ecriture. Transaction : un Lead sans sa Conversation, ou l inverse,
  //    serait une demi-verite en base.
  await prisma.$transaction(async (tx) => {
    let leadId: string | null = null;

    if (avecCoordonnees) {
      const lead = await tx.lead.create({
        data: {
          name: d.name as string,
          phone: d.phone as string,
          email: d.email,
          commerceName: d.commerce_name,
          commerceType: d.commerce_type,
          source: "CHATBOT",
          status: "NEW",
          score: d.quality_score,
          needSummary: d.need_summary,
        },
      });
      leadId = lead.id;
    }

    await tx.conversation.create({
      data: {
        sessionId,
        messages,
        summary: d.need_summary,
        extracted: resultat.data as object,
        ipHash,
        leadId,
      },
    });
  });

  // 6. Notification. APRES l ecriture et sous try/catch : acquis du bloc B8,
  //    une panne de Telegram ne peut pas annuler un lead.
  const texte = avecCoordonnees
    ? `🤖 Lead CHATBOT ${etoiles(d.quality_score)} — ${d.name}, ${d.phone}, ${d.commerce_type ?? "commerce non précisé"}. Besoin : ${d.need_summary}`
    : `💬 Conversation sans coordonnées (${etoiles(d.quality_score)}) : ${d.need_summary}`;
  try {
    await notifyTelegram(texte);
  } catch {
    console.warn("[finalize] Telegram en échec — écriture conservée");
  }

  console.log(`[finalize] ${reason} — lead ${avecCoordonnees ? "créé" : "non créé"}, score ${d.quality_score}`);

  return NextResponse.json(
    { ok: true, analyzed: true, leadCreated: avecCoordonnees },
    { status: 201 },
  );
}
