import clsx from "clsx";
import { site, telHref } from "@/data/site";

/** "Rather call or email?" under a closing call to action. */
export function CallOrEmailLine({ className }: { className?: string }) {
  return (
    <p className={clsx("text-sm text-neutral-400", className)}>
      Rather call or email?{" "}
      {site.phone && (
        <>
          <a
            href={telHref(site.phone)}
            className="font-semibold text-neutral-200 underline underline-offset-4 hover:text-brass-300"
          >
            {site.phone}
          </a>{" "}
          or{" "}
        </>
      )}
      <a
        href={`mailto:${site.email}`}
        className="whitespace-nowrap font-semibold text-neutral-200 underline underline-offset-4 hover:text-brass-300"
      >
        {site.email}
      </a>
    </p>
  );
}
