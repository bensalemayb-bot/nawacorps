# Re-audit CRO et SEO — site Nawa Corps, 25.10.2026 (v3)

Lecture seule. Aucun fichier du site n'a été modifié. Même méthode et mêmes critères que `audit-cro-seo-2026-10-25.md` (v1) et `-v2.md`.

**Ce qui a été lu.** Le rendu des 40 URL de `/sitemap.xml`, plus `/robots.txt`, `/llms.txt`, les anciennes URL et une 404. Pour chaque page : title, meta, h1, canonical, hreflang, JSON-LD. Les liens internes ont été testés un par un (aucun lien cassé). La duplication a été mesurée phrase par phrase sur les 11 pages métiers. Contrôle mobile à 375 px (accueil et `/metiers/salons-coiffure-beaute`).
**Le code lu.** `lib/metiers.ts`, `lib/dictionnaires/fr.ts` et `en.ts`, `lib/catalogue.ts`, `lib/chat-prompt.ts`, `app/llms.txt/route.ts`, `app/(site)/studio/page.tsx` et `services/page.tsx`, `app/binacore.css`.
**Les références.** `.agents/product-marketing.md` et `founder/research/agences-ia-positionnement.md` (NexaLab, Fluxel, IAtelier).
**Ce qui n'a pas été fait.** Aucune conversation avec Leo. Aucun outil SEO n'est branché, donc **aucun volume de recherche n'est cité**. La recherche web (moteur US) ne renvoie, sur « assistant IA sanitaire chauffagiste Genève » et « agent IA PME Genève artisans régie fiduciaire », que des offres d'emploi. Aucun concurrent n'est positionné sur ces requêtes de métier : c'est un signal de faible concurrence, pas une mesure.

Le lecteur visé ne change pas : un patron sanitaire genevois qui lit sur son téléphone, entre deux chantiers.

---

## 1. Les notes

| Axe | v1 | v2 | **v3** | Pourquoi pas plus |
|---|---:|---:|---:|---|
| Compréhension (5 s) | 6 | 8 | **8,5** | `/metiers` et la grille rendent l'offre lisible. Le kicker du hero dit toujours « Assistants pour PME », sans « IA ». |
| Douleur | 4 | 7 | **7,5** | Onze pages parlent les mots de chaque métier, et chacune a sa scène fictive. Mais aucune voix genevoise réelle, et la page sanitaire promet encore de « lire » les bons de régie (3e audit de suite). |
| Envie d'agir | 5 | 7 | **8** | Les prix sont visibles, `tel:` est sur « appelez-nous », « Appeler » au temps 4. Restent : la durée de l'essai est absente, la CGV contredit « résiliable chaque mois », le tarif d'introduction est rédigé en prix barré, et il n'y a pas de barre mobile. |
| Confiance | 5 | 5,5 | **6** | Les pages légales et la CGV existent, et le prix est transparent. Mais **22 « [À VÉRIFIER] / [À COMPLÉTER] » sont visibles** sur les 6 pages légales, l'adresse manque, la formule interdite « rien ne part sans votre accord » est revenue, et `/studio` affiche le compteur « 11 métiers ». |
| SEO | 4 | 5,5 | **7** | 22 pages métiers indexables, propres (title, h1, hreflang, Service, FAQPage, ItemList), et `llms.txt`. Mais le maillage entre pages métiers est faible, environ 40 % du texte est commun aux 11 pages, et il n'y a toujours aucun signal local hors site. |

---

## 2. Ce qui a vraiment progressé

