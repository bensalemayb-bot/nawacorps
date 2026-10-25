"use client";

import { useEffect } from "react";

/**
 * LES ANCRES DU SITE, SOUS LE SCROLL INERTIEL. Ce composant ne rend rien.
 *
 * POURQUOI. #smoothWrap est `position:fixed; overflow:hidden` et c'est
 * #smooth qu'Interactions.tsx translate au rythme de `window.scrollY` : un
 * lien `#methode` natif faisait défiler le mauvais conteneur, et le bouton
 * « Comment ça se passe » changeait l'adresse sans bouger la page (constaté
 * le 25.10.2026). Ici, on calcule la position de la cible DANS le contenu et
 * on fait défiler la fenêtre : le scroll inertiel suit, comme pour une molette.
 *
 * Remplace components/AncresDemonstrations.tsx, qui ne valait que pour les
 * pastilles de /demonstrations : même calcul, étendu à toutes les pages.
 *
 * QUELS LIENS. `#id` pur, et `/chemin#id` quand le chemin est la page
 * courante (les liens passent par `lien()`, qui écrit `/#offres` depuis une
 * autre page). Un lien vers une AUTRE page garde son comportement normal :
 * la page change, et l'ancre est visée au chargement (plus bas).
 * Le menu plein écran se referme par son propre écouteur (Interactions.tsx,
 * `.menu a[href*="#"]`) : on n'y touche pas.
 */
const DECALAGE_NAV = 84;

function allerA(id: string): boolean {
  if (!id) return false;
  const cible = document.getElementById(id);
  if (!cible) return false;
  const smooth = document.getElementById("smooth");
  // Position dans le contenu, quel que soit le `transform` en cours sur
  // #smooth : les deux rectangles le portent, la différence non.
  const haut = smooth
    ? cible.getBoundingClientRect().top - smooth.getBoundingClientRect().top
    : cible.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, Math.max(0, haut - DECALAGE_NAV));
  return true;
}

/** L'id visé par un lien de la page courante, ou null. */
function ancreDuLien(a: HTMLAnchorElement): string | null {
  const href = a.getAttribute("href");
  if (!href || !href.includes("#")) return null;
  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  const ici = window.location.pathname.replace(/\/$/, "") || "/";
  const la = url.pathname.replace(/\/$/, "") || "/";
  if (ici !== la) return null;
  return decodeURIComponent(url.hash.slice(1)) || null;
}

export default function AncresPage() {
  useEffect(() => {
    // L ANCRE DE L URL, AU CHARGEMENT. Pendant la première seconde, le scroll
    // inertiel fixe #smoothWrap et repose la hauteur du document, le voile
    // d'intro joue, et le navigateur peut restaurer sa propre position : on
    // vise trois fois, et on s'arrête dès que le visiteur défile lui-même.
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const minuteries: number[] = [];
    let main = false;
    const reprise = () => {
      main = true;
    };
    if (hash) {
      for (const delai of [0, 350, 900]) {
        minuteries.push(window.setTimeout(() => !main && allerA(hash), delai));
      }
      window.addEventListener("wheel", reprise, { once: true, passive: true });
      window.addEventListener("touchstart", reprise, { once: true, passive: true });
      window.addEventListener("keydown", reprise, { once: true });
    }

    function surClic(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      const id = ancreDuLien(a);
      if (id && allerA(id)) {
        e.preventDefault();
        // L'adresse garde l'ancre (partage, retour arrière), sans que le
        // navigateur tente son propre saut.
        history.pushState(null, "", `#${encodeURIComponent(id)}`);
      }
    }
    document.addEventListener("click", surClic);
    return () => {
      minuteries.forEach((m) => window.clearTimeout(m));
      window.removeEventListener("wheel", reprise);
      window.removeEventListener("touchstart", reprise);
      window.removeEventListener("keydown", reprise);
      document.removeEventListener("click", surClic);
    };
  }, []);

  return null;
}
