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
| §2 (`:45`) | Le catalogue complet — les trois formules de site, le suivi, l'identité, les imprimés… | **L'assistant connaît déjà votre métier. Il répond, relance et prépare ; vous validez.** | **The assistant already knows your trade. It answers, follows up and prepares; you approve.** |
| lien 1 (`:46`) | Voir tous les services | **Voir l'assistant en détail** | **See the assistant in detail** |
| lien 2 (`:47`) | ← Retour au site | *inchangé* | *inchangé* |

- POURQUOI : un visiteur qui arrive par un ancien lien (formule, famille,
  imprimés) doit comprendre que l'offre a changé, sans cul-de-sac. Franchise
  sur le changement de métier (`founder/marketing.md` §6, accroche 1).
- PREUVE : PM en-tête « Statut : changement de métier », date 24.10.2026 ;
  §5 « Ce qui sort de l'offre ».
- NOTE : §2 enchaîne « répond, relance et prépare » : quatre mots communs avec
  Sparkana (« répond, relance et prépare vos devis ») ; sous le seuil de cinq,
  mais à ne pas compléter par « vos devis ».

## 2. `app/not-found.tsx` (racine, `:97-112`, titre `:122-125`)

| Clé | AVANT FR / EN | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `erreur`, `titre`, `corps`, `accueil` | Erreur 404 · Cette page n'existe pas. · Le lien est peut-être ancien… · ← Retour à l'accueil | *inchangés* | *inchangés* |
| `services` | Voir tous les services → / See all the services → | **Voir l'assistant en détail →** | **See the assistant in detail →** |
| title | Page introuvable — Nawa Corps / Page not found — Nawa Corps | *inchangé* | *inchangé* |
