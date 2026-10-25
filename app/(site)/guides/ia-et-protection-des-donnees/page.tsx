import type { Metadata } from "next";
import type { ReactNode } from "react";
import GuidePage, { Partie, Tableau, metadataGuide } from "@/components/Guide";
import { cheminGuide } from "@/lib/guides";

/**
 * /guides/ia-et-protection-des-donnees — IA ET nLPD POUR UNE PME SUISSE.
 *
 * Qui est responsable, qui est sous-traitant (art. 9), les transferts a
 * l etranger (art. 16-17), l information des clients (art. 19 et la position
 * du PFPDT sur l IA), les violations (art. 24), puis les huit questions a
 * poser a un prestataire et NOS REPONSES.
 *
 * NOS REPONSES SONT CELLES DES DOCUMENTS REMIS AU CLIENT, mot pour mot sur le
 * fond : docs/clients/1-vos-donnees-en-une-page.md, 2-contrat-de-sous-
 * traitance.md, 3-garantie-de-continuite.md. Un engagement change la-bas, il
 * change ici le meme jour.
 *
 * DEUX REGLES D AYOUB : jamais « conforme nLPD » comme garantie (la
 * conformite attend un avis juridique et depend aussi du client), et
 * L HEBERGEUR N EST PAS NOMME — « hébergées en Suisse ». La promesse vaut pour
 * l assistant livre au client, jamais pour le site ni pour Leo, et la page le
 * dit (.agents/product-marketing.md §1).
 *
 * SOURCES OFFICIELLES, verifiees le 25.10.2026 : le texte de la LPD sur
 * fedlex.admin.ch (RS 235.1, RO 2022 491) et la page « IA et protection des
 * données » du PFPDT (edoeb.admin.ch).
 */

const SLUG = "ia-et-protection-des-donnees";

export const metadata: Metadata = metadataGuide(SLUG);

/** La LPD sur Fedlex (RS 235.1). */
const LPD = "https://www.fedlex.admin.ch/eli/cc/2022/491/fr";
/** Le PFPDT, sa page sur l IA. */
const PFPDT_IA = "https://www.edoeb.admin.ch/fr/ia-et-protection-des-donnees";
const PFPDT = "https://www.edoeb.admin.ch/fr";

/** Un lien vers un article de la LPD. */
function Art({ n, children }: { n: number; children?: ReactNode }) {
  return (
    <a href={`${LPD}#art_${n}`} target="_blank" rel="noopener">
      {children ?? `art. ${n} LPD`}
    </a>
  );
}

const SOMMAIRE = [
  { id: "loi", titre: "Quelle loi s'applique à l'IA en Suisse ?" },
  { id: "responsable", titre: "Qui est responsable : vous ou le prestataire ?" },
  { id: "etranger", titre: "Vos données peuvent-elles partir à l'étranger ?" },
  { id: "informer", titre: "Faut-il prévenir vos clients ?" },
  { id: "fuite", titre: "Que se passe-t-il en cas de fuite ?" },
  { id: "huit-questions", titre: "Les 8 questions à poser à un prestataire" },
  { id: "sources", titre: "Les sources officielles" },
] as const;

