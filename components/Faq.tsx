import { jsonLd } from "@/lib/site";

// Section FAQ — reference/binacore.html lignes 1105-1133.
//
// AUCUN JS : le depliage est celui de <details>/<summary>, natif. La maquette
// ne pose aucun ecouteur dessus, seulement du CSS (.faq summary .pl2 pivote via
// `details[open]`). Interactions.tsx attache par ailleurs `summary` au curseur
// magnetique (ligne 186) — selecteur deja en place depuis B4.
//
// SEO — les cinq questions vivent maintenant dans QUESTIONS, et non plus en
// dur dans le JSX. Le markup rendu est identique au caractere pres ; ce qui
// change, c est qu une SECONDE sortie lit la meme liste : le JSON-LD FAQPage
// ci-dessous. Une seule source, donc aucun risque de voir la donnee structuree
// promettre a Google une reponse que la page n affiche pas — ce qui est
// exactement ce que Google sanctionne.
const QUESTIONS = [
  {
    q: "Une semaine, vraiment ?",
    r: "Oui, quand vous avez déjà un site : je reprends vos textes, je refais la mise en page, je branche le formulaire et les rendez-vous. Si on part de zéro, comptez une semaine — il faut écrire le contenu. Dans les deux cas le délai court dès votre feu vert, pas dès que vous m'avez envoyé quelque chose.",
  },
  {
    q: "Je n'ai ni textes ni photos. C'est bloquant ?",
    r: "Non, et c'est compris dans le prix. Si un site existe, je récupère ce qui s'y trouve et je le réécris ; vous me dites ce qui a changé. Sinon je vous propose une maquette rédigée, vous corrigez. Les photos de votre entreprise font partie du Site et de L'Assistant.",
  },
  {
    q: "Qui gère l'hébergement et le nom de domaine ?",
    r: "Moi. Domaine et hébergement de la première année sont compris dans les trois formules. Ensuite, 49.–/mois pour l'hébergement, les mises à jour et les sauvegardes — 129.–/mois si votre site a l'assistant, qui tourne en continu. Le domaine reste à votre nom : il vous appartient.",
  },
  {
    q: "Et si je veux changer quelque chose après ?",
    r: "Deux allers-retours sont compris pendant la conception. Une fois en ligne, un message suffit : un tarif qui bouge, une prestation qui s'ajoute, c'est corrigé dans la journée. Les modifications de contenu sont comprises dans le suivi de L'Assistant, facturées à la demande sur les deux autres formules.",
  },
  {
    q: "Pourquoi moins cher qu'une agence ?",
    r: "Parce qu'il n'y a ni bureaux, ni équipe commerciale, ni sous-traitance : vous parlez à celui qui fait le travail, et ce que vous ne payez pas, ce sont les frais de quelqu'un d'autre. Le travail, lui, est le même — et il est livré en trois jours au lieu de trois mois.",
  },
] as const;

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUESTIONS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.r },
  })),
};

export default function Faq() {
  return (
    <section className="faq" id="faq" style={{ paddingTop: 0 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(SCHEMA) }}
      />
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(06)</span>&nbsp; Questions</span>
          <h2 className="sr-only">Questions fréquentes</h2>
        </div>
        <div data-reveal>
          {QUESTIONS.map((item) => (
            <details key={item.q}>
              <summary>{item.q}<span className="pl2">+</span></summary>
              <p className="a">{item.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
