"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type DeckShot = { name: string; image: string };

type Pose = "front" | "back" | "leaving" | "queue";

/** How long each pair holds before the next shuffle. */
const SHUFFLE_MS = 3500;

/**
 * The picture on the Website builds card: every build from Recent Builds as a
 * fanned deck, two showing at a time (the owner's ask, 2026-10-06). Every 3.5
 * seconds the front site swings out and tucks behind, the back one comes
 * forward and the next build fades in behind it; the poses and the tuck live
 * in globals.css under "the Website builds deck". It only shuffles while the
 * card is on screen and the tab is showing, and never under
 * prefers-reduced-motion, where it holds the first two builds like the old
 * fixed pair. Pointing at the card still parts the pair a little.
 */
export function WebsiteDeck({ shots }: { shots: DeckShot[] }) {
  const deckRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const count = shots.length;

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck || count < 3) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let inView = false;
    let timer = 0;
    const sync = () => {
      const run = inView && document.visibilityState === "visible";
      if (run && !timer) {
        timer = window.setInterval(() => setStep((s) => s + 1), SHUFFLE_MS);
      } else if (!run && timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(deck);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.clearInterval(timer);
    };
  }, [count]);

  const poseOf = (index: number): Pose => {
    const slot = (((index - step) % count) + count) % count;
    if (slot === 0) return "front";
    if (slot === 1) return "back";
    // Before the first shuffle nothing has left the front yet.
    if (slot === count - 1 && step > 0) return "leaving";
    return "queue";
  };

  return (
    <div
      ref={deckRef}
      role="img"
      aria-label={`Websites we built: ${shots.map((shot) => shot.name).join(", ")}`}
      className="absolute inset-0"
    >
      {shots.map((shot, index) => {
        const pose = poseOf(index);
        return (
          <div
            key={shot.image}
            data-pose={pose}
            className="ls-deck-card absolute top-[14%] left-[8%] w-[62%]"
          >
            <div
              className={`overflow-hidden rounded-lg border border-white/15 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] light:shadow-[0_24px_50px_-20px_rgb(26_24_20/0.35)] transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none ${
                pose === "front"
                  ? "group-hover:translate-x-2 group-hover:rotate-1"
                  : pose === "back"
                    ? "group-hover:-translate-x-2 group-hover:-rotate-2"
                    : ""
              } motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:rotate-0`}
            >
              <Image
                src={shot.image}
                alt=""
                width={960}
                height={600}
                sizes="(min-width: 1024px) 24rem, 58vw"
                className="w-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
