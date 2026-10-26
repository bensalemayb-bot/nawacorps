import HeroRotation from "@/components/HeroRotation";
import RotationDouleurs from "@/components/RotationDouleurs";
import { avecPrix, lireMiseEnPlace } from "@/lib/catalogue";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/site";

/**
 * LE NOYAU — le texte du hero, en flux normal.
 *
 * Ce composant ne dessine rien : il pose la PISTE (#noyau-track) dont la hauteur
 * definit la duree du scrub, et les quatre temps qui defilent par-dessus le
 * noyau epingle. Le visuel, lui, est rendu par NoyauStage, monte hors du
 * wrapper de scroll — voir l'en-tete de app/noyau.css.
 *
 * Ce decoupage n'est pas cosmetique : le texte reste ici du vrai DOM, rendu par
 * le serveur, donc indexable et lisible sans JavaScript. Seule son opacite est
 * reprise par NoyauStage. Si le moteur ne demarre jamais, le hero reste un hero
 * — quatre blocs de texte lisibles, simplement sans l'objet derriere.
 *
 * Le temps 1 porte la classe .hero : les regles d'entree de binacore.css
 * (kicker, h1 ligne a ligne, hero-foot, et leur mise en pause tant que le loader
 * tourne) s'y appliquent telles quelles, sans etre dupliquees.
 *
 * TOUT LE TEXTE VIT DANS lib/dictionnaires, ET LES TROIS BUDGETS DE PLACE SONT
 * DOCUMENTES LA-BAS, avec leur decompte dans les deux langues. Les commentaires
 * ci-dessous disent POURQUOI chaque budget existe et comment il a ete mesure ;
 * le dictionnaire dit ce que chaque langue consomme. Reecrire une de ces
 * chaines demande de relire les deux.
 *
 * LE COMPOSANT EST ASYNC pour un seul montant, la mise en place, lu en base au
 * temps 3. Les deux accueils sont deja en `force-dynamic`.
 */
