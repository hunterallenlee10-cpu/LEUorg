import type { Metadata } from "next";
import { MainHeader } from "@/components/layout/MainHeader";
import { MainFooter } from "@/components/layout/MainFooter";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeFeature } from "@/components/home/HomeFeature";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeCalculator } from "@/components/home/HomeCalculator";
import { HomeHowItWorks } from "@/components/home/HomeHowItWorks";
import { HomeTwoPaths } from "@/components/home/HomeTwoPaths";
import { HomeClosingBanner } from "@/components/home/HomeClosingBanner";
import { HomeFaq } from "@/components/home/HomeFaq";
import { ToolsMarqueeSection } from "@/components/sections/ToolsMarqueeSection";
import { RecentWorkSection } from "@/components/shared/RecentWorkSection";
import { BmJourneyTimeline } from "@/components/business-mastery/BmJourneyTimeline";
import { BmJourneyLocked } from "@/components/business-mastery/BmJourneyLocked";
import { ContactSection } from "@/components/sections/ContactSection";
import { StatTiles } from "@/components/ui/ds";
import { site } from "@/data/site";
import { BM_JOURNEY_LOCKED } from "@/data/business-mastery";

const title = "Lee Enterprises Unlimited | AI Automation & Websites";
const description =
  "Lee Enterprises Unlimited builds websites that bring in customers and AI automations that answer every call, follow up and book the job.";

// The canonical and og:url live here rather than in the root layout, where
// every page without its own would inherit them and point at the homepage.
// The share image is app/opengraph-image.tsx.
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

/**
 * The homepage, in the black-and-gold redesign (2026-10-18), which follows
 * university.com's structure in LEU's own colours, type and copy. In order:
 * the hero (with the owner's video slot, off by default: `site.vsl`), the
 * stat tiles, the offer with its device mockup, the six services, the
 * missed-revenue calculator, recent builds, how it works, two paths, the
 * tools strip, the journey, the closing banner, the FAQ and the contact
 * form. Business Mastery is linked from the footer (and the FAQ) only.
 */
export default function Home() {
  return (
    <div className="ds-page min-h-screen bg-neutral-950">
      <MainHeader />

      <main>
        <HomeHero />
        <section aria-label="LEU by the numbers" className="pb-4">
          <div className="ds-container">
            <StatTiles />
          </div>
        </section>
        <HomeFeature />
        <HomeServices />
        <HomeCalculator />
        <RecentWorkSection />
        <HomeHowItWorks />
        <HomeTwoPaths />
        <ToolsMarqueeSection />
        {/* The journey, locked or open: BM_JOURNEY_LOCKED
            (data/business-mastery.ts) is the switch, and flipping it is the
            whole unlock. */}
        {BM_JOURNEY_LOCKED ? <BmJourneyLocked /> : <BmJourneyTimeline />}
        <HomeClosingBanner />
        <HomeFaq />
        <ContactSection />
      </main>

      <MainFooter />
    </div>
  );
}
