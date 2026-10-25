/**
 * Ajoute (ou met à jour) les trois paliers de l'abonnement mensuel :
 * Essentiel 190.–, Standard 290.–, Complet 490.– par mois (pas de TVA :
 * entreprise non assujettie). Grille décidée par Ayoub le 25.10.2026
 * (founder/pricing.md).
 *
 * Même raison que scripts/ajouter-mise-en-place.ts : un upsert par slug, et
 * rien d'autre. `npm run db:seed` réécrirait toute la table Service, y compris
 * les prix corrigés depuis /admin.
 *
 * ATTENTION : .env.local pointe sur la base de production (Neon). Lancer ce
 * script modifie le site en ligne.
 *
 *   npx tsx scripts/ajouter-abonnements.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Mêmes valeurs que les lignes `abonnement-*` de prisma/seed.ts.
const PALIERS = [
  {
    slug: "abonnement-essentiel",
    name: "Essentiel",
    description: "Une tâche, jusqu'à 100 demandes par mois, relevé chaque lundi.",
    nameEn: "Essential",
    descriptionEn: "One task, up to 100 requests a month, a report every Monday.",
    priceCents: 19000,
    sortOrder: 1,
  },
  {
    slug: "abonnement-standard",
    name: "Standard",
    description: "Deux tâches, jusqu'à 300 demandes par mois, relevé chaque lundi.",
    nameEn: "Standard",
    descriptionEn: "Two tasks, up to 300 requests a month, a report every Monday.",
    priceCents: 29000,
    sortOrder: 2,
  },
  {
    slug: "abonnement-complet",
    name: "Complet",
    description:
      "Trois tâches dont le téléphone (300 minutes incluses), jusqu'à 800 demandes par mois.",
    nameEn: "Complete",
    descriptionEn:
      "Three tasks including the phone (300 minutes included), up to 800 requests a month.",
    priceCents: 49000,
    sortOrder: 3,
  },
];

// Une fonction et non un `await` au niveau du module : tsx compile ce
// fichier en CommonJS, où l'await de premier niveau est refusé.
async function main() {
  for (const p of PALIERS) {
    const ligne = {
      name: p.name,
      description: p.description,
      nameEn: p.nameEn,
      descriptionEn: p.descriptionEn,
      category: "assistant",
      priceType: "FIXED" as const,
      priceCents: p.priceCents,
      priceFrom: false,
      isMonthly: true,
      sortOrder: p.sortOrder,
      visible: true,
    };
    const r = await prisma.service.upsert({
      where: { slug: p.slug },
      create: { slug: p.slug, ...ligne },
      update: ligne,
    });
    console.log(`OK : ${r.slug} = ${(r.priceCents ?? 0) / 100} CHF/mois`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
