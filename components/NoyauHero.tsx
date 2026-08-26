/**
 * LE NOYAU — le texte du hero, en flux normal.
 *
 * Ce composant ne dessine rien : il pose la PISTE (#noyau-track) dont la hauteur
 * definit la duree du scrub, et les quatre temps qui defilent par-dessus le
 * noyau epingle. Le visuel, lui, est rendu par NoyauStage, monte hors du
 * wrapper de scroll — voir l'en-tete de app/noyau.css.
 *
 * Ce decoupage n'est pas cosmetique : le texte reste ici du vrai DOM, rendu par
 * le serveur, donc indexable et lisible sans JavaScript. Seule son opacite est
 * reprise par NoyauStage. Si le moteur ne demarre jamais, le hero reste un hero
 * — quatre blocs de texte lisibles, simplement sans l'objet derriere.
 *
 * Le temps 1 porte la classe .hero : les regles d'entree de binacore.css
 * (kicker, h1 ligne a ligne, hero-foot, et leur mise en pause tant que le loader
 * tourne) s'y appliquent telles quelles, sans etre dupliquees.
 */
export default function NoyauHero() {
  return (
    <header className="noyau-hero" id="top">
      <div className="noyau-track" id="noyau-track">

        {/* ---------- temps 1 — l'accroche ---------- */}
        <div className="noyau-beat hero" data-temps="">
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
        </div>

        {/* ---------- temps 2 — la phrase ----------
            Calee a gauche pendant que le noyau derive a droite (piste `x`). */}
        <div className="noyau-beat noyau-beat-2" data-temps="">
          <div className="wrap">
            <span className="meta"><span className="index">(001)</span>&nbsp; Le noyau</span>
            <div className="noyau-say">
              <p>Cartes, sites, affiches, présence en ligne — <span className="serif-i">un seul centre</span>, plusieurs orbites.</p>
            </div>
          </div>
        </div>

        {/* ---------- temps 3 — la plongee ----------
            Le noyau remplit l'ecran : le texte passe en clair (.noyau-beat-3),
            et la nav s'inverse au meme moment via html.noyau-dark. */}
        <div className="noyau-beat noyau-beat-3" data-temps="">
          <div className="wrap">
            <span className="meta"><span className="index">(002)</span>&nbsp; Le coeur</span>
            <div className="noyau-spec">
              <p className="noyau-fig">
                <span className="noyau-num">14</span>
                <span className="noyau-unit">jours</span>
              </p>
              <ul className="noyau-specs">
                <li><span className="k">Atelier</span><span className="v">Genève, Suisse</span></li>
                <li><span className="k">Livraison</span><span className="v">Deux semaines</span></li>
                <li><span className="k">Nature</span><span className="v">Studio indépendant</span></li>
                <li><span className="k">Depuis</span><span className="v">2026</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- temps 4 — la sortie ---------- */}
        <div className="noyau-beat noyau-beat-4" data-temps="">
          <div className="wrap">
            <div className="noyau-out">
              <p>Chaque commerce a son centre. Le travail consiste à le trouver, puis à faire tourner le reste autour.</p>
              <a className="btn" href="#travaux">Voir le travail <span className="ar">→</span></a>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
