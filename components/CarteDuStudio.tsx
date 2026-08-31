import { whatsapp } from "@/lib/site";
import { isQuote } from "@/lib/format";
import {
  MENTION_DEVIS_COURTE,
  MENTION_REPONSE,
  MENTION_TVA,
} from "@/lib/familles";
import { chargerCatalogue, parCategories } from "@/lib/catalogue";
import {
  CATEGORIES_FAMILLES,
  FAMILLES_EN_SECOND,
  FAMILLES_EN_VITRINE,
  familleDuService,
  parFamilles,
} from "@/lib/catalogue-familles";
import BoutonDevis from "@/components/BoutonDevis";
import CarteService from "@/components/CarteService";

/**
 * Le catalogue hors formules, sur l accueil.
 *
 * LE TITRE NE DIT PLUS « La carte du studio ». « Carte » designait quatre
 * choses sur la meme page — le menu d un restaurant, une carte de visite, une
 * carte de fidelite, et ce catalogue-ci. Un restaurateur lisait menu, un
 * garagiste lisait carte de visite, et les deux avaient raison. Le titre dit
 * desormais ce qu il est.
 *
 * CE QUI A CHANGE, ET POURQUOI. Ces prestations s affichaient en LIGNES :
 * intitule, filet pointille, prix a droite, sur deux colonnes dans un encart
 * clair. C etait la mise en page d une carte de restaurant, et elle desservait
 * ce qu elle presentait — quatorze lignes rangees en colonne s appellent a
 * etre comparees entre elles, alors que douze d entre elles sont sur devis et
 * ne se comparent pas. Elles passent en CARTES, dans l esprit de la grille des
 * trois formules juste au-dessus : un titre, ce que c est en une phrase, le
 * prix ou « sur devis », et la porte vers la page de sa famille.
 *
 * PUIS LES QUATORZE CARTES ONT CESSE D ETRE EGALES, et c est le changement le
 * plus recent. Une grille uniforme dit au lecteur que tout se vaut ; elle
 * mettait un sticker vitrine au meme rang que la ligne reseaux sociaux. La
 * section rend donc deux grilles :
 *
 *   1. LA VITRINE — imprimes et reseaux sociaux, en deux colonnes, avec leur
 *      description. Avec les trois formules de site rendues juste au-dessus
 *      par components/Offres.tsx, ce sont les trois lignes que le studio met
 *      devant. Les sites n ont pas a etre repris ici : ils ouvrent l ecran.
 *   2. LE SECOND RANG — identite et photographie, suivi et hebergement, ligne
 *      restauration, en quatre colonnes et sans description. Elles ne
 *      disparaissent pas : elles gardent leur nom, leur prix, leur page et
 *      leur devis. Elles cessent seulement de se disputer la vitrine.
 *
 * LE PARTAGE EST LU DANS lib/catalogue-familles.ts, jamais decide ici :
 * /services rend le meme classement, et deux listes ecrites a deux endroits
 * divergent au premier arbitrage.
 *
 * LES TROIS FORMULES NE SONT PAS REPRISES ICI. Elles etaient listees en tete
 * sous le libelle « Les formules », a l epoque ou cette section etait une
 * carte de noms et de prix : les revoir en liste juste sous leurs propres
 * cartes n avait pas de cout. En cartes, ce serait la MEME carte rendue deux
 * fois a un ecran d intervalle. L accueil affiche donc toujours les dix-huit
 * lignes visibles du catalogue, mais chacune une fois : les quatre `principal`
 * par components/Offres.tsx juste avant, les quatorze autres ici.
 *
 * TOUT VIENT DE POSTGRES. Aucun nom, aucune description, aucun montant n est
 * ecrit dans ce fichier.
 *
 * STRUCTURE : dans la maquette, .studio-menu est un sous-bloc de
 * `section.offres.green` — il herite donc du fond pin et de ses couleurs. Rendu
 * en frere dans page.tsx, il doit reconstituer ce contexte, d'ou le
 * `section.offres.green` ci-dessous.
 * L'espacement reste celui de la maquette parce que la jointure est neutralisee
 * des deux cotes : Offres porte paddingBottom 0, cette section paddingTop 0.
 * Le seul ecart vertical entre les deux blocs redevient donc le
 * `margin-top:clamp(60px,8vw,110px)` de .studio-menu, exactement comme dans la
 * source. Le motif `style="padding-top:0"` est lui-meme utilise par la maquette
 * (sections #services, #studio, #faq).
 */

const DEVIS_HREF = whatsapp(
  "Bonjour, j'aimerais un devis pour une prestation.",
);

