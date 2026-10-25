import { lirePaliers, texteOffreIntroduction } from "@/lib/catalogue";
import { dictionnaire } from "@/lib/dictionnaires";
import { mentionTva, suffixeMensuel } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

/**
 * LA GRILLE DE L ABONNEMENT MENSUEL — trois paliers lus en base
 * (`lirePaliers`, lib/catalogue.ts), decision d Ayoub du 25.10.2026
 * (founder/pricing.md). Rendue dans la section (05) de l accueil et sur
 * /services.
 *
 * AUCUN DESIGN NOUVEAU, deux formes deja dessinees :
 *  - `price` : les cartes `.price` de la section (05), sur fond vert ;
 *  - `cat`   : les cartes `.cat-it` et leur prix `.px` de /services, sur fond
 *    clair (`.price` est calibree pour le vert : ses gris y disparaitraient).
 *
 * AUCUN PALIER N EST MIS EN AVANT : ni « Recommandé », ni « Populaire », ni
 * carte surlignee. Le palier se choisit a la fin de la demo, sur le volume
 * reel du client, pas sur un badge.
 *
 * CHAQUE MONTANT PORTE SA MENTION DE TVA DANS SA CARTE (lib/format.ts,
 * `mentionTva`), jamais une note commune en bas de grille.
 *
 * L OFFRE D INTRODUCTION suit la grille, une seule phrase sobre, et s eteint
 * seule apres sa date (`texteOffreIntroduction`).
 *
 * GRILLE INCOMPLETE EN BASE : rien n est rendu. Les textes autour disent deja
 * « selon votre volume, sans engagement », sans montant.
 */
export default async function GrilleAbonnement({
  locale,
  forme,
}: {
  locale: Locale;
  forme: "price" | "cat";
}) {
  const paliers = await lirePaliers(locale);
  if (!paliers) return null;
  const t = dictionnaire(locale).abonnement;
  const mois = suffixeMensuel(locale);
  // « /mois » suit deja le montant : la ligne dessous porte la mention et les
  // conditions, sans redire « par mois ».
  const conditions = `${mentionTva(locale)}, ${t.conditions}`;
  const introduction = texteOffreIntroduction(paliers, locale);

  if (forme === "cat") {
    return (
      <>
        <div className="cat-grid">
          {paliers.map((p) => (
            <article className="cat-it" data-reveal key={p.slug}>
              <h3>{p.nom}</h3>
              <p className="d">{p.description}</p>
              <p className="px">
                {p.montant}
                <small className="per">{mois}</small>
              </p>
              <p className="d">{conditions}</p>
            </article>
          ))}
        </div>
        {introduction && (
          <div className="sm-devis" data-reveal>
            <p>{introduction}</p>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <p className="meta" data-reveal style={{ marginTop: "clamp(40px,5vw,64px)", marginBottom: 22 }}>
        {t.titre}
      </p>
      <div className="price-grid">
        {paliers.map((p) => (
          <article className="price" data-reveal key={p.slug}>
            <div className="lab"><span>{t.tete}</span></div>
            <h3>{p.nom}</h3>
            <p className="d">{p.description}</p>
            <p className="num">
              {p.montant}
              <small>{mois}</small>
            </p>
            <p className="num-tva">{conditions}</p>
          </article>
        ))}
      </div>
      {introduction && (
        <div className="p-note" data-reveal>
          <span>{introduction}</span>
        </div>
      )}
    </>
  );
}
