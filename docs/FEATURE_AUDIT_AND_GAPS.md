# Deal Desk: feature audit by scenario, and what is still missing

Audit date: 2026-11-09. Method: the production build served locally, driven in the browser pane at phone width (390 x 844), large text and light theme, plus desktop. Each scenario below was walked as a real buyer would, not read from code. Evidence is what the page showed.

## 1. Feature inventory

| Area | Feature | State |
| --- | --- | --- |
| Walk | Door with saved deal, "I have a quote", "Only know the payment", "Not yet" | Works |
| Walk | Six steps: price, fees, trade, loan, add-ons, result | Works |
| Walk | Months chips 24 to 96, Enter key moves to the next step | Works (added) |
| Walk | Price from a payment (afford card at 5, 7, 9, 12 percent) | Works (added) |
| Walk | Rate from a payment ("What rate is that payment?") | Works (added) |
| Walk | Tax on fees, tax on the difference after a trade | Works (added) |
| Desk | Two offers side by side, edit either, compare, target, ask | Works |
| Desk | Checks tab with rule-based flags | Works (added) |
| Desk | "Edit Offer 2" nudge when both offers are the same | Works (added) |
| Share | Link holds the deal after the # sign, never sent to a server | Works, copy fallback fixed |
| Share | Opening a link loads the Desk with a banner and cleans the address | Works (verified from a fresh navigation) |
| Print | Print or save as PDF of the deal | Present, DOM verified; the browser print dialog was not driven |
| Quick fill | Say or type numbers, review sheet, nothing applied until confirmed | Works |
| Quick fill | Photo of worksheet, lender letter, contract, VIN | Built, not run live: needs the OpenRouter key |
| Explain this | Plain text without AI, questions and Spanish only when AI is on | Works with AI off; AI path not run live |
| Practice | Role-play with a rubric | Hidden with AI off, not run live |
| Car lookup | VIN or year, make, model: crash ratings, recalls, fuel cost | Works (public services) |
| Read aloud | Speech synthesis of results | Works where the browser supports it |
| Site | Landing, features, about, privacy, terms, 404, error | Works |
| Site | Light and dark, large text, menu | Works |

## 2. Scenarios run

1. **First visit, has a quote.** Door to price, fees, trade, loan, add-ons, result. Totals matched the engine to the cent.
2. **Only knows the monthly payment.** Entered $522 for 72 months. The afford card offered prices at four rates, tapping one started the deal. At step 4 the page worked out the rate from price, down payment and payment: "about 7.02%", and "Use 7.02%" filled the rate box. Total $37,584.
3. **Two dealers, compares.** Desk with both offers, Checks tab shows four flags (for example "84 months is a long loan", "The fees are on the high side"), each with a question to ask.
4. **Same numbers in both offers.** After a one-offer share link, the Desk showed "Edit Offer 2" so the second offer is not left as a copy by mistake.
5. **Sends the deal to a relative.** The clipboard is blocked in the test pane, so the first attempt failed and told the buyer to select the page address, which does not carry the deal. Fixed: the link now appears in a read-only field to copy. A link opened from a fresh navigation loaded the Desk with the banner and a clean address. A same-page hash change does not reload, which is normal browser behaviour.
6. **Large text on a phone.** The header kept its brand, Walk, Desk and Menu within 358 px with no sideways scroll.
7. **No AI key.** Tone chips, photo tab, practice and free questions are hidden; the plain explanations and the voice parser still work.
8. **Keyboard and screen reader.** Axe (WCAG 2.0 A and AA, 2.1 AA) returned no violations on the door, price step with afford card, rate step with implied rate, Desk, Checks tab, and the share fallback.

## 3. Defects found and fixed this round

- The "Only know the payment" path stopped at a price and never worked out the rate. Added `aprFromPayment` with tests and the "What rate is that payment?" card.
- The months box allowed only a few terms. Added 24 to 96 chips.
- Enter in a number box did nothing. It now moves to the next step.
- No way to carry a deal to another person or paper. Added share link and print.
- Flags existed only in the Walk. The Desk now has a Checks tab.
- Share copy failure sent the buyer to the wrong address. Now shows the link to copy.
- Tax on fees and tax on the difference after a trade could not be set. Both are on the steps.

Checks run: `tsc --noEmit` clean, eslint clean, vitest 138 tests passing, production build passing.

## 4. Gaps closed in the follow-up round (9 November 2026)

