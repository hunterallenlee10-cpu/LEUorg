"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import clsx from "clsx";
import { Bot, CalendarCheck, Check, MessageSquareText, Pause, Phone, PhoneIncoming, Play } from "lucide-react";
import { DemoFrame } from "@/components/services/demo/DemoFrame";
import { useDemo, type Demo } from "@/components/services/demo/useDemo";
import { ExampleTag, Panel, Photo, Segmented, TypeText } from "@/components/services/demo/ui";
import { demoSizes, demoTitles, type DemoProps } from "@/components/services/demo/sizes";
import { callScenarios, type CallScenario, type CallScenarioId } from "@/data/demos/calls";
import callTiming from "@/data/demos/call-timing.json";
import { site } from "@/data/site";

/**
 * AI Call Answering: a call at 11:48 PM, answered and booked.
 *
 * The visitor picks the business (AC repair, law consultation, gym trial,
 * restaurant reservation). The phone rings over a photo of the business, the
 * assistant picks up (a call timer and a voice waveform run while it talks),
 * the transcript appears line by line, a calendar slot fills in as "Booked
 * by AI", and the confirmation text arrives.
 *
 * Audio never plays by itself: when a recording for the scenario is in
 * public/demos/calls/ (found at build time), "Listen" plays it and the demo
 * follows the voice: it rings, each line appears as it is spoken (from
 * data/demos/call-timing.json, written with the recordings by
 * scripts/build-demo-audio.mjs), and the slot books when the call ends. The
 * recordings are AI voices of made-up callers, and say so beside the button.
 * The silent run uses the same timings, so both move at the pace of a real
 * call. "Call our demo line" shows only once a real number is set in
 * data/site.ts (`callAnswering.demoPhone`).
 */

const RING = 0;
const FIRST_LINE = 1;
const LINES = 7; // every scenario has seven lines, so they share one step count
const BOOKED = FIRST_LINE + LINES;
const TEXTED = BOOKED + 1;

interface CallTiming {
  /** When each line starts in the recording, in ms. */
  lines: number[];
  /** When the recording ends, in ms. */
  end: number;
}

const timings = callTiming as Partial<Record<CallScenarioId, CallTiming>>;

/**
 * Each step's hold: the ring and every line as long as they last in the
 * recording, or, for a call with no timing yet, long enough to read.
 */
function durationsFor(scenario: CallScenario): number[] {
  const timing = timings[scenario.id];
  const lines = timing
    ? scenario.lines.map((_, i) => (timing.lines[i + 1] ?? timing.end + 400) - timing.lines[i])
    : scenario.lines.map(({ text }) => Math.min(3400, 900 + text.length * 26));
  return [timing ? timing.lines[0] : 2200, ...lines, 2400, 2800, 3000];
}

/** The step a recording is on at `ms`: the ring, a line, or past the end (booked). */
function stepAt(timing: CallTiming, ms: number): number {
  if (ms < timing.lines[0]) return RING;
  if (ms >= timing.end) return BOOKED;
  let line = 0;
  while (line + 1 < timing.lines.length && ms >= timing.lines[line + 1]) line += 1;
  return FIRST_LINE + line;
}

const durationsById = Object.fromEntries(
  callScenarios.map((scenario) => [scenario.id, durationsFor(scenario)])
) as Record<CallScenarioId, number[]>;

function captionsFor(scenario: CallScenario): string[] {
  return [
    `Incoming call to ${scenario.business} at 11:48 PM.`,
    ...scenario.lines.map(({ from, text }) => `${from === "ai" ? "Assistant" : "Caller"}: ${text}`),
    `Booked by AI: ${scenario.calendar.day}, ${scenario.calendar.slots[scenario.calendar.booked]}.`,
    `Confirmation text sent: ${scenario.text}`,
    "Call answered and booked while the business was closed.",
  ];
}

