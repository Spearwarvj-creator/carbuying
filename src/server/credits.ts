import { AiError } from "./ai";

/**
 * Daily AI credits. Every AI use costs credits, each visitor gets a daily allowance, and the whole service has a
 * daily ceiling that caps the spend. A visitor is an address turned into a one-way hash that changes each day, so
 * the count can be kept without keeping who they are. The count lives in Upstash Redis when it is set up and in
 * this server's memory otherwise. A boost code, given by hand to someone who asks, adds to that visitor's day.
 */
export type Feature = "photo" | "explain" | "draft" | "practice";

/** What one use costs, in credits. A photo is one credit per image because reading an image costs the most. */
export const CREDIT_COST: Record<Feature, number> = { photo: 2, explain: 1, draft: 1, practice: 1 };

export interface Credits {
  limit: number;
  used: number;
  left: number;
  /** When the count starts again, as an ISO time (midnight UTC). */
  resetsAt: string;
}

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 && v !== undefined && v !== "" ? n : fallback;
};
export const dailyCredits = () => num(process.env.DAILY_CREDITS, 20);
export const globalCredits = () => num(process.env.GLOBAL_DAILY_CREDITS, 1000);
const BURST_PER_MINUTE = 8;

/** BOOST_CODES="friend:40,youtube:60" means the code "friend" adds 40 credits a day. Codes are compared exactly. */
export function boostFor(code: string | null | undefined): number {
  const c = (code ?? "").trim();
  if (!c || c.length > 40) return 0;
  for (const pair of (process.env.BOOST_CODES ?? "").split(",")) {
    const i = pair.lastIndexOf(":");
    if (i > 0 && pair.slice(0, i).trim() === c) return Math.max(0, Math.min(1000, Number(pair.slice(i + 1)) || 0));
  }
  return 0;
}

/**
 * The address a request came from, as the hosting platform reports it. The platform's own header comes first
 * because the first entry of x-forwarded-for can be written by the visitor. IPv6 addresses are grouped by their
 * first 64 bits, so one person cannot dodge the count by changing the tail of the address.
 */
export function visitorOf(headers: Headers): string {
  const raw =
    headers.get("x-vercel-forwarded-for") ??
    headers.get("cf-connecting-ip") ??
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0] ??
    "local";
  const ip = raw.trim().toLowerCase();
  if (ip.includes(":") && !ip.includes(".")) return ip.split(":").slice(0, 4).join(":");
  return ip || "local";
}

const dayOf = (now: Date) => now.toISOString().slice(0, 10);
const resetOf = (now: Date) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString();
const credits = (used: number, limit: number, now: Date): Credits => ({ limit, used, left: Math.max(0, limit - used), resetsAt: resetOf(now) });

const perVisitor = new Map<string, { day: string; n: number }>();
let globalUsed = { day: "", n: 0 };
const bursts = new Map<string, number[]>();

/** Memory side of the count. Used on its own without Redis, and as the fallback when Redis cannot be reached. */
function memoryTake(visitor: string, cost: number, boost: number, now: Date): Credits {
  // `visitor` here is already the day's one-way hash, never the address.
  const day = dayOf(now);
  const mine = perVisitor.get(visitor);
  const used = mine && mine.day === day ? mine.n : 0;
  const g = globalUsed.day === day ? globalUsed.n : 0;
  const limit = dailyCredits() + boost;
  if (used + cost > limit || g + cost > globalCredits()) throw new AiError("The daily limit is reached", "limit");
  perVisitor.set(visitor, { day, n: used + cost });
  globalUsed = { day, n: g + cost };
  if (perVisitor.size > 5000) for (const [k, v] of perVisitor) if (v.day !== day) perVisitor.delete(k);
  return credits(used + cost, limit, now);
}

const memoryPeek = (visitor: string, boost: number, now: Date): Credits => {
  const mine = perVisitor.get(visitor);
  return credits(mine && mine.day === dayOf(now) ? mine.n : 0, dailyCredits() + boost, now);
};

