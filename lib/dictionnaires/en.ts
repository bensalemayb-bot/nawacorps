import { SOURCES_CHIFFRES } from "@/lib/chiffres";
import type { Dictionnaire } from "@/lib/dictionnaires/fr";

/**
 * DICTIONNAIRE ANGLAIS — le miroir de fr.ts, clé pour clé.
 *
 * `const en: Dictionnaire` EST LE GARDE-FOU : TypeScript refuse une clé
 * manquante comme une clé en trop. Ne la remplacez pas par `satisfies`, qui
 * laisserait passer les clés en trop.
 *
 * RÈGLES D'ÉCRITURE (docs/agents/brand/glossaire-anglais.md) :
 *  1. `we`, `us`, `our` pour le studio, sans jamais d'effectif, d'équipe, de
 *     bureaux ni d'ancienneté. Un `my` subsiste quand c'est le VISITEUR qui
 *     parle (libellés de CTA, questions de la FAQ).
 *  2. Anglais BRITANNIQUE : `enquiry`, jamais `inquiry`.
 *  3. « PME » se dit `small business`, jamais `SME` ni `SMB`.
 *  4. Aucun montant sans la mention de TVA (lib/format.ts) dans la même unité de lecture ; le
 *     montant garde son format suisse (`1'500.–`). Les gabarits portent
 *     `{montant}` et `{tva}`, remplis par `avecPrix()` (lib/catalogue.ts).
 *  5. Aucun délai en heures. Seule durée écrite : l'essai, deux semaines
 *     (décision d'Ayoub du 25.10.2026).
 *
 * LES BUDGETS DE PLACE DU HERO s'appliquent comme en français (voir le
 * docblock de `hero` dans fr.ts) : `h1Debut` 11 signes (le noyau couvre la
 * fin d'une première ligne plus longue, cf. fr.ts), fins de rotation 17, 19,
 * 19 et 18 ; sous-titre 87 signes ; phrase du temps 2 : 80 signes, sous 83.
 */
