# Design system (black and gold, 2026-10-18)

The site follows university.com's structure in LEU's own colours, type and
copy. The study behind it (screenshots and computed styles) is in
`design-ref/DESIGN-NOTES.md`; the after screenshots are in `design-ref/after/`.

## Tokens

All in `app/globals.css`, "Light and dark themes".

| Token | Dark (default) | Light |
| --- | --- | --- |
| Page `--ds-bg` | `#0E0F11` | `#F7F3EA` ivory |
| Surface `--ds-surface` | `#16181B` | `#FFFFFF` |
| Text `--ds-text` | `#F5F3EE` | `#1A1814` |
| Muted `--ds-muted` | `#A1A1AA` (7.5:1) | `#554E43` |
| Gold fill `--ds-gold` | `#C9A24B` | `#C9A24B` |
| Gold text `--ds-gold-text` | `#C9A24B` (8.0:1) | `#7F611B` (5.2:1) |
| Focus ring `--ds-focus` | `#E2C275` | `#7F611B` |

Tailwind's `amber-*` and `brass-*` colours are both the gold accent, so
existing utilities follow the theme. `.ds-band` is a panel that stays
near-black in the light theme too (The Journey, the closing banner).

## Type

`lib/fonts.ts`.

- Display: Archivo extra-condensed black (one static instance, 10 KB, in
  `lib/fonts/`), all caps. `.ds-h1`, `.ds-h2` (`.ds-h2--sm` beside a form or
  list), `.ds-h3`. On pages with `.ds-page` on their wrapper, every `h1` and
  `h2` in `<main>` takes the display face; add `.ds-keep` to opt one out.
- Body: Geist.
- Eyebrows and labels: Geist Mono, widely tracked (`.ds-eyebrow`,
  `.ds-eyebrow--center`).

## Components

- Buttons: one shape, square with a double border. `BookCallLink` for every
  "Book a free call"; `.btn-ds` / `.btn-ds-outline` for other actions.
- Cut corners: `.ds-cut` (and `--lg`) on tiles and panels, `.ds-card` +
  `.ds-card-body` for cards with a hairline edge that turns gold on hover.
- `components/ui/ds.tsx`: `SectionHead`, `Underlined` (the hand-drawn gold
  underline), `ScribbleArrow`, `StatTiles`.
- `components/ui/ShowMoreGrid.tsx`: 6 items (3 on a phone), then "Show more".
- FAQ: `.ds-faq` on native `<details>`; the homepage questions are in
  `data/faq.ts` (an empty answer stays hidden).
- Motion: `data-reveal` fades a block up as it scrolls in, CSS only, off under
  reduced motion and in browsers without scroll-driven animation.

## Homepage switches

- `site.vsl` in `data/site.ts`: the video slot under the hero, off by default.
- `BM_JOURNEY_LOCKED` in `data/business-mastery.ts`: The Journey, locked or open.
