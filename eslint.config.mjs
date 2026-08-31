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
      // Les memes pages en anglais, sous /en. Meme decision, meme raison, et
      // le REPERTOIRE plutot que les fichiers pour la meme raison de glob que
      // ci-dessus : le voisin dynamique s ecrit `[slug]` de ce cote aussi.
      "app/(site)/en/services/**",
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
      // Le parcours de devis. La page d arrivee des huit CTA « Demander un
      // devis » renvoie vers /services et le catalogue ; le bouton, lui, est
      // devenu un vrai lien vers /devis au lieu d intercepter son propre clic.
      // Meme decision que partout ailleurs, et elle compte double ici : ce
      // bouton doit fonctionner SANS JavaScript, ce qui etait precisement ce
      // qu il ne faisait pas.
      "app/(site)/devis/page.tsx",
      "components/BoutonDevis.tsx",
      // La grille des trois formules sur l accueil. Ses CTA pointent desormais
      // sur /devis?p=<slug> et le nom de chaque carte ouvre sa page produit,
      // qui etait jusque-la inatteignable depuis l accueil.
      "components/Offres.tsx",
      // La page des demonstrations. L exception y vivait en tete de fichier,
      // en `/* eslint-disable */`, avec une note demandant explicitement son
      // deplacement ICI « a la prochaine passe qui y touche » : c est fait.
      // Une exception qui existe a deux endroits finit par diverger, et celle
      // de cette page est exactement la meme decision que les huit ci-dessus.
      "app/(site)/demonstrations/page.tsx",
      // LES PAGES ANGLAISES DE CONFIANCE ET DE CONVERSION. Meme decision, meme
      // raison, et elle vaut mot pour mot ce qu elle vaut en francais :
      // Interactions.tsx ne s initialise qu une fois, et une navigation
      // client-side laisserait les [data-reveal] de la page d arrivee a
      // opacity:0. Elles sont nommees une par une plutot que par un glob
      // `app/(site)/en/**` : les autres pages anglaises appartiennent a
      // d autres chantiers, et une exception d ESLint ne doit couvrir que ce
      // que son auteur a relu.
      "app/(site)/en/studio/page.tsx",
      "app/(site)/en/contact/page.tsx",
      "app/(site)/en/mentions-legales/page.tsx",
      "app/(site)/en/confidentialite/page.tsx",
      "app/(site)/en/demonstrations/page.tsx",
      "app/(site)/en/devis/page.tsx",
      "app/(site)/en/not-found.tsx",
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
