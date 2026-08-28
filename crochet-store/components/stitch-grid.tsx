import { cn } from "@/lib/utils";

/**
 * Charts differ in shape — a bow is 15×9, a bear is 13×13. Fitting each into a
 * box of one aspect keeps tiles aligned across a row.
 */
const BOX_RATIO = 3 / 4;

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
 * A charted piece, drawn stitch by stitch.
 *
 * Each stitch is its own mark with air around it, so the piece reads as worked
 * fabric rather than as a mosaic of flat blocks. Empty cells draw nothing — the
 * field behind supplies the grid.
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
        className="grid"
        style={{
          width: `${chartWidthPct(chart)}%`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {chart.flatMap((row, y) =>
          [...row].map((cell, x) => {
            const color =
              cell === "#" ? bodyColor : cell === "@" ? knotColor : null;
            return (
              <span key={`${y}-${x}`} data-row={y} className="aspect-square p-[6%]">
                {color && (
                  <span
                    className="block size-full rounded-[2px]"
                    style={{ backgroundColor: color }}
                  />
                )}
              </span>
            );
          }),
        )}
      </div>
    </div>
  );
}
