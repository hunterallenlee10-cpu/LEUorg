#!/usr/bin/env node
/**
 * Builds the service demos' recordings from one voice clip per line:
 *
 *   node scripts/build-demo-audio.mjs <folder>
 *
 * <folder> holds the clips, named `<scenario>-<n>.mp3` for the AI call demo
 * (ac-repair-1.mp3 to ac-repair-7.mp3, law-1.mp3 and so on, one per line of
 * data/demos/calls.ts, in order) and `voice-note.mp3` for the voice-to-quote
 * tool. They were voiced in Higgsfield (Eleven v4): the AI receptionist in one
 * voice on every call, each caller in their own.
 *
 * For each call it trims every clip to its speech, gives the caller's side the
 * narrow sound of a phone line, puts a ring and a pickup in front, leaves a
 * short pause between turns, levels the whole call to -16 LUFS and writes
 * public/demos/calls/<scenario>.mp3. When each line starts goes in
 * data/demos/call-timing.json, which the demo reads so the transcript follows
 * the voice.
 *
 * The voice note gets a little outdoor air under it and goes to
 * public/demos/voice-note.mp3, with its length and the shape of its waveform
 * in data/demos/voice-note.json.
 *
 * The ring, the pickup and the air are drawn by ffmpeg from tones and noise,
 * so there is nothing to license. FFMPEG names the ffmpeg binary if it isn't
 * on the PATH.
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const ffprobe = process.env.FFPROBE || "ffprobe";
const SR = 44100;

const scenarios = ["ac-repair", "law", "gym", "restaurant"];
/** Who speaks each line, the same order on every call (data/demos/calls.ts). */
const speakers = ["ai", "caller", "ai", "caller", "ai", "caller", "ai"];
/** The quiet between one turn and the next, in seconds. */
const GAP = 0.42;

const [clipsDir] = process.argv.slice(2);
if (!clipsDir) {
  console.error("Usage: node scripts/build-demo-audio.mjs <folder of clips>");
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), "demo-audio-"));

function run(args) {
  const result = spawnSync(ffmpeg, ["-v", "error", "-y", ...args], { maxBuffer: 1 << 28 });
  if (result.status !== 0) throw new Error(`ffmpeg ${args.join(" ")}\n${result.stderr}`);
  return result.stdout;
}

