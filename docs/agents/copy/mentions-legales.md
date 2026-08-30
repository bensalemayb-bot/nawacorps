# Réécriture — page `/mentions-legales` — **tour 2**

> Mode `propose`. Aucun fichier du site n'est modifié.
> Fichier : `app/(site)/mentions-legales/page.tsx`.
> Remplace la version du tour 1, archivée dans
> `docs/agents/_archive/2026-08-30-tour1/copy/mentions-legales.md`.
> **Mot-clé cible** : *mentions légales Nawa Corps Genève*. Il est dans le
> `title`, dans la `meta description` et dans le `h1` — inchangés.
>
> **Ce qui change au tour 2 : un des trois marqueurs a sa réponse.**
> `.agents/product-marketing.md` §1 nomme désormais l'exploitant, et le nom est
> public. C'est la correction la moins chère et la plus utile du lot : la revue
> A relève que l'identité vérifiable — un nom, une adresse, un numéro, à Genève
> — est le **substitut de preuve sociale le moins cher à obtenir**, et que
> `[PRÉNOM NOM — À COMPLÉTER]` le détruisait précisément là où le prospect
> méfiant va vérifier.

---

## 1. L'éditeur — le marqueur qui tombe

- **AVANT** (`:58`) — Nawa Corps, **studio digital**, Genève, Suisse, exploité
  par **[PRÉNOM NOM — À COMPLÉTER]**
- **APRÈS** — **Nawa Corps, agence digitale, Genève, Suisse, exploitée par Ayoub
  Bensalem.**
- **POURQUOI.** Deux corrections dans une ligne. **(a)** Le nom est public :
  `.agents/product-marketing.md` §1, « Agence digitale indépendante à Genève,
  opérée par **Ayoub Bensalem** ». Ce n'est plus un placeholder, et le remplir
  n'est plus une invention. **(b)** « Studio digital » n'est plus la catégorie
  (voir `accueil.md` §I). L'accord passe au féminin avec « agence ».
- **PREUVE.** §1 du positionnement.

## 2. Les marqueurs qui restent — bloquants avant mise en ligne

| Ligne | Ce qui manque | Qui le fournit |
|---|---|---|
| `:58` | **La forme juridique**, si elle existe : raison individuelle inscrite au registre, ou Sàrl. « Exploitée par Ayoub Bensalem » suffit pour une activité en nom propre non inscrite ; au-delà, la raison sociale exacte et le numéro IDE sont attendus. | **Boualem** |
| `:58` | **L'adresse de l'éditeur.** `.agents/product-marketing.md` §1 pose « **pas de bureau** » — c'est assumé commercialement, mais une adresse de domiciliation reste attendue sur des mentions légales suisses. « Genève, Suisse » seul est une zone, pas une adresse. | **Boualem** |
| `:58` | **L'adresse de contact** : `hello@nawacorps.ch` porte encore « [à confirmer] », et `NAP_CONFIRME = false` (`lib/site.ts:42`). C'est aussi le canal d'exercice des droits annoncé par `/confidentialite`. | **Boualem** |
| `:60` | **L'hébergeur réel et son pays** : « [Infomaniak, Suisse — à confirmer en B12] ». | **Boualem** |

- **POURQUOI ce n'est pas du copy.** Le commentaire du fichier le dit, et il a
  raison : « Les [PLACEHOLDERS] sont volontairement visibles : ils marquent ce
  qui reste à confirmer et ne doivent jamais être remplis par invention. » Le
  rôle de ce guide s'arrête là — sauf pour le nom, qui n'est plus une invention.
  La seule chose à ajouter est que **la page est en ligne** : ces marqueurs sont
  lus par les visiteurs et par les moteurs, et une mention légale incomplète est
  le premier document qu'un prospect méfiant va chercher.
- **PREUVE.** §7 du positionnement, « À formaliser (non défini à ce jour) : qui
  facture le client final, et qui porte la garantie ». La question de l'éditeur
  n'est donc pas seulement administrative — elle n'est pas tranchée sur le fond.

## 3. La propriété intellectuelle

- **AVANT** (`:62`) — Propriété intellectuelle — « Contenus et design © Nawa
  Corps. Reproduction interdite sans accord. »
- **APRÈS** — **Propriété intellectuelle** — **« Contenus, textes et design ©
  Nawa Corps. Reproduction interdite sans accord écrit. Les pièces présentées
  en démonstration sur la page d'accueil sont des travaux de l'agence ; les
  établissements qui y figurent sont fictifs. »**
- **POURQUOI.** La page d'accueil montre cinq pièces construites autour d'un
  établissement inventé, que le positionnement classe déjà « client fictif
  inventé — à retirer » (§6). Tant que ces pièces sont en ligne, **le dire ici
  est le filet de sécurité minimal**, et c'est le seul endroit du site où une
  telle mention est attendue. « Accord écrit » plutôt qu'« accord » parce qu'un
  accord oral ne se prouve pas.
- **PREUVE.** §6, tableau des preuves et « Règle absolue » ; `CLAUDE.md`,
  Interdits.
- **RÉSERVE — et elle se resserre au tour 2.** Cette mention **ne remplace pas**
  l'étiquetage des pièces elles-mêmes ; `accueil.md` §B s'en charge. **Et si la
  pièce « La carte » se révèle être le travail du client payant réel**
  (`accueil.md` §B.4, décision ouverte), la phrase « les établissements qui y
  figurent sont fictifs » devient **fausse** et doit être amendée en
  conséquence. Les deux fichiers se tiennent : ne pas appliquer l'un sans
  l'autre.

---

## Conformes, laissés tels quels

| Texte | Ligne | Pourquoi il reste |
|---|---|---|
| Nawa Corps *(étiquette)* | `:53` | — |
| Mentions légales *(h1)* | `:55` | 2 mots, porte le mot-clé. |
| Éditeur / Hébergement / Propriété intellectuelle *(intitulés)* | `:57,59,61` | Les trois rubriques attendues, nommées sans jargon. |
| ← Retour au site | `:63` | — |

## Point ouvert

**Le droit applicable et le for ne sont pas mentionnés.** La `meta description`
de la page les annonce pourtant : « éditeur, hébergement, propriété
intellectuelle **et droit applicable** » (`:36-37`). La page promet donc une
rubrique qu'elle n'a pas. Deux issues : ajouter la rubrique (contenu juridique,
hors de mon périmètre — c'est à Boualem, avec un conseil), ou retirer les trois
mots de la description. **Je ne rédige pas de clause de droit applicable.**
