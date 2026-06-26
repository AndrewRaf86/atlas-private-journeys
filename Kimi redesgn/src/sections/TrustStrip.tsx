import { useScrollReveal } from "@/hooks/useScrollReveal";

const items = [
  "Airport Pickup",
  "Private Transport",
  "Nightlife Planning",
  "Group Trips",
  "Bachelor Parties",
  "Custom Itineraries",
];

export default function TrustStrip() {
  const ref = useScrollReveal<HTMLDivElement>({
    y: 8,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    childSelector: ".trust-item",
  });

  return (
    <section className="w-full bg-charcoal h-auto md:h-[56px] py-4 md:py-0">
      <div
        ref={ref}
        className="max-w-[1140px] mx-auto px-6 h-full flex flex-wrap md:flex-nowrap items-center justify-center gap-x-3 gap-y-2 md:gap-12"
      >
        {items.map((item, i) => (
          <span key={item} className="trust-item flex items-center gap-3">
            <span className="text-[11px] font-normal tracking-[1.5px] uppercase text-light-primary/60">
              {item}
            </span>
            {i < items.length - 1 && (
              <span className="hidden md:inline text-[#969188]">·</span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
