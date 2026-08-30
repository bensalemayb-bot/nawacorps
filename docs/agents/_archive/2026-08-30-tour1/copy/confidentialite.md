# Réécriture — page `/confidentialite`

> Mode `propose`. Aucun fichier du site n'est modifié.
> Fichier : `app/(site)/confidentialite/page.tsx`.
> **Mot-clé cible** : *politique de confidentialité Nawa Corps (nLPD)*. Il est
> dans le `title`, dans la `meta description` et dans le `h1` — inchangés.
>
> ⚠️ **Cette page décrit aujourd'hui un site qui n'existe plus.** Trois de ses
> affirmations sont devenues fausses depuis que le formulaire et l'assistant
> sont en ligne. Ce n'est pas une question de style : une information inexacte
> sur une page de protection des données est un défaut de fond, et c'est la
> seule page du site dont le contenu engage juridiquement.
>
> **Je ne suis pas juriste, et ce fichier ne fait pas office d'avis juridique.**
> Les corrections ci-dessous alignent le texte sur ce que le site fait
> réellement ; elles ne garantissent pas la conformité de l'ensemble.

---

## 1. La ligne à supprimer immédiatement

- **AVANT** (`:56`) — **« Formulaire et assistant arrivent prochainement »**
- **APRÈS** — *ligne supprimée.*
- **POURQUOI.** Le formulaire (`components/ContactForm.tsx`) et l'assistant
  (`components/ChatWidget.tsx`) sont **en production**, ils collectent nom,
  téléphone, message et contenu des conversations, et le reste de cette page
  décrit déjà cette collecte au présent. La page se contredit donc elle-même de
  quatre lignes d'écart, et la version qui rassure — « ça n'existe pas encore »
  — est celle qui est fausse. Priorité **haute**, avant toute autre correction
  du site.
- **PREUVE.** `components/ContactForm.tsx`, `components/ChatWidget.tsx`,
  `app/api/contact`, `app/api/chat` ; le docblock du fichier lui-même
  (`:11-14`) date d'avant les blocs B8-B9 et n'a pas été mis à jour.

## 2. L'hébergement des données

- **AVANT** (`:50-51`) — Hébergement des données — **« Suisse. »**
- **APRÈS** — **Hébergement des données** — **« Le site et la base de données
  sont hébergés en Suisse. Les conversations avec l'assistant sont traitées par
  un fournisseur de modèle de langage établi hors de Suisse : ce qui est écrit
  dans le chat lui est transmis pour produire la réponse. Si vous préférez ne
  pas passer par là, le formulaire et WhatsApp restent ouverts. »**
- **POURQUOI.** Deux problèmes, dont un sérieux.
  **(a)** « Suisse » est affirmé ici comme un fait, alors que la page des
  mentions légales écrit à la même heure « [Infomaniak, Suisse — à confirmer] ».
  Deux pages du même site, deux niveaux de certitude sur la même donnée.
  **(b)** Surtout : l'assistant appelle un fournisseur de LLM externe — Gemini
  ou Groq selon `LLM_PROVIDER` (`lib/llm.ts`, CLAUDE.md § Stack). **Le contenu
  des conversations sort donc de Suisse**, et la page dit l'inverse. C'est une
  communication de données à l'étranger, et la loi révisée sur la protection des
  données impose d'en informer la personne concernée.
- **PREUVE.** `lib/llm.ts` ; CLAUDE.md, § Stack : « LLM : Gemini ou Groq,
  sélectionné par `LLM_PROVIDER` ».
- **POINT OUVERT.** Le fournisseur doit-il être **nommé** ? La formulation
  ci-dessus reste générique parce que `LLM_PROVIDER` peut changer sans que
  personne pense à rouvrir cette page — un nom écrit en dur deviendrait faux au
  premier basculement. À trancher avec un conseil juridique.

## 3. Les traceurs

