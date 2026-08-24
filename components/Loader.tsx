// Preloader — reference/binacore.html lignes 685-689, copie verbatim.
// Le pourcentage est pilote par Interactions.tsx via #pct.
export default function Loader() {
  return (
    <div className="loader" id="loader" aria-hidden="true">
      <div className="lw"><span>Nawa Corps</span></div>
      <span className="lmeta">Studio digital — Genève</span>
      <span className="pct" id="pct">0</span>
    </div>
  );
}
