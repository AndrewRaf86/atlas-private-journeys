import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What exactly does Atlas do?",
    a: "Atlas provides private local support for travelers visiting Peru and Brazil. This includes airport pickups, private transport, nightlife planning, restaurant reservations, custom itineraries, and real-time WhatsApp coordination. Think of it as having a trusted local friend who handles the logistics.",
  },
  {
    q: "Is this just a tour company?",
    a: "No. Atlas is not a tour operator and does not sell packaged group tours. It's a personal coordination service — one local contact who arranges private transport, guides, venues, and support tailored to your specific trip.",
  },
  {
    q: "Do you work with bachelor parties?",
    a: "Yes. Atlas coordinates bachelor parties and group trips with a focus on safety, logistics, and smooth execution. This includes private transport, venue coordination, restaurant reservations, and having a single point of contact for the entire group.",
  },
  {
    q: "Is Lima safe for tourists?",
    a: "Like any major city, Lima has safe areas and areas to avoid. Atlas operates exclusively in well-vetted, safe neighborhoods and with trusted local drivers. You are never left to figure out transport or navigation alone.",
  },
  {
    q: "How does payment work?",
    a: "After an initial WhatsApp consultation to understand your trip, Atlas provides a clear scope of services and pricing. Payment is typically arranged via secure transfer before your arrival. Everything is agreed upon upfront — no hidden fees.",
  },
  {
    q: "Can you help with airport pickup?",
    a: "Yes. Airport pickup is one of Atlas's core services. Your driver meets you at Jorge Chávez International in Lima (or your arrival airport in Brazil) and takes you directly to your accommodation. No taxi lines, no confusion.",
  },
  {
    q: "Can you help with nightlife?",
    a: "Yes. Atlas plans and coordinates nights out at safe, vetted venues across Lima, Cusco, Rio, and São Paulo. This includes VIP table reservations, guest list coordination, and local guidance on timing and dress codes.",
  },
  {
    q: "Do you plan Brazil trips too?",
    a: "Yes. Atlas operates in Rio de Janeiro and São Paulo with the same services: airport pickup, private transport, local coordination, nightlife planning, and custom itineraries.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });
  const listRef = useScrollReveal<HTMLDivElement>({
    y: 20,
    duration: 0.5,
    stagger: 0.06,
    childSelector: ".faq-item",
  });

  return (
    <section id="faq" className="w-full bg-light-primary py-[80px] md:py-[140px]">
      <div className="max-w-[800px] mx-auto px-6">
        <div ref={headerRef} className="text-center mb-10 md:mb-14">
          <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted mb-4">
            FAQ
          </p>
          <h2 className="font-serif text-[36px] md:text-[56px] font-normal leading-[1.05] tracking-[-1.5px] text-charcoal">
            Common Questions
          </h2>
        </div>

        <div ref={listRef} className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="faq-item bg-pure-white border border-[#e0ddd5] rounded-[10px] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 md:px-8 py-5 md:py-6 text-left"
              >
                <h4 className="font-serif text-[17px] md:text-[20px] font-normal leading-[1.3] tracking-[-0.3px] text-charcoal pr-4">
                  {faq.q}
                </h4>
                <ChevronDown
                  className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-out"
                style={{
                  maxHeight: openIndex === i ? "300px" : "0px",
                  opacity: openIndex === i ? 1 : 0,
                }}
              >
                <p className="px-6 md:px-8 pb-5 md:pb-6 text-[15px] font-light leading-[1.7] text-text-muted">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
