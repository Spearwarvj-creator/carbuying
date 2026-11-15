# Component research log

Started 15 November 2026. For each kind of component in Deal Desk, at least ten real examples were opened one by one on 21st.dev (and, for pages and dashboards, motionsites.ai) in the user's own Chrome through Claude in Chrome, before any redesign of that kind was decided. Every example below was opened at its own page; the address is given so it can be opened again. Screenshots taken at the time are kept in `docs/research/shots/` in the order of the lists (file names are the type, then the number).

Method: the category listing was loaded, the component addresses were read from the page, and each address was visited and photographed. Nothing was copied: only the idea is noted, and the decision for our own product is written under each type.


## Summary: what was opened, and what was decided

Every kind of component in the product was checked against at least ten real examples before it was redesigned. 21st.dev examples were opened at their own component pages; motionsites.ai examples at their own prompt pages. Where an address returned "Nothing lives at this address" or showed the library's front page instead of the component, it is noted and not counted. The page address of every example is in this file; the 237 screenshots taken are in `shots/` with `shots/INDEX.md` pairing each file to its page.

| # | Component kind | Examples opened | Decision in one line |
| --- | --- | --- | --- |
| 1 | Cards | 12 | A box only for the one object that matters; open rows and hairlines for everything else |
| 2 | Statistic tiles | 14 | Label on top, figure largest with its unit small, change under a hairline with the comparison named |
| 3 | Text and number inputs | 10 | One-pixel border, label above, units inside the border, one two-pixel focus ring |
| 4 | Sliders | 10 | Name left and value right above a thin track, tick labels at real steps |
| 5 | Tabs and segmented controls | 11 | Segmented for the same thing in few states; underline tabs for parts of a page |
| 6 | Switches and toggles | 11 | Header utilities as one quiet capsule; settings with a title and a line of description |
| 7 | Navigation | 10 | Soft pill on the current page; one solid action; utilities as icons |
| 8 | Footers | 10 | Left-aligned brand and sentence, quiet columns, no centred stacks |
| 9 | Heroes | 11 + 11 | Keep the object-led left-aligned hero; refuse the centred template, invented proof and glow gradients |
| 10 | Charts and bars | 12 | Thin bars, names left and figures right, plain legend, a table alternative |
| 11 | Accordions | 10 | Hairline rows, plus or chevron at the right, no boxes |
| 12 | Dialogs and popovers | 10 | Fixed header and footer, scrolling body, small popovers, one set of radii |
| 13 | Buttons | 10 | Three tiers, 48px tall, states designed, no texture or glow |
| 14 | Alerts and callouts | 10 | Icon, short title, specific sentence, soft tint, action beside it |
| 15 | Search, empty and not-found | 10 | Magnifier, clear, count inside the field; empty state with one way out |
| 16 | Tables and comparisons | 10 | Quiet header, hairline rows, right-aligned tabular figures |
| 17 | Tooltips | 10 | One line on hover and focus for every icon-only control |
| 18 | Badges and chips | 10 | Icon and word on a soft tint; change as arrow and figure; no award marks |
| 19 | Steppers and timelines | 12 | Plain three states, "Step n of m", titled bars on narrow screens |
| 20 | Progress bars and rings | 10 | Thin bar, words left and figure right |
| 9b, 9c | motionsites.ai heroes and dashboards | 11 and 10 | One module language per screen; modules differ in size, not style |

Things rejected on purpose, with the examples that showed the risk: centred headline plus two buttons plus avatars and stars (heroes 2, 4, 5, 7, 9, 11); invented trust (stamp, achievement, testimonials); texture, glow, glass and neumorphic buttons; saturated alert bars; tinted icon tiles in a grid; game-like leaderboards; pixel-art styles.

---

## 1. Cards (groups of content in a box)

Opened (12):
1. kristen17 / Course Design Cards, https://21st.dev/@kristen17/components/course-design-cards. One raised card with a soft corner glow, a labelled progress bar with a percent, a hairline above the footer. One object lifted, the inside separated by hairlines, not more boxes.
2. themeocean / Interactive Tech Stack Bento Grid, https://21st.dev/@themeocean/components/interactive-tech-stack-bento-grid-with-hover-effects. Mixed-size tiles; one tile carries a live figure (server latency 58 ms, with average and peak beside it).
3. clevision / Card Studio, https://21st.dev/@clevision/components/card-studio. A plain card, thin border, a title and one paragraph. Nothing else.
4. felipemenezes098 / The Item one, https://21st.dev/@felipemenezes098/components/the-item-one. No card at all: a title and one line of description on the page. An open row.
5. user_xn1cklas / Weather Card, https://21st.dev/@user_xn1cklas/components/weather-card. One outer card; inside, three small tinted cells (high, low, humidity) with no borders of their own.
6. ravikatiyar162 / Card (stat card), https://21st.dev/@ravikatiyar162/components/card-10. The figure large with its unit small beside it, the label under it, a change chip with a small arrow.
7. kinfe123 / Bento, https://21st.dev/@kinfe123/components/bento. A headline over one very large dark tile.
8. meschacirung / Integrations Card Grid, https://21st.dev/@meschacirung/components/integrations-three. Icon, name and one line in soft tiles with no outline.
9. prebuiltui / Testimonial, https://21st.dev/@prebuiltui/components/testimonial. Picture-led cards. Not usable here: it needs real people, and the product has no testimonials and will not invent any.
10. ephraimduncan / Stats cards with links, https://21st.dev/@ephraimduncan/components/stats-cards-with-links. Label and change on one line, the figure, a "View more" link at the bottom right.
11. sean0205 / Statistics Card 7, https://21st.dev/@sean0205/components/statistics-card-7. One card holding several measures as rows divided by hairlines.
12. sean0205 / Statistics Card 10, https://21st.dev/@sean0205/components/statistics-card-10. Header with a small icon, the figure with its currency, a change chip, then two key and value rows on a tinted band.

Decision for cards: a box is kept for the one object that matters on a screen (the number entry panel, the open word, the chart). Groups of equal items become open rows with a hairline above each (examples 4, 8, 11). Inside a raised card, parts are divided by hairlines, not by more borders (1, 11, 12). No coloured outlines. Done already: How it works, the Learn lists, the check list and the door.

---

## 2. Statistic tiles (a figure with its label and change)

Our uses: the Desk's "Monthly payment" and "Change in total", the landing's loan dock, the result figures in the Walk, the facts under the total.

