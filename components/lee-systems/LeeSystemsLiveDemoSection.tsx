"use client";

import clsx from "clsx";
import {
  BarChart3,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Database,
  Images,
  Inbox,
  Lock,
  Menu,
  MessageSquare,
  RotateCw,
  Send,
  ShieldCheck,
  Star,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";
import { leeSystemsAnchors } from "@/data/lee-systems";
import { site, telHref } from "@/data/site";

/**
 * The live demo on /how-it-works: one lead, start to finish (the owner's ask,
 * 2026-09-30, merging the "Your site" and "Example: a new lead" animations
 * into one). The website we build catches the lead, and the system we build
 * handles it, as one composition down the middle of the page:
 *
 *   01  A browser window. The page loads and its three sections build in
 *       order, each lighting its step marker. A visitor types their name,
 *       number and what they need, and the button reads "Sent".
 *       The three values gather into one small lead chip ("Alex · website"),
 *       which leaves the button along a gold line.
 *   02  The workflow. The chip lands in "New lead", which shows the same
 *       name the form was sent with, then the run splits to the instant reply
 *       and the intake form, meets again in your CRM and fans out to
 *       follow-up, the booked appointment and the daily report. The booked
 *       appointment lights brightest and holds, then everything fades back to
 *       idle together and it runs again.
 *
 * The line from the form's button to "New lead" runs straight down the
 * middle, because the button and the trigger are both centred on the
 * composition. That line is what joins the two halves into one system.
 *
 * Timing. One loop of LOOP_SECONDS, driven by a small requestAnimationFrame
 * clock rather than CSS keyframes: typing goes character by character, the
 * chip and the packets ride their measured paths, and pausing is not
 * advancing the clock. `render(t)` draws the whole demo at time `t`, so any
 * moment can be drawn on its own, and it only writes transforms, opacities,
 * custom properties that CSS turns into transforms and opacities, and the
 * connectors' stroke-dashoffset. Every constant it reads is below.
 *
 * It plays only while it is on screen (an IntersectionObserver), and not in a
 * hidden tab. With prefers-reduced-motion it draws the finished
 * run as a still: the form sent, the lead in "New lead", every step checked
 * and the appointment booked. Without scripting the markup already is that
 * still, minus the connectors, which are measured.
 *
 * Geometry. The connectors are measured from where the layout put the
 * button, the nodes and the chip's slot (layout offsets, so no transform
 * mid-animation can throw them off), and re-measured on resize. The website
 * inside the window reflows at narrow widths instead of shrinking, so no
 * text anywhere is under 11px, and the workflow's last row turns into a list
 * below 640px.
 *
 * What it shows is illustrative. "Your Business" at yourbusiness.com stands
 * for the visitor's own site, not one we built; Alex is an example lead and
 * the phone number is in 555-0100 to 555-0199, the range kept for fiction.
 * No figure, rating, client or result.
 *
 * Self-contained: it takes the anchors (#websites on the website half,
 * #automation on the workflow half, which the old URLs redirect to) and the
 * optional call-answering demo line from data/, the brass colours from the
 * Tailwind theme, and nothing from its neighbours. Moving it is moving its one
 * line in app/lee-systems/page.tsx.
 */

/* ---------------------------------------------------------------- copy -- */

/**
 * The website's three sections, in the order a visitor meets them, each
 * with the note on what it is for.
 */
const siteSteps = [
  { label: "Says what you do, in one line", Block: HeroBlock },
  { label: "Proof they can check themselves", Block: ProofRow },
  { label: "One obvious next step", Block: FormBlock },
];

/** Generic on purpose: kinds of proof any business can show, no figures. */
const proof: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: Star, title: "Reviews", body: "From real customers" },
  { Icon: Images, title: "Our work", body: "Photos of finished jobs" },
  { Icon: ShieldCheck, title: "Licensed", body: "And insured" },
];

/** What the visitor types, one field at a time. */
const fields = [
  { placeholder: "Name", value: "Alex" },
  { placeholder: "Phone", value: "(240) 555-0142" },
  { placeholder: "How can we help?", value: "Looking for a quote", wide: true },
];

/**
 * The lead as the workflow sees it: the name typed into the form and where it
 * came from. Built from the form's own value so the two cannot disagree.
 */
const LEAD = `${fields[0].value} · website`;

/** The one sentence a screen reader hears in place of the demo. */
const DESCRIPTION = `Example: a visitor named ${fields[0].value} sends the form on your website, and the lead goes straight into your system, which texts them back, fills in the intake form, saves them to your CRM, starts follow-up, books an appointment and adds it to your daily report.`;

type NodeId =
  | "lead"
  | "reply"
  | "intake"
  | "crm"
  | "followup"
  | "booked"
  | "report";

/**
 * The workflow's steps, in the order the lead reaches them (which the timing
 * below relies on). Each says what it is while it waits (`idle`) and what it
 * did once it has run (`done`).
 */
const nodes: {
  id: NodeId;
  label: string;
  Icon: LucideIcon;
  idle: string;
  done: string;
}[] = [
  { id: "lead", label: "New lead", Icon: Inbox, idle: "Website form", done: LEAD },
  { id: "reply", label: "Instant reply", Icon: MessageSquare, idle: "Text message", done: "Text sent" },
  { id: "intake", label: "Intake form", Icon: ClipboardList, idle: "Form", done: "Filled in" },
  { id: "crm", label: "Your CRM", Icon: Database, idle: "Contact", done: "Contact saved" },
  { id: "followup", label: "Follow-up sequence", Icon: Send, idle: "Messages", done: "Started" },
  { id: "booked", label: "Booked appointment", Icon: CalendarCheck, idle: "Calendar", done: "Tue · 10:00 AM" },
  { id: "report", label: "Daily report", Icon: BarChart3, idle: "Email", done: "In the report" },
];

const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<
  NodeId,
  (typeof nodes)[number]
>;

/** Where the lead goes from each step. */
const edges: { from: NodeId; to: NodeId }[] = [
  { from: "lead", to: "reply" },
  { from: "lead", to: "intake" },
  { from: "reply", to: "crm" },
  { from: "intake", to: "crm" },
  { from: "crm", to: "followup" },
  { from: "crm", to: "booked" },
  { from: "crm", to: "report" },
];

