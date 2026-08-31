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

  // EXCEPTION CIBLEE — UNE SEULE REGLE, sur la liste nommee ci-dessous.
  // Jamais globale : la regle reste active partout ailleurs dans le projet.
  // La liste n annonce pas son propre compte : elle s allonge a chaque page
  // publique ajoutee, et un chiffre dans ce commentaire deviendrait faux.
  {
    files: [
      "components/Nav.tsx",
      "components/MenuOverlay.tsx",
      "app/(site)/mentions-legales/page.tsx",
      "app/(site)/confidentialite/page.tsx",
      // Les deux pages ouvertes par le proprietaire : « qui on est » et le
      // contact. Meme decision que les pages legales ci-dessus, et pour la
      // meme raison — /studio renvoie au catalogue, /contact renvoie a /studio
      // et aux pages legales, et un next/link y ferait une navigation
      // client-side qui ne rejouerait pas Interactions : les [data-reveal] de
      // la page d arrivee resteraient a opacity:0.
      "app/(site)/studio/page.tsx",
      "app/(site)/contact/page.tsx",
      // La 404 du site public. Meme decision, meme raison exactement que les
      // deux pages legales au-dessus : un next/link y ferait une navigation
      // client-side, Interactions ne rejouerait pas, et les [data-reveal] de
      // la page d arrivee resteraient a opacity:0. Une 404 qui renvoie sur un
      // ecran vide est pire que celle qu elle remplace.
      "app/(site)/not-found.tsx",
      "components/ChatWidget.tsx",
      // Le REPERTOIRE, et non les deux fichiers nommes un par un : le segment
      // dynamique s ecrit `[slug]`, or dans un glob les crochets forment une
      // classe de caracteres — le chemin litteral ne matcherait qu une lettre
      // parmi s, l, u, g. Les echapper marche, mais se relit mal et se casse a
      // la premiere copie. Toutes les pages de services sont concernees par
      // la meme decision de toute facon.
      "app/(site)/services/**",
      // Le corps partage des cinq pages de famille. Il vit dans components/
      // parce que c'est un composant, mais il rend exactement le meme markup
      // que les pages ci-dessus et il est soumis a la meme decision : des <a>
      // classiques, parce qu'une navigation client-side ne rejouerait pas
      // Interactions et laisserait les [data-reveal] a opacity:0.
      "components/PageFamille.tsx",
      // La 404 racine. Meme decision que les pages legales : des <a> classiques,
      // et elle vit hors du groupe (site) donc sans le chrome qui justifierait
      // une navigation client.
      "app/not-found.tsx",
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
