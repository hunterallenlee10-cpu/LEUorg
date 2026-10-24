"use client";

import { useSyncExternalStore } from "react";

/**
 * Small browser-state hooks for the demos and previews, read through
 * useSyncExternalStore so they are correct on the first client render and
 * follow changes live. The server value is the cautious one: no reduced
 * motion known yet, and the page counted as visible.
 */

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** True when the visitor asked for reduced motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false
  );
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** False while the browser tab is hidden, so timers can stop. */
export function usePageVisible(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true
  );
}

interface NetworkInformationLike {
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
}

function connection(): NetworkInformationLike | undefined {
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

function subscribeSaveData(onChange: () => void) {
  const info = connection();
  info?.addEventListener?.("change", onChange);
  return () => info?.removeEventListener?.("change", onChange);
}

/** True when the browser asks for less data (Data Saver), so videos hold their still. */
export function useSaveData(): boolean {
  return useSyncExternalStore(
    subscribeSaveData,
    () => Boolean(connection()?.saveData),
    () => false
  );
}
