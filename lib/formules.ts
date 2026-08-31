import type { Locale } from "@/lib/i18n";
import { whatsapp } from "@/lib/site";

/**
 * LES TROIS FORMULES DE SITE — la matiere editoriale des pages
 * /services/<slug>.
 *
 * POURQUOI TROIS PAGES ET PAS DIX-SEPT. Le catalogue compte dix-sept lignes en
 * base, mais quatorze d entre elles n ont qu un nom, une description d une
 * ligne et un prix. Une page batie sur si peu est du contenu mince : elle
 * DESSERT le referencement au lieu de le servir, parce qu un moteur qui trouve
 * quatorze pages interchangeables cesse de faire confiance aux quatorze. Les
 * trois
 * formules, elles, ont de la vraie matiere — ce qu elles resolvent, ce qu elles
 * contiennent, ce qu elles ne contiennent pas, a qui elles s adressent. Ce
 * fichier porte cette matiere, et rien d autre.
 *
 * CE QUI N EST PAS ICI : ni nom, ni description, ni prix. Ils viennent de
 * Postgres (table Service), comme partout ailleurs sur le site — corriger un
 * prix en base le corrige partout. Ce fichier ne connait que des SLUGS.
 *
 * L ECHELLE EST CUMULATIVE, et c est tout l interet. `SOCLE` vaut pour les
 * trois formules ; chaque palier n ecrit ensuite que ce qu il AJOUTE au
 * precedent. « Ce qui est inclus » et « ce qui n est pas inclus » se deduisent
 * donc de la MEME liste : il devient impossible qu une page promette une
 * fonction que la page du palier inferieur ne presente pas comme manquante.
 * Une contradiction entre deux pages de vente se paie deux fois — en confiance
 * a l ecran, et en credibilite aupres des moteurs.
 *
 * PARENTE AVEC components/Offres.tsx. La grille d accueil garde ses quatre
 * puces d accroche, calibrees pour tenir dans une carte de prix ; ici la liste
 * est complete. Les deux decrivent la meme offre, dont la source unique est
 * .agents/product-marketing.md §5 — c est ce document qu on corrige d abord.
 *
 * LE DELAI EST « UNE SEMAINE », partout, sans exception, et il court DES LE
 * FEU VERT. Ni 72 h ni 48 h : ces chiffres ont circule, aucun n est tenu, et
 * un delai rate coute plus cher que le delai gagne.
 *
 * QUATRE FORMULATIONS ONT ETE RETIREES DE CE FICHIER, et ne reviennent pas :
 *  - « chez les autres, le compteur part quand… » : c est une comparaison
 *    publiee. Le positionnement §8 les interdit, nommees ou non. Le fait se
 *    dit desormais sur NOUS, en nommant l attente par defaut du lecteur
 *    (« pas des que vous nous aurez envoye vos textes ») — ce qui decrit une
 *    croyance, pas la pratique de quelqu un d autre.
 *  - « synchronisée avec votre agenda » : aucune source dans le
 *    positionnement, et l affirmation avait deja ete retiree ailleurs. Ce qui
 *    reste est ce que le visiteur voit : il choisit son creneau, il recoit sa
 *    confirmation.
 *  - « sur-mesure » : mot vide du guide de voix, sature chez quatre
 *    concurrents sur six. « à plusieurs pages » dit la meme chose et se
 *    verifie.
 *  - « mobile d abord » : c est « mobile-first » traduit, banni par le
 *    glossaire (entree 13) au profit de « lisible sur téléphone ». Il vivait
 *    dans la `seoDescription` de La Vitrine — c est-a-dire dans l extrait que
 *    Google montre au prospect avant meme qu il ouvre la page.
 *
 * ---
 *
 * LES CHAMPS SUFFIXES `En` PORTENT L ANGLAIS, ET ILS SONT OPTIONNELS EXPRES.
 * C est le motif deja retenu en base, ou `Service` a gagne `nameEn` et
 * `descriptionEn` (prisma/schema.prisma) : tant qu une chaine n est pas
 * traduite, le champ reste ABSENT et le rendu anglais retombe sur le francais.
 * Un repli en francais se lit ; un trou ne se lit pas, et il n arrive jamais
 * sous les yeux de celui qui aurait pu le corriger — il arrive sous ceux du
 * client. Tout consommateur ecrit donc `formule.resoutEn ?? formule.resout`,
 * jamais `formule.resoutEn` seul. La langue courante vient de `lib/i18n.ts`.
 *
 * LES NOMS DES TROIS FORMULES NE SE TRADUISENT PAS — `La Vitrine`, `Le Site`,
 * `L'Assistant`, ARTICLE COMPRIS (docs/agents/brand/voice-guide.md §10 :
 * « jamais abregees, jamais traduites »). Ils apparaissent donc tels quels, en
 * francais, au milieu des phrases anglaises ci-dessous. Ce n est pas une
 * traduction oubliee : « The Showcase », « The Website » ou « The Assistant »
 * ne s ecrivent nulle part. Les noms eux-memes viennent de la base, ou
 * `nameEn` reste null pour cette raison exacte.
 *
 * L ANGLAIS EST BRITANNIQUE, ET IL PARLE A LA PREMIERE PERSONNE DU PLURIEL.
 * `enquiry` jamais `inquiry`, `organisation`, `personalise` ; `we` / `us` /
 * `our`, jamais `I` / `me` / `my`. LA REGLE A ETE RENVERSEE LE 31 AOUT 2026 :
 * elle imposait le singulier au motif que le studio est une personne, et le
 * proprietaire a tranche l inverse. Le studio travaille avec un partenaire de
 * production, le pluriel n est donc pas un mensonge — mais il le deviendrait a
 * la premiere phrase qui annoncerait un effectif, une equipe, des bureaux ou
 * une anciennete : jamais `our team of X`, `our offices`, `our designers`,
 * `since 20XX`. Un pluriel n autorise rien de plus qu un singulier, et c est
 * desormais LA faute la plus facile a commettre en relisant ce fichier.
 * (docs/agents/brand/glossaire-anglais.md, §1 et §2.)
 *
 * LES TROIS REGLES DE FOND NE CHANGENT PAS DE LANGUE : aucun delai en heures
 * (`one week` seul existe, et il porte toujours son point de depart ou ce qui
 * est livre), aucun prix sans `VAT included` dans la meme unite de lecture,
 * aucune comparaison ni concurrent, meme implicite. La LCD art. 3 ne s arrete
 * pas a la frontiere de la langue.
 */

