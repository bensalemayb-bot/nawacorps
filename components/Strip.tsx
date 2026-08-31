import { dictionnaire } from "@/lib/dictionnaires";
import type { Locale } from "@/lib/i18n";

// Bande defilante — reference/binacore.html lignes 748-753, copie verbatim.
// La liste est volontairement dupliquee : le marquee translate de -50% et la
// seconde moitie assure la continuite visuelle.
//
// Aucune logique ici. Le bloc « scroll inertiel + marquee » d'Interactions.tsx
// cible `.strip .tk` ; son `if (track)` tolerait l'absence de ce composant
// depuis B4 — il trouve enfin sa cible et l'animation demarre seule.
//
// LA BANDE EST `aria-hidden`, ELLE N'EST PAS POUR AUTANT HORS DES REGLES. La
// vignette du delai porte son point de depart dans les deux langues — « Une
// semaine dès votre feu vert », « One week from your go-ahead » : le guide de
// voix §5 n'exempte pas le decoratif, et une vignette de marquee est bien une
// unite de lecture.
export default function Strip({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);
  // Les six vignettes, ecrites une fois et rendues deux fois — la duplication
  // du markup de la maquette est ce qui rend le defilement continu.
  const vignettes = [
    t.strip.refonte,
    t.strip.devis,
    t.strip.rendezVous,
    t.strip.ficheGoogle,
    t.strip.delai,
    t.strip.lieu,
  ];

  return (
    <div className="strip" aria-hidden="true">
      <div className="tk">
        {vignettes.map((mot) => <span key={mot}>{mot}</span>)}
        {vignettes.map((mot) => <span key={`bis-${mot}`}>{mot}</span>)}
      </div>
    </div>
  );
}
