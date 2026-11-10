import { afterEach, describe, expect, it, vi } from "vitest";
import { draft, explain, practice } from "./language";

const reply = (content: string) => (async () => new Response(JSON.stringify({ choices: [{ message: { content } }] }))) as unknown as typeof fetch;
afterEach(() => vi.unstubAllEnvs());

const ctx = { topic: "docFee", question: "Do I have to pay this?", lang: "en" as const, context: "Fees are $900.", figures: [900] };

describe("explain", () => {
  it("shows the fixed text when no key is set", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    const a = await explain(ctx);
    expect(a.source).toBe("template");
    expect(a.text.length).toBeGreaterThan(10);
  });
  it("uses the model's words when its figures are the deal's", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    const a = await explain(ctx, { fetcher: reply("This is a fee of $900 for paperwork. Ask what it covers.") });
    expect(a).toEqual({ text: "This is a fee of $900 for paperwork. Ask what it covers.", source: "ai" });
  });
  it("throws the reply away if it brings a number of its own", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    const a = await explain(ctx, { fetcher: reply("The fee is $700 and you should refuse it.") });
    expect(a.source).toBe("template");
  });
  it("falls back to the fixed text when the model fails", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    expect((await explain(ctx, { fetcher: (async () => new Response("no", { status: 500 })) as unknown as typeof fetch })).source).toBe("template");
  });
});

describe("draft", () => {
  const text = "Could you take $3,967 off the price, to $27,533?";
  it("returns the text unchanged without a key", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    expect(await draft({ text, tone: "firm", lang: "en" })).toEqual({ text, source: "template" });
  });
  it("accepts a rewording that keeps every number", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    const a = await draft({ text, tone: "firm", lang: "en" }, { fetcher: reply("I am ready to buy today if you take $3,967 off, to $27,533.") });
    expect(a.source).toBe("ai");
  });
  it("rejects a rewording that drops or changes a number", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    expect((await draft({ text, tone: "short", lang: "en" }, { fetcher: reply("Take $3,000 off.") })).source).toBe("template");
    expect((await draft({ text, tone: "short", lang: "en" }, { fetcher: reply("Take off some money.") })).source).toBe("template");
  });
});

describe("practice", () => {
  const input = { lang: "en" as const, messages: [{ role: "user" as const, content: "Can I see the total in writing?" }], summary: "Payment $639.32 for 60 months. Total $41,359.", figures: [639.32, 60, 41359] };
  it("needs a key", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    await expect(practice(input)).rejects.toMatchObject({ kind: "not-configured" });
  });
  it("plays the manager with the deal's numbers", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    expect((await practice(input, { fetcher: reply("Sure. The payment is $639.32 a month. Want to add our protection plan?") })).source).toBe("ai");
  });
  it("replaces a reply that invents a number", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    expect((await practice(input, { fetcher: reply("I can do $450 a month if you sign now.") })).source).toBe("template");
  });
});