Opened (14, the first ten new and four also seen under cards):
1. designali-in / Stats 2, https://21st.dev/@designali-in/components/stats-2. A tinted block, a small label top left, a very large figure (82%), a one-line meaning under it. No outline.
2. uilayout.contact / Bold Stats, https://21st.dev/@uilayout.contact/components/stats-bold. One huge headline figure (10B+) with its label beside it, a picture, then a row of three smaller figures over a hairline.
3. meschacirung / Stats, https://21st.dev/@meschacirung/components/stats. The figures sit inside a sentence-sized list: bold figure then a quiet word (90+ Integrations). No tiles.
4. tommyjepsen / Stats Section with Text, https://21st.dev/@tommyjepsen/components/stats-section-with-text. Four tiles with a tiny arrow top left, the figure, then the label, and the change as small grey text beside the figure.
5. 8starlabs / Partition Bar, https://21st.dev/@8starlabs/components/partition-bar. A single horizontal bar split into proportional segments, each labelled below with its name and percent. The same idea as our "where the money went" bar.
6. uilayout.contact / Stats Bento, https://21st.dev/@uilayout.contact/components/stats-bento. Mixed tile sizes: one large tile for the main figure (64%), small ones for the rest; the bars of a tiny sparkline sit beside the figure.
7. shadcnspace / Weekly Fitness Card, https://21st.dev/@shadcnspace/components/card-12. A card with a row of seven vertical bars, one per day, labelled with its letter underneath.
8. shadcnui-blocks / Numbers Stats Grid, https://21st.dev/@shadcnui-blocks/components/stats-06. Tinted tiles with a line icon, the figure and the label. The uniform tinted icon tile is the pattern to avoid.
9. sean0205 / Statistics Card 2, https://21st.dev/@sean0205/components/statistics-card-2. Label, figure, change chip, a hairline, then "vs last month: figure". The reference used for the Desk.
10. trophyso / Streak Badge, https://21st.dev/@trophyso/components/streak-badge. One figure ("7 days") set big with the unit smaller and a single icon above.
11. ravikatiyar162 / Card, https://21st.dev/@ravikatiyar162/components/card-10. Figure large, unit small, label, change chip.
12. ephraimduncan / Stats cards with links, https://21st.dev/@ephraimduncan/components/stats-cards-with-links. Label and change on one line, figure, a link.
13. sean0205 / Statistics Card 7, https://21st.dev/@sean0205/components/statistics-card-7. Rows divided by hairlines inside one card.
14. sean0205 / Statistics Card 10, https://21st.dev/@sean0205/components/statistics-card-10. Currency prefix and unit suffix set smaller than the figure; a change chip with words after it.

Decision for statistic tiles: the label sits above, the figure is the largest thing, its unit is set smaller beside it (1, 10, 11, 14), the change reads as a short chip or line below a hairline with "against what" spelled out (9, 13). Tiles are open on the page, not boxed, except the one main figure, which owns its space (2, 6). Uniform tinted icon tiles are not used (8). Where parts of a whole are shown, a single split bar with labels under each segment (5) is used, which the Desk and the landing already do. Done already for the Desk; the Walk's result figures and the landing dock are the remaining place for the unit-smaller treatment (see "What was applied").

---

## 3. Text and number inputs

Our uses: the money and percent boxes in the Walk and the Desk, the ZIP code, the search, the paste box in the decoder, the question box.

Opened (10 live; one address, serafimcloud / input, returned "Nothing lives at this address" and is not counted):
1. shugar / Input, https://21st.dev/@shugar/components/input. Three sizes side by side (small, default, large); a thin light border, a small radius, the placeholder as the only label.
2. anubra266 / Field Components, https://21st.dev/@anubra266/components/field-components. A bold label above the field, the field one line tall, a thin border.
3. shadcn / Input Group, https://21st.dev/@shadcn/components/input-group. Prefix and suffix live inside the one border: a search icon with "12 results" at the end, "https://" at the start, a counter ("52% used") with a round send button.
4. sean0205 / Base Input, https://21st.dev/@sean0205/components/base-input. A single quiet field; its description says it covers input groups and number spinners.
5. MUI / Input, https://21st.dev/@olivier_1b6cd5bc/components/input-1. A lightly outlined field with the label as placeholder.
6. ruixen.ui / Action Hub Input, https://21st.dev/@ruixen.ui/components/action-hub-input. A label above, a full-width field, inline status feedback described as part of the component.
7. ruixen.ui / Input With Select, https://21st.dev/@ruixen.ui/components/input-with-select. An "Amount" label above a number field with small up and down steppers, and the currency (USD) chosen from a select that shares the same border. The closest match to our money box.
8. clevision / Input OTPs, https://21st.dev/@clevision/components/input-otps. A row of separate boxes, one per character.
9. preetsuthar17 / Message Input block, https://21st.dev/@preetsuthar17/components/message-input-block. A wide field with a row of small icon actions inside, bottom right, and a round send button.
10. shadcn / Textarea, https://21st.dev/@shadcn/components/textarea. A multi-line field with a thin border and a resize handle.

What the ten agree on: a hairline border (one pixel), a label above the field in a smaller bold weight, units and actions inside the same border, hints below the field in quiet text, and a modest height. Our boxes were 1.5px outlines with a heavy three-pixel focus ring and an offset.

Decision for inputs: the figure stays large because the product is about numbers, but the box gets a one-pixel border at rest, a label above in the body size, the dollar sign and percent sign inside the same border in the secondary colour (examples 3 and 7), the hint under it at the readable size, and one two-pixel focus ring in the accent colour without the offset gap. Applied (see "What was applied" at the end).

---

## 4. Sliders and number pickers

Our uses: the loan length slider on the landing road, the term and down payment sliders in the Walk, the "what if" months control.

Opened (10):
1. coss.com / Slider, https://21st.dev/@coss.com/components/slider. A hairline track, a filled part in white, one small round thumb. Nothing else.
2. sean0205 / Slider, https://21st.dev/@sean0205/components/slider. A thin dark filled track, an outlined round thumb.
3. shadcnspace / Price Range Slider, https://21st.dev/@shadcnspace/components/slider-06. Two thumbs; the chosen values ("$150 - $650") shown large above; tick values ($0, $250, $500, $750, $1000) under the track; a small "Clear" control.
4. Hero UI / Slider, https://21st.dev/@hero_ui/components/heroui-slider. The label on the left and the current value on the right, above a thick rounded track.
5. ibrandify / Before After Comparison, https://21st.dev/@ibrandify/components/before-after-comparison. A drag handle that splits two pictures, with quick toggle tabs and keyboard control. Not our use; noted for its large round handle with an icon, which is easy to grab.
6. ham7a311 / Ruler Picker, https://21st.dev/@ham7a311/components/ruler-picker. A tape-measure scale: a very large figure (72.4 kg), tick marks under it, a coloured healthy range, a unit switch. Ticks make a continuous value feel measurable.
7. Origin UI / Slider, https://21st.dev/@originui/components/slider. A label above, a thin track, a 16px thumb.
8. diarmuradi / Volume Pricing Card, https://21st.dev/@diarmuradi/components/pricing-10. The closest to our loan-length control: a slider whose label ("Monthly API requests") sits left and value ("50K") right, tick labels (1K to 1M) under the track, the chosen amount repeated in the middle, and the price below it recalculated as you drag.
9. Hero UI / Color Slider, https://21st.dev/@hero_ui/components/heroui-color-slider. A label left and its value right over a track painted with what it controls.
10. cinquinandy / Lightning Split, https://21st.dev/@cinquinandy/components/lightning-split. A shader effect that divides the screen along a line. Not usable (it is decoration, not a control); noted only to confirm that the movable dividing line is a familiar idea.

What the ten agree on: label left and value right above the track (4, 8, 9), tick labels under it (3, 8), a thin track at rest, and the result recalculated next to it (8).

Decision for sliders: the loan length control shows its name left and the months right above a thin track, with tick labels at the real step marks (36, 48, 60, 72, 84), a thumb that is large enough to hold, and the payment and total next to it updating as it moves, which the road already does. Applied (see "What was applied" at the end).

---

## 5. Tabs and segmented controls

Our uses: Walk and Desk, Offer 1 and Offer 2, the Learn category chips, the Desk's bottom tabs on a phone (Deal, Compare, Target, Ask, Checks), the language and detail switches.

