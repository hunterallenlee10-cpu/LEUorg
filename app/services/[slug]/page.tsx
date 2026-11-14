import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainHeader } from "@/components/layout/MainHeader";
import { MainFooter } from "@/components/layout/MainFooter";
import {
  AudienceSection,
  IncludedSection,
  PairsSection,
  RelatedBuildsSection,
  ServiceDemoSection,
  ServiceFaqSection,
  ServiceHero,
  serviceBreadcrumbs,
  StepsSection,
} from "@/components/services/ServicePageSections";
import { ServicesCtaBand } from "@/components/services/ServicesHubSections";
import { LeeSystemsContactSection } from "@/components/lee-systems/LeeSystemsContactSection";
import { SITE_URL } from "@/data/company";
import { leeSystems } from "@/data/lee-systems";
import { site } from "@/data/site";
import {
  getService,
  hasDemo,
  isServiceSlug,
  serviceFaqs,
  servicePath,
  serviceSlugs,
  type ServiceGroup,
} from "@/data/services";

/**
 * One page per service group (2026-10-17): /services/websites,
 * /services/get-found and the rest, built at deploy time from
 * data/services.ts. Any other slug is a 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

function groupFor(slug: string): ServiceGroup {
  if (!isServiceSlug(slug)) notFound();
  return getService(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const group = groupFor((await params).slug);
  const url = `${SITE_URL}${servicePath(group.slug)}`;
  const { title, description } = group.seo;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, siteName: leeSystems.name, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * The service as schema.org data, with the page's breadcrumb trail and its
 * FAQ (2026-10-17). The provider is Lee Enterprises
 * Unlimited, the one business name since Lee Systems Co. was retired.
 * No price, rating or area served: none exist to cite.
 */
function structuredData(group: ServiceGroup) {
  const url = `${SITE_URL}${servicePath(group.slug)}`;
  const faqs = serviceFaqs(group);
  const service = {
    "@type": "Service",
    "@id": `${url}#service`,
    name: group.name,
    description: `${group.outcome} ${group.description}`,
    url,
    serviceType: group.name,
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: site.name,
      url: SITE_URL,
      email: site.email,
      ...(site.phone ? { telephone: site.phone } : {}),
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: group.name,
      itemListElement: group.items.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item.name, description: item.detail },
      })),
    },
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      service,
      {
        "@type": "BreadcrumbList",
        itemListElement: serviceBreadcrumbs(group).map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${SITE_URL}${crumb.href}`,
        })),
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map(({ question, answer }) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: answer },
              })),
            },
          ]
        : []),
    ],
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const group = groupFor((await params).slug);

  return (
    <div className="ds-page min-h-screen bg-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(group)) }}
      />

      <MainHeader />

      <main className="pt-20">
        <ServiceHero group={group} />
        {hasDemo(group) && <ServiceDemoSection group={group} />}
        <IncludedSection group={group} />
        <AudienceSection group={group} />
        <StepsSection group={group} />
        <RelatedBuildsSection group={group} />
        <PairsSection group={group} />
        <ServiceFaqSection group={group} />
        <ServicesCtaBand
          title="Want this for your business?"
          body={`Book a free call about ${group.name}. We'll look at how your business runs and give you a flat quote up front.`}
        />
        <LeeSystemsContactSection defaultNeed={group.slug} legacyAnchors={false} />
      </main>

      <MainFooter />
    </div>
  );
}
