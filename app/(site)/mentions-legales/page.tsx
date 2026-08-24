import type { Metadata } from "next";

/**
 * Mentions legales.
 *
 * Statique : aucune lecture de la base, donc pas de force-dynamic.
 *
 * Zero CSS et zero classe nouvelle — la page reutilise le design system tel
 * quel : `section` pour le rythme vertical, .wrap, .sec-head, .meta, h2.t,
 * .studio-txt (dont `p{color:var(--muted);max-width:56ch}` est la prose sobre
 * du site) et .lnk.
 *
 * Deux garde-fous :
 *  - AUCUN [data-reveal] ecrit a la main. Interactions.tsx en pose un sur
 *    `h2.t` (ligne 99) avant d installer l observateur (ligne 116) : le titre
 *    se revele. Le reste ne depend jamais de JS — si le script echoue, la page
 *    reste lisible au lieu de rester a opacity:0.
 *  - AUCUN <h3> nu : sans regle CSS propre il prendrait le defaut navigateur
 *    en dev (ou Tailwind n emet rien) et `font-size:inherit` du preflight en
 *    prod. Les intitules utilisent .meta, identique dans les deux modes.
 *
 * Les [PLACEHOLDERS] sont volontairement visibles : ils marquent ce qui reste
 * a confirmer et ne doivent jamais etre remplis par invention.
 */
export const metadata: Metadata = {
  title: "Mentions légales — Binacore",
};

export default function MentionsLegales() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta">Binacore</span>
        </div>
        <h2 className="t">Mentions légales</h2>
        <div className="studio-txt" style={{ marginTop: 40 }}>
          <p className="meta">Éditeur</p>
          <p>Binacore, studio digital, Genève, Suisse, exploité par [PRÉNOM NOM — À COMPLÉTER]. Contact : hello@binacore.ch [à confirmer].</p>
          <p className="meta">Hébergement</p>
          <p>[Infomaniak, Suisse — à confirmer en B12]</p>
          <p className="meta">Propriété intellectuelle</p>
          <p>Contenus et design © Binacore. Reproduction interdite sans accord.</p>
          <p style={{ marginTop: 40 }}><a className="lnk" href="/">← Retour au site</a></p>
        </div>
      </div>
    </section>
  );
}
