import type { Metadata } from "next";
import ChatWidget from "@/components/ChatWidget";
import Cursor from "@/components/Cursor";
import Interactions from "@/components/Interactions";
import Loader from "@/components/Loader";
import MenuOverlay from "@/components/MenuOverlay";
import Nav from "@/components/Nav";
import NoyauStage from "@/components/NoyauStage";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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

/**
 * METADATA DU SITE PUBLIC.
 *
 * `metadataBase` d abord : sans elle, tout champ d URL relatif — canonique,
 * image Open Graph — leve une erreur de build. C est elle qui permet d ecrire
 * `canonical: "/"` plutot que l URL absolue, et donc de changer de domaine
 * sans toucher une seule page.
 *
 * `title` devient un objet a deux entrees. `default` sert la page d accueil,
 * `template` habille les pages filles : « Mentions légales » ecrit dans
 * mentions-legales/page.tsx ressort « Mentions légales — Nawa Corps ». Les
 * deux pages legales repetaient ce suffixe a la main ; elles ne le font plus.
 *
 * L ORDRE DES MOTS DU TITRE A CHANGE, et c est deliberé. « Nawa Corps —
 * Agence digitale, Genève » mettait la marque en premier : personne ne cherche
 * encore « Nawa Corps ». Ce qui se cherche, c est une agence a Geneve. La
 * marque passe donc en fin de titre, la ou elle signe sans occuper la place
 * que les moteurs lisent en premier.
 *
 * LE TITRE RESTE CENTRE SUR LA REFONTE, LA DESCRIPTION NON. « Refonte de site
 * pour PME a Geneve » est la requete qui se cherche : c est le produit d
 * entree, il garde le titre. La description, elle, ne peut plus s y limiter —
 * l agence vend aussi de l identite, des imprimes, des photos, la fiche Google
 * et la production des reseaux sociaux, et un extrait de resultat qui n en dit
 * rien fait perdre les visiteurs venus pour ca. Les montants ont quitte ces
 * chaines au passage : les prix vivent en base (lib/catalogue.ts), et une
 * metadonnee statique ne sait pas les relire.
 *
 * `canonical` est declaree ICI, au layout, et vaut donc « / » pour l accueil.
 * Chaque page fille redeclare la sienne — une canonique heritee ferait pointer
 * les pages legales vers l accueil, ce qui les desindexerait.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Refonte de site pour PME à Genève — en une semaine",
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Nawa Corps refait le site des PME genevoises en une semaine : vous n'avez rien à préparer. Autour du site : identité, imprimés, photos, fiche Google, réseaux sociaux.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CH",
    siteName: SITE_NAME,
    url: "/",
    title: "Refonte de site pour PME à Genève — en une semaine",
    description:
      "Refait en une semaine, et vous n'avez rien à préparer : je reprends les textes de votre site actuel. Et le site n'est pas tout — identité, imprimés, photos, fiche Google et réseaux sociaux se prennent ici aussi.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refonte de site pour PME à Genève — en une semaine",
    description:
      "Refait en une semaine, et vous n'avez rien à préparer : je reprends les textes de votre site actuel. Et le site n'est pas tout — identité, imprimés, photos, fiche Google et réseaux sociaux se prennent ici aussi.",
  },
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {/* FILET SANS JAVASCRIPT.
          Deux mecaniques du site partent CACHEES et ne se devoilent que par
          JS : [data-reveal] est a opacity:0 (binacore.css ligne 53) jusqu a ce
          qu Interactions pose .in, et le loader couvre tout l ecran en
          z-index:130 (ligne 336) jusqu a ce qu il pose .loaded. Si le script
          ne demarre jamais, la page est une plaque verte vide — pour un
          visiteur comme pour un robot qui n execute pas le JS.
          Les deux regles ci-dessous sont EXACTEMENT celles que binacore.css
          applique deja sous prefers-reduced-motion (lignes 330 et 423) : rien
          de nouveau n est invente, on rejoue un etat de repli deja prevu. */}
      <noscript>
        <style>{`[data-reveal]{opacity:1;transform:none}.loader{display:none}`}</style>
      </noscript>
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
