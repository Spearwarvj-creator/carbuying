import type { Metadata } from "next";
import { DocPage } from "@/components/site/SitePage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Deal Desk keeps on your device, what leaves it, and what it never stores.",
};

const contents = [
  { id: "short", label: "The short version" },
  { id: "device", label: "What stays on your device" },
  { id: "leaves", label: "What leaves your device" },
  { id: "ai", label: "Planned AI features" },
  { id: "cookies", label: "Cookies and storage" },
  { id: "changes", label: "Changes and questions" },
];

export default function Privacy() {
  return (
    <DocPage current="privacy" title="Privacy" updated="Last updated 9 November 2026" contents={contents}>
      <section id="short" aria-labelledby="short-h">
        <h2 id="short-h">The short version</h2>
        <p>The calculator runs in your browser and sends nothing. There are no accounts, no database of deals, no advertising and no tracking scripts.</p>
        <p>The numbers you type are not saved or sent anywhere. When you close the page, they are gone.</p>
      </section>

      <section id="device" aria-labelledby="device-h">
        <h2 id="device-h">What stays on your device</h2>
        <ul>
          <li>The numbers you enter. They are held in the page while it is open and are never sent to us.</li>
          <li>Your choice of light screen and larger text. These two settings are saved in your browser so the page looks the same next time.</li>
          <li>Your ZIP code, when ZIP lookup arrives. The table that turns a ZIP code into a city and state is part of the page, so the ZIP code is never sent to a server.</li>
        </ul>
      </section>

      <section id="leaves" aria-labelledby="leaves-h">
        <h2 id="leaves-h">What leaves your device</h2>
        <p>Nothing from the calculator does.</p>
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
        <h2 id="ai-h">Planned AI features</h2>
        <p>
          Some planned features use an AI model: reading a photo of a worksheet, checking a contract, explaining a term and a practice conversation.
          They are not available yet. When they are, this is how they will work:
        </p>
        <ul>
          <li>Only what you choose to submit, text or a photo, goes through our server to the model provider.</li>
          <li>Nothing you submit is stored, and request contents are not written to our logs.</li>
          <li>We keep counters for daily limits, without any of the content.</li>
          <li>Before any upload, the screen will tell you to cover your name, address and signature.</li>
          <li>The AI never produces a number on its own. Every figure comes from the calculator.</li>
        </ul>
      </section>

      <section id="cookies" aria-labelledby="cookies-h">
        <h2 id="cookies-h">Cookies and storage</h2>
        <p>Deal Desk sets no cookies. It uses your browser&rsquo;s storage for the two display settings above and nothing else. Clearing your browser&rsquo;s site data removes them.</p>
      </section>

      <section id="changes" aria-labelledby="changes-h">
        <h2 id="changes-h">Changes and questions</h2>
        <p>If this page changes, the date at the top changes with it. For questions, use the contact page at v2stack.com.</p>
      </section>
    </DocPage>
  );
}
