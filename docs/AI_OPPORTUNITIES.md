# Where AI can make Deal Desk easier and better (research, 2026-11-09)

Question: where can AI go in this product so a buyer standing in a showroom does less typing, understands more and decides better?

Short answer: **most of the value is in getting numbers in without typing and in saying what they mean in plain words. Very little of it is in AI doing the maths or the negotiating.** The research below supports the rule already in the plan: the calculator does every number; AI reads, explains, drafts and practises.

How to read the evidence labels: **[P]** primary source or study, **[V]** vendor or trade claim (unverified, a company describing its own product), **[S]** secondary summary. Where I could not confirm something it says so. All searches were run on 2026-11-09. Nothing here was tested against a real AI model; that needs a key (see "What I could not check").

---

## 1. What the research says

### 1.1 Buyers are already using AI, and it helps when it stays in its lane
- Cox Automotive's 2025 Car Buyer Journey Study (2,300 buyers, released Jan 2026): 19% of all buyers and 25% of new-vehicle buyers used AI sites or AI overviews, and those who did reported the highest satisfaction. 53% still completed every step at the dealership and only 7% bought fully online. [P, via trade summaries] ([Cox press release](https://www.coxautoinc.com/wp-content/uploads/2026/01/2025-Cox-Automotive-Car-Buyer-Journey-Press-Release.pdf), [summary](https://www.autoserviceworld.com/cox-automotive-tracker-finds-widening-gap-between-ai-powered-shoppers-and-dealers/))
- Cox's 2026 AI tracker: 63% of shoppers plan to use AI for their next purchase; 29% of dealers have begun adjusting. [S] ([Cox](https://www.coxautoinc.com/press-releases/new-cox-automotive-ai-in-auto-retail-tracker))
- **Meaning for us:** most buying still happens in the showroom, so the product must work with one hand, a phone and a salesperson waiting. Typing is the weak point.

