# Métadonnées, image de partage et données structurées (24.10.2026)

> Mode `propose`. Règles : `title` ≤ 60 signes avant le suffixe « — Nawa Corps »
> du template ; description ≤ 155 ; le mot-clé de la page dans le `title` ;
> l'IA après le résultat dans la description (guide §4) ; entités nommées en
> entier (`ai-seo`). Aucun prix, aucun « dès », aucune TVA.

## 1. Accueil (`app/(site)/layout.tsx:87-108` ; `app/(site)/page.tsx:39-53` ; `app/(site)/en/page.tsx:78-80`, `:101-141`)

| Champ | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `title.default` / og / twitter | Site pour artisans du bâtiment à Genève — demandes triées, devis relancés | **L'assistant qui connaît déjà votre métier — PME à Genève** (56) | **The assistant that already knows your trade — Geneva** (54) |
| `description` / og / twitter (`layout.tsx:91-107`, `page.tsx:41`, `en/page.tsx:80`) | Nawa Corps fait le site des artisans du bâtiment genevois : demandes de devis avec photos, réponse automatique… En ligne en une semaine… | **Il répond à vos demandes, relance vos clients et prépare vos devis. Vous validez. Une IA réglée sur votre métier, à Genève. Démo sur vos demandes.** (≈ 146) | **It answers your enquiries, follows up your clients and drafts your quotes. You approve. An AI set to your trade, in Geneva. A demo on your enquiries.** (≈ 150) |
| suffixe prix (`page.tsx:48`, `en/page.tsx:136`) | « Dès [x].–, TVA comprise. » / « From [x].–, VAT included. » | **supprimé** (ne plus lire `prixEntreeCents`) | **removed** |

- VARIANTE de `title` pour la requête « assistant IA » (décision SEO d'Ayoub) :
  **« Assistant IA pour PME à Genève, réglé sur votre métier »** (55). Elle met
  la technique en tête, ce que la voix déconseille (PM §8).
- PREUVE : PM §3 « La phrase » ; §8.

## 2. Pages

| Page (fichier:ligne) | Champ | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|---|
| `/services` (`services/page.tsx:288-290`, `:325-329`) | title · description | Services et tarifs à Genève · Le catalogue du studio genevois… | **L'assistant IA pour PME à Genève, en détail** · Ce qu'il fait, métier par métier : répondre aux demandes, relancer, préparer les devis. Vous validez tout. Démo sur vos demandes, prix fixe annoncé après. | **The AI assistant for Geneva small businesses, in detail** · What it does, trade by trade: answering enquiries, following up, drafting quotes. You approve everything. A demo on your enquiries, a fixed price after. |
| `/services/[slug]` (`lib/formules.ts:291-426`) | title · description | La Vitrine : refonte de site à Genève… (×3) | **à retirer** (voir `services-slug.md`) | **to remove** |
| `/studio` (`studio/page.tsx:104-106` ; `en/studio/page.tsx:110-112`) | title · description | Ayoub Bensalem, studio de création digitale à Genève · Qui fait le travail, à Genève… comment se passe une refonte… | **Ayoub Bensalem, studio d'assistants IA à Genève** · Qui fait le travail à Genève : Ayoub Bensalem et un développeur spécialisé en IA. Comment se passent la démo et l'essai, et ce que nous ne prenons pas. | **Ayoub Bensalem, AI assistant studio in Geneva** · Who does the work in Geneva: Ayoub Bensalem and a developer who specialises in AI. How the demo and trial run, and what we do not take on. |
| `/demonstrations` (`demonstrations/page.tsx:66-68` ; EN `:68-69`) | title · description | Démonstrations du studio · Cinq pièces dessinées… | **Démonstrations : l'assistant et le relevé du lundi** · Deux démonstrations, étiquetées comme telles : Leo, l'assistant de ce site, et un exemple de relevé du lundi. Ce ne sont pas des clients. | **Demonstrations: the assistant and the Monday report** · Two demonstrations, labelled as such: Leo, this site's assistant, and a sample Monday report. Neither is a client. |
| `/contact` (`contact/page.tsx:118-120` ; EN `:137-138`) | title · description | Contacter le studio à Genève · WhatsApp, téléphone, e-mail ou le formulaire… | *title inchangé* · Téléphone, WhatsApp, e-mail ou formulaire : quatre chemins pour joindre Nawa Corps à Genève et demander une démo de l'assistant sur vos demandes. | *title unchanged* · Phone, WhatsApp, email or the form: four ways to reach Nawa Corps in Geneva and ask for a demo of the assistant on your enquiries. |
| `/devis` (`devis/page.tsx:62-64` ; EN `:94-95`) | title · description | Demander un devis · Décrivez votre besoin à l'assistant… | **Demander une démo sur vos demandes** · Montrez-nous trois demandes de votre semaine : nous vous montrons ce que l'assistant en aurait fait. Gratuit, sans accès à vos outils. Réponse le jour ouvrable suivant. | **Ask for a demo on your enquiries** · Show us three enquiries from your week: we show you what the assistant would have done with them. No access to your tools. A reply the next working day. |
| `/mentions-legales` (`mentions-legales/page.tsx:47`, `:52`) | description · og | Mentions légales de Nawa Corps, studio de création digitale indépendant à Genève… | **Mentions légales de Nawa Corps, studio genevois qui installe des assistants IA dans les PME : éditeur, hébergement, propriété intellectuelle et droit applicable.** | **Legal notice of Nawa Corps, a Geneva studio that sets up AI assistants in small businesses: publisher, hosting, intellectual property and governing law.** |
| `/confidentialite` | title · description | Confidentialité… | *inchangés* (voir réserve §6) | *unchanged* |

## 3. Image Open Graph (`app/(site)/opengraph-image.tsx`)

| Ligne | AVANT | APRÈS FR |
|---|---|---|
| `:21` (`alt`) | Nawa Corps — Studio de création digitale, Genève | **Nawa Corps — L'assistant qui connaît déjà votre métier, Genève** |
| `:50` (en-tête) | Nawa Corps | *inchangé* |
| `:62-63` (titre) | Plus aucune demande perdue. / Le site des artisans du bâtiment, à Genève. | **L'assistant qui connaît déjà votre métier.** / **Vous validez. Il s'occupe du reste.** |
| `:66` (pied) | Nawa Corps — Studio de création digitale, Genève | **Nawa Corps — studio genevois** |

- L'image est en français pour les deux langues (une seule convention de
  fichier) ; version EN si l'étape 5 ajoute une image par langue : **"The
  assistant that already knows your trade." / "You approve. It handles the
  rest."**
