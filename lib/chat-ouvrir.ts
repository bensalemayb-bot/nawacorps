/**
 * Ouverture de l'assistant depuis n'importe ou dans la page.
 *
 * Un evenement sur window plutot qu'un contexte React : ChatWidget est monte
 * dans app/(site)/layout.tsx, HORS de #smoothWrap (il est en position:fixed),
 * alors que la page qui demande l'ouverture vit dedans. Un contexte devrait
 * envelopper les deux et ferait remonter du state client tres haut dans
 * l'arbre, pour un seul booleen.
 *
 * LE `sujet` EST DESORMAIS CONSOMME. Il l'annonce depuis le bloc B9 sans que
 * personne ne le lise ; components/ChatWidget.tsx le garde maintenant en etat,
 * l'ecrit dans la premiere phrase de la conversation et le pose sur le Lead
 * (colonne Lead.subject) au moment de la finalisation. Une demande arrivait
 * jusque-la nue : le visiteur avait clique « Le Site », et il fallait le
 * rappeler pour savoir de quoi il parlait.
 *
 * LE `libelle` EST RESOLU COTE SERVEUR, ET C'EST TOUT L'INTERET. Le sujet est
 * un identifiant (aujourd'hui le seul connu est « devis-studio », lib/devis.ts) ;
 * le libelle serait le NOM d'une prestation tel qu'il est ecrit en base. Le
 * widget est un composant client : lui faire deviner ce nom l'obligerait a
 * tenir une copie du catalogue, qui divergerait de Postgres au premier
 * renommage. C'est app/(site)/devis qui le transmet deja resolu ; depuis la
 * refonte, aucun sujet ne designe une prestation et il vaut `null`.
 */
export const NAWA_CHAT_OUVRIR = "nawa:chat-ouvrir";

export type DetailOuverture = {
  /** Identifiant de la demande — slug de prestation ou sujet de CTA. */
  sujet?: string;
  /** Le nom lisible de la prestation, lu en base par la page appelante. */
  libelle?: string;
};

export function ouvrirChat(sujet?: string, libelle?: string): void {
  window.dispatchEvent(
    new CustomEvent<DetailOuverture>(NAWA_CHAT_OUVRIR, {
      detail: { sujet, libelle },
    }),
  );
}
