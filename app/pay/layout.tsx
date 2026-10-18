import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { companyInfo } from "@/data/company";

/**
 * Every /pay page: client billing (docs/PAY.md). Kept out of search on every
 * front: this noindex, the X-Robots-Tag header in next.config.mjs, the
 * Disallow in app/robots.ts, no sitemap entry and no link from anywhere on the
 * site. The title never names the client, because a texted link's preview
 * shows it.
 *
 * No site header or footer: the LEU mark (linking home) and the page itself,
 * so a client has one thing to look at. The light/dark switch sits dimmed in
 * the corner, there for anyone who looks for it without competing with the
 * payment.
 */
export const metadata: Metadata = {
  title: { absolute: `Payment | ${companyInfo.name}` },
  description: `Secure payment for ${companyInfo.name}.`,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function PayLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-neutral-950 bg-[radial-gradient(90%_50%_at_50%_0%,rgb(var(--amber)/0.07),transparent_70%)]">
      <header className="relative flex justify-center px-4 pt-8 sm:pt-12">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-3 rounded-lg"
        >
          <Image
            src={companyInfo.mark}
            alt={companyInfo.logoAlt}
            width={204}
            height={160}
            sizes="51px"
            preload
            className="h-10 w-auto"
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            {companyInfo.name}
          </span>
        </Link>
        <ThemeToggle className="absolute right-2 top-2 opacity-60 hover:opacity-100 focus-visible:opacity-100 sm:right-4 sm:top-4" />
      </header>

      <main className="flex-1 px-4 pt-12 pb-20 sm:px-6 sm:pt-16">
        {children}
      </main>
    </div>
  );
}
