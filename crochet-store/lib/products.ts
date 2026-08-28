/**
 * Catalogue.
 *
 * Shaped by the three domain rules:
 *  1. One-of-one breaks normal inventory — a piece carries a lead-time bracket
 *     and a queue position, never "In stock".
 *  2. A variant IS a colourway, tied to yarn physically in hand. When the dye
 *     lot is gone the colourway closes.
 *  3. Toys carry a safety line. The type system enforces it.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER DATA. The craft spec on `wide-loop-bow` is real (it came from the
 * brief). Every other name, price, maker, dye lot, lead time and queue depth is
 * invented scaffolding so the grid, reveal and PDP can be built and tested.
 * Replace before this is customer-facing.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Category = "pins" | "bows" | "toys";

export const CATEGORIES: Category[] = ["pins", "bows", "toys"];

/** Colours are fixed at five, so a colourway maps onto one of them. */
export type Swatch = "primary" | "accent" | "data" | "ink";

export const SWATCH_VAR: Record<Swatch, string> = {
  primary: "var(--primary)",
  accent: "var(--accent)",
  data: "var(--data)",
  ink: "var(--ink)",
};

/**
 * Real hex values for the WebGL material, which cannot read CSS variables.
 * Deep Skein is lifted here — at #221C2A a strand would vanish into the void.
 */
export const SWATCH_HEX: Record<Swatch, string> = {
  primary: "#1f7a6b",
  accent: "#e8548a",
  data: "#f0b429",
  // Lifted well clear of #221C2A: this value is also used as hover text on the
  // dark ground, and the true Deep Skein is unreadable there.
  ink: "#7d6f93",
};

export const CATEGORY_VAR: Record<Category, string> = {
  pins: "var(--cat-pins)",
  bows: "var(--cat-bows)",
  toys: "var(--cat-toys)",
};

export type Colourway = {
  name: string;
  /** Which of the five the yarn actually is. */
  swatch: Swatch;
  /** Dye lot held in hand. */
  dyeLot: string;
  /** Pieces this lot can still make. 0 closes the colourway. */
  remaining: number;
};

/** Non-negotiable on a toy's PDP. */
export type SafetyLine = {
  smallParts: boolean;
  eyes: "safety-locked" | "embroidered";
  /** Minimum age in months. Under-3 needs stating plainly. */
  minAgeMonths: number;
};

type Base = {
  slug: string;
  name: string;
  hookMm: number;
  fibre: string;
  ply: number;
  stitches: number;
  minutes: number;
  /** A numbered short run, or null for an open piece. */
  edition: { index: number; total: number } | null;
  priceInr: number;
  leadTimeDays: [number, number];
  queue: number;
  colourway: Colourway;
  /** Other colourways of the same piece. */
  alsoIn?: Colourway[];
  maker: string;
  blurb: string;
  /** Graphgan chart. '#' body, '@' contrast, '.' empty. */
  chart: string[];
};

/**
 * A toy cannot exist without a safety line — the union makes omitting it a
 * type error rather than a review comment.
 */
export type Product = Base &
  (
    | { category: "toys"; safety: SafetyLine }
    | { category: "pins" | "bows"; safety?: never }
  );

/** `4.0mm hook · cotton 8-ply · 2,140 sts · 6h 40m · 1 of 3` */
export function stitchLine(p: Product): string {
  const parts = [
    `${p.hookMm.toFixed(1)}mm hook`,
    `${p.fibre} ${p.ply}-ply`,
    `${p.stitches.toLocaleString("en-IN")} sts`,
    `${Math.floor(p.minutes / 60)}h ${p.minutes % 60}m`,
  ];
  if (p.edition) parts.push(`${p.edition.index} of ${p.edition.total}`);
  return parts.join(" · ");
}

/**
 * The knot has to be legible against the body of the piece. A Deep Skein
 * colourway with an ink knot is a knot nobody can see.
 */
export function knotFor(swatch: Swatch): string {
  return swatch === "ink" ? "var(--ground)" : "var(--ink)";
}

export function priceLabel(inr: number): string {
  return `₹${inr.toLocaleString("en-IN")}`;
}

export function safetyLine(s: SafetyLine): string {
  return [
    s.eyes === "safety-locked" ? "locked safety eyes" : "embroidered eyes",
    s.smallParts ? "contains small parts" : "no small parts",
    `not for under ${Math.floor(s.minAgeMonths / 12)}s`,
  ].join(" · ");
}

/* ── charts ──────────────────────────────────────────────────────────────── */

const BOW = [
  ".###.......###.",
  "#####.....#####",
  "######...######",
  "######@@@######",
  "#####@@@@@#####",
  "######@@@######",
  "######...######",
  "#####.....#####",
  ".###.......###.",
];

const HEART = [
  ".###...###.",
  "###########",
  "###########",
  "###########",
  ".#########.",
  "..#######..",
  "...#####...",
  "....###....",
  ".....#.....",
];

