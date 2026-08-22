// Hero — reference/binacore.html lignes 725-746, copie verbatim.
// Rendu DANS #smoothWrap > #smooth (via page.tsx), contrairement a nav/loader/
// cursor/menu qui doivent rester hors du wrapper transforme.
export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap hero-in">
        <div className="kicker">
          <span className="meta"><span className="index">®</span>&nbsp; Studio digital indépendant</span>
          <span className="meta">Genève, Suisse</span>
          <span className="meta">Depuis 2026</span>
        </div>
        <h1>
          <span className="l"><span>Une présence digitale</span></span>
          <span className="l"><span><span className="serif-i">à la hauteur</span> de</span></span>
          <span className="l"><span>votre commerce.</span></span>
        </h1>
        <div className="hero-foot">
          <p className="hero-sub">Cartes, sites, affiches et présence en ligne pour les bars, cafés et commerces genevois — conçus avec soin, livrés en deux semaines.</p>
          <div className="hero-cta">
            <a className="btn" href="https://wa.me/41760000000?text=Bonjour%2C%20parlons%20de%20mon%20commerce." target="_blank" rel="noopener">Démarrer un projet <span className="ar">→</span></a>
            <a className="btn btn-line" href="#travaux">Voir le travail</a>
          </div>
          <span className="hero-scroll"><i></i> Défiler</span>
        </div>
      </div>
    </header>
  );
}
