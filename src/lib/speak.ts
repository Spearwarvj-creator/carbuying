"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/** Reads text aloud with the browser's own voice. It works offline and sends nothing anywhere. */
export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

export function speak(text: string, lang: "en" | "es" = "en", onEnd?: () => void) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, " "));
  u.lang = lang === "es" ? "es-US" : "en-US";
  u.rate = 0.92; // a little slower than normal, kinder for a showroom
  u.onend = () => onEnd?.();
  window.speechSynthesis.speak(u);
}

export const stopSpeaking = () => canSpeak() && window.speechSynthesis.cancel();

/** State for a read-aloud button: whether it is speaking now, and the two actions. */
export function useSpeaker() {
  const [speaking, setSpeaking] = useState(false);
  const ok = useSyncExternalStore(
    () => () => {},
    canSpeak,
    () => false,
  );
  useEffect(
    () => () => {
      stopSpeaking();
    },
    [],
  );
  return {
    ok,
    speaking,
    say: (text: string, lang: "en" | "es" = "en") => {
      setSpeaking(true);
      speak(text, lang, () => setSpeaking(false));
    },
    stop: () => {
      stopSpeaking();
      setSpeaking(false);
    },
  };
}
