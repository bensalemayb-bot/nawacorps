# Guide de voix — Nawa Corps

> Une seule voix sur tout le site : celle-ci. `page-produit` s'y conforme ; ce
> guide ne se conforme à rien d'autre qu'au positionnement et à la veille.
> Écrit le 2026-08-30, après la porte G1 (GO AVEC RÉSERVES, réserves B1 à B6).
> Entrées : `.agents/product-marketing.md`, `docs/agents/veille/synthese.md`,
> `docs/agents/veille/concurrents.json`, `docs/agents/reviews/boss-G1-tour1.md`.

---

## 1. La promesse centrale, en une phrase

> **Votre site est refait en 72 heures à partir de votre feu vert — pas à partir
> du jour où vous m'aurez envoyé vos textes.**

Une semaine si on part de zéro. C'est une affirmation sur ce que le studio
livre, pas sur le marché : elle est testable en achetant, et sa vérité ne dépend
d'aucune veille (mémo G1, point A).

**Ce qui ne s'écrit jamais**, nulle part, sous aucune forme : « le seul à
Genève », « personne d'autre », « le plus rapide », « aucun concurrent ». Le
panel de veille compte 3 acteurs proprement genevois et 8 voisins dont le délai
n'a pas été vérifié : le superlatif n'est pas portable, et il est précisément ce
que vise la LCD art. 3. (Réserve B1.)

---

## 2. À qui l'on parle, et les trois choses qu'il veut entendre

Le gérant d'une PME de services à Genève, 1 à 20 employés, dont le site a plus
de cinq ans. Il dirige, il vend, et il fait le métier. Son site a été fait une
fois puis abandonné — par un prestataire, un stagiaire, un proche.

1. **« Ça ne va pas me manger ma semaine. »** Il n'a pas le temps, et il le sait
   d'avance : son site est vieux parce qu'il n'a jamais eu trois jours à y
   passer. Le délai court le rassure moins que l'absence de travail à fournir.
2. **« Je vais récupérer des demandes concrètes. »** Devis, rendez-vous, appels.
   Pas du trafic, pas de la visibilité — des gens qui écrivent.
3. **« Il sera encore là dans un an. »** Il a déjà été lâché une fois. Son site
   actuel en est la preuve, et c'est lui qui a payé.

---

## 3. Les trois piliers, et leur preuve

### Pilier 1 — Le compteur démarre quand vous dites oui

72 heures si le site existe, une semaine en partant de zéro. Le studio reprend
les textes de l'ancien site et rédige la maquette lui-même ; il n'attend donc
aucune livraison du client pour commencer.

> **PREUVE** — `.agents/product-marketing.md` §5, « Les conditions », ligne
> *Textes* : « Compris dans le prix. Site existant : les textes sont repris, le
> client signale ses modifications. Départ de zéro : maquette proposée, le
> client ajuste. » Délai réel confirmé au §9.
>
> **Sourcé aussi, mais jamais publié** : les deux seuls concurrents rapides du
> panel conditionnent leur délai à la fourniture du contenu (« après validation
> du contenu », « une fois le contenu fourni ») — `veille/concurrents.json`,
> champs `delais_annonces`. C'est ce qui rend le pilier différenciant, et c'est
> un argument **interne**. Il se traduit en copy par une affirmation positive
> sur nous, jamais par une comparaison. (Réserve B2.)

**Formule vivante :** *« Le délai démarre à votre feu vert, pas à votre envoi. »*

### Pilier 2 — Le site fait entrer des demandes

Formulaire de demande dès la première formule. Prise de rendez-vous et devis
chiffré automatiquement à la deuxième. Assistant, alerte téléphone, relance et
tableau de bord à la troisième.

> **PREUVE** — `.agents/product-marketing.md` §5, tableau des trois formules.
> Démonstration disponible : le palier 3 tourne sur ce site même (`ChatWidget`,
> `lib/chat-prompt.ts`, `lib/llm.ts`, `lib/telegram.ts`, `/admin`) — à ouvrir en
> rendez-vous plutôt qu'à décrire (§5, encadré « Le palier 3 existe déjà »).

### Pilier 3 — La deuxième année, c'est la même personne

Le suivi n'est pas une option qu'on choisit : il découle du palier acheté.
49.–/mois, 129.–/mois avec l'assistant, à partir de la deuxième année — la
première est comprise dans le prix du site.

> **PREUVE** — `.agents/product-marketing.md` §5, « Le récurrent ».
>
> **Interdit de vocabulaire :** « interlocuteur unique » et toute variante
> reconnaissable (« un seul interlocuteur ») appartiennent déjà à un acteur du
> panel. L'argument s'écrit sur l'**après-livraison** — la 2ᵉ année, le message
> qui trouve quelqu'un — que personne du panel ne revendique. (Réserve B4.)

---

## 4. Le ton

### On fait

- **On chiffre.** « 72 heures », « 699.– TVA comprise », « deux allers-retours »,
  « 85 × 55 recto-verso ». Un nombre bat un adjectif à chaque fois.
