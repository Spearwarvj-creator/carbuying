# Deal Sheet

A static, single-page car-buying negotiation calculator. No backend, no API calls, no dependencies beyond a Google Fonts stylesheet — everything runs client-side in the browser.

## What it does

- Computes discount $/% off MSRP, out-the-door price, financed amount, monthly payment, and total interest, live as you type.
- Includes preset buttons for a three-stage negotiation strategy (opener / fallback / ceiling).
- Reverse-calculates a dealer's quoted monthly payment back into an implied vehicle price, so you can check it against your own target on the spot.
- Generates a copy-pasteable "counter script" using your live numbers.

## Local preview

No build step required. Open `index.html` directly in a browser, or serve it locally:

```bash
npx serve .
```

## Deploy to Vercel

This is a static site, so Vercel needs no build command or framework preset.

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

None. This project makes no network requests beyond loading the Google Fonts stylesheet (`fonts.googleapis.com`, `fonts.gstatic.com`), and does not read, store, or transmit any data you enter — all math happens in-browser and nothing persists after you close the tab.

If you later want to add persistence (saving a deal across visits) or pull live data (e.g. real-time interest rates), that would introduce a genuine need for a backend or API key at that point — not before.

## Files

```
deal-sheet-calculator/
├── index.html      the entire app
├── vercel.json      minimal static config
├── .gitignore
└── README.md
```
