import Chiffres from "@/components/Chiffres";
import Faq from "@/components/Faq";
import FooterContact from "@/components/FooterContact";
import Methode from "@/components/Methode";
import NoyauHero from "@/components/NoyauHero";
import Offres from "@/components/Offres";
import SchemaStudio from "@/components/SchemaStudio";
import ServicesRows from "@/components/ServicesRows";
import Strip from "@/components/Strip";
import Studio from "@/components/Studio";

/**
 * L ACCUEIL N A PAS DE `generateMetadata` : son titre et sa description sont
 * ceux du layout (app/(site)/layout.tsx), sans montant (docs/agents/copy/
 * meta.md). Le seul prix du site, la mise en place, se lit dans la page :
 * hero (temps 3), (05) L offre et la FAQ, avec sa mention de TVA.
 */

/**
 * Rendu a chaque requete, volontairement.
 *
 * NoyauHero, Offres et Faq sont des Server Components async qui lisent le
 * montant de la mise en place dans Postgres. Sans ce force-dynamic, Next
 * prerendrait la page au build :
 *  - le montant serait fige au moment du build, alors que tout l'interet est
 *    que le site lise la base ;
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
 * Ce qui a ete fait a la place : une seule lecture Postgres par requete
 * (lib/catalogue.ts, memoisee). Le montant reste lu a chaque requete, donc
 * toujours exact — aucune invalidation a tenir.
 */
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      {/* Donnee structuree du studio. N emet qu un <script> : aucun pixel. */}
      <SchemaStudio />
      <NoyauHero locale="fr" />
      {/* .page-body est OPAQUE, et doit le rester : le noyau est une scene
          position:fixed peinte derriere le contenu (cf. app/noyau.css). Sans
          fond ici, il transparaitrait sous toutes les sections suivantes. */}
      {/* ORDRE DES SECTIONS (docs/agents/copy/accueil.md §0, plus les
          chiffres du 25.10.2026) : (01) Les chiffres, (02) Par metier,
          (03) Comment ca se passe, (04) Le controle, (05) L offre,
          (06) Questions, (07) Contact. Les chiffres suivent la bande parce
          qu ils prouvent la douleur qu elle nomme (voir components/
          Chiffres.tsx). Chaque composant porte son badge en dur ; un
          reordonnancement les renumerote. La numerotation du menu
          (components/MenuOverlay.tsx) est une autre suite.
          `locale="fr"` est ecrite, comme `locale="en"` dans la page jumelle :
          une page qui connait sa langue la dit. */}
      <div className="page-body">
        <Strip locale="fr" />
        <Chiffres locale="fr" />
        <ServicesRows locale="fr" />
        <Methode locale="fr" />
        <Studio locale="fr" />
        <Offres locale="fr" />
        <Faq locale="fr" />
        <FooterContact indexSection="07" locale="fr" />
      </div>
    </>
  );
}
