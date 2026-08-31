import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import type { PriceType } from "../lib/generated/prisma/enums";

type ServiceSeed = {
  slug: string;
  name: string;
  description: string;
  /**
   * Le catalogue en anglais. `null` — jamais `undefined`, jamais omis.
   *
   * La distinction n est pas cosmetique : dans un `update` Prisma, `undefined`
   * veut dire « ne touche pas a cette colonne » et laisse en place ce qui s y
   * trouve deja, tandis que `null` l ecrit vraiment. Ecrire `null` en toutes
   * lettres est donc la seule maniere de garantir qu un re-seed remet la ligne
   * dans l etat decrit par ce fichier.
   *
   * `null` est la valeur de repli assumee : le site anglais retombe alors sur
   * le francais plutot que d afficher un trou (voir le commentaire du modele
   * Service dans prisma/schema.prisma).
   */
  nameEn?: string | null;
  descriptionEn?: string | null;
  category: string;
  priceType: PriceType;
  priceCents: number | null;
  priceFrom: boolean;
  isMonthly: boolean;
  sortOrder: number;
};

/**
 * CATALOGUE — repositionnement PME (voir .agents/product-marketing.md).
 *
 * Prix en centimes CHF, TVA COMPRISE. priceCents null pour les prestations
 * sur devis (QUOTE).
 *
 * REGLE D AFFICHAGE, tranchee par le proprietaire : seules les trois formules
 * de site et les deux abonnements portent un prix affiche. TOUT LE RESTE EST
 * SUR DEVIS, et ce n est pas une derobade — « ca depend ». Un imprime se
 * chiffre selon le tirage, le format, le papier et l urgence : un montant
 * affiche hors contexte serait faux la moitie du temps, et il faudrait le
 * corriger devant le client. Demander deux informations avant de chiffrer
 * donne un prix juste du premier coup.
 *
 * Les slugs des trois formules de sites sont la seule chose que le code
 * connaisse par coeur : components/Offres.tsx indexe son habillage editorial
 * dessus. Les renommer demande de renommer les cles de EDITORIAL au meme
 * moment.
 *
 * LES DESCRIPTIONS ONT ETE REECRITES, ET CE N EST PAS COSMETIQUE. Elles
 * tenaient en trois a cinq mots : « Prête à imprimer », « Dix tampons, un vrai
 * design », « Genève travaille en deux langues ». Ce sont les MEMES chaines
 * qui remplissent les cartes du catalogue sur l accueil et sur /services, et
 * qui nourrissent le prompt de l assistant. Une carte dont la description tient
 * en trois mots ne dit pas ce qu on achete : elle laisse un dirigeant de PME
 * genevoise, qui compare avec des agences a quatre ou huit mille francs, deviner
 * ce qu il y a dedans. Chacune est desormais une phrase qui nomme ce qui est
 * produit.
 *
 * ELLES CONDENSENT lib/familles.ts ET N INVENTENT RIEN. Chaque ligne du
 * catalogue est deja decrite en detail sur la page de sa famille (champs `quoi`
 * et `produit`) : la description est le resume de ce texte-la, jamais une
 * promesse de plus. Deux pages qui se contredisent sur ce que contient une
 * prestation se paient en confiance, et la regle de preuve du guide de voix
 * interdit toute affirmation sans source.
 */
