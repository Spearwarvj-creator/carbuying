# Voiceover for ElevenLabs (V2Stack No. 6, Deal Desk)

19 clips, about 1,370 spoken words, in first person. Read this file with `VIDEO_PLAN.md` open beside it: the plan says what is on screen, this says what you say.

**Voice: use the one you already made.** The ElevenLabs files in your Downloads folder are named `indi techie ... ivc_sp100_s50_sb75_v4`. That reads as your instant voice clone "indi techie", with speed 1.00, stability 50 and similarity 75. I cannot see your ElevenLabs account, so open that voice and confirm the sliders match before you generate, then keep them the same for every clip so the whole video sounds like one take. Only use your own voice.

**Pace.** Your Kurae video's subtitles show your voice at about 2.66 words a second (159 a minute) with the gaps included. This plan assumes a slower 2.5 words a second, so every clip has a little room. If a clip comes out longer than the screen time in the table, regenerate it once or trim a sentence; do not speed the voice up past 1.05.

**How to generate.** Paste one clip at a time. Name each export with the file name in the table (`05-walk.mp3`). Leave about half a second of silence at the start and end of each clip, so the edit can breathe. Numbers are written as words so the voice does not guess how to say them. "V2Stack" is written the way your Kurae video wrote it; if the voice says it oddly, spell it "V two Stack" in that clip only.

**Mark the audio as synthetic.** YouTube asks, when you upload, whether the video contains realistic altered or synthetic content. Answer yes for the cloned voice, and say it in the description (the line is in `VIDEO_PLAN.md`).

## The numbers in the script (all checked)

| Where | Figure | Source |
| --- | --- | --- |
| Hook | $989 a month and $38,601 at 36 months; $491 a month and $44,246 at 84 months; $5,645 more in total | Read off the live home page slider on 15 November 2026 |
| Walk | $30,000, 7% tax, 7.5% for 60 months, $2,000 down: $32,100 out the door, $603 a month, $38,189 in total, $6,089 interest, 16 in 100 | Live Walk on 15 November, and a hand calculation ($30,100 financed) |
| Desk | 60 months $603 a month; 84 months $462 a month ($141 less); $40,781 in total, $2,593 more | Hand calculation, and read off the live Desk screen on 15 November |
| Redesign | 20 kinds of component, 237 screenshots | `docs/research/COMPONENT_RESEARCH.md` and the `shots` folder |
| Checks | 293 tests pass (one skipped) | `npx vitest run` on 15 November |
| AI limit | 20 free AI uses a day for each visitor | The live site's own counter ("20 of 20") |

## Say what you really changed (clip 15)

Clip 15 describes two dashboard problems I found: `MODEL_VISION` was set to the display name "Haiku 5.5" (a model name looks like `anthropic/claude-haiku-5.5`), and the site-address variable was spelled `EXT_PUBLIC_SITE_URL` (it must be `NEXT_PUBLIC_SITE_URL`), which left the live pages pointing at localhost. I did not see the exact reason the AI fell back, which is why the clip says "I couldn't see the exact error". Read the clip once and change it so it matches what you changed in Vercel.

## Timeline (targets, to hit 10:46)

