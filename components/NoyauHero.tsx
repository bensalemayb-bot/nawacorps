import { chargerCatalogue } from "@/lib/catalogue";
import { CHF_UNIT, MONTHLY_SUFFIX, formatChfAmount } from "@/lib/format";
import { WHATSAPP_HREF } from "@/lib/site";

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
 */
export default async function NoyauHero() {
  // LES DEUX MONTANTS DU HERO VIENNENT DE POSTGRES, comme partout ailleurs sur
  // le site. Ils etaient ecrits en dur ici — « Dès 699.– » et « Dès 49.–/mois »
  // — ce qui les rendait faux le jour ou la grille bouge en base, sur l ecran
  // que tout le monde voit en premier. La lecture est memoisee par requete
  // (lib/catalogue.ts) : Offres et la carte de l agence, rendues plus bas,
  // partagent celle-ci et ne paient pas un second aller-retour.
  const catalogue = await chargerCatalogue();
  const prixDe = (slug: string) => {
    const service = catalogue.find((s) => s.slug === slug);
    if (!service || service.priceCents === null) return null;
    return `${formatChfAmount(service.priceCents)}${CHF_UNIT}`;
  };
  // Base injoignable, ligne masquee depuis /admin, slug renomme : la phrase se
  // referme sans le montant plutot que d afficher un prix invente ou un trou.
  const entree = prixDe("la-vitrine");
  const suivi = prixDe("hebergement");

  return (
    <header className="noyau-hero" id="top">
      <div className="noyau-track" id="noyau-track">

        {/* ---------- temps 1 — l'accroche ---------- */}
        <div className="noyau-beat hero" data-temps="">
          <div className="wrap hero-in">
            <div className="kicker">
              <span className="meta"><span className="index">®</span>&nbsp; Agence digitale indépendante</span>
              <span className="meta">Genève, Suisse</span>
              <span className="meta">Sites de PME</span>
            </div>
            <h1>
              {/* Chaque .l doit tenir sur UNE ligne : binacore.css les revele
                  ligne par ligne, et un debordement casse l'animation autant
                  que la mise en page (le hero-foot passe sous la ligne de
                  flottaison). La maquette tient 21 caracteres au plus large —
                  s'y tenir en reecrivant. */}
              <span className="l"><span>Un site qui reçoit</span></span>
              <span className="l"><span>vos demandes, <span className="serif-i">refait</span></span></span>
              <span className="l"><span>en une semaine.</span></span>
            </h1>
            <div className="hero-foot">
              {/* Le sous-titre n enumerait que des fonctions de site. Il dit
                  desormais que le site est le point d entree, pas le catalogue
                  entier. Le h1 au-dessus, lui, ne bouge pas : ses lignes .l
                  sont mesurees a 21 caracteres. */}
              <p className="hero-sub">Le compte à rebours démarre quand vous dites oui : vos textes, je les reprends de votre site actuel. Vous n&apos;avez rien à préparer. Demande de devis, prise de rendez-vous et fiche Google comprises.{entree ? ` Dès ${entree}, TVA comprise.` : ""} Et le site n&apos;est pas tout : identité, imprimés, photos et réseaux sociaux se prennent ici aussi, sur devis.</p>
              <div className="hero-cta">
                <a className="btn" href={WHATSAPP_HREF} target="_blank" rel="noopener">Faire refaire mon site <span className="ar">→</span></a>
                <a className="btn btn-line" href="#travaux">Voir les avant / après</a>
              </div>
              <span className="hero-scroll"><i></i> Défiler</span>
            </div>
          </div>
        </div>

        {/* ---------- temps 2 — la phrase ----------
            Calee a gauche pendant que le noyau derive a droite (piste `x`). */}
        <div className="noyau-beat noyau-beat-2" data-temps="">
          <div className="wrap">
            <span className="meta"><span className="index">(001)</span>&nbsp; Le noyau</span>
            <div className="noyau-say">
              <p>Il reçoit les demandes, chiffre les devis, prend les rendez-vous — <span className="serif-i">sans que vous y touchiez</span>.</p>
            </div>
          </div>
        </div>

        {/* ---------- temps 3 — la plongee ----------
            Le noyau remplit l'ecran : le texte passe en clair (.noyau-beat-3),
            et la nav s'inverse au meme moment via html.noyau-dark. */}
        <div className="noyau-beat noyau-beat-3" data-temps="">
          <div className="wrap">
            <span className="meta"><span className="index">(002)</span>&nbsp; Le coeur</span>
            <div className="noyau-spec">
              <p className="noyau-fig">
                <span className="noyau-num">1</span>
                <span className="noyau-unit">semaine</span>
              </p>
              <ul className="noyau-specs">
                <li><span className="k">Atelier</span><span className="v">Genève, Suisse</span></li>
                <li><span className="k">Livraison</span><span className="v">Une semaine</span></li>
                <li><span className="k">À fournir</span><span className="v">Rien</span></li>
                <li><span className="k">Suivi</span><span className="v">{suivi ? `Dès ${suivi}${MONTHLY_SUFFIX}` : "Dès la 2ᵉ année"}</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- temps 4 — la sortie ---------- */}
        <div className="noyau-beat noyau-beat-4" data-temps="">
          <div className="wrap">
            <div className="noyau-out">
              <p>Un site ne se regarde pas. Il travaille, ou il ne sert à rien.</p>
              <a className="btn" href="#travaux">Voir les avant / après <span className="ar">→</span></a>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
