import { NextResponse } from "next/server";
import { z } from "zod";
import { LOCALES, LOCALE_DEFAUT, type Locale, localeDuCorps } from "@/lib/i18n";
import { clientIp, hashIp } from "@/lib/iphash";
import { prisma } from "@/lib/prisma";
import { notifyTelegram } from "@/lib/telegram";

/**
 * POST /api/contact — enregistre un Lead et notifie Telegram.
 *
 * L ORDRE DES ETAPES EST LA SECURITE. Il ne doit pas etre reamenage :
 *  1. leurre  — un bot rempli repart avec un 200 identique a un succes. Aucune
 *     ecriture, aucun signal qui lui permettrait d apprendre qu il est detecte.
 *  2. schema  — la validation precede la base : rien de non valide ne l atteint.
 *  3. debit   — le compteur precede l ecriture du lead, sinon un attaquant
 *     ecrirait autant de leads qu il veut avant d etre refuse.
 *  4. lead    — l ecriture qui compte.
 *  5. Telegram — APRES, et sous try/catch. Le lead est deja sauve : une panne
 *     de notification ne peut plus rien lui coûter.
 *
 * Le message du visiteur est range dans Lead.needSummary. Le modele de B2 n a
 * pas de champ `message` et B8 interdit d en ajouter un ; `needSummary` est le
 * champ qui porte le besoin exprime, `notes` se lisant comme une annotation
 * interne. Decision signalee.
 *
 * >>> CETTE ROUTE PARLAIT FRANCAIS AU SITE ANGLAIS — ET ANGLAIS AU FRANCAIS. <<<
 *
 * Les deux moities du defaut sont corrigees ici, et elles n avaient pas la meme
 * cause :
 *
 *  1. LES MESSAGES ECRITS A LA MAIN (« Données invalides. », « Trop de
 *     demandes… ») etaient francais et partaient tels quels a un visiteur venu
 *     de /en, qui les voyait s afficher sous le formulaire — c est bien
 *     `erreur.error` que components/ContactForm.tsx rend a l ecran.
 *  2. LES MESSAGES DE ZOD, eux, etaient ANGLAIS PARTOUT, y compris sur le site
 *     francais : aucun `.min()` ni `.max()` ne portait de message, donc zod
 *     rendait le sien (« Too small: expected string to have >=2 characters »).
 *     Un message anglais sur un site francais est exactement la meme faute que
 *     l inverse. Chaque contrainte porte desormais sa phrase, dans les deux
 *     langues.
 *
 * LA LANGUE ARRIVE PAR LE CORPS, champ `locale`, optionnel. Ni par un en-tete
 * ni par le chemin : `proxy.ts` ne tourne pas sur /api, l en-tete
 * `x-nawa-locale` n existe donc pas ici, et l URL de la route est la meme dans
 * les deux langues. Absente ou inconnue, elle vaut « fr » — le comportement
 * exact d avant ce chantier.
 *
 * ELLE N EST PAS UN CONTROLE et ne se glisse pas dans l ordre ci-dessus : elle
 * est lue avant le leurre parce qu elle sert a REDIGER les refus, jamais a en
 * decider. Aucune requete n est acceptee ni rejetee a cause d elle.
 */

const FENETRE_MS = 60 * 60 * 1000; // 1 h
const MAX_PAR_FENETRE = 5;
const ACTION = "contact";
const EXTRAIT_MAX = 200;

/**
 * LES PHRASES DE REFUS, DANS LES DEUX LANGUES.
 *
 * Elles sont ICI et non dans lib/dictionnaires/ pour une raison de perimetre :
 * ce dictionnaire-la est charge par des composants CLIENT, et il n a aucune
 * raison d embarquer dans le navigateur des messages que seul le serveur
 * ecrit. La contrepartie est qu il faut penser aux deux colonnes — d ou le
 * `Record<Locale, …>`, qui casse la compilation le jour ou une langue est
 * ajoutee a lib/i18n.ts sans que sa colonne le soit ici.
 *
 * `contact` REPREND MOT POUR MOT `t.formulaire.erreurContact` du dictionnaire.
 * C est la meme regle verifiee deux fois — une fois dans le navigateur pour
 * eviter un aller-retour, une fois ici parce que c est la seule verification
 * qui compte — et le visiteur ne doit pas lire deux phrases differentes selon
 * l endroit ou elle a echoue.
 */
type Refus = {
  illisible: string;
  invalide: string;
  debit: string;
  nomCourt: string;
  nomLong: string;
  nomManquant: string;
  telLong: string;
  telInvalide: string;
  emailLong: string;
  emailInvalide: string;
  messageLong: string;
  sujetLong: string;
  contact: string;
};