/** Les huit questions, avec nos reponses (docs/clients/*.md). */
const HUIT = [
  {
    q: "Où tournent le modèle d'IA et les données ?",
    pourquoi: "Beaucoup d'outils d'IA envoient les messages à l'étranger, souvent aux États-Unis.",
    nous: "Les données de votre assistant sont hébergées en Suisse, et le modèle d'IA qui les lit y tourne aussi.",
  },
  {
    q: "Le modèle s'entraîne-t-il sur mes données ?",
    pourquoi: "Un modèle entraîné sur vos messages peut en restituer des morceaux ailleurs.",
    nous: "Non. Vos données servent à la tâche convenue, jamais à entraîner un modèle d'IA.",
  },
  {
    q: "Qui peut voir mes données ?",
    pourquoi: "Moins de personnes y ont accès, moins il y a de risques.",
    nous: "Vous, les personnes que vous désignez, et Ayoub Bensalem pour régler l'assistant et préparer le relevé. Le développeur ne travaille jamais sur vos données réelles sans votre accord écrit.",
  },
  {
    q: "Y a-t-il un contrat de sous-traitance ?",
    pourquoi: "L'art. 9 LPD demande que la sous-traitance soit fixée par contrat.",
    nous: "Oui, signé avant l'essai.",
  },
  {
    q: "Combien de temps sont-elles gardées, et comment sont-elles supprimées ?",
    pourquoi: "Une donnée gardée sans raison est une donnée de trop.",
    nous: "Le temps de la tâche (une demande traitée est archivée 12 mois pour le relevé, puis effacée). À la fin du contrat, nous vous rendons tout, puis nous effaçons tout dans les 30 jours et vous le confirmons par écrit.",
  },
  {
    q: "En cas de fuite, sous combien de temps suis-je prévenu ?",
    pourquoi: "C'est vous qui devez, le cas échéant, l'annoncer au PFPDT (art. 24 LPD).",
    nous: "Sous 24 heures, avec ce qui s'est passé et ce que nous faisons.",
  },
  {
    q: "Qui sont vos propres sous-traitants ?",
    pourquoi: "Vos données vont aussi chez eux : hébergeur, fournisseur du modèle.",
    nous: "Ils sont listés dans le contrat. Tout nouveau sous-traitant vous est annoncé 30 jours avant ; vous pouvez vous y opposer et résilier sans frais.",
  },
  {
    q: "Que se passe-t-il si le prestataire arrête ?",
    pourquoi: "Un assistant qui s'éteint du jour au lendemain laisse vos demandes sans réponse.",
    nous: "Préavis de 60 jours, l'assistant tourne pendant ce temps, et vous recevez votre dossier complet (données et réglages en clair, avec une notice pour un autre prestataire). C'est notre garantie de continuité, écrite dans le contrat.",
  },
] as const;

