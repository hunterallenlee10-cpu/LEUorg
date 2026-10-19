# LMM Websites - Build Spec

> **Historical.** This spec predates the 2026-09-25 rename of Lee Marketing
> Mastery to Lee Systems Co. The page became `/lee-systems/websites`, led with
> the flat quote (the pay-after-the-build guarantee it led with came off on
> 2026-09-28, when the owner stopped offering it), and had its copy, sections
> and FAQ rewritten. On 2026-09-29 it folded into `/lee-systems`: its URL
> 301-redirects to the `#websites` section there, which carried "Included in
> every site" until the owner took those cards off the same day, and its FAQ
> joined that page's (see `docs/LEE-SYSTEMS.md`). Paths and section names
> below describe the old page. The claims standard in §3 still applies.
>
> Where the body no longer matches the code: `BrowserFrameVisual` and
> `AutomationFlowVisual` became one live demo under What we do,
> `components/lee-systems/LeeSystemsLiveDemoSection.tsx` (2026-09-30), whose
> website half `#websites` lands on (the websites text came off the same
> day); the
> quote form is gone, and a website request made through the one form on
> `/lee-systems` (`/api/lee-systems-inquiry`) goes to
> ceo@leeenterprisesunlimited.com (fixed in code since 2026-10-19) and keeps the "New Website Request" subject (§4); there
> are no sibling links (§5) and no page of its own, so no share image of its
> own (§7); and no section carries `scroll-mt-24`, because html's
> `scroll-padding-top` offsets every anchor (§2).

Execution plan and settled decisions for `/lee-marketing-mastery/websites`, the
Lee Marketing Mastery page that sells professionally built business websites
around one job: turning a visitor into a customer.

**Status:** built. The page is live on the branch and passes a production build.
What remains is business confirmation, not code - see §7, which is now
load-bearing rather than a formality.

**Read §3 before editing any copy on this page.** It records a positioning
decision and a claims standard that were expensive to arrive at, and most of
what §3 forbids was on the page at some point and had to be taken back off.

| Done | File |
| --- | --- |
| ✅ | `data/websites.ts` - FAQ list + portfolio list |
| ✅ | `app/lee-marketing-mastery/websites/page.tsx` - page + structured data |
| ✅ | 13 components in `components/websites/` |
| ✅ | `app/api/website-inquiry/route.ts` |
| ✅ | The hero entry point, now the shared `LmmSiblingLinks` row (§5) |

---

## 1. Settled decisions

| | |
| --- | --- |
| Route | `/lee-marketing-mastery/websites` |
| Promise | One outcome: the finished site turns a visitor into a customer |
| Offer | New builds, redesigns, "Never Miss a Lead", optional care plans |
| Prices | **Hidden.** Every CTA routes to the quote form |
| Proof | LEU's own live sites, linked: two routes on this domain. No client work claimed |
| Testimonials | **None.** Not a single fabricated quote - see §3 |
| Lead capture | Own API route, own subject line |
| Contact | `ceo@leeenterprisesunlimited.com`, same as every other form |
| Payments | None. This page quotes, it does not sell |

### Why a sub-route and not a venture of its own

This is a Lee Marketing Mastery offering, not a venture of its own.
Nesting it under `/lee-marketing-mastery/` makes the parent-child relationship
legible in the URL itself, and both the hero and the final CTA link back up to
the parent page.

Consequence: it is deliberately not a venture row of its own in
`navigationItems` (`data/navigation.ts`). It is reached from the sibling-links
row in every LMM hero, from search, from direct links — and, since the Ventures
menu was flattened, from the Lee Marketing Mastery dropdown in the global nav,
which lists this page alongside the other two offerings. That entry is a child
of the venture, not a sibling of it, so the distinction this section draws
still holds: a service offering is not a venture. Promoting one to a top-level
nav entry would be a decision to make on purpose.

### Why no prices

The offer spans a one-page site for a new business and a rebuild with booking
and automated follow-up. There is no honest single number, and a "starting at"
figure invites the wrong conversation before scope is known.
`WebsitesPricingSection` therefore explains the four inputs a quote is built
from - page count, whether content exists, required functionality, and
post-launch care - so a visitor can self-qualify without a number.

