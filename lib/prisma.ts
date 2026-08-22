import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * Singleton PrismaClient, consomme UNIQUEMENT par des Server Components.
 *
 * Memorise sur globalThis hors production : en dev, Fast Refresh reevalue les
 * modules a chaque edition. Sans ce cache, chaque rechargement creerait un
 * nouveau client — donc un nouveau pool de connexions pg — jusqu'a saturer
 * Postgres.
 *
 * Volontairement AUCUN throw au chargement du module si DATABASE_URL manque :
 * `next build` importe les modules de route pour en lire les exports, et le
 * build Docker (etage builder, sans base ni .env) planterait a l'import. pg
 * n'ouvre la connexion qu'a la premiere requete : l'absence d'URL echoue donc
 * a la requete, au bon endroit, avec un message clair.
 */
function makeClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof makeClient>;
};

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
