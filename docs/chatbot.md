# Le chatbot de qualification — mode d'emploi

> Écrit **à partir du code**, pas de mémoire. Chaque affirmation renvoie au
> fichier qui la porte. Si le code change et que cette page ne suit pas, c'est
> cette page qui a tort.

Le chatbot est l'assistant de la bulle en bas à gauche du site public. Il pose
des questions à un dirigeant de PME, comprend son besoin, récupère un prénom et
un numéro, puis laisse une trace en base et une notification Telegram. Quand le
modèle ne répond pas, il ne montre **jamais** d'erreur : il renvoie vers le
formulaire de contact.

---

## Les fichiers

| Fichier | Rôle |
|---|---|
| `components/ChatWidget.tsx` | La bulle, le panneau, l'envoi, la clôture. Ses propres textes, en français et en anglais. |
| `app/chat.css` | Le style du panneau et de la bulle. |
| `lib/chat-prompt.ts` | Le prompt de **conversation**, dans les deux langues ; catalogue et prix injectés depuis Postgres. |
| `lib/extract-prompt.ts` | Le prompt d'**extraction**, dans les deux langues, qui transforme la conversation en objet JSON. |
| `lib/llm.ts` | Le seul fichier qui sait qu'il existe deux fournisseurs. Il ne sait **rien** de la langue. |
| `app/api/chat/route.ts` | Un tour de conversation. |
| `app/api/chat/finalize/route.ts` | La clôture : extraction, écriture, notification. |
| `app/api/health/chat/route.ts` | Diagnostic, derrière l'authentification admin. |

---

## Démarrer en local

```bash
npm run db:up      # docker compose up -d db  (PostgreSQL 17)
npx prisma migrate deploy
npm run db:seed    # peuple la table Service — c'est de là que viennent les prix
npm run dev        # http://localhost:3000
```

L'ordre n'est pas décoratif : `buildSystemPrompt()` lit la table `Service` à
chaque requête (`lib/chat-prompt.ts`). Sans `db:seed`, le bot n'a **aucun prix
à citer** — il n'en invente pas, il n'en a simplement pas.

Vérification avant de committer, il n'existe aucune suite de tests :

```bash
npm run typecheck
npm run lint
npm run build
```

---

## Les variables d'environnement du chat

Noms seulement. **Les valeurs vivent dans `.env`, qui n'est ni lu ni écrit par
la documentation, ni par personne d'autre que le propriétaire du dépôt.**
`.env.example` les documente déjà toutes ; la liste ci-dessous dit à quoi
chacune sert et ce qui se passe quand elle manque.

| Variable | Ce qu'elle fait | Si elle est absente |
|---|---|---|
| `LLM_PROVIDER` | Choisit qui répond : `groq` ou `gemini`. Relue **à chaque appel**, pas au chargement du module (`lib/llm.ts`). | Vaut `gemini`. Toute autre valeur — vide, mal orthographiée — vaut `gemini` aussi : une faute de frappe ne doit pas éteindre le bot. |
| `GEMINI_API_KEY` | Clé Google AI Studio. Voyage dans l'en-tête `x-goog-api-key`, jamais dans l'URL. | `{ unavailable: "GEMINI_API_KEY absente" }` → la route rend `503 { fallback: true }` et l'UI propose le formulaire. |
| `GROQ_API_KEY` | Clé console.groq.com. Voyage en `Authorization: Bearer`. Lue **uniquement** si `LLM_PROVIDER=groq`. | Même contrat que ci-dessus, avec `GROQ_API_KEY absente`. |
| `CHAT_DAILY_LIMIT` | Plafond global de tours de conversation sur 24 h glissantes, tous visiteurs confondus (`app/api/chat/route.ts`). Ceinture locale, pas un miroir du quota du fournisseur. | Vaut `200`. Une valeur non numérique ou ≤ 0 retombe aussi sur 200. |
| `IP_HASH_SALT` | Sel du hachage des IP. Aucune IP en clair en base — le débit et les lignes `Conversation` ne portent qu'un `ipHash`. | Voir `lib/iphash.ts`. |
| `TELEGRAM_BOT_TOKEN` | Token @BotFather, pour la notification de lead à la clôture. | Notification simplement sautée. **Le lead et la conversation sont écrits quand même.** |
| `TELEGRAM_CHAT_ID` | Destinataire de cette notification. | Idem. |
| `ADMIN_PASSWORD`, `ADMIN_SECRET` | Pas propres au chat, mais ce sont eux qui gardent `/api/health/chat`. | Sans mot de passe, la porte est fermée, jamais ouverte (`lib/admin-auth.ts`). |

