"use client";

import { whatsapp } from "@/lib/site";
import { NAWA_CHAT_OUVRIR, type DetailOuverture } from "@/lib/chat-ouvrir";
import { type Locale, lien } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";

/**
 * Widget de chat — bloc B9.
 *
 * MONTE HORS DE #smoothWrap (layout.tsx). Le widget est en position:fixed ;
 * un ancetre transforme creerait un bloc conteneur et le ferait defiler avec
 * la page. Meme regle que nav/loader/cursor, decision B4.
 *
 * AUCUNE PERSISTANCE : l historique vit en etat React et meurt avec l onglet.
 * L enregistrement des conversations est le bloc B10 ; la mention de
 * confidentialite ci-dessous l annonce des maintenant, avant que ce soit vrai,
 * parce qu il vaut mieux l annoncer trop tot que trop tard.
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
 * LES CHAINES NE VIENNENT PAS DE lib/dictionnaires/. Ce dictionnaire tient le
 * CHROME partage — nav, menu, pied de page, formulaire — et il est charge par
 * plusieurs composants. Les phrases ci-dessous n appartiennent qu a ce
 * panneau ; les y ranger aurait fait grossir un module commun pour un seul
 * lecteur. Le `Record<Locale, …>` joue le meme role de garde-fou : une langue
 * ajoutee a lib/i18n.ts casse la compilation ici tant que sa colonne est vide.
 *
 * LE VOCABULAIRE ANGLAIS SUIT docs/agents/brand/glossaire-anglais.md : `an
 * enquiry`, `a quote`, `the next working day`, anglais britannique, `I` et
 * jamais `we`.
 */

type Message = { role: "user" | "assistant"; content: string };

/** Le schema de la route plafonne le tableau envoye a 16 entrees. */
const MAX_MESSAGES = 16;

/** A partir de ce nombre de messages, le bouton « Envoyer ma demande à Ayoub » apparait. */
const SEUIL_BOUTON = 6;

/** En dessous, un abandon ne vaut pas la peine d etre finalise. */
const SEUIL_ABANDON = 4;

