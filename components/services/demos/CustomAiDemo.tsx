"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  BadgeCheck,
  CalendarClock,
  Camera,
  FileSpreadsheet,
  FileText,
  Mic,
  ScanSearch,
  TriangleAlert,
} from "lucide-react";
import { DemoFrame } from "@/components/services/demo/DemoFrame";
import { useDemo, type Demo } from "@/components/services/demo/useDemo";
import { ExampleTag, Panel, Photo, Segmented, TypeText } from "@/components/services/demo/ui";
import { demoSizes, demoTitles, type DemoProps } from "@/components/services/demo/sizes";
import { contract, hazards, inspectionPhoto, quoteLines, spreadsheet, voiceNote } from "@/data/demos/custom-ai";

/**
 * Custom AI Tools: four small tools, one at a time (the sub-tabs above).
 * - Voice to quote: a voice note's transcript, the line items pulled out of
 *   it, and a branded quote whose totals are worked out here from the lines.
 * - Photo inspection: a job-site photo is scanned and gets three numbered
 *   hazard pins (on the ladder, the roof and the gutter), a severity list and
 *   a "Signed report" stamp.
 * - Contract check: two risky clauses highlighted and explained in plain
 *   English, and the auto-renewal's cancel-by date (worked out from the
 *   term and the notice period) added to a mini calendar.
 * - Spreadsheet to report: a 1,048,576-row file becomes three numbers and a
 *   small chart.
 * Every tool has seven steps, so switching tools restarts the same clock.
 */

type ToolId = "quote" | "inspection" | "contract" | "report";

const tools: { id: ToolId; label: string; icon: React.ReactNode }[] = [
  { id: "quote", label: "Voice to quote", icon: <Mic aria-hidden="true" className="h-4 w-4" /> },
  { id: "inspection", label: "Photo inspection", icon: <Camera aria-hidden="true" className="h-4 w-4" /> },
  { id: "contract", label: "Contract check", icon: <FileText aria-hidden="true" className="h-4 w-4" /> },
  { id: "report", label: "Spreadsheet report", icon: <FileSpreadsheet aria-hidden="true" className="h-4 w-4" /> },
];

const durations: Record<ToolId, number[]> = {
  quote: [2400, 4200, 2200, 2200, 3400, 2800, 3000],
  inspection: [2600, 2600, 2400, 2400, 2400, 3400, 3000],
  contract: [2600, 2600, 3600, 2600, 3600, 3200, 3000],
  report: [2600, 3000, 2200, 2200, 2200, 3600, 3000],
};

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** The quote's numbers, from the line items. */
const quoteTotals = (() => {
  const lines = quoteLines.map((line) => ({ ...line, amount: line.qty * line.rate }));
  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const tax = Math.round(subtotal * voiceNote.taxRate * 100) / 100;
  return { lines, subtotal, tax, total: subtotal + tax };
})();

/** The contract's renewal date and its cancel-by date, from the term. */
const contractDates = (() => {
  const start = new Date(`${contract.start}T00:00:00Z`);
  const renewal = new Date(start);
  renewal.setUTCFullYear(renewal.getUTCFullYear() + 1);
  const cancelBy = new Date(renewal);
  cancelBy.setUTCDate(cancelBy.getUTCDate() - contract.noticeDays);
  const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
    date.toLocaleDateString("en-US", { timeZone: "UTC", ...options });
  return {
    renewal: format(renewal, { month: "short", day: "numeric", year: "numeric" }),
    cancelBy: format(cancelBy, { month: "short", day: "numeric", year: "numeric" }),
    month: format(cancelBy, { month: "long", year: "numeric" }),
    day: cancelBy.getUTCDate(),
    firstWeekday: new Date(Date.UTC(cancelBy.getUTCFullYear(), cancelBy.getUTCMonth(), 1)).getUTCDay(),
    daysInMonth: new Date(Date.UTC(cancelBy.getUTCFullYear(), cancelBy.getUTCMonth() + 1, 0)).getUTCDate(),
  };
})();

