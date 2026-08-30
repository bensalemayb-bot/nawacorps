import { WHATSAPP_HREF } from "@/lib/site";

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
              <span className="meta">Sites de PME</span>
            </div>
            <h1>
              {/* Chaque .l doit tenir sur UNE ligne : binacore.css les revele
                  ligne par ligne, et un debordement casse l'animation autant
                  que la mise en page (le hero-foot passe sous la ligne de
                  flottaison). La maquette tient 21 caracteres au plus large —
                  s'y tenir en reecrivant. */}
              <span className="l"><span>Votre site a dix ans.</span></span>
              <span className="l"><span>En <span className="serif-i">72 heures</span>, il</span></span>
              <span className="l"><span>travaille pour vous.</span></span>
            </h1>
            <div className="hero-foot">
              <p className="hero-sub">Sites de PME à Genève : demande de devis, prise de rendez-vous, fiche Google. Refait en 72 heures si vous avez déjà un site, une semaine si on part de zéro. Dès 699.–, TVA comprise.</p>
              <div className="hero-cta">
                <a className="btn" href={WHATSAPP_HREF} target="_blank" rel="noopener">Faire refaire mon site <span className="ar">→</span></a>
                <a className="btn btn-line" href="#travaux">Voir les avant / après</a>
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
              <p>Il reçoit les demandes, chiffre les devis, prend les rendez-vous — <span className="serif-i">sans que vous y touchiez</span>.</p>
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
                <span className="noyau-num">72</span>
                <span className="noyau-unit">heures</span>
              </p>
              <ul className="noyau-specs">
                <li><span className="k">Atelier</span><span className="v">Genève, Suisse</span></li>
                <li><span className="k">Refonte</span><span className="v">72 heures</span></li>
                <li><span className="k">Départ de zéro</span><span className="v">Une semaine</span></li>
                <li><span className="k">Suivi</span><span className="v">Dès 49.–/mois</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- temps 4 — la sortie ---------- */}
        <div className="noyau-beat noyau-beat-4" data-temps="">
          <div className="wrap">
            <div className="noyau-out">
              <p>Un site ne se regarde pas. Il travaille, ou il ne sert à rien.</p>
              <a className="btn" href="#travaux">Voir les avant / après <span className="ar">→</span></a>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
