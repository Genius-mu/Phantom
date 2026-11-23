"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { app, pointer, scrollState, scrollToId } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    app.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo(0, 0);

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!app.reducedMotion) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
      // Only the home page has a preloader; it releases scrolling when done.
      if (window.location.pathname === "/" && !app.introPlayed) lenis.stop();
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

  // Route changes: start at the top (or at #hash), then re-measure triggers.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    app.lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      if (hash) scrollToId(hash);
    }, 350);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return <>{children}</>;
}