Opened (11):
1. kemendev / Tabs like bookmark, https://21st.dev/@k3menn/components/tabs-like-bookmark. Tabs that join the panel below them, like a folder.
2. kemendev / Simple Tabs with underline and bold font, https://21st.dev/@k3menn/components/simple-tabs-with-underline-and-bold-font. Plain words, the chosen one bold with a line under it.
3. uiable / Card Tabs, https://21st.dev/@uiable/components/card-tabs. A small segmented switch (Overview, Analytics, Settings) at the top of one card that changes the card's content.
4. yadwinder / Vercel Tabs, https://21st.dev/@yadwinder/components/vercel-tabs. Six words in a row; the chosen one is darker with a thin line under it that slides.
5. minhxthanh / Slide Tabs, https://21st.dev/@minhxthanh/components/slide-tabs. A capsule outline; a dark pill slides behind the chosen word.
6. Origin UI / Tabs, https://21st.dev/@originui/components/tabs. A soft grey container; the chosen tab is a white raised pill inside it.
7. starc007 / BeUI Tabs, https://21st.dev/@starc007/components/beui-tabs. Three variants on one page: filled pill, segmented, and underline. The page itself says which is for what.
8. shugar / Tabs, https://21st.dev/@shugar/components/tabs. Underline tabs: Apple, Orange, Mango.
9. reshaped / Reshaped Tabs, https://21st.dev/@reshaped/components/reshaped-tabs. A line icon before each word, a coloured line under the chosen one.
10. felipemenezes098 / Flexnative Tabs, https://21st.dev/@felipemenezes098/components/flexnative-tabs-more. A two-way segmented switch above an account form in one card.
11. sean0205 / Tabs, https://21st.dev/@sean0205/components/tabs. A two-way segmented switch across the full width.

What the eleven agree on: two kinds exist and are used for different jobs. A segmented control (a soft container with one raised chosen part, 3, 5, 6, 10, 11) switches the same thing between a few states. Underline tabs (2, 4, 8, 9) move between parts of one page. Neither uses a heavy outline around every option.

Decision for tabs: Walk and Desk, Offer 1 and 2, the language and the simple view stay segmented controls, in a soft container with one raised chosen part and the thumb sliding between them (they already slide). The Learn category chips and the Desk's phone tabs become underline tabs: plain words, the chosen one bold with a two-pixel line, scrolling sideways when they do not fit. No outlined pill around each option. Applied (see "What was applied" at the end).

---

## 6. Switches and toggles (the screen, text size, language and view buttons)

Our uses: the four small buttons in every header (language, simple or full view, larger text, light or dark screen), the same four inside the phone menu.

Opened (11):
1. ncdai / Theme Switcher, https://21st.dev/@ncdai/components/theme-switcher-1. Three tiny icon buttons (system, light, dark) in one capsule; the chosen one is raised.
2. clevision / Switch, https://21st.dev/@clevision/components/switch-1. A pill switch with its label beside it.
3. intentui / Toggle, https://21st.dev/@intentui/components/toggle. A small labelled button that stays pressed ("Pin").
4. sean0205 / Toggle, https://21st.dev/@sean0205/components/toggle-1. A single-letter pressed button.
5. dhxwhy / Sun Moon Theme Toggle, https://21st.dev/@dhxwhy/components/sun-moon-theme-toggle. One round icon that turns from sun to moon.
6. shugar / Toggle, https://21st.dev/@shugar/components/toggle. A plain switch, off and on.
7. Hero UI / Switch, https://21st.dev/@hero_ui/components/heroui-switch. A switch with a label ("Enable notifications").
8. sean0205 / Toggle Group, https://21st.dev/@sean0205/components/toggle-group-1. A row of short labels (1D, 1W, 1M, 6M, 1Y) with the chosen one on a soft chip.
9. ravikatiyar162 / Sky Toggle, https://21st.dev/@ravikatiyar162/components/sky-toggle. An illustrated sun and cloud switch. Playful, and not in keeping with a product about money.
10. shadcnspace / With Description, https://21st.dev/@shadcnspace/components/with-description. A title and one line of explanation on the left, the switch on the right.
11. arunachalam / Animated Theme Toggler, https://21st.dev/@arunachalam/components/animated-theme-toggler. One bare icon button, no outline.

What the eleven agree on: a theme or view choice is an icon, or a capsule of icons, not four outlined text squares; a setting that needs explaining is a switch with a title and a line of description (10); the small choices are grouped in one capsule (1, 8).

Decision for these controls: in the header, the four become one soft capsule of quiet buttons with no outline around each (language, view, text size, screen), the chosen state shown as a raised part, with an accessible name on each. Inside the phone menu they are switches with a title and a line of description ("Simple view: fewer numbers"). The playful illustrated switch (9) is rejected as out of character. Applied (see "What was applied" at the end).

---

## 7. Navigation (site header, menus, sidebars, paging)

Our uses: the site header on every page, the phone menu, the calculator header, the step rail.

Opened (10; two of them, 9 and 10, are Navigation-category items first opened under tabs):
1. f0rextasy / Navbar, https://21st.dev/@f0rextasy/components/navbar. A monogram and name at the left, links in the middle with the current page on a filled pill, one action at the right.
2. shadcnui-blocks / Navbar with Theme Toggle, https://21st.dev/@shadcnui-blocks/components/navbar-02. Logo, a quiet "Sign In", a solid "Sign Up", then two icon-only buttons (theme, menu).
3. wensity / Sidebar, https://21st.dev/@wensity/components/sidebar. Grouped sections with small headings, a soft filled current row, count badges, a user footer.
4. shadcn / Sidebar, https://21st.dev/@shadcn/components/sidebar. A toggle button in the corner that shows or hides the rail.
5. clevision / Breadcrumb, https://21st.dev/@clevision/components/breadrcrumb. A home icon, then the path with small chevrons, the last part darker.
6. bundui / Pagination, https://21st.dev/@bundui/components/pagination6. Previous, numbers with an ellipsis, next; the current number in a soft box.
7. preetsuthar17 / Pagination, https://21st.dev/@preetsuthar17/components/pagination. The same with the current number filled solid.
8. uniquesonu / Dashboard with Collapsible Sidebar, https://21st.dev/@uniquesonu/components/dashboard-with-collapsible-sidebar. A rail with icons and count badges beside a header that holds a bell, a theme switch and a profile icon.
9. minhxthanh / Slide Tabs, https://21st.dev/@minhxthanh/components/slide-tabs (as above): a capsule nav with a sliding dark pill behind the current link.
10. yadwinder / Vercel Tabs, https://21st.dev/@yadwinder/components/vercel-tabs (as above): plain links, the current one darker with a sliding line.

What the ten agree on: the current place is shown by one quiet device (a soft pill or a sliding line), not by a heavy outline; one solid button for the main action and ghost buttons for the rest (2); utility controls are icon-only (2, 8); the number of items is small.

Decision for navigation: the header keeps brand left, three links, the main action solid on the right, and utilities as icons grouped together (matches the switches decision above). The current page shows as a soft filled pill behind its link, which also gives the touch target. The phone menu keeps the same links as a plain list with the current one marked. The calculator step rail keeps its dots and line (Stepper, researched below). Applied (see "What was applied" at the end).

---

## 8. Footers

Our uses: the site footer on every page and the slim footer under the calculator.

