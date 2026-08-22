// Barre de navigation — reference/binacore.html lignes 695-705.
// Composant serveur : les ecouteurs (#nav, #burger, #clock) sont poses par
// Interactions.tsx, exactement comme le <script> de la maquette.
//
// ADAPTATION B7 : les ancres sont prefixees `/`. Cette nav vit dans le layout,
// donc sur les 3 routes, alors que id="top" et les sections cibles n existent
// que sur /. Sans le prefixe, les 5 liens seraient morts sur les pages
// legales. Sur / le comportement est inchange : meme document, donc ancre
// interne sans rechargement.
export default function Nav() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <nav className="nav" id="nav">
      <a className="wordmark" href="/#top">Binacore<sup>GE</sup></a>
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