/** Values pasted into a dashboard can carry quote marks or spaces around them; they are not part of the value. */
const clean = (v: string | undefined) => (v ?? "").trim().replace(/^["']|["']$/g, "").trim();

const upstash = () => {
  const url = clean(process.env.UPSTASH_REDIS_REST_URL);
  const token = clean(process.env.UPSTASH_REDIS_REST_TOKEN);
  return /^https:\/\//i.test(url) && token ? { url: url.replace(/\/$/, ""), token } : null;
};

async function dayHash(text: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
  return Array.from(bytes.slice(0, 10), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function keys(visitor: string, now: Date) {
  const day = dayOf(now);
  return { v: `dd:${day}:c:${await dayHash(`${day}:${visitor}`)}`, all: `dd:${day}:all` };
}

type Cmd = (string | number)[];
const pipeline = async (store: { url: string; token: string }, commands: Cmd[], fetcher: typeof fetch) => {
  try {
    const res = await fetcher(`${store.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${store.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
    return res.ok ? ((await res.json()) as { result?: unknown }[]) : null;
  } catch {
    return null;
  }
};

export interface TakeArgs {
  feature: Feature;
  units?: number;
  visitor: string;
  boost?: number;
  now?: Date;
  fetcher?: typeof fetch;
}

/** Stops a visitor who sends many requests at once. Kept in memory: it only has to stop a burst, not count a day. */
export function checkBurst(visitor: string, now = new Date()): void {
  const t = now.getTime();
  const recent = (bursts.get(visitor) ?? []).filter((x) => t - x < 60_000);
  if (recent.length >= BURST_PER_MINUTE) throw new AiError("Too many requests in a row", "burst");
  bursts.set(visitor, [...recent, t]);
  if (bursts.size > 5000) for (const [k, v] of bursts) if (!v.some((x) => t - x < 60_000)) bursts.delete(k);
}

/** Counts one use against the visitor's day and the service's day, and says what is left. Throws when it would pass either. */
export async function takeCredits({ feature, units = 1, visitor, boost = 0, now = new Date(), fetcher = fetch }: TakeArgs): Promise<Credits> {
  const cost = CREDIT_COST[feature] * units;
  const store = upstash();
  const k = await keys(visitor, now);
  if (!store) return memoryTake(k.v, cost, boost, now);
  const out = await pipeline(store, [["INCRBY", k.v, cost], ["EXPIRE", k.v, 172800], ["INCRBY", k.all, cost], ["EXPIRE", k.all, 172800]], fetcher);
  const v = out?.[0]?.result;
  const g = out?.[2]?.result;
  if (typeof v !== "number" || typeof g !== "number") return memoryTake(k.v, cost, boost, now);
  const limit = dailyCredits() + boost;
  if (v > limit || g > globalCredits()) {
    // Give the use back, so a refused try does not count against the visitor or the service.
    void pipeline(store, [["DECRBY", k.v, cost], ["DECRBY", k.all, cost]], fetcher);
    throw new AiError("The daily limit is reached", "limit");
  }
  return credits(v, limit, now);
}

/** Gives credits back when the visitor got nothing for them (the model failed, or the plain text was shown). */
export async function refundCredits({ feature, units = 1, visitor, now = new Date(), fetcher = fetch }: TakeArgs): Promise<void> {
  const cost = CREDIT_COST[feature] * units;
  const store = upstash();
  const k = await keys(visitor, now);
  if (!store) {
    const mine = perVisitor.get(k.v);
    if (mine && mine.day === dayOf(now)) perVisitor.set(k.v, { day: mine.day, n: Math.max(0, mine.n - cost) });
    if (globalUsed.day === dayOf(now)) globalUsed = { day: globalUsed.day, n: Math.max(0, globalUsed.n - cost) };
    return;
  }
  await pipeline(store, [["DECRBY", k.v, cost], ["DECRBY", k.all, cost]], fetcher);
}

/** What the visitor has left today, without using any. */
export async function peekCredits({ visitor, boost = 0, now = new Date(), fetcher = fetch }: Pick<TakeArgs, "visitor" | "boost" | "now" | "fetcher">): Promise<Credits> {
  const store = upstash();
  const k = await keys(visitor, now);
  if (!store) return memoryPeek(k.v, boost, now);
  const out = await pipeline(store, [["GET", k.v]], fetcher);
  const raw = out?.[0]?.result;
  if (raw === undefined) return memoryPeek(k.v, boost, now);
  return credits(Number(raw) || 0, dailyCredits() + boost, now);
}
