import type { Locale } from "@/lib/i18n";

/**
 * LES EXEMPLES D AUTOMATISATION PAR METIER — la seule source de donnees de
 * /demonstrations et /en/demonstrations (demande d Ayoub du 25 octobre 2026 :
 * « des exemples d'automatisation par métier et, à côté, une image qui
 * montre comment ça marche »).
 *
 * POURQUOI UN FICHIER A COTE DE lib/metiers.ts, ET PAS DANS LUI. lib/metiers.ts
 * porte deja onze pages entieres (2 400 lignes) et son type `TexteMetier` est
 * lu par les pages metiers, le hub, l accueil et le sitemap. Les exemples ne
 * servent qu a une page : les y ajouter aurait alourdi chaque objet metier
 * pour un seul lecteur. Le lien entre les deux fichiers est LE SLUG, et lui
 * seul : `exemplesDe(slug)` lit ici ce que la page parcourt dans `METIERS`,
 * dans le meme ordre. Un metier sans exemples ici n est simplement pas rendu
 * sur la page ; un slug ecrit ici et absent de `METIERS` n est jamais lu.
 *
 * TOUT CE QUE DIT lib/metiers.ts S APPLIQUE ICI, mot pour mot, et d abord :
 *  - LA CAPACITE, JAMAIS LE RESULTAT. « Il peut lire », « il prépare » :
 *    aucune de ces scenes n a eu lieu chez un client. La LCD (art. 3) vise les
 *    indications trompeuses. Aucun chiffre de resultat, aucun compteur.
 *  - IL PREPARE ET PROPOSE, LE PATRON VALIDE. Chaque exemple a une etape
 *    « Vous validez » qui n est jamais vide, et ce qui part (`part`) part
 *    APRES elle. Le seul message qui part seul est l accuse de reception
 *    valide une fois, et il le dit chaque fois qu il apparait (« validé par
 *    vous une fois »). Jamais « rendez-vous pris », « date confirmée », ni
 *    « rien ne part sans votre accord » (faux : l accuse de reception part).
 *  - LE TELEPHONE EST DANS LE PALIER COMPLET : un exemple dont l entree est un
 *    appel porte `telephone: true`, et le schema comme le texte affichent
 *    alors l etiquette « Palier Complet ».
 *  - LES DEMANDES SONT FICTIVES ET LE DISENT : la page et chaque schema
 *    portent « Exemples de démonstration — demandes fictives ». Aucun nom de
 *    personne, aucun nom d entreprise ; les canaux sont nommes parce que le
 *    patron les reconnait (WhatsApp, Instagram), les portails ne le sont pas.
 *  - AUCUN MONTANT, AUCUN DELAI DE LIVRAISON. « Montants » et « tarifs »
 *    designent ceux du patron, jamais un chiffre.
 *
 * DEUX REGISTRES DE TEXTE PAR EXEMPLE, ET CE N EST PAS UN DOUBLON. Le texte
 * (`arrive`, `prepare`, `valide`, `part`) se lit a gauche, en phrases. Le
 * schema (`schema`) se lit d un coup d oeil, a droite : des libelles de
 * quelques mots, sans quoi le dessin redevient un paragraphe et ne montre
 * plus rien. Les deux disent la meme chose ; le texte est la reference.
 * Depuis le 26.10.2026 (« trop long à lire »), seul `arrive` reste visible a
 * cote du schema : `prepare`, `valide` et `part` sont dans « Voir le détail »,
 * ferme par defaut. `arrive` est donc LA phrase de l exemple : une ou deux
 * phrases courtes, pas plus.
 *
 * L ANGLAIS suit docs/agents/brand/glossaire-anglais.md : anglais britannique,
 * « enquiry », « quote », « appointment », « property manager » et « work
 * order » pour la regie et son bon, « Complete tier » pour le palier.
 */

/**
 * L icone du canal d entree, dessinee par components/SchemaAutomatisation.tsx.
 * Des pictogrammes generiques : aucun logo de marque n est reproduit.
 */
export type IconeCanal =
  | "message"
  | "email"
  | "appel"
  | "document"
  | "portail"
  | "formulaire"
  | "agenda"
  | "photo"
  | "relance";

/** Un exemple, dans une langue. */
export type TexteExemple = {
  /** Le geste, court : c est le h3 de l exemple. */
  titre: string;
  /** Le canal par lequel la demande arrive, tel que le patron le nomme. */
  canal: string;
  /** « Ce qui arrive » : le declencheur, en une phrase. */
  arrive: string;
  /** L extrait fictif, court, entre guillemets : la seule « capture » du schema. */
  extrait: string;
  /** Ce que l assistant prepare, deux ou trois puces, au present de la capacite. */
  prepare: readonly string[];
  /** Ce que le patron valide : jamais vide, jamais implicite. */
  valide: string;
  /** Ce qui part, et a qui — toujours apres la validation. */
  part: string;
  /** Les libelles courts du schema, quelques mots chacun. */
  schema: { prepare: string; valide: string; part: string };
};

export type Exemple = {
  /** Identifiant stable, unique dans son metier : cle React et ancre. */
  id: string;
  icone: IconeCanal;
  /** L entree est un appel : etiquette « Palier Complet » obligatoire. */
  telephone?: true;
} & Record<Locale, TexteExemple>;

/** Deux exemples par metier, ni plus ni moins : la page est dessinee pour deux. */
type DeuxExemples = readonly [Exemple, Exemple];

/**
 * LES EXEMPLES, PAR SLUG DE lib/metiers.ts. L ordre des cles suit celui de
 * `METIERS` pour se relire facilement, mais c est `METIERS` qui decide de
 * l ordre d affichage.
 */
