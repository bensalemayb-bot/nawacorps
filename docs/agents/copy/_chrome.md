# Chrome partagé — nav, menu, loader, pied de page, formulaire, bulle de l'assistant (24.10.2026, tour 2)

> Mode `propose`. Rendu sur toutes les pages publiques, FR et EN. Tour 1
> archivé : `docs/agents/_archive/2026-10-24-tour1/copy/_chrome.md`. Tour 2 :
> m5 (pied de page, slogan retiré), m6 (`bulle`), m7 (`clos`).
> Guide : `docs/agents/brand/voice-guide.md`. PM = `.agents/product-marketing.md`.
> Le prompt de l'assistant a son propre fichier : `chatbot.md`.

## 1. Barre de navigation (`components/Nav.tsx`, chaînes `fr.ts:69-98`, `en.ts:61-74`)

| Clé | AVANT FR / EN | APRÈS FR | APRÈS EN | POURQUOI · PREUVE |
|---|---|---|---|---|
| `nav.services` (→ `/#offres`) | L'offre / The offer | *inchangé* | *inchangé* | L'ancre mène désormais au parcours payé (accueil §I). |
| `nav.tousLesServices` | Tous les services / All services | **L'assistant en détail** | **The assistant in detail** | Plus affiché (NavServices supprimé) ; à aligner si réutilisé. |
| `nav.demonstrations` | Démonstrations | *inchangé, non affiché* | *idem* | Retiré de la nav le 24.10. |
| `nav.devis` (pastille → `/devis`) | Mon aperçu / My preview | **Demander ma démo** | **Get my demo** | Il n'y a plus d'aperçu de site. Un seul geste partout (guide §6). PM §5, étape 1. 16 signes, comme l'ancien « Refaire mon site » qui tenait. |
| `nav.accueil`, `logoAlt`, `horlogeVille`, `studio`, `contact`, `ouvrirMenu` | — | *inchangés* | *inchangés* | Conformes. |

## 2. Menu plein écran (`components/MenuOverlay.tsx`, `fr.ts:111-120`, `en.ts:76-83`)

- `menu.services`, `studio`, `contact`, `whatsapp`, `lieu` : **inchangés**. Le
  menu dit ce que dit la nav.

## 3. Écran de chargement (`components/Loader.tsx:47` → `hero.kickerMetier`)

- AVANT : Studio de création digitale / Digital design studio
- APRÈS : **Studio genevois** / **Geneva studio** (accueil §A.1)
- PREUVE : PM §1 « Studio genevois, sans bureau ».

## 4. Formulaire (`components/ContactForm.tsx`, `fr.ts:191-223`, `en.ts:116-131`) — rendu en pied de page, sur `/contact` et `/devis`

| Clé | AVANT FR | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `message` (placeholder) | Votre besoin, et votre site actuel si vous en avez un | **Votre métier, et ce qui vous prend vos soirées** | **Your trade, and what takes up your evenings** |
| `envoyer` | Envoyer ma demande | **Demander ma démo** | **Get my demo** |
| `nom`, `telephone`, `email`, `messageLabel`, `leurre`, `envoiEnCours`, `erreurContact`, `succes`, `erreurEnvoi`, `erreurReseau` | — | *inchangés* | *inchangés* |

- POURQUOI : le formulaire devient la demande de démo (consigne du plan). Le
  placeholder pose la question d'ouverture du guide d'appel au lieu de
  demander un site. « Ma demande » entrait en collision avec le glossaire :
  « une demande » est désormais ce que reçoit le patron (guide §10 n°10).
- PREUVE : PM §2 « le bureau qui mange ses soirées » ; `founder/marketing.md` §5
  accroche 2.
- `succes` reste vrai : le message arrive sur le téléphone du studio
  (`lib/telegram.ts`).

## 5. Pied de page (`components/FooterContact.tsx`, `fr.ts:146-181`, `en.ts:89-114`)

