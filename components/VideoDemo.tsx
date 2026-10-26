"use client";

import { useEffect, useRef } from "react";

/**
 * LA DÉMONSTRATION FILMÉE, en tête de /demonstrations (26.10.2026).
 *
 * C'EST UN VRAI AGENT MAIL, UTILISABLE (précision d'Ayoub, 26.10.2026) :
 * l'outil filmé tourne réellement. La légende ne mentionne plus la boîte de
 * test (Ayoub, 26.10.2026 : « pas une info pertinente ») ; elle garde
 * « noms et adresses floutés », qui explique le flou à l'écran. Une vraie boîte mail triée par l'assistant : une demande arrive, il la
 * classe, prépare la réponse, le patron la relit et l'envoie. 38 secondes,
 * sans son. Les noms, adresses et la marque de l'outil sont FLOUTÉS dans le
 * fichier lui-même (public/video/agent-mail.*) : la vidéo vient d'un compte
 * de test, mais une adresse e-mail reste une donnée personnelle (nLPD), et la
 * légende dit que les noms et adresses sont floutés.
 *
 * POURQUOI UN COMPOSANT CLIENT. La vidéo ne joue que quand elle est à
 * l'écran (IntersectionObserver) : en boucle hors champ, elle mangerait de la
 * batterie et du processeur pendant le scroll inertiel. Et elle ne démarre
 * JAMAIS seule si le visiteur a demandé moins d'animations
 * (prefers-reduced-motion) : il garde l'image fixe et les contrôles.
 */
export default function VideoDemo({
  legende,
  libelle,
}: {
  legende: string;
  libelle: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const obs = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 },
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, []);

  return (
    <figure className="dm-video" data-reveal>
      <video
        ref={ref}
        muted
        loop
        playsInline
        controls
        preload="metadata"
        poster="/video/agent-mail-poster.webp"
        aria-label={libelle}
        width={1600}
        height={722}
      >
        <source src="/video/agent-mail.webm" type="video/webm" />
        <source src="/video/agent-mail.mp4" type="video/mp4" />
      </video>
      <figcaption>{legende}</figcaption>
    </figure>
  );
}
