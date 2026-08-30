import type { MetadataRoute } from "next";
import { FORMULE_SLUGS } from "@/lib/formules";
import { SITE_URL } from "@/lib/site";

/**
 * sitemap.xml, genere.
 *
 * Sept URL : l accueil, le catalogue, les trois formules de site, les deux
 * pages legales. Sans ce plan, la decouverte reposerait entierement sur les
 * liens de la nav et du pied de page, et une page atteinte par un seul lien est
 * une page mal signalee.
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
 * `generateStaticParams` de app/(site)/prestations/[slug]/page.tsx. Les ecrire
 * une seconde fois ici garantissait qu un jour le plan annoncerait une page qui
 * n existe plus, ou en oublierait une nouvelle.
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
      url: `${SITE_URL}/prestations`,
      lastModified: BUILD,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Priorite juste sous celle du catalogue : ce sont les pages de vente que
    // le studio veut voir remonter sur « refonte de site Genève », mais elles
    // se rejoignent toutes depuis /prestations.
    ...FORMULE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/prestations/${slug}`,
      lastModified: BUILD,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
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
