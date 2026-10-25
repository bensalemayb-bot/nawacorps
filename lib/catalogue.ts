import { cache } from "react";
import { CHF_UNIT, formatChfAmount, mentionTva, suffixeMensuel } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

/**
 * LA TABLE `Service`, LUE UNE SEULE FOIS PAR REQUETE.
 *
 * LE SITE PUBLIC EN LIT QUATRE LIGNES : la mise en place de l assistant
 * (`SLUG_MISE_EN_PLACE`, 24.10.2026) et les trois paliers de l abonnement
 * (`SLUGS_ABONNEMENT`, 25.10.2026). Les lignes de l ancienne offre (formules
 * de site, suivi, imprimes...) restent en base pour /admin, et rien sur le
 * site public ne les affiche.
 *
 * `cache()` DE REACT, ET SURTOUT PAS UN CACHE ENTRE REQUETES. La memoisation
 * ne vit que le temps d UN rendu : le hero, la section (05) et la FAQ qui
 * appellent cette fonction pendant la meme requete se partagent la meme
 * promesse, et la requete suivante repart en base. C est delibere : un cache
 * persistant (`unstable_cache`, `revalidate`) ne gagnait que quelques
 * millisecondes sur un TTFB deja a 17 ms, en echange d une fenetre pendant
 * laquelle un prix corrige en base resterait faux a l ecran. En Suisse la LCD
 * (art. 3) vise les indications trompeuses.
 *
 * AUCUN `select` : le modele Service n a que dix colonnes, toutes scalaires.
 */
export const chargerCatalogue = cache(async () => {
  return prisma.service.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
});

/** Une ligne de la table, telle que la rendent les pages. */
export type ServiceCatalogue = Awaited<
  ReturnType<typeof chargerCatalogue>
>[number];

/**
 * LA MISE EN PLACE DE L ASSISTANT — le seul montant que le site affiche.
 *
 * Decision d Ayoub du 24.10.2026 (.agents/product-marketing.md, « Prix et
 * donnees ») : la mise en place est affichee avec sa mention de TVA (lib/format.ts), sans « dès ».
 * L abonnement mensuel a sa propre grille depuis le 25.10.2026
 * (`SLUGS_ABONNEMENT` plus bas). Les anciennes formules (la-vitrine, le-site,
 * l-assistant) restent en base pour /admin, mais plus rien sur le site public
 * ne les lit.
 *
 * LE SLUG EST LA SEULE CHOSE QUE LE CODE CONNAIT PAR COEUR. La ligne vient de
 * prisma/seed.ts ; la renommer en base sans renommer cette constante fait
 * simplement disparaitre le montant, jamais la page.
 */
export const SLUG_MISE_EN_PLACE = "assistant-mise-en-place";

/**
 * Le montant de la mise en place, formate (« 1'500.– »), ou `null`.
 *
 * `null` quand la ligne manque, est masquee depuis /admin ou n a pas de prix :
 * chaque appelant a alors une phrase SANS montant, jamais un trou ni un
 * chiffre invente. Le montant ne voyage jamais seul : `avecPrix` ci-dessous
 * lui colle la mention de TVA.
 */
export function montantMiseEnPlace(
  catalogue: readonly ServiceCatalogue[],
): string | null {
  const ligne = catalogue.find((s) => s.slug === SLUG_MISE_EN_PLACE);
  if (!ligne || ligne.priceCents === null) return null;
  return `${formatChfAmount(ligne.priceCents)}${CHF_UNIT}`;
}

/**
 * La meme chose, base comprise, ET SANS JAMAIS LEVER.
 *
 * L etage builder du Dockerfile n a pas de base, et une page qui affiche ce
 * montant (accueil, /services, metadata) ne doit pas faire echouer un build ni
 * tomber en erreur parce que Postgres est injoignable : sans base, la phrase se
 * referme sans montant. `chargerCatalogue()` reste memoisee par requete, donc
 * appeler cette fonction depuis plusieurs composants du meme ecran ne coute
 * qu une lecture.
 */
export async function lireMiseEnPlace(): Promise<string | null> {
  try {
    return montantMiseEnPlace(await chargerCatalogue());
  } catch {
    return null;
  }
}

/**
 * Le prix de la mise en place en centimes, pour l `Offer` du JSON-LD (voir
 * `offreMiseEnPlace` ci-dessous), ou `null`. Meme ligne et meme regle que `lireMiseEnPlace` :
 * lecture memoisee par requete, et jamais d exception.
 */
export async function lireCentsMiseEnPlace(): Promise<number | null> {
  try {
    const ligne = (await chargerCatalogue()).find((s) => s.slug === SLUG_MISE_EN_PLACE);
    return ligne?.priceCents ?? null;
  } catch {
    return null;
  }
}

