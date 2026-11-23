"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { listings } from "@/lib/content";

type Listing = (typeof listings)[number];

function Card({ l }: { l: Listing }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 140, damping: 18 });
  const sy = useSpring(my, { stiffness: 140, damping: 18 });
  const rotY = useTransform(sx, [0, 1], [-7, 7]);
  const rotX = useTransform(sy, [0, 1], [6, -6]);
  const imgX = useTransform(sx, [0, 1], ["3%", "-3%"]);
  const imgY = useTransform(sy, [0, 1], ["3%", "-3%"]);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.35), transparent 55%)`;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <a
      ref={ref}
      href="#finale"
      data-cursor="View"
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="listing-card group block w-[78vw] shrink-0 md:w-[38vw]"
      style={{ perspective: 1000 }}
      aria-label={`${l.area}, ${l.beds} bedrooms, ${l.size}, ${l.price}`}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-stone md:aspect-[5/6]"
      >
        <motion.img
          src={l.image}
          alt=""
          loading="lazy"
          draggable={false}
          style={{ x: imgX, y: imgY, scale: 1.12 }}
          className="listing-img absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 group-hover:saturate-[1.1]"
        />
        <motion.div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: glare }} />

        {/* price chip slides in on hover */}
        <div className="absolute left-5 top-5 overflow-hidden rounded-full bg-white/80 backdrop-blur-md">
          <span className="block translate-y-full px-4 py-2 text-sm font-medium transition-transform duration-500 ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0">
            {l.price}
          </span>
        </div>
      </motion.div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="display text-4xl md:text-5xl">{l.area}</h3>
        <span className="shrink-0 text-sm text-slate/60">
          {l.beds} bed, {l.size}
        </span>
      </div>
    </a>
  );
}

/**
 * Vertical scroll → horizontal travel. The section pins while the track
 * slides; each card's image counter-moves for depth.
 */
export default function Listings() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(section.current ?? undefined);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const dist = () => (track.current ? track.current.scrollWidth - window.innerWidth : 0);
      const tween = gsap.to(track.current, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // reveal: cards rise from a clipped mask as the section enters
      gsap.from(".listing-card", {
        clipPath: "inset(100% 0 0 0)",
        y: 80,
        stagger: 0.08,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 75%" },
      });

      return () => tween.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="homes" ref={section} className="relative overflow-hidden bg-mist" aria-label="Available homes">
      <div className="flex h-[100svh] flex-col justify-center">
        <div className="mb-10 flex items-end justify-between px-6 md:px-10">
          <h2 className="display text-[12vw] font-semibold md:text-[6vw]">Available now</h2>
          <span className="hidden text-sm text-slate/60 md:block">{listings.length} homes</span>
        </div>
        <div ref={track} className="flex w-max gap-6 px-6 will-change-transform md:gap-10 md:px-10 motion-reduce:w-full motion-reduce:overflow-x-auto">
          {listings.map((l) => (
            <Card key={l.area} l={l} />
          ))}
        </div>
      </div>
    </section>
  );
}
