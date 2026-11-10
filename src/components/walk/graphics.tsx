"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { Nums } from "@/components/Nums";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { DownIcon, SwapIcon, TagIcon, WalletIcon } from "@/components/ui/icons";
import { walk } from "@/data/strings/walk";

/**
 * Payment strip: one block per monthly payment, twelve to a row, so each row is a year.
 * Counting blocks is a frequency format, which helps people who are less sure with numbers.
 * The blocks pop in left to right in about half a second, so the count is felt, not just seen.
 * Blocks drawn in the interest colour show the share of the payments that is interest.
 */
export function PaymentStrip({
  months,
  interestBlocks = 0,
  caption,
  keys,
}: {
  months: number;
  interestBlocks?: number;
  caption?: string;
  /** Names for the two colours, when the coloured blocks are not interest (for example, the cost of extras). */
  keys?: { loan: string; interest: string };
}) {
  const reduce = useReducedMotion();
  const blocks = Math.max(0, Math.round(months));
  const interest = Math.min(Math.max(Math.round(interestBlocks), 0), blocks);
  const label = caption ?? `${blocks} monthly payments`;
  // The whole fill-in takes the same time for 36 blocks or 84.
  const step = blocks > 0 ? Math.min(0.012, 0.6 / blocks) : 0;
  return (
    <figure className="strip">
      <div className="strip-grid" role="img" aria-label={interest ? `${label} About ${interest} of them are interest.` : label}>
        {Array.from({ length: blocks }, (_, i) => (
          <motion.span
            key={i}
            className={i >= blocks - interest ? "blk int" : "blk"}
            initial={reduce ? false : { opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 26, delay: i * step }}
          />
        ))}
      </div>
      {interest > 0 && (
        <ul className="mbar-key strip-key">
          <li>
            <span className="sw car" aria-hidden="true" />
            <span className="k">{keys?.loan ?? walk.stage4.stripKey.loan}</span>
          </li>
          <li>
            <span className="sw interest" aria-hidden="true" />
            <span className="k">{keys?.interest ?? walk.stage4.stripKey.interest}</span>
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
 * scale. Each part grows from the left in turn, and re-flows with a spring when a number changes,
 * so the buyer watches a part take a bigger or smaller share.
 */
export function MoneyBar({ parts, showShare = true }: { parts: BarPart[]; showShare?: boolean }) {
  const reduce = useReducedMotion();
  const shown = parts.filter((p) => p.cents > 0);
  const total = shown.reduce((s, p) => s + p.cents, 0) || 1;
  return (
    <figure className="mbar">
      <div className="mbar-row" role="img" aria-label={shown.map((p) => `${p.label} about ${Math.round((p.cents / total) * 100)} in 100`).join(", ")}>
        {shown.map((p, i) => (
          <motion.span
            key={p.key}
            className={`mseg ${p.key}`}
            initial={reduce ? false : { flexGrow: 0.0001, opacity: 0 }}
            animate={{ flexGrow: p.cents, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 24, delay: i * 0.07 }}
          />
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

const inHundred = (n: number) => String(Math.round(n));

/**
 * A ring for one share: how many of every 100 dollars go to interest. The arc draws itself and the
 * centre counts up. A ring suits a single part of a whole; the bar above it shows all the parts.
 */
export function ShareRing({ share, label }: { share: number; label: string }) {
  const reduce = useReducedMotion();
  const r = 46;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(share, 0), 100);
  return (
    <figure className="share">
      <svg viewBox="0 0 120 120" role="img" aria-label={`${Math.round(clamped)} of every 100 dollars is interest`}>
        <circle cx="60" cy="60" r={r} className="share-track" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          className="share-arc"
          strokeDasharray={c}
          initial={reduce ? false : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - clamped / 100) }}
          transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.15 }}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="share-mid" aria-hidden="true">
        <AnimatedNumber value={clamped} format={inHundred} className="num share-n" />
        <span className="share-of">in 100</span>
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

/** The dealer's four-box worksheet. `lit` marks the box the buyer started from; the mark slides when it changes. */
export function FourSquare({ lit, values }: { lit?: "price" | "trade" | "down" | "pay" | null; values?: Partial<Record<"price" | "trade" | "down" | "pay", string>> }) {
  const reduce = useReducedMotion();
  const b = walk.stage1.boxes;
  const cells = [
    { k: "price", label: b.price, icon: <TagIcon size={28} /> },
    { k: "trade", label: b.trade, icon: <SwapIcon size={28} /> },
    { k: "down", label: b.down, icon: <DownIcon size={28} /> },
    { k: "pay", label: b.pay, icon: <WalletIcon size={28} /> },
  ] as const;
  return (
    <figure className="four">
      <div className="four-grid" role="img" aria-label="A worksheet with four boxes: price, trade-in, down payment and monthly payment.">
        {cells.map((c, i) => (
          <motion.span
            key={c.k}
            className={lit === c.k ? "cell lit" : "cell"}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 26, delay: i * 0.07 }}
          >
            <span className="cell-ico">{c.icon}</span>
            <span className="l">{c.label}</span>
            {values?.[c.k] && <span className="cell-v num">{values[c.k]}</span>}
            {lit === c.k && (
              <motion.span layoutId="four-lit" className="cell-mark" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
            )}
          </motion.span>
        ))}
      </div>
      <figcaption>{walk.stage1.caption}</figcaption>
    </figure>
  );
}

/** A small icon in a tinted square, shown beside each step's title. */
export function StepBadge({ icon, tone }: { icon: ReactNode; tone: "car" | "tax" | "fees" | "extras" | "rolled" | "interest" }) {
  return (
    <span className={`badge badge-${tone}`} aria-hidden="true">
      {icon}
    </span>
  );
}
