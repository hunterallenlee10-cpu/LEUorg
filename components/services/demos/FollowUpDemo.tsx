"use client";

import { useId, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, Check, Clock, MessageCircle, Send, Sun } from "lucide-react";
import { DemoFrame } from "@/components/services/demo/DemoFrame";
import { useDemo, type Demo } from "@/components/services/demo/useDemo";
import { CountUp, ExampleTag, Panel, Photo } from "@/components/services/demo/ui";
import { demoSizes, demoTitles, type DemoProps } from "@/components/services/demo/sizes";
import { leeSystemsLinks } from "@/data/lee-systems";
import { filterInput } from "@/lib/validation";
import {
  chatFaqs,
  commentToDm,
  dailySummary,
  defaultLeadName,
  followUpBusiness,
  followUpPhotos,
  followUpTexts,
  leadServices,
  otherCards,
  type LeadService,
} from "@/data/demos/follow-up";

/**
 * Follow-Up & Booking Automation: "You be the lead".
 *
 * The visitor types a first name and picks a service (kept in this
 * component's state only: nothing is sent anywhere) and presses Send. A
 * timer runs, and at 0:41 a text arrives addressed to them by name. Then the
 * follow-up plays out: a Day 2 check-in, "Yes, Friday works", the card
 * moving to Booked on a mini CRM board, a reminder, a review request and a
 * paid invoice. Alongside, the website chat answers two questions and a
 * "PRICE" comment turns into an automatic DM. It ends on the "Good morning"
 * summary, with a link to the full-week animation on /how-it-works rather
 * than repeating it.
 */

const S = {
  form: 0,
  waiting: 1,
  reply: 2,
  chat1: 3,
  dayTwo: 4,
  yes: 5,
  booked: 6,
  dm: 7,
  reminder: 8,
  review: 9,
  paid: 10,
  summary: 11,
} as const;

const durations = [700, 2600, 2800, 2400, 2600, 2400, 2400, 2800, 2400, 2400, 2600, 3000];

type Column = "new" | "contacted" | "booked" | "paid";

function stageOf(demo: Demo): Column {
  if (demo.reached(S.paid)) return "paid";
  if (demo.reached(S.booked)) return "booked";
  if (demo.reached(S.reply)) return "contacted";
  return "new";
}

