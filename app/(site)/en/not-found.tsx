import { lien, type Locale } from "@/lib/i18n";

/**
 * LA 404 DES PAGES ANGLAISES.
 *
 * CE QU'ELLE COUVRE EXACTEMENT, et c'est plus etroit qu'il n'y parait. Un
 * `not-found` repond aux `notFound()` leves DANS son segment et en dessous —
 * ici, tout ce qui vit sous `/en`. C'est le cas des pages de prestations
 * anglaises : slug inconnu, formule absente de la base, famille dont plus
 * aucune ligne n'est publiee. Sans ce fichier, ces chemins remontaient a
 * app/(site)/not-found.tsx et rendaient un ecran FRANCAIS sous
 * `<html lang="en-CH">` — une contradiction que le visiteur voit avant le
 * moteur.
 *
 * CE QU'ELLE NE COUVRE PAS : une URL qui ne correspond a AUCUNE route, du
 * genre `/en/blog`. Celle-la ne traverse aucun segment et tombe sur la 404
 * RACINE (app/not-found.tsx), qui est francaise et hors du perimetre de ce
 * chantier. Voir
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md :
 * seule la 404 racine, ou `global-not-found.js`, attrape les URL sans route.
 * C'est un manque connu, et il se comblera le jour ou la racine saura lire la
 * langue du chemin.
 *
 * ELLE VIT DANS (site)/en, PAS A LA RACINE. Placee ici, elle est rendue A
 * L'INTERIEUR de app/(site)/layout.tsx : loader, curseur, navigation, menu et
 * scroll inertiel sont la, exactement comme sur les pages legales anglaises.
 *
 * AUCUNE CLASSE NOUVELLE, aucun CSS ajoute : c'est le patron de
 * app/(site)/not-found.tsx, .wrap / .sec-head / .meta / h1.t / .studio-txt /
 * .lnk. Et aucun [data-reveal] ecrit a la main — Interactions.tsx en pose un
 * sur h1.t, le reste reste lisible meme si le script ne demarre jamais. Une
 * 404 qui resterait a opacity:0 serait pire que celle qu'on remplace.
 *
 * Pas de bloc `metadata` : Next injecte deja <meta name="robots"
 * content="noindex"> sur les reponses 404, et le titre du layout convient.
 *
 * PAS DE next/link : Interactions.tsx ne s'initialise qu'une fois (decision
 * B7).
 */

/** La langue de cette page. Tous ses liens internes passent par `lien`. */
const LOCALE: Locale = "en";

export default function NotFoundEn() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta">Error 404</span>
        </div>
        <h1 className="t">This page no longer exists.</h1>
        <div className="studio-txt" style={{ marginTop: 40 }}>
          <p>The address may be an old one, or the service it described may have left the catalogue. Nothing is lost: the rest of the site is intact, and the studio still answers.</p>
          <p>The whole catalogue — the three site packages, upkeep, identity, print, social media and the pieces for restaurants — is on the services page.</p>
          <p style={{ marginTop: 40 }}><a className="lnk" href={lien(LOCALE, "/services")}>See all the services</a></p>
          <p><a className="lnk" href={lien(LOCALE, "/")}>← Back to the site</a></p>
        </div>
      </div>
    </section>
  );
}
