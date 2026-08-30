# Revue A — tour 2 — guide de voix et copy du site

**Objet :** `docs/agents/brand/voice-guide.md`, `docs/agents/copy/accueil.md`,
`copy/_chrome.md`, `copy/_inventaire.md`, `copy/_sans-preuve.md`,
`copy/mentions-legales.md`, `copy/confidentialite.md`
**Référentiels relus sur disque :** `.agents/product-marketing.md`, `CLAUDE.md`,
`docs/agents/veille/synthese.md`
**Comparaison :** `docs/agents/reviews/psy-A-copy-tour1.md` et
`docs/agents/_archive/2026-08-30-tour1/`
**Date :** 2026-08-30 · **Verdict : ESCALADE vers `boss-decision`**
**1 bloquant · 4 majeurs · 7 mineurs · note 33 / 40** *(tour 1 : 5 / 8 / 9 —
24 / 40)*

> Périmètre de lecture. `app/` et `components/` n'ont pas été ouverts : un agent
> de performance y travaille, et l'inventaire du tour 1 fait foi, comme la
> délégation le pose. `lib/` n'était pas interdit et je m'y suis servi une fois,
> pour trancher un point ouvert que `copy-positionnement` avait laissé ouvert
> faute d'accès — c'est le MAJEUR 1. Tout le reste s'appuie sur les artefacts et
> les référentiels.

---

## Ce que j'ai vérifié moi-même, avant de noter

**1. Les décomptes.** Recomptés caractère par caractère et mot par mot, sans
faire confiance aux chiffres annoncés :

| Élément | Annoncé | Mesuré | Contrainte |
|---|---|---|---|
| `h1` ligne 1 — « Un site qui reçoit » | 18 | **18** | ≤ 21 ✓ |
| `h1` ligne 2 — « vos demandes, refait » | 20 | **20** | ≤ 21 ✓ |
| `h1` ligne 3 — « en une semaine. » | 15 | **15** | ≤ 21 ✓ |
| Sous-titre du hero | 30 mots | **30 mots** | ✓ |
| Variante longue du sous-titre | 38 mots | **38 mots** | ✓ |
| `title` | 56 car. | **56 car.** | ✓ |
| `meta description` | 152 car. | **152 car.** | ✓ |
| `og` / `twitter description` | 190 car. | **190 car.** | ✓ |

**Sept décomptes annoncés sur sept sont exacts**, et aucune ligne du `h1` ne
touche le plafond — la variante retenue garde une marge de 1, 1 et 6 caractères.
C'est la vérification qui casse le plus de mises en page ; elle est propre pour
le deuxième tour d'affilée.

**2. Une correction que je dois à `copy-positionnement`, et je la prends.** Il
relève que ma réécriture MA-3 du tour 1, que j'annonçais à « 30 mots », en fait
**38** — soit le décompte exact du sous-titre que je lui reprochais. Recompté :
il a raison, j'avais tort. Le défaut du tour 1 n'était donc pas la longueur mais
le nombre d'idées, et sa réécriture est meilleure que la mienne parce qu'elle
coupe ce qui est écrit ailleurs au lieu d'abréger ce qui doit être prouvé.
Le dire ici est le minimum : une revue qui ne s'applique pas sa propre règle de
vérification ne vaut rien.

**3. Les décisions fermées — balayage complet de `copy/` et `brand/`.**

- **Grille 699 / 1'499 / 2'499 TVA comprise, sans tarif de lancement ni prix
  barré.** Zéro occurrence de « lancement », « amorçage », « prix barré »,
  « −31 % », ni d'aucun prix de référence. **Conforme.**
- **Aucun concurrent nommé.** Zéro occurrence des six noms du panel ni des huit
  écartés, dans aucun artefact. **Conforme.**
- **Aucune phrase affirmant que personne ne fait aussi vite.** Les seules
  occurrences de « le seul », « personne d'autre », « le plus rapide », « aucun
  concurrent » sont dans des interdictions du guide ou dans la prose de
  justification. Aucune dans un bloc APRÈS. **Conforme.**
- **Aucun délai en heures.** 70 occurrences de « 72 h / 48 h / 24 h / trois
  jours » relevées dans les artefacts : **toutes** sont en bloc AVANT, en
  interdiction, en citation de veille ou en justification. **Zéro dans un texte
  proposé au public.** C'est la substitution la plus lourde du tour, et elle est
  totale. **Conforme.**
- **21 caractères par ligne de `h1`.** Vérifié ci-dessus. **Conforme.**
- **« votre feu vert » plafonné à quatre occurrences** (glossaire, entrée 5) :
  exactement quatre dans les blocs APRÈS — sous-titre du hero, chapô des Offres,
  titre de la Méthode, FAQ Q1. **Conforme**, sous réserve du MINEUR 6.
- **Aucun prix sans « TVA comprise » dans la même unité de lecture** : vérifié
  prix par prix. Un seul cas douteux, le MAJEUR 2.

**4. Les 22 constats du tour 1.** Vérifiés un par un, texte en main. **22 sur 22
sont traités**, et aucun ne l'est de façon formelle : chacun porte une
réécriture appliquée et son motif. Le tableau du §2 donne le détail.

---

## 1. Grille — 8 critères

