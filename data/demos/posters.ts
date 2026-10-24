/**
 * The "live posters" on each service's tile (MiniPreview): a 5-second loop of
 * the moment the service is for, and one line of what just happened, drawn
 * in code over it so it stays sharp and readable at thumbnail size. The loops
 * are AI footage of made-up places, generated in Higgsfield
 * (docs/DEMO-MEDIA-PLAN.md) and cut by scripts/build-demo-media.sh; every
 * line below is taken from the service's own demo, so the tile and the demo
 * it opens tell the same story.
 */

import type { ServiceSlug } from "@/data/services";
import { callScenarios } from "@/data/demos/calls";
import { quoteLines, voiceNote } from "@/data/demos/custom-ai";
import { ourBusiness, searchQuery } from "@/data/demos/get-found";
import { followUpTexts } from "@/data/demos/follow-up";
import { plannedCount } from "@/data/demos/content";
import { websiteSkins } from "@/data/demos/websites";

export type PosterTone = "good" | "accent";

export interface Poster {
  video: string;
  /** The loop's first frame. */
  still: string;
  /** Where the picture is cropped in the tile's 16:10 (object-position). */
  focus: string;
  title: string;
  detail: string;
  tone: PosterTone;
}

const loop = (name: string) => ({ video: `/demos/video/${name}.mp4`, still: `/demos/video/${name}.webp` });

const call = callScenarios[0];
const quoteTotal = (() => {
  const subtotal = quoteLines.reduce((sum, line) => sum + line.qty * line.rate, 0);
  return subtotal + Math.round(subtotal * voiceNote.taxRate * 100) / 100;
})();

export const posters: Record<ServiceSlug, Poster> = {
  websites: {
    ...loop("tile-websites"),
    focus: "50% 50%",
    title: "New lead received",
    detail: websiteSkins[0].lead,
    tone: "good",
  },
  "get-found": {
    ...loop("tile-get-found"),
    focus: "50% 50%",
    title: "Top of the local map",
    detail: `“${searchQuery}” · ${ourBusiness.name} ★ ${ourBusiness.rating}`,
    tone: "accent",
  },
  "ai-calls": {
    ...loop("tile-ai-calls"),
    focus: "50% 55%",
    title: "Booked by AI at 11:48 PM",
    detail: `${call.label}, ${call.calendar.day.toLowerCase()} at ${call.calendar.slots[call.calendar.booked]}`,
    tone: "good",
  },
  "follow-up": {
    ...loop("tile-follow-up"),
    focus: "50% 50%",
    title: "Replied in 0:41",
    detail: `“${followUpTexts.leadYes}”`,
    tone: "good",
  },
  content: {
    ...loop("tile-content"),
    focus: "50% 50%",
    title: `${plannedCount} posts planned this week`,
    detail: "From one week of clips",
    tone: "accent",
  },
  "custom-ai": {
    ...loop("tile-custom-ai"),
    focus: "50% 50%",
    title: `Quote ${voiceNote.quoteNumber} ready`,
    detail: `${quoteTotal.toLocaleString("en-US", { style: "currency", currency: "USD" })} · from a voice note`,
    tone: "accent",
  },
};
