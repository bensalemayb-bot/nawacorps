import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/chat-prompt";
import { LOCALES, LOCALE_DEFAUT, type Locale, localeDuCorps } from "@/lib/i18n";
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
 * LA LANGUE N EST PAS UN CONTROLE ET NE S INTERCALE PAS DANS CET ORDRE. Elle
 * est lue au tout debut, juste apres le corps, parce qu elle sert a REDIGER
 * les refus des etapes suivantes — pas a en decider. Aucune requete n est
 * acceptee ou rejetee a cause d elle : une valeur inconnue retombe sur le
 * francais au lieu de faire un 400, sans quoi une faute de frappe dans un
 * champ decoratif couterait une conversation.
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
  /**
   * LA LANGUE DE LA CONVERSATION — optionnelle, francais par defaut.
   *
   * Optionnelle et elle doit le rester : le widget d avant ce chantier ne
   * l envoyait pas, et un onglet ouvert depuis hier tourne toujours avec son
   * ancien JavaScript. Une absence vaut donc « francais », exactement le
   * comportement d avant.
   *
   * `z.enum(LOCALES)` PLUTOT QU UNE LISTE RECOPIEE : ajouter une langue a
   * lib/i18n.ts l ouvre ici sans qu on y pense, et surtout sans qu on l oublie.
   *
   * `.catch()` ET NON `.default()`, ET LA DIFFERENCE COMPTE. `.default()` ne
   * couvre que l ABSENCE ; une valeur presente mais inconnue (« de », « EN »)
   * ferait echouer l enum, donc un 400, donc une conversation perdue a cause
   * d un champ decoratif. `.catch()` couvre les deux et retombe sur le
   * francais — exactement ce que fait `localeDuCorps` (lib/i18n.ts), qui lit
   * le meme champ avant le schema, et les deux lectures doivent dire la meme
   * chose.
   */
  locale: z.enum(LOCALES).catch(LOCALE_DEFAUT),
});

/**
 * LES REFUS ECRITS A LA MAIN, DANS LES DEUX LANGUES.
 *
 * Aucun de ces messages n est affiche par components/ChatWidget.tsx, qui
 * bascule sur son propre texte de repli quel que soit le code rendu — c est
 * deliberé, on ne montre pas un code d erreur a un commercant. Ils sont
 * neanmoins traduits : ils partent dans le corps de la reponse, ils sont ce
 * qu on lit dans un journal ou dans un onglet reseau, et un message francais
 * rendu a un appel venu de /en est le meme defaut que celui corrige dans
 * app/api/contact/route.ts.
 *
 * LE TABLEAU `issues` DE ZOD, LUI, RESTE EN ANGLAIS BRUT, ET C EST VOULU. Ici
 * — contrairement a /api/contact — aucune contrainte du schema ne porte sur
 * quelque chose que le visiteur a TAPE : `sessionId` est un uuid fabrique par
 * le widget, `messages` est la forme du tableau qu il envoie, et sa longueur
 * est deja bornee cote client par `maxLength={1500}`. Un echec de schema est
 * donc toujours un bug de NOTRE client, jamais une faute de frappe d un
 * commercant, et son lecteur est un developpeur devant un onglet reseau.
 * Traduire « expected array to have >=2 items » ne servirait personne.
 */
type Refus = {
  illisible: string;
  invalide: string;
  trop: (n: number) => string;
  dernier: string;
  debit: string;
};

const MESSAGES: Record<Locale, Refus> = {
  fr: {
    illisible: "Corps de requête illisible.",
    invalide: "Requête invalide.",
    trop: (n) => `Conversation trop longue (${n} caractères, maximum ${MAX_CARACTERES_TOTAL}).`,
    dernier: "Le dernier message doit venir de l'utilisateur.",
    debit: "Trop de messages, réessayez plus tard.",
  },
  en: {
    illisible: "Unreadable request body.",
    invalide: "Invalid request.",
    trop: (n) => `Conversation too long (${n} characters, maximum ${MAX_CARACTERES_TOTAL}).`,
    dernier: "The last message must come from the user.",
    debit: "Too many messages, please try again later.",
  },
};

function budgetQuotidien(): number {
  const brut = Number(process.env.CHAT_DAILY_LIMIT);
  return Number.isFinite(brut) && brut > 0 ? brut : BUDGET_DEFAUT;
}

export async function POST(req: Request) {
  let brut: unknown;
  try {
    brut = await req.json();
  } catch {
    // Corps illisible : il n y a rien a lire, donc pas de langue. Le francais,
    // par defaut. Un corps illisible ne vient jamais du site lui-meme.
    return NextResponse.json({ error: MESSAGES.fr.illisible }, { status: 400 });
  }

  const t = MESSAGES[localeDuCorps(brut)];

  // 1. Schema.
  const analyse = SchemaChat.safeParse(brut);
  if (!analyse.success) {
    return NextResponse.json(
      {
        error: t.invalide,
        issues: analyse.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }
  const { messages, locale } = analyse.data;

  const total = messages.reduce((n, m) => n + m.content.length, 0);
  if (total > MAX_CARACTERES_TOTAL) {
    return NextResponse.json({ error: t.trop(total) }, { status: 400 });
  }

  if (messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json({ error: t.dernier }, { status: 400 });
  }

  // 2. Debit par IP hachee.
  const ipHash = hashIp(clientIp(req.headers));
  const recentes = await prisma.rateLimit.count({
    where: { ipHash, action: ACTION, createdAt: { gt: new Date(Date.now() - FENETRE_DEBIT_MS) } },
  });
  if (recentes >= MAX_PAR_IP) {
    return NextResponse.json({ error: t.debit }, { status: 429 });
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
  //    LE PROMPT EST BATI DANS LA LANGUE DU VISITEUR : prix lus en base avec
  //    `nomService`/`formatServicePrice`, regles transposees une par une
  //    (lib/chat-prompt.ts). Il ne suffit PAS de demander au modele de repondre
  //    en anglais — les regles de prix, de delai et de « feu vert » doivent
  //    exister dans la langue ou il redige, sinon il improvise.
  const system = await buildSystemPrompt(locale);
  const resultat = await askLlm(system, messages);

  if ("unavailable" in resultat) {
    return NextResponse.json({ fallback: true }, { status: 503 });
  }

  return NextResponse.json({ reply: resultat.reply }, { status: 200 });
}
