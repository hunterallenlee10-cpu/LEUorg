/**
 * The AI Call Answering demo's four calls (components/services/demos/
 * AiCallsDemo.tsx). Every business, caller and number is made up; numbers
 * use the 555 exchange. Optional recordings go in
 * public/demos/calls/<id>.mp3 (lib/demo-assets.ts finds them at build time);
 * the transcript here is shown either way.
 */

import { demoImages } from "@/data/demos/images";

export const callScenarioIds = ["ac-repair", "law", "gym", "restaurant"] as const;
export type CallScenarioId = (typeof callScenarioIds)[number];

export interface CallScenario {
  id: CallScenarioId;
  /** The picker's label. */
  label: string;
  business: string;
  /** Behind the ringing screen and beside the business's name. */
  photo: string;
  caller: string;
  callerPhone: string;
  /** Who says what, in order. `ai` is the assistant. */
  lines: readonly { from: "ai" | "caller"; text: string }[];
  calendar: {
    day: string;
    slots: readonly string[];
    /** Which slot the call books. */
    booked: number;
    /** What the booked slot says. */
    what: string;
  };
  /** The confirmation text the caller gets. */
  text: string;
}

export const callScenarios: readonly CallScenario[] = [
  {
    id: "ac-repair",
    label: "AC repair",
    business: "Cool Breeze Heating & Air",
    photo: demoImages.acUnit,
    caller: "Dana W.",
    callerPhone: "(555) 010-4471",
    lines: [
      { from: "ai", text: "Thanks for calling Cool Breeze Heating & Air. How can I help tonight?" },
      { from: "caller", text: "My AC stopped blowing cold air and it's 85 degrees in here." },
      { from: "ai", text: "Sorry about that. Is the outdoor unit running, or is it off?" },
      { from: "caller", text: "It's running, but the air inside is warm." },
      { from: "ai", text: "I can get a technician to you tomorrow at 8:00 AM or 1:30 PM. Which works?" },
      { from: "caller", text: "8 AM, please." },
      { from: "ai", text: "You're booked for 8:00 AM tomorrow. I'm texting you a confirmation now." },
    ],
    calendar: {
      day: "Tomorrow",
      slots: ["8:00 AM", "10:30 AM", "1:30 PM", "4:00 PM"],
      booked: 0,
      what: "AC repair · Dana W.",
    },
    text: "Cool Breeze: You're booked for an AC repair visit tomorrow at 8:00 AM. Reply C to confirm or R to reschedule.",
  },
  {
    id: "law",
    label: "Law consultation",
    business: "Hartwell Injury Law",
    photo: demoImages.law,
    caller: "Marcus T.",
    callerPhone: "(555) 010-2286",
    lines: [
      { from: "ai", text: "Hartwell Injury Law. How can I help?" },
      { from: "caller", text: "I was rear-ended on the way home tonight. I think I need a lawyer." },
      { from: "ai", text: "I'm sorry that happened. Are you safe, and have you been checked for injuries?" },
      { from: "caller", text: "I'm okay, just sore. I went to urgent care." },
      { from: "ai", text: "An attorney can go over it with you in a free consultation. I have 10:00 AM or 3:00 PM tomorrow." },
      { from: "caller", text: "10 works." },
      { from: "ai", text: "You're booked with an attorney at 10:00 AM. I'm texting you a confirmation and a short intake form." },
    ],
    calendar: {
      day: "Tomorrow",
      slots: ["9:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"],
      booked: 1,
      what: "Consultation · Marcus T.",
    },
    text: "Hartwell Injury Law: Your free consultation is tomorrow at 10:00 AM. Please fill out the short intake form before then.",
  },
  {
    id: "gym",
    label: "Gym trial",
    business: "Forge Strength Studio",
    photo: demoImages.fitness,
    caller: "Priya S.",
    callerPhone: "(555) 010-9032",
    lines: [
      { from: "ai", text: "Thanks for calling Forge Strength Studio. How can I help?" },
      { from: "caller", text: "Do you do free trial sessions? I've never lifted before." },
      { from: "ai", text: "We do. Your first session is one-on-one with a coach and built for beginners." },
      { from: "caller", text: "Great. What times do you have?" },
      { from: "ai", text: "Tomorrow at 6:00 AM or 5:30 PM. Which is better for you?" },
      { from: "caller", text: "5:30, please." },
      { from: "ai", text: "Done. You're booked for 5:30 PM tomorrow. I'll text you what to bring." },
    ],
    calendar: {
      day: "Tomorrow",
      slots: ["6:00 AM", "7:30 AM", "12:00 PM", "5:30 PM"],
      booked: 3,
      what: "Free trial · Priya S.",
    },
    text: "Forge Strength: You're booked for a free trial tomorrow at 5:30 PM. Bring water and comfortable shoes.",
  },
  {
    id: "restaurant",
    label: "Restaurant reservation",
    business: "Olive & Ember",
    photo: demoImages.restaurant,
    caller: "Sam R.",
    callerPhone: "(555) 010-6618",
    lines: [
      { from: "ai", text: "Olive & Ember. How can I help?" },
      { from: "caller", text: "Can I get a table for four this Friday around 7?" },
      { from: "ai", text: "I have 6:45 or 7:30 on Friday for four. Which would you like?" },
      { from: "caller", text: "7:30. One of us has a nut allergy." },
      { from: "ai", text: "Noted on the reservation for the kitchen." },
      { from: "caller", text: "Perfect, thanks." },
      { from: "ai", text: "You're booked for four on Friday at 7:30 PM. I've texted you a confirmation." },
    ],
    calendar: {
      day: "Friday",
      slots: ["5:30 PM", "6:45 PM", "7:30 PM", "8:45 PM"],
      booked: 2,
      what: "Table for 4 · Sam R.",
    },
    text: "Olive & Ember: Table for 4 on Friday at 7:30 PM. Nut allergy noted. Reply C to confirm.",
  },
];
