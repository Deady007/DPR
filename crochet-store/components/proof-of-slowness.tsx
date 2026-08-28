"use client";

import { useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { SWATCH_VAR, knotFor, theBow } from "@/lib/products";

/**
 * One piece, built row by row, tied to scroll.
 *
 * The slowness is the argument, so the reader sets the pace: rows fill as the
 * section passes, and the stitch and hour counters climb with them. Nothing
 * moves on its own.
 */
export function ProofOfSlowness() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rows = theBow.chart.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });
  const worked = useTransform(scrollYProgress, [0, 1], [0, rows]);
  const [done, setDone] = useState(0);

  useMotionValueEvent(worked, "change", (v) => {
    setDone(Math.max(0, Math.min(rows, Math.round(v))));
  });

  const shown = reduced ? rows : done;
  const fraction = shown / rows;
  const sts = Math.round(theBow.stitches * fraction);
  const mins = Math.round(theBow.minutes * fraction);
  const cols = theBow.chart[0].length;

  return (
    <section
      ref={ref}
      className="mx-auto w-full max-w-6xl border-t border-gridline px-4 py-20 sm:px-6"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-2xl sm:text-3xl">
            This is what six hours
            <br />
            and forty minutes
            <br />
            looks like.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            One bow, worked bottom-up in rows that alternate direction. Scroll to
            work it. The counter is the real count, not a decoration.
          </p>

          <dl className="mt-8 grid max-w-sm grid-cols-3 gap-px border border-gridline bg-gridline font-mono text-xs">
            <div className="bg-background p-3">
              <dt className="text-muted-foreground">Rows</dt>
              <dd className="mt-1 text-base tabular-nums">
                {shown}/{rows}
              </dd>
            </div>
            <div className="bg-background p-3">
              <dt className="text-muted-foreground">Stitches</dt>
              <dd className="mt-1 text-base tabular-nums">
                {sts.toLocaleString("en-IN")}
              </dd>
            </div>
            <div className="bg-background p-3">
              <dt className="text-muted-foreground">Worked</dt>
              <dd className="mt-1 text-base tabular-nums">
                {Math.floor(mins / 60)}h {mins % 60}m
              </dd>
            </div>
          </dl>
        </div>

        <div
          role="img"
          aria-label={`A bow part-worked: ${shown} of ${rows} rows complete`}
          className="grid w-full border-t border-l border-gridline"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {theBow.chart.flatMap((row, y) =>
            [...row].map((cell, x) => {
              // Worked bottom-up, so the last chart row is the first row made.
              const rowFromBottom = rows - 1 - y;
              const isWorked = rowFromBottom < shown;
              const color =
                cell === "#"
                  ? SWATCH_VAR[theBow.colourway.swatch]
                  : cell === "@"
                    ? knotFor(theBow.colourway.swatch)
                    : undefined;
              return (
                <span
                  key={`${y}-${x}`}
                  className="aspect-square border-r border-b border-gridline transition-opacity duration-200"
                  style={{
                    backgroundColor: isWorked ? color : undefined,
                    opacity: isWorked ? 1 : 0.12,
                  }}
                />
              );
            }),
          )}
        </div>
      </div>
    </section>
  );
}
