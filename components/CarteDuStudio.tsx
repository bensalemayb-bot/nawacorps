import { whatsapp } from "@/lib/site";
import {
  CHF_UNIT,
  FROM_PREFIX,
  MONTHLY_SUFFIX,
  QUOTE_LABEL,
  formatChfAmount,
  isQuote,
} from "@/lib/format";
import {
  type ServiceCatalogue,
  chargerCatalogue,
  parCategories,
} from "@/lib/catalogue";
import BoutonDevis from "@/components/BoutonDevis";

/**
 * Carte de l agence — reference/binacore.html lignes 1033-1063.
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

// Libelles de groupe. « Les formules » ouvre la carte : c'est ce que le
// visiteur cherche en premier, et son absence rendait cette section
// incomplete — on y lisait les supports sans jamais voir les sites.
const GROUP_LABEL: Record<string, string> = {
  principal: "Les formules",
  annee: "En complément",
  continu: "En continu",
  saison: "Pour la restauration",
};

// Colonne 1 = les formules puis les complements ; colonne 2 = le recurrent,
// puis la ligne restauration.
const COL_1 = ["principal", "annee"];
const COL_2 = ["continu", "saison"];

const DEVIS_HREF =
  whatsapp("Bonjour, j'aimerais un devis pour une prestation.");

type ServiceRow = ServiceCatalogue;

// Les quatre categories que cette carte affiche, dans l ordre des colonnes.
// Le filtre reste ecrit ici et non dans la requete : la lecture est partagee
// avec Offres, sur le meme ecran (cf. lib/catalogue.ts).
const CATEGORIES = ["principal", "annee", "continu", "saison"];

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
  const services = parCategories(await chargerCatalogue(), CATEGORIES);

  return (
    <section className="offres green" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="studio-menu">
          <div className="sm-head" data-reveal>
            <h2>La carte <span className="serif-i">de l&apos;agence</span></h2>
          </div>
          {/* « le studio » et « sans engagement » ont quitte cette accroche :
              le premier est proscrit par le glossaire (c est l agence), le
              second est vague juridiquement et sature chez les concurrents.
              Et l accroche ne parle plus seulement de l apres-site : la moitie
              de ces lignes se commande sans site du tout. */}
          <p className="lede" data-reveal style={{ marginBottom: 30 }}>Tout ce que l&apos;agence vend, ligne par ligne. Les sites portent un prix, le suivi aussi ; le reste se chiffre sur devis, et se commande avec un site comme sans.</p>
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
                {/* Le minimum de commande de 300.– a disparu du catalogue :
                    tous ces supports passent sur devis, et le seuil n a plus
                    d objet. La ligne n est donc plus reservee aux
                    etablissements deja suivis. */}
                <p className="sm-note">La ligne restauration est ouverte à tous : la carte, les chevalets, la fidélité, les bons cadeaux et les supports de saison — avec un site chez moi ou sans.</p>
              </div>
            </div>
            <div className="sm-foot">
              {/* « devis en cinq minutes » etait un engagement de reactivite
                  sans source : le seul admis est « réponse le jour ouvrable
                  suivant », et il vit au formulaire. */}
              <span>Prix en francs suisses, TVA comprise. Les lignes sur devis se chiffrent après un échange.</span>
              <BoutonDevis href={DEVIS_HREF} sujet="devis-carte-du-studio">
                Demander un devis →
              </BoutonDevis>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
