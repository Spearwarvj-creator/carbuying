import { Nums } from "@/components/Nums";
import { walk } from "@/data/strings/walk";

/**
 * Payment strip: one block per monthly payment, twelve to a row, so each row is a year.
 * Counting blocks is a frequency format, which helps people who are less sure with numbers.
 * Blocks drawn in the interest colour show the share of the payments that is interest.
 */
export function PaymentStrip({ months, interestBlocks = 0, caption }: { months: number; interestBlocks?: number; caption?: string }) {
  const blocks = Math.max(0, Math.round(months));
  const interest = Math.min(Math.max(Math.round(interestBlocks), 0), blocks);
  const label = caption ?? `${blocks} monthly payments`;
  return (
    <figure className="strip">
      <div className="strip-grid" role="img" aria-label={interest ? `${label} About ${interest} of them are interest.` : label}>
        {Array.from({ length: blocks }, (_, i) => (
          <span key={i} className={i >= blocks - interest ? "blk int" : "blk"} />
        ))}
      </div>
      {interest > 0 && (
        <ul className="mbar-key strip-key">
          <li>
            <span className="sw car" aria-hidden="true" />
            <span className="k">{walk.stage4.stripKey.loan}</span>
          </li>
          <li>
            <span className="sw interest" aria-hidden="true" />
            <span className="k">{walk.stage4.stripKey.interest}</span>
          </li>
        </ul>
      )}
      <figcaption>
        <Nums text={label} />
      </figcaption>
    </figure>
  );
}

export interface BarPart {
  key: "car" | "tax" | "fees" | "extras" | "rolled" | "interest";
  label: string;
  cents: number;
}

/**
 * Money bar: one bar for the whole, cut into parts that add up to it. The parts share one
 * scale. Each part has a label with its share in whole dollars out of every hundred.
 */
export function MoneyBar({ parts, showShare = true }: { parts: BarPart[]; showShare?: boolean }) {
  const shown = parts.filter((p) => p.cents > 0);
  const total = shown.reduce((s, p) => s + p.cents, 0) || 1;
  return (
    <figure className="mbar">
      <div className="mbar-row" role="img" aria-label={shown.map((p) => `${p.label} about ${Math.round((p.cents / total) * 100)} in 100`).join(", ")}>
        {shown.map((p) => (
          <span key={p.key} className={`mseg ${p.key}`} style={{ flexGrow: p.cents }} />
        ))}
      </div>
      <ul className="mbar-key">
        {shown.map((p) => (
          <li key={p.key}>
            <span className={`sw ${p.key}`} aria-hidden="true" />
            <span className="k">{p.label}</span>
            {showShare && (
              <span className="v">
                <Nums text={`${Math.max(Math.round((p.cents / total) * 100), 1)} in 100`} />
              </span>
            )}
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** The dealer's four-box worksheet, drawn as four boxes. `lit` marks the box the buyer started from. */
export function FourSquare({ lit }: { lit?: "price" | "trade" | "down" | "pay" | null }) {
  const b = walk.stage1.boxes;
  const cells: Array<{ k: "price" | "trade" | "down" | "pay"; label: string }> = [
    { k: "price", label: b.price },
    { k: "trade", label: b.trade },
    { k: "down", label: b.down },
    { k: "pay", label: b.pay },
  ];
  return (
    <figure className="four">
      <div className="four-grid" role="img" aria-label="A worksheet with four boxes: price, trade-in, down payment and monthly payment.">
        {cells.map((c) => (
          <span key={c.k} className={lit === c.k ? "cell lit" : "cell"}>
            <span className="q" aria-hidden="true">
              ?
            </span>
            <span className="l">{c.label}</span>
          </span>
        ))}
      </div>
      <figcaption>{walk.stage1.caption}</figcaption>
    </figure>
  );
}
