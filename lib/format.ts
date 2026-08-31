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
 * IL N Y A PLUS DE NOTE SOUS « sur devis », ET C EST VOULU.
 *
 * Cette constante valait « chiffré après deux questions » et s affichait sur
 * chaque carte au prix libre — quatre fois sur le seul accueil. Elle a ete
 * retiree le 31 aout 2026 : CES DEUX QUESTIONS N EXISTAIENT NULLE PART. Ni
 * dans le formulaire, ni dans l assistant, ni dans aucun parcours du site.
 * La regle de preuve (guide de voix §8) interdit d affirmer un processus qui
 * n a pas lieu, et une promesse de methode est aussi engageante qu une
 * promesse de prix.
 *
 * L argument de depart reste juste : seul, « sur devis » se lit comme un trou.
 * Mais il se comble en prose, une fois par bloc, la ou on a la place de dire
 * POURQUOI un tirage, un format et un papier ne se devinent pas — et cette
 * prose se termine deja par « Réponse le jour ouvrable suivant. », le seul
 * engagement decide, qui repond a la question que « sur devis » laisse
 * reellement ouverte : quand est-ce que je saurai le prix ?
 *
 * A NE PAS REINTRODUIRE sans avoir d abord ecrit les deux questions et les
 * avoir posees quelque part.
 */

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
