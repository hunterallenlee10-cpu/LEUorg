import fs from "node:fs";
import path from "node:path";
import { callScenarioIds } from "@/data/demos/calls";
import type { DemoAssets } from "@/components/services/demo/sizes";

/**
 * The optional media the demos use when the owner adds it to /public, found
 * at build time (the service pages are static, so this runs once per
 * deploy). Anything missing is left out and its demo falls back: the call
 * transcript without audio, a reel cut from stock photos instead of video.
 *
 * - public/demos/calls/<scenario>.mp3: one recording per AI call scenario
 *   (ac-repair, law, gym, restaurant), played only on a visitor's tap.
 * - public/demos/content/raw.mp4 and edited.mp4: the same 9:16 clip before
 *   and after editing, muted, plus poster.webp (or poster.jpg) as the still
 *   shown before either loads.
 */

const publicDir = path.join(process.cwd(), "public");

function existing(file: string): string | undefined {
  return fs.existsSync(path.join(publicDir, file)) ? `/${file}` : undefined;
}

export function getDemoAssets(): DemoAssets {
  const callAudio: DemoAssets["callAudio"] = {};
  for (const id of callScenarioIds) {
    const file = existing(`demos/calls/${id}.mp3`);
    if (file) callAudio[id] = file;
  }
  return {
    callAudio,
    reel: {
      raw: existing("demos/content/raw.mp4"),
      edited: existing("demos/content/edited.mp4"),
      poster: existing("demos/content/poster.webp") ?? existing("demos/content/poster.jpg"),
    },
  };
}