This matches the Thread precedent (`docs/THREAD.md` in the Thread repo), where
prices stayed hidden until they were settled - `priceCents: null` still renders
"Price coming soon" for any piece without one.

### One offering, one name, three places

The lead-capture offering is called **"Never Miss a Lead"** and that exact
string appears in three files that must agree:

| Where | What it is |
| --- | --- |
| `WebsitesServicesSection` | The third offering card's title |
| `page.tsx` → `hasOfferCatalog` | The third `itemListElement` entry |
| `WebsitesInquiryForm` → `projectTypes` | The third select option |

The form option reads "Never Miss a Lead - chat, intake, and follow-up" so it
still scans as a menu choice, but it leads with the offering's name so a visitor
who read the card recognizes it in the dropdown. These three drifted into three
different names once already. If the card is ever retitled, retitle all three in
the same commit.

---

## 2. Page structure

Ordered to answer objections in the order a skeptical visitor raises them. The
market-shift argument sits early, ahead of the offer, because the reader has to
understand why their current site stopped producing calls before the services
read as anything but a price list.

| # | Section | Component | Job |
| --- | --- | --- | --- |
| 1 | Hero | `WebsitesHeroSection` + `BrowserFrameVisual` | The one-job claim, two CTAs, the scan path |
| 2 | Outcome strip | `WebsitesOutcomeStrip` | The promise in four parts |
| 3 | The shift | `WebsitesShiftSection` | Why the old site stopped working |
| 4 | Problem | `WebsitesProblemSection` | A site that sits there vs one that sells |
| 5 | What we build | `WebsitesServicesSection` | All four offerings, expandable |
| 6 | Proof | `WebsitesWorkSection` | Two live sites, each clickable, both routes on this domain |
| 7 | Process | `WebsitesProcessSection` | Six steps, no surprises |
| 8 | Pricing | `WebsitesPricingSection` | What a quote is built from |
| 9 | Quote form | `WebsitesInquiryCTA` + `WebsitesInquiryForm` | The conversion |
| 10 | FAQ | `WebsitesFAQSection` | Remaining objections |
| 11 | Final CTA | `WebsitesFinalCTA` | Last ask + links back up |

`WebsitesShiftSection` replaced a component called `WebsitesAiSection`, which
sat between Services and Work and explained how much of the production work was
automated and how much was human. It is gone, not renamed - see §3. The section
that replaced it moved earlier because it argues about the market rather than
defending us, and that argument has to land before the offer.

Element ids that other code depends on and must not be renamed:
`website-services`, `website-work`, `website-inquiry-form`. Each carries
`scroll-mt-24` and each is a `smoothScrollToElement` target from a CTA.

The FAQ and portfolio arrays live in `data/websites.ts` rather than in their
components because the page also emits them as `FAQPage` and `ItemList`
structured data. A `"use client"` module's exports become client references on
the server, so a server component cannot read the array back out of one - the
same constraint documented in `data/lmm.ts`.

---

## 3. The positioning and the claims standard

`app/lee-marketing-mastery/automation/page.tsx` limits its structured data to
"what the site can actually substantiate: no ratings, reviews or service-area
claims."
This page holds the same line, and it has to hold it harder than the other two,
because the page's own argument is that competition is now credibility. A page
that overclaims sabotages the exact repositioning it is making. A prospect who
catches one inflated claim stops believing the ones that were true.

**The standing rule: a specific, modest, verifiable claim beats both an
overclaim and a hedge.** When a claim has to come out, do not replace it with
vague mush. Replace it with the smaller true thing.

### 3.1 The editorial rule on AI

AI may appear on this page in exactly two roles:

1. **Something the finished site does for the visitor's own customers** - chat
   that answers a question at 11pm, routing a lead to a phone or a CRM.
2. **A market condition that changed buyer behavior** - AI answers absorbing
   the browsing that used to arrive as traffic.

It may **never** appear as how the site was produced. This is not a wording
preference, it is the whole positioning. The page previously led with "built
with AI", and `WebsitesAiSection` existed solely to defend that claim - it split
the work into what AI drafted and what people checked. Both the claim and its
defense were deleted together, because the objection only existed because the
page raised it.

