import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import OuvrirDevis from "@/components/OuvrirDevis";
import SchemaPage from "@/components/SchemaPage";
import { resoudreDevis } from "@/lib/devis";
import { MENTION_REPONSE } from "@/lib/mentions";
import { CONTACT, SITE_NAME, alternatesPage, openGraphPage } from "@/lib/site";

/**
 * /devis — LA DEMANDE DE DEMO (24.10.2026, docs/agents/copy/devis.md).
 *
 * L URL ne change pas : c est l arrivee des boutons « Le voir sur mon
 * metier » du site. La page ne nomme plus aucune prestation ni aucun prix ;
 * elle demande une seule chose, la demo de l assistant sur des demandes du
 * metier du visiteur, sans rien a preparer.
 *
 * DEUX CHEMINS, ET C EST VOULU. L assistant du site (Leo) s ouvre au montage
 * (components/OuvrirDevis.tsx) et pose les questions qui manquent. Mais il
 * depend d un modele distant plafonne a quelques requetes par minute
 * (lib/llm.ts) : le formulaire est donc rendu COTE SERVEUR juste en dessous,
 * sans attendre ni JavaScript ni modele. Les deux portent le meme sujet (`?p=`,
 * resolu par lib/devis.ts) : la demande arrive nommee par l un ou l autre.
 *
 * `?p` NE PEUT PAS FAIRE ECHOUER LA PAGE : absent, ancien ou inconnu, il
 * retombe sur la demande generale.
 *
 * ZERO CSS NOUVEAU. PAS DE next/link : Interactions.tsx ne s initialise qu une
 * fois, une navigation client-side laisserait les [data-reveal] de la page
 * d arrivee a opacity:0 (decision B7).
 */

/**
 * TITRE ET DESCRIPTION DE L AUDIT CRO/SEO DU 25.10.2026 (§4.4,
 * docs/agents/reviews/audit-cro-seo-2026-10-25.md). Le titre est
 * `absolute` : il tient ses 60 signes sans le suffixe « — Nawa Corps » du
 * `template`, qui l aurait fait deborder (ou, pour /contact, aurait ecrit la
 * marque deux fois).
 */
const TITRE = "Démo gratuite de l'assistant IA sur votre métier · Genève";
const DESCRIPTION =
  "Nous vous montrons l'assistant sur des demandes de votre métier. Rien à préparer, rien à payer, aucun accès à vos outils. Réponse le jour ouvrable suivant.";

/**
 * La canonique est `/devis` NU, sans le `?p=`.
 *
 * Plusieurs boutons menent ici avec des parametres differents : autant d'URL
 * pour une seule page, et c'est ce que la canonique existe pour dissoudre. Le
 * `twitter` est redeclare EN ENTIER pour la meme raison que partout ailleurs —
 * la fusion des metadata de Next ne descend pas dans les objets, et un bloc
 * partiel ferait porter a cette page le titre de l'accueil.
 *
 * `alternates` PASSE PAR `alternatesPage` DEPUIS QUE LA JUMELLE ANGLAISE
 * EXISTE. La canonique ne bouge pas ; la fonction AJOUTE les `hreflang`, et
 * LES DEUX SENS SONT OBLIGATOIRES — une page anglaise qui declare sa jumelle
 * francaise sans que celle-ci lui rende la pareille voit son groupe ignore par
 * Google, et les deux versions se remettent a se concurrencer. `en-CH` n est
 * emis que si ce chemin figure dans `CHEMINS_TRADUITS` (lib/i18n.ts) :
 * annoncer une jumelle qui repond 404 est pire que de ne rien annoncer.
 */
