import { FAMILLES, FAMILLE_SLUGS, type FamilleSlug } from "@/lib/familles";

/**
 * LE RANGEMENT DU CATALOGUE EN FAMILLES — le pont entre la table Service et
 * les cinq pages de famille.
 *
 * POURQUOI CE FICHIER EST SEPARE DE lib/familles.ts. Celui-la porte la MATIERE
 * EDITORIALE des cinq pages : titres, accroches, pieces, questions, hors
 * perimetre. Celui-ci ne porte qu une question, et elle vient d ailleurs :
 * « cette ligne de la table Service, dans quelle famille tombe-t-elle ? ».
 * C est la question que se posent l accueil et l index des prestations, qui
 * partent du CATALOGUE et non d une famille. Les deux fichiers changent pour
 * des raisons differentes et a des moments differents.
 *
 * LA TABLE Service PORTE UNE `category` — `principal`, `continu`, `annee`,
 * `saison` — et ce n est pas un rangement de lecture, c est un rangement de
 * base. Le visiteur, lui, cherche s il est au bon endroit pour un logo, pour
 * une carte de restaurant ou pour son suivi mensuel. La famille est la
 * traduction de l un dans l autre, et elle est ecrite UNE fois : sans ce
 * fichier, l accueil et /services tiendraient chacun sa liste, et les deux
 * divergeraient au premier ajout en base.
 *
 * LE RATTACHEMENT EST NOMME PUIS, A DEFAUT, DEDUIT DE LA CATEGORIE.
 * lib/familles.ts nomme deja, piece par piece, les quatorze lignes des cinq
 * pages : c est la source, et elle est exacte parce que ces pages RENDENT ces
 * lignes. Mais elle est FERMEE — une prestation ajoutee en base demain n y
 * figure pas, et disparaitrait en silence des deux grilles. La categorie sert
 * donc de filet : toute ligne non nommee tombe dans la famille d accueil de sa
 * categorie. Le catalogue vient de la base ; il doit pouvoir grandir sans
 * qu on revienne ici.
 *
 * `principal` N A PAS DE FAMILLE, volontairement. Les trois formules de site
 * ont chacune leur page (/services/<slug>, cf. lib/formules.ts) et leur
 * propre grille de cartes ; leur donner une famille les ferait paraitre deux
 * fois sur le meme ecran.
 */

/**
 * Les categories du catalogue qui se rangent en familles.
 *
 * Le filtre reste EXPLICITE, comme dans lib/catalogue.ts : une categorie
 * inventee en base demain n a aucune raison de surgir d office dans une grille
 * qui ne l attend pas.
 */
export const CATEGORIES_FAMILLES = ["continu", "annee", "saison"] as const;

/**
 * La famille d accueil de chaque categorie — le filet decrit en tete.
 *
 * `annee` retombe sur les imprimes et non sur l identite : les lignes de cette
 * categorie qui ne sont pas nommees ailleurs sont des objets qu on fait
 * imprimer, et c est ce qu on ajoutera le plus probablement demain.
 */
const FAMILLE_PAR_CATEGORIE: Record<string, FamilleSlug> = {
  continu: "suivi",
  annee: "imprimes",
  saison: "restauration",
};

/**
 * Slug de prestation -> slug de famille, construit a partir des `pieces`
 * declarees par les cinq pages. Ecrit une fois au chargement du module : la
 * table ne bouge pas d une requete a l autre.
 */
const FAMILLE_PAR_SERVICE: Record<string, FamilleSlug> = Object.fromEntries(
  FAMILLE_SLUGS.flatMap((slug) =>
    FAMILLES[slug].pieces.map((piece) => [piece.slug, slug] as const),
  ),
);

