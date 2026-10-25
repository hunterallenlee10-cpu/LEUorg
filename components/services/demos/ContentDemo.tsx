"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { CalendarDays, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { DemoFrame } from "@/components/services/demo/DemoFrame";
import { useDemo } from "@/components/services/demo/useDemo";
import { ExampleTag, Panel, Photo } from "@/components/services/demo/ui";
import { PlatformIcon } from "@/components/services/demo/platformIcons";
import { demoSizes, demoTitles, type DemoProps } from "@/components/services/demo/sizes";
import {
  captionWords,
  contentHooks,
  days,
  plannedCount,
  platforms,
  weekPlan,
} from "@/data/demos/content";
import { demoImages } from "@/data/demos/images";

/**
 * Content & Social Media: from one clip to a week of posts.
 *
 * A phone plays a 9:16 clip, edited: captions, tighter cuts and a hook
 * title; the hook picker cycles three example hooks. Beside it, a one-week
 * calendar fills in day by day across Instagram, TikTok, YouTube and
 * Facebook, each post with its thumbnail. Nothing carries an "AI-generated"
 * tag, and there is no raw/edited before and after (taken off, 2026-10-25).
 *
 * The clip is public/demos/content/edited.mp4 (muted, preload="none", with
 * the poster, playing only while the demo is on screen): footage of a
 * made-up roofer, generated in Higgsfield and cut by
 * scripts/build-demo-media.sh, three shots cut every two seconds, graded,
 * pushing in on each, with the hook and captions drawn here in code, in time
 * with the cuts. Without the file the clip is built from the shots' stills
 * instead (StockReel). No sound plays, ever.
 */

const S = { hook2: 1, hook3: 2, firstDay: 3, summary: 10 } as const;
const durations = [3000, 2400, 2400, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 3000];

const captions = [
  `An edited clip: captions, tighter cuts and a hook title, "${contentHooks[0]}".`,
  `Another hook: "${contentHooks[1]}".`,
  `Another hook: "${contentHooks[2]}".`,
  ...days.map((day) => `${day}'s posts are planned.`),
  `${plannedCount} posts planned across four platforms this week.`,
];

interface Choices {
  run: number;
  hook?: number;
}

