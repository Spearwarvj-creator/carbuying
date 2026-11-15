"use client";

import { useRef, useState } from "react";
import { Nums } from "@/components/Nums";
import { Btn } from "@/components/ui/Btn";
import { CreditsLeft, LimitReached } from "@/components/ui/Credits";
import { CameraIcon } from "@/components/ui/icons";
import type { LearnUi } from "@/data/learn/ui";
import type { Offer } from "@/engine";
import { aiFetch, useAiOn } from "@/lib/ai-status";
import { shrink } from "@/lib/image";
import { segment, termsIn } from "@/lib/learn/gloss";
import { mineLine } from "@/lib/learn/mine";
import type { Dictionary } from "@/lib/learn/use-dictionary";
import { dealSummary } from "@/lib/summary";
import { Art } from "./Art";
import { Gloss } from "./Gloss";

/**
 * "Decode what the dealer wrote". Paste a quote, a message or a contract line, or photograph it. Every car-buying word in
 * it is underlined and explained, with no AI and no network. If AI is on, "Say it in plain words" also writes what the
 * dealer most likely means and what to ask; a number the AI adds that is not in the text or the buyer's deal is thrown away.
 */
export function Decode({ dict, ui, offer }: { dict: Dictionary; ui: LearnUi; offer: Offer | null }) {
  const aiOn = useAiOn();
  const [text, setText] = useState("");
  const [decoded, setDecoded] = useState("");
  const [plain, setPlain] = useState("");
  const [busy, setBusy] = useState<"" | "translate" | "photo">("");
  const [note, setNote] = useState("");
  const [limited, setLimited] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const d = ui.decode;

  const ids = decoded ? termsIn(decoded, dict.entries) : [];
  const pieces = decoded ? segment(decoded, dict.entries, false) : [];

  function run(value = text) {
    setDecoded(value.trim());
    setPlain("");
    setNote("");
  }

  async function translate() {
    if (!decoded) return;
    setBusy("translate");
    setNote("");
    try {
      const sum = offer ? dealSummary(offer) : null;
      const res = await aiFetch("/api/translate", { text: decoded.slice(0, 1200), lang: dict.lang, deal: sum?.text ?? "", figures: sum?.figures ?? [] });
      if (res.status === 429) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (body.error !== "burst") setLimited(true);
        return;
      }
      if (!res.ok) return setNote(d.failed);
      const a = (await res.json()) as { text: string; source: string };
      if (a.source === "ai" && a.text) setPlain(a.text);
      else setNote(d.failed);
    } catch {
      setNote(d.failed);
    } finally {
      setBusy("");
    }
  }

  async function onPhoto(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy("photo");
    setNote("");
    try {
      const image = await shrink(files[0]);
      const res = await aiFetch("/api/extract", { kind: "text", images: [image] });
      const data = (await res.json()) as { text?: string; message?: string; error?: string };
      if (res.status === 429 && data.error === "limit") return setLimited(true);
      if (!res.ok || !data.text) return setNote(data.message ?? d.failed);
      setText(data.text);
      run(data.text);
    } catch {
      setNote(d.failed);
    } finally {
      setBusy("");
      if (file.current) file.current.value = "";
    }
  }

  return (
    <section className="lh-decode" id="decode" aria-labelledby="lh-decode-h">
      <h2 id="lh-decode-h">{d.title}</h2>
      <p className="lh-lead">{d.lead}</p>
      <label htmlFor="lh-decode-in" className="qf-label">
        {d.label}
      </label>
      <textarea id="lh-decode-in" className="qf-text" rows={4} maxLength={1200} placeholder={d.placeholder} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="qf-row">
        <Btn variant="primary" type="button" onClick={() => run()} aria-disabled={!text.trim()}>
          {d.button}
        </Btn>
        <Btn
          variant="ghost"
          type="button"
          onClick={() => {
            setText(d.sampleText);
            run(d.sampleText);
          }}
        >
          {d.sample}
        </Btn>
        {aiOn && (
          <>
            <input ref={file} type="file" accept="image/*" capture="environment" className="sr-only" id="lh-photo" aria-label={d.photo} onChange={(e) => void onPhoto(e.target.files)} />
            <Btn variant="ghost" type="button" icon={<CameraIcon size={20} />} onClick={() => file.current?.click()} aria-disabled={busy === "photo"}>
              {busy === "photo" ? d.reading : d.photo}
            </Btn>
          </>
        )}
      </div>
      <p className="hint">{d.privacy}</p>

      {decoded && (
        <div className="lh-result" aria-live="polite">
          <p className="lh-found">{ids.length ? d.found(ids.length) : d.none}</p>
          {ids.length > 0 && (
            <>
              <p className="lh-decoded">
                {pieces.map((p, i) =>
                  p.id ? (
                    <Gloss key={i} id={p.id}>
                      {p.text}
                    </Gloss>
                  ) : (
                    <span key={i}>{p.text}</span>
                  ),
                )}
              </p>
              <ul className="lh-found-list">
                {ids.map((id) => {
                  const t = dict.byId.get(id)!;
                  const mine = mineLine(id, offer, dict.lang);
                  return (
                    <li key={id}>
                      <span className="lh-found-art">
                        <Art k={t.art} />
                      </span>
                      <div>
                        <b>{t.term}</b>
                        <p>{t.plain}</p>
                        <p className="lh-daily-small">{t.daily}</p>
                        {mine && (
                          <p className="lh-mine-small">
                            <Nums text={mine} />
                          </p>
                        )}
                        <a href={`#${id}`} className="link">
                          {ui.open}
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          {aiOn && (
            <div className="lh-translate">
              <Btn variant="ghost" type="button" onClick={() => void translate()} aria-disabled={busy === "translate"}>
                {busy === "translate" ? d.translating : d.translate}
              </Btn>
              {limited ? <LimitReached onApplied={() => setLimited(false)} /> : <CreditsLeft />}
              {note && (
                <p className="qf-note" role="status">
                  {note}
                </p>
              )}
              {plain && (
                <div className="qf-answer">
                  <span className="lh-label">{d.plainTitle}</span>
                  <p>{plain}</p>
                  <p className="hint">{d.aiNote}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {!decoded && note && (
        <p className="qf-note" role="status">
          {note}
        </p>
      )}
    </section>
  );
}
