import type { Metadata } from "next";
import PageFamille from "@/components/PageFamille";
import { metadataFamille } from "@/lib/familles";
// Meme feuille que la page francaise, et c est le point : le dessin des cinq
// pages de famille ne change pas avec la langue. Un CSS global s importe
// depuis n importe quelle page en App Router — voir
// node_modules/next/dist/docs/01-app/01-getting-started/11-css.md.
import "@/app/services.css";

/**
 * /en/services/imprimes — Print
 *
 * LA JUMELLE ANGLAISE DE /services/imprimes. Elle rend LE MEME COMPOSANT avec
 * une locale de plus : tout ce qui s affiche vient de `FAMILLES.imprimes`
 * (champs `En`, repli sur le francais) et de Postgres. Aucune phrase n est
 * ecrite ici.
 *
 * C EST LA SEULE DES CINQ PAGES OU LE DELAI FIGURE — « one week », dans la
 * reponse a « I need a poster for next week », et il y voyage avec son point
 * de depart (« from your go-ahead »). Le glossaire §5 proscrit tout compte
 * d heures et interdit au delai de voyager seul : ne pas l etendre aux quatre
 * autres pages, le positionnement ne porte ce delai que sur le site.
 *
 * LE SLUG DU SEGMENT NE SE TRADUIT PAS — c est « imprimes », pas « print ».
 * Les dix-sept liens du catalogue pointent `/services/<famille>#<slug>`
 * (lib/catalogue-familles.ts, `hrefService`), et `lien("en", …)` se contente
 * de prefixer `/en` sans reecrire le chemin.
 *
 * SEGMENT STATIQUE, COMME SON JUMEAU FRANCAIS : il l emporte sur le voisin
 * [slug], qui ne sert que les trois formules de site.
 */

// Meme raison que la page francaise : la page lit Postgres, et `next build`
// tourne sans base joignable (l etage builder du Dockerfile n en a aucune).
// Sans force-dynamic, Next tenterait un prerendu au build et la construction
// echouerait sur P1001.
export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataFamille("imprimes", "en");

export default function ImprimesEn() {
  return <PageFamille slug="imprimes" locale="en" />;
}
