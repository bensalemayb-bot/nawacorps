"use client";

import { useState } from "react";

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

export default function ContactForm() {
  const [etat, setEtat] = useState<Etat>({ statut: "repos" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (etat.statut === "envoi") return;
    setEtat({ statut: "envoi" });

    // Capture avant tout await : React remet currentTarget a null des que le
    // gestionnaire rend la main, donc form.reset() plus bas echouerait.
    const form = e.currentTarget;
    const data = new FormData(form);
    const corps = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    };

    // Le studio vend une proposition ecrite : il lui faut un moyen de la
    // renvoyer. Ni le telephone ni l e-mail ne porte `required` seul, mais
    // l un des deux doit etre rempli — la meme regle est imposee cote
    // serveur (app/api/contact/route.ts), qui reste la seule verification
    // qui compte ; celle-ci n evite qu un aller-retour reseau inutile.
    if (!corps.phone.trim() && !corps.email.trim()) {
      setEtat({ statut: "erreur", message: "Indiquez un téléphone ou un e-mail." });
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
        // jour ouvrable suivant » (MENTION_REPONSE, lib/familles.ts), et il
        // est ecrit au-dessus du formulaire partout ou ce composant est
        // rendu — FooterContact.tsx et /contact — le repeter ici en ferait
        // une seconde formulation du meme engagement. Le message de succes
        // dit donc un FAIT verifiable a la place : ou arrive le message
        // (lib/telegram.ts).
        setEtat({
          statut: "succes",
          message: "Message reçu — il arrive directement sur mon téléphone.",
        });
        form.reset();
        return;
      }

      const erreur = (await res.json().catch(() => null)) as { error?: string } | null;
      setEtat({
        statut: "erreur",
        message:
          erreur?.error ??
          "Envoi impossible pour le moment. Écrivez-moi sur WhatsApp en attendant.",
      });
    } catch {
      setEtat({
        statut: "erreur",
        message: "Connexion interrompue. Écrivez-moi sur WhatsApp en attendant.",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ marginTop: 22, maxWidth: "46ch" }}>
      <div style={{ display: "grid", gap: 12 }}>
        <input
          style={champ}
          type="text"
          name="name"
          required
          minLength={2}
          maxLength={80}
          placeholder="Votre nom"
          aria-label="Votre nom"
          autoComplete="name"
        />
        <input
          style={champ}
          type="tel"
          name="phone"
          placeholder="Votre téléphone"
          aria-label="Votre téléphone"
          autoComplete="tel"
        />
        <input
          style={champ}
          type="email"
          name="email"
          maxLength={160}
          placeholder="Votre e-mail"
          aria-label="Votre e-mail"
          autoComplete="email"
        />
        <textarea
          style={{ ...champ, resize: "vertical", minHeight: 110 }}
          name="message"
          maxLength={1000}
          rows={4}
          placeholder="Votre besoin, et votre site actuel si vous en avez un"
          aria-label="Votre message"
        />

        <div style={leurre} aria-hidden="true">
          <label htmlFor="website">Ne remplissez pas ce champ</label>
          <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <button className="btn" type="submit" disabled={etat.statut === "envoi"}>
            {/* « Envoyer » seul ne dit pas ce qui part. Le guide de voix
                impose « Envoyer ma demande » : c est ce que le visiteur
                envoie, et c est le mot du glossaire (entree 6). */}
            {etat.statut === "envoi" ? "Envoi…" : "Envoyer ma demande"}
            <span className="ar">→</span>
          </button>
        </div>
      </div>

      <p className="meta" role="status" aria-live="polite" style={{ marginTop: 14, minHeight: "1.4em" }}>
        {etat.message ?? ""}
      </p>
    </form>
  );
}
