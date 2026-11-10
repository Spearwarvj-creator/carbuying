# Deal Desk design notes

Draft 1, 2026-11-09. This replaces the window-sticker direction in PLAN.md section 6, which the owner asked to change: the whole job must fit one screen, and the theme is dark.

## The idea

A readout, not a document. The buyer keeps the phone open at the desk. The dealer says a new number, the buyer types it, and three things stay in view at once: the total, what changed, and where the money moved. Nothing needs scrolling for that loop.

- Phone: one column in three bands (result, money trail, four number boxes) and a tab bar. Tapping a box opens a keypad that covers only the lower half, so the total and its changes stay visible and update as you type.
- Desktop: three columns on one screen. Boxes on the left, result and trail in the middle, compare, what it would take and the ask on the right. At 1440 by 900 the right column scrolls inside itself. That is the open item for the next pass.
- Every secondary view (Compare, Target, Ask) is its own tab on a phone. They may scroll. The main loop never does.

## Tokens

All colours and both fonts are CSS variables in `src/app/globals.css`. Nothing in a component names a colour directly.

| Token | Dark | Light | Why |
|---|---|---|---|
| ground | #0E1A1F | #CBDAD5 | Green-tinted night glass. Never pure black, never flat grey. |
| panel | #15252B | #F3F8F6 | Boxes sit slightly above the ground. |
| panel-2 | #1C3038 | #F9FBFA | The one raised layer, the entry sheet. The only element with a real shadow. |
| line | #2E4650 | #9DB5AD | Dividers. Decorative only. |
| edge | #6A8B98 | #4B6A77 | Control borders. 3:1 or better against the ground. |
| text | #EAF2F0 | #12161C | Soft white, not pure white. |
| ink-2 | #B4C8CC | #2B3C50 | Secondary text, tinted, not flat grey. 10.18 on ground in dark. |
| up | #FF8A7A | #B42318 | You pay more. Always with a plus sign and an arrow. |
| down | #62D8A0 | #1A6B3A | You pay less. Always with a minus sign and an arrow. |
| total | #F5C400 text | ink on #F5C400 band | The one yellow, used only for the total. Ink on yellow measures 11.04. |

Measured contrast in dark (WCAG luminance): text 15.56, ink-2 10.18, up 7.73, down 9.99, total 10.77, all on the ground.

## Type

- Text: Atkinson Hyperlegible Next, 400, 600 and 700. Built for low-vision readers, which fits older buyers.
- Numerals: Sofia Sans Extra Condensed, 700 and 800, with tabular and lining figures. Both fonts are OFL-1.1 and self-hosted through @fontsource.
- Rule: every amount is set in the numeral face. Atkinson draws a slashed zero that cannot be switched off, so "$1,400" in Atkinson reads as a different character. Amounts inside written sentences (the trail banner, the compare headline, the lever cards, and every site page) go through the Nums component, which sets figures in the numeral face. The copy-to-clipboard ask text is plain text and is the one exception.
- Rule: arrows are drawn shapes. Neither font has arrow glyphs.
- Sentence case everywhere. No all-caps labels, no eyebrows, no italics.

## Motion

One moment: the money trail bars draw in when the page loads and again each time an entry is confirmed with Done. Reduced motion shows the final state. Nothing else moves on its own.

## Choices that go against the default

- Dark by default, light on a switch: glare in a showroom can wash out a dark phone, so the light screen is one tap away and is saved on the device. Large text is a second switch.
- A raised sheet is the only shadow in the product. Everything else is separated by lines and spacing.
- Four equal boxes for the four parts of a deal (price, fees and add-ons, trade-in and down, loan). Equal because the content is four parts of equal rank. Watch this for the template look.
- No icon library, no gradients, no glows, no emoji.

## Checked so far

- 375 by 667 and 320 by 568: no scroll on the main view. At 320 by 568 the banner uses a shorter sentence and the header drops to one line.
- 1440 by 900: three columns fill the width. The right column scrolls.
- Not yet run: 414, 768, 1024, 1920, 2560, 3840; keyboard-only pass; screen reader pass; axe; Lighthouse.

## Site pages (added 2026-11-09)

The calculator is now at `/deal`. The pages around it are `/` (landing), `/how-it-works`, `/about`, `/privacy`, `/terms` and `/accessibility`, with one shared header and footer. The one-screen rule belongs to the calculator only. Site pages scroll like any page.

