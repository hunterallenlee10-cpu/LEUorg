/**
 * LEU's six service groups: the one list every part of the site
 * reads (the owner's list, 2026-10-17). The header's Services menu, the
 * homepage showcase, the /how-it-works "What we do" cards, the /services hub
 * and its Demo Lab tabs, the six /services/[slug] pages, the "What do you
 * need?" select, the contact email's subject tag, the Service structured
 * data and the sitemap all map over `serviceGroups`. Change a group here and
 * it changes everywhere; there is no second copy to keep in step.
 *
 * Rules for the copy (docs/SERVICES.md): say what it does and who it is for,
 * no vendor or tool names, and no prices, timelines, results or client
 * counts. The platforms named (Google, Instagram and so on) are where the
 * work shows up, not what it is built with.
 *
 * `slug` is the URL (/services/<slug>), the Demo Lab tab (?demo=<slug>) and
 * the form's option value (?service=<slug> or ?interest=<slug> preselects
 * it). `anchor` is the card's id on /how-it-works from before the service
 * pages existed, kept so links already made to it still land.
 */

import { leeSystemsFaqs, leeSystemsIndustries } from "@/data/lee-systems";

export const serviceSlugs = [
  "websites",
  "get-found",
  "ai-calls",
  "follow-up",
  "content",
  "custom-ai",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

/** A line icon in components/services/serviceIcons.ts. */
export type ServiceIconName =
  | "websites"
  | "leads"
  | "calls"
  | "followUp"
  | "content"
  | "customAi";

/**
 * The industries a service page can name under "Who it's for": the six on
 * /how-it-works (`leeSystemsIndustries`, which also supplies their names and
 * pictures), plus online stores for websites and content.
 */
export type ServiceIndustryId =
  | (typeof leeSystemsIndustries)[number]["id"]
  | "online-stores";

export interface ServiceItem {
  name: string;
  /** One sentence for the "What's included" card on the service's page. */
  detail: string;
  /** A heading the service page groups this item under, e.g. "Ads". Items
   *  with the same section sit together, in order. Optional: a group whose
   *  items have none shows one list. */
  section?: string;
}

export interface ServiceGroup {
  slug: ServiceSlug;
  name: string;
  /** The one line saying what the customer gets. */
  outcome: string;
  /** One or two sentences: what it is and who it helps. */
  description: string;
  icon: ServiceIconName;
  /** The card's id on /how-it-works from before the service pages existed. */
  anchor: string;
  items: readonly ServiceItem[];
  /** Up to five item names shown as chips on the /services rows. */
  keyItems: readonly string[];
  /** "Who it's for": three or four industries with one concrete line each. */
  audience: readonly { industry: ServiceIndustryId; line: string }[];
  /** "How it works": Audit, Build, Take off, in this service's terms. */
  steps: readonly [ServiceStep, ServiceStep, ServiceStep];
  /** "Pairs well with": two groups that naturally go with this one. */
  pairsWith: readonly [ServiceSlug, ServiceSlug];
  /** Whether "Related builds" shows the Recent Builds that fit. Only the
   *  websites page has real matching work; the rest skip the block. */
  showRelatedBuilds: boolean;
  /** The demo's tab label and its one-line intro in the Demo Lab. */
  demo: { label: string; intro: string };
  /** The service page's <title> and meta description (under 160 characters). */
  seo: { title: string; description: string };
  /**
   * Questions from the /how-it-works FAQ (`leeSystemsFaqs`, by exact
   * question) that the service page repeats, because they fit it. The
   * answers stay in that one list.
   */
  faqs: readonly string[];
}

interface ServiceStep {
  title: "Audit" | "Build" | "Take off";
  body: string;
}

export const serviceGroups: readonly ServiceGroup[] = [
  {
    slug: "websites",
    name: "Websites & Online Stores",
    outcome: "A website that brings customers in.",
    description:
      "Fast, good-looking sites built to turn visitors into calls, bookings and sales. From a local business site to a full online store, you own it.",
    icon: "websites",
    anchor: "services-websites",
    items: [
      {
        name: "Conversion websites for local businesses",
        detail:
          "One clear next step on every page, so visitors call, book or ask for a quote.",
      },
      {
        name: "Premium animated and 3D sites",
        detail:
          "Motion and 3D that make your brand look expensive, without slowing the page down.",
      },
      {
        name: "Online stores with checkout",
        detail:
          "Product pages, a cart and checkout, so customers can buy without calling you.",
      },
      {
        name: "Real estate listing sites with map search",
        detail:
          "Listings buyers can filter and browse on a map, with an inquiry button on each one.",
      },
      {
        name: "Client portals and online booking",
        detail:
          "Clients book, log in and find their documents without emailing you first.",
      },
      {
        name: "Redesigns that keep your Google rankings",
        detail:
          "A new site that carries over the pages and links Google already ranks.",
      },
      {
        name: "Online payments built in",
        detail:
          "Deposits, invoices and orders paid by card, straight from the site.",
      },
    ],
    keyItems: [
      "Conversion websites for local businesses",
      "Online stores with checkout",
      "Client portals and online booking",
      "Redesigns that keep your Google rankings",
      "Online payments built in",
    ],
    audience: [
      {
        industry: "home-services",
        line: "Your best jobs up front and a quote request one tap away on a phone.",
      },
      {
        industry: "law-firms",
        line: "Practice areas explained plainly, with consultation booking built in.",
      },
      {
        industry: "restaurants",
        line: "Menu, hours and reservations that load fast for people deciding where to eat.",
      },
      {
        industry: "online-stores",
        line: "Product pages and a checkout that let customers buy without a call.",
      },
    ],
    steps: [
      {
        title: "Audit",
        body: "We look at your current site (or your competitors' if you don't have one) and agree what the site needs to do: calls, bookings or sales.",
      },
      {
        title: "Build",
        body: "We write the copy, design the pages and build the site around that one goal. Nothing goes live until you approve it.",
      },
      {
        title: "Take off",
        body: "We launch it on your domain, connect your forms and booking, and show you how to make simple changes. You own it.",
      },
    ],
    pairsWith: ["follow-up", "get-found"],
    showRelatedBuilds: true,
    demo: {
      label: "Websites",
      intro: "Drag the slider from an old site to a new one, then switch industries.",
    },
    seo: {
      title: "Websites & Online Stores | Lee Enterprises Unlimited",
      description:
        "Websites and online stores built to turn visitors into calls, bookings and sales. Built personally for you by LEU.",
    },
    faqs: [
      "How much does a website cost?",
      "Do I need my content and photos ready first?",
      "Can you rebuild my existing website?",
      "Do I own the website?",
      "Can the site connect to the automation systems you build?",
    ],
  },
  {
    slug: "get-found",
    // Renamed from "Get Found & Get Leads" on 2026-10-23 (the owner's call),
    // organized as SEO, ads and outreach, with every ad platform we run.
    // The slug stays so /services/get-found keeps working.
    name: "Marketing & Lead Generation",
    outcome: "More people find you. More of them reach out.",
    description:
      "SEO, ads and outreach: we get you found in search and AI answers, run your ads on every major platform, and reach out to the people you want as customers.",
    icon: "leads",
    anchor: "services-leads",
    items: [
      {
        section: "SEO",
        name: "Google Maps & local SEO",
        detail:
          "Your business profile, site and reviews set up so you show up in local searches.",
      },
      {
        section: "SEO",
        name: "AI search visibility (ChatGPT, Google AI & more)",
        detail:
          "Your site written and structured so AI assistants can find you and name you.",
      },
      {
        section: "Ads",
        name: "Google Search, Maps & Local Services ads",
        detail: "Ads shown to people searching for what you do, nearby.",
      },
      {
        section: "Ads",
        name: "YouTube ads",
        detail:
          "Video ads in front of the right audience before and during what they watch.",
      },
      {
        section: "Ads",
        name: "Facebook & Instagram ads",
        detail:
          "Ads aimed at the people most likely to buy, sent to a page built to convert.",
      },
      {
        section: "Ads",
        name: "TikTok ads",
        detail: "Short video ads that reach new customers where they scroll.",
      },
      {
        section: "Ads",
        name: "LinkedIn ads",
        detail:
          "Ads aimed at business owners and decision-makers by title, company and industry.",
      },
      {
        section: "Ads",
        name: "Retargeting ads",
        detail:
          "Ads that bring back people who visited your site but didn't reach out.",
      },
      {
        section: "Outreach",
        name: "Targeted lead lists & cold email",
        detail:
          "Lists of the businesses you want to work with, and emails sent and followed up for you.",
      },
      {
        section: "Outreach",
        name: "LinkedIn outreach to decision-makers",
        detail: "Connection requests and messages to the people you want to meet.",
      },
    ],
    keyItems: [
      "Google Maps & local SEO",
      "AI search visibility (ChatGPT, Google AI & more)",
      "Google Search, Maps & Local Services ads",
      "Facebook & Instagram ads",
      "Targeted lead lists & cold email",
    ],
    audience: [
      {
        industry: "home-services",
        line: "Show up when someone nearby searches for a roofer, plumber or cleaner.",
      },
      {
        industry: "law-firms",
        line: "Be the firm that comes up when someone asks who to call after an accident.",
      },
      {
        industry: "real-estate",
        line: "Reach buyers and sellers in your area before they pick another agent.",
      },
      {
        industry: "dealerships",
        line: "Ads that put your inventory in front of local shoppers who are ready to buy.",
      },
    ],
    steps: [
      {
        title: "Audit",
        body: "We check where you show up today: Maps, search, AI answers and ads. Then we pick the channels most likely to bring you customers.",
      },
      {
        title: "Build",
        body: "We fix your listings and pages, set up the ads or outreach, and write every message with you. Nothing goes out until you approve it.",
      },
      {
        title: "Take off",
        body: "Leads start coming in and land in one place. You get a plain report on what's working.",
      },
    ],
    pairsWith: ["websites", "content"],
    showRelatedBuilds: false,
    demo: {
      label: "Marketing",
      intro: "See a business move from page two into the top three, then into an AI answer.",
    },
    seo: {
      title: "Marketing & Lead Generation | Lee Enterprises Unlimited",
      description:
        "Local SEO, AI search, ads on every major platform and outreach that help more people find your business and reach out. By LEU.",
    },
    faqs: [
      "Will AI talk to my customers without me knowing?",
      "Is the call really free?",
    ],
  },
  {
    slug: "ai-calls",
    name: "AI Call Answering",
    outcome: "Every call answered, day or night.",
    description:
      "An AI phone assistant that picks up every call, answers questions and books the appointment, even at midnight. It can also call new leads back the moment they reach out.",
    icon: "calls",
    anchor: "services-calls",
    items: [
      {
        name: "24/7 AI phone assistant that answers questions and books appointments",
        detail:
          "It answers in your business's name, knows your services and hours, and puts the job on your calendar.",
      },
      {
        name: "Instant callback when a new lead fills out your form",
        detail:
          "The lead gets a call within moments of hitting submit, while they're still thinking about you.",
      },
      {
        name: "Outbound calls to your lead list, with call summaries",
        detail:
          "It works through your list and sends you a short summary of every conversation.",
      },
    ],
    keyItems: [
      "24/7 AI phone assistant that answers questions and books appointments",
      "Instant callback when a new lead fills out your form",
      "Outbound calls to your lead list, with call summaries",
    ],
    audience: [
      {
        industry: "home-services",
        line: "The after-hours AC call gets answered and booked instead of going to a competitor.",
      },
      {
        industry: "law-firms",
        line: "Every caller gets intake questions answered and a consultation on the calendar.",
      },
      {
        industry: "restaurants",
        line: "Hours, menu and reservation calls handled while your staff serves tables.",
      },
      {
        industry: "fitness",
        line: "Trial and class questions answered, and the first session booked on the call.",
      },
    ],
    steps: [
      {
        title: "Audit",
        body: "We listen to how calls go today: who calls, what they ask, and which calls get missed.",
      },
      {
        title: "Build",
        body: "We set up the assistant with your services, hours, prices you choose to share and your calendar. You hear it and approve the script.",
      },
      {
        title: "Take off",
        body: "It answers your line around the clock. You get a text or summary after every call.",
      },
    ],
    pairsWith: ["follow-up", "websites"],
    showRelatedBuilds: false,
    demo: {
      label: "AI calls",
      intro: "Pick a business. Watch the 11:48 PM call get answered and booked.",
    },
    seo: {
      title: "AI Call Answering | Lee Enterprises Unlimited",
      description:
        "A 24/7 AI phone assistant that answers your calls, books appointments and calls new leads back. Built personally for you by LEU.",
    },
    faqs: [
      "What can the AI phone assistant do?",
      "Will AI talk to my customers without me knowing?",
      "Do I need to replace my current software?",
    ],
  },
  {
    slug: "follow-up",
    name: "Follow-Up & Booking Automation",
    outcome: "Every lead followed up. Every job booked.",
    description:
      "Every new lead gets a reply in under a minute and a follow-up until they book. Reminders, reviews and invoice nudges go out on their own.",
    icon: "followUp",
    anchor: "services-follow-up",
    items: [
      {
        name: "Replies to new leads in under a minute",
        detail:
          "Form, ad and missed-call leads get a text or email before they move on to someone else.",
      },
      {
        name: "Website chat assistant",
        detail:
          "Answers common questions on your site and books the visitor while they're there.",
      },
      {
        name: "Instagram comment-to-DM replies",
        detail:
          "Someone comments a keyword on your post and gets the details in their DMs right away.",
      },
      {
        name: "Booking and reminders",
        detail:
          "Leads pick a time, and reminders go out before the appointment to cut no-shows.",
      },
      {
        name: "CRM updates with no retyping",
        detail:
          "Every lead, call and booking lands in your CRM on its own.",
      },
      {
        name: "Email follow-up sequences",
        detail:
          "A series of emails that keeps in touch until the lead is ready to buy.",
      },
      {
        name: "Review requests",
        detail:
          "Happy customers get a short message asking for a review after the job.",
      },
      {
        name: "Invoice reminders",
        detail:
          "Friendly reminders go out until the invoice is paid, so you don't have to chase it.",
      },
      {
        name: "A daily summary sent to your phone",
        detail:
          "One message each morning: new leads, bookings, reviews and payments.",
      },
    ],
    keyItems: [
      "Replies to new leads in under a minute",
      "Booking and reminders",
      "CRM updates with no retyping",
      "Review requests",
      "A daily summary sent to your phone",
    ],
    audience: [
      {
        industry: "real-estate",
        line: "Portal inquiries get a reply in seconds and showings get booked with reminders.",
      },
      {
        industry: "fitness",
        line: "Trial sign-ups get followed up until they book, and no-shows get a check-in.",
      },
      {
        industry: "dealerships",
        line: "Every internet lead gets a fast reply and a test drive on the calendar.",
      },
      {
        industry: "home-services",
        line: "Estimates followed up until a yes or no, then a review request after the job.",
      },
    ],
    steps: [
      {
        title: "Audit",
        body: "We map how a lead becomes a customer today and find where people drop off or wait too long.",
      },
      {
        title: "Build",
        body: "We write every message with you and connect your forms, calendar, CRM and invoices. You approve it all before it runs.",
      },
      {
        title: "Take off",
        body: "Follow-up runs on its own every day. You get a summary each morning.",
      },
    ],
    pairsWith: ["ai-calls", "websites"],
    showRelatedBuilds: false,
    demo: {
      label: "Follow-up",
      intro: "Be the lead. Type your first name and see what happens next.",
    },
    seo: {
      title: "Follow-Up & Booking Automation | Lee Enterprises Unlimited",
      description:
        "Instant lead replies, follow-ups, booking, reminders, review requests and invoice nudges that run on their own. Built by LEU.",
    },
    faqs: [
      "Will AI talk to my customers without me knowing?",
      "Do I need to replace my current software?",
      "Can the site connect to the automation systems you build?",
    ],
  },
  {
    slug: "content",
    name: "Content & Social Media",
    outcome: "Content that gets attention and gets you customers.",
    description:
      "Short videos, posts and carousels made and posted for you on Instagram, TikTok, YouTube and Facebook, so you stay in front of customers.",
    icon: "content",
    anchor: "services-content",
    items: [
      {
        name: "Short-form video editing",
        detail:
          "Your raw clips cut into tight vertical videos with captions and a hook.",
      },
      {
        name: "Podcasts and long videos turned into clips",
        detail:
          "One long recording becomes a batch of short clips for the week.",
      },
      {
        name: "Social media management across Instagram, TikTok, YouTube and Facebook",
        detail:
          "A posting plan, scheduled posts and replies handled across your accounts.",
      },
      {
        name: "Scripts, captions and carousels",
        detail:
          "What to say on camera, what to write under it, and swipe-through posts that teach.",
      },
      {
        name: "AI visuals and clearly labeled AI video ads",
        detail:
          "Product shots and ad videos made with AI, always labeled as AI.",
      },
      {
        name: "Custom brand music and jingles",
        detail:
          "A short piece of music your customers will start to recognize as yours.",
      },
      {
        name: "Social media audits",
        detail:
          "A plain review of your accounts: what's working, what isn't and what to post next.",
      },
    ],
    keyItems: [
      "Short-form video editing",
      "Podcasts and long videos turned into clips",
      "Social media management across Instagram, TikTok, YouTube and Facebook",
      "Scripts, captions and carousels",
      "Social media audits",
    ],
    audience: [
      {
        industry: "fitness",
        line: "Client wins and quick tips posted every week, so new members find you.",
      },
      {
        industry: "restaurants",
        line: "Specials and behind-the-scenes clips that bring regulars back.",
      },
      {
        industry: "real-estate",
        line: "Listing walk-throughs and market updates cut for each platform.",
      },
      {
        industry: "online-stores",
        line: "Product videos and carousels that send shoppers straight to the store.",
      },
    ],
    steps: [
      {
        title: "Audit",
        body: "We review your accounts and your competitors', then agree on what to post and where.",
      },
      {
        title: "Build",
        body: "We plan the month, write the scripts and edit the videos. You approve before anything is posted.",
      },
      {
        title: "Take off",
        body: "Posts go out on schedule across your platforms, and you see what's working.",
      },
    ],
    pairsWith: ["get-found", "websites"],
    showRelatedBuilds: false,
    demo: {
      label: "Content",
      intro: "Flip a clip from raw to edited, then watch a week of posts fill in.",
    },
    seo: {
      title: "Content & Social Media | Lee Enterprises Unlimited",
      description:
        "Short-form video editing, clips, posts and social media management across Instagram, TikTok, YouTube and Facebook. By LEU.",
    },
    faqs: [
      "Will AI talk to my customers without me knowing?",
      "Is the call really free?",
    ],
  },
  {
    slug: "custom-ai",
    // Renamed from "Custom AI Tools" on 2026-10-23 (the owner's call). The
    // slug stays so /services/custom-ai keeps working.
    name: "AI Tools Built for Your Business",
    outcome: "If your team does it by hand, we can build AI to do it.",
    description:
      "Tools built around the work your team does by hand: quotes from a voice note, reports from photos, contract checks and reports from big spreadsheets.",
    icon: "customAi",
    anchor: "services-custom-ai",
    items: [
      {
        name: "Voice-to-quote & invoice generator",
        detail:
          "Describe the job out loud and get a branded quote back, with the totals worked out.",
      },
      {
        name: "Photo-to-report inspection tool",
        detail:
          "Snap photos on site and get a written report with issues marked and ranked.",
      },
      {
        name: "AI contract review & deadline tracking",
        detail:
          "Risky clauses flagged in plain English, and key dates added to your calendar.",
      },
      {
        name: "Instant reports from large spreadsheets",
        detail:
          "Files too big to open become a short summary with the numbers that matter.",
      },
      {
        name: "A custom AI assistant for your team",
        detail:
          "An assistant that knows how your business does things and answers your team's questions.",
      },
      {
        name: "Private AI that keeps your data in-house",
        detail:
          "AI that runs on hardware you control, so sensitive files never leave.",
      },
      {
        name: "Connect the software you already use",
        detail:
          "Your tools pass information to each other, so nobody copies it by hand.",
      },
    ],
    keyItems: [
      "Voice-to-quote & invoice generator",
      "Photo-to-report inspection tool",
      "AI contract review & deadline tracking",
      "Instant reports from large spreadsheets",
      "Private AI that keeps your data in-house",
    ],
    audience: [
      {
        industry: "home-services",
        line: "Quote the job from the driveway by talking, and send it before you leave.",
      },
      {
        industry: "law-firms",
        line: "First-pass contract review that flags risky clauses and tracks deadlines.",
      },
      {
        industry: "real-estate",
        line: "Inspection photos turned into a clean report for buyers and sellers.",
      },
      {
        industry: "dealerships",
        line: "Inventory and sales exports turned into a one-page summary each week.",
      },
    ],
    steps: [
      {
        title: "Audit",
        body: "We find the task your team repeats most by hand and what a finished result should look like.",
      },
      {
        title: "Build",
        body: "We build the tool around your process and test it on your real examples with you.",
      },
      {
        title: "Take off",
        body: "Your team starts using it, and we adjust it as you go.",
      },
    ],
    pairsWith: ["follow-up", "ai-calls"],
    showRelatedBuilds: false,
    demo: {
      label: "AI tools",
      intro: "Try four small tools: voice to quote, photo inspection, contract check and spreadsheet report.",
    },
    seo: {
      title: "AI Tools Built for Your Business | Lee Enterprises Unlimited",
      description:
        "AI tools built for the work you do by hand: voice-to-quote, photo reports, contract review and spreadsheet reports. By LEU.",
    },
    faqs: [
      "What do you build the systems with?",
      "Do I need to replace my current software?",
      "Is the call really free?",
    ],
  },
];

/*
 * The care plan is not on the site, by the owner's rule (2026-10-23): it is
 * part of every build, discussed right before a deal closes, and never
 * mentioned on any page.
 */

export const servicesRoutes = {
  hub: "/services",
  demoLab: "/services#demo-lab",
} as const;

export const servicesAnchors = {
  demoLab: "demo-lab",
  form: "contact-form",
} as const;

export function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}

