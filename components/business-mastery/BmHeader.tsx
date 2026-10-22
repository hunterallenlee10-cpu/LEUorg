"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import { companyInfo } from "@/data/company";
import { bmPageAction } from "@/data/business-mastery";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Business Mastery's own header, in place of the site's MainHeader: the page
 * is its own site now, on its own subdomain (docs/BUSINESS-MASTERY.md), so
 * its bar carries no LEU or Contact links. The LEU mark with the
 * program's name on the left, which goes back to the top, and the page's
 * one action on the right, with the light/dark switch beside it as in
 * MainHeader. The same height and the same see-through bar turning solid on
 * scroll as MainHeader, so the hero's top padding still fits, and the same
 * square double-border button as MainHeader's "Book a free call".
 */
export function BmHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  // MainHeader's scroll read: at most one per frame, plus one on mount.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 200);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // The page is the whole site, so the name goes back to its top. A modified
  // click (new tab or window) is left to the browser.
  const toTop = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled
          ? "bg-neutral-950 border-b border-neutral-800"
          : "bg-neutral-950/70 backdrop-blur-sm"
      }`}
    >
      <div className="flex w-full items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 lg:px-10">
        <a href="#" onClick={toTop} className="flex shrink-0 items-center gap-3 rounded">
          <Image
            src={companyInfo.mark}
            alt={companyInfo.logoAlt}
            width={164}
            height={160}
            sizes="51px"
            preload
            className="h-10 w-auto"
          />
          {/* On a phone the name stacks onto two lines, which is what leaves
              room for the button and the theme switch on one bar. */}
          <span className="w-min text-xs font-semibold uppercase leading-tight tracking-widest text-amber-400 max-[359px]:hidden sm:w-auto sm:whitespace-nowrap xl:text-sm">
            Business Mastery
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={bmPageAction.href}
            className="btn-ls-primary inline-flex min-h-11 items-center justify-center whitespace-nowrap px-4 py-2 text-sm sm:px-5 sm:text-base"
          >
            {bmPageAction.label}
          </a>

          <ThemeToggle className="-mr-2 lg:-mr-3" />
        </div>
      </div>
    </header>
  );
}