Every item the first audit listed as missing was built, except the three that need things only the owner can supply (see section 5). Checks: `tsc` clean, eslint clean, 176 tests passing, production build passing, axe clean on the door, payment check, budget helper, lease sheet, car lookup, Quick fill, Desk, rename box and the lease result.

| Gap | What was built | Verified |
| --- | --- | --- |
| Lease | `computeLease` (cap cost, residual, money factor, tax on payment, mileage overage) and a "Check a lease" sheet on the door and the Desk, with the payment, due at signing and total pinned at the bottom | By hand: $32,000 car, $34,000 MSRP, 60% residual, 0.0025, 36 months gives $420.15 a month and $20,275.40 all in, matching the engine and the page |
| Cash purchase | `cashCompare`: cash needed and what the loan adds, on the last Walk step and the Desk Checks tab | Test, and live ($32,000 cash, $5,045 interest) |
| Offer names | Rename in the Desk; the name shows in the toggle, compare table, "what to say", trail heading, print and share link | Live |
| URL and reload | Each Walk step is a history entry (`/deal?step=3`); numbers and step kept in session storage (`dd-session`) | Refresh restored step 2 and the price; Back moved to the step before |
| Rebates | `rebate` field in the engine, trail, share link, print, Walk step 5 and the Desk keypad | Tests (breakdown still sums to the total) and live |
| Tax in dollars | `taxRateFromAmount`; the rate is the exact fraction, so the tax matches the paper to the cent | Test and live ($2,100 on $30,000 gives 7%) |
| Budget helper | `budgetFromIncome` (20/4/10 rule, 10% of gross less insurance and fuel) on the payment check | Live |
| Look up a car on the Desk | Link in the Desk row | Live |
| Installable app and offline | Manifest, icons (192, 512, maskable, Apple), service worker (network first for pages, cache first for build files), offline page, install button where the browser offers it | In real Chrome: service worker active, 24 files cached; with the server stopped the calculator reloaded, styled, and computed a price |
| Spanish interface | Full Spanish for the Walk, Desk, checks, sheets, terms, print, lease, budget; Spanish voice and text number finder ("treinta y un mil quinientos"); Spanish practice scoring; switch in the header and menu (`dd-lang`) | Live: switched, walked all six steps, no English left on any Desk tab or sheet. **Needs a native reviewer** |
| Shared rate limits | `takeSharedSlot`: Upstash Redis when `UPSTASH_REDIS_REST_URL` and token are set (visitor stored only as a daily one-way hash), memory otherwise or if Redis is down | Unit tests with a stand-in Redis. Not run against a real Upstash database |
| Tablet | Door tools now fill the row; the tax helpers sit in one "Help with the tax" section so step 2 is shorter | Live at 768 x 1024 |
| Script weight | Measured: `/deal` first load is about 330 KB gzipped (React 72, motion 54, the rest the app and Radix). Three.js (170 KB) loads only on the landing; the ZIP table (272 KB) and the Spanish pack (12 KB) load only when used | Build output |
| State tax table | Rechecked against the Tax Foundation midyear 2026 table: all states match except VA | See section 5 |

Also fixed on the way: the five-tab bar on the Desk wrapped "Checks" onto a second row at 390 px.

## 5. Still open, and why

1. **Photo, contract and AI answers are untested live.** They need `OPENROUTER_API_KEY` in `.env.local`. Cost per call, accuracy on real worksheets and the numbers guard under real model output are unmeasured.
2. **Spanish needs a native reviewer who knows car financing** before launch. The numbers cannot change, but a mistranslated explanation could mislead. The marketing and legal pages are still English only.
3. **Virginia's rate.** The table has 4.15, believed to be the motor vehicle rate, where the general table shows 5.30. Confirm against Virginia's DMV. Other states also tax vehicles differently from other goods; the buyer's worksheet always wins.
4. **Upstash against a real database.** Set the two variables and watch a counter.
5. **Lease tax rule.** The sheet assumes tax on each payment. A few states tax the whole price at signing; the sheet tells the buyer to check.
6. **iPhone install.** Safari has no install prompt; the manifest and icons are in place, but "Add to Home Screen" from the share menu was not tried on a device. The service worker was verified in Chrome only.
7. **Not driven:** the browser print dialog, the native share sheet on a phone, and voice input in noise or on Safari and Firefox.

## 6. What was not verified

- The browser print dialog and the exact printed page layout.
- Native share sheet on a real phone (the pane has no `navigator.share`).
- Voice input accuracy in noise, and Safari or Firefox speech support.
- Any call that reaches a model.
