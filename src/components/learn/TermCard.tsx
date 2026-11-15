"use client";

import { Nums } from "@/components/Nums";
import { Btn } from "@/components/ui/Btn";
import { AskSheet } from "@/components/walk/AskSheet";
import type { LearnTerm } from "@/data/learn";
import type { LearnUi } from "@/data/learn/ui";
import { Art } from "./Art";

const figuresOf = (text: string): number[] => [...text.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((m) => Number(m[0].replace(/,/g, "")));

/**
 * One word in the dictionary. It always shows the plain meaning, the picture and the everyday comparison, and the line
 * about the buyer's own deal when there is one. Everything else opens with "Show more".
 */
export function TermCard({
  t,
  ui,
  mine,
  open,
  onToggle,
  related,
  onRelated,
}: {
  t: LearnTerm;
  ui: LearnUi;
  mine: string | null;
  open: boolean;
  onToggle: () => void;
  related: LearnTerm[];
  onRelated: (id: string) => void;
}) {
  const context = `${t.term}. ${t.plain} ${t.meaning} ${t.daily}`;
  return (
    <article id={t.id} className="lh-card" data-open={open}>
      <div className="lh-card-head">
        <h3>{t.term}</h3>
        <p className="lh-plain">{t.plain}</p>
      </div>
      <div className="lh-daily">
        <div className="lh-art">
          <Art k={t.art} />
        </div>
        <div>
          <span className="lh-label">{ui.daily}</span>
          <p>{t.daily}</p>
        </div>
      </div>
      {mine && (
        <div className="lh-mine">
          <span className="lh-label">{ui.mine}</span>
          <p>
            <Nums text={mine} />
          </p>
        </div>
      )}
      {open && (
        <div className="lh-more">
          <div>
            <span className="lh-label">{ui.meaning}</span>
            <p>{t.meaning}</p>
          </div>
          <div>
            <span className="lh-label">{ui.why}</span>
            <p>{t.why}</p>
          </div>
          <div>
            <span className="lh-label">{ui.ask}</span>
            <p className="lh-ask">{t.ask}</p>
          </div>
          {related.length > 0 && (
            <div>
              <span className="lh-label">{ui.related}</span>
              <ul className="lh-related">
                {related.map((r) => (
                  <li key={r.id}>
                    <a
                      href={`#${r.id}`}
                      onClick={() => {
                        onRelated(r.id);
                      }}
                    >
                      {r.term}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <AskSheet
            topic={`learn:${t.id}`}
            title={t.term}
            context={`${context}${mine ? ` ${mine}` : ""}`}
            figures={figuresOf(`${context} ${mine ?? ""}`)}
            trigger={
              <Btn variant="ghost" type="button">
                {ui.explain}
              </Btn>
            }
          />
        </div>
      )}
      <button type="button" className="link lh-toggle" aria-expanded={open} aria-controls={undefined} onClick={onToggle}>
        {open ? ui.close : ui.open}
        <span className="sr-only">: {t.term}</span>
      </button>
    </article>
  );
}
