/**
 * Sets every amount and figure inside a sentence in the numeral face.
 * Atkinson draws a slashed zero, so "$1,400" in running text would read as a
 * different character. The rule in docs/DESIGN_NOTES.md is that money is always
 * set in the numeral face, and this applies it to written sentences too.
 */
const FIGURE = /((?<!Offer\s)\$?\d[\d,]*(?:\.\d+)?%?)/g;

export function Nums({ text }: { text: string }) {
  return (
    <>
      {text.split(FIGURE).map((part, i) =>
        i % 2 === 1 ? (
          <span className="num" key={i}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
