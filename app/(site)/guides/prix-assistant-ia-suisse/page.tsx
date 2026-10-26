import type { Metadata } from "next";
import GuidePage, { Partie, Tableau, metadataGuide } from "@/components/Guide";
import { TableauNosPrix, phraseNosPrix } from "@/components/PrixGuide";
import { lireMiseEnPlace, lirePaliers } from "@/lib/catalogue";
import { RELEVE_MARCHE, cheminGuide, dateLisible } from "@/lib/guides";

/**
 * /guides/prix-assistant-ia-suisse — COMBIEN COUTE UN ASSISTANT IA.
 *
 * Ce qui fait le prix, les fourchettes du marche romand (lib/guides.ts,
 * `RELEVE_MARCHE`, sans nommer aucun concurrent), nos prix LUS EN BASE
 * (components/PrixGuide.tsx), puis les pieges et une checklist.
 *
 * `force-dynamic` : nos montants sont lus a chaque requete, comme sur
 * l accueil et /services. Sans base, la page se rend sans montant.
 *
 * AUCUNE PROMESSE DE RENTABILITE : ni heures gagnees, ni clients en plus
 * (.agents/product-marketing.md, « Ce qu on ne promet pas »). La section
 * « rentable ? » donne une methode de jugement, pas un chiffre.
 */

export const dynamic = "force-dynamic";

const SLUG = "prix-assistant-ia-suisse";

export const metadata: Metadata = metadataGuide(SLUG);

const SOMMAIRE = [
  { id: "ce-qui-fait-le-prix", titre: "Qu'est-ce qui fait le prix d'un assistant IA ?" },
  { id: "marche", titre: "Combien coûte un assistant IA en Suisse romande ?" },
  { id: "nos-prix", titre: "Combien coûtent nos assistants ?" },
  { id: "pieges", titre: "Quels pièges éviter ?" },
  { id: "checklist", titre: "La checklist avant de signer" },
  { id: "rentable", titre: "Est-ce rentable pour ma PME ?" },
] as const;

