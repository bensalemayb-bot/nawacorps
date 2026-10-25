import type { Metadata } from "next";
import FooterContact from "@/components/FooterContact";
import SchemaPage from "@/components/SchemaPage";
import { CHEMIN_GUIDES, GUIDES, cheminGuide, dateLisible } from "@/lib/guides";
import { CHEMIN_METIERS } from "@/lib/metiers";
import { SITE_NAME, SITE_URL, alternatesPage, jsonLd, openGraphPage } from "@/lib/site";

/**
 * /guides — LE HUB DES GUIDES (25 octobre 2026). Une carte par guide, lue dans
 * lib/guides.ts : le titre, le resume en deux lignes, la date de mise a jour,
 * et un seul lien, le sien. Meme grille que /metiers (`.cat-grid` /
 * `.cat-it`), aucun design nouveau.
 *
 * FRANCAIS SEULEMENT : `alternatesPage` n annonce aucune jumelle anglaise.
 * AUCUN MONTANT, donc aucune lecture en base. PAS DE next/link (decision B7).
 */

const SEO_TITRE = "Guides : l'IA dans une PME genevoise";
const SEO_DESCRIPTION =
  "Guides pour patrons de PME genevoises : automatiser le bureau avec l'IA, assistant ou secrétaire, prix en Suisse, protection des données (nLPD).";

export const metadata: Metadata = {
  title: { absolute: SEO_TITRE },
  description: SEO_DESCRIPTION,
  alternates: alternatesPage(CHEMIN_GUIDES),
  openGraph: openGraphPage({
    titre: `${SEO_TITRE} — ${SITE_NAME}`,
    description: SEO_DESCRIPTION,
    chemin: CHEMIN_GUIDES,
  }),
  twitter: {
    card: "summary_large_image",
    title: `${SEO_TITRE} — ${SITE_NAME}`,
    description: SEO_DESCRIPTION,
  },
};

export default function Guides() {
  const liste = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Guides : l'IA dans une PME genevoise",
    inLanguage: "fr-CH",
    itemListElement: GUIDES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.titre,
      url: `${SITE_URL}${cheminGuide(g.slug)}`,
    })),
  };

  return (
    <>
      <SchemaPage
        fil={[
          { nom: "Accueil", chemin: "/" },
          { nom: "Guides", chemin: CHEMIN_GUIDES },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(liste) }} />

      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              Guides · Genève, Suisse romande
            </span>
            <div data-reveal>
              <h1 className="t">
                Guides : l&apos;IA dans
                <br />
                une PME genevoise
              </h1>
            </div>
          </div>
          <p className="lede" data-reveal>
            Ce qu&apos;un assistant IA peut reprendre au bureau, ce qu&apos;il coûte, ce qu&apos;il ne
            remplace pas, et ce que la loi suisse demande pour vos données. Écrit pour les patrons
            de PME, sans jargon, avec les sources.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cat-grid">
            {GUIDES.map((g) => (
              <article className="cat-it" data-reveal key={g.slug}>
                <h2 style={{ fontWeight: 550, fontSize: "1.05rem", lineHeight: 1.32 }}>
                  <a href={cheminGuide(g.slug)}>{g.titre}</a>
                </h2>
                <p className="d">{g.resume}</p>
                <p className="d">
                  Mis à jour le <time dateTime={g.misAJour}>{dateLisible(g.misAJour)}</time>
                </p>
                <a className="go" href={cheminGuide(g.slug)}>
                  {"Lire le guide "}
                  <span className="ar">→</span>
                </a>
              </article>
            ))}
          </div>
          <div className="sm-devis" data-reveal>
            <p>
              Par Ayoub Bensalem, fondateur de Nawa Corps, Genève. Chaque chiffre renvoie à sa source ;
              aucun n&apos;est un résultat de Nawa Corps.
            </p>
          </div>
          <div className="c-row" data-reveal style={{ marginTop: 34 }}>
            <a className="btn" href="/demonstrations">
              {"Voir la démo sur mon métier "}
              <span className="ar">→</span>
            </a>
            <a className="btn btn-line" href={CHEMIN_METIERS}>
              L&apos;assistant, métier par métier
            </a>
          </div>
        </div>
      </section>

      <FooterContact indexSection="—" locale="fr" />
    </>
  );
}
