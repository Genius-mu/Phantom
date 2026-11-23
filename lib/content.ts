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
  { at: 0.3, text: "Water at the doorstep.", sub: "Pools, terraces and gardens you step straight into." },
  { at: 0.5, text: "Light from every side.", sub: "Glass walls, deep shade, rooms that stay cool." },
  { at: 0.7, text: "Room to breathe.", sub: "Generous plots in Lagos' quietest streets." },
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

/**
 * Listing data. Everything below is PLACEHOLDER content — replace prices,
 * sizes, titles and photos with the client's real, verified details.
 */
export type Listing = {
  slug: string;
  name: string;
  area: string;
  district: string;
  type: string;
  status: string;
  price: string;
  beds: number;
  baths: number;
  size: string;
  plot: string;
  completion: string;
  parking: string;
  title: string;
  serviceCharge: string;
  paymentPlan: string;
  power: string;
  summary: string;
  description: string[];
  features: string[];
  nearby: [string, string][];
  image: string;
  gallery: string[];
  mapQuery: string;
};

const u = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const EXT = {
  a: "photo-1613490493576-7fde63acd811",
  b: "photo-1600596542815-ffad4c1539a9",
  c: "photo-1600585154340-be6161a56a0c",
  d: "photo-1600607687939-ce8a6c25118c",
  e: "photo-1512917774080-9991f1c4c750",
};
const INT = {
  living: "photo-1600210492486-724fe5c67fb0",
  kitchen: "photo-1600566753190-17f0baa2a6c3",
  kitchen2: "photo-1600607687920-4e2a09cf159d",
  exterior2: "photo-1600585154526-990dced4db0d",
};

