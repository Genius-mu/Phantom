"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { faqs } from "@/lib/content";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-slate px-6 py-[16vh] md:px-10" aria-labelledby="faq-heading">
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
        <div>
          <h2 id="faq-heading" className="display metal text-[13vw] md:text-[5.5vw]">
            Good questions
          </h2>
          <p className="mt-6 max-w-[32ch] text-base leading-relaxed text-white/70 md:text-lg">
            What buyers ask us most. Anything else, ask the agent on your viewing.
          </p>
        </div>

        <ul className="border-t border-white/15">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-white/15">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-lg font-semibold text-white md:text-xl">{f.q}</span>
                  <span
                    aria-hidden
                    className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 transition-colors duration-300"
                    style={{ backgroundColor: isOpen ? "#fff" : "transparent" }}
                  >
                    <span className="absolute h-[1.5px] w-3.5" style={{ backgroundColor: isOpen ? "#22302d" : "#fff" }} />
                    <span
                      className="absolute h-3.5 w-[1.5px] transition-transform duration-500 ease-out-expo"
                      style={{ backgroundColor: isOpen ? "#22302d" : "#fff", transform: `scaleY(${isOpen ? 0 : 1})` }}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false} onExitComplete={() => ScrollTrigger.refresh()}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                      onAnimationComplete={() => ScrollTrigger.refresh()}
                    >
                      <p className="max-w-[56ch] pb-7 text-base leading-relaxed text-white/75">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
