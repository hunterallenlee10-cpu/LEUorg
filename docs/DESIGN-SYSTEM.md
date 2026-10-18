# Design system (university.com colours, 2026-10-18)

The site follows university.com's structure and, since 2026-10-18, its
colours, in LEU's own type and copy. The study behind it (screenshots and
computed styles) is in `design-ref/DESIGN-NOTES.md`.

## Tokens

All in `app/globals.css`, "Light and dark themes". Light is university.com's
palette; dark is navy and black.

| Token | Dark (default) | Light |
| --- | --- | --- |
| Page `--ds-bg` | `#000000` black | `#F9FBFC` |
| Surface `--ds-surface` | `#0F2346` navy | `#FFFFFF` |
| Alternate row `--ds-alt` | `#0A1830` | `#F2F5FB` |
| Text `--ds-text` | `#F9FBFC` | `#0F2346` navy |
| Muted `--ds-muted` | `#A9B4C8` | `#4B5A75` |
| Button fill `--ds-gold` | `#1F56B8` blue | `#0F2346` navy |
| Accent text `--ds-gold-text` | `#9DBBF0` light blue | `#17479A` blue |
| Text on buttons `--ds-on-gold` | `#FFFFFF` | `#FFFFFF` |
| Band `--ds-band` | `#0F2346` navy | `#000000` black |
| Focus ring `--ds-focus` | `#9DBBF0` | `#17479A` |

Tailwind's `amber-*` and `brass-*` colours are both the blue accent (the
names are left from the gold design), so existing utilities follow the
theme. `.ds-band` is a panel that stays dark in the light theme too (The
Journey, the closing banner).

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
