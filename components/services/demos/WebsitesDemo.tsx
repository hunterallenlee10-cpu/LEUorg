"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  Check,
  Dumbbell,
  House,
  Monitor,
  Scale,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { DemoFrame } from "@/components/services/demo/DemoFrame";
import { useDemo } from "@/components/services/demo/useDemo";
import { DemoVideo } from "@/components/services/demo/DemoVideo";
import { ProductSpin } from "@/components/services/demo/ProductSpin";
import { Photo, Segmented, Stars } from "@/components/services/demo/ui";
import { demoSizes, demoTitles, type DemoProps } from "@/components/services/demo/sizes";
import {
  storeProduct,
  websiteSkins,
  type WebsiteSkin,
  type WebsiteSkinId,
} from "@/data/demos/websites";

/**
 * Websites & Online Stores: an outdated site against a new one.
 *
 * The slider under the mock site wipes between the old site (left: slow,
 * cluttered, no clear next step, its photo squashed) and the new one (right:
 * one headline, one button, the business's photo filling the side). The industry switch re-skins the new site, the device switch
 * shows it on a phone, and the online store skin walks through add to cart,
 * checkout and "Order confirmed". It ends on the phone with a "New lead
 * received" toast.
 *
 * The demo plays all of that by itself; a visitor's own choice (dragging the
 * slider, picking an industry or device, clicking through the store) pauses
 * it and holds until Replay.
 */

type Device = "desktop" | "phone";
type StoreStage = 0 | 1 | 2 | 3;

interface Frame {
  slider: number;
  skin: WebsiteSkinId;
  store: StoreStage;
  device: Device;
  loading?: boolean;
  toast?: boolean;
}

/** The demo, step by step. Slider = how much of the old site shows, in %. */
const frames: readonly Frame[] = [
  { slider: 88, skin: "home", store: 0, device: "desktop", loading: true },
  { slider: 50, skin: "home", store: 0, device: "desktop" },
  { slider: 0, skin: "home", store: 0, device: "desktop" },
  { slider: 0, skin: "law", store: 0, device: "desktop" },
  { slider: 0, skin: "fitness", store: 0, device: "desktop" },
  { slider: 0, skin: "restaurant", store: 0, device: "desktop" },
  { slider: 0, skin: "store", store: 0, device: "desktop" },
  { slider: 0, skin: "store", store: 1, device: "desktop" },
  { slider: 0, skin: "store", store: 2, device: "desktop" },
  { slider: 0, skin: "store", store: 3, device: "desktop" },
  { slider: 0, skin: "home", store: 0, device: "phone" },
  { slider: 0, skin: "home", store: 0, device: "phone", toast: true },
];
const durations = [2800, 2400, 2600, 2400, 2400, 2400, 2600, 2000, 2400, 2600, 2600, 3000];

const captions = [
  "An outdated site: slow to load, cluttered, and no clear next step.",
  "Drag the slider to compare the old site with the new one.",
  "The new site: one clear headline and one button.",
  "The same site re-skinned for a law firm.",
  "For a fitness studio.",
  "For a restaurant.",
  "For an online store.",
  "Added to cart.",
  "Checkout.",
  "Order confirmed.",
  "The same site on a phone.",
  "New lead received.",
];

const skinIcons: Record<WebsiteSkinId, LucideIcon> = {
  home: House,
  law: Scale,
  fitness: Dumbbell,
  restaurant: UtensilsCrossed,
  store: ShoppingBag,
};

/** Literal class names per accent, so Tailwind generates them. */
const accents = {
  cyan: { solid: "bg-cyan-400", text: "text-cyan-400", soft: "bg-cyan-400/15", glow: "from-cyan-400/35" },
  brass: { solid: "bg-brass-400", text: "text-brass-400", soft: "bg-brass-400/15", glow: "from-brass-400/35" },
  red: { solid: "bg-red-400", text: "text-red-400", soft: "bg-red-400/15", glow: "from-red-400/35" },
  yellow: { solid: "bg-yellow-400", text: "text-yellow-400", soft: "bg-yellow-400/15", glow: "from-yellow-400/35" },
  emerald: { solid: "bg-emerald-400", text: "text-emerald-400", soft: "bg-emerald-400/15", glow: "from-emerald-400/35" },
} as const;

const money = (n: number) => `$${n.toFixed(2)}`;

interface Choices {
  run: number;
  slider?: number;
  skin?: WebsiteSkinId;
  device?: Device;
  store?: StoreStage;
}

