import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Users, User, Heart } from "lucide-react";

const cards = [
  {
    icon: Users,
    title: "Groups & Bachelor Parties",
    body: "Coordination for groups of 4–12. Transport, restaurants, nightlife logistics, and a single point of contact so nothing falls through the cracks.",
  },
  {
    icon: User,
    title: "Solo Travelers & First-Timers",
    body: "Landing alone in a new country can feel overwhelming. Atlas handles the logistics so you can focus on enjoying Lima, Cusco, or Rio.",
  },
  {
    icon: Heart,
    title: "Couples & Private Trips",
    body: "Honeymooners and couples who want privacy, curated experiences, and zero hassle. Discreet, personal, and stress-free.",
  },
];

export default function WhoIsItFor() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });
  const cardsRef = useScrollReveal<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    childSelector: ".audience-card",
  });

  return (
    <section className="w-full bg-light-primary py-[80px] md:py-[140px]">
      <div className="max-w-[1140px] mx-auto px-6">
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted mb-4">
            WHO WE HELP
          </p>
          <h2 className="font-serif text-[36px] md:text-[56px] font-normal leading-[1.05] tracking-[-1.5px] text-charcoal max-w-[700px] mx-auto">
            Built for travelers who want a smooth trip.
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {cards.map((card) => (
            <div
              key={card.title}
              className="audience-card bg-pure-white border border-[#e0ddd5] rounded-xl p-8 md:p-10 hover:-translate-y-1 hover:shadow-card transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-light-primary flex items-center justify-center mb-6">
                <card.icon className="w-8 h-8 text-teal" strokeWidth={1.5} />
              </div>
              <h4 className="font-serif text-[22px] md:text-[28px] font-normal leading-[1.3] tracking-[-0.5px] text-charcoal mb-4">
                {card.title}
              </h4>
              <p className="text-[16px] font-light leading-[1.7] text-charcoal/80">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
