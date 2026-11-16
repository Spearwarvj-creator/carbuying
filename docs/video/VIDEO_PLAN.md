# Deal Desk video plan (V2Stack No. 6)

Channel: https://www.youtube.com/@v2_stack. Promise: "One real product a week. Not a demo. The actual thing, live." Previous walkthroughs run 10:47 to 14:54. This one is planned at **10:46** and cannot pass 12:00. Photo reading is left out on purpose and gets its own video.

This is version 2. What changed from version 1: the video now opens the way your Kurae video does ("This is number six in V2Stack..."), V2Stack is a spine of the video and not a footnote (five products, a shared rule, and No. 6 joining the shelf), seven transition cards sit between the chapters, there is a start card and an end card, and a pixel car called **Vee** hovers in the live scenes. The hook figures were replaced with the ones the home page itself shows.

Read with: `voice/beats.json` (what you say, one entry per voice beat), `kit/README.md` (the cards and Vee), `../V2STACK_ADD_PROJECT.md` (the No. 6 entry for v2stack.com).

## The one idea

A lower monthly payment can still cost you more, and the dealer talks about the payment. Deal Desk makes every number with a calculator, and the AI only explains them. That is also the thread through all of V2Stack: AI that explains, and never invents. Everything in the video proves one of those two things.

## What V2Stack is, so the voiceover can say it (read from v2stack.com on 15 November 2026)

- Tagline: "One real product a week. Not a demo. The actual thing, live." Each project has a live product and a walkthrough on YouTube.
- Shipped so far: No. 1 Tactly (July 2026, invoice reminders you send yourself), No. 2 Verdict (August, resume roast with a computed match score), No. 3 Compass (August, student visa status across 15 countries, always dated), No. 4 AgentFoundry (September, a chatbot from real blocks), No. 5 Kurae (November, notes that file themselves). Walkthrough lengths on the site: 14:54, 12:59, 14:34, 10:47.
- Every product page ends with "What it deliberately is not". That habit is the brand, so this video ends with Deal Desk's own "not" list.
- The site also has 690 free tools in 15 suites (the Money suite has loans and mortgages) and an assistant called Vupo. One line of cross-promotion is fine; do not spend more.
- Your own words from the Kurae video that I reuse exactly: "This is number five in V2Stack, where I build and ship one real product every week" and "Subscribe to follow along, and if you want one built for your business, the email is on screen."
- The site currently says "Five shipped so far". It becomes six when No. 6 goes live (see `../V2STACK_ADD_PROJECT.md`).

## Before you record

| # | Item | Why | State |
| --- | --- | --- | --- |
| 1 | No. 6 on v2stack.com | Not needed for this video: V2Stack is only mentioned in the voice, and no v2stack.com page is shown. Add it after publishing | Entry is ready in `../V2STACK_ADD_PROJECT.md` |
| 2 | Vercel settings: delete `MODEL_VISION`, `MODEL_TEXT`, `MODEL_FALLBACK` (or set the real names), rename `EXT_PUBLIC_SITE_URL` to `NEXT_PUBLIC_SITE_URL`, delete `NEXT_PUBLIC_YOUTUBE_URL` until the video exists, rename `LOBAL_DAILY_CREDITS` to `GLOBAL_DAILY_CREDITS`, rotate the Upstash token | Clip 15 tells this story. The live AI already answers after the code fix | Confirm each change, then redeploy |
| 3 | Reset the app's saved state, then reload | A fresh viewer sees the welcome screen. In a console on the live site: `localStorage.removeItem("dd-mode"); localStorage.removeItem("dd-seen"); sessionStorage.clear()` | Do it before every take |
| 4 | Skip the first-visit guide and the Desk tour once | They cover the screen | Click Skip |
| 5 | Screen: 1920 x 1080, browser zoom 100%, dark theme, bookmarks bar hidden, notifications off | Matches the cards | Check |
| 6 | Start the kit server: `cd docs/video/kit && python3 serve.py` | Plays the cards | Run it |
| 7 | ElevenLabs: use your "indi techie" voice at speed 1.00, stability 50, similarity 75 | Same voice as earlier videos | Confirm the sliders |
| 8 | Desk figures: 60 months $603, 84 months $462, +$2,593 | Clip 7 says so | Confirmed on the live Desk on 15 November: $462, "$141 less a month", "+$2,593 more in total", $40,781 |
| 9 | Chrome window | The window gives only about 1440 x 670, which cuts off the Walk's loan step | Set Chrome zoom to 80% (Cmd and minus twice): the viewport becomes about 1800 x 874 and every screen fits |

Everything else was checked on the live site on 15 November: all pages return 200 with the right language, the 404 page works, the Walk's figures match a hand calculation, the Spanish switch works, the AI helper answers and labels itself, and the pages have no sideways scroll at phone width.

