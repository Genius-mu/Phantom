"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { app, scrollState } from "@/lib/store";
import { brand } from "@/lib/content";

/**
 * Counts to 100 while the WebGL scene compiles, then lifts away and
 * starts the single orchestrated intro: camera dolly + headline rise.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const counter = { v: 0 };
    let ready = app.sceneReady;
    const onReady = () => (ready = true);
    window.addEventListener("scene:ready", onReady);

    // Climb to 90 on a timer, hold until the scene is ready, then finish.
    const climb = gsap.to(counter, {
      v: 90,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => setCount(Math.round(counter.v)),
    });

    let waitId = 0;
    const finish = () => {
      gsap.to(counter, {
        v: 100,
        duration: 0.4,
        ease: "power1.out",
        onUpdate: () => setCount(Math.round(counter.v)),
        onComplete: lift,
      });
    };
    const wait = () => {
      if (ready && !climb.isActive()) finish();
      else waitId = window.setTimeout(wait, 80);
    };
    // Fallback: never block longer than 12s on slow connections.
    const hardStop = window.setTimeout(() => (ready = true), 12000);
    wait();

    function lift() {
      const tl = gsap.timeline({
        onComplete: () => setGone(true),
      });
      tl.to(root.current, {
        yPercent: -100,
        duration: app.reducedMotion ? 0.01 : 1.1,
        ease: "expo.inOut",
      });
      tl.add(() => {
        window.dispatchEvent(new Event("intro:start"));
        app.lenis?.start();
      }, "-=0.55");
      tl.to(scrollState, { intro: 1, duration: app.reducedMotion ? 0.01 : 2.6, ease: "expo.out" }, "-=0.6");
    }

    return () => {
      window.removeEventListener("scene:ready", onReady);
      window.clearTimeout(waitId);
      window.clearTimeout(hardStop);
      climb.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-mist p-6 md:p-10"
      role="status"
      aria-label="Loading"
    >
      <span className="display text-2xl">{brand.name}</span>
      <div className="flex items-end justify-between">
        <span className="max-w-[16ch] text-sm text-slate/60">Preparing the house</span>
        <span className="display tabular-nums text-[22vw] leading-none md:text-[14vw]">{count}</span>
      </div>
      <div className="absolute bottom-0 left-0 h-[3px] bg-pool" style={{ width: `${count}%` }} />
    </div>
  );
}
