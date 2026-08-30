import { whatsapp } from "@/lib/site";

/**
 * LES TROIS FORMULES DE SITE — la matiere editoriale des pages
 * /prestations/<slug>.
 *
 * POURQUOI TROIS PAGES ET PAS DIX-HUIT. Le catalogue compte dix-huit lignes en
 * base, mais quinze d entre elles n ont qu un nom, une description d une ligne
 * et un prix. Une page batie sur si peu est du contenu mince : elle DESSERT le
 * referencement au lieu de le servir, parce qu un moteur qui trouve quinze
 * pages interchangeables cesse de faire confiance aux quinze. Les trois
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

type Question = { q: string; r: string };

type Formule = {
  /** Suite du h1, apres le nom lu en base. Contient « Genève ». */
  h1Suite: string;
  /** `title` de la page. Sous 60 caracteres, nom de la formule et Genève. */
  seoTitre: string;
  /** `description` de la page. Sous 155 caracteres. */
  seoDescription: string;
  /** Ce que la formule resout, en deux phrases. */
  resout: string;
  /** Ce que ce palier ajoute au precedent. Vide pour le socle. */
  apporte: readonly string[];
  /** Amorce du lien WhatsApp — repli si l assistant ne demarre pas. */
  amorce: string;
  /** Identifiant de conversation passe a l assistant par BoutonDevis. */
  sujet: string;
  /** Deux ou trois questions propres a la formule. */
  questions: readonly Question[];
  /**
   * Ce qui reste hors perimetre une fois au SOMMET de l echelle. Seul le
   * dernier palier en porte : pour les deux autres, « ce qui n est pas
   * inclus » se deduit des paliers superieurs et n a donc rien a declarer ici.
   */
  auDela?: readonly string[];
};

