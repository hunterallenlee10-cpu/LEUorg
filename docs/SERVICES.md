# Services and the Demo Lab

Lee Enterprises Unlimited sells six service groups (the owner's list, 2026-10-17). Each
has its own page, a tile on the homepage, a card on `/how-it-works`, and an
interactive demo a visitor can watch in under a minute.

## One list

Everything reads `serviceGroups` in [`data/services.ts`](../data/services.ts):
the header's Services menu, the homepage "What we do" bento, the
`/how-it-works` cards and "Not on the list?" chips, `/services` and its Demo
Lab tabs, the six service pages, the "What do you need?" select, the contact
email's subject tag, the structured data and the sitemap. Change a group
there and it changes everywhere.

| Slug | Name |
| --- | --- |
| `websites` | Websites & Online Stores |
| `get-found` | Marketing & Lead Generation |
| `ai-calls` | AI Call Answering |
| `follow-up` | Follow-Up & Booking Automation |
| `content` | Content & Social Media |
| `custom-ai` | AI Tools Built for Your Business |

The care plan is never on the site (the owner's rule, 2026-10-23): it is part of
every build, not optional, and discussed right before a deal closes.

Copy rules: say what it does and who it is for; no vendor or tool names; no
prices, timelines, results, client counts or testimonials. The platforms
named (Google, Instagram and so on) are where the work shows up.

## Pages

| URL | What it is |
| --- | --- |
| `/services` | Hero, the six groups as alternating rows ("See it work" opens the group's Demo Lab tab, "Learn more" its page), the Demo Lab (`#demo-lab`), a closing call, and the form. |
| `/services/[slug]` | Hero, the group's demo (`#demo`), what's included, who it's for, how it works, related builds (websites only), pairs well with, a call, and the form with the group picked. Built at deploy time; any other slug is a 404. |

Deep links: `/services?demo=ai-calls` or `/services#demo-lab?demo=ai-calls`
opens a Demo Lab tab. `?service=<slug>` or `?interest=<slug>` on any page with
the inquiry form picks that group in "What do you need?", and every
demo's "Book a free call" uses it.

## The demos

`components/services/demos/`, one per group, loaded with `next/dynamic` only
when within about a screen of view, behind a placeholder of exactly the same
height (`demoSizes` in `components/services/demo/sizes.ts`; change a demo's
layout and its size there together). They run on `useDemo`, a step clock:

- starts by itself once a third is on screen (Follow-Up waits for the
  visitor's Send), holds off screen and in a hidden tab;
- under reduced motion opens on the result frame, with "Step through" and
  "Next";
- a visitor's own choice pauses it; Replay starts clean;
- sends `demo_play` (a visitor pressed Play, Replay or Step through) and
  `demo_cta` to Vercel Analytics.

Every demo is a client-side simulation from fixture data in `data/demos/`:
no network requests, no live AI, made-up businesses and 555 numbers, the
"Example" label and the "Simulated example" footnote.

The small pictures on each service's tile are `MiniPreview`: on the homepage,
`/how-it-works` and the service pages a "live poster" (a 5-second loop of the
moment the service is for, with one line of what just happened drawn over it,
`data/demos/posters.ts`), and on `/services` a CSS-only sketch of the demo
(`variant="ui"`, `components/services/services.css`). Both move only on
screen and show their finished frame otherwise.

### Photos, footage and sound in the demos

The demos show real-looking pictures, footage and sound rather than icons in
boxes. Most of it was generated in Higgsfield on 2026-10-24
(`docs/DEMO-MEDIA-PLAN.md`): made-up places, no faces, words or logos. Photos and
footage carry no "AI-generated" tag (the owner's call, 2026-10-25); AI voices
are still named beside their play buttons, and the footnote says the example
is simulated. Higgsfield makes the picture; the words, numbers and buttons over it
are drawn in code, so they stay sharp and match the demo.

- **Pictures:** `data/demos/images.ts` lists each one and where it came from.
  The industry pictures are the "Who we help" ones
  (`public/lee-systems/industries/`); the rest are in `public/demos/img/`.
  The older ones are CC0 / public domain (StockSnap and Flickr, via
  Openverse), so no credit is owed. The map is OpenStreetMap, which does
  need its credit: keep the "© OpenStreetMap" label (`MapCredit`) wherever it
  shows. The dark theme shows it inverted into night colours with a CSS
  filter; it is one file.
- **Loops:** `public/demos/video/`, muted 5-second loops with a WebP still of
  the first frame beside each: the tiles' live posters (`tile-*`), the
  industry loops (the Websites demo's hero and the "Who we help" cards), the
  sponsored ad in Get Found, and the desk behind the onboarding devices on
  How It Works. `DemoVideo` loads one only near the screen, plays it only on
  screen, and shows the still under reduced motion or Save-Data.
- **The content clip:** `public/demos/content/raw.mp4` and `edited.mp4`, the
  same shots handheld and flat, then cut, graded and captioned (the captions
  and hook are drawn in code).
- **The satchel's drag-to-turn:** `public/demos/img/spin/satchel.webp`, 36
  frames in one sheet (`ProductSpin`). It loads when the visitor points at or
  focuses it, and turns with drag, swipe or the arrow keys.
- **Sound:** the four call recordings (`public/demos/calls/`, AI voices for
  the receptionist and the caller) and the voice note in Custom AI Tools
  (`public/demos/voice-note.mp3`). Their timings
  (`data/demos/call-timing.json`, `data/demos/voice-note.json`) keep the
  transcript, the booking and the waveform in step with what is heard.
  Nothing makes a sound until the visitor presses Listen or Play.

The set is about 3.5 MB, each file loaded only when its section nears the
screen. To swap one, replace the file under the same name (same size and
crop) or point the data file at a new one. To rebuild them from new
Higgsfield downloads: `scripts/build-demo-audio.mjs` (the calls and the voice
note), `scripts/build-demo-media.sh` (the loops, the content clip and the
turntable) and `scripts/build-demo-films.mjs` (the How It Works films). The
downloads themselves are not kept (`.media-work/` is ignored by git).

## To fill in

Nothing here blocks the site; it falls back cleanly until it is added.

| What | Where | Until then |
| --- | --- | --- |
| A real number for the AI call demo line | `callAnswering.demoPhone` in `data/site.ts` | "Call our demo line" is hidden |

Media is found at build time (`lib/demo-assets.ts`), so add the file and
redeploy. Recordings and clips must be of made-up businesses. Name an AI
voice beside its play button; photos and video get no AI tag.

## Testing the forms

`LEAD_EMAIL_DRY_RUN=1` (Preview or local only) logs every form email instead
of sending it. Each "What do you need?" value arrives as the group's name,
and a `websites` request goes where website quote requests always have.
