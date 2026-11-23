"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CHAPTERS, getFrame, startLoading, type Size } from "@/lib/frames";
import { hotspots } from "@/lib/content";
import { app, pointer, scrollState } from "@/lib/store";

const OVERLAP = 0.12; // share of a chapter used to dissolve into the next
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** frame index of chapter j at playhead P (chapters overlap during dissolves) */
function chapterFrame(j: number, P: number) {
  const start = j === 0 ? 0 : j - OVERLAP;
  return clamp01((P - start) / (j + 1 - start)) * (CHAPTERS[j].count - 1);
}

function interpKeys(keys: [number, number, number][], f: number): [number, number] {
  if (f <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let k = 0; k < keys.length - 1; k++) {
    const [f0, x0, y0] = keys[k];
    const [f1, x1, y1] = keys[k + 1];
    if (f <= f1) {
      const t = (f - f0) / (f1 - f0);
      return [lerp(x0, x1, t), lerp(y0, y1, t)];
    }
  }
  const last = keys[keys.length - 1];
  return [last[1], last[2]];
}

function Hotspot({ h, i }: { h: (typeof hotspots)[number]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div data-hotspot={i} className="absolute left-0 top-0 will-change-transform" style={{ opacity: 0, pointerEvents: "none" }}>
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <button
          type="button"
          data-cursor="Open"
          aria-label={`${h.label}: ${h.detail}`}
          onPointerEnter={() => setOpen(true)}
          onPointerLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={() => setOpen((o) => !o)}
          className="relative flex h-10 w-10 items-center justify-center"
        >
          <span className="absolute inset-1 animate-ping rounded-full bg-white/70 [animation-duration:2.4s]" />
          <span className="relative h-3 w-3 rounded-full border-2 border-white bg-pool shadow-[0_0_0_6px_rgba(255,255,255,0.35)]" />
        </button>
        <div
          className="pointer-events-none absolute left-12 top-1/2 w-max rounded-full bg-white/85 px-4 py-2 text-sm backdrop-blur-md transition-all duration-500 ease-out-expo"
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
    </div>
  );
}

/**
 * Fixed full-screen stage that scrubs the villa footage with scroll.
 * Reads scrollState.camera (0–0.8 flythrough, 0.8–1 finale) and scrollState.dusk.
 */
