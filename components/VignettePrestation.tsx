import type { ReactElement } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * LES VIGNETTES DES PAGES DE FAMILLE — une par prestation, en CSS et en DOM.
 *
 * POURQUOI PAS DES PHOTOS. Il n existe AUCUNE photo de produit dans le depot :
 * public/ ne contient que des logos de marque et l image du noyau. Une balise
 * <img> vers un fichier absent est un defaut visible, et inventer un chemin
 * pour « faire joli en attendant » revient a livrer une page cassee. Le depot
 * sait deja faire autrement : components/ui/feature-carousel.tsx construit ses
 * cinq maquettes entierement en CSS et en DOM. Ces quatorze vignettes suivent
 * le meme principe.
 *
 * OU IRA LA VRAIE PHOTO — mode d emploi, valable pour les quatorze.
 * Chaque vignette porte en tete un commentaire « PHOTO REELLE ICI ». Le jour
 * ou le proprietaire fournit ses visuels :
 *   1. deposer le fichier dans `public/prestations/` (dossier a creer) ;
 *   2. remplacer TOUT le bloc de la vignette par une balise `<img>` avec ses
 *      `width` et `height` explicites — ou par `next/image` si le poids le
 *      justifie — et un `alt` qui decrit la piece ;
 *   3. RETIRER `aria-hidden` de la racine : une vraie piece est du contenu,
 *      pas une illustration ;
 *   4. corriger la legende ci-dessous, qui dit « demonstration ». Si la piece
 *      est un travail realise pour un client, elle ne peut etre publiee
 *      qu avec son accord, et la legende doit dire ce qu elle est.
 * Rien d autre ne bouge : la mise en page vit dans .vg-fig (app/services.css)
 * et ne depend pas de ce qu il y a dedans.
 *
 * `aria-hidden="true"` SUR CHAQUE VIGNETTE. Ce sont des illustrations, pas du
 * contenu : lues a voix haute, elles ne diraient qu une suite de mots isoles.
 * La seule chose qu un lecteur d ecran doit entendre est la legende du
 * <figcaption>, qui reste hors du bloc masque.
 *
 * AUCUN DETAIL LOCALISABLE — la regle est la meme que celle qui a fait
 * corriger le carrousel : pas de nom d entreprise plausible, pas d adresse,
 * pas d annee de fondation, pas de domaine en .ch, aucune note d avis et aucun
 * compteur. Une demonstration qui ressemble a une reference client tombe sous
 * la LCD art. 3, qui vise les indications trompeuses sur ses prestations. Les
 * textes reels sont donc remplaces par des barres neutres, et les seuls mots
 * ecrits sont des libelles d objet (« Recto », « Vitrine », « FR ») ou des
 * categories generiques (« Entrées », « Plats »).
 *
 * AUCUN MONTANT, NULLE PART — y compris dans la vignette de carte de
 * restaurant, ou la colonne des prix est rendue par une barre. Un chiffre
 * ecrit en dur dans une maquette est un chiffre que personne ne corrige
 * jamais, et un visiteur ne fait pas le tri entre le prix d une demonstration
 * et un prix du studio.
 *
 * ---------------------------------------------------------------------------
 * ELLES SONT BILINGUES, ET LEURS MOTS SONT DES LIBELLES D OBJET.
 *
 * Ces quelques dizaines de mots — « Recto », « Entrées », « Le 10ᵉ offert » —
 * ne sont pas de la matiere editoriale : ils nomment ce que le dessin montre.
 * Ils vivent donc ICI, dans le seul fichier qui les rende, et non dans
 * lib/familles.ts (qui ne porte que la matiere des pages) ni dans
 * lib/dictionnaires/ (qui porte les chaines du chrome partage : nav, menu,
 * pied, formulaire). Le jour ou le dictionnaire accueille une section
 * « vignettes », ces deux tables y demenagent d un bloc.
 *
 * LES DEUX TABLES SONT EXHAUSTIVES PAR CONSTRUCTION : `Record<Locale, Libelles>`
 * ne compile pas si une langue ajoutee a lib/i18n.ts n a pas sa colonne, et
 * `Libelles` ne compile pas si un libelle est ajoute d un cote seulement. Une
 * vignette a moitie traduite ne peut donc pas tomber en production.
 *
 * LE FRANCAIS EST INCHANGE AU CARACTERE PRES — chaque chaine de la colonne
 * `fr` est celle qui etait ecrite en dur dans le JSX avant ce chantier.
 */