/**
 * Les seuls slugs qui ouvrent une page de formule, dans l ordre de l echelle
 * tarifaire. C est cet ORDRE qui fait fonctionner `inclus()` et `manque()` :
 * le rang d un slug dans ce tableau EST son palier.
 */
export const FORMULE_SLUGS = ["la-vitrine", "le-site", "l-assistant"] as const;

export type FormuleSlug = (typeof FORMULE_SLUGS)[number];

/**
 * Garde de type : tout ce qui arrive par l URL est une chaine quelconque, et
 * doit passer par ici avant de servir d index dans FORMULES. Un slug inconnu
 * mene a notFound(), jamais a une page vide.
 */
export function estFormule(valeur: string): valeur is FormuleSlug {
  return (FORMULE_SLUGS as readonly string[]).includes(valeur);
}

/**
 * CE QUE LA FORMULE FAIT FAIRE AU SITE, en trois mots, en tete de carte.
 *
 * CE QUI OCCUPAIT CETTE PLACE : « N° 01 », « N° 02 », « N° 03 ». La ligne la
 * plus haute et la plus lisible de la carte servait a numeroter trois cartes
 * qu on voit deja cote a cote — un rang de tri, pas une information. Personne
 * ne choisit la deuxieme formule parce qu elle est la deuxieme.
 *
 * Les trois libelles reprennent la colonne « Pour qui » de
 * .agents/product-marketing.md §5 et forment une echelle qui se lit d un coup
 * d oeil : etre presentable, recevoir les demandes, ne plus les traiter
 * soi-meme. C est la question que le lecteur se pose devant trois prix.
 *
 * ILS VIVENT ICI ET NON DANS components/Offres.tsx parce que DEUX grilles les
 * rendent — l accueil et /services —, et que deux copies d un meme libelle
 * divergent au premier arbitrage. Le Record est indexe par FormuleSlug : une
 * formule ajoutee sans libelle ne compile pas.
 */
export const POUR_QUI: Record<FormuleSlug, string> = {
  "la-vitrine": "Être présentable",
  "le-site": "Recevoir les demandes",
  "l-assistant": "Les traiter sans vous",
};

/**
 * POUR_QUI en anglais. `Partial` VOLONTAIREMENT, la ou POUR_QUI est un Record
 * complet : le francais est OBLIGATOIRE — une formule sans libelle ne compile
 * pas —, l anglais est un supplement. Un libelle anglais manquant doit faire
 * retomber la carte sur le francais, pas vider la ligne la plus haute et la
 * plus lisible de la carte. Le rendu ecrit donc
 * `POUR_QUI_EN[slug] ?? POUR_QUI[slug]`.
 *
 * L echelle se lit d un coup d oeil dans les deux langues, et c est tout ce
 * qu on lui demande : etre presentable, recevoir les demandes, ne plus les
 * traiter soi-meme.
 */
