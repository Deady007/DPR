"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import {
  onYarn,
  getYarn,
  onUnravel,
  getUnravel,
  onDive,
  getDive,
} from "@/lib/yarn-signal";

/** Points per turn of the strand. Higher reads smoother, costs geometry. */
const STEPS = 220;
const TURNS = 14;

/**
 * One continuous strand, wound into a bow.
 *
 * A lemniscate gives two lobes — the bow's loops — and winding it nine times
 * with a drifting depth offset stacks the strands side by side the way yarn
 * actually lies. The whole object is a single tube, so revealing it along its
 * length is the same motion as working it: one strand, one direction.
 */
function strandPoints(): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const total = TURNS * STEPS;

  for (let i = 0; i <= total; i++) {
    const u = i / STEPS; // turn index, fractional
    const t = u * Math.PI * 2;
    const s = Math.sin(t);
    const c = Math.cos(t);
    const d = 1 + s * s; // lemniscate of Bernoulli

    const turnFrac = u / TURNS; // 0 → 1 across the winding
    // Fatter through the middle turns, so the bundle swells like wound yarn.
    const swell = 1 + Math.sin(turnFrac * Math.PI) * 0.17;
    // Each turn sits a little deeper than the last.
    const z = (turnFrac - 0.5) * 0.17 + Math.sin(t * 2) * 0.03;

    pts.push(
      new THREE.Vector3(
        (c / d) * 2.75 * swell,
        ((s * c) / d) * 2.0 * swell,
        z,
      ),
    );
  }
  return pts;
}

/**
 * The knot. A tight coil around the waist of the bundle, which is what makes
 * the shape read as a tied bow rather than a figure eight.
 */
function knotPoints(): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const turns = 6;
  const steps = 60;
  const total = turns * steps;
  for (let i = 0; i <= total; i++) {
    const u = i / steps;
    const t = u * Math.PI * 2;
    const x = (u / turns - 0.5) * 0.36;
    pts.push(new THREE.Vector3(x, Math.cos(t) * 0.36, Math.sin(t) * 0.26));
  }
  return pts;
}

/**
 * A tail. Two of these fall from the knot, which is the other half of reading
 * the shape as a tied bow rather than a loop.
 */
function tailPoints(sign: 1 | -1): THREE.Vector3[] {
  return [
    new THREE.Vector3(0, -0.18, 0.06),
    new THREE.Vector3(sign * 0.34, -0.78, 0.02),
    new THREE.Vector3(sign * 0.46, -1.42, -0.06),
    new THREE.Vector3(sign * 0.86, -1.92, -0.02),
    new THREE.Vector3(sign * 1.16, -2.24, 0.08),
  ];
}

/**
 * Plied yarn is twisted, and that twist is what the eye uses to tell fibre from
 * tubing. Generated rather than fetched: diagonal ridges, repeated hard along
 * the length of the tube.
 */
