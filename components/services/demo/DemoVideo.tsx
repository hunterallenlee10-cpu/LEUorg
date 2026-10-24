"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useInView } from "@/lib/hooks/useInView";
import { usePageVisible, useReducedMotion, useSaveData } from "@/lib/hooks/useMediaState";

/**
 * A short, muted, looping clip for the demos and their previews (the ones made
 * in Higgsfield: docs/DEMO-MEDIA-PLAN.md). It fills its box, which the caller
 * sizes and positions: `className` must make it `relative` or `absolute`.
 *
 * - Nothing downloads until it comes within 200px of the screen; until then,
 *   and while the clip loads, the still (`poster`) shows.
 * - It plays only while near the screen, in a visible tab, and while
 *   `playing` is true (a demo can hold it), and it pauses otherwise.
 * - Under reduced motion or Data Saver the video is never loaded: the still
 *   stays.
 * - It is decorative (the words beside it say what it shows), so screen
 *   readers skip it. `ai` adds the small "AI-generated" tag the brand rules
 *   ask for on AI footage.
 */
export function DemoVideo({
  src,
  poster,
  playing = true,
  ai = false,
  className,
  mediaClassName,
  mediaStyle,
  tagClassName,
}: {
  /** An H.264 MP4, muted (it never plays sound). */
  src: string;
  /** The first frame as a WebP, the same size and crop. */
  poster: string;
  playing?: boolean;
  ai?: boolean;
  className?: string;
  /** Classes for the still and the video alike (filters and the like). */
  mediaClassName?: string;
  /** Style for the still and the video alike (an object-position). */
  mediaStyle?: React.CSSProperties;
  tagClassName?: string;
}) {
  const [ref, near] = useInView<HTMLDivElement>({ rootMargin: "200px 0px" });
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  const saveData = useSaveData();
  const still = reduced || saveData;

  // Loaded the first time it comes near, then kept.
  const [armed, setArmed] = useState(false);
  if (near && !armed && !still) setArmed(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const play = playing && near && visible && !still;
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (play) void video.play().catch(() => {});
    else video.pause();
  }, [play, armed]);

  const media = clsx("absolute inset-0 h-full w-full object-cover", mediaClassName);
  return (
    <div ref={ref} aria-hidden="true" className={clsx("overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" decoding="async" loading="lazy" className={media} style={mediaStyle} />
      {armed && !still && (
        <video ref={videoRef} src={src} poster={poster} muted loop playsInline preload="auto" className={media} style={mediaStyle} />
      )}
      {ai && (
        <span
          className={clsx(
            "absolute top-2 right-2 rounded bg-[#000]/60 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-[#fff]/85 uppercase",
            tagClassName
          )}
        >
          AI-generated
        </span>
      )}
    </div>
  );
}
