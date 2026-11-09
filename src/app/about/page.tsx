import type { Metadata } from "next";
import Link from "next/link";
import { DocPage } from "@/components/site/SitePage";
import { Nums } from "@/components/Nums";
import { site } from "@/data/strings/site";

const a = site.about;

export const metadata: Metadata = {
  title: a.title,
  description: a.description,
};

export default function About() {
  const contents = (Object.keys(a.sections) as (keyof typeof a.sections)[]).map((id) => ({ id, label: a.sections[id] }));
  return (
    <DocPage current="about" title={a.h1} lead={a.lead} contents={contents}>
      <section id="why" aria-labelledby="why-h">
        <h2 id="why-h">{a.sections.why}</h2>
        {a.why.map((t) => (
          <p key={t}><Nums text={t} /></p>
        ))}
      </section>

      <section id="who" aria-labelledby="who-h">
        <h2 id="who-h">{a.sections.who}</h2>
        {a.who.map((t) => (
          <p key={t}><Nums text={t} /></p>
        ))}
      </section>

      <section id="rule" aria-labelledby="rule-h">
        <h2 id="rule-h">{a.sections.rule}</h2>
        {a.rule.map((t) => (
          <p key={t}><Nums text={t} /></p>
        ))}
      </section>

      <section id="built" aria-labelledby="built-h">
        <h2 id="built-h">{a.sections.built}</h2>
        <ul>
          {a.built.map((t) => (
            <li key={t}><Nums text={t} /></li>
          ))}
        </ul>
        <Link href="/deal" className="s-btn">
          {a.cta}
        </Link>
      </section>

      <section id="planned" aria-labelledby="planned-h">
        <h2 id="planned-h">{a.sections.planned}</h2>
        <ul>
          {a.planned.map((t) => (
            <li key={t}><Nums text={t} /></li>
          ))}
        </ul>
      </section>

      <section id="data" aria-labelledby="data-h">
        <h2 id="data-h">{a.sections.data}</h2>
        {a.data.map((t) => (
          <p key={t}><Nums text={t} /></p>
        ))}
      </section>
    </DocPage>
  );
}
