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
