import { dictionnaire } from "@/lib/dictionnaires";
import { lien, type Locale } from "@/lib/i18n";
import { CONTACT } from "@/lib/site";

// Section Le studio — reference/binacore.html lignes 1084-1102, copie verbatim.
//
// `style="padding-top:0"` de la maquette devient `style={{ paddingTop: 0 }}` :
// la section se colle a Methode, qui porte deja son padding bas.
//
// LES DEUX PARAGRAPHES NE FINISSAIENT QUE SUR LE SITE. « celle qui dessine et
// construit votre site », puis « aucun intermediaire entre vous et celui qui
// fait le site » : la section qui presente le studio le reduisait a un
// fabricant de sites, alors que c est precisement ici que le metier entier doit
// se voir. Le premier paragraphe nomme donc trois gestes differents — logotype,
// site, photographie — et le second porte ce qu il est seul a pouvoir dire :
// l apres-livraison, avec un exemple qui n est pas un site.
//
// « Vous parlez a une seule personne » est devenu « la meme personne », et il
// n y revient pas. La raison a change le 31 aout 2026 : ce n etait qu un
// doublon avec le h1 du hero, qui disait alors « Une seule personne. » ; ce h1
// dit maintenant « Un studio à Genève. », et la revendication d etre seul est
// retiree du site public en entier (voice-guide.md §4). « La meme personne »,
// elle, RESTE : c est le pilier 3 — celui qui repond l annee suivante — et non
// une declaration d effectif.
//
// UN TROISIEME PARAGRAPHE A ETE INSERE AU MILIEU, et c est celui qui manquait.
// La section disait QUI fait le travail, deux fois, sans jamais dire ce que ca
// change pour celui qui achete. Elle en est le meilleur endroit : c est ici que
// le lecteur decide s il a affaire a un professionnel. Ce qu on lui donne sont
// trois faits d exploitation, tous ecrits au positionnement §5 — le depart au
// feu vert, la validation avant mise en ligne, les deux allers-retours bornes.
// Le guide de voix §4 le dit : celui qui ecrit ce qu il ne fait pas est cru sur
// ce qu il fait.
//
// CE PARAGRAPHE NE PLAIDE PAS LE PRIX, et ne doit jamais s y mettre. Les faits
// de structure — pas de bureau, pas d equipe commerciale — restent ecrits, mais
// jamais suivis d une charniere causale vers le tarif (« et c est ce qui
// permet… ») : une justification attire l attention sur le doute qu elle veut
// lever.
//
// « AUCUNE SOUS-TRAITANCE » A ETE RETIRE, ET NE DOIT PAS REVENIR. L affirmation
// est fausse : la production des reseaux sociaux est faite avec un partenaire,
// et /services/reseaux-sociaux comme lib/familles.ts l ecrivent en toutes
// lettres — la contradiction se lisait a deux clics d ici. La phrase avait deja
// ete corrigee une fois avant d etre reintroduite par une reecriture. Ce qui la
// remplace porte sur ce qui est vrai et suffit a l argument : le site est
// dessine et construit par la meme personne. Meme correction dans la cinquieme
// reponse de components/Faq.tsx.
//
// LA VOIX EST AU PLURIEL DEPUIS LE 31 AOUT 2026, DANS LES DEUX LANGUES —
// « nous », `we` / `us` / `our` (voice-guide.md §4, glossaire anglais §2). Les
// trois paragraphes de cette section n ont pas bouge pour autant : ils parlent
// deja a la TROISIEME personne (« la personne qui repond a votre message »,
// « the person who answers your message »), ce qui est la formulation du
// pilier 3 et n a jamais ete un « je ». CE QUI RESTE PROSCRIT, et c est
// desormais le seul piege : `our team of X`, `our offices`, `since 20XX` —
// un pluriel n autorise aucun effectif, aucun bureau, aucune anciennete qui
// n existe pas. La LCD art. 3 ne s arrete pas a la frontiere de la langue.
//
// LA LOCALITE VIENT DE `CONTACT`, PAS DU DICTIONNAIRE, ET LES DEUX GRAPHIES NE
// SERVENT PAS AU MEME USAGE. `CONTACT.ville` (« Genève ») est du NAP : c est
// elle, et elle seule, qui part en donnee structuree — `areaServed`,
// `addressLocality` — DANS LES DEUX LANGUES, parce que deux graphies de la
// meme localite brouillent le rapprochement avec la fiche Google (lib/site.ts,
// docblock de CONTACT). `CONTACT.villeEn` (« Geneva ») ne sert qu a ce qu un
// HUMAIN lit, et c est ce que fait la bande de faits ci-dessous. Ne pas
// intervertir les deux, et ne jamais brancher `villeEn` sur un JSON-LD.
export default function Studio({ locale = "fr" }: { locale?: Locale }) {
  const t = dictionnaire(locale);
  const ville = locale === "en" ? CONTACT.villeEn : CONTACT.ville;

  return (
    <section id="studio" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="meta" data-reveal><span className="index">(04)</span>{`\u00A0 ${t.studio.section}`}</span>
          <h2 className="sr-only">{t.studio.titreCache}</h2>
        </div>
        <div className="studio-grid">
          <p className="studio-quote" data-reveal>{t.studio.citationDebut}<em>{t.studio.citationItalique}</em>{t.studio.citationFin}</p>
          <div className="studio-txt" data-reveal>
            <p>{t.studio.paragraphe1}</p>
            <p>{t.studio.paragraphe2}</p>
            <p>{t.studio.paragraphe3}</p>
            {/* « 1 sem. » etait la derniere abreviation du delai sur le site.
                Le glossaire (guide de voix, entree 3) impose une forme unique,
                « une semaine » : un delai qui change de mots change de sens aux
                yeux du lecteur. Le meme bandeau sur /studio ecrivait deja
                « Une semaine » — le commentaire de cette page-la affirme que
                les deux bandeaux sont identiques, ce qui n etait pas vrai.
                LA MENTION DU DELAI PORTE CE QUI EST LIVRE, dans les deux
                langues : « Une semaine / Refonte livrée », « One week /
                Rebuild delivered ». Seule, elle contreviendrait au §5. */}
            <div className="facts">
              <div><b>{ville}</b><span>{t.studio.faitLieuNote}</span></div>
              <div><b>{t.studio.faitDelai}</b><span>{t.studio.faitDelaiNote}</span></div>
              <div><b>{t.studio.faitLangues}</b><span>{t.studio.faitLanguesNote}</span></div>
            </div>
            {/* LA SECTION N AVAIT AUCUN LIEN. Trois paragraphes qui disent qui
                fait le travail, et rien pour aller le verifier : /studio
                existe depuis la refonte de la nav et n etait atteignable que
                par le menu. Un seul renvoi, sobre, sous les faits — c est une
                section de confiance, pas une section de vente, et un bouton y
                sonnerait faux. <a> classique, jamais next/link : la navigation
                client casse les revelations au scroll (decision B7). */}
            <p style={{ marginTop: "1.8rem", marginBottom: 0 }}>
              <a className="lnk" href={lien(locale, "/studio")} style={{ color: "var(--ink)" }}>
                {t.studio.lien}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
