"use client";

import clsx from "clsx";
import {
  Bell,
  Bot,
  Brain,
  Calendar,
  Check,
  CircleCheck,
  Clock,
  Database,
  DollarSign,
  Globe,
  Hourglass,
  MessageSquare,
  Pause,
  Phone,
  Play,
  Receipt,
  Repeat,
  Sparkles,
  Split,
  Star,
  Sun,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";
import { leeSystemsAnchors } from "@/data/lee-systems";

/**
 * "Watch one system run your week" on /how-it-works: a workflow editor in the
 * style of n8n, running four short stories end to end in about a minute, then
 * looping (the owner's pick on 2026-10-06, after five single-scene options
 * for the Business automation card and a preview of this combined one).
 *
 * The canvas holds one workflow in four groups, one per story. As a story
 * runs, a packet rides each wire, the step it reaches spins and then ticks,
 * "1 item" appears on the wire behind it, and the camera glides along with
 * the step that is running. The panel beside the canvas shows that step's
 * output, which is what the customer or the owner actually sees:
 *
 *   1  After-hours call: the AI agent answers at 11:47 PM (its chat model,
 *      memory and calendar plugged in underneath, as n8n draws them), books
 *      the job, saves the contact and texts a confirmation.
 *   2  New lead: the website form, a reply that stops the stopwatch at 0:41,
 *      then Wait and "Replied?" loop through a follow-up until she says yes.
 *   3  After the job: a review request, the invoice, and PAID when she pays.
 *   4  Morning report: everything above in one summary, then the camera
 *      pulls back to show the whole workflow lit.
 *
 * Timing. Each story is a list of timed events read off a clock that only
 * advances while the section is on screen, the tab is showing, motion is
 * allowed and the viewer hasn't paused it. Packets and the stopwatch are
 * tweens on that same clock, so pausing freezes everything at once. The
 * chapter buttons restart any story; the ones before it are drawn finished.
 * With prefers-reduced-motion it shows the finished workflow as a still,
 * and the chapter buttons show each story's finished state instead.
 *
 * What it shows is illustrative: Dana and Maria are example customers, the
 * phone number is in the 555-0100 range kept for fiction, and "0:41" is the
 * example's own reply time, not a figure about any client.
 *
 * Self-contained: its colours fall back to the platinum hexes if the theme's
 * variables are missing, it takes nothing from its neighbours, and moving it
 * is moving its one line in app/lee-systems/page.tsx.
 */

/* ------------------------------------------------------------ workflow -- */

type Kind = "trigger" | "action" | "if" | "agent" | "sub";
type Point = { x: number; y: number };
type FlowNode = {
  id: string;
  kind: Kind;
  x: number;
  y: number;
  Icon: LucideIcon;
  label: string;
  sub?: string;
};

/** Node sizes in canvas pixels, by kind. */
const SIZE: Record<Kind, { w: number; h: number }> = {
  trigger: { w: 76, h: 76 },
  action: { w: 76, h: 76 },
  if: { w: 76, h: 76 },
  agent: { w: 240, h: 76 },
  sub: { w: 58, h: 58 },
};

/** How far apart the AI agent's three plugged-in parts sit. */
const SUB_GAP = 110;

/** The whole canvas, in its own pixels; the camera scales it to fit. */
const WORLD = { w: 1180, h: 1140 };

/**
 * Every step, by story. The first letter of each id is its story (n, m, j,
 * r; the agent's parts are s), which the camera uses to pick the row.
 */
const flowNodes: FlowNode[] = [
  { id: "n1", kind: "trigger", x: 110, y: 140, Icon: Phone, label: "Incoming call", sub: "Your business line" },
  { id: "n2", kind: "agent", x: 390, y: 140, Icon: Bot, label: "AI Agent", sub: "Answers & books" },
  { id: "s1", kind: "sub", x: 280, y: 300, Icon: Sparkles, label: "Chat model" },
  { id: "s2", kind: "sub", x: 390, y: 300, Icon: Brain, label: "Memory" },
  { id: "s3", kind: "sub", x: 500, y: 300, Icon: Calendar, label: "Calendar" },
  { id: "n3", kind: "action", x: 650, y: 140, Icon: Calendar, label: "Book appointment", sub: "Calendar" },
  { id: "n4", kind: "action", x: 850, y: 140, Icon: Database, label: "Create contact", sub: "CRM" },
  { id: "n5", kind: "action", x: 1050, y: 140, Icon: MessageSquare, label: "Send confirmation", sub: "Text message" },

  { id: "m1", kind: "trigger", x: 110, y: 480, Icon: Globe, label: "Website form", sub: "New lead" },
  { id: "m2", kind: "action", x: 310, y: 480, Icon: Sparkles, label: "Write reply", sub: "AI" },
  { id: "m3", kind: "action", x: 510, y: 480, Icon: MessageSquare, label: "Send text", sub: "Under a minute" },
  { id: "m4", kind: "action", x: 710, y: 480, Icon: Hourglass, label: "Wait", sub: "2 days" },
  { id: "m5", kind: "if", x: 910, y: 480, Icon: Split, label: "Replied?", sub: "If" },
  { id: "m6", kind: "action", x: 510, y: 640, Icon: Repeat, label: "Send follow-up", sub: "Text or email" },
  { id: "m7", kind: "action", x: 1080, y: 440, Icon: Database, label: "Move to Booked", sub: "CRM" },

  { id: "j1", kind: "trigger", x: 110, y: 830, Icon: CircleCheck, label: "Job marked done", sub: "Your job app" },
  { id: "j2", kind: "action", x: 310, y: 830, Icon: Star, label: "Request review", sub: "Text message" },
  { id: "j3", kind: "action", x: 510, y: 830, Icon: Receipt, label: "Send invoice", sub: "Invoicing" },
  { id: "j4", kind: "action", x: 710, y: 830, Icon: Hourglass, label: "Wait for payment", sub: "Until paid" },
  { id: "j5", kind: "action", x: 910, y: 830, Icon: Database, label: "Mark paid", sub: "CRM" },

  { id: "r1", kind: "trigger", x: 110, y: 1040, Icon: Clock, label: "Every morning", sub: "7:00 AM" },
  { id: "r2", kind: "action", x: 310, y: 1040, Icon: Sparkles, label: "Summarize", sub: "AI" },
  { id: "r3", kind: "action", x: 510, y: 1040, Icon: Bell, label: "Send to you", sub: "Text + email" },
];

const node = Object.fromEntries(flowNodes.map((n) => [n.id, n])) as Record<string, FlowNode>;

/** The four stories' frames on the canvas, each named like an n8n sticky. */
const groups = [
  { label: "After-hours calls", x: 30, y: 36, w: 1120, h: 336 },
  { label: "New website leads", x: 30, y: 394, w: 1120, h: 326 },
  { label: "After the job", x: 30, y: 742, w: 1120, h: 176 },
  { label: "Morning report", x: 30, y: 940, w: 1120, h: 180 },
];

/** Where the camera centres vertically for each story's row. */
const ROW_Y: Record<string, number> = { n: 205, s: 205, m: 545, j: 845, r: 1040 };

const portIn = (n: FlowNode): Point =>
  n.kind === "sub" ? { x: n.x, y: n.y - SIZE.sub.h / 2 } : { x: n.x - SIZE[n.kind].w / 2, y: n.y };
const portOut = (n: FlowNode, branch?: "true" | "false"): Point =>
  n.kind === "if"
    ? { x: n.x + SIZE.if.w / 2, y: n.y + (branch === "false" ? 18 : -18) }
    : { x: n.x + SIZE[n.kind].w / 2, y: n.y };
/** The agent's three plug points along its bottom edge. */
const agentPort = (i: number): Point => ({ x: node.n2.x + (i - 1) * SUB_GAP, y: node.n2.y + SIZE.agent.h / 2 });

type Wire = { id: string; d: string; dash?: boolean; label?: string; labelAt?: Point };

/** A wire from one step's output to the next step's input, as n8n draws it. */
function link(from: string, to: string, branch?: "true" | "false"): Wire {
  const a = portOut(node[from], branch);
  const b = portIn(node[to]);
  const dx = Math.max(50, Math.abs(b.x - a.x) * 0.5);
  const c1 = { x: a.x + dx, y: a.y };
  const c2 = { x: b.x - dx, y: b.y };
  // The curve's midpoint, where "1 item" sits once a packet has passed.
  const mid = { x: (a.x + 3 * c1.x + 3 * c2.x + b.x) / 8, y: (a.y + 3 * c1.y + 3 * c2.y + b.y) / 8 };
  return {
    id: `${from}-${to}`,
    d: `M${a.x},${a.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}`,
    label: "1 item",
    labelAt: { x: mid.x, y: mid.y - 9 },
  };
}

/** A dashed line from the agent down to one of its parts. */
function plug(i: number, to: string): Wire {
  const a = agentPort(i);
  const b = portIn(node[to]);
  return { id: `n2-${to}`, d: `M${a.x},${a.y} C${a.x},${a.y + 50} ${b.x},${b.y - 50} ${b.x},${b.y}`, dash: true };
}

const wires: Wire[] = [
  link("n1", "n2"),
  plug(0, "s1"),
  plug(1, "s2"),
  plug(2, "s3"),
  link("n2", "n3"),
  link("n3", "n4"),
  link("n4", "n5"),
  link("m1", "m2"),
  link("m2", "m3"),
  link("m3", "m4"),
  link("m4", "m5"),
  link("m5", "m7", "true"),
  // "Replied?" said no: down and back along under the row into the follow-up.
  {
    id: "m5-m6",
    d: "M948,498 C995,498 995,578 945,578 L 440,578 C 410,578 420,640 472,640",
    label: "no reply",
    labelAt: { x: 700, y: 569 },
  },
  link("m6", "m4"),
  link("j1", "j2"),
  link("j2", "j3"),
  link("j3", "j4"),
  link("j4", "j5"),
  link("r1", "r2"),
  link("r2", "r3"),
];

/** Every port dot the canvas draws, keyed by the step it belongs to. */
const ports = flowNodes.flatMap((n) => {
  const list: { id: string; at: Point; diamond?: boolean }[] = [];
  if (n.kind !== "trigger") list.push({ id: n.id, at: portIn(n) });
  if (n.kind === "if") list.push({ id: n.id, at: portOut(n, "true") }, { id: n.id, at: portOut(n, "false") });
  else if (n.kind !== "sub") list.push({ id: n.id, at: portOut(n) });
  if (n.kind === "agent") [0, 1, 2].forEach((i) => list.push({ id: n.id, at: agentPort(i), diamond: true }));
  return list;
});

/* ---------------------------------------------------------------- copy -- */

const chapters = ["After-hours call", "New lead", "After the job", "Morning report"];

const callLines = [
  { who: "Caller", text: "Hi, my AC just quit. Can someone come out tomorrow?" },
  { who: "AI assistant", text: "I can help. I have 9:00 AM or 1:30 PM tomorrow. Which works better?" },
  { who: "Caller", text: "1:30 works. It's Dana, at 14 Oak Lane." },
  { who: "AI assistant", text: "You're booked for Wednesday at 1:30 PM, Dana. I'll text you the details." },
];

const crmFields = [
  ["Phone", "(301) 555-0142"],
  ["Came in by", "After-hours call"],
  ["Job", "AC repair · 14 Oak Lane"],
  ["Appointment", "Wed 1:30 PM"],
  ["Stage", "Booked"],
];

const report: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: Phone, title: "After-hours call answered", body: "Dana W. booked for Wed 1:30 PM" },
  { Icon: Zap, title: "New lead replied to in 0:41", body: "Maria R. · kitchen remodel" },
  { Icon: Repeat, title: "Follow-up got a yes", body: "Maria R. booked for Friday" },
  { Icon: Star, title: "Review requested", body: "Dana W. · AC repair" },
  { Icon: DollarSign, title: "Invoice #1042 paid", body: "Paid online by card" },
];

