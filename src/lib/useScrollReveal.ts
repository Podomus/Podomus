"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface UseScrollRevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const items = el.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    gsap.set(items, { autoAlpha: 0, y: options.y ?? 30 });

    const st = ScrollTrigger.batch(items, {
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: options.duration ?? 0.7,
          ease: "power3.out",
          stagger: options.stagger ?? 0.08,
          overwrite: true,
        }),
      start: options.start ?? "top 88%",
      once: options.once ?? true,
    });

    return () => {
      st.forEach((t) => t.kill());
      gsap.set(items, { clearProps: "all" });
    };
  }, [options.y, options.duration, options.stagger, options.start, options.once]);

  return ref;
}
