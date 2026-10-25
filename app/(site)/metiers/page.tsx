import type { Metadata } from "next";
import DemoMetier from "@/components/DemoMetier";
import FooterContact from "@/components/FooterContact";
import SchemaPage from "@/components/SchemaPage";
import { LANGUE_HTML, type Locale, lien } from "@/lib/i18n";
import { CHEMIN_DEMONSTRATIONS, TEXTES_DEMONSTRATIONS } from "@/lib/automatisations";
import { CHEMIN_METIERS, METIERS, TEXTES_METIERS, cheminMetier } from "@/lib/metiers";
import { SITE_NAME, SITE_URL, alternatesPage, jsonLd, openGraphPage } from "@/lib/site";

/**
 * /metiers — LE HUB DES METIERS (decision d Ayoub du 25.10.2026 : le site
 * parle a toutes les PME qui veulent l assistant, pas seulement aux
 * sanitaires).
 *
 * Une carte par metier, lue dans lib/metiers.ts : ce qui lui prend ses
 * soirees, ce que l assistant PEUT faire, l apercu de sa demonstration
 * (fictive, et dite comme telle par components/DemoMetier.tsx), et le lien
 * vers sa page. Puis la phrase « votre métier n'y est pas », et les metiers
 * exclus (secret professionnel), comme le prompt de Leo. Le bouton du bas
 * est double d un lien vers /demonstrations (25.10.2026) : deux exemples
 * d automatisation par metier, chacun avec son schema.
 *
 * AUCUN MONTANT ICI, donc aucune lecture en base : la page n a pas besoin de
 * `force-dynamic` pour passer le build sans Postgres.
 *
 * AUCUN DESIGN NOUVEAU : `.cat-grid` / `.cat-it` de /services. Les cartes sont
 * des <article>, pas des liens entiers : la carte porte du texte a lire, et un
 * seul lien, le sien.
 *
 * CE FICHIER REND DEUX PAGES : `corpsMetiers(locale)` est appele ici et par
 * /en/metiers. PAS DE next/link (decision B7).
 */

/** Metadonnees du hub, dans la langue demandee. */
export function metadataMetiers(locale: Locale): Metadata {
  const t = TEXTES_METIERS[locale].hub;
  const titreComplet = `${t.seoTitre} — ${SITE_NAME}`;
  return {
    title: { absolute: t.seoTitre },
    description: t.seoDescription,
    alternates: alternatesPage(CHEMIN_METIERS, locale),
    openGraph: openGraphPage(
      { titre: titreComplet, description: t.seoDescription, chemin: CHEMIN_METIERS },
      locale,
    ),
    twitter: {
      card: "summary_large_image",
      title: titreComplet,
      description: t.seoDescription,
    },
  };
}

export const metadata: Metadata = metadataMetiers("fr");

export function corpsMetiers(locale: Locale) {
  const t = TEXTES_METIERS[locale].hub;
  const fil = TEXTES_METIERS[locale].page.fil;

  /** La liste des pages metiers, en donnee structuree. */
  const liste = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.listeTitre,
    inLanguage: LANGUE_HTML[locale],
    itemListElement: METIERS.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m[locale].nom,
      url: `${SITE_URL}${lien(locale, cheminMetier(m.slug))}`,
    })),
  };

  return (
    <>
      <SchemaPage
        fil={[
          { nom: fil.accueil, chemin: lien(locale, "/") },
          { nom: fil.metiers, chemin: lien(locale, CHEMIN_METIERS) },
        ]}
        locale={locale}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(liste) }}
      />

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
          <p className="lede" data-reveal>
            {t.intro}
          </p>
          <div className="c-row" data-reveal style={{ marginTop: 34 }}>
            <a className="btn" href={lien(locale, "/demonstrations")}>
              {TEXTES_METIERS[locale].demo.cta}
              <span className="ar">→</span>
            </a>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cat-grid">
            {METIERS.map((m) => {
              const tm = m[locale];
              return (
                <article className="cat-it" data-reveal key={m.slug} id={m.slug}>
                  <h2 style={{ fontWeight: 550, fontSize: "1.05rem", lineHeight: 1.32 }}>
                    <a href={lien(locale, cheminMetier(m.slug))}>{tm.nom}</a>
                  </h2>
                  <p className="d">
                    <strong>{`${t.soirees} : `}</strong>
                    {tm.carte.soirees}
                  </p>
                  <p className="d">
                    <strong>{`${t.peut} : `}</strong>
                    {tm.carte.peut}
                  </p>
                  <DemoMetier demo={tm.demo} locale={locale} court />
                  <a className="go" href={lien(locale, cheminMetier(m.slug))}>
                    {t.lienCarte}
                  </a>
                </article>
              );
            })}
          </div>
          <div className="sm-devis" data-reveal>
            <p>{t.autre}</p>
            <p style={{ marginTop: "0.8em" }}>{t.exclus}</p>
          </div>
          <div className="c-row" data-reveal style={{ marginTop: 34 }}>
            <a className="btn" href={lien(locale, "/demonstrations")}>
              {TEXTES_METIERS[locale].demo.cta}
              <span className="ar">→</span>
            </a>
            <a className="btn btn-line" href={lien(locale, CHEMIN_DEMONSTRATIONS)}>
              {TEXTES_DEMONSTRATIONS[locale].renvois.hub}
            </a>
          </div>
        </div>
      </section>

      <FooterContact indexSection="01" locale={locale} />
    </>
  );
}

export default function Metiers() {
  return corpsMetiers("fr");
}
