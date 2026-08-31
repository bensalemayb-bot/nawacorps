import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import FooterContact from "@/components/FooterContact";
import {
  CHF_UNIT,
  formatChfAmount,
  isQuote,
  libelleDevis,
  mentionTva,
  prefixeDes,
  suffixeMensuel,
} from "@/lib/format";
import { POUR_QUI, POUR_QUI_EN, estFormule } from "@/lib/formules";
import {
  type FamilleSlug,
  MENTION_DEVIS,
  MENTION_DEVIS_EN,
  MENTION_REPONSE,
  MENTION_REPONSE_EN,
  MENTION_TVA,
} from "@/lib/familles";
import {
  CATEGORIES_FAMILLES,
  FAMILLES_EN_SECOND,
  FAMILLES_EN_VITRINE,
  type FamilleRangee,
  hrefService,
  parFamilles,
} from "@/lib/catalogue-familles";
import {
  type ServiceCatalogue,
  chargerCatalogue,
  descriptionService,
  nomService,
  parCategories,
} from "@/lib/catalogue";
import { type Locale, lien } from "@/lib/i18n";
import { SITE_NAME, alternatesPage, openGraphPage } from "@/lib/site";

/**
 * /services — LE CATALOGUE EN ENTIER.
 *
 * Pourquoi cette page existe. L offre etait eclatee en deux endroits qui ne se
 * parlaient pas : la grille d accueil montrait les trois formules de site, la
 * « carte du studio » montrait les supports. Le visiteur qui voulait savoir
 * ce que le studio vend devait donc reconstituer le catalogue de tete. Ici il
 * le voit d un coup, groupe, avec les prix.
 *
 * ELLE S APPELAIT /prestations. La navigation portait « Services », « Offres »
 * et « Prestations » — trois mots pour la meme chose, dont deux ancres de
 * l accueil et une page. Le visiteur devait deviner laquelle contenait quoi.
 * Il ne reste qu un mot et qu une page generale : celle-ci. Le site n etait pas
 * en ligne, aucune redirection n a donc ete posee.
 *
 * ET CHAQUE LIGNE S OUVRE — MAIS PAS SUR UNE PAGE PAR LIGNE. La page promet
 * qu on y voit tout ce qui est vendu ; elle promet donc aussi qu on peut lire
 * chaque ligne en entier. Les cartes ouvraient `/services/<slug de la table
 * Service>` : quatorze de ces adresses n existaient pas et repondaient 404
 * (constat 10 de la revue du 31 aout). Elles ouvrent desormais le bloc de la
 * ligne sur la page de sa FAMILLE, a l ancre — `hrefService` decide, dans
 * lib/catalogue-familles.ts, et c est la ou le contenu vit deja. Les trois
 * formules gardent leur page et leur bouton ; `site-sur-mesure`, qui n a ni
 * l une ni l autre, est rendu sans lien.
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
 *
 * PUIS LES CINQ FAMILLES ONT CESSE D ETRE EGALES. Cinq blocs de meme poids
 * disent que tout se vend pareil ; ce n est pas le cas. La page s ouvre donc
 * sur ce que le studio met en vitrine — les trois formules de site, puis les
 * imprimes, puis les reseaux sociaux — et bascule ensuite, bande a l appui,
 * sur l identite, le suivi et la restauration. Le classement est lu dans
 * lib/catalogue-familles.ts et non decide ici : l accueil rend le meme.
 *
 * LA BASCULE NE RETIRE RIEN. Les dix-huit lignes visibles en base sont
 * rendues, toutes, descriptions comprises ; les trois blocs du second rang
 * gardent leur accroche, leur lien, leur mention de TVA et leur devis. Ce qui
 * change tient au titre, qui descend d une echelle, et au bloc, qui respire
 * moins. Un catalogue qui coupe ses lignes n est plus un catalogue.
 *
 * ---------------------------------------------------------------------------
 * DEPUIS LE CHANTIER ANGLAIS : CE FICHIER REND DEUX PAGES, PAS UNE.
 *
 * `corpsServices(locale)` porte le corps ; `/services` l appelle en francais,
 * `/en/services` en anglais (app/(site)/en/services/page.tsx). Les deux pages
 * ne partagent pas seulement leur mise en page : elles partagent leur ORDRE de
 * blocs, leur numerotation et leurs mentions legales. Deux corps recopies
 * auraient diverge au premier arbitrage editorial, et la divergence aurait ete
 * invisible — personne ne relit deux pages cote a cote dans deux langues.
 *
 * C EST UNE FONCTION, PAS UN COMPOSANT, et ce n est pas un detail : appelee
 * (`return corpsServices("fr")`) plutot que rendue (`<CorpsServices />`), elle
 * n introduit AUCUNE frontiere de composant supplementaire dans l arbre. Le
 * HTML rendu en francais est donc rigoureusement celui d avant le chantier —
 * c est la condition qui rendait la bascule sure, et elle se verifie par diff.
 *
 * TOUTES LES CHAINES VISIBLES VIVENT DANS `TEXTES`, indexe par `Locale`. Une
 * langue ajoutee a lib/i18n.ts casse la compilation ici tant que sa colonne
 * n est pas remplie : un bloc de catalogue muet ne doit pas pouvoir atteindre
 * la production. Ce qui n est PAS dans cette table vient d ailleurs et doit y
 * rester — les noms, descriptions et prix sont en base (`nomService`,
 * `descriptionService`, `lib/format.ts`), les accroches de famille sont dans
 * lib/familles.ts, les libelles de formule dans lib/formules.ts.
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

/**
 * Le chemin SANS prefixe de langue — la forme qu attendent `lien()`,
 * `alternatesPage()` et `openGraphPage()`. Il ne s ecrit qu ici : c est de lui
 * que sortent la canonique francaise, la canonique anglaise et les `hreflang`
 * qui les croisent.
 */
