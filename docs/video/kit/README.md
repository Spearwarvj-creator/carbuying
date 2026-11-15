# Deal Desk video kit

The cards, the thumbnail and the mascot for the Deal Desk video (V2Stack No. 6). Plain HTML, CSS and JavaScript. No build step, nothing is installed, and none of it is part of the website.

## Run it

```bash
cd /Users/vijaychilaka/Downloads/startup-ideas/deal-desk/docs/video/kit
python3 serve.py
```

Then open http://localhost:8765/index.html (the panel with every card), and press a card's Play button or its number key.

## The files

| File | What it is |
| --- | --- |
| `serve.py` | A tiny local server that never caches (use this, not a plain file open or a caching server, so edits always show) |
| `index.html`, `kit.css`, `cards.js` | The 1920 x 1080 stage and the cards: start, seven transitions (`t1` to `t7`), the shelf, the end, and two voice-over animation cards (`redesign`, `checks`) that stand in for screen footage |
| `vee.js` | Vee, the mascot (and a pixel font, speech bubbles, a pointer ring, headlight beams, sparkles and a stamp). Readable source |
| `vee.min.js` | The same, minified (about 20 KB). This is the file you paste into a page's console |
| `sticker.html` | One Vee on a flat colour, to key over footage Vee cannot be injected into (the terminal) |
| `thumbnail.html` | The 1280 x 720 thumbnail, in the style of the Kurae one |
| `sheet.html` | Every Vee mood side by side |
| `assets/` | Your V2Stack logo files (copied from `v2stack-showcase-assets`) |
| `fonts/` | Silkscreen (pixel), Atkinson Hyperlegible Next, Sofia Sans Extra Condensed |

## Playing one card for recording

`index.html?card=<id>&clean=1`

| Parameter | Does |
| --- | --- |
| `card` | `start`, `t1` to `t7`, `shelf`, `end`, and the two animation cards `redesign` (56 s, for clip 13) and `checks` (66 s, for clip 15) |
| `clean=1` | Hides the panel; the stage fills the window (press F for full screen) |
| `noend=1` | Keeps the finished card on screen instead of wiping it away. Handy for a still frame |
| `guides=1` | Shows dashed boxes where YouTube's end-screen elements will go (end card) |

Record each card as its own clip, full screen at 1920 x 1080. Keys: `R` replays, `F` full screen, `1` to `9` plays that card. The browser tab must be visible while recording; a hidden tab slows its animations.

Card lengths: start 7 s, transitions 4.2 s, shelf 8 s, end 18 s, redesign 56 s, checks 66 s. Each card opens with a pixel wipe revealing it and closes with a wipe covering it, in V2Stack terracotta. Cut your footage underneath the wipe so it looks planned.

## Vee on a live page

1. Copy all of `vee.min.js`.
2. In the browser console on the page (type `allow pasting` first if Chrome asks), paste it and press Enter.
3. `const v = Vee.overlay()`

Calls:

| Call | Does |
| --- | --- |
| `v.goTo({text:"$603"},{side:"right",point:true})` | Flies next to the element that contains that text; `point:true` also looks at it, beams its headlights and draws a dashed ring. `side` is `left`, `right`, `above`, `below` or `auto`. Also accepts a CSS selector string, an element, or `{x,y,w,h}` |
| `v.say("603 A MONTH")` | Speech bubble in the pixel font (capitals, digits and `$ , . ! ? : ' - + = % / ( ) > < * ~`). `v.say("")` clears it. Options: `{ms:3000, side:"left", cps:38}` |
| `v.mood("happy", 2000)` | `idle`, `happy`, `wow`, `think`, `oops`, `sleepy`, `wink`, `focus`. The second number is how long, in ms |
| `v.celebrate()`, `v.wow()`, `v.oops()`, `v.think(3000)` | A mood plus a hop and particles |
| `v.hop()`, `v.sparkle(x,y,n)`, `v.puff(x,y,"~",Vee.PAL.teal,5)` | Small effects. `~` is a check mark |
| `v.stamp("THROWN AWAY")` | A big pixel stamp in the middle of the screen |
| `v.ring({text:"$603"}, 2000)`, `v.beamTo(...)` | The ring or the beam on its own |
| `v.lookAt(x,y,ms)` | Eyes toward a point. By default the eyes follow your pointer |
| `v.moveTo(x,y)`, `v.exit("right")`, `v.enter("left")` | Plain movement |
| `v.destroy()` | Removes Vee from the page |

Vee is drawn on a canvas that ignores the mouse, so it never blocks a click. Its size follows the screen (about 6 screen pixels per art pixel at 1920 wide).

## Where the numbers on the cards come from

| Card | Figure | Source |
| --- | --- | --- |
| t1 | $603 a month, $6,089 interest | Live Walk and a hand calculation (30,100 financed, 7.5%, 60 months) |
| t2 | $603 to $462 a month, +$2,593 in total | Hand calculation, same loan at 84 months. Confirm on the Desk |
| t4 | About 100 words, 6 lessons, English and Spanish | Learn hub |
| t5 | 20 kinds of component, 237 screenshots | `docs/research` |
| t6 | 293 tests passing | `npx vitest run` |
| shelf | Product names and ship months | https://v2stack.com/projects, read 15 November 2026 |
| t1, t2, t3, t4, t5, t6 "From the shelf" | A fact about an earlier V2Stack product | The same page. If a product's page changes, update the line in `cards.js` |

## Changing a card

Text and timing live in `cards.js` (the `TR` list holds the seven transitions). Colours and type are variables at the top of `kit.css`. Vee's look is in `vee.js` (the `PAL` palette and the sprite-drawing function); `sheet.html` shows the result at once. After editing `vee.js`, rebuild the minified file:

```bash
cd /Users/vijaychilaka/Downloads/startup-ideas/deal-desk
node -e "const e=require('esbuild');require('fs').writeFileSync('docs/video/kit/vee.min.js',e.transformSync(require('fs').readFileSync('docs/video/kit/vee.js','utf8'),{minify:true,target:'es2019',legalComments:'none'}).code)"
```

## Known limits

- Tested in the Claude app's built-in browser, which throttles animations; the cards were checked in their final states and as they played, but not recorded at 30 fps to a video file. Do a trial recording of one card first.
- The pixel font on the cards is Silkscreen, a close match for the one on your Kurae thumbnail, not a confirmed match. Change `--pixel` in `kit.css` if you have the original.
- The V2Stack logo is the file from your `v2stack-showcase-assets` folder. The channel avatar and banner were not available to me.
