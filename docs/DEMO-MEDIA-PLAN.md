# Demo Lab and service media plan (Higgsfield)

The plan for upgrading every Demo Lab, service and How It Works animation on
all three LEU sites (leeenterprisesunlimited.com, .net and .org) with media
made in Higgsfield, so a business owner can open any of them and see, hear and
try what LEU builds. Written 2026-10-24. Nothing in it is built yet; the
phases at the end say what ships first.

## The short version

1. **The demos are already well built; they're silent and short on real
   footage.** The call demo has no call to hear, the voice-note tool has no
   voice, the content demo's "reel" is three still photos, and the small
   service previews on the homepage are hard to read. Higgsfield fills exactly
   those gaps: voices, real-looking footage, and consistent photos.
2. **Higgsfield makes the world; code keeps the facts.** Generated media
   supplies places, motion and sound. Every word, number, name, time and
   button stays in code on top of it, so nothing on screen is garbled,
   invented or out of date, and it still follows each site's theme.
3. **One set of demos, three sites.** The .net site becomes the source for
   the demo code and media, and .com and .org take the same files. Today the
   three have drifted apart in small ways (listed below).
4. **Three paid phases after a code-only setup, about 585 Higgsfield credits
   in all** (766 on the account today): sound and photos first (about 90),
   then motion (about 240), then the two narrated films on How It Works
   (about 255).
5. **Six decisions for Hunter** before any credits are spent (end of this
   file): the look, the voices, faces or no faces, the source site, one
   roofer name, and the budget.

## What's on the sites today

| Section | Where | What it is today |
| --- | --- | --- |
| Demo Lab (`/services#demo-lab`) and the demo on each `/services/[slug]` page | all three | Six interactive demos (`components/services/demos/`), each a simulation in code on a step clock (`useDemo`), with photos from `data/demos/images.ts` |
| Mini previews (`MiniPreview`) | homepage, `/services` rows, each service page hero, How It Works cards | Six tiny CSS loops, one per service |
| Two paths, and the website video | How It Works, all three | Narrated videos: three icon panels, captions and an Everygen voice track (`NarratedVideo`) |
| Live demo (form to workflow) | How It Works, all three | A code animation: a form is sent and the lead runs through the workflow |
| "Watch one system run your week" | How It Works, all three | A code animation in the style of a workflow editor, four stories |
| Who we help | How It Works, all three | Six industry pictures (generated in Everygen, 2026-09-29) |
| Audit, Build, Take off | How It Works, all three (and the .org homepage) | Laptop and phone drawn in code with skeleton screens (`OnboardingDevices`) |
| Recent builds ring, website deck | all three | Real client work only |

### Where the three sites differ today

| | .com (`leu`) | .net (`LEUnet`) | .org (`LEUorg`) |
| --- | --- | --- | --- |
| Theme | Gold, dark only | Platinum dark, navy light | Light blue dark, deep blue light |
| Homepage service tiles | `ServicesShowcase` bento | `ServicesShowcase` bento | `HomeServices` cards (its own redesign) |
| How It Works "What we do" | The older two cards (`LeeSystemsOfferingsSection`) | Six service cards with previews (`LeeSystemsServicesSection`) | Six service cards with previews |
| A demo's "Book a free call" | Opens the form, service not picked | Opens the form with the service picked | Opens the form with the service picked |
| Demo colours | Gold written into the code (`rgba(212,168,87,…)`) | Theme variables (`rgb(var(--gold)/…)`) | Theme variables |
| Onboarding devices | Stacked steps | Stacked steps | Also one step per row on the homepage (`single`) |

The demo components themselves are 95% the same file on all three; the
differences are light-theme classes and the gold written into the .com code.

## Five rules for every piece of media

These carry over the rules already in `docs/SERVICES.md`, `docs/LEE-SYSTEMS.md`
and the brand brief.

1. **Made-up businesses only.** The demos' own: Ridgeline Roofing, Cool
   Breeze Heating & Air, Hartwell Injury Law, Forge Strength Studio, Olive &
   Ember, Northwind Goods. 555 phone numbers. No real brands, logos or
   signage in any frame.
