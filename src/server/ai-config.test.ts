import { afterEach, describe, expect, it, vi } from "vitest";
import { modelFrom, models } from "./ai";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("model names from the environment", () => {
  it("keeps a real OpenRouter name, even with quotes or spaces around it", () => {
    expect(modelFrom("anthropic/claude-haiku-5.5", "x/y", "V")).toBe("anthropic/claude-haiku-5.5");
    expect(modelFrom('  "google/gemini-2.5-flash-lite" ', "x/y", "V")).toBe("google/gemini-2.5-flash-lite");
    expect(modelFrom("~anthropic/claude-haiku-latest", "x/y", "V")).toBe("~anthropic/claude-haiku-latest");
    expect(modelFrom("anthropic/claude-haiku-5.5:batch", "x/y", "V")).toBe("anthropic/claude-haiku-5.5:batch");
  });

  it("ignores a display name such as 'Haiku 5.5' and uses the built-in model", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(modelFrom("Haiku 5.5", "anthropic/claude-haiku-5.5", "MODEL_VISION")).toBe("anthropic/claude-haiku-5.5");
    expect(log).toHaveBeenCalledOnce();
  });

  it("uses the built-in model when the value is empty", () => {
    expect(modelFrom(undefined, "a/b", "V")).toBe("a/b");
    expect(modelFrom("   ", "a/b", "V")).toBe("a/b");
  });

  it("models() falls back to the built-in names when the dashboard values are display names", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("MODEL_VISION", "Haiku 5.5");
    vi.stubEnv("MODEL_TEXT", "claude haiku");
    vi.stubEnv("MODEL_FALLBACK", "Gemini Flash");
    expect(models()).toEqual({ vision: "anthropic/claude-haiku-5.5", text: "anthropic/claude-haiku-5.5", fallback: "google/gemini-2.5-flash-lite" });
  });
});
