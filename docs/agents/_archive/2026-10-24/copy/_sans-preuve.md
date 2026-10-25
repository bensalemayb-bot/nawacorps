# Affirmations retirées faute de preuve — **tour 2**

> Règle appliquée : `docs/agents/brand/voice-guide.md` §8 — toute affirmation
> qui n'est ni dans `.agents/product-marketing.md`, ni dans
> `docs/agents/veille/`, est reformulée en fait vérifiable ou supprimée.
> Remplace la version du tour 1, archivée dans
> `docs/agents/_archive/2026-08-30-tour1/copy/_sans-preuve.md`.
>
> **Ce fichier n'est pas une liste de fautes.** Chaque ligne dit ce qu'il
> faudrait pour réintroduire l'affirmation. Plusieurs sont réintroduisibles en
> une phrase de Boualem — ce sont des décisions d'exploitation qui n'ont jamais
> été prises, pas des mensonges.

**28 entrées comptées : 25 affirmations retirées ou reformulées, 3 signalements
sans affirmation à retirer** (D.3, D.4, E.3) — plus une entrée hors décompte
(G.6), retirée pour un motif qui n'est pas la preuve. Au tour 2 s'ajoute la
section **G**, qui est la plus
importante du fichier : elle recense **les affirmations que mes propres
réécritures du tour 1 avaient introduites**, en appliquant à mon texte une règle
plus douce qu'aux textes que je corrigeais. C'est le reproche central de la
revue A, et il était fondé.

---

## A. Superlatifs de marché — fermés définitivement (réserve B1)

### A.1 — « Personne à Genève n'annonce ce délai »

- **Où** : `.agents/product-marketing.md` §3, pilier 1 — **où il figure
  aujourd'hui comme un interdit explicite**, pas comme une affirmation.
  *(Correction du tour 1, qui citait ce §3 comme la source du superlatif : la
  citation était périmée, et un lecteur qui ouvrait la référence trouvait le
  contraire de ce qui était annoncé.)* **Jamais écrit sur le site**, et il ne le
  sera pas.
- **Pourquoi retiré** : la veille ne peut pas porter ce superlatif. Le panel
  compte **3 acteurs proprement genevois** (sur 6 relevés) et nomme lui-même
  **8 acteurs écartés dont le délai n'a pas été vérifié**. Depuis que le délai
  annoncé est « une semaine », l'affirmation est en outre **matériellement
  fausse** : le panel relève un acteur à 7 jours et un autre à 48-72 h. Un
  superlatif non substantiable est précisément ce que vise la LCD art. 3.
- **Pour le réintroduire** : rien de raisonnable, et il n'y a plus rien à
  réintroduire — le fait a changé de sens.
- **Statut : FERMÉ.** Source : `boss-G1-tour1.md`, mémo, points (A) et (B),
  réserve B1 ; `.agents/product-marketing.md` §3, encadré « Ne jamais écrire ».

### A.2 — « Livré en trois jours au lieu de trois mois »

- **Où** : `components/Faq.tsx:35`.
- **Pourquoi retiré** : affirmation **sur le délai des concurrents**, et aucune
  source ne porte « trois mois ». Les délais publiés relevés vont de 48-72 h à
  8 semaines sur six acteurs. La phrase cumule un superlatif implicite (B1) et
  une comparaison en creux (B2), et introduit une seconde forme du délai.
- **Pour le réintroduire** : jamais sous cette forme.
- **Statut : FERMÉ.** Remplacement dans `copy/accueil.md` §E.4.

---

## B. Défenses de prix — gelées jusqu'à décision de Boualem (réserve B6)

### B.1 — « Si les prix sont ceux-là, c'est la structure qui l'explique »

- **Où** : `components/Studio.tsx:17`.
- **Pourquoi retiré** : la porte G1 pose que le copy n'écrit aucune ligne de
  justification de prix. Une justification écrite attire l'attention sur le
  doute qu'elle veut dissiper.
