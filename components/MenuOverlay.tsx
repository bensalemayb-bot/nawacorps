import { CONTACT, whatsapp } from "@/lib/site";
// Menu plein ecran — reference/binacore.html lignes 707-720.
// Ouverture/fermeture pilotees par Interactions.tsx (classe html.menu-open).
//
// ADAPTATION B7 : ancres prefixees `/`, meme raison que Nav.tsx. Consequence
// obligatoire : le selecteur closeMenu d Interactions.tsx passe de
// `[href^="#"]` a `[href*="#"]`, sinon le menu ne se refermerait plus.
export default function MenuOverlay() {
  // volontaire — next/link casserait les reveals (Interactions ne tourne qu'une fois), voir décision B7
  return (
    <div className="menu" id="menu" aria-hidden="true">
      <nav>
        <a className="m-lnk" href="/#travaux"><span className="mi">(01)</span><span className="mt">Travaux</span></a>
        <a className="m-lnk" href="/#services"><span className="mi">(02)</span><span className="mt">Services</span></a>
        <a className="m-lnk" href="/#offres"><span className="mi">(03)</span><span className="mt">Offres</span></a>
        <a className="m-lnk" href="/#methode"><span className="mi">(04)</span><span className="mt">Méthode</span></a>
        <a className="m-lnk" href="/#contact"><span className="mi">(05)</span><span className="mt">Contact</span></a>
      </nav>
      <div className="m-foot">
        <a href={whatsapp()} target="_blank" rel="noopener">WhatsApp</a>
        {/* BR : adresse A CONFIRMER avant la mise en ligne. */}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <span>Genève, Suisse</span>
      </div>
    </div>
  );
}
