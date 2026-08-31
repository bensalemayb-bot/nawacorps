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
// L'EN-TETE EST UN <button>, PAS UN <div>. Les six .row-h portaient un « + »,
// changeaient le curseur et ouvraient un panneau : ils ressemblaient a des
// boutons sans en etre. Consequence, ils etaient hors de l'ordre de tabulation
// et morts au clavier. Le passage a <button type="button"> les y remet sans
// toucher a Interactions.tsx : le selecteur qui attache le clic reste `.row-h`,
// la classe ne bouge pas, et Entree comme Espace declenchent nativement le
// meme evenement click. Les styles natifs du bouton sont neutralises par
// STYLE_ENTETE ci-dessous — surtout `font`, que le bouton n'herite PAS.
//
// LE PRIX DE CE CHOIX EST CONNU : le <h3> se retrouve DANS le bouton. Le
// modele de contenu de <button> n'admet que du contenu de phrase, et ARIA rend
// les descendants d'un bouton presentationnels — les six titres restent dans le
// DOM et lisibles par un moteur, mais ils sortent du plan de titres d'un
// lecteur d'ecran. Le marche est assume : l'accordeon etait jusqu'ici TOTALEMENT
// inoperable au clavier, et son contenu reste expose de toute facon (`.row-b`
// n'est jamais `display:none`). La forme sans compromis — <h3><button>titre
// </button></h3> — reclame de redecouper la grille `.row-h` en trois colonnes
// dans app/binacore.css, hors du perimetre de ce chantier.
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
 *  que `.row-h` ne couvre pas. `font` est le plus important — la police d'un
 *  bouton n'est PAS heritee, et `.pl` n'en declare aucune : sans cette ligne le
 *  « + » repassait en Arial.
 *
 *  DEUX PROPRIETES SONT VOLONTAIREMENT ABSENTES, et doivent le rester : un
 *  style en ligne l'emporte sur toute regle de feuille, il ne peut donc porter
 *  que ce que le CSS ne dispute pas.
 *   - `padding` : pose par `.row-h`, anime par `.row:hover .row-h` — le figer
 *     supprimerait le decalage au survol ;
 *   - `cursor` : `html.cursor-on .row-h` le met a `none` pour laisser passer le
 *     curseur maison ; le forcer a `pointer` ferait apparaitre DEUX curseurs.
 *     La valeur utile vient de `.row{cursor:pointer}`, dont le bouton herite. */
const STYLE_ENTETE: CSSProperties = {
  appearance: "none",
  background: "transparent",
  border: 0,
  borderRadius: 0,
  width: "100%",
  textAlign: "left",
  font: "inherit",
  color: "inherit",
};

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
    { n: "01", titre: t.services.titre01, corps: t.services.corps01, renvoi: t.services.lien01, chemin: "/services" },
    { n: "02", titre: t.services.titre02, corps: t.services.corps02, renvoi: t.services.lien02, chemin: "/services/le-site" },
    { n: "03", titre: t.services.titre03, corps: t.services.corps03, renvoi: t.services.lien03, chemin: "/services/l-assistant" },
    { n: "04", titre: t.services.titre04, corps: t.services.corps04, renvoi: t.services.lien04, chemin: "/services/identite" },
    { n: "05", titre: t.services.titre05, corps: t.services.corps05, renvoi: t.services.lien05, chemin: "/services/reseaux-sociaux" },
    { n: "06", titre: t.services.titre06, corps: t.services.corps06, renvoi: t.services.lien06, chemin: "/services/restauration" },
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
              <button type="button" className="row-h" style={STYLE_ENTETE} aria-expanded="false"><span className="n">{geste.n}</span><h3>{geste.titre}</h3><span className="pl">+</span></button>
              <div className="row-b"><div><p>{geste.corps}</p><p><a className="lnk" style={STYLE_RENVOI} href={lien(locale, geste.chemin)}>{geste.renvoi}</a></p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
