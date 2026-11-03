import { NavItem } from "@/types";
import { leeSystemsRoutes } from "@/data/lee-systems";
import { servicesRoutes } from "@/data/services";
import { marylandLabel, marylandRoute } from "@/data/maryland-page";
import {
  BUSINESS_MASTERY_SITE_LIVE,
  BUSINESS_MASTERY_SITE_URL,
} from "@/config/business-mastery-site.mjs";

/**
 * Where Business Mastery is: its own subdomain once
 * `BUSINESS_MASTERY_SITE_LIVE` is on (config/business-mastery-site.mjs), the
 * page on this site until then. Every link to it reads this, so the switch
 * moves them all at once.
 */
export const businessMasteryPage = BUSINESS_MASTERY_SITE_LIVE
  ? `${BUSINESS_MASTERY_SITE_URL}/`
  : "/business-mastery";
export const contactPage = "/contact";

/**
 * The header's links, in order: Services (a menu of the six service groups,
 * 2026-10-17), LEU, then Contact. Business
 * Mastery is linked from the footer only (`footerPages`), at the owner's
 * request (2026-10-06): it is promoted on its own, not from this site. The gold "Book a
 * free call" button after them is not an entry here; MainHeader draws it from
 * `bookLabel` and `bookHref` in data/site.ts.
 *
 * LEU is a plain link to the top of /how-it-works. Its dropdown
 * of the two services came off at the owner's request (2026-09-29), once
 * both lived on that one page.
 */
export const navigationItems: NavItem[] = [
  {
    label: "Services",
    href: servicesRoutes.hub,
    id: "nav-services",
    menu: "services",
  },
  {
    label: "How It Works",
    href: leeSystemsRoutes.home,
    id: "nav-lee-systems",
  },
  {
    label: "Contact",
    href: contactPage,
    id: "nav-contact",
  },
];

/**
 * The footer's page links. The footer is the one place on the main site that
 * links to Business Mastery (the owner's call, 2026-10-06).
 */
export const footerPages = [
  { label: "How It Works", href: leeSystemsRoutes.home },
  { label: "Services", href: servicesRoutes.hub },
  { label: "Business Mastery", href: businessMasteryPage },
  { label: "Contact", href: contactPage },
  // The Maryland website design page (2026-11-03): linked from every page's
  // footer, with its own heading as the link text.
  { label: marylandLabel, href: marylandRoute },
  // The sister phrase page on the .com site (2026-11-03): one footer link so
  // the two Maryland pages point at each other. Never in the header nav.
  { label: "Best Marketer in Maryland", href: "https://www.leeenterprisesunlimited.com/best-marketer-in-maryland" },
] as const;

export const sectionIds = {
  hero: "hero",
  contact: "contact",
  privacy: "privacy",
  terms: "terms",
} as const;
