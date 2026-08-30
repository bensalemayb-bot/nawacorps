# Affirmations retirées faute de preuve

> Règle appliquée : `docs/agents/brand/voice-guide.md` §8 — toute affirmation
> qui n'est ni dans `.agents/product-marketing.md`, ni dans
> `docs/agents/veille/`, est reformulée en fait vérifiable ou supprimée.
>
> **Ce fichier n'est pas une liste de fautes.** Chaque ligne dit ce qu'il
> faudrait pour réintroduire l'affirmation. Plusieurs sont réintroduisibles en
> une phrase de Boualem — ce sont des décisions d'exploitation qui n'ont jamais
> été prises, pas des mensonges.

**14 affirmations retirées ou reformulées. 5 attendent une décision de Boualem,
4 attendent une preuve externe, 3 sont fermées par une réserve de la porte G1,
2 sont fermées définitivement.**

---

## A. Superlatifs de marché — fermés définitivement (réserve B1)

### A.1 — « Personne à Genève n'annonce ce délai »

- **Où** : `.agents/product-marketing.md` §3, pilier 1. **Jamais écrit sur le
  site**, et il ne le sera pas.
- **Pourquoi retiré** : la veille ne peut pas porter ce superlatif. Le panel
  compte **3 acteurs proprement genevois** (sur 6 relevés) et nomme lui-même
  **8 acteurs écartés dont le délai n'a pas été vérifié**. Sur cette base on
  peut écrire « je n'en ai trouvé aucun » ; on ne peut pas écrire « il n'y en a
  pas ». Un superlatif non substantiable est précisément ce que vise la LCD
  art. 3.
- **Pour le réintroduire** : rien de raisonnable. Il faudrait un recensement
  exhaustif et daté des prestataires web du canton, refait à chaque
  modification de leur offre. Le coût est disproportionné, et **l'affirmation de
  remplacement est plus vendeuse** : « 72 h à partir de votre feu vert » est
  testable en achetant, là où « plus rapide que tout le monde » est une
  invitation à aller vérifier ailleurs.
- **Statut : FERMÉ.** Source : `docs/agents/reviews/boss-G1-tour1.md`, mémo,
  points (A) et (B), et réserve B1.

### A.2 — « Livré en trois jours au lieu de trois mois »

- **Où** : `components/Faq.tsx:35`, réponse à « Pourquoi moins cher qu'une
  agence ? ».
- **Pourquoi retiré** : c'est une **affirmation sur le délai des concurrents**,
  et aucune source ne porte « trois mois ». Les délais publiés relevés vont de
  10 jours à 8 semaines sur les six acteurs du panel. La phrase cumule un
  superlatif implicite (B1) et une comparaison en creux (B2). Elle introduit
  en outre une seconde forme du délai (« trois jours »), alors que le glossaire
  n'en admet qu'une.
- **Pour le réintroduire** : jamais sous cette forme. Le délai du studio se dit
  sans référence à celui des autres.
- **Statut : FERMÉ.** Remplacement proposé dans `copy/accueil.md` §E.4.

---

## B. Défenses de prix — gelées jusqu'à décision de Boualem (réserve B6)

### B.1 — « Si les prix sont ceux-là, c'est la structure qui l'explique »

- **Où** : `components/Studio.tsx:17`.
- **Pourquoi retiré** : la porte G1 pose que le copy n'écrit **aucune ligne de
  justification de prix** tant que la question de la grille n'est pas tranchée.
  La veille a en effet mis à jour un désaccord non résolu : aux paliers 2 et 3,
  le studio est **au prix exact du marché** relevé, et sous le plancher suisse
  au palier 1 — un profil que le positionnement lui-même décrit comme
  contre-productif (« un prix trop bas le rend méfiant, pas intéressé », §4).
  Une justification écrite attire l'attention sur le doute qu'elle veut
  dissiper.
- **Pour le réintroduire** : **une décision de Boualem sur la grille**, option A
  (garder les prix et assumer la justification) ou option B (remonter les
  paliers 2 et 3). Tant qu'elle n'est pas consignée, la ligne reste dehors.
- **Statut : GELÉ — décision Boualem.** Source : `boss-G1-tour1.md`, section
  « Le problème que la veille révèle », réserve B6, test T7.

### B.2 — La question « Pourquoi moins cher qu'une agence ? »

- **Où** : `components/Faq.tsx:34`.
- **Pourquoi retiré** : même motif. La question *elle-même* pose le prix comme
  une anomalie à expliquer, avant même que la réponse commence.
- **Pour le réintroduire** : idem B.1.
- **Statut : GELÉ — décision Boualem.** Question de remplacement proposée dans
  `copy/accueil.md` §E.4 : « Qui fait le travail ? », qui garde la phrase que le
  positionnement demande de conserver mot pour mot.

---

## C. Engagements de service jamais décidés — décision Boualem

### C.1 — « Réponse d'Ayoub sous 24 h » et « réponse sous 24 h »

- **Où** : `components/ChatWidget.tsx:181` (les **trois pages**, en permanence)
  et `components/ContactForm.tsx:69` (accusé de réception).
