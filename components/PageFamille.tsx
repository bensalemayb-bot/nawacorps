import { notFound } from "next/navigation";
import SchemaPage from "@/components/SchemaPage";
import BoutonDevis from "@/components/BoutonDevis";
import FooterContact from "@/components/FooterContact";
import VignettePrestation from "@/components/VignettePrestation";
import { formatServicePrice, isQuote } from "@/lib/format";
import { type ServiceCatalogue, chargerCatalogue } from "@/lib/catalogue";
import {
  FAMILLES,
  type FamilleSlug,
  MENTION_DEVIS,
  MENTION_TVA,
  type Piece,
} from "@/lib/familles";
import { CONTACT, SITE_URL, jsonLd } from "@/lib/site";

/**
 * LE CORPS DES CINQ PAGES DE FAMILLE.
 *
 * POURQUOI UN COMPOSANT PARTAGE plutot que cinq pages ecrites cinq fois. Les
 * cinq segments ont exactement la meme ossature — celle de
 * app/(site)/services/[slug]/page.tsx, adaptee : un h1 avec Genève, ce que
 * la famille resout, le detail prestation par prestation avec son prix lu en
 * base et sa vignette, ce qui n est pas compris, les questions, le CTA de
 * devis. Ecrire cette ossature cinq fois garantissait qu une correction en
 * oublierait une, et c est exactement ce qui etait arrive au delai « 72 h »,
 * corrige sur deux pages sur trois.
 *
 * Ce que chaque page garde en propre : son `metadata`, son `force-dynamic` et
 * l import de app/services.css. Le reste — la matiere editoriale — vit dans
 * lib/familles.ts, et les noms, descriptions et prix viennent de Postgres.
 *
 * AUCUN MONTANT N EST ECRIT ICI. Les prix sont formates par lib/format.ts a
 * partir des centimes lus en base ; la donnee structuree convertit les memes
 * centimes. Corriger un prix en base le corrige a l ecran et dans le JSON-LD
 * du meme coup.
 */

/** Une prestation de la famille, appariee a sa ligne publiee en base. */
type PiecePubliee = { piece: Piece; service: ServiceCatalogue };

