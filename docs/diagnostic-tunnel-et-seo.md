# Diagnostic complet — tunnel de vente, conversion et référencement

> **Relevé du 31 août 2026**, branche `feat/conversion-pme`, sur le serveur local
> et sur le code du dépôt.
> Produit par deux analystes aux mandats opposés — l'un sur le parcours d'achat,
> l'autre sur l'acquisition et le référencement — puis soumis à une manche de
> contradiction où chacun a dû attaquer les conclusions de l'autre.
> **Analyse seule. Aucun fichier du site n'a été modifié.**
>
> Rapports sources, non commités (`.superpowers/` est gitignoré) :
> `.superpowers/revue/diag-tunnel.md` · `.superpowers/revue/diag-seo.md`

---

## Comment lire ce document

Chaque constat porte son **origine** (T = tunnel, S = SEO), son **statut** après
contradiction, et un **effort**. Trois statuts seulement :

| Statut | Ce que ça veut dire |
|---|---|
| **Accord** | Les deux analystes l'ont trouvé, ou l'un l'a trouvé et l'autre l'a vérifié et confirmé. |
| **Tranché** | Il y a eu désaccord. La ligne dit qui a gagné et sur quelle source. |
| **Non contesté** | Un seul l'a relevé, l'autre ne l'a ni confirmé ni démenti. |

Et une distinction qui commande tout le reste : un **défaut** est un écart entre
ce que le site dit qu'il fait et ce qu'il fait — il se corrige sans un seul
visiteur. Une **optimisation** demande du trafic pour être décidée. Ce document
ne contient aucune optimisation : rien ici n'attend une mesure d'audience pour
être tranché.

---

## 1. Les trois faits qui commandent l'ordre du travail

### 1.1 Rien n'est en ligne

Vérifié trois fois, par trois chemins :

```
nslookup nawacorps.ch 8.8.8.8        -> Non-existent domain
nslookup -type=A binacore.ch          -> le nom répond, AUCUN enregistrement A
curl http://binacore.ch/              -> code 000
recherche de marque « Nawa Corps Genève » -> aucun résultat correspondant
```

