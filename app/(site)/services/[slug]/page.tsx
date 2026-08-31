import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
import { notFound } from "next/navigation";
import FooterContact from "@/components/FooterContact";
import {
  CHF_UNIT,
  formatChfAmount,
  isQuote,
  libelleDevis,
  mentionTva,
  suffixeMensuel,
} from "@/lib/format";
import {
  FORMULES,
  FORMULE_SLUGS,
  type FormuleSlug,
  auDela,
  estFormule,
  inclus,
  manque,
  questionsDe,
} from "@/lib/formules";
import {
  chargerCatalogue,
  descriptionService,
  nomService,
} from "@/lib/catalogue";
import { type Locale, lien } from "@/lib/i18n";
import {
  CONTACT,
  SITE_NAME,
  SITE_URL,
  alternatesPage,
  jsonLd,
  openGraphPage,
} from "@/lib/site";

/**
 * /services/<slug> — UNE PAGE PAR FORMULE DE SITE, et seulement pour les
 * trois formules.
 *
 * POURQUOI TROIS ET PAS DIX-HUIT : voir le docblock de lib/formules.ts. En
 * resume, dix-huit pages baties sur une ligne de base seraient du contenu
 * mince, et le contenu mince dessert le referencement au lieu de le servir.
 *
 * CE QUE CHAQUE PAGE PORTE, dans cet ordre : le nom et Genève dans le h1 ; ce
 * que la formule resout ; le prix, le delai et son point de depart ; ce qui est
 * inclus ; ce qui ne l est pas et vers quoi monter ; les questions propres a la
 * formule ; un CTA de devis.
 *
 * LE NOM, LA DESCRIPTION ET LE PRIX VIENNENT DE POSTGRES. Le reste — ce que la
 * formule resout, l echelle des fonctions, les questions — vit dans
 * lib/formules.ts. Aucun montant n est ecrit ici, ni a l ecran ni dans la
 * donnee structuree.
 *
 * DONNEE STRUCTUREE : un Service par page, dont le `provider` pointe vers
 * l @id que pose components/SchemaStudio.tsx sur l accueil. AUCUNE note, AUCUN
 * compteur d avis : il n existe aucun avis reel, et en Suisse la LCD (art. 3)
 * vise les indications trompeuses.
 *
 * LE PRIX MENSUEL S AFFICHE AU POINT DE DECISION, SUR LES TROIS PALIERS.
 * L Assistant IMPOSE son abonnement — l assistant consomme des appels d API
 * tous les mois, le vendre une seule fois reviendrait a porter une charge
 * perpetuelle sans revenu. Cette obligation dormait dans un <details> replie,
 * et SANS son montant : le visiteur lisait 2'499.–, cliquait, et decouvrait
 * 129.–/mois plus tard. C est la definition d un prix cache.
 *
 * LES DEUX AUTRES PALIERS N EN DISAIENT RIEN DU TOUT, ce qui etait le meme
 * defaut d un cran en dessous : le suivi passe a 49.–/mois la 2ᵉ annee, et on
 * pouvait lire La Vitrine ou Le Site en entier sans l apprendre. Les trois
 * portent donc leur montant ENTRE le prix et le bouton, avec son point de
 * depart et « TVA comprise ». Seul le mot « obligatoire » les distingue : il
 * n est ecrit que la ou l abonnement l est vraiment. Les deux montants sont lus
 * en base (slugs `hebergement` et `suivi-assistant`), jamais ecrits ici.
 *
 * ---------------------------------------------------------------------------
 * DEPUIS LE CHANTIER ANGLAIS : CE FICHIER REND SIX PAGES, PAS TROIS.
 *
 * `corpsFormule(slug, locale)` porte le corps ; `/services/<slug>` l appelle en
 * francais, `/en/services/<slug>` en anglais. Voir l en-tete d
 * app/(site)/services/page.tsx pour le raisonnement complet — en deux mots :
 * c est une FONCTION appelee et non un composant rendu, donc l arbre francais
 * ne gagne aucune frontiere et le HTML rendu reste celui d avant le chantier.
 *
 * LES DEUX MENTIONS CONTRACTUELLES NE SE PERDENT PAS EN TRADUISANT, et elles
 * sont la vraie raison pour laquelle ce corps est partage plutot que recopie :
 *  - le suivi mensuel est OBLIGATOIRE avec L'Assistant des la 2ᵉ annee ;
 *  - deux allers-retours de correction sont compris, factures au-dela.
 * Les deux sont dans `TEXTES` ci-dessous, en francais ET en anglais, au meme
 * endroit du meme paragraphe. Une page anglaise qui les perdrait annoncerait un
 * prix incomplet, ce que la LCD art. 3 vise sans se soucier de la langue.
 */

