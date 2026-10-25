# Accueil `/` et `/en` — tour 2 (24.10.2026)

> Mode `propose`. Aucun fichier du site modifié. Tour 1 archivé :
> `docs/agents/_archive/2026-10-24-tour1/copy/accueil.md`. Revue :
> `docs/agents/reviews/psy-A-agent-metier-tour1.md`. Arbitrages : fin de
> `_points-ouverts.md`. Guide : `docs/agents/brand/voice-guide.md` (tour 2).
> PM = `.agents/product-marketing.md`. Chaînes dans `lib/dictionnaires/fr.ts`
> et `en.ts`, sauf mention contraire.
> **Mot-clé cible** : *assistant IA PME Genève* : `title` (« L'assistant IA
> qui… »), sous-titre (« une IA »), h1 (« L'assistant »). Métadonnées : `meta.md`.

## Ce que le tour 2 corrige

| Revue | Où |
|---|---|
| B1 contrôle trop absolu | §C (spec), §E, §F 01, §G étape 03, §H (citation, §1), §I carte 2, §J Qc |
| B2 développeur | §H paragraphe 3 |
| M1 sous-titre sans douleur ni IA | §A.3 |
| M2 titre générique | §A.2 (arbitrage) |
| M4 « dix minutes » | §G étape 01, §J Qf (arbitrage : « un appel court ») |
| M5 FAQ | §J : 7 questions, nouvel ordre |
| M6 données | §J Qd |
| M7 « une base par métier » | §F en-tête et ligne de fin |
| M9 CTA de la méthode | §G `cta` |
| Prix avant l'essai (arbitrage) | §G étape 02, §I, §J Qg |
| m1, m3, m4, m10, m11 | §A.1, §H, §I note, §F 02, §H paragraphe 3 |

## 0. L'architecture

Design et ordre des composants inchangés ; seul le rôle des sections change.
Aucun montant.

| # | Composant | Ancre | Nouveau rôle |
|---|---|---|---|
| — | `NoyauHero` T1 à T4 | `#top` | La promesse ; la scène du chantier ; « 3 vraies demandes » ; le slogan |
| — | `Strip` | — | Trois gestes, le contrôle, le relevé |
| 01 | `ServicesRows` | `#services` | Ce qu'il fait, métier par métier, le sanitaire d'abord |
| 02 | `Methode` | `#methode` | Appel, démo (prix annoncé à la fin), essai, abonnement |
| 03 | `Studio` | `#studio` | Le contrôle, le relevé, qui nous sommes |
| 04 | `Offres` | `#offres` | Ce que vous payez, et quand : 3 cartes, aucun montant |
| 05 | `Faq` | `#faq` | 7 objections, 60 mots au plus |
| 06 | `FooterContact` | `#contact` | Montrez-nous trois demandes |

**Structure (étape 5)** : `Offres` statique, sans lecture de la table
`Service`, sans « Recommandé » ; `Faq` à 7 questions, sans montants ;
`app/(site)/page.tsx:39-53` sans `prixEntreeCents`.

---

## A. Hero — temps 1

### A.1 Kicker (`fr.ts:250-252`, `en.ts:151-154` ; `kickerMetier` = texte du loader)

- AVANT : Studio de création digitale · Genève, Suisse · Pour les artisans du bâtiment
- APRÈS FR : **Studio genevois · Assistants pour PME** (`kickerCible` vide ou retiré à l'étape 5)
- APRÈS EN : **Geneva studio · Assistants for small businesses**
- POURQUOI : m1, « PME » ne se répète plus. L'ancien métier n'est plus vendu (PM §5).
- PREUVE : PM §1 « Studio genevois, sans bureau ».

### A.2 Le titre qui tourne (`fr.ts:258-260`, `en.ts:155-157` ; ≤ 21 caractères par ligne)

- AVANT : Un site qui / vend. · qualifie vos demandes. · vous fait gagner du temps.
- APRÈS FR (arbitrage M2) :
  ```
  h1Debut     L'assistant qui              (15)
  h1Rotation  connaît votre métier.        (21)
              répond à vos clients.        (21)
              prépare vos devis.           (18)
              attend votre accord.         (20)
  h1Complet   L'assistant qui connaît votre métier, répond à vos clients, prépare vos devis et attend votre accord.
  ```
- APRÈS EN :
  ```
  h1Debut     The assistant that           (18)
  h1Rotation  knows your trade.            (17)
              answers your clients.        (21)
              drafts your quotes.          (19)
              waits for your OK.           (18)
  h1Complet   The assistant that knows your trade, answers your clients, drafts your quotes and waits for your OK.
  ```
- POURQUOI : la phrase va de la base métier au contrôle ; le triplet générique
  du marché disparaît (PM §4). La première fin, vue sans animation, porte la
  promesse. La relance reste dans la bande et en §F.
- PREUVE : PM §3 « La phrase » ; arbitrage M2.

### A.3 Sous-titre (`fr.ts:261-262`, `en.ts:158-159` ; FR ≤ 104, EN ≤ 94 signes)

- AVANT : Pour les artisans genevois : des demandes précises, moins de téléphone, et votre site vu avant de payer.
- APRÈS FR : **Il reprend le bureau du soir. C'est une IA réglée sur votre métier. Vous l'essayez avant de signer.** (99)
- APRÈS EN : **It takes the evening paperwork off you. An AI set to your trade. You try it before you sign.** (91)
- POURQUOI : M1. La douleur n°1 (PM §2) et l'IA arrivent dans le temps 1,
  l'IA après le résultat (guide §4). La démo est dans le temps 3.
- PREUVE : PM §2 « le bureau qui mange ses soirées » ; §1 engagement 1.

### A.4 Boutons (`fr.ts:267-269`, `en.ts:164-166`)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `ctaPrincipal` | Recevoir mon aperçu | **Voir l'assistant sur mes demandes ** | **See it on my enquiries ** |
| `ctaSecondaire` | Voir l'offre | **Voir le parcours** | **See how it works** |

- PREUVE : PM §3 pilier 2. Repli court : « Le voir sur mes demandes ».

## B. Hero — temps 2 (`fr.ts:272-275`, `en.ts:168-171` ; ≤ 83, cible 75)

- AVANT : (001) Le noyau · « La demande arrive complète, avec photos. Vous chiffrez, *le devis se relance*. »
- APRÈS FR : **(001) Une demande arrive** · « Pendant le chantier, l'assistant demande l'adresse, *une photo* et l'urgence. » (75)
- APRÈS EN : **(001) An enquiry comes in** · « On site? The assistant asks for the address, *a photo*, the urgency. » (≈ 66)
- POURQUOI : la scène du métier. Elle reste vraie avec l'arbitrage B1 : c'est
  l'accusé de réception validé une fois qui pose ces questions ; l'exception
  est dite en §F 01 et §H.
- PREUVE : PM §5 « il demande l'adresse, une photo, l'urgence » ; arbitrage B1.

## C. Hero — temps 3 (`fr.ts:287-300`, `en.ts:181-195`)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `temps3Section` | Le cœur | **La démo** | **The demo** |
| `grandMot` | Tout | **3** | **3** |
| `grandMotUnite` | de bout en bout | **vraies demandes** | **real enquiries** |
| `specAtelier` | Atelier / Genève | **Studio / Genève** | **Studio / Geneva** |
| `specSite` | Le site / En ligne en une semaine | **Vos outils / Aucun accès pour la démo** | **Your tools / No access for the demo** |
| `specReste` | Vos devis / Relancés pour vous | **Prix et devis / Validés par vous** | **Prices and quotes / Approved by you** |
| `specTextes` | Vos textes / Repris de votre site | **Le relevé / Chaque lundi** | **The report / Every Monday** |
| `specSuivi` | Suivi / Sans engagement | **La mise en place / Payée après l'essai** | **The set-up / Paid after the trial** |

- POURQUOI : B1, « Rien sans votre accord » était trop absolu ; ce qui ne part
  jamais sans le patron, ce sont les prix et les devis.
- PREUVE : PM §5 parcours, garantie ; arbitrage B1.

## D. Hero — temps 4 (`fr.ts:306-309`, `en.ts:197-200`)

- AVANT : Plus aucune demande perdue pendant vos chantiers.
- APRÈS FR : **Vous validez. Il s'occupe du reste.** · [**Le voir sur mes demandes →**] [**Voir le parcours**]
- APRÈS EN : **You approve. It handles the rest.** · [**See it on my enquiries →**] [**See how it works**]
- PREUVE : brand §2, slogan recommandé ; S6.

## E. Bande défilante (`fr.ts:339-344`, `en.ts:221-226`)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `refonte` | Site pour artisans | **Répond à vos clients** | **Answers your clients** |
| `devis` | Demandes avec photos | **Relance vos devis** | **Follows up your quotes** |
| `rendezVous` | Devis relancés | **Prépare vos devis** | **Drafts your quotes** |
| `reseauxSociaux` | Réponse automatique | **Jamais à votre place** | **Never on your behalf** |
| `delai` | Une semaine dès votre feu vert | **Un relevé chaque lundi** | **A report every Monday** |
| `lieu` | Genève | *inchangé* | *inchangé* |

- POURQUOI : B1 ; « relance vos devis » parle comme les patrons (VP §2).
- PREUVE : PM §5 ; arbitrage B1.

## F. (01) Par métier (`fr.ts:365-389`, `en.ts:238-259`)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `section` | Services | **Par métier** | **By trade** |
| `titreLigne1` / `2` | Cinq gestes, / le même endroit. | **Une base par métier, / le sanitaire d'abord.** | **One base per trade, / plumbing first.** |

- POURQUOI : M7, cinq métiers montrés à égalité laissaient croire à cinq
  bases prêtes. Arbitrage n°2 : les autres restent en exemples.
- PREUVE : PM §5 bis, ordre ; board séance 9.

**01 · Sanitaire et chauffage** (`titre01`, `corps01`, `lien01` → `#offres`)
- APRÈS FR : « Une demande arrive pendant que vous êtes sur le chantier. Un accusé de réception, validé par vous une fois, demande l'adresse, une photo et l'urgence. Le soir, vous trouvez une liste triée. Vous validez chaque réponse. Il sait déjà ce qu'est un bon de régie. » (46 mots) · **Voir le parcours →**
- APRÈS EN : "An enquiry comes in while you are on site. An acknowledgement, approved by you once, asks for the address, a photo and the urgency. In the evening, you find a sorted list. You approve every reply. It already knows what an agency work order is." · **See how it works →**
- PREUVE : PM §5 bis ; arbitrage B1.

**02 · Électricité** (`lien02` → `/devis`)
- AVANT (tour 1) : « Le même travail que pour le sanitaire. Il prend la demande… »
- APRÈS FR : « Il prend la demande pendant le chantier, prépare le devis et le relance s'il reste sans réponse. Vous relisez, vous corrigez, vous envoyez. Combien de soirées par semaine passez-vous sur vos devis ? » (35 mots) · **Le voir sur mes demandes →**
- APRÈS EN : "It takes the enquiry while you are on site, drafts the quote and follows it up if it gets no answer. You read, you correct, you send. How many evenings a week do you spend on quotes?" · **See it on my enquiries →**
- POURQUOI : m10. PREUVE : PM §5 bis, phrase d'appel mot pour mot.

**03 · Fiduciaires** (`lien03` → `#offres`) — *inchangé du tour 1* : « Il réclame les pièces à vos clients jusqu'à ce que le dossier soit complet. Il trie ce qui arrive. Chaque lundi, le relevé vous dit quels dossiers attendent encore. Combien d'heures par semaine passez-vous à courir après les pièces de vos clients ? » · EN *inchangé*. Aucune promesse sur le secret de la clientèle (arbitrage n°2).

**04 · Régies et agences** (`lien04` → `#offres`) — *inchangé du tour 1* (« Il aide le gérant. Il ne le remplace pas. »).

**Ligne sous les quatre lignes** (nouvelle chaîne, structure étape 5)
- APRÈS FR : **Nous commençons par le sanitaire et le chauffage. L'électricité suit, puis les autres métiers, un à la fois.**
- APRÈS EN : **We start with plumbing and heating. Electrical work follows, then other trades, one at a time.**
- PREUVE : PM §5 bis ; M7.

## G. (02) Comment ça se passe (`fr.ts:399-420`, `en.ts:271-293`)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `section` | Méthode | **Comment ça se passe** | **How it works** |
| `titreLigne1` / `2` | Du feu vert à la mise / en ligne : une semaine. | **Vos demandes d'abord, / votre signature après.** | **Your enquiries first, / your signature after.** |
| `etape01` | En amont / Le premier appel / Un quart d'heure… | **Au départ / L'appel / Un appel court. Vous nous dites ce qui vous prend vos soirées. Nous ne vous vendons rien ce jour-là.** | **First / The call / A short call. You tell us what takes up your evenings. We sell you nothing that day.** |
| `etape02` | Avant de payer / L'aperçu / … | **Sans rien payer / La démo / Vous nous montrez trois demandes de votre semaine. Nous vous montrons ce que l'assistant en aurait fait. À la fin, nous vous annonçons le prix fixe.** | **Free of charge / The demo / You show us three enquiries from your week. We show you what the assistant would have done with them. At the end, we give you the fixed price.** |
| `etape03` | Fin de semaine / La mise en ligne / … | **Sans rien payer / L'essai / L'assistant travaille sur vos vraies demandes. Il ne s'engage jamais à votre place. Chaque lundi, vous recevez le relevé.** | **Free of charge / The trial / The assistant works on your real enquiries. It never commits on your behalf. Every Monday, you get the report.** |
| `etape04` | Ensuite / Le suivi / … Sans engagement. | **Si le relevé vous convient / L'abonnement / Vous payez la mise en place, puis l'abonnement continue. Nous suivons l'assistant chaque semaine.** | **If the report suits you / The subscription / You pay for the set-up, then the subscription carries on. We look after the assistant every week.** |
| `cta` (→ `#offres`) | Voir l'offre et le prix | **Voir quand vous payez ** | **See when you pay ** |

- POURQUOI : M4 et arbitrage (« un appel court ») ; arbitrage « prix avant
  l'essai » ; B1 ; M9 (le CTA ne promet plus un montant). « Aucun accès à vos
  outils » quitte l'étape 02 : il est au temps 3 et en §I.
- PREUVE : PM §5 parcours ; brand §5.2.

## H. (03) Le contrôle (`fr.ts:430-460`, `en.ts:300-321`)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `section` | Le studio | **Le contrôle** | **Control** |
| `titreCache` | Le studio | **Le contrôle et le studio** | **Control, and the studio** |
| `citation*` | « Vous parlez à ceux qui *font* le travail. » | **« Il ne s'engage *jamais* à votre place. »** | **“It *never* commits on your behalf.”** |
| `faitDelai` / `Note` | Une semaine / Site en ligne | **Lundi / Le relevé** | **Monday / The report** |
| `faitLangues` / `Note` | FR / EN / Langues | **Aucun / Accès à vos paiements** | **None / Access to your payments** |
| `faitLieuNote`, `lien` | Basé ici · Voir qui fait le travail → | *inchangés* | *inchangés* |

**`paragraphe1`** (B1)
- APRÈS FR : **Aucun prix, aucune date, aucun devis, aucune réponse de fond ne part sans votre accord. Un seul message part seul : l'accusé de réception qui demande l'adresse, une photo et l'urgence. Vous l'avez relu et validé une fois. L'assistant n'a pas accès à vos paiements.** (47 mots)
- APRÈS EN : **No price, no date, no quote and no real reply goes out without your approval. Only one message goes out on its own: the acknowledgement asking for the address, a photo and the urgency. You read and approved it once. The assistant has no access to your payments.**
- PREUVE : arbitrage B1 ; PM §5 « Pas d'accès aux paiements ».

**`paragraphe2`** — *inchangé du tour 1* (le relevé ; « S'il ne s'est rien passé, le relevé le dit. »).

**`paragraphe3`** (B2, m11)
- APRÈS FR : **Nawa Corps est un studio genevois, sans bureau. Ayoub Bensalem fait le premier appel et suit chaque client. Nous n'avons pas encore de client pour l'assistant : vous seriez parmi les premiers.**
- APRÈS EN : **Nawa Corps is a Geneva studio with no office. Ayoub Bensalem makes the first call and looks after every client. We have no client for the assistant yet: you would be among the first.**
- PREUVE : PM §1, §6 ; arbitrage B2 (aucune mention du développeur).

## I. (04) Ce que vous payez, et quand (`fr.ts:476-520`, `en.ts:333-368` ; statique)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `section` | Offres | **L'offre** | **The offer** |
| `titreLigne1` / `2` | Des prix clairs, / tout compris. | **La mise en place, / payée après l'essai.** | **The set-up, / paid after the trial.** |
| `recommande` | Recommandé | **supprimé** | **removed** |

| Carte | Ligne de tête | Titre | Ce que vous payez | Texte FR | CTA |
|---|---|---|---|---|---|
| 1 | Sur trois de vos demandes | **La démo** | **Rien** | Nous prenons trois demandes de votre semaine. Nous vous montrons ce que l'assistant en aurait fait. Aucun accès à vos outils. À la fin, le prix fixe. | **Le voir sur mes demandes** (→ `/devis`) |
| 2 | Sur vos vraies demandes | **L'essai** | **Rien pendant l'essai** | L'assistant travaille sur vos demandes. Il ne s'engage jamais à votre place. Vous recevez le relevé chaque lundi. | — |
| 3 | Si le relevé vous convient | **L'abonnement** | **Le prix fixe annoncé à la fin de la démo** | Vous payez la mise en place, puis l'abonnement continue. Nous suivons l'assistant chaque semaine. | — |

| Carte | EN |
|---|---|
| 1 | On three of your enquiries / **The demo** / **Nothing** / We take three enquiries from your week. We show you what the assistant would have done with them. No access to your tools. At the end, the fixed price. · **See it on my enquiries** |
| 2 | On your real enquiries / **The trial** / **Nothing during the trial** / The assistant works on your enquiries. It never commits on your behalf. You get the report every Monday. |
| 3 | If the report suits you / **The subscription** / **The fixed price given at the end of the demo** / You pay for the set-up, then the subscription carries on. We look after the assistant every week. |

**Note sous la grille** (m4)
- APRÈS FR : **« Une seule tâche pour commencer : celle qui vous prend le plus de soirées. Le prix est fixe, annoncé à la fin de la démo, avant l'essai. Réponse le jour ouvrable suivant. »**
- APRÈS EN : **"One task to start with: the one that takes up most of your evenings. The price is fixed, given at the end of the demo, before the trial. A reply the next working day."**
- PREUVE : PM §5 « un seul geste », « Le prix », « La garantie » ; arbitrage prix ; `MENTION_REPONSE`.

## J. (05) Questions (`fr.ts:565-601`, `en.ts:388-418` ; alimente le JSON-LD `FAQPage`)

Sept questions (structure à étendre), dans cet ordre (M5) : objection n°1 du
panel d'abord, prix en dernier. Les clés `tarifs*` et `reponse3*` disparaissent.

**Qa — « je n'ai pas de problème » (panel 52/100)**
- FR : **Mon travail vient du bouche-à-oreille. Pourquoi un assistant ?** · « Il ne vous amène pas de clients. Il reprend le bureau : les demandes reçues pendant le chantier, les devis à préparer, les relances. Si vous ne faites pas de bureau le soir, vous n'en avez pas besoin. Nous vous le dirons dès le premier appel. » (49 mots)
- EN : **My work comes by word of mouth. Why an assistant?** · "It does not bring you clients. It takes over the office work: enquiries received while you are on site, quotes to prepare, follow-ups. If you do no office work in the evening, you do not need it. We will tell you so on the first call."
- PREUVE : PM §2 (« Sa douleur n'est pas “je rate des clients” ») ; `founder/marketing.md` §2.

**Qb — « une IA qui écrit à mes clients » (board) — B1**
- FR : **Une IA qui écrit à mes clients, je n'en veux pas.** · « Vous avez raison de garder la main. Un seul message part sans vous : l'accusé de réception qui demande l'adresse, une photo et l'urgence, et vous le validez une fois. Ensuite, aucune réponse de fond, aucun devis, aucun prix ne part sans votre accord. Il ne s'engage jamais à votre place. » (52 mots)
- EN : **I don't want an AI writing to my clients.** · "You are right to keep control. Only one message goes out without you: the acknowledgement asking for the address, a photo and the urgency, and you approve it once. After that, no real reply, no quote and no price goes out without your approval. It never commits on your behalf."
- PREUVE : arbitrage B1 ; PM §1 engagement 2.

**Qc — données (board) — M6**
- FR : **Et mes données ?** · « Pour la démo, nous n'avons accès à aucun de vos outils : vous nous montrez trois demandes, noms masqués si vous le voulez. Pendant l'essai, l'assistant travaille sur vos demandes, et sur rien d'autre que vous ne lui confiez. Il n'a pas accès à vos paiements. » (46 mots)
- EN : **What about my data?** · "For the demo, we have no access to any of your tools: you show us three enquiries, names hidden if you like. During the trial, the assistant works on your enquiries and on nothing you have not given it. It has no access to your payments."
- PREUVE : PM §5. Hébergement : non écrit (S1, S2).

**Qd — « j'ai déjà WhatsApp et mon logiciel » (panel 17/100)**
- FR : **J'ai déjà WhatsApp et un logiciel de devis.** · « Pour la démo, vous ne changez rien : vous nous montrez des demandes reçues par WhatsApp, par e-mail ou au téléphone. Ce que l'assistant peut lire dans vos outils se vérifie outil par outil, avec vous. Nous ne vous promettons pas un branchement avant de l'avoir testé. » (49 mots)
- EN : **I already have WhatsApp and quoting software.** · "For the demo, you change nothing: you show us enquiries received by WhatsApp, email or phone. What the assistant can read in your tools is checked tool by tool, with you. We do not promise a connection before we have tested it."
- PREUVE : PM §5 conditions, §10 n°7 (rien promis, S3).

**Qe — références (panel 23/100), fusionnée avec « ça marche chez moi ? »**
- FR : **Vous avez des références ?** · « Pas encore pour l'assistant, et nous préférons le dire. Vous seriez parmi les premiers. C'est pour cela que la démo se fait sur trois de vos vraies demandes : vous jugez sur les vôtres, pas sur un exemple ni sur notre parole. » (43 mots)
- EN : **Do you have references?** · "Not yet for the assistant, and we would rather say so. You would be among the first. That is why the demo runs on three of your real enquiries: you judge on your own, not on an example or on our word."
- PREUVE : PM §6.

**Qf — « je n'ai pas le temps »**
- FR : **Je n'ai pas le temps pour ça.** · « Le premier appel est court. La démo part de demandes que vous avez déjà reçues. Pendant l'essai, votre part est de lire et de valider ce que l'assistant prépare. Il reprend du bureau, il ne vous en ajoute pas. » (42 mots)
- EN : **I don't have time for this.** · "The first call is short. The demo starts from enquiries you have already received. During the trial, your part is to read and approve what the assistant prepares. It takes office work off you; it does not add any."
- PREUVE : arbitrage « un appel court » ; PM §5 conditions.

**Qg — « encore un abonnement » (panel 5/100)**
- FR : **Encore un abonnement ?** · « Oui, parce que nous suivons l'assistant chaque semaine. Mais la démo ne coûte rien, et l'essai non plus. Le prix est fixe : nous l'annonçons à la fin de la démo, avant l'essai. La mise en place ne se paie qu'après l'essai, si le relevé vous convient. » (48 mots)
- EN : **Another subscription?** · "Yes, because we look after the assistant every week. But the demo costs nothing, and neither does the trial. The price is fixed: we give it at the end of the demo, before the trial. The set-up is only paid after the trial, if the report suits you."
- PREUVE : PM §5 ; arbitrage prix.

**Boutons de fin** : `ctaDevis` **Le voir sur mes demandes ** / **See it on my enquiries ** ; `ctaFormules` **Voir l'assistant en détail** / **See the assistant in detail**.

## K. (06) Contact

Voir `_chrome.md` §5.

## L. Supprimés sans remplacement

| Fichier:ligne | Texte | Pourquoi |
|---|---|---|
| `app/(site)/page.tsx:48`, `en/page.tsx:136` | « Dès [x].–, TVA comprise. » | Aucun montant (PM §5). |
| `Offres.tsx:233-269` ; `Faq.tsx:62-67` | montants, « dès », « /mois », TVA | Idem. |
