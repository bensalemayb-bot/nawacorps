import { redirect } from "next/navigation";
import Deconnexion from "@/components/admin/Deconnexion";
import LigneService from "@/components/admin/LigneService";
import StatutLead from "@/components/admin/StatutLead";
import { adminConnecte } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

/**
 * Tableau de bord de l administration — bloc B11.
 *
 * Server Component : les leads et le catalogue sont lus directement en base,
 * sans passer par une API interne. Seules les cellules qui MODIFIENT quelque
 * chose sont des composants clients.
 *
 * force-dynamic — INDISPENSABLE ET NON DECORATIF. Sans cela, Next pourrait
 * mettre cette page en cache : un administrateur verrait des leads perimes, et
 * pire, une page rendue pendant une session pourrait etre resservie apres la
 * deconnexion. Une page qui depend d un cookie et de donnees vivantes ne se
 * met pas en cache.
 *
 * REDIRECTION PLUTOT QUE 401 : ici on rend une page a un humain, pas une
 * reponse a un programme. Les APIs, elles, repondent 401 — chacune son
 * registre.
 */
export const dynamic = "force-dynamic";

type Message = { role: string; content: string };

const etoiles = (n: number) => "★".repeat(Math.max(0, Math.min(5, n))) || "—";

const dateCourte = (d: Date) =>
  new Intl.DateTimeFormat("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);

/**
 * Numero suisse vers identifiant wa.me : chiffres seuls, indicatif pays sans
 * le « + ». Un 0 initial est un prefixe national qui doit CEDER la place a 41,
 * pas s y ajouter — 0041... ne fonctionnerait pas. Hypothese assumee : les
 * numeros saisis sont suisses, ce qui est le cas des commerces genevois vises.
 */
function versWhatsapp(telephone: string): string {
  const chiffres = telephone.replace(/\D/g, "");
  if (chiffres.startsWith("41")) return chiffres;
  if (chiffres.startsWith("0")) return `41${chiffres.slice(1)}`;
  return chiffres;
}

/**
 * LA CELLULE DE CONTACT — ce par quoi on rappelle, et rien d autre.
 *
 * ELLE S APPELAIT « Telephone », ET C ETAIT LE BUG. La colonne rendait
 * TOUJOURS un lien wa.me, alors que le formulaire du site demande « un
 * telephone OU un e-mail ». Une demande laissee avec le seul e-mail affichait
 * donc une cellule vide, cliquable, pointant sur `https://wa.me/` — un lien
 * mort au moment precis ou l on cherche a joindre quelqu un. Et l e-mail, lui,
 * n etait affiche NULLE PART : il fallait ouvrir la base pour rappeler.
 *
 * L ORDRE EST CELUI DU RAPPEL, pas celui de la table : WhatsApp d abord —
 * c est le canal du studio —, l e-mail sinon, et « — » quand on n a ni l un ni
 * l autre. Ce dernier cas ne devrait pas exister (le schema de /api/contact
 * impose l un des deux) ; il est rendu quand meme, parce qu un lead de 2026
 * ecrit avant le bloc B13 peut porter une chaine vide, et qu une cellule
 * honnete vaut mieux qu un lien qui ne mene nulle part.
 */
function Contact({ phone, email }: { phone: string | null; email: string | null }) {
  const tel = phone?.trim();
  if (tel) {
    return (
      <a href={`https://wa.me/${versWhatsapp(tel)}`} target="_blank" rel="noopener">
        {tel}
      </a>
    );
  }
  const mail = email?.trim();
  if (mail) return <a href={`mailto:${mail}`}>{mail}</a>;
  return <>—</>;
}

function messagesDe(brut: unknown): Message[] {
  if (!Array.isArray(brut)) return [];
  return brut.filter(
    (m): m is Message =>
      typeof m === "object" && m !== null && "role" in m && "content" in m,
  );
}

export default async function PageAdmin() {
  if (!(await adminConnecte())) {
    redirect("/admin/login");
  }

  const [leads, services] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { conversation: { select: { messages: true } } },
    }),
    prisma.service.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      <div className="admin-head">
        <h1>Administration</h1>
        <Deconnexion />
      </div>

      <h2>
        Leads <span className="compte">({leads.length})</span>
      </h2>

      {leads.length === 0 ? (
        <p className="admin-vide">Aucun lead pour le moment.</p>
      ) : (
        <table className="admin-tableau">
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Score</th>
              <th>Nom</th>
              {/* « Contact » et non « Téléphone » : la colonne rend le numéro
                  quand il existe, l'e-mail sinon — voir le composant du même
                  nom plus haut. Le formulaire n'exige que l'un des deux. */}
              <th>Contact</th>
              <th>Commerce</th>
              {/* CE QUE LA DEMANDE CONCERNE. Sans cette colonne, la table ne
                  disait rien de l intention : un visiteur cliquait « Le Site »
                  et il fallait le rappeler pour savoir de quoi il parlait. Le
                  champ est pose par app/(site)/devis, via le formulaire comme
                  via l assistant. Vide pour une demande spontanee — pied de
                  page, WhatsApp —, et c est une information en soi. */}
              <th>Sujet</th>
              <th>Besoin</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const messages = messagesDe(lead.conversation?.messages);
              return (
                <tr key={lead.id}>
                  <td className="date">{dateCourte(lead.createdAt)}</td>
                  <td>{lead.source}</td>
                  <td className="score">{etoiles(lead.score)}</td>
                  <td>{lead.name}</td>
                  <td>
                    <Contact phone={lead.phone} email={lead.email} />
                  </td>
                  <td>
                    {lead.commerceName ?? "—"}
                    {lead.commerceType ? ` (${lead.commerceType})` : ""}
                  </td>
                  <td>{lead.subject ?? "—"}</td>
                  <td className="besoin">
                    {lead.needSummary ?? "—"}
                    {messages.length > 0 ? (
                      <details>
                        <summary>Transcript ({messages.length} messages)</summary>
                        <div className="transcript">
                          {messages.map((m, i) => (
                            <p key={i}>
                              <b>{m.role === "user" ? "Visiteur" : "Assistant"} :</b> {m.content}
                            </p>
                          ))}
                        </div>
                      </details>
                    ) : null}
                  </td>
                  <td>
                    <StatutLead id={lead.id} initial={lead.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <h2>
        Services <span className="compte">({services.length})</span>
      </h2>

      <table className="admin-tableau">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Type</th>
            <th>Prix (CHF)</th>
            <th>Visible</th>
            <th>Ordre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <LigneService
              key={s.id}
              service={{
                id: s.id,
                name: s.name,
                category: s.category,
                priceType: s.priceType,
                priceCents: s.priceCents,
                visible: s.visible,
                sortOrder: s.sortOrder,
              }}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
