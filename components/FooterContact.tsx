import ContactForm from "@/components/ContactForm";
import { dictionnaire } from "@/lib/dictionnaires";
import { MENTION_REPONSE, MENTION_REPONSE_EN } from "@/lib/familles";
import { lien, type Locale } from "@/lib/i18n";
import { CONTACT, WHATSAPP_HREF } from "@/lib/site";

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
type FooterContactProps = {
  /**
   * Numero de section affiche devant « Contact », ex. « 05 ». Par defaut
   * « 07 » : l accueil compte sept sections et ne doit pas changer de
   * comportement. Les pages internes, qui en comptent moins, passent leur
   * propre numero pour ne pas laisser le lecteur passer de (05) a (07) sans
   * transition (constat 18, docs/agents/reviews/brand-review-2026-08-31.md).
   */
  indexSection?: string;
  /**
   * La langue de la page. « fr » par defaut, et ce defaut EST utilise
   * aujourd hui : ce pied de page est rendu par les PAGES, pas par le layout,
   * et aucune ne passe encore sa langue — app/(site)/en/page.tsx compris, qui
   * n est pas de ce chantier. Il rend donc du francais partout, exactement
   * comme avant, jusqu a ce que l agent des pages fasse descendre la locale.
   */
  locale?: Locale;
};

export default function FooterContact({
  indexSection = "07",
  locale = "fr",
}: FooterContactProps) {
  const t = dictionnaire(locale);
  return (
    <footer className="contact green" id="contact">
      <div className="wrap">
        {/* L espace insecable ET le libelle tiennent dans UNE SEULE expression,
            et ce n est pas une coquetterie : deux enfants texte cote a cote
            font ecrire a React un `<!-- -->` entre eux pour borner
            l hydratation, ce qui aurait change le HTML rendu en francais.
            Un seul noeud texte, aucun marqueur, HTML identique a l octet. */}
        <span className="meta" data-reveal><span className="index">({indexSection})</span>{`  ${t.pied.section}`}</span>
        {/* « Montrez-moi votre site » fermait la page sur le seul produit
            d entree, et renvoyait le visiteur venu pour un logotype ou des
            cartes de visite. « Ce que vous avez » couvre le site, l imprime et
            la fiche Google sans rien perdre de l invitation. Le decoupage en
            deux lignes ne bouge pas : Interactions.tsx scinde ce h2 sur ses
            <br />, et la seconde ligne garde son .serif-i. */}
        <h2 data-reveal style={{ marginTop: 26 }}>{t.pied.titreLigne1}<br />{t.pied.titreLigne2Debut}<span className="serif-i">{t.pied.titreLigne2Italique}</span></h2>
        <div className="c-row" data-reveal>
          {/* L ESPACE FINAL EST DANS L EXPRESSION, meme raison qu au-dessus :
              `{libelle} <span>` aurait fabrique deux noeuds texte adjacents et
              donc un `<!-- -->` de plus dans le HTML francais.
              `WHATSAPP_HREF` porte un message d amorce ECRIT EN FRANCAIS
              (lib/site.ts) : il partira tel quel depuis la page anglaise. Le
              traduire suppose une seconde amorce dans lib/site.ts, qui est la
              source unique des coordonnees et n est pas de ce chantier. */}
          <a className="btn" href={WHATSAPP_HREF} target="_blank" rel="noopener">{`${t.pied.ecrireWhatsapp} `}<span className="ar">→</span></a>
          {/* BR : adresse A CONFIRMER avant la mise en ligne — lib/site.ts. */}
          <a className="btn btn-line" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>

        {/* ADDITION EDITORIALE B8, signalee : la maquette n a pas de formulaire.
            Les deux CTA ci-dessus sont inchanges — le formulaire s ajoute a cote
            d eux, il ne les remplace pas. */}
        <div data-reveal>
          <p className="meta" style={{ marginTop: 34 }}>{t.pied.ouParEcrit}</p>
          {/* Constat 5 de la revue de marque : cet engagement etait ecrit
              au-dessus du formulaire sur /contact mais absent ici, sur la
              page qui recoit le plus de trafic. MENTION_REPONSE est importee
              de lib/familles.ts, pas recopiee, pour garantir la formulation
              unique au caractere pres qu exige le guide de voix (§8).
              ELLE RESTE FRANCAISE SUR LA PAGE ANGLAISE, et c est assume : la
              formulation appartient a lib/familles.ts, hors de ce chantier, et
              sa traduction est une decision de voix — pas un remplacement de
              chaine. Elle se verra, ce qui est le but. */}
          {/* La seule phrase du pied de page qui ne vient pas du dictionnaire :
              elle vit dans lib/familles.ts, ou les pages de famille la lisent
              aussi. Une seule source, deux lecteurs. */}
          <p className="meta">{locale === "en" ? MENTION_REPONSE_EN : MENTION_REPONSE}</p>
          <ContactForm locale={locale} />
        </div>
        <div className="c-cols" data-reveal>
          <span>{t.pied.lieu}</span>
          <a className="lnk" href={`tel:${CONTACT.telephone}`}>{CONTACT.telephoneAffiche}</a>
          <span>{t.pied.horaires}</span>
          <span>{t.pied.copyright}</span>
        </div>
      </div>
      <div className="giant" aria-hidden="true">NAWA CORPS</div>
      {/* BR — le slogan de marque, a UN SEUL endroit du site. Ici et pas dans
          le hero : celui-ci porte deja son titre, « Site, imprimes, photos,
          reseaux. Une seule personne. », et deux formules cote a cote se
          seraient affaiblies l une l autre. En pied de page il signe, il ne
          plaide pas. */}
      <p className="br-slogan">{t.pied.slogan}</p>
      <div className="legal">
        <span>{t.pied.metier}</span>
        {/* La bande de pied de page resumait l offre en trois mots qui ne
            parlaient que du site. Le studio vend aussi de l identite, des
            imprimes, des photos et la production des reseaux sociaux : le
            resume les nomme, en gardant le site en tete. */}
        <span>{t.pied.resume}</span>
        {/* CES DEUX LIENS SONT PREFIXES COMME LES AUTRES, et il faut savoir ce
            que cela implique tant que la version anglaise est en chantier :
            `/en/mentions-legales` n existe PAS encore, ces liens repondent donc
            404 depuis une page anglaise. C est la regle du chantier — un lien
            interne passe par `lien`, sans exception — et c est aussi ce qui
            fait qu il n y aura rien a reprendre ici le jour ou les deux pages
            legales seront traduites. Le meme constat vaut pour toutes les
            entrees de components/Nav.tsx et components/MenuOverlay.tsx : la
            version anglaise n est pas publiable tant que les pages qu elles
            visent n existent pas, ce que le bandeau de app/(site)/en/page.tsx
            dit deja en toutes lettres. */}
        <a className="lnk" href={lien(locale, "/mentions-legales")}>{t.pied.mentionsLegales}</a>
        <a className="lnk" href={lien(locale, "/confidentialite")}>{t.pied.confidentialite}</a>
      </div>
    </footer>
  );
}
