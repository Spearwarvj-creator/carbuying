"use client";

import { Dialog } from "radix-ui";
import { useState } from "react";
import { Nums } from "@/components/Nums";
import { Btn } from "@/components/ui/Btn";
import { CloseIcon } from "@/components/ui/icons";
import { LESSON_BASE, LESSONS_EN, LESSONS_ES, type LessonText } from "@/data/learn/lessons";
import type { LearnUi } from "@/data/learn/ui";
import type { Offer } from "@/engine";
import { mineLine } from "@/lib/learn/mine";
import type { Dictionary } from "@/lib/learn/use-dictionary";
import { Art } from "./Art";
import { Gloss } from "./Gloss";

/** The six short lessons: a card for each, and a dialog that walks one step at a time to a question to check yourself. */
export function Lessons({ dict, ui, offer }: { dict: Dictionary; ui: LearnUi; offer: Offer | null }) {
  const text = dict.lang === "es" ? LESSONS_ES : LESSONS_EN;
  return (
    <section className="lh-lessons" aria-labelledby="lh-lessons-h">
      <h2 id="lh-lessons-h">{ui.lessons.title}</h2>
      <p className="lh-lead">{ui.lessons.lead}</p>
      <ul className="lh-lesson-grid">
        {LESSON_BASE.map((b) => (
          <li key={b.id}>
            <LessonCard base={b} text={text[b.id]} dict={dict} ui={ui} offer={offer} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function LessonCard({ base, text, dict, ui, offer }: { base: (typeof LESSON_BASE)[number]; text: LessonText; dict: Dictionary; ui: LearnUi; offer: Offer | null }) {
  const [step, setStep] = useState(0);
  const [shown, setShown] = useState(false);
  const last = text.steps.length; // the step after the explanations is the check
  const mine = mineLine(base.mine, offer, dict.lang);

  return (
    <Dialog.Root
      onOpenChange={(o) => {
        if (!o) {
          setStep(0);
          setShown(false);
        }
      }}
    >
      <Dialog.Trigger className="lh-lesson">
        <span className="lh-lesson-art">
          <Art k={base.art} />
        </span>
        <span className="lh-lesson-text">
          <b>{text.title}</b>
          <span>{text.goal}</span>
          <small>{ui.lessons.minutes}</small>
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="qf lh-dialog" aria-describedby={undefined}>
          <div className="sheet-head">
            <Dialog.Title className="sheet-title">{text.title}</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label={ui.popover.close}>
              <CloseIcon size={20} />
            </Dialog.Close>
          </div>
          <p className="hint">{ui.lessons.step(step + 1, last + 1)}</p>
          <div className="lh-lesson-body">
            <div className="lh-lesson-pic">
              <Art k={base.art} />
            </div>
            {step < last ? (
              <p className="lh-step">{text.steps[step]}</p>
            ) : (
              <div className="lh-check">
                {mine && (
                  <div className="lh-mine">
                    <span className="lh-label">{ui.lessons.yours}</span>
                    <p>
                      <Nums text={mine} />
                    </p>
                  </div>
                )}
                <span className="lh-label">{ui.lessons.check}</span>
                <p className="lh-q">{text.check.q}</p>
                <Btn variant="ghost" type="button" aria-expanded={shown} onClick={() => setShown((s) => !s)}>
                  {shown ? ui.lessons.hide : ui.lessons.show}
                </Btn>
                {shown && <p className="lh-a">{text.check.a}</p>}
                <span className="lh-label">{ui.lessons.readNext}</span>
                <ul className="lh-related">
                  {base.terms.map((id) => (
                    <li key={id}>
                      <Gloss id={id} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="lh-lesson-nav">
            <Btn variant="ghost" type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} aria-disabled={step === 0}>
              {ui.lessons.prev}
            </Btn>
            {step < last ? (
              <Btn variant="primary" type="button" arrow onClick={() => setStep((s) => s + 1)}>
                {ui.lessons.next}
              </Btn>
            ) : (
              <Dialog.Close asChild>
                <Btn variant="primary" type="button">
                  {ui.lessons.done}
                </Btn>
              </Dialog.Close>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
