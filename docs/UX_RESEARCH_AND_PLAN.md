# Making Deal Desk understandable to a first-time buyer

Research and plan, 2026-11-09. Nothing in this document is built. It answers three complaints from the owner: no images or graphics, no easy parts (a wall of numbers), and no real walk-through that teaches the terms.

How to read the evidence tags:

- **A** means I read the primary text this session.
- **B** means I read the abstract or a reliable summary, not the full paper.
- **C** means a trade, law-firm or advice source.
- **D** means my own inference or design judgement. Nothing marked D is research.

---

## 1. Would a new buyer stay? No, and here is why

I looked at `/deal` the way someone who has never bought a car would, at 375 by 667 pixels with the example loaded.

What is on that one screen: a total with cents ($46,898.24), a monthly payment, a change in total, a sentence, three money-trail rows with signed cents, four boxes holding five more numbers, an Offer 1 and Offer 2 switch, and four tabs. That is about 13 numbers before the buyer has typed anything, and not one of them is explained.

| Complaint | What is actually wrong | Evidence it matters |
|---|---|---|
| 1. No images or graphics | The only graphic is the thin money-trail bar. The landing page has one real picture of the product and nothing that shows what a loan is. | Part-to-whole pictures help most for people with weak number skills and for older adults (Garcia-Retamero and Cokely 2013, B). |
| 2. A bombardment of numbers | The screen is built for an expert comparing two full offers. A new buyer usually holds one number, the monthly payment, and does not know what "fees, add-ons" or "loan" means. | Showing less information improved both understanding and choices, most for people low in numeracy (Peters et al. 2007, B). |
| 3. No walk-through | The only teaching is the landing page. Once the buyer reaches `/deal` there are no terms, no stages, and no reason to enter a number. | Financial lessons taught up front fade, and help works best tied to the moment of the decision (Fernandes et al. 2014, B; challenged by Kaiser et al. 2020, B). |

There is a deeper mistake behind all three. The calculator starts from our fields (price, fees, add-ons, down, rate, months). A new buyer starts from the dealer's words ("your payment will be about $520"). The tool should begin where the buyer is, not where the engine is.

---

## 2. What the research says

### 2.1 Fewer numbers, shown in a better order, beat more numbers

- **Less is more.** In three experiments, consumers shown less information understood the key cost and quality details better and chose the higher-quality option more often. The gains were strongest for people with low numeracy. Peters, Dieckmann, Dixon, Hibbard and Mertz, *Medical Care Research and Review*, 2007. **B.** A secondary report gives 62% versus 40% choosing the best hospital. I could not check that figure against the paper, so I do not rely on it.
- **A summary first, details second.** The FTC tested a three-page mortgage form against the forms lenders used. Page one summarised every key cost, and pages two and three held the detail. The designers dropped less important information, used plain words, and laid the form out so each cost was easy to find. 819 recent borrowers answered 25 questions: 61% were right on the current forms and 80% on the prototype. 29% of the current-form group got 70% or more right, against 80% of the prototype group. The prototype won on 17 of 21 questions in the simple scenario and 23 of 25 in the complex one. The gain was larger for complex loans (22 points against 16). Lacko and Pappalardo, FTC Bureau of Economics, 2007. **A.**
- **Two levels, not five.** Showing a few important options first and the rest on request makes software easier to learn and less error-prone. Designs deeper than two levels tend to get people lost. Nielsen, Nielsen Norman Group, 2006. **A.**
- **One thing per page.** GOV.UK builds its forms with one question per page and merges pages only when research says it is fine. The caveats: it can feel slow without a progress indicator, and the evidence is the service teams' own user research, not controlled experiments. **B/C.**
- **Working with element interactivity.** For complex material, worked examples beat having novices work it out alone. The advantage reverses as people gain expertise (Chen, Kalyuga and Sweller 2015; Kalyuga et al. 2003). **B.** That is why every guided step needs a visible "I know this, skip" and an expert mode.

### 2.2 People do not understand what a longer loan does

