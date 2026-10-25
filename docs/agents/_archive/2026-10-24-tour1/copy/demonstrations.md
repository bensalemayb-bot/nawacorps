# `/demonstrations` et `/en/demonstrations` (24.10.2026)

> Mode `propose`. Fichiers : `app/(site)/demonstrations/page.tsx` et
> `app/(site)/en/demonstrations/page.tsx` ; carrousel
> `components/ui/feature-carousel.tsx`. La page n'est plus dans la nav
> (24.10) mais répond toujours, et elle est au sitemap.

## 0. Constat et recommandation

Les cinq pièces montrent une carte de bar, un site, une carte de visite, une
affiche et une carte de fidélité pour des enseignes fictives (`page.tsx:114-139`,
`feature-carousel.tsx:344-376`). PM §6 : **« Travaux de site passés, carte de
restaurant : ❌ hors sujet pour l'assistant ; ne pas s'en servir comme
preuve. »** Ce que PM §6 autorise comme démonstration : **Leo** et **un relevé
du lundi de démonstration, étiqueté sans ambiguïté**.

**Recommandation** : la page garde son URL et montre ces deux démonstrations.
Le carrousel sort de la page (structure, étape 5). Tant que le relevé de
démonstration n'existe pas en image, la section 2 s'affiche en texte.
Alternative : retirer la page et la rediriger vers `/services` (décision d'Ayoub).

## 1. En-tête (`:66-68`, `:102-139` ; EN mêmes rôles)

| Élément | AVANT FR | APRÈS FR | APRÈS EN |
|---|---|---|---|
| `TITRE` | Démonstrations du studio | **Démonstrations : l'assistant et le relevé du lundi** | **Demonstrations: the assistant and the Monday report** |
| `DESCRIPTION` | Cinq pièces dessinées par le studio… L'avant et l'après, côte à côte. | **Deux démonstrations, étiquetées comme telles : Leo, l'assistant de ce site, et un exemple de relevé du lundi. Ce ne sont pas des clients.** | **Two demonstrations, labelled as such: Leo, this site's assistant, and a sample Monday report. Neither is a client.** |
| meta | Démonstrations | *inchangé* | *inchangé* |
| h1 | Cinq pièces, / faites pour montrer. | **Deux démonstrations, / pas des clients.** | **Two demonstrations, / not clients.** |
| lede | Une carte, un site, une carte de visite, une affiche… | **Nous n'avons pas encore de client pour l'assistant. Voici donc ce que nous pouvons vous montrer, et ce que c'est.** | **We have no client for the assistant yet. So here is what we can show you, and what it is.** |
| paragraphes `:123-139` | Ces cinq pièces sont des démonstrations… Le studio est jeune… | **supprimés** | **removed** |

- PREUVE : PM §6 (« 0 client… on le dit » ; démonstrations autorisées).

## 2. (01) Leo (`:157-182`)

- meta AVANT : (01) La sixième · APRÈS : **(01) Leo** / **(01) Leo**
- h2 AVANT : La dernière ne se / regarde pas. · APRÈS FR : **« Il répond / en bas de l'écran. »** · EN : **"It answers / at the bottom of the screen."**
- AVANT : Les cinq pièces ci-dessus se regardent. La sixième… l'assistant du troisième palier tourne sur ce site… le catalogue et les tarifs…
- APRÈS FR : **« Leo est l'assistant de ce site. Il parle avec vous de votre bureau, puis il vous propose la démo. Il ne connaît pas votre métier comme le connaîtrait le vôtre : il montre comment l'assistant converse, pas ce qu'il ferait de vos demandes. »** (45 mots)
- APRÈS EN : **"Leo is this site's assistant. It talks with you about your office work, then offers you the demo. It does not know your trade the way yours would: it shows how the assistant talks, not what it would do with your enquiries."**
- Lien AVANT : Voir les formules et les prix → · APRÈS : **Voir l'assistant en détail →** / **See the assistant in detail →**
- POURQUOI : borne honnêtement ce que la démonstration prouve ; renvoie à la
  démo sur ses propres demandes, la vraie preuve (pilier 2).
- PREUVE : PM §6 « Léo… comme démonstration… jamais comme référence ».

## 3. (02) Un relevé du lundi, exemple (nouvelle section ; remplace « Votre commerce ici », `:191-224`)

- meta : **(02) Le relevé** / **(02) The report**
- h2 FR : **« Un exemple / de relevé du lundi. »** · EN : **"A sample / Monday report."**
- Étiquette, au-dessus du relevé, obligatoire : **« DÉMONSTRATION — entreprise et demandes inventées pour l'exemple. »** / **"DEMONSTRATION — business and enquiries invented for the example."**
- Le relevé (texte, sans nom de client réel, sans chiffre présenté comme résultat) :

  > **Votre semaine — exemple**
  > **Traité.** Les demandes reçues pendant les chantiers ont reçu une réponse que vous avez validée. Adresse, photo et urgence sont notées pour chacune.
  > **Relancé.** Les devis restés sans réponse ont été relancés une fois, avec votre accord.
  > **Préparé.** Deux brouillons de devis attendent votre relecture.
  > **Ce qui vous attend.** Un locataire n'a pas encore donné de créneau pour un bon de régie.

  > **Your week — example**
  > **Handled.** Enquiries received while you were on site got a reply you approved. Address, photo and urgency are noted for each.
  > **Followed up.** Quotes with no answer were followed up once, with your approval.
  > **Prepared.** Two draft quotes are waiting for you to read.
  > **What is waiting for you.** A tenant has not yet given a time slot for an agency work order.

- Texte sous le relevé FR : **« Le vôtre dira ce qui s'est vraiment passé. S'il ne s'est rien passé, il le dira aussi. »** · EN : **"Yours will say what really happened. If nothing happened, it will say that too."**
- Boutons AVANT : Demander un devis → · Voir les formules · APRÈS : **Voir l'assistant sur mes demandes →** · **Voir l'assistant en détail** / **See it on my enquiries →** · **See the assistant in detail**
- POURQUOI : fin d'expérience (pic-fin) et valeur visible, sans aucun compteur ;
  structure du relevé = PM §1 engagement 3. Les seuls chiffres (« deux
  brouillons », « une fois ») sont internes à l'exemple étiqueté.
- PREUVE : PM §6 « Un relevé du lundi de démonstration ✅ Étiqueté
  “démonstration” sans ambiguïté » ; brand §5.4.
- RÉSERVE : à faire valider par Ayoub et par la revue A ; si le moindre doute
  subsiste sur l'étiquette, publier la section sans l'exemple (h2 + phrase de
  fin seulement).

## 4. Carrousel (`components/ui/feature-carousel.tsx:344-376`, libellés `:361` etc., aria `:192`, `:489`, `:525`, `:532`)

- AVANT : La carte · Le site · La carte de visite · L'affiche · La fidélité, et leurs `desc` « Enseigne fictive ».
- APRÈS : **retiré de la page.** Aucune réécriture : les pièces montrent des
  prestations sorties de l'offre (PM §5, §6).