// Meme raison qu app/(site)/page.tsx : la page lit Postgres, et `next build`
// tourne sans base joignable. force-dynamic empeche Next de tenter un
// prerendu qui ferait echouer la construction.
//
// `generateStaticParams` ci-dessous n est donc PAS un prerendu : sous
// force-dynamic elle ne sert qu a declarer les trois slugs legitimes. La
// mesure qui a fait renoncer a l ISR est consignee dans app/(site)/page.tsx.
export const dynamic = "force-dynamic";

/**
 * Les trois slugs, et rien d autre. La liste ne vient PAS de la base : ce sont
 * les trois pages qu on a decide d ecrire, pas toutes les lignes que la base
 * pourrait contenir un jour.
 *
 * La page anglaise rend exactement la meme liste — les slugs ne se traduisent
 * pas, sous peine de casser les ancres du catalogue et les URL publiques.
 */
export function generateStaticParams() {
  return FORMULE_SLUGS.map((slug) => ({ slug }));
}

/**
 * TOUT CE QUE LA PAGE ECRIT ELLE-MEME, DANS LES DEUX LANGUES.
 *
 * Ce qui n est PAS ici vient d ailleurs et doit y rester : le nom, la
 * description et les prix sont en base ; ce que la formule resout, ses
 * questions, son CTA et ses listes sont dans lib/formules.ts, avec leur repli
 * sur le francais ; « TVA comprise » vient de lib/format.ts, jamais d une
 * chaine de ce fichier.
 *
 * L ANGLAIS SUIT docs/agents/brand/glossaire-anglais.md : `I` / `me` / `my`
 * jamais `we` (§2), anglais britannique (§1), `upkeep` et non `maintenance`
 * pour l abonnement visible (§3 et §7), `one week` jamais seul et jamais en
 * heures (§5), et le nom de la formule plutot que la categorie chaque fois que
 * la phrase le permet (§6-§7).
 */
type TextesFormule = {
  /** Les deux premiers segments du fil d Ariane ; le troisieme est le nom. */
  fil: { accueil: string; services: string };
  /** Le lien de retour au catalogue, au-dessus du h1. */
  retour: string;
  /** Bandeau de faits : le libelle sous le prix, selon son regime. */
  perimetre: string;
  /** Bandeau de faits : le delai, et son point de depart. */
  delai: readonly [string, string];
  depart: readonly [string, string];
  /** Bandeau de faits : le libelle sous le prix du suivi. */
  suiviImpose: string;
  suiviSuite: string;
  /**
   * LES TROIS NOTES DE PRIX, en fonctions plutot qu en chaines.
   *
   * Elles portent un montant lu en base et, pour la premiere, le NOM de la
   * formule — « compulsory with L'Assistant » vaut mieux que « with this
   * package » (glossaire §7). Une chaine a trous se serait recomposee a la
   * main dans la page, et le francais y aurait perdu sa structure de noeuds.
   */
  noteSuiviImpose: (prixSuivi: string, nom: string) => React.ReactNode;
  noteSuiviSuite: (prixSuivi: string) => React.ReactNode;
  noteSeule: React.ReactNode;
  /** Les trois sections numerotees. */
  sections: {
    inclus: { meta: string; h2: readonly [string, string] };
    perimetre: { meta: string; h2: readonly [string, string] };
    questions: { meta: string; h2: readonly [string, string] };
  };
  /** Le bloc « ce qui n est pas inclus » : vers quel palier monter. */
  monterA: string;
  voirPalier: readonly [string, string];
  /** Sommet de l echelle : ce qui reste hors perimetre, et ou le trouver. */
  auDelaTitre: string;
  voirCatalogue: string;
  /** Le second bouton du CTA final. */
  tousServices: string;
  /**
   * `serviceType` du JSON-LD.
   *
   * IL ECHAPPE AU GLOSSAIRE, ET C EST ECRIT NOIR SUR BLANC (§7) : ce champ
   * n est pas de la prose, son lecteur est une machine, et il vaut mieux y
   * mettre un type de service reconnu qu un mot de marque. C est le meme
   * arbitrage que celui qui autorise `maintenance` dans le `serviceType` du
   * suivi alors que tout texte visible dit `upkeep`.
   */
  serviceType: string;
};

