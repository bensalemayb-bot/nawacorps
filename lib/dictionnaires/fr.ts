/**
 * DICTIONNAIRE FRANÇAIS — et, par la même occasion, LA FORME que l'anglais est
 * obligé de remplir.
 *
 * `export type Dictionnaire = typeof fr` en fin de fichier : ce fichier n'est
 * pas seulement la traduction française, c'est le CONTRAT. `en.ts` se déclare
 * `const en: Dictionnaire`, si bien qu'une clé oubliée ou une clé en trop
 * casse `npm run typecheck`. C'est le garde-fou central du chantier : une
 * traduction manquante doit tomber à la compilation, jamais en production.
 *
 * PAS DE `as const`, ET C'EST DÉLIBÉRÉ. Avec `as const`, chaque propriété
 * prendrait pour type sa propre chaîne française (`"Le studio"`), et `en.ts`
 * ne pourrait littéralement rien écrire d'autre. Sans lui, TypeScript élargit
 * chaque propriété à `string` : les clés restent contraintes, les valeurs sont
 * libres. C'est exactement ce qu'on veut, et c'est fragile — n'ajoutez ni
 * `as const` ni `satisfies` ici.
 *
 * RIEN QUE DES CHAÎNES, jamais de fonction ni d'objet non sérialisable.
 * `components/ContactForm.tsx` est un composant CLIENT : ce qu'il reçoit
 * traverse la frontière serveur/client, et une fonction ne la traverse pas.
 * Une interpolation (« Genève — 14:32 ») se compose donc chez l'appelant, à
 * partir de morceaux qui sont ici.
 *
 * PÉRIMÈTRE DE CE FICHIER : LE CHROME PARTAGÉ, PUIS L'ACCUEIL. Les chaînes de
 * `components/Nav.tsx`, `components/NavServices.tsx`,
 * `components/MenuOverlay.tsx`, `components/FooterContact.tsx` et
 * `components/ContactForm.tsx` — c'est le chrome, il était là le premier. Puis
 * les neuf sections de la page d'accueil, une clé de premier niveau par
 * composant : `hero`, `strip`, `travaux`, `services`, `methode`, `studio`,
 * `offres`, `carte`, `faq`. Le reste du site — les cinq familles, les seize
 * pages — viendra ensuite, section par section, et ces composants-là ne sont
 * PAS encore branchés dessus : ils portent toujours leurs chaînes en dur. Ce
 * fichier les reprend au mot près pour que le branchement ne change pas un
 * caractère à l'écran.
 *
 * LES ESPACES DE FIN ET DE DÉBUT SONT SIGNIFIANTS, et ils sont nombreux dans
 * les sections de l'accueil. Deux raisons, et les deux se voient au rendu :
 *
 *  1. Une chaîne coupée autour d'un `<span className="serif-i">` doit porter
 *     l'espace, parce qu'il n'y en a pas dans le JSX autour de la balise —
 *     c'est déjà la règle de `pied.titreLigne2Debut`.
 *  2. Un libellé de bouton suivi de la flèche `<span className="ar">→</span>`
 *     est rendu par une SEULE expression, espace compris. En le laissant dans
 *     le JSX (`{t.x.cta} <span…>`), React verrait trois enfants au lieu de
 *     deux et intercalerait un `<!-- -->` : le HTML du site français
 *     changerait sans qu'aucun texte ne bouge.
 *
 * MÊME PRÉCAUTION POUR LES CHAÎNES COUPÉES AUTOUR D'UN NOMBRE ou d'un montant
 * lu en base (`carte.devisCompte*`, `offres.noteSuivi*`, `faq.reponse3*`) :
 * elles portent l'espace, et les morceaux se recollent chez l'appelant.
 *
 * CE QUI N'EST VOLONTAIREMENT PAS ICI, et où le chercher :
 *  - le nom du studio, l'e-mail, le téléphone, l'adresse WhatsApp, les
 *    horaires machine : ce sont des DONNÉES, pas des textes. Elles vivent dans
 *    `lib/site.ts`, qui est leur source unique, et elles ne se traduisent pas.
 *  - « Réponse le jour ouvrable suivant. » : c'est `MENTION_REPONSE`, dans
 *    `lib/familles.ts`. Le pied de page l'affiche mais ne la possède pas — la
 *    formulation est unique au caractère près dans tout le site, et la traduire
 *    relève du chantier éditorial, pas du chrome.
 *  - les libellés des cinq familles du catalogue : dérivés de
 *    `lib/familles.ts` par `lib/catalogue-familles.ts`. Même raison.
 *  - les messages d'erreur renvoyés par `app/api/contact/route.ts`
 *    (« Données invalides. », « Trop de demandes, réessayez plus tard. ») :
 *    ils viennent du SERVEUR et s'affichent tels quels. Les traduire suppose
 *    que la route connaisse la langue de l'appelant — un chantier à part.
 */
