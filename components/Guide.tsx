import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import FooterContact from "@/components/FooterContact";
import SchemaPage, { type QuestionReponse } from "@/components/SchemaPage";
import {
  AUTEUR,
  CHEMIN_GUIDES,
  cheminGuide,
  dateLisible,
  guide,
} from "@/lib/guides";
import { CHEMIN_METIERS } from "@/lib/metiers";
import {
  CONTACT,
  NAP_CONFIRME,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  alternatesPage,
  jsonLd,
  openGraphPage,
} from "@/lib/site";

/**
 * L OSSATURE COMMUNE DES GUIDES (/guides/<slug>) — une seule, pour que les
 * quatre pages se lisent et s extraient de la meme facon.
 *
 * L ORDRE EST CELUI QUE LISENT LES MOTEURS DE REPONSE : le h1, puis la
 * reponse directe en 40 a 60 mots (le paragraphe qu un assistant de recherche
 * cite tel quel), puis l auteur et la date, puis le sommaire, puis les
 * sections dont chaque h2 est une question formulee comme la poserait un
 * patron. La FAQ termine, rendue en <details> comme celle de l accueil, et
 * declaree en `FAQPage` A PARTIR DU MEME TABLEAU (components/SchemaPage.tsx) :
 * une reponse balisee qui ne serait pas a l ecran est une declaration fausse.
 *
 * TROIS DONNEES STRUCTUREES : `BreadcrumbList` + `FAQPage` (un seul @graph,
 * par SchemaPage) et `Article`, ici. L auteur et l editeur reprennent les
 * `@id` de components/SchemaStudio.tsx : le site ne declare qu un Ayoub
 * Bensalem et qu un studio. Le telephone, l e-mail et la localite de
 * l editeur ne partent que si `NAP_CONFIRME` (lib/site.ts) le permet.
 *
 * UN SEUL BOUTON PLEIN EN FIN DE GUIDE, VERS /demonstrations : le lecteur d un
 * guide veut d abord voir l assistant sur son metier ; /devis (qui ouvre Leo)
 * reste le lien secondaire.
 *
 * PAS DE next/link (decision B7), `data-reveal` comme le reste du site.
 */

/** Les metadonnees d un guide : titre, description, canonique, Open Graph. */
export function metadataGuide(slug: string): Metadata {
  const g = guide(slug);
  const chemin = cheminGuide(slug);
  return {
    title: { absolute: g.seoTitre },
    description: g.seoDescription,
    // Pas de jumelle anglaise : `alternatesPage` ne declare que la canonique,
    // sans hreflang, pour un chemin absent de CHEMINS_TRADUITS (lib/i18n.ts).
    alternates: alternatesPage(chemin),
    openGraph: {
      ...openGraphPage({ titre: `${g.seoTitre} — ${SITE_NAME}`, description: g.seoDescription, chemin }),
      type: "article",
      publishedTime: g.publie,
      modifiedTime: g.misAJour,
      authors: [`${SITE_URL}${AUTEUR.chemin}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${g.seoTitre} — ${SITE_NAME}`,
      description: g.seoDescription,
    },
  };
}

/** L `Article` JSON-LD d un guide. */
function schemaArticle(slug: string) {
  const g = guide(slug);
  const url = `${SITE_URL}${cheminGuide(slug)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: g.titre,
    description: g.seoDescription,
    inLanguage: "fr-CH",
    datePublished: g.publie,
    dateModified: g.misAJour,
    image: OG_IMAGE,
    mainEntityOfPage: { "@type": "WebPage", "@id": url, url },
    isPartOf: { "@type": "CollectionPage", "@id": `${SITE_URL}${CHEMIN_GUIDES}`, url: `${SITE_URL}${CHEMIN_GUIDES}` },
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#ayoub`,
      name: AUTEUR.nom,
      jobTitle: "Fondateur de Nawa Corps",
      url: `${SITE_URL}${AUTEUR.chemin}`,
    },
    // Le MEME type que le noeud `/#studio` de l accueil (SchemaStudio) : un
    // `@id` qui porte deux types differents selon la page se lit comme deux
    // entites. ProfessionalService est une Organization, donc un editeur valide.
    publisher: {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#studio`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/nawa-corps-logo-principal-transparent.png`,
      },
      ...(NAP_CONFIRME
        ? {
            email: CONTACT.email,
            telephone: CONTACT.telephone,
            address: {
              "@type": "PostalAddress",
              addressLocality: CONTACT.ville,
              addressRegion: CONTACT.region,
              addressCountry: CONTACT.pays,
            },
          }
        : {}),
    },
  };
}

/** Une section du guide : un h2 formule en question, et son contenu. */
export function Partie({ id, titre, children }: { id: string; titre: string; children: ReactNode }) {
  return (
    <div className="gd-bloc" id={id} data-reveal>
      <h2>{titre}</h2>
      {children}
    </div>
  );
}

