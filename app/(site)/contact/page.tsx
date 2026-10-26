import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import ContactForm from "@/components/ContactForm";
import { MENTION_REPONSE } from "@/lib/mentions";
import {
  CONTACT,
  HORAIRES,
  LANGUES,
  NAP_CONFIRME,
  SITE_NAME,
  SITE_URL,
  alternatesPage,
  jsonLd,
  openGraphPage,
  whatsappHref,
} from "@/lib/site";

/**
 * /contact — LES CHEMINS POUR JOINDRE LE STUDIO, ET CE QUE CHACUN SERT.
 *
 * POURQUOI CETTE PAGE EXISTE. Le contact vivait uniquement en pied de page,
 * derriere toute la longueur de l accueil : deux boutons et un formulaire, sans
 * un mot sur ce qui distingue les canaux. Un visiteur qui cherche « comment le
 * joindre » n avait aucune page a atteindre.
 *
 * AUCUNE COORDONNEE N EST ECRITE EN DUR. Telephone, WhatsApp, l adresse et les
 * horaires viennent tous de lib/site.ts, qui est la source unique : pour un
 * commerce local, la coherence du triplet nom / adresse / telephone est le
 * premier signal de referencement local, et deux graphies du meme numero sur
 * deux pages suffisent a brouiller le rapprochement avec la fiche Google. Une
 * valeur recopiee ici serait exactement la divergence que ce fichier existe
 * pour empecher.
 *
 * UNE SEULE ADRESSE EST MISE EN AVANT, ET C EST `CONTACT.email` — depuis le
 * 25 octobre 2026 la seule du site, contact@ (voir lib/site.ts).
 * La page en ouvrait DEUX et expliquait comment choisir — « si vous hesitez
 * entre les deux adresses, c est celle-ci ». On demandait donc un arbitrage au
 * visiteur a l instant precis ou il voulait ecrire, et cet arbitrage ne servait
 * que le studio : la boite generale existe pour que le tout-venant ne noie pas
 * les demandes de demo, ce qui est un probleme de tri interne, pas une
 * question que le lecteur ait a trancher. Une demande de demo arrive au bon
 * endroit du premier coup ; les autres sont rares.
 * La seconde boite (ayoub@) a ete retiree du site le 25 octobre 2026 : les
 * pages legales, le pied de page et cette page ecrivent la meme adresse.
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
 * repond ? ». Il est IMPORTE de lib/mentions.ts (`MENTION_REPONSE`) et non
 * recopie — le guide de voix impose une seule formulation, au caractere pres,
 * et une chaine recopiee finit toujours par deriver d un mot.
 *
 * AUCUN MONTANT ICI, donc aucune mention de TVA a porter : le seul prix du
 * site (la mise en place) vit en base, lu par lib/catalogue.ts. La page ne lit
 * pas Postgres — `next build` passe base eteinte.
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
 *
 * `alternates` PASSE PAR `alternatesPage` DEPUIS QUE LA JUMELLE ANGLAISE
 * EXISTE. La canonique ne bouge pas ; la fonction AJOUTE les `hreflang`, et
 * LES DEUX SENS SONT OBLIGATOIRES — une page anglaise qui declare sa jumelle
 * francaise sans que celle-ci lui rende la pareille voit son groupe ignore par
 * Google, et les deux versions se remettent a se concurrencer. `en-CH` n est
 * emis que si ce chemin figure dans `CHEMINS_TRADUITS` (lib/i18n.ts) :
 * annoncer une jumelle qui repond 404 est pire que de ne rien annoncer.
 */
/**
 * TITRE ET DESCRIPTION DE L AUDIT CRO/SEO DU 25.10.2026 (§4.4,
 * docs/agents/reviews/audit-cro-seo-2026-10-25.md). Le titre est
 * `absolute` : il tient ses 60 signes sans le suffixe « — Nawa Corps » du
 * `template`, qui l aurait fait deborder (ou, pour /contact, aurait ecrit la
 * marque deux fois).
 */
const TITRE = "Contacter Nawa Corps à Genève : téléphone, WhatsApp";
const DESCRIPTION =
  "Téléphone, WhatsApp, e-mail ou formulaire. Dites-nous votre métier et ce qui vous prend vos soirées. Réponse le jour ouvrable suivant.";

