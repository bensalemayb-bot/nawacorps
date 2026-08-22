// Mecanisme officiel Prisma 7 : la config vit ici, pas dans package.json.
// `migrations.seed` (cf. MigrationsConfigShape dans @prisma/config).
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
