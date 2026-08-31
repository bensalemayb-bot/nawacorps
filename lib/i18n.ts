/**
 * FONDATION i18n — la mécanique, et rien qu'elle.
 *
 * Ce fichier ne contient AUCUN texte du site : il ne décide que des URL, de la
 * langue courante et de l'attribut `lang`. Les chaînes vivent dans
 * `lib/dictionnaires/`.
 *
 * LES DEUX RÈGLES D'ARCHITECTURE, arrêtées et non rediscutables ici :
 *
 *  1. LE FRANÇAIS GARDE SES URL ACTUELLES, SANS PRÉFIXE. `/`, `/services`,
 *     `/studio` restent exactement ce qu'elles sont. L'anglais vit sous `/en`.
 *     Déplacer le français sous `/fr` aurait cassé les seize canoniques du site
 *     au moment précis où il se fait indexer — un site qui change toutes ses
 *     adresses redémarre son référencement à zéro.
 *
 *  2. `<html lang>` VARIE PAR UN EN-TÊTE posé par `proxy.ts` et lu par
 *     `app/layout.tsx`. Il n'existe qu'un seul layout racine et il ne rend
 *     qu'un seul `<html>` : sans en-tête, la seule autre issue serait de
 *     dédoubler ce layout par groupe de routes, c'est-à-dire de dupliquer les
 *     polices, les feuilles de style et le `<body>`.
 *
 * POURQUOI TOUT EST SYNCHRONE ET SANS DÉPENDANCE. Ce module est importé par
 * `proxy.ts`, qui tourne sur le runtime edge à CHAQUE requête : il ne doit rien
 * charger, rien lire, rien allouer de durable. Ce sont des fonctions pures sur
 * des chaînes, et elles doivent le rester.
 */

/** Les deux langues du site. Le français est la langue par défaut. */
export type Locale = "fr" | "en";

/**
 * L'ordre compte : `LOCALE_DEFAUT` en premier, puis les langues préfixées.
 * `localeDepuisChemin` parcourt cette liste et s'arrête au premier préfixe
 * reconnu.
 */
export const LOCALES = ["fr", "en"] as const;

/** La langue servie quand rien ne dit le contraire. */
export const LOCALE_DEFAUT: Locale = "fr";

/**
 * Le préfixe d'URL de chaque langue. Le français n'en a PAS — c'est la
 * décision d'architecture n° 1, et c'est la chaîne vide qui l'encode.
 *
 * Ajouter une langue demain (`de: "/de"`) suffit à faire fonctionner
 * `localeDepuisChemin`, `lien` et `cheminSansLocale` : aucune des trois n'écrit
 * « en » en dur.
 */
export const PREFIXE: Record<Locale, string> = {
  fr: "",
  en: "/en",
};

/**
 * La valeur de `<html lang>` — le code de langue COMPLET, région comprise.
 *
 * `fr-CH` et non `fr` : le marché est Genève, et la variante suisse porte des
 * conventions réelles (typographie, formats de nombre, « septante »). C'est
 * aussi le code que reprennent les `hreflang` de `alternatesPage`
 * (lib/site.ts) — les deux doivent dire la même chose, sinon Google reçoit
 * deux déclarations de langue contradictoires pour la même page.
 *
 * `en-CH` n'est pas une bizarrerie : la page anglaise s'adresse aux
 * anglophones DE SUISSE, pas au Royaume-Uni. C'est ce que `hreflang` sert à
 * dire.
 */
export const LANGUE_HTML: Record<Locale, string> = {
  fr: "fr-CH",
  en: "en-CH",
};

/**
 * Le nom de l'en-tête que `proxy.ts` pose et que `app/layout.tsx` lit.
 *
 * Écrit ICI et nulle part ailleurs : un en-tête dont le nom est recopié des
 * deux côtés finit par diverger d'une lettre, et l'échec est SILENCIEUX — le
 * layout retombe sur le français et personne ne voit rien.
 *
 * Le préfixe `x-nawa-` évite toute collision avec un en-tête réel ou avec un
 * en-tête interne de Next.
 */
export const EN_TETE_LOCALE = "x-nawa-locale";

