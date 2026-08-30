import type { Metadata } from "next";
import { SITE_NAME, openGraphPage, whatsapp } from "@/lib/site";

/**
 * LES CINQ FAMILLES DE PRESTATIONS — la matiere editoriale des pages
 * /prestations/<famille>.
 *
 * POURQUOI DES FAMILLES ET PAS UNE PAGE PAR LIGNE. Le meme raisonnement que
 * lib/formules.ts, applique au reste du catalogue : quinze lignes en base
 * n ont chacune qu un nom, une description d une ligne et un prix. Quinze
 * pages baties la-dessus seraient du contenu mince, et le contenu mince
 * dessert le referencement au lieu de le servir. Regroupees par famille, les
 * memes lignes ont de la matiere : ce qu elles resolvent, ce qu elles
 * produisent, ce qu elles ne couvrent pas, et pourquoi elles se chiffrent sur
 * devis.
 *
 * CE QUI N EST PAS ICI : ni nom, ni description, ni prix. Ils viennent de
 * Postgres (table Service), comme partout ailleurs sur le site. Ce fichier ne
 * connait que des SLUGS. Corriger un prix en base le corrige sur ces pages
 * aussi, et AUCUN montant n est ecrit ici — ni a l ecran, ni dans une reponse
 * de FAQ, ni dans la donnee structuree. C est la raison pour laquelle les
 * questions de la famille « Suivi » renvoient au « prix affiche ci-dessus »
 * plutot que de le repeter : un chiffre recopie dans une phrase est un chiffre
 * qui devient faux le jour ou la base change.
 *
 * LE DELAI. « une semaine » n apparait qu UNE fois sur ces cinq pages — dans
 * la FAQ des imprimes — et il y voyage accompagne de son point de depart
 * (« des votre feu vert »), comme l exige le guide de voix §5. Il n est PAS
 * etendu a un logotype, a une seance photo ou a une carte de restaurant : le
 * positionnement ne porte ce delai que sur le site, et l etendre serait un
 * engagement que personne n a pris.
 *
 * AUCUNE COMPARAISON, AUCUN SUPERLATIF, AUCUNE REFERENCE CLIENT. Le studio a
 * un client et zero reference de site (.agents/product-marketing.md §9) ; les
 * vignettes de ces pages sont des DEMONSTRATIONS, etiquetees comme telles a
 * cote de la piece — voir components/VignettePrestation.tsx.
 */

/**
 * Les cinq segments statiques, dans l ordre ou ils apparaissent au catalogue.
 *
 * Ce sont des SEGMENTS STATIQUES sous app/(site)/prestations/ : ils l emportent
 * sur le voisin [slug], qui ne connait que les trois formules de site. Aucun
 * conflit de route, et aucun de ces cinq mots ne peut donc devenir un slug de
 * formule un jour sans que la page statique gagne — d ou la liste ci-dessous,
 * qui sert aussi de garde-fou a la relecture.
 */
export const FAMILLE_SLUGS = [
  "identite",
  "imprimes",
  "reseaux-sociaux",
  "suivi",
  "restauration",
] as const;

export type FamilleSlug = (typeof FAMILLE_SLUGS)[number];

/**
 * Une prestation de la famille.
 *
 * `slug` est la cle de lecture en base : le NOM, la DESCRIPTION et le PRIX
 * affiches viennent de la ligne Service correspondante, jamais d ici.
 */
export type Piece = {
  /** Slug de la table Service. */
  slug: string;
  /** Ce que c est concretement, dans les mots du client. */
  quoi: string;
  /** Ce que la prestation produit — ce que le client a en main a la fin. */
  produit: readonly string[];
  /**
   * Pourquoi cette ligne se chiffre sur devis. RENDU UNIQUEMENT si la base
   * annonce effectivement « sur devis » : le jour ou un prix ferme est pose en
   * base, l explication disparait d elle-meme au lieu de contredire le montant
   * juste au-dessus.
   */
  raisonDevis?: string;
  /**
   * Formules de site dont cette ligne decoule. Les NOMS sont lus en base, pas
   * ecrits ici. Sert au bloc « Le suivi decoule du palier achete » du
   * positionnement §5 : le suivi n est pas un menu, il suit le site.
   */
  suitFormules?: readonly string[];
  /**
   * Presente = la ligne est OBLIGATOIRE avec les formules liees, et la chaine
   * dit pourquoi. Un prix mensuel impose qui ne serait pas annonce est un prix
   * cache (guide de voix §8, interdit n°4).
   */
  obligatoire?: string;
};

