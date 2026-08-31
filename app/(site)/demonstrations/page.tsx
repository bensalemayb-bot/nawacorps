import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import FeatureCarousel from "@/components/ui/feature-carousel";
import { SITE_NAME, alternatesPage, openGraphPage } from "@/lib/site";

/**
 * /demonstrations — LES CINQ PIECES, ET CE QU ELLES SONT VRAIMENT.
 *
 * POURQUOI CETTE PAGE EXISTE. Le carrousel avant / apres ne vivait qu en
 * section (01) de l accueil : la seule preuve visuelle du site etait enterree
 * derriere le hero, sans URL propre — donc impossible a envoyer dans un
 * message, et invisible d un moteur interroge sur « exemple de site refait a
 * Geneve ». Le hero pointe desormais ici (« Voir les demonstrations ») ; il
 * fallait une page a atteindre.
 *
 * ELLE NE DUPLIQUE PAS L ACCUEIL, ELLE LE PORTE. components/Travaux.tsx garde
 * le carrousel comme apercu dans le fil de l accueil et renvoie ici ; cette
 * page dit en plus CE QUE LE LECTEUR REGARDE, ce que la section de l accueil
 * n a pas la place de faire.
 *
 * LE MOT EST « DEMONSTRATION », ET IL EST ECRIT A COTE DES PIECES.
 * Guide de voix §10, entree 14 : jamais « realisation », « projet », « cas
 * client », « portfolio », « references ». Les cinq pieces sont dessinees pour
 * un bar qui n existe pas, et la page le dit AVANT le carrousel, pas en note
 * de bas de page — la LCD art. 3 vise les indications trompeuses, et presenter
 * un travail fictif comme une realisation cliente en releve directement.
 * C est la meme regle que celle deja appliquee DANS les maquettes
 * (components/ui/feature-carousel.tsx, commentaire des scenes « apres ») : ni
 * annee de fondation, ni rue reelle, ni domaine en .ch.
 *
 * AUCUN NOM DE CLIENT, AUCUN CHIFFRE DE RESULTAT, AUCUN AVIS, AUCUNE DATE DE
 * PROJET n est ecrit ici — et il n y en a pas a ajouter plus tard sans accord
 * ecrit du client concerne.
 *
 * AUCUN MONTANT NON PLUS, donc aucune mention de TVA a porter : les prix
 * vivent en base (table Service) et se lisent sur /services. La page ne lit
 * pas Postgres et reste statique — pas de force-dynamic, `next build` passe
 * base eteinte.
 *
 * ZERO CLASSE NOUVELLE : section, .wrap, .sec-head, .meta, .index, h1.t /
 * h2.t, .lede, .studio-txt, .c-row, .btn, .btn-line, .ar, .lnk. Aucune regle
 * n est ajoutee a app/binacore.css ni ailleurs.
 *
 * PAS DE next/link : Interactions.tsx ne s initialise qu une fois, une
 * navigation client-side laisserait les [data-reveal] de la page d arrivee a
 * opacity:0 (decision B7). Des <a> classiques, comme partout sur le public.
 */

/**
 * Le suffixe « — Nawa Corps » vient du `template` du layout (site) : l ecrire
 * dans `title` le doublerait.
 *
 * LE BLOC `twitter` EST REDECLARE EN ENTIER, comme sur /studio et /contact :
 * la fusion des metadata de Next ne descend pas dans les objets. Sans lui,
 * cette page porterait le titre et la description de l accueil sur sa carte de
 * partage — c est-a-dire la promesse commerciale la ou on annonce des pieces.
 *
 * `alternates` PASSE PAR `alternatesPage` DEPUIS QUE LA JUMELLE ANGLAISE
 * EXISTE. La canonique ne bouge pas ; la fonction AJOUTE les `hreflang`, et
 * LES DEUX SENS SONT OBLIGATOIRES — une page anglaise qui declare sa jumelle
 * francaise sans que celle-ci lui rende la pareille voit son groupe ignore par
 * Google, et les deux versions se remettent a se concurrencer. `en-CH` n est
 * emis que si ce chemin figure dans `CHEMINS_TRADUITS` (lib/i18n.ts) :
 * annoncer une jumelle qui repond 404 est pire que de ne rien annoncer.
 */
