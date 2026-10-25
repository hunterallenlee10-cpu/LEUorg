"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "@/lib/hooks/useMediaState";
import {
  Captions,
  CaptionsOff,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  type LucideIcon,
} from "lucide-react";
import type {
  PanelStatus,
  VideoChapter,
  VideoLine,
  VideoTiming,
} from "@/data/narrated-video";

/**
 * The player behind the narrated videos on /how-it-works: "Two paths"
 * (TwoPathsDemo) and the website video under it (WebsiteVideo), used as
 * `const { frame, mode, playRun } = useNarratedVideo(video, view)`. Each video
 * is two runs of one example, the worse way ("before") and then Lee Systems
 * Co.'s ("after"), every line read aloud and captioned. Nothing plays until
 * it is pressed, and it pauses itself once scrolled out of view.
 *
 * The corner buttons pause it, turn the sound off and turn the captions off.
 * With the sound on, a screen reader hears the voice; with it off (or no
 * audio), the captions go to a polite live region instead, so nobody hears
 * every line twice. Styles are the `.ls-paths-*` block in app/globals.css.
 */

/** One of the frame's three panels, left to right. */
export interface VideoPanel {
  /** Also picks the panel's tint in the stylesheet. */
  id: string;
  label: string;
  icons: { idle: LucideIcon } & Partial<Record<PanelStatus, LucideIcon>>;
  chips: Partial<Record<PanelStatus, string>>;
}

export interface VideoTimeline {
  lines: VideoLine[];
  /** When each line starts, in ms. */
  starts: number[];
  total: number;
  /** The soundtrack, or "" to play silently. */
  src: string;
  /** Where the "after" run starts, which splits the progress bar in two. */
  afterStart: number;
}

/**
 * A video's timeline, from its lines and its built soundtrack. If a line has
 * no time there, the audio hasn't been rebuilt since the lines changed, so
 * the voice would say the wrong things: the video then plays silently, on
 * estimated times.
 */
export function createTimeline(lines: VideoLine[], timing: VideoTiming): VideoTimeline {
  const known = timing.lines;
  let starts: number[];
  let total: number;
  let src = "";
  if (timing.src && lines.every((line) => line.id in known)) {
    starts = lines.map((line) => known[line.id]);
    total = timing.durationMs;
    src = timing.src;
  } else {
    starts = [];
    let at = 250;
    for (const line of lines) {
      starts.push(at);
      at += 600 + line.caption.length * 60 + line.hold * 1000;
    }
    total = at;
  }
  const after = lines.findIndex((line) => line.chapter === "after");
  return { lines, starts, total, src, afterStart: after >= 0 ? starts[after] : total / 2 };
}

/** The line showing at `ms`: the last one started, or -1 before the first. */
function lineAt(video: VideoTimeline, ms: number) {
  let index = -1;
  video.starts.forEach((start, i) => {
    if (start <= ms) index = i;
  });
  return index;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Fills the two chapters of the progress bar up to `ms`. */
function paintProgress(video: VideoTimeline, fills: (HTMLSpanElement | null)[], ms: number) {
  const [before, after] = fills;
  if (before) before.style.transform = `scaleX(${clamp01(ms / video.afterStart)})`;
  if (after) {
    after.style.transform = `scaleX(${clamp01((ms - video.afterStart) / (video.total - video.afterStart))})`;
  }
}

/**
 * The video's clock. While the soundtrack plays it is the soundtrack's own
 * position, so the captions can't drift from the voice. Without it (no audio
 * built, or the browser couldn't play it) a timer stands in, and `since` is
 * null while paused.
 */
type Clock = { kind: "audio" } | { kind: "timer"; at: number; since: number | null };

function readClock(clock: Clock, audio: HTMLAudioElement | null) {
  if (clock.kind === "audio") return (audio?.currentTime ?? 0) * 1000;
  return clock.at + (clock.since === null ? 0 : performance.now() - clock.since);
}

/** Brings the frame into view when a button outside it starts the video. */
function revealFrame(frame: HTMLElement | null) {
  if (!frame) return;
  const header = 80;
  const { top, bottom } = frame.getBoundingClientRect();
  if (top >= header && bottom <= window.innerHeight) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: window.scrollY + top - header - 16,
    behavior: reduced ? "auto" : "smooth",
  });
}

type Phase = "idle" | "playing" | "paused" | "ended";

/** Announced when a video starts, so any other one on the page pauses and
 *  two voices never talk over each other. The detail is the frame's id. */
const PLAY_EVENT = "narrated-video:play";

/** The run the video is on, for the frame and anything that follows it. */
export type VideoMode = "before" | "after" | undefined;

