"use client";

import { products, stitchLine } from "@/lib/products";

/**
 * A running band of real craft data.
 *
 * CSS-only, duplicated once so the loop is seamless, and paused under reduced
 * motion rather than removed — the content is the point.
 */
export function CraftMarquee() {
  const items = products.map((p) => `${p.name} — ${stitchLine(p)}`);

  return (
    <div className="relative overflow-hidden border-y border-gridline py-4">
      <div className="marquee flex w-max gap-10">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 gap-10" aria-hidden={copy === 1}>
            {items.map((t) => (
              <li key={t} className="stitch-line whitespace-nowrap">
                {t}
              </li>
            ))}
          </ul>
        ))}
      </div>

      <style jsx>{`
        .marquee {
          animation: slide 64s linear infinite;
        }
        @keyframes slide {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
