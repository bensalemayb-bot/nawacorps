# Revue A — tour 1 — guide de voix et propositions de copy

**Objet :** `brand/voice-guide.md`, `copy/_inventaire.md`, `copy/accueil.md`,
`copy/_chrome.md`, `copy/mentions-legales.md`, `copy/confidentialite.md`,
`copy/_sans-preuve.md`
**Référentiels :** `.agents/product-marketing.md` (version sur disque, corrigée),
`docs/agents/veille/synthese.md`, `docs/agents/reviews/boss-G1-tour1.md`, `CLAUDE.md`
**Date :** 2026-08-30 · **Verdict : À CORRIGER** · 5 bloquants · 8 majeurs · 9 mineurs

> Aucun fichier du site n'a été ouvert : un correctif de code tourne sur
> `components/`, `lib/`, `app/` et Docker. Tout ce qui suit s'appuie sur les
> citations de `_inventaire.md`, sur les référentiels, et sur `CLAUDE.md`
> (racine, hors périmètre du correctif). Quand une conclusion dépend d'un
> fichier que je n'ai pas pu lire, je le dis.

---

## Ce que j'ai vérifié moi-même, avant de noter

**1. Les décomptes du `h1` — les 13 lignes proposées.** Contrainte dure :
21 caractères par ligne (`CLAUDE.md`, § Conventions du dépôt, dernière puce).
Vérification caractère par caractère des trois variantes, du repli et de
l'accroche actuelle : **13 décomptes annoncés sur 13 sont exacts, et 13 lignes
sur 13 tiennent dans la contrainte.** Aucune erreur. C'est la vérification qui
casse le plus de mises en page, et elle est propre.

| | L1 | L2 | L3 |
|---|---|---|---|
| Actuelle | 21 | 16 | 20 |
| **Variante 1** | 15 | 20 | **21** |
| *(repli V1)* | | | *19* |
| **Variante 2** | 18 | 20 | 13 |
| **Variante 3** | **21** | 18 | 19 |

Deux variantes ont une ligne exactement à 21 : V1 (ligne 3) et V3 (ligne 1).
Zéro marge. **La variante 2 est la seule dont aucune ligne ne touche le
plafond** (max 20) — un fait technique, pas une préférence.

**2. Les trois décisions fermées.** Balayage complet de `copy/` et `brand/` :

- **Grille 699 / 1'499 / 2'499 TVA comprise, sans tarif de lancement.** Aucune
  occurrence de « lancement », « amorçage », « prix barré », « −31 % », ni
  d'aucun prix de référence. **Conforme.** (À signaler : `boss-G1-tour1.md`
  recommande en dernière ligne de son mémo d'inscrire la grille « comme prix
  d'amorçage à revoir ». Cette recommandation est aujourd'hui caduque et le
  copy a eu raison de ne pas la reprendre.)
- **Aucun concurrent nommé.** Aucune occurrence des six noms du panel ni des
  huit écartés, dans aucun artefact. Les preuves citent les codes `C1`…`C6`.
  **Conforme.**
- **Aucun superlatif de délai.** Aucune occurrence de « le seul », « personne
  d'autre », « le plus rapide », « aucun concurrent » en position d'affirmation
  publique. Les seules occurrences sont dans la prose de justification, jamais
  dans un bloc APRÈS. **Conforme.** Et `_sans-preuve.md` §A ferme les deux
  formulations à la source, avec le motif.

**Sur ces trois points, le tour 1 est propre. Rien à corriger.**

**3. Les citations du positionnement.** Les artefacts ont été écrits contre une
version antérieure de `.agents/product-marketing.md`. Deux citations sont
devenues fausses (voir MINEURS 4 et 5), et une réserve de la porte G1 est
désormais levée sans que personne l'ait constaté (voir « Pour boss-decision »).

---

## 1. Grille — 8 critères

| # | Critère | Note | Justification en une ligne |
|---|---|---|---|
| 1 | **Clarté en 5 secondes** | **3** / 5 | Le « pour qui » et le « pourquoi maintenant » sont nets partout ; le « quoi » manque là où il compte le plus — le `h1` recommandé est une mécanique qui ne se décode qu'en lisant les deux blocs qui l'entourent, dont un sous-titre de 41 mots. |
| 2 | **Hiérarchie de la valeur** | **3** / 5 | Verbes concrets, glossaire tenu, abstractions retirées (« travaille pour vous », « le noyau ») — mais le bénéfice que le guide lui-même classe n°1 (§2 : « ça ne va pas me manger ma semaine ») est partout subordonné à un fait sur le compteur, et la grille de prix précède toutes les réponses aux objections. |
| 3 | **Leviers** | **2** / 5 | Zéro preuve sociale inventée, zéro faux avis, zéro compteur fictif : les gros risques sont éliminés. Restent **trois leviers sans source** (deux d'autorité, un d'aversion à la perte) qui remplacent des leviers retirés pour ce motif exact, et la seule preuve réelle que le studio possède — le palier 3 qui tourne sur ce site — est exploitée dans une puce et nulle part ailleurs. |
| 4 | **Friction** | **3** / 5 | Jargon interne supprimé, CTA au format verbe + bénéfice, doubles négations absentes. Contre : sous-titre de hero à 41-48 mots et 4 idées, deux réécritures à 30 et 35 mots, un CTA ambigu (« Envoyer mon site »), et « feu vert » sept fois sur un écran et demi. |
| 5 | **Objections** | **3** / 5 | L'objection que la veille dit non traitée sur tout le panel (« ce n'est qu'une vitrine ») est traitée trois fois, bien. Mais **tout ce qui rend le prix croyable arrive après le prix** — Méthode (04), Le studio (05), Questions (06) sont sous la grille (03) —, et la suspicion de prix elle-même reste sans réponse, par décision (B6), sans qu'aucun dispositif de remplacement soit proposé. |
| 6 | **Spécificité** | **4** / 5 | C'est le meilleur actif du lot : 72 heures, 699.–, deux allers-retours, 2ᵉ année, 85 × 55, one-page, « le client signale ses modifications ». Les jugements sur soi sont retirés (« un vrai design » part). Deux précisions non sourcées se sont réintroduites en cours de réécriture (« dans la seconde », « reçoit sa confirmation »). |
| 7 | **Cohérence avec le guide** | **4** / 5 | Le glossaire est appliqué entrée par entrée, les réserves B1 à B4 et B6 sont vérifiables par balayage, la table des CTA du §7 est suivie au mot près. Deux manquements : un prix affiché dans le hero **sans « TVA comprise »** (guide §8, règle 3 ; `CLAUDE.md`, Interdits), et le terme de glossaire « votre feu vert » absent de tout l'écran d'accueil dans l'appariement recommandé. |
| 8 | **Éthique** | **2** / 5 | Le centre de gravité du livrable est éthique et il fait honneur : fiction neutralisée, superlatifs fermés, engagements de service non tenables retirés, et le transfert des conversations hors de Suisse enfin écrit — c'est la meilleure chose du lot. Mais **l'abonnement obligatoire du palier 3 n'est dit nulle part**, pendant qu'une autre ligne affirme « sans abonnement obligatoire », et la dérision du site du prospect survit dans le carrousel alors que le document affirme l'avoir réglée. |

