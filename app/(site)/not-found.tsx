import type { Metadata } from "next";
/**
 * LA 404 DU SITE PUBLIC.
 *
 * POURQUOI ELLE EXISTE. Elle repond aux `notFound()` leves dans les segments
 * de (site) : sans elle, Next servirait sa 404 par defaut, en anglais, sans la
 * nav ni aucun lien de retour. Depuis le 24 octobre 2026, son texte dit aussi
 * que le studio a change de metier : un visiteur qui arrive par un ancien lien
 * (formule, famille, imprimes) doit comprendre que l offre a change, sans
 * cul-de-sac. Les anciennes adresses `/services/<slug>` redirigent d ailleurs
 * vers l accueil (next.config.ts).
 *
 * ELLE VIT DANS (site), PAS A LA RACINE. Placee ici, elle est rendue A
 * L INTERIEUR de app/(site)/layout.tsx : loader, curseur, navigation, menu et
 * scroll inertiel sont la, exactement comme sur les deux pages legales. Une
 * 404 posee dans app/ n aurait pas eu ce chrome, et /admin en aurait herite.
 *
 * ATTENTION A CE QU ELLE NE COUVRE PAS : elle repond aux notFound() leves
 * DANS les segments de (site). Une URL qui ne correspond a aucune route du
 * tout releve de la racine — app/not-found.tsx, qui EXISTE desormais et qui
 * lit la langue du chemin pour repondre en francais ou en anglais. Voir
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/
 * not-found.md.
 *
 * AUCUNE CLASSE NOUVELLE, aucun CSS ajoute : c est le patron des deux pages
 * legales, .wrap / .sec-head / .meta / h1.t / .studio-txt / .lnk. Et aucun
 * [data-reveal] ecrit a la main — Interactions.tsx en pose un sur h1.t, le
 * reste reste lisible meme si le script ne demarre jamais. Une 404 qui
 * resterait a opacity:0 serait pire que celle qu on remplace.
 *
 * Next injecte deja <meta name="robots" content="noindex"> sur les reponses
 * 404. Le bloc `metadata` ne porte que le TITRE : sans lui, la 404 reprenait
 * celui de l accueil (audit CRO/SEO v3, 3.8). Le suffixe vient du `template`
 * du layout (site).
 */
export const metadata: Metadata = { title: "Page introuvable" };

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
          <p>L&apos;adresse est peut-être ancienne. Depuis octobre 2026, Nawa Corps ne fait plus de sites : nous installons des assistants dans les PME genevoises.</p>
          <p>L&apos;assistant connaît déjà votre métier. Il reprend le bureau du soir, et il ne s&apos;engage jamais à votre place.</p>
          <p style={{ marginTop: 40 }}><a className="lnk" href="/services">Voir l&apos;assistant en détail</a></p>
          <p><a className="lnk" href="/">← Retour au site</a></p>
        </div>
      </div>
    </section>
  );
}