/**
 * LA HIERARCHIE DE VITRINE — ce que le studio met devant, et ce qu il garde
 * derriere.
 *
 * POURQUOI ELLE EXISTE. Le catalogue traitait ses familles a EGALITE : cinq
 * blocs de meme poids sur /services, quatorze cartes de meme dessin sur
 * l accueil. Ce n est pas ce que le studio vend vraiment. Trois lignes portent
 * l activite — les sites, les cartes et imprimes, les reseaux sociaux — et le
 * reste, sans etre secondaire par la qualite, ne se dispute pas la vitrine.
 * Decision du proprietaire, pas une lecture de trafic.
 *
 * LES SITES NE SONT PAS DANS CETTE TABLE, et c est normal : les trois formules
 * sont des `principal`, elles n ont pas de famille (voir l en-tete) et elles
 * ouvrent deja les deux pages avec leur propre grille de cartes. Restent donc
 * les deux familles a promouvoir.
 *
 * LE Record EST EXHAUSTIF PAR CONSTRUCTION. Indexe par FamilleSlug, il ne
 * compile pas si une famille ajoutee dans lib/familles.ts n est pas classee
 * ici. C est la garde qui compte : sans elle, une famille non classee
 * disparaitrait EN SILENCE des deux grilles, qui ne rendent plus le catalogue
 * en un seul passage mais en deux.
 */
export type RangDeVitrine = "vitrine" | "second";

const RANG_PAR_FAMILLE: Record<FamilleSlug, RangDeVitrine> = {
  identite: "second",
  imprimes: "vitrine",
  "reseaux-sociaux": "vitrine",
  suivi: "second",
  restauration: "second",
};

/**
 * Les deux listes ordonnees, DERIVEES de FAMILLE_SLUGS et jamais reecrites a
 * la main : l ordre de lecture du catalogue reste decide a un seul endroit, et
 * leur reunion est le catalogue entier — aucune ligne ne peut tomber entre les
 * deux.
 */
export const FAMILLES_EN_VITRINE = FAMILLE_SLUGS.filter(
  (slug) => RANG_PAR_FAMILLE[slug] === "vitrine",
);
export const FAMILLES_EN_SECOND = FAMILLE_SLUGS.filter(
  (slug) => RANG_PAR_FAMILLE[slug] === "second",
);

/**
 * LA RACINE DES PAGES DE SERVICE, ecrite une seule fois.
 *
 * Le segment s appelait `/prestations`. Le proprietaire a tranche : « service,
 * offre et prestation veulent dire la meme chose », et la navigation portait
 * les trois. Il ne reste qu un mot, `/services`, et il ne s ecrit qu ici pour
 * les deux fonctions ci-dessous — le jour ou il rebouge, une seule ligne suit.
 */
const RACINE = "/services";

/** L URL de la page generale — celle que la navigation ouvre en premier. */
export const HREF_SERVICES = RACINE;

/** L URL publique d une famille. */
export function hrefFamille(slug: FamilleSlug): string {
  return `${RACINE}/${slug}`;
}

/**
 * L URL publique d une ligne de catalogue : sa page quand elle en a une, sinon
 * l ANCRE de son bloc sur la page de sa famille.
 *
 * POURQUOI ELLE NE REND PLUS `/services/<slug>` POUR TOUT LE MONDE. Elle le
 * faisait, et quatorze des dix-huit lignes du catalogue repondaient donc 404 :
 * a cette adresse ne vivent que les trois formules, servies par le voisin
 * [slug], et les cinq familles, qui sont des segments statiques. La moitie
 * basse du catalogue envoyait le visiteur dans le mur — releve route par
 * route, `docs/agents/reviews/brand-review-2026-08-31.md`, constat 10.
 *
 * LA CORRECTION NE CREE AUCUNE PAGE, et c est deliberé : quatorze pages baties
 * sur une ligne de base seraient du contenu mince, qui dessert le referencement
 * au lieu de le servir (meme raisonnement qu en tete de lib/formules.ts). Le
 * contenu EXISTE DEJA — chaque ligne est une `piece` de lib/familles.ts, et la
 * page de sa famille la rend en entier : ce que c est, ce qu on recoit, son
 * prix lu en base, la raison de son devis. On y renvoie donc a l ancre du bloc,
 * posee par components/PageFamille.tsx sur l `id` de chaque `<article>`.
 *
 * LES TROIS FORMULES GARDENT LEUR PAGE : elles n ont pas de famille (voir
 * l en-tete), `FAMILLE_PAR_SERVICE` ne les connait pas, et elles retombent
 * donc sur `/services/<slug>`.
 *
 * UN SEUL SLUG N A NI PAGE NI FAMILLE : `site-sur-mesure`, un `principal` sur
 * devis. Cette fonction lui rendrait une adresse morte — le seul endroit qui
 * le rende, app/(site)/services/page.tsx, ne l appelle donc pas pour lui et
 * l affiche sans lien.
 *
 * ATTENTION, LE SEGMENT EST PARTAGE. `reseaux-sociaux` est a la fois un slug de
 * famille et un slug de la table Service ; un segment statique l emporte
 * toujours sur le dynamique, et c est bien la page de famille qui repond. Ce
 * n est pas un lien mort — cette famille ne contient QUE cette ligne —, mais
 * aucune page produit distincte ne pourra jamais vivre a cette adresse.
 */
