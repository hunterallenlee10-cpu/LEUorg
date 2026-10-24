"use client";

import {
  ClipboardCheck,
  ClipboardList,
  ClipboardX,
  MessageSquare,
  MessageSquareText,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  ShieldCheck,
} from "lucide-react";
import {
  createTimeline,
  useNarratedVideo,
  type VideoPanel,
} from "@/components/lee-systems/NarratedVideo";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { leeSystemsAnchors, pricingPromise } from "@/data/lee-systems";
import { twoPathsLines } from "@/data/two-paths-video";
import timing from "@/data/two-paths-video.timing.json";

/** The three systems the example lead passes through, left to right. */
const panels: VideoPanel[] = [
  {
    id: "calls",
    label: "Calls",
    icons: {
      idle: Phone,
      ringing: PhoneIncoming,
      good: PhoneCall,
      bad: PhoneMissed,
    },
    chips: { ringing: "Incoming call", good: "Answered by AI", bad: "Voicemail" },
  },
  {
    id: "follow-up",
    label: "Follow-up",
    icons: { idle: MessageSquare, good: MessageSquareText, bad: PhoneOutgoing },
    chips: { good: "Text sent", bad: "No answer" },
  },
  {
    id: "crm",
    label: "Intake + CRM",
    icons: { idle: ClipboardList, good: ClipboardCheck, bad: ClipboardX },
    chips: { good: "Saved to CRM", bad: "Never saved" },
  },
];

const video = createTimeline(twoPathsLines, timing);

/**
 * The frame and the fork of the "Two paths" section. The frame is one short
 * narrated video (the owner's ask, 2026-09-29): the same example lead played
 * by hand, then with AI, every line read aloud and captioned
 * (data/two-paths-video.ts), in the player the website video under it uses
 * too (NarratedVideo). "Do it by hand" under the left path starts it at the
 * by-hand run, and the fork lights the path the video is on.
 */
export function TwoPathsDemo() {
  const { frame, mode, playRun } = useNarratedVideo(video, {
    panels,
    id: "ls-paths-frame",
    label: "Video: a new customer calls at 11:48 PM, by hand and then with AI",
    playLabel: "Play the video: a new customer calls at 11:48 PM",
    runLabels: { before: "By hand", after: "With AI" },
    // AI footage cut to the narration (scripts/build-demo-films.mjs).
    film: { src: "/lee-systems/two-paths/two-paths-film.mp4", poster: "/lee-systems/two-paths/two-paths-film.webp" },
  });

  return (
    <div className="mx-auto max-w-4xl">
      {frame}

      {/* The fork, after the reference's: each path's label is what it does
          to your customers, its title what it does to your money, and its
          text the same two jobs (answering, following up) done by hand and
          by AI. The loss is in the red of money lost and the price in gold,
          as on "The choice is yours". The path the video is on lights up. */}
      <div className="ls-paths-fork" data-mode={mode}>
        <span className="ls-paths-stem" aria-hidden="true" />
        <div className="relative grid grid-cols-2">
          <div className="ls-paths-path">
            <span className="ls-paths-branch ls-paths-branch--left" aria-hidden="true" />
            <span className="ls-paths-node ls-paths-node--left" aria-hidden="true" />
            <h3 className="mt-4 sm:mt-5">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 sm:text-xs">
                Lose customers
              </span>
              <span className="ls-loss mt-1.5 block whitespace-nowrap text-xl font-bold leading-9 sm:text-4xl sm:leading-[3rem] md:text-5xl">
                Lose money
              </span>
            </h3>
            <p className="mb-6 mt-2 max-w-xs text-balance text-[13px] leading-relaxed text-neutral-400 sm:text-sm">
              Answer when you can. Follow up when you remember. Miss a call,
              and someone else gets paid for the job.
            </p>
            <button
              type="button"
              aria-controls="ls-paths-frame"
              className="btn-ls-muted mt-auto w-full max-w-[16rem] whitespace-nowrap px-2 text-[12px] min-[360px]:text-[13px] sm:text-base"
              onClick={() => playRun("before")}
            >
              Do it by hand
            </button>
          </div>

          <div className="ls-paths-path">
            <span className="ls-paths-branch ls-paths-branch--right" aria-hidden="true" />
            <span className="ls-paths-node ls-paths-node--right" aria-hidden="true" />
            <h3 className="mt-4 sm:mt-5">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brass-300 sm:text-xs">
                Win customers
              </span>
              {/* "to start" keeps the $0 on the free call: on its own it
                  could read as the price of the AI. */}
              <span className="mt-1.5 flex items-baseline justify-center gap-1.5">
                <span className="ls-price text-3xl font-bold leading-9 sm:text-5xl sm:leading-[3rem]">
                  $0
                </span>
                <span className="text-[13px] font-semibold text-brass-200/80 sm:text-base">
                  to start
                </span>
              </span>
            </h3>
            <p className="mb-6 mt-2 max-w-xs text-balance text-[13px] leading-relaxed text-neutral-300 sm:text-sm">
              AI answers every call, day or night, and follows up until they
              reply. They book with you, not whoever answers next.
            </p>
            <BookCallLink
              variant="glow"
              href={`#${leeSystemsAnchors.form}`}
              className="mt-auto w-full max-w-[16rem] whitespace-nowrap px-2 text-[12px] min-[360px]:text-[13px] sm:text-base"
            />
          </div>

          <span className="ls-paths-vs" aria-hidden="true">
            VS
          </span>
        </div>

        {/* The terms under the call button, from the FAQ ("no obligation to
            hire us afterwards") and the pricing promise. A row of their own,
            under the right path only, so the two buttons stay level. */}
        <div className="grid grid-cols-2">
          <p className="col-start-2 mt-3 px-4 text-center text-[11px] leading-snug text-neutral-400 sm:px-8 sm:text-xs">
            <ShieldCheck
              className="-mt-0.5 mr-1 inline h-3.5 w-3.5 text-brass-300"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap">No obligation</span>
            {" · "}
            <span className="whitespace-nowrap">{pricingPromise[0]}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
