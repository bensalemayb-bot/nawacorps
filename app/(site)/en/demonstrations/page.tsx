import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import FeatureCarousel from "@/components/ui/feature-carousel";
import { lien, type Locale } from "@/lib/i18n";
import { SITE_NAME, alternatesPage, openGraphPage } from "@/lib/site";

/**
 * /en/demonstrations — LES CINQ PIECES, ET CE QU'ELLES SONT VRAIMENT.
 *
 * >>> LA MISE EN GARDE EST LE CŒUR DE CETTE PAGE, PAS SA NOTE DE BAS DE PAGE.
 * >>> ELLE EST AUSSI EXPLICITE EN ANGLAIS QU'EN FRANCAIS, ET ELLE SE LIT AVANT
 * >>> LE CARROUSEL, PAS APRES. <<<
 *
 * Les cinq pieces sont faites pour deux etablissements qui N'EXISTENT PAS, et
 * leurs noms sont FLOUTES sur les images depuis le 2 septembre 2026 : une
 * enseigne inventee, meme etiquetee, reste une enseigne inventee a l ecran.
 * Il n'y a donc AUCUN client derriere, AUCUN chiffre de resultat,
 * AUCUN avis, AUCUNE date de mise en ligne, et il n'y en a pas a ajouter plus
 * tard sans accord ecrit du client concerne. La LCD art. 3 vise les
 * indications trompeuses, et ELLE NE S'ARRETE PAS A LA FRONTIERE DE LA
 * LANGUE : presenter un travail fictif comme une realisation cliente en
 * releve directement, que la phrase soit francaise ou anglaise. La formule
 * anglaise dit les trois manques nommement — « no client behind them, no
 * results to report, no launch date ».
 *
 * LE MOT EST « DEMONSTRATION », ET RIEN D'AUTRE. Glossaire §3 : jamais
 * `case study`, jamais `portfolio`, jamais `our work`, jamais `references`.
 * C'est la traduction imposee de « démonstration », et c'est aussi le seul mot
 * qui dise la verite de ce que le lecteur regarde.
 *
 * LES PIECES SONT EN FRANCAIS, ET LA PAGE LE DIT. Le carrousel
 * (components/ui/feature-carousel.tsx) est une copie a l'octet pres de la
 * maquette : la carte du bar, l'affiche et la carte de fidelite sont
 * redigees en francais, parce qu'elles sont dessinees pour un bar genevois.
 * Le taire donnerait a un lecteur anglophone l'impression d'une page mal
 * traduite ; le dire en fait ce que c'est — une piece authentique, dans la
 * langue de son commerce.
 *
 * ELLE NE DUPLIQUE PAS L'ACCUEIL, ELLE LE PORTE. components/Travaux.tsx garde
 * le carrousel comme apercu dans le fil de l'accueil et renvoie ici ; cette
 * page dit en plus CE QUE LE LECTEUR REGARDE, ce que la section de l'accueil
 * n'a pas la place de faire.
 *
 * AUCUN MONTANT, donc aucune mention de TVA a porter : les prix vivent en base
 * (table Service) et se lisent sur /en/services. La page ne lit pas Postgres
 * et reste statique — pas de force-dynamic, `next build` passe base eteinte.
 *
 * ZERO CLASSE NOUVELLE : section, .wrap, .sec-head, .meta, .index, h1.t /
 * h2.t, .lede, .studio-txt, .c-row, .btn, .btn-line, .ar, .lnk.
 *
 * PAS DE next/link : Interactions.tsx ne s'initialise qu'une fois (B7).
 */

/** La langue de cette page. TOUS ses liens internes passent par `lien`. */
const LOCALE: Locale = "en";

/** Le chemin SANS prefixe : c'est `lien` et `alternatesPage` qui posent `/en`. */
const CHEMIN = "/demonstrations";

/**
 * Le suffixe « — Nawa Corps » vient du `template` du layout (site).
 *
 * LE BLOC `twitter` EST REDECLARE EN ENTIER : la fusion des metadata de Next
 * ne descend pas dans les objets. Sans lui, cette page porterait le titre et
 * la description de l'accueil sur sa carte de partage — c'est-a-dire la
 * promesse commerciale la ou on annonce des pieces.
 */