/**
 * Les libelles d objet des quatorze vignettes, plus la legende.
 *
 * Deux entrees sont des LISTES (`entretien`, `piecesPack`) : elles se
 * traduisent en bloc, jamais ligne a ligne, pour la meme raison que `produitEn`
 * dans lib/familles.ts — deux listes de longueurs differentes n ont aucun moyen
 * de se correspondre.
 */
type Libelles = {
  identiteMicro: string;
  photosPlanche: string;
  recto: string;
  verso: string;
  evenement: string;
  afficheVotre: string;
  afficheMot: string;
  afficheFormats: string;
  calendrier: string;
  carnet: string;
  entretien: readonly string[];
  nouvelleDemande: string;
  assistant: string;
  carte: string;
  entrees: string;
  plats: string;
  versionEnLigne: string;
  suggestion: string;
  carteWifi: string;
  fidelite: string;
  dixiemeOffert: string;
  bonCadeau: string;
  bonSlot: string;
  bonNumero: string;
  piecesPack: readonly string[];
  /**
   * LA LEGENDE EST OBLIGATOIRE, et elle dit « démonstration » en toutes lettres
   * — `demonstration` en anglais, terme impose par
   * docs/agents/brand/glossaire-anglais.md §3, qui proscrit nommement
   * « case study », « portfolio » et « our work ».
   *
   * Le guide de voix §8 impose qu une piece faite par le studio pour montrer
   * soit etiquetee a cote de la piece, pas en note de bas de page. C est aussi
   * la seule partie de la figure qu un lecteur d ecran entend, la vignette
   * elle-meme etant masquee.
   */
  legende: string;
};

const LIBELLES: Record<Locale, Libelles> = {
  fr: {
    identiteMicro: "Marque · palette · typographies",
    photosPlanche: "Planche de sélection",
    recto: "Recto",
    verso: "Verso · 85 × 55",
    evenement: "Événement",
    afficheVotre: "votre",
    afficheMot: "AFFICHE",
    afficheFormats: "Vitrine · A4 · carré",
    calendrier: "Calendrier du mois",
    carnet: "Carnet d'entretien",
    entretien: [
      "Hébergement",
      "Nom de domaine",
      "Mises à jour",
      "Sauvegardes",
      "Certificat",
    ],
    nouvelleDemande: "Nouvelle demande",
    assistant: "Assistant",
    carte: "Carte",
    entrees: "Entrées",
    plats: "Plats",
    versionEnLigne: "Version en ligne",
    suggestion: "Suggestion",
    carteWifi: "Carte · Wi-Fi",
    fidelite: "Fidélité",
    dixiemeOffert: "Le 10ᵉ offert",
    bonCadeau: "Bon cadeau",
    bonSlot: "Montant ou prestation",
    bonNumero: "N°",
    piecesPack: ["Affiche", "Réseaux", "Carte"],
    legende: "Démonstration — illustration dessinée pour cette page.",
  },
  en: {
    identiteMicro: "Mark · palette · typefaces",
    photosPlanche: "Selection sheet",
    recto: "Front",
    verso: "Back · 85 × 55",
    evenement: "Event",
    afficheVotre: "your",
    // Glossaire §3 : « affiche » ⇒ `poster`, jamais `flyer`.
    afficheMot: "POSTER",
    afficheFormats: "Window · A4 · square",
    calendrier: "The month's calendar",
    // Glossaire §3 : « suivi » ⇒ `upkeep`. C est bien l abonnement mensuel
    // qu illustre cette vignette, donc le mot est a sa place ici — a la
    // difference du « suivi des commentaires », qui se dit `kept up with`.
    carnet: "Upkeep log",
    entretien: [
      "Hosting",
      "Domain name",
      "Updates",
      "Backups",
      "Certificate",
    ],
    // Glossaire §3 : « une demande » ⇒ `an enquiry`, jamais `a lead`.
    nouvelleDemande: "New enquiry",
    assistant: "Assistant",
    carte: "Menu",
    entrees: "Starters",
    plats: "Mains",
    versionEnLigne: "Online version",
    suggestion: "Suggestion",
    carteWifi: "Menu · Wi-Fi",
    // Glossaire §3 : « carte de fidélité » ⇒ `loyalty card`, jamais `punch card`.
    fidelite: "Loyalty",
    dixiemeOffert: "The 10th free",
    // Glossaire §3 : « bons cadeaux » ⇒ `gift vouchers`, jamais `gift cards`.
    bonCadeau: "Gift voucher",
    bonSlot: "Amount or service",
    bonNumero: "No.",
    piecesPack: ["Poster", "Social", "Menu"],
    legende: "Demonstration — an illustration drawn for this page.",
  },
};

