import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  scale?: number;
  childSelector?: string;
  start?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 40,
      x = 0,
      opacity = 0,
      duration = 0.7,
      delay = 0,
      stagger = 0.1,
      ease = "power3.out",
      scale,
      childSelector,
      start = "top 85%",
    } = options;

    const targets = childSelector
      ? el.querySelectorAll(childSelector)
      : el;

    const fromVars: gsap.TweenVars = {
      y,
      x,
      opacity,
      duration,
      delay,
      ease,
    };

    if (scale !== undefined) {
      fromVars.scale = scale;
    }

    if (childSelector && targets instanceof NodeList && targets.length > 1) {
      fromVars.stagger = stagger;
    }

    const tween = gsap.from(targets, {
      ...fromVars,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  return ref;
}
