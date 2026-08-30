import type { Metadata } from "next";
import { CONTACT, openGraphPage } from "@/lib/site";

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
/**
 * Meme traitement que /mentions-legales : suffixe de marque delegue au
 * `template` du layout (site), description et canonique propres a la page.
 */
export const metadata: Metadata = {
  title: "Confidentialité",
  description:
    "Politique de confidentialité de Nawa Corps (nLPD) : données collectées, finalité, durée de conservation, hébergement en Suisse et vos droits.",
  alternates: { canonical: "/confidentialite" },
  openGraph: openGraphPage({
    titre: "Confidentialité — Nawa Corps",
    description:
      "Politique de confidentialité de Nawa Corps (nLPD) : données collectées, finalité, durée de conservation, hébergement en Suisse et vos droits.",
    chemin: "/confidentialite",
  }),
};

export default function Confidentialite() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta">Nawa Corps · nLPD</span>
        </div>
        <h1 className="t">Confidentialité</h1>
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
          <p>Accès, rectification, suppression sur simple demande à {CONTACT.email}.</p>
          <p className="meta" style={{ marginTop: 40 }}>Formulaire et assistant arrivent prochainement</p>
          <p style={{ marginTop: 40 }}><a className="lnk" href="/">← Retour au site</a></p>
        </div>
      </div>
    </section>
  );
}