const MESSAGES: Record<Locale, Refus> = {
  fr: {
    illisible: "Corps de requête illisible.",
    invalide: "Données invalides.",
    debit: "Trop de demandes, réessayez plus tard.",
    nomCourt: "Indiquez votre nom (2 caractères au moins).",
    nomLong: "Nom trop long (80 caractères au maximum).",
    nomManquant: "Indiquez votre nom.",
    telLong: "Numéro de téléphone trop long (20 caractères au maximum).",
    telInvalide: "Numéro de téléphone invalide.",
    emailLong: "Adresse e-mail trop longue (160 caractères au maximum).",
    emailInvalide: "Adresse e-mail invalide.",
    messageLong: "Message trop long (1000 caractères au maximum).",
    sujetLong: "Sujet trop long (80 caractères au maximum).",
    contact: "Indiquez un téléphone ou un e-mail.",
  },
  en: {
    illisible: "Unreadable request body.",
    invalide: "Invalid details.",
    debit: "Too many requests, please try again later.",
    nomCourt: "Enter your name (at least 2 characters).",
    nomLong: "Name too long (80 characters maximum).",
    nomManquant: "Enter your name.",
    telLong: "Phone number too long (20 characters maximum).",
    telInvalide: "Invalid phone number.",
    emailLong: "Email address too long (160 characters maximum).",
    emailInvalide: "Invalid email address.",
    messageLong: "Message too long (1000 characters maximum).",
    sujetLong: "Subject too long (80 characters maximum).",
    contact: "Enter a phone number or an email address.",
  },
};

// Le studio vend une proposition ecrite : il lui faut au moins un moyen de
// la faire parvenir. Ni `phone` ni `email` n est requis seul — chacun n est
// verifie dans son format que s il est rempli, une chaine vide passant les
// deux refine — c est le .refine() final qui impose l un des deux (constat
// 6, revue de marque). La validation client (ContactForm.tsx) mime cette
// meme regle, mais ne remplace jamais celle-ci.
//
// CHAQUE CONTRAINTE PORTE SA PHRASE. Sans message explicite, zod rend le sien,
// et le sien est en anglais quelle que soit la langue de la page — c est la
// moitie n° 2 du defaut decrit en tete de fichier.
function construireSchema(t: Refus) {
  return z
    .object({
      name: z
        .string({ error: t.nomManquant })
        .min(2, t.nomCourt)
        .max(80, t.nomLong),
      phone: z
        .string({ error: t.telInvalide })
        .max(20, t.telLong)
        .refine((v) => v === "" || /^[+0-9 ().-]{7,20}$/.test(v), t.telInvalide),
      email: z
        .string({ error: t.emailInvalide })
        .max(160, t.emailLong)
        .refine((v) => v === "" || z.email().safeParse(v).success, t.emailInvalide),
      message: z.string({ error: t.messageLong }).max(1000, t.messageLong),
      website: z.string().optional(),
      // CE QUE LA DEMANDE CONCERNE, quand la page le sait — le champ cache pose
      // par app/(site)/devis (aujourd hui « devis-studio », lib/devis.ts).
      // OPTIONNEL, et il doit le rester : le meme formulaire est rendu en pied de page et sur
      // /contact, ou le visiteur n a rien clique de precis, et une demande
      // spontanee sans sujet vaut mieux qu un sujet invente.
      // BORNE A 80 CARACTERES : ce champ vient du CLIENT, donc de n importe qui.
      // Nos sujets font moins de trente signes ; la borne n existe que pour qu un
      // POST fabrique a la main ne puisse pas ecrire un roman dans Lead.subject.
      subject: z.string().max(80, t.sujetLong).optional(),
      // LA LANGUE DU VISITEUR — optionnelle, francais par defaut. Elle ne sert
      // qu a rediger la reponse : rien de ce qui est ecrit en base n en depend.
      // `.catch()` ET NON `.default()` : `.default()` ne couvre que l ABSENCE,
      // et une valeur presente mais inconnue (« de », « EN ») ferait echouer
      // l enum — donc un 400, donc un LEAD PERDU a cause d un champ decoratif.
      // `.catch()` retombe sur le francais dans les deux cas, comme
      // `localeDuCorps` (lib/i18n.ts), qui lit le meme champ avant le schema.
      locale: z.enum(LOCALES).catch(LOCALE_DEFAUT),
    })
    .refine((data) => data.phone.trim() !== "" || data.email.trim() !== "", {
      message: t.contact,
      path: ["phone"],
    });
}

