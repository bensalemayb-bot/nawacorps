# Revue A, tour 2 (dernier tour) : textes de l'offre « assistant » (24.10.2026)

> Revue psy-persuasion. Périmètre : `docs/agents/brand/voice-guide.md` et les 16 fichiers
> `docs/agents/copy/*.md` dans leur état du tour 2. Les arbitrages de fin de
> `copy/_points-ouverts.md` font foi.
> Référentiels : `.agents/product-marketing.md` (PM), avec le §5 dans sa version du 24.10 :
> la règle du contrôle, le panel de 100 PME et **la décision d'Ayoub sur le prix et les
> données** (PM l. 268-272 ; `_points-ouverts.md`, « Décision d'Ayoub »).
> Tour 1 : `docs/agents/reviews/psy-A-agent-metier-tour1.md`.
> Je n'ai modifié aucun fichier du site ni aucun texte d'un autre agent.
>
> **Verdict : au tour 2, la règle de la revue n'autorise que OK ou ESCALADE.** Il n'y a pas
> de tour 3, donc pas d'« À CORRIGER ». Tous les correctifs restants sont rédigés et
> prêts à appliquer, y compris l'intégration de la décision d'Ayoub (§4).

---

## 1. Ce que le tour 2 a corrigé

Tous les points du tour 1 sont traités et conformes aux arbitrages.

- **B1, le contrôle.** Le copy écrit désormais « Il ne s'engage jamais à votre place », et l'exception de l'accusé de réception est dite partout. Le guide et le prompt interdisent « rien ne part sans vous ».
- **B2, le développeur.** Il n'est plus mentionné nulle part.
- **Corrections majeures** : M1 (sous-titre avec la douleur et l'IA), M2 (titre arbitré), M3 (description sans le triplet de Sparkana), M4 (« un appel court »), M5 (FAQ à 7 questions), M6, M7, M8 (CAPEB attribué « En France, … (CAPEB 2023) »), M9.
- **Corrections mineures** : m1 à m12 sont appliqués.

**Contrôles demandés :**
- **Prix** : le copy du tour 2 n'affiche aucun montant. Il a été écrit avant la décision d'Ayoub : §4 l'intègre.
- **Délai en heures** : aucun. Conforme.
- **« Données en Suisse »** : absent des textes de l'offre, et maintenant décidé (§4). Il réapparaît à tort dans `confidentialite.md` pour le **site**, ce qui est faux (B1 ci-dessous).

---

## 2. Grille (copy du tour 2, avant intégration de la décision)

| # | Critère | Note | Justification |
|---|---|---|---|
| 1 | Clarté en 5 secondes | **4/5** | En cinq secondes, on sait ce que c'est (une IA, l'assistant), pour qui (les PME genevoises) et pour quoi (« Il reprend le bureau du soir »). Le titre qui tourne ne livre sa promesse complète qu'après plusieurs secondes. |
| 2 | Hiérarchie de la valeur | **4/5** | La douleur et le contrôle passent en tête. Dans la FAQ, la confiance (le refus n°1 du panel) n'arrive qu'en 5ᵉ position. |
| 3 | Leviers | **4/5** | Plus aucun levier sans preuve. Le contrôle est formulé exactement comme le produit fonctionne. |
| 4 | Friction | **4/5** | Phrases courtes et réponses de 60 mots au plus. Restent « geste » et un CTA de 33 signes, ce dernier imposé par le guide. |
| 5 | Objections | **4/5** | Les sept objections sont traitées sans rien promettre. Le prix et les données, les deux leviers réclamés par le panel, attendaient la décision qui vient d'arriver : **5/5 une fois le §4 appliqué**. |
| 6 | Spécificité | **4/5** | 3 demandes, le lundi, l'accusé de réception exact, OCSTAT, CAPEB. Le montant de 1'500.– portera ce critère à 5. |
| 7 | Cohérence avec le guide | **4/5** | Les textes de l'offre sont conformes. `mentions-legales.md` propose « agence digitale », ce que le glossaire n°15 interdit (M1). |
| 8 | Éthique | **3/5** | Les textes de l'offre méritent 5/5. Mais `confidentialite.md` propose d'écrire « site hébergé en Suisse », ce qui est faux (B1). Et la promesse sur les données doit être bornée à l'assistant vendu (M2). |

**Total : 31/40** (27 au tour 1). **1 bloquant, 2 majeurs, 4 mineurs**, plus 8 blocs d'intégration prêts (§4).

**Correction de ma part** : au tour 1, je n'ai pas relu `confidentialite.md` ni `mentions-legales.md`. Ce sont des fichiers du 30.08 restés dans `copy/`, que l'étape 5 appliquera comme le reste.

---

## 3. Problèmes restants

### BLOQUANT

**B1. `confidentialite.md` propose d'écrire que le site est hébergé en Suisse, ce qui est faux**
- **Où** : `confidentialite.md` §2.
- **Texte concerné** : APRÈS proposé : « Le site et la base de données sont hébergés en Suisse. »
- **Pourquoi** : la page en ligne dit, avec raison, « hébergés par Vercel Inc. … Francfort » (`confidentialite/page.tsx:81`). Les échanges avec Leo passent par un fournisseur d'IA hors de Suisse (`:82`, `lib/llm.ts`). **La décision d'Ayoub porte sur les données de l'assistant vendu aux clients, pas sur le site.** Il ne faut surtout pas « harmoniser » cette page vers « Suisse » : ce serait une fausse indication sur la seule page qui engage juridiquement (nLPD, LCD art. 3). Le premier patron qui vérifie ne croirait plus non plus la promesse sur ses propres données.
- **Correctif prêt** :
  1. §2 : **ne rien changer** à `confidentialite/page.tsx:81-82`. Le texte en ligne est exact.
  2. §4, données collectées, APRÈS : « **Formulaire de contact : votre nom, votre téléphone et votre message. Assistant de conversation : le contenu de l'échange, plus le prénom et le numéro que vous y laissez.** » L'adresse du site n'est plus demandée.
  3. §1, §3 et §5 : on garde les propositions.
  4. Marquer le fichier : « §2 sans objet : la page en ligne fait foi. Elle décrit le site. Les données de l'assistant client relèveront du contrat. »

### MAJEURS

**M1. `mentions-legales.md` reprend une identité que le glossaire interdit**
- **Où** : `mentions-legales.md` §1 et §2.
- **Texte concerné** : « Nawa Corps, agence digitale… » ; hébergeur « [Infomaniak, Suisse — à confirmer] ».
- **Pourquoi** : le glossaire n°15 dit « le studio… jamais agence ». L'hébergeur supposé contredit la page de confidentialité. L'incohérence entre deux pages ronge la confiance, qui est le refus n°1 du panel.
- **Correctif prêt** :
  - §1 APRÈS : « **Nawa Corps, studio genevois qui installe des assistants IA dans les PME, Genève, Suisse, exploité par Ayoub Bensalem.** » (`meta.md` §2, point ouvert n°18 ; texte légal relu par Ayoub.)
  - §2, hébergeur **du site** : « **Vercel Inc., serveurs à Francfort (Allemagne)** », comme sur `confidentialite/page.tsx:81`.

**M2. La promesse « données en Suisse » doit viser l'assistant vendu, pas Leo** (nouveau, né de la décision)
- **Où** : tout endroit où la phrase sera écrite (FAQ, contrôle, `/services`, prompt), et la fenêtre de Leo.
- **Pourquoi** : la FAQ « Et mes données ? » s'affiche sur la même page que Leo, dont les échanges partent hors de Suisse. « Vos données sont hébergées en Suisse » écrit sans borne serait lu comme valant aussi pour la conversation en cours. Le PM §6 le rappelle : une démonstration se présente comme telle. Il faut nommer la portée et rappeler, dans la fenêtre de Leo, ce que dit déjà la page de confidentialité.
- **Correctif prêt** :
  - **Formule unique** pour la promesse : « **Les données de votre assistant sont hébergées en Suisse.** » (EN : « **Your assistant's data is hosted in Switzerland.** »). Jamais « vos données » seul.
  - **Fenêtre de Leo** (`_chrome.md` §6, clé `note`) : « **Leo est une démonstration : ses échanges passent par un fournisseur d'IA hors de Suisse. Ne lui confiez rien de sensible.** » EN : « **Leo is a demonstration: its conversations go through an AI provider outside Switzerland. Do not share anything sensitive with it.** »
  - **Prompt** : voir §4, bloc 7.

### MINEURS (prêts à appliquer)

| # | Fichier:section | AVANT | APRÈS | Pourquoi |
|---|---|---|---|---|
| m1 | `accueil.md` §J, ordre | Qa, Qb, Qc, Qd, Qe, Qf, Qg | **Qe (références), Qc (données), Qb (IA qui écrit), Qa (bouche-à-oreille), Qd (outils), Qf (temps), Qg (prix)** | Le panel place la confiance (67) loin devant l'habitude (8). On répond d'abord à ce qui bloque le plus, et le prix reste en dernier. |
| m2 | `accueil.md` §G, `cta` | Voir quand vous payez | **Voir ce que vous payez** / **See what you pay** | Le montant existe désormais : on revient au libellé du tour 1, devenu exact. |
| m3 | `accueil.md` §F 01 ; `services.md` §3 | « Vous validez chaque réponse. » | « Vous validez chaque réponse **de fond**. » | Reprend le terme exact de la règle du PM : l'accusé de réception est aussi une réponse. |
| m4 | `studio.md` §2, paragraphe 1 | Ayoub Bensalem fonde le studio. | Ayoub Bensalem **a fondé** le studio. | Le présent sonne comme une annonce. |

---

## 4. Intégrer la décision d'Ayoub : blocs prêts à appliquer

**Règles d'affichage** (CLAUDE.md, PM l. 270-271) :
- Le montant est lu en base et noté ici `[MEP]`. Il s'affiche « 1'500.– », **sans « dès »**, avec « TVA comprise » dans la même unité de lecture.
- Aucun montant mensuel n'est affiché.

**Leviers employés** :
- Le prix est placé **à côté de la garantie** : on paie après l'essai (aversion au regret).
- Le texte dit en clair que l'abonnement n'est pas affiché, et pourquoi (il dépend du volume). On évite ainsi l'effet « prix caché » (12 au panel).
- La promesse sur les données est bornée (M2). Elle répond à la confiance (67).
- Aucun ancrage, aucune comparaison avec le marché (PM §8, leviers refusés).

### Bloc 1 — Hero

**Le prix ne monte pas en T1.** Un montant dans le titre ou le sous-titre ancrerait la décision sur le coût avant la valeur, et casserait la hiérarchie corrigée au tour 2. Le T1 reste tel quel. On intègre la décision dans le T3 (« La démo »), qui est déjà la ligne des faits.

| Clé | Tour 2 | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `specAtelier` / valeur | Studio / Genève | **Vos données / Hébergées en Suisse** | **Your data / Hosted in Switzerland** |
| `specSuivi` / valeur | La mise en place / Payée après l'essai | **La mise en place / [MEP] TVA comprise, après l'essai** | **The set-up / [MEP] VAT incl., after the trial** |

- Genève reste présent dans le kicker (« Studio genevois »).
- La longueur de `specSuivi` est à mesurer. Repli : libellé « Mise en place, après l'essai », valeur « [MEP] TVA comprise ».
- Le libellé du T3 dit « Vos données ». Il est lu au-dessus de « 3 vraies demandes » : la portée de la promesse (vos demandes, votre assistant) est donc claire, et M2 reste respecté.

### Bloc 2 — Section (04) « Ce que vous payez, et quand »

Le titre ne change pas : « **La mise en place, / payée après l'essai.** »

| Carte | Ce que vous payez (FR) | Texte FR |
|---|---|---|
| 1 La démo | **Rien** | Nous prenons trois demandes de votre semaine. Nous vous montrons ce que l'assistant en aurait fait. Aucun accès à vos outils. À la fin, le prix de l'abonnement. |
| 2 L'essai | **Rien pendant l'essai** | *inchangé* |
| 3 L'abonnement | **Mise en place : [MEP], TVA comprise.** **Puis un abonnement mensuel selon votre volume.** | Vous payez la mise en place après l'essai, si le relevé vous convient. Le prix de l'abonnement est fixe, annoncé à la fin de la démo, avant l'essai. Sans engagement. |

| Carte | EN |
|---|---|
| 1 | …No access to your tools. At the end, the subscription price. |
| 3 | **Set-up: [MEP], VAT included. Then a monthly subscription based on your volume.** · You pay for the set-up after the trial, if the report suits you. The subscription price is fixed, given at the end of the demo, before the trial. No commitment. |

**Note sous la grille**, APRÈS FR : « **Une seule tâche pour commencer : celle qui vous prend le plus de soirées. Mise en place [MEP], TVA comprise, payée après l'essai. L'abonnement dépend de votre volume : prix fixe annoncé à la fin de la démo, sans engagement. Réponse le jour ouvrable suivant.** »

EN : « **One task to start with: the one that takes up most of your evenings. Set-up [MEP], VAT included, paid after the trial. The subscription depends on your volume: a fixed price given at the end of the demo, no commitment. A reply the next working day.** »

### Bloc 3 — FAQ prix (remplace Qg, toujours en dernier)

- **FR, question** : **Combien ça coûte ?**
- **FR, réponse** : « La démo et l'essai ne coûtent rien. La mise en place coûte [MEP], TVA comprise. Elle ne se paie qu'après l'essai, si le relevé vous convient. Ensuite, un abonnement mensuel, parce que nous suivons l'assistant chaque semaine. Son prix dépend de votre volume. Il est fixe, annoncé à la fin de la démo, avant l'essai, et sans engagement. » (≈ 55 mots)
- **EN, question** : **How much does it cost?**
- **EN, réponse** : « The demo and the trial cost nothing. The set-up costs [MEP], VAT included. It is only paid after the trial, if the report suits you. Then a monthly subscription, because we look after the assistant every week. Its price depends on your volume. It is fixed, given at the end of the demo, before the trial, and with no commitment. »
- **Pourquoi** : la question nomme l'objection du panel (« prix caché ») mieux que « Encore un abonnement ? ». La réponse traite les deux. Elle alimente aussi le JSON-LD `FAQPage` : les moteurs y lisent un vrai prix.

### Bloc 4 — FAQ données (remplace Qc, 2ᵉ position)

- **FR** : **Et mes données ?** · « Les données de votre assistant sont hébergées en Suisse, sous la loi suisse sur la protection des données (nLPD). Pour la démo, nous n'accédons à aucun de vos outils, et vous pouvez masquer les noms. Pendant l'essai, l'assistant ne travaille que sur les demandes que vous lui confiez. Il n'a pas accès à vos paiements. » (≈ 55 mots)
- **EN** : **What about my data?** · « Your assistant's data is hosted in Switzerland, under the Swiss data protection act (nFADP). For the demo, we access none of your tools, and you can hide the names. During the trial, the assistant only works on the enquiries you give it. It has no access to your payments. »
- **Pourquoi « sous la nLPD » plutôt que « conforme à la nLPD »** : le PM autorise « conforme ». Mais la conformité est un jugement juridique qu'aucun avis écrit ne vient encore étayer (`_sans-preuve.md` S12 ; `founder/marketing.md` : « LCD et nLPD à faire relire »). « Sous la nLPD » dit un fait (la loi applicable), rassure autant et ne peut pas être démenti. **C'est à Ayoub de choisir** : si un avis juridique existe, « conforme à la nLPD » est permis.

### Bloc 5 — Section (03) « Le contrôle », accueil §H

- **Fait** `faitLieuNote`, APRÈS : « Genève / **Données en Suisse** » ; EN : « Geneva / **Data in Switzerland** ».
- **`paragraphe1`**, phrase ajoutée en fin, FR : « **Les données de votre assistant sont hébergées en Suisse.** » EN : « **Your assistant's data is hosted in Switzerland.** »

### Bloc 6 — `/services`

- §5, une puce s'ajoute après « Il n'a pas accès à vos paiements » :
  - FR : « **Les données de votre assistant sont hébergées en Suisse, sous la nLPD.** »
  - EN : « **Your assistant's data is hosted in Switzerland, under the nFADP.** »
- §6, étape 3, APRÈS FR : « **L'abonnement.** Si le relevé vous convient, vous payez la mise en place, [MEP] TVA comprise, puis l'abonnement mensuel continue, au prix annoncé à la fin de la démo. Sans engagement. »
- Description `meta` (`services.md` §1), fin, APRÈS : « …Démo sur vos demandes. Mise en place [MEP], TVA comprise. » La longueur est à mesurer (≤ 155 signes). Sinon, on garde la version du tour 2.

### Bloc 7 — Prompt de Leo (`chatbot.md`)

- **PRIX**, APRÈS : « La seule chose que tu peux dire : "La mise en place coûte ${prixMiseEnPlace}, TVA comprise. Elle se paie après l'essai, si le relevé vous convient. L'abonnement mensuel dépend de votre volume : son prix est fixe, annoncé à la fin de la démo, et sans engagement." Aucun autre montant, aucune fourchette pour l'abonnement, jamais "dès". »
  - `${prixMiseEnPlace}` est lu en base, au même format que l'affichage. C'est une seule ligne, pas `${listePrix}`.
- **DONNÉES**, APRÈS : « Tu peux dire : "Les données de votre assistant sont hébergées en Suisse, sous la nLPD." Tu ne dis JAMAIS que cette conversation-ci est hébergée en Suisse : tu es une démonstration, et tes échanges passent par un fournisseur hors de Suisse. Si on te le demande, dis-le simplement. »

### Bloc 8 — CTA

- Le CTA principal ne change pas (« Voir l'assistant sur mes demandes »). La démo reste la première marche ; le prix n'a pas à devenir le geste.
- Méthode : « **Voir ce que vous payez** » (m2).

---

## 5. Le panel de 100 PME après la décision

| Refus | Réponse dans le copy | Ce qui reste hors de portée |
|---|---|---|
| **Confiance 67** (références, données) | Franchise sur le « 0 client », démo sur ses propres demandes, **données de l'assistant en Suisse** (blocs 1, 4, 5, 6) | Un collègue genevois à appeler : 0 client. Ne rien simuler. |
| **Prix caché 12** | **Mise en place [MEP] TVA comprise, à côté de la garantie** ; abonnement annoncé avant l'essai, sans engagement (blocs 2, 3) | Le montant mensuel, qui n'est pas affiché (décision). Le texte dit pourquoi : il dépend du volume. |
| **Habitude 8** | Qa : « Si vous ne faites pas de bureau le soir, vous n'en avez pas besoin. » | — |

---

## 6. Mise en valeur

| Section | À garder tel quel | Le point le plus faible |
|---|---|---|
| Hero | « Il reprend le bureau du soir. C'est une IA réglée sur votre métier. Vous l'essayez avant de signer. » | Le T3 à compléter (bloc 1) |
| (03) Contrôle | « Un seul message part seul : l'accusé de réception… Vous l'avez relu et validé une fois. » | Le bloc 5 à ajouter |
| (04) Offre | Le titre « La mise en place, / payée après l'essai. » : le prix vient s'y poser | Carte 3 (bloc 2) |
| FAQ | Qa, la franchise sur le besoin | L'ordre des questions (m1) et la question sur le prix (bloc 3) |
| Pages légales | — | B1 et M1 |

---

## 7. Verdict

**ESCALADE vers boss-decision.** Le PLAN et la décision d'Ayoub du 24.10 portent G2 à GO : la suite passe donc directement à l'étape 5, sous réserve des points ci-dessous.

Les textes de l'offre sont prêts. Ce qui reste est rédigé, à appliquer tel quel :
1. **B1**, `confidentialite.md` : ne pas écrire « site hébergé en Suisse » ; la page en ligne fait foi.
2. **M1**, `mentions-legales.md` : « studio genevois… » et l'hébergeur réel du site.
3. **M2**, borner la promesse à « Les données de votre assistant » et ajouter la note de Leo.
4. §4, blocs 1 à 8 : le prix et les données intégrés au hero (T3), à l'offre, à la FAQ, au contrôle, à `/services`, au prompt et au CTA.
5. Mineurs m1 à m4.

**Conditions de vérité à confirmer par Ayoub avant mise en ligne** (je ne les tranche pas) :
- **(a) Hébergement.** « Hébergées en Suisse » doit couvrir **aussi le modèle d'IA** qui traite les demandes des clients, pas seulement le stockage. Aujourd'hui, `lib/llm.ts` passe par Gemini ou Groq, hors de Suisse (PM §10 n°3 posait exactement cette condition). Sinon, la phrase devient trompeuse (LCD art. 3).
- **(b) nLPD.** « Conforme » exige un avis juridique, sinon on écrit « sous la nLPD » (bloc 4).
- **(c) Table `Service`.** Le montant de 1'500.– doit y être inscrit et les anciennes formules retirées. Cela suppose une écriture en prod Neon, avec son accord explicite.
- **(d) TVA.** « TVA comprise » suppose que l'assujettissement d'Ayoub est tranché (PM §10 n°8).
- **(e) PM.** Les mentions « à confirmer » des lignes 60, 399 et 430 contredisent encore la ligne 272 : à nettoyer.
