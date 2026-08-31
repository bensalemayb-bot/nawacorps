import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import SchemaPage from "@/components/SchemaPage";
import { dictionnaire } from "@/lib/dictionnaires";
import { MENTION_REPONSE_EN } from "@/lib/familles";
import { lien, LANGUE_HTML, type Locale } from "@/lib/i18n";
import {
  CONTACT,
  HORAIRES,
  SITE_NAME,
  SITE_URL,
  alternatesPage,
  jsonLd,
  openGraphPage,
  whatsapp,
} from "@/lib/site";

/**
 * /en/contact — LES CHEMINS POUR JOINDRE LE STUDIO, EN ANGLAIS.
 *
 * MEME STRUCTURE QUE app/(site)/contact/page.tsx, section pour section : les
 * coordonnees, les quatre chemins et ce que chacun sert, ce qu'il est utile
 * d'ecrire, le formulaire, puis la bande verte de fin. Une version anglaise
 * qui reordonnerait ne serait plus la meme page.
 *
 * AUCUNE COORDONNEE N'EST ECRITE EN DUR. Telephone, WhatsApp, adresse e-mail
 * et horaires viennent tous de lib/site.ts, qui est la source unique : pour un
 * commerce local, la coherence du triplet nom / adresse / telephone est le
 * premier signal de referencement local, et deux graphies du meme numero — sur
 * deux pages, ou dans deux langues — suffisent a brouiller le rapprochement
 * avec la fiche Google.
 *
 * UNE SEULE ADRESSE EST MISE EN AVANT, `CONTACT.email` (ayoub@), pour la
 * raison exacte qui l'a imposee en francais : la boite generale existe pour
 * que le tout-venant ne noie pas les demandes de projet, ce qui est un
 * probleme de tri interne — pas un arbitrage a demander au visiteur a
 * l'instant precis ou il veut ecrire. `CONTACT.emailGeneral` (contact@) reste
 * ou elle sert vraiment : /en/mentions-legales et /en/confidentialite.
 *
 * LE PIED DE PAGE COMPLET (FooterContact) N'EST PAS RENDU ICI, ET C'EST
 * DELIBERE : il embarque le meme ContactForm. Deux formulaires sur une page de
 * contact, c'est deux endroits ou envoyer la meme demande. La bande verte de
 * fin reprend donc ce qu'il faut du pied de page — coordonnees et liens
 * legaux, dans la meme .c-cols — sans le formulaire.
 *
 * L'ENGAGEMENT DE REACTIVITE EST IMPORTE, PAS RECOPIE. `MENTION_REPONSE_EN`
 * vient de lib/familles.ts : le guide de voix §8 impose UNE seule formulation
 * au caractere pres, et la contrainte ne s'allege pas parce qu'on change de
 * langue — deux tournures anglaises du meme engagement seraient lues comme
 * deux engagements.
 *
 * REGLES DE VOIX, RENVERSEES LE 31 AOUT 2026 : `we`, `us`, `our` — `I`,
 * `me`, `my` ne s'ecrivent plus dans la voix du studio, mais `our team`,
 * `our offices` et `since 20XX` restent interdits : le pluriel grammatical
 * n'autorise aucun effectif invente. Anglais britannique (`enquiry`, jamais
 * `inquiry`) ; `Geneva` ; aucune comparaison.
 *
 * ET « GOOGLE » NE NOMME PLUS UNE PRESTATION (meme decision) : il a quitte la
 * liste de ce qu'on peut ecrire a cette adresse, et la liste des maux du
 * lecteur. Le mot peut decrire un fait, jamais une chose vendue.
 *
 * AUCUN MONTANT ICI, donc aucune mention de TVA a porter : les prix vivent en
 * base et se lisent sur /en/services. La page ne lit pas Postgres et reste
 * statique — `next build` passe base eteinte.
 *
 * ZERO CLASSE NOUVELLE : .wrap, .sec-head, .meta, .index, h1.t / h2.t, .lede,
 * .studio-txt, .facts, .prest-inc, .sm-grp, .c-row, .c-cols, .btn, .lnk.
 *
 * PAS DE next/link : Interactions.tsx ne s'initialise qu'une fois (B7).
 */

