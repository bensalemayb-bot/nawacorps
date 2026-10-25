import type { Metadata } from "next";
import FooterContact from "@/components/FooterContact";
import SchemaAutomatisation from "@/components/SchemaAutomatisation";
import SchemaPage from "@/components/SchemaPage";
import {
  CHEMIN_DEMONSTRATIONS,
  TEXTES_DEMONSTRATIONS,
  exemplesDe,
  type Exemple,
} from "@/lib/automatisations";
import { dictionnaire } from "@/lib/dictionnaires";
import { LANGUE_HTML, type Locale, lien } from "@/lib/i18n";
import { METIERS, TEXTES_METIERS, cheminMetier } from "@/lib/metiers";
import { SITE_NAME, SITE_URL, alternatesPage, jsonLd, openGraphPage } from "@/lib/site";

/**
 * /demonstrations — DES EXEMPLES D AUTOMATISATION PAR METIER, chacun avec le
 * schema qui montre comment ca marche (demande d Ayoub du 25 octobre 2026,
 * mot pour mot : « quand on va dans démonstration je veux des exemples
 * d'automatisation par métier et si possible à côté une image qui montre
 * comment ça marche »).
 *
 * L ADRESSE REVIENT. Elle redirigeait vers l accueil depuis le 24 octobre
 * 2026, quand l ancienne page (cinq pieces graphiques et un carrousel) est
 * partie avec l ancienne offre. Elle porte maintenant l offre actuelle : ce
 * que l assistant peut faire, metier par metier. next.config.ts ne la
 * redirige plus, et elle est revenue au sitemap.
 *
 * L ORDRE : un en-tete court (h1, la regle du controle en une phrase, la
 * mention « demandes fictives »), une rangee d ancres vers les onze metiers,
 * puis une section par metier — dans l ordre et avec les slugs de
 * lib/metiers.ts, qui reste la source des noms —, deux exemples chacun, le
 * texte a gauche et le schema a droite (dessous sur telephone), et le lien
 * vers la page du metier. Enfin un seul bouton, vers /devis.
 *
 * AUCUN MONTANT, AUCUN DELAI, donc aucune lecture en base : la page passe le
 * build sans Postgres. Les textes vivent dans lib/automatisations.ts, le
 * dessin dans components/SchemaAutomatisation.tsx et app/demonstrations.css.
 *
 * LES REVELATIONS sont celles du reste du site : `data-reveal` sur chaque
 * bloc, et `h1.t` / `h2.t` decoupes en lignes par Interactions.tsx. PAS DE
 * next/link (decision B7) : les ancres et les liens sont des `<a>`.
 *
 * CE FICHIER REND DEUX PAGES : `corpsDemonstrations(locale)` est appele ici et
 * par /en/demonstrations.
 */