export default function WebsitesDemo({ formPath }: DemoProps) {
  const [frameRef, demo] = useDemo({ service: "websites", durations });
  const [choices, setChoices] = useState<Choices>({ run: -1 });
  // Only choices made during this run count; Replay starts clean.
  const mine: Partial<Choices> = choices.run === demo.run ? choices : {};

  const frame = frames[demo.step];
  const slider = mine.slider ?? frame.slider;
  const skinId = mine.skin ?? frame.skin;
  const device = mine.device ?? frame.device;
  const store = mine.store ?? (skinId === "store" ? frame.store : 0);
  const skin = websiteSkins.find(({ id }) => id === skinId)!;

  const choose = (change: Omit<Choices, "run">) => {
    setChoices((current) => ({
      ...(current.run === demo.run ? current : {}),
      ...change,
      run: demo.run,
    }));
    demo.pause();
  };

  const sizes = demoSizes.websites;

  return (
    <DemoFrame
      frameRef={frameRef}
      demo={demo}
      title={demoTitles.websites}
      formPath={formPath}
      stageClassName={sizes.stage}
      toolbarClassName={sizes.toolbar}
      captions={captions}
      toolbar={
        <div className="svc-tabs -mx-4 flex items-center gap-3 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
          <Segmented
            label="Industry"
            wrap={false}
            value={skinId}
            onChange={(id) => choose({ skin: id, store: 0, slider: Math.min(slider, 0) })}
            options={websiteSkins.map(({ id, label }) => {
              const Icon = skinIcons[id];
              return { value: id, label, icon: <Icon aria-hidden="true" className="h-4 w-4" /> };
            })}
          />
          <span aria-hidden="true" className="h-6 w-px shrink-0 bg-white/10" />
          <Segmented
            label="Device"
            wrap={false}
            value={device}
            onChange={(value) => choose({ device: value })}
            options={[
              { value: "desktop", label: "Desktop", icon: <Monitor aria-hidden="true" className="h-4 w-4" /> },
              { value: "phone", label: "Phone", icon: <Smartphone aria-hidden="true" className="h-4 w-4" /> },
            ]}
          />
        </div>
      }
    >
      <div className="flex h-full flex-col px-4 pt-5 pb-4 sm:px-6">
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <DeviceFrame device={device} business={skin.business}>
            <Compare slider={slider} smooth={mine.slider === undefined}>
              <OldSite skin={skin} loading={!!frame.loading && mine.slider === undefined} compact={device === "phone"} />
              <NewSite
                skin={skin}
                compact={device === "phone"}
                store={store}
                onStore={(stage) => choose({ store: stage, slider: Math.min(slider, 0) })}
              />
            </Compare>
          </DeviceFrame>

          {frame.toast && !mine.skin && (
            <div
              role="status"
              className="svc-enter absolute right-0 bottom-2 left-0 mx-auto flex w-fit max-w-[92%] items-center gap-3 rounded-lg border border-white/10 bg-neutral-950 px-4 py-3 shadow-2xl sm:right-2 sm:left-auto light:bg-[#fff]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400">
                <Check aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="text-sm">
                <span className="block font-semibold text-white">New lead received</span>
                <span className="block text-neutral-400">{skin.lead}</span>
              </span>
            </div>
          )}
        </div>

        <label className="mt-4 flex items-center gap-3 text-xs font-semibold tracking-[0.14em] text-neutral-400 uppercase">
          Before
          {/* The thumb sits where the divider on the picture does, so the two
              move together: the old site is left of both. */}
          <input
            type="range"
            min={0}
            max={100}
            value={slider}
            onChange={(event) => choose({ slider: Number(event.target.value) })}
            aria-label="Compare the old site with the new one"
            aria-valuetext={`${slider}% of the old site showing`}
            className="h-11 min-w-0 flex-1 cursor-ew-resize accent-[var(--color-brass-400)]"
          />
          After
        </label>
      </div>
    </DemoFrame>
  );
}

/** A browser window or a phone around the mock site. */
function DeviceFrame({
  device,
  business,
  children,
}: {
  device: Device;
  business: string;
  children: React.ReactNode;
}) {
  if (device === "phone") {
    return (
      <div className="relative h-full max-h-[440px] w-[230px] overflow-hidden rounded-[2rem] border-[6px] border-neutral-800 bg-neutral-900 shadow-2xl">
        <span aria-hidden="true" className="absolute top-1.5 left-1/2 z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-neutral-800" />
        <div className="h-full pt-7">{children}</div>
      </div>
    );
  }
  return (
    <div className="flex h-full max-h-[400px] w-full max-w-[720px] flex-col overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-2xl">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2">
        <span aria-hidden="true" className="flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="h-2 w-2 rounded-full bg-white/20" />
          ))}
        </span>
        <span className="ml-2 truncate rounded bg-white/[0.06] px-3 py-0.5 text-[11px] text-neutral-400">
          {business}
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

