import type { Metadata } from "next";
import ChatWidget from "@/components/ChatWidget";
import Cursor from "@/components/Cursor";
import Interactions from "@/components/Interactions";
import Loader from "@/components/Loader";
import MenuOverlay from "@/components/MenuOverlay";
import Nav from "@/components/Nav";
import NoyauStage from "@/components/NoyauStage";

/**
 * Layout du SITE PUBLIC — bloc B11.
 *
 * Tout le chrome public vit ici et nulle part ailleurs : loader, curseur,
 * navigation, overlay de menu, interactions, chatbot, et le wrapper de scroll
 * inertiel. Il etait au layout racine jusqu ici ; l y laisser aurait impose
 * l ensemble a /admin — scroll inertiel, curseur personnalise et chatbot de
 * qualification sur un back-office, ce qui n a aucun sens.
 *
 * UN ROUTE GROUP N AFFECTE PAS LES URL. (site) ne parait dans aucun chemin :
 * / reste /, /mentions-legales reste /mentions-legales. Le groupe ne sert qu a
 * decider QUI herite de ce layout.
 *
 * Le contenu ci-dessous est celui du layout racine d avant, deplace sans une
 * modification — l ordre du <body> compris, pour la raison expliquee juste en
 * dessous.
 */

export const metadata: Metadata = {
  title: "Nawa Corps — Studio digital, Genève",
  description:
    "Nawa Corps conçoit cartes, sites, affiches et réseaux sociaux pour les commerces genevois. Studio digital indépendant, Genève.",
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
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
      {/* ChatWidget est en position:fixed — il reste HORS du wrapper,
          pour la meme raison que nav/loader/cursor ci-dessus. */}
      <ChatWidget />
      {/* NoyauStage est en position:fixed : meme raison encore. Il precede
          volontairement #smoothWrap — a z-index egal l ordre du DOM tranche, et
          le noyau doit rester DERRIERE le contenu qui lui passe dessus.
          Il ne s active que sur l accueil, seule page a poser #noyau-track. */}
      <NoyauStage />
      <div id="smoothWrap"><div id="smooth">{children}</div></div>
    </>
  );
}
