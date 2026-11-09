import type { Metadata } from "next";
import Link from "next/link";
import { ExampleReadout } from "@/components/site/ExampleReadout";
import { HeroCheck } from "@/components/site/HeroCheck";
import { FourSquare } from "@/components/walk/graphics";
import { ExampleTable } from "@/components/site/ExampleTable";
import { SitePage } from "@/components/site/SitePage";
import { leverLine } from "@/components/lever-line";
import { Nums } from "@/components/Nums";
import { en } from "@/data/strings/en";
import { site } from "@/data/strings/site";
import { formatCents, LEVERS, toCents } from "@/engine";
import { getExample } from "@/lib/example";

const h = site.home;

export const metadata: Metadata = {
  title: { absolute: h.title },
  description: h.description,
};

export default function Home() {
  const { o1, o2, trail, take } = getExample();
  const levers = LEVERS.map((lever) => ({ lever, result: take.levers.find((l) => l.lever === lever)?.result ?? null }));
  const found = levers.filter((l) => l.result);
  const missed = levers.some((l) => !l.result && (l.lever === "fees" || l.lever === "addons"));

  return (
    <SitePage current="home">
      <section className="s-hero s-wrap" aria-labelledby="hero-h">
        <div className="s-hero-text">
          <h1 id="hero-h" className="s-h1">
            {h.h1}
          </h1>
          <p className="s-lead">{h.lead}</p>
          <div className="s-cta">
            <Link href="/deal" className="s-btn">
              {h.primary}
            </Link>
            <Link href="/how-it-works" className="s-btn s-btn-ghost">
              {h.secondary}
            </Link>
          </div>
          <p className="s-fine">{h.note}</p>
        </div>
        <HeroCheck />
      </section>

      <section className="s-sec s-wrap" aria-labelledby="four-h">
        <div className="s-sec-head">
          <h2 id="four-h" className="s-h2">
            {h.fourSquare.h2}
          </h2>
          <p className="s-prose">{h.fourSquare.p1}</p>
          <p className="s-prose">{h.fourSquare.p2}</p>
        </div>
        <div className="s-sec-body">
          <FourSquare />
        </div>
      </section>

      <section className="s-sec s-wrap" aria-labelledby="story-h">
        <div className="s-sec-head">
          <h2 id="story-h" className="s-h2">
            {h.story.h2}
          </h2>
          <p className="s-prose">
            <Nums
              text={h.story.p1(
                o1.months,
                o2.months,
                formatCents(toCents(o2.addons)),
                formatCents(Math.abs(trail.monthlyCents)),
                formatCents(trail.totalCents),
              )}
            />
          </p>
          <p className="s-prose">{h.story.p2}</p>
          <ExampleReadout />
        </div>
        <div className="s-sec-body">
          <ExampleTable />
        </div>
      </section>

      <section className="s-sec s-wrap" aria-labelledby="steps-h">
        <div className="s-sec-head">
          <h2 id="steps-h" className="s-h2">
            {h.steps.h2}
          </h2>
        </div>
        <ol className="s-sec-body s-steps">
          {h.steps.items.map((step, i) => (
            <li key={step.title}>
              <span className="s-step-n num" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="s-sec s-wrap" aria-labelledby="take-h">
        <div className="s-sec-head">
          <h2 id="take-h" className="s-h2">
            {h.take.h2}
          </h2>
          <p className="s-prose">
            <Nums
              text={h.take.p1(en.offer2, formatCents(toCents(take.target)), en.offer1)}
            />
          </p>
        </div>
        <div className="s-sec-body">
          <ul className="s-asks">
            {found.map(({ lever, result }) => (
              <li key={lever}>
                <Nums text={leverLine(lever, result!)} />
              </li>
            ))}
          </ul>
          {missed && <p className="s-prose">{h.take.none}</p>}
          <p className="s-prose">{h.take.p2}</p>
        </div>
      </section>

      <section className="s-sec s-wrap" aria-labelledby="scope-h">
        <div className="s-sec-head">
          <h2 id="scope-h" className="s-h2">
            {h.scope.h2}
          </h2>
          <p className="s-prose">
            {h.scope.privacy} <Link href="/privacy">{h.scope.privacyLink}</Link>.
          </p>
        </div>
        <div className="s-sec-body s-two">
          <div>
            <h3 className="s-h3">{h.scope.doesH}</h3>
            <ul className="s-list">
              {h.scope.does.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="s-h3">{h.scope.leavesH}</h3>
            <ul className="s-list">
              {h.scope.leaves.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="s-close s-wrap" aria-labelledby="close-h">
        <h2 id="close-h" className="s-h1 s-h1-close">
          {h.close.h2}
        </h2>
        <Link href="/deal" className="s-btn s-btn-lg">
          {h.close.cta}
        </Link>
      </section>
    </SitePage>
  );
}
