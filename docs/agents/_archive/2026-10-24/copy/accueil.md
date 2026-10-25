# Réécriture — page d'accueil `/` — **tour 2**

> Mode `propose`. Aucun fichier du site n'est modifié.
> Remplace la version du tour 1, archivée dans
> `docs/agents/_archive/2026-08-30-tour1/copy/accueil.md`.
> Référence : `docs/agents/brand/voice-guide.md` (tour 2). Preuves :
> `.agents/product-marketing.md` (version sur disque), `docs/agents/veille/`.
> Corrections traitées : les 5 bloquants, 8 majeurs et 9 mineurs de
> `docs/agents/reviews/psy-A-copy-tour1.md`.
>
> **Mot-clé cible de la page** : *refonte de site PME Genève*. Il reste dans le
> `title`, dans la `meta description` et dans la première unité de lecture du
> hero (kicker + sous-titre) — le `h1` est contraint à 21 caractères par ligne
> et ne peut pas le porter en entier.

## Les deux changements qui invalident le tour 1

**1. « 72 heures » est mort.** Le délai est **« une semaine »**, partout, sans
exception, refonte comme départ de zéro. **27 occurrences de « 72 h » tombaient
dans ce seul fichier.** Ce n'est pas une substitution : partout où l'argument
reposait sur la vitesse brute, il repose désormais sur **« vous n'avez rien à
préparer »**. Deux acteurs du panel annoncent 7 jours et 48-72 h : la vitesse
n'est plus différenciante, l'absence de travail à fournir l'est.
*(`.agents/product-marketing.md` §3, §8 « Une seule promesse de délai », §9.)*

**2. L'identité est publique.** **Ayoub Bensalem**, **agence digitale**
indépendante à Genève, **pas de bureau**. « Studio digital » et « le studio »
ne s'écrivent plus — voir §A.3 et le tableau de renommage au §I.

## Table de correspondance avec la revue A

| Revue | Où c'est traité |
|---|---|
| BL-1 abonnement obligatoire de L'Assistant | §D.2 et §D.3 |
| BL-2 « sans abonnement obligatoire » | §D.5 |
| BL-3 prix dans le hero sans TVA | §A.6, temps 3 |
| BL-4 « souvent la seule chose qu'ils voient » | §C.3, geste 05 |
| BL-5 deux promesses de comportement | §F.1 ici, et `_chrome.md` §3 |
| MA-1 le `h1` | §A.1 — tranché, variante 2 |
| MA-2 / MA-3 le sous-titre | §A.2 — **tâche prioritaire** |
| MA-4 « rien à préparer » énoncé tôt | §A.2, §A.6 temps 2, §D.1 |
| MA-5 la crédibilité avant le prix | §D.1 |
| MA-6 l'auto-dénigrement du chapô | §B.1 |
| MA-7 Internet Explorer 6 et le compteur | §B.2 |
| MA-8 l'ambiguïté sur « La carte » | §B.4 et §H.3 |
| MINEURS 1, 2, 3 | §C.3, gestes 04, 03 et 06 |
| MINEUR 4 citation périmée | `_sans-preuve.md` §A.1 |
| MINEUR 5 point ouvert devenu faux | `_inventaire.md`, points ouverts, n°3 |
| MINEUR 6 charnière causale de prix | §E.3 |
| MINEUR 7 « Café Exemple » | §B.2, lignes 1, 5, 8 |
| MINEUR 8 « feu vert » × 7 | guide §10, entrée 5 (plafond écrit) ; §A.2, §C.1, §C.3 geste 01 |
| MINEUR 9 « Envoyer mon site » | §F.3 |
| Revue §9 a) table de CTA incomplète | guide §7, ligne « Bouton du formulaire » |
| Revue §6 réactivité à réintroduire | §F.1, une seule occurrence |
| Revue §6.1 démonstration en direct | §A.6 temps 3, §D.3, et `_chrome.md` §3 |
| Revue §6.3 séquence de livraison | §D.1, remontée au-dessus du prix |

---

# A. LE HERO — priorité n°1

**Contrainte technique impérative.** Le `h1` est découpé en trois `<span
class="l">` révélées une par une (`app/binacore.css`, rappel en `CLAUDE.md`,
§ Conventions du dépôt, dernière puce). **Chaque ligne tient sur 21 caractères
au maximum**, espaces et ponctuation comprises. Au-delà, la ligne déborde,
l'animation casse et le `hero-foot` passe sous la ligne de flottaison — défaut
déjà constaté et corrigé une fois. Le décompte est donné à côté de chaque ligne.

## A.1 — L'accroche : **décision prise, non rouverte**

### AVANT (`components/NoyauHero.tsx:39-41`)

```
Votre site a dix ans.        (21)
En 72 heures, il             (16)
travaille pour vous.         (20)
```

### APRÈS — **variante 2, avec le délai corrigé**

```
Un site qui reçoit           (18)
vos demandes, refait         (20)
en une semaine.              (15)
```

- **DÉCOMPTE.** 18 / 20 / 15. Aucune ligne ne touche le plafond de 21 : c'est la
  seule des variantes du tour 1 dans ce cas, et la marge tient si la police
  change. *(Décomptes vérifiés caractère par caractère, ponctuation comprise.)*
- **POURQUOI.** Elle dit en cinq secondes ce que c'est, ce que ça fait, et en
  combien de temps. Elle porte le pilier 2, dont la veille établit qu'il est le
  seul axe libre du panel : « aucun des 6 ne livre, en standard, devis chiffré,
  prise de rendez-vous ou assistant », et « l'objection *ce n'est qu'une
  vitrine* n'est traitée nulle part ». Elle ne dit rien du site actuel du
  lecteur, donc elle ne peut pas se tromper sur lui. Le mot **refait** nomme
  l'objet du contrat — l'ICP a déjà un site, et il est déjà en ligne : lui
  annoncer « le site est en ligne » lui annonce un état qu'il possède.
- **PREUVE.** `.agents/product-marketing.md` §5, tableau des formules (le
  formulaire de demande est dans le socle, dès 699.–) ; §3, pilier 2 ; délai :
  §3 et §9. `veille/synthese.md`, « Espaces libres ».
- **CE QU'ELLE PERD, ET QUI LE RATTRAPE.** Le point de départ : « refait en une
  semaine » se lit spontanément « une semaine après que j'aurai envoyé mes
  affaires ». **C'est la tâche du sous-titre, §A.2**, dans la même unité
  visuelle. Un `h1` complété par la ligne suivante est plus fort qu'un `h1` qui
  a besoin de la ligne suivante pour être compris.
- **Les deux autres variantes sont mortes**, et pour des raisons de fait, pas de
  goût : la variante 1 disait « 72 heures plus tard » ; la variante 3 repartait
  de « Votre site a vieilli », c'est-à-dire d'une affirmation sur le lecteur —
  la famille exacte de l'accroche rejetée.

## A.2 — Le sous-titre du hero — **la tâche prioritaire**

Il doit faire quatre choses en une respiration : porter le mot-clé, poser le
bénéfice n°1 **frontalement** (MA-4), rattraper le point de départ que le `h1`
ne dit plus (MA-2), et rester lisible par un gérant pressé (MA-3).

- **AVANT** (`NoyauHero.tsx:44`) — Sites de PME à Genève : demande de devis,
  prise de rendez-vous, fiche Google. Refait en 72 heures si vous avez déjà un
  site, une semaine si on part de zéro. Dès 699.–, TVA comprise. *(34 mots)*

- **APRÈS — recommandé** *(30 mots)* :

  > **Sites de PME à Genève. Vous n'avez rien à préparer — je reprends les
  > textes de votre site actuel, et le délai court dès votre feu vert. Dès
  > 699.–, TVA comprise.**