**Total : 24 / 40 = 3,0.**

---

## 2. BLOQUANTS — 5

### BL-1 — L'Assistant impose un abonnement à 129.–/mois, et aucune ligne ne le dit

- **Où** : `copy/accueil.md` §D.2 (notes sous la grille), et par omission dans
  tout le lot.
- **Texte concerné** : « La première année d'hébergement et de domaine est
  comprise. Le suivi commence la 2ᵉ année, dès 49.–/mois. »
- **Pourquoi** : `.agents/product-marketing.md` §5 est catégorique — « **Le
  palier 3 impose l'abonnement de suivi** — ce n'est pas une option », à
  129.–/mois. Un acheteur de L'Assistant s'engage donc, en payant 2'499.–, à
  129.–/mois à partir de la 2ᵉ année. Le mot « dès 49.–/mois » lui fait lire
  l'inverse : un plancher facultatif. C'est une ambiguïté sur l'engagement au
  moment de la décision d'achat — critère Éthique, et LCD art. 3 en toile de
  fond. Le chiffre 129 n'apparaît **nulle part** dans `copy/`. *(La FAQ Q3 le
  cite selon `_inventaire.md`, mais dans une réponse sur l'hébergement et le
  domaine, pas comme une condition d'achat du palier 3 — je n'ai pas pu ouvrir
  le composant pour le confirmer.)*
