import { Button } from "@/components/ui/button";
import { StitchGrid } from "@/components/stitch-grid";
import {
  CATEGORY_VAR,
  SWATCH_VAR,
  priceLabel,
  stitchLine,
  type Product,
} from "@/lib/products";

/**
 * One piece on the working chart.
 *
 * No "In stock". A made-to-order piece states its lead time as a bracket and
 * how many people are ahead of you. A closed dye lot closes the colourway.
 */
export function ProductCard({ product }: { product: Product }) {
  const closed = product.colourway.remaining === 0;
  const [lo, hi] = product.leadTimeDays;

  return (
    <article className="group flex flex-col border border-gridline bg-card">
      <StitchGrid
        chart={product.chart}
        bodyColor={SWATCH_VAR[product.colourway.swatch]}
        knotColor="var(--ink)"
        label={`${product.name} charted in ${product.colourway.name}`}
      />

      <div className="flex flex-1 flex-col gap-3 border-t border-gridline p-4">
        {/* category code + edition */}
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
          <h3 className="text-lg leading-tight">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.colourway.name}
            <span className="font-mono text-xs"> · {product.colourway.dyeLot}</span>
          </p>
        </div>

        {/* the stitch line */}
        <p className="stitch-line">{stitchLine(product)}</p>

        {/* made to order: a bracket and a queue, never "in stock" */}
        <dl className="mt-auto grid grid-cols-2 gap-px border border-gridline bg-gridline font-mono text-[0.6875rem]">
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

        <div className="flex items-center justify-between gap-3 border-t border-gridline pt-3">
          <span className="font-mono text-base tabular-nums">
            {priceLabel(product.priceInr)}
          </span>
          <Button size="lg" disabled={closed}>
            {closed ? "Colourway closed" : "Add to project bag"}
          </Button>
        </div>

        <p className="font-mono text-[0.625rem] text-muted-foreground">
          Worked by {product.maker} · {product.colourway.remaining} left in{" "}
          {product.colourway.dyeLot}
        </p>
      </div>
    </article>
  );
}
