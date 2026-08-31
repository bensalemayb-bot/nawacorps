import type { ServiceCatalogue } from "@/lib/catalogue";
import { familleDuService } from "@/lib/catalogue-familles";
import { FAMILLES, FAMILLE_SLUGS } from "@/lib/familles";
import { FORMULES, FORMULE_SLUGS, estFormule } from "@/lib/formules";
import { whatsapp } from "@/lib/site";

/**
 * CE QUE `?p=` VEUT DIRE — la table de resolution de la page /devis.
 *
 * POURQUOI CE FICHIER EXISTE. Les huit CTA « Demander un devis » du site
 * emettaient chacun un `sujet` (« devis-le-site », « devis-imprimes »…) que
 * PERSONNE NE LISAIT : l'evenement partait, le widget de chat l'ignorait, et la
 * demande arrivait chez Ayoub sans dire sur quoi elle portait. Il fallait
 * rappeler le visiteur pour lui demander ce qu'il venait de cliquer. La page
 * /devis lit desormais ce sujet dans l'URL, et ce fichier est le seul endroit
 * qui sache le traduire.
 *
 * DEUX FORMES SONT ACCEPTEES, ET C'EST DELIBERE :
 *  - un SLUG DE LA TABLE Service (« le-site », « carte-visite »), parce que
 *    c'est ce qu'une carte de catalogue a sous la main et que le nom comme le
 *    prix se lisent alors directement en base ;
 *  - un SUJET DE CTA (« devis-imprimes »), parce que cinq familles et trois
 *    boutons generaux ne designent AUCUNE ligne unique du catalogue — une
 *    famille en regroupe plusieurs.
 * Un `p` inconnu, ou absent, ne casse rien : la page s'ouvre sans prestation
 * nommee. Elle ne jette JAMAIS — un 404 sur un parcours de devis est une
 * demande perdue, pas une erreur a signaler.
 *
 * LES NOMS ET LES PRIX NE SONT PAS ECRITS ICI. Ils viennent de Postgres, comme
 * partout ailleurs sur le site : ce fichier ne connait que des slugs et des
 * libelles de FAMILLE, qui sont eux de la matiere editoriale (lib/familles.ts)
 * et n'ont pas de ligne en base.
 *
 * LES AMORCES WHATSAPP SONT REPRISES, PAS RECOPIEES. Elles vivaient dans le
 * `href` de components/BoutonDevis.tsx, qui pointait sur WhatsApp et
 * interceptait son propre clic ; le bouton est devenu un vrai lien vers /devis,
 * et l'amorce a suivi le visiteur jusqu'ici — c'est sur cette page qu'elle sert
 * encore, comme repli si l'assistant ne demarre pas. Celles des formules et des
 * familles sont LUES dans lib/formules.ts et lib/familles.ts ; seules les
 * quatre qui n'appartenaient a aucun des deux sont ecrites plus bas.
 */

/**
 * Le repli quand la demande ne designe rien de precis — et le seul endroit ou
 * cette phrase est ecrite.
 */
const AMORCE_GENERALE = whatsapp(
  "Bonjour, j'aimerais un devis pour mon entreprise.",
);

/** Ce qu'un sujet de CTA designe. */
type Entree = {
  /**
   * Slug de la table Service, quand le sujet designe UNE ligne chiffrable.
   * C'est elle qui portera le nom et le prix affiches.
   */
  service?: string;
  /**
   * Nom lisible, quand aucune ligne de base ne porte ce nom — une famille, ou
   * un bouton general. Sert aussi de repli si la ligne `service` a ete masquee
   * depuis /admin.
   */
  libelle?: string;
  /** Amorce WhatsApp : le repli si l'assistant ne demarre pas. */
  amorce: string;
};

/**
 * Les trois formules, DERIVEES de lib/formules.ts. Une formule ajoutee la-bas
 * est reconnue ici sans qu'on y revienne, et son sujet ne peut pas diverger.
 */
const DES_FORMULES: Record<string, Entree> = Object.fromEntries(
  FORMULE_SLUGS.map((slug) => [
    FORMULES[slug].sujet,
    { service: slug, amorce: FORMULES[slug].amorce },
  ]),
);

/**
 * Les cinq familles, DERIVEES de lib/familles.ts. Elles n'ont pas de ligne en
 * base — une famille regroupe plusieurs prestations —, donc pas de prix : le
 * libelle editorial est ce qu'on peut nommer honnetement.
 */
const DES_FAMILLES: Record<string, Entree> = Object.fromEntries(
  FAMILLE_SLUGS.map((slug) => [
    FAMILLES[slug].sujet,
    { libelle: FAMILLES[slug].libelle, amorce: FAMILLES[slug].amorce },
  ]),
);

