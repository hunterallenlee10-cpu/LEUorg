"use client";

import clsx from "clsx";
import { ArrowRight, MapPin, Phone, Search, Sparkles } from "lucide-react";
import { DemoFrame } from "@/components/services/demo/DemoFrame";
import { useDemo } from "@/components/services/demo/useDemo";
import { DemoVideo } from "@/components/services/demo/DemoVideo";
import { CountUp, ExampleTag, MapCredit, Panel, Photo, Stars, TypeText } from "@/components/services/demo/ui";
import { demoSizes, demoTitles, type DemoProps } from "@/components/services/demo/sizes";
import {
  adPreview,
  aiAnswer,
  aiQuestion,
  competitors,
  ourBusiness,
  pipeline,
  searchQuery,
  type Listing,
} from "@/data/demos/get-found";
import { demoImages } from "@/data/demos/images";

/**
 * Get Found & Get Leads, in three panels:
 * 1. A plain local search for "roofer near me", over a real street map
 *    (OpenStreetMap), with the made-up business first in the map results:
 *    its photo, stars and a Call button, and its pin lit up on the map.
 * 2. An AI answer to "Who's the best roofer near me?" that names it, with
 *    the business's card under it.
 * 3. An ad with a photo, then the outbound strip counting up: leads found,
 *    emails sent, replies, calls booked.
 * Everything is labelled Example, and the note under the panels says
 * rankings aren't guaranteed. There is no before/after (taken off,
 * 2026-10-25): it only shows the business already found.
 */

const durations = [2600, 2000, 2400, 3400, 2400, 1700, 1700, 1700, 1700, 3000];
const captions = [
  "Someone searches roofer near me, and the business is first in the map results.",
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

const STEP = { call: 1, question: 2, answer: 3, ad: 4, pipeline: 5 } as const;
const ROW = 58; // px, one result row and its gap

export default function GetFoundDemo({ formPath }: DemoProps) {
  const [frameRef, demo] = useDemo({ service: "get-found", durations });
  const typing = demo.status === "playing";
  const sizes = demoSizes["get-found"];

  return (
    <DemoFrame
      frameRef={frameRef}
      demo={demo}
      title={demoTitles["get-found"]}
      formPath={formPath}
      stageClassName={sizes.stage}
      captions={captions}
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

          <MapStrip />

          <SearchResults highlightCall={demo.reached(STEP.call)} />
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
              <div className="svc-enter space-y-2">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-brass-300 to-brass-400 text-neutral-950">
                    <Sparkles aria-hidden="true" className="h-3 w-3" />
                  </span>
                  Assistant
                </p>
                <p className="rounded-lg border border-white/10 px-3 py-2 text-neutral-300">
                  <AiAnswer key={`aa-${demo.run}`} play={typing && demo.step === STEP.answer} />
                </p>
                {!(typing && demo.step === STEP.answer) && (
                  <div className="svc-enter flex items-center gap-2.5 rounded-lg border border-brass-400/40 bg-brass-400/[0.06] p-2">
                    <Photo src={ourBusiness.photo} className="h-10 w-10 shrink-0 rounded-md object-cover" />
                    <span className="min-w-0 text-[11px] leading-tight">
                      <span className="block truncate text-[12px] font-semibold text-white">{ourBusiness.name}</span>
                      <span className="mt-0.5 flex items-center gap-1 text-neutral-400">
                        <Stars rating={ourBusiness.rating} className="text-[10px]" />
                        {ourBusiness.rating.toFixed(1)} · {ourBusiness.distance}
                      </span>
                    </span>
                  </div>
                )}
              </div>
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
              "flex overflow-hidden rounded-lg border border-white/10 bg-neutral-950/60 transition-opacity duration-500 motion-reduce:transition-none lg:block light:bg-[#fff]",
              demo.reached(STEP.ad) ? "opacity-100" : "opacity-30"
            )}
          >
            {/* A side thumbnail until the panel is wide enough for a banner. */}
            <div className="relative w-20 shrink-0 lg:w-auto">
              <DemoVideo
                src={adPreview.video}
                poster={adPreview.photo}
                playing={demo.reached(STEP.ad)}
                className="relative h-full w-full lg:aspect-[5/2] lg:h-auto"
              />
              <span className="absolute top-2 left-2 rounded bg-[#000]/65 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#fff] uppercase">
                {adPreview.label}
              </span>
            </div>
            <div className="min-w-0 p-3">
              <p className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
                {ourBusiness.name}
              </p>
              <p className="mt-1 text-[13px] leading-snug font-semibold text-white">{adPreview.headline}</p>
              <p className="mt-1 text-[12px] text-neutral-400">{adPreview.body}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-brass-400 px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-neutral-950">
                <Phone aria-hidden="true" className="h-3 w-3" />
                {/* On a 320px phone the number doesn't fit the card, so it's just "Call". */}
                Call<span className="max-[359px]:hidden"> {adPreview.phone}</span>
              </span>
            </div>
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

        <p className="text-xs text-neutral-400 sm:col-span-2 lg:col-span-3">
          Example results. Rankings aren&apos;t guaranteed.
        </p>
      </div>
    </DemoFrame>
  );
}

