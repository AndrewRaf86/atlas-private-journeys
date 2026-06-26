import FractalShader from "@/components/FractalShader";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden">
      <FractalShader />

      <div className="relative z-10 flex flex-col justify-end min-h-[100dvh] px-6 sm:px-10 lg:px-16 pb-16 sm:pb-20">
        <div className="max-w-[600px]">
          <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-[#969188] mb-5">
            YOUR TRUSTED LOCAL
          </p>

          <h1 className="font-serif text-[42px] sm:text-[64px] lg:text-[96px] font-normal leading-[1.0] tracking-[-2px] text-light-primary mb-6">
            Private travel in Peru and Brazil, handled start to finish.
          </h1>

          <p className="text-[16px] sm:text-[18px] font-light leading-[1.65] text-light-primary/70 max-w-[520px] mb-8">
            Airport pickups, local guides, nightlife planning, and custom
            itineraries. One reliable contact from landing to departure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-[48px] px-7 rounded-full bg-lime text-charcoal text-[13px] font-normal tracking-[1.5px] uppercase hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
            >
              Message Fidel on WhatsApp
            </a>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("#services")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center h-[48px] px-7 rounded-full border border-light-primary/40 text-light-primary text-[13px] font-normal tracking-[1.5px] uppercase hover:bg-light-primary/10 transition-all duration-200"
            >
              See What Atlas Handles
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-[1px] h-[40px] bg-light-primary/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-light-primary/80 animate-scroll rounded-full" />
        </div>
      </div>
    </section>
  );
}
