# Diagnostic du tunnel de vente — Nawa Corps

> Relevé le 2026-08-31, sur `http://localhost:3000` (serveur `next dev`, branche
> `feat/conversion-pme`, HEAD `cae3c4c`) et sur le code du dépôt.
> Chrome, viewport **1446 × 904** ; contre-mesure à **1301 × 813**.
> Analyse seule — aucun fichier du site n'a été modifié.

---

## 0. Ce que j'ai mesuré, ce que je suppose

Le second analyste doit pouvoir contester chaque ligne. Je sépare donc trois
registres, et je les marque dans tout le document :

- **[M]** — mesuré à l'écran ou lu dans le code, reproductible.
- **[S]** — supposition de mécanisme. Défendable, mais non mesurée ici.
- **[R]** — règle imposée par le brief ou par `.agents/product-marketing.md`.

Deux faits **[R]** commandent tout le reste : **un client, zéro référence de
site**. Aucune recommandation de ce document n'invente une preuve, ne propose
d'urgence artificielle, ni ne demande d'afficher un prix sur une ligne qui n'en
a pas — c'est une décision du propriétaire, motivée dans `lib/familles.ts`
(`MENTION_DEVIS`), et elle est bonne.

### État de la restructuration au moment du relevé

Deux agents travaillent en parallèle. Constaté pendant l'analyse :

