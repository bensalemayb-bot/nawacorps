import {
  CHF_UNIT,
  formatChfAmount,
  isQuote,
  libelleDevis,
  mentionTva,
  prefixeDes,
  suffixeMensuel,
} from "@/lib/format";
import {
  chargerCatalogue,
  descriptionService,
  nomService,
  parCategories,
} from "@/lib/catalogue";
import { POUR_QUI, POUR_QUI_EN, estFormule } from "@/lib/formules";
import { dictionnaire, type Dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";
import BoutonDevis from "@/components/BoutonDevis";

/**
 * Section Offres — reference/binacore.html lignes 976-1031.
 *
 * Les PRIX, NOMS et DESCRIPTIONS viennent de Postgres. Rien de chiffre n'est
 * ecrit ici, et aucun montant non plus.
 *
 * La grille rend les `principal` NON-QUOTE — trois cartes, donc la mise en page
 * repeat(3,1fr) de la maquette est preservee. Chaque `principal` QUOTE devient
 * une ligne pleine largeur sous la grille, au style `.p-note` deja porte en B3 :
 * aucune regle CSS nouvelle. Cette ligne n'existe que parce que le service
 * existe en base.
 *
 * ------------------------------------------------------------------------
 * CE QUI A CHANGE AVEC LE CHANTIER ANGLAIS, et c'etait le defaut le plus
 * visible de /en : cette grille affichait « TVA comprise » SOUS DES PRIX
 * ANGLAIS. Elle importait `TVA_LABEL`, `QUOTE_LABEL`, `FROM_PREFIX` et
 * `MONTHLY_SUFFIX` — les quatre constantes FRANCAISES de lib/format.ts. Elles
 * ne sont pas depreciees, mais elles n'ont leur place que dans un composant qui
 * ignore sa langue ; celui-ci la connait, il appelle donc les fonctions
 * `mentionTva()`, `libelleDevis()`, `prefixeDes()` et `suffixeMensuel()`.
 *
 * MEME REGLE POUR LE NOM ET LA DESCRIPTION : `nomService()` et
 * `descriptionService()` de lib/catalogue.ts, jamais `service.name` en direct.
 * Le repli sur le francais qu'elles portent n'est pas un accident a reparer —
 * c'est lui qui fait afficher « La Vitrine », « Le Site » et « L'Assistant »
 * tels quels sur la page anglaise, parce que les trois formules sont des noms
 * propres (`nameEn = null` volontairement en base).
 *
 * LA MENTION DE TVA VAUT PAR UNITE DE LECTURE, dans les deux langues. Elle est
 * collee sous chaque montant de carte, et elle est reprise dans la note de bas
 * de grille — jamais recopiee a la main : les deux mots qui portent
 * l'obligation viennent de lib/format.ts, ou ils sont ecrits une seule fois
 * pour tout le site. Ce qui est ici, c'est la moitie NON legale de la phrase
 * (« Prix en francs suisses » / « Prices in Swiss francs »).
 */

type Editorial = {
  recommended?: boolean;
  bullets: string[];
  ctaLabel: string;
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
 * C'EST DESORMAIS UNE FONCTION DU DICTIONNAIRE, et non plus une constante de
 * module : les puces et les libelles de bouton sont du texte, et du texte se
 * traduit. Ce qui reste en dur ici — quelle carte est recommandee, laquelle
 * porte un bouton plein, laquelle porte une fleche — n'est pas du texte : c'est
 * la hierarchie visuelle de la grille, et elle est la meme dans les deux
 * langues.
 *
 * LES PRIX BARRES ONT DISPARU. Les trois portaient exactement -31 %, ce qui
 * revenait a annoncer que le prix de reference n'avait jamais existe. Le champ
 * `was` est retire du type : il ne peut plus revenir par inadvertance.
 */
function editorial(t: Dictionnaire): Record<string, Editorial> {
  return {
    "la-vitrine": {
      bullets: [
        t.offres.vitrinePuce1,
        t.offres.vitrinePuce2,
        t.offres.vitrinePuce3,
        t.offres.vitrinePuce4,
      ],
      ctaLabel: t.offres.vitrineCta,
      ctaOutline: true,
    },
    "le-site": {
      recommended: true,
      bullets: [
        t.offres.sitePuce1,
        t.offres.sitePuce2,
        t.offres.sitePuce3,
        t.offres.sitePuce4,
      ],
      ctaLabel: t.offres.siteCta,
      ctaOutline: false,
      ctaArrow: true,
    },
    "l-assistant": {
      bullets: [
        t.offres.assistantPuce1,
        t.offres.assistantPuce2,
        t.offres.assistantPuce3,
        t.offres.assistantPuce4,
      ],
      ctaLabel: t.offres.assistantCta,
      ctaOutline: true,
    },
  };
}

export default async function Offres({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);
  const EDITORIAL = editorial(t);

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
   *
   * LE NOM DE LA FORMULE EST NOMME PLUTOT QUE SA CATEGORIE — « obligatoire avec
   * L'Assistant », « compulsory with L'Assistant ». C'est la regle du §6 du
   * glossaire anglais, et elle vaut aussi bien en francais : une categorie
   * n'annonce rien, un nom propre situe.
   */
  const montant = (slug: string) => {
    const service = catalogue.find((s) => s.slug === slug);
    if (!service || service.priceCents === null) return null;
    return `${formatChfAmount(service.priceCents)}${CHF_UNIT}${suffixeMensuel(locale)}`;
  };
  const suiviBase = montant("hebergement");
  const suiviAssistant = montant("suivi-assistant");
  const assistant = services.find((s) => s.slug === "l-assistant");
  const noteSuivi = [
    suiviBase
      ? `${t.offres.noteSuiviAvant}${suiviBase}${t.offres.noteSuiviApres}`
      : null,
    suiviAssistant && assistant
      ? `${suiviAssistant}${t.offres.noteSuiviAssistantAvant}${nomService(assistant, locale)}`
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
          <span className="meta" data-reveal><span className="index">(05)</span>{`\u00A0 ${t.offres.section}`}</span>
          <div data-reveal><h2 className="t">{t.offres.titreLigne1}<br />{t.offres.titreLigne2}</h2></div>
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
                    vide plutot que d inventer une promesse.
                    `POUR_QUI_EN` est un `Partial` VOLONTAIRE : un libelle
                    anglais manquant retombe sur le francais plutot que de vider
                    la ligne la plus haute de la carte. */}
                <div className="lab">
                  <span>
                    {estFormule(service.slug)
                      ? locale === "en"
                        ? (POUR_QUI_EN[service.slug] ?? POUR_QUI[service.slug])
                        : POUR_QUI[service.slug]
                      : ""}
                  </span>
                  {ed?.recommended ? <span className="rec">{t.offres.recommande}</span> : null}
                </div>
                {/* LE NOM OUVRE LA PAGE DE LA FORMULE. Les trois pages
                    /services/<slug> etaient INATTEIGNABLES depuis l accueil :
                    elles existaient, elles etaient au sitemap, et aucun lien de
                    la page d entree n y menait — seul le bouton de devis sortait
                    de la carte. Le titre est le lien naturel : c est ce qu on
                    clique pour « en savoir plus ».
                    LE SLUG NE SE TRADUIT PAS : `lien()` prefixe `/en` et laisse
                    `/services/le-site` intact. Un slug traduit casserait les
                    ancres que lib/catalogue-familles.ts pointe.
                    LA CARTE ENTIERE N EST PAS ENVELOPPEE, et c est une regle,
                    pas un gout : elle contient deja un bouton, et un lien dans
                    un lien est du HTML invalide — le navigateur casse
                    l imbrication et le resultat n est pas celui qu on croit.
                    Un `principal` qui ne serait pas une formule (site sur
                    mesure) n a pas de page : son titre reste du texte. */}
                <h3>
                  {estFormule(service.slug) ? (
                    <a className="lnk" href={lien(locale, `/services/${service.slug}`)}>
                      {nomService(service, locale)}
                    </a>
                  ) : (
                    nomService(service, locale)
                  )}
                </h3>
                <p className="d">{descriptionService(service, locale)}</p>
                <p className="num">
                  {service.priceCents === null ? (
                    libelleDevis(locale)
                  ) : (
                    <>
                      {service.priceFrom ? <small>{prefixeDes(locale)}</small> : null}
                      {formatChfAmount(service.priceCents)}
                      <small>{CHF_UNIT}</small>
                      {service.isMonthly ? <small className="per">{suffixeMensuel(locale)}</small> : null}
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
                  <p className="num-tva">{mentionTva(locale)}</p>
                )}
                {/* LE SUIVI OBLIGATOIRE DE L ASSISTANT, SUR LA CARTE, AVANT LE
                    BOUTON. Il n apparaissait qu apres le bouton, dans la note
                    de bas de grille (`noteSuivi` ci-dessus) — un engagement
                    recurrent impose par le palier et lisible seulement APRES
                    l achat est un prix cache. Le guide de voix (pilier 3)
                    impose deux emplacements : la carte, et sous la grille.
                    /services/l-assistant applique deja cette regle
                    (app/(site)/services/[slug]/page.tsx) ; cette carte reprend
                    la meme formulation, condensee. Montant lu en base comme
                    partout ailleurs — rendu seulement si la ligne
                    `suivi-assistant` existe et porte un prix. */}
                {service.slug === "l-assistant" && suiviAssistant ? (
                  <p className="num-tva">{`${t.offres.suiviAssistantAvant}${suiviAssistant}${t.offres.suiviAssistantApres}`}</p>
                ) : null}
                {ed ? (
                  <ul>
                    {ed.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                ) : null}
                {/* LE CTA NOMME ENFIN LA FORMULE QU IL VEND. Les trois
                    pointaient sur WhatsApp, en `target="_blank"`, avec une
                    amorce qui ne disait pas quelle formule avait ete cliquee :
                    le visiteur quittait le site pour une conversation ou il
                    fallait tout reexpliquer. Ils pointent desormais sur
                    /devis?p=<slug>, qui nomme la formule et son prix lus en
                    base avant d ouvrir l assistant.
                    `target="_blank"` EST RETIRE : on ne quitte plus le site, il
                    n y a plus rien a preserver dans l onglet d origine, et un
                    lien interne qui ouvre un onglet fait perdre le fil.
                    LES LIBELLES NE BOUGENT PAS : ils viennent du guide de voix
                    §7, un par palier, et promettent le benefice plutot que la
                    demarche. Leur version anglaise est celle de
                    lib/formules.ts (`ctaEn`), au mot pres — la page produit et
                    cette carte vendent la meme chose sous le meme nom. */}
                {ed ? (
                  <a
                    className={ed.ctaOutline ? "btn btn-line" : "btn"}
                    href={lien(locale, `/devis?p=${encodeURIComponent(service.slug)}`)}
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
            <span>{`${nomService(service, locale)} — ${libelleDevis(locale)}`}</span>
            <BoutonDevis sujet="devis-sur-mesure">
              {t.offres.ctaDevis}
            </BoutonDevis>
          </div>
        ))}

        <div className="p-note" data-reveal>
          {/* « sans frais cachés » est parti : la formule promet l absence de
              ce qu on n attendait pas, et attire l attention sur le soupcon
              qu elle veut lever. Elle est en plus saturee chez trois
              concurrents sur six. Ce qui borne vraiment la prestation, ce sont
              les deux allers-retours et le suivi annonce juste apres.
              LA MENTION DE TVA N EST PAS RECOPIEE ICI, dans aucune des deux
              langues : elle vient de `mentionTva()`, ou elle est ecrite une
              seule fois pour tout le site. Une mention a valeur legale qui
              existe a deux endroits finit par diverger. */}
          <span>{`${t.offres.notePrix}, ${mentionTva(locale)}. ${t.offres.noteCorrections}`}</span>
          {noteSuivi ? <span>{`${noteSuivi}.`}</span> : null}
        </div>
      </div>
    </section>
  );
}
