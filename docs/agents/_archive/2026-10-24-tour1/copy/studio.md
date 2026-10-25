# `/studio` et `/en/studio` — qui fait le travail (24.10.2026)

> Mode `propose`. Fichiers : `app/(site)/studio/page.tsx` (FR, chaînes en dur)
> et `app/(site)/en/studio/page.tsx` (EN, même structure, lignes données entre
> crochets). Guide : `docs/agents/brand/voice-guide.md`.
> **Mot-clé cible** : *studio assistant IA Genève* (title, h1 « Qui fait le
> travail »). Métadonnées : `meta.md`.

## 0. Rôle de la page

Répondre aux cinq questions d'un patron avant d'appeler : qui, comment, pourquoi
ce métier d'abord, ce que nous ne prenons pas, et ce qu'il peut vérifier
lui-même. La structure en cinq sections est gardée.

## 1. En-tête (`:193-232` ; EN `[:190-230]`)

| Élément | AVANT FR | APRÈS FR | APRÈS EN |
|---|---|---|---|
| meta | Le studio | *inchangé* | *inchangé* |
| h1 | Qui fait le travail, / et comment. | *inchangé* (≤ 10 mots, toujours vrai) | *inchangé* |
| lede (`:205-209`) | Nawa Corps est le studio de création digitale d'Ayoub Bensalem, à Genève. Cette page dit comment se passe une refonte… | **Nawa Corps est un studio genevois qui installe des assistants IA dans les PME. Cette page dit qui le fait, comment se passe l'essai, et ce que nous ne prenons pas.** | **Nawa Corps is a Geneva studio that sets up AI assistants in small businesses. This page says who does it, how the trial runs, and what we do not take on.** |
| fait 1 (`:217-218`) | Ayoub Bensalem / Designer et développeur | **Ayoub Bensalem / Vente et suivi** | **Ayoub Bensalem / Sales and follow-up** |
| fait 2 (`:221-222`) | Genève / Et sa région | *inchangé* | *inchangé* |
| fait 3 (`:225-226`) | Une semaine / Refonte livrée | **Un développeur / Spécialisé en IA** | **A developer / Specialised in AI** |
| fait 4 (`:229-230`) | Dès votre feu vert / Départ du délai | **0 client / Vous seriez parmi les premiers** | **0 clients / You would be among the first** |

- POURQUOI : identité réelle de l'équipe telle que PM §1 l'autorise ; le
  développeur n'est pas nommé. Le « 0 client » est la franchise retenue
  (pratfall, PM §8) : c'est un vrai chiffre, pas un compteur.
- PREUVE : PM §1 « Qui le fait » ; §6 ; §9 « Clients de l'assistant : 0 ».

## 2. (01) Qui vous parle (`:241-278` ; EN `[:239-280]`)

- h2 : **« Vous parlez à qui / fait le travail. »** *inchangé*.
- AVANT (4 paragraphes) : Ayoub Bensalem, designer et développeur… · Pas de bureaux… · la production des réseaux sociaux se fait avec un partenaire… · Un an après la mise en ligne…
- APRÈS FR :
  1. **Ayoub Bensalem fonde le studio. Il fait le premier appel, la démo et le suivi de chaque semaine. Vous n'êtes pas passé d'un commercial à un chef de projet.**
  2. **Un développeur spécialisé en IA construit l'assistant : les modèles de langage, la base de chaque métier. Il travaille avec nous sur chaque démo.**
  3. **Pas de bureau, et c'est assumé. Nous venons chez vous, ou nous parlons au téléphone. C'est chez vous que sont les demandes.**
- APRÈS EN :
  1. **Ayoub Bensalem founded the studio. He makes the first call, runs the demo and does the weekly follow-up. You are not passed from a salesperson to a project manager.**
  2. **A developer who specialises in AI builds the assistant: the language models, the base for each trade. He works with us on every demo.**
  3. **No office, and we say so. We come to you, or we talk on the phone. Your enquiries are where you are.**
- POURQUOI : le paragraphe « réseaux sociaux avec un partenaire » décrit une
  prestation sortie (PM §5, §7) ; 101 Agency ne se met pas en avant sur le site.
  « Un an après la mise en ligne » parlait du site.
- PREUVE : PM §1 « Ayoub… la vente et le suivi… un développeur spécialisé en
  IA (assistants, modèles de langage, apprentissage profond) » ;
  `founder/marketing.md` §5 « le temps du dev pour les démos ».
