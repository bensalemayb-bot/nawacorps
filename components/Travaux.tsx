import FeatureCarousel from "@/components/ui/feature-carousel";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";

// Section Travaux — reference/binacore.html lignes 756-764 pour l'en-tete,
// copie verbatim. Le markup .car2 de la maquette (lignes 766-935) est rendu par
// le composant lui-meme, d'ou le <div data-reveal> qui l'enveloppe.
//
// L'echelonnement des reveals est preserve : Interactions calcule l'index via
// `:scope > [data-reveal]` sur le parent. Dans la maquette, .wrap a pour enfants
// directs reveles [p.lede, div.car2] ; ici [p.lede, div(wrapper), div.studio-txt].
// Les deux premiers gardent leur position et donc leur delai — le troisieme, le
// lien vers /demonstrations, s'ajoute a la suite sans rien decaler.
//
// Composant serveur : le carrousel porte son propre "use client".
//
// `locale` VAUT « fr » PAR DEFAUT, comme dans tous les composants de l'accueil :
// un appelant qui ne la passe pas rend exactement ce qu'il rendait avant le
// chantier anglais, a l'octet pres.
//
// L'ESPACE INSECABLE DE L'ETIQUETTE EST RECOLLE DANS L'EXPRESSION, et ce n'est
// pas une coquetterie. Ecrit dans le JSX (`&nbsp; {t.travaux.section}`), il
// ferait DEUX enfants texte la ou il n'y en avait qu'un, et React intercalerait
// un `<!-- -->` : le HTML du site francais changerait sans qu'un seul mot
// bouge. Meme precaution dans les cinq autres sections numerotees.
export default function Travaux({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);

  return (
    <section id="travaux">
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(01)</span>{`\u00A0 ${t.travaux.section}`}</span>
          <div data-reveal>
            <h2 className="t">{t.travaux.titreLigne1}<br />{t.travaux.titreLigne2}</h2>
          </div>
        </div>
        <p className="lede" data-reveal style={{ marginBottom: 30 }}>{t.travaux.lede}</p>

        <div data-reveal><FeatureCarousel /></div>

        {/* L'accueil donne un apercu, /demonstrations porte l'ensemble : la
            page dit en toutes lettres ce que sont ces pieces — des
            demonstrations dessinees pour un bar qui n'existe pas — ce que
            cette section n'a pas la place de faire. Sans ce lien, la page
            n'etait atteignable que depuis le hero.

            Troisieme [data-reveal] enfant direct de .wrap : Interactions
            calcule le delai par `:scope > [data-reveal]`, l'echelonnement des
            deux premiers (p.lede, le carrousel) est donc inchange. */}
        <div className="studio-txt" data-reveal style={{ marginTop: 30 }}>
          <p><a className="lnk" href={lien(locale, "/demonstrations")}>{t.travaux.lien}</a></p>
        </div>
      </div>
    </section>
  );
}
