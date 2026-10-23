# Business Mastery — Build Spec

Execution plan and settled decisions for `/business-mastery`, the Business
Mastery program page, plus its homepage presence.

> **2026-10-22 design system — read this first.** The page was the one part
> of the site the 2026-10-18 redesign skipped, so it still had the older look
> (rounded glass panels, pill labels, sentence-case bold headlines, glowing
> rounded buttons). At the owner's request it now matches every other page,
> with **no change to any wording**: `.ds-page` on the wrapper, the shared
> `SectionHead` (mono eyebrow, display headline, line under it), square mono
> tags in place of the pills, display-face headings whose second line takes
> the accent (they were dim then bright), the "why now" rows laid out like the
> homepage's "How it works" (middle row on a cut-corner band), cut-corner
> panels in the surface colour, the figures as the homepage's stat tiles, the
> guarantee as an FAQ bar, step badges shaped like the buttons, the form
> dressed like the contact form, and the site's square double-border buttons
> (`.btn-hero` with the hand-drawn arrows in the hero, `.btn-ls-primary` in
> the header). The glow layers that alternated between sections are gone, as
> on the rest of the site. The constellation behind the hero is unchanged.
> docs/DESIGN-SYSTEM.md has the system.

> **2026-10-20 the .org site — read this first.** This repo is now the .org
> site (www.leeenterprisesunlimited.org, Vercel project `leu.org`), a copy of
> the .net site. `site.url`, `MAIN_SITE_URL` in `next.config.mjs` and the
> share-card domain all name the .org, so link previews and canonical
> addresses point here instead of at the .net. Its subdomain would be
> **mastery.leeenterprisesunlimited.org**, which is not attached in Vercel
> yet, so `BUSINESS_MASTERY_SITE_LIVE` is **off** and links use
> www.leeenterprisesunlimited.org/business-mastery. Where the notes below
> name the .net or .com hosts, read the .org ones for this repo.

