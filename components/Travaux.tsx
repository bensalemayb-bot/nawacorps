import FeatureCarousel from "@/components/ui/feature-carousel";

// Section Travaux — reference/binacore.html lignes 756-764 pour l'en-tete,
// copie verbatim. Le markup .car2 de la maquette (lignes 766-935) est rendu par
// le composant lui-meme, d'ou le <div data-reveal> qui l'enveloppe.
//
// L'echelonnement des reveals est preserve : Interactions calcule l'index via
// `:scope > [data-reveal]` sur le parent. Dans la maquette, .wrap a pour enfants
// directs reveles [p.lede, div.car2] ; ici [p.lede, div(wrapper)]. Meme position,
// meme delai.
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
      </div>
    </section>
  );
}
