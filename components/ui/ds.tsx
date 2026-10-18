import clsx from "clsx";
import type { ReactNode } from "react";
import { site } from "@/data/site";

/**
 * The design system's small shared pieces (the black-and-gold redesign,
 * 2026-10-18). The styling is "LEU design system" in app/globals.css.
 */

/** Eyebrow, headline and one line under it, the start of most sections. */
export function SectionHead({
  eyebrow,
  title,
  sub,
  id,
  center = false,
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  id?: string;
  center?: boolean;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={clsx("ds-head", center && "ds-head--center", className)} data-reveal>
      {eyebrow && <p className={clsx("ds-eyebrow", center && "ds-eyebrow--center")}>{eyebrow}</p>}
      <Heading id={id} className={Heading === "h1" ? "ds-h1" : "ds-h2"}>
        {title}
      </Heading>
      {sub && <p className="ds-sub max-w-2xl">{sub}</p>}
    </div>
  );
}

/**
 * A word with a hand-drawn gold underline. The path is normalised
 * (`pathLength="1"`) so the draw-in animation works at any width.
 */
export function Underlined({ children }: { children: ReactNode }) {
  return (
    <span className="ds-underline">
      {children}
      <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path
          d="M4 15 C 58 6, 128 4, 196 8 S 280 14, 296 9 M 30 20 C 92 13, 170 12, 262 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

/**
 * A hand-drawn curly arrow pointing at the call to action. `side="left"`
 * sits left of the button and points right; `"right"` is its mirror.
 */
export function ScribbleArrow({ side, className }: { side: "left" | "right"; className?: string }) {
  return (
    <svg
      viewBox="0 0 110 70"
      width="96"
      height="61"
      aria-hidden="true"
      focusable="false"
      className={clsx("ds-arrow", side === "right" && "-scale-x-100", className)}
    >
      <path
        d="M6 12 C 18 44, 44 58, 70 46 C 84 39, 82 24, 70 26 C 58 28, 62 48, 98 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="5 6"
      />
      <path
        d="M88 41 L 100 50 L 87 58"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The owner's three figures as tiles, exactly as published in data/site.ts. */
export function StatTiles({ className }: { className?: string }) {
  if (site.stats.length === 0) return null;
  return (
    <ul className={clsx("ds-stats ds-cut", className)} aria-label="LEU by the numbers" data-reveal>
      {site.stats.map((stat) => (
        <li key={stat.label} className="ds-stat">
          <span className="ds-stat-value">{stat.value}</span>
          <span className="ds-stat-label">{stat.label}</span>
          {stat.definition && <span className="text-sm text-neutral-400">{stat.definition}</span>}
        </li>
      ))}
    </ul>
  );
}