> **2026-10-18 the .net site — read this first.** This repo is the .net
> site (www.leeenterprisesunlimited.net), a separate copy of the .com site.
> It now has its own Business Mastery at **mastery.leeenterprisesunlimited.net**
> instead of linking to the .com's mastery.leeenterprisesunlimited.com.
> `site.url`, `MAIN_SITE_URL` in `next.config.mjs` and the share-card domain
> all name the .net. `BUSINESS_MASTERY_SITE_LIVE` is **on** since the
> subdomain was attached to the .net Vercel project the same day (the
> domain's DNS is on Vercel, so adding it there was the whole setup), so
> links go to the subdomain and www /business-mastery 301s there. Where the 2026-10-06 note
> below names the .com hosts, read the .net ones for this repo.

> **2026-10-06 own subdomain — read this first.** Business Mastery has moved
> to its own site at **mastery.leeenterprisesunlimited.com**, served by this
> same project (the owner's call, after weighing a separate domain, keeping
> it as is, and tucking it behind an About section).
>
> - **How:** `next.config.mjs` rewrites `/` on that host to this page, sends
>   `/business-mastery` there to `/`, and sends any other page asked for on
>   that host to the same path on www. The page's assets, its share image
>   and the application form's `/api` route are left alone, so the form works
>   on either host. Try it locally at http://mastery.localhost:3000.
> - **The switch:** `BUSINESS_MASTERY_SITE_LIVE` in
>   `config/business-mastery-site.mjs`, **on since 2026-10-06**, once the
>   subdomain was attached in Vercel and its CNAME record added at Wix, where
>   the domain's DNS lives. Being on moves every link to the program (`businessMasteryPage` and
>   `businessMasteryAction`), the page's canonical and og:url, the sitemap
>   entry and the share card's address to the subdomain, and makes www
>   `/business-mastery` a 301 to it. Previews and `pnpm dev` keep serving
>   `/business-mastery` either way.
> - **Its own header and footer:** `BmHeader` (the LEU mark with "Business
>   Mastery", and the page's apply button) and `MainFooter
>   variant="business-mastery"` (no main-site page links; "A program of Lee
>   Enterprises Unlimited" links home; legal links are full www addresses).
>   The page's buttons use `bmPageAction`, a bare `#bm-offer`, so they
>   scroll on either host.
> - **Main site:** links to Business Mastery from the footer only (the
>   owner's call, 2026-10-06: it is promoted on its own). The header link,
>   the homepage hero's second path and the contact form's "Business
>   Mastery" choice are gone. The www sitemap still lists the subdomain,
>   since that is how search engines find it.

> **2026-09-28 site fix — read this first.** The owner's site fix plan and
> answers changed several things below. Where this document disagrees with
> this note, this note wins.
>
> - **Name:** "Business Mastery" everywhere. Never "LEU Business Mastery" or
>   "Lee Business Mastery".
> - **Hero:** "Learn to start a business and actually use AI." and "Courses,
>   coaching and a community of people building alongside you." replaced
>   "Learn how to build, scale, and dominate." and "Speedrun Your Way to
>   Success." The button is `businessMasteryAction` ("Apply to join", or
>   "Join Business Mastery" once `joinMode` is "join"), a filled gold button.
>   **Restyled 2026-10-06** (the owner's pick from five concepts) in the
>   page's own parts: the `.bm-pill` with the gold badge, the headline set
>   dim-then-bright like the "why now" rows (`bmHero.manifestoLines`), the
>   promise line grey with its key phrase bright (`bmHero.subtitleRuns`),
>   the description kept, the button uppercase like the program section's,
>   and a trust line under it (`bmHeroTrust`: by application, paid monthly
>   membership, 90-day guarantee, each restating a fact set elsewhere). The
>   copy is unchanged and `bmHeroCopyIsConsistent` holds the split forms to
>   the sentences. The constellation background is unchanged.
> - **Homepage:** the teaser panel is gone, and since 2026-10-06 so is the
>   hero's second path ("Learn with us: Business Mastery"). The footer link
>   is the one hook now.
> - **Scarcity:** the "Enrollment Closing Soon · 4 Spots Remain" line and the
>   "Limited Spots" box are removed. Scarcity wording shows only if
>   `site.businessMastery.scarcity` (data/site.ts) is set, once, in the offer
>   section.
> - **Stats:** kept exactly as published, at the owner's request, on this page
>   and on the homepage ribbon (`site.stats`).
> - **The Journey:** kept exactly as it is, Coming Soon marker included
>   (owner's call), but **moved to the homepage** later the same day at the
>   owner's request, right above "Recent Builds" (`app/page.tsx`). It is no
>   longer on this page, which now ends on the founding offer (slot 6).
>   `BM_JOURNEY_LOCKED` moved with it and is still the whole unlock.
> - **Membership:** a paid monthly membership; the amount isn't set, so no
>   price shows. Price, platform and join link live in
>   `site.businessMastery`. The offer section says so under its heading ("A
>   paid monthly membership.", plus the price once it is set).
> - **After applying:** while joining is by application (`joinMode`
>   "apply"), the offer section shows three steps above the form: send the
>   application (no payment taken), Hunter reviews it and follows up
>   personally, then members are added to the member resources and groups
>   (`afterJoining`; a named `platform` replaces that line once set).
> - **Tenets:** "For Free" became "Start Lean" in the fix plan (beside a
>   paid membership, "For Free" can read as a claim about its price), and the
>   owner asked for **"For Free"** back the same day (id `for-free`). Its
>   description stays about starting a business, never the membership's
>   price. Speed and Money In are unchanged.
> - **Guarantee:** unchanged, at the owner's request.
> - **Section order:** reordered later the same day at the owner's request,
>   so a visitor reads what members get before the philosophy: Hero →
>   What Business Mastery actually is → Who this is for (now ending on a
>   second "Apply to join") → the proof figures as their own short section →
>   What we believe (the manifesto and the core tenets merged into one
>   section) → the member offer and form. §3 has the table and the record.

**Status:** Phase A built. The page, application form + API route, homepage
teaser, and nav wiring are live on the branch and pass a production build.
This document records the decisions made with the owner on 2026-08-25 and the
full section-by-section plan derived from the owner's page-plan document.
Phases B (story) and C (checkout) remain — see §9.

---

## 1. Settled decisions

| | |
| --- | --- |
| Placement | **Dedicated page at `/business-mastery`** + one homepage teaser section. The homepage stays the company hub. Superseded on 2026-10-06: the page becomes its own site at mastery.leeenterprisesunlimited.com (see the note at the top). |
| Homepage hook | A teaser section introduces the program on the homepage. It was originally reached by two routes: this section, plus the "Start your own venture" button in `PortfolioSection`, which had sat unwired until this program gave it a destination. That Portfolio section has since been removed from the homepage entirely. The homepage had two hooks again for a while: the teaser, plus the "Get started on your dreams" button under the mission statement in `AboutSection`, which had likewise sat unwired. The About section has since been removed from the homepage too, so the teaser is the one hook. |
| Join flow | **Application form first.** Own API route, Resend email to `ceo@leeenterprisesunlimited.com`, same pattern as every other venture form. No on-page payment in this build. |
| Payments | None in this build. Stripe checkout for the founding-member one-time payment is Phase C — the scaffolding already exists (`app/api/stripe/*`), but price, guarantee terms, and refund handling must be written first. |
| Founding counter | Not rendered. `bmFoundingCounter` (`claimed` / `total`) survives in `data/business-mastery.ts` as a record and a Phase C hook; the offer section shows a plain "Limited Spots" box instead — see §6. |
| Unfinished content | Render whatever is confirmed, and mark the rest with a consistent **"coming soon"** treatment (owner's call). Applies to the Journey chapters and the guarantee terms; it applied to the full founder story too, until that section came off the page (§3). |
| Exploratory sections | **Empire in, Vision out**: "How to Build Your Own Empire" made the first build; "The Vision" shipped alongside it and was removed at the owner's request. Superseded on 2026-09-07 — the Empire framework was itself replaced, by the owner's three **Core Tenets** (Speed / Money In / For Free) in the same slot. Placement in §3. |
| Palette | LEU's own amber/gold on black — the homepage identity, not a new sub-brand palette. Business Mastery is LEU itself, and the page should look like it. |
| Contact | `ceo@leeenterprisesunlimited.com`, same as every other form. |

---

## 2. What this page is

Not a venture page in the H1/Thread sense — it is LEU's flagship program: a
paid business-development network (classes, live webinars, daily calls,
personal coaching, hands-on help, private community, tools and resources).
The page is manifesto-scale by design. Its one conversion action in this build
is the founding-member **application form**; every CTA on the page scrolls to
it.

Core through-line, carried by the hero:

> No great accomplishment in history was achieved alone.

It used to be repeated at the close, as the Evolution section's last line.
That section is gone (§3), so the line now appears once, at the top. If the
owner wants the bookend back, the final CTA is where it belongs.

---

## 3. Page flow (final order)

The owner's flow, with the added section slotted where it does the most work:

| # | Section | Content source | State |
| --- | --- | --- | --- |
| 1 | Hero — manifesto | Owner doc §1: title, "No great accomplishment…", "Speedrun Your Way to Success", CTA `ACHIEVE YOUR DREAMS →` scrolls to the offer | Ready |
| 2 | **The World Is About To Change** (why now) | Added 2026-09-29 from a layout the owner sent (The Real World's section of that name): three alternating rows, Time's ticking / The AI shift / The way out, each with a live panel (a year clock, an AI assistant window, the stages path). Build copy in `bmShift`. It absorbed **Who This Is For**: the third row's panel is its three stages (Owner doc §3, cut from four to three on 2026-09-27), headed by `bmAudienceHeading` and closed by `bmAudienceSubheading`, both verbatim | Ready. Build copy, no figures or results (§6) |
| 3 | What Business Mastery Actually Is | Owner doc §4: "NOT a Course. A Coach." (now "A network of dedicated entrepreneurs.") + six pillars (classes, webinars, daily calls, coaching, hands-on help, community); Tools & Resources removed 2026-09-27, data kept. Six cards until 2026-09-29, now an auto-stepping showcase from lg up and a plain list below it. Ends on the page's second "Apply" (moved here from Who This Is For). Was slot 5 until the 2026-09-28 reorder, slot 2 until 2026-09-29 | Ready |
| 4 | The proof figures | `bmProofPoints` (50+ / 1,000+ / $150,000+), with `bmProofStatement` as its screen-reader text. The foot of the manifesto until the 2026-09-28 reorder made it its own short section, with no heading | Ready (see §6 on the proof claims) |
| 5 | **Our Core Tenets** (was What We Believe) | The owner's three tenets, supplied 2026-09-07: Speed, Money In, For Free (they replaced the 8-step "How to Build Your Own Empire" framework). The manifesto above them, Owner doc §2 ("Nobody Builds Something Great Alone", network as the driving force), came **off the page on 2026-09-29** at the owner's request; `bmCoreBelief` is intact in the data file. The manifesto was slot 2 and the tenets slot 4 until they merged here on 2026-09-28 | Ready. Tenet titles are the owner's; the Speed description is the owner's own copy (supplied 2026-09-15), the other two one-line descriptions are build copy — see the note on `bmTenets` before editing "For Free" |
| 6 | Founding Member Offer | Owner doc: one-time payment positioning, a "Limited Spots" box (a live-style counter until the owner asked for the words alone), 90-day guarantee (30-day at first build, extended by the owner), **application form** | Form ready; price + guarantee terms are content gaps (§6) |
| 7 | Why I Built LEU | Owner doc §6: legacy statement + supporting idea | **Not on the page right now** — pulled at the owner's request, see below. Built and ready: renders the legacy statement + coming-soon marker whenever it goes back |
| 8 | My Journey — timeline (on-page eyebrow: "A Life in Full") | Owner doc §7: interactive 14-chapter timeline | **Moved to the homepage on 2026-09-28**, right above "Recent Builds", at the owner's request — not on this page any more. Still built and **visibly locked** until the owner launches it: the slot renders a Coming Soon placeholder; `BM_JOURNEY_LOCKED` in `data/business-mastery.ts` is the switch, see below. Titles only; chapter bodies are coming-soon until the My Story document is written |
| ~~9~~ | ~~Your Journey Is Just Beginning~~ | Owner doc §8 — merged up into slot 2 on 2026-09-07, then **off the page entirely** on 2026-09-13, see the note below | Not on the page in any slot; the copy is unchanged and still `bmTransition` |
| 10 | Achieve Your Dreams Today | Owner doc §9: final conversion section, CTA `JOIN LEU BUSINESS MASTERY →` scrolls back to the offer/form | **Not on the page right now** — pulled at the owner's request on 2026-09-27; `BmFinalCTASection` and `bmFinalCta` are intact |

**The page was redesigned on 2026-09-29, at the owner's request**, to be
less "cards, cards, and more cards" and to open with why now. "The world is
about to change" (`BmShiftSection`) took slot 2 and absorbed "Who this is
for" (`BmAudienceSection.tsx` is deleted; its stages, heading and subheading
render in the new section's third row, and its "Apply now" button moved to
the end of "What Business Mastery actually is", now slot 3). The six pillar
cards became `BmProgramShowcase`; the tenets became numbered rows with
hairlines between; "What happens after you apply" became a line of numbered
stops that draws itself. Later the same day, from a process strip the owner
sent, those stops became gold numbered squares under a "Next steps" eyebrow
and a larger heading, each with a short title (Apply, Personal follow-up, Get
access) over its line. The glow alternation holds: the new slot 2 carries
one, slot 3 no longer does.

**The page was reordered on 2026-09-28, at the owner's request**, to put
what members get before the philosophy so a visitor understands the offer
quickly. Slots 1 and 6 did not move; 2–5 were re-slotted as the table shows,
and three things changed with them:

- **The manifesto and the tenets are one section**, `BmManifestoSection`, at
  slot 5. One eyebrow ("What we believe"; the tenets' "The way we operate"
  came off), then "Our core tenets" as a sub-heading over the three cards.
  `BmTenetsSection.tsx` is deleted. `bmTenetsIntro.description` was cut to its
  first sentence; the dropped one ("Every part of Business Mastery runs on
  them.") is recorded on it in the data file.
- **The proof figures are their own section**, `BmProofSection`, at slot 4,
  still read before the offer and the form (the reason recorded below for
  placing the claim early). `bmProofStatement` moved with the row and is still
  its screen-reader text; it was never drawn on screen.
- **"Who this is for" ends on "Apply to join"**, the hero's action and target
  (`businessMasteryAction`), in the hero's filled gold style.

All sections share the body's neutral-950, so what alternates down the page
is a glow layer. It is on 2, 4 and 6 and off 3 and 5: the manifesto's radial
glow moved up to slot 2 with the slot, `BmProofSection` carries a fainter
one, and the merged slot 5 has none.

The notes below this one are the page's history. Where they say "slot 2" for
the manifesto or "section 5" for the program, they mean the order at the time.

**Sections 2 and 9 became one section on 2026-09-07, at the owner's
request.** They were always the same claim made twice — a centred column of
neutral-300 paragraphs on neutral-950, arguing that nobody builds alone — and
eight sections apart they read as two text walls rather than as one thought.
`BmManifestoSection.tsx` carried both; `BmCoreBeliefSection.tsx` and
`BmTransitionSection.tsx` are deleted. **No copy changed**: every sentence was
still the owner's, verbatim, from `bmCoreBelief`, `bmProofStatement` and
`bmTransition`, only re-ordered and re-grouped. `bmTransition` stays in the data
file under its own name, and did so through what happened next.

**The pivot came back off on 2026-09-13**, at the owner's request, which ends
the merge: slot 2 is the Core Belief and the proof line, and owner doc §8 is not
on the page in any slot. `bmTransition` is unchanged in the data file and
renders nowhere — the same treatment `bmFoundingCounter` gets, and for the same
reason. **The gold seam rule went with it**, because it existed only to divide
the two halves and would otherwise be a hairline dividing the last paragraph
from the section's bottom padding; it has to come back with the pivot, not
before it. That also settles the trade recorded at the foot of this section:
the first-person "me" no longer arrives six sections before the story it refers
to, because it is not on the page at all.

**The Core Philosophy block came off slot 2 on 2026-09-07**, also at the
owner's request. It was the amber card in the old section and survived the merge
as the pull-quote; removing it left slot 2 as a single centred column.
`bmCoreBelief.philosophyTitle` and `bmCoreBelief.philosophy` are unchanged in
the data file and render nowhere now, on the same terms.

**Two more lines came off the page the same day**, also at the owner's request
and on the same terms: `bmProgram.closer` ("If someone doesn't even know what
business they want to start yet…"), the centred paragraph under section 5's
pillar grid, and `bmFinalCta.supporting` ("Courses. Coaching. Community…"), the
last text on the page under section 10's button. Section 5 ends on the pillars
now and section 10 ends on its one action. Both strings are unchanged in the
data file and render nowhere. `bmFinalCta.supporting` carries an extra warning
there: it was the only place outside section 5 that listed what membership
includes, and a list of inclusions sitting directly under the page's one action
needs checking against §6 before it goes back, while price and guarantee terms
are still Phase C gates.

**The clarifier came off slot 2 on 2026-09-15**, at the owner's request and on
the same terms: `bmCoreBelief.clarifier` ("LEU Business Mastery is not about
avoiding hard work…") is unchanged in the data file and renders nowhere. It was
the section's last paragraph, under the proof row, so slot 2 now ends on the
proof line.

Slot 2 rather than slot 9, and the trade was real enough to record — it is
history now that the pivot is off the page, and it is the first thing to read if
it ever goes back. Slot 2 won because `bmProofStatement` is the page's only
credibility claim and has to be read *before* the offer and the application form
at slot 6, not after them. What it cost: `bmTransition` is written in the first
person and this table used to define it as "the transition from my story to your
story", so at slot 2 the "me" in "Everything that came before LEU taught me
something" arrived six sections before the story it refers to (the timeline,
slot 8), and the merged column ran we → I → you under one heading. Moving the
whole section below the timeline is one line in `page.tsx` if that trade ever
reads the wrong way round again.

Removing slot 9 also removed a join. That section existed so the timeline would
not run straight into a sales pitch, and without it slots 8 and 10 abut — two
`bg-black` sections, both carrying amber glows, with the timeline's scrubber
against the closing CTA's headline. This page has no dividers between sections,
so the light/dark alternation *is* the separator: `BmJourneyTimeline` is
`bg-neutral-950` now, and the closing CTA's own copy ("You can keep trying to
figure everything out alone…") is the bridge the deleted section used to be.
The numbering is **not** re-flowed — slot 9 is struck through above rather than
renamed — for the same reason section 7's hole is kept: the record has to stay
legible against the builds that came before it.

Two sections shipped in earlier builds and were removed at the owner's
request, with the sections after each renumbered: "The Vision" (the other
exploratory section), which sat between the Evolution and the founder story,
and **The Evolution** itself — the Phase I / II / III model that ran between
the founding offer and the founder story. The phase copy is gone from the
page, the data file, and `types/index.ts`; the phase model still stands as a
business plan (§9), it is just no longer marketed on the page.

**Section 7, Why I Built LEU, is a different case: it is paused, not
removed.** The owner asked for it out "for now", so `page.tsx` stops
rendering it while `BmFounderSection.tsx` and `bmFounder` stay whole and
unchanged — restoring the section is one JSX line plus its import, with no
content to rewrite. For that reason the numbering above deliberately keeps
its slot and the later sections are **not** renumbered; the table's #7 is a
hole in the live page today, not a mistake. Anything below that describes
section 7 as rendering describes the built section, not the page as it
currently ships.

**Section 8, The Journey, is locked — on the page, visibly not open.** The
owner asked it held back until launch on 2026-09-13, the same day chose a
visible placeholder over having it off the page entirely, and then chose
"Coming Soon" over a lock badge for its marker. Because launching is the
stated intent, the lock is a flag rather than a deleted line:
`BM_JOURNEY_LOCKED` in `data/business-mastery.ts`, read only by the page
that renders the slot — `app/page.tsx`, the homepage, since the section moved
there on 2026-09-28.
While `true`, the slot renders `BmJourneyLocked` — the section's eyebrow and
title as the intro slide sets them, a chapter tease derived from `bmChapters`
(count, first title, last title, so it cannot drift from the data), and the
shared `BmComingSoon` marker with its own note (`bmJourney.lockedNote`) where
the timeline's start affordance would be. The retired badge text survives
unrendered as `bmJourney.lockedLabel`. **Unlocking is flipping that one
`true` to `false`** — nothing else. `BmJourneyTimeline`, `bmJourney`, and
`bmChapters` are all whole and unchanged, so the timeline arrives exactly as
it last rendered, coming-soon markers and all. Both states sit on
`bg-neutral-950`, so the join the note above records is intact throughout
and the closing CTA stays black. Slot 8 keeps its number on the same terms
as slot 7's hole.

### Why the added section sits where it does

- **Core Tenets** landed between "who this is for" and "what the program is"
  (slot 4) when they replaced the 8-step Empire framework: the visitor sees
  themselves, then sees how we operate, then sees the program that operates
  that way. Since the 2026-09-28 reorder they close the philosophy instead, as
  the second half of slot 5: the offer and the audience come first, and the
  belief and the principles behind it follow, directly before the member offer.

---

## 4. Files

Follows the venture-page architecture exactly (see `docs/THREAD.md` in the
Thread repo, or `docs/H1.md` in the H1 Performance repo, for the precedent;
both pages that set it have since moved to their own repos - see this repo's
`docs/THREAD.md` and `docs/H1.md`).

| File | Contents |
| --- | --- |
| `data/business-mastery.ts` | All page copy, the three audience stages, the 3 core tenets, the seven pillars, the 14 timeline chapters, the founding counter (`claimed`, `total`, unrendered) |
| `types/index.ts` | Business Mastery interfaces appended |
| `components/business-mastery/BmHeroSection.tsx` | 1 — manifesto hero |
| `components/business-mastery/BmProgramSection.tsx` | 3 — "A network of dedicated entrepreneurs." + pillars + the second "Apply now" |
| `components/business-mastery/BmShiftSection.tsx` | 2 — "The world is about to change": three alternating rows, the third drawing the audience stages as a path (replaced `BmAudienceSection.tsx` on 2026-09-29) |
| `components/business-mastery/BmYearClock.tsx`, `BmAiWindow.tsx` | 2 — the first two rows' live panels (client, decorative) |
| `components/business-mastery/BmProgramShowcase.tsx`, `bmPillarIcons.ts` | 3 — the pillars' auto-stepping showcase (lg up) and their icons |
| `components/business-mastery/BmProofSection.tsx` | 4 — the three proof figures |
| `components/business-mastery/BmManifestoSection.tsx` | 5 — the three core tenets; the manifesto that shared the section is off the page since 2026-09-29 (replaced `BmCoreBeliefSection.tsx`, `BmTransitionSection.tsx` and, on 2026-09-28, `BmTenetsSection.tsx`) |
| `components/business-mastery/BmFoundingOfferSection.tsx` | 6 — offer, limited-spots box, guarantee expandable |
| `components/business-mastery/BmApplicationForm.tsx` | 6 — the form (fields in §5) |
| `components/business-mastery/BmFounderSection.tsx` | 7 — Why I Built LEU (built, not currently rendered — §3) |
| `components/business-mastery/BmJourneyTimeline.tsx` | 8 — interactive timeline |
| `components/business-mastery/BmJourneyLocked.tsx` | 8 — the Coming Soon placeholder rendered while `BM_JOURNEY_LOCKED` is true (§3) |
| `components/business-mastery/BmFinalCTASection.tsx` | 10 (built, not currently rendered — §3) |
| `components/business-mastery/BmComingSoon.tsx` | Shared coming-soon marker (§7) |
| `app/business-mastery/page.tsx` | Page assembly + metadata (no structured data yet; the comment there says why) |
| `app/api/business-mastery-application/route.ts` | Application form handler, same Resend pattern as the other venture forms (Thread's `app/api/thread-order/route.ts` now lives in the Thread repo) |
| `components/sections/BusinessMasterySection.tsx` | Homepage teaser (§8), rendered as the left panel of `components/sections/VenturesSection.tsx` |

### Edits outside the new page

| File | Edit |
| --- | --- |
| `app/page.tsx` | Render `BusinessMasterySection` directly after `PortfolioSection` (that Portfolio section has since been removed, and so has `AboutSection`, so the teaser now follows the hero; it is now rendered through `VenturesSection`, beside the Lee Systems Co. teaser) |
| `components/sections/PortfolioSection.tsx` | Wire the "Start your own venture" button to `/business-mastery` (it was `type="button"` with no destination — the comment there said intentionally unwired *for now*; now was over). Superseded: the whole section was later removed from the homepage. |
| `components/sections/AboutSection.tsx` | Wire the "Get started on your dreams" button under the mission statement to `/business-mastery` (same story as the Portfolio button: `type="button"`, no destination, a comment saying intentionally unwired *for now*). The mission copy ends on making dreams of starting a business come true, so this program is where that sentence lands. |
| `data/navigation.ts` | Add `businessMastery: "/business-mastery"` to the page map, a nav entry for it, and a `businessMastery` key in `sectionIds` for the homepage teaser anchor |

Nav placement: its own entry in the main nav (it is the flagship program, not
one of the ventures, so it did not belong inside the Ventures menu). That menu
has since been flattened at the owner's request — the ventures became
top-level entries beside this one, with Lee Marketing Mastery keeping its three
offerings in a dropdown of its own. Lee Marketing Mastery is the one venture
left since Thread T-Shirts came off this site (`docs/THREAD.md`); Business
Mastery leads the two.
Easy to move later if the header gets crowded.

---

## 5. The application form

Same skeleton as the other venture forms (the LMM consultations; Thread's
order request and the H1 consultation form it was modelled on now live in their
own repos): honeypot field, server-side validation, per-field errors, Resend
delivery, own subject line so a Business Mastery application is
distinguishable in the inbox.

Fields. The stage dropdown and the separate "what are you building" / "why
do you want in" textareas were folded into one open question on 2026-09-27
at the owner's request:

| Field | Required |
| --- | --- |
| Full name | yes |
| Email | yes |
| Phone | yes |
| Tell us your story (one open textarea; its hint asks where they are, what they're building, what's holding them back, and what they want from membership) | yes |
| Honeypot | hidden |

Delivers to ceo@leeenterprisesunlimited.com, like every other form, through
`DEFAULT_TO_EMAIL` in `lib/email.ts` (fixed in code since 2026-10-19; the old
`BM_TO_EMAIL` and `CONTACT_TO_EMAIL` overrides are no longer read).

---

## 6. Honesty constraints (repo standard, applies here)

This repo has an explicit, documented standard — see `docs/WEBSITES.md` §3 —
of publishing only what can be substantiated: name the work, not the promised
result. Three items in the owner's copy were checked against that standard
before rendering:

1. **"We have built 50+ businesses, worked with 1,000+ businesses, and helped
   generate $150,000+ for our clients."** Published verbatim in
   `bmProofStatement`. The owner confirmed the original word-quantity version
   of this line ("dozens", "hundreds", "thousands upon thousands") as true on
   2026-08-25, and supplied these hard figures on 2026-09-13. If the facts
   ever change, change the line — the standard is the words match the record.
2. **The founding counter — retired, and with it the claim.** It rendered
   `5 / 20` from `bmFoundingCounter`, figures the owner confirmed as real
   rather than illustrative. The owner has since asked for a plain "Limited
   Spots" box in its place, so no page states a number of spots and this
   standard has nothing left to check here. `bmFoundingCounter` stays in
   `data/business-mastery.ts` as the record and as Phase C's hook, unrendered
   and therefore free to go stale. If anything displays it again — Phase C
   deriving it from completed Stripe payments, or the counter coming back —
   the true-count rule comes back with it: it must show the real figure
   before it ships. What replaced it is weaker in kind, the same trade §9
   describes for the teaser: "limited spots" is not checkable against
   anything, and holds only while spots really are limited.
3. **The membership terms.** Billing, renewal, cancellation and the 90-day
   guarantee are written, in the owner's words (agreed 2026-10-23), in
   `data/business-mastery-terms.ts`: $199 a month, first charged when an
   accepted applicant pays their Stripe link, renewing monthly on that date
   until canceled; cancel anytime by email, with access to the end of the
   paid month and no refund of paid months outside the guarantee; the
   guarantee refunds the first month if asked within 90 days of the first
   payment, for members who went through the material, joined the
   community and can show what they put into practice, back to their card
   within 14 days, ending the membership, once per person. They show as the
   "Membership terms" dropdowns in the offer section
   (`BmMembershipTerms`) and as the Business Mastery entries in /legal's
   Terms of Service, both from that one file. If how members pay, cancel or
   get refunded changes, change that file in the same edit.

---

## 7. The coming-soon treatment

Owner's call: for anything not decided yet, put "coming soon" and render
whatever information does exist. One shared component (`BmComingSoon`), one
consistent look — a quiet amber-outlined marker, not a broken-feeling stub —
used in three places. One renders today: the journey's — carried by the locked placeholder (`BmJourneyLocked`, §3) with
its own note (`bmJourney.lockedNote`) while the timeline is closed, and by
the timeline's intro slide (`bmJourney.comingSoonNote`) once it opens. This
is the journey's sanctioned marker in either state, not a fourth place. The
placeholder briefly carried a Lock-badged "Locked Until Complete" instead,
until the owner chose "Coming Soon" the same day; the retired badge text
survives unrendered as `bmJourney.lockedLabel`. The founder section is
paused (§3), so its marker renders nowhere until the section returns. The
guarantee expandable dropped its marker on 2026-09-27 at the owner's request
and now points people to the contact email instead.

| Where | What renders now | What's coming |
| --- | --- | --- |
| Why I Built LEU (8) — *section paused, §3* | The legacy statement (§9 below) + the supporting idea | The full founder story from the My Story document |
| Journey timeline (9) — *section locked, §3* | The locked placeholder: title, chapter tease, Coming Soon. Once unlocked: the 14 chapter titles as the interactive structure | Each chapter's story |
| Guarantee expandable (6) — *no marker since 2026-09-27* | Plain-language guarantee summary + contact email for the details | Full terms, eligibility, refund conditions, ToS |

The timeline is worth building fully now even with empty chapters: the
interaction model gets designed and settled, and the story drops in later as
a pure content swap in `data/business-mastery.ts`. Its presentation is the
horizontal chapter-by-chapter experience from the timeline the original page
plan cited as structural inspiration, in LEU's gold-on-black: a full-width
intro slide, one slide per chapter in the owner's order — The Beginning
through LEU — edge arrows, and a bottom scrubber bar: a dot per stop with its
title below, current stop lit.

**Chapter numbers are not displayed anywhere in this section.** The reference
numbered both the scrubber stops and the slides, and this did too — stops
labelled `01`–`14`, slides carrying a ghost numeral behind a `CHAPTER 01 / 14`
eyebrow — until the owner asked them off the scrubber and then off the slides
as well. Both eyebrow and numeral went with the numbers rather than surviving
as a bare "CHAPTER", which would label nothing. `chapter.number` stays in the
data as the ordering key and in the accessible names of the slides and stops,
where position still has to be legible; it is no longer a visible element, so
the chapters are identified on screen by title alone. Navigation is native horizontal scroll-snap (swipe /
sideways scroll / arrow keys / edge arrows / scrubber clicks) — the page's
vertical scroll is never hijacked. Chapter titles ship as the owner's current
numbered list; the "cinematic" alternates (`OBSESSION`, `ALL IN`, `THE BOUNCE
BACK`…) are recorded in the data file as a commented alternative, to be
settled when the story is written.

Legacy statement: two candidates exist —

> My legacy is a helping hand to all young entrepreneurs.

> My legacy isn't what I build. It's who I help build.

Render the second (the evolved version) as the section's centerpiece unless
the owner objects; keep the first in the data file as the alternate. That is
still how the section is built — it just is not on the page at the moment
(§3), so nothing renders either candidate today.

---

## 8. The homepage teaser

One section, anchored by the new `sectionIds.businessMastery`. It shipped
directly after `PortfolioSection`; that section has since been removed from
the homepage, as has `AboutSection` after it, so it now follows the hero. It is a doorway, not a
summary: the manifesto line, one or two sentences on what the program is, a
scarcity line, and a single CTA — `ACHIEVE YOUR DREAMS →` — routing to
`/business-mastery`.

The scarcity line shipped as the real founding counter, sharing
`bmFoundingCounter` with the page. At the owner's request it is now the flat
statement `bmHero.scarcityLine` ("Enrollment Closing Soon"), so the teaser
states no number. Note what changed in kind: the counter was checkable
against a figure the owner maintains, and this line is not — it holds only as
long as enrollment really is closing, so it needs changing when that stops
being true.

The page's own counter has since gone the same way, for the same reason —
a "Limited Spots" box in the offer section (§6.2). Both surfaces now make an
unquantified scarcity claim, and no rendered figure remains to check.

Since 2026-09-26 it is no longer a full-width section of its own: it is the
left half of `VenturesSection`, under a shared heading - "Learn to build it,
or have it built for you." - side by side with the Lee Systems Co. teaser from
1024px up, with an "or" on the seam between them, and stacked above it on
smaller screens. It opens with a "Learn it yourself" label; the heading and
both labels are `venturesHome` in `data/company.ts`. The copy is centred in
the panel, the whole panel links to `/business-mastery`, and pointing at one
panel dims the other. The layout lives in `.ventures` in `app/globals.css`;
the teaser's own copy above is unchanged.

It deliberately does **not** repeat the pillars or audiences; the page does
that. It shipped alongside a second homepage CTA to the same place — the
Portfolio "Start your own venture" button — which was fine, same promise, same
destination. With the Portfolio section removed, this section's button is the
homepage's only route to `/business-mastery`.

---

## 9. Build phases

| Phase | Scope | Gate |
| --- | --- | --- |
| **A — built** | Everything in §3–§8: the full page with coming-soon markers, the form + API route, the homepage teaser, nav wiring, metadata | Done |
| **B — story integration** | My Story document lands: journey chapters filled, founder section completed, final chapter titles settled | Owner writes the story — and, since the founder section is paused (§3), decides whether it goes back on the page |
| **C — checkout** | Stripe one-time payment for founding members, counter driven by completed payments via the existing webhook route, guarantee terms page | Price set; guarantee terms + ToS written (§6.3) |
| **Later** | Phase II monthly membership mechanics, Phase III selective admission — the model is a business plan only; its marketing copy was removed from the page with the Evolution section (§3) | Business decision |

---

## 10. Open items for the owner

Content the build cannot invent, in priority order. Items 1–2 from the
original list are resolved: the owner confirmed the proof-line figures and
the 5/20 counter as true on 2026-08-25, and on 2026-09-13 replaced the
proof line's word-quantities with hard numbers (§6.1). The proof line
renders verbatim; the counter no longer renders at all (§6.2).

1. The founding-member price (needed for Phase C, not Phase A).
2. ~~Guarantee terms / eligibility / refund conditions.~~ Written 2026-10-23
   (§6.3).
3. The My Story document (gates Phase B).
4. Legacy statement pick — the evolved version is the built centerpiece per
   §7; say the word to swap in the alternate. Not urgent while the section
   is off the page (§3), since neither candidate renders today.
5. ~~Keep `bmFoundingCounter.claimed` current as members join.~~ Moot while
   nothing renders it (§6.2). It becomes a live obligation again the moment
   a spot count is displayed anywhere.
