import Image from "next/image";
import { CircleCheck } from "lucide-react";
import type { ReactNode } from "react";
import { site } from "@/data/site";
import { WebsiteDeck } from "@/components/lee-systems/WebsiteDeck";

type Offering = {
  role: string;
  title: string;
  body: string;
  points: string[];
  media: ReactNode;
};

/**
 * Both halves carry the same weight on purpose (the owner's call,
 * 2026-09-29): six points each. The outlined "01" and "02" over them came off
 * at the owner's request the same day, and the button under each ("Explore
 * automation", "See website builds"), which scrolled to its section, came
 * off on 2026-09-30, also at the owner's request, with the live demo under
 * these halves showing the two working together. The website points are the
 * ones the FAQ already promises, so nothing here says more than it does. The
 * demo under them has no text of its own beyond two captions, so these cards
 * are where the page says in words what each half of it shows.
 */
const offerings: [Offering, Offering] = [
  {
    role: "The system",
    title: "Business automation",
    body: "Custom systems built to streamline revenue into your business.",
    points: [
      "Answers your business calls 24/7 with an AI assistant",
      "Answers every new lead in under a minute",
      "Handles intake, booking and reminders",
      "Requests reviews and chases invoices for you",
      "Updates you & your systems automatically",
      "Endless possibilities: if it's done by hand, it can be automated",
    ],
    media: <AutomationMedia />,
  },
  {
    role: "The storefront",
    title: "Website builds",
    body: "Conversion-focused websites for businesses, built to turn visitors into customers.",
    points: [
      "Mobile-first and fast on any phone",
      "Lead forms that turn visitors into customers",
      "Basic SEO so local customers can find you",
      "We draft the copy, you approve it",
      "You own your domain and your content",
    ],
    media: <WebsiteMedia />,
  },
];

/**
 * "What we do" as two cards side by side (stacked below 1024px), the owner's
 * pick on 2026-10-05 from five directions, after the program cards on The
 * Real World's pages: each offering gets a picture on top, its name and line
 * under it, and its six points as a two-column checklist (one column on a
 * phone). Automation shows the hero's laptop-at-night still;
 * websites shows real builds from Recent Builds, fanned two at a time, and
 * since 2026-10-06 (the owner's ask) shuffles through every one of them every
 * 3.5 seconds (WebsiteDeck). Pointing at a card lifts its border to brass and
 * eases the picture.
 *
 * It replaced a two-page spread mirrored about a brass spine with a packet
 * running down it, which had itself lost its dashed routes and its seam into
 * the live demo on 2026-09-30.
 */
export function LeeSystemsOfferingsSection() {
  return (
    <section className="relative isolate overflow-hidden pt-20 pb-20 md:pt-28 md:pb-28">
      <div className="section-container">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <p className="ds-eyebrow ds-eyebrow--center mb-4">What we do</p>
          <h2 className="heading-lg text-white">Two ways we take work off your plate</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {offerings.map((offering) => (
            <OfferingCard key={offering.title} offering={offering} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferingCard({ offering }: { offering: Offering }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f2346] transition-colors duration-300 hover:border-brass-400/55 light:bg-[#fff] light:shadow-[0_20px_50px_-24px_rgb(15_35_70/0.18)]">
      <div className="relative isolate aspect-[16/9] overflow-hidden bg-[#0a1830] light:bg-[#eef1f6]">
        {offering.media}
        {/* Fades the picture into the card so the copy can ride up over it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-45% to-[#0f2346] light:from-60% light:to-[#fff]"
        />
      </div>

      <div className="relative -mt-7 flex flex-1 flex-col px-6 pb-8 sm:px-9 sm:pb-9">
        <p className="text-xs font-semibold tracking-[0.2em] text-brass-300 uppercase">
          {offering.role}
        </p>
        <h3 className="mt-2.5 mb-2.5 text-3xl font-bold tracking-tight text-white md:text-4xl">
          {offering.title}
        </h3>
        <p className="max-w-md text-lg leading-relaxed text-neutral-300">{offering.body}</p>

        <ul className="mt-7 grid grid-cols-1 gap-x-6 gap-y-3.5 border-t border-white/10 pt-7 sm:grid-cols-2">
          {offering.points.map((point) => (
            <li key={point} className="flex gap-2.5 text-[15px] leading-snug text-neutral-300">
              <CircleCheck
                aria-hidden="true"
                strokeWidth={1.75}
                className="mt-px h-[18px] w-[18px] shrink-0 text-brass-400"
              />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

const easeImage =
  "transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none";

function AutomationMedia() {
  return (
    <Image
      src="/lee-systems/hero/hero-still-1280.webp"
      alt="A laptop on a desk at night showing a business dashboard"
      fill
      sizes="(min-width: 1280px) 38rem, (min-width: 1024px) 48vw, 92vw"
      className={`object-cover ${easeImage} group-hover:scale-[1.04] motion-reduce:group-hover:scale-100`}
    />
  );
}

/**
 * Every build from Recent Builds, fanned on a brass glow and shuffling (see
 * WebsiteDeck), so a new build joins the card as soon as it is added there.
 */
function WebsiteMedia() {
  const shots = site.projects.flatMap((project) =>
    project.image ? [{ name: project.name, image: project.image }] : [],
  );

  return (
    <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_100%,rgba(157,187,240,0.18),transparent_70%)] light:bg-[radial-gradient(70%_80%_at_50%_100%,rgba(23,71,154,0.16),transparent_70%)]">
      <WebsiteDeck shots={shots} />
    </div>
  );
}
