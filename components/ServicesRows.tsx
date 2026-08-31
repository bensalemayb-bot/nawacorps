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
// Le depliage est pilote par Interactions.tsx, qui attache un click sur
// `.row-h` de chaque `[data-row]` — code deja en place depuis B4.
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
            <div className="row-h"><span className="n">01</span><h3>Refonte de site</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Votre site actuel, repris et refait : une page, lisible sur téléphone, rapide, à jour. Les textes existants sont récupérés puis réécrits — vous signalez ce qui a changé depuis. Une semaine dès votre feu vert, deux allers-retours compris ; le site fini vous est présenté et validé avant d&apos;être mis en ligne. C&apos;est le produit d&apos;entrée, et celui qui porte tout le reste : le formulaire, les rendez-vous, la fiche Google et l&apos;assistant s&apos;y branchent.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">02</span><h3>Demandes, devis &amp; rendez-vous</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Un formulaire qui pose les bonnes questions — prestation, surface, délai, adresse — et qui vous arrive rempli plutôt qu&apos;en trois lignes vagues. Sur les formules qui les incluent, le visiteur repart avec une estimation chiffrée et pose lui-même son rendez-vous, à 23 h comme le dimanche. Ce qui atterrit chez vous n&apos;est plus un « rappelez-moi » : c&apos;est une demande que vous pouvez chiffrer sans décrocher trois fois.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">03</span><h3>Assistant &amp; relances</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Un assistant formé sur vos prestations et vos tarifs répond aux questions courantes jour et nuit, note le nom et le numéro, et vous alerte sur votre téléphone. Les demandes restées sans réponse sont relancées seules, et tout ce qui entre s&apos;aligne dans un tableau de bord. Il tourne sur ce site : la bulle en bas de l&apos;écran, c&apos;est lui — ouvrez-la, c&apos;est la démonstration.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">04</span><h3>Identité, imprimés &amp; photos</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Un logotype si vous n&apos;en avez pas, une palette et des typographies qui tiennent du site aux véhicules, et les règles qui disent où va quoi. Puis ce que vos clients gardent en main : cartes de visite 85 × 55 recto-verso, affiches, stickers vitrine. Les photos de votre entreprise sont prises sur place, un jour où vous travaillez — il n&apos;y a rien à mettre en scène. Ces lignes se chiffrent sur devis : un tirage, un format et un papier ne se devinent pas.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">05</span><h3>Fiche Google &amp; réseaux sociaux</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Votre fiche Google complétée : photos, horaires exacts, zone d&apos;intervention, réponses aux avis. C&apos;est ce que voient vos futurs clients avant votre site, et souvent à sa place. Les réseaux sociaux, eux, se prennent en entier — le calendrier du mois vous est proposé, vous le validez, et il part : visuels, textes, publication et réponses aux messages. La production est faite avec un partenaire du studio, et le travail vous est rendu par moi. Sur devis.</p></div></div>
          </div>
          <div className="row" data-row>
            <div className="row-h"><span className="n">06</span><h3>La ligne restauration</h3><span className="pl">+</span></div>
            <div className="row-b"><div><p>Pour les cafés et les restaurants : la carte reprise en entier — l&apos;ordre des sections, la lisibilité des prix, la place des mentions obligatoires —, avec ses fichiers d&apos;impression, sa version en ligne et son QR. Puis ce qui tient la salle : chevalets de table, carte de fidélité, bons cadeaux et supports de saison. Une ligne à part, tenue depuis le début, et ouverte à qui n&apos;a pas de site chez moi. Sur devis.</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
