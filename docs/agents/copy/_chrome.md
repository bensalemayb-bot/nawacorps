# Réécriture — chrome partagé (nav, menu, chargement, assistant) — **tour 2**

> Mode `propose`. Ces textes sont rendus par `app/(site)/layout.tsx` et
> apparaissent donc sur les **trois pages** du site. Ils ont leur fichier propre
> pour cette raison : les corriger dans `accueil.md` laisserait croire qu'ils ne
> concernent qu'une page.
> Remplace la version du tour 1, archivée dans
> `docs/agents/_archive/2026-08-30-tour1/copy/_chrome.md`.
> Référence : `docs/agents/brand/voice-guide.md` (tour 2).

---

## 1. La pastille de la barre de navigation

- **AVANT** (`components/Nav.tsx:62`) — **Parlons-en**
- **APRÈS** — **Refaire mon site**
- **POURQUOI.** Guide §7 : un CTA est un verbe suivi d'un bénéfice, et la liste
  des formules bannies contient « Parlons-en » nommément. C'est le seul bouton
  visible en permanence sur les trois pages, donc celui qui est vu le plus
  souvent : « parlons-en » propose une conversation, « refaire mon site »
  propose le résultat. La formule reprend mot pour mot le CTA de la première
  formule (`Offres.tsx:55`), ce qui fait de la pastille un raccourci vers une
  promesse déjà lue plutôt qu'une invitation neuve.
- **PREUVE.** Guide §7 ; `.agents/product-marketing.md` §5.
- **NOTE.** La pastille est étroite : « Refaire mon site » fait 16 caractères
  contre 10 à « Parlons-en ». Si la nav serre, le repli est **« Mon site »**
  (8) — mais il perd le verbe, donc à n'utiliser qu'en dernier recours.
  L'ancre `/#contact` ne change pas.
- *(Inchangé depuis le tour 1 ; la revue ne le conteste pas.)*

## 2. Le libellé « Travaux », dans la nav et dans le menu

- **AVANT** (`components/Nav.tsx:59` et `components/MenuOverlay.tsx:13`) —
  **Travaux**
- **APRÈS** — **Démonstrations**
- **POURQUOI.** Glossaire, entrée 14. « Travaux » annonce des réalisations
  clientes ; l'agence en compte zéro en refonte de site
  (`.agents/product-marketing.md` §9). C'est le mot le plus exposé du site : il
  figure dans la nav, dans le menu plein écran et en étiquette de section, donc
  il pose l'attente que le carrousel ne peut pas tenir. Le changement doit se
  faire **aux trois endroits en même temps**, sinon le site se contredit d'un
  écran à l'autre.
- **PREUVE.** §6, tableau des preuves ; §9 (« Références de site : 0 »).
- **CONTRAINTE.** **Les ancres `/#travaux` ne changent pas** — ce sont des URL.
  Seuls les libellés visibles changent : `Nav.tsx:59`, `MenuOverlay.tsx:13`,
  `Travaux.tsx:18`.
- **NOTE.** « Démonstrations » fait 14 caractères contre 7. Si la nav ne le
  porte pas, le repli est **« Exemples »** (8), qui reste honnête ; jamais
  « Portfolio », « Réalisations » ni « Projets », qui rouvrent le même problème.

## 3. Le sous-titre de l'assistant — **BLOQUANT BL-5**, et la preuve la plus forte du site

- **AVANT** (`components/ChatWidget.tsx:181`) — **Réponse d'Ayoub sous 24 h**
- **TOUR 1** *(rejeté)* — **Ayoub lit tout, et répond lui-même**
- **APRÈS** — **Vous utilisez L'Assistant, la troisième formule. Ayoub voit la
  conversation.**
- **REPLI court**, si le bandeau du widget ne porte pas deux phrases —
  **« Vous utilisez L'Assistant, la troisième formule. »**
- **POURQUOI.** Deux choses en même temps, et c'est le texte le plus vu du site.
  **(a) La correction du tour 1.** « Sous 24 h » avait été retiré parce que
  l'engagement n'existe ni dans le positionnement ni dans la veille — décision
  juste. Mais ce qui l'a remplacé est **le même engagement, sans horloge** :
  « lit tout » et « répond lui-même » sont des affirmations sur un comportement
  futur, invérifiables et absentes des deux référentiels. Plus difficiles à
  démentir, pas mieux fondées, et à la position la plus exposée du site
  (permanente, trois pages). Le guide §8 ne prévoit pas de degré : fait
  vérifiable, ou rien. « Ayoub voit la conversation » est un **fait
  d'architecture**, documenté : les conversations arrivent dans le tableau de
  bord `/admin`.
  **(b) La preuve remonte.** Le palier 3 tourne sur ce site — c'est la **seule
  preuve que le visiteur peut vérifier lui-même, en un clic, sans croire
  personne**, et le tour 1 la laissait enterrée dans une puce de la troisième
  carte. Elle doit être dite **là où le visiteur est en train de s'en servir**.
  Un lecteur qui écrit à l'assistant et découvre dans le même bandeau qu'il
  essaie le produit vendu 2'499.– vient de faire l'essai gratuit le plus court
  du marché. Aucune référence client ne ferait mieux qu'une preuve qu'il
  manipule.
