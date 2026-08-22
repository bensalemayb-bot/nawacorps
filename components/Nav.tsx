// Barre de navigation — reference/binacore.html lignes 695-705, copie verbatim.
// Composant serveur : les ecouteurs (#nav, #burger, #clock) sont poses par
// Interactions.tsx, exactement comme le <script> de la maquette.
export default function Nav() {
  return (
    <nav className="nav" id="nav">
      <a className="wordmark" href="#top">Binacore<sup>GE</sup></a>
      <span className="nav-time" id="clock">Genève — 00:00</span>
      <div className="nav-r">
        <a className="lnk" href="#travaux">Travaux</a>
        <a className="lnk" href="#services">Services</a>
        <a className="lnk" href="#offres">Offres</a>
        <a className="pill" href="#contact">Parlons-en</a>
        <button className="burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false"><i></i><i></i></button>
      </div>
    </nav>
  );
}
