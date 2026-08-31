import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { headers } from "next/headers";
import { EN_TETE_LOCALE, LANGUE_HTML, LOCALE_DEFAUT, estLocale } from "@/lib/i18n";
import "./globals.css";
import "./binacore.css";
import "./chat.css";
import "./noyau.css";
import "./fonts.css";

/**
 * Layout RACINE — reduit au strict minimum au bloc B11.
 *
 * Il ne porte plus que ce qui doit valoir pour TOUTE l application, publique
 * ou non : la balise html avec ses variables de police, le body, et les
 * feuilles de style globales. Rien d autre.
 *
 * Le chrome public — loader, curseur, nav, menu, interactions, chatbot,
 * scroll inertiel — est descendu dans app/(site)/layout.tsx. C est ce qui
 * permet a /admin de n en heriter d AUCUN : un back-office n a que faire d un
 * scroll inertiel ou d un assistant de qualification.
 *
 * Les metadata du site public ont suivi le chrome dans (site) : elles
 * decrivent le studio, pas l administration.
 */

// Poids DECLARES un par un, volontairement pas `weight: "variable"` : chaque
// @font-face n annonce alors qu UN poids, et font-weight:550 (11 occurrences en
// CSS) se resout sur le voisin le plus proche au-dessus, soit 600. Declarer
// l axe variable rendrait un vrai 550, plus leger — donc un autre dessin.
//
// CE QUE CE TABLEAU NE COUTE PAS, mesure et non suppose : Google sert Hanken
// Grotesk en fichier VARIABLE. Les cinq poids pointaient tous vers les memes
// quatre .woff2 (un par unicode-range), aux memes octets. Retirer le 300 n a
// donc retire AUCUN fichier ni AUCUN octet de police — seulement quatre regles
// @font-face. Il est retire quand meme parce qu il ne servait a rien : aucune
// regle du site n emploie un poids inferieur a 400 (verifie sur app/*.css et
// sur le JSX). La resolution du 550 est inchangee, 300 present ou non.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hanken",
});

// Italique indispensable : .serif-i et 12 regles en var(--serif).
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

/**
 * LA LANGUE DU DOCUMENT — lue dans l'en-tête posé par `proxy.ts`.
 *
 * `<html lang>` est le seul attribut du site qui doit changer avec la langue
 * alors qu'il n'est écrit qu'ICI, dans le layout racine, pour toutes les
 * routes à la fois. Il n'existe pas de moyen de le faire varier depuis un
 * layout enfant : `/en` ne rend pas son propre `<html>`, il rend le contenu de
 * celui-ci. D'où l'en-tête — voir le docblock de `proxy.ts` pour le détail des
 * autres pistes et pourquoi elles ne tiennent pas.
 *
 * `headers()` EST ASYNCHRONE DEPUIS NEXT 15 : ce layout est donc `async`. Voir
 * `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/headers.md`.
 *
 * CE QUE CELA COÛTE, ET IL FAUT LE SAVOIR : `headers()` est une API DE TEMPS
 * DE REQUÊTE. L'appeler ici bascule TOUTES les routes en rendu dynamique,
 * y compris les cinq pages qui étaient encore prérendues au build
 * (/studio, /contact, /demonstrations, /mentions-legales, /confidentialite) et
 * la 404. Les neuf autres pages du site publiques étaient déjà en
 * `force-dynamic` parce qu'elles lisent Postgres — pour elles, rien ne change.
 * Ces cinq-là ne lisent aucune base : ce qu'elles perdent, c'est du HTML
 * fabriqué une fois au build plutôt qu'à chaque visite, pas un aller-retour
 * réseau. Le repère mesuré et consigné dans `app/(site)/page.tsx` reste le
 * bon : 4 ms de TTFB pour une page légale statique, 17 ms pour une page
 * dynamique qui interroge deux fois la base.
 *
 * LE REPLI EST LE FRANÇAIS, et il est atteignable pour de vrai : `proxy.ts`
 * ne tourne pas sur `/admin`, ni sur les routes d'API, ni sur les fichiers
 * statiques. L'en-tête est alors absent et `estLocale` rend `false` — le
 * back-office reçoit `lang="fr-CH"`, ce qui est exactement ce qu'il faut. Ce
 * repli protège aussi du cas où quelqu'un fabriquerait la requête à la main :
 * un `x-nawa-locale: de` n'est pas une locale connue, il est ignoré.
 */
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const entete = (await headers()).get(EN_TETE_LOCALE);
  const locale = estLocale(entete) ? entete : LOCALE_DEFAUT;

  return (
    <html
      lang={LANGUE_HTML[locale]}
      className={`${hanken.variable} ${instrument.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
