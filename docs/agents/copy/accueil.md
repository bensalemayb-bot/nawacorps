# Réécriture — page d'accueil `/`

> Mode `propose`. Aucun fichier du site n'est modifié.
> Référence : `docs/agents/brand/voice-guide.md`. Preuves :
> `.agents/product-marketing.md` (§ cités), `docs/agents/veille/`.
> Réserves appliquées : B1 à B6 de `docs/agents/reviews/boss-G1-tour1.md`.
>
> **Mot-clé cible de la page** : *refonte de site PME Genève*. Il reste dans le
> `title`, dans la `meta description` et dans la première unité de lecture du
> hero (kicker + sous-titre) — le `h1` du hero est contraint à 21 caractères par
> ligne et ne peut pas le porter en entier.

---

# A. LE HERO — priorité n°1

**Contrainte technique impérative.** Le `h1` est découpé en trois `<span
class="l">` révélées une par une (`app/binacore.css`, rappel en
`CLAUDE.md` et dans le commentaire de `NoyauHero.tsx:34-38`). **Chaque ligne
tient sur 21 caractères au maximum**, espaces et ponctuation comprises. Au-delà,
la ligne déborde, l'animation casse et le `hero-foot` passe sous la ligne de
flottaison. Le décompte est donné pour chaque ligne ci-dessous.

