"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { intro } from "@/lib/content";

/** Statement section: the paragraph lights up word by word as you scroll through it. */
export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".intro-word",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".intro-body", start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
      gsap.from(".intro-fact", {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".intro-facts", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-slate px-6 py-[18vh] md:px-10" aria-labelledby="intro-heading">
      <h2 id="intro-heading" className="display metal max-w-[14ch] text-[13vw] md:text-[6.5vw]">
        {intro.heading}
      </h2>

      <p className="intro-body mt-12 max-w-[30ch] text-[7vw] font-medium leading-[1.2] tracking-tight text-white md:ml-[30%] md:mt-20 md:text-[2.9vw]">
        {intro.body.split(" ").map((w, i) => (
          <span key={i} className="intro-word">
            {w}{" "}
          </span>
        ))}
      </p>

      <div className="intro-facts mt-20 grid gap-10 border-t border-white/15 pt-10 md:ml-[30%] md:mt-28 md:grid-cols-3">
        {intro.facts.map((f) => (
          <div key={f.title} className="intro-fact">
            <h3 className="display metal text-2xl md:text-3xl">{f.title}</h3>
            <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-white/70 md:text-base">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
