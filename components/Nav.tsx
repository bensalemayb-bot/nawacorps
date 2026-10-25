import Image from "next/image";
import SelecteurLangue from "@/components/SelecteurLangue";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";

// Barre de navigation — reference/binacore.html lignes 695-705.
// Composant serveur : les ecouteurs (#nav, #burger, #clock) sont poses par
// Interactions.tsx, exactement comme le <script> de la maquette.
//
// ADAPTATION B7 : les ancres sont prefixees `/`. Cette nav vit dans le layout,
// donc sur les 3 routes, alors que id="top" et les sections cibles n existent
// que sur /. Sans le prefixe, les 5 liens seraient morts sur les pages
// legales. Sur / le comportement est inchange : meme document, donc ancre
// interne sans rechargement.
//
// BR — LE WORDMARK TEXTE DEVIENT UNE IMAGE, ET CELA CASSE UN MECANISME.
// binacore.css ligne 414 pose `html.menu-open .wordmark{color:var(--bone)}` :
// quand le menu plein ecran s ouvre, le fond passe au pin et le wordmark
// s eclaircit pour rester lisible. Une image n obeit pas a `color`.
//
// UNE SEULE IMAGE, ECLAIRCIE PAR FILTRE au menu ouvert (bloc BR en fin de
// binacore.css). Deux fichiers auraient impose un saut de largeur a chaque
// ouverture : le logo principal fait un ratio de 7.04, la variante fond-fonce
// 3.04, soit 211px contre 91px a hauteur egale. La nav aurait tressailli a
// chaque clic sur le burger. Meme image, meme ratio, aucun decalage.
//
// LE VERROUILLAGE ICONE + NOM est celui de la marque elle-meme : le logo
// horizontal officiel place le N cercle a gauche du wordmark. On le reproduit
// en DEUX fichiers plutot qu en reprenant l horizontal tel quel, parce que
// celui-ci embarque aussi le slogan — qui a cette hauteur tombe a ~4px et ne
// se lit plus, une bavure grise sous le nom. En composant, chaque element
// garde sa taille propre et reste net. Le slogan a sa place ailleurs, en pied
// de page. Voir livraison-br.txt.
//
// L icone porte alt="" : elle ne dit rien que le wordmark ne dise deja, et un
// lecteur d ecran annoncerait deux fois la meme marque. C est le nom qui porte
// le texte alternatif.
//
// CINQ ENTREES ET UNE PASTILLE. Depuis le 24 octobre 2026, le site ne vend
// plus qu une chose, l assistant : « L offre » mene a la section (05) de
// l accueil, ou se lisent le parcours et le prix ; le deroulant des anciennes
// familles est parti avec elles. « Métiers » (le hub /metiers) s est ajoute
// le 25 octobre 2026, quand le site s est ouvert a tous les metiers, puis
// « Démonstrations » le meme jour : la page des exemples d automatisation par
// metier (/demonstrations), qui avait quitte la nav avec l ancienne offre et y
// revient avec la nouvelle. Elle suit « Métiers » : on lit son metier, puis
// on voit comment l assistant le traite.
//
// LA BARRE EST BILINGUE : les libelles viennent du dictionnaire
// (lib/dictionnaires/), les chemins passent tous par `lien`, qui rend le chemin
// francais tel quel et prefixe `/en` en anglais.
export default function Nav({ locale = "fr" }: { locale?: Locale }) {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7

  const t = dictionnaire(locale);

  // L HORLOGE EST CALCULEE AU RENDU, PAS ECRITE EN DUR. « Genève — 00:00 »
  // etait une chaine fixe : servie telle quelle a n importe quelle heure, et
  // corrigee seulement quand Interactions.tsx demarre son intervalle — donc
  // minuit au premier rendu, et minuit definitif si ce script echoue. MEME
  // FORMAT que ce script (components/Interactions.tsx, fonction `tick`) :
  // `fr-CH`, `Europe/Zurich`, heure et minute sur 2 chiffres. Le premier tick
  // cote client ne fait ainsi que rafraichir une valeur deja juste, jamais la
  // corriger.
  //
  // LE FORMAT RESTE `fr-CH` EN ANGLAIS AUSSI, ET CE N EST PAS UN OUBLI. Seul le
  // NOM DE LA VILLE se traduit (« Geneva ») ; l heure garde son horloge de 24 h
  // a deux chiffres. Deux raisons, et la seconde suffirait : c est la
  // convention suisse, que lisent aussi les anglophones de Geneve ; et
  // components/Interactions.tsx rafraichit ce span toutes les minutes avec un
  // `Intl.DateTimeFormat("fr-CH")` ecrit en dur de son cote. Formater le rendu
  // serveur autrement ferait sauter l affichage d un format a l autre a la
  // premiere minute ecoulee.
  const heureGeneve = new Intl.DateTimeFormat("fr-CH", {
    timeZone: "Europe/Zurich",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return (
    <nav className="nav" id="nav">
      <a className="wordmark" href={lien(locale, "/#top")} aria-label={t.nav.accueil}>
        <Image
          className="wm-icone"
          src="/brand/nawa-corps-logo-iconique-transparent.png"
          alt=""
          width={230}
          height={230}
          priority
        />
        <Image
          className="wm-nom"
          src="/brand/nawa-corps-logo-principal-transparent.png"
          alt={t.nav.logoAlt}
          width={634}
          height={90}
          priority
        />
      </a>
      {/* suppressHydrationWarning sur ce seul span : Nav est un composant
          serveur (pas de "use client" dans ce fichier), donc rien ne le
          reexecute cote client — mais l heure qu il affiche continue d avancer
          entre l instant du rendu et l hydratation, une difference legitime
          qu il ne faut pas signaler comme un bug plutot que de faire de tout
          le composant un client component pour une seule horloge. */}
      <span className="nav-time" id="clock" suppressHydrationWarning>{`${t.nav.horlogeVille} — ${heureGeneve}`}</span>
      <div className="nav-r">
        <a className="lnk" href={lien(locale, "/#offres")}>{t.nav.services}</a>
        <a className="lnk" href={lien(locale, "/metiers")}>{t.nav.metiers}</a>
        <a className="lnk" href={lien(locale, "/demonstrations")}>{t.nav.demonstrations}</a>
        <a className="lnk" href={lien(locale, "/studio")}>{t.nav.studio}</a>
        <a className="lnk" href={lien(locale, "/contact")}>{t.nav.contact}</a>
        {/* LE SELECTEUR DE LANGUE, entre la derniere entree et la pastille.
            Il ne rend RIEN tant que la page courante n existe pas dans l autre
            langue. Il ne rend pas non plus
            d enveloppe : ses deux ancres sont des enfants directs de `.nav-r`,
            ce qui leur donne le dessin des entrees voisines et, surtout, les
            fait disparaitre proprement sous 860px. Le detail est explique dans
            components/SelecteurLangue.tsx — un `<span>` autour aurait pousse le
            burger de 32px sur telephone. */}
        <SelecteurLangue locale={locale} contexte="barre" />
        {/* LA PASTILLE MENE A LA DEMANDE DE DEMO (/devis), visible en
            permanence depuis toutes les pages, sans recharger l accueil. */}
        <a className="pill" href={lien(locale, "/devis")}>{t.nav.devis}</a>
        <button className="burger" id="burger" aria-label={t.nav.ouvrirMenu} aria-expanded="false"><i></i><i></i></button>
      </div>
    </nav>
  );
}
