# Deal Sheet

A static, multi-page car-buying negotiation calculator. No backend, no API calls, no third-party trackers or font CDNs — everything runs client-side in the browser, and all fonts are self-hosted.

## Pages

```
index.html            the app
privacy.html           Privacy Policy
terms.html              Terms of Service
accessibility.html     Accessibility Statement (WCAG 2.1 AA target)
assets/fonts/           self-hosted Oswald, IBM Plex Mono, and Inter (WOFF2)
```

## What it does

- Computes discount $/% off MSRP, out-the-door price, financed amount, monthly payment, and total interest, live as you type or drag a slider.
- Presets (opener/fallback/ceiling) scale automatically off whatever MSRP you enter — works for any vehicle, not just one example.
- Break-even calculator for "discount at a higher APR vs. your current rate" negotiations.
- Reverse-calculates a dealer's quoted monthly payment back into an implied vehicle price.
- Side-by-side desktop layout, stacked split-screen on mobile, with an always-visible running total.
- Generates a copy-pasteable negotiation script from your live numbers.

## Local preview

No build step required. Open `index.html` directly in a browser, or serve it locally:

```bash
npx serve .
```

## Deploy to Vercel

This is a static, multi-page site — Vercel needs no build command or framework preset.

1. Push this folder to a GitHub repo.
2. In Vercel, "Add New Project" → import the repo.
3. Framework preset: **Other** (or leave auto-detected as static).
4. Build command: none. Output directory: `.` (project root).
5. Deploy.

Or via CLI, from inside this folder:

```bash
npm i -g vercel
vercel
```

## API keys / secrets

None. This project makes no network requests to any third party at all — not even for fonts, which are bundled locally specifically to avoid the GDPR issue with Google's font CDN (it transmits visitor IP addresses to Google on every page load). Nothing you enter is transmitted, stored, or logged; all math happens in-browser.

## Files

```
deal-sheet-calculator/
├── index.html           the app
├── privacy.html          Privacy Policy
├── terms.html             Terms of Service
├── accessibility.html    Accessibility Statement
├── assets/fonts/          self-hosted font files (WOFF2)
├── vercel.json            minimal static config
├── .gitignore
└── README.md
```