/** La langue de cette page. TOUS ses liens internes passent par `lien`. */
const LOCALE: Locale = "en";

/** Le chemin SANS prefixe : c'est `lien` et `alternatesPage` qui posent `/en`. */
const CHEMIN = "/contact";

const t = dictionnaire(LOCALE);

/**
 * « Geneva » et « Geneva, Switzerland » — lus dans le dictionnaire anglais
 * plutot que reecrits ici.
 *
 * `CONTACT.ville` vaut « Genève » : c'est le NAP, ecrit pour la fiche Google
 * et la donnee structuree, et lib/site.ts n'a pas encore de jumeau anglais.
 * Ouvrir une seconde graphie de la ville dans ce fichier serait exactement ce
 * que la source unique existe pour empecher.
 */
const VILLE = t.nav.horlogeVille;

/**
 * Les horaires, DERIVES de lib/site.ts plutot que recopies — meme discipline
 * que la page francaise, et pour la meme raison : un changement d'horaire
 * repercute a la main dans deux langues diverge au premier oubli.
 *
 * LA PLAGE SUPPOSE DES JOURS CONTIGUS — c'est le cas aujourd'hui, du lundi au
 * samedi. Le jour ou un jour disparait du milieu de `HORAIRES.jours`, ce
 * raccourci deviendra faux et il faudra afficher la liste ; c'est ecrit ici
 * comme cote francais pour que le prochain lecteur le sache avant de toucher a
 * lib/site.ts.
 *
 * LE RESULTAT DOIT RESTER IDENTIQUE A `t.pied.horaires` (« Mon–Sat · 9am–7pm »),
 * que le pied de page ecrit a la main : deux graphies des memes horaires sur
 * la meme langue seraient un NAP incoherent.
 */
const ABREGE: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};
const JOURS = `${ABREGE[HORAIRES.jours[0]]}–${
  ABREGE[HORAIRES.jours[HORAIRES.jours.length - 1]]
}`;
/**
 * « 09:00 » devient « 9am », « 19:00 » devient « 7pm ». Le format schema.org
 * est en 24 heures et ne se montre jamais a l'ecran ; l'horloge de 12 heures
 * est la convention anglophone, et c'est celle du dictionnaire.
 */
const enHeure = (h: string) => {
  const heures = Number(h.slice(0, 2));
  const affichee = heures % 12 === 0 ? 12 : heures % 12;
  return `${affichee}${heures < 12 ? "am" : "pm"}`;
};
const PLAGE = `${enHeure(HORAIRES.ouverture)}–${enHeure(HORAIRES.fermeture)}`;

/**
 * Le suffixe « — Nawa Corps » vient du `template` du layout (site).
 *
 * Le bloc `twitter` est redeclare EN ENTIER : la fusion des metadata de Next
 * ne descend pas dans les objets, et sans lui cette page porterait le titre et
 * la description de l'accueil sur sa carte de partage.
 */
const TITRE = "Contacting the studio in Geneva";
const DESCRIPTION =
  "WhatsApp, the phone, email or the form: the four ways to reach the studio in Geneva, and what is worth putting in your message.";