| Route | Statut mesuré |
|---|---|
| `/prestations` et son arborescence | supprimées → **404** |
| `/services`, `/services/<formule>`, `/services/<famille>` | **200** |
| `/studio` | **200** (apparue en cours d'analyse) |
| `/contact` | **404** — pas encore créée |

En début d'analyse l'accueil rendait **16 liens `/prestations/*` morts** ; ils
pointent désormais sur `/services/*` et résolvent. Le point est réglé, je le
consigne seulement pour dater les mesures qui suivent.

**J'analyse la cible.** Chaque constat ci-dessous est écrit pour rester vrai
quand « Offres » et « Prestations » auront quitté la nav, que « Services »
sera un déroulant, et que `/contact` existera.

---

## 1. Le tunnel réel, mesuré

### 1.1 La carte du parcours

Accueil, `1446 × 904`, page de **13 026 px = 14,4 écrans**. Position de chaque
section, en pixels et en écrans de défilement :

| Écran | Section | Ce qu'on peut y faire |
|---:|---|---|
| 0,00 | Hero, temps 1 | — |
| 0,86 | Pied du hero | **« Faire refaire mon site → »** (WhatsApp) · « Voir les avant / après » (ancre) |
| 0,92 | Bulle du chat (fixe) | ouvrir l'assistant |
| 1,0–3,7 | Hero, temps 2, 3, 4 | « Voir les avant / après → » (2ᵉ occurrence du même lien) |
| **3,74** | (01) Travaux | **aucun lien** |
| 5,37 | (02) Services | **aucun lien** |
| 6,52 | (03) Méthode | **aucun lien** |
| 7,43 | (04) Le studio | **aucun lien** |
| 8,31 | (05) Questions | **aucun lien** |
| **9,08** | (06) Offres | 3 boutons de prix → WhatsApp |
| 10,6 | La carte du studio | 14 cartes → pages de famille · 1 « Demander un devis » → assistant |
| 12,63 | (07) Contact | WhatsApp · mailto · formulaire |
| 13,5 | Formulaire | « Envoyer ma demande » |

**[M]** Vérification directe des cinq sections centrales, exécutée dans la
page :

```
travaux : 0 <a>, 8 <button> (les commandes du carrousel)
services: 0 <a>, 0 <button>
methode : 0 <a>, 0 <button>
studio  : 0 <a>, 0 <button>
faq     : 0 <a>, 0 <button>
```

**Entre l'écran 0,86 et l'écran 9,08 — 8,2 écrans, soit 57 % de la page —
le flux de contenu ne contient pas un seul lien.** Ni vers une page produit,
ni vers le contact, ni vers un prix. Les deux seules portes qui subsistent sont
hors flux : la pastille « Parlons-en » de la nav (`position:fixed`, vérifié) et
la bulle du chat (`position:fixed`, vérifié). Aucune des deux n'est
contextuelle : la bulle affiche le même libellé qu'on lise la Méthode ou la FAQ.

### 1.2 Combien de gestes séparent l'arrivée de la demande

Depuis l'accueil, chemin le plus court **mesuré** :

1. **1 geste** — clic sur « Faire refaire mon site » à l'écran 0,86 → sort du
   site vers WhatsApp.
2. **1 geste** — clic sur la bulle du chat → assistant (voir §2.3, il ne
   répond pas à la question posée).
3. **~9,5 écrans de défilement + 1 clic** — les boutons de la grille de prix →
   WhatsApp.
4. **~13,5 écrans + 3 champs + 1 clic** — le formulaire.

Il n'existe **aucun chemin** de l'accueil vers les trois pages produit
(`/services/la-vitrine`, `/services/le-site`, `/services/l-assistant`) —
voir C4.

### 1.3 Où mènent réellement les huit CTA d'achat

**[M]** L'accueil rend **8 liens `wa.me`**. Six sortent effectivement du site ;
deux seulement sont interceptés par `components/BoutonDevis.tsx` pour ouvrir
l'assistant (le `href` reste WhatsApp comme filet sans JS — bonne pratique).

| Libellé | Fichier | Comportement réel |
|---|---|---|
| Faire refaire mon site → | `NoyauHero.tsx:134` | WhatsApp, nouvel onglet |
| Refaire mon site | `Offres.tsx:203-211` | WhatsApp, nouvel onglet |
| Lancer mon site → | `Offres.tsx:203-211` | WhatsApp, nouvel onglet |
| Automatiser mes demandes | `Offres.tsx:203-211` | WhatsApp, nouvel onglet |
| Demander un devis → (ligne sur devis) | `Offres.tsx:221` | **ouvre l'assistant** |
| Demander un devis → (carte du studio) | `CarteDuStudio.tsx:169` | **ouvre l'assistant** |
| Écrire sur WhatsApp → | `FooterContact.tsx:38` | WhatsApp, nouvel onglet |
| (menu plein écran) WhatsApp | `MenuOverlay.tsx` | WhatsApp, nouvel onglet |

Trois mécaniques différentes derrière des boutons de même dessin. Le visiteur
ne peut pas prévoir ce qui va se passer.

---

## 2. Les constats, classés par impact sur le chiffre d'affaires

---

### C1 — Au point de décision, il n'y a qu'une porte, et elle sort du site

**Où** — `components/Offres.tsx:49-88` (les trois `ctaHref`) et `:202-212` (le
rendu). Accueil, écran 9,5.

**Ce qui se passe** — **[M]** Les trois cartes de prix rendent un `<a
target="_blank" href="https://wa.me/…">`. Elles ne passent **pas** par
`BoutonDevis`, contrairement aux deux « Demander un devis » de la même page.
Au moment exact où le visiteur a lu 699 / 1'499 / 2'499 et choisi, la seule
action offerte est de quitter le site pour une application tierce.

À cet endroit il n'y a : **aucun formulaire**, **aucun numéro de téléphone**
(le seul `tel:` de la page est à l'écran 13,5, dernière ligne du pied de page,
**[M]** un seul `href="tel:"` sur tout le document), **aucune adresse e-mail**,
**aucun lien vers la page de la formule**.

**Le mécanisme** — trois effets se cumulent, et aucun ne suppose que WhatsApp
soit un mauvais canal (il ne l'est pas pour une PME genevoise) :

1. **Le contexte est perdu.** Le message pré-rempli est générique
   (« Bonjour, je veux un site qui reçoive les demandes de devis. »). Rien ne
   dit quelle formule a été regardée, ni depuis quelle page. Le studio reçoit
   une phrase, pas une demande.
2. **Aucun repli.** Le clic ouvre un onglet. Si WhatsApp n'est pas disponible
   sur cet appareil — poste de bureau sans session WhatsApp Web liée — le
   visiteur se retrouve devant un écran d'appairage, dans un onglet qui n'est
   plus le site. **[S]** Je n'ai pas mesuré la part d'appareils concernés ; le
   mécanisme, lui, est certain, parce que le site n'offre rien d'autre à cet
   endroit.
3. **L'engagement demandé est asymétrique.** Écrire sur WhatsApp, c'est donner
   son numéro personnel et ouvrir une conversation permanente avec un numéro
   qu'on ne connaît pas encore. C'est plus engageant qu'un formulaire à trois
   champs, et c'est demandé **avant** toute preuve.

**Ce qu'il faut faire** — garder WhatsApp, et **ajouter une seconde porte au
même endroit** : sous les trois cartes, une ligne qui offre le téléphone
(`tel:` cliquable, avec les horaires déjà écrits « Lu–Sa · 9h–19h ») et un
renvoi ancré vers le formulaire. Faire passer les trois boutons de carte par
`BoutonDevis` avec un `sujet` par formule (`devis-la-vitrine`,
`devis-le-site`, `devis-l-assistant` — ils existent déjà dans
`lib/formules.ts`), pour que le contexte survive au clic.

**Effort** — 0,5 jour. Le composant `BoutonDevis` et les `sujet` existent déjà.

---

### C2 — L'abonnement obligatoire de L'Assistant est révélé 247 px **après** le bouton

**Où** — `components/Offres.tsx:133-142` (calcul de `noteSuivi`) et `:227-235`
(rendu). Accueil, section Offres.

**Ce qui se passe** — **[M]** Mesures dans la page, section Offres :

```
prix « 2'499.– CHF »            y = 11 321
bouton « Automatiser mes demandes »  y = 11 589   (+268 px)
note « … 129.–/mois obligatoire avec L'Assistant »  y = 11 836   (+247 px après le bouton)
```

La carte de L'Assistant affiche : le prix, « TVA comprise », trois puces
(« Tout Le Site, plus : », « L'assistant de ce site, sur le vôtre », « Alerte
sur votre téléphone… », « Relance automatique et tableau de bord »), puis le
bouton. **Aucune de ces lignes ne mentionne l'abonnement.** Le montant
obligatoire n'apparaît que dans une note de bas de grille, en petit, après
avoir traversé une ligne « Site à plusieurs pages — sur devis » et une mention
de TVA.

Le coût réel sur trois ans est donc **2'499 + 2 × 1'548 = 5'595.–**, dont
3'096.– ne sont pas lisibles là où la décision se prend.

**Le mécanisme** — ce n'est pas une opinion : le docblock du fichier
lui-même écrit l'intention (`Offres.tsx:111-124`) — *« un prix mensuel imposé
par un palier et passé sous silence est un prix caché, et il s'annonce sur la
carte du palier comme sous la grille »*. **Le code n'implémente que la seconde
moitié.** La page `/services/l-assistant`, elle, fait le travail correctement :
`app/(site)/services/[slug]/page.tsx:265-268` place `<b>129.–/mois</b><span>Suivi
obligatoire</span>` dans le même bandeau `.facts` que le prix du site, **avant**
le bouton, et `:276-284` développe la raison. La grille de l'accueil est donc
la seule surface du site qui présente ce prix comme complet.

Un prix découvert après le clic produit exactement l'effet inverse de celui
recherché sur un studio sans référence : le visiteur qui l'apprend en
conversation conclut que le reste est peut-être incomplet aussi. C'est le seul
constat de ce document qui touche à un **interdit du brief** (« prix caché »).

**Ce qu'il faut faire** — porter le motif de `/services/[slug]` dans la carte :
sous le montant, une ligne `+ 129.–/mois de suivi, obligatoire, dès la 2ᵉ année`,
lue en base par le slug `suivi-assistant` comme partout ailleurs. Se refermer
sans chiffre si la ligne est masquée depuis `/admin`, comme le fait déjà
`noteSuivi`.

**Effort** — 1 h. Le calcul (`montant("suivi-assistant")`) est déjà dans le
fichier, ligne 125-131.

---

### C3 — L'assistant, présenté comme la preuve du produit, ne répond pas à la question posée

**Où** — `lib/chat-prompt.ts:63-77` (« Déroulé imposé ») et
`components/ChatWidget.tsx:171` (le libellé de la bulle).

**Ce qui se passe** — **[M]** Deux appels réels à `/api/chat` sur le serveur
local, transcription exacte :

> **Visiteur** — « Bonjour, je suis plombier à Genève, mon site date de 2014.
> Combien pour le refaire ? »
> **Assistant** — « Quel est votre métier et quel support souhaitez-vous faire
> créer ou refondre ? (site, logo, cartes de visite, photos, etc.) »

> **Visiteur** — « Plombier. Un site. Je vous ai demandé le prix : combien ça
> coûte ? »
> **Assistant** — « Quel problème principal rencontrez-vous avec votre site
> actuel ? (ex. prise de rendez-vous impossible, visibilité sur Google,
> affichage sur mobile, etc.) »

Deux tours, deux questions déjà répondues reposées, et la question de prix
ignorée deux fois — alors que le prompt **injecte le catalogue complet depuis
Postgres** (`chat-prompt.ts:40-46`) et autorise explicitement à citer 699.–.

**Le mécanisme** — la combinaison de « Déroulé imposé : 1… 2… 3… 4… 5… » et de
« **UNE seule question par message** » (`chat-prompt.ts:62`) fait avancer le
script au lieu de traiter ce qui vient d'être dit. Le prompt n'a aucune règle
du type « ne repose jamais une information déjà donnée » ni « réponds d'abord,
demande ensuite ».

L'impact dépasse le chat, et c'est pourquoi ce constat est haut :

- **[M]** `components/ServicesRows.tsx:62` promet, sur l'accueil : *« Il tourne
  sur ce site : la bulle en bas de l'écran, c'est lui — ouvrez-la, c'est la
  démonstration. »* Et `lib/formules.ts:236` répond, sur la page à 2'499.– :
  *« Ouvrez-le et posez-lui une question — c'est le produit, pas une
  démonstration. »*
- **[R]** `.agents/product-marketing.md` §5 : *« Le site du studio est la
  démonstration du produit. »*
- Avec **zéro référence de site**, cet assistant est **la seule preuve
  fonctionnelle** que le studio possède. Un prospect qui l'ouvre pour vérifier
  la promesse du palier 3 obtient un formulaire déguisé en conversation.

**Risque adjacent [M, non re-mesuré]** — `lib/llm.ts:73-76` consigne, daté du
2026-08-23 : *« le quota se compte PAR MODÈLE — 20 requêtes par jour
chacun »*. Or `app/api/chat/route.ts:31` fixe un budget applicatif de **200
requêtes/jour**. Le plafond réel est donc dix fois inférieur à celui que
l'application croit avoir, et l'application ne peut pas le savoir : au-delà,
elle rend `503` et affiche « Assistant indisponible ». Quatre conversations de
cinq tours suffisent à épuiser la journée. **[S]** je n'ai pas re-sondé le
quota Gemini ; le commentaire du dépôt demande lui-même une re-mesure avant
toute décision.

**Ce qu'il faut faire** —
1. Réécrire le déroulé en **règle de priorité** plutôt qu'en séquence :
   *« Réponds d'abord à ce qui est demandé si la réponse est dans le catalogue.
   Ne repose jamais une information déjà donnée. Puis pose la question
   suivante encore sans réponse. »* Conserver « une question par message ».
2. Re-sonder le quota du modèle et faire remonter un signal quand le repli
   `fallback` se déclenche — un assistant qui tombe est plus coûteux qu'un
   assistant absent, parce qu'il tombe précisément devant celui qui vérifiait.
3. **Ne pas ajouter de bouton d'ouverture supplémentaire tant que le point 1
   n'est pas corrigé** : multiplier les portes vers un assistant qui déçoit
   multiplie la déception.

**Effort** — 2 h pour le prompt + re-tests. La sonde de quota : 1 h.

---

### C4 — La grille de prix de l'accueil ne mène à aucune page produit

**Où** — `components/Offres.tsx:202-212`, à comparer à
`app/(site)/services/page.tsx:410-417`.

**Ce qui se passe** — **[M]** Comptage des liens `/services*` rendus par
l'accueil :

```
/services                 2
/services/identite        2
/services/imprimes        3
/services/reseaux-sociaux 1
/services/restauration    5
/services/suivi           3
/services/la-vitrine      0
/services/le-site         0
/services/l-assistant     0
```

**Seize liens vers le catalogue, zéro vers les trois pages de formule.**

Le contraste est net : la même grille rendue sur `/services` affiche, sur
chaque carte, un `« Voir la formule → »` interne
(`app/(site)/services/page.tsx:410-417`). L'accueil, lui, remplace ce lien par
un bouton WhatsApp.

**Le mécanisme** — les trois pages produit portent l'argumentaire le plus
complet du site : `SOCLE` + `apporte` (« Ce que vous recevez »), « Ce qui n'est
pas inclus » avec le palier vers lequel monter, trois questions propres à la
formule, le suivi obligatoire au bon endroit, un JSON-LD `Service` avec
`offers`. Ce contenu est **orphelin de la page la plus visitée**. Le seul
chemin qui y mène passe par un lien de nav aujourd'hui libellé « Prestations »,
puis par la grille de `/services` — deux pages plus loin.

Or c'est exactement le visiteur qui hésite entre deux paliers qui a besoin de
ces pages : celui qui est déjà décidé clique sur WhatsApp, celui qui hésite n'a
nulle part où aller sauf en arrière.

**Ce qu'il faut faire** — ajouter sur chaque carte de la grille d'accueil, à
côté du CTA de contact, le lien `« Voir ce qui est inclus → »` vers
`/services/<slug>`, conditionné par `estFormule(service.slug)` comme le fait
déjà `/services`. Cela devient d'autant plus critique quand « Offres »
disparaîtra de la nav : la grille de l'accueil sera alors le seul point
d'entrée vers les pages produit.

**Effort** — 30 min. Le motif exact est à copier depuis
`app/(site)/services/page.tsx:410-417`.

---

### C5 — Le seul argument qui annule le risque est absent du point de décision

**Où** — `app/(site)/studio/page.tsx:275` (nouvelle page) ;
`components/Studio.tsx:53` ; `components/ServicesRows.tsx:54`.

**Ce qui se passe** — **[M]** La séquence de livraison — *« Le site fini vous
est présenté et validé. Le paiement intervient à la livraison, et la mise en
ligne suit. »* — n'est écrite en toutes lettres **que sur `/studio`**. Sur
l'accueil, elle est réduite à une incise (« présenté et validé avant d'être mis
en ligne ») dans le deuxième paragraphe de la section « Le studio » (écran 7,4)
et dans un accordéon replié de la section Services (écran 5,4). **Le mot
« paiement » n'apparaît nulle part sur l'accueil.** Recherche sur tout
`components/` et `app/` : trois occurrences, toutes sur `/studio`.

Sous la grille de prix, la seule borne écrite est
`« Deux allers-retours de correction compris »`.

**Le mécanisme** — **[R]** Le studio a un client et zéro référence de site. La
question que se pose le lecteur devant 1'499.– n'est pas « est-ce cher », c'est
**« qu'est-ce que je risque si ça ne me convient pas ? »**. La réponse existe et
elle est excellente : *vous voyez le site fini, vous validez, vous payez, et
c'est seulement ensuite qu'il est mis en ligne*. Aucun acompte, aucune avance.

C'est la seule chose du site qui répond au risque perçu **sans avoir besoin
d'une preuve sociale**. Elle est aujourd'hui à sept écrans du prix, dans un
paragraphe qui parle d'autre chose, et sur une page que le visiteur n'a aucune
raison d'ouvrir avant d'avoir décidé.

**Ce qu'il faut faire** — remonter la séquence de livraison **sous la grille**,
à côté des deux allers-retours, en une phrase de la voix du site :
*« Vous voyez le site fini avant de payer, et la mise en ligne suit le
paiement. »* Et ajouter la même question à la FAQ, qui est rendue **avant** le
prix (bon choix, cf. §3) : *« Et si le résultat ne me convient pas ? »* — la
réponse est un fait d'exploitation écrit au positionnement §5, pas une
promesse nouvelle.

**Effort** — 1 h (`Offres.tsx` note de pied + une entrée dans
`Faq.tsx:construireQuestions`).

---

### C6 — Neuf écrans de contenu sans une seule sortie

**Où** — `app/(site)/page.tsx:128-138` (l'ordre des sections) et les cinq
composants concernés.

**Ce qui se passe** — **[M]** voir §1.1 : `Travaux`, `Services`, `Méthode`,
`Le studio`, `Questions` — écrans 3,74 à 9,08 — contiennent **0 élément `<a>`**.

**Le mécanisme** — ces cinq sections sont précisément celles qui font monter
l'intention : la démonstration, les six gestes, la semaine, la personne, les
objections. Le lecteur y passe par des paliers de conviction successifs, et à
chaque palier la seule chose qu'il peut faire est **continuer à descendre**.
L'intention d'un lecteur ne suit pas la mise en page : celui qui est convaincu
par « Vous parlez à celui qui fait le travail » à l'écran 7,4 est prêt **à cet
instant**, et il lui reste 1,7 écran avant de voir un prix, 6 avant un
formulaire.

Le brief demande si l'ordre convainc. **L'ordre est bon** — voir §3 — ; c'est
son *équipement* qui manque.

**Ce qu'il faut faire** — poser une sortie contextuelle en fin de chacune des
cinq sections, une seule par section, qui dit ce qu'elle ouvre :

| Section | Sortie |
|---|---|
| Travaux | « Voir les formules et les prix → » vers `#offres` |
| Services | 6 liens, un par geste, vers la page de famille correspondante (`/services/<famille>`) — les pages existent, elles ne sont liées que depuis la carte du studio, huit écrans plus bas |
| Méthode | « Ce que vous recevez → » vers `/services/le-site` |
| Le studio | « Qui tient le studio → » vers `/studio` |
| Questions | « Poser la vôtre → » vers le formulaire (ou `/contact` quand il existera) |

Aucune de ces sorties n'est un CTA d'achat : ce sont des passerelles vers du
contenu qui existe déjà et qui n'est atteignable par aucun chemin naturel.

**Effort** — 0,5 jour, entièrement éditorial, aucun CSS nouveau (`.lnk` et
`.btn-line` existent).

---

### C7 — La preuve est fictive, alors qu'une preuve réelle existe et n'est pas montrée

**Où** — `components/ui/feature-carousel.tsx:389-425` (les cinq pièces) ;
`components/Travaux.tsx:20-23` (le titre et le chapô).

**Ce qui se passe** — **[M]** La section (01), nommée **« Travaux »** dans la
page et dans la nav, titrée *« Tout a un avant. Voici les après. »*, présente
cinq pièces, toutes construites autour d'un établissement fictif nommé
« Le Comptoir » :

| # | Pièce | Nature |
|---|---|---|
| 01 | La carte (menu de bar) | restauration |
| 02 | Le site | site — **la seule pièce du produit d'entrée** |
| 03 | La carte de visite | imprimé |
| 04 | L'affiche | restauration (soirée jazz) |
| 05 | La fidélité | restauration |

Le chapô dit honnêtement *« Cinq démonstrations du studio »*, et le travail
d'étiquetage à l'intérieur des maquettes est sérieux (« Exemple de mise en page
— démonstration », « Démonstration — établissement fictif », suppression des
détails localisables — le fichier documente tout cela lignes 210-217). **Rien
ici n'est trompeur.**

**Le mécanisme** — le problème n'est pas la sincérité, c'est l'adéquation.
Trois écarts, tous mesurables :

1. **Le mot « Travaux »** désigne, pour un dirigeant, un portfolio de
   réalisations. Le chapô corrige, mais il arrive après le titre et après
   l'index de nav.
2. **Quatre pièces sur cinq relèvent de la ligne restauration**, c'est-à-dire
   de **l'ancien positionnement**. **[R]** `.agents/product-marketing.md` §2 :
   la restauration *« ne définit plus le studio »*. Le premier écran de preuve
   qu'un plombier ou une fiduciaire rencontre est un menu de bar, puis une
   affiche de soirée jazz.
3. **La pièce qui compte est en position 02**, et l'autoplay tourne toutes les
   4,2 s : le visiteur voit d'abord « La carte ».

**Et la preuve réelle est absente.** **[R]** `.agents/product-marketing.md` §6
recense **une carte de restaurant réellement réalisée par Ayoub pour un client
payant**, utilisable avec l'accord du client. Le carrousel montre à sa place une
carte **fictive**. C'est le seul travail client existant, et il n'est nulle part.

**Ce qu'il faut faire** — sans rien inventer, dans cet ordre :

1. **Remplacer la pièce 01 par la vraie carte**, avec l'accord écrit du client,
   et l'étiqueter pour ce qu'elle est : *« Réalisé pour un client — Genève »*.
   Une seule pièce réelle change la nature de toute la section.
2. **Mettre « Le site » en position 01** tant que la pièce réelle n'est pas
   disponible : le produit d'entrée doit ouvrir la démonstration.
3. **Renommer la section.** « Travaux » promet des réalisations ; « Avant /
   après » ou « Démonstrations » décrit ce qu'on montre. Le titre
   *« Tout a un avant. Voici les après. »* fonctionne avec les deux.
4. **Ajouter la sixième preuve, qui est le site lui-même** : l'assistant, la
   notification Telegram et le tableau de bord tournent ici. C'est vérifiable
   à l'instant, ce n'est pas une référence, et cela ne demande le consentement
   de personne. Condition : que C3 soit corrigé d'abord.
5. **Travaux 101 Agency**, réseaux sociaux, avec la mention du rôle
   (« réalisé au sein de 101 Agency ») et l'accord du partenaire —
   `.agents/product-marketing.md` §6 et §7 le prévoient et le bornent.

**Ce qu'il ne faut pas faire** — inventer un témoignage, un compteur de
clients, une note ou un logo. **[R]** LCD art. 3 ; et le site s'en garde
aujourd'hui avec rigueur, y compris dans son JSON-LD (aucun `aggregateRating`,
vérifié).

**Effort** — 1 à 3 pour le réordonnancement et le renommage : 1 h. Point 1 :
1 jour + dépendance externe (accord du client, photographie de la pièce).
Point 5 : dépend de l'accord de 101 Agency, non tenu par le site.

---

### C8 — Le formulaire demande le téléphone, jamais l'e-mail, et ne dit pas quand on répond

**Où** — `components/ContactForm.tsx:189-197` et `:176` ;
`components/FooterContact.tsx:47`.

**Ce qui se passe** — **[M]** Trois champs : nom (requis), **téléphone
(requis)**, message (facultatif). **Aucun champ e-mail**, ni requis ni
facultatif. Le schéma serveur confirme : `app/api/contact/route.ts:31-36`
n'accepte que `name`, `phone`, `message`.

**[M]** Au-dessus du formulaire, une seule ligne : *« ou dites-moi en deux
lignes ce qu'il vous faut »*. La mention **« Réponse le jour ouvrable
suivant »** n'y figure pas. Recherche exhaustive : elle est rendue quatre fois
sur le site — trois dans le chat (`ChatWidget.tsx:171, 181, 224`) et une dans
la carte du studio (`CarteDuStudio.tsx:165`, via `MENTION_REPONSE`) —
**jamais au formulaire**. Le commentaire de `ContactForm.tsx:145-151` affirme
pourtant qu'*« il est déjà écrit au-dessus du formulaire »* : l'affirmation est
fausse dans le code livré.

Aucun lien vers `/confidentialite` non plus, alors que le panneau du chat en
porte un (`ChatWidget.tsx:193-196`) et que la page de confidentialité nomme
explicitement les champs du formulaire (`confidentialite/page.tsx:44`).

**Le mécanisme** —

1. **Téléphone obligatoire = « vous allez être appelé ».** Un dirigeant qui
   explore, à 22 h, sans vouloir décrocher demain, n'a aucune voie écrite : la
   seule alternative offerte à cet endroit est WhatsApp — donc encore son
   numéro. Le studio ferme les deux portes non téléphoniques d'un coup.
2. **Sans e-mail, on ne peut pas envoyer de devis.** Le studio annonce partout
   *« une proposition chiffrée le jour ouvrable suivant »* — y compris dans le
   prompt de l'assistant (`chat-prompt.ts:74-77`). Une proposition chiffrée
   s'envoie par écrit. Le formulaire ne collecte pas le canal du produit qu'il
   vend.
3. **Aucun engagement de délai au moment du clic.** « Envoyer ma demande » est
   un bon libellé, mais le visiteur ne sait pas ce qu'il obtient en échange.
   L'engagement existe, il est tenable, il est validé
   (`.agents/product-marketing.md` §5) — il n'est simplement pas là.

**Ce qu'il faut faire** — ajouter un champ **e-mail facultatif** ; rendre le
téléphone facultatif **si** l'e-mail est rempli (et l'inverse), avec un
message clair ; afficher `MENTION_REPONSE` au-dessus du bouton, lue depuis
`lib/familles.ts` ; ajouter le lien `/confidentialite` sous le bouton, comme
le fait le chat. **[R]** Aucune case pré-cochée, aucun consentement implicite.

