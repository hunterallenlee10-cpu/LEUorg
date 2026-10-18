"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import { companyInfo } from "@/data/company";
import { BookCallLink } from "@/components/ui/BookCallLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ServicesMenu } from "@/components/layout/ServicesMenu";

/**
 * The site header: the LEU lockup on the left, then Services, Lee Systems
 * Co. and Contact, then the gold "Book a free call" button and the light/dark
 * switch. Below `lg` the links move into a drawer, and the button stays in the
 * bar beside the menu toggle.
 *
 * Services is a real button that opens the six service groups
 * (ServicesMenu): on hover or click from `lg` up, as an expandable section in
 * the drawer below it. Escape closes it and puts focus back on the button.
 * The drawer keeps Tab inside itself while it is open.
 */
export function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Focus goes back here when the drawer closes, instead of dropping to <body>
  // with the dialog that held it.
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // Which nav item's dropdown is open, by id, so any item carrying `subItems`
  // can own one without opening the others.
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Refs rather than state. A fast flick from the trigger into the panel
  // lands every boundary event in one task, before React re-renders — a
  // handler reading the timeout id out of state sees the value from the
  // previous render, misses the close timer the leave handler just armed,
  // and the menu shuts 200ms later underneath the pointer.
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // The wrapper around whichever dropdown is open, so the close timer can ask
  // whether focus is still inside it before firing.
  const openWrapperRef = useRef<HTMLDivElement | null>(null);
  // Whether the open dropdown was opened by the pointer resting on it. A
  // chevron click on a hover-opened menu pins it open instead of toggling it
  // shut under the pointer, since the visitor sees it open already.
  const openedByHoverRef = useRef(false);

  const pathname = usePathname();
  const isCurrent = (href: string) => pathname === href;
  // The whole section counts: /services and each /services/[slug] page.
  const isInSection = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const drawerRef = useRef<HTMLDivElement>(null);

  // At most one read per frame, plus one on mount, so a page that loads
  // already scrolled (a reload, a /#contact link) gets the solid bar at once.
  // The mount read goes through the frame too, which keeps setState out of
  // the effect body.
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

  // A close timer still pending when the header unmounts would setState on a
  // gone component.
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Lock the page while the mobile menu is open. iOS Safari keeps scrolling
  // (and rubber-banding) the page under an overlay even with
  // `overflow: hidden` on body, so the body is pinned with `position: fixed`
  // at its current offset instead, and put back on close. The restore jump is
  // explicitly instant because html has `scroll-smooth` — otherwise closing
  // the menu would visibly animate from the top of the page back down.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const scrollY = window.scrollY;
    const menuButton = menuButtonRef.current;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    style.overflow = "hidden";
    return () => {
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.width = "";
      style.overflow = "";
      window.scrollTo({ top: scrollY, behavior: "instant" });
      menuButton?.focus({ preventScroll: true });
    };
  }, [mobileMenuOpen]);

  // The drawer and its button are hidden from `lg` up. Widening past that
  // with the drawer open (a tablet rotated, a window resized) would otherwise
  // leave the page scroll-locked behind a drawer nobody can see.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const lg = window.matchMedia("(min-width: 64rem)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileMenuOpen(false);
    };
    lg.addEventListener("change", onChange);
    return () => lg.removeEventListener("change", onChange);
  }, [mobileMenuOpen]);

  // Besides the pointer leaving it, a click anywhere outside the desktop
  // dropdown, or Escape, closes it. Also closes the mobile drawer on Escape.
  useEffect(() => {
    if (!openDropdownId && !mobileMenuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (mobileMenuOpen) return;
      if (openWrapperRef.current?.contains(event.target as Node)) return;
      setOpenDropdownId(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // A desktop menu hands focus back to the button that opened it, so the
      // next Tab carries on from there. The drawer does the same for its own
      // button when it closes (the scroll-lock effect above).
      if (!mobileMenuOpen && openDropdownId) {
        openWrapperRef.current
          ?.querySelector<HTMLButtonElement>("button[aria-expanded]")
          ?.focus();
      }
      setOpenDropdownId(null);
      setMobileMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openDropdownId, mobileMenuOpen]);

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openDropdown = (id: string, byHover = false) => {
    cancelClose();
    openedByHoverRef.current = byHover;
    setOpenDropdownId(id);
  };

  const closeDropdown = () => {
    cancelClose();
    setOpenDropdownId(null);
    openWrapperRef.current = null;
  };

  const toggleDropdownFromChevron = (id: string) => {
    if (openDropdownId !== id) return openDropdown(id);
    if (openedByHoverRef.current) {
      openedByHoverRef.current = false;
      return;
    }
    closeDropdown();
  };

  // Debounced by 200ms so the pointer can cross the gap between the trigger and
  // the panel without the menu flickering shut. The focus check keeps a hover
  // exit from yanking the panel away from someone who opened it with the mouse
  // and then tabbed into its rows.
  const closeDropdownSoon = () => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      if (openWrapperRef.current?.contains(document.activeElement)) return;
      setOpenDropdownId(null);
      openWrapperRef.current = null;
    }, 200);
  };

  // Every entry is a route, so the link navigates on its own; this closes the
  // menus. A link to the page already open would leave the visitor wherever
  // they had scrolled to (Next only drops a #fragment), so it goes back to the
  // top instead - after the drawer, if open, has put the page back where it
  // was. A modified click (new tab or window) is left to the browser.
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setMobileMenuOpen(false);
    closeDropdown();
    const target = new URL(event.currentTarget.href);
    // A link to a section of this page (/services#demo-lab) scrolls to it.
    if (target.pathname === pathname && !target.hash) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(() =>
        window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" })
      );
    }
  };

  // Tab and Shift+Tab wrap around inside the open drawer (it is a modal
  // dialog), instead of walking out into the page hidden behind it.
  const trapDrawerFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !drawerRef.current) return;
    const focusable = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const linkClass = (href: string) =>
    `rounded transition-colors hover:text-amber-400 ${
      isCurrent(href) ? "text-amber-400" : "text-white"
    }`;

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
          isScrolled
            ? "bg-neutral-950 border-b border-neutral-800"
            : "bg-neutral-950/70 backdrop-blur-sm"
        }`}
      >
        {/* Full width with side padding rather than a centred max-w-7xl
            column: the logo sits at the left edge of the screen and the
            actions at the right, at every width. */}
        <div className="flex w-full items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 lg:px-10">
          {/* The company name sits beside the mark wherever the bar has room
              for it: not on a phone, where the button and the menu toggle need
              the width, and not from `lg` to `xl`, where the links join the
              bar. The mark carries the name as its alt text throughout.
              On the homepage it goes back to the top, like the nav links. */}
          <Link href="/" onClick={handleNavClick} className="flex shrink-0 items-center gap-3 rounded">
            <Image
              src={companyInfo.mark}
              alt={companyInfo.logoAlt}
              width={204}
              height={160}
              sizes="51px"
              preload
              className="h-10 w-auto"
            />
            <span className="hidden whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-amber-400 sm:inline lg:hidden xl:inline xl:text-sm">
              {companyInfo.name}
            </span>
          </Link>

          <div className="flex items-center gap-3 lg:gap-8 2xl:gap-10">
            {/* Desktop navigation, from `lg` up; below that the drawer serves
                the same links. The one dropdown opens on hover, and from a
                click on its chevron for keyboard and touch. */}
            <nav
              className="hidden items-center gap-7 whitespace-nowrap text-[17px] lg:flex 2xl:gap-10"
              aria-label="Main"
            >
              {navigationItems.map((item) => {
                const isOpen = openDropdownId === item.id;
                const panelId = `${item.id}-desktop-menu`;

                if (item.menu === "services") {
                  return (
                    <div
                      key={item.id}
                      className="relative"
                      ref={isOpen ? openWrapperRef : undefined}
                      onMouseEnter={() => {
                        if (!isOpen) openDropdown(item.id, true);
                        else cancelClose();
                      }}
                      onMouseLeave={closeDropdownSoon}
                      onBlur={closeDropdownSoon}
                    >
                      <button
                        type="button"
                        onClick={() => toggleDropdownFromChevron(item.id)}
                        aria-expanded={isOpen}
                        aria-controls={isOpen ? panelId : undefined}
                        className={`flex items-center gap-1 rounded transition-colors hover:text-amber-400 ${
                          isInSection(item.href) ? "text-amber-400" : "text-white"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

                      {/* The gap above the panel is padding on this wrapper,
                          so the pointer stays inside the hover area while
                          crossing from the button to the rows. */}
                      {isOpen && (
                        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                          <ServicesMenu
                            id={panelId}
                            variant="panel"
                            onNavigate={handleNavClick}
                            isCurrent={isCurrent}
                          />
                        </div>
                      )}
                    </div>
                  );
                }

                if (!item.subItems) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={handleNavClick}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={linkClass(item.href)}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="relative flex items-center gap-1"
                    ref={isOpen ? openWrapperRef : undefined}
                    onMouseEnter={() => {
                      if (!isOpen) openDropdown(item.id, true);
                      else cancelClose();
                    }}
                    onMouseLeave={closeDropdownSoon}
                    onBlur={closeDropdownSoon}
                  >
                    <Link
                      href={item.href}
                      onClick={handleNavClick}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={linkClass(item.href)}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleDropdownFromChevron(item.id)}
                      className="rounded p-1 text-white transition-colors hover:text-amber-400"
                      aria-label={`${item.label} pages`}
                      aria-expanded={isOpen}
                      aria-controls={isOpen ? panelId : undefined}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>

                    {/* The gap above the panel is padding on this wrapper rather
                        than a margin on the list, so the pointer stays inside the
                        hover area while crossing from the trigger to the rows. */}
                    {isOpen && (
                      <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3">
                        <ul
                          id={panelId}
                          className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 shadow-2xl"
                        >
                          {item.subItems.map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                href={subItem.href}
                                onClick={handleNavClick}
                                aria-current={isCurrent(subItem.href) ? "page" : undefined}
                                className="block w-full px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:bg-neutral-900 hover:text-amber-400"
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <BookCallLink className="whitespace-nowrap px-4 py-2 text-sm sm:px-5 sm:text-base" />

            <ThemeToggle className="-mx-1 lg:-mr-2" />

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => {
                setMobileMenuOpen(true);
                closeDropdown();
              }}
              className="-mr-1 flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors hover:text-amber-400 lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuOpen ? "mobile-menu" : undefined}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer: slides over from the right at 75% of the screen width,
          with the page dimmed behind it. Rendered outside <header> because the
          header's backdrop-filter would otherwise become the containing block
          for these fixed elements and trap them inside the bar. Tapping the
          dimmed strip, the close button, a link or Escape closes it. */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60"
          />
          <div
            ref={drawerRef}
            onKeyDown={trapDrawerFocus}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="mobile-drawer absolute inset-y-0 right-0 flex w-[75vw] max-w-sm flex-col border-l border-neutral-800 bg-neutral-950 shadow-2xl"
          >
            <div className="flex items-center justify-end px-4 py-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors hover:text-amber-400"
                aria-label="Close menu"
                autoFocus
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <nav
              className="flex-1 min-h-0 space-y-1 overflow-y-auto overscroll-contain px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
              aria-label="Main"
            >
              {navigationItems.map((item) => {
                const isOpen = openDropdownId === item.id;
                const panelId = `${item.id}-mobile-menu`;

                if (item.menu === "services") {
                  return (
                    <div key={item.id}>
                      <button
                        type="button"
                        onClick={() => (isOpen ? closeDropdown() : openDropdown(item.id))}
                        aria-expanded={isOpen}
                        aria-controls={isOpen ? panelId : undefined}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left hover:bg-neutral-900 ${
                          isInSection(item.href) ? "text-amber-400" : "text-white"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                      {isOpen && (
                        <ServicesMenu
                          id={panelId}
                          variant="drawer"
                          onNavigate={handleNavClick}
                          isCurrent={isCurrent}
                        />
                      )}
                    </div>
                  );
                }

                return (
                  <div key={item.id}>
                    {item.subItems ? (
                      // Split row: the label goes to the page and the 48px
                      // chevron square expands its pages.
                      <div className="flex items-stretch">
                        <Link
                          href={item.href}
                          onClick={handleNavClick}
                          aria-current={isCurrent(item.href) ? "page" : undefined}
                          className="flex-1 rounded-l-lg px-3 py-3 text-left text-white hover:bg-neutral-900"
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => (isOpen ? closeDropdown() : openDropdown(item.id))}
                          className="flex w-12 items-center justify-center rounded-r-lg text-white hover:bg-neutral-900"
                          aria-label={`${item.label} pages`}
                          aria-expanded={isOpen}
                          aria-controls={isOpen ? panelId : undefined}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={handleNavClick}
                        aria-current={isCurrent(item.href) ? "page" : undefined}
                        className="block w-full rounded-lg px-3 py-3 text-left text-white hover:bg-neutral-900"
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Indented rather than boxed, so the drawer never puts a
                        card inside itself. */}
                    {item.subItems && isOpen && (
                      <ul id={panelId} className="mb-1 ml-3 border-l border-neutral-800 pl-2">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.id}>
                            <Link
                              href={subItem.href}
                              onClick={handleNavClick}
                              aria-current={isCurrent(subItem.href) ? "page" : undefined}
                              className="block w-full rounded-lg px-3 py-3 text-left text-sm text-neutral-300 hover:bg-neutral-900 hover:text-amber-400"
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
