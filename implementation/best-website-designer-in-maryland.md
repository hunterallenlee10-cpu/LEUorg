# /best-website-designer-in-maryland — implementation plan

Goal: one page that ranks for "best website designer in Maryland" (quoted
first, then unquoted) and that AI answer engines can quote for that question.

Locked phrase, word for word: **best website designer in Maryland**

## Stack (found in recon, 2026-11-03)

- Next.js 16.3 App Router, React 19, Tailwind v4, TypeScript, pnpm, on Vercel.
- Every page is a server component, prerendered at build time
  (`x-nextjs-prerender: 1` on production), so the full text is in the HTML
  with no JavaScript. No extra prerender step is needed.
- Production domain: **https://www.leeenterprisesunlimited.org** (www; the
  bare domain forwards to it). Source: `site.url` in `data/site.ts`,
  `MAIN_SITE_URL` in `next.config.mjs`, the live robots.txt and sitemap.
- SEO today: per-page `metadata` (title, description, canonical, OG,
  Twitter), an `opengraph-image.tsx` per route drawn with `lib/og.tsx`,
  `app/sitemap.ts`, `app/robots.ts` (allows `/`, disallows `/pay`, names the
  sitemap), JSON-LD inline per page (`@graph`). No `/llms.txt` (404 live).
- Design system: `docs/DESIGN-SYSTEM.md`, `app/globals.css` (`.ds-*`),
  `components/ui/ds.tsx` (`SectionHead`, `StatTiles`), `BookCallLink`,
  `.ds-faq` on native `<details>`, `.ds-card` cut-corner cards,
  `MainHeader` / `MainFooter`. Dark navy/black by default with a light theme.
- No phrase pages exist yet, so this page sets the pattern.
- Git workflow: work on a `claude/*` branch, open a PR, merge to `main`;
  Vercel deploys `main` to production.

## Files

New
- `data/maryland-page.ts` — route, title, description, last-updated date,
  every line of copy, the FAQ (one list feeds the page and FAQPage schema).
- `app/best-website-designer-in-maryland/page.tsx` — the page + JSON-LD.
- `app/best-website-designer-in-maryland/opengraph-image.tsx` — 1200x630.
- `public/llms.txt` — site summary for AI crawlers, with this page listed.

Changed
- `data/navigation.ts` — footer link "Best Website Designer in Maryland".
- `components/layout/MainFooter.tsx` — the link on the Business Mastery
  footer variant too, so it is on every page.
- `app/sitemap.ts` — the URL with a real `lastModified`.
- `components/home/HomeServices.tsx` — contextual link from the homepage
  services area.
- `components/services/ServicePageSections.tsx` + `data/services.ts` —
  contextual link from /services/websites.

## Page outline

- `<title>` Best Website Designer in Maryland | Hunter Lee
- Meta description (~150 chars) with the phrase and the free-call CTA.
- Breadcrumb: Home › Best Website Designer in Maryland
- One `<h1>`: Best Website Designer in Maryland
- Answer-first lead (2 sentences: who, what, for whom in Maryland), CTA,
  "Last updated" line, hero image (LEU site; the one image with the phrase in
  its alt text).
- H2 Website design for Maryland businesses (home services, law firms, real
  estate, fitness, restaurants, online stores)
- H2 What you get (mobile-first, fast, found on Google, clear calls to
  action, connected to lead follow-up)
- H2 How it works (free call → flat quote → build and launch; optional Care
  Plan)
- H2 Recent work (G1 Baseball & Softball Training, Pelican Power Wash, Terps
  Fostering Futures: published client work only, lazy WebP 960x600)
- H2 Why business owners choose LEU (stats + offer terms)
- H2 FAQ (8 Q&As, native `<details>`)
- H2 Final CTA (Book a free call, phone, email, 12-hour reply)
- 800–1,200 words. Variants used once or twice each: Maryland web designer,
  website design in Maryland, Maryland website design company, small
  business websites in Maryland.

## Schema (one `@graph`)

WebPage, BreadcrumbList, ProfessionalService (name, url, logo, telephone,
email, areaServed State Maryland, founder Person Hunter Lee, sameAs Instagram
+ leeenterprisesunlimited.com), Service (serviceType "Website design",
provider → the ProfessionalService, areaServed Maryland), FAQPage built from
the same list as the visible FAQ. No rating, review or award markup.

## Facts rules

Only the facts given in the brief and already in `data/site.ts`. Anything
missing renders as a visible `[PLACEHOLDER: …]`. No prices, no tool names in
copy, no testimonials, no city or county names.

## Verification checklist

Local: `pnpm lint`, `pnpm typecheck`, `pnpm build` clean for this page; HTML
from `pnpm start` has the full text, one h1, title, description, canonical,
OG/Twitter, JSON-LD parses; word count 800–1,200; Lighthouse mobile.

Live (https://www.leeenterprisesunlimited.org/best-website-designer-in-maryland):
- [ ] 200 status
- [ ] exactly one `<h1>`
- [ ] title and meta description
- [ ] self-referencing canonical
- [ ] no `noindex` header or meta
- [ ] JSON-LD parses, types present, FAQ matches visible text
- [ ] OG image 1200x630 returns 200
- [ ] URL in live sitemap.xml with lastmod
- [ ] robots.txt allows it and names the sitemap
- [ ] footer link on the homepage
- [ ] /llms.txt lists the page
- [ ] Lighthouse mobile: SEO 100, A11y ≥95, BP ≥95, Perf ≥90

## Follow-up fixes (2026-11-03)

- The build-timeline question came off the page and the FAQPage schema (no
  answer given yet); the FAQ is 7 questions. Add it back to `marylandFaqs`
  once there is an answer, and both update together.
- G1's card shows its screenshot with no link and no URL label until its
  real domain is confirmed (`linked` / `href` in `marylandWork`).
- Pelican Power Wash is described as LEU's own exterior cleaning brand.
- "plus ads" (SEO answer) and "We show you how to make simple changes
  yourself" (after-launch answer) are off until confirmed.
- `assertNoPlaceholders()` fails the build if any copy on the page contains
  PLACEHOLDER, TODO or square brackets.
