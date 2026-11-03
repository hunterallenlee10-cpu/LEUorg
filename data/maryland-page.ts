import { site } from "@/data/site";

/**
 * /best-website-designer-in-maryland: the page built to answer the search
 * "best website designer in Maryland" (the owner's brief, 2026-11-03). Every
 * line of copy is here, and the FAQ list feeds both the visible questions and
 * the FAQPage structured data, so the two can never drift apart.
 *
 * Facts rules (the owner's brief): only facts the owner gave or that
 * data/site.ts already states. No prices, no tool or vendor names, no
 * testimonials, ratings, awards or rankings, no city or county. Anything
 * still missing is left off the page rather than filled with a stand-in;
 * `assertNoPlaceholders` below fails the build if any copy contains
 * "PLACEHOLDER", "TODO" or square brackets.
 */

/** The locked phrase. Used word for word where the brief requires it. */
export const marylandPhrase = "best website designer in Maryland";

export const marylandRoute = "/best-website-designer-in-maryland";

/** The heading's wording of the phrase, also the breadcrumb and link label. */
export const marylandLabel = "Best Website Designer in Maryland";

export const marylandSeo = {
  title: "Best Website Designer in Maryland | Hunter Lee",
  description:
    "Looking for the best website designer in Maryland? Hunter Lee and LEU build fast, mobile-first sites that bring customers in. Book a free call.",
};

/**
 * The visible "Last updated" date and the sitemap's lastmod. Change it
 * whenever the page's copy changes.
 */
export const marylandLastUpdated = "2026-11-03";

/** The answer an AI engine can quote: who, what, for whom in Maryland. */
export const marylandLead = [
  "Hunter Lee is the founder of Lee Enterprises Unlimited (LEU), a Maryland web designer who builds websites that bring customers in. LEU designs fast, mobile-first websites for small businesses across Maryland, from home services and law firms to restaurants and online stores.",
  "Every site is built personally for you, with a flat quote upfront and no hidden fees.",
];

export const marylandAudience = {
  title: "Website design for Maryland businesses",
  body: [
    "If you run a business in Maryland, your website is often the first thing a new customer sees. It should tell them what you do, show them why to pick you, and make it easy to reach you. That is what our website design in Maryland is built around.",
    "We work with any business owner who wants more customers. A few examples:",
  ],
  examples: [
    {
      name: "Home services",
      line: "Your best jobs up front, and a quote request one tap away on a phone.",
    },
    {
      name: "Law firms",
      line: "Practice areas explained plainly, with consultation booking built in.",
    },
    {
      name: "Real estate",
      line: "Listings buyers can browse and filter, with an inquiry button on each one.",
    },
    {
      name: "Fitness",
      line: "Classes, coaching and sign-ups in one place, easy to use on a phone.",
    },
    {
      name: "Restaurants",
      line: "Menu, hours and reservations that load fast for people deciding where to eat.",
    },
    {
      name: "Online stores",
      line: "Product pages and a checkout that let customers buy without calling you.",
    },
  ],
  close:
    "Don't see your kind of business? It doesn't matter. If you have customers, we can build a site that brings in more of them.",
};

export const marylandFeatures = {
  title: "What you get",
  intro:
    "A site built to bring customers in, not a brochure that just sits there. Here is what goes into small business websites in Maryland that we build:",
  items: [
    {
      name: "Mobile-first design",
      line: "Most people find you on a phone. We design for the phone first, then scale up to a laptop.",
    },
    {
      name: "Fast pages",
      line: "Pages load quickly, so visitors don't leave before they see what you do.",
    },
    {
      name: "Found on Google",
      line: "Clear page titles, clean structure and basic local SEO, so Maryland customers searching for what you do can find you.",
    },
    {
      name: "Clear calls to action",
      line: "One clear next step on every page: call, book or ask for a quote.",
    },
    {
      name: "Connected to lead follow-up",
      line: "A lead from your site can get an instant reply, reach your phone and get followed up on a schedule. Nobody slips through.",
    },
    {
      name: "Yours to keep",
      line: "You own your domain and your content.",
    },
  ],
};

export const marylandSteps = {
  title: "How it works",
  intro: "Three steps, from the first call to a live site.",
  steps: [
    {
      name: "Book a free call",
      line: "We look at your business, your current site if you have one, and what the new site needs to do. There is no charge and no obligation.",
    },
    {
      name: "Get a flat quote",
      line: "You get one flat price upfront. No hidden fees, no revenue share and no required ad spend. You pick the contract terms.",
    },
    {
      name: "Build and launch",
      line: "We write the copy, design the pages and build the site. Nothing goes live until you approve it. Then we launch it on your domain and connect your forms.",
    },
  ],
  // The site-wide rule since 2026-10-23 keeps the care plan off every page
  // (data/services.ts). The owner's brief for this page (2026-11-03) asks
  // for it here, so it shows on this page only. Delete this block and the
  // "What happens after launch?" answer's last sentence to take it off.
  carePlan: {
    name: "Optional Care Plan",
    line: "After launch, you can add the Care Plan. We handle hosting, updates, speed and security, so the site stays fast and safe while you run your business.",
  },
};

