import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

/**
 * The laptop and iPhone beside the onboarding steps. Purely decorative (the
 * steps carry every word that matters), so the whole stage is aria-hidden.
 *
 * The phone overlaps the right edge of the laptop screen, so every laptop
 * scene keeps its content out of that strip (the `pr-[15cqw]` on each).
 *
 * Each step has one scene per device, all stacked and cross-faded by
 * `active`. Nothing in a scene shows a figure: the brand rule is no invented
 * results, so the screens show what happens (a lead replied to, a booking
 * made) rather than how many.
 *
 * How the animation restarts. Every animated piece rests in its finished
 * state, and its animation only applies inside a scene marked
 * `data-active="true"` (see "LEU - onboarding devices" in
 * globals.css). Making a scene active re-applies the animation, so it plays
 * from the start each time; a scene fading out keeps its finished content
 * rather than blinking empty. Under prefers-reduced-motion the animations go
 * and the scenes just swap.
 */
export function OnboardingDevices({
  active,
  single = false,
}: {
  active: number;
  /** Draw only the active step's scenes (the homepage's one row per step),
   * instead of all three stacked for switching between. */
  single?: boolean;
}) {
  const show = (step: number) => !single || active === step;
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-xl select-none pb-10 lg:pb-14">
      <div className="absolute inset-x-[10%] top-[12%] bottom-[8%] -z-10 rounded-full bg-brass-400/[0.14] blur-3xl" />

      <Laptop>
        {show(0) && (
          <Scene active={active === 0}>
            <LaptopAudit />
          </Scene>
        )}
        {show(1) && (
          <Scene active={active === 1}>
            <LaptopBuild />
          </Scene>
        )}
        {show(2) && (
          <Scene active={active === 2}>
            <LaptopLive />
          </Scene>
        )}
      </Laptop>

      <Phone>
        {show(0) && (
          <Scene active={active === 0}>
            <PhoneAudit />
          </Scene>
        )}
        {show(1) && (
          <Scene active={active === 1}>
            <PhoneBuild />
          </Scene>
        )}
        {show(2) && (
          <Scene active={active === 2}>
            <PhoneLive />
          </Scene>
        )}
      </Phone>
    </div>
  );
}

function Scene({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div
      data-active={active}
      className={clsx(
        "ob-scene absolute inset-0 transition-opacity duration-500",
        active ? "opacity-100" : "opacity-0"
      )}
    >
      {children}
    </div>
  );
}

/** Staggers an animated piece; `i` steps are 120ms apart. */
function delay(i: number, start = 0): CSSProperties {
  return { animationDelay: `${start + i * 120}ms` };
}

/* ------------------------------------------------------------ devices -- */

function Laptop({ children }: { children: ReactNode }) {
  return (
    <div className="relative ml-[6%] w-[80%]">
      <div className="rounded-t-[1.1rem] border border-white/15 bg-neutral-900 p-[2.2%] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] light:shadow-[0_30px_70px_-30px_rgb(var(--ink)/0.3)]">
        <div className="@container relative aspect-[16/10] overflow-hidden rounded-[0.35rem] bg-neutral-950">
          {children}
        </div>
      </div>
      <div className="relative -mx-[7%] h-3 rounded-b-[1rem] bg-gradient-to-b from-neutral-600 to-neutral-800 shadow-[0_18px_30px_-12px_rgba(0,0,0,0.9)] light:shadow-[0_18px_30px_-14px_rgb(var(--ink)/0.35)]">
        <span className="absolute top-0 left-1/2 h-1 w-[16%] -translate-x-1/2 rounded-b-md bg-neutral-900/70" />
      </div>
    </div>
  );
}

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="ob-float absolute right-0 bottom-0 w-[28%]">
      <div className="rounded-[2rem] border border-white/20 bg-neutral-900 p-[5%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.95),0_0_0_1px_rgba(0,0,0,0.6)] light:shadow-[0_30px_60px_-24px_rgb(var(--ink)/0.35),0_0_0_1px_rgb(var(--ink)/0.12)]">
        <div className="@container relative aspect-[9/19] overflow-hidden rounded-[1.6rem] bg-neutral-950">
          <span className="absolute top-[2.5%] left-1/2 z-20 h-[3.4%] w-[34%] -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  );
}

