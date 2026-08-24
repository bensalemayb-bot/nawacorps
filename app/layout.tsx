import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./binacore.css";
import "./chat.css";
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

// Poids statiques, volontairement pas la police variable : la maquette charge
// 300/400/500/600/700 via <link>, et font-weight:550 (10 occurrences) s'y resout
// en 600. La police variable rendrait un vrai 550, plus leger.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
