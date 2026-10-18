# Redesign study: university.com → LEU

Captured 2026-10-18 with Playwright (Chromium), 1440px and 390px, full page.

## Screenshots in this folder

| File | Page |
| --- | --- |
| `university-home-{1440,390}.png` | https://www.university.com/ (design reference) |
| `net-home-*`, `net-how-it-works-*`, `net-services-*`, `net-contact-*`, `net-legal-*` | https://www.leeenterprisesunlimited.net (latest content, the "before") |
| `com-home-*` | https://www.leeenterprisesunlimited.com (older version, still says Lee Systems Co.) |

## university.com design system (from computed styles)

**Colors.** Light page, not dark: `--background #f9fbfc`, `--altbackground #f2f5fb`,
`--foreground #0f2346` (navy). Full-bleed black (`#000`) feature bands, a
`#17479A` blue stat band, `#d4d5d6` grey for the "old path" card. The only
green is the hand-drawn swoosh under the hero headline.

**Type.** Three faces:
- Display/body: SF Pro Display (self-hosted). H2 55px / 68px line height, 700, letter-spacing -1px, **Title Case** (not all caps).
- Hero H2: IBM Plex Mono 80px / 80px, 700, ALL CAPS ("MAKE MONEY TODAY"). The only all-caps headline on the page.
- Eyebrows: IBM Plex Mono 18px, 400, letter-spacing 15px (very wide), caps typed in the source.
- Body: 19px / 28.5px, weight 500. FAQ answers 19px / 27px.
- Stat numbers: 55px / 45px, 700; stat labels: Plex Mono 24px.

**Buttons.** One shape everywhere: square corners, 2px navy border, 1px gap,
then a filled inner block (14px × 36px padding, 20px bold text, min width
266px on desktop, full width on mobile). It reads as a double border.
Hover: inner fill turns white and text turns navy, 300ms ease
(`cubic-bezier(0.4,0,0.2,1)`). No radius, no shadow, no transform.
Secondary ("Log In", "Show More"): same shape, pale fill, navy text.

**Signature shape: chamfered corners.** Cards, the stat band, the black
feature bands, the two-paths cards and the closing banner all have one or two
corners cut at 45°. Built with rotated squares in the page color laid over the
corner (not `clip-path`).

**Hand-drawn accents.** PNG scribbles: `underline_2.png` (158×15) under a
word in a heading ("Years Behind"), a green swoosh under the hero headline,
and dashed curly arrows (`arrow_left.png` / `arrow_right.png`, 108×73)
pointing in at the hero CTA from both sides.

**Proof line.** Under the hero CTA: a 100×43 stack of three overlapping round
avatars + "155K+ Students Enrolled" (16px bold).

**Stat tiles.** One wide band (1120px, 150px tall, 30px padding), blue, three
columns `justify-evenly`, number on top, mono label under, chamfered
top-left and bottom-right corners.

**Sections.** No vertical padding on sections; spacing is top margin:
80px (`mt-20`) typical, 96px and 128px before big blocks, 48–64px on mobile.
Content width ~1140px. Mobile gutter 30px.

**Alternating rows.** Full-bleed black band, text left (H2 + 3 check-mark
bullets + button), device image right; next row flips on the page background.

**Two paths.** Eyebrow "CHOOSE YOUR PATH", a T-shaped arrow diagram above two
cards: grey "old way" card left, navy "new way" card right, a circular "VS"
badge between, each with a price, a paragraph and its own button. Stacks on
mobile.

**Wins grid + "Show more".** 3-column grid of chamfered screenshot cards.
12 items: 9 shown on desktop; on mobile a few are shown and a secondary
"Show More" button reveals the rest.

**Closing banner.** Full-width (content width) blue band with chamfered
corners, one big line, white button, and a fake-urgency line ("Limited Spaces
Left") — we will **not** copy the urgency line.

**FAQ.** Two columns: left = H2 "Frequently Asked Questions", a disclaimer
paragraph, legal links, support email; right = stacked navy bars (4px gap),
white 20px question text, a "+" icon right, 24px padding. Answer slides open
(500ms ease).

**Motion.** One entrance pattern: blocks start `opacity:0;
translateY(60px)` and transition to rest over 400ms when scrolled into view.
Carousels with prev/next round arrow buttons and a segmented progress bar.
No other keyframe animation besides a spinner.

## Repo audit (source: `hunterallenlee10-cpu/LEUnet`, branch `main`)

`LEUorg` is empty (no commits). The .net content matches `LEUnet@main`.
The .com site deploys from the private `leu` repo (Vercel project `leu.com`).

- **Framework:** Next.js 16.3 App Router, React 19, Tailwind CSS v4, TypeScript, pnpm. GSAP, Lenis smooth scroll, three.js (BM page). `@vercel/analytics`. Fonts via `next/font` (Geist). Strict CSP in `next.config.mjs` (self-hosted fonts/images only).
- **Routes:** `/`, `/how-it-works`, `/services`, `/services/[slug]` (websites, get-found, ai-calls, follow-up, content, custom-ai), `/contact`, `/legal`, `/book` (redirect), `/business-mastery` (served on the mastery subdomain via `proxy.ts`), `/pay/*` (billing), `/api/contact`, `/api/lee-systems-inquiry`, `/api/business-mastery-application`, `/api/stripe/*`, `robots.ts`, `sitemap.ts`, `not-found.tsx`.
- **Facts in one place:** `data/site.ts` (phone, email, IG, reply time, stats, 12 projects, tools), `data/services.ts` (six service groups), `data/lee-systems.ts` (how-it-works FAQ + "Flat upfront quote / No hidden fees / No revenue share / No required ad spend").
- **Contact form:** `components/contact/ContactForm.tsx` → POST `/api/contact`. Honeypot: visually hidden input `id="contact-website-ext" name="website"`, sent as `honeypot`; the route silently accepts and drops any submission where it is non-empty. Shared validation in `lib/validation.ts`. Email via Resend (`lib/email.ts`).
- **ROI calculator:** `components/sections/MissedRevenueCalculator.tsx`, three switchable parts (missed calls, website leads, busywork), styles `.calc-*` in `globals.css`, estimate note under it.
- **Integrations marquee:** `components/sections/ToolsMarqueeSection.tsx`, two rows from `site.tools`, icons from `public/tools/sprite.svg`.
- **The Journey:** `BmJourneyLocked` (shown while `BM_JOURNEY_LOCKED` is true) / `BmJourneyTimeline`. Heading renders "THE / JOURNEY" across two lines; the missing-space bug shows up in text extraction ("TheJourney").
- **OG images:** `app/**/opengraph-image.tsx` per route, drawn by `lib/og.tsx` from `public/logos/leu-logo.png`.
- **Legal:** `/legal` → `components/sections/LegalSection.tsx`.
- **Theme:** dark by default with a light/dark toggle in the header (`components/ui/ThemeToggle.tsx`, `lib/theme.ts`, ~57 light-theme rules in `globals.css`).
- **Logo:** currently the silver LEU logo (commit `4761915` swapped gold → silver on 2026-10-17). The gold version is recoverable from git history.
- **"Lee Systems":** no visitor-facing text left on .net; it survives only in component/file names and code comments.
