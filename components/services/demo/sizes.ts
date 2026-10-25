import type { DemoSlug } from "@/data/services";
import type { CallScenarioId } from "@/data/demos/calls";

/** Optional media found in /public at build time (lib/demo-assets.ts). */
export interface DemoAssets {
  callAudio: Partial<Record<CallScenarioId, string>>;
  reel: { raw?: string; edited?: string; poster?: string };
  /** The voice-to-quote tool's recording. */
  voiceNote?: string;
}

export const noDemoAssets: DemoAssets = { callAudio: {}, reel: {} };

/** What every demo component takes. */
export interface DemoProps {
  /** The page whose form the demo's call to action goes to. */
  formPath: string;
  assets: DemoAssets;
}

/**
 * Each demo's fixed sizes, shared by the demo and its loading placeholder so
 * the page never moves when a demo arrives: the stage's height and, for a
 * demo with choices above the stage, the toolbar's. The max-[359px] and
 * max-[339px] steps give the demos that wrap more on a 320px phone (most of
 * all inside the /services Demo Lab's padded box) room for it, so nothing
 * spills onto the "Want this for your business?" bar below.
 */
export const demoSizes: Record<DemoSlug, { stage: string; toolbar?: string }> = {
  "get-found": { stage: "h-[1290px] max-[359px]:h-[1400px] max-[339px]:h-[1470px] sm:h-[770px] lg:h-[520px]", toolbar: "min-h-[69px]" },
  "ai-calls": { stage: "h-[960px] max-[359px]:h-[1015px] sm:h-[500px]", toolbar: "min-h-[69px]" },
  "follow-up": { stage: "h-[1480px] max-[359px]:h-[1535px] max-[339px]:h-[1560px] sm:h-[910px] lg:h-[600px]" },
  content: { stage: "h-[1100px] sm:h-[640px] lg:h-[620px]" },
  "custom-ai": { stage: "h-[900px] max-[359px]:h-[940px] max-[339px]:h-[1015px] sm:h-[840px] lg:h-[520px]", toolbar: "min-h-[69px]" },
};

/** Each demo's title in its frame, shared with its placeholder. */
export const demoTitles: Record<DemoSlug, string> = {
  "get-found": "Getting found for \u201croofer near me\u201d",
  "ai-calls": "A call at 11:48 PM",
  "follow-up": "You be the lead",
  content: "From raw clip to a week of posts",
  "custom-ai": "Four small tools",
};