- **Image statique** `public/brand/og-nawa-corps.png` (`lib/site.ts:230`,
  utilisée par `openGraphPage` pour toutes les pages filles) : elle porte
  probablement l'ancien message. À régénérer avec le texte ci-dessus (actif
  visuel, hors copy).

## 4. Repli de titre OG (`lib/site.ts:280-281`)

- AVANT : `${SITE_NAME} — studio de création digitale à Genève` / `— digital design studio in Geneva`
- APRÈS : **`${SITE_NAME} — assistants pour les PME genevoises`** / **`— assistants for Geneva small businesses`**

## 5. Données structurées

### `components/SchemaStudio.tsx` (`ProfessionalService`, rendu sur `/`)

| Champ (ligne) | AVANT | APRÈS FR |
|---|---|---|
| `description` (`:91-92`) | Studio de création digitale indépendant à Genève : sites, identité et logotype, imprimés… refait en une semaine… | **Studio genevois qui installe dans les PME un assistant IA qui connaît déjà leur métier. L'assistant répond aux demandes, relance les clients et prépare les documents ; le patron valide avant tout envoi. Démo sur trois demandes réelles avant de signer.** |
| `slogan` (`:93`) | L'essentiel. Bien conçu. | **Vous validez. Il s'occupe du reste.** |
| `PRESTATIONS` (`:73-82`) | Refonte de site · Demande de devis et prise de rendez-vous en ligne · Assistant et relances automatiques · Identité visuelle et logotype · Cartes de visite… · Photographie… · Réseaux sociaux · Supports pour la restauration | **Assistant IA pour PME · Réponse aux demandes des clients · Relance des devis et des pièces manquantes · Préparation de brouillons de devis et de documents · Relevé hebdomadaire de l'activité** |
| `hasOfferCatalog.name` (`:126`) | Services du studio | **L'assistant** |
| `currenciesAccepted` (`:105`) | CHF | *inchangé* (fait, pas un prix) |

- Aucun `priceRange`, aucun `Offer.price`, aucun `aggregateRating` : il
  n'existe ni prix ni avis (LCD art. 3, CLAUDE.md).
- `/studio`, `Person.jobTitle` : voir `studio.md` §7 (**Fondateur**).

### `components/Faq.tsx` (`FAQPage`)

Suit automatiquement les six questions de `accueil.md` §J. Langue par
`inLanguage`.

### `app/(site)/services/[slug]/page.tsx:430-471` (`Service` + `Offer` chiffrée)

**À retirer** avec les pages (voir `services-slug.md`).

## 6. Réserve : `/confidentialite`

La page décrit correctement le traitement **du site** (Vercel, Francfort ;
fournisseur d'IA hors de Suisse, `confidentialite/page.tsx:81-82`). Elle ne
décrit pas le traitement des données **des clients de l'assistant**, qui
relèvera du contrat. Rien à réécrire ici aujourd'hui ; mais ce fait interdit
toute phrase « vos données restent en Suisse » ailleurs sur le site tant que
PM §10 n°3 n'est pas tranché.
