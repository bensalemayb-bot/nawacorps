# Re-audit CRO et SEO — site Nawa Corps, 25.10.2026 (v2)

Lecture seule. Même méthode que `audit-cro-seo-2026-10-25.md`.
Rendu relu sur `http://localhost:3000` : `/`, `/en`, `/services`, `/en/services`, `/studio`, `/en/studio`, `/contact`, `/en/contact`, `/devis`, `/en/devis`, `/cgv`, `/sanitaire-chauffage-geneve`, `/en/sanitaire-chauffage-geneve`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`.
Code relu : `app/binacore.css`, `components/ServicesRows.tsx`, `lib/i18n.ts`, JSON-LD rendu.
Le lecteur visé reste le même : un patron sanitaire genevois, sur son téléphone, entre deux chantiers.

---

## 1. Les notes

| Axe | Avant | Après | Pourquoi pas plus |
|---|---:|---:|---|
| Compréhension (5 s) | 6 | **8** | « IA » arrive au sous-titre, pas au titre. L'anglais promet autre chose que le français (« does the paperwork »). |
| Douleur | 4 | **7** | Les mots du patron sont là. Mais la page métier promet ce qui n'est pas encore construit (bons de régie, téléphone). |
| Envie d'agir | 5 | **7** | Un seul CTA, bonne cible. « Appeler » existe, mais seulement au temps 4. « appelez-nous » n'est pas un lien. Pas de barre mobile. |
| Confiance | 5 | **5,5** | Le paragraphe studio est mieux tourné. Rien d'autre n'a bougé : pas de visage, pas d'exemple, pas de garantie écrite, pas de référence. |
| SEO | 4 | **5,5** | La page métier existe, avec h1, FAQ et JSON-LD. Mais elle est mal reliée, et il n'y a toujours ni fiche Google, ni annuaire, ni lien entrant. |

---

## 2. Ce qui a vraiment progressé

- **La carte « Après l'essai »** avec « une seule fois, la mise en place, pas de TVA (entreprise non assujettie) ». On ne peut plus lire « 1'500.– par mois ». C'était le défaut le plus coûteux.
- **Un seul CTA** : « Voir la démo sur mon métier → » vers `/devis`, partout (hero, temps 4, métiers, offre, FAQ, menu). « Demander ma démo » ne reste que sur le bouton d'envoi et la pastille de la nav.
- **Le menu mobile** a enfin la démo en (04).
- **Ancres réparées** : « Comment ça se passe » mène bien à `#methode`.
- **Les mots du patron** : « prépare la paperasse. » (21 signes), « Vous êtes sous l'évier », « Les devis qui dorment », « Personne pour le bureau ? ».
- **La FAQ** répond à « Et s'il se trompe ? » et à « Je ne trouve personne pour le bureau » sans écrire « remplace votre secrétaire ».
- **Les métiers** : la ligne sanitaire est ouverte (`class="row open"`), les régies passent avant les fiduciaires, et le titre devient « Il parle votre métier ».
- **`.p-note`** passe à .9rem.
- **La page `/sanitaire-chauffage-geneve`** (+ EN) : h1 avec le mot-clé et « Genève », hreflang, Service + Offer + FAQPage + BreadcrumbList, présente dans le sitemap et dans `llms.txt`.
- **Le sitemap** a un `lastmod` fixe (2026-10-25).
- **Les titles et les metas** FR suivent les propositions.
- **Formules interdites** : rien trouvé dans le texte visible. Pas de délai en heures, ni « trois demandes », ni « TVA comprise », ni « dès », ni superlatif. Les deux « 100 % » sont dans la liste « ce que nous ne promettons pas » : c'est juste.

---

## 3. Défauts restants ou introduits

Classés du plus grave au moins grave.

### 3.1 Promesses non prouvées (risque LCD art. 3) — **grave**

La page métier décrit un produit qui n'est pas encore construit. Le positionnement le dit lui-même : 0 client, « 10 appels avant de coder », et la tâche unique du sanitaire n'est pas tranchée (décision ouverte n° 2 : réponse aux demandes, relance ou bon de régie).