- **VARIANTE LONGUE** *(38 mots)*, si la bande défilante est déplacée ou retirée
  et que le hero doit porter seul les trois fonctions :

  > **Sites de PME à Genève : demande de devis, prise de rendez-vous, fiche
  > Google. Vous n'avez rien à préparer — je reprends les textes de votre site
  > actuel, et le délai court dès votre feu vert. Dès 699.–, TVA comprise.**

- **POURQUOI.** Trois corrections dans une phrase.
  **(a) MA-4** — « Vous n'avez rien à préparer » est un **énoncé principal**, pas
  une subordonnée. Le guide §2 classe cette attente en n°1 et écrit noir sur
  blanc que le délai rassure moins que l'absence de travail à fournir. C'est la
  première fois qu'elle est dite en clair sur le site, et elle est dite tôt. Le
  mécanisme la suit dans la même phrase — sans « je reprends les textes de votre
  site actuel », l'énoncé serait une promesse de plus ; avec lui, c'est un fait.
  **(b) MA-2** — le terme de glossaire « votre feu vert » entre enfin dans
  l'écran d'accueil, et il y entre **une seule fois** (MINEUR 8).
  **(c) MA-3** — 30 mots contre 34, et **trois idées contre quatre**. Deux
  coupes : le cas « départ de zéro » disparaît, parce que le délai est désormais
  le même dans les deux cas — il n'y a plus deux promesses à distinguer ; et
  l'énumération des trois fonctions part, parce qu'elle est **déjà écrite deux
  fois dans le même écran** — la bande défilante juste en dessous
  (`Strip.tsx:12-13` : « Demande de devis · Prise de rendez-vous · Fiche
  Google ») et le temps 2 du hero animé (« Il reçoit les demandes, prend les
  rendez-vous et chiffre les devis »). Le mot-clé, lui, reste en tête.

- **UNE PRÉCISION D'ARBITRAGE, DONNÉE FRANCHEMENT.** La revue chiffre sa propre
  proposition à « 30 mots » ; recomptée mot à mot, **elle en fait 38**, comme le
  sous-titre du tour 1 qu'elle corrige. Le décompte n'était donc pas ce qui
  clochait — c'était le nombre d'idées et la redondance. Le sous-titre
  ci-dessus tient les 30 mots **réels**, et il les tient en coupant ce qui est
  dit ailleurs, pas en abrégeant ce qui doit être prouvé.
- **PREUVE.** `.agents/product-marketing.md` §5, « Les conditions », ligne
  *Textes* (décision marquée tranchée au §10, n°2) ; §3, pilier 1 ; grille §5
  (699.– TVA comprise).
- **CONFORMITÉ TVA.** Le seul prix du hero est ici, et il porte sa mention dans
  la même phrase (guide §8, règle 3 ; `CLAUDE.md`, Interdits). Voir §A.6, où le
  second prix du hero est retiré.

## A.3 — Le kicker — **l'identité**

- **AVANT** (`NoyauHero.tsx:29-31`) — ® **Studio digital indépendant** · Genève,
  Suisse · Sites de PME
- **APRÈS** — ® **Agence digitale indépendante** · Genève, Suisse · Sites de PME
- **POURQUOI.** `.agents/product-marketing.md` §1 : « Agence digitale
  indépendante à Genève, opérée par Ayoub Bensalem ». Le kicker est la première
  ligne lue du site et la seule qui nomme la catégorie ; il ne peut pas dire
  autre chose que le positionnement. Le mot « indépendante » reste : il porte
  seul ce que « pas de bureau, pas d'équipe commerciale » développe deux écrans
  plus bas.
- **PREUVE.** §1 du positionnement.
- **CONSÉQUENCE.** Ce n'est pas une chaîne isolée : voir le tableau de renommage
  du §I, qui liste les dix textes visibles concernés.

## A.4 — Le CTA secondaire du hero

- **AVANT** (`NoyauHero.tsx:47`) — Voir les avant / après
- **APRÈS** — **Voir les démonstrations**
- **POURQUOI.** Glossaire, entrée 14. « Avant / après » laisse entendre qu'il
  existe un client dont c'est le avant et le après. Il n'y en a aucun (§9 :
  « Références de site : 0 »). **L'ancre `#travaux` ne change pas** — c'est une
  URL. *(Inchangé depuis le tour 1 ; la revue ne le conteste pas.)*
- **PREUVE.** §6, « Le trou à combler », option 2.

## A.5 — Le CTA principal

- **AVANT / APRÈS** — **Faire refaire mon site →** *(inchangé, guide §7)*

## A.6 — Les temps 2, 3 et 4 du hero animé

### Temps 2 — étiquette et phrase

- **AVANT** (`:58`, `:60`) — (001) Le noyau · « Il reçoit les demandes, chiffre
  les devis, prend les rendez-vous — sans que vous y touchiez. »
- **APRÈS** — **(001) Ce que le site fait** · **« Il reçoit les demandes, prend
  les rendez-vous et chiffre les devis — sans que vous y touchiez. Selon la
  formule. »**
- **POURQUOI.** « Le noyau » est un nom de composant, pas un mot du client :
  aucun gérant de PME ne sait ce qu'est un noyau, et le glossaire n'a pas
  d'entrée pour lui. La phrase promettait les trois fonctions sans dire
  qu'elles se répartissent sur trois paliers — la sur-promesse qui fait ouvrir
  la grille en se sentant floué. Trois mots la réparent. L'ordre des verbes suit
  celui de la grille.
- **PREUVE.** §5 : formulaire dès La Vitrine ; rendez-vous et devis chiffré au
  Site ; assistant à L'Assistant.

### Temps 3 — étiquette, chiffre géant et spécifications

> **Le problème de fond : le chiffre le plus grand du site était « 72 ».** Il ne
> peut pas devenir « 1 / semaine » sans perdre ce qui faisait son effet, et il
> ne peut pas rester. La question n'est donc pas quoi substituer, mais **quel
> fait mérite d'être écrit en grand** maintenant que la vitesse ne différencie
> plus. Deux réponses, la première recommandée.

- **AVANT** (`:70`, `:73-74`, `:77-80`) — (002) Le cœur · **72 / heures** ·
  Atelier : Genève, Suisse · Refonte : 72 heures · Départ de zéro : Une semaine ·
  Suivi : Dès 49.–/mois

- **APRÈS — recommandé**

  > **(002) Ce que vous avez à faire**
  >
  > **0** / **à préparer**
  >
  > **Délai : une semaine**
  > **Textes : repris de votre site**
  > **Allers-retours : deux, compris**
  > **Agence : Genève, Suisse**
  > **Démonstration : l'assistant, en bas à droite**
  > **Suivi : à partir de la 2ᵉ année**

- **REPLI — littéral, si le « 0 » est jugé trop elliptique**

  > **(002) Le délai** · **1** / **semaine** · mêmes lignes de spécifications,
  > la première devenant **Départ du compteur : votre feu vert**.
  >
  > *Attention : ce repli consomme une **cinquième** occurrence de « votre feu
  > vert », au-delà des quatre autorisées par le glossaire (entrée 5). S'il est
  > retenu, retirer celle du chapô des Offres (§D.1), qui est la moins
  > nécessaire des quatre — la séquence de livraison y porte déjà la
  > démonstration.*