## Structure

| Time | Part | What the viewer sees | Vee |
| --- | --- | --- | --- |
| 0:00 | Hook | Home page, the Loan length slider dragged from 36 to 84 months | Points at the payment, then the total |
| 0:38 | **Start card** | "DEAL DESK" in pixel type, the V2Stack No. 5 badge rolling to No. 6 | Flies in, winks |
| 0:45 | 2 V2Stack, and the one rule | Stay on carbuying: the home page scrolled slowly to the footer line "Deal Desk is a v2stack project", then the About page line about numbers | Points at the footer line, then the About line |
| 1:43 | **Transition 1** | Chapter 03 of 09, "A real quote" | Drives to post 03 |
| 1:47 | 3 A real quote | The six-question Walk, then Your deal | Hovers at each answer |
| 4:27 | **Transition 2** | "The Desk" | |
| 4:31 | 4 The Desk | Two offers, payment down, total up | Wow, then oops |
| 5:21 | **Transition 3** | "The AI rule" | |
| 5:25 | 5 The AI, and the guard | Ask about this deal; the guard test in the terminal | Thinks while it loads |
| 6:37 | **Transition 4** | "Words, and Español" | |
| 6:41 | 6 Words and Spanish | Learn, the decoder, ES | Says HOLA |
| 7:33 | **Transition 5** | "The redesign" | |
| 7:37 | 7 The redesign | Animation card (no footage), then before and after | Oops, wow, focus, happy |
| 8:36 | **Transition 6** | "How I checked" | |
| 8:40 | 8 How I checked it | Animation card: tests, Vercel deploy, live-site problems | Celebrates the green tests |
| 9:42 | **Transition 7** | "On the shelf" | |
| 9:46 | 9 What is left | Plain list, then the link | |
| 10:20 | **Shelf card** | Tactly to Kurae, then No. 6 lands | Carries the tile in |
| 10:28 | **End card** | Subscribe, the email, two empty slots for YouTube's end screen | Says SEE YOU IN NO. 7 |

Every transition card carries real details so it is not dead air: the chapter number out of nine, the title, a one-line promise, a panel with **Where** to find it, **Watch for** (a real figure from the next chapter) and **From the shelf** (a fact about an earlier V2Stack project, read from the site), and a road along the bottom where Vee drives from one chapter post to the next. The voice reads a short bridge line over each one (clips 4, 6, 8, 10, 12, 14, 16).

## Chapter by chapter: what to do on screen, and what Vee does

Vee is injected as an overlay on the live site (see "Recording" below). The calls are written for the overlay: `v = Vee.overlay()` once per page, then these.

**1. Hook (home page).** Start the take with the slider at 60 months. Drag to 36, hold two seconds, drag to 84, hold three. Read the figures off the screen, not from memory.
- `v.goTo({text:"A lower payment can"},{side:"right",point:true}); v.say("A LOWER PAYMENT...")` while you say the first sentence.
- At 36 months: `v.goTo({text:"Loan length"},{side:"above",point:true}); v.say("36 MONTHS: $989 A MONTH")`.
- At 84 months: `v.wow(); v.say("$491 A MONTH. HALF.")`, then `v.goTo({text:"$44,246"},{side:"left",point:true}); v.oops(); v.say("BUT $5,645 MORE IN TOTAL")`.
- Pattern interrupt: cut to the start card the moment you say "before you sign".

**2. V2Stack, and the one rule.** No v2stack.com footage: stay on the Deal Desk site, so the viewer never leaves the product. While you name the five products, scroll the home page slowly down to the footer line "Deal Desk is a v2stack project" and rest there. Then open the About page and rest on the sentence about the calculator making the numbers.
- At the footer line: `v.goTo({text:"v2stack project"},{point:true}); v.mood("happy",1200); v.say("NO. 6 IN V2STACK")`.
- At "every one is built so the AI can't invent things": `v.mood("focus",2500)`.
- On the About page, the "One rule" section: `v.goTo({text:"The calculator does the math"},{side:"right",point:true})`, then `v.goTo({text:"Never makes a number"},{side:"below",point:true,gap:46})` (below, so Vee does not cover the card text).
- At "thrown away": `v.stamp("THROWN AWAY")`.
- Keep this chapter under 60 seconds. It is the part a new viewer might skip, so end it on the rule.

