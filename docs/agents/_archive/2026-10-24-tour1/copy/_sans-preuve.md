# Affirmations retirées ou tenues hors du site faute de preuve (24.10.2026)

> Règle : `docs/agents/brand/voice-guide.md` §7. Toute affirmation absente de
> `.agents/product-marketing.md` (PM) ou de la veille, ou marquée « à
> confirmer », est reformulée en fait vérifiable ou supprimée. Version
> précédente (ancienne offre) archivée :
> `docs/agents/_archive/2026-10-24/copy/_sans-preuve.md`.
> Chaque ligne dit ce qu'il faudrait pour la réintroduire.

**12 affirmations retirées ou tenues dehors** (S1 à S12), plus 2 signalements
(S13, S14).

| # | Affirmation | Où elle était ou aurait été | Pourquoi dehors | Pour la réintroduire |
|---|---|---|---|---|
| S1 | « Vos données restent en Suisse. » | Promesse n°2 de `founder/offre-agent-metier.md` ; FAQ données (`accueil.md` §J Q2) ; prompt | PM §1 « à confirmer », §10 n°3. Le site lui-même est hébergé à Francfort et son assistant passe par un fournisseur d'IA hors de Suisse (`confidentialite/page.tsx:81-82`). | Hébergement et fournisseur du modèle choisis en Suisse, écrits au PM §1 ; relecture juridique (nLPD). Phrase prête : « Vos données restent en Suisse. » |
| S2 | « Si vous arrêtez, vous gardez tout. » | Promesse n°2 de l'offre ; FAQ données | PM §1, §10 n°4 : « tout » n'est pas défini. | Liste écrite de ce que garde le client (historique, textes, réglages), tenue par le contrat avec le développeur (§10 n°5). |
| S3 | « Vous gardez WhatsApp et votre logiciel. L'assistant s'y ajoute. » | Accroche 10 de `founder/marketing.md` ; objection « J'ai déjà WhatsApp » | PM §5 conditions et §10 n°7 : à confirmer techniquement, outil par outil. | Liste des branchements testés (WhatsApp, bexio, Abacus, e-mail), écrite au PM. |
| S4 | Tout montant, « dès », « à partir de », « TVA comprise », « Recommandé » | `Offres.tsx`, `Faq.tsx`, `page.tsx:48`, `en/page.tsx:136`, `services/**`, `devis/page.tsx`, prompt (`${listePrix}`) | PM §5 « Aucun montant n'est affiché » ; §10 n°1, n°8, n°9. Les montants en base sont ceux de l'ancienne offre. | Prix fixé avec `/founder-cfo`, inscrit en base et au PM, assujettissement TVA tranché ; affiché sans « dès », avec « TVA comprise ». |
| S5 | Une durée d'essai, un délai de démo, une durée d'engagement, « sans engagement », « résiliable » | Ancien `specSuiviValeur` « Sans engagement » ; ancien `etape04Texte` | PM §3, §5 conditions, §10 n°6. | Décisions écrites au PM §5 ; délai en jours ou semaines, jamais en heures. |
| S6 | « Plus aucune demande perdue (pendant vos chantiers). » | `fr.ts:306` (sortie du hero), `opengraph-image.tsx:62`, phrase d'appel sanitaire (« Plus aucune demande sans réponse ») | Résultat que personne ne mesure encore ; brand §2 écarte le slogan de résultat pour ce motif. La phrase d'appel est réservée au téléphone (PM §5 bis). | Un relevé réel montrant que les demandes reçues ont toutes eu une réponse, avec l'accord du client. |
| S7 | « Il travaille avec nous sur chaque démo » (le développeur) | `studio.md` §2, paragraphe 2 | Dépend du contrat du développeur (PM §10 n°5). | Contrat signé. Repli immédiat : retirer la phrase, garder « Un développeur spécialisé en IA construit l'assistant. » |
| S8 | « Réponse automatique », « répond à votre place jour et nuit », « 24/7 », « relance seul » | `fr.ts:342` (bande), `lib/formules.ts:424-436`, `:444` | Contredit « rien ne part sans vous » (PM §1) ; PM §8 bannit « sans intervention ». | Jamais sous cette forme. |
| S9 | « Beaucoup de devis restent sans réponse. » | `fr.ts:388` (`corps04`) | Affirmation de marché sans source dans PM ni veille. | Une source chiffrée (étude, relevé client), citée avec sa date. |
| S10 | Places limitées, « nous menons N essais à la fois » | Proposé par `founder/marketing.md` §6 sous condition | PM §10 n°11 : limite non décidée. Rareté fabriquée refusée (PM §8). | N décidé et écrit au PM. |
| S11 | « L'assistant tourne sur ce site : c'est le produit, pas une démonstration. » | `lib/formules.ts:485`, `studio/page.tsx:541-557`, `demonstrations/page.tsx:170-182` | C'était vrai de l'ancienne formule L'Assistant. Leo n'est pas le produit vendu aujourd'hui : c'est une démonstration (PM §6). | Jamais. Leo reste « l'assistant de démonstration ». |
| S12 | « Conforme à la nLPD » | Objection « Mes données ? » (`founder/marketing.md` §2) | Aucune vérification juridique ; `founder/marketing.md` : « Pas de conseil juridique : LCD et nLPD à faire relire. » | Avis juridique écrit, puis phrase factuelle sur ce qui est fait. |
| S13 *(signalement)* | « Il connaît déjà votre métier » / « il sait déjà ce qu'est un bon de régie » | h1, sous-titre, `accueil.md` §F 01 | **Gardé** : PM §1 et §6 classent la base métier en fait vérifiable. Mais la base sanitaire doit exister à la mise en ligne (J0 = 9.11.2026, `founder/marketing.md` §6). | Confirmer qu'elle existe avant publication ; sinon, écrire « réglé sur votre métier » sans « déjà ». |
| S14 *(signalement)* | Les citations de patrons de la recherche (« On n'a même plus le temps de travailler », etc.) | `founder/research/vraies-voix-patrons.md` | Jamais citées sur le site : ce sont des voix de recherche, pas des clients, et aucune n'est romande (PM §6). | Deux phrases d'un vrai client genevois, avec son accord écrit (PM §6, « Le trou à combler », n°3). |
