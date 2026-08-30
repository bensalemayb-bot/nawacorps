import {
  CHF_UNIT,
  FROM_PREFIX,
  MONTHLY_SUFFIX,
  QUOTE_LABEL,
  formatChfAmount,
  isQuote,
} from "@/lib/format";
import type { ServiceCatalogue } from "@/lib/catalogue";
import type { FamilleRangee } from "@/lib/catalogue-familles";

/**
 * UNE PRESTATION, EN CARTE — le dessin partage par l accueil et /prestations.
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
 * LA CARTE EST UN LIEN QUAND — ET SEULEMENT QUAND — ON LUI PASSE UNE FAMILLE.
 * Sur l accueil, la carte est la seule porte vers la page de sa famille : elle
 * la nomme en toutes lettres au pied, parce qu un lien doit dire ou il mene —
 * cliquer « Cartes de visite » pour atterrir sur « Les imprimés » sans
 * prevenir n est pas une navigation, c est une surprise. Sur /prestations, le
 * bloc porte deja le titre de la famille et son lien « tout voir » : la carte
 * y redirait trois fois la meme chose, elle reste donc du contenu.
 */
export default function CarteService({
  service,
  famille,
}: {
  service: ServiceCatalogue;
  /** Passee UNIQUEMENT quand la carte doit ouvrir la page de sa famille. */
  famille?: FamilleRangee;
}) {
  const contenu = (
    <>
      <h3>{service.name}</h3>
      <p className="d">{service.description}</p>
      {/* Le prix reste en bas de carte : sur une grille, les titres n ont pas
          tous la meme hauteur, et un prix qui flotte a mi-hauteur casse la
          ligne de lecture horizontale d une rangee a l autre. */}
      <p className="px">
        {isQuote(service) || service.priceCents === null ? (
          QUOTE_LABEL
        ) : (
          <>
            {service.priceFrom ? <small>{FROM_PREFIX}</small> : null}
            {`${formatChfAmount(service.priceCents)}${CHF_UNIT}`}
            {service.isMonthly ? (
              <small className="per">{MONTHLY_SUFFIX}</small>
            ) : null}
          </>
        )}
      </p>
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
