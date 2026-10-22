/**
 * The Follow-Up demo's made-up business and messages (components/services/
 * demos/FollowUpDemo.tsx). `{name}` and `{service}` are filled in with what
 * the visitor typed and picked; neither leaves the page.
 */

import { demoImages } from "@/data/demos/images";

export const followUpBusiness = "Ridgeline Roofing";

/** The business's contact photo on the lead's phone, and the post the
 *  PRICE comment was left on (data/demos/images.ts). */
export const followUpPhotos = {
  contact: demoImages.homeServices,
  post: demoImages.houseDusk,
} as const;

/** Used when the visitor presses Play without typing a name. */
export const defaultLeadName = "Alex";

export const leadServices = ["Roof inspection", "Gutter repair", "Storm damage"] as const;
export type LeadService = (typeof leadServices)[number];

export const followUpTexts = {
  firstReply:
    "Hi {name}, this is Ridgeline Roofing. Thanks for asking about {service}! Would a free visit this week work for you?",
  dayTwo: "Just checking in, {name}. I have Friday at 10:00 AM open. Want it?",
  leadYes: "Yes, Friday works.",
  booked: "You're booked for Friday at 10:00 AM. See you then!",
  reminder: "Reminder: we'll see you tomorrow at 10:00 AM. Reply C to confirm.",
  review: "Thanks for choosing us, {name}! Would you leave a quick review? It helps a lot.",
  paid: "Invoice #1042 is paid. Thank you!",
} as const;

export const chatFaqs = [
  {
    question: "Do you give free estimates?",
    answer: "Yes. Inspections and estimates are free. Want to pick a time?",
  },
  {
    question: "Are you insured?",
    answer: "Yes, licensed and insured. We can send proof with your estimate.",
  },
] as const;

export const commentToDm = {
  handle: "@jamie.fixes.things",
  comment: "PRICE",
  dm: "Hey Jamie! Here's our price guide for roof repairs. Want a free inspection?",
};

/** Other made-up cards on the CRM board, so it looks like a real week. */
export const otherCards = {
  new: [{ name: "Morgan K.", what: "Gutter repair" }],
  contacted: [{ name: "Chris L.", what: "Storm damage" }],
  booked: [{ name: "Taylor B.", what: "Roof inspection" }],
  paid: [{ name: "Dana W.", what: "Roof repair" }],
} as const;

export const dailySummary = [
  "3 new leads, each replied to in under a minute",
  "2 jobs booked",
  "1 review request sent",
  "Invoice #1042 paid",
] as const;
