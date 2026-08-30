import type { Metadata } from "next";
import BoutonDevis from "@/components/BoutonDevis";
import FooterContact from "@/components/FooterContact";
import {
  CHF_UNIT,
  FROM_PREFIX,
  MONTHLY_SUFFIX,
  QUOTE_LABEL,
  formatChfAmount,
  isQuote,
} from "@/lib/format";
import { estFormule } from "@/lib/formules";
import {
  type ServiceCatalogue,
  chargerCatalogue,
  parCategories,
} from "@/lib/catalogue";
import { openGraphPage, whatsapp } from "@/lib/site";

/**
 * /prestations — LE CATALOGUE EN ENTIER.
 *
 * Pourquoi cette page existe. L offre etait eclatee en deux endroits qui ne se
 * parlaient pas : la grille d accueil montrait les trois formules de site, la
 * « carte du studio » montrait les supports. Le visiteur qui voulait savoir
 * ce que le studio vend devait donc reconstituer le catalogue de tete. Ici il
 * le voit d un coup, groupe, avec les prix.
 *
 * TOUT VIENT DE POSTGRES. Aucun montant n est ecrit dans ce fichier : noms,
 * descriptions et prix sortent de la table Service (visible: true), comme dans
 * components/CarteDuStudio.tsx. Corriger un prix en base le corrige ici aussi.
 *
 * DEUX RENDUS, ET C EST VOULU. « Les formules » passe en CARTES sur fond pin,
 * comme la grille d accueil : ce sont les trois decisions d achat du studio,
 * elles meritent la place et elles ouvrent chacune une page dediee. Les trois
 * autres groupes passent en LIGNES : ce sont des complements, on les parcourt,
 * on ne les compare pas.
 */

// Rendu a chaque requete, meme raison qu app/(site)/page.tsx : cette page lit
// Postgres, et `next build` doit passer sans base joignable — l etage builder
// du Dockerfile n en a aucune. Sans force-dynamic, Next tenterait de
// prerendre la page au build et la construction echouerait.
//
// Essaye et VERIFIE : avec `export const revalidate`, `next build` s arrete
// sur P1001 des que la base ne repond pas. Le detail de la mesure et le
// pourquoi du renoncement a l ISR sont dans le docblock d app/(site)/page.tsx.
export const dynamic = "force-dynamic";

const DESCRIPTION =
  "Le catalogue du studio genevois : trois formules de site, le suivi mensuel, l'identité et les imprimés, les réseaux sociaux et la ligne restauration.";

export const metadata: Metadata = {
  title: "Prestations et tarifs à Genève",
  description: DESCRIPTION,
  alternates: { canonical: "/prestations" },
  openGraph: openGraphPage({
    titre: "Prestations et tarifs à Genève — Nawa Corps",
    description: DESCRIPTION,
    chemin: "/prestations",
  }),
  /**
   * LE BLOC TWITTER EST OBLIGATOIRE ICI, et pour une raison de fond, pas de
   * cosmetique. Next fusionne les metadata champ par champ mais SANS descendre
   * dans les objets : une page qui n en declare pas herite integralement de
   * celui du layout — lequel annonce encore « livré en 72 h ». Ce delai est
   * interdit (voir .agents/product-marketing.md §8) : la seule promesse est
   * « une semaine ». Sans ce bloc, la carte de partage de cette page
   * republierait le chiffre que la page elle-meme ne dit nulle part.
   * L image, elle, vient du fichier app/opengraph-image et n a pas a etre
   * redeclaree.
   */
  twitter: {
    card: "summary_large_image",
    title: "Prestations et tarifs à Genève — Nawa Corps",
    description: DESCRIPTION,
  },
};

/**
 * La mention est obligatoire sous CHAQUE bloc de prix, pas une fois en bas de
 * page : en Suisse un prix annonce a un consommateur s entend TVA comprise, et
 * un visiteur qui arrive par une ancre de groupe ne voit que ce groupe.
 *
 * « sans frais cachés » en a ete retire. La formule promet l absence de ce
 * qu on n attendait pas : elle installe le soupcon qu elle pretend lever, et
 * elle est saturee chez trois concurrents sur six. Ce qui borne reellement une
 * prestation — deux allers-retours, le suivi obligatoire de L Assistant — se
 * dit la ou il s applique, pas dans une mention legale generique.
 */
const MENTION_TVA = "Prix en francs suisses, TVA comprise.";

const DEVIS_LABEL = "Demander un devis →";

