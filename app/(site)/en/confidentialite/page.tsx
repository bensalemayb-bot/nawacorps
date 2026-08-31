import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import { lien, type Locale } from "@/lib/i18n";
import { CONTACT, alternatesPage, openGraphPage } from "@/lib/site";

/**
 * /en/confidentialite — LA JUMELLE ANGLAISE DE LA POLITIQUE DE
 * CONFIDENTIALITE.
 *
 * L'URL GARDE SON SEGMENT FRANCAIS, pour la raison detaillee en tete de
 * app/(site)/en/mentions-legales/page.tsx : `lien()` ne fait que POSER `/en`
 * devant un chemin francais, et traduire le segment demanderait une table de
 * correspondance dans cinq fichiers.
 *
 * >>> LA TRADUCTION EST LITTERALE, ET ELLE DOIT LE RESTER. <<<
 *
 * Les six rubriques francaises sont ici, dans le meme ordre, avec les memes
 * faits — y compris les trois phrases du bloc « hebergement des donnees », qui
 * sont le resultat d'une correction d'exactitude datee et non de la prose :
 * la page a d'abord affirme « hebergés en Suisse », ce qui est devenu faux le
 * 31 aout 2026 quand l'hebergeur a ete tranche. Une page de confidentialite
 * qui se trompe sur le lieu de stockage est le pire endroit ou se tromper, et
 * la LCD art. 3 vise les indications trompeuses — dans les deux langues.
 *
 * `nLPD` DEVIENT `nFADP`, ET C'EST LE SEUL SIGLE TRADUIT. C'est le nom anglais
 * officiel de la loi federale revisee sur la protection des donnees, celui
 * qu'emploie l'administration federale elle-meme. Garder « nLPD » sur une page
 * anglaise obligerait le lecteur a traduire un sigle pour verifier de quelle
 * loi on parle ; c'est exactement ce qu'une page de droits ne doit pas
 * demander.
 *
 * AUCUNE COORDONNEE N'EST ECRITE EN DUR : `CONTACT` (lib/site.ts) est la
 * source unique. L'adresse des droits est `emailGeneral` ici comme en
 * francais — c'est la boite ou la loi demande qu'on puisse ecrire, et elle
 * reste distincte de celle des demandes de projet.
 *
 * MEME OSSATURE QUE LA PAGE FRANCAISE : statique, zero CSS et zero classe
 * nouvelle, aucun [data-reveal] ecrit a la main, aucun <h3> nu.
 *
 * PAS DE next/link : Interactions.tsx ne s'initialise qu'une fois, une
 * navigation client-side laisserait les [data-reveal] de la page d'arrivee a
 * opacity:0 (decision B7).
 */

/** La langue de cette page. Tous ses liens internes passent par `lien`. */
const LOCALE: Locale = "en";

/** Le chemin SANS prefixe : c'est `lien` et `alternatesPage` qui posent `/en`. */
const CHEMIN = "/confidentialite";

const TITRE = "Privacy";
const DESCRIPTION =
  "Nawa Corps privacy policy (nFADP): the data collected, its purpose, how long it is kept, where it is hosted and your rights.";

/**
 * Le suffixe « — Nawa Corps » vient du `template` du layout (site).
 * `alternatesPage(CHEMIN, "en")` rend la canonique `/en/confidentialite` et
 * les `hreflang` ; sans elle, la page heriterait de la canonique « / » du
 * layout et s'auto-desindexerait.
 *
 * LE BLOC `twitter` EST REDECLARE EN ENTIER, ET C'EST OBLIGATOIRE ICI ALORS
 * QUE LA PAGE FRANCAISE S'EN PASSE. La fusion des metadata de Next ne descend
 * pas dans les objets : sans ce bloc, la page HERITE de celui du layout, qui
 * est celui de l'accueil — et une page servie en `lang="en-CH"` annoncait donc
 * « Refonte de site pour PME à Genève — en une semaine » sur sa carte de
 * partage. Releve en HTTP avant correction.
 */
export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
  alternates: alternatesPage(CHEMIN, LOCALE),
  openGraph: openGraphPage(
    { titre: `${TITRE} — Nawa Corps`, description: DESCRIPTION, chemin: CHEMIN },
    LOCALE,
  ),
  twitter: {
    card: "summary_large_image",
    title: `${TITRE} — Nawa Corps`,
    description: DESCRIPTION,
  },
};

export default function Privacy() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      {/* Fil d Ariane : la page est un cul-de-sac de navigation, le moteur a
          besoin qu on lui dise d ou elle depend. */}
      <SchemaPage
        locale={LOCALE}
        fil={[
          { nom: "Home", chemin: lien(LOCALE, "/") },
          { nom: TITRE, chemin: lien(LOCALE, CHEMIN) },
        ]}
      />
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta">Nawa Corps · nFADP</span>
          </div>
          <h1 className="t">Privacy</h1>
          <div className="studio-txt" style={{ marginTop: 40 }}>
            <p className="meta">Data collected</p>
            <p>The contact form (name, phone number, message) and the conversation assistant (the content of the exchanges, first name, number).</p>
            <p className="meta">Purpose</p>
            <p>To answer your enquiry and draw up a quote.</p>
            <p className="meta">How long it is kept</p>
            <p>12 months, then deletion.</p>
            <p className="meta">Where the data is hosted</p>
            {/* Les trois phrases suivantes reportent, sans les reformuler, la
                correction d exactitude du 31 aout 2026 et son fondement :
                l Allemagne figure a l annexe 1 de l OPDo (Etats a protection
                adequate), ce qui rend la communication licite sans garantie
                supplementaire. Si la region Vercel change, ce paragraphe et
                /en/mentions-legales se changent ensemble, avec leurs deux
                jumeaux francais. */}
            <p>The site and its database are hosted by Vercel Inc., a United States company, on servers located in Germany (Frankfurt). Germany is on the list of States whose data protection the Federal Council recognises as adequate.</p>
            <p>Exchanges with the conversation assistant are processed by an artificial intelligence provider located outside Switzerland. Do not give it sensitive information: for that, write to me directly.</p>
            <p>No advertising cookies and no third-party trackers.</p>
            <p className="meta">Your rights</p>
            <p>Access, correction and deletion on simple request to {CONTACT.emailGeneral}.</p>
            <p style={{ marginTop: 40 }}><a className="lnk" href={lien(LOCALE, "/")}>← Back to the site</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