export const POUR_QUI_EN: Partial<Record<FormuleSlug, string>> = {
  "la-vitrine": "Look presentable",
  "le-site": "Receive enquiries",
  "l-assistant": "Handle them without you",
};

/**
 * Le socle, commun aux trois formules — c est La Vitrine, et c est ce que
 * toutes les autres contiennent aussi.
 *
 * Le FORMULAIRE est dans le socle, des l entree de gamme. C est assume : en
 * 2026 un site sans formulaire qui fonctionne n est pas un site. Ce qui fait
 * monter en gamme, ce n est plus de RECEVOIR une demande, c est de la TRAITER
 * sans y penser.
 */
export const SOCLE: readonly string[] = [
  "Une page unique, dessinée pour le téléphone avant l'écran",
  "Un formulaire de demande qui fonctionne et qui vous arrive rempli",
  "Appel, itinéraire et horaires accessibles en un geste",
  "Vos textes actuels repris et réécrits — vous ne fournissez rien",
  "Nom de domaine et hébergement compris la première année",
  "Deux allers-retours de correction compris",
];

/**
 * Le socle en anglais.
 *
 * PARALLELE A `SOCLE`, LIGNE PAR LIGNE ET DANS LE MEME ORDRE : c est cette
 * correspondance d INDEX qui permet le repli, `SOCLE_EN[i] ?? SOCLE[i]`.
 * Ajouter une ligne au socle sans l ajouter ici decale tout ce qui suit, et le
 * decalage est silencieux — la page afficherait l anglais d une autre puce.
 * Les deux listes se modifient ensemble, ou pas du tout.
 *
 * « designed for the phone before the computer screen » et non « mobile-first »
 * ni « responsive » : le glossaire anglais (entree « lisible sur téléphone »)
 * bannit les deux, exactement comme le glossaire francais.
 */
export const SOCLE_EN: readonly string[] = [
  "A single page, designed for the phone before the computer screen",
  "An enquiry form that works, and that reaches you filled in",
  "Call, directions and opening hours, one tap away",
  "Your existing text reused and rewritten — you supply nothing",
  "Domain name and hosting included for the first year",
  "Two rounds of corrections included",
];

type Question = {
  q: string;
  r: string;
  /**
   * La meme question en anglais. `qEn` et `rEn` vont PAR PAIRE : traduire la
   * question sans la reponse afficherait une question anglaise suivie d un
   * paragraphe francais, ce qui est pire que le repli complet. Absentes toutes
   * les deux, l entree reste en francais.
   */
  qEn?: string;
  rEn?: string;
};

