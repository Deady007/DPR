import { ProductCard } from "@/components/product-card";
import { GridReveal } from "@/components/row-reveal";
import type { Product } from "@/lib/products";

/**
 * The working chart. A tight grid with visible hairline gridlines — the tiles
 * sit flush and share their borders, so the surface reads as one sheet of
 * graph paper rather than a set of floating cards.
 */
export function StoreGrid({ products }: { products: Product[] }) {
  return (
    <GridReveal
      columns={3}
      className="grid grid-cols-1 gap-px bg-gridline sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </GridReveal>
  );
}