const TITRE = "Démonstrations du studio";
const DESCRIPTION =
  "Cinq pièces dessinées par le studio pour montrer son travail : une carte, un site, une carte de visite, une affiche, une carte de fidélité. L'avant et l'après, côte à côte.";

export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
  alternates: alternatesPage("/demonstrations"),
  openGraph: openGraphPage({
    titre: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    chemin: "/demonstrations",
  }),
  twitter: {
    card: "summary_large_image",
    title: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function DemonstrationsPage() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      <SchemaPage
        fil={[
          { nom: "Accueil", chemin: "/" },
          { nom: "Démonstrations", chemin: "/demonstrations" },
        ]}
      />

      {/* ---------- Le titre, ce que c'est, puis les pièces ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              Démonstrations
            </span>
            {/* Interactions.tsx decoupe h1.t sur ses <br> et lui pose lui-meme
                son [data-reveal] : ne pas en ecrire un a la main. Meme
                garde-fou que sur /mentions-legales et /studio. */}
            <h1 className="t">
              Cinq pièces,
              <br />
              faites pour montrer.
            </h1>
          </div>

          <p className="lede" data-reveal>
            Une carte, un site, une carte de visite, une affiche, une carte de
            fidélité. Glissez la poignée de chaque pièce pour comparer
            l&apos;avant et l&apos;après.
          </p>

          {/* CE QUE LE LECTEUR REGARDE, DIT AVANT QU IL REGARDE : le mot
              « démonstration » se lit au-dessus des pièces, pas en dessous. */}
          <div className="studio-txt" data-reveal>
            <p>
              Ces cinq pièces sont des démonstrations. Elles ont été dessinées
              ici, de bout en bout, pour un bar qui n&apos;existe pas — « Le
              Comptoir ». Il n&apos;y a donc aucun client derrière, aucun
              chiffre de résultat à annoncer, aucune date de mise en ligne : ce
              que vous regardez est le travail lui-même. L&apos;avant est celui
              qu&apos;on rencontre encore souvent ; l&apos;après est ce qui
              serait livré.
            </p>
            <p>
              Le studio est jeune, et ça se dit sans détour. C&apos;est aussi
              pourquoi il montre plutôt qu&apos;il ne raconte : une pièce
              dessinée se juge en dix secondes, et vous n&apos;avez personne à
              croire sur parole.
            </p>
          </div>

          {/* Le carrousel porte son propre "use client" : la page reste un
              composant serveur. Le <div data-reveal> qui l enveloppe est le
              meme que dans components/Travaux.tsx — Interactions echelonne les
              reveals sur les enfants directs de .wrap. */}
          <div data-reveal>
            <FeatureCarousel />
          </div>
        </div>
      </section>

      {/* ---------- La sixième pièce, celle qui tourne sur cet écran ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; La sixième
            </span>
            <div data-reveal>
              <h2 className="t">
                La dernière ne se
                <br />
                regarde pas.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              Les cinq pièces ci-dessus se regardent. La sixième est en bas de
              l&apos;écran et elle se manipule : l&apos;assistant du troisième
              palier tourne sur ce site. Posez-lui une question sur une
              prestation ou sur un prix — il répond avec le catalogue et les
              tarifs lus dans la base de ce site.
            </p>
            <p>
              C&apos;est exactement ce qui serait installé chez vous, avec vos
              prestations et vos tarifs à la place des nôtres.{" "}
              <a className="lnk" href="/services">
                Voir les formules et les prix →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Votre commerce ici ----------
          Meme motif de fin que le bas de components/PageFamille.tsx : une
          .c-row, le devis en .btn, l alternative en .btn-line. La route /devis
          porte le formulaire de demande, /services porte les prix. */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(02)</span>&nbsp; Votre commerce ici
            </span>
            <div data-reveal>
              <h2 className="t">
                Le même travail,
                <br />
                avec votre métier.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              Ces pièces sont dessinées pour un bar, mais le geste ne change pas
              avec le métier : un garage, un cabinet et une fiduciaire ont les
              mêmes besoins de lisibilité. Dites-nous ce que vous avez en ligne
              aujourd&apos;hui et ce que vous voulez recevoir — des devis, des
              rendez-vous, des appels.
            </p>
          </div>

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
    </>
  );
}
