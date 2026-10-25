# Points à trancher par Ayoub — textes du site, offre « assistant » (24.10.2026)

> Ce que le copy ne peut pas décider seul. Classés par ce qu'ils bloquent.
> Détail dans les fichiers cités. PM = `.agents/product-marketing.md`.

## A. Bloquent des textes déjà écrits

1. **Le titre qui tourne** (`accueil.md` §A.2). Recommandé : « L'assistant
   qui » + 4 fins (« connaît votre métier. », puis 3 verbes). Variante : les 3
   verbes seuls. Et le `title` de l'accueil : sans « IA » (voix) ou avec
   « Assistant IA pour PME à Genève… » (requête) ? (`meta.md` §1)
2. **Quels métiers montrer sur le site aujourd'hui** (`accueil.md` §F,
   `services.md` §4). Le PM met fiduciaires, régies et agences « plus tard »,
   et le secret de la clientèle des fiduciaires est « à vérifier ». Les montrer
   comme exemples, ou ne garder que sanitaire, électricité et une ligne
   « votre métier » ?
3. **La base sanitaire existe-t-elle au 9 novembre ?** Tout le site dit « il
   connaît déjà votre métier » et « il sait ce qu'est un bon de régie »
   (`_sans-preuve.md` S13). Sinon : « réglé sur votre métier ».
4. **Le relevé de démonstration** publié sur `/demonstrations`
   (`demonstrations.md` §3), étiqueté « démonstration ». Oui, ou la section
   sans exemple ?
5. **Le bouton du formulaire** devient « Demander ma démo » partout, y compris
   sur `/contact` (`_chrome.md` §4). D'accord pour un seul geste ?

## B. Décisions d'offre (PM §10), à inscrire au PM avant publication

6. **Données en Suisse** (n°3) et **« vous gardez tout »** (n°4) : la FAQ
   « Et mes données ? » est écrite sans eux (`_sans-preuve.md` S1, S2).
7. **Durée de l'essai, délai de la démo, engagement, résiliation** (n°6) : le
   parcours est écrit sans aucune durée. La FAQ « Encore un abonnement ? » ne
   peut rien dire de la résiliation tant que ce n'est pas tranché.
8. **Branchements réels** (n°7) : aucune phrase « vous gardez WhatsApp et
   votre logiciel » sur le site ni dans le prompt (S3).
9. **Contrat du développeur** (n°5) : la phrase « il travaille avec nous sur
   chaque démo » (`studio.md` §2) en dépend (S7).
10. **Le prix** (n°1, n°8, n°9) : la section (04) est écrite pour « prix fixe,
    annoncé après la démo ». Le jour où il est fixé : montant sans « dès »,
    avec « TVA comprise », lu en base.

## C. Structure et URL (hors copy, à décider avant l'étape 5)

11. **`/services/la-vitrine`, `/le-site`, `/l-assistant`** (+ `/en/…`) :
    redirection vers `/services` (recommandé) ou 404 (`services-slug.md`).
12. **`/demonstrations`** : garder avec Leo et le relevé, ou rediriger ; dans
    les deux cas, retirer le carrousel du bar.
13. **Les composants à rendre statiques** : `Offres` (plus de lecture de la
    table `Service`, plus de badge « Recommandé »), `Faq` (6 questions, plus
    de montants), métadonnée de l'accueil (plus de `prixEntreeCents`),
    `/devis` (plus de prix), `/services` (plus de catalogue), prompt (plus de
    `${listePrix}`).
14. **Renvois de la section (01)** : `ServicesRows.tsx:143-146` envoie trois
    lignes sur `#offres` et une sur `/devis`. Les quatre vers `/devis` ?

## D. Petits arbitrages

15. **Leo ou Léo** : le code dit « Leo » (décision du 1er septembre), le PM §6
    écrit « Léo ». Une seule graphie.
16. **Le rappel promis par la clôture de Leo** (« nous revenons vers vous le
    jour ouvrable suivant pour fixer la démo ») : tenable chaque jour ouvrable ?
17. **« Dix minutes » pour le premier appel** (Méthode, FAQ, contact) : vient
    de `founder/marketing.md` §3. D'accord pour l'afficher ?
