// Draws the app icons from the site icon (src/app/icon.svg). Run once: node scripts/make-icons.mjs
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const svg = await readFile(new URL("../src/app/icon.svg", import.meta.url), "utf8");
const inner = svg.replace(/^[\s\S]*?<rect width="64" height="64" rx="14" fill="#0e1a1f"\/>/, "").replace(/<\/svg>\s*$/, "");

// Round-cornered icon for browsers and the home screen list.
const rounded = (size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
// Full-bleed square with the picture inside the safe circle, for launchers that crop to their own shape.
const maskable = async (size) => {
  const art = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0e1a1f"/><g transform="translate(9.6 13.4) scale(0.7)">${inner}</g></svg>`;
  return sharp(Buffer.from(art)).resize(size, size).png().toBuffer();
};
// Apple draws its own corners, so the icon is square and full-bleed.
const apple = async () => {
  const art = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0e1a1f"/>${inner}</svg>`;
  return sharp(Buffer.from(art)).resize(180, 180).png().toBuffer();
};

await writeFile(new URL("../public/icons/icon-192.png", import.meta.url), await rounded(192));
await writeFile(new URL("../public/icons/icon-512.png", import.meta.url), await rounded(512));
await writeFile(new URL("../public/icons/maskable-512.png", import.meta.url), await maskable(512));
await writeFile(new URL("../public/icons/apple-touch-icon.png", import.meta.url), await apple());
console.log("icons written");