- **Buyers target the payment, not the cost.** From about 500,000 used-auto loans and credit-score thresholds at hundreds of lenders, demand responded more strongly to the loan's length than to its interest rate. Borrowers spent payment savings on bigger loans, and payments bunch at round numbers like $200, $300 and $400. Argyle, Nadauld and Palmer, NBER Working Paper 25668, 2019 (published in *Review of Financial Studies*, 2020). **A** for the abstract and introduction; I could not check the elasticities. One author disclosed a financial relationship with the data supplier.
- **Interest is underestimated.** Households underestimate how fast interest compounds, and the more biased a household is, the more it borrows and the more it favours shorter maturities. Stango and Zinman, *Journal of Finance*, 2009. **B.** Their 2011 follow-up found that a mandated APR disclosure narrowed the gap between the most and least biased borrowers.
- **Dollars beat percentages.** In a field experiment with 1,441 payday borrowers at 77 stores, showing the dollar cost cut borrowing the most ($55 less per pay cycle, 23%), against APR information ($38) and refinancing information ($28). A printed savings planner did nothing. Bertrand and Morse, *Journal of Finance*, 2011. **B.**
- **Market context, Q3 2026.** Edmunds reports an average new-car payment of $787, 25.5% of financed new cars on loans of 84 months or longer, and average total interest of $9,938. These figures reach me through a local-news report of the Edmunds release, not Edmunds itself. **C.**
- **Official advice.** The CFPB's worked example: a $20,000 loan at 4.75% costs about $597 a month and $1,498 in interest over 36 months, against about $320 and $3,024 over 72 months. It says it is common to focus on the monthly payment, though other factors affect the total more. **A.** The FTC says not to focus only on the payment, and that a long loan can leave you owing more than the car is worth. **A.**

What this means for us: the central lesson (a lower payment can cost more) is the best-documented behaviour in this whole market, and the most useful single picture we can draw is "same car, more months, more dollars", in dollars, not percentages.

### 2.3 Pictures work, if they are the right pictures

- **Aids for low numeracy.** Icon arrays and bars helped people with low numeracy, older adults and people with little domain knowledge, as long as they had moderate graph skills. They did not help people low in both numeracy and graph literacy, so each picture needs direct labels and a written sentence. The authors favour one key message per aid. Garcia-Retamero and Cokely, *Current Directions in Psychological Science*, 2013. **B.**
- **Same denominator, part to whole.** The decision-aid standards (IPDAS) say to compare options on the same denominator, time period and scale, and to use visuals that show a part-to-whole relationship. They add that no single format fits every situation and that interactive formats need more research. **B** (search summaries; I could not fetch the chapter).
- **Position on a common scale is read most accurately.** Cleveland and McGill (1984) ranked tasks by accuracy, with aligned position first and area, angle and shading further down. The ranking mostly held in a crowd-sourced replication, with caveats. That a stacked bar is hard to read beyond its first segment is my inference from the ranking, not a finding. **B/D.**
- **Put words and pictures together.** Mayer's multimedia principles, drawn from over 200 experiments, include: place matching words and pictures near each other, use cues such as labels and arrows, let learners control short segments, and teach the names of key parts first. Decorative material that carries no information adds load without adding learning. **B** (summaries; I could not find effect sizes).
- **Less numerate people are pushed around more by framing.** In four studies, less numerate people were more swayed by framing and by irrelevant feelings. Peters et al., *Psychological Science*, 2006. **B.** A 2022 registered replication with 860 people supported some but not all of it.

### 2.4 Teaching: embed it in the task, not before it

- **Tutorials do not help simple tools.** Across 70 people and four apps, those who read the tutorial succeeded 91% of the time against 94% for those who skipped it (not significant). They rated ease of use lower (4.92 against 5.49 out of 7, significant at p = 0.047) and were slower, excluding the reading time. NN/g's advice is to think twice about a tutorial and put the effort into making the interface easy. Kendrick, NN/g, 2020. **A.** Limits: four iOS apps.
- **Education fades, or maybe not.** The 2014 review (Fernandes, Lynch and Netemeyer) found financial education explains very little of later behaviour and fades, and recommended just-in-time education tied to a specific behaviour. A 2020 meta-analysis of 76 randomised experiments (Kaiser, Lusardi, Menkhoff and Urban) found positive causal effects more than five times as large, with no clear sign of dramatic decay. **B.** The honest summary: teaching works somewhat, and the more tied to the moment it is, the safer the bet.
- **Simple rules beat accounting lessons.** In a randomised trial with a Dominican microfinance lender (roughly 1,200 clients), rule-of-thumb training improved practices and revenues, more than standard accounting training, especially for weaker starters. Drexler, Fischer and Schoar, *AEJ: Applied*, 2014. **B.** It suggests teaching a few rules ("ask for the out-the-door price first") instead of concepts.
- **Start concrete, then fade to abstract.** Fyfe, McNeil, Son and Goldstone, *Educational Psychology Review*, 2014. **B.** Evidence is mixed in scope.
- **Guess first, then see.** Trying to answer before being taught improved later performance, even when the first attempts were wrong. Richland, Kornell and Kao, 2009. **B.** The studies used reading passages. Using it for loan maths is my adaptation (**D**).
- **A glossary helps the people who need it.** In a 111-person experiment, a glossary improved understanding only for readers with limited prior knowledge and might overload others. A 2023 survey experiment found that explaining jargon raised understanding. I found no study comparing inline definitions with a separate glossary. **B/C.**
- **Older adults.** NN/g's research recommends text the user can enlarge, large link text, avoiding web jargon, and accepting input in more than one format. **B** (secondary coverage; the primary report was not retrieved).

