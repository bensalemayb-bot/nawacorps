"use client";

import { useEffect, useState } from "react";

/**
 * LA DEUXIEME LIGNE DU H1, QUI TOURNE — « connaît votre métier. »,
 * « prépare la paperasse. », « relance vos devis. », « attend votre
 * accord. ». Les fins viennent de lib/dictionnaires (`h1Rotation`) et
 * tiennent chacune en 21 caracteres au plus.
 *
 * UN SEUL TOUR, PUIS ARRET SUR LA PREMIERE PHRASE (la promesse) : un contenu
 * qui bouge seul plus de 5 s a cote d autre contenu doit pouvoir s arreter
 * (WCAG 2.2.2). Le tour dure environ 12,4 s ; au lieu d un bouton pause, la
 * rotation s arrete d elle-meme. Onglet masque, le minuteur ne compte pas :
 * le visiteur qui revient voit la suite du tour, pas un tour deja fini.
 *
 * LES PHRASES SONT SUPERPOSEES DANS UNE SEULE CELLULE DE GRILLE (.rot,
 * binacore.css) : la cellule prend la taille de la plus longue, donc la hauteur
 * du titre ne bouge jamais quand la phrase change. Sans ca, le hero-foot
 * sauterait a chaque rotation, puisqu il est colle au bas du pli.
 *
 * LE PREMIER RENDU MONTRE TOUJOURS LA PREMIERE PHRASE, cote serveur comme cote
 * client : l index part de 0 et ne bouge qu apres le montage, donc pas
 * d ecart d hydratation.
 *
 * `prefers-reduced-motion` : le minuteur ne demarre pas du tout, et le titre
 * reste sur la premiere phrase.
 *
 * Le lecteur d ecran ne lit pas ces phrases (aria-hidden) : il lit la phrase
 * complete portee par l aria-label du h1, dans NoyauHero.
 */
const AFFICHAGE_MS = 2600;
const TRANSITION_MS = 500;

export default function HeroRotation({ phrases }: { phrases: string[] }) {
  // Un seul etat pour les deux index : la phrase qui part et celle qui arrive
  // changent dans le meme rendu, sinon l une glisserait sans l autre.
  const [{ actif, precedent }, setEtat] = useState<{
    actif: number;
    precedent: number | null;
  }>({ actif: 0, precedent: null });

  useEffect(() => {
    if (phrases.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let pas = 0;
    const minuteur = window.setInterval(() => {
      if (document.hidden) return;
      pas += 1;
      setEtat(({ actif: i }) => ({
        actif: (i + 1) % phrases.length,
        precedent: i,
      }));
      // Apres `phrases.length` pas, l index est revenu a 0 : on s arrete la.
      if (pas >= phrases.length) window.clearInterval(minuteur);
    }, AFFICHAGE_MS + TRANSITION_MS);
    return () => window.clearInterval(minuteur);
  }, [phrases.length]);

  return (
    <span className="rot serif-i" aria-hidden="true">
      {phrases.map((phrase, i) => (
        <span
          key={phrase}
          className={`rot-w${i === actif ? " is-on" : i === precedent ? " is-off" : ""}`}
        >
          {phrase}
        </span>
      ))}
    </span>
  );
}
