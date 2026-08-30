import { whatsapp } from "@/lib/site";
import {
  CHF_UNIT,
  FROM_PREFIX,
  MONTHLY_SUFFIX,
  QUOTE_LABEL,
  formatChfAmount,
  isQuote,
} from "@/lib/format";
import { prisma } from "@/lib/prisma";
import BoutonDevis from "@/components/BoutonDevis";

/**
 * Section Offres — reference/binacore.html lignes 976-1031.
 *
 * Les PRIX, NOMS et DESCRIPTIONS viennent de Postgres. Rien de chiffre n'est
 * ecrit ici : les seuls montants presents sont les mentions barrees « au lieu
 * de », qui sont du contenu editorial sans equivalent en base.
 *
 * La grille rend les `principal` NON-QUOTE — trois cartes, donc la mise en page
 * repeat(3,1fr) de la maquette est preservee. Chaque `principal` QUOTE devient
 * une ligne pleine largeur sous la grille, au style `.p-note` deja porte en B3 :
 * aucune regle CSS nouvelle. Cette ligne n'existe que parce que le service
 * existe en base.
 */

type Editorial = {
  recommended?: boolean;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaOutline: boolean;
  ctaArrow?: boolean;
};

/**
 * Habillage editorial des trois formules, indexe par SLUG.
 *
 * Les cles doivent suivre prisma/seed.ts : la-vitrine, le-site, l-assistant.
 * Un slug qui ne correspond a rien fait simplement disparaitre les puces et le
 * bouton de la carte concernee — pas d'erreur, mais une carte muette.
 *
 * LES PRIX BARRES ONT DISPARU. Les trois portaient exactement -31 %, ce qui
 * revenait a annoncer que le prix de reference n'avait jamais existe. Le champ
 * `was` est retire du type : il ne peut plus revenir par inadvertance.
 */
const EDITORIAL: Record<string, Editorial> = {
  "la-vitrine": {
    bullets: [
      "Une page, lisible sur téléphone",
      "Formulaire de demande qui fonctionne",
      "Appel, itinéraire et horaires en un geste",
      "Domaine et hébergement la 1ʳᵉ année",
    ],
    ctaLabel: "Refaire mon site",
    ctaHref:
      whatsapp("Bonjour, je souhaite faire refaire le site de mon entreprise."),
    ctaOutline: true,
  },
  "le-site": {
    recommended: true,
    bullets: [
      "Tout La Vitrine, plus :",
      "Prise de rendez-vous en ligne",
      "Devis chiffré automatiquement",
      "Fiche Google et photos comprises",
    ],
    ctaLabel: "Lancer mon site",
    ctaHref:
      whatsapp("Bonjour, je veux un site qui reçoive les demandes de devis."),
    ctaOutline: false,
    ctaArrow: true,
  },
  "l-assistant": {
    bullets: [
      "Tout Le Site, plus :",
      "L'assistant de ce site, sur le vôtre",
      "Alerte sur votre téléphone à chaque demande",
      "Relance automatique et tableau de bord",
    ],
    ctaLabel: "Automatiser mes demandes",
    ctaHref:
      whatsapp("Bonjour, l'Assistant m'intéresse pour mon site."),
    ctaOutline: true,
  },
};

// CTA de devis de la maquette (ligne 1060). Le libelle est verbatim ; le ?text=
// est adapte a cette ligne. La maquette contient un seul CTA de devis, ecrit
// pour le menu du studio (« pour un support »), que CarteDuStudio conserve.
const DEVIS_HREF =
  whatsapp("Bonjour, j'aimerais un devis pour un site sur mesure.");
const DEVIS_LABEL = "Demander un devis →";

export default async function Offres() {
  const services = await prisma.service.findMany({
    where: { category: "principal", visible: true },
    orderBy: { sortOrder: "asc" },
  });

  const cards = services.filter((s) => !isQuote(s));
  const quotes = services.filter((s) => isQuote(s));

  // paddingBottom 0 : la carte du studio, rendue juste apres, reconstitue le
  // contexte .green et porte paddingTop 0. La jointure neutralisee des deux
  // cotes redonne exactement l'espacement de la maquette, ou .studio-menu
  // vivait a l'interieur de cette meme section.
  return (
    <section className="offres green" id="offres" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(03)</span>&nbsp; Offres</span>
          <div data-reveal><h2 className="t">Des prix clairs,<br />tout compris.</h2></div>
        </div>

        <div className="price-grid">
          {cards.map((service, i) => {
            const ed = EDITORIAL[service.slug];
            return (
              <article className="price" data-reveal key={service.id}>
                <div className="lab">
                  <span>N° {String(i + 1).padStart(2, "0")}</span>
                  {ed?.recommended ? <span className="rec">Recommandé</span> : null}
                </div>
                <h3>{service.name}</h3>
                <p className="d">{service.description}</p>
                <p className="num">
                  {service.priceCents === null ? (
                    QUOTE_LABEL
                  ) : (
                    <>
                      {service.priceFrom ? <small>{FROM_PREFIX}</small> : null}
                      {formatChfAmount(service.priceCents)}
                      <small>{`${CHF_UNIT} CHF`}</small>
                      {service.isMonthly ? <small className="per">{MONTHLY_SUFFIX}</small> : null}
                    </>
                  )}
                </p>
                {ed ? (
                  <ul>
                    {ed.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                ) : null}
                {ed ? (
                  <a
                    className={ed.ctaOutline ? "btn btn-line" : "btn"}
                    href={ed.ctaHref}
                    target="_blank"
                    rel="noopener"
                  >
                    {ed.ctaLabel}
                    {ed.ctaArrow ? <> <span className="ar">→</span></> : null}
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>

        {quotes.map((service) => (
          <div className="p-note" data-reveal key={service.id}>
            <span>{`${service.name} — ${QUOTE_LABEL}`}</span>
            <BoutonDevis href={DEVIS_HREF} sujet="devis-sur-mesure">
              {DEVIS_LABEL}
            </BoutonDevis>
          </div>
        ))}

        <div className="p-note" data-reveal>
          <span>Prix en francs suisses, TVA comprise, sans frais cachés.</span>
          <span>Suivi et hébergement dès 49.–/mois, à partir de la 2ᵉ année.</span>
        </div>
      </div>
    </section>
  );
}
