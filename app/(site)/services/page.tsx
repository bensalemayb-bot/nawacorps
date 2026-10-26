import type { Metadata } from "next";
import Detail from "@/components/Detail";
import FooterContact from "@/components/FooterContact";
import GrilleAbonnement from "@/components/GrilleAbonnement";
import SchemaPage from "@/components/SchemaPage";
import {
  avecPrix,
  lireCentsMiseEnPlace,
  lireMiseEnPlace,
  lirePaliers,
  offreMiseEnPlace,
  offresAbonnement,
} from "@/lib/catalogue";
import { cheminGuide } from "@/lib/guides";
import { CHEMIN_METIERS, METIERS, cheminMetier } from "@/lib/metiers";
import { MENTION_REPONSE, MENTION_REPONSE_EN } from "@/lib/mentions";
import { LANGUE_HTML, type Locale, lien } from "@/lib/i18n";
import {
  SITE_NAME,
  SITE_URL,
  alternatesPage,
  jsonLd,
  openGraphPage,
} from "@/lib/site";

/**
 * /services — « L'assistant, en détail » (copy : docs/agents/copy/services.md,
 * revue A tour 2, bloc 6).
 *
 * LA PAGE DE DETAIL DE L OFFRE UNIQUE. Depuis le 24.10.2026, le studio vend un
 * assistant IA pour les PME genevoises ; l ancien catalogue (formules de site,
 * imprimes, identite, restauration) est sorti de l offre et n est plus lu ici.
 *
 * LES MONTANTS SONT LUS EN BASE, ET SEULEMENT DANS LA SECTION (04) : la mise
 * en place (`lireMiseEnPlace`, lib/catalogue.ts) a l etape 3 du parcours, puis
 * la grille des trois paliers de l abonnement et l offre d introduction
 * (components/GrilleAbonnement, decision d Ayoub du 25.10.2026). Chaque
 * montant est suivi de la mention de TVA. Ligne absente, masquee ou base
 * injoignable : la phrase se lit sans montant, la grille disparait.
 *
 * CE FICHIER REND DEUX PAGES. `corpsServices(locale)` est appele par
 * `/services` en francais et par `/en/services` en anglais : une seule
 * structure, deux colonnes de textes dans `TEXTES`.
 */

// Rendu a chaque requete : le montant de l etape 3 vient de Postgres, et
// `next build` doit passer sans base joignable (etage builder du Dockerfile).
export const dynamic = "force-dynamic";

/** Le chemin sans prefixe de langue, source de la canonique et des hreflang. */
const CHEMIN = "/services";

type Item = { titre: string; texte: string };

type TextesServices = {
  seoTitre: string;
  /** ≤ 155 signes, SANS montant : la version chiffree depasse le budget. */
  seoDescription: string;
  meta: string;
  h1: readonly [string, string];
  /** Bloc-reponse autonome (< 60 mots) : qui, quoi, ou. */
  chapo: string;
  rienAPreparer: string;
  mentionReponse: string;
  gestes: { meta: string; h2: readonly [string, string]; items: readonly Item[] };
  /** Les cartes viennent de lib/metiers.ts ; ici, l en-tete et les liens. */
  metiers: {
    meta: string;
    h2: readonly [string, string];
    lede: string;
    lienCarte: string;
    tous: string;
  };
  controle: {
    meta: string;
    h2: readonly [string, string];
    points: readonly string[];
    pasPromisTitre: string;
    pasPromis: string;
    /**
     * Ce que mesurent les etudes, et pourquoi ce n est pas une promesse :
     * renvoie aux chiffres sources de l accueil (#chiffres), sans en recopier
     * aucun ici — une seule unite de lecture porte chiffre ET source.
     */
    etudes: string;
    etudesLien: string;
    /** Le libellé du bloc qui range « pas promis », les études et le guide. */
    detail: string;
  };
  parcours: {
    meta: string;
    h2: readonly [string, string];
    demo: Item;
    essai: Item;
    /**
     * LES LIGNES COURTES DES TROIS CARTES (26.10.2026, « moins d info, aussi
     * complet ») ; les textes entiers (`demo`, `essai`, `abonnementAvecPrix`)
     * et la note sont dans « Voir le détail ».
     */
    demoCourt: string;
    essaiCourt: string;
    abonnementTitre: string;
    /** Gabarits avec `{montant}` et `{tva}` (voir `avecPrix`). */
    abonnementCourtAvecPrix: string;
    abonnementCourtSansPrix: string;
    abonnementAvecPrix: string;
    abonnementSansPrix: string;
    note: string;
    detail: string;
  };
  cta: string;
  /**
   * LES GUIDES QUI PROLONGENT LA PAGE (audit SEO v5) : la nLPD sous le
   * controle, le prix sous le parcours. `null` en anglais : les guides
   * n existent qu en francais, et un lien anglais vers eux changerait de
   * langue sans prevenir.
   */
  guides: { donnees: string; prix: string } | null;
  /** Le nom de l Offer en donnee structuree. */
  offreNom: string;
  serviceNom: string;
  fil: { accueil: string; services: string };
};

