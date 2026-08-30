import type { Metadata } from "next";
import PageFamille from "@/components/PageFamille";
import { metadataFamille } from "@/lib/familles";
// Feuille propre aux cinq pages de famille : la mise en page d une prestation
// et les vignettes de demonstration. Elle n est PAS dans binacore.css, qui est
// le portage a l octet pres de la maquette et qui est travaille en parallele.
// Un CSS global s importe depuis n importe quelle page en App Router — voir
// node_modules/next/dist/docs/01-app/01-getting-started/11-css.md.
import "@/app/prestations.css";

/**
 * /prestations/identite — Identité & photographie
 *
 * Deux prestations : le logotype et son systeme, et les photos de
 * l entreprise. Elles se prennent seules, sans site chez le studio — c est
 * ecrit dans les questions, parce que c est la premiere que pose le lecteur.
 *
 * SEGMENT STATIQUE, ET C EST VOLONTAIRE. Ce dossier voisine avec [slug], qui
 * ne sert que les trois formules de site. Un segment statique l emporte sur un
 * segment dynamique de meme niveau : « identite » n atteint donc jamais
 * [slug]/page.tsx, et il n y a aucun conflit de route a arbitrer.
 *
 * TOUT LE CORPS EST DANS components/PageFamille.tsx, et toute la matiere
 * editoriale dans lib/familles.ts. Les noms, les descriptions et les prix
 * viennent de Postgres : aucun montant n est ecrit dans ces trois fichiers.
 */

// Meme raison qu app/(site)/prestations/page.tsx : la page lit Postgres, et
// `next build` tourne sans base joignable (l etage builder du Dockerfile n en
// a aucune). Sans force-dynamic, Next tenterait un prerendu au build et la
// construction echouerait sur P1001.
export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataFamille("identite");

export default function Identite() {
  return <PageFamille slug="identite" />;
}