const TEXTES: Record<Locale, TextesFormule> = {
  fr: {
    fil: { accueil: "Accueil", services: "Services" },
    retour: "Services",
    perimetre: "Périmètre à définir",
    delai: ["Une semaine", "Délai de livraison"],
    depart: ["Dès votre feu vert", "Départ du délai"],
    suiviImpose: "Suivi obligatoire",
    suiviSuite: "Suivi dès la 2ᵉ année",
    noteSuiviImpose: (prixSuivi, nom) => (
      <>
        Prix en francs suisses, TVA comprise. Le suivi à {prixSuivi} est{" "}
        <strong>obligatoire</strong> avec {nom} et démarre la 2ᵉ année — la
        première est comprise dans le prix du site. L&apos;assistant consomme
        des appels d&apos;API tous les mois ; sans le suivi, il s&apos;arrête.
      </>
    ),
    noteSuiviSuite: (prixSuivi) => (
      <>
        Prix en francs suisses, TVA comprise. Le suivi à {prixSuivi}{" "}
        démarre la <strong>2ᵉ année</strong> — la première est comprise dans le
        prix du site : hébergement, nom de domaine renouvelé, mises à jour et
        sauvegardes. Deux allers-retours de correction compris, facturés
        au-delà.
      </>
    ),
    noteSeule: (
      <>
        Prix en francs suisses, TVA comprise. Deux allers-retours de correction
        compris, facturés au-delà.
      </>
    ),
    sections: {
      inclus: { meta: "Inclus", h2: ["Ce que vous", "recevez."] },
      perimetre: { meta: "Périmètre", h2: ["Ce qui n'est", "pas inclus."] },
      questions: { meta: "Questions", h2: ["Ce qu'on me", "demande."] },
    },
    monterA: "Il faut monter à ",
    voirPalier: ["Voir ", " →"],
    auDelaTitre: "Sur devis, au catalogue",
    voirCatalogue: "Voir tout le catalogue →",
    tousServices: "Tous les services",
    serviceType: "Création et refonte de site web",
  },

  en: {
    fil: { accueil: "Home", services: "Services" },
    retour: "Services",
    perimetre: "Scope to be set",
    // « one week » ne voyage jamais seul : la colonne voisine porte son point
    // de depart, dans le meme bandeau et sous les memes yeux (glossaire §5).
    delai: ["One week", "Delivery time"],
    depart: ["From your go-ahead", "When the week starts"],
    // « upkeep », jamais « maintenance » ni « support » dans un texte visible.
    suiviImpose: "Upkeep compulsory",
    suiviSuite: "Upkeep from year two",
    // Le nom de la formule plutot que la categorie : « compulsory with
    // L'Assistant » est l exemple meme que donne le glossaire §7. Il vient de
    // la base, ou `nameEn` vaut null pour que le nom reste francais.
    noteSuiviImpose: (prixSuivi, nom) => (
      <>
        Prices in Swiss francs, {mentionTva("en")}. The upkeep at {prixSuivi} is{" "}
        <strong>compulsory</strong> with {nom} and starts in the second year —
        the first is included in the price of the site. The assistant uses API
        calls every month; without the upkeep, it stops.
      </>
    ),
    noteSuiviSuite: (prixSuivi) => (
      <>
        Prices in Swiss francs, {mentionTva("en")}. The upkeep at {prixSuivi}{" "}
        starts in the <strong>second year</strong> — the first is included in
        the price of the site: hosting, domain name renewed, updates and
        backups. Two rounds of corrections included, charged beyond that.
      </>
    ),
    noteSeule: (
      <>
        Prices in Swiss francs, {mentionTva("en")}. Two rounds of corrections
        included, charged beyond that.
      </>
    ),
    sections: {
      inclus: { meta: "Included", h2: ["What you", "get."] },
      perimetre: { meta: "Scope", h2: ["What is not", "included."] },
      questions: { meta: "Questions", h2: ["What I get", "asked."] },
    },
    monterA: "You need to move up to ",
    voirPalier: ["See ", " →"],
    auDelaTitre: "On request, in the catalogue",
    voirCatalogue: "See the whole catalogue →",
    tousServices: "All services",
    // Voir le docblock du champ : ce type-la est lu par une machine, et
    // `rebuild` — le mot de la prose anglaise — n en est pas un.
    serviceType: "Website design and development",
  },
};

