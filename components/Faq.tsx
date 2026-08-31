import { chargerCatalogue } from "@/lib/catalogue";
import { CHF_UNIT, MONTHLY_SUFFIX, formatChfAmount } from "@/lib/format";
import { jsonLd } from "@/lib/site";

// Section FAQ — reference/binacore.html lignes 1105-1133.
//
// AUCUN JS : le depliage est celui de <details>/<summary>, natif. La maquette
// ne pose aucun ecouteur dessus, seulement du CSS (.faq summary .pl2 pivote via
// `details[open]`). Interactions.tsx attache par ailleurs `summary` au curseur
// magnetique (ligne 186) — selecteur deja en place depuis B4.
//
// SEO — les cinq questions vivent dans construireQuestions(), et non plus en
// dur dans le JSX. Le markup rendu est identique au caractere pres ; ce qui
// change, c est qu une SECONDE sortie lit la meme liste : le JSON-LD FAQPage.
// Une seule source, donc aucun risque de voir la donnee structuree promettre a
// Google une reponse que la page n affiche pas.
//
// Le composant est devenu ASYNC : les deux prix du suivi sont lus en base au
// lieu d etre ecrits en dur. Voir le docblock de construireQuestions().
/**
 * LES DEUX PRIX DU SUIVI SONT LUS EN BASE, PAS ECRITS ICI.
 *
 * La question 3 les annoncait en dur (« 49.–/mois », « 129.–/mois ») alors que
 * la grille juste au-dessus, elle, sort de Postgres : au premier changement de
 * tarif, la FAQ contredisait la grille sur le meme ecran — et elle le faisait
 * AUSSI dans la donnee structuree FAQPage, que Google republie telle quelle.
 *
 * Si une des deux lignes manque ou passe sur devis, la reponse se referme sans
 * chiffre plutot que d en inventer un.
 *
 * « TVA COMPRISE » EST DANS LA PHRASE, ET DOIT Y RESTER. La regle du depot est
 * absolue (CLAUDE.md) : aucun prix affiche sans la mention. Elle ne pouvait pas
 * etre deleguee aux mentions d Offres ni de CarteDuStudio — depuis que les
 * objections passent avant le prix, la FAQ est rendue AVANT ces deux sections,
 * et ces deux montants n etaient couverts par rien. Une note de bas de section
 * n aurait pas suffi non plus : la reponse repart telle quelle dans le JSON-LD
 * FAQPage ci-dessous, que Google republie hors de tout contexte de page.
 */