const CHEMIN = "/services";

/**
 * TOUT CE QUE LA PAGE ECRIT ELLE-MEME, DANS LES DEUX LANGUES.
 *
 * L ANGLAIS SUIT docs/agents/brand/glossaire-anglais.md, ET IL EST CONTRAIGNANT.
 * Les quatre regles qui se verifient ligne par ligne ci-dessous :
 *  - « I / me / my », jamais « we », « our », « the agency » (§2) ;
 *  - anglais BRITANNIQUE — `enquiry`, `organisation`, `catalogue` (§1) ;
 *  - « une formule » se dit `package` et non `option` ni `tier` (§7), et quand
 *    la phrase le permet on nomme la formule plutot que la categorie ;
 *  - aucun delai en heures : seul `one week`, et jamais seul — il porte son
 *    point de depart `from your go-ahead` dans la meme unite de lecture (§5).
 *
 * AUCUN PRIX N EST ECRIT ICI, dans aucune des deux langues. Les montants
 * viennent de la base et leur mise en forme de lib/format.ts ; la mention
 * « TVA comprise » / « VAT included » vient de `mentionTva`, jamais d une
 * chaine de ce fichier — elle a valeur legale et une seconde graphie finirait
 * par diverger.
 */
type TextesCatalogue = {
  seoTitre: string;
  seoDescription: string;
  /** Le sur-titre de la page, au-dessus du h1. */
  meta: string;
  /** Le h1, en deux lignes separees par un <br>. */
  h1: readonly [string, string];
  /** Le chapo : il annonce l ORDRE REEL des blocs, et doit le suivre. */
  chapo: string;
  /** Le delai et son point de depart. Contient un <strong>. */
  delai: React.ReactNode;
  /** Les deux moities de la phrase qui compte les deux regimes de prix. */
  comptePrixFerme: string;
  compteSurDevis: string;
  /** Le raisonnement du devis, puis le seul engagement de reactivite admis. */
  mentionDevis: string;
  mentionReponse: string;
  /** La mention de TVA en phrase complete, sous chaque bloc de prix. */
  mentionTvaPhrase: string;
  /** Le libelle des huit CTA de devis de la page. */
  devisLabel: string;
  /** Le pied des cartes de catalogue : ce que la carte ouvre. */
  carteVoir: string;
  /**
   * Ce qui suit le montant dans la grille des formules.
   *
   * EN FRANCAIS C EST « .– CHF », EN ANGLAIS « .– » SEUL, et c est une regle,
   * pas une omission : le glossaire §5 proscrit `699 CHF` comme `CHF 699` en
   * anglais, tout en imposant de garder le format suisse `699.–`. La devise
   * n est donc pas perdue pour autant — elle est nommee en toutes lettres par
   * `mentionTvaPhrase` au pied de la meme grille (« Prices in Swiss francs »).
   */
  uniteMontant: string;
  formules: {
    meta: string;
    h2: readonly [string, string];
    lede: string;
    /** Le lien de chaque carte vers sa page de formule. */
    voir: string;
  };
  bascule: { titre: string; texte: string };
  /**
   * L habillage des cinq blocs de famille — voir le docblock de `BLOCS`.
   * Le Record est indexe par FamilleSlug DANS LES DEUX LANGUES : une famille
   * ajoutee sans titre anglais ne compile pas.
   */
  blocs: Record<FamilleSlug, { titre: readonly [string, string]; lien: string }>;
  /** Les deux segments du fil d Ariane, en donnee structuree. */
  fil: { accueil: string; services: string };
};

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
const BLOCS: TextesCatalogue["blocs"] = {
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

/** Les memes cinq blocs en anglais. Meme regle, meme garde de type. */
const BLOCS_EN: TextesCatalogue["blocs"] = {
  identite: {
    titre: ["What makes you", "recognisable."],
    lien: "See identity and photographs",
  },
  imprimes: {
    // « print », jamais « printed collateral » (glossaire §3).
    titre: ["What is seen", "away from a screen."],
    lien: "See print and signage",
  },
  "reseaux-sociaux": {
    // « kept up », et non « upkeep » : ce dernier ne vaut que pour
    // l abonnement mensuel du site (glossaire §7).
    titre: ["Your social media,", "kept up by the month."],
    lien: "See social media",
  },
  suivi: {
    titre: ["The site lives on,", "and it is looked after."],
    lien: "See hosting and upkeep",
  },
  restauration: {
    titre: ["The restaurant", "line."],
    lien: "See restaurants and cafés",
  },
};

const TEXTES: Record<Locale, TextesCatalogue> = {
  fr: {
    seoTitre: "Services et tarifs à Genève",
    seoDescription:
      "Le catalogue du studio genevois : trois formules de site, le suivi mensuel, le logo et les imprimés, les réseaux sociaux et les supports de restaurant.",
    meta: "Catalogue",
    h1: ["Tout ce que fait", "le studio, à Genève."],
    chapo:
      "Trois lignes en vitrine. Le site d'abord — c'est le produit d'entrée, et ce sur quoi tout le reste vient se brancher. Puis les cartes de visite et les imprimés, ce que vos clients gardent en main. Puis les réseaux sociaux, tenus au mois. Le logo, l'hébergement et les supports de restaurant suivent plus bas, entiers.",
    delai: (
      <>
        Le délai est d&apos;<strong>une semaine</strong>, et il court dès votre
        feu vert — pas dès que vous m&apos;aurez envoyé vos textes. Vous
        n&apos;avez rien à préparer : je reprends ce qui est déjà en ligne.
      </>
    ),
    comptePrixFerme: " lignes portent un prix ferme, ",
    compteSurDevis: " sont annoncées sur devis.",
    mentionDevis: MENTION_DEVIS,
    mentionReponse: MENTION_REPONSE,
    mentionTvaPhrase: MENTION_TVA,
    devisLabel: "Demander un devis →",
    carteVoir: "Voir le détail",
    uniteMontant: `${CHF_UNIT} CHF`,
    formules: {
      meta: "Les formules",
      h2: ["Trois paliers,", "un seul site."],
      lede: "Pour la PME genevoise dont le site a plus de cinq ans. Du site simplement présentable à celui qui répond et relance tout seul — chaque palier contient le précédent en entier. Livré en une semaine, dès votre feu vert.",
      voir: "Voir la formule",
    },
    bascule: {
      titre: "Le reste du catalogue",
      texte:
        "Logo et photos, hébergement du site, restaurants et cafés. Trois lignes entières, avec leurs prestations, leurs prix et leur devis — elles passent après, pas au rabais.",
    },
    blocs: BLOCS,
    fil: { accueil: "Accueil", services: "Services" },
  },

  en: {
    seoTitre: "Services and prices in Geneva",
    // « small business » et non « SME », « print » et non « printed
    // collateral », « upkeep » et non « maintenance » : glossaire §3.
    seoDescription:
      "The Geneva studio's catalogue: three site packages, monthly upkeep, logo and print, social media and the pieces a restaurant needs.",
    meta: "Catalogue",
    h1: ["Everything the studio", "does, in Geneva."],
    chapo:
      "Three lines up front. The site first — it is the entry product, and what everything else plugs into. Then business cards and print, what your customers keep in their hands. Then social media, kept up by the month. Logo, hosting and the restaurant pieces follow further down, in full.",
    // « one week » ne voyage jamais seul : « from your go-ahead » est dans la
    // meme phrase, et la phrase suivante dit ce que le client n a pas a faire.
    // « turnaround » est proscrit (glossaire §3, entree « une semaine »).
    delai: (
      <>
        The work takes <strong>one week</strong>, and it starts from your
        go-ahead — not from the day you send me your text. You have nothing to
        prepare: I take what is already online.
      </>
    ),
    // Le libelle du prix libre est celui de lib/format.ts (« on request ») : la
    // phrase qui compte les lignes et l etiquette des cartes doivent dire le
    // meme mot, sinon le lecteur cherche deux regimes de prix la ou il n y en
    // a qu un.
    comptePrixFerme: " lines carry a firm price, ",
    compteSurDevis: " are priced on request.",
    mentionDevis: MENTION_DEVIS_EN,
    mentionReponse: MENTION_REPONSE_EN,
    // La phrase francaise vit dans lib/familles.ts, qui explique pourquoi sa
    // jumelle anglaise n y est PAS : les deux mots a valeur legale sont dans
    // lib/format.ts, et les recopier ici creerait la seconde graphie que le
    // francais s interdit d avoir. On les lit donc, on ne les ecrit pas.
    mentionTvaPhrase: `Prices in Swiss francs, ${mentionTva("en")}.`,
    devisLabel: "Request a quote →",
    carteVoir: "See the details",
    uniteMontant: CHF_UNIT,
    formules: {
      // « the site packages » : §7 renverse le §6 et tranche pour `package`,
      // qui est l usage normal d un studio de creation britannique.
      meta: "The site packages",
      h2: ["Three packages,", "one site."],
      lede: "For the Geneva small business whose site is more than five years old. From a site that is simply presentable to one that answers and follows up on its own — each package contains the one before it, in full. Delivered in one week, from your go-ahead.",
      voir: "See the package",
    },
    bascule: {
      titre: "The rest of the catalogue",
      texte:
        "Logo and photographs, site hosting, restaurants and cafés. Three full lines, with their services, their prices and their quotes — they come later, not cut down.",
    },
    blocs: BLOCS_EN,
    fil: { accueil: "Home", services: "Services" },
  },
};

/**
 * LES METADONNEES DES DEUX PAGES, ecrites une seule fois.
 *
 * `alternatesPage` REMPLACE LA CANONIQUE ECRITE A LA MAIN, et c est la seule
 * modification volontaire du `<head>` francais. Une canonique seule ne dit pas
 * qu il existe une jumelle anglaise ; et un `hreflang` declare d un seul cote
 * est IGNORE par Google — l annotation doit etre confirmee par la page cible.
 * La page francaise s auto-declare donc en `fr-CH` et en `x-default` des
 * aujourd hui ; le `en-CH` apparaitra des deux cotes le jour ou `/services`
 * entrera dans `CHEMINS_TRADUITS` (lib/i18n.ts). Sans cette ligne, la page
 * anglaise partirait seule et pourrait prendre la place de la francaise sur
 * une requete francophone.
 *
 * LE BLOC TWITTER EST OBLIGATOIRE ICI, et pour une raison de fond, pas de
 * cosmetique. Next fusionne les metadata champ par champ mais SANS descendre
 * dans les objets : un `twitter` partiel n herite pas des cles manquantes,
 * et une page qui n en declare aucun herite integralement de celui du layout
 * — titre et description de l accueil compris. La carte de partage de ce
 * catalogue annoncerait donc la refonte de site, c est-a-dire un tiers de ce
 * que la page presente. Meme mecanique que `openGraph`, meme parade : on
 * redeclare le bloc EN ENTIER.
 * L image, elle, vient du fichier app/opengraph-image et n a pas a etre
 * redeclaree.
 */
export function metadataServices(locale: Locale): Metadata {
  const t = TEXTES[locale];
  const titreComplet = `${t.seoTitre} — ${SITE_NAME}`;
  return {
    title: t.seoTitre,
    description: t.seoDescription,
    alternates: alternatesPage(CHEMIN, locale),
    openGraph: openGraphPage(
      { titre: titreComplet, description: t.seoDescription, chemin: CHEMIN },
      locale,
    ),
    twitter: {
      card: "summary_large_image",
      title: titreComplet,
      description: t.seoDescription,
    },
  };
}

export const metadata: Metadata = metadataServices("fr");

/**
 * LE CTA DE DEVIS, EN LIEN, ET LOCALISE.
 *
 * C est components/BoutonDevis.tsx au caractere pres — meme balise, meme
 * classe par defaut, meme encodage du sujet —, A UNE DIFFERENCE PRES : le
 * chemin passe par `lien(locale, …)`. Le composant partage ecrit `/devis?p=…`
 * en dur ; sur `/en/services` cela renverrait le lecteur anglophone dans le
 * parcours francais.
 *
 * >>> IL A VOCATION A DISPARAITRE. Le jour ou components/BoutonDevis.tsx prend
 * >>> une `locale` — comme l ont deja fait Nav, MenuOverlay, FooterContact et
 * >>> ContactForm —, ces quelques lignes se suppriment et les huit appels
 * >>> ci-dessous repassent sur le composant. Ce fichier ne pouvait pas le
 * >>> modifier : d autres agents y travaillaient au meme moment.
 *
 * En francais `lien("fr", x)` rend `x` a l octet pres : le HTML des huit CTA
 * de cette page est donc rigoureusement celui d avant.
 */
function LienDevis({
  locale,
  sujet,
  className = "lnk",
  children,
}: {
  locale: Locale;
  sujet: string;
  className?: string;
  children: React.ReactNode;
}) {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <a
      className={className}
      href={lien(locale, `/devis?p=${encodeURIComponent(sujet)}`)}
    >
      {children}
    </a>
  );
}