Aucune de ces valeurs ne sort jamais de l'application : les journaux et les
réponses HTTP ne citent que des **noms** de variables et des codes.

---

## Basculer Gemini ↔ Groq

Une ligne de `.env`, puis redémarrer :

```
LLM_PROVIDER=groq     # ou gemini, ou rien du tout
```

Aucun appelant ne connaît le fournisseur : tout le reste du dépôt ne voit que
`askLlm()` et `askLlmJson()`, qui rendent le même type des deux côtés. Le
routage tient en deux lignes à la fin de `lib/llm.ts`.

Modèles épinglés dans le code — **jamais un alias `-latest`** : un alias suivrait
tout seul et changerait le comportement du bot sans qu'une ligne du dépôt bouge,
alors que ce comportement *est* le produit.

| Fournisseur | Modèle épinglé |
|---|---|
| Gemini | `gemini-3.5-flash` |
| Groq | `openai/gpt-oss-120b` |

---

## Les deux plafonds, et pourquoi ils ne se ressemblent pas

**Groq — ~6 requêtes par minute.** Ce n'est pas une limite en requêtes mais en
**TPM, tokens par minute** : 8000 en tier `on_demand`, et le compte inclut
l'entrée **plus les `max_tokens` réservés**, soit environ 1300 par appel au jour
du relevé. Six tirs d'affilée la saturent ; espacés de 13 s, ils passent tous. En
production cela vaut ~6 requêtes par minute *tous visiteurs confondus*. Au-delà :
429, donc `{ unavailable }` et repli formulaire — jamais d'erreur nue. **Le
budget revient tout seul à la minute suivante.**

**Ce chiffre de 1300 est daté, et il a bougé.** Le 31 août 2026, les règles
« nous » et Google — contre-exemples compris — ont fait passer le bloc français
du prompt d'environ 6 000 à environ 8 500 caractères, catalogue injecté en plus.
L'entrée pèse d'autant plus lourd, et le nombre de requêtes tenables par minute
baisse d'autant. Il se re-mesure par le protocole de sonde ci-dessous, pas au
jugé.

**Gemini — 20 requêtes par modèle et par jour.** Le quota gratuit se compte
**par modèle**, et il ne revient pas de la minute : il revient le lendemain.
Conséquence de diagnostic : si le repli formulaire se déclenche en boucle avec
un 429 au journal, ce n'est probablement pas la clé qui est morte, c'est *ce
modèle-là* qui a épuisé sa journée. Changer de modèle rend un budget neuf
immédiatement.

Second piège, celui-là propre à Gemini : **une sonde à deux tokens peut
répondre 200 pendant que la route, qui envoie ~1900 caractères de prompt, prend
un 429.** D'où la règle ci-dessous.

---

## Le protocole de sonde — avant tout changement de modèle

Décrit en commentaire dans `lib/llm.ts` (relevés B9 et B10b). Il ne se
contourne pas : les deux fois où il a été écourté, la mesure a menti.

1. **Six appels par modèle candidat**, pas un. Un seul 200 ne dit rien d'un
   modèle qui répond 503 une fois sur deux.
2. **Espacés.** ~13 s côté Groq. Six tirs immédiats saturent la limite TPM et
   font accuser le modèle d'un 429 qui vient de la cadence.
3. **Avec le prompt système complet**, celui que `buildSystemPrompt()`
   fabrique — pas un « ping ». Un prompt court ne consomme pas le même budget
   et ne subit pas les mêmes refus.
4. **Avec un historique plausible**, plusieurs tours déjà échangés. La première
   sonde Groq posait la question de prix au tout premier tour, là où le prompt
   impose « demande d'abord le métier » : le modèle obéissait, et on a pris son
   obéissance pour une esquive. On mesurait sa propre erreur.
5. **Juger le comportement, pas seulement la disponibilité.** Le critère retenu
   les deux fois : une question tarifaire sur le catalogue du studio. Un modèle
   qui classe « c'est combien la carte ? » en hors-sujet vide de son sens
   l'injection des prix depuis Postgres, même s'il répond 200 à tous les coups.