Why it was wrong to sell: a buyer comparing us to a tool is a buyer we lose on
price, and production method makes the site a commodity where speed is the only
differentiator. A buyer comparing us to their current site that is not producing
calls is the one this page is written for. The metadata, keywords, hero eyebrow,
hero icon, problem section axis, pricing factors, sibling-link pill label and
final CTA were all moved off production method for this reason. Do not walk any
of them back one at a time.

Build speed is still a real advantage. It survives in one place - the closing
note under the process grid - stated as what a stalled project costs the owner,
never as a boast and never with a duration attached.

**Banned vocabulary**, in copy and in comments: "built with AI",
"AI-assisted production", "fraction of the time", "lightning speed",
"cutting-edge", "world-class", "seamless", plus leverage, synergy, solutions
(as a noun), unlock, elevate, supercharge, best-in-class, robust, empower.

### 3.2 What we may claim about measurement

This is the single most over-claimed area on the page. It was wrong in four
places at once - the outcome strip, the Process launch step, and two FAQ
answers. What the codebase actually does:

| Claimable | Because |
| --- | --- |
| How many people arrive, and which pages they land on | `Analytics` from `@vercel/analytics/next` is mounted in `app/layout.tsx` in production. It reports pageviews and landing pages. |
| Every enquiry is emailed the moment it is sent, labeled by which form sent it | Every route in `app/api/` builds a subject line naming the form and the business before sending - `website-inquiry`, `lmm-consultation`, `marketing-inquiry`, `business-mastery-application`. |

**Not claimable, in any wording:**

- "Which pages produce form fills and phone calls." There is no form-fill event
  tracking and no call tracking anywhere in this repo.
- Any conversion rate, any form-fill count attributed to a page, any per-page
  lead attribution.
- Any framing in which the buyer can "see which pages produce calls."

The honest version, which is genuinely useful and is all we can say: you can see
how many people arrive and where they land, and every enquiry reaches you by
email the moment it is sent. If call tracking or form-fill events are ever
built, the FAQ answer "How will I know if it is working?" and the Process launch
step are the two places that get to grow, in that order.

### 3.3 No frequency, no typical timeframe, no market statistics

**There are no completed client builds.** Nothing on this page may assert a
typical duration, and nothing may assert how often anything happens - not in the
market, not among the buyer's customers, and least of all among our own clients,
since the first FAQ answer correctly says there are none. A page cannot claim a
client base in one accordion panel and disclaim it in another.

Removed, and not to be restored: "most builds are measured in weeks, not
months", "that is the most common reason clients come to us for both",
"redesigns are a common request", "missing copy and photos are the most common
reason a website project stalls for months", "most visitors will see your site
on a phone first", "most small-business sites are brochures". The FAQ eyebrow
also lost the word "Common" for the same reason.

The underlying point almost always survives as **reasoning** rather than as
data. "A project stalls when the copy never gets written" is fine. "Missing copy
is the most common reason projects stall" is not. Timeline is answered by naming
what it depends on - page count, whether copy and images exist, what
functionality is involved, and how fast feedback comes back - and by saying it
gets scoped at the consultation.

Same rule for the "seconds" framing. "Your site gets a few seconds",
"Trusted in Seconds" and "read in a few seconds" were three unsourced assertions
of a measured attention span. Exactly one survives, in the Shift section's
"You get filtered before you get read" card, phrased as how people behave rather
than as an interval. Do not add a second one.

### 3.4 Nothing asserted about the reader's own analytics

We have never seen this reader's numbers. The hero and the Shift intro both used
to state as fact that his traffic had fallen and that his visitors rarely call.
Both are conditional now: recognition, not diagnosis. An owner who recognizes it
agrees on his own terms; one who does not has not been told something false
about his own business, which is what a skeptic notices first.

The invented competitor count - visitors having "narrowed the list to two or
three businesses" - is gone from all four places it appeared. "Narrowed the
list" carries the point without a number nobody measured. The "already comparing
you" idea is now made at most twice on the page rather than four times.

### 3.5 No fabricated proof, and the portfolio is exactly what it is

