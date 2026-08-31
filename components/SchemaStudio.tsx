import {
  CONTACT,
  FONDE_EN,
  HORAIRES,
  LANGUES,
  NAP_CONFIRME,
  SITE_NAME,
  SITE_URL,
  jsonLd,
} from "@/lib/site";

/**
 * DONNEE STRUCTUREE DU STUDIO — ProfessionalService.
 *
 * C est la fiche d identite que lisent Google et les moteurs de reponse. Elle
 * ne dessine rien : le composant n emet qu une balise <script>.
 *
 * TOUT CE QUI EST ICI EST DEJA ECRIT QUELQUE PART SUR LA PAGE. Les horaires
 * viennent du pied de page (« Lu–Sa · 9h–19h »), les langues de la section
 * « Le studio », les prestations de ServicesRows, et le delai du hero
 * (une semaine). `foundingDate` est la seule donnee sans reflet a
 * l ecran depuis le retrait de « Depuis 2026 » (.facts de Studio.tsx ne montre
 * plus que Geneve / une semaine / FR-EN) — c est un fait d etat civil, pas un
 * argument marketing, donc une exception assumee a la regle ci-dessus. Une
 * donnee structuree qui promet ce que la page ne montre pas est une donnee
 * structuree que Google finit par ignorer, au mieux.
 *
 * LA FICHE COUVRE TOUT LE CATALOGUE, PAS LES SEULS SITES. Elle ne listait que
 * des fonctions de site ; le studio vend aussi de l identite, des imprimes, des
 * photos, la production des reseaux sociaux et une ligne restauration. Une
 * fiche qui tait la moitie du catalogue prive le studio des requetes qui vont
 * avec, et contredit ce que la page montre desormais.
 *
 * LE NAP SORT D ICI DEPUIS QUE LE VERROU EST OUVERT. NAP_CONFIRME vaut true
 * (lib/site.ts) : le telephone, l e-mail et la localite sont ceux d Ayoub
 * Bensalem, et les trois champs partent donc bien dans la fiche. C est ce qui
 * la rend eligible au pack local et au rapprochement avec la fiche Google — et
 * la regle du dessus tient toujours, les trois sont affiches en pied de page.
 *
 * LE VERROU RESTE, ET IL FAUT COMPRENDRE POURQUOI. Le bloc conditionnel plus
 * bas n est pas un vestige : une coordonnee declaree ici remonte dans une
 * fiche, un panneau de connaissance, une reponse d assistant — elle se propage
 * hors du site et se corrige mal. Tant que les valeurs etaient des
 * remplissages, le silence valait mieux qu une donnee structuree fausse.
 * Refermer le verrou est donc le bon geste le jour ou une coordonnee redevient
 * incertaine : on ne corrige pas ici, on cesse d emettre.
 *
 * L adresse est volontairement sans rue : le studio n a pas de bureau, et
 * inventer une voie « pour faire serieux » serait exactement la donnee fausse
 * que ce verrou existe pour empecher.
 *
 * Pas de priceRange non plus : les prix vivent en base et varient. L annoncer
 * en dur ici, c est prendre le risque qu il contredise la grille affichee.
 */

/**
 * Les prestations, dans l ordre de ServicesRows.
 *
 * ELLES NE SUIVENT PLUS LE DECOUPAGE EDITORIAL DES SIX LIGNES. « Identite,
 * imprimes et photographie » et « Fiche Google et reseaux sociaux » sont des
 * titres de section : ils groupent des metiers distincts pour tenir sur une
 * ligne a l ecran. Un OfferCatalog n a pas cette contrainte, et un moteur
 * n apparie pas une requete « logotype Geneve » avec un intitule qui melange
 * trois prestations. Chacune est donc nommee separement — toutes sont ecrites
 * dans le corps des lignes 04, 05 et 06 de ServicesRows, la regle du docblock
 * ci-dessus tient.
 */
const PRESTATIONS = [
  "Refonte de site",
  "Demande de devis et prise de rendez-vous en ligne",
  "Assistant et relances automatiques",
  "Identité visuelle et logotype",
  "Cartes de visite, affiches et stickers vitrine",
  "Photographie d'entreprise",
  "Fiche Google",
  "Réseaux sociaux",
  "Supports pour la restauration",
];

export default function SchemaStudio() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#studio`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Studio de création digitale indépendant à Genève : sites, identité et logotype, imprimés, photographie d'entreprise, fiche Google, réseaux sociaux et supports pour la restauration. Une seule personne les fait. Le site des PME genevoises est refait en une semaine, sans que le client ait de contenu à fournir.",
    slogan: "L'essentiel. Bien conçu.",
    image: `${SITE_URL}/brand/nawa-corps-logo-principal-transparent.png`,
    logo: `${SITE_URL}/brand/nawa-corps-logo-principal-transparent.png`,
    foundingDate: FONDE_EN,
    founder: { "@type": "Person", name: "Ayoub Bensalem" },
    knowsLanguage: [...LANGUES],
    currenciesAccepted: "CHF",
    areaServed: {
      "@type": "City",
      name: CONTACT.ville,
      address: {
        "@type": "PostalAddress",
        addressLocality: CONTACT.ville,
        addressRegion: CONTACT.region,
        addressCountry: CONTACT.pays,
      },
    },
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
      name: "Services du studio",
      itemListElement: PRESTATIONS.map((nom) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: nom,
          areaServed: CONTACT.ville,
          provider: { "@id": `${SITE_URL}/#studio` },
        },
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
