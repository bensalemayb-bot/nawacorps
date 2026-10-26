import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import OuvrirDevis from "@/components/OuvrirDevis";
import SchemaPage from "@/components/SchemaPage";
import { resoudreDevis } from "@/lib/devis";
import { dictionnaire } from "@/lib/dictionnaires";
import { MENTION_REPONSE_EN } from "@/lib/mentions";
import { lien, type Locale } from "@/lib/i18n";
import { SITE_NAME, alternatesPage, openGraphPage } from "@/lib/site";

/**
 * /en/devis — LA DEMANDE DE DEMO, EN ANGLAIS (docs/agents/copy/devis.md).
 *
 * Elle fait exactement ce que fait sa jumelle francaise : aucun nom de
 * prestation, aucun prix ; l assistant du site (Leo) s ouvre au montage, et le
 * formulaire est rendu cote serveur juste en dessous, avec le meme sujet en
 * champ cache.
 *
 * LE `?p=` EST LE MEME DANS LES DEUX LANGUES : c est un identifiant qui part
 * en base (`Lead.subject`). lib/devis.ts le resout ; seule l amorce WhatsApp
 * change de langue. Absent, ancien ou inconnu, il retombe sur la demande
 * generale — la page ne peut pas echouer.
 *
 * ZERO CSS NOUVEAU. PAS DE next/link : Interactions.tsx ne s initialise qu une
 * fois (B7).
 */

/** La langue de cette page. TOUS ses liens internes passent par `lien`. */
const LOCALE: Locale = "en";

/** Le chemin SANS prefixe : c'est `lien` et `alternatesPage` qui posent `/en`. */
const CHEMIN = "/devis";

const t = dictionnaire(LOCALE);

/**
 * « Geneva » — lu dans le dictionnaire anglais plutot que reecrit ici.
 * `CONTACT.ville` (lib/site.ts) vaut « Genève » : c'est le NAP, et une seconde
 * graphie de la ville ecrite dans ce fichier est ce que la source unique
 * existe pour empecher.
 */
const VILLE = t.nav.horlogeVille;

/**
 * TITRE ET DESCRIPTION DE L AUDIT CRO/SEO DU 25.10.2026 (§4.4,
 * docs/agents/reviews/audit-cro-seo-2026-10-25.md). Le titre est
 * `absolute` : il tient ses 60 signes sans le suffixe « — Nawa Corps » du
 * `template`, qui l aurait fait deborder (ou, pour /contact, aurait ecrit la
 * marque deux fois).
 */
const TITRE = "Free demo of the AI assistant on your trade · Geneva";
const DESCRIPTION =
  "We show you the assistant on enquiries from your trade. Nothing to prepare, nothing to pay, no access to your tools. A reply the next working day.";

/**
 * La canonique est `/en/devis` NU, sans le `?p=`. Le `twitter` est redeclare
 * EN ENTIER : la fusion des metadata de Next ne descend pas dans les objets.
 */
export const metadata: Metadata = {
  title: { absolute: TITRE },
  description: DESCRIPTION,
  alternates: alternatesPage(CHEMIN, LOCALE),
  openGraph: openGraphPage(
    {
      titre: `${TITRE} — ${SITE_NAME}`,
      description: DESCRIPTION,
      chemin: CHEMIN,
    },
    LOCALE,
  ),
  twitter: {
    card: "summary_large_image",
    title: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

/**
 * `searchParams` EST UNE PROMESSE depuis Next 15, et il faut l'attendre — voir
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md.
 * Le lire opte cette page dans le rendu DYNAMIQUE : elle depend de la requete.
 */
export default async function DevisEn({
  searchParams,
}: {
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>;
}) {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  const { p } = await searchParams;
  const demande = resoudreDevis(p, LOCALE);

  return (
    <>
      <SchemaPage
        locale={LOCALE}
        fil={[
          { nom: "Home", chemin: lien(LOCALE, "/") },
          { nom: "Ask for a demo", chemin: lien(LOCALE, CHEMIN) },
        ]}
      />

      {/* L'assistant s'ouvre au montage, deja renseigne. Il ne rend rien :
          voir components/OuvrirDevis.tsx. */}
      <OuvrirDevis
        sujet={demande.sujet ?? undefined}
        libelle={demande.libelle ?? undefined}
      />

      {/* ---------- La demande de demo ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              The demo
            </span>
            {/* Interactions.tsx decoupe h1.t sur ses <br> et lui pose lui-meme
                son [data-reveal] : ne pas en ecrire un a la main. */}
            <h1 className="t">
              See it
              <br />
              on your trade.
            </h1>
          </div>

          <p className="lede" data-reveal>
            {demande.libelle
              ? `You're here for “${demande.libelle}”. Leo already knows, so it only asks what is missing.`
              : "Leo, this site's assistant, opens at the bottom of the screen. Tell it your trade: it asks the questions that are missing. If you would rather write it all at once, the form is just below."}
          </p>

          {/* Deux faits qui levent l'objection du prix et celle des donnees au
              moment de la demande. Aucun montant ici : la demo ne coute rien. */}
          <div className="facts" data-reveal>
            <div>
              <b>Nothing</b>
              <span>What the demo costs</span>
            </div>
            <div>
              <b>None</b>
              <span>Access to your tools</span>
            </div>
            <div>
              <b>{VILLE}</b>
              <span>And around</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Ce qu'il est utile de dire, puis le formulaire ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; Your message
            </span>
            <div data-reveal>
              <h2 className="t">
                Your trade,
                <br />
                nothing to prepare.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              You have nothing to send us. We show you the assistant on
              enquiries from your trade, and we have access to none of your
              tools. Just tell us:
            </p>
          </div>

          <ul className="prest-inc" data-reveal style={{ marginTop: 26 }}>
            <li>Your trade.</li>
            <li>How your enquiries arrive today.</li>
            <li>The best time to call you back.</li>
          </ul>

          {/* LE FORMULAIRE EST LE FILET DE L'ASSISTANT, ET IL EST RENDU COTE
              SERVEUR. Il part avec le meme sujet en champ cache. */}
          {/* L ANCRE `#formulaire` EST LUE PAR L ASSISTANT (components/
              ChatWidget.tsx) : son nom ne se traduit pas, sinon le repli du
              widget retomberait sur l accueil et ferait perdre au visiteur sa
              place et le sujet de sa demande. */}
          <div id="formulaire" data-reveal>
            <p className="meta" style={{ marginTop: 40 }}>
              {MENTION_REPONSE_EN}
            </p>
            <ContactForm subject={demande.sujet ?? undefined} locale={LOCALE} />
          </div>

          {/* Le troisieme chemin, pour qui ne veut ni bulle ni formulaire.
              L'amorce demande deja la demo, en anglais (lib/devis.ts). */}
          <div className="c-row" data-reveal>
            <a className="btn btn-line" href={demande.amorce} target="_blank" rel="noopener">
              Message us on WhatsApp
            </a>
            <a className="btn btn-line" href={lien(LOCALE, "/services")}>
              See the assistant in detail
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