`.env` porte `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, et `lib/site.ts:40-44`
lève une exception si la variable manque en production : **aucun build de
production n'a jamais eu de domaine réel.** Le dépôt a neuf jours.

Conséquence : zéro page indexée, zéro position, zéro visiteur. Tout le reste de
ce document travaille pour un futur, pas pour un existant.

### 1.2 Le seul délai que personne ne contrôle est la fiche Google

La validation d'une fiche Google Business Profile prend une à deux semaines. Rien
ne comprime ce délai — ni budget, ni effort. **Tout ce qui a une latence externe
passe donc devant tout ce qui n'en a pas.** C'est l'argument qui a fait céder
l'analyste conversion, et il l'a concédé sans réserve.

Le corollaire, qui vaut autant : le lot de correctifs de ce document fait environ
deux jours et demi. **Il tient entièrement dans l'ombre de cette attente et ne
coûte aucun jour de calendrier.** Ce n'est pas « acquisition ou conversion »,
c'est l'un sur le chemin critique et l'autre dans le mou.

### 1.3 Un client, zéro référence de site

Aucune recommandation de ce document n'invente une preuve, ne propose d'urgence
artificielle, ne fabrique un compteur ni un avis. La LCD art. 3 vise les
indications trompeuses, et le site s'en garde aujourd'hui avec rigueur — y
compris dans son JSON-LD, où aucun `aggregateRating` n'est émis.

Le trou de crédibilité est réel. Il se comble par trois choses qui existent déjà
et ne demandent rien à inventer : **une vraie fiche Google**, **la carte de
restaurant réellement réalisée pour un client payant** (recensée au
positionnement §6, et aujourd'hui remplacée sur le site par une carte fictive),
et **une démonstration qui fonctionne** — l'assistant tourne sur ce site.

---

## 2. L'ordre de travail

Les deux analystes ont proposé chacun un ordre. Ils convergeaient à un point
près, que j'ai tranché : l'analyste SEO plaçait la mise en ligne avant la
réparation du maillage, alors que son collègue démontrait que le maillage doit
précéder le premier passage d'un robot. Les deux lots font une journée à eux
deux, et la fenêtre de validation Google en dure dix à quinze. **Ils passent donc
tous les deux avant la mise en ligne, sans coûter un jour de calendrier.**

| # | Bloc | Effort | Latence | Pourquoi ce rang |
|---|---|---|---|---|
| **0** | **Lancer les trois délais externes** | **0 h de code** | 1–2 semaines | Les seuls que le studio ne peut pas accélérer, et les seuls qui n'occupent aucune heure. Les mettre en second, c'est perdre deux semaines pour rien. |
| **1** | **Le bloc de prix** — `components/Offres.tsx` | 0,5 j | — | Quatre constats de l'un et un de l'autre, **un seul fichier**. Le meilleur rapport effort/effet des deux rapports. |
| **2** | **Le maillage** | 0,5 j | — | Échéance dure : avant le premier passage d'un robot. Sert le moteur et le visiteur par le même geste. |
| **3** | **La mise en ligne** | ½ j hors code | jours | Rien n'existe tant que ce n'est pas fait — mais 1 et 2 doivent être dedans, pas après. |
| **4** | **Le formulaire et la FAQ** | 3 h | — | Le studio vend une proposition écrite et ne collecte aucune adresse pour l'envoyer. |
| **5** | **L'assistant** | 1 h | — | Durcissement de prompt. Se fait pendant l'attente du bloc 0. |
| **6** | **Le référencement de fond** | ~10 h | — | Rendement réel, aucune urgence. Après la mise en ligne. |
| **7** | **Hygiène** | ~3 h | — | À faire sans en attendre de demandes. |

---

## Bloc 0 — À lancer aujourd'hui, zéro heure de code

### D1 · Les trois valeurs légales manquantes — **accord**

**Où** — `app/(site)/mentions-legales/page.tsx:60` affiche encore
`[Infomaniak, Suisse — à confirmer]`. La page ne porte **ni forme juridique**
(raison individuelle ? Sàrl ?), **ni adresse de domiciliation**, **ni numéro
IDE/CHE**.

**Pourquoi ça compte au-delà du juridique** — ce sont les pages que Google lit
pour rattacher un site à une entité réelle, et que le prospect ouvre quand il
hésite. Un crochet visible dans les mentions légales, sur le site d'un
prestataire qui vend « un interlocuteur qui reste », contredit frontalement
l'argument le plus fort du studio.

**Ce qui n'est pas en cause** — le placeholder est le bon comportement. Le
docblock de la page (`:22-23`) a raison : *« les `[PLACEHOLDERS]` sont
volontairement visibles : ils marquent ce qui reste à confirmer et ne doivent
jamais être remplis par invention »*. **Ce qui manque, c'est la décision, pas le
code.** Une adresse de domiciliation est nécessaire de toute façon, pour la fiche
Google comme pour le registre.

**Effort** — décision du propriétaire. 10 min de code une fois les trois valeurs
connues. **Bloque D2 et le bloc 3.**

---

### D2 · Aucune fiche Google, et aucun `sameAs` pour la relier au site — **accord**

**Où** — `components/SchemaStudio.tsx`, 150 lignes, aucune clé `sameAs`.
`grep -rn "sameAs\|instagram\|linkedin\|facebook"` sur `components/` et `lib/` :
**zéro occurrence dans tout le dépôt.**

**Le mécanisme** — à Genève, pour un dirigeant qui cherche un prestataire local,
le bloc local s'affiche au-dessus des résultats organiques. Sans fiche, le studio
n'existe pas dans ce bloc. Et `sameAs` est le signal qui dit au moteur « cette
fiche et ce site sont la même entité » : sans lui, le rapprochement repose sur la
seule cohérence du triplet nom / téléphone / localité, un signal plus faible
qu'un lien déclaré.

**Ce que le site peut dire honnêtement sans bureau** — tout ce qu'il dit déjà.
Une fiche **sans adresse, en « zone de service »**, est exactement le cas prévu
par Google pour les prestataires qui se déplacent. La zone se déclare par
communes. Aucune rue à inventer : `lib/site.ts:65-70` a raison de l'interdire, et
cette interdiction n'empêche pas la fiche.

**Effort** — 1 à 2 h de saisie, **plus 1 à 2 semaines de validation**. Puis
15 min de code pour le `sameAs`, alimenté depuis `lib/site.ts` comme le reste du
NAP.

---

### D3 · La carte réelle du client payant n'est pas montrée — **non contesté**

**Où** — `.agents/product-marketing.md` §6 recense **une carte de restaurant
réellement réalisée par Ayoub pour un client payant**, utilisable avec l'accord
du client. Le carrousel de l'accueil affiche à sa place une carte **fictive**.

C'est le seul travail client existant, et il n'est nulle part sur le site.

**Effort** — la demande d'accord se lance aujourd'hui, elle ne coûte rien. La
livraison : 1 jour, quand l'accord arrive. Voir aussi D31.

---

## Bloc 1 — Le bloc de prix, un seul fichier (0,5 jour)

Quatre constats de l'analyste conversion et un de l'analyste SEO tombent dans
`components/Offres.tsx`. C'est le seul endroit du site où le visiteur a un prix
sous les yeux.

---

### D4 · Le 129.–/mois obligatoire s'affiche 247 px **après** le bouton — **accord, et c'est le plus grave**

**Où** — `components/Offres.tsx:133-142` (calcul de `noteSuivi`) et `:227-235`
(rendu).

**Mesuré dans la page :**

```
prix « 2'499.– CHF »                                y = 11 321
bouton « Automatiser mes demandes »                 y = 11 589   (+268 px)
note « … 129.–/mois obligatoire avec L'Assistant »  y = 11 836   (+247 px après le bouton)
```

La carte de L'Assistant affiche le prix, « TVA comprise », trois puces, puis le
bouton. **Aucune de ces lignes ne mentionne l'abonnement.** Le montant
obligatoire n'apparaît que dans une note de bas de grille, après avoir traversé
une ligne « Site à plusieurs pages — sur devis ».

Coût réel sur trois ans : **2'499 + 2 × 1'548 = 5'595.–**, dont 3'096.– ne sont
pas lisibles là où la décision se prend.

**Ce n'est pas une opinion, c'est un écart entre un commentaire et son code.** Le
docblock du fichier lui-même (`:111-119`) écrit l'intention : *« un prix mensuel
imposé par un palier et passé sous silence est un prix caché, et il s'annonce
**sur la carte du palier comme sous la grille** »*. Le code n'implémente que la
seconde moitié. Et `CLAUDE.md` tranche : *« un commentaire devenu faux est un
bug »*.

**L'analyste SEO l'a classé plus haut que son collègue.** C'est le seul constat
des deux rapports qui touche un interdit du brief.

**Le correctif est un portage, pas une invention** — `/services/l-assistant` le
fait déjà correctement : `app/(site)/services/[slug]/page.tsx:265-268` place
`<b>129.–/mois</b><span>Suivi obligatoire</span>` dans le même bandeau `.facts`
que le prix, **avant** le bouton. La grille de l'accueil est la seule surface du
site qui présente ce prix comme complet.

**L'asymétrie de coût** — 1 h aujourd'hui, le calcul existant déjà dans le
fichier (`:125-131`). Après la première vente de L'Assistant : 1 h **plus la
conversation**, et 1'548.–/an encaissés ou abandonnés sur un client acquis sans
avoir vu le montant. Avec un client et zéro référence, les dix premiers prospects
ne sont pas un échantillon à optimiser : ce sont la base de références de
l'année.

**Effort** — 1 h.

---

### D5 · Au point de décision, une seule porte, et elle sort du site — **accord**

**Où** — `components/Offres.tsx:49-88` (les trois `ctaHref`) et `:202-212`.

Les trois cartes de prix rendent un `<a target="_blank" href="https://wa.me/…">`.
Elles ne passent **pas** par `BoutonDevis`, contrairement aux deux « Demander un
devis » de la même page. Au moment exact où le visiteur a lu 699 / 1'499 / 2'499
et choisi, la seule action offerte est de quitter le site.

À cet endroit il n'y a **aucun formulaire**, **aucun numéro de téléphone** (le
seul `href="tel:"` du document est à l'écran 13,5, dernière ligne du pied de
page), **aucune adresse e-mail**, **aucun lien vers la page de la formule**.

**Trois effets se cumulent, et aucun ne suppose que WhatsApp soit un mauvais
canal** — il ne l'est pas pour une PME genevoise :

1. **Le contexte est perdu.** Le message pré-rempli est générique. Rien ne dit
   quelle formule a été regardée. Le studio reçoit une phrase, pas une demande.
2. **Aucun repli.** Sur un poste de bureau sans session WhatsApp Web liée, le
   visiteur se retrouve devant un écran d'appairage, dans un onglet qui n'est
   plus le site.
3. **L'engagement demandé est asymétrique.** Écrire sur WhatsApp, c'est donner
   son numéro personnel et ouvrir une conversation permanente avec un numéro
   qu'on ne connaît pas — plus engageant qu'un formulaire à trois champs, et
   demandé **avant** toute preuve.

**Ce qu'il faut faire** — garder WhatsApp, et **ajouter une seconde porte au même
endroit** : le téléphone cliquable avec les horaires déjà écrits, et un renvoi
ancré vers le formulaire. Faire passer les trois boutons par `BoutonDevis` avec
leur `sujet` par formule (`devis-la-vitrine`, `devis-le-site`,
`devis-l-assistant` — ils existent déjà dans `lib/formules.ts`).

**Effort** — 0,5 jour.

---

### D6 · Aucun lien de l'accueil vers les trois pages de formule — **accord unanime, et c'est devenu une réparation**

**Où** — `components/Offres.tsx:58, 71, 84`, à comparer à
`app/(site)/services/page.tsx:410-417`.

Comptage des liens `/services*` rendus par l'accueil :

```
/services/restauration    5      /services/la-vitrine    0
/services/suivi           3      /services/le-site       0
/services/imprimes        3      /services/l-assistant   0
/services/identite        2
/services/reseaux-sociaux 1
/services                 2
```

**Les deux analystes sont tombés sur la même ligne de code par deux chemins
différents** — l'un par le parcours d'achat, l'autre par le maillage et
l'autorité. C'est le constat le plus solide du dossier.

**Et il a empiré pendant que les rapports s'écrivaient.** La restructuration a
livré le menu déroulant : « Offres » a quitté la navigation, et le déroulant
liste *Tous les services* plus les cinq familles — **pas les trois formules**.
Comptage refait après la bascule :

```
/                      -> 0        (et 24 liens vers les 5 familles)
/studio                -> 0
/contact               -> 0
/services              -> 3        <-- la seule page du site qui les lie
nav (toutes pages)     -> 0
```

Il ne reste qu'un chemin vers les trois pages qui vendent le produit d'entrée :
nav → Services → *Tous les services* → `/services` → carte. Trois clics, et le
raccourci « Offres » qui sautait à la grille n'existe plus. **Le risque signalé
dans les deux rapports s'est réalisé : ce n'est plus une amélioration, c'est une
réparation.**

**Pourquoi c'est double** — côté visiteur, celui qui hésite entre deux paliers
n'a nulle part où aller sauf en arrière : les trois pages produit portent
l'argumentaire le plus complet du site (ce qui est inclus, ce qui ne l'est pas,
le palier vers lequel monter, trois questions propres à la formule, le suivi
obligatoire au bon endroit). Côté moteur, l'accueil est la seule page qui
recevra jamais des liens externes, et le maillage interne est le seul mécanisme
qui transmet cette autorité aux pages de vente. **Quatorze liens vers les cinq
pages secondaires, zéro vers les trois du produit principal.**

**L'objection devancée** — « le CTA WhatsApp est le chemin le plus court, un lien
secondaire le dilue ». Le dépôt a déjà tranché dans l'autre sens :
`components/CarteService.tsx:66` définit `LIBELLE_SA_PAGE = "Voir le détail"`
précisément comme affordance secondaire, avec un docblock qui explique pourquoi.
Le patron existe, il est motivé, il n'a pas été appliqué aux trois cartes qui
comptent le plus.

**Effort** — 30 min. Le motif est à copier depuis `services/page.tsx:410-417`.

---

### D7 · Le seul argument qui annule le risque est absent de **toutes** les pages qui portent un prix — **accord, et pire que le premier relevé**

**Où** — `app/(site)/studio/page.tsx:275` ; `components/Studio.tsx:53` ;
`components/ServicesRows.tsx:54`.

La séquence de livraison — *« Le site fini vous est présenté et validé. Le
paiement intervient à la livraison, et la mise en ligne suit. »* — n'est écrite
en toutes lettres que sur `/studio`.

Comptage du mot « paiement » sur le HTML rendu :

| Page | occurrences |
|---|---|
| `/` | **0** |
| `/services` | **0** |
| `/services/le-site` | **0** |
| `/contact` | **0** |
| `/studio` | 6 |

**Le mot est absent de toutes les pages qui portent un prix.** Sous la grille, la
seule borne écrite est « Deux allers-retours de correction compris ».

**Le mécanisme** — la question que se pose le lecteur devant 1'499.– n'est pas
« est-ce cher », c'est **« qu'est-ce que je risque si ça ne me convient pas ? »**.
La réponse existe et elle est excellente : *vous voyez le site fini, vous validez,
vous payez, et c'est seulement ensuite qu'il est mis en ligne*. Aucun acompte,
aucune avance. C'est la seule chose du site qui répond au risque perçu **sans
avoir besoin d'une preuve sociale** — et elle est à sept écrans du prix, sur une
page que le visiteur n'a aucune raison d'ouvrir avant d'avoir décidé.

**Où la mettre, et où surtout ne pas la mettre** — sous la grille, à côté des deux
allers-retours. **Pas dans le hero** : `.hero-foot` est collé au bas du pli par
construction (`min-height:100svh` en `flex-end`), et chaque ligne ajoutée pousse
le pied hors de l'écran sous 774,5 px de haut — mesure documentée à
`NoyauHero.tsx:80-131`. Les deux analystes sont explicitement d'accord sur ce
point : **rien ne doit être ajouté au hero.**

**Effort** — 1 h, avec la question de FAQ correspondante (voir D15).

---

## Bloc 2 — Le maillage (0,5 jour)

### D8 · `/services` publie 14 liens internes vers des pages qui répondent 404 — **accord, chiffre vérifié des deux côtés**

**Où** — `components/CarteService.tsx:87` → `hrefService(service.slug)`
(`lib/catalogue-familles.ts:143-145`), activé par `versSaPage` en
`app/(site)/services/page.tsx:264`.

Vérifié une URL à la fois, par les deux analystes indépendamment, **exact au slug
près** :

```
404 (14) : /services/{carte-visite, sticker-avis, affiche-evenement,
           identite-logo, photos, traduction, hebergement, suivi-assistant,
           la-carte, carte-fidelite, bons-cadeaux, chevalets,
           pack-saisonnier, site-sur-mesure}
