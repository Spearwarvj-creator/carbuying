// Builds src/engine/tests/fixtures/vin-nhtsa.json: 30 VINs and what NHTSA's vPIC
// service says about each check digit. Run it again to refresh the fixture.
//
//   node scripts/fetch-vin-fixtures.mjs
//
// The two sample VINs come from the plan. The other 28 are built from real
// manufacturer prefixes with filler characters, half with the right check digit
// (worked out with the local test) and half with a wrong one. NHTSA is the
// independent judge: we store its answer and the test compares ours to it.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { checkVin } from "../src/engine/vin.ts";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "src", "engine", "tests", "fixtures", "vin-nhtsa.json");

const PREFIXES = ["1HGCM826", "5YJ3E1EA", "1FTFW1ET", "JTDKB20U", "WBA3A5C5", "3VWDX7AJ", "1G1YY22G", "2T1BURHE", "KMHD35LE", "5NPE24AF", "1C4RJFAG", "JN1AZ4EH", "WVWZZZ1J", "4T1BF1FK"];

// Small seeded generator so the fixture is repeatable.
let s = 424242;
const rand = () => {
  s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
  return s / 4294967296;
};
const pick = (chars) => chars[Math.floor(rand() * chars.length)];

function build(prefix, wantCorrect, forceX) {
  for (let attempt = 0; attempt < 500; attempt++) {
    // Position 10 is the model year code, 11 the plant, 12 to 17 a serial number.
    // Keeping them realistic stops NHTSA rejecting the VIN for other reasons.
    let tail = pick("JKLMNPRS") + pick("ABCDEFGHJK");
    for (let i = 0; i < 6; i++) tail += pick("0123456789");
    const draft = prefix + "0" + tail; // 8 + 1 + 8 = 17
    const expected = checkVin(draft).expected;
    if (forceX && expected !== "X") continue;
    const digit = wantCorrect ? expected : pick("0123456789X".replace(expected, ""));
    return prefix + digit + tail;
  }
  throw new Error("could not build a VIN");
}

async function decode(vin) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${vin}`);
  const row = (await res.json()).Results[0];
  return { code: String(row.ErrorCode), text: String(row.ErrorText) };
}

// NHTSA lists error code 1 whenever the 9th character fails. A VIN it accepts
// on the check digit has no code 1 and none of the "unusable VIN" codes.
function verdict(code) {
  const codes = code.split(",").map((c) => c.trim());
  if (codes.includes("1")) return false;
  if (["6", "7", "11", "400"].some((c) => codes.includes(c))) return null;
  return true;
}

const rows = [];
const add = async (vin) => {
  const { code, text } = await decode(vin);
  const ok = verdict(code);
  if (ok === null) return false;
  rows.push({ vin, nhtsaErrorCode: code, nhtsaErrorText: text, nhtsaCheckDigitOk: ok });
  console.log(vin, code, ok ? "ok" : "bad");
  return true;
};

await add("1HGCM82633A004352");
await add("1HGCM82633A004353");
for (let i = 0; rows.length < 30; i++) {
  const prefix = PREFIXES[i % PREFIXES.length];
  const wantCorrect = rows.length % 2 === 0;
  const forceX = rows.length === 7; // one VIN whose correct check digit is X
  for (let attempt = 0; attempt < 30; attempt++) {
    if (await add(build(prefix, forceX ? true : wantCorrect, forceX))) break;
  }
}
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log("wrote", rows.length, "fixtures to", out);
