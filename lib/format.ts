import type { Locale } from "@/lib/i18n";

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
 *
 * CE FICHIER EST BILINGUE DEPUIS LE CHANTIER ANGLAIS, ET IL L EST D UNE SEULE
 * FACON : les MOTS changent de langue, les CHIFFRES jamais.
 *
 *  - « pas de TVA (entreprise non assujettie) » devient « no VAT (business
 *    not VAT-registered) », « sur devis » devient « on request ». Le
 *    glossaire (docs/agents/brand/glossaire-anglais.md §3) interdit toujours
 *    « incl. VAT », « TTC » et « plus VAT ».
 *  - `699.–` et `1'499.–` s ecrivent PAREIL en anglais : meme apostrophe de
 *    milliers, meme suffixe `.–`. Ni `CHF 699`, ni `699 CHF`, ni `€`. C est
 *    une regle du glossaire (§5) et non une commodite : le montant est un
 *    montant suisse, pas une somme convertie, et le lecteur anglophone de
 *    Geneve lit deja ce format sur toutes ses factures.
 *
 * LE PARAMETRE `locale` EST TOUJOURS EN DERNIERE POSITION ET VAUT « fr » PAR
 * DEFAUT. Une quarantaine d appels existent deja dans le site francais ; aucun
 * n a eu a bouger. Un appel sans locale rend donc exactement ce qu il rendait
 * avant ce chantier, a l octet pres — c est la condition qui rendait la bascule
 * sure.
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

/**
 * U+002E + U+2013 — le suffixe monetaire de la maquette.
 *
 * IL N A PAS DE VARIANTE ANGLAISE, et ce n est pas un oubli : voir l en-tete,
 * glossaire §5. C est pourquoi il reste une constante et non un enregistrement
 * par langue.
 */
export const CHF_UNIT = ".–";

/**
 * LES QUATRE MENTIONS QUI ACCOMPAGNENT UN MONTANT, dans les deux langues.
 *
 * Chaque enregistrement est indexe par `Locale` : ajouter une langue a
 * `lib/i18n.ts` casse la compilation ICI tant que sa colonne n est pas
 * remplie. C est la meme garde que `PREFIXE` et `LANGUE_HTML` — une mention de
 * prix manquante ne doit jamais tomber en production, elle a valeur legale.
 *
 * Les quatre constantes historiques (`QUOTE_LABEL`, `FROM_PREFIX`,
 * `MONTHLY_SUFFIX`, `TVA_LABEL`) SURVIVENT et sont derivees de ces tables :
 * des appelants historiques les importent encore (dont /admin). Les DERIVER
 * evite qu une valeur francaise existe a deux endroits et diverge.
 */
const LIBELLES_DEVIS: Record<Locale, string> = {
  fr: "sur devis",
  // Glossaire §3 : « on request ». Ni « on quote », ni « price on application ».
  en: "on request",
};

const PREFIXES_DES: Record<Locale, string> = {
  fr: "dès",
  en: "from",
};

const SUFFIXES_MENSUELS: Record<Locale, string> = {
  fr: "/mois",
  en: "/month",
};

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
 * Les gabarits de prix du dictionnaire la recoivent par `avecPrix()`
 * (lib/catalogue.ts), jamais recopiee. Deux copies du meme mot divergent
 * toujours, et celle-ci a valeur legale.
 *
 * POURQUOI « PAS DE TVA » ET PLUS « TVA COMPRISE » (25 octobre 2026). Nawa
 * Corps est une raison individuelle NON ASSUJETTIE a la TVA : chiffre
 * d affaires sous le seuil de 100'000.– (LTVA art. 10 al. 2 let. a). Ecrire
 * « TVA comprise » laissait croire qu une TVA etait facturee et reversee, ce
 * qui est faux — et la LCD (art. 3 al. 1 let. b) vise les indications
 * inexactes sur les prix. Le montant affiche est le montant paye, sans
 * aucune taxe a ajouter.
 *
 * LE JOUR OU LE SEUIL EST FRANCHI, l assujettissement devient obligatoire :
 * cette table se corrige alors, avec les CGV (/cgv) et le JSON-LD de
 * /services, qui declare l absence de TVA en omettant `valueAddedTaxIncluded`.
 *
 * EN ANGLAIS : « no VAT (business not VAT-registered) ». Le glossaire §3
 * proscrit toujours « incl. VAT », « TTC » et « plus VAT » — « plus VAT »
 * dirait meme qu une taxe s ajoute, l inverse de la verite.
 */
