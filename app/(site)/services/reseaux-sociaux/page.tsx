import type { Metadata } from "next";
import PageFamille from "@/components/PageFamille";
import { metadataFamille } from "@/lib/familles";
// Feuille propre aux cinq pages de famille : la mise en page d une prestation
// et les vignettes de demonstration. Elle n est PAS dans binacore.css, qui est
// le portage a l octet pres de la maquette et qui est travaille en parallele.
// Un CSS global s importe depuis n importe quelle page en App Router — voir
// node_modules/next/dist/docs/01-app/01-getting-started/11-css.md.
import "@/app/services.css";

/**
 * /services/reseaux-sociaux — Réseaux sociaux
 *
 * Une seule prestation, et donc un cas particulier : si la ligne est masquee
 * depuis /admin, la page repond notFound() comme le ferait celle d une
 * formule dont le slug a disparu.
 *
 * LE PARTENAIRE DE PRODUCTION N EST PAS NOMME. Le positionnement §7 laisse
 * l autorisation d usage du portfolio « a formaliser » ; publier le nom du
 * partenaire avant cet accord serait une decision qui n appartient pas a
 * cette page. Ce qui est ecrit — la production est faite avec un partenaire,
 * le studio porte le travail — vient bien de ce §7.
 *
 * SEGMENT STATIQUE, ET C EST VOLONTAIRE. Ce dossier voisine avec [slug], qui
 * ne sert que les trois formules de site. Un segment statique l emporte sur un
 * segment dynamique de meme niveau : « reseaux-sociaux » n atteint donc jamais
 * [slug]/page.tsx, et il n y a aucun conflit de route a arbitrer.
 *
 * TOUT LE CORPS EST DANS components/PageFamille.tsx, et toute la matiere
 * editoriale dans lib/familles.ts. Les noms, les descriptions et les prix
 * viennent de Postgres : aucun montant n est ecrit dans ces trois fichiers.
 *
 * ELLE A UNE JUMELLE ANGLAISE — app/(site)/en/services/reseaux-sociaux/page.tsx.
 * Les deux rendent LE MEME composant et LA MEME matiere ; seule la locale
 * change. La locale « fr » est desormais passee EXPLICITEMENT ici, alors
 * qu elle est aussi le defaut : ecrite, elle se voit a la relecture et elle
 * met les deux pages sur le meme pied. Elle ne change rien a ce que cette
 * page rend.
 */

// Meme raison qu app/(site)/services/page.tsx : la page lit Postgres, et
// `next build` tourne sans base joignable (l etage builder du Dockerfile n en
// a aucune). Sans force-dynamic, Next tenterait un prerendu au build et la
// construction echouerait sur P1001.
export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataFamille("reseaux-sociaux", "fr");

export default function ReseauxSociaux() {
  return <PageFamille slug="reseaux-sociaux" locale="fr" />;
}
