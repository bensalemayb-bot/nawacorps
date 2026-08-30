# Porte G1 — tour 1 — veille concurrentielle

**Objet :** `docs/agents/veille/{concurrents.json, concurrents.csv, concurrents.xlsx, synthese.md}`
**Question de la porte :** la veille est-elle crédible, complète et sourcée au point qu'on puisse construire le copy du site dessus ?
**Date :** 2026-08-30 · **Verdict : GO AVEC RÉSERVES**

---

## Ce que j'ai vérifié moi-même

- **Intégrité des trois exports.** JSON, CSV et XLSX contiennent les mêmes 6 lignes et les mêmes 39 champs. Comparaison automatique valeur par valeur : **0 divergence** sur 234 champs. UTF-8 valide partout, XLSX à deux feuilles. Aucun risque qu'un rédacteur travaille sur un export périmé.
- **Discipline de source.** Chaque champ porte `{valeur, source, date}`. Sur 234 champs, **un seul** est attribué à l'analyste (`id`) ; **tous les autres portent une URL**. Les prix et les délais portent en plus une source détaillée qui cite le palier exact. C'est au-dessus de ce que la porte exige.
- **Honnêteté des trous.** 27 champs sont marqués « inconnu » ou « non relevé » plutôt que comblés. Les chiffres auto-déclarés par les concurrents sont étiquetés comme tels dans la valeur elle-même, pas seulement en note de bas de page.

Je n'ai pas ouvert de fichier source du site, conformément à la délégation.

---

## Les cinq points signalés par l'agent de veille — tranchés

### 1. Flash Design, 100 % sur devis — **GARDÉ, sans remplaçant**

Une agence de 2017, 230+ avis, qui refuse encore de publier un prix, **n'est pas un trou dans la veille : c'est la donnée**. C'est exactement ce qui fonde l'opportunité n°4. Elle porte par ailleurs un délai sourcé (10-14 jours), qui est ce dont la carte des délais a besoin. Échanger cette ligne contre un concurrent tarifé, ce serait troquer un fait de marché contre une ligne de remplissage.

**Correction demandée (1 mot) :** `prix_min` / `prix_max` passent de `inconnu` à `non publié`. La distinction n'est pas cosmétique — « inconnu » est un échec de recherche, « non publié » est un choix commercial du concurrent, et c'est le second qui se vend.

### 2. Simplicity, raison individuelle — **PAS DE VÉRIFICATION AU REGISTRE**

La question ne se pose que si le nom sort du fichier. Il n'en sortira pas. **Règle dure, valable pour tout le pipeline : aucun concurrent n'est nommé dans un artefact public** — ni page, ni FAQ, ni llms.txt, ni tableau comparatif. La veille est un document interne de cadrage, pas une source de citations.

Sous cette règle, le point est clos : ce qui figure au dossier est l'URL commerciale que l'exploitante publie elle-même comme son adresse professionnelle, donc une donnée d'entreprise. Aucune coordonnée personnelle n'apparaît dans les champs de valeur — vérifié. Pas de tour 2.

### 3. Aucun chiffre d'affaires — **« INCONNU » DÉFINITIF**

Aucune ligne de copy n'utilisera jamais le chiffre d'affaires d'un concurrent. Le champ ne sert à rien en aval. *(À vérifier, hors fichiers : une société suisse non cotée ne publie pas ses comptes, donc une recherche au registre rendrait la forme juridique et la date d'inscription, pas un revenu.)* Un tour 2 pour ce champ serait du zèle. **Fermé.**

### 4. Atelectro — **GARDÉ, MAIS RECLASSÉ**

Ce n'est pas un concurrent direct, et son champ `type: direct` est un **défaut réel** : il gonfle le titre « 6 concurrents directs » et contamine tout décompte en aval.

Ce qu'il est vraiment : ce que le gérant genevois croise **dans une recherche Google**, pas ce qu'il envisage sérieusement. C'est l'instance concrète de la ligne « freelance IA / offshore 300-600.– » que le positionnement décrit déjà (§4). À ce titre il a sa place, et il en a même une importante — voir le mémo ci-dessous.

**Correction demandée :** `type` passe de `direct` à `seo_bas_de_marche`, et le titre du panel devient « 5 concurrents directs + 1 concurrent SEO bas de marché ».

