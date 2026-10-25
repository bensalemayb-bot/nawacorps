import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import { estBrouillon, robotsSiBrouillon } from "@/lib/brouillon";
import { lireMiseEnPlace } from "@/lib/catalogue";
import { mentionTva } from "@/lib/format";
import { type Locale, lien } from "@/lib/i18n";
import { CONTACT, EXPLOITANT, SITE_NAME, alternatesPage, openGraphPage } from "@/lib/site";

/**
 * /cgv — CONDITIONS GENERALES DE VENTE, B2B. Creee le 25 octobre 2026.
 *
 * LE CONTRAT SE CONCLUT HORS DU SITE. Nawa Corps ne vend rien en ligne : le
 * client recoit une offre ecrite, ces CGV l accompagnent, et c est son
 * acceptation ecrite de l offre qui forme le contrat. D ou l absence de case
 * a cocher, ici comme dans les formulaires : il n y a rien a accepter sur le
 * site. La page existe pour que les conditions soient publiques, stables et
 * citables par l offre (« CGV, version du 25 octobre 2026 »).
 *
 * B2B UNIQUEMENT. Les clauses de responsabilite et de for sont ecrites pour
 * des entreprises ; elles ne seraient pas toutes valables face a un
 * consommateur (CPC art. 32, LCD art. 8). Le site ne s adresse pas aux
 * consommateurs, et l article 1 le dit.
 *
 * LE PRIX DE LA MISE EN PLACE EST LU EN BASE, comme partout (lib/catalogue.ts,
 * `lireMiseEnPlace`) : jamais ecrit en dur ici. Base injoignable ou ligne
 * masquee, l article se referme sur « selon l offre ecrite », sans chiffre.
 * D ou `force-dynamic` : un prix corrige depuis /admin doit se lire ici a la
 * requete suivante.
 *
 * UNE PROMESSE COMMERCIALE EST ECRITE A L ARTICLE 10 : l hebergement en Suisse
 * des donnees de l assistant livre au client. Elle a ete decidee par Ayoub
 * (.agents/product-marketing.md, « Prix et donnees ») ; elle ne vaut ni pour
 * ce site (Vercel, Francfort) ni pour Leo. Tant que l hebergement suisse
 * n est pas en place, cette clause est un engagement a tenir, pas un fait —
 * voir docs/legal/CONFORMITE-2026-10-25.md.
 *
 * LES DEUX LANGUES VIVENT ICI, comme pour /services : app/(site)/en/cgv
 * importe `corpsCgv` et `metadataCgv`. La version francaise fait foi, et
 * l anglaise le dit.
 *
 * MEME GABARIT QUE LES PAGES LEGALES : .wrap, .sec-head, h1.t, .studio-txt,
 * .meta pour les intitules — zero CSS nouveau, aucun [data-reveal] a la main,
 * aucun <h3> nu.
 */
export const dynamic = "force-dynamic";

/** Le chemin SANS prefixe : `lien` et `alternatesPage` posent `/en`. */
const CHEMIN = "/cgv";

type Article = { titre: string; paragraphes: readonly string[] };

type Textes = {
  titre: string;
  seoDescription: string;
  fil: { accueil: string };
  meta: string;
  version: string;
  /** Uniquement en anglais : la version francaise fait foi. */
  avertissement: string | null;
  /** Gabarit : {montant} et {tva}. */
  prixAvec: string;
  prixSans: string;
  articles: readonly Article[];
  renvoiDebut: string;
  renvoiConfidentialite: string;
  renvoiMilieu: string;
  renvoiMentions: string;
  renvoiFin: string;
  retour: string;
};

/**
 * LES JETONS DES ARTICLES, remplis par `remplir()` :
 * {titulaire}, {nom}, {adresse}, {email} — l identite, depuis lib/site.ts ;
 * {prix} — la phrase du prix de la mise en place, avec ou sans montant.
 */
