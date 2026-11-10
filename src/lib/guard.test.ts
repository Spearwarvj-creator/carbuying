import { describe, expect, it } from "vitest";
import { allowedFrom, figuresIn, numbersAreAllowed } from "./guard";

describe("numbers guard", () => {
  it("passes text whose figures are all on the list", () => {
    expect(numbersAreAllowed("The payment is $639.32 for 60 months at 7.9%.", [639.32, 60, 7.9])).toBe(true);
  });
  it("blocks a figure the calculator did not give", () => {
    expect(numbersAreAllowed("The payment is $620 a month.", [639.32])).toBe(false);
  });
  it("lets small plain counts through", () => expect(numbersAreAllowed("Ask 2 questions in step 3.", [])).toBe(true));
  it("blocks a small percent that is not on the list", () => expect(numbersAreAllowed("About 5% is interest.", [18])).toBe(false));
  it("accepts rounding to the dollar", () => expect(numbersAreAllowed("About $3,968 less.", [3967.7])).toBe(true));
  it("reads dollars, commas and percents", () => {
    expect(figuresIn("$31,500 and 7.9% over 60").map((f) => f.value)).toEqual([31500, 7.9, 60]);
  });
  it("builds a list from fixed text", () => expect(allowedFrom("Take $3,967 off, to $27,533.")).toEqual([3967, 27533]));
});
