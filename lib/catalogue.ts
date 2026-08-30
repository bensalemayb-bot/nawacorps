import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * LE CATALOGUE, LU UNE SEULE FOIS PAR REQUETE.
 *
 * POURQUOI CE FICHIER EXISTE. L accueil rendait DEUX requetes Postgres pour
 * un seul ecran : `Offres` demandait les `principal`, `CarteDuStudio`
 * demandait `principal + annee + continu + saison`. La seconde contenait deja
 * la premiere en entier — le studio payait donc un aller-retour reseau pour
 * une donnee qu il avait deja. Une seule lecture les sert toutes les deux.
 *
 * `cache()` DE REACT, ET SURTOUT PAS UN CACHE ENTRE REQUETES. La memoisation
 * ne vit que le temps d UN rendu : deux composants qui appellent cette
 * fonction pendant la meme requete se partagent la meme promesse, et la
 * requete suivante repart en base. C est deliberé — voir la mesure consignee
 * dans le rapport de performance : un cache persistant (`unstable_cache`,
 * `revalidate`) ne gagnait que quelques millisecondes sur un TTFB deja a
 * 17 ms, en echange d une fenetre pendant laquelle un prix corrige en base
 * resterait faux a l ecran. En Suisse la LCD (art. 3) vise les indications
 * trompeuses : un prix perime coute plus cher que trois millisecondes.
 *
 * LA REQUETE N EST PAS FILTREE PAR CATEGORIE, et c est ce qui permet de la
 * partager. Le filtrage par categorie reste chez chaque appelant, en memoire :
 * `visible: true` est la seule condition commune a tous. La table compte
 * dix-huit lignes de quelques champs — la trier en memoire ne coute rien face
 * a l aller-retour qu on economise.
 *
 * AUCUN `select` : les appelants consomment presque toutes les colonnes, et le
 * modele Service n en a que dix, toutes scalaires.
 */
export const chargerCatalogue = cache(async () => {
  return prisma.service.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
});

/** Une ligne du catalogue, telle que la rendent les pages. */
export type ServiceCatalogue = Awaited<
  ReturnType<typeof chargerCatalogue>
>[number];

/**
 * Les lignes d une ou plusieurs categories, dans l ordre de `sortOrder`.
 *
 * Le filtre reste EXPLICITE chez l appelant plutot que d etre suppose : une
 * categorie ajoutee en base demain n a aucune raison d apparaitre d office
 * dans une grille qui ne l attend pas.
 */
export function parCategories(
  services: readonly ServiceCatalogue[],
  categories: readonly string[],
): ServiceCatalogue[] {
  return services.filter((s) => categories.includes(s.category));
}

/**
 * LE PRIX D ENTREE, une seule fois pour tout le site.
 *
 * Deux endroits l affichent sur le meme ecran : le sous-titre du hero et la
 * meta description que Google reprend dans son extrait. Ils le derivaient
 * chacun a sa facon — l un par le slug `la-vitrine`, l autre par le plus petit
 * montant de la categorie `principal`. Les deux coincidaient, mais rien ne le
 * garantissait : ajouter une formule moins chere, ou renommer ce slug, faisait
 * diverger l extrait et la page. Un visiteur aurait lu deux prix d entree
 * differents pour la meme offre, a une seconde d intervalle.
 *
 * La regle retenue est celle qui suit l offre plutot qu un identifiant : le
 * plus petit montant affiche parmi les formules. Renvoie null si aucune n en
 * porte — la phrase se referme alors sans montant, jamais avec un trou.
 */
export function prixEntreeCents(catalogue: readonly ServiceCatalogue[]): number | null {
  const montants = catalogue
    .filter((s) => s.category === "principal")
    .map((s) => s.priceCents)
    .filter((cents): cents is number => cents !== null);
  return montants.length > 0 ? Math.min(...montants) : null;
}