| # | Critère | Tour 1 | **Tour 2** | Justification en une ligne |
|---|---|---|---|---|
| 1 | **Clarté en 5 secondes** | 3 | **4** / 5 | Le `h1` dit enfin quoi, ce que ça fait et en combien de temps ; le sous-titre ajoute pour qui, le bénéfice n°1 et le prix en 30 mots. Reste que le plus grand caractère du site redit le délai — le fait le moins différenciant — par décision fermée, assumée comme un coût. |
| 2 | **Hiérarchie de la valeur** | 3 | **4** / 5 | Le bénéfice n°1 est passé en énoncé principal à quatre endroits, et l'inversion du risque (« vous voyez le site fini, vous validez, vous payez ») est remontée au-dessus du prix. La grille précède toujours structurellement la Méthode, l'agence et les Questions : palliée par un chapô, pas résolue — et l'agent le dit lui-même. |
| 3 | **Leviers** | 2 | **4** / 5 | Les trois leviers sans source sont morts et rien ne les remplace en contrebande ; la seule preuve manipulable — le palier 3 qui tourne sur ce site — est enfin dite là où le visiteur s'en sert et là où il lit le prix. Plafond à 4 : zéro preuve sociale, et la seule preuve authentique de l'agence est encore sur une branche non tranchée. |
| 4 | **Friction** | 3 | **4** / 5 | Sous-titre à 30 mots et trois idées, phrases de plus de 25 mots scindées, CTA en verbe + bénéfice y compris le bouton du formulaire. Contre : la note sous la grille porte une phrase de 33 mots, et le sous-titre de l'assistant renvoie à une liste que le lecteur n'a pas encore lue. |
| 5 | **Objections** | 3 | **4** / 5 | Q1 gagne la phrase-conséquence, Q5 devient « Qui fait le travail ? », l'abonnement obligatoire est dit avant le bouton d'achat. Mais une objection est mal répondue — ce que couvre le suivi (BLOQUANT) — et l'ordre des sections est inchangé. |
| 6 | **Spécificité** | 4 | **5** / 5 | Le meilleur critère du lot. Sept décomptes exacts sur sept, « à 23 h comme le dimanche », « 85 × 55 », « deux allers-retours », jalons en moments de semaine plutôt qu'en heures. Les deux précisions non mesurées du tour 1 (« dans la seconde », « reçoit sa confirmation ») sont parties. |
| 7 | **Cohérence avec le guide** | 4 | **4** / 5 | Zéro concurrent, zéro compte d'heures, zéro superlatif, glossaire appliqué entrée par entrée, plafond de « feu vert » tenu au nombre près, renommage inventorié en dix lignes. Contre : un onzième texte de renommage manqué (MAJEUR 1), l'énumération du glossaire entrée 5 périmée par le repli, et trois citations devenues fausses. |
| 8 | **Éthique** | 2 | **4** / 5 | Le prix mensuel obligatoire est écrit trois fois dont deux au point de décision, « sans abonnement obligatoire » est mort sans remplaçant, la dérision est retirée à la source, l'auto-dénigrement aussi. Et la section G de `_sans-preuve.md` est un audit de ses propres phrases, ce qui est rare et mérite d'être dit. Contre : une affirmation sur ce que couvre le suivi qui est fausse pour deux formules sur trois. |

**Total : 33 / 40 = 4,1** *(tour 1 : 24 / 40 = 3,0).*

---

## 2. Les 22 constats du tour 1, un par un

| # | Constat | Traité ? | Où, et ce que j'ai vérifié |
|---|---|---|---|
| 1 | BL-1 abonnement obligatoire de L'Assistant | **OUI** | §D.2 (note sous la grille), §D.3 (dernière puce de la carte, donc **au-dessus du bouton d'achat**), §E.4 Q3. Le montant, le caractère obligatoire, la date de départ et « TVA comprise » sont écrits aux deux endroits où la décision se prend. Voir MAJEUR 2 pour la troisième occurrence. |
| 2 | BL-2 « sans abonnement obligatoire » | **OUI** | §D.5. Retiré, **et rien ne le remplace** — c'était la bonne réponse : « l'agence reste là » porte le pilier 3 sans condition. Zéro occurrence résiduelle au balayage. |
| 3 | BL-3 prix dans le hero sans TVA | **OUI** | §A.6, temps 3 : « Suivi : Dès 49.–/mois » devient « Suivi : à partir de la 2ᵉ année ». Le seul prix restant du hero est dans le sous-titre, avec « TVA comprise » dans la même phrase. |
| 4 | BL-4 « souvent la seule chose qu'ils voient » | **OUI** | §C.3 geste 05. La quantification implicite part, l'idée reste, adossée au §2 du positionnement mot pour mot. |
| 5 | BL-5 deux promesses de comportement | **OUI** | §F.1 et `_chrome.md` §3, remplacées par des faits d'architecture. Voir MINEURS 3 et 4 pour deux résidus. |
| 6 | MA-1 le `h1` | **OUI** | §A.1, variante 2 avec « en une semaine ». Décidé, en production, non rouvert ici. |
| 7 | MA-2 le sous-titre nomme le feu vert | **OUI** | §A.2. Le terme de glossaire entre dans l'écran d'accueil, une fois. |
| 8 | MA-3 longueur du sous-titre | **OUI** | 30 mots réels, vérifiés. Et l'erreur de décompte est la mienne, pas la sienne. |
| 9 | MA-4 « rien à préparer » en énoncé principal, tôt | **OUI** | §A.2 (sous-titre, donc premier écran), §D.1, §C.3 geste 01, §E.4 Q1. C'est la correction la plus importante du tour. |
| 10 | MA-5 la crédibilité avant le prix | **OUI** | §D.1, chapô sous le `h2` des Offres, qui remonte la séquence de livraison. |
| 11 | MA-6 auto-dénigrement du chapô | **OUI** | §B.1. « Aucune n'est un client » dit tout ce que le droit exige, sans annoncer qu'on n'a jamais fait le travail. |
| 12 | MA-7 Internet Explorer 6 et le compteur | **OUI** | §B.2, lignes 12 et 13 : supprimées, libellés compris, sans remplacement. |
| 13 | MA-8 ambiguïté sur « La carte » | **OUI, en tant que tâche de copy** | §B.4 pose les deux réécritures et nomme la décision. Voir MAJEUR 3 pour la cascade non prescrite, et §9 pour mon cadrage. |
| 14 | MINEUR 1 « dans la seconde » | **OUI** | §C.3 geste 04 ; consigné en `_sans-preuve.md` C.6. |
| 15 | MINEUR 2 « et reçoit sa confirmation » | **OUI** | §C.3 geste 03 ; consigné en C.7. |
| 16 | MINEUR 3 phrases de 30 et 35 mots | **OUI** | §C.3 gestes 04 et 06, scindées. |
| 17 | MINEUR 4 citation périmée de `_sans-preuve` §A.1 | **OUI** | Corrigée, avec la mention explicite que le §3 porte aujourd'hui l'interdit. |
| 18 | MINEUR 5 point ouvert 3 de l'inventaire | **OUI** | Supprimé, avec le motif. |
| 19 | MINEUR 6 charnière causale de prix | **OUI** | §E.3 ; consigné en G.4. Voir §11 a) : le référentiel a bougé sous cette correction. |
| 20 | MINEUR 7 « Café Exemple » | **OUI** | « Un café — démonstration », qui ne peut pas être lu comme une enseigne. |
| 21 | MINEUR 8 « feu vert » × 7 | **OUI** | Plafond écrit dans le glossaire (entrée 5) **et** tenu : quatre occurrences exactement. |
| 22 | MINEUR 9 « Envoyer mon site » | **OUI** | §F.3, et la ligne manquante est ajoutée à la table des CTA du guide §7. |

**22 sur 22.** Je n'ai trouvé aucun constat traité en apparence seulement.

---

## 3. Les cinq bloquants du tour 1 sont-ils morts ? — avis explicite

**Oui, les cinq.** Le point que la délégation demande de vérifier en priorité —
l'abonnement à 129.–/mois — mérite un examen à part, parce que c'est celui qui
pouvait le plus facilement être traité de façon cosmétique.

**Il ne l'est pas.** Le test n'est pas « le chiffre apparaît-il quelque part »,
c'est « apparaît-il là où la décision d'achat se prend, avant le geste
d'achat ». Trois occurrences, dans cet ordre de valeur :

