import {
  CHF_UNIT,
  FROM_PREFIX,
  MONTHLY_SUFFIX,
  QUOTE_LABEL,
  formatChfAmount,
  isQuote,
} from "@/lib/format";
import { prisma } from "@/lib/prisma";

/**
 * Carte du studio — reference/binacore.html lignes 1033-1063.
 *
 * Toutes les lignes et tous les prix viennent de Postgres. Aucun montant n'est
 * ecrit ici.
 *
 * STRUCTURE : dans la maquette, .studio-menu est un sous-bloc de
 * `section.offres.green` — il herite donc du fond pin et de ses couleurs. Rendu
 * en frere dans page.tsx, il doit reconstituer ce contexte, d'ou le
 * `section.offres.green` ci-dessous.
 * L'espacement reste celui de la maquette parce que la jointure est neutralisee
 * des deux cotes : Offres porte paddingBottom 0, cette section paddingTop 0.
 * Le seul ecart vertical entre les deux blocs redevient donc le
 * `margin-top:clamp(60px,8vw,110px)` de .studio-menu, exactement comme dans la
 * source. Le motif `style="padding-top:0"` est lui-meme utilise par la maquette
 * (sections #services, #studio, #faq).
 */

// Libelles de groupe, verbatim de la maquette (lignes 1041, 1050, 1053).
const GROUP_LABEL: Record<string, string> = {
  annee: "Au fil de l'année",
  continu: "En continu",
  saison: "Selon la saison",
};

// Colonne 1 = au fil de l'annee ; colonne 2 = en continu, puis selon la saison.
const COL_1 = ["annee"];
const COL_2 = ["continu", "saison"];

const DEVIS_HREF =
  "https://wa.me/41760000000?text=Bonjour%2C%20j%27aimerais%20un%20devis%20pour%20un%20support.";

type ServiceRow = Awaited<ReturnType<typeof loadServices>>[number];

async function loadServices() {
  return prisma.service.findMany({
    where: { category: { in: ["annee", "continu", "saison"] }, visible: true },
    orderBy: { sortOrder: "asc" },
  });
}

function Price({ service }: { service: ServiceRow }) {
  if (isQuote(service) || service.priceCents === null) {
    return <span className="px">{QUOTE_LABEL}</span>;
  }
  return (
    <span className="px">
      {service.priceFrom ? <small>{FROM_PREFIX}</small> : null}
      {`${formatChfAmount(service.priceCents)}${CHF_UNIT}`}
      {service.isMonthly ? <small className="per">{MONTHLY_SUFFIX}</small> : null}
    </span>
  );
}

function Group({ category, services }: { category: string; services: ServiceRow[] }) {
  const rows = services.filter((s) => s.category === category);
  if (rows.length === 0) return null;
  return (
    <>
      <p className="sm-grp">{GROUP_LABEL[category]}</p>
      {rows.map((service) => (
        <div className="sm-it" key={service.id}>
          <span>{service.name}</span>
          <i></i>
          <Price service={service} />
        </div>
      ))}
    </>
  );
}

export default async function CarteDuStudio() {
  const services = await loadServices();

  return (
    <section className="offres green" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="studio-menu">
          <div className="sm-head" data-reveal>
            <h3>La carte <span className="serif-i">du studio</span></h3>
          </div>
          <p className="lede" data-reveal style={{ marginBottom: 30 }}>Votre commerce équipé, le studio reste à disposition toute l&apos;année — à la carte, comme chez vous.</p>
          <div className="sm-card" data-reveal>
            <div className="sm-cols">
              <div className="sm-col">
                {COL_1.map((category) => (
                  <Group key={category} category={category} services={services} />
                ))}
              </div>
              <div className="sm-col">
                {COL_2.map((category) => (
                  <Group key={category} category={category} services={services} />
                ))}
                <p className="sm-note">Terrasse d&apos;été, rentrée, Escalade, Noël, Saint-Valentin : cinq occasions par an de rester visible sans y penser.</p>
              </div>
            </div>
            <div className="sm-foot">
              <span>Prix indicatifs, tout compris — devis en cinq minutes.</span>
              <a className="lnk" href={DEVIS_HREF} target="_blank" rel="noopener">Demander un devis →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
