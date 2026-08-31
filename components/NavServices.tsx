"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { EntreeNav } from "@/lib/catalogue-familles";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";

/**
 * « SERVICES » DANS LA BARRE DE NAV — la page generale, puis une famille par
 * ligne.
 *
 * POURQUOI UN DEROULANT. La nav portait « Travaux · Services · Offres ·
 * Prestations · Parlons-en ». Trois de ces entrees disaient la meme chose :
 * « Services » ouvrait une ancre de l accueil, « Offres » une autre ancre du
 * meme accueil, « Prestations » une page. Le visiteur devait deviner laquelle
 * contenait quoi. Il ne reste qu une entree, et elle montre ce qu elle
 * contient au lieu de le faire deviner.
 *
 * POURQUOI C EST LE SEUL COMPOSANT CLIENT DE LA NAV. Un deroulant a un etat, et
 * cet etat doit repondre au clavier autant qu a la souris. Un `<details>` aurait
 * evite le JS mais ne donne ni `aria-expanded`, ni fermeture par Echap, ni
 * ouverture au survol. Nav.tsx reste donc un composant serveur et ne delegue ici
 * que la seule chose qui bouge.
 *
 * PAS DE next/link, comme partout sur le site public : les revelations au
 * scroll de components/Interactions.tsx ne s initialisent qu une fois, et une
 * navigation client-side les laisserait a opacity:0 sur la page d arrivee.
 *
 * LE PANNEAU EST TOUJOURS DANS LE DOM, ferme par `visibility:hidden` et non par
 * un rendu conditionnel. Deux raisons, et les deux sont des bugs evites :
 *  1. Interactions.tsx attache ses ecouteurs de curseur a `a, button` UNE fois
 *     au montage. Des liens rendus plus tard n en recevraient jamais.
 *  2. `visibility:hidden` sort les liens de l ordre de tabulation ET de l arbre
 *     d accessibilite, ce que `opacity:0` seul ne fait pas — un menu ferme mais
 *     tabulable est un piege au clavier. C est aussi pourquoi le panneau ne
 *     porte pas `aria-hidden` : masquer un conteneur focalisable par ARIA est
 *     une faute, la CSS fait le travail correctement.
 *
 * LE SURVOL EST CONDITIONNE A UN VRAI POINTEUR. `(hover: hover)` evite qu un
 * ecran tactile large — la nav disparait sous 860px, mais une tablette la voit
 * — ouvre le menu au `mouseenter` synthetique puis le referme aussitot par le
 * clic qui suit.
 */
export default function NavServices({
  general,
  familles,
  locale = "fr",
}: {
  /** La page generale, en tete de liste. */
  general: EntreeNav;
  /** Les cinq familles, dans l ordre du catalogue. */
  familles: readonly EntreeNav[];
  /**
   * La langue de la page. « fr » par defaut pour que tout appelant qui ne la
   * connait pas encore rende exactement ce qu il rendait avant le chantier
   * anglais — c est la condition d une bascule sans regression.
   */
  locale?: Locale;
}) {
  const t = dictionnaire(locale);
  const [ouvert, setOuvert] = useState(false);
  const enveloppe = useRef<HTMLDivElement>(null);
  const bouton = useRef<HTMLButtonElement>(null);
  const panneauId = useId();

  /**
   * Un clic AILLEURS ferme. `pointerdown` et non `click` : le menu doit avoir
   * disparu avant que le clic n atteigne sa cible, sinon le panneau reste
   * ouvert par-dessus la page qu on vient d ouvrir.
   * L ecouteur n existe que pendant l ouverture — rien ne tourne au repos.
   */
  useEffect(() => {
    if (!ouvert) return;
    function ailleurs(e: PointerEvent) {
      if (!enveloppe.current?.contains(e.target as Node)) setOuvert(false);
    }
    document.addEventListener("pointerdown", ailleurs);
    return () => document.removeEventListener("pointerdown", ailleurs);
  }, [ouvert]);

  const survolPossible = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <div
      className={`nav-drop${ouvert ? " open" : ""}`}
      ref={enveloppe}
      onMouseEnter={() => {
        if (survolPossible()) setOuvert(true);
      }}
      onMouseLeave={() => {
        if (survolPossible()) setOuvert(false);
      }}
      /* Echap ferme et REND LE FOCUS au bouton : le laisser sur un lien qui
         vient de disparaitre le renverrait au debut du document. */
      onKeyDown={(e) => {
        if (e.key === "Escape" && ouvert) {
          e.stopPropagation();
          setOuvert(false);
          bouton.current?.focus();
          return;
        }
        // Flèche bas depuis le bouton : on ouvre et on entre dans la liste.
        if (e.key === "ArrowDown" && e.target === bouton.current) {
          e.preventDefault();
          setOuvert(true);
          enveloppe.current?.querySelector<HTMLAnchorElement>(".nav-drop-p a")
            ?.focus();
        }
      }}
      /* Le focus quitte l ensemble — par Tab, ou par un clic ailleurs : on
         ferme. `relatedTarget` vaut null quand le focus part de la fenetre
         entiere ; on ne ferme pas dans ce cas, l onglet reprendra ou il en
         etait. */
      onBlur={(e) => {
        const vers = e.relatedTarget as Node | null;
        if (vers && !enveloppe.current?.contains(vers)) setOuvert(false);
      }}
    >
      <button
        type="button"
        className="lnk nav-drop-t"
        ref={bouton}
        aria-expanded={ouvert}
        aria-controls={panneauId}
        onClick={() => setOuvert((o) => !o)}
      >
        {t.nav.services}
        <svg
          className="nav-drop-c"
          viewBox="0 0 10 6"
          width="10"
          height="6"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M1 1l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="nav-drop-p" id={panneauId}>
        {/* La page generale d abord : c est elle qui tient la promesse
            « on y voit tout ce qui est vendu ». Les familles sont des
            raccourcis vers un morceau de cette page-la, pas des concurrentes.

            LES CHEMINS PASSENT PAR `lien` ICI, la ou le `<a>` s ecrit, et non
            chez l appelant : c est la regle du chantier i18n — un href se
            prefixe a l endroit ou il devient un lien. `lien` est idempotente,
            un chemin deja prefixe la traverse sans changer, si bien qu un
            appelant qui prefixerait aussi de son cote ne casserait rien.

            LES LIBELLES DES FAMILLES, EUX, RESTENT EN FRANCAIS meme sur la
            page anglaise : ils viennent de `lib/familles.ts` via
            `lib/catalogue-familles.ts`, qui porte la matiere editoriale des
            cinq pages de famille et n est pas encore traduite. Ce n est pas un
            oubli de ce composant — le jour ou ces pages passent a l anglais,
            c est la source qui rendra les deux langues, et cette boucle-ci
            n aura pas a bouger. */}
        <a className="nav-drop-g" href={lien(locale, general.href)}>
          {general.libelle}
        </a>
        {familles.map((f) => (
          <a key={f.href} href={lien(locale, f.href)}>
            {/* libelleEn est derive de FAMILLES[slug] dans lib/catalogue-familles.ts :
                la nav ne peut donc pas rebaptiser une page autrement que la page
                elle-meme. Repli sur le francais, jamais un trou. */}
            {(locale === "en" && f.libelleEn) || f.libelle}
          </a>
        ))}
      </div>
    </div>
  );
}
