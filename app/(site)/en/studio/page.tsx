import type { Metadata } from "next";
import FooterContact from "@/components/FooterContact";
import { METIERS } from "@/lib/metiers";
import SchemaPage from "@/components/SchemaPage";
import { lien, LANGUE_HTML, type Locale } from "@/lib/i18n";
import {
  CONTACT,
  SITE_NAME,
  SITE_URL,
  alternatesPage,
  jsonLd,
  openGraphPage,
} from "@/lib/site";

/**
 * /en/studio — WHO DOES THE WORK, pour un lecteur anglophone de Geneve.
 *
 * Meme page que app/(site)/studio/page.tsx, dans le meme ordre : cinq
 * sections (01) a (05), un pied de page en (06). Une version anglaise qui
 * reordonnerait ne serait plus la meme page pour le couple `hreflang`.
 * Textes : docs/agents/copy/studio.md, colonne EN.
 *
 * Memes interdits qu en francais : aucune reference, aucun avis, aucun
 * effectif, aucun bureau, aucune mention du developpeur, aucun montant. Anglais
 * britannique (`enquiry`), `we` pour le studio, jamais `our team`.
 *
 * Pas d image : voir le docblock de la page francaise.
 *
 * PAS DE next/link (decision B7). Tous les liens internes passent par `lien`.
 */

/** La langue de cette page. TOUS ses liens internes passent par `lien`. */
const LOCALE: Locale = "en";

/** Le chemin SANS prefixe : c'est `lien` et `alternatesPage` qui posent `/en`. */
const CHEMIN = "/studio";

/** Ce qu un humain lit ; `CONTACT.ville` reste reserve aux donnees structurees. */
const VILLE = CONTACT.villeEn;

/**
 * Le suffixe « — Nawa Corps » vient du `template` du layout (site). Titre et
 * description de l audit CRO/SEO du 25.10.2026 (§4.4), en miroir.
 */
const TITRE = "Ayoub Bensalem, AI assistants in Geneva";
const DESCRIPTION =
  "Who makes the first call, runs the demo and follows up. A base for each trade. It never commits on your behalf. What we do not take on.";

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
  // Redeclare en entier : la fusion des metadata ne descend pas dans les objets.
  twitter: {
    card: "summary_large_image",
    title: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

/**
 * AboutPage anglaise, rattachee PAR REFERENCE au studio (`/#studio`) et a la
 * Person (`/#ayoub`) decrits ailleurs : les redeclarer ici donnerait deux
 * fonctions a un seul @id. `inLanguage` dit au moteur que ce document est la
 * version anglaise, pas un doublon.
 */
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}${lien(LOCALE, CHEMIN)}#page`,
  url: `${SITE_URL}${lien(LOCALE, CHEMIN)}`,
  inLanguage: LANGUE_HTML[LOCALE],
  name: `${TITRE} — ${SITE_NAME}`,
  description: DESCRIPTION,
  mainEntity: { "@id": `${SITE_URL}/#ayoub` },
  about: { "@id": `${SITE_URL}/#studio` },
};