**Effort** — 2 h côté formulaire + schéma Zod (`route.ts:31`) + modèle `Lead`
(vérifier que le champ e-mail existe côté Prisma — `SchemaExtraction` du chat
en manipule déjà un, `finalize/route.ts:54`).

---

### C9 — « Sur devis, chiffré après deux questions » : les deux questions n'existent nulle part

**Où** — `lib/format.ts:60` (`QUOTE_NOTE`), rendu par
`components/CarteService.tsx:162` sur les cartes de la vitrine.

**Ce qui se passe** — **[M]** Treize lignes sur dix-huit portent « sur devis ».
Sur l'accueil, quatre d'entre elles affichent en plus *« chiffré après deux
questions »*. Le raisonnement complet — `MENTION_DEVIS`, `lib/familles.ts:154`
— est excellent : il transforme « sur devis » d'un refus en une méthode, et il
est rendu en toutes lettres sur l'accueil (« 13 lignes sur 18 sont annoncées
sur devis. »). **C'est un des meilleurs textes du site.**

Mais lorsqu'on clique « Demander un devis », on n'obtient pas deux questions :
on obtient l'assistant en conversation libre, dont le déroulé imposé compte
**cinq étapes** avant de récapituler (`chat-prompt.ts:63-77`), et qui — mesuré
en C3 — repose des questions déjà répondues.

