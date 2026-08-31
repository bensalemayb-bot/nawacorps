import type { Dictionnaire } from "@/lib/dictionnaires/fr";

/**
 * DICTIONNAIRE ANGLAIS — le chrome partagé.
 *
 * `const en: Dictionnaire` EST LE GARDE-FOU, et c'est toute la raison d'être
 * de cette annotation. TypeScript refuse alors :
 *  - une clé MANQUANTE — la traduction oubliée casse `npm run typecheck` au
 *    lieu de laisser du français apparaître sur la page anglaise ;
 *  - une clé EN TROP — la faute de frappe (`studo`) ne produit plus une
 *    propriété fantôme que personne ne lit jamais.
 * Ne remplacez pas cette annotation par `satisfies` : `satisfies` laisserait
 * passer les clés en trop.
 *
 * ÉTAT DE CETTE TRADUCTION. Le chrome — navigation, menu, pied de page,
 * formulaire — puis LES NEUF SECTIONS DE L'ACCUEIL, qui sont, elles, de la
 * copie de vente et pas des libellés d'interface.
 *
 * LES RÈGLES D'ÉCRITURE SONT CELLES DE docs/agents/brand/glossaire-anglais.md,
 * et elles sont contraignantes. Les cinq qu'on enfreint par réflexe :
 *
 *  1. `I`, `me`, `my`. JAMAIS `we`, `our`, `our team`, `the agency` — le
 *     studio est une personne, et l'anglais commercial met « we » partout.
 *  2. Anglais BRITANNIQUE : `enquiry`, jamais `inquiry`. `organisation`,
 *     `personalise`, `colour`.
 *  3. Les noms des trois formules NE SE TRADUISENT PAS : `La Vitrine`,
 *     `Le Site`, `L'Assistant`, article compris. Ils viennent de la base
 *     (`nameEn = null` volontairement) ; quand une puce les cite, elle les
 *     écrit tels quels.
 *  4. Aucun prix sans « VAT included » DANS LA MÊME UNITÉ DE LECTURE, et les
 *     montants gardent leur format suisse — `699.–`, `1'499.–`. Ni `CHF`,
 *     ni `€`. La mention vient de `mentionTva()`, elle n'est jamais recopiée.
 *  5. Aucun délai en heures. Seul `one week`, et jamais seul : la même unité
 *     de lecture porte `from your go-ahead` ou ce qui est livré.
 *
 * ET DEUX MOTS QUE LE §7 DU GLOSSAIRE A RENVERSÉS : « formule » se dit
 * `package` (et non `option`), « suivi » se dit `upkeep` partout où un humain
 * lit — `maintenance` n'est admis que dans un `serviceType` JSON-LD.
 *
 * LES BUDGETS DE PLACE DU HERO S'APPLIQUENT ICI COMME EN FRANÇAIS : trois
 * lignes de `h1` à 21 signes au plus, un sous-titre qui tient en deux lignes
 * rendues, une phrase de temps 2 sous 83 signes. Voir le docblock de `hero`
 * dans fr.ts : les chiffres y sont, et ils ont été mesurés à l'écran.
 *
 * TROIS ENTRÉES DU PIED DE PAGE RESTENT À RELIRE par l'agent qui tient
 * `components/FooterContact.tsx` : `pied.titreLigne1` / `titreLigne2*`,
 * `pied.slogan` et `pied.resume`. Elles sont conformes au glossaire, mais le
 * pied de page n'appartient pas au chantier de l'accueil.
 */
