import type { Metadata } from "next";

/**
 * 404 RACINE — le filet de dernier recours.
 *
 * Il en existe deja une sous app/(site)/, et elle est plus riche : elle herite
 * du chrome public (nav, curseur, chatbot) parce qu elle vit dans le groupe de
 * routes. Mais elle ne repond QUE pour les `notFound()` leves depuis une page
 * de ce groupe — une formule supprimee, une famille dont toutes les lignes
 * sont masquees.
 *
 * Une URL qui ne correspond a AUCUNE route du projet — une faute de frappe, un
 * vieux lien, un robot qui devine des chemins — ne traverse aucun layout de
 * groupe : elle tombe ici. Sans ce fichier, Next servait sa page integree,
 * en anglais, sur fond blanc, sans le moindre lien de retour. Sur un site
 * romand, c est une impasse et une rupture de marque.
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
export const metadata: Metadata = {
  title: "Page introuvable — Nawa Corps",
  // Une 404 ne s indexe pas : elle n a rien a offrir a un moteur, et laisser
  // Google la referencer reviendrait a lui donner une impasse a proposer.
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta">Erreur 404</span>
        </div>
        <h1 className="t">Cette page n&apos;existe pas.</h1>
        <div className="studio-txt" style={{ marginTop: 40 }}>
          <p>
            Le lien est peut-être ancien, ou l&apos;adresse comporte une faute de
            frappe. Rien n&apos;est perdu : tout le site se rejoint depuis
            l&apos;accueil.
          </p>
          <p style={{ marginTop: 40 }}>
            <a className="lnk" href="/">
              ← Retour à l&apos;accueil
            </a>
          </p>
          <p>
            <a className="lnk" href="/prestations">
              Voir toutes les prestations →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