### 2.5 The sales side, and what it tells us to teach

- **The dealer four-square.** Dealers commonly organise a deal on a worksheet with four boxes: vehicle price, trade-in value, down payment and monthly payment, and move them one against another. Consumer advice says to negotiate one number at a time, mainly the out-the-door price, and the payment last. Consumer Reports, Capital One and Bumper. **C.** Our four boxes roughly map onto this (price, fees and add-ons, trade and down, loan), which gives us a story the buyer can recognise: the dealer moves four numbers at once, and Deal Desk moves one and shows what it did.
- **Add-ons.** The FTC says add-ons are extra items bought and financed with the car, it is fine to decline them and to ask their price, and the out-the-door price should be requested in writing before financing is discussed. **A.** Shrouded add-on prices persist even in competitive markets when some buyers do not think about them (Gabaix and Laibson, *QJE*, 2006). **B.**
- **Payment packing.** The FTC describes it as getting a buyer to agree to a monthly payment larger than needed for the agreed price, then packing in add-ons. **C** (regulator and law-firm descriptions; one FTC case was reported dismissed).
- **Information helps.** Car buyers who used an online referral service paid about 2.2% less after selection controls (Zettelmeyer, Scott Morton and Silva-Risso, *Journal of Marketing Research*, 2006). **B.**
- **How the regulators structure the journey.** The CFPB's four steps: know before you shop, see ways to get a loan, know what is negotiable, understand how to close the deal. The FTC's page runs: before you buy, trade-in, financing, leasing, signing, after. **A.** Neither page defines terms inline.

### 2.6 Two more findings that shape the design

- **Opportunity cost.** Prompting people to think about what else the money could buy lowered purchase rates. A meta-analysis of 39 studies found the effect real but small (d = 0.22), much smaller than the original paper reported. Frederick et al., 2009. **B.** We should test "that is 10.6 of your monthly payments" as a framing, not assume it works.
- **Pennies a day.** Reframing a one-time cost as small recurring amounts changes how it is judged (Gourville, *Journal of Consumer Research*, 1998). **B.** The monthly payment is a pennies-a-day frame. Showing the total next to it is the corrective.

---

## 3. What live tools do today

| Tool | What I saw | Lesson |
|---|---|---|
| Calculator.net auto loan calculator | I opened it. Twelve inputs on one screen, five numbers in the result, a donut chart (principal against interest) and an amortisation table below. No stages, no explanations beside the inputs. | The standard "everything at once" tool. It is exactly the shape we are trying not to be. |
| CarEdge loan calculator | A four-part form (vehicle, loan terms, vehicle details, and so on) with about a dozen fields. I could not read its result view. | Again a form, with the education on separate pages. |
| CFPB auto loan tools | Four numbered steps with links, plus a printable shopping sheet and a guide, both PDFs. No inline definitions. | The regulator's own sequence is a good skeleton for our stages. Its teaching is a document, not an interaction. |
| FTC "Financing or leasing a car" | Seven headed sections, definitions in the text, a "what to get in writing" list. | Good source for our term cards and our "what to ask" lines. |
| Edmunds | The page refused my fetch and loaded blank in the pane. | Not reviewed. |
| NerdWallet | The calculator URL I tried returned 404. | Not reviewed. |

I did not find a tool that teaches the terms inside a stage-by-stage flow. That is the open ground.

---

## 4. Design principles that follow

