import { dictionnaire } from "@/lib/dictionnaires";
import type { Locale } from "@/lib/i18n";

// Bande defilante — reference/binacore.html lignes 748-753.
// La liste est volontairement dupliquee : le marquee translate de -50% et la
// seconde moitie assure la continuite visuelle. L animation est posee par
// Interactions.tsx sur `.strip .tk`.
//
// LA BANDE EST `aria-hidden`, ELLE N EST PAS POUR AUTANT HORS DES REGLES.
// Depuis le 25.10.2026 elle nomme la DOULEUR dans les mots du patron (« Les
// devis qui dorment », « La paperasse du soir »), puis le controle (« Jamais
// à votre place ») ; le reste du site nomme la solution. Aucune duree, aucun
// prix. La formule « rien ne part sans vous » est INTERDITE ici comme partout
// (arbitrage B1) : l accuse de reception valide une fois part seul.
export default function Strip({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);
  // Les six vignettes, ecrites une fois et rendues deux fois.
  const vignettes = [
    t.strip.devis,
    t.strip.chantier,
    t.strip.paperasse,
    t.strip.jamais,
    t.strip.releve,
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