function twistNormalMap(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Ridge running diagonally: the ply angle.
      const phase = ((x + y * 2.2) / size) * Math.PI * 2 * 6;
      const nx = Math.cos(phase) * 0.85;
      const nz = 1;
      const len = Math.hypot(nx, nz);
      const i = (y * size + x) * 4;
      img.data[i] = ((nx / len) * 0.5 + 0.5) * 255;
      img.data[i + 1] = 0.5 * 255;
      img.data[i + 2] = ((nz / len) * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(90, 3);
  return tex;
}

export function YarnCanvas() {
  const host = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  /**
   * No WebGL: reveal the text fallback by hand rather than through state.
   * Setting state straight from an effect body is a re-render the browser has
   * to pay for before it has painted anything.
   */
  const showFallback = () => {
    wrap.current?.querySelector("[data-fallback]")?.classList.remove("hidden");
  };

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      showFallback();
      return;
    }
    if (!renderer.getContext()) {
      showFallback();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.62;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      38,
      el.clientWidth / el.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, -0.5, 10.1);

    // Soft studio reflections without shipping an HDR file.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.06);
    scene.environment = envRT.texture;

    /* ── the strand ─────────────────────────────────────────────────────── */
    const curve = new THREE.CatmullRomCurve3(strandPoints(), false, "centripetal");
    const geometry = new THREE.TubeGeometry(curve, TURNS * STEPS, 0.029, 8, false);

    const twist = twistNormalMap();

    const material = new THREE.MeshPhysicalMaterial({
      normalMap: twist,
      normalScale: new THREE.Vector2(0.75, 0.75),
      color: new THREE.Color(getYarn().color),
      roughness: 0.92,
      metalness: 0,
      // Yarn is fabric, not plastic: sheen is what sells it.
      sheen: 0.55,
      sheenRoughness: 0.7,
      sheenColor: new THREE.Color("#ffffff"),
      envMapIntensity: 0.3,
    });

    const strandMesh = new THREE.Mesh(geometry, material);

    const knotGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(knotPoints(), false, "centripetal"),
      420,
      0.033,
      7,
      false,
    );
    const knot = new THREE.Mesh(knotGeo, material);
    knot.scale.setScalar(reduced ? 1 : 0.001);

    const tailGeos = ([1, -1] as const).map((sign) =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(tailPoints(sign), false, "centripetal"),
        160,
        0.029,
        7,
        false,
      ),
    );
    const tails = tailGeos.map((g) => {
      const m = new THREE.Mesh(g, material);
      m.scale.setScalar(reduced ? 1 : 0.001);
      return m;
    });

    // One object: the bow, the knot that holds it, and the tails.
    const strand = new THREE.Group();
    strand.add(strandMesh, knot, ...tails);
    scene.add(strand);

    const indexCount = geometry.index?.count ?? 0;
    geometry.setDrawRange(0, reduced ? indexCount : 0);

    /* ── light ──────────────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.09));

    const key = new THREE.DirectionalLight(0xfff6ee, 1.25);
    key.position.set(3.2, 4.2, 5);
    scene.add(key);

    const rimTeal = new THREE.PointLight(0x1f7a6b, 11, 14, 2);
    rimTeal.position.set(-3.6, -1.4, 2.4);
    scene.add(rimTeal);

    const rimPink = new THREE.PointLight(0xe8548a, 9, 14, 2);
    rimPink.position.set(3.4, -2.2, -1.8);
    scene.add(rimPink);

    const rimGold = new THREE.PointLight(0xf0b429, 5, 12, 2);
    rimGold.position.set(0.6, 3.2, -2.6);
    scene.add(rimGold);

    /* ── bloom ──────────────────────────────────────────────────────────── */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(el.clientWidth, el.clientHeight),
      0.07,
      0.45,
      0.96,
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    composer.setSize(el.clientWidth, el.clientHeight);

    /* ── interaction state ──────────────────────────────────────────────── */
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let scrollN = 0; // 0 at top of document, 1 after one viewport
    let built = reduced ? 1 : 0;
    let running = true;
    const started = performance.now();

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onScroll = () => {
      scrollN = window.scrollY / Math.max(1, window.innerHeight);
    };

    // Keep the object clear of the headline on wide screens.
    const placeStrand = () => {
      const wide = el.clientWidth >= 1024;
      strand.position.x = wide ? 1.5 : 0;
      strand.position.y = wide ? 0 : -0.35;
    };
    placeStrand();

    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      placeStrand();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) tick();
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    let dive = getDive();
    const stopDive = onDive((d) => {
      dive = d;
    });

    // Driven by the unravel section's own scroll progress, not a global guess.
    let unravelN = getUnravel();
    const stopUnravel = onUnravel((n) => {
      unravelN = n;
    });

    const stopYarn = onYarn((s) => {
      material.color.set(s.color);
      material.sheenColor.set(s.color).lerp(new THREE.Color("#ffffff"), 0.65);
    });

    /* ── frame ──────────────────────────────────────────────────────────── */
    let raf = 0;
    const clock = new THREE.Clock();

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!running) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = (performance.now() - started) / 1000;

      if (!reduced) {
        // Work the strand up over the first couple of seconds, then hold.
        const intro = Math.min(1, Math.max(0, (elapsed - 0.35) / 2.1));
        // Past the first screen, the strand unravels back towards a line.
        built = intro * (1 - unravelN * 0.88);
        geometry.setDrawRange(0, Math.floor(indexCount * built));

        // Pointer parallax, eased so it never snaps.
        eased.x += (pointer.x - eased.x) * Math.min(1, dt * 3.4);
        eased.y += (pointer.y - eased.y) * Math.min(1, dt * 3.4);

        const knotIn = Math.min(1, Math.max(0, (built - 0.62) / 0.22));
        knot.scale.setScalar(Math.max(0.001, knotIn));
        const tailIn = Math.min(1, Math.max(0, (built - 0.8) / 0.2));
        for (const t of tails) t.scale.setScalar(Math.max(0.001, tailIn));

        strand.rotation.y = eased.x * 0.28 + Math.sin(elapsed * 0.16) * 0.1 + scrollN * 0.4;
        strand.rotation.x = -eased.y * 0.2 + scrollN * 0.18;
        strand.rotation.z = Math.sin(elapsed * 0.25) * 0.04;

        // The door: drive the camera into the strand.
        const restZ = 10.1 + scrollN * 2.6;
        const wantZ = dive ? 0.9 : restZ;
        camera.position.z += (wantZ - camera.position.z) * (dive ? 0.09 : 0.12);
        camera.position.x = eased.x * 0.34;
        camera.position.y = -eased.y * 0.24;
        camera.lookAt(0, -0.5, 0);

        bloom.strength += ((dive ? 0.7 : 0.07) - bloom.strength) * 0.08;
      }

      composer.render();
    }

    function tick() {
      cancelAnimationFrame(raf);
      frame();
    }

    onScroll();
    if (reduced) {
      // One frame, held. No loop, no motion.
      strand.rotation.set(-0.1, 0.5, 0.03);
      composer.render();
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      stopYarn();
      stopUnravel();
      stopDive();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      knotGeo.dispose();
      for (const g of tailGeos) g.dispose();
      material.dispose();
      twist.dispose();
      envRT.texture.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el)
        el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* A pool of light behind the object, so the void has a centre. */}
      <div
        className="absolute top-1/2 left-1/2 h-[62vmin] w-[62vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px] lg:left-[62%]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 30%, transparent), transparent 70%)",
        }}
      />
      <div ref={host} className="absolute inset-0" />
      <div
        data-fallback
        className="absolute inset-0 hidden items-center justify-center"
      >
        <p className="stitch-line">
          one continuous strand · 2,140 sts · 6h 40m
        </p>
      </div>
    </div>
  );
}
