# How It Works (formerly Lee Systems Co.)

> **2026-10-17:** the owner retired the Lee Systems Co. name; everything is sold
> as Lee Enterprises Unlimited. This page is now **How It Works** at
> `/how-it-works` (`/lee-systems` and every older URL below 301-redirect
> there). Its hero label reads "How it works", the share card and structured
> data say Lee Enterprises Unlimited, and lead emails start "LEU:". The rest of
> this document keeps the old name where it records history.

Lee Systems Co. ("A Lee Enterprises Unlimited company") replaced Lee Marketing
Mastery on 2026-09-25. It sells **AI automation** (the lead offer, AI call
answering included) and **website builds**. Websites were sold with a pay-after-the-build guarantee until
2026-09-28, when the owner stopped offering it; the site no longer makes that
claim anywhere. The first step is always a free consultation call, booked with **"Book a
free call"**.

## Pages

Everything about Lee Systems Co. is on one page, `/lee-systems`. The
automation and websites pages folded into it on 2026-09-29, and their URLs
301 to its sections; the law firm and home services pages came off the same
day and 301 to their cards in "Who we help" (see Redirects below).

| URL | What it is | Built from |
| --- | --- | --- |
| `/lee-systems` | The page, in order: hero, two paths, the website video, what we do (`#services`: the six service groups as cards with looping mini-previews, each linking to its page under `/services`, then "Try the demos"; `LeeSystemsServicesSection`, content in `serviceGroups` in `data/services.ts`, see [SERVICES.md](SERVICES.md). It replaced the two offerings side by side, `LeeSystemsOfferingsSection`, on 2026-10-17), the live demo under it (the website `#websites` catching a lead, then the workflow `#automation` handling it), the week film ("Watch one system run your week", `#full-week`), who we help (`#industries`), Recent Builds, onboarding process (Audit, Build, Take off, then a "Book a free call" button), FAQ (`#faq`), the choice is yours, and the form (`#contact-form`) | `app/lee-systems/page.tsx`, `components/lee-systems/` |

What came over from the folded pages: the automation page's seven areas
(AI call answering first, full width; it was titled "Calls" there), its
industry cards with their example lists (which replaced the main page's
shorter cards), its FAQ and its form; the websites page's "Included in every
site", its FAQ and its form; and each page's hero animation (below). Their
heroes, the automation page's "The problem", the websites page's "How
pricing works", both process sections (the onboarding process covers them)
and the "See automation" bridge did not come over. The seven areas and
"Included in every site" came off again the same day (see What was retired),
and the industry cards became picture cards (see Who we help).

## The live demo

Since 2026-09-30 one live demo shows the two offerings working as one, at
the owner's ask: the website we build catches a lead, and the system we
build handles it. It replaced the two animations that sat side by side
under What we do, "Your site" (`WebsiteBuildDemo`) and "Example: a new
lead" (`AutomationFlowDemo`), and the section that held them
(`LeeSystemsExamplesSection`).

| Component | What it shows | Where it is now |
| --- | --- | --- |
| `LeeSystemsLiveDemoSection` (`components/lee-systems/LeeSystemsLiveDemoSection.tsx`) | One composition down the middle of the page, captioned "01 — Your website catches the lead" and "02 — Your system handles it", with no panel around it: a browser window at yourbusiness.com over a soft gold glow, and under it the workflow's cards and wires on the page itself. One loop of about 23 seconds (slowed from 14 at the owner's ask, 2026-09-30, the page's load-in most of all, so each section is seen arriving): the page loads and its three sections build in, each lighting its step marker; a visitor types "Alex", "(240) 555-0142" and "Looking for a quote" a character at a time and the button reads "✓ Sent"; the three values gather into one lead chip ("Alex · website"), which leaves the button along a gold line with a light trail and settles into "New lead"; the run splits to the instant reply and the intake form, meets in your CRM and fans out to follow-up, the booked appointment ("Tue · 10:00 AM") and the daily report, each card lighting and ticking in turn; the booked appointment lights brightest and holds for about two seconds, and everything fades back to idle together | Straight under What we do: `<LeeSystemsLiveDemoSection />` in `app/lee-systems/page.tsx`. The website half carries the `#websites` id and the workflow half `#automation`, so the old URLs that redirect to them land on their half |