const TEXTES: Record<Locale, TextesServices> = {
  fr: {
    seoTitre: "Assistant IA en détail : devis, relances, demandes · Genève",
    seoDescription:
      "Ce qu'il fait, métier par métier, et ce qu'il ne fait jamais seul. Il ne s'engage jamais à votre place. Données de l'assistant hébergées en Suisse.",
    meta: "L'assistant",
    h1: ["L'assistant IA,", "en détail."],
    chapo:
      "Nawa Corps est un studio genevois. Il installe dans les PME un assistant IA qui connaît déjà leur métier. L'assistant répond aux demandes, relance les clients et prépare les documents. Il ne s'engage jamais à la place du patron. Chaque lundi, un relevé dit ce qui a été fait.",
    rienAPreparer:
      "Rien à préparer : nous partons de ce que vous recevez déjà.",
    mentionReponse: MENTION_REPONSE,
    gestes: {
      meta: "Ce qu'il fait",
      h2: ["Quatre gestes,", "et vous validez."],
      items: [
        {
          titre: "Répondre aux demandes.",
          texte:
            "Un accusé de réception, validé par vous une fois, demande l'adresse, une photo et l'urgence. Vous validez chaque réponse de fond.",
        },
        {
          titre: "Relancer.",
          texte: "Les devis sans réponse, les pièces qui manquent, les anciens contacts.",
        },
        {
          titre: "Préparer.",
          texte:
            "Un brouillon de devis, de réponse ou de document. Vous le corrigez si besoin, puis vous l'envoyez.",
        },
        {
          titre: "Le relevé du lundi.",
          texte: "Ce qui a été traité, relancé, préparé, et ce qui vous attend.",
        },
      ],
    },
    metiers: {
      meta: "Par métier",
      h2: ["Il connaît déjà", "votre métier."],
      lede: "Une base par métier, réglée sur votre entreprise.",
      lienCarte: "L'assistant pour ce métier →",
      tous: "Tous les métiers →",
    },
    controle: {
      meta: "Le contrôle",
      h2: ["Ce qu'il ne fait", "jamais seul."],
      points: [
        "Il ne s'engage jamais à votre place : aucun prix, aucune date, aucun devis, aucune réponse de fond sans votre accord.",
        "Un seul message part sans vous : l'accusé de réception, que vous avez relu et validé une fois.",
        "Il n'a pas accès à vos paiements.",
        "Les données de votre assistant sont hébergées en Suisse, sous la nLPD.",
        "Pour la démo, il n'a accès à aucun de vos outils.",
      ],
      pasPromisTitre: "Ce que nous ne promettons pas : ",
      pasPromis:
        "un nombre de clients en plus, un nombre d'heures gagnées, un taux de devis signés, une première place sur Google, un assistant « 100 % automatique ».",
      etudes:
        "Des études publiées mesurent des gains nets quand l'IA aide à rédiger et à répondre aux clients. Ce sont leurs chiffres, pas une promesse pour vous : ce que l'assistant fait chez vous, le relevé du lundi le montre. ",
      etudesLien: "Les chiffres et leurs sources →",
      detail: "Ce que nous ne promettons pas",
    },
    parcours: {
      meta: "Le parcours",
      h2: ["Vous le voyez, vous l'essayez,", "vous payez après."],
      demo: {
        titre: "La démo.",
        texte:
          "L'assistant sur des demandes de votre métier. Rien à préparer, rien à payer. À la fin, nous fixons avec vous, par écrit, le palier de l'abonnement.",
      },
      essai: {
        titre: "L'essai, deux semaines.",
        texte:
          "Pendant deux semaines, il travaille sur vos vraies demandes, sans jamais s'engager à votre place ; le relevé arrive chaque lundi. Rien à payer pendant l'essai.",
      },
      demoCourt: "Sur des demandes de votre métier. Rien à payer.",
      essaiCourt: "Sur vos vraies demandes. Le relevé chaque lundi.",
      abonnementTitre: "L'abonnement.",
      abonnementCourtAvecPrix:
        "Mise en place {montant}, {tva}, une seule fois. Puis l'abonnement, sans engagement.",
      abonnementCourtSansPrix:
        "La mise en place, une seule fois. Puis l'abonnement, sans engagement.",
      abonnementAvecPrix:
        "Si le relevé vous convient, vous payez la mise en place, {montant}, {tva}, une seule fois. Puis l'abonnement mensuel continue, selon votre palier. Sans engagement, résiliable chaque mois.",
      abonnementSansPrix:
        "Si le relevé vous convient, vous payez la mise en place, une seule fois. Puis l'abonnement mensuel continue, selon votre volume. Sans engagement, résiliable chaque mois.",
      note: "L'abonnement, selon votre volume : le palier se fixe par écrit à la fin de la démo, avant l'essai.",
      detail: "Le parcours en détail",
    },
    cta: "Voir la démo sur mon métier ",
    guides: {
      donnees: "IA et protection des données : le guide nLPD →",
      prix: "Combien coûte un assistant IA en Suisse : le guide →",
    },
    offreNom: "Mise en place de l'assistant",
    serviceNom: "Assistant IA pour PME",
    fil: { accueil: "Accueil", services: "L'assistant" },
  },

  en: {
    seoTitre: "The AI assistant in detail: quotes, follow-ups · Geneva",
    seoDescription:
      "What it does, trade by trade, and what it never does alone. It never commits on your behalf. The assistant's data is hosted in Switzerland.",
    meta: "The assistant",
    h1: ["The AI assistant,", "in detail."],
    chapo:
      "Nawa Corps is a Geneva studio. It sets up, in small businesses, an AI assistant that already knows their trade. The assistant answers enquiries, follows up clients and prepares documents. It never commits on the owner's behalf. Every Monday, a report says what was done.",
    rienAPreparer: "Nothing to prepare: we start from what you already receive.",
    mentionReponse: MENTION_REPONSE_EN,
    gestes: {
      meta: "What it does",
      h2: ["Four tasks,", "and you approve."],
      items: [
        {
          titre: "Answering enquiries.",
          texte:
            "An acknowledgement, approved by you once, asks for the address, a photo and the urgency. You approve every real reply.",
        },
        {
          titre: "Following up.",
          texte: "Quotes with no answer, missing documents, past contacts.",
        },
        {
          titre: "Preparing.",
          texte:
            "A draft quote, reply or document. You correct it if needed, then you send it.",
        },
        {
          titre: "The Monday report.",
          texte: "What was handled, followed up, prepared, and what is waiting for you.",
        },
      ],
    },
    metiers: {
      meta: "By trade",
      h2: ["It already knows", "your trade."],
      lede: "A base for each trade, set to your business.",
      lienCarte: "The assistant for this trade →",
      tous: "All trades →",
    },
    controle: {
      meta: "Control",
      h2: ["What it never", "does alone."],
      points: [
        "It never commits on your behalf: no price, no date, no quote, no real reply without your approval.",
        "Only one message goes out without you: the acknowledgement, which you read and approved once.",
        "It has no access to your payments.",
        "Your assistant's data is hosted in Switzerland, under the nFADP.",
        "For the demo, it has no access to any of your tools.",
      ],
      pasPromisTitre: "What we do not promise: ",
      pasPromis:
        "more clients, hours saved, a rate of signed quotes, first place on Google, a “100% automatic” assistant.",
      etudes:
        "Published studies measure clear gains when AI helps write and reply to customers. Those are their figures, not a promise to you: what the assistant does for you shows in the Monday report. ",
      etudesLien: "The figures and their sources →",
      detail: "What we do not promise",
    },
    parcours: {
      meta: "The process",
      h2: ["You see it, you try it,", "you pay after."],
      demo: {
        titre: "The demo.",
        texte:
          "The assistant on enquiries from your trade. Nothing to prepare, nothing to pay. At the end, we set the subscription tier with you, in writing.",
      },
      essai: {
        titre: "The two-week trial.",
        texte:
          "For two weeks, it works on your real enquiries, never committing on your behalf; the report comes every Monday. Nothing to pay during the trial.",
      },
      demoCourt: "On enquiries from your trade. Nothing to pay.",
      essaiCourt: "On your real enquiries. The report every Monday.",
      abonnementTitre: "The subscription.",
      abonnementCourtAvecPrix:
        "Set-up {montant}, {tva}, once. Then the subscription, no commitment.",
      abonnementCourtSansPrix:
        "The set-up, once. Then the subscription, no commitment.",
      abonnementAvecPrix:
        "If the report suits you, you pay for the set-up, {montant}, {tva}, once. Then the monthly subscription carries on, based on your tier. No commitment, cancellable every month.",
      abonnementSansPrix:
        "If the report suits you, you pay for the set-up, once. Then the monthly subscription carries on, based on your volume. No commitment, cancellable every month.",
      note: "The subscription, based on your volume: the tier is set in writing at the end of the demo, before the trial.",
      detail: "The process in detail",
    },
    cta: "See the demo on my trade ",
    guides: null,
    offreNom: "Assistant set-up",
    serviceNom: "AI assistant for small businesses",
    fil: { accueil: "Home", services: "The assistant" },
  },
};

