import type { BoxKey, NumKey } from "@/store/deal";

export interface FieldDef {
  key: NumKey;
  unit: "$" | "%";
  /** Largest value the keypad accepts, in the unit shown. */
  max: number;
  /** Number of decimal places the keypad allows. */
  decimals: number;
  /** The stored value is the shown value divided by this (tax is stored as a fraction). */
  scale: number;
}

const money = (key: NumKey, max: number): FieldDef => ({ key, unit: "$", max, decimals: 0, scale: 1 });

/** Which fields each of the four boxes opens. */
export const BOX_FIELDS: Record<BoxKey, FieldDef[]> = {
  price: [money("price", 1_000_000), { key: "taxRate", unit: "%", max: 20, decimals: 2, scale: 100 }],
  fees: [money("fees", 100_000), money("addons", 100_000)],
  down: [money("down", 1_000_000), money("tradeAllowance", 1_000_000), money("tradePayoff", 1_000_000), money("rebate", 100_000)],
  loan: [{ key: "apr", unit: "%", max: 40, decimals: 2, scale: 1 }],
};

export const BOX_ORDER: BoxKey[] = ["price", "fees", "down", "loan"];
