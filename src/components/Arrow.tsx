/** Drawn arrows. The condensed numeral face and Atkinson have no arrow glyphs. */
export function Arrow({ dir }: { dir: "up" | "down" }) {
  return (
    <svg className="arr" viewBox="0 0 12 12" aria-hidden="true">
      <path d={dir === "up" ? "M6 1l5.5 10h-11z" : "M6 11L.5 1h11z"} fill="currentColor" />
    </svg>
  );
}
