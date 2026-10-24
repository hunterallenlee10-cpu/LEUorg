#!/usr/bin/env node
/**
 * Copies the demos and their media from this site (.net, the source) to the
 * other LEU sites, so the three show the same Demo Lab, service pages and How
 * It Works animations (docs/DEMO-MEDIA-PLAN.md):
 *
 *   node scripts/sync-demos.mjs ../leu ../LEUorg          # copy
 *   node scripts/sync-demos.mjs --check ../leu ../LEUorg  # only list what differs
 *
 * Only the files below are touched. They are written to work on every site:
 * colours come from each site's theme (`--gold`, `--ink`, the brass scale),
 * and the `light:` classes do nothing on a site without a light theme. Each
 * site keeps its own pages, header, copy and theme. After copying, build and
 * look at each site before pushing.
 */

import { cpSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Shared files and folders, relative to the repo root. */
export const shared = [
  // The demos, the Demo Lab and the previews.
  "components/services",
  "data/demos",
  "data/narrated-video.ts",
  "lib/demo-assets.ts",
  "lib/hooks/useInView.ts",
  "lib/hooks/useMediaState.ts",
  // How It Works: the narrated videos, the live demo, the week film, Who we
  // help, the six service cards and the onboarding devices.
  "components/lee-systems/NarratedVideo.tsx",
  "components/lee-systems/TwoPathsDemo.tsx",
  "components/lee-systems/WebsiteVideo.tsx",
  "components/lee-systems/LeeSystemsLiveDemoSection.tsx",
  "components/lee-systems/LeeSystemsWorkflowFilmSection.tsx",
  "components/lee-systems/LeeSystemsIndustriesSection.tsx",
  "components/lee-systems/LeeSystemsServicesSection.tsx",
  "components/lee-systems/OnboardingDevices.tsx",
  "data/two-paths-video.ts",
  "data/two-paths-video.timing.json",
  "data/website-video.ts",
  "data/website-video.timing.json",
  // The media.
  "public/demos",
  "public/lee-systems/industries",
  "public/lee-systems/two-paths",
  "public/lee-systems/website-video",
  // The scripts that make it, and the plan.
  "scripts/build-demo-audio.mjs",
  "scripts/build-demo-media.sh",
  "scripts/build-demo-films.mjs",
  "scripts/build-video-audio.mjs",
  "scripts/sync-demos.mjs",
  "docs/DEMO-MEDIA-PLAN.md",
];

function files(path) {
  const full = join(root, path);
  if (!existsSync(full)) return [];
  if (statSync(full).isFile()) return [path];
  return readdirSync(full, { recursive: true })
    .map((entry) => join(path, String(entry)))
    .filter((entry) => statSync(join(root, entry)).isFile());
}

const args = process.argv.slice(2);
const check = args.includes("--check");
const targets = args.filter((arg) => arg !== "--check");
if (!targets.length) {
  console.error("Usage: node scripts/sync-demos.mjs [--check] <site repo> [<site repo> ...]");
  process.exit(1);
}

const all = shared.flatMap(files);
for (const target of targets) {
  const differ = all.filter((file) => {
    const there = join(target, file);
    return !existsSync(there) || !readFileSync(there).equals(readFileSync(join(root, file)));
  });
  console.log(`${relative(process.cwd(), target) || target}: ${differ.length} of ${all.length} shared files differ`);
  for (const file of differ) {
    console.log(`  ${file}`);
    if (!check) cpSync(join(root, file), join(target, file));
  }
}
