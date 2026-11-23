"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion } from "motion/react";
import Magnetic from "@/components/ui/Magnetic";
import { brand } from "@/lib/content";
import { app, scrollToId } from "@/lib/store";

const LINES = ["Homes worth", "the view."];

export default function Hero() {
  const [go, setGo] = useState(false);
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (app.introPlayed) setGo(true);
    const start = () => setGo(true);
    window.addEventListener("intro:start", start);
    return () => window.removeEventListener("intro:start", start);
  }, []);

  // Headline drifts apart and fades as you start scrolling.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(title.current, {
        yPercent: -35,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: true },
      });
      gsap.to(".hero-fade", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "30% top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex h-[100svh] flex-col justify-end px-6 pb-8 md:px-10 md:pb-10">
      <h1 ref={title} className="display lift max-w-[12ch] text-[16vw] md:text-[9.5vw]" aria-label={brand.tagline}>
        {LINES.map((line, li) => (
          <span key={line} className="block overflow-hidden pb-[0.06em]" aria-hidden>
            {line.split("").map((ch, ci) => (
              <motion.span
                key={ci}
                className="metal inline-block whitespace-pre"
                initial={{ y: "110%", rotate: 6 }}
                animate={go ? { y: "0%", rotate: 0 } : undefined}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 + li * 0.12 + ci * 0.025 }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        ))}
      </h1>

      <div className="hero-fade">
      <motion.div
        className="mt-8 flex items-end justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={go ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="lift max-w-[34ch]">
          <p className="text-base font-medium leading-relaxed text-white md:text-lg">
            Private residences across {brand.city}, shown by appointment.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            Lagoon villas, garden flats and penthouses, each one visited, measured and title-checked before you see it.
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-6">
          <Magnetic>
            <button
              onClick={() => scrollToId("finale")}
              className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-slate transition-colors hover:bg-pool hover:text-white"
            >
              Book a viewing
            </button>
          </Magnetic>
          <span className="hidden items-center gap-3 text-sm text-white/80 md:flex">
            <span className="relative block h-10 w-[1.5px] overflow-hidden bg-white/25">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_2s_ease-in-out_infinite] bg-white" />
            </span>
            Scroll
          </span>
        </div>
      </motion.div>
      </div>

      <style>{`@keyframes scrollhint{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