/**
 * Une ligne du bloc « ce qui n est pas compris ».
 *
 * `ou` est TOUJOURS rendu : en lien quand `href` est renseigne, en simple
 * mention sinon. Une ligne qui dirait seulement ce qu on ne fait pas laisse le
 * lecteur sans suite ; celle-ci dit ou aller, ou qu il n y a nulle part ou
 * aller — ce qui est encore une reponse.
 */
export type HorsPerimetre = {
  /** Ce qui n est pas couvert. */
  quoi: string;
  /** Ou ca se trouve. `null` = ca n est pas au catalogue du tout. */
  href: string | null;
  /** Libelle du lien, ou mention rendue telle quelle si `href` vaut null. */
  ou: string;
};

type Question = { q: string; r: string };

type Famille = {
  /** Le h1, en deux lignes. La seconde contient toujours « Genève ». */
  h1: readonly [string, string];
  /** Libelle de la famille, pour le fil et la donnee structuree. */
  libelle: string;
  /** `title` de la page. Sous 60 caracteres, avec « Genève ». */
  seoTitre: string;
  /** `description` de la page. Sous 155 caracteres. */
  seoDescription: string;
  /** `serviceType` du JSON-LD. */
  serviceType: string;
  /** Ce que la famille resout, en deux ou trois phrases. */
  resout: string;
  /** Les prestations, dans l ordre de lecture. */
  pieces: readonly Piece[];
  /** Ce qui n est pas compris, et vers quoi renvoyer. */
  horsPerimetre: readonly HorsPerimetre[];
  /** Deux ou trois questions propres a la famille. */
  questions: readonly Question[];
  /** Amorce du lien WhatsApp — repli si l assistant ne demarre pas. */
  amorce: string;
  /** Identifiant de conversation passe a l assistant par BoutonDevis. */
  sujet: string;
};

/**
 * LA PHRASE DU DEVIS, ECRITE UNE FOIS.
 *
 * Elle n est rendue que si au moins une ligne de la page est effectivement
 * sur devis en base. Elle ne s excuse pas : le devis n est pas une derobade
 * mais la seule facon d annoncer un prix juste sur un support dont le tirage,
 * le format, le papier et l urgence ne sont pas encore connus
 * (prisma/seed.ts, docblock du catalogue).
 *
 * ELLE DIT « LES LIGNES ANNONCEES SUR DEVIS » ET NON « CES PRESTATIONS » : la
 * page du suivi est MIXTE — deux abonnements chiffres, une traduction sur
 * devis. Une phrase qui parlerait de toute la page y serait fausse le jour ou
 * elle a ete ecrite.
 */
export const MENTION_DEVIS =
  "Les lignes annoncées sur devis le sont volontairement. Une prestation se chiffre mal hors contexte : le tirage, le format, le papier, le nombre de pages et l'urgence changent le prix, et un forfait affiché ne serait juste pour personne. Le devis part de ce que vous avez décidé, pas d'une moyenne. Deux allers-retours de correction sont compris, facturés au-delà.";

/** La mention obligatoire sous tout prix affiche. */
export const MENTION_TVA = "Prix en francs suisses, TVA comprise.";

