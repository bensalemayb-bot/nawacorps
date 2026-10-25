import type { NextConfig } from "next";

/**
 * `output: "standalone"` ne sert QU A l image Docker : le Dockerfile copie
 * `.next/standalone` puis lance `node server.js`. Vercel, lui, trace les
 * fichiers lui-meme et fabrique ses propres fonctions ; le mode standalone n y
 * apporte rien et fait produire au build une seconde copie de l application.
 *
 * VERCEL vaut "1" dans tout build Vercel. La variable est donc le seul
 * aiguillage necessaire, et les deux cibles restent servies par le meme depot.
 */

/**
 * LES ANCIENNES ADRESSES, REDIRIGEES : l ancienne offre vers l accueil, la
 * premiere page metier vers sa place dans /metiers (en fin de liste).
 *
 * Le 24 octobre 2026, le site a cesse de vendre des sites, de l identite et
 * des imprimes : il vend un assistant (.agents/product-marketing.md). Toutes
 * les pages `/services/<slug>` — les trois formules (la-vitrine, le-site,
 * l-assistant) comme les six familles regroupees puis retirees
 * (restauration, reseaux-sociaux, suivi, imprimes, identite, site-web) ont
 * disparu. L offre vit sur l accueil.
 *
 * `/demonstrations` N EST PLUS REDIRIGEE (25 octobre 2026). Elle avait suivi
 * l ancienne offre vers l accueil le 24 ; elle est revenue avec un contenu de
 * la nouvelle — les exemples d automatisation par metier
 * (app/(site)/demonstrations/page.tsx). Une redirection laissee ici rendrait
 * la page inatteignable : les redirections passent avant les routes.
 *
 * POURQUOI DES REDIRECTIONS ET NON DES 404. Ces adresses etaient publiees :
 * au sitemap, dans la nav, dans les liens « voir aussi », et peut-etre dans
 * des signets ou des liens externes. Une ancienne adresse doit arriver sur la
 * page qui porte maintenant l offre, pas sur une erreur. Chaque ancienne
 * adresse pointe directement sur la destination finale, sans saut
 * intermediaire. « /services/l-assistant » en particulier ne doit jamais
 * montrer un ancien prix sous le nom du nouveau produit.
 *
 * `/services/:chemin+` COUVRE TOUS LES SEGMENTS, y compris ceux qu on aurait
 * oublies ; `/services` lui-meme n est pas touche : il a une page.
 *
 * 308 ET NON 302 : `permanent: true`. C est definitif, et c est ce qu il faut
 * dire aux moteurs pour qu ils transferent ce que l ancienne adresse avait
 * acquis.
 *
 * CHAQUE LANGUE GARDE LA SIENNE : `/en/...` mene a `/en`, jamais a l accueil
 * francais.
 */
const ANCIENNES_ADRESSES: ReadonlyArray<readonly [string, string]> = [
  ["/services/:chemin+", "/"],
  ["/en/services/:chemin+", "/en"],
  // LA PREMIERE PAGE METIER (25.10.2026) devient une page de la famille
  // /metiers, generee depuis lib/metiers.ts. Elle avait ete publiee (sitemap,
  // llms.txt, prospection) : sa nouvelle adresse herite de ce qu elle a acquis.
  ["/sanitaire-chauffage-geneve", "/metiers/sanitaire-chauffage"],
  ["/en/sanitaire-chauffage-geneve", "/en/metiers/sanitaire-chauffage"],
];

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  async redirects() {
    return ANCIENNES_ADRESSES.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
