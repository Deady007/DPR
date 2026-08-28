/**
 * Product model.
 *
 * Shaped by the three domain rules:
 *  1. One-of-one breaks normal inventory — a piece carries a lead time and a
 *     queue position, never "In stock".
 *  2. A variant IS a colourway, tied to yarn physically in hand. When the dye
 *     lot is gone, the variant is gone.
 *  3. Toys carry a safety line. Non-negotiable on the PDP.
 */

export type Category = "pins" | "bows" | "toys";

/** Colours are fixed at five, so a colourway maps onto one of them. */
export type Swatch = "primary" | "accent" | "data" | "ink";

export const SWATCH_VAR: Record<Swatch, string> = {
  primary: "var(--primary)",
  accent: "var(--accent)",
  data: "var(--data)",
  ink: "var(--ink)",
};

export const CATEGORY_VAR: Record<Category, string> = {
  pins: "var(--cat-pins)",
  bows: "var(--cat-bows)",
  toys: "var(--cat-toys)",
};

export type Colourway = {
  name: string;
  /** Dye lot held in hand. Empty lot = variant out of stock, not "low stock". */
  dyeLot: string;
  /** Which of the five the yarn actually is. */
  swatch: Swatch;
  /** Pieces this lot can still make. 0 means the colourway is closed. */
  remaining: number;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  /** Craft data. Renders as the stitch line. */
  hookMm: number;
  fibre: string;
  ply: number;
  stitches: number;
  minutes: number;
  /** One-of-one or a numbered short run. */
  edition: { index: number; total: number } | null;
  priceInr: number;
  /** Made to order: a bracket, never a single day. */
  leadTimeDays: [number, number];
  /** People ahead of you in the queue. */
  queue: number;
  colourway: Colourway;
  maker: string;
  /** Graphgan chart. '#' body, '@' knot, '.' empty. Rows worked bottom-up. */
  chart: string[];
};

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

export function priceLabel(inr: number): string {
  return `₹${inr.toLocaleString("en-IN")}`;
}

/** A bow, charted. 15 stitches wide, 9 rows tall. */
const BOW_CHART = [
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

export const theBow: Product = {
  slug: "wide-loop-bow",
  name: "Wide Loop Bow",
  category: "bows",
  hookMm: 4.0,
  fibre: "cotton",
  ply: 8,
  stitches: 2140,
  minutes: 400, // 6h 40m
  edition: { index: 1, total: 3 },
  priceInr: 1450,
  leadTimeDays: [9, 14],
  queue: 4,
  colourway: {
    name: "Bubblegum Acrylic",
    dyeLot: "LOT-24C",
    swatch: "accent",
    remaining: 2,
  },
  maker: "Meera",
  chart: BOW_CHART,
};
