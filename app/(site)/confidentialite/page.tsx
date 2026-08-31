import type { Metadata } from "next";
import SchemaPage from "@/components/SchemaPage";
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
    "Politique de confidentialité de Nawa Corps (nLPD) : données collectées, finalité, durée de conservation, hébergement des données et vos droits.",
  alternates: { canonical: "/confidentialite" },
  openGraph: openGraphPage({
    titre: "Confidentialité — Nawa Corps",
    description:
      "Politique de confidentialité de Nawa Corps (nLPD) : données collectées, finalité, durée de conservation, hébergement des données et vos droits.",
    chemin: "/confidentialite",
  }),
};

export default function Confidentialite() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <>
      {/* Fil d Ariane : la page est un cul-de-sac de navigation, le moteur a
          besoin qu on lui dise d ou elle depend. */}
      <SchemaPage
        fil={[
          { nom: "Accueil", chemin: "/" },
          { nom: "Confidentialité", chemin: "/confidentialite" },
        ]}
      />
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
          {/* CORRECTION D'EXACTITUDE, deuxieme passe. Cette page a d abord
              affirme « heberges en Suisse ». C etait deja douteux pour
              l assistant ; c est devenu faux le 31 aout 2026, quand
              l hebergeur a ete tranche : Vercel, qui n a aucune region
              suisse — 20 regions, la plus proche de Geneve est Francfort.
              Une page de confidentialite qui se trompe sur le lieu de
              stockage est le pire endroit ou se tromper, et la LCD art. 3
              vise les indications trompeuses.
              L Allemagne figure a l annexe 1 de l OPDo (Etats a protection
              adequate), ce qui rend la communication licite sans garantie
              supplementaire — d ou la derniere phrase.
              Si la region Vercel change, ce paragraphe et /mentions-legales
              se changent ensemble. */}
          <p>Le site et sa base de données sont hébergés par Vercel Inc., société américaine, sur des serveurs situés en Allemagne (Francfort). L&apos;Allemagne figure sur la liste des États dont le Conseil fédéral reconnaît une protection des données adéquate.</p>
          <p>Les échanges avec l&apos;assistant de conversation sont traités par un fournisseur d&apos;intelligence artificielle situé hors de Suisse. Ne lui confiez pas d&apos;information sensible : pour cela, écrivez directement.</p>
          <p>Pas de cookies publicitaires ni de traceurs tiers.</p>
          <p className="meta">Vos droits</p>
          <p>Accès, rectification, suppression sur simple demande à {CONTACT.emailGeneral}.</p>
          <p style={{ marginTop: 40 }}><a className="lnk" href="/">← Retour au site</a></p>
        </div>
      </div>
    </section>
    </>
  );
}
