# Revue de code — refonte « L'assistant qui connaît déjà votre métier » (étape 5)

- Date : 25.10.2026 (audit lancé le 24.10 au soir)
- Mode : **audit** (lecture seule, aucun fichier du site modifié)
- Branche : `refonte/artisans`. Périmètre : toutes les modifications non commitées (`git status` : 75 fichiers suivis modifiés ou supprimés, plus les nouveaux fichiers `components/HeroRotation.tsx` et `lib/mentions.ts`).
- Remarque : `lib/dictionnaires/en.ts` a été modifié **pendant** l'audit (horodatage 25.10 00:00:16, sans doute par la session principale) : `h1Debut` est passé de « The assistant that » (18 signes) à « The AI that ». Le constat que j'allais faire (la première ligne EN dépassait le budget de 590 px documenté dans fr.ts L146-149) est donc **déjà corrigé**. L'état final a été relu et revérifié en HTTP.

## Préconditions — commandes trouvées

| But | Commande | Source |
|---|---|---|
| Lint | `npm run lint` → `eslint` | [doc:package.json:L10] |
| Typecheck | `npm run typecheck` → `tsc --noEmit` | [doc:package.json:L11] |
| Build | `npm run build` → `next build` | [doc:package.json:L7] |
| Tests | **aucune suite de tests** | CLAUDE.md, « Commandes » |

## Exécution

| Commande | Code retour | Résumé |
|---|---|---|
| `npm run lint` | 0 | 0 erreur, 1 avertissement déjà présent : `components/NoyauStage.tsx:279` `<img>` (@next/next/no-img-element), hors diff |
| `npm run typecheck` | 0 | aucune sortie |
| `npm run build` | 0 | « Compiled successfully », 24 pages ; `/services/[slug]`, `/demonstrations` absents ; `/`, `/en`, `/services`, `/en/services` en `ƒ` (dynamique) |

Contrôles HTTP en lecture sur le serveur de dev déjà lancé (port 3000, PID 11812), sans aucun POST (`.env.local` pointe sur la production) :

```
/services/la-vitrine   308 -> /          /en/services/le-site  308 -> /en
/services/l-assistant  308 -> /          /demonstrations       308 -> /
/services/a/b          308 -> /          /en/demonstrations    308 -> /en
/services/restauration 308 -> /          /services, /en/services, /en  200
/demonstrations/  -> 200 en 2 sauts (barre finale, puis 308) : aucune boucle
/studio /contact /devis /en/studio /en/contact /en/devis /mentions-legales /en/confidentialite : 200 ; /nexiste-pas : 404
sitemap.xml : 14 <loc> (7 FR + 7 EN), plus aucune /services/<slug> ni /demonstrations
```

**Fallback sans ligne `assistant-mise-en-place`** : la base lue par le dev n'a pas la ligne (ou ne répond pas). Résultat mesuré : aucun « 1'500 » nulle part, « Payée après l'essai » au temps 3 du hero, **aucun `Offer`** dans le JSON-LD `Service` de /services (`{"@type":"Service",…,"url":".../services"}` sans `offers`). Le fallback est propre.

**Avec la ligne** (script `tsx` jetable sur un catalogue simulé, `priceCents: 150000`, fichier temporaire supprimé aussitôt) : `montantMiseEnPlace` → `"1'500.–"` ; ligne absente → `null` ; `priceCents: null` → `null`. Les 8 gabarits FR/EN (`hero.specMiseEnPlaceValeur`, `offres.abonnementPayeNote`, `offres.note`, `faq.reponsePrix`) sont tous remplis sans trou, chacun avec « TVA comprise » ou « VAT included ».

JSON-LD (accueil FR, `/en`, `/services`) : tous les blocs se parsent (`json.loads`). `ProfessionalService`, `FAQPage` (`inLanguage` fr-CH / en-CH), `BreadcrumbList`, `Service`. `<html lang>` vaut `fr-CH` ou `en-CH` selon la page ; les canoniques et les hreflang se croisent bien. Les 7 ancres internes (`#contact`, `#offres`, `/#offres`…) mènent à un `id` existant.

