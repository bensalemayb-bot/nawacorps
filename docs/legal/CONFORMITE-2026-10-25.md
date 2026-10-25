# Mise en conformité juridique — 25 octobre 2026

Cas validé par l'exploitant : raison individuelle (Ayoub Bensalem, « Nawa Corps »), Genève, non inscrite au RC, non assujettie à la TVA, B2B uniquement, contrat conclu hors du site. Cadre : nLPD (RS 235.1) et OPDo, LCD art. 3 al. 1 let. s, CO, LTC art. 45c ; rédaction compatible RGPD.

Vérifications : `npm run typecheck` OK · `npm run lint` OK (1 avertissement préexistant, `<img>` de NoyauStage) · `npm run build` OK (25 routes, dont /cgv, /en/cgv, /llms.txt) · contrôle navigateur sur le serveur de dev (lecture seule, aucun envoi de formulaire ni de message).

## Fichiers

Créés

- `app/(site)/cgv/page.tsx` — CGV B2B FR + EN (corps et métadonnées partagés), prix de la mise en place lu en base.
- `app/(site)/en/cgv/page.tsx` — jumelle anglaise, importe le corps FR.
- `app/llms.txt/route.ts` — résumé du site pour agents d'IA, URL absolues depuis `lib/site.ts`, prix lu en base.
- `components/LiensLegaux.tsx` — bande Mentions légales · Confidentialité · CGV pour les pages sans pied complet.
- `lib/conservation.ts` — durées de conservation (12 mois / 12 mois / 30 jours), source unique pour les pages et la purge.
- `scripts/purger-donnees.ts` — purge par `deleteMany` sur `createdAt`, option `--a-blanc` (non exécuté).
- `docs/legal/CONFORMITE-2026-10-25.md` — ce rapport.

Modifiés

- `app/(site)/mentions-legales/page.tsx` — réécrite : exploitant, adresse, statut RC/TVA, hébergeurs, PI, responsabilité, droit et for.
- `app/(site)/en/mentions-legales/page.tsx` — miroir anglais.
- `app/(site)/confidentialite/page.tsx` — réécrite à partir du code, traitement par traitement.
- `app/(site)/en/confidentialite/page.tsx` — miroir anglais.
- `app/(site)/layout.tsx` — `<main id="contenu">` autour des pages + `LiensLegaux` après `<main>`.
- `app/not-found.tsx` — `<main>` et liens légaux (cette 404 ne traverse pas le layout public).
- `app/binacore.css` — styles `.liens-legaux`, masquée quand `main` contient `footer.contact`.
- `app/sitemap.ts` — ajout de `/cgv` (FR + EN avec hreflang).
- `app/robots.ts` — commentaire : robots d'IA non bloqués, renvoi vers /llms.txt (aucune règle modifiée).
- `app/(site)/services/page.tsx` — JSON-LD : `valueAddedTaxIncluded` retiré ; commentaire TVA.
- `app/(site)/contact/page.tsx`, `app/(site)/en/contact/page.tsx` — commentaires alignés sur l'adresse unique.
- `app/(site)/en/page.tsx` — commentaire TVA.
- `components/ContactForm.tsx` — `<label for>` (sr-only) sur chaque champ, `aria-required`, ids uniques (`useId`), mention finalité + lien confidentialité.
- `components/ChatWidget.tsx` — mention : enregistrement même en quittant la page, IA aux États-Unis, extraction ; `<label for>` sur la saisie ; docblock corrigé.
- `components/FooterContact.tsx` — lien CGV dans la bande légale.
- `components/Faq.tsx` — commentaire TVA.
- `lib/format.ts` — mention TVA : « pas de TVA (entreprise non assujettie) » / « no VAT (business not VAT-registered) ».
- `lib/site.ts` — adresse e-mail unique (`contact@nawacorps.ch`), `emailGeneral` supprimé, nouvel objet `EXPLOITANT`.
- `lib/i18n.ts` — `/cgv` ajouté à `CHEMINS_TRADUITS`.
- `lib/catalogue.ts` — commentaires TVA.
- `lib/dictionnaires/fr.ts`, `lib/dictionnaires/en.ts` — clés `pied.cgv`, `pied.liensLegaux`, libellés et mention du formulaire ; gabarit `abonnementPayeNote` réordonné.
- `prisma/seed.ts`, `scripts/ajouter-mise-en-place.ts` — commentaires TVA (aucune donnée modifiée).
- `CLAUDE.md` — règle « Interdits » : mention « pas de TVA (entreprise non assujettie) ».
- `.agents/product-marketing.md` — quatre occurrences de « TVA comprise » corrigées, décision ouverte n° 8 tranchée.

## Résumé par point

