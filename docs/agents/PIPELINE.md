# PIPELINE — équipe de 6 sub-agents Claude Code (site & acquisition)

Un orchestrateur (la session Claude Code principale), six spécialistes, des fichiers comme seul moyen de transmission, et des portes de décision qui ne bouclent pas.

## Installation

1. Copier `.claude/agents/` à la racine du projet (fusionner si le dossier existe). Les six fichiers : `veille-concurrents.md`, `copy-positionnement.md`, `page-produit.md`, `psy-persuasion.md`, `boss-decision.md`, `revue-code.md`.
2. Copier `docs/agents/PIPELINE.md` (ce fichier). Créer `docs/agents/` s'il n'existe pas ; les agents y écrivent tout.
3. Ajouter une ligne dans CLAUDE.md : `Pipeline agents : voir docs/agents/PIPELINE.md`.
4. Si `.claude/agents/` n'existait pas avant la session, redémarrer Claude Code (les modifications ultérieures sont détectées sans redémarrage).

## Prérequis — sans eux, les agents s'arrêtent en ABORT

- CLAUDE.md décrit le projet : marché(s), offre, cible, langues, stack, commandes lint / typecheck / test / build.
- Un document de positionnement référencé dans CLAUDE.md : promesse, cible, offre, prix, preuves, ton. C'est l'entrée n°1. Les agents adaptent À ce document ; ils ne l'inventent pas.

## Les six agents

| # | Agent | Rôle en une ligne | Lit | Écrit | Touche au site ? |
|---|---|---|---|---|---|
| 1 | veille-concurrents | cartographie sourcée des concurrents (offres, prix, délais, lexique, preuves, SEO / GEO) | CLAUDE.md, web | `veille/concurrents.{json,csv,xlsx}`, `veille/synthese.md` | non |
| 2 | copy-positionnement | propriétaire de la voix : guide + réécriture de tout le site | positionnement, veille, fichiers du site | `brand/voice-guide.md`, `copy/<page>.md` | mode apply, après GO |
| 3 | page-produit | page produit orientée acquisition : structure imposée, copy final, SEO / GEO, notes d'implémentation | voice-guide, positionnement, veille | `pages/produit-<slug>.md` | mode build, après GO |
| 4 | psy-persuasion | relecture persuasion, revues A (copy) et B (page) : 8 critères, réécritures concrètes | copy/, pages/, voice-guide | `reviews/psy-*.md` | non |
| 5 | boss-decision | verdict exécutoire aux portes G1 / G2 / G3 et sur toute décision ponctuelle | tout | `reviews/boss-*.md` | non |
| 6 | revue-code | audit puis fix du code implémenté | diff, CLAUDE.md, manifestes | `reviews/code-*.md` | mode fix, sur liste approuvée |

Chemins relatifs à `docs/agents/`.

## Pipeline et portes

```
veille-concurrents
  └─ G1 boss-decision ── NO-GO ─▶ veille-concurrents (2 tours max)
copy-positionnement (propose)
  └─ revue A psy-persuasion ── À CORRIGER ─▶ copy-positionnement (2 tours max)
page-produit (spec)
  └─ revue B psy-persuasion ── À CORRIGER ─▶ page-produit (2 tours max)
G2 boss-decision ── NO-GO ─▶ agent responsable (2 tours max, puis escalade à Boualem)
  └─ GO ─▶ copy-positionnement (apply) + page-produit (build)
revue-code (audit) ─▶ Boualem approuve les correctifs ─▶ revue-code (fix)
G3 boss-decision ── GO ─▶ validation E2E manuelle par Boualem ─▶ Boualem déploie
```

Règles de boucle : deux tours maximum par revue ou par porte ; au-delà, l'agent escalade à Boualem avec un mémo (options A / B, coût, risque, recommandation). Aucun agent n'appelle un autre agent : la session principale enchaîne et transmet les chemins.

## Contrat de transmission

- Tous les artefacts vivent dans `docs/agents/` : `veille/`, `brand/`, `copy/`, `pages/`, `reviews/`, `_archive/`.
- Un sub-agent démarre avec son prompt, CLAUDE.md et le message de délégation, rien d'autre. Il lit lui-même les fichiers de l'étape précédente.
- Chaque agent termine par un RAPPORT fixe de 20 lignes max : STATUT / LIVRABLES / CHIFFRES CLÉS / POINTS OUVERTS / PROCHAINE ÉTAPE. La session principale ne conserve que ce rapport et les chemins.
- Un sub-agent ne peut pas poser de question en direct : un ABORT ou un POINT OUVERT est une question pour Boualem, à régler avant de relancer.
- Idempotence : un agent qui trouve un livrable existant au même chemin le recopie dans `_archive/<date>/` avant d'écrire. Jamais d'écrasement silencieux.