/**
 * Les trois groupes rendus en LIGNES. « Les formules » n est pas dans ce
 * tableau : il a son propre rendu en cartes, juste avant.
 *
 * Chaque groupe porte sa propre amorce WhatsApp et son propre `sujet` : ce sont
 * des conversations differentes, et l assistant doit savoir laquelle s ouvre.
 *
 * `pourQui` A ETE REECRIT POUR LES TROIS. Les accroches presentaient ces
 * groupes comme un appendice aux formules — « pour completer le site », « en
 * complement ». Or on ne vend pas que des sites : une identite, des imprimes,
 * la production de reseaux sociaux ou la carte d un restaurant se commandent
 * seuls, et le client qui vient pour ca repartait en croyant qu il fallait
 * d abord acheter un site. Chaque accroche dit donc maintenant DE QUOI il
 * s agit, A QUI ca s adresse, et que ca se prend sans site.
 *
 * Le MINIMUM DE COMMANDE de 300.– a disparu avec la nouvelle grille : tous ces
 * supports passent sur devis, et un seuil n a plus d objet quand il n y a plus
 * de petits montants a additionner. Aucune trace ne doit en rester.
 */
const GROUPES_LIGNES = [
  {
    categorie: "continu",
    ancre: "en-continu",
    index: "(02)",
    libelle: "En continu",
    titre: (
      <>
        Le site vit,
        <br />
        et il est tenu.
      </>
    ),
    pourQui:
      "Ce qui se paie au mois, pour le gérant qui ne veut plus y penser une fois le site en ligne : hébergement, nom de domaine, mises à jour, sauvegardes, sécurité. Le suivi démarre la deuxième année — la première est comprise dans le prix du site — et il est obligatoire avec L'Assistant, qui consomme des appels d'API en continu. C'est ici, aussi, que se prennent vos réseaux sociaux : calendrier, création, rédaction, publication et suivi, vous ne touchez à rien.",
    amorce: whatsapp("Bonjour, j'aimerais un devis pour le suivi de mon site."),
    sujet: "devis-en-continu",
  },
  {
    categorie: "annee",
    ancre: "en-complement",
    index: "(03)",
    libelle: "En complément",
    titre: (
      <>
        Ce qui se voit
        <br />
        ailleurs qu&apos;à l&apos;écran.
      </>
    ),
    pourQui:
      "Une offre en soi, pas un supplément au site : votre identité, ce que vos clients gardent en main, les photos de votre entreprise. Pour le gérant dont le logo date, qui n'a plus de cartes à donner, ou dont le site et les documents ne se ressemblent pas. Tout se prend avec un site chez moi comme sans.",
    amorce: whatsapp(
      "Bonjour, j'aimerais un devis pour une prestation en complément de mon site.",
    ),
    sujet: "devis-en-complement",
  },
  {
    categorie: "saison",
    ancre: "pour-la-restauration",
    index: "(04)",
    libelle: "Pour la restauration",
    titre: (
      <>
        La ligne
        <br />
        restauration.
      </>
    ),
    pourQui:
      "Pour un café ou un restaurant genevois qui veut que sa salle se tienne : la carte repensée, ses fichiers d'impression et sa version en ligne avec QR, les chevalets de table, la carte de fidélité, les bons cadeaux et les supports de saison. Une ligne à part, tenue depuis le début, ouverte à qui n'a pas de site chez moi.",
    amorce: whatsapp(
      "Bonjour, j'aimerais un devis pour les supports de mon établissement.",
    ),
    sujet: "devis-restauration",
  },
] as const;

// CTA du groupe « Les formules », a part parce que son amorce parle de site et
// non de support.
const DEVIS_FORMULES = whatsapp(
  "Bonjour, j'aimerais un devis pour la refonte du site de mon entreprise.",
);

type ServiceRow = ServiceCatalogue;

// Les quatre groupes du catalogue. Le filtre est fait en memoire sur la
// lecture partagee de lib/catalogue.ts, et reste ecrit ici : une categorie
// ajoutee en base demain ne doit pas surgir d office dans cette page.
const CATEGORIES = ["principal", "continu", "annee", "saison"];

/** Le prix d une LIGNE, au format de la carte du studio. */
function Prix({ service }: { service: ServiceRow }) {
  if (isQuote(service) || service.priceCents === null) {
    return <span className="px">{QUOTE_LABEL}</span>;
  }
  return (
    <span className="px">
      {service.priceFrom ? <small>{FROM_PREFIX}</small> : null}
      {`${formatChfAmount(service.priceCents)}${CHF_UNIT}`}
      {service.isMonthly ? <small className="per">{MONTHLY_SUFFIX}</small> : null}
    </span>
  );
}

