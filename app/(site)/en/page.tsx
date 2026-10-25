import type { Metadata } from "next";
import Chiffres from "@/components/Chiffres";
import Faq from "@/components/Faq";
import FooterContact from "@/components/FooterContact";
import Methode from "@/components/Methode";
import NoyauHero from "@/components/NoyauHero";
import Offres from "@/components/Offres";
import SchemaStudio from "@/components/SchemaStudio";
import ServicesRows from "@/components/ServicesRows";
import Strip from "@/components/Strip";
import Studio from "@/components/Studio";
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
 * retire : les composants prennent une `locale` et lisent leurs chaines dans
 * lib/dictionnaires, et lib/format.ts rend la mention de TVA en anglais
 * (« no VAT (business not VAT-registered) »).
 *
 * `"/"` EST DANS `CHEMINS_TRADUITS` (lib/i18n.ts) : c est ce qui autorise
 * `alternatesPage` et le sitemap a annoncer cette page. La liste et cette page
 * doivent bouger ensemble — un `hreflang` vers une URL absente est pire que
 * pas de `hreflang` du tout.
 *
 * `components/SchemaStudio` EST RENDU ICI EN ANGLAIS DEPUIS LE 25.10.2026
 * (decision d Ayoub, audit CRO/SEO v3, 3.8). Les `Service` des pages
 * anglaises pointent vers `/#studio` : sans fiche sur `/en`, ce renvoi ne
 * menait a rien dans la langue de la page. C est la meme entite, sous le meme
 * `@id` ; le composant tient les deux langues cote a cote pour qu elles ne
 * divergent pas d un mot.
 *
 * PAS DE next/link, comme partout sur le site public (decision B7). Les liens
 * internes des neuf composants passent par `lien(locale, …)`, qui prefixe
 * `/en` sans toucher aux `mailto:`, `tel:` et ancres pures.
 */

/**
 * Rendu a chaque requete, exactement pour la raison qui l impose a l accueil
 * francais : `NoyauHero`, `Offres` et `Faq` lisent le montant de la mise en
 * place dans Postgres, et l etage builder du Dockerfile n a pas de base — un prerendu
 * ferait echouer `next build`. Voir le long releve de mesures en tete de
 * app/(site)/page.tsx : la question est tranchee, ne la rouvrez pas.
 */
export const dynamic = "force-dynamic";

/**
 * TITRE ET DESCRIPTION (docs/agents/copy/meta.md §1), miroir de l accueil
 * francais. « small business » et jamais « SME » (glossaire §3). Aucun montant
 * dans l extrait : le seul prix du site se lit dans la page, avec sa mention.
 */
const TITRE = "AI assistant for tradespeople and small firms in Geneva";
const DESCRIPTION =
  "It drafts your quotes, follows up and takes enquiries, never committing on your behalf. You see it, try it for two weeks, pay after.";

export function generateMetadata(): Metadata {
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

  return habiller(DESCRIPTION);
}

export default function AccueilEn() {
  return (
    <>
      {/* Donnee structuree du studio, en anglais. N emet qu un <script>. */}
      <SchemaStudio locale="en" />
      <NoyauHero locale="en" />
      {/* MEME ORDRE DE SECTIONS QUE L ACCUEIL FRANCAIS, et il doit le rester :
          une version anglaise qui reordonne ne serait plus la meme page, et le
          couple hreflang perdrait son sens. */}
      <div className="page-body">
        <Strip locale="en" />
        <Chiffres locale="en" />
        <ServicesRows locale="en" />
        <Methode locale="en" />
        <Studio locale="en" />
        <Offres locale="en" />
        <Faq locale="en" />
        <FooterContact indexSection="07" locale="en" />
      </div>
    </>
  );
}
