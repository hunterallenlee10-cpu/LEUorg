import { ogContentType, ogSize, renderLeuOg } from "@/lib/og";
import { marylandLabel } from "@/data/maryland-page";

export const alt = "Best Website Designer in Maryland: Hunter Lee, Lee Enterprises Unlimited (LEU)";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderLeuOg({ line: marylandLabel, label: "Hunter Lee · LEU" });
}
