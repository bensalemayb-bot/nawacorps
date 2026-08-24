"use client";

import { useState } from "react";

/**
 * Ligne editable d un service — bloc B11.
 *
 * BOUTON PAR LIGNE, contrairement au statut d un lead qui part au changement.
 * Une ligne porte trois champs : les modifier un a un enverrait trois requetes
 * pour une seule intention (« ce service passe a 490 et remonte en tete »).
 * On groupe donc, et le bouton marque la fin de l intention.
 *
 * LE PRIX EST DESACTIVE SUR UN SERVICE SUR DEVIS. Le serveur force deja
 * priceCents a null quand priceType vaut QUOTE ; laisser le champ actif
 * offrirait une saisie que le serveur effacerait en silence. Une interface ne
 * doit pas proposer un geste sans effet.
 *
 * priceType s affiche sans etre modifiable ici : le changer relevé d une
 * decision de catalogue, pas d un ajustement courant, et il commande la
 * coherence du prix.
 *
 * SAISIE EN FRANCS, STOCKAGE EN CENTIMES. La base garde des centimes — c est
 * la bonne unite pour de l argent, elle evite les flottants. Mais personne ne
 * pense en centimes : taper 45000 pour 450.– invite a la faute d un zero, et
 * une faute d un zero, c est un prix multiplie ou divise par dix sur le site
 * public. La conversion se fait donc ICI, au bord de l interface, et la valeur
 * affichee est celle que le commercant a en tete.
 */

type Service = {
  id: string;
  name: string;
  category: string;
  priceType: string;
  priceCents: number | null;
  visible: boolean;
  sortOrder: number;
};

/** Centimes -> francs, pour l affichage. 45000 -> "450" ; 4900 -> "49". */
const enFrancs = (cents: number | null): string =>
  cents === null ? "" : String(cents / 100);

export default function LigneService({ service }: { service: Service }) {
  const [prix, setPrix] = useState(enFrancs(service.priceCents));
  const [visible, setVisible] = useState(service.visible);
  const [ordre, setOrdre] = useState(service.sortOrder);
  const [etat, setEtat] = useState<"" | "ok" | "ko">("");
  const [envoi, setEnvoi] = useState(false);

  const surDevis = service.priceType === "QUOTE";

  async function enregistrer() {
    setEnvoi(true);
    setEtat("");
    try {
      const corps: Record<string, unknown> = { visible, sortOrder: Number(ordre) };
      // On n envoie le prix que s il peut exister : sur devis, le serveur le
      // remettrait a null de toute facon.
      // Math.round APRES la multiplication : 49.9 * 100 vaut 4989.999... en
      // flottant, et un troncage rendrait 4989 au lieu de 4990.
      if (!surDevis) corps.priceCents = prix === "" ? null : Math.round(Number(prix) * 100);

      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(corps),
      });
      setEtat(res.ok ? "ok" : "ko");
    } catch {
      setEtat("ko");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <tr>
      <td>{service.name}</td>
      <td>{service.category}</td>
      <td>{service.priceType}</td>
      <td className="num">
        {surDevis ? (
          <span className="devis">sur devis</span>
        ) : (
          <>
            <input
              type="number"
              min={0}
              step={1}
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              disabled={envoi}
              aria-label={`Prix en francs de ${service.name}`}
            />
            <span className="unite">.–</span>
          </>
        )}
      </td>
      <td>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
          disabled={envoi}
          aria-label={`Visibilité de ${service.name}`}
        />
      </td>
      <td className="num">
        <input
          type="number"
          min={0}
          step={1}
          value={ordre}
          onChange={(e) => setOrdre(Number(e.target.value))}
          disabled={envoi}
          aria-label={`Ordre de ${service.name}`}
        />
      </td>
      <td>
        <button type="button" onClick={enregistrer} disabled={envoi}>
          {envoi ? "…" : "Enregistrer"}
        </button>
        {etat ? (
          <span className={`etat ${etat}`} role="status">
            {etat === "ok" ? "enregistré" : "échec"}
          </span>
        ) : null}
      </td>
    </tr>
  );
}