const TEXTES: Record<Locale, Textes> = {
  fr: {
    titre: "Conditions générales de vente",
    seoDescription:
      "CGV de Nawa Corps (B2B) : démo, essai, mise en place, abonnement, prix, paiement, résiliation, données et droit applicable.",
    fil: { accueil: "Accueil" },
    meta: "Nawa Corps · B2B",
    version: "Version du 25 octobre 2026.",
    avertissement: null,
    prixAvec:
      "La mise en place coûte {montant} (francs suisses), {tva}. Ce montant est le prix final : aucune taxe ne s'y ajoute.",
    prixSans:
      "Le prix de la mise en place figure dans l'offre écrite, en francs suisses, sans TVA (entreprise non assujettie).",
    articles: [
      {
        titre: "1. Parties et champ d'application",
        paragraphes: [
          "Les présentes conditions générales (CGV) régissent les prestations de {nom}, raison individuelle de {titulaire}, {adresse} (ci-après « Nawa Corps »), à ses clients.",
          "Nawa Corps travaille exclusivement avec des entreprises (artisans, sociétés, indépendants agissant pour leur activité professionnelle). Elle ne contracte pas avec des consommateurs.",
          "Le contrat se conclut hors du site : Nawa Corps remet au client une offre écrite accompagnée des présentes CGV, et le contrat naît de l'acceptation écrite de cette offre par le client (un e-mail suffit). L'offre prime sur les CGV en cas de divergence. Les conditions générales du client ne s'appliquent pas, sauf accord écrit.",
        ],
      },
      {
        titre: "2. Prestations",
        paragraphes: [
          "La démo : Nawa Corps montre l'assistant à l'œuvre sur des demandes types du métier du client. Le client n'a rien à préparer ni à transmettre. Elle ne demande aucun accès aux outils du client et ne coûte rien.",
          "L'essai : l'assistant travaille sur les vraies demandes que le client lui confie, pendant deux semaines, sauf autre durée convenue par écrit dans l'offre. Le client reçoit un relevé chaque lundi. L'essai ne coûte rien.",
          "La mise en place : Nawa Corps règle l'assistant sur le métier et l'entreprise du client.",
          "L'abonnement : Nawa Corps exploite, héberge et suit l'assistant chaque semaine. Son contenu et le volume couvert sont décrits dans l'offre écrite.",
        ],
      },
      {
        titre: "3. Prix",
        paragraphes: [
          "{prix}",
          "L'abonnement mensuel a un prix fixe, celui du palier choisi selon le volume du client (grille publiée sur le site), indiqué dans l'offre écrite à la fin de la démo, avant l'essai.",
          "Nawa Corps n'est pas assujettie à la TVA. Si elle le devenait, la TVA s'ajouterait aux prix à compter de son assujettissement, après information écrite du client.",
        ],
      },
      {
        titre: "4. Essai et paiement de la mise en place",
        paragraphes: [
          "La mise en place n'est due qu'à la fin de l'essai, et seulement si le client confirme par écrit que le relevé lui convient. Cette confirmation ouvre l'abonnement.",
          "Si le client ne confirme pas, rien n'est dû : l'assistant est désactivé, et les données confiées pendant l'essai sont restituées sur demande puis effacées (article 10).",
        ],
      },
      {
        titre: "5. Facturation et paiement",
        paragraphes: [
          "La mise en place est facturée à la confirmation de l'article 4. L'abonnement est facturé chaque mois, au début du mois.",
          "Les factures sont payables à 30 jours dès leur date. À l'échéance, le client est en demeure sans autre avis et doit un intérêt moratoire de 5 % l'an (art. 104 CO).",
          "Si une facture reste impayée dix jours après un rappel écrit, Nawa Corps peut suspendre l'assistant jusqu'au paiement.",
        ],
      },
      {
        titre: "6. Durée et résiliation de l'abonnement",
        paragraphes: [
          "L'abonnement est conclu pour une durée indéterminée, sans durée minimale.",
          "Il est sans engagement et résiliable chaque mois : chaque partie peut le résilier par écrit (un e-mail suffit), avec effet à la fin du mois en cours. La résiliation immédiate pour justes motifs est réservée.",
          "À la fin de l'abonnement, l'assistant est désactivé. Le client peut demander l'export de ses données dans les 30 jours ; elles sont ensuite effacées.",
        ],
      },
      {
        titre: "7. Obligations du client",
        paragraphes: [
          "Le client désigne un interlocuteur, fournit des informations exactes sur son métier et ses tarifs, et relit ce que l'assistant lui soumet.",
          "Il garantit qu'il a le droit de confier à Nawa Corps les données qu'il lui transmet, et il informe ses propres clients du traitement de leurs données, notamment dans sa déclaration de confidentialité.",
          "Il ne confie à l'assistant aucune donnée sensible qui ne serait pas nécessaire à la tâche convenue.",
        ],
      },
      {
        titre: "8. Contrôle : l'assistant ne s'engage jamais à la place du client",
        paragraphes: [
          "Aucun prix, aucune date, aucun devis et aucune réponse de fond ne part sans la validation du client. Un seul message part seul : l'accusé de réception qui demande l'adresse, une photo et l'urgence, que le client a relu et validé une fois.",
          "L'assistant n'a pas accès aux paiements du client. Le client reste seul responsable de ce qu'il valide et des engagements qu'il prend envers ses propres clients.",
        ],
      },
      {
        titre: "9. Responsabilité",
        paragraphes: [
          "Nawa Corps exécute ses prestations avec soin. Un assistant fondé sur l'intelligence artificielle peut se tromper : c'est la raison de la validation prévue à l'article 8.",
          "Dans les limites de l'article 100 CO, la responsabilité de Nawa Corps est exclue pour la négligence légère ; elle n'est jamais exclue pour le dol ou la faute grave. Dans les autres cas, elle est limitée au montant payé par le client au cours des douze derniers mois.",
          "Sous la même réserve, Nawa Corps ne répond ni des dommages indirects ou du gain manqué, ni des interruptions des services de tiers dont l'assistant dépend (fournisseurs d'IA, messageries, hébergeurs), ni des cas de force majeure.",
        ],
      },
      {
        titre: "10. Données personnelles et sous-traitance",
        paragraphes: [
          "Pour faire fonctionner l'assistant, Nawa Corps traite les données des clients du client pour le compte de celui-ci, au sens de l'article 9 de la loi fédérale sur la protection des données (nLPD). Le client reste responsable du traitement.",
          "Nawa Corps traite ces données uniquement pour exécuter le contrat et selon les instructions du client ; elle en garde la confidentialité, les protège par des mesures de sécurité adaptées, aide le client à répondre aux demandes des personnes concernées, l'informe sans délai d'une violation de la sécurité des données, et ne fait appel à un autre sous-traitant qu'avec son accord préalable.",
          "Les données de l'assistant du client sont hébergées en Suisse.",
          "À la fin du contrat, Nawa Corps restitue les données sur demande, puis les efface. Un accord de sous-traitance détaillé peut compléter l'offre ; il prime alors sur cet article. Les données de l'interlocuteur du client sont traitées selon la politique de confidentialité du site.",
        ],
      },
      {
        titre: "11. Propriété intellectuelle",
        paragraphes: [
          "Nawa Corps reste titulaire de l'assistant, de ses réglages, de ses bases métier et de ses outils. Le client reçoit, pour la durée de l'abonnement, un droit d'utilisation non exclusif et non transmissible.",
          "Le client reste titulaire de ses données et de ses contenus, qu'il récupère à la fin du contrat (article 6).",
        ],
      },
      {
        titre: "12. Confidentialité et références",
        paragraphes: [
          "Chaque partie garde confidentielles les informations non publiques de l'autre, pendant le contrat et deux ans après sa fin.",
          "Nawa Corps ne cite le client comme référence qu'avec son accord écrit.",
        ],
      },
      {
        titre: "13. Modification des CGV",
        paragraphes: [
          "Nawa Corps peut modifier ces CGV. La version applicable est celle remise avec l'offre. Pour un abonnement en cours, une nouvelle version est communiquée par écrit 30 jours avant son entrée en vigueur ; le client qui la refuse peut résilier avant cette date, sans préavis.",
          "Si une clause se révélait nulle, les autres restent valables, et la clause nulle est remplacée par celle qui s'approche le plus de son but.",
        ],
      },
      {
        titre: "14. Droit applicable et for",
        paragraphes: [
          "Le contrat est soumis au droit suisse, à l'exclusion de la Convention de Vienne sur la vente internationale de marchandises.",
          "Le for exclusif est à Genève.",
        ],
      },
    ],
    renvoiDebut: "Voir aussi la ",
    renvoiConfidentialite: "politique de confidentialité",
    renvoiMilieu: " et les ",
    renvoiMentions: "mentions légales",
    renvoiFin: `. Questions : {email}.`,
    retour: "← Retour au site",
  },
  en: {
    titre: "General terms and conditions",
    seoDescription:
      "Nawa Corps general terms and conditions (B2B): the assistant's demo, trial, set-up and subscription, prices, payment, termination, data and governing law.",
    fil: { accueil: "Home" },
    meta: "Nawa Corps · B2B",
    version: "Version of 25 October 2026.",
    avertissement:
      "This is a translation. The French version is the only binding one.",
    prixAvec:
      "The set-up costs {montant} (Swiss francs), {tva}. This amount is the final price: no tax is added to it.",
    prixSans:
      "The price of the set-up is stated in the written offer, in Swiss francs, without VAT (business not VAT-registered).",
    articles: [
      {
        titre: "1. Parties and scope",
        paragraphes: [
          "These general terms and conditions (GTC) govern the services of {nom}, the sole proprietorship of {titulaire}, {adresse} (hereinafter “Nawa Corps”), to its customers.",
          "Nawa Corps works exclusively with businesses (tradespeople, companies, self-employed people acting for their business). It does not contract with consumers.",
          "The contract is concluded off the site: Nawa Corps gives the customer a written offer together with these GTC, and the contract is formed when the customer accepts that offer in writing (an email is enough). The offer prevails over the GTC if they differ. The customer's own terms and conditions do not apply, unless agreed in writing.",
        ],
      },
      {
        titre: "2. Services",
        paragraphes: [
          "The demo: Nawa Corps shows the assistant at work on typical enquiries from the customer's trade. The customer has nothing to prepare or send. It requires no access to the customer's tools and costs nothing.",
          "The trial: the assistant works on the real enquiries the customer entrusts to it, for two weeks, unless another period is agreed in writing in the offer. The customer receives a report every Monday. The trial costs nothing.",
          "The set-up: Nawa Corps sets the assistant to the customer's trade and business.",
          "The subscription: Nawa Corps runs, hosts and looks after the assistant every week. Its content and the volume covered are described in the written offer.",
        ],
      },
      {
        titre: "3. Prices",
        paragraphes: [
          "{prix}",
          "The monthly subscription has a fixed price, that of the tier chosen for the customer's volume (grid published on the site), stated in the written offer at the end of the demo, before the trial.",
          "Nawa Corps is not registered for VAT. Should it become so, VAT would be added to the prices from the date of registration, after written notice to the customer.",
        ],
      },
      {
        titre: "4. Trial and payment of the set-up",
        paragraphes: [
          "The set-up is only due at the end of the trial, and only if the customer confirms in writing that the report suits them. This confirmation starts the subscription.",
          "If the customer does not confirm, nothing is due: the assistant is switched off, and the data entrusted during the trial is returned on request, then deleted (article 10).",
        ],
      },
      {
        titre: "5. Invoicing and payment",
        paragraphes: [
          "The set-up is invoiced on the confirmation under article 4. The subscription is invoiced every month, at the start of the month.",
          "Invoices are payable within 30 days of their date. On the due date, the customer is in default without further notice and owes default interest of 5% a year (Art. 104 of the Swiss Code of Obligations).",
          "If an invoice remains unpaid ten days after a written reminder, Nawa Corps may suspend the assistant until payment.",
        ],
      },
      {
        titre: "6. Term and termination of the subscription",
        paragraphes: [
          "The subscription is concluded for an indefinite period, with no minimum term.",
          "It carries no commitment and can be cancelled every month: either party may terminate it in writing (an email is enough), effective at the end of the current month. Immediate termination for good cause is reserved.",
          "When the subscription ends, the assistant is switched off. The customer may ask for an export of their data within 30 days; it is then deleted.",
        ],
      },
      {
        titre: "7. The customer's obligations",
        paragraphes: [
          "The customer appoints a contact person, provides accurate information about their trade and rates, and reviews what the assistant submits to them.",
          "They warrant that they are entitled to entrust Nawa Corps with the data they pass on, and they inform their own customers of the processing of their data, in particular in their privacy notice.",
          "They do not entrust the assistant with any sensitive data that is not needed for the agreed task.",
        ],
      },
      {
        titre: "8. Control: the assistant never commits on the customer's behalf",
        paragraphes: [
          "No price, no date, no quote and no substantive reply goes out without the customer's approval. Only one message goes out on its own: the acknowledgement asking for the address, a photo and the urgency, which the customer has read and approved once.",
          "The assistant has no access to the customer's payments. The customer alone is responsible for what they approve and for the commitments they make to their own customers.",
        ],
      },
      {
        titre: "9. Liability",
        paragraphes: [
          "Nawa Corps performs its services with care. An assistant based on artificial intelligence can make mistakes: that is the reason for the approval set out in article 8.",
          "Within the limits of Art. 100 of the Swiss Code of Obligations, Nawa Corps' liability is excluded for slight negligence; it is never excluded for intent or gross negligence. In other cases, it is limited to the amount paid by the customer over the last twelve months.",
          "Subject to the same reservation, Nawa Corps is not liable for indirect damage or loss of profit, for interruptions of the third-party services the assistant depends on (AI providers, messaging services, hosts), or for force majeure.",
        ],
      },
      {
        titre: "10. Personal data and processing on behalf",
        paragraphes: [
          "To run the assistant, Nawa Corps processes the data of the customer's own customers on the customer's behalf, within the meaning of Art. 9 of the Swiss Federal Act on Data Protection (nFADP). The customer remains the controller.",
          "Nawa Corps processes this data only to perform the contract and on the customer's instructions; it keeps it confidential, protects it with appropriate security measures, helps the customer answer requests from the data subjects, informs the customer without delay of any data security breach, and only uses another processor with the customer's prior consent.",
          "The data of the customer's assistant is hosted in Switzerland.",
          "At the end of the contract, Nawa Corps returns the data on request, then deletes it. A detailed data processing agreement may supplement the offer; it then prevails over this article. The data of the customer's contact person is processed under the site's privacy policy.",
        ],
      },
      {
        titre: "11. Intellectual property",
        paragraphes: [
          "Nawa Corps remains the owner of the assistant, its settings, its trade knowledge bases and its tools. For the duration of the subscription, the customer receives a non-exclusive, non-transferable right of use.",
          "The customer remains the owner of their data and content, which they recover at the end of the contract (article 6).",
        ],
      },
      {
        titre: "12. Confidentiality and references",
        paragraphes: [
          "Each party keeps the other's non-public information confidential, during the contract and for two years after it ends.",
          "Nawa Corps only names the customer as a reference with their written consent.",
        ],
      },
      {
        titre: "13. Changes to the GTC",
        paragraphes: [
          "Nawa Corps may amend these GTC. The applicable version is the one given with the offer. For a subscription in progress, a new version is notified in writing 30 days before it takes effect; a customer who refuses it may terminate before that date, without notice.",
          "Should a clause prove void, the others remain valid, and the void clause is replaced by the one closest to its purpose.",
        ],
      },
      {
        titre: "14. Governing law and jurisdiction",
        paragraphes: [
          "The contract is governed by Swiss law, excluding the Vienna Convention on Contracts for the International Sale of Goods.",
          "The exclusive place of jurisdiction is Geneva.",
        ],
      },
    ],
    renvoiDebut: "See also the ",
    renvoiConfidentialite: "privacy policy",
    renvoiMilieu: " and the ",
    renvoiMentions: "legal notice",
    renvoiFin: `. Questions: {email}.`,
    retour: "← Back to the site",
  },
};

