/** All client-facing copy lives here. Swap freely. */

export const brand = {
  name: "Ilé",
  tagline: "Homes worth the view.",
  phone: "+234 800 000 0000",
  email: "viewings@ile.estate",
  city: "Lagos",
};

/**
 * Captions shown during the flythrough. `at` = camera position (0..1).
 * Chapters 2–4 are centred at 0.3, 0.5 and 0.7.
 */
export const captions = [
  { at: 0.3, text: "Water at the doorstep." },
  { at: 0.5, text: "Light from every side." },
  { at: 0.7, text: "Room to breathe." },
];

/**
 * Pins that track features in the footage.
 * `chapter` = clip index (0-based), `range` = frames where the pin shows,
 * `keys` = [frame, x, y] with x/y as 0..1 of the video frame — positions are
 * interpolated between keys. Re-map these if you replace the footage.
 */
export const hotspots: {
  label: string;
  detail: string;
  chapter: number;
  range: [number, number];
  keys: [number, number, number][];
}[] = [
  { label: "Lap pool", detail: "25 m, heated", chapter: 1, range: [22, 78], keys: [[30, 0.55, 0.76], [50, 0.52, 0.73], [70, 0.48, 0.76]] },
  { label: "Primary suite", detail: "Private terrace", chapter: 1, range: [22, 78], keys: [[30, 0.56, 0.3], [70, 0.56, 0.3]] },
  { label: "Open-plan living", detail: "Kitchen opens to the pool", chapter: 2, range: [42, 82], keys: [[50, 0.53, 0.55], [70, 0.61, 0.55], [90, 0.69, 0.55]] },
  { label: "Timber tower", detail: "Stair to the roof terrace", chapter: 3, range: [15, 75], keys: [[20, 0.28, 0.32], [45, 0.3, 0.36], [70, 0.25, 0.36]] },
];

export const listings = [
  {
    area: "Banana Island",
    beds: 6,
    size: "1,450 m²",
    price: "₦4.2B",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80",
  },
  {
    area: "Ikoyi",
    beds: 5,
    size: "980 m²",
    price: "₦2.8B",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
  },
  {
    area: "Eko Atlantic",
    beds: 4,
    size: "620 m²",
    price: "₦1.9B",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    area: "Lekki Phase 1",
    beds: 5,
    size: "860 m²",
    price: "₦1.4B",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    area: "Victoria Island",
    beds: 3,
    size: "410 m²",
    price: "₦980M",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
  },
];

export const neighbourhoods = ["Ikoyi", "Banana Island", "Eko Atlantic", "Lekki", "Victoria Island", "Oniru"];