/* -------------------------------------------------------------- timing -- */

/**
 * The page loading: the load bar runs across, the nav comes in, and the
 * three sections follow a second apart, each taking REVEAL to settle. Slowed
 * at the owner's ask (2026-09-30), along with the rest of the loop, so each
 * section is seen arriving rather than flashing in.
 */
const REVEAL = 0.9;
const LOAD_FROM = 0.1;
const LOAD_TO = 1.1;
const NAV_IN = 0.7;
/** When each of the three sections starts to come in. */
const STEP_IN = [1.3, 2.3, 3.3];

/**
 * Typing. Each field is focused, typed into a character at a time, and left
 * FIELD_GAP before the next is focused. The name is typed slowest because it
 * is the one the chip carries.
 */
const TYPE_FROM = 4.6;
const FOCUS_TO_TYPE = 0.3;
const FIELD_GAP = 0.35;
const CHAR_SECONDS = [0.12, 0.07, 0.06];

const focusAt: number[] = [];
const charAt: number[][] = [];
{
  let clock = TYPE_FROM;
  fields.forEach((field, i) => {
    focusAt[i] = clock;
    const start = clock + FOCUS_TO_TYPE;
    charAt[i] = [...field.value].map((_, j) => start + j * CHAR_SECONDS[i]);
    clock = start + field.value.length * CHAR_SECONDS[i] + FIELD_GAP;
  });
}
const TYPED = charAt[fields.length - 1].at(-1)!;

/** The pointer glides to the button and clicks it; the button reads "Sent". */
const CURSOR_IN = TYPED + 0.15;
const CLICK = CURSOR_IN + 0.9;
const SENT = CLICK + 0.12;

/**
 * The lead leaves the site: the three values gather on the button's port
 * (GHOST_SECONDS each, GHOST_STAGGER apart), the chip forms there, and it
 * rides the line down into "New lead", landing at LAND.
 */
const GATHER = SENT + 0.35;
const GHOST_SECONDS = 0.6;
const GHOST_STAGGER = 0.09;
const CHIP_IN = GATHER + 0.45;
const DEPART = CHIP_IN + 0.5;
const TRAVEL_SECONDS = 1.7;
const LAND = DEPART + TRAVEL_SECONDS;

/**
 * The workflow. A step lights as the lead reaches it and sends it on after
 * RUN_SECONDS; the lead takes EDGE_SECONDS along a wire, and a step's later
 * wires leave STAGGER_SECONDS apart so a fan-out reads in order.
 */
const RUN_SECONDS = 0.7;
const EDGE_SECONDS = 0.85;
const STAGGER_SECONDS = 0.12;

/**
 * When the lead reaches each step and when it sets off along each wire,
 * worked out from the graph rather than written by hand: a wire leaves once
 * its step has run, and a step starts once the last of its wires has
 * arrived. `nodes` is in the order the lead reaches them, so every wire into
 * a step is known before the step is.
 */
const arriveAt = {} as Record<NodeId, number>;
const edgeAt: number[] = [];
for (const { id } of nodes) {
  const arrivals = edges.flatMap((e, i) =>
    e.to === id ? [edgeAt[i] + EDGE_SECONDS] : []
  );
  arriveAt[id] = arrivals.length ? Math.max(...arrivals) : LAND;
  let k = 0;
  edges.forEach((e, i) => {
    if (e.from === id) edgeAt[i] = arriveAt[id] + RUN_SECONDS + k++ * STAGGER_SECONDS;
  });
}

/**
 * The payoff: once the last step has ticked, the booked appointment lights
 * brightest and the finished run holds for HOLD_SECONDS. Then everything
 * fades back to idle together over RESET_SECONDS, and after a short rest the
 * loop starts again with the page loading.
 */
const PAYOFF = Math.max(...Object.values(arriveAt)) + 0.45;
const PAYOFF_SECONDS = 0.7;
const HOLD_SECONDS = 2.8;
const RESET = PAYOFF + PAYOFF_SECONDS + HOLD_SECONDS;
const RESET_SECONDS = 0.9;
const LOOP_SECONDS = RESET + RESET_SECONDS + 0.5;

/** The moment drawn, still, for reduced motion: the finished run. */
const STILL = PAYOFF + PAYOFF_SECONDS + 0.5;

/**
 * How far down the line the chip forms, in pixels: just under the button, so
 * it pulls out of the form rather than covering "Sent".
 */
const CHIP_FORMS_AT = 12;

/** Where the pointer starts, from the button's middle: up by the fields. */
const CURSOR_FROM = { x: 84, y: -58 };

/* -------------------------------------------------------------- easing -- */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** How far `t` is through the span from `from` to `to`, 0 to 1. */
const ramp = (t: number, from: number, to: number) =>
  clamp01((t - from) / (to - from));
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const easeInOut = (x: number) =>
  x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;
/** Up at `on` over `rise`, held, and down at `off` over `fall`. */
const pulse = (t: number, on: number, off: number, rise = 0.15, fall = 0.2) =>
  easeInOut(ramp(t, on, on + rise)) * (1 - easeInOut(ramp(t, off, off + fall)));

/* ------------------------------------------------------------- styles -- */

/**
 * The states `render` drives, as custom properties CSS turns into opacities
 * and transforms. Each fallback is the finished run, so the markup on its
 * own (no scripting) is the still that reduced motion shows. React hoists
 * this into <head> once, keyed by `href`; every class carries `lsd-` so
 * nothing else on the site can collide with it.
 */
