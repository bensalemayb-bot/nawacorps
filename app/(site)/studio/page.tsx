import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import FooterContact from "@/components/FooterContact";
import { METIERS } from "@/lib/metiers";
import {
  LANGUES,
  SAME_AS,
  SITE_NAME,
  SITE_URL,
  alternatesPage,
  jsonLd,
  openGraphPage,
} from "@/lib/site";

/**
 * /studio — QUI FAIT LE TRAVAIL.
 *
 * Cette page repond aux cinq questions d un patron avant d appeler : qui, comment
 * se passent la demo et l essai, une base par metier (/metiers), ce que nous ne
 * prenons pas, et ce qu il peut verifier lui-meme (Leo, en bas de l ecran).
 * Textes : docs/agents/copy/studio.md.
 *
 * AUCUNE PREUVE INVENTEE, ET AUCUN AVEU DE DEBUTANT (decision d Ayoub du
 * 25.10.2026). La page parle de methode et de controle, verifiables par le
 * patron lui-meme (la demo sur son metier, l essai sur ses demandes) ; elle
 * n affirme aucun client, aucun nombre de clients, d annees ou de projets, et
 * ne dit pas non plus qu il n y en a pas. Aucune reference, aucun avis, aucun
 * effectif, aucun bureau (LCD art. 3).
 * Aucune mention du developpeur (arbitrage B2 du 24.10.2026).
 *
 * AUCUN MONTANT ICI. Le seul montant affiche du site, la mise en place, est lu
 * en base et vit sur l accueil et /services. La page ne lit donc pas Postgres
 * et reste statique.
 *
 * PAS D IMAGE. La photographie d atelier montrait l ancien metier (papiers,
 * specimen typographique) ; elle reviendra avec une image d un geste de metier,
 * et son alt avec elle — jamais un alt sans image reelle.
 *
 * PAS DE next/link : Interactions.tsx ne s initialise qu une fois (decision
 * B7). Des <a> classiques, comme partout sur le site public.
 */

/**
 * Le suffixe « — Nawa Corps » vient du `template` du layout (site). Titre et
 * description de l audit CRO/SEO du 25.10.2026 (§4.4).
 */
const TITRE = "Ayoub Bensalem, assistants IA pour PME à Genève";
const DESCRIPTION =
  "Qui fait le premier appel, la démo et le suivi. Une base par métier. Il ne s'engage jamais à votre place. Ce que nous ne prenons pas.";

export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
  alternates: alternatesPage("/studio"),
  openGraph: openGraphPage({
    titre: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    chemin: "/studio",
  }),
  // Redeclare en entier : la fusion des metadata ne descend pas dans les
  // objets, sans lui la carte de partage reprendrait celle de l accueil.
  twitter: {
    card: "summary_large_image",
    title: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

/**
 * AboutPage + Person, rattachees au studio par @id.
 *
 * Le studio n est pas redeclare : components/SchemaStudio.tsx emet le
 * ProfessionalService sous `/#studio`. La Person porte le meme `@id` que le
 * `founder` de l accueil, pour qu un moteur n y voie qu une entite. Pas
 * d `image` tant qu il n y a pas de portrait.
 */
const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/studio#page`,
      url: `${SITE_URL}/studio`,
      name: `${TITRE} — ${SITE_NAME}`,
      description: DESCRIPTION,
      mainEntity: { "@id": `${SITE_URL}/#ayoub` },
      about: { "@id": `${SITE_URL}/#studio` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#ayoub`,
      name: "Ayoub Bensalem",
      jobTitle: "Fondateur",
      url: `${SITE_URL}/studio`,
      worksFor: { "@id": `${SITE_URL}/#studio` },
      knowsLanguage: [...LANGUES],
      // Vide tant que le profil LinkedIn n est pas donne (lib/site.ts).
      ...(SAME_AS.ayoub.length ? { sameAs: [...SAME_AS.ayoub] } : {}),
    },
  ],
};