export const FORMULES: Record<FormuleSlug, Formule> = {
  "la-vitrine": {
    h1Suite: "refonte de site à Genève.",
    seoTitre: "La Vitrine : refonte de site à Genève",
    seoDescription:
      "Votre site de PME genevoise remis à niveau en une semaine, dès votre feu vert. Une page mobile d'abord, formulaire de demande compris, TVA comprise.",
    resout:
      "Votre site a été fait une fois, il y a plus de cinq ans, et personne ne s'en est occupé depuis : il est daté, il se lit mal sur téléphone, et le formulaire ne mène nulle part. La Vitrine le remet à niveau — une page nette, rapide, avec une demande de devis qui arrive vraiment chez vous.",
    apporte: [],
    amorce: whatsapp(
      "Bonjour, La Vitrine m'intéresse pour le site de mon entreprise.",
    ),
    sujet: "devis-la-vitrine",
    questions: [
      {
        q: "Une semaine — à partir de quand exactement ?",
        r: "Dès votre feu vert. C'est la différence : chez les autres, le compteur part quand vous avez fourni vos textes ; ici, quand vous dites oui. Je reprends ce qui est déjà en ligne, je le réécris, et vous me signalez ce qui a changé.",
      },
      {
        q: "Je n'ai ni textes ni photos à jour. C'est bloquant ?",
        r: "Non, et c'est compris dans le prix. Si un site existe, je récupère ce qui s'y trouve et je le remets en forme. S'il n'y a rien, je vous propose une maquette rédigée que vous corrigez. Vous n'avez rien à préparer avant de commencer.",
      },
      {
        q: "Et après la première année ?",
        r: "Le nom de domaine et l'hébergement sont compris la première année. Ensuite le suivi mensuel prend le relais — hébergement, mises à jour, sauvegardes, sécurité. Le domaine reste à votre nom : il vous appartient, et il vous suit si vous partez.",
      },
    ],
  },

  "le-site": {
    h1Suite: "devis et rendez-vous en ligne à Genève.",
    seoTitre: "Le Site : devis et rendez-vous en ligne, Genève",
    seoDescription:
      "Le site de PME genevoise qui prend les rendez-vous et chiffre les devis tout seul. Livré en une semaine dès votre feu vert, prix TVA comprise.",
    resout:
      "Un site présentable ne suffit pas quand votre métier vit de devis et de rendez-vous : il faut que la demande entre, et qu'elle entre complète. Le Site ajoute la prise de rendez-vous en ligne et le devis chiffré automatiquement, pour que le visiteur aille au bout sans avoir à vous appeler d'abord.",
    apporte: [
      "Prise de rendez-vous en ligne, synchronisée avec votre agenda",
      "Devis chiffré automatiquement : le visiteur repart avec une estimation",
      "Fiche Google complétée — photos, horaires, zone d'intervention",
      "Photos de votre entreprise, cadrées pour le site comme pour Google",
    ],
    amorce: whatsapp(
      "Bonjour, Le Site m'intéresse : je veux un site qui reçoive les demandes de devis.",
    ),
    sujet: "devis-le-site",
    questions: [
      {
        q: "Qu'est-ce que ça change par rapport à La Vitrine ?",
        r: "La Vitrine rend votre site présentable et lui donne un formulaire qui fonctionne. Le Site va au bout de la demande : le visiteur réserve son créneau seul, à 23 h comme le dimanche, et repart avec un ordre de grandeur chiffré. Vous recevez une demande qualifiée au lieu de trois lignes vagues.",
      },
      {
        q: "Le devis automatisé chiffre vraiment ?",
        r: "Il pose vos questions — type de prestation, surface, délai, adresse — puis applique vos règles de prix. Le visiteur voit une estimation immédiate, vous recevez le détail. Le devis ferme, lui, reste le vôtre : l'outil qualifie, il n'engage pas.",
      },
      {
        q: "Combien de temps, et à partir de quand ?",
        r: "Une semaine, dès votre feu vert. Les textes de votre site actuel sont repris et réécrits, la fiche Google est complétée par mes soins et les photos sont prises sur place : vous n'avez rien à réunir avant de démarrer.",
      },
    ],
  },

  "l-assistant": {
    h1Suite: "le site qui répond, à Genève.",
    seoTitre: "L'Assistant : site avec assistant IA à Genève",
    seoDescription:
      "Le site de PME genevoise qui répond, qualifie et relance à votre place, jour et nuit. Livré en une semaine dès votre feu vert, prix TVA comprise.",
    resout:
      "Recevoir les demandes est une chose ; les traiter en est une autre, et c'est là que la journée d'un gérant se perd. L'Assistant répond à votre place jour et nuit, vous alerte sur votre téléphone dès qu'une demande arrive, et relance seul ceux qui n'ont pas donné suite.",
    apporte: [
      "Un assistant formé sur vos prestations et vos tarifs, qui répond 24/7",
      "Une alerte sur votre téléphone à chaque demande reçue",
      "Un tableau de bord où toutes les demandes sont réunies",
      "La relance automatique des prospects restés sans réponse",
      "Le site en français et en anglais",
    ],
    amorce: whatsapp(
      "Bonjour, L'Assistant m'intéresse pour le site de mon entreprise.",
    ),
    sujet: "devis-l-assistant",
    // Sommet de l echelle : il n y a plus de palier au-dessus, mais il reste
    // des prestations hors perimetre. Elles vivent toutes au catalogue, sur
    // devis — d ou le renvoi vers /prestations plutot que vers une formule.
    auDela: [
      "Un site multi-pages ou sur-mesure, au-delà de la page unique",
      "Une identité complète ou un logotype",
      "La production de vos réseaux sociaux",
    ],
    questions: [
      {
        q: "L'assistant existe vraiment, ou c'est une promesse ?",
        r: "Il tourne sur ce site : la bulle en bas de l'écran, c'est lui. L'alerte sur le téléphone et le tableau de bord des demandes existent aussi, et servent tous les jours. Ouvrez-le et posez-lui une question — c'est le produit, pas une démonstration.",
      },
      {
        q: "Pourquoi le suivi mensuel est-il obligatoire sur cette formule ?",
        r: "Parce qu'un assistant consomme des appels d'API en permanence, tous les mois, sans fin. Le vendre une seule fois reviendrait à porter une charge perpétuelle sans revenu — et à la couper le jour où elle devient intenable. Le suivi est donc la suite du palier, pas une option à décider.",
      },
      {
        q: "Combien de temps, et à partir de quand ?",
        r: "Une semaine, dès votre feu vert. L'assistant est formé sur vos prestations et vos tarifs pendant cette semaine-là : ce que vous m'auriez dit au téléphone suffit, il n'y a pas de document à préparer.",
      },
    ],
  },
};

/**
 * Ce qui est inclus dans une formule : le socle, plus tout ce qu ajoutent les
 * paliers jusqu a celui-ci compris.
 */
export function inclus(slug: FormuleSlug): string[] {
  const rang = FORMULE_SLUGS.indexOf(slug);
  return [
    ...SOCLE,
    ...FORMULE_SLUGS.slice(0, rang + 1).flatMap((s) => FORMULES[s].apporte),
  ];
}

/**
 * Ce qui n est PAS inclus : exactement ce qu apportent les paliers superieurs,
 * palier par palier — ce qui repond du meme coup a « vers quelle formule
 * monter ». Tableau vide au sommet de l echelle ; la page bascule alors sur
 * `auDela`.
 */
export function manque(
  slug: FormuleSlug,
): { slug: FormuleSlug; lignes: readonly string[] }[] {
  const rang = FORMULE_SLUGS.indexOf(slug);
  return FORMULE_SLUGS.slice(rang + 1).map((superieur) => ({
    slug: superieur,
    lignes: FORMULES[superieur].apporte,
  }));
}
