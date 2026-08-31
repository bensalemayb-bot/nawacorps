import { notFound } from "next/navigation";
import SchemaPage from "@/components/SchemaPage";
import FooterContact from "@/components/FooterContact";
import VignettePrestation from "@/components/VignettePrestation";
import {
  formatServicePrice,
  isQuote,
  mentionTva,
  suffixeMensuel,
} from "@/lib/format";
import {
  type ServiceCatalogue,
  chargerCatalogue,
  descriptionService,
  nomService,
} from "@/lib/catalogue";
import { HREF_SERVICES, hrefFamille } from "@/lib/catalogue-familles";
import {
  FAMILLES,
  type FamilleSlug,
  MENTION_DEVIS,
  MENTION_DEVIS_EN,
  MENTION_TVA,
  MENTION_TVA_EN,
  type Piece,
} from "@/lib/familles";
import { type Locale, lien } from "@/lib/i18n";
import { CONTACT, SITE_URL, jsonLd } from "@/lib/site";

/**
 * LE CORPS DES CINQ PAGES DE FAMILLE, DANS LES DEUX LANGUES.
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
 * ET C EST CE QUI REND LA VERSION ANGLAISE PRESQUE GRATUITE : les dix pages
 * (cinq francaises, cinq anglaises) rendent CE fichier-ci, avec une locale de
 * plus. Deux corps separes auraient diverge au premier correctif, exactement
 * comme les cinq pages auraient diverge.
 *
 * Ce que chaque page garde en propre : son `metadata`, son `force-dynamic` et
 * l import de app/services.css. Le reste — la matiere editoriale — vit dans
 * lib/familles.ts, et les noms, descriptions et prix viennent de Postgres.
 *
 * AUCUN MONTANT N EST ECRIT ICI. Les prix sont formates par lib/format.ts a
 * partir des centimes lus en base ; la donnee structuree convertit les memes
 * centimes. Corriger un prix en base le corrige a l ecran et dans le JSON-LD
 * du meme coup.
 *
 * ---------------------------------------------------------------------------
 * LES TROIS REGLES DE LA BASCULE ANGLAISE, telles qu elles sont tenues ici.
 *
 *  1. LE REPLI EST TOUJOURS LE FRANCAIS — `piece.quoiEn ?? piece.quoi`. Une
 *     traduction manquante fait lire une phrase francaise, jamais un trou.
 *     C est la regle posee par lib/familles.ts et elle se decide ICI, chez le
 *     consommateur : ce fichier-la ne porte que de la matiere.
 *
 *  2. AUCUN PRIX SANS SA MENTION DE TVA, DANS LA MEME UNITE DE LECTURE, et
 *     dans la langue de la page. La mention vient de `mentionTva(locale)`
 *     (lib/format.ts) et n est PAS recopiee : elle a valeur legale, et
 *     « TVA comprise » sous un montant d une page anglaise est exactement le
 *     genre de detail que personne ne relit.
 *
 *  3. TOUS LES LIENS INTERNES PASSENT PAR `lien(locale, …)`, y compris le CTA
 *     de devis. Un lien ecrit en dur ramene le lecteur anglais sur une page
 *     francaise, ce qui est pire qu un lien absent : il a l air de marcher.
 *
 * LE CTA DE DEVIS N UTILISE PLUS `components/BoutonDevis`, ET C EST LA SEULE
 * REGRESSION DE FACTORISATION DE CE FICHIER. Ce composant ecrit `/devis` EN
 * DUR ; sur une page anglaise il renvoyait donc sur le parcours francais. Le
 * `<a>` ci-dessous rend EXACTEMENT le meme balisage que lui — meme classe,
 * meme `encodeURIComponent`, meme enfants — et fait passer le chemin par
 * `lien()`. Le jour ou BoutonDevis prend une `locale`, ces quatre lignes
 * redeviennent un `<BoutonDevis>`.
 *
 * PAS DE next/link (decision B7) : une navigation client-side ne rejouerait pas
 * components/Interactions.tsx et laisserait les [data-reveal] de la page
 * d arrivee a opacity:0. Des `<a>` classiques, partout.
 */

/** Une prestation de la famille, appariee a sa ligne publiee en base. */
type PiecePubliee = { piece: Piece; service: ServiceCatalogue };

