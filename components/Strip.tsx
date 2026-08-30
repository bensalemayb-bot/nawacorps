// Bande defilante — reference/binacore.html lignes 748-753, copie verbatim.
// La liste est volontairement dupliquee : le marquee translate de -50% et la
// seconde moitie assure la continuite visuelle.
//
// Aucune logique ici. Le bloc « scroll inertiel + marquee » d'Interactions.tsx
// cible `.strip .tk` ; son `if (track)` tolerait l'absence de ce composant
// depuis B4 — il trouve enfin sa cible et l'animation demarre seule.
export default function Strip() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="tk">
        <span>Refonte de site</span><span>Demande de devis</span><span>Prise de rendez-vous</span><span>Fiche Google</span><span>72 heures</span><span>Genève</span>
        <span>Refonte de site</span><span>Demande de devis</span><span>Prise de rendez-vous</span><span>Fiche Google</span><span>72 heures</span><span>Genève</span>
      </div>
    </div>
  );
}
