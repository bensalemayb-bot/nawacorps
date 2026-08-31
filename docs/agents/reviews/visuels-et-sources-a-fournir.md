# Visuels et sources à fournir

> **Relevé du 31 août 2026**, après la revue de marque et son application.
> Établi en lisant le code, pas en imaginant une charte : chaque ligne dit où
> le fichier sert, ce qu'il débloque, et ce qui est déjà câblé pour l'accueillir.
>
> Rien ici n'est décoratif. Une image absente laisse un trou visible, une
> autorisation absente bloque une correction identifiée.

---

## 1. Ce qui existe déjà — ne pas le refaire

`public/brand/` contient onze fichiers. **Cinq sont utilisés par le code :**

| Fichier | Où il sert |
|---|---|
| `noyau.webp` (1448×1086) + `noyau-800.webp` | Le visuel du hero, en deux tailles. C'est très probablement le LCP sur téléphone. |
| `nawa-corps-logo-principal-transparent.png` | `image` et `logo` du `ProfessionalService` en donnée structurée |
| `nawa-corps-logo-iconique-transparent.png` | Interface |
| `og-nawa-corps.png` (1200×630) | **L'aperçu de partage des 14 pages.** Créé aujourd'hui en figeant le rendu de `app/(site)/opengraph-image.tsx`. |
| `app/icon.png` | Favicon |

**Six sont présents mais référencés nulle part** : `favicon-512.png`, `favicon-64.png`, `nawa-corps-icone-simple-transparent.png`, `nawa-corps-logo-avec-slogan-transparent.png`, `nawa-corps-logo-fond-fonce-transparent.png`, `nawa-corps-logo-horizontal-transparent.png`. Ils ne gênent pas — et ils serviront pour la fiche Google et les profils sociaux, qui demandent des formats différents.

---

## 2. Les images à fournir

Classées par ce qu'elles coûtent au site tant qu'elles manquent.

### 2.1 — Le portrait. C'est le plus important, et de loin.

| | |
|---|---|
| **Fichier** | `public/brand/ayoub-bensalem.jpg` |
| **Format** | JPEG, **1200 × 1200** (carré), sous 250 Ko |
| **Ce qu'elle montre** | Vous, en train de travailler, à Genève. Pas un portrait de studio sur fond gris — l'atelier, l'écran, la rue. Le visage net et reconnaissable. |
| **Où elle sert** | `/studio`, le `Person` en donnée structurée (`image`), et la fiche Google |
| **Ce qu'elle débloque** | **Le site vend « une seule personne, et vous lui parlez » — et ne montre aucun visage.** C'est l'argument central du positionnement, livré sans preuve visuelle. Le nœud `Person` est déjà en place sur `/studio` et attend son `image` : une ligne à ajouter. |

Un second cadrage paysage, **1600 × 1000**, servirait à `/studio` en pleine largeur si vous voulez l'y voir. Optionnel.

### 2.2 — Le carrousel : la vraie preuve

Les cinq pièces « avant / après » de l'accueil sont aujourd'hui **dessinées en HTML et CSS**, pour un bar inventé appelé Le Comptoir. Elles sont honnêtement étiquetées « démonstration », donc la règle de preuve est tenue — mais quatre des cinq parlent de restauration, la ligne que le positionnement a rétrogradée en secondaire, et **une seule montre un site**.

| Ce qu'il faut | Format | Priorité |
|---|---|---|
| **Un site de PME genevoise, avant et après** — capture pleine page du site d'origine, puis du refait | PNG, largeur 1600 px minimum, hauteur libre | **La plus haute du projet.** C'est la référence n°1 que votre propre document appelle le risque n°1 du plan. |
| La carte de restaurant de votre client réel, avant et après | Photo ou export, 2000 px de large | Débloque le retrait du Comptoir |
| Des cartes de visite réellement imprimées, en main ou sur une table | Photo, 2000 px | Remplace une maquette par un objet |
| Une affiche réelle, en situation — vitrine, mur, comptoir | Photo, 2000 px | idem |
| Une carte de fidélité réelle, tamponnée | Photo, 2000 px | idem |

> **Une décision à prendre ensemble avant que vous ne shootiez.** Les panneaux actuels sont du dessin, pas des images : y mettre des photographies demande de retoucher le composant, donc votre maquette. Je ne le fais pas sans votre accord. Donnez-moi une pièce d'exemple et je vous dis exactement quel cadrage et quel rapport tenir.

