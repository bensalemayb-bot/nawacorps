import type { Locale } from "@/lib/i18n";
import {
  TEXTES_DEMONSTRATIONS,
  type Exemple,
  type IconeCanal,
} from "@/lib/automatisations";

/**
 * « L IMAGE QUI MONTRE COMMENT CA MARCHE » — le schema d un exemple
 * d automatisation, a cote de son texte sur /demonstrations (demande d Ayoub
 * du 25 octobre 2026). Un seul composant, parametre par les donnees de
 * lib/automatisations.ts : les vingt-deux schemas ont le meme dessin, seuls
 * les mots changent.
 *
 * DESSINE EN CODE, PAS UNE IMAGE. Pas d image generee, pas de capture d un
 * faux logiciel avec un faux client : une capture se lit comme une preuve, et
 * le studio n en a aucune a montrer (LCD art. 3). Un schema dit « voici le
 * mecanisme », et c est tout ce qu il doit dire. Du HTML plutot qu un SVG
 * entier : le texte passe a la ligne tout seul, se traduit, se lit au lecteur
 * d ecran et s indexe. Seules les icones sont en SVG, et elles sont
 * decoratives (`aria-hidden`).
 *
 * QUATRE TEMPS, TOUJOURS LES MEMES, dans l ordre ou le travail se fait :
 * l entree (le canal, et un extrait fictif dans une bulle), ce que
 * l assistant prepare (une carte en pointilles : c est un brouillon), « Vous
 * validez » (le seul noeud plein, vert : c est le patron qui decide), puis ce
 * qui part. Le noeud plein au troisieme rang est le message du dessin : la
 * validation est une etape, pas une formalite.
 *
 * LE BOUTON « Valider » EST UN DESSIN, PAS UN CONTROLE : un `<span>`
 * `aria-hidden`, jamais un `<button>`. Un bouton qui ne fait rien promet un
 * clic qui n arrive pas, et le lecteur d ecran l annoncerait comme tel.
 *
 * LA MENTION « Exemples de démonstration — demandes fictives » EST DANS LA
 * LEGENDE, rendue ICI : un schema se partage seul (capture d ecran) et doit
 * dire seul qu il montre une demande fictive. Un appelant ne peut pas
 * l oublier.
 *
 * L ETIQUETTE « Palier Complet » s affiche des que l entree est un appel
 * (`telephone`) : un patron qui voit l assistant decrocher ne doit pas croire
 * l avoir au palier Essentiel.
 *
 * L ANIMATION EST LEGERE ET FACULTATIVE : quand la figure entre a l ecran,
 * `Interactions.tsx` lui pose `.in` (c est un `[data-reveal]`), et les quatre
 * temps apparaissent l un apres l autre pendant que le fil se trace
 * (app/demonstrations.css). Sous `prefers-reduced-motion`, rien ne bouge.
 */

/** Les pictogrammes : traits simples, 24 x 24, couleur du texte. Aucun logo de marque. */
function Icone({ nom }: { nom: IconeCanal | "brouillon" | "coche" | "envoi" }) {
  const commun = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };
  switch (nom) {
    case "message":
      return (
        <svg {...commun}>
          <path d="M4 5h16v11H9l-5 4z" />
          <path d="M8 9.5h8M8 12.5h5" />
        </svg>
      );
    case "email":
      return (
        <svg {...commun}>
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="m3.5 6 8.5 7 8.5-7" />
        </svg>
      );
    case "appel":
      return (
        <svg {...commun}>
          <path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />
        </svg>
      );
    case "document":
      return (
        <svg {...commun}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v4h4M9 12h6M9 15.5h6M9 8.5h2" />
        </svg>
      );
    case "portail":
      return (
        <svg {...commun}>
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <path d="M3 8h18M8 18v-5l4-3 4 3v5" />
        </svg>
      );
    case "formulaire":
      return (
        <svg {...commun}>
          <rect x="4" y="3" width="16" height="18" rx="1.5" />
          <path d="M8 8h8M8 12h8M8 16h4" />
        </svg>
      );
    case "agenda":
      return (
        <svg {...commun}>
          <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4M8 13.5h2M14 13.5h2M8 16.5h2" />
        </svg>
      );
    case "photo":
      return (
        <svg {...commun}>
          <path d="M4 7.5h3.5L9 5h6l1.5 2.5H20V19H4z" />
          <circle cx="12" cy="13" r="3.3" />
        </svg>
      );
    case "relance":
      return (
        <svg {...commun}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "brouillon":
      return (
        <svg {...commun}>
          <path d="M5 3h9l4 4v6M5 3v18h7" />
          <path d="M8 9h6M8 12.5h4M14.5 20.5l6-6-2-2-6 6-.5 2.5z" />
        </svg>
      );
    case "coche":
      return (
        <svg {...commun}>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      );
    case "envoi":
      return (
        <svg {...commun}>
          <path d="M3.5 11.5 20.5 4l-6 16.5-3.2-6.8z" />
          <path d="m11.3 13.7 4-4" />
        </svg>
      );
  }
}

