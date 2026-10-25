import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import { estBrouillon, robotsSiBrouillon } from "@/lib/brouillon";
import { lien, type Locale } from "@/lib/i18n";
import { CONTACT, EXPLOITANT, alternatesPage, openGraphPage, whatsappHref } from "@/lib/site";

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
 * resume, rien n'est omis, rien n'est ajoute — les rubriques francaises
 * (reecrites le 25 octobre 2026 : exploitant, statut, hebergement, propriete
 * intellectuelle, responsabilite, donnees, droit applicable) sont ici, dans le
 * meme ordre, avec les memes faits. Les marqueurs de verification (adresse,
 * region Neon) sont tous partis au 25 octobre 2026, comme sur la page
 * francaise. La phrase de
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
  "Legal notice for Nawa Corps, a sole proprietorship in Geneva: operator, address, status, hosting, intellectual property and governing law.";

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

function corps() {
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
            <p className="meta">Operator</p>
            <p>{EXPLOITANT.nomCommercial} is the sole proprietorship of {EXPLOITANT.titulaire}, who runs it alone.</p>
            <p>Postal address: {EXPLOITANT.adresseEn}.</p>
            <p>Contact: <a className="lnk" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> — <a className="lnk" href={`tel:${CONTACT.telephone}`}>{CONTACT.telephoneAffiche}</a>.</p>

            <p className="meta">Status</p>
            <p>Sole proprietorship not entered in the commercial register. Not registered for VAT: prices are stated without VAT, and no VAT is charged.</p>
            <p>Person responsible for the content: {EXPLOITANT.titulaire}.</p>

            <p className="meta">Hosting</p>
            {/* Miroir de app/(site)/mentions-legales/page.tsx : Vercel, region
                Francfort (vercel.json, `fra1`). Les quatre pages legales se
                changent ensemble si la region change. */}
            <p>Website: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States, on servers located in Frankfurt (Germany).</p>
            <p>Database: Neon, LLC (Databricks group), a United States company, on servers located in Frankfurt (Germany).</p>

            <p className="meta">Intellectual property</p>
            <p>The text, design, logos and code of this site belong to {EXPLOITANT.titulaire} ({EXPLOITANT.nomCommercial}). Any reproduction requires prior written agreement. The trademarks mentioned belong to their owners.</p>

            <p className="meta">Liability</p>
            <p>The information on this site is given in good faith, with no guarantee that it is complete. Leo, the site&apos;s conversation assistant, is an automated demonstration: its answers are neither an offer nor a commitment. Only a written offer from {EXPLOITANT.nomCommercial} is binding, under the general terms and conditions.</p>
            <p>Links to third-party services (<a className="lnk" href={whatsappHref("en")} target="_blank" rel="noopener">WhatsApp</a> in particular) lead off the site; their operators are responsible for them.</p>

            <p className="meta">Personal data and terms</p>
            <p>
              How data is processed is set out in the{" "}
              <a className="lnk" href={lien(LOCALE, "/confidentialite")}>privacy policy</a>. Our services are governed by the{" "}
              <a className="lnk" href={lien(LOCALE, "/cgv")}>general terms and conditions</a>.
            </p>

            <p className="meta">Governing law and jurisdiction</p>
            <p>Swiss law applies. The place of jurisdiction is Geneva, subject to any mandatory place of jurisdiction provided by law.</p>

            <p style={{ marginTop: 40 }}><a className="lnk" href={lien(LOCALE, "/")}>← Back to the site</a></p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function LegalNotice() {
  return corps();
}