200  (8) : les 3 formules + les 5 familles
```

**L'accueil, lui, n'a aucun lien mort** — `CarteDuStudio.tsx:123, 143` passe
`famille` et non `versSaPage`, et ses 24 liens partent vers les cinq pages de
famille qui répondent 200. Les deux mesures sont vraies : elles portent sur deux
pages différentes.

**Ce qui rend le constat sérieux** — le dépôt écrit lui-même la règle enfreinte,
à `lib/catalogue-familles.ts:183` : *« mieux vaut une carte sans porte de sortie
qu'une porte sur le vide »*. La ligne 87 de `CarteService.tsx` fabrique
exactement la porte sur le vide que ce commentaire interdit.

Côté visiteur : celui qui clique « Voir le détail » sur « Cartes de visite —
conception + 75 ex. », la carte la plus achetable du catalogue secondaire, tombe
sur une page d'erreur. Côté moteur : quatorze liens morts sur la page qui
centralise l'offre, c'est du budget d'exploration brûlé et un signal de site
inachevé.

**Ce qu'il faut faire — et l'ordre compte** — poser un garde-fou **avant**
d'ajouter le moindre lien ailleurs :

```ts
// à côté de FORMULE_SLUGS et FAMILLE_SLUGS
const SERVICES_AVEC_PAGE = [...] as const;
const porte = versSaPage && SERVICES_AVEC_PAGE.includes(slug) ? { ... } : null;
```

La carte redevient muette au lieu de mentir. Ce garde-fou doit exister **de toute
façon** : sans lui, la quinzième ligne ajoutée en base rouvrira le trou.

**Une contradiction interne du dépôt, relevée par l'un et confirmée par
l'autre** — le dépôt refuse d'écrire quatorze pages minces
(`lib/formules.ts:7-14`, et c'est une bonne règle) **et** émet quatorze liens
vers elles. Les deux positions ne peuvent pas tenir ensemble. Le garde-fou
tranche dans le sens de la règle écrite.

**Effort** — 20 min.

---

### D9 · Les trois formules absentes du menu déroulant — **accord**

Voir D6. Le déroulant « Services » remplace « Offres » dans la navigation ; sans
les trois formules, il ne remplace que la moitié de ce qu'il a retiré.

**Effort** — 15 min, dans le même passage.

---

### D10 · Cinq sections consécutives sans un seul lien — **accord, et les deux mesures se renforcent**

**Où** — `app/(site)/page.tsx:128-138` et les cinq composants concernés.

Vérification exécutée dans la page :

```
travaux : 0 <a>, 8 <button> (commandes du carrousel)    333 mots
services: 0 <a>, 0 <button>                             495 mots
methode : 0 <a>, 0 <button>                             145 mots
studio  : 0 <a>, 0 <button>                             188 mots
faq     : 0 <a>, 0 <button>                             673 mots
                                                     ---------
                                                      1 834 mots
```

Les deux analystes ont mesuré deux choses différentes, et **la vue robot est la
plus mauvaise des deux** :

- **Pour le visiteur** — 8,2 écrans sur 14,4, soit **57 % de la hauteur de la
  page**, sans une porte.
- **Pour le moteur** — 1 834 mots sur les 2 484 de l'accueil, soit **73,8 % du
  texte**, dans cinq sections consécutives à zéro lien. Un moteur distribue
  l'autorité par les liens contenus dans le texte, pas par les pixels parcourus.

Les deux seules portes qui subsistent sont hors flux — la pastille « Parlons-en »
et la bulle du chat, toutes deux en `position: fixed` — et **aucune des deux
n'est contextuelle** : la bulle affiche le même libellé qu'on lise la Méthode ou
la FAQ.

**Le mécanisme** — ces cinq sections sont précisément celles qui font monter
l'intention : la démonstration, les six gestes, la semaine, la personne, les
objections. À chaque palier de conviction, la seule chose que le lecteur peut
faire est **continuer à descendre**. Celui qui est convaincu par « Vous parlez à
celui qui fait le travail » à l'écran 7,4 est prêt **à cet instant** — il lui
reste 1,7 écran avant un prix et 6 avant un formulaire.

**Ce qu'il faut faire** — une sortie contextuelle en fin de chaque section, une
seule, qui dit ce qu'elle ouvre :

| Section | Sortie |
|---|---|
| Travaux | « Voir les formules et les prix → » vers `#offres` |
| Services | 6 liens, un par geste, vers les **cinq pages de famille** (qui répondent 200) — **jamais** `hrefService(slug)` |
| Méthode | « Ce que vous recevez → » vers `/services/le-site` |
| Le studio | « Qui tient le studio → » vers `/studio` |
| Questions | « Poser la vôtre → » vers `/contact` |

Aucune n'est un CTA d'achat : ce sont des passerelles vers du contenu déjà écrit,
déjà payé, et aujourd'hui inaccessible. Le contenu déplié des accordéons est déjà
dans le DOM (`grid-template-rows:0fr` + `overflow:hidden`), donc indexable — le
lien le sera aussi.

**Effort** — 0,5 jour, entièrement éditorial, aucun CSS nouveau.

---

## Bloc 3 — La mise en ligne

### D11 · Le site n'existe pas — **accord**

Voir §1.1. La mise en ligne exige les trois valeurs de D1.

**Le jour de la mise en ligne, dans cet ordre** : `NEXT_PUBLIC_SITE_URL`,
vérification du domaine en Search Console, soumission de `sitemap.xml`, puis
**inspection d'URL en direct sur l'accueil** — cinq minutes qui closent
définitivement la question de ce que Googlebot voit réellement (voir §5).

