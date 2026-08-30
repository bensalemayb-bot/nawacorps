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
 * /prestations/suivi — Suivi & hébergement
 *
 * LA SEULE PAGE MIXTE DES CINQ : les deux abonnements mensuels y portent un
 * PRIX AFFICHE — les deux seuls de ces cinq pages — et la traduction FR / EN
 * y est sur devis. « TVA comprise » figure donc sous chacun des deux montants,
 * dans la meme unite de lecture, et l abonnement impose par la formule qui
 * embarque l assistant est annonce avec le mot « obligatoire » : un prix
 * mensuel impose passe sous silence est un prix cache.
 *
 * LA TRADUCTION EST ICI ET PLUS SOUS LA RESTAURATION. La ligne s appelait
 * « Traduction de carte FR / EN » ; elle a ete renommee en base « Traduction
 * du site FR / EN ». C est une prestation de site : elle s ajoute a ce qui est
 * deja en ligne, comme le reste de cette page.
 *
 * SEGMENT STATIQUE, ET C EST VOLONTAIRE. Ce dossier voisine avec [slug], qui
 * ne sert que les trois formules de site. Un segment statique l emporte sur un
 * segment dynamique de meme niveau : « suivi » n atteint donc jamais
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

export const metadata: Metadata = metadataFamille("suivi");

export default function Suivi() {
  return <PageFamille slug="suivi" />;
}