**Un conflit de format, signalé plutôt que masqué.** La règle de rédaction du
studio veut un `h1` de dix mots au plus ; la contrainte technique veut trois
lignes de 21 caractères, ce qui autorise jusqu'à 63 caractères et donne
naturellement onze ou douze mots. Les deux règles ne peuvent pas être tenues
ensemble sur toutes les variantes. **La contrainte des 21 caractères
l'emporte** — c'est un défaut de mise en page constaté et corrigé une fois,
tandis que la limite de dix mots est une règle de confort. Décompte :
**variante 1 = 12 mots · variante 2 = 10 mots · variante 3 = 11 mots**
(l'accroche actuelle en fait 12). **La variante 2 est la seule à satisfaire les
deux règles** — à verser à son crédit dans l'arbitrage.

## A.1 — L'accroche : trois variantes

### AVANT (`components/NoyauHero.tsx:39-41`)

```
Votre site a dix ans.        (21)
En 72 heures, il             (16)
travaille pour vous.         (20)
```

**Pourquoi elle ne tient pas.** Trois raisons, dont deux sont des règles.

1. « Votre site a dix ans » est une **affirmation sur le lecteur**, et elle est
   fausse pour une bonne partie de la cible : le signal de qualification du
   positionnement est « visiblement antérieur à 2020 », soit six ans, pas dix.
   Un lecteur dont le site a cinq ans se dit « ce n'est pas moi » et s'en va.
2. Elle **frôle le reproche**, sur le premier mot de la première ligne. Le
   positionnement §8 pose la règle inverse : ne jamais tourner en dérision le
   « avant » du client, parce que ce « avant », c'est lui.
3. « 72 heures » y voyage **sans point de départ ni livrable** — réserve B3. Et
   « travaille pour vous » ne dit pas ce qui entre : c'est l'abstraction que le
   §8 demande justement d'éviter au profit du concret.

---

### VARIANTE 1 — *le feu vert* · **recommandée**

```
Vous dites oui.              (15)
72 heures plus tard,         (20)
le site est en ligne.        (21)
```

*Repli si 21 caractères passent juste sur la maquette :*
`le site est refait.` (19) — même sens, trois caractères de marge.

- **POURQUOI.** C'est le pilier 1 du guide de voix mis en trois lignes :
  condition → délai → résultat. Elle est la seule des trois à écrire le
  **différenciateur réellement sourcé** — le compteur démarre au feu vert du
  client, pas à la livraison de son contenu. Elle satisfait B3 dans le `h1`
  lui-même : le délai porte son point de départ dans l'unité de lecture. Elle ne
  dit rien du site actuel du lecteur, donc elle ne peut pas se tromper sur lui
  ni le vexer. Et elle installe le rythme du studio : phrase courte, aucune
  emphase, un fait par ligne.
- **PREUVE.** `.agents/product-marketing.md` §5, « Les conditions », ligne
  *Textes* : les textes sont repris de l'ancien site, la maquette est proposée
  par le studio. Le délai ne dépend donc d'aucune livraison du client. Délai
  confirmé au §9, « Délai réel de livraison ». La veille corrobore que les deux
  seuls concurrents rapides du panel se protègent par une condition de contenu —
  **argument interne, jamais écrit sur le site** (réserve B2).
- **RISQUE.** « Vous dites oui » suppose que le lecteur sait à quoi il dit oui.
  Le kicker au-dessus (« Studio digital indépendant · Genève · Sites de PME ») et
  le sous-titre en dessous le disent tous les deux. Le `h1` seul est
  volontairement une mécanique, pas une description.

---

### VARIANTE 2 — *les demandes*

```
Un site qui reçoit           (18)
vos demandes, refait         (20)
en 72 heures.                (13)
```

- **POURQUOI.** Pilier 2 en premier, pilier 1 en second. C'est la variante qui
  répond le plus directement à l'objection « ce n'est qu'une vitrine », dont la
  veille établit qu'aucun acteur du panel ne la traite. Le délai voyage attaché
  à ce qui est livré — B3 satisfaite par l'autre moitié de la règle. Dix mots
  exactement, la limite du format. Elle a de la marge sur les trois lignes, donc
  aucun risque de débordement.
- **PREUVE.** `.agents/product-marketing.md` §5, tableau des formules : le
  formulaire de demande est dans le socle, dès 699.–. §3, pilier 2. Le délai :
  §9.
- **CE QU'ELLE PERD.** Le point de départ. « Refait en 72 heures » est ce que
  tout le monde comprendrait comme « 72 heures après que j'aurai envoyé mes
  affaires » — c'est-à-dire exactement la lecture que le studio veut défaire. Le
  sous-titre doit alors la rattraper, et une accroche qui a besoin d'être
  rattrapée est plus faible d'un cran.

---

### VARIANTE 3 — *le constat, sans reproche*

```
Votre site a vieilli.        (21)
Dans 72 heures, il           (18)
prend les demandes.          (19)
```

- **POURQUOI.** C'est la variante la plus proche de l'actuelle, corrigée sur ses
  deux défauts : « a vieilli » est un constat neutre là où « a dix ans » est un
  chiffre faux pour beaucoup, et « prend les demandes » remplace l'abstraction
  « travaille pour vous » par le glossaire du studio. Elle garde l'avantage de
  l'accroche actuelle : elle **qualifie le lecteur dès le premier mot**.
- **PREUVE.** ICP : `.agents/product-marketing.md` §2, « dont le site a plus de
  cinq ans ». Délai : §9. Demandes : §5.
- **CE QU'ELLE PERD.** Elle reste une affirmation sur le lecteur, donc elle
  exclut d'entrée celui qui n'a pas encore de site — la minorité, mais le §3
  prévoit explicitement de lui parler (« une semaine si on part de zéro »).
  Et deux lignes sur trois sont à 18-21 caractères : la marge de sécurité est
  mince si la police change.

---

### Recommandation

**Variante 1.** C'est la seule des trois qui met le différenciateur sourcé dans
le `h1` plutôt que dans une note de bas de page, la seule qui ne prend aucun
risque sur l'état réel du site du lecteur, et la seule dont la ligne la plus
longue peut descendre à 19 caractères si la maquette serre. Variante 2 en
second choix si Boualem préfère mener par le bénéfice plutôt que par la
mécanique.

## A.2 — Le sous-titre du hero

- **AVANT** (`NoyauHero.tsx:44`) — Sites de PME à Genève : demande de devis,
  prise de rendez-vous, fiche Google. Refait en 72 heures si vous avez déjà un
  site, une semaine si on part de zéro. Dès 699.–, TVA comprise.
- **APRÈS** *(accompagne la variante 1)* — **Sites de PME à Genève : demande de
  devis, prise de rendez-vous, fiche Google. Je reprends les textes de votre
  site actuel, donc je ne vous attends pas. Une semaine si on part de zéro. Dès
  699.–, TVA comprise.** *(41 mots)*
- **APRÈS** *(accompagne la variante 2 ou 3)* — **Sites de PME à Genève :
  demande de devis, prise de rendez-vous, fiche Google. Le délai court dès votre
  feu vert, pas dès que vous m'envoyez vos textes — je les reprends de votre
  site actuel. Une semaine en partant de zéro. Dès 699.–, TVA comprise.**
- **POURQUOI.** Le sous-titre est le seul endroit du hero où le mot-clé cible
  tient en entier. Il garde donc « Sites de PME à Genève » en tête. Ce qui
  change : la phrase de délai devient une phrase de **point de départ**, parce
  que c'est elle qui fait la différence et qu'aucun autre bloc de la page ne la
  porte avant la FAQ, tout en bas.
- **PREUVE.** §5 « Les conditions » ; §9 ; grille des prix §5 (699.– TVA
  comprise).

## A.3 — Le CTA secondaire du hero

- **AVANT** (`NoyauHero.tsx:47`) — Voir les avant / après
- **APRÈS** — **Voir les démonstrations**
- **POURQUOI.** Glossaire, entrée 14. « Avant / après » laisse entendre qu'il
  existe un client dont c'est le avant et le après. Il n'y en a aucun
  (`.agents/product-marketing.md` §9 : « Références de site : 0 »). Le mot
  « démonstration » est celui que le positionnement §6 retient lui-même pour la
  seule option honnête. **L'ancre `#travaux` ne change pas** — c'est une URL.
- **PREUVE.** §6, « Le trou à combler », option 2 : « Une démonstration assumée
  … étiquetée démonstration sans ambiguïté ».

## A.4 — Les temps 2, 3 et 4 du hero animé

### Temps 2 — étiquette et phrase

- **AVANT** (`:58`, `:60`) — (001) Le noyau · « Il reçoit les demandes, chiffre
  les devis, prend les rendez-vous — sans que vous y touchiez. »
- **APRÈS** — **(001) Ce que le site fait** · **« Il reçoit les demandes, prend
  les rendez-vous et chiffre les devis — sans que vous y touchiez. Selon la
  formule. »**
- **POURQUOI.** « Le noyau » est un nom de composant, pas un mot du client :
  aucun gérant de PME ne sait ce qu'est un noyau, et le glossaire n'a pas
  d'entrée pour lui. La phrase, elle, promettait les trois fonctions sans dire
  qu'elles se répartissent sur trois paliers — c'est la même sur-promesse qui
  ferait ouvrir la grille en se sentant floué. Trois mots la réparent. L'ordre
  des verbes suit désormais celui de la grille (recevoir → rendez-vous → devis).
- **PREUVE.** §5 : formulaire dès La Vitrine ; rendez-vous et devis chiffré au
  Site ; assistant à L'Assistant.

### Temps 3 — étiquette, chiffre et spécifications

- **AVANT** (`:70`, `:73-74`, `:77-80`) — (002) Le cœur · **72 / heures** ·
  Atelier : Genève, Suisse · Refonte : 72 heures · Départ de zéro : Une semaine ·
  Suivi : Dès 49.–/mois
- **APRÈS** — **(002) Le délai** · **72 / heures** ·
  **Départ du compteur : Votre feu vert** ·
  **Refonte : 72 heures** ·
  **Départ de zéro : Une semaine** ·
  **Studio : Genève, Suisse** ·
  **Suivi : Dès 49.–/mois, 2ᵉ année**
- **POURQUOI.** C'est l'endroit du site où « 72 » est écrit le plus grand, donc
  celui où la réserve B3 mord le plus fort : un « 72 heures » de cette taille,
  sans condition de départ, range le studio dans le voisinage du couple
  « 48-72 h + prix d'appel » que la veille identifie comme la signature du bas de
  marché. La première ligne des spécifications répare cela dans la même unité de
  lecture, sans toucher au chiffre géant. « Atelier » devient « Studio »
  (glossaire, entrée 1) et le suivi porte enfin sa condition de départ, qui est
  son meilleur argument : rien à payer la première année.
- **PREUVE.** B3, mémo G1, point 2. Suivi et 2ᵉ année : §5, « Le récurrent ».

### Temps 4 — la sortie

- **AVANT** (`:90`) — Un site ne se regarde pas. Il travaille, **ou il ne sert à
  rien.**
- **APRÈS** — **Un site ne se regarde pas. Il fait entrer des demandes, ou il
  dort.**
- **POURQUOI.** « Ou il ne sert à rien » juge le site que le lecteur possède, et
  qu'il a payé — c'est précisément la faute que le positionnement §8 interdit.
  « Il dort » dit la même chose sans mettre personne en cause, et se termine sur
  le glossaire (« demandes ») plutôt que sur un verbe vide.
- **PREUVE.** §8, « Ce qui doit changer », première ligne.

---

# B. LA SECTION « TRAVAUX » — le point le plus exposé du site

> **Ce bloc n'est pas d'abord un problème de mots.** Cinq pièces sont construites
> autour d'un établissement inventé, doté d'une raison sociale, d'une adresse
> (« Rue des Étuves 12 »), d'une année de fondation (« 1987 »), d'un téléphone,
> d'un fax et d'un compteur de visiteurs. Le positionnement le classe déjà
> « **client fictif inventé — à retirer** » (§6). En Suisse, la LCD art. 3 vise
> les indications trompeuses sur ses propres prestations, et CLAUDE.md l'inscrit
> dans ses Interdits : « aucune référence client inventée, aucun avis fabriqué,
> aucun compteur fictif ».
>
> Les réécritures ci-dessous **neutralisent la fiction sans toucher au dessin**.
> Elles sont un minimum, pas une solution : voir les points ouverts en fin de
> fichier.

## B.1 — Nom et chapô de la section

- **AVANT** (`Travaux.tsx:18`, `:20`, `:23`) — (01) Travaux · « Tout a un avant.
  Voici les après. » · « Cinq démonstrations du studio — glissez la poignée de
  chaque pièce pour comparer l'avant et l'après. »
- **APRÈS** — **(01) Démonstrations** · **« Tout a un avant. Voici les
  après. »** *(inchangé)* · **« Cinq pièces faites par le studio pour montrer le
  travail. Aucune n'est un client : le studio démarre, et sa première refonte de
  site de PME reste à faire. Glissez la poignée pour comparer. »**
- **POURQUOI.** « Travaux » annonce des réalisations clientes ; il y en a zéro
  (§9). Le chapô actuel disait déjà « démonstrations » — bien — mais l'étiquette
  de section, la nav et le menu disaient « Travaux » juste au-dessus, et c'est
  l'étiquette que l'œil retient. La phrase ajoutée transforme un trou en
  position : dire qu'on démarre est vérifiable, et c'est la seule chose plus
  solide qu'une référence inventée. **L'ancre `#travaux` reste inchangée.**
- **PREUVE.** §6, tableau des preuves : « Le Comptoir (carrousel) — client
  fictif inventé — à retirer ». §9 : « Références de site : 0 ».

## B.2 — Neutraliser l'entreprise inventée

| # | AVANT | APRÈS | Fichier:ligne |
|---|---|---|---|
| 1 | Le Comptoir | **Café Exemple** | `feature-carousel.tsx:216,302` |
| 2 | Bar — Genève · **Maison fondée en 1987 · Rue des Étuves** | **Bar — démonstration · Carte, horaires, adresse** | `:215,217` |
| 3 | Bar — Genève · **depuis 1987** | **Bar — démonstration** | `:239` |
| 4 | Rue des Étuves 12 | **Adresse · Genève** | `:246,280` |
| 5 | **Le Comptoir** — Genève *(affiche)* | **Café Exemple — démonstration** | `:276` |
| 6 | Jeudi 12 décembre — dès 19 h | **Un jeudi — dès 19 h** | `:279` |
| 7 | Rue des Étuves 12 · 1201 | **Genève** | `:280` |
| 8 | Carte fidélité · **Le Comptoir** | Carte fidélité · **Café Exemple** | `:286-287` |
| 9 | **Tél : 022 000 00 00 / Fax : 022 000 00 01** | **Tél. · Fax** *(sans numéro)* | `:337` |
| 10 | **Bienvenue sur le site du Comptoir !!** | **Bienvenue sur notre site** | `:322` |
| 11 | **NOUVEAU : soirée jazz le jeudi !!!** | **Nouveau : soirée jazz le jeudi** | `:325` |
| 12 | **Vous êtes le visiteur n° 000482** | **Compteur de visiteurs** | `:326` |
| 13 | **JAZZ !!!** *(affiche « avant »)* | **JAZZ** | `:344` |

- **POURQUOI.** Deux problèmes distincts, réparés ensemble.
  **(a) La fiction.** Un nom d'enseigne, une adresse dans une rue qui existe, une
  année de fondation et un numéro de téléphone composent une entreprise
  crédible. « Café Exemple » ne peut être pris pour personne, et le mot
  « démonstration » figure désormais **dans la pièce**, pas seulement dans le
  chapô.
  **(b) La dérision.** Les trois points d'exclamation, le compteur de visiteurs
  et « optimisé pour Internet Explorer 6 » ne décrivent pas un site daté : ils
  s'en moquent. Or c'est le site du prospect. Le §8 pose la règle en toutes
  lettres : « Le carrousel actuel se moque de sites et de cartes qui sont
  exactement ceux du prospect. *Daté*, jamais *ridicule*. » Retirer les
  exclamations et neutraliser le compteur suffit : la pièce reste manifestement
  vieille, elle cesse d'être une blague aux dépens du lecteur.
- **PREUVE.** §6 et §8 du positionnement ; CLAUDE.md, Interdits.

## B.3 — Le texte des cinq pièces

| Pièce | AVANT | APRÈS |
|---|---|---|
| Le site (`:385`) | Un site de 2009 refait **en 72 heures** : lisible sur téléphone, avec un formulaire de devis qui fonctionne. | **Un site de 2009 refait : lisible sur téléphone, avec un formulaire de devis qui fonctionne. 72 heures à partir du feu vert.** |
| La carte (`:378`) | Une carte qui a bien servi, remise à plat : hiérarchie claire, prix lisibles, et sa version en ligne par QR code. | **Une carte qui a bien servi, remise à plat : hiérarchie claire, prix lisibles, version en ligne par QR code. Ligne restauration, sur devis.** |
| La carte de visite (`:392`) | 85 × 55 recto-verso, sur un papier qu'on garde en main. Le même geste, mieux dit. | *(inchangé — concret, chiffré, dans le ton)* |
| L'affiche (`:399`) | La même annonce, redessinée : une affiche qu'on remarque et qu'on garde. | **La même annonce, redessinée. Ligne restauration, sur devis.** |
| La fidélité (`:406`) | La carte à tampons remise au propre : dix passages, un vrai design. | **La carte à tampons remise au propre : dix passages. Ligne restauration, sur devis.** |

- **POURQUOI.** *Le site* est la seule des cinq pièces qui parle à l'ICP, et son
  « 72 heures » y voyageait seul (B3) : il porte maintenant son point de départ.
  Les trois pièces de restauration ne sont pas retirées — elles correspondent à
  une prestation réelle et à un client payant — mais elles doivent dire qu'elles
  appartiennent à une **ligne secondaire**, sinon le visiteur qui cherche un
  site conclut que le studio fait surtout des menus. « Un vrai design » part :
  c'est un jugement sur soi, pas un fait.
- **PREUVE.** §5, « Ligne secondaire — restauration », conservée hors de la
  grille principale. §6 pour la carte de restaurant, seule pièce adossée à un
  client payant réel — **utilisable uniquement avec l'accord écrit du client**.

---

# C. BANDE DÉFILANTE ET SERVICES

## C.1 — La bande défilante

- **AVANT** (`Strip.tsx:12-13`) — Refonte de site · Demande de devis · Prise de
  rendez-vous · Fiche Google · **72 heures** · Genève
- **APRÈS** — Refonte de site · Demande de devis · Prise de rendez-vous · Fiche
  Google · **72 h dès votre feu vert** · Genève
- **POURQUOI.** Réserve B3, cas d'école : un jeton « 72 heures » entre deux
  autres jetons, sans rien autour. Quatre mots le raccrochent à sa condition
  sans casser le rythme du défilement.
- **PREUVE.** B3 ; §5, « Les conditions ».

## C.2 — Le titre de la section Services

- **AVANT** (`ServicesRows.tsx:22`) — Six gestes, **un seul interlocuteur.**
- **APRÈS** — **Six gestes, la même personne.**
- **POURQUOI.** **Réserve B4, violation directe.** « Interlocuteur unique » est
  occupé par un acteur du panel sur ce marché ; « un seul interlocuteur » en est
  la variante reconnaissable, ce que la réserve interdit explicitement. « La
  même personne » dit la même chose, en plus vrai (le studio *est* une
  personne), et c'est le vocabulaire que la section « Le studio » emploie déjà
  deux écrans plus bas — une seule voix.
- **PREUVE.** `docs/agents/reviews/boss-G1-tour1.md`, réserve B4 et test T6.
  `veille/concurrents.json`, C3, champ `lexique_recurrent`.

## C.3 — Les six gestes

| # | AVANT (extrait) | APRÈS | Pourquoi · Preuve |
|---|---|---|---|
| 01 | …Livré **en 72 heures**, deux allers-retours compris. | …**Livré 72 heures après votre feu vert, deux allers-retours compris.** | B3 : le délai porte son départ. §5, « Les conditions ». |
| 02 | …le visiteur repart avec **une estimation chiffrée immédiate**. | …**le visiteur repart avec un devis chiffré, tout de suite.** | Glossaire, entrée 7 : un seul mot par concept, et c'est celui de la grille de prix. §5. |
| 03 | Vos créneaux en ligne, **synchronisés avec votre agenda**… | **Vos créneaux en ligne. Le client réserve seul, à 23 h comme le dimanche, et reçoit sa confirmation. Vous arrêtez de vous rappeler mutuellement pour caler une heure.** | La synchronisation d'agenda n'est **nulle part** dans l'offre : c'est une fonctionnalité promise sans source. Retirée → `_sans-preuve.md`. §5 ne mentionne que « Prise de rendez-vous en ligne ». |
| 04 | Un assistant formé sur vos prestations… **Les demandes restées sans réponse sont relancées seules.** | **Avec L'Assistant : un assistant formé sur vos prestations et vos tarifs répond jour et nuit, note le nom et le numéro, et vous alerte sur votre téléphone dans la seconde. Les demandes sans réponse sont relancées seules.** | Ces quatre fonctions n'existent qu'au troisième palier ; les annoncer sans le dire fait de la grille une déception. Deux mots suffisent. §5, colonne L'Assistant. |
| 05 | Fiche complétée : photos, horaires exacts, zone d'intervention, **réponses aux avis**… | **Fiche complétée : photos, horaires exacts, zone d'intervention. C'est ce que voient vos futurs clients avant votre site — et souvent la seule chose qu'ils voient.** | « Réponses aux avis » est une prestation récurrente que rien ne décrit ni ne tarife. Retirée → `_sans-preuve.md`. §5 : « Fiche Google complétée ». |
| 06 | Un logotype propre si vous n'en avez pas, une palette cohérente… | **Sur devis, en complément : un logotype si vous n'en avez pas, une palette cohérente entre le site, vos documents et vos véhicules, et des photos de votre entreprise cadrées pour le web comme pour Google.** | Aucune des trois prestations n'est comprise dans une formule ; les décrire au même niveau que les cinq autres gestes laisse croire l'inverse. §5, « En complément ». |

---

# D. OFFRES ET CARTE DU STUDIO

## D.1 — Le titre de la grille

- **AVANT** (`Offres.tsx:113`) — **Des prix clairs, tout compris.**
- **APRÈS** — **Trois formules. Les prix sont écrits.**
- **POURQUOI.** La clarté tarifaire et l'absence de coûts cachés **sont la
  promesse d'accueil entière** d'un des six acteurs du panel, et le couple
  « transparent / sans coûts cachés » est relevé chez trois acteurs sur six.
  Écrire « des prix clairs » puis « sans frais cachés » quatre lignes plus bas,
  c'est chanter le refrain du marché. « Les prix sont écrits » est un fait sur cette page-ci —
  ils y sont, on peut les compter — et non une revendication de vertu.
  Non comparatif, donc conforme à B1 et B2.
- **PREUVE.** `veille/concurrents.json`, C6 `promesse_principale` et
  `lexique_recurrent` ; `veille/synthese.md`, « Lexique commun du marché ».

## D.2 — Les notes sous la grille

- **AVANT** (`:170`) — Prix en francs suisses, TVA comprise, **sans frais
  cachés.**
- **APRÈS** — **Prix en francs suisses, TVA comprise. Le prix annoncé est le
  prix facturé.**
- **AVANT** (`:171`) — Suivi et hébergement dès 49.–/mois, à partir de la 2ᵉ
  année.
- **APRÈS** — **La première année d'hébergement et de domaine est comprise. Le
  suivi commence la 2ᵉ année, dès 49.–/mois.**
- **POURQUOI.** Même motif saturé que ci-dessus pour la première. Pour la
  seconde : « dès 49.–/mois » annoncé avant « à partir de la 2ᵉ année » se lit
  comme un abonnement qui démarre tout de suite, c'est-à-dire comme un coût
  caché — l'inverse exact de ce que la ligne veut dire. Inverser l'ordre change
  la note de frais en argument. C'est aussi ce que le positionnement recherche :
  « le rendez-vous de renouvellement se joue après douze mois de service rendu,
  pas au moment de l'achat ».
- **PREUVE.** §5, « Le récurrent », paragraphe « Départ la 2ᵉ année ».

## D.3 — Le CTA de la formule *Le Site*

- **AVANT** (`:68`) — Lancer mon site
- **APRÈS** — **Recevoir mes demandes**
- **POURQUOI.** Guide §7 : verbe + bénéfice. Les deux autres cartes tiennent
  déjà la règle (« Refaire mon site », « Automatiser mes demandes ») ; celle du
  milieu — la formule recommandée, l'ancrage de la grille — est la seule à
  proposer une action sans bénéfice. « Recevoir mes demandes » nomme ce que ce
  palier ajoute exactement : rendez-vous et devis chiffré.
- **PREUVE.** §5, colonne *Le Site*.

## D.4 — La carte du studio

- **AVANT** (`CarteDuStudio.tsx:101`) — Votre site en ligne, le studio reste à
  disposition — à la carte, **sans engagement.**
- **APRÈS** — **Votre site en ligne, le studio reste là. À la carte, à la
  demande, sans abonnement obligatoire.**
- **AVANT** (`:117`) — Prix indicatifs, TVA comprise — **devis en cinq minutes.**
- **APRÈS** — **Prix indicatifs, TVA comprise. Dites-moi ce qu'il vous faut, je
  chiffre.**
- **POURQUOI.** « Sans engagement » est relevé dans le lexique du panel et ne
  veut juridiquement rien dire de précis ; « sans abonnement obligatoire » dit
  le fait exact. « Devis en cinq minutes » est un délai que **rien** ne fonde —
  ni le positionnement, ni la veille — et il entre en concurrence avec la seule
  promesse de délai du site, qui doit rester unique. Retiré →
  `_sans-preuve.md`. « Le studio reste là » porte le pilier 3 sans employer le
  terme interdit par B4.
- **PREUVE.** §5, « Le récurrent » (le suivi découle du palier, il n'est pas un
  menu) ; §8, « Une seule promesse de délai » ; réserve B4.

## D.5 — Un libellé de la base de données

- **AVANT** (`prisma/seed.ts:65`) — Site multi-pages / **sur-mesure**
- **APRÈS** — **Site multi-pages — au-delà du one-page**
- **POURQUOI.** « Sur mesure » est relevé chez quatre acteurs sur six et figure
  dans les interdits de la définition de rôle. La description en base dit déjà
  « Au-delà du one-page : périmètre défini ensemble » : le nom peut simplement
  reprendre le fait au lieu de l'adjectif. **Le `slug` `site-sur-mesure` ne
  change pas** — c'est une clé, pas un texte.
- **PREUVE.** `veille/concurrents.json`, champs `lexique_recurrent` de C1, C3,
  C4, C5.

---

# E. MÉTHODE, LE STUDIO, QUESTIONS

## E.1 — Le titre de la Méthode

- **AVANT** (`Methode.tsx:12`) — **Du premier appel** à la mise en ligne : 72
  heures.
- **APRÈS** — **De votre feu vert à la mise en ligne : 72 heures.**
- **POURQUOI.** Deux problèmes en une phrase. D'abord elle **contredit la FAQ**
  de la même page, qui dit « le délai court dès votre feu vert » : deux points de
  départ pour un même délai, c'est-à-dire aucun. Ensuite elle fait courir le
  compteur depuis le premier appel, alors que l'étape 01 juste en dessous est un
  état des lieux de trente minutes qui précède la décision — le studio se
  facturerait un délai qu'il n'a pas promis. « Votre feu vert » aligne le titre
  sur la FAQ, sur le hero et sur le pilier 1.
- **PREUVE.** §8, « Une seule promesse de délai » et « Nommer le point de départ
  des 72 h ». Réserve B3.

## E.2 — L'étape 03 et l'étape 04

- **AVANT** (`:17`) — 72 h · La mise en ligne · Domaine, hébergement,
  formulaire, rendez-vous : tout est branché. Vous n'installez rien, vous ne
  configurez rien.
- **APRÈS** — 72 h · La mise en ligne · **Vous voyez le site fini, vous validez,
  vous payez, je mets en ligne. Domaine, hébergement, formulaire, rendez-vous :
  tout est branché. Vous n'installez rien, vous ne configurez rien.**
- **AVANT** (`:18`) — Ensuite · Le suivi · Un tarif change, une prestation
  s'ajoute, un horaire bouge ? Un message et **c'est corrigé dans la journée.**
- **APRÈS** — Ensuite · Le suivi · **Un tarif change, une prestation s'ajoute,
  un horaire bouge ? Un message, et je corrige. C'est ce que couvre le suivi, à
  partir de la 2ᵉ année.**
- **POURQUOI.** L'étape 03 taisait la séquence de livraison, qui est pourtant la
  seule protection du studio contre un impayé et qui ne demande aucune avance au
  client — elle se dit donc mieux qu'elle ne se cache. L'étape 04 promettait
  « dans la journée » : c'est un engagement de service que rien ne fonde, sur
  une prestation dont le studio n'a aujourd'hui aucun abonné. Retiré →
  `_sans-preuve.md`.
- **PREUVE.** §5, « Les conditions », ligne *Livraison* ; §5, « Le récurrent » ;
  §9 (« Revenu récurrent : 0 »).

## E.3 — La section « Le studio »

- **AVANT** (`Studio.tsx:17`) — **Si les prix sont ceux-là, c'est la structure
  qui l'explique, pas le travail : pas de bureaux, pas d'équipe commerciale, pas
  de sous-traitance. Ce que vous ne payez pas, ce sont les frais de quelqu'un
  d'autre.**
- **APRÈS** — **Pas de bureaux, pas d'équipe commerciale, pas de
  sous-traitance : le studio est petit, et c'est ce qui lui permet d'être là le
  lendemain de la mise en ligne comme le mois suivant.**
- **POURQUOI.** **Réserve B6.** Le paragraphe actuel est une défense de prix, et
  la porte G1 pose que le copy n'en écrit aucune tant que la question de la
  grille n'est pas tranchée par Boualem. La raison n'est pas seulement
  procédurale : une justification attire l'attention sur le doute qu'elle veut
  dissiper. Les trois mêmes faits — pas de bureaux, pas de commerciaux, pas de
  sous-traitance — restent écrits, mais ils servent le pilier 3 (quelqu'un
  reste) au lieu de plaider le prix. Aucun mot n'est perdu ; la conclusion
  change.
- **PREUVE.** `boss-G1-tour1.md`, réserve B6 et test T7. §3, pilier 3.

- **AVANT** (`:20`) — **72 h** / Refonte livrée
- **APRÈS** — **72 h** / **Après votre feu vert**
- **POURQUOI.** B3, dernière occurrence isolée de la page. La case fait trois
  mots ; elle peut porter la condition plutôt que de répéter le mot « refonte »
  déjà présent six fois au-dessus.

## E.4 — Les questions

### Q4 — le délai de correction

- **AVANT** (`Faq.tsx:31`) — …Une fois en ligne, un message suffit : un tarif
  qui bouge, une prestation qui s'ajoute, **c'est corrigé dans la journée.**…
- **APRÈS** — **Deux allers-retours sont compris pendant la conception. Une fois
  en ligne, un message suffit : un tarif qui bouge, une prestation qui s'ajoute,
  je corrige. Les modifications de contenu sont comprises dans le suivi de
  L'Assistant ; sur les deux autres formules, elles sont facturées à la
  demande.**
- **POURQUOI.** Même engagement non sourcé qu'en Méthode 04, et il doit
  disparaître aux deux endroits en même temps sous peine de laisser une des deux
  versions faire foi. Le reste de la réponse est juste et reste.
- **PREUVE.** §5, « Les conditions » (2 allers-retours) et « Le récurrent »
  (modifications comprises pour L'Assistant).

### Q5 — la question à remplacer

- **AVANT** (`Faq.tsx:34-35`) — **« Pourquoi moins cher qu'une agence ? »** —
  « Parce qu'il n'y a ni bureaux, ni équipe commerciale, ni sous-traitance :
  vous parlez à celui qui fait le travail… Le travail, lui, est le même — et il
  est **livré en trois jours au lieu de trois mois.** »
- **APRÈS** — **« Qui fait le travail ? »** — **« Moi. Nawa Corps est un studio
  d'une personne : celui qui répond à votre message est celui qui dessine, écrit
  et construit votre site. Pas de chargé de compte à qui répéter les choses, pas
  de sous-traitant à qui les transmettre. Vous parlez à celui qui fait le
  travail — et c'est encore lui la deuxième année. »** *(56 mots)*
- **POURQUOI.** Trois manquements dans une seule réponse.
  **(a) B6** — c'est la défense de prix la plus explicite du site, et elle est
  gelée jusqu'à la décision de Boualem sur la grille.
  **(b) B1** — « trois jours au lieu de trois mois » est une **affirmation sur
  le délai des agences**. La veille relève des délais publiés allant de 10 jours
  à 8 semaines, sur un panel de six : « trois mois » n'est porté par aucune
  source, et un superlatif de marché non substantiable est exactement ce que
  vise la LCD art. 3.
  **(c) Glossaire, entrée 3** — « trois jours » est une seconde forme du délai,
  alors que le site doit n'en avoir qu'une.
  La question de remplacement conserve la phrase que le positionnement demande
  de garder mot pour mot, et fait porter la réponse par le pilier 3 — que la
  veille identifie comme le seul angle que personne du panel ne traite
  frontalement.
- **PREUVE.** Réserves B1 et B6 ; §8, « Vous parlez à celui qui fait le
  travail. À garder mot pour mot » ; `veille/synthese.md`, « Espaces libres »,
  dernier point ; §5, « Le récurrent ».

> Les cinq questions alimentent aussi le JSON-LD `FAQPage` (`Faq.tsx:39-47`)
> depuis la même constante : la correction se propage seule, et la donnée
> structurée ne peut pas promettre à Google une réponse que la page n'affiche
> pas.

### Ordre des questions

**Recommandation :** placer Q2 (« Je n'ai ni textes ni photos ») en deuxième
position, immédiatement après Q1. Les deux forment le pilier 1 : la première
annonce le délai, la seconde explique pourquoi il tient. Aujourd'hui elles sont
déjà voisines — le seul changement serait de ne jamais les séparer. *Aucun texte
modifié ; note pour l'implémentation.*

---

# F. PIED DE PAGE ET FORMULAIRE

## F.1 — L'accusé de réception du formulaire

- **AVANT** (`ContactForm.tsx:69`) — Message reçu — **réponse sous 24 h.**
- **APRÈS** — **Message reçu. Je vous réponds personnellement — c'est un studio
  d'une personne, pas un formulaire qui part dans le vide.**
- **POURQUOI.** « Sous 24 h » est un engagement de service absent du
  positionnement, affiché au moment précis où le visiteur devient joignable —
  donc au moment où le manquer coûte le plus. Retiré → `_sans-preuve.md`. Ce
  qui le remplace est vrai par construction (§9 : le studio est une personne) et
  répond à la même inquiétude : « est-ce que quelqu'un va lire ça ? »
- **PREUVE.** §9 ; §7 (structure d'une personne).

## F.2 — Les messages d'erreur

- **AVANT** (`ContactForm.tsx:79,84`) — Envoi impossible pour le moment.
  **Écrivez-nous** sur WhatsApp en attendant. / Connexion interrompue.
  **Écrivez-nous** sur WhatsApp en attendant.
- **APRÈS** — Envoi impossible pour le moment. **Écrivez-moi** sur WhatsApp en
  attendant. / Connexion interrompue. **Écrivez-moi** sur WhatsApp en attendant.
- **POURQUOI.** Une seule voix. Tout le site dit « je » — le hero, la FAQ, la
  section studio, l'assistant. Deux « nous » dans des messages d'erreur suffisent
  à faire entendre une équipe qui n'existe pas.
- **PREUVE.** Guide §4, « On vouvoie, et on parle à la première personne du
  singulier » ; §7 du positionnement (structure d'une personne).

## F.3 — Le bouton d'envoi

- **AVANT** (`ContactForm.tsx:128`) — Envoyer →
- **APRÈS** — **Envoyer mon site →**
- **POURQUOI.** Guide §7 : verbe + bénéfice. Le champ juste au-dessus demande
  « Votre site actuel, votre besoin » et l'amorce dit « laissez-moi l'adresse de
  votre site » : le bouton peut nommer ce qui part, ce qui vaut mieux qu'un
  verbe nu. Priorité basse.

---

# G. MÉTADONNÉES

- **AVANT** (`app/(site)/layout.tsx:68` et `:74`, og et twitter) — **Votre site
  a dix ans.** En 72 heures il reçoit les demandes, chiffre les devis et prend
  les rendez-vous. Dès 699.–, TVA comprise.
- **APRÈS** — **Vous dites oui, et 72 heures plus tard le site est en ligne :
  demande de devis, prise de rendez-vous, fiche Google. Les textes sont repris
  de votre site actuel. Dès 699.–, TVA comprise.**
- **POURQUOI.** L'aperçu partagé doit dire la même chose que le hero, sinon le
  visiteur arrive sur une autre promesse que celle qui l'a fait cliquer. Le
  « dix ans » disparaît pour les mêmes raisons qu'au hero, et le point de départ
  entre dans les 160 caractères utiles (B3).
- **PREUVE.** §5, « Les conditions » ; §9 ; grille §5.
- **Inchangés** : le `title` (« Refonte de site pour PME à Genève — livré en
  72 h ») et la `meta description` portent le mot-clé cible et satisfont déjà
  B3 — le délai y voyage attaché au livrable.

---

# H. Points ouverts propres à cette page

1. **Le carrousel doit être refait, pas seulement reformulé.** Les réécritures
   de la section B retirent l'exposition juridique ; elles ne règlent pas que
   **quatre pièces sur cinq relèvent de la restauration**, c'est-à-dire de la
   ligne que le positionnement place hors de la grille principale. Un visiteur
   qui cherche une refonte de site voit un menu, une affiche, une carte de
   fidélité, et un seul site. **Décision pour Boualem :** reconstruire au moins
   la pièce « Le site » autour d'un métier de l'ICP — garage, fiduciaire,
   plombier — ou obtenir la première référence réelle (§6, option 1), qui rend
   toute la section inutile en la remplaçant.
2. **La carte de visite du carrousel affiche des coordonnées non confirmées** en
   grand (`feature-carousel.tsx:265-267` lit `CONTACT` alors que
   `NAP_CONFIRME = false`). Ce n'est pas du copy : c'est un numéro de téléphone
   fictif rendu à l'écran comme s'il était réel.
3. **La carte de restaurant est la seule preuve réelle du studio** (§6) et elle
   n'est utilisable **qu'avec l'accord du client**. Cet accord est-il obtenu ?
   Tant qu'il ne l'est pas, la pièce « La carte » est une démonstration comme
   les autres, et rien de plus.