export default function ContentDemo({ formPath, assets }: DemoProps) {
  const [frameRef, demo] = useDemo({ service: "content", durations });
  const [choices, setChoices] = useState<Choices>({ run: -1 });
  const mine: Partial<Choices> = choices.run === demo.run ? choices : {};

  const hook = mine.hook ?? (demo.reached(S.hook3) ? 2 : demo.reached(S.hook2) ? 1 : 0);
  const daysShown = Math.max(0, Math.min(days.length, demo.step - S.firstDay + 1));

  const choose = (change: Omit<Choices, "run">) => {
    setChoices((current) => ({ ...(current.run === demo.run ? current : {}), ...change, run: demo.run }));
    demo.pause();
  };

  return (
    <DemoFrame
      frameRef={frameRef}
      demo={demo}
      title={demoTitles.content}
      formPath={formPath}
      stageClassName={demoSizes.content.stage}
      captions={captions}
    >
      <div className="grid h-full grid-cols-1 content-start gap-5 p-4 sm:grid-cols-[250px_1fr] sm:p-5 lg:gap-8">
        <div className="flex flex-col items-center gap-3">
          <Reel hook={contentHooks[hook]} playing={demo.active && !demo.reduced} assets={assets.reel} />

          <div
            role="group"
            aria-label="Example hooks"
            className="flex w-full max-w-[250px] items-center justify-between gap-2"
          >
            <button
              type="button"
              aria-label="Previous hook"
              onClick={() => choose({ hook: (hook + contentHooks.length - 1) % contentHooks.length })}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-white hover:border-brass-400/60"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <p className="text-center text-xs text-neutral-300" aria-live="polite">
              Hook {hook + 1} of {contentHooks.length}
            </p>
            <button
              type="button"
              aria-label="Next hook"
              onClick={() => choose({ hook: (hook + 1) % contentHooks.length })}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-white hover:border-brass-400/60"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Panel
          title={
            <span className="flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 text-brass-400" />
              This week&apos;s posts
            </span>
          }
          tag={<ExampleTag />}
          className="min-w-0 px-2.5 sm:px-4"
        >
          <table className="w-full table-fixed border-separate border-spacing-0.5 text-[10px] sm:border-spacing-1 sm:text-[11px]">
            <caption className="sr-only">One week of planned posts by platform</caption>
            <thead>
              <tr>
                <th scope="col" className="w-8 text-left font-semibold text-neutral-400 sm:w-11">
                  <span className="sr-only">Day</span>
                </th>
                {platforms.map((platform) => (
                  <th key={platform} scope="col" className="pb-1 text-left font-semibold text-neutral-300">
                    <span className="flex min-w-0 items-center gap-1">
                      <PlatformIcon platform={platform} className="h-3.5 w-3.5 shrink-0" />
                      {/* On a phone the mark alone fits; the name stays for screen readers. */}
                      <span className="sr-only truncate sm:not-sr-only">{platform}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day, row) => (
                <tr key={day}>
                  <th scope="row" className="text-left font-semibold text-neutral-400">
                    {day}
                  </th>
                  {weekPlan[row].map((post, column) => {
                    const shown = row < daysShown && post;
                    return (
                      <td key={column} className="h-9 align-middle">
                        {shown ? (
                          <span className="svc-enter flex min-h-9 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-1 py-0.5 leading-tight sm:px-1">
                            <Photo
                              src={demoImages.reel[(row + column) % demoImages.reel.length]}
                              className="hidden h-7 w-5 shrink-0 rounded-[3px] object-cover lg:block"
                            />
                            <span className="flex min-w-0 flex-col">
                              <span className="truncate font-semibold text-white">{post.format}</span>
                            </span>
                          </span>
                        ) : (
                          <span className="block h-9 rounded-md border border-dashed border-white/[0.07]">
                            <span className="sr-only">{post && row >= daysShown ? "Not planned yet" : "No post"}</span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p
            className={clsx(
              "mt-3 text-[13px] transition-colors duration-500 motion-reduce:transition-none",
              demo.reached(S.summary) ? "font-semibold text-white" : "text-neutral-400"
            )}
          >
            {demo.reached(S.summary)
              ? `${plannedCount} posts planned across 4 platforms, from one week of clips.`
              : "Fills in as the week is planned."}
          </p>
        </Panel>
      </div>
    </DemoFrame>
  );
}

/**
 * The phone. The edited clip when it is in /public, otherwise the
 * stock-photo reel (StockReel), with the hook and captions over it. Moves
 * only while the demo is on screen and motion is allowed.
 */
function Reel({
  hook,
  playing,
  assets,
}: {
  hook: string;
  playing: boolean;
  assets: { edited?: string; poster?: string };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = assets.edited;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) void video.play().catch(() => {});
    else video.pause();
  }, [playing, src]);

  return (
    <div className="relative aspect-[9/16] h-[420px] overflow-hidden rounded-[1.75rem] border-[6px] border-neutral-800 bg-black shadow-2xl">
      {src ? (
        <video
          key={src}
          ref={videoRef}
          src={src}
          poster={assets.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label="Sample clip"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <StockReel playing={playing} />
      )}

      {/* The edit's hook and captions, drawn in code over the clip, so they
          stay sharp and match the hook picked below. */}
      <div className="svc-mp absolute inset-0" data-play={playing ? "" : undefined}>
        <p className="svc-enter absolute inset-x-3 top-8 rounded-md bg-[#000]/70 px-2 py-1.5 text-center text-[13px] leading-tight font-extrabold text-[#fff]" key={hook}>
          {hook}
        </p>
        <span className="absolute inset-x-0 bottom-24 flex justify-center">
          <span className="relative h-7 w-40 text-center text-sm font-extrabold tracking-tight text-[#fff] uppercase">
            <span className="svc-a-word1 absolute inset-0 rounded bg-[#000]/60 px-2 py-1">{captionWords[0]}</span>
            <span className="svc-a-word2 absolute inset-0 rounded bg-[#000]/60 px-2 py-1">{captionWords[1]}</span>
            <span className="svc-a-word3 absolute inset-0 rounded bg-brass-400 px-2 py-1 text-neutral-950">
              {captionWords[2]}
            </span>
          </span>
        </span>
      </div>

      <div className="absolute inset-x-3 top-3 h-1 overflow-hidden rounded-full bg-[#fff]/25">
        <span
          className={clsx(
            "block h-full origin-left rounded-full bg-[#fff]",
            playing ? "svc-reel-fast" : "w-full"
          )}
        />
      </div>
      <Heart aria-hidden="true" className="absolute right-3 bottom-8 h-5 w-5 fill-[#fff] text-[#fff]" />
      <span className="absolute bottom-3 left-3 rounded bg-[#000]/60 px-1.5 py-0.5 text-[10px] font-semibold text-[#fff]">
        0:21
      </span>
    </div>
  );
}

/**
 * The clip built from stock shots, for when no video is in /public: it cuts
 * between three on a six-second loop (services.css, `svc-a-cut*`), the
 * captions' timing, each graded and pushing in. Still (off screen, paused or
 * reduced motion) it holds the first shot.
 */
function StockReel({ playing }: { playing: boolean }) {
  return (
    <div aria-hidden="true" className="svc-mp absolute inset-0" data-play={playing ? "" : undefined}>
      {demoImages.reel.slice(0, 3).map((src, index) => (
        <span key={src} className={clsx("absolute inset-0 overflow-hidden", `svc-a-cut${index + 1}`)}>
          <Photo src={src} className="svc-l-punch h-full w-full object-cover saturate-[1.15] contrast-[1.08]" />
        </span>
      ))}
      <span className="absolute inset-0 bg-gradient-to-b from-[#000]/35 via-transparent to-[#000]/45" />
    </div>
  );
}