18. **Mentions légales** : remplacer la catégorie « studio de création
    digitale » par « studio genevois qui installe des assistants IA dans les
    PME » (`meta.md` §2). Texte légal : votre relecture.
19. **Images** : `public/brand/og-nawa-corps.png` et `public/brand/atelier.webp`
    montrent l'ancien métier. À refaire (gestes de métier, brand §4).
20. **Documents des agents** : `CLAUDE.md` décrit encore l'offre de site
    (« refonte en une semaine, trois formules… », « français uniquement, aucune
    infrastructure i18n ») ; `docs/agents/brand/glossaire-anglais.md` n'a pas
    les termes de la nouvelle offre (glossaire du guide §10, colonne EN).
    Chaque agent suivant relit ces fichiers en premier.

---

## Arbitrages de la session principale (24.10.2026), au nom d'Ayoub qui a demandé d'avancer sans questions

1. Titre : rotation à 4 fins (« connaît votre métier. / répond aux demandes. / relance vos clients. / prépare vos devis. »). « IA » figure dans le <title> de l'accueil (recherche « assistant IA Genève »).
2. Les autres métiers (électricité, régies, fiduciaires, agences) sont montrés comme exemples, sanitaire et chauffage en premier. Aucune promesse sur le secret professionnel des fiduciaires.
3. « Il connaît déjà votre métier » est conservé : la démo sur 3 vraies demandes, avant signature, le prouve au cas par cas.
4. /services/[slug] et /demonstrations : redirection permanente vers l'accueil (même mécanisme que FAMILLES_REGROUPEES dans next.config.ts). /services garde une page, avec les nouveaux textes. Aucun relevé de démonstration publié.
5. Données en Suisse, « vous gardez tout », durées, branchements : non affichés tant que product-marketing ne les confirme pas.

## Arbitrages de la session principale après la revue A, tour 1 (24.10.2026)

- B1 (le contrôle) : l'assistant ne s'engage jamais à la place du patron. Aucun prix, aucune date, aucun devis, aucune réponse de fond ne part sans son accord. Seule exception : un accusé de réception que le patron a relu et validé une fois pour toutes (« Bien reçu, pouvez-vous m'envoyer l'adresse, une photo et l'urgence ? ») part tout seul. Formulation publique : « Il ne s'engage jamais à votre place. »
- B2 : retirer toute mention du développeur.
- M2 : le titre tourne sur « connaît votre métier. / répond à vos clients. / prépare vos devis. / attend votre accord. » (≤ 21 caractères par ligne).
- « Dix minutes » → « un appel court ».
- Le prix fixe est annoncé à la fin de la démo, donc avant l'essai : l'écrire.
- L'ancien slogan « L'essentiel. Bien conçu. » sort du pied de page.

## Décision d'Ayoub (24.10.2026, après le panel)

- Mise en place : 1'500.– CHF TVA comprise (lu en base, table Service). Abonnement mensuel selon le volume, annoncé à la fin de la démo, non affiché.
- Données hébergées en Suisse, conformes à la nLPD : à écrire sur le site (FAQ données, section contrôle, /services, prompt).
- G2 : la décision d'Ayoub vaut GO ; passage direct à l'implémentation après la revue A tour 2.

## Arbitrages après la revue A tour 2 (session principale)

- B1 / M1 : les pages légales (confidentialité, mentions légales) NE SONT PAS modifiées ; copy/confidentialite.md et copy/mentions-legales.md ne s'appliquent pas.
- M2 : formule bornée « Les données de votre assistant sont hébergées en Suisse » ; « traitées selon la nLPD » (pas « conforme »). Une note discrète dans la fenêtre de Leo dit que ses échanges passent par un fournisseur d'IA hors de Suisse.
- La promesse « hébergées en Suisse » engage le produit livré : Ayoub doit utiliser un hébergement et un modèle en Suisse pour l'assistant des clients.
- Base : ajout d'une ligne Service « mise en place » 1'500.– ; les anciennes formules restent en base mais ne sont plus lues par le site.
- TVA : « TVA comprise » conservée (règle du dépôt).
