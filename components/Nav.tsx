import Image from "next/image";

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
// LE LOGO « PRINCIPAL » ET NON « HORIZONTAL », arbitrage acte : l horizontal
// embarque le slogan, qui a 30px de haut tombe a ~4px et ne se lit plus — une
// bavure grise sous le wordmark. Le slogan a desormais sa place propre, en
// pied de page. Voir livraison-br.txt.
export default function Nav() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <nav className="nav" id="nav">
      <a className="wordmark" href="/#top" aria-label="Nawa Corps — accueil">
        <Image
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
        <a className="lnk" href="/#services">Services</a>
        <a className="lnk" href="/#offres">Offres</a>
        <a className="pill" href="/#contact">Parlons-en</a>
        <button className="burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false"><i></i><i></i></button>
      </div>
    </nav>
  );
}
