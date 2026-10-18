"use client";

import clsx from "clsx";
import { Check, Heart, Mic, Phone, Search, Star } from "lucide-react";
import type { ServiceSlug } from "@/data/services";
import { useInView } from "@/lib/hooks/useInView";
import "./services.css";

/**
 * A tiny looping picture of each service working, readable in under a
 * second: an old site turning into a new one, a business climbing to #1, a
 * late call getting booked, a lead getting a reply, a clip getting captions,
 * a voice note becoming a quote. Used on the homepage showcase, the
 * /how-it-works cards and the /services rows.
 *
 * Pure CSS (services.css) that scales with its box (`cqw` units), so the
 * same preview works as a thumbnail and as a large panel. It only moves
 * while on screen, and under reduced motion it holds its finished frame.
 * Decorative: the card around it names the service, so screen readers skip
 * it.
 */
export function MiniPreview({
  slug,
  className,
}: {
  slug: ServiceSlug;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const Preview = previews[slug];
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-play={inView ? "" : undefined}
      className={clsx(
        "svc-mp @container relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-[#050b18] select-none light:bg-[#f6f7f9]",
        className
      )}
    >
      <Preview />
    </div>
  );
}

const previews: Record<ServiceSlug, () => React.JSX.Element> = {
  websites: WebsitesPreview,
  "get-found": GetFoundPreview,
  "ai-calls": AiCallsPreview,
  "follow-up": FollowUpPreview,
  content: ContentPreview,
  "custom-ai": CustomAiPreview,
};

const bar = "rounded-full bg-white/15";

function WebsitesPreview() {
  return (
    <div className="svc-a-fade absolute inset-0">
      <div className="flex h-[11%] items-center gap-[1.2cqw] border-b border-white/10 px-[3cqw]">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="h-[1.4cqw] w-[1.4cqw] rounded-full bg-white/20" />
        ))}
        <span className="ml-[2cqw] rounded bg-white/[0.06] px-[2cqw] py-[0.4cqw] text-[2.2cqw] text-neutral-400">
          yourbusiness.com
        </span>
      </div>

      {/* The old site: cluttered and still loading. */}
      <div className="svc-a-out25 absolute inset-x-0 top-[11%] bottom-0 grid grid-cols-3 gap-[1.5cqw] p-[4cqw]">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className="rounded-sm bg-white/[0.07]" />
        ))}
        <span className="svc-l-spin absolute top-1/2 left-1/2 -mt-[3cqw] -ml-[3cqw] h-[6cqw] w-[6cqw] rounded-full border-[0.6cqw] border-white/20 border-t-white/60" />
      </div>

      {/* The new one: one headline, one button. */}
      <div className="svc-a-in25 absolute inset-x-0 top-[11%] bottom-0 grid grid-cols-[1.15fr_1fr] items-center gap-[4cqw] px-[6cqw]">
        <div>
          <span className="block h-[1.4cqw] w-[30%] rounded-full bg-brass-400/70" />
          <p className="mt-[2cqw] text-[4.6cqw] leading-[1.05] font-bold text-white">
            Roof repair you can count on
          </p>
          <span className={clsx(bar, "mt-[2cqw] block h-[1.4cqw] w-[80%]")} />
          <span className="mt-[3cqw] inline-block rounded-[0.8cqw] bg-brass-400 px-[2.6cqw] py-[1.2cqw] text-[2.4cqw] font-semibold text-neutral-950">
            Book a call
          </span>
        </div>
        <div className="aspect-[4/3] rounded-[1cqw] bg-[radial-gradient(120%_100%_at_30%_20%,rgb(var(--gold)/0.35),transparent_70%)] ring-1 ring-white/10" />
      </div>

      <div className="svc-a-in55 absolute right-[4cqw] bottom-[5cqw] flex items-center gap-[1.5cqw] rounded-[1cqw] border border-white/10 bg-neutral-950 px-[2.4cqw] py-[1.4cqw] text-[2.4cqw] font-semibold text-white shadow-lg light:bg-[#fff]">
        <span className="flex h-[3.6cqw] w-[3.6cqw] items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
          <Check className="h-[2.4cqw] w-[2.4cqw]" />
        </span>
        New lead received
      </div>
    </div>
  );
}

