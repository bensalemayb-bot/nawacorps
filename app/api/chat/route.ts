import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/chat-prompt";
import { clientIp, hashIp } from "@/lib/iphash";
import { askLlm } from "@/lib/llm";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/chat — une reponse de l assistant. Pas de streaming (decision B9).
 *
 * L ORDRE EST LA SECURITE, comme pour /api/contact :
 *  1. schema  — rien de non valide n atteint la suite.
 *  2. debit   — 30 requetes par heure et par IP hachee.
 *  3. budget  — plafond global sur 24 h glissantes. Le modele coute ; ce
 *     compteur borne la facture avant que Google ne s en charge.
 *  4. compteur — on n incremente qu apres avoir passe les deux controles,
 *     sinon un flot refuse consommerait le budget qu il vient de se voir
 *     refuser.
 *  5. modele  — indisponible pour quelque raison que ce soit : 503 avec
 *     fallback, jamais un 500 nu. Le visiteur doit toujours se voir proposer
 *     le formulaire, pas une page d erreur.
 *
 * AUCUNE PERSISTANCE de la conversation ici : c est le bloc B10.
 * La cle du modele ne quitte jamais le serveur.
 */

const FENETRE_DEBIT_MS = 60 * 60 * 1000; // 1 h
const MAX_PAR_IP = 30;
const FENETRE_BUDGET_MS = 24 * 60 * 60 * 1000; // 24 h glissantes
const BUDGET_DEFAUT = 200;
const ACTION = "chat";
const MAX_CARACTERES_TOTAL = 8000;

const SchemaChat = z.object({
  sessionId: z.string().uuid(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(1500),
      }),
    )
    .min(1)
    .max(16),
});

function budgetQuotidien(): number {
  const brut = Number(process.env.CHAT_DAILY_LIMIT);
  return Number.isFinite(brut) && brut > 0 ? brut : BUDGET_DEFAUT;
}

export async function POST(req: Request) {
  let brut: unknown;
  try {
    brut = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible." }, { status: 400 });
  }

  // 1. Schema.
  const analyse = SchemaChat.safeParse(brut);
  if (!analyse.success) {
    return NextResponse.json(
      {
        error: "Requête invalide.",
        issues: analyse.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }
  const { messages } = analyse.data;

  const total = messages.reduce((n, m) => n + m.content.length, 0);
  if (total > MAX_CARACTERES_TOTAL) {
    return NextResponse.json(
      { error: `Conversation trop longue (${total} caractères, maximum ${MAX_CARACTERES_TOTAL}).` },
      { status: 400 },
    );
  }

  if (messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json(
      { error: "Le dernier message doit venir de l'utilisateur." },
      { status: 400 },
    );
  }

  // 2. Debit par IP hachee.
  const ipHash = hashIp(clientIp(req.headers));
  const recentes = await prisma.rateLimit.count({
    where: { ipHash, action: ACTION, createdAt: { gt: new Date(Date.now() - FENETRE_DEBIT_MS) } },
  });
  if (recentes >= MAX_PAR_IP) {
    return NextResponse.json(
      { error: "Trop de messages, réessayez plus tard." },
      { status: 429 },
    );
  }

  // 3. Budget global, tous visiteurs confondus.
  const duJour = await prisma.rateLimit.count({
    where: { action: ACTION, createdAt: { gt: new Date(Date.now() - FENETRE_BUDGET_MS) } },
  });
  if (duJour >= budgetQuotidien()) {
    console.warn(`[chat] budget quotidien atteint (${duJour}) — repli formulaire`);
    return NextResponse.json({ fallback: true }, { status: 503 });
  }

  // 4. Le compteur, une fois les controles passes.
  await prisma.rateLimit.create({ data: { ipHash, action: ACTION } });

  // 5. Le modele. askLlm ne jette jamais.
  const system = await buildSystemPrompt();
  const resultat = await askLlm(system, messages);

  if ("unavailable" in resultat) {
    return NextResponse.json({ fallback: true }, { status: 503 });
  }

  return NextResponse.json({ reply: resultat.reply }, { status: 200 });
}