1. **Sur la carte de L'Assistant, en dernière puce, donc entre le prix de
   2'499.– et le bouton « Automatiser mes demandes »** (§D.3). C'est la seule
   position qui compte : le lecteur ne peut pas cliquer sans l'avoir traversée.
   Elle porte les quatre éléments nécessaires — le montant, le mot
   **obligatoire**, la date de départ (2ᵉ année, la première comprise) et
   « TVA comprise ».
2. **Sous la grille** (§D.2), où le lecteur compare les trois formules, avec la
   distinction 49.– / 129.– et la raison (« qui ne tourne pas sans lui »).
3. **En FAQ Q3** (§E.4), qui est le dernier endroit de vérification.

Les deux premières sont des points de décision, la troisième est un filet.
L'exigence du guide (§3, pilier 3 : « il s'écrit à deux endroits au moins : sur
la carte de la formule, et sous la grille ») est tenue à la lettre. **BL-1 est
mort, et il est mort bien** : la formulation « c'est ce qui fait tourner
l'assistant » transforme la condition en argument, ce qui est le seul traitement
qui ne coûte pas la vente. Reste une vérification de deux mots à faire à
l'apply — MAJEUR 2.

Les quatre autres sont morts sans réserve, et deux le sont mieux que ce que je
demandais : BL-2 est retiré **sans remplacement**, ce qui est plus fort que
n'importe quelle reformulation ; BL-5 est remplacé par un fait d'architecture
**qui porte en plus la démonstration du produit**, ce qui convertit une
correction défensive en argument de vente.

---

## 4. La section G — les six affirmations retirées par l'agent lui-même

La question de la délégation : avait-il raison, ou s'est-il coupé un bras ?

**Précision d'honnêteté avant de répondre : les six sont des retraits que j'ai
demandés au tour 1.** La question porte donc autant sur mon jugement que sur le
sien. Je les reprends une par une, en me demandant à chaque fois ce que le site
perd.

