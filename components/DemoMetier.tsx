import type { Locale } from "@/lib/i18n";
import { TEXTES_METIERS, type DemoMetier as Demo } from "@/lib/metiers";

/**
 * LA DEMO D AUTOMATISATION D UN METIER — quatre etapes : la demande arrive, ce
 * que fait l assistant, ce que vous voyez le soir, le releve du lundi.
 * Demande d Ayoub du 25 octobre 2026 ; les textes vivent dans lib/metiers.ts.
 *
 * LE LIBELLE « Exemple de démonstration — demande fictive » EST OBLIGATOIRE
 * ET VISIBLE, dans les deux formes (LCD art. 3) : sans lui, un deroule aussi
 * concret se lirait comme le compte rendu d un vrai client, et le studio n en
 * a aucun. Il est rendu ICI et nulle part ailleurs : un appelant ne peut pas
 * l oublier.
 *
 * DU TEXTE, PAS UNE IMAGE : lisible par un lecteur d ecran, traduisible,
 * indexable. Aucune animation propre : les seules transitions sont les
 * revelations au scroll (`data-reveal`, Interactions.tsx), deja coupees sous
 * `prefers-reduced-motion` par app/binacore.css.
 *
 * AUCUN DESIGN NOUVEAU : la grille `.steps/.stp` de /services (quatre
 * colonnes, deux sous 900 px, une sous 560 px) ; le canal reprend `.stp .t`,
 * l etiquette flottante deja dessinee pour ce gabarit. Pour la carte du hub,
 * la forme courte reprend `.cat-it .d`.
 *
 * `court` : l apercu de la carte du hub — le libelle, le canal et la demande,
 * rien de plus.
 */
export default function DemoMetier({
  demo,
  locale,
  court = false,
}: {
  demo: Demo;
  locale: Locale;
  court?: boolean;
}) {
  const t = TEXTES_METIERS[locale].demo;

  if (court) {
    return (
      <>
        <p className="d">
          <strong>{t.libelle}</strong>
        </p>
        <p className="d">
          <span className="sr-only">{t.canal}</span>
          {`${demo.canal} — ${demo.demande}`}
        </p>
      </>
    );
  }

  const textes = [demo.demande, demo.assistant, demo.soir, demo.releve];

  return (
    <>
      <p className="meta" data-reveal style={{ marginBottom: 22 }}>
        {t.libelle}
      </p>
      <ol className="steps" style={{ listStyle: "none", padding: 0 }}>
        {t.etapes.map((etape, i) => (
          <li className="stp" data-reveal key={etape}>
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            {/* Le canal, sur la premiere etape seulement : c est par la que la
                demande arrive. */}
            {i === 0 && (
              <span className="t">
                <span className="sr-only">{t.canal}</span>
                {demo.canal}
              </span>
            )}
            <h3>{etape}</h3>
            <p>{textes[i]}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
