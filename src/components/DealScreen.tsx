"use client";

import Link from "next/link";
import { en } from "@/data/strings/en";
import { useDeal, type TabKey } from "@/store/deal";
import { Boxes } from "./Boxes";
import { EntrySheet } from "./EntrySheet";
import { Prefs } from "./Prefs";
import { Result, Trail } from "./Result";
import { AskView, CompareView, TargetView } from "./Views";

const TABS: TabKey[] = ["deal", "compare", "target", "ask"];

export function DealScreen() {
  const tab = useDeal((s) => s.tab);
  const setTab = useDeal((s) => s.setTab);
  const example = useDeal((s) => s.example);

  return (
    <div className="app">
      <header className="top">
        <Link href="/" className="brand" aria-label={`${en.appName}, home page`}>
          {en.appName}
        </Link>
        <span className="tag">{example ? en.exampleTag : en.yourDealTag}</span>
        <Prefs />
      </header>

      <main className="cols" data-tab={tab}>
        <div className="colB">
          <Result />
          <Trail />
        </div>
        <div className="colA">
          <Boxes />
        </div>
        <div className="colC">
          <CompareView />
          <TargetView />
          <AskView />
          <p className="note">{en.note}</p>
        </div>
        <div className="panel">
          {tab === "compare" && <CompareView />}
          {tab === "target" && <TargetView />}
          {tab === "ask" && <AskView />}
          <p className="note">{en.note}</p>
        </div>
      </main>

      <nav className="tabs" aria-label="Sections">
        {TABS.map((k) => (
          <button key={k} type="button" aria-current={tab === k ? "page" : undefined} onClick={() => setTab(k)}>
            {en.tabs[k]}
          </button>
        ))}
      </nav>

      <EntrySheet />
    </div>
  );
}