| Clé | AVANT FR | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `titreLigne1` | Montrez-nous ce que vous avez. | **Montrez-nous trois demandes.** | **Show us three enquiries.** |
| `titreLigne2Debut` + `Italique` | Nous vous disons *ce qui manque.* | **Nous vous montrons ** *ce que l'assistant en fait.* *(tour 2, m5 : « il » sans antécédent)* | **We'll show you ** *what the assistant does with them.* |
| `ouParEcrit` | ou dites-nous en deux lignes ce qu'il vous faut | **ou dites-nous en deux lignes ce qui vous prend vos soirées** | **or tell us in two lines what takes up your evenings** |
| `metier` | Studio de création digitale — Genève | **Studio genevois · Assistants pour PME** | **Geneva studio · Assistants for small businesses** |
| `resume` | Sites pour artisans du bâtiment | **Vous validez. Il s'occupe du reste.** | **You approve. It handles the rest.** |
| `slogan` | L'essentiel. Bien conçu. / The essentials. Well made. | **retiré** (arbitrage après revue A ; m5 : deux slogans dans la même bande, dont un de l'ancien métier). `resume` porte désormais le seul slogan. Élément `.br-slogan` à retirer à l'étape 5 | **removed** |
| `section`, `ecrireWhatsapp`, `lieu`, `horaires`, `copyright`, `mentionsLegales`, `confidentialite` | — | *inchangés* | *inchangés* |

- POURQUOI : le titre garde sa forme en deux temps et son italique ; il devient
  l'appel à la démo, sur trois demandes réelles. Le résumé de bande porte le
  slogan au lieu de l'ancien catalogue.
- PREUVE : PM §5 étape 1 ; brand §2 slogans.
- Ligne de réactivité au-dessus du formulaire (`MENTION_REPONSE`,
  `lib/familles.ts:355` / `MENTION_REPONSE_EN` :367) : **inchangée**, formule
  unique.

## 6. Bulle et panneau de l'assistant du site (`components/ChatWidget.tsx:248-318`)

Leo est **la démonstration** de ce que le studio sait faire, jamais une
référence client (PM §6). Il le dit dans son titre.

| Clé | AVANT FR | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `accueil` (:249-250 / :295-296) | Bonjour, je suis Leo, l'assistant de Nawa Corps. Nous faisons le logotype, les imprimés, les photos, les réseaux sociaux, les supports de restaurant et les sites. Qu'est-ce que vous cherchez à faire faire ? | **Bonjour, je suis Leo, l'assistant de ce site. Nawa Corps installe dans les PME genevoises un assistant qui connaît déjà leur métier. Quel est votre métier ?** | **Hello, I'm Leo, this site's assistant. Nawa Corps sets up, in Geneva small businesses, an assistant that already knows their trade. What is your trade?** |
| `accueilCible` (:273-274 / :298-299) | …Votre demande porte sur « ${libelle} » — c'est noté. Pour commencer : quel est votre métier ? | **Bonjour, je suis Leo, l'assistant de ce site. Vous venez pour « ${libelle} », c'est noté. Pour commencer : quel est votre métier ?** | **Hello, I'm Leo, this site's assistant. You're here for “${libelle}”, noted. To start: what is your trade?** |
| `bulle` (:275 / :300) | Décrivez votre besoin — réponse le jour ouvrable suivant | **Ce qui vous prend vos soirées ? Réponse le jour ouvrable suivant.** *(tour 2, m6)* | **What takes up your evenings? A reply the next working day.** |
| `titre` (:276 / :301) | Leo — assistant Nawa Corps | **Leo, assistant de démonstration** | **Leo, demonstration assistant** |
| `sousTitre` (:277 / :302) | Réponse le jour ouvrable suivant | *inchangé* | *inchangé* |
| `clos` (:283 / :308) | C'est noté — nous revenons vers vous le jour ouvrable suivant. | **C'est noté. Réponse le jour ouvrable suivant, pour fixer la démo.** *(tour 2, m7 : aucun rappel téléphonique promis)* | **Noted. A reply the next working day, to set up the demo.** |
| `terminer` (:284 / :309) | Envoyer ma demande / Send my enquiry | **Demander ma démo** | **Get my demo** |
| `fermer`, `note`, `ecrit`, `indispo`, `allerFormulaire`, `complete*`, `formulaire`, `placeholder*`, `labelSaisie`, `envoyer` | — | *inchangés* | *inchangés* |

- POURQUOI : l'accueil énumérait six prestations qui ne se vendent plus (PM §5).
  Il dit maintenant ce que fait le studio en une phrase, puis pose une seule
  question. Le titre « assistant de démonstration » applique PM §6 (« comme
  démonstration, jamais comme référence ») et la parade LCD art. 3 déjà
  documentée dans `lib/chat-prompt.ts` (un prénom fait croire à quelqu'un).
- PREUVE : PM §1, §6.
- NOTE : `bulle` doit rester sur une ligne ; à mesurer à l'étape 5. Repli :
  « Réponse le jour ouvrable suivant. »

## 7. Sélecteur de langue (`fr.ts:136-143`)

- `langue.section` : **inchangé**.