/**
 * LES METADONNEES D UNE PAGE DE FORMULE, dans la langue demandee.
 *
 * `alternatesPage` remplace la canonique ecrite a la main pour la raison
 * donnee dans app/(site)/services/page.tsx : un `hreflang` declare d un seul
 * cote est ignore par Google, la page francaise doit donc s auto-declarer pour
 * que l anglaise compte.
 *
 * `seoTitreEn` / `seoDescriptionEn` retombent sur le francais quand la
 * traduction manque — c est la regle de tout lib/formules.ts, et c est celle
 * qui compte le plus ici : ces deux chaines sont l extrait que Google montre
 * AVANT que la page ne s ouvre.
 */
export function metadataFormule(slug: FormuleSlug, locale: Locale): Metadata {
  const formule = FORMULES[slug];
  const titre =
    locale === "en" ? (formule.seoTitreEn ?? formule.seoTitre) : formule.seoTitre;
  const description =
    locale === "en"
      ? (formule.seoDescriptionEn ?? formule.seoDescription)
      : formule.seoDescription;
  const chemin = `/services/${slug}`;

  return {
    title: titre,
    description,
    alternates: alternatesPage(chemin, locale),
    // Le helper de lib/site.ts, importe tel quel : Next ne fusionne pas les
    // objets openGraph champ par champ, une page qui n en declare qu une
    // partie perdrait siteName, locale et type.
    openGraph: openGraphPage(
      { titre: `${titre} — ${SITE_NAME}`, description, chemin },
      locale,
    ),
    // Meme raison qu au catalogue : la fusion des metadata de Next ne descend
    // pas dans les objets. Un `twitter` partiel perdrait les cles qu il ne
    // redeclare pas, et n en declarer aucun ferait heriter celui du layout en
    // entier — la carte de partage de La Vitrine porterait alors le titre et
    // la description de l accueil. Il est donc redeclare complet. L image reste
    // celle du fichier app/opengraph-image.
    twitter: {
      card: "summary_large_image",
      title: `${titre} — ${SITE_NAME}`,
      description,
    },
  };
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  // Un slug inconnu ne merite pas de metadonnees : la page qui suit repondra
  // notFound(). Renvoyer un objet vide laisse le layout fournir ses valeurs
  // par defaut le temps du 404.
  if (!estFormule(slug)) return {};
  return metadataFormule(slug, "fr");
}

/**
 * LE CORPS D UNE PAGE DE FORMULE — appele par `/services/<slug>` en francais et
 * par `/en/services/<slug>` en anglais.
 *
 * Le `slug` arrive DEJA VALIDE : c est l appelant qui a repondu notFound() sur
 * un slug inconnu, parce que c est lui qui connait sa route.
 */