const TITRE = "Demonstrations from the studio";
const DESCRIPTION =
  "Five pieces drawn by the studio to show its work: a menu, a site, a business card, a poster, a loyalty card. The before and the after, side by side.";

export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
  alternates: alternatesPage(CHEMIN, LOCALE),
  openGraph: openGraphPage(
    {
      titre: `${TITRE} — ${SITE_NAME}`,
      description: DESCRIPTION,
      chemin: CHEMIN,
    },
    LOCALE,
  ),
  twitter: {
    card: "summary_large_image",
    title: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function DemonstrationsEn() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      <SchemaPage
        locale={LOCALE}
        fil={[
          { nom: "Home", chemin: lien(LOCALE, "/") },
          { nom: "Demonstrations", chemin: lien(LOCALE, CHEMIN) },
        ]}
      />

      {/* ---------- Le titre, ce que c'est, puis les pièces ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              Demonstrations
            </span>
            {/* Interactions.tsx decoupe h1.t sur ses <br> et lui pose lui-meme
                son [data-reveal] : ne pas en ecrire un a la main. */}
            <h1 className="t">
              Five pieces,
              <br />
              made to be shown.
            </h1>
          </div>

          <p className="lede" data-reveal>
            A menu, a site, a business card, a poster, a loyalty card. Drag the
            handle on each piece to compare the before and the after.
          </p>

          {/* CE QUE LE LECTEUR REGARDE, DIT AVANT QU IL REGARDE : le mot
              « demonstration » et les trois manques se lisent AU-DESSUS des
              pieces, jamais en dessous. */}
          <div className="studio-txt" data-reveal>
            <p>
              These five pieces are demonstrations. They were made here, from
              start to finish, for two businesses that do not exist — a bar and
              a road-marking company. Their names are blurred out in the
              images, because there is nobody behind them: no client, no
              results to report and no launch date. What you are looking at is
              the work itself. The before is the one you still meet often; the
              after is what would be delivered.
            </p>
            <p>
              The pieces themselves are written in French, and that is not an
              oversight: they are made for two Geneva businesses, and a menu, a
              poster and a loyalty card are in the language of their customers.
            </p>
            <p>
              The studio is young, and that is said plainly. It is also why it
              shows rather than tells: a piece is judged in ten seconds, and
              you have nobody to take at their word.
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
              <span className="index">(01)</span>&nbsp; The sixth
            </span>
            <div data-reveal>
              <h2 className="t">
                The last one is not
                <br />
                for looking at.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              The five pieces above are for looking at. The sixth is at the
              bottom of the screen and it is for handling: the assistant from
              the third package runs on this site. Ask it about a service or a
              price — it answers with the catalogue and the rates read from this
              site&apos;s database.
            </p>
            <p>
              That is exactly what would be installed at your place, with your
              services and your rates instead of ours.{" "}
              <a className="lnk" href={lien(LOCALE, "/services")}>
                See the packages and the prices →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Votre commerce ici ----------
          Meme motif de fin que le bas de components/PageFamille.tsx : une
          .c-row, le devis en .btn, l alternative en .btn-line. La route
          /en/devis porte le formulaire de demande, /en/services porte les
          prix. */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(02)</span>&nbsp; Your business here
            </span>
            <div data-reveal>
              <h2 className="t">
                The same work,
                <br />
                with your trade.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              These pieces are drawn for a bar, but the gesture does not change
              with the trade: a garage, a practice and an accountancy firm have
              the same need to be legible. Tell us what you have online today
              and what you want to receive — quotes, appointments, calls.
            </p>
          </div>

          <div className="c-row" data-reveal>
            <a className="btn" href={lien(LOCALE, "/devis")}>
              Ask for a quote <span className="ar">→</span>
            </a>
            <a className="btn btn-line" href={lien(LOCALE, "/services")}>
              See the packages
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