const en: Dictionnaire = {
  nav: {
    accueil: "Nawa Corps — home",
    logoAlt: "Nawa Corps",
    horlogeVille: "Geneva",
    services: "The offer",
    metiers: "Trades",
    demonstrations: "Demos",
    studio: "The studio",
    contact: "Contact",
    devis: "Get my demo",
    ouvrirMenu: "Open the menu",
  },

  menu: {
    services: "The offer",
    metiers: "Trades",
    demonstrations: "Demos",
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
    /** L'ESPACE FINAL de `titreLigne2Debut` sépare le romain de l'italique. */
    titreLigne1: "See it on your trade.",
    titreLigne2Debut: "We'll show you ",
    titreLigne2Italique: "the assistant at work.",
    ecrireWhatsapp: "Message us on WhatsApp",
    ouParEcritDebut: "or ",
    ouParEcritAppel: "message us on WhatsApp",
    ouParEcritFin: ", or tell us in two lines what takes up your evenings",
    metiers: "Trades",
    /** /guides exists in French only: the label says so. */
    guides: "Guides (in French)",
    lieu: "Geneva, Switzerland",
    /** Jours abrégés et horloge de 12 h : la convention anglophone. */
    horaires: "Mon–Sat · 9am–7pm",
    copyright: "© 2026 Nawa Corps",
    metier: "Geneva studio · AI assistant for small businesses",
    resume: "You approve. It handles the rest.",
    mentionsLegales: "Legal notice",
    confidentialite: "Privacy",
    cgv: "Terms",
    liensLegaux: "Legal information",
    cookies: "Cookies",
  },

  cookies: {
    texte:
      "This site only uses the storage it needs to work: no advertising tracking, no audience measurement.",
    enSavoirPlus: "Read the details",
    compris: "Got it",
    region: "Cookie information",
  },

  formulaire: {
    nom: "Your name *",
    telephone: "Your phone number",
    email: "Your email",
    labelNom: "Your name (required)",
    labelTelephone: "Your phone number (phone or email required)",
    labelEmail: "Your email (phone or email required)",
    message: "Your trade, and what takes up your evenings",
    messageLabel: "Your message",
    leurre: "Do not fill in this field",
    envoyer: "Get my demo",
    envoiEnCours: "Sending…",
    erreurContact: "Enter a phone number or an email address.",
    /** Comme en français : un fait vérifiable, et aucun délai de réponse. */
    succes: "Message received. It lands straight on our phone.",
    erreurEnvoi: "Sending failed for now. Write to us on WhatsApp in the meantime.",
    erreurReseau: "Connection lost. Write to us on WhatsApp in the meantime.",
    mentionRequis: "* Name required, plus a phone number or an email address.",
    mentionDebut: "This data is only used to reply to you and arrange the demo. ",
    mentionLien: "Privacy",
  },

  hero: {
    kickerMetier: "Geneva studio",
    kickerCible: "AI assistant for small businesses",
    h1Debut: "The AI that",
    h1Rotation: [
      "knows your trade.",
      "preps the paperwork.",
      "chases your quotes.",
      "waits for your OK.",
    ],
    h1Complet:
      "The AI that knows your trade, preps the paperwork, chases your quotes and waits for your OK.",
    sousTitre:
      "No one for the office? An AI set to your trade preps the evening paperwork. You approve.",
    ctaPrincipal: "See the demo on my trade ",
    ctaSecondaire: "How it works",
    defiler: "Scroll",

    temps2Section: "What it costs you",
    douleurDebut: "You're losing ",
    douleurs: ["time.", "clients.", "your evenings.", "quotes."],
    douleurFin: "",
    reponse: "The assistant prepares, you have the final say.",
    douleurComplet:
      "You're losing time, clients, your evenings, quotes. The assistant prepares, you have the final say.",

    temps3Section: "The demo",
    grandMot: "Nothing",
    grandMotUnite: "to pay before the trial",
    specDonnees: "The assistant's data",
    specDonneesValeur: "In Switzerland",
    specOutils: "Your tools",
    specOutilsValeur: "No access for the demo",
    specDevis: "Prices and quotes",
    specDevisValeur: "Approved by you",
    specReleve: "The report",
    specReleveValeur: "Every Monday",
    specMiseEnPlace: "Set-up",
    specMiseEnPlaceValeur: "{montant} {tva}",
    specMiseEnPlaceValeurSansMontant: "Paid after the trial",

    sortie: "You approve. It handles the rest.",
    sortieCtaPrincipal: "See the demo on my trade ",
    sortieCtaSecondaire: "Message us on WhatsApp",
  },

  strip: {
    devis: "Quotes left sleeping",
    chantier: "The day's enquiries",
    paperasse: "The evening paperwork",
    jamais: "Never on your behalf",
    releve: "The Monday report",
    lieu: "Geneva",
  },

  chiffres: {
    section: "The figures",
    titreLigne1: "What the studies",
    titreLigne2: "measure.",
    lede: "Published studies, not our clients. Every figure links to its source.",
    source: "Source: ",
    detail: "Two more figures",
    items: [
      {
        contexte: "Small businesses · Geneva",
        valeur: "54%",
        texte: "of the Geneva small businesses surveyed already use AI, in one form or another.",
        source: "PwC Switzerland for the State of Geneva, 2024",
        perimetre: "more than 200 Geneva small businesses",
        url: SOURCES_CHIFFRES.geneve,
      },
      {
        contexte: "Companies · Switzerland",
        valeur: "60%",
        texte:
          "of the Swiss companies surveyed rate the administrative burden placed on them by regulation as high or fairly high.",
        source: "SECO, Bureaucracy Monitor 2023",
        perimetre: "regulatory burden, more than 1,500 companies",
        url: SOURCES_CHIFFRES.seco,
      },
      {
        contexte: "Writing",
        valeur: "−40%",
        texte:
          "time, roughly, to write professional documents with AI, with quality rated 18% higher.",
        source: "Noy & Zhang, Science, 2023",
        perimetre: "MIT experiment, 453 professionals",
        url: SOURCES_CHIFFRES.noyZhang,
      },
      {
        contexte: "Building trades · France",
        valeur: "48%",
        texte:
          "of building trades owners regularly work weekends, and 63% check their email every day on holiday.",
        source: "CAPEB, ARTIsanté survey 2026",
        perimetre: "2,491 building trades owners, France",
        url: SOURCES_CHIFFRES.capeb,
      },
      {
        contexte: "Customer service",
        valeur: "+14%",
        texte:
          "more customer issues resolved per hour with an AI assistant, and +34% for the least experienced.",
        source: "Brynjolfsson et al., NBER 2023 / QJE 2025",
        perimetre: "5,179 customer support agents",
        url: SOURCES_CHIFFRES.brynjolfsson,
      },
    ],
    cloture:
      "These are study averages, not our results. Your own figure is the one you'll read in the Monday report, on your own enquiries.",
  },

  services: {
    section: "By trade",
    titreLigne1: "It speaks",
    titreLigne2: "your trade.",
    peut: "What the assistant can do: ",
    lienMetier: "The assistant for this trade, in detail →",
    tous: "All trades →",
    ordre: "Your trade isn't there? Write to us anyway: the demo runs on enquiries from your trade either way.",
  },

  methode: {
    section: "How it works",
    titreLigne1: "Your enquiries first,",
    titreLigne2: "your signature after.",
    etape01Moment: "First",
    etape01Titre: "The call",
    etape01Court: "A short call about what takes up your evenings.",
    etape01Texte:
      "A short call. You tell us what takes up your evenings. We sell you nothing that day.",
    etape02Moment: "Free of charge",
    etape02Titre: "The demo",
    etape02Court: "The assistant on enquiries from your trade. Nothing to prepare.",
    etape02Texte:
      "We show you the assistant on enquiries from your trade. You have nothing to prepare. At the end, we set the subscription tier with you, in writing.",
    etape03Moment: "Two weeks, free of charge",
    etape03Titre: "The trial",
    etape03Court: "Two weeks on your real enquiries. You read, you approve.",
    etape03Texte:
      "For two weeks, the assistant works on your real enquiries. Your part: read what it prepares, and say yes or no. Every Monday, the report.",
    etape04Moment: "If the report suits you",
    etape04Titre: "The subscription",
    etape04Court: "The set-up once, then the subscription, no commitment.",
    etape04Texte:
      "You pay for the set-up, once. The subscription takes over, with no commitment, and we keep an eye on the assistant every week.",
    detail: "The 4 steps in detail",
    cta: "See what you pay ",
  },

  studio: {
    section: "Control",
    titreCache: "Control, and the studio",
    citationDebut: "“It ",
    citationItalique: "never",
    citationFin: " commits on your behalf.”",
    phrase: "It prepares, you approve. Only the acknowledgement, read once by you, goes out on its own.",
    detail: "Control in detail, and who we are",
    paragraphe1:
      "No price, no date, no quote and no real reply goes out without your approval. Only one message goes out on its own: the acknowledgement asking for the address, a photo and the urgency. You read and approved it once. The assistant has no access to your payments. Your assistant's data is hosted in Switzerland.",
    paragraphe2:
      "Every Monday, you get a short report. It says what was handled, followed up and prepared, and what is waiting for you. If nothing happened, the report says so.",
    paragraphe3:
      "Nawa Corps is a Geneva studio. Ayoub Bensalem makes the first call, runs the demo and follows up. We start from a base for each trade, then set it to your business. And you see the work on your own enquiries before you spend a franc.",
    faitDonnees: "In Switzerland",
    faitDonneesNote: "The assistant's data",
    faitReleve: "Monday",
    faitReleveNote: "The report",
    faitPaiements: "None",
    faitPaiementsNote: "Access to your payments",
    lien: "See who does the work →",
  },

  offres: {
    section: "The offer",
    /** Même décision que le français : la différence vérifiable, en titre. */
    titreLigne1: "You see it, you try it,",
    titreLigne2: "you pay after.",
    demoTete: "On your trade",
    demoTitre: "The demo",
    demoPaye: "Nothing",
    demoCourt: "We bring enquiries from your trade. You watch.",
    essaiCourt: "It works on your enquiries. A report every Monday.",
    abonnementCourt: "The set-up, then a subscription you can stop any month.",
    detail: "See the details",
    demoTexte:
      "We show you the assistant on enquiries from your trade. You have nothing to dig out of your files, and we access none of your tools. At the end, we put the subscription tier in writing.",
    demoCta: "See the demo on my trade ",
    essaiTete: "Two weeks, on your real enquiries",
    essaiTitre: "The trial",
    essaiPaye: "Nothing",
    essaiPayeNote: "during the trial",
    essaiTexte:
      "For two weeks, the assistant works on your enquiries, and you approve. Two Mondays, so two reports.",
    abonnementTete: "If the report suits you",
    abonnementTitre: "After the trial",
    abonnementPayeNote: "once, for the set-up, {tva}",
    abonnementPayeSansMontant: "The set-up, once, then a monthly subscription based on your volume.",
    abonnementTexte:
      "If the report suits you, you pay for the set-up. The subscription follows, based on your volume. No commitment, cancellable every month.",
    note:
      "Start with the task that takes up most of your evenings. Set-up {montant}, {tva}, paid once, after the trial. The subscription tier is set in writing at the end of the demo, no commitment. A reply the next working day.",
    noteSansMontant:
      "Start with the task that takes up most of your evenings. The set-up is paid once, after the trial. The subscription tier is set in writing at the end of the demo, no commitment. A reply the next working day.",
  },

  abonnement: {
    titre: "The subscription, based on your volume",
    tete: "Per month",
    conditions: "no commitment, cancellable every month",
  },

  faq: {
    section: "Questions",
    titreCache: "Frequently asked questions",
    autres: "More questions",
    questionPreuve: "How do I know it works for my business?",
    reponsePreuve:
      "You judge on evidence before you pay. The demo runs on enquiries from your trade. The trial then runs for two weeks on your real enquiries, and the Monday report shows what was handled, followed up and prepared. You only pay for the set-up if that report suits you.",
    questionDonnees: "What about my data?",
    reponseDonnees:
      "Your assistant's data is hosted in Switzerland, under the Swiss data protection act (nFADP). For the demo, you have nothing to send us and we access none of your tools. During the trial, the assistant only works on the enquiries you give it. It has no access to your payments.",
    questionIa: "I don't want an AI writing to my clients.",
    reponseIa:
      "You are right to keep control. Only one message goes out without you: the acknowledgement asking for the address, a photo and the urgency, and you approve it once. After that, no real reply, no quote and no price goes out without your approval. It never commits on your behalf.",
    questionErreur: "What if it gets it wrong?",
    reponseErreur:
      "It will happen. That's why you read first: a mistake in a reply, a quote or a price, you correct it before it goes out. Only the acknowledgement goes out on its own, and that one you read once.",
    questionBesoin: "My work comes by word of mouth. Why an assistant?",
    reponseBesoin:
      "It does not bring you clients. It takes over the evening paperwork: enquiries received during the day, quotes to prepare, follow-ups. If you have no paperwork in the evening, you do not need it. We will tell you so on the first call.",
    questionPersonne: "I can't find anyone for the office.",
    reponsePersonne:
      "The assistant does not replace a person, and sometimes a secretary is still the right call. It takes over the part of the evening paperwork that comes back every week. Start with the task that takes up most of your evenings; the others follow, depending on your tier.",
    questionOutils: "I already have WhatsApp and quoting software.",
    reponseOutils:
      "For the demo, you change nothing: we show you the assistant on enquiries from your trade, as they arrive by WhatsApp, email or phone. What the assistant can read in your tools is checked tool by tool, with you. We do not promise a connection before we have tested it.",
    questionTemps: "I don't have time for this.",
    reponseTemps:
      "The first call is short. The demo asks nothing of you. During the trial, you read what the assistant has prepared and approve it. In the end, it means less paperwork in the evening, not more.",
    questionPrix: "How much does it cost?",
    prixDebut: "The demo and the two-week trial cost nothing.",
    prixMiseEnPlace:
      "The set-up costs {montant}, {tva}, once, after the trial, if the report suits you.",
    prixMiseEnPlaceSansMontant:
      "The set-up is paid once, after the trial, if the report suits you.",
    prixAbonnement:
      "Then the monthly subscription, because we look after the assistant every week: {paliers}, {tva}. No commitment, cancellable every month.",
    prixAbonnementSansMontant:
      "Then the monthly subscription, because we look after the assistant every week: based on your volume, no commitment, cancellable every month.",
    ctaDevis: "See the demo on my trade ",
    ctaDetail: "See the assistant in detail",
    lienGuideDebut: "Further reading, in French: ",
    lienGuide: "our guide to AI automation for Geneva small businesses",
    lienGuideSecretaire: "AI assistant or secretary, the comparison",
  },
};

export default en;
