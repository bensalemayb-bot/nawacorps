// Section Methode — reference/binacore.html lignes 1068-1081, copie verbatim.
//
// Contenu editorial pur : les 4 etapes ne sont pas des enregistrements de la
// base, elles decrivent le deroule d une prestation. Composant serveur
// synchrone, comme ServicesRows.
//
// LES JALONS NE SE COMPTENT PLUS EN HEURES. « 24 h » et « Jour 7 » etaient des
// comptes d heures et de jours deguises en etapes : le delai s ecrit « une
// semaine », une seule forme, et une methode se numerote en etapes ou en
// moments de la semaine. « corrigé dans la journée » tombe pour la meme
// raison — c est un engagement de reactivite sans source, et le seul autorise
// (« réponse le jour ouvrable suivant ») vit au formulaire, une seule fois.
// A la place, l etape 4 dit un fait de structure : qui corrige, et qui est
// encore la l annee suivante.
//
// LA METHODE RESTE CELLE DU SITE — c est le seul produit qui porte un delai —
// mais elle ne presume plus que le visiteur n a qu un site. L etape 1 regarde
// « ce que vous montrez aujourd hui », site, imprimes et fiche Google
// compris ; l etape 4 rappelle que la meme porte sert pour une affiche ou une
// reimpression, pas seulement pour une correction de site.
export default function Methode() {
  return (
    <section id="methode">
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(04)</span>&nbsp; Méthode</span>
          <div data-reveal><h2 className="t">Du feu vert à la mise<br />en ligne : une semaine.</h2></div>
        </div>
        <div className="steps">
          <div className="stp" data-reveal><span className="t">En amont</span><span className="n">01</span><h3>L&apos;état des lieux</h3><p>On regarde ensemble ce que vous montrez aujourd&apos;hui : votre site, vos imprimés, votre fiche Google. Ce qui manque, ce qui bloque, ce que vos clients ne trouvent pas. Chez vous ou par téléphone.</p></div>
          <div className="stp" data-reveal><span className="t">Début de semaine</span><span className="n">02</span><h3>La maquette</h3><p>Vous voyez l&apos;avant / après en début de semaine. Vous validez ou on ajuste — deux allers-retours sont compris.</p></div>
          <div className="stp" data-reveal><span className="t">Fin de semaine</span><span className="n">03</span><h3>La mise en ligne</h3><p>Domaine, hébergement, formulaire, rendez-vous : tout est branché. Vous n&apos;installez rien, vous ne configurez rien.</p></div>
          <div className="stp" data-reveal><span className="t">Ensuite</span><span className="n">04</span><h3>Le suivi</h3><p>Un tarif change, une prestation s&apos;ajoute, un horaire bouge ? Vous m&apos;écrivez, et c&apos;est moi qui corrige. Une affiche pour la rentrée, des cartes à réimprimer : vous m&apos;écrivez aussi. La deuxième année, c&apos;est encore la même personne.</p></div>
        </div>
      </div>
    </section>
  );
}
