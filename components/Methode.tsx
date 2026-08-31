import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";

// Section Methode — reference/binacore.html lignes 1068-1081, copie verbatim.
//
// Contenu editorial pur : les 4 etapes ne sont pas des enregistrements de la
// base, elles decrivent le deroule d une prestation. Composant serveur
// synchrone, comme ServicesRows.
//
// LES JALONS NE SE COMPTENT PLUS EN HEURES. « 24 h » et « Jour 7 » etaient des
// comptes d heures et de jours deguises en etapes : le delai s ecrit « une
// semaine », une seule forme, et une methode se numerote en etapes ou en
// moments de la semaine. « corrigé dans la journée » tombe pour la meme
// raison — c est un engagement de reactivite sans source, et le seul autorise
// (« réponse le jour ouvrable suivant ») s ecrit la ou le visiteur est sur le
// point de demander quelque chose — formulaire, assistant, bouton de devis —
// et la Methode n est aucun de ces endroits.
// A la place, l etape 4 dit un fait de structure : qui corrige, et qui est
// encore la l annee suivante.
//
// LA REGLE VAUT DANS LES DEUX LANGUES, et l anglais la reprend telle quelle :
// « Beforehand », « Early in the week », « End of the week », « Afterwards ».
// « Day 7 » serait exactement le compte de jours que le francais a retire.
//
// LA METHODE RESTE CELLE DU SITE — c est le seul produit qui porte un delai —
// mais elle ne presume plus que le visiteur n a qu un site. L etape 1 regarde
// « ce que vous montrez aujourd hui », site, imprimes et fiche Google
// compris ; l etape 4 rappelle que la meme porte sert pour une affiche ou une
// reimpression, pas seulement pour une correction de site.
export default function Methode({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);

  return (
    <section id="methode">
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(03)</span>{`\u00A0 ${t.methode.section}`}</span>
          <div data-reveal><h2 className="t">{t.methode.titreLigne1}<br />{t.methode.titreLigne2}</h2></div>
        </div>
        <div className="steps">
          <div className="stp" data-reveal><span className="t">{t.methode.etape01Moment}</span><span className="n">01</span><h3>{t.methode.etape01Titre}</h3><p>{t.methode.etape01Texte}</p></div>
          <div className="stp" data-reveal><span className="t">{t.methode.etape02Moment}</span><span className="n">02</span><h3>{t.methode.etape02Titre}</h3><p>{t.methode.etape02Texte}</p></div>
          <div className="stp" data-reveal><span className="t">{t.methode.etape03Moment}</span><span className="n">03</span><h3>{t.methode.etape03Titre}</h3><p>{t.methode.etape03Texte}</p></div>
          <div className="stp" data-reveal><span className="t">{t.methode.etape04Moment}</span><span className="n">04</span><h3>{t.methode.etape04Titre}</h3><p>{t.methode.etape04Texte}</p></div>
        </div>
        {/* LA METHODE ETAIT UN CUL-DE-SAC. Entre le hero et la grille de
            prix, le lecteur traversait quatre sections sans un seul bouton :
            celui que le deroulement en une semaine venait de convaincre
            devait encore descendre la biographie du studio avant de pouvoir
            agir. Le lien mene aux prix, pas au contact — a ce point de la
            page il veut savoir combien, pas ecrire.

            L ANCRE N EST PAS PREFIXEE PAR `lien()`, et c est correct : une
            ancre pure designe le document courant, qui est deja dans la bonne
            langue. `lien()` la laisse d ailleurs passer telle quelle. */}
        <div className="c-row" data-reveal style={{ marginTop: 34 }}>
          <a className="btn btn-line" href={lien(locale, "#offres")}>{t.methode.cta}<span className="ar">→</span></a>
        </div>
      </div>
    </section>
  );
}
