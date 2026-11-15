"use client";

import { useSyncExternalStore } from "react";
import { en } from "@/data/strings/en";
import { more } from "@/data/strings/more";
import { setDetail, useDetail } from "@/lib/detail";
import { setLang, useLang } from "@/lib/i18n";

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private window or blocked storage: the switch still works for this visit */
  }
}

function subscribe(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-text", "data-theme"] });
  return () => observer.disconnect();
}

const isLarge = () => document.documentElement.dataset.text === "large";
const isLight = () => document.documentElement.dataset.theme === "light";

/**
 * Larger text and a light screen. The saved choice is applied before the first
 * paint by a small script in the layout; the page root attributes are the source
 * of truth, so these buttons only read and change them.
 */
export function Prefs({ language = false }: { language?: boolean }) {
  const lang = useLang();
  const detail = useDetail();
  const large = useSyncExternalStore(subscribe, isLarge, () => false);
  const light = useSyncExternalStore(subscribe, isLight, () => false);

  function toggleText() {
    if (large) delete document.documentElement.dataset.text;
    else document.documentElement.dataset.text = "large";
    save("dd-text", large ? "normal" : "large");
  }

  function toggleTheme() {
    if (light) delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = "light";
    save("dd-theme", light ? "dark" : "light");
  }

  return (
    <span className="tools">
      {language && (
        <button type="button" lang={lang === "en" ? "es" : "en"} aria-label={lang === "en" ? more.lang.es : more.lang.en} onClick={() => void setLang(lang === "en" ? "es" : "en")}>
          {lang === "en" ? "ES" : "EN"}
        </button>
      )}
      {language && (
        <button type="button" aria-pressed={detail === "simple"} aria-label={`${more.detail.simple}: ${detail === "simple" ? more.detail.simpleNote : more.detail.switchTo}`} onClick={() => setDetail(detail === "simple" ? "full" : "simple")}>
          {detail === "simple" ? more.detail.simpleShort : more.detail.fullShort}
        </button>
      )}
      <button type="button" aria-pressed={large} aria-label={`A+ ${en.largerText.toLowerCase()}`} title={en.largerText} onClick={toggleText}>
        A+
      </button>
      <button type="button" aria-label={light ? en.darkScreen : en.lightScreen} title={light ? en.darkScreen : en.lightScreen} onClick={toggleTheme}>
        <span className="txt">{light ? en.darkScreen : en.lightScreen}</span>
        <svg className="ico" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
          <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M10 3a7 7 0 0 1 0 14z" fill="currentColor" />
        </svg>
      </button>
    </span>
  );
}
