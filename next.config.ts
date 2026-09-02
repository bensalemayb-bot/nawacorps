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
 * LES ADRESSES DES FAMILLES REGROUPEES LE 2 SEPTEMBRE 2026.
 *
 * Le catalogue est passe de CINQ familles a TROIS : « restauration » a ete
 * absorbee par les imprimes, « reseaux-sociaux » par l identite, et « suivi »
 * s appelle desormais « site-web ». Trois adresses ont donc disparu de chaque
 * langue, soit six en tout.
 *
 * POURQUOI DES REDIRECTIONS ET NON DES 404. Ces six adresses etaient publiees :
 * elles figuraient dans app/sitemap.ts, qui les derivait de FAMILLE_SLUGS, et
 * elles etaient liees depuis la navigation et depuis les blocs « voir aussi »
 * des autres familles. Un lien externe ou un signet qui les atteint doit
 * arriver sur la page qui porte maintenant le contenu, pas sur une erreur.
 *
 * 308 ET NON 302 : `permanent: true`. La page n est pas deplacee le temps d un
 * chantier, elle a fusionne — c est definitif, et c est ce qu il faut dire aux
 * moteurs pour qu ils transferent ce que l ancienne adresse avait acquis.
 *
 * CHAQUE LANGUE GARDE LA SIENNE. Le prefixe /en n est pas une variante de
 * casse : c est une autre page, avec son propre hreflang, et rediriger
 * /en/services/restauration vers la page francaise enverrait un anglophone
 * dans le mauvais arbre.
 *
 * ELLES NE SE DERIVENT PAS DE FAMILLE_SLUGS, volontairement : cette liste-la ne
 * contient plus que les familles VIVANTES. Les anciennes n existent nulle part
 * ailleurs dans le depot, et c est precisement pour cela qu il faut les ecrire
 * ici a la main — sinon plus rien ne se souviendrait qu elles ont existe.
 */
const FAMILLES_REGROUPEES: ReadonlyArray<readonly [string, string]> = [
  ["/services/restauration", "/services/imprimes"],
  ["/services/reseaux-sociaux", "/services/identite"],
  ["/services/suivi", "/services/site-web"],
  ["/en/services/restauration", "/en/services/imprimes"],
  ["/en/services/reseaux-sociaux", "/en/services/identite"],
  ["/en/services/suivi", "/en/services/site-web"],
];

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  async redirects() {
    return FAMILLES_REGROUPEES.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