## Règles communes, rappelées dans chaque agent

1. Lire CLAUDE.md et le positionnement avant d'agir ; en leur absence, ABORT.
2. Un seul projet par run ; jamais de contexte croisé.
3. Tout fait précis est sourcé (URL, fichier:ligne, message de délégation) ; sinon « inconnu ».
4. Aucun agent ne touche git, .env, secrets, configs de prod, déploiement. Boualem est le seul à pousser.
5. Données publiques uniquement ; aucune donnée personnelle.
6. Arabe = RTL + ponctuation arabe, systématiquement.
7. Sortie = livrables sur disque + RAPPORT.

## Invocation, exemples

- `Utilise l'agent veille-concurrents : marché Suisse romande, segment PME, 6 concurrents max.`
- `@veille-concurrents` dans le message garantit que c'est bien cet agent qui tourne.
- `Utilise boss-decision pour la porte G1 sur docs/agents/veille/.`
- `Utilise copy-positionnement en mode propose sur tout le site.`
- `Utilise psy-persuasion, revue A, tour 1.`
- `Utilise copy-positionnement en mode apply : GO de boss-decision dans docs/agents/reviews/boss-G2-tour1.md.`
- `Utilise page-produit en mode build sur docs/agents/pages/produit-offre-pme.md (GO G2).`
- `Utilise revue-code en mode audit depuis la référence main.`
- `Utilise revue-code en mode fix sur les correctifs 1 à 4 de docs/agents/reviews/code-produit-2026-08-30.md.`
- Décision ponctuelle : `Utilise boss-decision : faut-il afficher les prix sur le marché DZ ou passer par devis ?`

## Test de validation avant usage réel (E2E manuel)

1. Lancer veille-concurrents avec un plafond de 2 concurrents sur un seul marché. Vérifier : les 4 fichiers existent, chaque prix et délai du JSON porte une URL, le rapport tient en 20 lignes.
2. Lancer boss-decision porte G1. Vérifier : 7 notes, 7 tests PASS / FAIL, un verdict, les deux lignes finales.
3. Lancer copy-positionnement en mode propose sur une seule page. Vérifier : voice-guide.md écrit, blocs AVANT / APRÈS / POURQUOI / PREUVE, aucun fichier du site modifié.
4. Seulement ensuite, dérouler le pipeline complet.

## Réglages optionnels (frontmatter des agents)

- `model:` `sonnet`, `opus`, `haiku`, `fable`, un identifiant complet, ou `inherit` (défaut : hérite de la session). Suggestion : boss-decision et revue-code sur le modèle le plus fort disponible, veille-concurrents sur un modèle rapide.
- `maxTurns:` borne le nombre de tours ; utile pour veille-concurrents. Au plafond, la sortie revient marquée partielle et l'agent peut être repris.
- `skills:` `[pre-flight-audit]` sur revue-code et boss-decision pour précharger ta discipline (ignoré avec un avertissement si le skill n'existe pas sous ce nom dans le projet).
- `memory: project` sur veille-concurrents ou revue-code pour capitaliser d'une session à l'autre (dossier `.claude/agent-memory/<agent>/`).

## Ce qui change par rapport au brief initial

- Agents 4 et 5 n'interviennent plus « avant chaque tâche » : deux revues fixes (A, B), trois portes (G1 à G3), deux tours max, verdict exécutoire. Sans ça, la boucle ne se ferme jamais.
- L'agent 2 possède la voix ; l'agent 3 l'applique. Une seule voix sur le site.
- L'agent 6 ne fait plus « les petites tâches » : audit et fix sur liste approuvée, le reste va à la session principale.
- Aucun agent n'écrit dans le site sans GO : propose → revue → porte → apply / build.
- Contrat de transmission par fichiers et rapport fixe : un sub-agent ne renvoie qu'un résumé, les fichiers font foi.
- Les interdits sont écrits par paires (interdit → à la place) : un modèle suit mieux un comportement attendu qu'une liste de « ne fais pas ».
