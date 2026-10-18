"use client";

import { useState } from "react";
import clsx from "clsx";
import { ArrowRight, MapPin, Phone, Search, Sparkles, Star } from "lucide-react";
import { DemoFrame } from "@/components/services/demo/DemoFrame";
import { useDemo } from "@/components/services/demo/useDemo";
import { CountUp, ExampleTag, Panel, Segmented, TypeText } from "@/components/services/demo/ui";
import { demoSizes, demoTitles, type DemoProps } from "@/components/services/demo/sizes";
import {
  adPreview,
  aiAnswers,
  aiQuestion,
  competitors,
  ourBusiness,
  pipeline,
  searchQuery,
  type Listing,
} from "@/data/demos/get-found";

/**
 * Get Found & Get Leads, in three panels:
 * 1. A plain local search for "roofer near me". Before, the made-up business
 *    sits on page two; After, it moves into the top three map results with
 *    its stars and a Call button.
 * 2. An AI answer to "Who's the best roofer near me?" that names it (After)
 *    or doesn't (Before).
 * 3. An ad preview, then the outbound strip counting up: leads found, emails
 *    sent, replies, calls booked.
 * Everything is labelled Example, and the footer says rankings aren't
 * guaranteed. The Before/After switch is the visitor's to flip.
 */

type Mode = "before" | "after";

const durations = [2600, 2600, 2000, 2400, 3400, 2400, 1700, 1700, 1700, 1700, 3000];
const captions = [
  "Before: the business is on page two of local results for roofer near me.",
  "After: it moves into the top three map results.",
  "With its rating and a Call button.",
  "Someone asks an AI assistant who the best roofer near them is.",
  "The answer names the business.",
  "An ad for the same business.",
  "Outreach: leads found.",
  "Emails sent.",
  "Replies.",
  "Calls booked.",
  "More people find the business, and more of them reach out.",
];

const STEP = { after: 1, call: 2, question: 3, answer: 4, ad: 5, pipeline: 6 } as const;
const ROW = 58; // px, one result row and its gap

