import Detail from "@/components/Detail";
import { dictionnaire } from "@/lib/dictionnaires";
import type { Locale } from "@/lib/i18n";

// Section (01) Les chiffres — cinq chiffres publies, chacun avec sa source.
//
// TROIS VISIBLES, DEUX DANS « VOIR LE DETAIL » (26.10.2026, demande d Ayoub :
// moins a lire, rien de supprime). Les trois premiers de la liste sont les
// plus parlants pour un patron genevois : Geneve, la Suisse, le gain mesure.
// Le chiffre francais (CAPEB), le service client et la phrase de cloture
// sont ranges dans le <details>, toujours dans le HTML. Le chapeau, visible,
// dit deja que ce sont des etudes et pas nos clients (LCD art. 3).
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
// (deux colonnes sous 900 px, une sous 560 px ; au-dessus, trois ici au lieu
// de quatre, regle `#chiffres .steps` en fin d app/details.css) ; seuls le
// grand chiffre et la ligne de source ont leur regle (`.chiffre`,
// app/binacore.css).

/** Combien de chiffres restent visibles ; les suivants vont dans le Detail. */
const VISIBLES = 3;

type Chiffre = ReturnType<typeof dictionnaire>["chiffres"]["items"][number];

function Carte({ chiffre, source, reveler }: { chiffre: Chiffre; source: string; reveler: boolean }) {
  return (
    <div className="stp chiffre" data-reveal={reveler ? "" : undefined}>
      <span className="t">{chiffre.contexte}</span>
      <p className="v">{chiffre.valeur}</p>
      <p>{chiffre.texte}</p>
      <p className="src">
        {source}
        <a className="lnk" href={chiffre.url} target="_blank" rel="noopener">{chiffre.source}</a>
        {` — ${chiffre.perimetre}`}
      </p>
    </div>
  );
}
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
          {t.items.slice(0, VISIBLES).map((chiffre) => (
            <Carte chiffre={chiffre} source={t.source} reveler key={chiffre.url} />
          ))}
        </div>
        {/* Dans le <details>, pas de data-reveal : la revelation au scroll
            ne s initialise qu une fois, sur un contenu ferme et invisible. */}
        <div data-reveal>
          <Detail libelle={t.detail}>
            <div className="steps">
              {t.items.slice(VISIBLES).map((chiffre) => (
                <Carte chiffre={chiffre} source={t.source} reveler={false} key={chiffre.url} />
              ))}
            </div>
            <p className="lede">{t.cloture}</p>
          </Detail>
        </div>
      </div>
    </section>
  );
}
