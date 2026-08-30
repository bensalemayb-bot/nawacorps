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
 * Prérequis : app/binacore.css importé globalement (les blocs <style> de la
 * maquette contiennent tous les styles utilisés ici : .car2, .chip, .pcard,
 * .ba, .m-old, .m-new, .osite, .obc, .oflyer, .ofid, .bc, .poster, .fid…).
 * Aucune lib externe : ni motion, ni hugeicons — tout est CSS + React.
 *
 * Usage : import FeatureCarousel from "@/components/ui/feature-carousel";
 *         <FeatureCarousel />
 */

import { CONTACT } from "@/lib/site";
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
/*  Scènes "après" (identité Binacore)                                 */
/* ------------------------------------------------------------------ */

const MenuNew = () => (
  <div className="m-new" aria-hidden="true">
    <span className="ov">Bar — Genève</span>
    <h3>Le Comptoir</h3>
    <p className="st">Maison fondée en 1987 · Rue des Étuves</p>
    <p className="grp">Pressions</p>
    <div className="it"><span>Blonde locale</span><span className="px">5.50</span></div>
    <div className="it"><span>IPA du moment</span><span className="px">7.00</span></div>
    <p className="grp">Sans alcool</p>
    <div className="it"><span>Citronnade maison</span><span className="px">5.00</span></div>
    <div className="it"><span>Café · thé</span><span className="px">4.00</span></div>
    <div className="qr-row">
      <div className="qr" role="img" aria-label="QR code vers la carte en ligne" />
      <p>Carte complète, horaires, adresse — toujours à jour.</p>
    </div>
  </div>
);

const SiteNew = () => (
  <div className="browser" aria-hidden="true">
    <div className="bar">
      <div className="dots"><i /><i /><i /></div>
      <div className="url">lecomptoir-geneve.ch</div>
    </div>
    <div className="bsite">
      <div className="bhero">
        <span className="ov">Bar — Genève · depuis 1987</span>
        <h4>Un comptoir, des habitués, une vraie carte.</h4>
        <p>Ouvert du mardi au samedi, à deux pas de la place.</p>
        <span className="bb">Voir la carte</span>
      </div>
      <div className="brow">
        <div><b>Horaires</b><span>Ma–Sa · 16h–01h</span></div>
        <div><b>Adresse</b><span>Rue des Étuves 12</span></div>
        <div><b>Contact</b><span>Appel en un tap</span></div>
      </div>
    </div>
  </div>
);

const CardNew = () => (
  <div className="bc-mini">
    <div className="bc bc-recto" aria-hidden="true">
      <span className="wm">Nawa Corps</span>
      <span className="rl" />
      <span className="cp">Studio digital — Genève</span>
    </div>
    <div className="bc bc-verso" aria-hidden="true">
      <div className="top"><span className="nm">Ayoub</span><span className="no">N° 001</span></div>
      <span className="ro">Design &amp; développement</span>
      <div className="hr" />
      <div className="ct">
        <span><b>TÉL.</b> {CONTACT.telephoneAffiche}</span>
        <span><b>MAIL</b> {CONTACT.email}</span>
        <span><b>WEB</b> nawacorps.ch</span>
      </div>
      <span className="ge">Genève, Suisse</span>
    </div>
  </div>
);

const PosterNew = () => (
  <div className="poster" aria-hidden="true">
    <span className="top">Le Comptoir — Genève</span>
    <div className="big"><em>Soirée</em><b>JAZZ</b></div>
    <p className="dt">Jeudi 12 décembre — dès 19 h</p>
    <p className="dd">Entrée libre · concert à 20 h 30</p>
    <div className="bt"><span>Rue des Étuves 12 · 1201</span><i /></div>
  </div>
);

