import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { estTraduit, lien } from "@/lib/i18n";
import { CHEMIN_DEMONSTRATIONS } from "@/lib/automatisations";
import { CHEMIN_METIERS, METIERS, cheminMetier } from "@/lib/metiers";
import { cgvEstBrouillon } from "./(site)/cgv/page";
import { BROUILLON as CONFIDENTIALITE_BROUILLON } from "./(site)/confidentialite/page";
import { BROUILLON as CONFIDENTIALITE_EN_BROUILLON } from "./(site)/en/confidentialite/page";
import { BROUILLON as MENTIONS_EN_BROUILLON } from "./(site)/en/mentions-legales/page";
import { BROUILLON as MENTIONS_BROUILLON } from "./(site)/mentions-legales/page";

/**
 * sitemap.xml, genere.
 *
 * L accueil, la page de detail de l assistant (/services), le hub des metiers
 * (/metiers) et une page par metier (/metiers/<slug>, lib/metiers.ts), la
 * demande de demo (/devis), le studio, le contact, les trois pages legales (mentions,
 * confidentialite, CGV) — ces trois-la seulement quand elles ne portent plus
 * aucun marqueur de brouillon (`brouillon`, plus bas) — et les exemples
 * d automatisation par metier (/demonstrations), revenus le 25 octobre 2026.
 * Les pages de l ancienne offre (`/services/<slug>`) en sont sorties le
 * 24 octobre 2026 : elles redirigent vers l accueil (next.config.ts), et un
 * plan qui annonce une redirection apprend au moteur a ne plus le croire.
 *
 * `lastModified` EST UNE DATE FIXE PAR PAGE, ecrite a la main dans `PAGES`
 * (audit CRO/SEO du 25.10.2026). C etait `new Date()` au chargement du
 * module : les routes du site etant dynamiques, la date changeait a chaque
 * lecture du plan, et une date qui bouge a chaque appel apprend au moteur a ne
 * plus la croire. QUI MODIFIE LE CONTENU D UNE PAGE MET SA DATE A JOUR ICI.
 *
 * QUAND DE NOUVELLES PAGES ARRIVERONT, elles se listent ici — c est le seul
 * endroit a modifier.
 *
 * LES ENTREES SONT DES CHEMINS, PLUS DES URL ABSOLUES. Elles s ecrivaient
 * `${SITE_URL}/services` ; elles s ecrivent `/services`, et c est la fonction
 * `bilingue` plus bas qui prefixe le domaine et la langue. Le sitemap doit
 * desormais fabriquer TROIS choses a partir d un meme chemin — l URL francaise,
 * l URL anglaise et les `hreflang` qui les relient — et les fabriquer a partir
 * d une URL absolue aurait demande de la decouper pour la recomposer.
 */
/** Une page du plan, dans sa forme francaise et sans domaine. */
type Entree = {
  /** Le chemin SANS prefixe de langue : `/services`, jamais `/en/services`. */
  chemin: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  /** Derniere modification reelle du contenu, `AAAA-MM-JJ`. */
  modifie: string;
  /**
   * Vrai tant que la page (francaise OU anglaise) porte un marqueur
   * « [À COMPLÉTER] » / « [À VÉRIFIER] » : elle est alors en `noindex` et
   * sort du plan, les deux langues ensemble — un couple hreflang dont une
   * moitie est en noindex ne forme plus un groupe. Calcule par la page meme
   * (lib/brouillon.ts) : l entree revient seule quand le marqueur part.
   */
  brouillon?: boolean;
};

/**
 * UNE ENTREE DEVIENT UNE OU DEUX URL, selon que sa page anglaise existe.
 *
 * CE QUE `alternates.languages` FAIT ICI. Chaque `<url>` du plan porte des
 * balises `<xhtml:link rel="alternate" hreflang="…">` qui pointent vers les
 * autres versions de la MEME page. C est le second canal — avec les `<link>`
 * du `<head>`, poses par `alternatesPage` (lib/site.ts) — par lequel Google
 * apprend que `/studio` et `/en/studio` ne se font pas concurrence. Les deux
 * canaux doivent dire la meme chose : ils lisent donc la meme liste.
 *
 * CHAQUE VERSION SE DECLARE ELLE-MEME EN PLUS DE DECLARER L AUTRE — le bloc
 * `languages` est identique sur les deux `<url>`. Ce n est pas une redondance :
 * un groupe hreflang dont un membre ne s auto-declare pas est ignore en entier.
 *
 * UNE PAGE NON TRADUITE NE SORT QU EN FRANCAIS, ET SANS AUCUN `hreflang`.
 * Deux raisons, et la seconde est la plus couteuse :
 *  1. un groupe hreflang d une seule langue ne dit rien a personne ;
 *  2. surtout, publier `/en/studio` alors que cette page repond 404 dilapide
 *     le budget de crawl du site entier et casse le groupe hreflang au lieu de
 *     le former. `CHEMINS_TRADUITS` (lib/i18n.ts) est la liste qui autorise
 *     une page a sortir en anglais, et elle s allonge d une ligne quand la
 *     page existe vraiment.
 */
