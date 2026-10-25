# Audit CRO et SEO — site Nawa Corps, 25.10.2026 (v4)

Lecture seule. Aucun fichier du site n'a été modifié. J'ai repris les mêmes cinq critères et la même échelle sur 10 que la v1, la v2 et la v3.

**Ce qui a été lu.** Le rendu HTML des 36 URL de `/sitemap.xml`, les 6 pages légales, `/robots.txt`, `/llms.txt`, deux anciennes URL et deux 404. Pour chaque page : status, title, meta, robots, canonical, hreflang, h1, h2 et h3, JSON-LD (parsé), alt des images, liens internes et 100 premiers mots. Les 44 liens internes distincts ont été testés un par un. La duplication a été mesurée phrase par phrase sur les 11 pages métiers.
**Le code lu.** `lib/site.ts`, `lib/chiffres.ts`, `lib/chat-prompt.ts` (l. 195–300), `lib/automatisations.ts` (par recherche), `next.config.ts`, `app/(site)/studio/page.tsx`.
**Ce qui n'a pas été fait.** Je n'ai eu aucune conversation avec Leo : `.env.local` pointe sur la base de production, et une conversation finalisée y écrit un lead et envoie une notification Telegram. Leo est donc jugé sur son prompt. Je n'ai fait aucun contrôle visuel à 375 px dans cette passe ; les constats mobile de la v3 sont repris tels quels. Aucun outil SEO n'est branché : **aucun volume de recherche n'est cité**.

Le lecteur visé ne change pas : un patron sanitaire genevois qui lit sur son téléphone, entre deux chantiers.

---

## 1. Résumé exécutif

Les correctifs de code demandés en v3 sont presque tous faits, et faits proprement :
- la formule interdite a disparu partout ;
- le prix barré a été retiré, et la CGV est alignée sur « résiliable chaque mois » ;
- le palier Complet est dit à chaque mention du téléphone ;
- les métiers voisins sont en place, et les pages légales passent en `noindex` hors du sitemap ;
- `/en` porte son `ProfessionalService`, le title de la 404 est corrigé, et le kicker dit « Assistant IA pour PME ».

Deux ajouts nouveaux tirent le site vers le haut :
- **`/demonstrations`** : 22 exemples en quatre temps, honnêtement étiquetés comme fictifs. C'est la meilleure preuve que le site puisse donner sans client.
- **Les questions de découverte de Leo** : le patron chiffre lui-même ce que ça lui coûte.

Ce qui bloque encore :
1. **La confiance.** 20 marqueurs « [À COMPLÉTER] / [À VÉRIFIER] » restent visibles sur les 6 pages légales, liées depuis le pied de chaque page. L'adresse manque toujours (LCD art. 3 al. 1 let. s). `/studio` affiche encore « 11 métiers, une base pour chacun », que la v3 avait déjà relevé. Et les pages citent « CCIG 2026 », alors que `lib/chiffres.ts` écarte cette source comme trop faible.
2. **Un nouveau concurrent romand** : la recherche fait remonter **IA Swiss**, qui se présente avec des « assistants métier sur mesure (devis, régie, emails) » hébergés en Suisse. Le pilier n° 1 (« aucune agence ne le dit ») n'est plus vrai sans nuance. C'est à vérifier, et `product-marketing.md` doit être mis à jour.
3. **Le SEO hors site est toujours à zéro** : pas de fiche Google, pas d'annuaire, pas de lien entrant. Et `/demonstrations`, la page la plus riche (3 900 mots), n'a ni « IA » ni « Genève » dans son title ni dans ses 100 premiers mots.

---

## 2. Les notes