const styles = `
.lsd-in { opacity: var(--in, 1); transform: translateY(calc((1 - var(--in, 1)) * 8px)); }
.lsd-lit { opacity: var(--lit, 0); }
.lsd-focus { opacity: var(--focus, 0); }
.lsd-placeholder { opacity: 0; }
.lsd-press { transform: scale(calc(1 - 0.05 * var(--press, 0))); }
.lsd-send { opacity: calc(1 - var(--sent, 1)); }
.lsd-sent { opacity: var(--sent, 1); }
.lsd-node { --lit: 0; --done: 1; --pay: 0; }
.lsd-node-booked { --pay: 1; }
.lsd-ring { opacity: var(--lit); }
.lsd-doneborder, .lsd-tile, .lsd-done { opacity: var(--done); }
.lsd-idle, .lsd-waiting { opacity: calc(1 - var(--done)); }
.lsd-check { opacity: var(--done); transform: scale(calc(0.6 + 0.4 * var(--done))); }
.lsd-pay { opacity: var(--pay); }
.lsd-port-in { opacity: max(var(--lit), var(--done)); }
.lsd-port-out { opacity: var(--done); }
`;

/** The small uppercase gold captions over each half. */
const eyebrow =
  "text-[11px] font-semibold uppercase leading-snug tracking-[0.16em] text-brass-300 sm:text-xs";

/* ------------------------------------------------------------ section -- */

export function LeeSystemsLiveDemoSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  useLiveDemo(rootRef);

  return (
    <section className="relative isolate overflow-x-clip pt-10 pb-20 md:pt-14 md:pb-28">
      <style href="lee-systems-live-demo" precedence="default">
        {styles}
      </style>

      <div className="section-container">
        <div
          ref={rootRef}
          role="img"
          aria-label={DESCRIPTION}
          className="relative mx-auto max-w-[920px] select-none [text-rendering:geometricPrecision]"
        >
          <Glows />

          <div id={leeSystemsAnchors.websites} aria-hidden="true" className="scroll-mt-8">
            <p className={eyebrow}>01 Your website catches the lead</p>
            <Browser />
          </div>

          {/* The connectors sit over the browser (the line leaves from its
              form) and under the workflow's cards (which cover the wires'
              ends with their ports), so they come between the two. */}
          <Connectors />

          <div id={leeSystemsAnchors.automation} aria-hidden="true" className="relative scroll-mt-8">
            {/* The gap the line crosses, with the second caption beside it,
                kept clear of the chip passing down the middle (half its
                width and a margin), so on a phone it wraps instead. */}
            <div className="relative h-[76px]">
              <p className={clsx(eyebrow, "absolute bottom-2.5 left-0 max-w-[calc(50%-3.75rem)] text-balance")}>
                02 Your system handles it
              </p>
            </div>
            <Workflow />
          </div>

          <Travellers />
        </div>

        {site.callAnswering.demoPhone && (
          <p className="mt-8 text-center text-sm font-semibold text-neutral-200">
            Call{" "}
            <a
              href={telHref(site.callAnswering.demoPhone)}
              className="text-brass-300 underline underline-offset-4"
            >
              {site.callAnswering.demoPhone}
            </a>{" "}
            to hear our AI assistant answer.
          </p>
        )}
      </div>
    </section>
  );
}

/** A soft gold light behind each half, and a faint canvas grid behind the workflow. */
function Glows() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <span className="absolute left-1/2 top-[2%] h-[58%] w-[120%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(var(--gold)/0.13),rgb(var(--gold)/0.04)_55%,transparent)] light:opacity-60" />
      <span className="absolute bottom-[-4%] left-1/2 h-[46%] w-[120%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(var(--gold)/0.1),rgb(var(--gold)/0.03)_55%,transparent)] light:opacity-60" />
      <span className="absolute inset-x-0 bottom-0 h-[40%] bg-[radial-gradient(rgb(var(--ink)/0.07)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(closest-side,#000_35%,transparent)]" />
    </div>
  );
}

/* ------------------------------------------------------------ website -- */

/**
 * The browser window: traffic lights, a tab and the address bar in one row,
 * with the load bar along its bottom edge, over the page. The window is the
 * container its page reflows against.
 */
function Browser() {
  return (
    <div className="@container relative mt-3 overflow-hidden rounded-lg border border-white/10 bg-neutral-900/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] light:shadow-[0_30px_70px_-34px_rgb(var(--ink)/0.28)]">
      <div className="relative flex items-center gap-2.5 border-b border-white/10 bg-neutral-950/70 px-3 py-2">
        <span className="flex shrink-0 gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]/70" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]/70" />
        </span>
        <span className="flex min-w-0 max-w-[40%] items-center gap-1.5 rounded-md border border-white/10 bg-neutral-900 px-2 py-1 @min-[560px]:max-w-[26%]">
          <span className="h-2 w-2 shrink-0 rotate-45 rounded-[2px] bg-brass-400" />
          <span className="truncate text-[11px] leading-none text-neutral-300">Your Business</span>
          <X className="ml-auto hidden h-3 w-3 shrink-0 text-neutral-500 @min-[400px]:block" />
        </span>
        <span className="hidden shrink-0 items-center gap-2 text-neutral-500 @min-[560px]:flex">
          <ChevronLeft className="h-3.5 w-3.5" />
          <ChevronRight className="h-3.5 w-3.5 text-neutral-700" />
          <RotateCw className="h-3 w-3" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-white/10 bg-neutral-950 px-2.5 py-1 text-[11px] leading-none text-neutral-400">
          <Lock className="h-3 w-3 shrink-0 text-neutral-500" />
          <span className="truncate">yourbusiness.com</span>
        </span>
        <span
          data-lsd="load"
          className="absolute inset-x-0 -bottom-px h-px origin-left bg-brass-400 opacity-0"
        />
      </div>

      <div className="space-y-2 px-3.5 pb-3.5 pt-3 @min-[560px]:px-5 @min-[560px]:pb-4">
        <SiteNav />
        {siteSteps.map(({ label, Block }, i) => (
          <div key={label} data-lsd="step" className="lsd-in">
            <p className="mb-1.5 flex items-center gap-2 text-[11px] font-medium leading-none text-brass-200/85">
              <StepMarker n={i + 1} />
              {label}
            </p>
            <Block />
          </div>
        ))}
      </div>
    </div>
  );
}