- **Pourquoi retiré** : ce délai n'existe ni dans le positionnement, ni dans la
  veille. Il est affiché en permanence sur tout le site et au moment précis où
  le visiteur devient joignable — donc c'est la promesse la plus répétée du
  site après les 72 heures, et elle n'est adossée à rien.
- **Pour le réintroduire** : que Boualem décide qu'il le tient — **y compris le
  dimanche et pendant les vacances** — et que ce soit écrit dans
  `.agents/product-marketing.md`. C'est une décision d'exploitation, pas une
  formule. Un « sous 48 h » tenu vaut mieux qu'un « sous 24 h » raté.
- **Statut : DÉCISION BOUALEM.** Remplacements proposés dans `copy/_chrome.md`
  §3 et `copy/accueil.md` §F.1.

### C.2 — « C'est corrigé dans la journée »

- **Où** : `components/Methode.tsx:18` et `components/Faq.tsx:31` — **deux
  endroits**, ce qui en fait une promesse que le visiteur lira deux fois.
- **Pourquoi retiré** : engagement de délai sur une prestation dont le studio
  n'a **aucun abonné** à ce jour (§9, « Revenu récurrent : 0 »). Aucune
  expérience ne l'étaye, et il s'ajoute à la promesse de 72 heures, qui doit
  rester la seule promesse de délai du site (§8).
- **Pour le réintroduire** : même condition que C.1, et une fois qu'il existe
  des abonnés au suivi sur qui le mesurer.
- **Statut : DÉCISION BOUALEM.**

### C.3 — « Devis en cinq minutes »

- **Où** : `components/CarteDuStudio.tsx:117`.
- **Pourquoi retiré** : aucune source. Et le chiffre entre en concurrence
  directe avec les 72 heures — deux délais chiffrés sur la même page pour deux
  choses différentes, c'est le défaut que le §8 demande justement de corriger
  (« aujourd'hui deux semaines au hero, 48 h en méthode, une semaine en FAQ »).
- **Pour le réintroduire** : jamais tel quel. Si le studio veut promettre un
  devis rapide, il le fait avec le mot du glossaire et un point de départ.
- **Statut : FERMÉ.**

### C.4 — « Créneaux synchronisés avec votre agenda »

- **Où** : `components/ServicesRows.tsx:35`.
- **Pourquoi retiré** : **fonctionnalité** promise sans source. Le §5 ne
  mentionne que « Prise de rendez-vous en ligne ». La synchronisation
  bidirectionnelle avec un agenda tiers est un autre objet technique, et la
  promettre engage la livraison sous 72 heures.
- **Pour le réintroduire** : que la fonction existe et soit décrite dans le §5
  du positionnement, avec le ou les agendas pris en charge.
- **Statut : PREUVE MANQUANTE — technique.**

### C.5 — « Réponses aux avis »

- **Où** : `components/ServicesRows.tsx:43`.
- **Pourquoi retiré** : prestation **récurrente** listée au milieu de
  prestations livrées une fois, sans figurer dans aucune formule ni dans le
  suivi (§5). Un client la lirait comme comprise.
- **Pour le réintroduire** : l'inscrire dans un palier ou dans le suivi, avec
  son prix.
- **Statut : DÉCISION BOUALEM.**

---

## D. Fictions et références — preuve externe manquante

### D.1 — « Le Comptoir » et tous ses attributs

- **Où** : `components/ui/feature-carousel.tsx` — nom d'enseigne (7
  occurrences), « Maison fondée en 1987 », « depuis 1987 », « Rue des Étuves
  12 · 1201 », « Tél : 022 000 00 00 / Fax : 022 000 00 01 », « Vous êtes le
  visiteur n° 000482 », « Jeudi 12 décembre ».
- **Pourquoi retiré** : le positionnement le classe déjà « **client fictif
  inventé — à retirer** » (§6), et CLAUDE.md l'inscrit dans ses Interdits :
  « aucune référence client inventée, aucun avis fabriqué, aucun compteur
  fictif ». Une raison sociale, une adresse dans une rue qui existe, une année
  de fondation et un numéro de téléphone composent ensemble une entreprise
  crédible — c'est-à-dire une indication trompeuse au sens de la LCD art. 3.
- **Pour le réintroduire** : **jamais sous forme d'entreprise nommée.** Deux
  issues, dans l'ordre du §6 : (1) une vraie référence — un site de PME
  genevoise à prix réduit contre l'autorisation de le montrer, des captures
  avant/après et deux phrases du gérant ; (2) une démonstration assumée,
  étiquetée « démonstration » à côté de la pièce.
- **Statut : PREUVE MANQUANTE — c'est le risque n°1 du plan (§6).**
  Neutralisation minimale proposée dans `copy/accueil.md` §B.2.

### D.2 — Le carrousel présenté sous le titre « Travaux »

- **Où** : `components/Travaux.tsx:18`, `components/Nav.tsx:59`,
  `components/MenuOverlay.tsx:13`.
- **Pourquoi retiré** : « Travaux » annonce des réalisations clientes. Le studio
  en compte **zéro** en refonte de site (§9). Le chapô disait déjà
  « démonstrations », mais c'est l'étiquette de section que l'œil retient.
