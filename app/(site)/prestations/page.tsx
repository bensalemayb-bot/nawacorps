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
 * « carte de l agence » montrait les supports. Le visiteur qui voulait savoir
 * ce que l agence vend devait donc reconstituer le catalogue de tete. Ici il
 * le voit d un coup, groupe, avec les prix.
 *
 * TOUT VIENT DE POSTGRES. Aucun montant n est ecrit dans ce fichier : noms,
 * descriptions et prix sortent de la table Service (visible: true), comme dans
 * components/CarteDuStudio.tsx. Corriger un prix en base le corrige ici aussi.
 *
 * DEUX RENDUS, ET C EST VOULU. « Les formules » passe en CARTES sur fond pin,
 * comme la grille d accueil : ce sont les trois decisions d achat de l agence,
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
  "Le catalogue complet de l'agence genevoise : les trois formules de site, le suivi mensuel, les compléments et la ligne restauration. Prix TVA comprise.";

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
      "Pour qui veut que son site reste en ligne, à jour et sauvegardé sans y penser. Le suivi démarre la deuxième année : la première est comprise dans le prix du site.",
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
      "Pour compléter le site : ce que vos clients ont en main, ce qui déborde de la page unique, et ce qui fait que votre entreprise se ressemble partout.",
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
      "Ligne secondaire, conservée pour les établissements déjà suivis par l'agence : la carte, les supports de salle et ceux de saison. Ces supports se commandent groupés — en dessous, l'échange coûte plus cher que la prestation.",
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

/** Le prix d une LIGNE, au format de la carte de l agence. */
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
                l&apos;agence, à Genève.
              </h1>
            </div>
          </div>
          <p className="lede" data-reveal>
            Quatre groupes, tous les prix, aucune ligne cachée. Les sites
            d&apos;abord — c&apos;est le métier ; puis ce qui les tient dans le
            temps, ce qui les complète, et la ligne restauration que l&apos;agence a
            gardée.
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
            chaque palier contient le précédent en entier.
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