- **Nuance du tour 2** : le positionnement §1 **assume désormais publiquement**
  le lien (« pas de bureau … c'est ce qui explique les prix »). Les trois faits
  — pas de bureau, pas d'équipe commerciale, pas de sous-traitance — restent
  donc écrits sur le site ; **c'est la charnière causale vers le tarif qui reste
  dehors** (voir G.4).
- **Statut : GELÉ — décision Boualem.** Source : `boss-G1-tour1.md`, réserve B6,
  test T7.

### B.2 — La question « Pourquoi moins cher qu'une agence ? »

- **Où** : `components/Faq.tsx:34`.
- **Pourquoi retiré** : la question *elle-même* pose le prix comme une anomalie
  à expliquer, avant que la réponse commence.
- **Statut : GELÉ — décision Boualem.** Question de remplacement : « Qui fait le
  travail ? » (`copy/accueil.md` §E.4).

---

## C. Engagements de service jamais décidés

### C.1 — « Réponse d'Ayoub sous 24 h » et « réponse sous 24 h »

- **Où** : `components/ChatWidget.tsx:181` (les **trois pages**, en permanence)
  et `components/ContactForm.tsx:69`.
- **Pourquoi retiré** : ce délai n'existe ni dans le positionnement, ni dans la
  veille, et il était affiché en permanence — la promesse la plus répétée du
  site après le délai de refonte.
- **CE QUI CHANGE AU TOUR 2 — une réintroduction, une seule.** La revue A
  observe que retirer les trois formules de réactivité (« sous 24 h »,
  « corrigé dans la journée », « devis en cinq minutes ») laisse le site **sans
  aucune indication de réactivité**, alors que c'est l'attente n°3 de la cible
  (« il sera encore là »). Elle recommande d'en réintroduire **une seule**, sous
  forme d'engagement d'exploitation et non de formule commerciale — un délai
  tenable **un dimanche de décembre**. Retenu :
  > **« réponse le jour ouvrable suivant »**, une seule occurrence, à l'accusé
  > de réception du formulaire (`copy/accueil.md` §F.1).

  Les deux autres restent dehors (C.2, C.3). L'assistant, lui, n'affiche plus
  aucun délai : il affiche un fait d'architecture (`copy/_chrome.md` §3).
- **CONDITION AVANT L'APPLY** : cet engagement doit être **écrit dans
  `.agents/product-marketing.md`**. C'est une décision d'exploitation, pas une
  formule ; tant qu'elle n'y figure pas, la règle de preuve du guide §8
  l'interdit comme les autres.
- **Statut : RÉINTRODUIT SOUS CONDITION — à inscrire au positionnement.**

### C.2 — « C'est corrigé dans la journée »

- **Où** : `components/Methode.tsx:18` et `components/Faq.tsx:31` — deux
  endroits, donc une promesse lue deux fois.
- **Pourquoi retiré** : engagement de délai sur une prestation dont l'agence n'a
  **aucun abonné** (§9, « Revenu récurrent : 0 »).
- **Pour le réintroduire** : des abonnés au suivi sur qui le mesurer, puis la
  même décision écrite qu'en C.1.
- **Statut : DÉCISION BOUALEM — reste dehors au tour 2.**

### C.3 — « Devis en cinq minutes »

- **Où** : `components/CarteDuStudio.tsx:117`.
- **Pourquoi retiré** : aucune source, et le chiffre entre en concurrence avec
  la seule promesse de délai du site.
- **Statut : FERMÉ.**

### C.4 — « Créneaux synchronisés avec votre agenda »

- **Où** : `components/ServicesRows.tsx:35`.
- **Pourquoi retiré** : **fonctionnalité** promise sans source. Le §5 ne
  mentionne que « Prise de rendez-vous en ligne ». La synchronisation
  bidirectionnelle avec un agenda tiers est un autre objet technique, et la
  promettre engage la livraison.
- **Pour le réintroduire** : que la fonction existe et soit décrite au §5, avec
  le ou les agendas pris en charge.
- **Statut : PREUVE MANQUANTE — technique.**

### C.5 — « Réponses aux avis »

- **Où** : `components/ServicesRows.tsx:43`.
- **Pourquoi retiré** : prestation **récurrente** listée au milieu de
  prestations livrées une fois, sans figurer dans aucune formule ni dans le
  suivi. Un client la lirait comme comprise.
- **Statut : DÉCISION BOUALEM.**

### C.6 — « vous alerte sur votre téléphone **dans la seconde** » *(tour 2)*

- **Où** : réécriture du tour 1, `copy/accueil.md` §C.3, geste 04.
- **Pourquoi retiré** : le §5 écrit « **Alerte instantanée** ». « Dans la
  seconde » est une **latence chiffrée** que rien ne mesure et que rien ne
  garantit — une notification Telegram dépend d'un réseau et d'un service tiers.
  Un adverbe est une qualité, une seconde est une mesure.
- **Remplacement** : « … et vous alerte **aussitôt** sur votre téléphone. »
- **Statut : FERMÉ.**

### C.7 — « et reçoit sa confirmation » *(tour 2)*

- **Où** : réécriture du tour 1, `copy/accueil.md` §C.3, geste 03.
- **Pourquoi retiré** : fonction ajoutée sans source, **dans la ligne même où la
  synchronisation d'agenda était retirée pour ce motif** (C.4). Le §5 ne dit que
  « Prise de rendez-vous en ligne » ; l'envoi d'une confirmation au client est
  un autre objet.
- **Statut : FERMÉ** — les quatre mots sont supprimés.

---

## D. Fictions et références — preuve externe manquante

### D.1 — « Le Comptoir » et tous ses attributs

- **Où** : `components/ui/feature-carousel.tsx` — nom d'enseigne (7
  occurrences), « Maison fondée en 1987 », « depuis 1987 », « Rue des Étuves
  12 · 1201 », « Tél : 022 000 00 00 / Fax : 022 000 00 01 », « Vous êtes le
  visiteur n° 000482 », « Jeudi 12 décembre », « Site optimisé pour Internet
  Explorer 6 ».
