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
 */
const services: ServiceSeed[] = [
  // ---------- Les trois formules de site ----------
  {
    slug: "la-vitrine",
    name: "La Vitrine",
    description: "Votre site refait proprement, lisible sur téléphone, avec un formulaire qui fonctionne.",
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
    description: "Le site qui reçoit les demandes, prend les rendez-vous et chiffre les devis.",
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
    description: "Le site qui répond, qualifie et relance à votre place, jour et nuit.",
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
    // concurrents sur six. Il est affiche sur l accueil et sur /prestations.
    slug: "site-sur-mesure",
    name: "Site à plusieurs pages",
    description: "Au-delà de la page unique : périmètre défini ensemble",
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
    name: "Suivi & hébergement",
    description: "Hébergement, domaine, mises à jour, sauvegardes — dès la 2ᵉ année",
    category: "continu",
    priceType: "FIXED",
    priceCents: 4900,
    priceFrom: false,
    isMonthly: true,
    sortOrder: 20,
  },
  {
    slug: "suivi-assistant",
    name: "Suivi & hébergement — avec assistant",
    description: "Idem, plus l'assistant et vos modifications de contenu",
    category: "continu",
    priceType: "FIXED",
    priceCents: 12900,
    priceFrom: false,
    isMonthly: true,
    sortOrder: 21,
  },
  {
    slug: "reseaux-sociaux",
    name: "Réseaux sociaux — la ligne complète",
    description: "Calendrier, création, rédaction, publication et suivi — vous ne touchez à rien",
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
    name: "Cartes de visite — conception + 75 ex. imprimés",
    description: "Recto-verso, 85 × 55, papier choisi avec vous",
    category: "annee",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 10,
  },
  {
    slug: "identite-logo",
    name: "Identité complète / logo",
    description: "Logotype, palette, cohérence site — supports — enseigne",
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
    description: "Cadrées pour le site comme pour Google",
    category: "annee",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 12,
  },
  {
    slug: "traduction",
    name: "Traduction du site FR / EN",
    description: "Genève travaille en deux langues",
    category: "annee",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 13,
  },
  {
    slug: "sticker-avis",
    name: "Sticker vitrine « Avis Google » + QR",
    description: "QR direct vers votre fiche, 30 secondes",
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
    description: "Prête à imprimer",
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
    name: "La Carte — menu de restaurant",
    description: "Menu repensé, fichiers d'impression, version en ligne + QR",
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
    description: "Dix tampons, un vrai design",
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
    description: "Noël, Saint-Valentin, fête des mères",
    category: "saison",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 32,
  },
  {
    slug: "chevalets",
    name: "Chevalets de table — carte, QR & wifi",
    description: "Carte, QR & wifi sur table",
    category: "saison",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 33,
  },
  {
    slug: "pack-saisonnier",
    name: "Pack saisonnier — affiche + posts + carte à jour",
    description: "Terrasse, rentrée, Escalade, Noël",
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
