# Ilé — 3D scroll real estate site

Next.js 16 · React Three Fiber · GSAP ScrollTrigger · Lenis · Motion · Tailwind v4

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. Deploys to Vercel as-is.

## What happens on the page

| Scroll range | Camera (3D) | DOM |
|---|---|---|
| Preloader | compiles scene | counter 0→100, panel lifts |
| Intro | dollies in from far away | headline letters rise, nav drops in |
| Hero → Story (`#journey`) | flies over pool → living glass → timber tower → aerial | 3 captions synced to the camera, hotspots fade in on the model |
| Listings (`#homes`) | parked aerial (hidden behind) | section pins, cards slide sideways, tilt + glare + image parallax on hover |
| Marquee | — | neighbourhood names, speed + skew react to scroll velocity |
| Finale (`#finale`) | swings back to ground level | **day turns to dusk**, interior + pool lights come on |

Mouse: camera parallax everywhere, custom cursor with labels (`data-cursor="View"`), magnetic buttons, hover hotspots, 3D card tilt.

## Listing pages

Every card in **Available now** opens `/homes/[slug]` (`app/homes/[slug]/page.tsx` → `components/listing/ListingDetail.tsx`):
hero with the name in block type, key facts (price, beds, baths, built-up area, plot, title document, completion, parking, service charge, power),
description, **falling feature tags** (matter.js physics — drag them, or press Shake), a drag/lightbox gallery, map + nearby places,
payment plan and paperwork, a booking form with WhatsApp/call links, and a link to the next home.
All listing data lives in `lib/content.ts` and is placeholder — replace with the client's verified details.

## Type

Headings use `.display` (Bricolage Grotesque 800) with `.metal` (white-to-silver fill) and `.lift` (soft shadow for legibility over footage), defined in `app/globals.css`.
Put `.metal` on the element that holds the text — for per-letter animations, on each letter.

## Where things live

```
lib/content.ts            ← ALL copy: brand, captions, hotspots, listings
lib/store.ts              ← shared mutable state (scroll → 3D bridge, no re-renders)
components/scene/
  Experience.tsx          ← Canvas, post-processing (N8AO ambient occlusion), perf scaling
  Villa.tsx               ← procedural house model + dusk lighting
  Landscape.tsx           ← lawn, swaying trees, hedges, path
  Lighting.tsx            ← sun, studio environment (no HDR download), day→dusk colours
  CameraRig.tsx           ← camera keyframes (KEYS) + mouse parallax + intro dolly
components/sections/      ← Hero, Story, Listings, Marquee, Finale
components/ui/            ← SmoothScroll (Lenis+GSAP), Cursor, Magnetic, Preloader, Nav
```

## Customising

- **Copy / listings / prices:** `lib/content.ts`. Listing images are Unsplash placeholders — replace with the client's photos (put them in `/public` and use `/photo.jpg`).
- **Camera path:** edit `KEYS` in `CameraRig.tsx`. `at` must line up with `captions[].at` and `hotspots[].range` in content.ts.
- **Use the client's real 3D model:** export a `.glb` (Blender/SketchUp → glTF), put it in `/public/villa.glb`, and replace `<Villa />` with drei's `<Gltf src="/villa.glb" castShadow receiveShadow />`. Re-tune `KEYS` to frame it. Compress with `npx gltfjsx villa.glb --transform`.
- **Colours / fonts:** `@theme` in `app/globals.css`, fonts in `app/layout.tsx`. Scene colours are in `Lighting.tsx` (DAY_BG / DUSK_BG) and `Villa.tsx` materials.
- **Booking form:** `Finale.tsx` → wire `onSubmit` to your API route / Formspree / WhatsApp link.

## Performance & accessibility

- `PerformanceMonitor` drops DPR and disables post-processing on slow GPUs.
- Custom cursor only on fine pointers; touch devices keep native behaviour.
- `prefers-reduced-motion`: Lenis off, camera snaps instead of gliding, no horizontal pin, no marquee.
- Hotspots are real buttons (keyboard focusable, labelled).