1. **Mentions légales** — identité complète (titulaire, nom commercial, adresse `[À COMPLÉTER]`, e-mail, téléphone), statut (non inscrite au RC, non assujettie à la TVA), hébergeur Vercel Inc. (adresse US, Francfort) et Neon (Francfort, à vérifier), PI, responsabilité (Leo n'engage pas), renvois confidentialité/CGV, droit suisse et for à Genève. Gabarit inchangé (`.studio-txt`, `.meta`). L'identité vit dans `EXPLOITANT` (`lib/site.ts`), hors JSON-LD.
2. **Confidentialité** — six traitements décrits d'après le code : formulaire ; Leo (envoi au LLM à chaque message, enregistrement au clic et à la fermeture de page via sendBeacon, extraction automatique nom/tél./e-mail/métier/besoin/urgence/score, aucune décision sans humain) ; Telegram ; journal anti-abus (SHA-256 salé) ; journaux Vercel ; cookies/stockage (aucun cookie visiteur, `bnc-intro`, `admin_session`). Bases nLPD + RGPD art. 6 § 1 b/f, destinataires nommés, pays et garanties (OPDo annexe 1 pour l'Allemagne ; DPF ou CCT pour les USA, marqués `[À VÉRIFIER]`), durées, droits (accès, rectification, effacement, opposition, remise/transmission), PFPDT et CNIL. La purge est implémentée (`scripts/purger-donnees.ts`) et la page dit qu'elle est lancée au moins une fois par mois. Elle épargne les demandes au statut WON et leurs conversations : leurs données relèvent alors du contrat.
3. **Formulaires** — `ContactForm` est le seul formulaire public (pied de page, /contact, /devis, FR et EN). Il porte désormais la mention « * Nom obligatoire, ainsi qu'un téléphone ou un e-mail. Ces données servent uniquement à vous répondre et à organiser la démo. Confidentialité. », avec un astérisque dans le placeholder du nom. Pas de case de consentement. Le chat annonce l'enregistrement même si l'on quitte la page, la transmission à un fournisseur d'IA aux États-Unis et l'extraction.
4. **CGV** — /cgv et /en/cgv, 14 articles. Prix de la mise en place lu en base, avec la mention de TVA ; l'abonnement se règle selon l'offre écrite. Paiement à 30 jours, intérêts de 5 % (CO 104), essai puis paiement si le relevé convient. Résiliation mensuelle avec préavis `[À COMPLÉTER : 30 jours proposé]`. Sont aussi couverts : contrôle humain, responsabilité limitée dans les bornes de CO 100, sous-traitance nLPD art. 9 avec hébergement suisse, PI, confidentialité et modification des CGV, droit suisse sans CVIM, for à Genève. Les CGV sont remises avec l'offre écrite, sans case à cocher. La version FR fait foi. Comme la base de dev n'a pas de ligne `assistant-mise-en-place`, la phrase sans montant s'affiche (comportement prévu).
5. **TVA** — la mention unique change dans `lib/format.ts`. Elle se propage d'elle-même au hero, à Offres, à la FAQ (et à son JSON-LD), à /services et au prompt de Leo. L'image OG n'affiche aucun montant, rien n'y change. Dans le JSON-LD Offer, `valueAddedTaxIncluded: true` est supprimé : `false` voudrait dire « TVA en sus ». CLAUDE.md et product-marketing.md sont à jour.
6. **Pied de page / contact** — les trois liens légaux s'affichent sur toutes les pages publiques. Les pages avec pied complet les ont dans la bande `.legal` ; les autres (/contact, /devis, pages légales, CGV, 404 de groupe et 404 racine) les reçoivent de `LiensLegaux`. Une seule adresse e-mail reste : **contact@nawacorps.ch**, parce qu'elle était déjà celle des pages légales.
7. **Agents IA** — `/llms.txt` est servi en route dynamique (URL absolues, prix lu en base). `<main>` est présent partout (un seul par page). robots.ts ne bloque aucun robot d'IA, et /cgv entre au sitemap.
8. **Contenu** — « gratuit » n'apparaît nulle part. « Ne coûte rien » / « Sans rien payer » / « Free of charge » qualifient la démo et l'essai, ce qui est exact et concorde avec les CGV art. 2 et 4. « Hébergées en Suisse » est laissé tel quel ; liste plus bas.
9. **Accessibilité** — chaque champ a son label associé (formulaire et chat), le focus visible était déjà global (`:focus-visible`, binacore.css), il y a un seul `h1` par page (vérifié sur toutes les pages publiques) et les images ont un `alt` (logos décoratifs `alt=""`, wordmark nommé).

### Occurrences de « hébergé(es) en Suisse » (laissées, promesse commerciale d'Ayoub)

