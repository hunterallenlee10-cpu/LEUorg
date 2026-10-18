"use client";

import { useId, useState, type CSSProperties } from "react";
import { BookCallLink } from "@/components/ui/BookCallLink";

/**
 * The homepage's calculator. It started as a missed-revenue calculator (the
 * owner's ask, 2026-10-06, after a car-payment estimator they liked) and now
 * folds in the "economic impact" time-saved calculator the owner also liked
 * (2026-10-09): one card, with a switch for each part so a visitor counts
 * only what fits their business.
 *
 * - Missed calls: calls an AI assistant would answer.
 * - Website leads: extra leads from a site that turns visitors into leads.
 * - Busywork: repetitive hours automations take off the team, and what those
 *   hours cost in pay. Automations take all of it (the owner's ask,
 *   2026-10-14: the pitch is that automations can take over all the work),
 *   so there is no "share automated" slider.
 *
 * It works out what the visitor is missing, never a price, because Lee
 * Systems Co. quotes every project on the call. The math is spelled out in
 * the note under it, and every number in it is one the visitor chose.
 *
 * The defaults and ranges are below in one place so the owner can tune them.
 * The styling is `.calc-*` in app/globals.css.
 */

const WEEKS_PER_MONTH = 52 / 12;

type FieldKey =
  | "callsPerWeek"
  | "missedPct"
  | "visitors"
  | "extraPer100"
  | "jobValue"
  | "closePct"
  | "teamSize"
  | "repetitiveHours"
  | "hourlyRate";

