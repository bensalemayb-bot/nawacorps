# Réécriture — page `/mentions-legales`

> Mode `propose`. Aucun fichier du site n'est modifié.
> Fichier : `app/(site)/mentions-legales/page.tsx`.
> **Mot-clé cible** : *mentions légales Nawa Corps Genève*. Il est dans le
> `title`, dans la `meta description` et dans le `h1` — inchangés.
>
> C'est la page la plus courte du site et celle où le copy a le moins à faire :
> elle est correcte de ton, sobre, sans un adjectif de trop. **Son problème n'en
> est pas un de mots : trois valeurs y sont des marqueurs à remplir, et ils sont
> visibles en production.** Ils ne peuvent être remplis que par Boualem — les
> inventer serait exactement ce que la définition de rôle interdit.

---

## 1. Les marqueurs à remplir — bloquant avant mise en ligne

| Ligne | Texte affiché aujourd'hui | Ce qu'il faut, et qui le fournit |
|---|---|---|
| `:58` | Nawa Corps, studio digital, Genève, Suisse, exploité par **[PRÉNOM NOM — À COMPLÉTER]** | Le nom civil de l'exploitant, et la forme juridique si elle existe (raison individuelle, Sàrl). **Boualem.** |
| `:58` | Contact : hello@nawacorps.ch **[à confirmer]** | L'adresse réelle. Verrouillée par `NAP_CONFIRME = false` (`lib/site.ts:42`). **Boualem.** |
| `:60` | **[Infomaniak, Suisse — à confirmer en B12]** | L'hébergeur réel et son pays. **Boualem.** |

- **POURQUOI ce n'est pas du copy.** Le commentaire du fichier le dit déjà, et
  il a raison : « Les [PLACEHOLDERS] sont volontairement visibles : ils marquent
  ce qui reste à confirmer et ne doivent jamais être remplis par invention. »
  Le rôle de ce guide s'arrête là. La seule chose à ajouter est que **la page
  est en ligne**, donc que ces marqueurs sont lus par les visiteurs et par les
  moteurs, et qu'une mention légale incomplète est le premier document qu'un
  prospect méfiant va chercher.
- **PREUVE.** `.agents/product-marketing.md` §7, « À formaliser (non défini à ce
  jour) : qui facture le client final, et qui porte la garantie ». La question
  de l'éditeur n'est donc pas seulement administrative — elle n'est pas tranchée
  sur le fond.

## 2. La seule réécriture proposée

- **AVANT** (`:62`) — Propriété intellectuelle — « Contenus et design © Nawa
  Corps. Reproduction interdite sans accord. »
- **APRÈS** — **Propriété intellectuelle** — **« Contenus, textes et design ©
  Nawa Corps. Reproduction interdite sans accord écrit. Les pièces présentées
  en démonstration sur la page d'accueil sont des travaux du studio ; les
  entreprises qui y figurent sont fictives. »**
- **POURQUOI.** Deux ajouts, un seul motif : la page d'accueil montre cinq
  pièces construites autour d'un établissement inventé, et le positionnement les
  classe déjà « client fictif inventé — à retirer » (§6). Tant que ces pièces
  sont en ligne, **le dire ici est le filet de sécurité minimal**, et c'est le
  seul endroit du site où une telle mention est attendue. « Accord écrit »
  plutôt qu'« accord » parce qu'un accord oral ne se prouve pas.
- **PREUVE.** `.agents/product-marketing.md` §6, tableau des preuves et « Règle
  absolue » ; CLAUDE.md, Interdits (« En Suisse, la LCD (art. 3) vise les
  indications trompeuses »).
- **RÉSERVE.** Cette mention **ne remplace pas** l'étiquetage des pièces
  elles-mêmes. Le §6 demande une démonstration « étiquetée démonstration sans
  ambiguïté », c'est-à-dire à côté de la pièce, pas dans une page annexe que
  personne n'ouvre. Les réécritures de `accueil.md` §B s'en chargent ; celle-ci
  les double, elle ne les remplace pas.

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
