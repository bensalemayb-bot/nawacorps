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
      <div className="page-body">
        <Travaux />
        <Strip />
        <ServicesRows />
        <Offres />
        <CarteDuStudio />
        <Methode />
        <Studio />
        <Faq />
        <FooterContact />
      </div>
    </>
  );
}
