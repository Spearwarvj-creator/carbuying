"use client";

import { useEffect } from "react";

/**
 * Registers the service worker in the production build, then tells it which files this page has already loaded so they
 * are kept for offline use. Nothing is registered while developing, where a cache would hide changes.
 */
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const run = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        const reg = await navigator.serviceWorker.ready;
        const urls = performance.getEntriesByType("resource").map((e) => e.name);
        reg.active?.postMessage({ type: "cache-urls", urls });
      } catch {
        /* no service worker (private window, old browser): the site works as usual */
      }
    };
    if (document.readyState === "complete") void run();
    else window.addEventListener("load", () => void run(), { once: true });
  }, []);
  return null;
}
