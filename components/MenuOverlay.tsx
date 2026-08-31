import SelecteurLangue from "@/components/SelecteurLangue";
import { ENTREES_FAMILLES, HREF_SERVICES } from "@/lib/catalogue-familles";
import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";
import { CONTACT, whatsapp } from "@/lib/site";

// Menu plein ecran — reference/binacore.html lignes 707-720.
// Ouverture/fermeture pilotees par Interactions.tsx (classe html.menu-open).
//
// ADAPTATION B7 : ancres prefixees `/`, meme raison que Nav.tsx. Consequence
// obligatoire : le selecteur closeMenu d Interactions.tsx passe de
// `[href^="#"]` a `[href*="#"]`, sinon le menu ne se refermerait plus.
//
// IL NE RESTE PLUS AUCUN LIEN AVEC UN `#`. « Travaux » etait le dernier ; il
// est devenu « Démonstrations » et pointe sur sa propre page. Toutes les entrees
// changent donc de page : le document est remplace et la classe html.menu-open
// part avec lui, si bien que `.menu a[href*="#"]` — le selecteur de closeMenu
// dans Interactions.tsx — ne matche plus rien et n a plus rien a fermer. Le
// menu se referme toujours par le burger et par Échap. Interactions.tsx n a
// toujours pas a bouger, mais son commentaire a suivi : un commentaire devenu
// faux est un bug.
//
// LA MEME STRUCTURE QUE LA BARRE DE NAV, ADAPTEE AU FORMAT. Quatre entrees —
// Démonstrations, Services, Le studio, Contact —, et « Offres » comme « Prestations »
// ont disparu des deux endroits pour la meme raison : ces trois mots disaient
// la meme chose (voir le commentaire de Nav.tsx). « Méthode » part avec elles,
// non parce qu elle faisait doublon, mais parce que le menu doit lister ce que
// la nav liste : une section de l accueil de plus ici et de moins la-bas est
// exactement le decalage qui obligeait le visiteur a deviner.
//
// LE DEROULANT DE LA NAV DEVIENT UNE SOUS-LISTE DEPLIEE. Un menu plein ecran
// n a aucune raison de cacher cinq liens derriere un bouton : la place ne
// manque pas, et un second niveau a ouvrir sur telephone est un geste de plus
// pour rien. Les cinq familles sont donc ecrites sous « Services », plus petites
// — c est la hierarchie visuelle qui dit qu elles en dependent, pas un pli.
//
// LA LISTE DES FAMILLES EST DERIVEE, jamais recopiee : lib/catalogue-familles.ts
// la construit depuis lib/familles.ts, et la barre de nav lit la meme.
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
// `lien`, qui ne touche a rien en francais. Les libelles des CINQ FAMILLES,
// eux, restent francais dans les deux langues — ils viennent de
// lib/familles.ts, qui n est pas encore traduit (meme remarque que dans
// components/NavServices.tsx).
export default function MenuOverlay({ locale = "fr" }: { locale?: Locale }) {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  const t = dictionnaire(locale);
  return (
    <div className="menu" id="menu" aria-hidden="true">
      <nav>
        {/* Meme changement que dans la barre de nav, et pour les memes deux
            raisons : « Travaux » promettait des references clients qui
            n existent pas, et l ancre de l accueil obligeait a recharger la page
            d entree depuis n importe quelle autre page. Voir components/Nav.tsx. */}
        <a className="m-lnk" style={{ "--i": 0 } as React.CSSProperties} href={lien(locale, "/demonstrations")}><span className="mi">(01)</span><span className="mt">{t.menu.demonstrations}</span></a>
        <div className="m-grp" style={{ "--i": 1 } as React.CSSProperties}>
          <a className="m-lnk" href={lien(locale, HREF_SERVICES)}><span className="mi">(02)</span><span className="mt">{t.menu.services}</span></a>
          <div className="m-sub">
            {ENTREES_FAMILLES.map((f) => (
              <a key={f.href} href={lien(locale, f.href)}>{(locale === "en" && f.libelleEn) || f.libelle}</a>
            ))}
          </div>
        </div>
        <a className="m-lnk" style={{ "--i": 2 } as React.CSSProperties} href={lien(locale, "/studio")}><span className="mi">(03)</span><span className="mt">{t.menu.studio}</span></a>
        <a className="m-lnk" style={{ "--i": 3 } as React.CSSProperties} href={lien(locale, "/contact")}><span className="mi">(04)</span><span className="mt">{t.menu.contact}</span></a>
      </nav>
      {/* LE BAS DU MENU NE PASSE PAS PAR `lien`, et il ne le doit pas : WhatsApp
          et l e-mail sont des URL EXTERNES. `lien` les laisserait d ailleurs
          intactes — elle reconnait les schemas d URI —, mais l ecrire ici
          laisserait croire qu il y a une version anglaise de ces adresses. Il
          n y en a pas : c est le meme numero et la meme boite. */}
      <div className="m-foot">
        <a href={whatsapp()} target="_blank" rel="noopener">{t.menu.whatsapp}</a>
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
