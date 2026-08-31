// Section Le studio — reference/binacore.html lignes 1084-1102, copie verbatim.
//
// `style="padding-top:0"` de la maquette devient `style={{ paddingTop: 0 }}` :
// la section se colle a Methode, qui porte deja son padding bas.
//
// LES DEUX PARAGRAPHES NE FINISSAIENT QUE SUR LE SITE. « celle qui dessine et
// construit votre site », puis « aucun intermediaire entre vous et celui qui
// fait le site » : la section qui presente le studio le reduisait a un
// fabricant de sites, alors que c est precisement ici que le metier entier doit
// se voir. Le premier paragraphe nomme donc trois gestes differents — logotype,
// site, photographie — et le second porte ce qu il est seul a pouvoir dire :
// l apres-livraison, avec un exemple qui n est pas un site.
//
// « Vous parlez a une seule personne » est devenu « la meme personne » : le h1
// du hero dit desormais « Une seule personne. », et la formule serait lue deux
// fois sur la meme page.
//
// UN TROISIEME PARAGRAPHE A ETE INSERE AU MILIEU, et c est celui qui manquait.
// La section disait QUI fait le travail, deux fois, sans jamais dire ce que ca
// change pour celui qui achete. Elle en est le meilleur endroit : c est ici que
// le lecteur decide s il a affaire a un professionnel. Ce qu on lui donne sont
// trois faits d exploitation, tous ecrits au positionnement §5 — le depart au
// feu vert, la validation avant mise en ligne, les deux allers-retours bornes.
// Le guide de voix §4 le dit : celui qui ecrit ce qu il ne fait pas est cru sur
// ce qu il fait.
//
// CE PARAGRAPHE NE PLAIDE PAS LE PRIX, et ne doit jamais s y mettre. Les faits
// de structure — pas de bureau, pas d equipe commerciale — restent ecrits, mais
// jamais suivis d une charniere causale vers le tarif (« et c est ce qui
// permet… ») : une justification attire l attention sur le doute qu elle veut
// lever.
//
// « AUCUNE SOUS-TRAITANCE » A ETE RETIRE, ET NE DOIT PAS REVENIR. L affirmation
// est fausse : la production des reseaux sociaux est faite avec un partenaire,
// et /prestations/reseaux-sociaux comme lib/familles.ts l ecrivent en toutes
// lettres — la contradiction se lisait a deux clics d ici. La phrase avait deja
// ete corrigee une fois avant d etre reintroduite par une reecriture. Ce qui la
// remplace porte sur ce qui est vrai et suffit a l argument : le site est
// dessine et construit par la meme personne. Meme correction dans la cinquieme
// reponse de components/Faq.tsx.
export default function Studio() {
  return (
    <section id="studio" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(04)</span>&nbsp; Le studio</span>
          <h2 className="sr-only">Le studio</h2>
        </div>
        <div className="studio-grid">
          <p className="studio-quote" data-reveal>« Vous parlez à celui qui <em>fait</em> le travail. »</p>
          <div className="studio-txt" data-reveal>
            <p>Nawa Corps est le studio de création digitale d&apos;Ayoub Bensalem, designer et développeur à Genève. Pas de commerciaux, pas de chargé de compte, pas de brief qui passe de main en main : la personne qui répond à votre message est celle qui dessine votre logotype, code votre site et photographie votre atelier.</p>
            <p>Ce que ça change se voit à l&apos;usage. Le travail commence à votre feu vert, pas à la réception de vos textes. Le site fini vous est présenté et validé avant d&apos;être mis en ligne. Deux allers-retours sont compris, et ils sont écrits — une prestation qu&apos;on borne est une prestation qu&apos;on tient.</p>
            <p>Pas de bureaux, pas d&apos;équipe commerciale : votre site est dessiné et construit par la même personne, et vous traitez avec elle du premier message à la livraison. C&apos;est encore elle l&apos;année suivante, quand un tarif change, qu&apos;il faut une affiche pour la rentrée ou qu&apos;un formulaire doit poser une question de plus.</p>
            <div className="facts">
              <div><b>Genève</b><span>Basé ici</span></div>
              <div><b>1 sem.</b><span>Refonte livrée</span></div>
              <div><b>FR / EN</b><span>Langues</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
