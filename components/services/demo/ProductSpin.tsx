"use client";

import { useRef, useState } from "react";
import { Rotate3d } from "lucide-react";

const FRAMES = 36;
const COLUMNS = 6;
const ROWS = FRAMES / COLUMNS;
/** Pixels of drag per frame: a full turn is a little over a card's width. */
const PX_PER_FRAME = 9;

/**
 * The online store's product, turned by the visitor: drag or swipe sideways
 * (or use the arrow keys once it has focus) to spin it a full circle. The 36
 * frames are one WebP sheet, 6 x 6 (a Higgsfield turntable, cut by
 * scripts/build-demo-media.sh), fetched the first time someone points at or
 * focuses the product; until then the photo shows. Nothing moves by itself,
 * so it is the same under reduced motion.
 */
export function ProductSpin({ photo, sheet }: { photo: string; sheet: string }) {
  const [frame, setFrame] = useState(0);
  const [wanted, setWanted] = useState(false);
  const [ready, setReady] = useState(false);
  const drag = useRef<{ x: number; frame: number } | null>(null);

  const turn = (to: number) => setFrame(((to % FRAMES) + FRAMES) % FRAMES);
  const col = frame % COLUMNS;
  const row = Math.floor(frame / COLUMNS);

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Turn the product"
      aria-valuemin={0}
      aria-valuemax={FRAMES - 1}
      aria-valuenow={frame}
      aria-valuetext={`${Math.round((frame / FRAMES) * 360)} degrees`}
      onPointerEnter={() => setWanted(true)}
      onFocus={() => setWanted(true)}
      onPointerDown={(event) => {
        setWanted(true);
        drag.current = { x: event.clientX, frame };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        turn(drag.current.frame - Math.round((event.clientX - drag.current.x) / PX_PER_FRAME));
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onKeyDown={(event) => {
        const step = { ArrowRight: 1, ArrowLeft: -1, ArrowUp: 1, ArrowDown: -1 }[event.key];
        if (step === undefined) return;
        event.preventDefault();
        setWanted(true);
        turn(frame + step);
      }}
      className="relative block aspect-[16/9] w-full cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing focus-visible:outline-2 focus-visible:-outline-offset-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      {wanted && (
        <>
          {/* Loads the sheet; it shows once it has arrived. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sheet} alt="" aria-hidden="true" className="hidden" onLoad={() => setReady(true)} />
          {ready && (
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: `url(${sheet})`,
                backgroundSize: `${COLUMNS * 100}% ${ROWS * 100}%`,
                backgroundPosition: `${(col / (COLUMNS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
              }}
            />
          )}
        </>
      )}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-[#000]/60 px-2 py-1 text-[10px] font-semibold text-[#fff]"
      >
        <Rotate3d className="h-3 w-3" /> Drag to turn
      </span>
    </div>
  );
}