export const FAMILLES: Record<FamilleSlug, Famille> = {
  /* ------------------------------------------------------------------ */
  identite: {
    h1: ["Identité et photographie,", "à Genève."],
    libelle: "Identité & photographie",
    seoTitre: "Identité, logo et photos à Genève",
    seoDescription:
      "Logotype, palette et photos de votre entreprise à Genève. La même identité du site à l'enseigne, et des images cadrées pour le site et la fiche Google.",
    serviceType: "Identité visuelle et photographie d'entreprise",
    resout:
      "Votre logo a été fait une fois, il y a longtemps, et il ne ressemble plus à ce que vous faites aujourd'hui. Vos devis, votre site et votre enseigne ne se ressemblent pas non plus, et les seules photos disponibles sont celles d'un téléphone, prises un jour de pluie. Ici on remet tout d'accord : une identité qui tient, et des images qui montrent votre travail.",
    pieces: [
      {
        slug: "identite-logo",
        quoi: "Le logotype, ses déclinaisons, la palette et les typographies — puis les règles qui disent où va quoi. Le but n'est pas un beau dessin : c'est que votre site, vos cartes, vos devis et votre enseigne se reconnaissent au premier coup d'œil.",
        produit: [
          "Un logotype et ses déclinaisons : fond clair, fond sombre, version d'une seule couleur",
          "Les fichiers vectoriels, qui passent d'une carte de visite à une enseigne sans se dégrader",
          "La palette et les typographies, fixées une fois pour toutes",
          "Une page de règles : tailles minimales, marges, et ce qu'on ne fait pas avec le logo",
        ],
        raisonDevis:
          "Un logotype se chiffre au nombre de pistes explorées et au nombre de supports à décliner. Repartir d'une marque qui existe n'est pas le même travail que partir d'une page blanche, et une enseigne ajoute ses propres contraintes de fabrication.",
      },
      {
        slug: "photos",
        quoi: "Une séance sur votre lieu de travail : l'équipe, l'atelier ou le cabinet, les gestes du métier, et deux ou trois vues qui situent l'endroit. Vous n'avez pas de mise en scène à préparer — on travaille dans ce qui existe, le jour où vous travaillez.",
        produit: [
          "Les images retouchées, livrées en deux tailles : une pour le site, une pour l'impression",
          "Les cadrages carré et vertical que réclament la fiche Google et les réseaux",
          "Un portrait, si vous en voulez un",
          "Les images intégrées au site et à la fiche Google si le site est fait ici",
        ],
        raisonDevis:
          "Une séance se chiffre au temps passé sur place et au nombre d'images retenues. Un cabinet de deux pièces et un atelier avec sa cour ne demandent ni la même demi-journée ni le même matériel, et une prise de vue en extérieur dépend d'un jour qu'on choisit.",
      },
    ],
    horsPerimetre: [
      {
        quoi: "L'impression de vos cartes, affiches et stickers",
        href: "/prestations/imprimes",
        ou: "Imprimés & signalétique",
      },
      {
        quoi: "Le site qui portera cette identité",
        href: "/prestations",
        ou: "Les formules de site",
      },
      {
        quoi: "La production de vos réseaux sociaux au mois",
        href: "/prestations/reseaux-sociaux",
        ou: "Réseaux sociaux",
      },
      {
        quoi: "La carte et les supports de salle d'un restaurant",
        href: "/prestations/restauration",
        ou: "La ligne restauration",
      },
    ],
    questions: [
      {
        q: "Je garde mon logo. Vous pouvez faire le reste ?",
        r: "Oui. Beaucoup de logos n'ont pas besoin d'être refaits, seulement d'être remis au propre et redessinés en fichier vectoriel, avec une palette et des typographies qui tiennent autour. On part de ce qui existe quand ce qui existe est bon, et ça se voit sur le devis.",
      },
      {
        q: "Combien de propositions de logo ?",
        r: "Le nombre de pistes se fixe au devis, avant de commencer, et deux allers-retours de correction sont compris — facturés au-delà. C'est écrit noir sur blanc pour que personne n'ait à compter à la fin.",
      },
      {
        q: "Je veux des photos, mais je n'ai pas de site chez vous.",
        r: "Ces deux prestations se prennent seules. Le site n'est pas un préalable, et rien ne vous oblige à en commander un ensuite : vous repartez avec vos fichiers, utilisables partout.",
      },
    ],
    amorce: whatsapp(
      "Bonjour, j'aimerais un devis pour mon identité et mes photos.",
    ),
    sujet: "devis-identite",
  },

  /* ------------------------------------------------------------------ */
  imprimes: {
    h1: ["Imprimés et signalétique,", "à Genève."],
    libelle: "Imprimés & signalétique",
    seoTitre: "Imprimés et signalétique à Genève",
    seoDescription:
      "Cartes de visite 85 × 55, affiches d'événement et sticker vitrine avec QR, à Genève. Conception, fichiers prêts à imprimer et tirage, sur devis.",
    serviceType: "Conception d'imprimés et de signalétique",
    resout:
      "Vous n'avez plus de cartes à donner, ou celles qui restent ne ressemblent plus à votre entreprise. Une affiche doit partir en vitrine la semaine prochaine et personne dans la maison ne sait la faire. Et les clients contents repartent sans laisser d'avis, faute d'un endroit où cliquer. Trois petits objets, qu'on croise tous les jours.",
    pieces: [
      {
        slug: "carte-visite",
        quoi: "Le format standard, 85 × 55 millimètres, recto-verso. On choisit le papier ensemble — un mat épais ne se tient pas en main comme un brillant fin — puis je m'occupe du fichier, de l'imprimeur et du contrôle avant tirage. Vous recevez les cartes, pas un fichier à débrouiller.",
        produit: [
          "Le dessin recto-verso, décliné pour chaque personne de l'équipe si besoin",
          "Le fichier d'impression aux normes : fonds perdus, marques de coupe, profil couleur",
          "Le tirage commandé, contrôlé et livré",
          "Les fichiers conservés : un retirage ne repart pas de zéro",
        ],
        raisonDevis:
          "Le tirage, le format, le papier et l'urgence changent tout : une petite série sur un papier courant et un gros tirage sur un papier texturé avec marquage n'ont pas le même prix chez l'imprimeur. Le devis est fait sur le papier que vous aurez choisi.",
      },
      {
        slug: "affiche-evenement",
        quoi: "Une affiche qui se lit de loin et qui dit une chose : la date, l'offre, ou le poste à pourvoir. Elle sort en fichier prêt à imprimer, déclinée aux formats dont vous avez besoin — la vitrine, le A4 qu'on distribue, et le carré pour vos réseaux.",
        produit: [
          "L'affiche dessinée, dans votre identité",
          "Les déclinaisons de format : vitrine, A4, carré pour les réseaux",
          "Le fichier prêt à imprimer, à donner à n'importe quel imprimeur",
          "Le fichier source conservé : la même affiche resservira à la date suivante",
        ],
        raisonDevis:
          "Une affiche seule et une série déclinée sur l'année ne demandent pas le même travail, et le format d'impression ne se décide pas avant qu'on sache où elle sera posée.",
      },
      {
        slug: "sticker-avis",
        quoi: "Un autocollant pour la vitrine, la caisse ou le comptoir, avec un QR qui ouvre directement le formulaire d'avis de votre fiche Google. Le client sort son téléphone, scanne, et arrive sur le bon écran sans avoir à chercher votre établissement.",
        produit: [
          "Le sticker dessiné à votre identité, avec le QR testé sur votre fiche",
          "Les formats vitrine et comptoir",
          "Le fichier d'impression, et le tirage si vous préférez que je m'en occupe",
          "Un QR qui pointe sur votre fiche, et qui reste valable tant que la fiche existe",
        ],
        raisonDevis:
          "Le support décide du prix : un vinyle d'extérieur, un adhésif transparent posé côté vitre et un carton de comptoir ne coûtent pas la même chose, et la quantité fait le reste.",
      },
    ],
    horsPerimetre: [
      {
        quoi: "Le logotype, la palette et les typographies que ces imprimés appliquent",
        href: "/prestations/identite",
        ou: "Identité & photographie",
      },
      {
        quoi: "La carte, les chevalets et les supports de salle d'un restaurant",
        href: "/prestations/restauration",
        ou: "La ligne restauration",
      },
      {
        quoi: "Le site, et le formulaire de demande qui va avec",
        href: "/prestations",
        ou: "Les formules de site",
      },
      {
        quoi: "L'enseigne, la vitrophanie grand format et le marquage de véhicule",
        href: null,
        ou: "hors catalogue",
      },
    ],
    questions: [
      {
        q: "Vous imprimez, ou je dois trouver un imprimeur ?",
        r: "Les deux marchent. Pour les cartes de visite, le tirage est compris : je commande, je contrôle, vous recevez. Pour l'affiche et le sticker, vous repartez avec le fichier prêt à imprimer et vous le donnez à qui vous voulez — ou je m'en charge aussi, et ça se décide au devis.",
      },
      {
        q: "Il me faut une affiche pour la semaine prochaine.",
        r: "Le délai du studio est d'une semaine, et il court dès votre feu vert : vous n'avez rien à réunir avant de démarrer. Reste le tirage lui-même, qui suit le calendrier de l'imprimeur et non le mien — on le vérifie avant de lancer, pas après.",
      },
      {
        q: "Je n'ai pas d'identité, juste un vieux logo.",
        r: "On fait avec. Un imprimé se dessine autour de ce qui existe, et s'il faut d'abord remettre le logo au propre, ça apparaît sur le devis plutôt que dans une surprise à la fin.",
      },
    ],
    amorce: whatsapp("Bonjour, j'aimerais un devis pour mes imprimés."),
    sujet: "devis-imprimes",
  },

  /* ------------------------------------------------------------------ */
  "reseaux-sociaux": {
    h1: ["Vos réseaux sociaux,", "tenus depuis Genève."],
    libelle: "Réseaux sociaux",
    seoTitre: "Réseaux sociaux pour PME à Genève",
    seoDescription:
      "Calendrier, création, rédaction, publication et suivi de vos réseaux sociaux, depuis Genève. Vous validez le mois, vous ne produisez rien. Sur devis.",
    serviceType: "Production et gestion de réseaux sociaux",
    resout:
      "Votre page existe, elle n'a pas bougé depuis des mois, et vous savez très bien pourquoi : ce n'est jamais la priorité de la semaine. Publier une fois ne coûte rien ; publier chaque semaine pendant un an, c'est un métier. Ici la ligne est prise en entier — vous validez le mois, vous ne produisez rien.",
    pieces: [
      {
        slug: "reseaux-sociaux",
        quoi: "Le calendrier du mois vous est proposé, vous le validez, et il part. Visuels, textes, publication aux heures utiles, réponses aux commentaires et aux messages : la ligne est tenue de bout en bout. La production est faite avec un partenaire de production du studio, et le travail vous est rendu par moi.",
        produit: [
          "Un calendrier mensuel proposé à l'avance, et validé par vous",
          "Les visuels et les textes, tenus dans votre identité",
          "La publication programmée, sans que vous ayez à y penser",
          "Le suivi des commentaires et des messages reçus",
          "Un point sur ce qui a été publié, et sur ce qu'on change le mois suivant",
        ],
        raisonDevis:
          "Le volume décide de tout : quelques publications par mois sur un seul réseau et un rythme soutenu sur trois réseaux avec de la vidéo ne se produisent pas dans le même temps. Le devis part du rythme que vous voulez tenir, pas d'un forfait qui n'irait à personne.",
      },
    ],
    horsPerimetre: [
      {
        quoi: "La publicité payante et son budget média",
        href: null,
        ou: "hors catalogue",
      },
      {
        quoi: "Les photos et les vidéos à prendre sur place",
        href: "/prestations/identite",
        ou: "Identité & photographie",
      },
      {
        quoi: "Le site vers lequel ces publications renvoient",
        href: "/prestations",
        ou: "Les formules de site",
      },
      {
        quoi: "Les supports imprimés de la même campagne",
        href: "/prestations/imprimes",
        ou: "Imprimés & signalétique",
      },
    ],
    questions: [
      {
        q: "Vous publiez à ma place, ou je dois valider chaque publication ?",
        r: "Vous validez le calendrier du mois, une fois, et ensuite ça part. Si vous préférez relire chaque publication avant qu'elle sorte, c'est possible aussi — ça se décide au départ, pas en cours de route.",
      },
      {
        q: "Qui fait le travail ?",
        r: "La production est faite avec un partenaire de production du studio. C'est moi qui porte le calendrier, qui vous répond et qui vous rend le travail : vous n'avez qu'une conversation à suivre.",
      },
      {
        q: "Je n'ai pas de site chez vous. C'est bloquant ?",
        r: "Non. La ligne se prend seule, sans site chez moi. Si vous en avez un ailleurs, les publications renvoient dessus — il faut simplement qu'il tienne debout sur un téléphone, sinon le trafic qu'on lui envoie ne sert à rien.",
      },
    ],
    amorce: whatsapp(
      "Bonjour, j'aimerais un devis pour la production de mes réseaux sociaux.",
    ),
    sujet: "devis-reseaux-sociaux",
  },

  /* ------------------------------------------------------------------ */
  suivi: {
    h1: ["Suivi et hébergement", "de votre site, à Genève."],
    libelle: "Suivi & hébergement",
    seoTitre: "Suivi et hébergement de site à Genève",
    seoDescription:
      "Hébergement, domaine, mises à jour, sauvegardes et version anglaise de votre site, à Genève. Le suivi démarre la 2ᵉ année, prix TVA comprise.",
    serviceType: "Hébergement, maintenance et traduction de site web",
    resout:
      "Un site n'est pas un objet qu'on pose et qu'on oublie : il s'héberge, il se met à jour, il se sauvegarde, et le nom de domaine se renouvelle chaque année sous peine de tout perdre d'un coup. Le suivi prend ça en charge pour que vous n'ayez plus à y penser — et pour qu'il reste quelqu'un à qui écrire l'année d'après. La version anglaise du site se prend ici aussi : elle s'ajoute à ce qui est en ligne, sans rien refaire.",
    pieces: [
      {
        slug: "hebergement",
        quoi: "Le suivi des deux premières formules de site. L'hébergement, le nom de domaine renouvelé, les mises à jour, les sauvegardes et le certificat de sécurité. Il démarre la deuxième année : la première est comprise dans le prix du site.",
        produit: [
          "L'hébergement du site",
          "Le nom de domaine renouvelé — il reste à votre nom, et il vous suit si vous partez",
          "Les mises à jour et le certificat de sécurité",
          "Les sauvegardes, pour pouvoir revenir en arrière",
        ],
        suitFormules: ["la-vitrine", "le-site"],
      },
      {
        slug: "suivi-assistant",
        quoi: "Le suivi de la formule qui embarque l'assistant. Tout ce qui précède, plus l'assistant lui-même — il consomme des appels d'API tous les mois — et vos modifications de contenu comprises : un tarif qui change, une prestation qui s'ajoute, une photo à remplacer.",
        produit: [
          "Tout ce que comprend le suivi précédent",
          "L'assistant maintenu en service, appels d'API compris",
          "Vos modifications de contenu comprises",
          "L'alerte sur votre téléphone et le tableau de bord des demandes, tenus",
        ],
        suitFormules: ["l-assistant"],
        obligatoire:
          "L'assistant consomme des appels d'API tous les mois ; sans le suivi, il s'arrête.",
      },
      {
        /**
         * ELLE EST ICI ET PLUS SOUS LA RESTAURATION. La ligne s appelait
         * « Traduction de carte FR / EN » ; elle a ete renommee en base
         * « Traduction du site FR / EN » — c est une prestation de site, et sa
         * place est parmi ce qui s ajoute a un site deja en ligne. La laisser
         * avec les cartes de restaurant faussait le rangement du catalogue,
         * lib/catalogue-familles.ts compris, qui derive son index de ces
         * `pieces`.
         */
        slug: "traduction",
        quoi: "La version anglaise de votre site : rédigée et remise en page, pas passée à la machine. Genève travaille en deux langues, et l'anglais s'ajoute très bien à un site déjà en ligne — c'est pour ça que cette ligne se trouve ici. Si votre site est la formule qui embarque l'assistant, elle y est déjà comprise.",
        produit: [
          "La version anglaise rédigée, section par section",
          "La mise en page refaite : l'anglais n'occupe pas la même place que le français",
          "Les titres, les libellés de formulaire et les messages traduits eux aussi",
          "Le sélecteur de langue posé sur le site, et les métadonnées de la version anglaise",
        ],
        raisonDevis:
          "Le prix suit le nombre de signes et le nombre de pages : une page unique n'est pas un site de six sections, et la mise en page est à refaire dans les deux cas. Une carte de restaurant se traduit aussi — ça se dit au devis.",
      },
    ],
    horsPerimetre: [
      {
        quoi: "La refonte du site elle-même, et les trois formules",
        href: "/prestations",
        ou: "Les formules de site",
      },
      {
        quoi: "Une page de plus, une fonction qui n'existait pas au départ",
        href: "/prestations",
        ou: "Le catalogue",
      },
      {
        quoi: "La production de vos réseaux sociaux au mois",
        href: "/prestations/reseaux-sociaux",
        ou: "Réseaux sociaux",
      },
      {
        quoi: "La reprise d'un site fait ailleurs",
        href: null,
        ou: "à regarder avant d'être chiffré",
      },
    ],
    questions: [
      {
        q: "Le suivi est-il obligatoire ?",
        r: "Avec les deux premières formules, non : le site est à vous, et vous pouvez l'héberger ailleurs. Avec la formule qui embarque l'assistant, oui — c'est le prix affiché ci-dessus, et il est annoncé à la signature, pas découvert après. L'assistant consomme des appels d'API en permanence ; sans le suivi, il s'arrête.",
      },
      {
        q: "À partir de quand est-ce que ça se paie ?",
        r: "La deuxième année. La première est comprise dans le prix du site, assistant compris. Le renouvellement se joue donc après douze mois de service rendu, pas au moment où vous décidez d'acheter.",
      },
      {
        q: "Et si je m'en vais ?",
        r: "Le nom de domaine est à votre nom : il vous appartient et il vous suit. Le site aussi. Le suivi s'arrête, et vous repartez avec ce que vous avez payé — il n'y a rien à récupérer chez moi.",
      },
    ],
    amorce: whatsapp("Bonjour, j'aimerais un devis pour le suivi de mon site."),
    sujet: "devis-suivi",
  },

  /* ------------------------------------------------------------------ */
  restauration: {
    h1: ["La ligne restauration,", "à Genève."],
    libelle: "La ligne restauration",
    seoTitre: "Cartes et supports de restaurant à Genève",
    seoDescription:
      "La carte repensée avec sa version en ligne et son QR, chevalets, carte de fidélité, bons cadeaux et supports de saison, pour un établissement genevois.",
    serviceType: "Supports imprimés et numériques pour la restauration",
    resout:
      "La carte est le document le plus lu de votre établissement, et c'est souvent celui qu'on refait le plus vite, entre deux services. Les prix ont bougé trois fois, des plats retirés y figurent encore, et la version en ligne date de l'an dernier. Cette ligne existe pour que la salle se tienne : la carte, ce qu'il y a sur les tables, et ce qu'on donne au client avant qu'il parte.",
    pieces: [
      {
        slug: "la-carte",
        quoi: "La carte reprise en entier : l'ordre des sections, la hiérarchie, la lisibilité des prix, et la place des mentions obligatoires. Elle ressort en trois objets — les fichiers d'impression, une version en ligne lisible sur téléphone, et le QR qui l'ouvre.",
        produit: [
          "La carte redessinée, section par section",
          "Les fichiers prêts à imprimer, au format de vos porte-cartes",
          "La version en ligne, lisible sur téléphone",
          "Le QR qui l'ouvre — à poser sur les tables, en vitrine ou sur l'addition",
          "Le fichier source conservé : le prochain changement de prix ne repart pas de zéro",
        ],
        raisonDevis:
          "Une carte de douze lignes et une carte de quatre pages avec les vins et les suggestions du jour n'occupent pas le même temps, et l'impression dépend du format, du papier et du nombre d'exemplaires. Le devis se fait sur votre carte, pas sur une carte moyenne.",
      },
      {
        slug: "chevalets",
        quoi: "Le petit chevalet qui tient debout sur la table : la suggestion du moment d'un côté, le QR de la carte et le code wifi de l'autre. C'est ce que le client a sous les yeux pendant qu'il attend, et c'est le support le moins cher à renouveler.",
        produit: [
          "Le chevalet dessiné, deux ou trois faces selon le pliage",
          "Le QR de la carte en ligne, testé",
          "Le code wifi placé de façon à pouvoir changer sans refaire tout le chevalet",
          "Le fichier d'impression, et le tirage si vous préférez",
        ],
        raisonDevis:
          "Le format, le pliage, le papier et le nombre de tables décident du tirage — et un chevalet qui reste en terrasse ne se protège pas comme un chevalet d'intérieur.",
      },
      {
        slug: "carte-fidelite",
        quoi: "Le format qui tient dans un portefeuille, dix cases, et un dessin qui donne envie de la garder plutôt que de la vider de sa poche le soir même. Le tampon reste un tampon : rien à installer, rien à expliquer au client, rien qui tombe en panne.",
        produit: [
          "La carte dessinée, recto-verso",
          "Les conditions écrites au dos, en clair",
          "Le fichier d'impression, et le tirage si vous préférez",
          "Le tampon assorti, si vous n'en avez pas",
        ],
        raisonDevis:
          "Le tirage fait le prix : une centaine de cartes et plusieurs milliers ne se commandent pas au même tarif, et le papier change la main.",
      },
      {
        slug: "bons-cadeaux",
        quoi: "Le bon qu'on offre, avec son étui : un montant ou une prestation, un numéro pour le suivre, une date de validité. C'est un objet qu'on donne en main propre — il doit se tenir, sinon il ne fait pas envie et il ne revient jamais en caisse.",
        produit: [
          "Le bon dessiné, avec l'emplacement du montant ou de la prestation",
          "La numérotation, pour suivre ce qui a été vendu et ce qui a été utilisé",
          "L'étui ou l'enveloppe assortis",
          "Les déclinaisons de saison : Noël, Saint-Valentin, fête des mères",
        ],
        raisonDevis:
          "Le nombre de bons, le papier, la numérotation et l'étui font le prix, et une série de Noël ne se commande pas comme une série tenue toute l'année.",
      },
      {
        slug: "pack-saisonnier",
        quoi: "Quatre fois par an, la salle change : la terrasse ouvre, la rentrée arrive, l'Escalade, puis Noël. Le pack prend le passage d'une saison à l'autre en une fois — l'affiche, les publications assorties, et la carte remise à jour.",
        produit: [
          "L'affiche de la saison, déclinée en vitrine et en A4",
          "Les publications assorties pour vos réseaux",
          "La carte mise à jour : prix, plats retirés, suggestions de saison",
          "Les fichiers d'impression, prêts à partir",
        ],
        raisonDevis:
          "Un passage de saison isolé et les quatre de l'année ne se chiffrent pas pareil, et ce que contient le pack se décide avec vous — une affiche seule, ou toute la salle.",
      },
    ],
    horsPerimetre: [
      {
        quoi: "Le site de l'établissement et sa prise de réservation",
        href: "/prestations",
        ou: "Les formules de site",
      },
      {
        quoi: "Le logotype, la palette et l'enseigne",
        href: "/prestations/identite",
        ou: "Identité & photographie",
      },
      {
        quoi: "La production de vos réseaux sociaux au mois",
        href: "/prestations/reseaux-sociaux",
        ou: "Réseaux sociaux",
      },
      {
        quoi: "La version anglaise, du site comme de la carte",
        href: "/prestations/suivi",
        ou: "Suivi & hébergement",
      },
      {
        quoi: "Les plateformes de réservation et de commande en ligne",
        href: null,
        ou: "hors catalogue",
      },
    ],
    questions: [
      {
        q: "Je n'ai pas de site chez vous.",
        r: "Cette ligne est ouverte à qui n'a pas de site chez moi. Elle vit à part des formules, elle est tenue depuis le début du studio, et elle se commande seule.",
      },
      {
        q: "Ma carte change tous les mois.",
        r: "C'est prévu : le fichier source reste ici et il est fait pour être repris. Un changement de prix ou de plat ne redemande pas le travail de mise en page du départ — seulement la mise à jour et les nouveaux fichiers d'impression.",
      },
      {
        q: "Vous imprimez, ou vous livrez les fichiers ?",
        r: "Ça se décide au devis. Je peux livrer les fichiers prêts à imprimer, que vous donnez à votre imprimeur habituel, ou m'occuper du tirage et vous livrer les supports finis.",
      },
    ],
    amorce: whatsapp(
      "Bonjour, j'aimerais un devis pour les supports de mon établissement.",
    ),
    sujet: "devis-restauration",
  },
};