/** How a video's frame looks and is named. */
export interface VideoView {
  panels: VideoPanel[];
  /** The frame's id, for buttons outside it that control it. */
  id: string;
  /** What the frame is, for a screen reader. */
  label: string;
  /** The play button's name, for a screen reader. */
  playLabel: string;
  /** What the "Example" tag calls each run. */
  runLabels: { before: string; after: string };
  /**
   * The picture track, if the video has one: AI footage cut to the narration
   * (scripts/build-demo-films.mjs), muted, playing under the panels on the
   * narration's clock. Its first frame is the still before it plays.
   */
  film?: { src: string; poster: string };
}

/**
 * Keeps the picture track on the narration's clock: playing alongside it,
 * nudged back whenever they drift apart; under reduced motion it stays
 * paused and shows one still from each line's shot instead.
 */
function syncFilm(film: HTMLVideoElement | null, video: VideoTimeline, ms: number, reduced: boolean) {
  if (!film) return;
  if (reduced) {
    const index = lineAt(video, ms);
    const still = index > 0 ? (video.starts[index] + 600) / 1000 : 0.6;
    if (Math.abs(film.currentTime - still) > 0.05) film.currentTime = still;
    if (!film.paused) film.pause();
    return;
  }
  // A big gap (a start, a seek, a stall) is closed by jumping; a small one by
  // running the film 5% fast or slow until it lines up, so each cut lands
  // with its line without a visible skip.
  const drift = film.currentTime - ms / 1000;
  if (Math.abs(drift) > 0.35) {
    film.currentTime = ms / 1000;
    film.playbackRate = 1;
  } else {
    film.playbackRate = Math.abs(drift) < 0.03 ? 1 : drift > 0 ? 0.95 : 1.05;
  }
  if (film.paused) void film.play().catch(() => {});
}

/**
 * A video: its frame, ready to render, plus the run it's on and a way to
 * play one run from a button outside it (the Two paths fork uses both).
 */