const tagClass = (side: string) =>
  clsx(
    "pointer-events-none absolute top-2 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase",
    side
  );

/** The old site under the new one, wiped by `slider` (% of old showing). */
function Compare({
  slider,
  smooth,
  children,
}: {
  slider: number;
  smooth: boolean;
  children: [React.ReactNode, React.ReactNode];
}) {
  const [oldSite, newSite] = children;
  return (
    <div className="@container relative h-full overflow-hidden">
      <div className="absolute inset-0">{oldSite}</div>
      <div
        className={clsx(
          "absolute inset-0",
          smooth && "transition-[clip-path] duration-700 ease-out motion-reduce:transition-none"
        )}
        style={{ clipPath: `inset(0 0 0 ${slider}%)` }}
      >
        {newSite}
      </div>
      <div
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute inset-y-0 w-0.5 bg-white/80",
          smooth && "transition-[left] duration-700 ease-out motion-reduce:transition-none"
        )}
        style={{ left: `${slider}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[10px] font-bold text-neutral-950 shadow">
          ‹›
        </span>
      </div>
      {/* The tags show only mid-comparison: at either end they would sit
          on top of the site's own header. */}
      {slider >= 10 && slider <= 90 && (
        <>
          <span aria-hidden="true" className={tagClass("left-2")}>
            Before
          </span>
          <span aria-hidden="true" className={tagClass("right-2")}>
            After
          </span>
        </>
      )}
    </div>
  );
}

/**
 * Slow, crowded, and nowhere obvious to click: the same business's site as
 * it might have looked for years, with its photo stretched and washed out.
 */
function OldSite({
  skin,
  loading,
  compact,
}: {
  skin: WebsiteSkin;
  loading: boolean;
  compact: boolean;
}) {
  return (
    <div aria-hidden="true" className="relative h-full overflow-hidden bg-[#d9d6cf] font-serif text-[#3a3a3a]">
      <div className="bg-[#5a5f73] px-3 py-1.5 text-[11px] text-[#e6e6e6]">
        Welcome to {skin.business}!!! Call us today!!!
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5 border-b border-[#9b9b9b] px-3 py-1 text-[9px] text-[#2d4ea8] underline">
        {["Home", "About Us", "Our History", "Services", "Gallery", "Links", "Specials", "Testimonials", "FAQ", "Contact"].map((link) => (
          <span key={link}>{link}</span>
        ))}
      </div>
      <div className={clsx("grid gap-2 p-3", compact ? "grid-cols-1" : "grid-cols-[1.4fr_1fr_1fr]")}>
        {/* The one photo, squashed to fit a box it was never cropped for. */}
        <div className="space-y-1">
          <Photo
            src={skin.photo}
            className="block h-16 w-full border-2 border-[#8c8c8c] object-fill opacity-90 contrast-75 saturate-50 sepia-[.35]"
          />
          <span className="block text-[8px] leading-tight">Photo of our work (click to enlarge)</span>
        </div>
        {Array.from({ length: compact ? 2 : 5 }, (_, i) => (
          <div key={i} className="space-y-1">
            <span className="block h-10 bg-[#b9b5ab]" />
            <span className="block text-[8px] leading-tight">
              Lorem ipsum dolor sit amet, we have been serving the area for many years with quality and value. Please see our services page.
            </span>
          </div>
        ))}
      </div>
      <p className="px-3 text-[8px] text-[#2d4ea8] underline">Click here for more information</p>
      <p className="absolute inset-x-0 bottom-0 flex justify-between gap-2 border-t border-[#9b9b9b] bg-[#cfccc4] px-3 py-1 text-[8px] text-[#555]">
        <span>Best viewed in 800 x 600</span>
        <span className="font-mono">Visitors: 004213</span>
      </p>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#d9d6cf]/85 font-sans text-xs text-[#555]">
          <span className="svc-l-spin h-7 w-7 rounded-full border-2 border-[#999] border-t-[#333]" />
          Loading&hellip;
        </div>
      )}
    </div>
  );
}

/**
 * One headline, one button and a real photo, re-skinned per industry. On a
 * wide screen the photo fills the right side and fades into the page; on a
 * phone (or a narrow frame) it is a band across the top. The store skin
 * shows its product in a card that adds to cart, checks out and confirms.
 */
function NewSite({
  skin,
  compact,
  store,
  onStore,
}: {
  skin: WebsiteSkin;
  compact: boolean;
  store: StoreStage;
  onStore: (stage: StoreStage) => void;
}) {
  const accent = accents[skin.accent];
  const Icon = skinIcons[skin.id];
  const isStore = skin.id === "store";
  const total = storeProduct.price + storeProduct.shipping;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[var(--svc-site)] text-white light:bg-[#fff]">
      {!isStore && (
        <div
          aria-hidden="true"
          className={clsx(
            "pointer-events-none absolute",
            compact ? "inset-x-0 top-0 h-[42%]" : "inset-x-0 top-0 h-[38%] @lg:inset-y-0 @lg:right-0 @lg:left-auto @lg:h-auto @lg:w-[56%]"
          )}
        >
          {skin.video ? (
            <DemoVideo
              key={skin.video.src}
              src={skin.video.src}
              poster={skin.video.poster}
              className="svc-photo-in relative h-full w-full"
              mediaStyle={{ objectPosition: skin.focus }}
            />
          ) : (
            <Photo
              key={skin.photo}
              src={skin.photo}
              className="svc-photo-in h-full w-full object-cover"
              style={{ objectPosition: skin.focus }}
            />
          )}
          {/* Fades the photo into the page: down on a phone, left on a wide screen. */}
          <span
            className={clsx(
              "absolute inset-0",
              compact
                ? "bg-gradient-to-t from-[var(--svc-site)] via-[var(--svc-site)]/40 to-[var(--svc-site)]/10 light:from-[#fff] light:via-[#fff]/40 light:to-[#fff]/0"
                : "bg-gradient-to-t from-[var(--svc-site)] via-[var(--svc-site)]/40 to-[var(--svc-site)]/10 light:from-[#fff] light:via-[#fff]/40 light:to-[#fff]/0 @lg:bg-gradient-to-r @lg:from-[var(--svc-site)] @lg:via-[var(--svc-site)]/45 @lg:via-30% @lg:to-transparent light:@lg:from-[#fff] light:@lg:via-[#fff]/45"
            )}
          />
        </div>
      )}
      {isStore && (
        <div
          aria-hidden="true"
          className={clsx("pointer-events-none absolute -top-1/3 -right-1/4 h-full w-3/4 rounded-full bg-gradient-to-b to-transparent blur-3xl", accent.glow)}
        />
      )}

      <div className="relative flex items-center justify-between gap-2 px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-[12px] font-bold">
          <span className={clsx("flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-950", accent.solid)}>
            <Icon aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
          {/* Over the photo band (phone, narrow frame) the name is white
              whatever the theme; on a wide screen it sits on the page. */}
          <span className={clsx("truncate", !isStore && "text-[#fff] [text-shadow:0_1px_6px_rgb(0_0_0/0.6)] @lg:text-white @lg:[text-shadow:none]")}>
            {skin.business}
          </span>
        </span>
        <span className="flex items-center gap-4">
          {!compact && (
            <span aria-hidden="true" className={clsx("hidden items-center gap-4 text-[10px] font-medium @xl:flex", isStore ? "text-neutral-300" : "text-[#fff]/90 [text-shadow:0_1px_6px_rgb(0_0_0/0.6)]")}>
              {skin.nav.map((link) => (
                <span key={link}>{link}</span>
              ))}
            </span>
          )}
          {isStore ? (
            <span className="relative flex items-center text-neutral-300" aria-label={`Cart, ${store >= 1 ? 1 : 0} item`}>
              <ShoppingCart aria-hidden="true" className="h-4 w-4" />
              {store >= 1 && store < 3 && (
                <span className={clsx("absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-neutral-950", accent.solid)}>
                  1
                </span>
              )}
            </span>
          ) : (
            !compact && (
              // Narrow frames drop it: it would wrap, and the hero has the same button.
              <span className={clsx("hidden rounded px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap text-neutral-950 @md:inline-block", accent.solid)}>
                {skin.cta}
              </span>
            )
          )}
        </span>
      </div>

      <div
        className={clsx(
          "relative grid flex-1 gap-4 px-4",
          compact
            ? "content-end grid-cols-1 pb-5"
            : isStore
              ? "content-center @lg:grid-cols-[1.1fr_1fr] @lg:items-center @lg:px-8"
              : "content-end pb-6 @lg:max-w-[56%] @lg:content-center @lg:px-8 @lg:pb-0"
        )}
      >
        <div>
          <p className={clsx("text-[10px] font-semibold tracking-[0.16em] uppercase", accent.text)}>{skin.eyebrow}</p>
          <p className="mt-2 text-[22px] leading-[1.1] font-bold tracking-tight @lg:text-[30px]">{skin.headline}</p>
          <p className="mt-2 max-w-[34ch] text-[12px] leading-snug text-neutral-300">{skin.sub}</p>
          {!isStore && (
            <>
              <span className={clsx("mt-4 inline-block rounded-md px-4 py-2 text-[12px] font-semibold text-neutral-950 shadow-lg", accent.solid)}>
                {skin.cta}
              </span>
              <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-neutral-300">
                <span className="flex items-center gap-1 text-[11px]">
                  <Stars rating={skin.rating} />
                  <span className="font-semibold text-white">{skin.rating.toFixed(1)}</span>
                </span>
                <span className="text-neutral-400">{skin.reviews.toLocaleString("en-US")} reviews</span>
                <span aria-hidden="true" className="text-neutral-500">·</span>
                <span className="flex items-center gap-1">
                  <Check aria-hidden="true" className="h-3 w-3" />
                  {skin.trust}
                </span>
              </p>
            </>
          )}
        </div>

        {isStore && <StoreCard store={store} onStore={onStore} accent={accent} total={total} photo={skin.photo} compact={compact} />}
      </div>
    </div>
  );
}

/** Add to cart, checkout, order confirmed. Each button works. */
function StoreCard({
  store,
  onStore,
  accent,
  total,
  photo,
  compact,
}: {
  store: StoreStage;
  onStore: (stage: StoreStage) => void;
  accent: (typeof accents)[keyof typeof accents];
  total: number;
  photo: string;
  compact: boolean;
}) {
  const button = clsx("mt-3 inline-flex min-h-9 w-full items-center justify-center rounded-md px-3 text-[12px] font-semibold text-neutral-950", accent.solid);

  if (store === 3) {
    return (
      <div role="status" className="svc-enter rounded-lg border border-emerald-400/40 bg-emerald-400/10 p-4 text-center">
        <Check aria-hidden="true" className="mx-auto h-6 w-6 text-emerald-400" />
        <p className="mt-2 text-sm font-bold">Order confirmed</p>
        <p className="mt-1 text-[11px] text-neutral-300">Order #1042 · {money(total)} · Free shipping</p>
        <button type="button" onClick={() => onStore(0)} className="mt-2 min-h-9 text-[11px] font-semibold text-neutral-300 underline underline-offset-2">
          Shop again
        </button>
      </div>
    );
  }

  if (store === 2) {
    return (
      <div className="svc-enter rounded-lg border border-white/10 bg-white/[0.04] p-4 text-[12px] light:bg-[#f6f7f9]">
        <div className="flex items-center gap-3">
          <Photo src={photo} className="h-12 w-12 shrink-0 rounded-md object-cover" />
          <p className="font-bold">Checkout</p>
        </div>
        <dl className="mt-3 space-y-1 text-neutral-300">
          <div className="flex justify-between"><dt>{storeProduct.name}</dt><dd>{money(storeProduct.price)}</dd></div>
          <div className="flex justify-between"><dt>Shipping</dt><dd>{storeProduct.shipping ? money(storeProduct.shipping) : "Free"}</dd></div>
          <div className="flex justify-between border-t border-white/10 pt-1 font-semibold text-white"><dt>Total</dt><dd>{money(total)}</dd></div>
        </dl>
        <button type="button" onClick={() => onStore(3)} className={button}>
          Pay {money(total)}
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] light:bg-[#f6f7f9]">
      {compact ? (
        <Photo src={photo} className="block aspect-[2/1] w-full object-cover" />
      ) : (
        <ProductSpin photo={photo} sheet={storeProduct.spin} />
      )}
      <div className="p-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[13px] font-bold">{storeProduct.name}</p>
          <p className="text-[13px] font-semibold">{money(storeProduct.price)}</p>
        </div>
        <p className="text-[11px] text-neutral-400">{storeProduct.detail}</p>
        {store === 0 ? (
          <button type="button" onClick={() => onStore(1)} className={button}>
            Add to cart
          </button>
        ) : (
          <button type="button" onClick={() => onStore(2)} className={button}>
            <Check aria-hidden="true" className="mr-1 h-3.5 w-3.5" />
            Added · Checkout
          </button>
        )}
      </div>
    </div>
  );
}
