"use client";

import { usePathname } from "next/navigation";
import { dictionnaire } from "@/lib/dictionnaires";
import {
  LANGUE_HTML,
  LOCALES,
  cheminSansLocale,
  estTraduit,
  lien,
  type Locale,
} from "@/lib/i18n";

/**
 * LE SELECTEUR DE LANGUE — deux codes courts, celui de la page marque.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * POURQUOI UN COMPOSANT CLIENT ET `usePathname()`, ET NON L EN-TETE DU PROXY
 * ────────────────────────────────────────────────────────────────────────────
 * Le choix etait entre les deux, et il n en restait qu un une fois regarde de
 * pres.
 *
 * `Nav` et `MenuOverlay` sont rendus par `app/(site)/layout.tsx`, et un layout
 * ne recoit PAS le chemin de la page : ni en prop, ni par une API serveur. Le
 * seul canal serveur disponible est l en-tete pose par `proxy.ts` — or `proxy.ts`
 * ne pose QUE `x-nawa-locale`, la langue, jamais le chemin. Passer par lui
 * aurait donc voulu dire lui ajouter un second en-tete, c est-a-dire modifier
 * un fichier qui est explicitement hors de ce chantier et sur lequel travaille
 * quelqu un d autre. (Next expose bien des en-tetes internes qui contiennent
 * l URL — `next-url` et consorts — mais ils ne sont pas documentes, et batir un
 * sélecteur de langue sur un detail d implementation du framework est
 * exactement le genre de dette qui se paie a la montee de version suivante.)
 *
 * Reste `usePathname()`, qui est l API PUBLIQUE prevue pour ca. Elle impose un
 * composant client, et le cout est reel mais minuscule : deux ancres, aucun
 * etat, aucun effet, aucun ecouteur.
 *
 * ELLE NE CASSE RIEN DU MODELE DE NAVIGATION DU SITE. Ce sont des `<a>` nus,
 * pas des `next/link` — decision B7 : une navigation client-side ne rejouerait
 * pas `Interactions.tsx`, et les `[data-reveal]` de la page d arrivee
 * resteraient a `opacity:0`. Changer de langue recharge donc le document, ce
 * qui est de toute facon ce qu on veut : la page cible n est pas la meme page.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * IL NE S AFFICHE QUE SI LA PAGE EXISTE VRAIMENT DANS L AUTRE LANGUE
 * ────────────────────────────────────────────────────────────────────────────
 * `estTraduit` interroge `CHEMINS_TRADUITS` (lib/i18n.ts), la liste blanche que
 * les agents de traduction allongent page par page. Un selecteur qui envoie sur
 * un 404 est pire que pas de selecteur du tout : le visiteur qui clique une
 * fois dans le vide ne reclique jamais, et le robot qui suit le lien compte un
 * lien mort de plus.
 *
 * Aujourd hui la liste ne contient que « / » : le couple n apparait donc que
 * sur l accueil, dans les deux langues, et NULLE PART AILLEURS. Les quinze
 * autres pages du site rendent exactement le HTML qu elles rendaient avant ce
 * chantier.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * DEUX CONTEXTES, DEUX ENVELOPPES — ET LA RAISON EST DANS LE CSS
 * ────────────────────────────────────────────────────────────────────────────
 *  - « barre » ne rend AUCUNE enveloppe : les deux ancres deviennent des
 *    enfants directs de `.nav-r`. C est ce qui leur donne gratuitement le
 *    dessin des autres entrees (`.nav-r a:not(.pill)`), leur disparition sous
 *    860px (`.nav-r a:not(.pill){display:none}`) et leur effacement quand le
 *    menu plein ecran s ouvre (`html.menu-open .nav-r a{opacity:0}`).
 *    UNE ENVELOPPE AURAIT ETE UN BUG VISIBLE : `.nav-r` espace ses enfants de
 *    2em, et un `<span>` vide — ses deux ancres passees en `display:none` —
 *    reste un enfant de la flexbox. Il aurait garde son ecart et pousse le
 *    burger de 32px vers la gauche sur tous les telephones.
 *  - « menu » rend un `<span>` en `inline-flex` : `.m-foot` est en
 *    `justify-content:space-between`, et sans enveloppe les deux codes se
 *    seraient disperses aux deux bouts de la bande comme deux entrees sans
 *    rapport. L enveloppe fait du couple UN element, et elle n existe que
 *    lorsque le selecteur existe — un `<span>` vide y fausserait la
 *    repartition des trois autres.
 *
 * ZERO CSS NOUVEAU, comme `components/ContactForm.tsx` avant lui : le studio
 * tient `app/binacore.css` pour la maquette de reference, et une regle ajoutee
 * pour deux ancres ne vaut pas d y toucher.
 *
 * LA MARQUE DE LA LANGUE ACTIVE PASSE PAR `font-weight` ET NON PAR `opacity`.
 * Ce n est pas un gout : `html.menu-open .nav-r a{opacity:0}` efface les
 * entrees de la barre quand le menu s ouvre, et un `style={{opacity:…}}` en
 * ligne — plus specifique que n importe quelle regle de feuille — aurait
 * empeche cet effacement. Le code de langue serait reste seul, lisible en
 * travers du menu plein ecran.
 */