**Effort** — hors code (domaine, hébergement, décision juridique) + 40 min.

---

### D12 · Le renommage `/prestations` → `/services` sans redirection — **tranché : ce n'est pas urgent**

**Vérifié** — `/prestations`, `/prestations/identite` et `/prestations/le-site`
répondent 404. `next.config.ts` fait sept lignes et ne contient que
`output: "standalone"` — **aucun bloc `redirects`**, ni `middleware.ts`, ni
`proxy.ts`.

**Le vrai risque aujourd'hui : proche de zéro**, et c'est l'analyste SEO qui
démonte lui-même sa propre section. Les routes `/prestations` ont été créées le
30 août à 17h42 (`76ecd42`) et renommées le 31 : elles ont existé **moins de
vingt-quatre heures**, dans un dépôt jamais déployé sous un domaine résolvable.
Il n'existe aucune URL `/prestations` indexée, partagée ou liée depuis
l'extérieur.

**Pourquoi le faire quand même** — pas pour sauver de l'indexé, mais comme
assurance à six lignes contre un lien qui traînerait ailleurs qu'à l'index : un
message WhatsApp, un devis PDF, un signet. Et parce que le prochain renommage se
fera peut-être après la mise en ligne.

```ts
// next.config.ts
async redirects() {
  return [{ source: "/prestations/:path*", destination: "/services/:path*", permanent: true }];
}
```

La 404 fait déjà correctement son travail en attendant : `app/not-found.tsx`
renvoie un code 404, une page en français, et deux liens de secours dont un vers
`/services`.

**Effort** — 10 min.

---

## Bloc 4 — Le formulaire et la FAQ (3 h)

### D13 · Le formulaire demande le téléphone et n'accepte aucun e-mail — **accord, et moins cher que prévu**

**Où** — `components/ContactForm.tsx:189-197` ; `app/api/contact/route.ts:30-35`.

Trois champs : nom (requis), **téléphone (requis, avec regex)**, message
(facultatif), plus un leurre `website`. **Aucun champ e-mail**, ni requis ni
facultatif. Le schéma serveur confirme.

**Le mécanisme, en deux temps** :

1. **Téléphone obligatoire = « vous allez être appelé ».** Un dirigeant qui
   explore à 22 h sans vouloir décrocher demain n'a aucune voie écrite : la seule
   alternative offerte à cet endroit est WhatsApp — donc encore son numéro. **Le
   site ferme les deux portes non téléphoniques d'un coup.**
2. **Sans e-mail, on ne peut pas envoyer de devis.** Le studio annonce partout
   *« une proposition chiffrée le jour ouvrable suivant »* — y compris dans le
   prompt de l'assistant (`chat-prompt.ts:74-77`). Une proposition chiffrée
   s'envoie par écrit. **Le formulaire ne collecte pas le canal du produit qu'il
   vend.**

**La bonne nouvelle** — `prisma/schema.prisma:52` porte **déjà** `email String?`
sur le modèle `Lead`. **Aucune migration.** Il reste le champ, six lignes de Zod
et l'affichage.

**Et la portée a doublé** — `/contact`, livrée pendant l'analyse, importe le
**même composant** (`contact/page.tsx:376`).

**Ce qu'il faut faire** — ajouter un champ e-mail facultatif ; rendre le téléphone
facultatif **si** l'e-mail est rempli, et l'inverse, avec un message clair.
Aucune case pré-cochée, aucun consentement implicite.

**Effort** — 2 h, plafond.

---

### D14 · Le formulaire de l'accueil n'annonce ni délai ni confidentialité — **tranché : à moitié réglé**

**Où** — `components/FooterContact.tsx:47` ; `components/ContactForm.tsx:72`.

Au-dessus du formulaire de l'accueil, une seule ligne : *« ou dites-moi en deux
lignes ce qu'il vous faut »*. La mention **« Réponse le jour ouvrable suivant »**
n'y figure pas, et aucun lien vers `/confidentialite` non plus — alors que le
panneau du chat en porte un et que la page de confidentialité nomme
explicitement les champs de ce formulaire.

Le commentaire de `ContactForm.tsx:72` affirme pourtant que l'engagement *« est
déjà écrit au-dessus du formulaire »*.

**Ce que la contradiction a établi** — `/contact`, livrée depuis le premier
relevé, rend bien `MENTION_REPONSE` juste au-dessus du formulaire
(`contact/page.tsx:374`) et porte le lien de confidentialité (`:406`). **Le
commentaire est devenu vrai sur une surface et reste faux sur l'autre.** La
correction est donc plus petite que le premier rapport ne l'écrit — et elle est
plus utile écrite **une seule fois, dans le composant**, plutôt que sur chaque
page qui l'appelle.

**Effort** — 30 min.

---

### D15 · La FAQ ne traite aucune objection propre à un studio sans référence — **non contesté**

**Où** — `components/Faq.tsx:49-100`.

Les cinq questions : le délai — les textes et photos — l'hébergement et le
domaine — l'après — ce qui n'est pas fait à ce prix. Cinq bonnes questions, bien
répondues, et **leur placement avant le prix est un choix juste** (voir §6).

Mais aucune ne traite ce qu'un dirigeant se demande devant un prestataire qu'il
ne connaît pas :

- **« Vous l'avez déjà fait ? »** — la question numéro un, et la seule à laquelle
  le studio ne peut pas répondre par une référence. Il peut répondre par ce qu'il
  *montre* : l'assistant qui tourne ici, le tableau de bord, la séquence de
  livraison. **Ne pas y répondre du tout est pire que d'y répondre franchement** :
  le silence laisse le lecteur conclure seul.
- **« Comment et quand je paie ? »** — voir D7. La meilleure réponse du site, et
  elle n'est sur aucune page qui porte un prix.

**Deux questions, pas cinq** : une FAQ qui gonfle perd son autorité.

**Gain gratuit** — les questions vivent dans `construireQuestions()` et alimentent
aussi le JSON-LD `FAQPage`. Le bénéfice de référencement ne coûte rien de plus.

**Effort** — 1 h de rédaction, zéro code.

---

## Bloc 5 — L'assistant (1 h)

### D16 · L'assistant pose trois questions numérotées en violation de sa propre règle — **TRANCHÉ, et le premier rapport avait tort**

C'est le seul désaccord de fond des deux rapports, et il s'est réglé sur une
source du dépôt.

**Ce que le premier analyste a mesuré** — deux appels réels à `/api/chat` :

> « je suis plombier à Genève, mon site date de 2014. **Combien pour le refaire ?** »
> → « Quel est votre métier et quel support souhaitez-vous faire créer ou refondre ? »
>
> « Plombier. Un site. **Je vous ai demandé le prix : combien ça coûte ?** »
> → « Quel problème principal rencontrez-vous avec votre site actuel ? »

Il en a conclu : *« l'assistant ne répond pas à la question posée »*, et l'a
classé en n°2 avec une consigne de ne plus le montrer tant qu'il n'est pas
réparé.

**Ce que le second a opposé** — `lib/llm.ts:345-349`, relevé daté du **24 août**,
verbatim :

> *« A RETENIR : la première sonde m'a fait accuser le modèle d'une esquive qui
> était la mienne. Je posais la question de prix au tout premier tour, là où le
> prompt impose "1. Demande quel type de commerce" — le modèle obéissait. […]
> sonder aussi avec un **HISTORIQUE plausible**, sinon on mesure sa propre
> erreur. »*

**Les deux essais du premier analyste ouvrent la conversation par la question de
prix. C'est très exactement l'erreur consignée.**

Refait au protocole du dépôt — même prompt, même catalogue, historique plausible,
question de prix au quatrième tour :

> **assistant** — « Nous allons refaire votre site de plombier à Genève :
> amélioration du formulaire de devis et design lisible sur mobile. **Le tarif
> pour "Le Site" est de 1 499 CHF (TVA comprise).** Pour vous envoyer une
> proposition détaillée, pourriez-vous me donner votre prénom et votre numéro
> WhatsApp ? (Nous vous enverrons le devis le jour ouvrable suivant.) »

Prix exact du catalogue Postgres, mention de TVA, récapitulatif, prénom et
numéro, engagement du jour ouvrable suivant. **L'étape 4 du déroulé fonctionne.**