1. **Start from what the dealer said, not from our fields.** (2.2, 2.5, D)
2. **One idea, one picture, one number on each step.** A budget of three numbers visible at once. (2.1, D for the number three)
3. **Two levels only.** A summary, and "show the math" one tap away. The expert grid is a separate mode, not a third level. (2.1)
4. **Teach inside the task, never before it.** Every term is explained the first time it appears, in two sentences, with a picture, at the moment the buyer needs it. No tour. (2.4)
5. **Dollars first, never percentages alone.** Use whole dollars at the top levels and cents only where a contract is checked. Use "about 22 of every 100 dollars" instead of "21.9%". (2.2, 2.3; whole dollars is D)
6. **Every picture carries information and a sentence.** Part-to-whole, aligned scale, direct labels, a one-line caption. No decorative graphics near numbers. (2.3)
7. **Show the cost of time directly.** Months are the lever buyers misjudge, so draw them: one block per payment. (2.2)
8. **Let experts out.** A visible "skip" on every step, and the current grid remains as the Desk. (2.1, expertise reversal)
9. **Never grade the buyer.** Guess-first screens are optional and unscored. (D)
10. **Plain words before correct words.** "The loan you borrow" first, "amount financed" second. (2.4, FTC finding that people misread APR and amount financed)

---

## 5. The concept: the Walk and the Desk

Two ways into the same engine.

- **The Walk** is for someone who is new. One question per screen, a picture that answers it, a term explained where it appears. It ends in a verdict they can understand in five seconds.
- **The Desk** is the grid that exists today, for someone who knows the numbers or comes back. Same data, nothing hidden.

First visit opens the Walk. The choice is remembered on the device. A switch in the header moves between them without losing anything entered.

The story that ties it together, and the line for the landing page: **the dealer moves four numbers at once. Deal Desk moves one at a time and shows you what it did.**

### 5.1 The front door (replaces the first screen of `/deal`)

One question: **"What are you looking at right now?"** Four large doors that match the plan's F1 and the regulators' journeys:

1. I am thinking about buying
2. I have a quote
3. I am at the desk
4. I am about to sign

Doors 2 and 3 are the first to build. Door 4 waits for the contract checker.

### 5.2 The ten-second check (the first value, before any effort)

On the landing page and as the Walk's first screen: ask for **two numbers the dealer already said**, the monthly payment and the number of months. Show one fact:

> $522.60 a month for 84 months adds up to **$43,898**, plus whatever you pay up front.

Then one picture (84 blocks, one per payment) and one question: "Want to see where that money goes?" That is value in about ten seconds, and it opens the central lesson without asking for the price, the rate or anything the buyer may not know yet.

### 5.3 The path for "I have a quote" (six stages)

Each stage has a question in the buyer's words, one picture, one number, and at most two term cards.

| # | The question on screen | Picture | The one number | Terms taught here |
|---|---|---|---|---|
| 1 | What did the dealer tell you? (a monthly payment, a price, or a worksheet) | The dealer's four-square drawn as a worksheet, with the box they started in highlighted | none yet | four-square, out-the-door price |
| 2 | What is the full price to drive away? | Annotated worksheet: price, tax, fees, extras stacking up into one bar | Out-the-door price | selling price, doc fee, sales tax |
| 3 | What extras did they add? | The same bar with the extras segment pulled out and labelled | What the extras really cost (price plus tax, plus interest if financed) | add-on, service contract, GAP |
| 4 | How many months, and at what rate? | The payment strip: one block per month, blocks coloured by car, extras, interest | What you pay in total | APR, loan term, finance charge |
| 5 | What about your trade-in and down payment? | The equity gauge: allowance above the payoff line or below it | What you still owe vs what it is worth | trade-in allowance, payoff, negative equity |
| 6 | Here is your deal | The money bar: car, tax and fees, extras, interest | Total you would pay, and one sentence | total of payments |

Stage 4 includes the optional **guess first** screen: "Which costs more in total: $639 for 60 months or $523 for 84 months?" The buyer taps, then sees the strip. No score, no "wrong".

After stage 6: **"Add the second offer"**, which opens the comparison (see 6.3) and then the money trail and the asks.

### 5.4 The path for "I am at the desk"

For a buyer already in the conversation. One screen at a time, each answering "what did that change just do?" The dealer changed a number, so the buyer types only that number, and the Walk shows the money trail for that one move, with a sentence ("Adding 24 months lowered the payment $117 and raised the total $3,073"). The grid is one tap away.

### 5.5 Wireframes (phone, one screen each)

