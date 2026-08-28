"use client";

import { useEffect, useRef } from "react";

/**
 * A ring that trails the pointer and swells over anything clickable.
 *
 * The native cursor stays visible — hiding it looks slick and costs people who
 * rely on it. Skipped entirely on touch and under reduced motion.
 */
export function CursorRing() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const at = { ...target };
    let scale = 1;
    let scaleTarget = 1;
    let raf = 0;

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const over = (e.target as Element | null)?.closest(
        "a, button, [role='button'], input, select, textarea",
      );
      scaleTarget = over ? 2.1 : 1;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      at.x += (target.x - at.x) * 0.16;
      at.y += (target.y - at.y) * 0.16;
      scale += (scaleTarget - scale) * 0.14;
      el.style.transform = `translate3d(${at.x}px, ${at.y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    el.style.opacity = "1";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70] size-7 rounded-full border opacity-0 mix-blend-difference transition-opacity duration-500"
      style={{ borderColor: "color-mix(in oklab, var(--bone) 55%, transparent)" }}
    />
  );
}