function construireQuestions(
  prix: (slug: string) => string | null,
): { q: string; r: string }[] {
  const suivi = prix("hebergement");
  const suiviAssistant = prix("suivi-assistant");
  const tarifs =
    suivi && suiviAssistant
      ? `Ensuite, ${suivi} pour l'hébergement, les mises à jour et les sauvegardes — ${suiviAssistant} si votre site a l'assistant, qui tourne en continu, et c'est alors obligatoire. Les deux montants s'entendent TVA comprise.`
      : "Ensuite, le suivi mensuel prend le relais : hébergement, mises à jour et sauvegardes — et l'assistant quand votre site en a un, auquel cas le suivi est obligatoire.";

  return [
    {
      // « Oui, quand vous avez deja un site … si on part de zero, comptez une
      // semaine » faisait deux promesses de delai la ou le guide de voix n en
      // autorise qu une : le depart de zero n a plus de delai distinct, c est
      // la meme semaine. La reponse le dit d une phrase, et la seconde
      // condition disparait avec.
      q: "Une semaine, vraiment ?",
      r: "Oui, et c'est la même semaine que vous ayez déjà un site ou non. Je reprends vos textes, je refais la mise en page, je branche le formulaire et les rendez-vous. Le délai court dès votre feu vert, pas dès que vous m'avez envoyé quelque chose : vous n'avez rien à préparer.",
    },
    {
      q: "Je n'ai ni textes ni photos. C'est bloquant ?",
      r: "Non, et c'est compris dans le prix. Si un site existe, je récupère ce qui s'y trouve et je le réécris ; vous me dites ce qui a changé. Sinon je vous propose une maquette rédigée, vous corrigez. Les photos de votre entreprise font partie du Site et de L'Assistant.",
    },
    {
      q: "Qui gère l'hébergement et le nom de domaine ?",
      r: `Moi. Domaine et hébergement de la première année sont compris dans les trois formules. ${tarifs} Le domaine reste à votre nom : il vous appartient.`,
    },
    {
      // « c'est corrigé dans la journée » est tombe : c etait un engagement de
      // reactivite sans source, et le seul autorise — « réponse le jour
      // ouvrable suivant » — vit au formulaire, une seule fois. Ce qui le
      // remplace est un fait de perimetre, verifiable au contrat.
      // LES CINQ QUESTIONS PRESUPPOSAIENT TOUTES UN SITE. Celle-ci est la
      // seule ou le reste du catalogue s installe sans forcer : « apres » vaut
      // aussi bien pour une correction que pour une affiche de rentree. Elle
      // s elargit donc, et c est elle qui dit au visiteur venu pour des cartes
      // de visite qu il est au bon endroit.
      q: "Et après, si j'ai besoin d'autre chose ?",
      r: "Deux allers-retours sont compris pendant la conception. Une fois en ligne, un message suffit : un tarif qui bouge, une prestation qui s'ajoute, un horaire qui change. Les modifications de contenu sont comprises dans le suivi de L'Assistant ; sur les deux autres formules, elles sont facturées à la demande. Et vous n'êtes pas limité au site : logotype, cartes de visite, affiche, photos de votre entreprise, fiche Google, réseaux sociaux, supports de restaurant — sur devis, avec un site chez moi comme sans.",
    },
    {
      // ANCIENNE VERSION, RETIREE EN ENTIER : « Pourquoi moins cher qu'une
      // agence ? … livré en trois jours au lieu de trois mois. » Trois fautes
      // dans deux phrases — une comparaison publiee (interdite, nommee ou
      // non), un delai de « trois jours » alors que la seule promesse est une
      // semaine, et un plaidoyer de prix qui attire l attention sur le doute
      // qu il veut lever. La question devient celle que le lecteur se pose
      // vraiment, et la reponse BORNE la prestation au lieu de la defendre.
      //
      // « NI SOUS-TRAITANCE » NE REVIENT PAS. C etait faux : la production des
      // reseaux sociaux est faite avec un partenaire, et /services/
      // reseaux-sociaux comme lib/familles.ts le disent noir sur blanc. La
      // contradiction etait a deux clics sur le site public. La phrase a deja
      // ete corrigee une fois puis reintroduite par une reecriture : la portee
      // exacte est « le site est dessine et construit par la meme personne »,
      // ce qui est vrai, et non une negation en bloc, qui ne l est pas.
      // Meme correction dans components/Studio.tsx, second paragraphe.
      q: "À ce prix-là, qu'est-ce qui n'est pas fait ?",
      r: "Une page, pas dix. Deux allers-retours, pas trois. Vos textes sont repris de votre site actuel et réécrits, pas rédigés de zéro. Il n'y a ni bureaux, ni équipe commerciale : votre site est dessiné et construit par la même personne, celle à qui vous parlez, et c'est encore elle qui répond l'année suivante.",
    },
  ];
}

export default async function Faq() {
  // Lecture PARTAGEE avec Offres, CarteDuStudio et le hero, sur le meme ecran
  // (lib/catalogue.ts memoise par requete) : aucun aller-retour en plus.
  const catalogue = await chargerCatalogue();
  const prix = (slug: string) => {
    const service = catalogue.find((s) => s.slug === slug);
    if (!service || service.priceCents === null) return null;
    return `${formatChfAmount(service.priceCents)}${CHF_UNIT}${MONTHLY_SUFFIX}`;
  };
  const QUESTIONS = construireQuestions(prix);

  // Le JSON-LD est bati sur la MEME liste que le rendu : une donnee structuree
  // qui promettrait a Google une reponse que la page n affiche pas est
  // exactement ce que Google sanctionne.
  const SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUESTIONS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.r },
    })),
  };

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

        {/* LA SECTION SE TERMINAIT SUR UNE PORTE FERMEE. Les cinq reponses
            levent les objections une par une, et le lecteur arrivait au bas
            de la derniere sans rien a faire de ce qu il venait de decider.
            Les deux FAQ de pages — components/PageFamille.tsx et
            app/(site)/services/[slug]/page.tsx — closent la leur par ce meme
            bloc .c-row depuis leur ecriture ; l accueil etait le seul a ne
            pas l avoir.

            Le motif est repris tel quel, a une difference pres : le bouton
            principal pointe vers /devis et non vers WhatsApp. Les pages de
            famille et de formule connaissent la prestation demandee et
            peuvent amorcer la conversation avec son sujet (BoutonDevis) ;
            l accueil, lui, ne sait pas encore ce que le visiteur veut — le
            formulaire est l endroit ou il le dit. */}
        <div className="c-row" data-reveal>
          <a className="btn" href="/devis">
            Demander un devis <span className="ar">→</span>
          </a>
          <a className="btn btn-line" href="/services">
            Voir les formules
          </a>
        </div>
      </div>
    </section>
  );
}
