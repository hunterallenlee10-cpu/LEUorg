/**
 * "Book a call" on the contact and inquiry forms (the owner's request,
 * 2026-10-23): a switch that, turned on, has the visitor pick a day in the
 * next two weeks, a part of the day if they like, and phone or video. Nobody
 * picks a time; the owner emails or texts one back.
 *
 * Shared by the forms (components/forms/BookCallPicker.tsx) and the routes
 * that email them (app/api/contact, app/api/lee-systems-inquiry), so the two
 * sides check the same rules and the email says what the visitor saw.
 */

/** How many days can be picked, starting tomorrow. Weekends included. */
export const CALL_DAY_COUNT = 14;

export const callParts = [
  { value: "", label: "Any time" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
] as const;

export const callTypes = [
  { value: "phone", label: "Phone call" },
  { value: "video", label: "Video call" },
] as const;

export type CallPart = (typeof callParts)[number]["value"];
export type CallType = (typeof callTypes)[number]["value"];

/** What the form posts as `call` when the switch is on. */
export interface CallRequest {
  /** The day in the visitor's own calendar, "YYYY-MM-DD". */
  day: string;
  part: CallPart;
  type: CallType;
  /** The visitor's time zone, e.g. "America/New_York", so the time sent back
   *  is in theirs. Empty if the browser didn't say. */
  timeZone: string;
}

/** The switch, plus what it's set to. The form's own state. */
export interface CallChoice extends CallRequest {
  wanted: boolean;
}

export const emptyCallChoice = (wanted = false): CallChoice => ({
  wanted,
  day: "",
  part: "",
  type: "phone",
  timeZone: "",
});

export const CALL_DAY_ERROR = "Please pick a day for your call.";

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" for a date, read in the local calendar. */
const localKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** The days a visitor can pick: tomorrow and the 13 after it, in their own
 *  calendar. Browser only, since "tomorrow" is the visitor's. */
export function upcomingCallDays(from = new Date()) {
  return Array.from({ length: CALL_DAY_COUNT }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i + 1);
    return {
      value: localKey(d),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });
}

/** A "YYYY-MM-DD" as a UTC midnight, or null if it isn't a real date. */
function parseDay(day: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return localKeyUTC(d) === day ? d : null;
}

const localKeyUTC = (d: Date) =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

const dayFormats = {
  /** "Tuesday, October 28, 2026", for the email. */
  long: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  /** "Tuesday, October 28", for the visitor. */
  medium: { weekday: "long", month: "long", day: "numeric" },
  /** "Tue, Oct 28", for the subject line. */
  short: { weekday: "short", month: "short", day: "numeric" },
} as const;

/** A picked day in words. The date is the visitor's calendar day, so it's
 *  formatted as written, in UTC. */
export function formatCallDay(day: string, style: keyof typeof dayFormats = "long") {
  const d = parseDay(day);
  if (!d) return day;
  return d.toLocaleDateString("en-US", { ...dayFormats[style], timeZone: "UTC" });
}

/** What the form posts: the call details when the switch is on, else null. */
export function callPayload(choice: CallChoice): CallRequest | null {
  if (!choice.wanted) return null;
  let timeZone = "";
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    // Left empty; the email says so.
  }
  return { day: choice.day, part: choice.part, type: choice.type, timeZone };
}

/**
 * Checks a posted `call` on the server. No call (the switch off) is fine.
 * The day has to fall in the window the form offers; a day either side is
 * allowed for visitors whose calendar is ahead of or behind the server's.
 */
export function readCallRequest(
  raw: unknown,
  now = new Date(),
): { call: CallRequest | null; error?: string } {
  if (raw === null || raw === undefined) return { call: null };
  if (typeof raw !== "object") return { call: null, error: CALL_DAY_ERROR };
  const body = raw as Record<string, unknown>;

  const day = typeof body.day === "string" ? body.day.trim() : "";
  const date = parseDay(day);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const offset = date ? Math.round((date.getTime() - today) / 86_400_000) : NaN;
  if (!date || offset < 0 || offset > CALL_DAY_COUNT + 1) {
    return { call: null, error: CALL_DAY_ERROR };
  }

  const part = callParts.find((p) => p.value === body.part)?.value ?? "";
  const type = callTypes.find((t) => t.value === body.type)?.value ?? "phone";
  const zone = typeof body.timeZone === "string" ? body.timeZone.trim() : "";
  const timeZone = /^[A-Za-z0-9_+\-/]{1,64}$/.test(zone) ? zone : "";

  return { call: { day, part, type, timeZone } };
}

/** Added to the end of the email's subject, after the subject it always had,
 *  so inbox filters on the start of the subject keep working. */
export function callSubjectSuffix(call: CallRequest | null) {
  return call ? ` | Call request: ${formatCallDay(call.day, "short")}` : "";
}

/** The block the email carries when a call was asked for. */
export function callEmailBlock(call: CallRequest | null, phone: string) {
  if (!call) return "";
  const part = callParts.find((p) => p.value === call.part)?.label ?? "Any time";
  const type =
    call.type === "video"
      ? "Video call (send them a meeting link with the time)"
      : `Phone call (call them on ${phone})`;
  return `

CALL REQUESTED: email or text them a specific time on this day.
Day: ${formatCallDay(call.day)}
Time of day: ${part}
Call type: ${type}
Their time zone: ${call.timeZone || "Not given"}`;
}

/** The thank-you line after a call request. */
export function callConfirmation(call: CallRequest, replyTime: string) {
  const part = call.part ? ` in the ${call.part}` : "";
  const when = replyTime ? ` ${replyTime}` : " soon";
  const what = call.type === "video" ? "a specific time and a video link" : "a specific time";
  return `We'll email or text you${when} with ${what} for ${formatCallDay(call.day, "medium")}${part}.`;
}
