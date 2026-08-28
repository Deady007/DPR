"use client";

import Link from "next/link";
import { useState } from "react";
import { SWATCH_HEX, priceLabel, stitchLine, type Product } from "@/lib/products";
import { resetYarn, setYarn } from "@/lib/yarn-signal";

/**
 * A finished piece, as an editorial row rather than a card.
 *
 * Hovering it dyes the strand in the canvas to that piece's colourway, so the
 * object behind the page belongs to the thing you are reading about.
 */
export function ShelfRow({ product, index }: { product: Product; index: number }) {
  const [hot, setHot] = useState(false);

  const enter = () => {
    setHot(true);
    setYarn({
      color: SWATCH_HEX[product.colourway.swatch],
      caption: `${product.colourway.name} · ${product.colourway.dyeLot}`,
    });
  };

  const leave = () => {
    setHot(false);
    resetYarn();
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      className="group relative block border-b border-gridline py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      {/* the colourway, wiped across the row on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        style={{ backgroundColor: SWATCH_HEX[product.colourway.swatch] }}
      />

      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <span className="label w-8 shrink-0 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3
          className="flex-1 text-3xl transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 sm:text-4xl lg:text-5xl"
          style={hot ? { color: SWATCH_HEX[product.colourway.swatch] } : undefined}
        >
          {product.name}
        </h3>

        <span className="font-mono text-sm tabular-nums">
          {priceLabel(product.priceInr)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1 pl-14">
        <p className="stitch-line">{stitchLine(product)}</p>
        <p className="stitch-line">
          {product.edition?.total === 1
            ? "one of one"
            : `${product.leadTimeDays[0]}–${product.leadTimeDays[1]} days · ${product.queue} ahead`}
        </p>
      </div>
    </Link>
  );
}
