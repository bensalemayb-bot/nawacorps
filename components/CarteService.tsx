import {
  CHF_UNIT,
  FROM_PREFIX,
  MONTHLY_SUFFIX,
  QUOTE_LABEL,
  TVA_LABEL,
  formatChfAmount,
  isQuote,
} from "@/lib/format";
import type { ServiceCatalogue } from "@/lib/catalogue";
import { type FamilleRangee, hrefService } from "@/lib/catalogue-familles";

/**
 * UNE PRESTATION, EN CARTE — le dessin partage par l accueil et /services.
 *
 * POURQUOI CE COMPOSANT EXISTE. Le catalogue s affichait en lignes : intitule,
 * filet pointille, prix a droite. C est la mise en page d une carte de
 * restaurant, et elle range quatorze « sur devis » les uns sous les autres en
 * invitant a les comparer — alors qu aucun ne se compare, un tirage et un
 * papier se chiffrent apres un echange. Les trois formules, elles, sont
 * presentees en cartes et c est ce qui fonctionne : un titre, une phrase, un
 * prix, une porte de sortie. Le reste du catalogue prend la meme grammaire.
 *
 * UN SEUL COMPOSANT POUR DEUX PAGES, parce que la carte du studio et l index
 * des prestations montrent EXACTEMENT les memes lignes : deux rendus separes
 * divergeraient au premier ajout en base.
 *
 * NOM, DESCRIPTION ET PRIX VIENNENT DE POSTGRES. Rien n est ecrit ici :
 * `service` sort de la table Service telle quelle.
 *
 * `sobre` RETIRE LA DESCRIPTION, ET RIEN D AUTRE. C est le second rang de la
 * vitrine de l accueil : identite et photographie, suivi et hebergement, ligne
 * restauration restent affichees, avec leur nom, leur prix et la porte vers
 * leur famille — mais la description part, parce que c est elle qui fait le
 * poids visuel d une carte. Le lecteur la retrouve en entier sur la page de la
 * famille, a un clic, et sur /services, qui est le catalogue et les garde
 * toutes. L echelle, elle, est portee par la grille (.cat-grid-sobre) : une
 * carte ne decide pas de sa propre taille.
 *
 * LA CARTE EST UN LIEN, ET SA DESTINATION DEPEND DE LA PAGE QUI LA REND.
 *
 * Sur l accueil, on lui passe une FAMILLE : la carte est la seule porte vers
 * la page de cette famille, et elle la nomme en toutes lettres au pied, parce
 * qu un lien doit dire ou il mene — cliquer « Cartes de visite » pour atterrir
 * sur « Les imprimés » sans prevenir n est pas une navigation, c est une
 * surprise.
 *
 * Sur /services, on lui passe `versSaPage` : la carte ouvre la page de la
 * prestation elle-meme. La destination n a alors pas a etre nommee — le titre
 * de la carte EST le nom de la page. Cette page-la est le catalogue : elle
 * promet qu on y voit tout ce qui est vendu et que chaque ligne s ouvre.
 * Une carte muette y etait une impasse.
 *
 * Sans l un ni l autre, la carte reste du contenu : mieux vaut une carte sans
 * porte de sortie qu une porte sur le vide.
 */
/**
 * Le pied de carte quand elle ouvre sa propre page.
 *
 * Il n y a rien a nommer — le titre de la carte est deja le nom de la page —,
 * mais il faut une AFFORDANCE : sans elle, seul le survol dit que la carte est
 * cliquable, et un telephone ne survole rien. Trois mots qui disent ce qu on
 * obtient, pas « En savoir plus », qui ne dit rien.
 */
const LIBELLE_SA_PAGE = "Voir le détail";

export default function CarteService({
  service,
  famille,
  versSaPage = false,
  sobre = false,
}: {
  service: ServiceCatalogue;
  /** Passee UNIQUEMENT quand la carte doit ouvrir la page de sa famille. */
  famille?: FamilleRangee;
  /**
   * La carte ouvre la page de la prestation, /services/<slug>. L emporte sur
   * `famille` : les deux ne sont jamais passees ensemble, et si elles
   * l etaient, la page la plus precise gagne.
   */
  versSaPage?: boolean;
  /** Second rang de la vitrine : la description n est pas rendue. */
  sobre?: boolean;
}) {
  const porte = versSaPage
    ? { href: hrefService(service.slug), libelle: LIBELLE_SA_PAGE }
    : famille
      ? { href: famille.href, libelle: famille.contenu.libelle }
      : null;

  const contenu = (
    <>
      <h3>{service.name}</h3>
      {sobre ? null : <p className="d">{service.description}</p>}
      {/* LE PRIX RESTE EN BAS DE CARTE : sur une grille, les titres n ont pas
          tous la meme hauteur, et un prix qui flotte a mi-hauteur casse la
          ligne de lecture horizontale d une rangee a l autre.

          ET IL PORTE DESORMAIS SA MENTION. « TVA comprise » vivait au pied de
          la grille, a plusieurs cartes de distance ; la regle vaut par UNITE DE
          LECTURE, et un dirigeant qui compare deux cartes ne lit pas le bas de
          page. La mention descend donc sous le montant, ou elle est aussi un
          argument : c est un prix qu il n a pas a recalculer.

          « sur devis » N A PLUS DE PENDANT SUR LA CARTE, et c est une
          correction, pas un oubli. La carte affichait « chiffré après deux
          questions » : ces deux questions n existaient nulle part — ni dans le
          formulaire, ni dans l assistant, ni dans aucun parcours — et la regle
          de preuve (guide de voix §8) interdit d affirmer un processus qui n a
          pas lieu. La phrase apparaissait quatre fois sur l accueil.
          Ce qui reste est vrai et suffit : le raisonnement complet — pourquoi
          un tirage, un format et un papier ne se devinent pas — vit une fois
          par bloc, en prose, juste au-dessus des cartes, et il y est suivi de
          « Réponse le jour ouvrable suivant. », qui repond a la seule question
          que « sur devis » laisse ouverte : quand est-ce que je saurai le
          prix ? */}
      {isQuote(service) || service.priceCents === null ? (
        <p className="px px-devis">{QUOTE_LABEL}</p>
      ) : (
        <p className="px">
          {service.priceFrom ? <small>{FROM_PREFIX}</small> : null}
          {`${formatChfAmount(service.priceCents)}${CHF_UNIT}`}
          {service.isMonthly ? (
            <small className="per">{MONTHLY_SUFFIX}</small>
          ) : null}
          <small className="px-note px-tva">{TVA_LABEL}</small>
        </p>
      )}
      {porte ? (
        <span className="go">
          {porte.libelle} <span className="ar">→</span>
        </span>
      ) : null}
    </>
  );

  if (!porte) {
    return (
      <article className="cat-it" data-reveal>
        {contenu}
      </article>
    );
  }

  // Pas de next/link sur le site public : les revelations au scroll ne
  // s initialisent qu une fois (cf. CLAUDE.md).
  return (
    <a className="cat-it" href={porte.href} data-reveal>
      {contenu}
    </a>
  );
}