function GetFoundPreview() {
  const rows = [
    { name: "Your Roofing Co.", stars: 5, you: true },
    { name: "Ridgeline Roofing", stars: 4 },
    { name: "Summit Exteriors", stars: 4 },
    { name: "Oak Hill Roof Pros", stars: 3 },
  ];
  return (
    <div className="svc-a-fade absolute inset-0 px-[5cqw] pt-[4.5cqw]">
      <div className="flex items-center gap-[1.6cqw] rounded-full border border-white/10 bg-white/[0.04] px-[2.6cqw] py-[1.4cqw] text-[2.6cqw] text-neutral-300">
        <Search className="h-[2.8cqw] w-[2.8cqw] text-neutral-400" />
        roofer near me
      </div>
      <div className="relative mt-[3cqw]">
        {rows.map((row, i) => (
          <div
            key={row.name}
            style={{ top: `${i * 12}cqw` }}
            className={clsx(
              "absolute inset-x-0 flex h-[10cqw] items-center gap-[2cqw] rounded-[1cqw] border px-[2.4cqw]",
              row.you
                ? "svc-a-rankup z-10 border-brass-400/60 bg-[#0f2346] light:bg-[#fff]"
                : "svc-a-rankdown border-white/10 bg-white/[0.03]"
            )}
          >
            <span
              className={clsx(
                "flex h-[4.6cqw] w-[4.6cqw] shrink-0 items-center justify-center rounded-full text-[2.3cqw] font-bold",
                row.you ? "bg-brass-400 text-neutral-950" : "bg-white/10 text-neutral-300"
              )}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className={clsx("block truncate text-[2.6cqw] font-semibold", row.you ? "text-white" : "text-neutral-300")}>
                {row.name}
              </span>
              <span className="mt-[0.4cqw] flex gap-[0.3cqw]">
                {Array.from({ length: 5 }, (_, s) => (
                  <Star
                    key={s}
                    className={clsx(
                      "h-[2cqw] w-[2cqw]",
                      s < row.stars ? "fill-brass-300 text-brass-300" : "text-white/20"
                    )}
                  />
                ))}
              </span>
            </span>
            {row.you && (
              <span className="svc-a-in55 flex items-center gap-[0.8cqw] rounded-full bg-brass-400 px-[2cqw] py-[0.8cqw] text-[2.2cqw] font-semibold text-neutral-950">
                <Phone className="h-[2.2cqw] w-[2.2cqw]" />
                Call
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Phone916({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-[6%] bottom-[6%] left-1/2 aspect-[9/16] -translate-x-1/2 overflow-hidden rounded-[3cqw] border-[0.6cqw] border-white/15 bg-[#0f2346] light:bg-[#fff]">
      {children}
    </div>
  );
}

function AiCallsPreview() {
  return (
    <div className="svc-a-fade absolute inset-0">
      <Phone916>
        {/* Ringing at 11:48 PM. */}
        <div className="svc-a-out40 absolute inset-0 flex flex-col items-center justify-center gap-[2cqw] text-center">
          <span className="relative flex h-[9cqw] w-[9cqw] items-center justify-center rounded-full bg-brass-400 text-neutral-950">
            <span className="svc-l-pulse absolute inset-0 rounded-full bg-brass-400/50" />
            <Phone className="relative h-[4cqw] w-[4cqw]" />
          </span>
          <span className="text-[2.4cqw] font-semibold text-white">Incoming call</span>
          <span className="text-[2.2cqw] text-neutral-400">11:48 PM</span>
        </div>
        {/* Answered and booked. */}
        <div className="absolute inset-0 flex flex-col justify-center gap-[1.6cqw] p-[2.4cqw]">
          <span className="svc-a-in40 self-start rounded-[1.4cqw] bg-white/10 px-[1.8cqw] py-[1.2cqw] text-[1.9cqw] leading-tight text-neutral-200">
            My AC just stopped working.
          </span>
          <span className="svc-a-in55 self-end rounded-[1.4cqw] bg-brass-400/20 px-[1.8cqw] py-[1.2cqw] text-[1.9cqw] leading-tight text-white">
            I can get a tech there tomorrow at 9.
          </span>
          <span className="svc-a-in70 mt-[1cqw] flex items-center justify-center gap-[0.8cqw] rounded-full bg-emerald-400/15 px-[1.6cqw] py-[1cqw] text-[1.9cqw] font-semibold text-emerald-300">
            <Check className="h-[2.2cqw] w-[2.2cqw]" />
            Booked by AI
          </span>
        </div>
      </Phone916>
    </div>
  );
}

function FollowUpPreview() {
  const bubble = "max-w-[70%] rounded-[1.6cqw] px-[2.4cqw] py-[1.4cqw] text-[2.4cqw] leading-snug";
  return (
    <div className="svc-a-fade absolute inset-0 flex flex-col justify-center gap-[2cqw] px-[7cqw]">
      <span className="svc-a-in10 self-start rounded-full border border-white/10 px-[2cqw] py-[0.6cqw] text-[2cqw] font-semibold tracking-wider text-neutral-400 uppercase">
        New lead · Sam
      </span>
      <span className={clsx(bubble, "svc-a-in25 self-end bg-brass-400/20 text-white")}>
        Hi Sam! Thanks for reaching out. Does Friday work for a quote?
        <span className="mt-[0.6cqw] block text-right text-[1.8cqw] text-neutral-400">Replied in 0:41</span>
      </span>
      <span className={clsx(bubble, "svc-a-in40 self-start bg-white/10 text-neutral-200")}>
        Yes, Friday works.
      </span>
      <span className="svc-a-in55 flex items-center gap-[1cqw] self-end rounded-full bg-emerald-400/15 px-[2.4cqw] py-[1cqw] text-[2.2cqw] font-semibold text-emerald-300">
        <Check className="h-[2.4cqw] w-[2.4cqw]" />
        Booked · Fri 10:00 AM
      </span>
    </div>
  );
}

function ContentPreview() {
  return (
    <div className="absolute inset-0">
      <Phone916>
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgb(var(--gold)/0.35),transparent_45%),linear-gradient(20deg,#2a2c31,#101113)] light:bg-[linear-gradient(160deg,rgb(var(--gold)/0.25),transparent_45%),linear-gradient(20deg,#dfe4ec,#f6f7f9)]" />
        <div className="absolute inset-x-[2cqw] top-[2cqw] h-[0.6cqw] overflow-hidden rounded-full bg-white/20">
          <span className="svc-a-progress block h-full rounded-full bg-white" />
        </div>
        <div className="absolute inset-x-0 top-[44%] flex justify-center">
          <span className="relative h-[5cqw] w-[24cqw] text-center text-[2.8cqw] font-extrabold tracking-tight text-white uppercase">
            <span className="svc-a-word1 absolute inset-0 rounded bg-black/60 px-[1cqw] py-[0.6cqw]">Stop</span>
            <span className="svc-a-word2 absolute inset-0 rounded bg-black/60 px-[1cqw] py-[0.6cqw]">scrolling</span>
            <span className="svc-a-word3 absolute inset-0 rounded bg-brass-400 px-[1cqw] py-[0.6cqw] text-neutral-950">
              Watch this
            </span>
          </span>
        </div>
        <Heart className="absolute right-[2cqw] bottom-[5cqw] h-[3.4cqw] w-[3.4cqw] fill-white text-white" />
      </Phone916>
    </div>
  );
}

function CustomAiPreview() {
  const waves = [40, 75, 55, 95, 65, 85, 45, 70, 50];
  return (
    <div className="svc-a-fade absolute inset-0 grid grid-cols-[0.8fr_1.2fr] items-center gap-[4cqw] px-[6cqw]">
      <div className="flex flex-col items-center gap-[2.4cqw]">
        <span className="flex h-[10cqw] w-[10cqw] items-center justify-center rounded-full border border-brass-400/50 text-brass-300">
          <Mic className="h-[4.4cqw] w-[4.4cqw]" />
        </span>
        <span className="flex h-[8cqw] items-center gap-[0.8cqw]">
          {waves.map((height, i) => (
            <span
              key={i}
              style={{ height: `${height}%`, animationDelay: `${i * 0.11}s` }}
              className="svc-l-wave w-[0.9cqw] rounded-full bg-brass-300/80"
            />
          ))}
        </span>
        <span className="text-[2.1cqw] text-neutral-400">&ldquo;40 feet of gutter&hellip;&rdquo;</span>
      </div>
      <div className="relative rounded-[1.2cqw] border border-white/10 bg-[#0f2346] p-[3cqw] light:bg-[#fff]">
        <p className="text-[2.6cqw] font-bold text-white">Quote</p>
        {[78, 64, 70].map((width, i) => (
          <span
            key={i}
            className={clsx(
              "mt-[2cqw] flex items-center justify-between gap-[2cqw]",
              ["svc-a-in25", "svc-a-in40", "svc-a-in55"][i]
            )}
          >
            <span className={clsx(bar, "h-[1.4cqw]")} style={{ width: `${width}%` }} />
            <span className="h-[1.4cqw] w-[12%] rounded-full bg-white/25" />
          </span>
        ))}
        <span className="mt-[2.6cqw] block h-px bg-white/10" />
        <span className="svc-a-in70 absolute -right-[2cqw] -bottom-[3cqw] rotate-[-6deg] rounded-[0.8cqw] border-[0.4cqw] border-emerald-400/70 bg-neutral-950 px-[1.8cqw] py-[0.8cqw] text-[2.2cqw] font-bold tracking-wider text-emerald-300 uppercase light:bg-[#fff]">
          Quote ready
        </span>
      </div>
    </div>
  );
}