- **Pourquoi retiré** : le positionnement le classe « **client fictif inventé —
  à retirer** » (§6) ; `CLAUDE.md` l'inscrit dans ses Interdits. Une raison
  sociale, une adresse dans une rue qui existe, une année de fondation et un
  numéro de téléphone composent une entreprise crédible — une indication
  trompeuse au sens de la LCD art. 3.
- **Ajout du tour 2** : **deux lignes de dérision manquées au tour 1** sont
  supprimées sans remplacement — « Site optimisé pour Internet Explorer 6 »
  (la chute de la blague) et le compteur de visiteurs, libellé compris (l'objet
  moqué). Positionnement §8 : « *Daté*, jamais *ridicule*. »
- **Pour le réintroduire** : **jamais sous forme d'entreprise nommée.** Deux
  issues, dans l'ordre du §6 : (1) une vraie référence ; (2) une démonstration
  assumée, étiquetée à côté de la pièce.
- **Statut : PREUVE MANQUANTE — risque n°1 du plan (§6).** Neutralisation dans
  `copy/accueil.md` §B.2.

### D.2 — Le carrousel présenté sous le titre « Travaux »

- **Où** : `components/Travaux.tsx:18`, `components/Nav.tsx:59`,
  `components/MenuOverlay.tsx:13`.
- **Pourquoi retiré** : « Travaux » annonce des réalisations clientes ; l'agence
  en compte **zéro** en refonte de site (§9).
- **Statut : PREUVE MANQUANTE.** Remplacement : « Démonstrations »
  (`copy/_chrome.md` §2). **Les ancres `/#travaux` ne changent pas.**

### D.3 — Les coordonnées affichées *(signalement)*

- **Où** : `lib/site.ts:51-56`, rendues en pied de page, dans le menu, et **en
  grand sur la carte de visite du carrousel** (`feature-carousel.tsx:265-267`).
- **Pourquoi signalé** : `NAP_CONFIRME = false`. Le verrou empêche ces valeurs
  de partir en donnée structurée, mais elles restent **affichées** : un numéro
  en `+41 76 000 00 00` et une adresse e-mail non confirmée. Pour un commerce
  local, la cohérence nom / adresse / téléphone est le premier signal de
  référencement local.
