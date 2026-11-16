# Add Deal Desk to v2stack.com as project No. 6

A reference for a session that edits the v2stack.com site. It holds every fact, the data entry in the same shape as the other projects, the assets, the site lines that change, and what may not be claimed. Written 15 November 2026 from the Deal Desk repo, the live site and the finished video.

How to use it: paste the "Task" section to the implementing session, then give it this file and `~/Downloads/v2stack-showcase-assets/` (the showcase brief, `projects.ts` and the other products' images).

Rules that carry over from the showcase brief: a field we do not have is `null` and the UI shows a deliberate state for it (never a dead link, never an invented URL); nothing is claimed that is not in this file; ask the owner when unsure.

## Task (paste this)

> Add Deal Desk as project No. 6 on v2stack.com. The site code is in the v2stack.com repo. Use `docs/V2STACK_ADD_PROJECT.md` from the Deal Desk repo as the only source of facts. Extend `src/data/projects.ts` (slug union, `order` union, `CHANNEL` unchanged), add the Deal Desk entry from section 2, copy the images from section 4 into `public/projects/`, make the site-wide changes in section 5, run the acceptance checklist in section 7, and look at every changed page at desktop and phone width before saying done. The video is not published yet: render the disabled "Video coming soon" state, not a link.

## 1. At a glance

| | |
| --- | --- |
| Product | Deal Desk, a free car-deal calculator |
| Order | No. 6 (after Tactly, Verdict, Compass, AgentFoundry, Kurae) |
| Live | https://carbuying.v2stack.com |
| Shipped | 2026-11 |
| Repo | https://github.com/Spearwarvj-creator/carbuying (private; `repoUrl` is `null`) |
| One-line idea | A lower payment can still cost you more |
| Core rule | The calculator makes every number. The AI only explains, and a guard throws away any figure it writes that is not in the deal. |
| Video | Finished, 10:17, not yet on YouTube. Channel: https://www.youtube.com/@v2_stack |
| Video title (planned) | A lower car payment can still cost you more. I built a free tool that shows it. (V2Stack No. 6) |

## 2. The data entry (same shape as `projects.ts`)

Before adding it, widen the types: `slug` gets `'deal-desk'`, `order` becomes `1 | 2 | 3 | 4 | 5 | 6`. Check whether Kurae (No. 5) is already in the file; if it is, place Deal Desk after it, and if it is not, ask the owner before inventing Kurae's entry.

```ts
{
  slug: 'deal-desk',
  order: 6,
  name: 'Deal Desk',
  tagline: 'A lower payment can still cost you more',
  summary:
    'A car-deal calculator that shows what each change does to the total, one box at a time. The calculator makes every number; the AI only explains them, and a guard throws away any figure that is not in your deal.',
  audience: 'People buying a car, especially first-time and nervous buyers',
  moneyStory: null, // the owner has not supplied a competitor price; do not invent one
  highlights: [
    'A six-question Walk from the dealer\'s quote to your total, and a Desk that puts two offers side by side',
    'Shows what each change did to the total: on the home page, 36 months is $989 a month and $38,601 in total, 84 months is $491 and $44,246, which is $5,645 more',
    '"Ask about this deal": AI answers that use only figures from your deal, underlined on the page and marked as written by an AI',
    'A Learn hub with about 100 plain-language words and six short lessons, and a decoder for what the dealer wrote',
    '293 automated tests, including one that checks the guard throws away an invented number',
  ],
  differentiator:
    'The calculator makes every number. The AI can read, explain and draft, but it cannot change a figure, and a guard throws away any answer that contains one that is not in your deal.',
  freeTier: 'Free. No account. Your numbers stay on your device. 20 free AI uses a day for each visitor; when they run out you get plain sentences written by the calculator.',
  stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Zustand', 'Zod', 'Three.js', 'Motion', 'Radix UI', 'Vitest', 'OpenRouter (Claude Haiku 5.5)', 'Upstash Redis', 'Vercel'],
  status: 'live',
  statusLabel: 'Free',
  shipped: '2026-11',
  liveUrl: 'https://carbuying.v2stack.com',
  repoUrl: null,
  video: null, // fill in after publishing: { url, title, published: 'YYYY-MM-DD', length: '10:17' }
  shorts: [],
  ogImage: 'https://carbuying.v2stack.com/opengraph-image',
  images: { hero: '/projects/deal-desk-hero-desktop.png', heroMobile: '/projects/deal-desk-hero-mobile.png', og: '/projects/deal-desk-og.png' },
  identity: {
    mood: 'Night glass: a deep blue-green dark ground with one yellow reserved for the total, a pixel hover-car mascot called Vee in the videos',
    background: '#0E1A1F',
    accent: '#F5C400',
    text: 'light',
    fonts: 'Atkinson Hyperlegible Next (text), Sofia Sans Extra Condensed (numbers)',
  },
  notClaimed: [
    'Not financial or legal advice; it gives estimates from the numbers you enter',
    'The AI cannot change a number; if it cannot answer, you see plain sentences from the calculator',
    'The Spanish is a beta: a model translated it and a second model translated it back to compare, no native speaker has reviewed it yet',
    'Not tested with a screen reader, only automated accessibility checks',
    'Photo reading of worksheets has only been tried on generated examples, not real ones',
    'No price comparison with other tools',
  ],
},
```

Two lines in that entry need the owner's confirmation before they go live, and each depends on a setting in the Vercel project (Settings, Environment Variables), which the repo does not show:
- **AI model:** the stack line says Claude Haiku 5.5 because that is the app's default. If the Vercel model settings (`MODEL_*`) name another model, change the line. The video says "an AI", not a model name.
- **Status chip:** "Free" is used because the site is free and has no account. "Free, in beta" is also fair if the owner prefers it.

## 3. Facts and where each was checked

| Claim | Source |
| --- | --- |
| 36 months $989 / $38,601; 84 months $491 / $44,246; +$5,645 | Home page slider, read from the live site and shown in the video |
| Walk example: $30,000 price, 7% tax, $32,100 out the door, $2,000 down, $30,100 borrowed, 60 months at 7.5%, $603 a month, $38,189 total, 16 in every 100 dollars is interest | The Walk on the live site, recorded 2026-11-15 |
| Desk example: 60 to 84 months, $603 to $462 a month, +$2,593, $40,781 total | The Desk on the live site |
| Guard test | `npx vitest run src/server/language.test.ts -t "invents a number"` gives 1 passed, 17 skipped |
| 293 automated tests | Test run on 2026-11-15 (the video quotes it) |
| 20 free AI uses a day per visitor | Shown in the Ask dialog on the live site |
| About 100 words and six lessons | Learn page on the live site |
| Spanish is a beta, no native review | Footer of every Spanish page, About page "Not here yet", `docs/ES_REVIEW_PROCESS.md` |
| The 3D car is a CC0 model by Kenney (kenney.nl) | Footer of the Deal Desk home page |

Re-check any number against the live site before it appears on v2stack.com, because the site may have changed since.

## 4. Images and files

| Needed | Where it is | Notes |
| --- | --- | --- |
| Share image (1200x630) | `https://carbuying.v2stack.com/opengraph-image` (returns a PNG) | Save it as `public/projects/deal-desk-og.png` |
| Desktop hero | Not made yet | Screenshot the live home page at 1440 wide, like the other products' `-hero-desktop.png` |
| Mobile hero | Not made yet | Same page at about 390 wide |
| Video thumbnail | `docs/v2stack-assets/deal-desk-thumbnail.png` in the Deal Desk repo (source: `docs/video/kit/thumbnail.html`) | Use it as the video card image once the video is live |
| Mascot Vee | `docs/video/kit/vee.js` | Only for video-style visuals; the live site shows Vee on its home page too |
| Brand files for v2stack | `~/Downloads/v2stack-showcase-assets/v2stack-icon.svg`, `v2stack-logo-on-dark.svg`, `v2stack-mark-cream.svg` | Already on the Mac |
| Card style | Terracotta `#C44D2D`, cream `#F5F3EF`, warm dark `#171412` belong to v2stack; Deal Desk keeps its own identity colours above on its card | |

## 5. Site lines that change when No. 6 goes live

Read from https://v2stack.com on 15 November 2026. Find the current wording first, because it may have moved on.

| Where | Now | Change to |
| --- | --- | --- |
| Home hero | "Five shipped so far, each with a walkthrough on YouTube." | "Six shipped so far..." (only once the video is live) |
| Home hero button | "Try the latest build (Kurae)" | "Try the latest build (Deal Desk)" |
| Home product scroller | "Scroll through the five builds", five numbered tabs | six, with No. 6 Deal Desk |
| `/projects` heading | "Five projects, shipped one at a time." | "Six projects, shipped one at a time." |
| `/projects` cards | Kurae's "Watch the build" has no length | add Kurae's length if the owner gives it; Deal Desk shows "Video coming soon" until published |
| Any list of the products in metadata, sitemap or share text | five names | add Deal Desk |

The home page's "690 free tools in 15 suites" line is separate and does not change.

## 6. After the video is published

Fill these in and republish the site:
1. `video` becomes `{ url, title, published, length }`. Length is 10:17 if YouTube agrees.
2. Replace the disabled "Video coming soon" button with a "Watch the build" link, with the length shown as on the other cards.
3. Change the hero and heading wording from "Five" to "Six" if it was held back.
4. Description, chapters and tags for the video are in `docs/video/YOUTUBE_METADATA.md`.

The video, for reference: 10:17, chapters at 0:00 hook, 0:47 What V2Stack is, 1:58 Walking through the calculator, 4:14 The Desk, 5:08 Asking the AI and the guard test, 6:10 Learn and Spanish, 7:05 The redesign, 8:07 How I checked it, 9:16 What is not done yet, 9:51 Next on the shelf and sign off. Narrated with the owner's ElevenLabs voice clone, so YouTube's altered or synthetic content question is answered yes.

## 7. Acceptance checklist

- [ ] `projects.ts` compiles with the widened types, and no page assumes four or five projects
- [ ] The Deal Desk card shows name, tagline, summary, audience, highlights, free tier, stack, status chip and shipped month
- [ ] The live link opens https://carbuying.v2stack.com
- [ ] The video area shows the disabled "Video coming soon" state, not a link
- [ ] "What it is not" (`notClaimed`) is visible somewhere on the card or the project section, as it is for the other products
- [ ] Images load at desktop and phone width, with alt text
- [ ] Every "Five" that counts products now reads "Six" (only after the video is live, otherwise ask the owner)
- [ ] Kenney credit is not needed on v2stack.com (the Deal Desk site credits it), but do not use the 3D car as a v2stack image without keeping that credit
- [ ] No claim appears that is not in section 2 or 3
- [ ] Looked at the home page, `/projects` and the Deal Desk section at 1440 and 390 wide

## 8. Open items only the owner can settle

1. The AI model name in the stack line (see section 2).
2. The status wording: "Free" or "Free, in beta".
3. Whether to publish the "Six shipped" wording before or after the video is live.
4. Kurae's video length, if its card is meant to show one.
5. A public contact email for the showcase (`CHANNEL.contactEmail` is `null` in `projects.ts`). The video's end card shows an email; do not copy it to the site unless the owner says so.
6. Whether the Desk's big "$—" total, seen when only Offer 1 is filled in, still happens on the live site. The video's checks chapter says it was found; confirm before any text says it was fixed.

## 9. Where more detail lives (only if needed)

All in the Deal Desk repo: `README.md`, `docs/AI_FEATURES.md` (what the AI does and the guard), `docs/SPANISH_SITE.md` and `docs/ES_REVIEW_PROCESS.md` (the Spanish beta), `docs/DESIGN_NOTES.md` (colours and type), `docs/video/VIDEO_PLAN.md` and `docs/video/voice/beats.json` (the video script, one entry per voice beat).