type Formule = {
  /** Suite du h1, apres le nom lu en base. Contient « Genève ». */
  h1Suite: string;
  /** Idem en anglais. Contient « Geneva » — jamais « Switzerland ». */
  h1SuiteEn?: string;
  /** `title` de la page. Sous 60 caracteres, nom de la formule et Genève. */
  seoTitre: string;
  /** Idem en anglais, meme limite de 60 caracteres, et « Geneva » dedans. */
  seoTitreEn?: string;
  /** `description` de la page. Sous 155 caracteres. */
  seoDescription: string;
  /**
   * Idem en anglais, meme limite de 155 caracteres — c est l extrait que
   * Google montre AVANT que la page ne s ouvre : les deux regles de fond y
   * valent double, « one week » y porte son point de depart et « VAT included »
   * y accompagne toute mention de prix.
   */
  seoDescriptionEn?: string;
  /** Ce que la formule resout, en deux phrases. */
  resout: string;
  /** Idem en anglais. */
  resoutEn?: string;
  /** Ce que ce palier ajoute au precedent. Vide pour le socle. */
  apporte: readonly string[];
  /**
   * Idem en anglais, PARALLELE A `apporte` ligne par ligne, meme regle d index
   * que `SOCLE_EN` : `apporteEn?.[i] ?? apporte[i]`. Les deux listes bougent
   * ensemble.
   */
  apporteEn?: readonly string[];
  /**
   * LE LIBELLE DU BOUTON DE DEVIS, ET IL EST PROPRE AU PALIER.
   *
   * Les trois pages concluaient sur le meme « Demander un devis ». Sur Le Site
   * c etait une contradiction lisible a un ecran d intervalle : la page affiche
   * un prix ferme en tete, puis demande un devis pour ce qui est deja chiffre.
   * Le guide de voix §7 donne un libelle par palier, et chacun promet le
   * BENEFICE du palier plutot que la demarche — refaire le site, recevoir les
   * demandes, les automatiser. « Demander un devis » reste le libelle de la
   * carte du studio et des cinq familles, ou le prix, lui, est reellement a
   * etablir.
   */
  cta: string;
  /**
   * Idem en anglais : meme regle, verbe + BENEFICE du palier, jamais la
   * demarche. « Request a quote » ne s ecrit sur aucune des trois pages, pour
   * la raison exacte donnee ci-dessus — le prix y est deja ferme.
   */
  ctaEn?: string;
  /** Amorce du lien WhatsApp — repli si l assistant ne demarre pas. */
  amorce: string;
  /**
   * Idem en anglais. C est le VISITEUR qui parle, donc son message est en
   * anglais — mais le nom de la formule reste francais a l interieur, parce
   * que c est le nom que le studio lira dans WhatsApp.
   */
  amorceEn?: string;
  /**
   * Identifiant de conversation passe a l assistant par BoutonDevis.
   * NON EDITORIAL : il ne se traduit pas. Il sert de cle cote assistant et
   * cote base ; le traduire couperait le fil des conversations anglaises.
   */
  sujet: string;
  /** Deux ou trois questions propres a la formule. */
  questions: readonly Question[];
  /**
   * Ce qui reste hors perimetre une fois au SOMMET de l echelle. Seul le
   * dernier palier en porte : pour les deux autres, « ce qui n est pas
   * inclus » se deduit des paliers superieurs et n a donc rien a declarer ici.
   */
  auDela?: readonly string[];
  /**
   * Idem en anglais, PARALLELE A `auDela` ligne par ligne. Deux optionnels
   * empiles, et ils ne disent pas la meme chose : `auDela` est absent parce
   * qu il n y a rien a declarer hors du sommet de l echelle, `auDelaEn` est
   * absent parce que la traduction n est pas faite. Le repli les distingue de
   * lui-meme — `auDelaEn?.[i] ?? auDela?.[i]`.
   */
  auDelaEn?: readonly string[];
};

