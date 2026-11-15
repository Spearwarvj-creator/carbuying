/**
 * A model-proxy check on the Learn drawings: does a vision model, shown each drawing with no name, say what it shows
 * (open question) and pick it from the list of all 26 (multiple choice)? It finds drawings that are unclear before
 * a person is asked. It is NOT a substitute for the moderated test in docs/LEARN_USER_TEST_KIT.md: a model is not a
 * 62-year-old buying a first car.
 *
 * Export each drawing to PNG first (for example 256 px square, white background), named after its key.
 * Usage: node scripts/recognize-art.mjs <folder>     (reads OPENROUTER_API_KEY from .env.local)
 */
import fs from "fs";
const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split("\n").filter(Boolean).map((l) => l.split(/=(.*)/s).slice(0, 2)));
const D = process.argv[2];
if (!D) throw new Error("Usage: node scripts/recognize-art.mjs <folder of PNGs named after each drawing, for example menu.png>");

// The everyday thing each drawing is meant to show. These are the choices in the multiple choice round.
const MEANT = {
  menu: "a restaurant menu with prices",
  receipt: "a shopping receipt with a total",
  package: "a delivery box being shipped",
  keys: "a key",
  fineprint: "a document with a magnifying glass over the small print",
  recall: "a warning sign",
  scale: "a balance scale weighing two things",
  fingerprint: "a fingerprint on an ID card",
  phone: "a smartphone with a check mark",
  umbrella: "an umbrella protecting from rain",
  coupon: "a discount coupon ticket",
  friend: "two people passing money to each other, as a loan",
  piggy: "a piggy bank with a coin going in",
  pizza: "a pizza with one slice taken out",
  seesaw: "a seesaw with a small weight on one side and a big weight on the other",
  coffee: "a cup of coffee with a row of monthly dots (a subscription)",
  report: "a school report card with grades",
  handshake: "two people agreeing over a signed paper",
  calendar: "a calendar with a day circled",
  gym: "a dumbbell, a gym membership that renews",
  stairs: "a staircase going up",
  melt: "a melting ice cream cone",
  swap: "two arrows swapping or exchanging",
  ladder: "a ladder with a marker at the top",
  rent: "an apartment building with a for rent sign",
  fuel: "a gas pump",
};
const keys = Object.keys(MEANT);
const choices = keys.map((k, i) => `${i + 1}. ${MEANT[k]}`).join("\n");

async function ask(file, content) {
  const url = "data:image/png;base64," + fs.readFileSync(`${D}/${file}.png`).toString("base64");
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + env.OPENROUTER_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "anthropic/claude-haiku-5.5", temperature: 0, max_tokens: 40, reasoning: { enabled: false }, usage: { include: true }, messages: [{ role: "user", content: [{ type: "text", text: content }, { type: "image_url", image_url: { url } }] }] }),
  });
  const j = await r.json();
  return { text: j.choices?.[0]?.message?.content?.trim() ?? "", cost: j.usage?.cost ?? 0 };
}

let right = 0, total = 0, cost = 0;
const rows = [];
for (const k of keys) {
  const open = await ask(k, "This is a simple icon-style drawing used in a car-buying app to explain a word through an everyday comparison. In at most seven words, what everyday thing or scene does it show?");
  const mc = await ask(k, `Which one best describes this simple drawing? Reply with just the number, nothing else.\n${choices}`);
  const n = parseInt(mc.text, 10);
  const ok = keys[n - 1] === k;
  total++;
  if (ok) right++;
  cost += open.cost + mc.cost;
  rows.push({ k, ok, open: open.text, picked: keys[n - 1] ?? mc.text });
  console.log((ok ? "PASS " : "FAIL ") + k.padEnd(12), "| open:", open.text, "| picked:", keys[n - 1] ?? mc.text);
}
console.log(`\nMultiple choice: ${right}/${total} (${Math.round((right / total) * 100)}%). Cost $${cost.toFixed(4)}`);
fs.writeFileSync(D + "/recognition.json", JSON.stringify(rows, null, 2));