export const metadata: Metadata = {
  title: { absolute: TITRE },
  description: DESCRIPTION,
  alternates: alternatesPage("/devis"),
  openGraph: openGraphPage({
    titre: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    chemin: "/devis",
  }),
  twitter: {
    card: "summary_large_image",
    title: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

/**
 * `searchParams` EST UNE PROMESSE depuis Next 15, et il faut l'attendre — voir
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md.
 * Le type est ecrit a la main plutot que via le helper global `PageProps<…>` :
 * celui-ci est genere a partir des routes connues du dernier build, et une
 * route qui vient d'etre creee n'y figure pas encore — `npm run typecheck`
 * echouerait sur une page pourtant correcte.
 *
 * Le lire opte cette page dans le rendu DYNAMIQUE : elle depend de la requete
 * (le sujet transmis a l'assistant et au formulaire).
 */
export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>;
}) {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  const { p } = await searchParams;
  const demande = resoudreDevis(p);

  return (
    <>
      <SchemaPage
        fil={[
          { nom: "Accueil", chemin: "/" },
          { nom: "Demander une démo", chemin: "/devis" },
        ]}
      />

      {/* L'assistant s'ouvre au montage, deja renseigne. Il ne rend rien :
          voir components/OuvrirDevis.tsx. */}
      <OuvrirDevis
        sujet={demande.sujet ?? undefined}
        libelle={demande.libelle ?? undefined}
      />

      {/* ---------- La demande de demo ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              La démo
            </span>
            {/* Interactions.tsx decoupe h1.t sur ses <br> et lui pose lui-meme
                son [data-reveal] : ne pas en ecrire un a la main. */}
            <h1 className="t">
              Voyez-le
              <br />
              sur votre métier.
            </h1>
          </div>

          <p className="lede" data-reveal>
            {demande.libelle
              ? `Vous venez pour « ${demande.libelle} ». Leo le sait déjà : il ne vous pose que les questions qui manquent.`
              : "Leo, l'assistant de ce site, s'ouvre en bas de l'écran. Dites-lui votre métier : il pose les questions qui manquent. Si vous préférez écrire d'un coup, le formulaire est juste en dessous."}
          </p>

          {/* Deux faits qui levent l'objection du prix et celle des donnees au
              moment de la demande. Aucun montant ici : la demo ne coute rien. */}
          <div className="facts" data-reveal>
            <div>
              <b>Rien</b>
              <span>Ce que coûte la démo</span>
            </div>
            <div>
              <b>Aucun</b>
              <span>Accès à vos outils</span>
            </div>
            <div>
              {/* La localite vient de lib/site.ts : le NAP ne se recopie
                  nulle part, sinon deux graphies finissent par cohabiter. */}
              <b>{CONTACT.ville}</b>
              <span>Et sa région</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Ce qu'il est utile de dire, puis le formulaire ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; Votre message
            </span>
            <div data-reveal>
              <h2 className="t">
                Votre métier,
                <br />
                rien à préparer.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              Vous n&apos;avez rien à nous envoyer. Nous vous montrons
              l&apos;assistant sur des demandes de votre métier, et nous
              n&apos;avons accès à aucun de vos outils. Dites-nous seulement :
            </p>
          </div>

          <ul className="prest-inc" data-reveal style={{ marginTop: 26 }}>
            <li>Votre métier.</li>
            <li>Comment arrivent vos demandes aujourd&apos;hui.</li>
            <li>Le meilleur moment pour vous rappeler.</li>
          </ul>

          {/* LE FORMULAIRE EST LE FILET DE L'ASSISTANT, ET IL EST RENDU COTE
              SERVEUR. L'assistant est le chemin choisi, mais il depend d'un
              modele distant plafonne a quelques requetes par minute
              (lib/llm.ts) : le jour ou il repond « indisponible », c'est ce
              formulaire qui attrape la demande. Il part avec le meme sujet en
              champ cache — la demande arrive nommee par les deux chemins. */}
          {/* L ANCRE `#formulaire` EST LUE PAR L ASSISTANT. Quand il tombe, son
              message de repli renvoie ici plutot que sur le formulaire du pied
              de page de l accueil — voir components/ChatWidget.tsx : renvoyer
              vers l accueil ferait perdre au visiteur sa place ET le sujet de sa
              demande. Ne pas la renommer sans corriger le widget. */}
          <div id="formulaire" data-reveal>
            <p className="meta" style={{ marginTop: 40 }}>
              {MENTION_REPONSE}
            </p>
            <ContactForm subject={demande.sujet ?? undefined} />
          </div>

          {/* Le troisieme chemin, pour qui ne veut ni bulle ni formulaire.
              L'amorce demande deja la demo (lib/devis.ts). */}
          <div className="c-row" data-reveal>
            <a className="btn btn-line" href={demande.amorce} target="_blank" rel="noopener">
              Écrire sur WhatsApp
            </a>
            <a className="btn btn-line" href="/services">
              Voir l&apos;assistant en détail
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
