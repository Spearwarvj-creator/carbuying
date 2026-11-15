# Persona audit before the video

14 November 2026. Method: the production build with the live AI key, driven as four buyers. Phone (375 wide), desktop (1280), large text and light screen, the AI routes asked each person's real questions, and the voice and text number finder run on what each person would say. Nothing here is from user testing with real people. It is one reviewer playing four parts.

## The four buyers

| Who | Situation | What they bring |
| --- | --- | --- |
| **Maya, 22** | First car, no loan history, phone only | Fears being tricked, does not know the words, wants a quick answer and a script |
| **Dan, 38** | Has bought three cars, standing at the dealer | Wants speed, quotes "out the door", compares dealers, wants to catch tricks |
| **Robert, 68** | Nervous, daughter helps, large text, light screen | Wants plain words, a human voice, paper, and to know nobody is selling his details |
| **Sofia, 45** | Spanish first, some experience | Wants the same help in Spanish, and honest answers on extras |

## What each expects, and what they met

### Everyone's top five (not there, or only half there)
1. **"Is this a good rate, price or fee?"** Every person asks it. The AI says it cannot tell ("I can't tell you if 7.9% is good for you"), which is honest but leaves them where they started. There is no reference to compare against. *Suggested:* a dated, sourced "typical rates by credit band" card, typical fee ranges (required and optional), and a prompt to get a pre-approved loan from a bank or credit union first. All as labelled reference data, not AI numbers.
2. **Out-the-door entry.** Dan's dealer quotes one number. The finder ignores "out the door is 36,800" on purpose (it is not the selling price), and the Desk has no way to start from it. *Suggested:* enter the out-the-door price and the tax rate and work back to price, loan and payment.
3. **"What do I do next?"** The result ends at the numbers and a list of checks. Maya and Robert expect a short "before you sign" list (get the total in writing, compare with a bank's offer, read these lines of the contract, check the VIN). It can print.
4. **Sales tax is a blank percent box.** New buyers do not know their rate. The ZIP lookup that fills it sits inside "Help with the tax", closed. *Suggested:* a visible ZIP box on the price step.
5. **No answer to "why is this free, and who is behind it?"** Robert and Maya both wonder. The About page does not say. A line on who makes it, that it has no ads and does not sell data, would help.

### By person

**Maya (first-time, phone).** The welcome and the three doors work well. Found: the "thinking about buying" screen asked "What did the dealer say?" when she has not met a dealer (**fixed**: now "What monthly payment are you looking at?"). Step 1 then asks "What did the dealer say first?" again for the payment path (not fixed). Months starts on 72, which nudges long loans (60 would be a safer default). Terms like "doc fee" and "out-the-door" are explained only if she taps them. She would use voice and the camera, and neither is mentioned on the landing page. She expects to hear what a car costs her beyond the loan (insurance, fuel). Fuel is there from a VIN lookup, insurance is not.

**Dan (experienced, at the dealer).** The Desk is what he wants: type numbers, see the total move, two offers, a sentence to say. Found two real bugs in what he says out loud, both **fixed**: "three thousand down, seven point nine for seventy two months" gave a down payment of $8 (it took the rate), and a list of extras ("warranty 2,400, paint protection 995") counted only the first. Fees and extras are now added together, and GAP, nitrogen, tint, etching and similar are recognised. Not fixed: "8 grand for my trade" needs the word "trade in". He also expects a lender comparison (a bank's offer against the dealer's), and a lease against buy view.

**Robert (older, large text, light screen).** The layout holds at large text with no sideways scroll, the welcome fits, and the main buttons are 48px high. Found: the step dots are 30px and the footer links 36px (under the 44px most guidance asks for); the chart labels stay about 14px when text is set to large because they are drawn inside the picture; the result page is long (about 640 words) with no one-sentence summary at the top. He would use Read it to me and Print. He wants a person to call, which the app cannot give, so "Share this deal" with his daughter is the closest. He also reads the "Not financial or legal advice" line as a reason to distrust the whole thing, so the plain explanation of why it says that matters.

**Sofia (Spanish first).** Spanish works through the whole calculator, the new pictures and the AI answers (the extended-warranty answer was clear and did not push). Spanish text needs a native reader. The landing, About and legal pages are English only, which is the first thing she sees.

## AI assistance: what people expect, and what exists

| Expectation | State |
| --- | --- |
| Ask in my own words | Works, per line of the deal (Explain this). Each question stands alone, with no memory of the last |
| "Is this a good deal?" / "Should I take it?" | Refuses by design, but offers nothing useful in its place (see top five) |
| Read my paperwork from a photo | Built and tested on generated worksheets only. Real photos (glare, folds) are untested |
| Speak instead of type | Works where the browser supports it. English number words need a keyword like "price" or "down" |
| Tell me what to say | Works, in four tones and Spanish. Practice with a pretend finance manager works |
| Chat about my whole deal | Not there. Only per-line questions. *Suggested:* one "Ask about this deal" box on the result with the whole deal as its facts |
| Compare my lender with the dealer | Not there |

Wording fixed on the way: answers said "The context does not say..." (the app's own plumbing showing). They now say "The numbers don't show that" and then what to ask the dealer.

## What I changed this round
- Number finder: down-payment mix-up, several extras and fees added together, more extras recognised (5 new tests).
- "What monthly payment are you looking at?" on the payment screen, in English and Spanish.
- AI answers no longer say "the context".
- 209 tests, type check and lint clean.

## Before recording the video
- **Show the features the landing page hides**: the camera and voice fill, lease check, VIN lookup, Spanish. They are the strongest things and nothing on the landing page mentions them.
- **Do not promise "is this a good deal"** in the video. The app does not answer it. Say what it does: shows the real total, what each change costs, what to ask, and what to say.
- **Use a real worksheet photo** in the demo and do a dry run first. Only generated test photos have been read so far.
- **Set `NEXT_PUBLIC_YOUTUBE_URL`** after upload so the welcome and Help link to it, and set the contact email.
- **Fix before filming if you can**: the visible ZIP box (top five, number 4) and the "why free" line (number 5). Both are small.

## Round 2: everything in the audit that was open, fixed (14 November 2026)

| Finding | What was done |
| --- | --- |
| No way to tell if a rate is typical | **Is this rate typical?** on the loan step and the Desk Checks tab. Pick a credit range and new or used, see the rate on a 0 to 25% scale beside the published average, with how many points above or below. Reference data is in `src/data/rates.ts`: Experian, Q2 2026, VantageScore 4.0 (new 4.41, 6.15, 9.71, 13.52, 16.11; used 6.29, 8.81, 13.93, 19.10, 21.62), with a link to the source. It says "averages, not offers" and never says whether to take the loan. It also tells the buyer to get a pre-approved loan from their own bank or credit union first |
| No out-the-door entry | **Only have the out-the-door total?** on the price step. Enter the total and it works back to the selling price with the tax rate and fees entered (`priceFromOtd`, which runs the deal's own tax rule backward). 36,800 gave 33,474.13, and putting it back gave 36,800.00. Tested on over 100 combinations to the cent |
| Nothing to do after the numbers | **Before you sign** list on the result: five things for every deal, plus extras, old loan added, and long loan items when they apply. Tick boxes on the page, and the same list prints on the one-page sheet |
| Sales tax hidden | The ZIP box now sits right under the tax field |
| "Why is it free?" | New "Free, with no ads" section on the About page. It says what is true: free, no ads, no account, does not sell or share what you enter, AI has a daily limit because it costs money. Edit it if the business plan changes |
| Result page has no short summary | One sentence at the top: "You would pay $51,575 in total: $31,500 for the car and $20,075 for tax, fees, extras and interest. That is $578.27 a month for 84 months at 7.9%." |
| Step 1 asked "What did the dealer say first?" | Now "Where are you starting?" |
| Months started on 72 | Now 60 |
| Tap targets under 44px | Step dots and footer links now have a 44px area |
| Chart words stay small at large text | They grow with the large text setting |
| "8 grand for my trade" missed | Now read as the trade-in value |
| Landing pages English only | **Not done.** The landing, About and legal pages are static English pages, and the legal ones need a native-speaking lawyer or reviewer, not a quick translation |

Checked: type check, lint, 217 tests, the price, loan and result steps on a phone, axe on the result page (no problems), the About page. Not driven this round: the new pieces in Spanish on screen (the Spanish strings are in and type-checked).

## What an AI-driven deal desk should add next

In order of how much I think each helps a buyer:

1. **"Ask about my deal"**: one box on the result that answers any question using the whole deal as its facts. Today the AI answers one line at a time and forgets the last question. People expect to talk to it.
2. **Compare my lender with the dealer**: enter a pre-approval (rate, months) and see the saving or cost against the dealer's offer, in dollars. It is the number that wins the negotiation.
3. **A live quote watcher**: as the dealer changes numbers, say what moved the total and flag when a "lower payment" came from a longer loan, more extras or a higher rate. Built on the money trail that already exists.
4. **Contract check by photo, end to end**: photo of the contract, then a line-by-line match against the worksheet the buyer entered ("the contract says 7.9% but your worksheet said 6.4%"). The reader is built. The comparison and the real-document test are not.
5. **Total cost of owning it**: insurance, fuel and typical upkeep on top of the loan. Fuel is there. Insurance is the missing piece and the one first-time buyers get hit by.
6. **Trade-in reality check**: a range for what the trade-in is worth, so the dealer's number can be compared. Needs a data source.
7. **Negotiation rehearsal that scores you**: practice exists. Make it replay the buyer's own deal and show which of the five key points they covered. Partly there.
8. **Text or email the dealer**: draft the message from the "what to say" line, ready to send. Drafting exists. Sending it from the app does not, and I would keep it as copy and paste.
9. **Lease against buy** and **buy now or wait** views for experienced buyers.
10. **Follow-up reminders**: "your contract is due in 3 days", "cancel the extra within 30 days". Needs an account or push, which goes against the no-account promise, so it is the one I would leave out.

What to avoid: anything where the AI makes a number or says "take this deal". The rule that the calculator makes every number is what makes the app trustworthy, and the benchmark card above is the model for adding outside facts: dated, sourced, labelled.
