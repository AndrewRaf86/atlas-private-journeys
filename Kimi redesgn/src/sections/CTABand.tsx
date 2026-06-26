import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function CTABand() {
  const ref = useScrollReveal<HTMLDivElement>({
    y: 30,
    duration: 0.6,
    childSelector: ".cta-element",
    stagger: 0.1,
  });

  return (
    <section className="w-full bg-lime py-[80px] md:py-[100px]">
      <div ref={ref} className="max-w-[800px] mx-auto px-6 text-center">
        <h2 className="cta-element font-serif text-[36px] md:text-[56px] font-normal leading-[1.05] tracking-[-1.5px] text-charcoal mb-5">
          Ready to stop planning and start traveling?
        </h2>
        <p className="cta-element text-[16px] md:text-[18px] font-light leading-[1.65] text-charcoal/70 max-w-[560px] mx-auto mb-8">
          Message Fidel on WhatsApp with your dates, group size, and
          destination. You'll get a direct response with next steps.
        </p>
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-element inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-charcoal text-light-primary text-[13px] font-normal tracking-[1.5px] uppercase hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(36,36,34,0.2)] transition-all duration-200"
        >
          Message Fidel Now
        </a>
      </div>
    </section>
  );
}
