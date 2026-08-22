/**
 * Formatage des prix, aligne au caractere pres sur reference/binacore.html.
 *
 * Fonctions pures : ni DOM, ni base, ni date. Testables tel quel.
 *
 * Deux codepoints ont ete releves dans la maquette et sont volontairement
 * ecrits en dur ici — ce sont des caracteres de mise en forme, pas des prix :
 *  - separateur de milliers : U+0027, apostrophe DROITE (`1'950`).
 *    D'ou le groupement manuel plus bas : toLocaleString("de-CH") emet U+2019
 *    avec l'ICU moderne et casserait la fidelite.
 *  - unite monetaire : U+2013, tiret demi-cadratin (`.–`), et non un trait
 *    d'union U+002D.
 */

export type ServicePriceType = "FIXED" | "FROM" | "QUOTE";

export type ServicePrice = {
  priceType: ServicePriceType;
  priceCents: number | null;
  priceFrom: boolean;
  isMonthly: boolean;
};

/** U+0027 — apostrophe droite, comme dans la maquette. */
const THOUSANDS_SEPARATOR = "'";

/** U+002E + U+2013 — le suffixe monetaire de la maquette. */
export const CHF_UNIT = ".–";

export const QUOTE_LABEL = "sur devis";
export const FROM_PREFIX = "dès";
export const MONTHLY_SUFFIX = "/mois";

/** 195000 -> "1'950" ; 4900 -> "49" ; 45000 -> "450" */
export function formatChfAmount(cents: number): string {
  const francs = Math.round(cents / 100);
  return String(francs).replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
}

/** Vrai si le service se traite sur devis : aucun chiffre ne doit s'afficher. */
export function isQuote(service: ServicePrice): boolean {
  return service.priceType === "QUOTE" || service.priceCents === null;
}

/**
 * Chaine canonique complete.
 *   { FIXED, 45000 }                        -> "450.–"
 *   { FROM, 12000, priceFrom }              -> "dès 120.–"
 *   { FIXED, 39000, isMonthly }             -> "390.–/mois"
 *   { QUOTE, null }                         -> "sur devis"
 */
export function formatServicePrice(service: ServicePrice): string {
  if (isQuote(service)) return QUOTE_LABEL;

  const amount = formatChfAmount(service.priceCents as number);
  const prefix = service.priceFrom ? `${FROM_PREFIX} ` : "";
  const suffix = service.isMonthly ? MONTHLY_SUFFIX : "";

  return `${prefix}${amount}${CHF_UNIT}${suffix}`;
}
