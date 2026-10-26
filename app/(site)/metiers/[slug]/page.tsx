import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoMetier from "@/components/DemoMetier";
import Detail from "@/components/Detail";
import FooterContact from "@/components/FooterContact";
import SchemaPage from "@/components/SchemaPage";
import {
  avecPrix,
  lireCentsMiseEnPlace,
  lireMiseEnPlace,
  offreMiseEnPlace,
} from "@/lib/catalogue";
import { LANGUE_HTML, type Locale, lien } from "@/lib/i18n";
import { CHEMIN_DEMONSTRATIONS, TEXTES_DEMONSTRATIONS } from "@/lib/automatisations";
import { cheminGuide } from "@/lib/guides";
import { MENTION_REPONSE, MENTION_REPONSE_EN } from "@/lib/mentions";
import {
  CHEMIN_METIERS,
  TEXTES_METIERS,
  cheminMetier,
  metiersVoisins,
  trouverMetier,
} from "@/lib/metiers";
import {
  SITE_NAME,
  SITE_URL,
  alternatesPage,
  jsonLd,
  openGraphPage,
} from "@/lib/site";

/**
 * /metiers/<slug> — « Assistant IA pour … à Genève », une page par metier,
 * generee depuis lib/metiers.ts (decision d Ayoub du 25.10.2026 : le site
 * parle a toutes les PME qui veulent l assistant).
 *
 * LE GABARIT EST CELUI DE L ANCIENNE /sanitaire-chauffage-geneve, sans une
 * regle CSS nouvelle : `.sec-head`, `.steps/.stp`, `.sm-devis`, `.c-row`, et
 * la FAQ de l accueil (`.faq details`). Cette ancienne adresse redirige ici
 * (next.config.ts).
 *
 * L ORDRE : la reponse directe (h1, chapo, CTA), (01) les douleurs dans les
 * mots du metier, (02) ce que l assistant PEUT faire, (03) l exemple de
 * demonstration (fictif, et dit comme tel), suivi d un lien vers les deux
 * exemples du metier sur /demonstrations, (04) le controle, dit en une
 * phrase propre au metier, (05) la demo et le prix en deux phrases, chacun
 * avec un lien vers /services qui porte le detail commun, (06) les questions
 * du metier et les metiers voisins, puis le pied. En francais, (04), (05) et
 * (06) portent chacun un lien vers le guide qui repond a leur question
 * (nLPD, prix, automatisation) : les guides n etaient lies que depuis
 * /guides et l accueil (audit SEO v5).
 *
 * CE QUI SE LIT SANS CLIQUER (26.10.2026, « trop long à lire ») : en tete la
 * premiere phrase du chapo, la suite dans un detail ; en (01) et
 * (02) les titres seuls, leur texte dans « Voir le détail » (la tache du
 * telephone garde visible son etiquette « Palier Complet ») ; en (03) la
 * demande fictive, ses quatre etapes dans un detail ; en (06) quatre
 * questions, les autres dans « Autres questions ». Rien n est supprime : les
 * blocs fermes restent dans le HTML (components/Detail.tsx).
 *
 * PAS DE generateStaticParams, ET C EST VOULU. La page lit le montant de la
 * mise en place dans Postgres (lib/catalogue.ts) : elle est donc rendue a la
 * requete (`force-dynamic`), comme l accueil et /services — la mesure qui
 * l a tranche est en tete de app/(site)/page.tsx, et l etage builder du
 * Dockerfile n a pas de base. Un generateStaticParams ne prerendrait rien ici.
 * Un slug inconnu rend le 404 du site (`notFound()`).
 *
 * UN SEUL MONTANT, LU EN BASE, avec sa mention de TVA dans la meme phrase
 * (`avecPrix`) et dans l Offer JSON-LD (`offreMiseEnPlace`). L abonnement n a
 * aucun montant ; l essai dure deux semaines.
 *
 * CE FICHIER REND DEUX PAGES : `corpsMetier(locale, slug)` est appele par
 * cette route et par /en/metiers/[slug]. PAS DE next/link (decision B7).
 */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

