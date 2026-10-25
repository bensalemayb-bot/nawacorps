"use client";

import { useId, useState } from "react";
import { dictionnaire } from "@/lib/dictionnaires";
import { type Locale, lien } from "@/lib/i18n";

/**
 * Formulaire de contact — bloc B8.
 *
 * ZERO CSS NOUVEAU. binacore.css n est pas touche : la maquette reste la
 * reference. On reutilise .btn, .lede et .meta ; les champs eux-memes sont
 * habilles par un style inline minimal, bati sur les variables du design
 * system (--line, --ink, --bone, --r, --sans) pour rester coherent sans
 * introduire une regle de plus.
 *
 * LEURRE : le champ `website` est deporte hors de l ecran, pas masque en
 * display:none — beaucoup de bots savent reconnaitre display:none et sautent
 * le champ, ce qui annule le piege. Il est aussi retire du parcours clavier
 * (tabIndex -1) et de l autocompletion, pour qu aucun humain ne le remplisse
 * par accident.
 *
 * `subject` — CE QUE LA DEMANDE CONCERNE, QUAND ON LE SAIT. La prop est
 * OPTIONNELLE, et elle doit le rester : ce formulaire est aussi rendu par
 * components/FooterContact.tsx et par /contact, ou le visiteur arrive sans
 * avoir rien clique. Seule app/(site)/devis la renseigne, avec le slug ou le
 * sujet resolu depuis l URL. Elle part en CHAMP CACHE plutot qu en variable de
 * fermeture pour une raison de fond : le champ appartient alors au formulaire,
 * et il suit exactement le meme chemin que les autres — meme FormData, meme
 * validation cote serveur (app/api/contact/route.ts), meme borne de longueur.
 * Rien ne peut partir que le serveur ne verifie.
 *
 * `locale` — LA LANGUE DU FORMULAIRE, « fr » par defaut. Ce composant est le
 * SEUL du chrome a etre un composant CLIENT, et cela a une consequence sur la
 * facon dont il lit ses chaines : `dictionnaire(locale)` est appele ICI, dans
 * le corps du composant, et non recu en prop. C est ce que permet le chargeur
 * synchrone de lib/dictionnaires/index.ts — le dictionnaire ne contient QUE
 * des chaines, jamais de fonction, si bien qu il traverse sans probleme la
 * frontiere serveur/client. Une fonction, elle, ne la traverserait pas : c est
 * la raison pour laquelle « Genève — 14:32 » se compose chez l appelant a
 * partir de morceaux, et jamais par un helper range dans le dictionnaire.
 *
 * LES MESSAGES DU SERVEUR SONT BILINGUES DEPUIS LE CHANTIER ANGLAIS, et c est
 * ce formulaire qui rend ca possible : il envoie `locale` dans le corps de la
 * requete. La route ne devine pas la langue — sans cette ligne, elle repondrait
 * en francais a un visiteur anglophone. Zod la lit avec `.catch()` plutot que
 * `.default()` : une valeur inattendue retombe sur le francais AU LIEU de
 * refuser la demande, parce qu un champ decoratif ne doit jamais coûter un lead.
 *
 * ACCESSIBILITE ET INFORMATION (25 octobre 2026). Chaque champ a desormais un
 * vrai <label for>, masque visuellement (`sr-only`) pour ne pas toucher a la
 * mise en page : un `aria-label` seul n est pas lu par tous les outils, et un
 * placeholder disparait des qu on tape. Le libelle dit ce qui est obligatoire.
 * Sous le bouton, une mention courte dit a quoi servent les donnees et mene a
 * la page de confidentialite — sans case a cocher, puisque aucun traitement ne
 * repose sur le consentement (voir /confidentialite).
 *
 * RESERVE CONNUE : seul `erreur.error` est affiche, jamais les `issues`. Le
 * message precis (« Indiquez votre nom (2 caracteres au moins). ») part bien
 * dans la reponse mais reste invisible ; le visiteur lit « Donnees invalides. ».
 * C est un choix produit non tranche, pas un defaut de traduction.
 */

type Etat = { statut: "repos" | "envoi" | "succes" | "erreur"; message?: string };

const champ: React.CSSProperties = {
  width: "100%",
  padding: "0.9em 1.1em",
  border: "1px solid var(--line)",
  borderRadius: "var(--r)",
  background: "var(--bone-2)",
  color: "var(--ink)",
  font: "inherit",
  fontFamily: "var(--sans)",
};

const leurre: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  width: "1px",
  height: "1px",
  overflow: "hidden",
};

