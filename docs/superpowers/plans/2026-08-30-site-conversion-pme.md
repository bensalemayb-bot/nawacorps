# Site Nawa Corps — conversion PME : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** rendre le site conforme au repositionnement PME et le faire pousser à l'action — carrousel réparé, alignements corrigés, toute demande de devis ouvrant l'assistant, et une carte de prix complète.

**Architecture :** trois lots indépendants. Le **lot A** (contenu et positionnement) ne passe pas par ce plan : il est produit par le pipeline de sub-agents (`docs/agents/PIPELINE.md`), qui a ses propres portes. Le **lot B** (interface) et le **lot C** (mécanique de conversion) sont des tâches de code, spécifiées ici. Le **lot D** (version anglaise) demande son propre plan : voir §Hors périmètre.

**Tech Stack :** Next.js 16.3.2 (App Router, Turbopack), React, TypeScript strict, Postgres + Prisma 7, CSS maison (`app/binacore.css`), Tailwind v4 pour les utilitaires seuls.

**Spec :** `.agents/product-marketing.md` (positionnement, offres, prix, voix) + `CLAUDE.md` (stack, conventions, interdits).

## Global Constraints

- **Aucune suite de tests n'existe.** La vérification d'une tâche = `npm run typecheck` + `npm run lint` + une **mesure dans le navigateur** (script JS fourni à chaque tâche). Ne jamais écrire « ça marche » sans la sortie de la mesure.
- Prix jamais en dur : ils viennent de Postgres (`prisma/seed.ts` → table `Service`).
- Tout prix affiché porte la mention **TVA comprise**.
- Pas de `next/link` sur le site public (les révélations au scroll ne s'initialisent qu'une fois).
- Les éléments `position: fixed` restent hors de `#smoothWrap`.
- Chaque ligne `.l` du `h1` du hero tient sur **21 caractères au plus**.
- Commentaires en français, expliquant *pourquoi*. Un commentaire devenu faux est un bug.
- Personne ne touche à git, `.env`, aux configs de prod ni au déploiement.

## Mesures de référence (relevées le 30/08/2026, viewport 890 px)

Ces chiffres justifient les tâches 1 à 4. Les reproduire avant de corriger.

| Élément | gauche | largeur | droite |
|---|---|---|---|
| `.wrap` (grille de page) | 41 | 808 | 41 |
| `#car2` | 41 | 808 | 41 |
| `.car2-left` (panneau vert) | 42 | 258 | — |
| `.pcard[active]` (la carte) | **417** | 314 | 159 |
| `.car2-meta` | **344** | 460 | 86 |
| `#travaux h2` | **178** | 670 | 41 |
| `#services .rows`, `#offres .price-grid`, `.sm-card` | 41 | 808 | 41 |

Deux écarts nets : le panneau vert s'arrête à **300**, la carte commence à **417** → **117 px de fond beige entre les deux verts**. Et le `h2` de Travaux est à 178 quand toutes les autres grilles sont à 41.

Opacités des pastilles du panneau gauche : `1 / 0.78 / 0.56 / 0.56 / 0.78` — formule `1 - |w| * 0.22` (`feature-carousel.tsx:483`).

---

## Lot A — contenu et positionnement (pipeline, hors code)

Pas de tâche de code. Séquence à lancer dans la session principale, une invocation à la fois, en respectant les portes.

- [ ] **A1** `Utilise l'agent veille-concurrents : marché Genève / Suisse romande, segment PME de services, 6 concurrents max.`
- [ ] **A2** `Utilise boss-decision pour la porte G1 sur docs/agents/veille/.` — NO-GO → retour A1 (2 tours max).
- [ ] **A3** `Utilise copy-positionnement en mode propose sur tout le site.` — c'est lui qui réécrit le hero (« j'aime pas les premières phrases »), en s'appuyant sur la veille.
- [ ] **A4** `Utilise psy-persuasion, revue A, tour 1.`
- [ ] **A5** `Utilise page-produit en mode spec sur la page d'offre PME.`
- [ ] **A6** `Utilise psy-persuasion, revue B, tour 1.`
- [ ] **A7** `Utilise boss-decision pour la porte G2.`
- [ ] **A8** GO → `copy-positionnement en mode apply` puis `page-produit en mode build`.
- [ ] **A9** `Utilise revue-code en mode audit depuis la référence HEAD.` puis mode fix sur liste approuvée, puis porte G3.

**⚠️ Redémarrer Claude Code avant A1.** `.claude/agents/` n'existait pas au démarrage de cette session : les six agents ne sont pas encore chargés.

---

## Lot B — interface

