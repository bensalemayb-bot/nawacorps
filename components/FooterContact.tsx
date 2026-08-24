import ContactForm from "@/components/ContactForm";

// Footer Contact — reference/binacore.html lignes 1136-1153, copie verbatim.
//
// Rendu DANS #smoothWrap > #smooth, comme la maquette (le footer y est ferme
// ligne 1154, avant les deux </div>). Rien ici n est en position:fixed : un
// ancetre transforme casserait le fixed, d ou nav/loader/cursor hors wrapper.
//
// Le <h2> n a pas la classe .t : il est stylé par `.contact h2` et scindé en
// lignes par Interactions.tsx, dont le selecteur `h2.t, footer.contact h2`
// trouve enfin sa seconde cible.
//
// DEUX ADDITIONS EDITORIALES, toutes deux signalees :
//
//  B7 — les deux liens .lnk de la bande .legal vers les pages legales. Zero
//  CSS nouveau : .legal impose deja la casse et la couleur, `a{color:inherit}`
//  et .lnk::after en currentColor font le reste. Ce sont des <a> nus, pas des
//  next/link : une navigation client-side ne rejouerait pas Interactions, et
//  les [data-reveal] de la page d arrivee resteraient a opacity:0.
//
//  B8 — « ou par écrit » et <ContactForm />, sous la c-row. La maquette n a
//  pas de formulaire ; celui-ci s ajoute aux deux CTA WhatsApp/e-mail, qui ne
//  bougent pas. binacore.css reste intouche.
export default function FooterContact() {
  return (
    <footer className="contact green" id="contact">
      <div className="wrap">
        <span className="meta" data-reveal><span className="index">(07)</span>&nbsp; Contact</span>
        <h2 data-reveal style={{ marginTop: 26 }}>Donnons à votre commerce<br />la présence <span className="serif-i">qu&apos;il mérite.</span></h2>
        <div className="c-row" data-reveal>
          <a className="btn" href="https://wa.me/41760000000?text=Bonjour%2C%20parlons%20de%20mon%20commerce." target="_blank" rel="noopener">Écrire sur WhatsApp <span className="ar">→</span></a>
          {/* BR : adresse A CONFIRMER avant la mise en ligne. */}
          <a className="btn btn-line" href="mailto:hello@nawacorps.ch">hello@nawacorps.ch</a>
        </div>

        {/* ADDITION EDITORIALE B8, signalee : la maquette n a pas de formulaire.
            Les deux CTA ci-dessus sont inchanges — le formulaire s ajoute a cote
            d eux, il ne les remplace pas. */}
        <div data-reveal>
          <p className="meta" style={{ marginTop: 34 }}>ou par écrit</p>
          <ContactForm />
        </div>
        <div className="c-cols" data-reveal>
          <span>Genève, Suisse</span>
          <a className="lnk" href="tel:+41760000000">+41 76 000 00 00</a>
          <span>Lu–Sa · 9h–19h</span>
          <span>© 2026 Nawa Corps</span>
        </div>
      </div>
      <div className="giant" aria-hidden="true">NAWA CORPS</div>
      {/* BR — le slogan de marque, a UN SEUL endroit du site. Ici et pas dans
          le hero : celui-ci porte deja sa promesse, « Une presence digitale a
          la hauteur de votre commerce », et deux formules cote a cote se
          seraient affaiblies l une l autre. En pied de page il signe, il ne
          plaide pas. */}
      <p className="br-slogan">L&apos;essentiel. Bien conçu.</p>
      <div className="legal">
        <span>Studio digital — Genève</span>
        <span>Cartes · Sites · Google</span>
        <a className="lnk" href="/mentions-legales">Mentions légales</a>
        <a className="lnk" href="/confidentialite">Confidentialité</a>
      </div>
    </footer>
  );
}