/** Metadonnees d une page metier, dans la langue demandee. */
export function metadataMetier(locale: Locale, slug: string): Metadata {
  const metier = trouverMetier(slug);
  if (!metier) return {};
  const t = metier[locale];
  const chemin = cheminMetier(slug);
  const titreComplet = `${t.seoTitre} — ${SITE_NAME}`;
  return {
    // `absolute` : chaque titre tient ses 60 signes sans le suffixe du
    // `template` (verifie dans lib/metiers.ts).
    title: { absolute: t.seoTitre },
    description: t.seoDescription,
    alternates: alternatesPage(chemin, locale),
    openGraph: openGraphPage(
      { titre: titreComplet, description: t.seoDescription, chemin },
      locale,
    ),
    // Redeclare en entier : la fusion des metadata ne descend pas dans les objets.
    twitter: {
      card: "summary_large_image",
      title: titreComplet,
      description: t.seoDescription,
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return metadataMetier("fr", slug);
}

/** Une section numerotee : meta « (0n) libelle » puis h2 sur deux lignes. */
function Entete({
  rang,
  meta,
  h2,
}: {
  rang: string;
  meta: string;
  h2: readonly [string, string];
}) {
  return (
    <div className="sec-head">
      {/* Un seul noeud texte : deux noeuds adjacents feraient intercaler un
          `<!-- -->` par React. */}
      <span className="meta" data-reveal>
        <span className="index">({rang})</span>
        {`  ${meta}`}
      </span>
      <div data-reveal>
        <h2 className="t">
          {h2[0]}
          <br />
          {h2[1]}
        </h2>
      </div>
    </div>
  );
}

/**
 * Une grille d etapes, le gabarit `.steps` de /services — LES TITRES SEULS,
 * le texte de chaque etape dans « Voir le détail » (26.10.2026, « trop long à
 * lire ») : les titres font la liste courte, le detail reste dans le HTML et
 * s ouvre d un clic. `phrase` : la phrase qui reste visible sous la grille,
 * au-dessus du bouton. `suite` : un dernier paragraphe range dans le detail
 * (les chiffres sources des douleurs).
 */
function Etapes({
  items,
  libelle,
  phrase,
  suite,
  telephone,
}: {
  items: readonly { titre: string; texte: string }[];
  libelle: string;
  phrase?: string;
  suite?: string;
  telephone?: { tag: string; note: string };
}) {
  return (
    <>
      <div className="steps">
        {items.map((item, i) => (
          <div className="stp" data-reveal key={item.titre}>
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            {/* LE TELEPHONE DIT SON PALIER, MEME REPLIE : la tache dont le
                texte cite le palier Complet porte l etiquette a cote de son
                titre (comme le schema de /demonstrations), la phrase entiere
                pour le lecteur d ecran et au survol. */}
            {telephone && item.texte.toLowerCase().includes(telephone.tag.toLowerCase()) && (
              <span className="t" title={telephone.note}>
                {telephone.tag}
                <span className="sr-only">{` — ${telephone.note}`}</span>
              </span>
            )}
            <h3>{item.titre}</h3>
          </div>
        ))}
      </div>
      <div className="sm-devis" data-reveal>
        {phrase && <p>{phrase}</p>}
        <Detail libelle={libelle}>
          {items.map((item) => (
            <p key={item.titre}>
              <strong>{item.titre}</strong> {item.texte}
            </p>
          ))}
          {suite && <p>{suite}</p>}
        </Detail>
      </div>
    </>
  );
}

/** Le nombre de questions du metier visibles sans cliquer (26.10.2026). */
const FAQ_VISIBLES = 4;

/** Une question du metier : le <details> natif de la FAQ de l accueil. */
function Question({ q, r }: { q: string; r: string }) {
  return (
    <details>
      <summary>
        {q}
        <span className="pl2">+</span>
      </summary>
      <p className="a">{r}</p>
    </details>
  );
}

/**
 * Le bouton unique de la page : « Voir la démo sur mon métier → » vers les
 * exemples de CE métier sur /demonstrations (decision d Ayoub du 25.10.2026 :
 * « voir la démo » montre la démo ; Leo ne s ouvre que sur « Demander ma
 * démo », la pastille de la nav et la fin de /demonstrations).
 */
function BoutonDemo({ locale, slug, style }: { locale: Locale; slug: string; style?: React.CSSProperties }) {
  return (
    <div className="c-row" data-reveal style={style}>
      <a className="btn" href={lien(locale, `/demonstrations#${slug}`)}>
        {TEXTES_METIERS[locale].demo.cta}
        <span className="ar">→</span>
      </a>
    </div>
  );
}

/**
 * LE CORPS D UNE PAGE METIER — appele par cette route (fr) et par
 * /en/metiers/[slug] (en).
 */
export async function corpsMetier(locale: Locale, slug: string) {
  const metier = trouverMetier(slug);
  if (!metier) notFound();

  const t = metier[locale];
  const c = TEXTES_METIERS[locale].page;
  const chemin = cheminMetier(slug);
  const url = `${SITE_URL}${lien(locale, chemin)}`;

  const [montant, cents] = await Promise.all([
    lireMiseEnPlace(),
    lireCentsMiseEnPlace(),
  ]);
  const prix = montant ? avecPrix(c.prixAvec, montant, locale) : c.prixSans;
  const voisins = metiersVoisins(slug);
  const offre = offreMiseEnPlace(cents, locale, c.offreNom);

  /**
   * LE CHAPO EN DEUX : la premiere phrase se lit, la suite se deplie. Chaque
   * chapo de lib/metiers.ts ouvre sur « Nawa Corps … qui connaît déjà leur
   * métier. » ; sans point suivi d un blanc, tout reste visible.
   */
  const coupe = t.chapo.match(/^(.+?[.!?])\s+([\s\S]+)$/);
  const chapoCourt = coupe ? coupe[1] : t.chapo;
  const chapoSuite = coupe ? coupe[2] : null;

  /**
   * LE SERVICE EN DONNEE STRUCTUREE, rattache au studio (`/#studio`), zone
   * desservie : Geneve, ecrite `CONTACT.ville` dans les deux langues (NAP,
   * lib/site.ts). L Offer porte la mention de TVA (lib/catalogue.ts).
   */
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: t.seoTitre,
    serviceType: t.serviceType,
    description: t.chapo,
    inLanguage: LANGUE_HTML[locale],
    provider: { "@id": `${SITE_URL}/#studio` },
    areaServed: { "@type": "City", name: "Genève" },
    url,
    ...(offre ? { offers: offre } : {}),
  };

  return (
    <>
      {/* BreadcrumbList + FAQPage : les questions du metier, telles qu affichees. */}
      <SchemaPage
        fil={[
          { nom: c.fil.accueil, chemin: lien(locale, "/") },
          { nom: c.fil.metiers, chemin: lien(locale, CHEMIN_METIERS) },
          { nom: t.nom, chemin: lien(locale, chemin) },
        ]}
        questions={t.faq}
        locale={locale}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(service) }}
      />

      {/* ---------- En-tete : la reponse directe ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              {t.meta}
            </span>
            <div data-reveal>
              <h1 className="t">
                {t.h1[0]}
                <br />
                {t.h1[1]}
              </h1>
            </div>
          </div>
          {/* Le chapo entier reste la description du Service JSON-LD ; a l ecran,
              sa premiere phrase (qui, quoi, ou), la suite dans le detail. */}
          <p className="lede" data-reveal>
            {chapoCourt}
          </p>
          {chapoSuite && (
            <div data-reveal>
              <Detail libelle={c.detail}>
                <p className="lede">{chapoSuite}</p>
              </Detail>
            </div>
          )}
          <BoutonDemo locale={locale} slug={metier.slug} style={{ marginTop: 34 }} />
          <p className="meta" data-reveal style={{ marginTop: "1.6em" }}>
            {locale === "en" ? MENTION_REPONSE_EN : MENTION_REPONSE}
          </p>
        </div>
      </section>

      {/* ---------- (01) Les douleurs, dans les mots du metier ---------- */}
      <section>
        <div className="wrap">
          <Entete rang="01" meta={c.douleursMeta} h2={t.douleurs.h2} />
          {/* Les chiffres sources, chacun avec sa source, ranges dans le
              detail ; absents s il n y en a pas. */}
          <Etapes items={t.douleurs.items} libelle={c.detail} suite={t.douleurs.sources} />
        </div>
      </section>

      {/* ---------- (02) Ce que l assistant peut faire ---------- */}
      <section>
        <div className="wrap">
          <Entete rang="02" meta={c.tachesMeta} h2={t.taches.h2} />
          <Etapes
            items={t.taches.items}
            libelle={c.detail}
            phrase={c.uneTache}
            telephone={{
              tag: TEXTES_DEMONSTRATIONS[locale].telephone,
              note: TEXTES_DEMONSTRATIONS[locale].telephoneNote,
            }}
          />
        </div>
      </section>

      {/* ---------- (03) L exemple de demonstration ----------
          Fictif, et dit comme tel par components/DemoMetier.tsx, dans ses
          deux formes : la courte se lit (le libelle, le canal, la demande),
          les quatre etapes sont dans le detail. */}
      <section>
        <div className="wrap">
          <Entete rang="03" meta={c.demoMeta} h2={c.demoH2} />
          <div className="sm-devis" data-reveal>
            <DemoMetier demo={t.demo} locale={locale} court />
          </div>
          {/* Hors de `.sm-devis` (74ch) : la grille des quatre etapes garde
              toute la largeur de la page. */}
          <div data-reveal>
            <Detail libelle={c.demoDetail}>
              <DemoMetier demo={t.demo} locale={locale} />
            </Detail>
          </div>
          {/* Deux autres exemples de ce metier, avec leur schema, sur
              /demonstrations : l ancre est le slug, l id de sa section. */}
          <p data-reveal style={{ marginTop: 22 }}>
            <a className="lnk" href={`${lien(locale, CHEMIN_DEMONSTRATIONS)}#${slug}`}>
              {TEXTES_DEMONSTRATIONS[locale].renvois.metier}
            </a>
          </p>
        </div>
      </section>

      {/* ---------- (04) Le controle ---------- */}
      <section>
        <div className="wrap">
          <Entete rang="04" meta={c.controleMeta} h2={c.controleH2} />
          {/* Une phrase dans les mots du metier ; la liste complete est sur
              /services#controle (audit v3, 3.7 : texte commun sous 25 %). */}
          <div className="sm-devis" data-reveal>
            <p>{t.controle}</p>
            <p style={{ marginTop: "1em" }}>
              <a className="lnk" href={`${lien(locale, "/services")}#controle`}>
                {c.controleLien}
              </a>
            </p>
            {/* Le guide nLPD, en francais seulement (lib/metiers.ts). */}
            {c.guideDonnees && (
              <p style={{ marginTop: "0.6em" }}>
                <a className="lnk" href={cheminGuide("ia-et-protection-des-donnees")}>
                  {c.guideDonnees}
                </a>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---------- (05) La demo et le prix ----------
          Seul endroit de la page qui porte un montant : la mise en place, lue
          en base, avec la mention de TVA dans la meme phrase. */}
      <section>
        <div className="wrap">
          <Entete rang="05" meta={c.prixMeta} h2={c.prixH2} />
          {/* Deux phrases et un lien : le parcours detaille et la grille sont
              sur /services#parcours. */}
          <div className="sm-devis" data-reveal>
            <p>{prix}</p>
            <p style={{ marginTop: "1em" }}>
              <a className="lnk" href={`${lien(locale, "/services")}#parcours`}>
                {c.prixLien}
              </a>
            </p>
            {c.guidePrix && (
              <p style={{ marginTop: "0.6em" }}>
                <a className="lnk" href={cheminGuide("prix-assistant-ia-suisse")}>
                  {c.guidePrix}
                </a>
              </p>
            )}
          </div>
          <BoutonDemo locale={locale} slug={metier.slug} style={{ marginTop: 34 }} />
        </div>
      </section>

      {/* ---------- (06) Questions du metier ----------
          Le gabarit de la FAQ de l accueil : <details> natif, aucun JS. */}
      <section className="faq" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(06)</span>
              {`  ${c.faqMeta}`}
            </span>
            <h2 className="sr-only">{c.faqTitreCache}</h2>
          </div>
          {/* QUATRE QUESTIONS EN VUE, les autres dans « Autres questions »
              (26.10.2026). Toutes restent dans la page, et `t.faq` entier part
              dans le FAQPage : le balisage decrit exactement ce que la page
              contient (components/SchemaPage.tsx). */}
          <div data-reveal>
            {t.faq.slice(0, FAQ_VISIBLES).map((item) => (
              <Question key={item.q} q={item.q} r={item.r} />
            ))}
            {t.faq.length > FAQ_VISIBLES && (
              <Detail libelle={c.autresQuestions}>
                {t.faq.slice(FAQ_VISIBLES).map((item) => (
                  <Question key={item.q} q={item.q} r={item.r} />
                ))}
              </Detail>
            )}
          </div>
          <div className="c-row" data-reveal>
            <a className="btn" href={lien(locale, `/demonstrations#${slug}`)}>
              {TEXTES_METIERS[locale].demo.cta}
              <span className="ar">→</span>
            </a>
            <a className="btn btn-line" href={lien(locale, CHEMIN_METIERS)}>
              {c.tousLesMetiers}
            </a>
          </div>
          {/* LES METIERS VOISINS ET /services (audit v3, 3.6) : la page n est
              plus un cul-de-sac. Des <a> classiques, jamais next/link. */}
          <p data-reveal style={{ marginTop: 34 }}>
            {c.voisins}
            {voisins.map((v, i) => (
              <span key={v.slug}>
                {i > 0 ? " · " : ""}
                <a className="lnk" href={lien(locale, cheminMetier(v.slug))}>
                  {v[locale].nom}
                </a>
              </span>
            ))}
            {" · "}
            <a className="lnk" href={lien(locale, "/services")}>
              {c.servicesLien}
            </a>
            {c.guideAutomatisation && (
              <>
                {" · "}
                <a className="lnk" href={cheminGuide("automatisation-ia-pme-geneve")}>
                  {c.guideAutomatisation}
                </a>
              </>
            )}
          </p>
        </div>
      </section>

      <FooterContact indexSection="07" locale={locale} />
    </>
  );
}

export default async function PageMetier({ params }: Props) {
  const { slug } = await params;
  return corpsMetier("fr", slug);
}
