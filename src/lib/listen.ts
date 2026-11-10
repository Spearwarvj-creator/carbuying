"use client";

import { useRef, useState } from "react";

/** The browser's speech service, where it has one. Chrome and Safari do; Firefox does not. In Chrome and Safari the audio may go to the browser maker. */
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type Ctor = new () => Recognition;

export const canListen = () => {
  if (typeof window === "undefined") return false;
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor };
  return Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition);
};

/** Speech to text for one short utterance. `onText` receives the whole phrase so far; `error` says why it stopped. */
export function useListen(onText: (text: string) => void, lang: "en" | "es" = "en") {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<"denied" | "unsupported" | null>(null);
  const rec = useRef<Recognition | null>(null);
  return {
    listening,
    error,
    supported: canListen(),
    toggle: () => {
      if (listening) return rec.current?.stop();
      const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor };
      const C = w.SpeechRecognition ?? w.webkitSpeechRecognition;
      if (!C) return setError("unsupported");
      const r = new C();
      r.lang = lang === "es" ? "es-US" : "en-US";
      r.continuous = false;
      r.interimResults = true;
      r.onresult = (e) => onText(Array.from(e.results, (x) => x[0].transcript).join(" "));
      r.onerror = (e) => {
        setError(e.error === "not-allowed" || e.error === "service-not-allowed" ? "denied" : "unsupported");
        setListening(false);
      };
      r.onend = () => setListening(false);
      rec.current = r;
      setError(null);
      setListening(true);
      r.start();
    },
  };
}
