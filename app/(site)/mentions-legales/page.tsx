import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import { CONTACT, alternatesPage, openGraphPage } from "@/lib/site";

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
 *    `h1.t` avant d installer l observateur : le titre se revele. Le reste ne depend jamais de JS — si le script echoue, la page
 *    reste lisible au lieu de rester a opacity:0.
 *  - AUCUN <h3> nu : sans regle CSS propre il prendrait le defaut navigateur
 *    en dev (ou Tailwind n emet rien) et `font-size:inherit` du preflight en
 *    prod. Les intitules utilisent .meta, identique dans les deux modes.
 *
 * Il ne reste plus de [PLACEHOLDER] sur cette page : le dernier, l hebergeur,
 * a ete tranche le 31 aout 2026. La regle tient toujours si un autre apparait
 * — un placeholder se remplit par une decision, jamais par invention.
 */
/**
 * Le suffixe « — Nawa Corps » a disparu du titre : il est desormais ajoute par
 * le `template` du layout (site). L ecrire ici le doublerait.
 *
 * `description` et `canonical` sont propres a la page. Sans elles, la page
 * heritait de celles de l accueil — trois URL pour une seule description, et
 * une canonique pointant vers « / », ce qui revenait a demander aux moteurs
 * d ignorer cette page.
 *
 * `alternates` PASSE PAR `alternatesPage` DEPUIS QUE LA JUMELLE ANGLAISE
 * EXISTE. La canonique ne bouge pas ; la fonction AJOUTE les `hreflang`, et
 * LES DEUX SENS SONT OBLIGATOIRES — une page anglaise qui declare sa jumelle
 * francaise sans que celle-ci lui rende la pareille voit son groupe ignore par
 * Google, et les deux versions se remettent a se concurrencer. `en-CH` n est
 * emis que si ce chemin figure dans `CHEMINS_TRADUITS` (lib/i18n.ts) :
 * annoncer une jumelle qui repond 404 est pire que de ne rien annoncer.
 */
export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales de Nawa Corps, studio de création digitale indépendant à Genève : éditeur, hébergement, propriété intellectuelle et droit applicable.",
  alternates: alternatesPage("/mentions-legales"),
  openGraph: openGraphPage({
    titre: "Mentions légales — Nawa Corps",
    description:
      "Mentions légales de Nawa Corps, studio de création digitale indépendant à Genève : éditeur, hébergement, propriété intellectuelle et droit applicable.",
    chemin: "/mentions-legales",
  }),
};

export default function MentionsLegales() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      {/* Fil d Ariane : la page est un cul-de-sac de navigation, le moteur a
          besoin qu on lui dise d ou elle depend. */}
      <SchemaPage
        fil={[
          { nom: "Accueil", chemin: "/" },
          { nom: "Mentions légales", chemin: "/mentions-legales" },
        ]}
      />
    <section>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta">Nawa Corps</span>
        </div>
        <h1 className="t">Mentions légales</h1>
        <div className="studio-txt" style={{ marginTop: 40 }}>
          <p className="meta">Éditeur</p>
          <p>Nawa Corps, studio de création digitale, Genève, Suisse, exploité par Ayoub Bensalem. Contact : {CONTACT.emailGeneral} — {CONTACT.telephoneAffiche}.</p>
          <p className="meta">Hébergement</p>
          {/* Decision du 31 aout 2026 : Vercel, pas Infomaniak. Vercel n a pas
              de region suisse — la plus proche de Geneve est Francfort (fra1),
              d ou la mention de l Allemagne. Si la region change dans les
              reglages du projet Vercel, cette ligne devient fausse : les deux
              se changent ensemble, avec /confidentialite. */}
          <p>Vercel Inc., société de droit américain, sur des serveurs situés en Allemagne (Francfort).</p>
          <p className="meta">Propriété intellectuelle</p>
          <p>Contenus et design © Nawa Corps. Reproduction interdite sans accord.</p>
          <p style={{ marginTop: 40 }}><a className="lnk" href="/">← Retour au site</a></p>
        </div>
      </div>
    </section>
    </>
  );
}