/**
 * LE LIBELLE DE CHAQUE LANGUE, DANS SA PROPRE LANGUE — et c est pourquoi il
 * n est PAS dans le dictionnaire.
 *
 * « Français » s ecrit « Français » sur la page anglaise, et « English »
 * s ecrit « English » sur la page francaise : c est la convention des
 * selecteurs de langue, et elle est la seule utilisable — un visiteur qui ne
 * lit pas la langue courante doit pouvoir reconnaitre la sienne. Ces deux
 * chaines ne varient donc jamais avec la locale, et les mettre dans `fr.ts` et
 * `en.ts` aurait produit deux fois la meme valeur en donnant a croire qu il y
 * a la une traduction a faire.
 *
 * Le CODE (« FR », « EN ») est ce qui s affiche : la barre n a pas la largeur
 * d un nom complet, et le nom complet part en `aria-label`, ou il est lu en
 * entier par les lecteurs d ecran.
 */
const LIBELLES: Record<Locale, { code: string; nom: string }> = {
  fr: { code: "FR", nom: "Français" },
  en: { code: "EN", nom: "English" },
};

export default function SelecteurLangue({
  locale,
  contexte,
}: {
  /** La langue de la page courante — celle qui sera marquee. */
  locale: Locale;
  /** Ou il est rendu ; voir l en-tete, la difference n est pas cosmetique. */
  contexte: "barre" | "menu";
}) {
  const chemin = usePathname();

  /**
   * LE CHEMIN EST RAMENE A SA FORME FRANCAISE AVANT TOUT. `cheminSansLocale`
   * retire le prefixe courant, `lien` reapplique celui de la cible : sans ce
   * retrait, le selecteur empilerait les prefixes depuis une page deja
   * anglaise (`/en` -> `/en/en`). Le repli sur « / » ne sert qu au cas ou
   * `usePathname` rend null hors du routeur ; il n arrive pas ici.
   */
  const cheminNu = cheminSansLocale(chemin ?? "/");

  // La page n a pas de jumelle : on ne propose rien plutot que d envoyer sur
  // un 404. Voir l en-tete — c est la regle, pas une precaution.
  if (!estTraduit(cheminNu)) return null;

  const t = dictionnaire(locale);

  const ancres = LOCALES.map((cible) => {
    const actif = cible === locale;
    const { code, nom } = LIBELLES[cible];
    return (
      <a
        key={cible}
        /* La langue active pointe sur la page ou l on est deja : c est un lien
           vers soi-meme, signale par `aria-current`, et il ne porte donc pas
           `.lnk` — le souligne au survol promettrait un deplacement qui n aura
           pas lieu. */
        className={actif ? undefined : "lnk"}
        href={lien(cible, cheminNu)}
        /* `hreflang` ET `lang` portent le code COMPLET, region comprise, le
           meme que celui que la page cible declare dans son `<html lang>` et
           que celui des `hreflang` de `alternatesPage`. Trois declarations de
           langue pour une meme page doivent dire la meme chose. */
        hrefLang={LANGUE_HTML[cible]}
        lang={LANGUE_HTML[cible]}
        /* « FR » se lit « éf-air » ; le nom complet, dans sa propre langue,
           est ce qu un lecteur d ecran doit annoncer. */
        aria-label={nom}
        aria-current={actif ? "page" : undefined}
        style={actif ? { fontWeight: 600 } : undefined}
      >
        {code}
      </a>
    );
  });

  if (contexte === "barre") return <>{ancres}</>;

  return (
    <span
      role="group"
      aria-label={t.langue.section}
      style={{ display: "inline-flex", gap: ".9em" }}
    >
      {ancres}
    </span>
  );
}
