import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />

      {/* ================= TEMP — A RETIRER EN B6 =================
          Bloc de hauteur provisoire. Sans page plus longue que la fenetre, ni le
          scroll inertiel (translate3d sur #smooth) ni les reveals
          (IntersectionObserver) ne sont observables. Le <p data-reveal> sert de
          temoin : il doit passer de opacity:0/translateY(34px) a visible en
          entrant dans le viewport. Remplace par les vraies sections en B5-B6. */}
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