const MENTIONS_TVA: Record<Locale, string> = {
  fr: "pas de TVA (entreprise non assujettie)",
  en: "no VAT (business not VAT-registered)",
};

/** Le libelle du prix libre, dans la langue demandee. */
export function libelleDevis(locale: Locale = "fr"): string {
  return LIBELLES_DEVIS[locale];
}

/** Le prefixe d un prix plancher (« dès 120.– »), dans la langue demandee. */
export function prefixeDes(locale: Locale = "fr"): string {
  return PREFIXES_DES[locale];
}

/** Le suffixe d un prix mensuel (« 390.–/mois »), dans la langue demandee. */
export function suffixeMensuel(locale: Locale = "fr"): string {
  return SUFFIXES_MENSUELS[locale];
}

/** La mention de TVA, dans la langue demandee. Jamais un montant sans elle. */
export function mentionTva(locale: Locale = "fr"): string {
  return MENTIONS_TVA[locale];
}

/**
 * LES QUATRE CONSTANTES FRANCAISES, conservees pour les appelants existants.
 *
 * Elles ne sont PAS depreciees : dans un composant qui ne connait pas encore
 * sa langue, elles disent au moins la verite du site francais. Un composant
 * qui recoit une `locale` doit en revanche appeler la fonction — sinon la page
 * anglaise affiche la mention francaise sous un prix, ce qui est exactement le
 * genre de detail que personne ne relit.
 */
export const QUOTE_LABEL = LIBELLES_DEVIS.fr;
export const FROM_PREFIX = PREFIXES_DES.fr;
export const MONTHLY_SUFFIX = SUFFIXES_MENSUELS.fr;
export const TVA_LABEL = MENTIONS_TVA.fr;

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

/**
 * 195000 -> "1'950" ; 4900 -> "49" ; 45000 -> "450"
 *
 * PAS DE PARAMETRE `locale`, ET C EST LA REGLE, PAS UN OUBLI. Le montant
 * s ecrit pareil dans les deux langues (glossaire §5) ; lui donner une locale
 * laisserait croire qu il existe une variante anglaise a trouver, et le
 * premier agent qui chercherait a « corriger » `1'499.–` en `CHF 1,499`
 * casserait la regle.
 */
export function formatChfAmount(cents: number): string {
  const francs = Math.round(cents / 100);
  return String(francs).replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
}

/**
 * Vrai si le service se traite sur devis : aucun chiffre ne doit s'afficher.
 *
 * Predicat sur des donnees, pas sur du texte : aucune locale ici non plus.
 */
export function isQuote(service: ServicePrice): boolean {
  return service.priceType === "QUOTE" || service.priceCents === null;
}

/**
 * Chaine canonique complete.
 *   { FIXED, 45000 }                        -> "450.–"           / "450.–"
 *   { FROM, 12000, priceFrom }              -> "dès 120.–"       / "from 120.–"
 *   { FIXED, 39000, isMonthly }             -> "390.–/mois"      / "390.–/month"
 *   { QUOTE, null }                         -> "sur devis"       / "on request"
 *
 * SEULS LES MOTS CHANGENT. Le nombre, son apostrophe de milliers et son
 * suffixe `.–` traversent la fonction identiques — c est verifiable ligne par
 * ligne dans le tableau ci-dessus, et c est le point a ne pas perdre de vue en
 * relisant.
 */
export function formatServicePrice(
  service: ServicePrice,
  locale: Locale = "fr",
): string {
  if (isQuote(service)) return libelleDevis(locale);

  const amount = formatChfAmount(service.priceCents as number);
  const prefix = service.priceFrom ? `${prefixeDes(locale)} ` : "";
  const suffix = service.isMonthly ? suffixeMensuel(locale) : "";

  return `${prefix}${amount}${CHF_UNIT}${suffix}`;
}
