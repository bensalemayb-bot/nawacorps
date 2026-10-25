import type { Metadata } from "next";
import { corpsServices, metadataServices } from "../../services/page";

/**
 * /en/services — « The assistant, in detail ».
 *
 * Aucun contenu ici : le corps, les textes des deux langues et les metadonnees
 * vivent dans app/(site)/services/page.tsx. Il ne reste que la route et la
 * langue, pour que les deux versions ne puissent pas diverger.
 *
 * `dynamic` EST REDECLARE : la configuration de segment se lit sur le fichier
 * de la route, jamais sur un module importe. La page lit le montant de la mise
 * en place en base ; sans cette ligne, Next tenterait de la prerendre au build.
 */
export const dynamic = "force-dynamic";

/** Canonique `/en/services`, Open Graph anglais et hreflang croises. */
export const metadata: Metadata = metadataServices("en");

export default async function ServicesEn() {
  return corpsServices("en");
}