2. **No generated text.** Higgsfield frames carry no words, numbers, logos or
   screen content. Device screens are generated dark and the real interface
   is laid over them in code.
3. **Labelled as AI.** Any AI voice reads "AI voice" beside its play button,
   and any AI footage carries a small "AI-generated" tag. The existing
   "Simulated example" footnote stays.
4. **No faces standing in for customers** (recommended; see the decisions).
   Hands, backs, silhouettes and empty rooms only, as the industry pictures
   already do. Nothing implies a client, a testimonial or a result.
5. **Never loud, never heavy.** Nothing plays with sound until it's pressed.
   Loops are muted, load only near view, pause off screen and in a hidden
   tab, and show a still under reduced motion or Data Saver. No figure,
   ranking or result appears that isn't already in the demo's copy.

### The look

One grade for everything: **graphite night with warm practical light** (lamps,
screens, porch lights), low-key, shallow depth of field, 35mm, slight grain.
No brand colour is baked in, so the same file sits under gold (.com),
platinum (.net) and blue (.org), and inside the light theme's white demo
frames it reads as a photo. The six industry pictures already have this look;
everything new matches them.

## Section by section

Priorities: **P1** ships first and costs least; **P3** is the most work.

### 1. AI Call Answering demo — P1

- **Today:** the transcript plays line by line; the "Listen" button is built
  but hidden, because `public/demos/calls/*.mp3` don't exist.
- **Higgsfield:** the four calls recorded from the exact lines in
  `data/demos/calls.ts`, with Eleven v4 (`generate_audio`, model
  `elevenlabs_v4`). One receptionist voice for all four, since that voice is
  the product, and a different caller voice each. One clip per line, built
  into each call's MP3 and timing file with `scripts/build-video-audio.mjs`
  (extended with the four calls): a ring and pickup at the start, the
  caller's side band-limited like a phone line.
- **Code:** the transcript highlights the line being spoken, from the timing
  file (the narrated videos already work this way), and "AI voice" sits
  beside Listen. Nothing plays until Listen is pressed.
- **Optional:** the ringing screen's photo becomes a 5-second loop of a phone
  lighting up on a dark counter at 11:48 PM, with the call screen in code.
- **Cost:** about 30 credits for audio (test one line first to confirm the
  per-clip price), 8 for stills, about 30 for the optional loops.

### 2. Content & Social Media demo — P2

- **Today:** `raw.mp4`, `edited.mp4` and `poster.webp` are missing, so the
  phone plays a reel cut from three still photos. The week's 21 posts reuse
  the same three thumbnails.
- **Higgsfield:** the actual clip. Three shots of a roofer at work, faceless:
  hands buckling a tool belt and climbing a ladder at golden hour; gutter
  debris close up; the house at dusk with the ladder. Start frames in Nano
  Banana Pro (9:16, 2K), animated with Kling 3.0 (5 seconds, sound off).
  **Raw** is one flat, handheld, badly exposed take of the same scene.
  **Edited** is the three shots cut every two seconds, graded, with a push-in
  on each cut (cut locally with ffmpeg). Then 8 more stills so the calendar
  shows a varied week; the reel and short cells use frames from the clips.
- **Code:** none beyond adding the files (`lib/demo-assets.ts` finds them).
  The captions and hooks already sit over the clip in code. Add the
  "AI-generated" tag on the phone.
- **Cost:** about 50 credits for the clips, 16 for thumbnails.

### 3. Websites & Online Stores demo — P2

- **Today:** a mock site per industry with a still photo; the slider wipes an
  old site into a new one.
- **Higgsfield:**
  - A 6-second, seamless, silent loop behind each new site's hero (five, made
    from the existing pictures in Kling with the same image as the first and
    last frame, so it loops cleanly): lamplight flickering in the law office,
    steam off the restaurant's grill, light moving across the gym. The **old**
    site keeps its squashed, washed-out still, so the slider goes from a dead
    page to a living one, which is the point of the demo.
  - The online store's product shots: the Field Satchel from four angles
    (Nano Banana Pro with the first shot as a reference), plus the missing
    `online-stores.webp` that `docs/SERVICES.md` lists under "To fill in".
  - **New interaction:** a 360° spin of the satchel on the store's product
    card. Generate one orbit clip, cut it to 36 frames, and let the visitor
    drag to turn it. A store owner sees a feature they'd want, and it costs
    one clip.