Opened (10):
1. shadcnblockscom / Footer 7, https://21st.dev/@shadcnblockscom/components/footer-7. Brand and a two-line blurb, social icons, then link columns with bold headings (Product, and so on). No boxes.
2. arihantcodes / Footer section, https://21st.dev/@arihantcodes_1f7b8c4d/components/footer-section. Link list, a contact block (address, phone, email), a social block, a theme toggle.
3. nevsky118 / Footer, https://21st.dev/@nevsky118/components/footer. Brand, two round social icons, a link row, a quieter row for Privacy and Terms, the copyright last.
4. ruixen.ui / Footer, https://21st.dev/@ruixen.ui/components/footer-1. Brand and blurb at the left, columns with small capital headings (Features, Resources, Company, Legal, Community), small green badges (New, Pro) beside a few links.
5. mvp_Subha / Footer column, https://21st.dev/@mvp_Subha/components/footer-column. A newsletter call to action above the brand: a headline, an email field, a solid button.
6. arihantcodes / Stacked Circular Footer, https://21st.dev/@arihantcodes_1f7b8c4d/components/stacked-circular-footer. Everything centred and stacked: round logo, link row, round social icons, subscribe, copyright.
7. kedhareswer / Hills Landscape Footer with Call to Action, https://21st.dev/@kedhareswer/components/meadow-rise-footer. A painted landscape with a serif headline that floats over it; the closing call to action is part of the scene.
8. prebuiltui / Footer, https://21st.dev/@prebuiltui/components/footer-1. A coloured band: logo, one centred sentence, the copyright.
9. 21st.dev's own footer, seen on https://21st.dev/@designali-in/components/footer (that component page is gone, and the site's own 404 page shows its footer). A mark and the year at the left, then five columns with small quiet headings and plain links.
10. ruixen.ui / Footer 03, https://21st.dev/@ruixen.ui/components/ruixen-footer03. Brand and blurb on top, four equal columns of plain links beneath.
11. RayMethula / Footer, https://21st.dev/@RayMethula/components/footer. Name, a line of description, social names, then columns such as Product and Compare.

What they agree on: the brand and one short sentence at the left, link columns with small quiet headings, the legal row last. The ones that look expensive (4, 9, 10) have no boxes at all and plenty of space; the ones that look generic (6, 8) centre everything.

Decision for the footer: keep the left-aligned brand and sentence and the three columns, with smaller quiet headings, links at the readable size, a hairline above the legal and estimate line, and no centred stacks. The "Screen" column (text size and theme buttons) stays only because the footer is a place people look for them, using the same quiet controls as the header. Small adjustments (see "What was applied").

---

## 9. Heroes (the first screen of a page)

Our use: the landing hero (a headline, two buttons, a 3D car on a road of payment tiles, a loan length slider with live figures).

Opened on 21st.dev (10):
1. sensewood8 / Responsive Hero Banner, https://21st.dev/@sensewood8/components/responsive-hero-banner. A cinematic photograph behind a serif headline, a small "New" pill above it, a glass nav.
2. felipemenezes098 / Centered Hero with Image Fan, https://21st.dev/@felipemenezes098/components/hero-10. A centred serif headline, a sentence, two buttons (solid and outline), "Trusted by 24+ product teams", a fan of pictures.
3. designali-in / Hero 03, https://21st.dev/@designali-in/components/hero-03. Very large light type set left and offset, a dotted grid, a vertical side tab. Not centred.
4. beratberkayg / Hero, https://21st.dev/@beratberkayg/components/hero-1. A pill label, a centred two-line headline, a sentence.
5. prebuiltui / Hero Section, https://21st.dev/@prebuiltui/components/hero-section. A pill announcement, a centred headline, a sentence.
6. felipemenezes098 / Editorial Collage Hero, https://21st.dev/@felipemenezes098/components/hero-04. Two columns: serif headline and two buttons at the left, overlapping pictures at the right over a soft wash.
7. tommyjepsen / Hero with text and two button, https://21st.dev/@tommyjepsen/components/hero-with-text-and-two-button. A pill link, a centred headline, a paragraph, a ghost and a solid button.
8. cnippet-dev / Aero Hero-3, https://21st.dev/@cnippet-dev/components/aero-hero-3. A full-bleed photograph (wind turbines), a centred headline over it, one rounded button with an arrow.
9. shadcnspace / Agency Hero Section, https://21st.dev/@shadcnspace/components/hero-01. A centred headline with one italic phrase, a button, a row of avatars with five stars and "Trusted by 1000+ clients".
10. meerbahadin10 / Glass Fold, https://21st.dev/@meerbahadin10/components/glass-fold. An animated shader background of folded glass panes, text over it.
11. mokshithgujjeti / Modern Landing Hero, https://21st.dev/@mokshithgujjeti/components/modern-landing-hero. A pill with "UPDATE", a two-tone centred headline ("Build faster. Scale infinitely.").

What the eleven show: seven of them (2, 4, 5, 7, 9, 11, and 8 over a photo) are the same template: a pill or label on top, a centred headline, one sentence, two buttons, sometimes avatars and stars. That template is the thing to stay away from. The stronger ones are not centred (3, 6), or let one real object carry the screen (1, 8, 10).

Decision for the hero: the landing hero already does what the better ones do: it is left-aligned, one object (the car on the payment road) carries it, and the two figures beside it are live. It stays. What is not added: a label pill above the headline, avatars or stars (there are no customers to show, and invented ones are never used), italic emphasis words, a gradient or shader wash. The grain added over the whole site is the only new surface treatment. The hero on the calculator door and the About page follow the same left-aligned rule. No change beyond the shared button and header work.

### 9b. Heroes on motionsites.ai (opened through its own address, ?prompt=name)

Opened (11): unwind-hero, moss-island, verkos-robotics, deepthink, dark-portfolio, eco-intelligence, synthora-hero, halcyonn, trustflow, mountain-retreat, lodge-booking-app. Address form: https://motionsites.ai/?prompt=unwind-hero and so on. Addresses tried that did not exist (and so are not counted): virtual-fitting, dashboard-ui, nexar, shelf-hero.
- Unwind Hero: a large light headline over a misty scene with a glass booking panel floating on it, with a real price ($359 night) in it. The product's own interface is part of the hero.
- Moss Island, Eco Intelligence (Terra Nova), Norvik Slowhouse (Mountain Retreat), TrustFlow: one strong object or photograph carries the screen; the headline is oversized and offset, not centred.
- Synthora Hero and Halcyonn: a glowing gradient and a centred "AI" headline with two buttons. These are the generic ones.
- DeepThink, Verkos, Dark Portfolio, Lodge Booking App: a dark page with one picture or phone mock; short headline.
Confirms the heroes decision above: object-led, offset, with real product figures inside the scene (Unwind), and no glow gradient (Synthora, Halcyonn).

### 9c. Dashboards on motionsites.ai (stat tiles, charts, cards in one place)

Opened (10): axle-journey, job-dashboard, fitness-dashboard, forecast-center, 3d-property, iris-assistant, reading-library, poke-builder, finance-assistant, label-workspace. Same address form.
- Axle Journey: frosted modules down the left with very large figures (4K, -42, 88%) and small labels, over a scene.
- Job Dashboard, Label Workspace: rounded modules, a small round progress ring on each row, figures in tabular type.
- Fitness Dashboard: modules of different sizes; the figure (2.15 L, 82 kg, 2,040 kcal) is large with its unit small beside it.
- Forecast Center: a stack of glass panels over a photograph; one very large figure (10 C).
- 3D Property: a floor plan with a mortgage calculator beside it: a slider, the monthly figure under it. The closest cousin to our product.
- Iris Assistant: a dark page, one centred prompt box with three suggestion tiles beneath and a plain list of recent items.
- Reading Library: a glass window of one raised object over a blurred room.
- Poke Builder: flat colour and one object, with the price in a pill at the bottom.
- Finance Assistant: the closest to ours in kind: modules on dark glass, each with a small label top left, a figure, and a thin bar or bars under it (Spending bars, Income bar chart, a split bar for a portfolio, a ring at 68%, a ten-segment bar for a score).

What they agree on: one module language across a screen (small label, large figure with its unit small, a thin bar), the bars are thin with a quiet track, figures are the largest thing, and everything shares a few radii. Modules differ in size, not in style.

---