export default function FollowUpDemo({ formPath }: DemoProps) {
  const [frameRef, demo] = useDemo({ service: "follow-up", durations, autoplay: false });
  const [typedName, setTypedName] = useState("");
  const [service, setService] = useState<LeadService>(leadServices[0]);
  const [nameNote, setNameNote] = useState<string | undefined>();
  const name = typedName.trim() || defaultLeadName;
  const fill = (text: string) =>
    text.replaceAll("{name}", name).replaceAll("{service}", service.toLowerCase());
  const sizes = demoSizes["follow-up"];
  const playing = demo.status === "playing";
  const showForm = demo.step === S.form && demo.status !== "playing";

  const captions = [
    "You fill out the form as the lead.",
    "A timer runs while the system writes back.",
    `At 0:41, a text arrives: ${fill(followUpTexts.firstReply)}`,
    "On the website, the chat assistant answers a question.",
    `Day 2: ${fill(followUpTexts.dayTwo)}`,
    `You reply: ${followUpTexts.leadYes}`,
    "The lead moves to Booked on the CRM board.",
    "A PRICE comment on a post becomes an automatic DM.",
    `The day before: ${followUpTexts.reminder}`,
    `After the job: ${fill(followUpTexts.review)}`,
    `${followUpTexts.paid} The lead moves to Paid.`,
    "Next morning, the owner gets a Good morning summary.",
  ];

  return (
    <DemoFrame
      frameRef={frameRef}
      demo={demo}
      title={demoTitles["follow-up"]}
      formPath={formPath}
      stageClassName={sizes.stage}
      captions={captions}
    >
      <div className="grid h-full grid-cols-1 content-start gap-4 p-4 sm:grid-cols-[260px_1fr] sm:p-5 lg:grid-cols-[260px_1fr_260px]">
        {/* The lead's phone */}
        <div className="mx-auto flex h-[460px] w-full max-w-[260px] flex-col overflow-hidden rounded-[2rem] border-[6px] border-neutral-800 bg-[var(--svc-phone)] shadow-2xl sm:row-span-2 lg:row-span-1 light:bg-[#fff]">
          <div className="flex items-center justify-center gap-2.5 border-b border-white/10 px-4 pt-6 pb-2.5">
            <Photo src={followUpPhotos.contact} className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-white/15" />
            <span className="min-w-0">
              <span className="block text-[10px] tracking-wider text-neutral-400 uppercase">Your phone</span>
              <span className="block truncate text-sm font-semibold text-white">{followUpBusiness}</span>
            </span>
          </div>

          {showForm ? (
            <LeadForm
              typedName={typedName}
              service={service}
              note={nameNote}
              onName={(value) => {
                const { value: clean, dropped } = filterInput("name", value);
                setTypedName(clean.slice(0, 20));
                setNameNote(dropped);
              }}
              onService={setService}
              onSend={demo.reduced ? demo.next : demo.play}
            />
          ) : (
            <ol aria-label="Text messages" className="flex flex-1 flex-col justify-end gap-2 overflow-hidden px-3 py-3 text-[12px] leading-snug">
              <Bubble from="you" note="Website form">
                {name}: {service}
              </Bubble>
              {demo.step === S.waiting && (
                <li className="flex items-center gap-1.5 self-start text-[11px] text-neutral-400">
                  <Clock aria-hidden="true" className="h-3 w-3" />
                  <CountUp
                    key={demo.run}
                    to={41}
                    play={playing}
                    duration={2300}
                    format={(n) => `0:${String(n).padStart(2, "0")}`}
                  />
                  <span className="flex gap-0.5" aria-hidden="true">
                    <span className="svc-dot h-1 w-1 rounded-full bg-current" />
                    <span className="svc-dot h-1 w-1 rounded-full bg-current" />
                    <span className="svc-dot h-1 w-1 rounded-full bg-current" />
                  </span>
                </li>
              )}
              {demo.reached(S.reply) && (
                <Bubble from="them" note="Replied in 0:41">
                  {fill(followUpTexts.firstReply)}
                </Bubble>
              )}
              {demo.reached(S.dayTwo) && <Divider>Day 2</Divider>}
              {demo.reached(S.dayTwo) && <Bubble from="them">{fill(followUpTexts.dayTwo)}</Bubble>}
              {demo.reached(S.yes) && <Bubble from="you">{followUpTexts.leadYes}</Bubble>}
              {demo.reached(S.booked) && <Bubble from="them">{followUpTexts.booked}</Bubble>}
              {demo.reached(S.reminder) && <Divider>Thursday</Divider>}
              {demo.reached(S.reminder) && <Bubble from="them">{followUpTexts.reminder}</Bubble>}
              {demo.reached(S.review) && <Divider>After the job</Divider>}
              {demo.reached(S.review) && <Bubble from="them">{fill(followUpTexts.review)}</Bubble>}
              {demo.reached(S.paid) && <Bubble from="them">{followUpTexts.paid}</Bubble>}
            </ol>
          )}
        </div>

        {/* The owner's side: the CRM board and the morning summary */}
        <div className="flex min-w-0 flex-col gap-4">
          <Panel title="Your CRM" tag={<ExampleTag />}>
            <Board demo={demo} name={name} service={service} />
          </Panel>

          <Panel
            title={
              <span className="flex items-center gap-1.5">
                <Sun aria-hidden="true" className="h-3.5 w-3.5 text-brass-400" />
                Daily summary
              </span>
            }
            className={clsx(
              "transition-colors duration-500 motion-reduce:transition-none",
              demo.reached(S.summary) && "border-brass-400/50"
            )}
          >
            {demo.reached(S.summary) ? (
              <div className="svc-enter">
                <p className="text-sm font-semibold text-white">Good morning. Here&apos;s yesterday:</p>
                <ul className="mt-2 space-y-1 text-[13px] text-neutral-300">
                  {dailySummary.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      {line}
                    </li>
                  ))}
                </ul>
                <Link
                  href={leeSystemsLinks.fullWeek}
                  className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brass-300 hover:text-brass-200"
                >
                  See the full week
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <p className="text-[13px] text-neutral-400">Sent to your phone at 7:00 AM.</p>
            )}
          </Panel>
        </div>

        {/* Alongside: website chat and comment-to-DM */}
        <div className="flex min-w-0 flex-col gap-4 sm:col-start-2 lg:col-start-auto">
          <Panel
            title={
              <span className="flex items-center gap-1.5">
                <MessageCircle aria-hidden="true" className="h-3.5 w-3.5 text-brass-400" />
                Website chat
              </span>
            }
          >
            <ul className="space-y-1.5 text-[12px] leading-snug">
              {chatFaqs.map((faq, index) => {
                const at = index === 0 ? S.chat1 : S.yes;
                if (!demo.reached(at)) return null;
                return (
                  <li key={faq.question} className="svc-enter space-y-1.5">
                    <p className="ml-auto w-fit max-w-[90%] rounded-lg bg-white/10 px-2.5 py-1.5 text-neutral-200">
                      {faq.question}
                    </p>
                    <p className="w-fit max-w-[90%] rounded-lg bg-brass-400/15 px-2.5 py-1.5 text-white">
                      {faq.answer}
                    </p>
                  </li>
                );
              })}
              {!demo.reached(S.chat1) && <li className="text-neutral-400">Visitors&apos; questions show here.</li>}
            </ul>
          </Panel>

          <Panel title="Post comment → DM">
            {demo.reached(S.dm) ? (
              <div className="svc-enter space-y-2 text-[12px] leading-snug">
                {/* The notification as a social app shows it: who, what, and
                    the post it was on. */}
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2px]">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                      {commentToDm.handle.charAt(1).toUpperCase()}
                    </span>
                  </span>
                  <p className="min-w-0 flex-1 text-neutral-300">
                    <span className="font-semibold text-white">{commentToDm.handle}</span> commented{" "}
                    <span className="rounded bg-white/10 px-1.5 py-px font-bold text-white">{commentToDm.comment}</span>
                  </p>
                  <Photo src={followUpPhotos.post} className="h-10 w-10 shrink-0 rounded object-cover" />
                </div>
                <p className="flex items-start gap-2">
                  <Send aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass-400" />
                  <span className="rounded-lg bg-brass-400/15 px-2.5 py-1.5 text-white">{commentToDm.dm}</span>
                </p>
              </div>
            ) : (
              <p className="text-[12px] text-neutral-400">Someone comments a keyword, and gets a DM back.</p>
            )}
          </Panel>
        </div>
      </div>
    </DemoFrame>
  );
}