export function hrefService(slug: string): string {
  const famille = FAMILLE_PAR_SERVICE[slug];
  return famille ? `${hrefFamille(famille)}#${slug}` : `${RACINE}/${slug}`;
}

/** Une entree de navigation : ou ca mene, et sous quel nom. */
export type EntreeNav = { href: string; libelle: string };

/**
 * LES CINQ FAMILLES TELLES QUE LA NAVIGATION LES LISTE.
 *
 * Elle est DERIVEE, jamais ecrite a la main : la barre de nav et le menu plein
 * ecran rendent la meme liste, et une famille ajoutee dans lib/familles.ts doit
 * apparaitre dans les deux sans qu on y revienne. Le libelle est celui de la
 * famille — la nav n a pas a rebaptiser une page qui porte deja son nom.
 */
export const ENTREES_FAMILLES: readonly EntreeNav[] = FAMILLE_SLUGS.map(
  (slug) => ({ href: hrefFamille(slug), libelle: FAMILLES[slug].libelle }),
);

/** Ce qu il faut savoir d une ligne de catalogue pour la ranger. */
type ServiceRangeable = { slug: string; category: string };

/** Une famille, avec le slug qui la designe et son URL. */
export type FamilleRangee = {
  slug: FamilleSlug;
  href: string;
  /** L habillage editorial, lu dans lib/familles.ts — jamais recopie ici. */
  contenu: (typeof FAMILLES)[FamilleSlug];
};

function ranger(slug: FamilleSlug): FamilleRangee {
  return { slug, href: hrefFamille(slug), contenu: FAMILLES[slug] };
}

/**
 * La famille d une prestation, ou `undefined` quand elle n en a pas — les
 * quatre `principal`, notamment. Un `undefined` ne doit jamais produire de
 * lien : mieux vaut une carte sans porte de sortie qu une porte sur le vide.
 */
export function familleDuService(
  service: ServiceRangeable,
): FamilleRangee | undefined {
  const cible =
    FAMILLE_PAR_SERVICE[service.slug] ?? FAMILLE_PAR_CATEGORIE[service.category];
  return cible ? ranger(cible) : undefined;
}

/**
 * Le catalogue regroupe par famille, dans l ordre de FAMILLE_SLUGS.
 *
 * `ordre` RESTREINT ET ORDONNE le resultat : passer FAMILLES_EN_VITRINE ne
 * rend que les familles de vitrine, passer FAMILLES_EN_SECOND ne rend que les
 * autres. C est ainsi que l accueil et /services rendent leur catalogue en
 * DEUX passages de poids visuel different sans tenir chacun sa liste — et
 * comme les deux constantes sont derivees de FAMILLE_SLUGS, leurs deux
 * passages couvrent exactement le catalogue.
 *
 * Une famille sans aucune ligne visible en base est OMISE : elle laisserait
 * sinon un titre, une accroche et un lien vers une page sans contenu.
 */
export function parFamilles<T extends ServiceRangeable>(
  services: readonly T[],
  ordre: readonly FamilleSlug[] = FAMILLE_SLUGS,
): { famille: FamilleRangee; lignes: T[] }[] {
  return ordre
    .map((slug) => ({
      famille: ranger(slug),
      lignes: services.filter((s) => familleDuService(s)?.slug === slug),
    }))
    .filter((groupe) => groupe.lignes.length > 0);
}
