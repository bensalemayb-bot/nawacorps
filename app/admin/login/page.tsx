"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Connexion a l administration — bloc B11.
 *
 * MESSAGES D ERREUR VOLONTAIREMENT PAUVRES. Le serveur ne distingue pas « mot
 * de passe faux » de « administration non configuree », et l interface ne doit
 * pas rattraper cette discretion : un texte plus precis renseignerait un
 * inconnu sur l etat du deploiement.
 *
 * Le 429 fait exception. Il faut bien dire a la personne legitime qui vient de
 * se tromper cinq fois qu elle doit attendre, sinon elle croirait a une panne
 * et recommencerait.
 */
export default function PageConnexion() {
  const router = useRouter();
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (envoi || motDePasse === "") return;
    setEnvoi(true);
    setErreur("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: motDePasse }),
      });
      if (res.ok) {
        setMotDePasse("");
        // refresh() en plus de replace() : /admin est un Server Component, et
        // seul le serveur peut le recalculer avec le cookie tout juste pose.
        router.replace("/admin");
        router.refresh();
        return;
      }
      setErreur(
        res.status === 429
          ? "Trop de tentatives. Réessayez dans une heure."
          : "Mot de passe refusé.",
      );
    } catch {
      setErreur("Connexion impossible. Vérifiez le réseau.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="admin-login">
      <h1>Administration</h1>
      <p className="sous">Binacore — accès réservé</p>
      <form onSubmit={soumettre}>
        <label htmlFor="mdp">Mot de passe</label>
        <input
          id="mdp"
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          autoComplete="current-password"
          disabled={envoi}
        />
        {erreur ? <p className="erreur" role="alert">{erreur}</p> : null}
        <button type="submit" disabled={envoi || motDePasse === ""}>
          {envoi ? "…" : "Entrer"}
        </button>
      </form>
    </div>
  );
}
