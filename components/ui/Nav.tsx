"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { brand } from "@/lib/content";
import { scrollToId } from "@/lib/store";

export default function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.set(ref.current, { yPercent: -120 });
    const show = () => gsap.to(ref.current, { yPercent: 0, duration: 1.2, delay: 0.6, ease: "expo.out" });
    window.addEventListener("intro:start", show);
    return () => window.removeEventListener("intro:start", show);
  }, []);

  const link = "relative py-1 after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-slate after:transition-transform after:duration-500 after:ease-out-expo hover:after:origin-left hover:after:scale-x-100";

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <button onClick={() => scrollToId("journey")} className="display text-2xl" aria-label={`${brand.name}, back to top`}>
        {brand.name}
      </button>
      <nav className="flex gap-6 text-sm md:gap-9">
        <button className={link} onClick={() => scrollToId("homes")}>Homes</button>
        <button className={link} onClick={() => scrollToId("finale")}>Book a viewing</button>
      </nav>
    </header>
  );
}
