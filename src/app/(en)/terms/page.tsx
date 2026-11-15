import type { Metadata } from "next";
import { DocPage } from "@/components/site/SitePage";
import { alternates } from "@/lib/site-locale";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for using Deal Desk: estimates, not advice, and what you stay responsible for.",
  alternates: alternates("en", "/terms"),
};

const contents = [
  { id: "what", label: "What Deal Desk is" },
  { id: "advice", label: "Estimates, not advice" },
  { id: "yours", label: "Your numbers, your decision" },
  { id: "data", label: "Information from other services" },
  { id: "use", label: "Using the site" },
  { id: "liability", label: "Limits" },
  { id: "changes", label: "Changes" },
];

export default function Terms() {
  return (
    <DocPage current="terms" path="/terms" title="Terms" updated="Last updated 9 November 2026" contents={contents}>
      <section id="what" aria-labelledby="what-h">
        <h2 id="what-h">What Deal Desk is</h2>
        <p>Deal Desk is a calculator and guide for people buying a car in the United States with a loan. It is a v2stack project. It is not a dealer, a lender, a broker or an adviser, and it does not take part in your purchase.</p>
      </section>

      <section id="advice" aria-labelledby="advice-h">
        <h2 id="advice-h">Estimates, not advice</h2>
        <p>Everything Deal Desk shows is an estimate worked out from the numbers you enter. It is not financial, tax or legal advice. The dealer&rsquo;s contract and your lender&rsquo;s paperwork decide what you actually pay, so check every figure against them before you sign.</p>
        <p>Deal Desk does not know your state&rsquo;s tax rules or fee limits, and it does not know what a fair price is. You enter the tax and fees from your own worksheet.</p>
      </section>

      <section id="yours" aria-labelledby="yours-h">
        <h2 id="yours-h">Your numbers, your decision</h2>
        <p>You choose what to enter and whether to act on what you see. If a number is entered wrongly, the result is wrong. The sentences Deal Desk drafts are suggestions. You decide what to say and whether to buy.</p>
      </section>

      <section id="data" aria-labelledby="data-h">
        <h2 id="data-h">Information from other services</h2>
        <p>Vehicle details, recalls, crash ratings and fuel economy come from public US government services and are shown with their source. They can be out of date or incomplete. For recalls on a specific car, use the official NHTSA recall check with its VIN.</p>
      </section>

      <section id="use" aria-labelledby="use-h">
        <h2 id="use-h">Using the site</h2>
        <p>Use Deal Desk for your own car purchase. Do not try to break it, overload it, or use it to harm others. Features that use AI have daily limits so everyone can use them.</p>
      </section>

      <section id="liability" aria-labelledby="liability-h">
        <h2 id="liability-h">Limits</h2>
        <p>Deal Desk is provided as it is, without a promise that it is always available or free of mistakes. To the extent the law allows, it is not responsible for losses that come from relying on it.</p>
      </section>

      <section id="changes" aria-labelledby="changes-h">
        <h2 id="changes-h">Changes</h2>
        <p>If these terms change, the date at the top changes with them.</p>
      </section>
    </DocPage>
  );
}
