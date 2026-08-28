import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToBag } from "@/components/add-to-bag";
import { StitchGrid } from "@/components/stitch-grid";
import {
  CATEGORY_VAR,
  SWATCH_VAR,
  knotFor,
  bySlug,
  priceLabel,
  products,
  safetyLine,
  stitchLine,
} from "@/lib/products";

type Params = { slug: string };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.colourway.name}`,
    description: `${p.blurb} ${stitchLine(p)}.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) notFound();

  const closed = product.colourway.remaining === 0;
  const [lo, hi] = product.leadTimeDays;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <nav className="mb-6 font-mono text-[0.6875rem] tracking-[0.1em] uppercase text-muted-foreground">
        <Link
          href={`/store/${product.category}`}
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {product.category}
        </Link>
        <span aria-hidden> / </span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-px bg-gridline lg:grid-cols-2">
        {/* the chart */}
        <div className="bg-card p-4 sm:p-6">
          <StitchGrid
            chart={product.chart}
            bodyColor={SWATCH_VAR[product.colourway.swatch]}
            knotColor={knotFor(product.colourway.swatch)}
            label={`${product.name} charted in ${product.colourway.name}`}
            className={closed ? "opacity-45" : undefined}
          />
          <p className="mt-4 font-mono text-[0.625rem] tracking-[0.08em] text-muted-foreground">
            Charted at {product.chart[0].length} sts across ·{" "}
            {product.chart.length} rows. Photographs of finished pieces pending.
          </p>
        </div>

        {/* the specifics */}
        <div className="flex flex-col gap-5 bg-card p-4 sm:p-6">
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
              <span className="font-mono text-[0.625rem] tracking-[0.08em] text-muted-foreground">
                ·{" "}
                {product.edition.total === 1
                  ? "one of one"
                  : `${product.edition.index} of ${product.edition.total}`}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-3xl leading-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
              {product.blurb}
            </p>
          </div>

          <p className="stitch-line border-y border-gridline py-3">
            {stitchLine(product)}
          </p>

          {/* variant = colourway, tied to a lot in hand */}
          <section>
            <h2 className="font-mono text-[0.625rem] tracking-[0.12em] uppercase text-muted-foreground">
              Colourway
            </h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {[product.colourway, ...(product.alsoIn ?? [])].map((c, i) => {
                const gone = c.remaining === 0;
                return (
                  <li
                    key={c.dyeLot}
                    className={`flex items-center gap-2 border px-2 py-1.5 font-mono text-[0.6875rem] ${
                      i === 0 ? "border-foreground" : "border-gridline"
                    } ${gone ? "text-muted-foreground line-through" : ""}`}
                  >
                    <span
                      aria-hidden
                      className="size-3 border border-gridline"
                      style={{ backgroundColor: SWATCH_VAR[c.swatch] }}
                    />
                    {c.name}
                    <span className="text-muted-foreground">
                      {gone ? "lot finished" : `${c.remaining} from ${c.dyeLot}`}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              A colourway is a dye lot held in hand. When the lot is finished the
              colourway closes rather than restocking.
            </p>
          </section>

          {/* made to order: bracket and queue, never "in stock" */}
          <dl className="grid grid-cols-2 gap-px border border-gridline bg-gridline font-mono text-xs">
            <div className="bg-card p-3">
              <dt className="text-muted-foreground">Lead time</dt>
              <dd className="mt-1 text-sm tabular-nums">
                {closed ? "—" : `${lo}–${hi} days`}
              </dd>
            </div>
            <div className="bg-card p-3">
              <dt className="text-muted-foreground">Queue</dt>
              <dd className="mt-1 text-sm tabular-nums">
                {closed ? "closed" : `${product.queue} ahead of you`}
              </dd>
            </div>
          </dl>

          {/* non-negotiable on a toy */}
          {product.category === "toys" && (
            <section
              className="border-l-2 p-3"
              style={{ borderColor: CATEGORY_VAR.toys }}
            >
              <h2 className="font-mono text-[0.625rem] tracking-[0.12em] uppercase">
                Safety
              </h2>
              <p className="stitch-line mt-1 !text-foreground">
                {safetyLine(product.safety)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {product.safety.minAgeMonths === 0
                  ? "Nothing is attached — every feature is embroidered, so it is suitable from birth."
                  : product.safety.smallParts
                    ? "Contains small parts. Keep away from children under three."
                    : "No detachable parts, but the fibre pile makes it unsuitable for the very youngest."}
              </p>
            </section>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-gridline pt-4">
            <span className="font-mono text-xl tabular-nums">
              {priceLabel(product.priceInr)}
            </span>
            <AddToBag product={product} />
          </div>

          <p className="text-xs text-muted-foreground">
            Checkout works without an account.{" "}
            <Link
              href="/account"
              className="underline decoration-1 underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Signing in
            </Link>{" "}
            adds queue position, drop alerts on this colourway and reorder.
          </p>

          <p className="font-mono text-[0.625rem] text-muted-foreground">
            Worked by {product.maker}
          </p>
        </div>
      </div>
    </main>
  );
}
