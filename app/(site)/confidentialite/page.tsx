import type { Metadata } from "next";

/**
 * Confidentialite (nLPD).
 *
 * Meme ossature que /mentions-legales : statique, zero CSS et zero classe
 * nouvelle, aucun [data-reveal] ecrit a la main, aucun <h3> nu. Voir le
 * docblock de app/mentions-legales/page.tsx pour le detail des deux
 * garde-fous.
 *
 * Le formulaire de contact et l assistant de conversation decrits ici
 * n existent pas encore (blocs B8-B9). La note de fin de page le dit, plutot
 * que de laisser croire a une collecte deja en place.
 */
export const metadata: Metadata = {
  title: "Confidentialité — Nawa Corps",
};

export default function Confidentialite() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta">Nawa Corps · nLPD</span>
        </div>
        <h2 className="t">Confidentialité</h2>
        <div className="studio-txt" style={{ marginTop: 40 }}>
          <p className="meta">Données collectées</p>
          <p>Formulaire de contact (nom, téléphone, message) et assistant de conversation (contenu des échanges, prénom, numéro).</p>
          <p className="meta">Finalité</p>
          <p>Répondre à votre demande et établir une proposition.</p>
          <p className="meta">Conservation</p>
          <p>12 mois, puis suppression.</p>
          <p className="meta">Hébergement des données</p>
          <p>Suisse.</p>
          <p>Pas de cookies publicitaires ni de traceurs tiers.</p>
          <p className="meta">Vos droits</p>
          {/* BR : adresse A CONFIRMER avant la mise en ligne. */}
          <p>Accès, rectification, suppression sur simple demande à hello@nawacorps.ch.</p>
          <p className="meta" style={{ marginTop: 40 }}>Formulaire et assistant arrivent prochainement</p>
          <p style={{ marginTop: 40 }}><a className="lnk" href="/">← Retour au site</a></p>
        </div>
      </div>
    </section>
  );
}
