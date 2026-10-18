"use client";

import { useEffect, useRef } from "react";

/**
 * The Business Mastery hero background — "Constellation".
 *
 * Rendered by the page's own hero and by the homepage block that links to it
 * (components/sections/BusinessMasterySection.tsx), so the doorway and the
 * destination share a background rather than two takes on one palette. Nothing
 * here is sized against the viewport — the field is derived from whatever box
 * it is handed — so the shorter homepage band composes as its own frame.
 *
 * Nodes drift, a line appears between any two that come close enough, and a
 * signal travels down one of those lines every second or so. The page's next
 * section is titled "Nobody Builds Something Great Alone" and lands on a single
 * word — Network — so this is the one background on the site that argues the
 * page's own thesis before a visitor reads a sentence.
 *
 * Two craft carry the second half of the promise, "Speedrun Your Way to
 * Success". They are not a separate effect sharing the frame: a craft passing
 * near a node *flares* it, and the flare spreads to every line that node owns,
 * so the network lights up in the wake. That is the argument the page makes in
 * prose — you move fast *because* of the network — and it is the reason the two
 * ideas are allowed in one frame at all. Decouple them and this becomes a
 * particle web with spaceships on it, which is a different, worse background.
 *
 * The craft themselves are drawn rather than suggested: a lance hull with
 * swept wings, a canopy cut from the ground colour, twin engines and a
 * contrail off each one, at roughly 28px nose to tail. An earlier pass drew
 * them as bare 16px arrowheads, on the argument that a recognisable ship would
 * undercut a page selling business credibility. It undersold them instead — at
 * that size two gold slivers crossing a gold field read as debris rather than
 * as something going somewhere, which is the one thing they are here to say.
 * What keeps them page-appropriate is not the absence of detail but the
 * palette: every part of a craft is the page's own accent, the canopy is the
 * hero's own background colour, and there are still only two of them, entering
 * seconds apart.
 *
 * Why canvas rather than the CSS this site prefers. The links cannot be
 * authored: which pairs are joined changes every frame, and the flare has to
 * cross from a craft to a node to that node's lines. That is a per-frame
 * computation over ~1,400 pairs, which is trivial for canvas and impossible for
 * a stylesheet. Everything else about the hero stays server-rendered — this
 * component is the hero's only client boundary.
 *
 * The costs that were actually measured and are deliberate:
 *   - `devicePixelRatio` is capped at 2. Beyond that the fill rate triples for
 *     a field of 1px lines nobody can see the difference in.
 *   - `shadowBlur` is the single most expensive call here, so it is spent only
 *     on hubs, live pulses and the three lit parts of a craft — never on the
 *     ordinary nodes, and never on a contrail.
 *   - The loop stops entirely when the hero leaves the viewport, and when the
 *     tab is hidden. A background nobody is looking at costs nothing.
 *
 * Positions are stored normalised 0–1 and multiplied up each frame, so a
 * resize re-frames the constellation instead of re-seeding it — dragging a
 * window never causes the field to jump.
 */

/**
 * The field's colours, as "r, g, b" channels. They live on `.bmc-field` in
 * app/globals.css (`--bmc-*`), so the light theme can re-point them, and are
 * read back at draw time; these are the dark values, used until then.
 *
 * `gold` is the page's accent (platinum in dark, navy in light; the names
 * are from when it was gold), and `lit` the brighter tone used for anything
 * lit. `hot` is the engine cores only: a flame in the hull's own colour reads
 * as a shape stuck to the hull, so it has to run hotter than anything else
 * on the craft to read as light. `glow` is the shadow colour. `canopy` is
 * `.bmc-field`'s ground rather than mixed here: it is a hole in the hull, so
 * it has to be the thing behind it. `links` scales the links' alpha: a 1px
 * navy line on a pale ground reads fainter than the same alpha of gold on
 * black.
 */
type Palette = {
  gold: string;
  lit: string;
  hot: string;
  glow: string;
  canopy: string;
  links: number;
};

