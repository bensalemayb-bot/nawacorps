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
 * fichier, l accueil et /prestations tiendraient chacun sa liste, et les deux
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
 * ont chacune leur page (/prestations/<slug>, cf. lib/formules.ts) et leur
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

/** L URL publique d une famille. */
export function hrefFamille(slug: FamilleSlug): string {
  return `/prestations/${slug}`;
}

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
 * Une famille sans aucune ligne visible en base est OMISE : elle laisserait
 * sinon un titre, une accroche et un lien vers une page sans contenu.
 */
export function parFamilles<T extends ServiceRangeable>(
  services: readonly T[],
): { famille: FamilleRangee; lignes: T[] }[] {
  return FAMILLE_SLUGS.map((slug) => ({
    famille: ranger(slug),
    lignes: services.filter((s) => familleDuService(s)?.slug === slug),
  })).filter((groupe) => groupe.lignes.length > 0);
}
