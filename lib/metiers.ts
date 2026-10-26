import type { Locale } from "@/lib/i18n";

/**
 * LES METIERS — la seule source de donnees des pages `/metiers` (le hub) et
 * `/metiers/<slug>` (une page par metier), dans les deux langues, et des liens
 * de la section (02) de l accueil (components/ServicesRows.tsx).
 *
 * DECISION D AYOUB DU 25 OCTOBRE 2026 : le site parle a TOUTES les PME qui
 * veulent l assistant, plus seulement aux sanitaires. La prospection, elle,
 * continue metier par metier (.agents/product-marketing.md).
 *
 * CE QUE L ASSISTANT « PEUT » FAIRE, JAMAIS CE QU IL « FAIT » CHEZ QUELQU UN.
 * Ayoub sait construire chacune des taches ecrites ici (lecture des bons de
 * regie, prise d appel, relances, preparation de devis, reclamation de pieces,
 * prise de rendez-vous, tri des demandes). Mais le studio n a AUCUN client a
 * ce jour : chaque tache se dit au present de la capacite (« il peut », « nous
 * pouvons l installer »), jamais comme un resultat obtenu ailleurs. La LCD
 * (art. 3) vise les indications trompeuses.
 *
 * LE CONTROLE NE SE NEGOCIE PAS, METIER PAR METIER : il ne s engage jamais a
 * la place du patron ; seul l accuse de reception valide une fois part seul.
 * Au telephone, l assistant suit le meme message d accueil valide, ne promet
 * ni date ni prix, et laisse une fiche ecrite. JAMAIS « rien ne part sans
 * vous » (c est faux : l accuse de reception part seul).
 *
 * RENDEZ-VOUS ET DATES : L ASSISTANT PROPOSE, LE PATRON VALIDE (decision
 * d Ayoub du 25.10.2026). Jamais « rendez-vous pris », « dates confirmées »,
 * « bons de régie lus » : ces participes se lisent comme un resultat obtenu.
 * Le bon de regie se dit en capacite (« l'assistant peut lire vos bons de
 * régie et préparer le rendez-vous »), et un releve type dit « validé par
 * vous », jamais « confirmé » tout court.
 *
 * LE TELEPHONE EST DANS LE PALIER COMPLET, et chaque endroit qui le cite le
 * dit (tache, FAQ, chapo) : un patron qui lit « il peut prendre l'appel »
 * ne doit pas croire l avoir au palier Essentiel.
 *
 * LES DEMOS SONT FICTIVES ET LE DISENT. Chaque metier porte un deroule en
 * quatre etapes (la demande arrive, ce que fait l assistant, ce que vous
 * voyez le soir, le releve du lundi). Le composant qui les rend
 * (components/DemoMetier.tsx) affiche toujours « Exemple de démonstration —
 * demande fictive ». Aucun nom de client, aucun chiffre de resultat : les
 * releves types decrivent des etats (« relance prête »), jamais des compteurs.
 *
 * LES CHIFFRES CITES PORTENT LEUR SOURCE dans la phrase meme (`sources`), et
 * viennent de founder/research/ : OCSTAT T 06.02.2.2.03, decembre 2024
 * (acces-metiers-geneve.md, demande-geneve.md), CCIG 2026, rapport USPI 2025.
 * Un etablissement n est pas une entreprise : les phrases disent
 * « établissements ».
 *
 * EXCLUS, comme dans le prompt de Leo (lib/chat-prompt.ts) : cabinets
 * medicaux, dentaires, de physiotherapie, et avocats (secret professionnel).
 *
 * AUCUN MONTANT ICI. Le seul prix affiche sur une page metier, la mise en
 * place, se lit en base (lib/catalogue.ts) et passe par `avecPrix()` avec sa
 * mention de TVA ; l abonnement s y dit « selon votre volume, palier fixé par
 * écrit à la fin de la démo » — sa grille chiffree vit sur l accueil et
 * /services (components/GrilleAbonnement). L essai dure deux semaines
 * (decision d Ayoub du 25.10.2026) ; aucun autre delai.
 *
 * L ANGLAIS (glossaire docs/agents/brand/glossaire-anglais.md) : anglais
 * britannique, « small business », « property manager » pour une regie et
 * « work order » pour son bon, jamais « agency ».
 *
 * LES SLUGS SONT FRANCAIS DANS LES DEUX LANGUES : `/en/metiers/<slug>`. C est
 * la regle de lib/i18n.ts (`lien` prefixe sans traduire le chemin), et
 * `estTraduit` y reconnait toute la famille `/metiers/`.
 */

/** Le chemin du hub, sans prefixe de langue. */
export const CHEMIN_METIERS = "/metiers";

/** Le chemin d une page metier, sans prefixe de langue. */
export function cheminMetier(slug: string): string {
  return `${CHEMIN_METIERS}/${slug}`;
}

type Item = { titre: string; texte: string };
type Question = { q: string; r: string };

/** Le deroule de demonstration, quatre etapes, textes propres au metier. */
export type DemoMetier = {
  /** Le canal par lequel la demande fictive arrive. */
  canal: string;
  /** La demande, entre guillemets, telle qu un client l ecrirait. */
  demande: string;
  /** Ce que fait l assistant, sans jamais s engager a la place du patron. */
  assistant: string;
  /** Ce que le patron trouve le soir, pret a valider. */
  soir: string;
  /** Une ligne type du releve du lundi : des etats, aucun compteur. */
  releve: string;
};

export type TexteMetier = {
  /** Le nom court du metier : titre de carte, fil d Ariane, liens. */
  nom: string;
  /** Title, ≤ 60 signes, rendu en `absolute` (sans suffixe de marque). */
  seoTitre: string;
  /** Meta description, ≤ 155 signes, sans montant. */
  seoDescription: string;
  /** L etiquette au-dessus du h1. */
  meta: string;
  /** « Assistant IA pour … à Genève. », sur deux lignes. */
  h1: readonly [string, string];
  /** Bloc-reponse autonome : qui, quoi, ou, et le controle. */
  chapo: string;
  /** La carte du hub : ce qui prend ses soirees, ce que l assistant peut faire. */
  carte: { soirees: string; peut: string };
  douleurs: {
    h2: readonly [string, string];
    items: readonly Item[];
    /** Les chiffres sources, chacun avec sa source entre parentheses. Absent quand founder/research/ n en a aucun pour ce metier : on n en invente pas. */
    sources?: string;
  };
  taches: { h2: readonly [string, string]; items: readonly Item[] };
  demo: DemoMetier;
  /**
   * Le controle (04), DIT DANS LES MOTS DU METIER : une phrase propre, puis un
   * lien vers /services#controle, qui porte la liste complete. Six points
   * recopies sur onze pages faisaient l essentiel du texte commun (audit
   * CRO/SEO v3, 3.7).
   */
  controle: string;
  /** Les questions PROPRES au metier, jamais une copie de l accueil. */
  faq: readonly Question[];
  /** `serviceType` du JSON-LD `Service`. */
  serviceType: string;
};

export type Metier = { slug: string } & Record<Locale, TexteMetier>;

/**
 * LES ONZE METIERS, dans l ordre d affichage (hub, accueil, sitemap). Le
 * sanitaire reste en tete : c est le premier metier prospecte.
 */
