"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { listings, type Listing } from "@/lib/content";

function Card({ l, index }: { l: Listing; index: number }) {
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
    <Link
      ref={ref}
      href={`/homes/${l.slug}`}
      data-cursor="View"
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="listing-card group block w-[80vw] shrink-0 md:w-[38vw]"
      style={{ perspective: 1000 }}
      aria-label={`${l.name}, ${l.area}. ${l.beds} bedrooms, ${l.size}, ${l.price}. View details`}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-white/5 md:aspect-[5/6]"
      >
        <motion.img
          src={l.image}
          alt=""
          loading="lazy"
          draggable={false}
          style={{ x: imgX, y: imgY, scale: 1.12 }}
          className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 group-hover:saturate-[1.1]"
        />
        <motion.div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: glare }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate/80 to-transparent" />

        <div className="absolute left-5 top-5 flex gap-2">
          <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate">{l.price}</span>
          <span className="rounded-full bg-slate/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">{l.status}</span>
        </div>

        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white/80">{l.area}</p>
            <h3 className="display metal mt-1 text-4xl md:text-5xl">{l.name}</h3>
          </div>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-slate transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg] group-hover:scale-110">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </motion.div>

      <div className="mt-5 flex items-baseline justify-between gap-4 text-sm text-white/70">
        <span>
          {l.type}, {l.beds} bedrooms, {l.size}
        </span>
        <span className="tabular-nums text-white/40">
          {String(index + 1).padStart(2, "0")}/{String(listings.length).padStart(2, "0")}
        </span>
      </div>
    </Link>
  );
}

/**
 * Vertical scroll → horizontal travel. The section pins while the track
 * slides. Each card opens its home's detail page.
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
    <section id="homes" ref={section} className="relative overflow-hidden bg-slate" aria-label="Available homes">
      <div className="flex h-[100svh] flex-col justify-center">
        <div className="mb-10 flex flex-col gap-4 px-6 md:flex-row md:items-end md:justify-between md:px-10">
          <h2 className="display metal text-[13vw] md:text-[6vw]">Available now</h2>
          <p className="max-w-[34ch] text-sm leading-relaxed text-white/70 md:text-base">
            {listings.length} homes, each with its title, service charge and payment plan listed up front. Open one to see everything.
          </p>
        </div>
        <div
          ref={track}
          className="flex w-max gap-6 px-6 will-change-transform md:gap-10 md:px-10 motion-reduce:w-full motion-reduce:overflow-x-auto"
        >
          {listings.map((l, i) => (
            <Card key={l.slug} l={l} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
