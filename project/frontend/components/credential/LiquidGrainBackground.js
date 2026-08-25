"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * Fused "liquid mass" background — base #002740 with a single blurred oil mass
 * of #205B80, a #6FB3DE sheen, rare #CEA871 gleams and a static micro grain.
 *
 * Sits behind the deck (fixed, pointer-events none) so slides can scroll over it.
 */

const MASS = "#205B80";
const SHEEN = "#6FB3DE";
const GLEAM = "206,168,113"; // #CEA871

// spring constants for the viscous follow
const K = 0.01;
const DAMP = 0.9;

const BLOB_DEFS = [
  { orbit: 0.0, o2: 0.0, r: 0.24, sp: 0.0, ph: 0.0, pr: 0.0, c: MASS, a: 1.0 },
  { orbit: 0.1, o2: 0.05, r: 0.2, sp: 0.06, ph: 0.5, pr: 0.6, c: MASS, a: 1.0 },
  { orbit: 0.13, o2: 0.06, r: 0.18, sp: 0.05, ph: 2.0, pr: 1.1, c: MASS, a: 1.0 },
  { orbit: 0.16, o2: 0.07, r: 0.16, sp: 0.07, ph: 3.4, pr: 1.7, c: MASS, a: 1.0 },
  { orbit: 0.19, o2: 0.08, r: 0.15, sp: 0.045, ph: 4.7, pr: 2.3, c: MASS, a: 1.0 },
  { orbit: 0.22, o2: 0.09, r: 0.13, sp: 0.08, ph: 5.9, pr: 2.9, c: MASS, a: 1.0 },
  { orbit: 0.25, o2: 0.1, r: 0.12, sp: 0.055, ph: 1.3, pr: 3.5, c: MASS, a: 1.0 },
  // soft diffuse highlight, drawn last at low alpha
  { orbit: 0.06, o2: 0.05, r: 0.11, sp: 0.09, ph: 1.0, pr: 1.0, c: SHEEN, a: 0.28 },
  { orbit: 0.09, o2: 0.06, r: 0.08, sp: 0.07, ph: 4.2, pr: 2.0, c: SHEEN, a: 0.2 },
];

// noise is generated once into a small tile and repeated — a full-screen
// ImageData at DPR 2 costs ~20MB and stalls the first paint.
const GRAIN_TILE = 256;

/** Tuned in the live tuner — every value here is a knob on the mass's look. */
export const DEFAULT_TUNING = {
  blur: 80, // px — how far the blobs melt into one mass
  opacity: 0.6, // strength of the mass against the navy ground
  massScale: 1, // multiplies every blob radius
  speed: 1, // morph/breathe rate (cursor-follow lag is unaffected)
  sheen: 1, // multiplier on the #6FB3DE highlight
  grain: 0.08, // film grain intensity
  sweep: 0.3, // × W the pooled mass travels either side of centre
  cycle: 27, // seconds for one full left → right → left tide
};

/* placement — ค่าเริ่มต้นคือคลุมทั้งจอแบบ fixed ตามที่เด็ค credential ใช้
   หน้า home ส่ง "absolute inset-0 z-0" มาแทน เพื่อให้อยู่แค่ในกรอบ Hero
   ไม่ใช่วิ่งอยู่หลังทั้งหน้าโดยที่ section อื่นบังไว้จนมองไม่เห็น */