/** The laptop app's title bar, shared by the three laptop scenes. */
function TitleBar({ label, live = false }: { label: string; live?: boolean }) {
  return (
    <div className="flex items-center gap-[1.4cqw] border-b border-white/10 px-[3cqw] py-[1.8cqw]">
      <span className="h-[1.3cqw] w-[1.3cqw] rounded-full bg-white/15" />
      <span className="h-[1.3cqw] w-[1.3cqw] rounded-full bg-white/15" />
      <span className="h-[1.3cqw] w-[1.3cqw] rounded-full bg-white/15" />
      <span className="ml-[2cqw] rounded-full bg-white/[0.06] px-[2.4cqw] py-[0.5cqw] text-[1.9cqw] text-neutral-400">
        yourbusiness.com
      </span>
      <span
        className={clsx(
          "ml-auto flex items-center gap-[1cqw] text-[1.9cqw] font-semibold",
          live ? "text-brass-300" : "text-neutral-400"
        )}
      >
        {live && <span className="ls-status h-[1.3cqw] w-[1.3cqw] rounded-full bg-brass-300" />}
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------- audit -- */

const auditRows = [
  { label: "Incoming calls", flag: "Missed after hours", width: "72%" },
  { label: "New leads", flag: "Hours to reply", width: "58%" },
  { label: "Client intake", flag: "Done by hand", width: "80%" },
  { label: "Follow-ups", flag: "Forgotten", width: "46%" },
  { label: "Invoices", flag: "Chased by hand", width: "64%" },
];

function LaptopAudit() {
  return (
    <div className="flex h-full flex-col">
      <TitleBar label="Audit" />
      <div className="relative flex-1 overflow-hidden py-[3cqw] pr-[15cqw] pl-[4cqw]">
        <p className="mb-[0.6cqw] text-[1.8cqw] font-semibold tracking-[0.2em] text-brass-300 uppercase">
          Process audit
        </p>
        <p className="mb-[2.6cqw] text-[3.2cqw] font-bold text-white">How the business runs today</p>
        <ul className="space-y-[1.6cqw]">
          {auditRows.map((row, i) => (
            <li key={row.label} className="flex items-center gap-[2cqw]">
              <span className="w-[17cqw] shrink-0 text-[2cqw] text-neutral-300">{row.label}</span>
              <span className="h-[1.1cqw] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <span
                  className="ob-grow block h-full rounded-full bg-neutral-500/60"
                  style={{ width: row.width, ...delay(i) }}
                />
              </span>
              <span
                className="ob-pop flex w-[23cqw] shrink-0 items-center gap-[1cqw] rounded-full border border-red-400/30 bg-red-400/[0.08] px-[1.6cqw] py-[0.4cqw] text-[1.7cqw] text-red-200/90"
                style={delay(i, 500)}
              >
                <span className="h-[1cqw] w-[1cqw] shrink-0 rounded-full bg-red-400/80" />
                {row.flag}
              </span>
            </li>
          ))}
        </ul>
        <span className="ob-scan pointer-events-none absolute inset-0">
          <span className="block h-[2px] w-full bg-gradient-to-r from-transparent via-brass-300 to-transparent shadow-[0_0_14px_rgb(var(--gold)/0.6)]" />
        </span>
      </div>
    </div>
  );
}

function PhoneAudit() {
  const notes = [
    { title: "Missed call", body: "No one picked up" },
    { title: "Missed call", body: "Caller hung up after 4 rings" },
    { title: "New web lead", body: "Waiting on a reply" },
  ];
  return (
    <div className="flex h-full flex-col px-[7cqw] pt-[22cqw]">
      <p className="text-center text-[16cqw] leading-none font-semibold text-white/90">9:41</p>
      <p className="mb-[8cqw] text-center text-[5cqw] text-neutral-400">Tuesday</p>
      <div className="space-y-[3cqw]">
        {notes.map((note, i) => (
          <Notification key={i} title={note.title} body={note.body} tone="alert" style={delay(i, 300)} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- build -- */

const buildNodes = ["New lead", "AI reply", "CRM", "Follow-up"];

function LaptopBuild() {
  return (
    <div className="flex h-full flex-col">
      <TitleBar label="Build" />
      <div className="grid flex-1 grid-cols-[1.15fr_1fr] gap-[3cqw] py-[3cqw] pr-[15cqw] pl-[4cqw]">
        {/* The website going together, block by block. */}
        <div className="flex flex-col gap-[1.6cqw] rounded-[1cqw] border border-white/10 bg-white/[0.03] p-[2.2cqw]">
          <div className="ob-rise flex items-center justify-between" style={delay(0)}>
            <span className="h-[1.6cqw] w-[12cqw] rounded bg-white/25" />
            <span className="flex gap-[1cqw]">
              <span className="h-[1cqw] w-[5cqw] rounded bg-white/15" />
              <span className="h-[1cqw] w-[5cqw] rounded bg-white/15" />
            </span>
          </div>
          <div className="ob-rise space-y-[1cqw] pt-[1cqw]" style={delay(1)}>
            <span className="block h-[2.4cqw] w-[85%] rounded bg-white/70" />
            <span className="block h-[2.4cqw] w-[60%] rounded bg-brass-300/80" />
          </div>
          <span className="ob-rise block h-[1.1cqw] w-[75%] rounded bg-white/15" style={delay(2)} />
          <span
            className="ob-pop mt-[0.6cqw] flex h-[4.2cqw] w-[20cqw] items-center justify-center rounded-[0.8cqw] bg-brass-400 text-[1.7cqw] font-bold text-neutral-950"
            style={delay(3)}
          >
            Book a call
          </span>
          <div className="mt-auto grid grid-cols-3 gap-[1.2cqw]">
            {[0, 1, 2].map((i) => (
              <span key={i} className="ob-rise block h-[7cqw] rounded-[0.8cqw] bg-white/[0.07]" style={delay(4 + i)} />
            ))}
          </div>
        </div>

        {/* The system behind it, wired up node by node. */}
        <div className="flex flex-col justify-center">
          {buildNodes.map((node, i) => (
            <div key={node} className="flex flex-col items-center">
              {i > 0 && (
                <span className="ob-wire block h-[3.4cqw] w-px bg-brass-300/70" style={delay(i, 200)} />
              )}
              <span
                className="ob-pop flex w-full items-center gap-[1.4cqw] rounded-[0.9cqw] border border-brass-400/40 bg-brass-400/[0.07] px-[2cqw] py-[1.3cqw] text-[1.9cqw] font-semibold text-neutral-100"
                style={delay(i, 250)}
              >
                <span className="h-[1.2cqw] w-[1.2cqw] rounded-full bg-brass-300" />
                {node}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneBuild() {
  return (
    <div className="flex h-full flex-col gap-[4cqw] px-[7cqw] pt-[18cqw] pb-[8cqw]">
      <div className="ob-rise flex items-center justify-between" style={delay(0)}>
        <span className="h-[5cqw] w-[34cqw] rounded bg-white/25" />
        <span className="flex flex-col gap-[1.4cqw]">
          <span className="h-[1cqw] w-[7cqw] rounded bg-white/40" />
          <span className="h-[1cqw] w-[7cqw] rounded bg-white/40" />
        </span>
      </div>
      <div className="ob-rise space-y-[2.4cqw] pt-[4cqw]" style={delay(1)}>
        <span className="block h-[6cqw] w-[92%] rounded bg-white/70" />
        <span className="block h-[6cqw] w-[70%] rounded bg-brass-300/80" />
      </div>
      <div className="ob-rise space-y-[2cqw]" style={delay(2)}>
        <span className="block h-[2.6cqw] w-full rounded bg-white/15" />
        <span className="block h-[2.6cqw] w-[80%] rounded bg-white/15" />
      </div>
      <span
        className="ob-pop flex h-[13cqw] items-center justify-center rounded-[3cqw] bg-brass-400 text-[5.4cqw] font-bold text-neutral-950"
        style={delay(3)}
      >
        Book a call
      </span>
      <span className="ob-rise mt-auto block h-[24cqw] rounded-[3cqw] bg-white/[0.07]" style={delay(4)} />
    </div>
  );
}

/* -------------------------------------------------------------- live -- */

const liveTiles = ["Leads answered", "Follow-ups sent", "Calls booked"];

function LaptopLive() {
  return (
    <div className="flex h-full flex-col">
      <TitleBar label="All systems running" live />
      <div className="flex flex-1 flex-col py-[3cqw] pr-[15cqw] pl-[4cqw]">
        <p className="mb-[0.6cqw] text-[1.8cqw] font-semibold tracking-[0.2em] text-brass-300 uppercase">
          This month
        </p>
        <p className="mb-[2cqw] text-[3.2cqw] font-bold text-white">Running while you work</p>
        <div className="relative flex-1">
          <svg viewBox="0 0 200 70" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
            {[17.5, 35, 52.5].map((y) => (
              <line key={y} x1="0" x2="200" y1={y} y2={y} className="stroke-[rgb(var(--ink)/0.06)]" vectorEffect="non-scaling-stroke" />
            ))}
            <path
              className="ob-area"
              d="M0 64 C30 60 45 56 70 50 C95 44 110 46 135 32 C155 21 175 14 200 5 L200 70 L0 70 Z"
              fill="url(#ob-area)"
            />
            <path
              className="ob-draw stroke-brass-300"
              d="M0 64 C30 60 45 56 70 50 C95 44 110 46 135 32 C155 21 175 14 200 5"
              strokeWidth="1.4"
            />
            <defs>
              <linearGradient id="ob-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" className="[stop-color:rgb(var(--gold)/0.22)]" />
                <stop offset="100%" className="[stop-color:rgb(var(--gold)/0)]" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="mt-[2.4cqw] grid grid-cols-3 gap-[1.6cqw]">
          {liveTiles.map((tile, i) => (
            <div
              key={tile}
              className="ob-rise rounded-[0.9cqw] border border-white/10 bg-white/[0.04] px-[1.8cqw] py-[1.4cqw]"
              style={delay(i, 700)}
            >
              <p className="mb-[1cqw] text-[1.7cqw] text-neutral-400">{tile}</p>
              <span className="block h-[1cqw] overflow-hidden rounded-full bg-white/[0.06]">
                <span
                  className="ob-grow block h-full rounded-full bg-brass-300"
                  style={{ width: `${70 + i * 10}%`, ...delay(i, 900) }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneLive() {
  const notes = [
    { title: "New lead", body: "Replied in under a minute" },
    { title: "Appointment booked", body: "Added to your calendar" },
    { title: "Follow-up sent", body: "Quote from Monday" },
    { title: "Review requested", body: "Job marked complete" },
  ];
  return (
    <div className="flex h-full flex-col px-[7cqw] pt-[22cqw]">
      <p className="text-center text-[16cqw] leading-none font-semibold text-white/90">9:41</p>
      <p className="mb-[8cqw] text-center text-[5cqw] text-neutral-400">Tuesday</p>
      <div className="space-y-[3cqw]">
        {notes.map((note, i) => (
          <Notification key={note.title} title={note.title} body={note.body} tone="good" style={delay(i * 2, 200)} />
        ))}
      </div>
    </div>
  );
}

function Notification({
  title,
  body,
  tone,
  style,
}: {
  title: string;
  body: string;
  tone: "alert" | "good";
  style?: CSSProperties;
}) {
  return (
    <div
      className="ob-drop flex items-start gap-[3cqw] rounded-[4cqw] border border-white/10 bg-white/[0.08] px-[4cqw] py-[3cqw] backdrop-blur"
      style={style}
    >
      <span
        className={clsx(
          "mt-[1cqw] h-[4.5cqw] w-[4.5cqw] shrink-0 rounded-full",
          tone === "alert" ? "bg-red-400/80" : "bg-brass-300"
        )}
      />
      <span className="min-w-0">
        <span className="block text-[5cqw] leading-tight font-semibold text-white">{title}</span>
        <span className="block truncate text-[4.4cqw] leading-tight text-neutral-400">{body}</span>
      </span>
    </div>
  );
}
