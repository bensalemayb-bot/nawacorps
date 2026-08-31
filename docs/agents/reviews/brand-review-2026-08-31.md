# Revue de marque et de conversion — tout le site

> **Relevé du 31 août 2026**, branche `feat/conversion-pme`, sur le site rendu
> en local (`next dev`, base Postgres démarrée, toutes les routes servies).
>
> **MIS À JOUR LE MÊME JOUR, APRÈS APPLICATION.** Le relevé d'origine est
> conservé mot pour mot ci-dessous : c'est lui qui justifie chaque correction.
> Ce qui a été fait, et ce qui ne l'a pas été, est consigné au §0 juste après.
> **24 constats sur 25 sont appliqués et vérifiés en direct**, plus un défaut
> découvert pendant la vérification (§0.2). Rien n'est committé.
>
> Référentiels : `.agents/product-marketing.md` (positionnement) et
> `docs/agents/brand/voice-guide.md` (guide de voix, tour 2). Les deux sont
> contraignants ; ce rapport ne les rediscute pas, il mesure l'écart entre eux
> et ce qui est réellement à l'écran.

---

## Ce que ce rapport ne refait pas

`docs/diagnostic-tunnel-et-seo.md` a été produit le même jour et couvre le
**tunnel de vente et le référencement** : 32 défauts, huit blocs, un ordre de
travail. Le refaire coûterait deux fois le même travail.

Ce rapport-ci couvre la couche que le diagnostic ne traitait pas : **les mots,
leur conformité au guide de voix, et leur emplacement dans la page.** Quand un
constat recoupe le diagnostic, il porte sa référence (`D4`, `D8`…) et n'est
repris que parce qu'il est **vérifié en direct** et toujours ouvert.

**Méthode.** Chaque page a été rendue puis lue dans son ordre de lecture réel,
pas dans l'ordre du fichier — c'est le seul moyen de juger un emplacement. Le
statut HTTP des 16 routes connues et des 18 lignes du catalogue a été relevé.
L'assistant a été sondé en direct, avec un historique plausible, conformément au
protocole écrit dans `lib/llm.ts:345-349`.

---

## Résumé

**Le texte est bon.** C'est la première chose à dire, parce qu'elle commande le
reste : le concret bat l'adjectif presque partout, les prix portent leur mention
« TVA comprise », la page `/studio` et la section « Ce que je ne prends pas »
sont du travail de vente sérieux. Il n'y a pas de refonte éditoriale à faire.

**Ce qui coûte des ventes n'est pas le style, c'est la place.** Trois des quatre
constats les plus graves sont des problèmes de position : l'engagement de
réponse absent au moment où l'on demande, le prix mensuel obligatoire annoncé
après le bouton, et le bouton de l'assistant qui dit « Terminer » au moment de
convertir. Le mot juste est écrit ; il est écrit trop tard.

**Deux affirmations sortent du cadre de preuve** et relèvent du droit, pas du
style : le sigle `®` sur une marque qui n'est pas déposée, et l'assistant qui
annonce un prix « TTC » dans un format qui n'est pas celui du site.

---

## 0. État après application — 31 août 2026

Le travail a été réparti sur cinq agents, découpés par fichier pour qu'aucun
n'écrive au même endroit. L'un d'eux s'est interrompu sur une erreur d'API en
plein lot ; son travail partiel a été relu, vérifié et terminé à la main.

### 0.1 Les 25 constats

