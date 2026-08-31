import type { CSSProperties } from "react";

// Section Services — reference/binacore.html lignes 940-973 pour la structure.
//
// Les six lignes sont STATIQUES et le restent : ce sont des categories
// editoriales du studio, pas les enregistrements de la table Service. Rien
// ici ne vient de la base, et aucun montant n'y est ecrit — les prix vivent en
// base et s'affichent dans Offres et la carte du studio.
//
// POURQUOI ELLES ONT ETE REECRITES. Le repositionnement PME avait resserre les
// six gestes sur les seules FONCTIONS D'UN SITE — recevoir, chiffrer, prendre
// rendez-vous, repondre. Le site est bien le produit d'entree, et il reste en
// tete de liste ; mais le studio vend aussi de l'identite, des imprimes, des
// photos, la fiche Google, la production des reseaux sociaux et une ligne
// restauration. Une section de services qui n'en montre rien laisse croire que
// le catalogue s'arrete au site, et le visiteur qui cherche des cartes de
// visite repart. Les deux lignes « devis » et « rendez-vous » ont donc fusionne
// pour liberer deux places : elles decrivaient deux faces du meme geste.
// Voir .agents/product-marketing.md §5.
//
// AUCUNE SYNCHRONISATION D'AGENDA n'est promise ici : l'affirmation n'a pas de
// source dans le positionnement, et elle a ete retiree partout ailleurs.
//
// PUIS LES SIX ONT ETE ETOFFEES, ET LE REGISTRE MONTE. Chacune s'arretait apres
// deux ou trois phrases, la ou un dirigeant de PME genevoise qui compare avec
// des agences a quatre ou huit mille francs a besoin d'une de plus : celle qui
// dit ce qu'il obtient concretement. Ce qui a ete ajoute est FACTUEL et
// sourcable, jamais un adjectif — la sequence de livraison (« presente et
// valide avant d'etre mis en ligne », positionnement §5), le format des cartes
// (85 x 55 recto-verso), le calendrier propose puis valide, le tableau de bord.
// Un professionnel se reconnait a sa precision, pas a son vocabulaire.
//
// LE PARTENAIRE DE PRODUCTION EST NOMME au geste 05, et il doit le rester :
// « vous ne touchez a rien » laissait entendre que tout se fait ici. La
// production des reseaux sociaux se fait AVEC un partenaire (positionnement
// §7), lib/familles.ts l'ecrit, et la contradiction se lisait a un clic.
//
// LES TITRES 02 ET 03 ONT ETE REECRITS, ET SEULEMENT LES TITRES. « Prise de
// rendez-vous et devis en ligne » et « L'assistant qui repond et relance » se
// lisaient comme un seul et meme service : les deux parlaient d'une machine
// qui prend la demande a votre place, et le proprietaire les a lus comme un
// doublon. Les CONTENUS, eux, sont bien deux choses differentes — 02 est un
// FORMULAIRE, une suite de questions qui arrive remplie dans votre boite ;
// 03 est un ASSISTANT CONVERSATIONNEL, qui repond de lui-meme et relance. Les
// titres disent desormais cette difference des le premier coup d'oeil :
// « Devis et rendez-vous directement sur le site » nomme le support, « Un
// assistant IA qui repond a votre place » nomme l'agent. Les paragraphes
// deplies n'ont pas bouge : ils etaient deja justes.
//
// CHAQUE GESTE FINIT SUR SA PAGE. La section portait six blocs de contenu
// commercial et pas une seule sortie : le visiteur qui venait de lire trois
// phrases sur les cartes de visite n'avait nulle part ou aller. Un renvoi
// clot maintenant chaque paragraphe deplie, vers la page qui developpe le
// geste. Ce sont des <a> classiques, jamais next/link (decision B7) : la
// navigation client ne rejoue pas les revelations au scroll d'Interactions.tsx,
// qui ne s'initialisent qu'une fois.
//
// L'EN-TETE EST UN <button>, PAS UN <div>. Les six .row-h portaient un « + »,
// changeaient le curseur et ouvraient un panneau : ils ressemblaient a des
// boutons sans en etre. Consequence, ils etaient hors de l'ordre de tabulation
// et morts au clavier. Le passage a <button type="button"> les y remet sans
// toucher a Interactions.tsx : le selecteur qui attache le clic reste `.row-h`,
// la classe ne bouge pas, et Entree comme Espace declenchent nativement le
// meme evenement click. Les styles natifs du bouton sont neutralises par
// STYLE_ENTETE ci-dessous — surtout `font`, que le bouton n'herite PAS.
//
// RESERVE ASSUMEE SUR aria-expanded : l'etat ouvert/ferme est ecrit par
// Interactions.tsx, qui pose la classe `open` sur `.row` et ne connait pas cet
// attribut. La valeur rendue ici est donc l'etat INITIAL, et elle ne se met pas
// a jour au depliage. Le contenu, lui, reste lisible d'un lecteur d'ecran en
// toutes circonstances : `.row-b` n'est jamais `display:none`, il est reduit a
// une hauteur nulle. Synchroniser l'attribut demande de toucher Interactions.tsx
// — hors du perimetre de ce chantier, a reprendre avec lui.
//
// Le depliage est pilote par Interactions.tsx, qui attache un click sur
// `.row-h` de chaque `[data-row]` — code deja en place depuis B4.

