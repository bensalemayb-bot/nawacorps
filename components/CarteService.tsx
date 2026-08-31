import {
  CHF_UNIT,
  FROM_PREFIX,
  MONTHLY_SUFFIX,
  QUOTE_LABEL,
  QUOTE_NOTE,
  TVA_LABEL,
  formatChfAmount,
  isQuote,
} from "@/lib/format";
import type { ServiceCatalogue } from "@/lib/catalogue";
import type { FamilleRangee } from "@/lib/catalogue-familles";

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
 * LA CARTE EST UN LIEN QUAND — ET SEULEMENT QUAND — ON LUI PASSE UNE FAMILLE.
 * Sur l accueil, la carte est la seule porte vers la page de sa famille : elle
 * la nomme en toutes lettres au pied, parce qu un lien doit dire ou il mene —
 * cliquer « Cartes de visite » pour atterrir sur « Les imprimés » sans
 * prevenir n est pas une navigation, c est une surprise. Sur /services, le
 * bloc porte deja le titre de la famille et son lien « tout voir » : la carte
 * y redirait trois fois la meme chose, elle reste donc du contenu.
 */
export default function CarteService({
  service,
  famille,
  sobre = false,
}: {
  service: ServiceCatalogue;
  /** Passee UNIQUEMENT quand la carte doit ouvrir la page de sa famille. */
  famille?: FamilleRangee;
  /** Second rang de la vitrine : la description n est pas rendue. */
  sobre?: boolean;
}) {
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

          « sur devis » recoit son pendant, pour la raison inverse : seul, il se
          lit comme un refus de repondre. Trois mots disent que c en est une —
          voir QUOTE_NOTE dans lib/format.ts. Ils tombent au second rang de
          l accueil, ou la carte est deja reduite a son os et ou le
          raisonnement est ecrit juste au-dessus, en prose. */}
      {isQuote(service) || service.priceCents === null ? (
        <p className="px px-devis">
          {QUOTE_LABEL}
          {sobre ? null : <small className="px-note">{QUOTE_NOTE}</small>}
        </p>
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
      {famille ? (
        <span className="go">
          {famille.contenu.libelle} <span className="ar">→</span>
        </span>
      ) : null}
    </>
  );

  if (!famille) {
    return (
      <article className="cat-it" data-reveal>
        {contenu}
      </article>
    );
  }

  // Pas de next/link sur le site public : les revelations au scroll ne
  // s initialisent qu une fois (cf. CLAUDE.md).
  return (
    <a className="cat-it" href={famille.href} data-reveal>
      {contenu}
    </a>
  );
}
