import type { Metadata } from "next";
import { LOCALE_DEFAUT, LANGUE_HTML, type Locale, estTraduit, lien } from "@/lib/i18n";

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
  /**
   * L ADRESSE UNIQUE DU SITE, depuis le 25 octobre 2026.
   *
   * Il en existait deux : ayoub@ (pied de page, menu, /contact, JSON-LD) et
   * contact@ (mentions legales, confidentialite, exercice des droits). Deux
   * adresses pour un exploitant seul obligeaient le visiteur a choisir, et la
   * LCD (art. 3 al. 1 let. s) demande UNE adresse de contact directe et
   * fiable. Depuis le 26.10.2026, c est info@ (decision d Ayoub) : les
   * anciennes adresses contact@ et ayoub@ doivent rediriger vers elle chez
   * l hebergeur de la messagerie, sinon un e-mail ecrit sur une ancienne page
   * en cache se perd.
   */
  email: "info@nawacorps.ch",
  /**
   * LA LOCALITE DU NAP. Elle s ecrit « Genève », et cette graphie-la est la
   * seule que voient les donnees structurees — voir `villeEn` juste dessous.
   */
  ville: "Genève",
  /**
   * LA LOCALITE POUR LA PROSE ANGLAISE, ET RIEN D AUTRE.
   *
   * Elle existe parce qu une page anglaise qui ecrit « Genève » au milieu d une
   * phrase anglaise change de langue en cours de route. Mais elle ne doit
   * JAMAIS remplacer `ville` dans un JSON-LD ni dans un `areaServed` : le
   * docblock de CONTACT ci-dessus dit pourquoi — ce triplet est du NAP, et
   * DEUX GRAPHIES DE LA MEME LOCALITE BROUILLENT LE RAPPROCHEMENT AVEC LA
   * FICHE GOOGLE. Un moteur qui lit « Geneva » sur la version anglaise et
   * « Genève » sur la francaise voit deux etablissements possibles la ou il
   * n y en a qu un.
   *
   * Donc : `villeEn` pour ce qu un humain lit ; `ville` partout ou la valeur
   * part en donnee structuree, dans les deux langues. `region` et `pays` n ont
   * pas de jumeau anglais pour la meme raison — ils ne servent qu au JSON-LD.
   *
   * ELLE N ETAIT LUE PAR PERSONNE jusqu au 31 aout 2026 : les pages anglaises
   * ecrivaient « Geneva » en dur, et une constante que rien n appelle finit par
   * diverger de l usage sans que personne s en apercoive. Son premier lecteur
   * est components/Studio.tsx, ou la bande de faits affiche la localite du
   * studio — la, et pas dans le JSON-LD de la meme page, qui garde `ville`.
   */
  villeEn: "Geneva",
  region: "Genève",
  pays: "CH",
} as const;

/**
 * L EXPLOITANT — l identite JURIDIQUE, distincte du NAP ci-dessus.
 *
 * Lue par /mentions-legales, /confidentialite et /cgv, dans les deux langues.
 * Elle ne part JAMAIS en donnee structuree : le JSON-LD reste au niveau de la
 * localite (voir le docblock de CONTACT), et NAP_CONFIRME ne la concerne pas.
 *
 * POURQUOI UNE ADRESSE POSTALE COMPLETE ICI, alors que CONTACT n en a pas.
 * La LCD (art. 3 al. 1 let. s ch. 1) impose a qui vend par voie electronique
 * d indiquer « son identite et son adresse » de facon claire et complete —
 * la localite seule ne suffit pas. Le studio n a pas de bureau : c est donc
 * l adresse de domicile ou une adresse de domiciliation qui doit figurer ici.
 * Elle n est PAS inventee : Ayoub l a fournie le 25.10.2026 (Promenade de
 * l Europe 17, NPA 1203, quartier des Charmilles).
 *
 * Raison individuelle non inscrite au registre du commerce (CA < 100'000.–,
 * ORC art. 36) et non assujettie a la TVA (LTVA art. 10 al. 2 let. a) :
 * aucun numero IDE/UID ni numero de TVA n est donc affiche, parce qu il n en
 * existe pas.
 */
export const EXPLOITANT = {
  titulaire: "Ayoub Bensalem",
  nomCommercial: SITE_NAME,
  adresse: "Promenade de l'Europe 17, 1203 Genève, Suisse",
  adresseEn: "Promenade de l'Europe 17, 1203 Geneva, Switzerland",
} as const;