**3. A real quote (the Walk).** Pick "I have a quote". Type slowly, pause one second on every figure you say.
- Question 1: `v.goTo({text:"What did they quote first?"},{side:"left",point:true})`.
- Question 2 (tax): when $32,100 appears, `v.goTo({text:"$32,100"},{point:true}); v.say("TAX ON TOP")`.
- Question 3 (extras, none): `v.mood("happy",1200); v.say("NOTHING TO QUESTION")`.
- Question 4 (loan): `v.lookAt(...)` toward the red blocks; `v.say("RED IS INTEREST")`.
- Your deal: `v.celebrate(); v.goTo({text:"$603"},{point:true}); v.say("603 A MONTH")`.
- The hand check: `v.puff(v.x+60,v.y-60,"~",Vee.PAL.teal,6); v.say("MATCHES")`.
- Open "Show these figures as a table" and scroll to "Things to check". Vee stays parked at a screen edge here, so the figures are clear.

**4. The Desk.** Offer 1 at 60 months. Offer 2 at 84 months.
- When the payment falls: `v.goTo({text:"Monthly payment"},{point:true}); v.wow(); v.say("LOWER PAYMENT")`.
- When the total rises: `v.goTo({text:"Change in total"},{point:true}); v.oops(); v.say("HIGHER TOTAL")`.
- Hold the plain-words line on screen for a full two seconds.

**5. The AI, and the guard.** Tap "What should I look at first". While it loads, `v.think(3000)`. When the answer lands, `v.goTo({text:"Written by an AI"},{point:true}); v.mood("happy",1500)`.
- Terminal: `npx vitest run src/server/language.test.ts -t "invents a number"` (passes in under half a second). Leave it on screen for four seconds. Vee cannot reach the terminal, so key a sticker clip over it in the edit: `kit/sticker.html?mood=happy&say=THROWN%20AWAY&bg=green`.

**6. Words and Spanish.** Learn page; open one lesson; use the decoder; search one word. Then tap ES on the calculator and `v.say("HOLA")`, then the `/es` home page.
- Say the Spanish-beta honesty line looking at the page, not at Vee.

**7. The redesign.** No research footage (you decided it is not needed on screen). Play the animation card `kit/index.html?card=redesign&clean=1` (56 s): "It felt cramped", then 20 kinds and 237 screenshots counting up (237 squares fill in), the real cause (text too small, layouts squeezed by height), the quiet changes (header group, thin lines, what was left out), then "Before, and after". Follow it with a short before and after of the same page if you have one.

**8. How I checked it.** No terminal or Vercel footage (also not needed). Play `kit/index.html?card=checks&clean=1` (66 s): 293 tests pass (293 squares fill in), the accessibility scan on the local build, "Deployed through Vercel" (push, build, deploy, test), the two live-site problems, the two wrong settings and the fix, and "Test the real site". The voice says it deploys through Vercel; nothing from the Vercel dashboard is shown. For the guard test, key a sticker over a short terminal clip, or use `kit/sticker.html?stamp=THROWN%20AWAY` on its own.

**9. What is left.** A plain on-screen list: Spanish review, screen reader test, photo reading (its own video). Then the live link, then the shelf card, then the end card.

## The cards (kit)

Open `http://localhost:8765/index.html` for the panel, or one card on its own for recording: `?card=start`, `t1` to `t7`, `shelf`, `end`, each with `&clean=1` (no panel) and optionally `&noend=1` (hold the last frame) or `&guides=1` (show the end-screen slots). Record each card as its own clip at full screen. Full instructions: `kit/README.md`.

The cards start and finish with a pixel wipe in V2Stack terracotta, so in the edit you can cut footage under the wipe and it will look planned. Cards are 62 seconds in total.

## Recording

Hardware and setup: your screen recorder at 1920 x 1080, 30 fps, system audio off (the voice is added later), microphone off.

Order to record (batch by page, so you only reset state a few times):
1. Home page: the hook slider, then the scroll to the footer, then the About page.
2. Calculator: Walk, then Desk, then Ask about this deal, then Learn and Spanish.
3. Terminal: guard test, full tests.
4. Research folder and before/after.
5. Vercel settings (secrets blurred).
6. The cards, each as its own clip.

Putting Vee on a page. Chrome will not load a script from your own computer onto an https page, so Vee is pasted in:

1. Open `kit/vee.min.js` (about 20 KB), select everything and copy it.
2. On the page you are recording, open the browser console (right-click, Inspect, Console). The first time, Chrome asks you to type `allow pasting`.
3. Paste, press Enter, then type `const v = Vee.overlay()` and press Enter. Vee appears. Moving around inside the app keeps it; a full page load or another site needs the paste again.
4. Try `v.goTo({text:"A lower payment can"},{side:"right",point:true}); v.say("HELLO")`.

When I drive the browser for you, I carry the script between sites with a small trick (`window.name`), so I paste it only once.

