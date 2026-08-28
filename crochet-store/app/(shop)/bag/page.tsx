"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useBag } from "@/lib/bag";
import { priceLabel } from "@/lib/products";

/** The project bag. Guest-owned, no account anywhere near it. */
export default function BagPage() {
  const { lines, remove, totalInr, count } = useBag();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <header className="mb-6 flex items-end justify-between gap-4 border-b border-gridline pb-4">
        <h1 className="text-2xl sm:text-3xl">Project bag</h1>
        <p className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase tabular-nums text-muted-foreground">
          {count} {count === 1 ? "piece" : "pieces"}
        </p>
      </header>

      {lines.length === 0 ? (
        <div className="border border-gridline p-8 text-center">
          <p className="text-lg">Nothing in the bag yet.</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
            Pieces are made to order, so adding one takes a slot in the queue
            rather than emptying a shelf.
          </p>
          <Link
            href="/store"
            className={`${buttonVariants({ size: "lg" })} mt-6 px-4`}
          >
            Open the chart
          </Link>
        </div>
      ) : (
        <>
          <ul className="grid gap-px bg-gridline">
            {lines.map((l) => (
              <li
                key={`${l.slug}-${l.dyeLot}`}
                className="flex flex-wrap items-center gap-3 bg-background p-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${l.slug}`}
                    className="text-base underline-offset-4 hover:underline hover:decoration-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {l.name}
                  </Link>
                  <p className="stitch-line mt-1">
                    {l.colourway} · {l.dyeLot} · ×{l.qty}
                  </p>
                </div>
                <span className="font-mono text-sm tabular-nums">
                  {priceLabel(l.priceInr * l.qty)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(l.slug, l.dyeLot)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gridline pt-4">
            <div>
              <p className="font-mono text-[0.625rem] tracking-[0.1em] uppercase text-muted-foreground">
                total
              </p>
              <p className="font-mono text-xl tabular-nums">
                {priceLabel(totalInr)}
              </p>
            </div>
            <Link
              href="/checkout"
              className={`${buttonVariants({ size: "lg" })} px-4`}
            >
              Checkout as guest
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Shipping is quoted at checkout. Lead times run from the day the yarn
            is wound, not the day you order.
          </p>
        </>
      )}
    </main>
  );
}
