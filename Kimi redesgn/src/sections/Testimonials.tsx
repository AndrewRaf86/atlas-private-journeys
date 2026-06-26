import { useScrollReveal } from "@/hooks/useScrollReveal";

const placeholders = [
  {
    quote:
      "Testimonial from a past client will appear here. This is a placeholder for future reviews.",
    name: "Client Name",
  },
  {
    quote:
      "Testimonial from a past client will appear here. This is a placeholder for future reviews.",
    name: "Client Name",
  },
  {
    quote:
      "Testimonial from a past client will appear here. This is a placeholder for future reviews.",
    name: "Client Name",
  },
];

export default function Testimonials() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 20, duration: 0.5 });
  const cardsRef = useScrollReveal<HTMLDivElement>({
    y: 30,
    duration: 0.6,
    stagger: 0.12,
    childSelector: ".testimonial-card",
  });

  return (
    <section className="w-full bg-warm-white py-[80px] md:py-[100px]">
      <div className="max-w-[900px] mx-auto px-6">
        <div ref={headerRef} className="text-center mb-10">
          <h3 className="font-serif text-[32px] md:text-[40px] font-normal leading-[1.15] tracking-[-1px] text-charcoal">
            What Travelers Say
          </h3>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
        >
          {placeholders.map((t, i) => (
            <div
              key={i}
              className="testimonial-card bg-pure-white border border-dashed border-[#e0ddd5]/80 rounded-xl p-7 md:p-8"
            >
              <p className="font-serif text-[36px] leading-none text-text-muted/30 mb-4">
                &ldquo;
              </p>
              <p className="text-[15px] font-light italic leading-[1.7] text-charcoal/70 mb-5">
                {t.quote}
              </p>
              <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted">
                — {t.name}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted/60 mt-8">
          Testimonials coming soon — first client trips in progress.
        </p>
      </div>
    </section>
  );
}
