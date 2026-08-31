import { chargerCatalogue, prixEntreeCents } from "@/lib/catalogue";
import { CHF_UNIT, formatChfAmount } from "@/lib/format";

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
  // LE MONTANT DU HERO VIENT DE POSTGRES, comme partout ailleurs sur le site.
  // Il etait ecrit en dur ici, ce qui le rendait faux le jour ou la grille
  // bouge en base, sur l ecran que tout le monde voit en premier. La lecture
  // est memoisee par requete (lib/catalogue.ts) : Offres et la carte du studio,
  // rendues plus bas, partagent celle-ci et ne paient pas un second
  // aller-retour.
  //
  // IL Y EN AVAIT DEUX. Le second — « Dès 49.–/mois », le suivi, dans le
  // tableau du temps 3 — s affichait SANS « TVA comprise », ce que CLAUDE.md
  // interdit et que le guide de voix §8 tranche : « en cas de doute, on retire
  // le prix plutot que la mention ». Il est retourne dans la grille (05), ou la
  // mention l accompagne, et `prixDe` est parti avec lui.
  const catalogue = await chargerCatalogue();
  // Base injoignable, ligne masquee depuis /admin, slug renomme : la phrase se
  // referme sans le montant plutot que d afficher un prix invente ou un trou.
  // MEME REGLE QUE L EXTRAIT GOOGLE, et surtout pas une regle a soi : la meta
  // description de app/(site)/page.tsx affiche ce meme prix d entree, sur le
  // meme ecran. Deriver ici par le slug « la-vitrine » et la-bas par le plus
  // petit montant marchait tant que les deux coincidaient — une formule moins
  // chere au catalogue les aurait fait diverger, et le visiteur aurait lu deux
  // prix d entree differents a une seconde d intervalle.
  const centsEntree = prixEntreeCents(catalogue);
  const entree =
    centsEntree === null ? null : `${formatChfAmount(centsEntree)}${CHF_UNIT}`;

  return (
    <header className="noyau-hero" id="top">
      <div className="noyau-track" id="noyau-track">

        {/* ---------- temps 1 — l'accroche ---------- */}
        <div className="noyau-beat hero" data-temps="">
          <div className="wrap hero-in">
            <div className="kicker">
              {/* PAS DE ® : aucune marque n est deposee et la forme juridique
                  du studio n est meme pas arretee — le sigle affirmait un
                  enregistrement qui n existe pas (LCD art. 3). L espace
                  qu il occupait etait decorative, pas informative ; les deux
                  autres puces de ce kicker (« Genève, Suisse », « Pour les
                  PME ») n en portent deja aucune, donc la ligne reste
                  equilibree sans lui. */}
              <span className="meta">Studio de création digitale</span>
              <span className="meta">Genève, Suisse</span>
              <span className="meta">Pour les PME</span>
            </div>
            <h1>
              {/* LE TITRE NOMME LE METIER, PAS UN PRODUIT. Il annoncait « Un
                  site qui recoit vos demandes, refait en une semaine » : le
                  studio y devenait un vendeur de sites, et l identite, les
                  imprimes, la photo et les reseaux tombaient en appendice a la
                  fin du sous-titre. Le site reste le produit d entree — il
                  ouvre l enumeration et le sous-titre le chiffre — mais il
                  n est plus le sujet.

                  Chaque .l doit tenir sur UNE ligne : binacore.css les revele
                  ligne par ligne, et un debordement casse l'animation autant
                  que la mise en page (le hero-foot passe sous la ligne de
                  flottaison). La maquette tient 21 caracteres au plus large —
                  s'y tenir en reecrivant. Decompte des trois lignes ci-dessous,
                  serif-i compris : 15, 16, 19. */}
              <span className="l"><span>Site, imprimés,</span></span>
              <span className="l"><span>photos, réseaux.</span></span>
              <span className="l"><span>Une seule <span className="serif-i">personne</span>.</span></span>
            </h1>
            <div className="hero-foot">
              {/* LE SOUS-TITRE EST COURT PARCE QU IL N A PAS DE PLACE, et la
                  contrainte se mesure. `.hero` est un `min-height:100svh` en
                  `justify-content:flex-end` : le pied est colle au bas du pli,
                  donc CHAQUE ligne de ce paragraphe pousse le contenu vers le
                  HAUT, et quand le contenu depasse le pli, c est le pied qui
                  sort de l ecran par le bas.

                  Coupe n°1 : a 328 caracteres il rendait sept lignes, le pied
                  descendait a 898px et debordait de 46px sous un viewport de
                  1442 x 852.

                  Coupe n°2, celle-ci. A 151 caracteres il rendait TROIS lignes
                  dans les 42ch de `.hero-sub`, le contenu du hero mesurait
                  774,51px, et le pied sortait de l ecran des que la fenetre
                  descendait sous 774,5px de haut — le lot d un portable de
                  768px. Balayage releve a 1445 de large, marge sous le pied :
                  760px -> -14,5 · 740px -> -34,5 · 700px -> -74,5.

                  LE SEUIL EST UN SEUIL DE LIGNES, PAS DE CARACTERES, et c est
                  ce qui a decide la reecriture. Retirer la seule phrase de
                  trop — « Le reste sort du meme atelier, sur devis » — ramenait
                  le texte a 109 caracteres mais le laissait sur TROIS lignes
                  (mesure : 83,23px pour une interligne de 27,744px) : zero
                  pixel gagne. La barre est a 42 caracteres par ligne rendus,
                  soit ~84 pour deux lignes. « je reprends vos textes » est donc
                  parti avec elle. Le mecanisme n est pas perdu pour autant : il
                  est ecrit trois fois plus bas sur la meme page — Q1 et la
                  derniere reponse de components/Faq.tsx, geste 01 de
                  components/ServicesRows.tsx.

                  Ce qui reste porte les trois choses que le h1 ne peut pas
                  dire, et le guide de voix §5 est tenu : « une semaine » ne
                  voyage pas seule, elle est accompagnee de l absence de travail
                  a fournir. Le prix d entree garde sa mention de TVA dans la
                  meme unite de lecture.

                  APRES : deux lignes, contenu 760,02px, seuil de debordement
                  ramene a 746,8px de haut. A 1446 x 850 la derniere ligne de
                  texte s arrete 25,6px au-dessus du pli.

                  UN RELIQUAT QUI N EST PAS DU TEXTE, et qu il ne faut pas
                  chercher a corriger ici. Le bord BAS de `.hero-foot` tombe
                  toujours pile sur `100svh`, par construction : `.hero` est un
                  `min-height:100svh` en `flex-end` avec `padding-bottom:0`.
                  Or `svh` se calcule en pixels fractionnaires quand le zoom
                  (90 %) et le rapport de pixels (1,5) ne tombent pas juste —
                  850,37px releves pour un `innerHeight` de 850 — alors que
                  `innerHeight` est arrondi a l entier. D ou un « depassement »
                  de 0,37px qui ne bouge pas d un iota si l on raccourcit encore
                  le texte : ce sont deux unites de mesure differentes, pas une
                  ligne qui deborde. Le seul chiffre qui repond au texte est le
                  seuil ci-dessus. */}
              <p className="hero-sub">Le site refait en une semaine, et vous n&apos;avez rien à préparer.{entree ? ` Dès ${entree}, TVA comprise.` : ""}</p>
              <div className="hero-cta">
                {/* LE BOUTON PRINCIPAL NE QUITTE PLUS LE SITE.
                    Il ouvrait WhatsApp. Trois raisons de ne plus le faire :
                    sur ordinateur, wa.me renvoie vers WhatsApp Web, qui exige
                    un QR code — le visiteur assis a son bureau tombe sur un
                    ecran de scan ; il partait avant d avoir vu un prix, une
                    preuve ou un perimetre ; et le studio vend un site qui
                    recoit les demandes tout seul, pendant que le sien
                    renvoyait vers une messagerie humaine.
                    WhatsApp n est pas retire du site : il reste le premier
                    bouton du bloc contact, et les trois cartes de formule y
                    mènent toujours avec un message pre-rempli — la ou le
                    visiteur a choisi, donc la ou le canal chaud se justifie. */}
                <a className="btn" href="#contact">Faire refaire mon site <span className="ar">→</span></a>
                <a className="btn btn-line" href="/demonstrations">Voir les démonstrations</a>
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
              {/* UNE PHRASE DONT ON SAIT DE QUOI ELLE PARLE, et qui nomme enfin
                  tout ce que le studio fabrique. « Il pose les questions que
                  vous posez au telephone » ouvrait ce temps sur un « Il » SANS
                  ANTECEDENT : rien, ni ici ni au-dessus, n avait presente ce
                  « il ». Le kicker dit « Le noyau », le h1 est deux ecrans plus
                  haut, et le lecteur tombait donc sur un pronom qui ne renvoyait
                  a rien — il devait deviner qu on lui parlait d un formulaire.
                  CE QUE LE STUDIO VEND NE S ARRETE PAS AU SITE. La revendication
                  de categorie (.agents/product-marketing.md §3) est celle d un
                  studio de creation : « sites, cartes, affiches, identite,
                  photographie ». Le h1 l annonce des le premier ecran (« Site,
                  imprimes, photos, reseaux ») et plus rien ne le reprenait
                  ensuite. La nouvelle phrase enumere donc, puis referme sur le
                  pilier n°1 : le client dit oui, et il n a rien d autre a faire
                  — « chez les autres, le compteur part quand vous avez fourni
                  vos textes ; ici, quand vous dites oui » (§3).
                  LA LONGUEUR EST UNE CONTRAINTE DE DESSIN, PAS DE STYLE :
                  .noyau-say est capee a 30ch (app/noyau.css:151) et le corps
                  monte a 3.1rem. Une premiere version de 115 caracteres rendait
                  HUIT lignes dans une colonne de 269px — mesure a 1440x900 —
                  soit une colonne de confettis au lieu d une phrase. 83
                  caracteres tiennent en cinq lignes. Celle-ci en fait 75.
                  Compter avant de reecrire. */}
              <p>Le site, le logo, les cartes, les photos. Vous dites oui, <span className="serif-i">je fais le reste</span>.</p>
            </div>
          </div>
        </div>

        {/* ---------- temps 3 — la plongee ----------
            Le noyau remplit l'ecran : le texte passe en clair (.noyau-beat-3),
            et la nav s'inverse au meme moment via html.noyau-dark. */}
        <div className="noyau-beat noyau-beat-3" data-temps="">
          <div className="wrap">
            <span className="meta"><span className="index">(002)</span>&nbsp; Le cœur</span>
            {/* LE GRAND MOT DIT L ETENDUE DE L OFFRE, ET C EST UN CHOIX DE
                POSITIONNEMENT, PAS DE STYLE. Il a porte « 1 semaine », puis
                « Rien » — pour « rien a preparer ». Les deux parlaient du site
                seul, et « Rien » ouvrait en plus le temps 3 sur une negation :
                le lecteur lisait un manque avant de savoir de quoi.
                Or le studio ne vend pas que des sites. La revendication de
                categorie (.agents/product-marketing.md §3) couvre « sites,
                cartes, affiches, identite, photographie », et le pilier n°3 est
                « un interlocuteur, a Geneve, qui reste » — le prospect a deja
                ete abandonne une fois, son site actuel en est la preuve.
                « Tout », suivi de « d une seule main », dit les deux d un coup,
                et le tableau ci-dessous le detaille ligne par ligne.
                RIEN N EST PERDU DE CE QUI PART D ICI. Le delai reste dans le
                sous-titre du hero, dans la ligne « Le site » ci-dessous, dans
                la Methode et dans la FAQ ; le fait que le client n ait rien a
                preparer reste dans ce meme sous-titre et dans la ligne « Vos
                textes ». Aucun des deux n est plus l argument principal.
                « Tout » tient dans un emplacement dessine pour UN SEUL MOT
                COURT (.noyau-num, clamp(5rem,15vw,11rem)) : quatre glyphes
                comme « Rien » qu il remplace, la contrainte est donc tenue sans
                nouvelle mesure — a 390 px comme au large. */}
            <div className="noyau-spec">
              <p className="noyau-fig">
                <span className="noyau-num">Tout</span>
                {/* « D UNE SEULE MAIN » QUALIFIE LE MOT QUI EST AU-DESSUS, et
                    c est pour cela qu elle a change avec lui. Cette unite
                    disait « a preparer » : la formule du glossaire (entree 4)
                    au mot pres pour le benefice n°1, « vous n avez rien a
                    preparer », dont ce bloc etait l echo — et un echo qui
                    change de mot n en est plus un. Le grand mot ne dit plus ce
                    benefice mais l etendue de l offre ; garder « a preparer »
                    aurait qualifie un mot disparu et donne « Tout a preparer »,
                    soit l inverse exact de la promesse. L unite suit donc le
                    mot et nomme l interlocuteur unique (pilier n°3). Le
                    benefice n°1, lui, reste ecrit en toutes lettres dans le
                    sous-titre du hero et dans la ligne « Vos textes » du
                    tableau ci-dessous. */}
                <span className="noyau-unit">d&apos;une seule main</span>
              </p>
              <ul className="noyau-specs">
                <li><span className="k">Atelier</span><span className="v">Genève</span></li>
                <li><span className="k">Le site</span><span className="v">Livré en une semaine</span></li>
                <li><span className="k">Le reste</span><span className="v">Logo, cartes, affiches, photos</span></li>
                <li><span className="k">Vos textes</span><span className="v">Repris de votre site</span></li>
                {/* LE MONTANT EST PARTI, ET C EST LA REGLE QUI LE DIT.
                    Cette ligne affichait « Dès 49.–/mois » sans « TVA
                    comprise » — interdit par CLAUDE.md, et la mention vaut PAR
                    UNITE DE LECTURE : celle du sous-titre, deux ecrans plus
                    haut, ne couvre pas ce tableau. Le guide de voix §8 tranche
                    le cas de lui-meme : « en cas de doute, on retire le prix
                    plutot que la mention ».
                    Ce qui reste dit mieux la chose de toute facon : ce qui
                    compte a cet instant n est pas le montant, c est que rien
                    n est du la premiere annee. Le prix, lui, vit dans la grille
                    (05) avec sa mention. */}
                <li><span className="k">Suivi</span><span className="v">Dès la 2ᵉ année</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- temps 4 — la sortie ---------- */}
        <div className="noyau-beat noyau-beat-4" data-temps="">
          <div className="wrap">
            <div className="noyau-out">
              {/* « VOTRE », PAS « UN ». Un mot, et la phrase cesse d etre une
                  maxime sur les sites en general pour designer l actif que le
                  lecteur possede deja et qui ne travaille plus pour lui — ce
                  qui est le positionnement entier (.agents/product-marketing.md
                  §1). C est aussi le vouvoiement que le guide impose partout
                  ailleurs. Maintenant que cette ligne est la plus grande du
                  hero, elle ne peut pas parler de personne. */}
              <p>Votre site ne se regarde pas. Il travaille, ou il ne sert à rien.</p>
              {/* DEUX SORTIES, PARCE QUE C EST LE DERNIER ECRAN. Il n y avait
                  qu un bouton, vers #travaux — la meme ancre que le CTA
                  secondaire du temps 1. Or a cet endroit le visiteur a tout lu :
                  celui qui veut une preuve et celui qui veut un prix ne
                  demandent pas la meme chose, et le second n avait aucun chemin.
                  Les demonstrations sortent donc de l ancre pour devenir une
                  page (/demonstrations), et le devis en a une aussi (/devis).
                  Ces deux routes sont posees par un autre chantier du meme
                  plan : si elles rendent 404, c est ce chantier qui manque, pas
                  ces liens. Le CTA secondaire du temps 1 suit la premiere.
                  Meme libelle qu au temps 1, pour la meme raison qu avant : deux
                  mots differents pour un meme geste font croire a deux
                  contenus. « demonstration » est le terme du glossaire
                  (entree 14) — « avant / apres » decrivait le dispositif, pas
                  ce qu on va voir. */}
              <div className="noyau-out-cta">
                <a className="btn" href="/demonstrations">Voir les démonstrations <span className="ar">→</span></a>
                <a className="btn btn-line" href="/devis">Demander un devis</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
