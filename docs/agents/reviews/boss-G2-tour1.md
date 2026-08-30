# Porte G2 — tour 1 — copy et pages de vente

**Objet :** `docs/agents/brand/voice-guide.md`, `docs/agents/copy/*` (accueil,
`_chrome`, `_inventaire`, `_sans-preuve`, mentions-légales, confidentialité),
`docs/agents/reviews/psy-A-copy-tour1.md` et `psy-A-copy-tour2.md`.
**Périmètre ajouté par la délégation :** `app/(site)/prestations/page.tsx`,
`app/(site)/prestations/[slug]/page.tsx`, `lib/formules.ts`.
**Référentiels relus sur disque :** `.agents/product-marketing.md`, `CLAUDE.md`,
`docs/agents/reviews/boss-G1-tour1.md`.
**Question de la porte :** le copy est-il prêt à être appliqué sur le site ?
**Date :** 2026-08-30 · **Verdict : NO-GO**
**5 bloquants · moyenne 22 / 35 · tests adverses 3 PASS / 4 FAIL**

> **Périmètre de lecture.** Un agent travaille sur le CSS et les composants.
> Je n'ai ouvert `app/`, `components/` et `lib/` **qu'en lecture**, et
> uniquement là où un test adverse l'exigeait : T1 et T4 exigent de vérifier
> qu'une promesse a une source et un moyen, or la délégation me demande
> nommément de contrôler deux corrections déjà posées et de statuer sur trois
> fichiers de vente que personne n'a relus. Aucune écriture hors de ce mémo.

---

## 1. Ce que j'ai vérifié moi-même

**Les corrections que la délégation dit posées.** Une tient, l'autre n'existe
pas sur disque.

| Correction annoncée | État réel | Preuve |
|---|---|---|
| `lib/chat-prompt.ts` : « studio digital » → « agence digitale » | **TIENT** | `lib/chat-prompt.ts:43` : « Tu es l'assistant de Nawa Corps, agence digitale à Genève tenue par Ayoub Bensalem. » Conforme au §1 du positionnement. Non redemandée. |
| « pas de sous-traitance » dans la section L'agence | **ABSENTE** | `docs/agents/copy/accueil.md:653` porte toujours « Pas de bureau, pas d'équipe commerciale, **pas de sous-traitance**. » ; idem `_sans-preuve.md:375` ; `components/Faq.tsx:35` porte encore l'ancienne Q5 entière. Balayage `grep -rn "sous-trait"` hors `node_modules` et `_archive` : quatre fichiers, aucun ne porte la forme corrigée. |

Je ne rouvre pas MA-D comme un constat neuf de la revue A. Je constate qu'il
n'est pas posé, et je le porte à l'apply avec la forme que la revue a écrite.

**Les décomptes et les décisions fermées.** La revue A a recompté sept sur sept
et balayé six décisions fermées ; je ne refais pas ce travail, il est propre et
il est vérifiable. J'ai en revanche balayé ce qu'elle ne pouvait pas balayer,
parce que son périmètre déclaré est de trois pages et que le site en compte
sept au plan (`app/sitemap.ts`).

**Ce que ce balayage a rendu — cinq faits, tous vérifiés en ligne de commande :**

| # | Fait | Localisation |
|---|---|---|
| 1 | **Six « sous 24 h » vivants dans le chrome**, dont trois dans le seul texte du site qui parle sans être relu | `lib/chat-prompt.ts:55,56,61` · `components/ChatWidget.tsx:171,181,224` |
| 2 | Le même fichier **interdit les comptes d'heures six lignes plus bas** | `lib/chat-prompt.ts:64-65` |
| 3 | **« sans frais cachés » sur les pages de vente** — deux chaînes, sept rendus | `app/(site)/prestations/page.tsx:85` (rendu 4 fois) · `[slug]/page.tsx:224` (rendu 3 fois) |
| 4 | **Une comparaison publiée** avec « les autres » | `app/(site)/prestations/page.tsx:218` · `lib/formules.ts:117` |
| 5 | **Le renommage compte au moins dix-sept textes, pas dix** | §I en liste 10 ; + `lib/chat-prompt.ts:43` (corrigé) ; + `app/(site)/prestations/page.tsx:51,146,206,213` ; + `app/(site)/mentions-legales/page.tsx:37,42` |

Sur le point 5 : `docs/agents/copy/mentions-legales.md:8` déclare la
`meta description` de la page **inchangée**. Or cette description dit « Nawa
Corps, **studio digital indépendant** à Genève », deux fois (`:37` et `:42`).
Le dossier de copy déclare donc conforme une chaîne qui porte la catégorie
abandonnée.

---

## 2. Les cinq décisions que la délégation me demande

### Décision 1 — Le bloquant BL-A : nouveau tour, ou correction portée à l'apply ?

**Pas de nouveau tour de `copy-positionnement` comme porte. La correction est
portée à l'apply, et inscrite en place dans `accueil.md` §E.2.**

Motif, en trois points. **(a)** La règle juste est **déjà écrite dans le même
livrable** — §E.4, Q4 : « Les modifications de contenu sont comprises dans le
suivi de L'Assistant ; sur les deux autres formules, elles sont facturées à la
demande. » Rien n'est à arbitrer : il y a une bonne version et une mauvaise
dans le même fichier. **(b)** J'ai vérifié la correction contre le référentiel :
`.agents/product-marketing.md` §5, « Le récurrent », donne 49.–/mois =
hébergement, domaine, mises à jour, sauvegardes, sécurité ; 129.–/mois = « idem
+ assistant IA + **modifications de contenu incluses** ». La réécriture de la
revue est factuellement exacte, mot pour mot. **(c)** Un tour complet pour vingt
mots coûte plus qu'il ne protège, et il n'en est pas prévu.

