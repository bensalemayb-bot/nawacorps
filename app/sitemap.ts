import type { MetadataRoute } from "next";
import { FAMILLE_SLUGS } from "@/lib/familles";
import { FORMULE_SLUGS } from "@/lib/formules";
import { SITE_URL } from "@/lib/site";
import { estTraduit, lien } from "@/lib/i18n";

/**
 * sitemap.xml, genere.
 *
 * L accueil, le catalogue, les trois formules de site, les cinq familles, la
 * demande de devis, les demonstrations, la page du studio, celle du contact,
 * les deux pages legales. Sans ce plan, la decouverte reposerait entierement
 * sur les liens de la nav et du pied de page, et une page atteinte par un seul
 * lien est une page mal signalee.
 *
 * LE COMPTE N EST PLUS ECRIT. Il disait « douze URL » et il en annoncait deja
 * quatorze : un chiffre dans un commentaire est faux a la premiere page
 * ajoutee, et deux des lignes ci-dessous sont des `map` dont la longueur se
 * decide ailleurs.
 *
 * `lastModified` est volontairement la date du build et non `new Date()` a
 * chaque requete : ce fichier est un Route Handler mis en cache par Next, et
 * une date qui bouge a chaque appel apprend au moteur a ne plus la croire.
 *
 * QUAND DE NOUVELLES PAGES ARRIVERONT, elles se listent ici — c est le seul
 * endroit a modifier. Si elles finissent par etre pilotees par la base, cette
 * fonction passe `async` et lit Prisma comme le fait deja Offres.
 *
 * LES TROIS FORMULES SONT DERIVEES DE `FORMULE_SLUGS`, la meme constante que
 * `generateStaticParams` de app/(site)/services/[slug]/page.tsx. Les ecrire
 * une seconde fois ici garantissait qu un jour le plan annoncerait une page qui
 * n existe plus, ou en oublierait une nouvelle.
 *
 * LES CINQ FAMILLES SUIVENT LA MEME REGLE, derivees de `FAMILLE_SLUGS`
 * (lib/familles.ts) — la constante qui indexe aussi FAMILLES et donc les cinq
 * segments statiques de app/(site)/services/. Ces pages sont bien listees
 * malgre leur `force-dynamic` : le rendu dynamique dit comment la page est
 * fabriquee, pas si elle merite d etre indexee.
 *
 * LES ENTREES SONT DES CHEMINS, PLUS DES URL ABSOLUES. Elles s ecrivaient
 * `${SITE_URL}/services` ; elles s ecrivent `/services`, et c est la fonction
 * `bilingue` plus bas qui prefixe le domaine et la langue. Le sitemap doit
 * desormais fabriquer TROIS choses a partir d un meme chemin — l URL francaise,
 * l URL anglaise et les `hreflang` qui les relient — et les fabriquer a partir
 * d une URL absolue aurait demande de la decouper pour la recomposer.
 */
const BUILD = new Date();

/** Une page du plan, dans sa forme francaise et sans domaine. */
type Entree = {
  /** Le chemin SANS prefixe de langue : `/services`, jamais `/en/services`. */
  chemin: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
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
    lastModified: BUILD,
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
 * LE PLAN, EN FRANCAIS — l ordre et les priorites de la version d origine,
 * inchanges. C est `bilingue` qui en tire les URL anglaises.
 */
const PAGES: readonly Entree[] = [
  { chemin: "/", changeFrequency: "weekly", priority: 1 },
  { chemin: "/services", changeFrequency: "monthly", priority: 0.8 },
  // Priorite juste sous celle du catalogue : ce sont les pages de vente que
  // le studio veut voir remonter sur « refonte de site Genève », mais elles
  // se rejoignent toutes depuis /services.
  ...FORMULE_SLUGS.map((slug) => ({
    chemin: `/services/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
  // Un cran sous les formules, et pour la meme raison qui les place sous le
  // catalogue : ce sont des pages de vente reelles, mais le site vend
  // d abord la refonte, et ces cinq-la se rejoignent depuis /services.
  ...FAMILLE_SLUGS.map((slug) => ({
    chemin: `/services/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })),
  // LA DEMANDE DE DEVIS. Meme priorite que les formules : c est la page ou
  // se termine le parcours de vente, celle que le hero et chaque fin de page
  // designent. « demande de devis site internet Genève » est une requete de
  // transaction, pas de catalogue — elle merite d etre trouvee seule.
  { chemin: "/devis", changeFrequency: "monthly", priority: 0.7 },
  // LES DEMONSTRATIONS. Un cran sous le devis : la page ne vend rien, elle
  // prouve. Elle existe justement parce que le carrousel n avait pas d URL a
  // lui — enterre dans l accueil, il etait introuvable autrement.
  { chemin: "/demonstrations", changeFrequency: "monthly", priority: 0.6 },
  // LES DEUX PAGES QUE LA NAV OUVRE SANS PASSER PAR LE CATALOGUE. Elles ne
  // vendent pas une prestation, elles repondent aux deux questions qui
  // restent quand le prix est lu : qui fait le travail, et comment on le
  // joint. Meme priorite que les familles, parce qu elles se cherchent
  // autant — « qui refait mon site à Genève » n est pas une requete de
  // catalogue.
  { chemin: "/studio", changeFrequency: "monthly", priority: 0.6 },
  { chemin: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { chemin: "/mentions-legales", changeFrequency: "yearly", priority: 0.3 },
  { chemin: "/confidentialite", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(bilingue);
}
