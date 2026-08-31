import {
  CHF_UNIT,
  formatChfAmount,
  isQuote,
  libelleDevis,
  mentionTva,
  prefixeDes,
  suffixeMensuel,
} from "@/lib/format";
import {
  descriptionService,
  nomService,
  type ServiceCatalogue,
} from "@/lib/catalogue";
import { type FamilleRangee, hrefService } from "@/lib/catalogue-familles";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";

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
 * >>> AUJOURD HUI IL N EN SERT PLUS QU UNE, ET C EST A REPARER. <<<
 * app/(site)/services/page.tsx a recopie ce composant sous le nom
 * `CarteCatalogue` — meme balise, memes classes, meme ordre — parce que
 * celui-ci ne prenait pas de `locale` et affichait donc « sur devis » et
 * « TVA comprise » sous les prix d une page anglaise. Le manque est comble
 * ci-dessous : `CarteCatalogue` peut disparaitre et la page repasser sur ce
 * composant en lui passant `versSaPage` et `locale`. Son propre docblock
 * l annonce en toutes lettres. Tant que les deux coexistent, TOUTE correction
 * de l un doit etre reportee sur l autre — et `versSaPage` reste ici, sans
 * appelant, en attendant ce repli.
 *
 * NOM, DESCRIPTION ET PRIX VIENNENT DE POSTGRES. Rien n est ecrit ici :
 * `service` sort de la table Service telle quelle, et c est `nomService()` /
 * `descriptionService()` qui choisissent la colonne selon la langue — jamais
 * `service.name` en direct, sinon la page anglaise affiche du francais.
 *
 * `locale` EST OPTIONNELLE ET VAUT « fr », comme partout ailleurs sur
 * l accueil : un appelant qui ne la passe pas rend exactement ce qu il rendait
 * avant le chantier anglais, a l octet pres. C est ce qui rendait la bascule
 * sure — et non une invitation a l omettre.
 *
 * LA MENTION DE TVA SUIT LE MONTANT DANS LES DEUX LANGUES. Elle etait figee sur
 * `TVA_LABEL`, la constante francaise : une carte anglaise affichait donc
 * « TVA comprise » sous son prix. Elle vient desormais de `mentionTva(locale)`.
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
 * surprise. Le nom de la famille a lui aussi sa version anglaise
 * (`libelleEn`), et le repli sur le francais est celui que
 * lib/catalogue-familles.ts prevoit.
 *
 * Avec `versSaPage`, la carte ouvre la page de la prestation elle-meme. La
 * destination n a alors pas a etre nommee — le titre de la carte EST le nom de
 * la page. C est le mode du catalogue /services : il promet qu on y voit tout
 * ce qui est vendu et que chaque ligne s ouvre, et une carte muette y etait une
 * impasse. Ce mode n a plus d appelant depuis la copie signalee plus haut ; il
 * en retrouvera un au repli.
 *
 * Sans l un ni l autre, la carte reste du contenu : mieux vaut une carte sans
 * porte de sortie qu une porte sur le vide.
 */
export default function CarteService({
  service,
  famille,
  versSaPage = false,
  sobre = false,
  locale = "fr",
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
  /** La langue de la page qui rend la carte. Voir le docblock. */
  locale?: Locale;
}) {
  const t = dictionnaire(locale);

  /**
   * L affordance de la carte quand elle ouvre sa PROPRE page : il n y a rien a
   * nommer — le titre de la carte est deja le nom de la page —, mais sans elle
   * seul le survol dirait que la carte est cliquable, et un telephone ne
   * survole rien. Trois mots qui disent ce qu on obtient, pas « En savoir
   * plus », qui ne dit rien.
   */
  const porte = versSaPage
    ? { href: hrefService(service.slug), libelle: t.carte.voirLeDetail }
    : famille
      ? {
          href: famille.href,
          libelle:
            locale === "en"
              ? (famille.contenu.libelleEn ?? famille.contenu.libelle)
              : famille.contenu.libelle,
        }
      : null;

  const contenu = (
    <>
      <h3>{nomService(service, locale)}</h3>
      {sobre ? null : <p className="d">{descriptionService(service, locale)}</p>}
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
        <p className="px px-devis">{libelleDevis(locale)}</p>
      ) : (
        <p className="px">
          {service.priceFrom ? <small>{prefixeDes(locale)}</small> : null}
          {`${formatChfAmount(service.priceCents)}${CHF_UNIT}`}
          {service.isMonthly ? (
            <small className="per">{suffixeMensuel(locale)}</small>
          ) : null}
          <small className="px-note px-tva">{mentionTva(locale)}</small>
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
  // s initialisent qu une fois (cf. CLAUDE.md). Le `href` passe par `lien()`,
  // qui laisse le chemin francais intact et prefixe `/en` en anglais — les
  // ancres de famille (`/services/imprimes#carte-visite`) comprises.
  return (
    <a className="cat-it" href={lien(locale, porte.href)} data-reveal>
      {contenu}
    </a>
  );
}