export default async function CarteDuStudio() {
  // Lecture PARTAGEE avec Offres, rendue juste avant sur le meme ecran (cf.
  // lib/catalogue.ts). Le filtre par categories reste ici, en memoire.
  const catalogue = await chargerCatalogue();
  const services = parCategories(catalogue, [...CATEGORIES_FAMILLES]);
  // LES DEUX COMPTES DE LA PHRASE SUR LE DEVIS, DERIVES DE LA BASE. Ecrits en
  // dur, ils seraient faux au premier ajout au catalogue ou a la premiere
  // ligne masquee depuis /admin — et une phrase qui compte faux discredite
  // celle qui explique. `isQuote` est la meme condition que celle qui decide
  // du rendu de chaque carte : les deux ne peuvent pas se contredire.
  const surDevis = catalogue.filter(isQuote).length;
  const chiffrees = catalogue.length - surDevis;
  // Aplati DANS L ORDRE DES FAMILLES, et non dans celui de `sortOrder` : en
  // base, les imprimes et l identite se suivent en alternance dans la meme
  // categorie `annee`. Rendues telles quelles, les cartes auraient donne une
  // grille ou « Cartes de visite » et « Photos » se cotoient sans logique
  // visible. Aucune ligne n est perdue : toute categorie filtree ici a une
  // famille d accueil, et les deux listes de rang couvrent les cinq familles
  // (cf. lib/catalogue-familles.ts).
  const vitrine = parFamilles(services, FAMILLES_EN_VITRINE).flatMap(
    (groupe) => groupe.lignes,
  );
  const second = parFamilles(services, FAMILLES_EN_SECOND).flatMap(
    (groupe) => groupe.lignes,
  );

  return (
    <section className="offres green" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="studio-menu">
          <div className="sm-head" data-reveal>
            <h2>Tout ce que <span className="serif-i">fait le studio</span></h2>
          </div>
          {/* L accroche annonce l ordre de lecture au lieu de le subir : ce
              qui vient d abord, pourquoi, et ce qui suit. « ligne par ligne » a
              quitte cette phrase avec les lignes elles-memes. */}
          <p className="lede" data-reveal style={{ marginBottom: 30 }}>Le site est le produit d&apos;entrée ; il n&apos;est pas le seul atelier. Ce qui s&apos;imprime et ce qui se publie chaque semaine passent devant : ce sont les deux que le studio met en vitrine à côté des formules. Le reste suit, entier, et se commande avec un site chez moi comme sans — les supports de restaurant compris.</p>
          {/* AUCUN TITRE DE GROUPE AU-DESSUS DE CETTE PREMIERE GRILLE, et c est
              voulu. Chaque carte porte deja le nom de sa famille au pied, en
              guise de porte de sortie : un intertitre par famille redirait le
              meme mot juste au-dessus de trois cartes qui le portent. Le second
              rang, lui, porte une bande — non pour nommer une famille, mais
              pour dire qu on change de rang, ce qu aucune carte ne peut dire
              d elle-meme. L index /services separe vraiment les familles :
              c est sa raison d etre, ce n est pas celle de l accueil. */}
          <div className="cat-grid cat-grid-avant">
            {vitrine.map((service) => (
              <CarteService
                key={service.id}
                service={service}
                famille={familleDuService(service)}
              />
            ))}
          </div>
          <p className="cat-rang" data-reveal>
            <span>Également à l&apos;atelier</span>
          </p>
          {/* CETTE PHRASE NE PARLE QUE DE CETTE PAGE, et c est deliberé. Une
              premiere version expliquait le second rang par une habitude des
              clients — « les lignes qu on décide en cours de route » : le
              studio a un client et zero reference de site (positionnement §9),
              il n a donc aucune source pour decrire un comportement d achat.
              Ce qui reste est verifiable en descendant l ecran : ces trois
              lignes sont entieres, elles gardent page, prix et devis. */}
          <p className="cat-rang-d" data-reveal>Logo et photos, hébergement du site, restaurants et cafés : trois pages entières, qui gardent leur prix et leur devis. Elles passent après, pas au rabais.</p>
          <div className="cat-grid cat-grid-sobre">
            {second.map((service) => (
              <CarteService
                key={service.id}
                service={service}
                famille={familleDuService(service)}
                sobre
              />
            ))}
          </div>
          {/* POURQUOI « SUR DEVIS » EST ECRIT EN PROSE, ET PAS EN NOTE DE BAS
              DE GRILLE. La majorite des lignes du catalogue sont sur devis :
              tant que la raison n est pas donnee, le lecteur lit un refus de
              repondre, et deux des trois lignes de vitrine en font partie.

              LA PHRASE DE COMPTE EST CELLE DE /services, AU CARACTERE PRES.
              L accueil disait « 13 lignes sur 18 sont annoncées sur devis »,
              l index « 5 lignes portent un prix ferme, 13 sont annoncées sur
              devis » : la meme donnee, dite de deux facons, dans deux pages que
              le meme visiteur traverse a la suite. Le guide de voix §8 impose
              une formulation unique, et c est la seconde qui a ete gardee —
              elle commence par ce qui est chiffre. Les deux comptes restent
              CALCULES sur la base : ecrits a la main, ils deviendraient faux au
              premier ajout au catalogue.

              LE RAISONNEMENT, LUI, EST REDUIT A SA PHRASE CENTRALE. Il tenait
              en un paragraphe entier, rendu mot pour mot ici ET sur /services.
              La version longue reste la ou le lecteur compare les treize lignes
              — le catalogue ; l accueil garde la raison, pas la demonstration.
              Les deux viennent de lib/familles.ts, jamais recopiees. */}
          <div className="sm-devis" data-reveal>
            <p className="sm-devis-t">
              {chiffrees} lignes portent un prix ferme, {surDevis} sont annoncées
              sur devis.
            </p>
            <p>{MENTION_DEVIS_COURTE}</p>
            <p className="sm-devis-r">{MENTION_REPONSE}</p>
          </div>
          <div className="p-note" data-reveal>
            <span>{MENTION_TVA}</span>
            <BoutonDevis href={DEVIS_HREF} sujet="devis-carte-du-studio">
              Demander un devis →
            </BoutonDevis>
          </div>
        </div>
      </div>
    </section>
  );
}
