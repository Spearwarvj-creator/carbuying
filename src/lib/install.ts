"use client";

import { useSyncExternalStore } from "react";

/** The browser's offer to add the site to the home screen, kept until the buyer taps the button. Only Chromium browsers send it. */
interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: InstallPrompt | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as InstallPrompt;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    emit();
  });
}

export async function install() {
  const p = deferred;
  if (!p) return;
  await p.prompt();
  await p.userChoice;
  deferred = null;
  emit();
}

export function useCanInstall(): boolean {
  return useSyncExternalStore(
    (notify) => {
      listeners.add(notify);
      return () => listeners.delete(notify);
    },
    () => deferred !== null,
    () => false,
  );
}
