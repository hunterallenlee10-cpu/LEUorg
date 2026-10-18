import type { Metadata } from "next";
import { MainHeader } from "@/components/layout/MainHeader";
import { MainFooter } from "@/components/layout/MainFooter";
import {
  CarePlanSection,
  DemoLabSection,
  ServiceRows,
  ServicesCtaBand,
  ServicesHero,
} from "@/components/services/ServicesHubSections";
import { LeeSystemsContactSection } from "@/components/lee-systems/LeeSystemsContactSection";
import { SITE_URL } from "@/data/company";
import { leeSystems } from "@/data/lee-systems";
import { serviceGroups, servicePath, servicesRoutes } from "@/data/services";

/**
 * /services: everything LEU builds, in one place (2026-10-17).
 * The hero, the six service groups as alternating rows (each with "See it
 * work", which opens its tab in the Demo Lab, and "Learn more", its own
 * page), the Demo Lab, the Care Plan, a closing call, and the form.
 *
 * Its structured data lists the six service pages; each of those carries the
 * full Service node.
 */
const title = "Services | Lee Enterprises Unlimited";
const description =
  "Websites, local SEO and leads, AI call answering, follow-up automation, content and custom AI tools. See each one working in the Demo Lab.";
const pageUrl = `${SITE_URL}${servicesRoutes.hub}`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    url: pageUrl,
    siteName: leeSystems.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Lee Enterprises Unlimited services",
  url: pageUrl,
  itemListElement: serviceGroups.map((group, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: group.name,
    url: `${SITE_URL}${servicePath(group.slug)}`,
  })),
};

export default function ServicesPage() {
  return (
    <div className="ds-page min-h-screen bg-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <MainHeader />

      <main className="pt-20">
        <ServicesHero />
        <ServiceRows />
        <DemoLabSection />
        <CarePlanSection />
        <ServicesCtaBand
          title="Not sure which one you need?"
          body="Book a free call. We'll look at how your business runs and tell you which of the six would help most."
        />
        <LeeSystemsContactSection legacyAnchors={false} />
      </main>

      <MainFooter />
    </div>
  );
}
