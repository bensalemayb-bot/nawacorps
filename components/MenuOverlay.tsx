import { CONTACT, whatsapp } from "@/lib/site";
// Menu plein ecran — reference/binacore.html lignes 707-720.
// Ouverture/fermeture pilotees par Interactions.tsx (classe html.menu-open).
//
// ADAPTATION B7 : ancres prefixees `/`, meme raison que Nav.tsx. Consequence
// obligatoire : le selecteur closeMenu d Interactions.tsx passe de
// `[href^="#"]` a `[href*="#"]`, sinon le menu ne se refermerait plus.
//
// ATTENTION AU SELECTEUR, justement : « Prestations » est le premier lien du
// menu qui ne porte AUCUN `#`. `[href*="#"]` ne le matche donc pas, et le menu
// ne se refermerait pas au clic — sauf qu il n a pas a le faire : le lien
// change de page, le document est remplace et la classe html.menu-open part
// avec lui. Aucune modification d Interactions.tsx n est requise.
//
// LA NUMEROTATION EST CELLE DU MENU, pas celle des sections de l accueil, et
// les deux divergent volontairement. Le menu compte SES six entrees dans SON
// ordre — « Prestations » y prend un rang (04) que l accueil n a pas, puisque
// c est une autre page. L accueil, lui, numerote ses sept sections dans l ordre
// ou elles defilent : (03) Methode, (04) Le studio, (05) Questions, (06) Offres.
// Le menu se contente donc de rester continu ; il n a pas a suivre la page.
export default function MenuOverlay() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <div className="menu" id="menu" aria-hidden="true">
      <nav>
        <a className="m-lnk" href="/#travaux"><span className="mi">(01)</span><span className="mt">Travaux</span></a>
        <a className="m-lnk" href="/#services"><span className="mi">(02)</span><span className="mt">Services</span></a>
        <a className="m-lnk" href="/#offres"><span className="mi">(03)</span><span className="mt">Offres</span></a>
        <a className="m-lnk" href="/prestations"><span className="mi">(04)</span><span className="mt">Prestations</span></a>
        <a className="m-lnk" href="/#methode"><span className="mi">(05)</span><span className="mt">Méthode</span></a>
        <a className="m-lnk" href="/#contact"><span className="mi">(06)</span><span className="mt">Contact</span></a>
      </nav>
      <div className="m-foot">
        <a href={whatsapp()} target="_blank" rel="noopener">WhatsApp</a>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <span>Genève, Suisse</span>
      </div>
    </div>
  );
}
