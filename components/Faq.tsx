// Section FAQ — reference/binacore.html lignes 1105-1133, copie verbatim.
//
// AUCUN JS : le depliage est celui de <details>/<summary>, natif. La maquette
// ne pose aucun ecouteur dessus, seulement du CSS (.faq summary .pl2 pivote via
// `details[open]`). Interactions.tsx attache par ailleurs `summary` au curseur
// magnetique (ligne 186) — selecteur deja en place depuis B4.
export default function Faq() {
  return (
    <section className="faq" id="faq" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(06)</span>&nbsp; Questions</span>
        </div>
        <div data-reveal>
          <details>
            <summary>Combien de temps ça prend, vraiment ?<span className="pl2">+</span></summary>
            <p className="a">Une carte : une semaine. Un site : deux semaines à partir de notre rencontre, maquette sous 48 h comprise. Si un délai doit bouger, vous le savez avant, pas après.</p>
          </details>
          <details>
            <summary>Je n&apos;ai ni logo, ni photos. C&apos;est bloquant ?<span className="pl2">+</span></summary>
            <p className="a">Non. Un logotype simple est compris dans la mise en page, et les photos de votre commerce font partie du Pack Complet. Vous arrivez les mains vides, vous repartez équipé.</p>
          </details>
          <details>
            <summary>Qui gère l&apos;hébergement et le nom de domaine ?<span className="pl2">+</span></summary>
            <p className="a">Nawa Corps. Domaine et hébergement de la première année sont compris dans Le Site, puis 49.–/mois pour l&apos;hébergement et les mises à jour. Le domaine reste à votre nom : il vous appartient.</p>
          </details>
          <details>
            <summary>Un prix change sur ma carte, je fais quoi ?<span className="pl2">+</span></summary>
            <p className="a">Un message WhatsApp. La carte en ligne est corrigée dans la journée et le fichier d&apos;impression mis à jour vous est renvoyé. C&apos;est compris dans le suivi.</p>
          </details>
          <details>
            <summary>Vous faites aussi les affiches et les réseaux sociaux ?<span className="pl2">+</span></summary>
            <p className="a">Oui — c&apos;est la carte du studio, juste au-dessus des questions : affiches d&apos;événements, fidélité, bons cadeaux, stickers, publications mensuelles. Une fois votre identité posée, chaque support en découle vite et bien.</p>
          </details>
        </div>
      </div>
    </section>
  );
}