## 10. Charts and bars

Our uses: the offers bar (two stacked bars on one scale), the money trail bars, the payment strip (one block per month), the share ring, the loan length road, the value against balance line, the trade-in bars.

Opened on 21st.dev (12, ten new plus two seen under statistic tiles):
1. uiable / Financial Bento Grid, https://21st.dev/@uiable/components/block-bento-5. An area chart of routed volume inside a bento of unequal tiles.
2. airbnb-visx / Legends, https://21st.dev/@airbnb-visx/components/legends. Legends as small panels: swatch, label, range, each in its own outlined box.
3. haassiib / Bar Chart, https://21st.dev/@haassiib/components/bar-chart. Grouped bars with a quiet grid, and a one-click switch to a table of the same data.
4. eugeneshilow / Leaderboard Bars, https://21st.dev/@eugeneshilow/components/leaderboard-bars. Thin bars with small whiskers, the name and a small caption on the left, columns of right-aligned figures (cost, tokens), and a separated last row for the one that is off the scale.
5. eugeneshilow / Share Strip, https://21st.dev/@eugeneshilow/components/share-strip. One strip split into segments, each named and given its percent inside, with a legend under the strip.
6. SubframeApp / Area Chart, https://21st.dev/@SubframeApp/components/area-chart. Three filled areas, a quiet grid, a small legend above.
7. romanvasnev / Finance Bento, https://21st.dev/@romanvasnev/components/finance-bento. A very large net-worth figure, a capsule to switch the period (1M, 3M, 1Y, ALL) and another for the currency, mini charts in tiles of different sizes.
8. astralyxdev / Anomaly Chart, https://21st.dev/@astralyxdev/components/anomaly-chart. A line with its expected range shaded behind it and the odd points marked in red.
9. eugeneshilow / Treemap, https://21st.dev/@eugeneshilow/components/treemap. Blocks whose areas are the shares, each labelled with its name and percent, and a one-line note saying what area and colour mean.
10. louisstudios / Peak Chart, https://21st.dev/@louisstudios/components/peak-chart. A stat card where a line draws in, a dot pulses at its peak, and the headline figure counts up.
11. 8starlabs / Partition Bar, https://21st.dev/@8starlabs/components/partition-bar (as above).
12. shadcnspace / Weekly Fitness Card, https://21st.dev/@shadcnspace/components/card-12 (as above).

What they agree on: bars are thin or have a quiet track; names sit left and figures right, set in the same tabular face; the legend is next to the data, not in a box; one sentence says what the picture shows (9); an alternative table is offered (3).

Decision for charts: our bars become thinner with a quiet track (the money trail rows are 30px tall; they become about 14px), names left and figures right on the same baseline, the legend as plain swatch and word under the bar with no outline, and one sentence under each picture saying what it shows (the Desk already has it). A "show as table" disclosure under the offers chart gives people who cannot see the colours the same numbers in a table. Applied (see "What was applied" at the end).

---

## 11. Accordions and disclosure rows

Our uses: "Why we check this", "Only have the out-the-door total?", "Help with the tax", "Show more" on every word, the legal pages' contents, the help questions.

Opened (10):
1. anubra266 / Accordion, https://21st.dev/@anubra266/components/accordion-1. A soft grey container; rows with a small chevron at the right; the open row shows its text in a lighter tone.
2. MUI / Accordion, https://21st.dev/@olivier_1b6cd5bc/components/accordion-1. Three rows divided by hairlines, a chevron right.
3. cipriantitire / FAQ Drawer, https://21st.dev/@cipriantitire/components/faq-drawer. Questions as index cards pulled out of a drawer, in a typewriter face. A gimmick; not used.
4. scrollxui / FAQ Accordion, https://21st.dev/@scrollxui/components/frequently-asked-questions-with-accordion. Hairline rows, a plus sign at the right, a headline and a contact line above.
5. kevingirelli / FAQ Section, https://21st.dev/@kevingirelli/components/faq. A small label, a large left-aligned headline, a line with "Contact us", then rows with chevrons.
6. bundui / FAQ Accordion Section, https://21st.dev/@bundui/components/faq1. Centred headline, rows with a hairline between them; the open row has more space.
7. ln-dev7 / Two-Column FAQ, https://21st.dev/@ln-dev7/components/faqs-02. The intro and a "Talk to a human" contact card stay at the left while the rows scroll at the right.
8. ibrandify / Editorial service list, https://21st.dev/@ibrandify/components/editorial-service-list. Numbered rows (01, 02), the title large, a small descriptor and an arrow at the right.
9. shadcn / Accordion, https://21st.dev/@shadcn/components/accordion. Plain question rows, a small chevron, a hairline between.
10. Hero UI / Accordion, https://21st.dev/@hero_ui/components/heroui-accordion. A small line icon before each question, hairlines, chevrons.

What they agree on: rows divided by hairlines, the question at the left and one small marker (plus or chevron) at the right, generous row height, no box around each row; the open state is shown by the marker turning and by the text showing, not by a colour fill.

Decision for disclosure rows: every "details" in the product becomes a hairline row with the question at the left, a plus or chevron at the right that turns when open, a row at least 52px tall, and the open text in the secondary colour. The bordered boxes around "Only have the out-the-door total?" and "Help with the tax" go. The two-column layout with a sticky intro at the left (7) is already what How it works does. Applied (see "What was applied" at the end).

---

## 12. Dialogs, sheets and popovers

Our uses: the lessons dialog, the Help sheet, Quick fill and the photo sheets, the term popover on every underlined word, the phone menu, the welcome guide.

Opened (10):
1. cnippet-dev / Logout Confirmation Dialog, https://21st.dev/@cnippet-dev/components/logout-confirmation-dialog. A small centred card: a round icon, a title, one line, then a footer split in two (No, Yes).
2. zanwei / Shared Element Transition Dialog, https://21st.dev/@zanwei/components/shared-element-transition-dialog. A question, one line, then Cancel and a destructive "Hold to delete" that fills while held; honours reduced motion.
3. patrick-xin / Morphing Dialog, https://21st.dev/@patrick-xin/components/morphing-dialog. A card that grows into the dialog from where it was tapped.
4. cnippet-dev / System Update Alert Dialog, https://21st.dev/@cnippet-dev/components/v-alert-dialog-8. Icon, title, a small version label, a tinted band for the sentence, two actions.
5. uiable / Dialog Scrollable Content, https://21st.dev/@uiable/components/dialog-scrollable-content. The header and footer stay fixed and only the body scrolls.
6. laziekiki / Keyboard Shortcuts, https://21st.dev/@laziekiki/components/keyboard-shortcuts. A searchable list in groups, keys drawn as small caps, a footer hint about how to close.
7. shadcnspace / Sheet (Different Directions), https://21st.dev/@shadcnspace/components/sheet-01. A panel sliding in from any edge, with a header, fields and footer actions.
8. Origin UI / Popover, https://21st.dev/@originui/components/popover. One small outlined trigger that opens a small panel.
9. ibelick / Popover, https://21st.dev/@ibelick/components/popover. A quick "Add Note" popover that closes on an outside click or a close button.
10. anubra266 / Popover, https://21st.dev/@anubra266/components/popover-1 and reshaped / Reshaped Popover, https://21st.dev/@reshaped/components/reshaped-popover. An icon trigger; a popover that repositions inside the viewport.

What they agree on: a dialog is narrow, one title, one sentence, the actions at the foot, with the header and footer fixed when the body scrolls (5); a destructive action is separated and never the default (2); key shortcuts are drawn as caps (6); popovers stay small and reposition to stay on screen (10).