export function getService(slug: ServiceSlug): ServiceGroup {
  // Every slug has a group: serviceGroups is checked against serviceSlugs
  // at the bottom of this file.
  return serviceGroups.find((group) => group.slug === slug)!;
}

export function servicePath(slug: ServiceSlug): string {
  return `/services/${slug}`;
}

/** A Demo Lab tab, opened from anywhere on the site. */
export function demoLabHref(slug: ServiceSlug): string {
  return `${servicesRoutes.hub}?demo=${slug}#${servicesAnchors.demoLab}`;
}

/**
 * The page's own form with this service already picked: the CTA every
 * demo, and every service page's "Book a free call", ends on.
 */
export function serviceFormHref(slug: ServiceSlug, path = servicePath(slug)): string {
  return `${path}?service=${slug}#${servicesAnchors.form}`;
}

/**
 * The "What do you need?" choices on every Lee Systems form: the six groups
 * by name, then "Not sure". The value is the slug, so a link's ?service= or
 * ?interest= can pick one, and /api/lee-systems-inquiry checks what is posted
 * against this list. `website` sends the request where website quote
 * requests have always gone (its recipient and subject line).
 */
export const NOT_SURE = "not-sure";

export const inquiryNeeds: readonly {
  value: ServiceSlug | typeof NOT_SURE;
  label: string;
  website: boolean;
}[] = [
  ...serviceGroups.map(({ slug, name }) => ({
    value: slug,
    label: name,
    website: slug === "websites",
  })),
  { value: NOT_SURE, label: "Not sure", website: false },
];

