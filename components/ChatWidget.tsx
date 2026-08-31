"use client";

import { whatsapp } from "@/lib/site";
import { NAWA_CHAT_OUVRIR, type DetailOuverture } from "@/lib/chat-ouvrir";
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
 */
const ANCRE_FORMULAIRE = "#formulaire";
const HREF_ACCUEIL_CONTACT = "/#contact";

const ACCUEIL =
  "Bonjour. Je prépare votre proposition avec Ayoub. Qu'est-ce que vous cherchez à faire faire ?";

/**
 * L ACCUEIL QUAND ON SAIT DEJA CE QUE LE VISITEUR EST VENU CHERCHER.
 *
 * Il arrive de /devis, qui a resolu le nom de la prestation en base et le
 * transmet dans l evenement d ouverture. Lui reposer « qu est-ce que vous
 * cherchez a faire faire ? » apres qu il vient de cliquer « Le Site » lui
 * apprend une seule chose : que personne n a regarde. La phrase NOMME donc ce
 * qu il a clique, puis pose la premiere vraie question — celle dont la reponse
 * n est nulle part dans l URL.
 *
 * ELLE NE PROMET RIEN DE PLUS que l accueil ordinaire : pas de delai, pas de
 * prix, pas de methode. Le seul engagement du site est « Réponse le jour
 * ouvrable suivant », et il est deja ecrit dans l en-tete du panneau.
 */
const accueilCible = (libelle: string) =>
  `Bonjour. Votre demande porte sur « ${libelle} » — c'est noté, je prépare votre proposition avec Ayoub. Pour commencer : quel est votre métier, et l'adresse de votre site actuel s'il y en a un ?`;

export default function ChatWidget() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  const [ouvert, setOuvert] = useState(false);
  // Initialiseur paresseux plutot qu un effet. Le rendu serveur produit une
  // valeur, l hydratation en produit une autre — sans consequence : sessionId
  // n est jamais ecrit dans le DOM, il ne part que dans le corps du POST.
  // C est la valeur du client qui sert, et il n y a rien a reconcilier.
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: ACCUEIL },
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
          ? [{ role: "assistant", content: accueilCible(libelle) }]
          : suite,
      );
    }
    window.addEventListener(NAWA_CHAT_OUVRIR, surDemande);
    return () => window.removeEventListener(NAWA_CHAT_OUVRIR, surDemande);
  }, []);

  // ABANDON : l onglet se ferme, la page change. On n a plus le temps d un
  // fetch — sendBeacon confie la requete au navigateur, qui la poste apres
  // notre mort. pagehide et non beforeunload : beforeunload ne se declenche
  // pas de facon fiable sur mobile, ou l onglet passe en arriere-plan.
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
      });
      navigator.sendBeacon("/api/chat/finalize", new Blob([corps], { type: "application/json" }));
    }
    window.addEventListener("pagehide", surSortie);
    return () => window.removeEventListener("pagehide", surSortie);
  }, [sessionId]);

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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, messages: suite }),
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
        Décrivez votre besoin — réponse le jour ouvrable suivant
      </button>
    );
  }

  return (
    <div className="chat-panel" role="dialog" aria-label="Assistant Nawa Corps">
      <div className="chat-head">
        <div>
          <b>Assistant Nawa Corps</b>
          <span>Réponse d&apos;Ayoub le jour ouvrable suivant</span>
        </div>
        <button
          className="chat-close"
          type="button"
          aria-label="Fermer la conversation"
          onClick={() => setOuvert(false)}
        >
          ×
        </button>
      </div>

      <p className="chat-note">
        Conversation enregistrée pour traiter votre demande — voir{" "}
        <a href="/confidentialite">/confidentialite</a>.
      </p>

      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role === "user" ? "user" : "bot"}`}>
            {m.content}
          </div>
        ))}
        {envoi ? (
          <div className="chat-typing" aria-label="L'assistant écrit">
            <i></i>
            <i></i>
            <i></i>
          </div>
        ) : null}
        <div ref={finRef}></div>
      </div>

      {replie ? (
        <p className="chat-alert" role="status">
          Assistant indisponible — utilisez le formulaire juste en dessous ou{" "}
          <a href={WA_LINK} target="_blank" rel="noopener">WhatsApp</a>.{" "}
          <a href={sujet ? ANCRE_FORMULAIRE : HREF_ACCUEIL_CONTACT}>
            Aller au formulaire
          </a>
        </p>
      ) : null}

      {clos ? (
        <p className="chat-alert" role="status">
          C&apos;est noté — Ayoub revient vers vous le jour ouvrable suivant.
        </p>
      ) : null}

      {!clos && messages.length >= SEUIL_BOUTON ? (
        <div className="chat-end">
          <button type="button" onClick={terminer} disabled={envoi}>
            Envoyer ma demande à Ayoub
          </button>
        </div>
      ) : null}

      {verrouille && !clos ? (
        <p className="chat-alert" role="status">
          Conversation complète — la suite avec Ayoub directement sur{" "}
          <a href={WA_LINK} target="_blank" rel="noopener">WhatsApp</a>, ou par le{" "}
          <a href={sujet ? ANCRE_FORMULAIRE : HREF_ACCUEIL_CONTACT}>formulaire</a>.
        </p>
      ) : null}

      <form className="chat-form" onSubmit={envoyer}>
        <input
          type="text"
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          placeholder={verrouille || clos ? "Conversation terminée" : "Votre réponse…"}
          aria-label="Votre message"
          maxLength={1500}
          disabled={envoi || verrouille || clos}
          autoComplete="off"
        />
        <button type="submit" disabled={envoi || verrouille || clos || saisie.trim() === ""}>
          {envoi ? "…" : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
