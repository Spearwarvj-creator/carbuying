# More pictures, fewer bare numbers: research and what was built

12 November 2026. The owner said the calculator still showed mostly numbers.

## 1. Where the app was numbers only

| Screen | Before |
| --- | --- |
| Desk, total and changes | Three big numbers and a sentence |
| Desk, money trail | Rows of label and amount. Each row had a bar, but at mid widths the amount squeezed it to a sliver |
| Desk, Compare tab | A table of figures |
| Walk, result | A ring and one bar (already visual) |
| Anywhere | Nothing showed how fast a loan is paid off, or what a payment pays for |

The Walk already had a payment strip, a money bar, a ring and the four-square. The Desk, where a buyer sits at the dealer, had none of them.

## 2. What the research says

The search results were thin on car loans in particular, so these are general findings from adjacent work, not tests of this exact design.

- **Graphs beat bare numbers only when they are simple.** Evidence on charts versus numbers is mixed. A randomized trial found icon arrays and bar graphs worked about equally, and one study suggests bar charts help people who are less sure with numbers. [Systematic review of data visualization in financial literacy](https://arxiv.org/html/2506.20901v1), [randomized trial summary via Southampton](https://eprints.soton.ac.uk/452868).
- **Declutter and focus.** Readers shown a graph that was both decluttered and focused on one point were about 2.5 times more likely to capture the main conclusion. [Kellogg Insight on Xiong, Franconeri et al.](https://insight.kellogg.northwestern.edu/article/do-people-understand-your-data-visualizations), [Zacks and Franconeri, Designing Graphs for Decision-Makers](https://visualthinking.psych.northwestern.edu/publications/ZacksDecisionMakers2020.pdf).
- **Plain numbers and context help.** Federal Reserve consumer testing found plain words and context improve comprehension of loan disclosures. [Federal Reserve, Designing Disclosures](https://www.federalreserve.gov/pubs/bulletin/2011/articles/designingdisclosures/).
- **A distribution picture helped people judge relative cost** in credit-card disclosures. [Journal of Experimental Psychology: Applied, via Southampton](https://eprints.soton.ac.uk/450011/).
- **Loan balance over time is the standard picture for loans.** The Federal Reserve's leasing guide plots the balance as a falling curve and shades the gap against the car's value. [Federal Reserve leasing chart description](https://www.federalreserve.gov/pubs/Leasing/resource/consider/endclosed_exp1_chart2_desc.htm). Most calculator sites use a balance-over-time line or a principal-versus-interest chart.
- **Comparison calculators** favor total cost bars with a "best" marker, and total cost over monthly payment as the fair comparison.

## 3. Design rules taken from it

1. One message per picture, with direct labels instead of a legend where possible.
2. Same scale for anything compared, so position and length carry the answer.
3. Every number in a picture still comes from the engine. The pictures draw; they never calculate on their own.
4. Every picture has a spoken description and a figure in text, so it is not the only way to read it.

## 4. Built

| Picture | Where | What it shows |
| --- | --- | --- |
| **Offers on one scale** | Desk (under the total, from 900px wide), Compare tab (narrow screens) | One bar for each offer's total, cut into the car, tax and fees, extras, an old loan and interest. The longer bar is hatched over the part that is more, with the difference named |
| **Balance over time** | Walk result, Compare tab | What you still owe each month. One loan: a dot at the halfway point, "57 in 100 still owed". Two loans on one scale, so a longer loan is seen falling slower |
| **What each payment pays for** | Walk result | First and last payment cut into interest and loan. The first is mostly interest, the last almost none |
| **Money trail bars** | Desk | The bar now sits under its label at full width, so it is always seen |

Engine: `loanSchedule`, `paymentSplit`, `halfPaidMonth` in `src/engine/schedule.ts`. Tests check the schedule ends at zero, its interest matches the deal's interest to the cent, the balance only falls, a loan with no interest falls in a straight line, and the first and last payment add up to the payment. All in English and Spanish. Axe found no problems on the Desk in Spanish.

Files: `src/components/walk/charts.tsx`, styles `vz-*` at the end of `src/app/walk.css`, words in `more.visuals`.

Fixed on the way: the big "change in total" figure ran out of its column between 900 and 1280px wide.

## 5. Built in the second round (all of what was left out the first time)

| Picture | Where | What it shows |
| --- | --- | --- |
| **What a different length does** | Walk loan step | The same loan and rate at 36, 48, 60, 72 and 84 months (plus the buyer's own): one bar for the payment, one for the interest. Payment bars shrink and interest bars grow. The buyer's length is marked |
| **Will you owe more than the car is worth?** | Walk result | The balance against an estimate of the car's value, with the gap shaded and "about 53 months, the biggest gap about $8,021". Three speeds: holds its value, typical, loses it fast |
| **Trade-in against what is owed** | Walk trade step | Two bars on one scale. When more is owed than the car is worth, the owed bar is hatched over the part that is more and the amount is named, which is the amount added to the new loan |
| **Slim offer bars** | Phone Deal tab | Both offers on one scale, without the key, so the number boxes stay on the screen |

**The car's value is an estimate, and the chart says so.** It is the one picture that uses a number the calculator cannot know. The three speeds follow published figures, which differ by source: first-year loss from about 12% to 24%, and 40% to 55% of value gone after five years ([Experian](https://www.experian.com/blogs/ask-experian/how-much-do-cars-depreciate-per-year/), [Kelley Blue Book](https://www.kbb.com/what-is/car-depreciation/), iSeeCars via the same search). The speeds are 12% then 8% a year (about 37% lost in five years), 18% then 11% (about 49%) and 24% then 14% (about 58%). A test keeps all three inside 35% to 60%. The estimate is used only to draw this chart, never in any total, payment or flag.

Engine: `depreciation.ts` (`carValue`, `underwater`) and `termComparison` in `schedule.ts`, with tests.

Checked: type check, lint, 193 tests, the loan step, trade step and result at phone and desktop widths, the Desk on a phone, Spanish on the loan step, and axe on the result page. Also fixed the amount being cut off on the trade-in bars on a phone.

On a phone the money trail keeps its old one-line rows. The two-line rows are for 900px and wider, because on a phone they pushed the number boxes off the screen.

## 6. Still not done

- **User testing.** None of these pictures have been tested with real buyers. The research does not prove they beat plain numbers.
- **The loan length chart assumes the same rate.** A lender may quote a different rate for another length, and the chart says so.
- **Depreciation is an average.** A particular car can lose value faster or slower. A buyer who knows theirs can use the three speeds as a range.
- **Compare tab** has the offers on one scale and the balance curves, but not the length chart or value chart. They are for one offer at a time.
