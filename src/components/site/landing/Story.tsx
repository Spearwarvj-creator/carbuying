"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { CalendarIcon, FlagIcon, PlusBoxIcon, ReceiptIcon, SwapIcon, TagIcon } from "@/components/ui/icons";
import { StepBadge, MoneyBar, PaymentStrip, ShareRing, type BarPart } from "@/components/walk/graphics";
import { site } from "@/data/strings/site";
import { walk } from "@/data/strings/walk";
import { formatWhole } from "@/engine";

const s = site.home.story;

export interface StoryData {
  otd: number;
  total: number;
  months: number;
  interestBlocks: number;
  extrasPayments: string;
  interestPer100: number;
  parts: BarPart[];
}

const ART = [
  { icon: <ReceiptIcon size={22} />, tone: "car", name: "Start" },
  { icon: <TagIcon size={22} />, tone: "car", name: "Price" },
  { icon: <PlusBoxIcon size={22} />, tone: "extras", name: "Extras" },
  { icon: <CalendarIcon size={22} />, tone: "tax", name: "Loan" },
  { icon: <SwapIcon size={22} />, tone: "fees", name: "Trade-in" },
  { icon: <FlagIcon size={22} />, tone: "interest", name: "Your deal" },
] as const;

/** What each step looks like inside the Walk, built from the same graphics the Walk uses. */
function Scene({ i, d }: { i: number; d: StoryData }) {
  const p = s.phone;
  switch (i) {
    case 0:
      return (
        <div className="sc sc-choice">
          <span className="sc-pill" data-on="true">Monthly payment</span>
          <span className="sc-pill">Price of the car</span>
          <span className="sc-field num">$ 522</span>
        </div>
      );
    case 1:
      return (
        <div className="sc">
          <span className="sc-label">{p.otd}</span>
          <span className="sc-big num">
            <AnimatedNumber value={d.otd} format={formatWhole} />
          </span>
          <MoneyBar parts={d.parts.filter((x) => x.key === "car" || x.key === "tax" || x.key === "fees" || x.key === "extras")} showShare={false} />
        </div>
      );
    case 2:
      return (
        <div className="sc">
          <span className="sc-label">{p.realCost(d.extrasPayments)}</span>
          <PaymentStrip months={12} interestBlocks={Number(d.extrasPayments.split(".")[0]) || 0} caption={p.paymentsLabel} />
        </div>
      );
    case 3:
      return (
        <div className="sc">
          <span className="sc-label">{p.paymentsLabel}</span>
          <PaymentStrip months={d.months} interestBlocks={d.interestBlocks} caption={`${d.months} payments`} />
        </div>
      );
    case 4:
      return (
        <div className="sc sc-trade">
          <div className="sc-bars">
            <span className="sc-bar sc-bar-credit" />
            <span className="sc-bar sc-bar-owe" />
          </div>
          <ul className="mbar-key">
            <li>
              <i className="sw car" aria-hidden="true" />
              <span className="k">{p.credit}</span>
            </li>
            <li>
              <i className="sw interest" aria-hidden="true" />
              <span className="k">{p.owe}</span>
            </li>
          </ul>
        </div>
      );
    default:
      return (
        <div className="sc">
          <span className="sc-label">{p.total}</span>
          <span className="sc-big sc-total num">
            <AnimatedNumber value={d.total} format={formatWhole} />
          </span>
          <ShareRing share={d.interestPer100} label={p.inHundred} />
        </div>
      );
  }
}

function Frame({ i, children }: { i: number; children: ReactNode }) {
  const a = ART[i];
  return (
    <div className="phone-ui">
      <div className="phone-head">
        <StepBadge icon={a.icon} tone={a.tone} />
        <span className="phone-title">{s.items[i].title}</span>
      </div>
      <div className="phone-body">{children}</div>
      <div className="phone-foot">
        <span className="phone-dots">
          {ART.map((x, k) => (
            <i key={x.name} data-on={k <= i} />
          ))}
        </span>
        <span className="phone-next">{walk.next}</span>
      </div>
    </div>
  );
}

/**
 * Six steps on the left, one phone on the right that shows the step you are reading. On a phone
 * the picture sits inside each step instead. The active step is found with IntersectionObserver.
 */
export function Story({ data }: { data: StoryData }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="story">
      <ol className="story-steps">
        {s.items.map((it, i) => (
          <li key={it.title} data-i={i} data-active={active === i} ref={(el) => void (refs.current[i] = el)}>
            <div className="story-text">
              <span className="story-n num">{i + 1}</span>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </div>
            <div className="story-inline phone-ui-wrap" aria-hidden="true">
              <Frame i={i}>
                <Scene i={i} d={data} />
              </Frame>
            </div>
          </li>
        ))}
      </ol>
      <div className="story-phone" aria-hidden="true">
        <div className="phone">
          <span className="phone-notch" />
          <motion.div
            key={active}
            className="phone-screen"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <Frame i={active}>
              <Scene i={active} d={data} />
            </Frame>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