- **One line joins the halves.** The form's button and "New lead" are both
  centred on the composition, so the gold line between them runs straight
  down the middle, and the chip lands in a slot in the middle of "New
  lead". The name in the chip is built from the name typed into the form,
  so the two can't disagree.
- **Self-contained.** Its copy, timing and styles are all in the one file (a
  `<style>` React hoists into the page head once), and it takes only the
  anchors and the optional call-answering line from `data/`. Moving it is
  moving its one line.
- **How it runs.** A small requestAnimationFrame clock, not an animation
  library: `render(t)` draws the whole demo at any moment of the loop, and
  it writes only transforms, opacities and the connectors'
  `stroke-dashoffset`. The lines are measured from where the layout put the
  button and the cards, and re-measured on resize.
- **When it plays.** Only while it is on screen (an IntersectionObserver)
  and the tab is showing; it holds its frame otherwise. It starts once its
  top has come a third of the way up the screen, so the page is seen
  loading from the start. Its timing is the block of constants near the
  top of the file (`REVEAL`, `STEP_IN`, `CHAR_SECONDS`, `TRAVEL_SECONDS`
  and so on), so making it faster or slower is changing those.
- **Reduced motion.** It draws the finished run as a still: the form sent,
  the lead in "New lead", every card ticked and the appointment booked.
  Without scripting the markup is that same still, without the lines.
- **Phones.** The website inside the window reflows rather than shrinking,
  so no text anywhere in the demo is under 11px, and below 640px the last
  three cards become a list fed by one trunk line. At 1440 by 900 the whole
  composition fits on one screen under the header, so the form being sent
  and the lead reaching "New lead" are always in view together.
- **Accessibility.** The demo is one `role="img"` with a one-sentence
  description of the flow; everything inside it is hidden from assistive
  technology. The call-answering line under it
  (`site.callAnswering.demoPhone`, shown only once it is set) stays outside,
  as a real link.
- **What it claims.** Only what the page already says the systems do. "Your
  Business" stands for the visitor's own site, Alex is an example lead, and
  the phone number is in the 555-0100 to 555-0199 range kept for fiction.

## Who we help

"Who we help" (`LeeSystemsIndustriesSection`, `#industries`) is a grid of
picture cards after The Real World's campus cards, which the owner sent as
the reference on 2026-09-29. Each card is a picture with the industry's name
set over it (Geist bold in brass, the site's headline style; it was a
Cormorant Garamond italic until 2026-09-30), the industry's one-line
summary, and a small uppercase "See examples" that opens the industry's list
on the card. Only one card's list is open at a time, and opening one leaves
the others their size.

The six pictures go in `public/lee-systems/industries/`, one per industry id
(`law-firms.webp`, `home-services.webp`, `real-estate.webp`, `fitness.webp`,
`dealerships.webp`, `restaurants.webp`), each 800 x 450 WebP, and a card
shows its picture once its id is in `pictured` at the top of the component.
They were generated with Everygen (Nano Banana 2) on 2026-09-29, at the
owner's choice over code-drawn art or waiting for photos, all to one brief:
a low-key, black-and-gold editorial photograph of an empty room or building
(a law office, a roofline, a house at dusk, a gym, a car showroom, a
restaurant), with no people, text, signage or logos, so nothing in them
stands for a client or a result. They are decorative (empty alt text), since
each name is set over its picture as text.

All six went in on 2026-10-06, cropped from Everygen's 1376 x 768 to 800 x
450. Each loads over a brass glow drawn in CSS, which is also what a card
shows if its id is taken out of `pictured`. To use a photo instead, save it
under the industry's file name at 800 x 450.

## Two paths, and the choice

Two sections of the main page follow The Real World's landing page
(jointherealworld.com), which the owner sent as the reference on 2026-09-29.

