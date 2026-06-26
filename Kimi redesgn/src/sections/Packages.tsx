import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getPackageWhatsAppLink } from "@/lib/whatsapp";

const packages = [
  {
    price: "$60",
    label: "PER SESSION",
    title: "Lima Arrival Package",
    bullets: [
      "Private airport pickup",
      "WhatsApp support from landing",
      "Restaurant recommendations for your first night",
      "Optional: guided evening intro to the city",
    ],
    cta: "Get This Package",
    message: "Lima Arrival Package",
  },
  {
    price: "Custom",
    label: "PER GROUP",
    title: "Bachelor Party — Full Weekend",
    bullets: [
      "Private van + dedicated driver",
      "Restaurant reservations & nightlife planning",
      "VIP venue coordination",
      "Daytime activity suggestions",
      "Single point of contact all weekend",
    ],
    cta: "Plan a Bachelor Party",
    message: "Bachelor Party — Full Weekend",
  },
  {
    price: "Custom",
    label: "PER TRIP",
    title: "Peru First-Timer Week",
    bullets: [
      "Lima → Cusco → Machu Picchu logistics",
      "Private transport between cities",
      "Curated accommodations",
      "Local guide coordination in each city",
      "WhatsApp support throughout",
    ],
    cta: "Plan My Week",
    message: "Peru First-Timer Week",
  },
];

export default function Packages() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });
  const cardsRef = useScrollReveal<HTMLDivElement>({
    scale: 0.95,
    opacity: 0,
    duration: 0.9,
    stagger: 0.2,
    childSelector: ".package-card",
  });

  return (
    <section className="w-full bg-charcoal py-[80px] md:py-[140px]">
      <div className="max-w-[1140px] mx-auto px-6">
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-light-primary/60 mb-4">
            STARTER PACKAGES
          </p>
          <h2 className="font-serif text-[36px] md:text-[56px] font-normal leading-[1.05] tracking-[-1.5px] text-light-primary max-w-[700px] mx-auto">
            Popular ways to get started with Atlas.
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
        >
          {packages.map((pkg) => (
            <div
              key={pkg.title}
              className="package-card bg-charcoal/50 border border-light-primary/20 rounded-2xl p-8 md:p-10 hover:border-light-primary/40 transition-all duration-300"
            >
              <div className="mb-6">
                <p className="font-serif text-[36px] md:text-[40px] font-normal leading-[1.15] tracking-[-1px] text-teal">
                  {pkg.price}
                </p>
                <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted mt-1">
                  {pkg.label}
                </p>
              </div>

              <h4 className="font-serif text-[22px] md:text-[24px] font-normal leading-[1.3] tracking-[-0.5px] text-light-primary mb-5">
                {pkg.title}
              </h4>

              <ul className="space-y-2.5 mb-8">
                {pkg.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-[15px] font-light leading-[1.6] text-light-primary/60"
                  >
                    {b}
                  </li>
                ))}
              </ul>

              <a
                href={getPackageWhatsAppLink(pkg.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-[40px] px-6 rounded-full bg-lime text-charcoal text-[13px] font-normal tracking-[1.5px] uppercase hover:scale-[1.02] transition-transform duration-200"
              >
                {pkg.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
