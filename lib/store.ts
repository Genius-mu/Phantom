import type Lenis from "lenis";

/**
 * Mutable, render-free shared state. The 3D scene reads it every frame,
 * DOM scroll triggers write to it. Nothing here triggers React re-renders.
 */
export const scrollState = {
  /** 0..1 target position along the camera path (written by ScrollTriggers) */
  camera: 0,
  /** smoothed camera value (written by the CameraRig, read by captions) */
  cameraSmooth: 0,
  /** 0 = day, 1 = dusk */
  dusk: 0,
  /** 0..1 intro dolly after the preloader */
  intro: 0,
  /** Lenis scroll velocity */
  velocity: 0,
};

/** Normalised pointer, -1..1 on both axes (y up) */
export const pointer = { x: 0, y: 0 };

export const app = {
  lenis: null as Lenis | null,
  sceneReady: false,
  /** true once the home intro has played (skip the preloader on return visits) */
  introPlayed: false,
  reducedMotion: false,
};

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (app.lenis) app.lenis.scrollTo(el, { duration: 2.2 });
  else el.scrollIntoView({ behavior: "smooth" });
}