/**
 * UNE PRESTATION EN CARTE, LOCALISEE.
 *
 * C est components/CarteService.tsx dans son seul mode utilise ici
 * (`versSaPage`) — meme balise, memes classes, meme ordre d elements —, AVEC
 * LA LANGUE EN PLUS. Le composant partage lit `service.name`,
 * `service.description`, `QUOTE_LABEL` et `TVA_LABEL`, c est-a-dire quatre
 * chaines francaises : rendu tel quel sur `/en/services`, il afficherait
 * « sur devis » et « TVA comprise » sous chaque prix d une page anglaise. La
 * seconde de ces deux mentions a valeur legale.
 *
 * >>> IL A VOCATION A DISPARAITRE, exactement comme `LienDevis` ci-dessus.
 * >>> Le jour ou components/CarteService.tsx prend une `locale` — l accueil
 * >>> anglais en aura besoin lui aussi, pour la meme raison —, ces lignes se
 * >>> suppriment et la page repasse sur le composant partage. Ce fichier ne
 * >>> pouvait pas le modifier : d autres agents y travaillaient au meme
 * >>> moment. Tant que les deux coexistent, TOUTE correction de l un doit
 * >>> etre reportee sur l autre.
 *
 * `sobre` N EST PAS REPRIS : c est le second rang de la vitrine de l accueil,
 * et /services ne le passe jamais — le catalogue garde toutes ses
 * descriptions. Un parametre qu aucun appelant n emploie est une divergence
 * qui attend.
 */
