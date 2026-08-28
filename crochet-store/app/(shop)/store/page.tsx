import type { Metadata } from "next";
import { StoreGrid } from "@/components/store-grid";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "The workroom — every piece on the chart",
  description:
    "Pins, bows and amigurumi worked by hand. Every piece lists its hook, fibre, stitch count and the hours it took.",
};

export default function StorePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-gridline pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl">The workroom</h1>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">
            Everything is made to order. Each piece states its lead time and how
            many are ahead of it.
          </p>
        </div>
        <p className="font-mono text-[0.6875rem] tracking-[0.1em] uppercase tabular-nums text-muted-foreground">
          {products.length} pieces
        </p>
      </header>

      <StoreGrid products={products} />
    </main>
  );
}
