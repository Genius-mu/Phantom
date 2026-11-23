"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { app, pointer, scrollState } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    app.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Always start at the top so the intro + camera path line up.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!app.reducedMotion) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
      lenis.stop(); // released by the preloader
      app.lenis = lenis;
      lenis.on("scroll", (l: Lenis) => {
        scrollState.velocity = l.velocity;
        ScrollTrigger.update();
      });
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Recalculate pins/ranges once webfonts change text metrics, and after the intro.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onIntro = () => ScrollTrigger.refresh();
    window.addEventListener("intro:start", onIntro);

    return () => {
      window.removeEventListener("intro:start", onIntro);
      window.removeEventListener("pointermove", onMove);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      app.lenis = null;
    };
  }, []);

  return <>{children}</>;
}