**Faut-il un vrai indépendant suisse sous 500 CHF au tour 2 ?** Non. La veille a déjà produit le chiffre qui compte pour tarifer 699.– : **le plancher suisse pour un one-page comparable est de 799 CHF (Wecode, landing) à 990 CHF (Pixelium, One Page Next.js)**. C'est ce nombre-là qui pilote le prix d'entrée, pas l'existence hypothétique d'un indépendant à 450.–.

### 5. Avis Helveit issus de son propre llms.txt — **NON BLOQUANT, ET MAL CADRÉ**

Le défaut n'est pas propre à Helveit. **La totalité du panel est auto-déclarée** : Flash Design affiche ses 230+ avis sur sa propre page d'accueil, Wecode ses « 150+ PME » sur son propre site, Atelectro un `AggregateRating` 4.9/180 dans son propre JSON-LD sans plateforme identifiable, Simplicity ses « 15+ témoignages » sur sa propre page. Et `geo_citations_tierces` vaut **« inconnu » pour 6/6**.

Donc pas de revérification ciblée sur Helveit : ce serait traiter un symptôme. La conclusion utile est une règle :

> **Aucune audience, note, ni volume de clients d'un concurrent ne peut être cité, comparé, ni suggéré en creux dans le copy de Nawa Corps.** Le studio a 1 client et 0 référence de site (positionnement §9). Toute revendication comparative de preuve serait à la fois non sourcée et exposée au titre de la LCD art. 3.

---

## Le point qui décide du positionnement — mémo demandé

**La promesse de 72 h est-elle réellement libre sur le marché genevois, ou la veille est-elle trop mince pour le dire ?**

**Réponse : les deux, et il faut séparer deux phrases que le positionnement confond aujourd'hui.**

**(A) « 72 h si vous avez déjà un site, une semaine en partant de zéro. »**
C'est une affirmation sur **ce que Nawa Corps livre**. Sa vérité ne dépend pas de la veille — elle dépend des moyens du studio. La veille n'a pas à la prouver, et n'a pas à l'autoriser. **Cette phrase est libre, et elle doit être le socle du copy.**

**(B) « Personne à Genève n'annonce ce délai. » (positionnement §3, pilier 1)**
C'est un **superlatif de marché**. Il exige une exhaustivité que la veille n'a pas, et ne pouvait pas avoir sous un plafond de 6. Le compte réel : **3 acteurs basés à Genève** (Helveit, Wecode, Simplicity), 2 romands qui desservent Genève, 1 étranger. Et la veille nomme elle-même **8 acteurs écartés sans que leur délai ait été vérifié** (KSA Digital, iGenève, Webie, Digital Sprint, MW Agency, VLdesign, Promaxis, Versant Web). Sur cette base on peut écrire « nous n'en avons trouvé aucun » ; on ne peut pas écrire « il n'y en a pas ».

**Ma décision : le copy s'écrit en (A), jamais en (B).** Aucun « le seul à Genève », aucun « le plus rapide », aucun « personne d'autre ». Et ce n'est pas une concession — **(A) est la meilleure phrase de vente des deux**. « Votre site refait en 72 heures » est un fait vérifiable que le lecteur peut tester en achetant ; « plus rapide que tout le monde » est une invitation à aller vérifier, et un superlatif non substantiable est précisément ce que vise la LCD art. 3.

**L'objection Atelectro tombe alors d'elle-même.** Elle ne mordait que si le copy devait prouver un négatif. Elle apporte en revanche deux faits que la veille a relevés sans les exploiter :

1. **Les deux seuls concurrents rapides conditionnent leur délai au contenu du client.** Atelectro : « sous 48-72h **après validation du contenu** ». Simplicity : « 7 jours **une fois le contenu fourni** ». La promesse de Nawa court **à partir du feu vert**, textes repris de l'ancien site. C'est le vrai différenciateur, il est plus fin et plus solide que « 72 h » tout court — et la veille ne l'a pas mis en avant. **À exploiter dans le copy.**
2. **Le couple 48-72 h + 199 € est la signature sémantique du bas de gamme.** Un « 72 h » mis en titre, seul et sans contrepoids, atterrit dans le voisinage d'Atelectro, pas dans le voisinage premium. Le délai doit toujours voyager attaché au pilier 2 (le site fait entrer des demandes) et au pilier 3 (quelqu'un reste). Jamais seul.

