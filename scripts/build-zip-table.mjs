// Builds src/data/zip-state.json from the zipcodes package (BSD licence).
// Each ZIP maps to "ST|City". The file loads only when a buyer types a ZIP,
// and the lookup runs on the device, so the ZIP never leaves it.
//
//   npm run build:zip
import { createRequire } from "node:module";
import { writeFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const zipcodes = require("zipcodes");
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "src", "data", "zip-state.json");

const table = {};
for (const zip of Object.keys(zipcodes.codes).sort()) {
  const row = zipcodes.codes[zip];
  if (!/^\d{5}$/.test(zip) || !row.state) continue;
  table[zip] = `${row.state}|${row.city}`;
}
writeFileSync(out, JSON.stringify(table));
const size = statSync(out).size;
const gz = gzipSync(readFileSync(out)).length;
console.log(`wrote ${Object.keys(table).length} ZIP codes, ${size} bytes, ${gz} bytes gzipped`);

const checks = { "30301": "GA|Atlanta", "90210": "CA|Beverly Hills", "10001": "NY|New York", "77001": "TX|Houston", "60601": "IL|Chicago", "99501": "AK|Anchorage" };
let failed = 0;
for (const [zip, want] of Object.entries(checks)) {
  const ok = table[zip] === want;
  if (!ok) failed++;
  console.log(zip, table[zip], ok ? "ok" : `EXPECTED ${want}`);
}
if (failed) process.exit(1);
