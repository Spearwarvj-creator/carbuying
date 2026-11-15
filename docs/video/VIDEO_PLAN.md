# Deal Desk video plan (v2stack week 6)

Channel: https://www.youtube.com/@v2_stack. Promise on the channel page: "One real product a week, not a demo, the actual thing, live." Recent videos run 10:14 to 14:54 and are titled "I Built X (Free ...)". This one is capped at 11:00 so it never goes over 12:00.

## Before you press record (blockers found in the live audit, 15 November 2026)

| # | Item | Why it matters on camera | State |
| --- | --- | --- | --- |
| 1 | The AI answers on https://carbuying.v2stack.com fall back to plain sentences ("The AI helper is off or could not answer"). `/api/status` says AI is on, and the same key and model work from this Mac, so the key stored in Vercel is the likely cause. | The AI section cannot be filmed live until it answers. | Open. Re-enter `OPENROUTER_API_KEY` in Vercel (no quote marks, no spaces), redeploy, ask a question on the site. |
| 2 | In the Desk, with only Offer 1 filled in, the headline said "$—" and "Enter the price from the dealer's worksheet to start." | Looks broken in a demo. | Fixed in the working tree (new line: "Offer 1 is filled in. Enter the price on Offer 2 to see what changed."). Not pushed yet. Film the Desk after it deploys, or fill both offers. |
| 3 | The first-visit guide and the Desk tour open on first load. | They cover the screen. | Click Skip once before recording, or record in a window that has already seen them. |

Everything else checked out on production: all 14 pages return 200 with the right language, the 404 pages work, the walk's figures match a hand calculation ($603 a month, $38,189 in total, $6,089 of interest on the example below), Spanish switches in place, there is no sideways scroll at 375 px, and the console has no errors.

## The one idea

A lower monthly payment can still cost you more, and the dealer talks about the payment. Deal Desk makes every number with a calculator, and the AI only explains them. Everything in the video proves one of those two things.

## Title (pick one)

1. I Built a Car Deal Calculator That Won't Let AI Make Up Numbers (Free)
2. The Car Payment Trick Dealers Use, and the Free Tool I Built to See It
3. I Built a Free Car Deal Checker for People Who Have Never Bought a Car

Recommended: 1. It follows the channel's pattern and carries the channel's own claim (AI that won't guess).

Thumbnail: the landing page's two big numbers side by side, "$491 a month" in green and "$44,239 in total" in yellow, with the three words "Lower payment. Higher cost." No face needed, no arrows, no stars. It is the real product, which is the channel's promise.

## Timeline (target 10:40)

| Time | Section | On screen | Cut if long |
| --- | --- | --- | --- |
| 0:00 to 0:35 | Hook | Landing page, slider dragged from 36 to 84 months while the payment falls and the total climbs | |
| 0:35 to 1:30 | What it is, and the one rule | Landing, then the "calculator makes the numbers, AI only explains" line from About | |
| 1:30 to 4:30 | Live walk with a real quote | `/deal`, I have a quote, six steps: $30,000, 7% tax, no extras, 7.5% for 60 months, $2,000 down. Show Your deal: $603 a month, $38,189 total, 16 in 100 is interest. Open "Show these figures as a table". Open "Things to check". | Skip Extras step talk |
| 4:30 to 5:30 | The Desk | Open the Desk. Offer 1 as the dealer's first quote, Offer 2 as the revised one (84 months). Show the payment falling and the total rising: the trick. | |
| 5:30 to 6:45 | The AI, and the guard | Ask about this deal. Show the answer with underlined figures. Then the guard test file, and the "AI can reword it but cannot change a number" line. | Keep the test to 10 seconds |
| 6:45 to 7:45 | Learn and Spanish | `/learn`: six lessons, the open word list, search. Switch to Spanish in place on the calculator, then `/es`. | |
| 7:45 to 9:00 | The redesign, with proof | `docs/research/COMPONENT_RESEARCH.md` and a few of the 237 screenshots. Then before and after (see below). | |
| 9:00 to 10:00 | How I checked it | Terminal: 289 tests passing. axe audit with no violations. The 404 story: the code was fine, the Vercel project settings were left over from the old project. | |
| 10:00 to 10:40 | What is not done, and next week | Plain list, then the link | |

For "before", run the previous commit next to the new one so the comparison is real, not remembered:

```bash
cd /Users/vijaychilaka/Downloads/startup-ideas/deal-desk
git worktree add ../deal-desk-before a3db356
cd ../deal-desk-before && npm install && npx next dev -p 3200
```

Record the same page (How it works, Learn, the walk's Your deal step) at the same width on port 3200 and on the live site. Remove it afterwards with `git worktree remove ../deal-desk-before`.

## Honest limits to say out loud (the channel's brand is "not a demo")

- The Spanish is a beta. A model translated it and another model back-translated it. No native speaker has reviewed it yet, and the site says so.
- It has not been tested with a screen reader. The automated audit passes.
- The AI helper has a daily free limit per visitor. If it cannot answer, the page shows plain sentences made by the calculator instead.
- It gives estimates from the numbers you type. It is not financial or legal advice.

Do not say "bank-grade", "used by thousands", or any number of users. There is none to quote.

## Shot list and recording settings

- Screen at 1920 by 1080, browser zoom 100%, dark screen (the default), notifications off, a clean browser profile with no bookmarks bar.
- Record each section as its own clip, so a bad take costs 30 seconds, not 10 minutes.
- Cursor: slow, and pause one second on every number you read aloud.
- Add one on-screen text line per section at most, using the product's own wording.
- B-roll you already own: the 20-component research screenshots, the terminal with tests, the Vercel deployment list.

## Voiceover

The script is in `VOICEOVER_ELEVENLABS.md`, one block per section, written to be pasted into ElevenLabs one block at a time. About 1,350 spoken words, which reads at roughly 9 minutes 30 seconds; the rest of the 10:40 is screen time with no talking.

Use your own cloned voice (steps are in that file). Only clone your own voice, from your own recording.

## Description (paste)

```
A lower monthly payment can still cost you more. Deal Desk shows you what each change in a car deal costs, before you sign.

Try it free, no account: https://carbuying.v2stack.com
The calculator makes every number. The AI only explains them, and a guard throws away any figure that is not in your deal.

Chapters
0:00 A lower payment that costs more
0:35 The one rule
1:30 Walk through a real quote
4:30 The Desk: compare two offers
5:30 The AI, and the guard
6:45 Learn the words, and Spanish
7:45 Redesign, with proof
9:00 How I checked it
10:00 What is not done yet

One real product a week: https://v2stack.com
Estimates from the numbers you enter. Not financial or legal advice.
```

Pinned comment: "Which number does the dealer talk about most, in your experience: the payment, the price, or the trade-in? I am collecting these for the next version."

## After publishing

- Put the live link in `NEXT_PUBLIC_YOUTUBE_URL` on Vercel so the site links back to the video, and redeploy.
- Watch audience retention at 0:35 and 4:30. If it drops there, tighten those sections in the next video.