| # | Constat | État |
|---|---|---|
| 1 | Le sigle `®` | **Fait** — caractère retiré, le kicker reste équilibré |
| 2 | L'assistant écrivait « 1 499 CHF TTC » | **Fait et re-sondé** — rend `1'499.– TVA comprise` |
| 3 | Le 129.–/mois après le bouton | **Fait** — sur la carte, entre le prix et les puces, lu depuis Postgres |
| 4 | « Parlons-en » en navigation | **Fait** — « Refaire mon site » |
| 5 | Pas d'engagement de réponse au formulaire de l'accueil | **Fait** — via la constante partagée `MENTION_REPONSE`, pas une copie |
| 6 | Aucun champ e-mail | **Fait** — champ ajouté, règle « au moins l'un des deux » appliquée **côté serveur** |
| 7 | « Terminer la conversation » | **Fait** — « Envoyer ma demande à Ayoub » |
| 8 | Message d'accueil de l'assistant | **Fait** — une seule question, ne présume plus le site |
| 9 | Le carrousel se moquait du « avant » | **Fait** — 9 chaînes désamorcées, aucune classe ni animation touchée |
| 10 | 14 liens du catalogue en 404 | **Fait** — liens vers `/services/<famille>#<pièce>`, 14 ancres posées et vérifiées |
| 11 | « chiffré après deux questions » | **Fait** — promesse supprimée, la prose du bloc suffit |
| 12 | Deux adresses e-mail sur `/contact` | **Fait** — une seule mise en avant, « Quatre façons » redevient exact |
| 13 | `/services/le-site` : prix affiché, CTA « devis » | **Fait** — CTA du guide, et le suivi 49.–/mois annoncé sur les trois formules |
| 14 | « Écrivez-nous » | **Fait** — « Écrivez-moi », deux occurrences |
| 15 | « mobile d'abord » en description SEO | **Fait** — « lisible sur téléphone » |
| 16 | CTA hors guide | **Fait** — hero secondaire, formule 2, **et** le CTA de sortie qui portait encore l'ancien libellé |
| 17 | « Le Comptoir », client inventé | **NON FAIT — et ça ne se corrige pas dans le code.** Il faut l'accord du client réel pour montrer sa carte. Les étiquettes « démonstration » et « établissement fictif » restent en place : le risque est maîtrisé entre-temps |
| 18 | Numérotation des sections | **Fait** — prop `indexSection`, câblée sur `/studio` (06) et les pages de formule et de famille (04) |
| 19 | Deux formulations du même compteur | **Fait** — une seule, sur les deux pages |
| 20 | Paragraphe dupliqué | **Fait** — entier sur `/services`, réduit sur l'accueil |
| 21 | « 1 sem. » | **Fait** — « Une semaine », comme sur `/studio` |
| 22 | « 699.– CHF » | **Fait** — `699.–` |
| 23 | « Le coeur » | **Fait** — « Le cœur » |
| 24 | Horloge servie à 00:00 | **Fait** — heure de Genève calculée au rendu, sans avertissement d'hydratation |
| 25 | « parlons-en » dans le prompt | **Fait** |

### 0.2 Un défaut découvert pendant la vérification

Une fois le format des prix réparé, l'assistant re-sondé a répondu :

> « à compter du feu vert (c'est-à-dire dès que vous **nous** avez fourni les
> textes, photos, etc.) »

**C'est l'inverse exact du pilier n°1.** Le feu vert, c'est le client qui dit
oui ; il n'a rien à fournir, les textes sont repris de son site. L'assistant
vendait donc l'argument que les concurrents rapides du panel utilisent contre
le studio. Le prompt énonçait le fait mais n'interdisait pas la mauvaise
lecture.

Deux règles ajoutées : « feu vert » = le client dit oui et **rien d'autre**,
jamais expliqué par une fourniture d'éléments ; et « je », jamais « nous ».
Re-sondé après correction : *« Rien à préparer de votre côté : je récupère les
contenus existants… Le délai débute dès que vous me donnez le feu vert »*,
avec `1'499.– TVA comprise`.

**La leçon dépasse ce cas** : un prompt qui énonce un fait sans interdire sa
lecture inverse laisse le modèle rationaliser. Les règles de marque s'y
écrivent en négatif autant qu'en positif.

### 0.3 Deux changements demandés par le propriétaire, hors rapport

- **Le 2ᵉ temps du hero** *(001 · Le noyau)* : « Il reçoit les demandes, chiffre
  les devis, prend les rendez-vous — sans que vous y touchiez. » devient
  « Il répond, chiffre les devis et prend les rendez-vous — *pendant que vous
  faites votre métier*. » Le membre en italique reprend la description de la
  cible dans le positionnement (§2 : « Il dirige, il vend, et il fait le
  métier »).