| Clip | File | Starts | Screen time | Voice time | Words | Part |
| --- | --- | --- | --- | --- | --- | --- |
| c01 | `01-hook` | 0:00 | 38 s | 38 s | 95 | 1 The trick (A-roll) |
| c02 | `02-start-card` | 0:38 | 7 s | 6 s | 16 | Start card (Card) |
| c03 | `03-v2stack-and-the-rule` | 0:45 | 58 s | 54 s | 134 | 2 V2Stack (A-roll) |
| c04 | `04-transition-1` | 1:43 | 4.2 s | 4 s | 9 | To chapter 3 (Card) |
| c05 | `05-walk` | 1:47 | 160 s | 112 s | 280 | 3 A real quote (Screen) |
| c06 | `06-transition-2` | 4:27 | 4.2 s | 4 s | 9 | To chapter 4 (Card) |
| c07 | `07-desk` | 4:31 | 50 s | 47 s | 117 | 4 The Desk (Screen) |
| c08 | `08-transition-3` | 5:21 | 4.2 s | 4 s | 9 | To chapter 5 (Card) |
| c09 | `09-ai-and-the-guard` | 5:25 | 72 s | 54 s | 134 | 5 The AI (Screen + terminal) |
| c10 | `10-transition-4` | 6:37 | 4.2 s | 4 s | 9 | To chapter 6 (Card) |
| c11 | `11-learn-and-spanish` | 6:41 | 52 s | 50 s | 125 | 6 Words and Spanish (Screen) |
| c12 | `12-transition-5` | 7:33 | 4.2 s | 2 s | 5 | To chapter 7 (Card) |
| c13 | `13-redesign` | 7:37 | 58 s | 52 s | 131 | 7 The redesign (Screen) |
| c14 | `14-transition-6` | 8:36 | 4.2 s | 4 s | 9 | To chapter 8 (Card) |
| c15 | `15-how-i-checked-it` | 8:40 | 66 s | 64 s | 159 | 8 How I checked it (Terminal + screen) |
| c16 | `16-transition-7` | 9:42 | 4.2 s | 3 s | 8 | To chapter 9 (Card) |
| c17 | `17-not-done-and-close` | 9:46 | 34 s | 34 s | 84 | 9 What's left (Screen) |
| c18 | `18-shelf-card` | 10:20 | 8 s | 6 s | 15 | Shelf card (Card) |
| c19 | `19-end-card` | 10:28 | 18 s | 12 s | 31 | End card (Card) |

Total 10:46, which leaves about 73 seconds under the 12-minute cap for a slow take or a longer pause. Cards are 7 s (start), 4.2 s each (seven transitions), 8 s (shelf) and 18 s (end): 62 s in all.

## The clips

### c01. 1 The trick  `01-hook.mp3`

On screen: Landing page. Drag the Loan length slider from 36 to 84 months. Vee points at the payment, then the total.

About 95 words, 38 s of voice, 38 s on screen.

A car dealer asks you one question: what monthly payment would you be comfortable with? That question is the whole trick. Because a dealer can lower your payment just by making the loan longer. Watch. Thirty six months: nine hundred and eighty nine dollars a month. Eighty four months: four hundred and ninety one. The payment is cut in half. Now look at the total. You pay five thousand, six hundred and forty five dollars more. A lower payment that costs you more. I built a free tool that shows you that before you sign.

### c02. Start card  `02-start-card.mp3`

On screen: The start card (kit: ?card=start).

About 16 words, 6 s of voice, 7 s on screen.

This is number six in V2Stack, where I build and ship one real product every week.

### c03. 2 V2Stack  `03-v2stack-and-the-rule.mp3`

On screen: Stay on carbuying: the home page scrolled slowly to the footer line "Deal Desk is a v2stack project", then the About page, the "One rule" section. No v2stack.com pages.

About 134 words, 54 s of voice, 58 s on screen.

If you're new here: V2Stack is where I build and ship one real product every week. Not a demo. The actual thing, live. Number one, Tactly, for overdue invoices. Number two, Verdict, a resume roast. Three, Compass, student visa status. Four, AgentFoundry, a chatbot builder. And five, Kurae, notes that file themselves. Look across them and there's a pattern. Every one uses AI, and every one is built so the AI can't invent things. Deal Desk is the strictest version of that idea. The calculator makes every number. The AI only reads your deal, explains a word, or helps you practise. And a guard checks every figure the AI writes. If a number isn't in your deal, the whole answer is thrown away. No account. Your numbers stay on your device. And it's free.

### c04. To chapter 3  `04-transition-1.mp3`

On screen: Transition card t1.

About 9 words, 4 s of voice, 4.2 s on screen.

First, a real quote. One question at a time.

### c05. 3 A real quote  `05-walk.mp3`

On screen: /deal, I have a quote. Type 30,000, 7% tax, no extras, 60 months at 7.5%, no trade-in, 2,000 down. Show Your deal, then Show these figures as a table, then Things to check.