export const metadata: Metadata = {
  title: { absolute: TITRE },
  description: DESCRIPTION,
  alternates: alternatesPage("/contact"),
  openGraph: openGraphPage({
    titre: TITRE,
    description: DESCRIPTION,
    chemin: "/contact",
  }),
  twitter: {
    card: "summary_large_image",
    title: TITRE,
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
 * LE ContactPoint DIT LA MEME CHOSE QUE LA PAGE, et c est la regle : une
 * donnee structuree qui promet ce que l ecran ne montre pas finit ignoree.
 * Il y en avait deux — `sales` et `customer service`, une boite chacun. Le
 * second a ete retire EN MEME TEMPS que le second bloc d adresse de l ecran :
 * le declarer encore reviendrait a publier un canal que la page ne presente
 * plus. Depuis le 25.10.2026 le site n a plus qu une adresse (lib/site.ts).
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
              name: "Demandes de démo",
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
          ],
        }
      : {}),
  },
};

/**
 * L amorce de la page : celle de tout le site, `whatsappHref` (lib/site.ts),
 * qui demande la demo. Elle etait recopiee ici mot pour mot ; une seule
 * source suffit.
 */
const AMORCE_WHATSAPP = whatsappHref("fr");

export default function ContactPage() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(SCHEMA) }}
      />
      <SchemaPage
        fil={[
          { nom: "Accueil", chemin: "/" },
          { nom: "Contact", chemin: "/contact" },
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
              Quatre façons
              <br />
              de nous joindre.
            </h1>
          </div>

          <p className="lede" data-reveal>
            WhatsApp, téléphone, e-mail ou formulaire : tout arrive chez nous,
            au même endroit. Prenez celui qui vous arrange.
          </p>

          <div className="facts" data-reveal>
            <div>
              {/* Cliquable : un numero affiche se compose d un pouce. */}
              <b>
                <a href={`tel:${CONTACT.telephone}`}>{CONTACT.telephoneAffiche}</a>
              </b>
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
              Le plus direct. Deux lignes sur votre métier et sur ce qui vous
              prend vos soirées suffisent pour commencer.{" "}
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
              Si c&apos;est plus simple à dire qu&apos;à écrire. Le premier
              appel est court.{" "}
              <a className="lnk" href={`tel:${CONTACT.telephone}`}>
                {CONTACT.telephoneAffiche}
              </a>
              , {JOURS} de {PLAGE}.
            </p>

            {/* UNE SEULE ADRESSE, ET AUCUN ARBITRAGE DEMANDE. Un second bloc
                ouvrait une autre boite et une phrase expliquait laquelle
                choisir : c etait une question de tri interne posee au visiteur
                au moment exact ou il voulait ecrire. Depuis le 25.10.2026 il
                n existe plus qu une adresse sur tout le site (lib/site.ts). */}
            <h3 className="sm-grp">E-mail</h3>
            <p>
              Pour joindre une photo ou un document. Nous lisons vos e-mails
              aussi vite que WhatsApp.{" "}
              <a className="lnk" href={`mailto:${CONTACT.email}`}>
                Écrire à {CONTACT.email} →
              </a>
            </p>

            <h3 className="sm-grp">Le formulaire</h3>
            <p>
              Si vous préférez ne rien ouvrir d&apos;autre. Il est juste en
              dessous : votre nom, votre téléphone, deux lignes. Il arrive au
              même endroit que le reste : sur notre téléphone.
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
                Quatre lignes, et nous
                <br />
                préparons la démo.
              </h2>
            </div>
          </div>

          <p className="lede" data-reveal>
            Vous n&apos;avez rien à préparer. Ces quatre réponses nous évitent
            seulement une question de plus.
          </p>

          <ul className="prest-inc" data-reveal style={{ marginTop: 34 }}>
            <li>Votre métier.</li>
            <li>
              Comment arrivent vos demandes : téléphone, WhatsApp, e-mail,
              régies.
            </li>
            <li>Ce qui vous prend vos soirées, même en une phrase.</li>
            <li>Le meilleur moment pour vous rappeler.</li>
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
            Nawa Corps · Studio genevois
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
