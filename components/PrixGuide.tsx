import { Tableau } from "@/components/Guide";
import type { PalierAbonnement } from "@/lib/catalogue";
import { mentionTva, suffixeMensuel } from "@/lib/format";

/**
 * NOS PRIX DANS LES GUIDES — lus en base, jamais ecrits ici.
 *
 * Les montants arrivent de lib/catalogue.ts (`lireMiseEnPlace`,
 * `lirePaliers`), comme sur l accueil, /services et la FAQ : corriger un prix
 * depuis /admin le corrige aussi dans les guides. Chaque montant porte la
 * mention de lib/format.ts (`mentionTva`) DANS SA CELLULE OU SA PHRASE : une
 * cellule de tableau se lit seule, et une reponse de FAQ repart seule dans le
 * JSON-LD.
 *
 * SANS LIGNE EN BASE, AUCUN CHIFFRE : la phrase se referme sans montant et le
 * tableau n est pas rendu. Jamais un prix invente.
 *
 * L OFFRE D INTRODUCTION N EST PAS REPRISE ICI, deliberement : elle ne vit
 * que sur l accueil, /services et les reprises automatiques
 * (.agents/product-marketing.md, « une seule mention sobre »).
 */

/** Une phrase sur nos prix, montants et mention compris, ou sans montant. */
export function phraseNosPrix(montant: string | null, paliers: readonly PalierAbonnement[] | null): string {
  const tva = mentionTva("fr");
  const mois = suffixeMensuel("fr");
  const miseEnPlace = montant
    ? `Chez Nawa Corps, la mise en place coûte ${montant}, ${tva}, payée une seule fois après l'essai, si le relevé vous convient.`
    : "Chez Nawa Corps, la mise en place se paie une seule fois, après l'essai, si le relevé vous convient.";
  const abonnement = paliers
    ? `L'abonnement mensuel a trois paliers : ${paliers
        .map((p) => `${p.nom} ${p.montant}${mois}`)
        .join(", ")}, ${tva}, sans engagement, résiliable chaque mois.`
    : "L'abonnement mensuel a trois paliers selon votre volume, sans engagement, résiliable chaque mois.";
  return `${miseEnPlace} ${abonnement}`;
}

/** Le tableau de nos prix : la mise en place, puis les trois paliers. */
export function TableauNosPrix({
  montant,
  paliers,
}: {
  montant: string | null;
  paliers: readonly PalierAbonnement[] | null;
}) {
  if (!montant && !paliers) return null;
  const tva = mentionTva("fr");
  const mois = suffixeMensuel("fr");
  return (
    <Tableau legende="Nos prix, lus le jour de votre visite">
      <thead>
        <tr>
          <th scope="col">Poste</th>
          <th scope="col">Ce qui est compris</th>
          <th scope="col">Prix</th>
        </tr>
      </thead>
      <tbody>
        {montant && (
          <tr>
            <th scope="row">Mise en place</th>
            <td>Une fois, payée après les deux semaines d&apos;essai, si le relevé vous convient.</td>
            <td>
              {montant}
              <span className="gd-tva">{tva}</span>
            </td>
          </tr>
        )}
        {paliers?.map((p) => (
          <tr key={p.slug}>
            <th scope="row">{`Abonnement ${p.nom}`}</th>
            <td>{`${p.description} Sans engagement, résiliable chaque mois.`}</td>
            <td>
              {`${p.montant}${mois}`}
              <span className="gd-tva">{tva}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </Tableau>
  );
}
