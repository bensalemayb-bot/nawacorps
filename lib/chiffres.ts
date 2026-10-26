/**
 * LES ADRESSES DES SOURCES CHIFFRÉES — une seule fois, pour les deux langues.
 *
 * Les phrases vivent dans lib/dictionnaires (clé `chiffres`), qui citent ces
 * adresses : une URL ne se traduit pas, et la recopier dans fr.ts et en.ts
 * laisserait les deux diverger. L'accueil (components/Chiffres.tsx) et
 * /llms.txt lisent les mêmes entrées.
 *
 * D'OÙ ILS VIENNENT : founder/research/chiffres-cles.md (recherche du
 * 25.10.2026), où chaque chiffre a été relu à la source. Ne retenir que des
 * sources classées « fort ». Sont écartés exprès : HVAC Industry Pulse 2025
 * (co-publié par un vendeur de secrétariat), CCIG 2026 (taille d'échantillon
 * non publiée), et tout chiffre d'éditeur de logiciel. Aucun de ces chiffres
 * n'est un résultat de Nawa Corps ; le site ne le laisse jamais croire.
 */
export const SOURCES_CHIFFRES = {
  /**
   * « Analyse de l'impact de l'IA sur l'économie genevoise », PwC Suisse pour
   * le DEE / OCEI, communiqué de l'État de Genève du 5.12.2024 : 54 % des
   * plus de 200 PME répondantes utilisent l'IA. Relu à la source le 26.10.2026.
   */
  geneve: "https://www.ge.ch/document/moitie-pme-genevoises-utilisent-ia-etude-inedite",
  /** Baromètre ARTIsanté CAPEB / IRIS-ST, communiqué du 26.5.2026 (PDF). */
  capeb:
    "https://www.capeb.fr/www/capeb/media/national/cp-capeb-barometre-artisante-2025-sante-conditions-de-travail-et-realite-des-artisans-du-btp-et-du-paysage.pdf",
  /** Bürokratiemonitor du SECO, communiqué du Conseil fédéral du 1.3.2023. */
  seco: "https://www.admin.ch/gov/de/start/dokumentation/medienmitteilungen.msg-id-93320.html",
  /** Noy & Zhang, « Experimental evidence… », Science 381 (2023). */
  noyZhang: "https://www.science.org/doi/10.1126/science.adh2586",
  /** Brynjolfsson, Li & Raymond, NBER w31161 (2023), publié au QJE en 2025. */
  brynjolfsson: "https://www.nber.org/papers/w31161",
} as const;