| Entrée | Retrait justifié ? | Ce que le site perd | Verdict |
|---|---|---|---|
| **G.1** « Ayoub lit tout, et répond lui-même » | **Oui, sans réserve.** Promesse de comportement à la position la plus vue du site. | **Rien — il gagne.** Le remplacement (« Vous utilisez L'Assistant, la troisième formule. Ayoub voit la conversation. ») fait deux choses là où l'original en faisait une mal : il rassure *et* il fait faire au lecteur l'essai gratuit du produit à 2'499.–. | **Gain net.** |
| **G.2** « Je vous réponds personnellement » | **Oui.** Même défaut, même habillage. | **Rien.** La substance est conservée (« Il arrive chez Ayoub, pas dans une boîte partagée ») et le délai revient, cette fois sourcé. | **Gain net.** |
| **G.3** « et souvent la seule chose qu'ils voient » | **Oui.** Affirmation générale sur le comportement du marché, absente des deux référentiels. | **Un peu.** C'était le levier d'aversion à la perte le plus fort de la ligne, et « ce que voient les gens qui cherchent votre métier à Genève » est plus plat. Mais l'idée survit et le fait est sourcé mot pour mot. | **Échange correct, coût réel mais faible.** |
| **G.4** « et c'est ce qui lui permet » | **Oui pour la charnière.** Une justification de prix attire l'attention sur le doute qu'elle veut dissiper. | **Rien dans le texte — mais le motif a vieilli.** Voir §11 a) : le positionnement assume désormais publiquement le lien de causalité que la réserve B6 interdit d'écrire. Personne n'a réconcilié les deux. | **Correct comme copy, à réconcilier au niveau du référentiel.** |
| **G.5** « sans abonnement obligatoire » | **Oui, impérativement.** L'affirmation était fausse pour un tiers de la grille. | **Rien.** Et le retrait a produit un gain : la condition tue est devenue un argument dit deux fois. | **Le meilleur retrait du lot.** |
| **G.6** « sa première refonte reste à faire » | **Oui.** L'honnêteté est obligatoire, l'auto-dénigrement est un choix. | **Rien.** « Aucune n'est un client » satisfait le droit et laisse la section faire son travail. | **Gain net.** |

**Conclusion : il ne s'est pas coupé un bras.** Cinq des six retraits sont des
gains nets ou quasi nets ; le sixième est correct dans le texte et laisse une
question ouverte qui n'est pas la sienne.

**Et le seul bras que le tour 1 avait réellement coupé a été recousu.** Les
28 retraits laissaient le site sans aucune indication de réactivité — c'est la
perte que je signalais au tour 1. Une seule est réintroduite, « réponse le jour
ouvrable suivant », au seul endroit qui compte (l'accusé de réception), et elle
est désormais **inscrite au §5 du positionnement**. C'est la bonne dose : une,
pas trois. La discipline est réelle.

---

## 5. Le sous-titre du hero — avis explicite

> « Sites de PME à Genève. Vous n'avez rien à préparer — je reprends les textes
> de votre site actuel, et le délai court dès votre feu vert. Dès 699.–, TVA
> comprise. »

**Le décompte tient : 30 mots exactement**, recomptés. Et 21 mots pour la phrase
centrale, sous le seuil de relecture.

**Est-ce suffisant ? Oui.** C'est la meilleure correction du tour, et voici
pourquoi elle marche plutôt que pourquoi elle est jolie :

1. **Le bénéfice n°1 est en énoncé principal, en position 6 sur 30.** Le guide
   §2 écrit que « le délai le rassure moins que l'absence de travail à
   fournir » ; c'est la première fois que le site le dit en clair, et il le dit
   avant le prix. Un gérant qui ne lit que la première ligne du sous-titre a
   déjà l'argument qui décide.
2. **Le mécanisme suit dans la même phrase.** Sans « je reprends les textes de
   votre site actuel », « vous n'avez rien à préparer » serait une promesse de
   plus, du genre « clé en main » que le glossaire interdit. Avec lui, c'est un
   fait vérifiable en achetant. La conséquence devant, le mécanisme derrière :
   c'est exactement la technique 1 du guide §3.
3. **Il rattrape ce que le `h1` a perdu.** « Refait en une semaine » se lit
   spontanément « une semaine après que j'aurai envoyé mes affaires » ; « le
   délai court dès votre feu vert » corrige cette lecture dans la même unité
   visuelle. Un `h1` complété par la ligne suivante est plus fort qu'un `h1` qui
   a besoin d'elle pour être compris — et c'est ici le premier cas.
4. **La règle du délai est tenue par le couple.** « une semaine » vit dans le
   `h1`, son point de départ et l'absence de travail à fournir dans le
   sous-titre : la règle §5 du guide est satisfaite par la moitié « point de
   départ », deux fois plutôt qu'une.
5. **La conformité TVA est réglée dans la phrase**, ce qui ferme BL-3 sans
   dépendre d'une mention deux écrans plus bas.

**Ce qu'il coupe, et pourquoi la coupe est bonne.** L'énumération des trois
fonctions (devis, rendez-vous, fiche Google) disparaît. Elle est écrite deux
fois dans le même écran — la bande défilante juste dessous la garde (§C.1 :
« Refonte de site · Demande de devis · Prise de rendez-vous · Fiche Google ») et
le temps 2 du hero animé aussi. J'ai vérifié que la réécriture de la bande la
conserve : la justification tient, ce n'est pas une coupe à l'aveugle. Et le
`h1` porte déjà « qui reçoit vos demandes », donc le pilier 2 n'est pas perdu au
premier regard, seulement détaillé plus tard.

**La seule chose que je réserve** est le repli du chiffre géant, qui est
désormais le texte retenu et qui a une conséquence mécanique sur ce sous-titre :
voir MINEUR 6. Ce n'est pas un défaut du sous-titre.

---

## 6. BLOQUANT — 1

### BL-A — La Méthode dit que le suivi couvre les modifications de contenu ; c'est faux pour deux formules sur trois, et la FAQ de la même page dit le contraire

- **Où** : `copy/accueil.md` §E.2, étape 04 de la Méthode
  (`Methode.tsx:18`) — contre §E.4, Q4 (`Faq.tsx:31`), sur la **même page**.
- **Texte concerné** :
  > Ensuite · Le suivi · « Un tarif change, une prestation s'ajoute, un horaire
  > bouge ? Un message, et je corrige. **C'est ce que couvre le suivi, à partir
  > de la 2ᵉ année.** »
- **Pourquoi.** `.agents/product-marketing.md` §5, « Le récurrent », est
  explicite et tabulé : le suivi à **49.–/mois** (La Vitrine, Le Site) couvre
  « hébergement, nom de domaine, mises à jour, sauvegardes, sécurité » — **pas**
  les modifications de contenu ; celles-ci ne figurent que dans la ligne
  **129.–/mois** de L'Assistant (« Idem + assistant IA + **modifications de
  contenu incluses** »). Or « un tarif change, une prestation s'ajoute, un
  horaire bouge » *est* une modification de contenu, et la phrase la déclare
  couverte sans qualifier la formule. Pour les deux tiers de la grille, elle
  annonce comme compris quelque chose qui sera facturé.

  C'est **exactement le défaut de BL-2**, dans l'autre sens : une affirmation
  précise qui dit le contraire du contrat, au moment où le lecteur se projette
  après la livraison. Et elle est **contredite cent lignes plus loin par la Q4
  du même fichier**, qui, elle, applique la bonne règle : « Les modifications de
  contenu sont comprises dans le suivi de L'Assistant ; sur les deux autres
  formules, elles sont facturées à la demande. » Deux versions sur une même page,
  donc aucune ne fait foi — c'est le motif `DBL` que l'agent applique
  correctement partout ailleurs. Le jugement n'est pas en cause : la règle juste
  est écrite dans le même livrable. C'est une glissade de cohérence, mais elle
  se lit par un acheteur, et elle porte sur une facture.
- **Réécriture** — aligner la Méthode sur la FAQ, en gardant le rythme court des
  jalons :
  > **Ensuite · Le suivi · Un tarif change, une prestation s'ajoute, un horaire
  > bouge ? Un message, et je corrige — compris dans le suivi de L'Assistant,
  > facturé à la demande sur les deux autres formules.**

  *(20 mots. La formule nommée transforme une promesse fausse en argument de
  palier, exactement comme « Avec L'Assistant : » au geste 04.)*
- **Preuve** : `.agents/product-marketing.md` §5, « Le récurrent », tableau,
  lignes 232-233 ; `copy/accueil.md` §E.4, Q4, qui porte déjà la formulation
  correcte.

---

## 7. MAJEURS — 4

### MA-A — Le renommage « studio → agence » compte onze textes, pas dix : le prompt de l'assistant est le onzième, et c'est le seul qui parle sans être relu

- **Où** : `lib/chat-prompt.ts:43`, absent du tableau §I de `copy/accueil.md` et
  laissé en point ouvert non résolu dans `copy/_chrome.md`.
- **Ce que j'ai vérifié.** `_chrome.md` conclut son point ouvert par « à
  vérifier avant l'apply » — l'agent n'avait pas accès au fichier. `lib/` n'était
  pas dans mon interdit, je l'ai ouvert. Résultat, en deux moitiés :
  - **Le délai y est déjà correct** : ligne 61, « Délais : une semaine, refonte
    comme départ de zéro » ; lignes 63-64, l'interdiction des comptes d'heures
    est même écrite dans le prompt. **Cette moitié du point ouvert est close** —
    `_chrome.md` peut la retirer.
  - **La catégorie ne l'est pas** : ligne 43, « Tu es l'assistant de Nawa Corps,
    **studio digital** à Genève tenu par Ayoub. »
- **Pourquoi c'est majeur.** Le §I pose lui-même le critère : « Dix textes
  visibles sont concernés, et ils doivent changer **ensemble**, sinon le site
  annonce deux catégories d'un écran à l'autre. » Le texte manquant est
  précisément celui qui produira cette contradiction, et il est pire que les dix
  autres pour trois raisons : il est **génératif** (il ne dit pas la phrase une
  fois, il la reformule à chaque conversation), il est **conversationnel** (le
  lecteur pose une question et reçoit une réponse contradictoire, ce qui se
  remarque bien plus qu'un libellé), et il est **non relu** — l'agent le dit
  lui-même : « l'assistant est le seul texte du site qui parle sans être relu ».
  Ajouté à cela, le prompt est aussi la source du discours commercial de
  l'assistant : une catégorie fausse s'y propage à tout ce qu'il dit de l'agence.
- **Réécriture** :
  > `lib/chat-prompt.ts:43` — **« Tu es l'assistant de Nawa Corps, agence
  > digitale à Genève tenue par Ayoub Bensalem. »**

  Et ajouter la ligne au tableau §I, qui passe à **onze textes** :
  > | 11 | `lib/chat-prompt.ts:43` | studio digital à Genève | **agence digitale
  > à Genève** |

  *(Le commentaire de tête du même fichier, ligne 11, dit encore « du studio » —
  hors texte public, mais `CLAUDE.md` pose qu'un commentaire devenu faux est un
  bug. À corriger dans le même geste.)*
- **Preuve** : `.agents/product-marketing.md` §1 ; `copy/accueil.md` §I ;
  `copy/_chrome.md`, point ouvert.

### MA-B — Le troisième « 129.–/mois » est ajouté en FAQ sans « TVA comprise » dans son énoncé

- **Où** : `copy/accueil.md` §E.4, Q3, phrase ajoutée en fin de réponse.
- **Texte concerné** : « Avec L'Assistant, **le suivi à 129.–/mois** n'est pas
  optionnel : c'est lui qui paie les appels du modèle et qui fait que l'assistant
  répond encore la deuxième année. »
- **Pourquoi.** `CLAUDE.md`, Interdits : « Aucun prix affiché sans la mention
  **TVA comprise** », et le guide §8, règle 3, précise que la règle vaut **par
  unité de lecture**. Les deux autres occurrences du 129.– la portent (§D.2,
  §D.3) ; celle-ci ne la porte pas. Elle est peut-être couverte par le corps de
  la réponse Q3, qui cite déjà 49.– et 129.– — mais **je ne peux pas le
  vérifier** : `components/Faq.tsx` n'est pas ouvrable et l'inventaire ne relève
  pas la chaîne complète. C'est pourquoi ce n'est pas un bloquant : c'est un
  risque non levé, pas une faute constatée. Il se lève en deux mots et il ne
  devrait pas dépendre d'une lecture au moment de l'apply.
- **Réécriture** :
  > **Avec L'Assistant, le suivi à 129.–/mois TVA comprise n'est pas optionnel :
  > c'est lui qui paie les appels du modèle et qui fait que l'assistant répond
  > encore la deuxième année.**

  *(Et, à l'apply : relire la réponse Q3 entière et ajouter la mention aux deux
  montants qui y figurent déjà si elle n'y est pas.)*
- **Preuve** : `CLAUDE.md`, Interdits ; guide §8, règle 3 ; guide §10,
  entrée 15.

### MA-C — Si « La carte » est le travail d'un vrai client, le chapô de la section devient faux, et la cascade n'est pas prescrite

- **Où** : `copy/accueil.md` §B.1 (chapô) contre §B.4, branche « travail du
  client payant ».
- **Textes concernés** :
  > §B.1 — « **Cinq pièces** faites par l'agence pour montrer le travail —
  > **aucune n'est un client.** Glissez la poignée pour comparer l'avant et
  > l'après. »
  >
  > §B.4, branche B — « la pièce **sort du lot des démonstrations** ».
- **Pourquoi.** Les deux ne peuvent pas être appliqués ensemble : si la pièce
  sort du lot, elles ne sont plus cinq, et « aucune n'est un client » devient
  faux au moment précis où la pièce voisine est étiquetée « travail réalisé pour
  un client ». Une contradiction sur le même écran, dans la section qui porte la
  preuve — c'est-à-dire l'endroit du site où la crédibilité se gagne ou se perd
  entièrement. L'agent a repéré une cascade (`mentions-legales.md` §3, dont la
  phrase « les établissements qui y figurent sont fictifs » deviendrait fausse,
  et il le dit) et manqué celle-ci, qui est plus visible.
- **Réécriture** — chapô de la branche B, à tenir prêt à côté des deux autres :
  > **Quatre pièces faites par l'agence pour montrer le travail — aucune n'est
  > un client. La cinquième, la carte de restaurant, a été réalisée pour un
  > client et est publiée avec son accord. Glissez la poignée pour comparer
  > l'avant et l'après.**

  *(La distinction, dite en une phrase, est plus persuasive que le silence : le
  lecteur constate que l'agence sépare ce qu'elle a fait de ce qu'elle a
  simulé.)*
- **Preuve** : `.agents/product-marketing.md` §6, tableau des preuves et « Règle
  absolue » ; guide §8, interdits 1 et 2.

### MA-D — « Pas de sous-traitance » est écrit sans qualification alors qu'une ligne de l'offre est produite par un partenaire

- **Où** : `copy/accueil.md` §E.3, section « L'agence » (`Studio.tsx:17`).
- **Texte concerné** : « **Pas de bureau, pas d'équipe commerciale, pas de
  sous-traitance.** L'agence est une personne — la même le lendemain de la mise
  en ligne et le mois suivant. »
- **Pourquoi.** Le positionnement §7 décrit la production réseaux sociaux comme
  vendue « sur devis, cas par cas. **Le partenaire pose son prix, l'agence
  ajoute le sien**, l'écart est la marge. L'agence reste l'interlocuteur du
  client. » C'est une production confiée à un tiers, et la prestation figure au
  catalogue (§5, « Réseaux sociaux — sur devis »), donc sur la carte de
  l'agence. L'affirmation est vraie pour les sites — le lecteur d'un site la lit
  correctement — et fausse pour la seule autre ligne vendue.

  La phrase est **héritée**, pas introduite : elle était déjà là. Mais la
  réécriture du tour 2 l'a **renforcée** en la sortant de sa subordonnée causale
  pour en faire une assertion nue de trois termes, ce qui la rend plus
  affirmative exactement là où elle est la plus fragile. C'est la même famille
  que BL-2, à une intensité moindre : une affirmation précise qui ne couvre pas
  tout le catalogue.
- **Réécriture** — porter la portée dans la phrase, ce qui la rend en outre plus
  concrète :
  > **Pas de bureau, pas d'équipe commerciale. Votre site est dessiné et
  > construit par la même personne — la même le lendemain de la mise en ligne et
  > le mois suivant.**

  *(Si Boualem tient à « pas de sous-traitance », la forme portée est « votre
  site n'est pas sous-traité », qui est vraie sans exception.)*
- **Preuve** : `.agents/product-marketing.md` §7, « Deux rôles distincts »,
  point 1 ; §5, tableau « Autre ».

---

## 8. MINEURS — 7

| # | Où | Texte / constat | Pourquoi | Correction |
|---|---|---|---|---|
| 1 | `accueil.md` §D.2 | Troisième phrase de la note sous la grille : **33 mots** | Au-delà de 25 mots la phrase se relit, et c'est la note que l'acheteur lit en comparant trois colonnes. **C'est mon propre texte du tour 1** : je le corrige plutôt que de le défendre. | Scinder : « Prix en francs suisses, TVA comprise. La première année d'hébergement et de domaine est comprise. Le suivi commence la 2ᵉ année : **49.–/mois** avec La Vitrine et Le Site, **129.–/mois** avec L'Assistant, qui ne tourne pas sans lui. » *(la mention TVA de la première phrase couvre l'unité de lecture)* |
| 2 | `accueil.md` §D.2 | « **Le prix annoncé est le prix facturé.** » | Deux réserves. C'est (a) une affirmation sur un **comportement futur** — la catégorie que la section G vient précisément de fermer — et (b) un quasi-synonyme de « sans frais cachés », le terme saturé chez 3 acteurs sur 6 qu'elle est censée remplacer. Le fait vrai et non comparatif est déjà porté par « TVA comprise » et par le titre « Les prix sont écrits ». | Supprimer la phrase. La note perd sept mots et ne perd aucun argument. |
| 3 | `_chrome.md` §3 | « Vous utilisez L'Assistant, **la troisième formule.** » | « La troisième formule » renvoie à une liste ordonnée que le lecteur n'a pas forcément lue : le bandeau s'affiche sur toutes les pages, y compris là où aucune grille n'existe. La preuve la plus forte du site demande un aller-retour mental pour être comprise. **C'est encore mon texte du tour 1.** | « **Vous utilisez L'Assistant : la formule qui répond à votre place. Ayoub voit la conversation.** » — sourcé au §5, colonne *Pour qui* de L'Assistant, et compréhensible sans la grille. |
| 4 | `accueil.md` §F.1 et `_sans-preuve.md` C.1 | « **CONDITION** : cet engagement doit être inscrit dans `.agents/product-marketing.md` avant l'apply » · statut « RÉINTRODUIT SOUS CONDITION » | **La condition est déjà remplie.** Le §5 du positionnement sur disque porte la ligne « **Réponse à une demande — Le jour ouvrable suivant** ». Le risque n'est pas théorique : un implémenteur qui lit « sous condition » écartera la correction, et le site partira sans aucune indication de réactivité — le trou même que cette phrase comble. | Passer les deux mentions à **« RÉINTRODUIT — inscrit au positionnement §5 »**, et retirer la condition de §F.1. |
| 5 | `accueil.md` §H.5 et `_inventaire.md`, point ouvert 5 | « `CLAUDE.md` annonce encore « 72 heures » et « studio digital » » | **Faux sur la version en cours.** `CLAUDE.md` porte aujourd'hui « agence digitale », « refonte du site en **une semaine** » et un paragraphe entier proscrivant les heures. C'est la troisième occurrence du même défaut — un constat écrit contre un instantané périmé du référentiel — après les MINEURS 4 et 5 du tour 1, et il envoie Boualem corriger ce qui est corrigé. | Supprimer le point ouvert 5 et le §H.5. **Et adopter la règle qui manque** : tout constat portant sur un référentiel est relu sur disque au moment de rendre, pas au moment de l'écrire. |
| 6 | `accueil.md` §A.6, §D.1 · guide §10, entrée 5 | Cascade du repli « **1 / semaine** », qui est désormais le texte retenu | Le repli consomme une **cinquième** occurrence de « votre feu vert » (« Départ du compteur : votre feu vert »). L'agent l'a vu et prescrit le remède ; ce qui n'est pas prescrit, c'est que l'énumération du glossaire devient fausse. | Trois gestes à l'apply : (a) retenir l'étiquette « **(002) Le délai** » et la ligne « **Départ du compteur : votre feu vert** » ; (b) figer le chapô des Offres **sans** le membre « feu vert » — « **Vous n'avez rien à préparer : je reprends les textes de votre site. Deux allers-retours sont compris. Vous voyez le site fini, vous validez, vous payez, je mets en ligne.** » ; (c) corriger l'entrée 5 du glossaire en « **sous-titre du hero, temps 3 du hero, titre de la Méthode, FAQ Q1** ». |
| 7 | `_sans-preuve.md` §G · `_chrome.md` en-tête · `_inventaire.md` | « **Les cinq entrées ci-dessous** » pour six entrées · « ils apparaissent donc sur **les trois pages** du site » | Bookkeeping. Sur le second point : le site a désormais `/prestations` et `/prestations/[slug]` (`lib/formules.ts`, `app/sitemap.ts`), et le chrome s'y affiche aussi. Le périmètre « 3 pages » de la revue A n'est plus le périmètre du site. | « les six entrées » · « sur toutes les pages du site ». Et signaler à `boss-decision` que les pages de formules relèvent de la revue B — voir §11 c). |

---

## 9. « La carte » — cadrage, sans trancher

La délégation me demande laquelle des deux réécritures est la plus solide en
persuasion, et ce que coûte l'autre. **Je ne tranche pas** : la décision dépend
d'un fait que je n'ai pas — l'accord écrit du client existe-t-il, ou peut-il
être obtenu dans la fenêtre de l'apply.

### La branche « travail d'un vrai client » est nettement la plus solide

Trois raisons, dans l'ordre de leur poids :

1. **C'est la seule preuve du site que le lecteur n'a pas à croire sur parole.**
   L'agence a **1 client et 0 référence de site** (§9). Une démonstration ne
   porte ni preuve sociale ni autorité : le lecteur la discompte presque
   entièrement, et il a raison de le faire — celui qui fabrique la pièce
   fabrique aussi le « avant ». Un travail payé par un tiers déplace la charge
   de la preuve hors de la page.
2. **Elle répond à la question que personne ne pose à voix haute.** Devant une
   grille à 699 / 1'499 / 2'499 et cinq pièces auto-produites, la question du
   gérant n'est pas « sait-il dessiner » mais « **est-ce que quelqu'un l'a déjà
   payé** ». C'est la question de l'attente n°3 du guide (« il sera encore là »)
   posée au passé. Une seule ligne y répond, et c'est celle-là.
3. **Elle rend les quatre autres pièces plus crédibles, pas moins.** Un
   carrousel où l'agence distingue explicitement ce qu'elle a fait pour un
   client de ce qu'elle a simulé démontre la discipline qu'elle revendique
   partout ailleurs. La transparence sur le statut de chaque pièce est
   elle-même un signal — c'est le mécanisme du guide §4, « celui qui écrit ce
   qu'il ne fait pas est cru sur ce qu'il fait ».

**Ce qu'elle coûte, et il faut le dire aussi :** elle dépend d'un accord écrit
qui **n'est pas attesté à ce jour** (§6 : « ✅ Oui, **avec l'accord du
client** ») ; sans lui, la ligne est exactement l'indication trompeuse que la
LCD art. 3 vise, et aucun gain de conversion ne paie ce risque. Elle impose
deux cascades — le chapô de la section (MA-C) et la phrase des mentions légales
« les établissements qui y figurent sont fictifs » (que l'agent a repérée). Et
elle prouve une compétence de la **ligne secondaire** : le lecteur voit qu'un
restaurant l'a payé pour une carte, pas qu'une PME l'a payé pour un site. Elle
établit « c'est un professionnel réel », pas « il sait faire ce dont j'ai
besoin ».

### Ce que coûte la branche « reconstitution fictive »

Elle est **gratuite, immédiate et sans risque juridique** : elle laisse les
mentions légales telles quelles et ne dépend de personne. C'est son seul mérite,
et il n'est pas négligeable si l'apply est proche.

Son coût est unique mais lourd : **le site part avec zéro preuve vérifiable par
un tiers**, et la section entière — cinq pièces sur cinq — est discountée par un
lecteur méfiant. Elle dépense la seule preuve authentique que l'agence possède
en la déguisant en fiction, ce qui est le contraire exact du problème que le
positionnement appelle « le risque numéro un du plan » (§6).

### Ma recommandation de cadrage, qui n'est pas une décision

**Si l'accord écrit peut être obtenu, la branche « client réel » vaut le délai
que son obtention coûte** — elle change la nature de la section, pas seulement
son étiquette. **Si elle ne peut pas l'être dans la fenêtre, prendre la branche
fiction et la prendre entièrement** : étiqueter, garder les mentions légales
telles quelles, et ne rien laisser d'ambigu. Ce qu'il ne faut en aucun cas,
c'est le milieu — une pièce présentée comme réelle sans accord, ou une pièce
réelle diluée dans quatre fictions sans que personne ait décidé.

**La question à poser à Boualem tient en une ligne :** *l'accord écrit du client
pour publier sa carte existe-t-il, ou peut-il être obtenu cette semaine ?*
Les deux textes sont prêts ; seule cette réponse manque.

---

## 10. Mise en valeur — le meilleur et le plus faible, section par section

| Artefact / section | À garder tel quel | À corriger en premier |
|---|---|---|
| `voice-guide.md` | **§8, le paragraphe « la règle s'applique d'abord à ce qu'on écrit soi-même »**, avec le cas concret de la promesse de comportement. Une règle qui nomme sa propre violation passée est une règle qu'on peut appliquer ; c'est ce qui a rendu la section G possible. | L'énumération de l'entrée 5 du glossaire, périmée par le repli du chiffre géant (MINEUR 6). |
| `_inventaire.md` | **Le §0, qui requalifie 20 textes sans re-relever le site.** Distinguer « le relevé fait foi » de « la qualification change » est exactement ce qu'il fallait faire quand les fichiers ne sont pas ouvrables. | Le point ouvert 5, devenu faux (MINEUR 5). |
| `accueil.md` — hero | **Le sous-titre.** Trois corrections dans une phrase de 30 mots, dont celle qui porte la vente. C'est le meilleur texte du tour. | Rien de bloquant ; la cascade du repli (MINEUR 6). |
| `accueil.md` — Démonstrations | Le §B.2, et en particulier la suppression **sans remplacement** des lignes 12 et 13 : ne rien mettre à la place d'une blague est plus difficile que de la remplacer. | Le chapô, sous la branche « client réel » (MA-C). |
| `accueil.md` — Services | **Le geste 03 : « Le client réserve seul, à 23 h comme le dimanche. Vous arrêtez de vous rappeler mutuellement pour caler une heure. »** Le meilleur ajout du tour : un bénéfice dit par une scène, sans un adjectif, sans une promesse. | Rien. |
| `accueil.md` — Offres | **La dernière puce de la carte L'Assistant.** Elle dit la condition la plus coûteuse de la grille entre le prix et le bouton, et elle la vend (« c'est ce qui fait tourner l'assistant »). C'est la correction la plus difficile du tour, et elle est réussie. | La note sous la grille : 33 mots et une phrase de trop (MINEURS 1 et 2). |
| `accueil.md` — Méthode | Les jalons en moments de la semaine plutôt qu'en heures : concrets sans rien inventer. | **L'étape 04 — le seul bloquant du tour (BL-A).** |
| `accueil.md` — L'agence | « L'agence est une personne — la même le lendemain de la mise en ligne et le mois suivant. » Le pilier 3 sans charnière causale. | « Pas de sous-traitance », non qualifié (MA-D). |
| `accueil.md` — Questions | **Q1 :** la meilleure phrase du site conserve sa forme et gagne la conséquence. Q5 (« Qui fait le travail ? ») règle B1 et B6 d'un coup. | Q3 et sa mention de TVA (MA-B). |
| `_chrome.md` | **Le §3.** Il convertit une correction défensive en argument de vente : le lecteur qui écrit à l'assistant apprend dans le même bandeau qu'il essaie le produit à 2'499.–. | Le point ouvert sur le prompt : à moitié résolu, à moitié confirmé (MA-A). |
| `_sans-preuve.md` | **La section G tout entière.** Un agent qui verse ses propres phrases au registre des retraits, avec le motif et le remplacement, fait le travail que la revue ne peut pas faire à sa place. C'est ce qui a permis de fermer cinq bloquants en un tour. | « Les cinq entrées » pour six, et le statut « sous condition » de C.1 (MINEURS 7 et 4). |
| `mentions-legales.md` | La réserve du §3, qui prévoit que la phrase « les établissements qui y figurent sont fictifs » devient fausse sous une branche de la décision « La carte ». Une cascade anticipée. | Rien du ressort du copy ; la page dépend de Boualem. |
| `confidentialite.md` | **Le §2 tient encore la meilleure trouvaille du dossier** — le transfert des conversations hors de Suisse — et le §5 y ajoute le point de départ des 12 mois, la même rigueur appliquée hors du discours commercial. | Rien. Les trois points ouverts sont bien posés et bornés. |

---

## 11. Pour `boss-decision` — quatre points hors périmètre du copy

**a) La réserve B6 et le positionnement ne disent plus la même chose, et
personne ne l'a constaté.** B6 interdit au copy « toute ligne de justification
de prix » ; c'est au titre de cette réserve que la charnière causale a été
retirée (G.4) et que la question « Pourquoi moins cher qu'une agence ? » reste
gelée (B.2). Or `.agents/product-marketing.md` §1 écrit désormais, en clair :
« **Pas de bureau** : c'est une structure volontairement légère, et **c'est ce
qui explique les prix** » — et `CLAUDE.md` le reprend. Le référentiel assume
donc publiquement le lien que la réserve interdit d'écrire. **C'est la même
situation qu'au tour 1 avec la recommandation caduque du mémo G1**, et elle
appelle la même décision : soit B6 est levée et le copy peut porter le lien
(l'agent a la formulation prête), soit B6 tient et le §1 du positionnement doit
cesser de l'écrire. En l'état, le prochain agent lira deux consignes opposées.

**b) La séquence des sections reste le meilleur gain non pris de la page.**
Remonter la Méthode au-dessus de la grille de prix reste le changement au
meilleur rapport effort / conversion. Le chapô du §D.1 est un palliatif de
texte, l'agent le dit lui-même, et je le confirme : trois faits remontés dans
une phrase ne remplacent pas quatre étapes lues avant le prix. C'est une
décision de structure, pas de copy.

**c) Le périmètre de la revue A n'est plus celui du site.** `lib/formules.ts`
porte la matière éditoriale de `app/(site)/prestations/[slug]` — descriptions
des trois formules, questions-réponses, échelle cumulative. Ces textes sont
publics, ils sont référencés par `app/sitemap.ts`, et **ils n'ont été relus par
personne dans la revue A**, dont le périmètre déclaré est de trois pages. Ils
relèvent normalement de `page-produit` et de la revue B ; il faut s'assurer que
la revue B les couvre effectivement, sinon le site publiera des pages de vente
que le guide de voix n'a jamais vues. *(Relevé au passage : le délai y est déjà
« une semaine » et le feu vert y est nommé — la bascule a été faite. C'est la
catégorie qu'il faut y vérifier, comme dans le prompt.)*

