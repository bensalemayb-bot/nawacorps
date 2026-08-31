import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import OuvrirDevis from "@/components/OuvrirDevis";
import SchemaPage from "@/components/SchemaPage";
import { chargerCatalogue } from "@/lib/catalogue";
import { resoudreDevis } from "@/lib/devis";
import {
  MENTION_DEVIS_COURTE,
  MENTION_REPONSE,
  MENTION_TVA,
} from "@/lib/familles";
import { TVA_LABEL, formatServicePrice, isQuote } from "@/lib/format";
import { CONTACT, SITE_NAME, openGraphPage } from "@/lib/site";

/**
 * /devis — LE PARCOURS DE DEVIS, QUI N'EXISTAIT PAS.
 *
 * CE QUI SE PASSAIT AVANT. Huit boutons « Demander un devis » etaient repartis
 * sur le site. Chacun etait un lien WhatsApp dont le clic etait INTERCEPTE en
 * JavaScript pour ouvrir la bulle de chat, en lui passant un `sujet`
 * (« devis-le-site », « devis-imprimes »…) que le widget n'a jamais lu — son
 * propre commentaire l'avouait. Trois consequences, toutes payantes :
 *  1. le visiteur cliquait « Le Site » et l'assistant lui demandait ce qu'il
 *     cherchait, comme s'il venait d'arriver ;
 *  2. la demande atterrissait chez Ayoub sans dire sur quoi elle portait, et il
 *     fallait rappeler pour le savoir ;
 *  3. sans JavaScript, le bouton partait sur WhatsApp — c'est-a-dire hors du
 *     site, dans une application que tout le monde n'a pas.
 *
 * CE QUE CETTE PAGE FAIT. Elle est l'arrivee unique de ces huit boutons, qui
 * sont redevenus de vrais liens (`/devis?p=<slug ou sujet>`). Elle lit ce que
 * le visiteur a clique, nomme la prestation avec le nom et le prix LUS EN BASE,
 * ouvre l'assistant deja renseigne, et garde le formulaire juste en dessous.
 *
 * DEUX CHEMINS, ET C'EST VOULU. Le proprietaire a choisi le chatbot comme
 * chemin principal : il qualifie mieux qu'un formulaire, et il ecrit un resume
 * exploitable. Mais il depend d'un modele distant, et le fournisseur retenu
 * plafonne autour de six requetes par minute (lib/llm.ts) : un jour de pointe,
 * ou une panne, et l'assistant repond « indisponible ». Le formulaire est donc
 * rendu COTE SERVEUR, toujours, sous l'assistant — il n'attend ni JavaScript ni
 * modele, et il attrape le lead que l'assistant aurait laisse tomber. Il porte
 * le meme sujet en champ cache : quel que soit le chemin, la demande arrive
 * nommee.
 *
 * `?p` NE PEUT PAS FAIRE ECHOUER LA PAGE. Absent, inconnu, en double, trop
 * long : lib/devis.ts rend une demande sans prestation nommee et la page
 * s'ouvre quand meme. Un 404 sur un parcours de devis est une demande perdue.
 *
 * AUCUN MONTANT N'EST ECRIT ICI, et la mention de TVA suit le montant dans la
 * MEME unite de lecture — c'est la regle du depot, et elle vaut par bloc, pas
 * par page. Une prestation « sur devis » n'affiche aucun chiffre : elle affiche
 * la raison du devis, reprise telle quelle de lib/familles.ts.
 *
 * ZERO CSS NOUVEAU : .wrap, .sec-head, .meta, .index, h1.t / h2.t, .lede,
 * .facts, .studio-txt, .prest-inc, .c-row, .btn, .lnk.
 *
 * PAS DE next/link : Interactions.tsx ne s'initialise qu'une fois, une
 * navigation client-side laisserait les [data-reveal] de la page d'arrivee a
 * opacity:0 (decision B7).
 */

const TITRE = "Demander un devis";
const DESCRIPTION =
  "Décrivez votre besoin à l'assistant, ou remplissez le formulaire : les deux arrivent au même endroit, chez Ayoub, à Genève. Réponse le jour ouvrable suivant.";

/**
 * La canonique est `/devis` NU, sans le `?p=`.
 *
 * Douze CTA menent ici avec douze parametres differents : autant d'URL pour une
 * seule page, et c'est exactement ce que la canonique existe pour dissoudre. Le
 * `twitter` est redeclare EN ENTIER pour la meme raison que partout ailleurs —
 * la fusion des metadata de Next ne descend pas dans les objets, et un bloc
 * partiel ferait porter a cette page le titre de l'accueil.
 */
export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
  alternates: { canonical: "/devis" },
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
 * Le lire opte cette page dans le rendu DYNAMIQUE, ce qui est ici la bonne
 * reponse : la page depend de la requete, et elle lit Postgres pour resoudre un
 * prix. Un prix perime a l'ecran coute plus cher qu'un rendu statique gagne —
 * meme arbitrage qu'en tete de lib/catalogue.ts.
 */