function CarteCatalogue({
  service,
  locale,
}: {
  service: ServiceCatalogue;
  locale: Locale;
}) {
  const t = TEXTES[locale];
  // Pas de next/link sur le site public : les revelations au scroll ne
  // s initialisent qu une fois (cf. CLAUDE.md).
  return (
    <a
      className="cat-it"
      href={lien(locale, hrefService(service.slug))}
      data-reveal
    >
      <h3>{nomService(service, locale)}</h3>
      <p className="d">{descriptionService(service, locale)}</p>
      {/* LE PRIX RESTE EN BAS DE CARTE, ET IL PORTE SA MENTION : la regle vaut
          par UNITE DE LECTURE, et un dirigeant qui compare deux cartes ne lit
          pas le bas de page. Le raisonnement complet est dans le docblock de
          components/CarteService.tsx. */}
      {isQuote(service) || service.priceCents === null ? (
        <p className="px px-devis">{libelleDevis(locale)}</p>
      ) : (
        <p className="px">
          {service.priceFrom ? <small>{prefixeDes(locale)}</small> : null}
          {`${formatChfAmount(service.priceCents)}${CHF_UNIT}`}
          {service.isMonthly ? (
            <small className="per">{suffixeMensuel(locale)}</small>
          ) : null}
          <small className="px-note px-tva">{mentionTva(locale)}</small>
        </p>
      )}
      <span className="go">
        {t.carteVoir} <span className="ar">→</span>
      </span>
    </a>
  );
}

