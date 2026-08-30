@AGENTS.md

# Nawa Corps — site du studio

## Le projet

Site public et back-office d'un **studio de création digitale** indépendant à
Genève, opéré par une personne (Ayoub Bensalem), sans bureau, avec un partenaire commercial et de production (101 Agency,
apport d'affaires 2 % + production réseaux sociaux sur devis).

**Marché** : Genève et sa région (Suisse romande). Marché unique — aucun autre
pays n'est visé aujourd'hui.

**Cible (ICP)** : le gérant d'une PME de services genevoise, 1 à 20 employés,
dont le site a plus de cinq ans. Métiers qui **devisent** (artisans, bâtiment,
garage, architecte) ou qui **prennent rendez-vous** (cabinets, santé, beauté),
ou qui **conseillent** (fiduciaire, avocat, régie, courtier).

**Offre** : refonte du site en **une semaine**, en trois formules — La Vitrine
699.–, Le Site 1'499.–, L'Assistant 2'499.– — TVA comprise, plus un suivi
mensuel et des prestations en complément.

**Le délai s'écrit « une semaine », jamais en heures.** « 72 h » et « 48 h » ont
circulé dans le projet ; aucun n'est tenu, et ils sont désormais proscrits
partout. Le différenciateur n'est d'ailleurs pas la vitesse : **le client n'a
rien à préparer**, le délai court dès son feu vert, parce que les textes sont
repris de son site actuel. Les concurrents rapides relevés par la veille, eux,
attendent que le client fournisse son contenu.

**Langues** : français uniquement à ce jour. **Aucune infrastructure i18n n'est
en place** : toutes les chaînes sont écrites en dur dans le JSX. Une version
anglaise est prévue — c'est un chantier d'architecture, pas une traduction.

## Positionnement — document de référence

**`.agents/product-marketing.md`** est l'entrée n°1 de tout travail marketing :
promesse, ICP, positionnement, concurrence, offres et prix, preuves,
partenariat, voix, chiffres du studio, décisions ouvertes.

Les agents s'y **adaptent** ; ils ne l'inventent pas. Une promesse, un prix, un
délai ou une référence absents de ce fichier ne doivent apparaître nulle part.

**Pipeline agents : voir docs/agents/PIPELINE.md**

## Stack

- **Next.js 16.3.2** (App Router, Turbopack), React, TypeScript strict.
  ⚠️ Cette version a des ruptures d'API — lire `node_modules/next/dist/docs/`
  avant d'écrire du code Next, comme le rappelle AGENTS.md.
- **PostgreSQL 17** via **Prisma 7** (generator `prisma-client`, sortie
  `lib/generated/prisma`, URL dans `prisma.config.ts`).
- **Tailwind v4**, importé dans `app/globals.css` ; l'essentiel du style vit
  cependant dans les CSS maison (`binacore.css`, `noyau.css`, `chat.css`).
- **Docker Compose** : `db` (Postgres), `web` (Next standalone), `caddy`.
- **LLM** : Gemini ou Groq, sélectionné par `LLM_PROVIDER` dans `lib/llm.ts`.
- Notifications de leads : Telegram (`lib/telegram.ts`).

## Commandes

| But | Commande | Note |
|---|---|---|
| Développement | `npm run dev` | Next dev + Turbopack, port 3000 |
| Build | `npm run build` | sortie `standalone` |
| Lint | `npm run lint` | ESLint |
| Typecheck | `npm run typecheck` | `tsc --noEmit` |
| Base (démarrer) | `npm run db:up` | `docker compose up -d db` |
| Base (peupler) | `npm run db:seed` | `prisma db seed` → `prisma/seed.ts` |
| Migrations | `npx prisma migrate deploy` | |

**Il n'existe aucune suite de tests.** Ne pas inventer de commande de test :
la vérification passe par `lint`, `typecheck`, `build` et un contrôle manuel
dans le navigateur.

## Conventions du dépôt

- **Commentaires et contenu en français.** Les docblocks expliquent *pourquoi*,
  pas *quoi* — et ils sont tenus à jour : un commentaire devenu faux est un bug.
- **Les prix ne sont jamais écrits en dur.** Ils viennent de Postgres
  (`prisma/seed.ts` → table `Service`), lus par `Offres`, `CarteDuStudio` et le
  prompt du chatbot. Corriger un prix en base le corrige partout.
- **`lib/site.ts` est la source unique** pour l'URL publique, le nom, les
  coordonnées et les horaires. `NAP_CONFIRME` est un verrou : tant qu'il vaut
  `false`, aucune coordonnée ne part en donnée structurée.
- **Pas de `next/link` sur le site public** : les révélations au scroll
  (`Interactions.tsx`) ne s'initialisent qu'une fois. Liens `<a>` classiques.
- Le chrome public (loader, curseur, nav, chatbot, scroll inertiel) vit dans
  `app/(site)/layout.tsx` ; `/admin` n'en hérite pas.
- Les éléments en `position: fixed` restent **hors** de `#smoothWrap` : un
  ancêtre transformé casse `position: fixed`.
- Le `h1` du hero est découpé en lignes `.l` révélées une par une : chaque
  ligne doit tenir sur **21 caractères au plus**, sinon la mise en page casse.

## Interdits

- Personne d'autre que Boualem ne touche à git, `.env`, aux secrets, aux
  configs de production ou au déploiement.
- Aucune référence client inventée, aucun avis fabriqué, aucun compteur fictif.
  En Suisse, la LCD (art. 3) vise les indications trompeuses.
- Aucun prix affiché sans la mention **TVA comprise**.