/**
 * Les metadonnees d une page de famille.
 *
 * `openGraphPage()` est repris tel quel de lib/site.ts : Next fusionne les
 * metadata champ par champ mais SANS descendre dans les objets, si bien
 * qu une page qui ne declarerait qu une partie d `openGraph` perdrait
 * siteName, locale et type.
 *
 * LE BLOC `twitter` EST OBLIGATOIRE, et pas par cosmetique : sans lui la page
 * herite de celui du layout, ecrit pour l accueil — titre de l accueil, et une
 * description qui parle de refonte de site alors que la page vend des
 * imprimes ou une carte de restaurant. L image, elle, vient du fichier
 * app/opengraph-image et n a pas a etre redeclaree.
 */
export function metadataFamille(slug: FamilleSlug): Metadata {
  const famille = FAMILLES[slug];
  const titreComplet = `${famille.seoTitre} — ${SITE_NAME}`;
  return {
    title: famille.seoTitre,
    description: famille.seoDescription,
    alternates: { canonical: `/prestations/${slug}` },
    openGraph: openGraphPage({
      titre: titreComplet,
      description: famille.seoDescription,
      chemin: `/prestations/${slug}`,
    }),
    twitter: {
      card: "summary_large_image",
      title: titreComplet,
      description: famille.seoDescription,
    },
  };
}
