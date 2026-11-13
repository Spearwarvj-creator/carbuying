"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { Btn } from "@/components/ui/Btn";
import { CameraIcon, CheckIcon, LockIcon, MicIcon, SceneCar, SceneDesk, SceneQuote } from "@/components/ui/icons";
import { more } from "@/data/strings/more";
import { links } from "@/lib/links";
import { closeWelcome, useGuide } from "@/lib/onboarding";

const w = more.guide.welcome;

const PATH_ART = [<SceneCar key="c" />, <SceneQuote key="q" />, <SceneDesk key="d" />];

/**
 * The first-visit welcome: three short screens that say what this is, where to start and who does the math. It can be
 * skipped at any time, closed with Escape, and opened again from Help. It never blocks the calculator behind it.
 */
export function Welcome() {
  const { welcome } = useGuide();
  return (
    <Dialog.Root open={welcome} onOpenChange={(o) => !o && closeWelcome()}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="wl" aria-describedby={undefined}>
          <Slides />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Slides() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const slides = w.slides;
  const slide = slides[i];
  const last = i === slides.length - 1;

  return (
    <>
      <div className="wl-top">
        <span className="wl-step">{w.step(i + 1, slides.length)}</span>
        <Dialog.Close className="link wl-skip">{w.skip}</Dialog.Close>
      </div>
      <div className="wl-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={i}
            className="wl-slide"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            {i < 2 && (
            <div className="wl-art" aria-hidden="true">
              {i === 0 && <SceneCar />}
              {i === 1 && (
                <ul className="wl-paths">
                  {PATH_ART.map((a, n) => (
                    <li key={n}>{a}</li>
                  ))}
                </ul>
              )}
            </div>
            )}
            <Dialog.Title asChild>
              <h2 className="wl-title">{slide.title}</h2>
            </Dialog.Title>
            <p className="wl-body">{slide.body}</p>
            {"points" in slide && (
              <ul className="wl-points">
                {slide.points.map((p, n) => (
                  <li key={p}>
                    <span className="wl-pico" aria-hidden="true">
                      {n === 0 && <CheckIcon size={24} />}
                      {n === 1 && (
                        <>
                          <CameraIcon size={22} />
                          <MicIcon size={22} />
                        </>
                      )}
                      {n === 2 && <LockIcon size={24} />}
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}
            {"paths" in slide && (
              <ul className="wl-list">
                {slide.paths.map((p) => (
                  <li key={p.title}>
                    <b>{p.title}</b>
                    <span>{p.body}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="wl-foot">
        <ol className="wl-dots" aria-label={w.label}>
          {slides.map((_, n) => (
            <li key={n} aria-current={n === i ? "step" : undefined} data-on={n === i} />
          ))}
        </ol>
        <div className="wl-actions">
          {i > 0 && (
            <Btn variant="ghost" onClick={() => setI(i - 1)}>
              {w.back}
            </Btn>
          )}
          {last ? (
            <Btn variant="primary" arrow onClick={closeWelcome} autoFocus>
              {w.start}
            </Btn>
          ) : (
            <Btn variant="primary" arrow onClick={() => setI(i + 1)} autoFocus>
              {w.next}
            </Btn>
          )}
        </div>
      </div>
      {last && links.youtube && (
        <a className="link wl-video" href={links.youtube} target="_blank" rel="noopener noreferrer">
          {w.video}
        </a>
      )}
    </>
  );
}
