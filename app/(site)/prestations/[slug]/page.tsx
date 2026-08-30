import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BoutonDevis from "@/components/BoutonDevis";
import FooterContact from "@/components/FooterContact";
import { CHF_UNIT, QUOTE_LABEL, formatChfAmount, isQuote } from "@/lib/format";
import {
  FORMULES,
  FORMULE_SLUGS,
  estFormule,
  inclus,
  manque,
} from "@/lib/formules";
import { chargerCatalogue } from "@/lib/catalogue";
import {
  CONTACT,
  SITE_NAME,
  SITE_URL,
  jsonLd,
  openGraphPage,
} from "@/lib/site";

/**
 * /prestations/<slug> — UNE PAGE PAR FORMULE DE SITE, et seulement pour les
 * trois formules.
 *
 * POURQUOI TROIS ET PAS DIX-HUIT : voir le docblock de lib/formules.ts. En
 * resume, dix-huit pages baties sur une ligne de base seraient du contenu
 * mince, et le contenu mince dessert le referencement au lieu de le servir.
 *
 * CE QUE CHAQUE PAGE PORTE, dans cet ordre : le nom et Genève dans le h1 ; ce
 * que la formule resout ; le prix, le delai et son point de depart ; ce qui est
 * inclus ; ce qui ne l est pas et vers quoi monter ; les questions propres a la
 * formule ; un CTA de devis.
 *
 * LE NOM, LA DESCRIPTION ET LE PRIX VIENNENT DE POSTGRES. Le reste — ce que la
 * formule resout, l echelle des fonctions, les questions — vit dans
 * lib/formules.ts. Aucun montant n est ecrit ici, ni a l ecran ni dans la
 * donnee structuree.
 *
 * DONNEE STRUCTUREE : un Service par page, dont le `provider` pointe vers
 * l @id que pose components/SchemaStudio.tsx sur l accueil. AUCUNE note, AUCUN
 * compteur d avis : il n existe aucun avis reel, et en Suisse la LCD (art. 3)
 * vise les indications trompeuses.
 */

// Meme raison qu app/(site)/page.tsx : la page lit Postgres, et `next build`
// tourne sans base joignable. force-dynamic empeche Next de tenter un
// prerendu qui ferait echouer la construction.
//
// `generateStaticParams` ci-dessous n est donc PAS un prerendu : sous
// force-dynamic elle ne sert qu a declarer les trois slugs legitimes. La
// mesure qui a fait renoncer a l ISR est consignee dans app/(site)/page.tsx.
export const dynamic = "force-dynamic";

/**
 * Les trois slugs, et rien d autre. La liste ne vient PAS de la base : ce sont
 * les trois pages qu on a decide d ecrire, pas toutes les lignes que la base
 * pourrait contenir un jour.
 */
export function generateStaticParams() {
  return FORMULE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/prestations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  // Un slug inconnu ne merite pas de metadonnees : la page qui suit repondra
  // notFound(). Renvoyer un objet vide laisse le layout fournir ses valeurs
  // par defaut le temps du 404.
  if (!estFormule(slug)) return {};

  const formule = FORMULES[slug];
  return {
    title: formule.seoTitre,
    description: formule.seoDescription,
    alternates: { canonical: `/prestations/${slug}` },
    // Le helper de lib/site.ts, importe tel quel : Next ne fusionne pas les
    // objets openGraph champ par champ, une page qui n en declare qu une
    // partie perdrait siteName, locale et type.
    openGraph: openGraphPage({
      titre: `${formule.seoTitre} — ${SITE_NAME}`,
      description: formule.seoDescription,
      chemin: `/prestations/${slug}`,
    }),
    // Meme raison qu au catalogue : sans bloc `twitter` propre, la page herite
    // de celui du layout, qui annonce encore « livré en 72 h » — un delai
    // interdit. La fusion des metadata ne descend pas dans les objets, il faut
    // donc le redeclarer en entier. L image reste celle du fichier
    // app/opengraph-image.
    twitter: {
      card: "summary_large_image",
      title: `${formule.seoTitre} — ${SITE_NAME}`,
      description: formule.seoDescription,
    },
  };
}

