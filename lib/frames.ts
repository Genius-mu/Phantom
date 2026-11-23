/**
 * Frame-sequence loader. Each chapter is one video clip exported as WebP frames
 * (public/frames/{lg|sm}/s{n}/001.webp …). Loading is progressive:
 * chapter 1 completely first, then every chapter at stride 8 → 4 → 2 → 1,
 * so the whole scroll is usable early and sharpens as frames arrive.
 */

export const CHAPTERS = [
  { key: "s1", count: 95, focusX: 0.42 }, // approach across the lawn
  { key: "s2", count: 95, focusX: 0.5 }, // low along the pool
  { key: "s3", count: 95, focusX: 0.58 }, // toward the glass living room
  { key: "s4", count: 95, focusX: 0.4 }, // orbit of the timber tower
];

export type Size = "lg" | "sm";

const store: (HTMLImageElement | null)[][] = CHAPTERS.map((c) => Array(c.count).fill(null));
let started = false;

export function frameUrl(size: Size, ch: number, i: number) {
  return `/frames/${size}/${CHAPTERS[ch].key}/${String(i + 1).padStart(3, "0")}.webp`;
}

/** Nearest loaded frame to `i` in chapter `ch` (searches outward). */
export function getFrame(ch: number, i: number): HTMLImageElement | null {
  const arr = store[ch];
  const idx = Math.max(0, Math.min(arr.length - 1, Math.round(i)));
  if (arr[idx]) return arr[idx];
  for (let d = 1; d < arr.length; d++) {
    if (arr[idx - d]) return arr[idx - d];
    if (arr[idx + d]) return arr[idx + d];
  }
  return null;
}

export function startLoading(size: Size, onFirstReady: () => void, onProgress?: (p: number) => void) {
  if (started) return;
  started = true;

  // Build a priority queue without duplicates.
  const seen = new Set<string>();
  const queue: [number, number][] = [];
  const push = (ch: number, i: number) => {
    const k = `${ch}:${i}`;
    if (seen.has(k)) return;
    seen.add(k);
    queue.push([ch, i]);
  };
  for (let i = 0; i < CHAPTERS[0].count; i++) push(0, i);
  const firstBatch = queue.length;
  for (const stride of [8, 4, 2, 1]) {
    CHAPTERS.forEach((c, ch) => {
      for (let i = 0; i < c.count; i += stride) push(ch, i);
      push(ch, c.count - 1);
    });
  }

  const total = queue.length;
  let done = 0;
  let firstFired = false;
  let cursor = 0;
  const CONCURRENCY = 6;

  const next = () => {
    if (cursor >= queue.length) return;
    const [ch, i] = queue[cursor++];
    const img = new Image();
    img.decoding = "async";
    img.src = frameUrl(size, ch, i);
    const finish = () => {
      done++;
      onProgress?.(done / total);
      if (!firstFired && done >= firstBatch) {
        firstFired = true;
        onFirstReady();
      }
      next();
    };
    img
      .decode()
      .then(() => {
        store[ch][i] = img;
      })
      .catch(() => {})
      .finally(finish);
  };
  for (let k = 0; k < CONCURRENCY; k++) next();
}