- **`/metiers` et 11 pages métiers**, en FR et en EN, toutes en 200, toutes dans le sitemap et dans `llms.txt`. Chaque page a un h1 unique « Assistant IA pour … à Genève », une meta propre au métier, un `Service`, un `FAQPage` à questions de métier et un `BreadcrumbList`. `/metiers` porte un `ItemList`.
- **Une démo par métier, étiquetée « Exemple de démonstration — demande fictive »**, avec le canal (WhatsApp, appel, portail, Instagram…), ce que fait l'assistant, ce que le patron voit le soir, et le relevé du lundi. C'est la meilleure preuve que le site puisse donner sans client, et elle est honnête.
- **Le corps des pages métiers est bien bridé sur les branchements** : « se vérifie outil par outil », « nous ne le promettons pas avant de l'avoir testé » (portails, logiciel de gérance, agenda en ligne).
- **La grille 190 / 290 / 490**, lue en base, porte la mention TVA à chaque occurrence (accueil, `/services`, FAQ, JSON-LD, `llms.txt`, Leo). Aucun palier n'est mis en avant. **Aucun « TVA comprise » nulle part.**
- **JSON-LD `Offer` de `/services`** : 4 offres, et la mention « pas de TVA (entreprise non assujettie) » dans `description` et dans `priceSpecification.description`. Le défaut 3.4 de la v2 est réglé sur le fond.
- **Formules interdites** : aucun « trois demandes », aucun délai en heures, aucun « débutant », « pas encore de client » ou « parmi les premiers », dans le rendu comme dans Leo. Les seuls « 100 % » sont dans « ce que nous ne promettons pas ».
- **Les correctifs v2** : `tel:` sur « appelez-nous », « Appeler » au temps 4, `/en` aligné (« preps the paperwork », title et meta neufs), `/en/studio` passé à 52 signes, « property manager » et « work order » partout, « accounting firms ».
- **La page sanitaire** passe de « Il part d'une base » à « Nous construisons une base » (FAQ), et le téléphone est cadré (« il ne promet ni date ni prix »).
- **Leo** : la règle prix est stricte (mot pour mot, aucun « dès », aucune remise hors intro), « jamais de délai en heures », réponses suggérées (`CHOIX:`), deux phrases au plus. Le prompt interdit lui-même « rien ne part sans vous ».
- **Technique** : 308 de `/sanitaire-chauffage-geneve` (+EN) vers `/metiers/sanitaire-chauffage`, 404 en `noindex`, aucun débordement horizontal à 375 px, `lastmod` fixe.

---

## 3. Défauts restants ou introduits

Gravité : **G** = grave (juridique, ou promesse fausse visible), **M** = moyen (conversion ou SEO), **m** = mineur.

### 3.1 — G — Des marqueurs de brouillon sont visibles sur les pages légales (introduit)

22 marqueurs sont visibles, dans le rendu et en FR comme en EN :

| Page | Marqueurs |
|---|---|
| `/mentions-legales`, `/en/mentions-legales` | `[À COMPLÉTER : rue, numéro, NPA]`, `[À VÉRIFIER dans la console Neon]` |
| `/confidentialite`, `/en/confidentialite` | `[À COMPLÉTER : rue, numéro, NPA]`, `[À VÉRIFIER : entité contractante, pays et garanties]`, `[À VÉRIFIER : purge manuelle]`, `[À VÉRIFIER]` ×2, `[À VÉRIFIER : offre utilisée]`, `[À VÉRIFIER : certification de Vercel, Neon, Google et Groq]` |
| `/cgv`, `/en/cgv` | `[À COMPLÉTER : rue, numéro, NPA]`, `[À COMPLÉTER : 30 jours proposé]` (préavis de résiliation) |

**Pourquoi c'est grave.** L'art. 3 al. 1 let. s LCD exige une identité et une **adresse** complètes dès qu'on vend en ligne. Une politique de confidentialité qui écrit « à vérifier » à côté de ses transferts hors de Suisse affaiblit la promesse sur les données, qui est le 2e frein du panel. Et pour un patron prudent, c'est un site pas fini.
**Correctif.** L'adresse et les vérifications dépendent d'Ayoub. En code, si le site part avant qu'elles soient faites : `noindex` sur les 6 pages légales **et** retrait des marqueurs (la phrase s'arrête avant le crochet). Le mieux reste de ne pas mettre en ligne avant d'avoir rempli.

### 3.2 — G — « Rien ne part sans votre accord » est revenu (formule interdite)

Le prompt de Leo le dit lui-même (`lib/chat-prompt.ts` l. 204) : « c'est faux, l'accusé de réception part seul ».

| Où | AVANT | APRÈS (prêt à coller) |
|---|---|---|
| `fr.ts` l. 392 (accueil, section 03) | « …une base par métier, réglée sur votre entreprise, et rien ne part sans votre accord. » | « …une base par métier, réglée sur votre entreprise, et un assistant qui ne s'engage jamais à votre place. » |
| `en.ts` l. 196 | « …and nothing goes out without your approval. » | « …and an assistant that never commits on your behalf. » |
| `studio/page.tsx` l. 49 (meta + `AboutPage.description`) | « …Une base par métier. Rien ne part sans votre accord. Ce que nous ne prenons pas. » | « Qui fait le premier appel, la démo et le suivi. Une base par métier. Il ne s'engage jamais à votre place. Ce que nous ne prenons pas. » (139) |
| `en/studio/page.tsx` l. 47 | « …Nothing goes out without your approval… » | « Who makes the first call, runs the demo and follows up. A base for each trade. It never commits on your behalf. What we do not take on. » (138) |

