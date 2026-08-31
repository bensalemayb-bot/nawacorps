import { NextResponse } from "next/server";
import { z } from "zod";
import { buildExtractPrompt } from "@/lib/extract-prompt";
import { Prisma } from "@/lib/generated/prisma/client";
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
  /**
   * CE QUE LA CONVERSATION CONCERNE, quand le widget le sait — le sujet pose
   * par app/(site)/devis a l ouverture (« le-site », « devis-imprimes »).
   *
   * OPTIONNEL, et il doit le rester : la bulle s ouvre aussi toute seule, sur
   * n importe quelle page, sans que rien n ait ete clique. Une conversation
   * spontanee n a pas de sujet, et un champ vide vaut mieux qu un champ invente.
   *
   * BORNE A 80 CARACTERES, comme dans app/api/contact/route.ts et pour la meme
   * raison : la valeur vient du client, donc de n importe qui.
   *
   * IL N EST PAS AJOUTE AU SCHEMA D EXTRACTION. Le modele n a pas a le deviner
   * — on le SAIT, il vient de l URL cliquee. Ce que le modele extrait de son
   * cote (`services`) reste ce qu il a compris de la conversation, et les deux
   * ne se melangent pas.
   */
  subject: z.string().max(80).optional(),
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

/**
 * Reponse du chemin « deja finalise ». STRICTEMENT identique a celle que rend
 * le controle d idempotence en lecture (etape 2) : pour l appelant, se faire
 * devancer par une requete concurrente et arriver apres coup sont le meme
 * evenement, et doivent se raconter pareil.
 */
const reponseDoublon = () => NextResponse.json({ ok: true, duplicate: true }, { status: 200 });

/**
 * Execute une ecriture de finalisation en absorbant la collision d unicite.
 * Rend true si l ecriture a eu lieu, false si une requete concurrente avait
 * deja finalise cette session.
 *
 * POURQUOI CE FILET, alors que l etape 2 verifie deja l existence : cette
 * verification est un lire-puis-ecrire. Entre les deux, une seconde requete
 * portant le meme sessionId peut passer la meme lecture — toutes deux voient
 * une base vide, toutes deux ecrivent. L index unique arbitre au dernier
 * moment et fait echouer la perdante. Sans ce catch, elle rendait un 500 alors
 * que la conversation, elle, etait bien enregistree par la gagnante.
 *
 * P2002 EST ATTRAPE LARGEMENT, sans filtrer sur le nom de la contrainte, et
 * c est exact ici : les seuls uniques que ces ecritures peuvent violer sont
 * Conversation.sessionId et Conversation.leadId — Lead n en porte aucun — et
 * leadId est un cuid cree dans la meme transaction, donc jamais en collision.
 * Tout P2002 qui s echappe d ici est un doublon de session.
 */
async function ecrireSansDoublon(ecriture: () => Promise<unknown>): Promise<boolean> {
  try {
    await ecriture();
    return true;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return false;
    throw e;
  }
}

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
  const { sessionId, messages, reason, subject } = analyse.data;
  // Une chaine vide n est pas un sujet : elle devient null. Meme normalisation
  // qu au formulaire (app/api/contact/route.ts) — les deux routes ecrivent dans
  // la MEME colonne, et deux facons de dire « on ne sait pas » y cohabiteraient.
  const sujet = subject?.trim() ? subject.trim() : null;

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
    return reponseDoublon();
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
    const ecrit = await ecrireSansDoublon(() =>
      prisma.conversation.create({
        data: { sessionId, messages, summary: null, extracted: undefined, ipHash },
      }),
    );
    if (!ecrit) return reponseDoublon();
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
    const ecrit = await ecrireSansDoublon(() =>
      prisma.conversation.create({
        data: {
          sessionId,
          messages,
          summary: null,
          extracted: resultat.data as object,
          ipHash,
        },
      }),
    );
    if (!ecrit) return reponseDoublon();
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
  const ecrit = await ecrireSansDoublon(() =>
    prisma.$transaction(async (tx) => {
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
            // CE QUE LE VISITEUR AVAIT CLIQUE, et non ce que le modele a cru
            // comprendre : la valeur vient de l URL de /devis, pas de
            // l extraction. `null` quand la bulle a ete ouverte sans rien
            // designer — voir le champ `subject` du schema en tete de fichier.
            subject: sujet,
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
    }),
  );
  // Devance par une requete concurrente : la transaction a fait un rollback
  // complet, donc aucun Lead orphelin n a survecu. La gagnante a tout ecrit et
  // c est elle qui notifie — on sort avant le Telegram pour ne pas doubler.
  if (!ecrit) return reponseDoublon();

  // 6. Notification. APRES l ecriture et sous try/catch : acquis du bloc B8,
  //    une panne de Telegram ne peut pas annuler un lead.
  // Le sujet s ecrit dans la notification comme dans celle du formulaire : sur
  // le telephone d Ayoub, c est la ligne qui dit quoi preparer avant de
  // rappeler. Absent des conversations spontanees, ou il n y a rien a dire.
  const objet = sujet ? ` [${sujet}]` : "";
  const texte = avecCoordonnees
    ? `🤖 Lead CHATBOT${objet} ${etoiles(d.quality_score)} — ${d.name}, ${d.phone}, ${d.commerce_type ?? "commerce non précisé"}. Besoin : ${d.need_summary}`
    : `💬 Conversation sans coordonnées${objet} (${etoiles(d.quality_score)}) : ${d.need_summary}`;
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
