"use client";
/**
 * BINACORE — Carrousel Travaux (React, zéro dépendance)
 * ------------------------------------------------------
 * Équivalent React exact du carrousel v6 de reference/binacore.html :
 *  - panneau gauche rétractable avec chips rotatives (effet ressort en CSS)
 *  - pile de cartes (active / prev / next / hidden) avec transitions à ressort
 *  - un comparateur avant/après GLISSABLE dans chaque carte
 *  - autoplay avec pauses intelligentes (survol, interaction, hors écran,
 *    onglet caché, prefers-reduced-motion)
 *
 * Prérequis : app/binacore.css importé globalement, pour .car2, .chip,
 * .pcard, .ba et .ba-photo. Aucune lib externe : ni motion, ni hugeicons.
 *
 * PLUS AUCUNE SCÈNE DESSINÉE ICI depuis le 2 septembre 2026 : les cinq pièces
 * sont des photographies. Les règles qui habillaient les maquettes CSS —
 * .m-old, .m-new, .osite, .obc, .oflyer, .ofid, .bc, .poster, .fid et leurs
 * enfants — dorment encore dans binacore.css. Elles n'ont pas été retirées
 * dans le même geste : plusieurs sont groupées entre elles, et une coupe à
 * l'aveugle en pleine intégration aurait cassé ce qu'on venait de poser.
 *
 * Usage : import FeatureCarousel from "@/components/ui/feature-carousel";
 *         <FeatureCarousel />
 */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const ITEM_HEIGHT = 62;
const AUTO_PLAY_INTERVAL = 4200;

/* ------------------------------------------------------------------ */
/*  Utilitaires                                                        */
/* ------------------------------------------------------------------ */

function normDist(i: number, idx: number, len: number): number {
  let w = (((i - idx) % len) + len) % len;
  if (w > len / 2) w -= len;
  return w;
}

function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* Curseur custom global (optionnel — présent si <Interactions/> est monté) */
function globalCursor(): HTMLElement | null {
  return typeof document !== "undefined"
    ? document.getElementById("cursor")
    : null;
}

/* ------------------------------------------------------------------ */
/*  Comparateur avant / après                                          */
/* ------------------------------------------------------------------ */

