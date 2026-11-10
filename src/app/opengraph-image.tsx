import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Deal Desk: a lower payment can still cost you more.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The share card: the hero's road in miniature, with the same headline, in the site's own display face. */
export default async function Image() {
  const font = await readFile(join(process.cwd(), "node_modules/@fontsource/sofia-sans-extra-condensed/files/sofia-sans-extra-condensed-latin-800-normal.woff"));
  const rows = [3, 6, 9, 12];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0e1a1f", color: "#eaf2f0", fontFamily: "Sofia" }}>
        <div style={{ display: "flex", fontSize: 40, color: "#b4c8cc" }}>Deal Desk</div>
        <div style={{ display: "flex", fontSize: 128, lineHeight: 0.92, maxWidth: 980 }}>A lower payment can still cost you more.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((n, r) => (
            <div key={r} style={{ display: "flex", gap: 10 }}>
              {Array.from({ length: 12 }, (_, c) => (
                <div key={c} style={{ width: 82, height: 22, borderRadius: 6, background: c < n ? (r === 3 && c > 9 ? "#ff8a7a" : "#3987e5") : "#1c3038" }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Sofia", data: font, weight: 800, style: "normal" }] },
  );
}
