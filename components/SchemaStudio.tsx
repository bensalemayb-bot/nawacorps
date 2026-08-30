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
 * « Le studio », les six prestations de ServicesRows, et les delais du hero
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
 * CE QUI N Y EST PAS, ET POURQUOI. Ni telephone, ni e-mail, ni adresse tant
 * que NAP_CONFIRME vaut false (voir lib/site.ts). Le numero affiche en pied de
 * page est encore un +41 76 000 00 00 de remplissage ; le declarer ici le
 * ferait remonter dans une fiche, un panneau de connaissance, une reponse
 * d assistant. Une coordonnee fausse en donnee structuree se propage, et se
 * corrige mal. Le silence est la bonne reponse en attendant.
 *
 * Pas de priceRange non plus : les prix vivent en base et varient. L annoncer
 * en dur ici, c est prendre le risque qu il contredise la grille affichee.
 */

/** Les six prestations, dans l ordre de ServicesRows. */
const PRESTATIONS = [
  "Refonte de site",
  "Demande de devis et prise de rendez-vous en ligne",
  "Assistant et relances automatiques",
  "Identité, imprimés et photographie",
  "Fiche Google et réseaux sociaux",
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
      "Studio de création digitale indépendant à Genève. Refonte du site des PME genevoises en une semaine, sans que le client ait de contenu à fournir — puis tout ce qui va autour : identité, imprimés, photos, fiche Google, réseaux sociaux et supports pour la restauration.",
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
      name: "Prestations du studio",
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

    // Le verrou. Voir le docblock ci-dessus : rien de faux ne sort d ici.
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
