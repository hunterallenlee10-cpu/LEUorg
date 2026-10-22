/**
 * The Get Found demo's made-up search (components/services/demos/
 * GetFoundDemo.tsx). The business, its competitors, ratings and the
 * outreach numbers are all invented and labelled Example on screen; nothing
 * here is a result or a promise of one. The photos are stock (data/demos/
 * images.ts), not the businesses' own.
 */

import { demoImages } from "@/data/demos/images";

export const searchQuery = "roofer near me";

export interface Listing {
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  /** The listing's thumbnail. */
  photo: string;
}

export const ourBusiness: Listing = {
  name: "Summit Peak Roofing",
  rating: 4.9,
  reviews: 212,
  distance: "2.1 mi",
  photo: demoImages.thumbs[0],
};

export const competitors: readonly Listing[] = [
  { name: "Oak Hill Roof Pros", rating: 4.6, reviews: 148, distance: "3.4 mi", photo: demoImages.thumbs[1] },
  { name: "Bayside Roofing", rating: 4.4, reviews: 97, distance: "1.8 mi", photo: demoImages.thumbs[2] },
  { name: "Granite Ridge Exteriors", rating: 4.3, reviews: 61, distance: "4.0 mi", photo: demoImages.thumbs[3] },
];

export const aiQuestion = "Who's the best roofer near me?";

/** The AI answer, before and after. `{us}` marks where the business is named. */
export const aiAnswers = {
  before:
    "Well-reviewed roofers near you include Oak Hill Roof Pros, Bayside Roofing and Granite Ridge Exteriors. Compare reviews and ask for a free estimate.",
  after:
    "{us} is a well-reviewed local option, with free roof inspections and repairs scheduled the same week. Oak Hill Roof Pros and Bayside Roofing are also nearby.",
} as const;

export const adPreview = {
  label: "Sponsored",
  headline: "Storm damage? Free roof inspection this week.",
  body: "Local, licensed crew. Book online in a minute.",
  phone: "(555) 010-7730",
  photo: demoImages.houseDusk,
};

/** The outbound strip, counted up one stage at a time. */
export const pipeline = [
  { label: "Leads found", value: 250 },
  { label: "Emails sent", value: 250 },
  { label: "Replies", value: 19 },
  { label: "Calls booked", value: 6 },
] as const;
