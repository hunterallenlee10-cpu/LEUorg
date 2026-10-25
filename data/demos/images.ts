/**
 * The photos the demos and their homepage previews show, so a mock site,
 * a map or a reel looks like the real thing rather than an icon in a box.
 *
 * - The industry pictures are the How It Works "Who we help" ones
 *   (public/lee-systems/industries/), generated for this site.
 * - Generated in Higgsfield on 2026-10-24 (docs/DEMO-MEDIA-PLAN.md), all of
 *   made-up places with no faces, words or logos: the inspection photo, the
 *   four listing thumbnails, the storm-cleared house for the ad,
 *   and the four reel shots.
 * - The rest of public/demos/img/ is CC0 / public domain (StockSnap and
 *   Flickr, found through Openverse), so no credit is owed, except the map:
 *   map.webp is OpenStreetMap, which must keep its "© OpenStreetMap" credit
 *   wherever it shows (MapCredit in components/services/demo/ui.tsx).
 *
 * Each picture is decorative: the text beside it says what it is, so every
 * <img> has an empty alt (the inspection photo, which the tool reads, has
 * its own in data/demos/custom-ai.ts).
 */

const industry = (id: string) => `/lee-systems/industries/${id}.webp`;
const img = (file: string) => `/demos/img/${file}`;

export const demoImages = {
  /** 800 x 450. */
  homeServices: industry("home-services"),
  law: industry("law-firms"),
  fitness: industry("fitness"),
  restaurant: industry("restaurants"),
  /** 720 x 405, an AC condenser beside a house. */
  acUnit: img("ac-unit.webp"),
  /** 800 x 533, a house at dusk. */
  houseDusk: img("house-dusk.webp"),
  /** 960 x 384, a house at dusk as a storm clears: the sponsored ad. */
  adHouse: img("ad-house.webp"),
  /** 960 x 540, a house with a loose ladder, worn shingles and a hanging gutter. */
  inspection: img("inspection.webp"),
  /** 900 x 351, OpenStreetMap streets. */
  map: img("map.webp"),
  /** 160 x 160 squares for listing thumbnails: Ridgeline's new roof first,
   *  then the competitors' van, ranch house and roofer's hands. */
  thumbs: [img("thumb-1.webp"), img("thumb-2.webp"), img("thumb-3.webp"), img("thumb-4.webp")],
  /** 360 x 640 (9:16) shots of a roofer at work: the tool belt, the
   *  gutter, the house at dusk, the ladder. The content clip's frames. */
  reel: [img("reel-belt.webp"), img("reel-gutter.webp"), img("reel-house.webp"), img("reel-ladder.webp")],
} as const;
