import { afterEach, describe, expect, it, vi } from "vitest";
import { AiError, takeSharedSlot } from "./ai";

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
      return { result: op === "EXPIRE" ? 1 : store.get(String(key)) };
    });
    return new Response(JSON.stringify(out));
  }) as unknown as typeof fetch;
  return { fetcher, store, calls };
}

describe("takeSharedSlot with Redis", () => {
  it("counts across calls, stops at the visitor's cap, and gives a refused use back", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "t");
    const { fetcher, store } = fakeRedis();
    const day = new Date("2026-11-09T12:00:00Z");
    for (let i = 0; i < 6; i++) await takeSharedSlot("photo", "1.2.3.4", 1, day, fetcher);
    await expect(takeSharedSlot("photo", "1.2.3.4", 1, day, fetcher)).rejects.toBeInstanceOf(AiError);
    await new Promise((r) => setTimeout(r, 0));
    const visitorKey = [...store.keys()].find((k) => k.includes(":v:"))!;
    expect(store.get(visitorKey)).toBe(6);
    // Another visitor is not affected.
    await expect(takeSharedSlot("photo", "5.6.7.8", 1, day, fetcher)).resolves.toBeUndefined();
  });

  it("never stores the visitor's address", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "t");
    const { fetcher, calls } = fakeRedis();
    await takeSharedSlot("explain", "203.0.113.9", 1, new Date("2026-11-09T12:00:00Z"), fetcher);
    expect(JSON.stringify(calls)).not.toContain("203.0.113.9");
  });

  it("falls back to the memory count when Redis does not answer", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "t");
    const down = (async () => new Response("no", { status: 500 })) as unknown as typeof fetch;
    const day = new Date("2026-11-12T12:00:00Z");
    for (let i = 0; i < 6; i++) await takeSharedSlot("photo", "fallback-visitor", 1, day, down);
    await expect(takeSharedSlot("photo", "fallback-visitor", 1, day, down)).rejects.toBeInstanceOf(AiError);
  });

  it("uses memory when Redis is not set up", async () => {
    const day = new Date("2026-11-13T12:00:00Z");
    for (let i = 0; i < 6; i++) await takeSharedSlot("photo", "memory-visitor", 1, day);
    await expect(takeSharedSlot("photo", "memory-visitor", 1, day)).rejects.toBeInstanceOf(AiError);
  });
});