const en: Dictionnaire = {
  nav: {
    accueil: "Nawa Corps — home",
    /** La marque ne se traduit pas. */
    logoAlt: "Nawa Corps",
    horlogeVille: "Geneva",
    demonstrations: "Demonstrations",
    services: "Services",
    tousLesServices: "All services",
    studio: "The studio",
    contact: "Contact",
    devis: "Rebuild my site",
    ouvrirMenu: "Open the menu",
  },

  menu: {
    demonstrations: "Demonstrations",
    services: "Services",
    studio: "The studio",
    contact: "Contact",
    whatsapp: "WhatsApp",
    lieu: "Geneva, Switzerland",
  },

  langue: {
    section: "Language",
  },

  pied: {
    section: "Contact",
    /**
     * À RELIRE PAR L'AGENT DE VOIX. Le titre français est une invitation en
     * deux temps — « montrez », puis « je vous dis ». Le calque ci-dessous
     * garde la structure et le découpage exigé par le markup, mais le choix
     * des mots est une décision de voix qui n'a pas encore été prise.
     * L'ESPACE FINAL de `titreLigne2Debut` doit rester : il sépare le romain
     * de l'italique.
     */
    titreLigne1: "Show me what you have.",
    titreLigne2Debut: "I'll tell you ",
    titreLigne2Italique: "what's missing.",
    ecrireWhatsapp: "Message me on WhatsApp",
    ouParEcrit: "or tell me in two lines what you need",
    lieu: "Geneva, Switzerland",
    /** Jours abrégés et horloge de 12 h : c'est la convention anglophone. */
    horaires: "Mon–Sat · 9am–7pm",
    copyright: "© 2026 Nawa Corps",
    /** À RELIRE PAR L'AGENT DE VOIX — c'est le slogan de la marque. */
    slogan: "The essentials. Well made.",
    metier: "Digital design studio — Geneva",
    /** À RELIRE PAR L'AGENT DE VOIX — c'est le résumé du catalogue. */
    resume: "Websites · Identity · Print · Social media",
    mentionsLegales: "Legal notice",
    confidentialite: "Privacy",
  },

  formulaire: {
    nom: "Your name",
    telephone: "Your phone number",
    email: "Your email",
    message: "What you need, and your current site if you have one",
    messageLabel: "Your message",
    leurre: "Do not fill in this field",
    envoyer: "Send my request",
    envoiEnCours: "Sending…",
    erreurContact: "Enter a phone number or an email address.",
    /** Comme en français : un fait vérifiable, et aucun délai de réponse. */
    succes: "Message received — it lands straight on my phone.",
    erreurEnvoi: "Sending failed for now. Write to me on WhatsApp in the meantime.",
    erreurReseau: "Connection lost. Write to me on WhatsApp in the meantime.",
  },

  /**
   * LE HERO — et les trois budgets de place tenus, décomptés ici pour qu'un
   * relecteur n'ait pas à les recompter :
   *
   *  - `h1Ligne1` 16 signes, `h1Ligne2` 15, la ligne 3 recollée 16. Le plafond
   *    est 21 (français : 15 / 16 / 19). Il y a EXACTEMENT trois lignes, parce
   *    que le CSS les révèle par `:nth-child(1|2|3)`.
   *  - `sousTitre` 60 signes ; avec le fragment de prix (« From 699.–, VAT
   *    included. », 26 signes) la phrase rendue en fait 86, contre 87 en
   *    français. Deux lignes, donc `hero-foot` reste au-dessus du pli.
   *  - la phrase du temps 2 recollée fait 70 signes, contre 75 en français, et
   *    tient dans les cinq lignes que `.noyau-say` autorise.
   *
   * `grandMot` FAIT TROIS GLYPHES, contre quatre en français : `.noyau-num`
   * est dessiné pour un seul mot court, et « Everything » y serait illisible
   * sur un téléphone. Le sens complet est porté par `grandMotUnite`, comme en
   * français — « All / from one pair of hands ».
   */
  hero: {
    kickerMetier: "Digital design studio",
    kickerLieu: "Geneva, Switzerland",
    /** Glossaire §3 : « PME » se dit `small business`, jamais `SME` ni `SMB`. */
    kickerCible: "For small businesses",
    h1Ligne1: "Websites, print,",
    /** `social` abrège `social media` comme `réseaux` abrège `réseaux sociaux`. */
    h1Ligne2: "photos, social.",
    h1Ligne3Debut: "Just one ",
    h1Ligne3Italique: "person",
    h1Ligne3Fin: ".",
    /**
     * « one week » ET « you have nothing to prepare » DANS LA MÊME PHRASE :
     * c'est la règle §5, et c'est aussi l'ordre du guide de voix — le délai
     * d'abord parce qu'il est concret, le bénéfice tout de suite après parce
     * que c'est lui qui décide.
     */
    sousTitre: "Your site rebuilt in one week — you have nothing to prepare.",
    sousTitrePrixDes: "From",
    /** Espace final : la flèche `.ar` suit immédiatement. */
    ctaPrincipal: "Have my site rebuilt ",
    ctaSecondaire: "See the demonstrations",
    defiler: "Scroll",

    temps2Section: "The core",
    phraseDebut: "The site, the logo, the cards, the photos. You say yes, ",
    phraseItalique: "I do the rest",
    phraseFin: ".",

    temps3Section: "The heart",
    grandMot: "All",
    grandMotUnite: "from one pair of hands",
    specAtelier: "Workshop",
    specAtelierValeur: "Geneva",
    specSite: "The site",
    /** « one week » porte ici ce qui est livré : la ligne est son unité de lecture. */
    specSiteValeur: "Delivered in one week",
    specReste: "The rest",
    specResteValeur: "Logo, cards, posters, photos",
    specTextes: "Your text",
    specTextesValeur: "Taken from your site",
    /** Glossaire §3 : `upkeep`, jamais `maintenance` ni `support`. */
    specSuivi: "Upkeep",
    specSuiviValeur: "From the second year",

    sortie: "Your site is not there to be looked at. It works, or it is no use.",
    /** Espace final : la flèche `.ar` suit. */
    sortieCtaPrincipal: "See the demonstrations ",
    sortieCtaSecondaire: "Ask for a quote",
  },

  /**
   * `delai` PORTE SON POINT DE DÉPART — ET LE FRANÇAIS, LUI, NE LE PORTE PAS.
   *
   * C'est le seul endroit du site où les deux langues ne disent pas la même
   * chose, et ce n'est pas une liberté de traduction : la vignette française
   * dit « Une semaine » toute seule depuis avant le chantier anglais, et la
   * corriger aurait changé le HTML de la page française — ce que ce chantier
   * n'avait pas le droit de faire. L'anglais, lui, s'écrit pour la première
   * fois : il naît conforme au §5 du glossaire, qui interdit un délai qui
   * voyage sans son point de départ ni ce qui est livré.
   *
   * NE PAS « ALIGNER » L'ANGLAIS SUR LE FRANÇAIS pour faire disparaître
   * l'écart : c'est le français qu'il faut corriger, et c'est signalé dans
   * `fr.ts` au même endroit.
   */
  strip: {
    refonte: "Site rebuild",
    devis: "Quote enquiry",
    /** Glossaire §6 : `online appointments`, jamais `online booking`. */
    rendezVous: "Online appointments",
    /** Glossaire §3 : `Google listing`, jamais `Google My Business`. */
    ficheGoogle: "Google listing",
    delai: "One week from your go-ahead",
    lieu: "Geneva",
  },

  travaux: {
    section: "Work",
    titreLigne1: "Everything has a before.",
    titreLigne2: "Here is the after.",
    /** Glossaire §3 : `demonstration`, jamais `case study` ni `portfolio`. */
    lede: "Five demonstrations from the studio — drag the handle on each piece to compare the before and the after.",
    lien: "See all the demonstrations →",
  },

  services: {
    section: "Services",
    titreLigne1: "Six kinds of work,",
    /**
     * « the same hands » DIT CE QUE DIT LE FRANÇAIS SANS REPRENDRE LE MOT DE
     * QUELQU'UN D'AUTRE : `single point of contact` est interdit par le
     * glossaire §4, en anglais comme en français.
     */
    titreLigne2: "the same hands.",
    titre01: "Site rebuild",
    corps01:
      "Your current site, taken over and rebuilt: one page, readable on a phone, fast, up to date. The existing text is recovered and rewritten — you point out what has changed since. One week from your go-ahead, two rounds of corrections included; the finished site is shown to you and approved before it goes live. It is the entry product, and the one that carries all the rest: the form, the appointments, the Google listing and the assistant all plug into it.",
    lien01: "See the three packages →",
    titre02: "Quotes and appointments straight from the site",
    corps02:
      "A form that asks the right questions — the job, the surface area, the timing, the address — and reaches you filled in rather than in three vague lines. On the packages that include them, the visitor leaves with a figure and books their own appointment, at 11 at night or on a Sunday. What lands with you is no longer a “call me back”: it is an enquiry you can price without picking up the phone three times.",
    lien02: "See Le Site →",
    titre03: "An AI assistant that answers in your place",
    corps03:
      "An assistant trained on your services and your prices answers the usual questions day and night, takes down the name and the number, and alerts you on your phone. Enquiries left unanswered are followed up on their own, and everything that comes in lines up in a dashboard. It runs on this site: the bubble at the bottom of the screen is it — open it, that is the demonstration.",
    lien03: "See L'Assistant →",
    titre04: "Logo, print and photos",
    corps04:
      "A logotype if you do not have one, a palette and typefaces that hold from the site to the vehicles, and the rules that say what goes where. Then what your customers keep in hand: business cards, 85 × 55, both sides, posters, window stickers. The photographs of your business are taken on site, on a day when you are working — there is nothing to stage. These lines are priced on request: a print run, a size and a paper cannot be guessed.",
    lien04: "See the logo and the photos →",
    titre05: "Google listing and social media",
    corps05:
      "Your Google listing completed: photos, exact opening hours, the area you cover, replies to reviews. It is what your future customers see before your site, and often instead of it. Social media is taken on whole — you are shown the month's calendar, you approve it, and it goes out: visuals, wording, posting and replies to messages. The production is done with a partner of the studio, and the work is handed back to you by me. On request.",
    lien05: "See social media →",
    titre06: "Restaurants and cafés",
    corps06:
      "For cafés and restaurants: the menu reworked in full — the order of the sections, how legible the prices are, where the compulsory notices go — with its print files, its online version and its QR code. Then what holds the room: table tents, loyalty card, gift vouchers and seasonal pieces. A line of its own, kept up since the start, and open to anyone without a site of mine. On request.",
    lien06: "See the restaurant line →",
  },

  /**
   * LES QUATRE JALONS SONT DES MOMENTS DE LA SEMAINE, jamais des heures ni des
   * jours numérotés : `Beforehand`, `Early in the week`, `End of the week`,
   * `Afterwards`. « Day 7 » serait un compte de jours déguisé en étape.
   *
   * `etape01Texte` N'A PAS DE SUJET, ET C'EST VOULU. Le français dit « on
   * regarde ensemble » ; l'anglais rendrait ce « on » par `we`, que le
   * glossaire §2 interdit sans distinguer le « nous » du studio du « vous et
   * moi ». La phrase se passe donc de pronom.
   */
  methode: {
    section: "Method",
    titreLigne1: "From your go-ahead to",
    titreLigne2: "going live: one week.",
    etape01Moment: "Beforehand",
    etape01Titre: "Taking stock",
    etape01Texte:
      "A look at what you show today: your site, your print, your Google listing. What is missing, what gets in the way, what your customers cannot find. At your place or over the phone.",
    etape02Moment: "Early in the week",
    etape02Titre: "The mock-up",
    etape02Texte:
      "You see the before and after early in the week. You approve it or I adjust it — two rounds of corrections are included.",
    etape03Moment: "End of the week",
    etape03Titre: "Going live",
    etape03Texte:
      "Domain, hosting, form, appointments: everything is plugged in. You install nothing, you configure nothing.",
    etape04Moment: "Afterwards",
    etape04Titre: "The upkeep",
    /** Glossaire §7 : « la rentrée » se dit par son moment, `September comes round`. */
    etape04Texte:
      "A price changes, a service is added, an opening time moves? You write to me, and I am the one who puts it right. A poster for when September comes round, cards to reprint: you write to me for those too. In the second year, it is still the same person.",
    /** Espace final : la flèche `.ar` suit. */
    cta: "See the packages and prices ",
  },

  /**
   * LES GUILLEMETS CHANGENT DE FORME AVEC LA LANGUE : « » en français, “ ” en
   * anglais, et sans les espaces intérieures du français.
   */
  studio: {
    section: "The studio",
    titreCache: "The studio",
    citationDebut: "“You speak to the person who ",
    citationItalique: "does",
    citationFin: " the work.”",
    paragraphe1:
      "Nawa Corps is the digital design studio of Ayoub Bensalem, designer and developer in Geneva. No sales staff, no account manager, no brief passed from hand to hand: the person who answers your message is the one who draws your logotype, codes your site and photographs your workshop.",
    paragraphe2:
      "What that changes shows up in practice. The work starts at your go-ahead, not when your text arrives. The finished site is shown to you and approved before it goes live. Two rounds of corrections are included, and they are written down — a job with a boundary is a job that gets kept.",
    paragraphe3:
      "No offices, no sales team: your site is drawn and built by the same person, and you deal with that person from the first message to delivery. It is still that person the following year, when a price changes, when a poster is needed for when September comes round, or when a form has to ask one more question.",
    faitLieu: "Geneva",
    faitLieuNote: "Based here",
    faitDelai: "One week",
    faitDelaiNote: "Rebuild delivered",
    faitLangues: "FR / EN",
    faitLanguesNote: "Languages",
    lien: "See who does the work →",
  },

  /**
   * `package` ET NON `option` : le §7 du glossaire a renversé le §6. En
   * anglais ce sont `plan` et `tier` qui sentent l'abonnement logiciel ;
   * `package` est l'usage normal d'un studio de création britannique.
   *
   * LA RÈGLE QUI PASSE PAR-DESSUS : quand la phrase le permet, on NOMME la
   * formule plutôt que la catégorie. D'où « Everything in La Vitrine, plus: »
   * et « compulsory with L'Assistant », que la note sous la grille recolle
   * autour du nom lu en base.
   */
  offres: {
    section: "Packages",
    titreLigne1: "Clear prices,",
    titreLigne2: "all included.",
    recommande: "Recommended",
    vitrinePuce1: "One page, readable on a phone",
    /** Glossaire §3 : `an enquiry`, jamais `a lead` ni `an inquiry`. */
    vitrinePuce2: "An enquiry form that works",
    vitrinePuce3: "Call, directions and opening hours in one tap",
    vitrinePuce4: "Domain and hosting for the first year",
    vitrineCta: "Make my site presentable",
    sitePuce1: "Everything in La Vitrine, plus:",
    sitePuce2: "Online appointments",
    /** Glossaire §3 : `a priced quote`, jamais `instant estimate`. */
    sitePuce3: "A priced quote, worked out automatically",
    sitePuce4: "Google listing and photos included",
    siteCta: "Receive my enquiries",
    assistantPuce1: "Everything in Le Site, plus:",
    assistantPuce2: "The assistant from this site, on yours",
    assistantPuce3: "An alert on your phone for every enquiry",
    assistantPuce4: "Automatic follow-up and a dashboard",
    assistantCta: "Automate my enquiries",
    suiviAssistantAvant: "then ",
    suiviAssistantApres:
      " from the second year — compulsory, the assistant runs non-stop",
    noteSuiviAvant: "Upkeep and hosting from ",
    noteSuiviApres: ", starting in the second year",
    noteSuiviAssistantAvant: " compulsory with ",
    notePrix: "Prices in Swiss francs",
    noteCorrections: "Two rounds of corrections included.",
    ctaDevis: "Ask for a quote →",
  },

  carte: {
    titreDebut: "Everything ",
    titreItalique: "the studio makes",
    lede: "The site is the entry product; it is not the only workbench. What gets printed and what gets published every week come first: those are the two the studio puts in the window next to the packages. The rest follows, whole, and can be ordered with a site of mine or without — restaurant pieces included.",
    rang: "Also in the workshop",
    rangDescription:
      "Logo and photos, site hosting, restaurants and cafés: three full pages, which keep their price and their quote. They come after, not cut-price.",
    devisCompteMilieu: " lines carry a firm price, ",
    /** Glossaire §3 : « sur devis » se dit `on request`, jamais `on quote`. */
    devisCompteFin: " are priced on request.",
    notePrix: "Prices in Swiss francs",
    ctaDevis: "Ask for a quote →",
    voirLeDetail: "See the detail",
  },

  faq: {
    section: "Questions",
    titreCache: "Frequently asked questions",
    question1: "One week, really?",
    reponse1:
      "Yes, and it is the same week whether you already have a site or not. I take your text, I redo the layout, I plug in the form and the appointments. The clock starts at your go-ahead, not once you have sent me something: you have nothing to prepare.",
    question2: "I have no text and no photos. Is that a problem?",
    reponse2:
      "No, and it is included in the price. If a site exists, I take what is on it and rewrite it; you tell me what has changed. If not, I propose a mock-up with the wording already written, and you correct it. Photographs of your business are part of Le Site and L'Assistant.",
    question3: "Who looks after the hosting and the domain name?",
    reponse3Avant:
      "Me. The domain name and the hosting for the first year are included in all three packages. ",
    reponse3Apres: " The domain name stays in your name: it belongs to you.",
    tarifsAvant: "After that, ",
    tarifsMilieu: " for hosting, updates and backups — ",
    tarifsApres:
      " if your site has the assistant, which runs non-stop, and it is then compulsory. Both amounts are quoted ",
    tarifsSansMontant:
      "After that the monthly upkeep takes over: hosting, updates and backups — and the assistant when your site has one, in which case the upkeep is compulsory.",
    question4: "And afterwards, if I need something else?",
    reponse4:
      "Two rounds of corrections are included during the design. Once you are live, a message is enough: a price that moves, a service that is added, an opening time that changes. Content changes are included in the upkeep of L'Assistant; on the other two packages they are charged as they come. And you are not limited to the site: logotype, business cards, poster, photographs of your business, Google listing, social media, restaurant pieces — on request, with a site of mine or without.",
    question5: "At that price, what is not done?",
    reponse5:
      "One page, not ten. Two rounds of corrections, not three. Your text is taken from your current site and rewritten, not written from scratch. There are no offices and no sales team: your site is drawn and built by the same person, the one you are speaking to, and it is still that person who answers the following year.",
    /** Espace final : la flèche `.ar` suit. */
    ctaDevis: "Ask for a quote ",
    ctaFormules: "See the packages",
  },
};

export default en;