/** Pose l identite (lib/site.ts) et la phrase du prix dans un article. */
function remplir(texte: string, locale: Locale, prix: string): string {
  return texte
    .replaceAll("{titulaire}", EXPLOITANT.titulaire)
    .replaceAll("{nom}", EXPLOITANT.nomCommercial)
    .replaceAll("{adresse}", locale === "en" ? EXPLOITANT.adresseEn : EXPLOITANT.adresse)
    .replaceAll("{email}", CONTACT.email)
    .replaceAll("{prix}", prix);
}

/**
 * BROUILLON TANT QU UN MARQUEUR RESTE (lib/brouillon.ts), calcule sur les
 * textes de la langue, identite de lib/site.ts posee (l adresse porte le sien
 * tant qu elle n est pas remplie). Le prix n y joue aucun role : il est
 * remplace par une chaine vide. Lu par `metadataCgv` et par app/sitemap.ts.
 */
export function cgvEstBrouillon(locale: Locale): boolean {
  const t = TEXTES[locale];
  return estBrouillon(
    t,
    t.articles.map((a) => a.paragraphes.map((p) => remplir(p, locale, ""))),
  );
}

/**
 * Metadonnees des deux pages. Le bloc `twitter` est redeclare en entier :
 * Next ne fusionne pas les objets, une page sans le sien heriterait de celui
 * de l accueil.
 */
