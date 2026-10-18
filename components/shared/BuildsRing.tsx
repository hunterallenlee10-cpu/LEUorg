"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

/** How long each build faces front while the ring turns on its own. */
const AUTOPLAY_MS = 3000;

/** Degrees the ring turns per pixel dragged. */
const DRAG_DEG_PER_PX = 0.18;

/** A drag shorter than this is still a click. */
const CLICK_SLOP_PX = 6;

/** The ring's spring: stiffness, and critical damping so it never wobbles. */
const STIFFNESS = 42;
const DAMPING = 2 * Math.sqrt(STIFFNESS);

const PERSPECTIVE = 1200;

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * "Recent Builds" as a 360° ring (the owner's ask, 2026-10-06, in place of
 * the sideways row): every build stands on a ring that turns endlessly, the
 * front one full size and the rest wrapping round behind it, smaller and
 * darker the farther back they are, so the section always shows there is
 * more to see. It steps to the next build every 3 seconds on its own, and
 * stops for a hover, keyboard focus, a drag, the pause button, a hidden tab
 * or the ring being off screen. It never turns on its own under
 * prefers-reduced-motion, where every move is instant.
 *
 * Visitors turn it by dragging or swiping sideways (vertical swipes still
 * scroll the page), a sideways trackpad scroll, the arrows, the dots, the
 * arrow keys once it has focus, or a click on a build at the side. Only the
 * front build's link can be clicked, focused or read out (the rest are
 * `inert`), as in a flat carousel.
 *
 * The cards share one grid cell, so the ring is as tall as the tallest card
 * and all of them match, with no measuring. Each frame a spring eases the
 * angle toward its target and writes every card's transform straight to the
 * DOM; React only re-renders when the front build changes. Each card carries
 * its own perspective and a z-index from its depth instead of sharing a 3D
 * scene, so tilted neighbours can never slice through one another. The angle
 * is never wrapped, so the ring always takes the short way round.
 */