| Axe | v1 | v2 | v3 | **v4** | Justification (preuve) |
|---|---:|---:|---:|---:|---|
| Compréhension (5 s) | 6 | 8 | 8,5 | **9** | Le kicker dit enfin « Assistant IA pour PME ». Le h1 de `/services` devient « L'assistant IA, en détail. ». `/demonstrations` montre le geste concret (arrive → prépare → vous validez → part). Pourquoi pas plus : le h1 du hero tourne sur 4 verbes, donc le lecteur pressé n'en voit qu'un ; et la double numérotation `(001)`/`(01)` est toujours là. |
| Douleur | 4 | 7 | 7,5 | **8** | Les 4 chiffres sont sourcés, sans tricher, et la phrase « pas de nos clients » est la bonne. Leo fait chiffrer au patron ses soirées perdues. Les blocs « Ce qui vous prend vos soirées » sont justes. Pourquoi pas plus : le chiffre de tête est **français** (CAPEB) ; aucune voix genevoise réelle (0 appel sur 10) ; un seul chiffre est suisse, et il porte sur la charge réglementaire, pas sur le bureau du soir. |
| Envie d'agir | 5 | 7 | 8 | **8,5** | Le prix barré a disparu, la CGV dit « effet à la fin du mois en cours », et chaque exemple de `/demonstrations` mène à sa page métier, puis à la démo. Pourquoi pas plus : **la durée de l'essai est toujours absente** (la CGV dit « la durée fixée dans l'offre ») ; `/devis` n'a **aucun lien `tel:`** ; il n'y a toujours pas de barre d'action mobile ; et Leo doit poser 3 questions avant de dire ce que fait l'assistant (friction pour le patron pressé, voir 4.10). |
| Confiance | 5 | 5,5 | 6 | **6,5** | Il ne reste aucune formule interdite, aucun « TVA comprise », aucun délai en heures, aucun aveu de débutant, aucun compteur fictif sur l'accueil. Les pages légales sont en `noindex`. Pourquoi pas plus : **20 marqueurs de brouillon sont toujours visibles**, l'adresse manque, la case « 11 métiers » est toujours là, CCIG 2026 est cité alors qu'il est écarté en interne, il n'y a pas de photo d'Ayoub, et certaines démos supposent un agenda branché (« d'après votre agenda »). |
| SEO | 4 | 5,5 | 7 | **7,5** | Côté acquis : les métiers voisins et le lien vers `/services` sur les 11 pages ; tous les titles ≤ 60 et toutes les metas ≤ 155 ; un h1 unique sur 42 pages ; hreflang sur toutes les pages ; `ProfessionalService` sur `/en` ; la 404 en `noindex` avec son propre title ; aucun lien cassé ; et une nouvelle page riche indexable. Pourquoi pas plus : **aucun signal local hors site** ; `/demonstrations` est sans mot-clé et sans JSON-LD utile ; la part de texte commune aux pages métiers reste entre 38 et 45 % ; `/services/*` redirige encore vers `/` ; et `valueAddedTaxIncluded` manque toujours. |

---

## 3. Ce qui a vraiment progressé depuis v3

