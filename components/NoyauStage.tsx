"use client";

import { useEffect, useRef } from "react";

/**
 * LE NOYAU — la scene epinglee du hero.
 *
 * Ce composant ne rend QUE le visuel. Le texte du hero vit dans NoyauHero, en
 * flux normal, dans #smooth : il reste du vrai DOM indexable, et il defile
 * par-dessus le noyau comme le texte de la reference defile par-dessus la
 * montre. Ici, rien que l'objet, ses anneaux et sa chambre.
 *
 * IL EST MONTE HORS DE #smoothWrap (cf. (site)/layout.tsx). La raison est celle
 * que ce layout documente deja pour nav/loader/cursor : #smooth porte un
 * translate3d, et un position:fixed sous un ancetre transforme se resout contre
 * cet ancetre, pas contre le viewport. A l'interieur, le noyau defilerait.
 *
 * Il s'auto-desactive si la piste #noyau-track est absente — donc partout
 * ailleurs que sur l'accueil (mentions legales, confidentialite).
 */

/** Piste de cles [progression 0-1, valeur], adoucie entre deux cles. */
type Piste = number[][];

/**
 * Le decoupage, transpose de la reference :
 *  0 -> .18  apparition       le noyau se pose, la ligne d'accroche monte
 * .18 -> .42 contemplation    il se dilate, derive a droite, le texte prend la gauche
 * .42 -> .72 plongee          la camera entre dans le coeur dore, les anneaux fusent
 * .72 -> 1   retrait          il remonte et s'efface, la page reprend la main
 */
const PISTES: Record<string, Piste> = {
  // Echelle. Plafond a 2.5 et non 2.9 : la source fait 1448px de large, au-dela
  // le suragrandissement se voit. Le leger flou de `flou` acheve de le couvrir.
  echelle: [[0, .96], [.18, 1], [.42, 1.16], [.62, 2.5], [.8, 1.9], [1, 1.04]],
  // Fractions du viewport, pas des pixels : la derive tient a toutes les tailles.
  x: [[0, 0], [.18, 0], [.42, .13], [.62, .16], [.8, .04], [1, 0]],
  y: [[0, .02], [.18, 0], [.42, -.01], [.62, .01], [.8, -.05], [1, -.15]],
  rot: [[0, -6], [.18, 0], [.42, 7], [.62, 15], [.8, 20], [1, 26]],
  // Profondeur de champ au plus pres du coeur — un vrai macro n'est net que sur
  // un plan. Accessoirement, cela masque le suragrandissement.
  flou: [[0, 0], [.5, 0], [.66, 1.1], [.8, 0], [1, 0]],
  opacite: [[0, 1], [.86, 1], [1, 0]],
  ecart: [[0, .9], [.18, 1], [.42, 1.16], [.62, 2.9], [.8, 1.6], [1, 1.05]],
  anneaux: [[0, 1], [.52, 1], [.68, .12], [.84, .5], [1, .25]],
};

/** Fenetre de chaque temps, en progression. */
const TEMPS = [[0, .2], [.2, .44], [.44, .74], [.74, 1]];

function lire(piste: Piste, p: number): number {
  const premier = piste[0];
  const dernier = piste[piste.length - 1];
  if (p <= premier[0]) return premier[1];
  if (p >= dernier[0]) return dernier[1];
  for (let i = 1; i < piste.length; i++) {
    if (p <= piste[i][0]) {
      const [p0, v0] = piste[i - 1];
      const [p1, v1] = piste[i];
      const t = (p - p0) / (p1 - p0);
      const e = t < .5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2; // easeInOutQuad
      return v0 + (v1 - v0) * e;
    }
  }
  return dernier[1];
}

/**
 * Opacite d'un temps. Le premier n'a pas de fondu d'entree (il est deja la a
 * l'arrivee, son animation d'entree est celle de binacore.css) et le dernier
 * pas de fondu de sortie (il passe la main a la page, il ne disparait pas).
 */
function opaciteTemps(i: number, p: number): number {
  const [a, b] = TEMPS[i];
  const duree = b - a;
  const entree = i === 0 ? 0 : duree * .34;
  const sortie = i === TEMPS.length - 1 ? 0 : duree * .3;
  if (entree > 0) {
    if (p <= a - entree) return 0;
    if (p < a) return (p - (a - entree)) / entree;
  } else if (p < a) return 0;
  if (sortie === 0 || p <= b - sortie) return 1;
  if (p < b) return 1 - (p - (b - sortie)) / sortie;
  return 0;
}