function seconds(file) {
  const result = spawnSync(ffprobe, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
  return Number(String(result.stdout).trim());
}

/** Trims silence off both ends (reversing to trim the tail). */
const TRIM =
  "silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.04," +
  "areverse,silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.08,areverse";

/** The caller is heard down a phone line; the receptionist is the line's own, clearer side. */
const VOICE = {
  ai: "highpass=f=120,lowpass=f=7600,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120",
  caller:
    "highpass=f=320,lowpass=f=3300,equalizer=f=1800:t=q:w=1.2:g=4," +
    "acompressor=threshold=-22dB:ratio=4:attack=5:release=90,volume=0.92",
};

function clip(input, output, speaker) {
  run(["-i", input, "-af", `${TRIM},${VOICE[speaker]},aresample=${SR}`, "-ac", "1", "-c:a", "pcm_s16le", output]);
  return seconds(output);
}

function silence(output, length) {
  run(["-f", "lavfi", "-i", `anullsrc=r=${SR}:cl=mono`, "-t", String(length), "-c:a", "pcm_s16le", output]);
}

/** A North American ring (440 + 480 Hz), then a beat, then the click of a pickup. */
function ringAndPickup(output) {
  run([
    "-f", "lavfi", "-i", `aevalsrc=0.05*(sin(2*PI*440*t)+sin(2*PI*480*t))*min(1\\,t*30)*min(1\\,(1.7-t)*30):s=${SR}:d=1.7`,
    "-f", "lavfi", "-i", `anullsrc=r=${SR}:cl=mono`,
    "-f", "lavfi", "-i", `anoisesrc=r=${SR}:a=0.5:c=white:d=0.035`,
    "-f", "lavfi", "-i", `anullsrc=r=${SR}:cl=mono`,
    "-filter_complex",
    "[0]highpass=f=300,lowpass=f=3400[ring];[1]atrim=0:0.38[gap];" +
      "[2]highpass=f=900,lowpass=f=4000,afade=t=out:st=0:d=0.035,volume=0.5[click];[3]atrim=0:0.22[after];" +
      "[ring][gap][click][after]concat=n=4:v=0:a=1",
    "-ac", "1", "-c:a", "pcm_s16le", output,
  ]);
  return seconds(output);
}

function concat(parts, output) {
  const list = join(work, `${Math.random().toString(36).slice(2)}.txt`);
  writeFileSync(list, parts.map((part) => `file '${part}'`).join("\n"));
  run(["-f", "concat", "-safe", "0", "-i", list, "-c:a", "pcm_s16le", output]);
}

function encode(input, output, extraFilter = "") {
  mkdirSync(dirname(output), { recursive: true });
  const filter = `${extraFilter ? `${extraFilter},` : ""}loudnorm=I=-16:TP=-1.5:LRA=9`;
  run(["-i", input, "-af", filter, "-ar", String(SR), "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k", output]);
}

// ---------------------------------------------------------------------------
// The four calls.

const timing = {};
const gap = join(work, "gap.wav");
silence(gap, GAP);

for (const id of scenarios) {
  const sources = speakers.map((_, i) => join(clipsDir, `${id}-${i + 1}.mp3`));
  if (!sources.every(existsSync)) {
    console.log(`skip ${id}: not every line has a clip`);
    continue;
  }
  const ring = join(work, `${id}-ring.wav`);
  let at = ringAndPickup(ring);
  const parts = [ring];
  const lines = [];
  sources.forEach((source, i) => {
    if (i > 0) {
      parts.push(gap);
      at += GAP;
    }
    const out = join(work, `${id}-${i + 1}.wav`);
    lines.push(Math.round(at * 1000));
    at += clip(source, out, speakers[i]);
    parts.push(out);
  });
  const dry = join(work, `${id}-dry.wav`);
  concat(parts, dry);
  // A faint line hiss under the whole call, so the pauses sound like an open line.
  const whole = join(work, `${id}.wav`);
  run([
    "-i", dry,
    "-f", "lavfi", "-i", `anoisesrc=r=${SR}:c=pink:a=0.004:d=${at.toFixed(2)}`,
    "-filter_complex", "[1]highpass=f=300,lowpass=f=3400[hiss];[0][hiss]amix=inputs=2:duration=first:normalize=0",
    "-ac", "1", "-c:a", "pcm_s16le", whole,
  ]);
  encode(whole, join(root, "public/demos/calls", `${id}.mp3`));
  timing[id] = { lines, end: Math.round(at * 1000) };
  console.log(`${id}: ${(at).toFixed(1)}s`);
}

if (Object.keys(timing).length) {
  writeFileSync(join(root, "data/demos/call-timing.json"), `${JSON.stringify(timing, null, 2)}\n`);
}

// ---------------------------------------------------------------------------
// The voice note: the contractor's voice with some air under it, and its shape.

const note = join(clipsDir, "voice-note.mp3");
if (existsSync(note)) {
  const voice = join(work, "note-voice.wav");
  const length = clip(note, voice, "ai") + 0.6;
  const mixed = join(work, "note.wav");
  run([
    "-i", voice,
    "-f", "lavfi", "-i", `anoisesrc=r=${SR}:c=brown:a=0.05:d=${length.toFixed(2)}`,
    "-filter_complex",
    "[0]adelay=250,apad=whole_dur=" + length.toFixed(2) + "[v];" +
      "[1]lowpass=f=900,highpass=f=60,volume=0.35[air];[v][air]amix=inputs=2:duration=first:normalize=0",
    "-ac", "1", "-c:a", "pcm_s16le", mixed,
  ]);
  encode(mixed, join(root, "public/demos/voice-note.mp3"));

  // The waveform: the loudest sample in each of 40 slices, scaled to 0-100.
  const raw = run(["-i", mixed, "-f", "s16le", "-ac", "1", "-ar", "8000", "pipe:1"]);
  const samples = new Int16Array(raw.buffer, raw.byteOffset, raw.byteLength / 2);
  const BARS = 40;
  const size = Math.floor(samples.length / BARS);
  const peaks = Array.from({ length: BARS }, (_, bar) => {
    let peak = 0;
    for (let i = bar * size; i < (bar + 1) * size; i++) peak = Math.max(peak, Math.abs(samples[i]));
    return peak;
  });
  const top = Math.max(...peaks) || 1;
  const shape = peaks.map((peak) => Math.max(8, Math.round((peak / top) * 100)));
  const seconds = Math.round(length);
  writeFileSync(
    join(root, "data/demos/voice-note.json"),
    `${JSON.stringify({ length: `0:${String(seconds).padStart(2, "0")}`, peaks: shape }, null, 2)}\n`
  );
  console.log(`voice note: ${length.toFixed(1)}s`);
}
