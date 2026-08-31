import { ENTREES_FAMILLES, HREF_SERVICES } from "@/lib/catalogue-familles";
import { CONTACT, whatsapp } from "@/lib/site";

// Menu plein ecran — reference/binacore.html lignes 707-720.
// Ouverture/fermeture pilotees par Interactions.tsx (classe html.menu-open).
//
// ADAPTATION B7 : ancres prefixees `/`, meme raison que Nav.tsx. Consequence
// obligatoire : le selecteur closeMenu d Interactions.tsx passe de
// `[href^="#"]` a `[href*="#"]`, sinon le menu ne se refermerait plus.
//
// IL NE RESTE QU UN SEUL LIEN AVEC UN `#`. C est « Travaux », et c est le seul
// que `.menu a[href*="#"]` matche encore : tous les autres changent de page, le
// document est remplace et la classe html.menu-open part avec lui. Ce qui etait
// vrai d une entree l est devenu de sept. Interactions.tsx n a toujours pas a
// bouger — mais son commentaire, qui annoncait « exactement les memes 5 liens »,
// a ete corrige : un commentaire devenu faux est un bug.
//
// LA MEME STRUCTURE QUE LA BARRE DE NAV, ADAPTEE AU FORMAT. Quatre entrees —
// Travaux, Services, Le studio, Contact —, et « Offres » comme « Prestations »
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
export default function MenuOverlay() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <div className="menu" id="menu" aria-hidden="true">
      <nav>
        <a className="m-lnk" style={{ "--i": 0 } as React.CSSProperties} href="/#travaux"><span className="mi">(01)</span><span className="mt">Travaux</span></a>
        <div className="m-grp" style={{ "--i": 1 } as React.CSSProperties}>
          <a className="m-lnk" href={HREF_SERVICES}><span className="mi">(02)</span><span className="mt">Services</span></a>
          <div className="m-sub">
            {ENTREES_FAMILLES.map((f) => (
              <a key={f.href} href={f.href}>{f.libelle}</a>
            ))}
          </div>
        </div>
        <a className="m-lnk" style={{ "--i": 2 } as React.CSSProperties} href="/studio"><span className="mi">(03)</span><span className="mt">Le studio</span></a>
        <a className="m-lnk" style={{ "--i": 3 } as React.CSSProperties} href="/contact"><span className="mi">(04)</span><span className="mt">Contact</span></a>
      </nav>
      <div className="m-foot">
        <a href={whatsapp()} target="_blank" rel="noopener">WhatsApp</a>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <span>Genève, Suisse</span>
      </div>
    </div>
  );
}
