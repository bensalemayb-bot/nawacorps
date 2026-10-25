/**
 * LES GUIDES — le registre unique des pages de contenu de /guides.
 *
 * POURQUOI CES PAGES (demande d Ayoub du 25 octobre 2026). Les moteurs et les
 * assistants de recherche (ChatGPT, Perplexity, les apercus IA de Google,
 * Claude) citent des pages qui repondent a une question precise, de facon
 * datee, signee et sourcee. Ces quatre guides repondent aux questions qu un
 * patron de PME genevoise pose avant d acheter : qu est-ce que c est, est-ce
 * que ca remplace une secretaire, combien ca coute, et ou vont mes donnees.
 *
 * CE FICHIER EST LA SOURCE DES SLUGS, DES TITRES ET DES DATES. Le hub
 * (/guides), le maillage entre guides et le JSON-LD `Article` lisent ici. Un
 * autre chantier reporte les memes slugs dans app/sitemap.ts et llms.txt : LES
 * SLUGS NE CHANGENT PAS sans corriger ces deux fichiers le meme jour.
 *
 * FRANCAIS SEULEMENT. Aucune jumelle anglaise : `/guides` n est pas dans
 * `CHEMINS_TRADUITS` (lib/i18n.ts), donc `alternatesPage` n annonce que la
 * canonique, aucun `hreflang` — jamais un `en-CH` qui repondrait 404, et pas
 * de groupe d une seule langue (audit SEO v5).
 *
 * LES DATES SONT DES DATES DE CONTENU, pas de build : on ne change
 * `misAJour` que le jour ou le texte change vraiment. Une date qui bouge a
 * chaque deploiement serait une indication fausse au lecteur comme au moteur.
 */

/** Le chemin du hub, sans prefixe de langue. */
export const CHEMIN_GUIDES = "/guides";

export type Guide = {
  slug: string;
  /** Le titre de la carte du hub et du fil d Ariane. */
  titre: string;
  /** Deux lignes, sur la carte du hub et dans l `ItemList`. */
  resume: string;
  /** `<title>`, 60 signes au plus, mot-cle compris. */
  seoTitre: string;
  /** Meta description, 155 signes au plus. */
  seoDescription: string;
  /** AAAA-MM-JJ. */
  publie: string;
  /** AAAA-MM-JJ. */
  misAJour: string;
};

export const GUIDES: readonly Guide[] = [
  {
    slug: "automatisation-ia-pme-geneve",
    titre: "L'automatisation par l'IA dans une PME genevoise",
    resume:
      "Ce qu'un assistant IA peut reprendre au bureau, ce qu'il ne doit jamais faire seul, comment ça se passe et combien ça coûte.",
    seoTitre: "Automatisation IA pour PME à Genève : le guide",
    seoDescription:
      "Ce que l'IA peut reprendre au bureau d'une PME genevoise, ce qu'elle ne doit pas faire seule, les étapes, les prix et les risques. Guide mis à jour.",
    publie: "2026-10-25",
    misAJour: "2026-10-25",
  },
  {
    slug: "assistant-ia-ou-secretaire",
    titre: "Assistant IA ou secrétaire : que choisir ?",
    resume:
      "Secrétaire à temps partiel, assistant IA, logiciel, agence ou rien : le coût, la disponibilité et les limites de chaque option.",
    seoTitre: "Assistant IA ou secrétaire : le comparatif pour PME",
    seoDescription:
      "Secrétaire à temps partiel, assistant IA, logiciel métier, agence ou rien : coût, soirs et week-ends, limites. Un comparatif honnête pour PME genevoises.",
    publie: "2026-10-25",
    misAJour: "2026-10-25",
  },
  {
    slug: "prix-assistant-ia-suisse",
    titre: "Combien coûte un assistant IA pour une PME en Suisse ?",
    resume:
      "Ce qui fait le prix, les fourchettes relevées en Suisse romande, nos prix écrits, et les pièges à repérer avant de signer.",
    seoTitre: "Prix d'un assistant IA pour PME en Suisse (2026)",
    seoDescription:
      "Mise en place, abonnement, volume, téléphone, hébergement : ce qui fait le prix d'un assistant IA en Suisse romande, les fourchettes et les pièges.",
    publie: "2026-10-25",
    misAJour: "2026-10-25",
  },
  {
    slug: "ia-et-protection-des-donnees",
    titre: "IA et protection des données : ce que la nLPD demande à une PME",
    resume:
      "Qui est responsable, quand les données partent à l'étranger, quoi dire à vos clients, et les huit questions à poser à un prestataire.",
    seoTitre: "IA et protection des données (nLPD) : guide PME",
    seoDescription:
      "Assistant IA et nLPD : qui est responsable, sous-traitance (art. 9), transferts à l'étranger, information des clients, et 8 questions à poser.",
    publie: "2026-10-25",
    misAJour: "2026-10-25",
  },
];

/** Le chemin d un guide, sans prefixe de langue. */
export function cheminGuide(slug: string): string {
  return `${CHEMIN_GUIDES}/${slug}`;
}

/** Le guide d un slug. Leve si le slug est inconnu : c est une faute de code. */
export function guide(slug: string): Guide {
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) throw new Error(`Guide inconnu : ${slug}`);
  return g;
}

const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/**
 * « 2026-10-25 » -> « 25 octobre 2026 ». Ecrit a la main plutot qu avec
 * `Intl` : le rendu doit etre identique au caractere pres sur le serveur et
 * dans le navigateur, quelle que soit l ICU embarquee.
 */
export function dateLisible(iso: string): string {
  const [a, m, j] = iso.split("-").map(Number);
  return `${j} ${MOIS[m - 1]} ${a}`;
}

/**
 * L AUTEUR DES GUIDES. Le meme `@id` que le noeud Person de /studio
 * (components/SchemaStudio.tsx) : un seul Ayoub Bensalem pour tout le site.
 */
export const AUTEUR = {
  nom: "Ayoub Bensalem",
  role: "fondateur de Nawa Corps, Genève",
  chemin: "/studio",
} as const;

/**
 * LE RELEVE DU MARCHE ROMAND, une seule fois pour tous les guides.
 *
 * Source : founder/competitors-suisse-2026-10.md, pages publiques d agences
 * et d editeurs actifs en Suisse, lues le 25 octobre 2026. Prix tels
 * qu affiches (souvent hors taxe, souvent « dès »). AUCUN CONCURRENT N EST
 * NOMME sur le site (decision d Ayoub) : les guides donnent la fourchette,
 * jamais le nom derriere un chiffre.
 *
 * La mise en place va de 600 (atelier d entree) a 3'900 (offre complete) :
 * c est l amplitude reellement relevee, plus large que le « 600 a 3'500 »
 * de la consigne de depart. Le mensuel va de 90 a 799.
 */
export const RELEVE_MARCHE = {
  date: "2026-10-25",
  miseEnPlaceMin: "600",
  miseEnPlaceMax: "3'900",
  mensuelMin: "90",
  mensuelMax: "799",
} as const;
