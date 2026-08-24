"use client";

import { useState } from "react";

/**
 * Selecteur de statut d un lead — bloc B11.
 *
 * Le plus petit composant client possible : la page /admin reste un Server
 * Component, seule cette cellule sait cliquer. Rendre la page entiere cliente
 * aurait fait voyager tous les leads jusqu au navigateur pour un unique
 * <select>.
 *
 * ENVOI AU CHANGEMENT, sans bouton « enregistrer » : un statut est une valeur
 * unique, choisie d un geste. Un bouton en plus du choix ferait deux gestes
 * pour une seule decision — et laisserait croire qu on peut choisir sans
 * enregistrer.
 *
 * EN CAS D ECHEC, LA VALEUR REVIENT EN ARRIERE. Laisser le nouveau statut
 * affiche apres un refus ferait croire a un enregistrement qui n a pas eu
 * lieu ; le lead serait traite comme contacte alors qu il ne l est pas.
 */

const STATUTS = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const;

export default function StatutLead({ id, initial }: { id: string; initial: string }) {
  const [statut, setStatut] = useState(initial);
  const [etat, setEtat] = useState<"" | "ok" | "ko">("");
  const [envoi, setEnvoi] = useState(false);

  async function changer(valeur: string) {
    const precedent = statut;
    setStatut(valeur);
    setEnvoi(true);
    setEtat("");
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: valeur }),
      });
      if (res.ok) {
        setEtat("ok");
      } else {
        setStatut(precedent);
        setEtat("ko");
      }
    } catch {
      setStatut(precedent);
      setEtat("ko");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <>
      <select
        value={statut}
        onChange={(e) => changer(e.target.value)}
        disabled={envoi}
        aria-label="Statut du lead"
      >
        {STATUTS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {etat ? (
        <span className={`etat ${etat}`} role="status">
          {etat === "ok" ? "enregistré" : "échec"}
        </span>
      ) : null}
    </>
  );
}