### 3.3 — G — Des promesses non prouvées sur les pages métiers (3e audit pour le bon de régie)

Le positionnement ne fixe toujours pas la tâche du sanitaire (décision ouverte n° 2). Il n'y a aucun client et aucune ligne de code de l'assistant livré.

| Où | AVANT | Problème | APRÈS |
|---|---|---|---|
| `metiers.ts` l. 124 (meta sanitaire FR) | « …les bons de régie lus, les devis et relances préparés… » | « lus » affirme une capacité en place. | « Les demandes et les appels pris pendant le chantier, les devis et relances préparés, le bon de régie connu. Vous validez le soir. Démo sur votre métier. » (147) |
| l. 222 (meta EN) | « …work orders read… » | idem | « Enquiries and calls taken while you are on site, quotes and follow-ups drafted, work orders understood. You approve in the evening. A demo on your trade. » (152) |
| l. 128, l. 131 (lede et `peut`, aussi sur l'accueil, `/services` et `/metiers`) | « …lire les bons de régie… » / « lire le bon de régie » | idem | « …préparer la suite d'un bon de régie… » / « Prendre la demande ou l'appel, préparer la suite du bon de régie, le devis et sa relance. » |
| l. 172–174 (02, n° 03) | « Lire les bons de régie. Il peut lire le bon : … » | idem | « Les bons de régie. Il connaît le bon : l'adresse, le locataire, le travail demandé. Il prépare la prise de rendez-vous et la confirmation à la régie. Ce qu'il en fait chez vous se règle pendant la démo. Aucune date ne part sans votre accord. » |
| l. 205 (FAQ) | « L'assistant peut lire le bon : … » | idem | Reprendre la phrase précédente. |
| l. 1664 / 1755 (meta salons) | « Les rendez-vous pris et rappelés… » / « Appointments taken… » | « pris » veut dire une date fixée seule, **ce qui contredit le contrôle** (« aucune date ne part sans votre accord »). | « Les messages WhatsApp et Instagram triés, les rendez-vous et rappels préparés, les annulations reproposées. Vous validez. Démo sur votre métier. » (141) / « WhatsApp and Instagram messages sorted, appointments and reminders drafted, cancellations re-offered. You approve. A demo on your trade. » |
| l. 2037 / 2129 (meta déménagement) | « …les dates confirmées… » / « dates confirmed » | même contradiction | « Les demandes complétées avec l'inventaire, les devis et les confirmations de date préparés, les rappels prêts. Vous validez. Démo sur votre métier. » (150) / « …quotes and date confirmations drafted… » |
| Pages sanitaire, électricité, garages, régies (tâche « Répondre au téléphone », FAQ « Oui, nous pouvons l'installer pour ça ») | Le téléphone est présenté comme une tâche ordinaire. | La grille ne met le téléphone que dans **Complet (490.–)**. Un patron qui lit la page pense qu'il l'aura à 190.–. | Ajouter en fin de tâche : « Le téléphone fait partie du palier Complet. » (EN : « The phone is part of the Complete tier. ») Même ajout dans la FAQ téléphone. |
| `/studio`, chiffres clés (`studio/page.tsx` l. 148) | « **11 métiers** — Une base par métier » | Ce chiffre se lit comme 11 bases livrées. Or elles sont « en construction » (`/metiers` : « Nous construisons une base »). C'est un compteur au sens de CLAUDE.md. | « **Par métier** — Une base pour chacun » (ou retirer la case). |

### 3.4 — M — Le prix : trois incohérences (introduites)

1. **Le tarif d'introduction est rédigé en prix barré.** « 190.–/mois **au lieu de** 290.–/mois » (`lib/catalogue.ts` l. 244–245). `product-marketing.md` §8 refuse le « prix barré ». Et la décision ouverte n° 11 (« Limite de capacité… bloque toute mention de places limitées ») n'est pas fermée, alors que « 3 entreprises par trimestre » s'affiche.
   APRÈS FR : « Tarif d'introduction : le palier Standard (deux tâches, jusqu'à 300 demandes par mois) au prix de l'Essentiel, {190.–}/mois, {pas de TVA (entreprise non assujettie)}, pendant 12 mois. Nous menons trois mises en place par trimestre : chacune se fait à la main. Valable jusqu'au 31 janvier 2027. »
   APRÈS EN : « Introductory rate: the Standard tier (two tasks, up to 300 requests a month) at the Essential price, {190.–}/month, {no VAT (business not VAT-registered)}, for 12 months. We run three set-ups per quarter: each one is done by hand. Valid until 31 January 2027. »
   Côté Ayoub : fermer la décision n° 11 dans `product-marketing.md`.
2. **« Une seule tâche pour commencer »** (`fr.ts` l. 452–454, et « Nous commençons par une seule de ces tâches » sur les 11 pages) contredit le Standard (« deux tâches ») et l'offre d'introduction.
   APRÈS : « Nous commençons par la tâche qui vous prend le plus de soirées. Les autres viennent ensuite, selon votre palier. »
3. **La CGV contredit le site.** Le site dit « sans engagement, résiliable chaque mois » ; la CGV §6 parle d'un préavis « [À COMPLÉTER : 30 jours proposé] ». Avec 30 jours pour la fin d'un mois, c'est près de deux mois.
   APRÈS (si Ayoub retient « pour la fin du mois suivant ») sur le site : « Sans engagement, résiliable pour la fin de chaque mois. » Sinon, ramener la CGV au préavis que dit le site.

Le JSON-LD des pages métiers ne publie que la mise en place (1 `Offer`), alors que `/services` en publie 4. Ce n'est pas faux, mais c'est incomplet. On peut le laisser, ou réutiliser le même bloc que `/services`.

### 3.5 — M — `llms.txt`, la porte des moteurs IA

| AVANT | APRÈS |
|---|---|
| « Mise en place : 1'500.–,pas de TVA… » (espace manquante, `app/llms.txt/route.ts` l. 42) | `${montant}, ${mentionTva("fr")}` |
| « …il peut prendre les demandes et les appels… » (en tête, sans borne) | « …il peut prendre les demandes (et, au palier Complet, les appels)… » |
| La section « English » oublie `/en/studio`, `/en/contact`, `/en/mentions-legales`, `/en/confidentialite` | Les ajouter, pour qu'elle soit symétrique de la section FR. |

### 3.6 — M — Le maillage interne

- **Les pages métiers sont des culs-de-sac.** Chaque page n'a qu'un lien vers une autre page métier (son alternative de langue), plus « Tous les métiers ». Elle n'a aucun lien vers `/services`, ni vers les métiers voisins.
  Correctif code : un bloc « Métiers voisins » en bas de chaque page, avec 2 ou 3 liens (sanitaire ↔ électricité ↔ artisans du bâtiment ; régies ↔ agences immobilières ↔ sanitaire, à cause du bon de régie ; fiduciaires ↔ architectes ; nettoyage ↔ déménagement ↔ régies ; garages ↔ électricité ; salons ↔ nettoyage). Ajouter aussi « L'assistant en détail → » vers `/services`.
- **`/services` n'est lié que depuis l'accueil, `/devis` et `/studio`.** Il n'est ni dans la nav ni dans le pied (« L'offre » pointe vers `/#offres`). Faire pointer « L'offre » de la nav et du menu vers `/services` est un changement de navigation : **à demander à Ayoub**.
- **`/studio` (03)** renvoie à `/metiers` : c'est correct. Le lien « Voir l'assistant du sanitaire → » recommandé en v2 n'a pas été fait. Le gain est faible.

