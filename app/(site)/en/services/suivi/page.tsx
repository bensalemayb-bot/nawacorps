import type { Metadata } from "next";
import PageFamille from "@/components/PageFamille";
import { metadataFamille } from "@/lib/familles";
// Meme feuille que la page francaise, et c est le point : le dessin des cinq
// pages de famille ne change pas avec la langue. Un CSS global s importe
// depuis n importe quelle page en App Router — voir
// node_modules/next/dist/docs/01-app/01-getting-started/11-css.md.
import "@/app/services.css";

/**
 * /en/services/suivi — Upkeep & hosting
 *
 * LA JUMELLE ANGLAISE DE /services/suivi. Elle rend LE MEME COMPOSANT avec une
 * locale de plus ; toute la matiere vient de `FAMILLES.suivi` et de Postgres.
 *
 * LA SEULE PAGE MIXTE DES CINQ, ET C EST CE QUI LA REND SENSIBLE : les deux
 * abonnements mensuels y portent un PRIX AFFICHE — les deux seuls de ces cinq
 * pages — et la version anglaise du site s y chiffre sur devis. « VAT
 * included » figure donc sous chacun des deux montants, dans la meme unite de
 * lecture, exactement comme « TVA comprise » cote francais : la mention vient
 * de `mentionTva(locale)` (lib/format.ts) et n est recopiee nulle part. Et
 * l abonnement impose par la formule qui embarque l assistant est annonce avec
 * le mot « compulsory » — un prix mensuel impose passe sous silence est un
 * prix cache, dans les deux langues.
 *
 * « upkeep » ET NON « maintenance » DANS TOUT LE TEXTE VISIBLE (glossaire §3).
 * Le mot « maintenance » n apparait qu a UN endroit du site : le `serviceTypeEn`
 * de cette famille, en JSON-LD, ou le lecteur est une machine et ou
 * « Website maintenance » est un type reconnu que « upkeep » n est pas
 * (glossaire §7). C est delibere, c est commente sur place dans
 * lib/familles.ts, et ce n est pas une infraction a corriger.
 *
 * LE SLUG DU SEGMENT NE SE TRADUIT PAS — c est « suivi », pas « upkeep ». Les
 * liens du catalogue pointent `/services/suivi#hebergement`,
 * `#suivi-assistant` et `#traduction` ; `lien("en", …)` prefixe `/en` et ne
 * touche ni au chemin ni a l ancre.
 */

// Meme raison que la page francaise : la page lit Postgres, et `next build`
// tourne sans base joignable (l etage builder du Dockerfile n en a aucune).
// Sans force-dynamic, Next tenterait un prerendu au build et la construction
// echouerait sur P1001.
export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataFamille("suivi", "en");

export default function SuiviEn() {
  return <PageFamille slug="suivi" locale="en" />;
}