export const FORMULES: Record<FormuleSlug, Formule> = {
  "la-vitrine": {
    h1Suite: "refonte de site à Genève.",
    // Le h1 se lit « La Vitrine — website rebuild in Geneva. » : le nom vient
    // de la base et reste francais, la suite est anglaise.
    h1SuiteEn: "website rebuild in Geneva.",
    seoTitre: "La Vitrine : refonte de site à Genève",
    // « rebuild » et non « redesign » ni « revamp » : glossaire anglais,
    // entree « remise à niveau / refonte ».
    seoTitreEn: "La Vitrine: website rebuild in Geneva",
    seoDescription:
      "Votre site de PME genevoise remis à niveau en une semaine, dès votre feu vert. Une page lisible sur téléphone, formulaire de demande compris, TVA comprise.",
    // « small business » et non « SME » : glossaire, entree PME. « one week »
    // y voyage avec « from your go-ahead ».
    seoDescriptionEn:
      "Your Geneva small business site brought up to date in one week, from your go-ahead. One page, readable on a phone, enquiry form included, VAT included.",
    resout:
      "Votre site a été fait une fois, il y a plus de cinq ans, et personne ne s'en est occupé depuis : il est daté, il se lit mal sur téléphone, et le formulaire ne mène nulle part. La Vitrine le remet à niveau — une page nette, rapide, avec une demande de devis qui arrive vraiment chez vous.",
    // « dated », jamais « outdated » ni rien de moqueur : le site date du
    // prospect est exactement celui qu on lui montre (guide de voix §4).
    resoutEn:
      "Your site was built once, more than five years ago, and no one has looked after it since: it is dated, it reads badly on a phone, and the form leads nowhere. La Vitrine brings it up to date — one clean, fast page, with a quote enquiry that actually reaches you.",
    apporte: [],
    // Vide dans les deux langues, et ce n est pas un oubli : La Vitrine EST le
    // socle, elle n ajoute rien a ce que SOCLE / SOCLE_EN portent deja.
    apporteEn: [],
    cta: "Rendre mon site présentable",
    ctaEn: "Make my site presentable",
    amorce: whatsapp(
      "Bonjour, La Vitrine m'intéresse pour le site de mon entreprise.",
    ),
    amorceEn: whatsapp(
      "Hello, I am interested in La Vitrine for my company's website.",
    ),
    sujet: "devis-la-vitrine",
    questions: [
      {
        q: "Une semaine — à partir de quand exactement ?",
        r: "Dès votre feu vert. Pas dès que vous nous aurez envoyé vos textes et vos photos — c'est ce qu'on attend d'habitude, et c'est précisément ce que vous n'avez pas à faire ici. Nous reprenons ce qui est déjà en ligne, nous le réécrivons, et vous nous signalez ce qui a changé.",
        qEn: "One week — starting exactly when?",
        // « that is what people expect » nomme l attente du lecteur, pas la
        // pratique d un concurrent : la comparaison reste interdite en anglais
        // comme en francais.
        rEn: "From your go-ahead. Not from the moment you send us your text and your photos — that is what people expect, and it is exactly what you do not have to do here. We take what is already online, we rewrite it, and you tell us what has changed.",
      },
      {
        q: "Je n'ai ni textes ni photos à jour. C'est bloquant ?",
        r: "Non, et c'est compris dans le prix. Si un site existe, nous récupérons ce qui s'y trouve et nous le remettons en forme. S'il n'y a rien, nous vous proposons une maquette rédigée que vous corrigez. Vous n'avez rien à préparer avant de commencer.",
        qEn: "I have no up-to-date text or photos. Is that a problem?",
        // « before the work starts » et non « before we start » : depuis le
        // 31 aout 2026 « we » designe LE STUDIO, et lui seul. Un « we » qui
        // engloberait aussi le client ferait lire deux choses sous un mot.
        rEn: "No, and it is included in the price. If a site exists, we take what is on it and put it back into shape. If there is nothing, we propose a mock-up with the wording already written, which you then correct. You have nothing to prepare before the work starts.",
      },
      {
        q: "Et après la première année ?",
        r: "Le nom de domaine et l'hébergement sont compris la première année. Ensuite le suivi mensuel prend le relais — hébergement, mises à jour, sauvegardes, sécurité. Le domaine reste à votre nom : il vous appartient, et il vous suit si vous partez.",
        qEn: "And after the first year?",
        // « upkeep » et non « maintenance », « support » ou « care plan » :
        // glossaire anglais, entree « suivi ».
        rEn: "The domain name and hosting are included for the first year. After that the monthly upkeep takes over — hosting, updates, backups, security. The domain stays in your name: it belongs to you, and it follows you if you leave.",
      },
    ],
  },

  "le-site": {
    h1Suite: "devis et rendez-vous en ligne à Genève.",
    h1SuiteEn: "quotes and appointments online in Geneva.",
    seoTitre: "Le Site : devis et rendez-vous en ligne, Genève",
    seoTitreEn: "Le Site: online quotes and appointments, Geneva",
    seoDescription:
      "Le site de PME genevoise qui prend les rendez-vous et chiffre les devis tout seul. Livré en une semaine dès votre feu vert, prix TVA comprise.",
    // « takes appointments » et non « books » : le glossaire ecarte
    // « a booking » au profit de « an appointment ».
    seoDescriptionEn:
      "The Geneva small business site that takes appointments and prices quotes on its own. Delivered in one week from your go-ahead, VAT included.",
    resout:
      "Un site présentable ne suffit pas quand votre métier vit de devis et de rendez-vous : il faut que la demande entre, et qu'elle entre complète. Le Site ajoute la prise de rendez-vous en ligne et le devis chiffré automatiquement, pour que le visiteur aille au bout sans avoir à vous appeler d'abord.",
    // « a priced quote » est le terme fixe pour « devis chiffré » — ni
    // « instant estimate », ni « free estimate », tous deux saturés.
    resoutEn:
      "A presentable site is not enough when your trade lives on quotes and appointments: the enquiry has to come in, and it has to come in complete. Le Site adds online appointments and a priced quote worked out automatically, so the visitor can go all the way without having to call you first.",
    apporte: [
      "Prise de rendez-vous en ligne : le visiteur choisit son créneau et reçoit sa confirmation",
      "Devis chiffré automatiquement : le visiteur repart avec une estimation",
      "Photos de votre entreprise, cadrées pour le site",
    ],
    apporteEn: [
      "Online appointments: the visitor picks a slot and gets a confirmation",
      "A priced quote worked out automatically: the visitor leaves with a figure",
      "Photos of your business, framed for the site",
    ],
    cta: "Recevoir mes demandes",
    ctaEn: "Receive my enquiries",
    amorce: whatsapp(
      "Bonjour, Le Site m'intéresse : je veux un site qui reçoive les demandes de devis.",
    ),
    amorceEn: whatsapp(
      "Hello, I am interested in Le Site: I want a site that takes in quote enquiries.",
    ),
    sujet: "devis-le-site",
    questions: [
      {
        q: "Qu'est-ce que ça change par rapport à La Vitrine ?",
        r: "La Vitrine rend votre site présentable et lui donne un formulaire qui fonctionne. Le Site va au bout de la demande : le visiteur réserve son créneau seul, à 23 h comme le dimanche, et repart avec un ordre de grandeur chiffré. Vous recevez une demande qualifiée au lieu de trois lignes vagues.",
        qEn: "What does it change, compared with La Vitrine?",
        // « at 11 at night » est une HEURE DE LA JOURNEE, pas un delai : le
        // compte d heures interdit vise le delai de livraison, pas l horloge
        // du visiteur. Ecrit en toutes lettres pour qu on ne lise pas « 23 h »
        // comme une promesse.
        rEn: "La Vitrine makes your site presentable and gives it a form that works. Le Site takes the enquiry all the way: the visitor picks a slot on their own, at 11 at night or on a Sunday, and leaves with a rough figure. You receive a qualified enquiry instead of three vague lines.",
      },
      {
        q: "Le devis automatisé chiffre vraiment ?",
        r: "Il pose vos questions — type de prestation, surface, délai, adresse — puis applique vos règles de prix. Le visiteur voit une estimation immédiate, vous recevez le détail. Le devis ferme, lui, reste le vôtre : l'outil qualifie, il n'engage pas.",
        qEn: "Does the automated quote really put a number on it?",
        // « timing » et non « deadline » : le « délai » de la question est
        // celui du CLIENT (quand il veut ses travaux), pas celui du studio.
        rEn: "It asks your questions — type of job, surface area, timing, address — then applies your pricing rules. The visitor sees a figure straight away, you receive the detail. The firm quote stays yours: the tool qualifies, it does not commit you.",
      },
      {
        q: "Combien de temps, et à partir de quand ?",
        r: "Une semaine, dès votre feu vert. Les textes de votre site actuel sont repris et réécrits par nos soins, et les photos sont prises sur place : vous n'avez rien à réunir avant de démarrer.",
        qEn: "How long, and starting when?",
        rEn: "One week, from your go-ahead. The text of your current site is reused and rewritten by us, and the photos are taken on site: you have nothing to gather before the work starts.",
      },
    ],
  },

  "l-assistant": {
    h1Suite: "le site qui répond, à Genève.",
    h1SuiteEn: "the site that answers, in Geneva.",
    seoTitre: "L'Assistant : site avec assistant IA à Genève",
    seoTitreEn: "L'Assistant: a site with an AI assistant in Geneva",
    seoDescription:
      "Le site de PME genevoise qui répond, qualifie et relance à votre place, jour et nuit. Livré en une semaine dès votre feu vert, prix TVA comprise.",
    seoDescriptionEn:
      "The Geneva small business site that answers, qualifies and follows up for you, day and night. Delivered in one week from your go-ahead, VAT included.",
    resout:
      "Recevoir les demandes est une chose ; les traiter en est une autre, et c'est là que la journée d'un gérant se perd. L'Assistant répond à votre place jour et nuit, vous alerte sur votre téléphone dès qu'une demande arrive, et relance seul ceux qui n'ont pas donné suite.",
    // « a business owner's day » : la cible est le GERANT — celui qui dirige,
    // vend et fait le metier —, pas un service marketing.
    resoutEn:
      "Receiving enquiries is one thing; handling them is another, and that is where a business owner's day disappears. L'Assistant answers for you day and night, alerts you on your phone as soon as an enquiry comes in, and follows up on its own with the people who never came back.",
    apporte: [
      "Un assistant formé sur vos prestations et vos tarifs, qui répond 24/7",
      "Une alerte sur votre téléphone à chaque demande reçue",
      "Un tableau de bord où toutes les demandes sont réunies",
      "La relance automatique des prospects restés sans réponse",
      "Le site en français et en anglais",
    ],
    // « enquiry » partout, jamais « lead » ni « inquiry ». La derniere ligne
    // decrit le SITE DU CLIENT en deux langues — pas ce site-ci, et pas une
    // prestation de traduction.
    apporteEn: [
      "An assistant trained on your services and your prices, answering 24/7",
      "An alert on your phone for every enquiry received",
      "A dashboard where every enquiry is gathered in one place",
      "Automatic follow-up with those who never came back",
      "The site in French and in English",
    ],
    cta: "Automatiser mes demandes",
    ctaEn: "Automate my enquiries",
    amorce: whatsapp(
      "Bonjour, L'Assistant m'intéresse pour le site de mon entreprise.",
    ),
    amorceEn: whatsapp(
      "Hello, I am interested in L'Assistant for my company's website.",
    ),
    sujet: "devis-l-assistant",
    // Sommet de l echelle : il n y a plus de palier au-dessus, mais il reste
    // des prestations hors perimetre. Elles vivent toutes au catalogue, sur
    // devis — d ou le renvoi vers /services plutot que vers une formule.
    //
    // La liste a ete elargie a ce que le studio vend REELLEMENT hors site :
    // imprimes, photos, reseaux sociaux et ligne restauration. Elle n en
    // citait que trois, ce qui laissait croire que le catalogue s arretait la.
    auDela: [
      "Un site à plusieurs pages, au-delà de la page unique",
      "Une identité complète, un logotype, vos imprimés",
      "Les photos de votre entreprise",
      "La production de vos réseaux sociaux, calendrier compris",
      "La carte et les supports de salle, pour la restauration",
    ],
    // « print » seul, jamais « printed collateral » (glossaire). « front of
    // house » est le mot du metier pour les supports de salle.
    auDelaEn: [
      "A site with several pages, beyond the single page",
      "A full identity, a logotype, your print",
      "Photos of your business",
      "Your social media production, content calendar included",
      "The menu and the front-of-house pieces, for restaurants",
    ],
    questions: [
      {
        q: "L'assistant existe vraiment, ou c'est une promesse ?",
        r: "Il tourne sur ce site : la bulle en bas de l'écran, c'est lui. L'alerte sur le téléphone et le tableau de bord des demandes existent aussi, et servent tous les jours. Ouvrez-le et posez-lui une question — c'est le produit, pas une démonstration.",
        qEn: "Does the assistant really exist, or is it a promise?",
        // La seule preuve que le visiteur verifie lui-meme : elle se dit la ou
        // il est en train de s en servir. « demonstration » est le mot fixe,
        // employe ici au negatif — c est le produit, pas une vitrine.
        rEn: "It runs on this site: the bubble at the bottom of the screen is it. The phone alert and the enquiry dashboard exist too, and are in use every day. Open it and ask it a question — this is the product, not a demonstration.",
      },
      {
        q: "Pourquoi le suivi mensuel est-il obligatoire sur cette formule ?",
        r: "Parce qu'un assistant consomme des appels d'API en permanence, tous les mois, sans fin. Le vendre une seule fois reviendrait à porter une charge perpétuelle sans revenu — et à la couper le jour où elle devient intenable. Le suivi est donc la suite du palier, pas une option à décider.",
        // La question nomme la formule au lieu de traduire « cette formule » :
        // « package », « plan » et « tier » sont des mots de catalogue SaaS, et
        // le nom francais fait le travail sans categorie.
        qEn: "Why is the monthly upkeep compulsory with L'Assistant?",
        rEn: "Because an assistant uses API calls constantly, every month, with no end. Selling it once would mean carrying a permanent cost with no income — and switching it off the day that becomes untenable. The upkeep is therefore part of what you buy here, not an option to decide on.",
      },
      {
        q: "Combien de temps, et à partir de quand ?",
        r: "Une semaine, dès votre feu vert. L'assistant est formé sur vos prestations et vos tarifs pendant cette semaine-là : ce que vous nous auriez dit au téléphone suffit, il n'y a pas de document à préparer.",
        // Meme question que sur Le Site, donc meme traduction au mot pres :
        // un delai qui change de mots change de sens (guide de voix §8).
        qEn: "How long, and starting when?",
        rEn: "One week, from your go-ahead. The assistant is trained on your services and your prices during that same week: what you would have told us on the phone is enough, there is no document to prepare.",
      },
    ],
  },
};

