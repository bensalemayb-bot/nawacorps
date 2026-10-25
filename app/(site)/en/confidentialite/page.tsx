import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import { estBrouillon, robotsSiBrouillon } from "@/lib/brouillon";
import { lien, type Locale } from "@/lib/i18n";
import { CONSERVATION } from "@/lib/conservation";
import { CONTACT, EXPLOITANT, alternatesPage, openGraphPage, whatsappHref } from "@/lib/site";

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
 * Les rubriques francaises — reecrites le 25 octobre 2026 a partir du code,
 * traitement par traitement — sont ici, dans le meme ordre, avec les memes
 * faits. La page a d'abord affirme « hebergés en Suisse », ce qui est devenu
 * faux le 31 aout 2026 quand l'hebergeur a ete tranche. Les marqueurs de
 * verification sont tous partis le 25 octobre 2026, avec les memes faits et
 * les memes sources que la page francaise (voir son en-tete). Une page de confidentialite
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
 * source unique, et depuis le 25 octobre 2026 le site n'a plus qu'une adresse
 * (`CONTACT.email`) : celle des droits est celle de tout le reste. Les durees
 * viennent de lib/conservation.ts, comme en francais.
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

// « Privacy policy » et non « Privacy » : 20 signes de title, le plus court
// du site, et le mot que cherche un lecteur anglophone (audit SEO v5).
const TITRE = "Privacy policy";
const DESCRIPTION =
  "Nawa Corps privacy policy (nFADP): the form, the Leo assistant, notifications, the abuse log, recipients, retention periods and your rights.";

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
            <p>Last updated: 25 October 2026.</p>

            <p className="meta">Controller</p>
            <p>{EXPLOITANT.titulaire}, {EXPLOITANT.nomCommercial} (sole proprietorship), {EXPLOITANT.adresseEn}. Contact for any question about your data: <a className="lnk" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>

            <p className="meta">Legal framework</p>
            <p>This site applies the Swiss Federal Act on Data Protection (nFADP) and its ordinance (DPO). For visitors located in the European Union, in particular in neighbouring France, the General Data Protection Regulation (GDPR) applies where its conditions are met.</p>
            <p>The nFADP does not require a legal basis for processing that respects its principles; we nevertheless state why each processing takes place. Under the GDPR (Art. 6), these are pre-contractual steps taken at your request (point b) or our legitimate interest in answering enquiries and protecting the site (point f). No processing relies on your consent, and none is used for advertising.</p>

            <p className="meta">1. The demo form</p>
            <p>Data: your name (required), your phone number or your email address (one of the two required), your message, and the page the enquiry was sent from.</p>
            <p>Purpose: to reply to you, arrange the demo and prepare a written offer. Basis: pre-contractual steps.</p>
            <p>The enquiry is stored in our database. A notification is sent at once to the operator&apos;s Telegram messenger: your name, phone number, email address and the first 200 characters of the message.</p>

            <p className="meta">2. Leo, the conversation assistant</p>
            <p>Data: what you write to Leo. With each message, the current conversation is sent to an artificial intelligence provider in the United States (see &ldquo;Recipients&rdquo;) to produce the reply.</p>
            <p>Recording: the conversation is stored in our database when you click &ldquo;Get my demo&rdquo;, and also automatically when you leave or close the page after a few exchanges. It is then sent a second time to the AI provider, which extracts your name, phone number, email address, trade, business name, need, its urgency and an interest score from 1 to 5. If a name and a phone number are present, an enquiry record is created, and a Telegram notification sums it up.</p>
            <p>No decision is taken automatically: the score is only used to sort enquiries. Every enquiry is read by the operator, who alone decides what happens next.</p>
            <p>Purpose: to answer your demo request. Basis: pre-contractual steps and legitimate interest. Do not give Leo any sensitive information (health, your customers&apos; data): write to us directly.</p>

            <p className="meta">3. Telegram notifications</p>
            <p>They let the operator, who works alone and without an office, see an enquiry during the day. They contain the data listed in points 1 and 2. The service is provided by Telegram Messenger Inc., established outside Switzerland and the European Union; according to its privacy policy, data may also be shared with its group companies in the British Virgin Islands and Dubai. These countries are not on the list of States whose data protection Switzerland recognises as adequate: the disclosure relies on Art. 17(1)(b) nFADP, because it is directly connected with the conclusion of the contract your enquiry prepares (for visitors from the European Union: GDPR Art. 49(1)(b)).</p>
            <p>Telegram keeps messages until they are deleted. The automatic purge of our database does not reach them: the operator deletes the notifications from the messenger himself, within the same periods as the database.</p>

            <p className="meta">4. The abuse log</p>
            <p>Each time the form is sent, a message is sent to Leo or a conversation is stored, we record a fingerprint of your IP address (SHA-256 hash with a secret salt: the address itself is not kept), the type of action and the time. This fingerprint is also kept with the stored conversation. Purpose: to limit mass sending and abuse. Basis: legitimate interest in the site&apos;s security.</p>

            <p className="meta">5. The host&apos;s technical logs</p>
            <p>Like any server, the host Vercel processes your IP address, the page requested and the time in order to deliver and secure the site. The logs the operator can consult are kept by Vercel for one hour to 30 days depending on the hosting plan; Vercel keeps its other technical logs under its own retention rules.</p>

            {/* Miroir de la rubrique francaise : l ancre #cookies est la cible
                du lien « Cookies » du pied et du bandeau
                (components/BandeauCookies.tsx). */}
            <p className="meta" id="cookies">6. Cookies and browser storage</p>
            <p>No audience measurement tool, no advertising pixel, no third-party tracker. In normal operation, the site sets no cookie for visitors. Fonts are served by our own site: your browser does not contact Google Fonts.</p>
            <p>The site stores two values in your browser. Neither contains personal data, and neither is sent to our server:</p>
            <p>— &ldquo;bnc-intro&rdquo;, in session storage: avoids replaying the opening animation on every page. It is cleared when the tab is closed.</p>
            <p>— &ldquo;nawa-cookies&rdquo;, in local storage: remembers that you closed the cookie information banner, so that it does not come back on every visit. It stays until you clear the site&apos;s data in your browser.</p>
            <p>If the host&apos;s firewall puts your browser through an anti-bot check, Vercel stores a verification session in it, valid for one hour. Lastly, a technical cookie (&ldquo;admin_session&rdquo;, valid for 24 hours) exists for the administrator only, when logging in to the management area.</p>
            <p>All of this is necessary for the site to work and therefore does not require your consent. If an audience measurement tool were ever added, you could accept or refuse it, and this page would say so.</p>

            <p className="meta">Recipients and countries</p>
            <p>Your data is neither sold nor rented. It is entrusted to the following processors, for the purposes above only:</p>
            <p>— Vercel Inc. (United States): hosting of the site, servers in Frankfurt (Germany).</p>
            <p>— Neon, LLC (United States, Databricks group): database, servers in Frankfurt (Germany).</p>
            <p>— Groq, Inc. (United States): the AI model that makes Leo answer. By default, Groq does not retain requests; it may keep their content for up to 30 days to troubleshoot an outage or investigate abuse.</p>
            <p>— Google LLC (United States): the Gemini AI model, a back-up used only if it is switched on instead of Groq. For a service offered in Switzerland, Google&apos;s terms exclude using the content to improve its products; it is logged for a limited period to detect abuse.</p>
            <p>— Telegram Messenger Inc.: notifications (point 3).</p>
            <p>Germany is on the list of States whose data protection the Federal Council recognises as adequate (Annex 1 DPO). For the United States, the same Annex recognises companies certified under the Swiss-U.S. Data Privacy Framework: Vercel Inc., Google LLC and Databricks, Inc. (including Neon, LLC) are, according to the official list (dataprivacyframework.gov) consulted on 25 October 2026. Groq is not on it: the disclosure relies on the European Union standard contractual clauses, adapted to Swiss law, provided for in its data processing addendum. For Telegram, see point 3. For visitors from the European Union, the equivalent GDPR safeguards apply (EU–U.S. adequacy decision for certified companies, standard contractual clauses for Groq).</p>
            <p>If you write to us on <a className="lnk" href={whatsappHref("en")} target="_blank" rel="noopener">WhatsApp</a>, your messages go through WhatsApp (Meta), under its own rules.</p>

            <p className="meta">How long data is kept</p>
            <p>Enquiries (form and Leo): {CONSERVATION.leadsMois} months after receipt. Conversations with Leo: {CONSERVATION.conversationsMois} months. Abuse log: {CONSERVATION.rateLimitJours} days. If an enquiry leads to a contract, the data needed for the contract is kept for its duration, then for the legal periods (ten years for accounting records, Art. 958f of the Swiss Code of Obligations).</p>
            <p>A purge script automatically deletes from the database everything that has passed these periods. It is run regularly, at least once a month.</p>

            <p className="meta">Security</p>
            <p>The site is served over HTTPS. IP addresses are not stored in clear. The management area is protected by a password and is accessible to the operator only.</p>

            <p className="meta">Your rights</p>
            <p>You may ask for access to your data, its correction, its deletion, the restriction of processing, object to processing, and obtain your data or have it transmitted in a common format (nFADP Art. 25, 28 and 32; GDPR Art. 15 to 21). Write to <a className="lnk" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. We reply within 30 days and may ask you to prove your identity.</p>

            <p className="meta">Complaints</p>
            <p>You may contact the Federal Data Protection and Information Commissioner (FDPIC), Feldeggweg 1, 3003 Bern, edoeb.admin.ch. If you live in the European Union, you may also contact the authority of your country — in France, the CNIL (cnil.fr).</p>

            <p className="meta">Changes</p>
            <p>This page follows how the site actually works. It is updated when a processing changes; the date at the top prevails.</p>

            <p style={{ marginTop: 40 }}><a className="lnk" href={lien(LOCALE, "/")}>← Back to the site</a></p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Privacy() {
  return corps();
}
