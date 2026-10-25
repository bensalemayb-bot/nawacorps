"use client";

import { useEffect, useState } from "react";

/**
 * LES DOULEURS QUI TOURNENT, au temps 2 du hero (components/NoyauHero.tsx).
 *
 * « Vous perdez [du temps] » : le mot se barre, s'efface, et le suivant
 * arrive (« des clients », « vos soirées »…). Demande d'Ayoub du 25.10.2026 :
 * la phrase dit d'abord ce que le patron perd, puis la réponse (« Mais
 * l'assistant peut s'en charger »).
 *
 * POURQUOI PAS HeroRotation. Le titre tourne UNE fois puis s'arrête sur sa
 * première phrase (la promesse). Ici, le temps 2 est une scène que le
 * visiteur peut regarder longtemps pendant le défilement : la liste tourne
 * en boucle, et la sortie d'un mot est un trait qui le barre, pas une simple
 * glissade — c'est le sens de la phrase.
 *
 * Les mots partagent une cellule de grille (comme `.rot`) : la largeur est
 * celle du plus long, la ligne ne saute pas d'un mot à l'autre.
 * aria-hidden : la phrase complète est portée par l'aria-label du parent.
 * prefers-reduced-motion : le premier mot reste, rien ne bouge.
 */
const AFFICHAGE_MS = 2200;
/** Le trait qui barre (CSS) puis le fondu : la somme des deux transitions. */
const SORTIE_MS = 700;

export default function RotationDouleurs({ mots }: { mots: readonly string[] }) {
  const [{ actif, sortant }, setEtat] = useState<{ actif: number; sortant: number | null }>({
    actif: 0,
    sortant: null,
  });

  useEffect(() => {
    if (mots.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const minuteur = window.setInterval(() => {
      if (document.hidden) return;
      setEtat(({ actif: i }) => ({ actif: (i + 1) % mots.length, sortant: i }));
    }, AFFICHAGE_MS + SORTIE_MS);
    return () => window.clearInterval(minuteur);
  }, [mots.length]);

  return (
    <span className="douleurs serif-i" aria-hidden="true">
      {mots.map((mot, i) => (
        <span
          key={mot}
          className={`douleur${i === actif ? " is-on" : i === sortant ? " is-off" : ""}`}
        >
          {mot}
        </span>
      ))}
    </span>
  );
}