export function BuildsRing({ items, label }: { items: ReactNode[]; label: string }) {
  const count = items.length;
  const step = 360 / Math.max(count, 1);

  const regionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const geometry = useRef({ stage: 0, card: 0 });
  const sim = useRef({ pos: 0, vel: 0, target: 0, last: 0, frame: 0 });
  const dragRef = useRef<{ id: number; x: number; start: number; moved: boolean } | null>(
    null,
  );
  const suppressClickRef = useRef(false);
  const wheelTimerRef = useRef(0);
  const reducedRef = useRef(false);

  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Places every card for the ring turned to `angle` degrees.
  const render = useCallback(
    (angle: number) => {
      const { stage, card } = geometry.current;
      if (!card) return;
      // Sideways reach of the ring, and how far back its far side sits.
      const reach = Math.max(card * 0.2, stage / 2 - card * 0.1);
      const depth = card * 1.3;

      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        // This card's place on the ring: 0 is front, 90 is right, ±180 back.
        const theta = mod(i * step + angle + 180, 360) - 180;
        const rad = (theta * Math.PI) / 180;
        const front = Math.cos(rad); // 1 at the front, -1 at the back
        const x = Math.sin(rad) * reach;
        const z = (front - 1) * depth;
        // Sides turn to face the middle; the far side turns back toward us.
        const tilt = Math.sin(rad) * 48;
        el.style.transform = `perspective(${PERSPECTIVE}px) translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${tilt.toFixed(2)}deg)`;
        el.style.zIndex = String(Math.round(front * 100) + 100);
        const shade = shadeRefs.current[i];
        if (shade) shade.style.opacity = Math.min(0.9, ((1 - front) / 2) ** 0.6).toFixed(3);
      }

      const front = mod(Math.round(-angle / step), count);
      setActive((current) => (current === front ? current : front));
    },
    [count, step],
  );

  // Runs the spring until the ring settles on its target.
  const startSpring = useCallback(() => {
    const s = sim.current;
    if (s.frame) return;
    s.last = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - (s.last || now)) / 1000 || 0.016);
      s.last = now;
      const accel = STIFFNESS * (s.target - s.pos) - DAMPING * s.vel;
      s.vel += accel * dt;
      s.pos += s.vel * dt;
      if (Math.abs(s.target - s.pos) < 0.02 && Math.abs(s.vel) < 0.02) {
        s.pos = s.target;
        s.vel = 0;
        s.frame = 0;
        render(s.pos);
        return;
      }
      render(s.pos);
      s.frame = requestAnimationFrame(tick);
    };
    s.frame = requestAnimationFrame(tick);
  }, [render]);

  // Sends the ring toward `target` degrees: sprung, or at once under
  // reduced motion.
  const turnTo = useCallback(
    (target: number) => {
      const s = sim.current;
      s.target = target;
      if (reducedRef.current) {
        cancelAnimationFrame(s.frame);
        s.frame = 0;
        s.pos = target;
        s.vel = 0;
        render(target);
        return;
      }
      startSpring();
    },
    [render, startSpring],
  );

  const snap = useCallback((value: number) => Math.round(value / step) * step, [step]);

  const next = useCallback(
    () => turnTo(snap(sim.current.target) - step),
    [snap, step, turnTo],
  );
  const prev = useCallback(
    () => turnTo(snap(sim.current.target) + step),
    [snap, step, turnTo],
  );
  const goTo = useCallback(
    (index: number) => {
      const current = snap(sim.current.target);
      let delta = mod(index - mod(Math.round(-current / step), count), count);
      if (delta > count / 2) delta -= count;
      turnTo(current - delta * step);
    },
    [count, snap, step, turnTo],
  );

  // The ring's reach follows the stage's and the cards' widths.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      geometry.current = {
        stage: stage.clientWidth,
        card: cardRefs.current[0]?.offsetWidth ?? 0,
      };
      render(sim.current.pos);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [render]);

  useEffect(() => {
    const s = sim.current;
    return () => cancelAnimationFrame(s.frame);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reducedRef.current = query.matches;
      setReducedMotion(query.matches);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(region);
    return () => observer.disconnect();
  }, []);

  // Autoplay. The timer restarts whenever the front build changes, so one
  // the visitor turned to gets its full time at the front.
  const autoplay =
    count > 1 && !paused && !hovered && !focused && !dragging && visible && !reducedMotion;

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") next();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [autoplay, next, active]);

  // A sideways trackpad scroll turns the ring and settles on a build once
  // the gesture stops. Non-passive so the same swipe can't also trigger the
  // browser's back/forward gesture.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || count < 2) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      setDragging(true);
      const s = sim.current;
      cancelAnimationFrame(s.frame);
      s.frame = 0;
      s.vel = 0;
      s.pos -= e.deltaX * DRAG_DEG_PER_PX;
      s.target = s.pos;
      render(s.pos);
      window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => {
        setDragging(false);
        turnTo(snap(sim.current.pos));
      }, 140);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
      window.clearTimeout(wheelTimerRef.current);
    };
  }, [count, render, snap, turnTo]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (count < 2 || (e.pointerType === "mouse" && e.button !== 0)) return;
    dragRef.current = { id: e.pointerId, x: e.clientX, start: sim.current.pos, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < CLICK_SLOP_PX) return;
      drag.moved = true;
      setDragging(true);
      // Captured only once it is really a drag, so a plain click still
      // reaches the link or card under the pointer.
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    const s = sim.current;
    cancelAnimationFrame(s.frame);
    s.frame = 0;
    s.vel = 0;
    s.pos = drag.start + dx * DRAG_DEG_PER_PX;
    s.target = s.pos;
    render(s.pos);
  };

  const endDrag = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) return;
    suppressClickRef.current = true;
    setDragging(false);
    // A flick past a quarter of a step counts as a step.
    const turned = sim.current.pos - drag.start;
    const target =
      Math.abs(turned) > step / 4 && Math.abs(turned) < step
        ? drag.start + Math.sign(turned) * step
        : sim.current.pos;
    turnTo(snap(target));
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // Only keyboard focus holds the ring still; a click on an arrow or a
      // dot leaves it turning.
      onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      {/* Bleeds to the screen edge on phones and tablets so the builds round
          the side aren't cut off at the page margin, and fades out at both
          edges. Clipped sideways only, so the front card's focus ring and
          the floor glow still show. */}
      <div className="relative -mx-4 overflow-x-clip py-3 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] sm:-mx-6 lg:mx-0">
        {/* A soft brass floor under the ring, so it stands in a space. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[15%] -bottom-6 h-24 rounded-[50%] bg-[radial-gradient(closest-side,rgb(var(--gold)/0.16),transparent)] blur-md"
        />

        <div
          ref={stageRef}
          role="group"
          aria-roledescription="carousel"
          tabIndex={count > 1 ? 0 : undefined}
          aria-label={
            count > 1
              ? `${label}: use the left and right arrow keys to turn the carousel`
              : undefined
          }
          aria-live={autoplay ? "off" : "polite"}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
          className={clsx(
            "relative grid touch-pan-y justify-items-center rounded-xl select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-300",
            count > 1 && (dragging ? "cursor-grabbing" : "cursor-grab"),
          )}
        >
          {items.map((item, i) => {
            const isFront = i === active;
            return (
              <div
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                // Until the ring is placed, the first build sits on top.
                style={{ zIndex: i === 0 ? 200 : 0 }}
                onClick={isFront ? undefined : () => goTo(i)}
                className={clsx(
                  "relative flex w-[min(76vw,26rem)] [grid-area:1/1] will-change-transform [backface-visibility:hidden]",
                  !isFront && "cursor-pointer",
                )}
              >
                <div inert={!isFront} className="flex w-full rounded-xl bg-[#16171a] light:bg-[#fff] light:shadow-[0_18px_40px_-24px_rgb(26_24_20/0.35)]">
                  {item}
                </div>
                {/* Darkens the builds round the back of the ring (fades them
                    into the page, in the light theme). */}
                <span
                  aria-hidden="true"
                  ref={(el) => {
                    shadeRefs.current[i] = el;
                  }}
                  className="pointer-events-none absolute inset-0 rounded-xl bg-black opacity-0 light:bg-neutral-950"
                />
              </div>
            );
          })}
        </div>
      </div>

      {count > 1 && (
        // On a phone the dots take their own line above the buttons: in one
        // row, a dozen builds' dots and the three buttons are wider than the
        // screen and the page scrolls sideways.
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:flex-nowrap sm:gap-4">
          <button type="button" onClick={prev} aria-label="Previous build" className={arrowClass}>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="order-first flex basis-full items-center justify-center sm:order-none sm:basis-auto">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to build ${i + 1} of ${count}`}
                aria-current={i === active ? "true" : undefined}
                className="group inline-flex h-11 w-6 items-center justify-center focus-visible:outline-2 focus-visible:outline-brass-300"
              >
                <span
                  className={clsx(
                    "block h-1.5 rounded-full transition-all duration-300",
                    i === active ? "w-5 bg-brass-300" : "w-1.5 bg-white/25 group-hover:bg-white/50",
                  )}
                />
              </button>
            ))}
          </div>

          <button type="button" onClick={next} aria-label="Next build" className={arrowClass}>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>

          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play the carousel" : "Pause the carousel"}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-brass-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
            >
              {paused ? (
                <Play className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Pause className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const arrowClass =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-neutral-200 transition-colors hover:border-brass-300 hover:text-brass-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300";