**Ce qui survit, et qui est un vrai défaut** — face à un visiteur qui réaffirme un
fait déjà donné et insiste (*« Je vous ai déjà dit que je suis plombier. Ma
question est le PRIX »*), l'assistant n'a ni répondu, ni respecté
`chat-prompt.ts:62` (« **UNE seule question par message** ») : il en a posé
**trois, numérotées**.

**Verdict** — l'assistant tient devant un visiteur qui converse, et trébuche
devant un visiteur qui interroge. Ce n'est pas « la seule preuve fonctionnelle du
studio est cassée ». Le constat survit comme un **durcissement de prompt d'une
heure** ; le classement en n°2 et l'embargo sur la démonstration ne survivent
pas.

**Ce qu'il faut faire** — réécrire le déroulé en **règle de priorité** plutôt
qu'en séquence : *« Réponds d'abord à ce qui est demandé si la réponse est dans
le catalogue. Ne repose jamais une information déjà donnée. Puis pose la question
suivante encore sans réponse. »* Conserver « une question par message ». Re-sonder
**avec un historique plausible**, comme `llm.ts:352-353` l'exige.

**Effort** — 1 h.

---

### D17 · Le quota du modèle — **TRANCHÉ : mauvais fournisseur, le risque n'existe pas**

Le premier rapport signalait un risque adjacent : `lib/llm.ts:73-76` documente un
quota « par modèle, 20 requêtes par jour », alors que `app/api/chat/route.ts:31`
fixe un budget applicatif de 200. Conclusion avancée : *« quatre conversations de
cinq tours suffisent à épuiser la journée »*.

**C'est faux sur la configuration qui tourne.** `.env` porte
**`LLM_PROVIDER=groq`**, et `lib/llm.ts:38-40` aiguille sur Groq. Le relevé de
20 requêtes/jour est un relevé **Gemini**, sur la branche **inactive**.

La contrainte réelle est documentée à `llm.ts:341-344` : Groq régule à la
**minute** (TPM 8000, ~6 requêtes/minute tous visiteurs confondus) et **revient
tout seul** — *« c'est l'inverse du quota Gemini : Gemini s'épuise pour la
JOURNÉE, Groq se régule à la MINUTE »*.

**Conséquence pratique** — l'heure de « sonde de quota » recommandée par le
premier rapport sonderait le fournisseur qui ne répond pas. **À ne pas faire.**
Cinq appels réels au cours des deux analyses ont abouti en 1,3 à 2,8 s.

---

### D18 · « Terminer la conversation » est le bouton qui enregistre la demande — **non contesté**

**Où** — `components/ChatWidget.tsx:110-128`.

C'est ce bouton qui appelle `/api/chat/finalize`, écrit le Lead et notifie
Telegram. Le mot « Terminer » se lit comme un abandon.

Le filet existe — `pagehide` + `sendBeacon` finalise aussi, dès quatre messages
(`:95-105`) — donc le lead n'est pas perdu. Mais il est enregistré **au départ du
visiteur plutôt qu'à son geste volontaire**, et sans la confirmation qui le
rassure.

→ **« Envoyer ma demande à Ayoub »**.

**Effort** — 5 min.

---

### D19 · « Sur devis, chiffré après deux questions » : les deux questions n'existent nulle part — **non contesté**

**Où** — `lib/format.ts:60` (`QUOTE_NOTE`), rendu par `CarteService.tsx:162`.

Le raisonnement complet sur le devis (`lib/familles.ts:154`, `MENTION_DEVIS`) est
**un des meilleurs textes du site** : il transforme « sur devis » d'un refus en
une méthode. Mais lorsqu'on clique « Demander un devis », on n'obtient pas deux
questions : on obtient l'assistant en conversation libre, dont le déroulé compte
**cinq étapes** avant de récapituler.

La promesse est chiffrée — « deux » — donc vérifiable, donc elle sera vérifiée.

**Note de méthode** — le premier rapport cite ici `chat-ouvrir.ts:406` ; **le
fichier fait 21 lignes**. La référence est fausse ; le mécanisme, lui, est réel
et documenté à `ChatWidget.tsx:77-89`, qui écrit que le `sujet` transmis par
`BoutonDevis` **n'est pas encore consommé**.

**Deux options** — brancher le `sujet` et faire poser les deux questions propres
à la ligne (tirage + date pour un imprimé ; nombre de pages + échéance pour un
site) : 0,5 jour. Ou aligner le texte sur ce qui se passe — « chiffré après un
échange » : 10 min.

---

## Bloc 6 — Le référencement de fond (~10 h)

### D20 · « Fiche Google » : 64 mentions en prose, zéro page — **non contesté**

C'est une ligne comprise dans Le Site et L'Assistant, c'est une requête à
intention d'achat immédiate chez le même ICP, et c'est le sujet sur lequel le
studio a le plus à dire honnêtement — il en vend l'exécution. Le
`hasOfferCatalog` de `SchemaStudio.tsx:75` déclare l'offre au moteur, et le
moteur n'a **aucune page à lui proposer en face**.

Le gabarit existe et il est bon : les cinq pages de famille font 768 à 1 439 mots,
un `h1` avec « Genève », un `Service` en JSON-LD, une canonique propre.

**Effort** — 2 à 3 h.

---

### D21 · « Création de site » : zéro occurrence, alors que la prestation est vendue — **non contesté**

Comptage sur les dix pages publiques concaténées : « refonte » 35 fois,
« refait » 21 fois, **« création de site » et « créer un site » : zéro**.

Or `.agents/product-marketing.md` §5 prévoit explicitement le départ de zéro
(« maquette proposée, le client ajuste ») et §9 écrit « refonte **comme départ de
zéro** ». Le dirigeant genevois qui n'a pas encore de site cherche « création
site internet Genève » et ne trouve, lexicalement, rien. **Le site ne parle qu'à
celui qui a déjà un site.**

Ce n'est pas un désaccord avec le positionnement : c'est un mot vendu qui n'est
écrit nulle part.

**Effort** — 1 h pour la version minimale (une phrase dans
`/services/la-vitrine` et dans la `seoDescription` de `lib/formules.ts:143`), 2 à
3 h pour une page propre.

---

### D22 · `og:image` absente sur 13 pages sur 14 — **non contesté**

Seule `/` porte une `og:image`. `/services`, `/services/le-site`, `/studio`,
`/contact`, les pages légales : **aucune**. Toutes portent pourtant
`twitter:card = summary_large_image`.

**Le mécanisme n'a rien de technique** — le CTA principal du site est un lien
WhatsApp, et WhatsApp déplie une carte de prévisualisation. Une page de formule
partagée dans une conversation — le geste exact que le studio provoque —
s'affiche sans image. `/studio` et `/contact` sont précisément les deux pages
qu'on colle dans une conversation : « voilà qui je suis », « voilà comment me
joindre ».

**Cause probable, appuyée par le dépôt lui-même** — `lib/site.ts:135-140`
documente qu'*« une page qui déclare son propre `openGraph` REMPLACE
intégralement celui du layout »*. `openGraphPage()` (`:147-160`) a été créée pour
corriger `og:url` et, ce faisant, écrase l'objet `openGraph` du layout, image de
convention de fichier comprise. L'accueil y échappe parce qu'il ne redéclare pas
`openGraph`. **Le symptôme est vérifié ; la cause est une hypothèse forte, à
confirmer en une minute.**

**Correction** — ajouter `images` dans `openGraphPage()`. Un seul endroit :
`lib/formules.ts`, `lib/familles.ts`, les deux pages légales et `/services`
passent toutes par elle.

**Effort** — 20 min.

---

### D23 · `FAQPage` sur l'accueil seulement, alors que huit pages portent des Q/R — **non contesté**

`components/Faq.tsx:130` émet un `FAQPage` sur l'accueil. Les cinq pages de
famille et les trois pages de formule rendent leurs questions **à l'écran** et
n'émettent que `Service`.

C'est le format que les moteurs de réponse citent le plus volontiers, et la veille
(`docs/agents/veille/synthese.md`, opportunité 5) note que les pages Q/R
structurées sont un différenciant déjà occupé par trois concurrents sur six.

**Aucune rédaction** : un tableau `mainEntity` alimenté par le champ `questions`
déjà présent.

**Effort** — 45 min.

---