export default function ContactForm({
  subject,
  locale = "fr",
}: {
  subject?: string;
  locale?: Locale;
}) {
  const t = dictionnaire(locale);
  const [etat, setEtat] = useState<Etat>({ statut: "repos" });
  // Ids uniques : ce formulaire peut etre rendu deux fois sur un meme ecran
  // (pied de page et page), et deux `for="nom"` designeraient le meme champ.
  const id = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (etat.statut === "envoi") return;
    setEtat({ statut: "envoi" });

    // Capture avant tout await : React remet currentTarget a null des que le
    // gestionnaire rend la main, donc form.reset() plus bas echouerait.
    const form = e.currentTarget;
    const data = new FormData(form);
    // Le sujet est lu dans le FORMULAIRE et non dans la prop : le champ cache
    // est deja la, et le lire ici garde une seule provenance a tout ce qui
    // part. `undefined` quand il est vide — JSON.stringify l omet alors du
    // corps, et le schema serveur le traite en absent plutot qu en chaine vide,
    // qui finirait ecrite telle quelle en base.
    const sujet = String(data.get("subject") ?? "").trim();
    const corps = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
      subject: sujet === "" ? undefined : sujet,
      // Sans cette ligne, la route repond en francais a un visiteur anglophone :
      // elle est bilingue depuis le chantier anglais, mais elle ne devine pas la
      // langue — c est l appelant qui la porte. Zod la lit avec .catch(), donc une
      // valeur inattendue retombe sur le francais au lieu de refuser la demande.
      locale,
    };

    // Le studio vend une proposition ecrite : il lui faut un moyen de la
    // renvoyer. Ni le telephone ni l e-mail ne porte `required` seul, mais
    // l un des deux doit etre rempli — la meme regle est imposee cote
    // serveur (app/api/contact/route.ts), qui reste la seule verification
    // qui compte ; celle-ci n evite qu un aller-retour reseau inutile.
    if (!corps.phone.trim() && !corps.email.trim()) {
      setEtat({ statut: "erreur", message: t.formulaire.erreurContact });
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(corps),
      });

      if (res.ok) {
        // « réponse sous 24 h » a survecu ici a la purge des delais parce
        // qu il vivait dans une chaine JS et non dans du JSX. C est pourtant
        // le meme engagement interdit : le seul autorise est « réponse le
        // jour ouvrable suivant » (MENTION_REPONSE, lib/mentions.ts), et il
        // est ecrit au-dessus du formulaire partout ou ce composant est
        // rendu — FooterContact.tsx et /contact — le repeter ici en ferait
        // une seconde formulation du meme engagement. Le message de succes
        // dit donc un FAIT verifiable a la place : ou arrive le message
        // (lib/telegram.ts).
        setEtat({ statut: "succes", message: t.formulaire.succes });
        form.reset();
        return;
      }

      const erreur = (await res.json().catch(() => null)) as { error?: string } | null;
      setEtat({
        statut: "erreur",
        message: erreur?.error ?? t.formulaire.erreurEnvoi,
      });
    } catch {
      setEtat({ statut: "erreur", message: t.formulaire.erreurReseau });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ marginTop: 22, maxWidth: "46ch" }}>
      <div style={{ display: "grid", gap: 12 }}>
        <label className="sr-only" htmlFor={`${id}-nom`}>{t.formulaire.labelNom}</label>
        <input
          id={`${id}-nom`}
          style={champ}
          type="text"
          name="name"
          required
          aria-required="true"
          minLength={2}
          maxLength={80}
          placeholder={t.formulaire.nom}
          autoComplete="name"
        />
        <label className="sr-only" htmlFor={`${id}-tel`}>{t.formulaire.labelTelephone}</label>
        <input
          id={`${id}-tel`}
          style={champ}
          type="tel"
          name="phone"
          placeholder={t.formulaire.telephone}
          autoComplete="tel"
        />
        <label className="sr-only" htmlFor={`${id}-email`}>{t.formulaire.labelEmail}</label>
        <input
          id={`${id}-email`}
          style={champ}
          type="email"
          name="email"
          maxLength={160}
          placeholder={t.formulaire.email}
          autoComplete="email"
        />
        <label className="sr-only" htmlFor={`${id}-message`}>{t.formulaire.messageLabel}</label>
        <textarea
          id={`${id}-message`}
          style={{ ...champ, resize: "vertical", minHeight: 110 }}
          name="message"
          maxLength={1000}
          rows={4}
          placeholder={t.formulaire.message}
        />

        {/* Le sujet, quand la page en connait un. `type="hidden"` et non le
            leurre ci-dessous : ce champ-la doit rester invisible ET hors du
            parcours, celui-ci n existe simplement pas a l ecran. Il n est rendu
            que s il porte une valeur — un champ vide n a rien a envoyer. */}
        {subject ? (
          <input type="hidden" name="subject" value={subject} readOnly />
        ) : null}

        <div style={leurre} aria-hidden="true">
          <label htmlFor={`${id}-website`}>{t.formulaire.leurre}</label>
          <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <button className="btn" type="submit" disabled={etat.statut === "envoi"}>
            {/* « Envoyer » seul ne dit pas ce qui part. Le guide de voix
                impose « Envoyer ma demande » : c est ce que le visiteur
                envoie, et c est le mot du glossaire (entree 6). */}
            {etat.statut === "envoi" ? t.formulaire.envoiEnCours : t.formulaire.envoyer}
            <span className="ar">→</span>
          </button>
        </div>
      </div>

      <p className="meta" role="status" aria-live="polite" style={{ marginTop: 14, minHeight: "1.4em" }}>
        {etat.message ?? ""}
      </p>

      {/* LA MENTION D INFORMATION (nLPD art. 19) : ce qui est obligatoire, a
          quoi servent les donnees, ou lire le reste. Le lien suit la langue
          du formulaire. Taille et couleur des notes du site, rien de neuf. */}
      <p style={{ marginTop: 6, fontSize: ".78rem", color: "var(--muted)", maxWidth: "46ch" }}>
        {t.formulaire.mentionRequis}{" "}
        {t.formulaire.mentionDebut}
        <a className="lnk" href={lien(locale, "/confidentialite")}>{t.formulaire.mentionLien}</a>.
      </p>
    </form>
  );
}