**Ce que « porté à l'apply » veut dire précisément, parce que la nuance décide
du résultat :** `copy-positionnement` **amende `accueil.md` §E.2 en place**
— geste documentaire, pas un tour, pas de re-revue. L'implémenteur ne doit pas
avoir à ouvrir un rapport de revue pour trouver le texte à poser ; `accueil.md`
reste la source unique de l'apply. Texte à poser, tel que la revue l'a écrit :

> Ensuite · Le suivi · **Un tarif change, une prestation s'ajoute, un horaire
> bouge ? Un message, et je corrige — compris dans le suivi de L'Assistant,
> facturé à la demande sur les deux autres formules.**

*Critère de validation :* §E.2 étape 04 nomme la formule ; zéro occurrence de
« c'est ce que couvre le suivi » sans qualification de palier dans `docs/agents/copy/`.

### Décision 2 — Les quatre majeurs

| Majeur | Décision |
|---|---|
| **MA-A** — le onzième texte du renommage | La correction de catégorie **tient**, vérifiée, non redemandée. **Mais la fermeture de l'autre moitié du point ouvert est fausse.** La revue a lu la règle « Délais » (`:63-64`) et conclu « le délai y est déjà correct » ; elle n'a pas lu le déroulé, qui promet « sous 24 h » aux étapes 4 et 5 et dans la règle de prix. → **BLOQUANT 1**. |
| **MA-B** — « TVA comprise » au 129.– de la Q3 | Portée à l'apply, sans tour. Deux mots. Et **étendue** : le montant obligatoire est absent de la page qui vend L'Assistant → **BLOQUANT 4**. |
| **MA-C** — le chapô des Démonstrations sous la branche « client réel » | **Gelé** jusqu'à la réponse de Boualem sur « La carte ». Les deux textes sont prêts ; poser l'un ou l'autre avant la réponse est le seul geste interdit. |
| **MA-D** — « pas de sous-traitance » non qualifié | **La correction n'existe pas sur disque** (§1). Portée à l'apply dans la forme de la revue : « **Pas de bureau, pas d'équipe commerciale. Votre site est dessiné et construit par la même personne — la même le lendemain de la mise en ligne et le mois suivant.** » La forme portée « votre site n'est pas sous-traité » est admise si Boualem tient au terme : elle est vraie sans exception. |

### Décision 3 — La réserve B6 contre le §1 du positionnement

**La réserve B6 tombe. Le positionnement ne recule pas.**

**Pourquoi elle tombe, et par son propre texte.** B6 n'a jamais interdit un
fait : elle a gelé une écriture **le temps d'une décision**. Son critère de
validation, tel que je l'ai écrit à G1, est « **décision consignée avant
l'ouverture de G2** ». Ce critère est rempli : la grille 699 / 1'499 / 2'499
TVA comprise est arrêtée par le propriétaire, deux fois, sans tarif de
lancement, et le §5 du positionnement enregistre la disparition des prix barrés
et du « tarif de lancement ». Une réserve dont la condition est remplie ne se
discute pas : elle expire.

**Pourquoi le positionnement n'a pas à reculer.** Le §1 (« pas de bureau : c'est
ce qui explique les prix ») est un **raisonnement adressé aux agents**, dans le
document que le harnais leur charge pour qu'ils comprennent l'offre. Ce n'est
pas une phrase de site. Croire que le §1 commande une ligne de copy est une
erreur de catégorie, et c'est elle qui a produit la contradiction apparente :
il n'y en a pas entre un rationnel interne et une règle d'écriture publique.

