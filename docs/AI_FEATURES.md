# AI and helper features (built 2026-11-09)

Rule for all of it: **the calculator makes every number. AI reads, explains, drafts and plays a part. A model can choose words; it cannot introduce a number.** Research and reasons are in `AI_OPPORTUNITIES.md`.

## What exists

| Feature | Needs a key? | Where | How it stays honest |
| --- | --- | --- | --- |
| Quick fill by voice or text | No | First card on the Walk door; "Quick fill" on the Desk | Plain pattern matching (`lib/extract/spoken.ts`, 24 tests). Every field is shown with the words it came from; nothing is used until the buyer confirms. Desk: pick Offer 1 or 2; only fields given are changed; "take 500 off the price" works from the price already there. |
| Photo of a worksheet, lender letter, contract, VIN | Yes | Quick fill, Photo tab | The model only reads. Its answer is cut to numbers in range (and a VIN that passes its own check digit). Buyer confirms. Contract: up to 4 pages, each counts as a read. |
| Contract check | Yes | Quick fill, Contract | Calculator figures from the agreed deal vs what was read; lists matches, differences, lines not read. Never says a contract is safe. |
| VIN photo | Yes | Quick fill, Car's VIN | Check digit verified here, then the existing government VIN and recall routes. |
| Checks on a deal | No | Last step of the Walk; Desk centre column | Fixed rules in `engine/flags.ts` (10 tests): long loan, high fees, extras, payment that does not match, negative equity, high rate, no tax, interest share. Each has the calculator's numbers, a question to ask and a source. |
| Explain this (and Spanish) | No for the standard text; yes to ask or translate | "Explain this" on each check | The standard text shows at once. With a key a model answers a question from that text and the deal's figures. Numbers guard on the server (`lib/guard.ts`): any new figure and the standard text is shown instead. |
| Reword the ask (polite, firm, short, text, Spanish) | Yes | Desk, What to say | Every number must survive unchanged or the original text is kept. |
| Practise with a pretend finance manager | Yes | Last step of the Walk | Reply passes the numbers guard. The score (six things the buyer said) is made by simple rules on the buyer's words, not by the model. 8 turns. |
| Read aloud | No | Result, checks, answers, the ask | Browser speech synthesis; works offline. |
| Save on this device | No | Last step; resume card on the door | Local storage only, only when pressed, can be deleted (`dd-saved`). |
| State sales tax from ZIP | No | Step 2 | ZIP table is in the page (never sent). A suggestion only; says a city or county may add to it. Rates in `data/state-tax.ts` are approximate and need a yearly check. |

## Switching it on

1. Put the key in `.env.local` in the project folder (this file is not committed):
   `OPENROUTER_API_KEY=your key`
   and, if you want other models, `MODEL_VISION=` and `MODEL_TEXT=` with ids exactly as OpenRouter lists them. Defaults are `anthropic/claude-sonnet-4.5` and `anthropic/claude-haiku-4.5`; confirm they exist on your account.
2. Restart the server. The helpers that need a key start answering; the others never needed one.
3. On the host, set the same variables in the project's environment settings.

## Limits and cost control

Per visitor per day: 6 photo reads, 20 explanations, 12 rewordings, 60 practice turns. For the whole service: `EXTRACT_DAILY_CAP` photos (default 200) and `AI_DAILY_CAP` text answers (default 3000). Counts are kept in one server's memory, so on serverless hosting they are a soft brake; move them to Upstash Redis before launch. Measure real cost per read and per answer in the first week and write it to `docs/COSTS.md`.

## Not yet verified (needs the key)

- Photo accuracy: run 12 printed worksheets (rotated, blurred, different layouts), 30 contracts for the contract check, and the plan's injection documents. Watch the "fields corrected in the review" rate.
- Tone and Spanish quality of rewording and explanations; the guard rejects wrong numbers but cannot judge wording.
- Practice realism and how often the guard replaces a reply.
- Cost per call.

## Not built, and why

On-device voice and on-device language models: not proven on a phone in a showroom (see the research). The interface's static text is English only; the Spanish option covers AI-written answers and the reworded ask. A person should translate the interface itself.