export default async function GuidePrix() {
  const [montant, paliers] = await Promise.all([lireMiseEnPlace(), lirePaliers("fr")]);
  const nosPrix = phraseNosPrix(montant, paliers);
  const m = RELEVE_MARCHE;
  const date = dateLisible(m.date);

  const questions = [
    {
      q: "Combien coûte un assistant IA pour une PME en Suisse ?",
      r: `Sur les pages publiques relevées en Suisse romande le ${date}, une mise en place d'environ ${m.miseEnPlaceMin} à ${m.miseEnPlaceMax} francs, puis un abonnement d'environ ${m.mensuelMin} à ${m.mensuelMax} francs par mois, prix affichés hors taxe. Le prix dépend du nombre de tâches, du volume, du téléphone et de l'hébergement.`,
    },
    {
      q: "Combien coûte l'assistant de Nawa Corps ?",
      r: nosPrix,
    },
    {
      q: "Pourquoi un abonnement mensuel en plus de la mise en place ?",
      r: "Parce qu'un assistant se suit : le modèle d'IA et l'hébergement ont un coût chaque mois, et quelqu'un règle l'assistant, vérifie ses réponses et prépare le relevé. Un assistant que personne ne suit finit par se tromper ou par ne plus servir.",
    },
    {
      q: "Le coût de l'IA est-il compris dans le prix ?",
      r: "Chez certains prestataires, non : l'usage du modèle d'IA est facturé en plus, selon la consommation. Demandez-le par écrit. Chez Nawa Corps, l'abonnement est un prix fixe par palier, choisi selon votre volume de demandes : la consommation du modèle n'est pas refacturée à part.",
    },
    {
      q: "Le téléphone coûte-t-il plus cher ?",
      r: "Souvent oui, parce qu'il consomme des minutes de voix. Chez Nawa Corps, le téléphone fait partie du palier Complet : trois tâches, dont le téléphone, avec 300 minutes incluses par mois. Au-delà, le prix des minutes en plus vous est annoncé par écrit.",
    },
    {
      q: "Faut-il s'engager pour 12 mois ?",
      r: "Pas forcément. Certains prestataires l'exigent, d'autres non. Chez Nawa Corps, l'abonnement est sans engagement et résiliable chaque mois, avec effet à la fin du mois en cours.",
    },
    {
      q: "Peut-on essayer avant de payer ?",
      r: "Chez Nawa Corps, oui : une démo sur votre métier, puis deux semaines d'essai sur vos vraies demandes, sans rien payer. La mise en place n'est payée qu'après l'essai, si le relevé du lundi vous convient.",
    },
  ];

  return (
    <GuidePage
      slug={SLUG}
      h1={["Combien coûte", "un assistant IA", "en Suisse ?"]}
      reponse={`En Suisse romande, un assistant IA pour PME coûte en général une mise en place unique d'environ ${m.miseEnPlaceMin} à ${m.miseEnPlaceMax} francs, puis un abonnement d'environ ${m.mensuelMin} à ${m.mensuelMax} francs par mois, selon nos relevés de pages publiques du ${date}. Le prix dépend du nombre de tâches, du volume de demandes, du téléphone et de l'hébergement des données.`}
      sommaire={SOMMAIRE}
      questions={questions}
      lies={["automatisation-ia-pme-geneve", "assistant-ia-ou-secretaire", "ia-et-protection-des-donnees"]}
    >
      <Partie id="ce-qui-fait-le-prix" titre="Qu'est-ce qui fait le prix d'un assistant IA ?">
        <p>Six postes, presque toujours les mêmes d&apos;un prestataire à l&apos;autre.</p>
        <Tableau legende="Les six postes du prix">
          <thead>
            <tr>
              <th scope="col">Poste</th>
              <th scope="col">Ce que ça couvre</th>
              <th scope="col">Ce qui le fait varier</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Mise en place</th>
              <td>Régler l&apos;assistant sur votre entreprise : vos prestations, vos mots, vos réponses types.</td>
              <td>Partir d&apos;une page blanche ou d&apos;une base existante ; le nombre de tâches.</td>
            </tr>
            <tr>
              <th scope="row">Abonnement</th>
              <td>Faire tourner l&apos;assistant, le suivre, corriger ses réponses.</td>
              <td>La fréquence du suivi ; ce qui est compris ou facturé à part.</td>
            </tr>
            <tr>
              <th scope="row">Volume</th>
              <td>Le nombre de demandes traitées par mois.</td>
              <td>Un plafond par palier, ou une facture à l&apos;usage.</td>
            </tr>
            <tr>
              <th scope="row">Téléphone</th>
              <td>Prendre les appels quand vous ne pouvez pas décrocher.</td>
              <td>Les minutes de voix, souvent comptées à part.</td>
            </tr>
            <tr>
              <th scope="row">Hébergement en Suisse</th>
              <td>Garder les données de l&apos;assistant sur des serveurs en Suisse.</td>
              <td>Un engagement ferme, ou une simple « option ».</td>
            </tr>
            <tr>
              <th scope="row">Modèle d&apos;IA</th>
              <td>Le programme qui lit et rédige. Il se paie à l&apos;usage.</td>
              <td>Compris dans l&apos;abonnement, ou refacturé selon la consommation.</td>
            </tr>
          </tbody>
        </Tableau>
      </Partie>

      <Partie id="marche" titre="Combien coûte un assistant IA en Suisse romande ?">
        <p>
          Nous avons relevé le {date} les prix affichés sur les pages publiques d&apos;agences et
          d&apos;éditeurs actifs en Suisse.
        </p>
        <Tableau legende={`Fourchettes du marché, relevé du ${date}`}>
          <thead>
            <tr>
              <th scope="col">Poste</th>
              <th scope="col">Fourchette relevée</th>
              <th scope="col">À savoir</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Mise en place</th>
              <td>
                environ {m.miseEnPlaceMin} à {m.miseEnPlaceMax} fr., une fois
              </td>
              <td>Parfois précédée d&apos;un audit ou d&apos;un pilote payant.</td>
            </tr>
            <tr>
              <th scope="row">Abonnement</th>
              <td>
                environ {m.mensuelMin} à {m.mensuelMax} fr. par mois
              </td>
              <td>Le bas de la fourchette couvre souvent l&apos;exploitation seule, sans suivi.</td>
            </tr>
          </tbody>
        </Tableau>
        <p className="gd-note">
          Prix tels qu&apos;affichés, souvent hors taxe et souvent précédés de « dès » : le prix final
          peut être plus haut. Plusieurs prestataires n&apos;affichent aucun prix. Nous ne nommons
          personne : les prix changent, et ce guide n&apos;est pas un classement.
        </p>
      </Partie>

      <Partie id="nos-prix" titre="Combien coûtent nos assistants ?">
        <p>
          Nos prix sont écrits, sans « dès », et affichés avant la démo. Le palier se fixe par écrit à la
          fin de la démo.
        </p>
        <p>{nosPrix}</p>
        <TableauNosPrix montant={montant} paliers={paliers} />
        <p>
          La démo et les deux semaines d&apos;essai ne coûtent rien. Le détail de l&apos;offre :{" "}
          <a href="/services">ce que vous payez, et quand</a>.
        </p>
      </Partie>

      <Partie id="pieges" titre="Quels pièges éviter avant de signer ?">
        <ul>
          <li>
            <span>
              <strong>L&apos;engagement de 12 mois.</strong> Si l&apos;assistant ne sert pas, vous payez
              quand même. Préférez un abonnement résiliable chaque mois.
            </span>
          </li>
          <li>
            <span>
              <strong>Le prix caché jusqu&apos;à la fin.</strong> Un « sur devis » après trois
              rendez-vous. Demandez le prix avant la démo.
            </span>
          </li>
          <li>
            <span>
              <strong>Le coût de l&apos;IA facturé en plus.</strong> L&apos;abonnement paraît bas, puis
              la consommation du modèle s&apos;ajoute chaque mois.
            </span>
          </li>
          <li>
            <span>
              <strong>Le « dès » sans plafond.</strong> Demandez le prix pour votre cas, par écrit.
            </span>
          </li>
          <li>
            <span>
              <strong>Payer avant d&apos;avoir vu.</strong> Un audit ou un pilote payant avant de voir
              l&apos;assistant sur vos demandes.
            </span>
          </li>
          <li>
            <span>
              <strong>Les minutes de téléphone au-delà du forfait.</strong> Demandez ce qui se passe
              quand le forfait est dépassé.
            </span>
          </li>
          <li>
            <span>
              <strong>« Suisse ou Union européenne ».</strong> Ce n&apos;est pas la même chose
              qu&apos;un hébergement en Suisse. Voir{" "}
              <a href={cheminGuide("ia-et-protection-des-donnees")}>IA et protection des données</a>.
            </span>
          </li>
        </ul>
      </Partie>

      <Partie id="checklist" titre="La checklist avant de signer">
        <ol>
          <li>Le prix de la mise en place, écrit.</li>
          <li>Le prix mensuel, écrit, et ce qu&apos;il comprend : volume, suivi, coût de l&apos;IA.</li>
          <li>Le prix du téléphone, s&apos;il vous intéresse.</li>
          <li>La durée d&apos;engagement et le préavis de résiliation.</li>
          <li>Ce que vous voyez avant de payer : une démo, un essai.</li>
          <li>Où sont hébergées les données.</li>
          <li>Ce que vous récupérez si vous partez.</li>
          <li>La mention de TVA : comprise, en sus, ou pas de TVA.</li>
        </ol>
      </Partie>

      <Partie id="rentable" titre="Un assistant IA est-il rentable pour ma PME ?">
        <p>
          Nous ne promettons ni heures gagnées ni clients en plus. Personne ne peut le savoir avant
          d&apos;avoir vu l&apos;assistant sur vos demandes.
        </p>
        <p>
          Posez-vous plutôt cette question : combien de soirées par semaine passez-vous sur vos demandes,
          vos devis et vos relances ? Comparez avec le prix de l&apos;abonnement. Puis jugez sur pièces :
          pendant l&apos;essai, le relevé du lundi montre ce qui a été traité, relancé et préparé.
        </p>
        <p>
          Pour comparer avec une embauche :{" "}
          <a href={cheminGuide("assistant-ia-ou-secretaire")}>assistant IA ou secrétaire</a>.
        </p>
      </Partie>
    </GuidePage>
  );
}
