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
| `components/ChatWidget.tsx` | La bulle, le panneau, l'envoi, la clôture. |
| `app/chat.css` | Le style du panneau et de la bulle. |
| `lib/chat-prompt.ts` | Le prompt de **conversation**, catalogue et prix injectés depuis Postgres. |
| `lib/extract-prompt.ts` | Le prompt d'**extraction**, qui transforme la conversation en objet JSON. |
| `lib/llm.ts` | Le seul fichier qui sait qu'il existe deux fournisseurs. |
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
l'entrée **plus les `max_tokens` réservés**, soit environ 1300 par appel ici.
Six tirs d'affilée la saturent ; espacés de 13 s, ils passent tous. En
production cela vaut ~6 requêtes par minute *tous visiteurs confondus*. Au-delà :
429, donc `{ unavailable }` et repli formulaire — jamais d'erreur nue. **Le
budget revient tout seul à la minute suivante.**

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

## Le périmètre du prompt

Le studio ne vend pas que des sites : son métier, c'est **l'image de
l'entreprise en général** — identité, logotype, imprimés, photos, fiche Google,
réseaux sociaux, supports de restaurant. Le prompt le dit, et son étape 1
interdit explicitement de prononcer le mot « site » en premier : la question
d'ouverture est ouverte, et la liste d'exemples ne sort que si la personne
hésite.

Trois règles du prompt ont été durement gagnées et ne se réécrivent pas à la
légère (`lib/chat-prompt.ts`) :

- **Les prix** sont recopiés au caractère près depuis le catalogue Postgres,
  apostrophe et suffixe `.–` compris, toujours accompagnés de « TVA
  comprise » — jamais « TTC », « HT », « CHF », « francs » ni « euros ».
- **Le délai** s'écrit « une semaine », il ne concerne **que le site**, et il
  démarre au feu vert du client. Aucun délai en heures : « 72 h » et « 48 h »
  ont circulé, aucun n'est tenu.
- **Le « feu vert »**, c'est le client qui dit oui, et rien d'autre. Jamais la
  fourniture de textes ou de photos : le client n'a **rien** à préparer, et
  c'est l'argument de vente. Et l'assistant écrit « je », jamais « nous » — le
  studio est une personne.