- **POURQUOI le « 0 ».** Trois raisons, dont deux sont des faits.
  **(a)** « 72 » n'existe plus, et « 1 semaine » écrit en très grand annonce un
  chiffre que deux acteurs du panel égalent ou battent (7 jours ; 48-72 h). Le
  plus grand caractère du site dirait alors ce que l'agence a de moins
  différenciant.
  **(b)** Le fait qui différencie est chiffrable, et il vaut zéro : le client ne
  fournit rien. C'est l'attente n°1 du guide §2, et le seul angle que la veille
  laisse libre — les deux concurrents rapides du panel conditionnent leur délai
  à la fourniture du contenu.
  **(c)** Le « 0 » ne voyage pas seul : « à préparer » est collé en dessous, et
  les six lignes de spécifications sont dans la même unité de lecture, dont
  « Délai : une semaine ». La règle du guide §5 est tenue par l'autre moitié.
- **RISQUE, dit franchement.** Un « 0 » géant peut se lire « gratuit » pendant un
  quart de seconde. C'est le seul argument sérieux contre, et c'est pourquoi
  « à préparer » doit être **collé au chiffre**, jamais renvoyé plus bas. Si
  la maquette ne le permet pas, prendre le repli.
- **BL-3 — le prix quitte le hero.** « Suivi : Dès 49.–/mois » affichait un prix
  à plusieurs écrans de toute mention de TVA, ce que `CLAUDE.md` interdit en
  toutes lettres (« Aucun prix affiché sans la mention **TVA comprise** ») et
  que le guide §8, règle 3, reprend par unité de lecture. Le hero n'a pas besoin
  d'un second prix — il a besoin de dire que
  la première année ne coûte rien de plus. **« Suivi : à partir de la 2ᵉ
  année »** le dit ; la grille, deux écrans plus bas, porte le montant et la
  mention.
- **Le reste des corrections.** « Atelier » → « Agence » (glossaire, entrée 1).
  « Départ de zéro : une semaine » disparaît : le délai est le même dans les
  deux cas, la ligne n'a plus d'objet. « Démonstration : l'assistant, en bas à
  droite » fait entrer dans le hero **la seule preuve vérifiable en un clic**
  dont l'agence dispose (revue §6.1).
- **PREUVE.** §3, pilier 1 et encadré ; §5, « Les conditions » (textes, deux
  allers-retours) ; §5, encadré « Le palier 3 existe déjà » ; §5, « Le
  récurrent » ; `CLAUDE.md`, Interdits.

### Temps 4 — la sortie

- **AVANT** (`:90`) — Un site ne se regarde pas. Il travaille, **ou il ne sert à
  rien.**
- **APRÈS** — **Un site ne se regarde pas. Il fait entrer des demandes, ou il
  dort.**
- **POURQUOI.** « Ou il ne sert à rien » juge le site que le lecteur possède, et
  qu'il a payé — la faute que le positionnement §8 interdit. « Il dort » dit la
  même chose sans mettre personne en cause. *(Inchangé ; la revue le range
  parmi les textes à garder tels quels.)*
- **PREUVE.** §8, « Ce qui doit changer », première ligne.

---

# B. LA SECTION « DÉMONSTRATIONS » — le point le plus exposé du site

> Cinq pièces sont construites autour d'un établissement inventé, doté d'une
> raison sociale, d'une adresse (« Rue des Étuves 12 »), d'une année de
> fondation, d'un téléphone, d'un fax et d'un compteur de visiteurs. Le
> positionnement le classe déjà « **client fictif inventé — à retirer** » (§6).
> LCD art. 3 ; `CLAUDE.md`, Interdits.
>
> Les réécritures ci-dessous **neutralisent la fiction sans toucher au dessin**.
> Elles sont un minimum, pas une solution : voir §H.

## B.1 — Nom et chapô de la section

- **AVANT** (`Travaux.tsx:18`, `:20`, `:23`) — (01) Travaux · « Tout a un avant.
  Voici les après. » · « Cinq démonstrations du studio — glissez la poignée de
  chaque pièce pour comparer l'avant et l'après. »
- **APRÈS** — **(01) Démonstrations** · **« Tout a un avant. Voici les
  après. »** *(inchangé)* · **« Cinq pièces faites par l'agence pour montrer le
  travail — aucune n'est un client. Glissez la poignée pour comparer l'avant et
  l'après. »**
- **POURQUOI — et c'est une correction du tour 1 (MA-6).** La version du tour 1
  ajoutait « le studio démarre, et sa première refonte de site de PME reste à
  faire ». **L'honnêteté est obligatoire, l'auto-dénigrement ne l'est pas.** Ne
  revendiquer aucune référence est une obligation ; annoncer « je n'ai jamais
  fait ça » à un prospect qui s'apprête à lire une grille de prix, dans la
  section censée porter la preuve, est un choix — et il coûte la vente. Le
  silence sur un négatif n'est pas une affirmation fausse : la règle de preuve
  interdit d'affirmer sans source, elle n'oblige pas à narrer ce qui manque.
  « Aucune n'est un client » dit tout ce que le droit exige.
  « Travaux » part parce qu'il annonce des réalisations clientes ; il y en a
  zéro. **L'ancre `#travaux` reste inchangée.**
- **PREUVE.** §6, tableau des preuves ; §9 (« Références de site : 0 ») ;
  guide §4, « On ne s'auto-dénigre pas ».

## B.2 — Neutraliser l'entreprise inventée, et retirer la moquerie

| # | AVANT | APRÈS | Fichier:ligne |
|---|---|---|---|
| 1 | Le Comptoir | **Un café — démonstration** | `feature-carousel.tsx:216,302` |
| 2 | Bar — Genève · **Maison fondée en 1987 · Rue des Étuves** | **Bar — démonstration · Carte, horaires, adresse** | `:215,217` |
| 3 | Bar — Genève · **depuis 1987** | **Bar — démonstration** | `:239` |
| 4 | Rue des Étuves 12 | **Adresse · Genève** | `:246,280` |
| 5 | **Le Comptoir** — Genève *(affiche)* | **Un café — démonstration** | `:276` |
| 6 | Jeudi 12 décembre — dès 19 h | **Un jeudi — dès 19 h** | `:279` |
| 7 | Rue des Étuves 12 · 1201 | **Genève** | `:280` |
| 8 | Carte fidélité · **Le Comptoir** | **Carte fidélité — démonstration** | `:286-287` |
| 9 | **Tél : 022 000 00 00 / Fax : 022 000 00 01** | **Tél. · Fax** *(sans numéro)* | `:337` |
| 10 | **Bienvenue sur le site du Comptoir !!** | **Bienvenue sur notre site** | `:322` |
| 11 | **NOUVEAU : soirée jazz le jeudi !!!** | **Nouveau : soirée jazz le jeudi** | `:325` |
| 12 | **Vous êtes le visiteur n° 000482** | **ligne supprimée**, libellé compris | `:326` |
| 13 | **Site optimisé pour Internet Explorer 6** | **ligne supprimée** | `:318-327` |
| 14 | **JAZZ !!!** *(affiche « avant »)* | **JAZZ** | `:344` |

- **POURQUOI. (a) La fiction.** Un nom d'enseigne, une adresse dans une rue qui
  existe, une année de fondation et un numéro de téléphone composent ensemble
  une entreprise crédible. **« Café Exemple », proposé au tour 1, ne suffit
  pas** : deux majuscules et un article implicite, ça se lit encore comme une
  enseigne, donc comme une entreprise (MINEUR 7). **« Un café — démonstration »**
  ne peut être pris pour un nom, et le mot « démonstration » figure désormais
  *dans* la pièce, pas seulement dans le chapô.
