# Réécriture — chrome partagé (nav, menu, chargement, assistant)

> Mode `propose`. Ces textes sont rendus par `app/(site)/layout.tsx` et
> apparaissent donc sur les **trois pages** du site. Ils ont leur fichier propre
> pour cette raison : les corriger dans `accueil.md` laisserait croire qu'ils ne
> concernent qu'une page.
> Référence : `docs/agents/brand/voice-guide.md`.

---

## 1. La pastille de la barre de navigation

- **AVANT** (`components/Nav.tsx:62`) — **Parlons-en**
- **APRÈS** — **Refaire mon site**
- **POURQUOI.** Guide §7 : un CTA est un verbe suivi d'un bénéfice, et la liste
  des formules bannies contient « Parlons-en » nommément. C'est aussi le seul
  bouton visible en permanence sur les trois pages, donc celui qui est vu le
  plus souvent : « parlons-en » propose une conversation, « refaire mon site »
  propose le résultat. La formule reprend mot pour mot le CTA de la première
  formule (`Offres.tsx:55`), ce qui fait de la pastille un raccourci vers une
  promesse déjà lue plutôt qu'une invitation neuve.
- **PREUVE.** Guide §7 ; `.agents/product-marketing.md` §5 (la formule d'entrée
  est bien la refonte d'un site).
- **NOTE.** La pastille est étroite : « Refaire mon site » fait 16 caractères
  contre 10 à « Parlons-en ». Si la nav serre, le repli est **« Mon site »**
  (8) — mais il perd le verbe, donc à n'utiliser qu'en dernier recours.
  L'ancre `/#contact` ne change pas.

## 2. Le libellé « Travaux », dans la nav et dans le menu

- **AVANT** (`components/Nav.tsx:59` et `components/MenuOverlay.tsx:13`) —
  **Travaux**
- **APRÈS** — **Démonstrations**
- **POURQUOI.** Glossaire, entrée 14. « Travaux » annonce des réalisations
  clientes ; le studio en compte zéro en refonte de site
  (`.agents/product-marketing.md` §9). C'est le mot le plus exposé du site : il
  figure dans la nav, dans le menu plein écran et en étiquette de section, donc
  il pose l'attente que le carrousel ne peut pas tenir. Le changement doit se
  faire **aux trois endroits en même temps**, sinon le site se contredit d'un
  écran à l'autre.
- **PREUVE.** §6, tableau des preuves (« client fictif inventé — à retirer ») ;
  §9 (« Références de site : 0 »).
- **CONTRAINTE.** **Les ancres `/#travaux` ne changent pas** — ce sont des URL,
  et le guide n'y touche jamais. Seuls les libellés visibles changent :
  `Nav.tsx:59`, `MenuOverlay.tsx:13`, `Travaux.tsx:18`.
- **NOTE.** « Démonstrations » fait 14 caractères contre 7. Si la nav ne le
  porte pas, le repli est **« Exemples »** (8), qui reste honnête ; jamais
  « Portfolio », « Réalisations » ni « Projets », qui rouvrent le même problème.

## 3. Le sous-titre de l'assistant

- **AVANT** (`components/ChatWidget.tsx:181`) — **Réponse d'Ayoub sous 24 h**
- **APRÈS** — **Ayoub lit tout, et répond lui-même**
- **POURQUOI.** « Sous 24 h » est un engagement de service qui n'existe ni dans
  le positionnement, ni dans la veille — retiré → `_sans-preuve.md`. Il est de
  surcroît affiché sur les trois pages en permanence, donc c'est la promesse la
  plus répétée du site après le délai de 72 heures, et elle n'est adossée à
  rien. Ce qui la remplace répond à la même inquiétude — *est-ce un robot qui me
  répond, et est-ce que quelqu'un lira ?* — avec un fait vrai par construction :
  le studio est une personne, et cette personne relit les conversations de
  l'assistant depuis `/admin`.
- **PREUVE.** `.agents/product-marketing.md` §9 (« Clients à ce jour : 1 »,
  structure d'une personne) ; §7 ; §5, encadré « Le palier 3 existe déjà »
  (`/admin`, tableau de bord des leads).
- **NOTE.** Si Boualem *veut* un délai affiché, il devient une décision
  d'exploitation, pas une formule : il faut qu'il puisse le tenir un dimanche de
  décembre. Voir `_sans-preuve.md`, entrée 3.

## 4. Le message d'accueil de l'assistant

- **AVANT** (`components/ChatWidget.tsx:35-36`) — Bonjour. Je prépare votre
  proposition avec Ayoub. Quel est votre métier, et avez-vous déjà un site en
  ligne ?
- **APRÈS** — *inchangé.*
- **POURQUOI.** Il est déjà juste, et il fait deux choses à la fois : il
  vouvoie, et il **qualifie sur le signal ICP exact** — « avez-vous déjà un
  site » est la question qui décide entre 72 heures et une semaine, donc entre
  deux promesses différentes. Le noter ici pour qu'aucun tour suivant ne le
  « rafraîchisse » sans raison.
- **PREUVE.** §2, « Le signal de qualification » ; §3, pilier 1.

---

## Conformes, laissés tels quels

| Texte | Fichier:ligne | Pourquoi il reste |
|---|---|---|
| Nawa Corps *(alt du wordmark)* | `Nav.tsx:52` | Le nom de marque, une seule fois dans la nav ; l'icône porte `alt=""` à dessein. |
| Genève — 00:00 | `Nav.tsx:57` | Concret, local, aucun adjectif. |
| Services · Offres · Méthode · Contact | `Nav.tsx:60-61`, `MenuOverlay.tsx:14-17` | Glossaire respecté, aucun terme saturé. |
| Studio digital — Genève | `Loader.tsx:39` | Catégorie + lieu, sans revendication. |
| Assistant Nawa Corps | `ChatWidget.tsx:177,180` | Glossaire, entrée 9 : « l'assistant », jamais « chatbot ». |
| Conversation enregistrée pour traiter votre demande — voir /confidentialite | `ChatWidget.tsx:194-195` | Obligation nLPD, formulée sans jargon. |
| Assistant indisponible — utilisez le formulaire juste en dessous ou WhatsApp. | `ChatWidget.tsx:216-218` | Dit la panne et donne deux issues. Modèle du genre. |
| WhatsApp · Genève, Suisse *(pied du menu)* | `MenuOverlay.tsx:20-23` | — |