export default function StudioEn() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(SCHEMA) }}
      />
      <SchemaPage
        locale={LOCALE}
        fil={[
          { nom: "Home", chemin: lien(LOCALE, "/") },
          { nom: "The studio", chemin: lien(LOCALE, CHEMIN) },
        ]}
      />

      {/* ---------- En-tête ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              The studio
            </span>
            {/* Interactions.tsx decoupe h1.t sur ses <br> et lui pose lui-meme
                un [data-reveal] : ne pas en ecrire un a la main. */}
            <h1 className="t">
              Who does the work,
              <br />
              and how.
            </h1>
          </div>

          <p className="lede" data-reveal>
            Nawa Corps is a {VILLE} studio that sets up AI assistants in small
            businesses. This page says who does it, how the trial runs, and what
            we do not take on.
          </p>

          <div className="facts" data-reveal>
            <div>
              <b>Ayoub Bensalem</b>
              <span>First call and follow-up</span>
            </div>
            <div>
              <b>{VILLE}</b>
              <span>And the surrounding region</span>
            </div>
            <div>
              {/* A verifiable fact, said without a counter effect. */}
              <b>By trade</b>
              <span>{`${METIERS.length} trades, a base for each`}</span>
            </div>
            <div>
              <b>In Switzerland</b>
              <span>The assistant&apos;s data</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- (01) Who you talk to ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; Who you talk to
            </span>
            <div data-reveal>
              <h2 className="t">
                You talk to whoever
                <br />
                does the work.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              Ayoub Bensalem founded the studio. He makes the first call, runs
              the demo and does the weekly follow-up. You are not passed from a
              salesperson to a project manager.
            </p>
            <p>
              No office, and we say so. The first call is made by phone. Your
              enquiries are where you are.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- (02) How it runs ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(02)</span>&nbsp; How it runs
            </span>
            <div data-reveal>
              <h2 className="t">
                From the first call
                <br />
                to the Monday report.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            Four moments. None of them asks you to prepare anything.
          </p>

          {/* Les intitules sont des <h3> PORTANT .sm-grp : un h3 nu change de
              taille entre le developpement et la production (preflight). */}
          <div className="studio-txt" data-reveal style={{ marginTop: 34 }}>
            <h3 className="sm-grp">The call</h3>
            <p>
              A short call. You tell us what takes up your evenings. We sell you
              nothing that day.
            </p>

            <h3 className="sm-grp">The demo</h3>
            <p>
              We show you the assistant at work on enquiries from your trade:
              what it prepares, what you approve, what you correct. You have
              nothing to prepare, and we have access to none of your tools. At the end, we set
              the subscription tier with you, in writing.
            </p>

            <h3 className="sm-grp">The two-week trial</h3>
            <p>
              For two weeks, the assistant works on your real enquiries. It never commits on
              your behalf. You pay nothing during the trial.
            </p>

            <h3 className="sm-grp">Every Monday</h3>
            <p>
              A short report: what was handled, followed up, prepared, and what
              is waiting for you. If the report suits you, you pay for the
              set-up and the subscription carries on.
            </p>

            <p style={{ marginTop: 30 }}>
              <a className="lnk" href={lien(LOCALE, "/services")}>
                See the assistant in detail →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- (03) Trades ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(03)</span>&nbsp; Trades
            </span>
            <div data-reveal>
              <h2 className="t">
                A base for
                <br />
                each trade.
              </h2>
            </div>
          </div>

          {/* Chiffres sources, chacun avec sa source et son pays. */}
          <div className="studio-txt" data-reveal style={{ marginTop: 34 }}>
            <p>
              Geneva has 441 plumbing and heating-ventilation establishments (OCSTAT
              2024). Construction is the sector hit hardest by staff shortages
              in the canton (CCIG 2026).
            </p>
            <p>
              In the building trades, quotes are often done in the evening. In
              France, 42% of owners find their admin load stressful (CAPEB
              2023). In Geneva, we are checking it owner by owner.
            </p>
            <p>
              Each trade has its base: its usual enquiries, its vocabulary, its
              documents. Building tradespeople, property managers, accounting
              firms, garages and other service businesses each have their page,
              with a demo example.
            </p>
            <p>
              <a className="lnk" href={lien(LOCALE, "/metiers")}>
                See the trades →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- (04) What we do not take on ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(04)</span>&nbsp; The scope
            </span>
            <div data-reveal>
              <h2 className="t">
                What we
                <br />
                do not take on.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            We say so on the first call, not after the demo.
          </p>

          <ul className="prest-inc" data-reveal style={{ marginTop: 34 }}>
            <li>
              Medical practices, physiotherapy and dentists. Medical secrecy
              rules it out, and their appointments already have their tools.
            </li>
            <li>Lawyers. Professional secrecy rules it out.</li>
            <li>Large accounts and public bodies. Tenders and long cycles.</li>
            <li>
              Businesses that want an AI that does everything on its own. With
              us, the assistant never commits on your behalf.
            </li>
            <li>Tech companies. They do it themselves.</li>
          </ul>
        </div>
      </section>

      {/* ---------- (05) The demonstration ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(05)</span>&nbsp; The demonstration
            </span>
            <div data-reveal>
              <h2 className="t">
                Leo, at the bottom
                <br />
                of the screen.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              Leo is this site&apos;s assistant. It is a demonstration of what
              we can do, not a client.
            </p>
            <p>
              Ask it a question about your office work. It answers, then offers
              you the demo. When the conversation ends, it reaches our phone.
            </p>
            <p>
              Your own assistant shows itself on enquiries from your trade.
              That is what the demo is for.
            </p>
          </div>

          {/* « See the demo » shows the examples (/en/demonstrations); only
              « Get my demo » opens Leo (decision d Ayoub du 25.10.2026). */}
          <div className="c-row" data-reveal>
            <a className="btn" href={lien(LOCALE, "/demonstrations")}>
              See the demo on my trade <span className="ar">→</span>
            </a>
            <a className="btn btn-line" href={lien(LOCALE, "/services")}>
              See the assistant in detail
            </a>
          </div>
        </div>
      </section>

      {/* Cinq sections (01) a (05) : le contact porte (06). */}
      <FooterContact indexSection="06" locale={LOCALE} />
    </>
  );
}
