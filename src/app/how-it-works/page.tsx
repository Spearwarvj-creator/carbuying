import type { Metadata } from "next";
import Link from "next/link";
import { DocPage } from "@/components/site/SitePage";
import { Nums } from "@/components/Nums";
import { en } from "@/data/strings/en";
import { site } from "@/data/strings/site";
import { formatSignedCents, type TrailKey } from "@/engine";
import { getExample } from "@/lib/example";

const h = site.how;

export const metadata: Metadata = {
  title: h.title,
  description: h.description,
};

export default function HowItWorks() {
  const { trail } = getExample();
  const parts = trail.steps.filter((s) => s.cents !== 0).sort((a, b) => Math.abs(b.cents) - Math.abs(a.cents));
  const contents = (Object.keys(h.sections) as (keyof typeof h.sections)[]).map((id) => ({ id, label: h.sections[id] }));

  return (
    <DocPage current="how" title={h.h1} lead={h.lead} contents={contents} contentsLabel={h.contents}>
      <section id="modes" aria-labelledby="modes-h">
        <h2 id="modes-h">{h.sections.modes}</h2>
        {h.modes.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </section>

      <section id="boxes" aria-labelledby="boxes-h">
        <h2 id="boxes-h">{h.sections.boxes}</h2>
        <p>{h.boxes.intro}</p>
        <dl>
          {h.boxes.items.map((i) => (
            <div key={i.k}>
              <dt>{i.k}</dt>
              <dd>{i.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="trail" aria-labelledby="trail-h">
        <h2 id="trail-h">{h.sections.trail}</h2>
        <p>{h.trail.p1}</p>
        <p>{h.trail.order}</p>
        <p>
          <Nums text={h.trail.p2} />
        </p>
        <p>{h.trail.example(parts.length)}</p>
        <table className="s-table">
          <caption className="sr-only">{h.trail.example(parts.length)}</caption>
          <thead>
            <tr>
              <th scope="col">{h.trail.colStep}</th>
              <th scope="col">{h.trail.colAmount}</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((s) => (
              <tr key={s.key}>
                <th scope="row">{en.trailSteps[s.key as TrailKey]}</th>
                <td data-label={h.trail.colAmount} className={`num chg ${s.cents > 0 ? "up" : "down"}`}>
                  {formatSignedCents(s.cents)}
                </td>
              </tr>
            ))}
            <tr className="strong">
              <th scope="row">{h.trail.sum}</th>
              <td data-label={h.trail.colAmount} className={`num chg ${trail.totalCents > 0 ? "up" : "down"}`}>
                {formatSignedCents(trail.totalCents)}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="compare" aria-labelledby="compare-h">
        <h2 id="compare-h">{h.sections.compare}</h2>
        <p>{h.compare.p1}</p>
        <dl>
          {h.compare.items.map((i) => (
            <div key={i.k}>
              <dt>{i.k}</dt>
              <dd>{i.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="take" aria-labelledby="take-h">
        <h2 id="take-h">{h.sections.take}</h2>
        <p>{h.take.p1}</p>
        <p>{h.take.p2}</p>
        <p>{h.take.p3}</p>
      </section>

      <section id="words" aria-labelledby="words-h">
        <h2 id="words-h">{h.sections.words}</h2>
        <p>{h.words.intro}</p>
        <dl>
          {h.words.items.map((i) => (
            <div key={i.k}>
              <dt>{i.k}</dt>
              <dd>{i.v}</dd>
            </div>
          ))}
        </dl>
        <Link href="/deal" className="s-btn">
          {h.cta}
        </Link>
      </section>
    </DocPage>
  );
}
