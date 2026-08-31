import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import OuvrirDevis from "@/components/OuvrirDevis";
import SchemaPage from "@/components/SchemaPage";
import { chargerCatalogue, nomService } from "@/lib/catalogue";
import { resoudreDevis } from "@/lib/devis";
import { dictionnaire } from "@/lib/dictionnaires";
import {
  MENTION_DEVIS_COURTE_EN,
  MENTION_REPONSE_EN,
  MENTION_TVA_EN,
} from "@/lib/familles";
import { formatServicePrice, isQuote, mentionTva } from "@/lib/format";
import { lien, type Locale } from "@/lib/i18n";
import { SITE_NAME, alternatesPage, openGraphPage } from "@/lib/site";

/**
 * /en/devis — LE PARCOURS DE DEVIS, EN ANGLAIS.
 *
 * ELLE FAIT EXACTEMENT CE QUE FAIT SA JUMELLE FRANCAISE : elle est l'arrivee
 * des CTA « Ask for a quote », lit ce que le visiteur a clique (`?p=`), nomme
 * la prestation avec le nom et le prix LUS EN BASE, ouvre l'assistant deja
 * renseigne, et garde le formulaire juste en dessous.
 *
 * LE `?p=` EST LE MEME DANS LES DEUX LANGUES, et il le restera. C'est un
 * IDENTIFIANT — un slug de la table Service (« le-site ») ou un sujet de CTA
 * (« devis-imprimes ») —, pas une phrase : il part en base dans
 * `Lead.subject`, et le traduire ferait deux cles pour une seule conversation.
 * C'est `lib/devis.ts` qui sait le resoudre, et il recoit desormais la langue
 * en troisieme argument : le NOM affiche vient de `nameEn` quand la base en
 * porte un, l'amorce WhatsApp de `amorceEn`.
 *
 * >>> LES TROIS FORMULES GARDENT LEUR NOM FRANCAIS, ET C'EST VOULU. <<<
 * `La Vitrine`, `Le Site` et `L'Assistant` ont `nameEn = null` en base
 * DELIBEREMENT : ce sont des noms propres, article compris (glossaire §5).
 * `nomService` retombe alors sur le francais, ce qui est ici le comportement
 * correct — pas un trou de traduction a boucher.
 *
 * DEUX CHEMINS, ET C'EST VOULU. L'assistant est le chemin principal, mais il
 * depend d'un modele distant plafonne a quelques requetes par minute
 * (lib/llm.ts) : le formulaire est donc rendu COTE SERVEUR, toujours, sous
 * l'assistant — il n'attend ni JavaScript ni modele, et il porte le meme sujet
 * en champ cache. Quel que soit le chemin, la demande arrive nommee.
 *
 * `?p` NE PEUT PAS FAIRE ECHOUER LA PAGE. Absent, inconnu, en double, trop
 * long : lib/devis.ts rend une demande sans prestation nommee et la page
 * s'ouvre quand meme. Un 404 sur un parcours de devis est une demande perdue.
 *
 * AUCUN PRIX SANS « VAT included », DANS LA MEME UNITE DE LECTURE. C'est la
 * regle du depot (CLAUDE.md, Interdits) et le glossaire §5 la reprend mot pour
 * mot en anglais : en cas de doute, on retire le prix plutot que la mention.
 * Une prestation « on request » n'affiche aucun chiffre — elle affiche la
 * raison du devis, reprise telle quelle de lib/familles.ts.
 *
 * LES MONTANTS GARDENT LEUR FORMAT SUISSE — `699.–`, `1'499.–`, apostrophe de
 * milliers et suffixe `.–`. Ni `CHF 699`, ni `699 CHF`, ni `€` : c'est
 * `formatServicePrice` qui s'en charge, et il ne change que les MOTS d'une
 * langue a l'autre.
 *
 * ZERO CSS NOUVEAU : .wrap, .sec-head, .meta, .index, h1.t / h2.t, .lede,
 * .facts, .studio-txt, .prest-inc, .c-row, .btn, .lnk.
 *
 * PAS DE next/link : Interactions.tsx ne s'initialise qu'une fois (B7).
 */

/** La langue de cette page. TOUS ses liens internes passent par `lien`. */
const LOCALE: Locale = "en";

/** Le chemin SANS prefixe : c'est `lien` et `alternatesPage` qui posent `/en`. */
const CHEMIN = "/devis";

