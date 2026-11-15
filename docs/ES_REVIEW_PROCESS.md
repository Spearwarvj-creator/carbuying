# Spanish review process

Deal Desk ships Spanish for people in the United States who have never bought a car. This file says how the Spanish is checked, what has been done, and what is still waiting on a person. It follows the shape of ISO 17100 (translate, revise, review by a second linguist, proofread, sign off) and the CFPB and FTC's own Spanish consumer pages for terms.

## Status, stated plainly

| Step | Who | Status |
| --- | --- | --- |
| 1. Translation | Language model, with a written glossary | Done |
| 2. Back-translation (Spanish to English, without seeing the original) | A model from a different maker (Gemini 2.5 Flash) | Done, 1,596 items |
| 3. Screening (original, Spanish and back-translation compared, scored 1 to 5) | Claude Haiku 5.5 | Done, 1,596 items |
| 4. Automated gates | `src/data/learn/es-quality.test.ts` | Pass (7 tests) |
| 5. Revision from screening | Engineering | Done for the clear problems; the rest goes to step 6 |
| 6. **Review by a native or professional bilingual reviewer** | **A person** | **Not done. Needed before Spanish is called finished.** |
| 7. Proofreading in the live app | The reviewer, on screen | Not done |
| 8. Sign-off | The reviewer, on the form below | Not done |

Steps 2 and 3 are screening. They find places where meaning may have drifted so the reviewer starts with the likely problems. A model cannot stand in for step 6: it does not know what a family in Houston, Miami or Chicago actually says at a dealership. Until step 8 is signed, the product describes its Spanish as a **beta** (see "Release gate").

Latest screening run (14 November 2026): 1,596 items, which now include the 100-word dictionary, the lessons, the calculator and its checks. Scores: 5 for 852, 4 for 615, 3 for 112, 2 for 17, 1 for 0. Many of the 3s and below are noise from the judge (for example, it marks the button that says "In English" as reversed, which is the point of that button, and it calls "cargo financiero" unfamiliar when it is the term the law uses). The CSV marks every item so the reviewer can tell.

## What the automated gates enforce

These run on every test run. They keep the slips a reviewer should not have to spend time on out of the text.

1. **One register.** Formal "usted" throughout. No "tú", "tienes", "puedes" and so on.
2. **No English left in sentences.** A short allow list covers deliberate English (out-the-door, trade-in, yo-yo, as-is, Deal Desk, the "In English" button).
3. **Questions open with ¿.**
4. **No dashes for pauses** (a house rule for all copy).
5. **Decimal point, not comma,** for percentages (United States usage).
6. **Preferred terms.** "Cofirmante" for co-signer and "tasa efectiva anual" for APR, as the CFPB writes them; "codeudor" only as an alternative in a heading.
7. **Same figures.** The dictionary tests check that the English and Spanish entries carry the same digits, and that every matching phrase is unique.

## How to run the review

1. Regenerate the packet if text has changed:

   ```bash
   ES_EXPORT=1 npx vitest run src/data/learn/es-export.test.ts
   node scripts/es-review.mjs
   ```

   The script reads `OPENROUTER_API_KEY` from `.env.local`, costs about ten cents, and writes `docs/es-review/review-packet.csv` and `docs/es-review/screen-findings.json`. It never writes the key anywhere.

2. Give the reviewer the CSV. Columns: `id`, `group`, `english`, `spanish`, `back_translation`, `screen_score`, `screen_issue`, then three empty columns for them: `reviewer_status` (ok, change, or discuss), `reviewer_comment`, `reviewer_fix`.

3. Ask the reviewer to work in this order. Lowest `screen_score` first, then the whole **Deal checks**, **Calculator Walk** and **Learn dictionary** groups (the words most likely to be read by someone who is deciding whether to sign), then the rest.

