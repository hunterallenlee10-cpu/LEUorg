"use client";

import { useSyncExternalStore } from "react";

/**
 * The "Time's ticking" row's visual (BmShiftSection): a ring showing how much
 * of the current year has already gone, to six decimal places so it visibly
 * runs, with a bright tick sweeping the rim on the real seconds. Everything on it is
 * computed from the visitor's clock, so it states nothing that can go stale:
 * it rolls over to the next year on its own.
 *
 * Decorative, so the whole panel is aria-hidden; the row's heading and
 * paragraph carry the point. Under reduced motion the figures update once a
 * minute instead of ten times a second, so the tick holds still. Before
 * hydration (and without JS) the ring renders empty with a dash, never a
 * wrong number.
 */

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TICKS = Array.from({ length: 60 }, (_, i) => i);

function subscribe(onChange: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const id = window.setInterval(onChange, reduce ? 60_000 : 100);
  return () => window.clearInterval(id);
}

// Snapshots are whole tenths of a second, so repeated reads within one tick
// return the same value and React does not re-render for nothing.
const getSnapshot = () => Math.floor(Date.now() / 100);
const getServerSnapshot = () => null;

export function BmYearClock() {
  const tenths = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let percent: number | null = null;
  let year: number | null = null;
  let daysLeft: number | null = null;
  let seconds = 0;
  if (tenths !== null) {
    const now = new Date(tenths * 100);
    year = now.getFullYear();
    const start = new Date(year, 0, 1).getTime();
    const end = new Date(year + 1, 0, 1).getTime();
    percent = ((now.getTime() - start) / (end - start)) * 100;
    daysLeft = Math.ceil((end - now.getTime()) / 86_400_000);
    seconds = now.getSeconds();
  }

  const dash = percent === null ? 0 : (percent / 100) * CIRCUMFERENCE;

  return (
    <div className="bm-shift-panel flex min-h-[24rem] flex-col md:min-h-[27rem]" aria-hidden="true">
      <div className="flex items-center justify-between px-6 pt-5 font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
        <span>{year ?? "This year"}</span>
        <span className="flex items-center gap-2">
          <span className="bm-live-dot" />
          Live
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <svg viewBox="0 0 300 300" className="my-6 h-60 w-60 overflow-visible md:h-72 md:w-72">
          <defs>
            <linearGradient id="bm-clock-arc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" className="bm-clock-stop-a" />
              <stop offset="100%" className="bm-clock-stop-b" />
            </linearGradient>
          </defs>
          {TICKS.map((i) => (
            <line
              key={i}
              x1="150"
              y1={i % 5 === 0 ? 4 : 8}
              x2="150"
              y2="14"
              transform={`rotate(${i * 6} 150 150)`}
              style={{ stroke: `rgb(var(--ink) / ${i % 5 === 0 ? 0.35 : 0.12})` }}
              strokeWidth={i % 5 === 0 ? 2 : 1}
            />
          ))}
          <circle cx="150" cy="150" r={RADIUS} fill="none" strokeWidth="10" style={{ stroke: "rgb(var(--ink) / 0.07)" }} />
          <circle
            cx="150"
            cy="150"
            r={RADIUS}
            fill="none"
            stroke="url(#bm-clock-arc)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
            transform="rotate(-90 150 150)"
            className="bm-clock-arc"
          />
          {/* The seconds: one bright tick sweeping the tick ring, kept out
              on the rim so it never crosses the figures in the middle. */}
          <line
            x1="150"
            y1="1"
            x2="150"
            y2="20"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${seconds * 6} 150 150)`}
            className="bm-clock-tick"
          />
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-[family-name:var(--font-display)] text-4xl font-black tabular-nums text-white md:text-5xl">
            {percent === null ? "…" : `${percent.toFixed(6)}%`}
          </span>
          <span className="mt-1 text-sm text-neutral-400">
            of {year ?? "this year"} is already gone
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 font-mono text-xs uppercase tracking-[0.18em]">
        <span className="text-neutral-400">Time left this year</span>
        <span className="tabular-nums text-brass-400">
          {daysLeft === null ? "…" : `${daysLeft} days`}
        </span>
      </div>
    </div>
  );
}
