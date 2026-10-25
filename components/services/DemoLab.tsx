"use client";

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import {
  demoGroups,
  isDemoSlug,
  servicesAnchors,
  type DemoSlug,
} from "@/data/services";
import { serviceIcons } from "@/components/services/serviceIcons";
import { DemoSlot } from "@/components/services/demos/registry";
import type { DemoAssets } from "@/components/services/demo/sizes";
import "./services.css";

/**
 * The Demo Lab on /services (#demo-lab): one tab per service group with a
 * demo (all but Websites), each loading that group's demo, the same
 * component its service page shows. An old ?demo=websites link opens the
 * first tab.
 *
 * Tabs follow the WAI-ARIA tabs pattern: one tab stop for the whole row
 * (roving tabindex), Left/Right arrows move and select, Home/End jump to the
 * ends. On a phone the row scrolls sideways and keeps the chosen tab in view.
 *
 * Deep links: /services?demo=ai-calls and /services#demo-lab?demo=ai-calls
 * both open that tab (the second also scrolls here, since no element has
 * that whole hash as its id). Picking a tab writes ?demo= into the address,
 * so the link in the bar shares the demo on screen. Only the chosen demo
 * loads; the rest are fetched when picked.
 */
export function DemoLab({ assets }: { assets: DemoAssets }) {
  return (
    <Suspense fallback={<Lab requested={null} assets={assets} />}>
      <LabFromQuery assets={assets} />
    </Suspense>
  );
}

function LabFromQuery({ assets }: { assets: DemoAssets }) {
  return <Lab requested={useSearchParams().get("demo")} assets={assets} />;
}

const HASH_PREFIX = `#${servicesAnchors.demoLab}?`;

/** ?demo= read from a "#demo-lab?demo=ai-calls" hash, or null. */
function demoFromHash(): string | null {
  const { hash } = window.location;
  if (!hash.startsWith(HASH_PREFIX)) return null;
  return new URLSearchParams(hash.slice(HASH_PREFIX.length)).get("demo");
}

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function Lab({ requested, assets }: { requested: string | null; assets: DemoAssets }) {
  const fromHash = useSyncExternalStore(subscribeHash, demoFromHash, () => null);
  const wanted = fromHash ?? requested;

  const [selected, setSelected] = useState<DemoSlug>(
    wanted && isDemoSlug(wanted) ? wanted : demoGroups[0].slug
  );
  // A new ?demo= (a "See it work" link on this page) switches the tab.
  const [lastWanted, setLastWanted] = useState(wanted);
  if (wanted !== lastWanted) {
    setLastWanted(wanted);
    if (wanted && isDemoSlug(wanted)) setSelected(wanted);
  }

  const sectionRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<DemoSlug, HTMLButtonElement | null>>>({});

  // Arriving on #demo-lab?demo=..., which the browser can't scroll to.
  useEffect(() => {
    if (demoFromHash()) sectionRef.current?.scrollIntoView({ block: "start" });
  }, []);

  // Keep the chosen chip in view in the sideways-scrolling row. Only the row
  // scrolls: scrollIntoView would move the page too.
  useEffect(() => {
    const row = tablistRef.current;
    const tab = tabRefs.current[selected];
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return;
    const left = tab.offsetLeft; // the row is the chips' offsetParent
    if (left < row.scrollLeft || left + tab.offsetWidth > row.scrollLeft + row.clientWidth) {
      row.scrollTo({ left: left - 16 });
    }
  }, [selected]);

  const choose = (slug: DemoSlug, focus = false) => {
    setSelected(slug);
    if (focus) tabRefs.current[slug]?.focus();
    const url = new URL(window.location.href);
    url.searchParams.set("demo", slug);
    url.hash = servicesAnchors.demoLab;
    window.history.replaceState(window.history.state, "", url);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = demoGroups.findIndex(({ slug }) => slug === selected);
    const count = demoGroups.length;
    const target = {
      ArrowRight: (index + 1) % count,
      ArrowLeft: (index - 1 + count) % count,
      Home: 0,
      End: count - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    choose(demoGroups[target].slug, true);
  };

  return (
    <div ref={sectionRef} className="scroll-mt-24">
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Service demos"
        className="svc-tabs relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
      >
        {demoGroups.map(({ slug, demo, icon }) => {
          const Icon = serviceIcons[icon];
          const isSelected = slug === selected;
          return (
            <button
              key={slug}
              ref={(node) => {
                tabRefs.current[slug] = node;
              }}
              type="button"
              role="tab"
              id={`demo-tab-${slug}`}
              aria-selected={isSelected}
              aria-controls={`demo-panel-${slug}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => choose(slug)}
              onKeyDown={onKeyDown}
              className={clsx(
                "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-4 text-sm font-semibold whitespace-nowrap transition-colors motion-reduce:transition-none",
                isSelected
                  ? "border-brass-400 bg-brass-400/10 text-white"
                  : "border-white/10 text-neutral-300 hover:border-white/25 hover:text-white"
              )}
            >
              <Icon aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 text-brass-400" />
              {demo.label}
            </button>
          );
        })}
      </div>

      {demoGroups.map(({ slug, demo }) => {
        const isSelected = slug === selected;
        return (
          <div
            key={slug}
            role="tabpanel"
            id={`demo-panel-${slug}`}
            aria-labelledby={`demo-tab-${slug}`}
            hidden={!isSelected}
            tabIndex={0}
            className="mt-6 rounded-xl focus-visible:outline-offset-4"
          >
            {isSelected && (
              <>
                <p className="mb-4 text-center text-neutral-300">{demo.intro}</p>
                <DemoSlot slug={slug} formPath="/services" assets={assets} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