/* -------------------------------------------------------------------- */
/*  Identité & photographie                                              */
/* -------------------------------------------------------------------- */

/* PHOTO REELLE ICI — la planche d identite reelle (logotype, palette,
   typographies) remplacera ce bloc. Voir le mode d emploi en tete de fichier. */
const IdentiteLogo = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-identite" aria-hidden="true">
    <div className="vg-planche">
      <span className="vg-mark" />
      <div className="vg-swatches">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="vg-spec">
        {/* « Aa » ne se traduit pas : c est un specimen de caractere. */}
        <span className="vg-spec-serif">Aa</span>
        <span className="vg-spec-sans">Aa</span>
      </div>
      <span className="vg-micro">{t.identiteMicro}</span>
    </div>
  </div>
);

/* PHOTO REELLE ICI — une planche de selection issue d une vraie seance
   remplacera cette grille. */
const Photos = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-photos" aria-hidden="true">
    <div className="vg-sheet">
      <i />
      <i className="sel" />
      <i />
      <i />
      <i />
      <i />
    </div>
    <span className="vg-micro">{t.photosPlanche}</span>
  </div>
);

/* -------------------------------------------------------------------- */
/*  Imprimés & signalétique                                              */
/* -------------------------------------------------------------------- */

/* PHOTO REELLE ICI — la photo des cartes imprimees, en main ou sur table,
   remplacera ces deux faces dessinees. */
const CarteVisite = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-cartes" aria-hidden="true">
    <div className="vg-bc vg-bc-recto">
      <span className="vg-mark vg-mark-s" />
      <span className="vg-micro">{t.recto}</span>
    </div>
    <div className="vg-bc vg-bc-verso">
      <i className="vg-bar" style={{ width: "58%" }} />
      <i className="vg-bar vg-thin" style={{ width: "40%" }} />
      <div className="vg-bc-ct">
        <i className="vg-bar vg-thin" style={{ width: "74%" }} />
        <i className="vg-bar vg-thin" style={{ width: "62%" }} />
        <i className="vg-bar vg-thin" style={{ width: "80%" }} />
      </div>
      <span className="vg-micro">{t.verso}</span>
    </div>
  </div>
);

/* PHOTO REELLE ICI — l affiche reelle, photographiee en vitrine ou rendue a
   plat, remplacera cette maquette. */
const AfficheEvenement = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-affiche" aria-hidden="true">
    <div className="vg-poster">
      <span className="vg-over">{t.evenement}</span>
      <div className="vg-poster-big">
        <em>{t.afficheVotre}</em>
        <b>{t.afficheMot}</b>
      </div>
      <i className="vg-bar" style={{ width: "64%" }} />
      <i className="vg-bar vg-thin" style={{ width: "44%" }} />
      <div className="vg-poster-foot">
        <span className="vg-micro">{t.afficheFormats}</span>
        <span className="vg-qr vg-qr-s" />
      </div>
    </div>
  </div>
);