export default function StudioPage() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(SCHEMA) }}
      />
      <SchemaPage
        fil={[
          { nom: "Accueil", chemin: "/" },
          { nom: "Le studio", chemin: "/studio" },
        ]}
      />

      {/* ---------- En-tête ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              Le studio
            </span>
            {/* Interactions.tsx decoupe h1.t sur ses <br> et lui pose lui-meme
                un [data-reveal] : ne pas en ecrire un a la main. */}
            <h1 className="t">
              Qui fait le travail,
              <br />
              et comment.
            </h1>
          </div>

          <p className="lede" data-reveal>
            Nawa Corps est un studio genevois qui installe des assistants IA
            dans les PME. Cette page dit qui le fait, comment se passe
            l&apos;essai, et ce que nous ne prenons pas.
          </p>

          <div className="facts" data-reveal>
            <div>
              <b>Ayoub Bensalem</b>
              <span>Premier appel et suivi</span>
            </div>
            <div>
              <b>Genève</b>
              <span>Et sa région</span>
            </div>
            <div>
              {/* Un fait verifiable (lib/metiers.ts), dit sans effet de
                  compteur : le chiffre est dans la phrase, pas en gros. */}
              <b>Par métier</b>
              <span>{`${METIERS.length} métiers, une base pour chacun`}</span>
            </div>
            <div>
              <b>En Suisse</b>
              <span>Données de l&apos;assistant</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- (01) Qui vous parle ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; Qui vous parle
            </span>
            <div data-reveal>
              <h2 className="t">
                Vous parlez à qui
                <br />
                fait le travail.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              Ayoub Bensalem a fondé le studio. Il fait le premier appel, la
              démo et le suivi de chaque semaine. Vous n&apos;êtes pas passé
              d&apos;un commercial à un chef de projet.
            </p>
            <p>
              Pas de bureau, et c&apos;est assumé. Le premier appel se fait au
              téléphone. C&apos;est chez vous que sont les demandes.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- (02) Le déroulé ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(02)</span>&nbsp; Le déroulé
            </span>
            <div data-reveal>
              <h2 className="t">
                Du premier appel
                <br />
                au relevé du lundi.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            Quatre moments. Aucun ne vous demande de préparer quoi que ce soit.
          </p>

          {/* Les intitules sont des <h3> PORTANT .sm-grp : un h3 nu change de
              taille entre le developpement et la production (preflight). */}
          <div className="studio-txt" data-reveal style={{ marginTop: 34 }}>
            <h3 className="sm-grp">L&apos;appel</h3>
            <p>
              Un appel court. Vous nous dites ce qui vous prend vos soirées.
              Nous ne vous vendons rien ce jour-là.
            </p>

            <h3 className="sm-grp">La démo</h3>
            <p>
              Nous vous montrons l&apos;assistant à l&apos;œuvre sur des
              demandes de votre métier : ce qu&apos;il prépare, ce que vous
              validez, ce que vous corrigez. Vous n&apos;avez rien à préparer,
              nous n&apos;avons accès à aucun de vos outils. À la fin, nous fixons
              avec vous, par écrit, le palier de l&apos;abonnement.
            </p>

            <h3 className="sm-grp">L&apos;essai, deux semaines</h3>
            <p>
              Pendant deux semaines, l&apos;assistant travaille sur vos vraies demandes. Il ne
              s&apos;engage jamais à votre place. Vous ne payez rien pendant
              l&apos;essai.
            </p>

            <h3 className="sm-grp">Chaque lundi</h3>
            <p>
              Un relevé court : ce qui a été traité, relancé, préparé, et ce qui
              vous attend. Si le relevé vous convient, vous payez la mise en
              place et l&apos;abonnement continue.
            </p>

            <p style={{ marginTop: 30 }}>
              <a className="lnk" href="/services">
                Voir l&apos;assistant en détail →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- (03) Les métiers ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(03)</span>&nbsp; Les métiers
            </span>
            <div data-reveal>
              <h2 className="t">
                Une base
                <br />
                pour chaque métier.
              </h2>
            </div>
          </div>

          {/* Chiffres sources (PM §2, recherche founder/) : chacun porte sa
              source et son pays, aucun n est prete aux patrons genevois. */}
          <div className="studio-txt" data-reveal style={{ marginTop: 34 }}>
            <p>
              Genève compte 441 établissements de sanitaire et de
              chauffage-ventilation (OCSTAT 2024). Le bâtiment est le premier
              secteur touché par la pénurie de personnel dans le canton (CCIG
              2026).
            </p>
            <p>
              Dans les métiers du bâtiment, les devis se font souvent le soir.
              En France, 42 % des patrons jugent leur charge administrative
              stressante (CAPEB 2023). À Genève, nous le vérifions patron par
              patron.
            </p>
            <p>
              Chaque métier a sa base : ses demandes types, son vocabulaire,
              ses documents. Les artisans du bâtiment, les régies, les
              fiduciaires, les garages et les autres PME de services ont
              chacun leur page, avec un exemple de démonstration.
            </p>
            <p>
              <a className="lnk" href="/metiers">
                Voir les métiers →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- (04) Ce que nous ne prenons pas ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(04)</span>&nbsp; Le périmètre
            </span>
            <div data-reveal>
              <h2 className="t">
                Ce que nous
                <br />
                ne prenons pas.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            Nous le disons au premier appel, pas après la démo.
          </p>

          {/* L anti-ICP du positionnement (PM §2), mot pour mot. */}
          <ul className="prest-inc" data-reveal style={{ marginTop: 34 }}>
            <li>
              Les cabinets médicaux, la physiothérapie et le dentaire. Le secret
              médical l&apos;exclut, et leurs rendez-vous ont déjà leurs outils.
            </li>
            <li>Les avocats. Le secret professionnel l&apos;exclut.</li>
            <li>
              Les grands comptes et les administrations. Appels d&apos;offres et
              cycles longs.
            </li>
            <li>
              Les entreprises qui veulent une IA qui fait tout seule. Chez nous,
              l&apos;assistant ne s&apos;engage jamais à votre place.
            </li>
            <li>Les sociétés tech. Elles le font elles-mêmes.</li>
          </ul>
        </div>
      </section>

      {/* ---------- (05) La démonstration ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(05)</span>&nbsp; La démonstration
            </span>
            <div data-reveal>
              <h2 className="t">
                Leo, en bas
                <br />
                de l&apos;écran.
              </h2>
            </div>
          </div>

          {/* Leo se presente comme une demonstration, jamais comme une
              reference client (PM §6). */}
          <div className="studio-txt" data-reveal>
            <p>
              Leo est l&apos;assistant de ce site. C&apos;est une démonstration
              de ce que nous savons faire, pas un client.
            </p>
            <p>
              Posez-lui une question sur votre bureau. Il répond, puis il vous
              propose la démo. Quand la conversation se termine, elle arrive sur
              notre téléphone.
            </p>
            <p>
              Votre assistant, lui, se montre sur des demandes de votre
              métier. C&apos;est le rôle de la démo.
            </p>
          </div>

          {/* « Voir la démo » montre les exemples (/demonstrations) ; seul
              « Demander ma démo » ouvre Leo (decision d Ayoub du 25.10.2026). */}
          <div className="c-row" data-reveal>
            <a className="btn" href="/demonstrations">
              Voir la démo sur mon métier <span className="ar">→</span>
            </a>
            <a className="btn btn-line" href="/services">
              Voir l&apos;assistant en détail
            </a>
          </div>
        </div>
      </section>

      {/* Cinq sections (01) a (05) : le contact porte (06). */}
      <FooterContact indexSection="06" />
    </>
  );
}
