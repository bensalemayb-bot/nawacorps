import type { Metadata } from "next";
import BoutonDevis from "@/components/BoutonDevis";
import FooterContact from "@/components/FooterContact";
import {
  SITE_NAME,
  SITE_URL,
  jsonLd,
  openGraphPage,
  whatsapp,
} from "@/lib/site";

/**
 * /studio — QUI EST LE STUDIO.
 *
 * POURQUOI CETTE PAGE EXISTE. Tout ce que le site disait du studio tenait dans
 * la section (04) de l accueil (components/Studio.tsx) : trois paragraphes et
 * trois chiffres. C est court pour une decision d achat prise par un dirigeant
 * qui ne connait ni le nom ni le visage d en face. Cette page repond aux cinq
 * questions qu il se pose avant d engager : qui fait le travail, comment ca se
 * passe, ce que le studio sait faire, ce qu il refuse, et ce qu il peut
 * prouver.
 *
 * ELLE NE REPETE PAS LA SECTION DE L ACCUEIL. Studio.tsx dit QUI, en trois
 * phrases ; cette page dit COMMENT, en six moments, et surtout CE QUE LE
 * STUDIO NE FAIT PAS — l anti-ICP du positionnement §2, qu aucune page ne
 * portait encore.
 *
 * LA PREUVE, ET SON ABSENCE. Le studio a un client et aucune reference de
 * site : rien n est donc affirme ici qui ne soit verifiable, et AUCUNE
 * reference, AUCUN avis, AUCUN compteur d usage n est invente — LCD art. 3,
 * et le depot s est deja fait rattraper une fois sur ce point precis. Ce qui
 * remplace la preuve sociale est la section (05) : l assistant vendu au
 * troisieme palier tourne sur ce site meme, en bas de l ecran, et le visiteur
 * peut le mettre en defaut sans croire personne. C est la seule preuve qu il
 * manipule au lieu de la lire.
 *
 * ET LA PAGE NE S AUTO-DENIGRE PAS. Ne revendiquer aucune reference est une
 * obligation ; ecrire qu on n en a pas est un choix, et il coute la vente
 * (guide de voix §4). Le silence sur un negatif n est pas une affirmation
 * fausse.
 *
 * LE TROISIEME PARAGRAPHE DE LA SECTION (01) N EST PAS DECORATIF.
 * « Aucune sous-traitance » est faux — la production des reseaux sociaux se
 * fait avec un partenaire, et lib/familles.ts comme ServicesRows l ecrivent en
 * toutes lettres. Une page qui affirmerait le contraire se contredirait a un
 * clic d ici. Le partenaire n est PAS nomme : c est une decision fermee du
 * projet.
 *
 * AUCUN MONTANT N EST ECRIT ICI, ni a l ecran ni en donnee structuree. Les
 * prix vivent en base (table Service) et se lisent sur /services ; un montant
 * fige dans un fichier de page finit toujours par contredire la grille. La
 * page ne lit donc PAS Postgres et reste statique : pas de force-dynamic, et
 * `next build` passe base eteinte.
 *
 * ZERO CLASSE NOUVELLE. La page se monte sur le design system existant —
 * .wrap, .sec-head, .meta, .index, h1.t / h2.t, .lede, .studio-txt, .facts,
 * .prest-inc, .sm-grp, .c-row, .btn, .lnk. Aucune regle n est ajoutee a
 * app/binacore.css ni ailleurs.
 *
 * PAS DE next/link : Interactions.tsx ne s initialise qu une fois, une
 * navigation client-side laisserait les [data-reveal] de la page d arrivee a
 * opacity:0. Des <a> classiques, comme partout sur le site public.
 */

/**
 * Le suffixe « — Nawa Corps » vient du `template` du layout (site) : l ecrire
 * ici le doublerait.
 *
 * LE BLOC `twitter` EST REDECLARE EN ENTIER, et ce n est pas une redondance :
 * la fusion des metadata de Next ne descend pas dans les objets. Sans lui,
 * cette page heriterait du `twitter` de l accueil — titre et description de
 * l accueil sur la carte de partage de /studio.
 */
