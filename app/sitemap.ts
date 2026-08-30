import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * sitemap.xml, genere.
 *
 * Trois URL seulement — c est tout ce que le site publie aujourd hui. Le plan
 * n en devient pas inutile pour autant : sans lui, la decouverte reposait
 * entierement sur les deux liens en pied de page, et une page legale atteinte
 * par un seul lien de footer est une page mal signalee.
 *
 * `lastModified` est volontairement la date du build et non `new Date()` a
 * chaque requete : ce fichier est un Route Handler mis en cache par Next, et
 * une date qui bouge a chaque appel apprend au moteur a ne plus la croire.
 *
 * QUAND LES PAGES DE SERVICES ARRIVERONT, elles se listent ici — c est le seul
 * endroit a modifier. Si elles finissent par etre pilotees par la base, cette
 * fonction passe `async` et lit Prisma comme le fait deja Offres.
 */
const BUILD = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: BUILD,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/mentions-legales`,
      lastModified: BUILD,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/confidentialite`,
      lastModified: BUILD,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