### D24 · `/services` n'émet aucune donnée structurée — **non contesté**

Zéro bloc `application/ld+json` sur `/services`, contre deux sur `/` et un sur
chacune des huit sous-pages. **La page qui présente tout le catalogue, avec les
dix-huit prix lus en base, est la seule à ne rien déclarer.**

Un `ItemList` ou un `OfferCatalog` reprenant le même `hasOfferCatalog` que
`PageFamille.tsx:106-133`, prix et `valueAddedTaxIncluded` compris.

**Effort** — 1 h.

---

### D25 · Aucun `BreadcrumbList`, alors que le fil existe déjà à l'écran — **non contesté**

`PageFamille.tsx` et `services/[slug]/page.tsx` rendent tous deux un lien
« Services » en tête de page : c'est un fil d'Ariane visuel. Aucun
`BreadcrumbList` dans le JSON-LD d'aucune page. C'est ce qui remplace l'URL brute
par un chemin lisible dans le résultat Google. **L'information est déjà là.**

**Effort** — 30 min.

---

### D26 · Le `ProfessionalService` n'existe que sur l'accueil — **non contesté, monté en priorité**

Les schémas `Service` des huit sous-pages référencent
`provider: { "@id": SITE_URL + "/#studio" }`, nœud qui n'existe que sur
l'accueil. Et depuis la livraison des deux nouvelles pages, **cinq types de page
le référencent désormais sans le contenir** : `Service` sur les trois formules et
les cinq familles, `AboutPage` sur `/studio`, `ContactPage` sur `/contact`.

**La motivation écrite reste bonne** — *« deux fiches du même prestataire qui
divergeraient d'un mot valent moins qu'une seule »*. Mais la résolution d'un
`@id` d'une page à l'autre n'est pas garantie par Google, et **`/contact` est
exactement la page où l'entité doit être complète**, puisque c'est celle que le
moteur associe à l'entreprise.

**Correction** — rendre `<SchemaStudio />` sur toutes les pages. La source reste
unique, la fiche devient résoluble partout, et les `@id` existants continuent de
fonctionner tels quels.

**Effort** — 20 min.

---

### D27 · `/studio` n'émet aucun `Person` — **non contesté**

La page s'appelle « Ayoub Bensalem, studio de création digitale à Genève », elle
raconte qu'une seule personne fait le travail — et le seul `Person` du site reste
le `founder` du `ProfessionalService` de l'accueil (`SchemaStudio.tsx:93`), sans
`@id`, donc non réutilisable.

C'est la page E-E-A-T du site. Lui donner un `Person` avec `@id`, `jobTitle`,
`worksFor` et — quand ils existeront — les `sameAs` de D2.

**Effort** — 20 min, dans le même passage que D26.

---

### D28 · La zone desservie est déclarée plus étroite que la vérité — **non contesté**

`SchemaStudio.tsx:96-105` déclare `areaServed` = `City` « Genève », seule.
`.agents/product-marketing.md` §9 dit « Genève **et alentours** ». Déclarer les
communes réellement couvertes n'invente rien et élargit la fiche.

**Effort** — 20 min.

---

### D29 · Le `h1` de l'accueil ne porte ni « Genève » ni une intention d'achat — **non contesté, décision du propriétaire**

Les douze pages ont exactement un `h1`, hiérarchie propre, pas de saut. **Onze
`h1` sur douze contiennent « Genève ». Celui de l'accueil, non** : « Site,
imprimés, photos, réseaux. Une seule personne. »

**Ce qui n'est pas en cause** — le choix est documenté et bon dans son intention
(`NoyauHero.tsx:61-67`) : le titre nomme le métier, pas un produit, parce que
l'ancien titre reléguait l'identité, les imprimés et la photo en appendice. **Il
n'est pas demandé de revenir en arrière.**

**Ce qui est maintenu** — la ville manque sur le seul `h1` qui compte, et la
contrainte technique (21 caractères par ligne au plus large) ne l'interdit pas.
Deux variantes qui gardent exactement la même affirmation :

```
Site, imprimés,       (15)      Site, imprimés,        (15)
photos, réseaux.      (16)      photos, réseaux.       (16)
À Genève, une main.   (19)      Genève, une personne.  (21)
```

Le kicker porte déjà « Genève, Suisse », mais un `span.meta` ne vaut pas un `h1`.

**Effort** — 15 min et un contrôle visuel. **La décision revient au
propriétaire.**

---

### D30 · Les métiers de l'ICP : zéro mot — **non contesté, et borné**

`plombier`, `garage`, `fiduciaire`, `artisan` : **zéro occurrence** sur les dix
pages. `Carouge`, `Meyrin`, `Lancy`, `Vernier`, `Nyon` : **zéro**.

C'est le levier classique du référencement local, et c'est aussi le plus facile à
rater. **Pas vingt-cinq pages : trois ou quatre**, sur les métiers où le studio
peut dire quelque chose de vrai et de différent — les questions que le formulaire
pose à un garage ne sont pas celles qu'il pose à une fiduciaire, et ça, c'est du
contenu réel.

**La borne vient du dépôt lui-même** : `lib/formules.ts:7-14` refuse à juste titre
d'écrire dix-huit pages minces pour dix-huit lignes de catalogue. La même règle
interdit vingt-cinq pages métier.

**Effort** — 3 h la page. **Après la mise en ligne, pas avant.**

---

### D31 · Le carrousel montre l'ancien positionnement — **tranché sur le chiffre, maintenu sur le fond**

**Où** — `components/ui/feature-carousel.tsx:389-425` ;
`components/Travaux.tsx:20-23`.

La section (01), nommée **« Travaux »** dans la page et dans la nav, titrée
*« Tout a un avant. Voici les après. »*, présente cinq pièces construites autour
d'un établissement fictif, « Le Comptoir ».

**Ce qui a été tranché** — le premier rapport écrit « quatre pièces sur cinq
relèvent de la restauration ». **C'est trois.** La pièce 03 n'est pas un imprimé
de restaurant : c'est **la carte de visite de Nawa Corps** (`:274` :
`<b>WEB</b> nawacorps.ch`). Décompte exact : 3/5 restauration, 1/5 le studio
lui-même, 1/5 le site.

**Ce qui est maintenu, et que les deux analystes accordent** :

1. **Rien ici n'est trompeur.** Le chapô dit « Cinq **démonstrations** du
   studio », l'étiquetage interne est sérieux (« Démonstration — établissement
   fictif »), les détails localisables ont été retirés. Le problème est
   d'adéquation, pas de sincérité.
2. **Le mot « Travaux »** désigne, pour un dirigeant, un portfolio de
   réalisations. Le chapô corrige, mais il arrive après le titre et après l'index
   de nav.
3. **Le premier écran de preuve qu'un plombier rencontre reste un menu de bar**,
   puis une affiche de soirée jazz — c'est-à-dire l'ancien positionnement, que
   `.agents/product-marketing.md` §2 déclare abandonné comme cœur de cible.
4. **La pièce qui compte est en position 02**, et l'autoplay tourne toutes les
   4,2 s : le visiteur voit d'abord « La carte ».

**Ce qu'il faut faire, dans l'ordre de disponibilité** :

- **Immédiat, 1 h** — mettre « Le site » en position 01, et renommer la section
  « Avant / après » ou « Démonstrations ». Le titre *« Tout a un avant. Voici les
  après. »* fonctionne avec les deux.
- **Quand l'accord arrive (D3)** — remplacer la carte fictive par la vraie,
  étiquetée « Réalisé pour un client — Genève ». **Une seule pièce réelle change
  la nature de toute la section.**
- **Après D16** — ajouter la sixième démonstration, qui est le site lui-même :
  l'assistant, l'alerte Telegram et le tableau de bord tournent ici. Vérifiable à
  l'instant, sans le consentement de personne.

**Ce qu'il ne faut pas faire** — inventer un témoignage, un compteur de clients,
une note ou un logo. LCD art. 3.

---

### D32 · Aucun `llms.txt` — **non contesté, et explicitement hors des priorités**

`GET /llms.txt` → 404. `robots.txt` est propre mais n'autorise nommément aucun
robot de moteur de réponse. La veille note que trois concurrents sur six le font,
et qu'un seul autorise nommément GPTBot / ClaudeBot / PerplexityBot — « ce qui
montre que la barrière technique est basse ».

