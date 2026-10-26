import type { Metadata } from "next";
import GuidePage, { Partie, Tableau, metadataGuide } from "@/components/Guide";
import { TableauNosPrix, phraseNosPrix } from "@/components/PrixGuide";
import { lireMiseEnPlace, lirePaliers } from "@/lib/catalogue";
import { dictionnaire } from "@/lib/dictionnaires";
import { RELEVE_MARCHE, cheminGuide, dateLisible } from "@/lib/guides";
import { CHEMIN_METIERS, cheminMetier, trouverMetier } from "@/lib/metiers";

/**
 * /guides/automatisation-ia-pme-geneve — LE GUIDE DE REFERENCE.
 *
 * La page que l on veut voir citee quand quelqu un demande a un moteur ou a un
 * assistant « automatisation IA PME Genève ». D ou la definition en tete,
 * des h2 en questions, un tableau des taches par metier, et une FAQ.
 *
 * LES PRIX DE NAWA CORPS SONT LUS EN BASE (components/PrixGuide.tsx), d ou
 * `force-dynamic` comme l accueil et /services : un prix corrige depuis
 * /admin doit l etre ici a la requete suivante. Sans base, la page se rend
 * sans montant, jamais en erreur.
 *
 * LES CHIFFRES D ETUDES viennent du dictionnaire (`chiffres`, sources dans
 * lib/chiffres.ts) : les memes que l accueil, jamais recopies, et aucun n est
 * un resultat de Nawa Corps.
 */

export const dynamic = "force-dynamic";

const SLUG = "automatisation-ia-pme-geneve";

export const metadata: Metadata = metadataGuide(SLUG);

/** Les taches, chacune avec le metier qui l illustre le mieux (lib/metiers.ts). */
const TACHES = [
  {
    tache: "Répondre aux demandes",
    fait: "Il accuse réception, demande l'adresse, une photo et l'urgence, puis vous range les demandes dans une liste triée.",
    metier: "sanitaire-chauffage",
  },
  {
    tache: "Relancer les devis",
    fait: "Il repère les devis restés sans réponse et prépare la relance. Vous la relisez, elle part.",
    metier: "electricite",
  },
  {
    tache: "Réclamer des pièces",
    fait: "Il prépare la demande des documents qui manquent au dossier, puis les relances, et tient la liste à jour jusqu'à ce que le dossier soit complet.",
    metier: "fiduciaires",
  },
  {
    tache: "Trier les messages",
    fait: "Il classe ce qui arrive (urgence, devis, question, réclamation) et demande les photos qui manquent.",
    metier: "regies-immobilieres",
  },
  {
    tache: "Prendre les appels",
    fait: "Quand vous ne pouvez pas décrocher, il prend le nom, l'objet et l'urgence. Il ne promet ni date ni prix. Le téléphone fait partie du palier Complet.",
    metier: "garages",
  },
  {
    tache: "Proposer des rendez-vous",
    fait: "Il propose des créneaux et prépare les rappels. C'est vous qui fixez le rendez-vous.",
    metier: "salons-coiffure-beaute",
  },
] as const;

const SOMMAIRE = [
  { id: "definition", titre: "Qu'est-ce que l'automatisation par l'IA, concrètement ?" },
  { id: "taches", titre: "Quelles tâches confier à un assistant IA ?" },
  { id: "limites", titre: "Que ne doit-il jamais faire seul ?" },
  { id: "etapes", titre: "Comment ça se passe, étape par étape ?" },
  { id: "prix", titre: "Combien ça coûte ?" },
  { id: "risques", titre: "Quels risques, et comment les limiter ?" },
  { id: "choisir", titre: "Comment choisir un prestataire ?" },
  { id: "etudes", titre: "Ce que mesurent les études" },
] as const;

