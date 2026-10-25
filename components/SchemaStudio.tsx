import type { Locale } from "@/lib/i18n";
import {
  CONTACT,
  FONDE_EN,
  HORAIRES,
  LANGUES,
  NAP_CONFIRME,
  SAME_AS,
  SITE_NAME,
  SITE_URL,
  jsonLd,
} from "@/lib/site";

/**
 * DONNEE STRUCTUREE DU STUDIO — ProfessionalService, rendue sur l accueil.
 *
 * C est la fiche d identite que lisent Google et les moteurs de reponse. Elle
 * ne dessine rien : le composant n emet qu une balise <script>.
 *
 * TOUT CE QUI EST ICI EST DEJA ECRIT SUR LA PAGE (docs/agents/copy/meta.md
 * §5) : la description reprend le hero et la section (04), le slogan est la
 * sortie du hero et la bande legale du pied de page, les prestations sont les
 * gestes de l assistant decrits en (02) et sur /services, les horaires et les
 * coordonnees sont ceux du pied de page. `foundingDate` est la seule donnee
 * sans reflet a l ecran — un fait d etat civil, assume. Une donnee structuree
 * qui promet ce que la page ne montre pas finit ignoree, au mieux.
 *
 * LES ENTITES SONT NOMMEES EN ENTIER (studio, Geneve, PME, assistant IA) : un
 * moteur de reponse cite un bloc autonome, il ne devine pas un pronom.
 *
 * NI `priceRange`, NI `Offer`, NI `aggregateRating` : le seul montant du
 * site vit en base et s affiche avec sa mention de TVA dans la page, et il
 * n existe aucun avis (LCD art. 3, CLAUDE.md). Le catalogue liste donc des
 * `Service` nus (schema.org accepte un Thing dans `itemListElement`) : un
 * `Offer` sans prix est une offre vide. Le seul `Offer` du site est celui de
 * /services, emis seulement quand le montant est lu en base.
 *
 * LE NAP SORT D ICI TANT QUE LE VERROU EST OUVERT. NAP_CONFIRME (lib/site.ts)
 * coupe l emission entiere du telephone, de l e-mail et de l adresse le jour
 * ou une coordonnee redevient incertaine : on ne corrige pas ici, on cesse
 * d emettre. L adresse est volontairement sans rue : le studio n a pas de
 * bureau.
 *
 * RENDU SUR `/` ET SUR `/en` DEPUIS LE 25.10.2026 (audit CRO/SEO v3, 3.8) :
 * les `Service` anglais pointent vers `provider: {@id …/#studio}`, qui n etait
 * defini que sur l accueil francais. C est LA MEME ENTITE — meme `@id`, memes
 * coordonnees, meme `url` — dont seuls les textes (description, slogan,
 * prestations) passent dans la langue de la page. Ils se tiennent ici, cote a
 * cote, pour qu un mot change dans une langue se change dans l autre.
 */

/** Les textes de la fiche, dans la langue de la page. */
const TEXTES: Record<
  Locale,
  { description: string; slogan: string; catalogue: string; prestations: readonly string[] }
> = {
  fr: {
    description:
      "Studio genevois qui installe dans les PME un assistant IA qui connaît déjà leur métier. L'assistant répond aux demandes, relance les clients et prépare les documents ; il ne s'engage jamais à la place du patron. Démo sur des demandes de votre métier avant de signer, sans rien à préparer.",
    slogan: "Vous validez. Il s'occupe du reste.",
    catalogue: "L'assistant",
    // Ce que fait l assistant, dans l ordre de /services (01).
    prestations: [
      "Assistant IA pour PME",
      "Réponse aux demandes des clients",
      "Relance des devis et des pièces manquantes",
      "Préparation de brouillons de devis et de documents",
      "Relevé hebdomadaire de l'activité",
    ],
  },
  en: {
    description:
      "Geneva studio that sets up for small businesses an AI assistant that already knows their trade. The assistant answers enquiries, follows up clients and prepares documents; it never commits on the owner's behalf. A demo on enquiries from your trade before you sign, with nothing to prepare.",
    slogan: "You approve. It handles the rest.",
    catalogue: "The assistant",
    prestations: [
      "AI assistant for small businesses",
      "Replies to client enquiries",
      "Follow-up of quotes and missing documents",
      "Draft quotes and documents",
      "Weekly activity report",
    ],
  },
};

export default function SchemaStudio({ locale = "fr" }: { locale?: Locale }) {
  const t = TEXTES[locale];
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#studio`,
    name: SITE_NAME,
    url: SITE_URL,
    description: t.description,
    slogan: t.slogan,
    image: `${SITE_URL}/brand/nawa-corps-logo-principal-transparent.png`,
    logo: `${SITE_URL}/brand/nawa-corps-logo-principal-transparent.png`,
    foundingDate: FONDE_EN,
    founder: {
      // Meme @id que le nœud Person complet de /studio : sans lui, le site
      // declarait deux Ayoub Bensalem sans lien entre eux.
      "@type": "Person",
      "@id": `${SITE_URL}/#ayoub`,
      name: "Ayoub Bensalem",
    },
    knowsLanguage: [...LANGUES],
    currenciesAccepted: "CHF",
    // Genève d abord (la ville du NAP), puis sa region : le marche est
    // « Genève et sa région (Suisse romande) » (CLAUDE.md). La region est un
    // `Place` nomme, pas un `AdministrativeArea` : la Suisse romande n est pas
    // une entite administrative, et le dire serait faux.
    areaServed: [
      {
        "@type": "City",
        name: CONTACT.ville,
        address: {
          "@type": "PostalAddress",
          addressLocality: CONTACT.ville,
          addressRegion: CONTACT.region,
          addressCountry: CONTACT.pays,
        },
      },
      { "@type": "Place", name: "Suisse romande" },
    ],
    // Vide tant que la fiche Google et LinkedIn n existent pas (lib/site.ts).
    ...(SAME_AS.studio.length ? { sameAs: [...SAME_AS.studio] } : {}),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...HORAIRES.jours],
        opens: HORAIRES.ouverture,
        closes: HORAIRES.fermeture,
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t.catalogue,
      itemListElement: t.prestations.map((nom) => ({
        "@type": "Service",
        name: nom,
        areaServed: CONTACT.ville,
        provider: { "@id": `${SITE_URL}/#studio` },
      })),
    },

    // Le verrou, OUVERT — les trois champs sortent. Voir le docblock ci-dessus :
    // ce qui se coupe ici, c est l emission entiere, pas une valeur.
    ...(NAP_CONFIRME
      ? {
          telephone: CONTACT.telephone,
          email: CONTACT.email,
          address: {
            "@type": "PostalAddress",
            addressLocality: CONTACT.ville,
            addressRegion: CONTACT.region,
            addressCountry: CONTACT.pays,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
    />
  );
}
