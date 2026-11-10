/**
 * The car on the hero road: a line drawing, not a filled blob, so it reads as lit hardware
 * beside the glowing tiles. It faces the road, its headlight throws a beam of the warm accent,
 * and the wheels turn slowly. Decoration only, so it is hidden from screen readers.
 */
export function HeroCar() {
  const wheel = (cx: number) => (
    <g className="wheel" style={{ transformOrigin: `${cx}px 108px` }}>
      <circle cx={cx} cy="108" r="27" fill="var(--ground)" stroke="var(--text)" strokeWidth="3" />
      <circle cx={cx} cy="108" r="8" fill="none" stroke="var(--text)" strokeWidth="2.5" />
      <path
        d={`M${cx} 81v19M${cx} 116v19M${cx - 27} 108h19M${cx + 8} 108h19M${cx - 19} 89l13 13M${cx + 6} 114l13 13`}
        stroke="var(--c-car)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
  return (
    <svg viewBox="-170 0 570 150" width="100%" aria-hidden="true" focusable="false" className="hero-car">
      <defs>
        <linearGradient id="beam" x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="var(--yellow)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--yellow)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--c-car)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--c-car)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M24 90 -170 52V150L24 100Z" fill="url(#beam)" />
      <ellipse cx="205" cy="140" rx="200" ry="12" fill="url(#glow)" />
      <path
        d="M20 108C20 96 24 90 34 86L118 70C140 66 150 52 172 42C182 38 192 36 210 36H250C270 36 292 50 322 68L368 78C380 80 386 88 386 100V108H336A36 36 0 0 0 264 108H146A36 36 0 0 0 74 108Z"
        fill="color-mix(in oklab, var(--panel-2) 70%, transparent)"
        stroke="var(--text)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M128 68 174 46C184 42 192 41 208 41H248C262 41 280 52 306 68Z M214 41V68"
        fill="color-mix(in oklab, var(--c-car) 22%, transparent)"
        stroke="var(--text)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M40 94H372" stroke="var(--c-car)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M22 90 46 86 42 97 22 100Z" fill="var(--yellow)" />
      {wheel(110)}
      {wheel(300)}
    </svg>
  );
}
