"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { process } from "@/lib/content";

/** The buying steps. A line draws across as you scroll and each step lights up when reached. */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 65%", end: "bottom 70%", scrub: true },
      });
      tl.fromTo(".process-line", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
      gsap.utils.toArray<HTMLElement>(".process-step").forEach((el, i, all) => {
        tl.fromTo(el, { opacity: 0.25 }, { opacity: 1, duration: 0.15, ease: "none" }, (i / all.length) * 0.9);
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-slate px-6 pb-[16vh] pt-[6vh] md:px-10" aria-labelledby="process-heading">
      <h2 id="process-heading" className="display metal text-[13vw] md:text-[6vw]">
        How buying works
      </h2>
      <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-white/70 md:text-lg">
        Four steps from first look to keys, with someone from our team at each one.
      </p>

      <div className="relative mt-16 md:mt-24">
        <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-white/15 md:block">
          <div className="process-line h-full origin-left bg-white" />
        </div>
        <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
          {process.map((step, i) => (
            <li key={step.title} className="process-step relative">
              <span className="relative z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-bold text-slate">
                {i + 1}
              </span>
              <h3 className="display metal mt-6 text-3xl md:text-[2.4vw]">{step.title}</h3>
              <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-white/70 md:text-base">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
