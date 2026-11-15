"use client";

import { Dialog } from "radix-ui";
import { useState, type ReactNode } from "react";
import { AutoGloss } from "@/components/learn/Gloss";
import { Btn } from "@/components/ui/Btn";
import { CreditsLeft, LimitReached } from "@/components/ui/Credits";
import { CloseIcon } from "@/components/ui/icons";
import { more } from "@/data/strings/more";
import { dealFlags, type Offer } from "@/engine";
import { aiFetch, useAiOn } from "@/lib/ai-status";
import { getLang } from "@/lib/i18n";
import { whatIfs } from "@/lib/learn/whatif";
import { dealSummary } from "@/lib/summary";
import { ReadAloud } from "./ReadAloud";

const t = more.askDeal;

interface Turn {
  q: string;
  a: string;
  source: "ai" | "template";
}

/**
 * Ask about this deal, and "Explain this screen". The buyer's whole deal goes to the model as the only set of facts, with
 * the checks that apply, and the last question or two so a follow-up makes sense. The model chooses words only: a figure
 * that is not in the deal throws the answer away and the deal is shown in plain sentences instead.
 */
export function AskDeal({ offer, quotedPay = 0, trigger, preset }: { offer: Offer; quotedPay?: number; trigger: ReactNode; preset?: "screen" }) {
  const aiOn = useAiOn();
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [limited, setLimited] = useState(false);
  const [note, setNote] = useState("");

  const sum = dealSummary(offer, quotedPay);
  const flags = dealFlags({ offer, quotedPay });
  const what = whatIfs(offer);
  const context = `${sum.text}${flags.length ? ` Checks: ${flags.map((f) => f.title).join("; ")}.` : ""} ${what.text}`.slice(0, 1200);
  const figures = [...sum.figures, ...flags.flatMap((f) => f.figures), ...what.figures];

  async function send(q: string, topic: "deal" | "screen" = "deal") {
    const text = q.trim();
    if (!text || busy) return;
    setBusy(true);
    setNote("");
    try {
      const history = turns.slice(-2).map((x) => ({ q: x.q.slice(0, 200), a: x.a.slice(0, 500) }));
      const res = await aiFetch("/api/ask", { topic, question: text.slice(0, 300), lang: getLang(), context, figures, history });
      if (res.status === 429) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (body.error === "burst") setNote(more.credits.burst);
        else setLimited(true);
        return;
      }
      if (!res.ok) return setNote(t.failed);
      const a = (await res.json()) as { text: string; source: "ai" | "template" };
      setTurns((s) => [...s, { q: text, a: a.text, source: a.source }]);
      setQuestion("");
    } catch {
      setNote(t.failed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog.Root
      onOpenChange={(o) => {
        if (o && preset === "screen" && turns.length === 0) void send(t.screenQuestion, "screen");
        if (!o) {
          setNote("");
          setLimited(false);
        }
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="qf" aria-describedby={undefined}>
          <div className="sheet-head">
            <Dialog.Title className="sheet-title">{preset === "screen" ? t.screen : t.title}</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label={t.close}>
              <CloseIcon size={20} />
            </Dialog.Close>
          </div>
          {preset !== "screen" && <p className="hint">{t.intro}</p>}
          <p className="qf-fixed">{sum.text}</p>
          {aiOn && (
            <div className="qf-body">
              {turns.length > 0 && (
                <div className="qf-chat" aria-live="polite">
                  <span className="lh-label">{t.earlier}</span>
                  {turns.map((x, i) => (
                    <div key={i} className="qf-msg" data-role="assistant">
                      <b>{x.q}</b>
                      <p>
                        <AutoGloss text={x.a} />
                      </p>
                      <p className="hint">{x.source === "ai" ? t.ai : t.template}</p>
                      <ReadAloud text={x.a} lang={getLang()} variant="quiet" />
                    </div>
                  ))}
                </div>
              )}
              {preset !== "screen" && (
                <>
                  <ul className="qf-chips">
                    {t.chips.map((c) => (
                      <li key={c}>
                        <Btn variant="ghost" type="button" onClick={() => void send(c)} aria-disabled={busy}>
                          {c}
                        </Btn>
                      </li>
                    ))}
                  </ul>
                  <label htmlFor="askdeal-q" className="sr-only">
                    {t.placeholder}
                  </label>
                  <textarea id="askdeal-q" className="qf-text" rows={2} maxLength={300} placeholder={t.placeholder} value={question} onChange={(e) => setQuestion(e.target.value)} />
                  <Btn variant="primary" type="button" onClick={() => void send(question)} aria-disabled={busy || !question.trim()}>
                    {busy ? t.working : t.send}
                  </Btn>
                </>
              )}
              {preset === "screen" && busy && <p className="hint">{t.working}</p>}
              {limited ? <LimitReached onApplied={() => setLimited(false)} /> : <CreditsLeft />}
              {note && (
                <p className="qf-note" role="status">
                  {note}
                </p>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
