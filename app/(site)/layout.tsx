import type { Metadata } from "next";
import { headers } from "next/headers";
import AncresPage from "@/components/AncresPage";
import BandeauCookies from "@/components/BandeauCookies";
import ChatWidget from "@/components/ChatWidget";
import Cursor from "@/components/Cursor";
import Interactions from "@/components/Interactions";
import LiensLegaux from "@/components/LiensLegaux";
import Loader from "@/components/Loader";
import MenuOverlay from "@/components/MenuOverlay";
import Nav from "@/components/Nav";
import NoyauStage from "@/components/NoyauStage";
import {
  EN_TETE_CHEMIN,
  EN_TETE_LOCALE,
  LOCALE_DEFAUT,
  aPiedComplet,
  estLocale,
} from "@/lib/i18n";
import { SITE_NAME, SITE_URL, alternatesPage } from "@/lib/site";

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
 * LE TITRE PORTE LA REQUETE, la marque signe a la fin (sur l accueil, le
 * `default` ne passe pas par le `template` : il l ecrit lui-meme). Depuis le 24 octobre 2026, la requete
 * est « assistant IA » + « PME » + « Genève » (docs/agents/copy/meta.md §1,
 * arbitrage n°1 : « IA » est dans le titre). La description, elle, met le
 * resultat avant l IA (guide de voix §4) et ne porte aucun montant : une
 * metadonnee statique ne sait pas relire la base.
 *
 * `canonical` est declaree ICI, au layout, et vaut donc « / » pour l accueil.
 * Chaque page fille redeclare la sienne — une canonique heritee ferait pointer
 * les pages legales vers l accueil, ce qui les desindexerait.
 *
 * ELLE PASSE PAR `alternatesPage` DEPUIS LA FONDATION i18n, et cela AJOUTE les
 * `hreflang` de l accueil sans rien changer a la canonique, qui vaut toujours
 * « / ». C est la moitie francaise du couple : `/en` declare deja `/` comme sa
 * version francaise, et un groupe hreflang non reciproque est ignore en entier
 * par Google — la page anglaise doit etre annoncee d ici, sans quoi tout le
 * travail de app/(site)/en/page.tsx ne sert a rien.
 *
 * CELA NE DEBORDE SUR AUCUNE AUTRE PAGE. La fusion des metadata de Next ne
 * descend pas dans les objets : les quinze pages filles declarent chacune leur
 * propre `alternates`, qui REMPLACE celui-ci en entier. Elles n heritent donc
 * d aucun `hreflang` — ce qui est exactement ce qu il faut tant qu elles n ont
 * pas de version anglaise. Le jour ou l une est traduite, elle passera a son
 * tour par `alternatesPage`.
 */
/*
 * Titre et description de l audit CRO/SEO du 25.10.2026 (§4.4) : la marque
 * signe le titre, puisque le `default` ne passe pas par le `template`.
 */
const TITRE_ACCUEIL = "Assistant IA pour artisans et PME à Genève · Nawa Corps";
const DESCRIPTION_ACCUEIL =
  "Il prépare vos devis, relance et prend les demandes, sans jamais s'engager à votre place. Vous le voyez, vous l'essayez deux semaines, vous payez après.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITRE_ACCUEIL,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION_ACCUEIL,
  alternates: alternatesPage("/"),
  openGraph: {
    type: "website",
    locale: "fr_CH",
    siteName: SITE_NAME,
    url: "/",
    title: TITRE_ACCUEIL,
    description: DESCRIPTION_ACCUEIL,
  },
  twitter: {
    card: "summary_large_image",
    title: TITRE_ACCUEIL,
    description: DESCRIPTION_ACCUEIL,
  },
};