- **AVANT** (`:52`) — « Pas de cookies publicitaires ni de traceurs tiers. »
- **APRÈS** — **« Pas de cookies publicitaires, pas de traceur tiers, pas de
  mesure d'audience. Le site ne dépose rien pour vous suivre. »**
- **POURQUOI.** L'affirmation actuelle est vraie et vérifiable — aucun script
  d'analytics n'est chargé, `SchemaStudio` n'émet qu'un `<script>` de donnée
  structurée et aucun pixel. Elle mérite d'être dite en entier plutôt qu'à
  moitié : c'est un des rares endroits du site où le studio a un fait net à
  opposer à ce que le visiteur redoute. Aucune promesse ajoutée, une négation
  précisée.
- **PREUVE.** `components/SchemaStudio.tsx` et son commentaire dans
  `app/(site)/page.tsx:31` (« N'émet qu'un `<script>` : aucun pixel »).

## 4. Les données collectées

- **AVANT** (`:44-45`) — Formulaire de contact (nom, téléphone, message) et
  assistant de conversation (contenu des échanges, prénom, numéro).
- **APRÈS** — **« Formulaire de contact : votre nom, votre téléphone, votre
  message, et l'adresse de votre site si vous la donnez. Assistant de
  conversation : le contenu de l'échange, plus le prénom et le numéro que vous y
  laissez. Rien d'autre n'est demandé, et aucun champ n'est obligatoire hors de
  ceux-là. »**
- **POURQUOI.** Le champ libre du formulaire s'intitule « Votre site actuel,
  votre besoin » (`ContactForm.tsx:117`) : l'URL du site du visiteur est donc
  collectée et ne figure pas dans la liste. Glossaire : « assistant », jamais
  « chatbot » — déjà respecté.
- **PREUVE.** `components/ContactForm.tsx:99-117` ;
  `components/ChatWidget.tsx:35-36`.

## 5. La conservation

- **AVANT** (`:48-49`) — Conservation — « 12 mois, puis suppression. »
- **APRÈS** — **« 12 mois après notre dernier échange, puis suppression. »**
- **POURQUOI.** « 12 mois » sans point de départ est la même faute que
  « 72 heures » sans point de départ : le lecteur ne peut pas savoir quand le
  compteur démarre. Trois mots le disent. C'est aussi la règle du guide (§4,
  « On nomme le point de départ et la condition ») appliquée hors du discours
  commercial.
- **POINT OUVERT.** Cette durée est-elle réellement appliquée ? Aucune purge
  automatique n'a été relevée dans le schéma Prisma. Une durée annoncée et non
  tenue est pire que pas de durée du tout.

---

## Conformes, laissés tels quels

| Texte | Ligne | Pourquoi il reste |
|---|---|---|
| Nawa Corps · nLPD *(étiquette)* | `:39` | Nomme le cadre légal exact sans jargon. |
| Confidentialité *(h1)* | `:41` | 1 mot, porte le mot-clé, ne promet rien. |
| Finalité — « Répondre à votre demande et établir une proposition. » | `:46-47` | Deux finalités, pas de fourre-tout. Exemplaire. |
| Vos droits — « Accès, rectification, suppression sur simple demande à … » | `:55` | Conforme, sous réserve que l'adresse soit réelle. |
| ← Retour au site | `:57` | — |

## Points ouverts

1. **L'adresse `hello@nawacorps.ch` n'est pas confirmée** (`lib/site.ts:42`,
   `NAP_CONFIRME = false`). C'est le canal d'exercice des droits : s'il ne
   fonctionne pas, la page annonce un droit qu'elle ne permet pas d'exercer.
2. **La durée de conservation de 12 mois n'a pas de mécanisme de purge relevé.**
   À confirmer, ou à reformuler.
3. **Le transfert vers le fournisseur de LLM doit être validé juridiquement**,
   pas seulement décrit. Ce fichier propose une formulation ; il ne dit pas
   qu'elle suffit.
