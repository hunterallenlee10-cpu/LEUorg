import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

/**
 * The site's three faces, self-hosted by next/font (the CSP in
 * next.config.mjs allows fonts from 'self' only).
 *
 * - Display: Archivo at its narrowest width (62.5) and heaviest weight
 *   (900), for the big all-caps headlines (`--font-display`). It is one
 *   static instance cut from the Archivo variable font and subset to Latin
 *   (lib/fonts/, 10 KB, SIL Open Font License: lib/fonts/OFL-Archivo.txt),
 *   because the full variable font is 89 KB and the hero headline, the
 *   homepage's largest paint, waits for it.
 * - Body: Geist, as before the redesign.
 * - Mono: Geist Mono, for the widely tracked eyebrows and stat labels.
 */
export const displayFont = localFont({
  src: "./fonts/ArchivoExtraCondensed-Black.woff2",
  weight: "900",
  style: "normal",
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});

export const bodyFont = Geist({
  subsets: ["latin"],
  variable: "--font-body",
});

export const monoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-ds",
  display: "swap",
  preload: false,
});
