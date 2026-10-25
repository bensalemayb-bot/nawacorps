import type { Metadata } from "next";
import { corpsDemonstrations, metadataDemonstrations } from "../../demonstrations/page";

/**
 * /en/demonstrations — les exemples d automatisation par metier, en anglais.
 * Le corps vit dans app/(site)/demonstrations/page.tsx, les textes dans
 * lib/automatisations.ts ; le chemin reste francais (`lien()` prefixe `/en`
 * sans traduire, lib/i18n.ts).
 */
export const metadata: Metadata = metadataDemonstrations("en");

export default function DemonstrationsEn() {
  return corpsDemonstrations("en");
}