/** The form on the lead's phone. The name stays on this page. */
function LeadForm({
  typedName,
  service,
  note,
  onName,
  onService,
  onSend,
}: {
  typedName: string;
  service: LeadService;
  note?: string;
  onName: (value: string) => void;
  onService: (value: LeadService) => void;
  onSend: () => void;
}) {
  const id = useId();
  const field =
    "mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-brass-400/60 focus:outline-none";
  return (
    <form
      className="flex flex-1 flex-col justify-center gap-3 px-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
    >
      <p className="text-sm font-semibold text-white">You be the lead.</p>
      <p className="text-[12px] leading-snug text-neutral-400">
        Fill this in like a real visitor and see what happens next.
      </p>
      <label className="text-[12px] font-semibold text-neutral-200" htmlFor={`${id}-name`}>
        Your first name
        <input
          id={`${id}-name`}
          value={typedName}
          onChange={(event) => onName(event.target.value)}
          placeholder={defaultLeadName}
          autoComplete="off"
          maxLength={20}
          aria-describedby={`${id}-note`}
          className={field}
        />
      </label>
      <p id={`${id}-note`} className="-mt-2 text-[11px] text-neutral-400">
        {note ?? "Stays on this page. Nothing is sent."}
      </p>
      <label className="text-[12px] font-semibold text-neutral-200" htmlFor={`${id}-service`}>
        What do you need?
        <select
          id={`${id}-service`}
          value={service}
          onChange={(event) => onService(event.target.value as LeadService)}
          className={field}
        >
          {leadServices.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn-ls-primary mt-1 inline-flex min-h-11 items-center justify-center gap-2 text-sm">
        <Send aria-hidden="true" className="h-4 w-4" />
        Send
      </button>
    </form>
  );
}

function Bubble({
  from,
  note,
  children,
}: {
  from: "you" | "them";
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <li
      className={clsx(
        "svc-enter max-w-[88%] rounded-xl px-3 py-2",
        from === "you"
          ? "self-end rounded-br-sm bg-brass-400/20 text-white"
          : "self-start rounded-bl-sm bg-white/10 text-neutral-200"
      )}
    >
      {children}
      {note && <span className="mt-0.5 block text-[10px] text-neutral-400">{note}</span>}
    </li>
  );
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <li className="svc-enter self-center text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
      {children}
    </li>
  );
}

/** Four columns; the visitor's card moves along as the story plays. */
function Board({ demo, name, service }: { demo: Demo; name: string; service: LeadService }) {
  const columns: { id: Column; label: string }[] = [
    { id: "new", label: "New lead" },
    { id: "contacted", label: "Contacted" },
    { id: "booked", label: "Booked" },
    { id: "paid", label: "Paid" },
  ];
  const yours = stageOf(demo);
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
      {columns.map((column) => (
        <div key={column.id} className="min-w-0 rounded-lg bg-white/[0.03] p-2">
          <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">{column.label}</p>
          <ul className="space-y-1.5">
            {column.id === yours && (
              <li
                key={`${column.id}-${demo.run}`}
                className="svc-enter rounded-md border border-brass-400/60 bg-brass-400/10 px-2 py-1.5 text-[11px] leading-tight"
              >
                <span className="block truncate font-semibold text-white">{name}</span>
                <span className="block truncate text-neutral-300">
                  {column.id === "booked" ? "Fri 10:00 AM" : service}
                </span>
              </li>
            )}
            {otherCards[column.id].map((card) => (
              <li key={card.name} className="rounded-md border border-white/10 px-2 py-1.5 text-[11px] leading-tight">
                <span className="block truncate font-semibold text-neutral-200">{card.name}</span>
                <span className="block truncate text-neutral-400">{card.what}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