const DESCRIPTION =
  "An animated example of one automation workflow. A late-night call is answered by an AI assistant, booked and confirmed by text. A website lead gets a reply in 41 seconds and a follow-up until she says yes. A finished job gets a review request and an invoice that is paid online. Each morning the owner gets a summary of it all.";

/* ------------------------------------------------------------- styles -- */

/**
 * Hoisted into <head> once, keyed by `href`. Every class carries `lwf-` so
 * nothing else on the site can collide with it.
 */
const styles = `
.lwf-wrap { container: lwf / inline-size; --b200: var(--color-brass-200, #ffffff); --b300: var(--color-brass-300, #f5f5f4); --b400: var(--color-brass-400, #e7e5e4); --wash: rgb(var(--gold) / .09); --edge: rgb(var(--gold) / .28); --line: rgba(255,255,255,.1); --raised: var(--svc-tile); --muted: #a1a1aa; --text: #f4f4f5; --lwf-w: 255 255 255; --lwf-g: 231 229 228; --lwf-g2: 245 245 244; --stage: var(--svc-surface); --chrome: #121316; --canvas: #0e0f11; --node: var(--svc-surface); --port: #2a2c30; --toast: var(--svc-tile); --ink2: #d4d4d8; --on-b: #0e0f11; --vignette: rgba(8,8,10,.75); --clockbg: rgba(14,15,17,.85); --shadow: none; }
/* In the light theme it is the same editor in its daylight skin, the way n8n's
   own light mode looks: white chrome and nodes on a pale grey canvas, navy for
   what runs (the --b colours follow the theme's brass, which turns navy). */
:root[data-theme="light"] .lwf-wrap { --wash: rgba(30,64,175,.07); --edge: rgba(30,64,175,.32); --line: rgba(15,26,46,.1); --raised: #f6f7f9; --muted: #5b6578; --text: #0f1a2e; --lwf-w: 15 26 46; --lwf-g: 30 64 175; --lwf-g2: 29 78 216; --stage: #ffffff; --chrome: #ffffff; --canvas: #eef1f6; --node: #ffffff; --port: #ffffff; --toast: #ffffff; --ink2: #334155; --on-b: #f6f7f9; --vignette: rgba(15,26,46,.05); --clockbg: rgba(255,255,255,.92); --shadow: 0 20px 50px -24px rgb(15 26 46 / .18); }
.lwf-stage { position: relative; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,35%); grid-template-rows: auto minmax(0,1fr) auto; aspect-ratio: 16 / 9.4; min-height: 560px; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; background: var(--stage); box-shadow: var(--shadow); color: var(--text); font-size: 14px; line-height: 1.4; }
.lwf-paused * { animation-play-state: paused !important; }
.lwf-hide { display: none !important; }
.lwf-pop { animation: lwf-pop .45s cubic-bezier(.16,1,.3,1) both; }
@keyframes lwf-pop { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes lwf-spin { to { transform: rotate(360deg); } }
@keyframes lwf-blink { 0%,80%,100% { opacity: .25; } 40% { opacity: 1; } }
@keyframes lwf-ring { from { transform: scale(1); opacity: .75; } to { transform: scale(2); opacity: 0; } }
@keyframes lwf-buzz { 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
@keyframes lwf-tick { 40% { background: rgb(var(--lwf-g) / .25); } }
@keyframes lwf-fade { from { opacity: 0; } to { opacity: 1; } }
.lwf-num { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-variant-numeric: tabular-nums; }
.lwf-small { font-size: 12px; color: var(--muted); }
.lwf-pill { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; border: 1px solid var(--edge); background: var(--wash); color: var(--b200); border-radius: 999px; padding: 4px 11px; font-size: 12.5px; font-weight: 600; white-space: nowrap; }
.lwf-pill svg { width: 13px; height: 13px; }

.lwf-top { grid-column: 1 / -1; display: flex; align-items: center; gap: 14px; padding: 10px 16px; border-bottom: 1px solid var(--line); background: var(--chrome); font-size: 13px; min-width: 0; }
.lwf-logo { width: 26px; height: 26px; border-radius: 6px; background: var(--wash); border: 1px solid var(--edge); color: var(--b300); display: grid; place-items: center; flex: none; }
.lwf-logo svg { width: 15px; height: 15px; }
.lwf-wf { color: var(--text); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.lwf-wf span { color: var(--muted); font-weight: 400; }
.lwf-tabs { display: flex; gap: 2px; margin-left: auto; background: rgb(var(--lwf-w) / .04); border-radius: 7px; padding: 3px; flex: none; }
.lwf-tabs span { padding: 3px 10px; border-radius: 5px; color: var(--muted); }
.lwf-tabs span:first-child { background: rgb(var(--lwf-w) / .08); color: var(--text); }
.lwf-active { display: flex; align-items: center; gap: 8px; color: var(--muted); flex: none; }
.lwf-toggle { width: 30px; height: 17px; border-radius: 99px; background: var(--b400); position: relative; }
.lwf-toggle::after { content: ""; position: absolute; right: 2px; top: 2px; width: 13px; height: 13px; border-radius: 50%; background: var(--on-b); }

.lwf-canvas { position: relative; overflow: hidden; background-color: var(--canvas); background-image: radial-gradient(rgb(var(--lwf-w) / .07) 1px, transparent 1.2px); background-size: 22px 22px; }
.lwf-canvas::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(60% 70% at 50% 50%, transparent 55%, var(--vignette)); }
.lwf-world { position: absolute; left: 0; top: 0; width: ${WORLD.w}px; height: ${WORLD.h}px; transform-origin: 0 0; transition: transform 1.15s cubic-bezier(.65,0,.35,1); will-change: transform; }
.lwf-wires { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.lwf-group { position: absolute; border: 1px solid rgb(var(--lwf-g) / .13); background: rgb(var(--lwf-g) / .025); border-radius: 12px; }
.lwf-group b { position: absolute; left: 14px; top: 10px; font-size: 12px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: rgb(var(--lwf-g2) / .75); }
.lwf-wire { fill: none; stroke: rgb(var(--lwf-w) / .17); stroke-width: 2; transition: stroke .5s; }
.lwf-dash { stroke-dasharray: 5 5; }
.lwf-wire.lwf-hot { stroke: rgb(var(--lwf-g) / .75); }
.lwf-port { fill: var(--port); stroke: rgb(var(--lwf-w) / .25); stroke-width: 1.5; transition: fill .4s, stroke .4s; }
.lwf-port.lwf-ok { fill: var(--b400); stroke: var(--b400); }
.lwf-wlab { font: 600 11px ui-monospace, Menlo, monospace; fill: var(--b300); opacity: 0; transition: opacity .4s; }
.lwf-wlab.lwf-show { opacity: 1; }
.lwf-iflab { font: 500 10.5px ui-monospace, Menlo, monospace; fill: var(--muted); }
.lwf-packet { fill: var(--b200); opacity: 0; filter: drop-shadow(0 0 6px rgb(var(--lwf-g2) / .95)); }

.lwf-node { position: absolute; }
.lwf-nbox { position: relative; width: 100%; height: 100%; border-radius: 14px; background: var(--node); border: 1.5px solid rgb(var(--lwf-w) / .16); display: grid; place-items: center; color: var(--ink2); transition: border-color .35s, box-shadow .35s, color .35s; }
.lwf-nbox > svg { width: 30px; height: 30px; }
.lwf-trigger .lwf-nbox { border-radius: 38px 14px 14px 38px; }
.lwf-bolt { position: absolute; left: -9px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; border-radius: 50%; background: var(--canvas); color: var(--b300); display: grid; place-items: center; }
.lwf-bolt svg { width: 12px; height: 12px; }
.lwf-sub .lwf-nbox { border-radius: 50%; }
.lwf-sub .lwf-nbox > svg { width: 22px; height: 22px; }
.lwf-agent .lwf-nbox { display: flex; gap: 14px; justify-content: flex-start; padding: 0 18px; }
.lwf-agent .lwf-nbox > svg { color: var(--b300); flex: none; }
.lwf-agent .lwf-nbox b { display: block; color: var(--text); font-size: 15px; }
.lwf-agent .lwf-nbox span { display: block; color: var(--muted); font-size: 12px; }
.lwf-nlabel { position: absolute; left: 50%; top: calc(100% + 8px); width: 170px; transform: translateX(-50%); text-align: center; line-height: 1.25; }
.lwf-nlabel b { display: block; color: var(--text); font-size: 13.5px; font-weight: 600; }
.lwf-nlabel span { display: block; color: var(--muted); font-size: 11.5px; }
.lwf-okb { position: absolute; right: -7px; bottom: -7px; width: 20px; height: 20px; border-radius: 50%; background: var(--b400); color: var(--on-b); display: grid; place-items: center; opacity: 0; transform: scale(.4); transition: opacity .3s, transform .35s cubic-bezier(.34,1.56,.64,1); }
.lwf-okb svg { width: 12px; height: 12px; }
.lwf-node.lwf-run .lwf-nbox { border-color: var(--b300); color: var(--b200); box-shadow: 0 0 0 4px rgb(var(--lwf-g) / .12), 0 0 28px rgb(var(--lwf-g) / .28); }
.lwf-node.lwf-run .lwf-nbox::after { content: ""; position: absolute; right: -8px; top: -8px; width: 18px; height: 18px; border-radius: 50%; background: var(--canvas); border: 2.5px solid rgb(var(--lwf-g2) / .25); border-top-color: var(--b200); animation: lwf-spin .8s linear infinite; }
.lwf-node.lwf-ok .lwf-nbox { border-color: var(--b400); color: var(--b300); }
.lwf-node.lwf-ok .lwf-okb { opacity: 1; transform: none; }

.lwf-clock { position: absolute; left: 14px; top: 12px; z-index: 2; font-weight: 600; font-size: 12.5px; letter-spacing: .06em; color: var(--b200); background: var(--clockbg); border: 1px solid var(--edge); border-radius: 6px; padding: 5px 9px; display: flex; align-items: center; gap: 7px; }
.lwf-clock svg { width: 13px; height: 13px; color: var(--b300); }
.lwf-clock.lwf-tick { animation: lwf-tick .5s ease; }
.lwf-toast { position: absolute; right: 14px; top: 12px; z-index: 2; display: flex; align-items: center; gap: 8px; background: var(--toast); border: 1px solid var(--edge); border-radius: 8px; padding: 7px 12px; font-size: 13px; opacity: 0; transform: translateY(-6px); transition: opacity .35s, transform .35s; white-space: nowrap; }
.lwf-toast svg { width: 15px; height: 15px; color: var(--b300); }
.lwf-toast.lwf-show { opacity: 1; transform: none; }

.lwf-panel { position: relative; border-left: 1px solid var(--line); background: var(--chrome); display: flex; flex-direction: column; min-width: 0; min-height: 0; }
.lwf-phead { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--line); min-width: 0; }
.lwf-pic { width: 30px; height: 30px; border-radius: 8px; background: var(--wash); color: var(--b300); display: grid; place-items: center; flex: none; }
.lwf-pic svg { width: 16px; height: 16px; }
.lwf-phead small { display: block; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); }
.lwf-phead b { display: block; font-size: 14.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lwf-pstate { margin-left: auto; font-weight: 600; font-size: 11px; color: var(--muted); flex: none; }
.lwf-pstate.lwf-ok { color: var(--b300); }
.lwf-pbody { position: relative; flex: 1; min-height: 0; }
.lwf-scene { position: absolute; inset: 0; padding: 16px; display: flex; flex-direction: column; gap: 10px; opacity: 0; transform: translateY(8px); transition: opacity .45s, transform .5s cubic-bezier(.16,1,.3,1); pointer-events: none; overflow: hidden; }
.lwf-scene.lwf-on { opacity: 1; transform: none; }

.lwf-chat { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: flex-end; gap: 8px; overflow: hidden; padding-top: 12px; -webkit-mask-image: linear-gradient(transparent, #000 28px); mask-image: linear-gradient(transparent, #000 28px); }
.lwf-bub { max-width: 88%; padding: 8px 12px; border-radius: 14px; }
.lwf-bub small { display: block; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
.lwf-them { align-self: flex-start; background: var(--raised); border-bottom-left-radius: 4px; }
.lwf-me { align-self: flex-end; background: var(--wash); border: 1px solid var(--edge); color: var(--b200); border-bottom-right-radius: 4px; }
.lwf-me small { color: var(--b400); }
.lwf-dots { display: none; gap: 4px; padding: 4px 0; }
.lwf-dots i { width: 6px; height: 6px; border-radius: 50%; background: var(--b300); animation: lwf-blink 1s infinite; }
.lwf-dots i:nth-child(2) { animation-delay: .15s; }
.lwf-dots i:nth-child(3) { animation-delay: .3s; }
.lwf-typing .lwf-dots { display: flex; }
.lwf-typing .lwf-txt { display: none; }

.lwf-callhead { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--raised); }
.lwf-callhead b { display: block; }
.lwf-callhead .lwf-pill { margin-left: auto; align-self: center; }
.lwf-ringer { position: relative; width: 40px; height: 40px; border-radius: 50%; background: var(--wash); color: var(--b300); display: grid; place-items: center; flex: none; }
.lwf-ringer svg { width: 18px; height: 18px; }
.lwf-ringer::before, .lwf-ringer::after { content: ""; position: absolute; inset: 0; border-radius: 50%; border: 1px solid var(--b400); opacity: 0; }
.lwf-ringing .lwf-ringer::before { animation: lwf-ring 1.5s ease-out infinite; }
.lwf-ringing .lwf-ringer::after { animation: lwf-ring 1.5s ease-out .75s infinite; }
.lwf-ringing .lwf-ringer svg { animation: lwf-buzz .45s ease-in-out infinite; }

.lwf-cal { display: grid; grid-template-columns: 52px repeat(3, minmax(0,1fr)); grid-template-rows: auto repeat(4, 48px); gap: 5px; }
.lwf-dh { font-size: 11px; color: var(--muted); text-align: center; letter-spacing: .1em; text-transform: uppercase; }
.lwf-dh.lwf-hl { color: var(--b300); }
.lwf-tl { font-size: 11px; color: var(--muted); padding-top: 4px; }
.lwf-cell { border: 1px solid rgb(var(--lwf-w) / .06); background: rgb(var(--lwf-w) / .015); border-radius: 6px; }
.lwf-appt { z-index: 1; margin: 2px; border-radius: 6px; border-left: 3px solid rgb(var(--lwf-w) / .25); background: rgb(var(--lwf-w) / .05); padding: 4px 7px; overflow: hidden; min-width: 0; }
.lwf-appt b { display: block; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--ink2); }
.lwf-appt span { display: block; font-size: 10.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lwf-appt.lwf-new { background: var(--wash); border: 1px solid var(--edge); border-left: 3px solid var(--b400); }
.lwf-appt.lwf-new b { color: var(--b200); }

.lwf-rec { border: 1px solid var(--line); border-radius: 12px; background: var(--raised); overflow: hidden; }
.lwf-rech { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-bottom: 1px solid var(--line); }
.lwf-av { width: 36px; height: 36px; border-radius: 50%; background: var(--wash); border: 1px solid var(--edge); color: var(--b200); display: grid; place-items: center; font-weight: 700; font-size: 13px; flex: none; }
.lwf-f { display: grid; grid-template-columns: 110px minmax(0,1fr); gap: 10px; padding: 9px 14px; border-bottom: 1px solid rgb(var(--lwf-w) / .05); font-size: 13px; }
.lwf-f:last-child { border-bottom: 0; }
.lwf-f span:first-child { color: var(--muted); }
.lwf-f span:last-child { opacity: 0; transition: opacity .35s; }
.lwf-f.lwf-in { background: linear-gradient(90deg, rgb(var(--lwf-g) / .08), transparent 60%); }
.lwf-f.lwf-in span:last-child { opacity: 1; }
.lwf-f:last-child span:last-child { color: var(--b300); font-weight: 600; }

.lwf-lead { border: 1px solid var(--line); background: var(--raised); border-radius: 12px; padding: 11px 13px; }
.lwf-lead .lwf-src { color: var(--b300); font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
.lwf-lead .lwf-src svg { width: 12px; height: 12px; }
.lwf-lead b { display: block; font-size: 15px; margin-top: 4px; }
.lwf-watchrow { display: flex; align-items: center; gap: 14px; }
.lwf-watch { position: relative; width: 92px; height: 92px; display: grid; place-items: center; text-align: center; flex: none; }
.lwf-watch svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.lwf-trk { fill: none; stroke: rgb(var(--lwf-w) / .08); stroke-width: 6; }
.lwf-arc { fill: none; stroke: var(--b400); stroke-width: 6; stroke-linecap: round; stroke-dasharray: 282.74; stroke-dashoffset: 282.74; }
.lwf-watcht { font-weight: 600; font-size: 22px; line-height: 1; }
.lwf-watchl { font-size: 9.5px; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; margin-top: 4px; }
.lwf-watch.lwf-done .lwf-watcht { color: var(--b300); }
.lwf-watchnote { font-size: 13px; color: var(--muted); }
.lwf-watchnote b { color: var(--text); }

.lwf-track { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); padding-top: 4px; }
.lwf-track::before, .lwf-fill { content: ""; position: absolute; left: 16.6%; top: 12px; height: 2px; width: 66.8%; background: rgb(var(--lwf-w) / .1); }
.lwf-fill { background: var(--b400); transform-origin: left; transform: scaleX(0); transition: transform .6s cubic-bezier(.16,1,.3,1); }
.lwf-stop { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
.lwf-stop i { width: 18px; height: 18px; border-radius: 50%; border: 2px solid rgb(var(--lwf-w) / .18); background: var(--chrome); transition: all .35s; }
.lwf-stop span { font-size: 11.5px; color: var(--muted); transition: color .35s; line-height: 1.25; }
.lwf-stop.lwf-lit i { border-color: var(--b400); background: var(--b400); box-shadow: 0 0 0 5px rgb(var(--lwf-g) / .15); }
.lwf-stop.lwf-lit span { color: var(--text); }

.lwf-inv { position: relative; border: 1px solid var(--line); border-radius: 12px; background: var(--raised); padding: 13px 14px; overflow: hidden; }
.lwf-invh { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.lwf-invh b { font-size: 15px; }
.lwf-status { font-weight: 600; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--line); border-radius: 5px; padding: 2px 7px; }
.lwf-status.lwf-paid { color: var(--on-b); background: var(--b400); border-color: var(--b400); }
.lwf-invrows { margin-top: 10px; display: grid; gap: 4px; font-size: 13px; color: var(--muted); }
.lwf-stamp { position: absolute; right: 18px; bottom: 12px; font-weight: 800; font-size: 22px; letter-spacing: .14em; color: var(--b300); border: 2.5px solid var(--b300); border-radius: 6px; padding: 1px 10px; transform: rotate(-10deg) scale(1.6); opacity: 0; transition: transform .35s cubic-bezier(.34,1.56,.64,1), opacity .2s; }
.lwf-stamp.lwf-in { transform: rotate(-10deg); opacity: .9; }

.lwf-reph { display: flex; align-items: center; gap: 10px; }
.lwf-sun { width: 34px; height: 34px; border-radius: 50%; background: var(--wash); color: var(--b300); display: grid; place-items: center; flex: none; }
.lwf-sun svg { width: 18px; height: 18px; }
.lwf-reph b { display: block; font-size: 16px; }
.lwf-feed { display: flex; flex-direction: column; gap: 7px; min-height: 0; overflow: hidden; }
.lwf-note { display: grid; grid-template-columns: 32px minmax(0,1fr); gap: 10px; align-items: center; padding: 8px 10px; border: 1px solid var(--line); background: var(--raised); border-radius: 10px; }
.lwf-nic { width: 32px; height: 32px; border-radius: 8px; background: var(--wash); color: var(--b300); display: grid; place-items: center; }
.lwf-nic svg { width: 15px; height: 15px; }
.lwf-note b { display: block; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lwf-note span { display: block; font-size: 11.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.lwf-bottom { grid-column: 1 / -1; display: flex; align-items: center; gap: 18px; padding: 12px 16px; border-top: 1px solid var(--line); background: var(--chrome); min-width: 0; }
.lwf-caption { flex: 1; min-width: 0; font-size: 15px; }
.lwf-caption.lwf-fresh { animation: lwf-fade .5s ease both; }
.lwf-chapters { display: flex; gap: 6px; flex: none; }
.lwf-chap { all: unset; cursor: pointer; display: flex; flex-direction: column; gap: 6px; width: 104px; font-size: 11.5px; color: var(--muted); border-radius: 4px; }
.lwf-chap:hover { color: var(--ink2); }
.lwf-chap:focus-visible { outline: 2px solid var(--b300); outline-offset: 4px; }
.lwf-chap.lwf-on { color: var(--b200); }
.lwf-bar { height: 3px; border-radius: 3px; background: rgb(var(--lwf-w) / .1); overflow: hidden; }
.lwf-bar i { display: block; height: 100%; width: 100%; background: var(--b400); transform-origin: left; transform: scaleX(0); }
.lwf-play { all: unset; cursor: pointer; width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--line); display: grid; place-items: center; flex: none; }
.lwf-play:hover { border-color: var(--edge); }
.lwf-play:focus-visible { outline: 2px solid var(--b300); outline-offset: 2px; }
.lwf-play svg { width: 15px; height: 15px; }
.lwf-play .lwf-ico-play { display: none; }
.lwf-paused .lwf-play .lwf-ico-play { display: block; }
.lwf-paused .lwf-play .lwf-ico-pause { display: none; }

@container lwf (max-width: 820px) {
  .lwf-stage { grid-template-columns: minmax(0,1fr); grid-template-rows: auto 300px 480px auto; aspect-ratio: auto; min-height: 0; }
  .lwf-panel { border-left: 0; border-top: 1px solid var(--line); }
  .lwf-tabs, .lwf-active > span { display: none; }
  .lwf-bottom { flex-wrap: wrap; gap: 12px; }
  .lwf-caption { flex-basis: 100%; font-size: 14px; }
  .lwf-chapters { flex: 1; }
  .lwf-chap { flex: 1; width: auto; padding: 14px 0; margin-block: -14px; justify-content: center; }
  .lwf-chap > span:first-child { display: none; }
  .lwf-toast { top: auto; bottom: 12px; right: 50%; transform: translate(50%, 6px); }
  .lwf-toast.lwf-show { transform: translate(50%, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .lwf-wrap *, .lwf-wrap *::before, .lwf-wrap *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
  .lwf-play { display: none; }
}
`;