export default async function PageFamille({ slug }: { slug: FamilleSlug }) {
  const famille = FAMILLES[slug];

  /**
   * Le catalogue en entier, pas seulement les lignes de la famille : la page
   * a besoin du nom des FORMULES DE SITE pour dire de quel palier decoule un
   * abonnement, et ces noms vivent en base comme les autres.
   */
  const catalogue = await chargerCatalogue();

  /**
   * Une ligne absente de la base, ou passee a visible:false depuis /admin,
   * DISPARAIT de la page — elle n y laisse ni titre vide ni prix manquant.
   * C est le meme traitement que celui des paliers superieurs sur la page
   * d une formule.
   *
   * ET SI PLUS AUCUNE LIGNE N EST PUBLIEE, la page repond notFound(). Une
   * famille sans prestation visible n a rien a vendre : un 404 est la reponse
   * honnete, une page vide en serait une mauvaise — pour le visiteur comme
   * pour un moteur. La famille « Réseaux sociaux » ne compte qu une ligne :
   * la masquer en base ferme donc bien sa page, exactement comme un slug
   * masque ferme celle d une formule.
   */
  const pieces: PiecePubliee[] = famille.pieces.flatMap((piece) => {
    const service = catalogue.find((s) => s.slug === piece.slug);
    return service ? [{ piece, service }] : [];
  });
  if (pieces.length === 0) notFound();

  // Les deux mentions ne s affichent que si la page en a besoin. Une mention
  // de TVA sous une page ou aucun prix n est affiche serait fausse ; une
  // explication du devis sur une page entierement chiffree le serait aussi.
  const aDuDevis = pieces.some(({ service }) => isQuote(service));
  const aUnPrix = pieces.some(({ service }) => !isQuote(service));

  /** Le nom d une formule de site, lu en base. `null` si elle n est plus publiee. */
  const nomDe = (slugFormule: string) =>
    catalogue.find((s) => s.slug === slugFormule)?.name ?? null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services/${slug}#famille`,
    name: famille.libelle,
    description: famille.seoDescription,
    serviceType: famille.serviceType,
    url: `${SITE_URL}/services/${slug}`,
    // L @id pose par components/SchemaStudio.tsx sur l accueil. Le studio
    // n est pas redeclare ici : deux fiches du meme prestataire qui
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
    // AUCUNE note d avis, AUCUN compteur : il n existe aucun avis reel, et en
    // Suisse la LCD (art. 3) vise les indications trompeuses. Le catalogue
    // n emet que ce que la base contient.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: famille.libelle,
      itemListElement: pieces.map(({ service }) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
        // Une ligne sur devis n emet aucune offre chiffree plutot qu un zero.
        // `valueAddedTaxIncluded` dit ce que la grille dit deja : les prix
        // s entendent TVA comprise.
        ...(isQuote(service) || service.priceCents === null
          ? {}
          : {
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: String(Math.round(service.priceCents / 100)),
                priceCurrency: "CHF",
                valueAddedTaxIncluded: true,
                ...(service.isMonthly
                  ? { unitCode: "MON", unitText: "mois", billingIncrement: 1 }
                  : {}),
              },
            }),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <SchemaPage
        fil={[
          { nom: "Accueil", chemin: "/" },
          { nom: "Services", chemin: "/services" },
          { nom: famille.libelle, chemin: `/services/${slug}` },
        ]}
        questions={famille.questions}
      />

      {/* ---------- Le titre et ce que la famille résout ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <a className="lnk" href="/services">
                Services
              </a>
            </span>
            <div data-reveal>
              <h1 className="t">
                {famille.h1[0]}
                <br />
                {famille.h1[1]}
              </h1>
            </div>
          </div>

          <p className="lede" data-reveal>
            {famille.resout}
          </p>
        </div>
      </section>

      {/* ---------- Le détail, prestation par prestation ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; Le détail
            </span>
            <div data-reveal>
              <h2 className="t">
                Ce que ça
                <br />
                recouvre.
              </h2>
            </div>
          </div>

          <div>
            {pieces.map(({ piece, service }) => {
              const surDevis = isQuote(service);

              /**
               * Le lien entre un abonnement et la formule dont il decoule est
               * ecrit dans lib/familles.ts, mais les NOMS sont lus en base.
               * Une formule retiree du catalogue disparait donc de la phrase
               * plutot que d y laisser un nom mort — et si plus aucune n est
               * publiee, la phrase entiere s efface.
               */
              const formules = (piece.suitFormules ?? [])
                .map(nomDe)
                .filter((nom): nom is string => nom !== null);

              return (
                /* L `id` EST L ANCRE DU CATALOGUE, et il porte le slug de la
                   table Service. Les grilles de l accueil et de /services
                   pointent chaque ligne sur `/services/<famille>#<slug>` (cf.
                   `hrefService` dans lib/catalogue-familles.ts) : sans cet
                   attribut, le lien ouvrirait bien la page mais laisserait le
                   visiteur en chercher la prestation. C est un attribut, pas
                   une classe — la mise en page ne bouge pas. */
                <article
                  className="pf-piece"
                  id={service.slug}
                  data-reveal
                  key={service.id}
                >
                  <div className="pf-txt">
                    {/* Nom et description viennent de Postgres, jamais du
                        fichier editorial. */}
                    <h3 className="pf-piece-t">{service.name}</h3>
                    <p className="pf-piece-d">{service.description}</p>
                    <p className="pf-piece-quoi">{piece.quoi}</p>

                    <p className="sm-grp">Ce que vous recevez</p>
                    <ul className="prest-inc">
                      {piece.produit.map((ligne) => (
                        <li key={ligne}>{ligne}</li>
                      ))}
                    </ul>

                    <div className="pf-prix">
                      <b>{formatServicePrice(service)}</b>
                      {/* Le libelle suit le TYPE de prix lu en base :
                          « TVA comprise » sous un montant qui n existe pas
                          serait faux, et c est exactement le genre
                          d indication que la LCD vise. */}
                      <span>
                        {surDevis ? "Périmètre à définir" : "TVA comprise"}
                      </span>
                    </div>

                    {/* Pourquoi cette ligne se chiffre sur devis. Rendu
                        UNIQUEMENT si la base le dit encore : un prix ferme
                        pose en base fait disparaitre l explication au lieu de
                        contredire le montant juste au-dessus. */}
                    {surDevis && piece.raisonDevis ? (
                      <p className="pf-raison">{piece.raisonDevis}</p>
                    ) : null}

                    {/* Le prix mensuel impose s annonce AU POINT DE DECISION,
                        avec le mot « obligatoire », son point de depart et le
                        montant juste au-dessus. Un engagement recurrent passe
                        sous silence est un prix cache. */}
                    {formules.length > 0 ? (
                      <p className="pf-raison">
                        Ce suivi{" "}
                        {piece.obligatoire ? (
                          <>
                            est <strong>obligatoire</strong> avec
                          </>
                        ) : (
                          <>accompagne</>
                        )}{" "}
                        {formules.join(" et ")}. Il démarre la 2ᵉ année — la
                        première est comprise dans le prix du site.
                        {piece.obligatoire ? ` ${piece.obligatoire}` : null}
                      </p>
                    ) : null}
                  </div>

                  <VignettePrestation slug={service.slug} />
                </article>
              );
            })}
          </div>

          {aDuDevis ? (
            <p className="pf-note" data-reveal>
              {MENTION_DEVIS}
            </p>
          ) : null}
          {aUnPrix ? (
            <p className="pf-note" data-reveal>
              {MENTION_TVA}
            </p>
          ) : null}
        </div>
      </section>

      {/* ---------- Ce qui n'est pas compris ---------- */}
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
                pas compris.
              </h2>
            </div>
          </div>
          <div className="prest-liste pf-hors" data-reveal>
            <div className="prest-palier">
              <p className="sm-grp">Ailleurs au catalogue, ou nulle part</p>
              <ul className="prest-inc">
                {famille.horsPerimetre.map((hors) => (
                  <li key={hors.quoi}>
                    {hors.quoi} —{" "}
                    {hors.href ? (
                      <a className="lnk" href={hors.href}>
                        {hors.ou} →
                      </a>
                    ) : (
                      <em>{hors.ou}</em>
                    )}
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: 16 }}>
                <a className="lnk" href="/services">
                  Voir tout le catalogue →
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Les questions propres à la famille ---------- */}
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
              identique a la FAQ de l accueil et a celle des formules. */}
          <div data-reveal>
            {famille.questions.map((item) => (
              <details key={item.q}>
                <summary>
                  {item.q}
                  <span className="pl2">+</span>
                </summary>
                <p className="a">{item.r}</p>
              </details>
            ))}
          </div>

          {/* Le CTA de devis. BoutonDevis est un VRAI LIEN vers /devis : il
              fonctionne sans JavaScript, et la page d arrivee ouvre l assistant
              deja renseigne du sujet de cette famille. L amorce WhatsApp de la
              famille n a pas disparu — elle y sert de repli (lib/devis.ts). */}
          <div className="c-row" data-reveal>
            <BoutonDevis sujet={famille.sujet} className="btn">
              Demander un devis <span className="ar">→</span>
            </BoutonDevis>
            <a className="btn btn-line" href="/services">
              Tous les services
            </a>
          </div>
        </div>
      </section>

      {/* L index du pied de page suit la derniere section de CETTE page :
          trois sections (01) a (03) sur une page de famille, donc le contact porte (04).
          Le defaut "07" du composant est celui de l accueil, qui compte
          sept sections ; le laisser ici faisait sauter la numerotation
          sous les yeux du lecteur. */}
      <FooterContact indexSection="04" />
    </>
  );
}
