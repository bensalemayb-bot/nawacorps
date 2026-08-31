import { SITE_URL, jsonLd } from "@/lib/site";

/**
 * FIL D ARIANE ET Q/R, EN DONNEES STRUCTUREES — un seul emetteur pour toutes
 * les pages internes.
 *
 * Deux manques releves le 31 aout 2026, page par page :
 *
 *  1. AUCUN `BreadcrumbList` nulle part, alors que le fil existe deja a
 *     l ecran : chaque page interne affiche son rang (« Services », puis le
 *     titre). Le moteur, lui, ne voyait qu une suite d URL sans hierarchie —
 *     et c est ce qui lui permet d afficher « nawacorps.ch > Services > Le
 *     Site » au lieu de l URL brute dans un resultat.
 *  2. `FAQPage` sur l accueil SEULEMENT, alors que huit pages portent des
 *     questions/reponses : les trois formules et les cinq familles. Elles
 *     etaient rendues en `<details>` sans jamais etre declarees.
 *
 * POURQUOI LES DEUX DANS UN SEUL COMPOSANT. Ils vont toujours ensemble sur
 * une page interne, et un `@graph` unique evite d empiler deux balises
 * `<script>` qui disent chacune un morceau de la meme page.
 *
 * LES QUESTIONS VIENNENT DE LA MEME SOURCE QUE L AFFICHAGE — `questions` de
 * lib/formules.ts ou lib/familles.ts, le tableau que la page rend en
 * `<details>`. C est la seule protection contre la derive : un balisage de Q/R
 * qui ne correspond plus au texte visible est une declaration fausse au
 * moteur, et Google la traite comme telle.
 *
 * Les URL sont ABSOLUES : un `item` de fil d Ariane relatif n identifie rien.
 */

export type SegmentFil = {
  /** Ce que le lecteur lit dans le fil. */
  nom: string;
  /** Chemin absolu depuis la racine, « / » pour l accueil. */
  chemin: string;
};

export type QuestionReponse = {
  q: string;
  r: string;
};

export default function SchemaPage({
  fil,
  questions,
}: {
  fil: readonly SegmentFil[];
  questions?: readonly QuestionReponse[];
}) {
  const graphe: object[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: fil.map((segment, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: segment.nom,
        item: `${SITE_URL}${segment.chemin === "/" ? "" : segment.chemin}`,
      })),
    },
  ];

  if (questions && questions.length > 0) {
    graphe.push({
      "@type": "FAQPage",
      mainEntity: questions.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.r },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: jsonLd({ "@context": "https://schema.org", "@graph": graphe }),
      }}
    />
  );
}
