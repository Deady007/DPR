"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { StitchGridAnimated } from "@/components/stitch-grid-animated";
import { SWATCH_VAR, knotFor, theBow } from "@/lib/products";

/**
 * The hero, and the door.
 *
 * The bow crochets itself in on load, one row at a time. That is the one bold
 * element on this page.
 *
 * Opening the door zooms the stitch grid so the catalogue emerges from the
 * fabric of the hero, then routes. Transform and opacity only. Under
 * prefers-reduced-motion the animation is skipped and the door simply routes.
 */
export function HeroDoor() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    router.prefetch("/store");
  }, [router]);

  const open = useCallback(() => {
    if (reduced) {
      router.push("/store");
      return;
    }
    setOpening(true);
    window.setTimeout(() => router.push("/store"), 520);
  }, [reduced, router]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <h1 className="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            Every stitch is
            <br />
            counted before
            <br />
            it is sold.
          </h1>

          <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
            Pins, bows and amigurumi, worked one row at a time in India. Nothing
            is mass-made, so nothing pretends to be in stock.
          </p>

          <div className="mt-8">
            <Button size="lg" onClick={open} className="px-4">
              Enter the workroom
            </Button>
            <p className="mt-3 font-mono text-[0.625rem] tracking-[0.1em] uppercase text-muted-foreground">
              no account needed
            </p>
          </div>
        </div>

        {/* the chart, and the zoom that opens it */}
        <motion.div
          className="order-1 origin-center will-change-transform lg:order-2"
          animate={
            opening
              ? { scale: 7, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.52, ease: [0.7, 0, 0.84, 0] }}
        >
          <StitchGridAnimated
            chart={theBow.chart}
            bodyColor={SWATCH_VAR[theBow.colourway.swatch]}
            knotColor={knotFor(theBow.colourway.swatch)}
            label="A bow worked as a graphgan chart, appearing one row at a time"
            delay={0.2}
          />
          <p className="stitch-line mt-3">
            {theBow.chart[0].length} sts across · {theBow.chart.length} rows ·
            worked bottom-up
          </p>
        </motion.div>
      </div>
    </section>
  );
}
