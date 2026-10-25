import { dictionnaire } from "@/lib/dictionnaires";
import type { Locale } from "@/lib/i18n";

// Section (01) Les chiffres — quatre chiffres publies, chacun avec sa source.
//
// POURQUOI ICI, ENTRE LA BANDE ET (02) PAR METIER : la bande defilante nomme
// la douleur dans les mots du patron (« La paperasse du soir », « Les devis
// qui dorment ») mais n affirme rien. Posee juste dessous, une mesure publiee
// (le week-end des artisans, la charge administrative en Suisse) donne a ces
// mots un poids que le visiteur peut verifier ; puis les deux gains mesures
// par des etudes ouvrent sur la solution, que (02) decline metier par metier.
// Plus bas, apres l offre, les chiffres arriveraient quand la decision est
// deja prise.
//
// LES REGLES (CLAUDE.md, Interdits ; LCD art. 3) : chaque chiffre porte sa
// source DANS SA CARTE, en lien cliquable vers la publication, et aucun n est
// presente comme un resultat de Nawa Corps — la cloture le dit. Pas de
// compteur anime : un nombre qui defile se lit comme un trophee, pas comme
// une citation. La source est un <a> classique (B7), externe, nouvel onglet,
// `rel="noopener"` comme les liens WhatsApp du site.
//
// LA MISE EN FORME REPREND `.steps` / `.stp` de (03) Comment ca se passe
// (quatre colonnes, deux sous 900 px, une sous 560 px) ; seuls le grand
// chiffre et la ligne de source ont leur regle (`.chiffre`, app/binacore.css).
export default function Chiffres({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale).chiffres;

  return (
    <section id="chiffres" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(01)</span>{`  ${t.section}`}</span>
          <div data-reveal><h2 className="t">{t.titreLigne1}<br />{t.titreLigne2}</h2></div>
        </div>
        <p className="lede" data-reveal style={{ marginBottom: 34 }}>{t.lede}</p>
        <div className="steps">
          {t.items.map((chiffre) => (
            <div className="stp chiffre" data-reveal key={chiffre.url}>
              <span className="t">{chiffre.contexte}</span>
              <p className="v">{chiffre.valeur}</p>
              <p>{chiffre.texte}</p>
              <p className="src">
                {t.source}
                <a className="lnk" href={chiffre.url} target="_blank" rel="noopener">{chiffre.source}</a>
                {` — ${chiffre.perimetre}`}
              </p>
            </div>
          ))}
        </div>
        <p className="lede" data-reveal style={{ marginTop: 34 }}>{t.cloture}</p>
      </div>
    </section>
  );
}