**Réserve honnête, de l'analyste lui-même** — `llms.txt` n'est pas un standard
consommé par Google et son effet mesuré est nul à ce jour. **Ce n'est pas un
levier de trafic.** Il ne mérite de passer devant rien.

**Effort** — 1 h.

---

## Bloc 7 — Hygiène (~3 h)

| # | Constat | Où | Correction | Effort |
|---|---|---|---|---|
| D33 | `<html lang="fr">` alors que `og:locale` vaut `fr_CH` | `app/layout.tsx:54` | `lang="fr-CH"` | 2 min |
| D34 | Deux `<meta name="robots">` sur la 404 racine. Le `nofollow` **annule les deux seuls liens de secours de la page** | `app/not-found.tsx:32` | Retirer le bloc `robots` — c'est déjà ce que fait, à raison, `app/(site)/not-found.tsx:30-31` | 5 min |
| D35 | Les accordéons de `ServicesRows` s'ouvrent au clic sur un `<div>`, sans `aria-expanded`, **inaccessibles au clavier** | `ServicesRows.tsx:53`, `Interactions.tsx:230-236` | `<button>` + `aria-expanded` | 45 min |
| D36 | Aucun `priceRange` dans le JSON-LD | `SchemaStudio.tsx:52-53` | Le docblock a raison sur le fond (les prix vivent en base) — mais `SchemaStudio` est un composant serveur : il peut lire `chargerCatalogue()` comme le fait `NoyauHero` et dériver la fourchette. Aucun montant en dur | 30 min |
| D37 | La pastille « Parlons-en » pointe encore l'ancre `/#contact` alors que `/contact` existe — et la nav porte désormais **deux** entrées de contact | `Nav.tsx` | Repointer vers `/contact`. Le libellé lui-même est à trancher : le guide de voix §7 l'interdit nommément et prescrit « Refaire mon site » pour cette place | 5 min |
| D38 | `FooterContact` écrit « Lu–Sa · 9h–19h » **en dur** là où `/contact` le dérive de `HORAIRES` | `FooterContact.tsx` | Deux graphies qui finiront par diverger. Dériver comme `/contact` | 10 min |
| D39 | `reseaux-sociaux` est à la fois slug de famille **et** slug de la table `Service` | `lib/catalogue-familles.ts` | Bénin aujourd'hui (cette famille ne contient que cette ligne), **bloquant** le jour où elle mérite sa propre page produit. Documenté dans le docblock de `hrefService()` | à savoir |
| D40 | « Méthode » a quitté le menu plein écran pendant la restructuration | `MenuOverlay.tsx` | L'ancien menu avait une entrée que la nav n'a jamais portée. Revient en une ligne si elle est voulue | 5 min |
| D41 | Le survol du menu déroulant n'a pas pu être prouvé — l'onglet piloté reste `document.hidden`, les transitions y sont gelées | `NavServices.tsx` | Clic et clavier sont prouvés (Échap, flèche bas, panneau fermé qui refuse le focus). **Le survol reste à voir de tes yeux au-dessus de 860 px** | contrôle visuel |
| D42 | `/Services` (majuscule) → 404 sans redirection | — | Négligeable, à laisser | — |

---

## 3. Ce que le débat a tranché

Cinq points où les deux analystes se sont opposés. Chacun s'est réglé sur une
source du dépôt, pas sur une opinion.

| Sujet | Position initiale | Verdict | Source |
|---|---|---|---|
| **L'ordre du travail** | Conversion d'abord | **Acquisition d'abord** — non pas par impact, mais par **chemin critique** : ce qui a une latence externe passe devant. La conversion tient dans l'ombre de l'attente et ne coûte aucun jour de calendrier. Concédé sans réserve | — |
| **L'assistant** | « Il ne répond pas », classé n°2, embargo sur la démonstration | **Réfuté.** Le protocole de test est celui que le dépôt interdit nommément. Refait correctement, l'assistant donne le prix exact du catalogue. Survit : trois questions numérotées sur insistance, en violation de sa propre règle. **1 h, pas 3, et aucun embargo** | `lib/llm.ts:345-349` |
| **Le quota du modèle** | « Quatre conversations épuisent la journée » | **Réfuté.** Le relevé de 20 req/jour est un relevé **Gemini** ; le fournisseur actif est **Groq**, qui régule à la minute et revient seul. La sonde recommandée viserait le mauvais fournisseur | `.env`, `llm.ts:38-40`, `:341-344` |
| **Le carrousel** | « 4 pièces sur 5 relèvent de la restauration » | **Corrigé : c'est 3.** La pièce 03 est la carte de visite de Nawa Corps. Le reproche d'adéquation tient ; le chiffre, non | `feature-carousel.tsx:274` |
| **Les redirections** | Point du mandat, attendu haut | **Déclassé par l'analyste lui-même.** Les routes ont vécu moins de 24 h, jamais sous un domaine résolvable. Rien à perdre. À faire comme assurance, pas comme urgence | `76ecd42` |

**Et un point où le second a tranché contre son propre camp** : la profondeur du
hero — 3,74 écrans avant la première section, mesurée identique à deux
résolutions — **n'a aucun effet sur le référencement**. Le HTML servi contient
tout dans l'ordre du DOM, et un robot ne défile pas. C'est un constat de
conversion pur.

**Bilan du garde-fou** : sur les seize décisions que l'analyste SEO avait
recensées comme « à ne pas rouvrir », **une seule est tombée** — et elle est
tombée sur le constat le mieux classé de son collègue. Le piège s'est refermé une
fois, pas vingt.

---

## 4. Ce qui fonctionne, et qu'il ne faut pas toucher

Chaque ligne ci-dessous ressemble à un défaut. Chacune a une raison écrite dans
le dépôt. **Les rouvrir sans nouvelle mesure coûterait plus cher que le prétendu
gain.**