/** Un tableau qui defile seul sur telephone, jamais la page entiere. */
export function Tableau({ legende, children }: { legende: string; children: ReactNode }) {
  return (
    <div className="gd-table" role="region" aria-label={legende} tabIndex={0}>
      <table>
        <caption>{legende}</caption>
        {children}
      </table>
    </div>
  );
}

export default function GuidePage({
  slug,
  h1,
  reponse,
  sommaire,
  questions,
  lies,
  children,
}: {
  slug: string;
  /** Le h1 en lignes courtes (Interactions.tsx le decoupe sur les <br />). */
  h1: readonly string[];
  /** La reponse directe, 40 a 60 mots, juste sous le h1. */
  reponse: string;
  sommaire: readonly { id: string; titre: string }[];
  questions: readonly QuestionReponse[];
  /** Deux ou trois autres guides, par slug. */
  lies: readonly string[];
  children: ReactNode;
}) {
  const g = guide(slug);
  const autres = lies.map((s) => guide(s));

  return (
    <>
      <SchemaPage
        fil={[
          { nom: "Accueil", chemin: "/" },
          { nom: "Guides", chemin: CHEMIN_GUIDES },
          { nom: g.titre, chemin: cheminGuide(slug) },
        ]}
        questions={questions}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schemaArticle(slug)) }}
      />

      {/* ---------- En-tete : h1, reponse directe, auteur, date ---------- */}
      <section className="gd-hero">
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <a className="lnk" href={CHEMIN_GUIDES}>Guides</a>
              {"  ·  Genève, Suisse romande"}
            </span>
            <div data-reveal>
              <h1 className="t">
                {/* Des fragments, pas des <span> : Interactions.tsx ne coupe que
                    sur un <br /> enfant DIRECT du titre. */}
                {h1.map((ligne, i) => (
                  <Fragment key={ligne}>
                    {i > 0 && <br />}
                    {ligne}
                  </Fragment>
                ))}
              </h1>
            </div>
          </div>
          <p className="lede gd-reponse" data-reveal>
            {reponse}
          </p>
          <p className="gd-auteur" data-reveal>
            {"Par "}
            <a className="lnk" href={AUTEUR.chemin}>{AUTEUR.nom}</a>
            {`, ${AUTEUR.role}. Mis à jour le `}
            <time dateTime={g.misAJour}>{dateLisible(g.misAJour)}</time>.
          </p>
          <nav className="gd-sommaire" aria-label="Sommaire du guide" data-reveal>
            <p className="meta">Dans ce guide</p>
            <ol>
              {sommaire.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.titre}</a>
                </li>
              ))}
              <li>
                <a href="#questions">Questions fréquentes</a>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* ---------- Le corps ---------- */}
      <section className="gd-sec">
        <div className="wrap">
          <article className="gd-corps">{children}</article>
        </div>
      </section>

      {/* ---------- FAQ : la meme liste que le FAQPage ---------- */}
      <section className="faq gd-sec" id="questions">
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              Questions fréquentes
            </span>
            <h2 className="sr-only">Questions fréquentes</h2>
          </div>
          <div data-reveal>
            {questions.map((item) => (
              <details key={item.q}>
                <summary>
                  {item.q}
                  <span className="pl2">+</span>
                </summary>
                <p className="a">{item.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- A lire aussi, puis la demo ---------- */}
      <section className="gd-sec gd-fin">
        <div className="wrap">
          <div className="gd-lies" data-reveal>
            <p className="meta">À lire aussi</p>
            <ul>
              {autres.map((a) => (
                <li key={a.slug}>
                  <a className="lnk" href={cheminGuide(a.slug)}>{a.titre}</a>
                </li>
              ))}
              <li>
                <a className="lnk" href={CHEMIN_METIERS}>L&apos;assistant, métier par métier</a>
              </li>
              <li>
                <a className="lnk" href="/services">L&apos;offre en détail : ce que vous payez, et quand</a>
              </li>
            </ul>
          </div>
          <div className="sec-head" style={{ marginTop: "clamp(56px,7vw,96px)" }}>
            <div data-reveal>
              <h2 className="t">
                Le plus simple :
                <br />
                le voir travailler.
              </h2>
            </div>
          </div>
          <div className="sm-devis" data-reveal>
            <p>
              Nous vous montrons l&apos;assistant sur des demandes de votre métier. Vous n&apos;avez rien
              à préparer, et nous n&apos;avons accès à aucun de vos outils. Puis, si vous le voulez,
              deux semaines d&apos;essai sur vos vraies demandes, avec un relevé chaque lundi.
            </p>
          </div>
          <div className="c-row" data-reveal style={{ marginTop: 34 }}>
            <a className="btn" href="/demonstrations">
              {"Voir la démo sur mon métier "}
              <span className="ar">→</span>
            </a>
            <a className="btn btn-line" href="/devis">
              Demander ma démo
            </a>
          </div>
        </div>
      </section>

      <FooterContact indexSection="01" locale="fr" />
    </>
  );
}
