# Audit CRO et SEO — site Nawa Corps, 25.10.2026

Audit en lecture seule. Aucun fichier du site n'a été modifié.
Rendu lu sur `http://localhost:3000` (`/`, `/en`, `/services`, `/studio`, `/contact`, `/devis`, `/cgv`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`).
Textes : `lib/dictionnaires/fr.ts`. Ordre : `app/(site)/page.tsx`. Style : `app/binacore.css`.
Repères : `founder/research/vraies-voix-patrons.md`, `founder/panel/results.md`, `founder/research/agences-ia-positionnement.md`, `.agents/product-marketing.md`.
Concurrents relus en ligne le 25.10 : nexa-lab.ch et fluxel.ch.

Aucun outil SEO n'est branché. **Aucun volume de recherche n'est cité** : les mots-clés sont classés par intention, pas par volume.

---

## 1. Résumé

| Axe | Note | En une phrase |
|---|---:|---|
| Compréhension (5 secondes) | **6/10** | « L'assistant qui connaît votre métier » est clair. Mais « assistant » peut se lire « une secrétaire », et le mot IA n'arrive qu'au sous-titre. |
| Douleur | **4/10** | La douleur est dite dans les mots du studio (« le bureau du soir »), pas dans ceux du patron (« la paperasse », « les devis le soir », « personne à embaucher »). |
| Envie d'agir | **5/10** | Le risque est bien levé (rien à payer avant l'essai). Mais cinq libellés de CTA, deux destinations, et aucun bouton visible en haut de l'écran sur téléphone. |
| Confiance | **5/10** | La franchise (« 0 client ») et le contrôle sont forts. Il manque un visage, un exemple de ce que l'assistant produit, et une réponse écrite aux questions du panel sur les données. |
| SEO | **4/10** | La technique est propre. Mais le site n'a que quatre pages qui vendent, aucune page métier, aucune page Genève, et aucun signal local (fiche Google, avis). Les concurrents en ont. |

### Les 3 priorités

1. **Parler avec les mots du patron.** « Paperasse », « devis le soir », « sous l'évier », « personne à embaucher ». Hero, métiers, FAQ. (Quick win, textes seulement.)
2. **Un seul geste, partout, aussi sur téléphone.** Un seul libellé, une seule destination (`/devis`), et l'appel direct. Corriger les ancres cassées. Sur mobile, le bouton de la nav disparaît sous 860 px.
3. **Une page « Assistant pour sanitaires et chauffagistes à Genève ».** C'est le premier métier, c'est la prospection, et c'est le seul mot-clé où le site peut gagner vite face à NexaLab et Fluxel.

---

## 2. Parcours section par section

Le lecteur : un patron sanitaire genevois, 48 ans, sur son téléphone, entre deux chantiers. Il lit en diagonale.

### 2.1 Hero, temps 1 — le titre

**Ce qu'il comprend.** « L'assistant qui connaît votre métier. » Puis la rotation : répond, prépare les devis, attend votre accord. Il comprend « quelqu'un qui m'aide ». Il ne sait pas encore si c'est une personne, un logiciel ou une IA.

**Ce qui manque.** Le mot qu'il emploie lui-même : la paperasse. Et le moment où elle tombe : le soir.

**La douleur dans ses mots ?** Non. « Il reprend le bureau du soir » est une formule de studio. Les patrons disent « paperasse », « devis le soir », « on n'a même plus le temps de travailler » (voix n° 1, 2, 5, 10, 11).

**Le CTA.** « Voir l'assistant sur mon métier → » mène à `#contact` (le formulaire du pied). Le CTA du temps 4 mène à `/devis`. Deux chemins pour le même geste.

Réécritures (chaque ligne `.l` du h1 ≤ 21 caractères, comptées) :

| Clé | AVANT | APRÈS |
|---|---|---|
| `hero.h1Rotation[1]` | « répond à vos clients. » (21) | « prépare la paperasse. » (21) |
| `hero.h1Rotation[2]` | « prépare vos devis. » (18) | « relance vos devis. » (18) |
| `hero.h1Complet` | « L'assistant qui connaît votre métier, répond à vos clients, prépare vos devis et attend votre accord. » | « L'assistant qui connaît votre métier, prépare la paperasse, relance vos devis et attend votre accord. » |
| `hero.sousTitre` (~104 signes max) | « Il reprend le bureau du soir. C'est une IA réglée sur votre métier. Vous l'essayez avant de signer. » | « La paperasse du soir, il la prépare. Vous validez. C'est une IA réglée sur votre métier. » (88) |
| `hero.ctaPrincipal` | « Voir l'assistant sur mon métier » → `#contact` | « Voir la démo sur mon métier » → `/devis` |
| `hero.ctaSecondaire` | « Voir le parcours » → `#offres` | « Comment ça se passe » → `#methode` |

Note : « répond à vos clients » sort de la rotation. Le patron a peur d'« une IA qui écrit à mes clients » (panel, P003, P052). La promesse « répond » reste dans le corps, encadrée par le contrôle.

### 2.2 Hero, temps 2 — la scène du chantier

**Ce qu'il comprend.** « Pendant le chantier, l'assistant demande l'adresse, une photo et l'urgence. » C'est la meilleure phrase du site. Concrète, vraie.

**Ce qui manque.** Lui, dans la scène. Il n'y est pas encore.

| Clé | AVANT | APRÈS (≤ 83 signes) |
|---|---|---|
| `phraseDebut` + `phraseItalique` + `phraseFin` | « Pendant le chantier, l'assistant demande l'adresse, *une photo* et l'urgence. » (73) | « Vous êtes sous l'évier. L'assistant demande l'adresse, *une photo* et l'urgence. » (79) |
| `temps2Section` | « Une demande arrive » | « Une demande arrive. Vous êtes sur le chantier. » — ou garder, si l'étiquette doit rester courte |

### 2.3 Hero, temps 3 — la démo en faits

**Ce qu'il comprend.** « 0 engagement avant l'essai ». Données en Suisse. Prix validés par vous. Relevé le lundi. Mise en place 1'500.– pas de TVA (entreprise non assujettie).

**Le problème.** Le « 0 » en très grand se lit d'abord « zéro » tout court. Puis « engagement » en petites capitales. À trois mètres, c'est un compteur à zéro, le défaut qu'on reproche à Fluxel.

**Ce qui manque.** « payée après l'essai » sur la ligne du prix. Sans ça, 1'500.– tombe sans contexte.

| Clé | AVANT | APRÈS |
|---|---|---|
| `grandMot` / `grandMotUnite` | « 0 » / « engagement avant l'essai » | « Rien » / « à payer avant l'essai » (22 signes, tient dans l'emplacement de l'unité ; « Rien » est à mesurer dans `.noyau-num`, dessiné pour un mot court) |
| `specMiseEnPlace` | « Mise en place » | « Mise en place, après l'essai » — à mesurer à 375 px ; si la ligne casse, garder l'AVANT (cf. docblock `specMiseEnPlaceValeur`) |

Le montant reste lu en base ; la mention « pas de TVA (entreprise non assujettie) » reste celle de `lib/format.ts`.

### 2.4 Hero, temps 4 — la sortie

**Ce qu'il comprend.** « Vous validez. Il s'occupe du reste. » Bon slogan. Il dit le contrôle et le soulagement.

**Le CTA.** « Le voir sur mon métier → ». Troisième variante du même geste.

| Clé | AVANT | APRÈS |
|---|---|---|
| `sortieCtaPrincipal` | « Le voir sur mon métier » | « Voir la démo sur mon métier » |
| `sortieCtaSecondaire` | « Voir le parcours » → `#offres` | « Appeler » → `tel:` (le numéro vient de `lib/site.ts`) |

Pour un artisan, l'appel est le geste naturel. Le numéro n'apparaît aujourd'hui qu'en bas de page.

### 2.5 Strip (bande défilante)

**Ce qu'il comprend.** Rien de neuf. « Répond à vos clients · Relance vos devis · Prépare vos devis ». Deux fois « devis » de suite. Elle est `aria-hidden` et en .68rem : décorative.

| AVANT | APRÈS |
|---|---|
| Répond à vos clients · Relance vos devis · Prépare vos devis · Jamais à votre place · Un relevé chaque lundi · Genève | Les devis qui dorment · Les demandes du chantier · La paperasse du soir · Rien ne part sans vous · Le relevé du lundi · Genève |

La bande nomme la douleur, le reste du site nomme la solution. « Les devis qui dorment » vient d'un acheteur du panel (P051).

### 2.6 (01) Par métier

**Ce qu'il comprend.** « Une base par métier, le sanitaire d'abord. » C'est la logique du studio, pas la sienne. Puis quatre lignes **repliées** : il voit « Sanitaire et chauffage + ». Le texte qui parle de lui est caché derrière un clic.

**Ce qui manque.** Une question qui le pique, comme celle de l'électricité (« Combien de soirées par semaine passez-vous sur vos devis ? »). Le sanitaire, premier métier, n'en a pas.

**Les liens.** Trois « Voir le parcours → » mènent à `#offres` (L'offre), pas à `#methode` (Comment ça se passe). Libellé et cible ne correspondent pas.

**L'ordre.** Fiduciaires en 3e. Le panel les donne à 0 % d'achat. Les régies (6 %) devraient passer avant.

| Clé | AVANT | APRÈS |
|---|---|---|
| `services.titreLigne1` / `titreLigne2` | « Une base par métier, » / « le sanitaire d'abord. » | « Il parle votre métier, » / « le sanitaire d'abord. » |
| `services.corps01` | « Une demande arrive pendant que vous êtes sur le chantier. Un accusé de réception, validé par vous une fois, demande l'adresse, une photo et l'urgence. Le soir, vous trouvez une liste triée. Vous validez chaque réponse de fond. Il sait déjà ce qu'est un bon de régie. » | « Vous êtes sur le chantier, les demandes arrivent. L'assistant envoie un accusé de réception, que vous avez validé une fois : il demande l'adresse, une photo et l'urgence. Le soir, vous trouvez une liste triée, pas une pile. Vous validez chaque réponse de fond. Le bon de régie, il connaît. Combien de soirs par semaine finissez-vous au bureau ? » |
| `services.lien01`, `lien03`, `lien04` | « Voir le parcours → » → `#offres` | « Comment ça se passe → » → `#methode` |
| `services.lien02` | « Le voir sur mon métier → » | « Voir la démo sur mon métier → » |
| Ordre des lignes | Sanitaire, Électricité, Fiduciaires, Régies | Sanitaire, Électricité, Régies et agences, Fiduciaires |

**À demander à Ayoub (mise en page)** : ouvrir la ligne « Sanitaire et chauffage » par défaut. C'est le premier métier, et son texte est le meilleur de la section.

### 2.7 (02) Comment ça se passe

**Ce qu'il comprend.** Quatre étapes nettes : appel, démo, essai, abonnement. « Vos demandes d'abord, votre signature après. » Très bien.

**Ce qui manque.** La réponse à l'objection « convenience » du panel : « encore un truc à installer et à surveiller ». La FAQ y répond (« votre part est de lire et de valider »), pas l'étape de l'essai.

| Clé | AVANT | APRÈS |
|---|---|---|
| `methode.etape03Texte` | « L'assistant travaille sur vos vraies demandes. Il ne s'engage jamais à votre place. Chaque lundi, vous recevez le relevé. » | « L'assistant travaille sur vos vraies demandes. Votre part : lire et valider. Il ne s'engage jamais à votre place. Chaque lundi, le relevé. » |
| `methode.etape04Texte` | « Vous payez la mise en place, puis l'abonnement continue. Nous suivons l'assistant chaque semaine. » | « Vous payez la mise en place, une seule fois. Puis l'abonnement, sans engagement. Nous suivons l'assistant chaque semaine. » |
| `methode.cta` | « Voir ce que vous payez » | garder, c'est le seul CTA du site qui dit où il mène |

Ne pas écrire de durée d'essai : elle n'est pas décidée (`product-marketing.md` §10, n° 6).

### 2.8 (03) Le contrôle

**Ce qu'il comprend.** « Il ne s'engage jamais à votre place. » C'est la réponse directe à la peur n° 1 (« une IA qui écrit à mes clients »). La meilleure section du site.

**Ce qui manque.** La preuve visuelle. Le patron ne sait pas à quoi ressemble « un relevé » ou « une liste triée ».

**Le paragraphe 3** (« Nous n'avons pas encore de client ») est juste et doit rester. Mais il arrive collé au contrôle, au milieu des promesses. Il gagnerait à être tourné en force :

| Clé | AVANT | APRÈS |
|---|---|---|
| `studio.paragraphe3` | « Nawa Corps est un studio genevois, sans bureau. Ayoub Bensalem fait le premier appel et suit chaque client. Nous n'avons pas encore de client pour l'assistant : vous seriez parmi les premiers. » | « Nawa Corps est un studio genevois. Ayoub Bensalem fait le premier appel, la démo et le suivi. Nous n'avons pas encore de client pour l'assistant, et nous le disons. C'est pour ça que vous jugez sur vos propres demandes, avant de payer. » |

**À décider par Ayoub (pas une réécriture)** :
- Montrer un **exemple de relevé du lundi**, marqué « Exemple » en clair, avec des demandes fictives de sanitaire. Ce n'est pas une fausse preuve tant que l'étiquette est visible et qu'aucun nom de client n'apparaît.
- Une **photo réelle d'Ayoub** sur l'accueil ou `/studio`. Aucune photo de personne sur le site aujourd'hui.
- Le panel demande par écrit : « les données ne servent à entraîner aucun modèle ». **Ne l'écrire que si c'est vrai** pour l'hébergeur et le modèle choisis (décision ouverte n° 3).

### 2.9 (04) L'offre

**Ce qu'il comprend.** Trois cartes : La démo (Rien), L'essai (Rien), L'abonnement (**1'500.–**).

**Le problème, sérieux.** Le grand chiffre 1'500.– est posé **sous le titre « L'abonnement »**. Un patron pressé lit « 1'500.– par mois ». C'est l'inverse de ce qu'on veut, et ça nourrit le refus « prix » (12 sur 100).

**Ce qui manque.** Le mot « une fois ».

| Clé | AVANT | APRÈS |
|---|---|---|
| `offres.abonnementTitre` | « L'abonnement » | « Après l'essai » |
| `offres.abonnementPayeNote` | « la mise en place, {tva} » | « une seule fois, la mise en place, {tva} » |
| `offres.abonnementPayeSuite` | « Puis un abonnement mensuel selon votre volume. » | « Puis l'abonnement mensuel : prix fixe, dit à la fin de la démo, sans engagement. » |
| `offres.titreLigne1` / `titreLigne2` | « La mise en place, » / « payée après l'essai. » | garder |

**Le prix de l'abonnement caché** reste le 2e motif de refus. Aucun montant ne peut être inventé ici. Décision pour Ayoub : afficher une fourchette, ou écrire « le prix de l'abonnement vous est remis par écrit à la fin de la démo » (seulement si c'est la pratique).

### 2.10 (05) Questions

**Ce qu'il comprend.** Sept vraies objections, dans le bon ordre (confiance d'abord). Les réponses sont franches. Bonne section.

**Ce qui manque.**
- « Et s'il se trompe ? » : la peur derrière « je ne veux pas d'IA ».
- « Je ne trouve personne pour le bureau. » : la douleur « embauche », absente du site entier, alors que c'est le seul acheteur « need » du panel (P060) et un fait du positionnement (CCIG 2026).

Questions à ajouter (réponses vraies d'après le site actuel) :

> **Et s'il se trompe ?**
> Il prépare, vous validez. Une réponse de fond, un devis ou un prix ne part pas sans vous : vous corrigez avant. Le seul message qui part seul est l'accusé de réception, que vous avez relu une fois.

> **Je cherche quelqu'un pour le bureau, et je ne trouve personne.**
> L'assistant ne remplace pas une personne. Il reprend une partie du bureau : les demandes du chantier, les devis à préparer, les relances. Vous validez le reste. On commence par une seule tâche, celle qui vous prend le plus de soirées.

Ne pas écrire « remplace votre secrétaire » (vocabulaire interdit, §8 du positionnement).

| Clé | AVANT | APRÈS |
|---|---|---|
| `faq.ctaDevis` | « Le voir sur mon métier » | « Voir la démo sur mon métier » |

### 2.11 (06) Contact

**Ce qu'il comprend.** « Voyez-le sur votre métier. » WhatsApp, e-mail, formulaire. Placeholder excellent : « Votre métier, et ce qui vous prend vos soirées ».

**Ce qui manque.** Le téléphone en premier. Il n'apparaît que dans la bande du bas, en petit.

| Clé | AVANT | APRÈS |
|---|---|---|
| `pied.ouParEcrit` | « ou dites-nous en deux lignes ce qui vous prend vos soirées » | « ou appelez-nous, ou dites-nous en deux lignes ce qui vous prend vos soirées » + le lien `tel:` à côté du bouton WhatsApp (à demander : c'est un ajout d'élément) |

### 2.12 Pied de page

**Ce qu'il comprend.** Genève, horaires, téléphone, liens légaux. Correct.

**À vérifier.** Le HTML de l'accueil contient deux fois le bloc « Mentions légales · Confidentialité · CGV ». À confirmer au navigateur : si les deux sont visibles, l'un est de trop.

### 2.13 Hors accueil, en bref

- **`/studio`** : « 0 client — Vous seriez parmi les premiers » en chiffre clé. Honnête, bien. Les chiffres OCSTAT et CCIG sont sourcés. Le chiffre CAPEB est dit « en France » : correct.
- **`/devis`** : h1 « Voyez-le sur votre métier. » Bien. L'URL `/devis` pour une démo est trompeuse, mais ne pas la changer sans redirection.
- **`/contact`** : clair. « Quatre façons de nous joindre » : bien pour un artisan.
- **`/services`** : la liste « Ce que nous ne promettons pas » est une vraie force. La garder.

---

## 3. Mise en page

**Ordre des sections.** Hero (4 temps) → Strip → Métiers → Comment → Contrôle → Offre → FAQ → Contact. L'ordre est bon. Le contrôle avant le prix, c'est juste. Une seule remarque : le prix est déjà dans le hero (temps 3), il est donc vu deux fois avant la FAQ. Ce n'est pas un problème.

**Longueur.** Le hero occupe quatre temps de scroll avant le premier contenu. Sur téléphone, le patron fait beaucoup de pouces avant « Sanitaire et chauffage ». À mesurer : la part des visiteurs mobiles qui atteint (01).

**Hiérarchie.**
- Les étiquettes (kicker, `.strip span`, `.facts span`, `.price .lab`, `.stp .t`) sont en .66 à .72rem, en capitales espacées. Environ 11 px. Peu lisible pour un patron de 50 ans en plein soleil.
- La note de prix sous l'offre (`.p-note`) est en .78rem, soit ~12,5 px. **C'est la phrase qui dit tout le modèle de prix**, et c'est la plus petite du site. À remonter à .9rem au moins (à demander).
- Les numéros « (001) », « (002) » du hero et « (01)…(06) » des sections font deux suites différentes. Joli, mais du bruit pour un artisan.
- Le h2 de (03) est `.sr-only` : la citation tient lieu de titre. Ça marche.

**CTA répétés.** Cinq libellés pour un seul geste : « Voir l'assistant sur mon métier », « Le voir sur mon métier », « Demander ma démo », « Voir le parcours », « Voir ce que vous payez ». Et deux cibles : `#contact` et `/devis`. Le guide de voix demande **un seul geste**. Recommandation : « Voir la démo sur mon métier » partout → `/devis` ; « Demander ma démo » reste sur le bouton d'envoi du formulaire (c'est l'action finale, la première personne y a du sens).

**Mobile (via `app/binacore.css`).**
- Sous 860 px, `.nav-r .pill{display:none}` cache « Demander ma démo » dans la nav. Le menu plein écran n'a **pas** de lien démo : seulement L'offre, Le studio, Contact, WhatsApp, e-mail. Sur téléphone, après le hero, il n'existe plus de bouton démo visible avant (04). **Le défaut de conversion le plus net du site.** Correctif à demander : une ligne « Demander ma démo » dans le menu, et/ou une barre basse fixe « Démo · Appeler » (hors de `#smoothWrap`, cf. CLAUDE.md, et sans masquer la bulle de Leo, bas gauche).
- Les métiers sont des accordéons fermés. Sur mobile, la section se réduit à quatre titres et quatre « + ».
- Le h1 mobile est bien géré (`clamp(1.7rem,8.9vw,2.9rem)` sous 520 px, mesuré dans le CSS).
- Les zones de tap des liens légaux sont élargies à 44 px. Bien.

---

## 4. SEO

### 4.1 Problèmes on-page

| Page | Problème | Gravité | Correctif |
|---|---|---|---|
| Tout le site | Aucune page métier. Le premier métier (sanitaire, chauffage) n'a pas d'URL. Fluxel a 6 pages secteurs, NexaLab 6. | **Haute** | Créer `/sanitaire-chauffage-geneve` (ou `/services/sanitaire`), avec son h1, sa FAQ, sa démo. |
| Tout le site | Aucune page ou section « Genève » ciblée. NexaLab a Genève, Lausanne, Nyon ; Fluxel 12 villes. | Moyenne | Pas de pages villes en masse (un seul marché). Mais « Genève » dans les h1 de `/services` et de la future page métier. |
| `/` | h1 « L'assistant qui connaît votre métier » : ni « IA », ni « Genève », ni un métier. | Moyenne | Le title porte « IA » et « Genève » : acceptable pour l'accueil. Mettre « Genève » dans le sous-titre ou le h2 (01). |
| `/` | Le texte des métiers est dans des accordéons `inert`. Il est dans le HTML, donc indexé, mais pèse peu. | Basse | Ouvrir la première ligne (cf. 2.6). |
| `/` | Le title n'a pas la marque : « L'assistant IA qui connaît votre métier — PME à Genève ». | Basse | Voir 4.4. |
| `/services` | h1 « L'assistant, en détail. » : aucun mot-clé. | Moyenne | « L'assistant IA pour PME, à Genève. » |
| `/devis` | URL `/devis` pour une demande de démo. Le title est juste. | Basse | Garder l'URL (déjà liée partout). |
| `/studio` | Pas de photo d'Ayoub : rien pour l'E-E-A-T ni pour la confiance. | Moyenne | Photo réelle + `image` dans le `Person` du JSON-LD. |
| Accueil (JSON-LD) | `FAQPage` : Google ne montre plus ces extraits que pour les sites officiels et de santé. | Info | Garder : utile pour les moteurs IA (`llms.txt` aussi). |
| Accueil (JSON-LD) | `ProfessionalService` sans `streetAddress` ni `geo`. | Basse | Normal sans bureau. Le vrai signal local sera la fiche Google. |
| Anciennes URL | `/services/site-web`, `/services/identite`, `/demonstrations`… redirigent en 308 vers `/`. | Basse | Correct. Vers `/services` serait plus proche, pas critique. |
| `fr.ts` (docblock) | « `h1Debut` 11 » alors que « L'assistant qui » fait 15 signes. | Info (code) | Commentaire faux = bug (CLAUDE.md). À corriger par la revue de code. |

### 4.2 Checklist technique

| Point | État | Note |
|---|---|---|
| Rendu serveur (HTML complet sans JS) | ✅ pass | Tout le texte est dans le HTML. |
| `<html lang="fr-CH">` / `en-CH` | ✅ pass | |
| Title et meta description uniques par page | ✅ pass | Longueurs correctes. |
| Canonical | ✅ pass | Auto-référente sur chaque page. |
| hreflang fr-CH / en-CH / x-default | ✅ pass | Dans le `<head>` et dans le sitemap. |
| URL publique en production | ⚠️ warn | En local tout pointe sur `localhost:3000`. `lib/site.ts` signale `NEXT_PUBLIC_SITE_URL` manquante au build : vérifier sur la prod que canonical, sitemap, `llms.txt` et JSON-LD disent `nawacorps.ch`. |
| robots.txt | ⚠️ warn | Correct, mais la ligne `Host:` n'est pas standard (Google l'ignore). Sans risque. |
| sitemap.xml | ⚠️ warn | 16 URL, complet. `lastmod` = heure de la requête (page dynamique) : il change à chaque lecture, Google finit par l'ignorer. Mettre une date fixe par page. |
| Données structurées | ✅ pass | ProfessionalService, FAQPage, Service + Offer (prix + TVA), BreadcrumbList, AboutPage, ContactPage. |
| Un h1 par page | ✅ pass | |
| Images : alt | ✅ pass | Décoratives en `alt=""`, logo nommé. |
| Image LCP | ✅ pass | `noyau.webp` en `fetchPriority="high"`, srcset 800/1448. |
| h1 animé à l'entrée | ⚠️ warn | `transform: translateY(115%)` + délai : le LCP peut attendre la fin de l'animation. À mesurer avec Lighthouse sur la prod. |
| TTFB | ✅ pass | 17 ms mesurés en prod (docblock de `page.tsx`). |
| `llms.txt` | ✅ pass | Clair, borne bien la promesse sur les données. |
| Mobile (viewport, tailles, taps) | ⚠️ warn | Technique OK. Texte d'étiquettes à ~11 px. |
| 404 | ✅ pass | |
| Fiche Google Business Profile | ❌ fail | Non trouvée dans le dépôt. NexaLab affiche 5,0 ★ Google. Créer la fiche (zone de service Genève, sans adresse publique). |
| Annuaires locaux (local.ch, search.ch) | ❌ fail | À créer, avec le même nom, téléphone et zone. |
| Liens entrants | ❌ fail | Aucun connu. Piste : 101 Agency, associations du bâtiment (à demander, rien d'acquis). |
| Profondeur de contenu | ❌ fail | 4 pages qui vendent, aucun article, aucune page métier. |

### 4.3 Quinze mots-clés (FR, Genève)

Sans volume (aucun outil). Classés par priorité pour le site actuel.

| # | Mot-clé | Intention | Page cible |
|---|---|---|---|
| 1 | assistant IA sanitaire Genève | commerciale | Page métier sanitaire (à créer) |
| 2 | IA pour chauffagiste | info / commerciale | Page métier sanitaire |
| 3 | devis sanitaire chauffage automatique | commerciale | Page métier sanitaire |
| 4 | relance devis automatique artisan | commerciale | `/services` |
| 5 | assistant IA PME Genève | commerciale | `/` |
| 6 | agent IA Genève | commerciale (concurrentiel : NexaLab) | `/services` |
| 7 | gestion administrative artisan Genève | commerciale | Page métier sanitaire |
| 8 | secrétariat artisan Genève | commerciale (il cherche une personne) | FAQ « je ne trouve personne » + page métier |
| 9 | trouver une secrétaire bâtiment Genève | info | Article : « Pas de secrétaire ? Ce que l'assistant reprend, ce qu'il ne reprend pas » |
| 10 | bon de régie sanitaire | info (vocabulaire métier) | Article ou bloc de la page métier |
| 11 | réponse automatique WhatsApp entreprise | commerciale | `/services` |
| 12 | IA électricien Genève | commerciale | Page électricité (plus tard) |
| 13 | IA régie immobilière Genève | commerciale | Page régies (plus tard) |
| 14 | IA données hébergées en Suisse nLPD | info / confiance | FAQ + section contrôle de `/services` |
| 15 | automatisation PME Genève | commerciale (concurrentiel : NexaLab, Fluxel) | `/services` — ne pas viser en priorité |

**Lecture.** Sur « agent IA Genève » et « automatisation PME Genève », NexaLab et Fluxel ont des mois d'avance, des pages et des avis. Le site gagne là où ils sont absents : **le métier précis** (sanitaire, chauffage, bon de régie) et la peur de **ne trouver personne** pour le bureau.

### 4.4 Title et meta proposés

Pas de prix dans les meta (règle de `docs/agents/copy/meta.md`). Titles ≤ 60 signes, descriptions ≤ 155.

| Page | Title | Meta description |
|---|---|---|
| `/` | Assistant IA pour artisans et PME à Genève · Nawa Corps | Il prépare vos devis, relance et prend les demandes du chantier. Vous validez tout. Démo gratuite sur votre métier, mise en place payée après l'essai. |
| `/services` | L'assistant IA en détail : devis, relances, demandes · Genève | Ce qu'il fait, métier par métier, et ce qu'il ne fait jamais seul. Rien ne part sans votre accord. Données de l'assistant hébergées en Suisse. |
| Page métier (à créer) | Assistant IA pour sanitaires et chauffagistes à Genève | Les demandes du chantier triées, les devis préparés, les relances faites. Vous validez le soir, en quelques minutes. Démo sur vos demandes de sanitaire. |
| `/studio` | Ayoub Bensalem, assistants IA pour PME à Genève · Nawa Corps | Qui fait le premier appel, la démo et le suivi. Pourquoi le sanitaire d'abord. Ce que nous ne prenons pas. Pas encore de client : nous le disons. |
| `/contact` | Contacter Nawa Corps à Genève : téléphone, WhatsApp | Téléphone, WhatsApp, e-mail ou formulaire. Dites-nous votre métier et ce qui vous prend vos soirées. Réponse le jour ouvrable suivant. |
| `/devis` | Démo gratuite de l'assistant IA sur votre métier · Genève | Nous vous montrons l'assistant sur des demandes de votre métier. Rien à préparer, rien à payer, aucun accès à vos outils. Réponse le jour ouvrable suivant. |
| `/cgv`, `/mentions-legales`, `/confidentialite` | garder | garder |
| `/en` | garder (« The AI assistant that knows your trade — Geneva ») | garder |

« en quelques minutes » (page métier) est une promesse de durée : **à retirer** si Ayoub ne veut pas la tenir. Variante sûre : « Vous validez le soir, au lieu de tout écrire. »

---

## 5. Plan d'action

### Quick wins — cette semaine (textes et liens, `fr.ts` et `en.ts`)

1. **Carte « L'abonnement »** : titre « Après l'essai » et « une seule fois » devant la mise en place (2.9). Évite le « 1'500.– par mois ».
2. **Un seul CTA** : « Voir la démo sur mon métier » → `/devis`, partout (2.1, 2.4, 2.6, 2.10).
3. **Ancres** : « Voir le parcours » → `#methode`, renommé « Comment ça se passe » (2.1, 2.6).
4. **Les mots du patron** : h1 « prépare la paperasse. », sous-titre, scène « sous l'évier », strip (2.1, 2.2, 2.5).
5. **FAQ** : ajouter « Et s'il se trompe ? » et « Je ne trouve personne pour le bureau » (2.10).
6. **Ordre des métiers** : régies avant fiduciaires ; question au sanitaire (2.6).
7. **Titles et metas** (4.4).
8. **`sitemap.xml`** : `lastmod` fixe.
9. **Vérifier en prod** : canonical, sitemap, JSON-LD et `llms.txt` sur `nawacorps.ch`.

### À demander à Ayoub (mise en page, avant de toucher)

- Lien démo dans le menu mobile, et/ou barre basse « Démo · Appeler » sous 860 px.
- Ligne « Sanitaire et chauffage » ouverte par défaut.
- Note de prix `.p-note` et étiquettes à .9rem au moins.
- Lien `tel:` à côté de WhatsApp dans le pied et le hero.

### Chantiers — ce trimestre

1. **Page « Assistant pour sanitaires et chauffagistes à Genève »** : la scène du chantier, le bon de régie, les régies comme donneurs d'ordre, la FAQ du métier, la démo. C'est aussi la page à envoyer en prospection.
2. **Fiche Google Business Profile** (zone de service Genève) + local.ch + search.ch. Les avis viendront avec les premiers clients, pas avant.
3. **Exemple de relevé du lundi**, marqué « Exemple », sur l'accueil et la page métier.
4. **Photo réelle d'Ayoub** + `image` dans le JSON-LD `Person`.
5. **Décisions qui débloquent la conversion** (pas du texte) : fourchette ou remise écrite du prix de l'abonnement ; engagement écrit sur les données (hébergement suisse, pas d'entraînement) si c'est vrai ; durée de l'essai.
6. **Premier contenu** : un article « Pas de secrétaire ? Ce qu'un assistant reprend, et ce qu'il ne reprend pas », rédigé après les 10 appels, avec les mots entendus.
7. **Après le premier client** : son accord écrit pour le citer. C'est ce que 67 refus sur 100 attendent.

---

Sources en ligne consultées le 25.10.2026 : [nexa-lab.ch](https://nexa-lab.ch/), [fluxel.ch](https://www.fluxel.ch/), recherche « agent IA PME Genève automatisation devis artisans » (résultats : [NexaLab sur Sortlist](https://www.sortlist.co.uk/agency/nexalab-geneve), [profil Malt Evan Fuentes](https://www.malt.fr/profile/evanfuentes)).
