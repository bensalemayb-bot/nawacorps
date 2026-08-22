# Binacore — Spécification technique v1

Site vitrine d'un studio digital à Genève : leads, services, prix « sur devis »,
formulaire de contact, chatbot de qualification, déploiement Docker sur VPS.

Ce document est reconstitué au **bloc B1**. Il ne couvre que les sections dont B1 a
besoin — **2 (stack)**, **9 (Docker)**, **10 (variables d'environnement)**. Les sections
manquantes (pages, design, modèles de données, chatbot) seront écrites par leurs blocs
respectifs. Ne rien y inventer par anticipation.

---

## 2. Stack

Versions constatées à l'initialisation (2026-08-22), pas des cibles théoriques.

| Couche | Choix | Version installée |
|---|---|---|
| Runtime | Node.js | 24.12.0 |
| Gestionnaire de paquets | npm | 11.6.2 |
| Framework | Next.js — App Router | 16.3.2 |
| UI | React | 19.2.8 |
| Langage | TypeScript | ^5 |
| Styles | Tailwind CSS | ^4 |
| Lint | ESLint + eslint-config-next | ^9 / 16.3.2 |
| ORM | Prisma (CLI, dev) | ^7.9.1 |
| Client ORM | @prisma/client | ^7.9.1 |
| Base de données | PostgreSQL (conteneur) | 17-alpine |
| Reverse proxy | Caddy (conteneur) | 2-alpine |

Conventions :

- **Pas de dossier `src/`.** `app/` est à la racine.
- Alias d'import `@/*` → `./*`.
- `output: "standalone"` dans `next.config.ts` — requis par l'étage `runner` du Dockerfile.

### 2.1 Particularités Prisma 7

Prisma 7 rompt avec les idiomes de la v6. Trois points à connaître avant tout travail
sur la base :

1. `datasource db` **ne peut plus porter `url`** dans `schema.prisma` (erreur `P1012`).
   L'URL de connexion vit dans `prisma.config.ts`, sur `process.env["DATABASE_URL"]`.
2. Le générateur est `prisma-client` (et non `prisma-client-js`), avec un `output`
   **obligatoire**. Retenu : `lib/generated/prisma` — délibérément **hors de `app/`**,
   pour que du code généré ne se retrouve pas dans l'arbre de routage Next.
3. `prisma.config.ts` fait `import "dotenv/config"`. `dotenv` n'est pas une dépendance
   directe : il est résolu via `prisma → @prisma/config → c12 → dotenv`. Décision assumée
   au bloc B1 pour éviter une dépendance hors périmètre — **à revisiter si un
   `npm update` casse cette résolution transitive**.

### 2.2 Workflow de développement

PostgreSQL tourne en Docker ; Next tourne en local via `npm run dev`.
La prod full-Docker est le bloc B12.

```
npm run db:up       # docker compose up -d db
npm run dev         # Next en local sur http://localhost:3000
npm run db:studio   # prisma studio
```

---

## 9. Docker

Quatre fichiers à la racine : `Dockerfile`, `.dockerignore`, `docker-compose.yml`,
`docker-compose.override.yml`, plus `Caddyfile`.

### 9.1 Dockerfile

Trois étages : `deps` (installation), `builder` (`prisma generate` + `next build`),
`runner` (image finale). Le runner s'appuie sur la sortie `standalone` de Next et
s'exécute sous l'utilisateur non-root `nextjs` (uid 1001).

`openssl` est installé sur chaque étage concerné : le moteur de requêtes Prisma en a
besoin sur Alpine.

### 9.2 Services

| Service | Image | Rôle | Exposition |
|---|---|---|---|
| `db` | `postgres:17-alpine` | PostgreSQL | réseau interne uniquement |
| `web` | build local | Next.js standalone | réseau interne, port 3000 |
| `caddy` | `caddy:2-alpine` | reverse proxy, TLS | `80:80`, `443:443` |

- Le service `db` porte un **`healthcheck`** (`pg_isready`). `web` en dépend via
  `condition: service_healthy` : l'application ne démarre pas avant que la base réponde.
- Réseau `internal` en bridge. La base **n'est pas exposée** sur l'hôte en configuration
  de production.
- Volumes nommés : `db_data`, `caddy_data`, `caddy_config`.

### 9.3 Override de développement

`docker-compose.override.yml` est **versionné** et publie `5432:5432`. Motif : en
développement, `npm run dev` tourne hors Docker et doit joindre la base. Compose fusionne
l'override automatiquement ; en production on déploie avec
`-f docker-compose.yml` seul pour que la base reste interne.

### 9.4 Caddyfile

Volontairement minimal en B1 : `reverse_proxy web:3000`, compression `zstd`/`gzip`,
domaine piloté par `{$DOMAIN:localhost}`. La configuration de production (TLS, en-têtes
de sécurité, domaine réel) relève du bloc B12.

---

## 10. Variables d'environnement

`.env.example` est **versionné** ; `.env` ne l'est **jamais** (`.gitignore` couvre `.env*`,
avec `!.env.example` pour re-inclure l'exemple).

| Clé | Rôle |
|---|---|
| `DB_PASSWORD` | mot de passe PostgreSQL. Consommé par `docker compose` pour `POSTGRES_PASSWORD` et pour composer le `DATABASE_URL` du service `web`. |
| `DATABASE_URL` | chaîne de connexion lue par Prisma via `prisma.config.ts`. |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site, exposée au navigateur. |
| `DOMAIN` | domaine servi par Caddy. |

Génération du mot de passe :

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 10.1 Deux `DATABASE_URL`, deux contextes

C'est la source de confusion la plus probable du projet :

- **`.env` local** → `postgresql://binacore:<DB_PASSWORD>@localhost:5432/binacore`
  Utilisé par `npm run dev` et `prisma studio`, qui tournent **hors** Docker et passent par
  le port publié par l'override.
- **service `web` dans `docker-compose.yml`** → `postgresql://binacore:<DB_PASSWORD>@db:5432/binacore`
  Résolution par nom de service sur le réseau interne.

Les deux sont corrects. Ils ne sont pas interchangeables.

Les clés des blocs suivants (notification e-mail des leads, chatbot de qualification)
seront ajoutées **dans leur bloc**, pas anticipées ici.