- **Statut : DÉCISION BOUALEM — bloquant avant mise en ligne.**

### D.4 — La carte de restaurant, seule preuve réelle de l'agence *(signalement)*

- **Où** : pièce « La carte » du carrousel.
- **Pourquoi signalé** : c'est le **seul** travail adossé à un client payant
  réel (§6), utilisable **avec l'accord du client**, que rien n'atteste à ce
  jour. **Le tour 1 se contredisait** : il renommait la pièce comme une fiction
  tout en la présentant ailleurs comme la seule preuve réelle. Les deux ne
  peuvent pas être vrais.
- **Pour l'utiliser comme référence** : l'accord écrit du client.
- **Statut : PREUVE MANQUANTE — externe. Bloquant pour l'apply** : les deux
  réécritures sont prêtes dans `copy/accueil.md` §B.4, mais elles s'excluent.

### D.5 — Les marqueurs des mentions légales

- **Où** : `app/(site)/mentions-legales/page.tsx:58,60`.
- **CE QUI CHANGE AU TOUR 2** : **`[PRÉNOM NOM — À COMPLÉTER]` a sa réponse.**
  Le positionnement §1 nomme désormais l'exploitant — **Ayoub Bensalem** — et le
  nom est public. Restent la forme juridique, l'adresse de domiciliation,
  l'adresse e-mail et l'hébergeur. Voir `copy/mentions-legales.md`.
- **Statut : PARTIELLEMENT LEVÉ — le reste bloquant avant mise en ligne.**

---

## E. Affirmations devenues fausses

### E.1 — « Formulaire et assistant arrivent prochainement »

- **Où** : `app/(site)/confidentialite/page.tsx:56`.
- **Pourquoi retiré** : les deux sont **en production** et collectent des
  données personnelles. La version qui rassure est celle qui est fausse.
- **Statut : SUPPRESSION IMMÉDIATE.**

### E.2 — « Hébergement des données : Suisse »

- **Où** : `app/(site)/confidentialite/page.tsx:51`.
- **Pourquoi retiré** : l'assistant appelle un fournisseur de LLM externe —
  Gemini ou Groq selon `LLM_PROVIDER` (`lib/llm.ts`, CLAUDE.md § Stack). **Le
  contenu des conversations sort de Suisse**, et la page affirme l'inverse.
- **Pour le réintroduire** : hébergement confirmé, et une phrase distincte pour
  le traitement des conversations. Formulation dans `copy/confidentialite.md`
  §2 — **à faire valider juridiquement, je ne suis pas juriste.**
- **Statut : PREUVE MANQUANTE + validation juridique.**

### E.3 — La durée de conservation de 12 mois *(signalement)*

- **Où** : `app/(site)/confidentialite/page.tsx:49`.
- **Pourquoi signalé** : aucune purge automatique relevée dans le schéma, et la
  durée est annoncée sans point de départ.
- **Statut : PREUVE MANQUANTE — technique.**

### E.4 — **« 72 heures », « 72 h », « trois jours », « 24 h »** *(tour 2 — la plus lourde)*

- **Où** : **partout.** `NoyauHero.tsx:40,73-74,77-80` ; `Strip.tsx:12` ;
  `ServicesRows.tsx:27` ; `Methode.tsx:12,16,17` ; `Studio.tsx:20` ;
  `Faq.tsx:18,35` ; `feature-carousel.tsx:385` ; `layout.tsx:55,59,66,68,72,74`.
  Et **60 occurrences dans les livrables du tour 1**, dont 27 dans
  `copy/accueil.md` et 10 dans le guide de voix.
- **Pourquoi retiré** : `.agents/product-marketing.md` §8 — « **une semaine**,
  partout, sans exception. Aucun compte d'heures — ni 72 h, ni 48 h : ces
  chiffres ont circulé, aucun n'est tenu. » Et §3 : « Le chiffre exact a bougé
  plusieurs fois et n'est pas tenu ; une semaine est le seul délai que l'agence
  a confirmé pouvoir tenir. » **Promettre moins vite qu'on ne peut est un
  avantage : un délai raté coûte plus cher que le délai gagné.**