const EXEMPLES: Record<string, DeuxExemples> = {
  "sanitaire-chauffage": [
    {
      id: "photo-de-fuite",
      icone: "message",
      fr: {
        titre: "La photo de fuite reçue pendant le chantier",
        canal: "WhatsApp",
        arrive: "Vous êtes chez un client. Un message WhatsApp arrive, avec une photo.",
        extrait: "« Bonjour, ça goutte sous le lavabo depuis ce matin. Je vous envoie une photo. »",
        prepare: [
          "Un accusé de réception, validé par vous une fois, demande l'adresse et si l'eau peut être coupée.",
          "Il peut décrire ce que montre la photo (siphon, flexible, raccord) et classe la demande : urgente ou à planifier.",
          "Il prépare la fiche de la demande et une proposition de passage.",
        ],
        valide: "Le soir, vous relisez la fiche et la proposition de passage. Vous corrigez si besoin, puis vous validez d'un geste.",
        part: "La proposition de passage part au client, dans vos mots.",
        schema: {
          prepare: "Fiche triée et proposition de passage",
          valide: "La proposition de passage",
          part: "Message au client",
        },
      },
      en: {
        titre: "The photo of a leak, received while you're on a job",
        canal: "WhatsApp",
        arrive: "You're at a client's. A WhatsApp message arrives, with a photo.",
        extrait: "“Hello, it's been dripping under the basin since this morning. Here's a photo.”",
        prepare: [
          "An acknowledgement, approved by you once, asks for the address and whether the water can be turned off.",
          "It can describe what the photo shows (trap, hose, fitting) and sorts the enquiry: urgent or to be scheduled.",
          "It drafts the enquiry sheet and a proposed visit.",
        ],
        valide: "In the evening, you read the sheet and the proposed visit. You correct it if needed, then approve it in one step.",
        part: "The proposed visit goes to the client, in your words.",
        schema: {
          prepare: "Sorted sheet and proposed visit",
          valide: "The proposed visit",
          part: "Message to the client",
        },
      },
    },
    {
      id: "bon-de-regie",
      icone: "document",
      fr: {
        titre: "Le bon de régie reçu en PDF",
        canal: "E-mail et bon PDF",
        arrive: "Une régie vous envoie un ordre d'intervention en PDF, par e-mail.",
        extrait: "« Ordre d'intervention : plus d'eau chaude au 2e étage. Locataire à contacter. »",
        prepare: [
          "Il peut lire le bon : l'adresse, le locataire, le travail demandé, la référence de la régie.",
          "Il prépare le message au locataire avec deux créneaux proposés d'après votre agenda.",
          "Il prépare la confirmation à la régie, à envoyer quand le créneau est choisi.",
        ],
        valide: "Vous choisissez le créneau et vous validez les deux messages.",
        part: "Le message au locataire, puis la confirmation à la régie.",
        schema: {
          prepare: "Fiche du bon et deux créneaux",
          valide: "Le créneau et les deux messages",
          part: "Au locataire, puis à la régie",
        },
      },
      en: {
        titre: "The property manager's work order, received as a PDF",
        canal: "Email and PDF work order",
        arrive: "A property manager sends you a work order as a PDF, by email.",
        extrait: "“Work order: no hot water on the 2nd floor. Please contact the tenant.”",
        prepare: [
          "It can read the work order: the address, the tenant, the job requested, the property manager's reference.",
          "It drafts the message to the tenant with two slots proposed from your diary.",
          "It drafts the reply to the property manager, to send once the slot is chosen.",
        ],
        valide: "You choose the slot and approve both messages.",
        part: "The message to the tenant, then the reply to the property manager.",
        schema: {
          prepare: "Work order sheet and two slots",
          valide: "The slot and both messages",
          part: "To the tenant, then the property manager",
        },
      },
    },
  ],

  electricite: [
    {
      id: "appel-panne-ou-devis",
      icone: "appel",
      telephone: true,
      fr: {
        titre: "L'appel manqué, trié : panne ou devis",
        canal: "Appel",
        arrive: "Vous ne pouvez pas décrocher. L'assistant prend l'appel avec le message d'accueil que vous avez validé.",
        extrait: "« Plus de courant dans la cuisine, le disjoncteur saute dès que je le remonte. »",
        prepare: [
          "Il note le nom, l'adresse, ce qui ne fonctionne plus, et pose la question qui trie : panne en cours ou travaux à prévoir.",
          "Il ne promet ni date ni prix. Il vous laisse une fiche écrite, marquée « panne ».",
          "Il prépare le message de rappel au client.",
        ],
        valide: "Vous lisez la fiche. Vous rappelez vous-même, ou vous validez le message préparé.",
        part: "Le message au client, avec le passage que vous avez choisi.",
        schema: {
          prepare: "Fiche « panne » et message de rappel",
          valide: "Le passage et le message",
          part: "Message au client",
        },
      },
      en: {
        titre: "The missed call, sorted: breakdown or quote",
        canal: "Phone call",
        arrive: "You can't pick up. The assistant takes the call with the greeting you approved.",
        extrait: "“No power in the kitchen, the breaker trips as soon as I push it back up.”",
        prepare: [
          "It notes the name, the address, what has stopped working, and asks the question that sorts it: a breakdown now, or work to plan.",
          "It promises no date and no price. It leaves you a written note, marked “breakdown”.",
          "It drafts the call-back message to the client.",
        ],
        valide: "You read the note. You call back yourself, or approve the drafted message.",
        part: "The message to the client, with the visit you chose.",
        schema: {
          prepare: "“Breakdown” note and call-back message",
          valide: "The visit and the message",
          part: "Message to the client",
        },
      },
    },
    {
      id: "relance-de-devis",
      icone: "relance",
      fr: {
        titre: "Le devis resté sans réponse, relancé",
        canal: "Devis envoyé",
        arrive: "Un devis est parti il y a cinq jours. Le client n'a pas répondu.",
        extrait: "« Devis : remplacement du tableau électrique, villa. Envoyé, sans réponse. »",
        prepare: [
          "Il repère les devis sans réponse après le nombre de jours que vous avez fixé.",
          "Il prépare une relance courte, dans vos mots, qui rappelle l'objet du devis.",
          "Il la range dans la liste du soir, avec les autres relances.",
        ],
        valide: "Vous relisez la relance. Vous la modifiez, vous l'écartez ou vous la validez.",
        part: "La relance part au client.",
        schema: {
          prepare: "Relance courte, dans vos mots",
          valide: "La relance, ou son retrait",
          part: "Relance au client",
        },
      },
      en: {
        titre: "The unanswered quote, followed up",
        canal: "Quote sent",
        arrive: "A quote went out five days ago. The client hasn't replied.",
        extrait: "“Quote: replacing the consumer unit, detached house. Sent, no reply.”",
        prepare: [
          "It spots quotes with no reply after the number of days you set.",
          "It drafts a short follow-up, in your words, that recalls what the quote covers.",
          "It adds it to the evening list, with the other follow-ups.",
        ],
        valide: "You read the follow-up. You edit it, set it aside or approve it.",
        part: "The follow-up goes to the client.",
        schema: {
          prepare: "Short follow-up, in your words",
          valide: "The follow-up, or not",
          part: "Follow-up to the client",
        },
      },
    },
  ],

  "artisans-batiment": [
    {
      id: "demande-a-completer",
      icone: "formulaire",
      fr: {
        titre: "La demande trop vague, complétée",
        canal: "Formulaire du site",
        arrive: "Une demande arrive par le formulaire de votre site, en une ligne.",
        extrait: "« Bonjour, on aimerait refaire la peinture de l'appartement avant l'été. »",
        prepare: [
          "Un accusé de réception, validé par vous une fois, demande les pièces concernées, la surface approximative et des photos.",
          "Quand les réponses arrivent, il prépare une fiche : pièces, surfaces, état des murs, date souhaitée.",
          "Il propose deux créneaux pour une visite de métré.",
        ],
        valide: "Vous choisissez le créneau de visite et vous validez le message.",
        part: "La proposition de visite part au client.",
        schema: {
          prepare: "Fiche complète et deux créneaux",
          valide: "Le créneau de visite",
          part: "Proposition de visite",
        },
      },
      en: {
        titre: "The vague enquiry, completed",
        canal: "Website form",
        arrive: "An enquiry arrives through your website form, in one line.",
        extrait: "“Hello, we'd like to repaint the flat before the summer.”",
        prepare: [
          "An acknowledgement, approved by you once, asks which rooms, the rough floor area and some photos.",
          "When the answers come in, it drafts a sheet: rooms, areas, state of the walls, preferred date.",
          "It proposes two slots for a measuring visit.",
        ],
        valide: "You choose the visit slot and approve the message.",
        part: "The proposed visit goes to the client.",
        schema: {
          prepare: "Complete sheet and two slots",
          valide: "The visit slot",
          part: "Proposed visit",
        },
      },
    },
    {
      id: "devis-depuis-les-notes",
      icone: "document",
      fr: {
        titre: "Le devis préparé depuis vos notes de visite",
        canal: "Notes de visite",
        arrive: "Après la visite, vous dictez vos notes ou vous envoyez vos mesures.",
        extrait: "« Salon 28 m², plafond fissuré, deux couches, porte à poncer. »",
        prepare: [
          "Il reprend vos notes et vos prestations habituelles pour préparer un brouillon de devis, poste par poste.",
          "Il signale ce qui manque : la teinte, l'accès, la date.",
          "Il prépare le message d'envoi.",
        ],
        valide: "Vous corrigez les postes et les montants, puis vous validez.",
        part: "Le devis part au client, avec son message.",
        schema: {
          prepare: "Brouillon de devis, poste par poste",
          valide: "Les postes et les montants",
          part: "Devis au client",
        },
      },
      en: {
        titre: "The quote drafted from your visit notes",
        canal: "Visit notes",
        arrive: "After the visit, you dictate your notes or send your measurements.",
        extrait: "“Living room 28 m², cracked ceiling, two coats, door to sand.”",
        prepare: [
          "It uses your notes and your usual services to draft a quote, line by line.",
          "It flags what is missing: the colour, the access, the date.",
          "It drafts the covering message.",
        ],
        valide: "You correct the lines and the amounts, then approve.",
        part: "The quote goes to the client, with its message.",
        schema: {
          prepare: "Draft quote, line by line",
          valide: "The lines and the amounts",
          part: "Quote to the client",
        },
      },
    },
  ],

  "regies-immobilieres": [
    {
      id: "demande-de-locataire",
      icone: "email",
      fr: {
        titre: "La demande du locataire, triée en bon d'intervention",
        canal: "E-mail",
        arrive: "Un locataire écrit à la régie : quelque chose ne fonctionne plus.",
        extrait: "« Bonjour, le store de la chambre est bloqué en bas depuis hier. »",
        prepare: [
          "Un accusé de réception, validé par vous une fois, demande l'adresse exacte, l'étage et une photo.",
          "Il classe la demande (immeuble, type de travail, urgence) et propose l'entreprise habituelle, d'après votre liste.",
          "Il prépare le bon d'intervention pré-rempli.",
        ],
        valide: "Vous relisez le bon, vous changez l'entreprise si besoin, puis vous le validez.",
        part: "Le bon part à l'entreprise ; un message informe le locataire.",
        schema: {
          prepare: "Bon d'intervention pré-rempli",
          valide: "Le bon et l'entreprise",
          part: "À l'entreprise et au locataire",
        },
      },
      en: {
        titre: "The tenant's request, sorted into a work order",
        canal: "Email",
        arrive: "A tenant writes to the property manager: something has stopped working.",
        extrait: "“Hello, the bedroom blind has been stuck down since yesterday.”",
        prepare: [
          "An acknowledgement, approved by you once, asks for the exact address, the floor and a photo.",
          "It sorts the request (building, type of job, urgency) and proposes the usual contractor, from your list.",
          "It drafts the work order, already filled in.",
        ],
        valide: "You read the work order, change the contractor if needed, then approve it.",
        part: "The work order goes to the contractor; a message lets the tenant know.",
        schema: {
          prepare: "Work order, filled in",
          valide: "The work order and contractor",
          part: "To the contractor and the tenant",
        },
      },
    },
    {
      id: "suivi-apres-intervention",
      icone: "relance",
      fr: {
        titre: "Le suivi après l'intervention",
        canal: "Retour de l'entreprise",
        arrive: "L'entreprise annonce que l'intervention est terminée.",
        extrait: "« Intervention terminée : store remplacé, facture à suivre. »",
        prepare: [
          "Il prépare un message au locataire pour vérifier que tout fonctionne.",
          "Si le locataire signale un problème, il rouvre la demande et prépare le message à l'entreprise.",
          "Il note dans la fiche du bon la facture attendue.",
        ],
        valide: "Vous validez le message au locataire, puis la clôture du bon.",
        part: "Le message de suivi part au locataire.",
        schema: {
          prepare: "Message de suivi et fiche à jour",
          valide: "Le message, puis la clôture",
          part: "Suivi au locataire",
        },
      },
      en: {
        titre: "The follow-up after the job",
        canal: "Contractor's report",
        arrive: "The contractor reports that the job is done.",
        extrait: "“Job done: blind replaced, invoice to follow.”",
        prepare: [
          "It drafts a message to the tenant to check everything works.",
          "If the tenant reports a problem, it reopens the request and drafts the message to the contractor.",
          "It records the expected invoice on the work order sheet.",
        ],
        valide: "You approve the message to the tenant, then the closing of the work order.",
        part: "The follow-up message goes to the tenant.",
        schema: {
          prepare: "Follow-up message, sheet updated",
          valide: "The message, then closing",
          part: "Follow-up to the tenant",
        },
      },
    },
  ],

  "agences-immobilieres": [
    {
      id: "demandes-des-portails",
      icone: "portail",
      fr: {
        titre: "Les demandes des portails, accusées et triées",
        canal: "Portail immobilier",
        arrive: "Une demande arrive d'un portail immobilier, un dimanche soir.",
        extrait: "« Bonjour, le 4 pièces est-il toujours disponible ? Nous pourrions visiter samedi. »",
        prepare: [
          "Un accusé de réception, validé par vous une fois, répond et demande le nombre d'occupants et la date d'entrée souhaitée.",
          "Il range la demande avec l'annonce concernée et prépare la réponse aux questions de l'annonce : surface, charges, étage.",
          "Le branchement se vérifie portail par portail, avec vous.",
        ],
        valide: "Vous relisez les réponses préparées et vous les validez en une liste.",
        part: "Les réponses partent aux demandeurs.",
        schema: {
          prepare: "Demande rangée, réponse prête",
          valide: "Les réponses, en une liste",
          part: "Réponses aux demandeurs",
        },
      },
      en: {
        titre: "Portal enquiries, acknowledged and sorted",
        canal: "Property portal",
        arrive: "An enquiry arrives from a property portal, on a Sunday evening.",
        extrait: "“Hello, is the 3-bedroom flat still available? We could view on Saturday.”",
        prepare: [
          "An acknowledgement, approved by you once, replies and asks how many people will live there and the preferred move-in date.",
          "It files the enquiry with the listing and drafts the answer to the listing questions: floor area, service charges, floor.",
          "The connection is checked portal by portal, with you.",
        ],
        valide: "You read the drafted answers and approve them as one list.",
        part: "The answers go to the enquirers.",
        schema: {
          prepare: "Enquiry filed, answer drafted",
          valide: "The answers, as one list",
          part: "Answers to the enquirers",
        },
      },
    },
    {
      id: "visites-groupees",
      icone: "agenda",
      fr: {
        titre: "Les visites, regroupées et préparées",
        canal: "Demandes de visite",
        arrive: "Plusieurs demandeurs veulent visiter le même appartement.",
        extrait: "« Je suis libre samedi matin, ou en fin de journée en semaine. »",
        prepare: [
          "Il regroupe les demandes par annonce et propose un créneau de visite.",
          "Il prépare l'invitation à chaque demandeur et la liste des inscrits.",
          "Il prépare aussi le rappel de la veille.",
        ],
        valide: "Vous validez le créneau, puis les invitations. La veille, vous validez le rappel.",
        part: "Les invitations partent aux demandeurs.",
        schema: {
          prepare: "Créneau, invitations, liste",
          valide: "Le créneau et les invitations",
          part: "Invitations aux demandeurs",
        },
      },
      en: {
        titre: "Viewings, grouped and prepared",
        canal: "Viewing requests",
        arrive: "Several enquirers want to view the same flat.",
        extrait: "“I'm free on Saturday morning, or at the end of the day during the week.”",
        prepare: [
          "It groups the requests by listing and proposes a viewing slot.",
          "It drafts the invitation to each enquirer and the list of who is coming.",
          "It also drafts the reminder for the day before.",
        ],
        valide: "You approve the slot, then the invitations. The day before, you approve the reminder.",
        part: "The invitations go to the enquirers.",
        schema: {
          prepare: "Slot, invitations, list",
          valide: "The slot and the invitations",
          part: "Invitations to the enquirers",
        },
      },
    },
  ],

  fiduciaires: [
    {
      id: "pieces-avant-echeance",
      icone: "document",
      fr: {
        titre: "Les pièces manquantes, réclamées avant l'échéance",
        canal: "Échéance du dossier",
        arrive: "La déclaration d'un client approche de son échéance, et le dossier est incomplet.",
        extrait: "« Dossier 2026 : manquent le certificat de salaire et l'attestation du 3e pilier. »",
        prepare: [
          "Il compare le dossier à la liste des pièces attendues pour ce client.",
          "Il prépare un message qui nomme les pièces manquantes, une par une.",
          "Sans réponse, il prépare la relance.",
        ],
        valide: "Vous relisez la liste et le message, puis vous validez.",
        part: "La demande de pièces part au client.",
        schema: {
          prepare: "Liste des pièces manquantes",
          valide: "La liste et le message",
          part: "Demande de pièces au client",
        },
      },
      en: {
        titre: "Missing documents, chased before the deadline",
        canal: "File deadline",
        arrive: "A client's tax return is nearing its deadline, and the file is incomplete.",
        extrait: "“2026 file: salary certificate and pillar 3a statement still missing.”",
        prepare: [
          "It checks the file against the list of documents expected for this client.",
          "It drafts a message that names the missing documents, one by one.",
          "If there is no reply, it drafts the follow-up.",
        ],
        valide: "You read the list and the message, then approve.",
        part: "The request for documents goes to the client.",
        schema: {
          prepare: "List of missing documents",
          valide: "The list and the message",
          part: "Request to the client",
        },
      },
    },
    {
      id: "pieces-recues-en-vrac",
      icone: "email",
      fr: {
        titre: "Les pièces reçues en vrac, triées",
        canal: "E-mail",
        arrive: "Un client envoie ses justificatifs par e-mail, en vrac.",
        extrait: "« Voici les papiers, dites-moi s'il manque quelque chose. »",
        prepare: [
          "Un accusé de réception, validé par vous une fois, répond que les pièces sont bien arrivées.",
          "Il peut lire chaque pièce, la nommer et la classer dans le dossier du client.",
          "Il prépare la réponse : ce qui est arrivé, ce qui manque encore.",
        ],
        valide: "Vous vérifiez le classement et vous validez la réponse.",
        part: "La réponse part au client.",
        schema: {
          prepare: "Pièces nommées et classées",
          valide: "Le classement et la réponse",
          part: "Réponse au client",
        },
      },
      en: {
        titre: "Documents sent all at once, sorted",
        canal: "Email",
        arrive: "A client emails their supporting documents, all at once.",
        extrait: "“Here are the papers, let me know if anything is missing.”",
        prepare: [
          "An acknowledgement, approved by you once, replies that the documents have arrived.",
          "It can read each document, name it and file it in the client's folder.",
          "It drafts the reply: what has arrived, what is still missing.",
        ],
        valide: "You check the filing and approve the reply.",
        part: "The reply goes to the client.",
        schema: {
          prepare: "Documents named and filed",
          valide: "The filing and the reply",
          part: "Reply to the client",
        },
      },
    },
  ],

  garages: [
    {
      id: "rappel-de-service",
      icone: "agenda",
      fr: {
        titre: "Le rappel de service, préparé à l'avance",
        canal: "Fiches clients",
        arrive: "Dans vos fiches clients, le service d'un véhicule approche.",
        extrait: "« Service annuel et contrôle des freins : dernière visite il y a un an. »",
        prepare: [
          "Il prépare un message de rappel avec le véhicule et le type de service.",
          "Il propose deux créneaux d'après l'agenda de l'atelier.",
          "Il range les rappels de la semaine dans une seule liste.",
        ],
        valide: "Vous choisissez à qui il part, et vous validez.",
        part: "Le rappel part au client, avec les créneaux proposés.",
        schema: {
          prepare: "Rappel et deux créneaux",
          valide: "À qui il part",
          part: "Rappel au client",
        },
      },
      en: {
        titre: "The service reminder, drafted ahead",
        canal: "Client records",
        arrive: "In your client records, a vehicle's service is coming up.",
        extrait: "“Annual service and brake check: last visit a year ago.”",
        prepare: [
          "It drafts a reminder with the vehicle and the type of service.",
          "It proposes two slots from the workshop diary.",
          "It puts the week's reminders in a single list.",
        ],
        valide: "You choose who it goes to, and approve.",
        part: "The reminder goes to the client, with the proposed slots.",
        schema: {
          prepare: "Reminder and two slots",
          valide: "Who it goes to",
          part: "Reminder to the client",
        },
      },
    },
    {
      id: "rendez-vous-au-telephone",
      icone: "appel",
      telephone: true,
      fr: {
        titre: "La demande de rendez-vous, prise au téléphone",
        canal: "Appel",
        arrive: "Vous êtes sous un véhicule. L'assistant prend l'appel avec le message d'accueil que vous avez validé.",
        extrait: "« Un bruit à l'avant quand je freine. Vous pourriez regarder cette semaine ? »",
        prepare: [
          "Il note le nom, le véhicule, la plaque et ce que le client entend.",
          "Il ne promet ni date ni prix. Il vous laisse une fiche écrite.",
          "Il prépare une proposition de rendez-vous d'après l'agenda de l'atelier.",
        ],
        valide: "Vous relisez la fiche et vous validez le créneau proposé, ou vous en choisissez un autre.",
        part: "La proposition de rendez-vous part au client, par message.",
        schema: {
          prepare: "Fiche écrite et créneau proposé",
          valide: "Le créneau",
          part: "Proposition au client",
        },
      },
      en: {
        titre: "The appointment request, taken on the phone",
        canal: "Phone call",
        arrive: "You're under a car. The assistant takes the call with the greeting you approved.",
        extrait: "“There's a noise at the front when I brake. Could you look at it this week?”",
        prepare: [
          "It notes the name, the vehicle, the number plate and what the client hears.",
          "It promises no date and no price. It leaves you a written note.",
          "It drafts a proposed appointment from the workshop diary.",
        ],
        valide: "You read the note and approve the proposed slot, or choose another.",
        part: "The proposed appointment goes to the client, by message.",
        schema: {
          prepare: "Written note and proposed slot",
          valide: "The slot",
          part: "Proposal to the client",
        },
      },
    },
  ],

  "architectes-bureaux-etudes": [
    {
      id: "documents-manquants",
      icone: "document",
      fr: {
        titre: "Les documents manquants du dossier, relancés",
        canal: "Dossier en cours",
        arrive: "Une demande d'autorisation attend encore des documents du maître d'ouvrage.",
        extrait: "« Pour avancer : plan du géomètre, extrait du registre foncier, photos de la façade. »",
        prepare: [
          "Il tient la liste des documents attendus, dossier par dossier.",
          "Il prépare la demande au client, document par document, puis les relances si rien n'arrive.",
          "Quand un document arrive, il le range et met la liste à jour.",
        ],
        valide: "Vous validez la demande, puis chaque relance.",
        part: "La demande de documents part au maître d'ouvrage.",
        schema: {
          prepare: "Liste à jour et demande prête",
          valide: "La demande et chaque relance",
          part: "Au maître d'ouvrage",
        },
      },
      en: {
        titre: "Missing project documents, followed up",
        canal: "Open file",
        arrive: "A planning application is still waiting for documents from the client.",
        extrait: "“To move on: surveyor's plan, land register extract, photos of the façade.”",
        prepare: [
          "It keeps the list of expected documents, file by file.",
          "It drafts the request to the client, document by document, then the follow-ups if nothing arrives.",
          "When a document arrives, it files it and updates the list.",
        ],
        valide: "You approve the request, then each follow-up.",
        part: "The request for documents goes to the client.",
        schema: {
          prepare: "Updated list, request drafted",
          valide: "The request and each follow-up",
          part: "To the client",
        },
      },
    },
    {
      id: "demande-de-projet",
      icone: "email",
      fr: {
        titre: "La demande de projet, qualifiée avant le premier rendez-vous",
        canal: "E-mail",
        arrive: "Un particulier écrit pour un projet d'agrandissement.",
        extrait: "« Nous voulons agrandir la maison et transformer le garage en bureau. »",
        prepare: [
          "Un accusé de réception, validé par vous une fois, demande l'adresse de la parcelle, des photos et le calendrier voulu.",
          "Il prépare une fiche : type de projet, commune, points à vérifier.",
          "Il propose deux créneaux pour un premier rendez-vous.",
        ],
        valide: "Vous décidez de donner suite, vous choisissez le créneau et vous validez le message.",
        part: "La proposition de rendez-vous part au client.",
        schema: {
          prepare: "Fiche projet et deux créneaux",
          valide: "La suite et le créneau",
          part: "Proposition de rendez-vous",
        },
      },
      en: {
        titre: "The project enquiry, qualified before the first meeting",
        canal: "Email",
        arrive: "A homeowner writes about an extension project.",
        extrait: "“We want to extend the house and turn the garage into an office.”",
        prepare: [
          "An acknowledgement, approved by you once, asks for the plot address, some photos and the timing they have in mind.",
          "It drafts a sheet: type of project, municipality, points to check.",
          "It proposes two slots for a first appointment.",
        ],
        valide: "You decide whether to take it on, choose the slot and approve the message.",
        part: "The proposed appointment goes to the client.",
        schema: {
          prepare: "Project sheet and two slots",
          valide: "Whether to go on, and the slot",
          part: "Proposed appointment",
        },
      },
    },
  ],

  "salons-coiffure-beaute": [
    {
      id: "message-instagram",
      icone: "message",
      fr: {
        titre: "Le message Instagram, devenu une proposition de créneau",
        canal: "Instagram",
        arrive: "Une cliente écrit sur Instagram pendant que vous êtes en soin.",
        extrait: "« Bonjour, il vous reste une place jeudi pour une couleur ? »",
        prepare: [
          "Un accusé de réception, validé par vous une fois, répond et demande l'heure préférée et s'il s'agit d'une première visite.",
          "Il propose un créneau libre qui tient compte de la durée d'une couleur.",
          "Il prépare le message de proposition.",
        ],
        valide: "Vous validez le créneau d'un geste, entre deux clientes.",
        part: "La proposition part à la cliente.",
        schema: {
          prepare: "Créneau jeudi, message prêt",
          valide: "Le créneau",
          part: "Proposition à la cliente",
        },
      },
      en: {
        titre: "The Instagram message, turned into a proposed slot",
        canal: "Instagram",
        arrive: "A client writes on Instagram while you're with someone.",
        extrait: "“Hello, do you have a slot left on Thursday for a colour?”",
        prepare: [
          "An acknowledgement, approved by you once, replies and asks for the preferred time and whether it's a first visit.",
          "It proposes a free slot that allows for how long a colour takes.",
          "It drafts the message with the proposal.",
        ],
        valide: "You approve the slot in one step, between two clients.",
        part: "The proposal goes to the client.",
        schema: {
          prepare: "Thursday slot, message drafted",
          valide: "The slot",
          part: "Proposal to the client",
        },
      },
    },
    {
      id: "rappel-de-la-veille",
      icone: "agenda",
      fr: {
        titre: "Les rappels de la veille, prêts en une liste",
        canal: "Agenda du salon",
        arrive: "Demain, l'agenda du salon compte plusieurs rendez-vous.",
        extrait: "« Demain : couleur, coupe homme, brushing, soin du visage. »",
        prepare: [
          "Il prépare un rappel par cliente, avec l'heure et la prestation.",
          "Il y ajoute comment prévenir le salon en cas d'empêchement.",
          "Si une cliente annule, il prépare le message pour la liste d'attente.",
        ],
        valide: "Vous validez la liste des rappels, en une fois.",
        part: "Les rappels partent aux clientes.",
        schema: {
          prepare: "Un rappel par cliente",
          valide: "La liste des rappels",
          part: "Rappels aux clientes",
        },
      },
      en: {
        titre: "Tomorrow's reminders, ready as one list",
        canal: "Salon diary",
        arrive: "Tomorrow, the salon diary has several appointments.",
        extrait: "“Tomorrow: colour, men's cut, blow-dry, facial.”",
        prepare: [
          "It drafts one reminder per client, with the time and the treatment.",
          "It adds how to let the salon know if they can't make it.",
          "If a client cancels, it drafts the message for the waiting list.",
        ],
        valide: "You approve the list of reminders, in one go.",
        part: "The reminders go to the clients.",
        schema: {
          prepare: "One reminder per client",
          valide: "The list of reminders",
          part: "Reminders to the clients",
        },
      },
    },
  ],

  "nettoyage-entretien": [
    {
      id: "devis-sur-photos",
      icone: "photo",
      fr: {
        titre: "Le devis de fin de bail, préparé sur photos",
        canal: "WhatsApp",
        arrive: "Un client envoie des photos du logement à nettoyer.",
        extrait: "« Je quitte mon 3 pièces à la fin du mois. Vous faites les nettoyages de fin de bail ? »",
        prepare: [
          "Un accusé de réception, validé par vous une fois, demande la surface, l'étage et la date de l'état des lieux.",
          "Il peut décrire ce que montrent les photos : four, vitres, stores, balcon.",
          "Il prépare un brouillon de devis à partir de vos prestations habituelles.",
        ],
        valide: "Vous corrigez le devis, puis vous le validez.",
        part: "Le devis part au client.",
        schema: {
          prepare: "Brouillon de devis sur photos",
          valide: "Le devis",
          part: "Devis au client",
        },
      },
      en: {
        titre: "The end-of-tenancy quote, drafted from photos",
        canal: "WhatsApp",
        arrive: "A client sends photos of the flat to be cleaned.",
        extrait: "“I'm leaving my 2-bedroom flat at the end of the month. Do you do end-of-tenancy cleans?”",
        prepare: [
          "An acknowledgement, approved by you once, asks for the floor area, the floor and the date of the check-out inspection.",
          "It can describe what the photos show: oven, windows, blinds, balcony.",
          "It drafts a quote from your usual services.",
        ],
        valide: "You correct the quote, then approve it.",
        part: "The quote goes to the client.",
        schema: {
          prepare: "Draft quote from photos",
          valide: "The quote",
          part: "Quote to the client",
        },
      },
    },
    {
      id: "entretien-de-bureaux",
      icone: "email",
      fr: {
        titre: "L'entretien de bureaux : la visite proposée",
        canal: "E-mail",
        arrive: "Une entreprise demande un entretien régulier de ses bureaux.",
        extrait: "« Nous cherchons un nettoyage deux fois par semaine, en fin de journée. »",
        prepare: [
          "Il note la surface, la fréquence voulue et les horaires d'accès.",
          "Il propose un passage pour voir les locaux, d'après le planning de vos équipes.",
          "Il prépare le message de proposition.",
        ],
        valide: "Vous choisissez le passage et vous validez le message.",
        part: "La proposition de visite part au client.",
        schema: {
          prepare: "Fiche des locaux et passage proposé",
          valide: "Le passage",
          part: "Proposition de visite",
        },
      },
      en: {
        titre: "Office cleaning: the proposed visit",
        canal: "Email",
        arrive: "A company asks for regular cleaning of its offices.",
        extrait: "“We're looking for a clean twice a week, at the end of the day.”",
        prepare: [
          "It notes the floor area, how often, and the access times.",
          "It proposes a visit to see the premises, from your teams' schedule.",
          "It drafts the message with the proposal.",
        ],
        valide: "You choose the visit and approve the message.",
        part: "The proposed visit goes to the client.",
        schema: {
          prepare: "Premises sheet and proposed visit",
          valide: "The visit",
          part: "Proposed visit",
        },
      },
    },
  ],

  demenagement: [
    {
      id: "devis-sur-inventaire",
      icone: "formulaire",
      fr: {
        titre: "Le devis préparé sur inventaire",
        canal: "Formulaire du site",
        arrive: "Une demande de déménagement arrive par le formulaire de votre site.",
        extrait: "« Déménagement d'un 4 pièces, de Carouge à Meyrin, début mars. »",
        prepare: [
          "Un accusé de réception, validé par vous une fois, demande l'inventaire des meubles, les étages et l'accès (ascenseur, stationnement).",
          "Il prépare une fiche : inventaire, accès, matériel à prévoir.",
          "Il prépare un brouillon de devis à partir de vos tarifs habituels.",
        ],
        valide: "Vous corrigez le devis, puis vous le validez.",
        part: "Le devis part au client.",
        schema: {
          prepare: "Fiche inventaire et brouillon de devis",
          valide: "Le devis",
          part: "Devis au client",
        },
      },
      en: {
        titre: "The quote drafted from an inventory",
        canal: "Website form",
        arrive: "A removal enquiry arrives through your website form.",
        extrait: "“Moving a 3-bedroom flat from Carouge to Meyrin, early March.”",
        prepare: [
          "An acknowledgement, approved by you once, asks for the furniture inventory, the floors and the access (lift, parking).",
          "It drafts a sheet: inventory, access, equipment needed.",
          "It drafts a quote from your usual rates.",
        ],
        valide: "You correct the quote, then approve it.",
        part: "The quote goes to the client.",
        schema: {
          prepare: "Inventory sheet and draft quote",
          valide: "The quote",
          part: "Quote to the client",
        },
      },
    },
    {
      id: "date-du-demenagement",
      icone: "agenda",
      fr: {
        titre: "La date du déménagement, préparée pour votre accord",
        canal: "E-mail",
        arrive: "Le client accepte le devis et demande une date.",
        extrait: "« C'est d'accord pour le devis. Le samedi 6 mars, ce serait possible ? »",
        prepare: [
          "Il regarde l'agenda des équipes et du camion pour la date demandée.",
          "Il prépare la réponse : la date demandée, ou une autre à proposer.",
          "Il y joint ce que le client doit prévoir : cartons, accès, autorisation de stationnement.",
        ],
        valide: "Vous validez la date et le message.",
        part: "La réponse part au client, avec la date que vous avez validée.",
        schema: {
          prepare: "Date vérifiée, réponse prête",
          valide: "La date et le message",
          part: "Réponse au client",
        },
      },
      en: {
        titre: "The moving date, drafted for your approval",
        canal: "Email",
        arrive: "The client accepts the quote and asks for a date.",
        extrait: "“The quote is fine. Would Saturday 6 March be possible?”",
        prepare: [
          "It looks at the team and van diary for the date requested.",
          "It drafts the reply: the date requested, or another to propose.",
          "It adds what the client needs to arrange: boxes, access, parking permit.",
        ],
        valide: "You approve the date and the message.",
        part: "The reply goes to the client, with the date you approved.",
        schema: {
          prepare: "Date checked, reply drafted",
          valide: "The date and the message",
          part: "Reply to the client",
        },
      },
    },
  ],
};

