import type { Metadata } from "next";
import { DocPage } from "@/components/site/SitePage";
import { alternates } from "@/lib/site-locale";
import { Nums } from "@/components/Nums";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "How Deal Desk is built to be read and used by everyone, and what we have and have not tested yet.",
  alternates: alternates("en", "/accessibility"),
};

const contents = [
  { id: "aim", label: "What we aim for" },
  { id: "built", label: "What is in place" },
  { id: "tested", label: "What we have tested" },
  { id: "tell", label: "Tell us about a problem" },
];

export default function Accessibility() {
  return (
    <DocPage current="accessibility" path="/accessibility" title="Accessibility" updated="Last updated 14 November 2026" contents={contents}>
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
          <li>Money figures are set in a numeral face with a plain zero. Running text uses Atkinson Hyperlegible, whose zero is slashed on purpose so it is never mistaken for the letter O.</li>
          <li>
            <Nums text="The main controls, the number boxes, keypad keys and buttons, are at least 44 pixels tall. Links inside text and in the footer are at least 24 by 24 pixels, the WCAG 2.2 minimum." />
          </li>
          <li>The number keypad also works from a physical keyboard, and the focus outline is thick and always visible.</li>
          <li>Motion is used to show what changed: numbers counting, bars and blocks filling in, steps sliding, a small 3D car on the home page. All of it is switched off, or drawn as a still picture, when your device asks for reduced motion. The 3D car is decoration and is hidden from screen readers.</li>
          <li>No time limits, no pop-ups, no sounds.</li>
        </ul>
      </section>

      <section id="tested" aria-labelledby="tested-h">
        <h2 id="tested-h">What we have tested</h2>
        <p>
          <Nums text="Every page and every step of the calculator has been checked with an automated audit (axe-core 4) on the dark and light screens at phone and desktop widths, with no violations found on 9 November 2026. Pages have been checked at widths from 320 to 2560 pixels, with larger text on and the light screen on, and do not scroll sideways. The order of the first controls on the home page has been tried with the keyboard. The Spanish pages were checked on 14 November 2026 with the same audit, on the dark screen at desktop width with no violations, and do not scroll sideways at 320 pixels. We have not yet tested with a screen reader or finished a full keyboard-only pass of the calculator. We will list the results here when they are done." />
        </p>
        <p>A high contrast switch is planned.</p>
      </section>

      <section id="tell" aria-labelledby="tell-h">
        <h2 id="tell-h">Tell us about a problem</h2>
        <p>If something is hard to read or use, tell us through the <a href="https://v2stack.com/contact">contact page at v2stack.com</a>. Say what you were trying to do and what device you used, and we will fix it.</p>
      </section>
    </DocPage>
  );
}
