"use client";

import { whatsappHref } from "@/lib/site";
import { NAWA_CHAT_OUVRIR, type DetailOuverture } from "@/lib/chat-ouvrir";
import { type Locale, lien } from "@/lib/i18n";
import { Fragment, useEffect, useRef, useState } from "react";

/**
 * Widget de chat — bloc B9.
 *
 * MONTE HORS DE #smoothWrap (layout.tsx). Le widget est en position:fixed ;
 * un ancetre transforme creerait un bloc conteneur et le ferait defiler avec
 * la page. Meme regle que nav/loader/cursor, decision B4.
 *
 * LA CONVERSATION EST ENREGISTREE, ET LE PANNEAU LE DIT. L historique vit en
 * etat React, mais il part en base par /api/chat/finalize quand le visiteur
 * clique « Demander ma démo » ET, sans clic, quand il quitte la page
 * (sendBeacon sur pagehide, au-dela de SEUIL_ABANDON messages). Chaque message
 * part aussi chez un fournisseur d IA aux Etats-Unis (lib/llm.ts). La note du
 * panneau (`note`, ci-dessous) l annonce depuis le 25 octobre 2026 en toutes
 * lettres : une capture a la fermeture que rien n annonce serait un traitement
 * cache (nLPD art. 19). /confidentialite detaille le reste.
 *
 * La cle du modele ne touche jamais ce fichier : tout passe par /api/chat.
 *
 * >>> LA LANGUE : UNE PROP, ET ELLE PART AUSSI DANS LE CORPS DES POST. <<<
 *
 * Deux moities qu il ne faut pas confondre :
 *
 *  1. CE QUE LE WIDGET ECRIT LUI-MEME — accueil, boutons, alertes, mention de
 *     confidentialite — vient de la table `TEXTES` ci-dessous.
 *  2. CE QUE LE MODELE ECRIT vient du prompt systeme, bati cote serveur dans
 *     la langue que ces requetes transportent (lib/chat-prompt.ts). D ou le
 *     champ `locale` ajoute aux corps de /api/chat et /api/chat/finalize :
 *     sans lui, un panneau entierement anglais recevrait des reponses
 *     francaises, ce qui est pire que pas de traduction du tout.
 *
 * Et ce que le modele ecrit passe desormais par `enSegments` avant d atteindre
 * la bulle : il y glissait du markdown que `.chat-msg` affichait en clair.
 * Voir le bloc de ce helper — il dit pourquoi c est du JSX et jamais du HTML.
 *
 * LES CHAINES NE VIENNENT PAS DE lib/dictionnaires/. Ce dictionnaire tient le
 * CHROME partage — nav, menu, pied de page, formulaire — et il est charge par
 * plusieurs composants. Les phrases ci-dessous n appartiennent qu a ce
 * panneau ; les y ranger aurait fait grossir un module commun pour un seul
 * lecteur. Le `Record<Locale, …>` joue le meme role de garde-fou : une langue
 * ajoutee a lib/i18n.ts casse la compilation ici tant que sa colonne est vide.
 *
 * LE VOCABULAIRE ANGLAIS SUIT docs/agents/brand/glossaire-anglais.md : `an
 * enquiry`, `a quote`, `the next working day`, anglais britannique, et `we`
 * jamais `I` depuis le 31 aout 2026 (§2).
 *
 * >>> LE PANNEAU DIT « NOUS », DANS SES DEUX COLONNES. <<<
 *
 * Decision du proprietaire, 31 aout 2026, renversant la precedente : le studio
 * travaille avec un partenaire de production, il ne se raconte plus a la
 * premiere personne du singulier. Ces phrases-ci sont celles du PANNEAU ; le
 * modele, lui, tient la meme regle par lib/chat-prompt.ts, et les deux doivent
 * dire la meme chose — un accueil au « je » suivi de reponses au « nous » se
 * lit comme deux interlocuteurs.
 *
 * CE QUE LE PLURIEL N AUTORISE PAS, ICI COMME AILLEURS : aucun effectif, aucune
 * equipe, aucun bureau, aucune anciennete. Le panneau n en annoncait aucun ; il
 * ne doit jamais commencer.
 *
 * AYOUB N EST PLUS NOMME DANS LES ETATS. Il l etait six fois par langue —
 * accueil, accueil cible, sous-titre, cloture, bouton d envoi, conversation
 * complete — ce qui ecrivait a chaque coin du panneau la structure d une seule
 * personne, celle-la meme que le site ne revendique plus. Le nom reste public
 * (mentions legales, section « Le studio ») et le prompt le garde pour y
 * renvoyer les questions d effectif ; ce sont les libelles du panneau qui
 * passent au « nous ». « Envoyer ma demande » est en outre le CTA exact du
 * guide de voix §7 — « Envoyer » seul y est proscrit.
 */