### 2.3 — Les aperçus de partage par page

Aujourd'hui les 14 pages partagent la **même** image. C'est déjà bien mieux qu'une page sur quatorze, mais trois pages méritent la leur.

| Fichier | Dimensions | Contenu |
|---|---|---|
| `public/brand/og-la-vitrine.png` | 1200 × 630 | Le nom de la formule, `699.–`, « TVA comprise » |
| `public/brand/og-le-site.png` | 1200 × 630 | idem, `1'499.–` |
| `public/brand/og-l-assistant.png` | 1200 × 630 | idem, `2'499.–` + « suivi 129.–/mois obligatoire » |

Si vous ne les fournissez pas, je peux les générer comme l'image actuelle — texte sur fond, sans photographie. Dites-le et je le fais.

### 2.4 — Ce que vous vendez et ne montrez pas

| Ce qu'il faut | Format | Pourquoi |
|---|---|---|
| **Photos d'entreprise, un exemple** | 1600 × 1200, 3 à 5 vues | « Photos de votre entreprise » est vendu dans deux formules sur trois et dans le catalogue. Aucun exemple n'existe nulle part. |
| **Une fiche Google complétée, capture** | 1400 px de large | « Fiche Google complétée » est vendu dans deux formules. Vous montrerez la vôtre une fois validée. |
| **`apple-icon.png`** | 180 × 180, PNG | Absent. Un raccourci iOS vers le site prend aujourd'hui une capture d'écran floue à la place de l'icône. |

---

## 3. Les sources et autorisations

Ce ne sont pas des images, et elles bloquent davantage.

| # | Ce qu'il faut | Ce que ça débloque | État |
|---|---|---|---|
| 1 | **L'accord écrit de votre client** pour montrer sa carte | Le constat 17 de la revue — le **seul** des 25 qui reste non appliqué. Le Comptoir sort, un vrai client entre. | à demander |
| 2 | **L'URL de votre fiche Google**, une fois validée | Le `sameAs` du `ProfessionalService` et du `Person`. **Il n'existe aujourd'hui aucun `sameAs` sur le site** : rien ne relie le site à la fiche, et rien ne dit à Google que les deux sont la même entreprise. | 1 à 2 semaines de validation |
| 3 | **L'autorisation écrite du partenaire** pour le portfolio, avec votre rôle exact sur chaque pièce | Toute présentation d'un travail réalisé au sein de l'agence. Sans elle, aucune pièce ne peut être montrée. | ouvert au §7 du positionnement |
| 4 | **Une première référence de site PME** — avant / après et deux phrases du gérant | Le carrousel, la crédibilité entière du positionnement, et le discours de vente | **risque n°1 du plan, inchangé** |
| 5 | **Forme juridique et numéro d'identification** (IDE si applicable) | Les mentions légales. La rubrique « Éditeur » ne porte aujourd'hui qu'un nom et une ville. | décision non prise |
| 6 | **Vos comptes sociaux, s'ils existent** — LinkedIn, Instagram | Le `sameAs`, avec la fiche Google. Un profil actif est un signal d'entité que le site ne peut pas fabriquer seul. | à confirmer |

---

## 4. Ce que je câble dès réception

Rien de ce qui suit n'est écrit à l'avance : pointer une image inexistante vaut
moins que ne rien déclarer, et une donnée structurée qui ment se retourne
contre le site.

| Vous me donnez | J'ajoute |
|---|---|
| Le portrait | `image` sur le nœud `Person` de `/studio`, et le visuel dans la page |
| L'URL de la fiche Google | `sameAs` sur `ProfessionalService` **et** sur `Person`, dans `components/SchemaStudio.tsx` et `app/(site)/studio/page.tsx` |
| Les comptes sociaux | les mêmes `sameAs`, dans la même liste |
| La forme juridique | la rubrique « Éditeur » des mentions légales |
| L'accord du client | le remplacement des pièces du Comptoir, après décision sur le format des panneaux |
| La première référence PME | le premier panneau du carrousel, et une page de cas si vous en voulez une |
| `apple-icon.png` | rien à écrire — Next le détecte par convention de fichier |