/** Metadonnees de la page, dans la langue demandee. */
export function metadataDemonstrations(locale: Locale): Metadata {
  const t = TEXTES_DEMONSTRATIONS[locale];
  const titreComplet = `${t.seoTitre} — ${SITE_NAME}`;
  return {
    // `absolute` : le titre tient ses 60 signes sans le suffixe du `template`.
    title: { absolute: t.seoTitre },
    description: t.seoDescription,
    alternates: alternatesPage(CHEMIN_DEMONSTRATIONS, locale),
    openGraph: openGraphPage(
      { titre: titreComplet, description: t.seoDescription, chemin: CHEMIN_DEMONSTRATIONS },
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

export const metadata: Metadata = metadataDemonstrations("fr");

/** Un exemple : le texte en quatre temps a gauche, son schema a droite. */
function ExempleAutomatisation({ exemple, locale }: { exemple: Exemple; locale: Locale }) {
  const t = TEXTES_DEMONSTRATIONS[locale];
  const e = exemple[locale];
  return (
    <article className="dm-ex">
      <div className="dm-txt" data-reveal>
        <h3>{e.titre}</h3>
        {exemple.telephone && (
          <p className="dm-tel">
            <span className="sa-tag">{t.telephone}</span>
            {t.telephoneNote}
          </p>
        )}
        <dl className="dm-temps">
          <div>
            <dt>
              <span className="n">01</span>
              {t.etapes[0]}
            </dt>
            <dd>{e.arrive}</dd>
          </div>
          <div>
            <dt>
              <span className="n">02</span>
              {t.etapes[1]}
            </dt>
            <dd>
              <ul>
                {e.prepare.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>
              <span className="n">03</span>
              {t.etapes[2]}
            </dt>
            <dd>{e.valide}</dd>
          </div>
          <div>
            <dt>
              <span className="n">04</span>
              {t.etapes[3]}
            </dt>
            <dd>{e.part}</dd>
          </div>
        </dl>
      </div>
      <SchemaAutomatisation exemple={exemple} locale={locale} />
    </article>
  );
}

export function corpsDemonstrations(locale: Locale) {
  const t = TEXTES_DEMONSTRATIONS[locale];

  /** Les metiers qui ont leurs exemples, dans l ordre de lib/metiers.ts. */
  const sections = METIERS.flatMap((m) => {
    const exemples = exemplesDe(m.slug);
    return exemples ? [{ metier: m, exemples }] : [];
  });
  /** Le rang de la section finale suit le dernier metier : (12) pour onze metiers. */
  const rangFin = String(sections.length + 1).padStart(2, "0");

  /**
   * LE SOMMAIRE EN DONNEE STRUCTUREE (audit SEO v5) : un `ItemList` des
   * sections metier, chacune par son ancre — exactement la rangee d ancres
   * affichee en tete. La page la plus longue du site ne declarait qu un fil
   * d Ariane. PAS DE `HowTo` : les exemples sont fictifs, et un `HowTo`
   * decrirait comme une procedure reelle ce qui n est qu une illustration.
   */
  const urlPage = `${SITE_URL}${lien(locale, CHEMIN_DEMONSTRATIONS)}`;
  const sommaire = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.seoTitre,
    inLanguage: LANGUE_HTML[locale],
    itemListElement: sections.map(({ metier }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: metier[locale].nom,
      url: `${urlPage}#${metier.slug}`,
    })),
  };

  return (
    <>
      <SchemaPage
        fil={[
          { nom: t.fil.accueil, chemin: lien(locale, "/") },
          { nom: t.fil.page, chemin: lien(locale, CHEMIN_DEMONSTRATIONS) },
        ]}
        locale={locale}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(sommaire) }} />

      {/* ---------- En-tete ---------- */}
      <section className="dm-hero">
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
          <p className="lede" data-reveal>
            {t.intro}
          </p>
          {/* LA MENTION, EN TETE ET VISIBLE (LCD art. 3) ; chaque schema la
              rappelle dans sa legende. */}
          <p className="dm-mention" data-reveal>
            {t.mention}
          </p>
          {/* Les ancres vers les onze metiers : `#slug`, l id de chaque section.
              components/AncresPage.tsx (layout) les fait marcher sous le
              scroll inertiel. */}
          <nav className="dm-ancres" aria-label={t.ancres} data-reveal>
            <ul>
              {sections.map(({ metier }) => (
                <li key={metier.slug}>
                  <a href={`#${metier.slug}`}>{metier[locale].nom}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ---------- Une section par metier ---------- */}
      {sections.map(({ metier, exemples }, i) => (
        <section className="dm-metier" id={metier.slug} key={metier.slug}>
          <div className="wrap">
            <div className="sec-head">
              {/* Un seul noeud texte apres l index (voir /metiers/<slug>). */}
              <span className="meta" data-reveal>
                <span className="index">({String(i + 1).padStart(2, "0")})</span>
                {`  ${exemples.map((x) => x[locale].canal).join(" · ")}`}
              </span>
              <div data-reveal>
                <h2 className="t">{metier[locale].nom}</h2>
              </div>
            </div>
            {exemples.map((exemple) => (
              <ExempleAutomatisation exemple={exemple} locale={locale} key={exemple.id} />
            ))}
            <p className="dm-lien" data-reveal>
              <a className="lnk" href={lien(locale, cheminMetier(metier.slug))}>
                {t.lienMetier}
              </a>
            </p>
          </div>
        </section>
      ))}

      {/* ---------- La demo : le seul bouton de la page ---------- */}
      <section className="dm-fin">
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">({rangFin})</span>
              {`  ${t.finMeta}`}
            </span>
            <div data-reveal>
              <h2 className="t">
                {t.finH2[0]}
                <br />
                {t.finH2[1]}
              </h2>
            </div>
          </div>
          <div className="sm-devis" data-reveal>
            <p>{t.fin}</p>
            <p style={{ marginTop: "0.8em" }}>{TEXTES_METIERS[locale].hub.autre}</p>
          </div>
          <div className="c-row" data-reveal style={{ marginTop: 34 }}>
            {/* LA SEULE SORTIE DE CETTE PAGE OUVRE LEO : le visiteur a vu les
                exemples, il demande sa demo (/devis ouvre l assistant). */}
            <a className="btn" href={lien(locale, "/devis")}>
              {dictionnaire(locale).nav.devis}{" "}
              <span className="ar">→</span>
            </a>
          </div>
        </div>
      </section>

      <FooterContact indexSection={String(sections.length + 2).padStart(2, "0")} locale={locale} />
    </>
  );
}

export default function Demonstrations() {
  return corpsDemonstrations("fr");
}