**Sur le fond : le marché genevois relevé va de 7 jours (Simplicity, contenu fourni) à 4-8 semaines (Helveit, e-commerce).** 72 h en partant d'un site existant, sans attendre le contenu, ce n'est pas un écart marginal sur le plancher — c'est un autre objet. **L'axe de la vitesse est amplement suffisamment étayé pour porter le positionnement.** Il ne l'est pas pour porter un superlatif.

---

## Le problème que la veille révèle et que personne n'a encore posé

En croisant la grille de prix (positionnement §5) avec les prix sourcés du panel :

| Palier Nawa | Prix | Comparable suisse sourcé | Écart |
|---|---|---|---|
| La Vitrine (one-page) | **699.– TTC** | Wecode landing 799.– / Pixelium One Page 990.– | **sous le plancher** |
| Le Site | **1'499.– TTC** | Helveit vitrine 1'500.– **TTC** / Wecode vitrine 1'499.– | **à parité exacte** |
| L'Assistant | **2'499.– TTC** | Wecode refonte 2'499.– / Pixelium vitrine complète 2'500.– | **à parité exacte** |

Aux paliers 2 et 3, Nawa est **au prix du marché** — mais avec RDV en ligne, devis chiffré automatique, assistant IA et fiche Google inclus, dont la veille établit qu'**aucun des 6 ne les livre en standard à aucun prix**, et avec un délai de 72 h contre 2 à 6 semaines.

Moins cher au palier 1, autant que les autres aux paliers 2 et 3 mais avec beaucoup plus dedans, et sept fois plus vite. Ce n'est pas une signature premium : c'est un triangle d'incrédibilité. Le positionnement l'écrit lui-même (§4) : *« Un prix trop bas le rend méfiant, pas intéressé. »* La grille contredit son propre document sur ce point.

Je ne rouvre pas le positionnement — mais il a été écrit **avant** que ces prix soient sourcés. C'est une décision de Boualem, à prendre avant le copy, pas après :

- **Option A — garder la grille, charger la justification.** Le copy doit expliquer *pourquoi* c'est ce prix (structure d'une personne, pas de chargé de compte, production outillée). Coût : chaque page porte une défense de prix, ce qui affaiblit l'offre. Risque : la défense attire l'attention sur le doute.
- **Option B — remonter les paliers 2 et 3 au-dessus de la parité** (par ex. 1'799.– / 2'999.–), en gardant 699.– comme entrée d'appel. Coût : le seul palier vraiment attractif devient l'entrée. Risque : moins de conversions au démarrage, alors que le studio a besoin de sa première référence.

**Ma recommandation en une phrase :** garder la grille telle quelle **pour les trois à six premiers clients** — à ce stade la première référence vaut plus que la marge (positionnement §9) — mais l'inscrire comme prix d'amorçage à revoir, et non comme la grille définitive du studio.

---

## Grille — 7 critères

