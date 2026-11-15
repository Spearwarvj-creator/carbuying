"use client";

import { en } from "@/data/strings/en";
import { useDeal, useOfferNames, type TabKey } from "@/store/deal";
import { Boxes } from "./Boxes";
import { EntrySheet } from "./EntrySheet";
import { AppFooter } from "./AppFooter";
import { AppHeader } from "./AppHeader";
import { Result, Trail } from "./Result";
import { AskView, CompareView, TargetView } from "./Views";
import { dealFlags } from "@/engine";
import { ai } from "@/data/strings/ai";
import { Btn } from "./ui/Btn";
import { PrintDeal } from "./walk/PrintDeal";
import { ShareDeal } from "./walk/ShareDeal";
import { DealChecks } from "./walk/DealChecks";
import { CashCompare } from "./walk/CashCompare";
import { RateCheck } from "./walk/RateCheck";
import { Matters } from "./learn/Matters";
import { useMediaQuery } from "./use-media-query";
import { DeskBars } from "./walk/charts";

const TABS: TabKey[] = ["deal", "compare", "target", "ask", "checks"];

export function DealScreen() {
  const tab = useDeal((s) => s.tab);
  const setTab = useDeal((s) => s.setTab);
  const example = useDeal((s) => s.example);
  const edited = useDeal((s) => s.edited);
  const offer = useDeal((s) => s.offers[s.editing]);
  const flagCount = dealFlags({ offer }).length;
  const offers = useDeal((s) => s.offers);
  const fromShare = useDeal((s) => s.fromShare);
  const names = useOfferNames();
  const wide = useMediaQuery("(min-width: 900px)");
  const same = offers[0].price > 0 && JSON.stringify(offers[0]) === JSON.stringify(offers[1]);

  return (
    <div className="app">
      <AppHeader tag={example ? (edited ? en.exampleEditedTag : en.exampleTag) : en.yourDealTag} />

      <main className="cols" data-tab={tab}>
        <h1 className="sr-only">{en.deskHeading}</h1>
        <div className="colB">
          <Result />
          {wide && <Matters offer={offer} />}
          <DeskBars />
          <Trail />
        </div>
        <div className="colA">
          {fromShare && (
            <div className="nudge" role="status">
              <p>{ai.share.banner}</p>
              <Btn variant="ghost" onClick={() => useDeal.getState().dismissShare()}>
                {ai.share.dismiss}
              </Btn>
            </div>
          )}
          {same && (
            <div className="nudge">
              <p>{ai.second.text(names[1])}</p>
              <Btn
                variant="primary"
                onClick={() => {
                  useDeal.getState().setEditing(1);
                  useDeal.getState().open("price");
                }}
              >
                {ai.second.button(names[1])}
              </Btn>
            </div>
          )}
          <Boxes />
        </div>
        <div className="colC">
          <DealChecks offer={offer} />
          <CashCompare offer={offer} />
          <RateCheck apr={offer.apr} />
          <div className="deskactions" data-tour="share">
            <PrintDeal />
            <ShareDeal />
          </div>
          <CompareView />
          <TargetView />
          <AskView />
          <AppFooter />
        </div>
        <div className="panel">
          {tab === "compare" && <CompareView />}
          {tab === "target" && <TargetView />}
          {tab === "ask" && <AskView />}
          {tab === "checks" && (
            <>
              <Matters offer={offer} />
              <DealChecks offer={offer} />
          <CashCompare offer={offer} />
          <RateCheck apr={offer.apr} />
              <div className="deskactions" data-tour="share">
                <PrintDeal />
                <ShareDeal />
              </div>
            </>
          )}
          <AppFooter />
        </div>
      </main>

      <nav className="tabs" aria-label={en.sections} data-tour="tabs">
        {TABS.map((k) => (
          <button key={k} type="button" aria-current={tab === k ? "page" : undefined} onClick={() => setTab(k)}>
            {en.tabs[k]}
            {k === "checks" && flagCount > 0 ? ` (${flagCount})` : ""}
          </button>
        ))}
      </nav>

      <EntrySheet />
    </div>
  );
}