const t = dictionnaire(LOCALE);

/**
 * « Geneva » — lu dans le dictionnaire anglais plutot que reecrit ici.
 * `CONTACT.ville` (lib/site.ts) vaut « Genève » : c'est le NAP, et ouvrir une
 * seconde graphie de la ville dans ce fichier serait exactement ce que la
 * source unique existe pour empecher.
 */
const VILLE = t.nav.horlogeVille;

/**
 * LA MENTION LONGUE EST IMPORTEE, ET NON PLUS ASSEMBLEE ICI.
 *
 * Elle a vecu quelques jours dans ce fichier, sous le meme nom, faute d'avoir
 * la main sur lib/familles.ts. C'etait la seconde graphie d'une mention a
 * VALEUR LEGALE, ecrite loin de sa jumelle francaise `MENTION_TVA` — dont le
 * docblock annoncait mot pour mot la forme attendue. Les deux vivent
 * desormais cote a cote dans lib/familles.ts, et `MENTION_TVA_EN` s'y
 * construit depuis `mentionTva("en")` (lib/format.ts) : les deux mots qui
 * portent l'obligation ne s'ecrivent toujours qu'a un seul endroit.
 */

const TITRE = "Ask for a quote";
const DESCRIPTION =
  "Describe what you need to the assistant, or fill in the form: both land in the same place, with us, in Geneva. A reply the next working day.";

/**
 * La canonique est `/en/devis` NU, sans le `?p=`.
 *
 * Douze CTA menent ici avec douze parametres differents : autant d'URL pour
 * une seule page, et c'est exactement ce que la canonique existe pour
 * dissoudre. Le `twitter` est redeclare EN ENTIER pour la meme raison que
 * partout ailleurs — la fusion des metadata de Next ne descend pas dans les
 * objets, et un bloc partiel ferait porter a cette page le titre de l'accueil.
 */
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
 * `searchParams` EST UNE PROMESSE depuis Next 15, et il faut l'attendre — voir
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md.
 * Le type est ecrit a la main plutot que via le helper global `PageProps<…>` :
 * celui-ci est genere a partir des routes connues du dernier build, et une
 * route qui vient d'etre creee n'y figure pas encore — `npm run typecheck`
 * echouerait sur une page pourtant correcte.
 *
 * Le lire opte cette page dans le rendu DYNAMIQUE, ce qui est ici la bonne
 * reponse : la page depend de la requete, et elle lit Postgres pour resoudre
 * un prix. Un prix perime a l'ecran coute plus cher qu'un rendu statique
 * gagne — meme arbitrage qu'en tete de lib/catalogue.ts.
 */
