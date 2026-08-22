"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __bncInit?: boolean;
  }
}

/**
 * Portage du <script> de reference/binacore.html (lignes 1156-1454).
 * La logique et son ORDRE sont conserves a l'identique : un seul effet, pas de
 * useState, pas de decoupage en hooks.
 *
 * Les comparateurs .ba et le carrousel #car2 ne sont plus geres ici depuis B5 :
 * components/ui/feature-carousel.tsx les porte lui-meme.
 *
 * Zero match encore tolere sur `[data-scale]` : la maquette le posait sur
 * .stack, que le composant du carrousel ne rend pas (ecart signale en B5).
 * `footer.contact h2` a trouve sa cible depuis B7.
 *
 * Adaptations signalees, sans changement de comportement au runtime :
 *  - garde window.__bncInit en tete d'effet (cf. commentaire ci-dessous) ;
 *  - annotations de type (querySelectorAll<HTMLElement>, `as HTMLElement`) ;
 *  - String(...) sur deux affectations que JS coercait implicitement ;
 *  - closeMenu cible `.menu a[href*="#"]` la ou la maquette ecrivait
 *    `[href^="#"]`. Depuis B7 le site a plusieurs pages : les liens du menu
 *    sont `/#ancre`, que `^=` ne matchait plus — le menu ne se serait plus
 *    referme au clic. `*=` matche exactement les memes 5 liens, .m-foot ne
 *    contenant que wa.me et mailto:, sans `#`.
 */
