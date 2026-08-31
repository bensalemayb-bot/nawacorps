import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { MENTION_REPONSE } from "@/lib/familles";
import {
  CONTACT,
  HORAIRES,
  LANGUES,
  NAP_CONFIRME,
  SITE_NAME,
  SITE_URL,
  jsonLd,
  openGraphPage,
  whatsapp,
} from "@/lib/site";

/**
 * /contact — LES CHEMINS POUR JOINDRE LE STUDIO, ET CE QUE CHACUN SERT.
 *
 * POURQUOI CETTE PAGE EXISTE. Le contact vivait uniquement en pied de page,
 * derriere toute la longueur de l accueil : deux boutons et un formulaire, sans
 * un mot sur ce qui distingue les canaux. Un visiteur qui cherche « comment les
 * joindre » n avait aucune page a atteindre, et rien ne lui disait laquelle des
 * deux adresses e-mail utiliser.
 *
 * AUCUNE COORDONNEE N EST ECRITE EN DUR. Telephone, WhatsApp, les deux
 * adresses et les horaires viennent tous de lib/site.ts, qui est la source
 * unique : pour un commerce local, la coherence du triplet nom / adresse /
 * telephone est le premier signal de referencement local, et deux graphies du
 * meme numero sur deux pages suffisent a brouiller le rapprochement avec la
 * fiche Google. Une valeur recopiee ici serait exactement la divergence que ce
 * fichier existe pour empecher.
 *
 * LES DEUX ADRESSES NE SONT PAS UN DOUBLON, ET LA PAGE LE DIT. `CONTACT.email`
 * (ayoub@) recoit les demandes de projet ; `CONTACT.emailGeneral` (contact@)
 * recoit le reste — droits nLPD, mentions legales, sollicitations. Les separer
 * evite qu une demande client se perde dans le tout-venant, et le visiteur doit
 * savoir laquelle choisir sinon la separation ne sert a rien.
 *
 * LE FORMULAIRE EST components/ContactForm.tsx, IMPORTE TEL QUEL. Il n est pas
 * reecrit : il porte deja son leurre anti-robot, sa gestion d erreur et son
 * message de succes, et une seconde implementation divergerait au premier
 * correctif.
 *
 * LE PIED DE PAGE COMPLET (FooterContact) N EST PAS RENDU ICI, ET C EST
 * DELIBERE : il embarque le meme ContactForm. Deux formulaires sur une page de
 * contact, c est deux endroits ou envoyer la meme demande et un doute de plus a
 * lever. La bande verte de fin reprend donc ce qu il faut du pied de page — les
 * coordonnees et les liens legaux, dans la meme .c-cols — sans le formulaire.
 *
 * L ENGAGEMENT DE REACTIVITE EST ECRIT UNE FOIS, ET AU BON ENDROIT : juste
 * au-dessus du formulaire, la ou nait la question « quand est-ce qu on me
 * repond ? ». Il est IMPORTE de lib/familles.ts (`MENTION_REPONSE`) et non
 * recopie — le guide de voix impose une seule formulation, au caractere pres,
 * et une chaine recopiee finit toujours par deriver d un mot.
 *
 * AUCUN MONTANT ICI, donc aucune mention de TVA a porter : les prix vivent en
 * base et se lisent sur /services. La page ne lit pas Postgres et reste
 * statique — `next build` passe base eteinte.
 *
 * ZERO CLASSE NOUVELLE : .wrap, .sec-head, .meta, .index, h1.t / h2.t, .lede,
 * .studio-txt, .facts, .prest-inc, .sm-grp, .c-row, .c-cols, .btn, .lnk.
 *
 * PAS DE next/link : Interactions.tsx ne s initialise qu une fois, une
 * navigation client-side laisserait les [data-reveal] de la page d arrivee a
 * opacity:0.
 */

/**
 * Les horaires, DERIVES de lib/site.ts plutot que recopies.
 *
 * Le pied de page ecrit « Lu–Sa · 9h–19h » a la main ; cette page ne peut pas
 * se le permettre en plus, sans quoi un changement d horaire devrait etre
 * repercute a deux endroits et le NAP divergerait au premier oubli.
 *
 * LA PLAGE SUPPOSE DES JOURS CONTIGUS — c est le cas aujourd hui, du lundi au
 * samedi. Le jour ou un jour disparait du milieu de `HORAIRES.jours`, ce
 * raccourci deviendra faux et il faudra afficher la liste : c est ecrit ici
 * pour que le prochain lecteur le sache avant de toucher a lib/site.ts.
 */
