"use client";

import { useMemo, useSyncExternalStore } from "react";
import { CalendarDays } from "lucide-react";
import clsx from "clsx";
import {
  callParts,
  callTypes,
  upcomingCallDays,
  type CallChoice,
} from "@/lib/call-request";

const noop = () => () => {};

/** True in the browser once hydrated. The days are the visitor's own, so they
 *  are never rendered on the server. */
function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}

const legendClass = "mb-2.5 block text-sm font-semibold text-neutral-200";

/** A radio drawn as a tappable chip. The input stays in the DOM (visually
 *  hidden) so arrow keys, focus and screen readers work as for any radio. */
function Chip({
  name,
  value,
  checked,
  onChange,
  id,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="relative block cursor-pointer">
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={clsx(
          "flex min-h-11 flex-col items-center justify-center whitespace-nowrap rounded-lg border px-1.5 py-2 text-center text-sm transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-brass-400/60",
          checked
            ? "border-brass-400 bg-brass-400/15 font-semibold text-white"
            : "border-white/10 text-neutral-300 hover:border-white/25",
        )}
      >
        {children}
      </span>
    </label>
  );
}

/**
 * "Book a call", near the end of the contact and inquiry forms (the owner's
 * request, 2026-10-23). Off by default; turned on, the visitor picks a day in
 * the next two weeks, a part of the day if they like, and phone or video, and
 * the owner gets back to them with a specific time. lib/call-request.ts has
 * the rules and the email wording.
 *
 * `idPrefix` keeps ids unique per form; the first day is
 * `${idPrefix}-call`, and every day posts under the name "call", so a form
 * can move focus to the day when it's missing.
 */
export function BookCallPicker({
  idPrefix,
  value,
  onChange,
  error,
}: {
  idPrefix: string;
  value: CallChoice;
  onChange: (next: CallChoice) => void;
  error?: string;
}) {
  const isClient = useIsClient();
  const days = useMemo(
    () => (isClient && value.wanted ? upcomingCallDays() : []),
    [isClient, value.wanted],
  );
  const set = (patch: Partial<CallChoice>) => onChange({ ...value, ...patch });
  const titleId = `${idPrefix}-call-title`;
  const errorId = `${idPrefix}-call-error`;

  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <CalendarDays
            className="mt-0.5 h-5 w-5 shrink-0 text-brass-400"
            aria-hidden="true"
          />
          <div>
            <p id={titleId} className="font-semibold text-white">
              Book a call
            </p>
            <p className="mt-0.5 text-sm text-neutral-400">
              Pick a day and we&apos;ll get back to you with a specific time.
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={value.wanted}
          aria-labelledby={titleId}
          onClick={() => set({ wanted: !value.wanted })}
          className={clsx(
            "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-400/60",
            value.wanted
              ? "border-brass-400 bg-brass-400"
              : "border-white/15 bg-neutral-800",
          )}
        >
          <span
            aria-hidden="true"
            className={clsx(
              "inline-block h-5 w-5 rounded-full bg-[#fff] shadow transition-transform duration-200",
              value.wanted ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      </div>

      {value.wanted && (
        <div className="mt-5 space-y-5 border-t border-white/10 pt-5">
          <fieldset aria-describedby={error ? errorId : undefined}>
            <legend className={legendClass}>
              Which day?{" "}
              <span className="text-brass-300" aria-hidden="true">
                *
              </span>
            </legend>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2 sm:grid-cols-7">
              {days.map((day, i) => (
                <Chip
                  key={day.value}
                  id={i === 0 ? `${idPrefix}-call` : undefined}
                  name="call"
                  value={day.value}
                  checked={value.day === day.value}
                  onChange={() => set({ day: day.value })}
                >
                  <span className="text-xs uppercase tracking-wide opacity-80">
                    {day.weekday}
                  </span>
                  <span>{day.date}</span>
                </Chip>
              ))}
            </div>
            {error && (
              <p id={errorId} role="alert" className="mt-2 text-sm text-red-400">
                {error}
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend className={legendClass}>
              Time of day{" "}
              <span className="font-normal text-neutral-400">(optional)</span>
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {callParts.map((part) => (
                <Chip
                  key={part.value || "any"}
                  name={`${idPrefix}-call-part`}
                  value={part.value}
                  checked={value.part === part.value}
                  onChange={() => set({ part: part.value })}
                >
                  {part.label}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={legendClass}>Phone or video?</legend>
            <div className="grid grid-cols-2 gap-2">
              {callTypes.map((type) => (
                <Chip
                  key={type.value}
                  name={`${idPrefix}-call-type`}
                  value={type.value}
                  checked={value.type === type.value}
                  onChange={() => set({ type: type.value })}
                >
                  {type.label}
                </Chip>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}