```
Front door                    Ten-second check             Stage 4: loan
+------------------------+    +------------------------+   +------------------------+
| Deal Desk        [A+]  |    | What did the dealer    |   | How many months?       |
|                        |    | say?                   |   |  [ 60 ] [ 72 ] [ 84 ]  |
| What are you looking   |    |                        |   |                        |
| at right now?          |    | Monthly payment        |   | 84 payments            |
|                        |    |  [ $ 522      ]        |   | ■■■■■■■■■■■■■■■■■■■■   |
| [ Thinking about it ]  |    | Months                 |   | ■■■■■■■■■■■■■■■■■■■■   |
| [ I have a quote    ]  |    |  [ 84         ]        |   | ■■■■■■■■■■■■■■■■■■■■   |
| [ I am at the desk  ]  |    |                        |   | ■■■■■■■■■■■■■■■■■■■■   |
| [ About to sign     ]  |    | Over 84 months that    |   | ■■■■ (24 more than 60) |
|                        |    | adds up to $43,898.    |   |                        |
|                        |    |                        |   | You pay in total       |
| Skip: open the grid    |    | [ See where it goes ]  |   | $46,898   (+$5,539)    |
+------------------------+    +------------------------+   |                        |
                                                           | "APR" (tap to see)     |
Stage 6: your deal                                         | [ Next ]  [ I know this]|
+------------------------+                                 +------------------------+
| You would pay in total |
| $46,898                |
| [ car 67% | tax, fees 7% | extras 4% | interest 22% ] (bar, labelled directly)
| About 22 of every 100 dollars is interest.
| Offer 1 would have been $41,359.
| [ Add a second offer ] [ What to ask ]
+------------------------+
```

---

## 6. The graphics (all informative, none decorative)

| Graphic | What it shows | Why this form |
|---|---|---|
| **G1 Payment strip** | One block per monthly payment (60 or 84), coloured by what it pays for. Two strips stacked show the extra months as the extra blocks. | Counting blocks is a frequency format (Garcia-Retamero, IPDAS) and makes the length of the loan physical. |
| **G2 Money bar** | One bar for the total paid, split into car, tax and fees, extras and interest, with direct labels. | Part to whole on one scale. Labels sit on the segments, so the buyer never matches a legend. |
| **G3 Two-offer bars** | Offer 1 and Offer 2 on the same scale, with the extra shown as a bracket. | Same scale and same denominator (IPDAS). Line up the segments that matter most at the left edge so they can be compared by position. |
| **G4 Annotated worksheet** | A drawn dealer worksheet with callouts: "this is the selling price", "this is the doc fee". | Teaches names where the buyer will see them, which is Mayer's pre-training and signalling idea. Prepares for the later worksheet reader. |
| **G5 Equity gauge** | A zero line with the trade-in allowance and the payoff as two bars. | Negative equity is easier to see as a bar below a line than to read as a sentence. |
| **G6 Money trail** | The existing bars, rebuilt with plain labels, whole dollars, and a plus or minus sign and arrow. | Already built. It moves to the second level, behind "show the math". |
| **G7 Months slider** | Drag months from 36 to 84 and watch the payment fall and the total rise together. | A generative activity. IPDAS says interactive formats still need more research, so this one gets tested, not assumed. |

Illustrations: a small set of line drawings in the palette (worksheet, pen, key tag, car in side view) used only on stage headers and term cards, never near numbers. They give the product a face without adding load. Mayer's coherence principle is the reason to keep them away from the figures.

---

## 7. Terminology: teach it where it appears

- **Plain label first.** Screen says "What you borrow", with "(amount financed)" in smaller text, and the term card says why the dealer's paper uses the other name.
- **A term card** is a bottom sheet opened from a dotted-underlined word. It holds two sentences, one small picture from the same family as the graphics, and one "what to ask" line. This is the plan's F7, built in the right place.
- **Each term enters at one stage only**, the first time it is needed, and the card remembers it was shown. A short "Words you have met" list collects them.
- **Definitions** come from sources already read: the FTC page (APR, out-the-door price, finance charge, amount financed, negative equity, add-on, lien) and the CFPB example. Any statement about law or rights stays out unless a primary source is cited, as PLAN.md already requires.
- **Evidence status:** a glossary helps low-knowledge readers and may overload others, so it is pull-only, never forced (2.4).

---

## 8. What the engine needs (small, testable)

All additions are pure functions with tests, in the existing style:

