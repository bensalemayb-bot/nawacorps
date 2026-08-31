import type { Locale } from "@/lib/i18n";
import en from "@/lib/dictionnaires/en";
import fr, { type Dictionnaire } from "@/lib/dictionnaires/fr";

export type { Dictionnaire };

/**
 * LE CHARGEUR — le seul point d'entrée des composants vers les chaînes.
 *
 * ```tsx
 * import { dictionnaire } from "@/lib/dictionnaires";
 * const t = dictionnaire(locale);
 * <a href={lien(locale, "/studio")}>{t.nav.studio}</a>
 * ```
 *
 * IL EST SYNCHRONE, ET IL DOIT LE RESTER. Le patron habituel des projets
 * Next — `const d = await import(`./${locale}`)` — existe pour ne pas envoyer
 * vingt langues dans le paquet du navigateur. Ici il n'y en a que deux, elles
 * pèsent quelques kilo-octets, et le site est rendu très majoritairement côté
 * serveur : le découpage n'économiserait rien et coûterait cher.
 *
 * Il coûterait cher parce qu'un `await` contamine tout ce qui l'appelle.
 * `components/ContactForm.tsx` est un composant CLIENT et ne peut pas être
 * `async` ; `components/Nav.tsx` et `components/MenuOverlay.tsx` sont rendus
 * par le layout du site public, à chaque page. Rendre le chargement
 * asynchrone obligerait à faire remonter la promesse jusqu'au layout et à la
 * redescendre en prop dans tout le chrome — pour économiser trois kilo-octets
 * qu'on paierait deux fois en complexité.
 *
 * L'ENREGISTREMENT EST EXHAUSTIF PAR CONSTRUCTION : `Record<Locale, …>` ne
 * compile pas si une langue ajoutée à `Locale` n'a pas son dictionnaire ici.
 * C'est la même garde que celle de `PREFIXE` et `LANGUE_HTML` dans
 * `lib/i18n.ts` — ajouter une langue casse la compilation partout où il faut
 * intervenir, ce qui est exactement le comportement voulu.
 */
const DICTIONNAIRES: Record<Locale, Dictionnaire> = { fr, en };

/** Les chaînes du site dans la langue demandée. */
export function dictionnaire(locale: Locale): Dictionnaire {
  return DICTIONNAIRES[locale];
}