const captionsByTool: Record<ToolId, string[]> = {
  quote: [
    `A voice note, ${voiceNote.length} long.`,
    `Transcript: ${voiceNote.transcript}`,
    "Line items pulled from it.",
    "More line items.",
    `A branded quote. Total ${money(quoteTotals.total)}.`,
    "The quote is saved as a PDF and ready to send.",
    "From a voice note to a quote, without typing.",
  ],
  inspection: [
    "A job site photo is uploaded.",
    "The photo is checked for hazards.",
    ...hazards.map((hazard, index) => `Hazard ${index + 1}: ${hazard.title}, ${hazard.severity} severity.`),
    "A severity list is written up.",
    "The report is signed and ready.",
  ],
  contract: [
    `${contract.title} from ${contract.vendor}.`,
    "Risky clause found: automatic renewal.",
    contract.clauses[1].risk ?? "",
    "Risky clause found: price changes.",
    contract.clauses[3].risk ?? "",
    `Cancel-by deadline added to the calendar: ${contractDates.cancelBy}.`,
    "Two risks flagged and one deadline added.",
  ],
  report: [
    `${spreadsheet.file}: ${spreadsheet.rows.toLocaleString("en-US")} rows.`,
    "Reading the file.",
    ...spreadsheet.stats.map(({ label, value }) => `${label}: ${value}.`),
    "A chart of orders by month.",
    "A one-page report is ready.",
  ],
};

export default function CustomAiDemo({ formPath }: DemoProps) {
  const [tool, setTool] = useState<ToolId>("quote");
  const [frameRef, demo] = useDemo({ service: "custom-ai", durations: durations[tool] });
  const sizes = demoSizes["custom-ai"];

  return (
    <DemoFrame
      frameRef={frameRef}
      demo={demo}
      title={demoTitles["custom-ai"]}
      formPath={formPath}
      stageClassName={sizes.stage}
      toolbarClassName={sizes.toolbar}
      captions={captionsByTool[tool]}
      toolbar={
        <div className="svc-tabs -mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
          <Segmented
            label="Pick a tool"
            wrap={false}
            value={tool}
            onChange={(id) => {
              setTool(id);
              demo.restart();
            }}
            options={tools.map(({ id, label, icon }) => ({ value: id, label, icon }))}
          />
        </div>
      }
    >
      <div className="h-full p-4 sm:p-5">
        {tool === "quote" && <VoiceToQuote demo={demo} />}
        {tool === "inspection" && <PhotoInspection demo={demo} />}
        {tool === "contract" && <ContractCheck demo={demo} />}
        {tool === "report" && <SpreadsheetReport demo={demo} />}
      </div>
    </DemoFrame>
  );
}

const two = "grid h-full grid-cols-1 content-start gap-4 lg:grid-cols-2";

