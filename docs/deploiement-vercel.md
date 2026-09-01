# Mettre le site en ligne sur Vercel

Ce document est une marche a suivre, pas une explication. Tout ce qui touche
git, `.env`, les secrets et le deploiement est fait par Ayoub et par personne
d autre : les etapes ci-dessous sont ecrites pour etre executees a la main.

Le depot sait deja se deployer sur Vercel — trois fichiers ont ete prepares
pour ca (section « Ce qui a deja ete fait »). Il reste a fournir une base de
donnees, des variables d environnement et un `git push`.

---

## 1. La CLI

```bash
npm i -g vercel
vercel login
```

Elle n est pas indispensable — tout se fait aussi depuis le tableau de bord —
mais `vercel env pull` et `vercel logs` font gagner du temps ensuite.

## 2. Un depot distant

`git remote -v` est **vide** aujourd hui : les cinq commits de
`feat/conversion-pme` n existent que sur cette machine. Vercel se branche sur
un depot GitHub. Il faut donc en creer un (prive), l ajouter en remote, puis
pousser la branche.

Sans ca, il reste `vercel deploy` depuis le dossier local, mais on perd les
previews automatiques a chaque commit.

## 3. La base de donnees

Le Postgres de `docker-compose.yml` ne suit pas sur Vercel : il faut un
Postgres heberge. Le chemin le plus court est **Neon**, via la place de marche
Vercel — l integration cree la base et injecte `DATABASE_URL` dans le projet
toute seule.

```bash
vercel link                 # rattache le dossier au projet Vercel
vercel integration add neon
```

**Choisir la region Francfort (`eu-central-1`)**, pour que la base soit a cote
des fonctions (voir section 5) et que les donnees restent en Europe.

Neon expose deux URL : une **pooled** (celle de `DATABASE_URL`, faite pour le
serverless) et une **directe**. L application utilise la pooled — `lib/prisma.ts`
passe par `@prisma/adapter-pg`, qui s en accommode. Les migrations, elles,
passent par l URL directe.

## 4. Migrer et semer la base

A faire **une fois**, depuis la machine locale, en pointant sur la base Neon —
pas depuis le build Vercel : une migration ne doit pas se declencher a chaque
deploiement, et `prisma migrate` n aime pas le pooler.

```bash
# URL DIRECTE de Neon, pas la pooled
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require" npx prisma migrate deploy
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require" npm run db:seed
```

**Le semis n est pas optionnel.** Les prix ne sont ecrits nulle part dans le
code : `Offres`, `CarteDuStudio` et le prompt du chatbot les lisent dans la
table `Service`. Une base vide donne un site sans offre et sans prix.

## 5. Les variables d environnement

A poser dans **Settings → Environment Variables** du projet Vercel, sur les
trois environnements (Production, Preview, Development) sauf mention contraire.

| Variable | Valeur | Remarque |
|---|---|---|
| `DATABASE_URL` | posee par l integration Neon | ne pas la saisir a la main |
| `NEXT_PUBLIC_SITE_URL` | `https://<domaine definitif>` | **lue au BUILD**, voir ci-dessous |
| `TELEGRAM_BOT_TOKEN` | @BotFather | absente = notification sautee, le lead est quand meme enregistre |
| `TELEGRAM_CHAT_ID` | | idem |
| `IP_HASH_SALT` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | jamais d IP en clair en base |
| `GEMINI_API_KEY` | Google AI Studio | absente = l assistant se declare indisponible |
| `CHAT_DAILY_LIMIT` | `200` | ceinture locale, pas un miroir du quota Google |
| `LLM_PROVIDER` | `gemini` ou `groq` | vide = gemini |
| `GROQ_API_KEY` | console.groq.com | **nouvelle cle** : celle du `.env` local est a revoquer |
| `ADMIN_PASSWORD` | choisi | mot de passe de `/admin` |
| `ADMIN_SECRET` | `randomBytes(32)` | signature du cookie admin ; la changer deconnecte tout le monde |

`DB_PASSWORD` et `DOMAIN` **ne servent pas sur Vercel** : le premier n existe
que pour le conteneur Postgres, le second pour Caddy.

### Le piege de `NEXT_PUBLIC_SITE_URL`

Les variables `NEXT_PUBLIC_*` sont **inlinees par `next build`**, pas lues au
demarrage. Une valeur posee apres coup ne prend effet qu au **redeploiement
suivant**. Et `lib/site.ts` leve une erreur si elle manque en production : le
premier build echouera tant qu elle n est pas la — c est voulu, ca vaut mieux
qu un sitemap et des canoniques qui pointent sur `localhost`.

Consequence pratique : poser la variable **avant** le premier deploiement, avec
le domaine definitif. Si le domaine change ensuite, redeployer.

## 6. La region

`vercel.json` fixe `"regions": ["fra1"]` — Francfort. Ce n est pas un reglage de
performance : les mentions legales du site annoncent un hebergement en Europe.
Laisser la region par defaut (`iad1`, Washington) les rendrait fausses.

## 7. Deployer

```bash
vercel deploy          # preview
vercel deploy --prod   # production
```

Ou, si le depot GitHub est branche : un `git push` suffit.

## 8. Apres la mise en ligne

- Verifier que les prix s affichent sur `/services` — s ils manquent, la base
  n a pas ete semee (etape 4).
- Verifier `/en`, `/en/services` et les `hreflang`.
- Envoyer un devis de test et confirmer l arrivee du lead en base et sur
  Telegram.
- `NAP_CONFIRME` dans `lib/site.ts` est deja ouvert : les coordonnees partent
  en donnee structuree. S assurer qu elles sont bien celles qu on veut publier.

---

## Ce qui a deja ete fait dans le depot

**`vercel.json`** — cadre le projet : framework `nextjs`, region `fra1`.

**`next.config.ts`** — `output: "standalone"` n est plus actif que **hors
Vercel**. Ce mode ne sert qu au Dockerfile, qui copie `.next/standalone` et
lance `node server.js` ; sur Vercel il fait produire au build une seconde copie
inutile de l application. La variable `VERCEL` (posee a `1` par la plateforme)
suffit a aiguiller, et `docker compose` continue de fonctionner a l identique.

**`package.json`** — un script `vercel-build` : `prisma generate && next build`.

Pourquoi il existe. `/lib/generated` est dans `.gitignore` : le client Prisma
n arrive pas par le depot, il doit etre genere pendant le build, sinon
`import ... from "@/lib/generated/prisma/client"` echoue. Vercel prefere
`vercel-build` a `build` quand le script existe — ce qui laisse `build`
intact pour le Dockerfile, qui appelle deja `npx prisma generate` a son propre
etage.

Pourquoi ce n est **pas** un `postinstall`. L etage `deps` du Dockerfile lance
`npm ci` avec seulement `package.json` et `package-lock.json` copies : un
`postinstall` y appellerait `prisma generate` sans schema, et casserait l image.

`dotenv` a par ailleurs ete ajoute en dependance de developpement explicite.
`prisma.config.ts` l importe (`import "dotenv/config"`) mais il n arrivait
jusque-la que par transitivite depuis `prisma` — une montee de version de
Prisma pouvait faire disparaitre le paquet et casser le build Vercel sans
prevenir.
