import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Check, MessageSquareText, PhoneIncoming } from "lucide-react";
import { leeSystemsRoutes } from "@/data/lee-systems";
import { site } from "@/data/site";
import { BookCallLink } from "@/components/ui/BookCallLink";

/** The two halves of the offer, three points each (the owner's wording). */
const offer = [
  {
    title: "Websites",
    points: [
      "Loads fast and looks sharp on any screen",
      "Turns visitors into customers",
      "Built personally for your business",
    ],
  },
  {
    title: "Automations",
    points: [
      "Answers your business calls 24/7 with an AI assistant",
      "Answers every new lead in under a minute",
      "Endless possibilities: if it's done by hand, it can be automated",
    ],
  },
];

/** What the phone shows: the automations at work, in plain words. */
const feed = [
  { Icon: PhoneIncoming, title: "Missed call", body: "Texted back automatically" },
  { Icon: MessageSquareText, title: "New website lead", body: "Reply sent, follow-up scheduled" },
  { Icon: CalendarCheck, title: "Job booked", body: "Added to your calendar" },
];

/** A real build for the laptop screen. */
const laptopShot = site.projects.find((project) => project.image) ?? null;

/**
 * The offer (the black-and-gold redesign, 2026-10-18): what LEU builds,
 * beside a laptop showing a real client site and a phone showing the
 * automations at work, then the two calls the offer has always had.
 */
export function HomeFeature() {
  return (
    <section aria-labelledby="home-offer-title" className="ds-section">
      <div className="ds-container grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div data-reveal>
          <p className="ds-eyebrow">Websites &amp; AI automation</p>
          <h2 id="home-offer-title" className="ds-h2 ds-h2--sm mt-4">
            A website that brings customers in, <span className="ds-accent">and automations that never let one slip.</span>
          </h2>
          <p className="ds-sub mt-6 max-w-xl">
            Get custom AI workflows and a high-performance website that run your work on autopilot with
            guaranteed results. Built personally for you.
          </p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {offer.map((part) => (
              <div key={part.title}>
                <h3 className="border-b border-white/10 pb-3 font-mono text-xs font-medium uppercase tracking-[0.3em] text-brass-400">
                  {part.title}
                </h3>
                <ul className="ds-checks mt-4 text-[0.9375rem]">
                  {part.points.map((point) => (
                    <li key={point}>
                      <Check aria-hidden="true" strokeWidth={2.5} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BookCallLink arrow />
            <Link href={leeSystemsRoutes.home} className="btn-ds-outline">
              See what we build
            </Link>
          </div>
        </div>

        {/* The devices are illustration: the copy beside them says it all. On a
            narrow phone the phone's feed wraps and it grows up past the
            laptop, so the top padding keeps it off the buttons above. */}
        <div aria-hidden="true" className="relative mx-auto w-full max-w-xl select-none pt-14 pb-10 min-[360px]:pt-8 min-[390px]:pt-4 sm:pt-0 lg:pb-0" data-reveal>
          <div className="absolute inset-x-[8%] top-[10%] bottom-[5%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(var(--gold)/0.18),transparent)]" />
          <div className="ds-laptop w-[88%]">
            <div className="ds-laptop-screen">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[0.35rem] bg-neutral-900">
                {laptopShot?.image && (
                  <Image
                    src={laptopShot.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 30rem, 80vw"
                    className="object-cover object-top"
                  />
                )}
              </div>
            </div>
            <div className="ds-laptop-base" />
          </div>

          <div className="ds-phone absolute right-0 bottom-0 w-[38%] min-w-[9.5rem]">
            <div className="ds-phone-screen px-3 pt-5 pb-4">
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[#9dbbf0]">LEU Automations</p>
              <ul className="mt-3 space-y-2">
                {feed.map(({ Icon, title, body }) => (
                  <li key={title} className="flex gap-2 rounded-md border border-white/10 bg-white/[0.04] p-2">
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9dbbf0]" strokeWidth={2} />
                    <span className="min-w-0">
                      <span className="block text-[0.65rem] font-semibold leading-tight text-[#f9fbfc]">{title}</span>
                      <span className="block text-[0.6rem] leading-snug text-[#a1a1aa]">{body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