- **Pour le réintroduire** : la première référence réelle. Une seule suffit.
- **Statut : PREUVE MANQUANTE.** Remplacement proposé : « Démonstrations »
  (`copy/_chrome.md` §2). **Les ancres `/#travaux` ne changent pas.**

### D.3 — Les coordonnées affichées

- **Où** : `lib/site.ts:51-56`, rendues à l'écran en pied de page
  (`FooterContact.tsx:46`), dans le menu, et **en grand sur la carte de visite
  du carrousel** (`feature-carousel.tsx:265-267`).
- **Pourquoi signalé** : `NAP_CONFIRME = false`. Le verrou empêche ces valeurs
  de partir en donnée structurée — c'est bien joué — mais elles restent
  **affichées** : un numéro de téléphone en `+41 76 000 00 00` et une adresse
  e-mail non confirmée. Pour un commerce local, la cohérence nom / adresse /
  téléphone est le premier signal de référencement local ; là, c'est un
  placeholder qui occupe la place.
- **Pour le réintroduire** : les vraies valeurs, puis `NAP_CONFIRME = true`.
- **Statut : DÉCISION BOUALEM — bloquant avant mise en ligne.**

### D.4 — La carte de restaurant, seule preuve réelle du studio

- **Où** : pièce « La carte » du carrousel.
- **Pourquoi signalé** : c'est le **seul** travail adossé à un client payant
  réel (§6). Il est utilisable — mais **avec l'accord du client**, que rien
  n'atteste à ce jour.
- **Pour l'utiliser comme référence** : l'accord écrit du client. Sans lui, la
  pièce reste une démonstration comme les quatre autres.
- **Statut : PREUVE MANQUANTE — externe.**

### D.5 — Les marqueurs des mentions légales

- **Où** : `app/(site)/mentions-legales/page.tsx:58,60` —
  `[PRÉNOM NOM — À COMPLÉTER]`, `[à confirmer]`, `[Infomaniak, Suisse — à
  confirmer en B12]`.
- **Pourquoi signalé** : ils sont **visibles en production**. Le commentaire du
  fichier a raison de refuser qu'ils soient remplis par invention ; le problème
  est que la page est en ligne entre-temps, et c'est le premier document qu'un
  prospect méfiant va chercher.
- **Statut : DÉCISION BOUALEM — bloquant avant mise en ligne.**

---

## E. Affirmations devenues fausses

### E.1 — « Formulaire et assistant arrivent prochainement »

- **Où** : `app/(site)/confidentialite/page.tsx:56`.
- **Pourquoi retiré** : les deux sont **en production** et collectent des
  données personnelles. La même page les décrit au présent quatre lignes plus
  haut. La version qui rassure est celle qui est fausse.
- **Statut : SUPPRESSION IMMÉDIATE**, sans contrepartie ni décision à prendre.

### E.2 — « Hébergement des données : Suisse »

- **Où** : `app/(site)/confidentialite/page.tsx:51`.
- **Pourquoi retiré** : l'assistant appelle un fournisseur de LLM externe —
  Gemini ou Groq selon `LLM_PROVIDER` (`lib/llm.ts`, CLAUDE.md § Stack). **Le
  contenu des conversations sort donc de Suisse**, et la page affirme l'inverse.
  La page des mentions légales écrit par ailleurs « [Infomaniak, Suisse — à
  confirmer] » : deux pages du même site, deux niveaux de certitude sur la même
  donnée.
- **Pour le réintroduire** : hébergement confirmé, et une phrase distincte pour
  le traitement des conversations par le fournisseur de modèle. Formulation
  proposée dans `copy/confidentialite.md` §2 — **à faire valider
  juridiquement, je ne suis pas juriste.**
- **Statut : PREUVE MANQUANTE + validation juridique.**

### E.3 — La durée de conservation de 12 mois

- **Où** : `app/(site)/confidentialite/page.tsx:49`.
- **Pourquoi signalé** : aucune purge automatique n'a été relevée dans le
  schéma. Une durée annoncée et non appliquée est pire que pas de durée du tout,
  et elle est annoncée sans point de départ (12 mois à compter de quoi ?).
- **Pour la confirmer** : un mécanisme de suppression, et le point de départ
  écrit.
- **Statut : PREUVE MANQUANTE — technique.**

---

## F. Terme interdit, sans rapport avec la preuve

### F.1 — « Un seul interlocuteur »

- **Où** : `components/ServicesRows.tsx:22`, en titre de section.
- **Pourquoi retiré** : **réserve B4.** « Interlocuteur unique » est occupé sur
  ce marché par un acteur du panel ; « un seul interlocuteur » en est la variante
  reconnaissable. Ce n'est pas un problème de preuve — le fait est vrai — mais
  de collision : la porte a tranché que l'argument de continuité s'écrit sur
  l'**après-livraison**, que personne du panel ne revendique.
- **Pour le réintroduire** : jamais.
- **Statut : FERMÉ.** Remplacement proposé : « Six gestes, la même personne. »
  (`copy/accueil.md` §C.2).