/**
 * LE REPLI D UNE LISTE PARALLELE, ecrit une seule fois pour les trois qui
 * existent — `SOCLE` / `SOCLE_EN`, `apporte` / `apporteEn`, `auDela` /
 * `auDelaEn`.
 *
 * LA REGLE EST CELLE DE L INDEX, et elle est la meme partout : la ligne
 * anglaise de rang `i` traduit la ligne francaise de rang `i`. Une traduction
 * absente fait retomber CETTE LIGNE-LA sur le francais, sans decaler les
 * autres — c est ce que produit `en?.[i] ?? ligne`, et c est pourquoi la
 * longueur de la liste rendue est TOUJOURS celle du francais. Une liste
 * anglaise plus courte ne perd donc aucune puce, et une liste anglaise plus
 * longue n en invente aucune.
 *
 * ELLE EST INTERNE AU MODULE, volontairement : hors d ici, le repli n a plus
 * de liste francaise de reference a laquelle s adosser.
 */
function replier(
  fr: readonly string[],
  en: readonly string[] | undefined,
  locale: Locale,
): string[] {
  return fr.map((ligne, i) => (locale === "en" ? (en?.[i] ?? ligne) : ligne));
}

/**
 * Ce qui est inclus dans une formule : le socle, plus tout ce qu ajoutent les
 * paliers jusqu a celui-ci compris.
 *
 * `locale` EST EN DERNIERE POSITION ET VAUT « fr » PAR DEFAUT, exactement comme
 * dans lib/format.ts et pour la meme raison : les appels ecrits avant le
 * chantier anglais rendent, sans bouger d un octet, ce qu ils rendaient.
 *
 * ELLE PREND UNE LANGUE PLUTOT QUE DE LAISSER LA PAGE ANGLAISE REFAIRE
 * L ASSEMBLAGE. C est la demande explicite que portait le docblock precedent :
 * deux assemblages du meme socle divergent au premier ajout de ligne, et la
 * divergence serait SILENCIEUSE — la page francaise annoncerait une puce que
 * l anglaise ne montre pas, sans qu aucune compilation ne bronche.
 */