**Le mécanisme** — la promesse est chiffrée (« deux »), donc vérifiable, donc
elle sera vérifiée. L'écart entre « deux questions » et une conversation à
cinq étapes n'est pas une nuance : c'est la promesse la plus concrète de toute
la section, et elle est démentie au premier clic. **[R]** Le guide de voix fait
du concret l'actif principal du site ; un concret faux coûte plus qu'un vague.

**Ce qu'il faut faire** — deux options, la première est la bonne :

1. **Rendre les deux questions réelles.** Pour une ligne sur devis, ouvrir
   l'assistant avec le `sujet` déjà transmis (`BoutonDevis` le passe
   depuis toujours — `chat-ouvrir.ts:406`, mais `ChatWidget.tsx:77-89`
   documente qu'il **n'est pas encore consommé**) et faire poser les deux
   questions propres à la ligne (tirage + date pour un imprimé ; nombre de
   pages + échéance pour un site). Le `sujet` existe, le raccordement manque.
2. À défaut, aligner le texte sur ce qui se passe : « chiffré après un
   échange ».

**Effort** — option 1 : 0,5 jour (consommer `sujet` dans `ChatWidget`, et une
table de deux questions par famille). Option 2 : 10 min.

---

### C10 — Les libellés ne disent pas ce qui va se passer

**Où** — divers, listés ci-dessous.

**[M]** Relevé des micro-décisions :

| Libellé | Où | Ce que le visiteur comprend | Ce qui se passe |
|---|---|---|---|
| **« Parlons-en »** | pastille de nav, fixe, présente sur tous les écrans | « on va discuter » | défilement de ~12 écrans jusqu'au pied de page, ~1,5 s d'animation (voir plus bas) |
| **« Lancer mon site »** | carte 1'499.– | « je commande » | ouverture de WhatsApp |
| **« Automatiser mes demandes »** | carte 2'499.– | idem | idem, sans avoir vu les 129.–/mois |
| **« Demander un devis → »** | 2 endroits | « je vais recevoir un devis » | ouverture d'un chat qui pose des questions |
| **« Terminer la conversation »** | chat, à partir de 6 messages | « j'abandonne » | c'est au contraire **l'action qui enregistre la demande** |
| **« Décrivez votre besoin — réponse le jour ouvrable suivant »** | bulle du chat | correct | correct |
| **« Envoyer ma demande → »** | formulaire | correct | correct |

Deux mécanismes :

- **« Terminer la conversation »** est le pire des sept. **[M]**
  `ChatWidget.tsx:110-128` : c'est ce bouton qui appelle `/api/chat/finalize`,
  écrit le Lead et notifie Telegram. Le mot « Terminer » se lit comme un
  abandon. (Le filet existe : `pagehide` + `sendBeacon` finalise aussi, dès
  4 messages — `:95-105`. Le lead n'est donc pas perdu, mais il est enregistré
  au départ du visiteur plutôt qu'à son geste volontaire, et sans la
  confirmation qui le rassure.) → **« Envoyer ma demande à Ayoub »**.
- **« Parlons-en »** est le seul CTA présent en permanence à l'écran ; il ne
  nomme ni le geste ni la destination. Quand `/contact` existera, il doit y
  pointer et se dire : **« Demander un devis »** ou **« Écrire à Ayoub »**.

**[M] Note de mécanique** — `components/Interactions.tsx:167-192` implémente un
défilement inertiel (interpolation à 0,085 par image, pointeur fin uniquement).
Une ancre qui saute de ~11 000 px converge en ~100 images, soit **~1,7 s** de
défilement animé. Ce n'est pas un défaut en soi, mais cela renchérit chaque
CTA d'ancre : « Parlons-en » coûte près de deux secondes d'animation avant que
le formulaire soit lisible.

**Effort** — libellés : 1 h. Repointage de « Parlons-en » vers `/contact` :
30 min, à faire au moment de la création de la page.

---

### C11 — La navigation cible : deux entrées disent « services », une seule est la page

**Où** — `components/Nav.tsx:59-67`, `components/MenuOverlay.tsx:26-31`.

**Ce qui se passe** — **[M]** État rendu au moment du relevé :

```
Travaux      → /#travaux    (ancre)
Services     → /#services   (ancre, l'accordéon des six gestes)
Offres       → /#offres     (ancre, la grille de prix)
Prestations  → /services    (page, <title> « Services et tarifs à Genève »)
Parlons-en   → /#contact    (ancre)
```

Deux entrées portent la même famille de sens, et **c'est celle qui ne
s'appelle pas « Services » qui est la page Services**. Le menu plein écran
reproduit exactement la même ambiguïté.

**Le mécanisme** — le visiteur qui cherche l'offre clique « Services », atterrit
sur un accordéon replié de six lignes sans prix ni lien, et n'a aucune raison
d'essayer « Prestations » ensuite. Sur les cinq entrées de nav, quatre sont des
ancres de la même page : la nav ne navigue pas, elle défile.

**Ce qu'il faut faire** — c'est exactement ce que la restructuration prévoit.
Deux points à ne pas perdre dans la bascule :

1. **Le déroulant « Services » doit lister les trois formules**, pas seulement
   les cinq familles. C'est le remplacement de « Offres » : sans cela,
   `/services/la-vitrine|le-site|l-assistant` reste sans aucun chemin depuis la
   nav **et** sans aucun chemin depuis l'accueil (C4). Les deux constats se
   cumulent, et le second devient critique le jour où « Offres » disparaît.
2. **Créer `/contact`** (404 au relevé) avant de repointer « Parlons-en » —
   sinon la pastille, seul CTA permanent du site, casse.

**Effort** — porté par la restructuration en cours. Le point 1 est une décision
de contenu du déroulant, pas du travail supplémentaire.

