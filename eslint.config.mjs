import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // EXCEPTION CIBLEE — une seule regle, quatre fichiers. Jamais globale : la
  // regle reste active partout ailleurs dans le projet.
  {
    files: [
      "components/Nav.tsx",
      "components/MenuOverlay.tsx",
      "app/mentions-legales/page.tsx",
      "app/confidentialite/page.tsx",
    ],
    rules: {
      // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
      "@next/next/no-html-link-for-pages": "off",
    },
  },
]);

export default eslintConfig;