function SiteNav() {
  return (
    <div data-lsd="nav" className="lsd-in flex items-center justify-between gap-3">
      <span className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-brass-400" />
        <span className="text-[12px] font-semibold leading-none text-white">Your Business</span>
      </span>
      <span className="hidden items-center gap-4 text-[11px] leading-none text-neutral-400 @min-[560px]:flex">
        <span>Services</span>
        <span>About</span>
        <span>Reviews</span>
        <span className="rounded-md bg-brass-400 px-2.5 py-1.5 font-semibold text-neutral-950">Book a call</span>
      </span>
      <Menu className="h-4 w-4 text-neutral-300 @min-[560px]:hidden" />
    </div>
  );
}

/** A section's number: outlined, and lit while that section is the one in play. */
function StepMarker({ n }: { n: number }) {
  return (
    <span className="relative grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border border-brass-400/50 bg-neutral-950 text-[11px] font-semibold tabular-nums text-brass-400">
      {n}
      <span
        data-lsd="marker"
        className="lsd-lit absolute -inset-px grid place-items-center rounded-full bg-brass-400 text-neutral-950 shadow-[0_0_10px_rgb(var(--gold)/0.5)]"
      >
        {n}
      </span>
    </span>
  );
}

function HeroBlock() {
  return (
    <div className="relative overflow-hidden rounded-md border border-white/[0.06] bg-gradient-to-br from-brass-400/[0.09] via-transparent to-transparent p-3 @min-[560px]:flex @min-[560px]:py-2.5 @min-[560px]:items-center @min-[560px]:justify-between @min-[560px]:gap-4 @min-[560px]:px-4">
      <div className="min-w-0">
        <p className="text-balance text-[18px] font-bold leading-[1.15] tracking-tight text-white @min-[560px]:text-[22px]">
          What you do, and where you do it.
        </p>
        <p className="mt-1 text-[12px] leading-snug text-neutral-400 @min-[560px]:text-[13px]">
          One line on why they should pick you.
        </p>
      </div>
      <span className="mt-2.5 inline-flex h-7 shrink-0 items-center rounded-md bg-brass-400 px-3 text-[11px] font-semibold text-neutral-950 @min-[560px]:mt-0 @min-[560px]:h-8 @min-[560px]:text-[12px]">
        Book a call
      </span>
    </div>
  );
}

