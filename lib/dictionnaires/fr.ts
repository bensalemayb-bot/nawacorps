import { SOURCES_CHIFFRES } from "@/lib/chiffres";

/**
 * DICTIONNAIRE FRANÇAIS — et, par la même occasion, LA FORME que l'anglais est
 * obligé de remplir.
 *
 * `export type Dictionnaire = typeof fr` en fin de fichier : ce fichier n'est
 * pas seulement la traduction française, c'est le CONTRAT. `en.ts` se déclare
 * `const en: Dictionnaire`, si bien qu'une clé oubliée ou une clé en trop
 * casse `npm run typecheck`. Une traduction manquante tombe à la compilation,
 * jamais en production.
 *
 * PAS DE `as const`, ET C'EST DÉLIBÉRÉ. Avec `as const`, chaque propriété
 * prendrait pour type sa propre chaîne française, et `en.ts` ne pourrait rien
 * écrire d'autre. N'ajoutez ni `as const` ni `satisfies` ici.
 *
 * RIEN QUE DES CHAÎNES (et des tableaux de chaînes), jamais de fonction.
 * `components/ContactForm.tsx` est un composant CLIENT : ce qu'il reçoit
 * traverse la frontière serveur/client, et une fonction ne la traverse pas.
 *
 * PÉRIMÈTRE : le chrome partagé (nav, menu, pied de page, formulaire), puis
 * les sections de l'accueil, une clé de premier niveau par composant.
 * Depuis le 24 octobre 2026, le site vend une seule chose : l'assistant IA
 * installé dans les PME genevoises (.agents/product-marketing.md). Les textes
 * viennent de docs/agents/copy/ et de la revue docs/agents/reviews/
 * psy-A-agent-metier-tour2.md.
 *
 * LES GABARITS DE PRIX. Le seul montant affiché est la mise en place, lue en
 * base (lib/catalogue.ts, `SLUG_MISE_EN_PLACE`). Les chaînes qui le portent
 * contiennent `{montant}` et `{tva}`, remplis par `avecPrix()` : la
 * mention de TVA (« pas de TVA (entreprise non assujettie) ») n'est jamais
 * recopiée ici, elle vient de lib/format.ts. Chacune a
 * une jumelle `…SansMontant`, rendue quand la ligne manque en base. Aucun
 * montant mensuel n'existe dans ce fichier : l'abonnement n'est pas affiché.
 *
 * LES ESPACES DE FIN SONT SIGNIFIANTS. Un libellé de bouton suivi de la flèche
 * `<span className="ar">→</span>` porte l'espace dans la chaîne : écrit dans
 * le JSX, il ferait un troisième enfant et React intercalerait un `<!-- -->`.
 * Même règle pour une chaîne coupée autour d'un `<span className="serif-i">`.
 *
 * CE QUI N'EST VOLONTAIREMENT PAS ICI :
 *  - le nom du studio, l'e-mail, le téléphone, WhatsApp, les horaires
 *    machine : des DONNÉES, dans `lib/site.ts`, leur source unique ;
 *  - « Réponse le jour ouvrable suivant. » : `MENTION_REPONSE`, formulation
 *    unique au caractère près dans tout le site ;
 *  - les messages d'erreur renvoyés par `app/api/contact/route.ts`.
 */
