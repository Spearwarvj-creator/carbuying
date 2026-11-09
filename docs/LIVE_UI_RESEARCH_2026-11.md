# Live UI research, 9 November 2026

Everything here was read or looked at in Claude in Chrome today, not recalled. Where a page was blocked or gated I say so. Nothing is built. This feeds the Walk and Desk plan in `UX_RESEARCH_AND_PLAN.md`.

Method: web.dev's "New to the web platform" posts for January to October 2026 and the August Baseline digest; the Web Platform Status API (`api.webstatus.dev`) for Baseline status and first-supported browser versions; MDN for anything the API could not settle; then real products and design galleries, with screenshots.

---

## 1. The browser platform as of today

Chrome and Firefox moved to two-week releases in September 2026, so features land faster than the older reference files assume. Statuses below are from the Web Platform Status API unless marked MDN.

### Safe to use now (Baseline, every engine)

| Feature | Baseline since | What it does for Deal Desk |
|---|---|---|
| Scroll-driven animations | 2026-10-27 (Firefox 159 completed it) | The stage rail fills as you move through the Walk. Landing sections reveal on scroll without an `IntersectionObserver`. Runs off the main thread. |
| View Transitions, same document | 2025-10-14 | A step change in the Walk morphs the running total and the strip instead of cutting. Moving from Offer 1 to Offer 2 morphs the bars. |
| Anchor positioning (MDN: Baseline 2026, newly available) | Safari 27, Sept 2026 | Term cards sit next to the word they explain, with no positioning script. |
| Popover API | 2025-01-27 | Term cards and the entry sheet as real popovers with built-in dismiss and focus handling. |
| Container queries (size) and container style queries | 2023 and 2026-05-19 | Fixes the tablet gap properly: each panel lays itself out from its own width, not the window's. |
| `field-sizing` | 2026-06-16 | The amount box grows to fit the number, so "$31,500" does not sit in a fixed-width slot. |
| `contrast-color()` | 2026-04-10 | Text on the yellow total and on any token colour picks a readable ink on its own. |
| `sibling-count()` and `sibling-index()` | 2026-08 | The payment strip staggers its blocks and sizes them by count, with no JavaScript. |
| `light-dark()`, including images (Sept 2026) | 2024-05-13 | One declaration per colour instead of two token blocks. |
| Relative colour and `alpha()`, `color-mix()` | 2023 to 2026 | Tints and washes derived from the tokens, not typed by hand. |
| `@starting-style`, `:open`, `details` `name` and `::details-content` | 2024 to 2026 | Entry animation for term cards without JavaScript. Exclusive "show the math" disclosures. |
| `text-wrap: balance`, `scroll-snap`, `subgrid` | earlier | Already in use or safe. |

### Use only as an enhancement, with a fallback

| Feature | Where it stands | How we would use it |
|---|---|---|
| `text-fit` (automatic font scaling) | Chrome 150 only | Fit the big total to its box in Chrome; keep the current `clamp()` everywhere else. |
| `text-box` (trim) | Chrome 133, Safari 18.2, no Firefox | Tighten the numerals' top and bottom spacing where available. |
| Cross-document view transitions | Chrome 126, Safari 18.2, no Firefox | A soft move from landing to the calculator where supported. |
| Interest invokers and `popover=hint` | Chrome 149 and 151, Firefox 153 for hint, no Safari | Term cards open on hover and keyboard focus in Chrome. Click everywhere. |
| `text-wrap: pretty` | no Firefox | Already a harmless hint. |
| Scroll-triggered animations, `focusgroup`, `corner-shape`, customizable `<select>`, `calc-size`, gap decorations | Chrome only or Chrome and Safari | Not needed now. Revisit when they reach Baseline. |

Policy this implies: Baseline features are used freely. A limited feature is allowed only if the page is complete without it. The Lighthouse "Baseline features" audit (added July 2026) can check that automatically.

Also seen: Google's "Modern Web Guidance" skill set, described in the August digest as helping coding agents write Baseline-aware CSS. I did not install it.

---

## 2. What real products do

### Tesla, Model Y design page (live)

