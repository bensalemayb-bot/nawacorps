// Section Services — reference/binacore.html lignes 940-973 pour la structure.
//
// Les six lignes sont STATIQUES et le restent : ce sont des categories
// editoriales du studio, pas les enregistrements de la table Service. Rien ici
// ne vient de la base.
//
// REPOSITIONNEMENT PME : les six gestes decrivaient l'ancienne cible (cartes,
// menus, chevalets, reseaux). Ils decrivent desormais ce qu'un site de PME doit
// FAIRE — recevoir, chiffrer, prendre rendez-vous, repondre — parce que c'est
// la promesse du positionnement, et qu'une section de services qui parle d'
// autre chose que la grille de prix laisse le visiteur sans fil.
// Voir .agents/product-marketing.md §3.
//
// Le depliage est pilote par Interactions.tsx, qui attache un click sur
// `.row-h` de chaque `[data-row]` — code deja en place depuis B4.
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
            <div className="row-h"><span className="n">01</span><h3>Refonte de site</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Votre site actuel, repris et refait : lisible sur téléphone, rapide, à jour. Les textes existants sont récupérés puis réécrits, vous signalez ce qui doit changer. Livré en une semaine, deux allers-retours compris.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">02</span><h3>Demande de devis</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Un formulaire qui pose les bonnes questions — type de prestation, surface, délai, adresse — et qui vous arrive rempli plutôt qu&apos;en trois lignes vagues. Sur les formules qui l&apos;incluent, le visiteur repart avec une estimation chiffrée immédiate.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">03</span><h3>Prise de rendez-vous</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Vos créneaux en ligne, synchronisés avec votre agenda. Le client réserve seul, à 23 h comme le dimanche, et reçoit sa confirmation. Vous arrêtez de vous rappeler mutuellement pour caler une heure.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">04</span><h3>Assistant &amp; relances</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Un assistant formé sur vos prestations et vos tarifs répond aux questions courantes jour et nuit, note le nom et le numéro, et vous alerte sur votre téléphone dans la seconde. Les demandes restées sans réponse sont relancées seules.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">05</span><h3>Fiche Google &amp; avis</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Fiche complétée : photos, horaires exacts, zone d&apos;intervention, réponses aux avis. C&apos;est ce que voient vos futurs clients avant votre site — et souvent la seule chose qu&apos;ils voient.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">06</span><h3>Identité &amp; photos</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Un logotype propre si vous n&apos;en avez pas, une palette cohérente entre le site, vos documents et vos véhicules, et des photos de votre entreprise cadrées pour le web comme pour Google.</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