**d) La discipline de relecture des référentiels.** Trois constats du tour 2 ont
été écrits contre un instantané périmé de `.agents/product-marketing.md` ou de
`CLAUDE.md` (MINEURS 4 et 5), après deux au tour 1. Aucun n'est grave isolément ;
ensemble, ils forment le seul défaut récurrent du dossier, et ils coûtent des
allers-retours à Boualem sur des points déjà tranchés. La règle qui manque tient
en une ligne, et elle vaut pour tous les agents du pipeline : **un constat qui
cite un référentiel est relu sur disque au moment de rendre.**

---

## 12. VERDICT : ESCALADE vers `boss-decision`

**Le travail est bon, et il faut commencer par là.** Les 22 constats du tour 1
sont traités sans exception, les cinq bloquants sont morts et deux le sont mieux
que ce que je demandais, les six décisions fermées sont respectées au balayage,
sept décomptes annoncés sur sept sont exacts, et la section G — où l'agent
applique à ses propres phrases la règle qu'il appliquait aux autres — est le
geste qui a rendu ce tour possible. La note passe de 24 à 33 sur 40. Sur la
seule question qui pouvait tuer le lancement, l'abonnement obligatoire du
palier 3, le prix caché n'existe plus : il est écrit entre le prix et le bouton.

