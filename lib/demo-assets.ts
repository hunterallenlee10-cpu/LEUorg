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
 * - public/demos/content/edited.mp4: the 9:16 edited clip, muted, plus
 *   poster.webp (or poster.jpg) as the still shown before it loads.
 * - public/demos/voice-note.mp3: the voice-to-quote tool's voice note.
 *
 * The recordings are built by scripts/build-demo-audio.mjs, which also writes
 * their timing (data/demos/call-timing.json, data/demos/voice-note.json).
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
      edited: existing("demos/content/edited.mp4"),
      poster: existing("demos/content/poster.webp") ?? existing("demos/content/poster.jpg"),
    },
    voiceNote: existing("demos/voice-note.mp3"),
  };
}
