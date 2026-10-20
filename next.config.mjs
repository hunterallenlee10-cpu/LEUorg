import { resolveH1SiteUrl } from "./config/h1-site.mjs";
import { resolveThreadSiteUrl } from "./config/thread-site.mjs";
import {
  BUSINESS_MASTERY_HOST,
  BUSINESS_MASTERY_SITE_LIVE,
  BUSINESS_MASTERY_SITE_URL,
} from "./config/business-mastery-site.mjs";

// The redirects below are the only thing left here that points at the H1 site.
// H1 Performance is no longer one of the ventures this site lists, so no app
// code reads this value any more and it is not exported to the bundles through
// `env`; it is resolved once, here, for the redirect. docs/H1.md.
const H1_SITE_URL = resolveH1SiteUrl(process.env.NEXT_PUBLIC_H1_SITE_URL);

// A 308 is cached by browsers indefinitely and treated by crawlers as a
// permanent move, so it must not ship pointing at a host that might not be the
// final one. While NEXT_PUBLIC_H1_SITE_URL is unset the redirect targets the
// fallback alias and stays a 307 (temporary), which nothing caches hard; set
// the variable to the real domain and it becomes a 308. docs/H1.md §5 spells
// out the wiring and the ordering.
const H1_REDIRECT_PERMANENT = Boolean(process.env.NEXT_PUBLIC_H1_SITE_URL);

// The same arrangement for Thread T-Shirts, which moved to its own site and
// came off this one on 2026-09-25: the redirects below are the only thing left
// here that points at it, so the value is resolved once, here, for them, and
// no app code reads it. docs/THREAD.md, config/thread-site.mjs.
const THREAD_SITE_URL = resolveThreadSiteUrl(
  process.env.NEXT_PUBLIC_THREAD_SITE_URL
);

// The same rule as H1's: a temporary 307 while the variable is unset and the
// target is only the fallback, a permanent 308 once it names the real host.
const THREAD_REDIRECT_PERMANENT = Boolean(
  process.env.NEXT_PUBLIC_THREAD_SITE_URL
);

// Business Mastery's own subdomain, served by this project
// (config/business-mastery-site.mjs, docs/BUSINESS-MASTERY.md). `has` host
// values are regular expressions matched against the whole host, port left
// off. mastery.localhost is there so the subdomain can be tried out under
// `pnpm dev` at http://mastery.localhost:3000.
const BM_HOST = `(?:${BUSINESS_MASTERY_HOST.replace(/\./g, "\\.")}|mastery\\.localhost)`;
const onBmHost = [{ type: "host", value: BM_HOST }];

// The www host, where everything but Business Mastery lives. The same origin
// as `site.url` in data/site.ts, which next.config.mjs cannot import.
const MAIN_SITE_URL = "https://www.leeenterprisesunlimited.org";
// The bare domain too: Vercel forwards it to www, but a rule that only
// matched www would miss a request it let through.
const onMainHost = [
  { type: "host", value: "(?:www\\.)?leeenterprisesunlimited\\.org" },
];