**J'escalade quand même, et pour trois raisons qui ne se rattrapent pas au
tour 3, puisqu'il n'y en a pas :**

1. **Un bloquant subsiste** — la Méthode annonce comme compris ce qui sera
   facturé aux deux tiers de la grille, et elle contredit la FAQ de la même
   page. Ma règle de verdict est explicite : un bloquant interdit l'OK. La
   correction est d'une ligne et elle est écrite au §6.
2. **Quatre majeurs, dont un que seul un accès hors périmètre a permis de
   voir** — le onzième texte du renommage, dans le prompt de l'assistant.
3. **Trois décisions restent ouvertes et n'appartiennent qu'à Boualem** : la
   branche de « La carte » (§9), la réconciliation de B6 avec le §1 du
   positionnement (§11 a), et la couverture des pages de formules (§11 c).

**Ce que l'escalade demande, concrètement, tient en une page.** Ce n'est pas un
rejet : c'est une porte à franchir avec cinq corrections de texte et trois
réponses.

### Corrections à appliquer avant l'apply — par destinataire

| # | Gravité | Destinataire | Correction |
|---|---|---|---|
| 1 | **BLOQUANT** | `copy-positionnement` | Aligner l'étape 04 de la Méthode sur la FAQ Q4 : les modifications de contenu ne sont comprises que dans le suivi de L'Assistant (§6, BL-A). |
| 2 | MAJEUR | `copy-positionnement` + `revue-code` | Ajouter `lib/chat-prompt.ts:43` au tableau §I — « studio digital » → « agence digitale » — et clore la moitié du point ouvert de `_chrome.md` : le délai y est déjà correct (§7, MA-A). |
| 3 | MAJEUR | `copy-positionnement` | Ajouter « TVA comprise » au 129.– de la Q3, et relire la réponse entière à l'apply (§7, MA-B). |
| 4 | MAJEUR | `copy-positionnement` | Préparer le chapô de la section Démonstrations pour la branche « client réel » (§7, MA-C). |
| 5 | MAJEUR | `copy-positionnement` | Porter la portée de « pas de sous-traitance » sur le site, la ligne réseaux sociaux étant produite par le partenaire (§7, MA-D). |
| 6 | MINEURS | `copy-positionnement` | Les sept finitions du §8, dont deux corrections de mes propres textes du tour 1 et deux constats périmés à supprimer. |
| 7 | DÉCISION | **`boss-decision`** | « La carte » : fiction assumée ou travail de client avec accord écrit (§9). Cadrage donné, décision non prise. |
| 8 | DÉCISION | **`boss-decision`** | Réserve B6 contre §1 du positionnement : lever la réserve, ou retirer le lien de causalité du référentiel (§11 a). |
| 9 | DÉCISION | **`boss-decision`** | Vérifier que la revue B couvre `lib/formules.ts` et les pages `/prestations` (§11 c). |

