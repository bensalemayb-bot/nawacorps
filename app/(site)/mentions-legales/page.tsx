import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import { estBrouillon, robotsSiBrouillon } from "@/lib/brouillon";
import { CONTACT, EXPLOITANT, alternatesPage, openGraphPage, whatsappHref } from "@/lib/site";

/**
 * Mentions legales.
 *
 * Statique : aucune lecture de la base, donc pas de force-dynamic.
 *
 * Zero CSS et zero classe nouvelle — la page reutilise le design system tel
 * quel : `section` pour le rythme vertical, .wrap, .sec-head, .meta, h1.t,
 * .studio-txt (dont `p{color:var(--muted);max-width:56ch}` est la prose sobre
 * du site) et .lnk.
 *
 * Deux garde-fous :
 *  - AUCUN [data-reveal] ecrit a la main. Interactions.tsx en pose un sur
 *    `h1.t` avant d installer l observateur : le titre se revele. Le reste ne
 *    depend jamais de JS — si le script echoue, la page reste lisible au lieu
 *    de rester a opacity:0.
 *  - AUCUN <h3> nu : sans regle CSS propre il prendrait le defaut navigateur
 *    en dev (ou Tailwind n emet rien) et `font-size:inherit` du preflight en
 *    prod. Les intitules utilisent .meta, identique dans les deux modes.
 *
 * REECRITE LE 25 OCTOBRE 2026, sur le cas valide par l exploitant : raison
 * individuelle a Geneve, non inscrite au registre du commerce, non assujettie
 * a la TVA, vente B2B sur offre ecrite. Le cadre est la LCD, art. 3 al. 1
 * let. s : qui vend par voie electronique indique son identite, son adresse
 * et une adresse de contact directe. D ou l adresse postale, qui vient de
 * lib/site.ts (`EXPLOITANT`). Elle a porte un marqueur visible jusqu a ce que
 * l exploitant la fournisse — un marqueur vaut mieux qu une rue inventee. Le
 * dernier marqueur de la page (region Neon) est parti le 25 octobre 2026 :
 * eu-central-1, Francfort, lu dans la chaine de connexion ; l entite, Neon,
 * LLC (groupe Databricks), est celle de la liste officielle du Data Privacy
 * Framework.
 *
 * LE CONTENU EST EN MIROIR de app/(site)/en/mentions-legales/page.tsx : une
 * rubrique ajoutee ici s ajoute la-bas, dans le meme ordre.
 */
/**
 * Le suffixe « — Nawa Corps » est ajoute par le `template` du layout (site).
 * `alternates` passe par `alternatesPage` : la jumelle anglaise existe
 * (`CHEMINS_TRADUITS`, lib/i18n.ts), et les deux sens du `hreflang` sont
 * obligatoires.
 */
const DESCRIPTION =
  "Mentions légales de Nawa Corps, raison individuelle à Genève : exploitant, adresse, statut, hébergement, propriété intellectuelle et droit applicable.";

/**
 * GARDE-FOU DE BROUILLON (lib/brouillon.ts) : calcule sur le corps meme de la
 * page, adresse de lib/site.ts comprise. Depuis le 25 octobre 2026 la page ne
 * porte plus aucun marqueur : elle est indexee et figure au sitemap. Le calcul
 * reste en place — un marqueur reecrit un jour la remettrait seul en
 * `noindex, follow` et la sortirait de app/sitemap.ts.
 */
export const BROUILLON = estBrouillon(corps());

export const metadata: Metadata = {
  ...robotsSiBrouillon(BROUILLON),
  title: "Mentions légales",
  description: DESCRIPTION,
  alternates: alternatesPage("/mentions-legales"),
  openGraph: openGraphPage({
    titre: "Mentions légales — Nawa Corps",
    description: DESCRIPTION,
    chemin: "/mentions-legales",
  }),
};

function corps() {
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
          <p className="meta">Exploitant</p>
          <p>{EXPLOITANT.nomCommercial} est la raison individuelle de {EXPLOITANT.titulaire}, qui l&apos;exploite seul.</p>
          <p>Adresse postale : {EXPLOITANT.adresse}.</p>
          <p>Contact : <a className="lnk" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> — <a className="lnk" href={`tel:${CONTACT.telephone}`}>{CONTACT.telephoneAffiche}</a>.</p>

          <p className="meta">Statut</p>
          <p>Entreprise individuelle non inscrite au registre du commerce. Non assujettie à la TVA : les prix sont indiqués sans TVA, et aucune TVA n&apos;est facturée.</p>
          <p>Responsable du contenu : {EXPLOITANT.titulaire}.</p>

          <p className="meta">Hébergement</p>
          {/* Vercel n a pas de region suisse : le projet est fixe a Francfort
              (vercel.json, `fra1`). Si la region change, cette ligne,
              /confidentialite et leurs deux jumelles anglaises se changent
              ensemble. L adresse de Vercel est celle de ses conditions
              publiees — a verifier (docs/legal/CONFORMITE-2026-10-25.md). */}
          <p>Site : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis, sur des serveurs situés à Francfort (Allemagne).</p>
          <p>Base de données : Neon, LLC (groupe Databricks), société américaine, sur des serveurs situés à Francfort (Allemagne).</p>

          <p className="meta">Propriété intellectuelle</p>
          <p>Les textes, le design, les logos et le code de ce site appartiennent à {EXPLOITANT.titulaire} ({EXPLOITANT.nomCommercial}). Toute reproduction demande un accord écrit préalable. Les marques citées appartiennent à leurs titulaires.</p>

          <p className="meta">Responsabilité</p>
          <p>Les informations du site sont données de bonne foi, sans garantie d&apos;exhaustivité. Leo, l&apos;assistant de conversation du site, est une démonstration automatisée : ses réponses ne valent ni offre ni engagement. Seule une offre écrite de {EXPLOITANT.nomCommercial} engage, aux conditions générales de vente.</p>
          <p>Les liens vers des services tiers (<a className="lnk" href={whatsappHref("fr")} target="_blank" rel="noopener">WhatsApp</a> notamment) mènent hors du site ; leurs exploitants en répondent.</p>

          <p className="meta">Données personnelles et conditions</p>
          <p>
            Le traitement des données est décrit dans la{" "}
            <a className="lnk" href="/confidentialite">politique de confidentialité</a>. Les prestations sont régies par les{" "}
            <a className="lnk" href="/cgv">conditions générales de vente</a>.
          </p>

          <p className="meta">Droit applicable et for</p>
          <p>Le droit suisse s&apos;applique. Le for est à Genève, sous réserve des fors impératifs prévus par la loi.</p>

          <p style={{ marginTop: 40 }}><a className="lnk" href="/">← Retour au site</a></p>
        </div>
      </div>
    </section>
    </>
  );
}

export default function MentionsLegales() {
  return corps();
}
