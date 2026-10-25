import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";

/**
 * LA BANDE DES LIENS LEGAUX — Mentions legales · Confidentialite · CGV ·
 * Cookies (ce dernier vers /confidentialite#cookies, depuis le 25.10.2026 :
 * le meme jeu que la bande `.legal` de components/FooterContact.tsx).
 *
 * POURQUOI ELLE EXISTE (25 octobre 2026). Les trois liens vivaient dans la
 * bande `.legal` de components/FooterContact.tsx, que seules l accueil,
 * /services et /studio rendent. /contact, /devis, les pages legales et la 404
 * n en avaient aucun : un visiteur arrive sur la demande de demo sans pouvoir
 * lire qui l exploite ni ce que deviennent ses donnees. La LCD (art. 3 al. 1
 * let. s) veut ces informations accessibles, pas seulement presentes quelque
 * part.
 *
 * ELLE EST POSEE PAR LE LAYOUT PUBLIC, apres <main>, sur les pages SANS pied
 * complet. Le layout lit le chemin dans l en-tete `x-nawa-chemin` (proxy.ts)
 * et ne la rend pas sur `CHEMINS_AVEC_PIED` (lib/i18n.ts) : un seul jeu de
 * liens par page, dans le HTML comme a l ecran (25.10.2026 ; elle etait
 * auparavant rendue partout et masquee en CSS). La regle
 * `main:has(footer.contact) + .liens-legaux` (app/binacore.css) reste en
 * filet, pour une page a pied complet oubliee dans la liste.
 *
 * DES <a> NUS, pas des next/link : Interactions.tsx ne s initialise qu une
 * fois (decision B7).
 */
export default function LiensLegaux({ locale }: { locale: Locale }) {
  const t = dictionnaire(locale);
  return (
    <nav className="liens-legaux" aria-label={t.pied.liensLegaux}>
      <div className="wrap">
        <a className="lnk" href={lien(locale, "/mentions-legales")}>{t.pied.mentionsLegales}</a>
        <a className="lnk" href={lien(locale, "/confidentialite")}>{t.pied.confidentialite}</a>
        <a className="lnk" href={lien(locale, "/cgv")}>{t.pied.cgv}</a>
        <a className="lnk" href={`${lien(locale, "/confidentialite")}#cookies`}>{t.pied.cookies}</a>
      </div>
    </nav>
  );
}