- **Le 3ᵉ temps** *(002 · Le cœur)* : le grand chiffre disait « 1 semaine ». Il
  dit maintenant **« Rien / à fournir »**. Ce n'est pas un choix de style :
  la veille relève déjà un concurrent à 7 jours et un autre à 48-72 h, donc un
  délai seul ne différencie plus rien (guide §5), alors que l'absence de travail
  à fournir est le pilier n°1 du positionnement et l'attente n°1 de la cible —
  et n'avait jusqu'ici qu'une ligne de tableau. Le délai n'a pas disparu du
  site : il reste dans le sous-titre du hero, la ligne « Livraison », la Méthode
  et la FAQ. Il cesse d'être l'argument principal.
  Vérifié au rendu, « Rien » tient dans un emplacement dessiné pour un glyphe
  unique : 330 px sur 1287 au large, 335 px sur 375 à 390 px de large, aucun
  défilement horizontal.

### 0.4 Ce qui a été mesuré, pas supposé

- 14 routes sur 14 en 200 ; un slug inconnu rend un 404 net, pas un 500.
- Aucun lien interne mort, sur les six pages sondées.
- `/api/contact` : six cas de validation, tous corrects (ni téléphone ni e-mail → 400 ; e-mail seul → 201 ; téléphone seul → 201 ; pot de miel → écarté en silence ; e-mail invalide → 400 ; nom vide → 400).
- L'assistant : conversation complète de cinq tours, récapitulatif, collecte du prénom et du numéro, `finalize` → `leadCreated: true`.
- Aucune erreur console, aucun avertissement d'hydratation.
- `typecheck` et `lint` propres — seul subsiste le warning `<img>` de `NoyauStage.tsx`, antérieur.

---

## 1. Les constats

Sévérité : **Haute** = contredit le référentiel, engage juridiquement, ou perd
la vente au point de décision. **Moyenne** = écart réel sans dommage immédiat.
**Basse** = finition.