/** Les deux exemples d un metier, ou `undefined` : le metier n est alors pas rendu. */
export function exemplesDe(slug: string): DeuxExemples | undefined {
  return EXEMPLES[slug];
}

/** Le chemin de la page, sans prefixe de langue (`lien()` l ajoute). */
export const CHEMIN_DEMONSTRATIONS = "/demonstrations";

/**
 * LES TEXTES DE LA PAGE ET DU SCHEMA, dans les deux langues.
 *
 * `mention` EST OBLIGATOIRE (LCD art. 3), visible en tete de page ET sur
 * chaque schema : un schema se partage seul (capture d ecran), et il doit
 * dire seul qu il montre une demande fictive.
 *
 * `etapes` : les quatre temps, LES MEMES dans le texte et dans le schema, pour
 * que l oeil passe de l un a l autre sans traduire.
 *
 * `renvois` : les liens poses vers cette page depuis /metiers et depuis
 * chaque page metier. Ils vivent ici, avec la page qu ils designent.
 */
export const TEXTES_DEMONSTRATIONS = {
  fr: {
    /**
     * TITRE ET META (audit SEO v5) : « IA » et « Genève » y entrent, absents
     * jusqu ici. Le mot « automatisation » en sort : il est la cible du guide
     * /guides/automatisation-ia-pme-geneve, et deux pages sur le meme mot se
     * partagent le classement. Cette page-ci vise les EXEMPLES par metier.
     */
    seoTitre: "Exemples d'assistant IA par métier · PME de Genève",
    seoDescription:
      "Onze métiers, deux exemples chacun : ce qui arrive, ce que l'assistant IA prépare, ce que vous validez. Demandes fictives, PME de Genève.",
    meta: "Démonstrations",
    h1: ["Ce que l'assistant peut faire,", "métier par métier."] as const,
    /** Deux phrases au plus (26.10.2026) : le schema de chaque exemple dit le reste. */
    intro:
      "Deux exemples par métier de ce que l'assistant IA peut préparer pour une PME de Genève, chacun en quatre temps. Il prépare et il propose, vous validez ; seul l'accusé de réception, validé par vous une fois, part seul.",
    mention: "Exemples de démonstration — demandes fictives",
    /** La demonstration filmee en tete de page (components/VideoDemo.tsx). */
    videoLegende:
      "En 40 secondes : une demande arrive, l'assistant la classe et prépare la réponse ; vous la relisez, vous l'envoyez. Démonstration filmée, demandes fictives, noms et adresses floutés.",
    videoLibelle:
      "Démonstration filmée : une boîte mail triée par catégories, un e-mail de client ouvert, l'assistant prépare un brouillon de réponse que le patron relit puis envoie.",
    /** aria-label de la rangee d ancres. */
    ancres: "Aller à un métier",
    etapes: ["Ce qui arrive", "L'assistant prépare", "Vous validez", "Ce qui part"] as const,
    /** Le bouton qui deplie le texte d un exemple (components/Detail.tsx). */
    detail: "Voir le détail",
    /** Le bouton dessine dans le schema : un dessin, pas un controle. */
    bouton: "Valider",
    telephone: "Palier Complet",
    telephoneNote: "Le téléphone fait partie du palier Complet : trois tâches dont le téléphone.",
    /** Le debut de la legende du schema ; le titre de l exemple suit. */
    legende: "Comment ça marche",
    lienMetier: "L'assistant pour ce métier, en détail →",
    finMeta: "La démo",
    finH2: ["Votre métier,", "vos demandes."] as const,
    fin: "Ces exemples sont des demandes fictives. La démo, elle, se fait sur des demandes de votre métier, avant toute signature.",
    fil: { accueil: "Accueil", page: "Démonstrations" },
    renvois: {
      hub: "Les exemples d'automatisation, métier par métier",
      metier: "Deux autres exemples pour ce métier, avec leur schéma →",
    },
  },
  en: {
    seoTitre: "Examples of the AI assistant by trade · Geneva",
    seoDescription:
      "Eleven trades, two examples each: what arrives, what the AI assistant prepares, what you approve. Fictitious enquiries, Geneva small businesses.",
    meta: "Demos",
    h1: ["What the assistant can do,", "trade by trade."] as const,
    intro:
      "Two examples per trade of what the AI assistant can prepare for a Geneva small business, each in four steps. It prepares and it proposes, you approve; only the acknowledgement, approved by you once, goes out on its own.",
    mention: "Demo examples — fictitious enquiries",
    videoLegende:
      "In 40 seconds: an enquiry comes in, the assistant sorts it and drafts the reply; you read it, you send it. Filmed demo, fictitious enquiries, names and addresses blurred.",
    videoLibelle:
      "Filmed demo: an inbox sorted by category, a client email opened, the assistant drafts a reply that the owner reads and then sends.",
    ancres: "Go to a trade",
    etapes: ["What arrives", "The assistant prepares", "You approve", "What goes out"] as const,
    detail: "See the details",
    bouton: "Approve",
    telephone: "Complete tier",
    telephoneNote: "The phone is part of the Complete tier: three tasks including the phone.",
    legende: "How it works",
    lienMetier: "The assistant for this trade, in detail →",
    finMeta: "The demo",
    finH2: ["Your trade,", "your enquiries."] as const,
    fin: "These examples are fictitious enquiries. The demo itself runs on enquiries from your trade, before anything is signed.",
    fil: { accueil: "Home", page: "Demos" },
    renvois: {
      hub: "Examples of automation, trade by trade",
      metier: "Two more examples for this trade, with their diagram →",
    },
  },
} satisfies Record<Locale, unknown>;

export type TextesDemonstrations = (typeof TEXTES_DEMONSTRATIONS)[Locale];
