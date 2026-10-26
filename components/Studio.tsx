import Detail from "@/components/Detail";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";

// Section (04) Le controle — reference/binacore.html lignes 1084-1102 pour la
// structure (citation, une phrase, bande de faits, puis les trois paragraphes
// dans « Voir le détail » depuis le 26.10.2026, et un lien).
//
// LA REGLE DU CONTROLE, MOT POUR MOT (.agents/product-marketing.md, « Le
// controle ») : l assistant ne s engage jamais a la place du patron. Seule
// exception, dite en toutes lettres : l accuse de reception relu et valide une
// fois. N ecrivez jamais « rien ne part sans vous » ici : c est faux.
//
// LA PROMESSE SUR LES DONNEES EST BORNEE a « Les données de votre assistant »
// (revue A tour 2, M2) : ce site et Leo passent par un fournisseur d IA hors
// de Suisse, et la page de confidentialite le dit. Le premier fait de la
// bande nomme donc l assistant (« En Suisse / Données de l assistant ») ;
// l ancien « Genève / Données en Suisse » se lisait comme une promesse sur
// tout le site (revue de code agent-metier, n°1).
//
// LE TROISIEME PARAGRAPHE DIT QUI NOUS SOMMES, avec la franchise du « 0
// client » (PM §6). Le pluriel « nous » n autorise aucun effectif, aucune
// equipe, aucun bureau (glossaire anglais §2, LCD art. 3).
export default function Studio({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);

  return (
    <section id="studio" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(04)</span>{`  ${t.studio.section}`}</span>
          <h2 className="sr-only">{t.studio.titreCache}</h2>
        </div>
        <div className="studio-grid">
          <p className="studio-quote" data-reveal>{t.studio.citationDebut}<em>{t.studio.citationItalique}</em>{t.studio.citationFin}</p>
          <div className="studio-txt" data-reveal>
            <p>{t.studio.phrase}</p>
            <div className="facts">
              <div><b>{t.studio.faitDonnees}</b><span>{t.studio.faitDonneesNote}</span></div>
              <div><b>{t.studio.faitReleve}</b><span>{t.studio.faitReleveNote}</span></div>
              <div><b>{t.studio.faitPaiements}</b><span>{t.studio.faitPaiementsNote}</span></div>
            </div>
            {/* LES TROIS PARAGRAPHES, fermes par defaut (26.10.2026) : la
                phrase et les trois faits disent l essentiel ; le detail du
                controle, le releve et qui nous sommes restent a un clic. */}
            <Detail libelle={t.studio.detail}>
              <p>{t.studio.paragraphe1}</p>
              <p>{t.studio.paragraphe2}</p>
              <p>{t.studio.paragraphe3}</p>
            </Detail>
            {/* Un seul renvoi, sobre, vers /studio : c est une section de
                confiance, pas une section de vente. <a> classique (B7). */}
            <p style={{ marginTop: "1.8rem", marginBottom: 0 }}>
              <a className="lnk" href={lien(locale, "/studio")} style={{ color: "var(--ink)" }}>
                {t.studio.lien}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
