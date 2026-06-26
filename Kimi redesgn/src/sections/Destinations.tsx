import { useScrollReveal } from "@/hooks/useScrollReveal";

const peruDests = [
  { name: "Lima", image: "/assets/dest-lima.jpg" },
  { name: "Cusco", image: "/assets/dest-cusco.jpg" },
  { name: "Huacachina", image: "/assets/dest-huacachina.jpg" },
  { name: "Machu Picchu", image: "/assets/dest-machupicchu.jpg" },
];

const brazilDests = [
  { name: "Rio de Janeiro", image: "/assets/dest-rio.jpg" },
  { name: "São Paulo", image: "/assets/dest-saopaulo.jpg" },
];

export default function Destinations() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });
  const peruRef = useScrollReveal<HTMLDivElement>({
    x: -40,
    y: 0,
    duration: 0.8,
  });
  const brazilRef = useScrollReveal<HTMLDivElement>({
    x: 40,
    y: 0,
    duration: 0.8,
  });

  return (
    <section
      id="destinations"
      className="w-full bg-light-primary py-[80px] md:py-[140px]"
    >
      <div className="max-w-[1140px] mx-auto px-6">
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted mb-4">
            DESTINATIONS
          </p>
          <h2 className="font-serif text-[36px] md:text-[56px] font-normal leading-[1.05] tracking-[-1.5px] text-charcoal">
            Where Atlas Operates
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          <div ref={peruRef}>
            <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-teal mb-5">
              PERU
            </p>
            <div className="grid grid-cols-2 gap-3">
              {peruDests.map((d) => (
                <div
                  key={d.name}
                  className="relative overflow-hidden rounded-lg group cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <p className="absolute bottom-3 left-3 text-[14px] font-medium text-light-primary drop-shadow-lg">
                    {d.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div ref={brazilRef}>
            <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-teal mb-5">
              BRAZIL
            </p>
            <div className="space-y-3">
              {brazilDests.map((d) => (
                <div
                  key={d.name}
                  className="relative overflow-hidden rounded-lg group cursor-pointer"
                >
                  <div className="aspect-[16/7] overflow-hidden">
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <p className="absolute bottom-3 left-3 text-[14px] font-medium text-light-primary drop-shadow-lg">
                    {d.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
