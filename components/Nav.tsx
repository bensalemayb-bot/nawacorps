import Image from "next/image";
import NavServices from "@/components/NavServices";
import { ENTREES_FAMILLES, HREF_SERVICES } from "@/lib/catalogue-familles";

// Barre de navigation — reference/binacore.html lignes 695-705.
// Composant serveur : les ecouteurs (#nav, #burger, #clock) sont poses par
// Interactions.tsx, exactement comme le <script> de la maquette.
//
// ADAPTATION B7 : les ancres sont prefixees `/`. Cette nav vit dans le layout,
// donc sur les 3 routes, alors que id="top" et les sections cibles n existent
// que sur /. Sans le prefixe, les 5 liens seraient morts sur les pages
// legales. Sur / le comportement est inchange : meme document, donc ancre
// interne sans rechargement.
//
// BR — LE WORDMARK TEXTE DEVIENT UNE IMAGE, ET CELA CASSE UN MECANISME.
// binacore.css ligne 414 pose `html.menu-open .wordmark{color:var(--bone)}` :
// quand le menu plein ecran s ouvre, le fond passe au pin et le wordmark
// s eclaircit pour rester lisible. Une image n obeit pas a `color`.
//
// UNE SEULE IMAGE, ECLAIRCIE PAR FILTRE au menu ouvert (bloc BR en fin de
// binacore.css). Deux fichiers auraient impose un saut de largeur a chaque
// ouverture : le logo principal fait un ratio de 7.04, la variante fond-fonce
// 3.04, soit 211px contre 91px a hauteur egale. La nav aurait tressailli a
// chaque clic sur le burger. Meme image, meme ratio, aucun decalage.
//
// LE VERROUILLAGE ICONE + NOM est celui de la marque elle-meme : le logo
// horizontal officiel place le N cercle a gauche du wordmark. On le reproduit
// en DEUX fichiers plutot qu en reprenant l horizontal tel quel, parce que
// celui-ci embarque aussi le slogan — qui a cette hauteur tombe a ~4px et ne
// se lit plus, une bavure grise sous le nom. En composant, chaque element
// garde sa taille propre et reste net. Le slogan a sa place ailleurs, en pied
// de page. Voir livraison-br.txt.
//
// L icone porte alt="" : elle ne dit rien que le wordmark ne dise deja, et un
// lecteur d ecran annoncerait deux fois la meme marque. C est le nom qui porte
// le texte alternatif.
//
// CINQ ENTREES SONT DEVENUES QUATRE, ET C EST LE CONSTAT DU PROPRIETAIRE :
// « service, offre et prestation veulent dire la meme chose ». La barre portait
// les trois — « Services » vers une ancre de l accueil, « Offres » vers une
// autre ancre du meme accueil, « Prestations » vers une page. Le visiteur
// devait deviner laquelle contenait quoi, et il ne devine pas : il part.
// « Offres » et « Prestations » quittent donc la nav. Les sections de l accueil
// ne bougent pas d un pixel et gardent leurs ancres — c est la nav qui cesse de
// les dedoubler, pas la page qui perd du contenu.
//
// LA SEULE ENTREE QUI S OUVRE EST « Services », et son deroulant vit dans
// components/NavServices.tsx : il a un etat, donc il est client, et il est le
// seul de ce fichier a l etre. La liste des familles n est pas ecrite ici — elle
// est derivee de lib/familles.ts par lib/catalogue-familles.ts, la meme source
// que le menu plein ecran. Deux listes ecrites a deux endroits divergent.
export default function Nav() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <nav className="nav" id="nav">
      <a className="wordmark" href="/#top" aria-label="Nawa Corps — accueil">
        <Image
          className="wm-icone"
          src="/brand/nawa-corps-logo-iconique-transparent.png"
          alt=""
          width={230}
          height={230}
          priority
        />
        <Image
          className="wm-nom"
          src="/brand/nawa-corps-logo-principal-transparent.png"
          alt="Nawa Corps"
          width={634}
          height={90}
          priority
        />
      </a>
      <span className="nav-time" id="clock">Genève — 00:00</span>
      <div className="nav-r">
        <a className="lnk" href="/#travaux">Travaux</a>
        <NavServices
          general={{ href: HREF_SERVICES, libelle: "Tous les services" }}
          familles={ENTREES_FAMILLES}
        />
        <a className="lnk" href="/studio">Le studio</a>
        <a className="lnk" href="/contact">Contact</a>
        <a className="pill" href="/#contact">Parlons-en</a>
        <button className="burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false"><i></i><i></i></button>
      </div>
    </nav>
  );
}