- **Les formules interdites** : 0 « rien ne part sans », 0 « TVA comprise », 0 « trois demandes », 0 délai en heures. Les seuls « 9h–19h » sont des horaires, et le « 24 heures » de la confidentialité est la durée d'un cookie. Aucun « parmi les premiers », ni en FR ni en EN.
- **La mention TVA** : chaque montant affiché la porte (accueil 11 montants et 9 mentions, mais les 3 paliers de la FAQ partagent une mention en fin de phrase : c'est conforme ; `/services` 5/5 ; pages métiers 1/1 ; `/cgv` 1/1 ; `llms.txt`).
- **Le tarif d'introduction** est écrit sans « au lieu de » ; la formule est celle de `product-marketing.md` §5.
- **La CGV §6** : « sans engagement et résiliable chaque mois […] avec effet à la fin du mois en cours ». La contradiction de la v3 est levée.
- **Les pages métiers** :
  - le téléphone porte « inclus dans le palier Complet » dans le lede, dans la tâche et dans la FAQ ;
  - le bloc contrôle tient en 2 phrases propres au métier, plus « Le contrôle en détail → » ;
  - « Métiers voisins », « L'assistant en détail → » et « Deux autres exemples pour ce métier → » vers `/demonstrations#<métier>` ;
  - le h2 dit « la paperasse le soir » ;
  - le title d'`artisans-batiment` est désambiguïsé (« menuisiers, peintres, carreleurs »).
- **`/demonstrations`** : 11 métiers × 2 exemples, chacun en 4 temps et avec un schéma. Le bandeau « Exemples de démonstration — demandes fictives » est répété, la page est dans le sitemap et dans `llms.txt`, et le hreflang FR/EN est en place.
- **`components/Chiffres.tsx`** : 4 chiffres, chacun avec son lien, son échantillon et son pays. La nuance Humlum est dans `llms.txt`, et la phrase « pas de nos clients » est présente. La provenance est consignée dans `lib/chiffres.ts`.
- **Leo** (`lib/chat-prompt.ts` l. 213–234) pose trois questions dans l'ordre (temps, perte, temps retrouvé), avec ses propres boutons. Le patron donne le chiffre ; Leo ne cite aucune statistique. Puis Leo reprend ce chiffre (« Vos 3 à 4 soirs… »). Ce sont de bonnes règles de vente.
- **Technique** :
  - `/en` porte `ProfessionalService` avec le même `@id` (`/#studio`), le téléphone et l'e-mail ;
  - la 404 a pour title « Page introuvable — Nawa Corps » ;
  - le title de `/services` fait 59 signes ;
  - les metas de la CGV et de la confidentialité font 123 signes ;
  - la section EN de `llms.txt` est complète.

---

## 4. Problèmes classés

### Critique

| # | Page | Problème | Correctif concret | Fichier probable |
|---|---|---|---|---|
| C1 | `/mentions-legales`, `/confidentialite`, `/cgv` (FR + EN) | **20 marqueurs visibles** : `[À COMPLÉTER : rue, numéro, NPA]` ×6, plus `[À VÉRIFIER…]` ×7 sur chaque confidentialité et ×1 sur chaque page de mentions. Sur les pages EN, les marqueurs sont **en français**. Le `noindex` les retire de Google, mais pas du pied de page de chaque page. LCD art. 3 al. 1 let. s : l'adresse est obligatoire pour vendre en ligne. | **Ayoub** : fournir l'adresse (domicile ou domiciliation) et faire les 7 vérifications. **Code**, si le site doit partir avant : cacher le texte entre crochets et finir la phrase avant (par exemple « Adresse postale : sur demande à contact@nawacorps.ch »). Cette solution de repli reste fragile au regard de la LCD. **Le mieux reste de ne pas mettre en ligne avant.** | `lib/site.ts` (exploitant), `app/(site)/{mentions-legales,confidentialite,cgv}/page.tsx` + `/en` |

### Haut

| # | Page | Problème | Correctif concret | Fichier probable |
|---|---|---|---|---|
| H1 | `/studio` (bande de faits) | « **Par métier — 11 métiers, une base pour chacun** ». C'est la case « 11 métiers » de la v3, avec un autre libellé. Elle se lit comme 11 bases livrées, alors que `/metiers` dit « Nous construisons une base ». C'est un compteur au sens de CLAUDE.md. | `<b>Par métier</b><span>Une base pour chacun</span>`, sans `METIERS.length`. Même chose en EN. | `app/(site)/studio/page.tsx` l. 150–151, `app/(site)/en/studio/page.tsx` |
| H2 | 3 pages métiers du bâtiment (FR + EN), `/studio`, `/en/studio` | « Le bâtiment est le premier secteur touché par la pénurie de personnel dans le canton (**CCIG 2026**) ». Or `lib/chiffres.ts` l. 12 écarte exprès CCIG 2026 (« taille d'échantillon non publiée »). Le site cite donc une source jugée trop faible pour l'accueil. | Ou bien retirer la phrase et garder seul le chiffre OCSTAT, qui est solide. Ou bien la cadrer : « Selon l'enquête 2026 de la CCIG, le bâtiment est le secteur qui peine le plus à recruter. » Et trancher la question dans `founder/research/chiffres-cles.md`. | `lib/metiers.ts` l. 174, 274, 378, 476, 577, 675 ; `app/(site)/en/studio/page.tsx` l. 257 ; `lib/dictionnaires/fr.ts` l. 247 |
| H3 | Positionnement | **IA Swiss** (Suisse romande) se présente avec des « assistants métier sur mesure (devis, régie, emails) » et un hébergement suisse. Le pilier n° 1 de `product-marketing.md` §3 (« aucune des agences relevées ne le dit ») et l'argument « données en Suisse » perdent leur exclusivité. Ce n'est pas un défaut du site : aucun superlatif n'y est écrit. Mais c'est un risque pour la prospection. | **Ayoub ou la veille** : profiler IA Swiss (prix, preuves, métiers), mettre à jour §4 de `product-marketing.md`, et déplacer la différence vers ce qui reste vérifiable : la démo sur son métier avant de signer, la mise en place payée après l'essai, le relevé du lundi, et le prix affiché. | `.agents/product-marketing.md` §3–4 |
| H4 | `/demonstrations` | Le title « Démonstrations : exemples d'automatisation par métier » n'a ni « IA » ni « Genève », et les 100 premiers mots non plus. La page est la plus longue du site (3 878 mots) et son seul JSON-LD est un `BreadcrumbList`. | Title : « Exemples d'automatisation IA par métier · PME Genève » (52). Meta : « Onze métiers, deux exemples chacun : ce qui arrive, ce que l'assistant IA prépare, ce que vous validez. Demandes fictives, PME de Genève. » (139). Lede : ajouter « …l'assistant IA que nous installons dans les PME de Genève. » Ajouter un `ItemList` des 11 ancres. Pas de `HowTo` : les exemples sont fictifs. | `lib/dictionnaires/fr.ts` et `en.ts` (clé `seoTitre` de la page demonstrations), `app/(site)/demonstrations/page.tsx` |
| H5 | `/demonstrations` (exemples) | Certaines capacités sont affirmées alors que le branchement n'est pas prouvé : « deux créneaux proposés **d'après votre agenda** » (l. 152), « Il **regarde l'agenda** des équipes et du camion » (l. 983). Ailleurs, le site dit « se vérifie outil par outil ». La démo n'a accès à aucun outil. | « …deux créneaux, pris dans les disponibilités que vous lui donnez. » et « Il vérifie la date dans le planning que vous lui donnez. » Pour la photo (l. 112), ajouter « …et vous le signale, à vérifier » : une description de photo n'est pas un diagnostic. | `lib/automatisations.ts` l. 112, 152, 983 |

### Moyen

| # | Page | Problème | Correctif concret | Fichier probable |
|---|---|---|---|---|
| M1 | `/devis` | La page de conversion n'a **aucun lien `tel:`**, alors que l'accueil en a 3 et `/contact` 4. Le patron qui préfère appeler doit chercher le numéro. | Sous « Réponse le jour ouvrable suivant. », ajouter « Ou appelez-nous : <a href="tel:…">+41 78 912 40 35</a> », lu dans `CONTACT`. | `app/(site)/devis/page.tsx`, `app/(site)/en/devis/page.tsx` |
| M2 | Partout | **La durée de l'essai n'est écrite nulle part.** « Rien à payer pendant l'essai » reste flou, et c'est la question n° 1 d'un patron prudent. | **Ayoub** tranche (décision ouverte n° 6). Ensuite, une phrase dans le parcours de l'accueil, dans `/services` et dans la FAQ « Combien ça coûte ? », plus Leo. La durée s'écrit en semaines, jamais en heures. | `.agents/product-marketing.md` §5, puis `lib/dictionnaires/*.ts` |
| M3 | Leo | Le prompt dit à Leo « le studio n'en a aucun » (l. 209). C'est une consigne interne, mais un modèle peut la répéter mot pour mot, et ce serait l'aveu proscrit. | Reformuler : « …jamais comme s'il tournait déjà chez un client. Ne parle jamais du nombre de clients. » | `lib/chat-prompt.ts` l. 208–209 |
| M4 | Leo | 3 questions obligatoires avant de parler de l'assistant. Pour un patron pressé, c'est 3 allers-retours avant la réponse. L'exception ne vaut que s'il demande la démo ou le prix, pas s'il demande « ça fait quoi ? ». | Étendre l'exception : « …s'il demande ce que fait l'assistant, réponds en une phrase, puis pose la question (a). » À tester sur 5 conversations, **hors production**. | `lib/chat-prompt.ts` l. 233–234 |
| M5 | Accueil, chiffres | Le chiffre de tête est français (CAPEB). Le libellé dit « baromètre ARTIsanté **2026** », mais l'URL du PDF dit `…barometre-artisante-2025…`. La recherche fait aussi remonter un chiffre genevois : selon une enquête PwC pour le canton, 54 % des PME genevoises utilisent l'IA. | (a) Vérifier l'édition (2025, publiée le 26.5.2026 ?) et aligner le libellé. (b) Envisager de remplacer ou de compléter par le chiffre genevois (ge.ch), si la source passe le tri « fort » de `chiffres-cles.md`. | `lib/dictionnaires/fr.ts` et `en.ts` (clé `chiffres`), `lib/chiffres.ts` |
| M6 | `/studio` | « En France, 42 % des patrons jugent leur charge administrative stressante (**CAPEB 2023**) ». Cette troisième source CAPEB n'a ni lien ni entrée dans `lib/chiffres.ts`, et elle diverge de l'accueil (CAPEB 2026, 48 %). | La retirer, ou la passer par `SOURCES_CHIFFRES` avec son lien. | `app/(site)/studio/page.tsx` l. 279 |
| M7 | 11 pages métiers | Par ma mesure (bloc contact du `<main>` compris), **38 à 45 %** du texte est fait de phrases présentes sur au moins 6 pages. Ce n'est pas mieux qu'en v3 (36 à 44 %, méthode voisine). Le bloc contrôle a été raccourci, mais le bloc (05) prix et le bloc contact restent communs. | Réduire (05) à une phrase plus le lien ; sortir le formulaire du `<main>` ou le raccourcir sur les pages métiers ; ajouter sur chaque page une 5e FAQ propre au métier. | `lib/metiers.ts`, `components/FooterContact.tsx` |
| M8 | Anciennes URL | `/services/site-web` (et tout `/services/:chemin+`) renvoie en 308 vers `/`. `/services` existe et serait la destination la plus proche (signalé en v3). | `destination: "/services"` (et `/en/services`). | `next.config.ts` (redirections `/services/:chemin+`) |
| M9 | JSON-LD `Offer` | Toujours pas de `valueAddedTaxIncluded: false` (3e audit). La mention est en texte, donc la règle est tenue ; le champ ne sert qu'aux machines. | L'ajouter dans chaque `priceSpecification`, avec `seller: {"@id": "…/#studio"}`. | `app/(site)/services/page.tsx`, `components/SchemaPage.tsx` |
| M10 | Meta EN sanitaire | « The assistant can take enquiries **from the site** » : en anglais, « site » se lit « site web ». Le FR dit « du chantier ». | « …take enquiries while you're on a job, read your work orders… » | `lib/metiers.ts` (meta EN sanitaire) |

### Bas

| # | Page | Problème | Correctif | Fichier |
|---|---|---|---|---|
| B1 | `/metiers` | « Genève » n'est pas dans les 100 premiers mots (il est dans le title). | Lede : « Nous construisons, pour les PME de Genève, une base par métier… » | `lib/dictionnaires/fr.ts` (page métiers) |
| B2 | `/contact` | « Lu–Sa **de 9h–19h** » | « du lundi au samedi, de 9 h à 19 h » | `app/(site)/contact/page.tsx` |
| B3 | `llms.txt` | Liste les 6 pages légales, qui sont en `noindex`. | Les retirer tant qu'elles portent des marqueurs. | `app/llms.txt/route.ts` |
| B4 | Hero | « attend votre accord » : l'accusé de réception, lui, n'attend pas. Ce n'est pas faux au niveau de la promesse, mais c'est absolu. | Laisser, ou « vous laisse valider. » (20 signes). | `lib/dictionnaires/fr.ts` (rotation du hero) |
| B5 | `Person` (`/studio`) | Ni `image` ni `sameAs`. Et le `Person` n'existe pas sur `/en/studio` (seul `mainEntity` y pointe). | Quand la photo existera : `image`. LinkedIn en `sameAs`. | `app/(site)/studio/page.tsx` |
| B6 | Mobile (repris de la v3, non revérifié) | Pas de barre « Démo · Appeler » ; textes à 10,6–11,2 px ; `<br/>` du h1 des pages métiers. | Changements de mise en page : **à demander à Ayoub**. | `app/binacore.css` |

---

## 5. Contrôle des interdits (CLAUDE.md)

| Règle | État | Preuve |
|---|---|---|
| Aucune référence client inventée | ✅ | Démos et exemples étiquetés « fictive » ; Leo est présenté comme « une démonstration… pas un client ». |
| Aucun compteur fictif | ⚠️ | Rien sur l'accueil. **« 11 métiers, une base pour chacun » sur `/studio`** (H1). « 3 entreprises par trimestre » est autorisé par `product-marketing.md` §5. |
| Mention TVA à côté de chaque prix | ✅ | Tous les montants, toutes les pages, `llms.txt`, Leo (`mentionTva`). |
| Jamais « TVA comprise » | ✅ | 0 occurrence. |
| Jamais « rien ne part sans votre accord » | ✅ | 0 occurrence dans le rendu. Le prompt de Leo l'interdit. |
| Délai jamais en heures | ✅ | Seuls les horaires et la durée du cookie sont en heures. « Réponse le jour ouvrable suivant. » |
| Rien qui dise que le studio débute | ✅ / ⚠️ | 0 dans le rendu. Risque résiduel dans le prompt de Leo (M3). |
| Pas de gain chiffré promis | ✅ | Les chiffres d'études sont cadrés : « pas de nos clients », « pas une promesse pour vous ». |
| NAP cohérent avec `NAP_CONFIRME` | ✅ | `NAP_CONFIRME = true` ; le JSON-LD émet le téléphone `+41789124035`, `contact@nawacorps.ch` et une adresse au niveau de la localité (« Genève »), identiques en FR et en EN. Aucune rue n'est émise. Le pied de page affiche le même numéro. Note : le docblock de `lib/site.ts` l. 19 décrit encore l'état `false` comme cas courant, mais le bloc l. 53–63 le corrige. C'est acceptable. |

---

## 6. Checklist technique

| Point | État | Note |
|---|---|---|
| Toutes les URL du sitemap en 200 | Pass | 36/36. |
| Pages `noindex` absentes du sitemap | Pass | Les 6 pages légales sont en `noindex, follow` et hors sitemap. Les 404 sont en `noindex`. |
| robots.txt | Pass | `/admin` et `/api` en disallow, sitemap déclaré. |
| llms.txt | Warning | Complet et exact (prix, TVA, téléphone en Complet, chiffres sourcés, EN symétrique). Mais il liste des pages `noindex` (B3). |
| Title ≤ 60, unique | Pass | 42/42 (le plus long : `/studio`, 60). |
| Meta ≤ 155, unique | Pass | De 117 à 155. |
| Un seul h1 | Pass | 42/42. |
| Hiérarchie h2/h3 | Pass | Les pages légales n'ont aucun h2 (des titres de section en `<p>` ?). Mineur, non bloquant. |
| Canonical auto-référente | Pass | L'accueil est sans slash final : sans effet. |
| hreflang fr-CH / en-CH / x-default | Pass | 3 balises sur toutes les pages indexables. |
| JSON-LD valide | Pass | Tous les blocs parsent. `ProfessionalService` en FR et EN, `FAQPage`, `Service`, `ItemList` (`/metiers`), `AboutPage` + `Person`, `ContactPage`. |
| JSON-LD complet | Warning | `/demonstrations` n'a que `BreadcrumbList` ; pas de `valueAddedTaxIncluded` ; pas de `Person` sur `/en/studio`. |
| Alt des images | Pass | 0 image sans attribut `alt`. |
| Liens internes | Pass | 44 cibles distinctes, 0 non-200. |
| Maillage | Pass / Warning | Les métiers voisins sont faits. `/demonstrations` ne lie pas `/services`. `/services` n'est toujours pas dans la nav (à demander). |
| Anciennes URL | Warning | `/sanitaire-chauffage-geneve` renvoie en 308 vers la page métier ✅ ; `/services/*` renvoie vers `/` (M8). |
| Mots-clés dans les 100 premiers mots | Warning | OK sur l'accueil, `/services`, les 22 pages métiers et `/studio`. Il manque « Genève » sur `/metiers` et « IA » + « Genève » sur `/demonstrations`. |
| Duplication des pages métiers | Warning | 38 à 45 % (M7). |
| Pages légales complètes | Fail | 20 marqueurs visibles, pas d'adresse (C1). |
| Mobile | Warning | Non revérifié en v4 ; constats de la v3 inchangés selon le code. |
| URL publique en prod | Warning | En local, tout pointe sur `localhost:3000`. Le build de production lève une erreur si `NEXT_PUBLIC_SITE_URL` manque (bien). À vérifier sur `nawacorps.ch`. |
| Fiche Google Business Profile | Fail | Absente. |
| Annuaires (local.ch, search.ch) | Fail | Absents. |
| Liens entrants | Fail | Aucun connu. |

---

## 7. Opportunités de mots-clés (Genève)

Je n'ai aucun volume (aucun outil branché). La difficulté est **estimée** d'après les SERP du 25.10.2026, obtenues par un moteur US. Sur ces requêtes, les SERP renvoient surtout des offres d'emploi, des profils freelance sur Malt, et les formations IA pour PME de l'État de Genève et de l'UNIGE (affichées complètes).

| # | Mot-clé | Intention | Page cible | Difficulté estimée | Note |
|---|---|---|---|---|---|
| 1 | assistant IA sanitaire / chauffagiste Genève | commerciale | `/metiers/sanitaire-chauffage` | Faible | Aucun concurrent positionné. |
| 2 | assistant IA PME Genève | commerciale | `/` | Moyenne | NexaLab, Fluxel ; **IA Swiss** en Romandie. |
| 3 | automatisation IA PME Genève | commerciale | `/demonstrations` (après H4) | Moyenne | SERP occupée par des freelances et par les formations de l'État : la page d'exemples peut y prendre place. |
| 4 | exemples automatisation IA artisan | info → commerciale | `/demonstrations` | Faible à moyenne | Les éditeurs français (Artisania, Artibot) visent la France. |
| 5 | relance devis automatique artisan | commerciale | `/metiers/electricite`, `/services` | Moyenne | Éditeurs SaaS français. |
| 6 | IA électricien Genève | commerciale | `/metiers/electricite` | Faible | |
| 7 | IA régie immobilière Genève / bon d'intervention | commerciale | `/metiers/regies-immobilieres` | Faible à moyenne | IA Swiss cite la « régie ». |
| 8 | secrétariat artisan Genève / permanence téléphonique artisan | commerciale (il cherche une personne) | FAQ « Je ne trouve personne » + `/metiers/artisans-batiment` | Moyenne | La SERP ne donne aucune offre genevoise dédiée aux artisans : c'est une ouverture. Le téléphone est à cadrer dans le palier Complet. |
| 9 | bon de régie sanitaire | info métier | page sanitaire, puis un article | Faible | Volume probablement très bas. |
| 10 | IA fiduciaire Genève / relance pièces comptables | commerciale | `/metiers/fiduciaires` | Moyenne à forte | Trois concurrents ont une page fiduciaire. |
| 11 | IA garage Suisse romande / rappel service | commerciale | `/metiers/garages` | Moyenne | IAtelier. |
| 12 | devis IA artisan Suisse / données en Suisse | commerciale | `/services` (contrôle, données) | Moyenne | Différence nLPD face aux outils français ; IA Swiss joue aussi la carte de l'hébergement suisse. |
| 13 | prise de rendez-vous salon coiffure IA Genève | commerciale | `/metiers/salons-coiffure-beaute` | Moyenne | Salonkee, Planity. |
| 14 | formation IA PME Genève | info | aucune (hors cible) | Forte | Occupée par ge.ch et l'UNIGE. **Ne pas viser** ; mais l'État cherche des cas concrets : une piste de partenariat ou de lien (Ayoub). |
| 15 | agent IA Genève | commerciale | — | Forte | **Ne pas viser** (NexaLab, Fluxel). |

**Lecture.**
- Les gains faciles restent les requêtes de métier (n° 1, 6, 7) et `/demonstrations` sur « automatisation IA PME », une fois son title corrigé (n° 3, 4).
- « secrétariat / permanence artisan Genève » n'a aucun acteur local dédié : c'est le mot du patron qui cherche une personne. Une section FAQ ou un article peuvent le capter.

---

## 8. Plan d'action

### Cette semaine — CODE / TEXTE (faisable sans Ayoub)

1. H1 : retirer « 11 métiers » de `/studio` (FR et EN). Cinq minutes.
2. H2 : CCIG 2026 retiré ou cadré, dans `lib/metiers.ts` ×6 et `/en/studio`.
3. H4 : title, meta, lede et `ItemList` de `/demonstrations`.
4. H5 : « d'après votre agenda » et « regarde l'agenda » reformulés, plus la photo « à vérifier » (`lib/automatisations.ts`).
5. M1 : lien `tel:` sur `/devis` (FR et EN).
6. M3 et M4 : prompt de Leo (retirer « le studio n'en a aucun », assouplir l'ordre des questions). À tester hors production.
7. M5 et M6 : aligner l'édition de la CAPEB ; retirer ou sourcer « CAPEB 2023, 42 % ».
8. M8 à M10, B1 à B3 : redirection `/services/*` vers `/services`, `valueAddedTaxIncluded`, meta EN sanitaire, « Genève » sur `/metiers`, horaires de `/contact`, `llms.txt` sans les pages légales.

### Ce trimestre — CODE / TEXTE

- M7 : faire descendre la duplication des pages métiers sous 25 % (bloc 05 plus court, formulaire hors `<main>`, une FAQ propre de plus par métier).
- Un premier article « Pas de secrétaire ? Ce que l'assistant reprend, et ce qu'il ne reprend pas » (vise le n° 8). **Écrit après les 10 appels**, avec leurs mots.
- Une section FAQ « Et le téléphone ? » qui vise « permanence téléphonique artisan », avec le palier Complet écrit.
- **À demander à Ayoub (mise en page)** : la barre basse mobile « Démo · Appeler », « L'offre » vers `/services` dans la nav, le `<br/>` du h1 des pages métiers, la taille des étiquettes.

### Dépend d'Ayoub

| Priorité | Action | Débloque |
|---|---|---|
| 1 | **L'adresse postale** (domicile ou domiciliation) et **les 7 vérifications de la confidentialité** (Telegram, purge, offre Neon, entité contractante, DPF de Vercel, Neon, Google et Groq) | C1, la confiance, la LCD, le retour des pages légales dans l'index |
| 2 | **La fiche Google Business Profile** (zone de service Genève, sans adresse publique, même NAP que `lib/site.ts`), puis **local.ch** et **search.ch** | Le SEO local : c'est le plus gros écart pour monter au-dessus de 7,5 |
| 3 | **Une photo réelle d'Ayoub** pour `/studio` (puis `image` dans le `Person`) | La confiance |
| 4 | **La durée de l'essai** (décision n° 6) | M2, l'envie d'agir |
| 5 | **Les 10 appels**, puis **le premier client** : son relevé et deux phrases de lui, avec son accord écrit. Les avis Google ne viendront qu'après, jamais sollicités avant. | La douleur (une voix genevoise), la confiance (une vraie preuve) |
| 6 | **Profiler IA Swiss** et mettre à jour `product-marketing.md` §3–4 | H3, le pitch de prospection |
| 7 | Liens entrants : 101 Agency, Suissetec Genève, AGCV, et le programme IA pour PME de l'État de Genève | Le SEO |

---

Sources web du 25.10.2026 :
- [ge.ch — La moitié des PME genevoises utilisent l'IA](https://www.ge.ch/document/moitie-pme-genevoises-utilisent-ia-etude-inedite)
- [UNIGE — Journée de formation IA pour les PME](https://www.unige.ch/formcont/programmes/iel/ia-pme)
- [ge.ch — Formation IA pour les PME](https://www.ge.ch/evenement/complet-formation-ia-pme)
- [Les Pépites Tech — IA Swiss](https://lespepitestech.com/node/33804)
- [Les Pépites Tech — Artisania](https://lespepitestech.com/startup-de-la-french-tech/artisania)
- [Les Pépites Tech — Artibot](https://lespepitestech.com/startup-de-la-french-tech/artibot)
- [Companeo — permanence téléphonique ou secrétariat externalisé](https://www.companeo.com/permanence-telephonique/guide/permanence-telephonique-ou-secretariat-externalise-:-quelle-solution-pour-votre-entreprise)
- [Malt — profil freelance automatisation IA, Genève](https://www.malt.fr/profile/guillaumegevdigital)

Concurrents déjà profilés : `founder/research/agences-ia-positionnement.md` (NexaLab, Fluxel, IAtelier).