- A large product image on the left, one panel of choices on the right, and a persistent bottom bar with the configuration name, "$579 /mo Est. Financing", and "Order Now".
- Cash, Lease and Finance are three tabs. Each model card shows "From $669/mo" and similar.
- The financing dialog asks four things (ZIP, term, credit rating, due at delivery) and answers with one large number, with a "View breakdown" link and a "Get trade-in value" button.
- I did not see a total price in that dialog. Everything leads with the monthly figure, which is the framing our research flagged.
- Take: a persistent summary bar that stays while you decide, four inputs at most per dialog, one big answer. Our difference is that the answer is the total.

### Wise, send money (live)

- The calculator card shows five things: "You send exactly", "Recipient gets", "Arrives by", "Total fees" with an expand arrow, and a plain note when a discount applies.
- The comparison table below ranks providers on one outcome, "Recipient gets", and lists the fees beside it. A short paragraph teaches the idea right there: the real cost is the fee and the rate together, so "no fee" can still cost more.
- Term help is a small "?" beside the term ("Mid-market exchange rate").
- Take: compare on the outcome, put the lesson at the point of comparison, and keep the explanation one tap behind a "?". This is the same shape as our payment-versus-total lesson.

### Carvana (live)

A full-bleed photograph hero, a search field, and two large actions ("Get pre-qualified", "Get your offer"), with the line "No credit impact, view real payments while shopping". Photo-led, payment-first.

### Affirm (live)

A dark navy hero with a very large light headline that sets one word in italic ("Find the gift here"), a glass-edged header bar, and a "0% APR option" chip. A cookie banner offered Manage, Reject all and Accept all; I did not accept.

### Design galleries

- Awwwards, finance category, and Godly: the leading finance and AI-finance examples are dark navy or black pages with 3D chrome objects, blue-violet glow, and glass cards. This is now the common look, and it is the look the premium-ui checklist calls a tell.
- Refero ("design research for the AI era"): real product screens and flows, with Onboarding and Workflows categories and an MCP connector. The search needs a login, so I could not browse it. Connecting it would be your decision, since it uses your account.
- Could not review: the New York Times rent-versus-buy calculator (login wall) and the CFPB interest-rate tool (the page rendered without its styles in my browser). Edmunds and NerdWallet were already unavailable earlier.

---

## 3. What changes in the plan

1. **A persistent bottom bar in the Walk (from Tesla), showing the total, not the payment.** It stays on every step, with an expand arrow into the breakdown (from Wise). This replaces the tab bar idea for the Walk.
2. **Compare options on one outcome (from Wise):** "You pay in total", with the monthly payment shown beside it.
3. **Term help is an anchored popover opened from a "?" or a dotted word (from Wise).** Built on Popover plus anchor positioning, with hover and focus opening in Chrome as an enhancement.
4. **At most four inputs per step (from Tesla).** The Walk's steps already hold to one to three.
5. **Motion from the platform, not scripts.** View Transitions for steps and the total, scroll-driven animation for the stage rail and landing, `@starting-style` for cards, `sibling-index()` for the payment strip stagger. Each has a reduced-motion fallback.
6. **The tablet fix uses container queries** rather than another breakpoint.
7. **Tokens move to `light-dark()`, relative colour and `contrast-color()`, and one type scale** (the 45 font sizes found in the audit collapse to a short set).
8. **Look: do not follow the gallery trend.** The dark-navy, glow and 3D look is the crowd's default. Ours stays the green-teal glass with the condensed numerals, a light screen switch, and no glow.
9. **A car image question for you.** Tesla and Carvana lead with the car. We have no photography rights. Options: a single line-drawn car in our palette on the front door, or none.
10. **Check with tooling:** run the Lighthouse Baseline features audit on every page to prove we only use what we claim.

---

## 4. What I could not check

- I did not see the Tesla total or breakdown behind "View Breakdown".
- Anchor positioning's status comes from MDN's banner. The status API lists only Safari for that feature name, so I treated MDN as the source.
- I did not test any of these features inside Deal Desk yet. This is research, not a prototype.
- No mobile devices were used; I looked at desktop renderings at 1440 pixels wide.
