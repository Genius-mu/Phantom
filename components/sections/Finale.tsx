"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Magnetic from "@/components/ui/Magnetic";
import { brand } from "@/lib/content";
import { scrollState } from "@/lib/store";

/**
 * The camera swings back to ground level while day turns to dusk and the
 * house lights come on. One button, one action.
 */
export default function Finale() {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollState.camera = 0.8 + self.progress * 0.2;
        scrollState.dusk = gsap.parseEase("power1.inOut")(self.progress);
      },
    });
    const ctx = gsap.context(() => {
      gsap.from(".finale-line", {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".finale-title", start: "top 80%" },
      });
    }, root);
    return () => {
      st.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section id="finale" ref={root} className="pointer-events-none relative h-[220vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between px-6 pb-8 pt-28 md:px-10 md:pb-10">
        <div>
        <h2 className="finale-title display lift text-[16vw] md:text-[9vw]">
          <span className="block overflow-hidden">
            <span className="finale-line metal block">See it</span>
          </span>
          <span className="block overflow-hidden">
            <span className="finale-line metal block">in person.</span>
          </span>
        </h2>
        <p className="lift mt-6 max-w-[36ch] text-base font-medium leading-relaxed text-white md:text-lg">
          Leave your number and the home you&apos;d like to see. An agent calls you back within one working day to set a time.
        </p>
        </div>

        <div className="pointer-events-auto flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <form
            className="flex w-full max-w-md items-center gap-3 rounded-full bg-white/85 p-2 pl-6 backdrop-blur-md"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="phone" className="sr-only">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="Your phone number"
              className="min-w-0 flex-1 bg-transparent text-base text-slate outline-none placeholder:text-slate/50"
            />
            <Magnetic strength={0.25}>
              <button
                type="submit"
                className="rounded-full bg-slate px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-pool"
              >
                {sent ? "Request sent" : "Book a viewing"}
              </button>
            </Magnetic>
          </form>

          <div className="lift flex flex-col gap-3 text-sm font-medium text-white md:flex-row md:gap-10">
            <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="hover:text-pool">
              {brand.phone}
            </a>
            <a href={`mailto:${brand.email}`} className="hover:text-pool">
              {brand.email}
            </a>
          </div>
        </div>

        <p className="absolute bottom-3 left-6 text-xs text-white/70 md:left-10" aria-live="polite">
          {sent ? "Thanks. We'll call you within one working day to arrange a time." : `© ${new Date().getFullYear()} ${brand.name}`}
        </p>
      </div>
    </section>
  );
}
