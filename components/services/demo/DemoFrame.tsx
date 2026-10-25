"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { ArrowRight, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { track } from "@vercel/analytics";
import { bookLabel } from "@/data/site";
import { serviceFormHref } from "@/data/services";
import { QueryHashLink } from "@/components/ui/QueryHashLink";
import type { Demo, DemoFrameRef } from "@/components/services/demo/useDemo";
import "../services.css";

/**
 * The frame every demo sits in, the same in the Demo Lab and on the service
 * pages: the "Example" label and the demo's name, the Play / Pause / Replay
 * control (Step through and Next under reduced motion), the demo itself in a
 * box of fixed height so nothing below moves as it plays, the closing call
 * to action and the footnote.
 *
 * The call to action is always there, so the frame never changes height; it
 * lights up once the demo reaches its result. It goes to the page's own form
 * with this service picked (`formPath`), and sends `demo_cta`.
 *
 * `captions` is one line per step, read out by screen readers when a visitor
 * started the demo (not when it started itself, which would talk over
 * whatever they were reading).
 */
export function DemoFrame({
  frameRef,
  demo,
  title,
  formPath,
  stageClassName,
  toolbarClassName,
  captions,
  toolbar,
  children,
}: {
  frameRef: DemoFrameRef;
  demo: Demo;
  title: string;
  /** The page whose form the call to action goes to. */
  formPath: string;
  /** The stage's fixed height, per breakpoint (`demoHeights`). */
  stageClassName: string;
  /** The toolbar's reserved height (`demoSizes`). */
  toolbarClassName?: string;
  captions?: readonly string[];
  /** Choices above the stage: a scenario picker, an industry switch. */
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  const finished = demo.status === "done";

  return (
    <FrameShell
      frameRef={frameRef}
      title={title}
      control={<DemoControl demo={demo} />}
      toolbar={toolbar}
      toolbarClassName={toolbarClassName}
      stageClassName={stageClassName}
      finished={finished}
      cta={
        <QueryHashLink
          href={serviceFormHref(demo.service, formPath)}
          onClick={() => track("demo_cta", { service: demo.service })}
          className={clsx(
            ctaClass,
            // The same 2px border either way, so the row keeps its height.
            finished ? "btn-ls-primary border-2 border-transparent" : "btn-ls-secondary"
          )}
        >
          {bookLabel}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
          />
        </QueryHashLink>
      }
    >
      {children}
      {captions && demo.byVisitor && (
        <p className="sr-only" aria-live="polite">
          {captions[demo.step]}
        </p>
      )}
    </FrameShell>
  );
}

const ctaClass = "group inline-flex min-h-11 items-center justify-center gap-2 text-sm";

/**
 * The frame's markup, shared with the loading placeholder (registry.tsx) so
 * the two are the same height to the pixel and nothing moves when a demo
 * arrives. On a phone the header always stacks (label and title, then the
 * control), whatever the title's length.
 */
export function FrameShell({
  frameRef,
  title,
  control,
  toolbar,
  toolbarClassName,
  stageClassName,
  finished = false,
  cta,
  children,
}: {
  frameRef?: DemoFrameRef;
  title: string;
  control: ReactNode;
  toolbar?: ReactNode;
  toolbarClassName?: string;
  stageClassName: string;
  finished?: boolean;
  cta: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      ref={frameRef}
      className="overflow-hidden rounded-xl border border-white/10 bg-[var(--svc-frame)] light:bg-[#fff] light:shadow-[0_20px_50px_-24px_rgb(var(--ink)/0.18)]"
    >
      <div className="flex flex-col items-start gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
          <span className="shrink-0 rounded border border-brass-400/40 px-2 py-0.5 text-[11px] font-semibold tracking-[0.16em] text-brass-300 uppercase">
            Example
          </span>
          <h3 className="truncate text-sm font-semibold text-white sm:text-base">{title}</h3>
        </div>
        {control}
      </div>

      {(toolbar || toolbarClassName) && (
        <div
          className={clsx(
            "flex items-center border-b border-white/10 px-4 py-3 sm:px-5",
            toolbarClassName
          )}
        >
          <div className="min-w-0 flex-1">{toolbar}</div>
        </div>
      )}

      <div className={clsx("relative", stageClassName)}>{children}</div>

      <div
        className={clsx(
          "flex flex-col items-start gap-3 border-t px-4 py-4 transition-colors duration-500 motion-reduce:transition-none sm:flex-row sm:items-center sm:justify-between sm:px-5",
          finished ? "border-brass-400/40 bg-brass-400/[0.07]" : "border-white/10"
        )}
      >
        <p className="text-sm font-semibold text-white">Want this for your business?</p>
        {cta}
      </div>

      <p className="px-4 pb-4 text-xs text-neutral-400 sm:px-5">
        Simulated example. Names, numbers and businesses are made up.
      </p>
    </div>
  );
}

/** The placeholder's stand-ins for the control and the call to action. */
export function ShellPlaceholderControl() {
  return (
    <span className={clsx(controlClass, "text-neutral-400")}>
      <Play aria-hidden="true" className="h-4 w-4" />
      Play
    </span>
  );
}

export function ShellPlaceholderCta() {
  return (
    <span className={clsx(ctaClass, "btn-ls-secondary")}>
      {bookLabel}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </span>
  );
}

const controlClass =
  "inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:border-brass-400/60 hover:text-brass-200 motion-reduce:transition-none";

function DemoControl({ demo }: { demo: Demo }) {
  const { status, reduced } = demo;

  if (reduced) {
    if (status === "stepping") {
      return (
        <button type="button" onClick={demo.next} className={controlClass}>
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">
            (step {demo.step + 1} of {demo.last + 1})
          </span>
        </button>
      );
    }
    return (
      <button type="button" onClick={demo.stepThrough} className={controlClass}>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
        Step through
      </button>
    );
  }

  if (status === "playing") {
    return (
      <button type="button" onClick={demo.pause} className={controlClass}>
        <Pause aria-hidden="true" className="h-4 w-4" />
        Pause
      </button>
    );
  }

  if (status === "done") {
    return (
      <button type="button" onClick={demo.replay} className={controlClass}>
        <RotateCcw aria-hidden="true" className="h-4 w-4" />
        Replay
      </button>
    );
  }

  return (
    <button type="button" onClick={demo.play} className={controlClass}>
      <Play aria-hidden="true" className="h-4 w-4" />
      {status === "paused" ? "Resume" : "Play"}
    </button>
  );
}
