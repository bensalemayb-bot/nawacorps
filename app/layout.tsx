import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${hanken.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
