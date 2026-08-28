import { ProductCard } from "@/components/product-card";
import { theBow } from "@/lib/products";

/**
 * Rung 4 review surface: one card, one real bow.
 * Rung 5 duplicates this to a 12-cell grid; rung 8 replaces it with the
 * landing page proper.
 */
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8 border-b border-gridline pb-4">
        <h1 className="text-2xl sm:text-3xl">The workroom</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Charted, hooked and blocked by hand. Every piece states what it took
          to make.
        </p>
      </header>

      <div className="max-w-sm">
        <ProductCard product={theBow} />
      </div>
    </main>
  );
}
