# Revue A, tour 1 : textes de l'offre « assistant » (24.10.2026)

> Revue psy-persuasion. Périmètre : `docs/agents/brand/voice-guide.md` et tous les
> `docs/agents/copy/*.md` du 24.10.2026. Les arbitrages en fin de
> `copy/_points-ouverts.md` font foi.
> Référentiels : `.agents/product-marketing.md` (PM), `founder/marketing.md` (objections du
> panel), `founder/research/vraies-voix-patrons.md` (VP),
> `founder/research/agences-ia-positionnement.md` (AG).
> Nom du fichier : le format `psy-A-<slug>-tour<n>` a été retenu à la place de
> `psy-A-agent-metier.md` (PLAN) pour que le tour 2 n'écrase pas le tour 1.
> Je n'ai modifié aucun fichier du site ni aucun texte d'un autre agent.

---

## 1. Grille

| # | Critère | Note | Justification |
|---|---|---|---|
| 1 | Clarté en 5 secondes | **3/5** | On voit vite ce que c'est (un assistant) et pour qui (PME genevoises). Mais rien ne dit qu'il s'agit d'une IA ni pourquoi s'en occuper maintenant : dans le temps 1, « assistant » peut se lire « secrétaire » ou « agence de placement ». |
| 2 | Hiérarchie de la valeur | **3/5** | Les verbes sont concrets. Mais la douleur la plus forte (le bureau qui mange les soirées, PM §2) n'apparaît pas dans le hero. Le titre ouvre sur les trois verbes génériques du marché. |
| 3 | Leviers | **3/5** | La franchise (« 0 client »), l'effet de possession (« 3 vraies demandes ») et l'aversion au regret (« payée après l'essai ») sont exemplaires. Deux leviers n'ont pas de preuve (le développeur sur chaque démo ; une base pour cinq métiers). Le levier du contrôle est formulé de façon trop absolue (B1). |
| 4 | Friction | **4/5** | Les phrases sont courtes, toutes sous 25 mots, et le texte ne contient ni jargon technique ni double négation. Restent « geste » (mot interne), un CTA de 33 signes et un CTA qui annonce un prix que la section ne donne pas. |
| 5 | Objections | **3/5** | Quatre objections sur six sont traitées, et bien. Deux manquent : la n°1 du panel, « je n'ai pas de problème » (52/100), et « j'ai déjà WhatsApp et mon logiciel » (17/100). Dans l'ordre de la FAQ, le prix arrive en 2ᵉ position. |
| 6 | Spécificité | **4/5** | Le texte s'appuie sur des faits concrets : 3 demandes, le lundi, l'adresse, la photo, l'urgence, le bon de régie, 441 entreprises (OCSTAT 2024). Faute de décision, il ne donne aucune durée, ce qui est correct. « Dix minutes » n'a pas de source. |
| 7 | Cohérence avec le guide | **4/5** | Le lexique et le ton sont tenus. Mais les cinq mots de Sparkana apparaissent dans cet ordre dans la description de l'accueil (et dans le `h1Complet`), ce que le guide §5 interdit. « Dix minutes » et « nous venons chez vous » sont absents du PM. |
| 8 | Éthique | **3/5** | Le texte n'a ni fausse urgence ni faux avis, et n'affiche aucun prix ni aucun délai en heures. Mais il promet « rien ne part sans votre accord » alors que l'assistant écrit lui-même au client pour lui demander adresse et photo (B1). Un CTA, « Voir ce que vous payez », ouvre une section sans montant. |

**Total : 27/40.** 2 bloquants, 9 majeurs, 12 mineurs.

**Contrôles demandés :**
- **Promesse non prouvée** : 2 bloquants (B1, B2), plus M7 et M8.
- **Prix** : aucun montant, aucun « dès », aucune mention « TVA comprise ». Conforme.
- **Délai en heures** : aucun. Conforme (« jour ouvrable », « lundi », « dix minutes » ne sont pas des délais en heures ; « dix minutes » pose un autre problème, voir M4).
- **Ton d'« IA générique »** : absent du corps du texte, qui reste concret et patronal. Le seul écart est le triplet « répond / relance / prépare vos devis » en tête (M2, M3).

---

## 2. Problèmes

### BLOQUANTS

**B1. Le contrôle promis est absolu, mais l'assistant écrit seul au client**
- **Où** : `accueil.md` §B (temps 2) et §F 01, `services.md` §3, `chatbot.md` (étape 3), à mettre en regard de §J Q5 et de `services.md` §5.
- **Texte concerné** : d'un côté, « Pendant le chantier, l'assistant demande l'adresse, une photo et l'urgence. » De l'autre, « Aucune réponse, aucune relance, aucun devis ne part sans votre accord. » et « Rien ne part sans votre accord : réponse, relance, devis. »
- **Pourquoi** : c'est le levier du contrôle, pilier 3. Le patron qui découvre, pendant l'essai, qu'un message est parti sans lui y verra une promesse trahie (dissonance, perte de confiance). La LCD art. 3 vise les indications inexactes. Le PM §5 contient lui-même cette tension : « il demande l'adresse » d'un côté, « le patron valide avant que ça parte » de l'autre.
- **Réécriture** (pour le copy, une fois le mécanisme confirmé par Ayoub) :
  - Q5, APRÈS : « Vous avez raison de garder la main. Les questions qu'il pose à vos clients (adresse, photo, urgence), vous les validez une fois, au départ. Ensuite, aucune réponse, aucune relance, aucun devis ne part sans votre accord. Vous corrigez chaque brouillon avant l'envoi. » (45 mots)
  - `services.md` §5, puce 1, APRÈS : « Ses questions à vos clients : vous les validez au départ. Le reste (réponse, relance, devis) ne part jamais sans votre accord. »
  - Si l'assistant ne doit envoyer aucune question automatique, corriger plutôt la scène. Temps 2, APRÈS : « Pendant le chantier, l'assistant prépare la réponse : *adresse, photo,* urgence. » Sanitaire : « …L'assistant prépare la réponse qui demande l'adresse, une photo et l'urgence. Vous la validez d'un geste. »
- **Décision requise** : avant publication, Ayoub confirme lequel des deux mécanismes est le vrai. C'est le point ouvert n°1.

**B2. Un levier d'autorité sans preuve**
- **Où** : `studio.md` §2, paragraphe 2.
- **Texte concerné** : « Il travaille avec nous sur chaque démo. » / « He works with us on every demo. »
- **Pourquoi** : c'est un levier d'autorité (l'expert IA présent sur chaque démo) qui dépend d'un contrat non signé (PM §10 n°5 ; `_sans-preuve.md` S7). Le copy l'a gardé dans l'APRÈS avec une simple réserve, et aucun arbitrage ne le couvre. Un levier sans preuve est bloquant.
- **Réécriture** : APRÈS FR : « Un développeur spécialisé en IA construit l'assistant : les modèles de langage, la base de chaque métier. » (phrase finale supprimée). EN : « A developer who specialises in AI builds the assistant: the language models, the base for each trade. »

### MAJEURS

**M1. Le hero ne nomme ni la douleur ni l'IA**
- **Où** : `accueil.md` §A.3, sous-titre.
- **AVANT** : « Il connaît déjà les mots de votre métier. Vous le voyez sur vos vraies demandes avant de signer. »
- **Pourquoi** : le job à accomplir, « vos soirées », est le premier levier retenu (PM §8). Il n'apparaît nulle part dans le temps 1. Sans « IA », « assistant » reste ambigu en cinq secondes. Le guide §4 prescrit lui-même « Il répond… C'est une IA réglée sur votre métier » : l'IA vient après le résultat, et ici elle ne vient jamais.
- **APRÈS FR** : « **Il reprend le bureau du soir. C'est une IA réglée sur votre métier. Vous l'essayez avant de signer.** » (98 signes, sous le budget de 104)
- **APRÈS EN** : « **It takes the evening paperwork off you. An AI set to your trade. You try it before you sign.** » (91 signes, sous le budget de 94)
- **Variante plus proche de la voix des patrons** (VP §2 : « On est essentiellement sur de la paperasse ») : « Il reprend la paperasse du soir. … »
- **Note** : le « déjà » sort du hero, mais il reste dans le `title` et dans `services.md` §4.

**M2. Le titre qui tourne reprend l'accroche générique du marché** (point arbitré : je soumets à boss-decision, je n'impose rien)
- **Où** : `accueil.md` §A.2 ; arbitrage n°1.
- **AVANT** : « L'assistant qui / connaît votre métier. · répond aux demandes. · relance vos clients. · prépare vos devis. » Le `h1Complet` donne : « …répond aux demandes, relance vos clients et prépare vos devis. »
- **Pourquoi** : trois des quatre fins reprennent le triplet de Sparkana, dont « répond, relance, prépare vos devis » apparaissent dans cet ordre dans le `h1Complet` (guide §5). Le PM §4 le dit : « Ce qu'on ne fait pas : se battre sur le générique “répond, relance, devis”. » Le contrôle, notre pilier, n'est pas dans le titre. « Relance vos clients » sonne commercial pour un artisan ; les patrons parlent de devis (VP §2, douleur n°1).
- **APRÈS FR** (toutes les fins font au plus 21 signes) : « L'assistant qui » (15) / « connaît votre métier. » (21) / « répond aux demandes. » (20) / « prépare vos devis. » (18) / « attend votre accord. » (20). `h1Complet` : « L'assistant qui connaît votre métier, répond aux demandes, prépare vos devis et attend votre accord. »
- **APRÈS EN** : « The assistant that » / « knows your trade. » / « answers enquiries. » / « drafts your quotes. » / « waits for your OK. » (17)
- **Pourquoi c'est mieux** : la phrase va de la base métier au contrôle en passant par deux gestes, et le triplet générique disparaît. La relance reste dans la bande défilante et en §F.

**M3. La description de l'accueil enfreint le guide §5**
- **Où** : `meta.md` §1, `description`.
- **AVANT** : « Il répond à vos demandes, relance vos clients et prépare vos devis. Vous validez. Une IA réglée sur votre métier, à Genève. Démo sur vos demandes. »
- **Pourquoi** : c'est la phrase qu'on lit sur Google, à côté des concurrents. Elle aligne les cinq mots de Sparkana dans l'ordre et n'ouvre pas sur notre différence (la base métier).
- **APRÈS FR** : « **Il connaît déjà votre métier, prend vos demandes pendant le chantier et prépare vos devis. Vous validez. Une IA à Genève, démo sur vos demandes.** » (≈ 144 signes)
- **APRÈS EN** : « **It already knows your trade, takes your enquiries while you are on site and drafts your quotes. You approve. An AI in Geneva, a demo on your enquiries.** »

**M4. « Dix minutes » est une durée absente du PM**
- **Où** : `accueil.md` §G (`etape01Texte`) et §J Q4, `studio.md` §3, `contact.md` §2 (téléphone).
- **Texte concerné** : « Dix minutes au téléphone. » / « Le premier appel dure dix minutes. »
- **Pourquoi** : c'est un engagement chiffré qui vient de `founder/marketing.md`, pas du PM. Or le PM pose qu'un délai absent de ce fichier ne s'écrit nulle part, et le point ouvert n°17 n'est pas arbitré. Si l'appel dure 25 minutes, la promesse se retourne contre nous.
- **APRÈS FR** : « **Un appel court. Vous nous dites ce qui vous prend vos soirées. Nous ne vous vendons rien ce jour-là.** » ; Q4 : « Le premier appel est court. » ; contact : « Si c'est plus simple à dire qu'à écrire. Le premier appel est court. »
- **APRÈS EN** : « A short call. » / « The first call is short. »
- **Autre option** : Ayoub inscrit « dix minutes » au PM §5, et le texte reste tel quel.

**M5. La FAQ omet les deux objections les plus fréquentes et place le prix trop tôt**
- **Où** : `accueil.md` §J (questions et « ordre recommandé »).
- **Pourquoi** : « Je n'ai pas de problème, mon travail vient du bouche-à-oreille » pèse 52/100 au panel, et « J'ai déjà WhatsApp et mon logiciel » 17/100 (`founder/marketing.md` §2). Ni l'une ni l'autre n'est traitée. Q3 (« Ça marchera vraiment chez moi ? ») répète la réponse de Q6 (la démo). Dans l'ordre proposé, le prix (Q1) arrive en 2ᵉ position, alors qu'une objection de prix se traite en dernier.
- **Réécriture** : fusionner Q3 dans Q6 et ajouter deux questions. Le nombre de questions passe de 6 à 7 (structure à prévoir à l'étape 5).
  - **Nouvelle Qa, « Mon travail vient du bouche-à-oreille. Pourquoi un assistant ? »** : « Il ne vous amène pas de clients. Il reprend le bureau : les demandes reçues pendant le chantier, les devis à préparer, les relances. Si vous ne faites pas de bureau le soir, vous n'en avez pas besoin. Nous vous le dirons dès le premier appel. » (49 mots ; franchise et qualification, PM §2)
  - **Nouvelle Qb, « J'ai déjà WhatsApp et un logiciel de devis. »** : « Pour la démo, vous ne changez rien : vous nous montrez des demandes reçues par WhatsApp, par e-mail ou au téléphone. Ce que l'assistant peut lire dans vos outils se vérifie outil par outil, avec vous. Nous ne vous promettons pas un branchement avant de l'avoir testé. » (49 mots ; respecte S3, ne promet rien)
  - **Q6 fusionnée, « Vous avez des références ? »** : « Pas encore pour l'assistant, et nous préférons le dire. Vous seriez parmi les premiers. C'est pour cela que la démo se fait sur trois de vos vraies demandes : vous jugez sur les vôtres, pas sur un exemple ni sur notre parole. » (43 mots)
  - **Ordre** : Qa (bouche-à-oreille), Q5 (IA qui écrit), Q2 (données), Qb (outils), Q6 (références), Q4 (temps), Q1 (abonnement).

**M6. La réponse sur les données ne dit que ce que l'assistant ne voit pas**
- **Où** : `accueil.md` §J Q2.
- **AVANT** : « …Pendant l'essai, l'assistant n'a pas accès à vos paiements. Rien ne part sans votre accord. »
- **Pourquoi** : le patron demande où vont ses données ; la réponse ne parle que de ce qui est exclu. Le patron prudent y lit une esquive (biais de suspicion devant l'omission).
- **APRÈS FR** : « **Pour la démo, nous n'avons accès à aucun de vos outils : vous nous montrez trois demandes, noms masqués si vous le voulez. Pendant l'essai, l'assistant travaille sur vos demandes, et sur rien d'autre que vous ne lui confiez. Il n'a pas accès à vos paiements.** » (46 mots)
- **APRÈS EN** : « For the demo, we have no access to any of your tools: you show us three enquiries, names hidden if you like. During the trial, the assistant works on your enquiries and on nothing you have not given it. It has no access to your payments. »
- **Reste à trancher** : une phrase sur l'hébergement, après décision PM §10 n°3 (point ouvert n°3).

**M7. « Une base par métier » pour cinq métiers, alors que le premier n'est pas prêt** (arbitrage n°2 respecté : on montre les métiers, on change le cadre)
- **Où** : `accueil.md` §F (en-tête), `services.md` §4 (h2 et chapô).
- **AVANT** : « Une base par métier, / réglée sur la vôtre. » ; « Il connaît déjà / votre métier. »
- **Pourquoi** : présentés à égalité, les fiduciaires, les régies et les agences laissent croire qu'une base existe pour chacun d'eux (PM §5 bis : « plus tard »). C'est un levier d'autorité sans preuve. Le site a déjà la phrase juste : `studio.md` §4 (« Nous commençons donc par ce métier… un à la fois »).
- **APRÈS FR** : titre « **Une base par métier, / le sanitaire d'abord.** » Sous les quatre lignes, une ligne : « **Nous commençons par le sanitaire et le chauffage. L'électricité suit, puis les autres métiers, un à la fois.** »
- **APRÈS EN** : « **One base per trade, / plumbing first.** » + « We start with plumbing and heating. Electrical work follows, then other trades, one at a time. »
- **Dans `services.md` §4**, garder le h2 et ajouter la même phrase au chapô.

**M8. Une affirmation sur les patrons genevois sans source**
- **Où** : `studio.md` §4, paragraphe 2.
- **AVANT** : « Dans ces entreprises, le patron fait souvent lui-même le bureau, le soir. Les demandes arrivent pendant le chantier. Les devis partent, puis attendent. »
- **Pourquoi** : la phrase vient juste après deux chiffres genevois sourcés et leur emprunte leur crédit. Or aucun patron romand n'a été entendu (PM §2, §9), et les voix de la recherche sont américaines et françaises (VP).
- **APRÈS FR** : « **Dans les métiers du bâtiment, les devis se font souvent le soir. En France, 42 % des patrons jugent leur charge administrative stressante (CAPEB 2023). À Genève, nous le vérifions patron par patron.** »
- **APRÈS EN** : « In the building trades, quotes are often done in the evening. In France, 42% of owners find their admin load stressful (CAPEB 2023). In Geneva, we are checking it owner by owner. »

**M9. Un CTA annonce un prix que la section ne donne pas**
- **Où** : `accueil.md` §G, `cta`.
- **AVANT** : « Voir ce que vous payez » / « See what you pay »
- **Pourquoi** : la section visée répond « Rien / Rien / Prix fixe, annoncé après la démo ». Le visiteur qui attendait un montant se sent piégé (attente déçue, ambiguïté sur le prix).
- **APRÈS FR** : « **Voir quand vous payez** » · **EN** : « **See when you pay** » (reprend l'en-tête du §I, « Ce que vous payez, et quand »).

### MINEURS

| # | Fichier:section | Texte | Pourquoi | Proposition |
|---|---|---|---|---|
| m1 | `accueil.md` §A.1 | Studio genevois · Assistants pour PME · Pour les patrons de PME | « PME » deux fois | Prendre le repli « Studio genevois · Assistants pour PME » |
| m2 | `meta.md` §1, `title` | L'assistant qui connaît déjà votre métier — PME à Genève | Ne suit pas l'arbitrage n°1, qui veut « IA » dans le title | « L'assistant IA qui connaît votre métier — PME à Genève » (54) |
| m3 | `accueil.md` §H | 0 / Accès à vos paiements | Un « 0 » isolé se lit comme un compteur | « Aucun / Accès à vos paiements » (comme sur `/devis`) |
| m4 | `accueil.md` §I, note | Un seul assistant, un seul geste pour commencer. | « Geste » est un mot interne | « Une seule tâche pour commencer : celle qui vous prend le plus de soirées. » |
| m5 | `_chrome.md` §5 | Nous vous montrons *ce qu'il en fait.* ; slogan « L'essentiel. Bien conçu. » | « il » sans antécédent ; deux slogans dans la même bande, dont un de l'ancien métier | « Nous vous montrons *ce que l'assistant en fait.* » ; retirer l'ancien slogan, à décider avec la marque |
| m6 | `_chrome.md` §6, `bulle` | Votre métier, vos soirées. | Formule elliptique | « Ce qui vous prend vos soirées ? Réponse le jour ouvrable suivant. » |
| m7 | `chatbot.md`, étape 5 | « pour que nous le rappelions » | Un rappel téléphonique engage plus que « Réponse le jour ouvrable suivant » (point ouvert n°16) | « pour que nous lui répondions le jour ouvrable suivant et fixions la démo » |
| m8 | `demonstrations.md` ; `meta.md` §2 | page et métadonnées `/demonstrations` | Rendues caduques par l'arbitrage n°4 (redirection, aucun relevé publié) | Marquer « sans objet » et retirer la ligne de `meta.md` |
| m9 | `studio.md` §2, paragraphe 3 | Nous venons chez vous | Engagement absent du PM | « Pas de bureau, et c'est assumé. Le premier appel se fait au téléphone. C'est chez vous que sont les demandes. » |
| m10 | `accueil.md` §F 02 | Le même travail que pour le sanitaire. | La ligne ouvre sur un renvoi, pas sur la valeur | « Il prend la demande pendant le chantier, prépare le devis et le relance s'il reste sans réponse. » |
| m11 | `accueil.md` §H, paragraphe 3 | Ayoub Bensalem vend et suit chaque client. | « Vend » éveille la méfiance d'un patron | « Ayoub Bensalem fait le premier appel et suit chaque client. » |
| m12 | `services.md` §1 ; `devis.md` §1 | « répondre aux demandes, relancer, préparer les devis » ; « Gratuit » en FR, absent en EN | Triplet générique ; les deux langues ne disent pas la même chose | « préparer les devis, relancer, répondre aux demandes » ; ajouter « Free, » en EN ou retirer « Gratuit » en FR |

---

## 3. Mise en valeur

| Page / section | À garder tel quel | À corriger en premier |
|---|---|---|
| Accueil, hero | Temps 3 : « **3** / vraies demandes ». C'est la preuve la plus forte du site, et le visiteur peut la vérifier lui-même. | Le sous-titre, qui ne dit ni la douleur ni l'IA (M1) |
| Accueil (01) Par métier | La ligne sanitaire : une scène, les gestes du métier, le bon de régie | Le cadre « une base par métier » (M7) |
| Accueil (02) Comment | « Nous ne vous vendons rien ce jour-là. » (pied dans la porte, franc) | « Dix minutes » (M4) et le CTA (M9) |
| Accueil (03) Contrôle | « Nous n'avons pas encore de client pour l'assistant : vous seriez parmi les premiers. » (franchise, meilleure défense contre l'objection des références) | La portée de « Rien ne part sans vous » (B1) |
| Accueil (04) Offre | Le titre « La mise en place, / payée après l'essai. » (aversion au regret, écrite) | La note « un seul geste » (m4) |
| Accueil (05) FAQ | Q5, « Une IA qui écrit à mes clients… » : « Vous avez raison de garder la main. » | Les objections manquantes et l'ordre (M5) |
| Chrome, pied de page | « Montrez-nous trois demandes. » | « ce qu'il en fait » (m5) |
| `/services` | §5, « Ce que nous ne promettons pas » : en disant ce qu'on ne promet pas, on rend crédible ce qu'on promet | La puce de contrôle (B1) |
| `/studio` | « 0 client / Vous seriez parmi les premiers » | « sur chaque démo » (B2), puis le paragraphe genevois (M8) |
| `/devis` | Le h1 « Montrez-nous / trois demandes. » et les faits « Rien / Aucun » | — |
| Prompt de Leo | Les règles PRIX, DONNÉES, OUTILS et RÉFÉRENCES, chacune avec sa phrase de repli | « rappelions » (m7) |
| 404 | « Depuis octobre 2026, Nawa Corps ne fait plus de sites » | — |

**Comparaison avec les meilleures agences (AG)** : le texte reprend ce qui fonctionne chez elles. Il dit le contrôle (Sparkana, Loaded), la démo sur données réelles (Sparkana), le rapport hebdomadaire (Annei) et ce qu'il ne promet pas (Loaded). Il évite ce qui échoue : chiffres invérifiables, « remplacez un poste », jargon. L'écart qui reste est la phrase d'accroche. Les meilleures nomment une heure ou une scène précise (Evolv, « 9:14 pm »). La nôtre ouvre sur le triplet générique (M2), et la scène la plus forte, la demande pendant le chantier, n'arrive qu'au temps 2. Le relevé du lundi ressemble au « brief du lundi 7 h » d'Annei : aucun texte ne le présente comme une exclusivité, ce qui est juste.

**Les mots des patrons (VP)** : « le soir », « devis », « téléphone », « chantier » et « conjoint » sont bien repris. « Paperasse », le mot exact des plombiers français (VP §2, n° 2 et 7), n'apparaît nulle part : c'est la variante proposée en M1.

---

## 4. Note pour boss-decision (voix et arbitrages, je ne les change pas)

1. **CTA principal du guide §6, « Voir l'assistant sur mes demandes »** : le clic mène à un formulaire, pas à une démonstration. Le pied de page (« Montrez-nous trois demandes. ») fait le pont, mais « voir » laisse attendre quelque chose d'immédiat. Je ne propose pas de changement, puisque la voix est fixée. À surveiller lors du contrôle dans le navigateur.
2. **Le guide et le PM se contredisent** : PM §3 (la phrase) et guide §1 utilisent « répond, relance, prépare », alors que PM §4 et guide §5 demandent de ne pas se battre sur ce terrain. M2 et M3 tranchent dans le sens du §4.
3. **L'arbitrage n°1 (les quatre fins)** est à réexaminer à la lumière de M2.

---

## 5. Verdict

**À CORRIGER.**

À **copy-positionnement** :
1. B2, retirer « sur chaque démo ».
2. M1, sous-titre du hero.
3. M3, description de l'accueil.
4. M4, « dix minutes », ou son inscription au PM par Ayoub.
5. M5, FAQ : deux questions ajoutées, Q3 fusionnée dans Q6, nouvel ordre.
6. M6, réponse sur les données.
7. M7, cadre « le sanitaire d'abord ».
8. M8, paragraphe genevois.
9. M9, CTA de la méthode.
10. Les mineurs m1 à m12.

À **boss-decision** (décision préalable) :
- B1, mécanisme des questions automatiques (puis réécriture par le copy) ;
- M2, quatre fins du titre (arbitrage n°1).
