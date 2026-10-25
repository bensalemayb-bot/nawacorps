import ContactForm from "@/components/ContactForm";
import { dictionnaire } from "@/lib/dictionnaires";
import { MENTION_REPONSE, MENTION_REPONSE_EN } from "@/lib/mentions";
import { lien, type Locale } from "@/lib/i18n";
import { CONTACT, whatsappHref } from "@/lib/site";

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
   * Numero de section affiche devant « Contact », ex. « 05 ». Chaque page
   * passe le sien, qui suit sa derniere section (l accueil : « 07 », depuis les chiffres du 25.10.2026) ; le
   * defaut « 07 » n est qu un repli. Sans cela le lecteur passerait de (05) a
   * (07) sans transition (constat 18, docs/agents/reviews/brand-review-2026-08-31.md).
   */
  indexSection?: string;
  /**
   * La langue de la page. « fr » par defaut.
   *
   * Chaque page passe la sienne ; le defaut ne sert qu aux appelants qui ne
   * la connaissent pas.
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
        {/* LE TITRE EST L APPEL A LA DEMO : l assistant montre sur le metier du
            visiteur, sans rien a preparer. Interactions.tsx scinde ce h2 sur son <br />,
            et la seconde ligne garde son .serif-i. */}
        <h2 data-reveal style={{ marginTop: 26 }}>{t.pied.titreLigne1}<br />{t.pied.titreLigne2Debut}<span className="serif-i">{t.pied.titreLigne2Italique}</span></h2>
        <div className="c-row" data-reveal>
          {/* L ESPACE FINAL EST DANS L EXPRESSION, meme raison qu au-dessus :
              `{libelle} <span>` aurait fabrique deux noeuds texte adjacents et
              donc un `<!-- -->` de plus dans le HTML francais.
              L AMORCE WHATSAPP SUIT DESORMAIS LA LANGUE DE LA PAGE. Elle
              partait en francais depuis le pied de page anglais : le visiteur
              ouvrait WhatsApp sur une phrase qu il n avait pas ecrite. La
              seconde amorce vit dans lib/site.ts, source unique des
              coordonnees, sous `whatsappHref(locale)` — le numero, lui,
              n existe toujours qu a un seul endroit. */}
          <a className="btn" href={whatsappHref(locale)} target="_blank" rel="noopener">{`${t.pied.ecrireWhatsapp} `}<span className="ar">→</span></a>
          {/* BR : adresse A CONFIRMER avant la mise en ligne — lib/site.ts. */}
          <a className="btn btn-line" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>

        {/* ADDITION EDITORIALE B8, signalee : la maquette n a pas de formulaire.
            Les deux CTA ci-dessus sont inchanges — le formulaire s ajoute a cote
            d eux, il ne les remplace pas. */}
        <div data-reveal>
          {/* « ou appelez-nous » EST UN LIEN tel: (audit CRO/SEO v2 §3.5) : le
              texte invitait a appeler sans en donner le moyen. */}
          <p className="meta" style={{ marginTop: 34 }}>{t.pied.ouParEcritDebut}<a className="lnk" href={`tel:${CONTACT.telephone}`}>{t.pied.ouParEcritAppel}</a>{t.pied.ouParEcritFin}</p>
          {/* « Réponse le jour ouvrable suivant » : formulation unique au
              caractere pres (guide de voix §8), importee de lib/mentions.ts,
              jamais recopiee. */}
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
      {/* L ANCIEN SLOGAN « L'essentiel. Bien conçu. » EST SORTI du pied de
          page (arbitrage du 24.10.2026) : il appartenait a l ancien metier.
          Le seul slogan du site est desormais `pied.resume`, dans la bande
          legale ci-dessous. */}
      <div className="legal">
        <span>{t.pied.metier}</span>
        <span>{t.pied.resume}</span>
        {/* Prefixes comme tous les liens internes : les trois pages legales
            existent dans les deux langues. Les memes trois liens sont poses
            par components/LiensLegaux.tsx sur les pages sans ce pied. */}
        {/* Le hub des metiers, relie depuis toutes les pages a pied complet. */}
        <a className="lnk" href={lien(locale, "/metiers")}>{t.pied.metiers}</a>
        {/* Les guides n existent qu en francais : le lien n est jamais
            prefixe, et le libelle anglais le dit (« in French »). */}
        <a className="lnk" href="/guides">{t.pied.guides}</a>
        <a className="lnk" href={lien(locale, "/mentions-legales")}>{t.pied.mentionsLegales}</a>
        <a className="lnk" href={lien(locale, "/confidentialite")}>{t.pied.confidentialite}</a>
        <a className="lnk" href={lien(locale, "/cgv")}>{t.pied.cgv}</a>
        {/* Vers la rubrique qui inventorie le stockage du navigateur. */}
        <a className="lnk" href={`${lien(locale, "/confidentialite")}#cookies`}>{t.pied.cookies}</a>
      </div>
    </footer>
  );
}
