import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import type { PriceType } from "../lib/generated/prisma/enums";

type ServiceSeed = {
  slug: string;
  name: string;
  description: string;
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
  {
    slug: "la-vitrine",
    name: "La Vitrine",
    description: "Votre site remis à niveau : une page, lisible sur téléphone, et un formulaire de demande qui fonctionne.",
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
    description: "Plusieurs pages, plusieurs métiers ou plusieurs zones : le périmètre se définit avant le premier écran.",
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
    description: "Hébergement, nom de domaine renouvelé, mises à jour, sauvegardes et certificat. Départ la 2ᵉ année.",
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
    description: "Le même suivi, plus l'assistant lui-même et vos modifications de contenu comprises.",
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
    description: "Le calendrier du mois vous est proposé, vous le validez : visuels, textes, publication et réponses aux messages.",
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
    description: "85 × 55 recto-verso, le papier choisi ensemble, l'imprimeur et le contrôle avant tirage compris.",
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
    description: "Logotype et déclinaisons, palette, typographies, et les règles qui tiennent le site, les devis et l'enseigne.",
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
    description: "Une séance sur votre lieu de travail : l'équipe, les gestes du métier, l'endroit. Rien à mettre en scène.",
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
    description: "La version anglaise du site, rédigée et remise en page — elle s'ajoute à ce qui est déjà en ligne.",
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
    description: "Un QR en vitrine ou au comptoir, qui ouvre le formulaire d'avis de votre fiche Google sans rien chercher.",
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
    description: "Une affiche qui se lit de loin et qui dit une chose. Fichiers prêts à imprimer : vitrine, A4 et carré.",
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
    description: "La carte reprise en entier, puis rendue en trois objets : fichiers d'impression, version en ligne et QR.",
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
    description: "Le format qui tient dans un portefeuille, dix cases, et un tampon — rien à installer, rien à expliquer.",
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
    description: "Le bon et son étui : un montant ou une prestation, un numéro pour le suivre, une date de validité.",
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
    description: "Debout sur la table : la suggestion du moment d'un côté, le QR de la carte et le code wifi de l'autre.",
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
    description: "Le passage d'une saison à l'autre en une fois : l'affiche, les publications assorties, la carte à jour.",
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
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
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