type Message = { role: "user" | "assistant"; content: string };

/**
 * >>> LES BRETELLES DU MARKDOWN. LA CEINTURE EST DANS LE PROMPT. <<<
 *
 * Le modele ecrivait « **Le Site — 1'499.–** » et la bulle affichait les
 * asterisques : `.chat-msg` rend du TEXTE, pas du HTML. lib/chat-prompt.ts le
 * lui interdit desormais dans les deux langues — mais un prompt n est jamais
 * une garantie, et le jour ou le modele change, la faute revient a l ecran
 * sans qu une ligne du depot ne bouge. D ou ce second filet, deterministe.
 *
 * PAS DE dangerouslySetInnerHTML, ET CE N EST PAS NEGOCIABLE. Ce texte vient
 * d un modele, donc d un inconnu : le passer en HTML brut ferait de chaque
 * reponse une injection possible. On DECOUPE en segments et on rend du JSX —
 * React echappe tout ce qui n est pas un element qu on a fabrique nous-memes.
 *
 * MINIMAL, DELIBEREMENT : le gras et les retours a la ligne, rien de plus.
 * Les retours a la ligne sont deja rendus par `white-space: pre-wrap`
 * (app/chat.css) — il n y a donc rien a faire pour eux ici, et surtout pas a
 * fabriquer des <br>. Le reste des marqueurs est simplement RETIRE : afficher
 * un titre ou une liste dans une bulle de conversation n a aucun sens, et
 * chaque forme rendue serait une forme a maintenir.
 *
 * LE SOULIGNE (`_`) N EST PAS TRAITE, VOLONTAIREMENT. Un `_` traine dans les
 * adresses e-mail et dans les URL que le visiteur colle ; le prendre pour de
 * l italique mangerait le caractere au milieu d une adresse. Les modeles
 * ecrivent le gras en asterisques dans la quasi-totalite des cas — on traite
 * ce cas-la, et on laisse tranquille celui qui abime des donnees.
 */
type Segment = { texte: string; gras: boolean };

/** Le gras markdown, non gourmand, retours a la ligne compris. */
const MD_GRAS = /\*\*([\s\S]+?)\*\*/g;

/**
 * Les marqueurs qui ne valent qu en debut de ligne. Traites ligne par ligne
 * parce que c est la seule facon de ne pas confondre un tiret de liste avec
 * le tiret cadratin des prix (« Le Site — 1'499.– »), qui, lui, doit rester.
 */