const fr = {
  /** components/Nav.tsx et components/NavServices.tsx — la barre du haut. */
  nav: {
    /** aria-label du logotype, qui est le lien vers l'accueil. */
    accueil: "Nawa Corps — accueil",
    /**
     * Texte alternatif du wordmark. L'icône ronde qui le précède porte
     * `alt=""` : elle ne dit rien de plus, et un lecteur d'écran annoncerait
     * deux fois la même marque.
     */
    logoAlt: "Nawa Corps",
    /**
     * Première moitié de l'horloge. Nav compose `${horlogeVille} — ${heure}`,
     * l'heure venant d'un `Intl.DateTimeFormat` sur `Europe/Zurich`. Le nom de
     * la ville se traduit (« Geneva »), pas le format.
     */
    horlogeVille: "Genève",
    demonstrations: "Démonstrations",
    /** Le bouton qui ouvre le déroulant, dans components/NavServices.tsx. */
    services: "Services",
    /** Première entrée du déroulant : la page générale, avant les familles. */
    tousLesServices: "Tous les services",
    studio: "Le studio",
    contact: "Contact",
    /**
     * La pastille pleine, à droite — elle mène à /devis.
     * « mon site » EST CELUI DU VISITEUR : voir `formulaire.envoyer`.
     */
    devis: "Refaire mon site",
    /** aria-label du bouton burger. */
    ouvrirMenu: "Ouvrir le menu",
  },

  /**
   * components/MenuOverlay.tsx — le menu plein écran.
   *
   * Les quatre entrées répètent celles de la nav ET GARDENT LEURS PROPRES
   * CLÉS : les deux listes doivent dire la même chose aujourd'hui, mais le
   * menu a la place d'être plus explicite et pourra diverger. Les faire
   * pointer sur les mêmes clés interdirait cette divergence pour de bon.
   *
   * La numérotation « (01) » à « (04) » n'est PAS ici : ce sont des chiffres,
   * ils ne se traduisent pas.
   */
  menu: {
    demonstrations: "Démonstrations",
    services: "Services",
    studio: "Le studio",
    contact: "Contact",
    /** Bas du menu — le libellé du lien WhatsApp. L'URL vient de lib/site.ts. */
    whatsapp: "WhatsApp",
    /** Bas du menu — la localité, en toutes lettres. */
    lieu: "Genève, Suisse",
  },

  /**
   * components/SelecteurLangue.tsx — le sélecteur de langue, rendu par la
   * barre de nav et par le menu plein écran.
   *
   * IL N Y A QU UNE SEULE CLÉ, et c'est voulu. Les deux libellés affichés
   * (« FR », « EN ») et les deux noms complets (« Français », « English »)
   * NE SONT PAS ICI : dans un sélecteur de langue, chaque langue s'écrit dans
   * sa propre langue — « Français » reste « Français » sur la page anglaise,
   * sinon le visiteur qui ne lit pas la langue courante ne reconnaît plus la
   * sienne. Ce sont donc des constantes, pas des traductions, et elles vivent
   * dans le composant. Ne les rapatriez pas ici : `fr.ts` et `en.ts` y
   * porteraient deux fois la même valeur en laissant croire qu'il reste une
   * traduction à faire.
   */
  langue: {
    /**
     * Le nom du GROUPE des deux liens, pour les lecteurs d'écran. Il n'est
     * rendu que dans le menu plein écran, seul contexte où le couple a une
     * enveloppe à nommer (voir le composant).
     */
    section: "Langue",
  },

  /** components/FooterContact.tsx — le pied de page, section « Contact ». */
  pied: {
    /** L'étiquette de section, à côté de son numéro « (07) ». */
    section: "Contact",
    /**
     * Le titre, EN TROIS MORCEAUX parce que le markup en fait trois.
     * `Interactions.tsx` scinde ce `<h2>` sur son `<br>` pour révéler les deux
     * lignes l'une après l'autre, et la fin de la seconde est en italique
     * (`.serif-i`). Une seule chaîne interdirait les deux.
     *
     * ATTENTION À L'ESPACE FINAL de `titreLigne2Debut` : il sépare le texte
     * romain de l'italique, et il n'y a pas d'espace dans le JSX autour du
     * `<span>`.
     */
    titreLigne1: "Montrez-nous ce que vous avez.",
    titreLigne2Debut: "Nous vous disons ",
    titreLigne2Italique: "ce qui manque.",
    /** Le bouton plein. Le « → » qui suit est décoratif, il n'est pas ici. */
    ecrireWhatsapp: "Écrire sur WhatsApp",
    /** L'amorce du formulaire, juste au-dessus de lui. */
    ouParEcrit: "ou dites-nous en deux lignes ce qu'il vous faut",
    /** La bande de quatre colonnes sous le formulaire. */
    lieu: "Genève, Suisse",
    horaires: "Lu–Sa · 9h–19h",
    /**
     * Le millésime est DANS la chaîne, comme dans le JSX d'aujourd'hui. Il
     * faudra le sortir le jour où il se calcule — ce n'est pas ce chantier-ci.
     */
    copyright: "© 2026 Nawa Corps",
    /** Le slogan de marque, à un seul endroit du site. */
    slogan: "L'essentiel. Bien conçu.",
    /** La bande légale, tout en bas. */
    metier: "Studio de création digitale — Genève",
    resume: "Sites · Identité · Imprimés · Réseaux sociaux",
    mentionsLegales: "Mentions légales",
    confidentialite: "Confidentialité",
  },

  /**
   * components/ContactForm.tsx — le formulaire, rendu à trois endroits (le
   * pied de page, /contact, /devis).
   *
   * Chaque champ a un `placeholder` ET un `aria-label`, et les deux portent
   * aujourd'hui la même chaîne — sauf le message, dont l'`aria-label` est plus
   * court que le placeholder. Les clés suivent ce découpage-là.
   */
  formulaire: {
    nom: "Votre nom",
    telephone: "Votre téléphone",
    email: "Votre e-mail",
    /** Le placeholder du textarea. */
    message: "Votre besoin, et votre site actuel si vous en avez un",
    /** Son aria-label, plus court — un lecteur d'écran n'a pas besoin de l'exemple. */
    messageLabel: "Votre message",
    /** Le libellé du champ leurre anti-robot, hors écran et hors tabulation. */
    leurre: "Ne remplissez pas ce champ",
    /**
     * LE « MA » EST CELUI DU VISITEUR, pas celui du studio, et c'est pour ça
     * qu'il survit au passage au pluriel du 31 août 2026 : c'est SA demande
     * qu'il envoie. Même chose pour `nav.devis`, les trois `offres.*Cta` et
     * `hero.ctaPrincipal` — un CTA se lit à la première personne de celui qui
     * clique (guide de voix §7). La voix DU STUDIO, elle, dit « nous ».
     */
    envoyer: "Envoyer ma demande",
    /** L'état du bouton pendant la requête. */
    envoiEnCours: "Envoi…",
    /** Validation côté client : ni téléphone ni e-mail. */
    erreurContact: "Indiquez un téléphone ou un e-mail.",
    /**
     * Le message de succès dit un FAIT vérifiable — où arrive le message — et
     * surtout AUCUN délai de réponse : le seul engagement autorisé est
     * `MENTION_REPONSE` (lib/familles.ts), affiché au-dessus du formulaire.
     */
    succes: "Message reçu — il arrive directement sur notre téléphone.",
    /** Le serveur a répondu, mais en erreur, et sans message exploitable. */
    erreurEnvoi: "Envoi impossible pour le moment. Écrivez-nous sur WhatsApp en attendant.",
    /** Le `fetch` lui-même a échoué : réseau coupé, requête interrompue. */
    erreurReseau: "Connexion interrompue. Écrivez-nous sur WhatsApp en attendant.",
  },

  /**
   * components/NoyauHero.tsx — les quatre temps du hero.
   *
   * TROIS BUDGETS DE PLACE, ET ILS SONT MESURÉS. Les dépasser ne « rend pas
   * moins joli » : ça casse la maquette. Ils s'appliquent aux DEUX langues.
   *
   *  1. `h1Ligne1`, `h1Ligne2` et la ligne 3 recollée : **21 caractères au
   *     plus** chacune. binacore.css révèle les `.l` une par une et le CSS les
   *     désigne par `:nth-child(1|2|3)` — il y en a donc EXACTEMENT trois, ni
   *     deux ni quatre. Une ligne qui déborde repousse `hero-foot` sous le pli.
   *     Décompte actuel : fr 15 / 16 / 19, en 16 / 15 / 19.
   *  2. `sousTitre` + le fragment de prix : budgété en LIGNES RENDUES, pas en
   *     signes. `.hero-sub` fait 42ch et une 3ᵉ ligne pousse `hero-foot` hors
   *     de l'écran. Deux lignes tiennent jusqu'à ~87 signes tout compris —
   *     fr 87, en 86.
   *  3. `phraseDebut` + `phraseItalique` + `phraseFin` : `.noyau-say` est capée
   *     à 30ch (app/noyau.css) et le corps monte à 3.1rem. 83 signes font cinq
   *     lignes. fr 75, en 70.
   *
   * `grandMot` TIENT DANS UN EMPLACEMENT DESSINÉ POUR UN SEUL MOT COURT —
   * `.noyau-num`, clamp(5rem,15vw,11rem). Quatre glyphes en français, trois en
   * anglais : au-delà, la ligne déborde sur un téléphone.
   */
  hero: {
    /** Les trois puces du kicker. Aucune ne porte de ® : rien n'est déposé. */
    kickerMetier: "Studio de création digitale",
    kickerLieu: "Genève, Suisse",
    kickerCible: "Pour les PME",
    h1Ligne1: "Site, imprimés,",
    h1Ligne2: "photos, réseaux.",
    /**
     * La ligne 3 est coupée autour de son `.serif-i` — l'espace est dans la
     * chaîne.
     *
     * ELLE DISAIT « Une seule personne. » JUSQU'AU 31 AOÛT 2026. C'était la
     * revendication d'être seul, écrite au plus gros caractère du site ; la
     * décision du propriétaire l'a retirée du site public en même temps
     * qu'elle faisait passer la voix au pluriel (voice-guide.md §4). Ce qui la
     * remplace dit le fait qui restait vrai et qui vend autant : d'où vient le
     * travail. 19 signes recollés, comme la ligne d'avant — le budget de 21 est
     * tenu sans nouvelle mesure.
     */
    h1Ligne3Debut: "Un studio à ",
    h1Ligne3Italique: "Genève",
    h1Ligne3Fin: ".",
    sousTitre: "Le site refait en une semaine, et vous n'avez rien à préparer.",
    /**
     * « Dès », avec sa majuscule de début de phrase — `prefixeDes()` de
     * lib/format.ts rend la forme minuscule, qui colle à un montant en cours
     * de phrase. Le montant et la mention de TVA, eux, viennent bien de
     * lib/format.ts : ce sont eux qui ont valeur légale.
     */
    sousTitrePrixDes: "Dès",
    /**
     * Espace final : la flèche `.ar` suit immédiatement dans le JSX.
     * « mon site » EST CELUI DU VISITEUR — voir `formulaire.envoyer`.
     */
    ctaPrincipal: "Faire refaire mon site ",
    ctaSecondaire: "Voir les démonstrations",
    defiler: "Défiler",

    /** Temps 2 — l'étiquette « (001) » n'est pas ici : c'est un chiffre. */
    temps2Section: "Le noyau",
    phraseDebut: "Le site, le logo, les cartes, les photos. Vous dites oui, ",
    phraseItalique: "nous faisons le reste",
    phraseFin: ".",

    /**
     * Temps 3 — le grand mot, son unité, et le tableau de cinq lignes.
     *
     * L'UNITÉ DISAIT « d'une seule main » JUSQU'AU 31 AOÛT 2026, et c'était la
     * même revendication que la troisième ligne du `h1` : le studio ne se
     * présente plus comme une personne seule. « de bout en bout » qualifie le
     * même « Tout » — l'étendue de l'offre, du premier geste au dernier — sans
     * rien dire de l'effectif. 15 signes contre 16 : l'unité tient dans la même
     * ligne de petites capitales espacées, elle a même un signe de marge.
     */
    temps3Section: "Le cœur",
    grandMot: "Tout",
    grandMotUnite: "de bout en bout",
    specAtelier: "Atelier",
    specAtelierValeur: "Genève",
    specSite: "Le site",
    /** « une semaine » ne voyage jamais seule : ici elle porte ce qui est livré. */
    specSiteValeur: "Livré en une semaine",
    specReste: "Le reste",
    specResteValeur: "Logo, cartes, affiches, photos",
    specTextes: "Vos textes",
    specTextesValeur: "Repris de votre site",
    specSuivi: "Suivi",
    specSuiviValeur: "Dès la 2ᵉ année",

    /** Temps 4 — la sortie, la phrase la plus grande du hero. */
    sortie: "Votre site ne se regarde pas. Il travaille, ou il ne sert à rien.",
    /** Espace final : la flèche `.ar` suit. */
    sortieCtaPrincipal: "Voir les démonstrations ",
    sortieCtaSecondaire: "Demander un devis",
  },

  /**
   * components/Strip.tsx — la bande défilante, `aria-hidden`.
   *
   * `delai` DISAIT « Une semaine » TOUT COURT, C'EST TRANCHÉ.
   *
   * La règle §5 du guide de voix veut que chaque occurrence du délai porte,
   * dans la même unité de lecture, son point de départ ou ce qui est livré ; et
   * une vignette de marquee est bien une unité de lecture, décorative mais
   * lisible. La chaîne enfreignait donc la règle, et elle l'enfreignait déjà
   * avant le chantier anglais : elle avait été reprise **au mot près** du JSX
   * d'origine, parce que le branchement du dictionnaire ne devait pas changer
   * un caractère à l'écran. Le propriétaire a validé la correction.
   *
   * `delai` porte désormais son POINT DE DÉPART, comme l'anglais le faisait
   * déjà — « One week from your go-ahead ». C'était le seul endroit du site où
   * les deux langues ne disaient pas la même chose ; elles se rejoignent.
   *
   * C'est aussi la seule vignette de la bande qui compte plus d'un souffle, et
   * c'est voulu : la règle §5 prime sur la régularité du défilé.
   */
  strip: {
    refonte: "Refonte de site",
    devis: "Demande de devis",
    rendezVous: "Prise de rendez-vous",
    /**
     * LA VIGNETTE DISAIT « Fiche Google » JUSQU'AU 31 AOÛT 2026. La fiche
     * Google a cessé d'être une prestation du studio ce jour-là : elle sort
     * donc de la bande, qui n'énumère que ce qui se vend. Ce qui la remplace
     * est la ligne de vitrine que la bande ne nommait pas — et que le `h1`
     * annonce pourtant depuis le premier écran (« Site, imprimés, photos,
     * réseaux »). La CLÉ a suivi le contenu : `ficheGoogle` désignait la
     * prestation, pas l'emplacement.
     */
    reseauxSociaux: "Réseaux sociaux",
    delai: "Une semaine dès votre feu vert",
    lieu: "Genève",
  },

  /** components/Travaux.tsx — les cinq démonstrations. */
  travaux: {
    section: "Travaux",
    /** Le `<h2>` est coupé sur son `<br>` : deux chaînes, deux lignes. */
    titreLigne1: "Tout a un avant.",
    titreLigne2: "Voici les après.",
    lede: "Cinq démonstrations du studio — glissez la poignée de chaque pièce pour comparer l'avant et l'après.",
    /** La flèche est DANS la chaîne : c'est du texte, pas un `.ar`. */
    lien: "Voir toutes les démonstrations →",
  },

  /**
   * components/ServicesRows.tsx — les six gestes.
   *
   * Six titres, six corps, six renvois. Les corps sont longs par décision
   * éditoriale : un dirigeant qui compare des devis a besoin de la phrase qui
   * dit ce qu'il obtient concrètement.
   */
  services: {
    section: "Services",
    titreLigne1: "Cinq gestes,",
    titreLigne2: "le même endroit.",
    titre01: "Refonte de site",
    corps01:
      "Votre site actuel, repris et refait : une page, lisible sur téléphone, rapide, à jour. Les textes existants sont récupérés puis réécrits — vous signalez ce qui a changé depuis. Une semaine dès votre feu vert, deux allers-retours compris ; le site fini vous est présenté et validé avant d'être mis en ligne. C'est le produit d'entrée, et celui qui porte tout le reste : le formulaire, les rendez-vous et l'assistant s'y branchent.",
    lien01: "Voir les trois formules →",
    titre02: "Intégration d'un bot IA",
    corps02:
      "Un bot qui prend la demande à votre place, du premier message au rendez-vous posé. Il pose les bonnes questions — prestation, surface, délai, adresse — rend une estimation chiffrée, et laisse le visiteur choisir son créneau à 23 h comme le dimanche. Il répond aux questions courantes jour et nuit, note le nom et le numéro, vous alerte sur votre téléphone, et relance seul ceux qui n'ont pas donné suite. Ce qui atterrit chez vous n'est plus un « rappelez-moi » : c'est une demande que vous pouvez chiffrer. Il tourne sur ce site — la bulle en bas de l'écran, c'est lui : ouvrez-la, c'est la démonstration. Le formulaire qui chiffre et prend les rendez-vous commence avec Le Site ; l'assistant qui répond et relance, avec L'Assistant.",
    lien02: "Voir les formules →",
    titre03: "Logo, imprimés et photos",
    corps03:
      "Un logotype si vous n'en avez pas, une palette et des typographies qui tiennent du site aux véhicules, et les règles qui disent où va quoi. Puis ce que vos clients gardent en main : cartes de visite 85 × 55 recto-verso, affiches, stickers vitrine. Les photos de votre entreprise sont prises sur place, un jour où vous travaillez — il n'y a rien à mettre en scène. Ces lignes se chiffrent sur devis : un tirage, un format et un papier ne se devinent pas.",
    lien03: "Voir le logo et les photos →",
    /**
     * LE GESTE 05 S'APPELAIT « Fiche Google et réseaux sociaux », ET IL PORTAIT
     * DEUX PRESTATIONS DONT L'UNE N'EXISTE PLUS. La fiche Google est sortie de
     * l'offre le 31 août 2026 : le geste ne garde donc que la seconde moitié,
     * qui était de toute façon celle vers laquelle son renvoi pointait
     * (`/services/reseaux-sociaux`). Le corps est repris de la matière de cette
     * page-là (lib/familles.ts, famille « reseaux-sociaux ») pour que les deux
     * disent la même chose au mot près — le partenaire de production compris,
     * qui doit rester nommé.
     */
    titre04: "Réseaux sociaux, tenus pour vous",
    corps04:
      "Les réseaux sociaux se prennent en entier : le calendrier du mois vous est proposé, vous le validez, et il part — visuels, textes, publication aux heures utiles, réponses aux commentaires et aux messages. Publier une fois ne coûte rien ; publier chaque semaine pendant un an, c'est un métier, et c'est celui-là qui est repris. La production est faite avec un partenaire du studio, et c'est nous qui vous rendons le travail. Sur devis.",
    lien04: "Voir les réseaux sociaux →",
    titre05: "Restaurants et cafés",
    corps05:
      "Pour les cafés et les restaurants : la carte reprise en entier — l'ordre des sections, la lisibilité des prix, la place des mentions obligatoires —, avec ses fichiers d'impression, sa version en ligne et son QR. Puis ce qui tient la salle : chevalets de table, carte de fidélité, bons cadeaux et supports de saison. Une ligne à part, tenue depuis le début, et ouverte à qui n'a pas de site chez nous. Sur devis.",
    lien05: "Voir la ligne restaurant →",
  },

  /**
   * components/Methode.tsx — les quatre étapes.
   *
   * LES JALONS NE SE COMPTENT NI EN HEURES NI EN JOURS, dans aucune des deux
   * langues : « En amont », « Début de semaine », « Fin de semaine »,
   * « Ensuite ». Un jalon horaire est un compte d'heures déguisé.
   */
  methode: {
    section: "Méthode",
    titreLigne1: "Du feu vert à la mise",
    titreLigne2: "en ligne : une semaine.",
    etape01Moment: "En amont",
    etape01Titre: "L'état des lieux",
    etape01Texte:
      "On regarde ensemble ce que vous montrez aujourd'hui : votre site, vos imprimés, vos réseaux sociaux. Ce qui manque, ce qui bloque, ce que vos clients ne trouvent pas. Chez vous ou par téléphone.",
    etape02Moment: "Début de semaine",
    etape02Titre: "La maquette",
    etape02Texte:
      "Vous voyez l'avant / après en début de semaine. Vous validez ou nous ajustons — deux allers-retours sont compris.",
    etape03Moment: "Fin de semaine",
    etape03Titre: "La mise en ligne",
    etape03Texte:
      "Domaine, hébergement, formulaire, rendez-vous : tout est branché. Vous n'installez rien, vous ne configurez rien.",
    etape04Moment: "Ensuite",
    etape04Titre: "Le suivi",
    etape04Texte:
      "Un tarif change, une prestation s'ajoute, un horaire bouge ? Vous nous écrivez, et c'est nous qui corrigeons. Une affiche pour la rentrée, des cartes à réimprimer : vous nous écrivez aussi. La deuxième année, c'est encore le même studio.",
    /** Espace final : la flèche `.ar` suit. */
    cta: "Voir les formules et les prix ",
  },

  /**
   * components/Studio.tsx — qui fait le travail.
   *
   * La citation est coupée autour de son `<em>` : les guillemets font partie
   * des chaînes, et ils changent de forme d'une langue à l'autre — « » en
   * français, “ ” en anglais.
   */
  studio: {
    section: "Le studio",
    /** Le `<h2>` de la section est en `.sr-only` : lu, jamais vu. */
    titreCache: "Le studio",
    citationDebut: "« Vous parlez à ceux qui ",
    citationItalique: "font",
    citationFin: " le travail. »",
    paragraphe1:
      "Nawa Corps est le studio de création digitale fondé par Ayoub Bensalem, designer et développeur à Genève. Le studio réunit les métiers dont votre projet a besoin — conception, développement, photographie — et produit vos réseaux sociaux avec un partenaire de production. Pas de commerciaux, pas de chargé de compte, pas de brief qui passe de main en main.",
    paragraphe2:
      "Ce que ça change se voit à l'usage. Le travail commence à votre feu vert, pas à la réception de vos textes. Le site fini vous est présenté et validé avant d'être mis en ligne. Deux allers-retours sont compris, et ils sont écrits — une prestation qu'on borne est une prestation qu'on tient.",
    paragraphe3:
      "Votre site est dessiné et construit au même endroit, et vous parlez à ceux qui le font, du premier message à la livraison. C'est encore nous l'année suivante, quand un tarif change, qu'il faut une affiche pour la rentrée ou qu'un formulaire doit poser une question de plus.",
    /**
     * `faitLieu` A QUITTÉ CE DICTIONNAIRE, ET IL NE FAUT PAS L'Y REMETTRE.
     * Il portait « Genève » / « Geneva », c'est-à-dire la LOCALITÉ DU STUDIO —
     * une donnée, pas un texte, au même titre que l'e-mail et le téléphone. Sa
     * source unique est `CONTACT` dans lib/site.ts, où elle existe en deux
     * graphies : `ville` pour tout ce qui part en donnée structurée, dans les
     * DEUX langues, et `villeEn` pour ce qu'un humain lit. C'est
     * components/Studio.tsx qui choisit, et son docblock dit pourquoi.
     * La note, elle, est bien du texte : elle reste ici.
     */
    faitLieuNote: "Basé ici",
    /** « une semaine » porte ici ce qui est livré — règle §5, comme partout. */
    faitDelai: "Une semaine",
    faitDelaiNote: "Refonte livrée",
    /** Les deux langues de travail du studio. Ce n'est pas un texte : pas de traduction. */
    faitLangues: "FR / EN",
    faitLanguesNote: "Langues",
    lien: "Voir qui fait le travail →",
  },

  /**
   * components/Offres.tsx — la grille des trois formules.
   *
   * AUCUN MONTANT ICI, jamais : les prix viennent de Postgres et la mention de
   * TVA de lib/format.ts. Les chaînes coupées (`noteSuivi*`, `suiviAssistant*`)
   * se recollent autour d'un montant lu en base, d'où leurs espaces.
   *
   * LES NOMS DES TROIS FORMULES NE SONT PAS ICI NON PLUS. `La Vitrine`,
   * `Le Site` et `L'Assistant` viennent de la table Service, où `nameEn` vaut
   * `null` VOLONTAIREMENT pour les trois : ce sont des noms propres, ils ne se
   * traduisent pas (voir lib/catalogue.ts). Les puces les citent en toutes
   * lettres, article compris, dans les deux langues.
   */
  offres: {
    section: "Offres",
    titreLigne1: "Des prix clairs,",
    titreLigne2: "tout compris.",
    recommande: "Recommandé",
    vitrinePuce1: "Une page, lisible sur téléphone",
    vitrinePuce2: "Formulaire de demande qui fonctionne",
    vitrinePuce3: "Appel, itinéraire et horaires en un geste",
    vitrinePuce4: "Domaine et hébergement la 1ʳᵉ année",
    vitrineCta: "Rendre mon site présentable",
    sitePuce1: "Tout La Vitrine, plus :",
    sitePuce2: "Prise de rendez-vous en ligne",
    sitePuce3: "Devis chiffré automatiquement",
    /**
     * LA PUCE DISAIT « Fiche Google et photos comprises ». La fiche Google
     * n'est plus vendue depuis le 31 août 2026 ; ce que Le Site apporte de plus
     * que La Vitrine est écrit dans lib/formules.ts (`apporte`), et la photo en
     * est le troisième point. La puce n'annonce donc plus que ce qui est
     * réellement au contrat.
     */
    sitePuce4: "Photos de votre entreprise comprises",
    /** « mes demandes » est celui du visiteur — voir `formulaire.envoyer`. */
    siteCta: "Recevoir mes demandes",
    assistantPuce1: "Tout Le Site, plus :",
    assistantPuce2: "L'assistant de ce site, sur le vôtre",
    assistantPuce3: "Alerte sur votre téléphone à chaque demande",
    assistantPuce4: "Relance automatique et tableau de bord",
    assistantCta: "Automatiser mes demandes",
    /** Le prix mensuel obligatoire, sur la carte du palier qui l'impose. */
    suiviAssistantAvant: "puis ",
    suiviAssistantApres:
      " dès la 2ᵉ année — obligatoire, l'assistant tourne en continu",
    /** La note sous la grille — second emplacement imposé par le pilier 3. */
    noteSuiviAvant: "Suivi et hébergement dès ",
    noteSuiviApres: " à partir de la 2ᵉ année",
    /** Se recolle en `129.–/mois obligatoire avec L'Assistant`. */
    noteSuiviAssistantAvant: " obligatoire avec ",
    /**
     * La moitié non légale de la phrase de pied. L'autre moitié — les deux mots
     * qui portent l'obligation — vient de `mentionTva()`, jamais recopiée ici.
     */
    notePrix: "Prix en francs suisses",
    noteCorrections: "Deux allers-retours de correction compris.",
    /** La flèche est DANS la chaîne : c'est du texte. */
    ctaDevis: "Demander un devis →",
  },

  /**
   * components/CarteDuStudio.tsx et components/CarteService.tsx — le catalogue
   * hors formules.
   *
   * `devisCompteMilieu` et `devisCompteFin` encadrent DEUX NOMBRES calculés sur
   * la base. Ils gardent leurs espaces, et les quatre morceaux restent quatre
   * enfants JSX distincts : recoller la phrase en une seule chaîne changerait
   * le HTML du site français sans changer un mot.
   */
  carte: {
    titreDebut: "Tout ce que ",
    titreItalique: "fait le studio",
    lede: "Le site est le produit d'entrée ; il n'est pas le seul atelier. Ce qui s'imprime et ce qui se publie chaque semaine passent devant : ce sont les deux que le studio met en vitrine à côté des formules. Le reste suit, entier, et se commande avec un site chez nous comme sans — les supports de restaurant compris.",
    rang: "Également à l'atelier",
    rangDescription:
      "Logo et photos, hébergement du site, restaurants et cafés : trois pages entières, qui gardent leur prix et leur devis. Elles passent après, pas au rabais.",
    devisCompteMilieu: " lignes portent un prix ferme, ",
    devisCompteFin: " sont annoncées sur devis.",
    /** Même découpage que `offres.notePrix`, et pour la même raison. */
    notePrix: "Prix en francs suisses",
    ctaDevis: "Demander un devis →",
    /**
     * L'affordance de la carte quand elle ouvre sa PROPRE page (/services) :
     * le titre de la carte est déjà le nom de la page, il n'y a rien à nommer,
     * mais sans ces trois mots un téléphone n'a aucun moyen de savoir qu'on
     * peut cliquer.
     */
    voirLeDetail: "Voir le détail",
  },

  /**
   * components/Faq.tsx — les cinq questions.
   *
   * Elles alimentent AUSSI le JSON-LD `FAQPage` du composant : une donnée
   * structurée qui promettrait à Google une réponse que la page n'affiche pas
   * est exactement ce qu'il sanctionne. Une seule liste, deux sorties.
   *
   * `tarifs*` SE RECOLLE AUTOUR DE DEUX MONTANTS lus en base, et la phrase se
   * termine par la mention de TVA de lib/format.ts : la réponse repart telle
   * quelle dans le JSON-LD, hors de tout contexte de page, et aucune note de
   * bas de section ne la couvrirait là-bas.
   */
  faq: {
    section: "Questions",
    titreCache: "Questions fréquentes",
    question1: "Une semaine, vraiment ?",
    reponse1:
      "Oui, et c'est la même semaine que vous ayez déjà un site ou non. Nous reprenons vos textes, nous refaisons la mise en page, nous branchons le formulaire et les rendez-vous. Le délai court dès votre feu vert, pas dès que vous nous avez envoyé quelque chose : vous n'avez rien à préparer.",
    /**
     * LES QUESTIONS SONT DITES PAR LE VISITEUR, LES RÉPONSES PAR LE STUDIO.
     * D'où le « je » de celle-ci et de `question4`, qui restent au singulier
     * après le passage de la voix au pluriel : c'est le lecteur qui parle, et
     * le mettre au pluriel lui prêterait une entreprise à plusieurs têtes qu'on
     * ne connaît pas. Les réponses, elles, disent « nous ».
     */
    question2: "Je n'ai ni textes ni photos. C'est bloquant ?",
    reponse2:
      "Non, et c'est compris dans le prix. Si un site existe, nous récupérons ce qui s'y trouve et nous le réécrivons ; vous nous dites ce qui a changé. Sinon nous vous proposons une maquette rédigée, vous corrigez. Les photos de votre entreprise font partie du Site et de L'Assistant.",
    question3: "Qui gère l'hébergement et le nom de domaine ?",
    reponse3Avant:
      "Nous. Domaine et hébergement de la première année sont compris dans les trois formules. ",
    reponse3Apres: " Le domaine reste à votre nom : il vous appartient.",
    tarifsAvant: "Ensuite, ",
    tarifsMilieu:
      " pour l'hébergement, les mises à jour et les sauvegardes — ",
    tarifsApres:
      " si votre site a l'assistant, qui tourne en continu, et c'est alors obligatoire. Les deux montants s'entendent ",
    /** Base injoignable ou ligne masquée : la réponse se referme sans chiffre. */
    tarifsSansMontant:
      "Ensuite, le suivi mensuel prend le relais : hébergement, mises à jour et sauvegardes — et l'assistant quand votre site en a un, auquel cas le suivi est obligatoire.",
    question4: "Et après, si j'ai besoin d'autre chose ?",
    reponse4:
      "Deux allers-retours sont compris pendant la conception. Une fois en ligne, un message suffit : un tarif qui bouge, une prestation qui s'ajoute, un horaire qui change. Les modifications de contenu sont comprises dans le suivi de L'Assistant ; sur les deux autres formules, elles sont facturées à la demande. Et vous n'êtes pas limité au site : logotype, cartes de visite, affiche, photos de votre entreprise, réseaux sociaux, supports de restaurant — sur devis, avec un site chez nous comme sans.",
    question5: "À ce prix-là, qu'est-ce qui n'est pas fait ?",
    reponse5:
      "Une page, pas dix. Deux allers-retours, pas trois. Vos textes sont repris de votre site actuel et réécrits, pas rédigés de zéro. Il n'y a ni bureaux, ni équipe commerciale : votre site est dessiné et construit au même endroit, et vous parlez à qui le fait. C'est encore nous qui répondons l'année suivante.",
    /** Espace final : la flèche `.ar` suit. */
    ctaDevis: "Demander un devis ",
    ctaFormules: "Voir les formules",
  },
};

/**
 * LA FORME DU DICTIONNAIRE, déduite du français.
 *
 * C'est ce type que `en.ts` s'engage à remplir en entier. Il n'est pas écrit à
 * la main : une interface recopiée à côté du français divergerait, et c'est
 * précisément la divergence qu'on veut rendre impossible.
 */
export type Dictionnaire = typeof fr;

export default fr;