No testimonials, no ratings, no review counts, no client names, no prices, no
"300% more leads." The only proof available to us is structural and inspectable,
and the page says so plainly rather than hedging.

What `websitePortfolio` actually is, and what the copy must keep saying:

- **Two entries, both live and clickable right now**: `/lee-marketing-mastery`
  and `/`. It was four until H1 Performance came off this site on 2026-09-03,
  and three until Thread T-Shirts did on 2026-09-25 - `docs/H1.md` §4 and
  `docs/THREAD.md` §4 record every count that moved with each.
- **They are Lee Enterprises Unlimited's own ventures, not client work.** This
  caveat stays in the first sentence of the Work section lead, unsoftened. It is
  not a weakness to apologize for: a prospect can open these and use them, which
  a testimonial does not allow.
- **Both are routes on this one domain and deployment, and both are the site
  the visitor is currently reading.** A heading reading "Five Sites You Can
  Open Right Now", and a hero CTA reading "See Live Sites We've Built", implied
  five separate websites for five separate businesses - a bigger claim than the
  truth, and checkable in one click, which is the worst possible combination.
  The section heading reads "Every Site on This Domain Was Built...", the
  eyebrow "Two Live Sites, All Ours", and the lead paragraph states outright
  that both run here and both are the page being read. "On This Domain" came
  out for the two days H1 Performance was listed on its own domain, because it
  then excluded an entry the list showed; it is the phrase that keeps "two
  sites" from reading as two separate builds for two separate clients. If an
  entry ever moves off this domain again, that qualifier comes out with it. The
  hero's secondary CTA reads "See the Live Work" so it stays true regardless of
  how the section is titled.
- **The Lee Enterprises Unlimited entry does not route its contact form.**
  `app/api/contact/route.ts` sends every submission to a single
  recipient and varies only the subject line by the venture
  the visitor selected. The claim is that the enquiry arrives already labeled -
  that is labeling, not routing. The old "Routed contact form" chip is now
  "Venture-labeled enquiries". Do not restore the routing wording unless the
  route changes. Its other two chips counted ventures until Thread came off
  this site; they now read "Two destinations, one site" and "A section for
  each" - the flagship program and the one venture - and the summary names
  both.
- **Lee Marketing Mastery is the one entry that demonstrates page-per-offer** -
  a hub at `/lee-marketing-mastery` plus a page per offering at `/automation`,
  `/websites` and `/marketing`, one of which is the page the FAQ sits on. The
  count is three, and it is three in four places that a reader can see at once:
  this doc, the FAQ answer, the portfolio entry summary, and the closing
  paragraph of `WebsitesWorkSection`. It was two until automation got its own
  route, so if any of those four ever disagree again, they are all wrong
  together. This is the only
  structural proof on the page for an argument the page makes in the outcome
  strip, the Shift section, the Problem section and the FAQ, so it is used
  deliberately and by name. The first FAQ answer invites the reader to verify
  page-per-offer and therefore points at **this entry specifically**, not at the
  portfolio as a whole - the other entries were single long pages, so the
  broader invitation failed on inspection, and the one left, the home page,
  still is. Do not widen it back out unless the home page gains sub-pages.

No screenshots of work we did not do, either. `BrowserFrameVisual` is an
abstract wireframe for exactly this reason - a stock screenshot in a hero
implies a portfolio that does not exist.

The wireframe is annotated with a three-stop scan path - "says what you do, in
one line", "proof they can check themselves", "one obvious next step" - because
an unlabeled one illustrated the artifact while the page sells the job. It was a
picture of a website with no visitor in it, and it was the only hero visual
across the three LMM pages that did not carry its page's argument. The three
labels are the "sells" column of `WebsitesProblemSection` rather than new
claims, which is deliberate: the diagram and the prose have to argue one thing,
and a diagram is exactly as capable of overclaiming as a sentence.

**The obvious next idea is the one to refuse.** Showing an enquiry landing in an
inbox, or any dashboard-shaped panel, reintroduces the attribution overclaim
§3.2 exists to prevent. A picture of a leads dashboard is a claim about
measurement we cannot make.

If real client sites or real testimonials become available, they replace
`websitePortfolio` and the "our own ventures" caveat comes out with them, and
not before.