const ABREGE: Record<string, string> = {
  Monday: "Lu",
  Tuesday: "Ma",
  Wednesday: "Me",
  Thursday: "Je",
  Friday: "Ve",
  Saturday: "Sa",
  Sunday: "Di",
};
const JOURS = `${ABREGE[HORAIRES.jours[0]]}–${
  ABREGE[HORAIRES.jours[HORAIRES.jours.length - 1]]
}`;
/** « 09:00 » devient « 9h » : le format schema.org ne se montre pas a l ecran. */
const enHeure = (h: string) => `${Number(h.slice(0, 2))}h`;
const PLAGE = `${enHeure(HORAIRES.ouverture)}–${enHeure(HORAIRES.fermeture)}`;

/**
 * Le suffixe « — Nawa Corps » vient du `template` du layout (site).
 *
 * Le bloc `twitter` est redeclare EN ENTIER : la fusion des metadata de Next ne
 * descend pas dans les objets, et sans lui cette page porterait le titre et la
 * description de l accueil sur sa carte de partage.
 */
const TITRE = "Contacter le studio à Genève";
const DESCRIPTION =
  "WhatsApp, téléphone, deux adresses e-mail ou le formulaire : les chemins pour joindre le studio à Genève, et ce qu'il est utile d'écrire.";

export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: openGraphPage({
    titre: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    chemin: "/contact",
  }),
  twitter: {
    card: "summary_large_image",
    title: `${TITRE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

/**
 * ContactPage, rattachee au studio par @id.
 *
 * LE STUDIO N EST PAS REDECLARE : components/SchemaStudio.tsx emet le
 * ProfessionalService sur l accueil sous l @id `/#studio`. On lui AJOUTE ici
 * ses points de contact, par reference — deux fiches du meme prestataire qui
 * divergeraient d un mot valent moins qu une seule, referencee.
 *
 * LES DEUX ContactPoint DISENT LA MEME CHOSE QUE LA PAGE, et c est la regle :
 * une donnee structuree qui promet ce que l ecran ne montre pas finit ignoree.
 * `sales` porte la boite d Ayoub et le telephone, `customer service` la boite
 * generale — exactement la separation ecrite dans lib/site.ts.
 *
 * NAP_CONFIRME RESTE LE VERROU. Il vaut true, donc les coordonnees partent ;
 * le jour ou l une d elles redevient incertaine, on cesse d emettre le bloc
 * entier plutot que de corriger une valeur qui s est deja propagee.
 */
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact#page`,
  url: `${SITE_URL}/contact`,
  name: `${TITRE} — ${SITE_NAME}`,
  description: DESCRIPTION,
  mainEntity: {
    "@id": `${SITE_URL}/#studio`,
    ...(NAP_CONFIRME
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "sales",
              name: "Demandes de projet",
              telephone: CONTACT.telephone,
              email: CONTACT.email,
              areaServed: CONTACT.ville,
              availableLanguage: [...LANGUES],
              hoursAvailable: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [...HORAIRES.jours],
                opens: HORAIRES.ouverture,
                closes: HORAIRES.fermeture,
              },
            },
            {
              "@type": "ContactPoint",
              contactType: "customer service",
              name: "Questions générales",
              email: CONTACT.emailGeneral,
              areaServed: CONTACT.ville,
              availableLanguage: [...LANGUES],
            },
          ],
        }
      : {}),
  },
};

/** Amorce propre a cette page : elle dit d ou vient le message. */
const AMORCE_WHATSAPP = whatsapp(
  "Bonjour, j'aimerais parler d'un projet pour mon entreprise.",
);