| Où | AVANT | Problème | APRÈS |
|---|---|---|---|
| `/sanitaire-chauffage-geneve`, lede | « …prépare les devis et les relances, lit les bons de régie. » | « lit » affirme une capacité qui n'existe pas encore (lire un PDF ou un papier de régie). | « …prépare les devis et les relances. Le bon de régie fait partie de sa base. » |
| idem, (02) n° 03 | « Il lit le bon : l'adresse, le locataire, le travail demandé. Il prépare la prise de rendez-vous et la confirmation à la régie. » | Même problème, en détail. | « Le bon de régie fait partie de la base du métier : l'adresse, le locataire, le travail demandé. Ce qu'il en prépare chez vous se règle pendant la démo. Aucune date ne part sans votre accord. » |
| idem, FAQ « Et les bons de régie ? » | « Il lit le bon : … » | Idem. | Reprendre la phrase ci-dessus, sans « il lit ». |
| idem, (01) n° 01 | « Le téléphone sonne, WhatsApp vibre. » | Le site ne dit nulle part que l'assistant décroche. Ici, la scène le laisse croire. | « WhatsApp vibre, un e-mail arrive. » |
| idem, FAQ « Il connaît vraiment… » | « Il part d'une base faite pour votre métier » | Juste seulement si la base sanitaire existe le jour où le site part en prospection. | Garder **si** la démo sanitaire est prête. Sinon : « Nous construisons une base pour votre métier : les demandes types, le vocabulaire, le bon de régie. » |

Les versions EN (« reads agency work orders », « It reads the order », « The phone rings ») sont à corriger de la même façon.

### 3.2 L'anglais promet plus que le français — **grave**

| Clé (`en.ts`) | AVANT | Problème | APRÈS |
|---|---|---|---|
| `hero.h1Rotation[1]` | « does the paperwork. » | « does » = il le fait seul. Ça contredit « waits for your OK ». Le FR dit « prépare ». | « preps the paperwork. » (20) |
| `hero.sousTitre` | « An AI set to your trade does the evening paperwork. » | Même chose. | « An AI set to your trade preps the evening paperwork. » |
| `h1Complet` | (à aligner) | | « The AI that knows your trade, preps the paperwork, chases your quotes and waits for your OK. » |

### 3.3 Incohérences FR / EN — **moyen**

- **Title et meta de `/en` pas mis à jour.** « The AI assistant that knows your trade — Geneva » et l'ancienne meta, alors que le FR est passé à « Assistant IA pour artisans et PME à Genève · Nawa Corps ».
  APRÈS : title « AI assistant for tradespeople and small firms in Geneva » ; meta « It drafts your quotes, follows up and takes enquiries from the site, never committing on your behalf. Free demo; set-up paid after the trial. »
- **Title `/en/studio` à 71 signes**, coupé dans Google. APRÈS : « Ayoub Bensalem, AI assistants in Geneva · Nawa Corps » (52).
- **« Régie » traduite trois façons** : « agency work order », « property manager », « confirm to the agency ». Choisir « property manager » et « work order » partout.
- **« Fiduciaries »** : en anglais courant, c'est un faux ami. APRÈS : « Accounting firms (fiduciaries) ».

### 3.4 Prix — **moyen**

- **Le JSON-LD `Offer`** de `/services` et de `/sanitaire-chauffage-geneve` publie `price: 1500.00 CHF` **sans la mention de TVA**. La règle « aucun prix sans la mention » vaut aussi pour la donnée republiée hors de la page (comme la FAQPage). Correctif code : ajouter `"valueAddedTaxIncluded": false` à `PriceSpecification`, et une `description` qui porte `mentionTva` de `lib/format.ts`.
- **Trois façons de dire le prix de l'abonnement** sur la même page : « prix fixe, **dit** à la fin de la démo », « fixe, **annoncé** à la fin de la démo, avant l'essai », « L'abonnement **dépend de votre volume** : prix fixe annoncé… ». « Dit » est faible. Unifier sur « prix fixe, annoncé à la fin de la démo, avant l'essai ».
- **La carte « Après l'essai » se répète** : titre « Après l'essai », puis « Vous payez la mise en place après l'essai, si le relevé vous convient ».
  APRÈS (`offres.abonnementTexte`) : « Si le relevé vous convient, vous payez la mise en place. L'abonnement suit, au prix fixe annoncé à la fin de la démo. Sans engagement. »
  APRÈS (`offres.abonnementPayeSuite`) : « Puis l'abonnement mensuel, au prix fixe annoncé à la fin de la démo. »

