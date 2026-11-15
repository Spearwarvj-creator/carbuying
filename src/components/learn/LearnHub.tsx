"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Segmented } from "@/components/ui/Segmented";
import { CAT_ORDER, type LearnCat, type LearnTerm } from "@/data/learn";
import { UI_EN, UI_ES } from "@/data/learn/ui";
import { initLang, setLang } from "@/lib/i18n";
import { mineLine } from "@/lib/learn/mine";
import { useDictionary, useMyOffer } from "@/lib/learn/use-dictionary";
import { Decode } from "./Decode";
import { Lessons } from "./Lessons";
import { TermCard } from "./TermCard";

const norm = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const subscribeHash = (notify: () => void) => {
  window.addEventListener("hashchange", notify);
  return () => window.removeEventListener("hashchange", notify);
};
const readHash = () => decodeURIComponent(location.hash.slice(1));

/**
 * The Learn hub: six short lessons, a decoder for what the dealer wrote, and an A to Z dictionary of about sixty words,
 * each tied to an everyday picture, a question to ask and, when a deal is open, a line about the reader's own figures.
 * It works in English and Spanish and with no AI. The words come from the dictionary data, the figures from the calculator.
 */
export function LearnHub() {
  useEffect(() => {
    void initLang();
  }, []);
  const dict = useDictionary();
  const ui = dict.lang === "es" ? UI_ES : UI_EN;
  const offer = useMyOffer();
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<LearnCat | "all">("all");
  const [opened, setOpened] = useState<Set<string>>(new Set());

  // A link such as /learn#apr opens that word and brings it into view.
  useEffect(() => {
    if (!hash) return;
    const id = setTimeout(() => {
      setOpened((s) => new Set(s).add(hash));
      document.getElementById(hash)?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }, 250);
    return () => clearTimeout(id);
  }, [hash, dict.lang]);

  const query = norm(q.trim());
  const shown = useMemo(() => {
    return dict.terms.filter((t) => {
      if (cat !== "all" && t.cat !== cat) return false;
      if (!query) return true;
      return [t.term, t.plain, t.meaning, t.daily, ...t.match].some((s) => norm(s).includes(query));
    });
  }, [dict.terms, cat, query]);

  const toggle = (id: string) =>
    setOpened((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const card = (t: LearnTerm) => (
    <li key={t.id}>
      <TermCard
        t={t}
        ui={ui}
        mine={mineLine(t.id, offer, dict.lang)}
        open={opened.has(t.id)}
        onToggle={() => toggle(t.id)}
        related={t.related.flatMap((r) => (dict.byId.get(r) ? [dict.byId.get(r)!] : []))}
        onRelated={(id) => setOpened((s) => new Set(s).add(id))}
      />
    </li>
  );

  return (
    <div className="lh s-wrap">
      <header className="lh-head">
        <div>
          <h1 className="pg-h1">{ui.title}</h1>
          <p className="pg-lead">{ui.lead}</p>
          {ui.beta && <p className="hint lh-beta">{ui.beta}</p>}
        </div>
        <button type="button" className="lh-lang" lang={dict.lang === "en" ? "es" : "en"} onClick={() => void setLang(dict.lang === "en" ? "es" : "en")}>
          {dict.lang === "en" ? "Español" : "English"}
        </button>
      </header>

      <p className="lh-deal" role="status">
        {offer ? ui.usingDeal : ui.noDeal}{" "}
        {!offer && (
          <Link href="/deal" className="link">
            {ui.openCalc}
          </Link>
        )}
      </p>

      <Lessons dict={dict} ui={ui} offer={offer} />
      <Decode dict={dict} ui={ui} offer={offer} />

      <section className="lh-dict" aria-labelledby="lh-dict-h">
        <h2 id="lh-dict-h">A to Z</h2>
        <div className="lh-tools">
          <label htmlFor="lh-search" className="qf-label">
            {ui.searchLabel}
          </label>
          <input id="lh-search" type="search" className="lh-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={ui.searchPlaceholder} autoComplete="off" />
          <Segmented
            variant="chips"
            label={ui.cats.price}
            value={cat}
            onChange={setCat}
            options={[{ value: "all" as const, label: ui.all }, ...CAT_ORDER.map((c) => ({ value: c, label: ui.cats[c] }))]}
          />
          <p className="hint" role="status">
            {ui.count(shown.length)}
          </p>
        </div>

        {shown.length === 0 ? (
          <p className="lh-none">
            {ui.none}{" "}
            <button type="button" className="link" onClick={() => setQ("")}>
              {ui.clear}
            </button>
          </p>
        ) : cat === "all" && !query ? (
          CAT_ORDER.map((c) => {
            const list = shown.filter((t) => t.cat === c);
            return list.length ? (
              <div key={c} className="lh-group">
                <h3 className="lh-group-h">{ui.cats[c]}</h3>
                <ul className="lh-list">{list.map(card)}</ul>
              </div>
            ) : null;
          })
        ) : (
          <ul className="lh-list">{shown.map(card)}</ul>
        )}
        <p className="hint lh-sources">{ui.sources}</p>
      </section>
    </div>
  );
}