**Ce qui survit à B6, et qui n'est plus une réserve mais une règle permanente**,
déjà écrite au guide §4 (« On ne plaide pas le prix ») : les faits de structure
— pas de bureau, pas d'équipe commerciale — **s'écrivent**, ils servent le
pilier 3 (quelqu'un reste), et ils **ne portent jamais de charnière causale vers
le tarif** (« et c'est ce qui permet… »). Une justification attire l'attention
sur le doute qu'elle veut dissiper : c'est un fait de persuasion, pas une
conséquence de la décision de prix, et il ne dépendait pas d'elle.

**Trois conséquences exécutoires, pour qu'aucun agent ne lise mal cette levée :**

1. **§E.3 et Q5, tels qu'écrits, sont conformes et ne sont pas rouverts.**
2. **La levée de B6 ne commande aucune défense de prix.** Personne n'est chargé
   d'en écrire une. « Pourquoi moins cher qu'une agence ? » **reste supprimée** —
   non pas au titre de B6, mais parce que sa réponse reposait sur « trois jours
   au lieu de trois mois », que la veille ne porte pas (réserve **B1**, qui,
   elle, tient).
3. **Le §1 du positionnement garde sa phrase.** Aucune correction demandée à
   `.agents/product-marketing.md` sur ce point.

**Et il faut dire ce qui a réellement réparé T7**, parce que ce n'est pas une
justification. C'est la bascule du délai. « 72 h » posait la grille dans le
voisinage sémantique du bas de marché relevé par la veille (48-72 h + 199 €) ;
« une semaine » l'en sort, et déplace la promesse de la vitesse vers « vous
n'avez rien à préparer », que le panel ne traite pas. La parité tarifaire aux
paliers 2 et 3, avec devis chiffré, rendez-vous et assistant dedans, se défend
désormais **sans une ligne de plaidoirie**. C'est le meilleur argument pour
lever B6 : ce qu'elle protégeait n'est plus exposé.

**Recommandation G1 « inscrire la grille comme prix d'amorçage » : CADUQUE.**
Marquée comme telle, sur instruction du propriétaire et parce que son motif —
T7 non tranché — a disparu. Elle ne doit reparaître dans aucun artefact.

### Décision 4 — Le périmètre `/prestations`, que personne n'a relu

**Non. Ces pages ne peuvent pas être mises en ligne sans passage par la voix.**
Ce n'est pas une précaution de procédure : j'ai ouvert les trois fichiers et
relevé **cinq violations de règles fermées**, dont deux qui font échouer un test
adverse. Le détail est au BLOQUANT 5.

**Ce que je prescris, et ce que je ne prescris pas.** Pas un tour de G2 complet :
les artefacts existent, le guide de voix est juste et je ne le rouvre pas. **Un
tour dédié et borné** : `copy-positionnement` produit
`docs/agents/copy/prestations.md` en mode `propose`, couvrant `lib/formules.ts`,
les deux pages `/prestations` et les deux `meta description` légales ; puis une
passe `psy-persuasion` **limitée à ce fichier**. C'est une semaine d'agents, pas
un cycle.

**Il y a une branche moins chère, et elle appartient à Boualem :** retirer les
trois pages de vente du lancement — du plan de site, de la nav et du rendu (404
ou `noindex`, pas seulement du `sitemap.ts` : une page retirée du plan reste
atteignable) — et mettre en ligne l'accueil seul. Ce que ça coûte : les trois
pages qui portent le mot-clé « refonte de site Genève » en profondeur, et
l'échelle cumulative `inclus()` / `manque()`, qui est le meilleur travail de
vente du dépôt et qui est correct dans sa mécanique. Ce que ça épargne : une
semaine, et le risque de publier une comparaison de marché non portée.

### Décision 5 — « La carte » : la question pour Boualem, en une ligne

> **L'accord écrit du client pour publier sa carte de restaurant existe-t-il, ou
> peut-il être obtenu cette semaine — oui ou non ?**

| Branche | Ce qu'elle apporte | Ce qu'elle coûte |
|---|---|---|
| **Oui — travail d'un vrai client** | La **seule preuve du site qu'un lecteur n'a pas à croire sur parole**. L'agence a 1 client et 0 référence de site : cette ligne déplace la charge de la preuve hors de la page, et elle rend les quatre autres pièces plus crédibles, pas moins, parce qu'elle montre que l'agence sépare ce qu'elle a fait de ce qu'elle a simulé. | Le délai d'obtention de l'accord. Deux cascades à poser en même temps : le chapô de la section passe à « quatre pièces … la cinquième … publiée avec son accord » (MA-C), et `mentions-legales.md` §3 perd « les établissements qui y figurent sont fictifs ». Et elle prouve une compétence de la **ligne secondaire** : un restaurant l'a payé pour une carte, pas une PME pour un site. |
| **Non — reconstitution fictive assumée** | Gratuite, immédiate, zéro risque juridique, zéro cascade. Réelle si l'apply est proche. | Le site part avec **zéro preuve vérifiable par un tiers** : cinq pièces sur cinq sont escomptées par un lecteur méfiant. Et l'agence dépense sa seule preuve authentique en la déguisant en fiction, ce que le §6 du positionnement appelle « le risque numéro un du plan ». |

**Ce qui est interdit dans les deux cas : le milieu.** Une pièce présentée comme
réelle sans accord écrit est exactement l'indication trompeuse que vise la
LCD art. 3, et aucun gain de conversion ne paie ce risque. Tant que la réponse
n'est pas donnée, le §B de `accueil.md` ne s'applique pas.

---

## 3. Grille — 7 critères

Notée sur le périmètre réel de la porte : le copy **et** les pages de vente,
puisque la porte G2 est définie comme « copy et page produit ».

| # | Critère | Note | Justification |
|---|---|---|---|
| 1 | **Clarté** | **4** / 5 | Le `h1` dit l'objet, la fonction et le délai en cinq secondes ; le sous-titre porte le bénéfice n°1 en énoncé principal, le point de départ, le prix et la TVA en 30 mots. Métadonnées alignées sur le hero. Contre : le site annonce **deux catégories** d'une page à l'autre — « agence » sur l'accueil après apply, « studio » sur `/prestations` et dans la description des mentions légales. |
| 2 | **Preuve** | **3** / 5 | Chaque affirmation d'`accueil.md` porte sa source au §, `_sans-preuve.md` tient le registre des 28 + 6 retraits avec la condition de réintroduction, et l'engagement de réactivité conservé est désormais **inscrit au §5** du positionnement. Contre : trois affirmations vivantes hors de ce périmètre n'ont aucune source — « synchronisée avec votre agenda », les six « sous 24 h », et la comparaison avec « les autres ». |
| 3 | **Cohérence** positionnement ↔ copy ↔ page ↔ prix ↔ délais | **2** / 5 | Prix conformes et stables (zéro « lancement », zéro prix barré, TVA comprise par unité de lecture) ; délai unifié à « une semaine » dans **tous** les artefacts. Contre, et c'est ce qui fait tomber la porte : six chaînes publiques promettent encore un délai en heures, dont trois dans le fichier qui interdit les comptes d'heures ; et le 129.–/mois obligatoire est annoncé sur la grille d'accueil et **absent de la page qui vend ce palier**. |
| 4 | **Risque juridique** | **2** / 5 | La fiction du carrousel est neutralisée jusqu'au numéro de fax, la moquerie est retirée à la source, la mention nLPD est présente et sans jargon, la règle TVA est appliquée par unité de lecture dans `accueil.md`. Contre : un prix mensuel **obligatoire non chiffré** sur la page de vente du palier 3 est le cas d'école du prix caché ; une promesse de délai à valeur d'engagement est portée par un texte génératif que personne ne relit ; `NAP_CONFIRME` vaut `false` et un téléphone fictif est rendu à l'écran ; les mentions légales attendent trois valeurs. |
| 5 | **Conversion** | **4** / 5 | Le bénéfice n°1 passe en énoncé principal à quatre endroits, l'inversion du risque (« vous voyez le site fini, vous validez, vous payez ») remonte au-dessus du prix, la seule preuve manipulable est dite là où le visiteur s'en sert et là où il lit le prix, les CTA sont verbe + bénéfice, et la condition la plus coûteuse de la grille est **vendue** au lieu d'être subie. L'échelle cumulative de `lib/formules.ts` répond en outre à « vers quoi monter » sans qu'aucune page ne puisse contredire l'autre. Contre : l'ordre des sections est inchangé, et il n'y a aucune preuve sociale. |
| 6 | **Faisabilité** | **3** / 5 | **La réserve B5 est levée** : la règle opérationnelle qui rend le délai tenable — textes repris ou maquette proposée, compris dans le prix — est écrite au §5 et marquée tranchée au §10, n°2. « Le jour ouvrable suivant » est tenable un dimanche de décembre. Deux allers-retours sont bornés par écrit. Contre : « sous 24 h » est un engagement que personne n'a pris et que le positionnement a retiré nommément, et « synchronisée avec votre agenda » est une fonction qu'aucune source ne décrit, sur une structure d'une personne. |
| 7 | **Différenciation** | **4** / 5 | Promesse distincte du panel (l'absence de travail à fournir, pas la vitesse), argument distinct (l'après-livraison, que personne ne revendique), preuve distincte (le palier 3 tourne sur ce site), zéro concurrent nommé, zéro superlatif, « interlocuteur unique » retiré. Contre : les deux pages les plus récentes portent sept fois « sans frais cachés » — le couple relevé chez 3 acteurs sur 6, dont un en fait sa promesse d'accueil entière — et « sur-mesure », relevé chez 4 sur 6. |

**Moyenne : 22 / 35 = 3,14.**

**La note du seul périmètre relu par la revue A** — `accueil.md`, `_chrome.md`,
les deux pages légales — **serait 31 / 35 = 4,43** (5 · 5 · 4 · 4 · 4 · 4 · 5).
Il faut le dire, parce que c'est la mesure honnête du travail des agents de
copy : **les quatre FAIL de la porte sont tous hors de leur périmètre**, trois
dans des fichiers qu'on ne leur a jamais donnés, un dans un fichier auquel ils
n'avaient pas accès. Ce mémo ne sanctionne pas leur travail. Il sanctionne un
site dont un tiers des pages n'a jamais rencontré son guide de voix.

---

## 4. Tests adverses

**T1 « Prouve-le »** — les cinq affirmations les plus fortes.
(a) « refait en une semaine » → §3, §9 et §5 « Les conditions ». Sourcé.
(b) « vous n'avez rien à préparer, je reprends les textes » → §5, ligne *Textes*,
décision marquée tranchée au §10, n°2. Sourcé.
(c) « l'assistant en bas à droite de cette page » → vérifiable dans le dépôt :
`ChatWidget`, `lib/llm.ts`, `lib/telegram.ts`, `/admin`. Sourcé **et testable
par le lecteur**, ce qui est mieux.
(d) « suivi obligatoire à 129.–/mois TVA comprise » → §5, « Le récurrent » et
« Contrainte à ne pas oublier ». Sourcé.
(e) « **Prise de rendez-vous en ligne, synchronisée avec votre agenda** »
(`lib/formules.ts:138`, rendue sur deux pages de vente) → **absente des deux
référentiels**. Le §5 ne dit que « Prise de rendez-vous en ligne », et la même
mention vient d'être **retirée** de `ServicesRows` geste 03 pour ce motif exact.
Le site supprimerait la phrase sur une page pendant qu'il l'affirme sur deux
autres. **FAIL** — et ma règle est explicite : un seul FAIL est bloquant.

**T2 « Le concurrent lit la page »** — une phrase attaquable, publiée :
> « Le délai est d'une semaine, et il court dès votre feu vert. **Chez les
> autres, le compteur part quand vous avez fourni vos textes** ; ici, quand vous
> dites oui. » (`app/(site)/prestations/page.tsx:218`, repris en
> `lib/formules.ts:117`.)

Le fait est vrai de **deux acteurs du panel sur six** ; « les autres » le
généralise au marché. Le guide §3 écrit noir sur blanc que cet argument est
« sourcé aussi, **mais jamais publié** … il se traduit par une affirmation
positive sur nous, **jamais par une comparaison** » (réserve B2). Un concurrent
dont le contrat ne conditionne pas le délai est décrit faussement par cette
phrase. **FAIL.**

**T3 « Le client pressé »** — sur mobile, le hero donne l'objet, le délai, le
bénéfice n°1, « dès 699.–, TVA comprise » et « Faire refaire mon site » dans le
premier écran. Sur une page de formule, le bandeau `.facts` donne prix, TVA,
délai et point de départ au-dessus de la ligne de flottaison, avec le CTA de
devis en bas. Compris en dix secondes. **PASS.**

**T4 « L'opérationnel »** — qui tient quoi, avec quoi. Le délai : tenu par une
règle écrite (textes repris, maquette rédigée par l'agence), sur une page
unique, par une personne — B5 est levée, et c'est le gain de fond depuis G1. La
réactivité : « le jour ouvrable suivant », tenable, inscrite au §5, une seule
occurrence. Mais **l'assistant promet « sous 24 h » six fois**, dont trois dans
un prompt qui interdit les comptes d'heures six lignes plus bas, et qui
**reformule la promesse à chaque conversation**. Personne n'a pris cet
engagement ; le positionnement l'a retiré nommément. **FAIL.**

**T5 « Le sceptique »** — le point le plus faible de l'offre est l'absence
totale de preuve : 1 client, 0 référence de site, 0 abonné. Traité
honnêtement, et sans détour : la section s'appelle « Démonstrations », le chapô
écrit « aucune n'est un client », « Travaux » sort de la nav, du menu et de la
section en même temps, le glossaire interdit « réalisation », « cas client » et
« portfolio », et `_sans-preuve.md` tient le registre des retraits **y compris
de ses propres phrases**. Rien n'est caché, et rien n'est non plus étalé — la
ligne « sa première refonte reste à faire » a été retirée à raison : l'honnêteté
est obligatoire, l'auto-dénigrement est un choix. **PASS**, et c'est le meilleur
critère du dossier.

**T6 « Le copier-coller »** — face à l'acteur structurellement le plus proche :
promesse distincte, argument distinct (la 2ᵉ année), registre distinct, aucun
concurrent nommé, « interlocuteur unique » retiré à `ServicesRows.tsx:22`. Sur
le périmètre relu, c'est un PASS net. Sur le périmètre **mis en ligne**, les
deux pages de vente portent sept fois « sans frais cachés » et une fois
« sur-mesure » — soit les deux termes que la veille relève comme les plus
saturés du panel, dont l'un est la promesse d'accueil entière d'un acteur.
**FAIL**, et il est d'autant plus coûteux que ces pages sont celles qui visent
le mot-clé.

**T7 « Le mismatch »** — prix et délais cohérents avec le positionnement ? Oui,
et c'est le FAIL de G1 qui tombe. La grille est arrêtée et consignée, sans tarif
de lancement, TVA comprise partout dans le copy relu. Le passage de « 72 h » à
« une semaine » retire la signature de bas de marché que la veille documentait
(48-72 h + 199 €) et déplace la promesse sur un axe que le panel ne traite pas.
La parité tarifaire aux paliers 2 et 3, avec davantage dedans, tient sans
plaidoirie. **PASS.**

**Bilan : 3 PASS, 4 FAIL.** Les quatre FAIL portent sur quatre fichiers, et
aucun n'est `docs/agents/copy/accueil.md`.

---

## 5. VERDICT : NO-GO

Un seul FAIL en T1 est bloquant par ma propre règle ; il y en a quatre. Mais un
NO-GO qui gèle tout serait faux, parce que l'essentiel du dossier est prêt.
La porte est donc refusée **et** partiellement ouverte, ci-dessous.

### Les cinq bloquants

#### BLOQUANT 1 — Le prompt de l'assistant promet « sous 24 h » trois fois, et se contredit six lignes plus bas

- **Où** : `lib/chat-prompt.ts:55` (« proposition précise sous 24 h »), `:56`
  (« confirme le délai de 24 h »), `:61` (« proposition chiffrée sous 24 h »).
  Le même prompt écrit en `:64-65` : « surtout aucun délai en heures : “72 h” et
  “48 h” ont circulé, aucun n'est tenu. »
- **Pourquoi c'est bloquant et pas majeur.** Trois raisons cumulées.
  `CLAUDE.md` proscrit les comptes d'heures « partout » ; le guide §8 nomme
  « sous 24 h » dans ses interdits ; et le §5 du positionnement écrit que
  l'engagement « figurait sur trois pages **sans avoir jamais été décidé** ». À
  cela s'ajoute ce qui distingue ce texte de tous les autres : il est
  **génératif** (il reformule la promesse à chaque conversation, donc on ne peut
  pas la corriger à l'écran), **conversationnel** (le prospect la reçoit en
  réponse à sa propre question, ce qui lui donne valeur d'engagement pris), et
  **non relu**. La revue A a déclaré cette moitié du point ouvert close après
  avoir lu la seule ligne « Délais ». Elle ne l'est pas.
- **Ajouter au même geste** : `:60` fait dire à l'assistant « c'est du
  **sur-mesure** », terme interdit par la définition de rôle et relevé chez 4
  acteurs sur 6 — et que `accueil.md` §D.6 corrige justement en base.
- **Action corrective** : remplacer les trois occurrences par le seul engagement
  admis, « **le jour ouvrable suivant** » (§5, « Les conditions ») ; remplacer
  « c'est du sur-mesure » par « c'est un périmètre à définir » ; ajouter la ligne
  au tableau §I de `accueil.md`.
- **Agent responsable** : `copy-positionnement` écrit la substitution dans
  `_chrome.md` (il porte déjà le chrome de l'assistant) ; `revue-code` applique.
- **Critère de validation** : `grep -n "24 h\|sur-mesure" lib/chat-prompt.ts` ne
  rend plus que la ligne d'interdiction.

#### BLOQUANT 2 — Deux « sous 24 h » du widget sont hors du périmètre de `_chrome.md`

- **Où** : `components/ChatWidget.tsx:171` — le libellé de la pastille flottante,
  donc **le texte le plus vu du site**, présent sur toutes les pages ; `:224` —
  le message de clôture (« Ayoub revient vers vous sous 24 h »). Seul `:181` est
  traité, par `_chrome.md` §3.
- **Pourquoi.** La table « Conformes, laissés tels quels » de `_chrome.md` liste
  `ChatWidget.tsx:177,180,194-195,216-218` et **ne mentionne ni `:171` ni
  `:224`**. L'apply, exécuté tel quel, corrigerait un tiers du problème et
  laisserait deux promesses de délai en heures sur toutes les pages — dont celle
  que le visiteur voit avant même d'ouvrir l'assistant.
- **Action corrective** : `_chrome.md` §3 est étendu aux deux chaînes.
  Proposition de forme, à valider par l'agent : pastille — « **Décrivez votre
  besoin — réponse le jour ouvrable suivant** » ; clôture — « **C'est noté.
  Ayoub revient vers vous le jour ouvrable suivant.** » *(Note : le guide §8
  plafonne cet engagement à « une seule occurrence, au formulaire ». Trois
  occurrences le rouvrent. Si l'agent préfère tenir le plafond, la pastille et
  la clôture disent le fait d'architecture — « Ayoub voit la conversation » —
  sans horloge. Je ne tranche pas la forme, je bloque le compte d'heures.)*
- **Agent responsable** : `copy-positionnement`, puis `revue-code`.
- **Critère de validation** : `grep -n "24 h" components/ChatWidget.tsx` ne rend
  rien.

#### BLOQUANT 3 — La Méthode annonce comme compris ce qui sera facturé aux deux tiers de la grille

- **Où** : `docs/agents/copy/accueil.md` §E.2, étape 04 (`Methode.tsx:18`),
  contre §E.4, Q4 (`Faq.tsx:31`), sur la même page.
- **Pourquoi.** Vérifié contre `.agents/product-marketing.md` §5, « Le
  récurrent » : les modifications de contenu ne figurent que dans la ligne
  129.–/mois. « Un tarif change, une prestation s'ajoute, un horaire bouge » est
  une modification de contenu ; la phrase la déclare couverte sans qualifier la
  formule. Deux versions contradictoires sur une même page : aucune ne fait foi,
  et celle qui est fausse porte sur une facture.
- **Action corrective** : voir **Décision 1**. Correction portée telle quelle,
  inscrite en place dans `accueil.md` §E.2, sans nouveau tour.
- **Agent responsable** : `copy-positionnement` (geste documentaire).
- **Critère de validation** : §E.2 étape 04 nomme L'Assistant et dit « facturé à
  la demande » pour les deux autres formules.

#### BLOQUANT 4 — Le prix mensuel obligatoire n'existe pas sur la page qui vend L'Assistant

- **Où** : `app/(site)/prestations/[slug]/page.tsx` — le bandeau `.facts` affiche
  « 2'499.– » et « TVA comprise », puis la page descend vers « Demander un
  devis ». L'obligation n'apparaît que dans `lib/formules.ts`, question 2 de
  `l-assistant`, **à l'intérieur d'un `<details>` replié par défaut**, et
  **sans le montant** : la réponse explique pourquoi le suivi est obligatoire
  sans jamais écrire 129.–/mois.
- **Pourquoi.** Le guide §8, règle 4 : « Aucun prix mensuel obligatoire passé
  sous silence. » Le pilier 3 : « il s'écrit à deux endroits au moins : sur la
  carte de la formule, et sous la grille. » Et le critère que la revue A a
  elle-même employé pour déclarer BL-1 mort — « apparaît-il là où la décision
  d'achat se prend, **avant le geste d'achat** » — n'est pas tenu ici. BL-1 est
  mort sur l'accueil et vivant sur la page dédiée. Une obligation annoncée sans
  son montant est pire qu'un montant sans son obligation.
- **Action corrective** : porter le montant, le caractère obligatoire, la date de
  départ et « TVA comprise » dans le bandeau `.facts` ou immédiatement dessous,
  **au-dessus du CTA**, dans la forme déjà validée sur l'accueil : « Suivi
  obligatoire à 129.–/mois TVA comprise à partir de la 2ᵉ année, la première est
  comprise — c'est ce qui fait tourner l'assistant. »
- **Agent responsable** : `copy-positionnement` pour le texte,
  `page-produit` / `revue-code` pour le rendu.
- **Critère de validation** : sur `/prestations/l-assistant`, « 129.–/mois »,
  « obligatoire », « 2ᵉ année » et « TVA comprise » sont lisibles **sans déplier
  quoi que ce soit**, avant le bouton de devis.

#### BLOQUANT 5 — Cinq violations de règles fermées sur des pages de vente que personne n'a relues

- **Où et quoi**, toutes vérifiées :

  | # | Constat | Ligne | Règle violée |
  |---|---|---|---|
  | a | « sans frais cachés » — deux chaînes, sept rendus | `prestations/page.tsx:85` (× 4) · `[slug]/page.tsx:224` (× 3) | Guide §6, terme saturé 3/6 dont la promesse d'accueil entière d'un acteur. `accueil.md` §D.2 le retire justement de `Offres.tsx:170`. Voisin : « aucune ligne cachée », `page.tsx:211`. |
  | b | « le studio » en `h1`, en chapô, en `meta description` | `page.tsx:206, 213, 146, 51` · `mentions-legales/page.tsx:37, 42` | Glossaire, entrée 1. Le §I annonce dix textes changeant **ensemble** ; il en manque au moins six, et `mentions-legales.md:8` déclare la description « inchangée ». |
  | c | « Chez les autres, le compteur part… » | `page.tsx:218` · `formules.ts:117` | Réserve B2 et guide §3 : argument **interne**, jamais publié en comparaison. Voir T2. |
  | d | « synchronisée avec votre agenda » | `formules.ts:138` | Guide §8, règle de preuve. Retirée de `ServicesRows` pour ce motif exact. Voir T1. |
  | e | « sur-mesure » | `formules.ts:185` | Guide §6, 4/6, et interdit de définition de rôle. `accueil.md` §D.6 corrige le même terme en base. |

- **Pourquoi c'est un bloquant et pas une réserve.** Ces trois fichiers sont des
  **textes publics**, référencés par `app/sitemap.ts` avec une priorité de 0,7 à
  0,8, et ce sont les pages qui portent le mot-clé cible en profondeur. Deux des
  cinq constats font échouer un test adverse. Publier un site dont un tiers des
  pages n'a jamais rencontré son guide de voix, c'est publier deux sites.
- **Ce qui n'est pas en cause, et qu'il faut dire :** la mécanique de
  `lib/formules.ts` est excellente. L'échelle cumulative, où « ce qui n'est pas
  inclus » se **déduit** de la même liste que « ce qui est inclus », rend
  structurellement impossible qu'une page promette ce que la page inférieure ne
  déclare pas manquant. Ce n'est pas le raisonnement qui est à refaire, c'est le
  lexique et la règle de preuve à y appliquer.
- **Action corrective** : un tour dédié et borné —
  `copy-positionnement` → `docs/agents/copy/prestations.md` (mode `propose`)
  couvrant `lib/formules.ts`, `app/(site)/prestations/page.tsx`,
  `app/(site)/prestations/[slug]/page.tsx` et les deux `meta description`
  légales ; puis `psy-persuasion` **limité à ce fichier**. Voir la branche
  alternative en **Décision 4**, qui appartient à Boualem.
- **Agent responsable** : `copy-positionnement`, puis `psy-persuasion`.
- **Critère de validation** : zéro occurrence de « frais cach », « sur-mesure »,
  « le studio » et de toute comparaison à « les autres » dans `app/(site)/**` et
  `lib/formules.ts` ; et chaque fonction listée par `inclus()` traçable au §5 du
  positionnement.

---

## 6. Ce que le NO-GO n'interdit pas

Un refus qui gèle du travail prêt est un refus mal rendu. **L'apply de
`accueil.md`, `_chrome.md`, `mentions-legales.md` et `confidentialite.md` est
autorisé** dès que les quatre conditions suivantes sont tenues — elles ne
demandent aucun arbitrage et sont toutes écrites mot pour mot, ici ou dans la
revue A :

1. Le **BLOQUANT 3** est inscrit dans `accueil.md` §E.2.
2. Les **majeurs MA-B et MA-D** sont portés dans `accueil.md` (§E.4 Q3 et §E.3),
   MA-D dans la forme de la revue puisque la correction annoncée n'est pas posée.
3. Les **BLOQUANTS 1 et 2** sont posés — le chrome part sur toutes les pages,
   y compris celles qui ne sont pas encore relues, donc il ne peut pas attendre.
4. La **branche de « La carte »** est répondue, faute de quoi le §B ne s'applique
   pas — le reste du fichier, oui.

Les **sept mineurs du §8 de la revue A** sont acceptés tels quels, sans
discussion : deux d'entre eux corrigent les propres textes de la revue, deux
suppriment des constats devenus faux, et le MINEUR 6 porte la cascade du repli
du chiffre géant. Ils se traitent dans le même geste.

**Sur le « 0 » géant du hero** (point ouvert 4 de `accueil.md`) : je tranche pour
le **repli littéral « 1 / semaine »**, avec les trois gestes du MINEUR 6. Motif :
le « 0 » est le meilleur raisonnement du dossier et le pire risque de lecture —
un chiffre isolé qui peut se lire « gratuit » un quart de seconde occupe le plus
grand caractère d'un site qui n'a aucune preuve pour se rattraper. On prend le
sens sûr quand on n'a pas de crédit à dépenser.

**Sur l'ordre des sections** (Méthode au-dessus de la grille) : ce n'est pas une
décision de copy, et je ne la prends pas à la place de celui qui tiendra la
maquette. Elle va aux points ouverts.

---

## 7. État des réserves de la porte G1

| # | Réserve | État |
|---|---|---|
| B1 | Aucun superlatif de marché | **TENUE.** Balayage de la revue A : zéro occurrence dans un bloc APRÈS. Reste applicable en permanence. |
| B2 | Aucun concurrent nommé, aucune comparaison même en creux | **VIOLÉE** sur `/prestations` — voir T2 et BLOQUANT 5 c. Tenue sur le périmètre relu. |
| B3 | Le délai ne voyage jamais seul | **TENUE**, et absorbée par le guide §5, qui la formule mieux que moi. |
| B4 | « Interlocuteur unique » interdit | **TENUE.** `ServicesRows.tsx:22` corrigé en §C.2. |
| B5 | La règle opérationnelle du délai doit être écrite au positionnement | **LEVÉE.** §5, « Les conditions », ligne *Textes* ; §10, n°2, marquée tranchée. C'est le gain de fond depuis G1. |
| B6 | Aucune ligne de justification de prix tant que T7 n'est pas tranché | **TOMBE** — son critère est rempli. Voir **Décision 3**, et les trois conséquences exécutoires qui l'accompagnent. |
| — | Recommandation G1 « grille = prix d'amorçage » | **CADUQUE.** À ne reparaître dans aucun artefact. |

---

## 8. Hors de portée des agents, et bloquant avant mise en ligne

Ces trois points ne sont adressés à aucun agent. Ils sont rappelés ici parce
qu'aucun GO de déploiement ne pourra être donné tant qu'ils tiennent.

1. **`NAP_CONFIRME = false`** (`lib/site.ts:54`) : le verrou fait ce qu'il doit —
   aucune coordonnée ne part en donnée structurée — mais les valeurs de
   remplacement **restent affichées à l'écran**, dont un téléphone fictif rendu
   en grand sur la carte de visite du carrousel (`accueil.md` §H.2). Un numéro
   inventé affiché comme réel relève du même article que le client inventé.
2. **Les mentions légales attendent trois valeurs** : forme juridique, adresse de
   domiciliation, hébergeur. Le copy les a bornées correctement et ne les
   invente pas.
3. **Le carrousel reste à reconstruire, pas seulement à reformuler** : quatre
   pièces sur cinq relèvent de la ligne restauration, que le positionnement place
   hors de la grille principale. Un visiteur qui cherche une refonte de site voit
   un menu, une affiche, une carte de fidélité et un seul site.

---

## 9. Points ouverts — trois questions pour Boualem

1. **« La carte » : l'accord écrit du client existe-t-il, ou peut-il être obtenu
   cette semaine ?** Une ligne de réponse débloque le §B entier. Voir le tableau
   des deux coûts en **Décision 5**.
2. **`/prestations` : un tour de voix dédié, ou retrait des trois pages de vente
   du lancement ?** Le tour coûte une semaine d'agents ; le retrait coûte les
   trois pages qui portent le mot-clé en profondeur. Elles ne peuvent pas partir
   en l'état.
3. **La Méthode remonte-t-elle au-dessus de la grille de prix ?** C'est le
   meilleur gain de conversion non pris de la page, et c'est une décision de
   structure, pas de copy — le chapô du §D.1 est un palliatif, et son auteur le
   dit lui-même.

---

**La meilleure chose de ce livrable :** la section G de `_sans-preuve.md`, où
l'agent verse **ses propres phrases** au registre des retraits, avec le motif et
le remplacement. C'est ce qui a tué cinq bloquants en un seul tour, c'est ce qui
a permis à la revue A de reconnaître une erreur de décompte qui était la sienne,
et c'est la seule discipline du dossier qui se transmet d'un tour à l'autre sans
surveillance. Un dossier où la règle s'applique d'abord à celui qui l'écrit ne
se dégrade pas entre deux portes.

**Ce qui me ferait dire non demain :** qu'on mette le site en ligne en laissant
la promesse de délai à un texte que personne ne relit. L'assistant dit « sous
24 h » trois fois dans le fichier même qui interdit les comptes d'heures, et il
le redit avec ses propres mots à chaque conversation — c'est le seul endroit du
site où une phrase fausse ne peut pas être corrigée à l'écran, seulement à la
source.

---

**RAPPORT**

```
STATUT: NO-GO
LIVRABLES: docs/agents/reviews/boss-G2-tour1.md
CHIFFRES CLÉS: Clarté 4 · Preuve 3 · Cohérence 2 · Juridique 2 · Conversion 4 ·
  Faisabilité 3 · Différenciation 4 — 22/35 (périmètre relu seul : 31/35).
  T1 FAIL · T2 FAIL · T3 PASS · T4 FAIL · T5 PASS · T6 FAIL · T7 PASS.
  5 bloquants. B5 levée, B6 tombe, reco G1 « prix d'amorçage » caduque.
POINTS OUVERTS:
  1. « La carte » : l'accord écrit du client existe-t-il, ou peut-il être
     obtenu cette semaine ?
  2. /prestations : tour de voix dédié (une semaine), ou retrait des trois
     pages de vente du lancement ?
  3. La Méthode remonte-t-elle au-dessus de la grille de prix ?
PROCHAINE ÉTAPE: copy-positionnement — 1) purger « sous 24 h » et « sur-mesure »
  de lib/chat-prompt.ts (bloquant 1) ; 2) étendre _chrome.md §3 aux deux
  chaînes manquantes de ChatWidget (bloquant 2) ; 3) inscrire BL-A dans
  accueil.md §E.2 (bloquant 3) ; 4) porter MA-B, MA-D et les sept mineurs ;
  5) écrire docs/agents/copy/prestations.md (bloquant 5), puis psy-persuasion
  limité à ce fichier ; 6) bloquant 4 avec page-produit.
  Ensuite : apply de accueil.md, _chrome.md et des deux pages légales, sous
  les quatre conditions du §6.
```
