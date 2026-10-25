import type { Metadata } from "next";
import { corpsMetier, metadataMetier } from "../../../metiers/[slug]/page";

/**
 * /en/metiers/<slug> — la page metier en anglais.
 *
 * Aucun contenu ici : le corps, les metadonnees et les textes des deux langues
 * vivent dans app/(site)/metiers/[slug]/page.tsx et lib/metiers.ts. Le slug
 * reste francais : `lien()` prefixe `/en` sans traduire le chemin
 * (lib/i18n.ts).
 *
 * `dynamic` EST REDECLARE : la configuration de segment se lit sur le fichier
 * de la route, jamais sur un module importe. La page lit le montant de la mise
 * en place en base.
 */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

/** Canonique `/en/metiers/<slug>`, Open Graph anglais, hreflang croises. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return metadataMetier("en", slug);
}

export default async function PageMetierEn({ params }: Props) {
  const { slug } = await params;
  return corpsMetier("en", slug);
}
