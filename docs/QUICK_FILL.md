# Quick fill: photo, voice and text (added 2026-11-09)

The buyer should not key numbers in one by one in a showroom. Quick fill finds them from what they say, type, paste or photograph, shows each with where it came from, and uses nothing until they tap **Use these numbers**. The calculator still does all the maths; this only says which number is which.

| Way in | How | Needs |
| --- | --- | --- |
| Say | Browser speech service (Chrome, Safari) fills the box; the microphone key on any phone keyboard also works | nothing from us |
| Type or paste | Text box | nothing |
| Photo | Shrunk to 1600 px on the phone, sent to `/api/extract`, read by a vision model through OpenRouter | `OPENROUTER_API_KEY` |

- **Say, type and paste use no AI.** `src/lib/extract/spoken.ts` is plain pattern matching, so it works offline, costs nothing and is tested exactly (22 cases: "thirty one five hundred", "five twenty two a month", "3 grand", a tax amount turned into a rate, trade-in kept apart from what is owed, an out-the-door total not mistaken for the price).
- **The photo reader only reads.** The prompt says copy, never calculate. The answer is cut down to numbers inside each field's range (`cleanAnswer`), so words on a document, extra keys and out-of-range values change nothing. Daily caps: 3 reads per visitor, `EXTRACT_DAILY_CAP` for the service. The count is held in one server instance's memory: a soft brake until it moves to Upstash Redis as planned.
- **Nothing is stored or logged.** The privacy page says what leaves the device for each way in, including that Chrome and Safari may send voice to their maker.
- **Without a key** the route answers 503 and the sheet tells the buyer to say or type instead.
- **Not yet tested:** a real photo through a real model (no key in this environment). The route, the cleaning and the caps are covered by `src/server/extract.test.ts` with a stand-in for the model. Run it on 12 printed worksheets before switching it on, as the plan says.
- Where it sits: the first card on the Walk door, and "Quick fill" beside "Use my numbers" on the Desk.