About 280 words, 112 s of voice, 160 s on screen.

I open the calculator and pick: I have a quote. It takes six steps, one at a time, and every word is explained where it appears. Step one: where are you starting? A monthly payment, or a price. I'll start from the price. Step two: what is the full price to drive away? Thirty thousand dollars, with seven percent sales tax. The out the door price is thirty two thousand, one hundred dollars. The bar shows the car, and the tax on top. Step three: what extras did they add? Service contracts, window etching. I have none, and it says so: nothing to question here. Step four: how long is the loan, and what is the rate? Sixty months, at seven point five percent. Each block is one month, and the interest shows in red. Step five: what about your trade in and down payment? No trade in, but two thousand dollars down. And here is the deal. I'd pay thirty eight thousand, one hundred and eighty nine dollars in total. Thirty thousand of that is the car. The other eight thousand, one hundred and eighty nine is tax and interest. Six hundred and three dollars a month, for sixty months. About twenty dollars a day. And this ring says sixteen in every hundred dollars I pay is interest. I checked it by hand, because that's the point. Thirty thousand, one hundred dollars financed, at seven point five percent, over sixty months, is six hundred and three a month. It matches. Open the details and you can see how fast you pay it off. Of the first payment, a hundred and eighty eight dollars is interest. Of the last, under four dollars. Then the things worth checking, each one from a fixed rule.

### c06. To chapter 4  `06-transition-2.mp3`

On screen: Transition card t2.

About 9 words, 4 s of voice, 4.2 s on screen.

Now the Desk, for when the numbers keep changing.

### c07. 4 The Desk  `07-desk.mp3`

On screen: Desk. Offer 1 is the 60-month quote. Offer 2 is the same car at 84 months. Show the payment falling and the total rising.

About 117 words, 47 s of voice, 50 s on screen.

Now the Desk. This is for when you're sitting in the chair and the numbers keep moving. Offer one is the first quote: sixty months. Offer two is what they come back with: the same car, but eighty four months. And there it is. The payment goes down, from six hundred and three to four hundred and sixty two dollars a month. And the total goes up, by about twenty six hundred dollars. The screen says it in plain words: the monthly payment is lower, but you pay more in total. That's the move I wanted you to see coming. Deal Desk moves one box at a time, and shows what each change did to the total.

### c08. To chapter 5  `08-transition-3.mp3`

On screen: Transition card t3.

About 9 words, 4 s of voice, 4.2 s on screen.

Next, the AI, and the rule it can't break.

### c09. 5 The AI  `09-ai-and-the-guard.mp3`

On screen: Ask about this deal, tap What should I look at first. Show the underlined figures and the Written by an AI line. Then the terminal: the guard test.

About 134 words, 54 s of voice, 72 s on screen.

Ask about this deal. I tap, what should I look at first. The answer uses only my own figures, and each one is underlined so I can find it on the page. It also says, in writing, that an AI wrote it. Here is the proof that this is more than a promise. This test gives the guard an answer with a number the AI made up, and checks that it's thrown away. It is. The same rule covers every AI feature: explaining a word, drafting a question for the dealer, even the practice conversation. The AI also has a daily free limit for each visitor, so this isn't an open tap. And when it runs out, or can't answer, you don't get an error. You get the plain version, written by the calculator.

### c10. To chapter 6  `10-transition-4.mp3`

On screen: Transition card t4.

About 9 words, 4 s of voice, 4.2 s on screen.

Car buying has its own language. Let's learn it.

### c11. 6 Words and Spanish  `11-learn-and-spanish.mp3`

On screen: /learn: six lessons, the open word list, search, the decoder. Then ES on the calculator, and the Spanish home page.

About 125 words, 50 s of voice, 52 s on screen.

There's a Learn page. Six short lessons, and about a hundred words, each in plain language, tied to something from everyday life, with a question you can ask the dealer. There's a search, and a decoder where you paste what the dealer wrote and it points out the words. It also works in Spanish. One tap, and the calculator changes language in place. The home page, how it works and the legal pages are written in Spanish too. And I want to be honest about this: the Spanish is a beta. A model translated it, a second model translated it back so I could compare, and I fixed what that found. But no native speaker has reviewed it yet, and every Spanish page says so.