| # | Constat | Emplacement | Sév. | Correction |
|---|---|---|---|---|
| 1 | Le sigle **®** précède « Studio de création digitale » dans le hero. Aucune marque n'est déposée — la forme juridique n'est pas même arrêtée (`product-marketing.md` §10). | `components/NoyauHero.tsx:56` | **Haute** | Retirer le caractère. S'il sert de puce décorative comme les `(01)`, le remplacer par un glyphe neutre. |
| 2 | L'assistant répond **« Le site « Le Site » coûte 1 499 CHF TTC »**. Trois écarts : « TTC » est banni (glossaire 15, la seule mention admise est « TVA comprise »), le séparateur est une espace au lieu de l'apostrophe, le suffixe `.–` a disparu. Le catalogue lui est pourtant transmis déjà formaté `1'499.–`. | `lib/chat-prompt.ts` — sondé en direct | **Haute** | Ajouter au prompt un contrat de format : reproduire le montant **au caractère près** tel qu'il figure au catalogue, écrire « TVA comprise », ne jamais écrire « TTC », « HT », « CHF » ni « francs ». |
| 3 | Le **129.–/mois obligatoire** n'apparaît qu'**après** le bouton de la formule, dans la note sous la grille. Le guide impose deux emplacements : *sur la carte* et sous la grille (pilier 3). | `components/Offres.tsx` — accueil (`D4`) | **Haute** | Porter le montant sur la carte de L'Assistant, avant le bouton. La page `/services/l-assistant` le fait déjà correctement : reprendre sa formulation. |
| 4 | La pastille de navigation dit **« Parlons-en »**, listée mot pour mot parmi les interdits du guide (§7). Elle est sur **toutes** les pages. | `components/Nav.tsx:83` | **Haute** | « Refaire mon site » — c'est la formule que le guide prévoit pour cet emplacement. |
| 5 | **Le formulaire de l'accueil n'annonce ni délai de réponse ni confidentialité.** `/contact` porte « Réponse le jour ouvrable suivant. » juste au-dessus du sien ; l'accueil n'a que « ou dites-moi en deux lignes ce qu'il vous faut ». Le docblock de `ContactForm` affirme pourtant que l'engagement « est déjà écrit au-dessus du formulaire » — c'est faux sur l'accueil. | `components/FooterContact.tsx:46` · `components/ContactForm.tsx:68-72` (`D14`) | **Haute** | Ajouter la ligne, **au caractère près** comme sur `/contact`. Corriger le commentaire, qui est devenu faux. |
| 6 | **Le formulaire exige le téléphone et n'accepte aucune adresse e-mail.** Le studio vend une proposition écrite et n'a aucun moyen de l'envoyer à qui ne veut pas donner son numéro. | `components/ContactForm.tsx:104-128` (`D13`) | **Haute** | Ajouter un champ e-mail, et rendre l'un des deux obligatoire plutôt que le téléphone seul. |
| 7 | **Le bouton qui enregistre la demande dans l'assistant s'appelle « Terminer la conversation ».** Le mot dit au visiteur de partir à l'instant précis où il convertit. | `components/ChatWidget.tsx:229` (`D18`) | **Haute** | « Envoyer ma demande à Ayoub » — aligné sur le bouton du formulaire (guide §7). |
| 8 | **Le premier message de l'assistant contredit son propre prompt.** Il dit : « Quel est votre métier, et avez-vous déjà un site en ligne ? » — deux questions dans un message, alors que le prompt impose « UNE seule question par message », et il présume le site, ce que le prompt a justement été corrigé pour ne plus faire (son docblock le dit). Le message d'accueil est écrit en dur dans le composant et n'a jamais suivi. | `components/ChatWidget.tsx:36` | **Haute** | « Bonjour. Je prépare votre proposition avec Ayoub. Qu'est-ce que vous cherchez à faire faire ? » |
| 9 | **Les panneaux « avant » du carrousel se moquent du site du prospect** : « Bienvenue sur le site du Comptoir !! », « NOUVEAU : soirée jazz le jeudi !!! », « venez nombreux !!! », `photo_bar_001.jpg`, un numéro de fax, « tampon obligatoire ». Le positionnement (§8) et le guide (§4) l'interdisent nommément : le « avant » montré est exactement celui du lecteur. | `components/Travaux.tsx` — accueil, juste après le hero | **Haute** | Garder l'avant **daté**, retirer le ridicule : pas de points d'exclamation multipliés, pas de fax, pas de nom de fichier. Un vieux site sobre est plus crédible et ne vexe personne. |
| 10 | **14 des 18 lignes du catalogue renvoient une 404** — vérifié route par route : `carte-visite`, `sticker-avis`, `affiche-evenement`, `la-carte`, `hebergement`, `suivi-assistant`, `traduction`, `photos`, `identite-logo`, `site-sur-mesure`, `carte-fidelite`, `bons-cadeaux`, `chevalets`, `pack-saisonnier`. | `/services` (`D8`) | **Haute** | Soit les pages, soit les liens. Tant qu'elles n'existent pas, la moitié basse du catalogue envoie le visiteur dans le mur. |
| 11 | **« sur devis — chiffré après deux questions »** apparaît quatre fois sur l'accueil, et la justification longue le répète sur `/services`. **Ces deux questions n'existent nulle part** : ni dans le formulaire, ni dans l'assistant, ni dans un parcours. | `components/CarteDuStudio.tsx` · `/services` (`D19`) | **Moyenne-haute** | Soit écrire les deux questions et les poser vraiment (elles feraient un excellent mini-devis), soit supprimer la promesse et n'en garder que « sur devis ». |
| 12 | **`/contact` ouvre une deuxième adresse e-mail et explique comment choisir** : « Si vous hésitez entre les deux adresses… ». Un arbitrage est demandé au visiteur au moment exact où il veut écrire. Le titre annonce « Quatre façons », la page en aligne cinq blocs. | `app/(site)/contact/page.tsx` | **Moyenne-haute** | Une seule adresse en avant, `ayoub@`. `contact@` reste dans les mentions légales et la confidentialité, où elle sert. |
| 13 | **`/services/le-site` affiche 1'499.– puis conclut sur « Demander un devis ».** On demande un devis pour un prix affiché. Et la page ne dit nulle part que le suivi passe à 49.–/mois la 2ᵉ année. | `app/(site)/services/[slug]/page.tsx` | **Moyenne** | CTA « Recevoir mes demandes » (guide §7) et une ligne sur le suivi, comme le fait `/services/l-assistant`. |
| 14 | **Les messages d'erreur du formulaire disent « Écrivez-nous ».** Le guide interdit « nous » : le studio est une personne (§4). Deux occurrences. | `components/ContactForm.tsx:88, 94` | **Moyenne** | « Écrivez-moi sur WhatsApp en attendant. » |
| 15 | **« mobile d'abord »** dans la description de `/services/la-vitrine` — c'est « mobile-first » traduit, banni au profit de « lisible sur téléphone » (glossaire 13). C'est le texte que lit un prospect **dans les résultats Google**. | `lib/formules.ts` | **Moyenne** | « Une page lisible sur téléphone, formulaire de demande compris ». |
| 16 | **Le CTA secondaire du hero dit « Voir les avant / après »**, le guide prévoit « Voir les démonstrations ». Et la formule 2 porte **« Lancer mon site »** là où le guide écrit « Recevoir mes demandes » — alors que l'intitulé de sa propre carte dit déjà « Recevoir les demandes ». | `components/NoyauHero.tsx` · `components/Offres.tsx` | **Moyenne** | Aligner sur le guide. Le cas de la formule 2 est le plus net : la carte se contredit à deux lignes d'intervalle. |
| 17 | **« Le Comptoir » reste le client du carrousel entier.** Le positionnement le marque « client fictif inventé — à retirer » (§6). Les étiquettes « démonstration » et « établissement fictif » sont bien présentes et sauvent la règle de preuve, mais cinq pièces sur cinq portent la même marque inventée. | `components/Travaux.tsx` | **Moyenne** | À terme, remplacer par la carte réelle du client payant (avec son accord) — c'est aussi `D3`. En attendant, les étiquettes suffisent. |
| 18 | **Le compteur de sections déraille sur toutes les pages internes** : `/studio` va de (01) à (05) puis saute à **(07)**, `/services/le-site` et `/services/suivi` passent de (03) à **(07)**. Le pied de page porte son numéro d'accueil partout. | `components/FooterContact.tsx:29` | **Moyenne-basse** | Rendre l'index paramétrable, ou le retirer du pied de page sur les pages internes. |
| 19 | **La même donnée est écrite de deux façons** : « 13 lignes sur 18 sont annoncées sur devis » (accueil) et « 5 lignes portent un prix ferme, 13 sont annoncées sur devis » (`/services`). Le guide (§8) exige une seule formulation, au caractère près. | accueil · `/services` | **Basse** | Choisir la seconde, plus favorable : elle commence par ce qui est chiffré. |
| 20 | **Le paragraphe qui justifie les « sur devis » est dupliqué mot pour mot** sur l'accueil et `/services`. | accueil · `/services` | **Basse** | Le garder sur `/services`, le réduire à une phrase sur l'accueil. |
| 21 | **« 1 sem. »** dans les chiffres du studio, alors que la forme unique imposée est « une semaine ». | accueil, bloc `(04) Le studio` | **Basse** | « 1 semaine », ou déplacer la mention. |
| 22 | **« 699.– CHF »** : le suffixe `.–` désigne déjà le franc, « CHF » le redouble. Le guide écrit `699.–`. | `components/Offres.tsx` | **Basse** | `699.–` seul, la note de bas de grille dit déjà « en francs suisses ». |
| 23 | **« Le coeur »** sans ligature, dans un texte visible. | `components/NoyauHero.tsx:158` | **Basse** | « Le cœur ». |
| 24 | **L'horloge de la navigation est servie à `Genève — 00:00`** et n'est corrigée qu'au démarrage du JS. Premier rendu à minuit, et minuit définitif si le script échoue. | `components/Nav.tsx:74` | **Basse** | Servir l'heure de Genève au rendu, ou n'afficher le bloc qu'une fois l'heure connue. |
| 25 | **« Je suis là pour votre projet — parlons-en. »** dans la réponse hors-sujet du prompt : le mot interdit revient par la porte de l'assistant. | `lib/chat-prompt.ts` | **Basse** | « Je suis là pour votre projet. Qu'est-ce que vous cherchez à faire faire ? » |

