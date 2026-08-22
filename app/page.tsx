import Hero from "@/components/Hero";
import Travaux from "@/components/Travaux";

export default function Home() {
  return (
    <>
      <Hero />
      <Travaux />

      {/* ================= TEMP — A RETIRER EN B6 =================
          Bloc de hauteur provisoire. Il garde la page assez longue pour que le
          scroll inertiel (translate3d sur #smooth) et les reveals restent
          observables tant que les sections Services / Offres / Methode / Studio
          / FAQ / Contact n'existent pas. Remplace par ces sections en B6. */}
      <section data-temp style={{ minHeight: "150vh" }}>
        <div className="wrap">
          <p className="lede" data-reveal>
            TEMP — bloc de hauteur provisoire pour tester le scroll inertiel et
            les reveals. Retire au bloc B6.
          </p>
        </div>
      </section>
    </>
  );
}