---

### C12 — La FAQ ne traite aucune des objections propres à un studio sans référence

**Où** — `components/Faq.tsx:49-100`.

**Ce qui se passe** — **[M]** Les cinq questions, dans l'ordre : le délai —
les textes et photos — l'hébergement et le domaine — l'après — ce qui n'est pas
fait à ce prix.

Ce sont cinq bonnes questions, bien répondues, et leur placement **avant** le
prix est un choix juste (voir §3). Mais aucune ne traite ce qu'un dirigeant
se demande devant un prestataire qu'il ne connaît pas :

- **« Vous l'avez déjà fait ? »** — la question numéro un, et la seule à
  laquelle le studio ne peut pas répondre par une référence. Il peut répondre
  par ce qu'il *montre* : l'assistant qui tourne ici, le tableau de bord, la
  séquence de livraison. **Ne pas y répondre du tout est pire que d'y répondre
  franchement** : le silence laisse le lecteur conclure seul.
- **« Comment et quand je paie ? »** — voir C5. La réponse est le meilleur
  argument du site et elle n'est pas sur l'accueil.
- **« Et si ça ne me convient pas ? »** — la réponse est la même : vous voyez
  avant de payer.

**Ce qu'il faut faire** — ajouter **deux** questions, pas cinq (une FAQ qui
gonfle perd son autorité) :

1. *« Comment et quand je paie ? »* → la séquence de livraison, telle qu'écrite
   sur `/studio:275`.
2. *« Vous l'avez déjà fait ? »* → une réponse honnête et vérifiable, sans
   référence inventée : ce que le visiteur peut vérifier **sur ce site même**,
   plus le renvoi vers `/studio`. **[R]** À rédiger avec le guide de voix, en
   nommant ce qui est vrai — c'est ce que fait déjà, très bien, la réponse
   « À ce prix-là, qu'est-ce qui n'est pas fait ? ».

**Effort** — 1 h de rédaction, zéro code (les questions vivent dans
`construireQuestions()` et alimentent aussi le JSON-LD `FAQPage`, donc le gain
SEO est gratuit).

---

## 3. Ce qui fonctionne, et qu'il ne faut pas casser

Le second analyste contestera mes constats ; qu'il conteste aussi ceux-ci.

1. **L'ordre des sections est bon, et la question est tranchée.** Les
   objections (FAQ, écran 8,3) passent **avant** le prix (écran 9,1). Le
   docblock de `app/(site)/page.tsx:111-115` documente la décision et sa raison.
   Elle est juste : une objection traitée après la décision ne sert plus.
   **Je ne recommande aucun réordonnancement des sections.** Le problème n'est
   pas leur ordre, c'est qu'aucune d'elles n'offre de sortie (C6).
2. **Le raisonnement sur le devis** (`lib/familles.ts:154`, `MENTION_DEVIS`) est
   la meilleure page de vente du site. Il transforme treize « sur devis » d'un
   trou en une méthode, il compte juste (les deux nombres sont dérivés de la
   base), et il est rendu à l'endroit où il sert. **Ne pas le raccourcir.**
3. **Tous les prix viennent de Postgres**, mention de TVA collée au montant,
   par unité de lecture. Aucun prix barré, aucun « tarif de lancement ». Les
   trois formules portent « Pour qui » plutôt que « N° 01/02/03 ». Cette
   discipline est rare et elle vaut de l'argent.
4. **Aucune technique de pression** n'a été trouvée sur le site : pas de faux
   compteur, pas de rareté, pas de case pré-cochée, pas de compte à rebours.
   Le seul prix caché est celui de C2, et il est involontaire (le code contredit
   sa propre intention documentée).
5. **La déclaration de fiction dans le carrousel est sérieuse** : chaque scène
   « après » est étiquetée, les détails localisables ont été retirés, le
   compteur de visiteurs et la moquerie du « avant » ont été supprimés
   volontairement. Le problème de C7 est d'adéquation, pas de sincérité.
6. **La page `/services/l-assistant` fait exactement ce que la grille d'accueil
   ne fait pas** : le suivi obligatoire, son montant, sa raison, avant le
   bouton. Le correctif de C2 est un portage, pas une invention.
7. **`MENTION_REPONSE` est un engagement tenable** et le seul conservé après
   28 retraits. Il manque au formulaire (C8) ; ailleurs il est bien placé.

---

## 4. Ce que je n'ai pas mesuré

À dire avant que ce soit opposé.

- **Aucune donnée d'audience.** Zéro visiteur mesuré, zéro taux. Tous les
  constats portent sur la **structure** du parcours, pas sur son rendement
  observé. Je n'avance aucun chiffre de conversion, ni avant, ni après.
- **Le mobile.** La fenêtre du navigateur piloté n'a pas pu être redimensionnée
  (`innerWidth` figé à 1446). Mais la profondeur du hero, elle, est
  **indépendante du viewport par construction** : quatre temps en
  `min-height:100svh` (`app/noyau.css:127-128`, le quatrième à `74svh`), soit
  3,74 écrans — chiffre confirmé identique à 1301 × 813 **et** 1446 × 904. Les
  positions en *pixels* des autres sections, elles, ne valent que pour le
  viewport indiqué ; les positions en *écrans* varient de ±0,5 entre les deux
  mesures.
- **Le quota du modèle.** Le chiffre de 20 requêtes/jour vient d'un commentaire
  daté du 2026-08-23 dans `lib/llm.ts`, que le fichier lui-même demande de
  re-sonder. Mes deux appels ont abouti en 2,8 s et 1,3 s : le service
  fonctionnait au moment du relevé.
- **Le comportement de `wa.me` hors du site.** Je n'ai pas navigué vers
  WhatsApp. Mon constat C1 ne porte pas sur ce qui se passe là-bas, mais sur ce
  qui n'existe pas ici : à l'endroit du prix, il n'y a pas de seconde porte.
- **Le poids et la vitesse de chargement.** Hors périmètre ; l'intro a déjà été
  mesurée et ramenée à ~1,6 s (`Interactions.tsx:62-71`), une seule fois par
  session (`sessionStorage`). Je ne la compte pas dans les freins.

---

## 5. Les cinq changements qui rapporteraient le plus

Classés par effet attendu sur le chiffre d'affaires, du plus fort au moins
fort. Total : **environ 2,5 jours de travail**, hors la dépendance externe du
point 5.

---

### 1. Faire du bloc de prix un point de vente complet — 0,5 jour

Aujourd'hui la grille offre un prix incomplet et une seule porte qui sort du
site. Trois gestes, au même endroit :

- **Le suivi obligatoire de 129.–/mois sur la carte de L'Assistant**, sous le
  montant, avant le bouton (C2). Le calcul existe déjà dans le fichier ; le
  motif est à copier de `services/[slug]:265-268`.
- **Une seconde porte** à côté du bouton WhatsApp : le téléphone cliquable avec
  les horaires, et un renvoi vers le formulaire. Faire passer les trois boutons
  par `BoutonDevis` avec leur `sujet` (C1).
- **« Vous voyez le site fini avant de payer »** sous la grille, à côté des
  deux allers-retours (C5).

*Pourquoi en premier* : c'est le seul endroit du site où le visiteur a un prix
sous les yeux. Les trois corrections y suppriment respectivement un prix caché,
un cul-de-sac de canal, et l'absence du meilleur argument disponible — sans
rien ajouter de nouveau au discours.

**Coût** : `components/Offres.tsx` uniquement. Aucun CSS nouveau, aucune
donnée nouvelle, aucune promesse nouvelle.

---

### 2. Réparer l'assistant avant de continuer à le montrer — 3 h

Il est mesuré qu'il repose les questions déjà répondues et ignore une question
de prix directe, deux fois de suite (C3). Or le site le désigne à trois
endroits comme **la** démonstration du produit à 2'499.–, et **[R]** c'est la
seule preuve fonctionnelle d'un studio à zéro référence.

- Réécrire le déroulé de `lib/chat-prompt.ts:63-77` en règle de priorité :
  répondre d'abord, ne jamais reposer ce qui est acquis, puis une question.
- Renommer « Terminer la conversation » en « Envoyer ma demande à Ayoub »
  (C10) : c'est le bouton qui crée le lead.
- Re-sonder le quota du modèle et alerter sur le repli (C3).

*Pourquoi en deuxième* : chaque euro dépensé à envoyer du trafic vers cet
assistant est perdu tant qu'il déçoit. Et il déçoit précisément le visiteur le
plus avancé — celui qui vérifie avant d'acheter.

**Coût** : un fichier de prompt, un libellé, une sonde. Aucun code produit.

---

### 3. Ouvrir les neuf écrans muets — 0,5 jour

Cinq sections consécutives, 57 % de la page, **zéro lien** (C6). Une sortie
contextuelle par section, vers du contenu qui existe déjà : `#offres`, les cinq
pages de famille, `/services/le-site`, `/studio`, le formulaire.

Y ajouter le lien manquant sur chaque carte de la grille de prix vers sa page
de formule (C4) — **30 min**, et le motif est à copier depuis `/services`.

