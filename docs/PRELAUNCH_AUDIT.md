# Deal Desk: pre-launch audit (2026-11-09)

Everything here was measured on the running production build (`next build`, `next start`, http://localhost:3100), in a real browser, not read from the code. Screenshots are in `docs/audit/`. Where a claim could not be tested it says so.

**Not a live site yet.** The product has no public domain, so "live" means the production build on localhost. Three things can only be checked once it is hosted: the real domain in the share image and sitemap, HTTPS and HSTS, and compression.

## How it was checked

| Method | What it covered |
| --- | --- |
| 61 screenshots in `docs/audit/` | every page and every Walk step at 1440x900, 820x1100 and 390x844; the Desk; the menu; the 404; light and dark where noted |
| axe-core 4 (from `node_modules`, served temporarily, then removed) | 8 pages, dark and light, phone and desktop; every Walk step at 390 and 1280; the Desk and its entry sheet |
| Overflow test | 8 pages x 12 widths (320 to 2560) = 96 combinations, and again with large text and the light screen |
| Link and structure crawl | every link on 8 pages fetched; anchors, duplicate ids, headings, titles, descriptions, `lang`, images, button names |
| Network log | every request on a landing load: same-origin only, no third party |
| Size and font measurement | computed font size and target size of every text node and control on 4 pages at 2 widths |
| Maths check | 6 loans entered through the live Walk, compared with an independent calculation (Python Decimal) |
| Data routes | all 6 routes called with good, bad and hostile input; the MPG route run against its live source |
| Contrast | every colour pair computed in both themes and compared with the numbers the Accessibility page publishes |
| Keyboard | tab order and focus ring on the landing page; the Desk's number sheet driven by physical key presses |

## Result in one paragraph

The numbers are right, the pages are sound, nothing leaves the device, and axe finds no violations. Ten defects were found and fixed. Three more are open because they need you: the domain, a review of the legal text, and tests this setup cannot run (screen reader, Safari, Firefox, a real phone).

## What is correct (verified, not assumed)

- **Maths.** Six loans (0% rate, negative equity, large extras, 84 months, trade-in with a payoff) entered through the Walk match an independent calculation to the cent on the payment and to the dollar on the total. The Desk's $46,898.24 for the example matches too. Extreme input (price $99,999,999, rate 99%) is capped, never NaN or Infinity.
- **Privacy.** A full landing load makes 100% same-origin requests. No cookies, no third-party scripts, no IndexedDB. The numbers a buyer types are not stored: a reload starts clean.
- **Links and structure.** No broken link, no missing anchor, no duplicate id, one h1 per page, a title and description on every page, `lang="en"`, no image without alt, no unnamed button (after fix 5 below).
- **No sideways scroll** in 96 width and page combinations, nor with large text and the light screen.
- **Contrast.** The five dark-screen figures on the Accessibility page (15.56, 10.18, 7.73, 9.99, 10.77) are exactly what the tokens measure. The light screen also passes 4.5:1 for text.
- **Dependencies.** `npm audit --omit=dev`: 0 vulnerabilities in what ships.
- **Share image.** 1200x630 PNG, served with the right type.

## Defects found, and what was done

Severity: **P0** must fix before launch, **P1** a first-time user would hit it, **P2** polish. "Fixed" items were re-measured afterwards.

| # | Sev | Finding (evidence) | Status |
| --- | --- | --- | --- |
| 1 | P0 | `/api/mpg` answered **500** for a valid car (2020 Honda Civic). The fuel-economy service returns a bare `null` for a name it does not know, and the code read a field of it. The two agencies also name models differently (NHTSA "Civic", EPA "Civic 4Dr"). | **Fixed.** Null handled; EPA models that start with the name are tried. Live contract tests added for the Civic and for an unknown model. |
| 2 | P0 | No security headers at all, and `X-Powered-By: Next.js` sent. | **Fixed.** `nosniff`, `SAMEORIGIN`, referrer and permissions policies, and a strict Content-Security-Policy in production (same-origin only). Verified: no CSP violation, the 3D car still loads. |
| 3 | P0 | **Privacy page was wrong.** It said two settings are stored; there are three (`dd-theme`, `dd-text`, `dd-mode`). **Accessibility page was stale:** "one animation" (there are many), "no automated audit" (one was run), and "controls at least 44 px" (measured: 36 px on the header switches, the Desk's Offer buttons and chips). | **Fixed.** Text corrected. Controls raised to 44 px (header switches, Walk/Desk, Offer, chips, slider hit area). Links in text and footer are 24 px or more, and the page now says so. |
| 4 | P0 | Sitemap, share image and canonical all say `localhost:3000`; there was no canonical tag. | **Canonical added. Domain is yours to set** (see "Needs you"). |
| 5 | P1 | **Phone Walk: the "See the parts" button had no accessible name** (icon only). Found by axe at 390 px only; the desktop run passed. | **Fixed.** |
| 6 | P1 | **Tablet landing tour was pushed right**, leaving 40% of the width empty (a regression from the previous round; `tablet/02`). | **Fixed** (`after/02`). |
| 7 | P1 | **Landing phone, step 3:** the strip showed the cost of the extras but its legend said "Paid toward the loan / Interest", with a stray "Monthly payments" caption (`phone/03`). | **Fixed** (`after/03`). |
| 8 | P1 | **Walk step 1 (payment path) did not fit on a laptop.** Content ran 97 px past the window at 1366x768, 141 px at 1280x720, so the result sat below the fold (`desktop/24`). | **Fixed** at 1366x768 and above (0 px). At 1280x720 it is 26 px over; the step title's sub-line gives way there (`after/04`). |
| 9 | P1 | **Sales tax starts at 0 with no word about it.** A first-time buyer who skips it gets an out-the-door price without tax and no warning (`desktop/25`). | **Fixed.** Hint under the field: "From the worksheet. At zero, no tax is counted yet." |
| 10 | P1 | **The Desk said "Your deal" after one edit** while every other number was still the example's. The link then read "See the example", which replaces the buyer's numbers. | **Fixed.** The tag says "Example deal, changed" and the link stays "Use my numbers". |
| 11 | P1 | Walk gave a screen-reader user no sign that the step changed (focus stays on Next). | **Fixed.** A polite status line announces "Step 2 of 6: Price". |
| 12 | P2 | Links in the legal text and one in the landing note were told apart by colour only (axe `link-in-text-block`). A stray list icon beside the About sources paragraph. A hard edge on the hero headlight. | **Fixed.** |
| 13 | P2 | Tablet (820x1100): the Desk filled the top half only; the Walk step sat at the top. | **Improved**, not finished (see open). |
| 14 | P2 | Text under 14 px: tags and legends were 12.2 px. | **Raised** to 13.1 px. Footer and tag text is still under 14 px. |

New this round, from your go-ahead: **the 3D hero car** (Kenney Car Kit, CC0, one sedan, 172 KB model that transfers as 31 KB, `three` loaded only after the page is idle, desktop and tablet only, the line drawing stays on phones, with data saver, without WebGL, or on any error). It follows the light and dark screen, and the slider makes its wheels surge. Credit is in the footer; the licence file is in `public/models/`.

## Needs you (cannot be done from here)

1. **Set `NEXT_PUBLIC_SITE_URL`** to the real address before the production build. Until then the share image, sitemap and canonical point at `localhost:3000`.
2. **Review the legal pages.** They are drafts. The contact route (`https://v2stack.com/contact`) answers 200 and is now a link; confirm it is the right one.
3. **Host-level:** HTTPS with HSTS, and Brotli or gzip. Cannot be checked on localhost.
4. **Tests this setup cannot run:** a screen reader, a real reduced-motion setting (the code honours it: `MotionConfig`, CSS, and the 3D car draws one still frame; not toggled live), Safari, Firefox, a physical phone, and real frame rate of the 3D car (this browser pane throttles animation, so FPS could not be measured).

## Open, lower priority

- **JavaScript weight.** gzipped: landing 314 KB, calculator 326 KB, even `/privacy` (text only) 211 KB. The 3D car adds 193 KB, loaded late. A text page should be under about 150 KB; the animation and dialog libraries are the likely cost. Worth a bundle review.
- **Tablet portrait** still has empty bands on the Desk and the door. The Walk is centred and the Desk now sits side by side, but the screen is tall.
- **The NHTSA model list includes motorcycles** ("Africa Twin", "CB1000R") for a car product. Not used in the interface yet.
- **The data routes have no rate limit.** They are public proxies to two government services. Not used by the interface yet.
- **"See the example" replaces the buyer's own numbers without asking.**
- **No apple-touch-icon, manifest or offline use.**
- The slashed zero in running text is the typeface's design (Atkinson); money figures use a plain zero. The Accessibility page now says so.
- `vitest` pulls in `tinypool` with two critical advisories. Dev only, not shipped.
- A console warning about CSS preloads that are not used within a few seconds (Next's behaviour); harmless.
- The hop marker on the four-box worksheet stretches for a moment as it moves between boxes.

## Evidence index

`docs/audit/desktop/` 01 to 33 (landing 01 to 07, How it works 08 to 12, About 13 to 16, legal 17 to 20, calculator 21 to 33). `docs/audit/tablet/` 01 to 08. `docs/audit/phone/` 01 to 16. `docs/audit/after/` 01 to 04 are the fixed versions of findings 6, 7 and 8 and the tablet hero.