/* ------------------------------------------------------------ section -- */

export function LeeSystemsWorkflowFilmSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  useWorkflowFilm(rootRef);

  return (
    <section
      id={leeSystemsAnchors.fullWeek}
      className="relative isolate overflow-x-clip pt-6 pb-20 md:pt-10 md:pb-28"
    >
      <style href="lee-systems-workflow-film" precedence="default">
        {styles}
      </style>

      <div className="section-container">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <p className="svc-kicker">How it runs</p>
          <h2 className="heading-lg text-balance text-white">Watch one system run your week</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-neutral-300">
            A late-night call, a new lead, a finished job and your morning report, each handled
            start to finish without you.
          </p>
        </div>

        <div ref={rootRef} className="lwf-wrap mx-auto max-w-[1180px] select-none">
          <p className="sr-only">{DESCRIPTION}</p>
          <div className="lwf-stage" data-lwf="stage">
            <TopBar />
            <Canvas />
            <OutputPanel />
            <div className="lwf-bottom">
              <div className="lwf-caption" data-lwf="caption" aria-hidden="true">
                A customer calls after hours. The AI assistant answers.
              </div>
              <div className="lwf-chapters">
                {chapters.map((name) => (
                  <button key={name} type="button" className="lwf-chap" data-lwf="chap" aria-label={`Play: ${name}`}>
                    <span>{name}</span>
                    <span className="lwf-bar">
                      <i data-lwf="chap-bar" />
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" className="lwf-play" data-lwf="play" aria-label="Pause">
                <Pause className="lwf-ico-pause" fill="currentColor" aria-hidden="true" />
                <Play className="lwf-ico-play" fill="currentColor" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The editor's top bar: the workflow's name, the tabs and the Active switch. */
function TopBar() {
  return (
    <div className="lwf-top" aria-hidden="true">
      <span className="lwf-logo">
        <Zap />
      </span>
      <span className="lwf-wf">
        Your business <span>/ Calls, leads &amp; follow-up</span>
      </span>
      <span className="lwf-tabs">
        <span>Editor</span>
        <span>Executions</span>
      </span>
      <span className="lwf-active">
        <span>Active</span>
        <i className="lwf-toggle" />
      </span>
    </div>
  );
}

/** The workflow, on a world the camera moves over. */
function Canvas() {
  return (
    <div className="lwf-canvas" data-lwf="canvas" aria-hidden="true">
      <div className="lwf-world" data-lwf="world">
        {groups.map((g) => (
          <div key={g.label} className="lwf-group" style={{ left: g.x, top: g.y, width: g.w, height: g.h }}>
            <b>{g.label}</b>
          </div>
        ))}

        <svg className="lwf-wires" viewBox={`0 0 ${WORLD.w} ${WORLD.h}`}>
          {wires.map((w) => (
            <path key={w.id} d={w.d} className={clsx("lwf-wire", w.dash && "lwf-dash")} data-lwf-wire={w.id} />
          ))}
          {wires.map(
            (w) =>
              w.label &&
              w.labelAt && (
                <text key={w.id} x={w.labelAt.x} y={w.labelAt.y} textAnchor="middle" className="lwf-wlab" data-lwf-wlab={w.id}>
                  {w.label}
                </text>
              )
          )}
          <text x={958} y={457} className="lwf-iflab">true</text>
          <text x={958} y={493} className="lwf-iflab">false</text>
          {ports.map((p, i) =>
            p.diamond ? (
              <rect
                key={i}
                x={p.at.x - 5}
                y={p.at.y - 5}
                width={10}
                height={10}
                transform={`rotate(45 ${p.at.x} ${p.at.y})`}
                className="lwf-port"
                data-lwf-port={p.id}
              />
            ) : (
              <circle key={i} cx={p.at.x} cy={p.at.y} r={5} className="lwf-port" data-lwf-port={p.id} />
            )
          )}
          {wires.map((w) => (
            <circle key={w.id} r={5.5} className="lwf-packet" data-lwf-packet={w.id} />
          ))}
        </svg>

        {flowNodes.map((n) => {
          const { w, h } = SIZE[n.kind];
          return (
            <div
              key={n.id}
              className={`lwf-node lwf-${n.kind}`}
              data-lwf-node={n.id}
              style={{ left: n.x - w / 2, top: n.y - h / 2, width: w, height: h }}
            >
              <div className="lwf-nbox">
                <n.Icon strokeWidth={1.75} />
                {n.kind === "agent" && (
                  <div>
                    <b>{n.label}</b>
                    <span>{n.sub}</span>
                  </div>
                )}
                <span className="lwf-okb">
                  <Check strokeWidth={3} />
                </span>
                {n.kind === "trigger" && (
                  <span className="lwf-bolt">
                    <Zap />
                  </span>
                )}
              </div>
              {n.kind !== "agent" && (
                <div className="lwf-nlabel">
                  <b>{n.label}</b>
                  {n.sub && <span>{n.sub}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="lwf-clock lwf-num" data-lwf="clock">
        <Clock />
        <span data-lwf="clock-text">TUE 11:47 PM</span>
      </div>
      <div className="lwf-toast" data-lwf="toast">
        <CircleCheck />
        Workflow ran successfully
      </div>
    </div>
  );
}

/** What the running step did, one scene per kind of output. */
function OutputPanel() {
  return (
    <div className="lwf-panel" aria-hidden="true">
      <div className="lwf-phead">
        <span className="lwf-pic">
          {flowNodes
            .filter((n) => n.kind !== "sub")
            .map((n) => (
              <n.Icon key={n.id} data-lwf-picon={n.id} className={clsx(n.id !== "n1" && "lwf-hide")} />
            ))}
        </span>
        <div className="min-w-0">
          <small>Output</small>
          <b data-lwf="panel-title">Incoming call</b>
        </div>
        <span className="lwf-pstate" data-lwf="panel-state">
          Running
        </span>
      </div>

      <div className="lwf-pbody">
        <div className="lwf-scene lwf-on" data-lwf-scene="call">
          <div className="lwf-callhead lwf-ringing" data-lwf="call-head">
            <span className="lwf-ringer">
              <Phone />
            </span>
            <div className="min-w-0">
              <b data-lwf="call-status">Incoming call</b>
              <span className="lwf-small lwf-num">(301) 555-0142</span>
            </div>
            <span className="lwf-pill lwf-hide" data-lwf="call-tag">
              AI assistant
            </span>
          </div>
          <div className="lwf-chat">
            {callLines.map((line, i) => (
              <div
                key={i}
                className={clsx("lwf-bub lwf-hide", line.who === "Caller" ? "lwf-them" : "lwf-me")}
                data-lwf="call-line"
              >
                <small>{line.who}</small>
                {line.who === "Caller" ? (
                  line.text
                ) : (
                  <>
                    <span className="lwf-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="lwf-txt">{line.text}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lwf-scene" data-lwf-scene="cal">
          <div className="lwf-cal">
            <span />
            {["Tue", "Wed", "Thu"].map((d) => (
              <span key={d} className={clsx("lwf-dh", d === "Wed" && "lwf-hl")}>
                {d}
              </span>
            ))}
            {["9 AM", "11 AM", "1:30 PM", "3 PM"].map((t, r) => (
              <span key={t} className="lwf-tl lwf-num" style={{ gridRow: r + 2, gridColumn: 1 }}>
                {t}
              </span>
            ))}
            {[0, 1, 2, 3].flatMap((r) =>
              [0, 1, 2].map((c) => (
                <span key={`${r}-${c}`} className="lwf-cell" style={{ gridRow: r + 2, gridColumn: c + 2 }} />
              ))
            )}
            <div className="lwf-appt" style={{ gridRow: 2, gridColumn: 2 }}>
              <b>Gutter repair</b>
              <span>Booked</span>
            </div>
            <div className="lwf-appt" style={{ gridRow: 3, gridColumn: 4 }}>
              <b>Water heater</b>
              <span>Booked</span>
            </div>
            <div className="lwf-appt" style={{ gridRow: 5, gridColumn: 3 }}>
              <b>Estimate</b>
              <span>Booked</span>
            </div>
            <div className="lwf-appt lwf-new lwf-hide" data-lwf="new-appt" style={{ gridRow: 4, gridColumn: 3 }}>
              <b>Dana W. · AC repair</b>
              <span>Booked by AI on the call</span>
            </div>
          </div>
          <span className="lwf-pill lwf-hide" data-lwf="cal-pill">
            <Check />
            Added to your calendar
          </span>
        </div>

        <div className="lwf-scene" data-lwf-scene="crm">
          <div className="lwf-rec">
            <div className="lwf-rech">
              <span className="lwf-av">DW</span>
              <div>
                <b>Dana W.</b>
                <div className="lwf-small">New contact</div>
              </div>
            </div>
            {crmFields.map(([k, v]) => (
              <div key={k} className="lwf-f" data-lwf="crm-field">
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lwf-scene" data-lwf-scene="sms">
          <div className="lwf-small">
            Text message to <span className="lwf-num">(301) 555-0142</span>
          </div>
          <div className="lwf-chat">
            <div className="lwf-bub lwf-me lwf-hide" data-lwf="sms">
              <small>Your business</small>
              Hi Dana, you&apos;re booked for Wed at 1:30 PM at 14 Oak Lane. Reply here if anything
              changes.
            </div>
            <span className="lwf-small lwf-hide self-end" data-lwf="sms-delivered">
              Delivered
            </span>
          </div>
        </div>

        <div className="lwf-scene" data-lwf-scene="lead">
          <div className="lwf-lead lwf-hide" data-lwf="lead-card">
            <div className="lwf-src">
              <Globe />
              Website form
            </div>
            <b>Maria R.</b>
            <span className="lwf-small">Wants a quote for a kitchen remodel</span>
          </div>
          <div className="lwf-watchrow">
            <div className="lwf-watch" data-lwf="watch">
              <svg viewBox="0 0 100 100">
                <circle className="lwf-trk" cx="50" cy="50" r="45" />
                <circle className="lwf-arc" cx="50" cy="50" r="45" data-lwf="watch-arc" />
              </svg>
              <div>
                <div className="lwf-watcht lwf-num" data-lwf="watch-time">
                  0:00
                </div>
                <div className="lwf-watchl">Reply time</div>
              </div>
            </div>
            <div className="lwf-watchnote">
              <span data-lwf="watch-before">The clock starts the second the form is sent.</span>
              <span className="lwf-hide" data-lwf="watch-after">
                <b>Replied in 0:41.</b> Before she could call anyone else.
              </span>
            </div>
          </div>
          <div className="lwf-chat">
            <div className="lwf-bub lwf-me lwf-hide" data-lwf="lead-reply">
              <small>Your business</small>
              Hi Maria, thanks for reaching out! Could you text a couple photos of the kitchen?
              We&apos;ll get you a quote today.
            </div>
          </div>
        </div>

        <div className="lwf-scene" data-lwf-scene="follow">
          <div className="lwf-track">
            <span className="lwf-fill" data-lwf="track-fill" />
            {["Instant reply", "Day 2 follow-up", "She says yes"].map((s) => (
              <div key={s} className="lwf-stop" data-lwf="stop">
                <i />
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className="lwf-chat">
            <div className="lwf-bub lwf-me lwf-hide" data-lwf="follow-1">
              <small>Day 2 · text</small>
              Hi Maria, just checking in on your kitchen quote. Want me to hold a time for you this
              week?
            </div>
            <div className="lwf-bub lwf-them lwf-hide" data-lwf="follow-2">
              <small>Maria</small>
              Yes, let&apos;s do it. Can you come Friday?
            </div>
            <span className="lwf-pill lwf-hide" data-lwf="follow-pill">
              <Check />
              Moved to Booked in your CRM
            </span>
          </div>
        </div>

        <div className="lwf-scene" data-lwf-scene="after">
          <div className="lwf-bub lwf-me lwf-hide" data-lwf="review">
            <small>Text to Dana</small>
            Thanks for choosing us, Dana! Would you mind leaving a quick review? It really helps.
          </div>
          <div className="lwf-inv lwf-hide" data-lwf="invoice">
            <div className="lwf-invh">
              <b>Invoice #1042</b>
              <span className="lwf-status" data-lwf="invoice-sent">
                Sent
              </span>
              <span className="lwf-status lwf-paid lwf-hide" data-lwf="invoice-paid">
                Paid
              </span>
            </div>
            <div className="lwf-invrows">
              <span>Dana W. · AC repair</span>
              <span>Pay online by card</span>
            </div>
            <span className="lwf-stamp" data-lwf="stamp">
              PAID
            </span>
          </div>
          <span className="lwf-pill lwf-hide" data-lwf="after-pill">
            <Check />
            Marked paid in your CRM
          </span>
        </div>

        <div className="lwf-scene" data-lwf-scene="report">
          <div className="lwf-reph">
            <span className="lwf-sun">
              <Sun />
            </span>
            <div>
              <b>Good morning</b>
              <span className="lwf-small">Here&apos;s what ran while you were busy</span>
            </div>
          </div>
          <div className="lwf-feed">
            {report.map(({ Icon, title, body }) => (
              <div key={title} className="lwf-note lwf-hide" data-lwf="report-note">
                <span className="lwf-nic">
                  <Icon />
                </span>
                <div className="min-w-0">
                  <b>{title}</b>
                  <span>{body}</span>
                </div>
              </div>
            ))}
          </div>
          <span className="lwf-pill lwf-hide" data-lwf="report-pill">
            <Bell />
            Sent to your phone and inbox
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- engine -- */

/** How long a packet takes along a wire, in milliseconds. */
const HOP_MS = 650;

function useWorkflowFilm(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const one = <T extends Element = HTMLElement>(key: string) =>
      root.querySelector<T>(`[data-lwf="${key}"]`)!;
    const all = <T extends Element = HTMLElement>(key: string) =>
      Array.from(root.querySelectorAll<T>(`[data-lwf="${key}"]`));
    const byAttr = <T extends Element>(attr: string) => {
      const map: Record<string, T[]> = {};
      root.querySelectorAll<T>(`[${attr}]`).forEach((el) => {
        (map[el.getAttribute(attr)!] ||= []).push(el);
      });
      return map;
    };

    const stage = one("stage");
    const canvas = one("canvas");
    const world = one("world");
    const nodeEls = byAttr<HTMLElement>("data-lwf-node");
    const portEls = byAttr<SVGElement>("data-lwf-port");
    const wireEls = byAttr<SVGPathElement>("data-lwf-wire");
    const labelEls = byAttr<SVGTextElement>("data-lwf-wlab");
    const packetEls = byAttr<SVGCircleElement>("data-lwf-packet");
    const sceneEls = byAttr<HTMLElement>("data-lwf-scene");
    const panelIcons = byAttr<SVGElement>("data-lwf-picon");
    const wireLength = Object.fromEntries(
      Object.entries(wireEls).map(([id, [path]]) => [id, path.getTotalLength()])
    );

    const el = {
      caption: one("caption"),
      clock: one("clock"),
      clockText: one("clock-text"),
      toast: one("toast"),
      panelTitle: one("panel-title"),
      panelState: one("panel-state"),
      callHead: one("call-head"),
      callStatus: one("call-status"),
      callTag: one("call-tag"),
      callLines: all("call-line"),
      newAppt: one("new-appt"),
      calPill: one("cal-pill"),
      crmFields: all("crm-field"),
      sms: one("sms"),
      smsDelivered: one("sms-delivered"),
      leadCard: one("lead-card"),
      watch: one("watch"),
      watchArc: one<SVGCircleElement>("watch-arc"),
      watchTime: one("watch-time"),
      watchBefore: one("watch-before"),
      watchAfter: one("watch-after"),
      leadReply: one("lead-reply"),
      stops: all("stop"),
      trackFill: one("track-fill"),
      follow1: one("follow-1"),
      follow2: one("follow-2"),
      followPill: one("follow-pill"),
      review: one("review"),
      invoice: one("invoice"),
      invoiceSent: one("invoice-sent"),
      invoicePaid: one("invoice-paid"),
      stamp: one("stamp"),
      afterPill: one("after-pill"),
      reportNotes: all("report-note"),
      reportPill: one("report-pill"),
      chapButtons: all("chap"),
      chapBars: all("chap-bar"),
      play: one("play"),
    };

    /* The clock, its events and its tweens. */
    let vt = 0;
    let chapter = 0;
    let events: { t: number; fn: () => void }[] = [];
    let next = 0;
    let tweens: { t0: number; dur: number; fn: (p: number) => void }[] = [];
    /** True while a story is being drawn finished at once, with no motion. */
    let flushing = false;
    const at = (t: number, fn: () => void) => events.push({ t, fn });
    const tween = (dur: number, fn: (p: number) => void) => {
      if (flushing) fn(1);
      else tweens.push({ t0: vt, dur, fn });
    };

    /* The camera: follows the running step at a size the canvas can read,
       or pulls back to fit the whole workflow. */
    let cam = { x: 400, y: ROW_Y.n, whole: false };
    const placeCamera = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      let s: number;
      let { x, y } = cam;
      if (cam.whole) {
        s = Math.min(cw / WORLD.w, ch / WORLD.h) * 0.98;
        x = WORLD.w / 2;
        y = WORLD.h / 2;
      } else {
        s = Math.max(0.55, Math.min(1.05, cw / 780));
        x = Math.max(x, cw / (2 * s) - 20);
      }
      world.style.transform = `translate(${cw / 2 - x * s}px, ${ch / 2 - y * s}px) scale(${s})`;
    };
    const follow = (id: string) => {
      cam = { x: node[id].x + 120, y: ROW_Y[id[0]], whole: false };
      placeCamera();
    };
    const pullBack = () => {
      cam = { ...cam, whole: true };
      placeCamera();
    };
    /** Moves the camera without its glide, for jumps and resizes. */
    const snapCamera = () => {
      world.style.transition = "none";
      placeCamera();
      void world.offsetWidth;
      world.style.transition = "";
    };

    /* Steps and wires. */
    let panelNode = "n1";
    const run = (id: string, panel = true) => {
      const n = nodeEls[id][0];
      n.classList.remove("lwf-ok");
      n.classList.add("lwf-run");
      if (panel && node[id].kind !== "sub") {
        panelNode = id;
        Object.entries(panelIcons).forEach(([k, [icon]]) => icon.classList.toggle("lwf-hide", k !== id));
        el.panelTitle.textContent = node[id].label;
        el.panelState.textContent = "Running";
        el.panelState.classList.remove("lwf-ok");
      }
    };
    const ok = (id: string) => {
      const n = nodeEls[id][0];
      n.classList.remove("lwf-run");
      n.classList.add("lwf-ok");
      portEls[id]?.forEach((p) => p.classList.add("lwf-ok"));
      if (id === panelNode) {
        el.panelState.textContent = "Done";
        el.panelState.classList.add("lwf-ok");
      }
    };
    const send = (id: string, dur = HOP_MS) => {
      const path = wireEls[id][0];
      const packet = packetEls[id][0];
      path.classList.add("lwf-hot");
      tween(dur, (p) => {
        if (p < 1 && !flushing) {
          const pt = path.getPointAtLength(wireLength[id] * p);
          packet.setAttribute("cx", String(pt.x));
          packet.setAttribute("cy", String(pt.y));
          packet.style.opacity = "1";
        } else {
          packet.style.opacity = "0";
          labelEls[id]?.[0].classList.add("lwf-show");
        }
      });
    };
    /** `from` finishes and sends the item along `wire`; `to` starts on arrival. */
    const hop = (t: number, from: string, wire: string, to: string) => {
      at(t, () => {
        ok(from);
        send(wire);
      });
      at(t + HOP_MS, () => {
        run(to);
        follow(to);
      });
      return t + HOP_MS;
    };

    /* The panel, the caption and the clock. */
    const scene = (key: string) =>
      Object.entries(sceneEls).forEach(([k, [s]]) => s.classList.toggle("lwf-on", k === key));
    const restart = (target: HTMLElement, cls: string) => {
      target.classList.remove(cls);
      if (flushing) return;
      void target.offsetWidth;
      target.classList.add(cls);
    };
    const show = (target: HTMLElement) => {
      target.classList.remove("lwf-hide");
      restart(target, "lwf-pop");
    };
    const hide = (target: HTMLElement) => target.classList.add("lwf-hide");
    const say = (text: string) => {
      el.caption.textContent = text;
      restart(el.caption, "lwf-fresh");
    };
    const clockTo = (text: string) => {
      el.clockText.textContent = text;
      restart(el.clock, "lwf-tick");
    };
    const toast = (on: boolean) => el.toast.classList.toggle("lwf-show", on);
    const drawWatch = (s: number) => {
      el.watchTime.textContent = `0:${String(Math.floor(s)).padStart(2, "0")}`;
      el.watchArc.style.strokeDashoffset = String(282.74 * (1 - s / 60));
    };
    const trackTo = (n: number) => {
      el.stops.forEach((s, i) => s.classList.toggle("lwf-lit", i <= n));
      el.trackFill.style.transform = `scaleX(${Math.max(0, n) / 2})`;
    };

    const reset = () => {
      Object.values(nodeEls).forEach(([n]) => n.classList.remove("lwf-run", "lwf-ok"));
      Object.values(portEls).flat().forEach((p) => p.classList.remove("lwf-ok"));
      Object.values(wireEls).forEach(([w]) => w.classList.remove("lwf-hot"));
      Object.values(labelEls).forEach(([l]) => l.classList.remove("lwf-show"));
      Object.values(packetEls).forEach(([p]) => (p.style.opacity = "0"));
      tweens = [];

      el.callHead.classList.add("lwf-ringing");
      el.callStatus.textContent = "Incoming call";
      [
        el.callTag,
        ...el.callLines,
        el.newAppt,
        el.calPill,
        el.sms,
        el.smsDelivered,
        el.leadCard,
        el.watchAfter,
        el.leadReply,
        el.follow1,
        el.follow2,
        el.followPill,
        el.review,
        el.invoice,
        el.invoicePaid,
        el.afterPill,
        ...el.reportNotes,
        el.reportPill,
      ].forEach(hide);
      el.callLines.forEach((l) => l.classList.remove("lwf-typing"));
      el.crmFields.forEach((f) => f.classList.remove("lwf-in"));
      drawWatch(0);
      el.watch.classList.remove("lwf-done");
      el.watchBefore.classList.remove("lwf-hide");
      trackTo(-1);
      el.invoiceSent.classList.remove("lwf-hide");
      el.stamp.classList.remove("lwf-in");
    };

    /* The four stories, as timed events (milliseconds into each). */
    const stories: { ms: number; build: () => void }[] = [
      {
        ms: 19000,
        build() {
          const line = el.callLines;
          at(0, () => {
            clockTo("TUE 11:47 PM");
            say("A customer calls after hours. The AI assistant answers.");
            scene("call");
            follow("n1");
            toast(false);
          });
          at(300, () => run("n1"));
          at(2000, () => {
            el.callHead.classList.remove("lwf-ringing");
            el.callStatus.textContent = "Answered";
            show(el.callTag);
          });
          hop(2000, "n1", "n1-n2", "n2");
          at(2900, () => show(line[0]));
          at(3300, () => {
            run("s1", false);
            send("n2-s1", 500);
          });
          at(3900, () => {
            ok("s1");
            show(line[1]);
            line[1].classList.add("lwf-typing");
            run("s2", false);
            send("n2-s2", 500);
          });
          at(4700, () => {
            line[1].classList.remove("lwf-typing");
            ok("s2");
          });
          at(6200, () => show(line[2]));
          at(6900, () => {
            say("It checks your calendar and books the job on the call.");
            run("s3", false);
            send("n2-s3", 500);
            show(line[3]);
            line[3].classList.add("lwf-typing");
          });
          at(8000, () => {
            ok("s3");
            line[3].classList.remove("lwf-typing");
          });
          hop(9200, "n2", "n2-n3", "n3");
          at(9850, () => scene("cal"));
          at(10300, () => show(el.newAppt));
          at(10900, () => show(el.calPill));
          hop(11700, "n3", "n3-n4", "n4");
          at(12350, () => {
            scene("crm");
            say("The contact and the job go into your CRM.");
          });
          el.crmFields.forEach((f, i) => at(12700 + i * 380, () => f.classList.add("lwf-in")));
          hop(14900, "n4", "n4-n5", "n5");
          at(15550, () => {
            scene("sms");
            say("Dana gets a confirmation text before she hangs up.");
          });
          at(15900, () => show(el.sms));
          at(16700, () => {
            show(el.smsDelivered);
            ok("n5");
            toast(true);
          });
        },
      },
      {
        ms: 19500,
        build() {
          at(0, () => {
            clockTo("WED 9:02 AM");
            say("A new lead fills out the form on your website.");
            scene("lead");
            follow("m1");
            toast(false);
          });
          at(300, () => run("m1"));
          at(700, () => show(el.leadCard));
          const writing = hop(1500, "m1", "m1-m2", "m2");
          at(writing, () => tween(3600, (p) => drawWatch(41 * (1 - (1 - p) ** 1.6))));
          hop(3200, "m2", "m2-m3", "m3");
          at(5000, () => {
            el.watch.classList.add("lwf-done");
            hide(el.watchBefore);
            show(el.watchAfter);
            show(el.leadReply);
          });
          hop(5600, "m3", "m3-m4", "m4");
          at(6250, () => {
            scene("follow");
            trackTo(0);
            say("No answer yet. It waits two days, then follows up.");
          });
          at(7300, () => clockTo("FRI 9:02 AM"));
          hop(7600, "m4", "m4-m5", "m5");
          at(8250, () => say("No reply, so it sends a follow-up."));
          hop(8900, "m5", "m5-m6", "m6");
          at(9900, () => {
            trackTo(1);
            show(el.follow1);
          });
          hop(10800, "m6", "m6-m4", "m4");
          at(11450, () => say("Then it waits and checks again."));
          at(12100, () => clockTo("FRI 9:40 AM"));
          hop(12500, "m4", "m4-m5", "m5");
          at(13300, () => {
            show(el.follow2);
            trackTo(2);
            say("She says yes.");
          });
          hop(14200, "m5", "m5-m7", "m7");
          at(15500, () => {
            show(el.followPill);
            ok("m7");
            toast(true);
          });
        },
      },
      {
        ms: 13500,
        build() {
          at(0, () => {
            clockTo("WED 3:10 PM");
            say("Dana's job is marked done.");
            scene("after");
            follow("j1");
            toast(false);
          });
          at(300, () => run("j1"));
          hop(1300, "j1", "j1-j2", "j2");
          at(2300, () => {
            show(el.review);
            say("It asks her for a review while the job is fresh.");
          });
          hop(3400, "j2", "j2-j3", "j3");
          at(4350, () => {
            show(el.invoice);
            say("The invoice goes out the same minute.");
          });
          hop(5500, "j3", "j3-j4", "j4");
          at(6600, () => {
            clockTo("THU 10:12 AM");
            say("She pays online the next morning.");
          });
          at(7300, () => {
            hide(el.invoiceSent);
            el.invoicePaid.classList.remove("lwf-hide");
            el.stamp.classList.add("lwf-in");
          });
          hop(7900, "j4", "j4-j5", "j5");
          at(8900, () => {
            show(el.afterPill);
            ok("j5");
            toast(true);
          });
        },
      },
      {
        ms: 16000,
        build() {
          at(0, () => {
            clockTo("MON 7:00 AM");
            say("Every morning, you get the rundown.");
            scene("report");
            follow("r1");
            toast(false);
          });
          at(300, () => run("r1"));
          hop(1200, "r1", "r1-r2", "r2");
          el.reportNotes.forEach((n, i) => at(2200 + i * 650, () => show(n)));
          hop(5600, "r2", "r2-r3", "r3");
          at(6600, () => {
            ok("r3");
            show(el.reportPill);
          });
          at(7600, () => {
            pullBack();
            say("Every step ran on its own.");
            toast(true);
          });
        },
      },
    ];

    const load = (i: number) => {
      events = [];
      stories[i].build();
      events.sort((a, b) => a.t - b.t);
      next = 0;
    };
    const finish = (i: number) => {
      load(i);
      flushing = true;
      events.forEach((e) => e.fn());
      flushing = false;
      events = [];
    };
    const drawBars = () =>
      el.chapBars.forEach((bar, j) => {
        const p = j < chapter ? 1 : j > chapter ? 0 : Math.min(1, vt / stories[chapter].ms);
        bar.style.transform = `scaleX(${p})`;
      });
    /** Starts story `i` from the top, or draws it finished when `finished`. */
    const start = (i: number, finished = false) => {
      reset();
      for (let j = 0; j < i; j++) finish(j);
      chapter = i;
      if (finished) {
        finish(i);
        vt = stories[i].ms;
      } else {
        load(i);
        vt = 0;
      }
      snapCamera();
      el.chapButtons.forEach((b, j) => b.classList.toggle("lwf-on", j === i));
      drawBars();
    };

    /* Playing. */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let paused = false;
    let onScreen = false;
    let frame = 0;
    let last = 0;
    const playable = () => onScreen && !document.hidden && !paused && !reduceMotion.matches;

    const tick = (now: number) => {
      // A stalled frame moves the clock at most 50ms, so nothing is skipped.
      const dt = last ? Math.min(50, now - last) : 0;
      last = now;
      vt += dt;
      while (next < events.length && events[next].t <= vt) events[next++].fn();
      tweens = tweens.filter((tw) => {
        const p = Math.min(1, (vt - tw.t0) / tw.dur);
        tw.fn(p);
        return p < 1;
      });
      drawBars();
      if (vt >= stories[chapter].ms) start((chapter + 1) % stories.length);
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      stage.classList.toggle("lwf-paused", paused);
      el.play.setAttribute("aria-label", paused ? "Play" : "Pause");
      if (playable()) {
        if (!frame) {
          last = 0;
          frame = requestAnimationFrame(tick);
        }
        return;
      }
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPlay = () => {
      paused = !paused;
      sync();
    };
    const onChapter = (i: number) => () => {
      start(i, reduceMotion.matches);
      if (paused) {
        paused = false;
        sync();
      }
    };
    const chapterHandlers = el.chapButtons.map((b, i) => {
      const handler = onChapter(i);
      b.addEventListener("click", handler);
      return handler;
    });
    el.play.addEventListener("click", onPlay);

    const onMotionChange = () => {
      if (reduceMotion.matches) start(stories.length - 1, true);
      sync();
    };

    if (reduceMotion.matches) start(stories.length - 1, true);
    else start(0);

    let resizeFrame = 0;
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(snapCamera);
    });
    resize.observe(canvas);

    const view = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.25 }
    );
    view.observe(stage);

    document.addEventListener("visibilitychange", sync);
    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      resize.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduceMotion.removeEventListener("change", onMotionChange);
      el.play.removeEventListener("click", onPlay);
      el.chapButtons.forEach((b, i) => b.removeEventListener("click", chapterHandlers[i]));
    };
  }, [rootRef]);
}