export default async function DevisEn({
  searchParams,
}: {
  searchParams: Promise<{ [cle: string]: string | string[] | undefined }>;
}) {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  const { p } = await searchParams;

  // Le catalogue ENTIER, et non une requete ciblee : lib/catalogue.ts memoise
  // la lecture par requete, et `p` peut designer n'importe laquelle des
  // dix-huit lignes comme aucune.
  const catalogue = await chargerCatalogue();
  const demande = resoudreDevis(p, catalogue, LOCALE);

  const service = demande.service;
  const surDevis = service !== null && isQuote(service);

  return (
    <>
      <SchemaPage
        locale={LOCALE}
        fil={[
          { nom: "Home", chemin: lien(LOCALE, "/") },
          { nom: TITRE, chemin: lien(LOCALE, CHEMIN) },
        ]}
      />

      {/* L'assistant s'ouvre au montage, deja renseigne. Il ne rend rien :
          voir components/OuvrirDevis.tsx. LE NOM QU'IL RECOIT EST DEJA DANS LA
          BONNE LANGUE — c'est `resoudreDevis(p, catalogue, "en")` qui l'a
          resolu en base. Le message d'accueil de l'assistant lui-meme reste
          francais tant que components/ChatWidget.tsx n'a pas sa langue ; c'est
          un chantier a part, et il est signale. */}
      <OuvrirDevis
        sujet={demande.sujet ?? undefined}
        libelle={demande.libelle ?? undefined}
      />

      {/* ---------- Ce sur quoi porte la demande ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              Quote
            </span>
            {/* Interactions.tsx decoupe h1.t sur ses <br> et lui pose lui-meme
                son [data-reveal] : ne pas en ecrire un a la main. */}
            <h1 className="t">
              Say what you
              <br />
              need.
            </h1>
          </div>

          <p className="lede" data-reveal>
            {demande.libelle
              ? `Your enquiry is about “${demande.libelle}”. The assistant opens with that information: it asks the questions that are missing, and nothing else.`
              : "The assistant opens at the bottom of the screen: describe what you need in two or three sentences, and it asks the questions that are missing. If you would rather write it all at once, the form is just below."}
          </p>

          {/* LE NOM ET LE PRIX VIENNENT DE POSTGRES, jamais de cette page. La
              mention « VAT included » est la LEGENDE du montant, dans la meme
              unite de lecture : c'est la regle du depot, et elle ne se delegue
              pas a une note de bas de page. Sous « on request », elle ne
              voudrait rien dire — la cellule n'est alors pas rendue du tout. */}
          {service ? (
            <div className="facts" data-reveal>
              <div>
                <b>{nomService(service, LOCALE)}</b>
                <span>Your enquiry</span>
              </div>
              {surDevis ? null : (
                <div>
                  <b>{formatServicePrice(service, LOCALE)}</b>
                  <span>{mentionTva(LOCALE)}</span>
                </div>
              )}
              <div>
                <b>{VILLE}</b>
                <span>And the surrounding region</span>
              </div>
            </div>
          ) : demande.libelle ? (
            <div className="facts" data-reveal>
              <div>
                <b>{demande.libelle}</b>
                <span>Your enquiry</span>
              </div>
              <div>
                <b>{VILLE}</b>
                <span>And the surrounding region</span>
              </div>
            </div>
          ) : null}

          {/* POURQUOI CETTE LIGNE N'A PAS DE PRIX. La phrase est celle de
              lib/familles.ts, reprise telle quelle : deux formulations
              anglaises du meme argument divergeraient a la premiere
              correction. */}
          {surDevis ? (
            <p className="meta" data-reveal style={{ marginTop: 22, maxWidth: "62ch" }}>
              {MENTION_DEVIS_COURTE_EN}
            </p>
          ) : null}
          {service && !surDevis ? (
            <p className="meta" data-reveal style={{ marginTop: 22 }}>
              {MENTION_TVA_EN}
            </p>
          ) : null}
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
                Four lines, and we
                <br />
                can already price it.
              </h2>
            </div>
          </div>

          <div className="studio-txt" data-reveal>
            <p>
              You have nothing to prepare: we take what is already online. These
              four things, given straight away, only stop the first reply being
              one more question.
            </p>
          </div>

          <ul className="prest-inc" data-reveal style={{ marginTop: 26 }}>
            <li>
              The address of your current site, if there is one. That is where
              we take your words from.
            </li>
            <li>
              Your trade and the area you cover: a garage and an accountancy
              firm do not have the same pages.
            </li>
            <li>What you want to receive: quotes, appointments, calls.</li>
            <li>Your deadline, if you have one.</li>
          </ul>

          {/* LE FORMULAIRE EST LE FILET DE L'ASSISTANT, ET IL EST RENDU COTE
              SERVEUR. Il part avec le meme sujet en champ cache — la demande
              arrive nommee par les deux chemins. */}
          {/* L ANCRE `#formulaire` EST LUE PAR L ASSISTANT. Quand il tombe, son
              message de repli renvoie ici — voir components/ChatWidget.tsx.
              LE NOM DE L ANCRE NE SE TRADUIT PAS : le widget la cherche telle
              quelle, et une ancre `#form` sur la seule page anglaise le ferait
              retomber sur l accueil, c est-a-dire faire perdre au visiteur sa
              place ET le sujet de sa demande. */}
          <div id="formulaire" data-reveal>
            <p className="meta" style={{ marginTop: 40 }}>
              {MENTION_REPONSE_EN}
            </p>
            <ContactForm subject={demande.sujet ?? undefined} locale={LOCALE} />
          </div>

          {/* Le troisieme chemin, pour qui ne veut ni bulle ni formulaire.
              L'amorce est celle du bouton d'ou vient le visiteur, dans sa
              langue quand lib/formules.ts ou lib/familles.ts en portent une
              (lib/devis.ts). */}
          <div className="c-row" data-reveal>
            <a className="btn btn-line" href={demande.amorce} target="_blank" rel="noopener">
              Message us on WhatsApp
            </a>
            <a className="btn btn-line" href={lien(LOCALE, "/services")}>
              See all the services
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
