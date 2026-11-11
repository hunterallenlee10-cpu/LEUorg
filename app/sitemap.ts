import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/company";
import { marylandLastUpdated, marylandRoute } from "@/data/maryland-page";

/**
 * /sitemap.xml: only the Maryland page, the one page unique to the .org site.
 * The shared pages (home, how it works, services, contact, legal, Business
 * Mastery) name their .com twin as canonical (PRIMARY_SITE_URL in
 * data/company.ts), so they belong in the .com sitemap, not this one.
 *
 * Its lastmod is the page's own "Last updated" date, so it only moves when
 * the copy does.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}${marylandRoute}`,
      lastModified: new Date(`${marylandLastUpdated}T00:00:00Z`),
    },
  ];
}
