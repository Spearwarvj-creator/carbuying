import type { Metadata } from "next";
import { DocPage } from "@/components/site/SitePage";
import { Nums } from "@/components/Nums";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "How Deal Desk is built to be read and used by everyone, and what we have and have not tested yet.",
};

const contents = [
  { id: "aim", label: "What we aim for" },
  { id: "built", label: "What is in place" },
  { id: "tested", label: "What we have tested" },
  { id: "tell", label: "Tell us about a problem" },
];

export default function Accessibility() {
  return (
    <DocPage current="accessibility" title="Accessibility" updated="Last updated 9 November 2026" contents={contents}>
      <section id="aim" aria-labelledby="aim-h">
        <h2 id="aim-h">What we aim for</h2>
        <p>Deal Desk is for people who may never have bought a car, and for older buyers, often in a bright showroom, on a phone, under pressure. We aim to meet <Nums text="WCAG 2.2" /> level AA.</p>
      </section>

      <section id="built" aria-labelledby="built-h">
        <h2 id="built-h">What is in place</h2>
        <ul>
          <li>A larger text switch and a light screen, both saved on your device. The dark screen is the default.</li>
          <li>
            <Nums
              text={`Colour pairs measured on the dark screen: main text 15.56 to 1, secondary text 10.18 to 1, the red for “you pay more” 7.73 to 1, the green for “you pay less” 9.99 to 1, and the yellow total 10.77 to 1. WCAG asks for 4.5 to 1.`}
            />
          </li>
          <li>Colour is never the only signal. Every change carries a plus or minus sign and a drawn arrow.</li>
          <li>Money is set in a numeral face with a plain zero, so a zero is never confused with a slashed one.</li>
          <li>
            <Nums text="The main controls, the number boxes, keypad keys and buttons, are at least 44 pixels tall." />
          </li>
          <li>The number keypad also works from a physical keyboard, and the focus outline is thick and always visible.</li>
          <li>One animation, the bars drawing in, and it is switched off when your device asks for reduced motion.</li>
          <li>No time limits, no pop-ups, no sounds.</li>
        </ul>
      </section>

      <section id="tested" aria-labelledby="tested-h">
        <h2 id="tested-h">What we have tested</h2>
        <p>
          <Nums text="The calculator screen has been checked at phone sizes from 320 by 568 pixels and on desktop, and it does not scroll sideways. We have not yet finished testing with screen readers or a full keyboard-only pass, and we have not yet run an automated accessibility audit. We will list the results here when they are done." />
        </p>
        <p>A high contrast switch is planned.</p>
      </section>

      <section id="tell" aria-labelledby="tell-h">
        <h2 id="tell-h">Tell us about a problem</h2>
        <p>If something is hard to read or use, tell us through the contact page at v2stack.com. Say what you were trying to do and what device you used, and we will fix it.</p>
      </section>
    </DocPage>
  );
}
