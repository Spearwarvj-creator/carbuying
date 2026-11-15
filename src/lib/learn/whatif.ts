import { computeDeal, formatCents, formatWhole, type Offer } from "@/engine";

/**
 * What the same deal would look like if one thing changed: a shorter or longer loan, no extras, a bit more down. The
 * calculator works each one out, so a question such as "what would 60 months change?" can be answered with real figures
 * instead of a guess. Sent with the deal as facts the AI may use. Words only here, in English, as plain facts.
 */
export function whatIfs(o: Offer): { text: string; figures: number[] } {
  if (o.price <= 0) return { text: "", figures: [] };
  const d = computeDeal(o);
  if (d.fin <= 0) return { text: "", figures: [] };
  const lines: string[] = [];
  for (const months of [48, 60, 72, 84]) {
    if (months === o.months) continue;
    const a = computeDeal({ ...o, months });
    const diff = a.totalCents - d.totalCents;
    lines.push(`At ${months} months: payment ${formatCents(a.payCents)}, total ${formatWhole(a.total)} (${formatWhole(Math.abs(diff) / 100)} ${diff >= 0 ? "more" : "less"} than now).`);
  }
  if (o.addons > 0) {
    const a = computeDeal({ ...o, addons: 0 });
    lines.push(`Without the extras: payment ${formatCents(a.payCents)}, total ${formatWhole(a.total)} (${formatWhole((d.totalCents - a.totalCents) / 100)} less).`);
  }
  const more = computeDeal({ ...o, down: o.down + 1000 });
  lines.push(`With $1,000 more down: payment ${formatCents(more.payCents)}, total ${formatWhole(more.total)}.`);
  const text = `If one thing changed: ${lines.join(" ")}`;
  return { text, figures: [...text.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((m) => Number(m[0].replace(/,/g, ""))) };
}