6. **Remplacer le bloc de commentaire de `lib/llm.ts` par le nouveau relevé,
   avec sa date.** Les taux qui y figurent sont datés et ne valent que pour ce
   jour-là ; la congestion se déplace.

Et une dépendance à ne pas oublier côté Gemini : `THINKING_CONFIG` suit la
génération du modèle. Gemini 2.5 veut `thinkingBudget`, Gemini 3.x veut
`thinkingLevel`. Se tromper coûte un 400 sec — ou pire, un réglage **accepté
puis ignoré**, donc une troncature invisible. Changer `MODEL_GEMINI` sans
changer cette constante casse la route.

---

## La route de diagnostic

`GET /api/health/chat` — **derrière l'authentification admin**. Il faut le
cookie de session `/admin` ; sans lui, 401.

```json
{ "provider": "groq", "model": "openai/gpt-oss-120b", "ok": true }
{ "provider": "gemini", "model": "gemini-3.5-flash", "ok": false, "reason": "HTTP 429" }
```

Elle répond toujours **200** : elle dit si *le modèle* est indisponible, pas si
*elle* a échoué — c'est justement la distinction qu'on vient chercher.

Trois choses à savoir avant de s'en servir :

- **Elle est authentifiée pour une raison.** Chaque appel consomme une requête
  du quota. Sans garde, n'importe qui pourrait éteindre le chatbot de la
  journée en rechargeant une URL.
- **Ne pas la marteler, même connecté.** Elle prend sa part du budget TPM de
  Groq et une unité du quota journalier de Gemini. Une sonde par incident.
- **Elle mesure la disponibilité, pas le comportement.** Deux tokens qui
  passent ne prouvent rien sur la tenue du déroulé. Pour ça, le protocole
  ci-dessus.

Elle ne rend jamais la moindre valeur de variable d'environnement : un nom de
fournisseur, un nom de modèle, un booléen, et le motif d'échec déjà formulé par
`lib/llm.ts` — qui ne cite que des **noms** de variables et des codes HTTP.

---

## Où atterrissent les conversations

À la clôture, `POST /api/chat/finalize`. Le widget l'appelle deux fois dans le
cas nominal — bouton « Terminer » (`reason: "completed"`), puis `pagehide` via
`sendBeacon` (`reason: "abandoned"`) — et `Conversation.sessionId` est
**unique** : la seconde tentative repart sans rien écrire.

**Une règle domine toutes les autres : les messages du visiteur ne se perdent
dans aucun scénario.** Modèle muet, JSON illisible, schéma inattendu, Telegram
en panne — la `Conversation` est écrite quoi qu'il arrive. Ce qu'on peut
perdre, c'est l'analyse ; jamais la trace de quelqu'un qui a pris le temps
d'écrire.