- **Two paths** (`LeeSystemsTwoPathsSection`, `TwoPathsDemo`), straight after
  the hero: a "24/7" badge, "Two paths. Only one gets the customer.", and a
  video-style frame of three panels (calls, follow-up, intake + CRM) with a
  play button. Under it the line splits into two paths with a VS between
  them, each labelled with what it does to your customers and titled with
  what it does to your money: "Lose customers / Lose money" (the owner's
  wording, 2026-09-29), in the red of money lost, against "Win customers /
  $0 to start" in gold. Each path's line is the same two jobs, answering
  and following up, done by hand ("Answer when you can. Follow up when you
  remember. Miss a call, and someone else gets paid for the job.") and by AI
  ("AI answers every call, day or night, and follows up until they reply.
  They book with you, not whoever answers next."). Under the gold button,
  "No obligation · Flat upfront quote", from the FAQ and the pricing
  promise. The frame is one narrated video (see "The Two paths video"
  below): one example lead (a customer calling at 11:48 PM) handled by hand,
  then with AI. The play button starts it, and "Do it by hand" starts it at
  the by-hand run. Every line of the example is something the site already
  says the systems do, and the frame is labelled "Example".
- **The choice is yours** (`LeeSystemsChoiceSection`) is the page's closing
  pitch: a dim "Do nothing" card beside a lit "Take action" card, the same six
  jobs done by hand and by the systems, a red "−$10,000s lost to missed leads"
  opposite a gold "+$10,000s you could win from the same leads", the pricing
  promise as fine print, then
  "Rather call or email?". "Do it your way" is a real link: it opens Indeed
  (indeed.com) in a new tab, says "Your
  competitors are hoping you pick this one." and nudges the other card. The
  form follows it.

The "$0" in Two paths is the free consultation call, the only price the site
states; "to start" sits beside it so it can't be read as the price of the
AI. The two figures on the choice cards are the owner's (2026-09-29):
doing nothing costs tens of thousands, taking action can make tens of
thousands. The loss read "thousands" until 2026-09-30, when the owner
asked for it to match the gain.
They replaced a "−$$$" sign and "$0 / consultation call". They are ranges,
not results: the gain says "could", and neither names a client or a job. The
gold buttons are `BookCallLink variant="glow"`, and like every other "Book a
free call" in the page's body they scroll to the form.

### The Two paths video

The owner asked on 2026-09-29 for the frame's two runs (with AI from the
play button, by hand from "Do it by hand") to become one video with sound,
its captions read aloud. It plays in this order: "What happens to your next
lead?", the by-hand run ("First, by hand." through "They'd already booked
with someone who answered."), the AI run ("Now the same call, with AI."
through "Booked before you woke up.") and "Two paths. Only one gets the
customer." The lines are the old captions, plus the two run titles and the
closing line; "And" was added to the start of the CRM line so it reads
naturally aloud.