### 1.2 Language models get arithmetic wrong, and sound sure
- A 2026 preprint measured an "arithmetic hallucination rate" on calculation-heavy finance questions: 54.95% for one frontier model, 29.70% for another, 16.34% for a third; a tool-grounded design cut it substantially. One paper's numbers, not a consensus. [P, preprint] ([arXiv 2608.26114](https://arxiv.org/pdf/2608.26114))
- A 2024 Journal of Financial Planning test of three chatbots on 11 money decisions found confident answers with arithmetic and reasoning errors, including a car-loan comparison that used the wrong interest method. Models are newer now. [P] ([FPA](https://financialplanningassociation.org/learning/publications/journal/MAY24-llms-cant-be-trusted-financial-advice-OPEN))
- Consumer Reports tested chatbots on car comparisons: outdated model years, a wrong vehicle, invented options; asking for primary sources improved results. Their stance: decision support, not a replacement for judgment. [S, paywalled] ([CR](https://www.consumerreports.org/cars/buying-a-car/can-you-use-ai-to-help-you-buy-a-car-a5997374584/))
- **Meaning:** keep the calculator as the only source of numbers, keep the plan's "numbers guard" (any figure in AI text must appear in the calculator's output, else the template text is used), and do **not** ask a model for prices or "fair price" verdicts.

### 1.3 What competitors do, and what is unproven
- CarEdge: an AI negotiator that emails dealers through an alias for roughly $99 to $199 a car, a free contract reviewer, and a claim of $17.9M saved over 52,146 negotiations (average claims of $2,200 to $3,488 differ). [V] ([report](https://caredge.com/reports/ai-negotiation-impact), [roundup](https://www.gobankingrates.com/saving-money/car/ai-tools-score-better-deal-cars/))
- Camera-based offer scanners (DealScan and similar) claim to read standard offer sheets. **No independent accuracy test found.** [V]
- CarEdge itself writes that AI can research, draft and price-check but cannot sit across from a finance manager. [V] ([CarEdge](https://caredge.com/guides/can-ai-negotiate-a-car-deal-for-me))
- I found nothing on Visor, Deal Check or Odigos (named in the plan); they need a direct read.
- **Meaning:** the gap we can own is a **free, private, shows-its-working** tool that handles the in-showroom moment. We should not copy the paid autonomous negotiator.

### 1.4 The real buyer problems are structural, and most are checkable by rules
- Payment packing (focus on the monthly figure, pack add-ons into it), yo-yo financing (deal unwound after driving away), junk fees, and rate markups. FTC cases describe the first two; CRL surveys document yo-yo prevalence (2009, old). [P] ([FTC case summary](https://www.autoremarketing.com/subprime/ftc-charges-9-los-angeles-stores-yo-yo-financing-payment-packing/), [CRL](https://www.responsiblelending.org/research-publication/car-trouble-predatory-auto-loans-burden-north-carolina-consumers))
- Add-on advice is consistent: paint and fabric protection and VIN etching usually not worth it; price GAP elsewhere; a warranty depends on the car; **if you did not ask for it you need not pay for it**. [S] ([CFPB](https://www.consumerfinance.gov/about-us/blog/servicemembers-arm-yourself-basic-car-buying-skills-stand-your-guard-when-it-comes-add-products/), [roundup](https://www.moneytalksnews.com/california-just-cracked-down-on-car-dealer-add-ons-to-refuse-wherever-you-live/))
- Federal rule gone: the FTC's CARS Rule was vacated by the Fifth Circuit in Jan 2025; states are filling in (California, Massachusetts). The FTC still pursues deceptive pricing under Section 5. [S] ([Nelson Mullins](https://www.nelsonmullins.com/insights/blogs/driving-forward-developments-in-transportation-law-and-innovation/all/states-pick-up-stroke-regulating-new-car-sales-practices-following-ftc-loss-on-cars-rule-2))
- Rates and terms: Experian puts new-car average APR around 6.4% and used around 11.4% (Q1 2026), by credit tier from about 4.4% (super prime) to 13.5% (subprime); nearly a third of loans are longer than six years. [S, secondary sites] ([Experian release](https://www.experianplc.com/newsroom/press-releases/2026/new-experian-automotive-report-shows-nearly-one-third-of-automot))
- Doc fees: caps exist in some states (reports say 15 to 22, sources disagree; California $85) and none in others (Florida). Consumer guide sites conflict on several states. [S] ([CarEdge](https://caredge.com/guides/car-dealer-doc-fee-by-state))
- **Meaning:** "is this fee, rate or term unusual?" is mostly a **table lookup**, not AI. AI's job is to say the result kindly and clearly.

### 1.5 Technology facts that decide the design
| Question | What I found | Effect |
| --- | --- | --- |
| Voice in the browser | Web Speech `SpeechRecognition`: Chrome complete but audio goes to Google; Safari partial via the `webkit` prefix; **Firefox unsupported**. [S] ([caniuse](https://caniuse.com/speech-recognition)) | Keep text box as the base; mic is an extra; say so in Privacy (done). |
| On-device voice | Whisper runs in the browser through transformers.js on WebGPU, WASM fallback; models download on first use. **No phone benchmarks found.** [S] ([guide](https://blog.logrocket.com/voice-ai-agent-browser/)) | Possible later for privacy; test on real phones first. |
| On-device LLM | Chrome's Prompt API (Gemini Nano) reported stable in Chrome 148, desktop only, with a reported 4.27 GB automatic download and formal opposition from Mozilla, Apple, Microsoft, W3C. Sources conflict on status. [S] ([Chrome docs](https://developer.chrome.com/docs/ai/built-in?hl=en)) | Not for a phone in a showroom. Revisit; do not depend on it. |
| Reading documents | 2026 benchmarks: OCR pipelines more reliable on long multi-page documents, VLMs stronger on forms and visual layout; schema-variable extraction is still hard. No receipt or handwriting result found. [P] ([DISCO](https://arxiv.org/html/2603.23511v1), [ExStrucTiny](https://aclanthology.org/2026.eacl-long.265)) | Worksheet (one page, form): vision model. Contract (many pages): OCR first, then model. Test on our own fixtures. |
| Prompt injection via images | No single defence reaches near-zero attack success; best was OCR-first with a warning; OWASP ranks prompt injection first. [P] ([arXiv 2609.04533](https://arxiv.org/pdf/2609.04533)) | Our design already cuts the model's output to numbers in range and makes the buyer confirm. Keep that; never let a model's words drive an action. |
| VIN from a barcode | `BarcodeDetector` is off by default in Safari and partial in Chromium (macOS, ChromeOS, Android); ZXing in WebAssembly is the usual route. Whether windshield and door-jamb labels are a standard barcode **not confirmed**. [S] ([caniuse](https://caniuse.com/mdn-api_barcodedetector)) | Possible with a polyfill; verify on a real car. |
| Older adults and voice | A month-long study of 15 older adults: 31.8% of speech errors were resolved; a touchscreen made recovery easier than voice only; people still preferred voice as the way in. [P] ([arXiv 2403.02421](https://arxiv.org/pdf/2403.02421)) | Voice **plus** a visible check screen (what Quick fill does). Allow slow speech; never act on speech alone. |
| AI disclosure law | Utah requires proactive disclosure when generative AI serves consumers in finance; Maine requires saying it is not a human; California SB 243 is about companion bots. State summaries only. [S] ([guide](https://www.entagl.com/blog/us-ai-chatbot-disclosure-laws-2026)) | Label AI-written text as AI on screen (the plan's Calculator or AI tag). Have the text checked by a lawyer. |
| Cost per read | Third-party calculators list about $3 to $15 per million tokens for Sonnet-class and $1 to $5 for Haiku-class on OpenRouter; **image token counts not found**. [S] | Unknown until measured. The plan already has a day-4 cost measurement and a daily cap. |

---

## 2. The buyer's journey and where AI helps

| Moment | The buyer's problem | Today in Deal Desk | AI opportunity |
| --- | --- | --- | --- |
| Before the shop | Does not know what to expect; terms are unfamiliar | Walk, term popovers, How it works | Explain-anything chat; Spanish; read-aloud |
| In the shop, numbers arrive | Cannot type while talking; dealer changes numbers quickly | **Quick fill: voice, text, photo (just built)** | Smarter capture: two offers, lender letter, VIN scan, follow-up voice commands |
| In the shop, deciding | Cannot tell if a fee, rate or term is unusual | Compare two offers, trail, "what it would take" | **Rule-based flags with sourced text** |
| At the desk, answering | Does not know what to say; feels pressured | Copy-the-sentence template | Draft and tune the ask; practise; read-aloud script |
| Signing | The contract differs from the agreement | Nothing yet | **Contract check** (plan F11) |
| After | Wants to keep and share the deal | Nothing saved | Save on device; one-page printout |

---

## 3. Opportunities, ranked

Scoring: value to the buyer, effort (S = days, M = 1 to 3 weeks, L = more), risk of harm if it is wrong, and whether it needs a model at all.

### Tier 1: do next (high value, low risk, mostly no model)

**1. Finish and prove Quick fill.** *Value H, effort S, risk low.*
- Photo path: add the key, then run 12 printed worksheets (rotated, blurred, different layouts) and the plan's injection documents. Track the **correction rate** in the review sheet as the live accuracy measure.
- Add **two-offer capture**: photograph or dictate offer A, then offer B, and land on the Desk with both filled. This is the most common in-shop task and nothing else makes comparing quick.
- Add voice commands that only change one field after a result exists: "what if seventy two months", "take five hundred off the price". Parse with the same local rules first; a model is a fallback only.

**2. "Check this deal": rules that flag, words that explain.** *Value H, effort M, risk low-medium, needs no model to be correct.*
- Flags, each with a source line the buyer can open: term longer than 72 months (Experian: nearly a third exceed six years); doc fee above the state's cap or typical level (needs a curated table, because sources conflict); add-ons that the buyer did not ask for (CFPB, CR advice); payment that rose while the price did not (payment packing); rate far above the average for a credit tier (needs the buyer's score band, so ask for a band, not a score).
- AI role: only to write each flag in plain words at a chosen reading level, passing the numbers guard. If the model fails, the template text shows.
- This is the plan's F4, and it matches how the best product here would differ from CarEdge: it shows its rule.

**3. Local prefill from what we already know.** *Value M, effort S, risk low, no model.*
- ZIP to state (the ZIP table is already in the project) then suggest the **state** sales tax rate, with "your city or county may add to this". Fixes the zero-tax default found in the audit.
- Remember the last deal on the device (opt-in), so a return visit to the dealer starts filled. Needs a Privacy line.
- Keep the buyer's own words: "I told you 7% last time" style prefill is local state, not AI.

**4. Read the result aloud and in large type.** *Value M for older and low-vision buyers, effort S, risk low, browser speech synthesis, no model.* "Say it to me" on the result and on each flag.

### Tier 2: next (high value, more work or more care)

**5. Explain-this-line chat, grounded.** *Value H, effort M, risk medium.*
- A buyer taps a line ("doc fee $900", "GAP") and asks "what is this, and do I have to pay it?" The answer is built from the glossary and add-on guidance we already hold plus the deal's own numbers; the model rewrites, it does not source facts. Numbers guard on every reply. Cheap small model. Caps per visitor. Show "AI-written, numbers from the calculator" on every answer.
- Cache answers for fixed questions (they have no personal data), so most taps cost nothing.

**6. Draft the ask, in your voice.** *Value H, effort S-M, risk low.* Today the sentence is a template. Let the buyer pick tone (polite, firm, short, text message, email) and read length, with the guard replacing any changed number. One tap to copy; one to read aloud.

**7. Contract check (plan F11).** *Value very high, effort L, risk high.*
- Photo of each page, OCR first for long documents (DISCO result), a model to place fields, then the **calculator compares** with the agreed offer: price, fees, add-ons, rate, term, total of payments, VIN. Anything that differs is listed with both numbers.
- Risks: a missed line or a misread number gives false comfort. So: say what it could not read, never say "this contract is fine", only "these lines match" and "these differ". Test on at least 30 real contracts before release. Needs legal review of the wording.

**8. Lender pre-approval photo.** *Value M, effort S once Quick fill exists.* Read rate, term, amount from a bank letter; it becomes the "beat this" benchmark on the Desk.

**9. VIN scan.** *Value M, effort M.* Scan the VIN barcode (ZXing in WebAssembly for Safari), call the existing VIN route, and fill year, make, model, recalls and fuel economy. Confirm on a real car which label is a barcode.

**10. Spanish.** *Value H for reach, effort M.* Static interface strings should be translated by a person; AI can translate the dynamic explanations. CRL notes packing falls hardest on lower-income buyers, which is the group a free tool should reach.

### Tier 3: later, or only with care

**11. Practise with a pretend finance manager (plan F9).** Voice practice fits the research (people prefer voice as input) but errors are common for older speakers, so keep a visible transcript and let the buyer correct it. Score with the plan's six-item rubric, not with the model's opinion.

**12. On-device voice and on-device model.** Whisper in the browser would remove the voice privacy caveat; Chrome's built-in model would remove the server cost. Neither is proven on a phone in a showroom. Prototype and measure; do not promise.

### Do not build

| Idea | Why not |
| --- | --- |
| A model that does the arithmetic or builds the totals | Measured error rates are high and confident; the calculator is exact. |
| A model that says what a car is worth | Consumer Reports found invented and outdated details. Use licensed price data or leave it out. |
| An autonomous negotiator that emails dealers | Paid competitor territory; the buyer cannot see what was said until after; liability; breaks the "stays on your device" promise. |
| Live coaching through an earpiece | Privacy and consent problems in a room with other people; no evidence it helps. |
| "Your deal is good or bad" verdicts | Needs market data we do not have; use flags with reasons instead. |
| Acting on anything a document says | Prompt injection has no complete defence. Output stays numbers only; the buyer confirms. |

---

## 4. How to build it safely

- **One rule everywhere:** the model returns words or candidate numbers; the calculator returns every figure; the buyer confirms before a candidate number is used. Every AI sentence is tagged and numbers are checked against the calculator's output.
- **Route by job:** a small, cheap vision model for worksheets and letters; OCR plus a larger model for contracts; a small text model for explanations and drafts. Measure cost per use on day 4, as the plan says, and write it to `docs/COSTS.md`.
- **Limits:** daily caps per visitor and for the service (built for photos; move the counter to Upstash), and a global spend stop that falls back to templates.
- **Always a way out:** every AI feature fails to "type it yourself" with one plain sentence. Already true for Quick fill.
- **Privacy:** nothing stored, requests not logged, counters without content. Each way in is named on the Privacy page (done for photo and voice).
- **Test set:** 12 worksheets, 30 contracts, 40 practice turns, 200 guarded replies that must pass 200 of 200, injection documents that must change nothing. Run it before every model or prompt change.
- **Measure what matters, privately:** no tracking scripts exist, so use server-side counters on AI routes only: reads, failures, and **fields the buyer corrected** in the review sheet. Time-to-total can be tested in moderated sessions (target in the plan: under 3 minutes for 5 first-time buyers, 2 over 60).
- **Legal:** have a lawyer read the AI labels (Utah's proactive disclosure for finance is the strictest I found), the "not advice" wording, and the contract-check language.

## 5. Suggested order

1. **This week:** prove Quick fill (key, 12 fixtures), state tax prefill, read-aloud, save on device.
2. **Next:** "Check this deal" flags with a curated, sourced table; two-offer capture; draft the ask.
3. **Then:** explain-this-line chat, lender letter, VIN scan, Spanish.
4. **After a real test with buyers:** contract check, then practice mode.

## 6. What I could not check

- **No real model was run.** Accuracy of photo reading, cost per read and the tone of explanations are unmeasured.
- Doc-fee caps conflict between sources; a curated table needs the state statutes or attorney general pages.
- Experian figures are from secondary sites; the report is behind a form.
- Chrome's Prompt API status conflicts across sources.
- No data on how long buyers spend in the finance office, or on in-showroom voice accuracy on phones.
- Whether the VIN barcode on a windshield or door jamb is a standard symbology.
- Visor, Deal Check and Odigos were not found.

## Sources
[Cox 2025 Car Buyer Journey](https://www.coxautoinc.com/wp-content/uploads/2026/01/2025-Cox-Automotive-Car-Buyer-Journey-Press-Release.pdf) · [Cox AI tracker](https://www.coxautoinc.com/press-releases/new-cox-automotive-ai-in-auto-retail-tracker) · [CIFQA](https://arxiv.org/pdf/2608.26114) · [FPA LLM finance test](https://financialplanningassociation.org/learning/publications/journal/MAY24-llms-cant-be-trusted-financial-advice-OPEN) · [Consumer Reports](https://www.consumerreports.org/cars/buying-a-car/can-you-use-ai-to-help-you-buy-a-car-a5997374584/) · [CarEdge AI impact](https://caredge.com/reports/ai-negotiation-impact) · [CarEdge on AI negotiation](https://caredge.com/guides/can-ai-negotiate-a-car-deal-for-me) · [FTC payment packing case](https://www.autoremarketing.com/subprime/ftc-charges-9-los-angeles-stores-yo-yo-financing-payment-packing/) · [CRL Car Trouble](https://www.responsiblelending.org/research-publication/car-trouble-predatory-auto-loans-burden-north-carolina-consumers) · [CFPB add-ons](https://www.consumerfinance.gov/about-us/blog/servicemembers-arm-yourself-basic-car-buying-skills-stand-your-guard-when-it-comes-add-products/) · [CARS Rule and states](https://www.nelsonmullins.com/insights/blogs/driving-forward-developments-in-transportation-law-and-innovation/all/states-pick-up-stroke-regulating-new-car-sales-practices-following-ftc-loss-on-cars-rule-2) · [Experian release](https://www.experianplc.com/newsroom/press-releases/2026/new-experian-automotive-report-shows-nearly-one-third-of-automot) · [Doc fees by state](https://caredge.com/guides/car-dealer-doc-fee-by-state) · [Speech recognition support](https://caniuse.com/speech-recognition) · [Chrome built-in AI](https://developer.chrome.com/docs/ai/built-in?hl=en) · [Whisper in the browser](https://blog.logrocket.com/voice-ai-agent-browser/) · [DISCO benchmark](https://arxiv.org/html/2603.23511v1) · [ExStrucTiny](https://aclanthology.org/2026.eacl-long.265) · [Visual prompt injection](https://arxiv.org/pdf/2609.04533) · [BarcodeDetector support](https://caniuse.com/mdn-api_barcodedetector) · [Older adults and voice assistants](https://arxiv.org/pdf/2403.02421) · [AI disclosure laws](https://www.entagl.com/blog/us-ai-chatbot-disclosure-laws-2026)