### 3.6 Table stakes are built, not sold

A phone layout, a page that loads quickly and real page titles are the floor in
2026. Advertising the floor tells a buyer our bar is low, not high. All of the
following were removed and must not come back:

- `WebsitesOutcomeStrip` - the tiles "Works on Every Screen" and
  "Built to Be Found".
- `BrowserFrameVisual` - the chip row "Mobile ready" / "Fast loading" /
  "Built to convert", which sat in the first screen beside the H1. The third
  chip was true and on-argument but said the same thing as the eyebrow above it
  and the strip below it, so the row went rather than being rewritten. The test
  that row failed - a claim about what gets built for the visitor's decision,
  never a specification - is the test the scan-path labels now in that frame
  were written against. Anything added there has to pass it too.
- `WebsitesServicesSection` - the capabilities "Mobile and tablet layouts" and
  "Rebuilt to load fast and read clearly on a phone".
- The outcome strip's "Trusted in Seconds" tile, whose supporting label
  ("loads fast, reads clearly, looks current on a phone") was exactly this copy.

All of it still gets built. It is **answered when asked** - see the
"Will the site work on phones?" FAQ answer - and never sold.

Related rule for that tile: a tile has to promise **what gets built**, not how a
stranger will feel about it. "Trusted in Seconds" promised the visitor's
reaction, which nobody can guarantee.

### 3.7 Offerings are offerings, not facts about a running system

The page advertises AI chat, booking and appointment workflows, CRM routing, an
automated first response, and care-plan operations. Keeping them is the owner's
business decision and they are **not** to be deleted - they predate this
repositioning. What is not allowed is describing them as things that already
happen.

The "Never Miss a Lead" card previously narrated a scenario as fact -
"Someone asks a question at 11pm and gets an answer." It now reads as what a
build can include, scoped and quoted with the project like every other line on
this page. Everything on this page is quoted per project; these are not an
exception. §7 lists these same capabilities as unconfirmed, which is why the
description had to change.

For the same reason, the last capability in that card lost "so the pages keep
earning visits". What gets written and published is ours to deliver; where it
ranks is not. State the deliverable, not the search result.

### 3.8 House style

- Punctuation in JSX copy: a **spaced hyphen** " - ", never an em dash. HTML
  entities (`&apos;` `&amp;` `&ldquo;` `&rdquo;`) for JSX text, matching repo
  convention. Note that JSON strings in structured data are not JSX, so they
  carry no entities - a crawler would be served them literally.
- One vocabulary per idea. The page says "AI answers", not "answer engines" -
  two names read as two different subjects.
- Comments explain **why**, in full sentences. When a claim is removed for
  honesty reasons, the comment says so, so the next person does not put it back.
  The comment headers in `data/websites.ts`, `WebsitesOutcomeStrip`,
  `WebsitesShiftSection`, `WebsitesWorkSection`, `WebsitesServicesSection` and
  `BrowserFrameVisual` are the working record of that; this section is the
  index.

---

## 4. The lead route

`app/api/website-inquiry/route.ts` is a near-clone of
`app/api/lmm-consultation/route.ts`: per-request Resend construction (the
constructor throws on a missing key and would fail `next build`), honeypot,
server-side recipient, field-by-field error logging.

A separate route rather than a flag on the LMM one, because the subject line -
`New Website Request — {business} — {name}` - is what separates a website lead
from an automation lead in the inbox, and that only works if it is set here.
That subject line is also half of what §3.2 permits the page to claim about
measurement, so it is load-bearing copy, not a formatting detail.

Recipient: ceo@leeenterprisesunlimited.com, fixed in code since 2026-10-19
(`DEFAULT_TO_EMAIL` in `lib/email.ts`). The old `WEBSITE_TO_EMAIL`,
`LMM_TO_EMAIL` and `CONTACT_TO_EMAIL` overrides are no longer read.

`WebsitesInquiryForm` holds all form state, validation and fetch logic;
`WebsitesInquiryCTA` around it is a server component and only supplies the
heading. The form's `projectTypes` array has to stay in step with the service
card titles - see §1.

---

## 5. The entry point