**Sur la voix elle-même, une phrase, parce que ma définition me demande de le
dire si je le pense : le guide de voix est juste, et je ne demande pas à le
rouvrir.** Il a absorbé le changement de délai et le changement d'identité sans
perdre sa colonne vertébrale, et son §8 est devenu la meilleure page du dossier.
La seule chose qui lui manque est une ligne de tenue de registre (l'entrée 5 du
glossaire), pas une révision.

---

**RAPPORT**

```
STATUT: ESCALADE
LIVRABLES: docs/agents/reviews/psy-A-copy-tour2.md
CHIFFRES CLÉS: Clarté 4 · Hiérarchie 4 · Leviers 4 · Friction 4 · Objections 4 ·
  Spécificité 5 · Cohérence 4 · Éthique 4 — total 33/40 (tour 1 : 24/40).
  1 bloquant / 4 majeurs / 7 mineurs. 22 constats du tour 1 sur 22 traités.
  5 bloquants du tour 1 : tous morts. Décisions fermées : 6 sur 6 respectées.
  Décomptes annoncés : 7 sur 7 exacts.
POINTS OUVERTS POUR BOUALEM:
  1. « La carte » : l'accord écrit du client existe-t-il, ou peut-il être obtenu
     cette semaine ? Branche « client réel » nettement plus solide ; branche
     « fiction » sans risque mais le site part sans aucune preuve tierce.
  2. La réserve B6 interdit d'écrire ce que le §1 du positionnement écrit
     désormais (« pas de bureau … c'est ce qui explique les prix »). Laquelle
     des deux tombe ?
  3. La Méthode remonte-t-elle au-dessus de la grille de prix ? Meilleur gain
     de conversion non pris de la page.
  4. La revue B couvre-t-elle lib/formules.ts et les pages /prestations ? Ce
     sont des textes publics que la revue A n'a jamais vus.
  5. « Pas de sous-traitance » : porter la phrase sur le site, ou assumer la
     production partenaire sur la ligne réseaux sociaux ?
PROCHAINE ÉTAPE: boss-decision, porte G2 — points 7, 8, 9 du tableau du §12.
  En parallèle, copy-positionnement applique les points 1 à 6 (un bloquant,
  quatre majeurs, sept mineurs) : aucun ne demande d'arbitrage, tous sont
  écrits mot pour mot dans ce rapport.
```
