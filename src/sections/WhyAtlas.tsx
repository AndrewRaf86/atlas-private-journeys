import { useEffect, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Shield, Clock, Users2, Map } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const points = [
  {
    icon: Shield,
    title: "Safety & Discretion",
    body: "Local knowledge of safe areas, trusted venues, and discreet service for high-profile travelers.",
  },
  {
    icon: Clock,
    title: "Real-Time Support",
    body: "One WhatsApp message away, before and during your trip. Problems get solved, not escalated.",
  },
  {
    icon: Users2,
    title: "Group Coordination",
    body: "Moving 6–12 people through a foreign city requires logistics apps simply don't handle.",
  },
  {
    icon: Map,
    title: "Local Access",
    body: "Venues, restaurants, and experiences that aren't listed online. Real local relationships open real doors.",
  },
];

export default function WhyAtlas() {
  const leftRef = useScrollReveal<HTMLDivElement>({ x: -40, y: 0, duration: 0.8 });
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rightRef.current) return;
    const tween = gsap.fromTo(
      rightRef.current,
      { x: 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rightRef.current,
          start: "top 85%",
        },
      }
    );

    const img = rightRef.current.querySelector("img");
    if (img) {
      gsap.to(img, {
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: rightRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section id="process" className="w-full bg-light-primary py-[80px] md:py-[140px]">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-start">
          <div ref={leftRef}>
            <p className="text-[11px] font-normal tracking-[1.5px] uppercase text-text-muted mb-4">
              WHY HIRE A PRIVATE LOCAL
            </p>
            <h2 className="font-serif text-[36px] md:text-[56px] font-normal leading-[1.05] tracking-[-1.5px] text-charcoal mb-6">
              What Atlas gives that booking apps cannot.
            </h2>
            <p className="text-[18px] font-light leading-[1.65] text-charcoal/80 mb-10">
              Apps can book a hotel. They can't tell you which neighborhood is
              actually safe at 2am. They can't coordinate a group of eight
              across three venues. They can't answer your WhatsApp when your
              flight lands early and your driver isn't there.
            </p>

            <div className="space-y-6">
              {points.map((p) => (
                <div key={p.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                    <p.icon className="w-5 h-5 text-teal" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-medium text-charcoal mb-1">
                      {p.title}
                    </h4>
                    <p className="text-[15px] font-light leading-[1.6] text-charcoal/70">
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={rightRef} className="relative overflow-hidden rounded-xl">
            <img
              src="/assets/why-atlas.jpg"
              alt="Lima, Peru coastline at golden hour"
              className="w-full h-[400px] md:h-[600px] object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
