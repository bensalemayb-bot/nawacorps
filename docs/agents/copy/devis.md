# `/devis` et `/en/devis` — devient la demande de démo (24.10.2026, tour 2)

> Tour 1 archivé : `docs/agents/_archive/2026-10-24-tour1/copy/devis.md`.
> Tour 2 : m12 (description alignée FR / EN).

> Mode `propose`. Fichiers : `app/(site)/devis/page.tsx` (FR),
> `app/(site)/en/devis/page.tsx` (EN, `TITRE` `:94`, h1 `:186`), `lib/devis.ts`.
> L'URL `/devis` ne change pas (règle : jamais une URL). Guide :
> `docs/agents/brand/voice-guide.md`.

## 0. Ce que la page devient

Aujourd'hui : l'arrivée des boutons « Demander un devis », qui nomme une
prestation et son prix lus en base (`?p=`), ouvre l'assistant et rend le
formulaire. **Demain** : la page où un patron demande sa démo. Une seule
demande possible, plus de prestation à résoudre.

**Structure (étape 5)** : ne plus afficher `service.name`, `formatServicePrice`,
`TVA_LABEL`, `MENTION_DEVIS_COURTE`, `MENTION_TVA` (`:172-218`). `?p=` peut
rester lu pour le sujet transmis à l'assistant ; plus aucun prix n'est affiché.

## 1. Métadonnées (`:62-64`)

- AVANT : Demander un devis · « Décrivez votre besoin à l'assistant, ou remplissez le formulaire… Réponse le jour ouvrable suivant. »
- APRÈS FR : **Demander une démo sur vos demandes** · « Montrez-nous trois demandes de votre semaine : nous vous montrons ce que l'assistant en aurait fait. Sans accès à vos outils. Réponse le jour ouvrable suivant. » (≈ 148)
- APRÈS EN : **Ask for a demo on your enquiries** · "Show us three enquiries from your week: we show you what the assistant would have done with them. No access to your tools. A reply the next working day." (≈ 150)
- TOUR 2, m12 : « Gratuit » retiré du FR pour que les deux langues disent la même chose ; la gratuité reste dite dans les faits de la page (« Rien / Ce que coûte la démo »).
- PREUVE : PM §5 étape 1 (« Ce que paie le client : Rien ») ; `MENTION_REPONSE`.

## 2. En-tête (`:134`, `:150-204`)

| Élément | AVANT FR | APRÈS FR | APRÈS EN |
|---|---|---|---|
| fil d'Ariane (`:134`) | Demander un devis | **Demander une démo** | **Ask for a demo** |
| meta (`:150`) | Devis | **La démo** | **The demo** |
| h1 (`:155-157`) | Dites ce qu'il / vous faut. | **Montrez-nous / trois demandes.** | **Show us / three enquiries.** |
| lede, sans sujet (`:164`) | L'assistant s'ouvre en bas de l'écran : décrivez votre besoin en deux ou trois phrases… | **Leo, l'assistant de ce site, s'ouvre en bas de l'écran. Dites-lui votre métier : il pose les questions qui manquent. Si vous préférez écrire d'un coup, le formulaire est juste en dessous.** | **Leo, this site's assistant, opens at the bottom of the screen. Tell it your trade: it asks the questions that are missing. If you would rather write it all at once, the form is just below.** |
| lede, avec sujet (`:163`) | Votre demande porte sur « … ». L'assistant s'ouvre avec cette information… | **Vous venez pour « ${libelle} ». Leo s'ouvre avec cette information et pose les questions qui manquent.** | **You're here for “${libelle}”. Leo opens with that and asks the questions that are missing.** |
| faits (`:174-202`) | [nom de la prestation] / Votre demande · [prix] / TVA comprise · Genève / Et sa région | **Rien / Ce que coûte la démo** · **Aucun / Accès à vos outils** · **Genève / Et sa région** | **Nothing / What the demo costs** · **None / Access to your tools** · **Geneva / And around** |

- POURQUOI : le h1 dit exactement ce qu'on demande (≤ 10 mots, impératif
  concret). Les deux faits lèvent l'objection prix et l'objection données au
  moment de la demande.
- PREUVE : PM §5 parcours, étape 1.

## 3. (01) Ce qui nous aide (`:226-260`)

- meta AVANT : (01) Votre message → APRÈS : *inchangé*.
- h2 AVANT : Quatre lignes, et / nous chiffrons déjà. → APRÈS FR : **« Trois demandes, / rien à préparer. »** · EN : **"Three enquiries, / nothing to prepare."**
- Paragraphe AVANT : Vous n'avez rien à préparer : nous reprenons ce qui est déjà en ligne…
- APRÈS FR : **« Trois demandes que vous avez déjà reçues suffisent : un message, un e-mail, une note d'appel. Vous pouvez masquer les noms. Vous nous les montrez pendant la démo, pas ici. »** (34 mots)
- APRÈS EN : **"Three enquiries you have already received are enough: a message, an email, a call note. You can hide the names. You show them to us during the demo, not here."**
- Liste AVANT : l'adresse de votre site actuel · votre métier et la zone · ce que vous voulez recevoir · votre échéance.
- Liste APRÈS FR : **Votre métier.** · **Comment arrivent vos demandes aujourd'hui.** · **Le meilleur moment pour vous rappeler.**
- Liste APRÈS EN : **Your trade.** · **How your enquiries arrive today.** · **The best time to call you back.**
- POURQUOI : « rien à préparer » reste vrai : on part de ce qu'il a déjà
  (énergie d'activation, `founder/marketing.md` §3). Aucune donnée de client
  ne transite par le formulaire du site.
- PREUVE : PM §5 conditions (« Aucune. On part de ce qu'il reçoit déjà »).
- Mention de réponse (`:275`) : *inchangée*.

## 4. Boutons de fin (`:284-289`)

| AVANT | APRÈS FR | APRÈS EN |
|---|---|---|
| Écrire sur WhatsApp | *inchangé* | *inchangé* |
| Voir tous les services | **Voir l'assistant en détail** | **See the assistant in detail** |

## 5. Amorces WhatsApp (`lib/devis.ts`)

| Fichier:ligne | AVANT | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `lib/devis.ts:74-75` (`AMORCES_GENERALES`) | Bonjour, j'aimerais un devis pour mon entreprise. / Hello, I'd like a quote for my business. | **Bonjour, j'aimerais voir l'assistant sur mes demandes.** | **Hello, I'd like to see the assistant on my enquiries.** |
| `lib/devis.ts:155-189` (`AUTRES` : sur-mesure, formules, carte du studio, studio) | « …un devis pour un site à plusieurs pages », « …la refonte du site… », etc. | **retirées** (sujets de l'ancienne offre) ; `devis-studio` prend l'amorce générale | **removed** |
| `lib/devis.ts:166`, `:171` | Les formules de site / The site packages | **retirés** | **removed** |
