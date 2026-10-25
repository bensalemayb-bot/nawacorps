import type { Metadata } from "next";
import GuidePage, { Partie, metadataGuide } from "@/components/Guide";
import { SOURCES_CHIFFRES } from "@/lib/chiffres";
import { RELEVE_MARCHE, cheminGuide, dateLisible } from "@/lib/guides";
import { CHEMIN_METIERS } from "@/lib/metiers";

/**
 * /guides/assistant-ia-ou-secretaire — LE COMPARATIF.
 *
 * Cinq options cote a cote (secretaire a temps partiel, assistant IA,
 * logiciel metier seul, agence en projet sur mesure, ne rien faire) et une
 * conclusion honnete : l assistant ne remplace pas une personne.
 *
 * LE SEUL CHIFFRE DE SALAIRE EST LE SALAIRE MINIMUM GENEVOIS 2026, lu sur
 * ge.ch le 25.10.2026 (24.59 fr. bruts de l heure). Le montant mensuel pour
 * 20 heures par semaine est un calcul fait sur ce chiffre officiel, et la
 * page montre le calcul : c est un plancher legal, pas le salaire du marche,
 * et la page le dit. Aucun autre chiffre de salaire sans source officielle.
 *
 * AUCUN MONTANT DE NAWA CORPS ICI, donc aucune lecture en base : le cout de
 * l assistant est la fourchette du marche romand (lib/guides.ts), avec un
 * renvoi vers le guide des prix, qui lit nos prix en base.
 */

const SLUG = "assistant-ia-ou-secretaire";

export const metadata: Metadata = metadataGuide(SLUG);

/** Source officielle du salaire minimum genevois, lue le 25.10.2026. */
const SOURCE_SALAIRE_MINIMUM =
  "https://www.ge.ch/appliquer-salaire-minimum-genevois/montant-calcul-du-salaire-minimum";

const SOMMAIRE = [
  { id: "comparatif", titre: "Les cinq options, côte à côte" },
  { id: "cout-secretaire", titre: "Combien coûte une secrétaire à temps partiel à Genève ?" },
  { id: "ce-que-fait-ia", titre: "Que fait un assistant IA qu'une secrétaire ne fait pas ?" },
  { id: "ce-que-fait-secretaire", titre: "Que fait une secrétaire qu'un assistant IA ne fait pas ?" },
  { id: "logiciel", titre: "Un logiciel métier ne suffit-il pas ?" },
  { id: "quand-secretaire", titre: "Quand une secrétaire reste-t-elle le bon choix ?" },
  { id: "conclusion", titre: "Notre avis, franchement" },
] as const;