/**
 * LES DEUX SCHEMAS SONT BATIS UNE FOIS, AU CHARGEMENT DU MODULE, et non a
 * chaque requete : ils ne dependent que d une table de chaines constante. En
 * fabriquer un par POST serait du travail refait a l identique des milliers de
 * fois pour un objet qui ne change jamais.
 */
const SCHEMAS: Record<Locale, ReturnType<typeof construireSchema>> = {
  fr: construireSchema(MESSAGES.fr),
  en: construireSchema(MESSAGES.en),
};

export async function POST(req: Request) {
  let brut: unknown;
  try {
    brut = await req.json();
  } catch {
    // Corps illisible : rien a lire, donc pas de langue. Le francais par
    // defaut — un corps illisible ne vient jamais du formulaire du site.
    return NextResponse.json({ ok: false, error: MESSAGES.fr.illisible }, { status: 400 });
  }

  // 0. La langue. Avant le leurre, mais ce n est pas une etape de plus dans
  //    l ordre ci-dessus : elle ne decide rien, elle habille ce qui suit.
  const locale = localeDuCorps(brut);
  const t = MESSAGES[locale];

  // 1. Leurre. Un humain ne voit pas ce champ ; un bot le remplit.
  //    Reponse volontairement indiscernable d un succes.
  const website = (brut as { website?: unknown } | null)?.website;
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 2. Schema.
  const analyse = SCHEMAS[locale].safeParse(brut);
  if (!analyse.success) {
    return NextResponse.json(
      {
        ok: false,
        error: t.invalide,
        issues: analyse.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }
  const { name, phone, email, message, subject } = analyse.data;
  // Une chaine vide n est pas un sujet : elle devient null, comme `email`
  // juste en dessous. Un champ vide en base se lit tout de suite comme
  // « on ne sait pas » ; une chaine vide se lit comme un bug.
  const sujet = subject?.trim() ? subject.trim() : null;

  // 3. Limitation de debit, sur IP hachee.
  const ipHash = hashIp(clientIp(req.headers));
  const depuis = new Date(Date.now() - FENETRE_MS);
  const recentes = await prisma.rateLimit.count({
    where: { ipHash, action: ACTION, createdAt: { gt: depuis } },
  });
  if (recentes >= MAX_PAR_FENETRE) {
    return NextResponse.json({ error: t.debit }, { status: 429 });
  }
  await prisma.rateLimit.create({ data: { ipHash, action: ACTION } });

  // 4. Le lead. `phone` ET `email` sont optionnels en base (String?) : une
  //    chaine vide devient null plutot que d y etre ecrite — le refine du
  //    schema garantit deja qu au moins l un des deux est renseigne.
  //    LE TELEPHONE A REJOINT L E-MAIL AU BLOC B13. Il etait NOT NULL alors
  //    que le formulaire dit « telephone OU e-mail » : une demande laissee
  //    avec le seul e-mail ecrivait "" en base, et /admin en tirait un lien
  //    wa.me vers un numero inexistant. On ecrit maintenant ce qu on sait, et
  //    rien quand on ne sait pas.
  await prisma.lead.create({
    data: {
      name,
      phone: phone.trim() === "" ? null : phone,
      email: email.trim() === "" ? null : email,
      source: "FORM",
      status: "NEW",
      needSummary: message,
      subject: sujet,
    },
  });

  // 5. Notification. notifyTelegram ne jette deja pas ; ce try/catch est la
  //    ceinture par-dessus les bretelles : sous aucun pretexte cette ligne ne
  //    doit transformer un lead enregistre en erreur 500.
  const extrait =
    message.length > EXTRAIT_MAX ? `${message.slice(0, EXTRAIT_MAX)}…` : message;
  // notifyTelegram (lib/telegram.ts) ne prend qu un texte libre : l e-mail
  // s ajoute donc ici a la ligne de contact, sans toucher ce fichier.
  const contact = [phone.trim(), email.trim()].filter(Boolean).join(" · ");
  // LE SUJET PART DANS LA NOTIFICATION, PAS SEULEMENT EN BASE. C est la seule
  // ligne qu Ayoub lit sur son telephone avant de rappeler : savoir que la
  // demande vient de « devis-studio » change ce qu il prepare avant de decrocher.
  // Il ne s ecrit que s il existe — pas de « sujet : — » sur les demandes
  // spontanees.
  const objet = sujet ? ` [${sujet}]` : "";
  try {
    await notifyTelegram(`🆕 Lead FORM${objet} — ${name}, ${contact} : ${extrait}`);
  } catch {
    console.warn("[contact] notification Telegram en échec — lead enregistré malgré tout");
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