export default async function Prestations() {
  const services = parCategories(await chargerCatalogue(), CATEGORIES);
  const parCategorie = (categorie: string) =>
    services.filter((s) => s.category === categorie);

  const principal = parCategorie("principal");
  // Les formules chiffrees prennent la grille de cartes ; celles qui se
  // traitent sur devis passent en ligne pleine largeur dessous, comme le fait
  // deja la grille d accueil. Cette separation n existe que parce que la base
  // distingue FIXED de QUOTE — elle n est ecrite nulle part en dur.
  const cartes = principal.filter((s) => !isQuote(s));
  const surDevis = principal.filter((s) => isQuote(s));

  return (
    <>
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              Catalogue
            </span>
            <div data-reveal>
              <h1 className="t">
                Tout ce que fait
                <br />
                le studio, à Genève.
              </h1>
            </div>
          </div>
          {/* Quatre OFFRES, pas une offre et trois annexes. Le site reste en
              tete parce qu il porte la promesse, le prix affiche et le
              referencement — mais il n est plus le seul a exister sur cette
              page. */}
          <p className="lede" data-reveal>
            Quatre offres, et le site n&apos;est que la première. Les formules
            d&apos;abord — c&apos;est le produit d&apos;entrée ; puis le suivi
            au mois, ce qui se voit ailleurs qu&apos;à l&apos;écran, et la ligne
            restauration. Les formules et le suivi portent un prix ; tout ce
            qui s&apos;imprime ou se produit se chiffre sur devis, parce
            qu&apos;un tirage, un format et un papier ne se devinent pas.
          </p>
          {/* La comparaison « chez les autres » a ete retiree : le
              positionnement §8 interdit de comparer, nomme ou non. Ce qui la
              remplace nomme l attente par defaut du lecteur — une croyance,
              pas la pratique d un concurrent. */}
          <p className="lede" data-reveal style={{ marginTop: "1.2em" }}>
            Le délai est d&apos;<strong>une semaine</strong>, et il court dès
            votre feu vert — pas dès que vous m&apos;aurez envoyé vos textes.
            Vous n&apos;avez rien à préparer : je reprends ce qui est déjà en
            ligne.
          </p>
        </div>
      </section>

      {/* ---------- (01) Les formules — en cartes, sur fond pin ---------- */}
      <section className="offres green" id="les-formules">
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; Les formules
            </span>
            <div data-reveal>
              <h2 className="t">
                Trois paliers,
                <br />
                un seul site.
              </h2>
            </div>
          </div>
          <p className="lede" data-reveal style={{ marginBottom: 44 }}>
            Pour la PME genevoise dont le site a plus de cinq ans. Du site
            simplement présentable à celui qui répond et relance tout seul —
            chaque palier contient le précédent en entier. Livré en une
            semaine, dès votre feu vert.
          </p>

          <div className="price-grid">
            {cartes.map((service, i) => (
              <article className="price" data-reveal key={service.id}>
                <div className="lab">
                  <span>N° {String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3>{service.name}</h3>
                <p className="d">{service.description}</p>
                {/* Meme rendu que la grille d accueil, `dès` et `/mois`
                    compris : ce sont des drapeaux de la base, et un jour ou
                    une formule les portera, la carte doit suivre sans qu on y
                    revienne. */}
                <p className="num">
                  {service.priceFrom ? <small>{FROM_PREFIX}</small> : null}
                  {formatChfAmount(service.priceCents as number)}
                  <small>{`${CHF_UNIT} CHF`}</small>
                  {service.isMonthly ? (
                    <small className="per">{MONTHLY_SUFFIX}</small>
                  ) : null}
                </p>
                {/* Le lien n existe que pour les trois formules qui ont une
                    page. Un `principal` ajoute en base demain apparait donc
                    dans la grille, mais sans lien mort. */}
                {estFormule(service.slug) ? (
                  <a
                    className="btn btn-line"
                    href={`/prestations/${service.slug}`}
                  >
                    Voir la formule <span className="ar">→</span>
                  </a>
                ) : null}
              </article>
            ))}
          </div>

          {surDevis.map((service) => (
            <div className="p-note" data-reveal key={service.id}>
              <span>{`${service.name} — ${QUOTE_LABEL}`}</span>
              <span>{service.description}</span>
            </div>
          ))}

          <div className="p-note" data-reveal>
            <span>{MENTION_TVA}</span>
            <BoutonDevis href={DEVIS_FORMULES} sujet="devis-formules">
              {DEVIS_LABEL}
            </BoutonDevis>
          </div>
        </div>
      </section>

      {/* ---------- (02) a (04) — les complements, en lignes ---------- */}
      {GROUPES_LIGNES.map((groupe) => {
        const lignes = parCategorie(groupe.categorie);
        // Un groupe vide en base ne laisse pas une section fantome derriere
        // lui : il disparait.
        if (lignes.length === 0) return null;
        return (
          <section key={groupe.ancre} id={groupe.ancre}>
            <div className="wrap">
              <div className="sec-head">
                <span className="meta" data-reveal>
                  <span className="index">{groupe.index}</span>&nbsp;{" "}
                  {groupe.libelle}
                </span>
                <div data-reveal>
                  <h2 className="t">{groupe.titre}</h2>
                </div>
              </div>
              <p className="lede" data-reveal style={{ marginBottom: 34 }}>
                {groupe.pourQui}
              </p>
              <div className="prest-liste" data-reveal>
                {lignes.map((service) => (
                  <div className="sm-it" key={service.id}>
                    <span>{service.name}</span>
                    <i></i>
                    <Prix service={service} />
                    <span className="d">{service.description}</span>
                  </div>
                ))}
                <div className="sm-foot">
                  <span>{MENTION_TVA}</span>
                  <BoutonDevis href={groupe.amorce} sujet={groupe.sujet}>
                    {DEVIS_LABEL}
                  </BoutonDevis>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <FooterContact />
    </>
  );
}
