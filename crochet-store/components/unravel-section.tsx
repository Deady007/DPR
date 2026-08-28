"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { setUnravel } from "@/lib/yarn-signal";
import { theBow } from "@/lib/products";

/**
 * The slow bit.
 *
 * This section owns the strand: scrolling it pulls the yarn back towards a
 * single line while the counters run down from the finished piece. No veil
 * here — the object is the content, so the type sits at the edges and gets out
 * of its way.
 */
export function UnravelSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.35"],
  });

  const [p, setP] = useState(0);
  const eased = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(eased, "change", (v) => {
    const clamped = Math.min(1, Math.max(0, v));
    setP(clamped);
    setUnravel(clamped);
  });

  const remaining = 1 - p;
  const sts = Math.round(theBow.stitches * remaining);
  const mins = Math.round(theBow.minutes * remaining);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[190vh] items-start justify-between px-5 py-32 sm:px-10"
    >
      <div className="sticky top-[34vh] max-w-[16rem]">
        <p className="label">pull the thread</p>
        <h2 className="display mt-4 text-4xl sm:text-5xl">
          It comes apart
          <br />
          as easily as
          <br />
          it went on.
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          One strand, {theBow.stitches.toLocaleString("en-IN")} stitches, worked
          in rows that alternate direction. Scroll and it unwinds.
        </p>
      </div>

      <div className="sticky top-[34vh] text-right">
        <p className="label">still worked</p>
        <p className="mt-3 font-mono text-5xl tabular-nums sm:text-7xl">
          {sts.toLocaleString("en-IN")}
        </p>
        <p className="stitch-line mt-2">stitches remaining</p>

        <p className="mt-8 font-mono text-2xl tabular-nums sm:text-3xl">
          {Math.floor(mins / 60)}h {String(mins % 60).padStart(2, "0")}m
        </p>
        <p className="stitch-line mt-2">of work still standing</p>
      </div>
    </section>
  );
}