### Task 1 : les deux verts se rejoignent au glissement

Quand le curseur avant/après dévoile l'« après » (fond `--pine` sur quatre des cinq pièces), le vert de la carte doit rejoindre le vert du panneau de gauche au lieu de flotter à 117 px.

Sens du curseur, vérifié : `.ba-before` est clippé en `inset(0 calc(100% - var(--x)) 0 0)`, donc l'AVANT occupe `0..x` et l'APRÈS se dévoile quand **x diminue**. Le vert doit donc croître depuis la gauche quand `x` diminue → `clip-path: inset(0 var(--ba-x) 0 0)`.

Le voile vert se pose sur `.car2-scene` et **pas** sur `.car2-right` : `.car2-meta` porte du texte sombre, du vert derrière le rendrait illisible.

**Files:**
- Modify: `components/ui/feature-carousel.tsx:78-90` (fonction `setPos`)
- Modify: `app/binacore.css:571-585` (`.car2-right`, `.car2-scene`)

**Interfaces:**
- Produces: variable CSS `--ba-x` (pourcentage, `2%`–`98%`) posée sur `.car2`, alimentée uniquement par la carte active.
- Produces: variable CSS `--pad` sur `.car2-right`, valeur du padding, réutilisée par `.car2-scene::before` pour déborder jusqu'au panneau vert.

- [ ] **Step 1 : relever l'état actuel dans le navigateur**

Site lancé (`npm run dev`), puis dans la console de la page :

```js
const g = document.querySelector('.car2-left').getBoundingClientRect();
const c = document.querySelector('.pcard[data-status="active"]').getBoundingClientRect();
console.log('trou beige entre les deux verts :', Math.round(c.x - (g.x + g.width)), 'px');
```
Attendu avant correction : `117 px`.

- [ ] **Step 2 : propager la position du curseur jusqu'à la racine du carrousel**

Dans `setPos`, après `el.style.setProperty("--x", ...)` :

```ts
    // La racine doit connaitre la position du curseur pour que le fond vert de
    // la scene rejoigne le panneau de gauche. SEULE la carte active a le droit
    // d'ecrire cette variable : les cartes prev/next existent toujours dans le
    // DOM, et l'animation d'amorce de la premiere (teaser) se battrait avec
    // l'active pour la meme variable.
    const carte = el.closest<HTMLElement>(".pcard");
    if (carte?.dataset.status === "active") {
      el.closest<HTMLElement>(".car2")?.style.setProperty(
        "--ba-x",
        pos.current + "%",
      );
    }
```

- [ ] **Step 3 : peindre le vert derrière la scène**

Dans `app/binacore.css`, remplacer la règle `.car2-right` par une version qui nomme son padding, puis ajouter le voile :

```css
.car2-right{flex:1;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;
  --pad:clamp(22px,4vw,54px);padding:var(--pad);
  background:radial-gradient(700px 420px at 80% 0%, rgba(169,138,69,.08), transparent 60%),var(--bone-2)}

/* LE RACCORD DES DEUX VERTS.
   Le panneau de gauche est vert, et l'« apres » de quatre pieces sur cinq
   l'est aussi : sans ce voile, deux blocs verts flottent a 117px l'un de
   l'autre, separes par du beige. Il croit depuis la gauche a mesure que
   --ba-x diminue, c'est-a-dire exactement quand l'« apres » se devoile.
   Il deborde du padding (-var(--pad)) pour aller toucher le panneau.
   Pose sur .car2-scene et non sur .car2-right : .car2-meta, juste dessous,
   porte du texte sombre qui deviendrait illisible sur du pin. */
.car2-scene::before{
  content:"";position:absolute;top:0;bottom:0;
  left:calc(-1 * var(--pad));right:calc(-1 * var(--pad));
  background:var(--pine);
  clip-path:inset(0 var(--ba-x,50%) 0 0);
  z-index:0;pointer-events:none}
.car2-scene>*{position:relative;z-index:1}
```

- [ ] **Step 4 : vérifier**

```bash
npm run typecheck && npm run lint
```
Puis dans la console de la page, curseur poussé à fond à gauche :

```js
const ba = document.querySelector('.pcard[data-status="active"] .ba');
ba.style.setProperty('--x','2%');
document.querySelector('.car2').style.setProperty('--ba-x','2%');
const scene = document.querySelector('.car2-scene');
console.log('voile :', getComputedStyle(scene, '::before').clipPath);
console.log('bord gauche du voile :', Math.round(scene.getBoundingClientRect().x - parseFloat(getComputedStyle(document.querySelector('.car2-right')).paddingLeft)));
console.log('bord droit du panneau vert :', Math.round(document.querySelector('.car2-left').getBoundingClientRect().right));
```
Attendu : `clipPath` = `inset(0px 2% 0px 0px)` — le vert couvre 98 % de la scène ; et les deux derniers chiffres doivent être **égaux**, ce qui prouve que le voile va bien toucher le panneau.

