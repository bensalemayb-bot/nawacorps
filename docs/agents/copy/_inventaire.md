# Inventaire des textes visibles — site Nawa Corps

> Relevé le 2026-08-30. Mode `propose` : aucun fichier du site n'est modifié.
> Balayage : `app/(site)/**`, `components/**`, `lib/site.ts`, `prisma/seed.ts`.
> **Aucun fichier i18n** (`*.json`, `*.po`, `*.yml`, `*.yaml`) n'existe :
> l'intégralité des chaînes est écrite en dur dans le JSX (CLAUDE.md, §Langues).
> Le back-office `/admin` est hors périmètre — il n'est pas public.

**Périmètre : 3 pages** (`/`, `/mentions-legales`, `/confidentialite`) + le
chrome partagé (nav, menu, loader, assistant), rendu par
`app/(site)/layout.tsx` sur les trois routes.

**112 textes visibles relevés · 68 signalés · 44 conformes, laissés tels quels.**

Priorité : **haute** = contredit une réserve de la porte G1, une règle du
positionnement ou le droit (LCD art. 3) · **moyenne** = affaiblit la promesse ou
sort du glossaire · **basse** = confort de lecture.

---

## Légende des problèmes

| Code | Problème |
|---|---|
| `B1` | superlatif de marché / affirmation sur les concurrents |
| `B2` | concurrent nommé ou reconnaissable en creux |
| `B3` | « 72 h » voyage seul, sans point de départ ni livrable |
| `B4` | « interlocuteur unique » ou variante reconnaissable |
| `B6` | ligne de justification de prix (interdite avant décision Boualem) |
| `PRV` | affirmation sans preuve dans le positionnement ni la veille |
| `SAT` | terme saturé chez 3 concurrents ou plus |
| `GLO` | sort du glossaire du guide de voix |
| `DER` | tourne en dérision le « avant » du client (positionnement §8) |
| `FIC` | référence, chiffre ou entreprise fictive (LCD art. 3) |
| `LNG` | contrainte de longueur (h1 21 car., H1 10 mots, § 60 mots) |
| `TON` | hors ton |
| `DBL` | doublon ou incohérence entre deux endroits du site |

---

## 1. Métadonnées — toutes les pages

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| Toutes | title par défaut | `app/(site)/layout.tsx:55` | Refonte de site pour PME à Genève — livré en 72 h | — conforme (mot-clé + livrable dans la même unité) | — |
| Toutes | title template | `app/(site)/layout.tsx:56` | `%s — Nawa Corps` | — conforme | — |
| / | meta description | `app/(site)/layout.tsx:59` | Nawa Corps refait le site des PME genevoises en 72 heures : demande de devis… Dès 699.–, TVA comprise. | — conforme | — |
| / | og:title | `app/(site)/layout.tsx:66` | Refonte de site pour PME à Genève — livré en 72 h | — conforme | — |
| / | og:description | `app/(site)/layout.tsx:68` | **Votre site a dix ans.** En 72 heures il reçoit les demandes… | `PRV` affirme l'âge du site du lecteur ; `DBL` doit suivre le nouveau hero | haute |
| / | twitter:title | `app/(site)/layout.tsx:72` | idem og:title | — conforme | — |
| / | twitter:description | `app/(site)/layout.tsx:74` | idem og:description | `PRV` `DBL` | haute |
| /mentions-legales | title / description / og | `app/(site)/mentions-legales/page.tsx:34-46` | Mentions légales… | — conforme | — |
| /confidentialite | title / description / og | `app/(site)/confidentialite/page.tsx:21-30` | Confidentialité… | — conforme | — |