- **(b) La dérision — deux lignes que le tour 1 avait manquées (MA-7).** Le
  tableau du tour 1 concluait que la pièce « cesse d'être une blague aux dépens
  du lecteur ». Elle ne cessait pas : **« Site optimisé pour Internet
  Explorer 6 » est la chute de la blague**, et **le compteur de visiteurs, même
  vidé de son nombre, reste l'objet moqué**. Les deux sont supprimées, sans
  remplacement. Le caractère daté de la pièce est porté par le dessin, la
  typographie et le cadre de fenêtre ; il n'a pas besoin d'être commenté, et
  commenté il devient une moquerie. Le positionnement §8 pose la règle en toutes
  lettres : « *Daté*, jamais *ridicule*. » Un prospect dont le site date de 2011
  se reconnaît, et se sent visé.
- **PREUVE.** §6 et §8 du positionnement ; `CLAUDE.md`, Interdits.

## B.3 — Le texte des cinq pièces

| Pièce | AVANT | APRÈS |
|---|---|---|
| Le site (`:385`) | Un site de 2009 refait **en 72 heures** : lisible sur téléphone, avec un formulaire de devis qui fonctionne. | **Un site de 2009 refait en une semaine : lisible sur téléphone, avec un formulaire de devis qui fonctionne. Les textes ont été repris de l'ancien.** |
| La carte (`:378`) | Une carte qui a bien servi, remise à plat : hiérarchie claire, prix lisibles, et sa version en ligne par QR code. | **voir §B.4 — dépend d'une décision** |
| La carte de visite (`:392`) | 85 × 55 recto-verso, sur un papier qu'on garde en main. Le même geste, mieux dit. | *(inchangé — concret, chiffré, dans le ton)* |
| L'affiche (`:399`) | La même annonce, redessinée : une affiche qu'on remarque et qu'on garde. | **La même annonce, redessinée. Ligne restauration, sur devis.** |
| La fidélité (`:406`) | La carte à tampons remise au propre : dix passages, un vrai design. | **La carte à tampons remise au propre : dix passages. Ligne restauration, sur devis.** |

- **POURQUOI.** *Le site* est la seule des cinq pièces qui parle à l'ICP : son
  délai passe à une semaine, et il porte ce qui le rend crédible — les textes
  repris — plutôt qu'un compteur. Les pièces de restauration ne sont pas
  retirées (prestation réelle, client payant) mais elles doivent dire qu'elles
  appartiennent à une **ligne secondaire**, sinon le visiteur qui cherche un
  site conclut que l'agence fait surtout des menus. « Un vrai design » part :
  c'est un jugement sur soi, pas un fait.
- **PREUVE.** §5, « Ligne secondaire — restauration » ; §5, « Les conditions ».

## B.4 — « La carte » : l'ambiguïté à lever avant l'apply (MA-8)

**Le tour 1 se contredisait** : le tableau §B.2 renommait la pièce comme une
fiction, tandis que les points ouverts la présentaient comme « la seule preuve
réelle du studio ». Les deux ne peuvent pas être vrais, et c'est la pièce la
plus précieuse du site. **La réponse appartient à Boualem** ; les deux
réécritures sont prêtes.

- **Si la pièce est une reconstitution fictive :**
  > **Une carte qui a bien servi, remise à plat : hiérarchie claire, prix
  > lisibles, version en ligne par QR code. Ligne restauration, sur devis.**

  Elle reste dans le lot des démonstrations, elle est étiquetée comme telle, et
  le point ouvert §H.3 doit alors dire que le travail réel du client **n'est pas
  sur le site**.

- **Si c'est le travail du client payant, accord obtenu :**
  > **Carte de restaurant · travail réalisé pour un client, publié avec son
  > accord. Hiérarchie claire, prix lisibles, version en ligne par QR code.**

  Et la pièce **sort du lot des démonstrations** : c'est la seule ligne de
  preuve authentique disponible aujourd'hui, et la fondre dans quatre fictions
  la gaspille.

