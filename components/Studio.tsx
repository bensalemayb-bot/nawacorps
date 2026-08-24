// Section Le studio — reference/binacore.html lignes 1084-1102, copie verbatim.
//
// `style="padding-top:0"` de la maquette devient `style={{ paddingTop: 0 }}` :
// la section se colle a Methode, qui porte deja son padding bas.
export default function Studio() {
  return (
    <section id="studio" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(05)</span>&nbsp; Le studio</span>
        </div>
        <div className="studio-grid">
          <p className="studio-quote" data-reveal>« Vous parlez à celui qui <em>fait</em> le travail. »</p>
          <div className="studio-txt" data-reveal>
            <p>Nawa Corps est le studio d&apos;Ayoub, designer et développeur à Genève. Pas de commerciaux, pas de sous-traitance : la personne qui répond à votre message est celle qui dessine votre carte et construit votre site.</p>
            <p>Une structure légère, c&apos;est votre avantage — des décisions rapides, un prix juste, et un interlocuteur qui connaît votre commerce parce qu&apos;il y est venu.</p>
            <div className="facts">
              <div><b>Genève</b><span>Basé ici</span></div>
              <div><b>&lt; 24 h</b><span>Délai de réponse</span></div>
              <div><b>FR / EN</b><span>Langues</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