- **Landing hero:** the headline states the trap in one sentence, and the right half is the real example, not a picture of one. Both offers, the payment and total, the changes, and the three biggest steps of the money trail are computed by the engine when the page is built (`src/lib/example.ts`). No figure on a site page is typed by hand.
- **Type:** headings use the condensed numeral face (Sofia Sans Extra Condensed 800) as a price-board voice, text stays Atkinson. Sentence case, no eyebrows, no italics, no emphasised single word in a headline.
- **Layout:** one shared left edge and padding. Section heads sit in the left five columns and content fills the right seven, so wide screens use their width. At 1920 pixels and above the root size scales with the viewport (`100vw / 120`), so 2560 and 3840 show the same layout larger, not empty sides.
- **Colour:** same tokens as the calculator. The primary button is ink on ground, not yellow. Yellow stays reserved for the total, and on the landing page appears once, on Offer 2's total.
- **Motion:** the trail bars draw once on load, and reduced motion shows the final state. Nothing else moves.
- **Table on a phone:** each row of the comparison table becomes a stacked block, with the Offer 1, Offer 2 and Change labels kept above each figure.
- **Numbered steps:** the "Four steps at the desk" list is a real sequence, so the numerals are earned.

Checked: no horizontal overflow on all six site pages at 320, 375, 414, 768, 1024, 1440, 1920, 2560 and 3840 pixels wide (measured in frames of each width). The calculator main view fits without scrolling at 320 by 568, 375 by 667, 414 by 896 and 768 by 1024. Not yet run: screen reader pass, keyboard-only pass, axe, Lighthouse.

Legal pages (privacy, terms, accessibility) are drafts written from PLAN.md section 5 and the current build. They need the owner's review, and a confirmed contact address, before launch.

## Phase 1 of the Walk (added 2026-11-09)

What changed, and why. The research behind it is in `UX_RESEARCH_AND_PLAN.md` and `LIVE_UI_RESEARCH_2026-11.md`.

- **Two views of one set of numbers.** `/deal` opens the Walk on a first visit. The Desk (the grid) is one tap away in the header, and the choice is kept on the device (`src/lib/mode.ts`). Both edit the same store, so switching loses nothing.
- **The Walk.** A front door with three entries (thinking about it, I have a quote, I am at the desk), then six steps with one question each, one picture and one number. A running summary bar stays at the bottom and shows the most complete number known so far: the out-the-door price first, the total once the loan is known. The "about to sign" door is left out until the contract checker exists.
- **Ten-second check.** Two numbers the dealer already said (payment and months) give one fact back: what the payments add up to. It is the landing page's main interaction and the Walk's first screen on the payment path.
- **Graphics, all informative.** Payment strip (one block per payment, a row per year, blocks in the interest colour show the share that is interest, with a written key). Money bar (car, tax and fees, extras, old loan added, interest, adding up to the total to the cent). Four-box worksheet. Every picture has a sentence and a key; none uses colour alone.
- **Terms on tap.** Twelve terms in `src/data/strings/terms.ts`, each with a plain heading, the paperwork word, two sentences and one thing to ask. They open as real popovers beside the word (anchor positioning where available, a bottom card on phones). The verdict lists the questions for the terms the buyer opened.
- **Engine additions** (`src/engine/breakdown.ts`, 14 tests): payments add up, cost breakdown, the real cost of extras, payment equivalents, amortisation schedule, price from payment. The breakdown is checked on 10,000 seeded deals and matches the golden example to the cent.
- **Tokens.** Colours are declared once with `light-dark()`. One type scale: nine named steps plus six fluid sizes for the site pages (45 distinct sizes before). The categorical colours for the bar and strip have measured contrast; the fees colour was changed after a failing measurement (2.34 on the light ground).
- **Yellow** stays reserved for the total. The Walk's Next button uses ink.
- **Motion from the platform.** View Transitions on step changes (with the running total named so it morphs), `@starting-style` on term cards, `sibling-index()` stagger on the strip. All switch off for reduced motion.
- **Not used, on purpose:** `contrast-color()` (the tinted ink on yellow is a chosen colour), interest invokers and `text-fit` (Chrome only), cross-document view transitions (no Firefox).

Known gaps after Phase 1: a step on a 375 by 667 phone can scroll inside its own area (loan step by about 120 pixels, price step by about 57); the Desk's right column still scrolls on desktop widths; the Desk scrolls on landscape phones; the reduced-motion rules are written but I could not switch the setting in the test browser to watch them; keyboard-only, screen reader and axe passes are not done; term cards have no pictures yet; the car illustration question is open.

## UI craft pass on the Walk (added 2026-11-09)

The owner's note after Phase 1: still text-only, not industry-standard components, too little visual animation or transition. Research was live: shadcn/ui's component list, Radix Primitives docs, Motion docs and a Wise converter screenshot (a raised card on a saturated field, big input, one accent).

