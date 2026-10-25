# Inventaire des textes visibles du site public à changer (24.10.2026)

> Relevé le 24.10.2026 sur la branche `refonte/artisans`, mode `propose`.
> Version précédente archivée : `docs/agents/_archive/2026-10-24/copy/_inventaire.md`.
> Balayage : `lib/dictionnaires/fr.ts` et `en.ts`, `components/**`,
> `app/(site)/**`, `app/not-found.tsx`, `lib/chat-prompt.ts`, `lib/site.ts`,
> `lib/formules.ts`, `lib/familles.ts`, `lib/devis.ts`, `prisma/seed.ts`
> (lu par l'affichage). Aucun fichier `*.json`, `*.po`, `*.yml` de traduction :
> l'i18n passe par `lib/dictionnaires/*.ts`. `/admin` hors périmètre.
>
> **Pages publiques inventoriées : 9** (`/`, `/services`, `/services/[slug]`,
> `/studio`, `/demonstrations`, `/contact`, `/devis`, `/mentions-legales`,
> `/confidentialite`) **× 2 langues**, plus la 404, le chrome, les
> métadonnées, l'image de partage, les données structurées et le prompt.
>
> **Comptes** : 103 lignes ci-dessous (beaucoup regroupent plusieurs clés FR
> et EN) ; 92 à changer, 10 conformes notées pour mémoire, 1 renvoi.

## Codes

| Code | Problème |
|---|---|
| `OFF` | décrit une offre sortie (site, formules, imprimés, identité, photo, réseaux, restauration ; PM §5) |
| `PRX` | prix, « dès », « /mois », TVA, ou montant lu en base (PM §5 : aucun montant) |
| `DEL` | délai de l'ancienne offre (« une semaine », « feu vert ») ou délai non décidé |
| `PRV` | affirmation sans preuve dans PM ni veille |
| `CTL` | contredit « rien ne part sans vous » (automatique, 24/7, à votre place) |
| `IDT` | ancienne catégorie (« studio de création digitale », « designer ») |
| `GLO` | hors glossaire du guide (§10) |
| `VIB` | tic de site fabriqué (`anti-vibecode` : badge, tiret en série, « ce n'est pas X ») |
| `LNG` | contrainte de longueur |
| `DBL` | incohérence entre deux endroits |

Priorité : **haute** = faux, interdit ou ancienne offre visible ; **moyenne** =
affaiblit la promesse ; **basse** = confort.

## 1. Chrome partagé → `_chrome.md`

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| toutes | pastille nav | `fr.ts:95` / `en.ts:72` | Mon aperçu / My preview | `OFF` aperçu de site | haute |
| toutes | nav, entrée inutilisée | `fr.ts:88` / `en.ts:68` | Tous les services / All services | `OFF` | basse |
| toutes | loader + kicker | `fr.ts:250` / `en.ts:151` (rendu `Loader.tsx:47`) | Studio de création digitale / Digital design studio | `IDT` `OFF` | haute |
| toutes | formulaire, placeholder | `fr.ts:196` / `en.ts:120` | Votre besoin, et votre site actuel si vous en avez un | `OFF` | haute |
| toutes | formulaire, bouton | `fr.ts:208` / `en.ts:124` | Envoyer ma demande / Send my request | `GLO` collision avec « une demande » du patron | moyenne |
| toutes | formulaire, succès et erreurs | `fr.ts:212-222` / `en.ts:126-130` | Message reçu — il arrive directement sur notre téléphone… | conforme | — |
| toutes | pied, titre | `fr.ts:159-161` / `en.ts:98-100` | Montrez-nous ce que vous avez. Nous vous disons ce qui manque. | `OFF` audit de site | haute |
| toutes | pied, amorce | `fr.ts:165` / `en.ts:102` | ou dites-nous en deux lignes ce qu'il vous faut | `GLO` | moyenne |
| toutes | pied, bande légale | `fr.ts:177-178` / `en.ts:109-111` | Studio de création digitale — Genève · Sites pour artisans du bâtiment | `IDT` `OFF` | haute |
| toutes | pied, slogan | `fr.ts:175` / `en.ts:108` | L'essentiel. Bien conçu. | conforme (signature, brand §2) | — |
| toutes | pied, horaires, copyright, lieu, liens légaux | `fr.ts:167-180` / `en.ts:103-113` | — | conforme | — |
| toutes | réactivité | `lib/familles.ts:355`, `:367` | Réponse le jour ouvrable suivant. / A reply the next working day. | conforme, formule unique | — |
| toutes | bulle, accueil | `ChatWidget.tsx:249-250` / `:295-296` | Bonjour, je suis Leo… Nous faisons le logotype, les imprimés, les photos, les réseaux sociaux, les supports de restaurant et les sites… | `OFF` | haute |
| toutes | bulle, accueil ciblé | `ChatWidget.tsx:273-274` / `:298-299` | Votre demande porte sur « … » — c'est noté… | `VIB` tiret ; ton | basse |
| toutes | bulle, invite | `ChatWidget.tsx:275` / `:300` | Décrivez votre besoin — réponse le jour ouvrable suivant | `GLO` | moyenne |
| toutes | bulle, titre | `ChatWidget.tsx:276` / `:301` | Leo — assistant Nawa Corps | `PRV` doit se dire démonstration (PM §6) | haute |
| toutes | bulle, clôture | `ChatWidget.tsx:283-284` / `:308-309` | C'est noté — nous revenons vers vous… · Envoyer ma demande | `GLO` | moyenne |
| toutes | bulle, autres libellés | `ChatWidget.tsx:277-292` / `:302-317` | fermer, note, indispo, placeholders… | conforme | — |

## 2. Accueil `/` et `/en` → `accueil.md`

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| / | kicker lieu, cible | `fr.ts:251-252` / `en.ts:152-154` | Genève, Suisse · Pour les artisans du bâtiment | `OFF` | haute |
| / | h1 fixe | `fr.ts:258` / `en.ts:155` | Un site qui / A website that | `OFF` | haute |
| / | h1 rotation | `fr.ts:259` / `en.ts:156` | vend. · qualifie vos demandes. · vous fait gagner du temps. | `OFF` ; `LNG` 22 et 26 signes > 21 ; « gagner du temps » banni (guide §10 n°14) | haute |
| / | h1 complet (aria) | `fr.ts:260` / `en.ts:157` | Un site qui vend, qualifie vos demandes et vous fait gagner du temps. | `OFF` | haute |
| / | sous-titre | `fr.ts:261-262` / `en.ts:158-159` | Pour les artisans genevois : des demandes précises, moins de téléphone, et votre site vu avant de payer. | `OFF` | haute |
| / | CTA hero | `fr.ts:267-268` / `en.ts:164-165` | Recevoir mon aperçu · Voir l'offre | `OFF` | haute |
| / | temps 2 | `fr.ts:272-275` / `en.ts:168-171` | Le noyau · La demande arrive complète, avec photos. Vous chiffrez, le devis se relance. | `OFF` `CTL` « se relance » seul | haute |
| / | temps 3, mot et unité | `fr.ts:287-289` / `en.ts:181-183` | Le cœur · Tout · de bout en bout | `OFF` | haute |
| / | temps 3, faits | `fr.ts:290-300` / `en.ts:184-195` | Atelier Genève · Le site En ligne en une semaine · Vos devis Relancés pour vous · Vos textes Repris de votre site · Suivi Sans engagement | `OFF` `DEL` ; « sans engagement » non décidé (PM §10 n°6) | haute |
| / | temps 4 | `fr.ts:306-309` / `en.ts:197-200` | Plus aucune demande perdue pendant vos chantiers. · Recevoir mon aperçu · Voir l'offre | `PRV` résultat non mesuré (brand §2) ; `OFF` | haute |
| / | bande défilante | `fr.ts:339-344` / `en.ts:221-226` | Site pour artisans · Demandes avec photos · Devis relancés · Réponse automatique · Une semaine dès votre feu vert · Genève | `OFF` `CTL` `DEL` | haute |
| / | (01) titre | `fr.ts:366-368` / `en.ts:239-241` | Services · Cinq gestes, / le même endroit. | `OFF` ; `DBL` « cinq » pour quatre lignes (FR), EN dit « Four pieces » | haute |
| / | (01) lignes 01-04 | `fr.ts:374-389` / `en.ts:243-258` | Le site · Les demandes, triées · Réponse et notification · Vos devis relancés (+ corps et renvois « Voir l'offre et le prix ») | `OFF` `PRX` `DEL` ; `PRV` « Beaucoup de devis restent sans réponse » (`fr.ts:388`) | haute |
| / | (02) Méthode | `fr.ts:400-420` / `en.ts:272-293` | Du feu vert à la mise en ligne : une semaine · Le premier appel · L'aperçu · La mise en ligne · Le suivi… Sans engagement · Voir l'offre et le prix | `OFF` `DEL` `PRX` | haute |
| / | (03) Studio, citation | `fr.ts:434-436` / `en.ts:303-305` | « Vous parlez à ceux qui *font* le travail. » | toujours vrai, mais rôle de section changé | basse |
| / | (03) Studio, paragraphes | `fr.ts:437-442` / `en.ts:306-311` | Nawa Corps est le studio de création digitale… le site des artisans du bâtiment… | `IDT` `OFF` | haute |
| / | (03) Studio, faits | `fr.ts:455-459` / `en.ts:316-319` | Une semaine / Site en ligne · FR / EN / Langues | `OFF` `DEL` | haute |
| / | (04) Offres, titre | `fr.ts:477-480` / `en.ts:334-337` | Offres · Des prix clairs, tout compris. · Recommandé | `PRX` ; `VIB` badge (n°33) | haute |
| / | (04) Offres, puces et CTA | `fr.ts:481-503` / `en.ts:338-358` | Une page, lisible sur téléphone… · Rendre mon site présentable · Recevoir mes demandes · Automatiser mes demandes | `OFF` ; `CTL` « Automatiser » | haute |
| / | (04) Offres, notes de prix | `fr.ts:505-520` / `en.ts:359-367` | puis [x] dès la 2ᵉ année — obligatoire… · Suivi et hébergement dès… · Prix en francs suisses · Deux allers-retours… · Demander un devis → | `PRX` `OFF` | haute |
| / | (04) Offres, cartes lues en base | `Offres.tsx:198-269` ← `prisma/seed.ts:84-127`, `lib/formules.ts:131-153` | La Vitrine 699.– · Le Site 1'499.– · L'Assistant 2'499.– · Être présentable · Recevoir les demandes · Les traiter sans vous | `PRX` `OFF` (PM §5 : « aucun composant ne doit afficher ces prix ») | haute |
| / | (05) FAQ | `fr.ts:568-601` / `en.ts:391-417` | Une semaine, vraiment ? · Je n'ai ni textes ni photos… · Qui gère l'hébergement… [montants] · Et après… · À ce prix-là… · Demander un devis · Voir les formules | `OFF` `PRX` `DEL` | haute |
| / | (05) FAQ, montants recollés | `Faq.tsx:62-67` | [suivi].–/mois … [assistant].–/mois … TVA comprise | `PRX` | haute |
| / | (06) Contact | voir §1 | — | — | — |
| / | carte du studio (non rendue sur l'accueil) | `fr.ts:533-550` / `en.ts:371-385` | Tout ce que fait le studio · Le site est le produit d'entrée… | `OFF` ; plus rendue depuis le 24.10, à retirer du dictionnaire | basse |
| / | Travaux (non rendus) | `fr.ts:349-355` / `en.ts:230-235` | Tout a un avant. Voici les après. | `OFF` ; plus rendus | basse |

## 3. Métadonnées, OG, données structurées → `meta.md`

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| / | title, og, twitter | `app/(site)/layout.tsx:88`, `:99`, `:105` | Site pour artisans du bâtiment à Genève — demandes triées, devis relancés | `OFF` | haute |
| / | description, og, twitter | `layout.tsx:91-92`, `:100-101`, `:106-107` ; `app/(site)/page.tsx:41` | Nawa Corps fait le site des artisans du bâtiment genevois… En ligne en une semaine… | `OFF` `DEL` | haute |
| / | suffixe prix | `app/(site)/page.tsx:48` | Dès [x].–, TVA comprise. | `PRX` | haute |
| /en | title, description, prix | `app/(site)/en/page.tsx:78-80`, `:136` | Websites for building tradespeople in Geneva… · From [x].–, VAT included. | `OFF` `PRX` | haute |
| toutes | image OG | `app/(site)/opengraph-image.tsx:21`, `:62-63`, `:66` | Studio de création digitale, Genève · Plus aucune demande perdue. Le site des artisans du bâtiment, à Genève. | `IDT` `OFF` `PRV` | haute |
| toutes | image OG statique | `public/brand/og-nawa-corps.png` via `lib/site.ts:230` | (image, texte non lu) | à vérifier et régénérer | moyenne |
| toutes | repli de titre OG | `lib/site.ts:280-281` | studio de création digitale à Genève / digital design studio in Geneva | `IDT` | moyenne |
| toutes | amorce WhatsApp par défaut | `lib/site.ts:158-159` | Bonjour, j'aimerais faire refaire le site de mon entreprise. | `OFF` | haute |
| / | JSON-LD studio | `components/SchemaStudio.tsx:73-82`, `:91-93`, `:126` | Refonte de site · Identité visuelle… · « Studio de création digitale indépendant… refait en une semaine » · L'essentiel. Bien conçu. · Services du studio | `OFF` `IDT` `DEL` | haute |
| /services/* | JSON-LD Service + Offer | `services/[slug]/page.tsx:430-471` | price, priceCurrency CHF | `PRX` `OFF` | haute |
| /mentions-legales | description, og | `mentions-legales/page.tsx:47`, `:52` | …studio de création digitale indépendant à Genève… | `IDT` | moyenne |
| /mentions-legales | éditeur | `mentions-legales/page.tsx:77` | Nawa Corps, studio de création digitale, Genève, Suisse, exploité par Ayoub Bensalem. | `IDT` ; texte légal : changer la seule catégorie, relecture d'Ayoub | moyenne |
| /confidentialite | hébergement | `confidentialite/page.tsx:81-82` | Vercel… Francfort… fournisseur d'IA hors de Suisse | conforme et vrai ; fonde l'interdit S1 | — |

## 4. `/services` et `/en/services` → `services.md`

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| /services | métadonnées | `services/page.tsx:288-290` / `:325-329` | Services et tarifs à Genève · Le catalogue du studio genevois… | `OFF` `PRX` | haute |
| /services | en-tête | `:291-301` / `:330-343` | Catalogue · Tout ce que fait le studio, à Genève. · Trois lignes en vitrine… · Le délai est d'une semaine… | `OFF` `DEL` | haute |
| /services | comptes de prix | `:302-308` / `:348-361` ; `lib/familles.ts:289-339` | N lignes portent un prix ferme… · Les lignes annoncées sur devis le sont volontairement… · Demander un devis → | `PRX` `OFF` | haute |
| /services | formules | `:309-314` / `:362-369` | Les formules · Trois paliers, un seul site. · Pour la PME genevoise dont le site a plus de cinq ans… | `OFF` `PRX` `DEL` | haute |
| /services | bascule | `:315-319` / `:370-374` | Le reste du catalogue · Logo et photos, hébergement du site, restaurants et cafés… | `OFF` | haute |
| /services | blocs de famille | `:252-284` ; `lib/familles.ts:396-1107` | Le site vit, et il est tenu. · Ce qui se voit ailleurs qu'à l'écran. · Ce qui fait qu'on vous reconnaît. · (h1, accroches, pièces, amorces des 3 familles) | `OFF` `PRX` | haute |
| /services | fil d'Ariane | `:321` / `:376` | Accueil / Services | `GLO` | basse |

## 5. `/services/[slug]` et `/en/services/[slug]` → `services-slug.md`

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| /services/la-vitrine, /le-site, /l-assistant | toute la page | `services/[slug]/page.tsx:182-273` | Services · Périmètre à définir · Une semaine · Dès votre feu vert · Suivi obligatoire · Prix en francs suisses, TVA comprise… · Ce que vous recevez · Il faut monter à… | `OFF` `PRX` `DEL` | haute |
| idem | contenu des formules | `lib/formules.ts:164-193`, `:289-511` | Socle · h1 · seoTitre · resout · apporte (« répond 24/7 ») · cta · amorces · questions | `OFF` `PRX` `DEL` `CTL` ; `PRV` S11 (`:485`) | haute |

## 6. `/studio` et `/en/studio` → `studio.md`

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| /studio | métadonnées | `studio/page.tsx:104-106` ; EN `:110-112` | Ayoub Bensalem, studio de création digitale à Genève · …comment se passe une refonte… | `IDT` `OFF` | haute |
| /studio | lede, faits | `:205-232` ; EN `:201-230` | Nawa Corps est le studio de création digitale d'Ayoub Bensalem… · Designer et développeur · Une semaine / Refonte livrée · Dès votre feu vert | `IDT` `OFF` `DEL` | haute |
| /studio | (01) Qui vous parle | `:253-278` ; EN `:248-280` | Ayoub Bensalem, designer et développeur… · réseaux sociaux avec un partenaire… · Un an après la mise en ligne… | `IDT` `OFF` | haute |
| /studio | image | `:312` | Papiers de couleur, cartes vierges, spécimen typographique… | `OFF` (image et alt) | moyenne |
| /studio | (02) Le déroulé | `:327-401` ; EN `:294-370` | Six moments… maquette, allers-retours, mise en ligne, suivi obligatoire avec L'Assistant… · Voir les formules et les prix → | `OFF` `PRX` `DEL` | haute |
| /studio | (03) Le métier | `:411-465` ; EN `:386-433` | Cinq lignes de travail, un seul endroit. · Sites, identité, imprimés, photographie, réseaux sociaux… | `OFF` | haute |
| /studio | (04) Le périmètre | `:479-518` ; EN `:457-485` | boutiques en ligne · appels d'offres · sociétés avec développeurs · urgences à la demi-journée · Le refus n'est pas une posture… | `OFF` ; anti-ICP de l'ancienne offre | haute |
| /studio | (05) La démonstration | `:528-572` ; EN `:500-539` | Le produit tourne sur cet écran. · Le troisième palier s'appelle L'Assistant… · Demander un devis · Voir les formules | `OFF` `PRV` S11 | haute |
| /studio | JSON-LD Person | `:166` | Designer et développeur | `IDT` | moyenne |
| /studio | h1, h2 (01), (04) | `:199-201`, `:245-247`, `:479-481` | Qui fait le travail, et comment. · Vous parlez à qui fait le travail. · Ce que nous ne prenons pas. | conforme | — |

## 7. `/demonstrations` et `/en/demonstrations` → `demonstrations.md`

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| /demonstrations | métadonnées | `demonstrations/page.tsx:66-68` ; EN `:68-69` | Démonstrations du studio · Cinq pièces dessinées par le studio… | `OFF` | haute |
| /demonstrations | en-tête | `:107-139` ; EN `:112-…` | Cinq pièces, faites pour montrer. · Une carte, un site… · Ces cinq pièces sont des démonstrations… Le studio est jeune… | `OFF` (PM §6 : hors sujet pour l'assistant) | haute |
| /demonstrations | carrousel | `components/ui/feature-carousel.tsx:344-376` (+ aria `:192`, `:489`, `:525`, `:532`) | La carte · Le site · La carte de visite · L'affiche · La fidélité · « Enseigne fictive. » | `OFF` | haute |
| /demonstrations | (01) La sixième | `:157-182` | La dernière ne se regarde pas. · l'assistant du troisième palier… catalogue et tarifs… · Voir les formules et les prix → | `OFF` `PRX` `PRV` S11 | haute |
| /demonstrations | (02) Votre commerce ici | `:195-222` | Le même travail, avec votre métier. · un bar… un garage, un cabinet et une fiduciaire… · Demander un devis · Voir les formules | `OFF` | haute |

## 8. `/contact` et `/en/contact` → `contact.md`

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| /contact | description | `contact/page.tsx:119-120` ; EN `:138` | WhatsApp, téléphone, e-mail ou le formulaire… | `GLO` | moyenne |
| /contact | amorce WhatsApp | `:198-200` ; EN `:195` | Bonjour, j'aimerais parler d'un projet pour mon entreprise. | `OFF` | moyenne |
| /contact | chemins | `:280-298`, `:312-315` | …une photo de votre carte de visite, l'adresse de votre site… · pour un état des lieux… · refonte de site, identité, imprimés, photographie, réseaux sociaux, devis. | `OFF` | haute |
| /contact | (02) Votre message | `:353-386` | Cinq lignes, et nous chiffrons déjà. · l'adresse de votre site actuel… ce que vous voulez recevoir… le site illisible… | `OFF` | haute |
| /contact | bande de fin | `:406` | Nawa Corps · Studio de création digitale | `IDT` | moyenne |
| /contact | JSON-LD | `:172` | Demandes de projet | `GLO` | basse |
| /contact | h1, lede, faits, formulaire | `:226-254`, `:322-325` | Quatre façons de nous joindre… | conforme | — |

## 9. `/devis` et `/en/devis` → `devis.md`

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| /devis | métadonnées | `devis/page.tsx:62-64` ; EN `:94-95` | Demander un devis · Décrivez votre besoin… | `OFF` | haute |
| /devis | en-tête | `:134`, `:150-164` ; EN `:186-…` | Demander un devis · Devis · Dites ce qu'il vous faut. · Votre demande porte sur « … » | `OFF` | haute |
| /devis | faits lus en base | `:174-218` | [nom de la formule] · [prix] · TVA comprise · raison du devis · Prix en francs suisses, TVA comprise. | `PRX` `OFF` | haute |
| /devis | (01) Votre message | `:226-260` | Quatre lignes, et nous chiffrons déjà. · nous reprenons ce qui est déjà en ligne… · l'adresse de votre site actuel… | `OFF` | haute |
| /devis | boutons | `:288` | Voir tous les services | `OFF` | moyenne |
| /devis | amorces WhatsApp | `lib/devis.ts:74-75`, `:155-189` | Bonjour, j'aimerais un devis pour mon entreprise. · …un site à plusieurs pages · …la refonte du site… | `OFF` | haute |

## 10. 404 → `not-found.md`

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| 404 (site) | corps et lien | `app/(site)/not-found.tsx:44-46` ; `en/not-found.tsx` (corps) | …la prestation qu'elle décrivait n'est plus au catalogue… Le catalogue complet — les trois formules de site… · Voir tous les services | `OFF` | haute |
| 404 (racine) | lien | `app/not-found.tsx:103`, `:111` | Voir tous les services → | `OFF` | moyenne |
| 404 | titres, h1, retour | `not-found.tsx:40-47`, `app/not-found.tsx:98-102`, `:122-125` | Erreur 404 · Cette page n'existe plus. · ← Retour au site | conforme | — |

## 11. Prompt de l'assistant → `chatbot.md`

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| toutes | catalogue injecté | `lib/chat-prompt.ts:280-291` ← `prisma/seed.ts:84-318` | 18 lignes : noms, prix, descriptions | `PRX` `OFF` | haute |
| toutes | rôle et périmètre | `:309-319` / `:538-547` | studio de création digitale… l'IMAGE… logotype, cartes de visite… | `IDT` `OFF` | haute |
| toutes | déroulé 7 étapes | `:322-414` / `:550-638` | décrire la prestation, donner son prix TVA comprise, demander les fichiers… | `OFF` `PRX` | haute |
| toutes | règles prix, délais, feu vert | `:416-436` / `:640-664` | Prix… Format des prix… « une semaine » ne concerne QUE le site… | `PRX` `DEL` `OFF` | haute |
| toutes | règles Google, nous, Leo, équipe, une question, texte brut | `:437-524` / `:665-746` | — | conformes, reprises | — |

## 12. Base de données (lue par l'affichage, non modifiable sans accord : PM §5)

| Page | Section | Fichier:ligne | Texte actuel | Problème | Prio |
|---|---|---|---|---|---|
| /, /services, /devis, prompt | noms et descriptions | `prisma/seed.ts:84-318` | La Vitrine · Le Site · L'Assistant · Site à plusieurs pages · Hébergement et suivi… · Réseaux sociaux… · Cartes de visite… · Menu de restaurant… | `OFF` `PRX` : **ne plus les lire à l'écran** plutôt que les réécrire | haute |