- **Réécriture** — note sous la grille, en remplacement des deux notes
  proposées :
  > **Prix en francs suisses, TVA comprise. Le prix annoncé est le prix
  > facturé. La première année d'hébergement et de domaine est comprise ; le
  > suivi commence la 2ᵉ année — 49.–/mois TVA comprise avec La Vitrine et Le
  > Site, 129.–/mois avec L'Assistant, qui ne tourne pas sans lui.**

  Et sur la carte L'Assistant, en dernière puce :
  > **Suivi à 129.–/mois TVA comprise dès la 2ᵉ année, compris dans la formule
  > (l'assistant répond en continu).**

  Dire la condition la vend : elle explique pourquoi l'assistant fonctionne
  encore l'année suivante.

### BL-2 — « sans abonnement obligatoire » contredit la grille de la même page

- **Où** : `copy/accueil.md` §D.4, chapô de la Carte du studio.
- **Texte concerné** : « Votre site en ligne, le studio reste là. À la carte, à
  la demande, **sans abonnement obligatoire.** »
- **Pourquoi** : la réécriture remplace un terme vague et saturé (« sans
  engagement ») par une affirmation précise — et fausse pour un tiers de la
  grille (§5 : le palier 3 impose l'abonnement). Une affirmation vague qui ne
  dit rien est un défaut de style ; une affirmation précise qui dit le contraire
  du contrat est un défaut de fond, et elle figure sur la carte qui liste
  justement « En continu ».
- **Réécriture** :
  > **Votre site en ligne, le studio reste là. À la carte, à la demande.**

  Rien à ajouter : la promesse de continuité est portée par « le studio reste
  là », qui est le pilier 3 et qui est vrai sans condition.

### BL-3 — Un prix affiché dans le hero sans « TVA comprise »

- **Où** : `copy/accueil.md` §A.4, temps 3, dernière ligne de spécifications.
- **Texte concerné** : « **Suivi : Dès 49.–/mois, 2ᵉ année** »
- **Pourquoi** : `CLAUDE.md`, Interdits, dernière ligne : « Aucun prix affiché
  sans la mention **TVA comprise**. » Le guide de voix la reprend au §8, règle
  3, en la qualifiant de règle de droit. Cette ligne affiche un prix, dans le
  bloc le plus visible du site, à plusieurs écrans de toute mention de TVA. La
  note sous la grille (§D.2) est couverte parce que les deux notes se lisent
  ensemble ; celle-ci ne l'est pas.
- **Réécriture** — deux options, la seconde préférable :
  > **Suivi : Dès 49.–/mois TVA comprise, 2ᵉ année**

  ou, mieux, retirer le prix du hero :
  > **Suivi : À partir de la 2ᵉ année**

  Le hero n'a pas besoin d'un second prix ; il a besoin de dire que la première
  année ne coûte rien de plus. La grille, deux écrans plus bas, porte le
  montant et la mention.

### BL-4 — Un levier d'aversion à la perte sans source

- **Où** : `copy/accueil.md` §C.3, geste 05 (Fiche Google).
- **Texte concerné** : « C'est ce que voient vos futurs clients avant votre site
  — et **souvent la seule chose qu'ils voient.** »
- **Pourquoi** : c'est une affirmation générale sur le comportement du marché,
  et elle n'est ni dans `.agents/product-marketing.md`, ni dans
  `docs/agents/veille/`. Le guide §8 pose la règle sans exception, « y compris
  pour un détail rassurant qui ne mange pas de pain », et la même réécriture
  vient de retirer « réponses aux avis » pour exactement ce motif, trois mots
  plus loin. Le levier est le plus fort de la ligne — c'est justement pourquoi
  il doit être sourcé.
- **Réécriture** — le positionnement §2 porte le fait, il suffit de s'y tenir :
  > **Fiche complétée : photos, horaires exacts, zone d'intervention. C'est ce
  > que voient les gens qui cherchent votre métier à Genève.**

  (`.agents/product-marketing.md` §2 : « les gens qui cherchent son métier à
  Genève tombent sur un site daté ».) Ce qui est retiré, c'est la quantification
  implicite (« souvent la seule chose »), pas l'idée.

### BL-5 — Deux leviers d'autorité qui remplacent des leviers retirés pour absence de preuve

- **Où** : `copy/_chrome.md` §3 (sous-titre de l'assistant, **les trois pages,
  en permanence**) et `copy/accueil.md` §F.1 (accusé de réception du
  formulaire).
- **Textes concernés** : « **Ayoub lit tout, et répond lui-même** » et « Message
  reçu. **Je vous réponds personnellement** — c'est un studio d'une personne,
  pas un formulaire qui part dans le vide. »
- **Pourquoi** : « Réponse sous 24 h » a été retiré parce que l'engagement
  n'existe ni dans le positionnement ni dans la veille — décision juste. Ce qui
  le remplace est **le même engagement, sans horloge** : « lit tout » et
  « répond personnellement » sont des affirmations sur un comportement futur,
  invérifiables et absentes des deux référentiels. Elles sont plus difficiles à
  démentir, pas plus fondées, et elles occupent la position la plus exposée du
  site (permanente, sur trois pages). Le guide §8 ne prévoit pas de degré :
  fait vérifiable, ou rien.
- **Réécriture** — remplacer une promesse de comportement par un fait
  d'architecture, qui est documenté (`§5`, encadré « Le palier 3 existe déjà » :
  tableau de bord des leads, `/admin`) :
  > *Sous-titre de l'assistant* — **L'assistant répond ; Ayoub voit la
  > conversation.**
  >
  > *Accusé de réception* — **Message reçu. Il arrive chez Ayoub, pas dans une
  > boîte partagée.**

  Les deux répondent à l'inquiétude réelle — *est-ce qu'un humain verra ça ?* —
  avec un fait sur le système, pas une promesse sur une personne. **Et le
  sous-titre de l'assistant est l'endroit où la démonstration doit être dite en
  toutes lettres** (voir §5 ci-dessous) :
  > **Vous utilisez L'Assistant, la troisième formule. Ayoub voit la
  > conversation.**

---

## 3. MAJEURS — 8

### MA-1 — Le `h1` recommandé ne dit pas ce qui est vendu

- **Où** : `copy/accueil.md` §A.1, variante 1, recommandée.
- **Texte** : « Vous dites oui. / 72 heures plus tard, / le site est en ligne. »
- **Pourquoi** : le document l'assume — « le `h1` seul est volontairement une
  mécanique, pas une description » — mais c'est la ligne la plus lue du site,
  devant un lecteur qui ne connaît ni le studio ni l'offre. « Vous dites oui »
  ne se décode qu'après coup, une fois le kicker et le sous-titre lus : ce
  décodage rétroactif est exactement la charge cognitive que le critère Friction
  pénalise. S'y ajoute que **« le site est en ligne » ne dit pas *refait*** — or
  l'ICP a déjà un site, et il est déjà en ligne.
- **Réécriture** — voir l'avis complet au §4. En bref : **retenir la variante
  2**, ou, si la mécanique de la variante 1 est préférée, adopter le repli comme
  ligne principale :
  > Vous dites oui. (15) / 72 heures plus tard, (20) / **le site est refait.**
  > (19)

  Le mot « refait » nomme l'objet du contrat et libère deux caractères de marge.

### MA-2 — L'appariement recommandé est le seul qui n'écrit ni « feu vert » ni le contraste

- **Où** : `copy/accueil.md` §A.2, sous-titre « accompagne la variante 1 ».
- **Texte** : « … Je reprends les textes de votre site actuel, donc je ne vous
  attends pas. … »
- **Pourquoi** : c'est un fait sur le studio, sans point de comparaison. Le
  sous-titre prévu pour les variantes 2 et 3 dit, lui, « **le délai court dès
  votre feu vert, pas dès que vous m'envoyez vos textes** » : il nomme
  l'attente par défaut du lecteur, et c'est cette moitié-là qui produit la
  différenciation, sans nommer personne. Résultat paradoxal : **l'appariement
  recommandé est celui qui porte le différenciateur le moins clairement**, et le
  terme de glossaire n°5 (« votre feu vert ») disparaît de tout l'écran
  d'accueil.
- **Réécriture** — utiliser le sous-titre « variantes 2 ou 3 » quelle que soit
  la variante retenue, raccourci (voir MA-3).

### MA-3 — Le sous-titre du hero fait 41 à 48 mots et porte quatre idées

- **Où** : `copy/accueil.md` §A.2.
- **Pourquoi** : mot-clé + trois fonctions + point de départ + cas « départ de
  zéro » + prix, dans un bloc qui doit se lire en trois secondes par un gérant
  pressé. Le cas « départ de zéro » est, de l'aveu du positionnement §3, la
  minorité — et il reste écrit dans les spécifications du temps 3, à l'intérieur
  du même hero, ainsi qu'en FAQ. Il n'a pas à occuper le sous-titre.
- **Réécriture** *(30 mots)* :
  > **Sites de PME à Genève : demande de devis, prise de rendez-vous, fiche
  > Google. Le délai court dès votre feu vert, pas dès que vous m'envoyez vos
  > textes — je les reprends de votre site actuel. Dès 699.–, TVA comprise.**

### MA-4 — Le bénéfice n°1 de l'ICP est partout au second plan

- **Où** : tout le lot ; le hero en particulier.
- **Pourquoi** : le guide §2 classe les trois attentes et écrit noir sur blanc
  « **Le délai court le rassure moins que l'absence de travail à fournir.** » Le
  copy mène partout par le délai et son point de départ ; « vous n'avez rien à
  préparer » n'apparaît jamais comme énoncé principal — il est toujours une
  subordonnée (« je les reprends de votre site actuel »), ou une réponse de FAQ
  en section 06. Un fait sur un compteur n'est pas un bénéfice ; ce que le
  lecteur achète, c'est de ne pas devoir y penser.
- **Réécriture** — hausser la conséquence au rang d'énoncé, une fois, tôt. En
  phrase de bascule du temps 2, ou en première ligne des spécifications du
  temps 3 :
  > **Ce que vous avez à préparer : rien. Les textes viennent de votre site
  > actuel, la maquette est proposée.**

  (`.agents/product-marketing.md` §5, ligne *Textes*.) Cette phrase-là est le
  différenciateur en langue de client.

### MA-5 — La grille de prix précède toutes les réponses aux objections

- **Où** : structure de la page, telle que la décrit `_inventaire.md`
  (01 Travaux · 02 Services · **03 Offres** · 04 Méthode · 05 Le studio ·
  06 Questions · 07 Contact).
- **Pourquoi** : critère « objections traitées avant le prix ». Le lecteur
  rencontre 699 / 1'499 / 2'499 avant d'avoir lu comment les 72 heures tiennent
  (Méthode 04), qui est derrière (Studio 05), et ce qui se passe s'il veut
  changer quelque chose (Questions 06). `_inventaire.md` le voit lui-même — il
  qualifie la réponse Q1 de « **la meilleure réponse du site, à remonter en haut
  de page** » — et `accueil.md` ne donne suite qu'à une recommandation d'ordre
  interne à la FAQ.
- **Réécriture** — sans toucher à la structure, ajouter sous le `h2` de la
  section Offres :
  > **Trois formules. Les prix sont écrits.**
  > **Le compteur démarre à votre feu vert : je reprends les textes de votre
  > site actuel, je ne vous attends pas. Deux allers-retours sont compris, et
  > vous payez à la livraison, une fois le site validé.**

  Et, pour boss-decision : remonter la Méthode au-dessus de la grille est le
  changement de structure au meilleur rapport effort / conversion de la page.

### MA-6 — Le chapô des Démonstrations sabote la section qu'il introduit

- **Où** : `copy/accueil.md` §B.1.
- **Texte** : « Cinq pièces faites par le studio pour montrer le travail. Aucune
  n'est un client : **le studio démarre, et sa première refonte de site de PME
  reste à faire.** Glissez la poignée pour comparer. »
- **Pourquoi** : l'honnêteté est obligatoire, l'auto-dénigrement ne l'est pas.
  Ne revendiquer aucune référence est une obligation ; annoncer « je n'ai jamais
  fait ça » à un prospect qui s'apprête à lire une grille de prix, dans la
  section censée porter la preuve, est un choix — et il coûte la vente. Le
  silence sur un négatif n'est pas une affirmation fausse : la règle de preuve
  du §8 interdit d'affirmer sans source, elle n'oblige pas à narrer ce qui
  manque.
- **Réécriture** :
  > **Cinq pièces faites par le studio pour montrer le travail — aucune n'est
  > un client. Glissez la poignée pour comparer l'avant et l'après.**

  Tout aussi honnête, et la section garde sa fonction.

### MA-7 — La dérision du site du prospect survit dans la pièce « avant »

- **Où** : `copy/accueil.md` §B.2, tableau de neutralisation.
- **Pourquoi** : le tableau retire les points d'exclamation et le numéro du
  compteur, et conclut « la pièce cesse d'être une blague aux dépens du
  lecteur ». Elle ne cesse pas : **« Site optimisé pour Internet Explorer 6 »**
  (relevé par `_inventaire.md` à `feature-carousel.tsx:318-327`) n'est pas
  corrigé et c'est la chute de la blague ; **« Compteur de visiteurs »**, même
  vidé de son nombre, reste l'objet moqué. Le positionnement §8 pose la règle en
  toutes lettres : « *Daté*, jamais *ridicule*. » Un prospect dont le site date
  de 2011 se reconnaît, et se sent visé.
- **Réécriture** : supprimer les deux lignes, sans remplacement.
  > `feature-carousel.tsx:326` — **ligne supprimée** *(le compteur, libellé
  > compris)*
  > `feature-carousel.tsx:318-327` — **retirer « Site optimisé pour Internet
  > Explorer 6 »**

  Le caractère daté de la pièce est porté par le dessin, la typographie et le
  cadre de fenêtre. Il n'a pas besoin d'être commenté ; commenté, il devient une
  moquerie.

### MA-8 — La pièce « La carte » est décrite comme fiction et comme seule preuve réelle

- **Où** : `copy/accueil.md` §B.2 ligne 1 (« Le Comptoir » → « Café Exemple »,
  `:216,302`) contre §H.3 (« La carte de restaurant est la seule preuve réelle
  du studio … Tant que l'accord n'est pas obtenu, la pièce « La carte » est une
  démonstration comme les autres »).
- **Pourquoi** : les deux ne peuvent pas être vrais. Soit la pièce du carrousel
  est une reconstitution fictive — et §H.3 se trompe en la présentant comme la
  preuve réelle du studio ; soit c'est le travail du client payant — et le
  renommer « Café Exemple » consiste à déguiser la seule preuve authentique du
  studio en démonstration inventée. C'est la pièce la plus précieuse du site :
  l'ambiguïté doit être levée avant l'apply, pas après.
- **Réécriture** — dépend de la réponse, donc les deux versions :
  > *Si la pièce est une reconstitution* : appliquer §B.2 tel quel, et corriger
  > §H.3, qui parle alors d'un travail **absent** du site.
  >
  > *Si la pièce est le travail du client réel, accord obtenu* : ne pas la
  > renommer, l'étiqueter — **« Carte de restaurant · travail réalisé pour un
  > client, publié avec son accord »** — et la sortir du lot des
  > démonstrations. C'est la seule ligne de preuve authentique disponible
  > aujourd'hui ; la fondre dans quatre fictions la gaspille.

---

## 4. Le hero — avis explicite, variante par variante

**Ma recommandation : la variante 2.** Je m'écarte de `copy-positionnement`, et
voici sur quoi.

**Ce que la variante 1 gagne** — elle écrit le point de départ dans le `h1`,
elle n'affirme rien sur le lecteur (donc elle ne peut pas se tromper sur lui),
et son rythme est juste : condition → délai → résultat, un fait par ligne.

**Ce qu'elle coûte** — trois choses, et la première décide :

1. **Elle ne dit pas ce qui est vendu.** « Vous dites oui » n'a de sens
   qu'après que le kicker et le sous-titre l'ont eu. C'est un `h1` qui emprunte
   sa clarté à ses voisins. Sur le premier critère de cette grille — quoi, pour
   qui, pourquoi maintenant — elle rend « pourquoi maintenant » et laisse
   « quoi » aux autres blocs.
2. **« Vous dites oui » est une posture de vendeur.** Demander le oui avant
   d'avoir décrit l'objet, c'est un levier de cohérence déclenché avant qu'il y
   ait quoi que ce soit à quoi être cohérent. Le guide §4 demande l'inverse :
   aucune emphase, on chiffre, on ne pousse pas.
3. **« Le site est en ligne » n'est pas la promesse.** Le prospect qualifié a
   déjà un site en ligne — c'est la définition même de l'ICP (§2). La ligne 3
   lui annonce donc un état qu'il possède déjà. Le repli « le site est refait »
   dit l'objet du contrat et gagne deux caractères : **il est meilleur que la
   ligne principale, et le document le présente comme une solution de secours de
   mise en page.** C'est une inversion à corriger même si la variante 1 est
   retenue.

**Ce que la variante 2 gagne** — « Un site qui reçoit / vos demandes, refait /
en 72 heures. » dit en cinq secondes ce que c'est, ce que ça fait, et en combien
de temps. Elle porte le pilier 2, dont la veille établit qu'il est **le seul
axe libre du panel** : « aucun des 6 ne livre, en standard, devis chiffré,
prise de rendez-vous ou assistant » et « l'objection *ce n'est qu'une vitrine*
n'est traitée nulle part ». Elle satisfait B3 par la moitié « livrable » de la
règle du §5. Et c'est la seule des trois dont aucune ligne ne touche les
21 caractères.

**Ce qu'elle coûte** — le point de départ. La critique du document est juste :
« refait en 72 heures » se lit spontanément « 72 heures après que j'aurai
envoyé mes affaires ». **Mais le sous-titre prévu pour elle est précisément
celui qui corrige cette lecture, en une phrase, dans la même unité visuelle** —
et cette phrase (« pas dès que vous m'envoyez vos textes ») est plus
différenciante que « Vous dites oui », parce qu'elle nomme l'attente par
défaut. Un `h1` complété par la ligne suivante est plus fort qu'un `h1` qui a
besoin de la ligne suivante pour être compris.

**La variante 3 est à écarter.** Elle conserve le défaut qui a fait rejeter
l'accroche actuelle : une affirmation sur le lecteur en première ligne. « A
vieilli » est plus doux que « a dix ans », mais c'est le même geste — on ouvre
en parlant de ce qui ne va pas chez lui. Et sa ligne 1 est à 21 caractères
pile, sans marge.

**Une précision d'arbitrage.** Le document met au crédit de la variante 2
qu'elle est « la seule à satisfaire les deux règles », dont celle des dix mots
au maximum pour un `h1`. Je n'ai retrouvé cette règle des dix mots ni dans
`CLAUDE.md`, ni dans le guide de voix. **Elle ne doit pas peser dans
l'arbitrage** : ma recommandation tient sur la clarté en cinq secondes, pas sur
un décompte de mots dont je n'ai pas trouvé la source.

**En résumé, par ordre de préférence :**

1. **Variante 2**, avec le sous-titre raccourci de MA-3.
2. **Variante 1 corrigée** — ligne 3 = « le site est refait. » (19) — avec le
   même sous-titre.
3. Variante 1 telle que proposée.
4. Variante 3 — à écarter.

---

## 5. Le différenciateur — avis explicite

**Il est porté souvent : neuf endroits.** Hero (implicite), sous-titre,
spécifications du temps 3 (« Départ du compteur : Votre feu vert »), bande
défilante, geste 01, titre de la Méthode, fait du Studio, FAQ Q1, pièce « Le
site », métadonnées. La fréquence n'est pas le problème — elle frise même la
tapisserie (voir MINEUR 8).

**Il est porté assez tôt : oui, dès le hero.** À une réserve près, et elle est
sérieuse : **dans l'appariement recommandé, il n'y est pas nommé** (MA-2).

**Un lecteur pressé le comprend-il ? Non, pas comme un différenciateur.**
Voici pourquoi, et c'est le fond de ma réponse.

« Le compteur démarre au feu vert » ne devient un avantage que si le lecteur
sait qu'ailleurs il démarre plus tard. Ce savoir, il ne l'a pas, et on ne peut
pas le lui donner en nommant qui que ce soit. Il n'existe donc que deux façons
de rendre le fait perceptible :

1. **Nommer l'attente par défaut, sans nommer personne** — « pas dès que vous
   m'envoyez vos textes ». C'est ce que fait le sous-titre des variantes 2 et 3,
   et c'est ce que fait la FAQ Q1, qui reste la meilleure phrase du site. C'est
   la bonne technique, et elle est conforme à B2 : elle décrit une croyance du
   lecteur, pas une pratique de concurrent.
2. **Dire la conséquence plutôt que le mécanisme.** « Le compteur démarre au feu
   vert » est un fait sur une horloge. Ce que le lecteur achète, c'est
   « **je n'ai rien à préparer** » — l'attente que le guide §2 classe elle-même
   en n°1. Le copy dispose du fait sourcé (§5, ligne *Textes*) et ne l'énonce
   jamais frontalement. C'est MA-4.

Sans ces deux appuis, « feu vert » se lit comme une précision contractuelle,
pas comme un avantage — et sept répétitions d'une précision contractuelle
n'en font pas un argument. **Ma conclusion : le différenciateur est assez
répété et pas assez traduit.** Deux corrections suffisent : le sous-titre de
MA-3 partout, et la phrase de MA-4 une fois, tôt.

---

## 6. Les 14 affirmations retirées — avis explicite

**Le site est plus crédible sans elles, et il ne perd presque rien.** Détail par
famille :

- **Les superlatifs (A.1, A.2)** — aucune perte. « Trois jours au lieu de trois
  mois » était la phrase qui pouvait coûter le plus cher pour ce qu'elle
  rapportait. Bien fermée, bien motivée.
- **Les fictions (D.1, D.2)** — aucune perte, un gain. Une référence inventée
  ne convainc que jusqu'à la première question.
- **Les affirmations devenues fausses (E.1, E.2, E.3)** — gain net. **E.2 est la
  meilleure ligne du livrable entier** : personne n'avait vu que les
  conversations de l'assistant sortent de Suisse pendant que la page de
  confidentialité affirme l'inverse. C'est un risque de fond, trouvé en lisant
  le code plutôt que le texte.
- **Le terme interdit (F.1)** — aucune perte, « la même personne » est meilleur.

**Ce qui se perd réellement tient en une famille : la réassurance de
réactivité.** « Réponse sous 24 h », « corrigé dans la journée », « devis en
cinq minutes » disaient tous la même chose au lecteur — *quelqu'un va me
répondre, et vite*. C'est l'attente n°3 du guide §2 (« il sera encore là »)
appliquée à l'immédiat. Les retirer toutes les trois laisse le site sans aucune
indication de réactivité, et les remplacements proposés comblent le vide par des
promesses de comportement tout aussi peu fondées (BL-5).

**Ma recommandation : n'en réintroduire qu'une, et pas comme une formule.** Un
délai de réponse que Boualem peut tenir un dimanche — « le jour ouvrable
suivant » plutôt que « sous 24 h » — écrit dans `.agents/product-marketing.md`,
puis affiché. Une seule, au formulaire, pas trois sur trois pages. Les deux
autres restent dehors : « corrigé dans la journée » n'a aucun abonné pour
l'étayer, et « devis en cinq minutes » entre en collision avec la seule promesse
de délai du site.

**Ce qui remplace légitimement la preuve sociale absente.** La question du
critère Leviers : le studio a un client et zéro référence de site. Cinq
substituts, par ordre de force, tous disponibles aujourd'hui :

1. **La démonstration en direct, et elle est sous-exploitée.** Le palier 3
   tourne sur ce site — assistant, alerte, tableau de bord (§5, encadré « Le
   palier 3 existe déjà »). C'est la **seule preuve que le visiteur peut
   vérifier lui-même, en un clic, sans croire personne**, et le copy la mentionne
   dans une puce de la troisième carte (« L'assistant de ce site, sur le
   vôtre »). Elle devrait être dite là où le visiteur est en train de
   l'utiliser : dans le sous-titre de l'assistant (voir la réécriture de BL-5),
   et une fois dans le hero. Aucune référence client ne ferait mieux qu'une
   preuve que le lecteur manipule.
2. **La limite nommée.** Deux allers-retours et pas trois. Une page, pas dix. La
   restauration hors de la grille. Une semaine si on part de zéro. Celui qui
   écrit ce qu'il ne fait pas est cru sur ce qu'il fait — et c'est **la seule
   réponse compatible avec B6 à la suspicion « pourquoi si peu cher »** :
   elle ne défend pas le prix, elle borne la prestation.
3. **La séquence de livraison.** « Vous voyez le site fini, vous validez, vous
   payez, je mets en ligne » (§E.2 de `accueil.md`) est une inversion du risque
   qui n'invente aucune garantie : le studio travaille avant d'être payé. C'est
   la phrase la plus persuasive de tout le livrable, et elle est enterrée à
   l'étape 03 de la section 04. Elle doit remonter (voir MA-5).
4. **L'identité vérifiable.** Un nom, une adresse, un numéro, des mentions
   légales complètes, à Genève. C'est exactement ce que les marqueurs
   `[PRÉNOM NOM — À COMPLÉTER]` et `NAP_CONFIRME = false` détruisent
   aujourd'hui : le prospect méfiant ouvre les mentions légales, et il y trouve
   un formulaire à trous. Ce n'est pas un détail administratif, c'est le
   substitut de preuve le moins cher à obtenir.
5. **L'étiquetage assumé.** « Démonstration » écrit à côté de la pièce. Honnête,
   suffisant — à condition de ne pas y ajouter le commentaire de MA-6.

---

## 7. MINEURS — 9

| # | Où | Texte | Pourquoi | Correction |
|---|---|---|---|---|
| 1 | `accueil.md` §C.3, geste 04 | « vous alerte sur votre téléphone **dans la seconde** » | §5 écrit « Alerte **instantanée** » ; « dans la seconde » est une latence chiffrée que rien ne mesure. | « … et vous alerte aussitôt sur votre téléphone. » |
| 2 | `accueil.md` §C.3, geste 03 | « … **et reçoit sa confirmation.** » | Fonction ajoutée sans source, dans la ligne même où la synchronisation d'agenda est retirée pour ce motif. §5 ne dit que « Prise de rendez-vous en ligne ». | Supprimer les quatre mots. |
| 3 | `accueil.md` §C.3, gestes 04 et 06 | 30 mots et 35 mots | Au-delà de 25 mots la phrase se relit. | Scinder : « Avec L'Assistant : un assistant formé sur vos prestations et vos tarifs répond jour et nuit. Il note le nom et le numéro, et vous alerte aussitôt. » |
| 4 | `_sans-preuve.md` §A.1, champ « Où » | « `.agents/product-marketing.md` §3, pilier 1 » | Citation périmée : le §3 corrigé porte désormais l'**interdiction** de ce superlatif, pas le superlatif. Un lecteur qui ouvre la référence trouve le contraire de ce qui est annoncé. | « §3, pilier 1 — où il figure aujourd'hui comme un interdit explicite. » |
| 5 | `_inventaire.md`, point ouvert 3 | « §5 fixe le suivi à 49.– / 129.–, §10 décision n°3 le décrit comme 89.–/mois » | **La contradiction n'existe plus.** Le §10 sur disque n'a plus de décision n°3, et le §5 porte un paragraphe « Pourquoi 49.– et pas 89.– » qui tranche. Envoyer Boualem arbitrer un point déjà arbitré coûte un aller-retour. | Supprimer le point ouvert 3. |
| 6 | `accueil.md` §E.3 | « … pas de sous-traitance : le studio est petit, **et c'est ce qui lui permet** d'être là … » | La charnière causale rouvre l'inférence de prix que B6 veut fermer : le trio bureaux / commerciaux / sous-traitance est la justification tarifaire classique, et « c'est ce qui lui permet » invite le lecteur à finir la phrase lui-même. | « Pas de bureaux, pas d'équipe commerciale, pas de sous-traitance. Le studio est une personne — la même le lendemain de la mise en ligne et le mois suivant. » |
| 7 | `accueil.md` §B.2, ligne 1 | « **Café Exemple** » | Deux majuscules et un article implicite : ça se lit encore comme une enseigne, donc comme une entreprise. | « **Un café — démonstration** », qui ne peut pas être pris pour un nom. |
| 8 | Tout le lot | « feu vert » × 7 visibles | Répété sept fois sur un écran et demi, le terme devient du décor et cesse d'être lu. | En garder trois : hero, Méthode, FAQ Q1. Ailleurs, la conséquence (« rien à préparer ») dit mieux la même chose. |
| 9 | `accueil.md` §F.3 | « **Envoyer mon site →** » | On n'envoie pas son site, on en donne l'adresse ; le bouton nomme une action que le formulaire ne fait pas. | « **Envoyer ma demande →** » — glossaire, entrée 6, et c'est exactement ce qui part. |

---

## 8. Mise en valeur — le meilleur et le plus faible, section par section

| Artefact / section | À garder tel quel | À corriger en premier |
|---|---|---|
| `voice-guide.md` | **La règle des 72 heures (§5)** : une contrainte formulée comme un test vérifiable (« au moins un des deux éléments dans la même unité de lecture »), donc applicable sans jugement. Rare. | §7, la table des CTA n'a pas d'entrée pour le bouton du formulaire — le copy a dû en inventer un (MINEUR 9). Ajouter la ligne. |
| `_inventaire.md` | Le tableau des codes de problème (`B1`…`DBL`) : 112 textes classés par une grille qu'on peut rejouer. C'est ce qui rend la revue possible. | Le point ouvert 3, devenu faux (MINEUR 5). |
| `accueil.md` — hero | Le temps 4 : « Un site ne se regarde pas. **Il fait entrer des demandes, ou il dort.** » Concret, glossaire, sans mise en cause. | Le `h1` recommandé et son sous-titre (MA-1, MA-2, MA-3). |
| `accueil.md` — Démonstrations | Le tableau de neutralisation §B.2 : treize substitutions précises, chacune motivée. | Le chapô qui annonce que la première refonte reste à faire (MA-6). |
| `accueil.md` — Services | Le geste 04 : « **Avec L'Assistant :** … » — deux mots qui transforment une sur-promesse en argument de palier. | Le geste 05 et son « souvent la seule chose qu'ils voient » (BL-4). |
| `accueil.md` — Offres | « **Trois formules. Les prix sont écrits.** » Un fait sur la page, non comparatif, non vertueux. Excellent. | Les notes sous la grille, qui taisent l'abonnement obligatoire (BL-1). |
| `accueil.md` — Méthode | « **Vous voyez le site fini, vous validez, vous payez, je mets en ligne.** » La meilleure phrase de persuasion du lot : une inversion du risque qui n'invente aucune garantie. | Sa position — étape 03 de la section 04, sous la grille (MA-5). |
| `accueil.md` — Questions | Le remplacement de Q5 par « **Qui fait le travail ?** », qui règle B1 et B6 d'un coup et conserve la phrase à garder mot pour mot. | Rien de bloquant. |
| `_chrome.md` | §4 : refuser de « rafraîchir » un message d'accueil déjà juste, et écrire pourquoi. C'est la discipline qui manque le plus souvent. | Le sous-titre de l'assistant (BL-5) — le texte le plus vu du site. |
| `mentions-legales.md` | Le refus explicite de rédiger une clause de droit applicable. Un agent qui s'arrête au bon endroit. | Rien ; la page dépend de Boualem, pas du copy. |
| `confidentialite.md` | **§2, le transfert des conversations hors de Suisse.** Trouvé dans `lib/llm.ts`, pas dans le texte. C'est la meilleure chose de toute la revue A. | Rien ; les trois points ouverts sont bien posés. |
| `_sans-preuve.md` | Le principe même du fichier, et la colonne « pour le réintroduire » : il transforme une liste de coupes en liste de décisions. | Deux entrées dont le remplacement réintroduit le même défaut (BL-5). |

---

## 9. Pour boss-decision — trois remarques hors périmètre du copy

**a) Le guide de voix est sain ; je ne demande pas à le rouvrir.** Une seule
lacune : sa table de CTA (§7) ne couvre pas le bouton du formulaire, ce qui a
obligé le copy à improviser. À compléter par `copy-positionnement`, pas par moi.

**b) La réserve B5 semble levée, et personne ne l'a constaté.** Son critère de
validation était : « La règle opérationnelle des 72 h — qui rédige les textes —
figure dans `.agents/product-marketing.md` ». Elle y figure désormais, §5,
« Les conditions », ligne *Textes*. **Mais le §10 du même document continue de
lister la décision n°2 (« Qui rédige les textes ») comme ouverte et bloquante.**
Le positionnement se contredit sur le point qui porte sa promesse principale.
À trancher avant G2 : soit B5 est levée et §10 n°2 se ferme, soit la règle du §5
n'engage pas et la promesse de 72 h n'a toujours pas de moyen écrit (test T4 de
la porte G1, marqué « bloquant pour G2 »).