/**
 * Lien WhatsApp, avec message pre-rempli optionnel.
 *
 * Le site porte plusieurs amorces WhatsApp — le pied de page, le menu,
 * /contact, /devis (lib/devis.ts), le chatbot — et chacune peut porter sa
 * propre phrase. LEUR NOMBRE N EST PAS ECRIT ICI, DELIBEREMENT : il devient
 * faux a la prochaine page. Ces phrases sont editoriales ; c est le NUMERO qui
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

/**
 * L AMORCE PAR DEFAUT, DANS LES DEUX LANGUES.
 *
 * `whatsapp()` reste volontairement sans langue : c est l appelant qui ecrit sa
 * phrase (lib/devis.ts a la sienne). Celle-ci est la plus visible : le CTA du
 * pied de page, rendu sur toutes les pages, dans les deux langues.
 *
 * DEPUIS LE 24 OCTOBRE 2026 ELLE DEMANDE LA DEMO, comme tout le site : c est
 * l amorce de docs/agents/copy/contact.md, mot pour mot.
 */
const AMORCE_DEFAUT: Record<Locale, string> = {
  fr: "Bonjour, j'aimerais une démo de l'assistant sur mon métier.",
  en: "Hello, I'd like a demo of the assistant on my trade.",
};

/**
 * Le lien par defaut : le CTA WhatsApp du pied de page.
 *
 * LA LANGUE EST OPTIONNELLE ET VAUT « fr » : un appelant qui ne la passe pas
 * obtient exactement l URL qu il obtenait avant, au caractere pres.
 */
export function whatsappHref(locale: Locale = LOCALE_DEFAUT): string {
  return whatsapp(AMORCE_DEFAUT[locale]);
}

/**
 * L ANCIENNE FORME, SANS LANGUE — conservee pour les appelants qui vivent hors
 * de ce chantier. Elle est DERIVEE de `whatsappHref` et non recopiee : les deux
 * ne peuvent pas diverger. Tout nouveau code appelle `whatsappHref(locale)`.
 */
export const WHATSAPP_HREF = whatsappHref();

/**
 * Horaires — « Lu–Sa · 9h–19h », tels qu affiches en pied de page.
 * Format schema.org : jours en anglais abrege, heures en 24 h.
 */
export const HORAIRES = {
  jours: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  ouverture: "09:00",
  fermeture: "19:00",
} as const;

/**
 * PROFILS PUBLICS (`sameAs` du JSON-LD).
 *
 * `sameAs` dit au moteur « cette entite est aussi celle-la » : c est ce qui
 * relie le site a la fiche Google et a un profil LinkedIn, et ce qui aide le
 * pack local a reconnaitre le meme etablissement partout. Mais un lien vers une
 * fiche qui n existe pas encore est une donnee fausse, et un moteur qui suit un
 * 404 ne fait plus confiance au reste du bloc.
 *
 * On ne colle donc ici qu une URL publique qui existe : `studio` sort dans le
 * ProfessionalService (components/SchemaStudio.tsx), `ayoub` dans le Person de
 * /studio. Tant qu une liste est vide, la propriete n est pas emise du tout.
 * Les deux pages LinkedIn existent depuis le 26.10.2026 ; la fiche Google
 * s y ajoutera une fois validee par Google (avant, elle n est pas publique).
 */
export const SAME_AS: { studio: readonly string[]; ayoub: readonly string[] } = {
  studio: ["https://www.linkedin.com/company/nawacorps/"],
  ayoub: ["https://www.linkedin.com/in/ayoub-bensalem-4a8032292/"],
};

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

/**
 * `og:locale` — le meme couple langue/region que `<html lang>`, ecrit avec le
 * separateur d Open Graph.
 *
 * Open Graph veut un underscore (`fr_CH`), HTML et hreflang veulent un tiret
 * (`fr-CH`). C est la SEULE difference, et elle se derive : ecrire les deux
 * tables a la main serait se donner deux occasions de diverger.
 */
const OG_LOCALE: Record<Locale, string> = {
  fr: LANGUE_HTML.fr.replace("-", "_"),
  en: LANGUE_HTML.en.replace("-", "_"),
};

/**
 * @param locale la langue de la page. LE PARAMETRE EST OPTIONNEL ET VAUT
 *   `"fr"` PAR DEFAUT : les seize pages existantes appellent cette fonction
 *   sans lui, et elles doivent continuer a rendre exactement le meme objet
 *   qu avant — `lien("fr", chemin)` rend `chemin` inchange, et `OG_LOCALE.fr`
 *   vaut « fr_CH ». Aucune de ces pages n a a etre touchee.
 * @param page.chemin le chemin SANS prefixe de langue (`/studio`), jamais
 *   `/en/studio` : c est cette fonction qui pose le prefixe.
 */