1. **Payment-only total**: payment times months, with and without a down payment. (Feeds the ten-second check.)
2. **Cost breakdown**: car, tax and fees, extras, interest, adding up to the total to the cent. (Feeds G2, G3.)
3. **Amortisation split**: interest and principal per month. (Feeds G1 colours.)
4. **Payment equivalents**: an extra cost divided by the monthly payment, for example $5,538.80 is about 10.6 payments. (Hypothesis, see 2.6.)
5. **Price from payment**: invert the payment formula for a given rate and term (the `principalFromPayment` helper already exists).

---

## 9. How we will know it works

PLAN.md already sets "a first-time user reaches a correct total in under 3 minutes with 5 people who have never bought a car". I would keep that and add the FTC method, which is the best-run test I found.

- **Who:** 8 people in each of two groups, aiming for at least 3 novices and 3 over 60 in each. Same tasks in the grid (current) and the Walk (new), different people in each.
- **Tasks:** 8 questions in the FTC style: what is the total, which offer costs less in total, why is one payment lower, how much of the total is interest, what do the extras really cost, what would you ask for.
- **Measures:** percentage correct, time to a correct total, where people hesitate, and what they say when asked "would you keep using this?" (think-aloud).
- **A target to aim at, not a prediction:** the FTC prototype gained 19 points over the existing forms. A Walk that gains less than about 15 points on comprehension is not worth the added complexity.
- **Also test:** the guess-first screen (does it feel like a quiz), the payment-equivalent line (does it help or confuse), and G7 against a static picture.

---

## 10. Risks and honest limits

- **Most decision-aid research is medical.** The mortgage disclosure study and the payday-loan experiment are the closest finance evidence. The step to car loans is an inference (D).
- **Evidence on financial education is contested.** The 2014 and 2020 reviews disagree on size. We rely on just-in-time teaching because it is the safer position under either.
- **Tutorials and the Walk are different things, but a Walk can feel like a tutorial.** The NN/g result is for four iPhone apps. Mitigation: every stage collects a real number, no stage is only reading, and "skip" is always visible.
- **Click fatigue.** GOV.UK warns that one-question pages feel slow without a progress indicator. We need a visible rail ("Stage 3 of 6") and quick numeric entry.
- **Opportunity-cost framing is a small effect.** Test before building around it.
- **Legal care on dealer practices.** Say what the FTC says, in its words, and no more. Never state that a given dealer is packing a payment.
- **Not read in full:** the CFPB and Kleimann loan-estimate testing report (too large to fetch), the IPDAS chapter on presenting probabilities (fetch failed), NN/g's older-adults report, and the published versions of Stango and Zinman, Peters et al. and Garcia-Retamero and Cokely. Those entries rest on abstracts and summaries.

---

## 11. Proposed build order (for approval, not started)

**Phase 1, about 3 days.** Engine additions with tests. The Walk shell: front door, ten-second check, stages 1 to 6 for "I have a quote". G1, G2 and G4. Twelve term cards. The landing hero rebuilt around the ten-second check and the four-square story. Desk mode kept as is, with a switch.

**Phase 2, about 3 days.** "At the desk" path. G3, G5, G6 refinement, G7. The remaining term cards. The "what to ask" step wired into the Walk's end.

**Phase 3, about 2 days plus testing time.** The test in section 9, then revisions. Accessibility passes (keyboard, screen reader, axe) as already listed in the design notes.

---

## 12. Decisions for the owner

1. Approve the Walk plus Desk split, with the Walk as the default for a first visit.
2. Approve the front-door wording and the four doors.
3. Approve making the ten-second check the landing page's main interaction (replacing the static readout).
4. Illustrations: I draw a small consistent set in the product palette, or you supply or commission them.
5. Who can I test with: 16 people, half of them over 60?
6. Confirm the dealer four-square as the story, given the sources are advice articles (C), not research.

---

## Sources

Read in full or in main part (A):