Pill-style links sit in each hero's right-hand column, directly above the visual
panel and aligned to its left edge. All three LMM pages carry the row and each
one shows the *other two* offerings - see `docs/CROSS-LINKS.md`. This page is
reached from the row in `LmmHeroSection` and in `MarketingHeroSection`, and it
renders its own row pointing at the other two.

The websites pill reads "Websites That Convert". It named the production method
until this pass; it now names what the finished site does, matching §3.1. There
is a length constraint on that label documented in the component.

They are deliberately not solid buttons - the two CTAs under the headline are
each page's primary conversion, and a competing amber button would split them.
The pills fill solid on hover and carry an arrow so they still read as links.

**Known tradeoff.** The hero grid is `lg:grid-cols-2`, so below the `lg`
breakpoint the right column stacks *under* the headline column. At 390px the
pills land ~804px down - just past the fold on a typical phone, after both
primary CTAs. Desktop visitors see them immediately; phone visitors have to
scroll.

If phone visibility matters later, the fix is to render the row twice with
responsive visibility (`lg:hidden` in the headline column, `hidden lg:block`
above the panel) - the same two-layout duplication `AutomationFlowVisual`
already uses for its mobile rail versus desktop graph. Because the row is one
component now, that change lands in one file for all three pages.

---

## 6. Reused, not rebuilt

- `MainHeader` / `MainFooter` - unchanged
- `btn-primary`, `btn-secondary`, `section-container`, `heading-xl/lg` from
  `app/globals.css`
- `.lmm-status` pulse (reduced-motion safe) for the "Live" dot
- `smoothScrollToElement` from `lib/scrollUtils`
- `LmmSiblingLinks` from `components/lmm/` - shared by all three LMM heroes
- The amber LMM palette throughout - this is an LMM page, not a new brand

---

## 7. Before this is advertised

Code is done; these are business confirmations. **This list is what the page's
honesty currently rests on.** Section 3.7 permits the page to advertise chat,
booking, CRM routing, automated first response and care-plan operations *as
offerings quoted per project*, on the understanding that these boxes get
answered before ad spend points at the page. Every item below is something the
page names in `WebsitesServicesSection` or the FAQ. If an answer comes back
"no", the fix is to trim that line from the page, not to soften the wording.

- [ ] **Care plan operations** - hosting, software and security updates,
      backups, uptime monitoring, performance checks, small content changes, and
      a direct contact when something breaks. The card lists all seven. Confirm
      each is actually offered and at what cadence. The page says the plan is
      optional and quoted separately, and names no price.
- [ ] **Never Miss a Lead capabilities** - AI chat that answers at any hour,
      intake and quote forms, automatic lead routing to inbox/phone/CRM, an
      automated first response, appointment and booking workflows, and pages or
      posts published on a set schedule. Confirm each can be delivered, or trim
      the list. The card describes them as what a build *can* include, which is
      the honest framing while this box is unticked - it is not a substitute for
      ticking it.
- [ ] **Turnaround** - the page deliberately promises no number of days,
      anywhere. Keep it that way until there are enough completed builds to
      quote an honest range. See §3.3; the Process closing note and the
      "How long does a build take?" FAQ both hold this line and both had a
      timeframe removed from them.
- [ ] **Domain/hosting setup** - listed as included in a new build. Confirm who
      pays for the domain and hosting, and whether that is inside the quote.
- [ ] **Ownership** - the FAQ states the client owns the finished site. Confirm
      this matches how care-plan hosting is actually structured.
- [ ] **Resend domain verification** - until a domain is verified, Resend
      refuses every recipient except the account's own address. The page claims
      every enquiry is emailed on submit, which is one of the two measurement
      claims §3.2 allows, so this one has to be true before launch.
- [ ] **OG image** - currently reuses `/og/lee-marketing-mastery.png`. A
      websites-specific image would perform better when shared.

### If the answer to any of these changes

Ticking a box does not automatically license a bigger claim. Adding call
tracking or form-fill events, for instance, unlocks exactly the two places named
in §3.2 and nothing else. Completing client builds unlocks a timeframe range and
retires the "our own ventures" caveat - together, not separately. Update §3 in
the same commit as the copy, or the next person will read a rule that no longer
matches the page and reopen a decision that was already made.