/**
 * The labels the form posted before its values became slugs (2026-10-17).
 * A page loaded before a deploy can still send one, so the route maps them
 * on. Safe to delete once nobody could have that page open (a week or so).
 */
export const legacyNeedLabels: Record<string, ServiceSlug | typeof NOT_SURE> = {
  "Website or online store": "websites",
  "Get found & get leads": "get-found",
  "AI call answering": "ai-calls",
  "Follow-up & booking automation": "follow-up",
  "Content & social media": "content",
  "Custom AI tool": "custom-ai",
  "Not sure": NOT_SURE,
};

/**
 * Recent Builds left out of a service page's "Related builds": the owner's
 * own former ventures, which this site no longer lists (2026-10-17). They
 * stay in Recent Builds on the homepage and /how-it-works as before.
 */
export const relatedBuildsExclude: readonly string[] = ["Thread T-Shirts", "H1 Performance"];

/** How many related builds a service page shows. */
export const relatedBuildsLimit = 6;

/**
 * "Who it's for" cards: the industry's name and picture, by id, and the same
 * picture as a 5-second loop (public/demos/video/, AI footage made from the
 * picture in Higgsfield: docs/DEMO-MEDIA-PLAN.md) with its first frame.
 */
export function serviceIndustry(id: ServiceIndustryId): {
  name: string;
  image: string;
  video: { src: string; poster: string };
} {
  const name =
    id === "online-stores" ? "Online stores" : leeSystemsIndustries.find((entry) => entry.id === id)!.name;
  return {
    name,
    image: `/lee-systems/industries/${id}.webp`,
    video: { src: `/demos/video/${id}.mp4`, poster: `/demos/video/${id}.webp` },
  };
}

/** A service page's FAQ: its `faqs` questions with their /how-it-works answers. */
export function serviceFaqs(group: ServiceGroup): { question: string; answer: string }[] {
  return group.faqs.map((question) => {
    const faq = leeSystemsFaqs.find((entry) => entry.question === question);
    // A reworded question in data/how-it-works.ts fails the build here, rather
    // than dropping silently off the service page.
    if (!faq) throw new Error(`data/services.ts: no FAQ "${question}" in leeSystemsFaqs`);
    return faq;
  });
}

// Fails the build if a slug is missing from serviceGroups or listed twice.
if (
  serviceGroups.length !== serviceSlugs.length ||
  serviceSlugs.some((slug) => !serviceGroups.some((group) => group.slug === slug))
) {
  throw new Error("data/services.ts: serviceGroups must cover every slug once");
}

/** A group's items split into runs that share a section, in order. */
export function serviceItemParts(
  items: readonly ServiceItem[],
): { section?: string; items: ServiceItem[] }[] {
  const parts: { section?: string; items: ServiceItem[] }[] = [];
  for (const item of items) {
    const last = parts.at(-1);
    if (last && last.section === item.section) last.items.push(item);
    else parts.push({ section: item.section, items: [item] });
  }
  return parts;
}
