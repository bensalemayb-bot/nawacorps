"use client";

import { ouvrirChat } from "@/lib/chat-ouvrir";

/**
 * CTA de devis. Reste un <a href> vers WhatsApp : si le JS ne demarre jamais,
 * le lien fonctionne encore. Le clic est seulement INTERCEPTE pour ouvrir
 * l'assistant, qui qualifie mieux qu'un message WhatsApp vide.
 */
export default function BoutonDevis({
  href,
  sujet,
  className = "lnk",
  children,
}: {
  href: string;
  sujet: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener"
      onClick={(e) => {
        e.preventDefault();
        ouvrirChat(sujet);
      }}
    >
      {children}
    </a>
  );
}
