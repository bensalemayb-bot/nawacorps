import { whatsapp } from "@/lib/site";
import {
  CHF_UNIT,
  FROM_PREFIX,
  MONTHLY_SUFFIX,
  QUOTE_LABEL,
  TVA_LABEL,
  formatChfAmount,
  isQuote,
} from "@/lib/format";
import { chargerCatalogue, parCategories } from "@/lib/catalogue";
import { POUR_QUI, estFormule } from "@/lib/formules";
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
//
// « sur mesure » a quitte l amorce : le guide de voix le classe parmi les mots
// vides, et il est sature chez quatre concurrents sur six. « multi-pages » dit
// la meme chose et se verifie.
const DEVIS_HREF =
  whatsapp("Bonjour, j'aimerais un devis pour un site à plusieurs pages.");
const DEVIS_LABEL = "Demander un devis →";

export default async function Offres() {
  // Lecture PARTAGEE avec CarteDuStudio, rendue juste apres sur le meme ecran :
  // les deux tiraient chacune sa requete alors que la seconde contenait deja
  // la premiere. Voir lib/catalogue.ts.
  const catalogue = await chargerCatalogue();
  const services = parCategories(catalogue, ["principal"]);

  const cards = services.filter((s) => !isQuote(s));
  const quotes = services.filter((s) => isQuote(s));

  /**
   * LA NOTE DE SUIVI SOUS LA GRILLE, LUE EN BASE.
   *
   * Elle etait ecrite en dur (« dès 49.–/mois ») : un prix fige sous une
   * grille qui, elle, vient de Postgres — les deux divergeaient au premier
   * changement de tarif. Elle porte en plus le montant du suivi OBLIGATOIRE de
   * L Assistant : un prix mensuel impose par un palier et passe sous silence
   * est un prix cache, et il s annonce sur la carte du palier comme sous la
   * grille.
   *
   * Chaque morceau ne s ecrit que si sa ligne existe et porte un montant :
   * base injoignable ou ligne masquee depuis /admin, la phrase se referme sans
   * inventer de chiffre.
   */
  const montant = (slug: string) => {
    const service = catalogue.find((s) => s.slug === slug);
    if (!service || service.priceCents === null) return null;
    return `${formatChfAmount(service.priceCents)}${CHF_UNIT}${MONTHLY_SUFFIX}`;
  };
  const suiviBase = montant("hebergement");
  const suiviAssistant = montant("suivi-assistant");
  const assistant = services.find((s) => s.slug === "l-assistant");
  const noteSuivi = [
    suiviBase
      ? `Suivi et hébergement dès ${suiviBase} à partir de la 2ᵉ année`
      : null,
    suiviAssistant && assistant
      ? `${suiviAssistant} obligatoire avec ${assistant.name}`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  // paddingBottom 0 : la carte du studio, rendue juste apres, reconstitue le
  // contexte .green et porte paddingTop 0. La jointure neutralisee des deux
  // cotes redonne exactement l'espacement de la maquette, ou .studio-menu
  // vivait a l'interieur de cette meme section.
  return (
    <section className="offres green" id="offres" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(06)</span>&nbsp; Offres</span>
          <div data-reveal><h2 className="t">Des prix clairs,<br />tout compris.</h2></div>
        </div>

        <div className="price-grid">
          {cards.map((service) => {
            const ed = EDITORIAL[service.slug];
            return (
              <article className="price" data-reveal key={service.id}>
                {/* LA LIGNE DE TETE DIT A QUI LA FORMULE S ADRESSE, plus
                    « N° 01 / 02 / 03 ». La ligne la plus lisible de la carte
                    numerotait trois cartes qu on voit deja cote a cote : un
                    rang de tri, pas une information. Le libelle vit dans
                    lib/formules.ts parce que /services rend la meme grille.
                    Un `principal` ajoute en base sans libelle laisse la ligne
                    vide plutot que d inventer une promesse. */}
                <div className="lab">
                  <span>{estFormule(service.slug) ? POUR_QUI[service.slug] : ""}</span>
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
                {/* LA MENTION SUIT LE MONTANT, ET NON LA GRILLE. Elle vivait
                    trois blocs plus bas, sous la note de pied : la regle vaut
                    par UNITE DE LECTURE, et le chiffre de 3,8rem qui la
                    reclame est justement ce qu on lit en premier. Elle n est
                    pas qu une obligation — pour un dirigeant, c est le prix
                    qu il n a pas a recalculer.
                    Rendue seulement quand un montant s affiche : sous « sur
                    devis », elle ne voudrait rien dire. */}
                {service.priceCents === null ? null : (
                  <p className="num-tva">{TVA_LABEL}</p>
                )}
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
          {/* « sans frais cachés » est parti : la formule promet l absence de
              ce qu on n attendait pas, et attire l attention sur le soupcon
              qu elle veut lever. Elle est en plus saturee chez trois
              concurrents sur six. Ce qui borne vraiment la prestation, ce sont
              les deux allers-retours et le suivi annonce juste apres. */}
          <span>Prix en francs suisses, TVA comprise. Deux allers-retours de correction compris.</span>
          {noteSuivi ? <span>{`${noteSuivi}.`}</span> : null}
        </div>
      </div>
    </section>
  );
}