export const metadata: Metadata = {
  title: TITRE,
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
 * ContactPage anglaise, rattachee au studio PAR REFERENCE.
 *
 * LE `contactPoint` N'EST PAS REDECLARE ICI, et c'est le point a comprendre
 * avant de « completer » ce noeud. app/(site)/contact/page.tsx attache DEJA un
 * ContactPoint a l'`@id` `/#studio` — un seul, `sales`, apres qu'un second ait
 * ete retire en meme temps que le bloc contact@ de l'ecran. Les noeuds de meme
 * `@id` se fondent a l'echelle du site : en poser un second ici, avec un `name`
 * anglais, donnerait DEUX canaux de contact la ou le studio n'en presente
 * qu'un. `availableLanguage` du noeud francais annonce deja `fr` et `en`,
 * c'est-a-dire exactement ce que cette page ajoute comme information.
 *
 * CE QUI EST PROPRE A CETTE PAGE : son `@id`, son URL, son titre, sa
 * description et `inLanguage` — le champ qui dit au moteur que ce document est
 * la version anglaise et non un doublon.
 */
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}${lien(LOCALE, CHEMIN)}#page`,
  url: `${SITE_URL}${lien(LOCALE, CHEMIN)}`,
  inLanguage: LANGUE_HTML[LOCALE],
  name: `${TITRE} — ${SITE_NAME}`,
  description: DESCRIPTION,
  mainEntity: { "@id": `${SITE_URL}/#studio` },
};

/**
 * Amorce propre a cette page : elle dit d'ou vient le message.
 *
 * ELLE RESTE A LA PREMIERE PERSONNE DU SINGULIER, et ce n'est pas un oubli du
 * passage a `we` le 31 aout 2026 : c'est le VISITEUR qui parle ici, pas le
 * studio.
 */
const AMORCE_WHATSAPP = whatsapp(
  "Hello, I'd like to talk about a project for my business.",
);

