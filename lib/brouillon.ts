import type { Metadata } from "next";
import { isValidElement } from "react";

/**
 * LES PAGES LEGALES EN BROUILLON NE S INDEXENT PAS — decision d Ayoub du
 * 25.10.2026 (audit CRO/SEO v3, 3.1).
 *
 * Tant qu une page legale porte un marqueur « [À COMPLÉTER] » ou
 * « [À VÉRIFIER] » (adresse postale, verifications des sous-traitants…), elle
 * sort en `noindex, follow` et quitte le sitemap. Les liens du pied restent :
 * la page existe et se lit, elle ne se presente simplement pas aux moteurs
 * comme une page finie.
 *
 * LE CALCUL EST AUTOMATIQUE, ET C EST TOUT L INTERET. Chaque page passe son
 * propre contenu a `estBrouillon` — l arbre JSX de son corps, ou ses textes —
 * et c est la presence du marqueur qui decide. Le jour ou le dernier crochet
 * disparait (de la page ou de lib/site.ts, d ou vient l adresse), l indexation
 * revient sans retouche, ici comme dans app/sitemap.ts. Aucune liste de pages
 * « encore en brouillon » a tenir a la main : elle mentirait un jour.
 *
 * ETAT AU 25 OCTOBRE 2026 : plus aucun marqueur sur les pages legales (FR et
 * EN) — adresse fournie, sous-traitants verifies (voir l en-tete de
 * app/(site)/confidentialite/page.tsx). Elles sont donc indexees et au
 * sitemap. Ce module reste le garde-fou du prochain marqueur.
 */

/** Le marqueur, tel qu il s ecrit sur les pages (FR et EN). */
export const MARQUEUR_BROUILLON = /\[À (?:COMPLÉTER|VÉRIFIER)/;

/**
 * Le texte d un arbre JSX ou d un objet de textes, SANS RENDU : on descend
 * dans `props.children` des elements et dans les valeurs des objets. Un
 * composant n est pas execute (ses enfants passes en JSX, si) : les pages
 * legales n ecrivent leur prose qu en elements HTML, et ce qui vient de
 * lib/site.ts y est interpole en texte.
 */
function texteDe(noeud: unknown): string {
  if (noeud == null || typeof noeud === "boolean") return "";
  if (typeof noeud === "string" || typeof noeud === "number") return String(noeud);
  if (Array.isArray(noeud)) return noeud.map(texteDe).join(" ");
  if (isValidElement(noeud)) {
    return texteDe((noeud.props as { children?: unknown }).children);
  }
  if (typeof noeud === "object") return Object.values(noeud).map(texteDe).join(" ");
  return "";
}

/** Vrai si l une des sources porte encore un marqueur de brouillon. */
export function estBrouillon(...sources: unknown[]): boolean {
  return MARQUEUR_BROUILLON.test(sources.map(texteDe).join(" "));
}

/**
 * Le champ `robots` d une page legale : `noindex, follow` en brouillon, et
 * RIEN sinon — la page reprend alors la regle du layout, comme les autres.
 */
export function robotsSiBrouillon(brouillon: boolean): Pick<Metadata, "robots"> {
  return brouillon ? { robots: { index: false, follow: true } } : {};
}
