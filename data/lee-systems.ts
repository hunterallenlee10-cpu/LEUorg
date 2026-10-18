/**
 * LEU - shared brand details and page content.
 *
 * Lee Systems Co. replaced Lee Marketing Mastery on 2026-09-25, and became
 * plain LEU on 2026-10-17. It sells AI
 * automation (the lead offer, AI call answering included) and website builds,
 * both on one page, /how-it-works. The automation and websites pages folded
 * into it on 2026-09-29: their URLs, and the old /lee-marketing-mastery ones,
 * redirect to its #automation and #websites sections (next.config.mjs).
 *
 * Business facts - phone, email, the booking link and the reply time - live
 * in data/site.ts. At the owner's request (2026-09-28) the pages say nothing
 * about where the business is based or which area it serves.
 *
 * The first step is a free consultation call, booked with "Book a free call"
 * (`bookLabel` and `bookHref` in data/site.ts). It replaced the free
 * Automation Audit and its written plan on 2026-09-28, also at the owner's
 * request.
 *
 * The FAQ list lives here rather than in its accordion component because the
 * page also emits it as FAQPage structured data, and a server component
 * cannot read an array back out of a "use client" module.
 */

import { site } from "@/data/site";

/**
 * The page's address. It was /lee-systems until 2026-10-17, when the owner
 * retired the Lee Systems Co. name and everything became Lee Enterprises
 * Unlimited; the page is now "How It Works", and /lee-systems redirects here
 * (next.config.mjs). The identifiers in the code keep the old name.
 */
export const leeSystemsRoutes = {
  home: "/how-it-works",
} as const;

/**
 * Section ids on /how-it-works that links point at, kept here so a link and
 * its target agree. The form also keeps the ids the two forms it replaced had
 * on their own pages - "audit" (from when the automation form requested the
 * free Automation Audit) and "website-quote" - on wrappers around it, so
 * links made for either still land on it.
 */
export const leeSystemsAnchors = {
  services: "services",
  automation: "automation",
  websites: "websites",
  form: "contact-form",
  auditForm: "audit",
  websiteQuoteForm: "website-quote",
  /** "Watch one system run your week", linked from the Follow-Up demo. */
  fullWeek: "full-week",
} as const;

/** Sections of /how-it-works, linked from anywhere on the site. */
export const leeSystemsLinks = {
  services: `${leeSystemsRoutes.home}#${leeSystemsAnchors.services}`,
  automation: `${leeSystemsRoutes.home}#${leeSystemsAnchors.automation}`,
  websites: `${leeSystemsRoutes.home}#${leeSystemsAnchors.websites}`,
  fullWeek: `${leeSystemsRoutes.home}#${leeSystemsAnchors.fullWeek}`,
} as const;

export const leeSystems = {
  /** Since 2026-10-17 the one business name: Lee Systems Co. is retired. */
  name: "Lee Enterprises Unlimited",
  /**
   * The main page's headline, the owner's "what's in it for me" line
   * (2026-09-30), which replaced "The world is changing. Beat your
   * competition to every lead.": three beats, each on its own line, the last
   * lit in brass. The link preview reads all three.
   */
  headline: ["More Customers.", "More Money."],
  headlineAccent: "Less Work for You.",
  /**
   * Under the headline: the owner's line, then how, in the owner's words
   * (2026-09-30), which name the website too.
   */
  heroLine: "Let AI make you money.",
  heroHow:
    "It makes & runs your beautiful website, answers calls, follows up with every lead, and books the job. All 24/7.",
  owner: "Hunter Lee",
  /** The business inbox. */
  contactEmail: site.email,
  phone: site.phone,
} as const;

// The six service groups and the Care Plan moved to data/services.ts on
// 2026-10-17, when each group got its own page under /services.

/**
 * The example industries on /how-it-works ("Who we help"). Law firms and home
 * services, the two the owner knows best, come first; the rest were added on
 * the owner's request (2026-09-29). The closing line covers everyone else
 * rather than listing industries with nothing specific to say. The examples
 * say what the automations do, not work already done: no client claims.
 *
 * Law firms and home services had pages of their own until 2026-09-29, when
 * they came off at the owner's request; their URLs 301 to their cards here
 * (next.config.mjs).
 */
