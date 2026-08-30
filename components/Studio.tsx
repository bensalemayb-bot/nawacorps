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
          <h2 className="sr-only">Le studio</h2>
        </div>
        <div className="studio-grid">
          <p className="studio-quote" data-reveal>« Vous parlez à celui qui <em>fait</em> le travail. »</p>
          <div className="studio-txt" data-reveal>
            <p>Nawa Corps est le studio d&apos;Ayoub, designer et développeur à Genève. Pas de commerciaux, pas de chargé de compte : la personne qui répond à votre message est celle qui dessine et construit votre site.</p>
            <p>Si les prix sont ceux-là, c&apos;est la structure qui l&apos;explique, pas le travail : pas de bureaux, pas d&apos;équipe commerciale, pas de sous-traitance. Ce que vous ne payez pas, ce sont les frais de quelqu&apos;un d&apos;autre.</p>
            <div className="facts">
              <div><b>Genève</b><span>Basé ici</span></div>
              <div><b>1 sem.</b><span>Refonte livrée</span></div>
              <div><b>FR / EN</b><span>Langues</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
