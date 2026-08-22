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

// Prix en centimes CHF. priceCents null pour les prestations sur devis (QUOTE).
const services: ServiceSeed[] = [
  {
    slug: "la-carte",
    name: "La Carte",
    description: "Votre menu repensé, prêt à imprimer, avec sa version en ligne.",
    category: "principal",
    priceType: "FIXED",
    priceCents: 45000,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 1,
  },
  {
    slug: "le-site",
    name: "Le Site",
    description: "Un site vitrine pensé mobile d'abord, mis en ligne clés en main.",
    category: "principal",
    priceType: "FIXED",
    priceCents: 195000,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 2,
  },
  {
    slug: "pack-complet",
    name: "Le Pack Complet",
    description: "Toute votre présence remise à niveau, en une seule livraison.",
    category: "principal",
    priceType: "FIXED",
    priceCents: 290000,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 3,
  },
  {
    slug: "site-sur-mesure",
    name: "Site multi-pages / sur-mesure",
    description: "Au-delà du one-page : périmètre défini ensemble",
    category: "principal",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 4,
  },
  {
    slug: "affiche-evenement",
    name: "Affiche d'événement — soirée, brunch, happy hour",
    description: "Soirée, brunch, happy hour — prête à imprimer",
    category: "annee",
    priceType: "FROM",
    priceCents: 12000,
    priceFrom: true,
    isMonthly: false,
    sortOrder: 10,
  },
  {
    slug: "carte-fidelite",
    name: "Carte de fidélité à tampons",
    description: "Dix tampons, un vrai design",
    category: "annee",
    priceType: "FIXED",
    priceCents: 15000,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 11,
  },
  {
    slug: "bons-cadeaux",
    name: "Bons cadeaux — Noël, Saint-Valentin",
    description: "Noël, Saint-Valentin",
    category: "annee",
    priceType: "FROM",
    priceCents: 18000,
    priceFrom: true,
    isMonthly: false,
    sortOrder: 12,
  },
  {
    slug: "chevalets",
    name: "Chevalets de table — carte, QR & wifi",
    description: "Carte, QR & wifi sur table",
    category: "annee",
    priceType: "FIXED",
    priceCents: 9000,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 13,
  },
  {
    slug: "sticker-avis",
    name: "Sticker vitrine « Avis Google » + QR",
    description: "QR direct vers votre fiche, 30 secondes",
    category: "annee",
    priceType: "FIXED",
    priceCents: 9000,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 14,
  },
  {
    slug: "traduction",
    name: "Traduction de carte FR / EN",
    description: "Genève est une ville de passage",
    category: "annee",
    priceType: "FROM",
    priceCents: 15000,
    priceFrom: true,
    isMonthly: false,
    sortOrder: 15,
  },
  {
    slug: "identite-logo",
    name: "Identité complète / logo",
    description: "Logotype, palette, cohérence carte-site-vitrine",
    category: "annee",
    priceType: "QUOTE",
    priceCents: null,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 16,
  },
  {
    slug: "reseaux-sociaux",
    name: "Réseaux sociaux — 8 à 12 posts par mois",
    description: "8 à 12 publications par mois, préparées et programmées",
    category: "continu",
    priceType: "FIXED",
    priceCents: 39000,
    priceFrom: false,
    isMonthly: true,
    sortOrder: 20,
  },
  {
    slug: "hebergement",
    name: "Hébergement & mises à jour du site",
    description: "Vous ne touchez à rien",
    category: "continu",
    priceType: "FIXED",
    priceCents: 4900,
    priceFrom: false,
    isMonthly: true,
    sortOrder: 21,
  },
  {
    slug: "pack-saisonnier",
    name: "Pack saisonnier — affiche + posts + carte à jour",
    description: "Affiche + posts + carte à jour — terrasse, Escalade, Noël",
    category: "saison",
    priceType: "FIXED",
    priceCents: 35000,
    priceFrom: false,
    isMonthly: false,
    sortOrder: 30,
  },
];

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

  const count = await prisma.service.count();
  console.log(`seed : ${services.length} services upsertes — total en base : ${count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