### c12. To chapter 7  `12-transition-5.mp3`

On screen: Transition card t5.

About 5 words, 2 s of voice, 4.2 s on screen.

Now the redesign, with proof.

### c13. 7 The redesign  `13-redesign.mp3`

On screen: The animation card (kit: ?card=redesign). No research footage: the card shows the 20 kinds, the 237 screenshots and the quiet changes. Then a short before and after if you have one.

About 131 words, 52 s of voice, 58 s on screen.

A few days ago I looked at this and thought it was cramped. So for every kind of component, buttons, tabs, tables, charts, accordions, search fields, I opened at least ten real examples on real design sites and wrote down what they did. Twenty kinds. Two hundred and thirty seven screenshots. All saved in the project, so you can check my work. The real cause of the cramped feel wasn't decoration. It was text that was too small, and layouts squeezed by screen height. After that the changes were quiet. The four header controls became one soft group. Lists use thin lines instead of boxes around everything. And I left out the things I saw everywhere and didn't trust: glowing buttons, award badges, centred heroes with stars. Here's before, and after.

### c14. To chapter 8  `14-transition-6.mp3`

On screen: Transition card t6.

About 9 words, 4 s of voice, 4.2 s on screen.

How do I know it works? I tested it.

### c15. 8 How I checked it  `15-how-i-checked-it.mp3`

On screen: The animation card (kit: ?card=checks). No terminal or Vercel footage: the card shows the tests, the live-site problems and "deployed through Vercel".

About 159 words, 64 s of voice, 66 s on screen.

Two hundred and ninety three automated tests pass. An automated accessibility scan found no violations on the main pages of my local build. When I push to GitHub, Vercel deploys the site. Then I opened the live version and used it, which is how I found what the tests couldn't. The Desk showed a dash when only the first offer was filled in. And the AI answers on the live site were quietly falling back to plain text. Two settings in my Vercel dashboard were wrong: a model written as Haiku five point five, which is a display name and not a model name, and a site address setting with a letter missing, so the live pages pointed at localhost. I couldn't see the exact error, so I added a log line for it, and I made the code ignore a bad model value instead of breaking. That's why I test the real site, and not just the code.

### c16. To chapter 9  `16-transition-7.mp3`

On screen: Transition card t7.

About 8 words, 3 s of voice, 4.2 s on screen.

And now, number six goes on the shelf.

### c17. 9 What's left  `17-not-done-and-close.mp3`

On screen: The About page's "Built and planned" section: what works today, then the "Not here yet" list (a video guide, a native Spanish review). Then the live link.

About 84 words, 34 s of voice, 34 s on screen.

So what's not done. A native speaker hasn't reviewed the Spanish. I haven't tested with a screen reader. And reading a photo of a dealer's worksheet is in there, but that gets its own video. The tool is free, there's no account, and the link is in the description. If you're buying a car this year, put your real quote through it before you sign. And if a dealer has used a number on you that I didn't cover, tell me in the comments.

### c18. Shelf card  `18-shelf-card.mp3`

On screen: The shelf card (kit: ?card=shelf).

About 15 words, 6 s of voice, 8 s on screen.

Five products shipped, each live, each with a walkthrough here. Deal Desk is number six.

### c19. End card  `19-end-card.mp3`

On screen: The end card (kit: ?card=end). Leave the slots empty for YouTube's end-screen elements.

About 31 words, 12 s of voice, 18 s on screen.

That was number six in V2Stack, where one real product ships every week. Subscribe to follow along, and if you want one built for your business, the email is on screen.

## After you have the audio

1. Drop every clip on its own track in the edit, in the order of the table.
2. Check each clip against its screen time. A clip longer than its screen time means the screen needs a freeze frame or a slower cursor, not a faster voice.
3. Add the cards from the kit (see `kit/README.md`) at the times in the table.
4. Re-export the chapter timestamps for the description from the final edit.