/**
 * Content Security Policy. Everything the site loads is same-origin, Vercel
 * Analytics included (/_vercel/insights).
 *
 * Stripe needs no allowances: invoices are paid on Stripe's own hosted page,
 * and nothing here loads Stripe.js or embeds Stripe UI. If Stripe.js or
 * embedded Checkout is ever adopted, add https://*.stripe.com to script-src,
 * img-src, connect-src and frame-src (replacing its 'none'), and
 * https://*.link.com (Link) to connect-src and frame-src.
 *
 * The same goes for the booking link in data/site.ts: "Book a free call" is a
 * plain link to the scheduler's own page. Embedding a scheduler here instead
 * would need its origin in frame-src and script-src.
 *
 * `'unsafe-inline'` in script-src is required by Next's inline hydration
 * bootstrap. To remove it, generate a per-request nonce in proxy.ts (Next 16's
 * name for middleware) and emit the CSP from there instead. Note that `'unsafe-inline'` is ignored by browsers
 * whenever a nonce or hash is present, so the two cannot simply be combined.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Images are served as-is, and this also turns /_next/image off (it 404s),
  // so there is no optimizer endpoint to attack or bill for. Every <Image> is a
  // small local webp (the footer draws its own 96px logo copy); give any new
  // one a copy sized for its slot rather than turning optimisation on.
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Client billing (docs/PAY.md) stays out of search, on top of the
      // pages' own noindex and the Disallow in app/robots.ts.
      {
        source: "/pay",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/pay/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async rewrites() {
    return {
      // Before the filesystem, or the homepage at app/page.tsx would answer
      // "/" first. A rewrite, not a redirect: the address bar keeps showing
      // mastery.leeenterprisesunlimited.org.
      beforeFiles: [
        { source: "/", has: onBmHost, destination: "/business-mastery" },
      ],
    };
  },
  async redirects() {
    return [
      // Business Mastery's subdomain shows its one page at its root, so the
      // page's own path there goes to the root. Any other page asked for on
      // that host (a mistyped /contact, an old /lee-systems link) goes to the
      // same path on www, where it lives. What the Business Mastery page
      // itself loads is left alone: anything with a dot in it (logos, fonts,
      // robots.txt), anything starting with an underscore (Next's /_next and
      // Vercel's /_vercel), the application form's /api route, and the
      // page's own share image under /business-mastery/. These come first,
      // so no rule below for www can catch a subdomain request.
      {
        source: "/business-mastery",
        has: onBmHost,
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/:path((?!api/|_|business-mastery/)[^.]+)",
        has: onBmHost,
        destination: `${MAIN_SITE_URL}/:path`,
        statusCode: 301,
      },
      // Once the subdomain is live, the www page forwards to it, so a link
      // already shared keeps working and its search placement moves with it.
      // Only on the real domain, so a Vercel preview or `pnpm dev` still shows
      // /business-mastery to work on. A #fragment such as #bm-offer survives
      // the redirect in the browser.
      ...(BUSINESS_MASTERY_SITE_LIVE
        ? [
            {
              source: "/business-mastery",
              has: onMainHost,
              destination: `${BUSINESS_MASTERY_SITE_URL}/`,
              statusCode: 301,
            },
          ]
        : []),
      // The Support Us contribution page and the Partners page came off the
      // site on 2026-09-28 (it covers LEU, Lee Systems Co. and Business
      // Mastery only). Both go to the homepage, as does /sponsors, the name
      // /partners had before 2026-09-18. 301s, like the Lee Marketing Mastery
      // rename below, because the owner asked for 301s on permanent moves.
      {
        source: "/support",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/support/:path*",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/partners",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/sponsors",
        destination: "/",
        statusCode: 301,
      },
      // The owner retired the Lee Systems Co. name on 2026-10-17: everything
      // is Lee Enterprises Unlimited now, and the page moved from
      // /lee-systems to /how-it-works ("How It Works"). Exact paths only:
      // /lee-systems/... also holds the page's pictures in public/, which a
      // wildcard would break. The older redirects below go straight to the
      // new address rather than through this one.
      {
        source: "/lee-systems",
        destination: "/how-it-works",
        statusCode: 301,
      },
      {
        source: "/lee-systems/opengraph-image",
        destination: "/how-it-works/opengraph-image",
        statusCode: 301,
      },
      // The Lee Systems Co. automation and websites pages folded into
      // /lee-systems on 2026-09-29 (now /how-it-works), so each old URL lands on its section
      // there. Permanent, and 301s for the same reason as the rename below.
      // The browser follows the destination's #fragment, so any #anchor on
      // the old URL gives way to the section's.
      {
        source: "/lee-systems/automation",
        destination: "/how-it-works#automation",
        statusCode: 301,
      },
      {
        source: "/lee-systems/websites",
        destination: "/how-it-works#websites",
        statusCode: 301,
      },
      // Their share images went with them. Anything still linking to one (a
      // cached share card, say) gets the page's card instead.
      {
        source: "/lee-systems/automation/opengraph-image",
        destination: "/how-it-works/opengraph-image",
        statusCode: 301,
      },
      {
        source: "/lee-systems/websites/opengraph-image",
        destination: "/how-it-works/opengraph-image",
        statusCode: 301,
      },
      // The law firm and home services pages came off on 2026-09-29 at the
      // owner's request, so a link already sent to a prospect lands on that
      // industry's card in "Who we help" instead, and a cached share card
      // gets the page's.
      {
        source: "/lee-systems/law-firms",
        destination: "/how-it-works#law-firms",
        statusCode: 301,
      },
      {
        source: "/lee-systems/home-services",
        destination: "/how-it-works#home-services",
        statusCode: 301,
      },
      {
        source: "/lee-systems/law-firms/opengraph-image",
        destination: "/how-it-works/opengraph-image",
        statusCode: 301,
      },
      {
        source: "/lee-systems/home-services/opengraph-image",
        destination: "/how-it-works/opengraph-image",
        statusCode: 301,
      },
      // Lee Marketing Mastery became Lee Systems Co. on 2026-09-25 and moved
      // from /lee-marketing-mastery to /lee-systems (now /how-it-works). Same-origin rename with
      // no plan to go back, so these are permanent. 301 rather than Next's
      // default 308 for `permanent: true` because the owner asked for 301s;
      // for page GETs the two are equivalent to browsers and search engines.
      // The two offerings go straight to their sections on /how-it-works
      // rather than through the folded pages' redirects above; the retired
      // Traditional & Digital Marketing page, and any other old path, goes to
      // the main page. Specific rules first: Next uses the first match.
      {
        source: "/lee-marketing-mastery",
        destination: "/how-it-works",
        statusCode: 301,
      },
      {
        source: "/lee-marketing-mastery/automation",
        destination: "/how-it-works#automation",
        statusCode: 301,
      },
      {
        source: "/lee-marketing-mastery/websites",
        destination: "/how-it-works#websites",
        statusCode: 301,
      },
      {
        source: "/lee-marketing-mastery/:path*",
        destination: "/how-it-works",
        statusCode: 301,
      },
      // The old logo and social-sharing image went with the brand. Anything
      // still linking to them (a cached share card, say) gets the new card.
      {
        source: "/og/lee-marketing-mastery.png",
        destination: "/how-it-works/opengraph-image",
        statusCode: 301,
      },
      // H1 Performance moved to its own site on 2026-09-01 and came off this
      // site entirely on 2026-09-03 (docs/H1.md, config/h1-site.mjs). These
      // redirects outlive the listing on purpose: /h1-performance was a real
      // page here for months, and forwarding it carries that URL's inbound
      // links and search placement to the live site instead of landing them on
      // a 404. Nothing on this site links here any more. The H1 site is one
      // page, so any sub-path collapses to its root; a `#section` fragment
      // survives the redirect in the browser and the section ids are unchanged
      // there.
      {
        source: "/h1-performance",
        destination: H1_SITE_URL,
        permanent: H1_REDIRECT_PERMANENT,
      },
      {
        source: "/h1-performance/:path*",
        destination: H1_SITE_URL,
        permanent: H1_REDIRECT_PERMANENT,
      },
      // The coach and athlete photos moved with the page. The new site serves
      // the identical files at the same paths under its own origin, so an old
      // /h1/... image URL (from a cached page, a shared link, a search result)
      // resolves instead of 404ing. :path* is substituted into the destination.
      {
        source: "/h1/:path*",
        destination: `${H1_SITE_URL}/h1/:path*`,
        permanent: H1_REDIRECT_PERMANENT,
      },
      // Thread T-Shirts moved to its own site and came off this one on
      // 2026-09-25 (docs/THREAD.md). Like H1's, these redirects outlive the
      // listing on purpose: /thread-t-shirts was a real page here for months,
      // and the H1 site's footer still links to it for H1 apparel, so it
      // forwards rather than 404ing. Nothing on this site links here any more.
      // The Thread site is one page, so any sub-path collapses to its root; a
      // `#catalog` or `#order-request` fragment survives the redirect in the
      // browser, and the section ids are unchanged there.
      {
        source: "/thread-t-shirts",
        destination: THREAD_SITE_URL,
        permanent: THREAD_REDIRECT_PERMANENT,
      },
      {
        source: "/thread-t-shirts/:path*",
        destination: THREAD_SITE_URL,
        permanent: THREAD_REDIRECT_PERMANENT,
      },
      // The product photos moved with the page. The Thread site serves the
      // identical files at the same paths, so an old /thread/... image URL
      // resolves instead of 404ing.
      {
        source: "/thread/:path*",
        destination: `${THREAD_SITE_URL}/thread/:path*`,
        permanent: THREAD_REDIRECT_PERMANENT,
      },
    ];
  },
};

export default nextConfig;