const DARK_PALETTE: Palette = {
  gold: "201,162,75",
  lit: "245,245,244",
  hot: "255,255,255",
  glow: "201,198,194",
  canopy: "14,15,17",
  links: 1,
};

function readPalette(el: Element): Palette {
  const style = getComputedStyle(el);
  const read = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;
  return {
    gold: read("--bmc-gold", DARK_PALETTE.gold),
    lit: read("--bmc-gold-lit", DARK_PALETTE.lit),
    hot: read("--bmc-gold-hot", DARK_PALETTE.hot),
    glow: read("--bmc-glow", DARK_PALETTE.glow),
    canopy: read("--bmc-canopy", DARK_PALETTE.canopy),
    links: Number(read("--bmc-links", "1")) || 1,
  };
}

/**
 * The palette lives here rather than in `data/business-mastery.ts` because
 * that file is the owner's copy, confirmed line by line, and nothing in it is
 * presentational. This component is the only consumer of these values.
 */
const FIELD = {
  /** Node count. The phone figure is not a performance concession — a 46-node
   *  field on a 390px-wide hero reads as noise rather than as a network. */
  nodes: { wide: 54, narrow: 30 },
  narrowBelow: 560,
  /** Every Nth node is a hub: drawn larger, lit, and it strengthens its links. */
  hubEvery: 8,
  /**
   * Link radius, as a multiple of the mean distance between nodes — not as a
   * fraction of the frame, which is the obvious version and is wrong. Taking
   * it off the frame's short side gives a phone a radius several times its own
   * node spacing, and the field solidifies into a mesh; behind a centred copy
   * column every line that crosses a letterform then reads as strikethrough.
   * Derived from spacing, the field has the same density at every size.
   */
  linkSpacing: 1.15,
  linkMin: 80,
  linkMax: 200,
  /** Normalised units per second. At 0.022 a node crosses the frame in about
   *  45 seconds, which is drift rather than travel. */
  drift: 0.022,
} as const;

const PULSE = {
  /** Seconds between signals, randomised inside this range. */
  gapMin: 0.9,
  gapMax: 1.5,
  /** Seconds for one signal to travel its link. */
  travel: 1.4,
} as const;

const CRAFT = {
  count: 2,
  /** Normalised units per second: a crossing takes roughly 2.5s. */
  speed: 0.4,
  /** Radians per second of gentle arc, so a run is never a ruled line. Kept
   *  low deliberately: at 0.16 a craft could bend far enough to leave through
   *  the top edge a third of the way across, which reads as a glitch rather
   *  than as a crossing. */
  turn: 0.1,
  /**
   * Scale unit in px. The craft measures about 1.6x this nose to tail and 1.4x
   * across the wings, so 17 draws a ~28px craft. Sized against the copy rather
   * than against the nodes: much under 15 and the canopy and wings stop
   * resolving, leaving a smudge where the detail was, and much over 21 a craft
   * crossing near the headline starts competing with it. The phone figure is
   * the same silhouette held at the bottom of that range, because the hero it
   * crosses is a third of the width.
   */
  size: { wide: 17, narrow: 12 },
  /** Engine offset from the centreline, in units of `size`. Also where each
   *  contrail is laid, so the exhaust leaves the engine it belongs to. */
  engineSpread: 0.17,
  /** Seconds of trail kept behind the nose. */
  trail: 0.42,
  /** Seconds a craft waits off-frame before its next run. */
  restMin: 2.6,
  restMax: 6.4,
  /** Flare radius in px, and how fast a flared node cools (units per second).
   *  The decay is slow enough that the wake is still visible a beat after the
   *  craft has gone — that lag is what makes the network look like it reacted
   *  to something rather than lighting up on a timer. */
  flareRadius: 145,
  flareDecay: 1.2,
} as const;

/** Squared, so the flare test rejects most nodes without taking a root. */
const FLARE_RADIUS_SQ = CRAFT.flareRadius * CRAFT.flareRadius;

/** Each side of a craft's centreline: wings, engines, wingtips and contrails
 *  are drawn once per side. */
const SIDES = [1, -1] as const;

/** A contrail's two strokes, as [peak alpha, width in units of `size`]: a wide
 *  dim pass under a narrow bright one. */
