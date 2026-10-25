# `/services/[slug]` et `/en/services/[slug]` — les trois pages de formule (24.10.2026)

> Mode `propose`. Fichiers : `app/(site)/services/[slug]/page.tsx` (`TEXTES`,
> `:180-275`) et `lib/formules.ts` (`POUR_QUI` :131-153, `SOCLE` :164-193,
> `FORMULES` :289-511).

## 1. Constat

Les trois pages (`/services/la-vitrine`, `/services/le-site`,
`/services/l-assistant`) vendent les formules de site. PM §5 : **« Les formules
de site La Vitrine, Le Site et L'Assistant sortent de l'offre. Elles ne
s'écrivent plus sur le site public. »** Elles affichent aussi des prix lus en
base et un JSON-LD `Offer` chiffré (`page.tsx:458-470`), interdits tant
qu'aucun prix n'est fixé.

**Aucune chaîne de ces pages n'est récupérable.** Le nom « L'Assistant » (la
formule à 2'499.–) entre en plus en collision avec « l'assistant », le produit :
un visiteur qui arrive de Google sur `/services/l-assistant` lirait un ancien
prix sous le nom du nouveau produit.

## 2. Recommandation (décision d'Ayoub, structure et URL hors de mon périmètre)

**Option A, recommandée** : redirection permanente des trois adresses (et de
leurs jumelles `/en/…`) vers `/services`, puis retrait du sitemap
(`app/sitemap.ts`). Aucune copie à écrire.

**Option B** : garder la route et rendre une 404 (`notFound()` pour tout slug).
Le texte de la 404 est dans `not-found.md` ; il dit que l'offre a changé.

**Option C, déconseillée** : réutiliser les trois slugs comme pages de métier.
Les URL (`la-vitrine`, `le-site`, `l-assistant`) ne décrivent aucun métier ;
un mot-clé qui ne correspond pas à l'adresse nuit à la page.

## 3. Chaînes concernées (toutes à retirer, aucune APRÈS)

| Fichier:ligne | Texte (extrait) | Problème |
|---|---|---|
| `[slug]/page.tsx:182-222` | Services · Périmètre à définir · Une semaine / Délai de livraison · Dès votre feu vert · Suivi obligatoire · Prix en francs suisses, TVA comprise… · Ce que vous recevez · Il faut monter à · Création et refonte de site web | Ancienne offre, prix, délai de site |
| `[slug]/page.tsx:226-273` | miroir EN | idem |
| `[slug]/page.tsx:430-471` | JSON-LD `Service` + `Offer` avec `price` | Prix publié aux moteurs |
| `lib/formules.ts:131-135`, `:149-153` | Être présentable · Recevoir les demandes · Les traiter sans vous | Paliers de l'ancienne grille, aussi lus par `Offres` |
| `lib/formules.ts:164-193` | Socle (une page unique, formulaire, domaine…) | Ancienne offre |
| `lib/formules.ts:289-511` | h1, seoTitre, seoDescription, resout, apporte, cta, amorces WhatsApp, questions des trois formules | Ancienne offre, prix, « 24/7 », « une semaine » |