/**
 * L `Offer` JSON-LD DE LA MISE EN PLACE, avec sa mention de TVA — une seule
 * fabrique pour /services et les pages metiers (audit CRO/SEO v2, §3.4).
 *
 * POURQUOI. La regle « aucun prix sans la mention de TVA » vaut aussi pour la
 * donnee republiee hors de la page : un moteur qui lit `price: 1500.00 CHF`
 * seul l affiche sans la phrase qui l accompagne a l ecran. La mention de
 * lib/format.ts (`mentionTva`) voyage donc DANS l Offer, en `description`
 * sur l offre et sur sa `PriceSpecification`.
 *
 * `valueAddedTaxIncluded` N EST PAS EMIS, et c est la coherence avec
 * lib/format.ts : `true` declarerait une TVA comprise (faux, l entreprise
 * n est pas assujettie), `false` une TVA en sus (tout aussi faux). Sans la
 * propriete, le prix se lit comme le montant paye, et la description dit
 * pourquoi.
 *
 * `null` sans montant en base : pas d Offer du tout, jamais un prix invente.
 */
export function offreMiseEnPlace(
  cents: number | null,
  locale: Locale,
  nom: string,
): Record<string, unknown> | null {
  if (cents === null) return null;
  const montant = `${formatChfAmount(cents)}${CHF_UNIT}`;
  const tva = mentionTva(locale);
  const description =
    locale === "en"
      ? `${nom}: ${montant}, ${tva}. Paid once, after the trial, if the report suits you.`
      : `${nom} : ${montant}, ${tva}. Payée une seule fois, après l'essai, si le relevé vous convient.`;
  return {
    "@type": "Offer",
    name: nom,
    description,
    price: (cents / 100).toFixed(2),
    priceCurrency: "CHF",
    priceSpecification: {
      "@type": "PriceSpecification",
      price: (cents / 100).toFixed(2),
      priceCurrency: "CHF",
      description: tva,
    },
  };
}

/**
 * LES TROIS PALIERS DE L ABONNEMENT MENSUEL — decision d Ayoub du 25.10.2026
 * (founder/pricing.md §4) : Essentiel, Standard, Complet, dans cet ordre.
 *
 * Comme pour la mise en place, LE SLUG EST LA SEULE CHOSE QUE LE CODE CONNAIT.
 * Le nom, la description (taches et volume) et le prix viennent de la ligne en
 * base (prisma/seed.ts, scripts/ajouter-abonnements.ts) : corriger un palier
 * depuis /admin le corrige sur l accueil, /services, la FAQ, le JSON-LD,
 * llms.txt et le prompt de Leo.
 */
export const SLUGS_ABONNEMENT = [
  "abonnement-essentiel",
  "abonnement-standard",
  "abonnement-complet",
] as const;

/** Un palier, pret a afficher dans la langue de la page. */
export type PalierAbonnement = {
  slug: (typeof SLUGS_ABONNEMENT)[number];
  nom: string;
  description: string;
  cents: number;
  /** « 190.– », sans suffixe : l appelant ajoute « /mois » et la mention. */
  montant: string;
};

/**
 * La grille, ou `null` — ET C EST TOUT OU RIEN. Une grille a qui manque un
 * palier (ligne absente, masquee depuis /admin, sans prix) laisserait croire
 * que l offre s arrete a deux paliers : sans les trois, chaque appelant se
 * replie sur sa phrase sans montant, jamais sur un chiffre invente.
 */
export function paliersAbonnement(
  catalogue: readonly ServiceCatalogue[],
  locale: Locale,
): PalierAbonnement[] | null {
  const paliers: PalierAbonnement[] = [];
  for (const slug of SLUGS_ABONNEMENT) {
    const ligne = catalogue.find((s) => s.slug === slug);
    if (!ligne || ligne.priceCents === null) return null;
    paliers.push({
      slug,
      nom: (locale === "en" ? ligne.nameEn : null) ?? ligne.name,
      description:
        (locale === "en" ? ligne.descriptionEn : null) ?? ligne.description ?? "",
      cents: ligne.priceCents,
      montant: `${formatChfAmount(ligne.priceCents)}${CHF_UNIT}`,
    });
  }
  return paliers;
}

/** La meme chose, base comprise, et sans jamais lever (voir `lireMiseEnPlace`). */
export async function lirePaliers(locale: Locale): Promise<PalierAbonnement[] | null> {
  try {
    return paliersAbonnement(await chargerCatalogue(), locale);
  } catch {
    return null;
  }
}