export default function SchemaAutomatisation({
  exemple,
  locale,
}: {
  exemple: Exemple;
  locale: Locale;
}) {
  const t = TEXTES_DEMONSTRATIONS[locale];
  const e = exemple[locale];

  return (
    <figure className="sa" data-reveal>
      <figcaption className="sa-cap">
        {/* La legende complete pour le lecteur d ecran : ce que montre le
            schema, puis la mention. A l ecran, seule la mention se lit : le
            titre est deja juste a cote, en h3. */}
        <span className="sr-only">{`${t.legende} : ${e.titre}. `}</span>
        <span className="sa-mention">{t.mention}</span>
      </figcaption>

      <ol className="sa-flux">
        {/* 01 — l entree : le canal et l extrait fictif. */}
        <li className="sa-pas" style={{ "--k": 0 } as React.CSSProperties}>
          <span className="sa-noeud">
            <Icone nom={exemple.icone} />
          </span>
          <div className="sa-corps">
            <span className="sa-et">{`01 · ${t.etapes[0]}`}</span>
            <span className="sa-canal">
              {e.canal}
              {exemple.telephone && (
                <span className="sa-tag" title={t.telephoneNote}>
                  {t.telephone}
                  <span className="sr-only">{` — ${t.telephoneNote}`}</span>
                </span>
              )}
            </span>
            <p className="sa-bulle">{e.extrait}</p>
          </div>
        </li>

        {/* 02 — ce que l assistant prepare : un brouillon, d ou les pointilles. */}
        <li className="sa-pas" style={{ "--k": 1 } as React.CSSProperties}>
          <span className="sa-noeud">
            <Icone nom="brouillon" />
          </span>
          <div className="sa-corps">
            <span className="sa-et">{`02 · ${t.etapes[1]}`}</span>
            <p className="sa-carte sa-brouillon">{e.schema.prepare}</p>
          </div>
        </li>

        {/* 03 — vous validez : le seul noeud plein du dessin. */}
        <li className="sa-pas sa-pas-valide" style={{ "--k": 2 } as React.CSSProperties}>
          <span className="sa-noeud">
            <Icone nom="coche" />
          </span>
          <div className="sa-corps">
            <span className="sa-et">{`03 · ${t.etapes[2]}`}</span>
            <p className="sa-carte">
              {e.schema.valide}
              <span className="sa-bouton" aria-hidden="true">
                <Icone nom="coche" />
                {t.bouton}
              </span>
            </p>
          </div>
        </li>

        {/* 04 — ce qui part, apres la validation. */}
        <li className="sa-pas" style={{ "--k": 3 } as React.CSSProperties}>
          <span className="sa-noeud">
            <Icone nom="envoi" />
          </span>
          <div className="sa-corps">
            <span className="sa-et">{`04 · ${t.etapes[3]}`}</span>
            <p className="sa-carte sa-sortie">{e.schema.part}</p>
          </div>
        </li>
      </ol>
    </figure>
  );
}