/* LA VIGNETTE `StickerAvis` A ETE RETIREE LE 31 AOUT 2026, AVEC SA PRESTATION.
   Elle dessinait le sticker vitrine « avis Google » — un QR, « Votre avis »,
   « Scannez — 30 secondes ». La ligne `sticker-avis` est sortie de l offre le
   meme jour, en meme temps que la fiche Google : le mot Google ne designe plus
   une prestation nulle part sur le site. Ses deux libelles (`votreAvis`,
   `scannez`) sont partis avec elle des deux colonnes de `LIBELLES`, et son
   entree a quitte la table `VIGNETTES` ci-dessous.
   CE QUI RESTE, ET QUI N EST PAS A MOI : les regles `.vg-sticker`,
   `.vg-sticker-p` et `.vg-sticker-txt` d app/services.css n ont plus de
   markup a styler. Elles sont inertes, pas fausses ; leur suppression appartient
   a qui tient les CSS.
   SI LA LIGNE SURVIVAIT EN BASE, la page ne casserait pas : `VignettePrestation`
   rend `null` pour un slug sans vignette, et la colonne de texte reprend toute
   la largeur. */

/* -------------------------------------------------------------------- */
/*  Réseaux sociaux                                                      */
/* -------------------------------------------------------------------- */

/**
 * Les cases du calendrier qui portent une publication. Rythme purement
 * illustratif : AUCUNE cadence n est promise nulle part sur la page, et un
 * nombre de publications par mois serait un engagement que personne n a pris.
 */
const JOURS_PUBLIES = [2, 5, 9, 12, 16, 19];

/* PHOTO REELLE ICI — une capture du calendrier reellement produit, ou une
   planche des publications d un mois, remplacera cette grille. */
const ReseauxSociaux = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-reseaux" aria-hidden="true">
    <div className="vg-cal">
      <span className="vg-over">{t.calendrier}</span>
      <div className="vg-cal-grid">
        {Array.from({ length: 21 }, (_, jour) => (
          <i
            key={jour}
            className={JOURS_PUBLIES.includes(jour) ? "on" : undefined}
          />
        ))}
      </div>
    </div>
    <div className="vg-post">
      <span className="vg-post-img" />
      <i className="vg-bar" style={{ width: "84%" }} />
      <i className="vg-bar vg-thin" style={{ width: "56%" }} />
    </div>
  </div>
);

/* -------------------------------------------------------------------- */
/*  Suivi & hébergement                                                  */
/* -------------------------------------------------------------------- */

/* PHOTO REELLE ICI — une capture du tableau de suivi reel remplacera ce
   carnet. Aucun chiffre n y figure : un taux de disponibilite affiche serait
   une affirmation sans mesure derriere. */
