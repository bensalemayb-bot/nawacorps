import SelecteurLangue from "@/components/SelecteurLangue";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";
import { CONTACT, whatsappHref } from "@/lib/site";

// Menu plein ecran — reference/binacore.html lignes 707-720.
// Ouverture/fermeture pilotees par Interactions.tsx (classe html.menu-open).
//
// ADAPTATION B7 : ancres prefixees `/`, meme raison que Nav.tsx. Consequence
// obligatoire : le selecteur closeMenu d Interactions.tsx passe de
// `[href^="#"]` a `[href*="#"]`, sinon le menu ne se refermerait plus.
//
// CINQ ENTREES, LES MEMES QUE LA BARRE DE NAV (voir components/Nav.tsx) :
// « L offre » (la section (05) de l accueil), les metiers (/metiers), les
// demonstrations (/demonstrations), le studio, le contact.
// L ENTREE (06) « Voir la démo sur mon métier » (/devis) EST RETIREE, a la
// demande d Ayoub du 25.10.2026 : sur telephone, la demande de demo passe
// par le bouton du chat, fixe en bas de TOUTES les pages (ChatWidget), qui
// ouvre Leo directement — plus court qu un formulaire.
// « L offre » pointe sur `/#offres` : depuis une autre page, le document est
// remplace et html.menu-open part avec lui ; sur l accueil, le selecteur
// `.menu a[href*="#"]` de closeMenu (Interactions.tsx) referme le menu.
//
// LA NUMEROTATION EST CELLE DU MENU, pas celle des sections de l accueil, et
// les deux divergent volontairement. Le menu compte SES entrees dans SON ordre.
// L accueil, lui, numerote ses sections dans l ordre ou elles defilent.
//
// L ECHELONNEMENT NE SE COMPTE PLUS EN `nth-child`. Il vit dans `--i`, pose
// ici sur chaque entree : la sous-liste s intercale entre deux `.m-lnk`, et une
// cascade indexee sur le rang DOM aurait saute un cran a chaque insertion.
//
// IL EST BILINGUE COMME LA BARRE, ET PAR LE MEME MECANISME : `locale` a « fr »
// pour defaut, les libelles viennent du dictionnaire et les chemins passent par
// `lien`.
export default function MenuOverlay({ locale = "fr" }: { locale?: Locale }) {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  const t = dictionnaire(locale);
  return (
    <div className="menu" id="menu" aria-hidden="true">
      <nav>
        <a className="m-lnk" style={{ "--i": 0 } as React.CSSProperties} href={lien(locale, "/#offres")}><span className="mi">(01)</span><span className="mt">{t.menu.services}</span></a>
        <a className="m-lnk" style={{ "--i": 1 } as React.CSSProperties} href={lien(locale, "/metiers")}><span className="mi">(02)</span><span className="mt">{t.menu.metiers}</span></a>
        <a className="m-lnk" style={{ "--i": 2 } as React.CSSProperties} href={lien(locale, "/demonstrations")}><span className="mi">(03)</span><span className="mt">{t.menu.demonstrations}</span></a>
        <a className="m-lnk" style={{ "--i": 3 } as React.CSSProperties} href={lien(locale, "/studio")}><span className="mi">(04)</span><span className="mt">{t.menu.studio}</span></a>
        <a className="m-lnk" style={{ "--i": 4 } as React.CSSProperties} href={lien(locale, "/contact")}><span className="mi">(05)</span><span className="mt">{t.menu.contact}</span></a>
      </nav>
      {/* LE BAS DU MENU NE PASSE PAS PAR `lien`, et il ne le doit pas : WhatsApp
          et l e-mail sont des URL EXTERNES. `lien` les laisserait d ailleurs
          intactes — elle reconnait les schemas d URI —, mais l ecrire ici
          laisserait croire qu il y a une version anglaise de ces adresses. Il
          n y en a pas : c est le meme numero et la meme boite. */}
      <div className="m-foot">
        <a href={whatsappHref(locale)} target="_blank" rel="noopener">{t.menu.whatsapp}</a>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <span>{t.menu.lieu}</span>
        {/* LE SELECTEUR MOBILE. C est ici qu il compte : la barre de nav cache
            ses entrees sous 860px, et le menu plein ecran est le seul endroit
            ou un visiteur sur telephone peut changer de langue. Contrairement a
            la barre, il rend ICI sa propre enveloppe — `.m-foot` repartit ses
            enfants en `space-between`, et sans elle les deux codes seraient
            partis chacun de son cote. Il ne rend rien du tout tant que la page
            n existe pas dans l autre langue, enveloppe comprise : un element
            vide fausserait cette repartition. */}
        <SelecteurLangue locale={locale} contexte="menu" />
      </div>
    </div>
  );
}