export function useNarratedVideo(video: VideoTimeline, view: VideoView) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [line, setLine] = useState(-1);
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [audioFailed, setAudioFailed] = useState(!video.src);

  const frameRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const clockRef = useRef<Clock>({ kind: "audio" });

  /** Switches to the timer from where the soundtrack stopped. */
  const fallBack = useCallback(() => {
    setAudioFailed(true);
    if (clockRef.current.kind === "audio") {
      clockRef.current = {
        kind: "timer",
        at: (audioRef.current?.currentTime ?? 0) * 1000,
        since: performance.now(),
      };
    }
  }, []);

  const playAudio = useCallback(() => {
    audioRef.current?.play().catch((error: DOMException) => {
      // A play() cut short by a pause() is not a failure.
      if (error.name !== "AbortError") fallBack();
    });
  }, [fallBack]);

  const start = (from: number) => {
    const audio = audioRef.current;
    if (audio && !audioFailed) {
      clockRef.current = { kind: "audio" };
      audio.muted = muted;
      audio.currentTime = from / 1000;
      playAudio();
    } else {
      clockRef.current = { kind: "timer", at: from, since: performance.now() };
    }
    setLine(lineAt(video, from));
    setPhase("playing");
    window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: view.id }));
  };

  /** Starts from a button inside the frame that goes away once it plays:
   *  focus moves to the frame rather than dropping to the top of the page. */
  const startInFrame = (from: number) => {
    start(from);
    frameRef.current?.focus({ preventScroll: true });
  };

  /** Plays one run from its first line, from a button outside the frame. */
  const playRun = (chapter: VideoChapter) => {
    const index = video.lines.findIndex((l) => l.chapter === chapter);
    start(index >= 0 ? video.starts[index] : 0);
    revealFrame(frameRef.current);
  };

  const pause = useCallback(() => {
    const clock = clockRef.current;
    if (clock.kind === "timer" && clock.since !== null) {
      clockRef.current = { kind: "timer", at: clock.at + performance.now() - clock.since, since: null };
    }
    audioRef.current?.pause();
    setPhase("paused");
  }, []);

  const resume = () => {
    const clock = clockRef.current;
    if (clock.kind === "timer") clockRef.current = { ...clock, since: performance.now() };
    else playAudio();
    setPhase("playing");
    window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: view.id }));
  };

  const toggle = () => {
    if (phase === "playing") pause();
    else if (phase === "paused") resume();
    else startInFrame(0);
  };

  const toggleMuted = () => {
    setMuted(!muted);
    if (audioRef.current) audioRef.current.muted = !muted;
  };

  // While playing: follow the clock every frame, move the progress bar, and
  // change the line when the clock passes the next one's start.
  useEffect(() => {
    if (phase !== "playing") return;
    const film = filmRef.current;
    let frame = 0;
    const tick = () => {
      const audio = audioRef.current;
      const clock = clockRef.current;
      const ms = readClock(clock, audio);
      paintProgress(video, fillRefs.current, ms);
      setLine(lineAt(video, ms));
      syncFilm(film, video, Math.min(ms, video.total - 50), reduced);
      if (ms >= video.total || (clock.kind === "audio" && audio?.ended)) {
        audio?.pause();
        paintProgress(video, fillRefs.current, video.total);
        setLine(video.lines.length - 1);
        setPhase("ended");
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      film?.pause();
    };
  }, [phase, video, reduced]);

  // Pause once the frame has been seen and then scrolled fully out of view,
  // so the voice doesn't follow the reader down the page.
  useEffect(() => {
    const frame = frameRef.current;
    if (phase !== "playing" || !frame) return;
    let seen = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) seen = true;
      else if (seen) pause();
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [phase, pause]);

  // Pause when another video on the page starts.
  useEffect(() => {
    if (phase !== "playing") return;
    const onPlay = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== view.id) pause();
    };
    window.addEventListener(PLAY_EVENT, onPlay);
    return () => window.removeEventListener(PLAY_EVENT, onPlay);
  }, [phase, pause, view.id]);

  // Stop the sound if the section unmounts mid-play.
  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  const current = line >= 0 ? video.lines[line] : null;
  const chapter = current?.chapter;
  const mode: VideoMode =
    chapter === "before" ? "before" : chapter === "after" || chapter === "outro" ? "after" : undefined;

  const frame = (
    <NarratedVideoFrame
      {...view}
      video={video}
      frameRef={frameRef}
      audioRef={audioRef}
      filmRef={filmRef}
      phase={phase}
      current={current}
      mode={mode}
      muted={muted}
      captions={captions}
      audioFailed={audioFailed}
      onToggle={toggle}
      onReplay={() => start(0)}
      onReplayInFrame={() => startInFrame(0)}
      onToggleMuted={toggleMuted}
      onToggleCaptions={() => setCaptions(!captions)}
      setFill={(index, el) => {
        fillRefs.current[index] = el;
      }}
      onPrefetch={() => {
        // Fetch the soundtrack as soon as someone reaches for the video.
        if (audioRef.current) audioRef.current.preload = "auto";
        if (filmRef.current) filmRef.current.preload = "auto";
      }}
      onAudioError={() => {
        if (phase === "playing") fallBack();
        else setAudioFailed(true);
      }}
    />
  );

  return { frame, mode, playRun };
}



const idleStatus: PanelStatus[] = ["idle", "idle", "idle"];