---

## 2. Les cinq réécritures qui rapportent le plus

### 2.1 — Le message d'accueil de l'assistant (constat 8)

**Avant** — `components/ChatWidget.tsx:36`

> Bonjour. Je prépare votre proposition avec Ayoub. Quel est votre métier, et
> avez-vous déjà un site en ligne ?

**Après**

> Bonjour. Je prépare votre proposition avec Ayoub. Qu'est-ce que vous cherchez
> à faire faire ?

*Pourquoi* : deux questions dans un message contredisent la règle « UNE seule
question par message » du prompt, et « avez-vous déjà un site » ferme la
conversation sur le site alors que le studio vend aussi l'identité, les
imprimés, les photos et les réseaux. Le prompt a été corrigé pour ça ; le
message d'accueil, écrit en dur à côté, ne l'a jamais été. C'est la toute
première phrase que lit un visiteur.

### 2.2 — Le bouton de conversion de l'assistant (constat 7)

**Avant** — `components/ChatWidget.tsx:229`

> Terminer la conversation

**Après**

> Envoyer ma demande à Ayoub

*Pourquoi* : c'est le bouton qui enregistre le lead. Il porte aujourd'hui le
seul mot qui invite à partir. Le formulaire dit déjà « Envoyer ma demande » —
la même action mérite le même mot.