const BEAR = [
  ".##.......##.",
  "####.....####",
  "#############",
  "#############",
  "##@@#####@@##",
  "#############",
  "####@@@@@####",
  "#############",
  ".###########.",
  "..#########..",
  "..#########..",
  ".##.......##.",
  "###.......###",
];

/* ── the catalogue ───────────────────────────────────────────────────────── */

const lot = (name: string, swatch: Swatch, dyeLot: string, remaining: number): Colourway => ({
  name,
  swatch,
  dyeLot,
  remaining,
});

export const products: Product[] = [
  /* bows */
  {
    slug: "wide-loop-bow",
    name: "Wide Loop Bow",
    category: "bows",
    hookMm: 4.0,
    fibre: "cotton",
    ply: 8,
    stitches: 2140,
    minutes: 400,
    edition: { index: 1, total: 3 },
    priceInr: 1450,
    leadTimeDays: [9, 14],
    queue: 4,
    colourway: lot("Bubblegum Acrylic", "accent", "LOT-24C", 2),
    alsoIn: [lot("Merino Teal", "primary", "LOT-19A", 1), lot("Deep Skein", "ink", "LOT-31B", 0)],
    maker: "Meera",
    blurb:
      "Worked flat in two loops, then bound at the centre by hand. The width axis is set by tension, not by pattern.",
    chart: BOW,
  },
  {
    slug: "school-ribbon-bow",
    name: "School Ribbon Bow",
    category: "bows",
    hookMm: 3.5,
    fibre: "cotton",
    ply: 4,
    stitches: 1180,
    minutes: 215,
    edition: null,
    priceInr: 890,
    leadTimeDays: [6, 9],
    queue: 2,
    colourway: lot("Merino Teal", "primary", "LOT-19A", 5),
    maker: "Anjali",
    blurb: "Tighter gauge, flatter loop. Sits close to the head.",
    chart: BOW,
  },
  {
    slug: "mustard-clip-bow",
    name: "Mustard Clip Bow",
    category: "bows",
    hookMm: 4.0,
    fibre: "cotton",
    ply: 8,
    stitches: 1620,
    minutes: 300,
    edition: { index: 2, total: 4 },
    priceInr: 1150,
    leadTimeDays: [8, 12],
    queue: 3,
    colourway: lot("Mustard 4-ply", "data", "LOT-07D", 3),
    maker: "Meera",
    blurb: "A stiffer bow on a lined alligator clip. Holds shape through a full day.",
    chart: BOW,
  },
  {
    slug: "deep-skein-bow",
    name: "Deep Skein Bow",
    category: "bows",
    hookMm: 3.5,
    fibre: "merino",
    ply: 4,
    stitches: 1940,
    minutes: 355,
    edition: { index: 1, total: 1 },
    priceInr: 1690,
    leadTimeDays: [11, 16],
    queue: 6,
    colourway: lot("Deep Skein", "ink", "LOT-31B", 1),
    maker: "Fatima",
    blurb: "One of one. The last of a merino lot that will not be dyed again.",
    chart: BOW,
  },

  /* pins */
  {
    slug: "heart-pin",
    name: "Heart Pin",
    category: "pins",
    hookMm: 2.5,
    fibre: "cotton",
    ply: 4,
    stitches: 340,
    minutes: 65,
    edition: null,
    priceInr: 320,
    leadTimeDays: [4, 6],
    queue: 1,
    colourway: lot("Bubblegum Acrylic", "accent", "LOT-24C", 9),
    alsoIn: [lot("Mustard 4-ply", "data", "LOT-07D", 6)],
    maker: "Anjali",
    blurb: "Worked in the round, stuffed lightly, backed with a brooch bar.",
    chart: HEART,
  },
  {
    slug: "teal-heart-pin",
    name: "Teal Heart Pin",
    category: "pins",
    hookMm: 2.5,
    fibre: "cotton",
    ply: 4,
    stitches: 340,
    minutes: 65,
    edition: null,
    priceInr: 320,
    leadTimeDays: [4, 6],
    queue: 1,
    colourway: lot("Merino Teal", "primary", "LOT-19A", 7),
    maker: "Anjali",
    blurb: "Same chart, cooler lot. Reads darker indoors.",
    chart: HEART,
  },
  {
    slug: "mustard-heart-pin",
    name: "Mustard Heart Pin",
    category: "pins",
    hookMm: 3.0,
    fibre: "cotton",
    ply: 8,
    stitches: 410,
    minutes: 80,
    edition: null,
    priceInr: 360,
    leadTimeDays: [4, 7],
    queue: 0,
    colourway: lot("Mustard 4-ply", "data", "LOT-07D", 4),
    maker: "Fatima",
    blurb: "Thicker ply, so the stitches read individually at arm's length.",
    chart: HEART,
  },
  {
    slug: "closed-lot-pin",
    name: "Blocking Mat Pin",
    category: "pins",
    hookMm: 2.5,
    fibre: "cotton",
    ply: 4,
    stitches: 340,
    minutes: 65,
    edition: null,
    priceInr: 320,
    leadTimeDays: [4, 6],
    queue: 0,
    colourway: lot("Deep Skein", "ink", "LOT-31B", 0),
    maker: "Anjali",
    blurb: "The lot is finished. Kept listed so the chart stays findable.",
    chart: HEART,
  },

  /* toys */
  {
    slug: "small-bear",
    name: "Small Bear",
    category: "toys",
    hookMm: 3.0,
    fibre: "cotton",
    ply: 8,
    stitches: 4820,
    minutes: 890,
    edition: { index: 1, total: 2 },
    priceInr: 2450,
    leadTimeDays: [14, 21],
    queue: 7,
    colourway: lot("Mustard 4-ply", "data", "LOT-07D", 2),
    maker: "Fatima",
    blurb: "Worked in the round from the snout out. Jointed at the shoulders.",
    chart: BEAR,
    safety: { smallParts: true, eyes: "safety-locked", minAgeMonths: 36 },
  },
  {
    slug: "baby-safe-bear",
    name: "Baby-Safe Bear",
    category: "toys",
    hookMm: 3.0,
    fibre: "cotton",
    ply: 8,
    stitches: 4610,
    minutes: 850,
    edition: null,
    priceInr: 2390,
    leadTimeDays: [14, 21],
    queue: 5,
    colourway: lot("Merino Teal", "primary", "LOT-19A", 3),
    maker: "Fatima",
    blurb:
      "Every feature embroidered, nothing attached. Made for a cot rather than a shelf.",
    chart: BEAR,
    safety: { smallParts: false, eyes: "embroidered", minAgeMonths: 0 },
  },
  {
    slug: "pink-bear",
    name: "Bubblegum Bear",
    category: "toys",
    hookMm: 3.0,
    fibre: "acrylic",
    ply: 8,
    stitches: 4820,
    minutes: 880,
    edition: { index: 3, total: 3 },
    priceInr: 2290,
    leadTimeDays: [12, 18],
    queue: 4,
    colourway: lot("Bubblegum Acrylic", "accent", "LOT-24C", 1),
    maker: "Meera",
    blurb: "Acrylic, so it survives a washing machine on a cool cycle.",
    chart: BEAR,
    safety: { smallParts: true, eyes: "safety-locked", minAgeMonths: 36 },
  },
  {
    slug: "night-bear",
    name: "Night Bear",
    category: "toys",
    hookMm: 2.5,
    fibre: "merino",
    ply: 4,
    stitches: 5940,
    minutes: 1120,
    edition: { index: 1, total: 1 },
    priceInr: 3200,
    leadTimeDays: [18, 26],
    queue: 9,
    colourway: lot("Deep Skein", "ink", "LOT-31B", 1),
    maker: "Meera",
    blurb: "The longest piece on the chart. One of one, and slow on purpose.",
    chart: BEAR,
    safety: { smallParts: false, eyes: "embroidered", minAgeMonths: 12 },
  },
];

