/**
 * Builds the Spanish review packet. For every English and Spanish pair in docs/es-review/items.json (made by
 * `ES_EXPORT=1 npx vitest run src/data/learn/es-export.test.ts`):
 *   1. a model from another maker translates the Spanish back into English, without seeing the original (back-translation);
 *   2. a second model compares the original, the Spanish and the back-translation and scores how well the meaning held;
 *   3. everything is written to docs/es-review/review-packet.csv with empty columns for the human reviewer.
 * This is a screening step. It finds drift for a bilingual reviewer to look at first; it does not replace the reviewer.
 *
 * Usage: node scripts/es-review.mjs        (reads OPENROUTER_API_KEY from .env.local)
 */
import fs from "fs";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => l.split(/=(.*)/s).slice(0, 2)),
);
const KEY = env.OPENROUTER_API_KEY;
if (!KEY) throw new Error("OPENROUTER_API_KEY is not set in .env.local");

const BACK = "google/gemini-2.5-flash";
const JUDGE = "anthropic/claude-haiku-5.5";
const BATCH = 20;

async function chat(model, system, user, maxTokens = 3500) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, temperature: 0, max_tokens: maxTokens, reasoning: { enabled: false }, usage: { include: true }, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    });
    if (r.ok) {
      const j = await r.json();
      return { text: j.choices?.[0]?.message?.content ?? "", cost: j.usage?.cost ?? 0 };
    }
    await new Promise((res) => setTimeout(res, 1500 * (attempt + 1)));
  }
  throw new Error("model did not answer");
}

const json = (text) => {
  const a = text.indexOf("[");
  const b = text.lastIndexOf("]");
  return JSON.parse(text.slice(a, b + 1));
};

const items = JSON.parse(fs.readFileSync("docs/es-review/items.json", "utf8"));
const batches = [];
for (let i = 0; i < items.length; i += BATCH) batches.push(items.slice(i, i + BATCH));

let cost = 0;
const out = new Array(items.length);

async function run(bi) {
  const batch = batches[bi];
  const base = bi * BATCH;
  // 1. back-translation, from the Spanish alone
  const back = await chat(BACK, 'You translate Spanish into plain English, as literally as sensible. Keep every number, dollar amount, percent and placeholder such as ⟦1⟧ exactly. Reply with only a JSON array of strings, one per input, in the same order.', JSON.stringify(batch.map((x) => x.es)));
  cost += back.cost;
  let backs;
  try {
    backs = json(back.text);
  } catch {
    backs = batch.map(() => "");
  }
  // 2. judge
  const payload = batch.map((x, i) => ({ n: i, english_original: x.en, spanish: x.es, back_translation: backs[i] ?? "" }));
  const judged = await chat(
    JUDGE,
    `You check a Spanish translation of car-buying text for people in the United States who have never bought a car. For each item compare english_original with back_translation (the Spanish translated back by someone who never saw the original). Score 5 meaning identical in meaning, tone and every figure; 4 small wording differences that do not change meaning; 3 a nuance or a term that could mislead; 2 a real change in meaning; 1 wrong. Also flag: a figure that differs, a register that is not polite "usted", a term a United States Spanish reader would not know, or a regional word that may confuse. Text such as ⟦1⟧ is a placeholder for a figure filled in later: it must appear in the Spanish with the same number, and a sentence that is only a template is judged on its wording. Never score down the word "undefined" or a placeholder. Reply with only a JSON array of {"n": number, "score": number, "issue": string}. Use an empty string for issue when the score is 5.`,
    JSON.stringify(payload),
  );
  cost += judged.cost;
  let scores;
  try {
    scores = json(judged.text);
  } catch {
    scores = [];
  }
  batch.forEach((x, i) => {
    const s = scores.find((y) => y.n === i);
    out[base + i] = { ...x, back: backs[i] ?? "", score: s?.score ?? "", issue: s?.issue ?? "" };
  });
  process.stdout.write(`batch ${bi + 1}/${batches.length}\r`);
}

const queue = batches.map((_, i) => i);
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) await run(queue.shift());
  }),
);

const esc = (v) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
const rows = [["id", "group", "english", "spanish", "back_translation", "screen_score", "screen_issue", "reviewer_status", "reviewer_comment", "reviewer_fix"].map(esc).join(",")];
for (const r of out) rows.push([r.id, r.group, r.en, r.es, r.back, r.score, r.issue, "", "", ""].map(esc).join(","));
fs.writeFileSync("docs/es-review/review-packet.csv", rows.join("\n"));

const scored = out.filter((r) => typeof r.score === "number");
const hist = {};
for (const r of scored) hist[r.score] = (hist[r.score] ?? 0) + 1;
const low = out.filter((r) => typeof r.score === "number" && r.score <= 4).map((r) => ({ id: r.id, group: r.group, score: r.score, english: r.en, spanish: r.es, back: r.back, issue: r.issue }));
fs.writeFileSync("docs/es-review/screen-findings.json", JSON.stringify({ items: out.length, scored: scored.length, histogram: hist, cost: Number(cost.toFixed(4)), findings: low }, null, 1));
console.log(`\n${out.length} items, ${scored.length} scored, histogram`, hist, `cost $${cost.toFixed(4)}, ${low.length} to look at`);