export default function NoyauStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const objRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const loinRef = useRef<SVGSVGElement>(null);
  const presRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const obj = objRef.current;
    const tilt = tiltRef.current;
    const loin = loinRef.current;
    const pres = presRef.current;
    const piste = document.getElementById("noyau-track");
    const racine = document.documentElement;

    // Pas de piste : nous ne sommes pas sur l'accueil. Le stage ne coute rien.
    if (!stage || !obj || !tilt || !loin || !pres || !piste) return;

    const sobre = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointeurFin = window.matchMedia("(pointer: fine)").matches;

    /* ---------- sobriete imposee : on fige, on ne degrade pas ---------- */
    if (sobre) {
      racine.classList.add("noyau-sobre");
      stage.style.opacity = "1";
      return () => {
        racine.classList.remove("noyau-sobre");
      };
    }

    /* ---------- lecture du defilement ----------
       Interactions amortit le scroll et ecrit translate3d(0,-cur,0) en style
       INLINE sur #smooth. On relit cette valeur plutot que window.scrollY : cale
       sur le scroll brut, le noyau devancerait le texte de plusieurs frames et
       l'ensemble se dissocierait. Lire .style (et non getComputedStyle) evite
       de forcer un recalcul de style a chaque image.
       Interactions n'est pas modifie : le fichier est un portage verbatim. */
    const smooth = document.getElementById("smooth");
    const rxY = /translate3d\([^,]+,\s*(-?[\d.]+)px/;
    function defilement(): number {
      if (smooth && racine.classList.contains("smooth")) {
        const m = rxY.exec(smooth.style.transform);
        if (m) return -parseFloat(m[1]);
      }
      return window.scrollY;
    }

    /* ---------- geometrie de la piste ----------
       offsetTop et non getBoundingClientRect : le rect d'un element sous #smooth
       inclut le translate du scroll inertiel, donc bougerait a chaque image.
       offsetTop est une position de mise en page, insensible aux transforms. */
    function hautDocument(el: HTMLElement): number {
      let y = 0;
      let n: HTMLElement | null = el;
      while (n) {
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return y;
    }

    let haut = 0;
    let longueur = 1;
    function mesurer() {
      haut = hautDocument(piste as HTMLElement);
      longueur = Math.max(1, piste!.offsetHeight - window.innerHeight);
    }
    mesurer();

    window.addEventListener("resize", mesurer);
    const ro = "ResizeObserver" in window ? new ResizeObserver(mesurer) : null;
    ro?.observe(piste);

    /* ---------- parallaxe souris ---------- */
    let viseX = 0, viseY = 0, inclX = 0, inclY = 0;
    function surSouris(e: PointerEvent) {
      viseX = (e.clientX / window.innerWidth - .5) * 2;
      viseY = (e.clientY / window.innerHeight - .5) * 2;
    }
    if (pointeurFin) document.addEventListener("pointermove", surSouris, { passive: true });

    /* ---------- boucle ---------- */
    const temps = Array.from(document.querySelectorAll<HTMLElement>("[data-temps]"));
    let vivant = true;
    let sombreActif = false;
    let horsActif = false;

    function image(ms: number) {
      if (!vivant) return;
      const p = Math.min(1, Math.max(0, (defilement() - haut) / longueur));
      const t = ms / 1000;

      // Vie propre, independante du scroll : c'est elle qui empeche l'objet de
      // ressembler a une image posee la quand la page est a l'arret.
      const flottement = Math.sin(t * .7) * 10;
      const respiration = 1 + Math.sin(t * .45) * .012;

      const s = lire(PISTES.echelle, p) * respiration;
      const x = lire(PISTES.x, p) * window.innerWidth;
      const y = lire(PISTES.y, p) * window.innerHeight + flottement;
      const r = lire(PISTES.rot, p);
      const flou = lire(PISTES.flou, p);

      obj!.style.transform =
        `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${s.toFixed(4)}) rotate(${r.toFixed(2)}deg)`;
      obj!.style.filter = flou > .02 ? `blur(${flou.toFixed(2)}px)` : "";

      inclX += (viseX - inclX) * .06;
      inclY += (viseY - inclY) * .06;
      tilt!.style.transform =
        `rotateY(${(inclX * 5).toFixed(3)}deg) rotateX(${(-inclY * 4).toFixed(3)}deg)`;

      const ecart = lire(PISTES.ecart, p);
      const opAnneaux = lire(PISTES.anneaux, p);
      const tAnneaux = `scale(${ecart.toFixed(4)})`;
      loin!.style.transform = tAnneaux;
      pres!.style.transform = tAnneaux;
      loin!.style.opacity = String(opAnneaux);
      pres!.style.opacity = String(opAnneaux * .62);

      stage!.style.opacity = lire(PISTES.opacite, p).toFixed(3);

      for (let i = 0; i < temps.length; i++) {
        const el = temps[i];
        const o = opaciteTemps(i, p);
        el.style.opacity = o.toFixed(3);
        el.style.transform = o < .999 ? `translateY(${((1 - o) * 26).toFixed(1)}px)` : "";
      }

      // La nav doit suivre : sur la chambre chaude elle se rechauffe, et pendant
      // la plongee elle s'inverse — sinon le wordmark sombre disparait sur le
      // noyau qui remplit alors tout l'ecran.
      const hors = p < .999;
      if (hors !== horsActif) {
        horsActif = hors;
        racine.classList.toggle("noyau-on", hors);
      }
      const sombre = p > .5 && p < .76;
      if (sombre !== sombreActif) {
        sombreActif = sombre;
        racine.classList.toggle("noyau-dark", sombre);
      }

      raf = requestAnimationFrame(image);
    }
    let raf = requestAnimationFrame(image);

    return () => {
      vivant = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", mesurer);
      document.removeEventListener("pointermove", surSouris);
      ro?.disconnect();
      racine.classList.remove("noyau-on", "noyau-dark");
    };
  }, []);

  return (
    <div className="noyau-stage" ref={stageRef} aria-hidden="true">
      <div className="noyau-persp">
        <div className="noyau-tilt" ref={tiltRef}>
          <div className="noyau-obj" ref={objRef}>
            <div className="noyau-enter">
              {/* Anneaux DERRIERE l'objet. */}
              <svg className="noyau-rings far" ref={loinRef} viewBox="0 0 100 100" fill="none">
                <g style={{ ["--dur" as string]: "120s" }}>
                  <g transform="rotate(-14 50 48)">
                    <path id="orbA" className="noyau-ring" d="M9,48 a41,41 0 1,0 82,0 a41,41 0 1,0 -82,0" />
                    <circle className="noyau-dot" r="1.35">
                      <animateMotion dur="120s" repeatCount="indefinite"><mpath href="#orbA" /></animateMotion>
                    </circle>
                  </g>
                </g>
                <g data-rev="" style={{ ["--dur" as string]: "74s" }}>
                  <g transform="rotate(16 50 48)">
                    <path id="orbB" className="noyau-ring" d="M4,48 a46,14 0 1,0 92,0 a46,14 0 1,0 -92,0" />
                    <circle className="noyau-dot-d" r="1.6">
                      <animateMotion dur="74s" repeatCount="indefinite"><mpath href="#orbB" /></animateMotion>
                    </circle>
                  </g>
                </g>
              </svg>

              <img
                className="noyau-img"
                src="/brand/noyau.webp"
                alt=""
                width={1448}
                height={1086}
                decoding="async"
                fetchPriority="high"
              />

              {/* Anneaux DEVANT l'objet : c'est ce croisement qui fait la
                  profondeur qu'une image fixe agrandie ne peut pas donner. */}
              <svg className="noyau-rings near" ref={presRef} viewBox="0 0 100 100" fill="none">
                <g style={{ ["--dur" as string]: "58s" }}>
                  <g transform="rotate(-11 50 48)">
                    <path id="orbC" className="noyau-ring-l" d="M2,48 a48,10 0 1,0 96,0 a48,10 0 1,0 -96,0" />
                    <circle className="noyau-dot" r="1.15">
                      <animateMotion dur="58s" repeatCount="indefinite"><mpath href="#orbC" /></animateMotion>
                    </circle>
                  </g>
                </g>
                <g data-rev="" style={{ ["--dur" as string]: "96s" }}>
                  <g transform="rotate(7 50 48)">
                    <path id="orbD" className="noyau-ring-l" d="M17,48 a33,33 0 1,0 66,0 a33,33 0 1,0 -66,0" />
                    <circle className="noyau-dot" r="1">
                      <animateMotion dur="96s" repeatCount="indefinite"><mpath href="#orbD" /></animateMotion>
                    </circle>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="noyau-vignette" />
    </div>
  );
}
