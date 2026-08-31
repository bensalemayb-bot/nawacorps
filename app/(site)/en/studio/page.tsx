import type { Metadata } from "next";
import FooterContact from "@/components/FooterContact";
import SchemaPage from "@/components/SchemaPage";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, LANGUE_HTML, type Locale } from "@/lib/i18n";
import {
  SITE_NAME,
  SITE_URL,
  alternatesPage,
  jsonLd,
  openGraphPage,
} from "@/lib/site";

/**
 * /en/studio — QUI EST LE STUDIO, POUR UN LECTEUR ANGLOPHONE DE GENEVE.
 *
 * ELLE DIT LA MEME CHOSE QUE app/(site)/studio/page.tsx, dans le meme ordre :
 * qui fait le travail, comment ca se passe, ce que le studio sait faire, ce
 * qu'il refuse, et la seule preuve que le visiteur peut manipuler. Cinq
 * sections (01) a (05), un pied de page en (06). Une version anglaise qui
 * reordonnerait ne serait plus la meme page, et le couple `hreflang`
 * perdrait son sens.
 *
 * ELLE N'EST PAS UN CALQUE MOT A MOT. Le francais tient sa voix de tournures
 * qui n'ont pas d'equivalent — « une seule main », « la rentrée » — et le
 * glossaire (docs/agents/brand/glossaire-anglais.md §7) tranche les deux :
 * « one pair of hands », et la rentree se dit par son moment,
 * « when September comes round ».
 *
 * LES REGLES DE VOIX QUI GOUVERNENT CE FICHIER, et qu'un relecteur doit
 * pouvoir verifier ligne par ligne :
 *  - `I`, `me`, `my`. JAMAIS `we`, `our`, `our team`, `the agency`. C'est la
 *    regle la plus facile a enfreindre par reflexe : l'anglais commercial met
 *    « we » partout, et le studio est UNE personne.
 *  - Anglais BRITANNIQUE : `enquiry`, jamais `inquiry`.
 *  - `La Vitrine`, `Le Site`, `L'Assistant` NE SE TRADUISENT PAS, article
 *    compris — ce sont des noms propres (glossaire §5). Cette page n'en nomme
 *    qu'un, L'Assistant, en section (05).
 *  - AUCUN DELAI EN HEURES. « one week » existe seul comme duree, et il ne
 *    VOYAGE jamais seul : la meme unite de lecture porte soit son point de
 *    depart, soit ce qui est livre. C'est ce que fait le bandeau .facts, et
 *    c'est aussi pour cela que la colonne « From your go-ahead » est a cote.
 *  - `Geneva`. Jamais « Switzerland », jamais « across Europe ».
 *  - AUCUNE COMPARAISON, aucun concurrent nomme ou sous-entendu.
 *
 * AUCUNE ANCIENNETE, AUCUN EFFECTIF, AUCUNE REFERENCE CLIENT N'EST INVENTEE.
 * Le studio est jeune et sans bureau ; le francais le dit sans detour, cette
 * page aussi. La LCD art. 3 vise les indications trompeuses et elle ne
 * s'arrete pas a la frontiere de la langue.
 *
 * AUCUN MONTANT ICI, ni a l'ecran ni en donnee structuree — donc aucune
 * mention de TVA a porter. Les prix vivent en base (table Service) et se
 * lisent sur /en/services. La page ne lit donc PAS Postgres et reste
 * statique : pas de force-dynamic, et `next build` passe base eteinte.
 *
 * ZERO CLASSE NOUVELLE : .wrap, .sec-head, .meta, .index, h1.t / h2.t, .lede,
 * .studio-txt, .facts, .prest-inc, .sm-grp, .c-row, .btn, .btn-line, .ar,
 * .lnk. Aucune regle n'est ajoutee a app/binacore.css ni ailleurs.
 *
 * PAS DE next/link : Interactions.tsx ne s'initialise qu'une fois, une
 * navigation client-side laisserait les [data-reveal] de la page d'arrivee a
 * opacity:0 (decision B7). Des <a> classiques, comme partout sur le public.
 */

/** La langue de cette page. TOUS ses liens internes passent par `lien`. */
const LOCALE: Locale = "en";

/** Le chemin SANS prefixe : c'est `lien` et `alternatesPage` qui posent `/en`. */
const CHEMIN = "/studio";

const t = dictionnaire(LOCALE);