export const METIERS: readonly Metier[] = [
  {
    slug: "sanitaire-chauffage",
    fr: {
      nom: "Sanitaire et chauffage",
      seoTitre: "Assistant IA pour sanitaires et chauffagistes à Genève",
      seoDescription:
        "L'assistant peut prendre les demandes du chantier, lire vos bons de régie, préparer le rendez-vous, les devis et les relances. Vous validez le soir.",
      meta: "Sanitaire et chauffage · Genève",
      h1: ["Assistant IA pour sanitaires", "et chauffagistes à Genève."],
      chapo:
        "Nawa Corps, studio genevois, installe chez les sanitaires et chauffagistes de Genève un assistant IA qui connaît déjà leur métier. Pendant que vous êtes sur le chantier, il peut prendre les demandes, lire vos bons de régie et préparer le rendez-vous, le devis et sa relance. Pour les appels, il faut le palier Complet : trois tâches dont le téléphone. Il ne s'engage jamais à votre place : la date et le prix restent les vôtres.",
      carte: {
        soirees: "Les demandes reçues pendant le chantier, les devis à écrire, les bons de régie à traiter.",
        peut: "Prendre la demande ou l'appel, lire le bon de régie et préparer le rendez-vous, le devis et sa relance.",
      },
      douleurs: {
        h2: ["Le chantier le jour,", "la paperasse le soir."],
        items: [
          {
            titre: "Vous êtes chez un client.",
            texte:
              "Le téléphone sonne, WhatsApp vibre. Une fuite, un chauffe-eau, un devis à faire. Vous rappellerez ce soir, si vous y pensez.",
          },
          {
            titre: "Les devis qui dorment.",
            texte: "Partis depuis une ou deux semaines. Pas de réponse, et personne n'a eu le temps de relancer.",
          },
          {
            titre: "Les bons de régie.",
            texte:
              "L'ordre arrive de la régie. Il faut joindre le locataire, trouver un créneau, confirmer à la régie.",
          },
          {
            titre: "La paperasse du soir.",
            texte: "Ce qui n'a pas pu se faire sur le chantier attend à la maison : les demandes, les devis, les relances.",
          },
        ],
        sources:
          "Genève compte 441 établissements de sanitaire et de chauffage-ventilation (OCSTAT 2024). Le bâtiment est le premier secteur touché par la pénurie de personnel dans le canton (CCIG 2026).",
      },
      taches: {
        h2: ["Il prépare,", "vous validez."],
        items: [
          {
            titre: "Répondre au téléphone.",
            texte:
              "Quand vous ne pouvez pas décrocher, l'assistant peut prendre l'appel : le nom, l'adresse, ce qui fuit ou ce qui ne chauffe plus, l'urgence. Il ne promet ni date ni prix. Le téléphone fait partie du palier Complet : trois tâches dont le téléphone.",
          },
          {
            titre: "Les demandes du chantier.",
            texte:
              "Un accusé de réception, validé par vous une fois, demande l'adresse, une photo et l'urgence. Le soir, une liste triée, pas une pile.",
          },
          {
            titre: "Les bons de régie.",
            texte:
              "L'assistant peut lire vos bons de régie : l'adresse, le locataire, le travail demandé. Il propose le rendez-vous et prépare la confirmation à la régie. Aucune date ne part sans votre accord.",
          },
          {
            titre: "Préparer le devis.",
            texte:
              "À partir de la demande et des photos, un brouillon de devis dans vos mots. Vous corrigez, vous envoyez.",
          },
          {
            titre: "Relancer les devis.",
            texte: "Le devis reste sans réponse ? Il prépare la relance. Vous la relisez, vous l'envoyez.",
          },
        ],
      },
      demo: {
        canal: "WhatsApp",
        demande:
          "« Bonjour, fuite sous l'évier de la cuisine, ça goutte depuis hier soir. Vous pouvez passer demain ? »",
        assistant:
          "L'accusé de réception que vous avez validé une fois part : il demande l'adresse, une photo de la fuite et si l'eau est coupée. La demande est classée « fuite, urgent ».",
        soir:
          "Une ligne dans votre liste : fuite cuisine, photo jointe, adresse, client disponible demain matin. Le brouillon de réponse attend votre accord pour la date.",
        releve:
          "« Fuite cuisine : réponse et rendez-vous validés par vous. Devis chauffe-eau : sans réponse, relance prête à valider. »",
      },
      faq: [
        {
          q: "Il connaît vraiment le sanitaire et le chauffage ?",
          r: "Nous construisons une base pour votre métier : les demandes types, le vocabulaire, le bon de régie. Puis nous la réglons sur votre entreprise : vos prestations, vos clients, vos mots. La démo se fait sur des demandes de votre métier : vous jugez sur pièces.",
        },
        {
          q: "Et les bons de régie ?",
          r: "L'assistant peut lire vos bons de régie : l'adresse, le locataire, le travail demandé. Il propose le rendez-vous et prépare la confirmation à la régie. Aucune date ne part sans votre accord. Ce qu'il en fait chez vous se règle avec vous, pendant la démo.",
        },
        {
          q: "Il peut répondre au téléphone pendant que je travaille ?",
          r: "Oui, nous pouvons l'installer pour ça : le palier Complet comprend trois tâches dont le téléphone. Il prend le nom, l'adresse, la panne et l'urgence, puis vous laisse une fiche écrite. Il ne fixe aucune date et ne donne aucun prix : c'est vous qui rappelez ou qui validez la réponse.",
        },
        {
          q: "Et les urgences, une fuite un dimanche ?",
          r: "Il repère les mots de l'urgence (fuite, plus d'eau chaude, plus de chauffage) et met la demande en tête de votre liste. Il ne décide pas de partir à votre place : vous choisissez.",
        },
      ],
      controle:
        "Aucune date d'intervention, aucun prix et aucun devis ne part chez le client ou chez la régie sans votre accord. Sur une fuite, il trie l'urgence ; c'est vous qui décidez de partir.",
      serviceType: "Assistant IA pour entreprises de sanitaire et de chauffage",
    },
    en: {
      nom: "Plumbing and heating",
      seoTitre: "AI assistant for plumbers and heating firms in Geneva",
      seoDescription:
        "The assistant can take enquiries from the site, read your work orders, and prepare the appointment, quotes and follow-ups. You approve in the evening.",
      meta: "Plumbing and heating · Geneva",
      h1: ["AI assistant for plumbers", "and heating firms in Geneva."],
      chapo:
        "Nawa Corps, a Geneva studio, sets up for Geneva plumbing and heating firms an AI assistant that already knows their trade. While you are on site, it can take enquiries, read your property managers' work orders, and prepare the appointment, the quote and its follow-up. Calls need the Complete tier: three tasks including the phone. It never commits on your behalf: the date and the price stay yours.",
      carte: {
        soirees: "Enquiries received while on site, quotes to write, work orders to handle.",
        peut: "Take the enquiry or the call, read the work order, prepare the appointment, the quote and its follow-up.",
      },
      douleurs: {
        h2: ["On site by day,", "paperwork by night."],
        items: [
          {
            titre: "You're at a client's.",
            texte:
              "The phone rings, WhatsApp buzzes. A leak, a water heater, a quote to do. You'll call back tonight, if you remember.",
          },
          {
            titre: "Quotes left sleeping.",
            texte: "Sent a week or two ago. No answer, and nobody had time to follow up.",
          },
          {
            titre: "Work orders.",
            texte:
              "The order comes from the property manager. You have to reach the tenant, find a slot, confirm to the property manager.",
          },
          {
            titre: "The evening paperwork.",
            texte: "Whatever couldn't be done on site waits at home: enquiries, quotes, follow-ups.",
          },
        ],
        sources:
          "Geneva has 441 plumbing and heating-ventilation establishments (OCSTAT 2024). Construction is the sector hit hardest by staff shortages in the canton (CCIG 2026).",
      },
      taches: {
        h2: ["It prepares,", "you approve."],
        items: [
          {
            titre: "Answering the phone.",
            texte:
              "When you can't pick up, the assistant can take the call: the name, the address, what is leaking or not heating, the urgency. It promises no date and no price. The phone is part of the Complete tier: three tasks including the phone.",
          },
          {
            titre: "Enquiries from the site.",
            texte:
              "An acknowledgement, approved by you once, asks for the address, a photo and the urgency. In the evening, a sorted list, not a pile.",
          },
          {
            titre: "Work orders.",
            texte:
              "The assistant can read your work orders: the address, the tenant, the work requested. It proposes the appointment and drafts the confirmation to the property manager. No date goes out without your approval.",
          },
          {
            titre: "Drafting the quote.",
            texte:
              "From the enquiry and the photos, a draft quote in your words. You correct it, you send it.",
          },
          {
            titre: "Following up quotes.",
            texte: "A quote with no answer? It drafts the follow-up. You read it, you send it.",
          },
        ],
      },
      demo: {
        canal: "WhatsApp",
        demande:
          "“Hello, leak under the kitchen sink, it's been dripping since last night. Could you come tomorrow?”",
        assistant:
          "The acknowledgement you approved once goes out: it asks for the address, a photo of the leak and whether the water is turned off. The enquiry is filed as “leak, urgent”.",
        soir:
          "One line in your list: kitchen leak, photo attached, address, client free tomorrow morning. The draft reply waits for your approval of the date.",
        releve:
          "“Kitchen leak: reply and appointment approved by you. Water heater quote: no answer, follow-up ready to approve.”",
      },
      faq: [
        {
          q: "Does it really know plumbing and heating?",
          r: "We build a base for your trade: the usual enquiries, the vocabulary, the work order. Then we set it to your business: your services, your clients, your words. The demo runs on enquiries from your trade: you judge on evidence.",
        },
        {
          q: "What about property managers' work orders?",
          r: "The assistant can read your work orders: the address, the tenant, the work requested. It proposes the appointment and drafts the confirmation to the property manager. No date goes out without your approval. What it does with them at your firm is set with you, during the demo.",
        },
        {
          q: "Can it answer the phone while I work?",
          r: "Yes, we can set it up for that: the Complete tier covers three tasks including the phone. It takes the name, the address, the fault and the urgency, then leaves you a written note. It sets no date and gives no price: you call back or approve the reply.",
        },
        {
          q: "What about emergencies, a leak on a Sunday?",
          r: "It spots the words of an emergency (leak, no hot water, no heating) and puts the enquiry at the top of your list. It does not decide to go out for you: you choose.",
        },
      ],
      controle:
        "No call-out date, no price and no quote goes to the client or the property manager without your approval. On a leak, it sorts the urgency; you decide whether to go.",
      serviceType: "AI assistant for plumbing and heating businesses",
    },
  },

  {
    slug: "electricite",
    fr: {
      nom: "Électricité",
      seoTitre: "Assistant IA pour électriciens à Genève",
      seoDescription:
        "L'appel pris quand vous êtes sur l'échelle, les pannes triées, les devis préparés et relancés. Il ne s'engage jamais à votre place. Démo sur votre métier.",
      meta: "Électricité · Genève",
      h1: ["Assistant IA pour électriciens", "à Genève."],
      chapo:
        "Pour les électriciens de Genève, Nawa Corps, studio genevois, installe un assistant IA qui connaît déjà le métier, du disjoncteur qui saute à la borne de recharge. Quand vous êtes sur l'échelle, il peut prendre l'appel (c'est le palier Complet : trois tâches dont le téléphone), séparer la panne du devis, préparer le devis et sa relance. Le prix et l'heure de passage, c'est vous qui les donnez.",
      carte: {
        soirees: "Les appels manqués sur le chantier, les devis à chiffrer, les relances.",
        peut: "Prendre l'appel, trier panne et devis, préparer le devis et sa relance.",
      },
      douleurs: {
        h2: ["L'échelle le jour,", "les devis le soir."],
        items: [
          {
            titre: "Vous êtes sur l'échelle.",
            texte:
              "Le téléphone sonne. Vous rappelez le soir, et le client a peut-être trouvé quelqu'un d'autre.",
          },
          {
            titre: "Panne ou devis ?",
            texte:
              "Un disjoncteur qui saute, une borne de recharge, un tableau à refaire : tout arrive par le même téléphone, sans ordre.",
          },
          {
            titre: "Les devis du soir.",
            texte: "Chiffrer, écrire, envoyer : après le chantier, à la maison.",
          },
          {
            titre: "Les devis sans réponse.",
            texte: "Le client n'a pas rappelé. Vous non plus : pas eu le temps.",
          },
        ],
        sources:
          "Genève compte 291 établissements d'installation électrique (OCSTAT 2024). Le bâtiment est le premier secteur touché par la pénurie de personnel dans le canton (CCIG 2026).",
      },
      taches: {
        h2: ["Il trie et prépare,", "vous décidez."],
        items: [
          {
            titre: "Répondre au téléphone.",
            texte:
              "Les mains dans un tableau, vous ne décrochez pas. L'assistant peut prendre l'appel et noter le nom, l'adresse, ce qui ne marche plus et depuis quand. Ni date ni prix au téléphone. Cette tâche demande le palier Complet : trois tâches dont le téléphone.",
          },
          {
            titre: "Trier les demandes.",
            texte:
              "Panne urgente, dépannage, devis à faire : chaque demande arrive classée, avec l'adresse et une photo du tableau si besoin.",
          },
          {
            titre: "Préparer le devis.",
            texte:
              "Avec la demande et la photo du tableau, il prépare un brouillon de devis. Vous corrigez les montants, puis vous l'envoyez.",
          },
          {
            titre: "Relancer.",
            texte: "Passé le nombre de jours que vous avez fixé, la relance du devis est prête. Vous la relisez avant qu'elle parte.",
          },
          {
            titre: "Prendre rendez-vous.",
            texte: "Il prépare une proposition de créneau pour le client. Aucune date ne part sans votre accord.",
          },
        ],
      },
      demo: {
        canal: "Appel",
        demande:
          "« Bonjour, plus de courant dans la cuisine depuis ce matin, le disjoncteur saute dès que je le remonte. »",
        assistant:
          "Vous êtes sur l'échelle : l'assistant prend l'appel avec le message d'accueil que vous avez validé. Il note le nom, l'adresse, ce qui saute et depuis quand, et classe la demande « panne ».",
        soir:
          "Une fiche écrite : panne cuisine, disjoncteur qui saute, adresse, numéro, client joignable l'après-midi. La réponse avec le créneau attend votre accord.",
        releve:
          "« Panne cuisine : client rappelé, intervention faite. Devis borne de recharge : sans réponse, relance prête à valider. »",
      },
      faq: [
        {
          q: "Il connaît le métier d'électricien ?",
          r: "Nous partons d'une base faite pour l'électricité : les pannes courantes, les mots du métier, les devis qui reviennent. Puis nous l'ajustons à votre entreprise. La démo se fait sur des demandes d'électricité, vous verrez vite s'il suit.",
        },
        {
          q: "Il peut décrocher quand je suis sur un chantier ?",
          r: "Oui, avec le palier Complet, qui compte trois tâches dont le téléphone. Il note le nom, l'adresse et ce qui ne marche plus, puis vous laisse une fiche écrite. Il ne fixe aucune date et ne donne aucun prix.",
        },
        {
          q: "Il fait les devis tout seul ?",
          r: "Non. Il prépare un brouillon à partir de la demande et des photos. Le prix, c'est vous qui le fixez : aucun devis ne part sans votre accord.",
        },
        {
          q: "Et si c'est une vraie urgence ?",
          r: "Il repère les mots de l'urgence (plus de courant, odeur de brûlé, étincelles) et met la demande en tête de votre liste. Il ne donne aucun conseil de sécurité à votre place : c'est vous qui rappelez.",
        },
      ],
      controle:
        "Aucun prix, aucune date d'intervention et aucun conseil de sécurité ne part sans votre accord. Sur une panne qui sent le brûlé, c'est vous qui rappelez.",
      serviceType: "Assistant IA pour entreprises d'installation électrique",
    },
    en: {
      nom: "Electrical work",
      seoTitre: "AI assistant for electricians in Geneva",
      seoDescription:
        "The call taken while you're up the ladder, faults sorted, quotes drafted and followed up. It never commits on your behalf. A demo on your trade.",
      meta: "Electrical work · Geneva",
      h1: ["AI assistant for electricians", "in Geneva."],
      chapo:
        "For Geneva electricians, Nawa Corps, a Geneva studio, sets up an AI assistant that already knows the trade, from the tripping breaker to the charging point. When you are up the ladder, it can take the call (that is the Complete tier: three tasks including the phone), tell a fault from a quote, and draft the quote and its follow-up. The price and the call-out time are yours to give.",
      carte: {
        soirees: "Calls missed on site, quotes to price, follow-ups.",
        peut: "Take the call, sort faults from quotes, draft the quote and its follow-up.",
      },
      douleurs: {
        h2: ["Up the ladder by day,", "quotes by night."],
        items: [
          {
            titre: "You're up the ladder.",
            texte: "The phone rings. You call back in the evening, and the client may have found someone else.",
          },
          {
            titre: "Fault or quote?",
            texte:
              "A tripping breaker, a charging point, a board to redo: it all comes through the same phone, in no order.",
          },
          {
            titre: "Evening quotes.",
            texte: "Pricing, writing, sending: after the site, at home.",
          },
          {
            titre: "Quotes with no answer.",
            texte: "The client didn't call back. Neither did you: no time.",
          },
        ],
        sources:
          "Geneva has 291 electrical installation establishments (OCSTAT 2024). Construction is the sector hit hardest by staff shortages in the canton (CCIG 2026).",
      },
      taches: {
        h2: ["It sorts and drafts,", "you decide."],
        items: [
          {
            titre: "Answering the phone.",
            texte:
              "Hands in a consumer unit, you can't pick up. The assistant can take the call and note the name, the address, what stopped working and since when. No date and no price on the phone. This task needs the Complete tier: three tasks including the phone.",
          },
          {
            titre: "Sorting enquiries.",
            texte:
              "Urgent fault, repair, quote to do: each enquiry arrives sorted, with the address and a photo of the board if needed.",
          },
          {
            titre: "Drafting the quote.",
            texte:
              "With the enquiry and a photo of the board, it drafts the quote. You correct the amounts, then send it.",
          },
          {
            titre: "Following up.",
            texte: "Once the number of days you set has passed, the follow-up is ready. You read it before it goes.",
          },
          {
            titre: "Booking appointments.",
            texte: "It drafts a proposed slot for the client. No date goes out without your approval.",
          },
        ],
      },
      demo: {
        canal: "Phone call",
        demande:
          "“Hello, no power in the kitchen since this morning, the breaker trips as soon as I reset it.”",
        assistant:
          "You're up the ladder: the assistant takes the call with the greeting you approved. It notes the name, the address, what trips and since when, and files the enquiry as “fault”.",
        soir:
          "A written note: kitchen fault, tripping breaker, address, number, client reachable in the afternoon. The reply with the slot waits for your approval.",
        releve:
          "“Kitchen fault: client called back, job done. Charging point quote: no answer, follow-up ready to approve.”",
      },
      faq: [
        {
          q: "Does it know the electrician's trade?",
          r: "We start from a base built for electrical work: the usual faults, the trade's words, the quotes that keep coming back. Then we adjust it to your business. The demo runs on electrical enquiries; you'll soon see whether it keeps up.",
        },
        {
          q: "Can it pick up while I'm on a job?",
          r: "Yes, with the Complete tier, which covers three tasks including the phone. It notes the name, the address and what stopped working, then leaves you a written note. It sets no date and gives no price.",
        },
        {
          q: "Does it write quotes on its own?",
          r: "No. It drafts from the enquiry and the photos. You set the price: no quote goes out without your approval.",
        },
        {
          q: "What if it's a real emergency?",
          r: "It spots the words of an emergency (no power, burning smell, sparks) and puts the enquiry at the top of your list. It gives no safety advice in your place: you call back.",
        },
      ],
      controle:
        "No price, no call-out date and no safety advice goes out without your approval. On a fault that smells of burning, you are the one who calls back.",
      serviceType: "AI assistant for electrical installation businesses",
    },
  },

  {
    slug: "artisans-batiment",
    fr: {
      nom: "Menuiserie, peinture et artisans du bâtiment",
      seoTitre: "Assistant IA pour menuisiers, peintres, carreleurs à Genève",
      seoDescription:
        "Menuisiers, peintres, carreleurs : la demande qualifiée avant le déplacement, le devis préparé et relancé. Vous validez le soir. Démo sur votre métier.",
      meta: "Menuiserie, peinture, carrelage · Genève",
      h1: ["Assistant IA pour artisans", "du bâtiment à Genève."],
      chapo:
        "Menuisiers, peintres, carreleurs de Genève : Nawa Corps, studio genevois, installe chez vous un assistant IA qui connaît déjà votre métier. Avant que vous vous déplaciez, il peut demander les photos et les mesures, puis préparer le devis et le relancer. Il prend aussi les appels avec le palier Complet, qui compte trois tâches dont le téléphone. Le déplacement et le prix, c'est vous qui en décidez.",
      carte: {
        soirees: "Les demandes de devis à comprendre, les visites pour rien, les devis sans réponse.",
        peut: "Demander photos et mesures avant la visite, préparer le devis, le relancer.",
      },
      douleurs: {
        h2: ["Les devis gratuits", "qui restent sans suite."],
        items: [
          {
            titre: "Le déplacement pour rien.",
            texte: "Vous passez voir le chantier, vous mesurez, vous chiffrez. Puis plus rien.",
          },
          {
            titre: "Les demandes floues.",
            texte: "« Repeindre un appartement », sans surface, sans photo, sans date.",
          },
          {
            titre: "Le client qui attend.",
            texte: "Le devis n'est pas encore parti, le client relance, puis il s'agace.",
          },
          {
            titre: "Le soir et le week-end.",
            texte: "Les devis, les commandes, les réponses : après le chantier.",
          },
        ],
        sources:
          "Genève compte 626 établissements de peinture et de plâtrerie (OCSTAT 2024). Le bâtiment est le premier secteur touché par la pénurie de personnel dans le canton (CCIG 2026).",
      },
      taches: {
        h2: ["Les photos d'abord,", "la visite ensuite."],
        items: [
          {
            titre: "Qualifier la demande.",
            texte:
              "Avant le déplacement, l'accusé de réception que vous avez validé une fois demande des photos, les mesures approximatives et la date souhaitée.",
          },
          {
            titre: "Répondre au téléphone.",
            texte:
              "Sur un échafaudage, on ne décroche pas. L'assistant peut prendre l'appel et vous laisser une fiche : qui, où, quels travaux. Il ne promet ni date ni prix. Cette tâche fait partie du palier Complet : trois tâches dont le téléphone.",
          },
          {
            titre: "Préparer le devis.",
            texte:
              "Vos mesures et les photos du client deviennent un brouillon, poste par poste : ponçage, sous-couche, deux couches. Vous ajustez les montants avant l'envoi.",
          },
          {
            titre: "Relancer le devis.",
            texte:
              "Sans réponse au devis, il prépare la relance. Elle attend votre accord, ce qui évite de relancer un client qui a déjà signé.",
          },
          {
            titre: "Prendre rendez-vous.",
            texte: "Il prépare une proposition de créneau pour la visite. Aucune date ne part sans votre accord.",
          },
        ],
      },
      demo: {
        canal: "Formulaire du site",
        demande:
          "« Bonjour, nous voudrions repeindre notre appartement avant un déménagement. Vous faites des devis ? »",
        assistant:
          "L'accusé de réception validé une fois part : il demande des photos des pièces, la surface approximative et la date du déménagement. La demande est classée « devis peinture ».",
        soir:
          "Une fiche : appartement, photos jointes, surface indiquée, déménagement à la fin du mois. Une proposition de visite attend votre accord.",
        releve:
          "« Devis peinture : visite faite, devis envoyé après votre accord. Devis parquet : sans réponse, relance prête à valider. »",
      },
      faq: [
        {
          q: "Mon métier est un peu différent, ça marche aussi ?",
          r: "Menuiserie, peinture, carrelage, maçonnerie : chaque métier a sa base, avec ses mots et ses postes de devis. Nous la réglons ensuite sur vos prestations, et la démo se fait sur des demandes de votre métier.",
        },
        {
          q: "Il peut m'éviter les déplacements pour rien ?",
          r: "Il ne décide pas à votre place. Il demande les photos, les mesures et la date avant la visite : vous jugez avec une demande complète sous les yeux.",
        },
        {
          q: "Il risque de relancer un client qui a déjà signé ?",
          r: "Non : aucune relance ne part sans votre accord. Vous voyez la liste le soir, et vous retirez ce qui est signé.",
        },
        {
          q: "Il peut prendre les appels ?",
          r: "Oui, si vous prenez le palier Complet : trois tâches dont le téléphone. Vous retrouvez une fiche écrite avec le nom, l'adresse et le travail demandé. Au téléphone, il ne donne aucun prix.",
        },
      ],
      controle:
        "Aucun devis, aucun prix et aucune date de passage ne part sans votre accord. Il qualifie la demande ; c'est vous qui décidez du déplacement.",
      serviceType: "Assistant IA pour artisans du bâtiment",
    },
    en: {
      nom: "Joinery, painting and building trades",
      seoTitre: "AI assistant for building tradespeople in Geneva",
      seoDescription:
        "Joiners, painters, tilers: the enquiry qualified before you travel, the quote drafted and followed up. You approve in the evening. A demo on your trade.",
      meta: "Joinery, painting, tiling · Geneva",
      h1: ["AI assistant for building", "tradespeople in Geneva."],
      chapo:
        "Joiners, painters, tilers in Geneva: Nawa Corps, a Geneva studio, sets up an AI assistant for you that already knows your trade. Before you travel, it can ask for photos and measurements, then draft the quote and follow it up. It also takes calls with the Complete tier, which covers three tasks including the phone. Whether to travel, and the price, are your call.",
      carte: {
        soirees: "Quote requests to make sense of, wasted site visits, quotes with no answer.",
        peut: "Ask for photos and measurements before the visit, draft the quote, follow it up.",
      },
      douleurs: {
        h2: ["Free quotes", "that go nowhere."],
        items: [
          {
            titre: "The wasted trip.",
            texte: "You go and see the job, you measure, you price it. Then nothing.",
          },
          {
            titre: "Vague enquiries.",
            texte: "“Repaint a flat”, with no surface area, no photo, no date.",
          },
          {
            titre: "The client who's waiting.",
            texte: "The quote hasn't gone out yet, the client chases, then gets annoyed.",
          },
          {
            titre: "Evenings and weekends.",
            texte: "Quotes, orders, replies: after the site.",
          },
        ],
        sources:
          "Geneva has 626 painting and plastering establishments (OCSTAT 2024). Construction is the sector hit hardest by staff shortages in the canton (CCIG 2026).",
      },
      taches: {
        h2: ["Photos first,", "the visit after."],
        items: [
          {
            titre: "Qualifying the enquiry.",
            texte:
              "Before you travel, the acknowledgement you approved once asks for photos, rough measurements and the preferred date.",
          },
          {
            titre: "Answering the phone.",
            texte:
              "Up on scaffolding, you don't pick up. The assistant can take the call and leave you a note: who, where, what work. It promises no date and no price. This task is part of the Complete tier: three tasks including the phone.",
          },
          {
            titre: "Drafting the quote.",
            texte:
              "Your measurements and the client's photos become a draft, line by line: sanding, undercoat, two coats. You adjust the amounts before it goes.",
          },
          {
            titre: "Following up the quote.",
            texte:
              "No answer to the quote, so it drafts the follow-up. It waits for your approval, which saves you chasing a client who has already signed.",
          },
          {
            titre: "Booking the visit.",
            texte: "It drafts a proposed slot for the visit. No date goes out without your approval.",
          },
        ],
      },
      demo: {
        canal: "Website form",
        demande: "“Hello, we'd like to repaint our flat before we move. Do you do quotes?”",
        assistant:
          "The acknowledgement approved once goes out: it asks for photos of the rooms, the rough surface area and the moving date. The enquiry is filed as “painting quote”.",
        soir:
          "A note: flat, photos attached, surface area given, moving at the end of the month. A proposed visit waits for your approval.",
        releve:
          "“Painting quote: visit done, quote sent after your approval. Parquet quote: no answer, follow-up ready to approve.”",
      },
      faq: [
        {
          q: "My trade is a bit different. Does it still work?",
          r: "Joinery, painting, tiling, masonry: each trade has its own base, with its words and its quote lines. We then set it to your services, and the demo runs on enquiries from your trade.",
        },
        {
          q: "Can it save me wasted trips?",
          r: "It does not decide for you. It asks for photos, measurements and the date before the visit: you judge with a complete enquiry in front of you.",
        },
        {
          q: "Could it chase a client who has already signed?",
          r: "No: no follow-up goes out without your approval. You see the list in the evening, and you remove what is signed.",
        },
        {
          q: "Can it take calls?",
          r: "Yes, if you take the Complete tier: three tasks including the phone. You get a written note with the name, the address and the work requested. On the phone, it gives no price.",
        },
      ],
      controle:
        "No quote, no price and no visit date goes out without your approval. It qualifies the enquiry; you decide whether to travel.",
      serviceType: "AI assistant for building trades businesses",
    },
  },

  {
    slug: "regies-immobilieres",
    fr: {
      nom: "Régies immobilières",
      seoTitre: "Assistant IA pour régies immobilières à Genève",
      seoDescription:
        "Les demandes des locataires triées, les photos demandées, le bon d'intervention préparé, les appels pris. Le gérant valide. Démo sur votre métier.",
      meta: "Régies et gérances · Genève",
      h1: ["Assistant IA pour régies", "immobilières à Genève."],
      chapo:
        "Nawa Corps, studio genevois, installe dans les régies de Genève un assistant IA qui connaît déjà la gérance, du bon d'intervention au dégât d'eau en cave. Il peut trier les demandes des locataires, réclamer les photos, préparer le bon d'intervention et prendre les appels, ces derniers avec le palier Complet (trois tâches dont le téléphone). Il aide le gérant sans le remplacer, et ne s'engage jamais à sa place.",
      carte: {
        soirees: "Les demandes des locataires, par téléphone, e-mail et courrier, et les bons d'intervention.",
        peut: "Trier chaque demande, demander les photos, préparer le bon d'intervention, prendre l'appel.",
      },
      douleurs: {
        h2: ["Trop d'immeubles,", "trop de messages."],
        items: [
          {
            titre: "Les locataires, tous les jours.",
            texte: "Une panne, une fuite, une plainte : par téléphone, par e-mail, par courrier, sans ordre.",
          },
          {
            titre: "Les demandes incomplètes.",
            texte: "Pas d'étage, pas de photo, pas de disponibilités. Il faut rappeler pour comprendre.",
          },
          {
            titre: "Les artisans à coordonner.",
            texte: "Le bon d'intervention, le créneau avec le locataire, le suivi après la réparation.",
          },
          {
            titre: "Entre locataire et propriétaire.",
            texte: "Le gérant est au milieu, et c'est lui qu'on rappelle.",
          },
        ],
        sources:
          "À Genève, les 36 régies membres de l'USPI gèrent environ 70 % du parc locatif (rapport USPI 2025).",
      },
      taches: {
        h2: ["Il prépare,", "le gérant valide."],
        items: [
          {
            titre: "Trier les demandes.",
            texte:
              "Chaque demande de locataire est lue et classée : panne, sinistre, plainte, administratif, avec son urgence.",
          },
          {
            titre: "Accuser réception.",
            texte:
              "Le locataire reçoit tout de suite l'accusé de réception que vous avez validé une fois. Il demande l'étage, une photo et les disponibilités.",
          },
          {
            titre: "Préparer le bon d'intervention.",
            texte:
              "Pour l'artisan habituel, avec l'adresse, le locataire et le travail demandé. Le gérant valide avant l'envoi.",
          },
          {
            titre: "Répondre au téléphone.",
            texte:
              "Quand la ligne sonne occupé, l'assistant peut prendre l'appel du locataire et en faire une fiche écrite. Il ne promet ni date ni prise en charge. C'est le palier Complet : trois tâches dont le téléphone.",
          },
          {
            titre: "Relancer après l'intervention.",
            texte: "Il prépare le message « c'est réglé ? » pour le locataire. Le gérant le valide.",
          },
        ],
      },
      demo: {
        canal: "E-mail",
        demande:
          "« Bonjour, le radiateur de la chambre ne chauffe plus depuis deux jours. Appartement au 3e, porte de gauche. »",
        assistant:
          "L'accusé de réception validé une fois répond au locataire et demande une photo du radiateur et ses disponibilités. La demande est classée « chauffage, cette semaine ».",
        soir:
          "Un bon d'intervention prêt pour le chauffagiste habituel : adresse, locataire, travail demandé, disponibilités. Il attend la validation du gérant.",
        releve:
          "« Radiateur chambre : bon validé, intervention faite, locataire recontacté. Fuite en cave : photos reçues, bon à valider. »",
      },
      faq: [
        {
          q: "Il remplace le gérant ?",
          r: "Non. Il reprend le tri et la préparation : il lit, classe, demande ce qui manque et prépare le bon. Le gérant décide et répond sur le fond.",
        },
        {
          q: "Il travaille avec notre logiciel de gérance ?",
          r: "Ce que l'assistant peut lire ou écrire dans vos outils se vérifie outil par outil, avec vous. Nous ne promettons pas un branchement avant de l'avoir testé. Pour la démo, aucun accès à vos outils.",
        },
        {
          q: "Et les données des locataires ?",
          r: "Les données de votre assistant sont hébergées en Suisse, sous la nLPD. Pour la démo, vous n'avez rien à nous transmettre : elle se fait sur des demandes fictives.",
        },
        {
          q: "Il peut prendre les appels des locataires ?",
          r: "Oui, avec le palier Complet, qui compte trois tâches dont le téléphone. Le gérant reçoit une fiche écrite : nom, adresse, problème, urgence. Au téléphone, il ne promet ni date ni prise en charge.",
        },
      ],
      controle:
        "Aucune prise en charge, aucune date d'intervention et aucune réponse de fond au locataire ne part sans l'accord du gérant. Le bon d'intervention reste un brouillon jusqu'à sa validation.",
      serviceType: "Assistant IA pour régies immobilières",
    },
    en: {
      nom: "Property managers",
      seoTitre: "AI assistant for property managers in Geneva",
      seoDescription:
        "Tenants' requests sorted, photos asked for, the work order drafted, calls taken. The manager approves. A demo on your trade.",
      meta: "Property management · Geneva",
      h1: ["AI assistant for property", "managers in Geneva."],
      chapo:
        "Nawa Corps, a Geneva studio, sets up for Geneva property managers an AI assistant that already knows property management, from the work order to the flooded cellar. It can sort tenants' requests, ask for photos, draft the work order and take calls, the last with the Complete tier (three tasks including the phone). It helps the manager without replacing them, and never commits on their behalf.",
      carte: {
        soirees: "Tenants' requests by phone, email and post, and the work orders.",
        peut: "Sort each request, ask for photos, draft the work order, take the call.",
      },
      douleurs: {
        h2: ["Too many buildings,", "too many messages."],
        items: [
          {
            titre: "Tenants, every day.",
            texte: "A breakdown, a leak, a complaint: by phone, by email, by post, in no order.",
          },
          {
            titre: "Incomplete requests.",
            texte: "No floor, no photo, no availability. You have to call back to understand.",
          },
          {
            titre: "Tradespeople to coordinate.",
            texte: "The work order, the slot with the tenant, the follow-up after the repair.",
          },
          {
            titre: "Between tenant and owner.",
            texte: "The manager is in the middle, and the one everyone calls.",
          },
        ],
        sources:
          "In Geneva, the 36 property managers in the USPI manage about 70% of the rental stock (USPI 2025 report).",
      },
      taches: {
        h2: ["It prepares,", "the manager approves."],
        items: [
          {
            titre: "Sorting requests.",
            texte:
              "Each tenant request is read and filed: breakdown, damage, complaint, admin, with its urgency.",
          },
          {
            titre: "Acknowledging.",
            texte:
              "The tenant at once gets the acknowledgement you approved once. It asks for the floor, a photo and their availability.",
          },
          {
            titre: "Drafting the work order.",
            texte:
              "For the usual tradesperson, with the address, the tenant and the work requested. The manager approves before it goes out.",
          },
          {
            titre: "Answering the phone.",
            texte:
              "When the line is busy, the assistant can take the tenant's call and turn it into a written note. It promises no date and no commitment. That is the Complete tier: three tasks including the phone.",
          },
          {
            titre: "Following up after the job.",
            texte: "It drafts the “all sorted?” message for the tenant. The manager approves it.",
          },
        ],
      },
      demo: {
        canal: "Email",
        demande:
          "“Hello, the bedroom radiator hasn't worked for two days. Third-floor flat, door on the left.”",
        assistant:
          "The acknowledgement approved once replies to the tenant and asks for a photo of the radiator and their availability. The request is filed as “heating, this week”.",
        soir:
          "A work order ready for the usual heating engineer: address, tenant, work requested, availability. It waits for the manager's approval.",
        releve:
          "“Bedroom radiator: work order approved, job done, tenant contacted again. Cellar leak: photos received, work order to approve.”",
      },
      faq: [
        {
          q: "Does it replace the manager?",
          r: "No. It takes over the sorting and the preparation: it reads, files, asks for what is missing and drafts the work order. The manager decides and replies on substance.",
        },
        {
          q: "Does it work with our property management software?",
          r: "What the assistant can read or write in your tools is checked tool by tool, with you. We do not promise a connection before we have tested it. For the demo, no access to your tools.",
        },
        {
          q: "What about tenants' data?",
          r: "Your assistant's data is hosted in Switzerland, under the nFADP. For the demo, you have nothing to send us: it runs on fictitious requests.",
        },
        {
          q: "Can it take tenants' calls?",
          r: "Yes, with the Complete tier, which covers three tasks including the phone. The manager gets a written note: name, address, problem, urgency. On the phone, it promises no date and no commitment.",
        },
      ],
      controle:
        "No acceptance of liability, no call-out date and no real reply to a tenant goes out without the manager's approval. The work order stays a draft until it is approved.",
      serviceType: "AI assistant for property management firms",
    },
  },

  {
    slug: "agences-immobilieres",
    fr: {
      nom: "Agences immobilières",
      seoTitre: "Assistant IA pour agences immobilières à Genève",
      seoDescription:
        "Les demandes des portails reçues le soir, les visites préparées, les anciens propriétaires relancés. Vous validez. Démo sur votre métier.",
      meta: "Courtage · Genève",
      h1: ["Assistant IA pour agences", "immobilières à Genève."],
      chapo:
        "Nawa Corps, studio genevois, installe dans les agences immobilières de Genève un assistant IA qui connaît déjà le courtage, des portails aux visites. Il peut accuser réception d'une demande de portail le dimanche soir, préparer les visites et les messages aux anciens contacts propriétaires. Les créneaux et les prix, c'est vous qui les validez.",
      carte: {
        soirees: "Les demandes des portails le soir et le week-end, les anciens propriétaires jamais rappelés.",
        peut: "Accuser réception, préparer les visites, relancer les anciens contacts propriétaires.",
      },
      douleurs: {
        h2: ["Joignable le soir,", "sinon l'affaire part."],
        items: [
          {
            titre: "Les demandes du soir.",
            texte: "Un acheteur écrit le dimanche soir depuis un portail. Le lendemain, il a visité ailleurs.",
          },
          {
            titre: "Les mêmes questions.",
            texte: "Les charges, l'étage, la disponibilité, le parking : les mêmes réponses, annonce après annonce.",
          },
          {
            titre: "Les visites à caler.",
            texte: "Trouver l'heure qui convient à tout le monde, puis gérer l'annulation de la veille.",
          },
          {
            titre: "Les anciens propriétaires.",
            texte: "Ceux qui pensaient vendre il y a quelques années, et que personne n'a rappelés.",
          },
        ],
        sources:
          "Genève compte 439 établissements classés « agences immobilières », dont une part de régies (OCSTAT 2024).",
      },
      taches: {
        h2: ["Il prépare le dimanche,", "vous validez le lundi."],
        items: [
          {
            titre: "Accuser réception.",
            texte:
              "L'accusé de réception validé une fois répond à l'acheteur, à toute heure, et lui demande ce qu'il cherche et ses disponibilités.",
          },
          {
            titre: "Répondre aux questions de l'annonce.",
            texte: "Les charges, la surface, l'étage : il prépare la réponse tirée de l'annonce. Vous validez avant l'envoi.",
          },
          {
            titre: "Préparer les visites.",
            texte: "Il propose des créneaux et prépare la confirmation. Aucune date ne part sans votre accord.",
          },
          {
            titre: "Relancer les anciens propriétaires.",
            texte:
              "Il prépare des messages pour les contacts propriétaires restés sans suite. Vous choisissez à qui, vous validez quoi.",
          },
          {
            titre: "Répondre au téléphone.",
            texte:
              "Pendant une visite, vous ne décrochez pas. L'assistant peut prendre l'appel et vous laisser une fiche écrite, sans promettre de date ni de prix. Le téléphone demande le palier Complet : trois tâches dont le téléphone.",
          },
        ],
      },
      demo: {
        canal: "Portail immobilier",
        demande: "« Bonjour, l'appartement est-il toujours disponible ? Nous pourrions visiter samedi. »",
        assistant:
          "L'accusé de réception validé une fois répond : il demande les disponibilités exactes et si le financement est prêt. La demande est rattachée à l'annonce.",
        soir:
          "La liste des visites proposées pour samedi, avec les réponses aux questions déjà posées. Les confirmations attendent votre accord.",
        releve:
          "« Appartement : visites validées par vous. Anciens propriétaires : messages prêts, à valider. »",
      },
      faq: [
        {
          q: "Il répond aux acheteurs à ma place ?",
          r: "Seul l'accusé de réception que vous avez validé une fois part seul. Les réponses de fond, les créneaux et tout ce qui touche au prix attendent votre accord.",
        },
        {
          q: "Il peut répondre le soir et le week-end ?",
          r: "L'accusé de réception part à toute heure. Le reste vous attend dans une liste triée, avec un brouillon de réponse.",
        },
        {
          q: "Il peut relancer nos anciens contacts propriétaires ?",
          r: "Il prépare les messages. Vous choisissez à qui ils partent et vous les validez. Ce que l'assistant peut lire dans votre fichier se vérifie avec vous, outil par outil.",
        },
        {
          q: "Il fonctionne avec les portails ?",
          r: "Les demandes qui arrivent par e-mail depuis un portail se traitent comme les autres. Le branchement direct se vérifie portail par portail : nous ne le promettons pas avant de l'avoir testé.",
        },
      ],
      controle:
        "Aucune date de visite, aucune estimation et aucun prix ne part sans votre accord. Il propose les créneaux aux demandes des portails ; c'est vous qui les confirmez.",
      serviceType: "Assistant IA pour agences immobilières",
    },
    en: {
      nom: "Estate agents",
      seoTitre: "AI assistant for estate agents in Geneva",
      seoDescription:
        "Portal enquiries received in the evening, viewings prepared, past owners followed up. You approve. A demo on your trade.",
      meta: "Estate agency · Geneva",
      h1: ["AI assistant for estate", "agents in Geneva."],
      chapo:
        "Nawa Corps, a Geneva studio, sets up for Geneva estate agents an AI assistant that already knows the business, from the portals to the viewings. It can acknowledge a portal enquiry on a Sunday evening, prepare viewings and draft messages to past owner contacts. Slots and prices are yours to approve.",
      carte: {
        soirees: "Portal enquiries in the evening and at weekends, past owners never called back.",
        peut: "Acknowledge, prepare viewings, follow up past owner contacts.",
      },
      douleurs: {
        h2: ["Reachable in the evening,", "or the deal walks."],
        items: [
          {
            titre: "Evening enquiries.",
            texte: "A buyer writes on Sunday evening from a portal. The next day, they have viewed elsewhere.",
          },
          {
            titre: "The same questions.",
            texte: "Service charges, floor, availability, parking: the same answers, listing after listing.",
          },
          {
            titre: "Viewings to fit in.",
            texte: "Finding a time that suits everyone, then handling the cancellation the day before.",
          },
          {
            titre: "Past owners.",
            texte: "Those who thought of selling a few years ago, and whom nobody called back.",
          },
        ],
        sources:
          "Geneva has 439 establishments classed as “estate agencies”, some of them property managers (OCSTAT 2024).",
      },
      taches: {
        h2: ["It drafts on Sunday,", "you approve on Monday."],
        items: [
          {
            titre: "Acknowledging.",
            texte:
              "The acknowledgement approved once replies to the buyer, at any hour, and asks what they are looking for and when they are free.",
          },
          {
            titre: "Answering listing questions.",
            texte: "Service charges, surface area, floor: it drafts the answer from the listing. You approve before it goes out.",
          },
          {
            titre: "Preparing viewings.",
            texte: "It proposes slots and drafts the confirmation. No date goes out without your approval.",
          },
          {
            titre: "Following up past owners.",
            texte:
              "It drafts messages for owner contacts left without follow-up. You choose who, you approve what.",
          },
          {
            titre: "Answering the phone.",
            texte:
              "During a viewing, you don't pick up. The assistant can take the call and leave you a written note, without promising a date or a price. The phone needs the Complete tier: three tasks including the phone.",
          },
        ],
      },
      demo: {
        canal: "Property portal",
        demande: "“Hello, is the flat still available? We could view on Saturday.”",
        assistant:
          "The acknowledgement approved once replies: it asks for exact availability and whether financing is ready. The enquiry is linked to the listing.",
        soir:
          "The list of viewings proposed for Saturday, with answers to the questions already asked. The confirmations wait for your approval.",
        releve: "“Flat: viewings approved by you. Past owners: messages ready to approve.”",
      },
      faq: [
        {
          q: "Does it answer buyers in my place?",
          r: "Only the acknowledgement you approved once goes out on its own. Real replies, slots and anything about price wait for your approval.",
        },
        {
          q: "Can it reply in the evening and at weekends?",
          r: "The acknowledgement goes out at any hour. The rest waits for you in a sorted list, with a draft reply.",
        },
        {
          q: "Can it follow up our past owner contacts?",
          r: "It drafts the messages. You choose who they go to and you approve them. What the assistant can read in your files is checked with you, tool by tool.",
        },
        {
          q: "Does it work with the portals?",
          r: "Enquiries that arrive by email from a portal are handled like the others. A direct connection is checked portal by portal: we do not promise it before we have tested it.",
        },
      ],
      controle:
        "No viewing date, no valuation and no price goes out without your approval. It proposes slots to portal enquiries; you are the one who confirms them.",
      serviceType: "AI assistant for estate agencies",
    },
  },

  {
    slug: "fiduciaires",
    fr: {
      nom: "Fiduciaires",
      seoTitre: "Assistant IA pour fiduciaires à Genève",
      seoDescription:
        "Les pièces manquantes réclamées, ce qui arrive trié, les dossiers incomplets listés chaque lundi. Vous validez chaque envoi. Démo sur votre métier.",
      meta: "Fiduciaires et comptables · Genève",
      h1: ["Assistant IA pour fiduciaires", "à Genève."],
      chapo:
        "Nawa Corps, studio genevois, installe dans les fiduciaires de Genève un assistant IA qui sait déjà ce qu'est un certificat de salaire ou une attestation de 3e pilier. Il peut préparer la demande des pièces manquantes, trier ce qui arrive et vous dire chaque lundi quels dossiers attendent encore. Il ne s'engage jamais à votre place : vous validez.",
      carte: {
        soirees: "Les pièces à réclamer aux clients, encore et encore, et les e-mails du soir.",
        peut: "Réclamer les pièces manquantes, trier ce qui arrive, tenir la liste des dossiers incomplets.",
      },
      douleurs: {
        h2: ["Courir après", "les pièces."],
        items: [
          {
            titre: "Les pièces qui manquent.",
            texte: "Le certificat de salaire, l'attestation de 3e pilier, les relevés : il en manque toujours une.",
          },
          {
            titre: "Les relances à la main.",
            texte: "Un e-mail, puis un autre, puis un appel. Client par client.",
          },
          {
            titre: "Les e-mails du soir.",
            texte: "Les clients écrivent quand ils ont le temps : le soir, le dimanche.",
          },
          {
            titre: "Les échéances.",
            texte: "TVA, bouclements, déclarations : tout dépend de ce que le client envoie, et quand.",
          },
        ],
        sources: "Genève compte 1 041 établissements d'activités comptables et fiduciaires (OCSTAT 2024).",
      },
      taches: {
        h2: ["Il tient la liste,", "vous validez l'envoi."],
        items: [
          {
            titre: "Réclamer les pièces.",
            texte:
              "Pour chaque client, il prépare la liste exacte de ce qui manque, dans le ton du cabinet. Vous validez avant l'envoi.",
          },
          {
            titre: "Trier ce qui arrive.",
            texte: "Il reconnaît la pièce reçue, la classe dans le bon dossier et la raye de la liste.",
          },
          {
            titre: "Relancer.",
            texte: "Toujours pas de certificat de salaire ? La relance attend dans votre liste. Vous la relisez avant l'envoi.",
          },
          {
            titre: "Accuser réception.",
            texte:
              "« Vous avez bien reçu mon document ? » : l'accusé de réception que vous avez validé une fois répond. Le reste attend votre accord.",
          },
          {
            titre: "Le relevé du lundi.",
            texte: "Client par client, ce qui est arrivé et ce qui manque encore.",
          },
        ],
      },
      demo: {
        canal: "E-mail",
        demande:
          "« Bonjour, il me manque mon certificat de salaire, mon employeur ne me l'a pas encore envoyé. Je vous envoie le reste ? »",
        assistant:
          "L'accusé de réception validé une fois répond et rappelle ce qui manque encore au dossier. Les pièces reçues sont classées et rayées de la liste.",
        soir:
          "Le dossier du client, à jour : ce qui est arrivé, ce qui manque (le certificat de salaire). Une relance prête pour la semaine suivante, à valider.",
        releve:
          "« Dossier fiscal : certificat de salaire toujours attendu, relance validée. Autres pièces : reçues et classées. »",
      },
      faq: [
        {
          q: "Il écrit à mes clients sans moi ?",
          r: "Un seul message part seul : l'accusé de réception que vous avez validé une fois. Les demandes de pièces et les relances attendent votre accord.",
        },
        {
          q: "Et la confidentialité des dossiers ?",
          r: "Les données de votre assistant sont hébergées en Suisse, sous la nLPD. Pour la démo, vous n'avez rien à nous transmettre : elle se fait sur des demandes fictives. Ce que l'assistant voit de vos dossiers se règle avec vous, avant l'essai.",
        },
        {
          q: "Il fonctionne avec notre logiciel comptable ?",
          r: "Ce que l'assistant peut lire dans vos outils se vérifie outil par outil, avec vous. Nous ne promettons pas un branchement avant de l'avoir testé.",
        },
        {
          q: "Il trie aussi les e-mails des clients ?",
          r: "Oui : il classe ce qui arrive (pièce, question, demande de rendez-vous) et prépare les réponses simples. Vous validez chaque réponse de fond.",
        },
      ],
      controle:
        "Aucun chiffre, aucun conseil et aucune réponse de fond ne part au client sans votre accord. Il réclame les pièces ; le dossier reste le vôtre.",
      serviceType: "Assistant IA pour fiduciaires",
    },
    en: {
      nom: "Accounting firms (fiduciaries)",
      seoTitre: "AI assistant for accounting firms in Geneva",
      seoDescription:
        "Missing documents chased, what comes in sorted, incomplete files listed every Monday. You approve every message. A demo on your trade.",
      meta: "Accounting firms · Geneva",
      h1: ["AI assistant for accounting", "firms in Geneva."],
      chapo:
        "Nawa Corps, a Geneva studio, sets up for Geneva accounting firms (fiduciaries) an AI assistant that already knows what a salary certificate or a pillar 3a statement is. It can draft requests for missing documents, sort what comes in and tell you every Monday which files are still waiting. It never commits on your behalf: you approve.",
      carte: {
        soirees: "Documents to chase from clients, again and again, and evening emails.",
        peut: "Chase missing documents, sort what comes in, keep the list of incomplete files.",
      },
      douleurs: {
        h2: ["Chasing", "documents."],
        items: [
          {
            titre: "The missing documents.",
            texte: "The salary certificate, the pillar 3a statement, the bank statements: there's always one missing.",
          },
          {
            titre: "Chasing by hand.",
            texte: "One email, then another, then a call. Client by client.",
          },
          {
            titre: "Evening emails.",
            texte: "Clients write when they have time: in the evening, on Sunday.",
          },
          {
            titre: "Deadlines.",
            texte: "VAT, year-end closing, tax returns: it all depends on what the client sends, and when.",
          },
        ],
        sources: "Geneva has 1,041 accounting and fiduciary establishments (OCSTAT 2024).",
      },
      taches: {
        h2: ["It keeps the list,", "you approve what goes."],
        items: [
          {
            titre: "Chasing documents.",
            texte:
              "For each client, it drafts the exact list of what is missing, in the firm's tone. You approve before it goes out.",
          },
          {
            titre: "Sorting what comes in.",
            texte: "It recognises the document received, files it in the right folder and ticks it off the list.",
          },
          {
            titre: "Following up.",
            texte: "Still no salary certificate? The follow-up waits in your list. You read it before it goes.",
          },
          {
            titre: "Acknowledging.",
            texte:
              "“Did you get my document?”: the acknowledgement you approved once replies. The rest waits for your approval.",
          },
          {
            titre: "The Monday report.",
            texte: "Client by client, what has arrived and what is still missing.",
          },
        ],
      },
      demo: {
        canal: "Email",
        demande:
          "“Hello, I'm missing my salary certificate, my employer hasn't sent it yet. Shall I send you the rest?”",
        assistant:
          "The acknowledgement approved once replies and lists what is still missing from the file. Documents received are filed and ticked off the list.",
        soir:
          "The client's file, up to date: what has arrived, what is missing (the salary certificate). A follow-up ready for next week, to approve.",
        releve: "“Tax file: salary certificate still awaited, follow-up approved. Other documents: received and filed.”",
      },
      faq: [
        {
          q: "Does it write to my clients without me?",
          r: "Only one message goes out on its own: the acknowledgement you approved once. Document requests and follow-ups wait for your approval.",
        },
        {
          q: "What about the confidentiality of files?",
          r: "Your assistant's data is hosted in Switzerland, under the nFADP. For the demo, you have nothing to send us: it runs on fictitious requests. What the assistant sees of your files is set with you, before the trial.",
        },
        {
          q: "Does it work with our accounting software?",
          r: "What the assistant can read in your tools is checked tool by tool, with you. We do not promise a connection before we have tested it.",
        },
        {
          q: "Does it also sort client emails?",
          r: "Yes: it files what comes in (document, question, appointment request) and drafts the simple replies. You approve every real reply.",
        },
      ],
      controle:
        "No figure, no advice and no real reply goes to a client without your approval. It chases the documents; the file stays yours.",
      serviceType: "AI assistant for accounting firms",
    },
  },

  {
    slug: "garages",
    fr: {
      nom: "Garages",
      seoTitre: "Assistant IA pour garages à Genève",
      seoDescription:
        "L'appel pris quand vous avez les mains dans le moteur, les rendez-vous préparés, les devis et les rappels prêts. Vous validez. Démo sur votre métier.",
      meta: "Garages et carrosseries · Genève",
      h1: ["Assistant IA pour garages", "à Genève."],
      chapo:
        "Nawa Corps, studio genevois, installe dans les garages de Genève un assistant IA qui connaît déjà l'atelier : le service, l'expertise, les pneus d'hiver. Il peut prendre les appels, avec le palier Complet (trois tâches dont le téléphone), noter les demandes de rendez-vous, préparer les devis et les rappels de service. Le prix d'une réparation, c'est vous qui le donnez.",
      carte: {
        soirees: "Les appels pendant qu'on a les mains dans le moteur, les rendez-vous, les devis.",
        peut: "Prendre l'appel et la demande de rendez-vous, préparer le devis et les rappels de service.",
      },
      douleurs: {
        h2: ["Les mains dans le moteur,", "le téléphone qui sonne."],
        items: [
          {
            titre: "Le téléphone à l'atelier.",
            texte: "Un service, un bruit bizarre, des pneus : on rappelle entre deux voitures.",
          },
          {
            titre: "Les rendez-vous.",
            texte: "Caler, confirmer, déplacer : l'agenda se remplit à la main.",
          },
          {
            titre: "Les devis.",
            texte: "Avant de chiffrer, il faut vérifier les pièces. Le client, lui, voudrait un prix tout de suite.",
          },
          {
            titre: "Les rappels oubliés.",
            texte: "L'expertise, le service, les pneus d'hiver : le client oublie, et l'atelier aussi.",
          },
        ],
        sources: "Genève compte 347 garages d'entretien et de réparation et 112 carrosseries (OCSTAT 2024).",
      },
      taches: {
        h2: ["Il note et prépare,", "l'atelier valide."],
        items: [
          {
            titre: "Répondre au téléphone.",
            texte:
              "Personne de libre au comptoir ? L'assistant peut prendre l'appel et noter le nom, le véhicule et ce qui ne va pas. Il ne promet ni date ni prix. Cette tâche fait partie du palier Complet : trois tâches dont le téléphone.",
          },
          {
            titre: "Prendre les demandes de rendez-vous.",
            texte:
              "Il note le véhicule, le travail demandé et les disponibilités, et prépare une proposition de créneau. Aucune date ne part sans votre accord.",
          },
          {
            titre: "Préparer le devis.",
            texte: "À partir de la demande, un brouillon de devis. Le prix, c'est vous qui le fixez.",
          },
          {
            titre: "Préparer les rappels.",
            texte: "Service, expertise, pneus : il prépare les rappels pour les clients concernés. Vous validez avant l'envoi.",
          },
        ],
      },
      demo: {
        canal: "WhatsApp",
        demande:
          "« Bonjour, j'aimerais faire le service de ma voiture et changer les pneus pour l'hiver. Vous auriez une place la semaine prochaine ? »",
        assistant:
          "L'accusé de réception validé une fois demande le modèle, l'immatriculation et les jours possibles. La demande est classée « service et pneus ».",
        soir:
          "Une demande complète : véhicule, travaux, disponibilités. Une proposition de rendez-vous attend votre accord.",
        releve:
          "« Service et pneus : rendez-vous validé par vous. Devis carrosserie : sans réponse, relance prête à valider. »",
      },
      faq: [
        {
          q: "Il connaît le vocabulaire d'un garage ?",
          r: "Plaquettes, distribution, expertise, géométrie : la base du métier contient ces mots-là et les demandes qui reviennent. Nous l'ajustons ensuite à votre garage, et la démo se fait sur des demandes d'atelier.",
        },
        {
          q: "Il donne des prix au téléphone ?",
          r: "Non. Il prend la demande et prépare un brouillon de devis. Le prix, c'est vous qui le fixez et le validez.",
        },
        {
          q: "Il peut préparer les rappels d'expertise ?",
          r: "Il prépare les rappels, et vous les validez avant l'envoi. Ce qu'il peut lire dans votre logiciel d'atelier se vérifie avec vous, outil par outil.",
        },
        {
          q: "Il remplace la réception ?",
          r: "Non. Il prend ce qui arrive quand personne ne peut décrocher, et vous laisse une liste triée. Vous décidez.",
        },
      ],
      controle:
        "Un prix de réparation ou un rendez-vous ne part jamais sans votre accord, un rappel de service non plus. Il prépare, l'atelier valide.",
      serviceType: "Assistant IA pour garages et carrosseries",
    },
    en: {
      nom: "Garages",
      seoTitre: "AI assistant for garages in Geneva",
      seoDescription:
        "The call taken while your hands are in the engine, appointments prepared, quotes and service reminders ready. You approve. A demo on your trade.",
      meta: "Garages and body shops · Geneva",
      h1: ["AI assistant for garages", "in Geneva."],
      chapo:
        "Nawa Corps, a Geneva studio, sets up for Geneva garages an AI assistant that already knows the workshop: the service, the inspection, the winter tyres. It can take calls, with the Complete tier (three tasks including the phone), note appointment requests, and draft quotes and service reminders. The price of a repair is yours to give.",
      carte: {
        soirees: "Calls while your hands are in the engine, appointments, quotes.",
        peut: "Take the call and the appointment request, draft the quote and the service reminders.",
      },
      douleurs: {
        h2: ["Hands in the engine,", "the phone ringing."],
        items: [
          {
            titre: "The phone in the workshop.",
            texte: "A service, a strange noise, tyres: you call back between two cars.",
          },
          {
            titre: "Appointments.",
            texte: "Fitting in, confirming, moving: the diary fills up by hand.",
          },
          {
            titre: "Quotes.",
            texte: "Before you can price it, the parts need checking. The client would like a price right now.",
          },
          {
            titre: "Forgotten reminders.",
            texte: "The inspection, the service, winter tyres: the client forgets, and so does the workshop.",
          },
        ],
        sources: "Geneva has 347 servicing and repair garages and 112 body shops (OCSTAT 2024).",
      },
      taches: {
        h2: ["It notes and drafts,", "the workshop approves."],
        items: [
          {
            titre: "Answering the phone.",
            texte:
              "Nobody free at the desk? The assistant can take the call and note the name, the vehicle and what's wrong. It promises no date and no price. This task is part of the Complete tier: three tasks including the phone.",
          },
          {
            titre: "Taking appointment requests.",
            texte:
              "It notes the vehicle, the work requested and availability, and drafts a proposed slot. No date goes out without your approval.",
          },
          {
            titre: "Drafting the quote.",
            texte: "From the request, a draft quote. You set the price.",
          },
          {
            titre: "Drafting reminders.",
            texte: "Service, inspection, tyres: it drafts reminders for the clients concerned. You approve before they go out.",
          },
        ],
      },
      demo: {
        canal: "WhatsApp",
        demande:
          "“Hello, I'd like my car serviced and the winter tyres put on. Would you have a slot next week?”",
        assistant:
          "The acknowledgement approved once asks for the model, the registration and possible days. The request is filed as “service and tyres”.",
        soir: "A complete request: vehicle, work, availability. A proposed appointment waits for your approval.",
        releve:
          "“Service and tyres: appointment approved by you. Bodywork quote: no answer, follow-up ready to approve.”",
      },
      faq: [
        {
          q: "Does it know garage vocabulary?",
          r: "Brake pads, timing belt, inspection, alignment: the trade base holds those words and the requests that keep coming back. We then adjust it to your garage, and the demo runs on workshop requests.",
        },
        {
          q: "Does it give prices on the phone?",
          r: "No. It takes the request and drafts a quote. You set the price and approve it.",
        },
        {
          q: "Can it prepare inspection reminders?",
          r: "It drafts the reminders, and you approve them before they go out. What it can read in your workshop software is checked with you, tool by tool.",
        },
        {
          q: "Does it replace the front desk?",
          r: "No. It takes what comes in when nobody can pick up, and leaves you a sorted list. You decide.",
        },
      ],
      controle:
        "A repair price or an appointment never goes out without your approval, and neither does a service reminder. It prepares, the workshop approves.",
      serviceType: "AI assistant for garages and body shops",
    },
  },

  {
    slug: "architectes-bureaux-etudes",
    fr: {
      nom: "Architectes et bureaux d'études",
      seoTitre: "Assistant IA pour architectes et bureaux d'études à Genève",
      seoDescription:
        "Les demandes de projet triées, les documents réclamés aux intervenants, les relances et les rendez-vous préparés. Vous validez. Démo sur votre métier.",
      meta: "Architecture et ingénierie · Genève",
      h1: ["Assistant IA pour architectes", "et bureaux d'études à Genève."],
      chapo:
        "Nawa Corps, studio genevois, installe chez les architectes et les bureaux d'études de Genève un assistant IA qui connaît déjà le métier, jusqu'aux pièces du dossier d'autorisation. Il peut trier les demandes de projet, réclamer les documents aux clients comme aux entreprises, et préparer relances et rendez-vous. Honoraires et délais restent votre affaire : il ne s'engage jamais à votre place.",
      carte: {
        soirees: "Les documents à réclamer aux clients et aux entreprises, les relances, les demandes de projet.",
        peut: "Trier les demandes, réclamer les documents manquants, préparer les relances et les rendez-vous.",
      },
      douleurs: {
        h2: ["Le projet le jour,", "les relances le soir."],
        items: [
          {
            titre: "Les documents qui manquent.",
            texte: "Plans existants, attestations, offres d'entreprises : il en manque toujours un pour avancer.",
          },
          {
            titre: "Les relances.",
            texte: "Les entreprises, le maître d'ouvrage, les ingénieurs : on relance, puis on relance encore.",
          },
          {
            titre: "Les demandes de projet.",
            texte: "Un particulier veut agrandir, un autre rénover : il faut comprendre avant de rappeler.",
          },
          {
            titre: "Le dossier d'autorisation.",
            texte: "Les pièces à réunir, une par une, avant le dépôt.",
          },
        ],
        sources: "Genève compte 731 bureaux d'architecture (OCSTAT 2024).",
      },
      taches: {
        h2: ["Il réunit les pièces,", "vous gardez le projet."],
        items: [
          {
            titre: "Trier les demandes de projet.",
            texte:
              "L'accusé de réception validé une fois demande le type de projet, l'adresse, les plans existants et le calendrier souhaité.",
          },
          {
            titre: "Réclamer les documents.",
            texte:
              "Il tient la liste des pièces attendues, par projet et par intervenant, et prépare les demandes. Vous validez avant l'envoi.",
          },
          {
            titre: "Préparer les relances.",
            texte: "L'attestation de l'ingénieur n'est toujours pas arrivée ? La relance est prête, adressée à la bonne personne. Vous la relisez avant qu'elle parte.",
          },
          {
            titre: "Prendre les rendez-vous.",
            texte: "Il prépare une proposition de créneau pour la première visite. Aucune date ne part sans votre accord.",
          },
          {
            titre: "Répondre au téléphone.",
            texte:
              "En séance de chantier, vous ne répondez pas. L'assistant peut prendre l'appel et vous laisser une fiche écrite. Il ne promet ni délai ni honoraires. Pour le téléphone, il faut le palier Complet : trois tâches dont le téléphone.",
          },
        ],
      },
      demo: {
        canal: "E-mail",
        demande:
          "« Bonjour, nous voulons agrandir notre maison et transformer le garage en bureau. Vous pouvez nous aider ? »",
        assistant:
          "L'accusé de réception validé une fois répond et demande les plans existants, des photos et le calendrier souhaité. La demande est classée « agrandissement, particulier ».",
        soir:
          "Une fiche de projet : adresse, ce qui est voulu, documents reçus. Une proposition de premier rendez-vous attend votre accord.",
        releve:
          "« Agrandissement : plans reçus, rendez-vous validé par vous. Autre projet : attestation de l'ingénieur toujours attendue, relance prête. »",
      },
      faq: [
        {
          q: "Il comprend un projet d'architecture ?",
          r: "Il connaît les demandes qui reviennent (agrandissement, rénovation, changement d'affectation), le vocabulaire et les pièces d'un dossier. Nous réglons cette base sur votre bureau, et la démo se fait sur des demandes de votre métier.",
        },
        {
          q: "Il écrit aux entreprises et aux clients à ma place ?",
          r: "Un seul message part seul : l'accusé de réception que vous avez validé une fois. Les demandes de documents et les relances attendent votre accord.",
        },
        {
          q: "Il prépare le dossier d'autorisation ?",
          r: "Il tient la liste des pièces à réunir et prépare la demande de ce qui manque. Le contenu du dossier reste votre travail : il ne remplit rien à votre place.",
        },
        {
          q: "Et nos outils, nos plans ?",
          r: "Ce que l'assistant peut lire dans vos outils se vérifie outil par outil, avec vous. Pour la démo, aucun accès à vos outils : elle se fait sur des demandes fictives.",
        },
      ],
      controle:
        "Aucun honoraire, aucun délai et aucun rendez-vous ne part au maître d'ouvrage sans votre accord. Il prépare la réponse et la relance ; vous les signez.",
      serviceType: "Assistant IA pour bureaux d'architecture et d'études",
    },
    en: {
      nom: "Architects and engineering firms",
      seoTitre: "AI assistant for architects and engineers in Geneva",
      seoDescription:
        "Project enquiries sorted, documents chased from everyone involved, follow-ups and appointments drafted. You approve. A demo on your trade.",
      meta: "Architecture and engineering · Geneva",
      h1: ["AI assistant for architects", "and engineers in Geneva."],
      chapo:
        "Nawa Corps, a Geneva studio, sets up for Geneva architects and engineering firms an AI assistant that already knows the work, down to the documents in a planning application. It can sort project enquiries, chase documents from clients and contractors alike, and draft follow-ups and appointments. Fees and deadlines stay your business: it never commits on your behalf.",
      carte: {
        soirees: "Documents to chase from clients and contractors, follow-ups, project enquiries.",
        peut: "Sort enquiries, chase missing documents, draft follow-ups and appointments.",
      },
      douleurs: {
        h2: ["The project by day,", "the chasing by night."],
        items: [
          {
            titre: "The missing documents.",
            texte: "Existing plans, certificates, contractors' bids: there's always one missing to move on.",
          },
          {
            titre: "Chasing.",
            texte: "Contractors, the client, the engineers: you chase, then you chase again.",
          },
          {
            titre: "Project enquiries.",
            texte: "One homeowner wants to extend, another to renovate: you need to understand before calling back.",
          },
          {
            titre: "The permit application.",
            texte: "The documents to gather, one by one, before filing.",
          },
        ],
        sources: "Geneva has 731 architecture firms (OCSTAT 2024).",
      },
      taches: {
        h2: ["It gathers the documents,", "you keep the project."],
        items: [
          {
            titre: "Sorting project enquiries.",
            texte:
              "The acknowledgement approved once asks for the type of project, the address, the existing plans and the hoped-for timeline.",
          },
          {
            titre: "Chasing documents.",
            texte:
              "It keeps the list of expected documents, by project and by contributor, and drafts the requests. You approve before they go out.",
          },
          {
            titre: "Drafting follow-ups.",
            texte: "The engineer's certificate still hasn't arrived? The follow-up is ready, addressed to the right person. You read it before it goes.",
          },
          {
            titre: "Booking appointments.",
            texte: "It drafts a proposed slot for the first visit. No date goes out without your approval.",
          },
          {
            titre: "Answering the phone.",
            texte:
              "In a site meeting, you don't answer. The assistant can take the call and leave you a written note. It promises no deadline and no fee. For the phone, you need the Complete tier: three tasks including the phone.",
          },
        ],
      },
      demo: {
        canal: "Email",
        demande: "“Hello, we want to extend our house and turn the garage into an office. Can you help?”",
        assistant:
          "The acknowledgement approved once replies and asks for the existing plans, photos and the hoped-for timeline. The enquiry is filed as “extension, private client”.",
        soir:
          "A project note: address, what is wanted, documents received. A proposed first meeting waits for your approval.",
        releve:
          "“Extension: plans received, meeting approved by you. Other project: engineer's certificate still awaited, follow-up ready.”",
      },
      faq: [
        {
          q: "Does it understand an architecture project?",
          r: "It knows the enquiries that keep coming back (extension, renovation, change of use), the vocabulary and the documents in a file. We set that base to your firm, and the demo runs on enquiries from your trade.",
        },
        {
          q: "Does it write to contractors and clients in my place?",
          r: "Only one message goes out on its own: the acknowledgement you approved once. Document requests and follow-ups wait for your approval.",
        },
        {
          q: "Does it prepare the permit application?",
          r: "It keeps the list of documents to gather and drafts the request for what is missing. The content of the application remains your work: it fills in nothing in your place.",
        },
        {
          q: "What about our tools and plans?",
          r: "What the assistant can read in your tools is checked tool by tool, with you. For the demo, no access to your tools: it runs on fictitious requests.",
        },
      ],
      controle:
        "No fee, no deadline and no meeting goes to the client without your approval. It drafts the reply and the follow-up; you sign them off.",
      serviceType: "AI assistant for architecture and engineering firms",
    },
  },

  {
    slug: "salons-coiffure-beaute",
    fr: {
      nom: "Salons de coiffure et de beauté",
      seoTitre: "Assistant IA pour salons de coiffure et beauté à Genève",
      seoDescription:
        "Les messages WhatsApp et Instagram triés, les rendez-vous et rappels préparés, les annulations reproposées. Vous validez. Démo sur votre métier.",
      meta: "Coiffure et beauté · Genève",
      h1: ["Assistant IA pour salons de", "coiffure et de beauté à Genève."],
      chapo:
        "Nawa Corps, studio genevois, installe dans les salons de coiffure et de beauté de Genève un assistant IA qui connaît déjà le métier, de la couleur au soin du visage. Il peut répondre aux messages WhatsApp et Instagram, préparer les rendez-vous et leurs rappels, et reproposer un créneau annulé à la liste d'attente. L'agenda reste le vôtre : il ne s'engage jamais à votre place.",
      carte: {
        soirees: "Les messages du soir et des jours de congé, les annulations, les rendez-vous oubliés.",
        peut: "Répondre aux messages, préparer rendez-vous et rappels, reproposer les créneaux annulés.",
      },
      douleurs: {
        h2: ["Les mains occupées,", "les messages qui tombent."],
        items: [
          {
            titre: "Pendant un soin.",
            texte: "WhatsApp, Instagram, le téléphone : on répond entre deux clientes, ou le soir.",
          },
          {
            titre: "Les rendez-vous oubliés.",
            texte: "La cliente ne vient pas, le créneau reste vide.",
          },
          {
            titre: "Les annulations.",
            texte: "Un créneau se libère au dernier moment, et personne ne le sait.",
          },
          {
            titre: "Les clientes qu'on ne revoit plus.",
            texte: "Elles venaient souvent, puis plus du tout, et personne ne les a relancées.",
          },
        ],
        sources: "Genève compte 776 salons de coiffure et 747 instituts de beauté (OCSTAT 2024).",
      },
      taches: {
        h2: ["Entre deux clientes,", "vous validez."],
        items: [
          {
            titre: "Répondre aux messages.",
            texte:
              "Sur WhatsApp, Instagram ou par e-mail, l'accusé de réception validé une fois répond et demande la prestation voulue et les disponibilités. Le branchement se vérifie canal par canal, avec vous.",
          },
          {
            titre: "Préparer les rendez-vous.",
            texte: "Il prépare une proposition de créneau. Aucune date ne part sans votre accord.",
          },
          {
            titre: "Préparer les rappels.",
            texte: "La veille du rendez-vous, le rappel est prêt. Vous validez avant l'envoi.",
          },
          {
            titre: "Reproposer les annulations.",
            texte: "Un créneau se libère ? Il prépare le message pour les clientes qui attendaient une place.",
          },
          {
            titre: "Relancer les clientes absentes.",
            texte: "Il prépare un message pour celles qu'on n'a pas revues depuis longtemps. Vous choisissez à qui il part.",
          },
        ],
      },
      demo: {
        canal: "Instagram",
        demande: "« Bonjour, vous auriez une place samedi pour une coupe et un brushing ? »",
        assistant:
          "L'accusé de réception validé une fois répond et demande l'heure préférée et s'il s'agit d'une première visite. La demande est classée « coupe et brushing, samedi ».",
        soir:
          "Une proposition de créneau samedi, prête à envoyer, et le rappel de la veille déjà préparé. Les deux attendent votre accord.",
        releve:
          "« Coupe et brushing : rendez-vous et rappel validés par vous. Créneau annulé jeudi : message prêt pour la liste d'attente. »",
      },
      faq: [
        {
          q: "J'ai déjà un agenda en ligne. À quoi sert l'assistant ?",
          r: "L'agenda prend les réservations. L'assistant s'occupe des messages autour : les questions sur WhatsApp ou Instagram, les annulations à reproposer, les clientes à relancer. Ce qu'il peut lire dans votre agenda se vérifie avec vous, outil par outil.",
        },
        {
          q: "Il répond à mes clientes à ma place ?",
          r: "Seul l'accusé de réception que vous avez validé une fois part seul. Les créneaux, les prix et les réponses de fond attendent votre accord.",
        },
        {
          q: "Il peut envoyer les rappels de rendez-vous ?",
          r: "Il les prépare la veille, et vous validez la liste en une fois avant l'envoi.",
        },
        {
          q: "Et les réseaux sociaux ?",
          r: "Il trie les messages qui arrivent et prépare les réponses. Il ne publie rien et ne fait pas votre communication.",
        },
      ],
      controle:
        "Aucun rendez-vous, aucun prix et aucun rappel ne part à une cliente sans votre accord. Il propose le créneau ; c'est vous qui le validez.",
      serviceType: "Assistant IA pour salons de coiffure et instituts de beauté",
    },
    en: {
      nom: "Hair and beauty salons",
      seoTitre: "AI assistant for hair and beauty salons in Geneva",
      seoDescription:
        "WhatsApp and Instagram messages sorted, appointments and reminders drafted, cancellations re-offered. You approve. A demo on your trade.",
      meta: "Hair and beauty · Geneva",
      h1: ["AI assistant for hair and", "beauty salons in Geneva."],
      chapo:
        "Nawa Corps, a Geneva studio, sets up for Geneva hair and beauty salons an AI assistant that already knows the trade, from colour to facials. It can answer WhatsApp and Instagram messages, draft appointments and their reminders, and re-offer a cancelled slot to the waiting list. The diary stays yours: it never commits on your behalf.",
      carte: {
        soirees: "Messages in the evening and on days off, cancellations, forgotten appointments.",
        peut: "Answer messages, draft appointments and reminders, re-offer cancelled slots.",
      },
      douleurs: {
        h2: ["Hands busy,", "messages coming in."],
        items: [
          {
            titre: "During a treatment.",
            texte: "WhatsApp, Instagram, the phone: you reply between two clients, or in the evening.",
          },
          {
            titre: "Forgotten appointments.",
            texte: "The client doesn't turn up, the slot stays empty.",
          },
          {
            titre: "Cancellations.",
            texte: "A slot frees up at the last minute, and nobody knows.",
          },
          {
            titre: "Clients you no longer see.",
            texte: "They came often, then not at all, and nobody followed up.",
          },
        ],
        sources: "Geneva has 776 hair salons and 747 beauty salons (OCSTAT 2024).",
      },
      taches: {
        h2: ["Between two clients,", "you approve."],
        items: [
          {
            titre: "Answering messages.",
            texte:
              "On WhatsApp, Instagram or by email, the acknowledgement approved once replies and asks which treatment and when they are free. The connection is checked channel by channel, with you.",
          },
          {
            titre: "Drafting appointments.",
            texte: "It drafts a proposed slot. No date goes out without your approval.",
          },
          {
            titre: "Drafting reminders.",
            texte: "The day before the appointment, the reminder is ready. You approve before it goes out.",
          },
          {
            titre: "Re-offering cancellations.",
            texte: "A slot frees up? It drafts the message for clients who were waiting for one.",
          },
          {
            titre: "Following up absent clients.",
            texte: "It drafts a message for those you haven't seen in a while. You choose who it goes to.",
          },
        ],
      },
      demo: {
        canal: "Instagram",
        demande: "“Hello, would you have a slot on Saturday for a cut and blow-dry?”",
        assistant:
          "The acknowledgement approved once replies and asks for the preferred time and whether it's a first visit. The request is filed as “cut and blow-dry, Saturday”.",
        soir:
          "A proposed Saturday slot, ready to send, and the reminder for the day before already drafted. Both wait for your approval.",
        releve:
          "“Cut and blow-dry: appointment and reminder approved by you. Thursday cancellation: message ready for the waiting list.”",
      },
      faq: [
        {
          q: "I already have an online booking tool. What's the assistant for?",
          r: "The booking tool takes bookings. The assistant handles the messages around them: questions on WhatsApp or Instagram, cancellations to re-offer, clients to follow up. What it can read in your booking tool is checked with you, tool by tool.",
        },
        {
          q: "Does it answer my clients in my place?",
          r: "Only the acknowledgement you approved once goes out on its own. Slots, prices and real replies wait for your approval.",
        },
        {
          q: "Can it send appointment reminders?",
          r: "It drafts them the day before, and you approve the list in one go before they go out.",
        },
        {
          q: "What about social media?",
          r: "It sorts incoming messages and drafts the replies. It publishes nothing and does not run your marketing.",
        },
      ],
      controle:
        "No appointment, no price and no reminder goes to a client without your approval. It proposes the slot; you approve it.",
      serviceType: "AI assistant for hair and beauty salons",
    },
  },

  {
    slug: "nettoyage-entretien",
    fr: {
      nom: "Nettoyage et entretien",
      seoTitre: "Assistant IA pour entreprises de nettoyage à Genève",
      seoDescription:
        "Les demandes de devis complétées avec photos et surface, les devis préparés, le planning et les relances prêts. Vous validez. Démo sur votre métier.",
      meta: "Nettoyage et entretien · Genève",
      h1: ["Assistant IA pour entreprises", "de nettoyage à Genève."],
      chapo:
        "Nawa Corps, studio genevois, installe dans les entreprises de nettoyage et d'entretien de Genève un assistant IA qui connaît déjà le métier, de la fin de bail à l'entretien de bureaux. Il peut demander la surface et les photos, préparer le devis, proposer un créneau dans le planning et relancer les devis restés sans réponse. C'est vous qui chiffrez et qui fixez la date.",
      carte: {
        soirees: "Les demandes de devis sans surface ni photo, le planning des équipes, les relances.",
        peut: "Demander photos et surface, préparer le devis, proposer le créneau, relancer.",
      },
      douleurs: {
        h2: ["Le devis à l'aveugle,", "le planning à la main."],
        items: [
          {
            titre: "« Combien pour un nettoyage ? »",
            texte: "Sans surface, sans photo, sans date : impossible de chiffrer sans rappeler.",
          },
          {
            titre: "Les fins de bail.",
            texte: "Le locataire veut une date précise, l'état des lieux approche.",
          },
          {
            titre: "Le planning.",
            texte: "Les équipes, les clients réguliers, les remplacements : tout se cale à la main.",
          },
          {
            titre: "Les devis sans réponse.",
            texte: "Partis, puis plus de nouvelles.",
          },
        ],
      },
      taches: {
        h2: ["La surface et les photos,", "avant le chiffrage."],
        items: [
          {
            titre: "Compléter la demande.",
            texte:
              "L'accusé de réception validé une fois demande la surface, des photos, le type de nettoyage et la date souhaitée.",
          },
          {
            titre: "Préparer le devis.",
            texte: "Avec la surface et les photos du four et des vitres, il prépare un brouillon selon vos tarifs. Vous le corrigez avant l'envoi.",
          },
          {
            titre: "Proposer un créneau.",
            texte: "Il prépare une proposition de date pour le planning. Aucune date ne part sans votre accord.",
          },
          {
            titre: "Relancer.",
            texte: "Un devis de fin de bail sans réponse, à quelques jours de l'état des lieux ? Il prépare la relance, vous la relisez.",
          },
          {
            titre: "Répondre au téléphone.",
            texte:
              "Quand toute l'équipe est sur place, personne ne répond. L'assistant peut prendre l'appel et vous laisser une fiche écrite. Il ne promet ni date ni prix. Il faut pour cela le palier Complet : trois tâches dont le téléphone.",
          },
        ],
      },
      demo: {
        canal: "Formulaire du site",
        demande:
          "« Bonjour, je quitte mon appartement à la fin du mois. Vous faites les nettoyages de fin de bail ? »",
        assistant:
          "L'accusé de réception validé une fois répond et demande la surface, des photos des pièces et la date de l'état des lieux. La demande est classée « fin de bail ».",
        soir:
          "Une demande complète : surface, photos, date de l'état des lieux. Un brouillon de devis et une proposition de date attendent votre accord.",
        releve:
          "« Fin de bail : devis envoyé après votre accord, date validée par vous. Bureaux, nettoyage régulier : sans réponse, relance prête à valider. »",
      },
      faq: [
        {
          q: "Il peut chiffrer un nettoyage tout seul ?",
          r: "Non. Il prépare un brouillon à partir de la surface, des photos et de vos tarifs. Le prix, c'est vous qui le validez.",
        },
        {
          q: "Il gère le planning des équipes ?",
          r: "Il prépare des propositions de créneaux. Ce qu'il peut lire dans votre planning se vérifie avec vous, outil par outil. Aucune date ne part sans votre accord.",
        },
        {
          q: "Et les clients réguliers ?",
          r: "Il trie leurs messages (changement de date, demande en plus, remarque) et prépare les réponses. Vous validez chaque réponse de fond.",
        },
        {
          q: "Il peut prendre les appels ?",
          r: "Oui, dans le palier Complet : trois tâches dont le téléphone. Il note le nom, l'adresse et le besoin, et vous laisse une fiche écrite. Aucun prix au téléphone.",
        },
      ],
      controle:
        "Aucun prix, aucune date de passage et aucun devis ne part sans votre accord. Il complète la demande avec la surface et les photos ; c'est vous qui chiffrez.",
      serviceType: "Assistant IA pour entreprises de nettoyage et d'entretien",
    },
    en: {
      nom: "Cleaning and maintenance",
      seoTitre: "AI assistant for cleaning companies in Geneva",
      seoDescription:
        "Quote requests completed with photos and surface area, quotes drafted, schedule slots and follow-ups ready. You approve. A demo on your trade.",
      meta: "Cleaning and maintenance · Geneva",
      h1: ["AI assistant for cleaning", "companies in Geneva."],
      chapo:
        "Nawa Corps, a Geneva studio, sets up for Geneva cleaning and maintenance companies an AI assistant that already knows the trade, from end-of-tenancy cleans to office contracts. It can ask for the surface area and photos, draft the quote, propose a slot in the schedule and follow up quotes left unanswered. You set the price and the date.",
      carte: {
        soirees: "Quote requests with no surface area or photo, the team schedule, follow-ups.",
        peut: "Ask for photos and surface area, draft the quote, propose the slot, follow up.",
      },
      douleurs: {
        h2: ["Quoting blind,", "scheduling by hand."],
        items: [
          {
            titre: "“How much for a clean?”",
            texte: "No surface area, no photo, no date: impossible to price without calling back.",
          },
          {
            titre: "End-of-tenancy cleans.",
            texte: "The tenant needs a precise date, the check-out inspection is coming.",
          },
          {
            titre: "The schedule.",
            texte: "Teams, regular clients, cover: it all gets fitted in by hand.",
          },
          {
            titre: "Quotes with no answer.",
            texte: "Sent out, then no news.",
          },
        ],
      },
      taches: {
        h2: ["Surface area and photos,", "before the price."],
        items: [
          {
            titre: "Completing the request.",
            texte:
              "The acknowledgement approved once asks for the surface area, photos, the type of clean and the preferred date.",
          },
          {
            titre: "Drafting the quote.",
            texte: "With the surface area and photos of the oven and windows, it drafts a quote at your rates. You correct it before it goes.",
          },
          {
            titre: "Proposing a slot.",
            texte: "It drafts a proposed date for the schedule. No date goes out without your approval.",
          },
          {
            titre: "Following up.",
            texte: "An end-of-tenancy quote with no answer, days before the check-out inspection? It drafts the follow-up, you read it.",
          },
          {
            titre: "Answering the phone.",
            texte:
              "When the whole team is on a job, nobody answers. The assistant can take the call and leave you a written note. It promises no date and no price. For this you need the Complete tier: three tasks including the phone.",
          },
        ],
      },
      demo: {
        canal: "Website form",
        demande: "“Hello, I'm leaving my flat at the end of the month. Do you do end-of-tenancy cleans?”",
        assistant:
          "The acknowledgement approved once replies and asks for the surface area, photos of the rooms and the date of the check-out inspection. The request is filed as “end of tenancy”.",
        soir:
          "A complete request: surface area, photos, inspection date. A draft quote and a proposed date wait for your approval.",
        releve:
          "“End of tenancy: quote sent after your approval, date approved by you. Offices, regular cleaning: no answer, follow-up ready to approve.”",
      },
      faq: [
        {
          q: "Can it price a clean on its own?",
          r: "No. It drafts from the surface area, the photos and your rates. You approve the price.",
        },
        {
          q: "Does it manage the team schedule?",
          r: "It drafts proposed slots. What it can read in your schedule is checked with you, tool by tool. No date goes out without your approval.",
        },
        {
          q: "What about regular clients?",
          r: "It sorts their messages (date change, extra request, comment) and drafts the replies. You approve every real reply.",
        },
        {
          q: "Can it take calls?",
          r: "Yes, in the Complete tier: three tasks including the phone. It notes the name, the address and the need, and leaves you a written note. No price on the phone.",
        },
      ],
      controle:
        "No price, no visit date and no quote goes out without your approval. It completes the request with the surface area and photos; you price it.",
      serviceType: "AI assistant for cleaning and maintenance companies",
    },
  },

  {
    slug: "demenagement",
    fr: {
      nom: "Déménagement",
      seoTitre: "Assistant IA pour entreprises de déménagement à Genève",
      seoDescription:
        "Les demandes complétées avec l'inventaire, les devis et les confirmations de date préparés, les rappels prêts. Vous validez. Démo sur votre métier.",
      meta: "Déménagement · Genève",
      h1: ["Assistant IA pour entreprises", "de déménagement à Genève."],
      chapo:
        "Nawa Corps, studio genevois, installe dans les entreprises de déménagement de Genève un assistant IA qui connaît déjà le métier et sait quoi demander avant un devis. Il peut réclamer l'inventaire et les accès, puis préparer le devis, la confirmation de date et les rappels de la veille. La date, c'est vous qui la validez.",
      carte: {
        soirees: "Les demandes sans inventaire, les devis à chiffrer, les dates à confirmer.",
        peut: "Demander l'inventaire et les accès, préparer le devis, la confirmation et les rappels.",
      },
      douleurs: {
        h2: ["Chiffrer un déménagement", "sans rien savoir."],
        items: [
          {
            titre: "La demande vague.",
            texte: "« Un trois-pièces, c'est combien ? » Sans inventaire, sans étage, sans accès.",
          },
          {
            titre: "La visite pour chiffrer.",
            texte: "Se déplacer pour voir, avant même de savoir si le client est décidé.",
          },
          {
            titre: "Les dates.",
            texte: "Fin de mois, fin de bail : tout le monde veut le même jour.",
          },
          {
            titre: "Les oublis de dernière minute.",
            texte: "L'ascenseur non réservé, le stationnement non demandé, le client pas prêt.",
          },
        ],
      },
      taches: {
        h2: ["L'inventaire d'abord,", "le devis ensuite."],
        items: [
          {
            titre: "Demander l'inventaire.",
            texte:
              "L'accusé de réception validé une fois demande la liste des meubles ou des photos, les étages, l'ascenseur et la date voulue.",
          },
          {
            titre: "Préparer le devis.",
            texte: "L'inventaire, les étages, l'ascenseur aux deux adresses : il en tire un brouillon selon vos tarifs. Vous corrigez avant l'envoi.",
          },
          {
            titre: "Confirmer la date.",
            texte: "Il prépare la confirmation de date. Aucune date ne part sans votre accord.",
          },
          {
            titre: "Préparer les rappels.",
            texte: "Avant le jour du déménagement : cartons, ascenseur, stationnement. Le rappel est prêt, vous validez avant l'envoi.",
          },
          {
            titre: "Répondre au téléphone.",
            texte:
              "En plein déménagement, le téléphone reste dans la poche. L'assistant peut prendre l'appel et vous laisser une fiche écrite, sans promettre de date ni de prix. C'est le palier Complet : trois tâches dont le téléphone.",
          },
        ],
      },
      demo: {
        canal: "E-mail",
        demande:
          "« Bonjour, nous déménageons de Carouge à Meyrin le mois prochain. Pouvez-vous nous faire un devis ? »",
        assistant:
          "L'accusé de réception validé une fois répond et demande l'inventaire ou des photos, les étages, l'ascenseur aux deux adresses et la date souhaitée. La demande est classée « devis déménagement ».",
        soir:
          "Une demande complète : inventaire, accès, date souhaitée. Un brouillon de devis attend votre accord.",
        releve:
          "« Carouge–Meyrin : devis accepté, date validée par vous, rappel prêt pour la veille. Autre devis : sans réponse, relance prête. »",
      },
      faq: [
        {
          q: "Il peut chiffrer sans visite ?",
          r: "Il ne chiffre pas à votre place. Il demande l'inventaire, des photos et les accès, et prépare un brouillon selon vos tarifs. Vous décidez s'il faut une visite.",
        },
        {
          q: "Il confirme les dates tout seul ?",
          r: "Non. Il prépare la confirmation ; aucune date ne part sans votre accord.",
        },
        {
          q: "Il peut envoyer les rappels avant le déménagement ?",
          r: "Il les prépare : cartons, ascenseur, stationnement. Vous les validez avant l'envoi.",
        },
        {
          q: "Il peut prendre les appels ?",
          r: "Oui, avec le palier Complet (trois tâches dont le téléphone). Il note le nom, les deux adresses et la date voulue, et vous laisse une fiche écrite. Il ne donne aucun prix.",
        },
      ],
      controle:
        "Aucune date de déménagement, aucun prix et aucun devis ne part sans votre accord. Il prépare la confirmation de date ; c'est vous qui la validez.",
      serviceType: "Assistant IA pour entreprises de déménagement",
    },
    en: {
      nom: "Removals",
      seoTitre: "AI assistant for removal companies in Geneva",
      seoDescription:
        "Requests completed with the inventory, quotes and date confirmations drafted, reminders ready. You approve. A demo on your trade.",
      meta: "Removals · Geneva",
      h1: ["AI assistant for removal", "companies in Geneva."],
      chapo:
        "Nawa Corps, a Geneva studio, sets up for Geneva removal companies an AI assistant that already knows the trade and what to ask before a quote. It can ask for the inventory and access details, then draft the quote, the date confirmation and the reminders for the day before. The date is yours to approve.",
      carte: {
        soirees: "Requests with no inventory, quotes to price, dates to confirm.",
        peut: "Ask for the inventory and access, draft the quote, the confirmation and the reminders.",
      },
      douleurs: {
        h2: ["Pricing a move", "knowing nothing."],
        items: [
          {
            titre: "The vague request.",
            texte: "“How much for a two-bedroom flat?” No inventory, no floor, no access.",
          },
          {
            titre: "The visit to price it.",
            texte: "Going to see, before you even know whether the client has decided.",
          },
          {
            titre: "Dates.",
            texte: "End of month, end of lease: everyone wants the same day.",
          },
          {
            titre: "Last-minute gaps.",
            texte: "The lift not booked, the parking not requested, the client not ready.",
          },
        ],
      },
      taches: {
        h2: ["Inventory first,", "quote second."],
        items: [
          {
            titre: "Asking for the inventory.",
            texte:
              "The acknowledgement approved once asks for a list of furniture or photos, the floors, the lift and the date wanted.",
          },
          {
            titre: "Drafting the quote.",
            texte: "The inventory, the floors, the lift at both addresses: from these it drafts a quote at your rates. You correct it before it goes.",
          },
          {
            titre: "Confirming the date.",
            texte: "It drafts the date confirmation. No date goes out without your approval.",
          },
          {
            titre: "Drafting reminders.",
            texte: "Before moving day: boxes, lift, parking. The reminder is ready, you approve before it goes out.",
          },
          {
            titre: "Answering the phone.",
            texte:
              "In the middle of a move, the phone stays in your pocket. The assistant can take the call and leave you a written note, without promising a date or a price. That is the Complete tier: three tasks including the phone.",
          },
        ],
      },
      demo: {
        canal: "Email",
        demande: "“Hello, we're moving from Carouge to Meyrin next month. Could you give us a quote?”",
        assistant:
          "The acknowledgement approved once replies and asks for the inventory or photos, the floors, the lift at both addresses and the preferred date. The request is filed as “removal quote”.",
        soir: "A complete request: inventory, access, preferred date. A draft quote waits for your approval.",
        releve:
          "“Carouge–Meyrin: quote accepted, date approved by you, reminder ready for the day before. Other quote: no answer, follow-up ready.”",
      },
      faq: [
        {
          q: "Can it price a move without a visit?",
          r: "It does not price in your place. It asks for the inventory, photos and access, and drafts at your rates. You decide whether a visit is needed.",
        },
        {
          q: "Does it confirm dates on its own?",
          r: "No. It drafts the confirmation; no date goes out without your approval.",
        },
        {
          q: "Can it send reminders before the move?",
          r: "It drafts them: boxes, lift, parking. You approve them before they go out.",
        },
        {
          q: "Can it take calls?",
          r: "Yes, with the Complete tier (three tasks including the phone). It notes the name, both addresses and the date wanted, and leaves you a written note. It gives no price.",
        },
      ],
      controle:
        "No moving date, no price and no quote goes out without your approval. It drafts the date confirmation; you approve it.",
      serviceType: "AI assistant for removal companies",
    },
  },
];