const Hebergement = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-suivi" aria-hidden="true">
    <div className="vg-panel">
      <span className="vg-over">{t.carnet}</span>
      <ul className="vg-rows">
        {t.entretien.map((ligne) => (
          <li key={ligne}>
            <span>{ligne}</span>
            <i className="vg-ok" />
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* PHOTO REELLE ICI — une capture de l assistant en service et de l alerte
   telephone remplacera cet ecran dessine. */
const SuiviAssistant = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-assistant" aria-hidden="true">
    <div className="vg-phone">
      <div className="vg-notif">
        <i className="vg-dot" />
        <span>{t.nouvelleDemande}</span>
      </div>
      <div className="vg-bubbles">
        <div className="vg-bub vg-bub-in">
          <i className="vg-bar vg-thin" style={{ width: "88%" }} />
          <i className="vg-bar vg-thin" style={{ width: "62%" }} />
        </div>
        <div className="vg-bub vg-bub-out">
          <i className="vg-bar vg-thin" style={{ width: "76%" }} />
          <i className="vg-bar vg-thin" style={{ width: "92%" }} />
          <i className="vg-bar vg-thin" style={{ width: "48%" }} />
        </div>
        <div className="vg-bub vg-bub-in">
          <i className="vg-bar vg-thin" style={{ width: "54%" }} />
        </div>
      </div>
      <span className="vg-micro">{t.assistant}</span>
    </div>
  </div>
);

/* PHOTO REELLE ICI — les deux versions d une meme page, cote a cote,
   remplaceront ces deux colonnes. */
const Traduction = (): ReactElement => (
  <div className="vg vg-traduction" aria-hidden="true">
    {/* « FR » et « EN » sont des CODES DE LANGUE : ils s ecrivent pareil dans
        les deux versions de la page, et c est bien le sujet de la vignette. */}
    <div className="vg-langs">
      <div className="vg-lang">
        <span className="vg-tag">FR</span>
        <i className="vg-bar" style={{ width: "82%" }} />
        <i className="vg-bar vg-thin" style={{ width: "64%" }} />
        <i className="vg-bar vg-thin" style={{ width: "72%" }} />
        <i className="vg-bar vg-thin" style={{ width: "48%" }} />
      </div>
      <div className="vg-lang">
        <span className="vg-tag vg-tag-on">EN</span>
        <i className="vg-bar" style={{ width: "76%" }} />
        <i className="vg-bar vg-thin" style={{ width: "70%" }} />
        <i className="vg-bar vg-thin" style={{ width: "58%" }} />
        <i className="vg-bar vg-thin" style={{ width: "52%" }} />
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------- */
/*  Restaurants et cafes                                                  */
/* -------------------------------------------------------------------- */

/** Largeurs des intitules de plats, en pourcentage. Purement graphique. */
const LIGNES_CARTE = {
  entrees: [46, 58],
  plats: [52, 44],
};

/* PHOTO REELLE ICI — la carte reellement produite (avec l accord du client,
   et presentee pour ce qu elle est) remplacera cette maquette. La colonne des
   prix reste une barre : aucun montant n est ecrit dans une demonstration. */
const LaCarte = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-lacarte" aria-hidden="true">
    <div className="vg-menu">
      <span className="vg-over">{t.carte}</span>
      <p className="vg-grp">{t.entrees}</p>
      {LIGNES_CARTE.entrees.map((largeur) => (
        <div className="vg-line" key={`e${largeur}`}>
          <i className="vg-bar" style={{ width: `${largeur}%` }} />
          <span className="vg-dots" />
          <i className="vg-px" />
        </div>
      ))}
      <p className="vg-grp">{t.plats}</p>
      {LIGNES_CARTE.plats.map((largeur) => (
        <div className="vg-line" key={`p${largeur}`}>
          <i className="vg-bar" style={{ width: `${largeur}%` }} />
          <span className="vg-dots" />
          <i className="vg-px" />
        </div>
      ))}
      <div className="vg-menu-foot">
        <span className="vg-qr vg-qr-s" />
        <span className="vg-micro">{t.versionEnLigne}</span>
      </div>
    </div>
  </div>
);

/* PHOTO REELLE ICI — le chevalet imprime, photographie sur une table,
   remplacera ce pliage dessine. */
const Chevalets = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-chevalets" aria-hidden="true">
    <div className="vg-tent">
      <div className="vg-tent-a">
        <span className="vg-over">{t.suggestion}</span>
        <i className="vg-bar" style={{ width: "80%" }} />
        <i className="vg-bar vg-thin" style={{ width: "56%" }} />
      </div>
      <div className="vg-tent-b">
        <span className="vg-qr vg-qr-s" />
        <span className="vg-micro">{t.carteWifi}</span>
      </div>
    </div>
  </div>
);

/* PHOTO REELLE ICI — la carte a tampons imprimee, avec ses vrais tampons,
   remplacera ce dessin. */
const CarteFidelite = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-fidelite" aria-hidden="true">
    <div className="vg-fid">
      <span className="vg-over">{t.fidelite}</span>
      <div className="vg-stamps">
        {Array.from({ length: 10 }, (_, case_) => (
          <i key={case_} className={case_ < 3 ? "on" : undefined} />
        ))}
      </div>
      <span className="vg-micro">{t.dixiemeOffert}</span>
    </div>
  </div>
);

