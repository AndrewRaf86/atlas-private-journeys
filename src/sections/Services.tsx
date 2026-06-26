import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Plane, MapPin, Wine, Route } from "lucide-react";

const services = [
  {
    icon: Plane,
    title: "Airport Pickup",
    body: "Private, punctual pickup from Lima's Jorge Chávez International. No taxis, no guesswork, no waiting. Your driver is there when you land.",
    tag: "From $60",
    photo: "/assets/van-transfer.jpeg",
  },
  {
    icon: MapPin,
    title: "Private Guide & Local Coordination",
    body: "A local who knows the city, speaks the language, and handles the details — restaurant reservations, venue entry, route planning.",
    photo: "/assets/tour-guide-friends.jpeg",
  },
  {
    icon: Wine,
    title: "Nightlife & Restaurants",
    body: "Curated nights out in Lima, Cusco, Rio, and São Paulo. VIP tables, safe venues, and local spots you won't find in guidebooks.",
    photo: "/assets/group-eating.png",
  },
  {
    icon: Route,
    title: "Custom Trip Planning",
    body: "Multi-city itineraries across Peru and Brazil. Transport between destinations, accommodation guidance, and day-by-day structure.",
    photo: "/assets/peru-desert-fun.jpeg",
  },
];

export default function Services() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });
  const gridRef = useScrollReveal<HTMLDivElement>({
    y: 60,
    duration: 0.8,
    stagger: 0.15,
    childSelector: ".service-card",
  });

  return (
    <section id="services" className="w-full bg-warm-white py-[80px] md:py-[140px]">
      <div className="max-w-[1140px] mx-auto px-6">
        <div ref={headerRef} className="mb-12 md:mb-16">
          <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted mb-4">
            WHAT ATLAS HANDLES
          </p>
          <h2 className="font-serif text-[36px] md:text-[56px] font-normal leading-[1.05] tracking-[-1.5px] text-charcoal max-w-[600px]">
            Services designed around real travel friction.
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {services.map((s) => (
            <div
              key={s.title}
              className="service-card bg-pure-white border border-[#D9CFBE] rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-card transition-all duration-300"
            >
              {s.photo && (
                <div className="h-[180px] overflow-hidden">
                  <img
                    src={s.photo}
                    alt={s.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-8 md:p-10">
                <div className="w-12 h-12 rounded-full bg-light-primary flex items-center justify-center mb-5">
                  <s.icon className="w-6 h-6 text-teal" strokeWidth={1.5} />
                </div>
                <h4 className="font-serif text-[22px] md:text-[28px] font-normal leading-[1.3] tracking-[-0.5px] text-charcoal mb-4">
                  {s.title}
                </h4>
                <p className="text-[16px] font-light leading-[1.7] text-charcoal/80 mb-4">
                  {s.body}
                </p>
                {s.tag && (
                  <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted">
                    {s.tag}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