export const leeSystemsIndustries = [
  {
    id: "law-firms",
    name: "Law firms",
    summary:
      "Intake, consultations and client updates without the phone tag.",
    examples: [
      "Intake forms that collect case details before the first call",
      "Consultation booking with automatic reminders",
      "Follow-up for prospective clients who have not signed yet",
      "Document requests that chase themselves",
      "Case status updates sent to clients at each stage",
      "Review requests when a matter closes",
    ],
  },
  {
    id: "home-services",
    name: "Home services & roofing",
    summary:
      "Every lead answered, every estimate followed up, every job reviewed.",
    examples: [
      "Instant replies to web, phone and ad leads",
      "Inspection scheduling with reminders the day before",
      "Estimate follow-up until the customer says yes or no",
      "Job status texts: scheduled, on the way, finished",
      "Review and referral requests after the job",
      "Invoice reminders until it is paid",
    ],
  },
  {
    id: "real-estate",
    name: "Real estate",
    summary:
      "Every inquiry answered fast, every showing booked, every past client remembered.",
    examples: [
      "Instant replies to listing and portal inquiries",
      "Showing scheduling with reminders",
      "Follow-up for buyers and sellers who are not ready yet",
      "Updates to clients at each step of the deal",
      "Review and referral requests after closing",
    ],
  },
  {
    id: "fitness",
    name: "Fitness & PT",
    summary:
      "Trial sign-ups followed up, sessions booked and members kept coming back.",
    examples: [
      "Instant replies to trial and class inquiries",
      "Session booking with reminders",
      "Follow-up after a missed session or no-show",
      "Check-ins for members who have gone quiet",
      "Review requests after a milestone",
    ],
  },
  {
    id: "dealerships",
    name: "Dealerships",
    summary:
      "Every lead answered in minutes, test drives booked and service customers brought back.",
    examples: [
      "Instant replies to website and third-party leads",
      "Test drive and appointment booking with reminders",
      "Follow-up for shoppers who have not bought yet",
      "Service reminders when a car is due",
      "Review requests after a sale or service visit",
    ],
  },
  {
    id: "restaurants",
    name: "Restaurants",
    summary:
      "Calls answered, reservations and catering handled, regulars brought back.",
    examples: [
      "AI call answering for hours, menu and reservation questions",
      "Reservation booking with reminders",
      "Catering and large-order inquiry follow-up",
      "Messages to regulars about specials and events",
      "Review requests after a visit",
    ],
  },
] as const;

/**
 * An industry name mid-sentence ("See examples for law firms"): only the
 * first letter drops to lower case, so "Fitness & PT" keeps its PT.
 */
