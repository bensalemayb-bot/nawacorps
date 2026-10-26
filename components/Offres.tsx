import Detail from "@/components/Detail";
import GrilleAbonnement from "@/components/GrilleAbonnement";
import { avecPrix, lireMiseEnPlace } from "@/lib/catalogue";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";

/**
 * Section (05) L offre — « Ce que vous payez, et quand ».
 * Structure de reference/binacore.html lignes 976-1031 (.price-grid, .price,
 * .p-note), sans une regle CSS nouvelle.
 *
 * TROIS CARTES STATIQUES : la demo, l essai, l abonnement
 * (.agents/product-marketing.md §5, parcours). Les anciennes formules de site
 * restent en base pour /admin, mais cette section ne les lit plus : plus de
 * grille de formules, plus de « Recommandé », plus de « dès ».
 *
 * LA MISE EN PLACE, LUE EN BASE (lib/catalogue.ts, `SLUG_MISE_EN_PLACE`),
 * sur la troisieme carte et dans la note. Il est
 * place a cote de la garantie — on paie apres l essai — et la mention de TVA
 * le suit dans la meme unite de lecture : sous le chiffre, et dans la phrase de
 * la note, via `mentionTva()` / `avecPrix()`, jamais recopiee. Sans ligne en
 * base, la carte et la note se lisent sans montant.
 *
 * UNE PHRASE PAR CARTE (26.10.2026) : les textes entiers et la note sont
 * ranges dans « Voir le détail », sous la grille — rien n est retire.
 *
 * PUIS LA GRILLE DE L ABONNEMENT (decision du 25.10.2026) : trois paliers lus
 * en base et l offre d introduction, rendus par components/GrilleAbonnement
 * dans les memes cartes `.price`. Sans grille complete en base, rien n est
 * rendu, et les textes disent « selon votre volume », sans montant.
 */
export default async function Offres({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);
  // Lecture memoisee, partagee avec le hero et la FAQ sur le meme ecran.
  const montant = await lireMiseEnPlace();

  // paddingBottom 0 : le pied de page vert suit, la jointure garde
  // l espacement de la maquette.
  return (
    <section className="offres green" id="offres" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(05)</span>{`  ${t.offres.section}`}</span>
          <div data-reveal><h2 className="t">{t.offres.titreLigne1}<br />{t.offres.titreLigne2}</h2></div>
        </div>

        <div className="price-grid">
          <article className="price" data-reveal>
            <div className="lab"><span>{t.offres.demoTete}</span></div>
            <h3>{t.offres.demoTitre}</h3>
            <p className="d">{t.offres.demoCourt}</p>
            <p className="num">{t.offres.demoPaye}</p>
            {/* La demo est la premiere marche : c est la seule carte qui porte
                un bouton, vers la demande de demo ; `.price .btn` le pousse en
                bas de carte (margin-top:auto). */}
            <a className="btn" href={lien(locale, "/demonstrations")}>
              {t.offres.demoCta}<span className="ar">→</span>
            </a>
          </article>

          <article className="price" data-reveal>
            <div className="lab"><span>{t.offres.essaiTete}</span></div>
            <h3>{t.offres.essaiTitre}</h3>
            <p className="d">{t.offres.essaiCourt}</p>
            <p className="num">{t.offres.essaiPaye}</p>
            <p className="num-tva">{t.offres.essaiPayeNote}</p>
          </article>

          <article className="price" data-reveal>
            <div className="lab"><span>{t.offres.abonnementTete}</span></div>
            <h3>{t.offres.abonnementTitre}</h3>
            <p className="d">{t.offres.abonnementCourt}</p>
            {montant ? (
              <>
                <p className="num">{montant}</p>
                <p className="num-tva">{avecPrix(t.offres.abonnementPayeNote, montant, locale)}</p>
              </>
            ) : (
              <p className="num-tva">{t.offres.abonnementPayeSansMontant}</p>
            )}
          </article>
        </div>

        <GrilleAbonnement locale={locale} forme="price" />

        {/* LES TEXTES ENTIERS DES TROIS CARTES ET LA NOTE, fermes par defaut
            (26.10.2026) : les cartes n en gardent qu une phrase, pour que les
            prix se lisent d un coup d oeil. La note porte le montant : sa
            mention de TVA reste dans la meme phrase (`avecPrix`). */}
        <div className="p-note" data-reveal>
          <Detail libelle={t.offres.detail}>
            <p>{t.offres.demoTexte}</p>
            <p>{t.offres.essaiTexte}</p>
            <p>{t.offres.abonnementTexte}</p>
            <p>
              {montant
                ? avecPrix(t.offres.note, montant, locale)
                : t.offres.noteSansMontant}
            </p>
          </Detail>
        </div>
      </div>
    </section>
  );
}