function bilingue(entree: Entree): MetadataRoute.Sitemap {
  const urlFr = `${SITE_URL}${entree.chemin}`;
  const commun = {
    lastModified: entree.modifie,
    changeFrequency: entree.changeFrequency,
    priority: entree.priority,
  };

  if (!estTraduit(entree.chemin)) return [{ url: urlFr, ...commun }];

  const urlEn = `${SITE_URL}${lien("en", entree.chemin)}`;
  const languages = { "fr-CH": urlFr, "en-CH": urlEn, "x-default": urlFr };

  return [
    { url: urlFr, ...commun, alternates: { languages } },
    // MEME PRIORITE ET MEME FREQUENCE que la francaise : c est la meme page.
    // Une priorite plus basse cote anglais reviendrait a dire au moteur que la
    // traduction compte moins, ce qui n est pas l intention.
    { url: urlEn, ...commun, alternates: { languages } },
  ];
}

/**
 * LE PLAN, EN FRANCAIS. C est `bilingue` qui en tire les URL anglaises.
 */
const PAGES: readonly Entree[] = [
  { chemin: "/", changeFrequency: "weekly", priority: 1, modifie: "2026-10-25" },
  // La page de detail de l offre : elle repond a « assistant IA PME Genève »
  // et se rejoint depuis l accueil.
  { chemin: "/services", changeFrequency: "monthly", priority: 0.8, modifie: "2026-10-25" },
  // LES METIERS (25 octobre 2026) : le hub, puis une page par metier, lues
  // dans lib/metiers.ts — un metier ajoute la-bas entre ici sans retouche.
  // Ce sont les pages envoyees en prospection, et celles qui repondent a
  // « assistant IA <metier> Genève ».
  { chemin: CHEMIN_METIERS, changeFrequency: "monthly", priority: 0.8, modifie: "2026-10-25" },
  ...METIERS.map(
    (m): Entree => ({
      chemin: cheminMetier(m.slug),
      changeFrequency: "monthly",
      priority: 0.8,
      modifie: "2026-10-25",
    }),
  ),
  // LES EXEMPLES D AUTOMATISATION PAR METIER (25 octobre 2026), lus dans
  // lib/automatisations.ts : la page qui montre comment ca marche.
  { chemin: CHEMIN_DEMONSTRATIONS, changeFrequency: "monthly", priority: 0.7, modifie: "2026-10-25" },
  // LA DEMANDE DE DEMO : la page ou se termine le parcours, celle que le hero
  // et chaque fin de page designent.
  { chemin: "/devis", changeFrequency: "monthly", priority: 0.7, modifie: "2026-10-25" },
  // LES GUIDES (25 octobre 2026), francais seulement : ils repondent aux
  // questions que les gerants posent aux moteurs et aux IA (« combien coute un
  // assistant IA », nLPD…). Pas de version anglaise, donc pas d `hreflang` —
  // `bilingue` le sait seul, aucun de ces chemins n est dans CHEMINS_TRADUITS.
  // Meme poids que /services pour les quatre articles ; l index un cran
  // en dessous, comme /demonstrations. Ni /llms.txt ni /tarifs.md ne vont dans
  // le plan : ce sont des fichiers techniques, pas des pages.
  { chemin: "/guides", changeFrequency: "monthly", priority: 0.7, modifie: "2026-10-25" },
  ...[
    "/guides/automatisation-ia-pme-geneve",
    "/guides/assistant-ia-ou-secretaire",
    "/guides/prix-assistant-ia-suisse",
    "/guides/ia-et-protection-des-donnees",
  ].map(
    (chemin): Entree => ({ chemin, changeFrequency: "monthly", priority: 0.8, modifie: "2026-10-25" }),
  ),
  // Les deux pages qui repondent a ce qui reste quand l offre est lue : qui
  // fait le travail, et comment on le joint.
  { chemin: "/studio", changeFrequency: "monthly", priority: 0.6, modifie: "2026-10-25" },
  { chemin: "/contact", changeFrequency: "monthly", priority: 0.6, modifie: "2026-10-25" },
  {
    chemin: "/mentions-legales",
    changeFrequency: "yearly",
    priority: 0.3,
    modifie: "2026-10-25",
    brouillon: MENTIONS_BROUILLON || MENTIONS_EN_BROUILLON,
  },
  {
    chemin: "/confidentialite",
    changeFrequency: "yearly",
    priority: 0.3,
    modifie: "2026-10-25",
    brouillon: CONFIDENTIALITE_BROUILLON || CONFIDENTIALITE_EN_BROUILLON,
  },
  // Les CGV (B2B), ajoutees le 25 octobre 2026 : publiques et citables par
  // l offre ecrite, elles se signalent comme les deux autres pages legales.
  {
    chemin: "/cgv",
    changeFrequency: "yearly",
    priority: 0.3,
    modifie: "2026-10-25",
    brouillon: cgvEstBrouillon("fr") || cgvEstBrouillon("en"),
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.filter((p) => !p.brouillon).flatMap(bilingue);
}
