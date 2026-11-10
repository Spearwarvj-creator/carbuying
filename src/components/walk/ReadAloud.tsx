"use client";

import { Btn } from "@/components/ui/Btn";
import { ai } from "@/data/strings/ai";
import { getLang } from "@/lib/i18n";
import { useSpeaker } from "@/lib/speak";

/** A button that reads some text aloud with the browser's voice; hidden where the browser cannot. */
export function ReadAloud({ text, lang = getLang(), variant = "ghost" }: { text: string; lang?: "en" | "es"; variant?: "ghost" | "quiet" }) {
  const s = useSpeaker();
  if (!s.ok) return null;
  return (
    <Btn variant={variant} onClick={() => (s.speaking ? s.stop() : s.say(text, lang))} aria-pressed={s.speaking}>
      {s.speaking ? ai.speak.stop : ai.speak.read}
    </Btn>
  );
}