type FieldSpec = {
  label: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  format: (value: number) => string;
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const count = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const fields: Record<FieldKey, FieldSpec> = {
  callsPerWeek: {
    label: "Calls a week",
    min: 5,
    max: 200,
    step: 5,
    initial: 40,
    format: (v) => count.format(v),
  },
  missedPct: {
    label: "Calls that go unanswered",
    min: 0,
    max: 60,
    step: 1,
    initial: 20,
    format: (v) => `${v}%`,
  },
  visitors: {
    label: "Website visitors a month",
    min: 100,
    max: 10000,
    step: 100,
    initial: 1000,
    format: (v) => count.format(v),
  },
  extraPer100: {
    label: "Extra leads per 100 visitors",
    min: 0.5,
    max: 5,
    step: 0.5,
    initial: 1,
    format: (v) => `+${v}`,
  },
  jobValue: {
    label: "Average job value",
    min: 100,
    max: 10000,
    step: 50,
    initial: 500,
    format: (v) => usd.format(v),
  },
  closePct: {
    label: "Leads you turn into customers",
    min: 10,
    max: 80,
    step: 5,
    initial: 30,
    format: (v) => `${v}%`,
  },
  teamSize: {
    label: "People on your team",
    min: 1,
    max: 50,
    step: 1,
    initial: 3,
    format: (v) => count.format(v),
  },
  repetitiveHours: {
    label: "Repetitive hours a week, each",
    min: 1,
    max: 40,
    step: 1,
    initial: 5,
    format: (v) => `${v} hrs`,
  },
  hourlyRate: {
    label: "Average hourly pay",
    min: 15,
    max: 150,
    step: 5,
    initial: 30,
    format: (v) => usd.format(v),
  },
};

type Part = "calls" | "website" | "busywork";

const parts: { value: Part; label: string; hint: string }[] = [
  { value: "website", label: "Website leads", hint: "A site that turns visitors into leads" },
  { value: "busywork", label: "Busywork", hint: "Automations take repetitive tasks" },
  { value: "calls", label: "Missed calls", hint: "An AI assistant answers every one" },
];

const initialValues = Object.fromEntries(
  Object.entries(fields).map(([key, spec]) => [key, spec.initial])
) as Record<FieldKey, number>;

// Every part starts off (the owner's ask, 2026-10-10), so the visitor picks
// what fits before any number shows.
const initialOn: Record<Part, boolean> = { calls: false, website: false, busywork: false };

export function MissedRevenueCalculator({
  headless = false,
}: {
  /** The section around it already shows "See what you're missing" as its
   * heading: the card's own title and line are then read to screen readers
   * only, and still name the group. */
  headless?: boolean;
} = {}) {
  const id = useId();
  const [on, setOn] = useState(initialOn);
  const [values, setValues] = useState(initialValues);

  const close = values.closePct / 100;
  const missedCalls = values.callsPerWeek * WEEKS_PER_MONTH * (values.missedPct / 100);
  const extraLeads = values.visitors * (values.extraPer100 / 100);
  const hoursBack = values.teamSize * values.repetitiveHours * WEEKS_PER_MONTH;

  const lines = [
    on.website && {
      key: "website",
      label: "Website leads",
      detail: `${count.format(extraLeads)} more a month`,
      amount: extraLeads * close * values.jobValue,
    },
    on.busywork && {
      key: "busywork",
      label: "Busywork",
      detail: `${count.format(hoursBack)} hrs back a month`,
      amount: hoursBack * values.hourlyRate,
    },
    on.calls && {
      key: "calls",
      label: "Missed calls",
      detail: `${count.format(missedCalls)} a month answered`,
      amount: missedCalls * close * values.jobValue,
    },
  ].filter((line) => line !== false);

  const monthly = lines.reduce((sum, line) => sum + line.amount, 0);
  const anyOn = lines.length > 0;

  const groups = [
    on.calls && { group: "Your calls", keys: ["callsPerWeek", "missedPct"] as FieldKey[] },
    on.website && { group: "Your website", keys: ["visitors", "extraPer100"] as FieldKey[] },
    (on.calls || on.website) && {
      group: "Your jobs",
      keys: ["jobValue", "closePct"] as FieldKey[],
    },
    on.busywork && {
      group: "Your team",
      keys: ["teamSize", "repetitiveHours", "hourlyRate"] as FieldKey[],
    },
  ].filter((group) => group !== false);

  return (
    <div className="calc" role="group" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className={headless ? "sr-only" : "calc-title"}>
        See what you&apos;re missing
      </h3>
      <p className={headless ? "sr-only" : "calc-sub"}>
        Switch on what fits your business, then slide in your numbers. It&apos;s quick math,
        not a quote.
      </p>

      <div className="calc-result">
        <p className="calc-result-label">What it could be worth to you</p>
        <p className="calc-result-value" aria-live="polite" aria-atomic="true">
          {usd.format(monthly)}
          <small>/mo</small>
        </p>
        {anyOn ? (
          <>
            <p className="calc-result-detail">
              About <b>{usd.format(monthly * 12)} a year</b>
              {on.busywork && (
                <>
                  , and <b>{count.format(hoursBack * 12)} hours</b> of your team&apos;s time back
                </>
              )}
              .
            </p>
            <ul className="calc-breakdown">
              {lines.map((line) => (
                <li key={line.key}>
                  <span className="calc-breakdown-label">
                    {line.label}
                    <small>{line.detail}</small>
                  </span>
                  <span className="calc-breakdown-amount">{usd.format(line.amount)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="calc-result-detail">Switch on a part below to see your numbers.</p>
        )}
        <BookCallLink variant="glow" arrow />
      </div>

      <div className="calc-parts" role="group" aria-label="What to count">
        {parts.map((part) => (
          <button
            key={part.value}
            type="button"
            role="switch"
            aria-checked={on[part.value]}
            className="calc-part"
            onClick={() => setOn((current) => ({ ...current, [part.value]: !current[part.value] }))}
          >
            <span className="calc-part-text">
              <span className="calc-part-label">{part.label}</span>
              <span className="calc-part-hint">{part.hint}</span>
            </span>
            <span className="calc-switch" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="calc-fields">
        {groups.map(({ group, keys }) => (
          <div key={group}>
            <p className="calc-group">{group}</p>
            {keys.map((key) => {
              const spec = fields[key];
              const value = values[key];
              const inputId = `${id}-${key}`;
              const fill = ((value - spec.min) / (spec.max - spec.min)) * 100;
              return (
                <div key={key} className="calc-field">
                  <div className="calc-field-head">
                    <label htmlFor={inputId}>{spec.label}</label>
                    <output htmlFor={inputId}>{spec.format(value)}</output>
                  </div>
                  <input
                    id={inputId}
                    type="range"
                    className="calc-range"
                    min={spec.min}
                    max={spec.max}
                    step={spec.step}
                    value={value}
                    aria-valuetext={spec.format(value)}
                    style={{ "--fill": `${fill}%` } as CSSProperties}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [key]: Number(event.target.value),
                      }))
                    }
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="calc-note">
        {on.calls && "Missed calls = calls a week × 4.33 × the share that go unanswered. "}
        {on.website && "Website leads = visitors × the extra leads per 100 you set. "}
        {(on.calls || on.website) &&
          "Each is then × the share you turn into customers × your average job. "}
        {on.busywork &&
          "Busywork = people × repetitive hours a week × 4.33, × their hourly pay. "}
        Estimate only, from the numbers you entered. Not a quote or a promise of results.
      </p>
    </div>
  );
}