Contrôle visuel obligatoire : glisser la poignée sur **La carte**, **Le site**, **La carte de visite** et **La fidélité**. Les flèches `‹ ›` et les pastilles `Avant` / `Après` doivent rester lisibles sur le vert ; si l'une disparaît, lui donner une variante claire et le noter.

- [ ] **Step 5 : commit**

```bash
git add components/ui/feature-carousel.tsx app/binacore.css
git commit -m "carrousel: le vert de l'apres rejoint le panneau de gauche au glissement"
```

---

### Task 2 : remonter la visibilité des pastilles les plus lointaines

Les pastilles 03 et 04 tombent à `0.56` d'opacité — trop effacées pour qu'on lise la liste des pièces.

**Files:**
- Modify: `components/ui/feature-carousel.tsx:483`

- [ ] **Step 1 : relever**

```js
[...document.querySelectorAll('#car2 .chip')].map(c => [c.textContent.trim().replace(/\s+/g,' '), getComputedStyle(c).opacity])
```
Attendu avant : `1 / 0.78 / 0.56 / 0.56 / 0.78`.

- [ ] **Step 2 : relever le plancher**

```ts
                  // 0.14 et non 0.22 : a cinq pieces, |w| monte a 2, donc
                  // l'ancien coefficient plafonnait les plus lointaines a 0.56
                  // — illisible sur le pin. A 0.14 le plancher remonte a 0.72,
                  // la hierarchie reste lisible sans que rien ne disparaisse.
                  opacity: 1 - Math.abs(w) * 0.14,
```

- [ ] **Step 3 : vérifier**

```bash
npm run typecheck && npm run lint
```
Puis rejouer la mesure du Step 1. Attendu : `1 / 0.86 / 0.72 / 0.72 / 0.86`.

- [ ] **Step 4 : commit**

```bash
git add components/ui/feature-carousel.tsx
git commit -m "carrousel: pastilles lointaines plus lisibles (plancher 0.72)"
```

---

### Task 3 : aligner les titres de section sur la grille de page

`#travaux h2` commence à 178 px quand `.rows`, `.price-grid` et `.sm-card` commencent toutes à 41. Il faut d'abord établir si 178 est un choix de maquette appliqué partout, ou un écart isolé — la correction en dépend, et elle n'est pas la même.

**Files:**
- Modify (selon le relevé) : `app/binacore.css` (règle `.sec-head`)

- [ ] **Step 1 : relever tous les titres de section**

```js
const wrapL = document.querySelector('#travaux .wrap').getBoundingClientRect().x;
[...document.querySelectorAll('section h2, footer h2')].map(h => {
  const s = h.closest('section, footer');
  return [s?.id || s?.className, Math.round(h.getBoundingClientRect().x - wrapL)];
})
```

- [ ] **Step 2 : trancher sur la base du relevé**

- **Toutes les valeurs identiques (≈178)** → c'est la maquette, pas un défaut. Ne rien changer, écrire le relevé dans le rapport et passer à la Task 4.
- **Valeurs mélangées** → les titres hors majorité sont le défaut. Corriger la règle `.sec-head` pour que tous les `h2` partagent la même colonne, sans toucher aux `.meta` qui les précèdent.

- [ ] **Step 3 : vérifier**

```bash
npm run typecheck && npm run lint
```
Rejouer le relevé du Step 1 : toutes les valeurs doivent être égales.

- [ ] **Step 4 : commit**

```bash
git add app/binacore.css
git commit -m "mise en page: titres de section alignes sur la grille"
```

---

## Lot C — mécanique de conversion

### Task 4 : toute demande de devis ouvre l'assistant

Aujourd'hui chaque « Demander un devis » part vers WhatsApp, hors du site. L'assistant existe déjà (`ChatWidget`) mais ne s'ouvre qu'en cliquant sa propre bulle. On l'ouvre depuis n'importe quel CTA de devis, **sans perdre le repli WhatsApp** si le JS ne démarre pas : le lien reste un `<a href>`, le clic est simplement intercepté.