/**
 * LA LANGUE DU CHROME — lue dans le MEME en-tete que celle du `<html lang>`.
 *
 * POURQUOI L EN-TETE PLUTOT QUE LE CHEMIN. Un layout ne recoit pas le chemin de
 * la page qu il enveloppe : ni en prop, ni par une API serveur. `proxy.ts`, lui,
 * a deja fait le travail — il lit `request.nextUrl.pathname`, appelle
 * `localeDepuisChemin` et pose `x-nawa-locale`. Le relire ici, c est prendre la
 * DECISION DEJA PRISE au lieu d en fabriquer une seconde qui pourrait diverger :
 * `app/layout.tsx` rend `<html lang>` a partir de cet en-tete-la, et il serait
 * absurde que la barre de nav et l attribut `lang` de la meme page se
 * contredisent.
 *
 * CELA NE COUTE RIEN DE PLUS. `headers()` est une API de temps de requete et
 * bascule les routes en rendu dynamique — mais `app/layout.tsx` l appelle deja
 * pour la meme raison, au-dessus de celui-ci : toutes les routes du site sont
 * DEJA dynamiques. Le releve de mesures est en tete de app/layout.tsx.
 *
 * LE REPLI EST LE FRANCAIS, exactement comme la-haut : en-tete absent (le proxy
 * ne tourne ni sur /admin, ni sur /api, ni sur les fichiers statiques) ou valeur
 * inconnue fabriquee a la main, et `estLocale` rend `false`.
 *
 * CINQ ELEMENTS DE CHROME RECOIVENT LA LANGUE ICI : `Nav`, `MenuOverlay`,
 * `ChatWidget`, `LiensLegaux` et `BandeauCookies` (depuis le 25 octobre 2026). `FooterContact` et `ContactForm` sont rendus par les PAGES,
 * chacune passe la sienne. `Loader`, `Cursor`, `Interactions` et `NoyauStage`
 * n affichent aucun mot.
 *
 * `ChatWidget` a ete ajoute a cette liste : il portait ses propres chaines en
 * dur, et sa langue decide AUSSI de celle du prompt systeme envoye au modele
 * (lib/chat-prompt.ts). Un visiteur anglophone lisait donc une bulle francaise
 * qui lui repondait en francais. Une seule prop corrige les deux moities.
 */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const enTetes = await headers();
  const entete = enTetes.get(EN_TETE_LOCALE);
  const locale = estLocale(entete) ? entete : LOCALE_DEFAUT;
  // LA BANDE DES LIENS LEGAUX N EST RENDUE QUE SUR LES PAGES SANS PIED
  // COMPLET (lib/i18n.ts, `CHEMINS_AVEC_PIED`). Sans en-tete — chemin que le
  // proxy ne voit pas —, elle est rendue : mieux vaut un doublon masque en CSS
  // qu une page sans mentions legales.
  const chemin = enTetes.get(EN_TETE_CHEMIN);
  const bandeLegale = !(chemin && aPiedComplet(chemin));

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
      <Loader locale={locale} />
      <Cursor />
      <Nav locale={locale} />
      <MenuOverlay locale={locale} />
      <Interactions />
      {/* ChatWidget est en position:fixed — il reste HORS du wrapper,
          pour la meme raison que nav/loader/cursor ci-dessus. */}
      <ChatWidget locale={locale} />
      {/* BandeauCookies est en position:fixed lui aussi : hors du wrapper.
          Il ne rend rien cote serveur, et rien du tout une fois ferme
          (components/BandeauCookies.tsx). */}
      <BandeauCookies locale={locale} />
      {/* Les liens `#ancre` sous le scroll inertiel : components/AncresPage.tsx. */}
      <AncresPage />
      {/* NoyauStage est en position:fixed : meme raison encore. Il precede
          volontairement #smoothWrap — a z-index egal l ordre du DOM tranche, et
          le noyau doit rester DERRIERE le contenu qui lui passe dessus.
          Il ne s active que sur l accueil, seule page a poser #noyau-track. */}
      <NoyauStage />
      {/* <main> ENVELOPPE LE CONTENU DE CHAQUE PAGE (25 octobre 2026). Le site
          n en avait aucun : lecteurs d ecran et agents d IA n avaient pas de
          repere pour sauter la navigation. Il vit DANS #smooth, jamais
          autour de #smoothWrap : il ne porte ni transform ni position, il ne
          change donc rien au scroll inertiel ni aux elements fixes.
          LiensLegaux suit <main> : Mentions legales · Confidentialite · CGV
          sur les pages qui n ont pas le pied complet. La ou le pied les porte
          deja, elle n est plus rendue du tout (audit CRO/SEO du 25.10.2026 :
          le HTML de l accueil portait deux fois les trois liens). */}
      <div id="smoothWrap">
        <div id="smooth">
          <main id="contenu">{children}</main>
          {bandeLegale && <LiensLegaux locale={locale} />}
        </div>
      </div>
    </>
  );
}