- **The lines** are in `data/two-paths-video.ts`: each line's caption, what
  the voice says where it differs ("11:48 PM" is read "Eleven forty-eight
  PM"), what the three panels show and how long a pause follows it. The
  voice and the captions both come from there, so they can't disagree.
- **The soundtrack** is one file, `public/lee-systems/two-paths/two-paths.mp3`
  (about 40 seconds): Everygen voiceovers of the lines in the Pham voice
  (the owner's pick, at its default settings: speed 0.9, stability 60,
  similarity 80, style 80, speaker boost on), one clip per line, spaced out,
  with quiet sound effects drawn in code 10 to 14 dB under them (the phone ringing, a voicemail
  beep, the callback ringing out, a clock ticking through the by-hand run,
  a whoosh into the AI run, the pickup, a text arriving, a saved chime and
  a warm chord on "Booked"). It loads only when someone reaches for the
  video.
- **The timing** (`data/two-paths-video.timing.json`) says when each
  caption appears. The video's clock is the soundtrack itself, so the
  captions can't drift from the voice. If the audio can't play, or the
  lines were changed without rebuilding it, the video plays silently on
  estimated times instead.
- **Controls**: nothing plays until the play button is pressed. Clicking the
  picture pauses and resumes it, and the corner buttons pause, turn the
  sound off and turn the captions off. It pauses by itself once scrolled
  out of view, and when the website video under it starts (and the other
  way round), so two voices never overlap. The progress bar has two chapters, grey by hand and gold
  with AI, and the "Example" tag names the run that's playing. The fork
  under the frame lights the path the video is on.
- **Screen readers** hear the voice while the sound is on. With the sound
  off, each caption is read from a polite live region instead, so no line
  is heard twice.

### The website video

Straight under Two paths, a second narrated video in the same frame, style
and voice (the owner's ask, 2026-09-29): the same visit to an outdated
site, then to a site built right (`LeeSystemsWebsiteVideoSection`,
`WebsiteVideo`, lines in `data/website-video.ts`). The owner's brief was to
promote no particular AI features, just that the site is built properly,
catches attention, looks beautiful and brings in business. So its claims
are the ones the site already makes of a build: fast on a phone, clear
about why to choose you, a form that's easy to find, built to turn
visitors into customers. The outdated site is a general example, not a
real one.

- **Order**: "Someone finds your business online. Do they stay?", the
  outdated site ("First, an outdated site." through "So they book with the
  next business on the list."), the site built right ("Now the same visit,
  on a site built right." through "A visitor, turned into a customer.") and
  "Beautiful gets them to stay. Built right gets them to book.", which is
  also the section's heading, as "Two paths. Only one gets the customer."
  is for the video above it.
- **Panels**: Speed, Design and Leads, tinted blue, brass and green. The
  outdated run drains them to Still loading, Looks dated and Tab closed;
  the built-right run lights them Loaded fast, Looks the part and Request
  sent. The "Example" tag reads "Outdated site", then "Built right".
- **Sound**: the same Pham voice and settings, one clip per line, with a
  tap, a page that keeps loading, the clock ticking while they wait and a
  low note as they leave, then the whoosh, a snap as the page opens, a
  shimmer on the look, a message sent and the warm chord. About 39
  seconds, `public/lee-systems/website-video/website-video.mp3`.
- **Under it**: no fork, since Two paths just made the choice. A lit brass
  line runs down to "Book a free call" (it scrolls to the form, like every
  button in the page's body), with "Quoted per project · You own your
  domain and content" under it, both from the FAQ.

### The player, and rebuilding the audio

Both videos play in one player, `components/lee-systems/NarratedVideo.tsx`
(`useNarratedVideo`, which returns the frame, the run it's on and a way to
play one run from outside it), with the shape of a line in
`data/narrated-video.ts`. Each video is two runs of one example: "before"
(the worse way) and "after" (Lee Systems Co.'s), with a line either side.

To change a line or the voice: edit the video's lines, generate an Everygen
voiceover of each line on its own (the `spoken` text where a line has
one), save each as `<line id>.wav` in one folder (lines that repeat, like
"11:48 PM" and "They tap your site from their phone.", can share one clip),
then run

```bash
node scripts/build-video-audio.mjs two-paths path/to/folder
node scripts/build-video-audio.mjs website path/to/folder
```

with ffmpeg on the PATH (or `FFMPEG=/path/to/ffmpeg`). It rewrites that
video's soundtrack and timing file; each video's sound effects are in the
script's `videos` table. One clip per line rather than one read of all of
them: Pham reads briskly and runs one line into the next with no pause to
cut at.

What AI call answering does is the owner's own list, word for word, in
`site.callAnswering` (`data/site.ts`); the FAQ's "What can the AI phone
assistant do?" says the same. It led the page's "What we automate" cards,
full width, until those came off (2026-09-29, below). Its demo line, once
`callAnswering.demoPhone` is set, sits under the automation animation.

Shared copy (brand details, the FAQ, industries, the pricing promise, the
form's choices) is in `data/lee-systems.ts`. Business facts (phone, email,
the booking link, the reply time) are in `data/site.ts`.

## Booking

Every "Book a free call" on the site goes through `BookCallLink`
(`components/ui/BookCallLink.tsx`) to `bookHref` in `data/site.ts`:

- `bookingUrl` set (a Google Calendar booking page, say): straight to it.
- `bookingUrl` empty (today): `/contact?interest=lee-systems`, the contact form
  with Lee Systems Co. already picked.

The exception is the body of `/lee-systems`: its hero, Two paths and The
choice is yours buttons scroll down to the page's own form (`#contact-form`)
whatever `bookingUrl` says. The header's button follows `bookHref` like
everywhere else.

`/book` forwards to the same place, for print and word of mouth. The forms'
thank-you messages and the "Rather talk now?" blocks show a "Book a free call"
button only once `bookingUrl` is set; on `/lee-systems` that button, above
the form, goes to the booking page.

The offer changed on 2026-09-28 at the owner's request: the free
**Automation Audit**, with its written plan in 5 business days, became a free
**consultation call** followed by a flat quote up front.

## Forms

| Form | Endpoint | Email subject |
| --- | --- | --- |
| The Lee Systems form on `/lee-systems` (name, business name, email, phone, what they need, industry, current website, message), when they pick "Website or online store" | `/api/lee-systems-inquiry` | `Lee Systems Co.: New Website Request from {name}, {business}` |
| The same form, for any other choice (get found & get leads, AI call answering, follow-up & booking automation, content & social media, custom AI tool, not sure) | `/api/lee-systems-inquiry` | `Lee Systems Co.: New Consultation Request from {name}, {business}` |
| The shared contact form, with Lee Systems Co. picked | `/api/contact` | `[Lee Systems Co.] New inquiry from {name}` |

The Lee Systems form replaced the automation consultation form
(`/api/automation-audit`) and the website quote form (`/api/website-inquiry`)
on 2026-09-29, and delivers each request exactly as the old form for that
kind of request did, so the inbox and its filters see no change. Since
2026-10-19 it, the contact form and the Business Mastery form all send
through Resend to ceo@leeenterprisesunlimited.com, fixed in code
(`DEFAULT_TO_EMAIL` in `lib/email.ts`, from `site.email`). The old recipient
variables (`LEE_SYSTEMS_TO_EMAIL`, `LMM_TO_EMAIL`, `WEBSITE_TO_EMAIL`,
`CONTACT_TO_EMAIL`, `BM_TO_EMAIL`) are no longer read.

The form sits in `#contact-form` and keeps the two old forms' anchor ids,
`audit` and `website-quote`, on wrappers around it, so links made for either
still land on it.

## Redirects (301, `next.config.mjs`)

| Old | New |
| --- | --- |
| `/lee-systems/automation` | `/lee-systems#automation` |
| `/lee-systems/websites` | `/lee-systems#websites` |
| `/lee-systems/automation/opengraph-image`, `/lee-systems/websites/opengraph-image` | `/lee-systems/opengraph-image` |
| `/lee-systems/law-firms` | `/lee-systems#law-firms` |
| `/lee-systems/home-services` | `/lee-systems#home-services` |
| `/lee-systems/law-firms/opengraph-image`, `/lee-systems/home-services/opengraph-image` | `/lee-systems/opengraph-image` |
| `/lee-marketing-mastery` | `/lee-systems` |
| `/lee-marketing-mastery/automation` | `/lee-systems#automation` |
| `/lee-marketing-mastery/websites` | `/lee-systems#websites` |
| `/lee-marketing-mastery/marketing` (retired) | `/lee-systems` |
| any other `/lee-marketing-mastery/*` | `/lee-systems` |
| `/og/lee-marketing-mastery.png` | `/lee-systems/opengraph-image` |

## Still to fill in (all in `data/site.ts`)

| What | Key | Until then |
| --- | --- | --- |
| Booking link | `bookingUrl` | "Book a free call" goes to the contact form (on `/lee-systems`, the page's own form) |
| More finished builds ([RECENT-BUILDS.md](RECENT-BUILDS.md)) | `projects` | "Recent Builds" shows nine builds on a 360° ring that turns every 3 seconds; with fewer than three, "More builds coming soon" boxes fill it out |
| Call-answering demo number | `callAnswering.demoPhone` | No demo line under the automation animation |

Set `showPlaceholders` to `false` to hide every "coming soon" frame at once;
empty slots then disappear instead.

## Settled choices

- One page for Lee Systems Co. (2026-09-29), with no industry pages.
- No logo: the name is set as a wordmark (the owner's call, 2026-09-28). The
  "LS" stand-in square is gone from the pages and the link previews.
- No location or service area anywhere, including the business info search
  engines read (an Organization, with no address). The owner's call,
  2026-09-28.
- Pricing promise: flat upfront quote, no hidden fees, no revenue share, no
  required ad spend, you choose the contract terms.
- Website pricing: quoted per project (no price shown), and no typical build
  time until real builds back one up.
- Accent color: brass `#D4A857` (`--color-brass-*` in `app/globals.css`).
- The venture's internal id stays `lmm` so existing Stripe invoice tags still
  match.

## What was retired

- The Traditional & Digital Marketing page, its form and `/api/marketing-inquiry`.
- The Lee Marketing Mastery hub components, logo PNG and social-sharing image.
- The "Results" placeholder boxes, the four portfolio placeholder cards and the
  "Typical build time" box (2026-09-28).
- `MARKETING_TO_EMAIL` in `.env.example` (nothing reads it now; it can be
  removed from Vercel too).
- The `/lee-systems/automation` and `/lee-systems/websites` pages
  (2026-09-29), with their share images, `components/automation/`,
  `components/websites/`, the pill linking each to the other
  (`LeeSystemsSiblingLinks`), the parked "What gets automated" grid
  (`LeeSystemsAutomatesSection`) and the two form routes,
  `/api/automation-audit` and `/api/website-inquiry`.
- The `/lee-systems/law-firms` and `/lee-systems/home-services` pages
  (2026-09-29, at the owner's request), with their share images, the
  "See the page" links on their cards, `IndustryPage`, and the two sections
  only they used: the "No surprises on price." band
  (`PricingPromiseSection`) and `LeeSystemsFinalCTA`. The pricing promise
  itself stays, as the fine print in "The choice is yours".
- The seven "What we automate" cards (AI call answering, leads, sales
  follow-up, client communication, reviews and referrals, billing, internal
  operations) and the six "Included in every site" cards with the add-ons
  note under them (2026-09-29, at the owner's request). Both sections keep
  their headings and their animations. The automation heading is now the old
  automation page's headline, "Every lead answered. Every follow-up sent.
  Nothing missed.", and the websites label reads "Website builds". The
  offerings in "What we do" and the FAQ still cover what the cards said, and
  the "See everything we automate" links became "See what we automate".
- The "Explore automation" and "See website builds" buttons under the two
  halves of "What we do", and the two dashed routes that curved from them
  into a node under the spine (2026-09-30, at the owner's request). The
  spine ran straight on into the two sections and opened them instead (the
  seam, itself retired the same day, below). The dotted-line style only
  that join used (`.ls-dash`) went with it.
- The text of What we automate ("Every lead answered. Every follow-up sent.
  Nothing missed.") and of Website builds ("The basics, done properly, every
  time"), with their labels and lines, and the two sections themselves,
  `LeeSystemsAutomationSection` and `LeeSystemsWebsitesSection` (2026-09-30,
  at the owner's request). Their animations stayed and sat side by side
  under What we do (`LeeSystemsExamplesSection`), keeping the `#automation`
  and `#websites` ids.
- The two animations themselves, "Your site" (`WebsiteBuildDemo`, with its
  "Live" badge, desktop/phone toggle, phone view and "New enquiry" alert)
  and "Example: a new lead" (`AutomationFlowDemo`, with its window, "Running"
  and "Completed" badges), the section that held them
  (`LeeSystemsExamplesSection`) and their shared `usePlayWhenVisible` hook
  (2026-09-30, at the owner's request). They became one live demo,
  `LeeSystemsLiveDemoSection` (see The live demo), which keeps both ids.
- The seam (`ExamplesSeam` and its CSS in `app/globals.css`), which split
  the live demo open from What we do's spine as it scrolled in, two brass
  edges gliding apart, and the run of spine that led down into it
  (`ls-seam-lead`) (2026-09-30, at the owner's request). The demo now sits
  on the page as it is and starts playing once it is on screen; What we
  do's spine ends with its halves, and the section keeps the bottom padding
  that run of spine had taken the place of.
