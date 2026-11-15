# The Spanish half of the site

What exists, how it is put together, and how to add to it. Written 14 November 2026.

## What is in Spanish

| Where | Address | How it is in Spanish |
| --- | --- | --- |
| Home | `/es` | Written out on the server, so the page is Spanish from the first byte |
| How it works | `/es/how-it-works` | Same |
| About | `/es/about` | Same |
| Privacy, Terms, Accessibility | `/es/privacy`, `/es/terms`, `/es/accessibility` | Same, with a line saying it is a convenience translation in beta and the English governs |
| Calculator | `/deal` | Changes language in place; the choice is saved on the device |
| Learn | `/learn` | Same; about 100 words, six lessons, the decoder |
| Not found, error | `/es/...` inside the Spanish site | Spanish; an address that matches nothing shows one page in both languages |

The calculator and Learn are not duplicated under `/es`. They are client apps that read their words from a language store, so one address serves both languages and the choice survives a reload. Their `<html lang>` follows the choice (set in `src/lib/i18n.ts`).

## How it is built

- **Two root layouts.** `src/app/(en)/layout.tsx` and `src/app/es/layout.tsx` each render `RootShell` (`src/components/site/RootShell.tsx`) with `lang="en"` or `lang="es"`. That is what gives screen readers the right voice and search engines the right language. Moving between the two is a full page load, which is expected.
- **One set of page bodies.** `HomePage`, `AboutPage` and `HowPage` live in `src/components/site/pages/` and take a `locale`. The route files are a few lines each.
- **Words.** English is `src/data/strings/site.ts`. Spanish is `src/data/strings/site-es.ts`, typed as the same shape (`SiteCopy`), so a missing string is a compile error.
- **Frame.** `SitePage`, `DocPage`, `InfoPage`, `SiteHeader`, `SiteFooter` and `SiteMenu` take `locale` and `path` and build links with `localePath()` (`src/lib/site-locale.ts`). `SPANISH_PAGES` in that file is the list of pages that have a Spanish twin; every other path stays where it is.
- **Language link.** `LangLink` is the "Español / English" link in the header and menu. It saves the choice, then goes to the twin page (or stays on the same page for the calculator and Learn, which change in place).
- **Shared pieces inside Spanish pages** (the pictures, the preference buttons) read their words from the language store. `LocaleSync` puts the store in Spanish when a `/es` page opens, which also saves Spanish as the choice, so the calculator opens in Spanish. The pictures subscribe to the store, so they draw again in Spanish. For a moment after load these small labels are English; the page text itself never is.
- **Search engines.** Each page sets a canonical address and `hreflang` pairs (`alternates()` in `src/lib/site-locale.ts`); `src/app/sitemap.ts` lists both addresses of each pair with their alternates.
- **404.** With two root layouts there is no one layout to build a 404 from, so `src/app/global-not-found.tsx` brings its own document and says it in both languages. It needs `experimental.globalNotFound` in `next.config.ts`. That flag is marked experimental in the Next docs; if it changes in a later version, `docs/` for the version in `node_modules/next/dist/docs/` is the place to check.

## Adding a Spanish page

1. Put the body in `src/components/site/pages/` taking `locale`, or write the Spanish page directly under `src/app/es/` if it is a document.
2. Add the strings to `site.ts` and `site-es.ts` (or write the Spanish JSX).
3. Add the path to `SPANISH_PAGES` and to the list in `src/app/sitemap.ts`.
4. Give the page `alternates("es", path)` and the English page `alternates("en", path)`.
5. Run `npx vitest run`, build, open the page at 320 and 1440 pixels, and run the axe audit.
6. Add the file to the reviewer's packet (`docs/ES_REVIEW_PROCESS.md`).

## Not done

- A native speaker has not reviewed any of the Spanish. The legal pages say so; the Learn page shows a beta note in Spanish.
- The offline page and the service worker's cached fallback are English.
- The social share image is English.
- No screen reader test has been done on the Spanish pages.
