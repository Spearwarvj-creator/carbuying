import { describe, expect, it } from "vitest";
import { aprFromPayment, payment } from "../amortize";

describe("aprFromPayment", () => {
  it("recovers the rate a payment was made from", () => {
    for (const [p, apr, n] of [[31605, 7.9, 60], [18750, 0.01, 36], [44000, 12.99, 84], [9000, 24.5, 48]] as const) {
      expect(aprFromPayment(p, payment(p, apr, n), n)).toBeCloseTo(apr, 1);
    }
  });
  it("is zero when the payment only repays the loan", () => expect(aprFromPayment(12000, 250, 48)).toBeCloseTo(0, 1));
  it("gives nothing when the payment cannot pay the loan off", () => expect(aprFromPayment(30000, 100, 60)).toBeNull());
  it("gives nothing for empty input", () => {
    expect(aprFromPayment(0, 300, 60)).toBeNull();
    expect(aprFromPayment(20000, 0, 60)).toBeNull();
  });
});