/**
 * LE CHROME DES CINQ PAGES — les mots qui ne sont pas de la matiere editoriale.
 *
 * POURQUOI ILS SONT ICI ET PAS AILLEURS. lib/familles.ts porte ce que les cinq
 * pages DISENT ; ces quelques chaines-ci portent la facon dont elles le
 * presentent — les intertitres, les libelles de section, les deux mots du CTA.
 * lib/dictionnaires/ serait leur maison naturelle, mais il ne couvre
 * aujourd hui que le chrome PARTAGE par tout le site (nav, menu, pied,
 * formulaire) : le jour ou il accueille une section « pages de famille », cette
 * table y demenage d un bloc, sans qu une seule chaine ait a etre reecrite.
 *
 * LE `Record<Locale, …>` EST LA GARDE : ajouter une langue a lib/i18n.ts casse
 * la compilation tant que sa colonne n est pas remplie. Une page a moitie
 * traduite ne peut pas tomber en production par oubli.
 *
 * LE FRANCAIS EST INCHANGE AU CARACTERE PRES : chaque chaine de la colonne
 * `fr` est celle qui etait ecrite en dur dans le JSX avant ce chantier.
 */
type Chrome = {
  /** Le fil d Ariane, en donnee structuree seulement. */
  filAccueil: string;
  services: string;
  detail: string;
  /** Les h2 sont coupes en DEUX LIGNES par un <br /> — Interactions.tsx les
   *  revele ligne par ligne, et le decoupage fait partie de la mise en page. */
  detailTitre: readonly [string, string];
  vousRecevez: string;
  /** Sous un prix libre, la ou les autres lignes portent la mention de TVA. */
  perimetreADefinir: string;
  /** La phrase du suivi, en morceaux : `obligatoire` y est en <strong>. */
  suiviCe: string;
  suiviEst: string;
  suiviObligatoire: string;
  suiviAvec: string;
  suiviAccompagne: string;
  /** Le liant de la liste des formules : « A et B » / « A and B ». */
  et: string;
  suiviSuite: string;
  perimetre: string;
  perimetreTitre: readonly [string, string];
  ailleurs: string;
  voirCatalogue: string;
  questions: string;
  questionsTitre: readonly [string, string];
  demanderDevis: string;
  tousLesServices: string;
};

const CHROME: Record<Locale, Chrome> = {
  fr: {
    filAccueil: "Accueil",
    services: "Services",
    detail: "Le détail",
    detailTitre: ["Ce que ça", "recouvre."],
    vousRecevez: "Ce que vous recevez",
    perimetreADefinir: "Périmètre à définir",
    suiviCe: "Ce suivi",
    suiviEst: "est ",
    suiviObligatoire: "obligatoire",
    suiviAvec: " avec",
    suiviAccompagne: "accompagne",
    et: " et ",
    suiviSuite:
      ". Il démarre la 2ᵉ année — la première est comprise dans le prix du site.",
    perimetre: "Périmètre",
    perimetreTitre: ["Ce qui n'est", "pas compris."],
    ailleurs: "Ailleurs au catalogue, ou nulle part",
    voirCatalogue: "Voir tout le catalogue →",
    questions: "Questions",
    questionsTitre: ["Ce qu'on me", "demande."],
    demanderDevis: "Demander un devis",
    tousLesServices: "Tous les services",
  },
  en: {
    filAccueil: "Home",
    services: "Services",
    detail: "The detail",
    detailTitre: ["What it", "covers."],
    vousRecevez: "What you receive",
    // « sur devis » est deja rendu par `formatServicePrice` juste au-dessus
    // (`on request`, glossaire §3) : cette ligne-ci dit ce qui manque pour
    // chiffrer, pas ce que la ligne coute.
    perimetreADefinir: "Scope to be defined",
    // Glossaire §3 : « suivi » ⇒ `upkeep`, jamais `maintenance` ni `support`.
    suiviCe: "This upkeep",
    suiviEst: "is ",
    suiviObligatoire: "compulsory",
    suiviAvec: " with",
    suiviAccompagne: "comes with",
    et: " and ",
    // Meme phrase que `resoutEn` de la famille « suivi », au mot pres : deux
    // formulations du meme engagement se lisent comme deux engagements.
    suiviSuite:
      ". It starts in the second year — the first is included in the price of the site.",
    perimetre: "Scope",
    perimetreTitre: ["What is not", "included."],
    ailleurs: "Elsewhere in the catalogue, or nowhere",
    voirCatalogue: "See the whole catalogue →",
    questions: "Questions",
    // « I », jamais « we » : le studio est tenu par une seule personne
    // (glossaire §2).
    questionsTitre: ["What I get", "asked."],
    // Glossaire §3 : « devis » ⇒ `a quote`, jamais `an estimate` ni
    // `a proposal`.
    demanderDevis: "Ask for a quote",
    tousLesServices: "All services",
  },
};

