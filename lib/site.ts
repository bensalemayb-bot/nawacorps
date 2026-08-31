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
 * FAUX, corrige : ce fichier disait que la variable etait « lue depuis l
 * environnement pour que la meme image Docker serve la preview et la
 * production ». Les variables NEXT_PUBLIC_* sont INLINEES AU BUILD par
 * `next build`, pas lues au demarrage du conteneur — voir
 * node_modules/next/dist/docs/01-app/02-guides/environment-variables.md,
 * autour de la ligne 164. Une image compilee avec une valeur ne peut pas en
 * servir une autre au runtime : l image devient propre a UN domaine, et c est
 * le prix a payer pour des canoniques, un sitemap et un JSON-LD corrects.
 *
 * Le repli sur localhost reste utile en developpement (ou la variable n est
 * pas toujours definie), mais en production il transformait un oubli de
 * configuration en erreur invisible — d ou le garde-fou ci-dessous.
 */
const brut = process.env.NEXT_PUBLIC_SITE_URL;
if (!brut && process.env.NODE_ENV === "production") {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL manquante : le build produirait des canoniques, un sitemap et un JSON-LD pointant vers localhost.",
  );
}
export const SITE_URL = (brut || "http://localhost:3000").replace(/\/$/, "");

/** Nom de marque. Le nom LEGAL, lui, vit dans les mentions legales. */
export const SITE_NAME = "Nawa Corps";

/**
 * VERROU DU NAP — OUVERT le 30 aout 2026.
 *
 * Les coordonnees ci-dessous sont reelles : elles ont ete fournies par Ayoub
 * Bensalem lui-meme. Le telephone, l e-mail et la localite partent donc
 * desormais en donnee structuree, ce qui rend la fiche eligible au pack local
 * et au rapprochement avec la fiche Google.
 *
 * Le refermer si une coordonnee redevient incertaine : une donnee structuree
 * fausse se propage et se corrige mal.
 */
export const NAP_CONFIRME = true;

/**
 * Coordonnees REELLES.
 *
 * Pas d adresse postale de rue : le studio n a pas de bureau, et c est assume
 * (cf. .agents/product-marketing.md §1). L adresse reste donc au niveau de la
 * localite — Geneve, GE, CH. Inventer une rue pour « faire serieux » serait
 * exactement la donnee fausse que ce verrou existe pour empecher.
 */
export const CONTACT = {
  /** Format E.164, sans espaces — pour href="tel:" et pour schema.org. */
  telephone: "+41789124035",
  /** Le meme numero, mis en forme pour l oeil. */
  telephoneAffiche: "+41 78 912 40 35",
  /** Numero WhatsApp, sans le « + » : wa.me n en veut pas. */
  whatsapp: "41789124035",
  /** Boite d Ayoub : c est elle qui recoit les demandes de projet. */
  email: "ayoub@nawacorps.ch",
  /**
   * Boite generale. Sert aux questions qui ne sont pas une demande de projet :
   * exercice des droits nLPD, mentions legales, sollicitations diverses.
   * Les separer evite qu une demande client se perde dans le tout-venant.
   */
  emailGeneral: "contact@nawacorps.ch",
  ville: "Genève",
  region: "Genève",
  pays: "CH",
} as const;

/**
 * Lien WhatsApp, avec message pre-rempli optionnel.
 *
 * Le site multiplie les amorces WhatsApp — le hero, le pied de page, la carte
 * du studio, le menu, chaque formule (lib/formules.ts), chaque famille de
 * prestations (lib/familles.ts), le chatbot — et chacune porte sa propre phrase
 * (« je souhaite faire refaire le site de mon entreprise », « l Assistant m
 * interesse »…). LEUR NOMBRE N EST PAS ECRIT ICI, DELIBEREMENT : ce commentaire
 * a annonce « neuf » jusqu a ce que formules.ts, familles.ts et les pages de
 * prestations le rendent faux, et il redeviendra faux a la prochaine page. Ces
 * phrases sont editoriales et doivent rester distinctes ; c est le NUMERO qui
 * ne doit exister qu une fois. D ou cette fonction plutot qu une constante :
 * elle centralise le seul fragment qui ne varie pas.
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
 *
 * L IMAGE EST ICI POUR LA MEME RAISON, et c est ce qui manquait.
 * `app/(site)/opengraph-image.tsx` genere bien une image, mais une convention
 * de fichier ne survit pas a un `openGraph` explicite : elle ne s appliquait
 * donc qu a l accueil — la SEULE page qui ne declare pas le sien. Releve du
 * 31 aout 2026 : og:image present sur 1 page sur 14. Les 13 autres se
 * partageaient sans apercu, alors meme que le layout annonce
 * `twitter: { card: "summary_large_image" }`, qui reserve un grand
 * emplacement d image — vide.
 *
 * POURQUOI UN FICHIER STATIQUE et non la route generee : Next sert la
 * convention de fichier sous un chemin hache (`/opengraph-image-12o0cb?...`)
 * qui change au moindre recalcul ; `/opengraph-image` repond 404. Un helper
 * partage ne peut pas dependre d une URL instable. `og-nawa-corps.png` est
 * donc le rendu de cette meme image, fige dans /public : meme visuel, chemin
 * stable, et un seul fichier a remplacer le jour ou une vraie photographie
 * prend sa place.
 *
 * URL ABSOLUE OBLIGATOIRE : plusieurs robots sociaux refusent une og:image
 * relative.
 */
export const OG_IMAGE = `${SITE_URL}/brand/og-nawa-corps.png`;

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
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — studio de création digitale à Genève`,
      },
    ],
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
