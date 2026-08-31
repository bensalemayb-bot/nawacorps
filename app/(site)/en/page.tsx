import type { Metadata } from "next";
import CarteDuStudio from "@/components/CarteDuStudio";
import Faq from "@/components/Faq";
import FooterContact from "@/components/FooterContact";
import Methode from "@/components/Methode";
import NoyauHero from "@/components/NoyauHero";
import Offres from "@/components/Offres";
import ServicesRows from "@/components/ServicesRows";
import Strip from "@/components/Strip";
import Studio from "@/components/Studio";
import Travaux from "@/components/Travaux";
import { chargerCatalogue, prixEntreeCents } from "@/lib/catalogue";
import { formatChfAmount, mentionTva } from "@/lib/format";
import { SITE_NAME, alternatesPage, openGraphPage } from "@/lib/site";

/**
 * L ACCUEIL ANGLAIS, a `/en` — et c est desormais une page traduite, pas une
 * page temoin.
 *
 * CE QU ELLE PROUVAIT DEJA, et qui reste vrai :
 *  1. `proxy.ts` reconnait `/en` et pose `x-nawa-locale: en` ;
 *  2. `app/layout.tsx` lit cet en-tete et rend `<html lang="en-CH">` ;
 *  3. la canonique de cette page est `/en` et non `/` ;
 *  4. les `hreflang` croisent bien `/` et `/en`, dans les deux sens ;
 *  5. la route repond 200.
 *
 * CE QUI A CHANGE. Le corps rendait les memes composants que l accueil
 * francais, et affichait donc du francais sous un `lang="en-CH"` — une
 * contradiction que Google releve, et une fiche de partage qui annoncait un
 * anglais inexistant. Un bandeau d avertissement le disait ici meme. Il est
 * retire : les neuf composants prennent une `locale` et lisent leurs chaines
 * dans lib/dictionnaires, la table Service porte ses colonnes `nameEn` /
 * `descriptionEn`, et lib/format.ts rend « VAT included » au lieu de « TVA
 * comprise ».
 *
 * `"/"` EST DANS `CHEMINS_TRADUITS` (lib/i18n.ts) : c est ce qui autorise
 * `alternatesPage` et le sitemap a annoncer cette page. La liste et cette page
 * doivent bouger ensemble — un `hreflang` vers une URL absente est pire que
 * pas de `hreflang` du tout.
 *
 * `components/SchemaStudio` N EST VOLONTAIREMENT PAS RENDU ICI, alors que
 * l accueil francais le rend. Il emet le `ProfessionalService` du studio sous
 * l `@id` `/#studio`, et cet identifiant designe UNE entite : le declarer une
 * seconde fois depuis une autre URL n ajoute rien et ouvre la porte a deux
 * fiches du meme prestataire qui divergeraient d un mot. La question — une
 * fiche traduite, ou une seule fiche ? — reste ouverte, et elle se tranche
 * dans le composant, pas ici.
 *
 * PAS DE next/link, comme partout sur le site public (decision B7). Les liens
 * internes des neuf composants passent par `lien(locale, …)`, qui prefixe
 * `/en` sans toucher aux `mailto:`, `tel:` et ancres pures.
 */

/**
 * Rendu a chaque requete, exactement pour la raison qui l impose a l accueil
 * francais : `Offres` et `CarteDuStudio` sont des composants serveur qui lisent
 * Postgres, et l etage builder du Dockerfile n a pas de base — un prerendu
 * ferait echouer `next build`. Voir le long releve de mesures en tete de
 * app/(site)/page.tsx : la question est tranchee, ne la rouvrez pas.
 */
export const dynamic = "force-dynamic";

/**
 * TITRE ET DESCRIPTION — et trois interdits du glossaire anglais qui s y
 * jouaient, parce que ce sont les deux chaines que Google lit en premier.
 *
 *  - « SMEs » EST PROSCRIT (§3) : « PME » se dit `small business`. Le titre
 *    l ecrivait.
 *  - « redesign » EST UN FAUX AMI de « refonte » (§3) : on dit `rebuild`, ou
 *    `brought up to date`.
 *  - « Google Business Profile » EST PROSCRIT (§3) : on dit `Google listing`.
 *    La description l ecrivait.
 *
 * ET « one week » NE VOYAGE PAS SEUL, ici non plus : le titre le fait suivre
 * de `nothing to prepare`, qui est le benefice n°1 et la seule chose que le
 * lecteur achete vraiment. C est aussi ce qui distingue cet extrait de tous
 * les autres — un delai isole ne differencie plus rien.
 */