export function inclus(slug: FormuleSlug, locale: Locale = "fr"): string[] {
  const rang = FORMULE_SLUGS.indexOf(slug);
  return [
    ...replier(SOCLE, SOCLE_EN, locale),
    ...FORMULE_SLUGS.slice(0, rang + 1).flatMap((s) =>
      replier(FORMULES[s].apporte, FORMULES[s].apporteEn, locale),
    ),
  ];
}

/**
 * Ce qui n est PAS inclus : exactement ce qu apportent les paliers superieurs,
 * palier par palier — ce qui repond du meme coup a « vers quelle formule
 * monter ». Tableau vide au sommet de l echelle ; la page bascule alors sur
 * `auDela`.
 *
 * Meme parametre de langue et meme defaut qu `inclus`, pour la meme raison :
 * les deux listes sortent du MEME `apporte`, et il serait absurde que l une
 * sache se traduire et pas l autre.
 *
 * Les `slug` rendus, eux, ne changent pas de langue : ce sont des identifiants,
 * et la page en tire une URL (`lien(locale, …)`) et un nom lu en base.
 */
export function manque(
  slug: FormuleSlug,
  locale: Locale = "fr",
): { slug: FormuleSlug; lignes: readonly string[] }[] {
  const rang = FORMULE_SLUGS.indexOf(slug);
  return FORMULE_SLUGS.slice(rang + 1).map((superieur) => ({
    slug: superieur,
    lignes: replier(
      FORMULES[superieur].apporte,
      FORMULES[superieur].apporteEn,
      locale,
    ),
  }));
}

