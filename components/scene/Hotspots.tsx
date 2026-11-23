"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { hotspots } from "@/lib/content";
import { scrollState } from "@/lib/store";

function Hotspot({ h }: { h: (typeof hotspots)[number] }) {
  const el = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useFrame(() => {
    if (!el.current) return;
    const p = scrollState.cameraSmooth;
    const [a, b] = h.range;
    const fade = 0.03;
    const v = Math.min(Math.max((p - a) / fade, 0), 1) * Math.min(Math.max((b - p) / fade, 0), 1);
    el.current.style.opacity = String(v);
    el.current.style.transform = `scale(${0.6 + v * 0.4})`;
    el.current.style.pointerEvents = v > 0.5 ? "auto" : "none";
  });

  return (
    <Html position={h.position} center zIndexRange={[20, 0]}>
      <div ref={el} className="relative" style={{ opacity: 0 }}>
        <button
          type="button"
          data-cursor="Open"
          aria-label={`${h.label}: ${h.detail}`}
          onPointerEnter={() => setOpen(true)}
          onPointerLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={() => setOpen((o) => !o)}
          className="group relative flex h-9 w-9 items-center justify-center"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-white/70 [animation-duration:2.4s]" />
          <span className="relative h-3 w-3 rounded-full border-2 border-white bg-pool shadow-[0_0_0_6px_rgba(255,255,255,0.35)]" />
        </button>
        <div
          className="pointer-events-none absolute left-11 top-1/2 w-max -translate-y-1/2 rounded-full bg-white/85 px-4 py-2 text-sm backdrop-blur-md transition-all duration-500 ease-out-expo"
          style={{
            opacity: open ? 1 : 0,
            transform: `translateY(-50%) translateX(${open ? 0 : -8}px)`,
            clipPath: open ? "inset(0 0 0 0 round 999px)" : "inset(0 100% 0 0 round 999px)",
          }}
        >
          <span className="font-medium text-slate">{h.label}</span>
          <span className="ml-2 text-slate/60">{h.detail}</span>
        </div>
      </div>
    </Html>
  );
}

export default function Hotspots() {
  return (
    <>
      {hotspots.map((h) => (
        <Hotspot key={h.label} h={h} />
      ))}
    </>
  );
}
