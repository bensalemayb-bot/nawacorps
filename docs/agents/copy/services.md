# `/services` et `/en/services` — devient « L'assistant, en détail » (24.10.2026, tour 2)

> Tour 1 archivé : `docs/agents/_archive/2026-10-24-tour1/copy/services.md`.
> Tour 2 : m12 (ordre de la description), B1 (chapô, geste « Répondre », §5),
> M7 (chapô du §4), prix annoncé à la fin de la démo (§6).

> Mode `propose`. Fichier : `app/(site)/services/page.tsx` (`TEXTES`, `:286-378`,
> et `BLOCS`, `:252-284`). Le corps est partagé avec `/en/services`
> (`corpsServices(locale)`), la colonne EN est donc donnée partout.
> **Mot-clé cible** : *assistant IA PME Genève*, dans le `title` et le h1
> (« L'assistant »). Guide : `docs/agents/brand/voice-guide.md`.

## 0. Ce que la page devient

Aujourd'hui : le catalogue de l'ancien studio, lu en base (formules de site,
imprimés, identité, restauration, suivi), avec prix, « sur devis » et TVA.
**Tout ce contenu est sorti de l'offre** (PM §5). La page devient la page de
détail de l'offre unique, statique, sans montant.

**Changements de structure (étape 5, hors copy)** : retirer la lecture de
`chargerCatalogue`, la grille de prix, les blocs de famille (`BlocFamille`,
`BLOCS`, `lib/catalogue-familles.ts`), le compteur « N lignes portent un prix
ferme » et `MENTION_DEVIS`. L'URL `/services` ne change pas.

| Section | Rôle |
|---|---|
| En-tête | Réponse directe : qui, quoi, où (`ai-seo`) |
| (01) Ce qu'il fait | Les quatre gestes de la base |
| (02) Par métier | Cinq métiers, sanitaire en premier |
| (03) Ce qu'il ne fait jamais seul | Le contrôle et ce que nous ne promettons pas |
| (04) Le parcours | Démo, essai, abonnement, prix sans montant |
| Fin | CTA démo + pied de page |

## 1. Métadonnées (`seoTitre`, `seoDescription`, `:288-290`, `:325-329`)

- AVANT FR : Services et tarifs à Genève · « Le catalogue du studio genevois : trois formules de site, l'hébergement… »
- APRÈS FR : **L'assistant IA pour PME à Genève, en détail** · « Ce qu'il fait, métier par métier : préparer les devis, relancer, répondre aux demandes. Il ne s'engage jamais à votre place. Démo sur vos demandes, prix fixe annoncé à la fin. » (≈ 155 signes)
- AVANT EN : Services and prices in Geneva
- APRÈS EN : **The AI assistant for Geneva small businesses, in detail** · "What it does, trade by trade: drafting quotes, following up, answering enquiries. It never commits on your behalf. A demo on your enquiries, a fixed price at the end." (≈ 160 ; repli : retirer « trade by trade, »)
- TOUR 2 : m12 (le triplet générique ne s'aligne plus dans l'ordre du marché) ; B1 ; prix à la fin de la démo.
- POURQUOI : « tarifs » promettait des prix qui n'existent plus. L'IA arrive
  après le résultat dans la description (guide §4) ; elle est dans le titre
  parce que c'est le nom de la catégorie cherchée (`ai-seo`, entités claires).
- PREUVE : PM §1, §5.

## 2. En-tête de page

| Clé | AVANT FR | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `meta` | Catalogue | **L'assistant** | **The assistant** |
| `h1` | Tout ce que fait / le studio, à Genève. | **L'assistant, / en détail.** | **The assistant, / in detail.** |
| `chapo` | Trois lignes en vitrine. Le site d'abord… | **Nawa Corps est un studio genevois. Il installe dans les PME un assistant IA qui connaît déjà leur métier. L'assistant répond aux demandes, relance les clients et prépare les documents. Il ne s'engage jamais à la place du patron. Chaque lundi, un relevé dit ce qui a été fait.** (48 mots) | **Nawa Corps is a Geneva studio. It sets up, in small businesses, an AI assistant that already knows their trade. The assistant answers enquiries, follows up clients and prepares documents. It never commits on the owner's behalf. Every Monday, a report says what was done.** |
| `delai` (nœud React) | Le délai est d'une semaine, et il court dès votre feu vert… | **Vous n'avez rien à préparer : nous partons de ce que vous recevez déjà.** | **You have nothing to prepare: we start from what you already receive.** |
| `comptePrixFerme`, `compteSurDevis`, `mentionDevis`, `mentionTvaPhrase`, `uniteMontant` | « N lignes portent un prix ferme… » etc. | **supprimés** | **removed** |
| `mentionReponse` | Réponse le jour ouvrable suivant. | *inchangé* | *inchangé* |
| `fil` | Accueil / Services | **Accueil / L'assistant** | **Home / The assistant** |

- POURQUOI : le chapô est un bloc-réponse autonome de moins de 60 mots, qui
  nomme les entités (studio, Genève, PME, assistant IA), lisible tel quel par
  un moteur de réponse (`ai-seo`, pilier 1).
- PREUVE : PM §1, §3 ; conditions §5 (« Préparation demandée : aucune »).

## 3. (01) Ce qu'il fait (remplace `formules`, `:309-314`)

- AVANT : (01) Les formules · « Trois paliers, / un seul site. » · « Pour la PME genevoise dont le site a plus de cinq ans… »
- APRÈS FR : **(01) Ce qu'il fait** · h2 **« Quatre gestes, / et vous validez. »**
- APRÈS EN : **(01) What it does** · h2 **"Four tasks, / and you approve."**

| Geste | FR | EN |
|---|---|---|
| Répondre | **Répondre aux demandes.** Un accusé de réception, validé par vous une fois, demande l'adresse, une photo et l'urgence. Vous trouvez une liste triée, et vous validez chaque réponse. | **Answering enquiries.** An acknowledgement, approved by you once, asks for the address, a photo and the urgency. You find a sorted list, and you approve every reply. |
| Relancer | **Relancer.** Les devis sans réponse, les pièces qui manquent, les anciens contacts. | **Following up.** Quotes with no answer, missing documents, past contacts. |
| Préparer | **Préparer.** Un brouillon de devis, de réponse ou de document. Vous le corrigez si besoin, puis vous l'envoyez. | **Preparing.** A draft quote, reply or document. You correct it if needed, then you send it. |
| Le relevé | **Le relevé du lundi.** Ce qui a été traité, relancé, préparé, et ce qui vous attend. | **The Monday report.** What was handled, followed up, prepared, and what is waiting for you. |

- PREUVE : PM §5 « Ce que l'assistant fait (la base) », mot pour mot ou presque.

## 4. (02) Par métier (remplace les blocs `site-web`, `imprimes`, `identite`)

- APRÈS FR : **(02) Par métier** · h2 **« Il connaît déjà / votre métier. »** · chapô : **« Nous partons d'une base par métier : le vocabulaire, les demandes types, les documents. Puis nous la réglons sur votre entreprise : vos prestations, vos clients, vos mots. Nous commençons par le sanitaire et le chauffage. L'électricité suit, puis les autres métiers, un à la fois. »** *(tour 2, M7)*
- APRÈS EN : **(02) By trade** · h2 **"It already knows / your trade."** · lede: **"We start from a base for each trade: the vocabulary, the usual enquiries, the documents. Then we set it to your business: your services, your clients, your words. We start with plumbing and heating. Electrical work follows, then other trades, one at a time."**

| Métier | FR | EN |
|---|---|---|
| Sanitaire et chauffage | La demande prise pendant le chantier, avec l'adresse, une photo et l'urgence. Le soir, une liste triée. Le bon de régie, il connaît. | The enquiry taken while you are on site, with the address, a photo and the urgency. In the evening, a sorted list. It knows what an agency work order is. |
| Électricité | La demande prise pendant le chantier, le devis préparé, puis relancé. | The enquiry taken while you are on site, the quote drafted, then followed up. |
| Fiduciaires | Les pièces réclamées aux clients jusqu'au dossier complet. Ce qui arrive, trié. | Documents chased from clients until the file is complete. What comes in, sorted. |
| Régies | Les demandes des locataires triées, les photos demandées, le bon d'intervention préparé. Il aide le gérant ; il ne le remplace pas. | Tenants' requests sorted, photos asked for, the work order drafted. It helps the manager; it does not replace them. |
| Agences immobilières | Les anciens contacts propriétaires relancés, et les vendeurs venus des portails. | Past owner contacts followed up, and sellers who came through the portals. |

- POURQUOI : pilier 1, l'écart vérifié du marché romand ; pattern « un métier,
  une douleur » de la veille. Sanitaire en premier (board, séance 9).
- PREUVE : PM §1 ; §5 bis, tableau, colonne « Ce que fait l'assistant ».

## 5. (03) Ce qu'il ne fait jamais seul (remplace la bascule, `:315-319`)

- AVANT : Le reste du catalogue · « Logo et photos, hébergement du site, restaurants et cafés… »
- APRÈS FR : **(03) Le contrôle** · h2 **« Ce qu'il ne fait / jamais seul. »**
  - Il ne s'engage jamais à votre place : aucun prix, aucune date, aucun devis, aucune réponse de fond sans votre accord.
  - Seul part tout seul l'accusé de réception que vous avez relu et validé une fois.
  - Il n'a pas accès à vos paiements.
  - Pour la démo, il n'a accès à aucun de vos outils.
  - **Ce que nous ne promettons pas** : un nombre de clients en plus, un nombre d'heures gagnées, un taux de devis signés, une première place sur Google, un assistant « 100 % automatique ».
- APRÈS EN : **(03) Control** · h2 **"What it never / does alone."**
  - It never commits on your behalf: no price, no date, no quote, no real reply without your approval.
  - Only the acknowledgement you read and approved once goes out on its own.
  - It has no access to your payments.
  - For the demo, it has no access to any of your tools.
  - **What we do not promise**: more clients, hours saved, a rate of signed quotes, first place on Google, a "100% automatic" assistant.
- POURQUOI : le contrôle comme argument (pattern 4 de la veille) ; écrire ce
  qu'on ne promet pas rend crédible ce qu'on promet.
- PREUVE : PM §5 « Toujours : le patron valide… Pas d'accès aux paiements » ;
  « Ce qu'on ne promet pas ».

## 6. (04) Le parcours

- APRÈS FR : **(04) Le parcours** · h2 **« Vous payez / après l'essai. »**
  1. **La démo.** Trois demandes de votre semaine, ce que l'assistant en aurait fait. Rien à payer. À la fin, nous vous annonçons le prix fixe.
  2. **L'essai.** Il travaille sur vos vraies demandes, sans jamais s'engager à votre place ; le relevé arrive chaque lundi. Rien à payer pendant l'essai.
  3. **L'abonnement.** Si le relevé vous convient, vous payez la mise en place, puis l'abonnement continue.
  - Note : **« Le prix est fixe, annoncé à la fin de la démo, avant l'essai. »**
- APRÈS EN : **(04) The process** · h2 **"You pay / after the trial."** 1. **The demo.** Three enquiries from your week, what the assistant would have done with them. Nothing to pay. At the end, we give you the fixed price. 2. **The trial.** It works on your real enquiries, never committing on your behalf; the report comes every Monday. Nothing to pay during the trial. 3. **The subscription.** If the report suits you, you pay for the set-up, then the subscription carries on. Note: **"The price is fixed, given at the end of the demo, before the trial."**
- PREUVE : PM §5, parcours, prix, garantie ; arbitrage « prix avant l'essai ».

## 7. Fin de page

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `devisLabel` (×8 boutons) | Demander un devis → / Request a quote → | **Voir l'assistant sur mes demandes →** (un seul bouton) | **See it on my enquiries →** |
| `formules.voir` | Voir la formule | **supprimé** | **removed** |
| `BLOCS.*.titre` / `lien` | Le site vit, et il est tenu. · Voir le site web · etc. | **supprimés** | **removed** |

## 8. `lib/familles.ts` et `lib/catalogue-familles.ts`

Tout le contenu éditorial des trois familles (`lib/familles.ts:396-1107` :
`h1`, `seoTitre`, `seoDescription`, `resout`, `pieces`, `amorce`…) et les
mentions `MENTION_DEVIS*` (`:289-339`) décrivent des prestations qui ne se
vendent plus. **Aucune réécriture** : à retirer de l'affichage. Seules
`MENTION_REPONSE` / `MENTION_REPONSE_EN` (`:355`, `:367`) restent, inchangées.
