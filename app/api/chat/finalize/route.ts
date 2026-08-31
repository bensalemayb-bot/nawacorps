import { NextResponse } from "next/server";
import { z } from "zod";
import { buildExtractPrompt } from "@/lib/extract-prompt";
import { Prisma } from "@/lib/generated/prisma/client";
import { LOCALES, LOCALE_DEFAUT, type Locale, localeDuCorps } from "@/lib/i18n";
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
 *
 * LA LANGUE N EST PAS UNE ETAPE DE CET ORDRE. Comme dans app/api/chat/route.ts,
 * elle est lue en tete pour REDIGER les refus et pour batir le prompt
 * d extraction ; elle ne fait accepter ni refuser aucune requete, et une valeur
 * inconnue retombe sur le francais plutot que de faire perdre une conversation
 * a l ecriture.
 *
 * LES NOTIFICATIONS TELEGRAM RESTENT EN FRANCAIS, DELIBEREMENT. Leur unique
 * lecteur est Ayoub, sur son telephone. Les traduire en fonction de la langue
 * du visiteur donnerait un fil de notifications bilingue a une personne qui
 * n en a qu une — et rendrait deux formulations pour un meme evenement.
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
  /**
   * LA LANGUE DE LA CONVERSATION — optionnelle, francais par defaut, meme
   * contrat que dans app/api/chat/route.ts. Elle sert a batir le prompt
   * d extraction : un fil anglais se resume mieux par un prompt anglais.
   *
   * ELLE ARRIVE AUSSI PAR `sendBeacon`, a la fermeture de l onglet — c est
   * pourquoi elle est dans le CORPS et non dans un en-tete : sendBeacon ne
   * permet pas de poser d en-tete autre que le type de contenu.
   *
   * `.catch()` ET NON `.default()` : `.default()` ne couvre que l ABSENCE, et
   * une valeur presente mais inconnue (« de », « EN ») ferait echouer l enum,
   * donc un 400, donc une conversation — et parfois un lead — perdue a cause
   * d un champ decoratif. `.catch()` retombe sur le francais dans les deux cas,
   * comme `localeDuCorps` (lib/i18n.ts), qui lit le meme champ avant le schema.
   */
  locale: z.enum(LOCALES).catch(LOCALE_DEFAUT),
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
 * LES REFUS ECRITS A LA MAIN, DANS LES DEUX LANGUES — meme raison qu a
 * app/api/chat/route.ts : le widget ne les affiche pas, mais ils partent dans
 * le corps de la reponse et un francais rendu a un appel venu de /en est le
 * defaut qu on corrige.
 *
 * LE TABLEAU `issues` DE ZOD RESTE EN ANGLAIS BRUT, comme la-bas et pour la
 * meme raison : aucune contrainte de ce schema ne porte sur du texte tape par
 * le visiteur. Un echec ici est un bug de notre propre client, lu par un
 * developpeur.
 */
const MESSAGES: Record<
  Locale,
  { illisible: string; invalide: string; trop: (n: number) => string; debit: string }
> = {
  fr: {
    illisible: "Corps de requête illisible.",
    invalide: "Requête invalide.",
    trop: (n) => `Conversation trop longue (${n} caractères, maximum ${MAX_CARACTERES_TOTAL}).`,
    debit: "Trop de finalisations, réessayez plus tard.",
  },
  en: {
    illisible: "Unreadable request body.",
    invalide: "Invalid request.",
    trop: (n) => `Conversation too long (${n} characters, maximum ${MAX_CARACTERES_TOTAL}).`,
    debit: "Too many submissions, please try again later.",
  },
};

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
    // Corps illisible : rien a lire, donc pas de langue. Le francais par
    // defaut — un corps illisible ne vient jamais du site lui-meme.
    return NextResponse.json({ error: MESSAGES.fr.illisible }, { status: 400 });
  }

  const t = MESSAGES[localeDuCorps(brut)];

  // 1. Schema.
  const analyse = SchemaRequete.safeParse(brut);
  if (!analyse.success) {
    return NextResponse.json(
      {
        error: t.invalide,
        issues: analyse.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 },
    );
  }
  const { sessionId, messages, reason, subject, locale } = analyse.data;
  // Une chaine vide n est pas un sujet : elle devient null. Meme normalisation
  // qu au formulaire (app/api/contact/route.ts) — les deux routes ecrivent dans
  // la MEME colonne, et deux facons de dire « on ne sait pas » y cohabiteraient.
  const sujet = subject?.trim() ? subject.trim() : null;

  const total = messages.reduce((n, m) => n + m.content.length, 0);
  if (total > MAX_CARACTERES_TOTAL) {
    return NextResponse.json({ error: t.trop(total) }, { status: 400 });
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
    return NextResponse.json({ error: t.debit }, { status: 429 });
  }
  await prisma.rateLimit.create({ data: { ipHash, action: ACTION } });

  // 4. Extraction. Le prompt est bati dans la langue de la conversation : memes
  //    neuf cles et memes jetons d urgence des deux cotes, seul le resume suit
  //    la langue du visiteur (lib/extract-prompt.ts).
  const systeme = await buildExtractPrompt(locale);
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
  // LA REGLE DU LEAD NE CHANGE PAS AVEC LE BLOC B13 : l assistant ne cree un
  // Lead que s il a un NOM ET UN TELEPHONE. `Lead.phone` est devenu nullable
  // pour le FORMULAIRE, qui accepte « telephone ou e-mail » ; l assistant, lui,
  // est conduit a demander le telephone (lib/extract-prompt.ts) et une
  // conversation sans numero reste rangee en Conversation, pas en Lead.
  // Elargir cette condition serait une decision commerciale, pas un
  // rangement de dette — elle n est pas prise ici.
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
            // Plus d assertion sur le telephone : la colonne est nullable
            // depuis b13, et `avecCoordonnees` garantit de toute facon qu il
            // est renseigne dans cette branche.
            phone: d.phone,
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
