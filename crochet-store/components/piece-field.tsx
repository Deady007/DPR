import { StitchGrid } from "@/components/stitch-grid";
import { CATEGORY_VAR, SWATCH_HEX, knotFor, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

/**
 * A piece, presented as a lit field of its own colourway with the chart drawn
 * over it.
 *
 * The chart still carries the real information — it is the piece, stitch for
 * stitch — but it is no longer a slab of flat colour on white. The wash gives
 * the tile depth and states the colourway before a word is read.
 */
export function PieceField({
  product,
  className,
  dim = false,
}: {
  product: Product;
  className?: string;
  dim?: boolean;
}) {
  const yarn = SWATCH_HEX[product.colourway.swatch];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-pitch",
        dim && "opacity-45 saturate-50",
        className,
      )}
    >
      {/* the colourway, as light rather than as a block */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(115% 95% at 32% 18%, color-mix(in oklab, ${yarn} 42%, transparent), transparent 68%)`,
        }}
      />
      {/* a faint rule grid, so it still reads as a working chart */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--bone) 1px, transparent 1px), linear-gradient(to bottom, var(--bone) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative flex h-full items-center justify-center p-7">
        <StitchGrid
          chart={product.chart}
          bodyColor={yarn}
          knotColor={knotFor(product.colourway.swatch)}
          label={`${product.name} charted in ${product.colourway.name}`}
          className="!aspect-auto w-[78%]"
        />
      </div>

      <span
        aria-hidden
        className="absolute top-4 left-4 size-1.5 rounded-full"
        style={{ backgroundColor: CATEGORY_VAR[product.category] }}
      />
    </div>
  );
}