*Pourquoi en troisième* : c'est le plus gros volume de contenu déjà écrit,
déjà payé, et aujourd'hui inaccessible. Le remède est éditorial, réversible,
et il ne demande aucune décision commerciale.

*Dépendance* : quand « Offres » quittera la nav, le lien vers les pages de
formule cesse d'être une amélioration et devient le seul chemin. À faire
**avant** la bascule de nav, pas après.

---

### 4. Rouvrir la porte écrite — 3 h

Le formulaire exige un téléphone, n'accepte aucun e-mail, et n'annonce aucun
délai de réponse (C8). Ajouter l'e-mail en facultatif, rendre l'un des deux
canaux suffisant, afficher `MENTION_REPONSE` au-dessus du bouton, lier
`/confidentialite`.

Ajouter dans la même passe les deux questions manquantes à la FAQ — *« Comment
et quand je paie ? »* et *« Vous l'avez déjà fait ? »* (C12) — qui alimentent
aussi le JSON-LD `FAQPage` sans travail supplémentaire.

*Pourquoi en quatrième* : le studio vend une proposition écrite et ne collecte
pas d'adresse pour l'envoyer. C'est peu coûteux à corriger et cela ouvre le
seul canal qui n'engage pas le prospect à décrocher.

---

### 5. Substituer une preuve réelle à une preuve fictive — 1 jour + accord du client

**[R]** Sans rien inventer, et dans cet ordre de disponibilité :

- **Immédiat, 1 h** : mettre « Le site » en pièce 01 du carrousel, et renommer
  la section « Travaux » en « Avant / après » ou « Démonstrations ». Quatre des
  cinq pièces relèvent de l'ancien positionnement restauration ; la seule qui
  montre le produit d'entrée est en deuxième position (C7).
- **1 jour + dépendance externe** : remplacer la carte fictive du Comptoir par
  **la vraie carte réalisée pour le client payant** (`.agents/product-marketing.md`
  §6), avec son accord écrit, étiquetée « Réalisé pour un client — Genève ».
  Une seule pièce réelle change la nature de toute la section.
- **Conditionné au point 2 ci-dessus** : présenter le site lui-même comme la
  sixième démonstration — l'assistant, l'alerte, le tableau de bord tournent
  ici. Vérifiable à l'instant, sans consentement de personne. À ne pas faire
  tant que l'assistant repose les questions déjà répondues.

*Pourquoi en cinquième malgré son importance* : c'est le seul des cinq qui
dépend de quelqu'un d'autre que le studio. Les quatre premiers sont
intégralement sous contrôle et se livrent en deux jours ; celui-ci se lance en
parallèle et arrive quand l'accord arrive.

*Ce qu'il ne faut pas faire, et le brief l'interdit* : aucun témoignage, aucun
compteur, aucun logo, aucune note. **[R]** LCD art. 3.

---

## Annexe — références de fichier citées

| Constat | Fichier:ligne |
|---|---|
| C1 | `components/Offres.tsx:49-88`, `:202-212` · `components/BoutonDevis.tsx` · `lib/site.ts:325-331` |
| C2 | `components/Offres.tsx:111-142`, `:227-235` · `app/(site)/services/[slug]/page.tsx:171-177`, `:245-284` |
| C3 | `lib/chat-prompt.ts:62-98` · `components/ChatWidget.tsx:110-128`, `:171` · `components/ServicesRows.tsx:62` · `lib/formules.ts:236` · `lib/llm.ts:73-76` · `app/api/chat/route.ts:27-31`, `:103-110` |
| C4 | `components/Offres.tsx:202-212` vs `app/(site)/services/page.tsx:410-417` |
| C5 | `app/(site)/studio/page.tsx:272-279` · `components/Studio.tsx:53` · `components/ServicesRows.tsx:54` |
| C6 | `app/(site)/page.tsx:128-138` · `components/{Travaux,ServicesRows,Methode,Studio,Faq}.tsx` |
| C7 | `components/ui/feature-carousel.tsx:210-217`, `:389-425` · `components/Travaux.tsx:18-23` |
| C8 | `components/ContactForm.tsx:145-155`, `:176-197` · `components/FooterContact.tsx:46-49` · `app/api/contact/route.ts:31-36` · `lib/familles.ts:181` |
| C9 | `lib/format.ts:49-60` · `components/CarteService.tsx:159-163` · `lib/familles.ts:154` · `components/ChatWidget.tsx:77-89` |
| C10 | `components/Nav.tsx:67` · `components/ChatWidget.tsx:228-234` · `components/Interactions.tsx:167-192` |
| C11 | `components/Nav.tsx:59-67` · `components/MenuOverlay.tsx:26-31` |
| C12 | `components/Faq.tsx:49-100` |

---

## Contradiction — réponse au rapport SEO

> Rédigé le 2026-08-31 après lecture de `.superpowers/revue/diag-seo.md`
> (741 lignes). **J'ai re-mesuré moi-même chaque fait de son rapport que je
> cite ci-dessous** — commandes et résultats donnés. L'arbre a encore bougé
> entre son relevé et le mien : je le signale à chaque fois.

---

### 1. Ce que je concède

#### 1.1 L'ordre. Il a raison, et mon cadrage était faux.

**Vérifié de mon côté, quatre commandes :**

```
grep NEXT_PUBLIC_SITE_URL .env    -> NEXT_PUBLIC_SITE_URL=http://localhost:3000
nslookup nawacorps.ch 8.8.8.8     -> Non-existent domain
nslookup -type=A binacore.ch      -> le nom répond, AUCUN enregistrement A
git log --reverse                 -> premier commit 2026-08-22 (9 jours)
```

Son §1 tient. **Rien n'est en ligne, rien n'est indexé, il n'y a pas un
visiteur.** J'ai écrit « classés par impact sur le chiffre d'affaires » en tête
de mon §2 : sur un site à zéro visiteur, **aucun** de mes cinq points ne produit
un franc par lui-même. Ce titre était faux et je le retire. Le bon axe pour ma
liste est **« par coût évité et par irréversibilité »**, pas par CA.

Et sa hiérarchie a un argument que je n'avais pas : **le chemin critique**. La
fiche Google Business Profile porte un délai de validation de 1 à 2 semaines
que rien ne comprime — ni budget, ni effort, ni talent. Tout ce qui a une
latence externe passe devant tout ce qui n'en a pas. Mes cinq points n'ont
aucune latence : ce sont des heures de travail, disponibles quand on veut.
**Sa fiche Google passe donc devant mon tunnel, et c'est indiscutable.**

#### 1.2 J'ai sous-mesuré : je n'ai audité que les liens *sortants de l'accueil*

Mon C6 dit « 16 liens vers `/services/*` depuis l'accueil » et ne dit rien de
leur état. **Re-mesuré, une URL à la fois, sur `/services` :**

```
404 : /services/{carte-visite, sticker-avis, affiche-evenement, identite-logo,
      photos, traduction, hebergement, suivi-assistant, la-carte,
      carte-fidelite, bons-cadeaux, chevalets, pack-saisonnier,
      site-sur-mesure}                                       -> 14
200 : /services/{la-vitrine, le-site, l-assistant, identite, imprimes,
      reseaux-sociaux, suivi, restauration}                  ->  8
```

**Son compte de 14 est exact, au slug près.** Je ne l'avais pas vu parce que je
n'avais pas audité `/services` : j'avais lu sa version d'avant, où
`CarteService` recevait `famille` et non `versSaPage`. Le paramètre
`versSaPage` (`CarteService.tsx:88-95`, activé en `services/page.tsx:264`) est
arrivé pendant nos relevés.

**Ce n'est pas une contradiction entre nous : nous avons mesuré deux pages
différentes.** Sur l'accueil, `CarteDuStudio.tsx:123, 143` passe toujours
`famille` — vérifié, **zéro lien mort sur l'accueil**, les 24 liens partent
vers les 5 pages de famille qui répondent 200. Sur `/services`, 14 sur 22 sont
morts. Les deux mesures sont vraies.

#### 1.3 Cela change mon action 3, en séquence — et c'est important

Mon action 3 dit « ouvrez les neuf écrans muets » : elle **ajoute des liens**.
Son A2 démontre que le dépôt possède déjà un générateur de liens qui produit
des 404 en série. Ajouter des liens dans un site où le motif de lien fabrique
des portes sur le vide, c'est reproduire le défaut ailleurs.

**Son garde-fou passe donc avant mon action 3**, et non l'inverse :

```ts
// à côté de FORMULE_SLUGS et FAMILLE_SLUGS
const SERVICES_AVEC_PAGE = [...] as const;
const porte = versSaPage && SERVICES_AVEC_PAGE.includes(slug) ? { ... } : null;
```