function VoiceToQuote({ demo }: { demo: Demo }) {
  const typing = demo.status === "playing";
  const shownLines = demo.reached(3) ? 4 : demo.reached(2) ? 2 : 0;
  return (
    <div className={two}>
      <div className="flex flex-col gap-4">
        <Panel title="Voice note" tag={<ExampleTag />}>
          <div className="flex items-center gap-3">
            <span
              className={clsx(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border",
                demo.reached(1) ? "border-brass-400 bg-brass-400/15 text-brass-300" : "border-white/15 text-neutral-300"
              )}
            >
              <Mic aria-hidden="true" className="h-5 w-5" />
            </span>
            <span aria-hidden="true" className="flex h-8 min-w-0 flex-1 items-center gap-[3px] overflow-hidden">
              {Array.from({ length: 28 }, (_, i) => (
                <span
                  key={i}
                  className={clsx(
                    "w-[3px] rounded-full",
                    demo.reached(1) ? "bg-brass-300/80" : "bg-white/20",
                    typing && demo.step === 1 && "svc-l-wave"
                  )}
                  style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 7) * 0.1}s` }}
                />
              ))}
            </span>
            <span className="shrink-0 text-xs text-neutral-400 tabular-nums">{voiceNote.length}</span>
          </div>
          <p className="mt-3 min-h-[60px] text-[13px] leading-relaxed text-neutral-200">
            {demo.reached(1) ? (
              <>
                &ldquo;
                <TypeText key={demo.run} text={voiceNote.transcript} play={typing && demo.step === 1} duration={3400} />
                &rdquo;
              </>
            ) : (
              <span className="text-neutral-400">Press play to hear the voice note.</span>
            )}
          </p>
        </Panel>

        <Panel title="Line items found">
          <ul className="space-y-1.5 text-[13px]">
            {quoteTotals.lines.slice(0, shownLines).map((line) => (
              <li key={line.item} className="svc-enter flex justify-between gap-3 rounded-md bg-white/[0.04] px-2.5 py-1.5">
                <span className="text-white">{line.item}</span>
                <span className="shrink-0 text-neutral-300 tabular-nums">
                  {line.qty} {line.unit}
                </span>
              </li>
            ))}
            {shownLines === 0 && <li className="text-neutral-400">Pulled from the transcript.</li>}
          </ul>
        </Panel>
      </div>

      <div
        className={clsx(
          "relative rounded-xl border bg-[#f6f5f2] p-5 text-[#1b1c1f] transition-opacity duration-500 motion-reduce:transition-none",
          demo.reached(4) ? "border-brass-400/50 opacity-100" : "border-white/10 opacity-40"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold">{voiceNote.business}</p>
            <p className="text-[11px] text-[#5b5e66]">Quote {voiceNote.quoteNumber} · For {voiceNote.customer}</p>
          </div>
          <span className="rounded border border-[#c9c6c2] px-1.5 py-px text-[10px] font-semibold tracking-wider text-[#5b5e66] uppercase">
            Example rates
          </span>
        </div>
        <table className="mt-4 w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#d8d6d1] text-left text-[10px] tracking-wider text-[#5b5e66] uppercase">
              <th scope="col" className="pb-1.5 font-semibold">Item</th>
              <th scope="col" className="pb-1.5 text-right font-semibold">Qty</th>
              <th scope="col" className="hidden pb-1.5 text-right font-semibold sm:table-cell">Rate</th>
              <th scope="col" className="pb-1.5 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {quoteTotals.lines.map((line) => (
              <tr key={line.item} className="border-b border-[#e7e5e1]">
                <td className="py-1.5 pr-2">{line.item}</td>
                <td className="py-1.5 pr-2 text-right tabular-nums">{line.qty}</td>
                <td className="hidden py-1.5 text-right tabular-nums sm:table-cell">{money(line.rate)}</td>
                <td className="py-1.5 text-right tabular-nums">{money(line.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="mt-3 ml-auto w-48 space-y-1 text-[12px] tabular-nums">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(quoteTotals.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Tax ({voiceNote.taxRate * 100}%)</dt><dd>{money(quoteTotals.tax)}</dd></div>
          <div className="flex justify-between border-t border-[#d8d6d1] pt-1 text-sm font-bold"><dt>Total</dt><dd>{money(quoteTotals.total)}</dd></div>
        </dl>
        {demo.reached(5) && (
          <p className="svc-enter mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-[#0f6b4a]">
            <BadgeCheck aria-hidden="true" className="h-4 w-4" />
            Saved as PDF · ready to send
          </p>
        )}
      </div>
    </div>
  );
}

const severityStyle = {
  High: "bg-red-400 text-neutral-950",
  Medium: "bg-yellow-400 text-neutral-950",
  Low: "bg-emerald-400 text-neutral-950",
} as const;

/** The detection box drawn round each hazard on the photo. */
const severityBox = {
  High: "border-red-400 bg-red-400/15",
  Medium: "border-yellow-400 bg-yellow-400/10",
  Low: "border-emerald-400 bg-emerald-400/10",
} as const;

function PhotoInspection({ demo }: { demo: Demo }) {
  const pins = hazards.filter((_, index) => demo.reached(2 + index));
  const scanning = demo.step === 1 && demo.status === "playing";
  return (
    <div className={two}>
      {/* The photo's box is its own 16:9, so the pins' percentages land on
          the ladder, the roof and the gutter at any width. */}
      <div className="relative aspect-[16/9] self-start overflow-hidden rounded-xl border border-white/10">
        <Photo src={inspectionPhoto.src} alt={inspectionPhoto.alt} className="absolute inset-0 h-full w-full object-cover" />
        <span className="absolute top-2 left-2 rounded bg-[#000]/60 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#fff] uppercase">
          Example photo
        </span>
        <span className="absolute right-2 bottom-2 rounded bg-[#000]/60 px-1.5 py-0.5 font-mono text-[10px] text-[#fff]/80">
          IMG_2071.jpg
        </span>
        {scanning && (
          <span aria-hidden="true" className="svc-scan absolute inset-x-0 h-0.5 bg-brass-300 shadow-[0_0_12px_2px_rgb(var(--gold)/0.6)]" />
        )}
        {pins.map((hazard) => {
          const number = hazards.indexOf(hazard) + 1;
          return (
            <span
              key={hazard.title}
              className={clsx("svc-enter absolute rounded-md border-2", severityBox[hazard.severity])}
              style={{ left: `${hazard.x}%`, top: `${hazard.y}%`, width: `${hazard.w}%`, height: `${hazard.h}%` }}
            >
              <span
                className={clsx(
                  "absolute -top-3 -left-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ring-2 ring-[#fff]",
                  severityStyle[hazard.severity]
                )}
              >
                <span className="sr-only">Hazard </span>
                {number}
              </span>
            </span>
          );
        })}
      </div>

      <Panel
        title={
          <span className="flex items-center gap-1.5">
            <ScanSearch aria-hidden="true" className="h-3.5 w-3.5 text-brass-400" />
            Inspection report
          </span>
        }
        tag={<ExampleTag />}
      >
        <ol className="space-y-2 text-[13px]">
          {hazards.map((hazard, index) => {
            const shown = demo.reached(2 + index);
            return (
              <li
                key={hazard.title}
                className={clsx(
                  "flex items-start gap-2.5 rounded-md px-2.5 py-2",
                  shown ? "svc-enter bg-white/[0.04]" : "opacity-30"
                )}
              >
                <span className={clsx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold", severityStyle[hazard.severity])}>
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 text-white">{shown ? hazard.title : "Checking…"}</span>
                {shown && (
                  <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-neutral-300">
                    <TriangleAlert aria-hidden="true" className="h-3.5 w-3.5" />
                    {hazard.severity}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-[12px] text-neutral-400">
          {demo.reached(5)
            ? "1 high, 1 medium, 1 low. Fix the high one before work starts."
            : "Each issue is numbered on the photo and ranked by severity."}
        </p>
        {demo.reached(6) && (
          <span className="svc-enter mt-3 inline-block rotate-[-4deg] rounded-md border-2 border-emerald-400/80 px-3 py-1 text-xs font-bold tracking-wider text-emerald-300 uppercase">
            Signed report
          </span>
        )}
      </Panel>
    </div>
  );
}

function ContractCheck({ demo }: { demo: Demo }) {
  const highlight = (id: string) =>
    (id === "renewal" && demo.reached(1)) || (id === "pricing" && demo.reached(3));
  const explain = (id: string) =>
    (id === "renewal" && demo.reached(2)) || (id === "pricing" && demo.reached(4));
  return (
    <div className={two}>
      <div className="rounded-xl border border-white/10 bg-[#f6f5f2] p-5 text-[#1b1c1f]">
        <p className="text-sm font-bold">{contract.title}</p>
        <p className="text-[11px] text-[#5b5e66]">{contract.vendor} · Sample contract</p>
        <ol className="mt-3 space-y-2 text-[12px] leading-relaxed">
          {contract.clauses.map((clause) => (
            <li
              key={clause.id}
              className={clsx(
                "rounded px-1.5 py-1 transition-colors duration-500 motion-reduce:transition-none",
                highlight(clause.id) && "bg-[#f3d98b] ring-1 ring-[#c9a227]"
              )}
            >
              {clause.text}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-4">
        <Panel
          title={
            <span className="flex items-center gap-1.5">
              <TriangleAlert aria-hidden="true" className="h-3.5 w-3.5 text-brass-400" />
              In plain English
            </span>
          }
          tag={<ExampleTag>Not legal advice</ExampleTag>}
        >
          <ul className="space-y-2 text-[13px] leading-snug">
            {contract.clauses.filter((clause) => "risk" in clause).map((clause) =>
              explain(clause.id) ? (
                <li key={clause.id} className="svc-enter rounded-md bg-white/[0.04] px-2.5 py-2 text-white">
                  {"risk" in clause && clause.risk}
                </li>
              ) : null
            )}
            {!demo.reached(2) && <li className="text-neutral-400">Risky clauses are explained here.</li>}
          </ul>
        </Panel>

        <Panel
          title={
            <span className="flex items-center gap-1.5">
              <CalendarClock aria-hidden="true" className="h-3.5 w-3.5 text-brass-400" />
              {contractDates.month}
            </span>
          }
        >
          <MiniMonth marked={demo.reached(5)} />
          <p className="mt-2 text-[12px] text-neutral-300">
            {demo.reached(5)
              ? `Cancel by ${contractDates.cancelBy} to stop it renewing on ${contractDates.renewal}. Reminder set.`
              : "Deadlines from the contract land here."}
          </p>
        </Panel>
      </div>
    </div>
  );
}

function MiniMonth({ marked }: { marked: boolean }) {
  const cells = [
    ...Array.from({ length: contractDates.firstWeekday }, () => null),
    ...Array.from({ length: contractDates.daysInMonth }, (_, i) => i + 1),
  ];
  return (
    <div className="grid grid-cols-7 gap-1 text-center text-[11px]" aria-hidden="true">
      {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
        <span key={i} className="text-neutral-400">{day}</span>
      ))}
      {cells.map((day, i) => (
        <span
          key={i}
          className={clsx(
            "rounded py-0.5 tabular-nums",
            day === contractDates.day && marked ? "svc-enter bg-brass-400 font-bold text-neutral-950" : "text-neutral-300"
          )}
        >
          {day ?? ""}
        </span>
      ))}
    </div>
  );
}

function SpreadsheetReport({ demo }: { demo: Demo }) {
  const reading = demo.step === 1 && demo.status === "playing";
  const max = Math.max(...spreadsheet.monthly);
  return (
    <div className={two}>
      <div className="flex flex-col gap-4">
        <Panel title="Your file" tag={<ExampleTag />}>
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3">
            <FileSpreadsheet aria-hidden="true" className="h-8 w-8 shrink-0 text-emerald-400" strokeWidth={1.5} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-white">{spreadsheet.file}</span>
              <span className="block text-[12px] text-neutral-400">
                {spreadsheet.rows.toLocaleString("en-US")} rows · {spreadsheet.size}
              </span>
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <span
              className={clsx(
                "block h-full origin-left rounded-full bg-brass-400",
                reading ? "svc-reel-fast" : demo.reached(1) ? "w-full" : "w-0"
              )}
              style={reading ? { animationDuration: "2.8s", animationIterationCount: 1 } : undefined}
            />
          </div>
          <p className="mt-2 text-[12px] text-neutral-400">
            {demo.reached(2) ? "Read in full." : demo.reached(1) ? "Reading every row…" : "Too big to open in a spreadsheet app."}
          </p>
        </Panel>

        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {spreadsheet.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={clsx(
                "rounded-lg border px-3 py-2.5",
                demo.reached(2 + index) ? "svc-enter border-brass-400/40 bg-brass-400/[0.06]" : "border-white/10 opacity-40"
              )}
            >
              <dt className="text-[11px] text-neutral-400">{stat.label}</dt>
              <dd className="mt-0.5 text-[15px] font-bold text-white">{demo.reached(2 + index) ? stat.value : "—"}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Panel title="Orders by month, in thousands" className="min-w-0">
        <figure>
          <svg viewBox="0 0 300 160" className="block h-auto w-full" role="img" aria-label="Bar chart of orders by month">
            <line x1="0" y1="140" x2="300" y2="140" stroke="rgb(var(--ink) / 0.15)" strokeWidth="1" />
            {spreadsheet.monthly.map((value, index) => {
              const height = demo.reached(5) ? (value / max) * 120 : 0;
              const x = index * 25 + 3;
              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={140 - height}
                    width={19}
                    height={height}
                    rx={4}
                    className="fill-brass-400 transition-[height,y] duration-700 ease-out motion-reduce:transition-none"
                  >
                    <title>{`${spreadsheet.months[index]}: ${value}k orders`}</title>
                  </rect>
                  <text x={x + 9.5} y={154} textAnchor="middle" className="fill-neutral-400 text-[8px]">
                    {spreadsheet.months[index].charAt(0)}
                  </text>
                </g>
              );
            })}
            {demo.reached(5) && (
              <text x={11 * 25 + 12.5} y={140 - 120 - 5} textAnchor="middle" className="fill-white text-[9px] font-semibold">
                {spreadsheet.monthly[11]}k
              </text>
            )}
          </svg>
          <figcaption className="sr-only">
            {spreadsheet.months.map((month, index) => `${month} ${spreadsheet.monthly[index]} thousand`).join(", ")}
          </figcaption>
        </figure>
        <p className="mt-2 text-[12px] text-neutral-300">
          {demo.reached(6)
            ? "One-page report ready to share. Busiest stretch: the last two months."
            : demo.reached(5)
              ? "Busiest stretch: the last two months."
              : "Drawn from every row once the file is read."}
        </p>
      </Panel>
    </div>
  );
}