/**
 * Les quatre sujets qui n'appartiennent ni a une formule ni a une famille.
 * Leurs amorces viennent des pages qui les emettaient — components/Offres.tsx,
 * components/CarteDuStudio.tsx, app/(site)/services/page.tsx et
 * app/(site)/studio/page.tsx —, deplacees et non dupliquees.
 *
 * DEUX D'ENTRE EUX N'ONT PAS DE LIBELLE, et c'est exact. `devis-studio` vient
 * du bas de la page du studio, `devis-carte-du-studio` du pied du catalogue de
 * l'accueil : ni l'un ni l'autre ne designe une prestation — ils designent le
 * catalogue entier. Leur donner un nom reviendrait a mettre un mot dans la
 * bouche du visiteur, et l'assistant poserait sa question de depart en faisant
 * semblant de savoir. Le sujet, lui, est quand meme retenu : il dit d'ou vient
 * la demande, ce qui est deja beaucoup plus que rien.
 */
const AUTRES: Record<string, Entree> = {
  "devis-sur-mesure": {
    service: "site-sur-mesure",
    amorce: whatsapp(
      "Bonjour, j'aimerais un devis pour un site à plusieurs pages.",
    ),
  },
  "devis-formules": {
    libelle: "Les formules de site",
    amorce: whatsapp(
      "Bonjour, j'aimerais un devis pour la refonte du site de mon entreprise.",
    ),
  },
  "devis-carte-du-studio": {
    amorce: whatsapp("Bonjour, j'aimerais un devis pour une prestation."),
  },
  "devis-studio": {
    amorce: whatsapp("Bonjour, j'ai lu la page du studio et j'aimerais un devis."),
  },
};

const SUJETS: Record<string, Entree> = {
  ...DES_FORMULES,
  ...DES_FAMILLES,
  ...AUTRES,
};

/**
 * BORNE DE LONGUEUR, ALIGNEE SUR LA BASE. `Lead.subject` est un `String?` que
 * les deux routes d'ecriture plafonnent a 80 caracteres ; une valeur d'URL plus
 * longue que ca ne peut de toute facon designer aucun de nos sujets, et la
 * laisser passer ferait rejeter la demande cote serveur.
 */
const SUJET_MAX = 80;

/** Ce que la page /devis a besoin de savoir de la demande. */
export type DemandeDevis = {
  /**
   * L'identifiant qui part a l'assistant puis sur le Lead. `null` quand `p` est
   * absent ou inconnu — un champ vide vaut mieux qu'un champ invente.
   */
  sujet: string | null;
  /** Le nom lisible, lu en base des qu'une ligne le porte. */
  libelle: string | null;
  /**
   * La ligne du catalogue, quand la demande en designe une. C'est d'elle que
   * viennent le nom ET le prix affiches — jamais de ce fichier.
   */
  service: ServiceCatalogue | null;
  /** L'amorce WhatsApp de repli, toujours renseignee. */
  amorce: string;
};

/** L'amorce qui accompagne une ligne de catalogue, selon ou elle est rangee. */
function amorceDuService(service: ServiceCatalogue): string {
  if (estFormule(service.slug)) return FORMULES[service.slug].amorce;
  return familleDuService(service)?.contenu.amorce ?? AMORCE_GENERALE;
}

/**
 * Resout le `?p=` de /devis contre le catalogue deja charge.
 *
 * Le catalogue est PASSE EN ARGUMENT plutot que relu ici : la page l'a deja en
 * main (lib/catalogue.ts memoise par requete), et une fonction pure se relit
 * mieux qu'une fonction qui interroge Postgres au passage.
 */
export function resoudreDevis(
  brut: string | string[] | undefined,
  catalogue: readonly ServiceCatalogue[],
): DemandeDevis {
  const inconnu: DemandeDevis = {
    sujet: null,
    libelle: null,
    service: null,
    amorce: AMORCE_GENERALE,
  };

  // `?p=a&p=b` rend un tableau : on prend la premiere valeur plutot que de
  // refuser la demande pour une URL malformee.
  const p = (Array.isArray(brut) ? brut[0] : brut)?.trim();
  if (!p || p.length > SUJET_MAX) return inconnu;

  // 1. Un slug de la table Service — le cas le plus riche : nom ET prix.
  const direct = catalogue.find((s) => s.slug === p);
  if (direct) {
    return {
      sujet: direct.slug,
      libelle: direct.name,
      service: direct,
      amorce: amorceDuService(direct),
    };
  }

  // 2. Un sujet de CTA.
  const entree = SUJETS[p];
  if (!entree) return inconnu;

  // La ligne peut avoir ete masquee depuis /admin : on retombe alors sur le
  // libelle editorial, et la page se referme sans prix plutot qu'avec un trou.
  const service = entree.service
    ? (catalogue.find((s) => s.slug === entree.service) ?? null)
    : null;

  return {
    sujet: p,
    libelle: service?.name ?? entree.libelle ?? null,
    service,
    amorce: entree.amorce,
  };
}
