import type { Metadata } from "next";
import PageFamille from "@/components/PageFamille";
import { metadataFamille } from "@/lib/familles";
// Meme feuille que la page francaise, et c est le point : le dessin des cinq
// pages de famille ne change pas avec la langue. Un CSS global s importe
// depuis n importe quelle page en App Router — voir
// node_modules/next/dist/docs/01-app/01-getting-started/11-css.md.
import "@/app/services.css";

/**
 * /en/services/restauration — Restaurants and cafés
 *
 * LA JUMELLE ANGLAISE DE /services/restauration. Elle rend LE MEME COMPOSANT
 * avec une locale de plus ; toute la matiere vient de `FAMILLES.restauration`
 * et de Postgres.
 *
 * CINQ PRESTATIONS, LA PAGE LA PLUS LONGUE DES CINQ. C est la ligne secondaire
 * du studio : elle vit hors de la grille principale et se commande sans site,
 * ce que la premiere question rappelle dans les deux langues.
 *
 * DEUX NOMS PROPRES GENEVOIS Y RESTENT EN FRANCAIS, et c est le glossaire §7
 * qui le decide : « l Escalade » ne se traduit ni ne se glose — le lecteur
 * anglophone vise habite Geneve et la fete chaque annee —, et « la rentrée »,
 * qui n a pas d equivalent, se dit par son moment (« September comes round »).
 *
 * LE SLUG DU SEGMENT NE SE TRADUIT PAS — c est « restauration », pas
 * « restaurants ». Les liens du catalogue pointent
 * `/services/restauration#<slug>` et `lien("en", …)` se contente de prefixer.
 */

// Meme raison que la page francaise : la page lit Postgres, et `next build`
// tourne sans base joignable (l etage builder du Dockerfile n en a aucune).
// Sans force-dynamic, Next tenterait un prerendu au build et la construction
// echouerait sur P1001.
export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataFamille("restauration", "en");

export default function RestaurationEn() {
  return <PageFamille slug="restauration" locale="en" />;
}
