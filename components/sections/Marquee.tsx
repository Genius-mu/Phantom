"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { neighbourhoods } from "@/lib/content";
import { app, scrollState } from "@/lib/store";

/** Neighbourhood names that drift on their own and surge/skew with scroll speed. */
export default function Marquee() {
  const row = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (app.reducedMotion) return;
    let x = 0;
    let skew = 0;
    const tick = (_t: number, dt: number) => {
      const el = row.current;
      if (!el) return;
      const half = el.scrollWidth / 2;
      const v = scrollState.velocity;
      x -= (0.04 + Math.abs(v) * 0.02) * dt * (v < 0 ? -1 : 1);
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      skew += (gsap.utils.clamp(-12, 12, v * -0.6) - skew) * 0.1;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const items = [...neighbourhoods, ...neighbourhoods];

  return (
    <section className="relative overflow-hidden bg-mist py-[12vh]" aria-label="Neighbourhoods we cover">
      <div ref={row} className="flex w-max will-change-transform">
        {items.map((n, i) => (
          <span key={i} className="display flex items-center whitespace-nowrap text-[14vw] font-light text-slate md:text-[9vw]" aria-hidden={i >= neighbourhoods.length}>
            {n}
            <span className="mx-[0.35em] inline-block h-[0.14em] w-[0.14em] rounded-full bg-pool" />
          </span>
        ))}
      </div>
    </section>
  );
}
