"use client";

import {
  Hourglass,
  ImageOff,
  LayoutTemplate,
  LoaderCircle,
  LogOut,
  MailCheck,
  MousePointerClick,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  createTimeline,
  useNarratedVideo,
  type VideoPanel,
} from "@/components/lee-systems/NarratedVideo";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { leeSystemsAnchors } from "@/data/lee-systems";
import { websiteVideoLines } from "@/data/website-video";
import timing from "@/data/website-video.timing.json";

/** What a visit to a site depends on, left to right. */
const panels: VideoPanel[] = [
  {
    id: "speed",
    label: "Speed",
    icons: { idle: Smartphone, ringing: LoaderCircle, good: Zap, bad: Hourglass },
    chips: { ringing: "Opening", good: "Loaded fast", bad: "Still loading" },
  },
  {
    id: "design",
    label: "Design",
    icons: { idle: LayoutTemplate, good: Sparkles, bad: ImageOff },
    chips: { good: "Looks the part", bad: "Looks dated" },
  },
  {
    id: "leads",
    label: "Leads",
    icons: { idle: MousePointerClick, good: MailCheck, bad: LogOut },
    chips: { good: "Request sent", bad: "Tab closed" },
  },
];

const video = createTimeline(websiteVideoLines, timing);

/**
 * The website video and its one way on: the same visit to an outdated site
 * and then to a site built right (data/website-video.ts), in the player and
 * frame "Two paths" uses, then a lit line down to "Book a free call". There
 * is no fork here, since "Two paths" just made the choice; the terms under
 * the button are the FAQ's (each site is quoted on its own; you own your
 * domain and content).
 */
export function WebsiteVideo() {
  const { frame } = useNarratedVideo(video, {
    panels,
    id: "ls-website-video",
    label: "Video: a customer visits an outdated website, then one built right",
    playLabel: "Play the video: the same visit to two websites",
    runLabels: { before: "Outdated site", after: "Built right" },
    // AI footage cut to the narration (scripts/build-demo-films.mjs).
    film: { src: "/lee-systems/website-video/website-film.mp4", poster: "/lee-systems/website-video/website-film.webp" },
  });

  return (
    <div className="mx-auto max-w-4xl">
      {frame}

      <div className="flex flex-col items-center">
        <span className="ls-paths-stem ls-paths-stem--lit" aria-hidden="true" />
        <BookCallLink
          variant="glow"
          href={`#${leeSystemsAnchors.form}`}
          className="mt-5 w-full max-w-[16rem] px-2 text-[13px] sm:text-base"
        />
        <p className="mt-3 text-center text-[11px] leading-snug text-neutral-400 sm:text-xs">
          <ShieldCheck
            className="-mt-0.5 mr-1 inline h-3.5 w-3.5 text-brass-300"
            aria-hidden="true"
          />
          <span className="whitespace-nowrap">Quoted per project</span>
          {" · "}
          <span className="whitespace-nowrap">You own your domain and content</span>
        </p>
      </div>
    </div>
  );
}
