"use client";

import { useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

const PHONE = "(max-width: 639px)";

/**
 * A grid that shows its first few items and a "Show more" button for the
 * rest (university.com's pattern): `initial` on a tablet or desktop,
 * `initialMobile` on a phone. Pressing it shows everything and moves focus
 * to the first item that appeared, so keyboard and screen-reader users land
 * on the new content. The button then goes away.
 */
export function ShowMoreGrid({
  items,
  initial = 6,
  initialMobile = 3,
  className,
  label,
}: {
  items: ReactNode[];
  initial?: number;
  /** How many show on a phone (under 640px) before "Show more". */
  initialMobile?: number;
  className?: string;
  /** What the items are, read after "Show more": "Show more builds". */
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const hasMoreWide = items.length > initial;
  const hasMorePhone = items.length > initialMobile;

  const showAll = () => {
    const first = window.matchMedia(PHONE).matches ? initialMobile : initial;
    setOpen(true);
    requestAnimationFrame(() => itemRefs.current[first]?.focus());
  };

  return (
    <>
      <ul className={className}>
        {items.map((item, i) => (
          <li
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            tabIndex={-1}
            hidden={!open && i >= initial}
            className={clsx(
              "flex outline-none",
              !open && i >= initialMobile && i < initial && "max-sm:hidden"
            )}
          >
            {item}
          </li>
        ))}
      </ul>
      {hasMorePhone && !open && (
        <div className={clsx("mt-10 flex justify-center", !hasMoreWide && "sm:hidden")}>
          <button type="button" className="btn-ds-outline" onClick={showAll}>
            Show more<span className="sr-only"> {label}</span>
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}
