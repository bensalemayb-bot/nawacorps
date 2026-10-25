/* DES <a> CLASSIQUES, JAMAIS next/link (decision B7) : la navigation client ne
   rejoue pas les revelations au scroll d Interactions.tsx. */
import {
  avecPrix,
  lireMiseEnPlace,
  lirePaliers,
  phrasePaliers,
  type PalierAbonnement,
} from "@/lib/catalogue";
import { jsonLd } from "@/lib/site";
import { dictionnaire, type Dictionnaire } from "@/lib/dictionnaires";
import { LANGUE_HTML, lien, type Locale } from "@/lib/i18n";

// Section (06) Questions — reference/binacore.html lignes 1105-1133.
//
// AUCUN JS : le depliage est celui de <details>/<summary>, natif.
//
// UNE SEULE LISTE, DEUX SORTIES : le rendu et le JSON-LD FAQPage lisent les
// memes questions. Une donnee structuree qui promettrait a un moteur une
// reponse que la page n affiche pas est exactement ce qu il sanctionne. Les
// reponses sont des blocs autonomes de 60 mots au plus, lisibles tels quels par
// un moteur de reponse. `inLanguage` distingue les deux FAQPage FR et EN.

/**
 * LES NEUF OBJECTIONS, dans l ordre du panel de 100 PME (revue A tour 2, m1) :
 * la confiance d abord (est-ce que ca marche chez moi, donnees, l IA qui
 * ecrit, l erreur), le
 * besoin ensuite (dont la penurie d embauche — ces deux questions sont
 * arrivees le 25.10.2026), l habitude, le prix en dernier.
 *
 * « VOUS AVEZ DES REFERENCES ? » EST DEVENUE « COMMENT SAVOIR SI CA MARCHE
 * CHEZ MOI ? » le 25.10.2026 : la reponse est la demo et l essai, que le
 * patron verifie lui-meme. Aucun client, aucun chiffre affirme (LCD art. 3).
 *
 * LA REPONSE SUR LE PRIX PORTE CHAQUE MONTANT ET SA MENTION DE TVA DANS LA
 * MEME PHRASE : elle repart telle quelle dans le JSON-LD, hors de tout
 * contexte de page. La mise en place et les trois paliers sont lus en base ;
 * ce qui manque se dit sans montant, chaque morceau independamment.
 */
function construireQuestions(
  t: Dictionnaire,
  locale: Locale,
  montant: string | null,
  paliers: readonly PalierAbonnement[] | null,
): { q: string; r: string }[] {
  const prix = [
    t.faq.prixDebut,
    montant
      ? avecPrix(t.faq.prixMiseEnPlace, montant, locale)
      : t.faq.prixMiseEnPlaceSansMontant,
    paliers
      ? avecPrix(
          t.faq.prixAbonnement.replace("{paliers}", phrasePaliers(paliers, locale)),
          "",
          locale,
        )
      : t.faq.prixAbonnementSansMontant,
  ].join(" ");
  return [
    { q: t.faq.questionPreuve, r: t.faq.reponsePreuve },
    { q: t.faq.questionDonnees, r: t.faq.reponseDonnees },
    { q: t.faq.questionIa, r: t.faq.reponseIa },
    { q: t.faq.questionErreur, r: t.faq.reponseErreur },
    { q: t.faq.questionBesoin, r: t.faq.reponseBesoin },
    { q: t.faq.questionPersonne, r: t.faq.reponsePersonne },
    { q: t.faq.questionOutils, r: t.faq.reponseOutils },
    { q: t.faq.questionTemps, r: t.faq.reponseTemps },
    { q: t.faq.questionPrix, r: prix },
  ];
}

export default async function Faq({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);
  // Lecture memoisee, partagee avec le hero et Offres : aucun aller-retour en
  // plus. `lireMiseEnPlace` ne leve jamais.
  const [montant, paliers] = await Promise.all([lireMiseEnPlace(), lirePaliers(locale)]);
  const QUESTIONS = construireQuestions(t, locale, montant, paliers);

  const SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: LANGUE_HTML[locale],
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
          <span className="meta" data-reveal><span className="index">(06)</span>{`  ${t.faq.section}`}</span>
          <h2 className="sr-only">{t.faq.titreCache}</h2>
        </div>
        <div data-reveal>
          {QUESTIONS.map((item) => (
            <details key={item.q}>
              <summary>{item.q}<span className="pl2">+</span></summary>
              <p className="a">{item.r}</p>
            </details>
          ))}
        </div>

        {/* LA SECTION NE SE TERMINE PAS SUR UNE PORTE FERMEE : la demande de
            demo, puis la page de detail de l assistant. L espace avant la
            fleche est dans la chaine du dictionnaire, pas dans le JSX. */}
        <div className="c-row" data-reveal>
          <a className="btn" href={lien(locale, "/demonstrations")}>
            {t.faq.ctaDevis}<span className="ar">→</span>
          </a>
          <a className="btn btn-line" href={lien(locale, "/services")}>
            {t.faq.ctaDetail}
          </a>
        </div>
        {/* UNE LIGNE VERS LE GUIDE DE REFERENCE (25.10.2026), sous les deux
            boutons, sans toucher a leur rangee. Le guide n existe qu en
            francais : le lien n est jamais prefixe. */}
        <p className="meta" data-reveal style={{ marginTop: 28 }}>
          {t.faq.lienGuideDebut}
          <a className="lnk" href="/guides/automatisation-ia-pme-geneve">{t.faq.lienGuide}</a>
          {" · "}
          <a className="lnk" href="/guides/assistant-ia-ou-secretaire">{t.faq.lienGuideSecretaire}</a>
        </p>
      </div>
    </section>
  );
}