const FidNew = () => (
  <div className="fid" aria-hidden="true">
    <span className="f1">Carte fidélité</span>
    <span className="f2">Le Comptoir</span>
    <div className="dots">
      <span className="on">✶</span><span className="on">✶</span><span className="on">✶</span>
      <span /><span /><span /><span /><span /><span /><span />
    </div>
    <span className="f3">10ᵉ café offert</span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Scènes "avant" (l'ancien monde)                                    */
/* ------------------------------------------------------------------ */

const MenuOld = () => (
  <div className="m-old" aria-hidden="true">
    <h3>Le Comptoir</h3>
    <p className="st">~ bar depuis 1987 ~</p>
    <hr />
    <div className="it"><span>BIERE PRESSION</span><i /><span>5.-</span></div>
    <div className="it"><span>BIERE SPECIALE</span><i /><span>6.50</span></div>
    <div className="it"><span>LIMONADE</span><i /><span>4.50</span></div>
    <div className="it"><span>CAFE / THE</span><i /><span>3.80</span></div>
    <hr />
    <div className="it"><span>ASSIETTE FROMAGE</span><i /><span>14.-</span></div>
    <p className="w">* prix sujets à changement — demander au bar</p>
  </div>
);

const SiteOld = () => (
  <div className="osite" aria-hidden="true">
    <div className="obar">
      <span>Le Comptoir - Microsoft Internet Explorer</span>
      <span>_ □ ✕</span>
    </div>
    <div className="oin">
      <h4>Bienvenue sur le site du Comptoir !!</h4>
      <p className="onav">Accueil | Photos | Livre d&apos;or | Contact</p>
      <div className="oimg">photo_bar_001.jpg</div>
      <p className="onew">NOUVEAU : soirée jazz le jeudi !!!</p>
      <div className="octr">Vous êtes le visiteur n° 000482</div>
      <p className="ofoot">Site optimisé pour Internet Explorer 6 — résolution 800 × 600</p>
    </div>
  </div>
);

const CardOld = () => (
  <div className="obc">
    <span className="t1">LE COMPTOIR</span>
    <span className="t2">Bar - Ambiance - Billard</span>
    <span className="st">★ ─── ★</span>
    <span className="t3">Tél : 022 000 00 00<br />Fax : 022 000 00 01</span>
  </div>
);

const PosterOld = () => (
  <div className="oflyer" aria-hidden="true">
    <span className="f1">★ SOIREE ★</span>
    <span className="f2">JAZZ !!!</span>
    <span className="f3">jeudi 12 decembre des 19H00</span>
    <span className="f4">ENTREE LIBRE</span>
    <span className="f5">venez nombreux !!!</span>
  </div>
);

const FidOld = () => (
  <div className="ofid" aria-hidden="true">
    <span className="t">CARTE DE FIDELITE</span>
    <div className="grid">
      <span>✗</span><span>✗</span><span>✗</span>
      <span /><span /><span /><span /><span /><span /><span />
    </div>
    <span className="b">10 cafés achetés = 1 café offert (tampon obligatoire)</span>
  </div>
);

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
    id: "carte",
    label: "La carte",
    desc: "Une carte qui a bien servi, remise à plat : hiérarchie claire, prix lisibles, et sa version en ligne par QR code.",
    before: <MenuOld />,
    after: <MenuNew />,
  },
  {
    id: "site",
    label: "Le site",
    desc: "Un site de 2009 refait en 72 heures : lisible sur téléphone, avec un formulaire de devis qui fonctionne.",
    before: <SiteOld />,
    after: <SiteNew />,
  },
  {
    id: "carte-visite",
    label: "La carte de visite",
    desc: "85 × 55 recto-verso, sur un papier qu'on garde en main. Le même geste, mieux dit.",
    before: <CardOld />,
    after: <CardNew />,
  },
  {
    id: "affiche",
    label: "L'affiche",
    desc: "La même annonce, redessinée : une affiche qu'on remarque et qu'on garde.",
    before: <PosterOld />,
    after: <PosterNew />,
  },
  {
    id: "fidelite",
    label: "La fidélité",
    desc: "La carte à tampons remise au propre : dix passages, un vrai design.",
    before: <FidOld />,
    after: <FidNew />,
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
