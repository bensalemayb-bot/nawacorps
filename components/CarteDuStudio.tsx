import { whatsapp } from "@/lib/site";
import { chargerCatalogue, parCategories } from "@/lib/catalogue";
import {
  CATEGORIES_FAMILLES,
  familleDuService,
  parFamilles,
} from "@/lib/catalogue-familles";
import BoutonDevis from "@/components/BoutonDevis";
import CarteService from "@/components/CarteService";

/**
 * La carte du studio — le catalogue hors formules, sur l accueil.
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
 * LES TROIS FORMULES NE SONT PLUS REPRISES ICI. Elles etaient listees en tete
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
  const services = parCategories(await chargerCatalogue(), [
    ...CATEGORIES_FAMILLES,
  ]);
  // Aplati DANS L ORDRE DES FAMILLES, et non dans celui de `sortOrder` : en
  // base, les imprimes et l identite se suivent en alternance dans la meme
  // categorie `annee`. Rendues telles quelles, les cartes auraient donne une
  // grille ou « Cartes de visite » et « Photos » se cotoient sans logique
  // visible. Aucune ligne n est perdue : toute categorie filtree ici a une
  // famille d accueil (cf. lib/catalogue-familles.ts).
  const lignes = parFamilles(services).flatMap((groupe) => groupe.lignes);

  return (
    <section className="offres green" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="studio-menu">
          <div className="sm-head" data-reveal>
            <h2>La carte <span className="serif-i">du studio</span></h2>
          </div>
          {/* « ligne par ligne » a quitte cette accroche avec les lignes
              elles-memes. Ce qui reste dit les deux choses que le visiteur ne
              devine pas : pourquoi presque tout est sur devis, et que rien ici
              n oblige a prendre un site. */}
          <p className="lede" data-reveal style={{ marginBottom: 30 }}>Tout ce que le studio vend en dehors des trois formules. Le suivi porte un prix ; le reste se chiffre sur devis, parce qu&apos;un tirage, un format et un papier ne se devinent pas. Tout se commande avec un site chez moi comme sans — la ligne restauration comprise.</p>
          {/* AUCUN TITRE DE GROUPE AU-DESSUS DES CARTES, et c est voulu.
              Chaque carte porte deja le nom de sa famille au pied, en guise de
              porte de sortie : un intertitre par famille redirait le meme mot
              juste au-dessus de trois cartes qui le portent. Les familles
              restent lisibles parce que l ordre de la grille les tient
              groupees. L index /prestations, lui, les separe vraiment — c est
              sa raison d etre, ce n est pas celle de l accueil. */}
          <div className="cat-grid">
            {lignes.map((service) => (
              <CarteService
                key={service.id}
                service={service}
                famille={familleDuService(service)}
              />
            ))}
          </div>
          <div className="p-note" data-reveal>
            {/* « devis en cinq minutes » etait un engagement de reactivite
                sans source : le seul admis est « réponse le jour ouvrable
                suivant », et il vit au formulaire. */}
            <span>Prix en francs suisses, TVA comprise. Les lignes sur devis se chiffrent après un échange.</span>
            <BoutonDevis href={DEVIS_HREF} sujet="devis-carte-du-studio">
              Demander un devis →
            </BoutonDevis>
          </div>
        </div>
      </div>
    </section>
  );
}