- **Ce qui le remplace** : « une semaine », et **surtout un autre argument**. La
  vitesse ne différencie plus (le panel relève 7 jours et 48-72 h) ; ce qui
  différencie est que **le client n'a rien à préparer** — les deux seuls
  concurrents rapides du panel conditionnent leur délai à la fourniture du
  contenu.
- **Pour le réintroduire** : jamais. Un chiffre repris et non tenu a déjà coûté
  trois révisions du positionnement.
- **Statut : FERMÉ.**

### E.5 — « Studio digital » et « le studio » *(tour 2)*

- **Où** : `NoyauHero.tsx:29-31`, `Loader.tsx:39`, `FooterContact.tsx:59`,
  `Travaux.tsx:23`, `CarteDuStudio.tsx:99,101,113`, `Studio.tsx:10,16`,
  `Faq.tsx:35`, `mentions-legales/page.tsx:58` — **dix textes visibles**, plus
  les livrables du tour 1.
- **Pourquoi retiré** : `.agents/product-marketing.md` §1 — « **Agence
  digitale** indépendante à Genève, opérée par **Ayoub Bensalem**. **Pas de
  bureau** ». Le glossaire n'admet qu'un mot par concept.
- **Statut : REMPLACÉ.** Inventaire complet du renommage : `copy/accueil.md` §I.
  **Une réserve y est posée** : le positionnement emploie encore « le studio »
  dans sa prose (§5, §8, §9) — si Boualem préfère garder ce mot en prose, seules
  les trois étiquettes de catégorie changent.

---

## F. Termes interdits, sans rapport avec la preuve

### F.1 — « Un seul interlocuteur »

- **Où** : `components/ServicesRows.tsx:22`.
- **Pourquoi retiré** : **réserve B4.** « Interlocuteur unique » est occupé sur
  ce marché par un acteur du panel ; « un seul interlocuteur » en est la
  variante reconnaissable. Le fait est vrai — c'est une collision, pas un défaut
  de preuve.
- **Statut : FERMÉ.** Remplacement : « Six gestes, la même personne. »

### F.2 — « Sans engagement » *(et son remplacement du tour 1, voir G.5)*

- **Où** : `components/CarteDuStudio.tsx:101`.
- **Pourquoi retiré** : relevé dans le lexique du panel, et vague juridiquement.
- **Statut : FERMÉ** — et **rien ne le remplace** : voir G.5, qui explique
  pourquoi le remplacement du tour 1 était pire que le terme d'origine.

---

## G. **Ce que mes propres réécritures du tour 1 avaient introduit** *(tour 2)*

> Le reproche central de la revue A : « il a appliqué sa propre règle de preuve
> moins sévèrement à ses réécritures qu'aux textes qu'il corrigeait ». Il est
> fondé. Les cinq entrées ci-dessous sont des affirmations que **j'ai écrites**,
> et qui tombent sous la même règle que celles que je retirais.

### G.1 — « Ayoub lit tout, et répond lui-même »

- **Où** : `copy/_chrome.md` §3 du tour 1 — sous-titre de l'assistant, donc
  **les trois pages, en permanence**.
- **Pourquoi retiré** : c'est « réponse sous 24 h » **sans l'horloge**. Une
  affirmation sur un **comportement futur** — invérifiable, absente du
  positionnement comme de la veille. Plus difficile à démentir, pas mieux
  fondée, et à la position la plus exposée du site. Le guide §8 ne prévoit pas
  de degré : fait vérifiable, ou rien.
- **Remplacement** : un **fait d'architecture** — « Vous utilisez L'Assistant,
  la troisième formule. Ayoub voit la conversation. » (`copy/_chrome.md` §3).
- **Statut : FERMÉ.**

### G.2 — « Je vous réponds personnellement »

- **Où** : `copy/accueil.md` §F.1 du tour 1 — accusé de réception du formulaire.
- **Pourquoi retiré** : même défaut, même habillage. Une promesse de
  comportement remplaçait une promesse de délai retirée pour absence de preuve.
