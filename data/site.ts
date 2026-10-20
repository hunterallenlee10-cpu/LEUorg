/**
 * Business facts for leeenterprisesunlimited.org. Every component reads them
 * from here, so each fact changes in one place.
 *
 * An empty string or empty list means the fact isn't confirmed yet. Whatever
 * needs it then either hides, or - for the three slots the owner asked to keep
 * visible on 2026-09-28 (the founder photo, the founder bio and the projects) -
 * shows a "coming soon" frame while `showPlaceholders` is true.
 *
 * Never put placeholder text in these values: an empty value is what keeps a
 * stand-in off the page.
 */

export interface Stat {
  value: string;
  label: string;
  /** One sentence on what the figure counts. Rendered under it when set. */
  definition: string;
}

export interface Project {
  /** The name as the live site shows it. */
  name: string;
  /** The kind of business and where, e.g. "Landscaping · Southern Maryland". */
  category: string;
  /** Optional: one line on the result, only numbers the owner can back up. */
  summary?: string;
  /** What we built, as short tags, e.g. ["Website", "Backend automation"]. */
  built: string[];
  /** The live site. The whole box links here. */
  href: string;
  /** For a rebuild: the client's old site, shown as "Upgraded from …". */
  upgradedFrom?: string;
  /**
   * The box's screenshot, a 960x600 webp of the site's first screen, e.g.
   * "/projects/acme.webp". docs/RECENT-BUILDS.md says how it is made.
   */
  image?: string;
}

export interface Tool {
  name: string;
  /** Symbol id in public/tools/sprite.svg. */
  icon: string;
}

