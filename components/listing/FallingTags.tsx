"use client";

import { useEffect, useRef } from "react";
import type Matter from "matter-js";

const LOOKS = [
  "bg-white text-slate",
  "bg-pool text-white",
  "border-2 border-white/70 text-white",
  "bg-[#d9d4c8] text-slate",
  "bg-[#a77c55] text-white",
];

/**
 * Feature tags that drop into a box with real physics when it scrolls into view.
 * Tags are DOM pills (crisp text, accessible); matter.js only moves them.
 * Drag them with the mouse, or press "Shake" to toss them again.
 */
export default function FallingTags({ tags }: { tags: string[] }) {
  const box = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-tag]"));
    let cleanup = () => {};
    let started = false;

    let disposed = false;
    const start = async () => {
      if (started) return;
      started = true;
      // Loaded on demand, in the browser only.
      const M = (await import("matter-js")).default;
      if (disposed) return;
      const { Engine, Runner, Bodies, Composite, Body, Mouse, MouseConstraint, Events } = M;

      const engine = Engine.create();
      engine.gravity.y = 1;
      engine.gravity.scale = 0.0011;

      const T = 400;
      let W = el.clientWidth;
      let H = el.clientHeight;
      const floor = Bodies.rectangle(W / 2, H + T / 2, W * 4, T, { isStatic: true });
      const left = Bodies.rectangle(-T / 2, 0, T, H * 6, { isStatic: true });
      const right = Bodies.rectangle(W + T / 2, 0, T, H * 6, { isStatic: true });
      Composite.add(engine.world, [floor, left, right]);

      const sizes = items.map((it) => ({ w: it.offsetWidth, h: it.offsetHeight }));
      const bodies = items.map((_, i) => {
        const { w, h } = sizes[i];
        const b = Bodies.rectangle(w / 2 + Math.random() * Math.max(1, W - w), -h - i * 60 - Math.random() * 140, w, h, {
          chamfer: { radius: h / 2 - 1 },
          restitution: 0.35,
          friction: 0.25,
          frictionAir: 0.012,
          density: 0.002,
        });
        Body.setAngle(b, (Math.random() - 0.5) * 0.9);
        return b;
      });
      Composite.add(engine.world, bodies);

      // Drag with the mouse (fine pointers only — keeps touch scrolling intact).
      let mouse: Matter.Mouse | null = null;
      if (window.matchMedia("(pointer: fine)").matches) {
        mouse = Mouse.create(el);
        // Matter blocks page scrolling on wheel by default — remove that.
        const wheel = (mouse as unknown as { mousewheel: EventListener }).mousewheel;
        ["wheel", "mousewheel", "DOMMouseScroll"].forEach((t) => el.removeEventListener(t, wheel));
        const mc = MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } },
        } as Matter.IMouseConstraintDefinition);
        Composite.add(engine.world, mc);
      }

      const sync = () => {
        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i];
          const { w, h } = sizes[i];
          items[i].style.transform = `translate3d(${b.position.x - w / 2}px, ${b.position.y - h / 2}px, 0) rotate(${b.angle}rad)`;
        }
      };
      Events.on(engine, "afterUpdate", sync);
      items.forEach((it) => (it.style.opacity = "1"));

      const runner = Runner.create();
      Runner.run(runner, engine);

      const onResize = () => {
        W = el.clientWidth;
        H = el.clientHeight;
        Body.setPosition(floor, { x: W / 2, y: H + T / 2 });
        Body.setPosition(right, { x: W + T / 2, y: 0 });
      };
      window.addEventListener("resize", onResize);

      shakeRef.current = () => {
        bodies.forEach((b) => {
          Body.setVelocity(b, { x: (Math.random() - 0.5) * 14, y: -10 - Math.random() * 10 });
          Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.3);
        });
      };

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        Events.off(engine, "afterUpdate", sync);
        Runner.stop(runner);
        if (mouse) Mouse.clearSourceEvents(mouse);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Static, readable layout instead of physics.
      el.classList.add("tags-static");
      items.forEach((it) => {
        it.style.opacity = "1";
        it.style.transform = "none";
      });
      return;
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      disposed = true;
      io.disconnect();
      cleanup();
    };
  }, [tags]);

  return (
    <div className="relative">
      <div
        ref={box}
        data-cursor="Drag"
        className="relative h-[420px] select-none overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.04] md:h-[480px] [&.tags-static]:flex [&.tags-static]:h-auto [&.tags-static]:flex-wrap [&.tags-static]:gap-2 [&.tags-static]:p-6"
        aria-label="Features"
        role="list"
      >
        {tags.map((t, i) => (
          <span
            key={t}
            data-tag
            role="listitem"
            className={`absolute left-0 top-0 whitespace-nowrap rounded-full px-5 py-3 text-base font-semibold will-change-transform md:px-6 md:text-lg [.tags-static_&]:static ${LOOKS[i % LOOKS.length]}`}
            style={{ opacity: 0, transform: "translate3d(-9999px,0,0)" }}
          >
            {t}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => shakeRef.current()}
        className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white hover:text-slate"
      >
        Shake
      </button>
    </div>
  );
}
