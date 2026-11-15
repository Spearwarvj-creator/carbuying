import Link from "next/link";
import { FinaleRoad } from "@/components/site/landing/FinaleRoad";
import { HopFour } from "@/components/site/landing/HopFour";
import { Road } from "@/components/site/landing/Road";
import { Story, type StoryData } from "@/components/site/landing/Story";
import { SitePage } from "@/components/site/SitePage";
import { ArrowIcon, CheckIcon, LockIcon, ListIcon } from "@/components/ui/icons";
import { es } from "@/data/strings/es";
import { walk } from "@/data/strings/walk";
import { costBreakdown, extrasRealCostCents, formatWhole, paymentEquivalents } from "@/engine";
import { getExample } from "@/lib/example";
import { localePath, siteFor, type Locale } from "@/lib/site-locale";

const TRUST_ICONS = [<CheckIcon key="a" size={26} />, <LockIcon key="b" size={26} />, <ListIcon key="c" size={26} />];

/** The home page, in either language. Every figure on it comes from the engine, never typed here. */
export function HomePage({ locale }: { locale: Locale }) {
  const site = siteFor(locale);
  const h = site.home;
  const to = (p: string) => localePath(locale, p);
  const w = locale === "es" ? es.walk : walk;
  // Every figure on this page comes from the engine, never typed here.
  const { o1, o2, d1, d2 } = getExample();
  const b = costBreakdown(o2);
  const p = w.stage6.parts;
  const story: StoryData = {
    otd: d2.otd,
    total: d2.total,
    months: o2.months,
    interestBlocks: Math.round((o2.months * d2.interest) / (d2.pay * o2.months)),
    extrasPayments: paymentEquivalents(extrasRealCostCents(o2), d2.payCents).toFixed(1),
    interestPer100: Math.round((100 * d2.interest) / d2.total),
    parts: [
      { key: "car", label: p.car, cents: b.carCents },
      { key: "tax", label: p.taxFees, cents: b.taxFeesCents },
      { key: "extras", label: p.extras, cents: b.extrasCents },
      { key: "interest", label: p.interest, cents: b.interestCents },
    ],
  };

  return (
    <SitePage current="home" locale={locale} path="/">
      <section className="hero" aria-labelledby="hero-h">
        <div className="hero-text s-wrap">
          <h1 id="hero-h" className="hero-h">
            {h.h1}
          </h1>
          <p className="hero-lead">{h.lead}</p>
          <div className="hero-cta">
            <Link href={to("/deal")} className="s-btn s-btn-lg">
              {h.primary}
              <ArrowIcon size={22} />
            </Link>
            <Link href={to("/how-it-works")} className="s-btn s-btn-ghost s-btn-lg">
              {h.secondary}
            </Link>
          </div>
          <p className="hero-fine">{h.note}</p>
        </div>
        <Road principal={d1.fin} apr={o1.apr} down={o1.down} locale={locale} />
      </section>

      <section className="wsheet s-wrap" aria-labelledby="sheet-h">
        <div className="wsheet-text">
          <h2 id="sheet-h" className="l-h2">
            {h.worksheet.h2}
          </h2>
          <p className="l-p">{h.worksheet.body}</p>
        </div>
        <div className="wsheet-art">
          <HopFour
            values={{
              price: formatWhole(o1.price),
              trade: h.worksheet.none,
              down: formatWhole(o1.down),
              pay: `${formatWhole(d1.pay)} ${h.worksheet.perMonth}`,
            }}
          />
        </div>
      </section>

      <section className="tour s-wrap" aria-labelledby="tour-h">
        <header className="tour-head">
          <h2 id="tour-h" className="l-h2">
            {h.story.h2}
          </h2>
          <p className="l-p">{h.story.lead}</p>
        </header>
        <Story data={story} locale={locale} />
      </section>

      <section className="trust s-wrap" aria-label={locale === "es" ? "Por qué es fácil confiar" : "Why it is easy to trust"}>
        <ul>
          {h.trust.map((t, i) => (
            <li key={t.title}>
              <span className="trust-ico" aria-hidden="true">
                {TRUST_ICONS[i]}
              </span>
              <b>{t.title}</b>
              <span>{t.body}</span>
            </li>
          ))}
        </ul>
        <p className="trust-more">
          {h.scope.text}. <Link href={to("/about")}>{h.scope.link}</Link>
        </p>
      </section>

      <section className="finale s-wrap" aria-labelledby="close-h">
        <div className="finale-top">
          <h2 id="close-h" className="finale-h">
            {h.close.h2}
          </h2>
          <Link href={to("/deal")} className="s-btn s-btn-lg">
            {h.close.cta}
            <ArrowIcon size={22} />
          </Link>
        </div>
        <FinaleRoad />
      </section>
    </SitePage>
  );
}