export const listings: Listing[] = [
  {
    slug: "the-lagoon-house",
    name: "The Lagoon House",
    area: "Banana Island",
    district: "Ikoyi, Lagos",
    type: "Detached villa",
    status: "For sale",
    price: "₦4.2B",
    beds: 6,
    baths: 7,
    size: "1,450 m²",
    plot: "2,100 m²",
    completion: "Completed 2025",
    parking: "4 cars + visitor bays",
    title: "Certificate of Occupancy",
    serviceCharge: "₦18M per year",
    paymentPlan: "40% deposit, balance within 6 months",
    power: "Estate power, 150 kVA backup, solar",
    summary: "A lagoon-front villa with its own jetty, built around a 25 m pool.",
    description: [
      "The Lagoon House sits on one of the last waterfront plots on Banana Island. The ground floor opens fully to the terrace, so the living room, kitchen and pool read as one long space facing the water.",
      "Upstairs, five en-suite bedrooms share a timber-screened gallery. The primary suite has its own lagoon terrace, a dressing room and a bath under a skylight. A timber stair tower leads to the roof terrace.",
    ],
    features: ["Lagoon frontage", "Private jetty", "25 m pool", "Cinema room", "Elevator", "Smart home", "Gym", "Roof terrace", "Staff quarters", "Water treatment", "Solar + inverter", "24/7 security"],
    nearby: [["Ikoyi Club 1938", "8 min"], ["Falomo Shopping Centre", "10 min"], ["Lekki–Ikoyi Link Bridge", "12 min"], ["Lagos airport (MMIA)", "45 min"]],
    image: u(EXT.a),
    gallery: [u(EXT.a), u(INT.living), u(INT.kitchen), u(INT.exterior2)],
    mapQuery: "Banana Island, Ikoyi, Lagos",
  },
  {
    slug: "bourdillon-residence",
    name: "Bourdillon Residence",
    area: "Ikoyi",
    district: "Old Ikoyi, Lagos",
    type: "Detached house",
    status: "For sale",
    price: "₦2.8B",
    beds: 5,
    baths: 6,
    size: "980 m²",
    plot: "1,500 m²",
    completion: "Completed 2024",
    parking: "3 cars",
    title: "Governor's Consent",
    serviceCharge: "₦9.5M per year",
    paymentPlan: "50% deposit, balance within 3 months",
    power: "Dedicated transformer, 100 kVA backup",
    summary: "A quiet, tree-lined family house a short walk from Bourdillon Road.",
    description: [
      "Set back behind mature mango and almond trees, the house is planned around a central courtyard that keeps every room bright and cross-ventilated.",
      "Five bedrooms sit on the upper floor, with a family lounge between them. The ground floor has formal and informal living rooms, a show kitchen with a separate working kitchen, and a guest suite.",
    ],
    features: ["Courtyard garden", "Show kitchen", "Working kitchen", "Guest suite", "Family lounge", "Study", "Pool", "Boys' quarters", "Borehole", "CCTV"],
    nearby: [["Bourdillon Road", "2 min"], ["Ikoyi Club 1938", "6 min"], ["Falomo Shopping Centre", "8 min"], ["Victoria Island", "15 min"]],
    image: u(EXT.b),
    gallery: [u(EXT.b), u(INT.kitchen2), u(INT.living), u(EXT.c)],
    mapQuery: "Bourdillon Road, Ikoyi, Lagos",
  },
  {
    slug: "ocean-terrace",
    name: "Ocean Terrace",
    area: "Eko Atlantic",
    district: "Eko Atlantic City, Lagos",
    type: "Penthouse apartment",
    status: "Off-plan, ready Q4 2027",
    price: "₦1.9B",
    beds: 4,
    baths: 5,
    size: "620 m²",
    plot: "—",
    completion: "Q4 2027",
    parking: "2 cars",
    title: "Certificate of Occupancy (development)",
    serviceCharge: "₦7M per year (estimated)",
    paymentPlan: "30% deposit, balance over 24 months",
    power: "Independent city power grid",
    summary: "A full-floor penthouse with a wraparound terrace over the Atlantic.",
    description: [
      "Ocean Terrace takes the entire top floor of a 22-storey tower on the Eko Atlantic waterfront, with uninterrupted ocean views to the south and the Lagos skyline to the north.",
      "A 140 m² wraparound terrace runs around the living spaces. Buyers on the payment plan can choose finishes from three palettes until the structure tops out.",
    ],
    features: ["Full-floor plan", "Ocean views", "Wraparound terrace", "Private lift lobby", "Concierge", "Residents' pool", "Gym", "Independent power", "Choice of finishes"],
    nearby: [["Eko Atlantic marina", "3 min"], ["Victoria Island", "8 min"], ["Ikoyi", "15 min"], ["Lagos airport (MMIA)", "40 min"]],
    image: u(EXT.c),
    gallery: [u(EXT.c), u(INT.living), u(INT.kitchen), u(EXT.a)],
    mapQuery: "Eko Atlantic City, Lagos",
  },
  {
    slug: "admiralty-court",
    name: "Admiralty Court",
    area: "Lekki Phase 1",
    district: "Lekki Phase 1, Lagos",
    type: "Detached duplex",
    status: "For sale",
    price: "₦1.4B",
    beds: 5,
    baths: 6,
    size: "860 m²",
    plot: "900 m²",
    completion: "Completed 2023",
    parking: "3 cars",
    title: "Governor's Consent",
    serviceCharge: "₦4.5M per year",
    paymentPlan: "60% deposit, balance within 3 months",
    power: "Estate power, 60 kVA backup, inverter",
    summary: "A bright family duplex in a gated close off Admiralty Way.",
    description: [
      "Admiralty Court is one of six homes in a gated close with its own security post. The double-height entrance hall leads into an open living and dining room with sliding doors onto the garden and pool.",
      "Every bedroom is en-suite. The top floor has a cinema lounge and a terrace that catches the evening breeze off the lagoon.",
    ],
    features: ["Gated close", "Double-height hall", "Pool", "Cinema lounge", "Roof terrace", "En-suite bedrooms", "Fitted kitchen", "Inverter", "Water treatment"],
    nearby: [["Admiralty Way", "2 min"], ["Lekki Conservation Centre", "10 min"], ["Lekki–Ikoyi Link Bridge", "8 min"], ["Victoria Island", "20 min"]],
    image: u(EXT.d),
    gallery: [u(EXT.d), u(INT.kitchen2), u(INT.living), u(EXT.b)],
    mapQuery: "Admiralty Way, Lekki Phase 1, Lagos",
  },
  {
    slug: "oniru-garden-flat",
    name: "Oniru Garden Flat",
    area: "Victoria Island",
    district: "Oniru, Victoria Island, Lagos",
    type: "Garden apartment",
    status: "For sale",
    price: "₦980M",
    beds: 3,
    baths: 4,
    size: "410 m²",
    plot: "—",
    completion: "Completed 2024",
    parking: "2 cars",
    title: "Registered Deed of Assignment",
    serviceCharge: "₦3.8M per year",
    paymentPlan: "Outright, or 50% deposit and balance in 6 months",
    power: "Estate power, central backup",
    summary: "A ground-floor apartment with a private garden, close to the beach.",
    description: [
      "The only ground-floor unit in a boutique block of eight, the flat has its own walled garden and a covered terrace for outdoor dining.",
      "Three bedrooms are arranged away from the living space for privacy. The building has a residents' pool, gym and 24-hour concierge.",
    ],
    features: ["Private garden", "Covered terrace", "Residents' pool", "Gym", "Concierge", "Fitted kitchen", "Walk to the beach", "Central backup power"],
    nearby: [["Oniru beach", "4 min"], ["Landmark Centre", "6 min"], ["Victoria Island", "8 min"], ["Ikoyi", "12 min"]],
    image: u(EXT.e),
    gallery: [u(EXT.e), u(INT.living), u(INT.kitchen2), u(EXT.d)],
    mapQuery: "Oniru, Victoria Island, Lagos",
  },
];

