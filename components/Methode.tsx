import Detail from "@/components/Detail";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";

// Section (03) Comment ca se passe — reference/binacore.html lignes 1068-1081.
//
// Contenu editorial pur : l appel, la demo, l essai, l abonnement
// (.agents/product-marketing.md §5, parcours). Composant serveur synchrone.
// Chaque carte porte une ligne (`etape0nCourt`) ; le texte entier
// (`etape0nTexte`) est range dans « Les 4 étapes en détail ».
//
// UNE SEULE DUREE, DANS LES DEUX LANGUES : l essai, deux semaines (decision
// d Ayoub du 25.10.2026). Ni la demo ni la mise en place n ont de delai
// decide (PM §10 n°6) : les autres jalons sont donc des
// conditions (« Sans rien payer », « Si le relevé vous convient »), jamais des
// heures ni des jours. Le seul engagement de reactivite du site, « Réponse le
// jour ouvrable suivant », vit la ou le visiteur demande quelque chose.
//
// C EST LA CIBLE DE « Comment ça se passe » (hero et lignes metier,
// `#methode`). L etape 04 dit « une seule fois » (audit CRO du 25.10.2026) :
// la mise en place n est pas mensuelle, seul l abonnement l est.
//
// L ETAPE 02 DIT QUAND LE PRIX DE L ABONNEMENT EST ANNONCE : a la fin de la
// demo, donc avant l essai (arbitrage du 24.10.2026). Le montant de la mise en
// place, lui, est en (05), lu en base.
export default function Methode({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);

  return (
    <section id="methode">
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(03)</span>{`  ${t.methode.section}`}</span>
          <div data-reveal><h2 className="t">{t.methode.titreLigne1}<br />{t.methode.titreLigne2}</h2></div>
        </div>
        <div className="steps">
          <div className="stp" data-reveal><span className="t">{t.methode.etape01Moment}</span><span className="n">01</span><h3>{t.methode.etape01Titre}</h3><p>{t.methode.etape01Court}</p></div>
          <div className="stp" data-reveal><span className="t">{t.methode.etape02Moment}</span><span className="n">02</span><h3>{t.methode.etape02Titre}</h3><p>{t.methode.etape02Court}</p></div>
          <div className="stp" data-reveal><span className="t">{t.methode.etape03Moment}</span><span className="n">03</span><h3>{t.methode.etape03Titre}</h3><p>{t.methode.etape03Court}</p></div>
          <div className="stp" data-reveal><span className="t">{t.methode.etape04Moment}</span><span className="n">04</span><h3>{t.methode.etape04Titre}</h3><p>{t.methode.etape04Court}</p></div>
        </div>
        {/* LE TEXTE ENTIER DE CHAQUE ETAPE, ferme par defaut (26.10.2026) :
            les cartes n en gardent qu une ligne. Rien n est retire. */}
        <div data-reveal>
          <Detail libelle={t.methode.detail}>
            <p><strong>{t.methode.etape01Titre}.</strong>{` ${t.methode.etape01Texte}`}</p>
            <p><strong>{t.methode.etape02Titre}.</strong>{` ${t.methode.etape02Texte}`}</p>
            <p><strong>{t.methode.etape03Titre}.</strong>{` ${t.methode.etape03Texte}`}</p>
            <p><strong>{t.methode.etape04Titre}.</strong>{` ${t.methode.etape04Texte}`}</p>
          </Detail>
        </div>
        {/* LE LIEN MENE A (05), « Voir ce que vous payez » : a ce point de la
            page le lecteur veut savoir combien et quand. Une ancre pure n est
            pas prefixee par `lien()`. */}
        <div className="c-row" data-reveal style={{ marginTop: 34 }}>
          <a className="btn btn-line" href={lien(locale, "#offres")}>{t.methode.cta}<span className="ar">→</span></a>
        </div>
      </div>
    </section>
  );
}