export default function GetFoundDemo({ formPath }: DemoProps) {
  const [frameRef, demo] = useDemo({ service: "get-found", durations });
  const [choice, setChoice] = useState<{ run: number; mode: Mode } | null>(null);
  const mode: Mode =
    choice && choice.run === demo.run ? choice.mode : demo.reached(STEP.after) ? "after" : "before";
  const typing = demo.status === "playing";
  const sizes = demoSizes["get-found"];

  return (
    <DemoFrame
      frameRef={frameRef}
      demo={demo}
      title={demoTitles["get-found"]}
      formPath={formPath}
      stageClassName={sizes.stage}
      toolbarClassName={sizes.toolbar}
      captions={captions}
      toolbar={
        <div className="flex items-center justify-between gap-3">
          <Segmented
            label="Show results"
            wrap={false}
            value={mode}
            onChange={(value) => {
              setChoice({ run: demo.run, mode: value });
              demo.pause();
            }}
            options={[
              { value: "before", label: "Before" },
              { value: "after", label: "After" },
            ]}
          />
          <p className="hidden text-xs text-neutral-400 sm:block">
            Example results. Rankings aren&apos;t guaranteed.
          </p>
        </div>
      }
    >
      <div className="grid h-full grid-cols-1 content-start gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[1.25fr_1fr_1fr]">
        {/* 1. Local search */}
        <Panel
          title={
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-brass-400" />
              Local search
            </span>
          }
          tag={<ExampleTag />}
          className="sm:row-span-2 lg:row-span-1"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950/60 px-3 py-2 text-sm text-white light:bg-[#fff]">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-neutral-400" />
            <TypeText key={`q-${demo.run}`} text={searchQuery} play={typing && demo.step === 0} duration={900} />
          </div>

          <MapStrip after={mode === "after"} />

          <SearchResults after={mode === "after"} highlightCall={demo.reached(STEP.call)} />
        </Panel>

        {/* 2. AI answer */}
        <Panel
          title={
            <span className="flex items-center gap-1.5">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-brass-400" />
              AI assistant answer
            </span>
          }
          tag={<ExampleTag />}
        >
          <div className="min-h-[148px] space-y-2.5 text-[13px] leading-relaxed">
            {demo.reached(STEP.question) ? (
              <p className="ml-auto w-fit max-w-[90%] rounded-lg bg-white/10 px-3 py-2 text-neutral-200">
                <TypeText key={`aq-${demo.run}`} text={aiQuestion} play={typing && demo.step === STEP.question} duration={1100} />
              </p>
            ) : (
              <p className="text-neutral-400">Waiting for a question&hellip;</p>
            )}
            {demo.reached(STEP.answer) && (
              <p className="svc-enter rounded-lg border border-white/10 px-3 py-2 text-neutral-300">
                <AiAnswer
                  key={`aa-${demo.run}-${mode}`}
                  mode={mode}
                  play={typing && demo.step === STEP.answer}
                />
              </p>
            )}
          </div>
        </Panel>

        {/* 3. Ads and outreach */}
        <Panel
          title={
            <span className="flex items-center gap-1.5">
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-brass-400" />
              Ads and outreach
            </span>
          }
          tag={<ExampleTag />}
        >
          <div
            className={clsx(
              "rounded-lg border border-white/10 bg-neutral-950/60 p-3 transition-opacity duration-500 motion-reduce:transition-none light:bg-[#fff]",
              demo.reached(STEP.ad) ? "opacity-100" : "opacity-30"
            )}
          >
            <p className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              {adPreview.label} · {ourBusiness.name}
            </p>
            <p className="mt-1 text-[13px] leading-snug font-semibold text-white">{adPreview.headline}</p>
            <p className="mt-1 text-[12px] text-neutral-400">{adPreview.body}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-brass-400 px-2.5 py-1 text-[11px] font-semibold text-neutral-950">
              <Phone aria-hidden="true" className="h-3 w-3" />
              Call {adPreview.phone}
            </span>
          </div>

          <ol className="mt-3 grid grid-cols-2 gap-2">
            {pipeline.map((stage, index) => {
              const reached = demo.reached(STEP.pipeline + index);
              return (
                <li
                  key={stage.label}
                  className={clsx(
                    "rounded-lg border px-2.5 py-2 transition-colors duration-500 motion-reduce:transition-none",
                    reached ? "border-brass-400/40 bg-brass-400/[0.06]" : "border-white/10"
                  )}
                >
                  <p className="text-[11px] text-neutral-400">{stage.label}</p>
                  <p className="text-lg font-bold text-white tabular-nums">
                    {reached ? (
                      <CountUp
                        key={`c-${demo.run}`}
                        to={stage.value}
                        play={typing && demo.step === STEP.pipeline + index}
                        duration={1100}
                      />
                    ) : (
                      0
                    )}
                  </p>
                </li>
              );
            })}
          </ol>
        </Panel>

        <p className="text-xs text-neutral-400 sm:hidden">
          Example results. Rankings aren&apos;t guaranteed.
        </p>
      </div>
    </DemoFrame>
  );
}

/** A small drawn map with pins; the business's pin lights up After. */
function MapStrip({ after }: { after: boolean }) {
  const pins = [
    { x: 22, y: 40 },
    { x: 58, y: 26 },
    { x: 78, y: 60 },
  ];
  return (
    <div
      aria-hidden="true"
      className="relative mt-3 h-[72px] overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(0deg,rgb(var(--ink)/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--ink)/0.04)_1px,transparent_1px)] bg-[size:18px_18px]"
    >
      <span className="absolute top-[45%] left-0 h-1.5 w-full -rotate-6 bg-white/[0.07]" />
      <span className="absolute top-0 left-[40%] h-full w-1.5 rotate-12 bg-white/[0.07]" />
      {pins.map((pin, index) => (
        <MapPin
          key={index}
          className="absolute h-4 w-4 -translate-x-1/2 -translate-y-full text-neutral-400"
          style={{ left: `${pin.x}%`, top: `${pin.y + 20}%` }}
        />
      ))}
      <MapPin
        className={clsx(
          "absolute h-6 w-6 -translate-x-1/2 -translate-y-full fill-brass-400/30 text-brass-400 transition-opacity duration-500 motion-reduce:transition-none",
          after ? "opacity-100" : "opacity-0"
        )}
        style={{ left: "44%", top: "70%" }}
      />
    </div>
  );
}

/**
 * The map results. Rows are placed by their rank and slide when it changes:
 * Before, the business waits on "page 2" under the top three; After, it is
 * first and the third competitor drops out of the top three.
 */
function SearchResults({ after, highlightCall }: { after: boolean; highlightCall: boolean }) {
  const order: Listing[] = after
    ? [ourBusiness, competitors[0], competitors[1], competitors[2]]
    : [competitors[0], competitors[1], competitors[2], ourBusiness];

  return (
    <div className="relative mt-3" style={{ height: ROW * 4 + 22 }}>
      <p
        aria-hidden="true"
        className="absolute left-0 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase"
        style={{ top: ROW * 3 + 2 }}
      >
        {after ? "More results" : "Page 2"}
      </p>
      <ol aria-label={`Map results, ${after ? "after" : "before"}`}>
        {order.map((listing, index) => {
          const us = listing === ourBusiness;
          const top = index < 3 ? index * ROW : ROW * 3 + 22;
          return (
            <li
              key={listing.name}
              className={clsx(
                "absolute inset-x-0 flex h-[50px] items-center gap-2.5 rounded-lg border px-2.5 transition-[top,opacity,border-color] duration-700 ease-out motion-reduce:transition-none",
                us && after
                  ? "z-10 border-brass-400/60 bg-[#0f2346] light:bg-[#fff]"
                  : "border-white/10 bg-white/[0.02]",
                index === 3 && "opacity-50"
              )}
              style={{ top }}
            >
              <span
                className={clsx(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  us && after ? "bg-brass-400 text-neutral-950" : "bg-white/10 text-neutral-300"
                )}
              >
                {index < 3 ? index + 1 : "·"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-white">{listing.name}</span>
                <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                  <Star aria-hidden="true" className="h-3 w-3 fill-brass-300 text-brass-300" />
                  {listing.rating.toFixed(1)} ({listing.reviews}) · {listing.distance}
                </span>
              </span>
              {us && after && (
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors duration-500 motion-reduce:transition-none",
                    highlightCall ? "bg-brass-400 text-neutral-950" : "border border-white/15 text-white"
                  )}
                >
                  <Phone aria-hidden="true" className="h-3 w-3" />
                  Call
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function AiAnswer({ mode, play }: { mode: Mode; play: boolean }) {
  if (mode === "before") {
    return <TypeText text={aiAnswers.before} play={play} duration={2400} />;
  }
  const [lead, rest] = aiAnswers.after.split("{us}");
  // Type the plain text, then show it with the business picked out.
  return play ? (
    <TypeText text={`${lead}${ourBusiness.name}${rest}`} play duration={2600} />
  ) : (
    <>
      {lead}
      <strong className="rounded bg-brass-400/15 px-1 font-semibold text-white">{ourBusiness.name}</strong>
      {rest}
    </>
  );
}
