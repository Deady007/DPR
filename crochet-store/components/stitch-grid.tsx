import { cn } from "@/lib/utils";

type Props = {
  /** Graphgan chart: '#' body, '@' knot, '.' empty. */
  chart: string[];
  /** CSS colour for body stitches — the real colourway. */
  bodyColor: string;
  /** CSS colour for the knot. */
  knotColor: string;
  className?: string;
  label: string;
};

/**
 * A charted piece, drawn as stitches on a square grid.
 *
 * Pixel-snapped: cells are square, gridlines are hairlines, nothing is
 * rounded. Rung 6 animates this row by row — the markup is already ordered
 * bottom-up per row so the reveal has rows to walk.
 */
export function StitchGrid({
  chart,
  bodyColor,
  knotColor,
  className,
  label,
}: Props) {
  const cols = chart[0]?.length ?? 0;

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "grid w-full border-t border-l border-gridline",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {chart.flatMap((row, y) =>
        [...row].map((cell, x) => (
          <span
            key={`${y}-${x}`}
            data-row={y}
            className="aspect-square border-r border-b border-gridline"
            style={{
              backgroundColor:
                cell === "#" ? bodyColor : cell === "@" ? knotColor : undefined,
            }}
          />
        )),
      )}
    </div>
  );
}
