/**
 * Ajoute (ou met à jour) la seule ligne de prix de la nouvelle offre :
 * la mise en place de l'assistant, 1'500.– (pas de TVA : entreprise non assujettie).
 *
 * POURQUOI UN SCRIPT ET PAS `npm run db:seed` : le seed réécrit les dix-huit
 * lignes de la table Service, y compris les prix corrigés depuis /admin. Ici,
 * un seul upsert, sur un seul slug — les autres lignes ne sont pas touchées.
 *
 * ATTENTION : .env.local pointe sur la base de production (Neon). Lancer ce
 * script modifie le site en ligne.
 *
 *   npx tsx scripts/ajouter-mise-en-place.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Mêmes valeurs que la ligne `assistant-mise-en-place` de prisma/seed.ts.
const ligne = {
  name: "Mise en place de l'assistant",
  description:
    "L'assistant réglé sur votre métier et votre entreprise, payé après l'essai si le relevé vous convient.",
  nameEn: "Assistant set-up",
  descriptionEn:
    "The assistant set to your trade and your business, paid after the trial if the report suits you.",
  category: "assistant",
  priceType: "FIXED" as const,
  priceCents: 150000,
  priceFrom: false,
  isMonthly: false,
  sortOrder: 0,
  visible: true,
};

// Une fonction, pas un `await` au niveau du module : tsx compile ce fichier
// en CommonJS (le package.json n'a pas "type": "module"), où l'await de
// premier niveau est refusé avant même la première ligne exécutée.
async function main() {
  const r = await prisma.service.upsert({
    where: { slug: "assistant-mise-en-place" },
    create: { slug: "assistant-mise-en-place", ...ligne },
    update: ligne,
  });
  console.log(`OK : ${r.slug} = ${(r.priceCents ?? 0) / 100} CHF, visible=${r.visible}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
