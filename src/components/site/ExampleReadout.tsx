import { Arrow } from "@/components/Arrow";
import { Nums } from "@/components/Nums";
import { en } from "@/data/strings/en";
import { site } from "@/data/strings/site";
import { formatCents, formatSignedCents, splitCents, type Deal, type TrailKey } from "@/engine";
import { getExample } from "@/lib/example";

const r = site.home.readout;

function Total({ cents, label }: { cents: number; label: string }) {
  const t = splitCents(cents);
  return (
    <span className="s-total" aria-label={label}>
      <span className="s-total-big num" aria-hidden="true">
        {t.dollars}
      </span>
      <span className="s-total-cents num" aria-hidden="true">
        .{t.cents}
      </span>
    </span>
  );
}

function Delta({ cents, text, goodWhenDown }: { cents: number; text: string; goodWhenDown: boolean }) {
  const down = cents < 0;
  const tone = down === goodWhenDown ? "down" : "up";
  return (
    <p className={`s-delta ${tone}`}>
      <Arrow dir={down ? "down" : "up"} />
      <span>
        <Nums text={text} />
      </span>
    </p>
  );
}

function Offer({ name, deal, children }: { name: string; deal: Deal; children?: React.ReactNode }) {
  return (
    <div className="s-offer">
      <h3>
        {name} <span className="s-offer-m">{r.months(deal.offer.months)}</span>
      </h3>
      <p className="s-k">{r.monthly}</p>
      <span className="s-v num">{formatCents(deal.payCents)}</span>
      <p className="s-k s-k-total">{r.total}</p>
      <Total cents={deal.totalCents} label={formatCents(deal.totalCents)} />
      {children}
    </div>
  );
}

/**
 * The example deal as a static readout: the same engine and the same trail as the
 * calculator, computed when the page is built. The bars draw in once on load.
 */
export function ExampleReadout() {
  const { d1, d2, trail } = getExample();
  const pay = trail.monthlyCents;
  const total = trail.totalCents;

  const rows = trail.steps
    .filter((s) => s.cents !== 0)
    .sort((a, b) => Math.abs(b.cents) - Math.abs(a.cents))
    .slice(0, 3);
  const max = Math.max(...rows.map((s) => Math.abs(s.cents)), 1);

  return (
    <section className="s-readout" aria-labelledby="readout-h">
      <h2 id="readout-h" className="s-readout-h">
        {r.label}
      </h2>
      <div className="s-offers">
        <Offer name={r.offer1} deal={d1}>
          <p className="s-base">{r.base}</p>
        </Offer>
        <Offer name={r.offer2} deal={d2}>
          <Delta
            cents={pay}
            text={pay < 0 ? r.pay(formatCents(Math.abs(pay))) : r.payUp(formatCents(pay))}
            goodWhenDown
          />
          <Delta
            cents={total}
            text={total > 0 ? r.tot(formatCents(total)) : r.totDown(formatCents(Math.abs(total)))}
            goodWhenDown
          />
        </Offer>
      </div>
      <div className="s-moved">
        <h3>{r.moved}</h3>
        {rows.map((s) => {
          const dir = s.cents > 0 ? "up" : "down";
          return (
            <div className="s-row" key={s.key}>
              <span className="s-row-k">{en.trailSteps[s.key as TrailKey]}</span>
              <span className={`s-bar ${dir}`} aria-hidden="true">
                <i style={{ width: `${Math.max((Math.abs(s.cents) / max) * 100, 2)}%` }} />
              </span>
              <span className={`s-row-a num ${dir}`}>{formatSignedCents(s.cents)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