export default function GuideSecretaire() {
  const m = RELEVE_MARCHE;
  const releve = `relevé du ${dateLisible(m.date)}`;

  const questions = [
    {
      q: "Un assistant IA peut-il remplacer une secrétaire ?",
      r: "Non. Il reprend la paperasse répétitive : répondre aux demandes, relancer les devis, réclamer les pièces, préparer des brouillons. Accueillir, négocier, régler un cas unique, tenir la comptabilité ou décider restent un travail humain.",
    },
    {
      q: "Combien coûte une secrétaire à temps partiel à Genève ?",
      r: "Au moins le salaire minimum genevois, 24.59 francs bruts de l'heure en 2026 selon l'État de Genève. Pour 20 heures par semaine, cela fait environ 2'130 francs bruts par mois, avant les charges sociales de l'employeur et les vacances. Le salaire du marché est en général plus haut.",
    },
    {
      q: "Combien coûte un assistant IA pour une PME ?",
      r: `Sur les pages publiques relevées en Suisse romande le ${dateLisible(m.date)}, environ ${m.mensuelMin} à ${m.mensuelMax} francs par mois, plus une mise en place d'environ ${m.miseEnPlaceMin} à ${m.miseEnPlaceMax} francs, prix affichés hors taxe. Le détail est dans notre guide des prix.`,
    },
    {
      q: "Un assistant IA travaille-t-il le soir et le week-end ?",
      r: "Il peut accuser réception et préparer les réponses à toute heure. Ce qui engage l'entreprise, un prix, une date, un devis, attend votre validation, quand vous avez le temps.",
    },
    {
      q: "Peut-on avoir une secrétaire et un assistant IA ?",
      r: "Oui, et c'est souvent le meilleur cas. L'assistant prépare les réponses et les relances répétitives ; la secrétaire valide, appelle les clients et règle ce qui sort de l'ordinaire.",
    },
    {
      q: "Et si je ne fais rien ?",
      r: "Ça ne coûte rien sur la facture. Le prix se paie en soirées, en demandes qui attendent pendant le chantier et en devis jamais relancés. C'est un choix possible si le volume est faible.",
    },
  ];

  return (
    <GuidePage
      slug={SLUG}
      h1={["Assistant IA", "ou secrétaire ?"]}
      reponse="Un assistant IA ne remplace pas une secrétaire. Il reprend la paperasse répétitive, répondre aux demandes, relancer, préparer des brouillons, y compris le soir et le week-end, pour quelques centaines de francs par mois. Une secrétaire reste le bon choix pour accueillir, négocier, régler les cas uniques ou tenir la comptabilité. Beaucoup de PME gagnent à combiner les deux."
      sommaire={SOMMAIRE}
      questions={questions}
      lies={["automatisation-ia-pme-geneve", "prix-assistant-ia-suisse", "ia-et-protection-des-donnees"]}
    >
      <Partie id="comparatif" titre="Secrétaire, assistant IA, logiciel, agence ou rien : que choisir ?">
        <p>
          Cinq façons de traiter le bureau d&apos;une PME. Aucune n&apos;est la bonne pour tout le
          monde. Le tableau défile sur téléphone.
        </p>
        <div className="gd-table large" role="region" aria-label="Comparatif des cinq options" tabIndex={0}>
          <table>
            <caption>Comparatif des cinq options</caption>
            <thead>
              <tr>
                <th scope="col">Option</th>
                <th scope="col">Coût mensuel</th>
                <th scope="col">Soir et week-end</th>
                <th scope="col">Ce qu&apos;elle fait</th>
                <th scope="col">Ce qu&apos;elle ne fait pas</th>
                <th scope="col">Mise en route</th>
                <th scope="col">Risques</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Secrétaire à temps partiel</th>
                <td>
                  Au moins 24.59 fr. bruts de l&apos;heure à Genève (salaire minimum 2026), soit environ
                  2&apos;130 fr. bruts pour 20 h par semaine, hors charges sociales et vacances
                </td>
                <td>Non, sauf heures supplémentaires</td>
                <td>Accueil, téléphone, agenda, devis, factures, relances, cas particuliers</td>
                <td>Être là en dehors de ses heures</td>
                <td>Recruter, former : plusieurs semaines</td>
                <td>Absences, départ, difficulté à recruter</td>
              </tr>
              <tr>
                <th scope="row">Assistant IA</th>
                <td>
                  Environ {m.mensuelMin} à {m.mensuelMax} fr. ({releve}), plus une mise en place
                </td>
                <td>Oui, pour accuser réception et préparer</td>
                <td>Répondre aux demandes, relancer, réclamer des pièces, trier, préparer des brouillons</td>
                <td>S&apos;engager sur un prix ou une date, négocier, régler un cas unique</td>
                <td>Une démo, puis un essai sur vos demandes</td>
                <td>Erreur de l&apos;IA si personne ne valide ; données mal hébergées</td>
              </tr>
              <tr>
                <th scope="row">Logiciel métier seul</th>
                <td>L&apos;abonnement de l&apos;éditeur, variable</td>
                <td>Il attend que vous l&apos;ouvriez</td>
                <td>Ranger, facturer, tenir l&apos;agenda et la comptabilité</td>
                <td>Répondre au client, relancer de lui-même</td>
                <td>Saisir vos données, apprendre l&apos;outil</td>
                <td>Un outil de plus que personne n&apos;a le temps d&apos;ouvrir</td>
              </tr>
              <tr>
                <th scope="row">Agence, projet sur mesure</th>
                <td>Sur devis, souvent après un audit, puis une maintenance</td>
                <td>Selon ce qui est construit</td>
                <td>Une automatisation pensée pour vos processus</td>
                <td>Le suivi au quotidien, si rien n&apos;est prévu</td>
                <td>Audit, cahier des charges, développement</td>
                <td>Prix connu tard ; projet qui s&apos;étire</td>
              </tr>
              <tr>
                <th scope="row">Ne rien faire</th>
                <td>0 fr.</td>
                <td>C&apos;est vous</td>
                <td>Vous gardez tout en main</td>
                <td>Répondre pendant que vous êtes sur le chantier</td>
                <td>Aucune</td>
                <td>Vos soirées, des demandes sans réponse, des devis sans relance</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="gd-note">
          Fourchettes de l&apos;assistant IA : pages publiques d&apos;agences et d&apos;éditeurs actifs
          en Suisse romande, {releve}, prix affichés souvent hors taxe. Détail dans{" "}
          <a href={cheminGuide("prix-assistant-ia-suisse")}>combien coûte un assistant IA en Suisse</a>.
        </p>
      </Partie>

      <Partie id="cout-secretaire" titre="Combien coûte une secrétaire à temps partiel à Genève ?">
        <p>
          Le seul chiffre officiel est un plancher : le salaire minimum genevois. Il est de{" "}
          <strong>24.59 francs bruts de l&apos;heure depuis le 1er janvier 2026</strong>, selon{" "}
          <a href={SOURCE_SALAIRE_MINIMUM} target="_blank" rel="noopener">
            l&apos;État de Genève (ge.ch)
          </a>
          .
        </p>
        <p>
          Pour 20 heures par semaine, le calcul donne environ 2&apos;130 francs bruts par mois (24.59 ×
          20 heures × 52 semaines ÷ 12 mois). À cela s&apos;ajoutent les charges sociales de
          l&apos;employeur et les vacances.
        </p>
        <p>
          C&apos;est un minimum légal, pas le salaire du marché : une secrétaire expérimentée est en
          général payée davantage. Pour un chiffre précis, comparez avec les salaires de votre branche
          ou votre convention collective.
        </p>
      </Partie>

      <Partie id="ce-que-fait-ia" titre="Que fait un assistant IA qu'une secrétaire ne fait pas ?">
        <ul>
          <li>Il accuse réception à toute heure, y compris le soir et le dimanche.</li>
          <li>Il ne prend pas de vacances et ne tombe pas malade.</li>
          <li>Il coûte un montant fixe par mois, quel que soit le jour de la semaine.</li>
          <li>Il tient sans effort la liste des devis à relancer et des pièces qui manquent.</li>
        </ul>
        <p>
          Le soir et le week-end comptent : selon le baromètre ARTIsanté de la CAPEB, 48 % des artisans
          du bâtiment travaillent régulièrement le week-end (
          <a href={SOURCES_CHIFFRES.capeb} target="_blank" rel="noopener">
            CAPEB, 2026, France
          </a>
          ).
        </p>
      </Partie>

      <Partie id="ce-que-fait-secretaire" titre="Que fait une secrétaire qu'un assistant IA ne fait pas ?">
        <ul>
          <li>Elle accueille et rassure un client mécontent, au téléphone ou au comptoir.</li>
          <li>Elle négocie, arbitre, décide dans le cadre que vous lui donnez.</li>
          <li>Elle règle le cas qui ne ressemble à aucun autre.</li>
          <li>Elle tient la comptabilité, les salaires, les dossiers administratifs.</li>
          <li>Elle connaît vos clients depuis des années.</li>
        </ul>
        <p>
          Un assistant IA peut préparer une partie de ce travail. Il ne prend pas la responsabilité
          d&apos;une décision.
        </p>
      </Partie>

      <Partie id="logiciel" titre="Un logiciel métier ne suffit-il pas ?">
        <p>
          Un logiciel de gestion range, facture et tient l&apos;agenda. C&apos;est indispensable.
          Mais il attend que vous l&apos;ouvriez : il ne répond pas au client qui écrit pendant que vous
          êtes sur le chantier, et il ne relance pas un devis tout seul.
        </p>
        <p>
          Un assistant IA s&apos;ajoute à vos outils ; il ne les remplace pas. Ce qui se branche se
          vérifie outil par outil.
        </p>
      </Partie>

      <Partie id="quand-secretaire" titre="Quand une secrétaire reste-t-elle le bon choix ?">
        <ul>
          <li>Vos clients viennent sur place et veulent être accueillis par quelqu&apos;un.</li>
          <li>La plupart de vos demandes sont uniques, pas répétitives.</li>
          <li>Vous avez besoin de quelqu&apos;un qui décide en votre absence.</li>
          <li>Le travail de bureau comprend la comptabilité et les salaires.</li>
          <li>Vous avez trouvé la bonne personne. Dans ce cas, gardez-la.</li>
        </ul>
        <p>
          L&apos;assistant IA est le bon choix quand le bureau est fait de demandes qui se ressemblent,
          que vous traitez le soir, et que vous ne trouvez ou ne pouvez pas payer personne pour le faire.
        </p>
      </Partie>

      <Partie id="conclusion" titre="Notre avis, franchement">
        <p>
          Un assistant IA ne remplace pas une personne. Il reprend la paperasse répétitive : répondre,
          relancer, réclamer, préparer. Vous gardez la décision. Il ne s&apos;engage jamais à votre
          place.
        </p>
        <p>
          Si vous avez une secrétaire, l&apos;assistant peut lui laisser le temps pour ce qui demande
          une personne. Si vous n&apos;en avez pas, il peut reprendre une partie de vos soirées. Dans les
          deux cas, jugez sur pièces : voyez-le sur des demandes de votre métier avant de décider.
        </p>
        <p>
          Pour aller plus loin :{" "}
          <a href={cheminGuide("automatisation-ia-pme-geneve")}>
            l&apos;automatisation par l&apos;IA dans une PME genevoise
          </a>
          , et <a href={CHEMIN_METIERS}>l&apos;assistant, métier par métier</a>.
        </p>
      </Partie>
    </GuidePage>
  );
}
