import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Link-preview images: 1200x630 PNGs drawn at build time with `next/og`, so
 * the wording stays in code beside the pages it describes. Each route's
 * `opengraph-image.tsx` calls a renderer with its own line. The Lee Systems
 * Co. pages use lib/lee-systems-og.tsx; the LEU pages (the homepage, which
 * every page without its own image inherits, and Business Mastery) use
 * `renderLeuOg` below.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogDomain = "leeenterprisesunlimited.net";

/** The full LEU logo, read once per build from public/ (512x512). */
const leuLogo = readFile(join(process.cwd(), "public/logos/leu-logo.png"), "base64").then(
  (data) => `data:image/png;base64,${data}`
);

/**
 * Black and gold: the LEU logo, an optional name beside it, the page's
 * headline, and the company name and domain along the foot.
 */
export async function renderLeuOg({
  line,
  label,
  domain = ogDomain,
}: {
  line: string;
  label?: string;
  /** The address along the foot; Business Mastery passes its subdomain. */
  domain?: string;
}) {
  const logoSrc = await leuLogo;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(circle at 88% 0%, rgba(157, 187, 240, 0.2) 0%, rgba(157, 187, 240, 0) 55%)",
          color: "#F9FBFC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og draws <img>, not next/image */}
          <img src={logoSrc} width={132} height={132} alt="" />
          {label && (
            <div
              style={{
                display: "flex",
                fontSize: 40,
                fontWeight: 700,
                color: "#9DBBF0",
              }}
            >
              {label}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {line}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#A3A3A3",
          }}
        >
          <span>Lee Enterprises Unlimited</span>
          <span style={{ color: "#9DBBF0" }}>{domain}</span>
        </div>
      </div>
    ),
    ogSize
  );
}
