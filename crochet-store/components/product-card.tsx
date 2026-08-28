import Link from "next/link";
import { AddToBag } from "@/components/add-to-bag";
import { PieceField } from "@/components/piece-field";
import { priceLabel, stitchLine, type Product } from "@/lib/products";

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
    <article className="group flex h-full flex-col bg-background transition-colors duration-500 hover:bg-pitch">
      <Link
        href={`/product/${product.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <PieceField
          product={product}
          dim={closed}
          className="aspect-[4/3] w-full"
        />

        <div className="flex flex-col gap-2 px-5 pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="label">{product.category}</span>
            {product.edition && (
              <span className="label">
                {product.edition.total === 1
                  ? "one of one"
                  : `${product.edition.index}/${product.edition.total}`}
              </span>
            )}
          </div>

          <h3 className="text-2xl leading-tight transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            {product.colourway.name}
            <span className="font-mono text-xs"> · {product.colourway.dyeLot}</span>
          </p>

          <p className="stitch-line pt-1">{stitchLine(product)}</p>
        </div>
      </Link>

      <div className="mt-auto px-5 pt-4 pb-5">
        <dl className="flex flex-wrap gap-x-8 gap-y-1 border-t border-gridline pt-4 font-mono text-[0.6875rem]">
          <div>
            <dt className="text-muted-foreground">Lead time</dt>
            <dd className="tabular-nums">{closed ? "—" : `${lo}–${hi} days`}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Queue</dt>
            <dd className="tabular-nums">
              {closed ? "closed" : `${product.queue} ahead`}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-mono text-base tabular-nums">
            {priceLabel(product.priceInr)}
          </span>
          <AddToBag product={product} />
        </div>
      </div>
    </article>
  );
}
