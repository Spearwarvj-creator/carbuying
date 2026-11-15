# Learn hub, simple view and the deal assistants

14 November 2026. Built after the persona audit, in answer to two things the owner said: users still meet too many numbers, and nowhere teaches the words of car buying and car loans to a normal person.

## 1. The Learn hub (`/learn`)

A page in the main navigation, the footer, the phone menu, the calculator header and a tile on the calculator's front door. It works in English and Spanish (switch on the page), and with no AI.

**The dictionary: 62 words in six groups.** Price and paperwork (18), loans and rates (19), extras and protection (6), trade-in and value (6), leasing (7), owning the car (6). Each word has the same parts:

- **A plain sentence** (what it is, in under 90 characters).
- **An everyday comparison with a drawing.** MSRP is a restaurant menu price. APR is borrowing $100 from a friend who wants $107 back. Negative equity is owing $12,000 on a phone plan for a phone now worth $8,000. Depreciation is an ice cream cone melting. A lease is renting an apartment. GAP is renter's insurance for the gap between what you owe and what the car is worth.
- **What it means, why it matters, and a question to ask the dealer.**
- **"In your deal":** when a deal is open (in the calculator, or in this tab's saved place), a sentence with the reader's own figures for 15 of the words, such as "Your trade is worth $6,000 in this deal, and you still owe $9,500." The figures come from the calculator.
- **"Explain it another way":** the existing AI explain, with the word's text as the only facts.
- **Read next:** links to related words.

**26 drawings, made in code.** One per everyday idea (menu, receipt, package, keys, fine print, warning triangle, scale, fingerprint, phone, umbrella, coupon, two friends with a coin, piggy bank, pizza, see-saw, coffee cup, report card, handshake over a document, calendar, dumbbell, stairs, melting ice cream, swap arrows, ladder, apartment, fuel pump). They use the app's colours, follow the light and dark themes, need no image files, and sit beside the everyday sentence so the picture and the comparison read as one.

**Six short lessons** (two minutes each, one picture, four steps, a look at the reader's own deal, and a question to check yourself with a hidden answer): the four numbers a dealer juggles; why a lower payment can cost more; what extras really cost; what the rate means; what a trade-in really does; before you sign.

**Decode what the dealer wrote.** Paste a quote, a text or a contract line, or photograph it. Every car-buying word is underlined and explained, with no AI and no network. "Say it in plain words" (AI) writes what the dealer most likely means and what is not clear. A photo is read by the vision model into plain text first. The reply may use only numbers that are in the pasted text or the buyer's deal.

**Tappable words everywhere.** On the Desk, the money trail rows, the compare table, the labels on the result, the checks, and every AI answer, a car-buying word opens a small card with the plain meaning, the picture, the everyday sentence, the reader's own figure, a question to ask, and a link to the full entry. `AutoGloss` finds the words in any text (whole words only, longest phrase first, each marked once).

Files: `src/data/learn/` (words in `en-a.ts`, `en-b.ts`; Spanish in `es-a.ts`, `es-b.ts`; lessons; "in your deal" sentences; page words), `src/lib/learn/`, `src/components/learn/`, `src/app/learn/page.tsx`, `src/app/learn.css`.

## 2. Fewer numbers

- **Simple view is the default.** Whole dollars (no cents) on the Desk result and the money trail, the long list of changes cut to three, and the Walk result keeps its extra pictures behind "Show the details". A "Simple" / "Full" switch sits in the header and the phone menu (kept in this browser as `dd-detail`). Experienced buyers flip to Full once.
- **What matters most here.** One thing in the deal, picked by fixed rules from the calculator's figures, said in one sentence with a tap to learn the word: an old loan rolled in, expensive extras, a long loan (with what a 60 month loan would save), a high rate, high fees, otherwise the price. It never says whether to take the deal.
- **Everyday lines** under the result: about $19 a day for 84 months, and the interest alone is about 19.6 of your payments.

## 3. The deal assistants

- **Ask about this deal.** Any question, with the whole deal as its facts, and the last two questions so a follow-up such as "and without the extras?" works. The calculator works out the "what if" figures first (other loan lengths, no extras, $1,000 more down) and hands them over as facts, so "what would 60 months change?" gets a real answer ($752.92 a month, $3,400 less in total) instead of "the numbers do not show it".
- **Explain this screen.** Four short sentences and what to look at first.
- **Translate the dealer** (in Decode).
- **The rule still holds.** The model chooses words. A figure that is not in the deal, the what-if lines, the pasted text or the buyer's own question throws the answer away, and the deal is shown in plain sentences instead. Asked "Is this a good deal? Should I sign?", it said it cannot tell, then listed what the numbers show and four questions to ask.

## 4. Tested

- **Unit tests (281 passing):** 62 words complete in both languages, no dashes used for pauses, one owner for each phrase, every figure identical in both languages, related links valid, every drawing used; the matching engine (whole words, longest phrase, accents, special characters); "what matters most" for each of its six outcomes; "in your deal" lines in both languages with the same figures; whole-dollar rounding; the what-if figures; the guard for whole-deal answers, follow-ups and translation (extra number rejected, buyer's own number allowed, pasted text treated as words not orders); photo-to-text.
- **Live, against the real model:** translate in English and Spanish, whole-deal questions with a follow-up, explain this screen, a verdict question, an "explain it another way" on a word, and photo-to-text on a generated dealer message (read word for word). In the browser: lessons from first step to the check, decode with the sample text in English and Spanish, search, a tapped word on the result, the assistant dialog with two questions, the simple view, Spanish on the Desk.
- **Accessibility:** axe found nothing on the result page and the Learn page after two fixes (a low-contrast label and an unlabelled file input).
- **Layout:** no overlap in the headers at 720, 768, 900, 1000, 1280 and 1400 wide in Spanish. The calculator header moved the page links and Help to 1400px and wider, and the text, theme, language and view switches to 880px and wider, because the new Learn link and Simple switch needed the room.

## 5. Not done, or not verified

- **Spanish needs a native reviewer who knows car financing**: 62 words, six lessons, and the new screens. The numbers cannot change, but a mistranslated meaning could mislead.
- **The contract against worksheet comparison** was already built; its rules are tested and the reader was run live on a generated contract, but the photo upload dialog was not driven in the browser, because the test browser cannot choose a file.
- **The drawings are mine, simple, and untested with real readers.** They are meant to link a word to daily life; whether they do is a question for a few people.
- **The dictionary is a first set.** Words people will ask for next: "trade-in value versus retail", "dealer holdback", "title loan", "certified lease", insurance terms. Easy to add: one entry in each of four files, and the tests check it is complete.
- **Landing, About and legal pages are still English only.**
- **Rate and fee references** (Experian averages) still need a refresh each quarter.
