import Link from "next/link";
import { AddToBag } from "@/components/add-to-bag";
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
 * One piece on the working chart.
 *
 * No "In stock". A made-to-order piece states a lead-time bracket and how many
 * people are ahead of you. A closed dye lot closes the colourway.
 */
export function ProductCard({ product }: { product: Product }) {
  const closed = product.colourway.remaining === 0;
  const [lo, hi] = product.leadTimeDays;

  return (
    <article className="flex h-full flex-col border border-gridline bg-card">
      <Link
        href={`/product/${product.slug}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <StitchGrid
          chart={product.chart}
          bodyColor={SWATCH_VAR[product.colourway.swatch]}
          knotColor={knotFor(product.colourway.swatch)}
          label={`${product.name} charted in ${product.colourway.name}`}
          className={closed ? "opacity-45" : undefined}
        />

        <div className="flex flex-col gap-3 border-t border-gridline p-4">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2"
              style={{ backgroundColor: CATEGORY_VAR[product.category] }}
            />
            <span className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-muted-foreground">
              {product.category}
            </span>
            {product.edition && (
              <span className="ml-auto font-mono text-[0.625rem] tracking-[0.08em] text-muted-foreground">
                {product.edition.total === 1
                  ? "one of one"
                  : `${product.edition.index}/${product.edition.total}`}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-lg leading-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.colourway.name}
              <span className="font-mono text-xs">
                {" "}
                · {product.colourway.dyeLot}
              </span>
            </p>
          </div>

          <p className="stitch-line">{stitchLine(product)}</p>
        </div>
      </Link>

      <div className="mt-auto px-4 pb-4">
        <dl className="grid grid-cols-2 gap-px border border-gridline bg-gridline font-mono text-[0.6875rem]">
          <div className="bg-card p-2">
            <dt className="text-muted-foreground">Lead time</dt>
            <dd className="tabular-nums">
              {closed ? "—" : `${lo}–${hi} days`}
            </dd>
          </div>
          <div className="bg-card p-2">
            <dt className="text-muted-foreground">Queue</dt>
            <dd className="tabular-nums">
              {closed ? "closed" : `${product.queue} ahead`}
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-gridline pt-3">
          <span className="font-mono text-base tabular-nums">
            {priceLabel(product.priceInr)}
          </span>
          <AddToBag product={product} />
        </div>
      </div>
    </article>
  );
}
