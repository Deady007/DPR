"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * The project bag.
 *
 * Guest-first: it lives in this browser and needs no account. Signing in later
 * adds queue visibility and reorder, it does not gate the bag.
 *
 * Lines are keyed by piece + dye lot, because a colourway from a different lot
 * is a different thing to make.
 *
 * localStorage is an external store, so it is read through
 * useSyncExternalStore rather than mirrored into state inside an effect. The
 * server snapshot is always empty, so the first paint matches on both sides and
 * the real bag arrives on hydration.
 */

export type BagLine = {
  slug: string;
  dyeLot: string;
  name: string;
  colourway: string;
  priceInr: number;
  qty: number;
};

const KEY = "project-bag/v1";
const EMPTY: BagLine[] = [];

let lines: BagLine[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function readStored(): BagLine[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BagLine[]) : EMPTY;
  } catch {
    // private window, cleared storage, or storage blocked outright
    return EMPTY;
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // the bag still works in memory for this page view
  }
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  if (!hydrated) {
    hydrated = true;
    lines = readStored();
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const getSnapshot = () => lines;
const getServerSnapshot = () => EMPTY;

function setLines(next: BagLine[]) {
  lines = next;
  persist();
  emit();
}

export function addLine(line: Omit<BagLine, "qty">) {
  const at = lines.findIndex(
    (l) => l.slug === line.slug && l.dyeLot === line.dyeLot,
  );
  if (at === -1) {
    setLines([...lines, { ...line, qty: 1 }]);
    return;
  }
  const next = [...lines];
  next[at] = { ...next[at], qty: next[at].qty + 1 };
  setLines(next);
}

export function removeLine(slug: string, dyeLot: string) {
  setLines(lines.filter((l) => !(l.slug === slug && l.dyeLot === dyeLot)));
}

export function useBag() {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // addLine/removeLine are module-level and already stable.
  return useMemo(
    () => ({
      lines: current,
      add: addLine,
      remove: removeLine,
      count: current.reduce((n, l) => n + l.qty, 0),
      totalInr: current.reduce((n, l) => n + l.qty * l.priceInr, 0),
    }),
    [current],
  );
}