### 3.5 Action — **moyen**

- **« ou appelez-nous » n'est pas un lien.** Le seul `tel:` du pied est dans la bande du bas. Le texte invite à appeler sans donner le moyen. Correctif : un lien `tel:` (numéro depuis `lib/site.ts`) sur « appelez-nous », ou un bouton « Appeler » à côté de « Écrire sur WhatsApp ».
- **« Appeler » est seulement au temps 4.** Le temps 1, le seul vu sans scroller, n'a pas de lien d'appel. Sur mobile, la pastille de la nav reste masquée sous 860 px (`binacore.css` l. 461), et il n'y a pas de barre basse. Le menu sauve la mise, mais il faut l'ouvrir.
- **Deux libellés subsistent** : la pastille desktop « Demander ma démo » et le CTA « Voir la démo sur mon métier ». C'est défendable (la pastille = l'action finale), mais l'œil voit deux promesses. Aligner la pastille sur « Voir la démo ».

### 3.6 Textes — **mineur**

| Clé | AVANT | Problème | APRÈS |
|---|---|---|---|
| `services.corps01` | « Combien de soirs par semaine finissez-vous **au bureau** ? » | Il n'a pas de bureau. Il fait ça à la maison. | « Combien de soirs par semaine passez-vous sur la paperasse ? » |
| `hero.sousTitre` | « Personne pour le bureau ? Une IA réglée sur votre métier prépare la paperasse du soir. Vous validez. » | « prépare la paperasse » répète la 2e ligne du h1. Et « Personne pour le bureau ? » promet une réponse à l'embauche que la FAQ tempère (« ne remplace pas une personne »). | « Personne pour le bureau ? Une IA réglée sur votre métier prépare vos devis et relances. Vous validez. » (101) — ou garder si Ayoub tient à « paperasse ». |

### 3.7 SEO — **moyen**

- **La page métier est mal reliée.** Les liens entrants internes : l'accordéon sanitaire de l'accueil et `/services`, c'est tout. Rien depuis la nav, le menu, le pied, `/studio` (dont la section « (03) Le premier métier » renvoie à `/services`), `/contact` ou `/devis`.
  Correctif code : lien dans le pied (« Sanitaire et chauffage ») et dans `/studio` (03) → « Voir l'assistant du sanitaire → ».
- **FAQ dupliquée.** Quatre questions sont identiques entre l'accueil et la page métier, chacune dans un `FAQPage`. Ce n'est pas pénalisant, mais la page métier gagnerait à garder ses questions propres (bon de régie, régies, urgences) et à renvoyer au reste.
- **Inchangés** : la ligne `Host:` dans `robots.txt` (non standard), les anciennes URL qui redirigent vers `/` plutôt que vers `/services`, les étiquettes à .66–.72rem.
- **Title de la page métier sans la marque** : « Assistant IA pour sanitaires et chauffagistes à Genève » (56). Acceptable : le mot-clé passe avant.

---

## 4. Ce qui manque pour 10/10, critère par critère

### Compréhension — 8 → 10

**Faisable dans le code maintenant**
- Corriger l'anglais (« preps », 3.2).
- Mettre « IA » dans le kicker visible au-dessus du h1 : `hero.kickerCible` « Assistants pour PME » → « Assistant IA pour PME ».
- Supprimer la double numérotation « (001) (002) » du hero : à demander (mise en page).

**Dépend d'Ayoub**
- Une vidéo ou une capture de 20 secondes de l'assistant sur une demande sanitaire, marquée « Démonstration ». Elle existera quand la démo existera.

### Douleur — 7 → 10

**Faisable dans le code maintenant**
- Retirer les promesses non prouvées (3.1). Une douleur bien nommée perd sa force si la solution sonne faux.
- « au bureau » → « sur la paperasse » (3.6).

**Dépend d'Ayoub**
- **Les 10 appels.** Aujourd'hui, toutes les voix sont françaises ou américaines (`vraies-voix-patrons.md` : « 0 voix romande »). Une phrase entendue chez un sanitaire genevois, citée anonymement et avec son accord, vaut plus que toutes les réécritures.
- Trancher la tâche unique du sanitaire (décision n° 2). La page métier pourra alors dire **une** chose sûre au lieu de quatre.

