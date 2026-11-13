# AI models and cost, free credits, and the first-visit guide

Written 12 November 2026, after running every AI feature live against OpenRouter with the project's key.

## 1. Which model, and why

One model does both jobs (reading a photo of paperwork, and writing a few plain sentences): **Claude Haiku 5.5** (`anthropic/claude-haiku-5.5`), with `google/gemini-2.5-flash-lite` as a fallback that OpenRouter tries only if Haiku is down.

A test worksheet (a photo, slightly rotated, with blur and JPEG noise) with eleven known values was read by each candidate. Prices are per million tokens, in then out, as listed by OpenRouter on 12 November.

| Model | Price in / out | Fields right | One worksheet read |
| --- | --- | --- | --- |
| Claude Sonnet 4.5 (the old default) | $3.00 / $15.00 | 11 of 11 | $0.0072 |
| **Claude Haiku 5.5** | **$0.10 / $0.50** | **11 of 11** | **$0.00025** |
| Gemini 2.5 Flash Lite | $0.10 / $0.40 | 10 of 11 (fees wrong) | $0.00010 |
| GLM 5.3 Flash | $0.04 / $0.08 | 9 of 11, VIN unread | $0.00021 |
| Qwen 3.7 Flash | $0.03 / $0.13 | not run (rate limited upstream) | |

Haiku 5.5 matches the old default on accuracy and costs about 29 times less per photo. The cheaper models were not accurate enough to read numbers a buyer relies on.

Two settings keep it cheap and reliable:

- **Thinking is off** (`reasoning: { enabled: false }`). Haiku 5.5 thinks first by default. With a small token budget the thinking used all of it and the answer came back empty (seen in Spanish). These jobs only copy numbers or reword, so thinking only costs money.
- **The model never adds.** It copies each fee and add-on line, and the code adds them. A model slip (823 instead of 824) showed up in one run, so `feeLines` and `addonLines` are summed in `src/server/extract.ts`.

Cost of every AI action, measured:

| Action | Cost |
| --- | --- |
| Photo of a worksheet, lender letter or VIN | about $0.0001 to $0.0003 |
| Contract (two pages) | about $0.0005 |
| Explain, reword or practice turn | about $0.0001 to $0.0002 |

The whole round of testing for this work (about 40 calls) cost **$0.014** of the $5 limit on the key.

## 2. Free AI credits

Every AI use costs credits. Each visitor gets **20 a day** (`DAILY_CREDITS`). A question, reword or practice turn costs 1. A photo costs 2 each, so a four-page contract costs 8. The calculator, the checks, and typing or saying numbers cost nothing and never run out.

- **The visitor** is the network address, taken from the host's own header first (`x-vercel-forwarded-for`, `cf-connecting-ip`, `x-real-ip`) and only then `x-forwarded-for`, whose first entry a visitor can write. IPv6 is grouped by its first 64 bits.
- **Nothing identifying is kept.** The address is mixed with the date and turned into a one-way hash that changes every day. In Upstash the counter is deleted after two days. Without Upstash the same hash is the key in server memory.
- **Spend cap for the whole service**: `GLOBAL_DAILY_CREDITS` (1000 a day). At the measured costs the worst case is about $0.50 a day.
- **A burst limit** of 8 AI requests a minute per visitor (memory only).
- **Credits are given back** when the visitor got nothing for them: the model failed, or only the plain text was shown.
- **The counter shows in the app** ("14 of 20 free AI uses left today") in Quick fill photos, Explain this, the tone chips and Practice.
- **When the day's credits run out** the visitor sees when they come back (midnight UTC, shown in their local time), what still works, and how to ask for more: a YouTube link and an email address when set (`NEXT_PUBLIC_YOUTUBE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`), otherwise the contact page.
- **Boost codes.** When someone contacts you, give them a code. `BOOST_CODES="friendcode:40,anothercode:100"` adds that many credits a day. They enter it in the limit box, it is kept in their browser (`dd-boost`) and sent with their requests. Use long random codes. Every try with a code counts against the visitor's burst limit, so codes cannot be guessed one after another.

Without Upstash the counts live in each server instance's memory, which on serverless hosting is a soft brake only. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` before launch.

Files: `src/server/credits.ts` (the count, burst limit, boost codes, visitor), `src/app/api/_ai-route.ts` (takes and refunds credits), `src/app/api/status/route.ts` (what is left, no credits used), `src/lib/ai-status.ts` (`aiFetch`, `useCredits`, `applyBoost`), `src/components/ui/Credits.tsx`.

## 3. The first-visit guide

The calculator opens to three paths plus three shortcuts. A first-time buyer gets a guide in four layers, all skippable, none blocking:

1. **Welcome** (first visit only): three short screens in a dialog. What this is. Start from where you are (the three paths). You check, we do the math (the calculator makes every number, AI only reads and explains, numbers stay on the device). Skip at any time, Escape closes, Back and Next, a progress count and dots. It does not show on a shared link or a returning step.
2. **Tour of the Desk** (the first time the Desk is opened): a spotlight on the boxes, the total, the tabs and the share buttons, one card each, with Back, Next, Skip, arrow keys and Escape. A stop that is not on screen at that size is left out.
3. **Help** (the "Help and tour" button in the header, and in the menu on phones): replay the welcome, replay the Desk tour, the video guide, six quick answers, and how to reach us.
4. **The Walk itself** is the in-context guide: one question and one picture per step, and terms explained where they appear. The door now labels the three tools "Or use a shortcut" so the choice is clear.

**The YouTube video.** Set `NEXT_PUBLIC_YOUTUBE_URL`. A "Watch the video guide" link then appears on the last welcome screen and in Help, and the limit box links to the channel. Nothing shows until it is set.

What is remembered: `dd-seen` (which parts have been seen). Nothing else, and nothing leaves the device.

Files: `src/lib/onboarding.ts`, `src/components/onboarding/` (Welcome, Tour, HelpSheet, Onboarding), strings in `src/data/strings/more.ts` (`guide`, `credits`) and the Spanish in `es.ts`.

## 4. Verified

- Type check, lint and 183 tests pass. The credit tests cover the daily allowance, photos by the image, the next day, refunds, boost codes, the service ceiling, bursts, Redis, a Redis outage and the visitor header.
- Live: worksheet, VIN, lender letter and contract read; Explain in English and Spanish; reword in English and Spanish; practice. The counter went 3, 2, 1, 0, then the limit box. A wrong code was refused and a right one raised the day to 15.
- Browser: welcome (3 screens) and Desk tour at 375 and 1200 wide, Help sheet, Spanish. Axe found no problems on the tour, Help and welcome.

## 5. Not done, or not verified

- **Rotate the key** before deploying, as planned. It is only in `.env.local`, which git ignores. Set the same variables on the host.
- **The video** does not exist yet, so its links are hidden.
- **The contact email and YouTube address** are not set, so people are sent to the contact page for now.
- **Real photos.** The test used generated worksheets. Real worksheets (glare, folds, handwriting) will read worse. Try twelve before launch (see `docs/QUICK_FILL.md`).
- **Upstash** has been tested only against a stand-in.
- The limit box was checked in the Explain sheet. Practice, the tone chips and the photo tab use the same component.
- Spanish welcome, tour and help text needs the same native review as the rest of the Spanish.