### 2.3 — Le prix mensuel obligatoire (constat 3)

**Avant** — carte L'Assistant, accueil : le prix `2'499.–`, les puces, le bouton
« Automatiser mes demandes ». Le `129.–/mois obligatoire` n'arrive que dans la
note sous la grille, après le bouton.

**Après** — sur la carte, entre le prix et les puces :

> **2'499.–** · TVA comprise
> **puis 129.–/mois dès la 2ᵉ année** — obligatoire, l'assistant tourne en continu

*Pourquoi* : un engagement récurrent imposé qui n'est lisible qu'après le bouton
est un prix caché. `/services/l-assistant` le fait déjà bien — c'est le seul
endroit du site qui respecte la règle. Et ça se vend : c'est ce qui explique que
l'assistant fonctionne encore l'année suivante.

### 2.4 — L'engagement de réponse au formulaire de l'accueil (constat 5)

**Avant** — `components/FooterContact.tsx`

> ou dites-moi en deux lignes ce qu'il vous faut
> [formulaire]

**Après**

> ou dites-moi en deux lignes ce qu'il vous faut
> **Réponse le jour ouvrable suivant.**
> [formulaire]

*Pourquoi* : c'est l'endroit où naît la question « quand est-ce qu'on me
répond ? ». `/contact` y répond, l'accueil non — et c'est l'accueil qui reçoit
le trafic. La formulation doit être identique au caractère près, sinon un même
engagement dit deux fois différemment devient deux engagements.

### 2.5 — Les panneaux « avant » du carrousel (constat 9)

**Avant**

> Bienvenue sur le site du Comptoir !! · NOUVEAU : soirée jazz le jeudi !!! ·
> ★ SOIREE ★ JAZZ !!! venez nombreux !!! · Fax : 022 000 00 01

**Après**

> Le Comptoir · Bar, ambiance, billard · Ouvert du mardi au samedi ·
> Tél. 022 000 00 00

*Pourquoi* : le « avant » qu'on montre est le site que le prospect a chez lui.
Il doit être **daté**, pas ridicule — un site sobre de 2014 fait la démonstration
aussi bien, et n'oblige pas le lecteur à se reconnaître dans une blague dont il
est la chute. C'est écrit dans les deux référentiels, dans les mêmes termes.

---

## 3. Drapeaux juridiques

| Point | Risque | Action |
|---|---|---|
| **`®` sur « Studio de création digitale »** | Le sigle affirme une marque enregistrée. Aucune ne l'est, et la forme juridique n'est pas arrêtée. En Suisse, une indication trompeuse sur son entreprise relève de la LCD art. 3. | Retirer. C'est un caractère. |
| **L'assistant écrit « 1 499 CHF TTC »** | « Aucun prix affiché sans la mention TVA comprise » est un interdit du dépôt (`CLAUDE.md`). L'assistant est un canal de vente : ce qu'il annonce engage comme le reste. | Contrat de format dans le prompt (constat 2). |
| **« chiffré après deux questions »** | Affirmation sur un processus qui n'existe pas, répétée cinq fois. | Créer le parcours ou retirer la phrase. |
| **« Le Comptoir »** | Client inventé. Couvert aujourd'hui par les étiquettes « démonstration » / « établissement fictif », qui sont présentes et lisibles. **Le risque est maîtrisé, pas éteint** : il le redeviendrait à la première étiquette perdue. | Remplacer par le client réel dès son accord. |
| **Hébergement** | Corrigé le jour même : `/mentions-legales` et `/confidentialite` annoncent désormais Vercel et des serveurs en Allemagne. **Vaut tant que la région du projet Vercel est `fra1`** — le défaut est Washington. | Régler la région avant la mise en ligne. |

---

## 4. L'assistant — état mesuré

**Il fonctionne.** Sondé en direct, provider `groq`, modèle `openai/gpt-oss-120b` :
deux conversations complètes, HTTP 200, réponses en français, une seule question
par message, déroulé qui avance. Le repli formulaire, le plafond de débit et le
budget 24 h sont en place dans `app/api/chat/route.ts`.

Trois défauts, tous dans le texte et aucun dans la mécanique :

1. **Le format des prix** (constat 2) — le seul qui engage.
2. **Le message d'accueil** (constat 8) — écrit en dur, jamais aligné sur le prompt.
3. **Le bouton de fin** (constat 7) — le mot fait fuir au moment de convertir.

**Ce qui aggrave les trois** : `/studio` consacre une section entière — *(05) La
démonstration* — à envoyer le visiteur poser une question de prix à l'assistant
(« Posez-lui une question sur une prestation ou sur un prix », « vous pouvez le
mettre en défaut vous-même »). Le site conduit donc son meilleur prospect droit
sur le défaut, avec l'invitation explicite de le chercher.

C'est aussi pour ça que ces trois lignes valent d'être corrigées avant tout le
reste : **c'est le seul endroit du site où la preuve se manipule au lieu de se
lire**, et il coûte trois chaînes de caractères.

---

## 5. Ordre proposé

Rien ici ne dépend d'une décision non prise, sauf mention contraire.

| Rang | Lot | Constats | Effort |
|---|---|---|---|
| 1 | **L'assistant** — format des prix, accueil, bouton de fin | 2, 7, 8, 25 | 1 h |
| 2 | **Les quatre mots qui engagent** — `®`, « Parlons-en », « Écrivez-nous », « mobile d'abord » | 1, 4, 14, 15 | 30 min |
| 3 | **Le point de décision** — engagement de réponse au formulaire de l'accueil, champ e-mail, 129.–/mois sur la carte | 3, 5, 6 | 2 h |
| 4 | **Le carrousel** — désamorcer les « avant » | 9 | 1 h |
| 5 | **Les CTA et `/contact`** — alignement sur le guide, une seule adresse | 12, 13, 16 | 1 h |
| 6 | **Les 14 pages manquantes** — ou le retrait des liens | 10 | déjà au diagnostic, bloc 2 |
| 7 | **Finitions** — numérotation, doublons, `cœur`, `1 sem.`, `699.– CHF`, horloge | 18–24 | 1 h |

Le lot 1 se fait sans toucher à une seule mise en page. Le lot 4 est le seul qui
demande un arbitrage de sa part : c'est son carrousel, et la correction touche
au dessin des panneaux, pas seulement au texte.
