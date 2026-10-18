import type { Metadata } from "next";
import { MainHeader } from "@/components/layout/MainHeader";
import { MainFooter } from "@/components/layout/MainFooter";
import { ContactFormBlock } from "@/components/contact/ContactFormBlock";
import { TalkNow } from "@/components/contact/TalkNow";
import { site } from "@/data/site";

const title = "Contact | Lee Enterprises Unlimited";
const description =
  "Book a free call with Lee Enterprises Unlimited about a website or automations, or send Hunter Lee a message.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    url: "/contact",
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
 * Where "Contact" in the nav goes, and where every "Book a free call" lands
 * (with LEU preselected) until a booking link is set.
 */
export default function ContactPage() {
  return (
    <div className="ds-page min-h-screen bg-neutral-950">
      <MainHeader />

      <main className="relative isolate overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="absolute inset-0 section-fade" aria-hidden="true">
          <div className="absolute -top-24 right-[12%] h-[30rem] w-[30rem] max-w-[80vw] rounded-full bg-brass-400/[0.07] blur-3xl" />
        </div>

        <div className="section-container relative">
          <div className="mx-auto max-w-2xl">
            <h1 className="heading-xl text-center text-white text-balance">
              Tell me what you need.
            </h1>
            {site.replyTime && (
              <p className="mt-4 text-center text-lg text-neutral-300">
                I&apos;ll reply {site.replyTime}.
              </p>
            )}

            <div className="mt-10">
              <ContactFormBlock headingLevel="h2" />
            </div>

            <TalkNow headingLevel="h2" className="mt-10" />
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
