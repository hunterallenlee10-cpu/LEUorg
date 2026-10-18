import { ImageResponse } from "next/og";
import { leeSystems } from "@/data/lee-systems";
import { ogContentType, ogDomain, ogSize } from "@/lib/og";

/**
 * The social-sharing card for the LEU pages, drawn at build time
 * with `next/og` rather than shipped as a PNG so the wording stays in code
 * next to the pages it describes. Each route segment's `opengraph-image.tsx`
 * calls this with its own line.
 *
 * The name alone, set as a wordmark: LEU has no logo (the owner's
 * call, 2026-09-28), so the "LS" stand-in square that used to sit beside it is
 * gone. The foot names the parent company and the domain; no location.
 */
export { ogContentType, ogSize };

export function renderLeeSystemsOg(line: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0F0F0F",
          color: "#F9FBFC",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 6,
            color: "#F9FBFC",
          }}
        >
          LEE ENTERPRISES UNLIMITED
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 980,
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
          <span>Built personally for you</span>
          <span style={{ color: "#9DBBF0" }}>{ogDomain}</span>
        </div>
      </div>
    ),
    ogSize
  );
}
