/**
 * A tiny channel between the DOM and the WebGL scene.
 *
 * Hovering a piece in the markup recolours the yarn in the canvas, so the two
 * layers behave like one object rather than a page with a decoration behind it.
 */

export type YarnState = {
  /** Hex colour of the strand. */
  color: string;
  /** Label shown under the object, e.g. a colourway name. */
  caption: string;
};

const DEFAULT: YarnState = { color: "#ddd5e2", caption: "undyed cotton" };

let state: YarnState = DEFAULT;
const listeners = new Set<(s: YarnState) => void>();

export function getYarn(): YarnState {
  return state;
}

export function setYarn(next: Partial<YarnState> | null) {
  state = next ? { ...state, ...next } : DEFAULT;
  for (const l of listeners) l(state);
}

export function resetYarn() {
  setYarn(null);
}

export function onYarn(cb: (s: YarnState) => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/* ── unravel channel ─────────────────────────────────────────────────────────
 * Kept separate from colour so the section driving it can fire every frame
 * without pushing React state.
 * ------------------------------------------------------------------------- */

let unravel = 0;
const unravelListeners = new Set<(n: number) => void>();

export function setUnravel(n: number) {
  unravel = Math.min(1, Math.max(0, n));
  for (const l of unravelListeners) l(unravel);
}

export function getUnravel(): number {
  return unravel;
}

export function onUnravel(cb: (n: number) => void) {
  unravelListeners.add(cb);
  return () => {
    unravelListeners.delete(cb);
  };
}

/* ── dive channel ────────────────────────────────────────────────────────────
 * The door. Opening it drives the camera into the strand so the catalogue
 * arrives from inside the fabric.
 * ------------------------------------------------------------------------- */

let diving = false;
const diveListeners = new Set<(d: boolean) => void>();

export function setDive(d: boolean) {
  diving = d;
  for (const l of diveListeners) l(d);
}

export function getDive(): boolean {
  return diving;
}

export function onDive(cb: (d: boolean) => void) {
  diveListeners.add(cb);
  return () => {
    diveListeners.delete(cb);
  };
}