export function industryInSentence(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

/**
 * The callout under the industry cards: the cards are examples, and any
 * business is welcome (the owner asked for a "we can do anything" statement
 * here, 2026-10-04). Its chips are the six service groups (2026-10-17,
 * `serviceGroups` in data/services.ts, each linking to its page), so the
 * claim stays concrete, then "Anything else you need".
 */
export const otherIndustries = {
  eyebrow: "Not on the list?",
  title: "Whatever your business does,",
  titleAccent: "we can build it.",
  body: "The industries above are only a few examples. If something in your business is repetitive, slow or slipping through the cracks, we can build a system that handles it. Built personally for you.",
  /** The last chip, in brass: the list above is not the limit. */
  capabilitiesMore: "Anything else you need",
  cta: "Tell us what you need",
} as const;

// "What do you need?" (`inquiryNeeds`) lives in data/services.ts with the
// groups it lists.

/** The form's industry choices: the industries the page shows, then Other. */
export const inquiryIndustryOptions: readonly string[] = [
  ...leeSystemsIndustries.map(({ name }) => name),
  "Other",
];

/**
 * The /how-it-works FAQ: the automation page's questions, then the websites
 * page's, merged when those pages folded into /how-it-works (2026-09-29).
 * Both asked "How long does a build take?"; it is asked once here. The
 * answers to the free call, build time, kinds of business and website cost
 * questions are the owner's own wording (2026-09-29).
 */
export const leeSystemsFaqs = [
  {
    question: "What happens on the free call?",
    answer:
      "We audit your current operations to uncover hidden profit leaks. If we're a mutual fit, you'll receive a straightforward, flat-rate quote upfront with zero hidden fees, zero revenue sharing, and zero mandatory ad spend.",
  },
  {
    question: "Is the call really free?",
    answer:
      "Yes. There is no charge and no obligation to hire us afterwards.",
  },
  {
    question: "What do you build the systems with?",
    answer:
      "AI and the tools you already use every day. If anything new needs setting up, we handle that for you too.",
  },
  {
    question: "What can the AI phone assistant do?",
    answer:
      "It works like a 24/7 virtual receptionist and sales assistant. It answers calls, handles frequently asked questions, books and reschedules appointments, qualifies leads, takes messages, transfers calls, texts missed callers, follows up with leads and past customers, sends reminders and updates your CRM automatically. It can also make outbound calls for lead follow-up, appointment confirmations, customer reactivation and review requests.",
  },
  {
    question: "Do I need to replace my current software?",
    answer:
      "Usually not. Most systems connect the email, calendar, phone, CRM and billing tools you already have. If something you use cannot be connected, we'll tell you on the call.",
  },
  {
    question: "Will AI talk to my customers without me knowing?",
    answer:
      "No. Anything a customer or client will see is written with you and approved by you before it goes live.",
  },
  {
    question: "How long does a build take?",
    answer:
      "Get industry-leading turnaround times tailored precisely to your project's scope and complexity. No generic estimates: you get a strict, job-specific timeline upfront, and zero deployment happens without your explicit approval.",
  },
  {
    question: "What kinds of businesses do you work with?",
    answer:
      "Every business thrives on new customers, and we know how to engineer predictable growth for yours, no matter the industry.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "Each project is quoted on its own. The price depends on how many pages you need, whether copy and photos already exist, and what the site has to do, such as booking appointments or connecting to other tools. Free project quotes are provided on the initial call.",
  },
  {
    question: "Do I need my content and photos ready first?",
    answer:
      "No. We draft the page copy for your review and revise it from your feedback. If you already have branding, photos or copy worth keeping, we keep them.",
  },
  {
    question: "Can you rebuild my existing website?",
    answer:
      "Yes. We review what is working on the current site and what content is worth keeping, then rebuild it on a current foundation.",
  },
  {
    question: "Do I own the website?",
    answer:
      "Yes. You own your domain and your content. If you later move to another provider, the site goes with you.",
  },
  {
    question: "What happens after launch?",
    answer:
      "You can take it from there, or we can keep it maintained with an optional care plan covering hosting, updates, backups and small changes. The care plan is quoted separately from the build.",
  },
  {
    question: "Can the site connect to the automation systems you build?",
    answer:
      "Yes. A lead the site captures can get an instant reply, reach your phone, and be followed up on a schedule. That can be built in from the start or added to a site that is already live.",
  },
];

/**
 * How LEU prices its work: the owner's offer terms, stated in
 * "The choice is yours" on /how-it-works.
 */
export const pricingPromise = [
  "Flat upfront quote",
  "No hidden fees",
  "No revenue share",
  "No required ad spend",
  "You choose the contract terms",
] as const;

/** The four things the homepage says LEU sets up. NOTHING RENDERS
 * THIS RIGHT NOW: LeeSystemsSetupSection came off the homepage at the owner's
 * request (2026-09-28) and is kept so it can go back with no content work. */
export const homeSetupItems = [
  {
    id: "calls",
    title: "AI call answering",
    body: "An AI assistant that answers your business calls 24/7.",
  },
  {
    id: "follow-up",
    title: "Instant follow-up",
    body: "Every new inquiry gets a reply in under a minute.",
  },
  {
    id: "crm",
    title: "CRM and intake",
    body: "Lead and client details land in one place, with no retyping.",
  },
  {
    id: "websites",
    title: "Websites",
    body: "Built to bring in leads, and you own it.",
  },
] as const;

/**
 * The three onboarding steps (Audit, Build, Take off): /how-it-works'
 * onboarding section and the homepage's "How it works" rows.
 */
export const onboardingSteps = [
  {
    title: "Audit",
    body: "We start by auditing how your business runs today: how calls, leads, intake, follow-ups and admin are handled, and where things slip. On a free consultation call we find where a system or a better website would help most, and you get a flat quote up front.",
    tags: ["Free consultation call", "Flat quote up front"],
  },
  {
    title: "Build",
    body: "We build the system, the website, or both, custom to your business and around the tools you already use. Everything is tested, and nothing customer-facing goes live until you approve it.",
    tags: ["Built for your business", "You approve before launch"],
  },
  {
    title: "Take off",
    body: "We hand it over and show you how it works. From there it runs every day: leads get answered, follow-ups go out, and your time goes back into the work that makes you money.",
    tags: ["Handed over to you", "Runs every day"],
  },
];

/**
 * The two columns of "The choice is yours" on /how-it-works, also the
 * homepage's "Two paths": the work done by hand, and the same work with
 * LEU's systems.
 */
export const choiceByHand = [
  "Calls go to voicemail after hours",
  "New leads wait until someone is free",
  "Booking takes rounds of phone tag",
  "Follow-up depends on memory",
  "Details get retyped by hand",
  "Reviews and unpaid invoices get chased by hand",
];

export const choiceWithSystems = [
  "AI answers your calls 24/7",
  "Every new lead gets a reply in under a minute",
  "Appointments booked, with reminders sent",
  "Follow-up until the customer gives an answer",
  "Leads land in your CRM, with no retyping",
  "Reviews requested and invoices chased for you",
];
