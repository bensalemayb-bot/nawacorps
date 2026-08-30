import CarteDuStudio from "@/components/CarteDuStudio";
import Faq from "@/components/Faq";
import FooterContact from "@/components/FooterContact";
import Methode from "@/components/Methode";
import NoyauHero from "@/components/NoyauHero";
import Offres from "@/components/Offres";
import SchemaStudio from "@/components/SchemaStudio";
import ServicesRows from "@/components/ServicesRows";
import Strip from "@/components/Strip";
import Studio from "@/components/Studio";
import Travaux from "@/components/Travaux";
import type { Metadata } from "next";
import { chargerCatalogue } from "@/lib/catalogue";
import { formatChfAmount } from "@/lib/format";

/**
 * DESCRIPTION DE L ACCUEIL — construite a chaque requete, prix compris.
 *
 * Le prix d entree est un signal fort dans un extrait Google pour une
 * prestation de service : il qualifie le clic avant meme la visite. Mais la
 * regle du depot interdit tout montant en dur, et une metadata statique ne
 * peut pas relire Postgres — le prix avait donc disparu de l extrait.
 *
 * `generateMetadata` sur une page deja `force-dynamic` s execute a la requete,
 * comme le reste de la page : le montant est toujours celui de la base.
 *
 * ELLE PASSE PAR chargerCatalogue(), ET SUREMENT PAS PAR UNE REQUETE A ELLE.
 * Une `prisma.service.findFirst` propre a cette fonction rouvrait une decision
 * deja mesuree et consignee plus bas : l accueil ne doit lire Postgres qu UNE
 * fois par requete. `chargerCatalogue()` est memoisee par le `cache()` de
 * React, donc la promesse est celle que Faq, Offres et CarteDuStudio attendent
 * deja — zero aller-retour en plus sur la page la plus visitee du site. Le prix
 * d entree se derive ensuite EN MEMOIRE, exactement comme le font NoyauHero et
 * Faq : la table tient en dix-huit lignes de quelques champs.
 *
 * LE `try` N EST PAS DECORATIF. L etage builder du Dockerfile n a pas de base ;
 * si Next tentait malgre tout de pre-generer cette metadata, une exception
 * ferait echouer le build entier — exactement le mode d echec qui a deja fait
 * abandonner l ISR ici. Sans base, on sert la meme phrase sans le prix.
 */
export async function generateMetadata(): Promise<Metadata> {
  const socle =
    "Nawa Corps refait le site des PME genevoises en une semaine : demande de devis, prise de rendez-vous, fiche Google. Vous n'avez rien à préparer.";
  try {
    const catalogue = await chargerCatalogue();
    const montants = catalogue
      .filter((s) => s.category === "principal")
      .map((s) => s.priceCents)
      .filter((cents): cents is number => cents !== null);
    // Base vide, formules masquees depuis /admin, toutes passees sur devis :
    // l extrait se referme sans le montant plutot que d en inventer un.
    if (montants.length === 0) return { description: socle };
    return {
      description: `${socle} Dès ${formatChfAmount(Math.min(...montants))}.–, TVA comprise.`,
    };
  } catch {
    return { description: socle };
  }
}

/**
 * Rendu a chaque requete, volontairement.
 *
 * Offres et CarteDuStudio sont des Server Components async qui lisent Postgres.
 * Sans ce force-dynamic, Next prerendrait la page au build :
 *  - les prix seraient figes au moment du build, alors que tout l'interet du
 *    bloc est que le site lise la base ;
 *  - et surtout `next build` reclamerait une base, or l'etage builder du
 *    Dockerfile n'en a aucune — le build de production echouerait.
 *
 * Cout assume : la page d'accueil perd l'optimisation statique.
 * Les deux pages legales, elles, ne lisent rien et restent statiques.
 *
 * CE COUT A ETE MESURE, et il est plus faible qu'il n'y parait — la question
 * est tranchee, ne la rouvrez pas sans nouvelle mesure. Sur `next build` +
 * `next start`, mediane de 15 requetes :
 *   - accueil en force-dynamic (2 lectures Postgres) : TTFB 17 ms
 *   - accueil prerendu en ISR (`revalidate`, zero Postgres) : TTFB 17 ms
 *   - page legale statique de 24 Ko : TTFB 4 ms
 * L'ecart entre les deux premieres tient dans le bruit ; ce qui separe 4 ms de
 * 17 ms, c'est le poids du HTML (92 Ko contre 24 Ko), pas la base.
 *
 * Le TTFB de 415 ms releve en mode developpement ne survit PAS a la
 * production : c'etait la compilation a la volee de `next dev`, pas Postgres.
 *
 * Et surtout, `export const revalidate` a ete essaye : `next build` echoue
 * (PrismaClientKnownRequestError P1001) des que la base est injoignable, ce
 * qui est precisement le cas de l'etage builder du Dockerfile. L'ISR ne
 * pourrait donc jamais prerendre cette page en production. Vingt millisecondes
 * ne valent pas une construction cassee.
 *
 * Ce qui a ete fait a la place : les deux lectures Postgres de cet ecran n'en
 * font plus qu'une (lib/catalogue.ts). Les prix restent lus a chaque requete,
 * donc toujours exacts — aucune invalidation a tenir.
 */
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      {/* Donnee structuree du studio. N emet qu un <script> : aucun pixel. */}
      <SchemaStudio />
      <NoyauHero />
      {/* .page-body est OPAQUE, et doit le rester : le noyau est une scene
          position:fixed peinte derriere le contenu (cf. app/noyau.css). Sans
          fond ici, il transparaitrait sous toutes les sections suivantes. */}
      {/* ORDRE DES SECTIONS — deux raisons, qui vont dans le meme sens.

          1. LE VERT EST CONTIGU. Trois sections portent .green : Offres, la
             carte du studio et le pied de page. Dans l'ordre precedent, Methode
             / Studio / Faq s'inseraient entre les deux premieres et le pied de
             page : le vert apparaissait donc en DEUX blocs separes par du
             beige. Regroupees, elles forment un seul aplat qui ferme la page.

          2. LES OBJECTIONS PASSENT AVANT LE PRIX. La FAQ repondait apres la
             grille tarifaire, c'est-a-dire apres le moment ou le visiteur
             decide. Une objection traitee apres la decision ne sert plus a
             rien. La revue de persuasion l'avait signale, la porte G2 l'avait
             laissee en question ouverte : elle est tranchee ici.

          Aucune section n'est modifiee, seul leur ordre change. Les ancres de
          la nav (#services, #offres, #methode, #contact) restent valides. */}
      <div className="page-body">
        <Travaux />
        <Strip />
        <ServicesRows />
        <Methode />
        <Studio />
        <Faq />
        <Offres />
        <CarteDuStudio />
        <FooterContact />
      </div>
    </>
  );
}
