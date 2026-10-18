import type { Metadata } from "next";
import Link from "next/link";

import { MainHeader } from "@/components/layout/MainHeader";
import { MainFooter } from "@/components/layout/MainFooter";
import { companyInfo } from "@/data/company";

export const metadata: Metadata = {
  title: `Page not found | ${companyInfo.name}`,
  robots: { index: false },
};

// Any unmatched URL lands here. Without it Next's default 404 paints a white
// page on light-OS machines, with no way back into the site.
export default function NotFound() {
  return (
    <main className="w-full bg-neutral-950">
      <MainHeader />

      {/* pt-32 clears the fixed header; min-h keeps the footer from riding up
          under the short message, as on /partners. */}
      <section className="section-container flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center pt-32 pb-24 text-center">
        <p className="ds-eyebrow ds-eyebrow--center">404</p>

        <h1 className="ds-h1 mt-5">Page not found</h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-neutral-400">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>

        <Link href="/" className="btn-primary mt-10">
          Back to the homepage
        </Link>
      </section>

      <MainFooter />
    </main>
  );
}