export default function ContactEn() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(SCHEMA) }}
      />
      <SchemaPage
        locale={LOCALE}
        fil={[
          { nom: "Home", chemin: lien(LOCALE, "/") },
          { nom: "Contact", chemin: lien(LOCALE, CHEMIN) },
        ]}
      />

      {/* ---------- Le titre, et les coordonnées réelles ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              Contact
            </span>
            {/* Interactions.tsx decoupe h1.t sur ses <br> et lui pose lui-meme
                son [data-reveal] : ne pas en ecrire un a la main. */}
            <h1 className="t">
              Four ways
              <br />
              to reach us.
            </h1>
          </div>

          <p className="lede" data-reveal>
            WhatsApp, the phone, email, the form: they all land in the same
            place, with us. What follows says which one is for what, and what is
            worth putting in your message.
          </p>

          <div className="facts" data-reveal>
            <div>
              <b>{CONTACT.telephoneAffiche}</b>
              <span>Phone and WhatsApp</span>
            </div>
            <div>
              <b>
                {JOURS} · {PLAGE}
              </b>
              <span>Opening hours</span>
            </div>
            <div>
              <b>{VILLE}</b>
              <span>And the surrounding region</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Les quatre chemins, et ce que chacun sert ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; The ways in
            </span>
            <div data-reveal>
              <h2 className="t">
                Which one to take,
                <br />
                and what for.
              </h2>
            </div>
          </div>

          {/* Les intitules sont des <h3> PORTANT .sm-grp, jamais des <h3> nus :
              sans regle propre, un h3 prend `font-size:inherit` du preflight
              Tailwind en production et la taille par defaut du navigateur en
              developpement — deux rendus differents pour le meme titre. */}
          <div className="studio-txt" data-reveal>
            <h3 className="sm-grp">WhatsApp</h3>
            <p>
              The most direct, and the one that asks the least formatting. A
              photo of your business card, the address of your site, two lines
              on what is wrong: that is often all it takes to start.{" "}
              <a
                className="lnk"
                href={AMORCE_WHATSAPP}
                target="_blank"
                rel="noopener"
              >
                Message us on WhatsApp →
              </a>
            </p>

            <h3 className="sm-grp">The phone</h3>
            <p>
              If it is easier said than written — and for a stocktake, it almost
              always is.{" "}
              <a className="lnk" href={`tel:${CONTACT.telephone}`}>
                {CONTACT.telephoneAffiche}
              </a>
              {/* « Lu–Sa de 9h–19h » ne se calque pas : « from 9am–7pm » melange
                  une preposition et un intervalle. La virgule fait le meme
                  travail, et c'est la forme qu'emploie deja le pied de page. */}
              , {JOURS}, {PLAGE}.
            </p>

            {/* UNE SEULE ADRESSE, ET AUCUN ARBITRAGE DEMANDE — meme decision
                qu en francais. L adresse generale n a pas disparu du site :
                elle vit dans /en/mentions-legales et /en/confidentialite, ou
                la loi la demande. */}
            <h3 className="sm-grp">{CONTACT.email}</h3>
            <p>
              Our inbox, and it is the only one to write to: a site rebuild,
              identity, print, photography, social media, a quote. It lands on
              our phone like the rest.{" "}
              <a className="lnk" href={`mailto:${CONTACT.email}`}>
                Write to {CONTACT.email} →
              </a>
            </p>

            <h3 className="sm-grp">The form</h3>
            <p>
              If you would rather not open anything else. It is just below: your
              name, your phone number, two lines. It lands in the same place as
              the rest — on our phone.
            </p>
          </div>

          <div className="c-row" data-reveal>
            <a
              className="btn"
              href={AMORCE_WHATSAPP}
              target="_blank"
              rel="noopener"
            >
              Message us on WhatsApp <span className="ar">→</span>
            </a>
            <a className="btn btn-line" href={`tel:${CONTACT.telephone}`}>
              {CONTACT.telephoneAffiche}
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Ce qu'il est utile d'écrire, puis le formulaire ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(02)</span>&nbsp; Your message
            </span>
            <div data-reveal>
              <h2 className="t">
                Five lines, and we
                <br />
                can already price it.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            You have nothing to prepare for what comes next — but these five
            things, given straight away, stop the first reply being one more
            question.
          </p>

          <ul className="prest-inc" data-reveal style={{ marginTop: 34 }}>
            <li>
              The address of your current site, if there is one. That is where
              we take your words from.
            </li>
            <li>
              Your trade and the area you cover: a garage and an accountancy
              firm do not have the same pages.
            </li>
            <li>
              What you want to receive: quotes, appointments, calls.
            </li>
            <li>
              What bothers you today, even in one sentence — the site that is
              not readable on a phone, the form that no longer works, the
              photographs that have aged.
            </li>
            <li>Your deadline, if you have one.</li>
          </ul>

          <div data-reveal>
            <p className="meta" style={{ marginTop: 40 }}>
              {MENTION_REPONSE_EN}
            </p>
            {/* `locale` fait descendre l anglais dans les libelles, le bouton
                d envoi et les trois messages d erreur ecrits cote client. Les
                erreurs renvoyees par app/api/contact/route.ts restent
                francaises : la route ne connait pas la langue de l appelant,
                et c est un chantier a part. */}
            <ContactForm locale={LOCALE} />
          </div>
        </div>
      </section>

      {/* ---------- La bande de fin : coordonnées et pages légales ----------
          Elle reprend .c-cols du pied de page, sans le formulaire qu il
          embarque : la page en a deja un. .c-cols est ecrite pour le vert
          (`--muted-g`, `--line-g`, liens en `--bone`) : la section porte donc
          .green, sans quoi la bande serait illisible sur beige. */}
      <section className="green">
        <div className="wrap">
          {/* « studio de création digitale » ⇒ `digital design studio`
              (glossaire §3) — jamais `web agency` ni `creative agency`. Le
              dictionnaire porte `pied.metier`, mais il y colle « — Geneva »,
              qui ferait doublon avec la ligne juste en dessous. */}
          <span className="meta" data-reveal>
            Nawa Corps · Digital design studio
          </span>
          <div className="c-cols" data-reveal>
            <span>{t.pied.lieu}</span>
            <a className="lnk" href={`tel:${CONTACT.telephone}`}>
              {CONTACT.telephoneAffiche}
            </a>
            <span>
              {JOURS} · {PLAGE}
            </span>
            <a className="lnk" href={lien(LOCALE, "/studio")}>
              {t.nav.studio}
            </a>
            <a className="lnk" href={lien(LOCALE, "/mentions-legales")}>
              {t.pied.mentionsLegales}
            </a>
            <a className="lnk" href={lien(LOCALE, "/confidentialite")}>
              {t.pied.confidentialite}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
