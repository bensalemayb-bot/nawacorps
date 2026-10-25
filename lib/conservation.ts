/**
 * LES DUREES DE CONSERVATION — ecrites une seule fois.
 *
 * Deux lecteurs, et ils doivent dire la meme chose :
 *  - les pages de confidentialite (FR et EN), qui les ANNONCENT ;
 *  - scripts/purger-donnees.ts, qui les APPLIQUE.
 * Une duree annoncee a 12 mois et purgee a 24 serait une indication inexacte
 * (nLPD art. 6 al. 4 : les donnees sont detruites des qu elles ne sont plus
 * necessaires ; LCD art. 3). D ou ce module : changer un chiffre ici change
 * la promesse ET la purge.
 *
 * POURQUOI CES CHIFFRES (proposition du 25 octobre 2026) :
 *  - 12 mois pour les demandes (Lead) et les conversations : le cycle de vente
 *    d une PME (demo, essai, decision) tient dans l annee ; au-dela, une
 *    demande restee sans suite n a plus d utilite.
 *  - 30 jours pour le journal anti-abus (RateLimit) : la fenetre la plus
 *    longue qu il controle est de 24 h (app/api/chat/route.ts). Un mois laisse
 *    de quoi enqueter sur un abus, pas davantage.
 *
 * Module sans dependance : il est importe par un script lance hors de Next.
 */
export const CONSERVATION = {
  /** Demandes (formulaire et chat), sauf celles devenues clientes (statut WON). */
  leadsMois: 12,
  /** Transcriptions de Leo, avec leur extraction et leur empreinte d IP. */
  conversationsMois: 12,
  /** Journal anti-abus : empreinte d IP, action, date. */
  rateLimitJours: 30,
} as const;