export const site = {
  name: "Lee Enterprises Unlimited",
  shortName: "LEU",
  /** The canonical origin. The bare domain redirects here. */
  url: "https://www.leeenterprisesunlimited.org",
  email: "ceo@leeenterprisesunlimited.com",
  /** Shown as a tap-to-call link wherever it appears. "" hides it. */
  phone: "(240) 925-2609",
  /**
   * The LEU call scheduler, such as a Google Calendar booking
   * page. While it is empty, every "Book a free call" goes to the contact
   * form with LEU picked (see `bookHref` below).
   */
  bookingUrl: "",
  /** The reply promise on general inquiries. "" drops the promise. */
  replyTime: "within 12 hours",
  instagramUrl: "https://www.instagram.com/leeenterprisesunlimited",
  /** Footer only. The owner dropped it on 2026-09-28; "" keeps it off. */
  slogan: "",
  /**
   * true: the empty photo, bio and project slots show "coming soon" frames,
   * at the owner's request (2026-09-28). false: every empty slot hides
   * instead, which is what the site fix plan asked for originally.
   */
  showPlaceholders: true,
  /**
   * The owner's video sales letter, in a slot right under the homepage hero.
   * Off until `show` is true and `src` is set. The site's CSP allows media
   * from this domain only (no YouTube or Vimeo embeds), so the video is a
   * file in public/, e.g. "/vsl/leu-vsl.mp4", with an optional poster image.
   * It never autoplays: the visitor presses play.
   */
  vsl: {
    show: false,
    src: "",
    poster: "",
    /** What the video is, read to screen readers and shown under it. */
    title: "",
  },
  founder: {
    name: "Hunter Lee",
    /** e.g. "/images/hunter-lee.jpg". */
    photo: "",
    /** The owner's own words only. */
    bio: "",
  },
  /**
   * The owner's figures, kept exactly as published (confirmed 2026-09-28).
   * The Business Mastery page states the same three in its own copy
   * (`bmProofStatement` and `bmProofPoints` in data/business-mastery.ts), so
   * change them there too if these ever change.
   */
  stats: [
    { value: "50+", label: "Businesses built", definition: "" },
    { value: "1,000+", label: "Businesses worked with", definition: "" },
    { value: "$150,000+", label: "Generated for our clients", definition: "" },
  ] as Stat[],
  /**
   * "Recent Builds": finished work the owner has permission to show, in the
   * owner's order (sent 2026-10-05; Copperleaf, Rocha and Lumen Chapel added
   * 2026-10-07), with our own site last. Names are as each live site shows
   * them. docs/RECENT-BUILDS.md has the format for adding one.
   */
  projects: [
    {
      name: "Pelican Power Wash",
      category: "Exterior cleaning · Maryland",
      built: ["Website", "Backend automation"],
      href: "https://pelicanpowerwash.vercel.app",
      image: "/projects/pelican-power-wash.webp",
    },
    {
      name: "Graystone Contracting",
      category: "Construction · Southern Maryland",
      built: ["Website", "Backend automation", "Ready-to-go template"],
      href: "https://template-greystone.vercel.app",
      image: "/projects/graystone-contracting.webp",
    },
    {
      name: "Sage & Stone",
      category: "Landscaping · Southern Maryland",
      built: ["Website", "Backend automation", "Ready-to-go template"],
      href: "https://landscapingtemplate-eight.vercel.app",
      image: "/projects/sage-and-stone.webp",
    },
    {
      name: "Thread T-Shirts",
      category: "Apparel · Ships worldwide",
      built: ["Website", "Backend automation"],
      href: "https://tread-two.vercel.app",
      image: "/projects/thread.webp",
    },
    {
      name: "H1 Performance",
      category: "Athletic training · Nationwide",
      built: ["Website", "Backend automation"],
      href: "https://h1-three-sandy.vercel.app",
      image: "/projects/h1-performance.webp",
    },
    {
      name: "Terps Fostering Futures",
      category: "Student club · University of Maryland",
      built: ["Website", "Backend automation"],
      href: "https://www.terpsfosteringfutures.com",
      image: "/projects/terps-fostering-futures.webp",
    },
    {
      name: "Fieldhouse Athletic Club",
      category: "Fitness coaching",
      built: ["Website", "Backend automation", "Ready-to-go template"],
      href: "https://fitness-orpin-six.vercel.app/?style=fieldhouse",
      image: "/projects/fieldhouse-athletic-club.webp",
    },
    {
      name: "G1 Baseball & Softball Training",
      category: "Baseball & softball training",
      built: ["Website", "Backend automation", "Ready-to-go template"],
      href: "https://template-zeta-nine.vercel.app",
      upgradedFrom: "https://g1-baseball.com",
      image: "/projects/g1-baseball.webp",
    },
    {
      name: "Copperleaf Grounds Co.",
      category: "Lawn care · Brandywine Valley",
      built: ["Website", "Backend automation", "Ready-to-go template"],
      href: "https://boltlandscaping.vercel.app",
      image: "/projects/copperleaf-grounds.webp",
    },
    {
      name: "Rocha Family Auto Sales",
      category: "Pre-owned vehicles · Sequim, Washington",
      built: ["Website", "Backend automation", "Ready-to-go template"],
      href: "https://rocha-nu.vercel.app",
      image: "/projects/rocha-family-auto-sales.webp",
    },
    {
      name: "Lumen Chapel",
      category: "Church",
      built: ["Website", "Backend automation", "Ready-to-go template"],
      href: "https://template-church-xi.vercel.app",
      image: "/projects/lumen-chapel.webp",
    },
    {
      name: "Lee Enterprises Unlimited",
      category: "Business services · Maryland",
      built: ["Website", "Contact forms", "Narrated videos"],
      href: "https://www.leeenterprisesunlimited.com",
      image: "/projects/leu.webp",
    },
  ] as Project[],
  businessMastery: {
    /** e.g. "$49 a month". */
    price: "",
    /** How it is paid for, confirmed 2026-09-28. The amount isn't set yet. */
    format: "A paid monthly membership",
    /** e.g. "Skool". */
    platform: "",
    /** "apply" keeps the application form; "join" sends people to `joinUrl`. */
    joinMode: "apply" as "apply" | "join",
    joinUrl: "",
    /** Scarcity wording, shown once in the offer section. Removed 2026-09-28. */
    scarcity: "",
    /** Full guarantee terms, once written. */
    guaranteeTerms: "",
    /** What happens once someone joins, in the owner's words (2026-09-28). */
    afterJoining: "Once you join, you're added to our member resources and groups.",
  },
  callAnswering: {
    /** The owner's description of the service (2026-09-28). */
    summary:
      "AI-powered phone systems that act like a 24/7 virtual receptionist and sales assistant.",
    /** Only what the owner has confirmed the system does. */
    capabilities: [
      "Answers calls 24/7",
      "Handles frequently asked questions",
      "Books and reschedules appointments",
      "Qualifies leads",
      "Takes messages",
      "Transfers calls",
      "Texts missed callers",
      "Follows up with leads and past customers",
      "Sends reminders",
      "Updates the CRM automatically",
      "Makes outbound calls for lead follow-up, appointment confirmations, customer reactivation and review requests",
    ],
    /** A number people can call to hear it answer. "" hides the line. */
    demoPhone: "",
  },
  /**
   * The moving strip of tool logos under the homepage hero, in two rows: the
   * owner's two lists of 40, in the owner's order (2026-10-06), which
   * replaced the 2026-09-29 rows, plus xAI after Grok at the owner's ask.
   * The strip reads as "tools we work with", so list only what that's true
   * of. Each `icon` is a symbol id in
   * public/tools/sprite.svg, whose header says where each mark comes from; a
   * new tool needs its icon added there too. An empty list hides the strip.
   */
  tools: [
    [
      { name: "ChatGPT", icon: "chatgpt" },
      { name: "Gmail", icon: "gmail" },
      { name: "QuickBooks", icon: "quickbooks" },
      { name: "Slack", icon: "slack" },
      { name: "Facebook", icon: "facebook" },
      { name: "Jobber", icon: "jobber" },
      { name: "Google Calendar", icon: "googlecalendar" },
      { name: "n8n", icon: "n8n" },
      { name: "Microsoft Outlook", icon: "microsoftoutlook" },
      { name: "Yelp", icon: "yelp" },
      { name: "Canva", icon: "canva" },
      { name: "Google Sheets", icon: "googlesheets" },
      { name: "HubSpot", icon: "hubspot" },
      { name: "Zoom", icon: "zoom" },
      { name: "Claude", icon: "claude" },
      { name: "TikTok", icon: "tiktok" },
      { name: "Notion", icon: "notion" },
      { name: "Google Maps", icon: "googlemaps" },
      { name: "PayPal", icon: "paypal" },
      { name: "WhatsApp", icon: "whatsapp" },
      { name: "Docusign", icon: "docusign" },
      { name: "Microsoft Word", icon: "microsoftword" },
      { name: "Gemini", icon: "googlegemini" },
      { name: "Thumbtack", icon: "thumbtack" },
      { name: "WordPress", icon: "wordpress" },
      { name: "Google Business Profile", icon: "googlebusinessprofile" },
      { name: "Twilio", icon: "twilio" },
      { name: "Trello", icon: "trello" },
      { name: "Zapier", icon: "zapier" },
      { name: "LinkedIn", icon: "linkedin" },
      { name: "Clio", icon: "clio" },
      { name: "YouTube", icon: "youtube" },
      { name: "OneDrive", icon: "microsoftonedrive" },
      { name: "monday.com", icon: "mondaydotcom" },
      { name: "Perplexity", icon: "perplexity" },
      { name: "Telegram", icon: "telegram" },
      { name: "Google Forms", icon: "googleforms" },
      { name: "Wix", icon: "wix" },
      { name: "Dropbox", icon: "dropbox" },
      { name: "Google Chat", icon: "googlechat" },
    ],
    [
      { name: "OpenAI", icon: "openai" },
      { name: "Instagram", icon: "instagram" },
      { name: "Google Drive", icon: "googledrive" },
      { name: "Stripe", icon: "stripe" },
      { name: "Salesforce", icon: "salesforce" },
      { name: "Microsoft Teams", icon: "microsoftteams" },
      { name: "Calendly", icon: "calendly" },
      { name: "Mailchimp", icon: "mailchimp" },
      { name: "Google Docs", icon: "googledocs" },
      { name: "Anthropic", icon: "anthropic" },
      { name: "X (Twitter)", icon: "x" },
      { name: "Square", icon: "square" },
      { name: "Airtable", icon: "airtable" },
      { name: "Microsoft Excel", icon: "microsoftexcel" },
      { name: "Angi", icon: "angi" },
      { name: "Google Meet", icon: "googlemeet" },
      { name: "GoHighLevel", icon: "gohighlevel" },
      { name: "Messenger", icon: "messenger" },
      { name: "Make", icon: "make" },
      { name: "Squarespace", icon: "squarespace" },
      { name: "Google Ads", icon: "googleads" },
      { name: "RingCentral", icon: "ringcentral" },
      { name: "Asana", icon: "asana" },
      { name: "Microsoft Copilot", icon: "microsoftcopilot" },
      { name: "Jotform", icon: "jotform" },
      { name: "Shopify", icon: "shopify" },
      { name: "Google Slides", icon: "googleslides" },
      { name: "Nextdoor", icon: "nextdoor" },
      { name: "Housecall Pro", icon: "housecallpro" },
      { name: "ElevenLabs", icon: "elevenlabs" },
      { name: "Microsoft PowerPoint", icon: "microsoftpowerpoint" },
      { name: "Constant Contact", icon: "constantcontact" },
      { name: "Google Analytics", icon: "googleanalytics" },
      { name: "Discord", icon: "discord" },
      { name: "ClickUp", icon: "clickup" },
      { name: "Meta", icon: "meta" },
      { name: "Grok", icon: "grok" },
      { name: "xAI", icon: "xai" },
      { name: "GoDaddy", icon: "godaddy" },
      { name: "Google Voice", icon: "googlevoice" },
      { name: "Zendesk", icon: "zendesk" },
    ],
  ] as Tool[][],
};

/** The one name for the first step with LEU, everywhere. */
export const bookLabel = "Book a free call";

/**
 * The homepage hero's wording of the same step, from the owner's hero design
 * (2026-09-28). Too long for the header button on a narrow phone, which is
 * why the rest of the site keeps `bookLabel`.
 */
export const bookLabelHero = "Book a Free Consultation";

/**
 * Where every "Book a free call" goes, except the ones in the body of
 * /how-it-works, which scroll down to that page's own form.
 */
export const bookHref = site.bookingUrl || "/contact?interest=free-call";

/** Whether a link leaves the site. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/** A US number as a tel: link, e.g. "(240) 925-2609" -> "tel:+12409252609". */
export function telHref(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}
