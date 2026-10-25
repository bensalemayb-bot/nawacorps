import { ImageResponse } from "next/og";

/**
 * Image Open Graph / Twitter de l accueil — bloc de correction post-revue.
 *
 * Le layout (site) declare `twitter: { card: "summary_large_image" }` sans
 * qu aucune image n existe nulle part dans l arbre : ni cle `images` dans
 * `openGraph`/`twitter`, ni fichier `opengraph-image.*`. Un partage — et le
 * seul CTA du site est un lien WhatsApp, qui deplie une carte — produisait
 * donc un aperçu vide.
 *
 * Cette convention de fichier est cablee par Next tout seul : il l evalue et
 * pose les balises `og:image` ET `twitter:image` (Twitter n a pas besoin de
 * son propre `twitter-image.tsx` tant que le format visé est le meme).
 *
 * Aucune police distante chargee : ImageResponse embarque deja une police par
 * defaut (Geist), suffisante pour du texte statique en français accentue —
 * pas la peine d ajouter une dependance reseau au build pour une image qui ne
 * change jamais.
 */
/**
 * LE TEXTE SUIT docs/agents/copy/meta.md §3 : la promesse, puis le slogan.
 * L image est en francais pour les deux langues (une seule convention de
 * fichier). Aucun montant : une image de partage ne porte pas de mention de
 * TVA lisible a cote.
 */
export const alt = "Nawa Corps — L'assistant IA qui connaît déjà votre métier, Genève";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#12352B",
          color: "#F1EEE6",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          Nawa Corps
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 68,
            fontWeight: 600,
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          <span>L&apos;assistant qui connaît déjà votre métier.</span>
          <span>Vous validez. Il s&apos;occupe du reste.</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.7 }}>
          Nawa Corps — studio genevois
        </div>
      </div>
    ),
    { ...size },
  );
}
