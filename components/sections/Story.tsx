"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { captions } from "@/lib/content";
import { scrollState } from "@/lib/store";

/**
 * A tall, mostly empty scroll track. Its progress (together with the hero)
 * drives the camera along the villa; captions are synced to the *smoothed*
 * camera value so text and 3D always agree.
 */
export default function Story() {
  const layer = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#journey",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollState.camera = self.progress * 0.8;
      },
    });

    const items = layer.current ? Array.from(layer.current.querySelectorAll<HTMLElement>("[data-cap]")) : [];
    const tick = () => {
      const p = scrollState.cameraSmooth;
      items.forEach((el, i) => {
        const d = (p - captions[i].at) / 0.075; // -1..1 within window
        const v = Math.max(0, 1 - Math.abs(d));
        const eased = v * v * (3 - 2 * v);
        el.style.opacity = String(eased);
        el.style.transform = `translate3d(0, ${d * -40}px, 0)`;
        el.style.filter = `blur(${(1 - eased) * 8}px)`;
      });
      if (bar.current) {
        const prog = Math.min(Math.max((p - 0.12) / 0.68, 0), 1);
        bar.current.style.transform = `scaleY(${prog})`;
      }
    };
    gsap.ticker.add(tick);
    return () => {
      st.kill();
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <section className="relative h-[520vh]" aria-label="Tour of the house">
      <div ref={layer} className="sticky top-0 flex h-[100svh] items-center px-6 md:px-10">
        {captions.map((c, i) => (
          <p
            key={c.text}
            data-cap
            className={`display absolute max-w-[9ch] text-[13vw] font-medium will-change-transform md:text-[6.5vw] ${
              i % 2 ? "right-6 text-right md:right-10" : "left-6 md:left-10"
            }`}
            style={{ opacity: 0 }}
          >
            {c.text}
          </p>
        ))}

        {/* slim progress rail */}
        <div className="absolute right-6 top-1/2 hidden h-32 w-px -translate-y-1/2 bg-slate/15 md:right-10 md:block">
          <div ref={bar} className="h-full w-full origin-top bg-slate" style={{ transform: "scaleY(0)" }} />
        </div>
      </div>
    </section>
  );
}