/** Le metier d un slug, ou `undefined` (la page rend alors un 404). */
export function trouverMetier(slug: string): Metier | undefined {
  return METIERS.find((m) => m.slug === slug);
}

/**
 * LES METIERS VOISINS, deux ou trois par page, lies en bas de chaque page
 * metier (audit CRO/SEO v3, 3.6 : chaque page etait un cul-de-sac, sans lien
 * vers une autre page metier ni vers /services).
 *
 * LE VOISINAGE SUIT LE TRAVAIL, PAS L ALPHABET : le sanitaire, l electricien
 * et les artisans partagent le chantier ; la regie, le sanitaire et le
 * nettoyage partagent le bon d intervention ; la fiduciaire et le bureau
 * d etudes, le dossier a pieces. Un slug inconnu ici ne casse rien : il est
 * ignore a la lecture.
 */
const VOISINS: Record<string, readonly string[]> = {
  "sanitaire-chauffage": ["electricite", "artisans-batiment", "regies-immobilieres"],
  electricite: ["sanitaire-chauffage", "artisans-batiment", "garages"],
  "artisans-batiment": ["sanitaire-chauffage", "electricite", "architectes-bureaux-etudes"],
  "regies-immobilieres": ["agences-immobilieres", "sanitaire-chauffage", "nettoyage-entretien"],
  "agences-immobilieres": ["regies-immobilieres", "demenagement", "nettoyage-entretien"],
  fiduciaires: ["architectes-bureaux-etudes", "regies-immobilieres", "agences-immobilieres"],
  garages: ["electricite", "sanitaire-chauffage", "demenagement"],
  "architectes-bureaux-etudes": ["fiduciaires", "artisans-batiment", "regies-immobilieres"],
  "salons-coiffure-beaute": ["nettoyage-entretien", "garages", "fiduciaires"],
  "nettoyage-entretien": ["demenagement", "regies-immobilieres", "salons-coiffure-beaute"],
  demenagement: ["nettoyage-entretien", "regies-immobilieres", "agences-immobilieres"],
};

