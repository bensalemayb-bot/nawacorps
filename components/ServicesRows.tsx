/* DES <a> CLASSIQUES, JAMAIS next/link (decision B7) : la navigation client ne
   rejoue pas les revelations au scroll d Interactions.tsx, qui ne
   s initialisent qu une fois. Les `href` passent par `lien(locale, …)`. */
import type { CSSProperties } from "react";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";
import { CHEMIN_METIERS, METIERS, cheminMetier } from "@/lib/metiers";

// Section (02) Par metier — reference/binacore.html lignes 940-973 pour la
// structure.
//
// DEPUIS LE 25 OCTOBRE 2026 LA SECTION EST GENERALE (decision d Ayoub : le
// site parle a toutes les PME qui veulent l assistant). Une ligne par metier,
// LUE DANS lib/metiers.ts, chacune liee a sa page /metiers/<slug>. Sous les
// lignes, « Tous les métiers » mene au hub. Aucun montant ici.
//
// UNE LIGNE = LE NOM + UNE PHRASE (26.10.2026, demande d Ayoub : moins a
// lire). La phrase est ce que l assistant PEUT faire (`carte.peut`). Ce qui
// prend les soirees du patron (`carte.soirees`) n est plus repris ici : il
// reste sur la carte du hub /metiers et sur chaque page metier, a un clic.
//
// LA FORME EST <h3><button>titre</button></h3> : le titre reste dans le plan
// de titres d un lecteur d ecran, et le bouton le rend atteignable au clavier.
// Le clic est attache a `.row-h` par Interactions.tsx, qui tient aussi
// aria-expanded a jour ; la valeur ecrite ici n est que l etat initial. LA
// PREMIERE LIGNE NAIT OUVERTE (audit CRO du 25.10.2026, §2.6) : une section
// toute repliee ne montre aucun texte ; les autres naissent repliees.
// `.row-b` n est jamais `display:none`.
//
// UN `.row-b` REPLIE NAIT `inert` : replie, il n a qu une hauteur nulle et un
// overflow:hidden, donc ses liens restaient atteignables a la tabulation, avec
// un focus invisible (WCAG 2.4.7). Interactions.tsx leve `inert` sur la ligne
// ouverte et le repose sur les autres, au meme endroit qu aria-expanded.

/** Le renvoi herite sinon du gris de `.row-b p` et se confond avec le texte. */
const STYLE_RENVOI: CSSProperties = { color: "var(--ink)" };

export default function ServicesRows({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);

  return (
    <section id="services">
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(02)</span>{`  ${t.services.section}`}</span>
          <div data-reveal><h2 className="t">{t.services.titreLigne1}<br />{t.services.titreLigne2}</h2></div>
        </div>
        <div className="rows" data-reveal>
          {METIERS.map((metier, i) => {
            const m = metier[locale];
            // Le rang est un CHIFFRE et ne se traduit pas.
            const n = String(i + 1).padStart(2, "0");
            return (
              <div className={i === 0 ? "row open" : "row"} data-row key={metier.slug}>
                <div className="row-h"><span className="n">{n}</span><h3><button type="button" className="row-t" aria-expanded={i === 0}>{m.nom}</button></h3><span className="pl">+</span></div>
                <div className="row-b" inert={i !== 0}><div>
                  <p>{`${t.services.peut}${m.carte.peut}`}</p>
                  <p><a className="lnk" style={STYLE_RENVOI} href={lien(locale, cheminMetier(metier.slug))}>{t.services.lienMetier}</a></p>
                </div></div>
              </div>
            );
          })}
        </div>
        <p className="lede" data-reveal style={{ marginTop: 28 }}>{t.services.ordre}</p>
        <p data-reveal style={{ marginTop: 18 }}><a className="lnk" href={lien(locale, CHEMIN_METIERS)}>{t.services.tous}</a></p>
      </div>
    </section>
  );
}