### Envie d'agir — 7 → 10

**Faisable dans le code maintenant**
- Lien `tel:` sur « appelez-nous » (3.5).
- Pastille nav alignée sur « Voir la démo sur mon métier ».

**À demander à Ayoub (mise en page)**
- « Appeler » au temps 1 du hero, à côté du CTA principal.
- Barre basse fixe sous 860 px, « Démo · Appeler », hors de `#smoothWrap`, sans couvrir la bulle de Leo.

**Dépend d'Ayoub**
- **Le prix de l'abonnement** : une fourchette, ou un « prix remis par écrit avant l'essai ». C'est le 2e motif de refus du panel (12/100).
- **La durée de l'essai** (décision n° 6). « Essai gratuit » sans durée, c'est un flou que le patron prudent lira contre nous.
- La démo sanitaire **prête à montrer** le jour où la page part en prospection.

### Confiance — 5,5 → 10

**Faisable dans le code maintenant**
- Mention de TVA dans le JSON-LD `Offer` (3.4).
- Prévoir l'emplacement d'un « Exemple de relevé du lundi », marqué « Exemple », avec des demandes fictives et sans nom de client. Le contenu est à valider par Ayoub.

**Dépend d'Ayoub**
- **Photo réelle d'Ayoub** (`/studio` et accueil (03)), puis `image` dans le `Person` du JSON-LD. Il n'y a toujours aucun visage sur le site.
- **Un premier client référence**, avec son accord écrit pour être cité. C'est ce qu'attendent 67 refus sur 100.
- **Un engagement écrit sur les données** : hébergeur suisse nommé, « pas d'entraînement de modèle sur vos données ». **Seulement si c'est vrai** pour le modèle choisi (décision n° 3).
- Le contrat avec le développeur (décision n° 5) : sans lui, « vous gardez tout » ne peut pas s'écrire.

### SEO — 5,5 → 10

**Faisable dans le code maintenant**
- Relier la page métier : pied, `/studio`, `/contact` (3.7).
- Title et meta de `/en`, title de `/en/studio` (3.3).
- FAQ propre à la page métier (urgences, régies, chauffe-eau), sans doublon de l'accueil.
- Retirer `Host:` de `robots.txt`. Rediriger les anciennes pages services vers `/services`.

**Dépend d'Ayoub**
- **Fiche Google Business Profile** (zone de service Genève, sans adresse publique). C'est le signal local n° 1, et NexaLab l'a déjà, avec 5,0 ★.
- **local.ch, search.ch**, avec le même nom, le même téléphone et la même zone.
- **Liens entrants** : 101 Agency, une association du bâtiment, un article de presse locale. Rien n'est acquis aujourd'hui.
- **Un premier article** écrit après les 10 appels (« Pas de secrétaire ? Ce que l'assistant reprend, et ce qu'il ne reprend pas »).
- **Des avis Google**, qui ne viendront qu'avec de vrais clients. Ne jamais en solliciter avant.

---

## 5. Ordre de travail proposé

**Code, cette semaine** (textes, données, liens — rien de visuel) :
1. Promesses non prouvées de la page métier, FR et EN (3.1).
2. « preps the paperwork » et sous-titre EN (3.2).
3. Mention TVA dans le JSON-LD `Offer` (3.4).
4. Lien `tel:` sur « appelez-nous » (3.5).
5. Prix de l'abonnement dit d'une seule façon ; carte « Après l'essai » sans répétition (3.4).
6. Title et meta `/en`, title `/en/studio`, traduction de « régie » (3.3).
7. Liens vers la page métier depuis le pied et `/studio` (3.7).
8. « au bureau » → « sur la paperasse » (3.6).

**À demander à Ayoub (mise en page)** : « Appeler » au temps 1, barre basse mobile, emplacement de l'exemple de relevé, numérotation du hero.

**Décisions d'Ayoub** : photo, tâche unique du sanitaire, durée de l'essai, prix ou fourchette de l'abonnement, engagement écrit sur les données, fiche Google, annuaires, démo prête **avant** d'envoyer la page en prospection.
