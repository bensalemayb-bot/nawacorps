# `/contact` et `/en/contact` (24.10.2026)

> Mode `propose`. Fichiers : `app/(site)/contact/page.tsx` (FR) et
> `app/(site)/en/contact/page.tsx` (EN, mêmes rôles ; `TITRE` `:137`, amorce
> WhatsApp `:195`, h1 `:223`). Coordonnées et horaires : `lib/site.ts`, non
> modifiés. Guide : `docs/agents/brand/voice-guide.md`.

## 1. En-tête (`:118-120`, `:222-254`)

| Élément | AVANT FR | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `TITRE` | Contacter le studio à Genève | *inchangé* | *inchangé* (Contacting the studio in Geneva) |
| `DESCRIPTION` | WhatsApp, téléphone, e-mail ou le formulaire : les quatre chemins pour joindre le studio à Genève, et ce qu'il est utile d'écrire dans votre message. | **Téléphone, WhatsApp, e-mail ou formulaire : quatre chemins pour joindre Nawa Corps à Genève et demander une démo de l'assistant sur vos demandes.** | **Phone, WhatsApp, email or the form: four ways to reach Nawa Corps in Geneva and ask for a demo of the assistant on your enquiries.** |
| h1 | Quatre façons / de nous joindre. | *inchangé* | *inchangé* |
| lede (`:233-237`) | WhatsApp, téléphone, e-mail, formulaire : tous arrivent au même endroit, chez nous… | *inchangé* | *inchangé* |
| faits | Téléphone et WhatsApp · Horaires · Et sa région | *inchangés* | *inchangés* |

## 2. (01) Les chemins (`:263-341`)

| Bloc | AVANT FR | APRÈS FR | APRÈS EN |
|---|---|---|---|
| WhatsApp (`:280-284`) | Le plus direct… Une photo de votre carte de visite, l'adresse de votre site, deux lignes sur ce qui ne va pas… | **Le plus direct. Deux lignes sur votre métier et sur ce qui vous prend vos soirées suffisent pour commencer.** | **The most direct. Two lines on your trade and on what takes up your evenings are enough to start.** |
| Téléphone (`:296-298`) | Si c'est plus simple à dire qu'à écrire — et pour un état des lieux, ça l'est presque toujours. | **Si c'est plus simple à dire qu'à écrire. Le premier appel dure dix minutes.** | **If it is easier to say than to write. The first call takes ten minutes.** |
| E-mail (`:312-315`) | Notre boîte, et c'est la seule à écrire : refonte de site, identité, imprimés, photographie, réseaux sociaux, devis. Elle arrive sur notre téléphone comme le reste. | **Notre boîte, et la seule à écrire. Elle arrive sur notre téléphone comme le reste.** | **Our inbox, and the only one to write to. It reaches our phone like everything else.** |
| Formulaire (`:322-325`) | Si vous préférez ne rien ouvrir d'autre… | *inchangé* | *inchangé* |
| Amorce WhatsApp (`:198-200`) | Bonjour, j'aimerais parler d'un projet pour mon entreprise. | **Bonjour, j'aimerais voir l'assistant sur mes demandes.** | **Hello, I'd like to see the assistant on my enquiries.** |
| Boutons (`:336`, `:291`, `:317`) | Écrire sur WhatsApp → · Écrire à … → | *inchangés* | *inchangés* |

- POURQUOI : l'ancienne liste de prestations est sortie (PM §5). Le message
  ne demande plus l'adresse d'un site.
- PREUVE : PM §2 douleur « le bureau qui mange ses soirées » ; « dix minutes » :
  `founder/marketing.md` §3.

## 3. (02) Votre message (`:350-393`)

- h2 AVANT : Cinq lignes, et nous / chiffrons déjà. → APRÈS FR : **« Quatre lignes, et nous / préparons la démo. »** · EN : **"Four lines, and we / prepare the demo."**
- lede AVANT : Vous n'avez rien à préparer pour la suite — mais ces cinq éléments-là… → APRÈS FR : **« Vous n'avez rien à préparer. Ces quatre réponses nous évitent seulement une question de plus. »** · EN : **"You have nothing to prepare. These four answers only save us one more question."**
- Liste AVANT : l'adresse de votre site actuel · votre métier et la zone · ce que vous voulez recevoir · ce qui vous gêne (site illisible…) · votre échéance.
- Liste APRÈS FR :
  1. **Votre métier.**
  2. **Comment arrivent vos demandes : téléphone, WhatsApp, e-mail, régies.**
  3. **Ce qui vous prend vos soirées, même en une phrase.**
  4. **Le meilleur moment pour vous rappeler.**
- Liste APRÈS EN : **Your trade.** · **How your enquiries arrive: phone, WhatsApp, email, property managers.** · **What takes up your evenings, even in one sentence.** · **The best time to call you back.**
- Mention de réponse (`:390`, `MENTION_REPONSE`) : *inchangée*.
- POURQUOI : les questions du signal de qualification (PM §2) remplacent celles
  d'une refonte. Aucune demande de client n'est réclamée par écrit ici : elles
  se montrent pendant la démo.
- PREUVE : PM §2 « Le signal de qualification ».

## 4. Bande de fin (`:403-425`)

| Élément | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| meta (`:406`) | Nawa Corps · Studio de création digitale | **Nawa Corps · Studio genevois** | **Nawa Corps · Geneva studio** |
| liens | Le studio · Mentions légales · Confidentialité | *inchangés* | *inchangés* |

## 5. Donnée structurée (`:172`)

- `ContactPoint.name` AVANT : Demandes de projet → APRÈS : **Demandes de démo** (EN : **Demo requests**).
