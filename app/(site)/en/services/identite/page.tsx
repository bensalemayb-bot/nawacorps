import type { Metadata } from "next";
import PageFamille from "@/components/PageFamille";
import { metadataFamille } from "@/lib/familles";
// Meme feuille que la page francaise, et c est le point : le dessin des cinq
// pages de famille ne change pas avec la langue. Un CSS global s importe
// depuis n importe quelle page en App Router — voir
// node_modules/next/dist/docs/01-app/01-getting-started/11-css.md.
import "@/app/services.css";

/**
 * /en/services/identite — Identity & photography
 *
 * LA JUMELLE ANGLAISE DE /services/identite. Elle rend LE MEME COMPOSANT avec
 * une locale de plus : tout ce qui s affiche vient de `FAMILLES.identite`
 * (champs `En`, repli sur le francais) et de Postgres (`nameEn`,
 * `descriptionEn`, memes centimes). Aucune phrase n est ecrite ici.
 *
 * LE SLUG DU SEGMENT NE SE TRADUIT PAS — c est « identite », pas « identity ».
 * Deux raisons, et la seconde suffirait : les dix-sept liens du catalogue
 * pointent `/services/<famille>#<slug>` (lib/catalogue-familles.ts,
 * `hrefService`), et `lien("en", …)` se contente de prefixer `/en` sans
 * reecrire le chemin. Un segment traduit casserait les deux d un coup.
 *
 * SEGMENT STATIQUE, COMME SON JUMEAU FRANCAIS. Il voisinera avec [slug] sous
 * /en/services : un segment statique l emporte sur un segment dynamique de
 * meme niveau, « identite » n atteint donc jamais [slug]/page.tsx.
 *
 * `metadataFamille("identite", "en")` REND LA CANONIQUE `/en/services/identite`
 * et les `hreflang` du couple. Le `en-CH` n apparait que si
 * `/services/identite` figure dans `CHEMINS_TRADUITS` (lib/i18n.ts) : annoncer
 * une jumelle qui repond 404 est pire que de ne rien annoncer.
 */

// Meme raison que la page francaise : la page lit Postgres, et `next build`
// tourne sans base joignable (l etage builder du Dockerfile n en a aucune).
// Sans force-dynamic, Next tenterait un prerendu au build et la construction
// echouerait sur P1001.
export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataFamille("identite", "en");

export default function IdentiteEn() {
  return <PageFamille slug="identite" locale="en" />;
}
