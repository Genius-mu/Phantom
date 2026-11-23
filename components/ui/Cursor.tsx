"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Two-part cursor: a precise dot and a lagging ring.
 * Any element with data-cursor="Label" expands the ring and shows the label.
 * Links/buttons without a label just grow the ring.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<"idle" | "hover" | "label">("idle");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setLabel(labelled.dataset.cursor || "");
        setMode("label");
        return;
      }
      if (t.closest("a, button, [role='button'], input, textarea")) {
        setMode("hover");
        return;
      }
      setMode("idle");
    };

    const down = () => gsap.to(ring.current, { scale: 0.85, duration: 0.15 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" });
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, [enabled]);

  if (!enabled) return null; // touch devices keep the native behaviour

  const size = mode === "label" ? 92 : mode === "hover" ? 56 : 34;

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-[100] ${mode === "label" ? "" : "mix-blend-difference"}`}>
      <div
        ref={ring}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-500 ease-out-expo"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderColor: mode === "label" ? "transparent" : "rgba(255,255,255,0.7)",
          backgroundColor: mode === "label" ? "#ffffff" : mode === "hover" ? "rgba(255,255,255,0.18)" : "transparent",
        }}
      >
        <span
          className="text-[13px] font-semibold text-slate transition-opacity duration-300"
          style={{ opacity: mode === "label" ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-white transition-opacity"
        style={{ opacity: mode === "label" ? 0 : 1 }}
      />
    </div>
  );
}