### 3.7 — M — Cannibalisation et duplication

- **Duplication.** Sur les 11 pages FR, **36 à 44 % du texte** est fait de phrases identiques sur au moins 6 pages : bloc contrôle, bloc prix, contact, intertitres. 26 phrases se retrouvent sur les 11 pages. La partie propre (environ 60 %) est réelle et différente. Ce n'est donc pas une page clonée, mais c'est en limite.
  Correctif : (a) écrire le bloc contrôle (04) en une phrase propre au métier plus un lien vers `/services#controle`, au lieu de 6 phrases recopiées ; (b) écrire le bloc (05) « La démo et le prix » en 2 lignes plus un lien vers `/services`. Ces deux coupes font passer la part commune sous 25 %.
- **Cannibalisation.**
  - L'accueil (« Assistant IA pour **artisans** et PME à Genève ») et `/metiers/artisans-batiment` (« Assistant IA pour **artisans** du bâtiment à Genève ») visent la même requête, « assistant IA artisan Genève ». Correctif : le title de la page devient « Assistant IA pour menuisiers, peintres et carreleurs à Genève » (59). Le h1 garde « artisans du bâtiment ».
  - Les régies et les agences immobilières sont bien séparées (locataires et bons d'intervention d'un côté, portails et mandats de l'autre).
  - `/metiers` et `/services` : « Assistant IA par métier pour les PME de Genève » contre « L'assistant IA en détail ». Ils sont distincts. C'est bien.

### 3.8 — M — Titles, metas, h1, JSON-LD

| Page | Défaut | APRÈS |
|---|---|---|
| `/services` | Title de **61 signes** : « L'assistant IA en détail : devis, relances, demandes · Genève » | « Assistant IA en détail : devis, relances, demandes · Genève » (59) |
| `/services` | h1 « L'assistant, en détail. » : aucun mot-clé (signalé en v1) | « L'assistant IA, en détail. » (le h1 est découpé en 2 lignes `.t`, pas en lignes `.l` : pas de limite à 21 signes) |
| `/cgv`, `/confidentialite` | Metas de 166 et 165 signes | CGV : « CGV de Nawa Corps (B2B) : démo, essai, mise en place, abonnement, prix, paiement, résiliation, données et droit applicable. » (128). Confidentialité : « Confidentialité de Nawa Corps (nLPD) : formulaire, Leo, notifications, destinataires, durées de conservation et vos droits. » (123) |
| `/en` | Ni `ProfessionalService` ni `Organization`. Les `Service` EN pointent vers `provider: {@id …/#studio}`, qui n'est défini que sur `/` FR. | Émettre le même `ProfessionalService` (même `@id`) sur `/en`, avec `description` EN. |
| Tous les `Offer` | Pas de `"valueAddedTaxIncluded": false` (recommandé en v2). La mention est en texte, ce qui suffit pour la règle ; le champ ne sert qu'aux machines. | Ajouter `"valueAddedTaxIncluded": false` dans chaque `priceSpecification`. Ajouter `url` et `seller: {"@id": "…/#studio"}`. |
| `Person` (`/studio`) | Ni `image` ni `sameAs` | Quand la photo existera : `image`. `sameAs` vers LinkedIn si le profil existe. |
| Les 404 | `<title>` = celui de l'accueil | « Page introuvable · Nawa Corps » |
| Pages métiers, h1 | `<br/>` codé en dur. À 375 px, ça donne « Assistant IA pour / salons de / coiffure et de beauté / à Genève. » : une ligne orpheline. | Retirer le `<br/>` sous 520 px (`.t br{display:none}` en media query). **Changement de mise en page : à demander.** |

### 3.9 — m — Textes

| Où | AVANT | APRÈS |
|---|---|---|
| `metiers.ts` l. 2262, `services/page.tsx` l. 145 | « Seul part tout seul l'accusé de réception… » | « Un seul message part sans vous : l'accusé de réception, que vous avez relu et validé une fois. » |
| `metiers.ts` l. 134 (h2 sanitaire) | « Le chantier le jour, le bureau le soir. » | « Le chantier le jour, la paperasse le soir. » (il n'a pas de bureau, cf. v2 3.6) |
| `fr.ts` l. 218 `kickerCible` | « Assistants pour PME » | « Assistant IA pour PME » (recommandé en v2, pas fait) |
| EN, démos des 11 pages | « Channel : WhatsApp » (espace française avant le deux-points) | « Channel: WhatsApp » |
| Pied, slogan JSON-LD | « Vous validez. Il s'occupe du reste. » | Défendable, mais « s'occupe du reste » se lit « fait le reste seul ». À garder si Ayoub y tient. Sinon : « Il prépare. Vous validez. » |

### 3.10 — m — Mobile

- Il n'y a toujours **pas de barre basse** « Démo · Appeler » sous 860 px. La pastille « Demander ma démo » reste masquée (`binacore.css` l. 461). Les pages métiers n'ont aucun « Appeler » visible avant le pied. **À demander.**
- **37 textes sous 12 px** sur une page métier, et 25 sur l'accueil (kickers, `(001)`, strip, étiquettes des faits à 10,6–11,2 px). Le défaut v1 est inchangé.
- La bulle de Leo (« Ce qui vous prend vos soirées ? … ») s'ouvre sous le CTA du hero à 375 px et occupe le bas de l'écran. À vérifier à la main : elle ne doit couvrir ni le CTA ni « Appeler ».
- Pas de défilement horizontal (`scrollWidth` = 375). Le h1 hero est à 36,8 px.

---

## 4. Quinze mots-clés (FR, Genève)

Sans volume (aucun outil). La difficulté est **estimée** d'après les concurrents connus et la SERP observée (le moteur ne renvoie que des offres d'emploi sur les requêtes de métier).

| # | Mot-clé | Intention | Page cible | Difficulté estimée |
|---|---|---|---|---|
| 1 | assistant IA sanitaire Genève | commerciale | `/metiers/sanitaire-chauffage` | Faible (aucun concurrent sur la requête) |
| 2 | IA chauffagiste / logiciel chauffagiste IA | info / commerciale | `/metiers/sanitaire-chauffage` | Faible |
| 3 | relance devis automatique artisan | commerciale | `/services` | Moyenne (éditeurs SaaS FR) |
| 4 | assistant IA PME Genève | commerciale | `/` | Moyenne (NexaLab, Fluxel) |
| 5 | agent IA Genève | commerciale | `/services` | **Forte** (NexaLab avec fiche Google 5,0 ★, Fluxel) — ne pas viser |
| 6 | IA électricien Genève | commerciale | `/metiers/electricite` | Faible |
| 7 | IA régie immobilière Genève / bons d'intervention | commerciale | `/metiers/regies-immobilieres` | Faible à moyenne (Fluxel a une page immobilier) |
| 8 | IA fiduciaire Genève / relance pièces comptables | commerciale | `/metiers/fiduciaires` | **Moyenne à forte** (Fluxel, NexaLab, IAtelier ont une page fiduciaire) |
| 9 | IA garage Suisse romande / rappel service garage | commerciale | `/metiers/garages` | Moyenne (IAtelier a une page garages) |
| 10 | IA agence immobilière leads portails | commerciale | `/metiers/agences-immobilieres` | Moyenne |
| 11 | secrétariat artisan Genève | commerciale (il cherche une personne) | FAQ « Je ne trouve personne » + `/metiers/artisans-batiment` | Moyenne (secrétariats externalisés) |
| 12 | bon de régie sanitaire | info (vocabulaire métier) | Bloc de la page sanitaire, ou futur article | Faible, mais volume probablement très bas |
| 13 | réponse automatique WhatsApp entreprise | commerciale | `/services` | Forte (éditeurs internationaux) |
| 14 | prise de rendez-vous salon coiffure IA Genève | commerciale | `/metiers/salons-coiffure-beaute` | Moyenne (agendas en ligne : Salonkee, Planity) |
| 15 | devis déménagement Genève IA / devis nettoyage | commerciale | `/metiers/demenagement`, `/metiers/nettoyage-entretien` | Faible sur « IA », forte sur « devis déménagement Genève » (intention client final, pas patron : à ne pas viser) |

**Lecture.** Le site gagne là où les concurrents n'ont pas de page : sanitaire, électricité, régies (n° 1, 2, 6, 7). Les fiduciaires sont la seule page métier en terrain occupé (trois concurrents). Il faut éviter « agent IA Genève » et « automatisation PME Genève ».

---

## 5. Checklist technique

| Point | État | Note |
|---|---|---|
| Rendu serveur (HTML complet sans JS) | ✅ | Le texte, la FAQ et les démos sont dans le HTML. |
| `lang` fr-CH / en-CH | ✅ | Sur les 40 pages. |
| Title unique ≤ 60 | ⚠️ | 39 sur 40. `/services` fait 61 signes. |
| Meta unique ≤ 155 | ⚠️ | `/cgv` 166, `/confidentialite` 165. Le reste est entre 117 et 155. |
| Un h1 par page | ✅ | 40 sur 40. |
| Canonical auto-référente | ✅ | Seul l'accueil est sans slash final (`…:3000`), alors que le sitemap a `/`. C'est sans effet. |
| hreflang fr-CH / en-CH / x-default | ✅ | Dans le head et dans le sitemap, sur les 40 URL. |
| sitemap.xml | ✅ | 40 URL, `lastmod` fixe. |
| robots.txt | ✅ | La ligne `Host:` a disparu. |
| `llms.txt` | ⚠️ | Il manque une espace avant la mention TVA. Le téléphone n'est pas borné. La section EN est incomplète (3.5). |
| Liens internes | ✅ | 0 lien cassé sur l'ensemble des `href` internes. |
| Maillage | ⚠️ | Pages métiers en cul-de-sac. `/services` est hors nav (3.6). |
| Anciennes URL | ✅ / ⚠️ | `/sanitaire-chauffage-geneve` → 308 vers la page métier ✅. `/services/site-web`, `/demonstrations` → `/` (`/services` serait plus proche). |
| 404 | ⚠️ | `noindex` ✅, mais le title est celui de l'accueil. |
| JSON-LD | ⚠️ | Valide et complet en FR. `/en` sans entité `ProfessionalService`. `Offer` sans `valueAddedTaxIncluded`. AboutPage avec la formule interdite. |
| Prix ↔ mention TVA | ✅ | Chaque montant affiché, et chaque `Offer`, porte la mention. |
| Open Graph | ✅ | Title, description, image 1200×630 et locale par page. |
| Images | ✅ | Logos en `alt=""` sauf un, LCP `noyau.webp` en `fetchPriority="high"`. |
| Mobile | ⚠️ | Pas de débordement. Textes à 10,6–11,2 px. Pas de barre d'action. h1 métier avec ligne orpheline. |
| Pages légales | ❌ | **22 marqueurs de brouillon visibles, adresse absente** (3.1). |
| URL publique en prod | ⚠️ | En local tout pointe sur `localhost:3000`. À vérifier sur `nawacorps.ch` (canonical, sitemap, `llms.txt`, JSON-LD). |
| Fiche Google Business Profile | ❌ | Toujours absente. |
| Annuaires (local.ch, search.ch) | ❌ | Toujours absents. |
| Liens entrants | ❌ | Aucun connu. |

---

## 6. Ce qui manque pour 10/10

### Compréhension — 8,5 → 10

**Faisable dans le code maintenant**
- `kickerCible` « Assistant IA pour PME » (3.9).
- `/services` h1 « L'assistant IA, en détail. » (3.8).
- Dire le palier du téléphone partout où il apparaît (3.3) : la promesse doit se comprendre sans aller lire la grille.

**Dépend d'Ayoub**
- Une capture ou une vidéo de 20 secondes de la vraie démo sanitaire, marquée « Démonstration ».
- La double numérotation du hero (`(001)` / `(01)`) : c'est de la mise en page, à demander.

### Douleur — 7,5 → 10

**Faisable dans le code maintenant**
- Retirer « lire / lus » pour le bon de régie et les « rendez-vous pris » et « dates confirmées » (3.3). La douleur sonne juste ; la solution doit sonner aussi juste.
- Le h2 « le bureau le soir » → « la paperasse le soir ».

**Dépend d'Ayoub**
- **Les 10 appels.** 0 patron genevois entendu. Une phrase réelle, citée anonymement et avec son accord, par métier prioritaire.
- **Trancher la tâche unique du sanitaire** (décision n° 2). La page pourra alors mettre **une** tâche en tête, au lieu de cinq de même poids.

### Envie d'agir — 8 → 10

**Faisable dans le code maintenant**
- Tarif d'introduction sans « au lieu de » ; « une seule tâche » mis en cohérence avec le Standard (3.4).
- Un lien « Appeler » (`tel:`) à côté du CTA dans le bloc (05) de chaque page métier : c'est un ajout de lien dans un bloc qui existe. Si c'est jugé comme de la mise en page, le demander.

**À demander à Ayoub (mise en page)**
- Une barre basse « Démo · Appeler » sous 860 px, hors de `#smoothWrap`, qui ne couvre pas la bulle de Leo.
- « L'offre » de la nav vers `/services`.

**Dépend d'Ayoub**
- **La durée de l'essai** (décision n° 6). « Rien à payer pendant l'essai », sans durée, reste un flou. La CGV renvoie à « la durée fixée dans l'offre ».
- **Le préavis de résiliation**, aligné avec « résiliable chaque mois » (3.4).
- La décision n° 11 (capacité) fermée, pour que « trois par trimestre » soit une règle tenue.

### Confiance — 6 → 10

**Faisable dans le code maintenant**
- « Rien ne part sans votre accord » ×4 (3.2).
- La case « 11 métiers » de `/studio` (3.3).
- `noindex` et retrait des marqueurs sur les pages légales tant qu'elles ne sont pas complètes (3.1).
- `ProfessionalService` sur `/en` et `valueAddedTaxIncluded: false` (3.8).

**Dépend d'Ayoub**
- **L'adresse** (rue, numéro, NPA) et **les 7 vérifications de la confidentialité** : Telegram, purge, offre Neon, certifications DPF de Vercel, Neon, Google et Groq. C'est le correctif n° 1 de ce rapport.
- **Une photo réelle d'Ayoub**, puis `image` dans le `Person`.
- **Le premier client référence**, avec son accord écrit.
- **L'hébergeur et le modèle suisses de l'assistant livré** (décision n° 3, à moitié tranchée). Sans eux, « les données de votre assistant sont hébergées en Suisse » n'est pas encore vérifiable.
- Le contrat avec le développeur (décision n° 5).

### SEO — 7 → 10

**Faisable dans le code maintenant**
- Le bloc « Métiers voisins » et le lien vers `/services` sur les 11 pages (3.6).
- Réduire les blocs communs (contrôle, prix) à une phrase plus un lien (3.7).
- Le title de `artisans-batiment` désambiguïsé ; le title de `/services` à 59 signes ; les metas CGV et confidentialité ; le title 404 (3.7, 3.8).
- `llms.txt` corrigé (3.5).
- Les anciennes URL `/services/*` redirigées vers `/services`.

**Dépend d'Ayoub**
- **Une fiche Google Business Profile** (zone de service Genève, sans adresse publique), puis **local.ch** et **search.ch**, avec le même nom, le même téléphone et la même zone.
- **Des liens entrants** : 101 Agency, une association du bâtiment (AGCV, Suissetec section Genève), la presse locale. Rien n'est acquis.
- **Un premier article** écrit après les 10 appels (« Pas de secrétaire ? Ce que l'assistant reprend, et ce qu'il ne reprend pas »).
- Vérifier en prod que tout dit `nawacorps.ch`.
- Les avis Google ne viendront qu'avec de vrais clients. Ne jamais en solliciter avant.

---

## 7. Ordre de travail proposé

**Code, cette semaine** (textes, données, liens) :
1. Formule interdite ×4 (3.2).
2. Bon de régie « lu », « rendez-vous pris », « dates confirmées », palier du téléphone, case « 11 métiers » (3.3).
3. Tarif d'introduction sans prix barré ; « une seule tâche » (3.4).
4. `llms.txt` (3.5).
5. Title `/services`, h1 `/services`, metas légales, title 404, `ProfessionalService` sur `/en`, `valueAddedTaxIncluded` (3.8).
6. « Métiers voisins » et lien vers `/services` sur les pages métiers ; blocs communs raccourcis (3.6, 3.7).
7. Petits textes (3.9).

**Avant toute mise en ligne (Ayoub)** : adresse, vérifications de la confidentialité, préavis de la CGV, durée de l'essai, décision n° 11.

**À demander (mise en page)** : barre basse mobile, « L'offre » vers `/services`, `<br/>` du h1 métier sur mobile, tailles d'étiquettes.

**Hors site (Ayoub)** : fiche Google, annuaires, 10 appels, photo, démo sanitaire prête avant la prospection.

---

Recherches web du 25.10.2026 (SERP sans concurrent sur les requêtes de métier, que des offres d'emploi) : [jobup.ch, assistant technique dépannage sanitaire](https://jobup.ch/en/jobs/detail/562041b3-0766-438f-a731-79b07c970dd3), [jobup.ch, chauffagiste Genève](https://jobup.ch/en/jobs/detail/873a2c6f-e6ee-44ea-9d42-eb30fbc383b1). Concurrents : `founder/research/agences-ia-positionnement.md` ([nexa-lab.ch](https://nexa-lab.ch/), [fluxel.ch](https://www.fluxel.ch/), [iatelier.ch](https://iatelier.ch/ia-pour-pme)).
