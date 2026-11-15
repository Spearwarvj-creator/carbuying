# Voiceover for ElevenLabs

About 1,350 spoken words, in first person, for the timeline in `VIDEO_PLAN.md`. Each block is one section. Paste one block at a time, listen, and regenerate only the block you want to change. Blocks marked "(screen only)" have no talking on purpose.

Numbers are written as words so the voice does not guess how to say them. Everything here was checked against the live site on 15 November 2026. Change a figure in the script only if you change it on screen too.

## Making the voice (your own voice only)

1. In ElevenLabs, open Voices, then Add a new voice, then Instant Voice Clone.
2. Record or upload one to three minutes of your own speaking: a quiet room, the microphone you will use every week, no music, no other voices, your normal pace. Read a few paragraphs of this script so the clone learns the words you will use.
3. Name it, tick the box that says you have the rights to the voice (it is yours), and create it.
4. Settings to start from, then adjust by ear: Stability around 40 to 50 so it sounds like talking and not reading, Similarity around 75, Style near 0, Speaker boost on. Pick the newest multilingual model offered in your account.
5. If it sounds flat on a line, regenerate that block once or twice; do not keep editing the words. If it mangles a word, respell it phonetically in the script (for example "Deal Desk" is fine; "APR" is better as "A P R").
6. Export each block as its own audio file, named by section number, so the edit lines up with the clips.

A Professional Voice Clone needs about half an hour of your recording and a verification step; it is worth doing only if the instant clone is not close enough after a few weeks.

Tell viewers the voice is generated from your own voice. YouTube asks you to mark realistic synthetic audio when you upload; answer yes.

## 1. Hook (0:00 to 0:35)

A dealer says: what monthly payment would make you comfortable? And that is the whole trick. Because I can lower your payment by making the loan longer. Watch. Thirty six months. Now eighty four. The payment drops by about a hundred and fifty dollars a month, and the total you pay climbs by almost three thousand. A lower payment that costs you more. I built a free tool that shows you that before you sign. This is Deal Desk, and in this video I will show you all of it, working, live.

## 2. The one rule (0:35 to 1:30)

Here is the rule I built it around. The calculator makes every number. The A I never does. If you use A I to talk about money, the risky moment is when it quietly invents a figure that sounds right. So in Deal Desk, the A I can read your deal, explain a word, or help you practise a conversation, but a guard checks every figure in what it writes. If a number is not in your deal, the whole answer is thrown away, and you see plain sentences from the calculator instead. That is the product. No account, your numbers stay on your device, and it is free.

## 3. Walk through a real quote (1:30 to 4:30)

I open the calculator, and I pick, I have a quote. Six steps, one at a time. Step one, where you start. I pick a price. Step two, the price. Thirty thousand dollars, with seven percent sales tax. The out the door price is thirty two thousand one hundred. It counts up, and the bar shows the car and the tax.

Step three, extras. A service contract, window etching, the things they add. I have none, and it tells me so, nothing to question here.

Step four, the loan. Sixty months, at seven point five percent. And now the total you would pay appears, thirty eight thousand five hundred and ninety three, with the interest shown as the red squares at the end.

Step five, the trade in and down payment. I put two thousand down.

And here is your deal. You would pay thirty eight thousand one hundred and eighty nine dollars in total. That is thirty thousand for the car and eight thousand one hundred and eighty nine for tax, interest and the rest. Six hundred and three dollars a month, for sixty months. About twenty dollars a day, every day. And a ring that says sixteen of every hundred dollars you pay is interest.

I checked this by hand, because that is the point. Thirty thousand one hundred financed at seven point five percent over sixty months is six hundred and three a month. It matches.

Under it, there is a chart, and if you cannot read charts, there is a button that shows the same figures as a table. Below that, things to check, each one from a fixed rule, and a checklist for before you sign.

## 4. The Desk (4:30 to 5:30)

Now the Desk. This is for when you are sitting in the chair and the numbers keep changing. Offer one is the first quote. Offer two is what they come back with. Same car, but now eighty four months. And there it is. The payment goes down, and the total goes up. The words on the screen say it plainly: the monthly payment went down, but you pay more in total. That is the move I wanted you to see coming.

## 5. The A I, and the guard (5:30 to 6:45)

Ask about this deal. I click, what should I look at first. The answer uses only my own figures, and they are underlined so I can find each one on the page. If a figure is not in my deal, the answer is dropped.

Here is the proof that this is not just a promise. This test feeds the guard an answer with a made up number in it, and checks it gets thrown away. It does.

And the A I has a daily free limit for each visitor, so I am not handing out an open tap. When it runs out or cannot answer, you do not get an error. You get the plain version, made by the calculator.

## 6. Learn the words, and Spanish (6:45 to 7:45)

Car buying has its own language. So there is a Learn page. Six short lessons, and about a hundred words, each one in plain language, tied to something from everyday life, with a question you can ask the dealer. There is a search, and a decoder where you paste what the dealer wrote and it points out the words.

And it is in Spanish. One tap on the calculator, and it changes language in place, and your choice is saved on the device. The home page, how it works, and the legal pages are written in Spanish too. I want to be honest about this. The Spanish is a beta. A model translated it, a second model translated it back so I could compare, and I fixed what that found. But no native speaker has reviewed it yet, and the site says so on every Spanish page.

## 7. The redesign, with proof (7:45 to 9:00)

A few days ago I looked at this and thought it was cramped, and it looked like every other A I site. So I did something I do not usually do. For every kind of component in the site, buttons, tabs, tables, charts, accordions, search fields, I opened at least ten real examples, on real design sites, and wrote down what they did. Twenty kinds, two hundred and thirty seven screenshots, all saved in the project, so you can check my work.

The root cause of the cramped feel was not decoration. It was a text size that was too small, and layouts squeezed by screen height. After that, the changes were quiet. The four header controls became one soft group. Lists use thin lines instead of boxes around everything. The hundred words are an open list, not a hundred cards. There is a fine grain over the dark background so it feels like a surface. And I left out the things I saw everywhere and did not trust: glowing buttons, award badges, centred heroes with stars.

Here is before, and here is after.

## 8. How I checked it (9:00 to 10:00)

Before recording block 8: the 404 cause is my best diagnosis (old project settings such as Framework Preset or Output Directory), not something I saw in your dashboard. Say in the video what you actually changed in Vercel, and edit the story below to match.

How do I know it works? Two hundred and eighty nine automated tests pass. An accessibility audit finds no violations on the main pages, in the dark and the light screen. I checked the pages at phone width, and nothing scrolls sideways. And I opened the live site and walked it myself, which is how I found two things that I am fixing: the A I answers on the live site were falling back to plain text, and the Desk showed a dash when only the first offer was filled in.

And one story, because it cost me an evening. After I deployed, the site showed a four oh four. The code was fine. The problem was in the Vercel project settings, not in the app. I corrected the settings, redeployed, and it came up.

## 9. What is not done, and next week (10:00 to 10:40)

So, what is not done. A native speaker has not reviewed the Spanish. I have not tested with a screen reader. And a few smaller things on the design list, like the pop up windows and some tooltips, are still on the list.

The tool is free, there is no account, and the link is in the description. If you buy a car this year, put your real quote through it before you sign. And if you have a number a dealer used on you that I did not cover, tell me in the comments. This is week six of one real product a week. See you next week.
