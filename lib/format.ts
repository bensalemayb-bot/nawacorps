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

/**
 * LA MENTION QUI ACCOMPAGNE UN MONTANT, ecrite une seule fois pour tout le
 * site.
 *
 * Elle est obligatoire — CLAUDE.md, Interdits — et elle vaut PAR UNITE DE
 * LECTURE : un montant en tete de page n est pas couvert par une note deux
 * ecrans plus bas. C est pour cela qu elle vit ici, a cote du formatage du
 * montant, et non dans une phrase de bas de grille : ce qui affiche un prix
 * doit avoir la mention sous la main.
 *
 * lib/familles.ts la reprend telle quelle dans sa phrase longue. Deux copies
 * du meme mot divergent toujours, et celle-ci a valeur legale.
 */
export const TVA_LABEL = "TVA comprise";

/**
 * CE QUI SE LIT SOUS « sur devis », et pourquoi il y a quelque chose a lire.
 *
 * Treize des dix-huit lignes du catalogue sont sur devis. Seul, « sur devis »
 * se lit comme un trou — une information qu on refuse de donner. Ce n en est
 * pas une : un imprime se chiffre selon le tirage, le format, le papier et
 * l urgence, et deux questions posees avant de chiffrer donnent un prix juste
 * du premier coup, la ou un tarif affiche hors contexte devrait etre corrige
 * devant le client. Trois mots suffisent a le dire sur la carte ; le
 * raisonnement complet vit une fois par bloc, en prose.
 */
export const QUOTE_NOTE = "chiffré après deux questions";

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
