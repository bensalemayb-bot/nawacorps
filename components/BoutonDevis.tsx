import { lien, type Locale } from "@/lib/i18n";

/**
 * CTA de devis — un LIEN, et plus une interception de clic.
 *
 * CE QU IL FAISAIT. Un `<a href>` vers WhatsApp dont le clic etait annule
 * (`e.preventDefault()`) pour ouvrir la bulle de chat, en lui passant un
 * `sujet` que ChatWidget ne lisait pas. Deux defauts, et le second etait le
 * plus cher :
 *  - SANS JAVASCRIPT, LE BOUTON QUITTAIT LE SITE. Le repli n en etait pas un :
 *    il envoyait le visiteur sur WhatsApp, c est-a-dire hors du site et dans
 *    une application que tout le monde n a pas installee.
 *  - LE SUJET SE PERDAIT. Huit boutons emettaient chacun le leur, aucun n etait
 *    lu, et la demande arrivait chez Ayoub sans dire sur quoi elle portait.
 *
 * CE QU IL FAIT. Il pointe sur `/devis?p=<sujet>`, une vraie page. Le benefice
 * n est pas cosmetique : LE BOUTON FONCTIONNE MAINTENANT SANS JAVASCRIPT, ce
 * qui n etait pas le cas — la page d arrivee rend le formulaire cote serveur,
 * avec le sujet en champ cache. Avec JavaScript, elle ouvre en plus l assistant
 * deja renseigne du nom de la prestation, lu en base.
 *
 * IL N EST PLUS UN COMPOSANT CLIENT. Il n a plus d etat ni de gestionnaire :
 * c est un `<a>`, rendu sur le serveur comme le reste de la page. Un composant
 * client de moins, c est du JavaScript de moins a telecharger et a hydrater.
 *
 * LE `href` A DISPARU DES PROPS. Il portait l amorce WhatsApp de chaque
 * appelant ; ces amorces vivent desormais dans lib/devis.ts, ou la page /devis
 * les ressert en repli. Aucune n a ete perdue, aucune n a ete dupliquee.
 *
 * `encodeURIComponent` sur le sujet : nos sujets sont des slugs sans caractere
 * a echapper, mais rien ici ne garantit que le prochain le sera.
 */
/**
 * `locale` : le chemin etait ecrit EN DUR (« /devis »), donc un bouton pose sur
 * une page anglaise renvoyait le visiteur au parcours francais — au moment
 * precis ou il decide d acheter. Le defaut n apparaissait qu une fois la
 * version anglaise en place ; il est corrige ici plutot que contourne par un
 * <a> recopie dans chaque page.
 * Defaut « fr » : les huit appels ecrits avant le chantier anglais sont
 * inchanges, et rendent le meme balisage a l octet.
 */
export default function BoutonDevis({
  sujet,
  className = "lnk",
  locale = "fr",
  children,
}: {
  sujet: string;
  className?: string;
  locale?: Locale;
  children: React.ReactNode;
}) {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <a className={className} href={lien(locale, `/devis?p=${encodeURIComponent(sujet)}`)}>
      {children}
    </a>
  );
}