/**
 * Metadonnees des deux pages. Statiques : la description ne porte pas de
 * montant (la version chiffree depassait 155 signes), elle n a donc rien a
 * lire en base. Le bloc `twitter` est redeclare en entier : Next ne fusionne
 * pas les objets, une page sans le sien heriterait de celui de l accueil.
 */
export function metadataServices(locale: Locale): Metadata {
  const t = TEXTES[locale];
  const titreComplet = `${t.seoTitre} — ${SITE_NAME}`;
  return {
    // `absolute` : le titre de l audit CRO/SEO du 25.10.2026 (§4.4) tient
    // ses 60 signes sans le suffixe du `template`.
    title: { absolute: t.seoTitre },
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

export const metadata: Metadata = metadataServices("fr");

/** Une section numerotee : meta « (0n) libelle » puis h2 sur deux lignes. */
function Entete({
  rang,
  meta,
  h2,
}: {
  rang: string;
  meta: string;
  h2: readonly [string, string];
}) {
  return (
    <div className="sec-head">
      {/* L espace insecable et le libelle tiennent dans UNE expression : deux
          noeuds texte adjacents feraient intercaler un `<!-- -->` par React. */}
      <span className="meta" data-reveal>
        <span className="index">({rang})</span>
        {`  ${meta}`}
      </span>
      <div data-reveal>
        <h2 className="t">
          {h2[0]}
          <br />
          {h2[1]}
        </h2>
      </div>
    </div>
  );
}

/**
 * LE CORPS DE LA PAGE — appele par `/services` (fr) et `/en/services` (en).
 * Une fonction appelee, pas un composant : aucune frontiere de plus dans
 * l arbre.
 */
export async function corpsServices(locale: Locale) {
  const t = TEXTES[locale];
  const [montant, cents, paliers] = await Promise.all([
    lireMiseEnPlace(),
    lireCentsMiseEnPlace(),
    lirePaliers(locale),
  ]);
  const abonnement = montant
    ? avecPrix(t.parcours.abonnementAvecPrix, montant, locale)
    : t.parcours.abonnementSansPrix;
  const abonnementCourt = montant
    ? avecPrix(t.parcours.abonnementCourtAvecPrix, montant, locale)
    : t.parcours.abonnementCourtSansPrix;

  /**
   * LE SERVICE EN DONNEE STRUCTUREE, rattache au studio (`/#studio`, emis par
   * components/SchemaStudio sur l accueil). Chaque `Offer` n existe que si son
   * montant est lu en base : jamais de prix invente. La mise en place d abord,
   * puis les trois paliers mensuels (`offresAbonnement`), les memes que la
   * grille affichee en (04).
   *
   * L OFFER VIENT DE `offreMiseEnPlace` (lib/catalogue.ts), la meme que sur
   * les pages metiers : elle porte la mention de TVA de lib/format.ts dans sa
   * `description`, et n emet pas `valueAddedTaxIncluded` (`true` dirait
   * « TVA comprise », `false` « TVA en sus » : les deux sont faux pour une
   * entreprise non assujettie).
   */
  const offres = [
    offreMiseEnPlace(cents, locale, t.offreNom),
    ...offresAbonnement(paliers, locale),
  ].filter((o): o is Record<string, unknown> => o !== null);
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${lien(locale, CHEMIN)}#service`,
    name: t.serviceNom,
    description: t.chapo,
    inLanguage: LANGUE_HTML[locale],
    provider: { "@id": `${SITE_URL}/#studio` },
    areaServed: "Genève",
    url: `${SITE_URL}${lien(locale, CHEMIN)}`,
    ...(offres.length ? { offers: offres } : {}),
  };

  return (
    <>
      <SchemaPage
        fil={[
          { nom: t.fil.accueil, chemin: lien(locale, "/") },
          { nom: t.fil.services, chemin: lien(locale, CHEMIN) },
        ]}
        locale={locale}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(service) }}
      />

      {/* ---------- En-tete : la reponse directe ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              {t.meta}
            </span>
            <div data-reveal>
              <h1 className="t">
                {t.h1[0]}
                <br />
                {t.h1[1]}
              </h1>
            </div>
          </div>
          <p className="lede" data-reveal>
            {t.chapo}
          </p>
          <p className="lede" data-reveal style={{ marginTop: "1.2em" }}>
            {t.rienAPreparer}
          </p>
          <p className="meta" data-reveal style={{ marginTop: "1.6em" }}>
            {t.mentionReponse}
          </p>
        </div>
      </section>

      {/* ---------- (01) Ce qu il fait ---------- */}
      <section>
        <div className="wrap">
          <Entete rang="01" meta={t.gestes.meta} h2={t.gestes.h2} />
          <div className="steps">
            {t.gestes.items.map((item, i) => (
              <div className="stp" data-reveal key={item.titre}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{item.titre}</h3>
                <p>{item.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- (02) Par metier ----------
          Les cartes sont lues dans lib/metiers.ts, comme le hub /metiers :
          chacune mene a sa page. DEPUIS LE 26.10.2026 UNE CARTE = LE NOM ET
          LE LIEN : ce que l assistant peut faire (`carte.peut`) est sur la
          carte du hub et sur la page du metier, a un clic. */}
      <section>
        <div className="wrap">
          <Entete rang="02" meta={t.metiers.meta} h2={t.metiers.h2} />
          <p className="lede" data-reveal style={{ marginBottom: 34 }}>
            {t.metiers.lede}
          </p>
          <div className="cat-grid">
            {METIERS.map((m) => (
              <article className="cat-it" data-reveal key={m.slug}>
                <h3>{m[locale].nom}</h3>
                <a className="go" href={lien(locale, cheminMetier(m.slug))}>
                  {t.metiers.lienCarte}
                </a>
              </article>
            ))}
          </div>
          <p data-reveal style={{ marginTop: 22 }}>
            <a className="lnk" href={lien(locale, CHEMIN_METIERS)}>
              {t.metiers.tous}
            </a>
          </p>
        </div>
      </section>

      {/* ---------- (03) Le controle ----------
          Une liste, et non un paragraphe : chaque point se lit seul, y compris
          par un moteur de reponse. `id="controle"` : chaque page metier y
          renvoie (« Le contrôle en détail → »). */}
      <section id="controle">
        <div className="wrap">
          <Entete rang="03" meta={t.controle.meta} h2={t.controle.h2} />
          <div className="sm-devis" data-reveal>
            <ul style={{ listStyle: "none", display: "grid", gap: 10 }}>
              {t.controle.points.map((point) => (
                <li key={point}>
                  <p>{point}</p>
                </li>
              ))}
            </ul>
            {/* « Pas promis », les etudes et le guide nLPD, fermes par defaut
                (26.10.2026) : les cinq points disent l essentiel. */}
            <Detail libelle={t.controle.detail}>
              <p>
                <strong>{t.controle.pasPromisTitre}</strong>
                {t.controle.pasPromis}
              </p>
              {/* Vers (01) Les chiffres de l accueil. <a> classique (B7). */}
              <p>
                {t.controle.etudes}
                <a className="lnk" href={lien(locale, "/#chiffres")}>{t.controle.etudesLien}</a>
              </p>
              {t.guides && (
                <p>
                  <a className="lnk" href={cheminGuide("ia-et-protection-des-donnees")}>
                    {t.guides.donnees}
                  </a>
                </p>
              )}
            </Detail>
          </div>
        </div>
      </section>

      {/* ---------- (04) Le parcours ----------
          Seul endroit de la page qui porte des montants : la mise en place,
          puis la grille de l abonnement, lus en base, chacun avec sa mention
          de TVA. `id="parcours"` : chaque page metier y renvoie. */}
      <section id="parcours">
        <div className="wrap">
          <Entete rang="04" meta={t.parcours.meta} h2={t.parcours.h2} />
          <div className="steps">
            <div className="stp" data-reveal>
              <span className="n">01</span>
              <h3>{t.parcours.demo.titre}</h3>
              <p>{t.parcours.demoCourt}</p>
            </div>
            <div className="stp" data-reveal>
              <span className="n">02</span>
              <h3>{t.parcours.essai.titre}</h3>
              <p>{t.parcours.essaiCourt}</p>
            </div>
            <div className="stp" data-reveal>
              <span className="n">03</span>
              <h3>{t.parcours.abonnementTitre}</h3>
              <p>{abonnementCourt}</p>
            </div>
          </div>
          {/* Les textes entiers des trois etapes, la note et le guide du prix,
              fermes par defaut (26.10.2026). Le montant de l etape 3 y garde
              sa mention de TVA dans la meme phrase (`avecPrix`). */}
          <div className="sm-devis" data-reveal>
            <Detail libelle={t.parcours.detail}>
              <p><strong>{t.parcours.demo.titre}</strong>{` ${t.parcours.demo.texte}`}</p>
              <p><strong>{t.parcours.essai.titre}</strong>{` ${t.parcours.essai.texte}`}</p>
              <p><strong>{t.parcours.abonnementTitre}</strong>{` ${abonnement}`}</p>
              <p>{t.parcours.note}</p>
              {t.guides && (
                <p>
                  <a className="lnk" href={cheminGuide("prix-assistant-ia-suisse")}>
                    {t.guides.prix}
                  </a>
                </p>
              )}
            </Detail>
          </div>
          <div style={{ marginTop: 34 }}>
            <GrilleAbonnement locale={locale} forme="cat" />
          </div>
          {/* Un seul geste sur la page : la demande de demo. <a> classique,
              jamais next/link (les revelations au scroll ne se rejouent pas). */}
          <div className="c-row" data-reveal style={{ marginTop: 34 }}>
            <a className="btn" href={lien(locale, "/demonstrations")}>
              {t.cta}
              <span className="ar">→</span>
            </a>
          </div>
        </div>
      </section>

      <FooterContact indexSection="05" locale={locale} />
    </>
  );
}

export default async function Services() {
  return corpsServices("fr");
}
