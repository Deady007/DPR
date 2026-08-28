import Link from "next/link";
import { StitchGrid } from "@/components/stitch-grid";
import {
  CATEGORY_VAR,
  SWATCH_VAR,
  knotFor,
  priceLabel,
  stitchLine,
  type Product,
} from "@/lib/products";

/**
 * A piece on the shelf. Larger than a store tile, and deliberately without a
 * bag control — the landing page carries no cart.
 */
export function ShelfPiece({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col bg-background p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-5"
    >
      <StitchGrid
        chart={product.chart}
        bodyColor={SWATCH_VAR[product.colourway.swatch]}
        knotColor={knotFor(product.colourway.swatch)}
        label={`${product.name} charted in ${product.colourway.name}`}
      />

      <div className="mt-4 flex items-center gap-2">
        <span
          aria-hidden
          className="size-2"
          style={{ backgroundColor: CATEGORY_VAR[product.category] }}
        />
        <span className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-muted-foreground">
          {product.category}
        </span>
        {product.edition?.total === 1 && (
          <span className="ml-auto font-mono text-[0.625rem] tracking-[0.08em]">
            one of one
          </span>
        )}
      </div>

      <h3 className="mt-2 text-xl leading-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
        {product.name}
      </h3>

      <p className="stitch-line mt-2">{stitchLine(product)}</p>

      <p className="mt-3 font-mono text-sm tabular-nums">
        {priceLabel(product.priceInr)}
      </p>
    </Link>
  );
}
