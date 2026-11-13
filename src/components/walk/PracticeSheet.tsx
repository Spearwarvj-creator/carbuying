"use client";

import { Dialog } from "radix-ui";
import { useRef, useState, type ReactNode } from "react";
import { Btn } from "@/components/ui/Btn";
import { CreditsLeft, LimitReached } from "@/components/ui/Credits";
import { more } from "@/data/strings/more";
import { aiFetch } from "@/lib/ai-status";
import { CloseIcon, MicIcon } from "@/components/ui/icons";
import { ai } from "@/data/strings/ai";
import type { Offer } from "@/engine";
import { getLang } from "@/lib/i18n";
import { useListen } from "@/lib/listen";
import { dealSummary } from "@/lib/summary";
import { ReadAloud } from "./ReadAloud";

const p = ai.practice;

/**
 * The six things the practice looks for, each a simple pattern over what the buyer said. The score is made by
 * these rules, never by the model, so it cannot be talked into saying a buyer did well.
 */
export const RUBRIC: { id: keyof typeof p.rubric; test: RegExp }[] = [
  { id: "writing", test: /\b(in writing|written|put (it|that) in writing|on paper|itemi[sz]ed|por escrito|en papel|detallad[oa])\b/i },
  { id: "without", test: /\b(without (the|that|those|any)|take (it|that|those|them) off|remove (the|that|those)|price (before|without)|just the (car|price)|sin (los|el|esos|ese|extras)|quit[ae] (los|el|eso|esos)|solo el (auto|precio))\b/i },
  { id: "no", test: /\b(no thank|no,? thanks|not interested|i('| a)?ll pass|i decline|i don'?t want|did not ask for|didn'?t ask for|i('| wi)ll skip|no,? gracias|no me interesa|no quiero|no (lo )?pedi|yo no pedi)\b/i },
  { id: "final", test: /\b(not final|financing (falls|fell)|falls? through|isn'?t approved|not approved|spot delivery|contract in transit|if (the )?(loan|financing) (is|isn'?t|does)|no (se )?(aprueba|aprobaron)|financiamiento no|si (el )?(financiamiento|prestamo) (no|falla)|no es definitivo)\b/i },
  { id: "rate", test: /\b(rate|apr|lender|buy rate|who is (the )?(bank|lender)|which (bank|lender)|tasa|prestamista|banco)\b/i },
  { id: "time", test: /\b(time to read|read (it|the contract|everything)|take (it|the contract) home|review (it|the contract)|look it over|think about it|tiempo para (leer|revisar)|leer (el )?contrato|llevar(me)? (el )?contrato|pensarlo)\b/i },
];

/** Accents are dropped before the patterns run, so “préstamo” and “prestamo” are the same word. */
export const unaccent = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

type Msg = { role: "user" | "assistant"; content: string };

export function PracticeSheet({ trigger, offer, quotedPay = 0 }: { trigger: ReactNode; offer: Offer; quotedPay?: number }) {
  const sum = dealSummary(offer, quotedPay);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [limited, setLimited] = useState(false);
  const [done, setDone] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const mic = useListen(setDraft);
  const turns = msgs.filter((m) => m.role === "user").length;

  async function say() {
    const text = draft.trim();
    if (!text || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setDraft("");
    setBusy(true);
    setNote("");
    try {
      const res = await aiFetch("/api/practice", { messages: next.slice(-14), summary: sum.text, figures: sum.figures, lang: getLang() });
      if (res.status === 503) setNote(p.unavailable);
      else if (res.status === 429) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (body.error === "burst") setNote(more.credits.burst);
        else setLimited(true);
      }
      else if (!res.ok) setNote(p.failed);
      else {
        const a = (await res.json()) as { text: string };
        setMsgs([...next, { role: "assistant", content: a.text }]);
      }
    } catch {
      setNote(p.failed);
    } finally {
      setBusy(false);
      setTimeout(() => end.current?.scrollIntoView({ block: "end" }), 50);
    }
  }

  const said = msgs.filter((m) => m.role === "user").map((m) => m.content).join(" \n ");

  return (
    <Dialog.Root
      onOpenChange={(o) => {
        if (!o) {
          setMsgs([]);
          setDraft("");
          setNote("");
          setDone(false);
        }
      }}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="qf" aria-describedby={undefined}>
          <div className="sheet-head">
            <Dialog.Title className="sheet-title">{p.title}</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label={ai.ask.close}>
              <CloseIcon size={20} />
            </Dialog.Close>
          </div>
          {!done && (
            <>
              <p className="hint">{p.intro}</p>
              <div className="qf-chat" aria-live="polite">
                {msgs.map((m, i) => (
                  <div key={i} className="qf-msg" data-role={m.role}>
                    <b>{m.role === "user" ? p.you : p.manager}</b>
                    <p>{m.content}</p>
                    {m.role === "assistant" && <ReadAloud text={m.content} variant="quiet" />}
                  </div>
                ))}
                {busy && <p className="hint">{p.thinking}</p>}
                <div ref={end} />
              </div>
              {limited ? <LimitReached onApplied={() => setLimited(false)} /> : <CreditsLeft />}
              {note && (
                <p className="qf-note" role="status">
                  {note}
                </p>
              )}
              <label htmlFor="practice-say" className="sr-only">
                {p.placeholder}
              </label>
              <textarea id="practice-say" className="qf-text" rows={2} placeholder={p.placeholder} value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={400} />
              <div className="qf-row">
                {mic.supported && (
                  <Btn variant="ghost" icon={<MicIcon size={20} />} onClick={mic.toggle} aria-pressed={mic.listening}>
                    {mic.listening ? p.micStop : p.mic}
                  </Btn>
                )}
                <Btn variant="primary" onClick={say} aria-disabled={busy || !draft.trim() || turns >= p.maxTurns}>
                  {msgs.length === 0 ? p.start : p.send}
                </Btn>
                {turns > 0 && (
                  <Btn variant="quiet" onClick={() => setDone(true)}>
                    {p.end}
                  </Btn>
                )}
              </div>
            </>
          )}
          {done && (
            <div className="qf-body">
              <h3 className="qf-label">{p.scoreTitle}</h3>
              <ul className="qf-score">
                {RUBRIC.map((r) => {
                  const hit = r.test.test(unaccent(said));
                  return (
                    <li key={r.id} data-hit={hit}>
                      <span aria-hidden="true">{hit ? "✓" : "○"}</span>
                      <span>
                        {p.rubric[r.id]}
                        {!hit && <span className="hint"> {p.tip[r.id]}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="hint">{p.scoreNote}</p>
              <Btn
                variant="primary"
                onClick={() => {
                  setMsgs([]);
                  setDone(false);
                }}
              >
                {p.again}
              </Btn>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