/**
 * L OFFRE D INTRODUCTION — decision d Ayoub du 25.10.2026 : le palier
 * Standard au prix de l Essentiel pendant 12 mois, pour 3 entreprises par
 * trimestre, jusqu au 31 janvier 2027.
 *
 * CADREE COMME UNE LIMITE DE CAPACITE, ET C EST LA VERITE : chaque mise en
 * place se fait a la main, et le studio n en prend que trois par trimestre a
 * ce tarif. Ni compte a rebours, ni « plus que N places » : la LCD (art. 3)
 * vise aussi la fausse rarete.
 *
 * PAS D EFFET DE PRIX BARRE (decision d Ayoub du 25.10.2026) : la phrase dit
 * le palier et le prix de l Essentiel, lu en base, jamais « au lieu de » ni
 * le prix du Standard a cote. Le prix barre est refuse par
 * .agents/product-marketing.md.
 *
 * ELLE S ETEINT SEULE APRES LA DATE : une offre echue encore affichee serait
 * une indication inexacte. Les pages qui la portent lisent la base a chaque
 * requete, la date est donc testee a chaque rendu.
 */
export const FIN_OFFRE_INTRODUCTION = "2027-01-31";

export function offreIntroductionActive(maintenant: Date = new Date()): boolean {
  // Fin de journee, heure de Geneve en hiver (UTC+1).
  return maintenant.getTime() <= Date.parse(`${FIN_OFFRE_INTRODUCTION}T23:59:59+01:00`);
}

/**
 * La phrase de l offre d introduction, montants et mention de TVA compris, ou
 * `null` (offre echue, ou grille incomplete en base).
 */
export function texteOffreIntroduction(
  paliers: readonly PalierAbonnement[] | null,
  locale: Locale,
): string | null {
  if (!paliers || !offreIntroductionActive()) return null;
  const standard = paliers.find((p) => p.slug === "abonnement-standard");
  const essentiel = paliers.find((p) => p.slug === "abonnement-essentiel");
  if (!standard || !essentiel) return null;
  const mois = suffixeMensuel(locale);
  const tva = mentionTva(locale);
  return locale === "en"
    ? `Introductory rate: the ${standard.nom} tier at the ${essentiel.nom} price, ${essentiel.montant}${mois}, ${tva}, for 12 months, for 3 businesses per quarter, until 31 January 2027.`
    : `Tarif d'introduction : le palier ${standard.nom} au prix de l'${essentiel.nom}, ${essentiel.montant}${mois}, ${tva}, pendant 12 mois, pour 3 entreprises par trimestre, jusqu'au 31 janvier 2027.`;
}

/**
 * Les `Offer` JSON-LD des trois paliers : le prix mensuel en
 * `UnitPriceSpecification` (`billingDuration` P1M), et la mention de TVA en
 * `description`, pour la meme raison que `offreMiseEnPlace`. Liste vide sans
 * grille complete.
 */
export function offresAbonnement(
  paliers: readonly PalierAbonnement[] | null,
  locale: Locale,
): Record<string, unknown>[] {
  if (!paliers) return [];
  const tva = mentionTva(locale);
  const mois = suffixeMensuel(locale);
  return paliers.map((p) => ({
    "@type": "Offer",
    name: locale === "en" ? `Subscription — ${p.nom}` : `Abonnement — ${p.nom}`,
    description:
      locale === "en"
        ? `${p.description} ${p.montant}${mois}, ${tva}. No commitment, cancellable every month.`
        : `${p.description} ${p.montant}${mois}, ${tva}. Sans engagement, résiliable chaque mois.`,
    price: (p.cents / 100).toFixed(2),
    priceCurrency: "CHF",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: (p.cents / 100).toFixed(2),
      priceCurrency: "CHF",
      billingDuration: "P1M",
      description: tva,
    },
  }));
}

/**
 * La grille en une phrase, pour la FAQ, llms.txt et le prompt de Leo :
 * « Essentiel 190.–/mois (une tâche, …) ; Standard … ». SANS la mention de
 * TVA : l appelant la pose une fois, dans la meme phrase.
 */
export function phrasePaliers(paliers: readonly PalierAbonnement[], locale: Locale): string {
  const mois = suffixeMensuel(locale);
  return paliers
    .map((p) => {
      // Les parentheses de la description deviennent des virgules : la phrase
      // met deja chaque detail entre parentheses.
      const detail = p.description.replace(/\.$/, "").replace(/\s*\(([^)]*)\)/g, ", $1");
      const minuscule = detail.charAt(0).toLowerCase() + detail.slice(1);
      return `${p.nom} ${p.montant}${mois} (${minuscule})`;
    })
    .join(locale === "en" ? "; " : " ; ");
}

/**
 * Remplit un gabarit du dictionnaire : `{montant}` recoit « 1'500.– » et
 * `{tva}` la mention de lib/format.ts dans la langue de la page.
 *
 * LES DEUX JETONS SONT LA POUR QUE LA MENTION NE SOIT JAMAIS RECOPIEE dans le
 * dictionnaire : la mention de TVA n existe qu a un endroit (lib/format.ts), et
 * un gabarit qui porte `{montant}` porte toujours `{tva}` dans la meme phrase.
 */
export function avecPrix(gabarit: string, montant: string, locale: Locale): string {
  return gabarit.replaceAll("{montant}", montant).replaceAll("{tva}", mentionTva(locale));
}
