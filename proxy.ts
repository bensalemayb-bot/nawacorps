import { NextResponse, type NextRequest } from "next/server";
import { EN_TETE_LOCALE, localeDepuisChemin } from "@/lib/i18n";

/**
 * PROXY — il ne fait qu'UNE chose : dire au layout racine quelle langue servir.
 *
 * POURQUOI CE FICHIER S'APPELLE `proxy.ts` ET NON `middleware.ts`. La
 * convention `middleware.js|ts` est DÉPRÉCIÉE depuis Next 16 et renommée en
 * `proxy.js|ts` — voir
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/middleware.md`.
 * Les deux fonctionnent encore, mais AGENTS.md impose de tenir compte des avis
 * de dépréciation. L'export s'appelle donc `proxy`, pas `middleware`, et il n'y
 * a pas de `middleware.ts` à la racine — les deux conventions ensemble
 * seraient une source d'ambiguïté pour rien.
 *
 * POURQUOI UN EN-TÊTE ET PAS AUTRE CHOSE. Il n'existe qu'un seul layout racine
 * et il ne rend qu'un seul `<html>` ; l'attribut `lang` doit pourtant valoir
 * `fr-CH` sur `/studio` et `en-CH` sur `/en`. Un cookie serait faux (il
 * survivrait à un changement de page), une variable de module serait pire (le
 * proxy tourne hors du processus de rendu, parfois sur un CDN — la
 * documentation le rappelle explicitement). Reste l'en-tête de requête, qui
 * est le canal prévu pour passer une information du proxy à l'application.
 *
 * `NextResponse.next({ request: { headers } })` ET SURTOUT PAS
 * `NextResponse.next({ headers })`. Le premier réécrit les en-têtes de la
 * REQUÊTE, que `headers()` lira côté serveur ; le second les poserait sur la
 * RÉPONSE, c'est-à-dire chez le visiteur, où personne n'en a l'usage.
 *
 * IL NE REDIRIGE RIEN, ET C'EST DÉLIBÉRÉ. Aucune négociation sur
 * `Accept-Language` : un visiteur genevois dont le navigateur est en anglais
 * arriverait sur `/en` sans l'avoir demandé, et Googlebot — qui annonce
 * l'anglais — verrait la version anglaise à l'adresse française, ce qui suffit
 * à faire désindexer le site français. La langue se choisit par l'URL, jamais
 * par le navigateur.
 *
 * IL LIT `lib/i18n.ts` PLUTÔT QUE DE RECOPIER LA RÈGLE. La documentation
 * déconseille de s'appuyer sur des modules PARTAGÉS AU SENS D'UN ÉTAT commun
 * (globals, caches) ; importer des fonctions pures sur des chaînes n'a rien à
 * voir, et c'est la seule façon que « `/en` est anglais » ne s'écrive qu'une
 * fois pour le proxy, le layout, les liens et les canoniques.
 */
export function proxy(request: NextRequest) {
  const locale = localeDepuisChemin(request.nextUrl.pathname);

  const enTetes = new Headers(request.headers);
  enTetes.set(EN_TETE_LOCALE, locale);

  return NextResponse.next({ request: { headers: enTetes } });
}

/**
 * OÙ CE PROXY TOURNE — et surtout où il ne tourne pas.
 *
 * Sans `matcher`, il s'exécuterait sur CHAQUE requête, y compris les fichiers
 * statiques et les images optimisées. Chaque exclusion ci-dessous est là pour
 * une raison précise :
 *
 *  - `api/`     — les routes d'API (`/api/contact`, `/api/chat`) rendent du
 *                 JSON. Il n'y a pas de `<html>` au bout, donc pas de `lang` à
 *                 décider. Rien à faire, autant ne pas y passer.
 *  - `_next/`   — les fichiers construits par Next : le JavaScript, les CSS,
 *                 les images optimisées. Ils sont servis des dizaines de fois
 *                 par page ; c'est là que le coût d'un proxy inutile se paie.
 *  - `admin/`   — le back-office. Il n'hérite volontairement d'aucun chrome
 *                 public (voir `app/(site)/layout.tsx`) et n'est pas destiné à
 *                 être traduit : il n'a qu'un utilisateur, et il parle
 *                 français. Il retombera donc sur `LOCALE_DEFAUT`, ce qui est
 *                 exactement le comportement voulu.
 *  - `opengraph-image` — la convention de fichier `opengraph-image.tsx` est
 *                 servie sous un chemin haché (`/opengraph-image-12o0cb`). Ce
 *                 n'est pas une page ; c'est une image PNG générée.
 *  - `.*\.`     — TOUT chemin contenant un point : `/robots.txt`,
 *                 `/sitemap.xml`, `/favicon.ico`, `/icon.png`, et les visuels
 *                 de `/public` (`/brand/og-nawa-corps.png`). Une seule règle
 *                 plutôt qu'une liste d'extensions, parce qu'une liste
 *                 s'oublie au premier format ajouté. Conséquence à connaître :
 *                 une page dont l'URL contiendrait un point ne verrait jamais
 *                 le proxy — le site n'en a aucune, et il vaut mieux ne pas en
 *                 créer.
 *
 * La forme `api/|api$` (idem pour `admin`) est volontairement redondante : le
 * raccourci `api` seul exclurait aussi `/apiculture`, et `admin` seul
 * `/administration`. Aucune de ces deux pages n'existe, mais un préfixe qui
 * mord sur des URL voisines est le genre de piège qui se découvre six mois
 * plus tard.
 */
export const config = {
  matcher: ["/((?!api/|api$|_next/|admin/|admin$|opengraph-image|.*\\.).*)"],
};
