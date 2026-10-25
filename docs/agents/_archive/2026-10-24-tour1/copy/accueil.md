# Accueil `/` et `/en` — réécriture complète (24.10.2026)

> Mode `propose`. Aucun fichier du site modifié. Version précédente archivée :
> `docs/agents/_archive/2026-10-24/copy/accueil.md`.
> Guide : `docs/agents/brand/voice-guide.md` (24.10.2026). PM =
> `.agents/product-marketing.md`. Toutes les chaînes vivent dans
> `lib/dictionnaires/fr.ts` (FR) et `en.ts` (EN), sauf mention contraire.
> **Mot-clé cible** : *assistant IA PME Genève*. Il est dans le `title`
> (« L'assistant… PME à Genève »), la meta description (« IA », « Genève ») et
> le `h1` (« L'assistant »). Métadonnées : `meta.md`.

## 0. L'architecture proposée

Le design ne bouge pas (plan, décision 1). **L'ordre des composants ne bouge
pas non plus** : seul le rôle de chaque section change. Aucun montant nulle part.

| # | Composant | Ancre (inchangée) | Ancien rôle | Nouveau rôle |
|---|---|---|---|---|
| — | `NoyauHero` T1 | `#top` | site pour artisans | **La promesse** : h1 qui tourne sur trois verbes, CTA démo |
| — | `NoyauHero` T2 | — | la demande arrive complète | **Une scène** : la demande pendant le chantier |
| — | `NoyauHero` T3 | — | « Tout de bout en bout » | **La démo** : « 3 vraies demandes » + 5 faits |
| — | `NoyauHero` T4 | — | plus aucune demande perdue | **Le slogan** : vous validez, il s'occupe du reste |
| — | `Strip` | — | les 4 pièces du site | **Les gestes et le contrôle** |
| 01 | `ServicesRows` | `#services` | les 4 pièces du site | **Ce qu'il fait, métier par métier** (sanitaire en premier) |
| 02 | `Methode` | `#methode` | du feu vert à la mise en ligne | **Comment ça se passe** : appel, démo, essai, abonnement |
| 03 | `Studio` | `#studio` | qui fait le site | **Le contrôle, le relevé, qui nous sommes** |
| 04 | `Offres` | `#offres` | 3 formules chiffrées | **Ce que vous payez, et quand** : 3 cartes, aucun montant |
| 05 | `Faq` | `#faq` | 5 questions site | **6 objections du panel**, réponses de 60 mots au plus |
| 06 | `FooterContact` | `#contact` | montrez-nous ce que vous avez | **Montrez-nous trois demandes** |

**Changement de structure requis (hors copy, à l'étape 5)** : `Offres` ne doit
plus lire la table `Service` ni afficher prix, « dès », « /mois » ou « TVA
comprise » ; ses 3 cartes deviennent statiques (PM §5, « La table Service n'est
pas modifiée »). Le badge « Recommandé » disparaît (`anti-vibecode` n°33).
`Faq` ne recolle plus de montants (`tarifs*`). La description de l'accueil
(`app/(site)/page.tsx:39-53`) ne lit plus `prixEntreeCents`.

---

## A. Hero — temps 1, la promesse

### A.1 Kicker (`fr.ts:250-252`, `en.ts:151-154` ; `kickerMetier` est aussi le texte du loader)

- AVANT : Studio de création digitale · Genève, Suisse · Pour les artisans du bâtiment
- APRÈS FR : **Studio genevois · Assistants pour PME · Pour les patrons de PME**
  *(repli si la ligne serre : « Studio genevois · Assistants pour PME »)*
- APRÈS EN : **Geneva studio · Assistants for small businesses · For small business owners**
- POURQUOI : l'ancien métier (création digitale, sites) n'est plus vendu (PM §5,
  « Ce qui sort de l'offre »). « Genevois » remplace « Genève, Suisse » sans
  doublon. Pas de « IA » dans la première ligne lue (guide §4).
- PREUVE : PM §1 « Studio genevois, sans bureau » ; §2 avatar.

### A.2 Le titre qui tourne (`fr.ts:258-260`, `en.ts:155-157`)

Contrainte : chaque ligne ≤ 21 caractères (CLAUDE.md). Une ligne fixe, puis des
fins qui tournent (`HeroRotation`). **La première fin est celle que voient le
rendu serveur, les robots et `prefers-reduced-motion`** : c'est elle qui porte
la promesse.

- AVANT :
  ```
  Un site qui                     (11)
  vend. / qualifie vos demandes. / vous fait gagner du temps.   (5 / 22 / 26)
  ```
- APRÈS FR — **recommandé** (une promesse, puis trois verbes du métier) :
  ```
  h1Debut     L'assistant qui              (15)
  h1Rotation  connaît votre métier.        (21)
              répond aux demandes.         (20)
              relance vos clients.         (20)
              prépare vos devis.           (18)
  h1Complet   L'assistant qui connaît votre métier, répond aux demandes, relance vos clients et prépare vos devis.
  ```
- APRÈS EN :
  ```
  h1Debut     The assistant that           (18)
  h1Rotation  knows your trade.            (17)
              answers enquiries.           (18)
              follows up clients.          (19)
              drafts your quotes.          (19)
  h1Complet   The assistant that knows your trade, answers enquiries, follows up clients and drafts your quotes.
  ```
- VARIANTE « trois verbes seuls » (si Ayoub veut exactement 3 fins) : retirer
  « connaît votre métier. » de la rotation ; le sous-titre A.3 porte alors
  seul la base métier.
- POURQUOI : le titre du site est décidé, « L'assistant qui connaît déjà votre
  métier » (PM §3). Il ne tient pas en 21 caractères avec « déjà » ; « déjà »
  passe dans le sous-titre, collé dessous. Les trois verbes sont les trois
  gestes de la base (PM §5, « Ce que l'assistant fait »). Pattern 2 de la
  veille : les verbes du métier, pas la techno. Aucune fin n'excède 21 : plus
  de dépassement assumé comme avec « vous fait gagner du temps. » (26).
  Aucun mot de Sparkana dans l'ordre de son accroche (guide §5).
- PREUVE : PM §3 « La phrase » ; §5 « Répondre / Relancer / Préparer ».

### A.3 Sous-titre (`fr.ts:261-262`, `en.ts:158-159` ; budget 2 lignes : FR ≤ 104, EN ≤ 94 signes)

- AVANT : Pour les artisans genevois : des demandes précises, moins de téléphone, et votre site vu avant de payer.
- APRÈS FR : **Il connaît déjà les mots de votre métier. Vous le voyez sur vos vraies demandes avant de signer.** (96 signes)
- APRÈS EN : **It already speaks your trade's language. You see it on your real enquiries before you sign.** (91 signes)
- POURQUOI : piliers 1 et 2 dans la même unité de lecture que le h1. Deux
  phrases, une idée chacune. Le « déjà » perdu par le h1 revient ici.
- PREUVE : PM §1 « base d'assistant par métier (le vocabulaire…) » ; engagement 1
  « Vous le voyez travailler avant de signer ».

### A.4 Boutons (`fr.ts:267-269`, `en.ts:164-166`)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `ctaPrincipal` (→ `#contact`) | Recevoir mon aperçu | **Voir l'assistant sur mes demandes ** | **See it on my enquiries ** |
| `ctaSecondaire` (→ `#offres`) | Voir l'offre | **Voir le parcours** | **See how it works** |
| `defiler` | Défiler | *inchangé* | *inchangé* |

- POURQUOI : verbe + bénéfice ; le bénéfice est la preuve sur **ses** demandes
  (effet de possession, `founder/marketing.md` §3). L'espace final reste
  (flèche `.ar`). `#offres` porte désormais le parcours payé (§F).
- PREUVE : PM §3 pilier 2 ; brand §5.1 « Un seul appel à l'action ».
- NOTE : 33 signes sur un bouton. Repli : **« Le voir sur mes demandes »** (24).

## B. Hero — temps 2, la scène (`fr.ts:272-275`, `en.ts:168-171`, budget ≤ 83, cible 75)

- AVANT : (001) Le noyau · « La demande arrive complète, avec photos. Vous chiffrez, *le devis se relance*. »
- APRÈS FR : **(001) Une demande arrive** · « Pendant le chantier, l'assistant demande l'adresse, *une photo* et l'urgence. » (75 signes)
  - `phraseDebut` : `Pendant le chantier, l'assistant demande l'adresse, ` · `phraseItalique` : `une photo` · `phraseFin` : ` et l'urgence.`
- APRÈS EN : **(001) An enquiry comes in** · « While you are on site, the assistant asks for the address, *a photo* and how urgent it is. » (≈ 82 signes : au-dessus des 70 visés en EN, **à mesurer** ; repli : « On site? The assistant asks for the address, *a photo*, the urgency. » ≈ 66)
- POURQUOI : la scène la plus documentée de la recherche (le téléphone pendant
  le chantier) ; nomme l'assistant, donc aucun « il » sans antécédent.
- PREUVE : PM §5 « Répondre aux demandes : il demande l'adresse, une photo,
  l'urgence » ; §5 bis, sanitaire par défaut.

## C. Hero — temps 3, la démo (`fr.ts:287-300`, `en.ts:181-195`)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `temps3Section` | Le cœur | **La démo** | **The demo** |
| `grandMot` (≤ 4 glyphes FR, 3 EN) | Tout | **3** | **3** |
| `grandMotUnite` (≤ 15 FR, 20 EN) | de bout en bout | **vraies demandes** (15) | **real enquiries** (15) |
| `specAtelier` / valeur | Atelier / Genève | **Studio / Genève** | **Studio / Geneva** |
| `specSite` / valeur | Le site / En ligne en une semaine | **Vos outils / Aucun accès pour la démo** | **Your tools / No access for the demo** |
| `specReste` / valeur | Vos devis / Relancés pour vous | **L'envoi / Rien sans votre accord** | **Sending / Nothing without your OK** |
| `specTextes` / valeur | Vos textes / Repris de votre site | **Le relevé / Chaque lundi** | **The report / Every Monday** |
| `specSuivi` / valeur | Suivi / Sans engagement | **La mise en place / Payée après l'essai** | **The set-up / Paid after the trial** |

- POURQUOI : le plus grand chiffre du site devient un fait sourcé et vérifiable
  par le visiteur lui-même : sa démo porte sur trois de ses demandes. Les cinq
  lignes résument les engagements du produit, sans montant ni durée. « Sans
  engagement » sort : la résiliation n'est pas décidée (PM §10 n°6).
- PREUVE : PM §5 parcours (« trois vraies demandes », « aucun accès à ses
  outils ») ; §1 engagements 2, 3, 4 ; garantie §5.

## D. Hero — temps 4, la sortie (`fr.ts:306-309`, `en.ts:197-200`)

- AVANT : Plus aucune demande perdue pendant vos chantiers. · [Recevoir mon aperçu →] [Voir l'offre]
- APRÈS FR : **Vous validez. Il s'occupe du reste.** · [**Le voir sur mes demandes →**] [**Voir le parcours**]
- APRÈS EN : **You approve. It handles the rest.** · [**See it on my enquiries →**] [**See how it works**]
- POURQUOI : slogan recommandé (brand §2). « Plus aucune demande perdue » est un
  résultat qu'on ne mesure pas encore (brand §2, slogan 2 écarté pour ce motif)
  et vise la vieille douleur « je rate des clients » (PM §2).
- PREUVE : brand §2 ; PM §8 « Slogan recommandé ».

## E. Bande défilante (`fr.ts:339-344`, `en.ts:221-226`, `aria-hidden`)

| Clé (nom conservé) | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `refonte` | Site pour artisans | **Répond aux demandes** | **Answers enquiries** |
| `devis` | Demandes avec photos | **Relance vos clients** | **Follows up clients** |
| `rendezVous` | Devis relancés | **Prépare vos devis** | **Drafts your quotes** |
| `reseauxSociaux` | Réponse automatique | **Rien ne part sans vous** | **Nothing goes out without you** |
| `delai` | Une semaine dès votre feu vert | **Un relevé chaque lundi** | **A report every Monday** |
| `lieu` | Genève | *inchangé* | *inchangé* |

- POURQUOI : trois gestes, puis les deux engagements de contrôle. « Réponse
  automatique » contredit « vous validez ». Plus aucun délai : celui de la démo
  n'est pas fixé (PM §3).
- PREUVE : PM §5 ; §1 engagements 2 et 3.

## F. (01) Ce qu'il fait, métier par métier (`fr.ts:365-389`, `en.ts:238-259`)

**En-tête**

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `section` | Services | **Par métier** | **By trade** |
| `titreLigne1` / `2` | Cinq gestes, / le même endroit. *(quatre lignes affichées : doublon faux)* | **Une base par métier, / réglée sur la vôtre.** | **One base per trade, / set to your business.** |

- PREUVE : PM §1 « une base d'assistant par métier, puis nous l'adaptons à
  chaque entreprise ».

**Les quatre lignes** (≤ 60 mots chacune ; le renvoi suit le chemin codé en dur
dans `ServicesRows.tsx:143-146`)

**01 · `titre01` / `corps01` / `lien01` (→ `#offres`)**
- AVANT : Le site · « Votre site refait pour le téléphone… en ligne une semaine après votre feu vert. » · Voir l'offre et le prix →
- APRÈS FR : **Sanitaire et chauffage** · « Une demande arrive pendant que vous êtes sur le chantier. L'assistant demande l'adresse, une photo et l'urgence. Le soir, vous trouvez une liste triée. Vous validez les réponses avant qu'elles partent. Il sait déjà ce qu'est un bon de régie. » (47 mots) · **Voir le parcours →**
- APRÈS EN : **Plumbing and heating** · "An enquiry comes in while you are on site. The assistant asks for the address, a photo and the urgency. In the evening, you find a sorted list. You approve the replies before they go out. It already knows what an agency work order is." · **See how it works →**
- POURQUOI : premier métier (board, séance 9), en premier. Phrase d'appel
  transformée en scène, sans résultat chiffré.
- PREUVE : PM §5 bis, ligne sanitaire ; brand §3 « Avant / après ».

**02 · `titre02` / `corps02` / `lien02` (→ `/devis`)**
- AVANT : Les demandes, triées · « Le formulaire pose les questions que vous posez au téléphone… » · Recevoir mon aperçu →
- APRÈS FR : **Électricité** · « Le même travail que pour le sanitaire. Il prend la demande pendant le chantier. Il prépare le brouillon du devis. Il le relance s'il reste sans réponse. Vous relisez, vous corrigez, vous envoyez. Combien de soirées par semaine passez-vous sur vos devis ? » (45 mots) · **Le voir sur mes demandes →**
- APRÈS EN : **Electrical** · "The same work as for plumbing. It takes the enquiry while you are on site. It drafts the quote. It follows it up if it gets no answer. You read, you correct, you send. How many evenings a week do you spend on quotes?" · **See it on my enquiries →**
- PREUVE : PM §5 bis, ligne électricité, phrase d'appel mot pour mot.

**03 · `titre03` / `corps03` / `lien03` (→ `#offres`)**
- AVANT : Réponse et notification · « Votre client reçoit tout de suite une réponse… »
- APRÈS FR : **Fiduciaires** · « Il réclame les pièces à vos clients jusqu'à ce que le dossier soit complet. Il trie ce qui arrive. Chaque lundi, le relevé vous dit quels dossiers attendent encore. Combien d'heures par semaine passez-vous à courir après les pièces de vos clients ? » (44 mots) · **Voir le parcours →**
- APRÈS EN : **Fiduciaries** · "It chases your clients for their documents until the file is complete. It sorts what comes in. Every Monday, the report tells you which files are still waiting. How many hours a week do you spend chasing your clients' documents?" · **See how it works →**
- PREUVE : PM §5 bis, ligne fiduciaires ; relevé §1.
- RÉSERVE : secret de la clientèle « à vérifier » (PM §5 bis). Voir `_points-ouverts.md` n°4.

**04 · `titre04` / `corps04` / `lien04` (→ `#offres`)**
- AVANT : Vos devis relancés · « Beaucoup de devis restent sans réponse… »
- APRÈS FR : **Régies et agences** · « Pour une régie, il trie les demandes des locataires, demande les photos et prépare le bon d'intervention. Pour une agence, il relance les anciens contacts propriétaires. Il aide le gérant. Il ne le remplace pas. » (39 mots) · **Voir le parcours →**
- APRÈS EN : **Property managers and estate agents** · "For a property manager, it sorts tenants' requests, asks for photos and drafts the work order. For an estate agent, it follows up past owner contacts. It helps the manager. It does not replace them." · **See how it works →**
- POURQUOI : « jamais comme remplaçant » (PM §5 bis) ; « Beaucoup de devis restent
  sans réponse » était une affirmation de marché sans source.
- PREUVE : PM §5 bis, lignes régies et agences immobilières.
- NOTE STRUCTURE : faire pointer les quatre renvois vers `/devis` (un seul geste).

## G. (02) Comment ça se passe (`fr.ts:399-420`, `en.ts:271-293`)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `section` | Méthode | **Comment ça se passe** | **How it works** |
| `titreLigne1` / `2` | Du feu vert à la mise / en ligne : une semaine. | **Vos demandes d'abord, / votre signature après.** | **Your enquiries first, / your signature after.** |
| `etape01Moment` / `Titre` | En amont / Le premier appel | **Au départ / L'appel** | **First / The call** |
| `etape01Texte` | Un quart d'heure au téléphone : votre métier, les communes… | **Dix minutes au téléphone. Vous nous dites ce qui vous prend vos soirées. Nous ne vous vendons rien ce jour-là.** | **Ten minutes on the phone. You tell us what takes up your evenings. We sell you nothing that day.** |
| `etape02Moment` / `Titre` | Avant de payer / L'aperçu | **Sans rien payer / La démo** | **Free of charge / The demo** |
| `etape02Texte` | Vous voyez votre nouveau site… deux allers-retours sont compris. | **Vous nous montrez trois demandes de votre semaine. Nous vous montrons ce que l'assistant en aurait fait. Nous n'avons accès à aucun de vos outils.** | **You show us three enquiries from your week. We show you what the assistant would have done with them. We have no access to any of your tools.** |
| `etape03Moment` / `Titre` | Fin de semaine / La mise en ligne | **Sans rien payer / L'essai** | **Free of charge / The trial** |
| `etape03Texte` | Domaine, hébergement, formulaire… | **L'assistant travaille sur vos vraies demandes. Vous validez tout ce qui part. Chaque lundi, vous recevez le relevé.** | **The assistant works on your real enquiries. You approve everything that goes out. Every Monday, you get the report.** |
| `etape04Moment` / `Titre` | Ensuite / Le suivi | **Si le relevé vous convient / L'abonnement** | **If the report suits you / The subscription** |
| `etape04Texte` | Les réponses, les notifications et les relances tournent… Sans engagement. | **Vous payez la mise en place, puis l'abonnement continue. Nous suivons l'assistant chaque semaine. Le prix est fixe, annoncé après la démo.** | **You pay for the set-up, then the subscription carries on. We look after the assistant every week. The price is fixed, given after the demo.** |
| `cta` (→ `#offres`) | Voir l'offre et le prix | **Voir ce que vous payez ** | **See what you pay ** |

- POURQUOI : le parcours en trois temps de PM §5, précédé de l'appel (pied
  dans la porte, `founder/marketing.md` §3). Aucun délai : celui de la démo et
  la durée de l'essai ne sont pas fixés (PM §10 n°6). Les moments ne sont pas
  des durées.
- PREUVE : PM §5 « Le parcours, en trois temps » ; brand §5.2 « Je ne vous
  vends rien aujourd'hui » ; « dix minutes » : `founder/marketing.md` §3.

## H. (03) Le contrôle, le relevé, qui nous sommes (`fr.ts:430-460`, `en.ts:300-321`)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `section` | Le studio | **Le contrôle** | **Control** |
| `titreCache` (sr-only) | Le studio | **Le contrôle et le studio** | **Control, and the studio** |
| `citationDebut` / `Italique` / `Fin` | « Vous parlez à ceux qui *font* le travail. » | **« Rien ne part *sans* vous. »** | **“Nothing goes out *without* you.”** |
| `faitLieuNote` | Basé ici | *inchangé* | *inchangé* |
| `faitDelai` / `Note` | Une semaine / Site en ligne | **Lundi / Le relevé** | **Monday / The report** |
| `faitLangues` / `Note` | FR / EN / Langues | **0 / Accès à vos paiements** | **0 / Access to your payments** |
| `lien` | Voir qui fait le travail → | *inchangé* | *inchangé* |

**`paragraphe1`**
- AVANT : Nawa Corps est le studio de création digitale fondé par Ayoub Bensalem… le site des artisans du bâtiment…
- APRÈS FR : **Chaque réponse, chaque relance et chaque devis passent par vous. L'assistant prépare, vous lisez, vous validez. Il n'a pas accès à vos paiements.**
- APRÈS EN : **Every reply, every follow-up and every quote goes through you. The assistant prepares, you read, you approve. It has no access to your payments.**
- PREUVE : PM §1 engagement 2 ; §5 « Pas d'accès aux paiements ».

**`paragraphe2`**
- AVANT : Ce que ça change se voit à l'usage… Deux allers-retours sont compris…
- APRÈS FR : **Chaque lundi, vous recevez un relevé court. Il dit ce qui a été traité, relancé et préparé, et ce qui vous attend. S'il ne s'est rien passé, le relevé le dit.**
- APRÈS EN : **Every Monday, you get a short report. It says what was handled, followed up and prepared, and what is waiting for you. If nothing happened, the report says so.**
- PREUVE : PM §1 engagement 3 ; brand §5.4.

**`paragraphe3`**
- AVANT : Votre site est dessiné et construit au même endroit…
- APRÈS FR : **Nawa Corps est un studio genevois, sans bureau. Ayoub Bensalem vend et suit chaque client. Un développeur spécialisé en IA construit l'assistant. Nous n'avons pas encore de client pour l'assistant : vous seriez parmi les premiers.**
- APRÈS EN : **Nawa Corps is a Geneva studio with no office. Ayoub Bensalem sells and looks after every client. A developer who specialises in AI builds the assistant. We have no client for the assistant yet: you would be among the first.**
- POURQUOI : franchise (pratfall) retenue au PM §8 ; c'est la meilleure défense
  contre « aucune référence ». Le développeur n'est pas nommé (PM §10 n°5).
- PREUVE : PM §1 « Qui le fait » ; §6 « 0 client… on le dit » ; §9.

## I. (04) Ce que vous payez, et quand (`fr.ts:476-520`, `en.ts:333-368` ; composant à rendre statique)

**En-tête**

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `section` | Offres | **L'offre** | **The offer** |
| `titreLigne1` / `2` | Des prix clairs, / tout compris. | **La mise en place, / payée après l'essai.** | **The set-up, / paid after the trial.** |
| `recommande` | Recommandé | **supprimé** (`anti-vibecode` n°33 : un seul parcours, pas de palier mis en avant) | **removed** |

**Les trois cartes** (nouvelles chaînes ; les clés `vitrine*`, `site*`, `assistant*` sont réutilisables ou à renommer à l'étape 5)

| Carte | Ligne de tête | Titre | Ce que vous payez | Texte (FR) | CTA |
|---|---|---|---|---|---|
| 1 | Sur trois de vos demandes | **La démo** | **Rien** | Nous prenons trois demandes de votre semaine. Nous vous montrons ce que l'assistant en aurait fait. Aucun accès à vos outils. | **Le voir sur mes demandes** (→ `/devis`) |
| 2 | Sur vos vraies demandes | **L'essai** | **Rien pendant l'essai** | L'assistant travaille sur vos demandes. Vous validez tout. Vous recevez le relevé chaque lundi. | — |
| 3 | Si le relevé vous convient | **L'abonnement** | **Prix fixe, annoncé après la démo** | Vous payez la mise en place, puis l'abonnement continue. Nous suivons l'assistant chaque semaine. | — |

| Carte | EN — head / title / you pay / text |
|---|---|
| 1 | On three of your enquiries / **The demo** / **Nothing** / We take three enquiries from your week. We show you what the assistant would have done with them. No access to your tools. · CTA **See it on my enquiries** |
| 2 | On your real enquiries / **The trial** / **Nothing during the trial** / The assistant works on your enquiries. You approve everything. You get the report every Monday. |
| 3 | If the report suits you / **The subscription** / **A fixed price, given after the demo** / You pay for the set-up, then the subscription carries on. We look after the assistant every week. |

**Note sous la grille** (`notePrix`, `noteCorrections`, `noteSuivi*`, `ctaDevis`)
- AVANT : « Prix en francs suisses, TVA comprise. Deux allers-retours de correction compris. » + « Suivi et hébergement dès [base] à partir de la 2ᵉ année, [base] obligatoire avec L'Assistant. »
- APRÈS FR : **« Un seul assistant, un seul geste pour commencer. Le prix est fixe et s'annonce après la démo. Réponse le jour ouvrable suivant. »**
- APRÈS EN : **"One assistant, one task to start with. The price is fixed and given after the demo. A reply the next working day."**
- POURQUOI : aucun montant n'existe (PM §5, « Aucun montant n'est affiché ») ;
  la seule formule de prix autorisée y est. L'aversion au regret est portée
  par le titre (garantie). « Moins de choix » : une offre, pas trois.
- PREUVE : PM §5 « Le prix », « La garantie », « un seul geste » ;
  `MENTION_REPONSE` (`lib/familles.ts:355`), au caractère près.
- QUAND LE PRIX SERA FIXÉ : montant sans « dès », suivi de « TVA comprise »
  dans la même unité de lecture (CLAUDE.md ; PM §5).

## J. (05) Questions (`fr.ts:565-601`, `en.ts:388-418` ; alimente aussi le JSON-LD `FAQPage`)

Six questions (une de plus qu'aujourd'hui : structure à étendre à l'étape 5).
Questions dites par le visiteur (« je »), réponses par le studio (« nous »).
Les clés `reponse3Avant/Apres` et `tarifs*` disparaissent : plus aucun montant
à recoller.

**Q1 — « encore un abonnement » (panel : 5/100)**
- AVANT : Une semaine, vraiment ? · « Oui, et c'est la même semaine… »
- APRÈS FR : **Encore un abonnement ?** · « Oui, l'assistant est un abonnement, parce que nous le suivons chaque semaine. Mais la démo ne coûte rien, l'essai non plus. La mise en place ne se paie qu'après l'essai, si le relevé vous convient. Le prix est fixe, annoncé après la démo. » (46 mots)
- APRÈS EN : **Another subscription?** · "Yes, the assistant is a subscription, because we look after it every week. But the demo costs nothing, and neither does the trial. The set-up is only paid after the trial, if the report suits you. The price is fixed, given after the demo."
- PREUVE : PM §5 parcours, garantie, prix ; `founder/marketing.md` §2.

**Q2 — les données (board)**
- AVANT : Je n'ai ni textes ni photos. C'est bloquant ?
- APRÈS FR : **Et mes données ?** · « Pour la démo, nous n'avons accès à aucun de vos outils. Vous nous montrez trois demandes, et vous pouvez masquer les noms. Pendant l'essai, l'assistant n'a pas accès à vos paiements. Rien ne part sans votre accord. » (42 mots)
- APRÈS EN : **What about my data?** · "For the demo, we have no access to any of your tools. You show us three enquiries, and you can hide the names. During the trial, the assistant has no access to your payments. Nothing goes out without your approval."
- PREUVE : PM §5 (démo sans accès, pas d'accès aux paiements, validation).
- **RETIRÉ** : « Vos données restent en Suisse » et « si vous arrêtez, vous gardez
  tout » (PM §10 n°3 et n°4). Phrase prête pour le jour où c'est confirmé :
  « Vos données restent en Suisse. Si vous arrêtez, vous gardez [à définir]. »
  Voir `_sans-preuve.md` S1, S2.

**Q3 — « ça marche chez moi ? »**
- AVANT : Qui gère l'hébergement et le nom de domaine ? · « Nous. Domaine et hébergement… [montants] »
- APRÈS FR : **Ça marchera vraiment chez moi ?** · « C'est à ça que sert la démo. Vous nous donnez trois vraies demandes de votre semaine. Nous vous montrons ce que l'assistant en aurait fait. Vous jugez sur vos demandes, pas sur un exemple. Vous n'avez rien à préparer. » (45 mots)
- APRÈS EN : **Will it really work for me?** · "That is what the demo is for. You give us three real enquiries from your week. We show you what the assistant would have done with them. You judge on your own enquiries, not on an example. You have nothing to prepare."
- PREUVE : PM §3 pilier 2 ; §5 conditions, « Préparation demandée : aucune ».

**Q4 — « je n'ai pas le temps »**
- AVANT : Et après, si j'ai besoin d'autre chose ? · « Deux allers-retours sont compris… »
- APRÈS FR : **Je n'ai pas le temps pour ça.** · « Le premier appel dure dix minutes. La démo part de demandes que vous avez déjà reçues. Pendant l'essai, votre part est de lire et de valider ce que l'assistant prépare. Il vous décharge du bureau, il ne vous en ajoute pas. » (45 mots)
- APRÈS EN : **I don't have time for this.** · "The first call takes ten minutes. The demo starts from enquiries you have already received. During the trial, your part is to read and approve what the assistant prepares. It takes office work off you; it does not add any."
- PREUVE : PM §5 conditions ; `founder/marketing.md` §3 (dix minutes) ; lexique « il vous décharge » (PM §8).

**Q5 — « une IA qui écrit à mes clients, non » (board)**
- AVANT : À ce prix-là, qu'est-ce qui n'est pas fait ?
- APRÈS FR : **Une IA qui écrit à mes clients, je n'en veux pas.** · « Vous avez raison de garder la main. L'assistant prépare des brouillons. Aucune réponse, aucune relance, aucun devis ne part sans votre accord. Vous pouvez corriger chaque brouillon avant l'envoi. » (33 mots)
- APRÈS EN : **I don't want an AI writing to my clients.** · "You are right to keep control. The assistant prepares drafts. No reply, no follow-up and no quote goes out without your approval. You can correct every draft before it is sent."
- PREUVE : PM §1 engagement 2 ; §5 « Préparer : un brouillon… à valider ».

**Q6 — « aucune référence » (panel : 23/100)**
- AVANT : *(n'existait pas)*
- APRÈS FR : **Vous avez des références ?** · « Pas encore pour l'assistant, et nous préférons le dire. Vous seriez parmi les premiers. C'est pour cela que la démo se fait sur vos propres demandes : vous n'avez pas à nous croire sur parole. » (37 mots)
- APRÈS EN : **Do you have references?** · "Not yet for the assistant, and we would rather say so. You would be among the first. That is why the demo runs on your own enquiries: you do not have to take our word for it."
- PREUVE : PM §6 « 0 client… Vous seriez parmi les premiers » ; `founder/marketing.md` §2.

**Ordre recommandé** : Q3, Q1, Q5, Q2, Q6, Q4 (fréquence du panel, puis board).

**Boutons de fin** (`ctaDevis`, `ctaFormules`)

| Clé | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `ctaDevis` (→ `/devis`) | Demander un devis | **Le voir sur mes demandes ** | **See it on my enquiries ** |
| `ctaFormules` (→ `/services`) | Voir les formules | **Voir l'assistant en détail** | **See the assistant in detail** |
| `titreCache` | Questions fréquentes | *inchangé* | *inchangé* |

## K. (06) Contact — pied de page

Voir `_chrome.md` §5 : le pied de page est rendu par toutes les pages.

## L. Supprimés de l'accueil sans remplacement

| Fichier:ligne | Texte | Pourquoi |
|---|---|---|
| `app/(site)/page.tsx:48` | « Dès [montant].–, TVA comprise. » (meta description) | Ancien prix d'entrée lu en base (PM §5). |
| `app/(site)/en/page.tsx:136` | « From [amount].–, VAT included. » | Idem. |
| `Offres.tsx:233-269` | montants, « dès », « /mois », TVA, note de suivi | Aucun montant autorisé. |
| `Faq.tsx:62-67` | montants du suivi recollés dans Q3 | Idem. |
