import type { Metadata } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import Cursor from "@/components/Cursor";
import Interactions from "@/components/Interactions";
import Loader from "@/components/Loader";
import MenuOverlay from "@/components/MenuOverlay";
import Nav from "@/components/Nav";
import "./globals.css";
import "./binacore.css";
import "./fonts.css";

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

export const metadata: Metadata = {
  title: "Binacore — Studio digital, Genève",
  description:
    "Binacore conçoit cartes, sites, affiches et réseaux sociaux pour les commerces genevois. Studio digital indépendant, Genève.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${hanken.variable} ${instrument.variable}`}>
      <body>
        {/* Ordre du <body> de reference/binacore.html (lignes 683-723).
            CRITIQUE : grain, loader, cursor, nav et menu restent HORS de
            #smoothWrap > #smooth. Le scroll inertiel applique un translate3d
            sur #smooth, et un ancetre transforme cree un bloc conteneur qui
            casse position:fixed — nav et loader defileraient avec la page. */}
        <div className="grain" aria-hidden="true"></div>
        <Loader />
        <Cursor />
        <Nav />
        <MenuOverlay />
        <Interactions />
        <div id="smoothWrap"><div id="smooth">{children}</div></div>
      </body>
    </html>
  );
}