/**
 * « Geneva ».
 *
 * `CONTACT.ville` (lib/site.ts) vaut « Genève » : c'est le NAP, il est ecrit
 * pour la fiche Google et la donnee structuree, et lib/site.ts n'a pas encore
 * de jumeau anglais. Plutot que d'ouvrir une SECONDE graphie de la ville dans
 * ce fichier — exactement ce que la source unique existe pour empecher —, on
 * lit le mot la ou le chantier anglais l'a deja pose : le dictionnaire.
 */
const VILLE = t.nav.horlogeVille;

/**
 * Le suffixe « — Nawa Corps » vient du `template` du layout (site) : l'ecrire
 * dans `title` le doublerait.
 *
 * LE BLOC `twitter` EST REDECLARE EN ENTIER, et ce n'est pas une redondance :
 * la fusion des metadata de Next ne descend pas dans les objets. Sans lui,
 * cette page heriterait du `twitter` de l'accueil — titre et description de
 * l'accueil sur la carte de partage de /en/studio.
 *
 * `alternatesPage(CHEMIN, "en")` rend la canonique `/en/studio` et les
 * `hreflang`. Sans elle, la page heriterait de `alternates: { canonical: "/" }`
 * declare par app/(site)/layout.tsx et s'auto-desindexerait au profit de
 * l'accueil francais.
 */
const TITRE = "Ayoub Bensalem, digital design studio in Geneva";
const DESCRIPTION =
  "Who does the work: one person, in Geneva. What the studio can do, what it does not take on, and how a rebuild runs from the first message to going live.";

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

