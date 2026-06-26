import { useState, useEffect } from "react";
import { getWhatsAppLink } from "@/lib/whatsapp";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Destinations", href: "#destinations" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center transition-all duration-300 ${
          scrolled
            ? "bg-warm-white border-b border-[#e0ddd5]"
            : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-[1140px] mx-auto px-6 flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`font-serif text-xl font-medium tracking-tight transition-colors ${
              scrolled ? "text-charcoal" : "text-light-primary"
            }`}
          >
            ATLAS
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-[13px] font-normal tracking-[1.5px] uppercase transition-colors hover:opacity-70 ${
                  scrolled ? "text-charcoal" : "text-light-primary"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center h-[42px] px-5 rounded-full bg-lime text-charcoal text-[13px] font-normal tracking-[1.5px] uppercase hover:scale-[1.02] hover:shadow-md transition-all duration-200"
          >
            Message Fidel
          </a>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex flex-col gap-[6px] p-2"
            aria-label="Open menu"
          >
            <span
              className={`block w-5 h-[2px] transition-colors ${
                scrolled ? "bg-charcoal" : "bg-light-primary"
              }`}
            />
            <span
              className={`block w-5 h-[2px] transition-colors ${
                scrolled ? "bg-charcoal" : "bg-light-primary"
              }`}
            />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-warm-white flex flex-col items-center justify-center gap-8 animate-in fade-in duration-300">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-6 text-charcoal text-3xl font-light"
            aria-label="Close menu"
          >
            &times;
          </button>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-serif text-[32px] text-charcoal hover:opacity-70 transition-opacity"
            >
              {link.label}
            </a>
          ))}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center h-[48px] px-6 rounded-full bg-lime text-charcoal text-[13px] font-normal tracking-[1.5px] uppercase"
          >
            Message Fidel on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
