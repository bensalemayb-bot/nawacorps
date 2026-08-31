import type { Metadata } from "next";
import { corpsServices, metadataServices } from "../../services/page";

/**
 * /en/services — LE CATALOGUE EN ANGLAIS.
 *
 * CETTE PAGE NE PORTE AUCUN CONTENU, ET C EST TOUT SON INTERET. Le corps, les
 * chaines des deux langues, les metadonnees et le fil d Ariane vivent dans
 * app/(site)/services/page.tsx ; ici il ne reste que la ROUTE et la LANGUE.
 * Deux corps recopies auraient diverge au premier arbitrage editorial — un
 * bloc ajoute d un cote, une mention de prix corrigee de l autre — et la
 * divergence aurait ete silencieuse : personne ne relit deux catalogues cote a
 * cote dans deux langues.
 *
 * POURQUOI L IMPORT VIENT D UNE `page.tsx` PLUTOT QUE D UN COMPOSANT PARTAGE.
 * C est une contrainte du chantier, pas une preference : ce lot n avait le
 * droit de toucher qu aux quatre pages de services, a lib/formules.ts et a la
 * configuration ESLint — components/ etait tenu par d autres agents au meme
 * moment. Next 16 l accepte sans reserve : le validateur genere
 * (.next/types/validator.ts) contraint les exports d une page par un `extends`,
 * qui autorise les exports supplementaires. Le jour ou le proprietaire ouvre un
 * fichier de plus, `corpsServices` a sa place dans un module colocalise.
 *
 * `dynamic` EST REDECLARE ICI, ET IL DOIT L ETRE. La configuration de segment
 * est lue sur le fichier de la ROUTE, jamais heritee d un module importe : sans
 * cette ligne, Next tenterait de prerendre au build une page qui lit Postgres,
 * et `next build` echouerait dans l etage builder du Dockerfile, qui n a pas de
 * base. Meme raison exactement qu app/(site)/services/page.tsx.
 */
export const dynamic = "force-dynamic";

/**
 * `metadataServices("en")` pose la canonique `/en/services`, l Open Graph
 * anglais et les `hreflang` qui croisent les deux versions. Sans elle, la page
 * heriterait de `alternates: { canonical: "/" }` declaree par le layout du site
 * public et s auto-desindexerait au profit de l accueil.
 *
 * Le `hreflang` `en-CH` n apparaitra toutefois que le jour ou `/services`
 * entrera dans `CHEMINS_TRADUITS` (lib/i18n.ts) : c est ce verrou qui empeche
 * d annoncer a Google une jumelle anglaise avant qu elle ne reponde 200.
 */
export const metadata: Metadata = metadataServices("en");

export default async function ServicesEn() {
  return corpsServices("en");
}
