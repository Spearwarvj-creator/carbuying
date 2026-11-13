import { afterEach, describe, expect, it, vi } from "vitest";
import { AiError } from "./ai";
import { boostFor, checkBurst, CREDIT_COST, peekCredits, refundCredits, takeCredits, visitorOf } from "./credits";

afterEach(() => vi.unstubAllEnvs());

/** A tiny stand-in for Upstash's pipeline endpoint that counts like Redis does. */
function fakeRedis() {
  const store = new Map<string, number>();
  const calls: unknown[][] = [];
  const fetcher = (async (_url: string, init: RequestInit) => {
    const commands = JSON.parse(String(init.body)) as (string | number)[][];
    calls.push(commands);
    const out = commands.map(([op, key, n]) => {
      if (op === "INCRBY") store.set(String(key), (store.get(String(key)) ?? 0) + Number(n));
      if (op === "DECRBY") store.set(String(key), (store.get(String(key)) ?? 0) - Number(n));
      return { result: op === "EXPIRE" ? 1 : (store.get(String(key)) ?? null) };
    });
    return new Response(JSON.stringify(out));
  }) as unknown as typeof fetch;
  return { fetcher, store, calls };
}
const redisOn = () => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "t");
};

describe("credits in memory", () => {
  it("gives each visitor a daily allowance, then stops", async () => {
    const day = new Date("2026-11-09T12:00:00Z");
    for (let i = 0; i < 20; i++) await takeCredits({ feature: "explain", visitor: "a", now: day });
    await expect(takeCredits({ feature: "explain", visitor: "a", now: day })).rejects.toMatchObject({ kind: "limit" });
    await expect(takeCredits({ feature: "explain", visitor: "b", now: day })).resolves.toMatchObject({ left: 19 });
  });
  it("charges a photo read by the image", async () => {
    const day = new Date("2026-11-09T12:00:00Z");
    const c = await takeCredits({ feature: "photo", units: 4, visitor: "c", now: day });
    expect(c.used).toBe(4 * CREDIT_COST.photo);
    expect(c.left).toBe(20 - 8);
    await takeCredits({ feature: "photo", units: 4, visitor: "c", now: day });
    await expect(takeCredits({ feature: "photo", units: 4, visitor: "c", now: day })).rejects.toBeInstanceOf(AiError);
  });
  it("starts again the next day and says when", async () => {
    for (let i = 0; i < 20; i++) await takeCredits({ feature: "draft", visitor: "d", now: new Date("2026-11-10T01:00:00Z") });
    const next = await takeCredits({ feature: "draft", visitor: "d", now: new Date("2026-11-11T01:00:00Z") });
    expect(next.left).toBe(19);
    expect(next.resetsAt).toBe("2026-11-12T00:00:00.000Z");
  });
  it("gives credits back and lets a boost code raise the allowance", async () => {
    vi.stubEnv("BOOST_CODES", "friend:30,yt:60");
    expect(boostFor("friend")).toBe(30);
    expect(boostFor("nope")).toBe(0);
    expect(boostFor("")).toBe(0);
    const day = new Date("2026-11-12T12:00:00Z");
    const c = await takeCredits({ feature: "photo", visitor: "e", now: day, boost: boostFor("friend") });
    expect(c.limit).toBe(50);
    await refundCredits({ feature: "photo", visitor: "e", now: day });
    expect((await peekCredits({ visitor: "e", now: day })).used).toBe(0);
  });
  it("stops the whole service at its daily ceiling", async () => {
    vi.stubEnv("GLOBAL_DAILY_CREDITS", "3");
    const day = new Date("2026-11-14T12:00:00Z");
    for (const v of ["g1", "g2", "g3"]) await takeCredits({ feature: "explain", visitor: v, now: day });
    await expect(takeCredits({ feature: "explain", visitor: "g4", now: day })).rejects.toMatchObject({ kind: "limit" });
  });
  it("slows a burst of requests", () => {
    const t = new Date("2026-11-15T12:00:00Z");
    for (let i = 0; i < 8; i++) checkBurst("burst", t);
    expect(() => checkBurst("burst", t)).toThrow(expect.objectContaining({ kind: "burst" }));
    expect(() => checkBurst("burst", new Date(t.getTime() + 61_000))).not.toThrow();
  });
});

describe("credits with Redis", () => {
  it("counts across calls, stops at the allowance, and gives a refused use back", async () => {
    redisOn();
    const { fetcher, store } = fakeRedis();
    const day = new Date("2026-11-09T12:00:00Z");
    for (let i = 0; i < 20; i++) await takeCredits({ feature: "explain", visitor: "1.2.3.4", now: day, fetcher });
    await expect(takeCredits({ feature: "explain", visitor: "1.2.3.4", now: day, fetcher })).rejects.toBeInstanceOf(AiError);
    await new Promise((r) => setTimeout(r, 0));
    const visitorKey = [...store.keys()].find((k) => k.includes(":c:"))!;
    expect(store.get(visitorKey)).toBe(20);
    await expect(takeCredits({ feature: "explain", visitor: "5.6.7.8", now: day, fetcher })).resolves.toMatchObject({ left: 19 });
  });
  it("never stores the visitor's address", async () => {
    redisOn();
    const { fetcher, calls } = fakeRedis();
    await takeCredits({ feature: "explain", visitor: "203.0.113.9", now: new Date("2026-11-09T12:00:00Z"), fetcher });
    await peekCredits({ visitor: "203.0.113.9", now: new Date("2026-11-09T12:00:00Z"), fetcher });
    expect(JSON.stringify(calls)).not.toContain("203.0.113.9");
  });
  it("reads what is left without using any", async () => {
    redisOn();
    const { fetcher } = fakeRedis();
    const day = new Date("2026-11-09T12:00:00Z");
    await takeCredits({ feature: "practice", visitor: "p", now: day, fetcher });
    expect((await peekCredits({ visitor: "p", now: day, fetcher })).left).toBe(19);
    expect((await peekCredits({ visitor: "p", now: day, fetcher })).left).toBe(19);
  });
  it("falls back to the memory count when Redis does not answer", async () => {
    redisOn();
    const down = (async () => new Response("no", { status: 500 })) as unknown as typeof fetch;
    const day = new Date("2026-11-12T12:00:00Z");
    for (let i = 0; i < 20; i++) await takeCredits({ feature: "explain", visitor: "fallback-visitor", now: day, fetcher: down });
    await expect(takeCredits({ feature: "explain", visitor: "fallback-visitor", now: day, fetcher: down })).rejects.toBeInstanceOf(AiError);
  });
});

describe("visitorOf", () => {
  const h = (o: Record<string, string>) => new Headers(o);
  it("prefers the platform's own header over one the visitor can write", () => {
    expect(visitorOf(h({ "x-vercel-forwarded-for": "9.9.9.9", "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe("9.9.9.9");
    expect(visitorOf(h({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe("1.1.1.1");
    expect(visitorOf(h({}))).toBe("local");
  });
  it("groups an IPv6 address by its first 64 bits", () => {
    expect(visitorOf(h({ "x-real-ip": "2001:db8:1:2:aaaa:bbbb:cccc:dddd" }))).toBe(visitorOf(h({ "x-real-ip": "2001:db8:1:2:1:2:3:4" })));
  });
});
