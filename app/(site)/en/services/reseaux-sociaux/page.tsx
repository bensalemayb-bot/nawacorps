import type { Metadata } from "next";
import PageFamille from "@/components/PageFamille";
import { metadataFamille } from "@/lib/familles";
// Meme feuille que la page francaise, et c est le point : le dessin des cinq
// pages de famille ne change pas avec la langue. Un CSS global s importe
// depuis n importe quelle page en App Router — voir
// node_modules/next/dist/docs/01-app/01-getting-started/11-css.md.
import "@/app/services.css";

/**
 * /en/services/reseaux-sociaux — Social media
 *
 * LA JUMELLE ANGLAISE DE /services/reseaux-sociaux. Elle rend LE MEME
 * COMPOSANT avec une locale de plus ; toute la matiere vient de
 * `FAMILLES["reseaux-sociaux"]` et de Postgres.
 *
 * UNE SEULE PRESTATION, ET DONC UN CAS PARTICULIER : si la ligne est masquee
 * depuis /admin, la page repond notFound() — dans les deux langues, puisque
 * c est le composant partage qui tranche.
 *
 * LE PARTENAIRE DE PRODUCTION N EST PAS NOMME, en anglais comme en francais.
 * Le positionnement §7 laisse l autorisation d usage du portfolio « a
 * formaliser » ; publier le nom du partenaire avant cet accord serait une
 * decision qui n appartient pas a cette page.
 *
 * LE SLUG DU SEGMENT NE SE TRADUIT PAS — c est « reseaux-sociaux », pas
 * « social-media ». Attention, il est PARTAGE : c est a la fois un slug de
 * famille et un slug de la table Service. Le segment statique l emporte sur le
 * dynamique, et c est bien cette page-ci qui repond.
 */

// Meme raison que la page francaise : la page lit Postgres, et `next build`
// tourne sans base joignable (l etage builder du Dockerfile n en a aucune).
// Sans force-dynamic, Next tenterait un prerendu au build et la construction
// echouerait sur P1001.
export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataFamille("reseaux-sociaux", "en");

export default function ReseauxSociauxEn() {
  return <PageFamille slug="reseaux-sociaux" locale="en" />;
}