20 minutes, et le dépôt écrit lui-même la règle violée
(`lib/catalogue-familles.ts:183` : « mieux vaut une carte sans porte de sortie
qu'une porte sur le vide »). Et je précise ma propre recommandation : les six
liens que je demande au pied des accordéons de `ServicesRows` doivent viser les
**cinq pages de famille** (qui répondent 200), **jamais** `hrefService(slug)`.

#### 1.4 Mon C8 est à moitié réglé — par une page livrée après mon relevé

`/contact` répondait 404 quand j'ai écrit C8. Elle répond 200 maintenant.
**Re-mesuré :**

- `MENTION_REPONSE` est rendue **juste au-dessus du formulaire**
  (`contact/page.tsx:374`) → **la moitié de C8 tombe**, et sur la bonne page.
- Un lien `/confidentialite` est présent (`:406`) → **tombe aussi**.
- Mais le formulaire rendu sur `/contact` est **le même composant**
  (`ContactForm.tsx`, importé tel quel, `:376`) : champs `name`, `phone`
  (`type="tel"`, **requis**), `message`, `website`. **Aucun champ e-mail.**
- Et le formulaire du pied de page de l'accueil, lui, n'a toujours **ni**
  mention de délai **ni** lien de confidentialité — c'est celui qu'on atteint
  après 13,5 écrans.

Je concède donc les deux points de forme, je maintiens le fond (§2.4).

---

### 2. Ce que je maintiens, et pourquoi

#### 2.1 « Zéro visiteur donc travail en avance » est vrai pour l'optimisation, faux pour le défaut

C'est le cœur du désaccord, et il se tranche par un test simple :
**est-ce que la correction a besoin de trafic pour être décidée ?**

| Type de travail | A besoin de trafic ? | Verdict |
|---|---|---|
| Réécrire un titre pour gagner des points de conversion | **oui** — sans mesure, on devine | travail en avance, à repousser |
| Tester deux libellés de CTA | **oui** | à repousser |
| **Afficher un prix mensuel obligatoire qui n'est pas affiché** | **non** — c'est un fait binaire | défaut, à corriger |
| **Relier une page orpheline** | **non** | défaut, à corriger |
| **Réparer un assistant qui repose les questions déjà répondues** | **non** — déterministe | défaut, à corriger |

Aucun de mes cinq points n'est une optimisation à l'aveugle. Je n'ai proposé
**aucun** test A/B, **aucune** réécriture spéculative, **aucun** changement dont
l'effet demanderait à être mesuré pour être décidé. Les cinq sont des écarts
entre ce que le site dit qu'il fait et ce qu'il fait — vérifiables sans un seul
visiteur. C'est précisément pourquoi ils sont **corrigibles maintenant**, et
c'est le seul moment où ils le sont gratuitement.

#### 2.2 Coût maintenant contre coût après la mise en ligne — trois asymétries chiffrables

C'est la question que le coordinateur pose. Voici la réponse, poste par poste.

**a) C2, le suivi obligatoire caché — l'asymétrie la plus violente du dossier.**

| | Avant la mise en ligne | Après la première vente de L'Assistant |
|---|---|---|
| Coût de la correction | **1 h** (le calcul existe déjà dans le fichier) | 1 h **plus la conversation** |
| Coût de l'incident | néant | **1'548.–/an** encaissés ou abandonnés, sur un client acquis sans avoir vu le montant |

**[R]** Le studio a **1 client et 0 référence de site**. Les dix premiers
prospects ne sont pas un échantillon dont on optimise le taux : ce sont **la
base de références** dont dépendra tout le discours de l'année. En perdre un
sur un prix découvert après le clic, ce n'est pas −10 % de conversion, c'est
−10 % du seul actif de preuve que le studio va constituer. Une seule
occurrence coûte plus cher que la totalité de mes quatre premières actions
(≈ 2 jours).

Et ce n'est pas moi qui pose la règle : c'est le docblock d'`Offres.tsx:111-124`
qui écrit « un prix mensuel imposé par un palier et passé sous silence est un
prix caché, et il s'annonce sur la carte du palier comme sous la grille » —
et le code n'implémente que la seconde moitié. Ce n'est pas un avis de
conversion, c'est un écart entre l'intention écrite et le code livré.

**b) C4 et son A3 — celui-ci a une échéance dure : avant le premier crawl.**

C'est son propre cadre qui le démontre, pas le mien. Le maillage interne est le
mécanisme qui transmet l'autorité de l'accueil aux pages de vente. Le premier
passage d'un robot a lieu **le jour de la mise en ligne**. Une page découverte
comme feuille sans lien entrant devra ensuite regagner ce qu'elle n'a pas reçu
au départ.

- Coût aujourd'hui : **30 min**, et le motif exact est à copier depuis
  `services/page.tsx:410-417`.
- Coût après indexation : les mêmes 30 min, **plus** le temps de rattrapage.

**Ce point ne peut pas attendre la mise en ligne : il doit être dedans.**

**c) C3, l'assistant — le seul moment où le défaut est trouvable.** Voir §2.3.

#### 2.3 Mes deux essais sur l'assistant tiennent, et ils valent *plus* aujourd'hui qu'après le lancement

Il n'a pas testé l'assistant, et il ne le revendique nulle part. Mes deux
appels réels à `/api/chat` tiennent :

> « je suis plombier à Genève, mon site date de 2014. **Combien pour le
> refaire ?** » → « Quel est votre métier et quel support souhaitez-vous
> faire créer ou refondre ? »
>
> « Plombier. Un site. **Je vous ai demandé le prix : combien ça coûte ?** » →
> « Quel problème principal rencontrez-vous avec votre site actuel ? »

**Ce que ça vaut sans visiteurs — et la réponse est : davantage.** Deux
raisons, toutes deux mécaniques :

1. **Le défaut est déterministe, pas statistique.** Il vient d'une règle de
   prompt (`chat-prompt.ts:62-77` : « Déroulé imposé » plus « UNE seule question
   par message », sans aucune règle « ne repose pas ce qui est acquis »). Il ne
   demande pas d'échantillon pour être prouvé, et deux essais suffisent.
2. **Le trafic ne le révélerait pas, il le masquerait.** Un prospect à qui on
   repose sa propre question ne dépose pas de réclamation : il ferme l'onglet.
   Le studio verrait un taux d'abandon, jamais la cause. Et
   `lib/llm.ts:73-76` documente un quota de ~20 requêtes/jour par modèle,
   là où `app/api/chat/route.ts:31` croit disposer de 200 : sous trafic, le
   même symptôme deviendrait indiscernable d'un épuisement de quota. **Zéro
   visiteur est exactement la condition qui rend ce bug diagnosticable.**

Et l'enjeu n'est pas le chat : **[R]** avec zéro référence, cet assistant est
la seule preuve fonctionnelle du studio, et le site le désigne trois fois comme
telle (`ServicesRows.tsx:62`, `formules.ts:236`, positionnement §5). Son
propre §6 ligne 8 dit la même chose que moi par un autre chemin — « le trou de
crédibilité est réel, il se comble par une vraie fiche Google, jamais par du
balisage ». D'accord. J'ajoute : **il se comble aussi par une démonstration
qui fonctionne**, et celle-ci ne fonctionne pas.

#### 2.4 Le champ e-mail manquant n'est pas un détail de formulaire

Ce qui reste de C8 après la livraison de `/contact` : **le studio vend une
proposition écrite et ne collecte aucune adresse pour l'envoyer.**
`chat-prompt.ts:74-77` promet « une proposition précise le jour ouvrable
suivant » ; `SchemaContact` (`api/contact/route.ts:31-36`) n'accepte que
`name`, `phone`, `message`. Les deux seules portes offertes — formulaire et
WhatsApp — exigent toutes deux un numéro. **Le site ferme d'un coup les deux
canaux non téléphoniques**, chez un ICP qui explore le soir sans vouloir
décrocher le lendemain.

Ce constat ne dépend d'aucun trafic non plus.

#### 2.5 Sur ses 16 « ça a l'air cassé et ça ne l'est pas » : aucun ne neutralise un constat, mais trois méritent d'être désambiguïsés

J'ai passé les 16 en revue contre mes 12 constats. **Zéro annulation.** Trois
demandent une précision, sinon un lecteur pressé conclura de travers.

**Sa ligne 7 — « Le Comptoir » n'est plus une indication trompeuse.**
D'accord, et je n'ai jamais soutenu le contraire : mon C7 écrit noir sur blanc
« Rien ici n'est trompeur ». Ma charge est ailleurs, et elle est double :
(a) **d'adéquation** — quatre pièces sur cinq relèvent de la ligne
restauration, c'est-à-dire de **l'ancien positionnement** que
`.agents/product-marketing.md` §2 déclare abandonné comme cœur de cible, et la
seule pièce qui montre le produit d'entrée est en position 02 d'un carrousel
qui tourne toutes les 4,2 s ; (b) **d'omission** — `.agents/product-marketing.md`
§6 recense une carte de restaurant **réellement réalisée pour un client
payant**, et le carrousel affiche une carte **fictive** à sa place. Sa défense
porte sur la légalité de l'étiquetage ; ma critique porte sur le choix des
pièces. Les deux sont compatibles, et mon C7 survit entier.

