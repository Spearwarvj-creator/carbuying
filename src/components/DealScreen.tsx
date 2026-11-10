"use client";

import { en } from "@/data/strings/en";
import { useDeal, type TabKey } from "@/store/deal";
import { Boxes } from "./Boxes";
import { EntrySheet } from "./EntrySheet";
import { AppFooter } from "./AppFooter";
import { AppHeader } from "./AppHeader";
import { Result, Trail } from "./Result";
import { AskView, CompareView, TargetView } from "./Views";

const TABS: TabKey[] = ["deal", "compare", "target", "ask"];

export function DealScreen() {
  const tab = useDeal((s) => s.tab);
  const setTab = useDeal((s) => s.setTab);
  const example = useDeal((s) => s.example);

  return (
    <div className="app">
      <AppHeader tag={example ? en.exampleTag : en.yourDealTag} />

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
          <AppFooter />
        </div>
        <div className="panel">
          {tab === "compare" && <CompareView />}
          {tab === "target" && <TargetView />}
          {tab === "ask" && <AskView />}
          <AppFooter />
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