export async function corpsFormule(slug: FormuleSlug, locale: Locale) {
  const t = TEXTES[locale];
  const formule = FORMULES[slug];

  /**
   * Les TROIS formules d un coup, pas seulement celle-ci : la page a besoin du
   * nom et du prix de la sienne, mais aussi du NOM des paliers superieurs pour
   * dire vers quoi monter — et ces noms vivent en base, pas ici.
   */
  const catalogue = await chargerCatalogue();
  const paliers = catalogue.filter((s) => estFormule(s.slug));

  // Absent de la base, ou passe a visible:false depuis /admin : la page
  // n existe plus. Un 404 est la reponse honnete ; une page vide en serait une
  // mauvaise, pour le visiteur comme pour un moteur.
  const service = paliers.find((s) => s.slug === slug);
  if (!service) notFound();

  // Le nom des trois formules ne se traduit pas — `nameEn` vaut null en base
  // pour cette raison exacte (voice-guide §10). `nomService` produit donc
  // « La Vitrine » dans les deux langues, article compris.
  const nomAffiche = nomService(service, locale);
  const nomDe = (autre: string) => {
    const palier = paliers.find((s) => s.slug === autre);
    return palier ? nomService(palier, locale) : null;
  };

  // Les paliers superieurs encore publies. Un palier retire de la base
  // disparait du bloc « ce qui n est pas inclus » plutot que d y laisser un
  // nom vide et un lien mort.
  const superieurs = manque(slug, locale)
    .map((bloc) => ({ ...bloc, nom: nomDe(bloc.slug) }))
    .filter((bloc): bloc is typeof bloc & { nom: string } => bloc.nom !== null);

  const surDevis = isQuote(service);
  const prixAffiche = surDevis
    ? libelleDevis(locale)
    : `${formatChfAmount(service.priceCents as number)}${CHF_UNIT}`;

  // Les questions dans la langue de la page, la paire question/reponse etant
  // indivisible (voir `questionsDe`). Le MEME tableau sert les <details>
  // visibles et le FAQPage de SchemaPage : un balisage qui ne correspond pas
  // au texte visible est une declaration fausse au moteur.
  const questions = questionsDe(slug, locale);

  /**
   * LE SUIVI QUI DECOULE DE CE PALIER — les trois en ont un.
   *
   * LES DEUX PREMIERES FORMULES N EN DISAIENT RIEN, et c etait le defaut :
   * seule L Assistant annoncait son abonnement, si bien qu on pouvait lire
   * La Vitrine ou Le Site en entier sans apprendre que le site coute 49.–/mois
   * a partir de la 2ᵉ annee. Ce n est pas un prix cache au sens de l interdit
   * n°4 du guide — il n est pas obligatoire sur ces deux paliers, le site est
   * au client et il peut l heberger ailleurs — mais c est une depense annoncee
   * apres coup, et le pilier 3 la traite comme une SUITE du palier, pas comme
   * une option a decider. Elle se dit donc au meme endroit que le prix.
   *
   * `obligatoire` DISTINGUE LES DEUX CAS, et il change le libelle comme la
   * phrase : sur L Assistant l abonnement est une regle de contrat — l assistant
   * consomme des appels d API tous les mois —, sur les deux autres il decrit ce
   * qui se passe l annee suivante. Ecrire « obligatoire » sur les trois serait
   * faux, et la FAQ de /services/suivi dit deja le contraire.
   *
   * Le lien formule -> suivi est ecrit ici et pas en base : la table Service ne
   * porte aucune relation entre une formule et son abonnement. Le MONTANT, lui,
   * vient de la base — c est tout ce qui compte. Une ligne absente, masquee
   * depuis /admin ou passee sur devis ne fait rien afficher : mieux vaut pas de
   * mention qu une mention fausse.
   */
  const SUIVI_DU_PALIER: Record<
    typeof slug,
    { service: string; obligatoire: boolean }
  > = {
    "la-vitrine": { service: "hebergement", obligatoire: false },
    "le-site": { service: "hebergement", obligatoire: false },
    "l-assistant": { service: "suivi-assistant", obligatoire: true },
  };
  const { service: suiviSlug, obligatoire: suiviImpose } =
    SUIVI_DU_PALIER[slug];
  const suivi = catalogue.find((s) => s.slug === suiviSlug) ?? null;
  const prixSuivi =
    suivi && suivi.priceCents !== null && !isQuote(suivi)
      ? `${formatChfAmount(suivi.priceCents)}${CHF_UNIT}${suffixeMensuel(locale)}`
      : null;

  const chemin = lien(locale, `/services/${slug}`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${chemin}#formule`,
    name: nomAffiche,
    description: descriptionService(service, locale),
    serviceType: t.serviceType,
    url: `${SITE_URL}${chemin}`,
    // L @id pose par components/SchemaStudio.tsx sur l accueil. On ne
    // redeclare pas le studio ici : deux fiches du meme prestataire qui
    // divergeraient d un mot valent moins qu une seule, referencee. Il n a pas
    // de jumeau anglais pour la meme raison — c est UNE entite, pas deux.
    provider: { "@id": `${SITE_URL}/#studio` },
    areaServed: {
      "@type": "City",
      // « Genève » DANS LES DEUX LANGUES, et ce n est pas une traduction
      // oubliee : la prose anglaise dit « Geneva » (glossaire §1), mais cette
      // adresse-ci est le NAP, celui qui doit correspondre au caractere pres a
      // la fiche Google et aux mentions legales. Deux graphies de la meme
      // localite affaiblissent le rapprochement au lieu de le servir.
      name: CONTACT.ville,
      address: {
        "@type": "PostalAddress",
        addressLocality: CONTACT.ville,
        addressRegion: CONTACT.region,
        addressCountry: CONTACT.pays,
      },
    },
    // Le prix REEL, lu en base et converti en francs. Une formule passee sur
    // devis n emet aucune offre chiffree plutot qu un zero.
    ...(surDevis
      ? {}
      : {
          offers: {
            "@type": "Offer",
            price: String(Math.round((service.priceCents as number) / 100)),
            priceCurrency: "CHF",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}${chemin}`,
          },
        }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <SchemaPage
        fil={[
          { nom: t.fil.accueil, chemin: lien(locale, "/") },
          { nom: t.fil.services, chemin: lien(locale, "/services") },
          { nom: nomAffiche, chemin },
        ]}
        questions={questions}
        locale={locale}
      />

      {/* ---------- Le titre, ce que ça résout, le prix et le délai ---------- */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <a className="lnk" href={lien(locale, "/services")}>
                {t.retour}
              </a>
            </span>
            <div data-reveal>
              <h1 className="t">
                {nomAffiche} —<br />
                {locale === "en"
                  ? (formule.h1SuiteEn ?? formule.h1Suite)
                  : formule.h1Suite}
              </h1>
            </div>
          </div>

          <p className="lede" data-reveal>
            {locale === "en"
              ? (formule.resoutEn ?? formule.resout)
              : formule.resout}
          </p>

          {/* .facts : le meme bandeau de faits que la section « Le studio ».
              Le point de depart du delai y a sa propre colonne parce que c est
              LE differenciateur, et parce qu il se dit sans comparer : ce qui
              est affirme porte sur NOUS, jamais sur ce que ferait un autre. */}
          <div className="facts" data-reveal>
            <div>
              <b>{prixAffiche}</b>
              {/* Le libelle suit le type de prix lu en base : « TVA comprise »
                  sous un montant qui n existe pas serait faux, et c est
                  exactement le genre d indication que la LCD vise. */}
              <span>{surDevis ? t.perimetre : mentionTva(locale)}</span>
            </div>
            <div>
              <b>{t.delai[0]}</b>
              <span>{t.delai[1]}</span>
            </div>
            <div>
              <b>{t.depart[0]}</b>
              <span>{t.depart[1]}</span>
            </div>
            {/* LE QUATRIEME FAIT — le suivi, sur les trois paliers. Il est dans
                le MEME bandeau que le prix du site : le visiteur ne peut pas
                lire l un sans l autre, et il les lit avant d atteindre le
                bouton. Le libelle suit le regime reel de l abonnement : impose
                sur L Assistant, simple suite du palier sur les deux autres. */}
            {prixSuivi ? (
              <div>
                <b>{prixSuivi}</b>
                <span>{suiviImpose ? t.suiviImpose : t.suiviSuite}</span>
              </div>
            ) : null}
          </div>
          {/* « sans frais cachés » retire : la formule installe le soupcon
              qu elle veut lever, et elle est saturee chez la concurrence. Ce
              qui rassure vraiment, c est de nommer la contrainte — ce que fait
              la phrase du suivi juste en dessous. */}
          {prixSuivi && suiviImpose ? (
            <p className="sm-note" data-reveal>
              {t.noteSuiviImpose(prixSuivi, nomAffiche)}
            </p>
          ) : prixSuivi ? (
            <p className="sm-note" data-reveal>
              {t.noteSuiviSuite(prixSuivi)}
            </p>
          ) : (
            <p className="sm-note" data-reveal>
              {t.noteSeule}
            </p>
          )}
        </div>
      </section>

      {/* ---------- Ce qui est inclus ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              {/* L espace insecable et le libelle dans UNE SEULE expression :
                  deux enfants texte cote a cote feraient ecrire a React un
                  `<!-- -->` entre eux, et le HTML francais changerait. */}
              <span className="index">(01)</span>
              {`  ${t.sections.inclus.meta}`}
            </span>
            <div data-reveal>
              <h2 className="t">
                {t.sections.inclus.h2[0]}
                <br />
                {t.sections.inclus.h2[1]}
              </h2>
            </div>
          </div>
          <ul className="prest-inc" data-reveal>
            {inclus(slug, locale).map((ligne) => (
              <li key={ligne}>{ligne}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Ce qui n'est pas inclus, et vers quoi monter ---------- */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(02)</span>
              {`  ${t.sections.perimetre.meta}`}
            </span>
            <div data-reveal>
              <h2 className="t">
                {t.sections.perimetre.h2[0]}
                <br />
                {t.sections.perimetre.h2[1]}
              </h2>
            </div>
          </div>
          <div className="prest-liste" data-reveal>
            {superieurs.length > 0 ? (
              superieurs.map((bloc) => (
                <div className="prest-palier" key={bloc.slug}>
                  <p className="sm-grp">
                    {t.monterA}
                    {bloc.nom}
                  </p>
                  <ul className="prest-inc">
                    {bloc.lignes.map((ligne) => (
                      <li key={ligne}>{ligne}</li>
                    ))}
                  </ul>
                  <p style={{ marginTop: 16 }}>
                    <a
                      className="lnk"
                      href={lien(locale, `/services/${bloc.slug}`)}
                    >
                      {t.voirPalier[0]}
                      {bloc.nom}
                      {t.voirPalier[1]}
                    </a>
                  </p>
                </div>
              ))
            ) : (
              // Sommet de l echelle : plus rien a vendre au-dessus, mais des
              // prestations hors perimetre, toutes sur devis, toutes au
              // catalogue.
              <div className="prest-palier">
                <p className="sm-grp">{t.auDelaTitre}</p>
                <ul className="prest-inc">
                  {auDela(slug, locale).map((ligne) => (
                    <li key={ligne}>{ligne}</li>
                  ))}
                </ul>
                {/* Le renvoi pointait vers la seule ancre « En complément »
                    alors que la liste ci-dessus couvre aussi le continu et la
                    restauration. Il ouvre donc le catalogue en entier. */}
                <p style={{ marginTop: 16 }}>
                  <a className="lnk" href={lien(locale, "/services")}>
                    {t.voirCatalogue}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Les questions propres à la formule ---------- */}
      <section className="faq" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="meta" data-reveal>
              <span className="index">(03)</span>
              {`  ${t.sections.questions.meta}`}
            </span>
            <div data-reveal>
              <h2 className="t">
                {t.sections.questions.h2[0]}
                <br />
                {t.sections.questions.h2[1]}
              </h2>
            </div>
          </div>
          {/* Depliage natif <details>/<summary>, sans une ligne de JS —
              identique a la FAQ de l accueil. */}
          <div data-reveal>
            {questions.map((item) => (
              <details key={item.q}>
                <summary>
                  {item.q}
                  <span className="pl2">+</span>
                </summary>
                <p className="a">{item.r}</p>
              </details>
            ))}
          </div>

          {/* LE CTA PORTE LE BENEFICE DU PALIER, PAS LA DEMARCHE. Les trois
              pages disaient « Demander un devis » ; sur Le Site, la page
              affiche un prix ferme en tete et demandait un devis pour ce qui
              est deja chiffre. Le libelle est lu dans lib/formules.ts, ou il
              suit le tableau du guide de voix §7, palier par palier — et son
              jumeau anglais suit la meme regle : « Request a quote » ne
              s ecrit sur aucune des trois pages.
              Le bouton est un VRAI LIEN vers /devis : il fonctionne sans
              JavaScript, et la page d arrivee nomme la formule avec son prix lu
              en base avant d ouvrir l assistant. C est components/BoutonDevis
              a la locale pres — voir le meme constat dans
              app/(site)/services/page.tsx, ou vit `LienDevis`. */}
          <div className="c-row" data-reveal>
            <a
              className="btn"
              href={lien(
                locale,
                `/devis?p=${encodeURIComponent(formule.sujet)}`,
              )}
            >
              {locale === "en" ? (formule.ctaEn ?? formule.cta) : formule.cta}{" "}
              <span className="ar">→</span>
            </a>
            <a className="btn btn-line" href={lien(locale, "/services")}>
              {t.tousServices}
            </a>
          </div>
        </div>
      </section>

      {/* L index du pied de page suit la derniere section de CETTE page :
          trois sections (01) a (03) sur une page de formule, donc le contact porte (04).
          Le defaut "07" du composant est celui de l accueil, qui compte
          sept sections ; le laisser ici faisait sauter la numerotation
          sous les yeux du lecteur. */}
      <FooterContact indexSection="04" locale={locale} />
    </>
  );
}

export default async function FormulePage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  if (!estFormule(slug)) notFound();
  return corpsFormule(slug, "fr");
}
