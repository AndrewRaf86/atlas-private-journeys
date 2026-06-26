import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CheckCircle } from "lucide-react";

const items = [
  "Real name and direct WhatsApp communication — no anonymous accounts.",
  "Private, vetted transport with trusted local drivers.",
  "Clear scope and pricing before any payment.",
  "Local support during your trip, not just before.",
  "No tourist traps, no random taxis, no surprises.",
];

export default function SafetyTrust() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 20, duration: 0.5 });
  const listRef = useScrollReveal<HTMLDivElement>({
    y: 30,
    duration: 0.6,
    stagger: 0.08,
    childSelector: ".trust-row",
  });

  return (
    <section className="w-full bg-charcoal py-[80px] md:py-[100px]">
      <div className="max-w-[800px] mx-auto px-6">
        <div ref={headerRef} className="text-center mb-10">
          <h3 className="font-serif text-[32px] md:text-[40px] font-normal leading-[1.15] tracking-[-1px] text-light-primary">
            Safety & Trust
          </h3>
        </div>

        <div ref={listRef} className="max-w-[600px] mx-auto space-y-5">
          {items.map((item) => (
            <div
              key={item}
              className="trust-row flex items-start gap-4"
            >
              <CheckCircle
                className="w-6 h-6 text-lime flex-shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <p className="text-[16px] font-light leading-[1.7] text-light-primary/80">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