Règles de CLAUDE.md vérifiées :
- **Aucun `next/link`** importé dans `app/` ni `components/` (grep : seulement des commentaires).
- **Aucun prix en dur** dans le code rendu (grep `\d'\d{3}\.–` : seulement dans des commentaires).
- **Le h1 a au plus 21 caractères par ligne `.l`.** FR : 11 / 21, 21, 18, 20. EN (état final) : 11 / 17, 21, 19, 18.
- **Aucun secret** dans le diff ni dans les 588 fichiers non suivis (grep des motifs `gsk_`, `AIza`, `sk-`, URL Postgres avec mot de passe, clés privées).

---

## CRITIQUE

Aucun.

## MAJEUR

### 1. « Données en Suisse » sans borne : la page contredit la politique de confidentialité
- **Fichiers** : `components/Studio.tsx:42` avec `lib/dictionnaires/fr.ts:317` / `en.ts:195`. Aussi `components/NoyauHero.tsx:139-147` avec `fr.ts:196-200` / `en.ts:106-111`.
- **Constat** :
  - Dans (03), le fait affiché est « **Genève** / Données en Suisse » (« Geneva / Data in Switzerland »). Rien ne le borne à l'assistant du client, alors que la règle (PM L274 : « La promesse ne vaut ni pour le site ni pour Leo ») l'exige. Or la page `/confidentialite` (L81-82) dit le contraire pour le site : « hébergés par Vercel… en Allemagne (Francfort) », et Leo passe par « un fournisseur… hors de Suisse ».
  - Au temps 3 du hero, sous « (002) La démo » et « 3 vraies demandes », la liste annonce « Vos données — Hébergées en Suisse ». Le lecteur comprend que les trois demandes montrées **pendant la démo** sont hébergées en Suisse. Ce n'est établi nulle part : PM L433 dit « Reste à choisir l'hébergement et le modèle suisses de l'assistant livré ».
- **Preuve** : HTML rendu de `/` : `<b>Genève</b><span>Données en Suisse</span>` ; `/confidentialite` L81 cité ci-dessus. LCD art. 3 (CLAUDE.md, « Interdits »).
- **Correctif** : c'est du texte, donc à faire par **copy-positionnement**. Je ne touche pas aux mots. Contrainte à lui transmettre : chaque mention courte doit nommer « votre assistant », ou bien la cellule doit afficher un autre fait vrai. Côté code, rien à changer : les clés `studio.faitLieuNote` et `hero.specDonneesValeur` restent, seule leur valeur change.
- **Vérifier** : `curl -s localhost:3000/ | grep -o "Données en Suisse"` ne renvoie plus rien de non borné ; relire (03) et le temps 3 à côté de `/confidentialite`.

### 2. La rotation du h1 tourne sans fin, sans moyen de l'arrêter (WCAG 2.2.2, niveau A)
- **Fichier** : `components/HeroRotation.tsx:36-47`
- **Constat** : `setInterval` toutes les 3,1 s, sans fin et sans moyen de pause. Ça continue onglet masqué et hero hors écran. `prefers-reduced-motion` est bien respecté (L38), mais WCAG 2.2.2 demande une pause pour tout contenu qui bouge seul plus de 5 s, à côté d'autre contenu. L'`aria-label` du h1 est correct : `h1Complet` FR et EN, et les fins sont `aria-hidden`.
- **Preuve** : extrait L39-45 (`window.setInterval(..., AFFICHAGE_MS + TRANSITION_MS)`, aucun `clearInterval` en dehors du démontage).
- **Correctif** proposé, qui garde la rotation (décision n°1 du plan) : un seul tour, retour sur la première phrase (la promesse), puis arrêt. Rien ne tourne quand l'onglet est masqué.
  ```tsx
  useEffect(() => {
    if (phrases.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let pas = 0;
    const minuteur = window.setInterval(() => {
      if (document.hidden) return;
      pas += 1;
      setEtat(({ actif: i }) => ({ actif: (i + 1) % phrases.length, precedent: i }));
      // UN TOUR, PUIS ARRET SUR LA PREMIERE PHRASE (WCAG 2.2.2).
      if (pas >= phrases.length) window.clearInterval(minuteur);
    }, AFFICHAGE_MS + TRANSITION_MS);
    return () => window.clearInterval(minuteur);
  }, [phrases.length]);
  ```
  Mettre à jour le docblock (L5-6 « en boucle »). Limite à connaître : un tour dure environ 12,4 s. Une conformité stricte demanderait en plus un bouton pause. C'est à Boualem et Ayoub de trancher.