export default function ContactPage() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(SCHEMA) }}
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
              Quatre façons
              <br />
              de me joindre.
            </h1>
          </div>

          <p className="lede" data-reveal>
            WhatsApp, téléphone, e-mail, formulaire : tous arrivent au même
            endroit, chez moi. Ce qui suit dit lequel sert à quoi, et ce
            qu&apos;il est utile de mettre dans votre message.
          </p>

          <div className="facts" data-reveal>
            <div>
              <b>{CONTACT.telephoneAffiche}</b>
              <span>Téléphone et WhatsApp</span>
            </div>
            <div>
              <b>
                {JOURS} · {PLAGE}
              </b>
              <span>Horaires</span>
            </div>
            <div>
              <b>{CONTACT.ville}</b>
              <span>Et sa région</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Les quatre chemins, et ce que chacun sert ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(01)</span>&nbsp; Les chemins
            </span>
            <div data-reveal>
              <h2 className="t">
                Lequel prendre,
                <br />
                et pour quoi.
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
              Le plus direct, et celui qui demande le moins de mise en forme.
              Une photo de votre carte de visite, l&apos;adresse de votre site,
              deux lignes sur ce qui ne va pas : c&apos;est souvent tout ce
              qu&apos;il faut pour commencer.{" "}
              <a
                className="lnk"
                href={AMORCE_WHATSAPP}
                target="_blank"
                rel="noopener"
              >
                Écrire sur WhatsApp →
              </a>
            </p>

            <h3 className="sm-grp">Téléphone</h3>
            <p>
              Si c&apos;est plus simple à dire qu&apos;à écrire — et pour un
              état des lieux, ça l&apos;est presque toujours.{" "}
              <a className="lnk" href={`tel:${CONTACT.telephone}`}>
                {CONTACT.telephoneAffiche}
              </a>
              , {JOURS} de {PLAGE}.
            </p>

            <h3 className="sm-grp">{CONTACT.email}</h3>
            <p>
              Ma boîte, et elle ne sert qu&apos;à ça : les demandes de projet.
              Refonte de site, identité, imprimés, photographie, fiche Google,
              réseaux sociaux, devis. Si vous hésitez entre les deux adresses,
              c&apos;est celle-ci.{" "}
              <a className="lnk" href={`mailto:${CONTACT.email}`}>
                Écrire à {CONTACT.email} →
              </a>
            </p>

            <h3 className="sm-grp">{CONTACT.emailGeneral}</h3>
            <p>
              Tout le reste : une question sur les mentions légales, l&apos;accès
              ou la suppression de vos données, une facture, une sollicitation.
              Les deux boîtes sont séparées pour qu&apos;une demande client ne se
              perde pas dans le tout-venant.{" "}
              <a className="lnk" href={`mailto:${CONTACT.emailGeneral}`}>
                Écrire à {CONTACT.emailGeneral} →
              </a>
            </p>

            <h3 className="sm-grp">Le formulaire</h3>
            <p>
              Si vous préférez ne rien ouvrir d&apos;autre. Il est juste en
              dessous : votre nom, votre téléphone, deux lignes. Il arrive au
              même endroit que le reste — sur mon téléphone.
            </p>
          </div>

          <div className="c-row" data-reveal>
            <a
              className="btn"
              href={AMORCE_WHATSAPP}
              target="_blank"
              rel="noopener"
            >
              Écrire sur WhatsApp <span className="ar">→</span>
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
              <span className="index">(02)</span>&nbsp; Votre message
            </span>
            <div data-reveal>
              <h2 className="t">
                Cinq lignes, et
                <br />
                je peux déjà chiffrer.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            Vous n&apos;avez rien à préparer pour la suite — mais ces cinq
            éléments-là, donnés tout de suite, évitent que la première réponse
            soit une question de plus.
          </p>

          <ul className="prest-inc" data-reveal style={{ marginTop: 34 }}>
            <li>
              L&apos;adresse de votre site actuel, s&apos;il y en a un.
              C&apos;est de là que je reprends vos textes.
            </li>
            <li>
              Votre métier et la zone que vous couvrez : un garage et une
              fiduciaire n&apos;ont pas les mêmes pages.
            </li>
            <li>
              Ce que vous voulez recevoir : des devis, des rendez-vous, des
              appels.
            </li>
            <li>
              Ce qui vous gêne aujourd&apos;hui, même en une phrase — le site
              illisible sur téléphone, le formulaire qui ne fonctionne plus, la
              fiche Google sans photos.
            </li>
            <li>Votre échéance, si vous en avez une.</li>
          </ul>

          <div data-reveal>
            <p className="meta" style={{ marginTop: 40 }}>
              {MENTION_REPONSE}
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ---------- La bande de fin : coordonnées et pages légales ----------
          Elle reprend .c-cols du pied de page, sans le formulaire qu il
          embarque : la page en a deja un, et deux formulaires seraient deux
          endroits ou envoyer la meme demande. .c-cols est ecrite pour le vert
          (`--muted-g`, `--line-g`, liens en `--bone`) : la section porte donc
          .green, sans quoi la bande serait illisible sur beige. */}
      <section className="green">
        <div className="wrap">
          <span className="meta" data-reveal>
            Nawa Corps · Studio de création digitale
          </span>
          <div className="c-cols" data-reveal>
            <span>{CONTACT.ville}, Suisse</span>
            <a className="lnk" href={`tel:${CONTACT.telephone}`}>
              {CONTACT.telephoneAffiche}
            </a>
            <span>
              {JOURS} · {PLAGE}
            </span>
            <a className="lnk" href="/studio">
              Le studio
            </a>
            <a className="lnk" href="/mentions-legales">
              Mentions légales
            </a>
            <a className="lnk" href="/confidentialite">
              Confidentialité
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