- **PREUVE.** `.agents/product-marketing.md` §5, encadré « Le palier 3 existe
  déjà » : « Assistant conversationnel, notification Telegram, tableau de bord
  des leads : tout tourne sur le site de Nawa Corps (`ChatWidget`,
  `lib/chat-prompt.ts`, `lib/llm.ts`, `lib/telegram.ts`, `/admin`). Le site de
  l'agence est la démonstration du produit. » ; §7 (structure d'une personne).
- **NOTE.** Le délai de réponse ne disparaît pas du site : il est réintroduit
  **une seule fois**, à l'accusé de réception du formulaire, sous la forme
  tenable « réponse le jour ouvrable suivant » (`accueil.md` §F.1). Une seule
  occurrence, pas trois sur trois pages.

## 4. Le message d'accueil de l'assistant

- **AVANT** (`components/ChatWidget.tsx:35-36`) — Bonjour. Je prépare votre
  proposition avec Ayoub. Quel est votre métier, et avez-vous déjà un site en
  ligne ?
- **APRÈS** — *inchangé.*
- **POURQUOI — et le motif change au tour 2.** Le tour 1 le gardait parce que la
  question « avez-vous déjà un site » décidait entre deux délais (72 heures ou
  une semaine). **Ce motif est mort : le délai est le même dans les deux cas.**
  Le message reste malgré tout, pour une raison plus solide : il **qualifie sur
  le signal ICP exact** (`§2, Le signal de qualification` : « un site en ligne,
  visiblement antérieur à 2020 »), et il vouvoie. Le noter ici pour qu'aucun
  tour suivant ne le « rafraîchisse » sans raison — mais aussi pour qu'aucun ne
  le justifie plus par le délai.
- **PREUVE.** §2, « Le signal de qualification » ; §3, pilier 1.

## 5. L'écran de chargement — **l'identité**

- **AVANT** (`components/Loader.tsx:39`) — **Studio digital — Genève**
- **APRÈS** — **Agence digitale — Genève**
- **POURQUOI.** `.agents/product-marketing.md` §1 : « Agence digitale
  indépendante à Genève ». C'est le premier texte affiché du site, avant même le
  hero : il ne peut pas annoncer une catégorie que le positionnement a
  abandonnée. Voir le tableau de renommage complet dans `accueil.md` §I — les
  dix textes concernés changent **ensemble**.
- **PREUVE.** §1 du positionnement.

---

## Conformes, laissés tels quels

| Texte | Fichier:ligne | Pourquoi il reste |
|---|---|---|
| Nawa Corps *(alt du wordmark)* | `Nav.tsx:52` | Le nom de marque, une seule fois dans la nav ; l'icône porte `alt=""` à dessein. |
| Genève — 00:00 | `Nav.tsx:57` | Concret, local, aucun adjectif. |
| Services · Offres · Méthode · Contact | `Nav.tsx:60-61`, `MenuOverlay.tsx:14-17` | Glossaire respecté, aucun terme saturé. |
| Assistant Nawa Corps | `ChatWidget.tsx:177,180` | Glossaire, entrée 9 : « l'assistant », jamais « chatbot ». |
| Conversation enregistrée pour traiter votre demande — voir /confidentialite | `ChatWidget.tsx:194-195` | Obligation nLPD, formulée sans jargon. |
| Assistant indisponible — utilisez le formulaire juste en dessous ou WhatsApp. | `ChatWidget.tsx:216-218` | Dit la panne et donne deux issues. Modèle du genre. |
| WhatsApp · Genève, Suisse *(pied du menu)* | `MenuOverlay.tsx:20-23` | — |

## Point ouvert

**Le prompt de l'assistant (`lib/chat-prompt.ts`) n'a pas été rouvert au
tour 2** — un correctif de code y travaille. Il lit les prix en base, mais s'il
contient une chaîne de délai (« 72 heures ») ou la catégorie (« studio
digital »), elle est fausse depuis la révision du positionnement, et
**l'assistant est le seul texte du site qui parle sans être relu**. À vérifier
avant l'apply.
