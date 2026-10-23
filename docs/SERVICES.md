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

The small looping pictures on the homepage, `/how-it-works` and `/services`
are `MiniPreview` (CSS only, `components/services/services.css`): they move
only on screen and show their finished frame otherwise.

### Photos in the demos

The demos and the previews show real photos rather than icons in boxes, all
listed in `data/demos/images.ts`:

- the mock websites, the ringing phone, the contact photo and the photo
  inspection use the four "Who we help" pictures
  (`public/lee-systems/industries/`);
- everything else is in `public/demos/img/`: the store's satchel, the AC
  unit, a house at dusk, four listing thumbnails, three 9:16 reel shots and
  the street map. The photos are CC0 / public domain (StockSnap and Flickr,
  via Openverse), so no credit is owed;
- the map is OpenStreetMap, which does need its credit: keep the
  "© OpenStreetMap" label (`MapCredit`) wherever it shows. The dark theme
  shows it inverted into night colours with a CSS filter; it is one file.

To swap a photo, replace the file under the same name (same size and crop)
or point `data/demos/images.ts` at a new one. Pictures are decorative and
plain `<img>`s, so keep them small WebPs (the set is about 320 KB).

## To fill in

Nothing here blocks the site; each falls back cleanly until it is added.

| What | Where | Until then |
| --- | --- | --- |
| A real number for the AI call demo line | `callAnswering.demoPhone` in `data/site.ts` | "Call our demo line" is hidden |
| Call recordings, one per scenario | `public/demos/calls/ac-repair.mp3`, `law.mp3`, `gym.mp3`, `restaurant.mp3` | Transcript only, no Listen button |
| The same 9:16 clip raw and edited, plus a still | `public/demos/content/raw.mp4`, `edited.mp4`, `poster.webp` (or `.jpg`) | A reel cut from three stock shots (`data/demos/images.ts`) |
| A picture for "Online stores" | an `online-stores.webp` beside the other industry pictures, then `serviceIndustry` in `data/services.ts` | An icon card |

Media is found at build time (`lib/demo-assets.ts`), so add the file and
redeploy. Recordings and clips must be of made-up businesses, and any AI
voice or video must be labelled as AI.

## Testing the forms

`LEAD_EMAIL_DRY_RUN=1` (Preview or local only) logs every form email instead
of sending it. Each "What do you need?" value arrives as the group's name,
and a `websites` request goes where website quote requests always have.
