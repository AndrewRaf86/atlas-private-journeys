import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function MeetFidel() {
  const portraitRef = useScrollReveal<HTMLDivElement>({
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
  });
  const textRef = useScrollReveal<HTMLDivElement>({
    y: 30,
    duration: 0.7,
    stagger: 0.1,
    childSelector: ".fidel-text",
  });

  return (
    <section className="w-full bg-warm-white py-[80px] md:py-[140px]">
      <div className="max-w-[900px] mx-auto px-6 text-center">
        <div ref={portraitRef} className="mb-10">
          <div className="relative w-[200px] h-[200px] md:w-[240px] md:h-[240px] mx-auto">
            <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-teal/30 shadow-lg">
              <img
                src="/assets/fidel-portrait.jpg"
                alt="Fidel — Your local guide in Lima, Peru"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted mt-4">
            Fidel — Lima, Peru
          </p>
        </div>

        <div ref={textRef}>
          <h2 className="fidel-text font-serif text-[36px] md:text-[56px] font-normal leading-[1.05] tracking-[-1.5px] text-charcoal mb-6">
            Meet Fidel
          </h2>

          <p className="fidel-text text-[18px] font-light leading-[1.65] text-charcoal/80 mb-5">
            My name is Fidel. I'm based in Lima and help travelers from the US,
            Canada, the UK, and Europe plan smoother, safer trips in Peru and
            Brazil. Whether you're landing alone, planning a group trip, or
            organizing a bachelor party, I help with the local details that are
            hard to figure out from abroad.
          </p>

          <p className="fidel-text text-[16px] font-light leading-[1.7] text-charcoal/70 mb-10">
            I've spent years building relationships with the best drivers,
            venues, and guides across Lima, Cusco, Rio, and São Paulo. When you
            work with Atlas, you get direct access to me — not a booking
            platform, not a call center. One person, one WhatsApp number, start
            to finish.
          </p>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="fidel-text inline-flex items-center justify-center h-[48px] px-7 rounded-full bg-gold text-charcoal text-[13px] font-normal tracking-[1.5px] uppercase hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
          >
            Message Fidel Directly
          </a>
        </div>
      </div>
    </section>
  );
}
