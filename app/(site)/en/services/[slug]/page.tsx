import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { estFormule } from "@/lib/formules";
import { corpsFormule, metadataFormule } from "../../../services/[slug]/page";

/**
 * /en/services/<slug> — LES TROIS PAGES DE FORMULE EN ANGLAIS.
 *
 * `la-vitrine`, `le-site`, `l-assistant` : LES MEMES SLUGS QU EN FRANCAIS, et
 * ils ne se traduiront jamais. Ce sont des identifiants — le catalogue, le
 * parcours de devis et l assistant les lisent tels quels —, et les NOMS qu ils
 * designent ne se traduisent pas non plus (voice-guide §10, glossaire §5) : la
 * page anglaise affiche « La Vitrine », article compris, parce que `nameEn`
 * vaut null en base pour cette raison exacte.
 *
 * Le corps et les deux jeux de chaines vivent dans
 * app/(site)/services/[slug]/page.tsx ; voir l en-tete de son voisin
 * app/(site)/en/services/page.tsx pour le pourquoi de cet import et pour la
 * raison qui impose de redeclarer `dynamic` ici.
 */
export const dynamic = "force-dynamic";

/**
 * Les trois memes slugs qu en francais, et pour la meme raison : ce sont les
 * trois pages qu on a decide d ecrire, pas ce que la base pourrait contenir un
 * jour. Sous `force-dynamic` cette fonction ne prerend rien — elle declare les
 * seuls segments legitimes.
 *
 * ELLE EST REEXPORTEE PLUTOT QUE REECRITE : `generateStaticParams` doit etre
 * un export de CE fichier — c est une convention de route, Next la lit sur le
 * module de la page —, mais son contenu n a aucune raison d exister deux fois.
 * La liste elle-meme n est ecrite nulle part ici : c est `FORMULE_SLUGS`, dans
 * lib/formules.ts.
 */
export { generateStaticParams } from "../../../services/[slug]/page";

export async function generateMetadata({
  params,
}: PageProps<"/en/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  // Un slug inconnu ne merite pas de metadonnees : la page qui suit repondra
  // notFound(). Renvoyer un objet vide laisse le layout fournir ses valeurs
  // par defaut le temps du 404.
  if (!estFormule(slug)) return {};
  return metadataFormule(slug, "en");
}

export default async function FormulePageEn({
  params,
}: PageProps<"/en/services/[slug]">) {
  const { slug } = await params;
  if (!estFormule(slug)) notFound();
  return corpsFormule(slug, "en");
}