export function openGraphPage(
  page: {
    titre: string;
    description: string;
    chemin: string;
  },
  locale: Locale = LOCALE_DEFAUT,
) {
  return {
    type: "website" as const,
    locale: OG_LOCALE[locale],
    siteName: SITE_NAME,
    url: lien(locale, page.chemin),
    title: page.titre,
    description: page.description,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        // L alt voyage avec l image de partage sur les reseaux : il est LU par
        // les lecteurs d ecran et indexe. Le laisser francais sur une page
        // anglaise decrit l entreprise dans une langue que le lecteur n a pas
        // choisie.
        alt:
          locale === "en"
            ? `${SITE_NAME} — assistants for Geneva small businesses`
            : `${SITE_NAME} — assistants pour les PME genevoises`,
      },
    ],
  };
}

/**
 * CANONIQUE ET `hreflang` D UNE PAGE, dans les deux langues.
 *
 * A QUOI SERT `hreflang`, ET POURQUOI C EST LA PIECE QUI MANQUAIT. Deux pages
 * qui disent la meme chose dans deux langues se font concurrence : le moteur
 * doit choisir laquelle indexer, et il peut choisir la mauvaise, ou n en garder
 * qu une. `hreflang` lui dit que ce sont deux versions d UNE page, pas deux
 * pages — chacune est alors servie a son public, et l anciennete de la version
 * francaise profite a l anglaise. Sans lui, la page anglaise part de zero et,
 * au pire, prend la place de la francaise sur une requete francophone.
 *
 * LES TROIS DECLARATIONS, et pourquoi il en faut trois :
 *  - `fr-CH` — la version francaise. Chaque page se declare ELLE-MEME en plus
 *    de declarer sa jumelle : c est ce que demande la documentation de Google,
 *    et une page qui ne s auto-declare pas voit son groupe hreflang ignore.
 *  - `en-CH` — la version anglaise. Anglais DE SUISSE, pas anglais du
 *    Royaume-Uni : la page s adresse aux anglophones de Geneve.
 *  - `x-default` — la version servie a qui ne correspond a aucune des deux.
 *    Elle pointe sur le FRANCAIS : le marche est genevois, le francais est la
 *    langue du canton, c est le repli le plus juste.
 *
 * `en-CH` N EST DECLARE QUE SI LA PAGE ANGLAISE EXISTE VRAIMENT. La liste
 * `CHEMINS_TRADUITS` (lib/i18n.ts) tranche, et c est la garde la plus
 * importante de ce helper : annoncer une jumelle qui repond 404 est PIRE que
 * de ne rien annoncer — Google cesse alors d associer les deux versions, et le
 * groupe entier est ignore. Le jour ou une page est traduite, on l ajoute a
 * cette liste et les `hreflang` suivent, ici comme dans le sitemap.
 *
 * UNE PAGE NON TRADUITE (les guides) NE PORTE AUCUN `hreflang`, seulement sa
 * canonique (audit SEO v5, 25.10.2026). Elle annoncait `fr-CH` + `x-default`
 * vers elle-meme, alors que app/sitemap.ts ne lui en donne aucun : deux canaux
 * qui se contredisent, pour un groupe d une seule langue qui ne dit rien a
 * personne. Les deux canaux disent maintenant la meme chose : rien.
 *
 * LES URL SONT RELATIVES, et c est volontaire : `metadataBase` (declaree dans
 * app/(site)/layout.tsx) les rend absolues au rendu. Ecrire SITE_URL ici
 * doublerait le domaine le jour ou il change.
 *
 * @param chemin le chemin SANS prefixe de langue — `/studio`, jamais
 *   `/en/studio`. `cheminSansLocale()` (lib/i18n.ts) rend cette forme-la
 *   depuis n importe quel chemin.
 * @param locale la langue de la page qui appelle. Elle ne change QUE la
 *   canonique : les `languages` sont les memes des deux cotes, par definition.
 */
export function alternatesPage(
  chemin: string,
  locale: Locale = LOCALE_DEFAUT,
): NonNullable<Metadata["alternates"]> {
  if (!estTraduit(chemin)) return { canonical: lien(locale, chemin) };

  const versionFr = lien("fr", chemin);
  // Le type vient de Next lui-meme plutot que d un Record<string, string> : il
  // n accepte que de vrais codes hreflang, et il refuserait donc une coquille
  // comme « fr_CH » ou « x-defaut ».
  const languages: NonNullable<NonNullable<Metadata["alternates"]>["languages"]> = {
    "fr-CH": versionFr,
    "en-CH": lien("en", chemin),
    "x-default": versionFr,
  };

  return { canonical: lien(locale, chemin), languages };
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