export default function AiCallsDemo({ formPath, assets }: DemoProps) {
  const [scenarioId, setScenarioId] = useState<CallScenarioId>("ac-repair");
  const scenario = callScenarios.find(({ id }) => id === scenarioId)!;
  // True while the recording plays and moves the demo along with it.
  const [listening, setListening] = useState(false);
  const [frameRef, demo] = useDemo({ service: "ai-calls", durations: durationsById[scenarioId], hold: listening });
  const sizes = demoSizes["ai-calls"];
  const typing = demo.status === "playing";
  const audio = assets.callAudio[scenarioId];
  const timing = timings[scenarioId];

  const lineCount = Math.max(0, Math.min(LINES, demo.step - FIRST_LINE + 1));
  const ended = demo.reached(BOOKED);

  return (
    <DemoFrame
      frameRef={frameRef}
      demo={demo}
      title={demoTitles["ai-calls"]}
      formPath={formPath}
      stageClassName={sizes.stage}
      toolbarClassName={sizes.toolbar}
      captions={captionsFor(scenario)}
      toolbar={
        <div className="svc-tabs -mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
          <Segmented
            label="Pick a business"
            wrap={false}
            value={scenarioId}
            onChange={(id) => {
              setScenarioId(id);
              setListening(false);
              demo.restart();
            }}
            options={callScenarios.map(({ id, label }) => ({ value: id, label }))}
          />
        </div>
      }
    >
      <div className="grid h-full grid-cols-1 content-start gap-4 p-4 sm:grid-cols-[280px_1fr] sm:p-5 lg:gap-6">
        {/* The phone */}
        <div className="mx-auto flex h-[440px] w-full max-w-[280px] flex-col overflow-hidden rounded-[2rem] border-[6px] border-neutral-800 bg-[var(--svc-phone)] shadow-2xl light:bg-[#fff]">
          {demo.step === RING ? null : (
            <div className="flex items-center gap-3 border-b border-white/10 px-4 pt-6 pb-3">
              <Photo src={scenario.photo} className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/15" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
                  {ended ? (
                    "Call ended"
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      AI on the line
                    </>
                  )}
                  <span className="ml-auto font-mono tracking-normal text-neutral-300 tabular-nums">
                    <CallTimer key={`${scenarioId}-${demo.run}`} running={typing && demo.active && !ended} fallback={lineCount * 9} />
                  </span>
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-white">{scenario.business}</p>
                <p className="truncate text-[11px] text-neutral-400">
                  {scenario.caller} · {scenario.callerPhone}
                </p>
              </div>
            </div>
          )}

          {demo.step === RING ? (
            // The ringing screen, over a dimmed photo of the business. White
            // text whatever the theme, since it sits on the photo.
            <div className="relative flex flex-1 flex-col items-center overflow-hidden px-4 pt-10 pb-6 text-center text-[#fff]">
              <Photo key={scenario.photo} src={scenario.photo} className="svc-photo-in absolute inset-0 h-full w-full scale-110 object-cover blur-[2px]" />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#000]/70 via-[#000]/35 to-[#000]/80" />
              <p className="relative text-[11px] tracking-wider uppercase opacity-80">Incoming call · 11:48 PM</p>
              <span className="relative mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff]/15 text-xl font-semibold ring-1 ring-[#fff]/30 backdrop-blur">
                {initials(scenario.caller)}
              </span>
              <p className="relative mt-3 text-lg font-semibold">{scenario.caller}</p>
              <p className="relative text-[12px] opacity-75">{scenario.callerPhone}</p>
              <p className="relative mt-1 truncate text-[12px] opacity-75">to {scenario.business}</p>
              <span className="relative mt-auto flex flex-col items-center gap-2">
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-[#fff]">
                  {typing && <span className="svc-l-pulse absolute inset-0 rounded-full bg-emerald-400/60" />}
                  <PhoneIncoming aria-hidden="true" className="relative h-6 w-6" />
                </span>
                <span className="text-[11px] opacity-85">AI answering&hellip;</span>
              </span>
            </div>
          ) : (
            <ol
              aria-label="Call transcript"
              className="flex flex-1 flex-col justify-end gap-2 overflow-hidden px-3 py-3"
            >
              {scenario.lines.slice(0, lineCount).map((line, index) => {
                const current = index === lineCount - 1 && demo.step === FIRST_LINE + index;
                return (
                  <li
                    key={`${scenarioId}-${index}`}
                    className={clsx(
                      "svc-enter max-w-[88%] rounded-xl px-3 py-2 text-[12px] leading-snug",
                      line.from === "ai"
                        ? "self-start rounded-bl-sm bg-brass-400/15 text-white"
                        : "self-end rounded-br-sm bg-white/10 text-neutral-200"
                    )}
                  >
                    <span className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
                      {line.from === "ai" ? (
                        <>
                          <Bot aria-hidden="true" className="h-3 w-3" /> AI
                        </>
                      ) : (
                        scenario.caller.split(" ")[0]
                      )}
                    </span>
                    <TypeText
                      key={`${demo.run}-${index}`}
                      text={line.text}
                      play={typing && current}
                      duration={Math.min(durationsById[scenarioId][FIRST_LINE + index] * 0.8, line.text.length * 40)}
                    />
                  </li>
                );
              })}
            </ol>
          )}

          {demo.step !== RING && (
            <div className="flex items-center justify-center gap-4 border-t border-white/10 py-3">
              {/* The assistant's voice while it talks; flat once the call ends. */}
              <span aria-hidden="true" className="flex h-6 w-16 items-center justify-center gap-[3px]">
                {[45, 80, 60, 100, 70, 90, 50].map((height, i) => (
                  <span
                    key={i}
                    style={{ height: ended ? "12%" : `${height}%`, animationDelay: `${i * 0.12}s` }}
                    className={clsx("w-[3px] rounded-full bg-brass-300/80", typing && !ended && "svc-l-wave")}
                  />
                ))}
              </span>
              <span
                className={clsx(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  ended ? "bg-white/10 text-neutral-400" : "bg-red-500 text-[#fff]"
                )}
              >
                <Phone aria-hidden="true" className="h-4 w-4 rotate-[135deg]" />
              </span>
              <span aria-hidden="true" className="w-16" />
            </div>
          )}
        </div>

        {/* The calendar, the text, and the optional extras */}
        <div className="flex min-w-0 flex-col gap-4">
          <Panel
            title={
              <span className="flex items-center gap-1.5">
                <CalendarCheck aria-hidden="true" className="h-3.5 w-3.5 text-brass-400" />
                Calendar · {scenario.calendar.day}
              </span>
            }
            tag={<ExampleTag />}
          >
            <ul className="space-y-1.5">
              {scenario.calendar.slots.map((slot, index) => {
                const booked = index === scenario.calendar.booked && demo.reached(BOOKED);
                return (
                  <li
                    key={slot}
                    className={clsx(
                      "flex min-h-10 items-center gap-3 rounded-lg border px-3 py-1.5 text-[13px] transition-colors duration-500 motion-reduce:transition-none",
                      booked ? "border-emerald-400/50 bg-emerald-400/10" : "border-white/10"
                    )}
                  >
                    <span className="w-16 shrink-0 text-neutral-400 tabular-nums">{slot}</span>
                    {booked ? (
                      <span className="svc-enter flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-semibold text-white">{scenario.calendar.what}</span>
                        <span className="shrink-0 rounded bg-emerald-400/20 px-1.5 py-px text-[10px] font-semibold tracking-wide text-emerald-300 uppercase">
                          Booked by AI
                        </span>
                      </span>
                    ) : (
                      <span className="text-neutral-400">Open</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel
            title={
              <span className="flex items-center gap-1.5">
                <MessageSquareText aria-hidden="true" className="h-3.5 w-3.5 text-brass-400" />
                Confirmation text
              </span>
            }
          >
            {demo.reached(TEXTED) ? (
              <div className="svc-enter">
                <p className="text-[11px] text-neutral-400">To {scenario.callerPhone} · 11:51 PM</p>
                <p className="mt-1.5 w-fit max-w-[95%] rounded-xl rounded-bl-sm bg-white/10 px-3 py-2 text-[13px] leading-snug text-neutral-200">
                  {scenario.text}
                </p>
                <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-300">
                  <Check aria-hidden="true" className="h-3 w-3" /> Delivered
                </p>
              </div>
            ) : (
              <p className="text-[13px] text-neutral-400">Sent as soon as the call is booked.</p>
            )}
          </Panel>

          {(audio || site.callAnswering.demoPhone) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {audio && timing && (
                <ListenButton
                  key={scenarioId}
                  src={audio}
                  label={scenario.label}
                  demo={demo}
                  onStart={() => {
                    track("demo_listen", { service: "ai-calls", scenario: scenarioId });
                    // Under reduced motion the transcript is already all there: the
                    // recording just plays beside it.
                    if (demo.reduced) return;
                    setListening(true);
                    demo.restart(true);
                  }}
                  onResume={() => {
                    if (demo.reduced) return;
                    setListening(true);
                    demo.play();
                  }}
                  onTime={(ms) => {
                    if (listening) demo.seek(stepAt(timing, ms));
                  }}
                  onStop={(finished) => {
                    if (!listening) return;
                    setListening(false);
                    if (finished) demo.seek(BOOKED);
                  }}
                />
              )}
              {audio && timing && (
                <span className="text-[11px] text-neutral-400">Simulated call · AI voices</span>
              )}
              {site.callAnswering.demoPhone && (
                <a
                  href={`tel:${site.callAnswering.demoPhone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brass-300 hover:text-brass-200"
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Call our demo line: {site.callAnswering.demoPhone}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}

/** "Dana W." to "DW", for the caller's avatar. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * The call's running time. It ticks once a second while the demo plays the
 * call; paused, it holds. When it never ran (reduced motion, or opened on the
 * result) it shows `fallback` seconds, worked out from the lines shown.
 */
function CallTimer({ running, fallback }: { running: boolean; fallback: number }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  const shown = seconds > 0 ? seconds : fallback;
  return <>{`${Math.floor(shown / 60)}:${String(shown % 60).padStart(2, "0")}`}</>;
}

/**
 * Plays the scenario's recording on a tap, never by itself, and reports where
 * it is so the demo can follow it. The transcript on screen is its captions.
 * preload="none": nothing downloads until played. It pauses when the demo is
 * paused or scrolled off screen, and the demo pauses when it is; from there
 * Listen picks the call up where it stopped, and the demo's own Play goes on
 * silently.
 */
function ListenButton({
  src,
  label,
  demo,
  onStart,
  onResume,
  onTime,
  onStop,
}: {
  src: string;
  label: string;
  demo: Demo;
  onStart: () => void;
  onResume: () => void;
  onTime: (ms: number) => void;
  /** `finished` is true when the recording played to its end. */
  onStop: (finished: boolean) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const shouldPause = playing && (demo.status === "paused" || !demo.active);

  useEffect(() => {
    if (shouldPause) audioRef.current?.pause();
  }, [shouldPause]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;
          if (!audio.paused) {
            audio.pause();
            return;
          }
          if (audio.currentTime === 0 || audio.ended) {
            audio.currentTime = 0;
            onStart();
          } else {
            onResume();
          }
          void audio.play();
        }}
        aria-pressed={playing}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:border-brass-400/60"
      >
        {playing ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
        {playing ? "Pause the call" : `Listen to the ${label.replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase())} call`}
      </button>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          if (audioRef.current?.ended) return;
          demo.pause();
          onStop(false);
        }}
        onTimeUpdate={(event) => onTime(event.currentTarget.currentTime * 1000)}
        onEnded={() => {
          setPlaying(false);
          onStop(true);
        }}
      />
    </>
  );
}
