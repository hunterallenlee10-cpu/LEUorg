import type { Metadata } from "next";
import { MainHeader } from "@/components/layout/MainHeader";
import { MainFooter } from "@/components/layout/MainFooter";
import { LegalSection } from "@/components/sections/LegalSection";
import { companyInfo } from "@/data/company";

const title = `Privacy Policy & Terms of Service | ${companyInfo.name}`;
const description = `Privacy Policy and Terms of Service for ${companyInfo.name}.`;

// Its own title, description and share image (app/legal/opengraph-image.tsx).
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/legal",
  },
  openGraph: {
    type: "website",
    url: "/legal",
    siteName: companyInfo.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

// The legal text used to sit at the bottom of the homepage. It lives here now,
// reached from the footer's Legal links.
export default function LegalPage() {
  return (
    <div className="ds-page min-h-screen bg-neutral-950">
      <MainHeader />
      <main>
        <LegalSection />
      </main>
      <MainFooter />
    </div>
  );
}