/**
 * LES CHEMINS QUI EXISTENT VRAIMENT EN ANGLAIS — la liste que les agents de
 * traduction allongent, page par page.
 *
 * POURQUOI ELLE EXISTE. `alternatesPage` et le sitemap déclarent à Google que
 * telle page a une jumelle anglaise. Si cette jumelle n'existe pas encore, on
 * annonce une URL qui répond 404 : un `hreflang` cassé est pire que pas de
 * `hreflang` du tout — Google cesse d'associer les deux versions, et un
 * sitemap plein de 404 fait perdre du budget de crawl au site entier.
 *
 * Les chemins sont SANS PRÉFIXE DE LANGUE, c'est-à-dire la forme française :
 * `"/studio"`, jamais `"/en/studio"`. C'est la même forme que celle attendue
 * par `lien()` et rendue par `cheminSansLocale()`.
 *
 * COMMENT ON L'ALLONGE : le jour où `app/(site)/en/studio/page.tsx` existe et
 * répond 200, on ajoute `"/studio"` ici. Une ligne, un seul endroit, et les
 * `hreflang` comme le sitemap suivent.
 */
export const CHEMINS_TRADUITS: readonly string[] = [
  // L'accueil.
  "/",

  // Le catalogue et les trois formules. `estTraduit` compare des chaînes
  // EXACTES : les formules se listent une par une, « /services/[slug] »
  // ne correspondrait à rien.
  "/services",
  "/services/la-vitrine",
  "/services/le-site",
  "/services/l-assistant",

  // Les cinq familles de prestations.
  "/services/identite",
  "/services/imprimes",
  "/services/reseaux-sociaux",
  "/services/restauration",
  "/services/suivi",

  // Les pages de confiance et de conversion.
  "/studio",
  "/contact",
  "/demonstrations",
  "/devis",

  // Les pages légales. Elles comptent : un site qui vend sans mentions
  // légales lisibles par son lecteur n'est pas complet.
  "/mentions-legales",
  "/confidentialite",
];

/** Vrai si ce chemin (forme française, sans préfixe) a une jumelle anglaise. */
export function estTraduit(chemin: string): boolean {
  return CHEMINS_TRADUITS.includes(chemin);
}

/** Garde de type — sert à valider l'en-tête reçu du proxy, qui est `string | null`. */
export function estLocale(valeur: string | null | undefined): valeur is Locale {
  return valeur === "fr" || valeur === "en";
}

/**
 * La langue d'un chemin d'URL.
 *
 * `/en` et `/en/...` sont anglais ; TOUT LE RESTE est français, y compris les
 * chemins inconnus — un 404 doit rester lisible, et il le sera en français.
 *
 * ATTENTION AU PIÈGE DU PRÉFIXE PARTIEL : `/energie` commence par les mêmes
 * trois caractères que `/en` sans être anglais pour autant. C'est pourquoi le
 * test compare l'égalité stricte OU le préfixe SUIVI D'UNE BARRE, jamais
 * `startsWith("/en")` seul.
 *
 * @param pathname le chemin seul, sans requête ni fragment — c'est exactement
 *   ce que rend `request.nextUrl.pathname`.
 */
export function localeDepuisChemin(pathname: string): Locale {
  for (const locale of LOCALES) {
    const prefixe = PREFIXE[locale];
    if (!prefixe) continue;
    if (pathname === prefixe || pathname.startsWith(`${prefixe}/`)) return locale;
  }
  return LOCALE_DEFAUT;
}

/**
 * Reconnaît ce qui ne doit JAMAIS être préfixé : `http:`, `https:`, `mailto:`,
 * `tel:`, `wa.me` via https, et tout autre schéma d'URI.
 *
 * La forme est celle de la RFC 3986 : une lettre, puis lettres, chiffres, `+`,
 * `-` ou `.`, puis deux-points.
 */
const SCHEMA_URI = /^[a-z][a-z0-9+.-]*:/i;

