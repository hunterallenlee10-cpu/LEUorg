/**
 * The Custom AI Tools demo's made-up inputs (components/services/demos/
 * CustomAiDemo.tsx). Quote totals and the contract deadline are worked out
 * in code from these, never typed in.
 */

import { demoImages } from "@/data/demos/images";

export const voiceNote = {
  business: "Ridgeline Roofing",
  quoteNumber: "Q-2071",
  customer: "Jordan P.",
  length: "0:14",
  transcript:
    "Replace 40 feet of gutter on the back, two new downspouts, haul away the old ones, and add gutter guards along the front, about 25 feet.",
  /** Sales tax applied to the subtotal. */
  taxRate: 0.06,
};

export const quoteLines = [
  { item: "Seamless gutter, back", qty: 40, unit: "ft", rate: 12.5 },
  { item: "Downspouts", qty: 2, unit: "ea", rate: 85 },
  { item: "Haul away old gutters", qty: 1, unit: "job", rate: 75 },
  { item: "Gutter guards, front", qty: 25, unit: "ft", rate: 9 },
] as const;

/** The job-site photo the inspection runs on (data/demos/images.ts). */
export const inspectionPhoto = {
  src: demoImages.homeServices,
  alt: "A house at dusk with a ladder leaning against the roof",
};

/**
 * Each hazard's box on the photo, in % of its width and height: left, top,
 * width, height. Its number pin sits on the box's top-left corner.
 */
export const hazards = [
  { x: 50, y: 76, w: 17, h: 24, title: "Ladder footing not secured", severity: "High" },
  { x: 72, y: 9, w: 22, h: 20, title: "Worn shingles near the ridge", severity: "Medium" },
  { x: 21, y: 59, w: 26, h: 12, title: "Gutter pulling away over the window", severity: "Low" },
] as const;

export const contract = {
  title: "Service Agreement",
  vendor: "Northwind Supply Co.",
  /** Term start, ISO date. Renewal is one year on. */
  start: "2026-01-15",
  noticeDays: 60,
  clauses: [
    { id: "scope", text: "1. Vendor will provide monthly supply deliveries as listed in Schedule A." },
    {
      id: "renewal",
      text: "2. This Agreement renews automatically for successive 12-month terms unless Customer cancels in writing at least 60 days before the renewal date.",
      risk: "Auto-renewal. It renews for another full year unless you cancel in writing 60 days ahead.",
    },
    { id: "payment", text: "3. Invoices are due within 30 days of delivery." },
    {
      id: "pricing",
      text: "4. Vendor may change prices at any time with 15 days' notice.",
      risk: "Prices can go up mid-contract with only 15 days' notice, and nothing caps the increase.",
    },
  ],
} as const;

export const spreadsheet = {
  file: "orders_export.csv",
  rows: 1_048_576,
  size: "212 MB",
  stats: [
    { label: "Orders", value: "1,048,576" },
    { label: "Top product", value: "Field Satchel, 18%" },
    { label: "Busiest day", value: "Saturday" },
  ],
  /** Orders by month, in thousands, for the chart. */
  monthly: [68, 61, 74, 79, 86, 92, 84, 81, 88, 97, 113, 125],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
} as const;
