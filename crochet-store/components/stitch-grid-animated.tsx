"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { chartWidthPct } from "@/components/stitch-grid";

type Props = {
  chart: string[];
  bodyColor: string;
  knotColor: string;
  className?: string;
  label: string;
  /** Seconds before the first row is worked. */
  delay?: number;
};

/**
 * The hero chart, crocheting itself in one row at a time.
 *
 * Rows are worked bottom-up, alternating direction, because that is how the
 * fabric is actually made. Only opacity and scale animate, so the sequence
 * stays on the compositor.
 *
 * This is the one bold element on the page. Everything around it stays quiet.
 *
 * Cells are motion elements whether or not motion is reduced — the durations
 * collapse to zero instead. Changing the element type across hydration would
 * strand the server's hidden inline style and leave the chart blank.
 */
export function StitchGridAnimated({
  chart,
  bodyColor,
  knotColor,
  className,
  label,
  delay = 0.15,
}: Props) {
  const reduced = useReducedMotion();
  const cols = chart[0]?.length ?? 0;
  const rows = chart.length;

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
          [...row].map((cell, x) => {
            const filled = cell !== ".";
            const color =
              cell === "#" ? bodyColor : cell === "@" ? knotColor : undefined;

            // Worked bottom-up; even rows run left-to-right, odd rows return.
            const fromBottom = rows - 1 - y;
            const order = fromBottom % 2 === 0 ? x : cols - 1 - x;
            const cellDelay = delay + fromBottom * 0.09 + order * 0.012;

            const base = "aspect-square border-r border-b border-gridline";

            if (!filled) {
              return <span key={`${y}-${x}`} data-row={y} className={base} />;
            }

            return (
              <motion.span
                key={`${y}-${x}`}
                data-row={y}
                className={`${base} motion-reveal`}
                style={{ backgroundColor: color }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        duration: 0.28,
                        delay: cellDelay,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