export default function LiquidGrainBackground({
  className = "",
  tuning,
  placement = "fixed inset-0 -z-10",
}) {
  const liquidRef = useRef(null);
  const grainRef = useRef(null);
  const sparkRef = useRef(null);

  // the draw loop reads tuning through a ref so prop changes take effect
  // without tearing down and restarting the animation
  const tune = useMemo(() => ({ ...DEFAULT_TUNING, ...tuning }), [tuning]);
  const tuneRef = useRef(tune);
  useEffect(() => {
    tuneRef.current = tune;
  }, [tune]);

  useEffect(() => {
    const liquid = liquidRef.current;
    const grain = grainRef.current;
    const spark = sparkRef.current;
    if (!liquid || !grain || !spark) return;

    const bx = liquid.getContext("2d");
    const gx = grain.getContext("2d");
    const sx = spark.getContext("2d");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let DPR = 1;
    let MIN = 0;

    let blobs = [];
    let sparks = [];
    let nextSpark = 0;

    // pointer target / eased cursor
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let lastMove = -1e9;
    let breatheScale = 1;

    // idle behaviour runs as two phases: the mass falls under gravity, then
    // sloshes along the bottom edge
    let mode = "active"; // "active" | "falling" | "pooled"
    let vy = 0; // fall velocity, px/s
    let anchorX = 0; // x held during the fall so it drops straight down
    let theta = 0; // slosh phase

    let grainPattern = null;
    let raf = 0;
    let resizeTimer = 0;
    let t0 = 0; // previous frame timestamp; 0 means "restart the clock"
    let T = 0; // speed-scaled elapsed time driving the morph

    function buildGrainTile() {
      const tile = document.createElement("canvas");
      tile.width = tile.height = GRAIN_TILE;
      const tx2 = tile.getContext("2d");
      const img = tx2.createImageData(GRAIN_TILE, GRAIN_TILE);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      tx2.putImageData(img, 0, 0);
      grainPattern = gx.createPattern(tile, "repeat");
    }

    function drawGrain() {
      if (!grainPattern) buildGrainTile();
      gx.clearRect(0, 0, W, H);
      gx.fillStyle = grainPattern;
      gx.fillRect(0, 0, W, H); // 1 texel per device px = finest
    }

    function initBlobs() {
      blobs = BLOB_DEFS.map((d) => ({ ...d, x: cx || W / 2, y: cy || H / 2, vx: 0, vy: 0 }));
    }

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = liquid.width = grain.width = spark.width = Math.floor(window.innerWidth * DPR);
      H = liquid.height = grain.height = spark.height = Math.floor(window.innerHeight * DPR);
      MIN = Math.min(W, H);
      if (!cx) {
        tx = cx = W / 2;
        ty = cy = H / 2;
      }
      initBlobs();
      drawGrain();
    }

    const GRAVITY = 0.55; // × H per second² — roughly 1.5s to fall from mid-screen
    const FLOOR = () => H * 1.02; // resting centre, just past the bottom edge
    const DWELL = 0.7; // <1 holds the mass at each side instead of turning sharply

    /**
     * A sine flattened toward its extremes: the mass gathers against one side,
     * hangs there, then releases and flows across. A plain sine turns around
     * instantly at each end and reads metronomic.
     */
    function slosh(a) {
      const s = Math.sin(a);
      return Math.sign(s) * Math.abs(s) ** DWELL;
    }

    /** Phase whose slosh position matches x, on the branch heading left. */
    function entryPhase(x, sweep) {
      const v = Math.max(-1, Math.min(1, (x - W * 0.5) / (W * sweep)));
      const s = Math.sign(v) * Math.abs(v) ** (1 / DWELL);
      return Math.PI - Math.asin(s);
    }

    function updateTarget(now, t, dt) {
      const P = tuneRef.current;
      if (now - lastMove <= 1500) {
        // following the cursor
        if (mode !== "active") {
          mode = "active";
          vy = 0;
        }
        breatheScale += (1 - breatheScale) * 0.05;
        cx += (tx - cx) * 0.011;
        cy += (ty - cy) * 0.011;
        return;
      }

      breatheScale += (1 + Math.sin(t * 0.5) * 0.05 - breatheScale) * 0.05;

      if (mode === "active") {
        mode = "falling";
        anchorX = cx; // hold the column so it drops straight down, not diagonally
        vy = 0;
      }

      if (mode === "falling") {
        vy += GRAVITY * H * dt;
        cy += vy * dt;
        cx += (anchorX - cx) * 0.06; // bleed off sideways drift only
        if (cy >= FLOOR()) {
          cy = FLOOR();
          mode = "pooled";
          theta = entryPhase(cx, P.sweep); // pick up the slosh from where it landed
        }
        return;
      }

      // pooled — a slow tide along the bottom edge. The second, slower wave is
      // deliberately not a multiple of the first so the two never re-sync.
      theta += ((2 * Math.PI) / P.cycle) * dt;
      const s = slosh(theta);
      const drift = Math.sin(theta * 0.37 + 1.1) * 0.06;
      cx = W * (0.5 + s * P.sweep + drift);
      cy = FLOOR() - Math.abs(s) * H * 0.025 + Math.sin(theta * 2) * H * 0.012;
    }

    function drawLiquid(t) {
      const P = tuneRef.current;
      bx.clearRect(0, 0, W, H); // transparent => base navy shows through

      for (const b of blobs) {
        const a = t * b.sp + b.ph;
        const ox = (Math.cos(a) * b.orbit + Math.cos(a * 0.63 + b.ph) * b.o2) * MIN;
        const oy = (Math.sin(a * 1.07) * b.orbit + Math.sin(a * 0.54 + b.ph) * b.o2) * MIN;
        const targetX = cx + ox;
        const targetY = cy + oy;

        b.vx += (targetX - b.x) * K;
        b.vx *= DAMP;
        b.x += b.vx;
        b.vy += (targetY - b.y) * K;
        b.vy *= DAMP;
        b.y += b.vy;

        const rad = (b.r + Math.sin(t * 0.18 + b.pr) * 0.015) * MIN * breatheScale * P.massScale;

        // collide + flatten against the edges
        if (b.x < rad * 0.4) { b.x = rad * 0.4; b.vx *= -0.25; }
        if (b.x > W - rad * 0.4) { b.x = W - rad * 0.4; b.vx *= -0.25; }
        if (b.y < rad * 0.4) { b.y = rad * 0.4; b.vy *= -0.25; }
        if (b.y > H - rad * 0.4) { b.y = H - rad * 0.4; b.vy *= -0.25; }

        bx.globalAlpha = b.c === SHEEN ? Math.min(b.a * P.sheen, 1) : b.a;
        bx.fillStyle = b.c;
        bx.beginPath();
        bx.arc(b.x, b.y, rad, 0, Math.PI * 2);
        bx.fill(); // overlaps blend; the heavy CSS blur fuses them into one mass
      }
      bx.globalAlpha = 1;
    }

    function drawSpark(x, y, size, b) {
      const r = size * 10;
      const g = sx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${GLEAM},${0.4 * b})`);
      g.addColorStop(0.5, `rgba(${GLEAM},${0.14 * b})`);
      g.addColorStop(1, `rgba(${GLEAM},0)`);
      sx.fillStyle = g;
      sx.beginPath();
      sx.arc(x, y, r, 0, Math.PI * 2);
      sx.fill();
    }

    function updateSparks(now) {
      if (now > nextSpark) {
        // rare: every ~5-12s
        nextSpark = now + 5000 + Math.random() * 7000;
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * 0.24 * MIN;
        const drift = 0.006 * MIN;
        sparks.push({
          x: cx + Math.cos(ang) * dist,
          y: cy + Math.sin(ang) * dist,
          vx: (Math.random() - 0.5) * drift,
          vy: (Math.random() - 0.5) * drift,
          born: now,
          life: 2000 + Math.random() * 1600,
          ph: Math.random() * 100,
          size: (7 + Math.random() * 7) * DPR,
        });
      }
      sx.clearRect(0, 0, W, H);
      sx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        const p = (now - s.born) / s.life;
        if (p >= 1) { sparks.splice(i, 1); continue; }
        s.x += s.vx;
        s.y += s.vy;
        const env = Math.sin(p * Math.PI); // slow fade in/out
        const b = env * (0.82 + 0.18 * Math.sin(now * 0.02 + s.ph)); // soft shimmer
        if (b > 0) drawSpark(s.x, s.y, s.size, b);
      }
      sx.globalCompositeOperation = "source-over";
    }

    function frame(now) {
      // accumulate scaled time so `speed` changes the morph rate without
      // making the mass jump when the value is adjusted mid-flight
      const dt = t0 ? Math.min((now - t0) / 1000, 0.05) : 0;
      t0 = now;
      const dtT = dt * tuneRef.current.speed;
      T += dtT;
      updateTarget(now, T, dtT);
      drawLiquid(T);
      updateSparks(now);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (!raf && !reduced) raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function onPointerMove(e) {
      tx = e.clientX * DPR;
      ty = e.clientY * DPR;
      lastMove = performance.now();
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduced) drawLiquid(0);
      }, 150);
    }

    function onVisibility() {
      if (document.hidden) stop();
      else { t0 = 0; start(); }
    }

    resize();
    if (reduced) {
      // one settled frame, no animation loop — the pooled resting state
      cx = W * 0.5;
      cy = FLOOR();
      mode = "pooled";
      initBlobs();
      drawLiquid(0);
    } else {
      start();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`credential-bg ${placement} overflow-hidden bg-me-navy ${className}`}
    >
      <canvas
        ref={liquidRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ filter: `blur(${tune.blur}px)`, opacity: tune.opacity }}
      />
      <canvas
        ref={sparkRef}
        className="pointer-events-none absolute inset-0 h-full w-full blur-[30px]"
      />
      <canvas
        ref={grainRef}
        className="pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay"
        style={{ opacity: tune.grain }}
      />
    </div>
  );
}
