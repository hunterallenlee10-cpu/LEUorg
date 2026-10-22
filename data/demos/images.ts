/**
 * The photos the demos and their homepage previews show, so a mock site,
 * a map or a reel looks like the real thing rather than an icon in a box.
 *
 * - The four industry pictures are the /lee-systems "Who we help" ones
 *   (public/lee-systems/industries/), generated for this site.
 * - Everything in public/demos/img/ is CC0 / public domain (StockSnap and
 *   Flickr, found through Openverse), so no credit is owed, except the map:
 *   map.webp is OpenStreetMap, which must keep its "© OpenStreetMap" credit
 *   wherever it shows (MapCredit in components/services/demo/ui.tsx).
 *
 * Each picture is decorative: the text beside it says what it is, so every
 * <img> has an empty alt.
 */

const industry = (id: string) => `/lee-systems/industries/${id}.webp`;
const img = (file: string) => `/demos/img/${file}`;

export const demoImages = {
  /** 800 x 450. */
  homeServices: industry("home-services"),
  law: industry("law-firms"),
  fitness: industry("fitness"),
  restaurant: industry("restaurants"),
  /** 800 x 480, a leather satchel on stone. */
  storeProduct: img("store-satchel.webp"),
  /** 720 x 405, an AC condenser beside a house. */
  acUnit: img("ac-unit.webp"),
  /** 800 x 533, a house at dusk. */
  houseDusk: img("house-dusk.webp"),
  /** 900 x 351, OpenStreetMap streets. */
  map: img("map.webp"),
  /** 160 x 160 squares for listing thumbnails. */
  thumbs: [img("thumb-1.webp"), img("thumb-2.webp"), img("thumb-3.webp"), img("thumb-4.webp")],
  /** 360 x 640 (9:16) shots for the sample reel: a roofer's tool belt,
   *  shingles up close, the house at dusk. */
  reel: [img("reel-1.webp"), img("reel-2.webp"), img("reel-3.webp")],
} as const;
