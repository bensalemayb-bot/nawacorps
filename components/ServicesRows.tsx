/* LA DECISION B7 TIENT TOUJOURS — des <a> classiques, jamais next/link : la
   navigation client ne rejoue pas les revelations au scroll d'Interactions.tsx,
   qui ne s'initialisent qu'une fois.
   CE QUI A DISPARU, C'EST LE `eslint-disable` QUI L'ACCOMPAGNAIT, et il ne faut
   pas le remettre : `@next/next/no-html-link-for-pages` ne reconnait que les
   `href` litteraux, et les six renvois de ce fichier passent desormais par
   `lien(locale, …)`. La directive est devenue inutile, et une directive inutile
   est elle-meme signalee par ESLint. Si un `href` litteral revient un jour, la
   regle se remettra a parler — c'est exactement ce qu'on veut d'elle. */
import type { CSSProperties } from "react";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";

// Section Services — reference/binacore.html lignes 940-973 pour la structure.
//
// Les six lignes sont STATIQUES et le restent : ce sont des categories
// editoriales du studio, pas les enregistrements de la table Service. Rien
// ici ne vient de la base, et aucun montant n'y est ecrit — les prix vivent en
// base et s'affichent dans Offres et la carte du studio. Le TEXTE, lui, vit
// desormais dans lib/dictionnaires : six titres, six corps, six renvois, dans
// les deux langues.
//
// POURQUOI ELLES ONT ETE REECRITES. Le repositionnement PME avait resserre les
// six gestes sur les seules FONCTIONS D'UN SITE — recevoir, chiffrer, prendre
// rendez-vous, repondre. Le site est bien le produit d'entree, et il reste en
// tete de liste ; mais le studio vend aussi de l'identite, des imprimes, des
// photos, la production des reseaux sociaux et une ligne restauration — la
// fiche Google figurait dans cette liste jusqu'au 31 aout 2026, date a laquelle
// elle est sortie de l'offre. Une section de services qui n'en montre rien
// laisse croire que
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
// LE GESTE 05 A PERDU SA PREMIERE MOITIE. Il s'intitulait « Fiche Google et
// reseaux sociaux » et vendait les deux ; la fiche Google est sortie de l'offre
// le 31 aout 2026, et le mot Google ne designe plus une prestation nulle part
// sur le site. Le geste ne garde donc que les reseaux sociaux — ce vers quoi
// son renvoi pointait deja (/services/reseaux-sociaux). Le titre et le corps
// vivent dans lib/dictionnaires, ou le changement est documente.
//
// LE PARTENAIRE DE PRODUCTION EST NOMME au geste 05, et il doit le rester :
// « vous ne touchez a rien » laissait entendre que tout se fait ici. La
// production des reseaux sociaux se fait AVEC un partenaire (positionnement
// §7), lib/familles.ts l'ecrit, et la contradiction se lisait a un clic. La
// version anglaise le dit aussi, au meme endroit du meme paragraphe.
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
// qui ne s'initialisent qu'une fois. Leur `href` passe par `lien(locale, …)`,
// qui laisse le chemin francais intact et prefixe `/en` en anglais.
//
// LES SLUGS D'URL NE SE TRADUISENT PAS. `/services/le-site` devient
// `/en/services/le-site` : ce sont des identifiants de route, et les traduire
// casserait les dix-sept ancres que lib/catalogue-familles.ts pointe.
//
// LE BOUTON EST DANS LE <h3>, ET NON L'INVERSE. Les six .row-h portaient un
// « + », changeaient le curseur et ouvraient un panneau : ils ressemblaient a
// des boutons sans en etre, donc hors de l'ordre de tabulation et morts au
// clavier. Une premiere passe avait fait de `.row-h` LUI-MEME un <button>, ce
// qui reglait le clavier mais mettait le <h3> DANS le bouton : modele de
// contenu invalide, et surtout ARIA rend les descendants d'un bouton
// presentationnels — les six titres sortaient du plan de titres d'un lecteur
// d'ecran, qui n'avait plus aucun moyen de parcourir la section.
//
// LA FORME EST DESORMAIS <h3><button>titre</button></h3>, et elle n'a rien
// coute a la mise en page. La grille `.row-h` n'a PAS eu a etre redecoupee,
// contrairement a ce que cette note annoncait : elle redevient un <div> a trois
// colonnes — le rang, le titre, le « + » — exactement comme avant le passage au
// bouton. Seul le TEXTE du titre est devenu le bouton, a l'interieur du <h3>
// qui reste le deuxieme element de la grille. Les styles natifs du bouton sont
// neutralises par `.row h3 .row-t` dans app/binacore.css, pas ici : le bouton
// est maintenant une feuille sans regle concurrente, et un style en ligne n'y
// a plus de raison d'etre.
//
// CE QUE LA SOURIS ET LE CLAVIER FONT, ET POURQUOI C'EST DIFFERENT. Le clic
// reste attache a `.row-h` par Interactions.tsx : toute la ligne repond donc
// toujours a la souris, jusqu'au « + ». Le clavier, lui, atteint le bouton du
// titre, et Entree comme Espace y declenchent un click qui remonte a `.row-h`.
// Les deux chemins passent par le meme ecouteur.
//
// aria-expanded EST DESORMAIS TENU A JOUR. Il l'est par Interactions.tsx, qui
// recopie la classe `open` de `.row` dans l'attribut a chaque clic. La valeur
// ecrite ici n'est plus qu'un ETAT INITIAL — les six lignes naissent repliees —
// et non plus un mensonge permanent. Le contenu, lui, reste lisible d'un
// lecteur d'ecran en toutes circonstances : `.row-b` n'est jamais
// `display:none`, il est reduit a une hauteur nulle.
//
// Le depliage est pilote par Interactions.tsx, qui attache un click sur
// `.row-h` de chaque `[data-row]` — code deja en place depuis B4.