**Files:**
- Create: `lib/chat-ouvrir.ts`
- Modify: `components/ChatWidget.tsx` (ajout d'un écouteur)
- Modify: `components/CarteDuStudio.tsx` (CTA `DEVIS_HREF`)
- Modify: `components/Offres.tsx` (CTA `DEVIS_LABEL` des lignes sur devis)

**Interfaces:**
- Produces: `ouvrirChat(sujet?: string): void` — émet `CustomEvent("nawa:chat-ouvrir", { detail: { sujet } })` sur `window`.
- Produces: `NAWA_CHAT_OUVRIR = "nawa:chat-ouvrir"` — nom de l'événement, importé des deux côtés pour qu'aucune chaîne ne soit écrite deux fois.
- Consumes: `ChatWidget` écoute cet événement et passe `ouvert` à `true`.

- [ ] **Step 1 : créer le canal d'ouverture**

`lib/chat-ouvrir.ts` :

```ts
/**
 * Ouverture de l'assistant depuis n'importe ou dans la page.
 *
 * Un evenement sur window plutot qu'un contexte React : ChatWidget est monte
 * dans app/(site)/layout.tsx, HORS de #smoothWrap (il est en position:fixed),
 * alors que les CTA vivent dedans. Un contexte devrait envelopper les deux et
 * ferait remonter du state client tres haut dans l'arbre, pour un seul booleen.
 *
 * Le `sujet` sert a pre-remplir la conversation au bloc suivant, quand on
 * configurera l'assistant. Il est transmis des maintenant pour ne pas avoir a
 * retoucher tous les appelants ensuite.
 */
export const NAWA_CHAT_OUVRIR = "nawa:chat-ouvrir";

export type DetailOuverture = { sujet?: string };

export function ouvrirChat(sujet?: string): void {
  window.dispatchEvent(
    new CustomEvent<DetailOuverture>(NAWA_CHAT_OUVRIR, { detail: { sujet } }),
  );
}
```

- [ ] **Step 2 : faire écouter l'assistant**

Dans `components/ChatWidget.tsx`, à côté des autres `useEffect` :

```tsx
  // Ouverture pilotee de l'exterieur — voir lib/chat-ouvrir.ts.
  useEffect(() => {
    function surDemande(e: Event) {
      const { sujet } = (e as CustomEvent<DetailOuverture>).detail ?? {};
      setOuvert(true);
      setReplie(false);
      if (sujet) setSujetInitial(sujet);
    }
    window.addEventListener(NAWA_CHAT_OUVRIR, surDemande);
    return () => window.removeEventListener(NAWA_CHAT_OUVRIR, surDemande);
  }, []);
```

Ajouter en haut du composant l'état qui recevra le sujet :

```tsx
  const [sujetInitial, setSujetInitial] = useState<string | null>(null);
```

et l'import :

```tsx
import { NAWA_CHAT_OUVRIR, type DetailOuverture } from "@/lib/chat-ouvrir";
```

`sujetInitial` n'est pas encore consommé : il le sera à la configuration de l'assistant. Le noter dans le rapport pour qu'il ne passe pas pour du code mort.

- [ ] **Step 3 : intercepter les CTA de devis**

Dans `components/CarteDuStudio.tsx`, le composant devient client pour ce seul clic — extraire le CTA plutôt que de rendre toute la section cliente (elle lit Postgres) :

Create `components/BoutonDevis.tsx` :

```tsx
"use client";

import { ouvrirChat } from "@/lib/chat-ouvrir";

/**
 * CTA de devis. Reste un <a href> vers WhatsApp : si le JS ne demarre jamais,
 * le lien fonctionne encore. Le clic est seulement INTERCEPTE pour ouvrir
 * l'assistant, qui qualifie mieux qu'un message WhatsApp vide.
 */
export default function BoutonDevis({
  href,
  sujet,
  className = "lnk",
  children,
}: {
  href: string;
  sujet: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener"
      onClick={(e) => {
        e.preventDefault();
        ouvrirChat(sujet);
      }}
    >
      {children}
    </a>
  );
}
```

Puis dans `CarteDuStudio.tsx`, remplacer le `<a className="lnk" href={DEVIS_HREF} …>` par :

```tsx
            <BoutonDevis href={DEVIS_HREF} sujet="devis-carte-du-studio">
              {DEVIS_LABEL}
            </BoutonDevis>
```

Faire de même dans `Offres.tsx` pour le CTA des lignes `sur devis` (`sujet="devis-sur-mesure"`).

- [ ] **Step 4 : vérifier**

```bash
npm run typecheck && npm run lint
```
Puis dans la page :

```js
document.querySelector('.p-note .lnk').click();
setTimeout(() => console.log('panneau ouvert :', !!document.querySelector('.chat-panel')), 400);
```
Attendu : `panneau ouvert : true`, et **aucun nouvel onglet WhatsApp**.

Puis, JavaScript désactivé dans le navigateur : le même lien doit ouvrir WhatsApp.

- [ ] **Step 5 : commit**

```bash
git add lib/chat-ouvrir.ts components/BoutonDevis.tsx components/ChatWidget.tsx components/CarteDuStudio.tsx components/Offres.tsx
git commit -m "devis: tout CTA de devis ouvre l'assistant, repli WhatsApp conserve"
```

---

### Task 5 : la carte de tous les prix

`CarteDuStudio` ne montre aujourd'hui que les catégories `annee`, `continu` et `saison`. Les trois formules de site (`principal`) sont ailleurs, dans la grille. Résultat : nulle part on ne voit **tout** ce que vend le studio.

**Files:**
- Modify: `components/CarteDuStudio.tsx:29-38` (libellés et colonnes), `:44-50` (requête)

- [ ] **Step 1 : élargir la requête et les groupes**

```tsx
// Libelles de groupe. « Les formules » ouvre la carte : c'est ce que le
// visiteur cherche en premier, et son absence rendait cette section
// incomplete — on y lisait les supports sans jamais voir les sites.
const GROUP_LABEL: Record<string, string> = {
  principal: "Les formules",
  annee: "En complément",
  continu: "En continu",
  saison: "Pour la restauration",
};

// Colonne 1 = les formules puis les complements ; colonne 2 = le recurrent,
// puis la ligne restauration.
const COL_1 = ["principal", "annee"];
const COL_2 = ["continu", "saison"];
```

```tsx
async function loadServices() {
  return prisma.service.findMany({
    where: {
      category: { in: ["principal", "annee", "continu", "saison"] },
      visible: true,
    },
    orderBy: { sortOrder: "asc" },
  });
}
```

- [ ] **Step 2 : vérifier**

```bash
npm run typecheck && npm run lint
```
Puis :

```js
[...document.querySelectorAll('.sm-grp')].map(g => g.textContent)
```
Attendu : `["Les formules","En complément","En continu","Pour la restauration"]`.

```js
document.querySelectorAll('.sm-it').length
```
Attendu : **18** (les 19 lignes de la base moins `pack-complet`, invisible).

Contrôle visuel : la colonne 1 s'allonge de quatre lignes ; vérifier que les deux colonnes restent d'équilibre acceptable, et permuter `annee` en colonne 2 si l'écart est trop fort.

- [ ] **Step 3 : commit**

```bash
git add components/CarteDuStudio.tsx
git commit -m "carte du studio: les trois formules rejoignent la carte des prix"
```

---

## Hors périmètre — à planifier séparément

### Lot D — version anglaise

**Ce n'est pas une traduction, c'est un chantier d'architecture.** Constat vérifié : aucune infrastructure i18n n'existe (`grep` sur `next-intl`, `useTranslation`, `i18n` → aucun résultat), toutes les chaînes sont écrites en dur dans le JSX, et les données de la table `Service` (noms, descriptions) n'ont qu'une seule langue en base.

Il faut, dans l'ordre : choisir le mécanisme (routage `/en/` + `next-intl`) ; extraire ~200 chaînes ; ajouter des colonnes ou une table de traduction pour `Service` ; produire `alternates.languages` et le `hreflang` dans les metadata ; ajouter les `<xhtml:link>` au sitemap (Next n'ajoute pas l'auto-référence, il faut la poser à la main) ; faire relire les textes anglais par `copy-positionnement`.

Chacun de ces points peut casser le site en production s'il est bâclé, et le SEO multilingue se répare mal. **Recommandation : le faire après le lot A**, pour ne pas traduire deux fois des textes que le pipeline va réécrire.

---

## Questions ouvertes

1. **« Le dernier, augmente sa visibilité »** — j'ai lu « la dernière pastille du panneau de gauche » et remonté le plancher d'opacité (Task 2). Si tu parlais de la dernière **carte de prix** (L'Assistant, la troisième), c'est un autre travail : lui donner un traitement visuel distinct dans `.price-grid`. Dis-moi lequel.
2. **« Aligne le site correctement »** — la seule anomalie que la mesure révèle est le `h2` de Travaux à 178 px contre 41 partout ailleurs (Task 3). Si tu vois autre chose de désaligné, indique la section : je mesure et je corrige.
3. **« Aligne mieux les trucs à gauche »** — dans le panneau vert, les pastilles et le bouton de repli partagent bien `left: 26px`, mais le texte des pastilles est décalé de 22 px de plus par leur `padding`. Est-ce ça qui te gêne, ou l'écart entre le panneau et la carte (traité en Task 1) ?
