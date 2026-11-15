"use client";

import { Dialog } from "radix-ui";
import { useState, type ReactNode } from "react";
import { Btn } from "@/components/ui/Btn";
import { CloseIcon } from "@/components/ui/icons";
import { Segmented } from "@/components/ui/Segmented";
import { ai } from "@/data/strings/ai";
import { aiFetch, useAiOn } from "@/lib/ai-status";
import { CreditsLeft, LimitReached } from "@/components/ui/Credits";
import { more } from "@/data/strings/more";
import { getLang } from "@/lib/i18n";
import { AutoGloss } from "@/components/learn/Gloss";
import { ReadAloud } from "./ReadAloud";

const t = ai.ask;

/**
 * "Explain this": the plain explanation of one check or term is shown at once, with no AI. The buyer can then ask
 * a question in their own words, or ask for Spanish; a model writes the answer from that fixed text and the deal's
 * figures, and the numbers guard on the server throws it away if it brings a number of its own.
 */
export function AskSheet({ trigger, topic, title, context, figures }: { trigger: ReactNode; topic: string; title: string; context: string; figures: number[] }) {
  const aiOn = useAiOn();
  const [lang, setLang] = useState<"en" | "es">(getLang());
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<{ text: string; source: "ai" | "template" } | null>(null);
  const [note, setNote] = useState("");
  const [limited, setLimited] = useState(false);

  async function send(q: string) {
    setBusy(true);
    setNote("");
    try {
      const res = await aiFetch("/api/ask", { topic, question: q || t.questions[2], lang, context, figures });
      if (res.status === 429) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (body.error === "burst") setNote(more.credits.burst);
        else setLimited(true);
      }
      else if (!res.ok) setNote(t.failed);
      else setAnswer((await res.json()) as { text: string; source: "ai" | "template" });
    } catch {
      setNote(t.failed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog.Root
      onOpenChange={(o) => {
        if (!o) {
          setAnswer(null);
          setNote("");
          setLimited(false);
          setQuestion("");
        }
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="qf" aria-describedby={undefined}>
          <div className="sheet-head">
            <Dialog.Title className="sheet-title">{title}</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label={t.close}>
              <CloseIcon size={20} />
            </Dialog.Close>
          </div>
          <p className="qf-fixed">{context}</p>
          {!aiOn && <ReadAloud text={context} />}
          {aiOn && (
          <div className="qf-body">
            <Segmented variant="chips" label={t.language} value={lang} onChange={setLang} options={[{ value: "en", label: "English" }, { value: "es", label: "Español" }]} />
            <ul className="qf-chips">
              {t.questions.map((q) => (
                <li key={q}>
                  <Btn variant="ghost" onClick={() => send(q)} aria-disabled={busy}>
                    {q}
                  </Btn>
                </li>
              ))}
            </ul>
            <label htmlFor="ask-q" className="sr-only">
              {t.placeholder}
            </label>
            <textarea id="ask-q" className="qf-text" rows={2} placeholder={t.placeholder} value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={300} />
            <Btn variant="primary" onClick={() => send(question)} aria-disabled={busy}>
              {busy ? t.working : t.send}
            </Btn>
            {limited ? <LimitReached onApplied={() => setLimited(false)} /> : <CreditsLeft />}
            {note && (
              <p className="qf-note" role="status">
                {note}
              </p>
            )}
            {answer && (
              <div className="qf-answer" aria-live="polite">
                <p>
                  <AutoGloss text={answer.text} />
                </p>
                <p className="hint">{answer.source === "ai" ? t.ai : t.template}</p>
                <ReadAloud text={answer.text} lang={lang} />
              </div>
            )}
          </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
