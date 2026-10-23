# Recent Builds: how to send a build

"Recent Builds" is the 360° ring of boxes on the homepage and /lee-systems
(`components/shared/RecentWorkSection.tsx`, turned by `BuildsRing.tsx`). The
front box faces the visitor and the rest wrap round behind it, so it's clear
there are more; it turns to the next build every 3 seconds on its own, and
visitors can drag it, use the arrows or dots, or click a build at the side, so
any number of builds fits without the section getting taller. Each box is
one website we built: a screenshot of its first screen in a browser frame, the
kind of business, the name, tags for what we built, an optional result line,
and the whole box links to the live site. A rebuild also says "Upgraded from <old site>"
(`upgradedFrom`). The entries live in `projects` in `data/site.ts`, in the
owner's order, and each name is written as its live site shows it.

Only work the client has OK'd showing goes in, and nothing in a box is made
up: if a detail isn't sent, it's left out.

## What to send for a website

Copy this, fill it in, one per site:

```
Name: Smith Plumbing
Link: https://smithplumbing.com
Client work, template, or our own venture: Client work
Old site, if we rebuilt one (optional): https://old-smithplumbing.com
Kind of business and town: Plumber, [Town, State]
What we built:
- Website
- AI call assistant
- Booking and follow-up texts
Result (one line, only numbers you can back up, or leave blank):
Client OK'd showing it: yes
```

Screenshots are optional. Claude takes one of the live site's first screen. To
pick the view yourself, send a full-size PNG of the desktop page (and a phone
one if you like), not a photo of a screen.

## What to send for an automation (format still being decided)

Automations don't show in Recent Builds yet. Until the format is settled,
collect:

```
Name: Missed-call text-back for Smith Plumbing
What starts it: a call nobody picks up
What it does, step by step:
1. Texts the caller within a minute
2. Asks what they need and books a time
3. Adds them to the CRM
Result (only numbers you can back up, or leave blank):
Tools used: e.g. GoHighLevel, Twilio
Client OK'd showing it: yes
```

Plus a 30–90 second screen recording of it running (MP4, 1080p; Loom, OBS or a
phone screen recording all work), with client names, phone numbers and
amounts blurred or fake. Screenshots as full-size PNGs.

## How to send it

- **Best: a Google Drive folder.** Make one folder, "LEU Recent Builds", with
  a subfolder per build holding an `info.txt` (the filled-in form above) and
  its screenshots and videos. Share it with the Google account connected to
  Claude and say "add the new builds": Claude reads the folder through the
  Drive connector.
- **Quick: paste it into a session.** The filled-in form as text, with any
  screenshots dragged into the message. Videos are better through Drive.

## How Claude adds one

1. Add the entry to `projects` in `data/site.ts`.
2. Screenshot the site's first screen at 1440×900 with Playwright, or use the
   one you sent. In a Claude cloud session the browser can't verify the
   proxy's certificate, so have Playwright hand each request to Node's
   `fetch` (`page.route` + `route.fulfill`, run with `NODE_USE_ENV_PROXY=1`),
   which goes through the proxy with full certificate checks. Save it as a
   960×600 webp (quality about 80) at
   `public/projects/<name>.webp`. next.config.mjs serves images unoptimised,
   so each one is sized for its box. Look at each shot before saving it: a
   hero that animates can be caught mid-change. Our own homepage swaps its
   headline for an animation a few seconds in, so shoot it with
   `reducedMotion: "reduce"`; H1's stat counter is clean about 1.5 seconds
   after load. Rocha's hero is a looping driving video: about 6 seconds after
   load it shows the aerial shot of the green winding road, the frame we use.
3. With fewer than three builds and `showPlaceholders` on, "coming soon"
   boxes fill the row out to three.
4. When a client's site changes, retake its shot the same way. All of them
   were last refreshed on 2026-10-07 (Rocha's again later that day, after
   its hero changed to a video).