export default function Interactions() {
  useEffect(() => {
    /* ---------- ADAPTATION SIGNALEE : garde d'initialisation unique ----------
       Cet effet n'a volontairement pas de fonction de nettoyage : la contrainte
       « aucune reecriture » impose de porter le script tel quel, et le script de
       la maquette ne nettoie rien non plus.
       Consequence : sans garde, chaque re-execution empilerait une boucle
       requestAnimationFrame, un setInterval d'horloge et un ecouteur scroll de
       plus. En dev, Fast Refresh reexecute le corps de l'effet a chaque edition.
       (React StrictMode n'est PAS actif ici : reactStrictMode vaut null par
       defaut dans Next 16.3.2, et le client rend un Fragment au lieu de
       StrictMode. La garde protege donc de Fast Refresh, pas de StrictMode.) */
    if (window.__bncInit) return;
    window.__bncInit = true;

    var docEl = document.documentElement;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(pointer: fine)").matches;

    /* ---------- preloader ---------- */
    var pctEl = document.getElementById("pct") as HTMLElement;
    var seen = false;
    try { seen = sessionStorage.getItem("bnc-intro") === "1"; } catch (e) {}
    if (reduced || seen) {
      docEl.classList.add("loaded");
    } else {
      docEl.classList.add("has-intro");
      requestAnimationFrame(function () { docEl.classList.add("intro"); });
      var p = 0;
      var iv = setInterval(function () {
        p += Math.max(1, Math.round((100 - p) * 0.12));
        if (p >= 100) { p = 100; clearInterval(iv); }
        pctEl.textContent = String(p);
        if (p === 100) {
          setTimeout(function () {
            docEl.classList.add("loaded");
            try { sessionStorage.setItem("bnc-intro", "1"); } catch (e) {}
          }, 250);
        }
      }, 60);
    }

    /* ---------- horloge ---------- */
    var clock = document.getElementById("clock") as HTMLElement;
    function tick() {
      try {
        var t = new Intl.DateTimeFormat("fr-CH", { timeZone: "Europe/Zurich", hour: "2-digit", minute: "2-digit" }).format(new Date());
        clock.textContent = "Genève — " + t;
      } catch (e) { clock.textContent = "Genève"; }
    }
    tick(); setInterval(tick, 30000);

    /* ---------- titres en lignes ---------- */
    document.querySelectorAll<HTMLElement>("h2.t, footer.contact h2").forEach(function (h) {
      var out: HTMLElement[] = [], line = document.createDocumentFragment();
      function flush() {
        var lm = document.createElement("span"); lm.className = "lm";
        var inner = document.createElement("span"); inner.appendChild(line);
        lm.appendChild(inner); out.push(lm);
        line = document.createDocumentFragment();
      }
      Array.prototype.slice.call(h.childNodes).forEach(function (n: ChildNode) {
        if (n.nodeName === "BR") { flush(); } else { line.appendChild(n); }
      });
      flush();
      h.innerHTML = "";
      out.forEach(function (l, i) {
        l.querySelector<HTMLElement>("span")!.style.transitionDelay = i * 110 + "ms";
        h.appendChild(l);
      });
      if (!h.hasAttribute("data-reveal")) h.setAttribute("data-reveal", "");
    });

    /* ---------- reveals ---------- */
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            var el = e.target as HTMLElement;
            var sibs = el.parentElement ? el.parentElement.querySelectorAll(":scope > [data-reveal]") : [];
            var i = Array.prototype.indexOf.call(sibs, el);
            if (!el.style.transitionDelay) el.style.transitionDelay = (i > 0 ? Math.min(i, 4) * 90 : 0) + "ms";
            el.classList.add("in");
            io.unobserve(el);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });
      var ioS = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in-view"); ioS.unobserve(e.target); }
        });
      }, { threshold: 0.25 });
      document.querySelectorAll("[data-scale]").forEach(function (el) { ioS.observe(el); });
    } else {
      document.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
      document.querySelectorAll("[data-scale]").forEach(function (el) { el.classList.add("in-view"); });
    }

    /* ---------- nav ---------- */
    var nav = document.getElementById("nav") as HTMLElement;
    function navState() {
      if (window.scrollY > 24) nav.classList.add("on"); else nav.classList.remove("on");
    }
    window.addEventListener("scroll", navState, { passive: true }); navState();

    /* ---------- menu plein ecran ---------- */
    var burger = document.getElementById("burger") as HTMLElement;
    function closeMenu() { docEl.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); }
    burger.addEventListener("click", function () {
      var open = docEl.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll('.menu a[href*="#"]').forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

    /* ---------- scroll inertiel + marquee ---------- */
    var smooth = document.getElementById("smooth") as HTMLElement;
    var track = document.querySelector<HTMLElement>(".strip .tk");
    var cur = window.scrollY, target = cur, vel = 0, mq = 0;
    var useSmooth = finePointer && !reduced;
    function setBodyHeight() { document.body.style.height = smooth.scrollHeight + "px"; }
    if (useSmooth) {
      docEl.classList.add("smooth");
      if (track) track.style.animation = "none";
      setBodyHeight();
      window.addEventListener("resize", setBodyHeight);
      if ("ResizeObserver" in window) new ResizeObserver(setBodyHeight).observe(smooth);
      (function raf() {
        target = window.scrollY;
        var d = target - cur;
        cur += d * 0.085;
        if (Math.abs(d) < 0.05) cur = target;
        vel = d;
        smooth.style.transform = "translate3d(0," + -cur + "px,0)";
        if (track) {
          mq -= 0.6 + Math.min(Math.abs(vel) * 0.08, 6);
          var half = track.scrollWidth / 2;
          if (-mq >= half) mq += half;
          track.style.transform = "translate3d(" + mq + "px,0,0)";
        }
        requestAnimationFrame(raf);
      })();
    }

    /* ---------- curseur ---------- */
    var cursor: HTMLElement | null = null;
    if (finePointer && !reduced) {
      docEl.classList.add("cursor-on");
      cursor = document.getElementById("cursor") as HTMLElement;
      var cx = -100, cy = -100, tx = -100, ty = -100;
      document.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; });
      (function craf() {
        cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
        cursor!.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
        requestAnimationFrame(craf);
      })();
      document.querySelectorAll("a, button, .row-h, summary").forEach(function (el) {
        el.addEventListener("pointerenter", function () { cursor!.classList.add("grow"); });
        el.addEventListener("pointerleave", function () { cursor!.classList.remove("grow"); });
      });
    }

    /* ---------- boutons magnetiques ---------- */
    if (finePointer && !reduced) {
      document.querySelectorAll<HTMLElement>(".btn, .pill").forEach(function (b) {
        b.addEventListener("pointermove", function (e) {
          var r = b.getBoundingClientRect();
          b.style.transform = "translate(" + (e.clientX - (r.left + r.width / 2)) * 0.18 + "px," + (e.clientY - (r.top + r.height / 2)) * 0.3 + "px)";
        });
        b.addEventListener("pointerleave", function () { b.style.transform = ""; });
      });
    }

    /* ---------- services depliables ---------- */
    document.querySelectorAll("[data-row]").forEach(function (row) {
      row.querySelector(".row-h")!.addEventListener("click", function () {
        var open = row.classList.contains("open");
        document.querySelectorAll("[data-row].open").forEach(function (r) { r.classList.remove("open"); });
        if (!open) row.classList.add("open");
      });
    });

    /* ---------- comparateurs .ba + carrousel car2 ----------
       Blocs RETIRES au bloc B5 : geres par components/ui/feature-carousel.tsx.
       Le composant React rend id="car2" mais aucun des ids que ce code
       attendait (chipList, stack, carIdx, carDesc, c2Prev, c2Next, car2Toggle).
       Les conserver provoquait une TypeError sur null.addEventListener, en plus
       de handlers concurrents sur les .ba et un autoplay duplique.
       Le composant gere lui-meme la classe drag du curseur, via globalCursor(). */
  }, []);

  return null;
}
