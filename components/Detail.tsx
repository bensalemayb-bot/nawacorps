import type { ReactNode } from "react";

/**
 * « VOIR LE DÉTAIL » — le bloc dépliant commun du site (26.10.2026).
 *
 * Demande d'Ayoub : le site était trop long à lire (2'350 mots sur l'accueil,
 * 4'000 sur /demonstrations) mais devait rester complet. Règle adoptée :
 * chaque section montre un titre, une phrase et une liste courte ; le reste
 * est rangé ici, fermé par défaut, et s'ouvre d'un clic. Rien n'est supprimé.
 *
 * <details> natif, comme la FAQ : aucun JS, lisible par les moteurs (le texte
 * fermé reste dans le HTML), clavier et lecteurs d'écran gérés par le
 * navigateur. Le scroll inertiel suit l'ouverture : Interactions.tsx observe
 * la hauteur de #smooth (ResizeObserver).
 *
 * `libelle` : le texte du bouton, dans la langue de la page (« Voir le
 * détail » / « See the details » par défaut, ou plus précis : « Les 4 étapes
 * en détail »).
 */
export default function Detail({
  libelle,
  children,
  className,
}: {
  libelle: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={`detail${className ? ` ${className}` : ""}`}>
      <summary>
        <span>{libelle}</span>
        <i aria-hidden="true"></i>
      </summary>
      <div className="detail-corps">{children}</div>
    </details>
  );
}