/**
 * Published client work from `site.projects` only (no templates, no concept
 * previews, no prospects), with one or two lines each built from what
 * data/site.ts says was built. G1 is the owner's approved showcase.
 */
export const marylandWork: {
  title: string;
  intro: string;
  items: { project: string; linked: boolean; href?: string; line: string; alt: string }[];
} = {
  title: "Recent work",
  intro: "Real sites we built and launched. Each one is live, so open it and look around.",
  items: [
    {
      project: "G1 Baseball & Softball Training",
      // No link: the build's address is a preview URL, and the owner hasn't
      // given G1's real domain yet. Add `href: "https://..."` here to link it.
      linked: false,
      line: "A rebuild of the old g1-baseball.com for a baseball and softball training business. We built the new website and the backend automation behind it.",
      alt: "G1 Baseball & Softball Training website, first screen",
    },
    {
      project: "Pelican Power Wash",
      linked: true,
      line: "LEU's own exterior cleaning brand in Maryland. We built its website and the backend automation behind it.",
      alt: "Pelican Power Wash exterior cleaning website, first screen",
    },
    {
      project: "Terps Fostering Futures",
      linked: true,
      line: "A website for a student club at the University of Maryland, with backend automation built in.",
      alt: "Terps Fostering Futures student club website, first screen",
    },
  ],
};

export const marylandWhy = {
  title: "Why business owners choose LEU",
  body: [
    `When you search for the ${marylandPhrase}, look for three things: work you can open and see live, a price you know before you start, and a site you own when it's done. That is how we work.`,
    "As a Maryland website design company, we keep the terms simple:",
  ],
  terms: [
    "A flat upfront quote",
    "No hidden fees",
    "No revenue share",
    "No required ad spend",
    "You pick the contract terms",
    "Built personally for you",
  ],
};

export interface MarylandFaq {
  question: string;
  answer: string;
}

/** Shown on the page and in FAQPage data, word for word. */
export const marylandFaqs: MarylandFaq[] = [
  {
    question: "How much does a website cost?",
    answer:
      "Every site gets a flat quote on the free call. The price depends on how many pages you need and what the site has to do. There are no hidden fees and no revenue share.",
  },
  {
    question: "Do you only work with businesses in Maryland?",
    answer:
      "No. We're based in Maryland and build for businesses across Maryland, and we work with businesses in other states too.",
  },
  {
    question: "Do you handle Google and SEO?",
    answer:
      "Yes. Basic SEO is part of every build, so local customers can find you on Google. If you want more, we also do Google Maps and local SEO work.",
  },
  {
    question: "Can you redo my current website?",
    answer:
      "Yes. We look at what is working on your current site and what is worth keeping, then rebuild it. A redesign can carry over the pages Google already ranks.",
  },
  {
    question: "Who owns the website?",
    answer:
      "You do. You own your domain and your content. If you ever move to another provider, the site goes with you.",
  },
  {
    question: "What happens after launch?",
    answer:
      "After launch, the optional Care Plan covers hosting, updates, speed and security, so the site stays fast and safe while you run your business.",
  },
  {
    question: "How do I get started?",
    answer: `Book a free call. You can also call ${site.phone} or email ${site.email}. We answer inquiries ${site.replyTime}.`,
  },
];

export const marylandCta = {
  title: "Ready for a website that brings customers in?",
  body: "Book a free call. We'll look at your business and give you a flat quote. Or reach out directly:",
};

/** "2026-11-03" -> "November 3, 2026", fixed to UTC so the build's zone can't shift it. */
export function formatLastUpdated(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Fails the build if any copy on the page still holds a stand-in: the words
 * PLACEHOLDER or TODO, or square brackets. The page calls it at build time.
 */
export function assertNoPlaceholders(): void {
  const strings: string[] = [];
  JSON.stringify(
    [marylandSeo, marylandLead, marylandAudience, marylandFeatures, marylandSteps, marylandWork, marylandWhy, marylandFaqs, marylandCta],
    (_key, value) => {
      if (typeof value === "string") strings.push(value);
      return value;
    }
  );
  const bad = strings.filter((text) => /PLACEHOLDER|TODO|[[\]]/i.test(text));
  if (bad.length > 0) {
    throw new Error(`Placeholder copy on ${marylandRoute}: ${bad.join(" | ")}`);
  }
}
