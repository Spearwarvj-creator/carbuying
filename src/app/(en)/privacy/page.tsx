import type { Metadata } from "next";
import { DocPage } from "@/components/site/SitePage";
import { alternates } from "@/lib/site-locale";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Deal Desk keeps on your device, what leaves it, and what it never stores.",
  alternates: alternates("en", "/privacy"),
};

const contents = [
  { id: "short", label: "The short version" },
  { id: "device", label: "What stays on your device" },
  { id: "leaves", label: "What leaves your device" },
  { id: "ai", label: "Free AI uses and limits" },
  { id: "cookies", label: "Cookies and storage" },
  { id: "changes", label: "Changes and questions" },
];

export default function Privacy() {
  return (
    <DocPage current="privacy" path="/privacy" title="Privacy" updated="Last updated 9 November 2026" contents={contents}>
      <section id="short" aria-labelledby="short-h">
        <h2 id="short-h">The short version</h2>
        <p>The calculator runs in your browser and sends nothing. There are no accounts, no database of deals, no advertising and no tracking scripts.</p>
        <p>The numbers you type are not saved or sent anywhere. When you close the page, they are gone.</p>
      </section>

      <section id="device" aria-labelledby="device-h">
        <h2 id="device-h">What stays on your device</h2>
        <ul>
          <li>The numbers you enter. They are held in the page while it is open and are never sent to us.</li>
          <li>Your choice of light screen, larger text, and whether you last used the Walk or the Desk. These three settings are saved in your browser so the page looks the same next time.</li>
          <li>A deal you choose to save. The button says &ldquo;Save on this device&rdquo;; it is kept in your browser only, never sent anywhere, and you can delete it. Nothing is saved unless you press it.</li>
          <li>Your ZIP code, if you type one to see your state&rsquo;s sales tax. The table that turns a ZIP code into a city and state is part of the page, so the ZIP code is never sent to a server.</li>
        </ul>
      </section>

      <section id="leaves" aria-labelledby="leaves-h">
        <h2 id="leaves-h">What leaves your device</h2>
        <p>Nothing from the calculator does. Two optional helpers do, and only when you use them:</p>
        <ul>
          <li>
            <b>Photos of paperwork.</b> A worksheet, a lender letter, the pages of a contract (up to four) or the car&rsquo;s VIN label. Each photo is shrunk on your phone, then sent to our server and on to an AI reader that returns the numbers it can see. It is not stored, and the request is not logged. Cover your name, address and signature first. You check every number before it is used.
          </li>
          <li>
            <b>Explain this, reword the ask, and practise.</b> When you use these, the text of the check you tapped, your question, and the deal&rsquo;s figures go to our server and on to an AI model through OpenRouter to write the answer. The model writes words only: every number it may use comes from the calculator, and an answer that brings a number of its own is thrown away. Nothing is stored and requests are not logged. Anything an AI wrote is marked as AI-written. Without the helper switched on, the standard text shows instead.
          </li>
          <li>
            <b>Talking.</b> The microphone button uses your browser&rsquo;s own speech service. In Chrome and Safari that service may send your voice to the browser maker (Google or Apple) to turn it into text; Deal Desk does not receive the audio. If you would rather not, type the numbers, or use the microphone key on your keyboard.
          </li>
        </ul>
        <p>
          When vehicle lookup arrives, a VIN, or a year, make and model, will go to our server. The server asks the public vehicle services of the
          US government (NHTSA for vehicle details, recalls and crash ratings, and the Department of Energy for fuel economy) and returns the answer.
          Answers are kept for a short time, up to a day, so the same question is not asked twice. They are filed by vehicle, not by person.
        </p>
        <p>
          Like any website, the service that delivers these pages may record standard technical details of each request, such as the time, the
          page and the network address. We do not use them to identify you.
        </p>
      </section>

      <section id="ai" aria-labelledby="ai-h">
        <h2 id="ai-h">Free AI uses and limits</h2>
        <p>
          The AI helpers cost money to run, so each visitor gets a number of free uses a day. A question, a reword or a practice turn uses one, and a photo uses two.
          The calculator, the checks and typing or saying your numbers never use any. The count comes back every day at midnight UTC.
        </p>
        <ul>
          <li>To keep the count we use a one-way hash of the network address, mixed with the date, so it changes every day and cannot be turned back into the address. The count is deleted after two days.</li>
          <li>To slow a burst of requests, the address is held in the server&rsquo;s memory for up to a minute. It is not written anywhere.</li>
          <li>Nothing you submit is stored, and request contents are not written to our logs.</li>
          <li>The AI never produces a number on its own. Every figure comes from the calculator.</li>
          <li>If you run out and ask us for more, we may give you a code. It is kept in your browser (name: dd-boost) and sent with your AI requests so the server can raise your daily limit.</li>
        </ul>
      </section>

      <section id="cookies" aria-labelledby="cookies-h">
        <h2 id="cookies-h">Cookies and storage</h2>
        <p>Deal Desk sets no cookies. It uses your browser&rsquo;s storage for your settings (names: dd-theme, dd-text, dd-mode, dd-lang), a note of which welcome screens you have seen (dd-seen), a code for more AI uses if we gave you one (dd-boost), and, only if you press Save, one saved deal (dd-saved). Clearing your browser&rsquo;s site data removes them.</p>
        <p>While you work, the numbers you have entered and the step you are on are also kept in this tab&rsquo;s session storage (name: dd-session), so a refresh does not lose them. It stays on your device, is never sent anywhere, and is cleared when you close the tab. The address of a Walk step holds only the step number.</p>
        <p>To work with a weak signal, Deal Desk saves its own pages, images and scripts on your device with a service worker (the cache names start with dd-v1). It saves nothing you type, and it does not save car lookups or AI answers.</p>
      </section>

      <section id="changes" aria-labelledby="changes-h">
        <h2 id="changes-h">Changes and questions</h2>
        <p>If this page changes, the date at the top changes with it. For questions, use the <a href="https://v2stack.com/contact">contact page at v2stack.com</a>.</p>
      </section>
    </DocPage>
  );
}
