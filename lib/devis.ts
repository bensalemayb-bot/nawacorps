import type { Locale } from "@/lib/i18n";
import { whatsapp } from "@/lib/site";

/**
 * CE QUE `?p=` VEUT DIRE — la table de resolution de la page /devis, devenue
 * la demande de demo le 24.10.2026 (docs/agents/copy/devis.md).
 *
 * Un bouton du site peut mener a `/devis?p=<sujet>` : la page lit ce sujet,
 * le passe a l assistant (components/OuvrirDevis.tsx) et au formulaire en
 * champ cache, si bien que la demande arrive chez Ayoub en disant d ou elle
 * vient (`Lead.subject`).
 *
 * L ANCIENNE OFFRE N EST PLUS RECONNUE. Les formules de site, le sur-mesure,
 * la carte du studio et les familles ont quitte le site : leurs sujets
 * (« devis-le-site », « devis-imprimes »…) et les slugs de la table Service
 * retombent sur la demande generale, comme tout `p` inconnu. La page ne jette
 * JAMAIS — un 404 sur une demande de demo est une demande perdue.
 *
 * AUCUN NOM DE PRESTATION NI AUCUN PRIX : il n y a plus qu une demande
 * possible, la demo de l assistant.
 *
 * Le SUJET ne se traduit jamais : c est un identifiant qui part en base. Seule
 * l amorce WhatsApp change de langue.
 */

/**
 * L amorce WhatsApp de repli, dans chaque langue. Indexee par `Locale` : une
 * langue ajoutee a lib/i18n.ts casse la compilation ici tant que sa phrase
 * manque, au lieu d ouvrir WhatsApp sur un message vide.
 */
const AMORCES_GENERALES: Record<Locale, string> = {
  fr: whatsapp("Bonjour, j'aimerais une démo de l'assistant sur mon métier."),
  en: whatsapp("Hello, I'd like a demo of the assistant on my trade."),
};

/**
 * Les sujets encore emis par un bouton du site. `devis-studio` vient du bas
 * de /studio (components/BoutonDevis.tsx) : il dit d ou vient la demande, sans
 * nommer de prestation, et prend l amorce generale.
 */
const SUJETS_CONNUS: ReadonlySet<string> = new Set(["devis-studio"]);

/**
 * BORNE DE LONGUEUR, ALIGNEE SUR LA BASE : `Lead.subject` est plafonne a 80
 * caracteres par les routes d ecriture. Au-dela, aucun sujet connu.
 */
const SUJET_MAX = 80;

/** Ce que la page /devis a besoin de savoir de la demande. */
export type DemandeDevis = {
  /** L identifiant qui part a l assistant puis sur le Lead ; `null` si inconnu. */
  sujet: string | null;
  /**
   * Un nom lisible a montrer au visiteur. Toujours `null` aujourd hui : aucun
   * sujet connu ne designe une prestation. Le champ reste parce que la page et
   * l assistant savent deja l afficher le jour ou un sujet en aura un.
   */
  libelle: string | null;
  /** L amorce WhatsApp de repli, toujours renseignee. */
  amorce: string;
};

/** Resout le `?p=` de /devis. Fonction pure : ni base, ni exception. */
export function resoudreDevis(
  brut: string | string[] | undefined,
  locale: Locale = "fr",
): DemandeDevis {
  // `?p=a&p=b` rend un tableau : on prend la premiere valeur.
  const p = (Array.isArray(brut) ? brut[0] : brut)?.trim();
  const connu = !!p && p.length <= SUJET_MAX && SUJETS_CONNUS.has(p);

  return {
    sujet: connu ? p : null,
    libelle: null,
    amorce: AMORCES_GENERALES[locale],
  };
}