/** Les metiers voisins d une page, dans l ordre ou ils se lisent. */
export function metiersVoisins(slug: string): Metier[] {
  return (VOISINS[slug] ?? [])
    .map((voisin) => trouverMetier(voisin))
    .filter((m): m is Metier => m !== undefined);
}

/**
 * LES TEXTES COMMUNS AUX PAGES METIERS ET AU HUB, dans les deux langues.
 *
 * Les intertitres, le parcours et les libelles de la demo sont les MEMES pour
 * tous les metiers : une seule formulation, ici, et COURTE. Le controle, lui,
 * se dit metier par metier (`controle`, plus haut) ; sa liste complete et le
 * parcours detaille vivent sur /services, ou chaque page renvoie (audit
 * CRO/SEO v3, 3.7 : 36 a 44 % du texte des pages metiers etait commun). Les
 * gabarits de prix portent `{montant}` et `{tva}`, remplis par `avecPrix()`
 * (lib/catalogue.ts).
 *
 * `canal` PORTE SA PONCTUATION : « Canal : » en francais, « Channel: » en
 * anglais, sans espace avant le deux-points.
 */
export const TEXTES_METIERS = {
  fr: {
    hub: {
      seoTitre: "Assistant IA par métier pour les PME de Genève",
      seoDescription:
        "Artisans, régies, fiduciaires, garages, salons, nettoyage, déménagement : ce que l'assistant peut faire dans votre métier, avec un exemple de démo.",
      meta: "Les métiers",
      h1: ["Un assistant IA,", "réglé sur votre métier."] as const,
      // « Genève » dans les 100 premiers mots (audit v4 B1, v5) : le title le
      // portait, le texte visible non.
      intro:
        "Pour les PME de Genève, nous partons d'une base par métier : les demandes qui reviennent, les mots du métier, les documents. Puis nous la réglons sur votre entreprise, vos prestations et votre façon d'écrire. L'assistant prépare, vous validez, et il ne s'engage jamais à votre place.",
      autre:
        "Votre métier n'est pas dans la liste ? Dites-le-nous : la démo se fait sur des demandes de votre métier.",
      exclus:
        "Nous n'installons pas l'assistant dans les cabinets médicaux, dentaires ou de physiothérapie, ni chez les avocats : le secret professionnel s'y oppose.",
      soirees: "Ce qui prend ses soirées",
      peut: "Ce que l'assistant peut faire",
      lienCarte: "L'assistant pour ce métier →",
      listeTitre: "Les métiers",
    },
    page: {
      douleursMeta: "Ce qui vous prend vos soirées",
      tachesMeta: "Ce que l'assistant peut faire",
      uneTache:
        "Commencez par la tâche qui vous prend le plus de soirées. Les autres viennent ensuite, selon votre palier.",
      /** Les boutons qui deplient (components/Detail.tsx, 26.10.2026). */
      detail: "Voir le détail",
      demoDetail: "Les 4 étapes en détail",
      autresQuestions: "Autres questions",
      demoMeta: "Exemple de démonstration",
      demoH2: ["Une demande,", "du début à la fin."] as const,
      controleMeta: "Le contrôle",
      controleH2: ["Il ne s'engage jamais", "à votre place."] as const,
      controleLien: "Le contrôle en détail →",
      prixMeta: "La démo et le prix",
      prixH2: ["Vos demandes d'abord,", "votre signature après."] as const,
      /**
       * (05) EN DEUX PHRASES, puis un lien vers /services#parcours : trois
       * etapes et une note recopiees sur onze pages faisaient l autre moitie
       * du texte commun (audit v3, 3.7). Le montant et sa mention de TVA
       * restent dans la meme phrase.
       */
      prixAvec:
        "La démo se fait sur des demandes de votre métier, deux semaines d'essai sur vos vraies demandes, avec un relevé chaque lundi : rien à payer avant. Si le relevé vous convient, la mise en place coûte {montant}, {tva}, une seule fois ; puis l'abonnement selon votre palier, sans engagement, résiliable chaque mois.",
      prixSans:
        "La démo se fait sur des demandes de votre métier, deux semaines d'essai sur vos vraies demandes, avec un relevé chaque lundi : rien à payer avant. Si le relevé vous convient, la mise en place se paie une seule fois ; puis l'abonnement selon votre palier, sans engagement, résiliable chaque mois.",
      prixLien: "Le parcours et les paliers en détail →",
      faqMeta: "Questions du métier",
      faqTitreCache: "Questions fréquentes du métier",
      tousLesMetiers: "Tous les métiers",
      voisins: "Métiers voisins : ",
      servicesLien: "L'assistant en détail →",
      /**
       * LES GUIDES, depuis chaque page metier (audit SEO v5) : les quatre
       * guides n etaient lies que depuis /guides et l accueil. Trois liens,
       * chacun la ou sa question se pose : la nLPD sous le controle, le prix
       * sous le prix, le guide general a cote des metiers voisins. `null` en
       * anglais : les guides n existent qu en francais.
       */
      guideDonnees: "IA et protection des données : le guide nLPD →",
      guidePrix: "Combien coûte un assistant IA en Suisse : le guide →",
      guideAutomatisation: "Le guide de l'automatisation par l'IA →",
      offreNom: "Mise en place de l'assistant",
      ville: "Genève",
      fil: { accueil: "Accueil", metiers: "Métiers" },
    },
    demo: {
      /**
       * OBLIGATOIRE (LCD art. 3) : sur chaque demo, page et carte, rendu par
       * components/DemoMetier.tsx avec la demande — visible des que la demande
       * l est, y compris dans un « Voir le détail » deplie.
       */
      libelle: "Exemple de démonstration — demande fictive",
      etapes: [
        "La demande arrive",
        "Ce que fait l'assistant",
        "Ce que vous voyez le soir",
        "Le relevé du lundi",
      ],
      /** Pour les lecteurs d ecran, devant le canal (« Canal : WhatsApp »), ponctuation comprise. */
      canal: "Canal : ",
      cta: "Voir la démo sur mon métier ",
    },
  },
  en: {
    hub: {
      seoTitre: "AI assistant by trade for Geneva small businesses",
      seoDescription:
        "Tradespeople, property managers, accountants, garages, salons, cleaning, removals: what the assistant can do in your trade, with a demo example.",
      meta: "Trades",
      h1: ["An AI assistant,", "set to your trade."] as const,
      intro:
        "For Geneva small businesses, we start from a base for each trade: the enquiries that keep coming back, the trade's words, the documents. Then we set it to your business, your services and the way you write. The assistant prepares, you approve, and it never commits on your behalf.",
      autre: "Your trade isn't on the list? Tell us: the demo runs on enquiries from your trade.",
      exclus:
        "We do not set up the assistant for medical, dental or physiotherapy practices, or for lawyers: professional secrecy stands in the way.",
      soirees: "What takes up the evenings",
      peut: "What the assistant can do",
      lienCarte: "The assistant for this trade →",
      listeTitre: "Trades",
    },
    page: {
      douleursMeta: "What takes up your evenings",
      tachesMeta: "What the assistant can do",
      uneTache:
        "Start with the task that takes up most of your evenings. The others come later, depending on your tier.",
      detail: "See the details",
      demoDetail: "The 4 steps in detail",
      autresQuestions: "More questions",
      demoMeta: "Demo example",
      demoH2: ["One enquiry,", "from start to finish."] as const,
      controleMeta: "Control",
      controleH2: ["It never commits", "on your behalf."] as const,
      controleLien: "Control in detail →",
      prixMeta: "The demo and the price",
      prixH2: ["Your enquiries first,", "your signature after."] as const,
      prixAvec:
        "The demo runs on enquiries from your trade, a two-week trial on your real enquiries, with a report every Monday: nothing to pay before. If the report suits you, the set-up costs {montant}, {tva}, once; then the subscription at your tier, no commitment, cancellable every month.",
      prixSans:
        "The demo runs on enquiries from your trade, a two-week trial on your real enquiries, with a report every Monday: nothing to pay before. If the report suits you, the set-up is paid once; then the subscription at your tier, no commitment, cancellable every month.",
      prixLien: "The steps and the tiers in detail →",
      faqMeta: "Trade questions",
      faqTitreCache: "Frequently asked questions for this trade",
      tousLesMetiers: "All trades",
      voisins: "Related trades: ",
      servicesLien: "The assistant in detail →",
      guideDonnees: null,
      guidePrix: null,
      guideAutomatisation: null,
      offreNom: "Assistant set-up",
      ville: "Geneva",
      fil: { accueil: "Home", metiers: "Trades" },
    },
    demo: {
      libelle: "Demo example — fictitious enquiry",
      etapes: ["The enquiry arrives", "What the assistant does", "What you see in the evening", "The Monday report"],
      canal: "Channel: ",
      cta: "See the demo on my trade ",
    },
  },
} satisfies Record<Locale, unknown>;
