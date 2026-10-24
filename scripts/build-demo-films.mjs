#!/usr/bin/env node
/**
 * Builds the picture tracks of the two narrated videos on How It Works
 * ("Two paths" and the website video) from Higgsfield clips:
 *
 *   node scripts/build-demo-films.mjs <folder>
 *
 * <folder> holds the raw clips named in `films` below (v-tp-m1.mp4 and so
 * on), all AI footage of made-up places, hands only (docs/DEMO-MEDIA-PLAN.md).
 *
 * Each line of a video gets one shot, cut to start exactly when the line does
 * in its timing file (data/two-paths-video.timing.json,
 * data/website-video.timing.json), so the picture follows the narration the
 * player already keeps time by. The by-hand run is graded cold and drained,
 * the run with AI warm. The result is one muted MP4 per video, with a WebP of
 * its first frame, in the video's folder under public/lee-systems/. When the
 * narration is rebuilt with new timings, run this again.
 *
 * Needs ffmpeg with libx264 and libwebp. FFMPEG names it if it isn't on the
 * PATH.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const W = 960;
const H = 540;
const FPS = 24;

const grades = {
  neutral: "eq=saturation=0.85:contrast=1.02",
  cold: "eq=saturation=0.5:contrast=1.03:brightness=-0.025,colorbalance=bs=0.07:bm=0.04:bh=0.02:rh=-0.02",
  warm: "eq=saturation=1.08:contrast=1.05,colorbalance=rs=0.04:rh=0.03:bs=-0.03:bh=-0.03",
};

/**
 * Each video's shots, one per line id, in order: the clip, where in it to
 * start (seconds) and the grade.
 */
const films = {
  "two-paths": {
    timing: "data/two-paths-video.timing.json",
    out: "public/lee-systems/two-paths/two-paths-film",
    shots: {
      prompt: ["v-tp-prompt.mp4", 0, "neutral"],
      "manual-title": ["v-tp-prompt.mp4", 2.0, "cold"],
      "manual-call": ["v-tp-m1.mp4", 0, "cold"],
      "manual-voicemail": ["v-tp-m2.mp4", 0.4, "cold"],
      "manual-callback": ["v-tp-m3.mp4", 0.3, "cold"],
      "manual-crm": ["v-tp-m4.mp4", 0.3, "cold"],
      "manual-ending": ["v-tp-m5.mp4", 0.3, "cold"],
      "ai-title": ["v-tp-a2.mp4", 0, "warm"],
      "ai-call": ["v-tp-a1.mp4", 0.2, "warm"],
      "ai-answer": ["v-tile-ai-calls.mp4", 0.3, "warm"],
      "ai-text": ["v-tp-a3.mp4", 0.3, "warm"],
      "ai-crm": ["v-tile-websites.mp4", 0.3, "warm"],
      "ai-ending": ["v-tp-a5.mp4", 0, "warm"],
      outro: ["v-tp-a5.mp4", 2.3, "warm"],
    },
  },
  website: {
    timing: "data/website-video.timing.json",
    out: "public/lee-systems/website-video/website-film",
    shots: {
      prompt: ["v-wv-w0.mp4", 0, "neutral"],
      "before-title": ["v-wv-w0.mp4", 2.7, "cold"],
      "before-tap": ["v-wv-w1.mp4", 0, "cold"],
      "before-slow": ["v-wv-w2.mp4", 0.2, "cold"],
      "before-look": ["v-wv-w1.mp4", 1.4, "cold"],
      "before-leave": ["v-wv-w4.mp4", 0.3, "cold"],
      "before-ending": ["v-tp-m5.mp4", 1.2, "cold"],
      "after-title": ["v-wv-w1.mp4", 0, "warm"],
      "after-tap": ["v-wv-w1.mp4", 2.1, "warm"],
      "after-fast": ["v-wv-w5.mp4", 0.3, "warm"],
      "after-look": ["v-wv-w6.mp4", 0.3, "warm"],
      "after-form": ["v-wv-w7.mp4", 0.3, "warm"],
      "after-ending": ["v-wv-w8.mp4", 0.2, "warm"],
      outro: ["v-tile-websites.mp4", 0, "warm"],
    },
  },
};

const [clipsDir] = process.argv.slice(2);
if (!clipsDir) {
  console.error("Usage: node scripts/build-demo-films.mjs <folder of clips>");
  process.exit(1);
}

function run(args) {
  const result = spawnSync(ffmpeg, ["-hide_banner", "-v", "error", "-y", ...args], { maxBuffer: 1 << 26 });
  if (result.status !== 0) throw new Error(`ffmpeg failed\n${result.stderr}`);
}

for (const [name, film] of Object.entries(films)) {
  const timing = JSON.parse(readFileSync(join(root, film.timing), "utf8"));
  const ids = Object.keys(timing.lines);
  const clips = ids.map((id) => film.shots[id]);
  if (clips.some((shot) => !shot)) throw new Error(`${name}: a line has no shot`);
  const missing = [...new Set(clips.map(([file]) => file))].filter((file) => !existsSync(join(clipsDir, file)));
  if (missing.length) {
    console.log(`skip ${name}: missing ${missing.join(", ")}`);
    continue;
  }

  // Line i runs from its start to the next one's (the first from 0, the last
  // to the end of the soundtrack).
  const bounds = ids.map((id, i) => [i === 0 ? 0 : timing.lines[id], ids[i + 1] ? timing.lines[ids[i + 1]] : timing.durationMs]);
  const inputs = [];
  const parts = [];
  clips.forEach(([file, from, grade], i) => {
    const length = (bounds[i][1] - bounds[i][0]) / 1000;
    inputs.push("-ss", String(from), "-t", String(length + 0.2), "-i", join(clipsDir, file));
    parts.push(
      `[${i}]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,fps=${FPS},` +
        `${grades[grade]},trim=duration=${length.toFixed(3)},setpts=PTS-STARTPTS[s${i}]`
    );
  });
  const graph = `${parts.join(";")};${clips.map((_, i) => `[s${i}]`).join("")}concat=n=${clips.length}:v=1:a=0[v]`;
  const out = join(root, `${film.out}.mp4`);
  run([...inputs, "-filter_complex", graph, "-map", "[v]", "-c:v", "libx264", "-preset", "slow", "-crf", "30",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out]);
  run(["-i", out, "-frames:v", "1", "-c:v", "libwebp", "-quality", "76", join(root, `${film.out}.webp`)]);
  console.log(`${name}: ${(timing.durationMs / 1000).toFixed(1)}s`);
}