- RÉSERVE : « il travaille avec nous sur chaque démo » dépend du contrat du
  développeur (PM §10 n°5). Repli sans cette phrase : `_sans-preuve.md` S7.
- IMAGE (`:310-312`, alt) : « Papiers de couleur, cartes vierges, spécimen
  typographique… » montre l'ancien métier. **À remplacer** par un geste de
  métier (brand §4 : un devis papier, un téléphone posé sur une caisse à
  outils). Nouvel alt à écrire avec l'image ; aucun alt sans image réelle.

## 3. (02) Le déroulé (`:327-401` ; EN `[:294-370]`)

- h2 AVANT : Du premier message / à la mise en ligne. → APRÈS FR : **« Du premier appel / au relevé du lundi. »** · EN : **"From the first call / to the Monday report."**
- lede AVANT : Six moments, et un seul vous demande quelque chose… → APRÈS FR : **« Quatre moments. Aucun ne vous demande de préparer quoi que ce soit. »** · EN : **"Four moments. None of them asks you to prepare anything."**

| Moment (`h3.sm-grp`) | APRÈS FR | APRÈS EN |
|---|---|---|
| **L'appel** | Dix minutes. Vous nous dites ce qui vous prend vos soirées. Nous ne vous vendons rien ce jour-là. | **The call.** Ten minutes. You tell us what takes up your evenings. We sell you nothing that day. |
| **La démo** | Vous nous montrez trois demandes de votre semaine. Nous vous montrons ce que l'assistant en aurait fait, ce que vous auriez validé, ce que vous auriez corrigé. Aucun accès à vos outils. | **The demo.** You show us three enquiries from your week. We show you what the assistant would have done, what you would have approved, what you would have corrected. No access to your tools. |
| **L'essai** | L'assistant travaille sur vos vraies demandes. Vous validez tout ce qui part. Vous ne payez rien pendant l'essai. | **The trial.** The assistant works on your real enquiries. You approve everything that goes out. You pay nothing during the trial. |
| **Chaque lundi** | Un relevé court : ce qui a été traité, relancé, préparé, et ce qui vous attend. Si le relevé vous convient, vous payez la mise en place et l'abonnement continue. Le prix est fixe, annoncé après la démo. | **Every Monday.** A short report: what was handled, followed up, prepared, and what is waiting for you. If the report suits you, you pay for the set-up and the subscription carries on. The price is fixed, given after the demo. |

- Lien (`:398-400`) AVANT : Voir les formules et les prix → · APRÈS FR : **Voir l'assistant en détail →** · EN : **See the assistant in detail →**
- POURQUOI : les six anciens moments décrivaient la livraison d'un site
  (maquette, allers-retours, mise en ligne, hébergement, suivi à 129.–).
- PREUVE : PM §5 parcours, garantie, prix ; brand §5.2 et §5.3.

## 4. (03) Pourquoi le sanitaire d'abord (`:411-465` ; EN `[:380-433]`)

