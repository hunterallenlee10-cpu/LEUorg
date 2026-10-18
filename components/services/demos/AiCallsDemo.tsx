"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { Bot, CalendarCheck, Check, MessageSquareText, Pause, Phone, PhoneIncoming, Play } from "lucide-react";
import { DemoFrame } from "@/components/services/demo/DemoFrame";
import { useDemo } from "@/components/services/demo/useDemo";
import { ExampleTag, Panel, Segmented, TypeText } from "@/components/services/demo/ui";
import { demoSizes, demoTitles, type DemoProps } from "@/components/services/demo/sizes";
import { callScenarios, type CallScenario, type CallScenarioId } from "@/data/demos/calls";
import { site } from "@/data/site";

/**
 * AI Call Answering: a call at 11:48 PM, answered and booked.
 *
 * The visitor picks the business (AC repair, law consultation, gym trial,
 * restaurant reservation). The phone rings, the assistant picks up, the
 * transcript appears line by line, a calendar slot fills in as "Booked by
 * AI", and the confirmation text arrives.
 *
 * Audio is optional and never plays by itself: when a recording for the
 * scenario is in public/demos/calls/ (found at build time), a "Listen"
 * button plays it, with the transcript on screen as its captions. "Call our
 * demo line" shows only once a real number is set in data/site.ts
 * (`callAnswering.demoPhone`).
 */

const RING = 0;
const FIRST_LINE = 1;
const LINES = 7; // every scenario has seven lines, so they share one step count
const BOOKED = FIRST_LINE + LINES;
const TEXTED = BOOKED + 1;

/** Each line is held long enough to read: longer lines, longer holds. */
function durationsFor(scenario: CallScenario): number[] {
  return [
    2200,
    ...scenario.lines.map(({ text }) => Math.min(3400, 900 + text.length * 26)),
    2400,
    2800,
    3000,
  ];
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
  const [frameRef, demo] = useDemo({ service: "ai-calls", durations: durationsById[scenarioId] });
  const sizes = demoSizes["ai-calls"];
  const typing = demo.status === "playing";
  const audio = assets.callAudio[scenarioId];

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
              demo.restart();
            }}
            options={callScenarios.map(({ id, label }) => ({ value: id, label }))}
          />
        </div>
      }
    >
      <div className="grid h-full grid-cols-1 content-start gap-4 p-4 sm:grid-cols-[280px_1fr] sm:p-5 lg:gap-6">
        {/* The phone */}
        <div className="mx-auto flex h-[440px] w-full max-w-[280px] flex-col overflow-hidden rounded-[2rem] border-[6px] border-neutral-800 bg-[#050b18] shadow-2xl light:bg-[#fff]">
          <div className="border-b border-white/10 px-4 pt-6 pb-3 text-center">
            <p className="text-[11px] tracking-wider text-neutral-400 uppercase">
              {demo.step === RING ? "Incoming call · 11:48 PM" : ended ? "Call ended" : "AI assistant on the line"}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{scenario.business}</p>
            <p className="text-[11px] text-neutral-400">
              {scenario.caller} · {scenario.callerPhone}
            </p>
          </div>

          {demo.step === RING ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brass-400 text-neutral-950">
                {typing && <span className="svc-l-pulse absolute inset-0 rounded-full bg-brass-400/50" />}
                <PhoneIncoming aria-hidden="true" className="relative h-7 w-7" />
              </span>
              <p className="text-xs text-neutral-300">Answering&hellip;</p>
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
                      duration={Math.min(1800, line.text.length * 22)}
                    />
                  </li>
                );
              })}
            </ol>
          )}

          <div className="flex items-center justify-center border-t border-white/10 py-3">
            <span
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full",
                ended ? "bg-white/10 text-neutral-400" : "bg-red-400 text-neutral-950"
              )}
            >
              <Phone aria-hidden="true" className="h-4 w-4 rotate-[135deg]" />
            </span>
          </div>
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
            <div className="flex flex-wrap items-center gap-3">
              {audio && <ListenButton key={scenarioId} src={audio} label={scenario.label} />}
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

/**
 * Plays the scenario's recording on a tap, never by itself. The transcript
 * beside it is its captions. preload="none": nothing downloads until played.
 */
function ListenButton({ src, label }: { src: string; label: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;
          if (audio.paused) void audio.play();
          else audio.pause();
        }}
        aria-pressed={playing}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:border-brass-400/60"
      >
        {playing ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
        {playing ? "Pause the call" : `Listen to the ${label.toLowerCase()} call`}
      </button>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </>
  );
}
