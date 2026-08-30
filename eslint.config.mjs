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
    // source de verite en lecture seule, jamais du code de projet — voir décision B7
    "reference/**",
  ]),

  // EXCEPTION CIBLEE — une seule regle, cinq fichiers et un repertoire.
  // Jamais globale : la regle reste active partout ailleurs dans le projet.
  {
    files: [
      "components/Nav.tsx",
      "components/MenuOverlay.tsx",
      "app/(site)/mentions-legales/page.tsx",
      "app/(site)/confidentialite/page.tsx",
      "components/ChatWidget.tsx",
      // Le REPERTOIRE, et non les deux fichiers nommes un par un : le segment
      // dynamique s ecrit `[slug]`, or dans un glob les crochets forment une
      // classe de caracteres — le chemin litteral ne matcherait qu une lettre
      // parmi s, l, u, g. Les echapper marche, mais se relit mal et se casse a
      // la premiere copie. Toutes les pages de prestations sont concernees par
      // la meme decision de toute facon.
      "app/(site)/prestations/**",
    ],
    rules: {
      // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
      "@next/next/no-html-link-for-pages": "off",
    },
  },

  {
    files: ["components/Interactions.tsx"],
    rules: {
      // volontaire — portage verbatim du <script> de la maquette, aucune réécriture permise, voir décision B4
      "no-var": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  {
    files: ["components/ui/feature-carousel.tsx"],
    rules: {
      // volontaire — copie à l'octet près, aucun commentaire ne peut y être ajouté, voir décision B5
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
