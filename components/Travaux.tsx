import FeatureCarousel from "@/components/ui/feature-carousel";

// Section Travaux — reference/binacore.html lignes 756-764 pour l'en-tete,
// copie verbatim. Le markup .car2 de la maquette (lignes 766-935) est rendu par
// le composant lui-meme, d'ou le <div data-reveal> qui l'enveloppe.
//
// L'echelonnement des reveals est preserve : Interactions calcule l'index via
// `:scope > [data-reveal]` sur le parent. Dans la maquette, .wrap a pour enfants
// directs reveles [p.lede, div.car2] ; ici [p.lede, div(wrapper), div.studio-txt].
// Les deux premiers gardent leur position et donc leur delai — le troisieme, le
// lien vers /demonstrations, s'ajoute a la suite sans rien decaler.
//
// Composant serveur : le carrousel porte son propre "use client".
export default function Travaux() {
  return (
    <section id="travaux">
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(01)</span>&nbsp; Travaux</span>
          <div data-reveal>
            <h2 className="t">Tout a un avant.<br />Voici les après.</h2>
          </div>
        </div>
        <p className="lede" data-reveal style={{ marginBottom: 30 }}>Cinq démonstrations du studio — glissez la poignée de chaque pièce pour comparer l&apos;avant et l&apos;après.</p>

        <div data-reveal><FeatureCarousel /></div>

        {/* L'accueil donne un apercu, /demonstrations porte l'ensemble : la
            page dit en toutes lettres ce que sont ces pieces — des
            demonstrations dessinees pour un bar qui n'existe pas — ce que
            cette section n'a pas la place de faire. Sans ce lien, la page
            n'etait atteignable que depuis le hero.

            Troisieme [data-reveal] enfant direct de .wrap : Interactions
            calcule le delai par `:scope > [data-reveal]`, l'echelonnement des
            deux premiers (p.lede, le carrousel) est donc inchange. */}
        <div className="studio-txt" data-reveal style={{ marginTop: 30 }}>
          <p><a className="lnk" href="/demonstrations">Voir toutes les démonstrations →</a></p>
        </div>
      </div>
    </section>
  );
}