function nettoyerLigne(ligne: string): string {
  return ligne
    .replace(/^\s{0,3}#{1,6}\s+/, "") // # Titre
    .replace(/^(\s*)[-*+]\s+/, "$1• ") // - puce, * puce
    .replace(/^\s*(?:[-*_]\s*){3,}$/, "") // --- separateur horizontal
    .replace(/`/g, ""); // marqueurs de code
}

/**
 * Les asterisques qui survivent au decoupage du gras — une paire depareillee,
 * « **Le Site » sans fermeture — laisseraient la faute a l ecran, c est-a-dire
 * exactement ce qu on repare. On les retire donc.
 *
 * MAIS PAS TOUTES : une asterisque ISOLEE entre deux espaces n est pas un
 * marqueur, c est une multiplication (« 85 * 55 mm »). La retirer laisserait
 * une double espace au milieu d une phrase, soit un second defaut d affichage
 * pour en corriger un premier. Elle est donc gardee.
 *
 * PAS DE LOOKBEHIND `(?<=\S)` ICI, VOLONTAIREMENT. Il n existe qu a partir de
 * Safari 16.4 ; sur un iPhone plus ancien, la seule ECRITURE de ce littéral
 * jetterait une SyntaxError au chargement du module, et le widget entier
 * disparaitrait pour une asterisque. Une fonction de remplacement fait le
 * meme travail partout.
 */
function sansEtoiles(s: string): string {
  return s.replace(/\*/g, (_m, i: number, tout: string) => {
    const avant = tout[i - 1];
    const apres = tout[i + 1];
    const isolee =
      (avant === undefined || /\s/.test(avant)) && (apres === undefined || /\s/.test(apres));
    return isolee ? "*" : "";
  });
}

/** Decoupe un message du modele en segments affichables. */
function enSegments(brut: string): Segment[] {
  const texte = brut.split("\n").map(nettoyerLigne).join("\n");
  const segments: Segment[] = [];
  let curseur = 0;

  MD_GRAS.lastIndex = 0;
  for (let m = MD_GRAS.exec(texte); m !== null; m = MD_GRAS.exec(texte)) {
    if (m.index > curseur) {
      segments.push({ texte: sansEtoiles(texte.slice(curseur, m.index)), gras: false });
    }
    segments.push({ texte: sansEtoiles(m[1]), gras: true });
    curseur = m.index + m[0].length;
  }
  if (curseur < texte.length) {
    segments.push({ texte: sansEtoiles(texte.slice(curseur)), gras: false });
  }
  const nets = segments.filter((s) => s.texte !== "");
  // Un message qui ne serait QUE des marqueurs viderait la bulle. Une bulle
  // vide se lit comme une panne : on rend alors le brut, faute avouee.
  return nets.length > 0 ? nets : [{ texte: brut, gras: false }];
}

/** Le schema de la route plafonne le tableau envoye a 16 entrees. */
const MAX_MESSAGES = 16;

/** A partir de ce nombre de messages, le bouton « Envoyer ma demande » apparait. */
const SEUIL_BOUTON = 6;

/** En dessous, un abandon ne vaut pas la peine d etre finalise. */
const SEUIL_ABANDON = 4;


/**
 * OU ENVOYER LE VISITEUR QUAND L ASSISTANT LACHE.
 *
 * Le repli pointait TOUJOURS sur `/#contact`, c est-a-dire sur le formulaire du
 * pied de page de l ACCUEIL. Depuis /devis, c etait le pire des chemins : la
 * page qu il vient d ouvrir porte deja un formulaire, celui-la meme qui
 * transporte le sujet de sa demande en champ cache — l envoyer sur l accueil
 * lui faisait perdre a la fois sa place et l objet de sa demande.
 *
 * LA PRESENCE D UN `sujet` EST LE SIGNAL. Il n est pose que par une ouverture
 * pilotee depuis /devis (lib/chat-ouvrir.ts), et cette page est la seule a
 * porter l ancre `#formulaire`. Ailleurs, rien ne change : `/#contact` reste le
 * seul formulaire atteignable.
 *
 * `#formulaire` EST UNE ANCRE PURE et ne se prefixe donc jamais — elle designe
 * la page courante, quelle qu elle soit. `/#contact`, lui, passe par `lien()` :
 * en anglais c est `/en#contact`, et l ancre existe bien la-bas puisque
 * app/(site)/en/page.tsx rend le meme `FooterContact` (id="contact").
 */
const ANCRE_FORMULAIRE = "#formulaire";
const HREF_ACCUEIL_CONTACT = "/#contact";

/**
 * LA MENTION DE CONFIDENTIALITE POINTE SUR LA PAGE DE LA BONNE LANGUE.
 * `app/(site)/en/confidentialite/page.tsx` existe : le lien passe donc par
 * `lien()` et vaut `/en/confidentialite` en anglais.
 *
 * LE LIBELLE DU LIEN EST LE CHEMIN LUI-MEME, et il l est dans les deux langues
 * parce que c est le meme calcul qui le produit. C etait deja la convention du
 * panneau en francais (« voir /confidentialite ») ; la recopier a la main dans
 * la colonne anglaise aurait fait une seconde source pour le prefixe, qui
 * aurait menti le jour ou l URL bouge.
 */
const HREF_CONFIDENTIALITE = "/confidentialite";

/**
 * TOUT CE QUE LE PANNEAU ECRIT DE LUI-MEME.
 *
 * `accueilCible` est une FONCTION parce qu elle intercale le nom de la
 * prestation ; les autres entrees sont des chaines. La forme du
 * `Record<Locale, …>` est la meme que celle de lib/format.ts et de
 * lib/dictionnaires : une colonne par langue, et la compilation casse s il en
 * manque une.
 */
const TEXTES: Record<
  Locale,
  {
    accueil: string;
    accueilCible: (libelle: string) => string;
    /**
     * LES BOUTONS DE LA PREMIERE QUESTION. L accueil est ecrit ici, pas par
     * le modele : ses reponses suggerees doivent donc l etre aussi. Les
     * suivantes arrivent avec chaque reponse de /api/chat (lib/chat-choix.ts).
     */
    choixAccueil: string[];
    /** Le nom de la rangee de boutons, pour les lecteurs d ecran. */
    choixLabel: string;
    bulle: string;
    titre: string;
    sousTitre: string;
    fermer: string;
    note: string;
    ecrit: string;
    indispo: string;
    renvoyer: string;
    clos: string;
    terminer: string;
    completeDebut: string;
    completeMilieu: string;
    completeFin: string;
    formulaire: string;
    placeholderTermine: string;
    placeholder: string;
    labelSaisie: string;
    envoyer: string;
  }
> = {
  fr: {
    accueil:
      "Bonjour, je suis Leo, l'assistant de ce site. Quel est votre métier ?",
    choixAccueil: ["Artisan du bâtiment", "Régie / agence", "Fiduciaire", "Autre"],
    choixLabel: "Réponses suggérées",
    /**
     * L ACCUEIL QUAND ON SAIT DEJA POURQUOI LE VISITEUR EST VENU.
     *
     * Il arrive de /devis, qui transmet un sujet dans l evenement d ouverture.
     * La phrase le nomme, puis pose UNE question, la premiere du deroule du
     * prompt (lib/chat-prompt.ts) : le metier. Elle ne promet rien de plus que
     * l accueil ordinaire — le seul engagement, « Réponse le jour ouvrable
     * suivant », est deja dans l en-tete du panneau.
     *
     * « L ASSISTANT DE CE SITE » ET « ASSISTANT DE DEMONSTRATION » (titre) :
     * Leo est la demonstration de ce que le studio installe, jamais une
     * reference client (.agents/product-marketing.md §6), et un prenom seul
     * ferait croire a une personne (LCD art. 3).
     *
     * LA NOTE DU PANNEAU renvoie a /confidentialite, qui dit que les echanges
     * de Leo passent par un fournisseur d IA (Groq, Etats-Unis, tant que
     * LLM_PROVIDER n est pas « infomaniak ») : la promesse « Les donnees de
     * votre assistant sont hebergees en Suisse » vise l assistant livre au
     * client, pas Leo (revue psy-A tour 2, M2).
     */
    accueilCible: (libelle) =>
      `Bonjour, je suis Leo, l'assistant de ce site. Vous venez pour « ${libelle} », c'est noté. Pour commencer : quel est votre métier ?`,
    // LE BOUTON DIT CE QU IL OUVRE (25.10.2026) : l ancienne bulle posait une
    // question sans dire qu un clic ouvrait une conversation.
    bulle: "Parler à Leo, l'assistant du site",
    titre: "Leo, assistant de démonstration",
    sousTitre: "Réponse le jour ouvrable suivant",
    fermer: "Fermer la conversation",
    // UNE LIGNE ET UN LIEN, PLUS UN PARAGRAPHE (demande d Ayoub du 25.10.2026 :
    // le bloc de quatre lignes ecrasait la conversation). L information
    // complete — enregistrement, fournisseur d IA hors de Suisse, extraction
    // des coordonnees — vit dans /confidentialite (rubrique Leo), a un clic :
    // c est l information « par couches » que la nLPD admet. Ne pas retirer
    // le lien.
    note: "Démonstration : n'y confiez rien de sensible. Données : ",
    ecrit: "Leo écrit",
    indispo: "Leo n'a pas pu répondre à l'instant. Renvoyez votre message, ou écrivez-nous sur ",
    renvoyer: "Renvoyer mon message",
    clos: "C'est noté. Réponse le jour ouvrable suivant, pour fixer la démo.",
    terminer: "Demander ma démo",
    completeDebut: "Conversation complète. La suite directement sur ",
    completeMilieu: ", ou par le ",
    completeFin: ".",
    formulaire: "formulaire",
    placeholderTermine: "Conversation terminée",
    placeholder: "Votre réponse…",
    labelSaisie: "Votre message",
    envoyer: "Envoyer",
  },
  en: {
    accueil:
      "Hello, I'm Leo, this site's assistant. What is your trade?",
    choixAccueil: ["Building trades", "Property / estate agent", "Accounting firm", "Other"],
    choixLabel: "Suggested replies",
    /** Meme role et memes limites que la version francaise ci-dessus. */
    accueilCible: (libelle) =>
      `Hello, I'm Leo, this site's assistant. You're here for “${libelle}”, noted. To start: what is your trade?`,
    bulle: "Talk to Leo, this site's assistant",
    titre: "Leo, demonstration assistant",
    sousTitre: "A reply the next working day",
    fermer: "Close the conversation",
    note: "Demonstration: do not share anything sensitive. Data: ",
    ecrit: "Leo is typing",
    indispo: "Leo couldn't answer just now. Send your message again, or write to us on ",
    renvoyer: "Send my message again",
    clos: "Noted. A reply the next working day, to set up the demo.",
    terminer: "Get my demo",
    completeDebut: "Conversation complete. Carry on directly on ",
    completeMilieu: ", or through the ",
    completeFin: ".",
    formulaire: "form",
    placeholderTermine: "Conversation ended",
    placeholder: "Your answer…",
    labelSaisie: "Your message",
    envoyer: "Send",
  },
};

/**
 * `locale` EST OPTIONNELLE ET VAUT « fr », comme dans ContactForm : le
 * composant est monte par app/(site)/layout.tsx, qui doit lui passer la langue
 * qu il calcule deja pour Nav et MenuOverlay. Tant que cette ligne n est pas
 * ecrite, le widget se comporte exactement comme avant.
 */
export default function ChatWidget({ locale = "fr" }: { locale?: Locale }) {
  const t = TEXTES[locale];

  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  const [ouvert, setOuvert] = useState(false);
  // Initialiseur paresseux plutot qu un effet. Le rendu serveur produit une
  // valeur, l hydratation en produit une autre — sans consequence : sessionId
  // n est jamais ecrit dans le DOM, il ne part que dans le corps du POST.
  // C est la valeur du client qui sert, et il n y a rien a reconcilier.
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: TEXTES[locale].accueil },
  ]);
  // LES REPONSES SUGGEREES DU DERNIER MESSAGE DE LEO, et de lui seul : elles
  // disparaissent des que le visiteur repond, par bouton ou au clavier.
  const [choix, setChoix] = useState<string[]>(() => TEXTES[locale].choixAccueil);
  const [saisie, setSaisie] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [replie, setReplie] = useState(false);
  const [clos, setClos] = useState(false);
  // CE QUE LA DEMANDE CONCERNE, pose par l ouverture depuis /devis. Il ne
  // s affiche pas : il sert a nommer la prestation dans le premier message, et
  // il repart dans le corps de la finalisation pour atterrir sur Lead.subject.
  const [sujet, setSujet] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement | null>(null);

  // Garde anti-double-envoi. Un ref et non un etat : le gestionnaire
  // pagehide lit sa valeur au moment ou il se declenche, pas celle capturee
  // au dernier rendu. L idempotence serveur (sessionId unique) couvre ce que
  // cette garde laisserait passer.
  const finaliseRef = useRef(false);

  // Meme raison : le gestionnaire pagehide est pose une fois et doit voir
  // l historique a jour, pas celui du montage.
  const messagesRef = useRef<Message[]>([]);

  // Meme mecanique, meme raison, pour le sujet : il est pose APRES le montage
  // (l ouverture depuis /devis arrive par evenement), et pagehide doit voir la
  // valeur du moment ou l onglet se ferme.
  const sujetRef = useRef<string | null>(null);

  // Le verrou se DEDUIT de l historique, il ne se stocke pas : un etat
  // parallele finirait par mentir sur le contenu de messages.
  const verrouille = messages.length >= MAX_MESSAGES;

  useEffect(() => {
    finRef.current?.scrollIntoView({ block: "end" });
  }, [messages, envoi, replie, verrouille]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    sujetRef.current = sujet;
  }, [sujet]);

  /**
   * Ouverture pilotee de l'exterieur — voir lib/chat-ouvrir.ts.
   *
   * LE `sujet` DE L'EVENEMENT EST ENFIN LU. Il etait transmis depuis le bloc B9
   * et ignore ici : la conversation s'ouvrait identique quel que soit le bouton
   * clique, et la demande finissait chez Ayoub sans dire sur quoi elle
   * portait. Il est desormais garde en etat, ecrit dans la
   * premiere phrase, et pose sur Lead.subject a la finalisation.
   *
   * LE `libelle` VIENT DE LA PAGE APPELANTE, pas d'ici. Le sujet est un
   * identifiant (« devis-studio ») ; c'est app/(site)/devis, via lib/devis.ts,
   * qui le resout et transmet son libelle. Tenir ici une table sujet -> nom
   * ferait une seconde source de verite.
   *
   * LA PHRASE D'ACCUEIL N'EST REMPLACEE QUE SI LA CONVERSATION N'A PAS COMMENCE
   * (`suite.length === 1`). Une ouverture pilotee alors que le visiteur a deja
   * ecrit trois messages effacerait ce qu'il vient de dire.
   *
   * LE LIBELLE N EST PAS TRADUIT ICI. Il arrive deja resolu, dans sa langue,
   * de la page appelante (lib/devis.ts). Le retraduire ici demanderait au
   * widget de connaitre les sujets, ce que tout ce fichier evite.
   */
  useEffect(() => {
    function surDemande(e: Event) {
      const detail = (e as CustomEvent<DetailOuverture>).detail;
      setOuvert(true);
      setReplie(false);

      if (!detail?.sujet) return;
      setSujet(detail.sujet);

      const libelle = detail.libelle;
      if (!libelle) return;
      setMessages((suite) =>
        suite.length === 1
          ? [{ role: "assistant", content: TEXTES[locale].accueilCible(libelle) }]
          : suite,
      );
    }
    window.addEventListener(NAWA_CHAT_OUVRIR, surDemande);
    return () => window.removeEventListener(NAWA_CHAT_OUVRIR, surDemande);
  }, [locale]);

  // ABANDON : l onglet se ferme, la page change. On n a plus le temps d un
  // fetch — sendBeacon confie la requete au navigateur, qui la poste apres
  // notre mort. pagehide et non beforeunload : beforeunload ne se declenche
  // pas de facon fiable sur mobile, ou l onglet passe en arriere-plan.
  //
  // LA LANGUE PART DANS LE CORPS, et c est la seule voie possible ici :
  // sendBeacon ne permet de poser aucun en-tete au-dela du type de contenu.
  useEffect(() => {
    function surSortie() {
      const suite = messagesRef.current;
      if (finaliseRef.current || suite.length < SEUIL_ABANDON) return;
      finaliseRef.current = true;
      // `subject: undefined` n'est pas serialise par JSON.stringify : le corps
      // part alors sans la cle, ce que le schema serveur lit comme « absent ».
      const corps = JSON.stringify({
        sessionId,
        messages: suite,
        reason: "abandoned",
        subject: sujetRef.current ?? undefined,
        locale,
      });
      navigator.sendBeacon("/api/chat/finalize", new Blob([corps], { type: "application/json" }));
    }
    window.addEventListener("pagehide", surSortie);
    return () => window.removeEventListener("pagehide", surSortie);
  }, [sessionId, locale]);

  // CLOTURE explicite. Plus fiable que de deviner, dans la reponse du bot,
  // qu il vient de remercier : cette heuristique se trompe des que le
  // modele reformule. Le visiteur decide, on n interprete pas.
  async function terminer() {
    if (finaliseRef.current || envoi) return;
    finaliseRef.current = true;
    setEnvoi(true);
    try {
      await fetch("/api/chat/finalize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages,
          reason: "completed",
          subject: sujet ?? undefined,
          locale,
        }),
      });
    } catch {
      // Rien a dire au visiteur : sa conversation est soit enregistree, soit
      // perdue cote reseau, et dans les deux cas le message de cloture est
      // la reponse honnete — Ayoub a le formulaire et WhatsApp par ailleurs.
    } finally {
      setEnvoi(false);
      setClos(true);
    }
  }

  function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void envoyerTexte(saisie);
  }

  // Un seul chemin d envoi pour la saisie et les boutons suggeres : un clic
  // sur « Électricité » est exactement le message « Électricité ».
  async function envoyerTexte(brut: string) {
    const texte = brut.trim();
    if (!texte || envoi || verrouille || clos) return;

    const suite: Message[] = [...messages, { role: "user", content: texte }];
    setMessages(suite);
    setSaisie("");
    await demander(suite);
  }

  /**
   * RENVOYER, PLUTOT QU ENVOYER AU FORMULAIRE (demande d Ayoub du 25.10.2026).
   * Un echec de Leo est presque toujours passager — quota du fournisseur ou
   * debit par minute — et le repli « Aller au formulaire » faisait croire au
   * visiteur que la conversation etait finie. Le message du visiteur reste
   * affiche ; le bouton reposte la meme suite, sans la dupliquer.
   */
  function renvoyer() {
    if (envoi || verrouille || clos) return;
    const derniere = messages[messages.length - 1];
    if (derniere?.role !== "user") return;
    void demander(messages);
  }

  async function demander(suite: Message[]) {
    setChoix([]);
    setEnvoi(true);
    setReplie(false);

    try {
      // `locale` DECIDE LA LANGUE DU MODELE, pas seulement celle du panneau :
      // c est elle qui choisit le prompt systeme bati par lib/chat-prompt.ts.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, messages: suite, locale }),
      });

      if (res.ok) {
        const data = (await res.json()) as { reply?: string; choix?: string[] };
        if (data.reply) {
          setMessages([...suite, { role: "assistant", content: data.reply }]);
          setChoix(Array.isArray(data.choix) ? data.choix : []);
        } else {
          setReplie(true);
        }
      } else {
        // 503 fallback, 429 debit, 400 : dans tous les cas on oriente ailleurs
        // plutot que d afficher un code d erreur a un commercant.
        setReplie(true);
      }
    } catch {
      setReplie(true);
    } finally {
      setEnvoi(false);
    }
  }

  if (!ouvert) {
    return (
      <button className="chat-fab" type="button" onClick={() => setOuvert(true)}>
        <span className="dot" aria-hidden="true"></span>
        {t.bulle}
      </button>
    );
  }

  return (
    <div className="chat-panel" role="dialog" aria-label={t.titre}>
      <div className="chat-head">
        <div>
          <b>{t.titre}</b>
          <span>{t.sousTitre}</span>
        </div>
        <button
          className="chat-close"
          type="button"
          aria-label={t.fermer}
          onClick={() => setOuvert(false)}
        >
          ×
        </button>
      </div>

      <p className="chat-note">
        {t.note}
        <a href={lien(locale, HREF_CONFIDENTIALITE)}>{lien(locale, HREF_CONFIDENTIALITE)}</a>.
      </p>

      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role === "user" ? "user" : "bot"}`}>
            {/* LE TEXTE DU VISITEUR N EST PAS TOUCHE : il s affiche tel qu il
                l a tape, asterisques comprises s il en met. Le nettoyage ne
                vise que ce que le MODELE ecrit — c est lui, et lui seul, qui
                glisse du markdown dans une bulle qui rend du texte. */}
            {m.role === "user"
              ? m.content
              : enSegments(m.content).map((s, j) =>
                  s.gras ? (
                    <strong key={j}>{s.texte}</strong>
                  ) : (
                    <Fragment key={j}>{s.texte}</Fragment>
                  ),
                )}
          </div>
        ))}
        {envoi ? (
          <div className="chat-typing" aria-label={t.ecrit}>
            <i></i>
            <i></i>
            <i></i>
          </div>
        ) : null}
        {choix.length > 0 && !envoi && !verrouille && !clos ? (
          <div className="chat-choix" role="group" aria-label={t.choixLabel}>
            {choix.map((c) => (
              <button key={c} type="button" onClick={() => void envoyerTexte(c)}>
                {c}
              </button>
            ))}
          </div>
        ) : null}
        <div ref={finRef}></div>
      </div>

      {replie ? (
        <p className="chat-alert" role="status">
          {t.indispo}
          <a href={whatsappHref(locale)} target="_blank" rel="noopener">WhatsApp</a>.{" "}
          <button type="button" className="chat-renvoyer" onClick={renvoyer}>
            {t.renvoyer}
          </button>
        </p>
      ) : null}

      {clos ? (
        <p className="chat-alert" role="status">
          {t.clos}
        </p>
      ) : null}

      {!clos && messages.length >= SEUIL_BOUTON ? (
        <div className="chat-end">
          <button type="button" onClick={terminer} disabled={envoi}>
            {t.terminer}
          </button>
        </div>
      ) : null}

      {verrouille && !clos ? (
        <p className="chat-alert" role="status">
          {t.completeDebut}
          <a href={whatsappHref(locale)} target="_blank" rel="noopener">WhatsApp</a>
          {t.completeMilieu}
          <a href={sujet ? ANCRE_FORMULAIRE : lien(locale, HREF_ACCUEIL_CONTACT)}>
            {t.formulaire}
          </a>
          {t.completeFin}
        </p>
      ) : null}

      <form className="chat-form" onSubmit={envoyer}>
        {/* Un vrai libelle, masque visuellement : le panneau est unique, un id
            fixe ne peut pas entrer en collision. */}
        <label className="sr-only" htmlFor="chat-saisie">{t.labelSaisie}</label>
        <input
          id="chat-saisie"
          type="text"
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          placeholder={verrouille || clos ? t.placeholderTermine : t.placeholder}
          maxLength={1500}
          disabled={envoi || verrouille || clos}
          autoComplete="off"
        />
        <button type="submit" disabled={envoi || verrouille || clos || saisie.trim() === ""}>
          {envoi ? "…" : t.envoyer}
        </button>
      </form>
    </div>
  );
}