- **Components are Radix primitives**, styled in `src/app/walk.css`, wrapped in `src/components/ui/`: `Segmented` (ToggleGroup: header switch, month chips, choice cards, guess), `Slider` (rate), `Term` (Popover, with arrow, collision handling, close button), `Sheet` (Dialog, a bottom sheet on phones and a card on desktop, for "See the parts"), `Disclosure` (Collapsible, height animated from Radix's measured variable), `Btn` (press feedback, arrow nudge). Focus trapping, Escape, roving focus and ARIA come from Radix, not from code here.
- **Motion library** (`motion`, the free one; `AnimateNumber` is paid, so `AnimatedNumber` is our own, about 50 lines): counting figures (the total, the out-the-door price, the loan, the ring), a sliding thumb on every choice (shared layout), the payment strip filling in over about 0.6 seconds whatever the month count, money-bar parts growing in turn and re-flowing on change, a ring that draws itself, a stepper whose line fills and whose finished steps draw a check, steps that slide in from the side you are heading toward. Enter only, no exit animation, so no step waits on one.
- **CSS motion** for what needs no script: rise-in of each step's parts (`sibling-index()`), open and close of cards and sheets keyed to Radix `data-state`, hover lift and wheel, tag and pen movement on the door illustrations, and scroll-driven reveals of landing sections (`animation-timeline: view()`, with `translate` so no containing block is left behind).
- **Drawn, not stock:** a car, a quote sheet with an extras tag, a clipboard with the four boxes (the three doors); an icon family on a 24 grid for price, payment, trade, down payment, extras, calendar, flag. Each step has a tinted badge in a chart colour. The landing steps use the same badges, so the page and the tool look like one thing.
- **Surfaces:** one raised readout card per step (concentric radii: 24 outside, 12 for the fields), one implied light from the top (`--lift`). Door cards are the only other raised things.
- **Reduced motion:** Motion through `MotionConfig reducedMotion="user"` (in `Providers`), the strip and ring through `useReducedMotion`, CSS through one media block. Not yet watched live: the test browser cannot switch the setting.
- **Bug found by looking:** the share ring first drew a white box. Tailwind v4 has a utility called `ring`, and our class collided with it. Renamed to `share`. Check class names against Tailwind's before reusing common words.
- **Not done:** step title and fields still scroll inside a 320 by 568 phone (loan step 336 px, verdict 248 px); 375 by 667 loan step scrolls 127 px; at 1280 by 720 the loan step scrolls 97 px. The Desk (grid) view was not redrawn. Keyboard-only, screen reader and axe passes still not run. The old `.seg` and `.btn` rules in globals.css are used by the Desk only.

## Landing page rebuilt as pictures first (added 2026-11-09)

Why: the owner read the first landing as tables and paragraphs. A new buyer gives a page about eight seconds and will not read a comparison table. The old page showed ten dollar figures and about 600 words above the footer; the new one has two figures (the hero) and about 150 words.

Research (live, 2026-11-09): motionsites.ai and 21st.dev. What carried over: one subject-specific object owns the hero, the headline is short and huge, there is almost no body copy, and the product is shown in a frame (a phone) instead of described. What did not: stock 3D, shader backgrounds and gradient washes that have nothing to do with the subject.

Structure (`src/app/page.tsx`, `src/app/landing.css`, `src/components/site/landing/`):
1. Hero. The loan drawn as a road: one tile per monthly payment, twelve to a row (each row a year), tilted with a leaning floor. A line-drawn car with a headlight beam sits at the end. One control (loan length) and the only two figures on the page: the payment falls, the total climbs. On first sight the loan stretches from 60 to 84 months by itself, once; any touch cancels it. Keyboard works (Radix Slider). Numbers come from the engine through `getExample()`.
2. The worksheet. The four boxes with a marker that hops between them. Two lines of text.
3. The tour. Six steps beside a sticky phone that shows what each step looks like, built from the Walk's own graphics (payment strip, money bar, share ring). On a phone the picture sits inside each step.
4. Trust row (no account, stays on device, plain words) and one link to About for what it does and leaves to you.
5. Closing line with the car driving away.

Removed from the landing: the comparison table, the example readout card, the "ask for one change" list, the does and leaves lists. `ExampleTable`, `ExampleReadout` and `HeroCheck` were deleted because nothing else used them. The ten-second check still lives in the Walk's front door.

Class-name collision caught: the landing's `.sheet` clashed with the Walk's Radix sheet; renamed `.wsheet`. Reduced motion: tile transitions, the wheel spin and the story bars stop, and the auto-stretch does not run.

Not done: the car and scenes are drawn, not photographs; no generated imagery was used. How it works and About are still text pages and have not been redesigned.