- **Cost:** about 45 credits for loops, 8 for stills, 10 for the orbit.

### 4. Marketing & Lead Generation demo — P2

- **Today:** a map with four listings, an AI answer and a sponsored ad, all
  on stock thumbnails; the ad is a still.
- **Higgsfield:** a matching set of four listing photos (a roofline, a work
  van with no lettering, a crew's hands, a finished roof), and the sponsored
  ad as a 6-second muted video, the way real video ads look in a feed. The
  ad's headline, phone number and "Sponsored" stay in code over it.
- **Cost:** 8 credits for stills, about 15 for the ad.

### 5. Follow-Up & Booking demo — P3 (light touch)

- **Today:** the strongest interaction of the six ("You be the lead"); it's
  all interface.
- **Higgsfield:** reuse only. The post that gets the "PRICE" comment shows a
  frame from the Content clip, and the business's contact photo uses the
  Ridgeline set, so the demos share one world. No new credits.

### 6. AI Tools Built for Your Business demo — P1

- **Today:** the voice note's waveform is random bars and has no sound; the
  photo inspection draws its hazard boxes on the general home-services
  picture.
- **Higgsfield:**
  - The 14-second voice note (`voiceNote.transcript`) read in a contractor's
    voice, with light outdoor sound under it. Tap to play; the waveform
    becomes the recording's real shape, measured at build time.
  - A job-site photo made for the inspection: the ladder footing on uneven
    ground, worn shingles at the ridge, a gutter pulling away over a window.
    The boxes in `data/demos/custom-ai.ts` are then moved to match the photo.
- **Cost:** about 5 credits for the voice, 8 for the photo.

### 7. The mini previews — P2

- **Today:** six CSS loops. As homepage tiles they're very small, mostly dark,
  and their text is unreadable; the AI calls and follow-up tiles read almost
  empty on first view.
- **Higgsfield:** a "live poster" per service. A locked-off, 5-second loop of
  the moment the service exists for, with the existing mini interface laid
  over the device's screen:

  | Service | The shot |
  | --- | --- |
  | Websites | A laptop on a walnut desk at night; on screen the old site wipes into the new one |
  | Marketing & leads | A hand holding a phone over a kitchen counter; the business climbs the map |
  | AI calls | A phone face up on a nightstand at 11:48 PM, lamp on; the call comes in and turns into "Booked" |
  | Follow-up | A phone on a truck dashboard; the reply arrives |
  | Content | A phone on a small tripod in a driveway, playing the reel |
  | AI tools | A phone and a clipboard on a tailgate; the voice note turns into a quote |

  To keep the screen still while the room moves, take motion only from a
  masked area (lamp, steam, rain on a window) and hold the rest of the frame
  on the first frame (a cinemagraph, done in ffmpeg). The screen's four
  corners go in the media list, and the interface is fitted to them with one
  CSS transform.
- **Code:** a `ScreenOverlay` component (fits any element to four corners),
  and the minimum text size inside a preview raised so its words read.
- **Cost:** 12 credits for stills, about 60 for loops.

### 8. Two paths, and the website video — P3, the flagship

- **Today:** narrated, captioned and timed to their soundtracks, but the
  picture is three icon panels.
- **Higgsfield:** a picture track for each, cut to the existing narration and
  timing files, which stay the clock. About ten shots for Two paths and eight
  for the website video, each 4 to 6 seconds:
  - **By hand** (cold, desaturated): a phone ringing on an empty counter
    after hours; the voicemail light blinking; a hand scrolling missed calls
    in the morning; the clock ticking.
  - **With AI** (warm): the same phone, answered; the confirmation text
    arriving; the calendar slot filling (in code over the screen); a hand
    with a coffee picking up the phone to see "Booked".
  - **Website video:** a thumb tapping a slow site that keeps loading, then
    the back button; then the same tap on a fast site, and a request sent.
  - Each run is one muted MP4 that plays in the frame under the captions,
    following the soundtrack's clock. The panels' labels stay as overlays.
    Under reduced motion it shows one still per run.
- **Cost:** about 125 credits for Two paths and 100 for the website video,
  with a third of that held back for retakes.

### 9. Who we help — P2

- **Today:** six good stills, and no picture yet for online stores.
- **Higgsfield:** each picture as a subtle 4-second loop from the same still
  (lamp flicker, a candle, light moving across a showroom floor), playing only
  while the card is on screen, and the seventh, online stores, made to match.
- **Cost:** about 55 credits.

### 10. Audit, Build, Take off — P3

- **Today:** skeleton laptop and phone screens beside the steps, with a lot
  of empty space.
- **Higgsfield:** one photographic desk scene per step (morning notes and
  coffee for Audit; night, screens lit for Build; morning, phone on the
  counter for Take off), with the existing animated screens fitted onto the
  devices with `ScreenOverlay`, and an optional slow push-in.
- **Cost:** about 30 credits.

### Staying as code (no Higgsfield)

A pro knows when not to use AI. These are better as they are:

- **The live demo** (form to workflow) and **the week film**: precise,
  interactive and already strong. At most, the week film's after-hours call
  could offer the AC repair recording from section 1.
- **Recent builds and the website deck**: real client work only, by the
  brand rule. Never generated.
- **The contract check and spreadsheet tools**: the point is the reading and
  the numbers, which code does exactly.
- **Business Mastery**: its own program and subdomain, outside this plan.

## Making all three sites match

Done once, before any media goes in, so every later phase lands on all three
sites in one change.

1. **.net is the source** for the shared files: `components/services/**`,
   `data/demos/**`, `public/demos/**`, `lib/demo-assets.ts`, the narrated
   videos (`NarratedVideo`, `TwoPathsDemo`, `WebsiteVideo`, their `data/`
   files and soundtracks), `LeeSystemsLiveDemoSection`,
   `LeeSystemsWorkflowFilmSection`, `LeeSystemsIndustriesSection`,
   `LeeSystemsServicesSection`, `OnboardingDevices` and
   `scripts/build-video-audio.mjs`. It's the most complete of the three
   (both themes, the service picked in the form).
2. **.com:** declare the `light` variant as a no-op in `app/globals.css` so
   the shared classes build on a dark-only site; replace the gold written
   into the code with the theme variables; swap the two Offerings cards on
   How It Works for the six service cards; and let the form pick the service
   from `?service=` (`inquiryNeeds` in `data/services.ts`).
3. **.org:** keeps its own homepage design, with the shared components inside
   it. Its `single` option on `OnboardingDevices` moves into the shared copy.
4. **A sync script** in .net (`scripts/sync-demos.mjs`) copies the shared
   files into the sibling repos and lists any file that differs, so drift
   shows up before it ships.
5. **One media list**, `data/demos/media.ts`: every generated file with its
   path, size, poster, screen corners where it has a device, whether it's AI
   (for the tag) and the prompt it was made from. It replaces the file
   checks in `lib/demo-assets.ts`, with the same fallbacks when a file is
   missing.
6. **Two small components:** `DemoVideo` (muted, inline, looping, loads near
   view, pauses off screen, still under reduced motion and Data Saver,
   optional "AI-generated" tag), built on the clock the demos already use;
   and `ScreenOverlay`.
7. **Hosting:** in each repo's `public/`, as today. If video passes about
   20 MB per site, move video to one shared Vercel Blob store that all three
   sites read.

## How each asset gets made

1. **A Higgsfield project**, "LEU Demo Media", so every generation stays
   together, named `<section>-<asset>-v<n>`.
2. **Look approval:** six style frames in Nano Banana Pro (2 credits each).
   Hunter picks the look before anything moves.
3. **One world:** a reference set per made-up business (the Ridgeline house
   and van, the Cool Breeze unit, the Hartwell office and so on), saved as
   Higgsfield reference elements so every shot of a business matches.
4. **Start frames:** Nano Banana Pro, approved as stills first, since a
   still costs 2 credits and a clip 8 to 25.
5. **Motion:** Kling 3.0 (sound off) for locked-off loops and shots, with the
   same image as first and last frame for a seamless loop; Seedance 2.0 when a
   shot must keep a reference exactly. 720p for frames on the page, 480p for
   the mini previews.
6. **Voices:** Eleven v4, one clip per line, put together with
   `scripts/build-video-audio.mjs`; Hunter picks the voices from previews.
7. **Finishing (ffmpeg, local):** trim to the loop, one shared grade, mask
   motion for cinemagraphs, encode MP4 (H.264) and WebM, a WebP poster, no
   audio in loops. Targets: a mini-preview loop under 400 KB, a demo loop
   under 1.2 MB, each film run under 4 MB, call audio at 64 kbps mono.
8. **Checks before it ships:** no garbled text, logos or extra fingers; no
   faces; the screen holds still; the loop has no visible seam; the size is
   on budget; the still shows under reduced motion; the AI tag is there;
   it looks right in both themes on all three sites, at 375 px and on desktop.

## Phases and budget

Credit costs are from this account's recent charges: Nano Banana Pro 2 per
image, Kling 4.0 about 5 to 10 per clip, Kling 3.0 7.5 to 25 per clip,
upscaling 2. Audio is priced on the first test.

| Phase | What ships, on all three sites | Credits |
| --- | --- | --- |
| 0. Match the sites | The parity work above, `DemoVideo`, `ScreenOverlay`, the media list. Code only. | 0 |
| 1. Sound and photos | The four call recordings with the live transcript, the voice note, the inspection photo, the store photos, the listing photos, the content thumbnails, and the six look frames | about 90 |
| 2. Motion | The content clip (raw and edited), the six live posters, the five website hero loops and the satchel spin, the video ad, the seven industry loops | about 240 |
| 3. Films | Two paths and the website video with pictures, and the three onboarding scenes | about 255 |
| | **Total, with about a third for retakes** | **about 585** |

Each phase is one release across the three sites. To see whether it worked,
the demos already send `demo_play` and `demo_cta` to Vercel Analytics; add
`demo_listen` for the call and voice-note audio, then compare the two weeks
before and after each phase, per site.

## Decisions for Hunter

1. **The look:** approve one of six style frames (Phase 1, 12 credits).
2. **Voices:** pick the AI receptionist's voice, the four callers' and the
   contractor's from previews. One receptionist voice for every call.
3. **Faces:** faceless only (recommended, and how the industry pictures were
   made), or people allowed with the AI tag.
4. **The source site:** .net as the one the others copy from (recommended).
5. **One roofer:** the demos use both Ridgeline Roofing and Summit Peak
   Roofing, and the homepage preview lists Ridgeline as a competitor. Making
   Ridgeline the business in every demo lets the story carry across them.
6. **Budget:** about 585 credits across three phases, from 766 today.

## Appendix: prompt starters

Every image prompt ends with the shared look:

> Low-key editorial photograph, graphite night, warm tungsten practical
> light, shallow depth of field, 35mm, subtle film grain. No people's faces,
> no text, no numbers, no logos, no signage, no brand colours. Any screen is
> dark and blank.

Every loop prompt adds:

> Locked-off tripod shot, the camera does not move. Only [the lamp / the
> steam / the rain on the window] moves, gently. Seamless loop.

Examples:

- **AI calls preview:** "A smartphone lying face up on a walnut nightstand
  beside a small brass lamp, 11:48 PM, a bedroom in darkness behind, the
  phone's screen dark and blank, seen from slightly above."
- **Content raw take:** "Vertical 9:16 phone video, handheld and shaky, flat
  colours, slightly overexposed: a roofer's gloved hands on a ladder against
  a suburban house's gutter in late afternoon. No face."
- **Inspection photo:** "A two-storey house at dusk with an aluminium ladder
  leaning against the roof edge, its feet on uneven, sloping ground; visibly
  worn and lifted shingles near the ridge; a gutter section pulling away
  from the fascia above a lit window."
- **Satchel:** "A full-grain tan leather satchel on a dark stone plinth,
  studio light from the upper left, three-quarter view, product photograph."