const services: ServiceSeed[] = [
  // ---------- Les trois formules de site ----------
  //
  // LES NOMS DES TROIS FORMULES NE SE TRADUISENT PAS. `nameEn` y vaut `null`,
  // et ce n est pas un oubli : docs/agents/brand/voice-guide.md §10 —
  // « Les trois formules gardent leur nom exact et leur article : La Vitrine,
  // Le Site, L Assistant. Majuscule initiale, jamais au pluriel, jamais
  // abregees, JAMAIS TRADUITES. » Un « The Showcase » ou un « The Assistant »
  // casserait le glossaire, qui impose un mot unique par concept sur toutes
  // les pages et tous les libelles de base.
  //
  // Le repli sur le francais est donc ici le comportement voulu, pas un trou a
  // combler. NE PAS « corriger » ces trois `null`. Leur `descriptionEn`, elle,
  // se traduit comme les autres : c est la phrase de vente, pas le nom propre.
  {
    slug: "la-vitrine",
    name: "La Vitrine",
    description: "Votre site remis à niveau : une page, lisible sur téléphone, et un formulaire de demande qui fonctionne.",
    nameEn: null,
    descriptionEn: "Your site brought up to date: one page, readable on a phone, and an enquiry form that works.",
    category: "principal",
    priceType: "FIXED",
    priceCents: 69900,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 1,
  },
  {
    slug: "le-site",
    name: "Le Site",
    description: "Le site qui reçoit les demandes, prend les rendez-vous et rend une estimation chiffrée, sans vous.",
    nameEn: null,
    descriptionEn: "The site that takes in enquiries, books appointments and returns a priced quote, without you.",
    category: "principal",
    priceType: "FIXED",
    priceCents: 149900,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 2,
  },
  {
    slug: "l-assistant",
    name: "L'Assistant",
    description: "Le site qui répond, qualifie et relance à votre place, la nuit comme le dimanche.",
    nameEn: null,
    descriptionEn: "The site that answers, sorts the serious enquiries and follows up in your place, at night and on Sundays.",
    category: "principal",
    priceType: "FIXED",
    priceCents: 249900,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 3,
  },
  {
    // Le slug reste `site-sur-mesure` : c est une cle, la renommer casserait
    // les lignes deja en base sans rien apporter. Le NOM, lui, ne peut plus
    // dire « sur-mesure » — mot vide du guide de voix, et sature chez quatre
    // concurrents sur six. Il est affiche sur l accueil et sur /services.
    slug: "site-sur-mesure",
    name: "Site à plusieurs pages",
    // Le nom anglais suit la meme regle que le francais : « sur mesure » a ete
    // retire du NOM parce que c est un mot vide, sature chez quatre concurrents
    // sur six. Ses equivalents anglais — « tailor-made », « bespoke »,
    // « custom » — heritent de l interdiction. On dit ce que c est : plusieurs
    // pages.
    nameEn: "Multi-page site",
    description: "Plusieurs pages, plusieurs métiers ou plusieurs zones : le périmètre se définit avant le premier écran.",
    descriptionEn: "Several pages, several lines of work or several service areas: the scope is set before the first screen.",
    category: "principal",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 4,
  },

  // ---------- En continu ----------
  {
    slug: "hebergement",
    name: "Hébergement et suivi du site",
    // « le suivi » (glossaire n°11) se rend par « upkeep », pas par
    // « maintenance » ni « support » : les deux mots que le glossaire interdit
    // en francais font entendre la meme chose en anglais — une hotline, un
    // contrat de depannage. « Upkeep » dit l entretien continu d une chose
    // qu on possede, ce qui est exactement ce qui est vendu.
    nameEn: "Hosting and site upkeep",
    description: "Hébergement, nom de domaine renouvelé, mises à jour, sauvegardes et certificat. Départ la 2ᵉ année.",
    descriptionEn: "Hosting, domain name renewed, updates, backups and security certificate. Starts in the second year.",
    category: "continu",
    priceType: "FIXED",
    priceCents: 4900,
    priceFrom: false,
    isMonthly: true,
    sortOrder: 20,
  },
  {
    slug: "suivi-assistant",
    name: "Hébergement et suivi — avec l'assistant",
    nameEn: "Hosting and upkeep — with the assistant",
    description: "Le même suivi, plus l'assistant lui-même et vos modifications de contenu comprises.",
    descriptionEn: "The same upkeep, plus the assistant itself and your content changes included.",
    category: "continu",
    priceType: "FIXED",
    priceCents: 12900,
    priceFrom: false,
    isMonthly: true,
    sortOrder: 21,
  },
  {
    slug: "reseaux-sociaux",
    name: "Réseaux sociaux — publications et messages, au mois",
    nameEn: "Social media — posts and messages, by the month",
    description: "Le calendrier du mois vous est proposé, vous le validez : visuels, textes, publication et réponses aux messages.",
    descriptionEn: "You are shown the month's calendar and you approve it: visuals, wording, posting and replies to messages.",
    category: "continu",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 22,
  },

  // ---------- En complément ----------
  {
    slug: "carte-visite",
    name: "Cartes de visite — 75 exemplaires imprimés",
    nameEn: "Business cards — 75 printed",
    description: "85 × 55 recto-verso, le papier choisi ensemble, l'imprimeur et le contrôle avant tirage compris.",
    descriptionEn: "85 × 55 mm, both sides, the paper chosen together, the printer and the proof check before printing included.",
    category: "annee",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 10,
  },
  {
    slug: "identite-logo",
    name: "Logo et identité visuelle",
    nameEn: "Logo and visual identity",
    description: "Logotype et déclinaisons, palette, typographies, et les règles qui tiennent le site, les devis et l'enseigne.",
    descriptionEn: "Logotype and its variants, palette, typefaces, and the rules that hold the site, the quotes and the shopfront sign together.",
    category: "annee",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 11,
  },
  {
    slug: "photos",
    name: "Photos de votre entreprise",
    nameEn: "Photographs of your business",
    description: "Une séance sur votre lieu de travail : l'équipe, les gestes du métier, l'endroit. Rien à mettre en scène.",
    descriptionEn: "A session at your workplace: the team, the work as it is done, the place itself. Nothing to stage.",
    category: "annee",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 12,
  },
  {
    slug: "traduction",
    name: "Version anglaise du site",
    nameEn: "English version of your site",
    description: "La version anglaise du site, rédigée et remise en page — elle s'ajoute à ce qui est déjà en ligne.",
    descriptionEn: "The English version of your site, written and laid out — it is added to what is already online.",
    category: "annee",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 13,
  },
  {
    slug: "sticker-avis",
    name: "Sticker vitrine — avis Google",
    // « fiche Google » (glossaire n°10) se rend par « Google listing », jamais
    // par « Google My Business » ni « Business Profile » : le nom commercial du
    // produit Google a deja change deux fois, le mot courant non.
    nameEn: "Window sticker — Google reviews",
    description: "Un QR en vitrine ou au comptoir, qui ouvre le formulaire d'avis de votre fiche Google sans rien chercher.",
    descriptionEn: "A QR code in the window or on the counter that opens the review form on your Google listing, with nothing to search for.",
    category: "annee",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 14,
  },
  {
    slug: "affiche-evenement",
    name: "Affiche — événement, promotion, recrutement",
    nameEn: "Poster — event, promotion, hiring",
    description: "Une affiche qui se lit de loin et qui dit une chose. Fichiers prêts à imprimer : vitrine, A4 et carré.",
    descriptionEn: "A poster that reads from a distance and says one thing. Print-ready files: window, A4 and square.",
    category: "annee",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 15,
  },

  // ---------- Ligne restauration, secondaire ----------
  {
    slug: "la-carte",
    name: "Menu de restaurant",
    nameEn: "Restaurant menu",
    description: "La carte reprise en entier, puis rendue en trois objets : fichiers d'impression, version en ligne et QR.",
    descriptionEn: "The whole menu reworked, then delivered as three things: print files, an online version and a QR code.",
    category: "saison",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 30,
  },
  {
    slug: "carte-fidelite",
    name: "Carte de fidélité à tampons",
    nameEn: "Stamp loyalty card",
    description: "Le format qui tient dans un portefeuille, dix cases, et un tampon — rien à installer, rien à expliquer.",
    descriptionEn: "Wallet-sized, ten boxes and a rubber stamp — nothing to install, nothing to explain.",
    category: "saison",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 31,
  },
  {
    slug: "bons-cadeaux",
    name: "Bons cadeaux",
    // « Gift vouchers », pas « gift cards » : une gift card est une carte a
    // puce ou a solde rechargeable, adossee a une caisse. Ce qui est vendu ici
    // est un imprime avec son etui.
    nameEn: "Gift vouchers",
    description: "Le bon et son étui : un montant ou une prestation, un numéro pour le suivre, une date de validité.",
    descriptionEn: "The voucher and its sleeve: an amount or a service, a number to track it, an expiry date.",
    category: "saison",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 32,
  },
  {
    slug: "chevalets",
    name: "Chevalets de table — menu, QR et wifi",
    // « Table tents » est le mot du metier en anglais pour ce petit chevalet
    // plie. « Table easels » serait un calque : en anglais, un easel est le
    // chevalet du peintre.
    nameEn: "Table tents — menu, QR code and wifi",
    description: "Debout sur la table : la suggestion du moment d'un côté, le QR de la carte et le code wifi de l'autre.",
    descriptionEn: "Standing on the table: today's suggestion on one side, the menu QR code and the wifi password on the other.",
    category: "saison",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 33,
  },
  {
    slug: "pack-saisonnier",
    name: "Pack saisonnier — affiche, publications et menu à jour",
    nameEn: "Seasonal set — poster, posts and updated menu",
    description: "Le passage d'une saison à l'autre en une fois : l'affiche, les publications assorties, la carte à jour.",
    descriptionEn: "The move from one season to the next, done in one go: the poster, the matching posts, the menu brought up to date.",
    category: "saison",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 34,
  },
];