/** « Les formules » ouvre la page en (01) ; les familles suivent. */
const numero = (rang: number) => `(${String(rang).padStart(2, "0")})`;

/**
 * UN BLOC DE FAMILLE, rendu deux fois avec deux poids differents.
 *
 * POURQUOI LE BLOC EST FACTORISE. La page rendait ses cinq familles dans une
 * seule boucle, toutes au meme poids. Elle en rend maintenant DEUX suites — la
 * vitrine, puis le second rang — et deux boucles copiees-collees auraient
 * diverge des la premiere correction editoriale. Le seul parametre qui les
 * separe est `sobre`.
 *
 * CE QUE `sobre` CHANGE, ET CE QU IL NE CHANGE PAS. Il n ote AUCUN contenu :
 * l accroche, les cartes avec leurs descriptions, le lien vers la page, la
 * mention de TVA et le devis restent. Il ne fait qu ajouter la classe
 * `.prest-second`, qui descend le titre d une echelle et resserre le bloc.
 * C est la difference avec l accueil, ou le second rang perd ses descriptions :
 * ici on est dans le catalogue, et un catalogue qui ampute ses lignes ne sert
 * plus a rien.
 */
function BlocFamille({
  famille,
  lignes,
  rang,
  locale,
  sobre = false,
}: {
  famille: FamilleRangee;
  lignes: ServiceCatalogue[];
  rang: number;
  locale: Locale;
  sobre?: boolean;
}) {
  const t = TEXTES[locale];
  const bloc = t.blocs[famille.slug];
  return (
    <section id={famille.slug} className={sobre ? "prest-second" : undefined}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal>
            <span className="index">{numero(rang)}</span>&nbsp;{" "}
            {famille.contenu.libelleEn && locale === "en"
              ? famille.contenu.libelleEn
              : famille.contenu.libelle}
          </span>
          <div data-reveal>
            <h2 className="t">
              {bloc.titre[0]}
              <br />
              {bloc.titre[1]}
            </h2>
          </div>
        </div>
        {/* L accroche est celle de la page de la famille, lue telle quelle :
            l index annonce, la page developpe, et les deux ne peuvent pas se
            contredire. Le repli sur le francais est celui que prescrit
            lib/familles.ts — une page lisible en entier vaut mieux qu un trou. */}
        <p className="lede" data-reveal style={{ marginBottom: 34 }}>
          {locale === "en"
            ? (famille.contenu.resoutEn ?? famille.contenu.resout)
            : famille.contenu.resout}
        </p>
        {/* CHAQUE CARTE OUVRE SA PRESTATION, a l ancre de son bloc sur la page
            de la famille. C est la difference avec l accueil, dont les cartes
            ouvrent la famille en haut de page, et elle tient a la promesse de
            celle-ci : on y voit tout ce qui est vendu, et ce qu on y voit
            s ouvre — sur la ligne, pas sur un sommaire. La famille, elle, a
            deja son titre deux fois au-dessus et son lien « tout voir » juste
            en dessous ; la carte le redirait une troisieme fois. */}
        <div className="cat-grid">
          {lignes.map((service) => (
            <CarteCatalogue key={service.id} service={service} locale={locale} />
          ))}
        </div>
        <div className="cat-tout" data-reveal>
          <a className="btn btn-line" href={lien(locale, famille.href)}>
            {bloc.lien} <span className="ar">→</span>
          </a>
        </div>
        <div className="sm-foot">
          <span>{t.mentionTvaPhrase}</span>
          <LienDevis locale={locale} sujet={famille.contenu.sujet}>
            {t.devisLabel}
          </LienDevis>
        </div>
      </div>
    </section>
  );
}