**`Conversation` — toujours.** Une ligne par session : `messages` (le fil
brut), `summary` (le résumé du besoin, ou `null` si l'extraction a échoué),
`extracted` (le JSON du modèle tel quel, même hors schéma), `ipHash`,
`leadId` éventuel.

**`Lead` — seulement si `name` **et** `phone` ont été extraits.** Les deux, pas
l'un des deux. La création se fait dans la **même transaction** que la
`Conversation` : un `Lead` sans sa conversation, ou l'inverse, serait une
demi-vérité en base. Le lead porte `source: "CHATBOT"`, `status: "NEW"`,
`score` (le `quality_score` de 1 à 5), `needSummary`, et les champs commerce
quand ils ont été dits.

**Telegram — après l'écriture, sous `try/catch`.** Une panne de notification ne
peut pas annuler un lead. Deux messages possibles : `🤖 Lead CHATBOT ★★★★☆ …`
quand les coordonnées y sont, `💬 Conversation sans coordonnées …` sinon.

Le tout se relit dans `/admin`.

---

## L'ordre des contrôles, et pourquoi il est ce qu'il est

`POST /api/chat` :

1. **Schéma** — rien de non valide n'atteint la suite. 16 messages max, 1500
   caractères par message, 8000 au total.
2. **Débit par IP hachée** — 30 requêtes par heure.
3. **Budget global** — `CHAT_DAILY_LIMIT` sur 24 h glissantes.
4. **Le compteur** — incrémenté seulement **après** les deux contrôles, sinon
   un flot refusé consommerait le budget qu'on vient de lui refuser.
5. **Le modèle** — indisponible pour quelque raison que ce soit : `503
   { fallback: true }`, jamais un 500 nu.

`POST /api/chat/finalize` : schéma, **idempotence**, débit, extraction,
écriture transactionnelle, notification. L'idempotence passe avant le débit et
l'extraction — rejouer une finalisation déjà faite ne doit ni consommer de
quota, ni compter dans le débit, ni écrire quoi que ce soit.

---

## Le chatbot est bilingue — par où passe la langue

Le français reste la langue par défaut, et **rien ne change pour lui** : une
requête sans `locale` se comporte exactement comme avant ce chantier, à
l'octet près.

### Le chemin de la langue, du layout au modèle

```
proxy.ts  ──(en-tête x-nawa-locale)──▶  app/(site)/layout.tsx
                                            │  locale = "fr" | "en"
                                            ▼
                                    <ChatWidget locale={locale} />
                                            │  prop
                                            ▼
                          POST /api/chat        { …, locale }
                          POST /api/chat/finalize { …, locale }
                                            │  zod, optionnel
                                            ▼
                     buildSystemPrompt(locale) / buildExtractPrompt(locale)
```

Quatre choses à savoir sur ce chemin :

- **La langue voyage dans le CORPS, pas dans un en-tête.** `proxy.ts` ne tourne
  pas sur `/api` : l'en-tête `x-nawa-locale` n'existe pas dans une route d'API.
  Et la clôture part parfois par `navigator.sendBeacon`, qui ne permet de poser
  aucun en-tête au-delà du type de contenu. Le corps est la seule voie qui
  marche dans les deux cas.
- **Le champ est optionnel et retombe sur le français** — `z.enum(LOCALES)
  .catch(LOCALE_DEFAUT)`. `.catch()` et non `.default()` : `.default()` ne
  couvre que l'absence, et une valeur présente mais inconnue (« de », « EN »)
  ferait échouer le schéma, donc un 400, donc **une conversation ou un lead
  perdus à cause d'un champ décoratif**.
- **La langue n'est pas une étape de l'ordre des contrôles.** Elle est lue en
  tête, avant la validation, parce qu'il faut bien une langue pour *rédiger* le
  refus du schéma. Elle ne fait accepter ni refuser aucune requête.
- **Il ne suffit pas de demander au modèle de répondre en anglais.** C'est tout
  le prompt qui bascule : les règles de prix, de délai et de « feu vert » n'ont
  d'effet que si elles existent dans la langue où le modèle rédige. Un prompt
  français suivi de « answer in English » les fait improviser.

### Les deux contrats du prompt

`lib/chat-prompt.ts` contient désormais **deux** blocs verbatim, un par langue,
et `lib/extract-prompt.ts` aussi. **Toute règle ajoutée, retirée ou reformulée
dans l'un doit l'être dans l'autre le même jour.** Les règles du prompt
français ont été gagnées une par une, le plus souvent après une faute du
modèle ; une version anglaise à qui il en manquerait une referait la même faute
devant un client anglophone, sans que personne ne relise.

L'anglais porte **une règle de plus**, et il la lui faut : les noms des trois
formules — `La Vitrine`, `Le Site`, `L'Assistant` — sont des noms propres et ne
se traduisent pas. En français la question ne se pose pas. En anglais, un
modèle écrit spontanément « The Showcase » et casse la marque sans qu'une ligne
du dépôt ne bouge. Le vocabulaire anglais, lui, n'est pas libre :
`docs/agents/brand/glossaire-anglais.md` l'impose terme par terme
(`VAT included`, `one week`, `your go-ahead`, `an enquiry`, anglais
britannique), et il est contraignant.

### Ce qui reste en français, délibérément

- **Les notifications Telegram.** Leur unique lecteur est Ayoub, sur son
  téléphone. Les traduire selon la langue du visiteur donnerait un fil
  bilingue à une personne qui n'en a qu'une, et deux formulations pour un même
  événement.
- **Le back-office `/admin`.** Il n'hérite pas du chrome public et n'a pas de
  version anglaise.
- **Les libellés de services quand `nameEn` est `null` en base.** C'est le
  repli documenté de `nomService` (`lib/catalogue.ts`), pas un oubli : les
  trois formules y restent françaises exprès.

En revanche `need_summary` **suit la langue du visiteur** : une conversation
anglaise se résume en anglais dans `Conversation.summary` et
`Lead.needSummary`, et cela se voit tel quel dans `/admin`. C'est le compromis
assumé — mieux vaut un résumé fidèle dans la langue du client qu'une traduction
faite par un modèle à qui on demande par ailleurs de n'inventer **rien**.
Même raison pour le tableau `services` de `Conversation.extracted`, qui porte
les libellés de la langue de la conversation.

### Le schéma d'extraction ne change PAS de langue

Les neuf clés (`name`, `phone`, `email`, `commerce_type`, `commerce_name`,
`need_summary`, `services`, `urgency`, `quality_score`) et les quatre valeurs
d'`urgency` (`immediat`, `ce_trimestre`, `plus_tard`, `inconnu`) sont des
**jetons**, pas des mots. Le même `SchemaExtraction` les relit dans les deux
langues ; une clé traduite ferait échouer le parse et la conversation partirait
en « non analysée » sans que rien ne le signale. Le prompt anglais l'écrit
explicitement, parce qu'un modèle qui rédige en anglais traduit spontanément
`immediate`.

Et la consigne **« Réponds UNIQUEMENT avec un objet JSON valide »** est
obligatoire des deux côtés : le mode `json_object` des API au format OpenAI
(`GROQ_MODE_JSON`) exige que le mot « JSON » figure dans le prompt, sinon la
requête part en 400. La version anglaise dit « Reply ONLY with a valid JSON
object » — le mot y est, et il doit y rester.

### `/api/contact` aussi

La même mécanique, pour le formulaire. La route acceptait un corps sans langue
et répondait toujours en français, y compris au visiteur venu de `/en` — et
ses messages **zod** étaient, eux, en anglais brut *partout*, y compris sur le
site français (« Too small: expected string to have >=2 characters »), parce
qu'aucune contrainte ne portait de message. Chaque contrainte porte désormais
sa phrase, dans les deux langues, et la route lit `locale` dans le corps.

---

## Le périmètre du prompt

Le studio ne vend pas que des sites : son métier, c'est **l'image de
l'entreprise en général** — identité, logotype, imprimés, photos, réseaux
sociaux, supports de restaurant. Le prompt le dit, et son étape 1
interdit explicitement de prononcer le mot « site » en premier : la question
d'ouverture est ouverte, et la liste d'exemples ne sort que si la personne
hésite.

Trois règles du prompt ont été durement gagnées et ne se réécrivent pas à la
légère (`lib/chat-prompt.ts`) — **et elles existent à l'identique dans le bloc
anglais du même fichier** :

- **Les prix** sont recopiés au caractère près depuis le catalogue Postgres,
  apostrophe et suffixe `.–` compris, toujours accompagnés de « TVA
  comprise » — jamais « TTC », « HT », « CHF », « francs » ni « euros ».
- **Le délai** s'écrit « une semaine », il ne concerne **que le site**, et il
  démarre au feu vert du client. Aucun délai en heures : « 72 h » et « 48 h »
  ont circulé, aucun n'est tenu.
- **Le « feu vert »**, c'est le client qui dit oui, et rien d'autre. Jamais la
  fourniture de textes ou de photos : le client n'a **rien** à préparer, et
  c'est l'argument de vente.

En anglais, mot pour mot : `VAT included` (jamais `incl. VAT`, `TTC`,
`plus VAT`), `one week` (jamais `48h`, `72h`, `7 days`), `your go-ahead` =
le client dit oui **et rien d'autre**.

---

## Les deux décisions du 31 août 2026

Prises par le propriétaire, écrites **dans le prompt** et pas seulement dans les
documents de marque (`docs/agents/brand/voice-guide.md` §4,
`docs/agents/brand/glossaire-anglais.md` §2, `.agents/product-marketing.md`).
La raison est mécanique : le prompt est le seul texte que le modèle lit. Une
règle qui ne vit que dans `docs/` n'est pas une règle, c'est un souhait.

### 1. L'assistant dit « nous », et la limite est absolue

La consigne précédente imposait « je » et interdisait « nous » au motif que le
studio est une personne. **Elle est renversée** : le studio travaille avec un
partenaire de production, « nous » n'est donc pas un mensonge.

**Il le deviendrait à la première phrase qui annonce un effectif, une équipe,
des bureaux ou une ancienneté.** La garde est donc écrite **nommément** dans les
deux blocs du prompt — « notre équipe », « notre équipe de X », « nos bureaux »,
« nos designers », « depuis 20XX », `our team`, `our offices`, `our designers`,
`since 20XX` — et elle couvre la question qui la déclenche : *« vous êtes
combien ? »* ne se répond par **aucun chiffre**, elle se renvoie à Ayoub
Bensalem. « Je travaille seul » est interdit au même titre que « nous sommes une
petite équipe » : c'est la réponse exacte — mot pour mot — que rendait le prompt
d'avant, mesurée en local avant le changement.

**Deux dérives mesurées ensuite, et refermées de la même façon — par un
contre-exemple.** Le premier jet de la règle interdisait « notre équipe de X » ;
le modèle a répondu *« Nous ne communiquons pas d'informations sur la taille de
notre équipe »*, puis *« Regarding the size of our team and our offices, that is
for Ayoub Bensalem »*. **Une phrase qui refuse de dire la taille de l'équipe
vient d'affirmer qu'il y en a une**, et reprendre les mots de la question remet
les mots interdits dans la bouche de l'assistant. La règle interdit donc le mot
« équipe » **même dans un refus**, interdit de reprendre les termes de la
question, et donne les deux contre-exemples relevés tels quels avec la
réécriture. Mesure d'après : *« C'est à Ayoub Bensalem, qui tient le studio,
d'en parler — le plus simple est de lui écrire sur WhatsApp … »*, puis la
question suivante du déroulé.

Le panneau (`components/ChatWidget.tsx`) suit dans ses deux colonnes — accueil,
accueil ciblé depuis `/devis`, sous-titre, clôture, bouton d'envoi, conversation
complète : six phrases par langue, qui nommaient toutes Ayoub. Un accueil au
« je » suivi de réponses au « nous » se lirait comme deux interlocuteurs. Le
bouton d'envoi s'appelle désormais **« Envoyer ma demande »** /
`Send my enquiry`, c'est-à-dire le CTA exact du guide de voix §7.

L'accueil ciblé a perdu au passage sa **seconde question** — il demandait le
métier *et* l'adresse du site actuel — et avec elle la présomption de site : le
libellé cliqué peut être « Cartes de visite ». Le panneau ne s'autorise pas ce
que le prompt interdit au modèle.

Le nom d'**Ayoub Bensalem** reste public — mentions légales, section « Le
studio », et le prompt le garde pour y renvoyer les questions d'effectif. Ce
sont les libellés du panneau qui passent au pluriel, pas le nom qui disparaît.

### 2. Google sort de l'offre

Le studio ne vend plus « fiche Google complétée » ni le sticker vitrine « avis
Google ». Les deux ont été retirés de l'énumération du métier **et** de la liste
de pistes de l'étape 2, dans les deux langues.

**« Les stickers vitrine » sont partis avec, et ce n'est pas un élargissement du
périmètre** : la seule ligne de sticker du catalogue était `sticker-avis`,
« Sticker vitrine — avis Google », celle que la décision retire. L'énumération
du métier la citait sous sa forme générique ; la garder aurait fait proposer par
le prompt, de lui-même, la prestation qu'on vient de supprimer. Vérifié en base
et sur `/services/imprimes`, qui n'en portent plus aucune.

Le mot reste **permis pour constater un fait** (« vos clients vous cherchent sur
Google ») et **interdit pour désigner une prestation** — la règle l'écrit ainsi,
parce qu'un simple retrait laisserait le modèle libre de reproposer la chose de
lui-même. Côté prix il n'y a rien de plus à faire : `buildPriceList` filtre sur
`visible`, donc la ligne retirée du catalogue en base — `sticker-avis`, passée à
`visible = false` — disparaît d'elle-même de la liste injectée à chaque requête.
Le prompt n'a donc qu'une chose à faire : ne plus la citer de lui-même.

**Un refus n'est pas un renvoi.** Mesuré aussi : l'assistant répondait *« We
don't manage Google listings, that is for Ayoub Bensalem »* — il refusait la
prestation puis la confiait à quelqu'un, donc il la vendait encore. La règle
sépare maintenant les deux mouvements : **le renvoi à Ayoub ne vaut que pour les
questions d'effectif, de bureaux ou d'ancienneté** ; sur Google la réponse est
simplement non, suivie de ce que le studio fait.

**Et l'exemple nomme ce qu'il refuse.** Écrit d'abord « Ce n'est pas ce que fait
le studio », sans sujet, il s'est recopié tel quel en tête d'une réponse à
« vous êtes combien ? » — un contre-sens poli. Un exemple de prompt est une
phrase que le modèle réemploie : s'il ne dit pas de quoi il parle, il se
réemploie n'importe où. Il s'écrit donc **« La fiche Google n'est pas ce que
fait le studio »** / **`A Google listing is not what the studio does`**. Mesures
d'après, sur les deux pièges : *« La fiche Google n'est pas ce que fait le
studio. Souhaitez-vous créer ou rafraîchir votre logotype ? »* et, sur la
question d'effectif, *« C'est à Ayoub Bensalem, qui tient le studio, d'en
parler — … »* sans préambule étranger.

---

## Deux défauts de comportement, et comment ils ont été refermés

Relevés en local, dans les deux langues, sur le cas d'un visiteur qui demande
**deux prestations à la fois** (« il me faut un logo et des cartes de visite »).

### 1. L'assistant posait deux questions dans un seul message

Le prompt disait déjà « UNE seule question par message ». Il **énonçait un fait
sans interdire son contraire** — et le modèle s'en accommodait :

> Pour le logo, avez-vous une idée de style ou de couleurs ? Et pour les cartes
> de visite, quel format et quel tirage envisagez-vous ?

C'est le piège déjà rencontré sur la règle du « feu vert », et il se referme de
la même façon : **interdire l'inverse, nommément**. La règle de
`lib/chat-prompt.ts` — présente à l'identique dans les deux blocs — énumère
désormais les formes de l'enchaînement (« et », point-virgule, parenthèse, deux
phrases qui se suivent), pose un **compteur vérifiable** — un seul point
d'interrogation par message —, donne le contre-exemple relevé tel quel avec sa
réécriture, et dit quoi faire du reste : le garder pour le message suivant.

