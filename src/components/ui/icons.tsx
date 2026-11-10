import type { ReactNode, SVGProps } from "react";

/**
 * One icon family, drawn on a 24 grid with a 1.75 stroke and round ends. Each shape is picked
 * for what it stands for in a car deal (a tag for the price, a swap for the trade-in), not the
 * stock metaphor. They take the text colour, so they follow the theme.
 */
type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

function Icon({ size = 24, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const TagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 12V4h8l10 10-8 8z" />
    <circle cx="7.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
  </Icon>
);
export const WalletIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="6" width="18" height="13" rx="3" />
    <path d="M3 10h18" />
    <circle cx="16.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
  </Icon>
);
export const SwapIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
  </Icon>
);
export const DownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3v11M7 10l5 5 5-5M4 20h16" />
  </Icon>
);
export const ReceiptIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" />
  </Icon>
);
export const PlusBoxIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <path d="M12 8v8M8 12h8" />
  </Icon>
);
export const PercentIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 5 5 19" />
    <circle cx="7" cy="7" r="2" />
    <circle cx="17" cy="17" r="2" />
  </Icon>
);
export const CalendarIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Icon>
);
export const FlagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
  </Icon>
);
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);
export const ArrowIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Icon>
);
export const BackIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </Icon>
);
export const ChevronIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);
export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);
export const InfoIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8v.01" />
  </Icon>
);
export const LockIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="11" width="14" height="9" rx="3" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);
export const ListIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
  </Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);
export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.600-6 8-6s8 2 8 6" />
  </Icon>
);
export const UsersIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3.500" />
    <path d="M2 20c0-3.500 3-5.500 7-5.500s7 2 7 5.500" />
    <circle cx="17" cy="9" r="2.800" />
    <path d="M16.500 14.500c3 .2 5.500 1.800 5.500 4.500" />
  </Icon>
);
export const SunIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </Icon>
);
export const TypeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 19 9 5l6 14M5.500 14h7M16 19v-5.500a2.800 2.800 0 0 1 5 0V19M16 16.500h5" />
  </Icon>
);
export const CalcIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="3" width="14" height="18" rx="3" />
    <path d="M8.500 7.500h7M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" />
  </Icon>
);
export const SparkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
  </Icon>
);

/* ------------------------------------------------------------------------------------------
 * Drawn scenes for the three doors. Flat shapes in the chart colours, one line weight, so they
 * read as one set. They are decoration, so they are hidden from screen readers. The wheel and
 * pen groups carry classes the stylesheet moves on hover.
 * ---------------------------------------------------------------------------------------- */
const scene = { viewBox: "0 0 112 80", width: "100%", height: "100%", "aria-hidden": true, focusable: false } as const;

/** A car with a price tag hanging from the mirror: thinking about buying. */
export function SceneCar() {
  return (
    <svg {...scene} className="scene">
      <ellipse cx="56" cy="70" rx="46" ry="4" fill="var(--line)" opacity="0.6" />
      <path
        d="M9 62V50c0-4 2.5-6.5 6.5-7.4l16-3.6 13-15c1.800-2 4-3 6.800-3h26c3.400 0 6.200 1.600 8 4.400L100 41l5 2c3 1.200 4.500 3.600 4.500 7v12z"
        fill="var(--c-car)"
      />
      <path d="M40 27h16v14H33.500zM60 27h13.500c1.400 0 2.600.7 3.300 1.900L82 41H60z" fill="var(--panel-2)" opacity="0.92" />
      <g className="wheel" style={{ transformOrigin: "30px 62px" }}>
        <circle cx="30" cy="62" r="10" fill="var(--ground)" stroke="var(--text)" strokeWidth="3" />
        <circle cx="30" cy="62" r="3" fill="var(--text)" />
        <path d="M30 54.500v4M30 65.500v4M22.500 62h4M33.500 62h4" stroke="var(--text)" strokeWidth="1.800" strokeLinecap="round" />
      </g>
      <g className="wheel" style={{ transformOrigin: "84px 62px" }}>
        <circle cx="84" cy="62" r="10" fill="var(--ground)" stroke="var(--text)" strokeWidth="3" />
        <circle cx="84" cy="62" r="3" fill="var(--text)" />
        <path d="M84 54.500v4M84 65.500v4M76.500 62h4M87.500 62h4" stroke="var(--text)" strokeWidth="1.800" strokeLinecap="round" />
      </g>
      <path d="M12 52h5" stroke="var(--panel-2)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** A quote sheet with an extras tag clipped to it: I have a quote. */
export function SceneQuote() {
  return (
    <svg {...scene} className="scene">
      <ellipse cx="56" cy="72" rx="40" ry="3.500" fill="var(--line)" opacity="0.6" />
      <g transform="rotate(-5 50 40)">
        <rect x="22" y="8" width="56" height="64" rx="7" fill="var(--panel-2)" stroke="var(--edge)" strokeWidth="2" />
        <path d="M32 22h30M32 32h36M32 42h24" stroke="var(--ink-2)" strokeWidth="3" strokeLinecap="round" />
        <rect x="32" y="52" width="36" height="10" rx="3" fill="var(--c-car)" />
      </g>
      <g className="tag" style={{ transformOrigin: "84px 52px" }} transform="rotate(12 84 52)">
        <path d="M70 40h24l9 9-9 9H70z" fill="var(--c-extras)" />
        <circle cx="76" cy="49" r="2.500" fill="var(--panel-2)" />
        <path d="M84 45v8M80.500 49h7" stroke="var(--panel-2)" strokeWidth="2.200" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** A clipboard with the four-box worksheet and a pen: at the desk. */
export function SceneDesk() {
  return (
    <svg {...scene} className="scene">
      <ellipse cx="56" cy="72" rx="44" ry="3.500" fill="var(--line)" opacity="0.6" />
      <rect x="26" y="8" width="52" height="62" rx="7" fill="var(--panel-2)" stroke="var(--edge)" strokeWidth="2" />
      <rect x="42" y="4" width="20" height="9" rx="3" fill="var(--c-tax)" />
      <g fill="none" stroke="var(--edge)" strokeWidth="2" strokeDasharray="4 3">
        <rect x="33" y="20" width="17" height="17" rx="3" />
        <rect x="54" y="20" width="17" height="17" rx="3" />
        <rect x="33" y="42" width="17" height="17" rx="3" />
      </g>
      <rect x="54" y="42" width="17" height="17" rx="3" fill="var(--c-car)" />
      <g className="pen" style={{ transformOrigin: "86px 56px" }}>
        <path d="M82 22 94 58l-4 1.500L78 24z" fill="var(--c-fees)" />
        <path d="m90 59 4-1.400-1.600-5z" fill="var(--text)" />
      </g>
    </svg>
  );
}

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const CameraIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </Icon>
);

export const MicIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
  </Icon>
);

export const CarIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 16V12l1.6-4.4A2 2 0 0 1 8.5 6h7a2 2 0 0 1 1.9 1.6L19 12v4M3.5 16h17M7 16v2M17 16v2" />
    <circle cx="8" cy="13.5" r="0.8" />
    <circle cx="16" cy="13.5" r="0.8" />
  </Icon>
);
