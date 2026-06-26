import { getWhatsAppLink } from "@/lib/whatsapp";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Destinations", href: "#destinations" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

export default function Footer() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-charcoal pt-16 md:pt-20 pb-8 md:pb-10">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="font-serif text-[24px] font-normal tracking-tight text-light-primary mb-2">
              ATLAS
            </p>
            <p className="text-[14px] font-light text-text-muted">
              Private travel support in Peru and Brazil.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-[14px] font-light text-light-primary/60 hover:text-light-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-light text-light-primary/60 hover:text-light-primary transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="w-full h-[1px] bg-light-primary/10 my-8 md:my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted">
            &copy; 2026 Atlas Private Journeys. All rights reserved.
          </p>
          <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted">
            Lima, Peru &middot; Rio de Janeiro, Brazil
          </p>
        </div>
      </div>
    </footer>
  );
}