**c) La recommandation finale du mémo G1 est devenue caduque.** Elle proposait
d'inscrire la grille « comme prix d'amorçage à revoir ». La décision de Boualem
a depuis fermé toute mention de tarif de lancement. Le copy ne l'a pas reprise —
c'est correct — mais le mémo G1 reste lisible comme un référentiel actif par le
prochain agent. À marquer comme caduc dans le dossier.

---

## 10. VERDICT : À CORRIGER

**Destinataire : `copy-positionnement`, tour 2.**

Le livrable est sérieux et sa direction est juste : les trois décisions fermées
sont respectées sans exception, les décomptes techniques sont exacts, la
discipline de source est réelle, et deux trouvailles (le transfert hors de
Suisse, la séquence de livraison) valent à elles seules la revue. Ce qui bloque
n'est pas le jugement de l'agent — c'est qu'il a appliqué sa propre règle de
preuve moins sévèrement à ses réécritures qu'aux textes qu'il corrigeait, et
qu'un point de contrat matériel (l'abonnement du palier 3) n'a été vu par
personne.

### Liste numérotée des corrections

| # | Gravité | Correction |
|---|---|---|
| 1 | BLOQUANT | Écrire l'abonnement obligatoire de L'Assistant (129.–/mois TVA comprise, 2ᵉ année) sur la grille et sur la carte du palier 3 (BL-1). |
| 2 | BLOQUANT | Retirer « sans abonnement obligatoire » du chapô de la Carte du studio (BL-2). |
| 3 | BLOQUANT | Retirer le prix du hero, ou lui adjoindre « TVA comprise » (BL-3). |
| 4 | BLOQUANT | Sourcer ou retirer « souvent la seule chose qu'ils voient » (BL-4). |
| 5 | BLOQUANT | Remplacer « Ayoub lit tout, et répond lui-même » et « Je vous réponds personnellement » par des faits d'architecture (BL-5). |
| 6 | MAJEUR | Trancher le hero : variante 2 recommandée ; à défaut, variante 1 avec « le site est refait. » (MA-1). |
| 7 | MAJEUR | Un seul sous-titre de hero, celui qui nomme le feu vert, raccourci à 30 mots (MA-2, MA-3). |
| 8 | MAJEUR | Énoncer une fois, tôt, « ce que vous avez à préparer : rien » (MA-4). |
| 9 | MAJEUR | Ajouter la ligne de crédibilité au-dessus de la grille de prix (MA-5). |
| 10 | MAJEUR | Retirer « sa première refonte de site de PME reste à faire » du chapô (MA-6). |
| 11 | MAJEUR | Supprimer « Internet Explorer 6 » et le compteur de visiteurs (MA-7). |
| 12 | MAJEUR | Lever l'ambiguïté sur la pièce « La carte » : fiction, ou preuve réelle (MA-8). |
| 13 | MINEUR | Les neuf finitions du §7. |

Au tour 2, je conclus OK ou j'escalade à `boss-decision`. Il n'y a pas de
tour 3.
