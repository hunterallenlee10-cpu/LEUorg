"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import clsx from "clsx";
import type { DemoSlug } from "@/data/services";
import { useInView } from "@/lib/hooks/useInView";
import {
  demoSizes,
  demoTitles,
  type DemoAssets,
  type DemoProps,
} from "@/components/services/demo/sizes";
import {
  FrameShell,
  ShellPlaceholderControl,
  ShellPlaceholderCta,
} from "@/components/services/demo/DemoFrame";

function Placeholder({ slug }: { slug: DemoSlug }) {
  const sizes = demoSizes[slug];
  return (
    <div aria-hidden="true">
      <FrameShell
        title={demoTitles[slug]}
        control={<ShellPlaceholderControl />}
        toolbarClassName={sizes.toolbar}
        stageClassName={clsx("flex items-center justify-center", sizes.stage)}
        cta={<ShellPlaceholderCta />}
      >
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-brass-400 motion-reduce:animate-none" />
      </FrameShell>
    </div>
  );
}

const loaders: Record<DemoSlug, ComponentType<DemoProps>> = {
  "get-found": dynamic(() => import("./GetFoundDemo"), {
    ssr: false,
    loading: () => <Placeholder slug="get-found" />,
  }),
  "ai-calls": dynamic(() => import("./AiCallsDemo"), {
    ssr: false,
    loading: () => <Placeholder slug="ai-calls" />,
  }),
  "follow-up": dynamic(() => import("./FollowUpDemo"), {
    ssr: false,
    loading: () => <Placeholder slug="follow-up" />,
  }),
  content: dynamic(() => import("./ContentDemo"), {
    ssr: false,
    loading: () => <Placeholder slug="content" />,
  }),
  "custom-ai": dynamic(() => import("./CustomAiDemo"), {
    ssr: false,
    loading: () => <Placeholder slug="custom-ai" />,
  }),
};

/**
 * A demo, loaded only once it is within about a screen of view: until then
 * the placeholder holds its exact space. Used by the Demo Lab and by each
 * service page.
 */
export function DemoSlot({
  slug,
  formPath,
  assets,
}: {
  slug: DemoSlug;
  formPath: string;
  assets: DemoAssets;
}) {
  const [ref, near] = useInView<HTMLDivElement>({ rootMargin: "600px 0px", once: true });
  const Demo = loaders[slug];
  return <div ref={ref}>{near ? <Demo formPath={formPath} assets={assets} /> : <Placeholder slug={slug} />}</div>;
}
