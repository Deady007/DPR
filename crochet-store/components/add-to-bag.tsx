"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBag } from "@/lib/bag";
import type { Product } from "@/lib/products";

export function AddToBag({
  product,
  size = "lg",
}: {
  product: Product;
  size?: "lg" | "default";
}) {
  const { add } = useBag();
  const [added, setAdded] = useState(false);
  const closed = product.colourway.remaining === 0;

  if (closed) {
    return (
      <Button size={size} disabled>
        Colourway closed
      </Button>
    );
  }

  return (
    <Button
      size={size}
      onClick={() => {
        add({
          slug: product.slug,
          dyeLot: product.colourway.dyeLot,
          name: product.name,
          colourway: product.colourway.name,
          priceInr: product.priceInr,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2000);
      }}
    >
      {added ? "In your bag" : "Add to project bag"}
    </Button>
  );
}