4. Apply every `reviewer_fix` in the data files (`src/data/strings/es.ts`, `src/data/learn/es-a.ts`, `es-b.ts`, `lessons.ts`, `ui.ts`, `mine.ts`), run `npx vitest run src/data`, and attach the new CSV to the sign-off.

5. The reviewer looks at the live app in Spanish on a phone and a laptop for text that is too long for its box, wrong line breaks, and anything a screen reader reads badly. Turn on Spanish with the language switch, or open `/es`.

## Who the reviewer should be

A person who is a native speaker of United States Spanish, fluent in English, and has either bought or financed a car in the United States, or works in consumer finance, a credit union, legal aid or a housing or consumer counselling office. A translator with ATA certification in Spanish is a good fit. Ask for one reviewer from a Mexican-heritage background and, if the budget allows, a second from a Caribbean or Central American background, since the words for car, loan and fee differ (carro, auto, coche; préstamo, financiamiento; cargo, cuota, tarifa).

## The Spanish pages

The home page, How it works, About, Privacy, Terms and Accessibility are written out in Spanish under `/es` (see `docs/SPANISH_SITE.md`). Their words are in `src/data/strings/site-es.ts` and in the three legal page files under `src/app/es/`. The legal pages carry a line saying they are a convenience translation, in beta, and that the English governs. Include `site-es.ts` and those three files in the reviewer's packet: they are not in the CSV, which covers the calculator and the Learn page.

## Questions the reviewer is asked to settle

These are open on purpose. The current choice is in bold.

- **Car.** "Auto" or "carro" or "coche"? Current: **auto**.
- **Trade-in.** Current: **auto de intercambio** (with "trade-in" in headings). Alternatives: "vehículo que entrega como parte de pago", "auto usado a cambio".
- **Desk (the tool's second view).** Current: **Escritorio**. Alternatives: "Mesa", "Mesa de negociación".
- **Rebates.** Current: **Reembolsos**. Alternatives: "Descuentos del fabricante", "Incentivos".
- **Payoff.** Current: **Monto para saldar el préstamo (payoff)**. Alternative: "Saldo de liquidación".
- **Negative equity.** Current: **Capital negativo (debe más de lo que vale)**.
- **Credit union.** Current: **cooperativa de crédito**. Alternative: "credit union" kept in English, which many readers use.
- **Recall.** Current: **retiro de seguridad (recall)**. Alternative: "llamado a revisión".
- **Money factor, residual, cap cost.** Spanish-language lease material is thin; confirm the reader will see something useful, or whether English should stay with an explanation.
- **Fees.** Current: **cargos**. Alternatives: "tarifas", "cuotas".
- **Down payment.** Current: **enganche (pago inicial)**. Confirm "enganche" is understood outside Mexico.

## Sign-off form

Copy into the repository as `docs/es-review/SIGNOFF.md` once complete.

```
Reviewer name:
Background (where Spanish was learned, car or finance experience):
Date:
Items reviewed (count and file):            of 1,596
Items changed:
Items I could not judge, and why:
Terms where I disagree with the glossary:
Screens read on a phone: yes / no     on a laptop: yes / no
I confirm the Spanish is clear for a first-time car buyer in the United States: yes / yes with the changes above / no
Signature:
```

## Release gate

- Before sign-off: the footer of every Spanish page says the Spanish is in beta while a native speaker reviews it (`footer.note` in `src/data/strings/site-es.ts`), the Spanish legal pages say it is a convenience translation and the English governs, and the Spanish Learn page shows a beta note (`beta` in `src/data/learn/ui.ts`). Do not remove these until the signed form exists.
- After sign-off: remove the beta lines, keep the "English version governs" notice on legal pages, and record the date and reviewer initials in `docs/es-review/SIGNOFF.md`.

## Keeping it good

- A new string goes into English and Spanish in the same change. The tests fail if a Spanish entry is missing or has different figures.
- When a term changes, change `docs/es/GLOSSARY_ES.md`, then run the packet again.
- Re-run the screening after every large batch of text, and ask the reviewer to look at items whose score drops.