function BeforeAfter({
  before,
  after,
  teaser = false,
  active = false,
}: {
  before: ReactNode;
  after: ReactNode;
  teaser?: boolean;
  active?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef(50);
  const dragging = useRef(false);

  const setPos = useCallback((p: number) => {
    pos.current = Math.max(2, Math.min(98, p));
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--x", pos.current + "%");
    // La racine doit connaitre la position du curseur pour que le fond vert de
    // la scene rejoigne le panneau de gauche. SEULE la carte active a le droit
    // d'ecrire cette variable : les cartes prev/next existent toujours dans le
    // DOM, et l'animation d'amorce de la premiere (teaser) se battrait avec
    // l'active pour la meme variable.
    const carte = el.closest<HTMLElement>(".pcard");
    if (carte?.dataset.status === "active") {
      el.closest<HTMLElement>(".car2")?.style.setProperty(
        "--ba-x",
        pos.current + "%",
      );
    }
    el.querySelector(".ba-handle")?.setAttribute(
      "aria-valuenow",
      String(Math.round(pos.current))
    );
  }, []);

  const fromX = useCallback(
    (x: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos(((x - r.left) / r.width) * 100);
    },
    [setPos]
  );

  useEffect(() => {
    setPos(50);
  }, [setPos]);

  // Une carte qui DEVIENT active doit reprendre la main sur --ba-x : les cinq
  // cartes sont montees une fois pour toutes et ne se remontent jamais, donc
  // sans cet effet la variable resterait figee sur la valeur laissee par la
  // carte precedente — le voile vert et la carte affichee se contrediraient.
  useEffect(() => {
    if (active) setPos(pos.current);
  }, [active, setPos]);

  /* Petit teaser d'invitation au drag (première carte uniquement) */
  useEffect(() => {
    if (!teaser || reducedMotion()) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || done) return;
          done = true;
          io.unobserve(el);
          let t0: number | null = null;
          const anim = (ts: number) => {
            if (t0 === null) t0 = ts;
            const k = (ts - t0) / 1400;
            if (k >= 1 || dragging.current) {
              setPos(50);
              return;
            }
            const ease = 0.5 - 0.5 * Math.cos(k * Math.PI * 2);
            setPos(50 + Math.sin(k * Math.PI * 2) * 12 * (1 - k * 0.4) * ease * 2);
            requestAnimationFrame(anim);
          };
          requestAnimationFrame(anim);
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [teaser, setPos]);

  return (
    <div
      ref={ref}
      className="ba fill"
      onPointerDown={(e) => {
        e.stopPropagation();
        dragging.current = true;
        ref.current?.setPointerCapture(e.pointerId);
        fromX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) fromX(e.clientX);
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      onPointerEnter={() => {
        const c = globalCursor();
        c?.classList.add("drag");
        c?.classList.remove("grow");
      }}
      onPointerLeave={() => globalCursor()?.classList.remove("drag")}
    >
      <span className="ba-tag tag-a">Avant</span>
      <span className="ba-tag tag-b">Après</span>
      <div className="ba-layer ba-after">{after}</div>
      <div className="ba-layer ba-before">{before}</div>
      <div
        className="ba-handle"
        role="slider"
        tabIndex={0}
        aria-label="Comparateur avant après"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            setPos(pos.current - 4);
            e.preventDefault();
          }
          if (e.key === "ArrowRight") {
            setPos(pos.current + 4);
            e.preventDefault();
          }
        }}
      >
        <div className="ba-knob">‹&nbsp;›</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pieces PHOTOGRAPHIEES.

    Les CINQ pieces sont rendues par une image. « Le site » et « La carte »
    depuis le 1er septembre 2026, les trois autres depuis le 2. Il n'y a donc
    plus de melange dessine/photographie a assumer : ce composant est le seul
    rendu de piece du fichier.

    UN <img> NU, PAS next/image, ET POUR LA MEME RAISON QUE NoyauStage :
    l'image est peinte dans une couche `.ba-layer` en position absolue que le
    comparateur decoupe au pixel ; le wrapper que next/image insere casserait
    ce calage. Le srcSet fait le travail que next/image aurait fait — deux
    tailles reelles en WebP, 480 px pour le telephone.

    LES FICHIERS SONT EN 720x900, C'EST-A-DIRE EXACTEMENT LE 4:5 DE `.stack`
    (2 septembre 2026), et ils y arrivent par deux chemins differents.

    LES SIX PIECES DU 2 SEPTEMBRE — l'affiche, la fidelite, la carte de visite —
    ont ete DEMANDEES en 4:5 a la generation. Elles n'ont subi aucun recadrage
    de cadrage, seulement une reduction. C'est la bonne facon de s'y prendre :
    demander le format de destination plutot que le rattraper apres coup.

    LES QUATRE PIECES DU 1er SEPTEMBRE, elles, ont du etre recoupees a la main.
    Les originaux etaient en 1600x900, un 16:9 pose dans un cadre portrait : `object-fit:cover` jetait 55% de la largeur, et le portable
    des deux pieces « Le site » se retrouvait coupe au hasard du centre
    geometrique. Le recadrage a donc ete fait A LA MAIN, en amont, sur le sujet
    et non sur le milieu de l'image — decalages retenus, en pixels depuis le
    bord gauche de l'original : carte-avant 476, carte-apres 335, site-avant
    300, site-apres 300. Ils ne sont pas centres, et c'est voulu : cale au
    milieu, le crop coupait « CHANTIER SUISSE » en plein mot sur les deux
    pieces « Le site », et le mot « Cocktail » sur « La carte » apres.
    Le sujet etant plus large que 720 px sur trois photos sur quatre, un bord
    est perdu de toute facon ; le choix est de perdre le bord DROIT, jamais le
    logo ni le titre.

    720 px DE LARGE POUR UNE CARTE QUI MONTE A 440 px CSS : a DPR 2 il en
    faudrait 880. C'est la limite des originaux fournis, pas un reglage — si
    des fichiers plus larges arrivent un jour, les recouper aux memes
    decalages (proportionnellement) et regenerer les deux tailles.

    UN SEUL <img> DANS LE FICHIER, d'ou ce composant partage plutot que quatre
    balises recopiees : `@next/next/no-img-element` est un warning par image
    ecrite, et le depot en tolere UN, celui de NoyauStage.

    `alt` VIDE ET aria-hidden, comme les scenes dessinees qu'elles remplacent :
    ce que la piece montre est deja dit par le `desc` de l'item, juste a cote,
    et un comparateur avant/apres ne se lit pas au lecteur d'ecran.          */
/* ------------------------------------------------------------------ */

const PhotoDemo = ({ nom }: { nom: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className="ba-photo"
    src={`/demos/${nom}.webp`}
    srcSet={`/demos/${nom}-480.webp 480w, /demos/${nom}.webp 720w`}
    /* La carte ne depasse jamais `min(440px, 66%)` — voir .stack dans
       binacore.css. 440px est donc la borne haute reelle, pas une estimation. */
    sizes="440px"
    alt=""
    aria-hidden="true"
    width={720}
    height={900}
    decoding="async"
    loading="lazy"
  />
);

/* ------------------------------------------------------------------ */
/*  Les cinq pieces sont PHOTOGRAPHIEES depuis le 2 septembre 2026.

    Il n'y a plus une seule scene dessinee en CSS dans ce fichier. Les six
    composants qui vivaient ici — CardOld/CardNew, PosterOld/PosterNew,
    FidOld/FidNew — sont partis avec elles, et l'import de CONTACT avec eux :
    il ne servait qu'a la carte de visite du studio.

    CE QUE LA CARTE DE VISITE A PERDU, et il faut le savoir avant de la
    regretter : son « apres » etait la carte de Nawa Corps, avec le vrai
    telephone et le vrai e-mail lus dans lib/site.ts. Une photo les aurait
    graves dans un fichier binaire, ou plus aucune correction de coordonnees
    ne serait allee les chercher. La piece montre donc desormais la meme
    enseigne fictive que « Le site » — Chantier Suisse.

    LES ENSEIGNES SONT FICTIVES, ET LEURS NOMS SONT FLOUTES DANS LES IMAGES
    depuis le 2 septembre 2026 (demande d'Ayoub). Deux etablissements pour
    cinq pieces — un bar et une entreprise de marquage routier — parce que
    chaque nom invente est un nom qui peut heurter une vraie enseigne.
    LE FLOU EST FAIT EN AMONT, DANS LES FICHIERS, jamais en CSS : un filtre
    `blur` sur une zone se contourne en lisant l'image d'origine, et l'image
    d'origine est justement ce que le serveur envoie. Les fichiers servis ne
    contiennent plus les noms.
    LE PIED DE PAGE DE « site-avant » EST FLOUTE AUSSI, et il comptait plus que
    les enseignes : il portait une rue, un code postal, un telephone et un
    e-mail. C'est exactement le detail localisable que le bloc ci-dessus
    interdit, et il avait echappe a la premiere lecture parce qu'il se lit a
    peine a la taille d'affichage.
    LE `desc` DE CHAQUE PIECE DIT TOUJOURS « Enseigne fictive » : le flou dit
    qu'on cache un nom, il ne dit pas qu'il n'y a personne derriere. Les deux
    phrases font un travail different et aucune ne remplace l'autre.

    LA REGLE DES DETAILS TIENT, dans les images comme elle tenait dans le JSX :
    aucune rue, aucun domaine en .ch, aucune annee de fondation. Les deux
    cartes de visite portent « 022 000 00 00 », le numero manifestement
    inutilisable qu'employait deja CardOld. Un detail localisable ferait
    prendre une demonstration pour une realisation — LCD art. 3.

    L'« AVANT » RESTE DATE, JAMAIS RIDICULE (guide de voix §4). Les trois
    pieces « avant » ajoutees ici s'en tiennent a ce que faisaient les scenes
    dessinees qu'elles remplacent, jusqu'au texte : « CARTE DE FIDELITE » sans
    accents, « jeudi 12 decembre des 19H00 », « 10 cafes achetes, le 11e
    offert ». Ce sont les memes mots, photographies.                       */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Données                                                            */
/* ------------------------------------------------------------------ */

export type CarouselItem = {
  id: string;
  label: string;
  desc: string;
  before: ReactNode;
  after: ReactNode;
};

const ITEMS: CarouselItem[] = [
  {
    /* Le QR code a quitte cette description avec la scene dessinee qui le
       montrait : la piece photographiee n'en porte pas, et decrire ce qui
       n'est pas a l'image est un commentaire faux, donc un bug. */
    id: "carte",
    label: "La carte",
    desc: "Une carte qui a bien servi, reprise en entier : les familles séparées, les prix alignés, chaque cocktail montré. Enseigne fictive.",
    before: <PhotoDemo nom="carte-avant" />,
    after: <PhotoDemo nom="carte-apres" />,
  },
  {
    /* « Lisible sur téléphone » est parti pour la meme raison : les deux
       images montrent un ordinateur portable, et la promesse ne se verifie
       nulle part a l'ecran. Ce que la piece montre, elle, c'est le devis
       atteignable des le premier ecran. */
    id: "site",
    label: "Le site",
    desc: "Un site resté à son année de mise en ligne, refait en une semaine : le devis se demande dès le premier écran. Enseigne fictive.",
    before: <PhotoDemo nom="site-avant" />,
    after: <PhotoDemo nom="site-apres" />,
  },
  {
    id: "carte-visite",
    label: "La carte de visite",
    desc: "85 × 55 sur un papier qu'on garde en main : un logo net, une seule hiérarchie, rien à déchiffrer. Enseigne fictive.",
    before: <PhotoDemo nom="visite-avant" />,
    after: <PhotoDemo nom="visite-apres" />,
  },
  {
    id: "affiche",
    label: "L'affiche",
    desc: "La même annonce, redessinée : une hiérarchie, une image, de la place autour. Enseigne fictive.",
    before: <PhotoDemo nom="affiche-avant" />,
    after: <PhotoDemo nom="affiche-apres" />,
  },
  {
    id: "fidelite",
    label: "La fidélité",
    desc: "La carte à tampons remise au propre : dix passages, un papier qui tient dans le portefeuille. Enseigne fictive.",
    before: <PhotoDemo nom="fidelite-avant" />,
    after: <PhotoDemo nom="fidelite-apres" />,
  },
];

/* ------------------------------------------------------------------ */
/*  Carrousel principal                                                */
/* ------------------------------------------------------------------ */

export function FeatureCarousel({ items = ITEMS }: { items?: CarouselItem[] }) {
  const LEN = items.length;
  const [idx, setIdx] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [desc, setDesc] = useState(items[0]?.desc ?? "");
  const [descVisible, setDescVisible] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const heldUntil = useRef(0);
  const inView = useRef(true);
  const prevW = useRef<number[]>(items.map((_, i) => normDist(i, 0, LEN)));

  const goTo = useCallback(
    (i: number) => {
      setIdx(((i % LEN) + LEN) % LEN);
      heldUntil.current = Date.now() + 8000;
    },
    [LEN]
  );

  /* description en fondu à chaque changement */
  useEffect(() => {
    setDescVisible(false);
    const t = setTimeout(() => {
      setDesc(items[idx]?.desc ?? "");
      setDescVisible(true);
    }, 200);
    return () => clearTimeout(t);
  }, [idx, items]);

  /* mémoriser les positions pour gérer le "saut" de wrap sans animation */
  useEffect(() => {
    prevW.current = items.map((_, i) => normDist(i, idx, LEN));
  }, [idx, items, LEN]);

  /* autoplay avec pauses intelligentes */
  useEffect(() => {
    if (reducedMotion()) return;
    const iv = setInterval(() => {
      if (
        hovering.current ||
        document.hidden ||
        !inView.current ||
        Date.now() < heldUntil.current ||
        document.documentElement.classList.contains("menu-open")
      )
        return;
      setIdx((i) => (i + 1) % LEN);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(iv);
  }, [LEN]);

  /* pause quand le carrousel sort de l'écran */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (inView.current = e.isIntersecting)),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={"car2" + (collapsed ? " collapsed" : "")}
      id="car2"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
      onPointerDownCapture={() => (heldUntil.current = Date.now() + 8000)}
    >
      {/* panneau gauche rétractable */}
      <div className="car2-left">
        <div className="car2-list">
          {items.map((item, i) => {
            const w = normDist(i, idx, LEN);
            const jump = Math.abs(w - (prevW.current[i] ?? w)) > LEN / 2;
            return (
              <button
                key={item.id}
                className={"chip" + (w === 0 ? " on" : "")}
                style={{
                  transform: `translateY(${w * ITEM_HEIGHT}px)`,
                  // 0.14 et non 0.22 : a cinq pieces, |w| monte a 2, donc
                  // l'ancien coefficient plafonnait les plus lointaines a 0.56
                  // — illisible sur le pin. A 0.14 le plancher remonte a 0.72,
                  // la hierarchie reste lisible sans que rien ne disparaisse.
                  opacity: 1 - Math.abs(w) * 0.14,
                  transition: jump ? "none" : undefined,
                }}
                onClick={() => goTo(i)}
              >
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="lbl">{item.label}</span>
              </button>
            );
          })}
        </div>
        <button
          className="car2-toggle"
          aria-label={collapsed ? "Déplier le panneau" : "Replier le panneau"}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((c) => !c)}
        >
          ‹
        </button>
      </div>

      {/* pile de cartes */}
      <div className="car2-right">
        {/* .car2-scene enveloppe la pile ET les fleches : c'est ce qui permet
            aux fleches de se centrer sur la CARTE. Posees dans .car2-right,
            elles se seraient centrees sur le panneau entier, .car2-meta
            comprise, donc visiblement trop bas. */}
        <div className="car2-scene">
          <div className="stack">
            {items.map((item, i) => {
              const w = normDist(i, idx, LEN);
              const status =
                w === 0 ? "active" : w === -1 ? "prev" : w === 1 ? "next" : "hidden";
              return (
                <div key={item.id} className="pcard" data-status={status}>
                  <BeforeAfter
                    before={item.before}
                    after={item.after}
                    teaser={i === 0}
                    active={status === "active"}
                  />
                </div>
              );
            })}
          </div>

          <div className="car2-nav">
            <button
              className="car-btn prev"
              aria-label="Projet précédent"
              onClick={() => goTo(idx - 1)}
            >
              ←
            </button>
            <button
              className="car-btn next"
              aria-label="Projet suivant"
              onClick={() => goTo(idx + 1)}
            >
              →
            </button>
          </div>
        </div>

        <div className="car2-meta">
          <span className="idx-chip">
            {pad3(idx + 1)} · {items[idx]?.label}
          </span>
          <p className="car2-desc" style={{ opacity: descVisible ? 1 : 0 }}>
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