const WA_LINK = whatsapp();

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
    bulle: string;
    titre: string;
    sousTitre: string;
    fermer: string;
    note: string;
    ecrit: string;
    indispo: string;
    allerFormulaire: string;
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
      "Bonjour. Je prépare votre proposition avec Ayoub. Qu'est-ce que vous cherchez à faire faire ?",
    /**
     * L ACCUEIL QUAND ON SAIT DEJA CE QUE LE VISITEUR EST VENU CHERCHER.
     *
     * Il arrive de /devis, qui a resolu le nom de la prestation en base et le
     * transmet dans l evenement d ouverture. Lui reposer « qu est-ce que vous
     * cherchez a faire faire ? » apres qu il vient de cliquer « Le Site » lui
     * apprend une seule chose : que personne n a regarde. La phrase NOMME donc
     * ce qu il a clique, puis pose la premiere vraie question — celle dont la
     * reponse n est nulle part dans l URL.
     *
     * ELLE NE PROMET RIEN DE PLUS que l accueil ordinaire : pas de delai, pas
     * de prix, pas de methode. Le seul engagement du site est « Réponse le jour
     * ouvrable suivant », et il est deja ecrit dans l en-tete du panneau.
     */
    accueilCible: (libelle) =>
      `Bonjour. Votre demande porte sur « ${libelle} » — c'est noté, je prépare votre proposition avec Ayoub. Pour commencer : quel est votre métier, et l'adresse de votre site actuel s'il y en a un ?`,
    bulle: "Décrivez votre besoin — réponse le jour ouvrable suivant",
    titre: "Assistant Nawa Corps",
    sousTitre: "Réponse d'Ayoub le jour ouvrable suivant",
    fermer: "Fermer la conversation",
    note: "Conversation enregistrée pour traiter votre demande — voir ",
    ecrit: "L'assistant écrit",
    indispo: "Assistant indisponible — utilisez le formulaire juste en dessous ou ",
    allerFormulaire: "Aller au formulaire",
    clos: "C'est noté — Ayoub revient vers vous le jour ouvrable suivant.",
    terminer: "Envoyer ma demande à Ayoub",
    completeDebut: "Conversation complète — la suite avec Ayoub directement sur ",
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
      "Hello. I'm preparing your quote with Ayoub. What are you looking to have done?",
    /** Meme role et memes limites que la version francaise ci-dessus. */
    accueilCible: (libelle) =>
      `Hello. Your enquiry is about “${libelle}” — noted, I'm preparing your quote with Ayoub. To start: what do you do, and the address of your current site if you have one?`,
    bulle: "Tell me what you need — an answer on the next working day",
    titre: "Nawa Corps assistant",
    sousTitre: "Ayoub answers on the next working day",
    fermer: "Close the conversation",
    note: "This conversation is recorded so that your enquiry can be handled — see ",
    ecrit: "The assistant is typing",
    indispo: "Assistant unavailable — use the form just below, or ",
    allerFormulaire: "Go to the form",
    clos: "Noted — Ayoub will come back to you on the next working day.",
    terminer: "Send my enquiry to Ayoub",
    completeDebut: "Conversation complete — carry on with Ayoub directly on ",
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
   * et ignore ici : la conversation s'ouvrait identique, que le visiteur ait
   * clique « Le Site » ou rien du tout, et la demande finissait chez Ayoub sans
   * dire sur quoi elle portait. Il est desormais garde en etat, ecrit dans la
   * premiere phrase, et pose sur Lead.subject a la finalisation.
   *
   * LE `libelle` VIENT DE LA BASE, pas d'ici. Le sujet est un identifiant
   * (« devis-le-site ») ; c'est app/(site)/devis qui lit Postgres et transmet le
   * NOM (« Le Site »). Tenir ici une table sujet -> nom ferait une seconde
   * source de verite, qui divergerait au premier renommage en base.
   *
   * LA PHRASE D'ACCUEIL N'EST REMPLACEE QUE SI LA CONVERSATION N'A PAS COMMENCE
   * (`suite.length === 1`). Une ouverture pilotee alors que le visiteur a deja
   * ecrit trois messages effacerait ce qu'il vient de dire.
   *
   * LE LIBELLE N EST PAS TRADUIT ICI. Il arrive deja resolu de la page
   * appelante, qui a lu la base — c est a elle d appeler `nomService` avec sa
   * langue. Le retraduire ici demanderait au widget de connaitre le catalogue,
   * ce que tout ce fichier evite depuis le debut.
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

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const texte = saisie.trim();
    if (!texte || envoi || verrouille || clos) return;

    const suite: Message[] = [...messages, { role: "user", content: texte }];
    setMessages(suite);
    setSaisie("");
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
        const data = (await res.json()) as { reply?: string };
        if (data.reply) {
          setMessages([...suite, { role: "assistant", content: data.reply }]);
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
            {m.content}
          </div>
        ))}
        {envoi ? (
          <div className="chat-typing" aria-label={t.ecrit}>
            <i></i>
            <i></i>
            <i></i>
          </div>
        ) : null}
        <div ref={finRef}></div>
      </div>

      {replie ? (
        <p className="chat-alert" role="status">
          {t.indispo}
          <a href={WA_LINK} target="_blank" rel="noopener">WhatsApp</a>.{" "}
          <a href={sujet ? ANCRE_FORMULAIRE : lien(locale, HREF_ACCUEIL_CONTACT)}>
            {t.allerFormulaire}
          </a>
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
          <a href={WA_LINK} target="_blank" rel="noopener">WhatsApp</a>
          {t.completeMilieu}
          <a href={sujet ? ANCRE_FORMULAIRE : lien(locale, HREF_ACCUEIL_CONTACT)}>
            {t.formulaire}
          </a>
          {t.completeFin}
        </p>
      ) : null}

      <form className="chat-form" onSubmit={envoyer}>
        <input
          type="text"
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          placeholder={verrouille || clos ? t.placeholderTermine : t.placeholder}
          aria-label={t.labelSaisie}
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