export function metadataCgv(locale: Locale): Metadata {
  const t = TEXTES[locale];
  const titreComplet = `${t.titre} — ${SITE_NAME}`;
  return {
    ...robotsSiBrouillon(cgvEstBrouillon(locale)),
    title: t.titre,
    description: t.seoDescription,
    alternates: alternatesPage(CHEMIN, locale),
    openGraph: openGraphPage(
      { titre: titreComplet, description: t.seoDescription, chemin: CHEMIN },
      locale,
    ),
    twitter: {
      card: "summary_large_image",
      title: titreComplet,
      description: t.seoDescription,
    },
  };
}

export const metadata: Metadata = metadataCgv("fr");

export async function corpsCgv(locale: Locale) {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  const t = TEXTES[locale];
  const montant = await lireMiseEnPlace();
  // Le montant ne voyage jamais sans sa mention de TVA (lib/format.ts).
  const prix = montant
    ? t.prixAvec.replaceAll("{montant}", montant).replaceAll("{tva}", mentionTva(locale))
    : t.prixSans;

  return (
    <>
      <SchemaPage
        locale={locale}
        fil={[
          { nom: t.fil.accueil, chemin: lien(locale, "/") },
          { nom: t.titre, chemin: lien(locale, CHEMIN) },
        ]}
      />
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta">{t.meta}</span>
          </div>
          <h1 className="t">{t.titre}</h1>
          <div className="studio-txt" style={{ marginTop: 40 }}>
            <p>{t.version}</p>
            {t.avertissement ? <p>{t.avertissement}</p> : null}
            {t.articles.map((article) => (
              <div key={article.titre}>
                <p className="meta">{article.titre}</p>
                {article.paragraphes.map((p) => (
                  <p key={p}>{remplir(p, locale, prix)}</p>
                ))}
              </div>
            ))}
            <p style={{ marginTop: 40 }}>
              {t.renvoiDebut}
              <a className="lnk" href={lien(locale, "/confidentialite")}>{t.renvoiConfidentialite}</a>
              {t.renvoiMilieu}
              <a className="lnk" href={lien(locale, "/mentions-legales")}>{t.renvoiMentions}</a>
              {remplir(t.renvoiFin, locale, prix)}
            </p>
            <p style={{ marginTop: 40 }}>
              <a className="lnk" href={lien(locale, "/")}>{t.retour}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function Cgv() {
  return corpsCgv("fr");
}