/**
 * Slugs RETIRES du catalogue.
 *
 * L'upsert ne supprime rien : sans ce passage, « Le Pack Complet » resterait
 * en base, visible, a 2'900.– — affiche dans la grille et cite par le chatbot,
 * qui lit la meme table.
 *
 * `visible: false` plutot qu'un delete : la ligne reste consultable depuis
 * /admin. Mais la remettre en service NE demande PAS qu'une case a cocher :
 * l'updateMany ci-dessous s'execute a chaque seed et remasquerait la case
 * cochee au prochain `npm run db:seed`. La remettre en service demande de la
 * retirer de `retires` PUIS de la recocher : tant que son slug est liste ici,
 * chaque seed la remasque.
 */
const retires = ["pack-complet"];

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL absent de l'environnement du seed.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  // Upsert par slug : re-lancable sans doublon.
  // `visible` est volontairement absent : sa valeur par defaut s'applique a la creation,
  // et une modification manuelle en base n'est pas ecrasee au re-seed.
  //
  // LES CHAMPS ANGLAIS PARTENT DANS LES DEUX BRANCHES, `update` COMME `create`.
  // Sans cela, un re-seed creerait bien les nouvelles lignes traduites mais
  // laisserait les 18 lignes deja en base avec leur `nameEn` a null : les
  // traductions n arriveraient jamais sur une base existante, et le bug serait
  // invisible en developpement — sur une base vide, tout passe par `create`.
  //
  // Le `?? null` n est pas decoratif. Le type declare ces deux champs
  // optionnels ; une entree qui les omettrait enverrait `undefined`, et
  // `undefined` dans un `update` Prisma veut dire « laisse la colonne
  // tranquille ». Une traduction retiree de ce fichier resterait alors en base
  // indefiniment. On normalise donc en `null`, qui ecrit vraiment.
  for (const service of services) {
    const donnees = {
      ...service,
      nameEn: service.nameEn ?? null,
      descriptionEn: service.descriptionEn ?? null,
    };
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: donnees,
      create: donnees,
    });
  }

  const { count: retraits } = await prisma.service.updateMany({
    where: { slug: { in: retires } },
    data: { visible: false },
  });

  const count = await prisma.service.count();
  console.log(
    `seed : ${services.length} services upsertes, ${retraits} retire(s) — total en base : ${count}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