| # | Ce qui a l'air cassé | Pourquoi ça tient | Source |
|---|---|---|---|
| 1 | `force-dynamic` sur l'accueil, « mauvais pour la vitesse » | Mesuré : 20 ms en `force-dynamic` contre 17 ms en ISR — dans le bruit. Et l'ISR **casse le build** : l'étage builder du Dockerfile n'a pas de base, `next build` échoue en `P1001` | `app/(site)/page.tsx:70-91` ; perf-report §3 |
| 2 | L'écran de chargement de deux secondes | **Déjà corrigé** : 0.30 par tic, 120 ms d'attente, voile à .7s → ~1 600 ms au lieu de 2 880 | `Interactions.tsx:67-89` |
| 3 | Le favicon de 84 Ko | **Déjà corrigé** : `app/icon.png` fait 4 149 octets | — |
| 4 | Aucun `next/link` sur le site public | Les révélations au scroll ne s'initialisent qu'une fois. Un `next/link` naviguerait sans remonter l'observateur, et la page suivante resterait à `opacity:0` | `CLAUDE.md`, décision B7 |
| 5 | Le scroll inertiel « qui découpe la page pour le robot » | `useSmooth = finePointer && !reduced`. Le robot mobile de Google n'a pas de pointeur fin : il ne l'active jamais | `Interactions.tsx:175` |
| 6 | `[data-reveal]{opacity:0}` « qui cache la moitié du site » | Filet `<noscript>` qui rejoue le repli prévu sous `prefers-reduced-motion`. Le texte est dans le DOM servi (§5) | `app/(site)/layout.tsx:98-110` |
| 7 | « Le Comptoir », client inventé | **Ce n'est pas une indication trompeuse.** Étiquetage explicite, détails d'allure réelle retirés, pièces `aria-hidden`. Les deux analystes l'accordent | `Travaux.tsx:23`, `feature-carousel.tsx:212-217` |
| 8 | Aucun avis, aucune note, aucun `aggregateRating` | **Volontaire, et c'est la seule position légale.** Zéro avis réel ; LCD art. 3. Le trou se comble par une vraie fiche Google, **jamais** par du balisage | `PageFamille.tsx:102-104` |
| 9 | `address` sans rue dans le JSON-LD | Pas de bureau. Inventer une rue « pour faire local » est exactement la donnée fausse que le verrou existe pour empêcher — et une donnée structurée fausse se propage hors du site | `lib/site.ts:63-70` |
| 10 | `NAP_CONFIRME`, un drapeau qui vaut `true` et « ne sert plus » | Pas un vestige : le bon geste, le jour où une coordonnée redevient incertaine, est de **cesser d'émettre**, pas de corriger sur place | `SchemaStudio.tsx:40-46` |
| 11 | La meta description lit Postgres à chaque requête | Le prix d'entrée dans l'extrait Google qualifie le clic avant la visite, et la règle du dépôt interdit tout montant en dur. Lecture mémoïsée par `cache()` : zéro aller-retour supplémentaire | `app/(site)/page.tsx:16-55` |
| 12 | Le sous-titre du hero « trop court » | Mesuré au pixel : à 151 caractères il rendait trois lignes et le pied sortait de l'écran sous 774,5 px. Le seuil est un seuil de **lignes**, pas de caractères. **Rien ne doit être ajouté au hero** | `NoyauHero.tsx:80-131` |
| 13 | « Réponse le jour ouvrable suivant » absent des 5 pages de famille | Décision écrite : cinq occurrences de plus en feraient une formule de remplissage. Présent aux deux endroits où treize lignes « sur devis » se présentent ensemble | `lib/familles.ts:167-181` |
| 14 | `/admin` interdit deux fois | Pas redondant : la balise exige de visiter la page, `robots.txt` évite le passage. Et **aucune des deux n'est une mesure de sécurité** — c'est l'authentification qui protège | `app/robots.ts:10-20` |
| 15 | Le `h2` « Le studio » en `sr-only` | Pratique d'accessibilité légitime : la section a un titre pour la structure sans imposer un titre visible | `Studio.tsx:47` |
| 16 | Trois pages de formule, pas dix-huit | Quinze lignes de base n'ont qu'un nom, une description d'une ligne et un prix : quinze pages interchangeables desservent les quinze. **C'est la règle qui borne aussi D30 à trois ou quatre pages métier** | `lib/formules.ts:7-14` |
| 17 | **L'ordre des sections de l'accueil** | Les objections (FAQ, écran 8,3) passent **avant** le prix (écran 9,1), et c'est documenté. Une objection traitée après la décision ne sert plus. **Aucun réordonnancement n'est recommandé** — le problème n'est pas leur ordre, c'est qu'aucune n'offre de sortie (D10) | `app/(site)/page.tsx:111-115` |
| 18 | `MENTION_DEVIS`, le raisonnement sur les treize « sur devis » | **La meilleure page de vente du site.** Il transforme un trou en méthode, les deux nombres sont dérivés de la base, il est rendu là où il sert. **Ne pas le raccourcir** | `lib/familles.ts:154` |
| 19 | Les prix affichés | Tous lus en Postgres, mention de TVA collée au montant par unité de lecture. Aucun prix barré, aucun « tarif de lancement », aucune rareté. Les trois formules portent « Pour qui » plutôt que « N° 01/02/03 » | `prisma/seed.ts` |

**Un mot sur les techniques de pression** — aucune n'a été trouvée sur le site :
pas de faux compteur, pas de compte à rebours, pas de case pré-cochée, pas de
rareté fictive. Le seul prix caché est celui de D4, et il est **involontaire** —
le code contredit sa propre intention documentée. C'est une discipline rare et
elle vaut de l'argent.

---

## 5. Ce qu'un robot lit vraiment — vérification faite

**La question** : le hero est du DOM serveur mais son texte est révélé par
JavaScript. Que voit un robot ?

**Vérifié dans le HTML brut de `/`, sans exécuter une ligne de JavaScript** : le
`h1`, ses trois lignes, le kicker, le sous-titre avec le prix lu en base, les
quatre temps du noyau, les six accordéons **dépliés**, les 29 `h3`, les deux blocs
JSON-LD. **2 484 mots de texte visible.** Tout est là.

Trois mécanismes auraient pu casser ça, et aucun ne casse — voir les lignes 5 et
6 du tableau ci-dessus.

**Ce qui reste à vérifier** — le rendu réel par Googlebot, qui ne se contrôle
qu'avec l'outil d'inspection d'URL de la Search Console, sur une URL en ligne.
**Cinq minutes le jour de la mise en ligne, et le sujet est clos
définitivement.**

---

## 6. La performance — ce qui est mesuré, ce qui ne l'est pas

**Contrainte du propriétaire : moins de deux secondes.**

**Mesuré en production le 30 août** (`next build` + `next start`, 25 tirs par URL,
base peuplée) : accueil **20 ms** de TTFB, page légale 5 ms. Une lecture Postgres
coûte 2,14 ms en médiane. **Le serveur n'est pas le sujet** — les 415 ms qui
avaient lancé l'alerte étaient la compilation à la volée de `next dev`.

**Calculé sur le code d'aujourd'hui** — l'écran de chargement est le poste
dominant et **il a déjà été corrigé** :

```
13 tics × 60 ms                        = 780 ms
+ setTimeout 120 ms                    = 900 ms avant la classe .loaded
+ transition du voile .7s
--------------------------------------------------
premier écran dégagé ≈ 1 600 ms après le démarrage du JavaScript
```

C'était 2 880 ms avant correction. **L'objectif est atteignable — mais « après le
démarrage du JavaScript », pas « après le clic ».** Il reste ~147 Ko de JS
compressé à télécharger et exécuter.

**Non mesuré, et non inventé** — le LCP réel, l'INP et le CLS se mesurent sur du
trafic, via CrUX ou PageSpeed Insights, sur une URL publique. Il n'y en a pas.
Toute estimation avancée aujourd'hui serait une estimation, pas une mesure. **À
faire le jour de la mise en ligne.**

**Le seul poste remis sur la table** — `components/ui/feature-carousel.tsx` est le
plus gros composant client (20,9 Ko de source) et il sert une section **sous la
ligne de flottaison**. Le rapport de perf l'avait écarté à juste titre :
« corriger l'intro d'abord rend ce chantier discutable ». L'intro est corrigée
maintenant, donc le calcul a changé — 10 à 20 Ko compressés face à 1 600 ms, ce
n'est plus 5 % du problème. **Mais : après une vraie mesure PageSpeed, pas à
l'aveugle.** Un `next/dynamic` avec `ssr: true` garderait le HTML servi intact.
1 h.

---

## 7. Ce qui n'a pas été mesuré

À dire avant que ce soit opposé.

- **Aucune donnée d'audience.** Zéro visiteur, zéro taux. Tous les constats
  portent sur la **structure** du parcours, jamais sur son rendement observé.
  Aucun chiffre de conversion n'est avancé, ni avant, ni après.
- **Le mobile réel.** La fenêtre du navigateur piloté n'a pas pu être
  redimensionnée (`innerWidth` figé à 1446). La profondeur du hero est
  indépendante du viewport par construction et a été confirmée à deux résolutions,
  mais **les positions en pixels des autres sections ne valent que pour le
  viewport indiqué**. Le rendu à 390 px n'a jamais été observé.
- **Les volumes de recherche genevois.** Aucun outil de mots-clés disponible.
  **Aucun volume n'est avancé** et les intentions ne sont pas classées par volume
  supposé — elles le sont par ce que le studio vend réellement.
- **Le rendu par Googlebot.** Raisonnement sur le code, signalé comme tel. Se
  clôt en cinq minutes le jour de la mise en ligne.
- **Le comportement de `wa.me` hors du site.** Le constat D5 ne porte pas sur ce
  qui se passe là-bas, mais sur ce qui n'existe pas ici.
- **Le poids du bundle après la restructuration.** L'arbre bougeait pendant les
  relevés.

---

## 8. Ce qui ne dépend pas du code

Cinq décisions du propriétaire. Rien ne démarre sans les trois premières.

1. **La forme juridique** — raison individuelle ou Sàrl.
2. **L'adresse de domiciliation** — nécessaire pour la fiche Google et pour le
   registre, indépendamment du site.
3. **L'hébergeur** — à confirmer, le placeholder est visible en production.
4. **L'accord écrit du client** pour publier la carte réellement réalisée.
5. **L'accord de 101 Agency** pour montrer des travaux de réseaux sociaux avec la
   mention du rôle — le positionnement §6 et §7 le prévoient et le bornent.

Et deux arbitrages éditoriaux : le `h1` de l'accueil (D29) et le libellé de la
pastille (D37).