export const getListing = (slug: string) => listings.find((l) => l.slug === slug);

/** Intro section copy (claims are placeholders — confirm with the client). */
export const intro = {
  heading: "Fewer homes. Known properly.",
  body: "Ilé lists a small number of houses in Ikoyi, Banana Island, Eko Atlantic, Lekki and Victoria Island. We visit every one, check the title documents before it goes live, and show it in person, to you rather than a crowd.",
  facts: [
    { title: "Titles checked first", text: "Every home shows its title document, and copies go to your lawyer before any payment." },
    { title: "Private viewings", text: "One buyer at a time, with the agent who knows the house." },
    { title: "Buying from abroad", text: "Video walk-throughs, paperwork and handover, handled for you." },
  ],
};

/** A real sequence, so it is numbered on the page. */
export const process = [
  { title: "Book a viewing", text: "Pick a home and a time. We confirm within one working day." },
  { title: "Walk the house", text: "A private visit at your pace, with every question answered on site." },
  { title: "Check the papers", text: "Title, survey plan and approvals go to your lawyer to verify." },
  { title: "Get the keys", text: "Pay through escrow, sign the deed, and move in on handover day." },
];

export const faqs = [
  {
    q: "Which title documents should I look for in Lagos?",
    a: "A Certificate of Occupancy (C of O) or Governor's Consent is the strongest. For flats, a registered Deed of Assignment from the developer is common. Every listing shows its title, and we share copies before you pay anything.",
  },
  {
    q: "Can I pay in dollars?",
    a: "Prices are listed in naira. Some sellers accept dollars at an agreed rate. We'll tell you for each home.",
  },
  {
    q: "I live abroad. Can I still buy?",
    a: "Yes. We run live video walk-throughs, work with your lawyer, and manage the handover. Many buyers visit only once.",
  },
  {
    q: "What is the service charge?",
    a: "A yearly fee for shared estate costs such as security, power, water treatment and maintenance. It's shown on every listing.",
  },
  {
    q: "Do buyers pay you a fee?",
    a: "No. Our fee is paid by the seller. You cover your own legal and registration costs.",
  },
];

export const neighbourhoods = ["Ikoyi", "Banana Island", "Eko Atlantic", "Lekki", "Victoria Island", "Oniru"];