## 2. Chrome partagé — nav, menu, loader, assistant

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| Toutes | nav, wordmark alt | `components/Nav.tsx:52` | Nawa Corps | — conforme | — |
| Toutes | nav, horloge | `components/Nav.tsx:57` | Genève — 00:00 | — conforme | — |
| Toutes | nav, liens | `components/Nav.tsx:59-61` | Travaux · Services · Offres | `GLO` « Travaux » annonce des réalisations clientes, il n'en existe aucune | haute |
| Toutes | nav, pastille CTA | `components/Nav.tsx:62` | **Parlons-en** | `GLO` CTA sans verbe d'action ni bénéfice (guide §7) | moyenne |
| Toutes | nav, bouton menu | `components/Nav.tsx:63` | Ouvrir le menu (aria-label) | — conforme | — |
| Toutes | menu plein écran | `components/MenuOverlay.tsx:13-17` | (01) Travaux … (05) Contact | `GLO` même remarque que la nav | haute |
| Toutes | menu, pied | `components/MenuOverlay.tsx:20-23` | WhatsApp · e-mail · Genève, Suisse | — conforme | — |
| Toutes | loader | `components/Loader.tsx:39` | Studio digital — Genève | — conforme | — |
| Toutes | assistant, en-tête | `components/ChatWidget.tsx:180` | Assistant Nawa Corps | — conforme | — |
| Toutes | assistant, sous-titre | `components/ChatWidget.tsx:181` | **Réponse d'Ayoub sous 24 h** | `PRV` délai de réponse absent du positionnement | haute |
| Toutes | assistant, accueil | `components/ChatWidget.tsx:35-36` | Bonjour. Je prépare votre proposition avec Ayoub. Quel est votre métier, et avez-vous déjà un site en ligne ? | — conforme, et qualifie sur le signal ICP | — |
| Toutes | assistant, note nLPD | `components/ChatWidget.tsx:194-195` | Conversation enregistrée pour traiter votre demande — voir /confidentialite | — conforme | — |
| Toutes | assistant, panne | `components/ChatWidget.tsx:216-218` | Assistant indisponible — utilisez le formulaire juste en dessous ou WhatsApp. | — conforme | — |

