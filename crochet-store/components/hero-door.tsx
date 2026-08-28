"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { setDive } from "@/lib/yarn-signal";

/**
 * The hero, and the door.
 *
 * No veil and almost no furniture — the strand behind is the hero, and the type
 * sits at the edges of it. Opening the door drives the camera into the yarn and
 * then routes, so the catalogue arrives from inside the fabric. Under
 * prefers-reduced-motion the door simply routes.
 */
export function HeroDoor() {
  const router = useRouter();
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    router.prefetch("/store");
  }, [router]);

  const open = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push("/store");
      return;
    }
    setOpening(true);
    setDive(true);
    window.setTimeout(() => router.push("/store"), 640);
  }, [router]);

  useEffect(() => () => setDive(false), []);

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between px-5 pt-28 pb-10 sm:px-10 sm:pb-14">
      <div className="max-w-[38rem]">
        <p className="label">handmade to order · india</p>

        <h1 className="display mt-6 text-[clamp(3.25rem,10vw,8rem)]">
          Every
          <br />
          stitch
          <br />
          counted.
        </h1>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-8">
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Pins, bows and amigurumi, worked by hand in India. Made to order, so
          nothing here pretends to be in stock.
        </p>

        <div className="flex flex-col items-start gap-3">
          <button
            type="button"
            onClick={open}
            disabled={opening}
            className="group relative overflow-hidden border border-border px-7 py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {/* the fill wipes in from the left, the way a row is worked */}
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-bone transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
            <span className="relative font-mono text-xs tracking-[0.16em] uppercase transition-colors duration-300 group-hover:text-void group-focus-visible:text-void">
              {opening ? "opening" : "Enter the workroom"}
            </span>
          </button>
          <span className="label">no account needed</span>
        </div>
      </div>

      {/* scroll cue */}
      <div aria-hidden className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="label">scroll</span>
        <span className="block h-12 w-px overflow-hidden bg-border">
          <span className="cue block h-full w-px bg-bone" />
        </span>
      </div>

      <style jsx>{`
        .cue {
          animation: fall 2.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes fall {
          0% {
            transform: translateY(-100%);
          }
          60%,
          100% {
            transform: translateY(100%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cue {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