Decision for dialogs and popovers: the lessons dialog and sheets keep a fixed header and footer with a scrolling body; the term popover stays small (about 20 rem wide) with the word, one sentence and a "Learn more" link; nothing in the product is destructive enough to need a hold, so no such pattern is added. Radius, padding and the dim overlay are made the same across all of them. Applied (see "What was applied" at the end).

---

## 13. Buttons

Our uses: the primary and secondary buttons on every page, the large call to action, the Next and Back buttons in the Walk, icon buttons, the small text buttons.

Opened (10):
1. cult-ui / Texture Button, https://21st.dev/@cult-ui/components/texture-button. Raised, shaded, almost neumorphic buttons in five colours. Heavy; rejected.
2. extend-hq / Button, https://21st.dev/@extend-hq/components/button. Solid dark and outlined secondary, compact, a built-in loading state.
3. moumensoliman / Native Button, https://21st.dev/@moumensoliman/components/native-button. A glassy button with a glow halo and spring movement. A gimmick; rejected.
4. sean0205 / Button, https://21st.dev/@sean0205/components/button-1/with-icon. Three tiers in one row: primary (solid), outline, ghost, each with a small icon.
5. shugar / Button, https://21st.dev/@shugar/components/button. A full system: primary, secondary, tertiary, error, warning, rounded, with icon, loading and disabled, all in view.
6. Hero UI / Button Group, https://21st.dev/@hero_ui/components/heroui-button-group/orientation. Icon buttons joined in one capsule, horizontal or vertical, thin separators.
7. efferd / App Store Button, https://21st.dev/@efferd/components/app-store-button. A brand badge button, dark, with a small top line and a large second line.
8. shadcn / Button, https://21st.dev/@shadcn/components/button. A plain solid button with a small radius.
9. jolbol1 / Button (outline), https://21st.dev/@jolbol1/components/button-1/outline. A one-pixel outline, light text weight, small.
10. xubohuah / FlowButton, https://21st.dev/@xubohuah/components/flow-button. A pill outline with an arrow that sits in a small circle and fills on hover; and cnippet-dev / Button, https://21st.dev/@cnippet-dev/components/cnippet-button/sliding, a dark pill ("Get Started").

What they agree on: three tiers, primary solid, secondary outline, tertiary plain, and the loading and disabled states are designed too (5). Icon buttons are grouped in a capsule (6). Texture, glow and gradient buttons (1, 3) are the ones that look machine-made.

Decision for buttons: three tiers, defined once. Primary is solid and used once per view. Secondary is a one-pixel outline. Tertiary is text with an underline on hover. All at least 48px tall (our readers include older people, and 44px is the floor), one radius, the arrow moving a few pixels on hover, an explicit loading state with the label kept and a disabled state with the reason nearby. No texture, glow or gradient. Applied (see "What was applied" at the end).

---

## 14. Alerts and callouts

Our uses: the deal checks (look closely, worth a question, good to know), "What matters most here", the "Not verified" and estimate notes, error and empty messages, the photo check results.