export default async function GuideAutomatisation() {
  const [montant, paliers] = await Promise.all([lireMiseEnPlace(), lirePaliers("fr")]);
  const nosPrix = phraseNosPrix(montant, paliers);
  const chiffres = dictionnaire("fr").chiffres.items;
  const m = RELEVE_MARCHE;

  const questions = [
    {
      q: "L'IA peut-elle répondre à mes clients toute seule ?",
      r: "Seulement l'accusé de réception que vous avez relu et validé une fois, par exemple « Bien reçu, pouvez-vous m'envoyer l'adresse, une photo et l'urgence ? ». Tout le reste est préparé par l'assistant et validé par vous : aucun prix, aucune date, aucun devis ne part sans votre accord.",
    },
    {
      q: "Faut-il changer de logiciel ou d'outils ?",
      r: "Non. L'assistant travaille sur ce que vous recevez déjà, par e-mail, WhatsApp ou formulaire, et s'ajoute à vos outils. Les branchements possibles se vérifient outil par outil pendant la démo.",
    },
    {
      q: "Qu'est-ce que je dois préparer ?",
      r: "Rien. La démo se fait sur des demandes types de votre métier, puis l'essai sur vos vraies demandes, à partir de ce que vous recevez déjà. Nous n'avons accès à aucun de vos outils pendant la démo.",
    },
    {
      q: "Combien coûte l'automatisation par l'IA pour une PME ?",
      r: `Sur les pages publiques relevées en Suisse romande le ${dateLisible(m.date)}, la mise en place va d'environ ${m.miseEnPlaceMin} à ${m.miseEnPlaceMax} francs et l'abonnement d'environ ${m.mensuelMin} à ${m.mensuelMax} francs par mois, prix affichés hors taxe. ${nosPrix}`,
    },
    {
      q: "L'assistant peut-il prendre le téléphone ?",
      r: "Oui, dans le palier Complet : trois tâches, dont le téléphone. Il prend le nom, l'objet et l'urgence quand vous ne pouvez pas décrocher. Il ne promet ni date ni prix.",
    },
    {
      q: "Où sont mes données ?",
      r: "Les données de votre assistant sont hébergées en Suisse. Vous restez responsable de vos données, nous agissons comme sous-traitant (art. 9 nLPD), avec un contrat signé avant l'essai.",
    },
    {
      q: "Comment savoir si ça marche chez moi ?",
      r: "En le voyant. D'abord une démo sur des demandes de votre métier, puis deux semaines d'essai sur vos vraies demandes, avec un relevé chaque lundi. La mise en place n'est payée qu'après l'essai, si le relevé vous convient.",
    },
    {
      q: "Est-ce que l'IA remplace une secrétaire ?",
      r: "Non. Elle prend ce qui se répète, comme accuser réception ou préparer une relance. Accueillir un client, négocier, régler un cas qui ne ressemble à aucun autre ou tenir la comptabilité, c'est un travail humain.",
    },
  ];

  return (
    <GuidePage
      slug={SLUG}
      h1={["L'automatisation", "par l'IA dans", "une PME genevoise"]}
      reponse="L'automatisation par l'IA, pour une PME, consiste à confier à un assistant le travail de bureau qui revient chaque jour : répondre aux demandes, relancer les devis, réclamer les pièces, trier les messages. L'assistant prépare ; le patron valide tout ce qui engage l'entreprise, prix, dates et devis. Il ne remplace personne, il reprend ce qui encombre vos soirées."
      sommaire={SOMMAIRE}
      questions={questions}
      lies={["prix-assistant-ia-suisse", "assistant-ia-ou-secretaire", "ia-et-protection-des-donnees"]}
    >
      <Partie id="definition" titre="Qu'est-ce que l'automatisation par l'IA, concrètement ?">
        <p>
          Une automatisation classique suit une règle fixe : « si un e-mail arrive avec tel mot,
          range-le ici ». Elle casse dès que le client écrit autrement.
        </p>
        <p>
          Une IA lit le message comme vous le liriez. Elle comprend qu&apos;« il y a de l&apos;eau
          sous l&apos;évier » est une fuite, qu&apos;il manque l&apos;adresse, et elle prépare la
          question à poser. Le moteur derrière s&apos;appelle un modèle de langage : un programme qui
          lit et rédige du texte.
        </p>
        <div className="gd-encadre">
          <p>
            <strong>La règle de base :</strong> l&apos;assistant prépare, vous validez. Il ne
            s&apos;engage jamais à votre place.
          </p>
        </div>
        <p>
          Pour une PME de 1 à 20 personnes, la question se pose le soir, au bureau : les demandes
          reçues pendant la journée, les devis à relancer, les pièces à réclamer.
        </p>
      </Partie>

      <Partie id="taches" titre="Quelles tâches une PME peut-elle confier à un assistant IA ?">
        <p>Six tâches reviennent dans presque tous les métiers de services.</p>
        <Tableau legende="Les tâches courantes, avec un exemple par métier">
          <thead>
            <tr>
              <th scope="col">Tâche</th>
              <th scope="col">Ce que fait l&apos;assistant</th>
              <th scope="col">Exemple</th>
            </tr>
          </thead>
          <tbody>
            {TACHES.map((t) => {
              const metier = trouverMetier(t.metier);
              return (
                <tr key={t.tache}>
                  <th scope="row">{t.tache}</th>
                  <td>{t.fait}</td>
                  <td>
                    {metier ? (
                      <>
                        <a href={cheminMetier(t.metier)}>{metier.fr.nom}</a>
                        {" · "}
                        <a href={`/demonstrations#${t.metier}`}>voir l&apos;exemple</a>
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Tableau>
        <p>
          Chaque métier a ses mots et ses documents : le bon de régie chez le sanitaire, la pièce
          manquante chez la fiduciaire, l&apos;état des lieux chez le déménageur. C&apos;est pour
          cela que nous partons d&apos;une base par métier, réglée ensuite sur votre entreprise. Voir{" "}
          <a href={CHEMIN_METIERS}>l&apos;assistant, métier par métier</a>, et{" "}
          <a href="/demonstrations">deux exemples par métier, avec leur schéma</a>.
        </p>
      </Partie>

      <Partie id="limites" titre="Que ne doit pas faire une IA toute seule ?">
        <p>Tout ce qui engage votre entreprise passe par vous. Concrètement, l&apos;assistant ne doit jamais, seul :</p>
        <ul>
          <li>annoncer un prix ou envoyer un devis ;</li>
          <li>promettre une date ou confirmer un rendez-vous ;</li>
          <li>répondre sur le fond d&apos;une réclamation ;</li>
          <li>décider qu&apos;une demande n&apos;est pas urgente ;</li>
          <li>toucher à vos paiements ou à votre banque ;</li>
          <li>inventer une information qu&apos;il n&apos;a pas : s&apos;il ne sait pas, il demande.</li>
        </ul>
        <p>
          Une seule exception raisonnable : l&apos;accusé de réception. Vous le relisez et le validez
          une fois, puis il part seul à chaque nouvelle demande.
        </p>
      </Partie>

      <Partie id="etapes" titre="Comment ça se passe, étape par étape ?">
        <p>
          Voici comment nous travaillons. D&apos;autres prestataires commencent par un audit ; je
          préfère que vous voyiez l&apos;assistant tourner sur votre métier avant de signer quoi que ce
          soit.
        </p>
        <ol>
          <li>
            <strong>Un appel.</strong> Vous nous dites ce qui vous prend vos soirées. Nous vous disons
            si l&apos;assistant peut le reprendre.
          </li>
          <li>
            <strong>La démo sur votre métier.</strong> Vous voyez l&apos;assistant travailler sur des
            demandes types de votre métier. Rien à préparer, aucun accès à vos outils.
          </li>
          <li>
            <strong>Le palier, par écrit.</strong> À la fin de la démo, nous fixons ensemble les tâches
            et le palier d&apos;abonnement.
          </li>
          <li>
            <strong>Deux semaines d&apos;essai sur vos vraies demandes.</strong> L&apos;assistant
            prépare, vous validez.
          </li>
          <li>
            <strong>Un relevé chaque lundi.</strong> Ce qui a été traité, relancé, préparé, et ce qui
            vous attend.
          </li>
          <li>
            <strong>Vous décidez.</strong> Si le relevé vous convient, vous payez la mise en place et
            l&apos;abonnement continue, sans engagement, résiliable chaque mois.
          </li>
        </ol>
      </Partie>

      <Partie id="prix" titre="Combien coûte l'automatisation par l'IA pour une PME ?">
        <p>
          Sur le marché romand, le prix se compose presque toujours d&apos;une mise en place, payée une
          fois, et d&apos;un abonnement mensuel. Sur les pages publiques que nous avons relevées le{" "}
          {dateLisible(m.date)}, la mise en place va d&apos;environ {m.miseEnPlaceMin} à{" "}
          {m.miseEnPlaceMax} francs, et l&apos;abonnement d&apos;environ {m.mensuelMin} à {m.mensuelMax}{" "}
          francs par mois.
        </p>
        <p className="gd-note">
          Prix tels qu&apos;affichés par chaque prestataire, souvent hors taxe et souvent précédés de
          « dès ». Nous ne nommons personne : les prix changent, et ce guide n&apos;est pas un
          classement.
        </p>
        <p>{nosPrix}</p>
        <TableauNosPrix montant={montant} paliers={paliers} />
        <p>
          Le détail de ce qui fait le prix, et les pièges à éviter :{" "}
          <a href={cheminGuide("prix-assistant-ia-suisse")}>combien coûte un assistant IA en Suisse</a>.
        </p>
      </Partie>

      <Partie id="risques" titre="Quels sont les risques, et comment les limiter ?">
        <Tableau legende="Les risques et leurs parades">
          <thead>
            <tr>
              <th scope="col">Risque</th>
              <th scope="col">Comment le limiter</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">L&apos;IA se trompe ou invente</th>
              <td>Validation par vous de tout ce qui engage. Une consigne claire : s&apos;il ne sait pas, il demande.</td>
            </tr>
            <tr>
              <th scope="row">Les données partent n&apos;importe où</th>
              <td>
                Savoir où tournent le modèle et les données, et signer un contrat de sous-traitance.
                Voir <a href={cheminGuide("ia-et-protection-des-donnees")}>IA et protection des données</a>.
              </td>
            </tr>
            <tr>
              <th scope="row">Le client ne sait pas qu&apos;il parle à une IA</th>
              <td>Le dire simplement, par exemple dans l&apos;accusé de réception. Le{" "}
                <a href="https://www.edoeb.admin.ch/fr/ia-et-protection-des-donnees" target="_blank" rel="noopener">
                  PFPDT
                </a>{" "}
                le demande.
              </td>
            </tr>
            <tr>
              <th scope="row">Vous dépendez du prestataire</th>
              <td>Un abonnement résiliable, et le droit écrit de récupérer vos données et vos réglages.</td>
            </tr>
            <tr>
              <th scope="row">Le prix dérape</th>
              <td>Un prix écrit avant de signer, un volume par palier, et le coût de l&apos;IA compris.</td>
            </tr>
            <tr>
              <th scope="row">Plus personne ne regarde l&apos;outil</th>
              <td>Un relevé régulier de ce qui a été fait, et quelqu&apos;un qui le suit.</td>
            </tr>
          </tbody>
        </Tableau>
      </Partie>

      <Partie id="choisir" titre="Comment choisir un prestataire d'IA pour sa PME ?">
        <p>Avant de signer, vérifiez ces dix points. Un bon prestataire y répond par écrit.</p>
        <ol>
          <li>Le prix est-il écrit avant la démo, mise en place et abonnement ?</li>
          <li>Puis-je voir l&apos;assistant sur des demandes de mon métier avant de signer ?</li>
          <li>Puis-je l&apos;essayer sur mes vraies demandes avant de payer la mise en place ?</li>
          <li>Qu&apos;est-ce qui part sans ma validation ? La réponse devrait tenir en une ligne.</li>
          <li>Où sont hébergées les données, et où tourne le modèle d&apos;IA ?</li>
          <li>Y a-t-il un contrat de sous-traitance (art. 9 nLPD) ?</li>
          <li>Quelle est la durée d&apos;engagement, et comment résilier ?</li>
          <li>Que vais-je récupérer si je pars, ou si le prestataire arrête ?</li>
          <li>Le coût de l&apos;IA est-il compris, ou facturé en plus ?</li>
          <li>Qui me suit, et à quelle fréquence vois-je ce qui a été fait ?</li>
        </ol>
      </Partie>

      <Partie id="etudes" titre="Ce que mesurent les études">
        <p>
          Aucun de ces chiffres n&apos;est un résultat de Nawa Corps. Ce sont des études publiées, avec
          leur source.
        </p>
        <ul>
          {chiffres.map((c) => (
            <li key={c.source}>
              <span>
                <strong>{c.valeur}</strong> {c.texte}{" "}
                <a href={c.url} target="_blank" rel="noopener">
                  {c.source}
                </a>{" "}
                ({c.perimetre}).
              </span>
            </li>
          ))}
        </ul>
      </Partie>
    </GuidePage>
  );
}