- **PREUVE.** §6, tableau des preuves (« Une carte de restaurant — travail
  réalisé par Ayoub, client payant — ✅ Oui, avec l'accord du client ») et
  « Règle absolue ».

---

# C. BANDE DÉFILANTE ET SERVICES

## C.1 — La bande défilante

- **AVANT** (`Strip.tsx:12-13`) — Refonte de site · Demande de devis · Prise de
  rendez-vous · Fiche Google · **72 heures** · Genève
- **APRÈS** — Refonte de site · Demande de devis · Prise de rendez-vous · Fiche
  Google · **Une semaine, rien à préparer** · Genève
- **POURQUOI.** Un jeton de délai entre deux autres jetons est le cas d'école de
  la règle du guide §5 : isolé, « une semaine » ne différencie plus rien du tout
  depuis qu'un acteur du panel annonce 7 jours. Trois mots le raccrochent au
  seul fait qui différencie, sans casser le rythme du défilement — et sans
  reprendre « feu vert », dont le compte est plafonné (MINEUR 8).
- **PREUVE.** Guide §5 ; §3 pilier 1 ; `veille/synthese.md`, carte des délais.

## C.2 — Le titre de la section Services

- **AVANT** (`ServicesRows.tsx:22`) — Six gestes, **un seul interlocuteur.**
- **APRÈS** — **Six gestes, la même personne.**
- **POURQUOI.** **Réserve B4, violation directe.** « Interlocuteur unique » est
  occupé par un acteur du panel ; « un seul interlocuteur » en est la variante
  reconnaissable. « La même personne » dit la même chose, en plus vrai, et c'est
  le vocabulaire de la section « L'agence » deux écrans plus bas.
- **PREUVE.** `boss-G1-tour1.md`, réserve B4 et test T6 ;
  `veille/concurrents.json`, C3, `lexique_recurrent`.

## C.3 — Les six gestes

| # | AVANT (extrait) | APRÈS | Pourquoi · Preuve |
|---|---|---|---|
| 01 | …Livré **en 72 heures**, deux allers-retours compris. | …**Livré en une semaine, sans que vous ayez à fournir de textes : je les reprends de votre site actuel. Deux allers-retours compris.** | Le délai porte le fait qui le rend tenable, pas son point de départ — « feu vert » est plafonné à quatre occurrences (MINEUR 8) et celle-ci n'est pas dans les quatre. §5, « Les conditions ». |
| 02 | …le visiteur repart avec **une estimation chiffrée immédiate**. | …**le visiteur repart avec un devis chiffré, tout de suite.** | Glossaire, entrée 7 : un seul mot par concept, et c'est celui de la grille. §5. |
| 03 | Vos créneaux en ligne, **synchronisés avec votre agenda**… | **Vos créneaux en ligne. Le client réserve seul, à 23 h comme le dimanche. Vous arrêtez de vous rappeler mutuellement pour caler une heure.** | **MINEUR 2** : « et reçoit sa confirmation » est retiré — fonction ajoutée sans source, dans la ligne même où la synchronisation d'agenda est retirée pour ce motif. §5 ne dit que « Prise de rendez-vous en ligne ». |
| 04 | Un assistant formé sur vos prestations… **Les demandes restées sans réponse sont relancées seules.** | **Avec L'Assistant : un assistant formé sur vos prestations et vos tarifs répond jour et nuit. Il note le nom et le numéro, et vous alerte aussitôt sur votre téléphone. Les demandes sans réponse sont relancées seules.** | **MINEUR 1** : « dans la seconde » est une latence chiffrée que rien ne mesure — §5 écrit « Alerte instantanée ». **MINEUR 3** : la phrase de 30 mots est scindée en trois. « Avec L'Assistant » reste : ces fonctions n'existent qu'au troisième palier. §5, colonne L'Assistant. |
| 05 | Fiche complétée : photos, horaires exacts, zone d'intervention, **réponses aux avis**… | **Fiche complétée : photos, horaires exacts, zone d'intervention. C'est ce que voient les gens qui cherchent votre métier à Genève.** | **BL-4** : « souvent la seule chose qu'ils voient » est une affirmation générale sur le comportement du marché, absente du positionnement comme de la veille — et le tour 1 venait de retirer « réponses aux avis » pour ce motif exact, trois mots plus loin. Ce qui est retiré, c'est la quantification implicite, pas l'idée. §2 : « les gens qui cherchent son métier à Genève tombent sur un site daté ». |
| 06 | Un logotype propre si vous n'en avez pas, une palette cohérente… | **Sur devis, en complément : un logotype si vous n'en avez pas, et une palette cohérente entre le site, vos documents et vos véhicules. Photos de votre entreprise également sur devis.** | **MINEUR 3** : 35 mots scindés en deux. Aucune des trois prestations n'est comprise dans une formule ; les décrire au même niveau que les cinq autres gestes laisse croire l'inverse. §5, « En complément ». |

---

# D. OFFRES ET CARTE DE L'AGENCE

## D.1 — Le titre de la grille, et la ligne de crédibilité (MA-5)

- **AVANT** (`Offres.tsx:113`) — **Des prix clairs, tout compris.**
- **APRÈS** — **Trois formules. Les prix sont écrits.**
  + **une ligne de chapô sous le `h2`, qui n'existait pas :**

  > **Vous n'avez rien à préparer : je reprends les textes de votre site, et le
  > délai court dès votre feu vert. Deux allers-retours sont compris. Vous voyez
  > le site fini, vous validez, vous payez, je mets en ligne.**

- **POURQUOI le titre.** La clarté tarifaire et l'absence de coûts cachés **sont
  la promesse d'accueil entière** d'un des six acteurs du panel, et le couple
  « transparent / sans coûts cachés » est relevé chez trois sur six. « Les prix
  sont écrits » est un fait sur cette page-ci — ils y sont, on peut les compter
  — et non une revendication de vertu. Non comparatif : conforme à B1 et B2.
- **POURQUOI le chapô — c'est la correction MA-5.** La structure de la page met
  la grille (03) **avant** la Méthode (04), l'agence (05) et les Questions (06) :
  le lecteur rencontre 699 / 1'499 / 2'499 avant d'avoir lu comment le délai
  tient, qui est derrière, et ce qui se passe s'il veut changer quelque chose.
  Le chapô remonte **les trois faits qui rendent le prix croyable**, sans
  toucher à la structure. Il contient en particulier « **vous voyez le site
  fini, vous validez, vous payez, je mets en ligne** » — une inversion du risque
  qui n'invente aucune garantie (l'agence travaille avant d'être payée), que la
  revue désigne comme la meilleure phrase du lot et qui était enterrée à
  l'étape 03 de la section 04.
- **PREUVE.** `veille/concurrents.json`, C6 `promesse_principale` et
  `lexique_recurrent` ; `veille/synthese.md`, « Lexique commun du marché » ;
  §5, « Les conditions », lignes *Révisions*, *Textes*, *Paiement*, *Livraison*.
- **POUR `boss-decision`.** Remonter la Méthode **au-dessus** de la grille reste
  le changement de structure au meilleur rapport effort / conversion de la page.
  Le chapô ci-dessus est un palliatif de texte, pas son remplacement.

## D.2 — Les notes sous la grille — **BLOQUANT BL-1**

- **AVANT** (`:170`) — Prix en francs suisses, TVA comprise, **sans frais
  cachés.**
- **AVANT** (`:171`) — Suivi et hébergement dès 49.–/mois, à partir de la 2ᵉ
  année.
- **APRÈS — une seule note, en remplacement des deux :**

  > **Prix en francs suisses, TVA comprise. Le prix annoncé est le prix
  > facturé. La première année d'hébergement et de domaine est comprise ; le
  > suivi commence la 2ᵉ année — 49.–/mois TVA comprise avec La Vitrine et Le
  > Site, 129.–/mois avec L'Assistant, qui ne tourne pas sans lui.**

- **POURQUOI.** `.agents/product-marketing.md` §5 est catégorique : « **Le
  palier 3 impose l'abonnement de suivi** — ce n'est pas une option », à
  129.–/mois, parce que l'assistant consomme des appels d'API en permanence. Un
  acheteur de L'Assistant s'engage donc, en payant 2'499.–, à 129.–/mois à
  partir de la 2ᵉ année. **Le chiffre 129 n'apparaissait nulle part dans le
  tour 1**, et « dès 49.–/mois » faisait lire l'inverse : un plancher
  facultatif. Un prix mensuel obligatoire non annoncé est un prix caché — c'est
  une ambiguïté sur l'engagement au moment de la décision d'achat, avec la LCD
  art. 3 en toile de fond. **Dire la condition la vend** : elle explique
  pourquoi l'assistant fonctionne encore l'année suivante.
  L'ordre est conservé du tour 1 — la première année comprise **avant** le
  montant mensuel — parce qu'un abonnement annoncé avant sa date de départ se
  lit comme un coût immédiat.
- **PREUVE.** §5, « Le récurrent », tableau et paragraphe « Départ la 2ᵉ
  année » ; §5, « Contrainte à ne pas oublier ».

## D.3 — La carte L'Assistant — la condition, et la preuve

- **AVANT** (`Offres.tsx:76-79`) — Tout Le Site, plus : · **L'assistant de ce
  site, sur le vôtre** · Alerte sur votre téléphone à chaque demande · Relance
  automatique et tableau de bord
- **APRÈS** — Tout Le Site, plus : · **L'assistant en bas à droite de cette
  page, sur le vôtre** · Alerte sur votre téléphone à chaque demande · Relance
  automatique et tableau de bord · **Suivi obligatoire à 129.–/mois TVA
  comprise à partir de la 2ᵉ année, la première est comprise — c'est ce qui
  fait tourner l'assistant.**
- **POURQUOI.** Deux corrections en une carte.
  **(a) BL-1** — la condition d'achat s'écrit sur le palier qui l'impose, pas
  seulement en note de bas de grille. C'est la puce la plus honnête de la page,
  et c'est aussi celle qui répond d'avance à « et l'année prochaine, ça marche
  encore ? ».
  **(b) La preuve remonte (revue §6.1).** « L'assistant de ce site » demandait au
  lecteur de faire le lien lui-même ; « l'assistant en bas à droite de cette
  page » lui dit **où regarder**. Le palier 3 tourne sur ce site — c'est la
  seule preuve que le visiteur peut vérifier lui-même, en un clic, sans croire
  personne, et l'agence n'en a pas d'autre.
- **PREUVE.** §5, « Le récurrent » et « Contrainte à ne pas oublier » ; §5,
  encadré « Le palier 3 existe déjà » (`ChatWidget`, `lib/telegram.ts`,
  `/admin`).

## D.4 — Le CTA de la formule *Le Site*

- **AVANT** (`:68`) — Lancer mon site
- **APRÈS** — **Recevoir mes demandes**
- **POURQUOI.** Guide §7 : verbe + bénéfice. Les deux autres cartes tiennent
  déjà la règle ; celle du milieu — la formule recommandée, l'ancrage de la
  grille — est la seule à proposer une action sans bénéfice. « Recevoir mes
  demandes » nomme ce que ce palier ajoute : rendez-vous et devis chiffré.
- **PREUVE.** §5, colonne *Le Site*.

## D.5 — La carte de l'agence — **BLOQUANT BL-2**

- **AVANT** (`CarteDuStudio.tsx:99`) — La carte **du studio**
- **APRÈS** — **La carte de l'agence**
- **AVANT** (`:101`) — Votre site en ligne, le studio reste à disposition — à la
  carte, **sans engagement.**
- **APRÈS** — **Votre site en ligne, l'agence reste là. À la carte, à la
  demande.**
- **AVANT** (`:117`) — Prix indicatifs, TVA comprise — **devis en cinq minutes.**
- **APRÈS** — **Prix indicatifs, TVA comprise. Dites-moi ce qu'il vous faut, je
  chiffre.**
- **POURQUOI.** Le tour 1 remplaçait « sans engagement » — vague et saturé — par
  « **sans abonnement obligatoire** ». **C'est faux pour un tiers de la grille**
  (§5 : le palier 3 impose l'abonnement), et la formule figurait sur la carte
  qui liste justement « En continu ». Une affirmation vague qui ne dit rien est
  un défaut de style ; une affirmation précise qui dit le contraire du contrat
  est un défaut de fond. **Rien ne la remplace** : la promesse de continuité est
  portée par « l'agence reste là », qui est le pilier 3 et qui est vrai sans
  condition. « Devis en cinq minutes » reste retiré — aucune source, et le
  chiffre entrait en concurrence avec la seule promesse de délai du site.
- **PREUVE.** §5, « Le récurrent » ; §8, « Une seule promesse de délai » ;
  réserve B4.

## D.6 — Un libellé de la base de données

- **AVANT** (`prisma/seed.ts:65`) — Site multi-pages / **sur-mesure**
- **APRÈS** — **Site multi-pages — au-delà du one-page**
- **POURQUOI.** « Sur mesure » est relevé chez quatre acteurs sur six et figure
  dans les interdits de la définition de rôle. La description en base dit déjà
  « Au-delà du one-page : périmètre défini ensemble ». **Le `slug`
  `site-sur-mesure` ne change pas** — c'est une clé, pas un texte.
- **PREUVE.** `veille/concurrents.json`, `lexique_recurrent` de C1, C3, C4, C5.

---

# E. MÉTHODE, L'AGENCE, QUESTIONS

## E.1 — Le titre de la Méthode, et les jalons

- **AVANT** (`Methode.tsx:12`) — **Du premier appel** à la mise en ligne : 72
  heures.
- **APRÈS** — **De votre feu vert à la mise en ligne : une semaine.**
- **POURQUOI.** Deux problèmes en une phrase, et un troisième depuis le
  changement de délai. Elle **contredisait la FAQ** de la même page (« le délai
  court dès votre feu vert ») : deux points de départ pour un même délai,
  c'est-à-dire aucun. Elle faisait courir le compteur depuis le premier appel,
  alors que l'étape 01 est un état des lieux qui précède la décision. Et
  « 72 heures » n'existe plus. C'est l'une des **quatre** occurrences autorisées
  de « votre feu vert » (glossaire, entrée 5).
- **PREUVE.** §8, « Une seule promesse de délai » et « Nommer le point de départ
  du délai ».

### Les jalons des étapes — **une conséquence du changement de délai**

- **AVANT** (`:15-18`) — **30 min** · L'état des lieux — **24 h** · La maquette —
  **72 h** · La mise en ligne — **Ensuite** · Le suivi
- **APRÈS** — **30 min** · L'état des lieux — **En début de semaine** · La
  maquette — **En fin de semaine** · La mise en ligne — **Ensuite** · Le suivi
- **POURQUOI.** Le positionnement §8 interdit **tout compte d'heures** : « ni
  72 h, ni 48 h ». « 24 h » en est un, et il annonçait de surcroît un délai de
  maquette qu'aucune source ne porte. Les jalons se disent donc en moments de la
  semaine, ce qui reste concret sans rien inventer. « 30 min » reste : c'est la
  durée d'un rendez-vous, pas une promesse de livraison.
- **PREUVE.** §8, « Une seule promesse de délai » ; guide §5, corollaire.

## E.2 — L'étape 03 et l'étape 04

- **AVANT** (`:17`) — 72 h · La mise en ligne · Domaine, hébergement,
  formulaire, rendez-vous : tout est branché. Vous n'installez rien, vous ne
  configurez rien.
- **APRÈS** — En fin de semaine · La mise en ligne · **Vous voyez le site fini,
  vous validez, vous payez, je mets en ligne. Domaine, hébergement, formulaire,
  rendez-vous : tout est branché. Vous n'installez rien, vous ne configurez
  rien.**
- **AVANT** (`:18`) — Ensuite · Le suivi · Un tarif change, une prestation
  s'ajoute, un horaire bouge ? Un message et **c'est corrigé dans la journée.**
- **APRÈS** — Ensuite · Le suivi · **Un tarif change, une prestation s'ajoute,
  un horaire bouge ? Un message, et je corrige. C'est ce que couvre le suivi, à
  partir de la 2ᵉ année.**
- **POURQUOI.** L'étape 03 taisait la séquence de livraison, qui est la seule
  protection de l'agence contre un impayé et qui ne demande aucune avance au
  client — elle se dit donc mieux qu'elle ne se cache. **Elle est désormais
  répétée en chapô des Offres (§D.1)**, où elle arrive avant le prix ; ici elle
  reste à sa place chronologique. L'étape 04 promettait « dans la journée » :
  engagement de service que rien ne fonde, sur une prestation dont l'agence n'a
  aucun abonné.
- **PREUVE.** §5, « Les conditions », ligne *Livraison* ; §5, « Le récurrent » ;
  §9 (« Revenu récurrent : 0 »).

## E.3 — La section « L'agence »

- **AVANT** (`Studio.tsx:10`) — (05) **Le studio**
- **APRÈS** — **(05) L'agence**
- **AVANT** (`:16`) — Nawa Corps est **le studio d'Ayoub**… la personne qui
  répond à votre message est celle qui dessine et construit votre site.
- **APRÈS** — **Nawa Corps est l'agence d'Ayoub Bensalem** — … *(reste
  inchangé)*
- **AVANT** (`:17`) — **Si les prix sont ceux-là, c'est la structure qui
  l'explique**, pas le travail : pas de bureaux, pas d'équipe commerciale, pas
  de sous-traitance. Ce que vous ne payez pas, ce sont les frais de quelqu'un
  d'autre.
- **APRÈS** — **Pas de bureau, pas d'équipe commerciale, pas de sous-traitance.
  L'agence est une personne — la même le lendemain de la mise en ligne et le
  mois suivant.**
- **POURQUOI.** **MINEUR 6.** La version du tour 1 disait « le studio est petit,
  **et c'est ce qui lui permet** d'être là… ». La charnière causale rouvre
  l'inférence de prix que B6 veut fermer : le trio bureaux / commerciaux /
  sous-traitance est la justification tarifaire classique, et « c'est ce qui lui
  permet » invite le lecteur à finir la phrase lui-même. Les trois faits restent
  écrits — le positionnement §1 les assume désormais publiquement (« **pas de
  bureau** … c'est ce qui explique les prix ») — mais ils servent le pilier 3,
  pas le tarif. « Bureau » au singulier, comme le positionnement.
- **PREUVE.** §1 du positionnement ; `boss-G1-tour1.md`, réserve B6 et test T7 ;
  §3, pilier 3 ; guide §4, « On ne plaide pas le prix ».

- **AVANT** (`:20`) — **72 h** / Refonte livrée
- **APRÈS** — **1 semaine** / **Refonte livrée**
- **POURQUOI.** La case fait trois mots ; le délai y voyage attaché à ce qui est
  livré, ce qui satisfait la règle du guide §5 par sa moitié « livrable ».
- **AVANT** (`:14`) — « Vous parlez à celui qui *fait* le travail. »
- **APRÈS** — *inchangé, mot pour mot* (§8 du positionnement).

## E.4 — Les questions

> ⚠️ **Les libellés ci-dessous sont ceux relevés dans `_inventaire.md` au
> tour 1 ; `components/Faq.tsx` n'a pas été rouvert (deux agents y travaillent).
> À l'apply, relire la chaîne complète avant substitution.**

### Q1 — la question de délai

- **AVANT** (`Faq.tsx:18-19`) — **« 72 heures, vraiment ? »** — « … le délai
  court dès votre feu vert, pas dès que vous m'avez envoyé quelque chose. »
- **APRÈS** — **« Une semaine, vraiment ? »** — **« Oui, et le délai court dès
  votre feu vert, pas dès que vous m'avez envoyé quelque chose : je reprends les
  textes de votre site actuel et je rédige la maquette. Vous n'avez rien à
  préparer. »**
- **POURQUOI.** La réponse était déjà la meilleure du site, et elle reste : elle
  nomme l'attente par défaut du lecteur sans nommer personne, ce qui est la
  seule façon conforme à B2 de rendre le fait perceptible comme un avantage. La
  question change de chiffre ; la réponse gagne la phrase-conséquence (MA-4). Ce
  est l'une des **quatre** occurrences autorisées de « votre feu vert » (hero,
  Offres, Méthode, Q1).
- **PREUVE.** §5, « Les conditions », ligne *Textes* ; §10, n°2, marquée
  tranchée.

### Q3 — l'hébergement et le domaine

- **AJOUT** — la réponse cite déjà 49.–/mois et 129.–/mois. **Y ajouter une
  proposition, en fin de réponse :**
  > **Avec L'Assistant, le suivi à 129.–/mois n'est pas optionnel : c'est lui
  > qui paie les appels du modèle et qui fait que l'assistant répond encore la
  > deuxième année.**
- **POURQUOI.** BL-1 : la condition doit être lisible partout où le lecteur
  cherche le coût réel, et la FAQ est le dernier endroit où il vérifie avant
  d'écrire. Une note d'hébergement qui cite 129.– sans dire qu'il est
  obligatoire laisse croire à un choix.
- **PREUVE.** §5, « Contrainte à ne pas oublier ».

### Q4 — le délai de correction

- **AVANT** (`Faq.tsx:31`) — …Une fois en ligne, un message suffit : un tarif
  qui bouge, une prestation qui s'ajoute, **c'est corrigé dans la journée.**…
- **APRÈS** — **Deux allers-retours sont compris pendant la conception. Une fois
  en ligne, un message suffit : un tarif qui bouge, une prestation qui s'ajoute,
  je corrige. Les modifications de contenu sont comprises dans le suivi de
  L'Assistant ; sur les deux autres formules, elles sont facturées à la
  demande.**
- **POURQUOI.** Même engagement non sourcé qu'en Méthode 04 ; il doit disparaître
  aux deux endroits en même temps, sinon l'une des deux versions fait foi.
- **PREUVE.** §5, « Les conditions » et « Le récurrent ».

### Q5 — la question à remplacer

- **AVANT** (`Faq.tsx:34-35`) — **« Pourquoi moins cher qu'une agence ? »** —
  « … Le travail, lui, est le même — et il est **livré en trois jours au lieu de
  trois mois.** »
- **APRÈS** — **« Qui fait le travail ? »** — **« Moi. Nawa Corps est l'agence
  d'une personne : celui qui répond à votre message est celui qui dessine, écrit
  et construit votre site. Pas de chargé de compte à qui répéter les choses, pas
  de sous-traitant à qui les transmettre. Vous parlez à celui qui fait le
  travail — et c'est encore lui la deuxième année. »** *(56 mots)*
- **POURQUOI.** Trois manquements dans une seule réponse. **(a) B6** : c'est la
  défense de prix la plus explicite du site. **(b) B1** : « trois jours au lieu
  de trois mois » est une affirmation sur le délai des agences ; la veille
  relève des délais publiés allant de 48-72 h à 8 semaines, et « trois mois »
  n'est porté par aucune source. **(c) Glossaire, entrée 3** : « trois jours »
  est une seconde forme du délai. La question de remplacement conserve la phrase
  que le positionnement demande de garder mot pour mot, et fait porter la
  réponse par le pilier 3 — le seul angle que personne du panel ne traite
  frontalement.
- **PREUVE.** Réserves B1 et B6 ; §8 ; `veille/synthese.md`, « Espaces libres » ;
  §5, « Le récurrent ».

> Les cinq questions alimentent le JSON-LD `FAQPage` (`Faq.tsx:39-47`) depuis la
> même constante : la correction se propage seule, et la donnée structurée ne
> peut pas promettre à Google une réponse que la page n'affiche pas.

### Ordre des questions

**Recommandation inchangée :** Q2 (« Je n'ai ni textes ni photos ») en deuxième
position, immédiatement après Q1. Les deux forment le pilier 1 : la première
annonce le délai, la seconde explique pourquoi il tient. *Aucun texte modifié ;
note pour l'implémentation.*

---

# F. PIED DE PAGE ET FORMULAIRE

## F.1 — L'accusé de réception du formulaire — **BLOQUANT BL-5**

- **AVANT** (`ContactForm.tsx:69`) — Message reçu — **réponse sous 24 h.**
- **TOUR 1** *(rejeté)* — Message reçu. **Je vous réponds personnellement** —
  c'est un studio d'une personne, pas un formulaire qui part dans le vide.
- **APRÈS** — **Message reçu. Il arrive chez Ayoub, pas dans une boîte partagée
  — réponse le jour ouvrable suivant.**
- **POURQUOI.** « Sous 24 h » a été retiré parce que l'engagement n'existait ni
  dans le positionnement ni dans la veille. **Ce qui l'avait remplacé était le
  même engagement sans horloge** : « je vous réponds personnellement » est une
  affirmation sur un comportement futur, invérifiable et absente des deux
  référentiels. Plus difficile à démentir, pas mieux fondée. Deux corrections :
  **(a)** un **fait d'architecture** — où arrive le message — qui est documenté
  (§5, encadré « Le palier 3 existe déjà » : tableau de bord des demandes,
  `/admin`) et qui répond à l'inquiétude réelle, *est-ce qu'un humain verra ça ?*
  **(b)** **le seul engagement de réactivité réintroduit** de tout le site.
  « Le jour ouvrable suivant » est tenable un dimanche de décembre, là où
  « sous 24 h » ne l'est pas — et un délai tenu vaut mieux qu'un délai court.
  Une seule occurrence, ici, au moment précis où le visiteur devient joignable.
- **PREUVE.** §5, encadré « Le palier 3 existe déjà » ; §7 (structure d'une
  personne).
- **CONDITION.** Cet engagement doit être **inscrit dans
  `.agents/product-marketing.md`** avant l'apply : c'est une décision
  d'exploitation, pas une formule. Voir `_sans-preuve.md` §C.1.

## F.2 — Les messages d'erreur

- **AVANT** (`ContactForm.tsx:79,84`) — Envoi impossible pour le moment.
  **Écrivez-nous** sur WhatsApp en attendant. / Connexion interrompue.
  **Écrivez-nous** sur WhatsApp en attendant.
- **APRÈS** — Envoi impossible pour le moment. **Écrivez-moi** sur WhatsApp en
  attendant. / Connexion interrompue. **Écrivez-moi** sur WhatsApp en attendant.
- **POURQUOI.** Une seule voix. Tout le site dit « je ». Deux « nous » dans des
  messages d'erreur suffisent à faire entendre une équipe qui n'existe pas.
- **PREUVE.** Guide §4 ; §7 du positionnement.

## F.3 — Le bouton d'envoi — **MINEUR 9**

- **AVANT** (`ContactForm.tsx:128`) — Envoyer →
- **TOUR 1** *(rejeté)* — Envoyer **mon site** →
- **APRÈS** — **Envoyer ma demande →**
- **POURQUOI.** On n'envoie pas son site, on en donne l'adresse : le bouton du
  tour 1 nommait une action que le formulaire ne fait pas. « Ma demande » est le
  glossaire, entrée 6, et c'est exactement ce qui part. La table des CTA du
  guide §7 comporte désormais une ligne pour ce bouton, qui lui manquait — c'est
  ce qui avait obligé le tour 1 à improviser.
- **PREUVE.** Guide §7 et glossaire, entrée 6.

## F.4 — La bande légale du pied de page

- **AVANT** (`FooterContact.tsx:59-62`) — **Studio digital — Genève** · Sites ·
  Devis · Rendez-vous · Mentions légales · Confidentialité
- **APRÈS** — **Agence digitale — Genève** · *(le reste inchangé)*
- **POURQUOI.** §A.3 et §I : une seule catégorie sur tout le site.
- **PREUVE.** §1 du positionnement.

---

# G. MÉTADONNÉES

- **AVANT** (`app/(site)/layout.tsx:55`, title par défaut) — Refonte de site
  pour PME à Genève — **livré en 72 h**
- **APRÈS** — **Refonte de site pour PME à Genève — livré en une semaine**
  *(56 caractères)*
- **AVANT** (`:59`, meta description) — Nawa Corps refait le site des PME
  genevoises **en 72 heures** : demande de devis… Dès 699.–, TVA comprise.
- **APRÈS** — **Refonte du site des PME genevoises en une semaine, sans rien à
  préparer : demande de devis, prise de rendez-vous, fiche Google. Dès 699.–,
  TVA comprise.** *(152 caractères — sous la coupure de Google, vérifié)*
  > *Le nom de marque quitte la description : le `title` le porte déjà via le
  > template `%s — Nawa Corps` (`:56`), et les caractères ainsi libérés servent
  > au bénéfice n°1.*
- **AVANT** (`:68` et `:74`, og et twitter) — **Votre site a dix ans.** En 72
  heures il reçoit les demandes, chiffre les devis et prend les rendez-vous. Dès
  699.–, TVA comprise.
- **APRÈS** — **Un site qui reçoit vos demandes, refait en une semaine : devis,
  rendez-vous, fiche Google. Vous n'avez rien à préparer — les textes sont
  repris de votre site actuel. Dès 699.–, TVA comprise.** *(190 caractères ; og
  n'a pas de plafond dur, Twitter tronque vers 200 — dans la marge, mais c'est
  le maximum admissible)*
- **AVANT** (`:66`, `:72`, og et twitter title) — Refonte de site pour PME à
  Genève — **livré en 72 h**
- **APRÈS** — **Refonte de site pour PME à Genève — livré en une semaine**
- **POURQUOI.** Le délai est faux dans les quatre chaînes, et l'aperçu partagé
  doit dire la même chose que le hero, sinon le visiteur arrive sur une autre
  promesse que celle qui l'a fait cliquer. Le mot-clé cible reste en tête du
  `title` et de la description. « 72 h » était toléré par le tour 1 dans les
  métadonnées faute de place ; la tolérance disparaît avec le chiffre.
- **PREUVE.** §3, §8, §9 ; grille §5.

---

# H. Points ouverts propres à cette page

1. **Le carrousel doit être refait, pas seulement reformulé.** Les réécritures
   du §B retirent l'exposition juridique et la moquerie ; elles ne règlent pas
   que **quatre pièces sur cinq relèvent de la restauration**, c'est-à-dire de
   la ligne que le positionnement place hors de la grille principale. Un
   visiteur qui cherche une refonte de site voit un menu, une affiche, une carte
   de fidélité, et un seul site. **Décision pour Boualem :** reconstruire au
   moins la pièce « Le site » autour d'un métier de l'ICP — garage, fiduciaire,
   plombier — ou obtenir la première référence réelle (§6, option 1), qui rend
   toute la section inutile en la remplaçant.
2. **La carte de visite du carrousel affiche des coordonnées non confirmées** en
   grand (`feature-carousel.tsx:265-267` lit `CONTACT` alors que
   `NAP_CONFIRME = false`). Ce n'est pas du copy : c'est un numéro de téléphone
   fictif rendu à l'écran comme s'il était réel.
3. **« La carte » : fiction ou preuve réelle ?** Voir §B.4, qui porte les deux
   réécritures. C'est la seule question de ce fichier qui **bloque l'apply** :
   tant qu'elle n'est pas tranchée, on ne sait pas si la pièce doit être
   anonymisée ou au contraire mise en avant comme la seule référence
   authentique de l'agence.
4. **Le « 0 » du hero (§A.6) est une décision de `boss-decision`**, pas du copy
   seul : elle engage la maquette du temps 3 et le sens du bloc le plus visible
   du site. Le repli littéral (« 1 / semaine ») est prêt.
5. **`CLAUDE.md` annonce encore « 72 heures » et « studio digital »** (§ Le
   projet, « Offre » et « Le projet », première ligne). Le fichier est hors de
   mon périmètre d'écriture ; tant qu'il n'est pas corrigé, le prochain agent
   lira un délai périmé dans le document que le harnais charge en premier.

---

# I. Le renommage « studio » → « agence » — inventaire complet

Le positionnement §1 pose « **agence digitale** indépendante à Genève » et §3
revendique « **l'agence** qui remet à niveau le site des PME genevoises ». Le
glossaire du guide n'admet qu'un mot par concept : « le studio » sort du texte
public. **Dix textes visibles sont concernés**, et ils doivent changer
**ensemble**, sinon le site annonce deux catégories d'un écran à l'autre.

| # | Fichier:ligne | AVANT | APRÈS |
|---|---|---|---|
| 1 | `NoyauHero.tsx:29-31` | Studio digital indépendant | **Agence digitale indépendante** |
| 2 | `Loader.tsx:39` | Studio digital — Genève | **Agence digitale — Genève** |
| 3 | `FooterContact.tsx:59` | Studio digital — Genève | **Agence digitale — Genève** |
| 4 | `Travaux.tsx:23` | Cinq pièces faites par le studio | **… par l'agence** |
| 5 | `CarteDuStudio.tsx:99` | La carte du studio | **La carte de l'agence** |
| 6 | `CarteDuStudio.tsx:101` | le studio reste à disposition | **l'agence reste là** |
| 7 | `CarteDuStudio.tsx:113` | établissements déjà suivis par le studio | **… par l'agence** |
| 8 | `Studio.tsx:10` | (05) Le studio | **(05) L'agence** |
| 9 | `Studio.tsx:16` | Nawa Corps est le studio d'Ayoub | **Nawa Corps est l'agence d'Ayoub Bensalem** |
| 10 | `Faq.tsx:35` *(Q5 réécrite)* | un studio d'une personne | **l'agence d'une personne** |

**Hors périmètre du renommage** : le nom du composant `CarteDuStudio.tsx` et le
fichier `Studio.tsx` — ce sont des noms de code, pas des textes. Le guide n'y
touche jamais.

**Réserve honnête.** Le positionnement emploie encore « le studio » dans sa
prose (§5, §8, §9) tout en posant « agence digitale » comme catégorie (§1, §3).
J'applique la catégorie, parce que c'est elle qui est affichée. **Si Boualem
préfère garder « le studio » en prose et « agence digitale » comme seule
étiquette de catégorie, seules les lignes 1 à 3 du tableau s'appliquent** — et
le glossaire du guide doit alors être corrigé en conséquence. C'est une question
d'une ligne, mais elle touche dix chaînes : à trancher avant l'apply.