- `lib/dictionnaires/fr.ts` / `en.ts` : `hero.specDonneesValeur`, `studio.paragraphe1`, `studio.faitDonnees`, `faq.reponseDonnees`.
- `app/(site)/services/page.tsx` l. 163 et 266.
- `lib/chat-prompt.ts` l. 167 et 273 (Leo peut le dire de l'assistant livré, jamais de lui-même).
- **Nouveau** : CGV art. 10 (« Les données de l'assistant du client sont hébergées en Suisse ») et `/llms.txt`.

### Images de `public/` non référencées (rien supprimé)

- `brand/` : `atelier.webp`, `atelier-900.webp`, `favicon-512.png`, `favicon-64.png`, `nawa-corps-icone-simple-transparent.png`, `nawa-corps-logo-avec-slogan-transparent.png`, `nawa-corps-logo-fond-fonce-transparent.png`, `nawa-corps-logo-horizontal-transparent.png`.
- `demos/` : les 20 fichiers (affiche, carte, fidélité, site, visite — avant/après, 480 et plein format).
- `video/` : `site-web.mp4`, `site-web.webm`, `site-web-poster.jpg`.
- `vignettes/` : les 10 fichiers.

## À FAIRE PAR UN HUMAIN

1. **Adresse postale** : remplacer le marqueur dans `EXPLOITANT.adresse` / `adresseEn` (`lib/site.ts`). Obligatoire (LCD art. 3 al. 1 let. s). Tant que ce n'est pas fait, `[À COMPLÉTER]` s'affiche sur trois pages publiques.
2. **Région Neon** : confirmer Francfort (`eu-central-1`) dans la console Neon, puis retirer les `[À VÉRIFIER]` des mentions et de la confidentialité. La doc de déploiement et la mémoire du projet disent Francfort, mais le code ne permet pas de le confirmer.
3. **Certifications DPF** (Swiss-U.S. Data Privacy Framework, dataprivacyframework.gov) de Vercel, Neon, Google LLC et Groq : vérifier chacune ; à défaut, signer les CCT/DPA. Pour Telegram, établir l'entité contractante, le pays et les garanties possibles. Telegram n'est probablement pas certifié : il faudra peut-être réduire le contenu des notifications (sans coordonnées) ou changer de canal.
4. **Gemini** : passer à l'offre payante de l'API (dont les conditions excluent l'usage des contenus pour l'entraînement) ou à un fournisseur suisse/UE. Ensuite, corriger la phrase « offre gratuite » de /confidentialite.
5. **Vercel** : vérifier l'adresse (440 N Barranca Ave #4133, Covina, CA 91723) et la durée de conservation des journaux.
6. **E-mail** : contact@nawacorps.ch est désormais la seule adresse (pied de page, menu, /contact, JSON-LD, pages légales). Vérifier qu'elle est relevée, et décider du sort d'ayoub@nawacorps.ch : redirection vers contact@, ou retour en arrière dans `lib/site.ts` (une ligne).
7. **Purge** : lancer `npx tsx scripts/purger-donnees.ts --a-blanc`, puis sans option, et la planifier au moins une fois par mois (tâche planifiée ou cron Vercel). Purger aussi à la main les notifications Telegram de plus de 12 mois. Attention : `.env.local` pointe sur la production.
8. **Hébergement suisse réel de l'assistant client** : promesse écrite dans les CGV art. 10 et sur le site. Elle doit être vraie avant le premier contrat, avec hébergeur et modèle suisses (décision ouverte n° 3 de product-marketing.md).
9. **Préavis de résiliation** : trancher les 30 jours proposés (CGV art. 6) et retirer `[À COMPLÉTER]`.
10. **Ligne `assistant-mise-en-place`** absente de la base lue en dev : sans elle, aucun montant ne s'affiche (ni sur le site ni dans les CGV).
11. **Numéro IDE** : vérifier si la raison individuelle en a reçu un (affiliation AVS d'indépendant). Si oui, l'ajouter aux mentions légales.
12. **Accord de sous-traitance (DPA)** à rédiger pour les clients (nLPD art. 9, RGPD art. 28 si client UE), ainsi que la cession de droits du développeur (décision ouverte n° 5), avant le premier client.
13. **Relecture par un avocat** des trois pages, en particulier la limitation de responsabilité (CO 100), les clauses de sous-traitance et les transferts aux États-Unis.
14. **Représentant UE (RGPD art. 27)** : probablement non requis (traitement occasionnel, art. 27 § 2 let. a), mais à faire confirmer par l'avocat.

## Points non applicables

- **LTC art. 45c** (sous-adressage / annonce de transmission de données par un service de télécommunication, cookies) : aucun cookie ni traceur n'est posé chez les visiteurs. Le seul cookie, `admin_session`, est strictement nécessaire et ne concerne que l'administrateur. Il n'y a donc ni bannière ni consentement à demander ; l'information figure dans /confidentialite (point 6).
- **Case de consentement** : aucun traitement ne repose sur le consentement (mesures précontractuelles et intérêt légitime). Une case suggérerait le contraire.
- **Droit de rétractation / règles consommateurs** (LCD art. 8, CPC art. 32, directive UE 2011/83) : vente B2B uniquement, contrat conclu hors ligne. Les CGV excluent les consommateurs (art. 1).
- **Conseiller à la protection des données, registre des activités** : facultatif (nLPD art. 10) ; registre non obligatoire sous 250 collaborateurs sans risque élevé (OPDo art. 24).
- **Analyse d'impact (nLPD art. 22)** : aucun traitement à risque élevé identifié. Le score de Leo ne produit aucune décision individuelle automatisée (nLPD art. 21, RGPD art. 22), car un humain décide.
- **Image OG** : aucun montant affiché, donc aucune mention TVA à porter.
- **next/font** : les polices sont auto-hébergées au build, et aucune requête ne part vers Google Fonts à l'exécution.
