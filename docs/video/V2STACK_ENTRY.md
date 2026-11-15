# Deal Desk as No. 6 on v2stack.com

The v2stack.com site code is not on this Mac, so this file is the content to paste, in the same fields your other five products use on https://v2stack.com/projects (read on 15 November 2026). Your own rules from the showcase brief apply: a field you do not have stays empty, a claim that is not in this file is not added, and nothing is invented.

## The entry

| Field | Value |
| --- | --- |
| Number | No. 6 |
| Status chip | Free (or "Free, in beta" or "Live", whichever matches how you want to describe it) |
| Shipped | November 2026 |
| Name | Deal Desk |
| Tagline | A lower payment can still cost you more |
| Summary | A car-deal calculator that shows what each change does to the total, one box at a time. The calculator makes every number; the AI only explains them, and a guard throws away any figure that is not in your deal. |
| Money line | Leave empty. You have not given a competitor price, and the Compass entry shows the pattern for that. |
| Live link | https://carbuying.v2stack.com |
| Watch the build | Add the YouTube link and length once the video is published (the other entries show the length, for example 14:54). Until then, a disabled "Video coming soon" button, as your brief says. |
| Who it is for | People buying a car, especially first-time and nervous buyers |
| What makes it different | The calculator makes every number. The AI only reads, explains and drafts, and a guard throws away any figure it writes that is not in the deal. |
| Free to try | Free. No account. Your numbers stay on your device. 20 free AI uses a day for each visitor. |

## Highlights (the "key features" list)

- A six-question Walk from the dealer's quote to your total, and a Desk to compare two offers side by side.
- Shows what each change did to the total, so a lower payment that costs more is obvious.
- "Ask about this deal": AI answers that use only figures from your deal, underlined on the page, and marked as written by an AI.
- A Learn hub with about 100 plain-language words and six lessons in English and Spanish, and a decoder for what the dealer wrote.
- Spanish pages and a Spanish calculator (beta).
- A Before-you-sign checklist and an out-the-door price helper.
- 293 automated tests, including one that checks the guard throws away an invented number.

## What it deliberately is not

- Not financial or legal advice. It gives estimates from the numbers you enter.
- The AI cannot change a number. If it cannot answer, you see plain sentences from the calculator.
- The Spanish is a beta: a model translated it and another model translated it back to compare. No native speaker has reviewed it yet.
- Not tested with a screen reader. Only automated accessibility checks have been run.
- Photo reading of worksheets has only been tried on generated examples, not real ones.

## Built with

Next.js 16, React 19, TypeScript, Tailwind CSS v4, Zustand, Zod, Three.js, Motion, Radix UI, Vitest, OpenRouter (Claude Haiku 5.5), Upstash Redis, Vercel.

(The stack list is read from `package.json`; the AI model is the app's default. Confirm the Haiku line if you changed the model setting in Vercel.)

## Credit

The 3D car on the Deal Desk home page is a CC0 model by Kenney (kenney.nl). The home page already says so.

## Other lines on the site that change when No. 6 goes live

| Where | Now | Change to |
| --- | --- | --- |
| Home hero | "Five shipped so far, each with a walkthrough on YouTube." | "Six shipped so far..." (after the video is live) |
| Home hero button | "Try the latest build (Kurae)" | "Try the latest build (Deal Desk)" |
| Home, product scroller | "Scroll through the five builds" and five numbered tabs | six, with No. 6 Deal Desk |
| /projects heading | "Five projects, shipped one at a time." | "Six projects, shipped one at a time." |
| /projects | Kurae's "Watch the build ... on YouTube," has no length | add the length when you can; the others show it |
| Card image | Hero, mobile hero and share image for each product | A Deal Desk set. The home page screenshot and the thumbnail in `kit/thumbnail.html` are good sources |

The home page's tool-suite section says "690 free tools in 15 suites". That is separate and does not change.