/**
 * A strip of real streets (OpenStreetMap, data/demos/images.ts) with the
 * competitors' pins and the business's, lit up. The dark theme shows the map
 * inverted into night colours; the light theme shows it as it is.
 */
function MapStrip() {
  const pins = [
    { x: 18, y: 38 },
    { x: 61, y: 30 },
    { x: 82, y: 66 },
  ];
  return (
    <div aria-hidden="true" className="relative mt-3 h-[88px] overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
      <Photo
        src={demoImages.map}
        className="absolute inset-0 h-full w-full object-cover [filter:invert(1)_hue-rotate(180deg)_saturate(0.45)_brightness(0.8)_contrast(0.95)] light:[filter:saturate(0.85)]"
        style={{ objectPosition: "40% 55%" }}
      />
      {pins.map((pin, index) => (
        <MapPin
          key={index}
          className="absolute h-4 w-4 -translate-x-1/2 -translate-y-full fill-neutral-700 text-neutral-300 drop-shadow"
          style={{ left: `${pin.x}%`, top: `${pin.y + 20}%` }}
        />
      ))}
      <MapPin
        className="absolute h-7 w-7 origin-bottom -translate-x-1/2 -translate-y-full fill-brass-400 text-neutral-950 drop-shadow-lg"
        style={{ left: "44%", top: "72%" }}
      />
      <MapCredit />
    </div>
  );
}

/**
 * The map results: the business first, two competitors under it, and the
 * third competitor under "More results".
 */
function SearchResults({ highlightCall }: { highlightCall: boolean }) {
  const order: Listing[] = [ourBusiness, competitors[0], competitors[1], competitors[2]];

  return (
    <div className="relative mt-3" style={{ height: ROW * 4 + 22 }}>
      <p
        aria-hidden="true"
        className="absolute left-0 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase"
        style={{ top: ROW * 3 + 2 }}
      >
        More results
      </p>
      <ol aria-label="Map results">
        {order.map((listing, index) => {
          const us = listing === ourBusiness;
          const top = index < 3 ? index * ROW : ROW * 3 + 22;
          return (
            <li
              key={listing.name}
              className={clsx(
                "absolute inset-x-0 flex h-[50px] items-center gap-2 rounded-lg border px-2 sm:gap-2.5 sm:px-2.5",
                us
                  ? "z-10 border-brass-400/60 bg-[var(--svc-surface)] light:bg-[#fff]"
                  : "border-white/10 bg-white/[0.02]",
                index === 3 && "opacity-50"
              )}
              style={{ top }}
            >
              <span
                className={clsx(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  us ? "bg-brass-400 text-neutral-950" : "bg-white/10 text-neutral-300"
                )}
              >
                {index < 3 ? index + 1 : "·"}
              </span>
              <Photo src={listing.photo} className="h-8 w-8 shrink-0 rounded-md object-cover sm:h-9 sm:w-9" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-white">{listing.name}</span>
                <span className="flex items-center gap-1 text-[11px] whitespace-nowrap text-neutral-400">
                  {listing.rating.toFixed(1)}
                  <Stars rating={listing.rating} className="text-[10px]" />
                  <span className="truncate">({listing.reviews}) · {listing.distance}</span>
                </span>
              </span>
              {us && (
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors duration-500 motion-reduce:transition-none",
                    highlightCall ? "bg-brass-400 text-neutral-950" : "border border-white/15 text-white"
                  )}
                >
                  <Phone aria-hidden="true" className="h-3 w-3" />
                  <span className="sr-only sm:not-sr-only">Call</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function AiAnswer({ play }: { play: boolean }) {
  const [lead, rest] = aiAnswer.split("{us}");
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
