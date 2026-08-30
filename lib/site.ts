/**
 * IDENTITE DU SITE — source unique de verite pour tout ce qui est « la marque
 * vue de l exterieur » : URL publique, coordonnees, horaires, langues.
 *
 * Pourquoi ce fichier existe. Avant lui, le numero de telephone etait ecrit
 * QUATRE fois (deux href WhatsApp, un href tel:, un libelle affiche), l adresse
 * e-mail deux fois, et le nom legal une fois de plus dans les mentions
 * legales — tous en placeholder. Le jour ou les vraies valeurs arrivent, il
 * faut pouvoir les poser a UN endroit, pas partir a la chasse.
 *
 * Ce n est pas de la cosmetique : pour un commerce local, la coherence du
 * triplet nom / adresse / telephone (le « NAP ») est le premier signal de
 * referencement local. Deux variantes du meme numero sur deux pages suffisent
 * a brouiller le rapprochement avec la fiche Google.
 *
 * NAP_CONFIRME EST LE VERROU. Tant qu il vaut false, le JSON-LD n emet NI
 * telephone, NI e-mail, NI adresse postale. Declarer a Google un numero
 * invente est pire que de ne rien declarer : c est une donnee structuree
 * fausse, et elle se propage. Passer le drapeau a true est la DERNIERE chose
 * a faire avant la mise en ligne, une fois les valeurs ci-dessous reelles.
 */

/**
 * URL publique, sans slash final.
 *
 * Lue depuis l environnement pour que la meme image Docker serve la preview et
 * la production. Le repli sur localhost n est pas un defaut deguise : il vaut
 * en developpement, ou NEXT_PUBLIC_SITE_URL n est pas toujours defini, et
 * evite que `next build` echoue sur un `new URL(undefined)`.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

/** Nom de marque. Le nom LEGAL, lui, vit dans les mentions legales. */
export const SITE_NAME = "Nawa Corps";

/**
 * VERROU DU NAP — voir le docblock d en-tete.
 * Passer a true UNIQUEMENT quand telephone, e-mail et adresse sont reels.
 */
export const NAP_CONFIRME = false;

/**
 * Coordonnees. Valeurs de remplacement tant que NAP_CONFIRME vaut false ;
 * elles restent affichees a l ecran (la maquette a besoin d un numero pour
 * tenir sa mise en page) mais ne partent JAMAIS en donnee structuree.
 */
export const CONTACT = {
  /** Format E.164, sans espaces — pour href="tel:" et pour schema.org. */
  telephone: "+41760000000",
  /** Le meme numero, mis en forme pour l oeil. */
  telephoneAffiche: "+41 76 000 00 00",
  /** Numero WhatsApp, sans le « + » : wa.me n en veut pas. */
  whatsapp: "41760000000",
  email: "hello@nawacorps.ch",
  ville: "Genève",
  region: "Genève",
  pays: "CH",
} as const;

/**
 * Lien WhatsApp, avec message pre-rempli optionnel.
 *
 * Le site compte NEUF liens WhatsApp, chacun avec sa propre phrase d amorce
 * (« refaire la carte », « le pack complet m interesse »…). Ces phrases sont
 * editoriales et doivent rester distinctes ; c est le NUMERO qui ne doit
 * exister qu une fois. D ou cette fonction plutot qu une constante : elle
 * centralise le seul fragment qui ne varie pas.
 *
 * `encodeURIComponent` remplace les sequences pourcent ecrites a la main dans
 * la maquette. Meme resultat, mais la phrase redevient lisible a la relecture.
 */
export function whatsapp(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Le lien par defaut : les deux CTA principaux du hero et du pied de page. */
export const WHATSAPP_HREF = whatsapp("Bonjour, j'aimerais faire refaire le site de mon entreprise.");

/**
 * Horaires — « Lu–Sa · 9h–19h », tels qu affiches en pied de page.
 * Format schema.org : jours en anglais abrege, heures en 24 h.
 */
export const HORAIRES = {
  jours: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  ouverture: "09:00",
  fermeture: "19:00",
} as const;

/** Langues de travail, annoncees dans la section « Le studio ». */
export const LANGUES = ["fr", "en"] as const;

/** Annee de fondation. Sert au foundingDate du JSON-LD ; le hero ne
 *  l affiche plus depuis le repositionnement PME (voir .agents/product-marketing.md). */
export const FONDE_EN = "2026";

/**
 * Fabrique un bloc Open Graph complet pour une page.
 *
 * POURQUOI UNE FONCTION plutot que l heritage. Next fusionne les metadata
 * champ par champ, mais SANS descendre dans les objets : une page qui declare
 * son propre `openGraph` REMPLACE integralement celui du layout, elle n en
 * herite pas les cles manquantes. Ecrire seulement `openGraph: { url }` dans
 * une page legale lui ferait donc perdre siteName, locale et type.
 *
 * Sans ce bloc, l inverse se produisait : les pages legales gardaient
 * l Open Graph de l accueil en entier — titre de l accueil et surtout og:url
 * pointant vers « / ». Partager /confidentialite affichait la carte de la page
 * d accueil.
 */
export function openGraphPage(page: {
  titre: string;
  description: string;
  chemin: string;
}) {
  return {
    type: "website" as const,
    locale: "fr_CH",
    siteName: SITE_NAME,
    url: page.chemin,
    title: page.titre,
    description: page.description,
  };
}

/**
 * Serialisation JSON-LD.
 *
 * `<` devient son echappement unicode : JSON.stringify ne neutralise pas les
 * balises, et une chaine venant de la base (le nom d un service, sa
 * description) traverse ce script tel quel. C est la parade documentee par
 * Next — voir node_modules/next/dist/docs/01-app/02-guides/json-ld.md.
 */
export function jsonLd(donnees: object): string {
  return JSON.stringify(donnees).replace(/</g, "\\u003c");
}