Les listes de pistes de l'étape 2 (« pas de prise de rendez-vous ? illisible
sur téléphone ? ») portent la même mention, sans quoi le prompt se
contredisait lui-même en affichant quatre `?` d'affilée.

### 2. Le modèle renvoyait du markdown, la bulle affichait les astérisques

`**Le Site — 1'499.–**` s'affichait avec ses astérisques : `.chat-msg` rend du
**texte**, pas du HTML. Aucun des deux prompts ne l'interdisait.

**Ceinture et bretelles, les deux.** Un prompt n'est pas une garantie : le jour
où le modèle change, la faute revient à l'écran sans qu'une ligne du dépôt ne
bouge.

- **Ceinture — `lib/chat-prompt.ts`** : une règle « écris en TEXTE BRUT »,
  dans les deux langues, qui nomme la faute et montre la forme correcte.
- **Bretelles — `components/ChatWidget.tsx`** : `enSegments()` découpe le
  message du modèle en segments et rend du **JSX**. **Jamais
  `dangerouslySetInnerHTML`** — ce texte vient d'un modèle, donc d'un inconnu.

Le rendu est **minimal, délibérément** : le gras (`<strong>`, poids 600, une
fonte réellement chargée) et les retours à la ligne, que `white-space:
pre-wrap` rend déjà — il n'y a donc aucun `<br>` à fabriquer. Tous les autres
marqueurs sont **retirés** : titres `#`, puces (`-`, `*`, `+`, converties en
`•`), séparateurs `---`, marqueurs de code.

Trois précautions qui se lisent mal dans le code sans leur raison :

- **Le souligné `_` n'est pas traité.** Il traîne dans les adresses e-mail et
  les URL ; le prendre pour de l'italique mangerait un caractère au milieu
  d'une adresse.
- **Une astérisque isolée entre deux espaces est gardée** (« 85 * 55 mm ») :
  la retirer laisserait une double espace, soit un second défaut d'affichage
  pour en corriger un premier.
- **Pas de lookbehind `(?<=\S)`**, qui n'existe qu'à partir de Safari 16.4 :
  sur un iPhone plus ancien, la seule écriture du littéral jetterait une
  `SyntaxError` au chargement du module et **le widget entier disparaîtrait**
  pour une astérisque.

**Le texte du visiteur n'est pas touché** : il s'affiche tel qu'il l'a tapé.
Le nettoyage ne vise que ce que le modèle écrit.

Le format suisse des prix traverse tout cela intact : `1'499.–` n'est jamais
reformaté, ni par le prompt ni par l'affichage.