function ProofRow() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {proof.map(({ Icon, title, body }) => (
        <div
          key={title}
          className="flex min-w-0 flex-col items-start gap-1.5 rounded-md border border-white/[0.06] bg-neutral-950/50 p-2 @min-[560px]:flex-row @min-[560px]:items-center @min-[560px]:gap-2 @min-[560px]:px-2.5"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded border border-brass-400/25 bg-brass-400/10 text-brass-300">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-semibold leading-tight text-neutral-100 @min-[560px]:text-[12px]">
              {title}
            </span>
            <span className="hidden truncate text-[11px] leading-tight text-neutral-500 @min-[560px]:block">
              {body}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

/** The point of the page. Its button is centred, where the line leaves from. */
function FormBlock() {
  return (
    <div className="rounded-md border border-brass-400/20 bg-brass-400/[0.04] p-3 @min-[560px]:px-4">
      <p className="mb-2 text-[12px] font-semibold leading-tight text-neutral-100 @min-[560px]:text-[13px]">
        Tell us what you need
      </p>
      <div className="grid grid-cols-2 gap-2 @min-[560px]:grid-cols-[1fr_1.15fr_1.6fr]">
        {fields.map((field, i) => (
          <Field key={field.placeholder} index={i} {...field} />
        ))}
      </div>
      <div className="mt-2.5 flex justify-center">
        <SendButton />
      </div>
    </div>
  );
}

/**
 * One field. The value is laid out from the start, one span per character,
 * and each character only shows once it is typed, so typing never moves
 * anything. The ghost is a copy of the value that lifts off it when the form
 * is sent and gathers on the button's port.
 */
function Field({
  index,
  placeholder,
  value,
  wide,
}: {
  index: number;
  placeholder: string;
  value: string;
  wide?: boolean;
}) {
  const text = "text-[11px] @min-[560px]:text-[12px]";

  return (
    <span
      data-lsd="field"
      className={clsx(
        "relative block h-8 rounded-md border border-white/10 bg-neutral-900",
        wide && "col-span-2 @min-[560px]:col-span-1"
      )}
    >
      <span className="lsd-focus pointer-events-none absolute -inset-px rounded-md border border-brass-400/75 shadow-[0_0_0_2px_rgb(var(--gold)/0.18)]" />
      <span
        data-lsd="placeholder"
        className={clsx("lsd-placeholder absolute inset-y-0 left-2.5 flex items-center text-neutral-500", text)}
      >
        {placeholder}
      </span>
      <span data-lsd="value" className="absolute inset-y-0 left-2.5 flex items-center">
        <span className={clsx("relative whitespace-pre text-neutral-100", text)}>
          {[...value].map((char, j) => (
            <span key={j} data-lsd={`char-${index}`}>
              {char}
            </span>
          ))}
          <span
            data-lsd="caret"
            className="absolute left-0 top-1/2 h-3.5 w-px -translate-y-1/2 bg-brass-300 opacity-0"
          />
        </span>
      </span>
      <span
        data-lsd="ghost"
        className={clsx(
          "absolute inset-y-0 left-2.5 flex items-center whitespace-pre font-semibold text-brass-200 opacity-0 will-change-transform",
          text
        )}
      >
        {value}
      </span>
    </span>
  );
}

function SendButton() {
  return (
    <span data-lsd="send" className="relative inline-flex">
      <span className="lsd-press relative flex h-8 min-w-[136px] items-center justify-center rounded-md bg-brass-400 px-4 text-[12px] font-semibold text-neutral-950">
        <span className="lsd-send">Send request</span>
        <span className="lsd-sent absolute inset-0 flex items-center justify-center gap-1">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
          Sent
        </span>
      </span>
      <Cursor />
    </span>
  );
}

/** A pointer, placed on the button it clicks; `render` glides it in from the fields. */
function Cursor() {
  return (
    <span
      data-lsd="cursor"
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-3.5 origin-top-left opacity-0 drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] will-change-transform"
    >
      <svg viewBox="0 0 16 22" className="block h-auto w-full">
        <path
          d="M1.2 1.2 L1.2 17 L5.3 13.3 L8.1 20 L10.9 18.8 L8.2 12.3 L13.9 12.3 Z"
          fill="#fafafa"
          stroke="#0a0a0a"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/* ----------------------------------------------------------- workflow -- */

/**
 * The workflow's cards, top to bottom: the trigger, the two first steps side
 * by side, the CRM, and the three outcomes, in a row from 640px and as a list
 * below that. The wires are drawn by Connectors from where these end up.
 */
function Workflow() {
  const card = "w-full max-w-[230px]";

  return (
    <div className="@container relative flex flex-col gap-[30px]">
      <div className="flex justify-center">
        <TriggerCard />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(["reply", "intake"] as const).map((id) => (
          <div key={id} className="flex justify-center">
            <NodeCard id={id} className={card} />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <NodeCard id="crm" className={card} />
      </div>
      <div className="grid grid-cols-1 gap-2 pl-10 @min-[640px]:grid-cols-3 @min-[640px]:gap-3 @min-[640px]:pl-0">
        {(["followup", "booked", "report"] as const).map((id) => (
          <div key={id} className="flex @min-[640px]:justify-center">
            <NodeCard id={id} listed className="w-full max-w-[300px] @min-[640px]:max-w-[230px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The layers every card shares: lit while it runs, gold once done, and its
 * ports. A card in the list (`listed`) takes its wire in from the side below
 * 640px, so its top port gives way to one on the left there.
 */
function CardFrame({ id, listed }: { id: NodeId; listed?: boolean }) {
  const hasIn = edges.some((e) => e.to === id) || id === "lead";
  const hasOut = edges.some((e) => e.from === id);

  return (
    <>
      <span className="lsd-doneborder pointer-events-none absolute -inset-px rounded-lg border border-brass-400/55" />
      <span className="lsd-ring pointer-events-none absolute -inset-px rounded-lg border border-brass-300/90 shadow-[0_0_18px_-4px_rgb(var(--gold)/0.65)]" />
      {id === "booked" && (
        <span className="lsd-pay pointer-events-none absolute -inset-px rounded-lg border border-brass-200/90 bg-brass-400/[0.1] shadow-[0_0_0_3px_rgb(var(--gold)/0.14),0_0_40px_-2px_rgb(var(--gold)/0.55)]" />
      )}
      {hasIn && <Port side="top" className={listed ? "@max-[640px]:hidden" : undefined} />}
      {hasOut && <Port side="bottom" />}
      {listed && <Port side="left" className="hidden @max-[640px]:block" />}
    </>
  );
}

function NodeIcon({ Icon, className }: { Icon: LucideIcon; className?: string }) {
  return (
    <span
      className={clsx(
        "relative grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-neutral-300",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="lsd-tile absolute -inset-px grid place-items-center rounded-md border border-brass-400/30 bg-[var(--svc-tile)] text-brass-300 light:bg-[#e8eefb]">
        <Icon className="h-3.5 w-3.5" />
      </span>
    </span>
  );
}

/** Waiting (a grey dot), then done (a gold tick). */
function Status() {
  return (
    <span className="relative grid h-4 w-4 shrink-0 place-items-center">
      <span className="lsd-waiting absolute h-1.5 w-1.5 rounded-full bg-neutral-500" />
      <span className="lsd-check absolute inset-0 grid place-items-center rounded-full bg-brass-400 text-neutral-950">
        <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
      </span>
    </span>
  );
}

/**
 * "New lead", where the chip lands. Its middle is a slot the chip's size,
 * dashed while it waits, holding the lead once it is in; the slot is centred
 * on the card, so the line and the chip come straight down into it.
 */
function TriggerCard() {
  const node = nodeById.lead;

  return (
    <div
      data-lsd="node-lead"
      className="lsd-node relative grid w-full max-w-[320px] grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-lg border border-white/10 bg-neutral-900 px-2.5 py-2"
    >
      <CardFrame id="lead" />
      <span className="flex min-w-0 items-center gap-2">
        <NodeIcon Icon={node.Icon} className="hidden @min-[400px]:grid" />
        <span className="text-[12px] font-semibold leading-tight text-neutral-100">{node.label}</span>
      </span>
      <span data-lsd="slot" className="grid place-items-center">
        <span className="lsd-idle col-start-1 row-start-1 whitespace-nowrap rounded-full border border-dashed border-white/15 px-2 py-0.5 text-[11px] leading-tight text-neutral-500">
          {node.idle}
        </span>
        <span className="lsd-done col-start-1 row-start-1">
          <LeadChip />
        </span>
      </span>
      <span className="justify-self-end">
        <Status />
      </span>
    </div>
  );
}

/**
 * Any other step. In the list the three outcomes make below 640px, the wire
 * comes in from the side (`listed`), so it has a port there instead.
 */
function NodeCard({
  id,
  listed,
  className,
}: {
  id: NodeId;
  listed?: boolean;
  className?: string;
}) {
  const node = nodeById[id];

  return (
    <div
      data-lsd={`node-${id}`}
      className={clsx(
        "lsd-node relative flex items-center gap-2 rounded-lg border border-white/10 bg-neutral-900 px-2.5 py-2",
        id === "booked" && "lsd-node-booked",
        className
      )}
    >
      <CardFrame id={id} listed={listed} />
      <NodeIcon Icon={node.Icon} />
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-semibold leading-tight text-neutral-100">{node.label}</span>
        <span className="mt-0.5 grid text-[11px] leading-tight">
          <span className="lsd-idle col-start-1 row-start-1 text-neutral-500">{node.idle}</span>
          <span
            className={clsx(
              "lsd-done col-start-1 row-start-1",
              id === "booked" ? "font-semibold text-brass-200" : "text-brass-200/90"
            )}
          >
            {node.done}
          </span>
        </span>
      </span>
      <Status />
    </div>
  );
}

/**
 * Where a wire meets a card: top for the wire in, bottom for the wire out,
 * or the left side for a card in the list. Lit once the lead has reached it.
 * The wires are measured from the card's own box, so these only have to
 * look right.
 */
function Port({ side, className }: { side: "top" | "bottom" | "left"; className?: string }) {
  return (
    <span
      data-port={side}
      className={clsx(
        "absolute z-10 h-[7px] w-[7px] rounded-full border border-white/25 bg-neutral-950",
        side === "top" && "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
        side === "bottom" && "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
        side === "left" && "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
        className
      )}
    >
      <span
        className={clsx(
          "absolute -inset-px rounded-full bg-brass-400 shadow-[0_0_6px_rgb(var(--gold)/0.9)]",
          side === "bottom" ? "lsd-port-out" : "lsd-port-in"
        )}
      />
    </span>
  );
}

/** The lead, as a chip: the same one travels down the line and sits in "New lead". */
function LeadChip() {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-brass-400/60 bg-[var(--svc-surface)] px-2 py-0.5 text-[11px] font-semibold leading-tight text-brass-200 shadow-[0_0_14px_-2px_rgb(var(--gold)/0.5)] light:bg-[#e8eefb]">
      <span className="h-1.5 w-1.5 rounded-full bg-brass-300 shadow-[0_0_6px_rgb(var(--gold)/0.6)] light:shadow-[0_0_6px_rgb(29_78_216/0.6)]" />
      {LEAD}
    </span>
  );
}

/* --------------------------------------------------------- connectors -- */

/**
 * The lines, in the composition's own pixels (no viewBox): the bridge from
 * the form's button down to "New lead", and a wire per edge of the workflow.
 * Each is a quiet base line and a gold fill that draws along it with
 * stroke-dashoffset as the lead passes. The packets riding the wires sit
 * with them, under the cards.
 */
function Connectors() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <svg className="absolute inset-0 h-full w-full overflow-visible" fill="none">
        <path data-lsd="bridge-base" className="stroke-[rgb(var(--gold)/0.3)]" strokeWidth="1.5" opacity="0" />
        <path data-lsd="bridge-fill" className="stroke-brass-400" strokeWidth="2" strokeLinecap="round" opacity="0" />
        {edges.map((_, i) => (
          <g key={i}>
            <path data-lsd="edge-base" className="stroke-[rgb(var(--ink)/0.14)] light:stroke-[rgb(var(--ink)/0.22)]" strokeWidth="1.5" />
            <path data-lsd="edge-fill" className="stroke-brass-400" strokeWidth="1.5" opacity="0" />
          </g>
        ))}
      </svg>
      {edges.map((_, i) => (
        <span
          key={i}
          data-lsd="packet"
          className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-brass-300 opacity-0 shadow-[0_0_6px_1px_rgb(var(--gold)/0.9)] will-change-transform"
        />
      ))}
    </div>
  );
}

/**
 * What moves over everything: the button's port the bridge leaves from, the
 * chip's light trail, and the chip itself, which ends inside "New lead".
 */
function Travellers() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <span
        data-lsd="send-port"
        className="absolute left-0 top-0 h-[7px] w-[7px] rounded-full border border-white/25 bg-neutral-950 opacity-0"
      >
        <span data-lsd="send-port-lit" className="absolute -inset-px rounded-full bg-brass-400 shadow-[0_0_6px_rgb(var(--gold)/0.9)]" />
      </span>
      <span
        data-lsd="trail"
        className="absolute left-0 top-0 h-16 w-[3px] origin-bottom rounded-full bg-gradient-to-b from-transparent via-brass-300/60 to-[#ffffff] opacity-0 shadow-[0_0_10px_1px_rgb(var(--gold)/0.35)] light:to-[#2f56c9] light:shadow-[0_0_10px_1px_rgb(29_78_216/0.4)] will-change-transform"
      />
      <span data-lsd="chip" className="absolute left-0 top-0 opacity-0 will-change-transform">
        <LeadChip />
      </span>
    </div>
  );
}

/* ------------------------------------------------------------- engine -- */

type Point = { x: number; y: number };

/**
 * An element's layout box in `root`'s pixels, from offsets rather than
 * getBoundingClientRect, so a transform on the way (a section still sliding
 * in) never moves where a line is drawn.
 */
function boxIn(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    const parent = node.offsetParent as HTMLElement | null;
    if (parent && parent !== root) {
      x += parent.clientLeft;
      y += parent.clientTop;
    }
    node = parent;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/** Down from one point to another, leaving and arriving vertically. */
function sCurve(a: Point, b: Point) {
  const bend = (b.y - a.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + bend}, ${b.x} ${b.y - bend}, ${b.x} ${b.y}`;
}

/**
 * Down to a card in the list and in from its left: across to a trunk just
 * left of the list, down it, and round into the card's side.
 */
function trunkCurve(a: Point, b: Point) {
  const x = b.x - 16;
  const drop = Math.min(28, (b.y - a.y) / 2);
  const r = 10;
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + drop / 2}, ${x} ${a.y + drop / 2}, ${x} ${a.y + drop} L ${x} ${b.y - r} Q ${x} ${b.y}, ${x + r} ${b.y} L ${b.x} ${b.y}`;
}

const num = (n: number) => n.toFixed(3);
const px = (n: number) => `${n.toFixed(2)}px`;

/**
 * Runs the demo: finds its pieces, measures the lines, draws any moment
 * with `render(t)`, and advances the clock only while it should be playing.
 */
function useLiveDemo(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const all = <T extends Element = HTMLElement>(key: string) =>
      Array.from(root.querySelectorAll<T>(`[data-lsd="${key}"]`));
    const one = <T extends Element = HTMLElement>(key: string) => all<T>(key)[0];

    const el = {
      load: one("load"),
      nav: one("nav"),
      steps: all("step"),
      markers: all("marker"),
      fields: all("field"),
      placeholders: all("placeholder"),
      values: all("value"),
      carets: all("caret"),
      ghosts: all("ghost"),
      chars: fields.map((_, i) => all(`char-${i}`)),
      send: one("send"),
      cursor: one("cursor"),
      sendPort: one("send-port"),
      sendPortLit: one("send-port-lit"),
      trail: one("trail"),
      chip: one("chip"),
      slot: one("slot"),
      bridgeBase: one<SVGPathElement>("bridge-base"),
      bridgeFill: one<SVGPathElement>("bridge-fill"),
      edgeBase: all<SVGPathElement>("edge-base"),
      edgeFill: all<SVGPathElement>("edge-fill"),
      packets: all("packet"),
      node: Object.fromEntries(nodes.map(({ id }) => [id, one(`node-${id}`)])) as Record<
        NodeId,
        HTMLElement
      >,
    };

    /** The last value written to each element's property, so nothing is written twice. */
    const written = new Map<Element, Record<string, string>>();
    const set = (target: HTMLElement | SVGElement, prop: string, value: string) => {
      let props = written.get(target);
      if (!props) written.set(target, (props = {}));
      if (props[prop] === value) return;
      props[prop] = value;
      target.style.setProperty(prop, value);
    };

    /** Where things are, from the last measurement. */
    const geo = {
      start: { x: 0, y: 0 },
      port: { x: 0, y: 0 },
      slot: { x: 0, y: 0 },
      bridge: 0,
      edges: edges.map(() => 0),
      ghosts: fields.map(() => ({ x: 0, y: 0 })),
      carets: fields.map(() => [0]),
    };

    const measure = () => {
      const box = (target: HTMLElement) => boxIn(target, root);
      const card = (id: NodeId) => box(el.node[id]);
      // A card in the list takes its wire in from the side, and shows the
      // port there; otherwise from the top.
      const into = (id: NodeId): { at: Point; side: boolean } => {
        const b = card(id);
        const side = el.node[id].querySelector<HTMLElement>('[data-port="left"]');
        if (side && side.offsetWidth > 0) return { at: { x: b.x, y: b.y + b.h / 2 }, side: true };
        return { at: { x: b.x + b.w / 2, y: b.y }, side: false };
      };
      const out = (id: NodeId): Point => {
        const b = card(id);
        return { x: b.x + b.w / 2, y: b.y + b.h };
      };

      const send = box(el.send);
      geo.start = { x: send.x + send.w / 2, y: send.y + send.h };
      geo.port = into("lead").at;
      const slot = box(el.slot);
      geo.slot = { x: slot.x + slot.w / 2, y: slot.y + slot.h / 2 };

      const bridge = sCurve(geo.start, geo.port);
      for (const path of [el.bridgeBase, el.bridgeFill]) path.setAttribute("d", bridge);
      geo.bridge = el.bridgeFill.getTotalLength();
      set(el.bridgeFill, "stroke-dasharray", `${geo.bridge} ${geo.bridge}`);

      edges.forEach(({ from, to }, i) => {
        const target = into(to);
        const d = target.side ? trunkCurve(out(from), target.at) : sCurve(out(from), target.at);
        el.edgeBase[i].setAttribute("d", d);
        el.edgeFill[i].setAttribute("d", d);
        geo.edges[i] = el.edgeFill[i].getTotalLength();
        set(el.edgeFill[i], "stroke-dasharray", `${geo.edges[i]} ${geo.edges[i]}`);
      });

      el.ghosts.forEach((ghost, i) => {
        const b = box(ghost);
        geo.ghosts[i] = { x: geo.start.x - (b.x + b.w / 2), y: geo.start.y - (b.y + b.h / 2) };
      });
      geo.carets = el.chars.map((chars) => [0, ...chars.map((c) => c.offsetLeft + c.offsetWidth)]);
    };

    /** Where the chip is, `d` pixels along its way: down the bridge, then into the slot. */
    const chipAt = (d: number): Point => {
      if (d <= geo.bridge) {
        const p = el.bridgeFill.getPointAtLength(Math.max(0, d));
        return { x: p.x, y: p.y };
      }
      const rest = Math.hypot(geo.slot.x - geo.port.x, geo.slot.y - geo.port.y) || 1;
      const k = clamp01((d - geo.bridge) / rest);
      return {
        x: geo.port.x + (geo.slot.x - geo.port.x) * k,
        y: geo.port.y + (geo.slot.y - geo.port.y) * k,
      };
    };

    /** Draws the demo as it is `t` seconds into the loop. */
    const render = (t: number) => {
      // Everything lit fades back to idle together at the end of the loop.
      const k = 1 - easeInOut(ramp(t, RESET, RESET + RESET_SECONDS));

      // The page loads, and its sections come in, each lighting its marker
      // while it is the one in play. The form's stays lit until it is sent.
      set(el.load, "transform", `scaleX(${num(easeOut(ramp(t, LOAD_FROM, LOAD_TO)))})`);
      set(el.load, "opacity", num(t < LOAD_FROM ? 0 : 1 - ramp(t, LOAD_TO, LOAD_TO + 0.4)));
      set(el.nav, "--in", num(easeOut(ramp(t, NAV_IN, NAV_IN + REVEAL)) * k));
      const stepIn = STEP_IN.map((at) => easeOut(ramp(t, at, at + REVEAL)) * k);
      el.steps.forEach((step, i) => set(step, "--in", num(stepIn[i])));
      const markerOff = [STEP_IN[1], STEP_IN[2], SENT];
      el.markers.forEach((m, i) => set(m, "--lit", num(pulse(t, STEP_IN[i], markerOff[i], 0.3, 0.5))));

      // Typing, a character at a time, with a caret after the last one.
      const focusOff = [focusAt[1], focusAt[2], CLICK];
      fields.forEach((_, i) => {
        const typed = charAt[i].filter((at) => t >= at).length;
        el.chars[i].forEach((c, j) => set(c, "opacity", j < typed ? "1" : "0"));
        set(el.placeholders[i], "opacity", typed ? "0" : "1");
        set(el.fields[i], "--focus", num(pulse(t, focusAt[i], focusOff[i], 0.18, 0.18)));
        set(el.carets[i], "opacity", t >= focusAt[i] && t < focusOff[i] ? "1" : "0");
        set(el.carets[i], "transform", `translateX(${px(geo.carets[i][typed] ?? 0)})`);

        // Sent: the value dims, and a copy of it gathers on the button's port.
        set(el.values[i], "opacity", num(1 - 0.45 * easeInOut(ramp(t, GATHER, GATHER + 0.45))));
        const from = GATHER + i * GHOST_STAGGER;
        const g = easeInOut(ramp(t, from, from + GHOST_SECONDS));
        const v = geo.ghosts[i];
        set(el.ghosts[i], "opacity", g > 0 && g < 1 ? num(1 - g * g) : "0");
        set(el.ghosts[i], "transform", `translate(${px(v.x * g)}, ${px(v.y * g)}) scale(${num(1 - 0.6 * g)})`);
      });

      // The pointer glides to the button and clicks; the button reads "Sent".
      const glide = easeInOut(ramp(t, CURSOR_IN, CLICK - 0.08));
      const leave = easeInOut(ramp(t, SENT + 0.45, SENT + 0.85));
      const press = pulse(t, CLICK - 0.05, CLICK + 0.05, 0.05, 0.14);
      set(el.cursor, "opacity", num(ramp(t, CURSOR_IN, CURSOR_IN + 0.25) * (1 - leave)));
      set(
        el.cursor,
        "transform",
        `translate(${px(CURSOR_FROM.x * (1 - glide) + 10 * leave)}, ${px(CURSOR_FROM.y * (1 - glide) + 14 * leave)}) scale(${num(1 - 0.15 * press)})`
      );
      set(el.send, "--press", num(press));
      const sent = easeOut(ramp(t, SENT, SENT + 0.3));
      set(el.send, "--sent", num(sent));

      // The button's port, where the bridge leaves from: there once the form
      // is, and lit once it is sent.
      set(el.sendPort, "opacity", num(stepIn[2]));
      set(el.sendPort, "transform", `translate(${px(geo.start.x)}, ${px(geo.start.y)}) translate(-50%, -50%)`);
      set(el.sendPortLit, "opacity", num(sent * k));

      // The chip forms on the port, rides the bridge down and settles into
      // "New lead", the gold drawing along the line behind it.
      const travelled = easeInOut(ramp(t, DEPART, LAND));
      const bridgeTotal = geo.bridge + Math.hypot(geo.slot.x - geo.port.x, geo.slot.y - geo.port.y);
      const d = CHIP_FORMS_AT + travelled * (bridgeTotal - CHIP_FORMS_AT);
      const at = chipAt(d);
      const formed = easeOut(ramp(t, CHIP_IN, CHIP_IN + 0.4));
      const absorbed = ramp(t, LAND + 0.12, LAND + 0.36);
      set(el.chip, "opacity", num(formed * (1 - absorbed)));
      set(el.chip, "transform", `translate(${px(at.x)}, ${px(at.y)}) translate(-50%, -50%) scale(${num(0.7 + 0.3 * formed)})`);
      const moving = t > DEPART && t < LAND ? Math.sin(Math.PI * ramp(t, DEPART, LAND)) : 0;
      set(el.trail, "opacity", num(moving));
      set(el.trail, "transform", `translate(${px(at.x)}, ${px(at.y)}) translate(-50%, -100%) scaleY(${num(0.3 + 0.7 * moving)})`);
      set(el.bridgeBase, "opacity", num(stepIn[2]));
      set(el.bridgeFill, "stroke-dashoffset", px(geo.bridge - (travelled > 0 ? Math.min(d, geo.bridge) : 0)));
      set(el.bridgeFill, "opacity", num(travelled > 0 ? k : 0));

      // The workflow: each step lights as the lead reaches it, then ticks.
      // "New lead" takes the chip first: its slot fills just before the
      // chip over it fades, so the handoff never dips.
      for (const { id } of nodes) {
        const a = arriveAt[id];
        const done = id === "lead" ? easeOut(ramp(t, LAND - 0.02, LAND + 0.18)) : easeOut(ramp(t, a + 0.12, a + 0.5));
        set(el.node[id], "--lit", num(pulse(t, a, a + RUN_SECONDS, 0.18, 0.6)));
        set(el.node[id], "--done", num(done * k));
      }
      set(el.node.booked, "--pay", num(easeInOut(ramp(t, PAYOFF, PAYOFF + PAYOFF_SECONDS)) * k));

      edges.forEach((_, i) => {
        const len = geo.edges[i];
        const from = edgeAt[i];
        const p = easeInOut(ramp(t, from, from + EDGE_SECONDS));
        set(el.edgeFill[i], "stroke-dashoffset", px(len * (1 - p)));
        set(el.edgeFill[i], "opacity", num(p > 0 ? k : 0));
        const onWire = t > from && t < from + EDGE_SECONDS && len > 0;
        set(el.packets[i], "opacity", onWire ? num(Math.min(1, 3 * Math.sin(Math.PI * ramp(t, from, from + EDGE_SECONDS)))) : "0");
        if (onWire) {
          const q = el.edgeFill[i].getPointAtLength(len * p);
          set(el.packets[i], "transform", `translate(${px(q.x)}, ${px(q.y)}) translate(-50%, -50%)`);
        }
      });
    };

    /* Playing. The clock only advances while the demo is on screen, the tab
       is showing and motion is allowed; otherwise it holds the frame it is
       on. */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let t = 0;
    let frame = 0;
    let last = 0;
    let onScreen = false;

    const playable = () =>
      onScreen && !document.hidden && !reduceMotion.matches;

    const tick = (now: number) => {
      // A long gap (a stalled frame) moves the clock at most a tenth of a
      // second, so the demo never skips a step.
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      t = (t + dt) % LOOP_SECONDS;
      render(t);
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      if (playable()) {
        if (!frame) {
          last = 0;
          frame = requestAnimationFrame(tick);
        }
        return;
      }
      cancelAnimationFrame(frame);
      frame = 0;
      render(reduceMotion.matches ? STILL : t);
    };

    const remeasure = () => {
      measure();
      render(reduceMotion.matches ? STILL : t);
    };

    remeasure();
    let resizeFrame = 0;
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(remeasure);
    });
    resize.observe(root);
    document.fonts?.ready.then(remeasure);

    // In view once its top has come a third of the way up the screen, so
    // the page is seen loading from the start, and out of view once it has
    // left the screen entirely.
    const view = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "0px 0px -35% 0px" }
    );
    view.observe(root);

    document.addEventListener("visibilitychange", sync);
    reduceMotion.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      resize.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduceMotion.removeEventListener("change", sync);
    };
  }, [rootRef]);
}
