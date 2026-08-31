import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import { lien, type Locale } from "@/lib/i18n";
import { CONTACT, alternatesPage, openGraphPage } from "@/lib/site";

/**
 * /en/mentions-legales — LA JUMELLE ANGLAISE DES MENTIONS LEGALES.
 *
 * L'URL GARDE SON SEGMENT FRANCAIS, et ce n'est pas un oubli. `lien()`
 * (lib/i18n.ts) ne fait que POSER le prefixe `/en` devant un chemin francais :
 * `lien("en", "/mentions-legales")` rend `/en/mentions-legales`. Traduire le
 * segment en `/en/legal-notice` obligerait a tenir une table de correspondance
 * chemin par chemin dans `lien`, dans `cheminSansLocale`, dans le selecteur de
 * langue, dans `alternatesPage` et dans le sitemap — cinq endroits pour un
 * gain de referencement nul sur une page legale que personne ne cherche par
 * mot-cle. components/FooterContact.tsx pointe deja sur cette adresse-la.
 *
 * >>> LA TRADUCTION EST LITTERALE, ET ELLE DOIT LE RESTER. <<<
 *
 * Une mention legale n'est pas de la copie : elle engage l'editeur. Rien n'est
 * resume, rien n'est omis, rien n'est ajoute — les trois rubriques francaises
 * sont ici, dans le meme ordre, avec les memes faits. La phrase de
 * l'hebergeur en particulier est le resultat d'une decision datee du
 * 31 aout 2026 (Vercel, pas Infomaniak ; pas de region suisse chez Vercel, la
 * plus proche de Geneve est Francfort) : elle se reporte, elle ne se
 * reformule pas. Si la region change dans les reglages du projet Vercel, les
 * QUATRE pages se changent ensemble — les deux francaises et les deux
 * anglaises.
 *
 * AUCUNE COORDONNEE N'EST ECRITE EN DUR : `CONTACT` (lib/site.ts) est la
 * source unique, en anglais comme en francais. Le NAP ne se recopie pas, et
 * une seconde graphie du numero sur une page anglaise brouillerait le
 * rapprochement avec la fiche Google exactement comme une seconde graphie
 * francaise.
 *
 * MEME OSSATURE QUE LA PAGE FRANCAISE : statique, zero CSS et zero classe
 * nouvelle, aucun [data-reveal] ecrit a la main (Interactions.tsx en pose un
 * sur `h1.t`), aucun <h3> nu — les intitules utilisent .meta, identique en
 * developpement et en production.
 *
 * PAS DE next/link : Interactions.tsx ne s'initialise qu'une fois, une
 * navigation client-side laisserait les [data-reveal] de la page d'arrivee a
 * opacity:0 (decision B7).
 */

/** La langue de cette page. Tous ses liens internes passent par `lien`. */
const LOCALE: Locale = "en";

/** Le chemin SANS prefixe : c'est `lien` et `alternatesPage` qui posent `/en`. */
const CHEMIN = "/mentions-legales";

const TITRE = "Legal notice";
const DESCRIPTION =
  "Legal notice for Nawa Corps, an independent digital design studio in Geneva: publisher, hosting, intellectual property and applicable law.";

/**
 * Le suffixe « — Nawa Corps » vient du `template` du layout (site) : l'ecrire
 * dans `title` le doublerait.
 *
 * `alternatesPage(CHEMIN, "en")` REND LA CANONIQUE `/en/mentions-legales` ET
 * LES `hreflang`. Sans elle, la page heriterait de `alternates: { canonical:
 * "/" }` declare par app/(site)/layout.tsx et s'auto-desindexerait au profit
 * de l'accueil francais.
 *
 * `en-CH` N'EST DECLARE QUE SI `/mentions-legales` figure dans
 * `CHEMINS_TRADUITS` (lib/i18n.ts). Tant qu'il n'y est pas, cette page repond
 * mais n'est annoncee nulle part — c'est volontaire : annoncer une jumelle
 * avant qu'elle existe est pire que de ne rien annoncer.
 *
 * LE BLOC `twitter` EST REDECLARE EN ENTIER, ET C'EST OBLIGATOIRE ICI ALORS
 * QUE LA PAGE FRANCAISE S'EN PASSE. La fusion des metadata de Next ne descend
 * pas dans les objets : sans ce bloc, la page HERITE de celui du layout, qui
 * est celui de l'accueil — et une page servie en `lang="en-CH"` annoncait donc
 * « Refonte de site pour PME à Genève — en une semaine » sur sa carte de
 * partage. Releve en HTTP avant correction, sur cette page et sur
 * /en/confidentialite.
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

export default function LegalNotice() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      {/* Fil d Ariane : la page est un cul-de-sac de navigation, le moteur a
          besoin qu on lui dise d ou elle depend. `locale` pose `inLanguage` :
          sans lui, deux fils decrivent la meme entite dans deux langues sans
          le dire. */}
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
            <span className="meta">Nawa Corps</span>
          </div>
          <h1 className="t">Legal notice</h1>
          <div className="studio-txt" style={{ marginTop: 40 }}>
            <p className="meta">Publisher</p>
            <p>Nawa Corps, a digital design studio, Geneva, Switzerland, run by Ayoub Bensalem. Contact: {CONTACT.emailGeneral} — {CONTACT.telephoneAffiche}.</p>
            <p className="meta">Hosting</p>
            {/* Decision du 31 aout 2026, reportee mot pour mot depuis
                app/(site)/mentions-legales/page.tsx : Vercel, pas Infomaniak.
                Vercel n a pas de region suisse — la plus proche de Geneve est
                Francfort (fra1), d ou la mention de l Allemagne. */}
            <p>Vercel Inc., a company incorporated under United States law, on servers located in Germany (Frankfurt).</p>
            <p className="meta">Intellectual property</p>
            <p>Content and design © Nawa Corps. Reproduction prohibited without agreement.</p>
            <p style={{ marginTop: 40 }}><a className="lnk" href={lien(LOCALE, "/")}>← Back to the site</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