export default async function NoyauHero({
  locale = "fr",
}: {
  locale?: Locale;
}) {
  const t = dictionnaire(locale);
  // LE SEUL MONTANT DU HERO : la mise en place, lue en base (lib/catalogue.ts).
  // `lireMiseEnPlace` ne leve jamais : sans base ou sans ligne, la valeur se
  // lit sans montant. Lecture memoisee, partagee avec Offres et Faq.
  const montant = await lireMiseEnPlace();

  return (
    <header className="noyau-hero" id="top">
      <div className="noyau-track" id="noyau-track">

        {/* ---------- temps 1 — l'accroche ---------- */}
        <div className="noyau-beat hero" data-temps="">
          <div className="wrap hero-in">
            <div className="kicker">
              {/* PAS DE ® : aucune marque n est deposee (LCD art. 3). « PME »
                  se dit `small business` en anglais, jamais `SME` ni `SMB`.
                  Geneve est dans « Studio genevois ». */}
              <span className="meta">{t.hero.kickerMetier}</span>
              <span className="meta">{t.hero.kickerCible}</span>
            </div>
            <h1 aria-label={t.hero.h1Complet}>
              {/* DEUX `.l` : « L assistant qui », puis quatre fins qui tournent
                  (components/HeroRotation.tsx). binacore.css revele les `.l`
                  par `:nth-child`, ligne a ligne. CHAQUE LIGNE TIENT EN 21
                  CARACTERES AU PLUS (CLAUDE.md) : la plus longue fin en fait
                  21. Les fins partagent une cellule de grille, la hauteur du
                  titre ne bouge donc pas d une fin a l autre.
                  L ARIA-LABEL PORTE LA PHRASE COMPLETE : les fins qui tournent
                  sont aria-hidden. */}
              <span className="l"><span>{t.hero.h1Debut}</span></span>
              <span className="l"><span><HeroRotation phrases={t.hero.h1Rotation} /></span></span>
            </h1>
            <div className="hero-foot">
              {/* LE SOUS-TITRE TIENT EN DEUX LIGNES RENDUES, et c est mesure.
                  `.hero` est un `min-height:100svh` en `flex-end` : chaque ligne
                  de ce paragraphe pousse le contenu vers le haut, et une
                  troisieme fait sortir le pied du pli sur un portable de 768px.
                  Le seuil est un seuil de LIGNES dans les 42ch de `.hero-sub`,
                  pas de caracteres : ~104 signes en francais, ~94 en anglais.
                  Le prix n y monte pas (revue A tour 2, bloc 1) : il est au
                  temps 3, ligne des faits. */}
              <p className="hero-sub">{t.hero.sousTitre}</p>
              <div className="hero-cta">
                {/* LE BOUTON PRINCIPAL MONTRE LA DEMO (/demonstrations,
                    decision d Ayoub du 25.10.2026) : Leo ne s ouvre que sur
                    la demande (« Demander ma démo », /devis).
                    Le secondaire mene a (03) Comment ca se passe (#methode).
                    Les ancres pures ne sont pas prefixees par `lien()`. */}
                <a className="btn" href={lien(locale, "/demonstrations")}>{t.hero.ctaPrincipal}<span className="ar">→</span></a>
                <a className="btn btn-line" href={lien(locale, "#methode")}>{t.hero.ctaSecondaire}</a>
              </div>
              {/* L espace entre l icone et le mot est DANS l expression :
                  ecrit dans le JSX, il ferait un troisieme enfant et React
                  intercalerait un `<!-- -->` dans le HTML francais. */}
              <span className="hero-scroll"><i></i>{` ${t.hero.defiler}`}</span>
            </div>
          </div>
        </div>

        {/* ---------- temps 2 — la phrase ----------
            Calee a gauche pendant que le noyau derive a droite (piste `x`). */}
        <div className="noyau-beat noyau-beat-2" data-temps="">
          <div className="wrap">
            <span className="meta"><span className="index">(001)</span>{`\u00A0 ${t.hero.temps2Section}`}</span>
            <div className="noyau-say">
              {/* CE QUE LE PATRON PERD, PUIS LA REPONSE (25.10.2026). Le mot
                  qui tourne se barre et laisse place au suivant
                  (components/RotationDouleurs.tsx). La phrase complete est
                  dans l aria-label. .noyau-say est capee a 30ch : la ligne
                  qui tourne doit tenir sur une ou deux lignes. */}
              <p aria-label={t.hero.douleurComplet}>
                {t.hero.douleurDebut}
                <RotationDouleurs mots={t.hero.douleurs} />
                {t.hero.douleurFin}
              </p>
              <p className="noyau-reponse">{t.hero.reponse}</p>
            </div>
          </div>
        </div>

        {/* ---------- temps 3 — la plongee ----------
            Le noyau remplit l'ecran : le texte passe en clair (.noyau-beat-3),
            et la nav s'inverse au meme moment via html.noyau-dark. */}
        <div className="noyau-beat noyau-beat-3" data-temps="">
          <div className="wrap">
            <span className="meta"><span className="index">(002)</span>{`\u00A0 ${t.hero.temps3Section}`}</span>
            {/* LE TEMPS 3 DIT LA DEMO EN FAITS : « Rien à payer avant
                l essai », puis le tableau. « Rien » tient dans `.noyau-num`,
                dessine pour un seul mot court (mesure a 375 px). La promesse sur les donnees nomme l assistant dans
                son etiquette (« Donnees de l assistant / En Suisse ») : sous
                « La demo », elle ne doit viser ni les demandes montrees, ni
                ce site, ni Leo (revue A tour 2, M2 ; revue de code n°1). */}
            <div className="noyau-spec">
              <p className="noyau-fig">
                <span className="noyau-num">{t.hero.grandMot}</span>
                <span className="noyau-unit">{t.hero.grandMotUnite}</span>
              </p>
              <ul className="noyau-specs">
                <li><span className="k">{t.hero.specDonnees}</span><span className="v">{t.hero.specDonneesValeur}</span></li>
                <li><span className="k">{t.hero.specOutils}</span><span className="v">{t.hero.specOutilsValeur}</span></li>
                <li><span className="k">{t.hero.specDevis}</span><span className="v">{t.hero.specDevisValeur}</span></li>
                <li><span className="k">{t.hero.specReleve}</span><span className="v">{t.hero.specReleveValeur}</span></li>
                {/* LE MONTANT VIENT DE LA BASE ET NE VOYAGE JAMAIS SANS SA
                    MENTION : le gabarit porte le montant et la TVA dans la
                    meme unite de lecture. Sans ligne en base, la valeur dit
                    seulement quand on paie. */}
                <li>
                  <span className="k">{t.hero.specMiseEnPlace}</span>
                  <span className="v">
                    {montant
                      ? avecPrix(t.hero.specMiseEnPlaceValeur, montant, locale)
                      : t.hero.specMiseEnPlaceValeurSansMontant}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- temps 4 — la sortie ---------- */}
        <div className="noyau-beat noyau-beat-4" data-temps="">
          <div className="wrap">
            <div className="noyau-out">
              {/* LA SORTIE EST LE SLOGAN : « Vous validez. Il s occupe du
                  reste. » La plus grande phrase du hero dit le controle. */}
              <p>{t.hero.sortie}</p>
              {/* DEUX SORTIES AU DERNIER ECRAN : les exemples (/demonstrations)
                  et WhatsApp (decision d Ayoub du 26.10.2026 : « Appeler »
                  ouvrait le telephone ; il veut etre joint sur WhatsApp) — pour un
                  artisan, le geste naturel (audit CRO du 25.10.2026, §2.4). */}
              <div className="noyau-out-cta">
                <a className="btn" href={lien(locale, "/demonstrations")}>{t.hero.sortieCtaPrincipal}<span className="ar">→</span></a>
                <a className="btn btn-line" href={whatsappHref(locale)} target="_blank" rel="noopener">{t.hero.sortieCtaSecondaire}</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