- **On vouvoie, et on parle à la première personne du singulier.** Le studio est
  une personne ; « nous » serait un déguisement.
- **On nomme le point de départ et la condition.** « Si vous avez déjà un
  site », « dès votre feu vert », « à partir de la 2ᵉ année ».

### On ne fait pas

- **On ne se moque jamais du « avant » du client.** Le site daté du prospect est
  exactement celui qu'on montre. « Daté », jamais « ridicule », jamais
  « catastrophique », jamais un compteur de visiteurs en clin d'œil. (§8 du
  positionnement.)
- **On ne compare pas.** Ni nommément, ni en creux, ni par une note, une audience
  ou un volume de clients. Aucun concurrent n'existe dans le texte public.
  (Réserve B2.)
- **On ne défend pas le prix.** Aucune ligne n'explique pourquoi c'est moins
  cher qu'ailleurs, tant que la décision de grille n'est pas tranchée par
  Boualem. Le prix s'affiche ; il ne se plaide pas. (Réserve B6.)

---

## 5. La règle des 72 heures — non négociable

**« 72 heures » ne voyage jamais seul.** Chaque occurrence porte, dans la même
unité de lecture, **au moins un** des deux éléments suivants :

- **le point de départ** — « dès votre feu vert », « si vous avez déjà un site » ;
- **ce qui est livré dedans** — formulaire, rendez-vous, devis chiffré, fiche
  Google, mise en ligne.

Raison : dans la veille, le couple « 48-72 h + prix d'entrée à 199 € » est la
signature du bas de marché. Un « 72 h » isolé range le studio dans ce
voisinage-là. (Réserve B3 ; `veille/concurrents.json`, C4.)

Une seule promesse de délai sur tout le site. « 72 heures » en prose, « 72 h »
toléré uniquement dans un title ou une meta où la place manque. Jamais
« trois jours », jamais « 48 h », jamais « deux semaines », jamais
« rapidement ».

---

## 6. Lexique

### À employer

| Terme retenu | À la place de |
|---|---|
| remise à niveau, refonte | refonte digitale, transformation, modernisation |
| votre site | votre présence digitale, votre image en ligne |
| demandes, devis, rendez-vous | leads, conversions, funnel, prospects chauds |
| 72 heures | rapidement, dans les meilleurs délais, express |
| dès votre feu vert | dès réception de vos éléments |
| lisible sur téléphone | responsive, mobile-first, adaptatif |
| fiche Google | Google My Business, référencement local |
| trouvé sur Google | visibilité, notoriété digitale |
| deux allers-retours | révisions illimitées |
| TVA comprise | HT, hors taxes, prix nets |

### À éviter — saturés chez les concurrents

Relevé dans `veille/concurrents.json`, champ `lexique_recurrent`. Un terme
présent chez trois acteurs ou plus ne différencie plus rien ; il fait entendre
le même discours que tout le monde.

| Terme | Présence relevée |
|---|---|
| **sur mesure** | 4 acteurs sur 6 — et déjà interdit par la définition de rôle |
| **transparent / sans coûts cachés / sans frais cachés** | 3 sur 6, dont un dans sa promesse d'accueil |
| **SEO / référencement naturel** | 5 sur 6 |
| **accompagnement** | 3 sur 6 |
| **devis gratuit** | 3 sur 6 |
| **Suisse romande** | 5 sur 6 — dire **Genève**, qui est le marché réel |
| **responsive / mobile** | 3 sur 6 |
| **sans engagement** | relevé, et vague juridiquement |
| **clé en main** | 1 sur 6, mais c'est la promesse entière d'un acteur |
| **interlocuteur unique / un seul interlocuteur** | **INTERDIT** — réserve B4 |
| **meilleur commercial** | promesse d'accueil de 2 acteurs |
| **GEO, croissance du trafic, automatisation IA** | positionnement revendiqué par 2 acteurs |

### À éviter — mots vides