/* PHOTO REELLE ICI — le bon imprime dans son etui remplacera ce bloc.
   L emplacement du montant reste VIDE : c est une ligne a remplir, pas un
   prix. */
const BonsCadeaux = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-bons" aria-hidden="true">
    <div className="vg-bon">
      <div className="vg-bon-main">
        <span className="vg-over">{t.bonCadeau}</span>
        <i className="vg-bar" style={{ width: "68%" }} />
        <div className="vg-bon-slot">
          <span className="vg-micro">{t.bonSlot}</span>
          <i />
        </div>
        <i className="vg-bar vg-thin" style={{ width: "46%" }} />
      </div>
      <div className="vg-bon-stub">
        <span className="vg-micro">{t.bonNumero}</span>
        <i className="vg-bar vg-thin" style={{ width: "70%" }} />
      </div>
    </div>
  </div>
);

/* PHOTO REELLE ICI — les trois pieces d un vrai passage de saison,
   photographiees ensemble, remplaceront cet empilement.

   LIBELLES COURTS, DANS LES DEUX LANGUES : les trois pieces se chevauchent et
   ne font qu un tiers de la scene chacune. « Publications » et « Carte a jour »
   debordaient de leur piece des que la colonne descendait sous 300 px — d ou
   `Réseaux` / `Social` et non « Réseaux sociaux » / « Social media ». */
const PackSaisonnier = ({ t }: { t: Libelles }): ReactElement => (
  <div className="vg vg-pack" aria-hidden="true">
    <div className="vg-pack-stack">
      {t.piecesPack.map((piece, rang) => (
        <div className={`vg-pack-i vg-pack-${rang + 1}`} key={piece}>
          <span className="vg-micro">{piece}</span>
        </div>
      ))}
    </div>
  </div>
);

/**
 * La table est indexee par le SLUG DE LA BASE, pas par un identifiant maison :
 * une ligne renommee en base garde donc sa vignette, et une ligne ajoutee sans
 * vignette n en affiche simplement aucune plutot que de casser la page.
 *
 * LES VIGNETTES SONT DES FONCTIONS QUI PRENNENT LEURS LIBELLES, et non des
 * composants React qui les recevraient en props. C est deliberé : elles ne sont
 * jamais montees seules, elles n ont ni etat ni cycle de vie, et un appel
 * direct evite quatorze composants intermediaires dans l arbre pour rien.
 * `Traduction` ignore l argument — ses seuls mots sont « FR » et « EN ».
 */
const VIGNETTES: Record<string, (props: { t: Libelles }) => ReactElement> = {
  "identite-logo": IdentiteLogo,
  photos: Photos,
  "carte-visite": CarteVisite,
  "affiche-evenement": AfficheEvenement,
  "reseaux-sociaux": ReseauxSociaux,
  hebergement: Hebergement,
  "suivi-assistant": SuiviAssistant,
  "la-carte": LaCarte,
  chevalets: Chevalets,
  "carte-fidelite": CarteFidelite,
  "bons-cadeaux": BonsCadeaux,
  "pack-saisonnier": PackSaisonnier,
  traduction: Traduction,
};

/**
 * @param locale la langue de la page qui rend la vignette. « fr » par defaut,
 *   pour la meme raison que partout ailleurs : un appelant qui l oublie rend
 *   du francais, pas une vignette vide.
 */
export default function VignettePrestation({
  slug,
  locale = "fr",
}: {
  slug: string;
  locale?: Locale;
}) {
  const Vignette = VIGNETTES[slug];
  // Une ligne ajoutee en base sans vignette ne laisse pas un cadre vide
  // derriere elle : la colonne disparait et le texte reprend toute la largeur.
  if (!Vignette) return null;

  const t = LIBELLES[locale];

  return (
    <figure className="vg-fig">
      <Vignette t={t} />
      <figcaption className="vg-cap">{t.legende}</figcaption>
    </figure>
  );
}