/** Neutralisation des styles que l'agent utilisateur applique a <button> et
 *  que `.row-h` ne couvre pas. `padding` est volontairement ABSENT : il est
 *  pose par `.row-h` et anime par `.row:hover .row-h`, un style en ligne le
 *  figerait. `font` est le seul indispensable — la police d'un bouton n'est
 *  pas heritee, et `.pl` n'en declare pas. */
const STYLE_ENTETE: CSSProperties = {
  appearance: "none",
  background: "transparent",
  border: 0,
  borderRadius: 0,
  width: "100%",
  textAlign: "left",
  font: "inherit",
  color: "inherit",
  cursor: "pointer",
};

/** Le renvoi herite sinon du gris de `.row-b p` et se confond avec le texte.
 *  Meme correction que `.pf-hors .lnk` dans app/services.css. */
const STYLE_RENVOI: CSSProperties = { color: "var(--ink)" };

export default function ServicesRows() {
  return (
    <section id="services" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(02)</span>&nbsp; Services</span>
          {/* « un seul interlocuteur » a disparu du titre : la formule
              appartient deja a un acteur du panel de veille, et le guide de
              voix l'interdit nommement. « La meme main » dit la meme chose —
              une personne, du site a la carte de visite — sans reprendre le
              vocabulaire de quelqu'un d'autre. */}
          <div data-reveal><h2 className="t">Six gestes,<br />la même main.</h2></div>
        </div>
        <div className="rows" data-reveal>
          <div className="row" data-row>
            <button type="button" className="row-h" style={STYLE_ENTETE} aria-expanded="false"><span className="n">01</span><h3>Refonte de site</h3><span className="pl">+</span></button>
            <div className="row-b"><div><p>Votre site actuel, repris et refait : une page, lisible sur téléphone, rapide, à jour. Les textes existants sont récupérés puis réécrits — vous signalez ce qui a changé depuis. Une semaine dès votre feu vert, deux allers-retours compris ; le site fini vous est présenté et validé avant d&apos;être mis en ligne. C&apos;est le produit d&apos;entrée, et celui qui porte tout le reste : le formulaire, les rendez-vous, la fiche Google et l&apos;assistant s&apos;y branchent.</p><p><a className="lnk" style={STYLE_RENVOI} href="/services">Voir les trois formules →</a></p></div></div>
          </div>
          <div className="row" data-row>
            <button type="button" className="row-h" style={STYLE_ENTETE} aria-expanded="false"><span className="n">02</span><h3>Devis et rendez-vous directement sur le site</h3><span className="pl">+</span></button>
            <div className="row-b"><div><p>Un formulaire qui pose les bonnes questions — prestation, surface, délai, adresse — et qui vous arrive rempli plutôt qu&apos;en trois lignes vagues. Sur les formules qui les incluent, le visiteur repart avec une estimation chiffrée et pose lui-même son rendez-vous, à 23 h comme le dimanche. Ce qui atterrit chez vous n&apos;est plus un « rappelez-moi » : c&apos;est une demande que vous pouvez chiffrer sans décrocher trois fois.</p><p><a className="lnk" style={STYLE_RENVOI} href="/services/le-site">Voir Le Site →</a></p></div></div>
          </div>
          <div className="row" data-row>
            <button type="button" className="row-h" style={STYLE_ENTETE} aria-expanded="false"><span className="n">03</span><h3>Un assistant IA qui répond à votre place</h3><span className="pl">+</span></button>
            <div className="row-b"><div><p>Un assistant formé sur vos prestations et vos tarifs répond aux questions courantes jour et nuit, note le nom et le numéro, et vous alerte sur votre téléphone. Les demandes restées sans réponse sont relancées seules, et tout ce qui entre s&apos;aligne dans un tableau de bord. Il tourne sur ce site : la bulle en bas de l&apos;écran, c&apos;est lui — ouvrez-la, c&apos;est la démonstration.</p><p><a className="lnk" style={STYLE_RENVOI} href="/services/l-assistant">Voir L&apos;Assistant →</a></p></div></div>
          </div>
          <div className="row" data-row>
            <button type="button" className="row-h" style={STYLE_ENTETE} aria-expanded="false"><span className="n">04</span><h3>Logo, imprimés et photos</h3><span className="pl">+</span></button>
            <div className="row-b"><div><p>Un logotype si vous n&apos;en avez pas, une palette et des typographies qui tiennent du site aux véhicules, et les règles qui disent où va quoi. Puis ce que vos clients gardent en main : cartes de visite 85 × 55 recto-verso, affiches, stickers vitrine. Les photos de votre entreprise sont prises sur place, un jour où vous travaillez — il n&apos;y a rien à mettre en scène. Ces lignes se chiffrent sur devis : un tirage, un format et un papier ne se devinent pas.</p><p><a className="lnk" style={STYLE_RENVOI} href="/services/identite">Voir le logo et les photos →</a></p></div></div>
          </div>
          <div className="row" data-row>
            <button type="button" className="row-h" style={STYLE_ENTETE} aria-expanded="false"><span className="n">05</span><h3>Fiche Google et réseaux sociaux</h3><span className="pl">+</span></button>
            <div className="row-b"><div><p>Votre fiche Google complétée : photos, horaires exacts, zone d&apos;intervention, réponses aux avis. C&apos;est ce que voient vos futurs clients avant votre site, et souvent à sa place. Les réseaux sociaux, eux, se prennent en entier — le calendrier du mois vous est proposé, vous le validez, et il part : visuels, textes, publication et réponses aux messages. La production est faite avec un partenaire du studio, et le travail vous est rendu par moi. Sur devis.</p><p><a className="lnk" style={STYLE_RENVOI} href="/services/reseaux-sociaux">Voir les réseaux sociaux →</a></p></div></div>
          </div>
          <div className="row" data-row>
            <button type="button" className="row-h" style={STYLE_ENTETE} aria-expanded="false"><span className="n">06</span><h3>Restaurants et cafés</h3><span className="pl">+</span></button>
            <div className="row-b"><div><p>Pour les cafés et les restaurants : la carte reprise en entier — l&apos;ordre des sections, la lisibilité des prix, la place des mentions obligatoires —, avec ses fichiers d&apos;impression, sa version en ligne et son QR. Puis ce qui tient la salle : chevalets de table, carte de fidélité, bons cadeaux et supports de saison. Une ligne à part, tenue depuis le début, et ouverte à qui n&apos;a pas de site chez moi. Sur devis.</p><p><a className="lnk" style={STYLE_RENVOI} href="/services/restauration">Voir la ligne restaurant →</a></p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
