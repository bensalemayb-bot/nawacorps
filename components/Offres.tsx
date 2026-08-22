import {
  CHF_UNIT,
  FROM_PREFIX,
  MONTHLY_SUFFIX,
  QUOTE_LABEL,
  formatChfAmount,
  isQuote,
} from "@/lib/format";
import { prisma } from "@/lib/prisma";

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
  was: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaOutline: boolean;
  ctaArrow?: boolean;
};

// Habillage editorial, verbatim de la maquette, indexe par slug.
const EDITORIAL: Record<string, Editorial> = {
  "la-carte": {
    was: "650.–",
    bullets: [
      "Mise en page complète du menu",
      "QR code vers la carte en ligne",
      "Fichiers d'impression fournis",
      "Changements de prix inclus 3 mois",
    ],
    ctaLabel: "Refaire ma carte",
    ctaHref:
      "https://wa.me/41760000000?text=Bonjour%2C%20je%20souhaite%20refaire%20la%20carte%20de%20mon%20commerce.",
    ctaOutline: true,
  },
  "le-site": {
    recommended: true,
    was: "2'800.–",
    bullets: [
      "One-page : carte, horaires, contact",
      "Domaine + hébergement 1ʳᵉ année",
      "Appel et itinéraire en un geste",
      "Mise en ligne complète",
    ],
    ctaLabel: "Avoir mon site",
    ctaHref:
      "https://wa.me/41760000000?text=Bonjour%2C%20je%20souhaite%20un%20site%20pour%20mon%20commerce.",
    ctaOutline: false,
    ctaArrow: true,
  },
  "pack-complet": {
    was: "4'200.–",
    bullets: [
      "La Carte + Le Site",
      "Fiche Google optimisée",
      "Photos de votre commerce",
      "Un seul interlocuteur, du début à la fin",
    ],
    ctaLabel: "Tout remettre à niveau",
    ctaHref:
      "https://wa.me/41760000000?text=Bonjour%2C%20le%20pack%20complet%20m%27int%C3%A9resse.",
    ctaOutline: true,
  },
};

// Seul CTA de devis present dans la maquette (ligne 1060), repris verbatim.
const DEVIS_HREF =
  "https://wa.me/41760000000?text=Bonjour%2C%20j%27aimerais%20un%20devis%20pour%20un%20support.";
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
                {ed ? <p className="was"><s>{ed.was}</s> · tarif de lancement</p> : null}
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
            <a className="lnk" href={DEVIS_HREF} target="_blank" rel="noopener">{DEVIS_LABEL}</a>
          </div>
        ))}

        <div className="p-note" data-reveal>
          <span>Tous les prix s&apos;entendent tout compris, sans frais cachés.</span>
          <span>Tarifs de lancement — cinq premiers commerces.</span>
        </div>
      </div>
    </section>
  );
}
