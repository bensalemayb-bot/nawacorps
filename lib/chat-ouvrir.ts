/**
 * Ouverture de l'assistant depuis n'importe ou dans la page.
 *
 * Un evenement sur window plutot qu'un contexte React : ChatWidget est monte
 * dans app/(site)/layout.tsx, HORS de #smoothWrap (il est en position:fixed),
 * alors que les CTA vivent dedans. Un contexte devrait envelopper les deux et
 * ferait remonter du state client tres haut dans l'arbre, pour un seul booleen.
 *
 * Le `sujet` sert a pre-remplir la conversation au bloc suivant, quand on
 * configurera l'assistant. Il est transmis des maintenant pour ne pas avoir a
 * retoucher tous les appelants ensuite.
 */
export const NAWA_CHAT_OUVRIR = "nawa:chat-ouvrir";

export type DetailOuverture = { sujet?: string };

export function ouvrirChat(sujet?: string): void {
  window.dispatchEvent(
    new CustomEvent<DetailOuverture>(NAWA_CHAT_OUVRIR, { detail: { sujet } }),
  );
}
