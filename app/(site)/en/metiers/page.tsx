import type { Metadata } from "next";
import { corpsMetiers, metadataMetiers } from "../../metiers/page";

/**
 * /en/metiers — le hub des metiers en anglais. Le corps et les textes vivent
 * dans app/(site)/metiers/page.tsx et lib/metiers.ts ; le chemin reste
 * francais (`lien()` prefixe `/en` sans traduire, lib/i18n.ts).
 */
export const metadata: Metadata = metadataMetiers("en");

export default function MetiersEn() {
  return corpsMetiers("en");
}
