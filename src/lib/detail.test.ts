import { describe, expect, it } from "vitest";
import { moneyFor } from "./detail";

describe("moneyFor", () => {
  it("rounds to whole dollars in the simple view and keeps cents in the full view", () => {
    expect(moneyFor("simple", 52360)).toBe("$524");
    expect(moneyFor("full", 52360)).toBe("$523.60");
    expect(moneyFor("simple", 4689824)).toBe("$46,898");
    expect(moneyFor("full", 4689824)).toBe("$46,898.24");
  });
  it("signs changes", () => {
    expect(moneyFor("simple", 553880, true)).toBe("+$5,539");
    expect(moneyFor("simple", -11672, true)).toBe("-$117");
    expect(moneyFor("full", 0, true)).toBe("$0.00");
  });
});