const TITRE = "Website rebuild in Geneva — one week, nothing to prepare";
const DESCRIPTION =
  "Digital design studio in Geneva: websites, identity, print, photography, Google listing, social media. Your site rebuilt in one week — you have nothing to prepare.";

/**
 * DESCRIPTION CONSTRUITE A CHAQUE REQUETE, PRIX COMPRIS — le meme dispositif
 * que app/(site)/page.tsx, et pour la meme raison : dans un extrait Google, le
 * prix d entree qualifie le clic avant la visite. La page francaise l avait,
 * l anglaise ne l avait pas ; deux extraits de la meme page qui ne disent pas
 * la meme chose sont un ecart que personne ne relit.
 *
 * ELLE PASSE PAR chargerCatalogue(), memoisee par requete, donc zero
 * aller-retour en plus : c est la promesse que Offres, CarteDuStudio, Faq et
 * le hero attendent deja.
 *
 * LE `try` N EST PAS DECORATIF : l etage builder du Dockerfile n a pas de
 * base, et une exception ici ferait echouer le build entier. Sans base, on
 * sert la meme phrase sans le prix — jamais un montant invente.
 *
 * LA MENTION DE TVA EST DANS LA MEME PHRASE QUE LE MONTANT, parce que la regle
 * vaut par unite de lecture et qu un extrait de resultat EST une unite de
 * lecture : il est lu hors de toute page.
 */
export async function generateMetadata(): Promise<Metadata> {
  const commun = {
    /**
     * `absolute` — SANS LE SUFFIXE DE MARQUE, comme l accueil francais.
     *
     * app/(site)/layout.tsx declare `title.template` = « … — Nawa Corps » pour
     * les pages filles, et `title.default` pour l accueil, qui ne le porte PAS.
     * Un `title: "…"` ordinaire aurait fait passer cette page par le template :
     * elle serait ressortie avec un second tiret cadratin et la marque en
     * queue, la ou sa jumelle francaise n en a aucun. Deux accueils qui ne se
     * titrent pas de la meme facon, c est exactement l ecart qu un couple
     * `hreflang` est cense ne pas avoir.
     */
    title: { absolute: TITRE },
    alternates: alternatesPage("/", "en"),
    twitter: {
      card: "summary_large_image" as const,
      title: `${TITRE} — ${SITE_NAME}`,
    },
  };

  const habiller = (description: string): Metadata => ({
    ...commun,
    description,
    openGraph: openGraphPage(
      { titre: `${TITRE} — ${SITE_NAME}`, description, chemin: "/" },
      "en",
    ),
    twitter: { ...commun.twitter, description },
  });

  try {
    const cents = prixEntreeCents(await chargerCatalogue());
    if (cents === null) return habiller(DESCRIPTION);
    return habiller(
      `${DESCRIPTION} From ${formatChfAmount(cents)}.–, ${mentionTva("en")}.`,
    );
  } catch {
    return habiller(DESCRIPTION);
  }
}

export default function AccueilEn() {
  return (
    <>
      <NoyauHero locale="en" />
      {/* MEME ORDRE DE SECTIONS QUE L ACCUEIL FRANCAIS, et il doit le rester :
          cet ordre porte deux decisions documentees dans app/(site)/page.tsx —
          le vert contigu en bas de page, et les prix avant les questions. Une
          version anglaise qui reordonne ne serait plus la meme page, et le
          couple hreflang perdrait son sens. */}
      <div className="page-body">
        <Travaux locale="en" />
        <Strip locale="en" />
        <ServicesRows locale="en" />
        <Methode locale="en" />
        <Studio locale="en" />
        <Offres locale="en" />
        <CarteDuStudio locale="en" />
        <Faq locale="en" />
        <FooterContact locale="en" />
      </div>
    </>
  );
}