**Sa ligne 12 — le sous-titre du hero, mesuré au pixel.**
Elle ne neutralise rien chez moi, mais elle **interdit un correctif tentant**,
et je veux que ce soit écrit noir sur blanc pour que personne ne l'essaie plus
tard : `.hero-foot` est collé au bas du pli par construction
(`min-height:100svh` en `flex-end`), et chaque ligne ajoutée pousse le pied
hors de l'écran sous 774,5 px de haut — mesure de `NoyauHero.tsx:80-131`.
**Rien ne doit être ajouté au hero.** C'est précisément pour cela que mon C5
place la phrase « vous voyez le site fini avant de payer » **sous la grille de
prix** et non en tête de page. Nous sommes d'accord, et cette contrainte
renforce mon choix d'emplacement.

**Sa ligne 13 — « Réponse le jour ouvrable suivant » absent des cinq pages de
famille, volontairement.**
Elle ne contredit pas mon C8, **elle l'appuie**. La doctrine qu'il cite
(`lib/familles.ts:167-181`) dit que la mention « vivait au seul formulaire ».
Le commentaire de `ContactForm.tsx:145-151` affirme lui aussi qu'« il est déjà
écrit au-dessus du formulaire ». Les deux textes décrivent un état qui n'était
pas celui du code : au moment de mon relevé, la mention était rendue quatre
fois (trois dans le chat, une dans la carte du studio) et **zéro fois au
formulaire**. `/contact` vient de le réparer, sur `/contact` seulement. Le
formulaire du pied de page de l'accueil ne l'a toujours pas.

**Sa ligne 16 — trois pages de formule, pas dix-huit.**
Elle est juste, et elle **entre en tension avec son propre A2** : le dépôt
refuse d'écrire 14 pages **et** émet 14 liens vers elles. C'est une
contradiction interne réelle, bien trouvée. Elle renforce mon C9 : la carte
« Cartes de visite — conception + 75 ex. » promet « sur devis, chiffré après
deux questions » **et** « Voir le détail ». Au clic : une 404 d'un côté, une
conversation à cinq étapes de l'autre. **La même carte manque ses deux
promesses au même clic.** Poser le garde-fou (son A2) répare la première ;
brancher le `sujet` déjà transmis par `BoutonDevis` (mon C9) répare la seconde.

#### 2.6 Accord explicite sur le constat le plus solide du dossier — et il a empiré

Il a raison et je le dis sans réserve : **l'accueil ne lie aucune des trois
pages de formule, et les trois `ctaHref` d'`Offres.tsx:58, 71, 84` sortent tous
vers `wa.me`.** Nous l'avons trouvé séparément, par deux chemins différents —
lui par le maillage et l'autorité, moi par le parcours d'achat — et nous
tombons sur la même ligne de code.

**Re-mesuré après la bascule de nav, qui a eu lieu entre son rapport et cette
réponse.** La nav est désormais : `Travaux` · `Services` (déroulant) ·
`Le studio` · `Contact` · `Parlons-en`. **« Offres » a quitté la
navigation**, et le déroulant liste *Tous les services* plus les **cinq
familles** — **pas les trois formules**.

Comptage des liens vers `/services/{la-vitrine, le-site, l-assistant}`, page par
page, à l'instant :

```
/                      -> 0        (et 24 liens vers les 5 familles)
/studio                -> 0
/contact               -> 0
/services/imprimes     -> 0
/services/restauration -> 0
/services/le-site      -> 1        (montée de palier interne)
/services              -> 3        <-- la seule page du site qui les lie
nav (toutes pages)     -> 0
```

**Le risque que je signalais en C11 s'est réalisé pendant que nous écrivions.**
Il ne reste qu'un seul chemin vers les trois pages qui vendent le produit
d'entrée : nav → Services → *Tous les services* → `/services` → carte. Trois
clics, et le raccourci « Offres » qui sautait à la grille de prix n'existe
plus. Ce constat était fort dans nos deux rapports ; il est maintenant le plus
urgent des deux listes, et il coûte 30 minutes.

*(Point annexe vérifié au passage : la nav porte désormais **deux** entrées de
contact — « Contact » vers `/contact`, et la pastille « Parlons-en » qui pointe
toujours vers l'ancre `/#contact`. Mon C10 demandait ce repointage ; il reste à
faire, 5 minutes.)*

---

### 3. Proposition d'ordre commun — sept actions, tunnel et acquisition mélangés

Le principe qui les classe, et c'est lui qu'il faut retenir :

> **Ce qui a une latence externe passe devant. Ce qui n'en a pas se fait
> pendant l'attente.**

La validation Google dure 1 à 2 semaines. Mon lot tunnel complet fait ≈ 2
jours. **Le tunnel tient entièrement dans l'ombre de son attente : il ne coûte
aucun jour de calendrier.** Ce n'est donc pas « acquisition *ou* conversion »,
c'est l'un sur le chemin critique et l'autre dans le mou. Nos deux listes ne
s'excluaient pas ; elles ne se parlaient pas.

| # | Action | Origine | Effort | Latence | Pourquoi ce rang |
|---|---|---|---|---|---|
| **1** | **Trancher les trois valeurs légales** (forme juridique, domiciliation, hébergeur) — `mentions-legales/page.tsx:60` | SEO B7 | décision | — | Bloque **2** et **3**. Ce n'est pas du code : c'est une décision du propriétaire, et rien ne démarre sans elle |
| **2** | **Créer la fiche Google Business Profile** (zone de service, sans adresse publiée) | SEO A1 | 1–2 h | **1–2 semaines** | Le seul poste à latence externe. Chaque jour non lancé est perdu sec. **Lancer le jour 1**, puis attendre en travaillant |
| **3** | **Mettre en ligne** : domaine, `NEXT_PUBLIC_SITE_URL`, Search Console, `sitemap.xml`, inspection d'URL en direct | SEO §8.2 | ½ j | jours | Rien n'existe tant que ça n'est pas fait. **Mais 4 et 5 doivent être dedans, pas après** |
| **4** | **Le maillage, en un seul passage** : garde-fou `SERVICES_AVEC_PAGE` (14 liens morts) · lien « Voir ce qui est inclus » sur les 3 cartes de prix de l'accueil · les 3 formules **dans le déroulant de nav** · un lien au pied de chacun des 6 accordéons | SEO A2+A3+A4 **et** tunnel C4, C6, C11 | **2 h** | — | **Notre accord unanime, et le seul point à échéance dure : avant le premier crawl.** Sert le robot et le visiteur par le même geste |
| **5** | **Le bloc de prix complet** : le 129.–/mois obligatoire sur la carte de L'Assistant · une seconde porte à côté de WhatsApp (téléphone plus renvoi formulaire) · « vous voyez le site fini avant de payer » sous la grille | tunnel C1, C2, C5 | **½ j** | — | Un prix caché qui atteint le premier client coûte 1'548.–/an ; le corriger coûte 1 h. **Doit précéder la première vente, donc la mise en ligne** |
| **6** | **Réparer l'assistant** : règle de priorité au lieu du déroulé séquentiel · « Terminer la conversation » devient « Envoyer ma demande à Ayoub » · re-sonder le quota du modèle | tunnel C3, C10 | **3 h** | — | Se fait pendant l'attente de **2**. C'est la seule preuve fonctionnelle du studio, et le seul moment où le bug est trouvable sans trafic |
| **7** | **Les deux pages d'intention** — « fiche Google » et « création de site » · puis le lot données structurées (`og:image` partout, `FAQPage` sur les 8 pages qui portent des Q/R, `BreadcrumbList`, `SchemaStudio` sur toutes les pages) | SEO A5, B1–B4, addendum b et d | 8 h | — | Rendement réel, mais aucune urgence et aucune latence. À faire une fois **2** validée |

**Ce que ce classement change à ma propre liste** — mon action 1 (« faire du
bloc de prix un point de vente complet ») descend au rang 5, et mon action 3
(« ouvrir les écrans muets ») fusionne avec son A2+A3+A4 au rang 4, derrière
son garde-fou. Je maintiens les cinq contenus ; j'accepte les cinq
emplacements.

**Ce que ce classement change à la sienne** — ses actions 1 et 2 gardent leurs
rangs, ce qui est l'essentiel. Son action 3 (maillage) gagne mon C4/C6/C11 et
l'échéance « avant le premier crawl ». Et **deux jours de travail tunnel
s'insèrent dans l'attente de sa fiche Google sans repousser d'un seul jour quoi
que ce soit dans sa liste** — c'est la seule chose que je lui demande, et elle
est gratuite.

**Ce qui reste hors des sept, chez moi comme chez lui** — mon C7 (substituer la
carte réelle du client payant à la carte fictive) dépend d'un accord externe :
à lancer en parallèle du rang 2, à livrer quand l'accord arrive. Mes C9
(les « deux questions » réelles) et C12 (les deux questions de FAQ manquantes)
sont des gains réels sans urgence, à ranger avec son rang 7.

**Un dernier point d'accord, qui vaut d'être écrit.** Son §6 ligne 8 et mon C7
disent la même chose par deux chemins : le trou de crédibilité est réel, et il
ne se comble ni par du balisage, ni par un témoignage inventé. Il se comble par
une fiche Google réelle (lui), par la carte du client payant qui existe et
n'est pas montrée, et par une démonstration qui fonctionne (moi). **[R]** Aucun
des trois ne demande d'inventer quoi que ce soit — et c'est précisément
pourquoi les trois sont faisables cette semaine.
