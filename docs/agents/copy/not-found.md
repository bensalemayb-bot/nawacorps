# Pages 404 (24.10.2026)

> Mode `propose`. Trois fichiers : `app/(site)/not-found.tsx` (FR, avec chrome),
> `app/(site)/en/not-found.tsx` (EN, avec chrome, h1 `:54`), `app/not-found.tsx`
> (racine, FR et EN, `TEXTES` `:97-112`).

## 1. `app/(site)/not-found.tsx` (FR) et `en/not-found.tsx` (EN)

| Élément | AVANT FR | APRÈS FR | APRÈS EN |
|---|---|---|---|
| meta (`:40`) | Erreur 404 | *inchangé* | *inchangé* (Error 404) |
| h1 (`:42`) | Cette page n'existe plus. | *inchangé* | *inchangé* (This page no longer exists.) |
| §1 (`:44`) | L'adresse est peut-être ancienne, ou la prestation qu'elle décrivait n'est plus au catalogue. Rien n'est perdu : le reste du site est intact, et le studio répond toujours. | **L'adresse est peut-être ancienne. Depuis octobre 2026, Nawa Corps ne fait plus de sites : nous installons des assistants dans les PME genevoises.** | **The address may be an old one. Since October 2026, Nawa Corps no longer builds websites: we set up assistants in Geneva small businesses.** |
| §2 (`:45`) | Le catalogue complet — les trois formules de site, le suivi, l'identité, les imprimés… | **L'assistant connaît déjà votre métier. Il reprend le bureau du soir, et il ne s'engage jamais à votre place.** *(tour 2 : plus de triplet générique, B1)* | **The assistant already knows your trade. It takes the evening paperwork off you, and it never commits on your behalf.** |
| lien 1 (`:46`) | Voir tous les services | **Voir l'assistant en détail** | **See the assistant in detail** |
| lien 2 (`:47`) | ← Retour au site | *inchangé* | *inchangé* |

- POURQUOI : un visiteur qui arrive par un ancien lien (formule, famille,
  imprimés) doit comprendre que l'offre a changé, sans cul-de-sac. Franchise
  sur le changement de métier (`founder/marketing.md` §6, accroche 1).
- PREUVE : PM en-tête « Statut : changement de métier », date 24.10.2026 ;
  §5 « Ce qui sort de l'offre ».
- PREUVE §2 : PM §2 (douleur) ; arbitrage B1. Tour 1 archivé :
  `docs/agents/_archive/2026-10-24-tour1/copy/not-found.md`.

## 2. `app/not-found.tsx` (racine, `:97-112`, titre `:122-125`)

| Clé | AVANT FR / EN | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `erreur`, `titre`, `corps`, `accueil` | Erreur 404 · Cette page n'existe pas. · Le lien est peut-être ancien… · ← Retour à l'accueil | *inchangés* | *inchangés* |
| `services` | Voir tous les services → / See all the services → | **Voir l'assistant en détail →** | **See the assistant in detail →** |
| title | Page introuvable — Nawa Corps / Page not found — Nawa Corps | *inchangé* | *inchangé* |
