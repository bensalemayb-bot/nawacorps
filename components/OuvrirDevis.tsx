"use client";

import { useEffect } from "react";
import { ouvrirChat } from "@/lib/chat-ouvrir";

/**
 * L'ASSISTANT S'OUVRE TOUT SEUL SUR /devis, ET IL SAIT SUR QUOI.
 *
 * Ce composant ne rend RIEN. Il n'existe que pour executer une ligne de
 * navigateur depuis une page qui est, elle, un composant serveur : /devis lit
 * Postgres pour resoudre le nom de la prestation, ce qu'un composant client ne
 * peut pas faire. Le nom deja resolu redescend donc ici en props, et repart
 * dans l'evenement d'ouverture (lib/chat-ouvrir.ts).
 *
 * L'ORDRE DE MONTAGE EST PORTEUR, et il tient a app/(site)/layout.tsx :
 * <ChatWidget /> y est ecrit AVANT <div id="smoothWrap">{children}</div>. React
 * declenche les effets dans l'ordre de l'arbre — enfants d'abord, freres de
 * gauche a droite —, donc l'ecouteur du widget est pose avant que cet effet-ci
 * ne parte. Deplacer ChatWidget APRES {children} dans le layout ferait tomber
 * l'evenement dans le vide, sans erreur et sans trace : le visiteur verrait la
 * page sans l'assistant. C'est ecrit ici pour que le prochain lecteur du layout
 * le sache avant d'y toucher.
 *
 * PAS DE REPLI A PREVOIR ICI. Si le JavaScript ne demarre jamais, la page reste
 * entiere : le formulaire de contact est rendu cote serveur juste en dessous et
 * porte deja le sujet en champ cache.
 */
export default function OuvrirDevis({
  sujet,
  libelle,
}: {
  sujet?: string;
  libelle?: string;
}) {
  useEffect(() => {
    ouvrirChat(sujet, libelle);
  }, [sujet, libelle]);

  return null;
}