- Lacko and Pappalardo, FTC, *Improving Consumer Mortgage Disclosures* (2007): https://www.ftc.gov/reports/improving-consumer-mortgage-disclosures-empirical-assessment-current-prototype-disclosure-forms
- Argyle, Nadauld and Palmer, *Monthly Payment Targeting and the Demand for Maturity*, NBER 25668: https://www.nber.org/papers/w25668
- Kendrick, NN/g, *Mobile Tutorials: Wasted Effort or Efficiency Boost?* (2020): https://www.nngroup.com/articles/mobile-tutorials/
- Nielsen, NN/g, *Progressive Disclosure* (2006): https://www.nngroup.com/articles/progressive-disclosure/
- CFPB, *How do I compare auto loan offers?*: https://www.consumerfinance.gov/ask-cfpb/what-should-i-look-for-when-buying-a-car-en-753/
- CFPB, auto loan steps and tools: https://www.consumerfinance.gov/consumer-tools/auto-loans/
- FTC, *Financing or Leasing a Car*: https://consumer.ftc.gov/articles/financing-or-leasing-car

Abstract or summary level (B):

- Peters et al. (2007), *Less Is More in Presenting Quality Information to Consumers*, Medical Care Research and Review 64
- Stango and Zinman (2009), *Exponential Growth Bias and Household Finance*: https://econpapers.repec.org/RePEc:bla:jfinan:v:64:y:2009:i:6:p:2807-2849
- Garcia-Retamero and Cokely (2013), *Communicating Health Risks with Visual Aids*: https://www.psychologicalscience.org/publications/observer/obsonline/visual-aids-can-help-people-better-understand-health-risks.html
- IPDAS standards, presenting probabilities: https://decisionaid.ohri.ca/IPDAS/IPDAS-Chapter-C.pdf
- Bertrand and Morse (2011), payday borrowing: https://www.povertyactionlab.org/evaluation/information-disclosure-cognitive-biases-and-payday-borrowing-united-states
- Fernandes, Lynch and Netemeyer (2014): https://papers.ssrn.com/abstract=2333898 and Kaiser, Lusardi, Menkhoff and Urban (2020): https://www.nber.org/papers/w27057.pdf
- Drexler, Fischer and Schoar (2014): https://www.aeaweb.org/articles?id=10.1257/app.6.2.1
- Peters et al. (2006), *Numeracy and Decision Making*: https://research.chalmers.se/en/publication/82667
- Fyfe, McNeil, Son and Goldstone (2014), concreteness fading: https://pc.cogs.indiana.edu/?p=885
- Richland, Kornell and Kao (2009), the pretesting effect: https://learninglab.uchicago.edu/Pre-Testing_files/RichlandKornellKao.pdf
- Frederick et al. (2009), opportunity cost neglect: https://econpapers.repec.org/RePEc:oup:jconrs:v:36:y:2009:i:4:p:553-561
- Gourville (1998), pennies a day: https://econpapers.repec.org/RePEc:oup:jconrs:v:24:y:1998:i:4:p:395-408
- Gabaix and Laibson (2006), shrouded attributes: https://econpapers.repec.org/RePEc:oup:qjecon:v:121:y:2006:i:2:p:505-540.
- Zettelmeyer, Scott Morton and Silva-Risso (2006): https://papers.ssrn.com/abstract=776003
- Mayer, multimedia learning principles (summaries): https://lucidea.com/blog/mayers-12-principles-of-multimedia-learning
- Chen, Kalyuga and Sweller (2017), element interactivity: https://link.springer.com/10.1007/s10648-016-9359-1
- GOV.UK Design System, question pages: https://design-system.service.gov.uk/patterns/question-pages
- W3C, *Making Content Usable for People with Cognitive and Learning Disabilities*: https://www.w3.org/TR/coga-usable/
- NN/g on older adults: https://www.nngroup.com/articles/usability-seniors-improvements/

Advice and trade sources (C):

- Edmunds Q3 2026 figures, via KPRC: https://www.click2houston.com/news/local/2026/10/19/new-car-payments-hit-record-787-a-month-as-buyers-take-on-longer-loans-report-finds/
- Four-square explanations: Consumer Reports https://www.consumerreports.org/consumerist/dealerships-rip-you-off-with-the-four-square-heres-how-to-beat-it/ , Capital One https://ane-west1.capitalone.com/cars/learn/getting-a-good-deal/understanding-the-4-square-method-of-car-dealer-negotiation/1572 , Bumper https://www.bumper.ca/car-advice/buying/four-square-trap/
- Payment packing descriptions: https://www.lawinfo.com/resources/dealer-fraud/auto-dealer-payment-packing.html

Tried and not read: CFPB/Kleimann *Know Before You Owe* comparison study (file over the fetch limit), NerdWallet and Edmunds calculators (404 and blocked), IPDAS chapter C (fetch failed).
