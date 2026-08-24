"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Bouton de deconnexion — bloc B11.
 *
 * refresh() apres la reponse : /admin est un Server Component, et lui seul
 * peut constater que le cookie a disparu. Sans ce rafraichissement, la page
 * resterait affichee telle quelle — avec les leads sous les yeux — alors que
 * la session est deja fermee cote serveur.
 */
export default function Deconnexion() {
  const router = useRouter();
  const [envoi, setEnvoi] = useState(false);

  async function partir() {
    setEnvoi(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <button type="button" className="discret" onClick={partir} disabled={envoi}>
      {envoi ? "…" : "Se déconnecter"}
    </button>
  );
}