Opened (10 distinct; mynaui / Alert and originui / Alert returned "Nothing lives at this address" and are not counted):
1. sean0205 / Alert (two copies of the address, https://21st.dev/@sean0205/components/alert-1 and https://21st.dev/@sean0205/components/alert). Five saturated colour bars (black, green, red, purple, amber) with a link and a close button. Loud; the colour is the whole message.
2. deltacomponents / Admonition, https://21st.dev/@deltacomponents/components/admonition. A soft amber tint with a small icon, a bold title and one sentence.
3. Meta / Astryx Banner, https://21st.dev/@Astryxdesign/components/astryx-banner. Four pastel banners (info, success, warning, error), each one line with a small second line.
4. 7Ovr / Dismissible Alert Stack, https://21st.dev/@olewandowski1/components/notifications-5. White rows with a thin outline, an icon, a title, one sentence, a close mark; the list ends in an "all caught up" state.
5. shadcn / Sonner, https://21st.dev/@shadcn/components/sonner. Toasts for default, success, error and "promise" (loading then done).
6. shugar / Toast, https://21st.dev/@shugar/components/toast. A short message that shows for a moment.
7. redrob-labs / Alert, https://21st.dev/@redrob-labs/components/alert. Soft tinted blocks with a line icon; the copy is specific ("Row 42 is missing an email address. Fix the file and upload again.").
8. ibelick / System Message, https://21st.dev/@ibelick/components/system-message. A thin-outlined message; amber and red variants; an action button (Retry) at the right.
9. coss.com / Alert, https://21st.dev/@coss.com/components/alert. A quiet dark box: an icon, a short bold title ("Heads up!") and one line.
10. theorcdev / 8-bit Alert, https://21st.dev/@theorcdev/components/8bit-alert. Pixel-art borders and a retro face ("Quest Started"). A novelty; rejected as out of character for a money product.

Ten distinct component pages were opened for alerts (the first address is one design that has two listings, alert-1 and alert, counted once).

What they agree on: severity is shown by an icon and a short title, and the fill is a soft tint or none (2, 3, 7, 9), not a saturated bar (1). The copy is specific and says what to do (7, 8). A message that can be acted on carries its action (8). Dismiss is only for messages that are temporary.

Decision for callouts: keep the severity labels we already have (they carry meaning without colour), add a small line icon to each, use a soft tint or none rather than a saturated fill, keep the one yellow highlight for "What matters most", and keep every message specific with its action beside it (the check's question to ask already is). Applied (see "What was applied" at the end).

---

## 15. Search, filters, empty and not-found states

Our uses: the Learn search and category filter, the "No word matches that" empty state, the 404 and error pages, the ZIP and make and model pickers.

Opened (10):
1. user_xn1cklas / News Search, https://21st.dev/@user_xn1cklas/components/news-search. A result list: title and a small timestamp on soft rows.
2. Hero UI / Search Field, https://21st.dev/@hero_ui/components/heroui-search-field. A label above, a leading magnifier, a clear button that appears when there is text.
3. samitkapoor / Apple Spotlight, https://21st.dev/@samitkapoor/components/apple-spotlight. One large soft pill field with a magnifier.
4. victor-teles / Command Menu, https://21st.dev/@victor-teles/components/command-menu. Results in named groups (Create, Navigate), key hints at the right, a footer saying how to move and close.
5. ruixen.ui / Search With Category, https://21st.dev/@ruixen.ui/components/search-with-category. A category select and a field joined in one bar with a search button.
6. clevision / Combobox, https://21st.dev/@clevision/components/combobox. A field that opens a list to pick from, with up and down arrows.
7. cnippet-dev / Toolbar, https://21st.dev/@cnippet-dev/components/cnippet-toolbar. A single capsule of icon actions with one solid action at the end.
8. cnippet-dev / Empty, https://21st.dev/@cnippet-dev/components/cnippet-empty. An icon, a title, one sentence, then a primary and a secondary button.
9. nevsky118 / Not found, https://21st.dev/@nevsky118/components/not-found. A huge faint "404" behind a heading, one sentence, and a search field to get out.
10. f0rextasy / Data Table, https://21st.dev/@f0rextasy/components/data-table. A filter field above, the record count at the right ("Total: 6 records"), sortable column heads, page numbers under.
(Also seen earlier under inputs: shadcn Input Group, whose search field carries "12 results" inside its border.)

What they agree on: a leading magnifier, a clear control when there is text, the count shown with the field, grouped results (4), and an empty state that says what happened and gives one way out (8, 9).

Decision: the Learn search gets a leading magnifier, a clear button and the count ("100 words") on the right inside the field, in the same style as the money boxes; the category filter becomes underline tabs (see tabs). The empty state gets an icon, one sentence and one action ("Clear the search"). The 404 and error pages already say what happened and give two ways out; they keep that. Applied (see "What was applied" at the end).

---

## 16. Tables and comparisons

Our uses: the "How it works" ledger of three measures, the Desk's two offers side by side, the contract and lender comparison ("what the paper says against what you entered"), the printed one-page sheet.

Opened (10):
1. sean0205 / Data Grid Table, https://21st.dev/@sean0205/components/data-grid-table. Open rows with a hairline between them, no cell borders, the money column right-aligned and bold, "Rows per page" and page numbers below.
2. ruixen.ui / Pricing Module, https://21st.dev/@ruixen.ui/components/pricing-module. A monthly and yearly switch above equal tiers (Free, Basic).
3. Hero UI / Table, https://21st.dev/@hero_ui/components/heroui-table. A soft header band with muted column names, rows with hairlines.
4. uilayout.contact / Pricing, https://21st.dev/@uilayout.contact/components/pricing. Three plans with the middle one outlined in orange and marked "Popular", a billing switch with a "Save 20%" chip.
5. ruixen.ui / Info Cards Table, https://21st.dev/@ruixen.ui/components/info-cards-table. A comparison matrix with ticks and crosses and a short caption under each mark.
6. uilayout.contact / Pricing Section 3, https://21st.dev/@uilayout.contact/components/pricing-section-3. Two plain plans and one dark highlighted one; the price large with "/month" small beside it.
7. shailendrakumar19999 / Table, https://21st.dev/@shailendrakumar19999/components/table. A table with a filter box, sortable columns, a checkbox column and paging.
8. reshaped / Table, https://21st.dev/@reshaped/components/reshaped-table. Bare cells with no styling at all, for composition.
9. trophyso / Leaderboard Card, https://21st.dev/@trophyso/components/leaderboard-card. A podium and a ranked list with points. Game-like; not suited to a money decision.
10. efferd / Pricing Card, https://21st.dev/@efferd/components/pricing-card. One plan: price large with the old price struck, one solid button, a list with green ticks.

What they agree on: tables are open, with hairline rows and no cell borders; numbers sit right-aligned in one face; a header is quiet; the single highlighted item is raised and the rest are not (4, 6); units are set smaller than the figure (6, 10).

Decision for tables and comparisons: every table in the product (the contract and lender comparison, the Desk's offer columns, the printed sheet) uses a quiet header, hairline rows, right-aligned tabular figures and no cell borders; a row where the paper differs from what was entered carries a "differs" mark with words, not only a colour. The "How it works" ledger already follows this. The game-like leaderboard (9) is not used. Applied (see "What was applied" at the end).

---

## 17. Tooltips

Our uses: the names of the icon-only buttons (menu, help, text size, screen, close), the figures with a dotted underline ("Monthly payment") that open a plain explanation.

Opened (10):
1. felipemenezes098 / Flexnative Tooltip, https://21st.dev/@felipemenezes098/components/flexnative-tooltip. Ten variants listed on the page: basic hover, four sides, keyboard-shortcut hint, icon-button trigger, custom open delay, multi-line rich content.
2. Origin UI / Tooltip, https://21st.dev/@originui/components/tooltip. A tiny one-word chip on a plain trigger.
3. anubra266 / Tooltip, https://21st.dev/@anubra266/components/tooltip-1. A plain outlined trigger button with a small tooltip.
4. ruixen.ui / Tooltip Button, https://21st.dev/@ruixen.ui/components/tooltip-button. Three buttons (Info, Help, Settings) each with an icon and a label and a hover tip explaining what it does.
5. Hero UI / Tooltip, https://21st.dev/@hero_ui/components/heroui-tooltip. A soft pill that shows on hover and focus, with an optional arrow and four placements.
6. sean0205 / Tooltip, https://21st.dev/@sean0205/components/tooltip. A trigger with a small info icon: "Default tooltip".
7. theorcdev / 8-bit Tooltip, https://21st.dev/@theorcdev/components/8bit-tooltip. Pixel borders; novelty, rejected.
8. appica-dev / Sparkline, https://21st.dev/@appica-dev/components/sparkline. A tiny inline trend line inside a KPI or table row, with a hover tooltip carrying the exact value.
9. designali-in / AI Actions, https://21st.dev/@designali-in/components/ai-actions. A row of small icon buttons under a message (repeat, like, dislike, copy, share), each named by a tooltip.
10. corr / Pie Chart, https://21st.dev/@corr/components/pie-chart. A chart whose legend and slices carry tooltips with the exact figure.

What they agree on: a tooltip is one short line, shown on hover and on keyboard focus (5), the icon-only buttons need one (4, 9), and exact figures can sit in a tooltip behind a picture (8, 10).

Decision for tooltips: every icon-only button gets a tooltip with the same words as its accessible name, on hover and focus. Because touch screens have no hover, the explanations of words stay as tap-to-open popovers, which is what the underlined words already do. The bars and rings keep their exact figures in text, not only in a tooltip. Applied (see "What was applied" at the end).

---

## 18. Badges, chips and change indicators

Our uses: the change chips on the Desk ("117 less a month"), the check severity labels, the counts ("Checks (4)"), the category chips on Learn, the "AI-written" mark, the "differs" and "matches" marks on a contract comparison.

Opened (10):
1. serafimcloud / Status Badge, https://21st.dev/@serafimcloud/components/status-badge. Small outlined pills with a leading icon and a word (Protection, Live, Safety checks).
2. serafimcloud / Badge Delta, https://21st.dev/@serafimcloud/components/badge-delta. A tiny pill with an arrow and a percentage (9.3%, 1.9%, 0.6%); colour is on the text only; no fill.
3. arihantcodes / Status Badge, https://21st.dev/@arihantcodes_1f7b8c4d/components/status-badge. Soft tinted pills with an icon and a word: Pending, Failed, Success, In progress, In review, Expired, Submitted.
4. prebuiltui / Badge Tag, https://21st.dev/@prebuiltui/components/badge-tag. An outlined pill split in two: a label ("Version 7.0") and a short sentence.
5. reshaped / Badge, https://21st.dev/@reshaped/components/reshaped-badge. A neutral soft chip ("Status"), with faded and outline variants and three sizes.
6. sean0205 / Badge, https://21st.dev/@sean0205/components/badge-2. Seven variants; the colour ones (red, green, amber, purple) are saturated fills. Loud.
7. trophyso / Achievement Badge, https://21st.dev/@trophyso/components/achievement-badge. A trophy with a ring that fills. Game-like; not used.
8. Meta / Astryx Badge, https://21st.dev/@Astryxdesign/components/astryx-badge. Semantic variants (neutral, info, success, warning, error) and a full colour palette.
9. designali-in / Stamp, https://21st.dev/@designali-in/components/stamp. A circular "Excellence Award" seal. An award mark with nothing behind it; never used in this product.
10. ruixen.ui / Badge Button Combo, https://21st.dev/@ruixen.ui/components/badge-button-combo. A button with a small count or "New" or "Beta" tag floating at its top-right corner.

What they agree on: a badge is small, its meaning is carried by an icon and a word, not by colour alone (1, 3, 8); a change is an arrow and a figure with colour only on the text (2); fills are soft (3), and saturated fills (6) are the loud ones; counts ride on the thing they count (10).

Decision for badges and chips: the Desk's change lines become an arrow and a figure coloured in text only, with the words beside them; severity and "differs" marks keep a word and gain a small icon, on a soft tint; the category chips become underline tabs; counts stay on their tabs. No award marks, stamps or achievement badges are used, because the product has nothing real to award and invented trust marks are never added. Applied (see "What was applied" at the end).

---

## 19. Steppers and timelines

Our uses: the Walk's step rail (six steps), the Learn lessons path, the onboarding guide's dots, the Desk tour.

Opened (12):
1. adit-firdaus / Steps, https://21st.dev/@adit-firdaus/components/steps. Round markers joined by a line: a tick for done, a filled number for the current, a ghost for the next, a label under the current one.
2. anubra266 / Steps, https://21st.dev/@anubra266/components/steps. Numbers 1 to 4 on one line, the finished stretch of line filled.
3. sean0205 / Stepper, https://21st.dev/@sean0205/components/stepper. Small black numbered dots joined by a thin line, the content of the step under it.
4. corr / Stepper, https://21st.dev/@corr/components/stepper. A marker, then a bold title and a one-line description under each (Install, Configure, Publish).
5. sean0205 / Progress Bar Stepper, https://21st.dev/@sean0205/components/c-stepper-11. Four thin bars across the width, each with its title under it; finished ones dark, upcoming ones pale. Works at narrow widths where dots cannot carry names.
6. nayan_radadiya6 / Timeline Rail, https://21st.dev/@nayan_radadiya6/components/timeline-rail. A horizontal rail with dated stops and slanted labels; hard to read.
7. sudharshanpanidev / Stepper, https://21st.dev/@sudharshanpanidev/components/stepper. Numbered steps with a title and a short line, Back and Continue buttons below.
8. dhxwhy / Staged Progress Bar, https://21st.dev/@dhxwhy/components/staged-progress-bar. One bar split into named stages with a label riding on the bar that names the current stage and its percent.
9. sean0205 / Vertical Titled Stepper, https://21st.dev/@sean0205/components/c-stepper-15. A vertical line with a tick, a filled number and a ghost number, each with its title.
10. shadcnspace / Animated Progress Stepper, https://21st.dev/@shadcnspace/components/stepper-03. Icons on a line, a title under each, "Step 1 of 4" between Back and Continue.
11. Origin UI / Stepper, https://21st.dev/@originui/components/stepper (opened earlier). Titles beside the markers, a thin line between.
12. cubby-ui / Timeline, https://21st.dev/@cubby-ui/components/timeline (opened earlier). A vertical line, a filled dot for the current, an outlined dot for the next, a date, a bold title, a sentence. The pattern the Learn lessons now use.

What they agree on: three states drawn plainly (done with a tick, current filled, next pale), a thin joining line, a title under or beside each, and a plain "Step n of m" for narrow screens (10) or a bar with titles (5).

Decision for steppers: the Walk's rail keeps its dots, ticks and joining line on wide screens and adds the words "Step 2 of 6, Price" in text; on narrow screens the dots become six thin bars with the current step named (5, 10). The Learn lessons already use the timeline pattern (12). Applied (see "What was applied" at the end).

---

## 20. Progress bars and rings

Our uses: the share of interest in the total (ring), the payments strip, the walk's progress, the credit meter ("14 of 20 free AI uses left").

Opened (10; the last three were opened under other types):
1. sean0205 / Progress, https://21st.dev/@sean0205/components/progress. A thin dark fill on a pale track, nothing else.
2. shadcn / Progress, https://21st.dev/@shadcn/components/progress. The same, a little thicker.
3. anubra266 / Progress, https://21st.dev/@anubra266/components/progress-1. A thin blue fill and a pale track.
4. hihahihahoho / Circle Progress, https://21st.dev/@hihahihahoho/components/circle-progress. Rings at 0, 25, 50, 75 and 100%; the colour changes from green to amber to red as it fills; the percent is written under each.
5. Hero UI / Progress Bar, https://21st.dev/@hero_ui/components/heroui-progress-bar. A label at the left ("Loading") and the value at the right (60%) above a rounded bar.
6. theorcdev / 8bit Mana Bar, https://21st.dev/@theorcdev/components/8bit-mana-bar. A pixel bar with a smooth or a chunked fill. Novelty; rejected.
7. sean0205 / Multi-Step Progress, https://21st.dev/@sean0205/components/c-progress-7. A bar with "1 of 4 steps" at the right and a checklist beneath (ticks for done, empty circles for next).
8. dhxwhy / Staged Progress Bar (see steppers).
9. sean0205 / Progress Bar Stepper (see steppers).
10. kristen17 / Course Design Cards (see cards): a labelled bar with its percent inside a card.

What they agree on: a thin bar with a quiet track, the label left and the figure right, a colour that means something (4), and for several steps a checklist or titled stages (7, 8, 9).

Decision for progress: the credit meter and the walk progress become a thin bar with the words at the left and the figure at the right, in text as well as colour; the share ring keeps its figure in the middle and its sentence beside it (already so). No colour change that carries meaning without words. Applied (see "What was applied" at the end).

---

## What was applied (15 November 2026), and what was not

Applied, each tied to the section above:
- Cards (1): earlier in the day, How it works modes, the Learn lists, the check list, the door and the shortcuts became open rows with hairlines; the dictionary word lifts onto a panel only when open; the lessons hang from a line as a timeline (12 and 19).
- Statistic tiles (2): the Desk's two figures are open tiles with a hairline above their change line.
- Inputs (3): one-pixel border, label in a heavier weight, one two-pixel focus ring with no gap; the Learn search has a magnifier and the count inside its border.
- Sliders (4): the landing loan length slider names 36, 48, 60, 72 and 84 under the track.
- Tabs (5): a new underline variant of the shared segmented control, used for the Learn groups; the header and mode switches are a soft capsule without outlines.
- Switches (6): the four header controls are one capsule of quiet buttons; the text size, screen and help buttons carry a tooltip with their name.
- Navigation (7): the current page sits on a soft pill; the primary button dims on hover and its arrow moves.
- Footers (8): quieter column headings and weights; the layout was already left-aligned.
- Heroes (9): unchanged on purpose, as decided.
- Charts (10): bars are thinner; the offers chart has a "Show these figures as a table" disclosure in English and Spanish.
- Accordions (11): every disclosure row is a hairline row with a larger tap height, in the quiet text colour.
- Buttons (13): one radius, a one and a half pixel border, a dimming hover, an arrow that moves.
- Alerts (14): the check labels sit on a soft tint with a dot of their severity colour.
- Tables (16): the contract and lender comparison and the new chart table have a quiet header, more row space and right-aligned tabular figures.
- Badges (18): see alerts; change lines were already an arrow and a figure with colour on the text.
- Steppers (19): "Step n of 6: name" in words under the rail on screens narrower than 900 pixels.
- Progress (20): the free-uses line has a thin meter under it.
- Search (15): see inputs.

Not applied, and why:
- Dialogs and popovers (12): their radii, padding and overlay were not unified in this pass. The lessons dialog already has a fixed header and scrolling body. This is the next piece of work.
- Tooltips (17): only the three icon-only header controls got a tooltip. The phone menu button and the sheet close buttons are text or already labelled, and were left.
- Footers (8): the "Screen" column was left as it is.
- Statistic tiles (2): the unit-smaller treatment for the Walk's result figures was not done.
- Hero (9b) and dashboards (9c): used as evidence only.
- Not-found (15): the page was not changed.

Checks run after this pass: 289 tests; tsc and eslint clean; production build; axe-core 4 with no violations on the home page, How it works, About, Learn, the Spanish home page and the calculator (Desk), each on the dark and the light screen; no sideways scroll at 390 pixels on How it works and Learn; the Spanish calculator header has no overlaps at 1000, 1100 and 1440 pixels. Not run: a screen reader, and axe on every Walk step.
