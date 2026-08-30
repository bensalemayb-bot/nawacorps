/**
 * LA 404 DU SITE PUBLIC.
 *
 * POURQUOI ELLE EXISTE. Cette branche a introduit les premiers notFound() du
 * depot — deux dans app/(site)/prestations/[slug]/page.tsx (slug inconnu, puis
 * formule absente de la base) et un dans components/PageFamille.tsx (plus
 * aucune ligne publiee dans la famille). Sans ce fichier, ces trois chemins
 * servaient la 404 par defaut de Next : en anglais, sans la nav, sans le chrome
 * du site, sans aucun lien de retour. Un visiteur arrive par un lien vers une
 * formule retiree, ou par /prestations/reseaux-sociaux le jour ou son unique
 * ligne est masquee depuis /admin — il ne merite pas un cul-de-sac.
 *
 * ELLE VIT DANS (site), PAS A LA RACINE. Placee ici, elle est rendue A
 * L INTERIEUR de app/(site)/layout.tsx : loader, curseur, navigation, menu et
 * scroll inertiel sont la, exactement comme sur les deux pages legales. Une
 * 404 posee dans app/ n aurait pas eu ce chrome, et /admin en aurait herite.
 *
 * ATTENTION A CE QU ELLE NE COUVRE PAS : elle repond aux notFound() leves
 * DANS les segments de (site). Une URL qui ne correspond a aucune route du
 * tout releve de la racine (app/not-found.tsx), qui n existe pas encore — voir
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/
 * not-found.md.
 *
 * AUCUNE CLASSE NOUVELLE, aucun CSS ajoute : c est le patron des deux pages
 * legales, .wrap / .sec-head / .meta / h1.t / .studio-txt / .lnk. Et aucun
 * [data-reveal] ecrit a la main — Interactions.tsx en pose un sur h1.t, le
 * reste reste lisible meme si le script ne demarre jamais. Une 404 qui
 * resterait a opacity:0 serait pire que celle qu on remplace.
 *
 * Pas de bloc `metadata` : Next injecte deja <meta name="robots"
 * content="noindex"> sur les reponses 404, et le titre du layout convient.
 */
export default function NotFound() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta">Erreur 404</span>
        </div>
        <h1 className="t">Cette page n&apos;existe plus.</h1>
        <div className="studio-txt" style={{ marginTop: 40 }}>
          <p>L&apos;adresse est peut-être ancienne, ou la prestation qu&apos;elle décrivait n&apos;est plus au catalogue. Rien n&apos;est perdu : le reste du site est intact, et le studio répond toujours.</p>
          <p>Le catalogue complet — les trois formules de site, le suivi, l&apos;identité, les imprimés, les réseaux sociaux et la ligne restauration — se trouve sur la page des prestations.</p>
          <p style={{ marginTop: 40 }}><a className="lnk" href="/prestations">Voir les prestations</a></p>
          <p><a className="lnk" href="/">← Retour au site</a></p>
        </div>
      </div>
    </section>
  );
}