/**
 * LIEN — le helper que tous les composants utilisent pour écrire une URL
 * interne. C'est la fonction la plus appelée de tout le chantier i18n.
 *
 * En français elle rend le chemin TEL QUEL, à l'octet près : le site actuel ne
 * change pas d'une URL. En anglais elle préfixe `/en`.
 *
 * ```tsx
 * <a href={lien(locale, "/studio")}>…</a>   // fr → /studio     en → /en/studio
 * ```
 *
 * CE QU'ELLE NE TOUCHE PAS, et c'est la moitié de son travail :
 *
 *  - les liens EXTERNES — `https://wa.me/…`, `mailto:…`, `tel:…`, et les URL
 *    protocole-relatives `//exemple.ch`. Préfixer un `mailto:` produirait
 *    `/en/mailto:ayoub@…`, un lien mort. Le site en compte plusieurs dizaines
 *    (WhatsApp, e-mail, téléphone) et ils passent tous par ce helper sans
 *    précaution particulière côté appelant : c'est le but.
 *  - les ANCRES PURES — `#contact`. Une ancre seule désigne le document
 *    courant ; elle est déjà dans la bonne langue par construction.
 *  - les chemins RELATIFS (`services/x`, `../x`). On ne sait pas d'où ils
 *    partent, donc on ne les préfixe pas. Le site public n'en écrit aucun ;
 *    si l'un apparaît, il sera faux en anglais — c'est délibéré, mieux vaut un
 *    lien visiblement non traduit qu'une URL fabriquée au hasard.
 *
 * LES CAS LIMITES, tous couverts et tous testés à la main :
 *
 *  | chemin        | fr            | en                |
 *  |---------------|---------------|-------------------|
 *  | `/`           | `/`           | `/en`  (pas `/en/`) |
 *  | `/studio`     | `/studio`     | `/en/studio`      |
 *  | `/#top`       | `/#top`       | `/en#top`         |
 *  | `/devis?p=x`  | `/devis?p=x`  | `/en/devis?p=x`   |
 *  | `#contact`    | `#contact`    | `#contact`        |
 *  | `/en/studio`  | `/en/studio`  | `/en/studio`      |
 *  | `/energie`    | `/energie`    | `/en/energie`     |
 *  | `mailto:a@b`  | `mailto:a@b`  | `mailto:a@b`      |
 *
 * `/` → `/en` ET NON `/en/` : les deux répondent, mais Next canonise sur la
 * forme sans barre finale et la canonique de la page d'accueil anglaise
 * s'écrit `/en`. Deux formes pour une page, c'est une page dupliquée.
 *
 * ELLE EST IDEMPOTENTE : `lien("en", lien("en", x)) === lien("en", x)`. Un
 * chemin déjà préfixé traverse la fonction sans changer, ce qui rend inoffensif
 * le composant qui l'appellerait deux fois — cas qui arrive dès qu'un chemin
 * déjà localisé passe par un helper partagé.
 */
export function lien(locale: Locale, chemin: string): string {
  const prefixe = PREFIXE[locale];

  // Français : rien à faire, et surtout rien à casser.
  if (!prefixe) return chemin;

  // Vide, ancre pure, URL protocole-relative, schéma d'URI : hors périmètre.
  if (chemin === "" || chemin.startsWith("#")) return chemin;
  if (chemin.startsWith("//") || SCHEMA_URI.test(chemin)) return chemin;

  // Chemin relatif : on ne sait pas d'où il part (voir le docblock).
  if (!chemin.startsWith("/")) return chemin;

  // Déjà préfixé — l'idempotence. Le test couvre les quatre suites possibles
  // du préfixe (fin de chaîne, `/`, `#`, `?`) et EXCLUT ainsi `/energie`.
  if (
    chemin === prefixe ||
    chemin.startsWith(`${prefixe}/`) ||
    chemin.startsWith(`${prefixe}#`) ||
    chemin.startsWith(`${prefixe}?`)
  ) {
    return chemin;
  }

  // La racine, seule ou suivie d'un fragment ou d'une requête : on retire la
  // barre pour ne pas produire `/en/#top` ni `/en/?p=x`.
  if (chemin === "/" || chemin.startsWith("/#") || chemin.startsWith("/?")) {
    return `${prefixe}${chemin.slice(1)}`;
  }

  return `${prefixe}${chemin}`;
}

/**
 * L'INVERSE DE `lien` — rend la forme française d'un chemin, quel que soit son
 * préfixe.
 *
 * Deux usages, et ils sont tous les deux structurants :
 *
 *  1. LE SÉLECTEUR DE LANGUE. Pour proposer « English » depuis `/studio`, il
 *     faut d'abord retirer le préfixe courant, puis appliquer l'autre :
 *     `lien("en", cheminSansLocale(pathname))`. Sans ce retrait, le sélecteur
 *     empilerait les préfixes depuis une page déjà anglaise.
 *  2. LES CANONIQUES ET LES `hreflang`. `alternatesPage` reçoit la forme
 *     française et fabrique les deux URL ; c'est cette fonction qui garantit
 *     qu'on lui donne bien cette forme-là.
 *
 * `/en` → `/` : la racine anglaise dépréfixée est la racine, pas la chaîne
 * vide — un `href=""` recharge la page courante au lieu d'aller à l'accueil.
 */
export function cheminSansLocale(pathname: string): string {
  const prefixe = PREFIXE[localeDepuisChemin(pathname)];
  if (!prefixe) return pathname;
  const reste = pathname.slice(prefixe.length);
  return reste === "" || reste === "/" ? "/" : reste;
}
