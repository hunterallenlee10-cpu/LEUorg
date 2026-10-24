import { demoImages } from "@/data/demos/images";

/**
 * The Websites demo's five made-up businesses (components/services/demos/
 * WebsitesDemo.tsx): the industry switch re-skins one mock site with these.
 * `accent` names one of the site's existing colour scales, which the light
 * theme already re-points, so each skin reads in both themes. `photo` is the
 * hero picture (data/demos/images.ts); the store's is its product. `video`
 * is the same picture as a 5-second seamless loop (AI footage from Higgsfield,
 * scripts/build-demo-media.sh), which the new site plays behind its headline
 * while the old site keeps the still; the store's is its 360° product spin.
 */

export type WebsiteSkinId = "home" | "law" | "fitness" | "restaurant" | "store";

export interface WebsiteSkin {
  id: WebsiteSkinId;
  label: string;
  business: string;
  eyebrow: string;
  headline: string;
  sub: string;
  cta: string;
  /** One line of reassurance under the button. */
  trust: string;
  accent: "cyan" | "brass" | "red" | "yellow" | "emerald";
  /** What the lead in the closing toast asked for. */
  lead: string;
  photo: string;
  /** The hero as a loop, with its first frame as the still. */
  video?: { src: string; poster: string };
  /** Where the hero crops the photo (CSS object-position). */
  focus: string;
  /** The made-up review score under the button. */
  rating: number;
  reviews: number;
  /** Three nav links. */
  nav: readonly [string, string, string];
}

/** A loop in public/demos/video/ and its still. */
function loop(name: string) {
  return { src: `/demos/video/${name}.mp4`, poster: `/demos/video/${name}.webp` };
}

export const websiteSkins: readonly WebsiteSkin[] = [
  {
    id: "home",
    label: "Home services",
    business: "Ridgeline Roofing",
    eyebrow: "Roof repair & replacement",
    headline: "Roof repair you can count on.",
    sub: "Free inspections. Repairs scheduled the same week.",
    cta: "Book a free inspection",
    trust: "Licensed and insured",
    accent: "cyan",
    lead: "Jordan P. booked a free inspection",
    photo: demoImages.homeServices,
    video: loop("home-services"),
    focus: "70% 40%",
    rating: 4.9,
    reviews: 212,
    nav: ["Repairs", "Replacement", "Reviews"],
  },
  {
    id: "law",
    label: "Law",
    business: "Hartwell Injury Law",
    eyebrow: "Personal injury",
    headline: "Hurt in an accident? Talk to a lawyer today.",
    sub: "Free consultations, with evening appointments.",
    cta: "Book a free consultation",
    trust: "Every call returned",
    accent: "brass",
    lead: "Marcus T. booked a consultation",
    photo: demoImages.law,
    video: loop("law-firms"),
    focus: "45% 50%",
    rating: 4.8,
    reviews: 164,
    nav: ["Practice areas", "Results", "About"],
  },
  {
    id: "fitness",
    label: "Fitness",
    business: "Forge Strength Studio",
    eyebrow: "Personal training",
    headline: "Get stronger in 30 minutes a session.",
    sub: "Coached sessions for every level, beginners welcome.",
    cta: "Book a free trial",
    trust: "First session free",
    accent: "red",
    lead: "Priya S. booked a free trial",
    photo: demoImages.fitness,
    video: loop("fitness"),
    focus: "40% 60%",
    rating: 5.0,
    reviews: 98,
    nav: ["Classes", "Coaches", "Pricing"],
  },
  {
    id: "restaurant",
    label: "Restaurant",
    business: "Olive & Ember",
    eyebrow: "Wood-fired kitchen",
    headline: "Wood-fired dinners, six nights a week.",
    sub: "Seasonal menu, private dining and catering.",
    cta: "Reserve a table",
    trust: "Open Tuesday to Sunday",
    accent: "yellow",
    lead: "Sam R. reserved a table for 4",
    photo: demoImages.restaurant,
    video: loop("restaurants"),
    focus: "55% 50%",
    rating: 4.7,
    reviews: 430,
    nav: ["Menu", "Private dining", "Hours"],
  },
  {
    id: "store",
    label: "Online store",
    business: "Northwind Goods",
    eyebrow: "Handmade leather",
    headline: "Leather goods made to last.",
    sub: "Bags made by hand in small batches. Free shipping.",
    cta: "Shop now",
    trust: "30-day returns",
    accent: "emerald",
    lead: "Order #1042 placed",
    photo: demoImages.storeProduct,
    focus: "50% 45%",
    rating: 4.9,
    reviews: 1204,
    nav: ["Shop", "Our story", "Journal"],
  },
];

/** The store skin's one product. Totals are worked out from these. */
export const storeProduct = {
  /** The satchel turning a full circle: 36 frames in a 6 x 6 sheet. */
  spin: "/demos/img/spin/satchel.webp",
  name: "Field Satchel",
  detail: "Full-grain leather, fits a 14\" laptop",
  price: 148,
  shipping: 0,
} as const;