/** Le renvoi herite sinon du gris de `.row-b p` et se confond avec le texte.
 *  Meme correction que `.pf-hors .lnk` dans app/services.css. */
const STYLE_RENVOI: CSSProperties = { color: "var(--ink)" };

export default function ServicesRows({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);

  /**
   * Les six gestes, ecrits une fois.
   *
   * Le rang (« 01 »…) est un CHIFFRE : il ne passe pas par le dictionnaire, il
   * ne se traduit pas. Le `chemin` est la forme FRANCAISE, sans prefixe de
   * langue — c'est ce que `lien()` attend, et c'est elle qui decide de poser
   * `/en` ou non.
   */
  const gestes = [
    // CINQ GESTES, ET NON SIX. « Prise de rendez-vous et devis en ligne » et
    // « L'assistant qui repond et relance » etaient deux lignes ; le proprietaire
    // a tranche le 31 aout 2026 : c'est UNE SEULE CHOSE, l'integration d'un bot
    // qui prend la demande a sa place. Les deux corps ont fusionne dans le 02, et
    // le compte annonce par le titre de section a suivi.
    // Le 02 pointe sur /services et non sur une formule : le formulaire qui
    // chiffre commence avec Le Site, l'assistant qui repond avec L'Assistant —
    // renvoyer vers une seule des deux promettrait au mauvais palier.
    { n: "01", titre: t.services.titre01, corps: t.services.corps01, renvoi: t.services.lien01, chemin: "/services" },
    { n: "02", titre: t.services.titre02, corps: t.services.corps02, renvoi: t.services.lien02, chemin: "/services" },
    { n: "03", titre: t.services.titre03, corps: t.services.corps03, renvoi: t.services.lien03, chemin: "/services/identite" },
    { n: "04", titre: t.services.titre04, corps: t.services.corps04, renvoi: t.services.lien04, chemin: "/services/reseaux-sociaux" },
    { n: "05", titre: t.services.titre05, corps: t.services.corps05, renvoi: t.services.lien05, chemin: "/services/restauration" },
  ];

  return (
    <section id="services" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(02)</span>{`\u00A0 ${t.services.section}`}</span>
          {/* « un seul interlocuteur » a disparu du titre : la formule
              appartient deja a un acteur du panel de veille, et le guide de
              voix l'interdit nommement. « La meme main » dit la meme chose —
              une personne, du site a la carte de visite — sans reprendre le
              vocabulaire de quelqu'un d'autre. L'anglais suit la meme regle :
              `single point of contact` est interdit par le glossaire §4. */}
          <div data-reveal><h2 className="t">{t.services.titreLigne1}<br />{t.services.titreLigne2}</h2></div>
        </div>
        <div className="rows" data-reveal>
          {gestes.map((geste) => (
            <div className="row" data-row key={geste.n}>
              <div className="row-h"><span className="n">{geste.n}</span><h3><button type="button" className="row-t" aria-expanded="false">{geste.titre}</button></h3><span className="pl">+</span></div>
              <div className="row-b"><div><p>{geste.corps}</p><p><a className="lnk" style={STYLE_RENVOI} href={lien(locale, geste.chemin)}>{geste.renvoi}</a></p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