export default function FrameStage() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const dusk = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d", { alpha: false })!;
    const size: Size =
      window.innerWidth < 900 || (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
        ? "sm"
        : "lg";

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = "high";
      last = "";
    };

    startLoading(size, () => {
      app.sceneReady = true;
      window.dispatchEvent(new Event("scene:ready"));
    });

    const spots = layer.current ? Array.from(layer.current.querySelectorAll<HTMLElement>("[data-hotspot]")) : [];

    // cover-fit rect with a per-chapter horizontal focal point (matters on portrait phones)
    const rect = (img: HTMLImageElement, focusX: number) => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const s = Math.max(w / iw, h / ih);
      const dw = iw * s;
      const dh = ih * s;
      const dx = Math.min(0, Math.max(w - dw, w / 2 - focusX * dw));
      const dy = (h - dh) / 2;
      return { dx, dy, dw, dh };
    };

    const st = { p: 0, mx: 0, my: 0 };
    let last = "";

    const tick = (_t: number, dtMs: number) => {
      const dt = Math.min(dtMs / 1000, 1 / 30);
      const k = app.reducedMotion ? 30 : 4;
      st.p += (scrollState.camera - st.p) * (1 - Math.exp(-k * dt));
      st.mx += (pointer.x - st.mx) * (1 - Math.exp(-3 * dt));
      st.my += (pointer.y - st.my) * (1 - Math.exp(-3 * dt));
      scrollState.cameraSmooth = st.p;

      // ── what to draw ──
      let chA = 0;
      let fA = 0;
      let chB = -1;
      let fB = 0;
      let mix = 0;
      if (st.p <= 0.8) {
        const P = Math.min((st.p / 0.8) * CHAPTERS.length, CHAPTERS.length - 1e-4);
        chA = Math.min(Math.floor(P), CHAPTERS.length - 1);
        fA = chapterFrame(chA, P);
        const nxt = chA + 1;
        if (nxt < CHAPTERS.length && P > nxt - OVERLAP) {
          chB = nxt;
          fB = chapterFrame(nxt, P);
          mix = smooth((P - (nxt - OVERLAP)) / OVERLAP);
        }
      } else {
        // finale: pull back out along the first clip while dusk falls
        const f = clamp01((st.p - 0.8) / 0.2);
        chA = 0;
        fA = (1 - f) * (CHAPTERS[0].count - 1);
      }

      const key = `${chA}:${Math.round(fA)}:${chB}:${Math.round(fB)}:${mix.toFixed(2)}`;
      if (key !== last) {
        const a = getFrame(chA, fA);
        if (a) {
          ctx.globalAlpha = 1;
          const r = rect(a, CHAPTERS[chA].focusX);
          ctx.drawImage(a, r.dx, r.dy, r.dw, r.dh);
          if (chB >= 0 && mix > 0.001) {
            const b = getFrame(chB, fB);
            if (b) {
              const rb = rect(b, CHAPTERS[chB].focusX);
              ctx.globalAlpha = mix;
              ctx.drawImage(b, rb.dx, rb.dy, rb.dw, rb.dh);
              ctx.globalAlpha = 1;
            }
          }
          last = key;
        }
      }

      // ── hotspots follow the footage ──
      const dominant = mix > 0.5 ? chB : chA;
      const domFrame = mix > 0.5 ? fB : fA;
      const ref = getFrame(dominant, domFrame);
      spots.forEach((el, i) => {
        const hs = hotspots[i];
        let v = 0;
        if (ref && st.p <= 0.8 && hs.chapter === dominant) {
          const [a0, a1] = hs.range;
          v = clamp01((domFrame - a0) / 6) * clamp01((a1 - domFrame) / 6);
          const [x, y] = interpKeys(hs.keys, domFrame);
          const r = rect(ref, CHAPTERS[dominant].focusX);
          const sx = r.dx + x * r.dw;
          const sy = r.dy + y * r.dh;
          if (sx < 24 || sx > w - 24) v = 0;
          el.style.transform = `translate3d(${sx}px, ${sy}px, 0) scale(${0.6 + v * 0.4})`;
        }
        el.style.opacity = String(v);
        el.style.pointerEvents = v > 0.5 ? "auto" : "none";
      });

      // ── camera feel: intro, dissolve push, mouse parallax ──
      const intro = 1 - scrollState.intro;
      const pulse = Math.sin(mix * Math.PI);
      const par = app.reducedMotion ? 0 : 1;
      const scale = 1.08 + intro * 0.18 + pulse * 0.04;
      const tx = -st.mx * 16 * par;
      const ty = st.my * 10 * par;
      if (stage.current) {
        stage.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale}) rotateY(${st.mx * 1.2 * par}deg) rotateX(${st.my * 0.8 * par}deg)`;
      }

      // ── dusk grade (finale) ──
      const d = scrollState.dusk;
      const blur = pulse * 6 + intro * 14;
      cv.style.filter = `blur(${blur.toFixed(2)}px) brightness(${(1 - 0.32 * d).toFixed(3)}) saturate(${(1 + 0.2 * d).toFixed(3)}) sepia(${(0.22 * d).toFixed(3)}) hue-rotate(${(-8 * d).toFixed(1)}deg)`;
      if (dusk.current) dusk.current.style.opacity = String(d);
      if (glow.current) glow.current.style.opacity = String(smooth(clamp01((d - 0.3) / 0.7)));

      if (sheen.current && par) {
        const px = (st.mx * 0.5 + 0.5) * 100;
        const py = (-st.my * 0.5 + 0.5) * 100;
        sheen.current.style.background = `radial-gradient(600px circle at ${px}% ${py}%, rgba(255,255,255,${0.14 * (1 - d)}), transparent 60%)`;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-mist [perspective:1400px]" role="img" aria-label="Film of a modern villa with a lap pool">
      <div ref={stage} className="absolute inset-0 origin-center will-change-transform">
        <canvas ref={canvas} className="absolute inset-0 block" />
        {/* dusk sky + shadow wash */}
        <div
          ref={dusk}
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            opacity: 0,
            background:
              "linear-gradient(180deg, rgba(196,150,214,0.55) 0%, rgba(255,176,128,0.35) 38%, rgba(40,52,92,0.45) 100%)",
          }}
        />
        {/* warm light from the glass */}
        <div
          ref={glow}
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            opacity: 0,
            background:
              "radial-gradient(40% 28% at 32% 66%, rgba(255,190,120,0.55), transparent 70%), radial-gradient(30% 20% at 50% 88%, rgba(110,225,230,0.35), transparent 70%)",
          }}
        />
        <div ref={layer} className="absolute inset-0">
          {hotspots.map((h, i) => (
            <Hotspot key={h.label} h={h} i={i} />
          ))}
        </div>
      </div>
      <div ref={sheen} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
      {/* keeps light text-free areas readable over bright footage */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-mist/70 to-transparent" />
    </div>
  );
}
