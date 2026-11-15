# Learn drawings and words: user test kit

The Learn page explains each car-buying word with a small drawing of an everyday thing (a restaurant menu for the price list, a seesaw for owing more than the car is worth). A drawing only helps if people see the same thing the designer meant. This kit tests that with real people. Nothing here has been run yet; the only evidence so far is a model proxy, described last.

## What we want to learn

1. Do people recognise what each drawing shows, without being told?
2. Does the everyday comparison make the car word easier to remember and explain?
3. Which drawing, word or sentence confuses people, in English and in Spanish?
4. Can a first-time buyer use the page to answer a real question ("what does APR change for me?") without help?

## Who to recruit

Eight people is enough to find most problems (about five per group is the usual floor for this kind of test). Aim for:

- 2 who have never bought a car (age 18 to 25)
- 2 who bought once, with help from a relative (age 30 to 50)
- 2 aged 60 or more, one of whom uses a screen reader or large text
- 2 who read Spanish more easily than English, tested in Spanish

At least three on a phone, three on a laptop, two on whichever they use at home. Not people who work in cars, lending or design. Pay or thank them; ask nothing about their money, only about the page.

## Setup

- 30 minutes, one person at a time, in person or on a video call with their screen shared.
- The tester's own device, so the text size and screen reader are theirs.
- Open `/learn` (and `/es/...` for Spanish) on the built app, not the dev server.
- A notetaker who is not the moderator. Record the screen with permission.
- Consent, read aloud and agreed before starting:

  > We are testing the app, not you. There are no wrong answers. You can stop at any time. We will record your screen and voice to help us take notes, keep it to ourselves, and delete it after we finish the study. Nothing you say or type is linked to your name. Is that all right?

## Tasks

**A. Drawings, with no words (5 minutes).** Show the 26 drawings one at a time as images with no caption, in a random order. Ask: "What is this showing? What everyday thing does it make you think of?" Do not say it is for car buying until they ask. Score: **recognised** (names the intended thing or a close synonym), **partly** (right idea, wrong object), **missed**.

**B. Match (5 minutes).** Print or show the 26 words and the 26 drawings. Ask them to pair them. Score the number correct. This is harder than A; it tells us which drawings are mistaken for each other.

**C. Real question (10 minutes).** Give a scenario: "The dealer said your loan is 84 months at 7.9%. You want to know if that is a lot." Let them use the page however they like. Ask them to think aloud. Score: did they find the word, did they read the daily-life line, could they say in their own words what it means.

**D. Teach-back (5 minutes).** Pick three words they read. Ask: "Tell me what that means as if I were your cousin." Score each: **correct**, **mostly**, **wrong**. Write what they said.

**E. Close (5 minutes).** "What was the most helpful thing? The most confusing? What would you tell a friend?" Then ask for 1 to 5 on "I understand car loan words better than before".

For Spanish sessions, run in Spanish end to end and add: "Was there a word you would not say yourself? What would you say?"

## What counts as passing

| Measure | Target |
| --- | --- |
| Drawings recognised (task A), across all testers | at least 80% recognised or partly |
| No drawing missed by more than 3 of 8 | all drawings |
| Match (task B), average | at least 22 of 26 |
| Teach-back correct or mostly (task D) | at least 80% |
| Real question answered without help (task C) | at least 7 of 8 |
| Confidence score (task E) | average at least 4 of 5 |

A drawing missed by 3 or more testers is redrawn or replaced before launch. A word with two wrong teach-backs has its plain sentence rewritten.

## Reporting

One page per round: a table of the 26 drawings with recognised, partly and missed counts; the words with wrong teach-backs; quotes; and the changes made. Keep raw notes with first names only. Run a second round of 3 to 5 people after the fixes.

## Accessibility checks to run at the same time

- Drawings are decorative or have a text equivalent: a screen reader should not announce "image, image, image". Confirm with VoiceOver on iPhone and NVDA on Windows.
- Text at 200% zoom does not hide a drawing or a button.
- Reduced motion is respected (system setting on).
- Contrast of drawing lines against the page in light and dark mode.

## Evidence so far: a model proxy, not a user test

On 2026-11-14 a vision model (Claude Haiku 5.5, `scripts/recognize-art.mjs`) was shown each of the 26 drawings without a name. In the open question it named the intended object for nearly all of them. The weakest were the coffee cup (it saw a cup of coffee, not a monthly subscription), the swap arrows (a generic cycle) and the two friends (a coin handoff); watch these first with people. In the multiple choice, where it had to pick the drawing's meaning from all 26 options, it chose correctly for 26 of 26. Four drawings (menu, pizza, report card, seesaw) were wrong at first and were redrawn until they passed.

This tells us that the drawings are not ambiguous to a model that has seen millions of pictures. It does not tell us whether they work for a person who is stressed, in a hurry, or reading in a second language. Treat 26 of 26 as "no embarrassing mistakes before we ask people", and nothing more.

To re-run: export the drawings as PNGs named by key into a folder, then `node scripts/recognize-art.mjs <folder>`.
