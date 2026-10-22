import { demoImages } from "@/data/demos/images";

/**
 * The Websites demo's five made-up businesses (components/services/demos/
 * WebsitesDemo.tsx): the industry switch re-skins one mock site with these.
 * `accent` names one of the site's existing colour scales, which the light
 * theme already re-points, so each skin reads in both themes. `photo` is the
 * hero picture (data/demos/images.ts); the store's is its product.
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
  /** Where the hero crops the photo (CSS object-position). */
  focus: string;
  /** The made-up review score under the button. */
  rating: number;
  reviews: number;
  /** Three nav links. */
  nav: readonly [string, string, string];
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
  name: "Field Satchel",
  detail: "Full-grain leather, fits a 14\" laptop",
  price: 148,
  shipping: 0,
} as const;