| # | Critère | Note | Justification |
|---|---|---|---|
| 1 | **Clarté** | **4** / 5 | Structure lisible, carte prix × délai immédiate, 5 opportunités numérotées et chacune étiquetée par les concurrents qui la justifient. Deux défauts : une contradiction arithmétique dans « Espaces libres » (« 4/6 affichent des prix fermes » suivi de 5 noms et de « soit 5/6 ») et le `type: direct` d'Atelectro. |
| 2 | **Preuve** | **5** / 5 | 233 champs sur 234 portent une URL ; les prix et délais citent le palier exact ; 0 divergence entre les trois exports ; les chiffres auto-déclarés sont étiquetés dans la valeur. Le critère est littéralement satisfait. |
| 3 | **Cohérence** positionnement ↔ prix ↔ délais | **3** / 5 | La veille valide l'axe du délai mais met à nu deux désaccords non résolus : le superlatif §3 que le panel ne peut pas porter, et la parité tarifaire décrite ci-dessus. Aucun des deux n'est un défaut de la veille — ce sont ses conclusions. |
| 4 | **Risque juridique** | **4** / 5 | Le fichier interne est propre : aucune donnée personnelle dans les valeurs, aucune formulation dénigrante, auto-déclarations signalées. Le risque est entièrement en aval, et il est réel : la phrase « activité mère = dépannage électronique » est une déduction du blog d'Atelectro (« ce qui suggère »), pas un fait de registre — inattaquable en interne, attaquable si elle sortait. |
| 5 | **Conversion** (matière exploitable) | **3** / 5 | Donne des ancres de prix, une objection non traitée par les 6 (« ce n'est qu'une vitrine ») et un angle libre (la continuité). Mais **les 6 sources sont des pages marketing de concurrents** : zéro verbatim d'acheteur, zéro dépouillement d'avis clients, rien sur ce que le gérant genevois dit réellement. Le copy se construira sur ce que les concurrents *disent*, jamais sur ce que les clients *veulent*. |
| 6 | **Faisabilité** | **3** / 5 | La veille rend la promesse testable et montre que les deux concurrents rapides se protègent par une condition de contenu. Nawa ne se protège pas — délibérément. C'est le différenciateur et l'exposition, et la décision ouverte n°2 du positionnement (qui rédige les textes) est toujours ouverte. |
| 7 | **Différenciation** | **4** / 5 | Bien démontrée et sourcée : aucun des 6 ne package devis auto, RDV ou assistant dans une offre vitrine ; personne ne traite la continuité. Deux réserves : Wecode occupe déjà « **interlocuteur unique** » — mot à ne pas reprendre — et Simplicity est un studio solo genevois à prix fixe et délai court, c'est-à-dire l'analogue structurel de Nawa, que la veille traite comme une ligne parmi six. |

**Moyenne : 26 / 35 = 3,71.**

---

## Tests adverses

**T1 « Prouve-le »** — les 5 affirmations les plus fortes de la veille : (a) aucun des 6 sous 72 h ; (b) aucun des 6 ne livre devis auto / RDV / assistant en standard ; (c) les 6 prix d'entrée ; (d) seule C5 autorise nommément les robots IA ; (e) Flash Design entièrement sur devis. Les cinq sont sourcées, ligne par ligne, URL par URL. **PASS** — avec une correction de précision sur (a) : le délai de Pixelium est « inconnu », donc la phrase exacte est « aucun des **5** dont le délai est publié », pas « aucun des 6 ».

**T2 « Le concurrent lit la page »** — rien n'est publié, et la règle « aucun concurrent n'est nommé publiquement » (point 2 ci-dessus) verrouille la question. La seule phrase qui serait attaquable si elle sortait est la déduction sur l'activité mère d'Atelectro ; elle reste dans le fichier interne. **PASS**, sous cette règle.

**T3 « Le client pressé »** — appliqué au lecteur de la veille : `synthese.md` donne la carte prix × délai et les 5 opportunités en moins de dix secondes de balayage. Un rédacteur sait quoi en faire sans ouvrir le JSON. **PASS**

**T4 « L'opérationnel »** — *qui tient les 72 h, avec quoi ?* La veille ne peut pas répondre, et rien d'autre ne répond : la décision ouverte n°2 du positionnement (qui rédige les textes) est toujours ouverte, et les deux seuls concurrents rapides du panel se sont explicitement protégés par une condition de contenu que Nawa refuse. **FAIL** — une promesse de délai sans moyen écrit. Ce n'est pas un défaut de la veille : c'est ce que la veille met en évidence. Non bloquant pour G1, **bloquant pour G2**.

**T5 « Le sceptique »** — la veille déclare trois réserves (avis, nom de C5, absence de CA) mais **pas les deux qui pèsent le plus** : l'échantillon proprement genevois est de **3 acteurs** avec 8 voisins nommés et non vérifiés, et **100 % des sources sont des pages détenues par les concurrents**. Honnête sur ce qu'elle a fait, incomplète sur ce que cela signifie. **PASS avec réserve.**

