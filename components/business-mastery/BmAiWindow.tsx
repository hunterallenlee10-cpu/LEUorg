"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Check } from "lucide-react";

/**
 * The "AI shift" row's visual (BmShiftSection): a mock assistant window that
 * types a request, thinks, then ticks off what it did, and moves on to the
 * next request. It shows the kind of everyday work AI takes off a business
 * owner's plate; it is a demo, so it names tasks, not results or figures.
 *
 * Decorative, so aria-hidden; the row's copy carries the point. It only runs
 * while on screen. The server render, reduced motion and no-JS all show the
 * first request already finished, so every state is a complete picture.
 */

const scripts = [
  {
    prompt: "Reply to every new lead from this week.",
    results: [
      "Wrote a personal reply to each lead",
      "Booked calls into your open slots",
      "Logged every lead in your CRM",
    ],
  },
  {
    prompt: "Plan a week of posts for my business.",
    results: [
      "Seven posts written in your voice",
      "Captions and hashtags ready",
      "Scheduled for the week ahead",
    ],
  },
  {
    prompt: "Send me today's numbers every morning.",
    results: [
      "Pulled today's sales and new leads",
      "Summed it up in one message",
      "Set to arrive at 8:00 AM daily",
    ],
  },
] as const;

type Phase = "typing" | "thinking" | "results" | "hold";

const TYPE_MS = 38;
const THINK_MS = 1100;
const RESULT_MS = 650;
const HOLD_MS = 2600;

export function BmAiWindow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [script, setScript] = useState(0);
  const [phase, setPhase] = useState<Phase>("hold");
  const [typed, setTyped] = useState<number>(scripts[0].prompt.length);
  const [shown, setShown] = useState<number>(scripts[0].results.length);

  // Runs only while at least a third of the window is on screen, and never
  // under reduced motion.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const current = scripts[script];
    let timer: number;

    if (phase === "typing") {
      timer = window.setTimeout(() => {
        if (typed < current.prompt.length) setTyped(typed + 1);
        else setPhase("thinking");
      }, TYPE_MS);
    } else if (phase === "thinking") {
      timer = window.setTimeout(() => setPhase("results"), THINK_MS);
    } else if (phase === "results") {
      timer = window.setTimeout(() => {
        if (shown < current.results.length) setShown(shown + 1);
        else setPhase("hold");
      }, RESULT_MS);
    } else {
      timer = window.setTimeout(() => {
        setScript((script + 1) % scripts.length);
        setTyped(0);
        setShown(0);
        setPhase("typing");
      }, HOLD_MS);
    }

    return () => window.clearTimeout(timer);
  }, [active, phase, script, typed, shown]);

  const current = scripts[script];
  const promptDone = typed >= current.prompt.length;

  return (
    <div ref={rootRef} className="bm-shift-panel flex min-h-[25rem] flex-col md:min-h-[27rem]" aria-hidden="true">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">AI assistant</span>
        <span className="ml-auto flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
          <span className="bm-live-dot" />
          Working
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden px-5 py-5 md:px-6">
        {/* The request */}
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-white/[0.08] px-4 py-3 text-sm text-white md:text-base">
          {current.prompt.slice(0, typed)}
          {!promptDone && <span className="bm-caret" />}
        </div>

        {/* The reply */}
        {promptDone && (
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-brass-400/40 bg-brass-400/10 text-brass-400">
              <Bot className="h-4 w-4" />
            </span>
            {phase === "thinking" ? (
              <span className="bm-thinking mt-3" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            ) : (
              <ul className="space-y-2.5 pt-1">
                {current.results.slice(0, shown).map((result) => (
                  <li key={result} className="bm-result flex items-center gap-2.5 text-sm text-neutral-200 md:text-base">
                    <Check className="h-5 w-5 shrink-0 text-brass-400" strokeWidth={2.5} />
                    {result}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* The input bar */}
      <div className="mx-5 mb-5 flex items-center gap-3 border border-white/10 bg-neutral-950/70 px-4 py-3 md:mx-6">
        <span className="flex-1 text-sm text-neutral-500">Ask for anything…</span>
        <span className="flex h-7 w-7 items-center justify-center bg-[var(--ds-gold)] text-[var(--ds-on-gold)]">
          <ArrowUp className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
