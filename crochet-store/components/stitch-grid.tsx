import { cn } from "@/lib/utils";

/**
 * Charts differ in shape — a bow is 15×9, a bear is 13×13. Fitting each into a
 * box of one aspect keeps tiles aligned across a row, so the grid reads as one
 * sheet rather than a ragged shelf.
 */
const BOX_RATIO = 3 / 4; // height ÷ width of the box a chart is fitted into

export function chartWidthPct(chart: string[]): number {
  const cols = chart[0]?.length ?? 1;
  const rows = chart.length || 1;
  return Math.min(1, BOX_RATIO * (cols / rows)) * 100;
}

type Props = {
  /** Graphgan chart: '#' body, '@' contrast, '.' empty. */
  chart: string[];
  bodyColor: string;
  knotColor: string;
  className?: string;
  label: string;
};

/**
 * A charted piece, drawn as stitches on a square grid.
 *
 * Pixel-snapped: cells are square, gridlines are hairlines, nothing is rounded.
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
      className={cn("flex aspect-[4/3] w-full items-center justify-center", className)}
    >
      <div
        role="img"
        aria-label={label}
        className="grid border-t border-l border-gridline"
        style={{
          width: `${chartWidthPct(chart)}%`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {chart.flatMap((row, y) =>
          [...row].map((cell, x) => (
            <span
              key={`${y}-${x}`}
              data-row={y}
              className="aspect-square border-r border-b border-gridline"
              style={{
                backgroundColor:
                  cell === "#"
                    ? bodyColor
                    : cell === "@"
                      ? knotColor
                      : undefined,
              }}
            />
          )),
        )}
      </div>
    </div>
  );
}
