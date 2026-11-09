import { site } from "@/data/strings/site";
import { formatCents, formatSignedCents, toCents } from "@/engine";
import { getExample } from "@/lib/example";

const s = site.home.story;

interface Row {
  key: string;
  label: string;
  a: string;
  b: string;
  change: number;
  changeText: string;
  strong?: boolean;
}

function build(): Row[] {
  const { o1, o2, d1, d2 } = getExample();
  const diff = (a: number, b: number) => b - a;
  const row = (key: string, label: string, a: number, b: number, strong = false): Row => {
    const change = diff(a, b);
    return { key, label, a: formatCents(a), b: formatCents(b), change, changeText: formatSignedCents(change), strong };
  };
  return [
    row("price", s.rows.price, toCents(o1.price), toCents(o2.price)),
    row("fees", s.rows.fees, toCents(o1.fees), toCents(o2.fees)),
    row("addons", s.rows.addons, toCents(o1.addons), toCents(o2.addons)),
    row("tax", s.rows.tax, d1.taxCents, d2.taxCents),
    row("otd", s.rows.otd, d1.otdCents, d2.otdCents),
    row("down", s.rows.down, toCents(o1.down), toCents(o2.down)),
    {
      key: "apr",
      label: s.rows.apr,
      a: `${o1.apr}%`,
      b: `${o2.apr}%`,
      change: o2.apr - o1.apr,
      changeText: o2.apr === o1.apr ? "" : `${o2.apr - o1.apr > 0 ? "+" : "-"}${Math.abs(o2.apr - o1.apr).toFixed(2)}`,
    },
    {
      key: "months",
      label: s.rows.months,
      a: String(o1.months),
      b: String(o2.months),
      change: o2.months - o1.months,
      changeText: o2.months === o1.months ? "" : `${o2.months > o1.months ? "+" : "-"}${Math.abs(o2.months - o1.months)}`,
    },
    row("pay", s.rows.pay, d1.payCents, d2.payCents, true),
    row("total", s.rows.total, d1.totalCents, d2.totalCents, true),
  ];
}

/** The two example offers line by line. Every figure is computed by the engine. */
export function ExampleTable() {
  const rows = build();
  return (
    <table className="s-table">
      <caption>{s.caption}</caption>
      <thead>
        <tr>
          <th scope="col">{s.colItem}</th>
          <th scope="col">{site.home.readout.offer1}</th>
          <th scope="col">{site.home.readout.offer2}</th>
          <th scope="col">{s.colChange}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const tone = r.change === 0 ? "flat" : r.change > 0 ? "up" : "down";
          return (
            <tr key={r.key} className={r.strong ? "strong" : undefined}>
              <th scope="row">{r.label}</th>
              <td data-label={site.home.readout.offer1} className="num">
                {r.a}
              </td>
              <td data-label={site.home.readout.offer2} className="num">
                {r.b}
              </td>
              <td data-label={s.colChange} className={`num chg ${tone}`}>
                {r.change === 0 ? <span className="same">{s.same}</span> : r.changeText}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