For footage Vee cannot be injected into (the terminal, a PDF), record `kit/sticker.html?mood=happy&say=THROWN%20AWAY&bg=green` as a separate clip and key the green out over the footage in the edit. Moods: happy, wow, oops, think, focus, wink, sleepy. Add `&stamp=NOPE` for a big pixel stamp.

For the "before" footage:

```bash
cd /Users/vijaychilaka/Downloads/startup-ideas/deal-desk
git worktree add ../deal-desk-before a3db356
cd ../deal-desk-before && npm install && npx next dev -p 3200
# afterwards:  git worktree remove ../deal-desk-before
```

## Retention notes (an editor's checklist)

- The first 38 seconds must hold a viewer who does not know the channel: one question, one slider, one number that is wrong in an interesting way. Do not put the intro sting before it.
- Something changes on screen at least every 25 seconds: a new page, a zoom, Vee moving, a card.
- Zoom in to 130% on every figure you say aloud, hold for the length of the sentence, zoom out.
- Captions: burn in the figures only (for example "$603 a month"), so the video works muted.
- Music: one quiet loop, 10 to 15% under the voice, cut for the end card. No music during the guard test, so the 0.4-second pass is heard as silence.
- Cut every pause longer than 1.2 seconds in the screen recording, unless a page is loading and Vee is reacting.
- Chapter timestamps in the description must be re-read from the final edit.

## Publishing

**Title (pick one).**
1. I Built a Car Deal Calculator That Won't Let AI Make Up Numbers (Free) | V2Stack No. 6 (recommended: your pattern plus the claim)
2. The Car Payment Trick Dealers Use, and the Free Tool I Built to See It | V2Stack No. 6
3. I Built a Free Car Deal Checker for People Who Have Never Bought a Car

**Thumbnail (same family as your Kurae one).** Open `kit/thumbnail.html`, which is built at 1280 x 720: the dot grid, a big pixel Vee with its "wait, what" face, "PAY LESS. / PAY MORE." in pixel type (the second line in terracotta), the V2Stack | No. 6 pill top right, and three small chips with real numbers ($491 A MONTH, $44,246 TOTAL, AI NEVER MAKES THE NUMBERS). Capture the 1280 x 720 frame at 100% browser zoom (a screenshot of the `.thumb` box) and upload it. No face, no arrows. Check it at small size next to your Kurae and Compass thumbnails before you upload.

**Description (paste; fix the timestamps after the edit).**

```
A lower monthly payment can still cost you more. Deal Desk shows what each change in a car deal does to the total, before you sign.

Try it free, no account: https://carbuying.v2stack.com
The calculator makes every number. The AI only explains them, and a guard throws away any figure that is not in your deal.

This is number six in V2Stack: one real product every week. https://v2stack.com
Want one built for your business? The email is on screen at the end.

Chapters
0:00 A lower payment that costs more
0:38 V2Stack, number six
1:43 A real quote
4:27 The Desk
5:21 The AI, and the guard
6:37 Words, and Spanish
7:33 The redesign, with proof
8:36 How I checked it
9:42 What is left, and No. 6 on the shelf

The voice in this video is generated from my own voice with ElevenLabs.
The 3D car on the Deal Desk home page is a CC0 model by Kenney (kenney.nl).
Estimates from the numbers you enter. Not financial or legal advice.
```

**Pinned comment.** "Which number does the dealer talk about most, in your experience: the payment, the price, or the trade-in? I'm collecting these for the next version."

**End screen (last 18 s).** Slot 1 (large): No. 5 Kurae walkthrough. Slot 2: No. 4 AgentFoundry. Subscribe circle at the lower right. The kit's end card leaves these empty (`&guides=1` shows them).

**Shorts to cut afterward (your pattern is four per product).** (1) The slider: 36 to 84 months, payment halves, total climbs. (2) The guard throwing away a made-up number. (3) The Desk: lower payment, higher total. (4) The Spanish switch.

## After publishing

- Put the video link in `NEXT_PUBLIC_YOUTUBE_URL` on Vercel and redeploy, so the site links back.
- Add the video to the No. 6 entry on v2stack.com (length and link).
- Watch audience retention at 0:38, 1:47 and 5:25. If it drops there, tighten those chapters next time.

## Honest limits to say out loud

- The Spanish is a beta. A model translated it and another model back-translated it. No native speaker has reviewed it, and every Spanish page says so.
- It has not been tested with a screen reader. The automated scan found no violations on the main pages of the local build.
- Photo reading has only been tried on generated worksheets, not real ones, so it is left for its own video.
- The AI has a daily free limit for each visitor. If it cannot answer, the page shows plain sentences from the calculator.
- It gives estimates from the numbers you type. It is not financial or legal advice.

Do not say "bank-grade", "used by thousands", or any number of users. There is none to quote.
