# Marketing pages: audit and plan (2026-11-09)

Judged as a new buyer with about eight seconds.

## Audit of the first picture-first landing

| Finding | Severity | State |
| --- | --- | --- |
| How it works: 684 words, a table, no pictures | High | Rebuilt: six chapters, each one picture and a line or two (about 250 words) |
| About: 397 words, no pictures | High | Rebuilt: hop worksheet, icon list, calculator versus AI lanes, built versus planned |
| Inactive tour steps dimmed to 0.32 opacity, under 4.5:1 | Medium | Fixed: 0.62 and above 4.5:1; no dimming on phones |
| Header text-size and screen buttons 36 px tall on site pages (the accessibility page promises 44) | Medium | Fixed on site pages; the tool header keeps 36 |
| No share image, default favicon, no robots or sitemap, Next boilerplate SVGs in public | Medium | Added share image (road in miniature), SVG icon, robots, sitemap; boilerplate removed |
| Chapter titles left a half-empty column | Medium | Titles are sticky beside their chapter |
| Hero car is a flat drawing | Design | Plan below |
| Landing still about 270 words | Low | Cut further after the 3D decision |
| Reduced motion, screen reader and axe not run | Open | axe could not be injected from a CDN in this session; run it locally (axe-core is already in node_modules) |
| Old landing rules left in site.css (`.s-hero`, `.s-readout`, `.s-table` and friends) | Low | Dead code, prune in a later pass |

## 3D car: options and recommendation

Sources checked on 2026-11-09. Nothing has been downloaded.

1. Kenney Car Kit (kenney.nl/assets/car-kit). CC0, no attribution needed, 45 models including a sedan, glTF included, zip about 3.4 MB. Low-poly and stylised, which matches the drawn art on the site. Recommended.
2. Kay Tomasu "Low Poly Car - Randomness A02 City" (itch.io). Listed CC0 with GLB. Check the license and file on the download page first.
3. The three.js example Ferrari. Not usable until its license is verified (believed CC-BY, unconfirmed).

Plan: take one sedan from Kenney, compress it (meshopt) to a small GLB, render it with `three` loaded lazily after first paint, on desktop only, with WebGL and reduced-motion checks. The line-art SVG car stays as the poster and fallback. Look: dark matte body, lit edge lines in the chart blue, a warm headlight spot, turning wheels. The slider moves the car along the road (more months, further away). Budget: about 180 KB of JavaScript, lazy, none of it on the first paint.

Decision for the owner: yes or no on the download and on adding `three`. If the car looks flat in context, the SVG car is the answer and costs nothing.

## Next
- Axe, keyboard and screen reader passes on the three pages.
- Prune dead landing CSS.
- Reduced motion watched live.

## Round 2 audit: header, footer, dead space (2026-11-09)

Seen as a first-time visitor at 1440x900 and 390x844.

| Finding | Fix |
| --- | --- |
| The calculator had its own small header with no links to the site, and no footer at all. Legal pages were unreachable from it. | One `AppHeader` (same mark, name and two links as the site header) and a slim `AppFooter` on the door, ten-second check and Desk. Steps keep their bottom bar; the menu carries the legal links. |
| Phones had no way to reach How it works, About or the legal pages from the header. | `SiteMenu` (Radix Popover) in both headers: links, legal pages, text size and screen switch. |
| Hero car floated far above the road and "Paid off" hung in empty space. | Car sits at the end of the road; the tag rides under it. Full width stacked buttons on phones. |
| Worksheet section was four empty dashed boxes, and sat in half its column. | Boxes carry the example's figures from the engine and fill the column. |
| Tour: text far left, phone far right, empty middle; phone had a big blank area. | Text and phone meet on the centre line; the phone now has the Walk's progress dots and Next button. |
| Closing section repeated the hero car. | A row of payment tiles that fills to a flag, full width. |
| Door and steps floated mid-screen with empty bands above and below at 1440x900. | Door cards grow with window height; the step's two columns stretch to one height and the worksheet fills its panel. |

Checked: no sideways scroll on 6 pages at 12 widths (320 to 2560), tsc, eslint, 64 tests, production build.
Still open: Desk middle column ends with blank space on tall windows; phone door leaves blank space above the footer; axe, keyboard-only and screen reader passes.

## Round 3 audit: accessibility, every Walk step, error pages (2026-11-09)

axe-core 4 (from node_modules, served temporarily from `public/`, then removed) run on 7 pages x dark and light x phone and desktop, then on every Walk step.

| Finding | Fix |
| --- | --- |
| "A+" button: visible text not in its accessible name (WCAG 2.5.3). On every page. | Name is now "A+ larger text". |
| Link in the landing trust note told apart by colour only. | Underlined. |
| Desk total used `aria-label` on a bare `div`; Desk had no level-one heading; a screen-reader note sat outside any landmark. | `role="img"` on the total, a hidden h1 for the Desk, note moved into `main`. |
| Default Next 404: black, unbranded, no header or way home. No error page. | `not-found.tsx` and `error.tsx` in the site frame, with a row of tiles with one missing. |
| Number boxes shrank to their digits (about 64 px) and sat in a stack of tiny boxes. | One comfortable width (22rem, full width on phones). |
| Step 4 before a rate: a big empty panel with a yellow "$0". Step 5: a panel holding one number. | Step 4 shows the payment blocks and "$—" until a rate is entered; step 5 shows a bar of loan, down payment and trade-in credit. |
| Last step showed the total but not the monthly payment, months or rate. | Three facts under the total. |
| Heading broke at "trade-" / "in". | Hyphenated words never break at the hyphen. |
| Tablet (820 x 1100): a step sat at the top of a tall empty screen. | Centred and roomier in that band. |
| Hero did not say what the product is. | "A car-deal calculator." added to the line under the buttons. |
| Hard edge where the hero's blue wash began on tablet and phone. | Faded with a mask. |
| Menu popover ignored reduced motion. | Covered. |

Result: axe reports no violations on the pages and steps above. Keyboard: tab order on the landing page is skip link, brand, links, switches, calculator, hero buttons, with a 3 px focus ring on each. No sideways scroll with large text and light screen on 6 pages at 4 widths.
Not covered: a real screen reader, real reduced-motion setting, Safari and Firefox, a physical phone.