/**
 * AboutPage anglaise, rattachee PAR REFERENCE aux deux entites qui existent
 * deja — et surtout, qui n'en redeclare aucune.
 *
 * LE STUDIO N'EST PAS REDECLARE : components/SchemaStudio.tsx emet le
 * `ProfessionalService` sur l'accueil sous l'`@id` `/#studio`, et cet
 * identifiant designe UNE entite. Un prestataire n'a pas deux fiches parce
 * qu'il a deux langues ; il en a une, referencee depuis les deux.
 *
 * LA `Person` NON PLUS. app/(site)/studio/page.tsx decrit `/#ayoub` en entier
 * — nom, fonction, langues, employeur. La redecrire ici avec un `jobTitle`
 * anglais donnerait DEUX fonctions a un seul @id, et un moteur qui les fond
 * n'aurait aucun moyen de savoir laquelle repondre a qui. On la designe donc
 * par son seul `@id` : c'est ce que les references JSON-LD sont faites pour
 * faire, et elles se resolvent a l'echelle du site, pas de la page.
 *
 * CE QUI EST PROPRE A CETTE PAGE, EN REVANCHE, C'EST LA PAGE ELLE-MEME :
 * `@id` distinct (`/en/studio#page`), URL distincte, titre et description
 * anglais, et `inLanguage` — c'est lui qui dit au moteur que ce document-ci
 * est la version anglaise, et non un doublon du francais.
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

      {/* ---------- Qui, où, et en combien de temps ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              The studio
            </span>
            {/* Interactions.tsx decoupe h1.t sur ses <br> et lui pose lui-meme
                un [data-reveal] : ne pas en ecrire un a la main. Les deux
                lignes restent courtes, comme en francais — une ligne longue
                casse la mise en page a la revelation. */}
            <h1 className="t">
              The studio is
              <br />
              one person, in {VILLE}.
            </h1>
          </div>

          <p className="lede" data-reveal>
            Nawa Corps is Ayoub Bensalem&apos;s digital design studio. The
            person who reads your message is the one who draws the mockup,
            writes the code and calls you back. This page says what that
            changes, and what it rules out.
          </p>

          {/* .facts : le meme bandeau que la page francaise. « One week » NE
              VOYAGE JAMAIS SEULE (glossaire §5) — la colonne suivante porte
              son point de depart, dans la meme unite de lecture. */}
          <div className="facts" data-reveal>
            <div>
              <b>Ayoub Bensalem</b>
              <span>Designer and developer</span>
            </div>
            <div>
              <b>{VILLE}</b>
              <span>And the surrounding region</span>
            </div>
            <div>
              <b>One week</b>
              <span>Site rebuilt</span>
            </div>
            <div>
              <b>From your go-ahead</b>
              <span>When the clock starts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Qui fait le travail ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; The person
            </span>
            <div data-reveal>
              <h2 className="t">
                One person,
                <br />
                and you talk to me.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              Ayoub Bensalem, designer and developer, in {VILLE}. The studio has
              no sales person and no account manager: nobody sells you the work
              and then hands the file to someone else. The voice on the phone
              and the hand on the keyboard are the same one.
            </p>
            {/* LE FRANCAIS DIT « on se voit chez vous » ; L'ANGLAIS NE PEUT
                PAS DIRE « we meet ». Le glossaire §2 proscrit `we` sans
                exception, et il a raison meme quand le « we » est reciproque :
                sur une page qui vend le fait qu'une seule personne fait le
                travail, le lecteur lit d'abord le « we » d'entreprise. La
                phrase se tourne donc a la premiere personne, ce qui dit
                exactement la meme chose. */}
            <p>
              No offices either, and that is said plainly. I come to you: that
              is where your trade is, and often the photographs that will have
              to be taken. Or the phone, if that is easier for you.
            </p>
            {/* « Aucune sous-traitance » serait FAUX : la production des
                reseaux sociaux se fait avec un partenaire, et lib/familles.ts
                comme ServicesRows l ecrivent en toutes lettres. Une page qui
                affirmerait le contraire se contredirait a un clic d ici. Le
                partenaire n est PAS nomme : c est une decision fermee du
                projet, et elle vaut dans les deux langues. */}
            <p>
              One exception, and it is written down: social media production is
              done with a production partner of the studio. The calendar, the
              replies and the finished work stay on my side — you have only one
              conversation to follow.
            </p>
            <p>
              A year after going live, the address to write to has not changed,
              and neither has the person behind it. A price that moves, a poster
              for when September comes round, one more question on the form: it
              is the same thread.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Comment ça se passe, du premier message à la mise en ligne ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(02)</span>&nbsp; How it runs
            </span>
            <div data-reveal>
              <h2 className="t">
                From the first message
                <br />
                to going live.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            Six moments, and only one asks anything of you — the second, and it
            is a conversation, not files.
          </p>

          {/* Les intitules sont des <h3> PORTANT .sm-grp, jamais des <h3> nus :
              sans regle propre, un h3 prend `font-size:inherit` du preflight
              Tailwind en production et la taille par defaut du navigateur en
              developpement — deux rendus differents pour le meme titre. */}
          <div className="studio-txt" data-reveal style={{ marginTop: 34 }}>
            <h3 className="sm-grp">The first message</h3>
            <p>
              WhatsApp, the phone, the form, or the assistant at the bottom of
              the screen. You say what you have and what is wrong with it; the
              message lands on my phone.
            </p>

            <h3 className="sm-grp">The stocktake</h3>
            {/* « On regarde ensemble » ⇒ « I go through … with you » : meme
                idee de reciprocite, sans le `we` que le glossaire §2 interdit
                (voir la note plus haut). */}
            <p>
              I go through what is online today with you: the site, the Google
              listing, what a customer finds when they search for your trade in{" "}
              {VILLE}. You say what you want to receive — quotes, appointments,
              calls. It is the only moment where you have something to give, and
              it is given by talking.
            </p>

            <h3 className="sm-grp">Your go-ahead</h3>
            <p>
              The clock starts there, and nowhere else: one week, from the
              go-ahead to going live. You have nothing to prepare — I take the
              words from your current site, and I write the mockup if you are
              starting from nothing.
            </p>

            <h3 className="sm-grp">The mockup, early in the week</h3>
            <p>
              You see the before and the after. You approve it, or you ask for
              changes: two rounds of corrections are included, charged beyond
              that. The limit is written down before anything starts rather than
              discovered on the invoice.
            </p>

            <h3 className="sm-grp">Approval, then going live</h3>
            <p>
              The finished site is shown to you and approved. Payment happens on
              delivery, and going live follows. Domain, hosting, the form,
              online appointments: everything is wired up — you install nothing
              and you configure nothing.
            </p>

            <h3 className="sm-grp">The year after</h3>
            {/* « upkeep », jamais « maintenance » ni « support » (glossaire
                §3). Et la formule est NOMMEE plutot que categorisee (§6) :
                « compulsory with L'Assistant » vaut mieux que « with this
                package ». */}
            <p>
              The first year of hosting and domain name is included in the price
              of the site. From the second year, upkeep takes over: it is not
              picked from a menu, it follows from the package bought. With
              L&apos;Assistant it is compulsory — the assistant uses API calls
              every month, and without upkeep it stops.
            </p>

            <p style={{ marginTop: 30 }}>
              <a className="lnk" href={lien(LOCALE, "/services")}>
                See the packages and the prices →
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
              <span className="index">(03)</span>&nbsp; The trade
            </span>
            <div data-reveal>
              <h2 className="t">
                Six lines of work,
                <br />
                one pair of hands.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            The site is the way in, not the catalogue. Here is the rest — and it
            is the fact that one person holds all of it that makes the argument.
          </p>

          <ul className="prest-inc" data-reveal style={{ marginTop: 34 }}>
            <li>
              Websites — a rebuild or a start from nothing, an enquiry form,
              online appointments, a priced quote, an assistant.
            </li>
            <li>
              Identity — a logotype, colours, typefaces, and the files to use
              them with.
            </li>
            <li>
              Print — business cards, posters, window stickers, restaurant
              menus, ready for the printer.
            </li>
            <li>
              Photography — your premises, your team, your products: for the
              site as much as for the Google listing.
            </li>
            <li>
              Google listing — photos, exact opening hours, the area you cover,
              replies to reviews.
            </li>
            <li>
              Social media — the month&apos;s calendar, the images, the words,
              the posting. Produced with a production partner of the studio, and
              delivered by me.
            </li>
          </ul>

          <div className="studio-txt" data-reveal style={{ marginTop: 34 }}>
            <p>
              This is not a list of skills, it is what makes the whole thing
              hold together. A business card that looks nothing like the site, a
              poster whose typeface belongs to nothing: that is what happens
              when every piece is ordered somewhere different. Here they
              resemble each other because they come out of the same place.
            </p>
            <p>
              <a className="lnk" href={lien(LOCALE, "/services")}>
                See the whole catalogue →
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
              <span className="index">(04)</span>&nbsp; The scope
            </span>
            <div data-reveal>
              <h2 className="t">
                What I
                <br />
                do not take on.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            A page that can refuse nothing says nothing. These four go
            elsewhere, and I say so on the first message rather than at the
            third meeting.
          </p>

          <ul className="prest-inc" data-reveal style={{ marginTop: 34 }}>
            <li>
              Online shops. Stock, payments, returns, disputes: another trade,
              and another thing to keep running.
            </li>
            <li>
              Tenders, large accounts and public bodies. The procedures and the
              payment terms do not go with a one-person studio.
            </li>
            <li>
              Companies that already have developers. They build their site
              themselves, better and for less.
            </li>
            <li>
              Half-day emergencies. It is one week from the go-ahead to going
              live, and it holds because it is not shorter.
            </li>
          </ul>

          <div className="studio-txt" data-reveal style={{ marginTop: 34 }}>
            <p>
              Refusing is not a pose. A one-person studio that accepts
              everything stops holding any of its dates, and it is the next
              customer who pays for the delay.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- La seule preuve que le visiteur peut vérifier lui-même ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(05)</span>&nbsp; The demonstration
            </span>
            <div data-reveal>
              <h2 className="t">
                The product runs
                <br />
                on this screen.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              The third package is called L&apos;Assistant, and it is not
              described here: it runs on this site. The button at the bottom of
              the screen opens it. Ask it about a service or a price — it
              answers with the catalogue and the rates read from this
              site&apos;s database, not with generalities.
            </p>
            <p>
              The rest of the product is behind it: when the conversation ends,
              the enquiry lands on my phone, and I find it again in a dashboard
              with what was said and the number left behind. That is exactly
              what would be installed at your place, with your services and your
              rates instead of mine.
            </p>
            <p>
              So for that one you have nobody to take at their word. It is at
              the bottom of the screen, and you can catch it out yourself.
            </p>
          </div>

          {/* Un VRAI LIEN vers /en/devis, et non une interception de clic : il
              fonctionne sans JavaScript, et la page d arrivee ouvre
              l assistant — c est-a-dire, ici, la piece dont la section vient de
              parler. Le sujet `devis-studio` est un IDENTIFIANT : il ne se
              traduit pas, il part en base (Lead.subject) et lib/devis.ts sait
              le resoudre dans les deux langues. */}
          <div className="c-row" data-reveal>
            <a className="btn" href={lien(LOCALE, "/devis?p=devis-studio")}>
              Ask for a quote <span className="ar">→</span>
            </a>
            <a className="btn btn-line" href={lien(LOCALE, "/services")}>
              See the packages
            </a>
          </div>
        </div>
      </section>

      {/* L index du pied de page suit la derniere section de CETTE page :
          cinq sections (01) a (05), donc le contact porte (06). Le defaut
          « 07 » du composant est celui de l accueil, qui compte sept sections.
          `locale` fait descendre l anglais dans le pied de page ET dans le
          formulaire qu il embarque. */}
      <FooterContact indexSection="06" locale={LOCALE} />
    </>
  );
}