const fr = {
  /** components/Nav.tsx — la barre du haut. */
  nav: {
    /** aria-label du logotype, qui est le lien vers l'accueil. */
    accueil: "Nawa Corps — accueil",
    /** Texte alternatif du wordmark ; l'icône qui le précède porte `alt=""`. */
    logoAlt: "Nawa Corps",
    /** Première moitié de l'horloge : `${horlogeVille} — ${heure}`. */
    horlogeVille: "Genève",
    /** Mène à la section (05) de l'accueil : ce que l'on paie, et quand. */
    services: "L'offre",
    /** Mène au hub /metiers : une page par métier. */
    metiers: "Métiers",
    /** Mène à /demonstrations : deux exemples d'automatisation par métier, avec leur schéma. */
    demonstrations: "Démonstrations",
    studio: "Le studio",
    contact: "Contact",
    /**
     * La pastille pleine, à droite — elle mène à /devis, qui ouvre Leo : c'est
     * la DEMANDE de démo. « Voir la démo sur mon métier », partout ailleurs,
     * MONTRE la démo et mène à /demonstrations (décision d'Ayoub du
     * 25.10.2026 : Leo ne s'ouvre que quand le visiteur demande). LA PASTILLE GARDE LE
     * LIBELLÉ COURT, et c'est mesuré : à 926 px de large, « Voir la démo sur
     * mon métier » cassait la pastille sur quatre lignes et poussait « Le
     * studio » sur deux. C'est le libellé de l'action finale (`envoyer`, la
     * clôture de Leo), et la destination reste la même.
     */
    devis: "Demander ma démo",
    /** aria-label du bouton burger. */
    ouvrirMenu: "Ouvrir le menu",
  },

  /**
   * components/MenuOverlay.tsx — le menu plein écran. Il dit ce que dit la
   * nav, mais garde ses propres clés pour pouvoir diverger.
   */
  menu: {
    services: "L'offre",
    metiers: "Métiers",
    demonstrations: "Démonstrations",
    studio: "Le studio",
    contact: "Contact",
    /** Bas du menu — le libellé du lien WhatsApp. L'URL vient de lib/site.ts. */
    whatsapp: "WhatsApp",
    lieu: "Genève, Suisse",
  },

  /**
   * components/SelecteurLangue.tsx. Une seule clé : les noms des langues
   * s'écrivent chacun dans sa propre langue et vivent dans le composant.
   */
  langue: {
    section: "Langue",
  },

  /** components/FooterContact.tsx — le pied de page. */
  pied: {
    section: "Contact",
    /**
     * Le titre, EN TROIS MORCEAUX parce que le markup en fait trois :
     * Interactions.tsx scinde ce `<h2>` sur son `<br>`, et la fin de la
     * seconde ligne est en italique. ESPACE FINAL de `titreLigne2Debut`.
     */
    titreLigne1: "Voyez-le sur votre métier.",
    titreLigne2Debut: "Nous vous montrons ",
    titreLigne2Italique: "l'assistant à l'œuvre.",
    ecrireWhatsapp: "Écrire sur WhatsApp",
    /**
     * « ou appelez-nous, ou dites-nous… », EN TROIS MORCEAUX : le milieu
     * est un lien `tel:` (audit CRO/SEO v2 §3.5), le numéro vient de
     * lib/site.ts. Espaces signifiants en bord de morceau.
     */
    ouParEcritDebut: "ou ",
    ouParEcritAppel: "écrivez-nous sur WhatsApp",
    ouParEcritFin: ", ou dites-nous en deux lignes ce qui vous prend vos soirées",
    /** Le lien vers le hub /metiers, dans la bande du bas. */
    metiers: "Métiers",
    /** Le lien vers /guides (français seulement), dans la bande du bas. */
    guides: "Guides",
    lieu: "Genève, Suisse",
    horaires: "Lu–Sa · 9h–19h",
    copyright: "© 2026 Nawa Corps",
    /** La bande légale, tout en bas. `resume` porte le seul slogan du site. */
    metier: "Studio genevois · Assistant IA pour PME",
    resume: "Vous validez. Il s'occupe du reste.",
    mentionsLegales: "Mentions légales",
    confidentialite: "Confidentialité",
    /** Les conditions générales de vente (B2B), page /cgv. */
    cgv: "CGV",
    /**
     * aria-label de la bande de liens légaux posée par le layout public sur
     * les pages SANS pied de page complet (/contact, /devis, pages légales,
     * 404) : components/LiensLegaux.tsx.
     */
    liensLegaux: "Informations légales",
    /** Le lien vers la rubrique #cookies de /confidentialite, dans la bande du bas. */
    cookies: "Cookies",
  },

  /**
   * components/BandeauCookies.tsx — le bandeau d'information. Il INFORME, il
   * ne demande rien : le site ne range que le strictement nécessaire (voir
   * /confidentialite#cookies). Le jour où une mesure d'audience arrive, ces
   * textes deviennent un vrai choix accepter / refuser.
   */
  cookies: {
    texte:
      "Ce site n'utilise que le stockage nécessaire à son fonctionnement : aucun suivi publicitaire, aucune mesure d'audience.",
    enSavoirPlus: "Lire le détail",
    compris: "J'ai compris",
    /** aria-label de la région du bandeau. */
    region: "Information sur les cookies",
  },

  /**
   * components/ContactForm.tsx — rendu dans le pied de page, sur /contact et
   * sur /devis. Le formulaire est la demande de démo ; sa mécanique d'envoi
   * (app/api/contact, Telegram) ne change pas.
   */
  formulaire: {
    /** Placeholder : l'astérisque renvoie à `mentionRequis`, sous le formulaire. */
    nom: "Votre nom *",
    telephone: "Votre téléphone",
    email: "Votre e-mail",
    /**
     * Les LIBELLÉS des champs, lus par les lecteurs d'écran (label
     * `sr-only`). Ils disent ce qui est obligatoire, ce qu'un placeholder
     * seul ne garantit pas : il disparaît dès qu'on tape.
     */
    labelNom: "Votre nom (obligatoire)",
    labelTelephone: "Votre téléphone (téléphone ou e-mail obligatoire)",
    labelEmail: "Votre e-mail (téléphone ou e-mail obligatoire)",
    /** Le placeholder pose la question d'ouverture de l'appel. */
    message: "Votre métier, et ce qui vous prend vos soirées",
    /** Son aria-label, plus court. */
    messageLabel: "Votre message",
    /** Le libellé du champ leurre anti-robot, hors écran et hors tabulation. */
    leurre: "Ne remplissez pas ce champ",
    /** « ma » est celui du VISITEUR : un CTA se lit à la première personne de celui qui clique. */
    envoyer: "Demander ma démo",
    envoiEnCours: "Envoi…",
    erreurContact: "Indiquez un téléphone ou un e-mail.",
    /**
     * Un FAIT vérifiable — où arrive le message — et AUCUN délai : le seul
     * engagement autorisé est `MENTION_REPONSE`, affiché au-dessus.
     */
    succes: "Message reçu. Il arrive directement sur notre téléphone.",
    erreurEnvoi: "Envoi impossible pour le moment. Écrivez-nous sur WhatsApp en attendant.",
    erreurReseau: "Connexion interrompue. Écrivez-nous sur WhatsApp en attendant.",
    /**
     * LA MENTION SOUS LE FORMULAIRE (25.10.2026) : ce qui est obligatoire,
     * à quoi servent les données, et le lien vers /confidentialite. Pas de
     * case à cocher : aucun traitement ne repose sur le consentement.
     * Espace final de `mentionDebut` : le lien suit.
     */
    mentionRequis: "* Nom obligatoire, ainsi qu'un téléphone ou un e-mail.",
    mentionDebut: "Ces données servent uniquement à vous répondre et à organiser la démo. ",
    mentionLien: "Confidentialité",
  },

  /**
   * components/NoyauHero.tsx — les quatre temps du hero.
   *
   * TROIS BUDGETS DE PLACE, MESURÉS, valables dans les deux langues :
   *  1. CHAQUE LIGNE `.l` DU h1 TIENT EN 21 CARACTÈRES AU PLUS (CLAUDE.md) :
   *     `h1Debut` 15, et les quatre fins de `h1Rotation` 21, 21, 18 et 20.
   *     MAIS LA PREMIÈRE LIGNE A UN BUDGET EN PIXELS : à 1440 px, la boule
   *     sombre du noyau commence vers 590 px, et une encre sombre posée dessus
   *     disparaît. « L'assistant qui » y perdait son « qui » à 7.6rem ; le
   *     plafond du h1 est donc descendu à 5.4rem (app/binacore.css), où la
   *     ligne s'arrête à 600 px. Ne pas rallonger cette ligne sans remesurer.
   *  2. `sousTitre` : deux lignes rendues dans les 42ch de `.hero-sub`, sinon
   *     `hero-foot` sort du pli. ~104 signes en français, ~94 en anglais.
   *  3. la phrase du temps 2 (`phraseDebut` + `phraseItalique` + `phraseFin`) :
   *     83 signes au plus, `.noyau-say` est capée à 30ch.
   *
   * `grandMot` tient dans un emplacement dessiné pour un seul mot court
   * (`.noyau-num`). C'était « 0 » ; à trois mètres, un « 0 » géant se lisait
   * comme un compteur à zéro (audit CRO du 25.10.2026, §2.3). C'est
   * désormais « Rien », puis `grandMotUnite`, « à payer avant l'essai » (21
   * signes ; l'anglais « Nothing » / « to pay before the trial », 23).
   * Mesuré à 375 px avant d'être gardé. Ne pas y remettre de nombre de
   * demandes : « 3 vraies demandes » ne disait rien au patron.
   */
  hero: {
    /** Le kicker. `kickerMetier` est aussi le texte de l'écran de chargement. */
    kickerMetier: "Studio genevois",
    kickerCible: "Assistant IA pour PME",
    /**
     * LE TITRE : une partie fixe, puis quatre fins qui tournent
     * (components/HeroRotation.tsx). La première, vue sans animation, porte
     * la promesse ; la dernière, le contrôle. `h1Complet` est la phrase
     * entière lue par les lecteurs d'écran (aria-label du h1).
     */
    h1Debut: "L'assistant qui",
    /**
     * LES MOTS DU PATRON (audit CRO du 25.10.2026, §2.1) : « la paperasse »
     * et « relance vos devis ». « répond à vos clients » est sorti de la
     * rotation : c'est la peur n° 1 du panel (« une IA qui écrit à mes
     * clients ») ; la promesse reste dans le corps, encadrée par le contrôle.
     */
    h1Rotation: [
      "connaît votre métier.",
      "prépare la paperasse.",
      "relance vos devis.",
      "attend votre accord.",
    ],
    h1Complet:
      "L'assistant qui connaît votre métier, prépare la paperasse, relance vos devis et attend votre accord.",
    /**
     * 100 signes. Il ouvre sur la pénurie d'embauche — le bâtiment est le
     * premier secteur en manque de personnel à Genève (CCIG 2026,
     * .agents/product-marketing.md §2) —, puis le résultat, l'IA, le contrôle.
     */
    sousTitre:
      "Personne pour le bureau ? Une IA réglée sur votre métier prépare la paperasse du soir. Vous validez.",
    /**
     * « Voir la démo », vers /demonstrations ; la demande, elle, est
     * `nav.devis` (/devis, qui ouvre Leo). Espace final :
     * la flèche `.ar` suit immédiatement dans le JSX.
     */
    ctaPrincipal: "Voir la démo sur mon métier ",
    /** Mène à (03), `#methode` : le libellé dit où il va. */
    ctaSecondaire: "Comment ça se passe",
    defiler: "Défiler",

    /** Temps 2 — ce que le patron perd. L'étiquette « (001) » est un chiffre. */
    temps2Section: "Ce qui vous coûte",
    /**
     * LES DOULEURS QUI TOURNENT (demande d'Ayoub du 25.10.2026), tous
     * métiers : « Vous perdez » + un mot qui se barre et laisse place au
     * suivant (components/RotationDouleurs.tsx), puis la réponse. Les mots
     * sont ceux du panel : le temps, les clients qui appellent ailleurs, les
     * soirées, les devis non relancés. La réponse garde le contrôle
     * (« le dernier mot reste à vous » ; « Vous validez » est déjà dit par
     * le sous-titre et la sortie du hero) : jamais « à votre place ».
     */
    douleurDebut: "Vous perdez ",
    // Le point est DANS chaque mot : les mots partagent une cellule de la
    // largeur du plus long, un point après la cellule flottait loin des mots
    // courts.
    douleurs: ["du temps.", "des clients.", "vos soirées.", "des devis."],
    douleurFin: "",
    reponse: "L'assistant prépare, le dernier mot reste à vous.",
    douleurComplet:
      "Vous perdez du temps, des clients, vos soirées, des devis. L'assistant prépare, le dernier mot reste à vous.",

    /**
     * Temps 3 — la démo, en faits. Le prix NE MONTE PAS dans le titre ni le
     * sous-titre (revue A tour 2, bloc 1) : il s'écrit ici, ligne des faits.
     * LA PROMESSE SUR LES DONNÉES NOMME L'ASSISTANT DANS L'ÉTIQUETTE MÊME :
     * sous « La démo », un « Vos données » sans borne se lisait comme les
     * demandes montrées pendant la démo, ce que rien n'établit. Elle
     * vise l'assistant livré au client, jamais ce site ni Leo (revue de code
     * agent-métier, n°1).
     */
    temps3Section: "La démo",
    grandMot: "Rien",
    grandMotUnite: "à payer avant l'essai",
    specDonnees: "Données de l'assistant",
    specDonneesValeur: "En Suisse",
    specOutils: "Vos outils",
    specOutilsValeur: "Aucun accès pour la démo",
    specDevis: "Prix et devis",
    specDevisValeur: "Validés par vous",
    specReleve: "Le relevé",
    specReleveValeur: "Chaque lundi",
    specMiseEnPlace: "Mise en place",
    /**
     * Gabarit : `{montant}` et `{tva}` remplis par `avecPrix()`. « après
     * l'essai » n'y est pas : mesuré à 375 px, il faisait passer la ligne sur
     * deux lignes quand les quatre autres en tiennent une. Il est dit par le
     * titre de (05), « La mise en place, payée après l'essai ».
     */
    specMiseEnPlaceValeur: "{montant} {tva}",
    specMiseEnPlaceValeurSansMontant: "Payée après l'essai",

    /** Temps 4 — la sortie, la phrase la plus grande du hero : le slogan. */
    sortie: "Vous validez. Il s'occupe du reste.",
    /** Espace final : la flèche `.ar` suit. */
    sortieCtaPrincipal: "Voir la démo sur mon métier ",
    /**
     * Mène à `tel:` (le numéro vient de lib/site.ts) : pour un artisan,
     * l'appel est le geste naturel (audit CRO §2.4).
     */
    sortieCtaSecondaire: "Écrire sur WhatsApp",
  },

  /**
   * components/Strip.tsx — la bande défilante, `aria-hidden` mais lue :
   * elle obéit aux mêmes règles que le reste. JAMAIS « rien ne part sans
   * vous » : c'est faux, l'accusé de réception validé une fois part seul
   * (arbitrage B1, docs/agents/copy/_points-ouverts.md).
   * DEPUIS LE 25.10.2026 ELLE NOMME LA DOULEUR, le reste du site nomme la
   * solution (audit CRO §2.5). « Les devis qui dorment » vient d'un acheteur
   * du panel.
   */
  strip: {
    devis: "Les devis qui dorment",
    chantier: "Les demandes de la journée",
    paperasse: "La paperasse du soir",
    jamais: "Jamais à votre place",
    releve: "Le relevé du lundi",
    lieu: "Genève",
  },

  /**
   * components/Chiffres.tsx — (01) Les chiffres. Cinq chiffres PUBLIÉS,
   * chacun attribué à sa source dans la même unité de lecture. L'ORDRE EST
   * CELUI DE L'AFFICHAGE (26.10.2026, « moins d'info, aussi complet ») : les
   * trois premiers sont visibles — Genève (PwC pour l'État, relu à la source
   * le 26.10.2026), la Suisse (SECO), le gain mesuré (Noy & Zhang) —, les deux
   * suivants (CAPEB, chiffre français ; Brynjolfsson et al.) sont rangés dans
   * « Voir le détail ». Formulations reprises de
   * founder/research/chiffres-cles.md §3, sans rien arrondir de plus.
   *
   * AUCUN N'EST UN RÉSULTAT DE NAWA CORPS : le chapeau le dit, visible, et la
   * clôture le redit. /services promet d'ailleurs l'inverse d'« un nombre d'heures
   * gagnées » : ne jamais transformer ces pourcentages en gain pour le client.
   *
   * LE SECO MESURE LA CHARGE RÉGLEMENTAIRE (Bürokratiemonitor), pas le
   * courrier client : la phrase le dit, ne la raccourcissez pas en « charge
   * administrative » tout court.
   *
   * `url` vient de lib/chiffres.ts, partagé avec en.ts : une adresse ne se
   * traduit pas. Les espaces avant « % » sont insécables (` `).
   */
  chiffres: {
    section: "Les chiffres",
    titreLigne1: "Ce que mesurent",
    titreLigne2: "les études.",
    lede: "Des études publiées, pas nos clients. Chaque chiffre renvoie à sa source.",
    /** Devant le nom de la source, qui est le lien. */
    source: "Source : ",
    /** Le libellé du bloc qui range les deux derniers chiffres et la clôture. */
    detail: "Deux autres chiffres",
    items: [
      {
        contexte: "PME · Genève",
        valeur: "54 %",
        texte: "des PME genevoises interrogées utilisent déjà l'IA, sous une forme ou une autre.",
        source: "PwC Suisse pour l'État de Genève, 2024",
        perimetre: "plus de 200 PME genevoises",
        url: SOURCES_CHIFFRES.geneve,
      },
      {
        contexte: "Entreprises · Suisse",
        valeur: "60 %",
        texte:
          "des entreprises suisses interrogées jugent élevée ou plutôt élevée la charge administrative que leur impose la réglementation.",
        source: "SECO, Bürokratiemonitor 2023",
        perimetre: "charge réglementaire, plus de 1 500 entreprises",
        url: SOURCES_CHIFFRES.seco,
      },
      {
        contexte: "Rédaction",
        valeur: "−40 %",
        texte:
          "de temps, environ, pour rédiger des textes professionnels avec l'IA, avec une qualité jugée 18 % meilleure.",
        source: "Noy & Zhang, Science, 2023",
        perimetre: "expérience du MIT, 453 professionnels",
        url: SOURCES_CHIFFRES.noyZhang,
      },
      {
        contexte: "Bâtiment · France",
        valeur: "48 %",
        texte:
          "des artisans du bâtiment travaillent régulièrement le week-end, et 63 % lisent leurs e-mails chaque jour pendant leurs congés.",
        source: "CAPEB, baromètre ARTIsanté 2026",
        perimetre: "2 491 chefs d'entreprise du bâtiment, France",
        url: SOURCES_CHIFFRES.capeb,
      },
      {
        contexte: "Service client",
        valeur: "+14 %",
        texte:
          "de demandes clients résolues par heure avec un assistant IA, et +34 % pour les moins expérimentés.",
        source: "Brynjolfsson et al., NBER 2023 / QJE 2025",
        perimetre: "5 179 agents de service client",
        url: SOURCES_CHIFFRES.brynjolfsson,
      },
    ],
    cloture:
      "Ce sont des moyennes d'études, pas nos résultats. Votre chiffre à vous, vous le lirez dans le relevé du lundi, sur vos propres demandes.",
  },

  /**
   * components/ServicesRows.tsx — (02) Par métier. DEPUIS LE 25.10.2026 LA
   * SECTION EST GÉNÉRALE (décision d'Ayoub) : une ligne par métier, lue dans
   * lib/metiers.ts, chacune liée à sa page, puis « Tous les métiers ». Ces
   * clés ne portent que les libellés autour des lignes.
   */
  services: {
    section: "Par métier",
    titreLigne1: "Il parle",
    titreLigne2: "votre métier.",
    /** Devant ce que l'assistant peut faire (une capacité, jamais un résultat). */
    peut: "Ce que l'assistant peut faire : ",
    /** Le renvoi de chaque ligne vers sa page métier. */
    lienMetier: "L'assistant pour ce métier, en détail →",
    /** Sous les lignes, vers le hub /metiers. */
    tous: "Tous les métiers →",
    /** La ligne sous les métiers. */
    ordre: "Votre métier n'y est pas ? Écrivez-nous quand même : la démo se fait de toute façon sur des demandes de votre métier.",
  },

  /**
   * components/Methode.tsx — (03) Comment ça se passe. Une seule durée :
   * l'essai, deux semaines (décision d'Ayoub du 25.10.2026). Ni la démo ni
   * la mise en place n'ont de délai décidé.
   *
   * DEUX TEXTES PAR ÉTAPE (26.10.2026, « moins d'info, aussi complet ») :
   * `etape0nCourt`, une ligne, sur la carte ; `etape0nTexte`, le texte entier,
   * rangé dans « Voir le détail » sous les quatre cartes.
   */
  methode: {
    section: "Comment ça se passe",
    titreLigne1: "Vos demandes d'abord,",
    titreLigne2: "votre signature après.",
    etape01Moment: "Au départ",
    etape01Titre: "L'appel",
    etape01Court: "Un appel court sur ce qui vous prend vos soirées.",
    etape01Texte:
      "Un appel court. Vous nous dites ce qui vous prend vos soirées. Nous ne vous vendons rien ce jour-là.",
    etape02Moment: "Sans rien payer",
    etape02Titre: "La démo",
    etape02Court: "L'assistant sur des demandes de votre métier. Rien à préparer.",
    etape02Texte:
      "Nous vous montrons l'assistant sur des demandes de votre métier. Vous n'avez rien à préparer. À la fin, nous fixons avec vous, par écrit, le palier de l'abonnement.",
    etape03Moment: "Deux semaines, sans rien payer",
    etape03Titre: "L'essai",
    etape03Court: "Deux semaines sur vos vraies demandes. Vous lisez, vous validez.",
    etape03Texte:
      "Pendant deux semaines, l'assistant travaille sur vos vraies demandes. Votre part : relire ce qu'il prépare, et dire oui ou non. Chaque lundi, le relevé.",
    etape04Moment: "Si le relevé vous convient",
    etape04Titre: "L'abonnement",
    etape04Court: "La mise en place une seule fois, puis l'abonnement sans engagement.",
    etape04Texte:
      "Vous payez la mise en place, une fois. L'abonnement prend le relais, sans engagement, et nous gardons un œil sur l'assistant chaque semaine.",
    /** Espace final : la flèche `.ar` suit. Mène à (05), où vit le montant. */
    /** Le libellé du bloc qui déplie les quatre textes entiers. */
    detail: "Les 4 étapes en détail",
    cta: "Voir ce que vous payez ",
  },

  /**
   * components/Studio.tsx — (04) Le contrôle, puis qui nous sommes.
   * Les guillemets font partie des chaînes : « » ici, “ ” en anglais.
   */
  studio: {
    section: "Le contrôle",
    /** Le `<h2>` de la section est en `.sr-only` : lu, jamais vu. */
    titreCache: "Le contrôle et le studio",
    citationDebut: "« Il ne s'engage ",
    citationItalique: "jamais",
    citationFin: " à votre place. »",
    /**
     * LA SEULE PHRASE VISIBLE sous la citation (26.10.2026) : la règle et son
     * exception, dite en toutes lettres. Les trois paragraphes suivent dans
     * « Voir le détail ».
     */
    phrase: "Il prépare, vous validez. Seul l'accusé de réception, relu une fois par vous, part seul.",
    detail: "Le contrôle en détail, et qui nous sommes",
    paragraphe1:
      "Aucun prix, aucune date, aucun devis, aucune réponse de fond ne part sans votre accord. Un seul message part seul : l'accusé de réception qui demande l'adresse, une photo et l'urgence. Vous l'avez relu et validé une fois. L'assistant n'a pas accès à vos paiements. Les données de votre assistant sont hébergées en Suisse.",
    paragraphe2:
      "Chaque lundi, vous recevez un relevé court. Il dit ce qui a été traité, relancé et préparé, et ce qui vous attend. S'il ne s'est rien passé, le relevé le dit.",
    paragraphe3:
      "Nawa Corps est un studio genevois. Ayoub Bensalem fait le premier appel, la démo et le suivi. Nous partons d'une base par métier, puis nous la réglons sur votre entreprise. Et vous voyez le travail sur vos propres demandes avant de sortir un franc.",
    /**
     * LE PREMIER FAIT EST BORNÉ À L'ASSISTANT DU CLIENT (revue A tour 2, M2 ;
     * revue de code agent-métier, n°1). « Genève / Données en Suisse » se
     * lisait comme une promesse sur tout le site, que /confidentialite dément
     * (hébergement à Francfort, Leo hors de Suisse).
     */
    faitDonnees: "En Suisse",
    faitDonneesNote: "Données de l'assistant",
    faitReleve: "Lundi",
    faitReleveNote: "Le relevé",
    faitPaiements: "Aucun",
    faitPaiementsNote: "Accès à vos paiements",
    lien: "Voir qui fait le travail →",
  },

  /**
   * components/Offres.tsx — (05) Ce que vous payez, et quand. Trois cartes
   * statiques (démo, essai, mise en place lue en base), puis la grille de
   * l'abonnement (components/GrilleAbonnement.tsx). Chaque montant est suivi
   * de la mention de TVA. Pas de « Recommandé », pas de « dès ».
   */
  offres: {
    section: "L'offre",
    /**
     * « VOUS LE VOYEZ, VOUS L'ESSAYEZ, VOUS PAYEZ APRÈS » (décision d'Ayoub du
     * 25.10.2026, après le comparatif founder/competitors-suisse-2026-10.md) :
     * « connaît votre métier » est désormais dit par plusieurs agences
     * romandes ; démo, essai gratuit sur les vraies demandes et mise en place
     * payée après, personne d'autre ne le propose. C'est donc le titre.
     */
    titreLigne1: "Vous le voyez, vous l'essayez,",
    titreLigne2: "vous payez après.",
    demoTete: "Sur votre métier",
    demoTitre: "La démo",
    demoPaye: "Rien",
    /**
     * LES TEXTES COURTS DES CARTES (26.10.2026, « moins d'info, aussi
     * complet ») : une phrase par carte, pour lire les prix d'un coup d'œil.
     * Les textes entiers (`demoTexte`, `essaiTexte`, `abonnementTexte`) et la
     * note sont rangés dans « Voir le détail », sous la grille.
     */
    demoCourt: "Nous apportons des demandes de votre métier. Vous regardez.",
    essaiCourt: "Il travaille sur vos demandes. Un relevé chaque lundi.",
    abonnementCourt: "La mise en place, puis un abonnement que vous pouvez arrêter chaque mois.",
    detail: "Voir le détail",
    demoTexte:
      "Nous vous montrons l'assistant sur des demandes de votre métier. Vous n'avez rien à sortir de vos classeurs, et nous n'accédons à aucun de vos outils. À la fin, nous mettons par écrit le palier de l'abonnement.",
    /** Espace final : la flèche `.ar` suit. */
    demoCta: "Voir la démo sur mon métier ",
    essaiTete: "Deux semaines, sur vos vraies demandes",
    essaiTitre: "L'essai",
    essaiPaye: "Rien",
    essaiPayeNote: "pendant l'essai",
    essaiTexte:
      "Pendant deux semaines, l'assistant travaille sur vos demandes, et c'est vous qui validez. Deux lundis, donc deux relevés.",
    abonnementTete: "Si le relevé vous convient",
    /**
     * « APRÈS L'ESSAI », PLUS « L'ABONNEMENT » (audit CRO du 25.10.2026,
     * §2.9) : le grand montant posé sous « L'abonnement » se lisait
     * « 1'500.– par mois ». Le titre dit QUAND, et la ligne sous le montant
     * dit « une seule fois » avant de dire quoi.
     */
    abonnementTitre: "Après l'essai",
    /**
     * Gabarit de la ligne sous le montant : `{tva}` vient de lib/format.ts.
     * L'objet avant la mention longue, et « une seule fois » en tête : ce
     * montant n'est jamais mensuel.
     */
    abonnementPayeNote: "une seule fois, la mise en place, {tva}",
    /** Sans ligne en base : la carte se lit sans montant, jamais avec un trou. */
    abonnementPayeSansMontant: "La mise en place, une seule fois, puis un abonnement mensuel selon votre volume.",
    abonnementTexte:
      "Si le relevé vous convient, vous payez la mise en place. L'abonnement suit, selon votre volume. Sans engagement, résiliable chaque mois.",
    /** La note sous la grille, avec et sans montant. */
    note:
      "Commencez par la tâche qui vous prend le plus de soirées. Mise en place {montant}, {tva}, payée une fois, après l'essai. Le palier de l'abonnement se fixe par écrit à la fin de la démo, sans engagement. Réponse le jour ouvrable suivant.",
    noteSansMontant:
      "Commencez par la tâche qui vous prend le plus de soirées. La mise en place se paie une fois, après l'essai. Le palier de l'abonnement se fixe par écrit à la fin de la démo, sans engagement. Réponse le jour ouvrable suivant.",
  },

  /**
   * components/GrilleAbonnement.tsx — les trois paliers, lus en base (nom,
   * description, prix) : ici, seulement les mots autour. La mention de TVA
   * vient de lib/format.ts. Aucun palier mis en avant.
   */
  abonnement: {
    /** Au-dessus de la grille de la section (05). */
    titre: "L'abonnement, selon votre volume",
    tete: "Par mois",
    /** Après la mention de TVA, sur chaque carte. */
    conditions: "sans engagement, résiliable chaque mois",
  },

  /**
   * components/Faq.tsx — (06) Questions. Neuf objections, dans l'ordre du
   * panel (revue A tour 2, m1) : la confiance d'abord. Depuis le 26.10.2026,
   * le prix est la cinquième et dernière question visible ; les quatre autres
   * sont dans « Autres questions » (l'ordre est fixé dans Faq.tsx).
   * « Et s'il se trompe ? » et « Je ne trouve personne pour le bureau. »
   * s'y sont ajoutées le 25.10.2026 (audit CRO §2.10) : la peur derrière
   * « je ne veux pas d'IA », et la pénurie d'embauche.
   *
   * Elles alimentent AUSSI le JSON-LD `FAQPage` : une seule liste, deux
   * sorties. La réponse sur le prix porte donc le montant ET la mention de TVA
   * dans la même phrase, puisqu'elle est republiée hors de la page.
   * LES QUESTIONS SONT DITES PAR LE VISITEUR (« je »), LES RÉPONSES PAR LE
   * STUDIO (« nous »).
   */
  faq: {
    section: "Questions",
    titreCache: "Questions fréquentes",
    /** Le libellé du bloc qui range les quatre dernières questions. */
    autres: "Autres questions",
    /**
     * « COMMENT SAVOIR SI ÇA MARCHE CHEZ MOI ? » remplace « Vous avez des
     * références ? » (décision d'Ayoub du 25.10.2026) : la réponse est la
     * méthode, vérifiable par le patron lui-même. Elle n'affirme aucun client,
     * aucun chiffre — LCD art. 3.
     */
    questionPreuve: "Comment savoir si ça marche chez moi ?",
    reponsePreuve:
      "Vous jugez sur pièces avant de payer. La démo se fait sur des demandes de votre métier. L'essai tourne ensuite deux semaines sur vos vraies demandes, et le relevé du lundi montre ce qui a été traité, relancé et préparé. Vous ne payez la mise en place que si ce relevé vous convient.",
    questionDonnees: "Et mes données ?",
    reponseDonnees:
      "Les données de votre assistant sont hébergées en Suisse, sous la loi suisse sur la protection des données (nLPD). Pour la démo, vous n'avez rien à nous transmettre et nous n'accédons à aucun de vos outils. Pendant l'essai, l'assistant ne travaille que sur les demandes que vous lui confiez. Il n'a pas accès à vos paiements.",
    questionIa: "Une IA qui écrit à mes clients, je n'en veux pas.",
    reponseIa:
      "Vous avez raison de garder la main. Un seul message part sans vous : l'accusé de réception qui demande l'adresse, une photo et l'urgence, et vous le validez une fois. Ensuite, aucune réponse de fond, aucun devis, aucun prix ne part sans votre accord. Il ne s'engage jamais à votre place.",
    /** Vrai d'après le contrôle affiché : rien de fond ne part sans le patron. */
    questionErreur: "Et s'il se trompe ?",
    reponseErreur:
      "Ça arrivera. C'est pour ça que vous relisez : une erreur dans une réponse, un devis ou un prix, vous la corrigez avant l'envoi. Seul l'accusé de réception part seul, et celui-là, vous l'avez relu une fois.",
    questionBesoin: "Mon travail vient du bouche-à-oreille. Pourquoi un assistant ?",
    reponseBesoin:
      "Il ne vous amène pas de clients. Il reprend la paperasse du soir : les demandes reçues pendant la journée, les devis à préparer, les relances. Si vous n'avez pas de paperasse le soir, vous n'en avez pas besoin. Nous vous le dirons dès le premier appel.",
    /** Jamais « remplace votre secrétaire » (vocabulaire interdit, PM §8). */
    questionPersonne: "Je ne trouve personne pour le bureau.",
    reponsePersonne:
      "L'assistant ne remplace pas une personne, et une secrétaire reste parfois le bon choix. Il reprend la partie du bureau du soir qui revient chaque semaine. Commencez par la tâche qui vous prend le plus de soirées ; les autres suivent, selon votre palier.",
    questionOutils: "J'ai déjà WhatsApp et un logiciel de devis.",
    reponseOutils:
      "Pour la démo, vous ne changez rien : nous vous montrons l'assistant sur des demandes de votre métier, telles qu'elles arrivent par WhatsApp, par e-mail ou au téléphone. Ce que l'assistant peut lire dans vos outils se vérifie outil par outil, avec vous. Nous ne vous promettons pas un branchement avant de l'avoir testé.",
    questionTemps: "Je n'ai pas le temps pour ça.",
    reponseTemps:
      "Le premier appel est court. La démo ne vous demande rien. Pendant l'essai, vous lisez ce que l'assistant a préparé et vous validez. Au bout du compte, c'est moins de paperasse le soir, pas plus.",
    questionPrix: "Combien ça coûte ?",
    /**
     * LA RÉPONSE SUR LE PRIX EN TROIS MORCEAUX, assemblés par Faq.tsx selon ce
     * que la base contient : chaque montant avec sa mention, jamais un trou.
     * `{montant}`, `{paliers}` et `{tva}` sont remplis par le composant.
     */
    prixDebut: "La démo et les deux semaines d'essai ne coûtent rien.",
    prixMiseEnPlace:
      "La mise en place coûte {montant}, {tva}, une seule fois, après l'essai, si le relevé vous convient.",
    prixMiseEnPlaceSansMontant:
      "La mise en place se paie une seule fois, après l'essai, si le relevé vous convient.",
    prixAbonnement:
      "Puis l'abonnement mensuel, parce que nous suivons l'assistant chaque semaine : {paliers}, {tva}. Sans engagement, résiliable chaque mois.",
    prixAbonnementSansMontant:
      "Puis l'abonnement mensuel, parce que nous suivons l'assistant chaque semaine : selon votre volume, sans engagement, résiliable chaque mois.",
    /** Espace final : la flèche `.ar` suit. */
    ctaDevis: "Voir la démo sur mon métier ",
    ctaDetail: "Voir l'assistant en détail",
    /**
     * La ligne sous la FAQ, vers le guide de référence (/guides, en français
     * seulement). Espace final signifiant : le lien suit.
     */
    lienGuideDebut: "Pour aller plus loin : ",
    lienGuide: "le guide de l'automatisation par l'IA dans une PME genevoise",
    /**
     * Le second lien de la meme ligne (audit SEO v5) : le comparatif
     * assistant/secretaire n etait lie que depuis /guides et les autres
     * guides. Sa place est ici, sous la question « Je ne trouve personne ».
     */
    lienGuideSecretaire: "assistant IA ou secrétaire, le comparatif",
  },
};

/**
 * LA FORME DU DICTIONNAIRE, déduite du français. C'est ce type que `en.ts`
 * s'engage à remplir en entier.
 */
export type Dictionnaire = typeof fr;

export default fr;