**T6 « Le copier-coller »** — face au concurrent le plus proche structurellement (Simplicity : solo, genevois, prix fixe, délai court) : promesse distincte (72 h vs 7 jours), argument distinct (la continuité vs l'autonomie et la formation), registre distinct (vouvoiement vs tutoiement), vocabulaire distinct (« demandes » vs « clé en main »). **PASS** — une seule collision à éviter : « interlocuteur unique », qui appartient à Wecode sur ce marché.

**T7 « Le mismatch »** — parité tarifaire aux paliers 2 et 3 avec les acteurs les plus établis, prix sous le plancher au palier 1, tout en promettant le délai le plus court et le contenu inclus le plus riche. Ce n'est pas un profil premium, c'est le profil du bas de marché que le positionnement dit lui-même vouloir éviter. **FAIL** — non résolu, décision de Boualem (options A / B ci-dessus).

**Bilan : 5 PASS, 2 FAIL.** Aucun des deux FAIL n'impute la veille ; les deux sont des conclusions de la veille sur la chaîne positionnement / prix. Les renvoyer à l'agent de veille ne corrigerait rien.

---

## VERDICT : GO AVEC RÉSERVES

**La veille est crédible, sourcée au-delà de l'exigence de la porte, et suffisante pour construire le copy.** Elle n'est pas suffisante pour porter un superlatif de marché — et le copy n'en a pas besoin.

Pas de tour 2. Trois corrections mécaniques (ci-dessous), aucune ne demande de nouvelle recherche.

### Corrections à la veille — agent `veille-concurrents`, non bloquantes

| # | Correction | Fichier | Validation |
|---|---|---|---|
| R1 | `type` de C4 : `direct` → `seo_bas_de_marche` ; titre du panel : « 5 concurrents directs + 1 concurrent SEO bas de marché » | `concurrents.{json,csv,xlsx}`, `synthese.md` | Le mot « direct » ne qualifie plus C4 dans les 4 fichiers |
| R2 | Corriger « 4/6 … soit 5/6 » en **5/6** dans « Espaces libres » ; corriger « aucun des 6 » en « aucun des 5 dont le délai est publié » | `synthese.md` | Les deux phrases sont arithmétiquement exactes |
| R3 | C2 : `prix_min` / `prix_max` `inconnu` → `non publié`. Ajouter un champ ou une note **base TVA** pour C3, C5, C6 (non enregistrée ; seul C1 est confirmé TTC) | `concurrents.{json,csv,xlsx}` | Aucune comparaison de prix ne repose sur une base TVA inconnue |

### Réserves à porter jusqu'à G2 — agent `copy-positionnement`

| # | Réserve | Critère de validation à G2 |
|---|---|---|
| B1 | **Le copy s'écrit en (A), jamais en (B).** Aucun superlatif de marché : ni « le seul », ni « personne d'autre », ni « le plus rapide ». La promesse est un fait sur ce que le studio livre. | Aucune occurrence de superlatif comparatif dans `copy/*` ni dans `pages/*` |
| B2 | **Aucun concurrent nommé** dans un artefact public ; aucune note, audience ou volume de clients d'un concurrent cité ou suggéré en creux. | Aucun des 6 noms n'apparaît hors `docs/agents/veille/` |
| B3 | **Le « 72 h » ne voyage jamais seul.** Toujours attaché au point de départ (« à partir du feu vert, textes repris de votre site ») et à au moins un des piliers 2 ou 3. | Chaque occurrence de « 72 h » porte son point de départ dans la même unité de lecture |
| B4 | **« Interlocuteur unique » est interdit** — Wecode occupe le terme. L'argument de continuité s'écrit sur l'*après-livraison*, que personne du panel ne revendique. | Le terme n'apparaît nulle part ; l'argument porte sur la 2ᵉ année |
| B5 | **T4 doit être levé avant G2** : la règle opérationnelle des 72 h (décision ouverte n°2 — qui rédige les textes) doit être écrite dans le positionnement. Sans elle, la promesse principale du site n'a pas de moyen. | La règle figure dans `.agents/product-marketing.md` |
| B6 | **T7 est une décision de Boualem**, pas de l'agent de copy. Tant qu'elle n'est pas tranchée, le copy n'écrit aucune ligne de justification de prix. | Décision consignée avant l'ouverture de G2 |

---

**La meilleure chose de ce livrable :** la discipline de source. Un seul champ sur 234 est attribué à l'analyste, les trois exports sont identiques au caractère près, et les trous sont laissés béants au lieu d'être comblés — c'est une veille sur laquelle on peut engager sa signature, ce qui est rare.

**Ce qui me ferait dire non demain :** qu'une page du site écrive « le seul studio de Genève à livrer en 72 h ». Le panel compte trois acteurs genevois et huit voisins non vérifiés : cette phrase-là, la veille ne la porte pas, et c'est celle qui se plaide.