/**
 * @param locale la langue de la page. « fr » par defaut : les cinq pages
 *   francaises la passent explicitement, mais le defaut garantit qu une
 *   sixieme ecrite sans elle rende du francais entier plutot qu un melange.
 */
export default async function PageFamille({
  slug,
  locale = "fr",
}: {
  slug: FamilleSlug;
  locale?: Locale;
}) {
  const famille = FAMILLES[slug];
  const t = CHROME[locale];
  const enAnglais = locale === "en";

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

  /**
   * LA MATIERE DE LA FAMILLE, RESOLUE UNE FOIS POUR TOUTES.
   *
   * Le repli sur le francais est ecrit ICI et une seule fois par champ : le
   * meme `?? ` recopie a dix endroits finit par manquer au onzieme, et
   * l oubli ne se voit que sur la page anglaise, c est-a-dire nulle part
   * pendant six mois.
   */
  const libelle = (enAnglais && famille.libelleEn) || famille.libelle;
  const seoDescription =
    (enAnglais && famille.seoDescriptionEn) || famille.seoDescription;
  const serviceType = (enAnglais && famille.serviceTypeEn) || famille.serviceType;
  const h1 = (enAnglais && famille.h1En) || famille.h1;
  const resout = (enAnglais && famille.resoutEn) || famille.resout;

  /**
   * LES QUESTIONS SONT CALCULEES UNE FOIS ET SERVENT AUX DEUX RENDUS — le
   * `<details>` visible et le `FAQPage` de SchemaPage. C est la seule
   * protection contre la derive : un balisage de Q/R qui ne correspond plus au
   * texte affiche est une declaration fausse au moteur, et Google la traite
   * comme telle.
   */
  const questions = famille.questions.map((item) => ({
    q: (enAnglais && item.qEn) || item.q,
    r: (enAnglais && item.rEn) || item.r,
  }));

  /** Le nom d une formule de site, lu en base. `null` si elle n est plus publiee. */
  const nomDe = (slugFormule: string) => {
    const formule = catalogue.find((s) => s.slug === slugFormule);
    // `nomService` retombe sur le francais quand `nameEn` est null, et les
    // trois formules l ont volontairement a null : « La Vitrine », « Le Site »
    // et « L'Assistant » sont des noms propres et ne se traduisent jamais
    // (glossaire §5). C est ce repli-la qui le garantit.
    return formule ? nomService(formule, locale) : null;
  };

  /** Le chemin de la page, SANS prefixe de langue — `lien()` le pose. */
  const cheminFamille = hrefFamille(slug);
  const urlFamille = `${SITE_URL}${lien(locale, cheminFamille)}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    // L @id suit l URL DE LA PAGE, donc la langue : deux fiches sous un seul
    // identifiant qui divergeraient de nom et de description ne valent rien.
    "@id": `${urlFamille}#famille`,
    name: libelle,
    description: seoDescription,
    serviceType,
    url: urlFamille,
    // L @id pose par components/SchemaStudio.tsx sur l accueil. Le studio
    // n est pas redeclare ici : deux fiches du meme prestataire qui
    // divergeraient d un mot valent moins qu une seule, referencee. Il ne
    // varie PAS avec la langue — c est une seule entite, declaree une fois.
    provider: { "@id": `${SITE_URL}/#studio` },
    // « Genève » RESTE « Genève » SUR LA PAGE ANGLAISE, et ce n est pas un
    // oubli de traduction. Ce bloc est du NAP (nom / adresse / telephone) :
    // sa valeur sert a rapprocher la fiche de la fiche Google, et deux
    // graphies de la meme localite brouillent ce rapprochement (lib/site.ts,
    // docblock de CONTACT). La prose anglaise des pages, elle, dit bien
    // « Geneva ».
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
      name: libelle,
      itemListElement: pieces.map(({ service }) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: nomService(service, locale),
          description: descriptionService(service, locale),
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
                // `unitCode` est la valeur normalisee, lue par les moteurs ;
                // `unitText` est sa forme lisible, et elle suit donc la langue
                // de la page. Elle est DERIVEE du suffixe affiche
                // (« /mois », « /month ») dont on retire la barre, pour que le
                // JSON-LD ne puisse pas dire un autre mot que l ecran.
                ...(service.isMonthly
                  ? {
                      unitCode: "MON",
                      unitText: suffixeMensuel(locale).slice(1),
                      billingIncrement: 1,
                    }
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
          { nom: t.filAccueil, chemin: lien(locale, "/") },
          { nom: t.services, chemin: lien(locale, HREF_SERVICES) },
          { nom: libelle, chemin: lien(locale, cheminFamille) },
        ]}
        questions={questions}
        locale={locale}
      />

      {/* ---------- Le titre et ce que la famille résout ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <a className="lnk" href={lien(locale, HREF_SERVICES)}>
                {t.services}
              </a>
            </span>
            <div data-reveal>
              <h1 className="t">
                {h1[0]}
                <br />
                {h1[1]}
              </h1>
            </div>
          </div>

          <p className="lede" data-reveal>
            {resout}
          </p>
        </div>
      </section>

      {/* ---------- Le détail, prestation par prestation ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            {/* L espace insecable et le libelle tiennent dans UNE SEULE
                expression : deux enfants texte cote a cote font ecrire a React
                un `<!-- -->` entre eux pour borner l hydratation, ce qui
                changerait le HTML rendu en francais. Meme parade qu au pied de
                page. */}
            <span className="meta" data-reveal>
              <span className="index">(01)</span>
              {`  ${t.detail}`}
            </span>
            <div data-reveal>
              <h2 className="t">
                {t.detailTitre[0]}
                <br />
                {t.detailTitre[1]}
              </h2>
            </div>
          </div>

          <div>
            {pieces.map(({ piece, service }) => {
              const surDevis = isQuote(service);
              const quoi = (enAnglais && piece.quoiEn) || piece.quoi;
              const produit = (enAnglais && piece.produitEn) || piece.produit;
              const raisonDevis =
                (enAnglais && piece.raisonDevisEn) || piece.raisonDevis;
              const obligatoire =
                (enAnglais && piece.obligatoireEn) || piece.obligatoire;

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
                   une classe — la mise en page ne bouge pas.

                   IL NE SE TRADUIT PAS, et c est la raison pour laquelle il
                   vient du SLUG et non d un titre : la meme ancre tombe sur
                   `/services/<famille>#<slug>` et sur
                   `/en/services/<famille>#<slug>`. Un id traduit casserait la
                   moitie des liens du catalogue anglais. */
                <article
                  className="pf-piece"
                  id={service.slug}
                  data-reveal
                  key={service.id}
                >
                  <div className="pf-txt">
                    {/* Nom et description viennent de Postgres, jamais du
                        fichier editorial. `nomService` / `descriptionService`
                        sont la seule facon autorisee de lire leurs colonnes
                        anglaises, repli compris. */}
                    <h3 className="pf-piece-t">{nomService(service, locale)}</h3>
                    <p className="pf-piece-d">
                      {descriptionService(service, locale)}
                    </p>
                    <p className="pf-piece-quoi">{quoi}</p>

                    <p className="sm-grp">{t.vousRecevez}</p>
                    <ul className="prest-inc">
                      {produit.map((ligne) => (
                        <li key={ligne}>{ligne}</li>
                      ))}
                    </ul>

                    <div className="pf-prix">
                      <b>{formatServicePrice(service, locale)}</b>
                      {/* Le libelle suit le TYPE de prix lu en base :
                          « TVA comprise » sous un montant qui n existe pas
                          serait faux, et c est exactement le genre
                          d indication que la LCD vise. La mention vient de
                          lib/format.ts et n est jamais recopiee : elle a
                          valeur legale, et elle doit etre dans la langue de la
                          page. */}
                      <span>
                        {surDevis ? t.perimetreADefinir : mentionTva(locale)}
                      </span>
                    </div>

                    {/* Pourquoi cette ligne se chiffre sur devis. Rendu
                        UNIQUEMENT si la base le dit encore : un prix ferme
                        pose en base fait disparaitre l explication au lieu de
                        contredire le montant juste au-dessus. */}
                    {surDevis && raisonDevis ? (
                      <p className="pf-raison">{raisonDevis}</p>
                    ) : null}

                    {/* Le prix mensuel impose s annonce AU POINT DE DECISION,
                        avec le mot « obligatoire », son point de depart et le
                        montant juste au-dessus. Un engagement recurrent passe
                        sous silence est un prix cache. */}
                    {formules.length > 0 ? (
                      <p className="pf-raison">
                        {t.suiviCe}{" "}
                        {obligatoire ? (
                          <>
                            {t.suiviEst}
                            <strong>{t.suiviObligatoire}</strong>
                            {t.suiviAvec}
                          </>
                        ) : (
                          <>{t.suiviAccompagne}</>
                        )}{" "}
                        {formules.join(t.et)}
                        {t.suiviSuite}
                        {obligatoire ? ` ${obligatoire}` : null}
                      </p>
                    ) : null}
                  </div>

                  <VignettePrestation slug={service.slug} locale={locale} />
                </article>
              );
            })}
          </div>

          {aDuDevis ? (
            <p className="pf-note" data-reveal>
              {enAnglais ? MENTION_DEVIS_EN : MENTION_DEVIS}
            </p>
          ) : null}
          {aUnPrix ? (
            <p className="pf-note" data-reveal>
              {enAnglais ? MENTION_TVA_EN : MENTION_TVA}
            </p>
          ) : null}
        </div>
      </section>

      {/* ---------- Ce qui n'est pas compris ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(02)</span>
              {`  ${t.perimetre}`}
            </span>
            <div data-reveal>
              <h2 className="t">
                {t.perimetreTitre[0]}
                <br />
                {t.perimetreTitre[1]}
              </h2>
            </div>
          </div>
          <div className="prest-liste pf-hors" data-reveal>
            <div className="prest-palier">
              <p className="sm-grp">{t.ailleurs}</p>
              <ul className="prest-inc">
                {famille.horsPerimetre.map((hors) => (
                  /* La cle reste le libelle FRANCAIS : elle doit etre stable
                     d une langue a l autre, et `quoi` est toujours renseigne
                     alors que `quoiEn` est optionnel. */
                  <li key={hors.quoi}>
                    {(enAnglais && hors.quoiEn) || hors.quoi} —{" "}
                    {hors.href ? (
                      <a className="lnk" href={lien(locale, hors.href)}>
                        {(enAnglais && hors.ouEn) || hors.ou} →
                      </a>
                    ) : (
                      <em>{(enAnglais && hors.ouEn) || hors.ou}</em>
                    )}
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: 16 }}>
                <a className="lnk" href={lien(locale, HREF_SERVICES)}>
                  {t.voirCatalogue}
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
              <span className="index">(03)</span>
              {`  ${t.questions}`}
            </span>
            <div data-reveal>
              <h2 className="t">
                {t.questionsTitre[0]}
                <br />
                {t.questionsTitre[1]}
              </h2>
            </div>
          </div>
          {/* Depliage natif <details>/<summary>, sans une ligne de JS —
              identique a la FAQ de l accueil et a celle des formules. */}
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

          {/* Le CTA de devis. C est un VRAI LIEN vers /devis : il fonctionne
              sans JavaScript, et la page d arrivee ouvre l assistant deja
              renseigne du sujet de cette famille. L amorce WhatsApp de la
              famille n a pas disparu — elle y sert de repli (lib/devis.ts).

              LE `sujet` NE SE TRADUIT PAS : c est un identifiant de
              conversation, et le traduire ferait deux sujets pour une seule
              demande. Seul le CHEMIN passe par `lien()`. */}
          <div className="c-row" data-reveal>
            <a
              className="btn"
              href={lien(
                locale,
                `/devis?p=${encodeURIComponent(famille.sujet)}`,
              )}
            >
              {`${t.demanderDevis} `}
              <span className="ar">→</span>
            </a>
            <a className="btn btn-line" href={lien(locale, HREF_SERVICES)}>
              {t.tousLesServices}
            </a>
          </div>
        </div>
      </section>

      {/* L index du pied de page suit la derniere section de CETTE page :
          trois sections (01) a (03) sur une page de famille, donc le contact porte (04).
          Le defaut "07" du composant est celui de l accueil, qui compte
          sept sections ; le laisser ici faisait sauter la numerotation
          sous les yeux du lecteur. */}
      <FooterContact indexSection="04" locale={locale} />
    </>
  );
}
