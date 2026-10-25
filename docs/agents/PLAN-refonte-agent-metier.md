# Plan — refonte du site : « L'assistant qui connaît déjà votre métier »

24 oct. 2026. La session principale orchestre et vérifie. Chaque étape est confiée à un sous-agent, qui écrit sur disque et rend un rapport.

## Sources de l'offre (déjà décidées, à ne pas réinventer)

- `founder/offre-agent-metier.md` : l'offre, les promesses, la garantie, les déclinaisons par métier.
- `founder/board.md` (séance 9) : premier métier, sanitaires et chauffagistes genevois ; agent unique à trancher par 10 appels.
- `founder/research/` : `agences-ia-positionnement.md` (les meilleures agences, la base d'inspiration), `vraies-voix-patrons.md`, `acces-metiers-geneve.md`, `douleurs-*.md`.

## Décisions de la session principale

1. **Le design reste** : les polices, les couleurs, le noyau 3D, les animations, le défilement et la rotation du titre. On change le contenu, l'ordre et le rôle des sections, pas l'identité visuelle.
2. **Aucun prix affiché pour l'instant.** Le prix du nouvel abonnement n'est pas fixé. La table `Service` (prod Neon) n'est pas modifiée sans accord explicite. La section des offres présente le parcours (démo → essai → abonnement) sans montant.
3. **Le site est général** (PME genevoises). Les exemples mettent en avant le premier métier (sanitaire et chauffage) sans fermer la porte aux autres.
4. **Aucune fausse preuve** : pas de client, d'avis ni de chiffre inventés (LCD art. 3). On ne cite que ce qui est vrai : le studio genevois, le dev expert IA, la base métier, la démo sur vraies demandes, les données en Suisse (à confirmer avant publication).
5. **FR et EN en miroir**, via `lib/dictionnaires/`.
6. **Aucun git, aucun déploiement, aucune écriture en base.**

## Les étapes

| # | Étape | Sous-agent | Skills | Livrable |
|---|---|---|---|---|
| 1 | Positionnement et marque | general-purpose | founder-brand, founder-marketing, marketing-psychology | `.agents/product-marketing.md` réécrit, `founder/brand.md`, `founder/marketing.md` |
| 2 | Voix et textes de tout le site (propose) | copy-positionnement | marketing-psychology, ai-seo, anti-vibecode | `docs/agents/brand/voice-guide.md`, `docs/agents/copy/*.md` |
| 3 | Revue persuasion | psy-persuasion (revue A) | marketing-psychology | `docs/agents/reviews/psy-A-agent-metier-tour1.md` |
| 4 | Porte G2 | boss-decision | — | `docs/agents/reviews/boss-G2-agent-metier.md` |
| 5 | Implémentation (textes, sections, métadonnées, SEO IA, chatbot) | general-purpose | anti-vibecode, ai-seo | fichiers du site |
| 6 | Revue de code | revue-code (audit) | — | `docs/agents/reviews/code-agent-metier.md` |
| 7 | Vérification | session principale | — | lint, typecheck, build, contrôle navigateur à 390 et 1440 px |

Deux tours au maximum par revue. Au-delà, la décision revient à Ayoub.
