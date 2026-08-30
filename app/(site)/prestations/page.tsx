import type { Metadata } from "next";
import BoutonDevis from "@/components/BoutonDevis";
import CarteService from "@/components/CarteService";
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
import { type FamilleSlug, MENTION_TVA } from "@/lib/familles";
import { CATEGORIES_FAMILLES, parFamilles } from "@/lib/catalogue-familles";
import { chargerCatalogue, parCategories } from "@/lib/catalogue";
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
 * TOUT EST EN CARTES, ET C EST UN CHANGEMENT. Les trois formules l ont
 * toujours ete — cartes sur fond pin, comme la grille d accueil. Le reste du
 * catalogue s affichait en LIGNES : intitule, filet pointille, prix a droite,
 * la mise en page d une carte de restaurant. Elle rangeait quatorze
 * « sur devis » les uns sous les autres en invitant a les comparer, alors
 * qu aucun ne se compare — un tirage, un format et un papier se chiffrent
 * apres un echange. Meme grammaire partout, desormais : un titre, ce que c est
 * en une phrase, le prix ou « sur devis ».
 *
 * ET LE REGROUPEMENT A CHANGE AVEC. La page suivait les CATEGORIES de la table
 * Service — `continu`, `annee`, `saison` —, c est-a-dire un rangement de base.
 * Elle suit maintenant les cinq FAMILLES, qui sont un rangement de lecture et
 * qui ont chacune leur page : le bloc porte le titre de la famille, son
 * accroche, ses prestations et la porte qui l ouvre en entier. Le rangement
 * lui-meme vit dans lib/catalogue-familles.ts, partage avec l accueil.
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
 * LA MENTION TVA VIENT DE lib/familles.ts, ou vivent aussi les cinq pages de
 * famille : la meme phrase doit se lire mot pour mot d une page a l autre, et
 * deux copies divergent toujours.
 *
 * Elle est obligatoire sous CHAQUE bloc de prix, pas une fois en bas de page :
 * en Suisse un prix annonce a un consommateur s entend TVA comprise, et un
 * visiteur qui arrive par l ancre d une famille ne voit que cette famille.
 *
 * « sans frais cachés » en a ete retire. La formule promet l absence de ce
 * qu on n attendait pas : elle installe le soupcon qu elle pretend lever, et
 * elle est saturee chez trois concurrents sur six. Ce qui borne reellement une
 * prestation — deux allers-retours, le suivi obligatoire de L Assistant — se
 * dit la ou il s applique, pas dans une mention legale generique.
 */

const DEVIS_LABEL = "Demander un devis →";

// CTA du groupe « Les formules », a part parce que son amorce parle de site et
// non de support.
const DEVIS_FORMULES = whatsapp(
  "Bonjour, j'aimerais un devis pour la refonte du site de mon entreprise.",
);

/**
 * L HABILLAGE DES CINQ BLOCS DE FAMILLE, PROPRE A CETTE PAGE.
 *
 * Tout le reste — libelle, accroche, amorce, prestations — est lu dans
 * lib/familles.ts : c est la page de la famille qui fait autorite sur ce
 * qu elle est, et le recopier ici garantirait qu un jour les deux se
 * contredisent. Ne restent ici que deux choses qui n existent QUE sur l index.
 *
 * 1. LE TITRE. Le h1 d une page de famille se termine par « à Genève » — c est
 *    son travail, elle est seule sur son ecran. Empiles, les cinq donneraient
 *    cinq « Genève » sur une meme page : le mot cesse d etre une precision et
 *    devient du bruit. Le titre de bloc dit donc ce que la famille resout.
 * 2. LE LIBELLE DU LIEN. « Voir » + libelle donnerait « Voir Identité &
 *    photographie » ; la langue se decide phrase par phrase, pas par
 *    concatenation.
 *
 * Le Record est INDEXE PAR FamilleSlug : ajouter une famille dans
 * lib/familles.ts sans lui donner de titre ici ne compile pas. Une erreur de
 * build vaut mieux qu un bloc muet en production.
 */
const BLOCS: Record<
  FamilleSlug,
  { titre: readonly [string, string]; lien: string }
> = {
  identite: {
    titre: ["Ce qui fait", "qu'on vous reconnaît."],
    lien: "Voir l'identité",
  },
  imprimes: {
    titre: ["Ce qui se voit", "ailleurs qu'à l'écran."],
    lien: "Voir les imprimés",
  },
  "reseaux-sociaux": {
    titre: ["Vos réseaux,", "tenus au mois."],
    lien: "Voir les réseaux sociaux",
  },
  suivi: {
    titre: ["Le site vit,", "et il est tenu."],
    lien: "Voir le suivi",
  },
  restauration: {
    titre: ["La ligne", "restauration."],
    lien: "Voir la restauration",
  },
};

/** « Les formules » ouvre la page en (01) ; les familles suivent. */
const numero = (rang: number) => `(${String(rang).padStart(2, "0")})`;

export default async function Prestations() {
  // UNE seule lecture pour toute la page (cf. lib/catalogue.ts). Les formules
  // gardent leur grille de cartes ; tout le reste est range en familles, le
  // rangement etant partage avec l accueil (lib/catalogue-familles.ts).
  const catalogue = await chargerCatalogue();
  const principal = parCategories(catalogue, ["principal"]);
  const familles = parFamilles(
    parCategories(catalogue, [...CATEGORIES_FAMILLES]),
  );

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

      {/* ---------- (02) a (06) — les cinq familles, en cartes ---------- */}
      {familles.map(({ famille, lignes }, rang) => {
        const bloc = BLOCS[famille.slug];
        return (
          <section key={famille.slug} id={famille.slug}>
            <div className="wrap">
              <div className="sec-head">
                <span className="meta" data-reveal>
                  <span className="index">{numero(rang + 2)}</span>&nbsp;{" "}
                  {famille.contenu.libelle}
                </span>
                <div data-reveal>
                  <h2 className="t">
                    {bloc.titre[0]}
                    <br />
                    {bloc.titre[1]}
                  </h2>
                </div>
              </div>
              {/* L accroche est celle de la page de la famille, lue telle
                  quelle : l index annonce, la page developpe, et les deux ne
                  peuvent pas se contredire. */}
              <p className="lede" data-reveal style={{ marginBottom: 34 }}>
                {famille.contenu.resout}
              </p>
              {/* Les cartes ne portent PAS le nom de leur famille ici : le
                  bloc l a deja ecrit deux fois au-dessus, et le lien qui suit
                  l ouvre en entier. Sur l accueil, ou il n y a pas de bloc,
                  c est l inverse — voir components/CarteService.tsx. */}
              <div className="cat-grid">
                {lignes.map((service) => (
                  <CarteService key={service.id} service={service} />
                ))}
              </div>
              <div className="cat-tout" data-reveal>
                <a className="btn btn-line" href={famille.href}>
                  {bloc.lien} <span className="ar">→</span>
                </a>
              </div>
              <div className="sm-foot">
                <span>{MENTION_TVA}</span>
                <BoutonDevis
                  href={famille.contenu.amorce}
                  sujet={famille.contenu.sujet}
                >
                  {DEVIS_LABEL}
                </BoutonDevis>
              </div>
            </div>
          </section>
        );
      })}

      <FooterContact />
    </>
  );
}