const CONTRAIL_PASSES = [
  [0.2, 0.17],
  [0.55, 0.06],
] as const;

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hub: boolean;
  /** 0–1, raised by a passing craft and decaying every frame. */
  flare: number;
};

type Pulse = { a: number; b: number; t: number };

/** `a` is the heading the point was shed at: the two contrails are offset from
 *  it, so without it they would scissor apart through a turn. */
type TrailPoint = { x: number; y: number; a: number; age: number };

type Craft = {
  x: number;
  y: number;
  /** Heading in radians. */
  a: number;
  /** Radians per second; sign fixed at spawn so a run arcs one way only. */
  turn: number;
  trail: TrailPoint[];
  /** Seconds until this craft enters the frame again. Zero means it is flying. */
  rest: number;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/**
 * A craft always enters from the left or right edge on a near-horizontal
 * heading. Vertical entries were tried and read as falling rather than as
 * travelling, which is the opposite of the word this is illustrating.
 */
function launch(craft: Craft) {
  const fromLeft = Math.random() < 0.5;
  craft.x = fromLeft ? -0.08 : 1.08;
  craft.y = randomBetween(0.12, 0.88);
  // ±11° of the horizontal, pointed into the frame.
  const spread = randomBetween(-0.2, 0.2);
  craft.a = fromLeft ? spread : Math.PI - spread;
  craft.turn = (Math.random() < 0.5 ? -1 : 1) * CRAFT.turn;
  craft.trail.length = 0;
  craft.rest = 0;
}

/**
 * Launches a craft held off-frame by its place in the pair, so the two never
 * enter together; one crossing at a time is an event, two is traffic.
 */
function launchStaggered(craft: Craft, index: number) {
  launch(craft);
  craft.rest = index * randomBetween(2, 4);
}

export function BmHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let craft: Craft[] = [];
    let nextPulse: number = PULSE.gapMin;
    let visible = true;
    let frame = 0;
    let last = 0;
    let palette = readPalette(canvas);

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      const count =
        width < FIELD.narrowBelow ? FIELD.nodes.narrow : FIELD.nodes.wide;
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 2 * FIELD.drift,
        vy: (Math.random() - 0.5) * 2 * FIELD.drift,
        hub: i % FIELD.hubEvery === 0,
        flare: 0,
      }));
      pulses = [];
      craft = Array.from({ length: CRAFT.count }, (_, i) => {
        const unit: Craft = { x: 0, y: 0, a: 0, turn: 0, trail: [], rest: 0 };
        launchStaggered(unit, i);
        return unit;
      });
    };

    /** One craft: advance, arc, shed trail, flare what it passes. */
    const advanceCraft = (unit: Craft, dt: number) => {
      if (unit.rest > 0) {
        unit.rest -= dt;
        if (unit.rest <= 0) launch(unit);
        return;
      }

      unit.a += unit.turn * dt;
      unit.x += Math.cos(unit.a) * CRAFT.speed * dt;
      unit.y += Math.sin(unit.a) * CRAFT.speed * dt;

      unit.trail.unshift({ x: unit.x, y: unit.y, a: unit.a, age: 0 });
      for (const point of unit.trail) point.age += dt;
      while (
        unit.trail.length &&
        unit.trail[unit.trail.length - 1].age > CRAFT.trail
      ) {
        unit.trail.pop();
      }

      // The whole reason both ideas share a frame: the network responds.
      const cx = unit.x * width;
      const cy = unit.y * height;
      for (const node of nodes) {
        const dx = node.x * width - cx;
        const dy = node.y * height - cy;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < FLARE_RADIUS_SQ) {
          const distance = Math.sqrt(distanceSq);
          node.flare = Math.max(node.flare, 1 - distance / CRAFT.flareRadius);
        }
      }

      const gone =
        unit.x < -0.2 || unit.x > 1.2 || unit.y < -0.25 || unit.y > 1.25;
      if (gone) {
        unit.rest = randomBetween(CRAFT.restMin, CRAFT.restMax);
        unit.trail.length = 0;
      }
    };

    /**
     * Heading in *pixel* space. Position and velocity are normalised, so on a
     * hero wider than it is tall a craft travelling at `a` is seen to travel
     * at a shallower angle than `a`. A symmetrical arrowhead got away with
     * that; a craft with wings and two exhausts cannot — it would fly visibly
     * crabbed, and its contrails would leave the engines at an angle. So
     * anything drawn takes the heading the motion actually produces on screen.
     */
    const screenHeading = (a: number) =>
      Math.atan2(Math.sin(a) * height, Math.cos(a) * width);

    const craftSize = () =>
      width < FIELD.narrowBelow ? CRAFT.size.narrow : CRAFT.size.wide;

    const drawCraft = (unit: Craft) => {
      if (unit.rest > 0) return;

      const size = craftSize();
      const spread = size * CRAFT.engineSpread;

      // Contrails first, so the craft sits on top of its own exhaust. One per
      // engine: every point is pushed off the flight path by the heading it
      // was shed at, which is what keeps the pair parallel through an arc.
      //
      // Each is one stroked polyline under a gradient, not a run of per-point
      // segments with their own alpha. The per-point version is the obvious
      // one and it beads: round caps bulge at every joint and the translucent
      // ends overlap, so a contrail comes out as a string of dots rather than
      // as a line. It also cost ~100 strokes a frame against this one's 8.
      // The taper is carried by the gradient instead of by the width, and a
      // wide dim pass under a narrow bright one is what makes the exhaust
      // look like it disperses behind the craft.
      if (unit.trail.length > 1) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (const side of SIDES) {
          const push = spread * side;
          // The head (first point) and tail (last) anchor the gradient.
          let hx = 0;
          let hy = 0;
          let tx = 0;
          let ty = 0;
          ctx.beginPath();
          for (let i = 0; i < unit.trail.length; i++) {
            const point = unit.trail[i];
            const heading = screenHeading(point.a);
            tx = point.x * width - Math.sin(heading) * push;
            ty = point.y * height + Math.cos(heading) * push;
            if (i === 0) {
              hx = tx;
              hy = ty;
              ctx.moveTo(tx, ty);
            } else {
              ctx.lineTo(tx, ty);
            }
          }
          for (const [alpha, weight] of CONTRAIL_PASSES) {
            const fade = ctx.createLinearGradient(hx, hy, tx, ty);
            fade.addColorStop(0, `rgba(${palette.lit},${alpha})`);
            fade.addColorStop(1, `rgba(${palette.lit},0)`);
            ctx.strokeStyle = fade;
            ctx.lineWidth = size * weight;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      ctx.save();
      ctx.translate(unit.x * width, unit.y * height);
      ctx.rotate(screenHeading(unit.a));

      // Wings, swept hard back and drawn first so the hull covers their roots
      // and the join never shows as a seam. Held below the hull's brightness:
      // at this size a wing lit like the hull doubles the craft's apparent
      // width and it stops reading as something pointed.
      ctx.beginPath();
      for (const side of SIDES) {
        ctx.moveTo(size * 0.3, size * 0.07 * side);
        ctx.lineTo(size * -0.22, size * 0.7 * side);
        ctx.lineTo(size * -0.58, size * 0.62 * side);
        ctx.lineTo(size * -0.5, size * 0.1 * side);
        ctx.closePath();
      }
      ctx.fillStyle = `rgba(${palette.gold},0.6)`;
      ctx.fill();
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(0.75, size * 0.055);
      ctx.strokeStyle = `rgba(${palette.lit},0.72)`;
      ctx.stroke();

      // Hull: a lance with a notched tail, the brightest thing on the craft
      // and the only part carrying the outer glow.
      ctx.beginPath();
      ctx.moveTo(size * 1.05, 0);
      ctx.lineTo(size * 0.34, size * 0.17);
      ctx.lineTo(size * -0.4, size * 0.23);
      ctx.lineTo(size * -0.58, size * 0.16);
      ctx.lineTo(size * -0.46, 0);
      ctx.lineTo(size * -0.58, size * -0.16);
      ctx.lineTo(size * -0.4, size * -0.23);
      ctx.lineTo(size * 0.34, size * -0.17);
      ctx.closePath();
      ctx.shadowColor = `rgba(${palette.glow},0.9)`;
      ctx.shadowBlur = size * 0.8;
      ctx.fillStyle = `rgba(${palette.lit},0.96)`;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Canopy. Set into the widest part of the hull rather than onto the nose
      // — pushed forward it overruns the taper and reads as a blob stuck to a
      // spike. Kept translucent, so the hull still shows through: it is the
      // one line of detail that stops a lit gold silhouette from reading as a
      // solid lozenge.
      ctx.beginPath();
      ctx.ellipse(size * 0.2, 0, size * 0.3, size * 0.105, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${palette.canopy},0.62)`;
      ctx.fill();

      // Twin engines, sunk into the tail notch and running hotter than the
      // hull — the one place on the craft that is meant to read as light
      // rather than as lit metal. Second of the three blurs a craft is
      // allowed.
      ctx.shadowColor = `rgba(${palette.glow},0.95)`;
      ctx.shadowBlur = size * 0.55;
      ctx.fillStyle = `rgba(${palette.hot},0.95)`;
      for (const side of SIDES) {
        ctx.beginPath();
        ctx.arc(size * -0.5, spread * side, size * 0.09, 0, Math.PI * 2);
        ctx.fill();
      }

      // Wingtip lights: about a pixel of spark each, and the third blur. They
      // are what fixes the wingspan for the eye — unlit, the wings fall away
      // into the field behind them and the craft loses half its width.
      ctx.shadowBlur = size * 0.3;
      ctx.fillStyle = `rgba(${palette.lit},0.9)`;
      for (const side of SIDES) {
        ctx.beginPath();
        ctx.arc(size * -0.4, size * 0.66 * side, size * 0.055, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const step = (dt: number) => {
      if (!width || !height) return;

      for (const node of nodes) {
        node.x += node.vx * dt;
        node.y += node.vy * dt;
        if (node.x < -0.05) node.x = 1.05;
        else if (node.x > 1.05) node.x = -0.05;
        if (node.y < -0.05) node.y = 1.05;
        else if (node.y > 1.05) node.y = -0.05;
        node.flare = Math.max(0, node.flare - CRAFT.flareDecay * dt);
      }

      for (const unit of craft) advanceCraft(unit, dt);

      ctx.clearRect(0, 0, width, height);

      const spacing = Math.sqrt((width * height) / nodes.length);
      const link = Math.min(
        FIELD.linkMax,
        Math.max(FIELD.linkMin, spacing * FIELD.linkSpacing),
      );

      const linkSq = link * link;

      // A signal is due every second or so, and the link it travels is picked
      // while the links are drawn rather than from a list of them built every
      // frame. Reservoir sampling: the nth link replaces the pick with
      // probability 1/n, so every link is equally likely.
      nextPulse -= dt;
      const pulseDue = nextPulse <= 0;
      let pickA = -1;
      let pickB = -1;
      let linkCount = 0;

      // Links.
      ctx.lineWidth = 1;
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const dx = (nodes[a].x - nodes[b].x) * width;
          const dy = (nodes[a].y - nodes[b].y) * height;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq >= linkSq) continue;
          if (pulseDue && Math.random() * ++linkCount < 1) {
            pickA = a;
            pickB = b;
          }

          const distance = Math.sqrt(distanceSq);
          let alpha = (1 - distance / link) * 0.4;
          if (nodes[a].hub || nodes[b].hub) alpha *= 1.6;
          // The wake. A flared node brightens every line it owns, which is
          // what makes a craft look like it is travelling *through* something.
          const flare = Math.max(nodes[a].flare, nodes[b].flare);
          alpha += flare * 0.6;
          alpha *= palette.links;

          ctx.strokeStyle = `rgba(${palette.gold},${Math.min(alpha, 0.9).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(nodes[a].x * width, nodes[a].y * height);
          ctx.lineTo(nodes[b].x * width, nodes[b].y * height);
          ctx.stroke();
        }
      }

      // Signals.
      if (pickA >= 0) {
        pulses.push({ a: pickA, b: pickB, t: 0 });
        nextPulse = randomBetween(PULSE.gapMin, PULSE.gapMax);
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.t += dt / PULSE.travel;
        if (pulse.t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const from = nodes[pulse.a];
        const to = nodes[pulse.b];
        const px = (from.x + (to.x - from.x) * pulse.t) * width;
        const py = (from.y + (to.y - from.y) * pulse.t) * height;
        // Fades in and out across its run, so it never pops at either end.
        const fade = Math.sin(pulse.t * Math.PI);
        ctx.save();
        ctx.shadowColor = `rgba(${palette.glow},0.9)`;
        ctx.shadowBlur = 9;
        ctx.fillStyle = `rgba(${palette.lit},${(0.95 * fade).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Nodes. Only a lit node touches shadow state, so only a lit node pays
      // for a save/restore; an unlit one sets nothing but fillStyle, which
      // every draw here sets for itself.
      for (const node of nodes) {
        const lit = node.hub || node.flare > 0.02;
        if (lit) {
          ctx.save();
          ctx.shadowColor = `rgba(${palette.glow},${0.85 * Math.max(node.flare, node.hub ? 1 : 0)})`;
          ctx.shadowBlur = node.hub ? 10 : 8 * node.flare;
        }
        const alpha = (node.hub ? 0.95 : 0.55) + node.flare * 0.45;
        ctx.fillStyle = `rgba(${node.hub || node.flare > 0.3 ? palette.lit : palette.gold},${Math.min(alpha, 1).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(
          node.x * width,
          node.y * height,
          (node.hub ? 2.6 : 1.4) + node.flare * 1.8,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        if (lit) ctx.restore();
      }

      for (const unit of craft) drawCraft(unit);
    };

    const loop = (time: number) => {
      // Clamped so a stalled main thread cannot hand back one enormous step
      // and teleport every craft across the frame. A hidden tab or an
      // offscreen hero never gets here as a gap: the loop is stopped then,
      // and start() drops the old timestamp.
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0;
      last = time;
      step(dt);
      frame = window.requestAnimationFrame(loop);
    };

    measure();
    seed();

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const start = () => {
      if (frame) return;
      last = 0;
      frame = window.requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    /** Runs the loop only while it can be seen: the canvas near the viewport,
     *  the tab in front, and motion allowed. */
    const sync = () => {
      if (
        visible &&
        document.visibilityState === "visible" &&
        !motionQuery.matches
      ) {
        start();
      } else {
        stop();
      }
    };

    /**
     * Under reduced motion the field is composed once and left there. A single
     * `step(0)` advances nothing and draws everything, so the visitor gets the
     * constellation as a still image rather than an empty black hero — the
     * craft are simply never in it, since a parked dart mid-frame would read
     * as a defect.
     */
    const applyMotionPreference = () => {
      if (motionQuery.matches) {
        stop();
        for (const unit of craft) unit.rest = Number.POSITIVE_INFINITY;
        step(0);
      } else {
        craft.forEach((unit, i) => {
          if (!Number.isFinite(unit.rest)) launchStaggered(unit, i);
        });
        sync();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      if (motionQuery.matches) step(0);
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        // The last entry is the current one if several queued together.
        visible = entries[entries.length - 1].isIntersecting;
        sync();
      },
      { rootMargin: "120px" },
    );
    intersectionObserver.observe(canvas);

    // The theme switch re-points the palette. A running loop picks it up on
    // its next frame; a still field is composed again.
    const themeObserver = new MutationObserver(() => {
      palette = readPalette(canvas);
      if (motionQuery.matches) step(0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    applyMotionPreference();
    motionQuery.addEventListener("change", applyMotionPreference);
    document.addEventListener("visibilitychange", sync);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      motionQuery.removeEventListener("change", applyMotionPreference);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div className="bmc-field" aria-hidden="true">
      <canvas ref={canvasRef} className="bmc-canvas" />
      <div className="bmc-scrim" />
    </div>
  );
}