- **Remplacement** : « Message reçu. Il arrive chez Ayoub, pas dans une boîte
  partagée — réponse le jour ouvrable suivant. » Le premier membre est un fait
  documenté (§5, `/admin`) ; le second est l'unique engagement de réactivité du
  site, et il est tenable un dimanche (C.1).
- **Statut : FERMÉ.**

### G.3 — « et souvent la seule chose qu'ils voient »

- **Où** : `copy/accueil.md` §C.3 du tour 1, geste 05 (fiche Google).
- **Pourquoi retiré** : affirmation générale sur le **comportement du marché**,
  absente de `.agents/product-marketing.md` comme de `docs/agents/veille/`. Le
  guide §8 pose la règle sans exception, « y compris pour un détail rassurant
  qui ne mange pas de pain » — et la même réécriture venait de retirer
  « réponses aux avis » pour ce motif exact, trois mots plus loin. Le levier
  était le plus fort de la ligne : c'est justement pourquoi il devait être
  sourcé.
- **Remplacement** : « C'est ce que voient les gens qui cherchent votre métier à
  Genève. » — le positionnement §2 porte ce fait mot pour mot. Ce qui est retiré
  est la **quantification implicite**, pas l'idée.
- **Statut : FERMÉ.**

### G.4 — « le studio est petit, **et c'est ce qui lui permet** d'être là »

- **Où** : `copy/accueil.md` §E.3 du tour 1.
- **Pourquoi retiré** : la charnière causale rouvre l'inférence de prix que B6
  veut fermer. Le trio bureaux / commerciaux / sous-traitance **est** la
  justification tarifaire classique ; « c'est ce qui lui permet » invite le
  lecteur à finir la phrase lui-même. La réécriture prétendait retirer la
  défense de prix et la réintroduisait par la syntaxe.
- **Remplacement** : deux phrases sans lien causal — « Pas de bureau, pas
  d'équipe commerciale, pas de sous-traitance. L'agence est une personne — la
  même le lendemain de la mise en ligne et le mois suivant. »
- **Statut : FERMÉ.**

### G.5 — « sans abonnement obligatoire »

- **Où** : `copy/accueil.md` §D.4 du tour 1, chapô de la carte de l'agence.
- **Pourquoi retiré** : le tour 1 remplaçait un terme vague et saturé (« sans
  engagement ») par une affirmation **précise et fausse pour un tiers de la
  grille** — `.agents/product-marketing.md` §5 : « Le palier 3 impose
  l'abonnement de suivi — ce n'est pas une option ». Une affirmation vague qui
  ne dit rien est un défaut de style ; une affirmation précise qui dit le
  contraire du contrat est un défaut de fond, et elle figurait sur la carte qui
  liste justement « En continu ».
- **Remplacement** : **rien.** « L'agence reste là » porte le pilier 3 et il est
  vrai sans condition.
- **Conséquence positive** : la condition tue, elle se dit désormais **deux
  fois** — sous la grille et sur la carte de L'Assistant (`copy/accueil.md`
  §D.2 et §D.3). Dire la condition la vend.
- **Statut : FERMÉ.**

### G.6 — *(hors preuve)* « le studio démarre, et sa première refonte de site de PME reste à faire »

- **Où** : `copy/accueil.md` §B.1 du tour 1, chapô des Démonstrations.
- **Pourquoi retiré** : ce n'est pas une affirmation sans preuve — elle est
  vraie. C'est de l'**auto-dénigrement**, dans la section censée porter la
  preuve, juste avant une grille de prix. Ne revendiquer aucune référence est
  une obligation ; annoncer qu'on n'a jamais fait le travail est un choix, et il
  coûte la vente. Le silence sur un négatif n'est pas une affirmation fausse.
- **Remplacement** : « Cinq pièces faites par l'agence pour montrer le travail —
  aucune n'est un client. » Tout aussi honnête, et la section garde sa fonction.
- **Statut : FERMÉ.** *(Entrée hors décompte : rien n'est retiré faute de
  preuve.)*
