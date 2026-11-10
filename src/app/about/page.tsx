import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/site/SitePage";
import { HopFour } from "@/components/site/landing/HopFour";
import { ArrowIcon, CalcIcon, CheckIcon, ClockIcon, SparkIcon, SunIcon, TypeIcon, UserIcon, UsersIcon } from "@/components/ui/icons";
import { StepBadge } from "@/components/walk/graphics";
import { site } from "@/data/strings/site";
import "../info.css";

const a = site.about;

export const metadata: Metadata = {
  title: a.title,
  description: a.description,
};

const WHO_ART = [
  { icon: <UserIcon size={24} />, tone: "car" },
  { icon: <TypeIcon size={24} />, tone: "fees" },
  { icon: <SunIcon size={24} />, tone: "extras" },
  { icon: <UsersIcon size={24} />, tone: "tax" },
] as const;

export default function About() {
  return (
    <InfoPage current="about" title={a.h1} lead={a.lead}>
      <section className="ch s-wrap" aria-labelledby="why-h">
        <h2 id="why-h" className="ch-h">
          {a.why.h2}
        </h2>
        <div className="ch-body boxes">
          <HopFour />
          <div className="statement">
            <p className="big-line">{a.why.line}</p>
            <p className="lead2">{a.why.body}</p>
          </div>
        </div>
      </section>

      <section className="ch s-wrap" aria-labelledby="who-h">
        <h2 id="who-h" className="ch-h">
          {a.who.h2}
        </h2>
        <div className="ch-body">
          <p className="lead2">{a.who.lead}</p>
          <ul className="iconlist iconlist-2">
            {a.who.items.map((it, i) => (
              <li key={it.k}>
                <StepBadge icon={WHO_ART[i].icon} tone={WHO_ART[i].tone} />
                <div>
                  <b>{it.k}</b>
                  <span>{it.v}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ch s-wrap" aria-labelledby="rule-h">
        <h2 id="rule-h" className="ch-h">
          {a.rule.h2}
        </h2>
        <div className="ch-body">
          <p className="big-line">{a.rule.line}</p>
          <div className="lanes">
            <article className="lane lane-calc">
              <StepBadge icon={<CalcIcon size={26} />} tone="car" />
              <h3>{a.rule.calc.title}</h3>
              <p>{a.rule.calc.body}</p>
            </article>
            <span className="lane-arrow" aria-hidden="true">
              <ArrowIcon size={28} />
            </span>
            <article className="lane lane-ai">
              <StepBadge icon={<SparkIcon size={26} />} tone="extras" />
              <h3>{a.rule.ai.title}</h3>
              <p>{a.rule.ai.body}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="ch s-wrap" aria-labelledby="status-h">
        <h2 id="status-h" className="ch-h">
          {a.status.h2}
        </h2>
        <div className="ch-body two">
          <div className="status">
            <h3>{a.status.built.title}</h3>
            <ul>
              {a.status.built.items.map((t) => (
                <li key={t}>
                  <span className="mk mk-yes" aria-hidden="true">
                    <CheckIcon size={16} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="status">
            <h3>{a.status.planned.title}</h3>
            <ul>
              {a.status.planned.items.map((t) => (
                <li key={t}>
                  <span className="mk" aria-hidden="true">
                    <ClockIcon size={16} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="ch s-wrap" aria-labelledby="data-h">
        <h2 id="data-h" className="ch-h">
          {a.data.h2}
        </h2>
        <div className="ch-body">
          <p className="lead2">{a.data.body}</p>
        </div>
      </section>

      <section className="pg-end s-wrap">
        <Link href="/deal" className="s-btn s-btn-lg">
          {a.cta}
          <ArrowIcon size={22} />
        </Link>
      </section>
    </InfoPage>
  );
}