export default function GuideDonnees() {
  const questions = [
    {
      q: "La loi suisse sur la protection des données s'applique-t-elle à l'IA ?",
      r: "Oui. Le Préposé fédéral à la protection des données et à la transparence (PFPDT) rappelle que la loi fédérale sur la protection des données (LPD, en vigueur depuis le 1er septembre 2023) vaut pour toutes les technologies, IA comprise.",
    },
    {
      q: "Qui est responsable des données quand j'utilise un assistant IA ?",
      r: "Vous, en tant que patron de l'entreprise qui traite les données de ses clients. Le prestataire qui fait tourner l'assistant agit comme sous-traitant (art. 9 LPD), uniquement selon vos instructions et sur la base d'un contrat.",
    },
    {
      q: "Mes clients doivent-ils savoir qu'ils parlent à une IA ?",
      r: "Oui. Selon le PFPDT, une personne qui échange avec un système d'IA doit savoir qu'elle parle à une machine. Une phrase dans l'accusé de réception et une mise à jour de votre déclaration de confidentialité suffisent souvent.",
    },
    {
      q: "Un assistant IA hébergé aux États-Unis est-il interdit ?",
      r: "Pas forcément, mais la communication de données à l'étranger est encadrée (art. 16 et 17 LPD) : il faut un pays reconnu comme offrant une protection adéquate, ou des garanties comme des clauses contractuelles types. Un hébergement en Suisse évite la question.",
    },
    {
      q: "Que dois-je faire en cas de fuite de données ?",
      r: "Si la fuite entraîne vraisemblablement un risque élevé pour les personnes concernées, l'annoncer au PFPDT dans les meilleurs délais (art. 24 LPD). Votre sous-traitant doit vous prévenir dans les meilleurs délais ; chez Nawa Corps, c'est sous 24 heures.",
    },
    {
      q: "Nawa Corps est-elle conforme à la nLPD ?",
      r: "Nous ne l'écrivons pas comme une garantie : la conformité dépend aussi de ce que fait l'entreprise cliente. Nous prenons des engagements écrits : données de l'assistant hébergées en Suisse, pas d'entraînement sur vos données, contrat de sous-traitance, alerte sous 24 heures, effacement sous 30 jours, garantie de continuité.",
    },
    {
      q: "Les échanges avec Leo, l'assistant du site, sont-ils hébergés en Suisse ?",
      r: "Non. L'engagement d'hébergement en Suisse vaut pour l'assistant que nous installons chez vous, pas pour Leo, dont les échanges passent par un fournisseur d'IA hors de Suisse. Le détail est dans notre page de confidentialité.",
    },
  ];

  return (
    <GuidePage
      slug={SLUG}
      h1={["IA et protection", "des données :", "ce que dit la nLPD"]}
      reponse="Quand une PME suisse utilise un assistant IA, elle reste responsable des données de ses clients ; le prestataire est son sous-traitant (art. 9 LPD), lié par un contrat. Avant de signer, demandez où tournent le modèle et les données, s'il apprend sur vos messages, qui y accède et ce qui se passe à la fin."
      sommaire={SOMMAIRE}
      questions={questions}
      lies={["automatisation-ia-pme-geneve", "prix-assistant-ia-suisse", "assistant-ia-ou-secretaire"]}
    >
      <Partie id="loi" titre="Quelle loi s'applique à l'IA en Suisse ?">
        <p>
          La{" "}
          <a href={LPD} target="_blank" rel="noopener">
            loi fédérale sur la protection des données
          </a>{" "}
          (LPD, RS 235.1), souvent appelée « nLPD » parce qu&apos;elle a été révisée. Elle est en vigueur
          depuis le 1er septembre 2023.
        </p>
        <p>
          Il n&apos;existe pas, en Suisse, de loi à part pour l&apos;IA dans une PME. Le{" "}
          <a href={PFPDT_IA} target="_blank" rel="noopener">
            Préposé fédéral à la protection des données (PFPDT)
          </a>{" "}
          le rappelle : la LPD vaut pour toutes les technologies, IA comprise.
        </p>
        <p className="gd-note">
          Ce guide explique les grandes lignes pour un patron de PME. Ce n&apos;est pas un avis
          juridique : pour un cas précis, demandez à un juriste.
        </p>
      </Partie>

      <Partie id="responsable" titre="Qui est responsable : vous ou le prestataire ?">
        <p>
          Vous décidez pourquoi et comment les données de vos clients sont traitées : vous êtes le{" "}
          <strong>responsable du traitement</strong>. Le prestataire qui fait tourner l&apos;assistant
          traite ces données pour vous : il est votre <strong>sous-traitant</strong> (<Art n={9} />).
        </p>
        <Tableau legende="Les rôles, en clair">
          <thead>
            <tr>
              <th scope="col">Rôle</th>
              <th scope="col">Qui</th>
              <th scope="col">Ce que ça implique</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Responsable du traitement</th>
              <td>Vous, le patron</td>
              <td>Vous répondez des données de vos clients, et vous choisissez un sous-traitant sérieux.</td>
            </tr>
            <tr>
              <th scope="row">Sous-traitant</th>
              <td>Le prestataire de l&apos;assistant</td>
              <td>
                Il ne traite les données que selon vos instructions, par contrat, et garantit leur
                sécurité (<Art n={9} />).
              </td>
            </tr>
            <tr>
              <th scope="row">Sous-traitants ultérieurs</th>
              <td>L&apos;hébergeur, le fournisseur du modèle</td>
              <td>Le prestataire ne peut y recourir qu&apos;avec votre autorisation préalable (<Art n={9} />).</td>
            </tr>
          </tbody>
        </Tableau>
      </Partie>

      <Partie id="etranger" titre="Vos données peuvent-elles partir à l'étranger ?">
        <p>
          Oui, mais pas n&apos;importe comment. Une communication de données à l&apos;étranger est
          permise vers un pays dont le Conseil fédéral a reconnu la protection comme adéquate. Sinon, il
          faut des garanties, par exemple des clauses contractuelles types (<Art n={16} />). Quelques
          exceptions existent, comme le consentement exprès de la personne (<Art n={17} />).
        </p>
        <p>
          En pratique : beaucoup d&apos;outils d&apos;IA grand public envoient les messages vers des
          serveurs aux États-Unis. Demandez où tourne le modèle, pas seulement où sont stockées les
          données. « Suisse ou Union européenne » n&apos;est pas la même chose que « Suisse ».
        </p>
      </Partie>

      <Partie id="informer" titre="Faut-il prévenir vos clients ?">
        <p>
          Oui. Quand vous collectez des données, vous informez les personnes de qui les traite, pourquoi,
          et à qui elles sont communiquées, y compris à l&apos;étranger (<Art n={19} />).
        </p>
        <p>
          Pour l&apos;IA, le{" "}
          <a href={PFPDT_IA} target="_blank" rel="noopener">
            PFPDT
          </a>{" "}
          ajoute un point simple : une personne qui échange avec un système d&apos;IA doit savoir
          qu&apos;elle parle à une machine, et si ses messages servent à autre chose.
        </p>
        <ul>
          <li>Une phrase dans l&apos;accusé de réception : « Message préparé avec l&apos;aide d&apos;un assistant. »</li>
          <li>Une ligne dans votre déclaration de confidentialité : l&apos;assistant, son sous-traitant, le pays d&apos;hébergement.</li>
          <li>Une personne à qui s&apos;adresser : vous.</li>
        </ul>
      </Partie>

      <Partie id="fuite" titre="Que se passe-t-il en cas de fuite de données ?">
        <p>
          Si une violation de la sécurité des données entraîne vraisemblablement un risque élevé pour les
          personnes concernées, le responsable l&apos;annonce au PFPDT dans les meilleurs délais. Le
          sous-traitant, lui, doit prévenir le responsable dans les meilleurs délais (<Art n={24} />).
        </p>
        <p>
          D&apos;où l&apos;importance d&apos;un délai écrit dans le contrat : sans lui, vous risquez
          d&apos;apprendre la fuite trop tard pour réagir.
        </p>
      </Partie>

      <Partie id="huit-questions" titre="Les 8 questions à poser à un prestataire d'IA">
        <p>
          Posez-les par écrit, et demandez des réponses par écrit. À droite, ce que nous répondons, tel
          que c&apos;est écrit dans les documents remis avant l&apos;essai.
        </p>
        <Tableau legende="Huit questions, et nos réponses">
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">Pourquoi la poser</th>
              <th scope="col">Ce que répond Nawa Corps</th>
            </tr>
          </thead>
          <tbody>
            {HUIT.map((h, i) => (
              <tr key={h.q}>
                <th scope="row">{`${i + 1}. ${h.q}`}</th>
                <td>{h.pourquoi}</td>
                <td>{h.nous}</td>
              </tr>
            ))}
          </tbody>
        </Tableau>
        <div className="gd-encadre">
          <p>
            <strong>Ce que nous ne promettons pas :</strong> une conformité garantie. Elle dépend
            aussi de ce que fait votre entreprise. Nous prenons des engagements écrits, et nous les
            signons.
          </p>
        </div>
        <p className="gd-note">
          Ces engagements valent pour l&apos;assistant que nous installons chez vous. Ils ne valent pas
          pour Leo, l&apos;assistant de conversation de ce site : voir notre{" "}
          <a href="/confidentialite">page de confidentialité</a>.
        </p>
      </Partie>

      <Partie id="sources" titre="Les sources officielles">
        <ul>
          <li>
            <span>
              <a href={LPD} target="_blank" rel="noopener">
                Loi fédérale sur la protection des données (LPD), RS 235.1
              </a>{" "}
              — fedlex.admin.ch, texte officiel.
            </span>
          </li>
          <li>
            <span>
              <a href={PFPDT_IA} target="_blank" rel="noopener">
                IA et protection des données
              </a>{" "}
              — Préposé fédéral à la protection des données et à la transparence.
            </span>
          </li>
          <li>
            <span>
              <a href={PFPDT} target="_blank" rel="noopener">
                Site du PFPDT
              </a>{" "}
              — guides, annonce des violations de la sécurité des données.
            </span>
          </li>
        </ul>
        <p>
          Pour la suite :{" "}
          <a href={cheminGuide("automatisation-ia-pme-geneve")}>
            l&apos;automatisation par l&apos;IA dans une PME genevoise
          </a>{" "}
          et <a href={cheminGuide("prix-assistant-ia-suisse")}>combien coûte un assistant IA</a>.
        </p>
      </Partie>
    </GuidePage>
  );
}