leader, innovant, unique, de qualité, moderne, dynamique, passionné, créatif,
solution, digital**e** (l'adjectif seul), « à votre écoute », « votre partenaire ».

Une exception assumée : **PME** est saturé (4 sur 6) mais reste employé — c'est
le nom de la cible, pas un argument. Il ne doit jamais porter la différence à
lui seul.

---

## 7. Les CTA — verbe + bénéfice

| Contexte | Formule | Ce qu'elle promet |
|---|---|---|
| Hero, principal | **Faire refaire mon site** | l'objet du contrat |
| Hero, secondaire | **Voir les démonstrations** | la preuve avant l'engagement |
| Nav (pastille) | **Refaire mon site** | idem, format court |
| Formule 1 | **Refaire mon site** | |
| Formule 2 | **Recevoir mes demandes** | le bénéfice du palier |
| Formule 3 | **Automatiser mes demandes** | le bénéfice du palier |
| Carte du studio | **Demander un devis** | |
| Pied de page | **Écrire sur WhatsApp** | le canal, pas l'action abstraite |

Jamais : « En savoir plus », « Découvrir », « Contactez-nous », « Parlons-en »,
« Cliquez ici ». Une pastille de navigation n'échappe pas à la règle.

---

## 8. Règle de preuve

**Toute affirmation qui n'est ni dans `.agents/product-marketing.md`, ni dans
`docs/agents/veille/`, est reformulée en fait vérifiable ou supprimée.** Aucune
exception, y compris pour un détail rassurant qui « ne mange pas de pain » : un
délai de réponse, une synchronisation d'agenda, un nombre de clients.

Trois interdits qui en découlent, et qui sont des règles de droit autant que de
style :

1. **Aucune référence client inventée**, aucun avis fabriqué, aucun compteur
   fictif — LCD art. 3 sur les indications trompeuses. Un travail de
   démonstration est étiqueté « démonstration », en toutes lettres, à côté de la
   pièce et pas en note de bas de page.
2. **Aucun travail présenté comme une réalisation cliente s'il n'en est pas
   une.** Pour une pièce réalisée au sein de 101 Agency : mention explicite du
   cadre et du rôle, et accord du partenaire (positionnement §6).
3. **Aucun prix affiché sans « TVA comprise »** (CLAUDE.md, Interdits).

Les affirmations retirées faute de preuve sont consignées dans
`docs/agents/copy/_sans-preuve.md`, avec ce qu'il faudrait pour les réintroduire.

---

## 9. Langues

**Français uniquement à ce jour.** Aucune infrastructure i18n n'est en place :
toutes les chaînes sont écrites en dur dans le JSX (CLAUDE.md). Une version
anglaise est prévue — c'est un chantier d'architecture, pas une traduction, et
elle ne doit pas être commencée par des chaînes bilingues glissées dans le JSX.

- **Français de Suisse.** Les montants s'écrivent `699.–`, `1'499.–`, avec
  l'apostrophe comme séparateur de milliers. Jamais `699 CHF HT`, jamais `€`.
- **Ponctuation française** : espace insécable avant `: ; ? !` et à l'intérieur
  des guillemets « ». Les guillemets sont français, pas anglais.
- **Arabe : sans objet sur ce site.** La règle reste écrite pour mémoire — si de
  l'arabe apparaissait un jour, il serait rendu en RTL (`dir="rtl"`, `lang="ar"`)
  avec la ponctuation arabe `؟ ، ؛`, et jamais en LTR ni avec une ponctuation
  latine.
- **FR / EN** est annoncé comme langue de travail du studio (section « Le
  studio », `lib/site.ts` → `LANGUES`) et comme prestation payante de la
  formule 3. Ce n'est pas la même chose que le site en deux langues : ne pas
  laisser croire que ce site-ci est bilingue.

---

## 10. Glossaire — un mot par concept, partout

Ces quinze entrées sont contraignantes : la même chose se dit avec le même mot
sur toutes les pages, tous les CTA, tous les libellés de base de données et
toutes les métadonnées.

| # | Terme | Ce qu'il désigne, et ce qu'il remplace |
|---|---|---|
| 1 | **le studio** | Nawa Corps comme entité. Jamais « l'agence », jamais « nous ». |
| 2 | **refonte** / **remise à niveau** | Refaire un site qui existe. Jamais « transformation », « modernisation ». |
| 3 | **72 heures** | Le délai de refonte, forme unique. « 72 h » toléré en title/meta seulement. |
| 4 | **une semaine** | Le délai en départ de zéro. Jamais « 7 jours », jamais « 5 jours ouvrés ». |
| 5 | **votre feu vert** | Le point de départ du délai. Jamais « la commande », « la signature », « l'acompte ». |
| 6 | **une demande** | Ce qui entre par le site : devis, rendez-vous, contact, appel. Jamais « lead », jamais « contact entrant ». |
| 7 | **devis chiffré** | L'estimation immédiate rendue au visiteur (formules 2 et 3). Jamais « simulateur », jamais « estimation gratuite ». |
| 8 | **prise de rendez-vous** | La réservation en ligne. Jamais « booking », jamais « agenda en ligne ». |
| 9 | **l'assistant** | L'assistant conversationnel de la formule 3. Jamais « chatbot », jamais « IA » employée seule. |
| 10 | **fiche Google** | Jamais « Google My Business », jamais « profil d'établissement ». |
| 11 | **le suivi** | L'abonnement mensuel à partir de la 2ᵉ année. Jamais « maintenance », jamais « support ». |
| 12 | **allers-retours** | Les deux tours de correction compris. Jamais « révisions », jamais « itérations ». |
| 13 | **lisible sur téléphone** | Jamais « responsive », jamais « mobile-first ». |
| 14 | **démonstration** | Une pièce faite par le studio pour montrer, sans client derrière. Jamais « réalisation », « projet », « cas client », « portfolio ». |
| 15 | **TVA comprise** | La mention obligatoire sous tout prix. Jamais « TTC », jamais « tout compris » employé seul. |

**Les trois formules gardent leur nom exact et leur article** : *La Vitrine*,
*Le Site*, *L'Assistant*. Majuscule initiale, jamais au pluriel, jamais
abrégées, jamais traduites.