const TITRE = "Ayoub Bensalem, studio de création digitale à Genève";
const DESCRIPTION =
  "Qui fait le travail : une seule personne, à Genève. Ce que le studio sait faire, ce qu'il ne prend pas, et comment se passe une refonte.";

export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
  alternates: { canonical: "/studio" },
  openGraph: openGraphPage({
    titre: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    chemin: "/studio",
  }),
  twitter: {
    card: "summary_large_image",
    title: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

/**
 * AboutPage, rattachee au studio par @id.
 *
 * Le studio lui-meme n est PAS redeclare ici : components/SchemaStudio.tsx
 * emet le ProfessionalService sur l accueil sous l @id `/#studio`, et deux
 * fiches du meme prestataire qui divergeraient d un mot valent moins qu une
 * seule, referencee. C est deja la regle des pages de formule.
 */
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/studio#page`,
  url: `${SITE_URL}/studio`,
  name: `${TITRE} — ${SITE_NAME}`,
  description: DESCRIPTION,
  mainEntity: { "@id": `${SITE_URL}/#studio` },
};

export default function StudioPage() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(SCHEMA) }}
      />

      {/* ---------- Qui, où, et en combien de temps ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              Le studio
            </span>
            {/* Interactions.tsx decoupe h1.t sur ses <br> et lui pose lui-meme
                un [data-reveal] : ne pas en ecrire un a la main. */}
            <h1 className="t">
              Le studio, c&apos;est
              <br />
              une personne, à Genève.
            </h1>
          </div>

          <p className="lede" data-reveal>
            Nawa Corps est le studio de création digitale d&apos;Ayoub Bensalem.
            Celui qui lit votre message est celui qui dessine la maquette, écrit
            le code et vous rappelle. Cette page dit ce que ça change, et ce que
            ça exclut.
          </p>

          {/* .facts : le meme bandeau que la section « Le studio » de l accueil
              et que les pages de formule. « Une semaine » ne voyage jamais
              seule (guide de voix §5) — la colonne suivante porte son point de
              depart, dans la meme unite de lecture. */}
          <div className="facts" data-reveal>
            <div>
              <b>Ayoub Bensalem</b>
              <span>Designer et développeur</span>
            </div>
            <div>
              <b>Genève</b>
              <span>Et sa région</span>
            </div>
            <div>
              <b>Une semaine</b>
              <span>Refonte livrée</span>
            </div>
            <div>
              <b>Dès votre feu vert</b>
              <span>Départ du délai</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Qui fait le travail ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; La personne
            </span>
            <div data-reveal>
              <h2 className="t">
                Une seule personne,
                <br />
                et vous lui parlez.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              Ayoub Bensalem, designer et développeur, à Genève. Le studio
              n&apos;a ni commercial ni chargé de compte : personne ne vous vend
              le travail pour passer ensuite le dossier à quelqu&apos;un
              d&apos;autre. La voix au téléphone et la main sur le clavier sont
              la même.
            </p>
            <p>
              Pas de bureaux non plus, et c&apos;est assumé. On se voit chez
              vous — c&apos;est là que se trouve le métier dont il faut parler,
              et souvent les photos qu&apos;il faudra faire — ou par téléphone
              si c&apos;est plus simple pour vous.
            </p>
            <p>
              Une exception, et elle est écrite : la production des réseaux
              sociaux se fait avec un partenaire de production du studio. Le
              calendrier, les réponses et le rendu du travail restent de mon
              côté — vous n&apos;avez qu&apos;une conversation à suivre.
            </p>
            <p>
              Un an après la mise en ligne, l&apos;adresse à qui écrire n&apos;a
              pas changé, et la personne derrière non plus. Un tarif qui bouge,
              une affiche pour la rentrée, une question de plus dans le
              formulaire : c&apos;est le même fil de discussion.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Comment ça se passe, du premier message à la mise en ligne ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(02)</span>&nbsp; Le déroulé
            </span>
            <div data-reveal>
              <h2 className="t">
                Du premier message
                <br />à la mise en ligne.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            Six moments, et un seul vous demande quelque chose — le deuxième, et
            c&apos;est une conversation, pas des fichiers.
          </p>

          {/* Les intitules sont des <h3> PORTANT .sm-grp, jamais des <h3> nus :
              sans regle propre, un h3 prend `font-size:inherit` du preflight
              Tailwind en production et la taille par defaut du navigateur en
              developpement — deux rendus differents pour le meme titre. */}
          <div className="studio-txt" data-reveal style={{ marginTop: 34 }}>
            <h3 className="sm-grp">Le premier message</h3>
            <p>
              WhatsApp, téléphone, formulaire, ou l&apos;assistant en bas de
              l&apos;écran. Vous dites ce que vous avez et ce qui ne va pas ; le
              message arrive sur mon téléphone.
            </p>

            <h3 className="sm-grp">L&apos;état des lieux</h3>
            <p>
              On regarde ensemble ce qui est en ligne aujourd&apos;hui : le
              site, la fiche Google, ce qu&apos;un client trouve quand il
              cherche votre métier à Genève. Vous dites ce que vous voulez
              recevoir — des devis, des rendez-vous, des appels. C&apos;est le
              seul moment où vous avez quelque chose à donner, et ça se donne en
              parlant.
            </p>

            <h3 className="sm-grp">Votre feu vert</h3>
            <p>
              Le délai part de là, et de nulle part ailleurs : une semaine, du
              feu vert à la mise en ligne. Vous n&apos;avez rien à préparer — je
              reprends les textes de votre site actuel, et je rédige la maquette
              si vous partez de zéro.
            </p>

            <h3 className="sm-grp">La maquette, en début de semaine</h3>
            <p>
              Vous voyez l&apos;avant / après. Vous validez, ou vous demandez
              des changements : deux allers-retours sont compris, facturés
              au-delà. La limite est écrite avant de commencer plutôt que
              découverte sur la facture.
            </p>

            <h3 className="sm-grp">La validation, puis la mise en ligne</h3>
            <p>
              Le site fini vous est présenté et validé. Le paiement intervient à
              la livraison, et la mise en ligne suit. Domaine, hébergement,
              formulaire, prise de rendez-vous : tout est branché — vous
              n&apos;installez rien et vous ne configurez rien.
            </p>

            <h3 className="sm-grp">L&apos;année d&apos;après</h3>
            <p>
              La première année d&apos;hébergement et de nom de domaine est
              comprise dans le prix du site. À partir de la deuxième, le suivi
              prend le relais : il ne se choisit pas dans un menu, il découle de
              la formule achetée. Avec L&apos;Assistant il est obligatoire —
              l&apos;assistant consomme des appels d&apos;API tous les mois, et
              sans le suivi il s&apos;arrête.
            </p>

            <p style={{ marginTop: 30 }}>
              <a className="lnk" href="/services">
                Voir les formules et les prix →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Ce que le studio sait faire ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(03)</span>&nbsp; Le métier
            </span>
            <div data-reveal>
              <h2 className="t">
                Six lignes de travail,
                <br />
                une seule main.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            Le site est le produit d&apos;entrée, pas le catalogue. Voici le
            reste — et c&apos;est le fait qu&apos;une seule personne les tienne
            toutes qui fait l&apos;argument.
          </p>

          <ul className="prest-inc" data-reveal style={{ marginTop: 34 }}>
            <li>
              Sites — refonte ou départ de zéro, formulaire de demande, prise de
              rendez-vous, devis chiffré, assistant.
            </li>
            <li>
              Identité — logotype, couleurs, typographies, et les fichiers pour
              s&apos;en servir.
            </li>
            <li>
              Imprimés — cartes de visite, affiches, stickers vitrine, cartes de
              restaurant, prêts pour l&apos;impression.
            </li>
            <li>
              Photographie — vos locaux, votre équipe, vos produits : pour le
              site comme pour la fiche Google.
            </li>
            <li>
              Fiche Google — photos, horaires exacts, zone d&apos;intervention,
              réponses aux avis.
            </li>
            <li>
              Réseaux sociaux — calendrier du mois, visuels, textes,
              publication. Produits avec un partenaire de production du studio,
              et rendus par moi.
            </li>
          </ul>

          <div className="studio-txt" data-reveal style={{ marginTop: 34 }}>
            <p>
              Ce n&apos;est pas une liste de compétences, c&apos;est ce qui rend
              l&apos;ensemble cohérent. Une carte de visite qui ne ressemble pas
              au site, une affiche dont la typographie n&apos;est celle de
              rien : c&apos;est ce qui arrive quand chaque pièce est commandée à
              un endroit différent. Ici elles se ressemblent parce
              qu&apos;elles sortent du même endroit.
            </p>
            <p>
              <a className="lnk" href="/services">
                Voir le catalogue en entier →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Ce que le studio ne fait pas ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(04)</span>&nbsp; Le périmètre
            </span>
            <div data-reveal>
              <h2 className="t">
                Ce que je
                <br />
                ne prends pas.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            Une page qui ne sait rien refuser ne dit rien. Ces quatre-là partent
            ailleurs, et je le dis au premier message plutôt qu&apos;au
            troisième rendez-vous.
          </p>

          <ul className="prest-inc" data-reveal style={{ marginTop: 34 }}>
            <li>
              Les boutiques en ligne. Stock, paiements, retours, litiges : un
              autre métier, une autre maintenance.
            </li>
            <li>
              Les appels d&apos;offres, les grands comptes et les
              administrations. Les procédures et les délais de paiement ne vont
              pas avec une structure d&apos;une personne.
            </li>
            <li>
              Les sociétés qui ont déjà des développeurs. Elles font leur site
              elles-mêmes, mieux et pour moins cher.
            </li>
            <li>
              Les urgences à la demi-journée. Le délai est d&apos;une semaine du
              feu vert à la mise en ligne, et il tient parce qu&apos;il
              n&apos;est pas plus court.
            </li>
          </ul>

          <div className="studio-txt" data-reveal style={{ marginTop: 34 }}>
            <p>
              Le refus n&apos;est pas une posture. Une structure d&apos;une
              personne qui accepte tout ne tient plus aucune de ses dates, et
              c&apos;est le client d&apos;après qui paie le retard.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- La seule preuve que le visiteur peut vérifier lui-même ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(05)</span>&nbsp; La démonstration
            </span>
            <div data-reveal>
              <h2 className="t">
                Le produit tourne
                <br />
                sur cet écran.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              Le troisième palier s&apos;appelle L&apos;Assistant, et il
              n&apos;est pas décrit ici : il tourne sur ce site. Le bouton en
              bas de l&apos;écran l&apos;ouvre. Posez-lui une question sur une
              prestation ou sur un prix — il répond avec le catalogue et les
              tarifs lus dans la base de ce site, pas avec des généralités.
            </p>
            <p>
              Le reste du produit est derrière : quand la conversation se
              termine, la demande part sur mon téléphone, et je la retrouve dans
              un tableau de bord avec ce qui a été dit et le numéro laissé.
              C&apos;est exactement ce qui serait installé chez vous, avec vos
              prestations et vos tarifs à la place des miens.
            </p>
            <p>
              Pour celui-là, vous n&apos;avez donc personne à croire sur parole.
              Il est en bas de l&apos;écran, et vous pouvez le mettre en défaut
              vous-même.
            </p>
          </div>

          {/* BoutonDevis reste un <a href> vers WhatsApp : si le JS ne demarre
              jamais le lien fonctionne encore, sinon le clic ouvre l assistant
              — c est-a-dire, ici, la piece dont la section vient de parler. */}
          <div className="c-row" data-reveal>
            <BoutonDevis
              href={whatsapp(
                "Bonjour, j'ai lu la page du studio et j'aimerais un devis.",
              )}
              sujet="devis-studio"
              className="btn"
            >
              Demander un devis <span className="ar">→</span>
            </BoutonDevis>
            <a className="btn btn-line" href="/services">
              Voir les formules
            </a>
          </div>
        </div>
      </section>

      <FooterContact />
    </>
  );
}
