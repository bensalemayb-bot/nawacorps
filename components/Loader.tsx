import Image from "next/image";

// Preloader — reference/binacore.html lignes 685-689, copie verbatim.
// Le pourcentage est pilote par Interactions.tsx via #pct.
//
// BR — LE LOGO REMPLACE LE TEXTE, ET IL DOIT ETRE BLANC.
// .loader porte background:var(--pine) : l ecran de chargement est vert. Un
// logo en encre foncee y serait invisible. Meme traitement qu au menu ouvert —
// brightness(0) invert(1) sur les memes fichiers — plutot qu un fichier
// fond-fonce distinct : celui-ci embarque son propre rectangle plein, dont on
// verrait les bords sur l aplat pin.
//
// LES IMAGES RESTENT DANS LE <span>. C est lui que l animation d origine fait
// monter (translateY 120% -> 0, ligne 341 de binacore.css). Les sortir aurait
// casse l entree du preloader, qui n a aucune raison de changer.
export default function Loader() {
  return (
    <div className="loader" id="loader" aria-hidden="true">
      <div className="lw">
        <span>
          <Image
            className="ld-icone"
            src="/brand/nawa-corps-logo-iconique-transparent.png"
            alt=""
            width={230}
            height={230}
            priority
          />
          <Image
            className="ld-nom"
            src="/brand/nawa-corps-logo-principal-transparent.png"
            alt=""
            width={634}
            height={90}
            priority
          />
        </span>
      </div>
      <span className="lmeta">Studio digital — Genève</span>
      <span className="pct" id="pct">0</span>
    </div>
  );
}
