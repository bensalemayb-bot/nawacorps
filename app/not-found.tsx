import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  EN_TETE_LOCALE,
  LOCALE_DEFAUT,
  estLocale,
  lien,
  type Locale,
} from "@/lib/i18n";

/**
 * 404 RACINE — le filet de dernier recours, DANS LES DEUX LANGUES.
 *
 * Il en existe deux autres sous app/(site)/ — la francaise et l anglaise — et
 * elles sont plus riches : elles heritent du chrome public (nav, curseur,
 * chatbot) parce qu elles vivent dans le groupe de routes. Mais elles ne
 * repondent QUE pour les `notFound()` leves depuis une page de leur segment :
 * une formule supprimee, une famille dont toutes les lignes sont masquees.
 *
 * Une URL qui ne correspond a AUCUNE route du projet — une faute de frappe, un
 * vieux lien, un robot qui devine des chemins — ne traverse aucun layout de
 * groupe : elle tombe ici. C est la semantique de Next 16, decrite dans
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md :
 * « the root app/not-found.js [...] handle any unmatched URLs for your whole
 * application ». Sans ce fichier, Next servait sa page integree, en anglais,
 * sur fond blanc, sans le moindre lien de retour.
 *
 * >>> POURQUOI ELLE LIT LA LANGUE, ET COMMENT. <<<
 *
 * `/en/blog` n existe pas, ne traverse pas `/en`, et tombait donc ici — en
 * FRANCAIS, sous un `<html lang="en-CH">` que le proxy avait pourtant bien
 * decide. Un visiteur anglophone recevait une impasse dans une langue qu il n a
 * pas choisie, et le document se contredisait lui-meme.
 *
 * TROIS PISTES, UNE SEULE TENUE.
 *  1. `global-not-found.js` EXISTE dans Next 16.3.2 (introduit en 15.4,
 *     toujours EXPERIMENTAL) mais reclame `experimental.globalNotFound` dans
 *     next.config.ts, court-circuite le layout racine — donc il faudrait y
 *     reimporter polices et feuilles de style — et doit rendre un document HTML
 *     complet. Beaucoup de dette pour une page que presque personne ne voit.
 *  2. `usePathname()` dans un composant client : la documentation le mentionne,
 *     mais il faudrait passer tout ce fichier en `"use client"`, y perdre
 *     l export de metadata, et servir du francais avant hydratation.
 *  3. L EN-TETE QUE LE PROXY POSE DEJA. `proxy.ts` ecrit `x-nawa-locale` sur
 *     CHAQUE requete de page, y compris celles qui ne matchent aucune route —
 *     il tourne avant le routage. `app/layout.tsx` le lit deja pour choisir
 *     `<html lang>` ; cette page lit exactement la meme valeur, au meme moment,
 *     et les deux ne peuvent donc pas se contredire. C est la piste tenue.
 *
 * CE QUE `headers()` COUTE ICI : RIEN DE PLUS. Le layout racine l appelle deja,
 * ce qui bascule toutes les routes en rendu dynamique — son propre docblock le
 * dit et l assume. Cette page etait donc deja dynamique avant cette lecture.
 *
 * LA LIMITE CONNUE : le `matcher` du proxy exclut les chemins contenant un
 * point (`/en/vieux.html`). Ceux-la n auront pas d en-tete et retomberont sur
 * le francais. Le site n a aucune URL de cette forme, et une 404 en francais
 * reste une 404 correcte — c est le pire cas, et il est benin.
 *
 * DELIBEREMENT SANS LE CHROME PUBLIC. Le layout racine ne fournit que <html>,
 * <body> et les feuilles de style ; nav, loader et scroll inertiel vivent dans
 * app/(site)/layout.tsx et ne sont pas accessibles d ici. Les reproduire
 * demanderait de dupliquer ce layout pour une page que presque personne ne
 * voit. On garde donc le strict necessaire : la typographie du site, une
 * phrase, et deux chemins pour repartir.
 *
 * PAS DE next/link : convention du depot, les revelations au scroll ne
 * s initialisent qu une fois (voir CLAUDE.md).
 */
async function localeDeLaRequete(): Promise<Locale> {
  const valeur = (await headers()).get(EN_TETE_LOCALE);
  return estLocale(valeur) ? valeur : LOCALE_DEFAUT;
}

/**
 * LES DEUX TEXTES, ecrits ici et nulle part ailleurs.
 *
 * Ils ne passent PAS par lib/dictionnaires : ce fichier vit hors du groupe
 * (site), il est le seul a s en servir, et les y mettre obligerait a exporter
 * une section pour un consommateur unique. La regle du depot — une chaine, une
 * source — est respectee : elle n est ecrite qu une fois.
 *
 * L ANGLAIS SUIT LE GLOSSAIRE : anglais britannique, `services` pour la page
 * du catalogue, et la meme voix sobre que app/(site)/en/not-found.tsx — dont
 * le texte, lui, parle du cas VOISIN mais different (une prestation qui a
 * quitte le catalogue). Ici, c est l adresse elle-meme qui n a jamais existe.
 */
const TEXTES: Record<Locale, {
  erreur: string;
  titre: string;
  corps: string;
  accueil: string;
  services: string;
}> = {
  // L APOSTROPHE EST DROITE (U+0027), comme avant : le JSX ecrivait `&apos;`,
  // qui rend exactement ce caractere-la. En passer une typographique (U+2019)
  // changerait le HTML francais rendu, ce que ce chantier n a pas a faire.
  fr: {
    erreur: "Erreur 404",
    titre: "Cette page n'existe pas.",
    corps:
      "Le lien est peut-être ancien, ou l'adresse comporte une faute de frappe. Rien n'est perdu : tout le site se rejoint depuis l'accueil.",
    accueil: "← Retour à l'accueil",
    services: "Voir tous les services →",
  },
  en: {
    erreur: "Error 404",
    titre: "This page does not exist.",
    corps:
      "The link may be an old one, or the address may carry a typo. Nothing is lost: the whole site can be reached from the home page.",
    accueil: "← Back to the home page",
    services: "See all the services →",
  },
};

/**
 * `generateMetadata` PLUTOT QU UN OBJET `metadata` : le titre change avec la
 * langue, et un objet constant ne peut pas lire l en-tete de la requete.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await localeDeLaRequete();
  return {
    title:
      locale === "en"
        ? "Page not found — Nawa Corps"
        : "Page introuvable — Nawa Corps",
    // Une 404 ne s indexe pas : elle n a rien a offrir a un moteur, et laisser
    // Google la referencer reviendrait a lui donner une impasse a proposer.
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const locale = await localeDeLaRequete();
  const t = TEXTES[locale];
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta">{t.erreur}</span>
        </div>
        <h1 className="t">{t.titre}</h1>
        <div className="studio-txt" style={{ marginTop: 40 }}>
          <p>{t.corps}</p>
          {/* `lien()` laisse le chemin francais intact et prefixe `/en` en
              anglais : renvoyer un visiteur anglophone sur `/` le ferait
              changer de langue au premier clic. */}
          <p style={{ marginTop: 40 }}>
            <a className="lnk" href={lien(locale, "/")}>
              {t.accueil}
            </a>
          </p>
          <p>
            <a className="lnk" href={lien(locale, "/services")}>
              {t.services}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
