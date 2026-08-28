"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Crochet is worked in rows that alternate direction, so a reveal enters
 * left-to-right, then right-to-left, then left again.
 *
 * Transform and opacity only.
 *
 * The element structure is identical whether or not motion is reduced — only
 * the durations change. Swapping a motion element for a plain one across
 * hydration leaves the server's hidden inline style in place and the content
 * never appears; `.motion-reveal` in globals.css is the belt to this braces.
 */
export function RowReveal({
  children,
  row = 0,
  className,
}: {
  children: ReactNode;
  /** Row index. Even rows enter from the left, odd rows from the right. */
  row?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const fromLeft = row % 2 === 0;

  return (
    <motion.div
      className={`motion-reveal${className ? ` ${className}` : ""}`}
      initial={{ opacity: 0, x: fromLeft ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * A grid whose tiles land row by row, each row running the opposite way.
 *
 * `columns` is the widest breakpoint's column count; narrower viewports show a
 * slightly different sweep, which is acceptable — the direction alternation is
 * what carries the idea, not the exact cell order.
 */
export function GridReveal({
  children,
  columns,
  className,
}: {
  children: ReactNode[];
  columns: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div className={className}>
      {children.map((child, i) => {
        const row = Math.floor(i / columns);
        const col = i % columns;
        const order = row % 2 === 0 ? col : columns - 1 - col;

        return (
          <motion.div
            key={i}
            className="motion-reveal"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-48px" }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    duration: 0.4,
                    delay: row * 0.1 + order * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