/**
 * LE CORPS DU CATALOGUE — appele par `/services` en francais et par
 * `/en/services` en anglais.
 *
 * Voir l en-tete du fichier : c est une FONCTION appelee, pas un composant
 * rendu, precisement pour que l arbre francais reste celui d avant le chantier.
 */
export async function corpsServices(locale: Locale) {
  const t = TEXTES[locale];

  // UNE seule lecture pour toute la page (cf. lib/catalogue.ts). Les formules
  // gardent leur grille de cartes ; tout le reste est range en familles, le
  // rangement etant partage avec l accueil (lib/catalogue-familles.ts).
  const catalogue = await chargerCatalogue();
  const principal = parCategories(catalogue, ["principal"]);
  // DEUX SUITES, PAS CINQ BLOCS EGAUX. Le classement vient de
  // lib/catalogue-familles.ts, partage avec l accueil : les imprimes et les
  // reseaux sociaux passent devant, avec les formules de site juste au-dessus ;
  // l identite, le suivi et la restauration suivent, dans un traitement plus
  // sobre. Leur reunion est le catalogue entier — aucune ligne ne se perd
  // entre les deux appels.
  const rangeables = parCategories(catalogue, [...CATEGORIES_FAMILLES]);
  const vitrine = parFamilles(rangeables, FAMILLES_EN_VITRINE);
  const second = parFamilles(rangeables, FAMILLES_EN_SECOND);
  // LE PARTAGE ENTRE LES DEUX REGIMES DE PRIX, DERIVE DE LA BASE. Ecrits en
  // dur, ces deux comptes seraient faux au premier ajout au catalogue ou a la
  // premiere ligne masquee depuis /admin — et une phrase qui compte faux
  // discredite celle qui explique. `isQuote` est la condition qui decide deja
  // du rendu de chaque carte : les deux ne peuvent pas se contredire.
  const lignesSurDevis = catalogue.filter(isQuote).length;
  const lignesChiffrees = catalogue.length - lignesSurDevis;

  // Les formules chiffrees prennent la grille de cartes ; celles qui se
  // traitent sur devis passent en ligne pleine largeur dessous, comme le fait
  // deja la grille d accueil. Cette separation n existe que parce que la base
  // distingue FIXED de QUOTE — elle n est ecrite nulle part en dur.
  const cartes = principal.filter((s) => !isQuote(s));
  const surDevis = principal.filter((s) => isQuote(s));

  return (
    <>
      <SchemaPage
        fil={[
          { nom: t.fil.accueil, chemin: lien(locale, "/") },
          { nom: t.fil.services, chemin: lien(locale, CHEMIN) },
        ]}
        locale={locale}
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
          {/* CE PARAGRAPHE ANNONCE L ORDRE REEL DE LA PAGE, et il doit le
              suivre : il enumerait quatre offres a plat, dans un ordre qui
              n etait plus celui des blocs. Un chapo qui decrit une autre page
              que celle qu on lit est un bug, pas une approximation. */}
          <p className="lede" data-reveal>
            {t.chapo}
          </p>
          {/* La comparaison « chez les autres » a ete retiree : le
              positionnement §8 interdit de comparer, nomme ou non. Ce qui la
              remplace nomme l attente par defaut du lecteur — une croyance,
              pas la pratique d un concurrent. */}
          <p className="lede" data-reveal style={{ marginTop: "1.2em" }}>
            {t.delai}
          </p>
          {/* LES DEUX REGIMES DE PRIX, ANNONCES AVANT LA PREMIERE GRILLE.
              Cinq lignes portent un montant, le reste se chiffre sur devis :
              tant que la raison n est pas donnee, « sur devis » se lit comme
              un refus de repondre, et il occupe la majorite du catalogue.
              Le raisonnement est celui de lib/familles.ts, rendu mot pour mot
              comme sur les cinq pages de famille. Les deux comptes sont
              calcules sur la base, jamais ecrits a la main. */}
          <div className="sm-devis" data-reveal style={{ marginTop: "1.6em" }}>
            <p className="sm-devis-t">
              {lignesChiffrees}
              {t.comptePrixFerme}
              {lignesSurDevis}
              {t.compteSurDevis}
            </p>
            <p>{t.mentionDevis}</p>
            <p className="sm-devis-r">{t.mentionReponse}</p>
          </div>
        </div>
      </section>

      {/* ---------- (01) Les formules — en cartes, sur fond pin ---------- */}
      <section className="offres green" id="les-formules">
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              {/* L espace insecable ET le libelle tiennent dans UNE SEULE
                  expression : deux enfants texte cote a cote font ecrire a
                  React un `<!-- -->` entre eux pour borner l hydratation, ce
                  qui changerait le HTML rendu en francais. */}
              <span className="index">(01)</span>
              {`  ${t.formules.meta}`}
            </span>
            <div data-reveal>
              <h2 className="t">
                {t.formules.h2[0]}
                <br />
                {t.formules.h2[1]}
              </h2>
            </div>
          </div>
          <p className="lede" data-reveal style={{ marginBottom: 44 }}>
            {t.formules.lede}
          </p>

          <div className="price-grid">
            {cartes.map((service) => (
              <article className="price" data-reveal key={service.id}>
                {/* MEME LIGNE DE TETE QUE LA GRILLE D ACCUEIL, et lue a la
                    meme source (lib/formules.ts) : « N° 01 / 02 / 03 »
                    numerotait trois cartes qu on voit deja cote a cote.
                    Le repli anglais est celui que prescrit `POUR_QUI_EN` —
                    un libelle manquant retombe sur le francais plutot que de
                    vider la ligne la plus lisible de la carte. */}
                <div className="lab">
                  <span>
                    {estFormule(service.slug)
                      ? locale === "en"
                        ? (POUR_QUI_EN[service.slug] ?? POUR_QUI[service.slug])
                        : POUR_QUI[service.slug]
                      : ""}
                  </span>
                </div>
                {/* Les NOMS des trois formules ne se traduisent pas — article
                    compris. `nameEn` vaut null en base pour cette raison
                    exacte, et `nomService` produit donc « La Vitrine » sur la
                    page anglaise (voice-guide §10, glossaire §5). */}
                <h3>{nomService(service, locale)}</h3>
                <p className="d">{descriptionService(service, locale)}</p>
                {/* Meme rendu que la grille d accueil, `dès` et `/mois`
                    compris : ce sont des drapeaux de la base, et un jour ou
                    une formule les portera, la carte doit suivre sans qu on y
                    revienne. La mention de TVA suit le montant pour la meme
                    raison qu a l accueil : la regle vaut par unite de lecture,
                    et le bas de grille est deja hors du regard. */}
                <p className="num">
                  {service.priceFrom ? <small>{prefixeDes(locale)}</small> : null}
                  {formatChfAmount(service.priceCents as number)}
                  <small>{t.uniteMontant}</small>
                  {service.isMonthly ? (
                    <small className="per">{suffixeMensuel(locale)}</small>
                  ) : null}
                </p>
                <p className="num-tva">{mentionTva(locale)}</p>
                {/* Le lien n existe que pour les trois formules qui ont une
                    page. Un `principal` ajoute en base demain apparait donc
                    dans la grille, mais sans lien mort. */}
                {estFormule(service.slug) ? (
                  <a
                    className="btn btn-line"
                    href={lien(locale, hrefService(service.slug))}
                  >
                    {`${t.formules.voir} `}
                    <span className="ar">→</span>
                  </a>
                ) : null}
              </article>
            ))}
          </div>

          {/* LA LIGNE SUR DEVIS N EST PAS UN LIEN, ET C EST LA CORRECTION.
              Elle en portait un, vers `/services/site-sur-mesure` — une
              adresse que personne ne sert : ce `principal` n a ni page de
              formule ni famille, et la route repondait 404 (constat 10 de la
              revue du 31 aout). Rien n est perdu au passage : la ligne montre
              deja son nom, son regime de prix et sa description en entier, et
              le devis est deux lignes plus bas. Mieux vaut une ligne sans
              porte de sortie qu une porte sur le vide. */}
          {surDevis.map((service) => (
            <div className="p-note" data-reveal key={service.id}>
              <span>
                {nomService(service, locale)}
                {` — ${libelleDevis(locale)}`}
              </span>
              <span>{descriptionService(service, locale)}</span>
            </div>
          ))}

          <div className="p-note" data-reveal>
            <span>{t.mentionTvaPhrase}</span>
            <LienDevis locale={locale} sujet="devis-formules">
              {t.devisLabel}
            </LienDevis>
          </div>
        </div>
      </section>

      {/* ---------- (02) et (03) — la vitrine : imprimes, reseaux ---------- */}
      {vitrine.map((groupe, i) => (
        <BlocFamille
          key={groupe.famille.slug}
          {...groupe}
          rang={i + 2}
          locale={locale}
        />
      ))}

      {/* ---------- la bascule de rang ----------
          Elle n est pas decorative : sans elle, les trois blocs qui suivent se
          liraient comme une baisse de qualite ou un reste de page. Ce qu elle
          dit est exact et verifiable sur cette page meme — ces lignes gardent
          leur bloc, leur accroche, leurs cartes, leur page et leur devis. */}
      <section className="prest-second" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <p className="cat-rang" data-reveal>
            <span>{t.bascule.titre}</span>
          </p>
          {/* Comme sur l accueil, cette phrase ne parle que de cette page :
              decrire une habitude d achat demanderait une source que le studio
              n a pas (positionnement §9). Ce qu elle affirme se verifie en
              descendant l ecran. */}
          <p className="cat-rang-d" data-reveal>
            {t.bascule.texte}
          </p>
        </div>
      </section>

      {/* ---------- (04) a (06) — identite, suivi, restauration ---------- */}
      {second.map((groupe, i) => (
        <BlocFamille
          key={groupe.famille.slug}
          {...groupe}
          rang={vitrine.length + i + 2}
          locale={locale}
          sobre
        />
      ))}

      <FooterContact locale={locale} />
    </>
  );
}

export default async function Services() {
  return corpsServices("fr");
}