- **Vérifier** : `npm run lint && npm run typecheck`. Au navigateur, à 1440 px : 4 changements, retour sur « connaît votre métier. », puis arrêt. En réduction de mouvement : aucune rotation.

### 3. CLAUDE.md contredit le code et la décision du 24.10
- **Fichier** : `CLAUDE.md:18-29`, `:36`, `:85`
- **Constat** :
  - L18-24 : « Prix pas encore fixé : aucun montant affiché ». Or `.agents/product-marketing.md` L270-272 a tranché (1'500.– TVA comprise, lu en base), et le code l'affiche dès que la ligne existe.
  - L29 : « Le délai s'écrit « une semaine » ». La nouvelle offre n'annonce aucune durée (`fr.ts:268-269`).
  - L36 : « Aucune infrastructure i18n ». Or `lib/dictionnaires/` et `/en` existent.
  - L85 : les prix sont « lus par `Offres`, `CarteDuStudio` ». `CarteDuStudio` est supprimé.
  - Même écart dans `docs/agents/PLAN-refonte-agent-metier.md` (décision 2 : « Aucun prix affiché »).
  Les agents suivent CLAUDE.md en priorité : un prochain agent « corrigera » le montant ou réintroduira « une semaine ».
- **Preuve** : `git diff CLAUDE.md` et `grep -n "CarteDuStudio\|une semaine\|i18n" CLAUDE.md` → L29, L36, L85.
- **Correctif** : **Boualem** édite CLAUDE.md à la main (aucun agent n'y touche). Il aligne L18-24 sur PM « Prix et données », retire ou adapte L29 et L36, et remplace L85 par « lus par `NoyauHero`, `Offres`, `Faq`, `/services` et le prompt du chatbot, via `lireMiseEnPlace` (lib/catalogue.ts) ».
- **Vérifier** : relecture ; `grep -n CarteDuStudio CLAUDE.md` ne renvoie rien.

## MINEUR

### 4. La lecture du prix est dupliquée à deux endroits
- **Fichiers** : `lib/chat-prompt.ts:58-64` (`lirePrixMiseEnPlace`, identique à `lireMiseEnPlace` de `lib/catalogue.ts`) et `app/(site)/services/page.tsx:333-340` (`lireCentsMiseEnPlace`, qui refait le `find` par slug).
- **Preuve** : comparer chat-prompt L58-64 et catalogue.ts `lireMiseEnPlace`. Même `try/montantMiseEnPlace(await chargerCatalogue())/catch null`.
- **Correctif** : ajouter dans `lib/catalogue.ts` :
  ```ts
  /** Le prix de la mise en place en centimes (JSON-LD), ou null. Ne leve jamais. */
  export async function lireCentsMiseEnPlace(): Promise<number | null> {
    try {
      const ligne = (await chargerCatalogue()).find((s) => s.slug === SLUG_MISE_EN_PLACE);
      return ligne?.priceCents ?? null;
    } catch {
      return null;
    }
  }
  ```
  Puis supprimer la copie locale dans `services/page.tsx` et l'importer. Dans `chat-prompt.ts`, supprimer `lirePrixMiseEnPlace` et appeler `lireMiseEnPlace()`. Ajuster les imports.
- **Vérifier** : lint, typecheck, build ; `/services` rend toujours son JSON-LD sans `offers` quand la ligne manque.

### 5. Prompt de Leo : « TVA comprise » et « VAT included » écrits en dur
- **Fichier** : `lib/chat-prompt.ts:87` et `:103`
- **Constat** : la règle posée par `avecPrix` (catalogue.ts) dit que « TVA comprise » n'existe qu'à un endroit, `lib/format.ts`. Le prompt la recopie.
- **Correctif** : `import { mentionTva } from "@/lib/format";`, puis `${prixMiseEnPlace}, ${mentionTva("fr")}.` (L87) et `${prixMiseEnPlace}, ${mentionTva("en")}.` (L103).
- **Vérifier** : typecheck. Le texte produit est identique (`MENTIONS_TVA`).

### 6. Repli du prompt sans montant : une promesse qui n'est pas dans la source
- **Fichier** : `lib/chat-prompt.ts:80-81` (FR) et `:96-98` (EN)
- **Constat** : sans ligne en base, Leo doit dire que le prix de la mise en place est « annoncé à la fin de la démo ». Ni PM (mise en place à prix fixe) ni le repli du site (`hero.specMiseEnPlaceValeurSansMontant`, `offres.noteSansMontant`) ne le disent. Les deux canaux divergent.
- **Correctif** : texte, à revoir par **copy-positionnement** (aligner sur `faq.reponsePrixSansMontant`).
- **Vérifier** : relire `reglePrixFr(null)` et `reglePrixEn(null)` à côté de `fr.ts:398` et `en.ts:255`.

### 7. JSON-LD : cinq `Offer` sans prix dans l'`OfferCatalog` du studio
- **Fichier** : `components/SchemaStudio.tsx:89-101`
- **Constat** : `hasOfferCatalog.itemListElement` émet 5 `{"@type":"Offer", itemOffered:{Service}}` sans `price` ni `priceSpecification`. Le critère de revue est « pas d'Offer sans prix ».
- **Preuve** : JSON-LD rendu de `/` : `"itemListElement": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Assistant IA pour PME", …}}, …]`.
- **Correctif** (schema.org accepte un `Thing` dans `itemListElement`) :
  ```tsx
  itemListElement: PRESTATIONS.map((nom) => ({
    "@type": "Service",
    name: nom,
    areaServed: CONTACT.ville,
    provider: { "@id": `${SITE_URL}/#studio` },
  })),
  ```
- **Vérifier** : `curl -s localhost:3000/ | grep -c '"@type":"Offer"'` → 0 ; Rich Results Test sans erreur.

### 8. Commentaires devenus faux (pour CLAUDE.md, un commentaire faux est un bug)
- `app/layout.tsx:70` cite `/demonstrations` parmi les pages prérendues : à retirer.
- `app/chat.css:11` cite `services.css`, supprimé.
- `app/api/chat/route.ts:184-187` parle de « feu vert », une notion de l'ancienne offre. La ligne 185 dépasse aussi la largeur du bloc.
- `app/api/contact/route.ts:151` et `:269`, `app/api/chat/finalize/route.ts:57`, `lib/chat-ouvrir.ts:18` donnent en exemple « le-site » ou « devis-imprimes », qui ne sont plus émis. Le seul sujet connu est `devis-studio` (`lib/devis.ts`).
- `lib/dictionnaires/en.ts:22-23` : la ligne de docblock ajoutée pendant l'audit dépasse la largeur et coupe la phrase.
- **Correctif** : réécrire ces phrases de commentaire (pas de code).
- **Vérifier** : `grep -rn "demonstrations\|services.css\|feu vert" app lib` ne renvoie plus que l'historique voulu.

### 9. Code mort laissé par les suppressions
- **Fichiers** : `app/binacore.css` (1184 lignes) et `public/`.
- **Constat** : 52 classes de premier niveau ne sont référencées par aucun TSX : `ba-*`, `car*`, `car2-*`, `nav-drop*`, `cat-rang*`, `cat-tout`, `prest-liste`, `prest-palier`, `print-duo`, `sm-card`, `sm-col*`, `studio-menu`, `work-cap`, `chip`, `slide`, `tag-a`, `tag-b`… Leurs commentaires citent des composants supprimés (L152 NavServices, L279 travaux, L320 et L960 feature-carousel, L556-585 familles du menu, L1132 La Vitrine). Les dossiers `public/demos` (904 Ko), `public/video` (384 Ko) et `public/vignettes` (536 Ko) ne sont plus référencés nulle part.
- **Preuve** : boucle `grep` sur chaque sélecteur de `binacore.css` contre `components/ app/ lib/` ; `grep -rn "/demos/\|/video/\|/vignettes/" app components lib` → vide.
- **Correctif** : supprimer les blocs CSS correspondants et les trois dossiers, une fois que Boualem a confirmé qu'il ne veut pas les garder pour un usage futur.
- **Vérifier** : build, puis contrôle visuel à 390 et à 1440 px (étape 7).

### 10. Accordéon (01) : les liens des lignes repliées restent focusables (hors diff, déjà présent)
- **Fichier** : `components/ServicesRows.tsx` (`.row-b`) avec `app/binacore.css:371-373` (`grid-template-rows:0fr` + `overflow:hidden`).
- **Constat** : au clavier, Tab atteint les 4 liens « Voir le parcours → » invisibles des lignes fermées. Le focus devient invisible (WCAG 2.4.7).
- **Correctif** : dans `components/Interactions.tsx`, au même endroit où `aria-expanded` est mis à jour (L252), poser `row.querySelector(".row-b").inert = !row.classList.contains("open")`, et `inert` au rendu initial (`<div className="row-b" inert>`).
- **Vérifier** : au clavier sur `/`, la tabulation saute les lignes fermées.

### 11. Pages légales encore sur l'ancien positionnement (hors diff)
- `app/(site)/mentions-legales/page.tsx:47,52,77` dit « studio de création digitale ». `app/(site)/en/mentions-legales/page.tsx:54,116` dit « digital design studio ».
- **Correctif** : texte, à revoir par **copy-positionnement**. Le reste du site dit « studio genevois · assistants pour PME ».

---

## Ce qui est bien fait
- Le prix passe par une seule voie (`lireMiseEnPlace` → `avecPrix`) : le montant ne sort jamais sans `{tva}`, et chaque gabarit a sa variante sans montant. Le repli est prouvé sans ligne en base, avec et sans `Offer` dans le JSON-LD.
- Les redirections sont génériques (`/services/:chemin+`) et respectent la langue (FR vers `/`, EN vers `/en`), sans boucle et sans saut intermédiaire. Le sitemap et `CHEMINS_TRADUITS` sont nettoyés dans la même passe.
- Le contrat FR/EN est garanti par `const en: Dictionnaire`. Le prompt de Leo interdit nommément de dire que la conversation est hébergée en Suisse, et la note du widget le dit au visiteur.

## Hors revue (renvoyé à la session principale)
- Les textes des n°1, 6 et 11 relèvent de copy-positionnement.
- L'insertion de la ligne `assistant-mise-en-place` en base relève de Boualem (voir les points ouverts).

---

## Correctifs appliqués / annulés (mode fix, 25.10.2026)

Accord transmis par la session principale : n°1 (texte borné), 2, 4, 5, 6 (aligner le prompt sur le site), 7, 8, 9, 10. Non touchés : CLAUDE.md (n°3, à Boualem), pages légales (n°11), `public/`, git, `.env`, base. « TVA comprise » conservé. `h1Debut` FR/EN non modifiés.

| N° | Statut | Fichiers | Ce qui a changé |
|---|---|---|---|
| 1 | appliqué | `lib/dictionnaires/fr.ts`, `en.ts`, `components/Studio.tsx`, `components/NoyauHero.tsx` (commentaire) | Hero, temps 3 : « Vos données / Hébergées en Suisse » devient « Données de l'assistant / En Suisse » (EN : « The assistant's data / In Switzerland »). Section (03) : le fait « Genève / Données en Suisse » devient « En Suisse / Données de l'assistant » (EN miroir). Clé `faitLieuNote` remplacée par `faitDonnees` + `faitDonneesNote` ; l'import `CONTACT` de Studio.tsx, devenu inutile, est retiré. Textes à faire relire par copy-positionnement. |
| 2 | appliqué | `components/HeroRotation.tsx` | Un seul tour, puis arrêt sur la première fin ; le minuteur ne compte pas onglet masqué (`document.hidden`) ; `prefers-reduced-motion` inchangé (aucune rotation). Pas de bouton pause. Docblock mis à jour. |
| 4 | appliqué | `lib/catalogue.ts`, `lib/chat-prompt.ts`, `app/(site)/services/page.tsx` | `lireCentsMiseEnPlace` exportée de catalogue.ts ; copies locales supprimées ; le prompt appelle `lireMiseEnPlace()`. |
| 5 | appliqué | `lib/chat-prompt.ts` | `mentionTva("fr")` / `mentionTva("en")` au lieu des chaînes en dur (texte produit identique). |
| 6 | appliqué | `lib/chat-prompt.ts` | Repli sans montant aligné sur `faq.reponsePrixSansMontant` : « La mise en place ne se paie qu'après l'essai, si le relevé vous convient. » La promesse « son prix est annoncé à la fin de la démo » est retirée pour la mise en place (FR et EN). |
| 7 | appliqué | `components/SchemaStudio.tsx` | `itemListElement` : des `Service` nus, plus aucun `Offer` sans prix. Docblock mis à jour. |
| 8 | appliqué | `app/layout.tsx`, `app/chat.css`, `app/api/chat/route.ts`, `app/api/contact/route.ts`, `app/api/chat/finalize/route.ts`, `lib/chat-ouvrir.ts`, `lib/dictionnaires/en.ts` | Commentaires corrigés (plus de `/demonstrations` présenté comme vivant, plus de `services.css`, plus de « feu vert », exemples de sujet = `devis-studio`), lignes trop longues recoupées. |
| 9 | appliqué en partie | `app/binacore.css` | 1184 → 700 lignes. 70 classes sans aucune référence dans une chaîne TS/TSX (script de contrôle : 0 restante) retirées avec leurs commentaires orphelins ; 3 listes de sélecteurs réduites (`.nav-drop-t`, `.sm-foot .lnk::before`). Fins de ligne CRLF conservées. **Non fait** : suppression de `public/demos`, `public/video`, `public/vignettes` (interdit par la délégation). Le JS mort des comparateurs `.ba` / `#car2` dans `components/Interactions.tsx` (L264 et suivantes) reste : hors liste. |
| 10 | appliqué | `components/ServicesRows.tsx`, `components/Interactions.tsx` | `.row-b` rendu `inert` ; Interactions lève/repose `inert` dans la même boucle qu'`aria-expanded`. |

Aucun correctif annulé.

### Vérifications après correctifs
| Commande | Code | Résumé |
|---|---|---|
| `npm run typecheck` | 0 | aucune sortie |
| `npm run lint` | 0 | 0 erreur, 1 avertissement préexistant (`NoyauStage.tsx:279`, hors diff) |
| `npm run build` | 0 | « Compiled successfully », mêmes routes qu'à l'audit |

HTTP en lecture (serveur de dev, port 3000, aucun POST) : `/`, `/en`, `/services`, `/studio`, `/contact` → 200. Sur `/` : 0 « Données en Suisse », `<b>En Suisse</b><span>Données de l'assistant`, 0 `"@type":"Offer"`, les 4 `.row-b` portent `inert=""`. Sur `/en` : 0 « Data in Switzerland », `<b>In Switzerland</b><span>The assistant's data`.

**Non vérifié au navigateur** : le tour unique de la rotation (12,4 s, retour sur « connaît votre métier. »), la mise en page de la ligne « Données de l'assistant » du temps 3 à 375 et 1440 px, la tabulation de (01), le rendu visuel après le nettoyage CSS. C'est la validation E2E manuelle de Boualem.