## 3. Accueil — hero (Le noyau), 4 temps

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| / | kicker | `components/NoyauHero.tsx:29-31` | ® Studio digital indépendant · Genève, Suisse · Sites de PME | — conforme | — |
| / | **h1 ligne 1** | `components/NoyauHero.tsx:39` | **Votre site a dix ans.** | `PRV` affirmation sur le lecteur (l'ICP est « plus de cinq ans ») ; `DER` frôle le reproche ; **rejeté par Boualem** | **haute** |
| / | **h1 ligne 2** | `components/NoyauHero.tsx:40` | **En 72 heures, il** | `B3` le délai n'a ni point de départ ni livrable dans le h1 | **haute** |
| / | **h1 ligne 3** | `components/NoyauHero.tsx:41` | **travaille pour vous.** | `TON` abstrait, ne dit pas ce qui entre | **haute** |
| / | sous-titre hero | `components/NoyauHero.tsx:44` | Sites de PME à Genève : demande de devis… Dès 699.–, TVA comprise. | `DBL` doit suivre le h1 retenu ; le point de départ manque | haute |
| / | CTA hero 1 | `components/NoyauHero.tsx:46` | Faire refaire mon site → | — conforme | — |
| / | CTA hero 2 | `components/NoyauHero.tsx:47` | **Voir les avant / après** | `FIC` renvoie vers des pièces sans client réel derrière | haute |
| / | indicateur de scroll | `components/NoyauHero.tsx:49` | Défiler | — conforme | — |
| / | temps 2, étiquette | `components/NoyauHero.tsx:58` | (001) **Le noyau** | `GLO` jargon interne, ne dit rien à l'ICP | moyenne |
| / | temps 2, phrase | `components/NoyauHero.tsx:60` | Il reçoit les demandes, chiffre les devis, prend les rendez-vous — sans que vous y touchiez. | `PRV` promet les trois fonctions sans dire à quel palier | moyenne |
| / | temps 3, étiquette | `components/NoyauHero.tsx:70` | (002) **Le cœur** | `GLO` jargon interne | moyenne |
| / | temps 3, chiffre géant | `components/NoyauHero.tsx:73-74` | **72 / heures** | `B3` le chiffre le plus visible du site est isolé | **haute** |
| / | temps 3, spécifications | `components/NoyauHero.tsx:77-80` | Atelier Genève · Refonte 72 heures · Départ de zéro Une semaine · Suivi dès 49.–/mois | `B3` aucune ligne ne donne le point de départ ; `GLO` « Atelier » hors glossaire | haute |
| / | temps 4, sortie | `components/NoyauHero.tsx:90` | Un site ne se regarde pas. Il travaille, **ou il ne sert à rien.** | `DER` juge le site actuel du lecteur | moyenne |
| / | temps 4, CTA | `components/NoyauHero.tsx:91` | Voir les avant / après → | `FIC` idem CTA hero 2 | haute |

## 4. Accueil — section Travaux (carrousel)

> **Le bloc le plus exposé du site.** Les cinq pièces sont construites autour
> d'un établissement inventé, « Le Comptoir », avec raison sociale, adresse,
> année de fondation, téléphone et compteur de visiteurs. Le positionnement le
> classe explicitement « client fictif inventé — à retirer » (§6). Quatre pièces
> sur cinq relèvent en outre de la ligne restauration, hors ICP.

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| / | étiquette de section | `components/Travaux.tsx:18` | (01) **Travaux** | `GLO` « travaux » = réalisations clientes ; il y en a zéro | **haute** |
| / | h2 | `components/Travaux.tsx:20` | Tout a un avant. Voici les après. | — conforme sur le fond, à raccrocher au nouveau nom de section | moyenne |
| / | chapô | `components/Travaux.tsx:23` | Cinq démonstrations du studio — glissez la poignée… | — honnête ; à rendre plus explicite (guide §8.1) | moyenne |
| / | étiquettes comparateur | `components/ui/feature-carousel.tsx:180-181` | Avant / Après | — conforme | — |
| / | pièce 1, libellé + texte | `components/ui/feature-carousel.tsx:377-378` | La carte — Une carte qui a bien servi, remise à plat… | hors ICP (restauration) | moyenne |
| / | pièce 2, libellé + texte | `components/ui/feature-carousel.tsx:384-385` | Le site — Un site de 2009 refait en 72 heures… | `B3` le seul élément on-ICP, et son 72 h voyage seul | **haute** |
| / | pièce 3, libellé + texte | `components/ui/feature-carousel.tsx:391-392` | La carte de visite — 85 × 55 recto-verso… | — conforme (prestation « en complément » réelle) | basse |
| / | pièce 4, libellé + texte | `components/ui/feature-carousel.tsx:398-399` | L'affiche — La même annonce, redessinée… | hors ICP (restauration) | moyenne |
| / | pièce 5, libellé + texte | `components/ui/feature-carousel.tsx:405-406` | La fidélité — La carte à tampons remise au propre… | hors ICP (restauration) | moyenne |
| / | pièce « après » menu | `feature-carousel.tsx:215-226` | **Le Comptoir** · Bar — Genève · **Maison fondée en 1987** · **Rue des Étuves** | `FIC` entreprise, adresse et ancienneté inventées | **haute** |
| / | pièce « après » site | `feature-carousel.tsx:239-247` | Bar — Genève · **depuis 1987** · Rue des Étuves 12 | `FIC` | **haute** |
| / | pièce « après » carte de visite | `feature-carousel.tsx:256-269` | Nawa Corps · Ayoub · N° 001 · **nawacorps.ch** · tél. et e-mail de `lib/site.ts` | coordonnées non confirmées affichées en grand (`NAP_CONFIRME=false`) | haute |
| / | pièce « après » affiche | `feature-carousel.tsx:276-280` | **Le Comptoir** — Genève · Soirée JAZZ · **Jeudi 12 décembre** · Rue des Étuves 12 | `FIC` | **haute** |
| / | pièce « après » fidélité | `feature-carousel.tsx:286-287` | Carte fidélité · **Le Comptoir** | `FIC` | **haute** |
| / | pièce « avant » menu | `feature-carousel.tsx:302-310` | **Le Comptoir** · BIERE PRESSION 5.- … | `FIC` `DER` | **haute** |
| / | pièce « avant » site | `feature-carousel.tsx:318-327` | Le Comptoir - Microsoft Internet Explorer · **Bienvenue sur le site du Comptoir !!** · **NOUVEAU : soirée jazz le jeudi !!!** · **Vous êtes le visiteur n° 000482** · Site optimisé pour Internet Explorer 6 | `FIC` `DER` — c'est exactement le site du prospect, tourné en dérision | **haute** |
| / | pièce « avant » carte de visite | `feature-carousel.tsx:334-337` | LE COMPTOIR · Bar - Ambiance - Billard · **Tél : 022 000 00 00 / Fax : 022 000 00 01** | `FIC` `DER` | **haute** |
| / | pièce « avant » affiche | `feature-carousel.tsx:344-346` | **JAZZ !!!** · ENTREE LIBRE | `FIC` `DER` | **haute** |
| / | pièce « avant » fidélité | `feature-carousel.tsx:353` | CARTE DE FIDELITE | `FIC` | haute |

## 5. Accueil — bande défilante et Services

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| / | bande défilante | `components/Strip.tsx:12-13` | Refonte de site · Demande de devis · Prise de rendez-vous · Fiche Google · **72 heures** · Genève | `B3` le jeton « 72 heures » est seul entre deux autres | moyenne |
| / | étiquette de section | `components/ServicesRows.tsx:21` | (02) Services | — conforme | — |
| / | **h2** | `components/ServicesRows.tsx:22` | Six gestes, **un seul interlocuteur.** | **`B4`** variante reconnaissable d'un terme occupé par un acteur du panel | **haute** |
| / | 01 Refonte de site | `components/ServicesRows.tsx:26-27` | Votre site actuel, repris et refait… Livré en 72 heures, deux allers-retours compris. | `B3` le point de départ manque ; sinon excellent | moyenne |
| / | 02 Demande de devis | `components/ServicesRows.tsx:30-31` | Un formulaire qui pose les bonnes questions… Sur les formules qui l'incluent, le visiteur repart avec une estimation chiffrée immédiate. | `GLO` « estimation chiffrée » ≠ glossaire (« devis chiffré ») | moyenne |
| / | 03 Prise de rendez-vous | `components/ServicesRows.tsx:34-35` | Vos créneaux en ligne, **synchronisés avec votre agenda**… | `PRV` la synchronisation d'agenda n'est nulle part dans l'offre | haute |
| / | 04 Assistant & relances | `components/ServicesRows.tsx:38-39` | Un assistant formé sur vos prestations… Les demandes restées sans réponse sont relancées seules. | `PRV` promesse sans palier — c'est L'Assistant uniquement | haute |
| / | 05 Fiche Google & avis | `components/ServicesRows.tsx:42-43` | Fiche complétée : photos, horaires exacts… | `PRV` « réponses aux avis » n'est pas dans l'offre | moyenne |
| / | 06 Identité & photos | `components/ServicesRows.tsx:46-47` | Un logotype propre si vous n'en avez pas… | `PRV` prestation « sur devis », pas comprise — à dire | moyenne |

## 6. Accueil — Offres et Carte du studio

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| / | étiquette de section | `components/Offres.tsx:112` | (03) Offres | — conforme | — |
| / | **h2** | `components/Offres.tsx:113` | **Des prix clairs, tout compris.** | `SAT` « prix clairs » + « sans frais cachés » plus bas = la promesse d'accueil entière d'un acteur du panel | **haute** |
| / | badge | `components/Offres.tsx:123` | Recommandé | — conforme | — |
| / | La Vitrine, puces | `components/Offres.tsx:50-53` | Une page, lisible sur téléphone · Formulaire de demande qui fonctionne · Appel, itinéraire et horaires en un geste · Domaine et hébergement la 1ʳᵉ année | — conforme | — |
| / | La Vitrine, CTA | `components/Offres.tsx:55` | Refaire mon site | — conforme | — |
| / | Le Site, puces | `components/Offres.tsx:63-66` | Tout La Vitrine, plus : · Prise de rendez-vous en ligne · Devis chiffré automatiquement · Fiche Google et photos comprises | — conforme | — |
| / | Le Site, CTA | `components/Offres.tsx:68` | **Lancer mon site** | `GLO` « lancer » ne dit pas le bénéfice du palier | moyenne |
| / | L'Assistant, puces | `components/Offres.tsx:76-79` | Tout Le Site, plus : · L'assistant de ce site, sur le vôtre · Alerte sur votre téléphone à chaque demande · Relance automatique et tableau de bord | — conforme, et démontrable en direct | — |
| / | L'Assistant, CTA | `components/Offres.tsx:81` | Automatiser mes demandes | — conforme | — |
| / | note de prix 1 | `components/Offres.tsx:170` | Prix en francs suisses, TVA comprise, **sans frais cachés.** | `SAT` | haute |
| / | note de prix 2 | `components/Offres.tsx:171` | Suivi et hébergement dès 49.–/mois, à partir de la 2ᵉ année. | — conforme ; **montant en dur** (voir points ouverts) | moyenne |
| / | ligne « sur devis » | `components/Offres.tsx:162,93` | `<nom> — sur devis` + Demander un devis → | — conforme | — |
| / | carte, h2 | `components/CarteDuStudio.tsx:99` | La carte du studio | — conforme | — |
| / | carte, chapô | `components/CarteDuStudio.tsx:101` | Votre site en ligne, le studio reste à disposition — à la carte, **sans engagement.** | `SAT` terme relevé chez un acteur, et vague | moyenne |
| / | carte, libellés de groupe | `components/CarteDuStudio.tsx:35-38` | Les formules · En complément · En continu · Pour la restauration | — conforme | — |
| / | carte, note restauration | `components/CarteDuStudio.tsx:113` | La ligne restauration reste ouverte… pour les établissements déjà suivis par le studio. | — conforme (§5, règle des 300.–) | basse |
| / | carte, pied | `components/CarteDuStudio.tsx:117` | Prix indicatifs, TVA comprise — **devis en cinq minutes.** | `PRV` délai inventé | **haute** |
| / | carte, CTA | `components/CarteDuStudio.tsx:119` | Demander un devis → | — conforme | — |
| / | intitulés des prestations | `prisma/seed.ts:31-226` | 17 lignes de service (nom + description) | voir §10 ci-dessous | moyenne |

## 7. Accueil — Méthode, Le studio, Questions

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| / | étiquette de section | `components/Methode.tsx:11` | (04) Méthode | — conforme | — |
| / | **h2** | `components/Methode.tsx:12` | **Du premier appel** à la mise en ligne : 72 heures. | `DBL` contredit la FAQ (« le délai court dès votre feu vert ») et fait démarrer le compteur avant l'état des lieux | **haute** |
| / | étape 01 | `components/Methode.tsx:15` | 30 min — L'état des lieux… | — conforme | — |
| / | étape 02 | `components/Methode.tsx:16` | 24 h — La maquette… deux allers-retours sont compris. | — conforme | — |
| / | étape 03 | `components/Methode.tsx:17` | 72 h — La mise en ligne… | `DBL` le paiement précède la mise en ligne (§5) et n'est pas dit | moyenne |
| / | étape 04 | `components/Methode.tsx:18` | Ensuite — Le suivi… **c'est corrigé dans la journée.** | `PRV` délai de correction absent du positionnement | haute |
| / | étiquette de section | `components/Studio.tsx:10` | (05) Le studio | — conforme | — |
| / | citation | `components/Studio.tsx:14` | « Vous parlez à celui qui *fait* le travail. » | — conforme, **à garder mot pour mot** (§8) | — |
| / | paragraphe 1 | `components/Studio.tsx:16` | Nawa Corps est le studio d'Ayoub… la personne qui répond à votre message est celle qui dessine et construit votre site. | — conforme | — |
| / | **paragraphe 2** | `components/Studio.tsx:17` | **Si les prix sont ceux-là, c'est la structure qui l'explique**, pas le travail : pas de bureaux, pas d'équipe commerciale… | **`B6`** défense de prix, interdite avant la décision de Boualem | **haute** |
| / | faits | `components/Studio.tsx:19-21` | Genève / Basé ici · **72 h / Refonte livrée** · FR / EN / Langues | `B3` le 72 h est seul dans sa case | moyenne |
| / | étiquette de section | `components/Faq.tsx:58` | (06) Questions | — conforme | — |
| / | Q1 | `components/Faq.tsx:18-19` | 72 heures, vraiment ? — … le délai court dès votre feu vert, pas dès que vous m'avez envoyé quelque chose. | — **la meilleure réponse du site**, à remonter en haut de page | — |
| / | Q2 | `components/Faq.tsx:22-23` | Je n'ai ni textes ni photos. C'est bloquant ? | — conforme | — |
| / | Q3 | `components/Faq.tsx:26-27` | Qui gère l'hébergement et le nom de domaine ? | — conforme ; **montants en dur** (points ouverts) | moyenne |
| / | Q4 | `components/Faq.tsx:30-31` | Et si je veux changer quelque chose après ? … **c'est corrigé dans la journée.** | `PRV` `DBL` même délai non sourcé qu'en Méthode 04 | haute |
| / | **Q5** | `components/Faq.tsx:34-35` | **Pourquoi moins cher qu'une agence ?** … et il est livré en **trois jours au lieu de trois mois.** | **`B6`** défense de prix · **`B1`** affirme le délai des agences · `GLO` « trois jours » ≠ « 72 heures » | **haute** |
| / | JSON-LD FAQPage | `components/Faq.tsx:39-47` | reprend les 5 Q/R | suit automatiquement les corrections ci-dessus | — |

## 8. Accueil — pied de page Contact

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| / | étiquette | `components/FooterContact.tsx:29` | (07) Contact | — conforme | — |
| / | h2 | `components/FooterContact.tsx:30` | Montrez-moi votre site. Je vous dis ce qu'il lui manque. | — conforme, **la meilleure accroche du site** | — |
| / | CTA WhatsApp | `components/FooterContact.tsx:32` | Écrire sur WhatsApp → | — conforme | — |
| / | CTA e-mail | `components/FooterContact.tsx:34` | hello@nawacorps.ch | adresse non confirmée (points ouverts) | moyenne |
| / | amorce du formulaire | `components/FooterContact.tsx:41` | ou laissez-moi l'adresse de votre site | — conforme | — |
| / | champs du formulaire | `components/ContactForm.tsx:99,108,117` | Votre nom · Votre téléphone · Votre site actuel, votre besoin | — conforme | — |
| / | bouton | `components/ContactForm.tsx:128` | Envoyer → | `GLO` verbe sans bénéfice | basse |
| / | accusé de réception | `components/ContactForm.tsx:69` | Message reçu — **réponse sous 24 h.** | `PRV` `DBL` même promesse non sourcée que l'assistant | **haute** |
| / | message d'erreur | `components/ContactForm.tsx:79,84` | Envoi impossible… Écrivez-**nous** sur WhatsApp | `TON` « nous » alors que tout le site dit « je » | basse |
| / | colonnes | `components/FooterContact.tsx:45-48` | Genève, Suisse · téléphone · Lu–Sa · 9h–19h · © 2026 Nawa Corps | téléphone et horaires non confirmés (`NAP_CONFIRME=false`) | moyenne |
| / | signature géante | `components/FooterContact.tsx:51` | NAWA CORPS | — conforme | — |
| / | slogan | `components/FooterContact.tsx:57` | L'essentiel. Bien conçu. | — conforme, **un seul endroit du site** (§8) | — |
| / | bande légale | `components/FooterContact.tsx:59-62` | Studio digital — Genève · Sites · Devis · Rendez-vous · Mentions légales · Confidentialité | — conforme | — |

## 9. Pages légales

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| /mentions-legales | h1 + corps | `app/(site)/mentions-legales/page.tsx:52-60+` | Mentions légales · Éditeur · Hébergement… | **`[PRÉNOM NOM — À COMPLÉTER]`, `[Infomaniak, Suisse — à confirmer]`** visibles en production | haute |
| /confidentialite | h1 + corps | `app/(site)/confidentialite/page.tsx:36-45+` | Confidentialité · Données collectées · Finalité… | le docblock annonce que formulaire et assistant « n'existent pas encore » — ils existent | moyenne |

## 10. Base de données — libellés lus par Offres, CarteDuStudio et l'assistant

> `prisma/seed.ts` → table `Service`. Ce sont des **valeurs de texte**, pas de la
> structure : elles relèvent de ce guide au même titre que le JSX.

| Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|
| La Vitrine | `prisma/seed.ts:32-33` | Votre site refait proprement, lisible sur téléphone, avec un formulaire qui fonctionne. | — conforme | — |
| Le Site | `prisma/seed.ts:43-44` | Le site qui reçoit les demandes, prend les rendez-vous et chiffre les devis. | — conforme | — |
| L'Assistant | `prisma/seed.ts:54-55` | Le site qui répond, qualifie et relance à votre place, jour et nuit. | — conforme | — |
| Site multi-pages | `prisma/seed.ts:65` | Site multi-pages / **sur-mesure** | `SAT` terme saturé (4/6) et interdit par la définition de rôle | haute |
| Suivi & hébergement | `prisma/seed.ts:78-79` | Hébergement, domaine, mises à jour, sauvegardes — dès la 2ᵉ année | — conforme | — |
| Suivi avec assistant | `prisma/seed.ts:89-90` | Idem, plus l'assistant et vos modifications de contenu | — conforme | — |
| Réseaux sociaux | `prisma/seed.ts:100-101` | Préparées et programmées pour vous | `PRV` ne dit pas que la production est faite avec le partenaire (§7) | moyenne |
| Traduction FR / EN | `prisma/seed.ts:146-147` | Genève travaille en deux langues | — conforme | — |
| 9 autres lignes | `prisma/seed.ts:113-226` | cartes de visite, photos, identité, ligne restauration | — conformes | — |

---

## Points ouverts d'inventaire — hors périmètre du copy

1. **Prix écrits en dur dans le texte.** `NoyauHero.tsx:44` (« Dès 699.– »),
   `NoyauHero.tsx:80` (« dès 49.–/mois »), `Offres.tsx:171` (« 49.–/mois »),
   `Faq.tsx:27` (« 49.–/mois », « 129.–/mois »). CLAUDE.md pose que les prix
   viennent de Postgres et que les corriger en base les corrige partout. Ces
   cinq occurrences échappent à la règle : un changement de tarif laisserait le
   site en contradiction avec lui-même. **Décision d'implémentation, pas de
   copy** — signalée à `revue-code`.
2. **Coordonnées non confirmées.** `NAP_CONFIRME = false` (`lib/site.ts:42`) :
   téléphone, e-mail et horaires affichés sont des valeurs de remplacement, y
   compris en grand sur la carte de visite du carrousel.
3. **Contradiction interne du positionnement.** §5 fixe le suivi à 49.– / 129.–,
   §10 décision n°3 le décrit comme « 89.–/mois, à confirmer ». Le site affiche
   49.–. À trancher avant l'apply.