export const theBow = products[0];

export function byCategory(c: Category): Product[] {
  return products.filter((p) => p.category === c);
}

export function bySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** The shelf: four premium pieces. Not a catalogue. */
// Ordered so the two ink pieces do not sit next to each other; the shelf reads
// as alternating weight rather than dark-heavy on the left.
export const shelf: Product[] = [
  products[3], // Deep Skein Bow — ink
  products[8], // Small Bear — mustard
  products[11], // Night Bear — ink
  products[0], // Wide Loop Bow — bubblegum
];

/* ── the makers ──────────────────────────────────────────────────────────── */

export type Maker = {
  name: string;
  hookMm: number;
  hoursLogged: number;
  specialises: string;
  /** What their hands are doing, for the alt text. Photographs pending. */
  atWork: string;
};

export const makers: Maker[] = [
  {
    name: "Meera",
    hookMm: 4.0,
    hoursLogged: 2180,
    specialises: "bows and the tension that holds their width",
    atWork: "binding the centre of a bow, thread held short",
  },
  {
    name: "Anjali",
    hookMm: 2.5,
    hoursLogged: 1340,
    specialises: "pins worked in the round, small and fast",
    atWork: "closing the last round of a pin against her thumb",
  },
  {
    name: "Fatima",
    hookMm: 3.0,
    hoursLogged: 3010,
    specialises: "amigurumi, jointing and safe finishing",
    atWork: "seating a locked safety eye from the inside of a head",
  },
];

/* ── materials ───────────────────────────────────────────────────────────── */

export const materials = [
  {
    fibre: "Cotton",
    detail: "Mercerised 4- and 8-ply. Holds a stitch edge and blocks flat.",
    sourcing: "Mill ends, Tiruppur",
  },
  {
    fibre: "Merino",
    detail: "Softer, blooms after washing. Used where a piece is handled.",
    sourcing: "Small-lot dyer, Bengaluru",
  },
  {
    fibre: "Acrylic",
    detail: "Machine washable. Chosen for toys that will be dragged about.",
    sourcing: "Trade supplier, Surat",
  },
];
