/**
 * The Content demo's made-up week (components/services/demos/
 * ContentDemo.tsx): three example hooks for the edited clip, and one week of
 * posts across four platforms. The clip is in public/demos/content/
 * (lib/demo-assets.ts); without it the phone plays a reel cut from the
 * shots' stills (data/demos/images.ts).
 */

export const contentHooks = [
  "3 roof problems you can spot from the ground",
  "Check this before you call a roofer",
  "Why small leaks turn into big repairs",
] as const;

/** The edited clip's captions, a few words at a time. */
export const captionWords = ["Look up", "at your gutters", "first."] as const;

export const platforms = ["Instagram", "TikTok", "YouTube", "Facebook"] as const;
export type Platform = (typeof platforms)[number];

export type PostFormat = "Reel" | "Carousel" | "Story" | "Short";

export interface PlannedPost {
  format: PostFormat;
  /** Labelled "AI-generated" wherever it shows. */
  ai?: boolean;
}

export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** One row per day, one cell per platform (null: nothing that day). */
export const weekPlan: readonly (readonly (PlannedPost | null)[])[] = [
  [{ format: "Reel" }, { format: "Reel" }, { format: "Short" }, { format: "Reel" }],
  [{ format: "Carousel" }, null, null, { format: "Story" }],
  [{ format: "Reel" }, { format: "Reel" }, { format: "Short" }, null],
  [{ format: "Story" }, { format: "Reel" }, null, { format: "Carousel", ai: true }],
  [{ format: "Reel" }, { format: "Reel" }, { format: "Short" }, { format: "Reel" }],
  [{ format: "Carousel", ai: true }, null, null, { format: "Story" }],
  [{ format: "Story" }, { format: "Reel" }, { format: "Short" }, null],
];

export const plannedCount = weekPlan.flat().filter(Boolean).length;
