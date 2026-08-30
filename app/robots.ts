import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt, genere.
 *
 * Il n en existait aucun : les moteurs decouvraient le site au flair, sans
 * savoir ou etait le plan ni ce qu il fallait laisser tranquille.
 *
 * Deux interdictions, pour deux raisons differentes :
 *
 *  - /admin porte deja `robots: { index: false, follow: false }` dans son
 *    layout. Le repeter ici n est pas redondant : la balise meta demande de
 *    VISITER la page pour etre lue, robots.txt evite le passage. Ceinture et
 *    bretelles, et aucune des deux n est une mesure de securite — c est
 *    l authentification qui protege.
 *
 *  - /api n a jamais rien a offrir a un moteur : ce sont des endpoints JSON,
 *    dont plusieurs mutent l etat. Les faire crawler ne sert personne.
 *
 * Ce fichier est un Route Handler mis en cache par Next tant qu il n utilise
 * aucune API de requete — ce qui est le cas ici.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