/**
 * Ce qui reste hors perimetre au SOMMET de l echelle, dans la langue demandee.
 *
 * Tableau VIDE pour les deux premiers paliers, et c est la meme reponse que
 * celle du champ : au-dessous du sommet, « ce qui n est pas inclus » se deduit
 * des paliers superieurs (`manque`) et il n y a rien a declarer. La page n a
 * donc pas a distinguer « absent parce qu il n y a rien » de « absent parce que
 * la traduction manque » — `replier` s en charge, et il ne peut rendre une
 * ligne anglaise que la ou une ligne francaise existe.
 */
export function auDela(slug: FormuleSlug, locale: Locale = "fr"): string[] {
  const formule = FORMULES[slug];
  return replier(formule.auDela ?? [], formule.auDelaEn, locale);
}

/**
 * Les questions de la formule, dans la langue demandee.
 *
 * LA PAIRE EST INDIVISIBLE — c est la regle que porte le type `Question`, et
 * elle est appliquee ICI parce que c est le seul endroit qui la voit : une
 * question anglaise suivie d une reponse francaise est pire que l entree
 * entierement francaise, elle donne a lire une page qui a perdu le fil. Les
 * deux champs presents, l entree passe en anglais ; sinon elle reste francaise
 * EN ENTIER.
 *
 * Le tableau rendu sert DEUX consommateurs sur la meme page — les `<details>`
 * visibles et le `FAQPage` de components/SchemaPage.tsx. Il n y a pas de choix
 * a faire : un balisage de Q/R qui ne correspond pas au texte visible est une
 * declaration fausse au moteur, et Google la traite comme telle.
 */
export function questionsDe(
  slug: FormuleSlug,
  locale: Locale = "fr",
): { q: string; r: string }[] {
  return FORMULES[slug].questions.map((item) =>
    locale === "en" && item.qEn && item.rEn
      ? { q: item.qEn, r: item.rEn }
      : { q: item.q, r: item.r },
  );
}