export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>;
}) {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  const { p } = await searchParams;

  // Le catalogue ENTIER, et non une requete ciblee : lib/catalogue.ts memoise
  // la lecture par requete, et `p` peut designer n'importe laquelle des
  // dix-huit lignes comme aucune.
  const catalogue = await chargerCatalogue();
  const demande = resoudreDevis(p, catalogue);

  const service = demande.service;
  const surDevis = service !== null && isQuote(service);

  return (
    <>
      <SchemaPage
        fil={[
          { nom: "Accueil", chemin: "/" },
          { nom: "Demander un devis", chemin: "/devis" },
        ]}
      />

      {/* L'assistant s'ouvre au montage, deja renseigne. Il ne rend rien :
          voir components/OuvrirDevis.tsx. */}
      <OuvrirDevis
        sujet={demande.sujet ?? undefined}
        libelle={demande.libelle ?? undefined}
      />

      {/* ---------- Ce sur quoi porte la demande ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              Devis
            </span>
            {/* Interactions.tsx decoupe h1.t sur ses <br> et lui pose lui-meme
                son [data-reveal] : ne pas en ecrire un a la main. */}
            <h1 className="t">
              Dites ce qu&apos;il
              <br />
              vous faut.
            </h1>
          </div>

          <p className="lede" data-reveal>
            {demande.libelle
              ? `Votre demande porte sur « ${demande.libelle} ». L'assistant s'ouvre avec cette information : il vous pose les questions qui manquent, et rien d'autre.`
              : "L'assistant s'ouvre en bas de l'écran : décrivez votre besoin en deux ou trois phrases, il pose les questions qui manquent. Si vous préférez écrire d'un coup, le formulaire est juste en dessous."}
          </p>

          {/* LE NOM ET LE PRIX VIENNENT DE POSTGRES, jamais de cette page. La
              mention de TVA est la LEGENDE du montant, dans la meme unite de
              lecture : c'est la regle du depot, et elle ne se delegue pas a une
              note de bas de page. Sous « sur devis », elle ne voudrait rien
              dire — la cellule n'est alors pas rendue du tout. */}
          {service ? (
            <div className="facts" data-reveal>
              <div>
                <b>{service.name}</b>
                <span>Votre demande</span>
              </div>
              {surDevis ? null : (
                <div>
                  <b>{formatServicePrice(service)}</b>
                  <span>{TVA_LABEL}</span>
                </div>
              )}
              <div>
                {/* La localite vient de lib/site.ts : le NAP ne se recopie
                    nulle part, sinon deux graphies finissent par cohabiter. */}
                <b>{CONTACT.ville}</b>
                <span>Et sa région</span>
              </div>
            </div>
          ) : demande.libelle ? (
            <div className="facts" data-reveal>
              <div>
                <b>{demande.libelle}</b>
                <span>Votre demande</span>
              </div>
              <div>
                {/* La localite vient de lib/site.ts : le NAP ne se recopie
                    nulle part, sinon deux graphies finissent par cohabiter. */}
                <b>{CONTACT.ville}</b>
                <span>Et sa région</span>
              </div>
            </div>
          ) : null}

          {/* POURQUOI CETTE LIGNE N'A PAS DE PRIX. La phrase est celle de
              lib/familles.ts, reprise telle quelle : deux formulations du meme
              argument divergeraient a la premiere correction. */}
          {surDevis ? (
            <p className="meta" data-reveal style={{ marginTop: 22, maxWidth: "62ch" }}>
              {MENTION_DEVIS_COURTE}
            </p>
          ) : null}
          {service && !surDevis ? (
            <p className="meta" data-reveal style={{ marginTop: 22 }}>
              {MENTION_TVA}
            </p>
          ) : null}
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
                Quatre lignes, et
                <br />
                je peux déjà chiffrer.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              Vous n&apos;avez rien à préparer : je reprends ce qui est déjà en
              ligne. Ces quatre éléments-là, donnés tout de suite, évitent
              seulement que la première réponse soit une question de plus.
            </p>
          </div>

          <ul className="prest-inc" data-reveal style={{ marginTop: 26 }}>
            <li>
              L&apos;adresse de votre site actuel, s&apos;il y en a un.
              C&apos;est de là que je reprends vos textes.
            </li>
            <li>
              Votre métier et la zone que vous couvrez : un garage et une
              fiduciaire n&apos;ont pas les mêmes pages.
            </li>
            <li>
              Ce que vous voulez recevoir : des devis, des rendez-vous, des
              appels.
            </li>
            <li>Votre échéance, si vous en avez une.</li>
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
              L'amorce est celle du bouton d'ou vient le visiteur — elle dit
              deja de quoi il vient parler (lib/devis.ts). */}
          <div className="c-row" data-reveal>
            <a className="btn btn-line" href={demande.amorce} target="_blank" rel="noopener">
              Écrire sur WhatsApp
            </a>
            <a className="btn btn-line" href="/services">
              Voir tous les services
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