/** The frame: three panels, the caption, the progress bar and the controls. */
function NarratedVideoFrame({
  panels,
  id,
  label,
  playLabel,
  runLabels,
  film,
  video,
  frameRef,
  audioRef,
  filmRef,
  phase,
  current,
  mode,
  muted,
  captions,
  audioFailed,
  onToggle,
  onReplay,
  onReplayInFrame,
  onToggleMuted,
  onToggleCaptions,
  setFill,
  onPrefetch,
  onAudioError,
}: VideoView & {
  video: VideoTimeline;
  frameRef: RefObject<HTMLDivElement | null>;
  audioRef: RefObject<HTMLAudioElement | null>;
  filmRef: RefObject<HTMLVideoElement | null>;
  phase: Phase;
  current: VideoLine | null;
  mode: VideoMode;
  muted: boolean;
  captions: boolean;
  audioFailed: boolean;
  onToggle: () => void;
  onReplay: () => void;
  onReplayInFrame: () => void;
  onToggleMuted: () => void;
  onToggleCaptions: () => void;
  setFill: (index: number, el: HTMLSpanElement | null) => void;
  onPrefetch: () => void;
  onAudioError: () => void;
}) {
  const statuses = current?.status ?? idleStatus;
  const showPlay = phase === "idle";
  // Before the first line starts, the prompt stays up, as on the poster.
  const caption = current ?? video.lines[0];
  const audible = !audioFailed && !muted;

  return (
    <div
      ref={frameRef}
      id={id}
      tabIndex={-1}
      role="group"
      aria-label={label}
      className="ls-paths-frame"
      data-state={phase}
      data-mode={mode}
      data-film={film ? "" : undefined}
      onPointerEnter={onPrefetch}
    >
      {video.src && (
        <audio
          ref={audioRef}
          src={video.src}
          preload="none"
          onError={onAudioError}
        />
      )}

      {film && (
        <video
          ref={filmRef}
          className="ls-paths-film"
          src={film.src}
          poster={film.poster}
          muted
          playsInline
          preload="none"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      <div className="ls-paths-panels" aria-hidden="true">
        {panels.map(({ id: panelId, label: panelLabel, icons, chips }, i) => {
          const status = statuses[i];
          // Before it plays, the middle orb is the play button's face, so
          // the button sits where the reference puts it: dead centre.
          const playFace = showPlay && i === 1;
          const Icon = icons[status] ?? icons.idle;
          const chip = playFace ? undefined : chips[status];
          return (
            <div
              key={panelId}
              className="ls-paths-panel"
              data-panel={panelId}
              data-status={status}
              data-focus={current?.focus === i ? "" : undefined}
            >
              <span className="ls-paths-label">{panelLabel}</span>
              <span className="ls-paths-stage">
                <span className="ls-paths-orb" data-play={playFace ? "" : undefined}>
                  {playFace ? (
                    <Play className="ls-paths-icon" fill="currentColor" strokeWidth={0} />
                  ) : (
                    <Icon className="ls-paths-icon" strokeWidth={1.75} />
                  )}
                </span>
                <span className="ls-paths-chip" data-hidden={chip ? undefined : ""}>
                  {chip ?? " "}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* The tag names the run that's playing. */}
      <span className="ls-paths-tag" data-mode={mode} aria-hidden="true">
        Example
        {mode && <span className="ls-paths-tag-run">{runLabels[mode]}</span>}
      </span>

      <div className="ls-paths-caption">
        {(captions || showPlay) && (
          <p aria-hidden="true">
            <span
              key={current ? current.id : "prompt"}
              className="ls-paths-caption-text"
              data-kind={caption.kind}
            >
              {caption.caption}
            </span>
          </p>
        )}
        {phase === "ended" && (
          <button type="button" className="ls-paths-replay" onClick={onReplayInFrame}>
            <RotateCcw aria-hidden="true" />
            Replay
          </button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {!audible && current && phase !== "idle" ? current.caption : ""}
      </p>

      {phase !== "idle" && (
        <span className="ls-paths-progress" aria-hidden="true">
          {[video.afterStart, video.total - video.afterStart].map((length, i) => (
            <span
              key={i}
              className="ls-paths-progress-run"
              data-run={i === 0 ? "before" : "after"}
              style={{ flexGrow: length }}
            >
              <span ref={(el) => setFill(i, el)} className="ls-paths-progress-fill" />
            </span>
          ))}
        </span>
      )}

      {phase === "paused" && (
        <span className="ls-paths-paused" aria-hidden="true">
          <Play fill="currentColor" strokeWidth={0} />
        </span>
      )}

      {/* The poster, and then the picture: a click anywhere on the frame
          plays, pauses or resumes, like a video. Before it plays, the
          button's face is the middle orb above, which is why it draws
          nothing itself; after that, the corner buttons are the ones a
          keyboard reaches. */}
      <button
        type="button"
        className="ls-paths-play"
        onClick={onToggle}
        tabIndex={showPlay ? undefined : -1}
        aria-hidden={showPlay ? undefined : true}
      >
        <span className="sr-only">{playLabel}</span>
      </button>

      <div className="ls-paths-controls">
        {!showPlay && (
          <button
            type="button"
            className="ls-paths-control"
            onClick={phase === "ended" ? onReplay : onToggle}
            aria-label={phase === "playing" ? "Pause" : phase === "paused" ? "Play" : "Replay"}
            title={phase === "playing" ? "Pause" : phase === "paused" ? "Play" : "Replay"}
          >
            {phase === "playing" ? (
              <Pause fill="currentColor" strokeWidth={0} aria-hidden="true" />
            ) : phase === "paused" ? (
              <Play fill="currentColor" strokeWidth={0} aria-hidden="true" />
            ) : (
              <RotateCcw aria-hidden="true" />
            )}
          </button>
        )}
        {!audioFailed && (
          <button
            type="button"
            className="ls-paths-control"
            onClick={onToggleMuted}
            aria-pressed={!muted}
            aria-label="Sound"
            title={muted ? "Turn sound on" : "Turn sound off"}
          >
            {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
          </button>
        )}
        <button
          type="button"
          className="ls-paths-control"
          onClick={onToggleCaptions}
          aria-pressed={captions}
          aria-label="Captions"
          title={captions ? "Turn captions off" : "Turn captions on"}
        >
          {captions ? <Captions aria-hidden="true" /> : <CaptionsOff aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
