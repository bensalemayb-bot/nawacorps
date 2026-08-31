import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import BoutonDevis from "@/components/BoutonDevis";
import CarteService from "@/components/CarteService";
import FooterContact from "@/components/FooterContact";
import {
  CHF_UNIT,
  FROM_PREFIX,
  MONTHLY_SUFFIX,
  QUOTE_LABEL,
  TVA_LABEL,
  formatChfAmount,
  isQuote,
} from "@/lib/format";
import { POUR_QUI, estFormule } from "@/lib/formules";
import {
  type FamilleSlug,
  MENTION_DEVIS,
  MENTION_REPONSE,
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
  parCategories,
} from "@/lib/catalogue";
import { openGraphPage, whatsapp } from "@/lib/site";

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
  "Le catalogue du studio genevois : trois formules de site, le suivi mensuel, le logo et les imprimés, les réseaux sociaux et les supports de restaurant.";

export const metadata: Metadata = {
  title: "Services et tarifs à Genève",
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: openGraphPage({
    titre: "Services et tarifs à Genève — Nawa Corps",
    description: DESCRIPTION,
    chemin: "/services",
  }),
  /**
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
  twitter: {
    card: "summary_large_image",
    title: "Services et tarifs à Genève — Nawa Corps",
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
  sobre = false,
}: {
  famille: FamilleRangee;
  lignes: ServiceCatalogue[];
  rang: number;
  sobre?: boolean;
}) {
  const bloc = BLOCS[famille.slug];
  return (
    <section id={famille.slug} className={sobre ? "prest-second" : undefined}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal>
            <span className="index">{numero(rang)}</span>&nbsp;{" "}
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
        {/* L accroche est celle de la page de la famille, lue telle quelle :
            l index annonce, la page developpe, et les deux ne peuvent pas se
            contredire. */}
        <p className="lede" data-reveal style={{ marginBottom: 34 }}>
          {famille.contenu.resout}
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
            <CarteService key={service.id} service={service} versSaPage />
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
}

export default async function Services() {
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
          { nom: "Accueil", chemin: "/" },
          { nom: "Services", chemin: "/services" },
        ]}
      />
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
          {/* CE PARAGRAPHE ANNONCE L ORDRE REEL DE LA PAGE, et il doit le
              suivre : il enumerait quatre offres a plat, dans un ordre qui
              n etait plus celui des blocs. Un chapo qui decrit une autre page
              que celle qu on lit est un bug, pas une approximation. */}
          <p className="lede" data-reveal>
            Trois lignes en vitrine. Le site d&apos;abord — c&apos;est le
            produit d&apos;entrée, et ce sur quoi tout le reste vient se
            brancher. Puis les cartes de visite et les imprimés, ce que vos clients
            gardent en main. Puis les réseaux sociaux, tenus au mois.
            Le logo, l&apos;hébergement et les supports de restaurant
            suivent plus bas, entiers.
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
          {/* LES DEUX REGIMES DE PRIX, ANNONCES AVANT LA PREMIERE GRILLE.
              Cinq lignes portent un montant, le reste se chiffre sur devis :
              tant que la raison n est pas donnee, « sur devis » se lit comme
              un refus de repondre, et il occupe la majorite du catalogue.
              Le raisonnement est celui de lib/familles.ts, rendu mot pour mot
              comme sur les cinq pages de famille. Les deux comptes sont
              calcules sur la base, jamais ecrits a la main. */}
          <div className="sm-devis" data-reveal style={{ marginTop: "1.6em" }}>
            <p className="sm-devis-t">
              {lignesChiffrees} lignes portent un prix ferme, {lignesSurDevis} sont
              annoncées sur devis.
            </p>
            <p>{MENTION_DEVIS}</p>
            <p className="sm-devis-r">{MENTION_REPONSE}</p>
          </div>
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
            {cartes.map((service) => (
              <article className="price" data-reveal key={service.id}>
                {/* MEME LIGNE DE TETE QUE LA GRILLE D ACCUEIL, et lue a la
                    meme source (lib/formules.ts) : « N° 01 / 02 / 03 »
                    numerotait trois cartes qu on voit deja cote a cote. */}
                <div className="lab">
                  <span>
                    {estFormule(service.slug) ? POUR_QUI[service.slug] : ""}
                  </span>
                </div>
                <h3>{service.name}</h3>
                <p className="d">{service.description}</p>
                {/* Meme rendu que la grille d accueil, `dès` et `/mois`
                    compris : ce sont des drapeaux de la base, et un jour ou
                    une formule les portera, la carte doit suivre sans qu on y
                    revienne. La mention de TVA suit le montant pour la meme
                    raison qu a l accueil : la regle vaut par unite de lecture,
                    et le bas de grille est deja hors du regard. */}
                <p className="num">
                  {service.priceFrom ? <small>{FROM_PREFIX}</small> : null}
                  {formatChfAmount(service.priceCents as number)}
                  <small>{`${CHF_UNIT} CHF`}</small>
                  {service.isMonthly ? (
                    <small className="per">{MONTHLY_SUFFIX}</small>
                  ) : null}
                </p>
                <p className="num-tva">{TVA_LABEL}</p>
                {/* Le lien n existe que pour les trois formules qui ont une
                    page. Un `principal` ajoute en base demain apparait donc
                    dans la grille, mais sans lien mort. */}
                {estFormule(service.slug) ? (
                  <a className="btn btn-line" href={hrefService(service.slug)}>
                    Voir la formule <span className="ar">→</span>
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
                {service.name}
                {` — ${QUOTE_LABEL}`}
              </span>
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

      {/* ---------- (02) et (03) — la vitrine : imprimes, reseaux ---------- */}
      {vitrine.map((groupe, i) => (
        <BlocFamille key={groupe.famille.slug} {...groupe} rang={i + 2} />
      ))}

      {/* ---------- la bascule de rang ----------
          Elle n est pas decorative : sans elle, les trois blocs qui suivent se
          liraient comme une baisse de qualite ou un reste de page. Ce qu elle
          dit est exact et verifiable sur cette page meme — ces lignes gardent
          leur bloc, leur accroche, leurs cartes, leur page et leur devis. */}
      <section className="prest-second" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <p className="cat-rang" data-reveal>
            <span>Le reste du catalogue</span>
          </p>
          {/* Comme sur l accueil, cette phrase ne parle que de cette page :
              decrire une habitude d achat demanderait une source que le studio
              n a pas (positionnement §9). Ce qu elle affirme se verifie en
              descendant l ecran. */}
          <p className="cat-rang-d" data-reveal>
            Logo et photos, hébergement du site, restaurants et cafés. Trois
            lignes entières, avec leurs prestations, leurs prix et leur devis —
            elles passent après, pas au rabais.
          </p>
        </div>
      </section>

      {/* ---------- (04) a (06) — identite, suivi, restauration ---------- */}
      {second.map((groupe, i) => (
        <BlocFamille
          key={groupe.famille.slug}
          {...groupe}
          rang={vitrine.length + i + 2}
          sobre
        />
      ))}

      <FooterContact />
    </>
  );
}