- meta AVANT : Le métier · APRÈS : **Le premier métier** · EN : **The first trade**
- h2 AVANT : Cinq lignes de travail, / un seul endroit. · APRÈS FR : **« Le sanitaire / et le chauffage d'abord. »** · EN : **"Plumbing and / heating first."**
- AVANT (liste de 5 lignes : sites, identité, imprimés, photographie, réseaux sociaux + paragraphe « ce qui rend l'ensemble cohérent ») — **retirée en entier**.
- APRÈS FR (3 paragraphes, sources citées pour les moteurs) :
  1. **Genève compte 441 entreprises de sanitaire et de chauffage-ventilation (OCSTAT 2024). Le bâtiment est le premier secteur touché par la pénurie de personnel dans le canton (CCIG 2026).**
  2. **Dans ces entreprises, le patron fait souvent lui-même le bureau, le soir. Les demandes arrivent pendant le chantier. Les devis partent, puis attendent.**
  3. **Nous commençons donc par ce métier. L'électricité suit. Les autres métiers viennent ensuite, un à la fois.**
- APRÈS EN :
  1. **Geneva has 441 plumbing and heating-ventilation businesses (OCSTAT 2024). Construction is the sector hit hardest by staff shortages in the canton (CCIG 2026).**
  2. **In these businesses, the owner often does the office work himself, in the evening. Enquiries come in while he is on site. Quotes go out, then wait.**
  3. **So we start with this trade. Electrical work follows. Other trades come after, one at a time.**
- Lien (`:462-464`) AVANT : Voir le catalogue en entier → · APRÈS : **Voir ce que fait l'assistant →** / **See what the assistant does →**
- POURQUOI : `ai-seo` (statistiques sourcées, entités) et similarité (genevois,
  vocabulaire du métier). Les phrases du paragraphe 2 décrivent la douleur de
  la recherche, sans chiffre de patron inventé.
- PREUVE : PM §2 « 441 entreprises… OCSTAT 2024 » ; « secteur n°1 de la
  pénurie… CCIG 2026 » ; « Le premier métier » ; §5 bis, ordre.
- RÉSERVE : PM §2 « aucune voix de patron romand n'a encore été entendue ».
  Le paragraphe 2 ne cite donc personne et reste au général.

## 5. (04) Ce que nous ne prenons pas (`:475-518` ; EN `[:444-485]`)

- h2 : **« Ce que nous / ne prenons pas. »** *inchangé*.
- lede AVANT : Une page qui ne sait rien refuser ne dit rien. Ces quatre-là partent ailleurs… · APRÈS FR : **« Nous le disons au premier appel, pas après la démo. »** · EN : **"We say so on the first call, not after the demo."**
- Liste AVANT : boutiques en ligne · appels d'offres et administrations · sociétés avec développeurs · urgences à la demi-journée.
- Liste APRÈS FR :
  - **Les cabinets médicaux, la physiothérapie et le dentaire. Le secret médical l'exclut, et leurs rendez-vous ont déjà leurs outils.**
  - **Les avocats. Le secret professionnel l'exclut.**
  - **Les grands comptes et les administrations. Appels d'offres et cycles longs.**
  - **Les entreprises qui veulent une IA qui fait tout seule. Chez nous, rien ne part sans vous.**
  - **Les sociétés tech. Elles le font elles-mêmes.**
- Liste APRÈS EN : **Medical practices, physiotherapy and dentists. Medical secrecy rules it out, and their appointments already have their tools.** · **Lawyers. Professional secrecy rules it out.** · **Large accounts and public bodies. Tenders and long cycles.** · **Businesses that want an AI that does everything on its own. With us, nothing goes out without you.** · **Tech companies. They do it themselves.**
- Paragraphe de fin AVANT : Le refus n'est pas une posture… · APRÈS : **supprimé** (deux phrases de justification, rien à prouver).
- PREUVE : PM §2 « Anti-ICP », tableau, mot pour mot.

## 6. (05) La démonstration (`:528-572` ; EN `[:496-540]`)

- h2 AVANT : Le produit tourne / sur cet écran. · APRÈS FR : **« Leo, en bas / de l'écran. »** · EN : **"Leo, at the bottom / of the screen."**
- AVANT (3 paragraphes) : Le troisième palier s'appelle L'Assistant… il répond avec le catalogue et les tarifs…
- APRÈS FR :
  1. **Leo est l'assistant de ce site. C'est une démonstration de ce que nous savons faire, pas un client.**
  2. **Posez-lui une question sur votre bureau. Il répond, puis il vous propose la démo. Quand la conversation se termine, elle arrive sur notre téléphone.**
  3. **Votre assistant, lui, ne se montre que sur vos propres demandes. C'est le rôle de la démo.**
- APRÈS EN :
  1. **Leo is this site's assistant. It is a demonstration of what we can do, not a client.**
  2. **Ask it a question about your office work. It answers, then offers you the demo. When the conversation ends, it reaches our phone.**
  3. **Your own assistant only shows itself on your own enquiries. That is what the demo is for.**
- Boutons AVANT : Demander un devis → · Voir les formules · APRÈS FR : **Voir l'assistant sur mes demandes →** · **Voir l'assistant en détail** · EN : **See it on my enquiries →** · **See the assistant in detail**
- POURQUOI : PM §6 : Leo « comme démonstration, jamais comme référence
  client ». L'ancien texte vendait le « troisième palier » à 2'499.–.
- PREUVE : PM §6, tableau « Ce qui existe » ; `lib/telegram.ts` (le message
  arrive sur le téléphone).

## 7. Données structurées (`:150-172`)

| Champ | AVANT | APRÈS |
|---|---|---|
| `Person.jobTitle` (`:166`) | Designer et développeur | **Fondateur** |
| `AboutPage.name` / `description` | via `TITRE` / `DESCRIPTION` | suivent `meta.md` |
| fil d'Ariane (`:184-185`) | Accueil / Le studio | *inchangé* |

- PREUVE : PM §1 « Ayoub Bensalem (fondateur…) ».
