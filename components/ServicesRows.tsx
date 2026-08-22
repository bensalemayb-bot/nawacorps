// Section Services — reference/binacore.html lignes 940-973, copie verbatim.
//
// Les six lignes sont STATIQUES et le restent : ce sont des categories
// editoriales du studio, pas les enregistrements de la table Service. Rien ici
// ne vient de la base.
//
// Le depliage est pilote par Interactions.tsx, qui attache un click sur
// `.row-h` de chaque `[data-row]` — code deja en place depuis B4, qui tolerait
// zero match jusqu'ici.
export default function ServicesRows() {
  return (
    <section id="services" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(02)</span>&nbsp; Services</span>
          <div data-reveal><h2 className="t">Six gestes,<br />un seul interlocuteur.</h2></div>
        </div>
        <div className="rows" data-reveal>
          <div className="row" data-row>
            <div className="row-h"><span className="n">01</span><h3>Cartes &amp; menus</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Votre menu repensé : hiérarchie claire, typographie soignée, fichiers d&apos;impression fournis et version en ligne accessible par QR code. Les changements de prix sont inclus pendant trois mois, et la traduction FR / EN se fait sur demande — Genève est une ville de passage.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">02</span><h3>Sites vitrines</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Un site sobre et rapide, pensé pour le téléphone : carte, horaires, adresse, appel et itinéraire en un geste. Nom de domaine et hébergement de la première année compris — vous n&apos;installez rien.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">03</span><h3>Print &amp; supports</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Affiches d&apos;événements, cartes de fidélité, bons cadeaux, chevalets de table, stickers vitrine avec QR vers vos avis Google. Tout ce qui se voit dans votre commerce, dessiné dans votre identité et livré prêt à imprimer.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">04</span><h3>Réseaux sociaux</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Huit à douze publications par mois, dans vos couleurs, préparées et programmées pour vous. Vous validez une fois par mois — le reste ne vous demande rien.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">05</span><h3>Identité &amp; photographie</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Un logotype propre si vous n&apos;en avez pas, une palette cohérente entre la carte, le site et la vitrine, et des photos de votre commerce cadrées pour le web comme pour Google.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">06</span><h3>Google &amp; visibilité</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Fiche Google complétée et optimisée : photos, horaires exacts, réponses aux avis. C&apos;est la première chose que voient vos futurs clients — elle doit être irréprochable.</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
