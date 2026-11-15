import Link from "next/link";
import { InfoPage } from "@/components/site/SitePage";
import { HopFour } from "@/components/site/landing/HopFour";
import { TrailBars } from "@/components/site/info/TrailBars";
import { WordChips } from "@/components/site/info/WordChips";
import { ArrowIcon, PercentIcon, PlusBoxIcon, ReceiptIcon, SceneDesk, SceneQuote, SwapIcon, TagIcon, WalletIcon, DownIcon, CalendarIcon } from "@/components/ui/icons";
import { StepBadge } from "@/components/walk/graphics";
import { en } from "@/data/strings/en";
import { es } from "@/data/strings/es";
import { formatSignedCents, formatWhole, type TrailKey } from "@/engine";
import { getExample } from "@/lib/example";
import { localePath, siteFor, type Locale } from "@/lib/site-locale";

const BOX_ART = [
  { icon: <TagIcon size={24} />, tone: "car" },
  { icon: <PlusBoxIcon size={24} />, tone: "extras" },
  { icon: <SwapIcon size={24} />, tone: "fees" },
  { icon: <CalendarIcon size={24} />, tone: "tax" },
] as const;

const LEVER_ICONS = [
  <TagIcon key="p" size={18} />,
  <ReceiptIcon key="f" size={18} />,
  <PlusBoxIcon key="a" size={18} />,
  <PercentIcon key="r" size={18} />,
  <SwapIcon key="t" size={18} />,
];

const COMPARE_ART = [
  { icon: <ReceiptIcon size={26} />, tone: "interest" },
  { icon: <WalletIcon size={26} />, tone: "car" },
  { icon: <DownIcon size={26} />, tone: "tax" },
] as const;

export function HowPage({ locale }: { locale: Locale }) {
  const h = siteFor(locale).how;
  const to = (p: string) => localePath(locale, p);
  const trailNames = locale === "es" ? es.en.trailSteps : en.trailSteps;
  // The trail comes from the engine on the example deal, so no figure here is typed by hand.
  const { trail, d2 } = getExample();
  const rows = trail.steps
    .filter((s) => s.cents !== 0)
    .sort((a, b) => Math.abs(b.cents) - Math.abs(a.cents))
    .map((s) => ({ key: s.key, label: trailNames[s.key as TrailKey], cents: s.cents, text: formatSignedCents(s.cents) }));

  return (
    <InfoPage current="how" locale={locale} path="/how-it-works" title={h.h1} lead={h.lead}>
      <section className="ch s-wrap" aria-labelledby="modes-h">
        <h2 id="modes-h" className="ch-h">
          {h.modes.h2}
        </h2>
        <div className="ch-body">
          <div className="two">
            <article className="mode">
              <div className="mode-art" aria-hidden="true">
                <SceneQuote />
              </div>
              <h3>{h.modes.walk.title}</h3>
              <p>{h.modes.walk.body}</p>
            </article>
            <article className="mode">
              <div className="mode-art" aria-hidden="true">
                <SceneDesk />
              </div>
              <h3>{h.modes.desk.title}</h3>
              <p>{h.modes.desk.body}</p>
            </article>
          </div>
          <p className="i-note">{h.modes.note}</p>
        </div>
      </section>

      <section className="ch s-wrap" aria-labelledby="boxes-h">
        <h2 id="boxes-h" className="ch-h">
          {h.boxes.h2}
        </h2>
        <div className="ch-body boxes">
          <HopFour />
          <ul className="iconlist">
            {h.boxes.items.map((it, i) => (
              <li key={it.k}>
                <StepBadge icon={BOX_ART[i].icon} tone={BOX_ART[i].tone} />
                <div>
                  <b>{it.k}</b>
                  <span>{it.v}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ch s-wrap" aria-labelledby="trail-h">
        <h2 id="trail-h" className="ch-h">
          {h.trail.h2}
        </h2>
        <div className="ch-body">
          <p className="lead2">{h.trail.lead}</p>
          <TrailBars rows={rows} total={formatSignedCents(trail.totalCents)} totalLabel={h.trail.sum} />
          <p className="i-note">{h.trail.note}</p>
        </div>
      </section>

      <section className="ch s-wrap" aria-labelledby="compare-h">
        <h2 id="compare-h" className="ch-h">
          {h.compare.h2}
        </h2>
        <div className="ch-body">
          <ul className="compare">
            {h.compare.items.map((it, i) => (
              <li key={it.k}>
                <StepBadge icon={COMPARE_ART[i].icon} tone={COMPARE_ART[i].tone} />
                <b>{it.k}</b>
                <span className="fig num">{[formatWhole(d2.total), formatWhole(d2.pay), formatWhole(d2.otd)][i]}</span>
                <span className="desc">{it.v}</span>
              </li>
            ))}
          </ul>
          <p className="i-note">{h.compare.note}</p>
        </div>
      </section>

      <section className="ch s-wrap" aria-labelledby="take-h">
        <h2 id="take-h" className="ch-h">
          {h.take.h2}
        </h2>
        <div className="ch-body">
          <p className="lead2">{h.take.lead}</p>
          <ul className="levers">
            {h.take.levers.map((l, i) => (
              <li key={l}>
                {LEVER_ICONS[i]}
                {l}
              </li>
            ))}
          </ul>
          <p className="i-note">{h.take.note}</p>
        </div>
      </section>

      <section className="ch s-wrap" aria-labelledby="words-h">
        <h2 id="words-h" className="ch-h">
          {h.words.h2}
        </h2>
        <div className="ch-body">
          <p className="lead2">{h.words.hint}</p>
          <WordChips items={h.words.items} closeLabel={h.words.close} />
        </div>
      </section>

      <section className="pg-end s-wrap">
        <Link href={to("/deal")} className="s-btn s-btn-lg">
          {h.cta}
          <ArrowIcon size={22} />
        </Link>
      </section>
    </InfoPage>
  );
}