export default async function FormulePage({
  params,
}: PageProps<"/prestations/[slug]">) {
  const { slug } = await params;
  if (!estFormule(slug)) notFound();

  const formule = FORMULES[slug];

  /**
   * Les TROIS formules d un coup, pas seulement celle-ci : la page a besoin du
   * nom et du prix de la sienne, mais aussi du NOM des paliers superieurs pour
   * dire vers quoi monter — et ces noms vivent en base, pas ici.
   */
  const paliers = (await chargerCatalogue()).filter((s) =>
    estFormule(s.slug),
  );

  // Absent de la base, ou passe a visible:false depuis /admin : la page
  // n existe plus. Un 404 est la reponse honnete ; une page vide en serait une
  // mauvaise, pour le visiteur comme pour un moteur.
  const service = paliers.find((s) => s.slug === slug);
  if (!service) notFound();

  const nomDe = (autre: string) =>
    paliers.find((s) => s.slug === autre)?.name ?? null;

  // Les paliers superieurs encore publies. Un palier retire de la base
  // disparait du bloc « ce qui n est pas inclus » plutot que d y laisser un
  // nom vide et un lien mort.
  const superieurs = manque(slug)
    .map((bloc) => ({ ...bloc, nom: nomDe(bloc.slug) }))
    .filter((bloc): bloc is typeof bloc & { nom: string } => bloc.nom !== null);

  const surDevis = isQuote(service);
  const prixAffiche = surDevis
    ? QUOTE_LABEL
    : `${formatChfAmount(service.priceCents as number)}${CHF_UNIT}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/prestations/${slug}#formule`,
    name: service.name,
    description: service.description,
    serviceType: "Création et refonte de site web",
    url: `${SITE_URL}/prestations/${slug}`,
    // L @id pose par components/SchemaStudio.tsx sur l accueil. On ne
    // redeclare pas le studio ici : deux fiches du meme prestataire qui
    // divergeraient d un mot valent moins qu une seule, referencee.
    provider: { "@id": `${SITE_URL}/#studio` },
    areaServed: {
      "@type": "City",
      name: CONTACT.ville,
      address: {
        "@type": "PostalAddress",
        addressLocality: CONTACT.ville,
        addressRegion: CONTACT.region,
        addressCountry: CONTACT.pays,
      },
    },
    // Le prix REEL, lu en base et converti en francs. Une formule passee sur
    // devis n emet aucune offre chiffree plutot qu un zero.
    ...(surDevis
      ? {}
      : {
          offers: {
            "@type": "Offer",
            price: String(Math.round((service.priceCents as number) / 100)),
            priceCurrency: "CHF",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/prestations/${slug}`,
          },
        }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />

      {/* ---------- Le titre, ce que ça résout, le prix et le délai ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <a className="lnk" href="/prestations">
                Prestations
              </a>
            </span>
            <div data-reveal>
              <h1 className="t">
                {service.name} —<br />
                {formule.h1Suite}
              </h1>
            </div>
          </div>

          <p className="lede" data-reveal>
            {formule.resout}
          </p>

          {/* .facts : le meme bandeau de trois faits que la section « Le
              studio ». Le point de depart du delai y a sa propre colonne parce
              que c est LE differenciateur — les concurrents rapides comptent a
              partir du contenu fourni, pas a partir du oui. */}
          <div className="facts" data-reveal>
            <div>
              <b>{prixAffiche}</b>
              {/* Le libelle suit le type de prix lu en base : « TVA comprise »
                  sous un montant qui n existe pas serait faux, et c est
                  exactement le genre d indication que la LCD vise. */}
              <span>{surDevis ? "Périmètre à définir" : "TVA comprise"}</span>
            </div>
            <div>
              <b>Une semaine</b>
              <span>Délai de livraison</span>
            </div>
            <div>
              <b>Dès votre feu vert</b>
              <span>Départ du délai</span>
            </div>
          </div>
          <p className="sm-note" data-reveal>
            Prix en francs suisses, TVA comprise, sans frais cachés.
          </p>
        </div>
      </section>

      {/* ---------- Ce qui est inclus ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; Inclus
            </span>
            <div data-reveal>
              <h2 className="t">
                Ce que vous
                <br />
                recevez.
              </h2>
            </div>
          </div>
          <ul className="prest-inc" data-reveal>
            {inclus(slug).map((ligne) => (
              <li key={ligne}>{ligne}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Ce qui n'est pas inclus, et vers quoi monter ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(02)</span>&nbsp; Périmètre
            </span>
            <div data-reveal>
              <h2 className="t">
                Ce qui n&apos;est
                <br />
                pas inclus.
              </h2>
            </div>
          </div>
          <div className="prest-liste" data-reveal>
            {superieurs.length > 0 ? (
              superieurs.map((bloc) => (
                <div className="prest-palier" key={bloc.slug}>
                  <p className="sm-grp">Il faut monter à {bloc.nom}</p>
                  <ul className="prest-inc">
                    {bloc.lignes.map((ligne) => (
                      <li key={ligne}>{ligne}</li>
                    ))}
                  </ul>
                  <p style={{ marginTop: 16 }}>
                    <a className="lnk" href={`/prestations/${bloc.slug}`}>
                      Voir {bloc.nom} →
                    </a>
                  </p>
                </div>
              ))
            ) : (
              // Sommet de l echelle : plus rien a vendre au-dessus, mais des
              // prestations hors perimetre, toutes sur devis, toutes au
              // catalogue.
              <div className="prest-palier">
                <p className="sm-grp">Sur devis, au catalogue</p>
                <ul className="prest-inc">
                  {(formule.auDela ?? []).map((ligne) => (
                    <li key={ligne}>{ligne}</li>
                  ))}
                </ul>
                <p style={{ marginTop: 16 }}>
                  <a className="lnk" href="/prestations#en-complement">
                    Voir tout le catalogue →
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Les questions propres à la formule ---------- */}
      <section className="faq" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(03)</span>&nbsp; Questions
            </span>
            <div data-reveal>
              <h2 className="t">
                Ce qu&apos;on me
                <br />
                demande.
              </h2>
            </div>
          </div>
          {/* Depliage natif <details>/<summary>, sans une ligne de JS —
              identique a la FAQ de l accueil. */}
          <div data-reveal>
            {formule.questions.map((item) => (
              <details key={item.q}>
                <summary>
                  {item.q}
                  <span className="pl2">+</span>
                </summary>
                <p className="a">{item.r}</p>
              </details>
            ))}
          </div>

          {/* Le CTA de devis. BoutonDevis reste un <a href> vers WhatsApp :
              si le JS ne demarre jamais, le lien fonctionne encore ; sinon le
              clic ouvre l assistant, qui qualifie mieux. */}
          <div className="c-row" data-reveal>
            <BoutonDevis
              href={formule.amorce}
              sujet={formule.sujet}
              className="btn"
            >
              Demander un devis <span className="ar">→</span>
            </BoutonDevis>
            <a className="btn btn-line" href="/prestations">
              Toutes les prestations
            </a>
          </div>
        </div>
      </section>

      <FooterContact />
    </>
  );
}
