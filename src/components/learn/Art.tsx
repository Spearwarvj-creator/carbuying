import type { ReactElement } from "react";
import type { ArtKey } from "@/data/learn/types";

/**
 * Everyday pictures for the dictionary. Each one is a small drawing of something a reader already knows (a menu, a
 * receipt, a phone plan, an umbrella), so a car-buying word can be tied to daily life. They are drawn in code on one 120
 * by 90 grid, in the app's colours, so they follow the light and dark themes and need no image files. They are
 * decorative: the sentence beside each one carries the meaning.
 *
 * Classes: ink is the outline, a/b/c/d/e are soft fills (blue, yellow, red, green, violet), w is paper.
 */
const P = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DRAW: Record<ArtKey, () => ReactElement> = {
  menu: () => (
    <P>
      <rect className="w ink" x="26" y="8" width="68" height="76" rx="7" />
      <path className="ink" d="M42 16 V24 Q42 28 46 28 Q50 28 50 24 V16 M46 28 V40" />
      <path className="ink" d="M72 40 V16 Q81 20 80 31 H72" />
      {[54, 64, 74].map((y, i) => (
        <g key={y}>
          <line className="ink" x1="34" y1={y} x2="62" y2={y} />
          <rect className={i === 0 ? "b ink" : "w ink"} x="70" y={y - 5} width="16" height="10" rx="3" />
        </g>
      ))}
    </P>
  ),
  receipt: () => (
    <P>
      <path className="w ink" d="M30 8 H90 V78 L84 73 L78 78 L72 73 L66 78 L60 73 L54 78 L48 73 L42 78 L36 73 L30 78 Z" />
      {[22, 34, 46].map((y) => (
        <g key={y}>
          <line className="ink" x1="38" y1={y} x2="64" y2={y} />
          <line className="ink" x1="74" y1={y} x2="82" y2={y} />
        </g>
      ))}
      <rect className="b ink" x="38" y="55" width="44" height="10" rx="3" />
    </P>
  ),
  package: () => (
    <P>
      <path className="w ink" d="M28 34 L60 20 L92 34 V68 L60 80 L28 68 Z" />
      <path className="ink" d="M28 34 L60 48 L92 34 M60 48 V80" />
      <path className="a ink" d="M44 27 L76 41 V50 L44 36 Z" />
      <path className="ink" d="M8 40 H20 M6 50 H18 M10 60 H22" />
    </P>
  ),
  keys: () => (
    <P>
      <circle className="b ink" cx="38" cy="42" r="16" />
      <circle className="w ink" cx="38" cy="42" r="5" />
      <path className="ink" d="M54 42 H98 M82 42 V54 M92 42 V50" />
      <rect className="a ink" x="20" y="64" width="26" height="14" rx="4" />
    </P>
  ),
  fineprint: () => (
    <P>
      <rect className="w ink" x="22" y="8" width="60" height="74" rx="6" />
      {[20, 29, 38, 47, 56, 65].map((y) => (
        <line key={y} className="ink" x1="30" y1={y} x2={y % 2 ? 72 : 66} y2={y} />
      ))}
      <circle className="b ink" cx="74" cy="56" r="17" fillOpacity="0.55" />
      <line className="ink" x1="86" y1="68" x2="100" y2="82" strokeWidth="5" />
    </P>
  ),
  recall: () => (
    <P>
      <path className="c ink" d="M60 10 L104 80 H16 Z" />
      <line className="ink" x1="60" y1="34" x2="60" y2="58" strokeWidth="5" />
      <circle className="ink" cx="60" cy="68" r="2.5" />
    </P>
  ),
  scale: () => (
    <P>
      <line className="ink" x1="60" y1="14" x2="60" y2="76" />
      <line className="ink" x1="44" y1="78" x2="76" y2="78" />
      <line className="ink" x1="22" y1="28" x2="98" y2="22" />
      <path className="a ink" d="M12 52 H34 Q34 62 23 62 Q12 62 12 52 Z" />
      <path className="w ink" d="M86 46 H108 Q108 56 97 56 Q86 56 86 46 Z" />
      <line className="ink" x1="22" y1="28" x2="23" y2="52" />
      <line className="ink" x1="98" y1="22" x2="97" y2="46" />
      <circle className="b ink" cx="20" cy="47" r="4" />
      <circle className="b ink" cx="27" cy="47" r="4" />
    </P>
  ),
  fingerprint: () => (
    <P>
      <rect className="w ink" x="30" y="8" width="60" height="74" rx="10" />
      <path className="ink" d="M44 62 Q44 28 60 28 Q76 28 76 62 M51 66 Q51 36 60 36 Q69 36 69 66 M58 70 V44 Q60 42 62 44 V70" />
      <path className="ink" d="M40 40 Q46 20 60 20 Q74 20 80 40" />
    </P>
  ),
  phone: () => (
    <P>
      <rect className="w ink" x="40" y="8" width="40" height="74" rx="8" />
      <rect className="a ink" x="46" y="18" width="28" height="46" rx="3" />
      <circle className="ink" cx="60" cy="73" r="2.5" />
      <circle className="d ink" cx="82" cy="24" r="11" />
      <path className="ink" d="M76 24 L81 29 L89 19" />
    </P>
  ),
  umbrella: () => (
    <P>
      <path className="a ink" d="M14 46 A46 38 0 0 1 106 46 Q96 40 89 46 Q82 40 75 46 Q68 40 60 46 Q52 40 45 46 Q38 40 31 46 Q24 40 14 46 Z" />
      <path className="ink" d="M60 46 V72 Q60 80 52 80 Q46 80 46 74" />
      <path className="ink" d="M20 12 L16 22 M100 12 L96 22 M60 6 V12" />
    </P>
  ),
  coupon: () => (
    <P>
      <path className="b ink" d="M14 24 H106 V38 A7 7 0 0 0 106 52 V66 H14 V52 A7 7 0 0 0 14 38 Z" />
      <line className="ink" x1="40" y1="24" x2="40" y2="66" strokeDasharray="4 4" />
      <circle className="w ink" cx="60" cy="38" r="5" />
      <circle className="w ink" cx="82" cy="52" r="5" />
      <line className="ink" x1="84" y1="34" x2="58" y2="56" />
    </P>
  ),
  friend: () => (
    <P>
      <circle className="a ink" cx="24" cy="26" r="10" />
      <path className="a ink" d="M8 62 Q8 40 24 40 Q40 40 40 62 Z" />
      <circle className="e ink" cx="96" cy="26" r="10" />
      <path className="e ink" d="M80 62 Q80 40 96 40 Q112 40 112 62 Z" />
      <circle className="b ink" cx="60" cy="26" r="9" />
      <path className="ink" d="M44 20 Q60 6 76 20 M72 14 L77 20 L70 22" />
      <circle className="c ink" cx="70" cy="62" r="6" />
      <path className="ink" d="M44 74 Q60 84 76 74" />
    </P>
  ),
  piggy: () => (
    <P>
      <ellipse className="e ink" cx="58" cy="52" rx="32" ry="22" />
      <path className="ink" d="M40 34 L44 24 L52 32" />
      <circle className="w ink" cx="92" cy="52" r="7" />
      <circle className="ink" cx="76" cy="46" r="2" />
      <rect className="e ink" x="38" y="68" width="8" height="12" rx="2" />
      <rect className="e ink" x="68" y="68" width="8" height="12" rx="2" />
      <line className="ink" x1="50" y1="32" x2="66" y2="32" strokeWidth="4" />
      <circle className="b ink" cx="58" cy="14" r="8" />
    </P>
  ),
  pizza: () => (
    <P>
      <circle className="b ink" cx="48" cy="46" r="32" />
      <path className="ink" d="M48 46 L48 14 M48 46 L75.7 30 M48 46 L75.7 62 M48 46 L48 78 M48 46 L20.3 62 M48 46 L20.3 30" />
      <circle className="c ink" cx="36" cy="30" r="4" />
      <circle className="c ink" cx="62" cy="34" r="4" />
      <circle className="c ink" cx="62" cy="58" r="4" />
      <circle className="c ink" cx="36" cy="60" r="4" />
      <path className="b ink" d="M86 30 L114 46 Q108 62 88 62 Z" />
      <circle className="c ink" cx="96" cy="50" r="4" />
    </P>
  ),
  seesaw: () => (
    <P>
      <path className="w ink" d="M48 80 L60 54 L72 80 Z" />
      <line className="ink" x1="16" y1="62" x2="104" y2="40" strokeWidth="4" />
      <rect className="a ink" x="14" y="44" width="16" height="16" rx="3" />
      <rect className="c ink" x="82" y="10" width="22" height="26" rx="3" />
      <line className="ink" x1="82" y1="23" x2="104" y2="23" />
    </P>
  ),
  coffee: () => (
    <P>
      <path className="w ink" d="M34 30 H78 V52 Q78 68 56 68 Q34 68 34 52 Z" />
      <path className="ink" d="M78 36 H86 Q94 36 94 44 Q94 52 86 52 H78" />
      <path className="ink" d="M44 24 Q40 18 44 12 M56 24 Q52 18 56 12 M68 24 Q64 18 68 12" />
      <ellipse className="a ink" cx="56" cy="74" rx="34" ry="5" />
      {[16, 28, 40, 52, 64, 76, 88, 100].map((x) => (
        <circle key={x} className="b ink" cx={x} cy="86" r="2" />
      ))}
    </P>
  ),
  report: () => (
    <P>
      <rect className="w ink" x="24" y="8" width="72" height="74" rx="6" />
      <line className="ink" x1="32" y1="24" x2="58" y2="24" />
      <path className="b ink" d="M80 14 L82.6 20.4 L89.4 21 L84.2 25.4 L85.8 32 L80 28.4 L74.2 32 L75.8 25.4 L70.6 21 L77.4 20.4 Z" />
      <rect className="d ink" x="32" y="42" width="52" height="8" rx="3" />
      <rect className="b ink" x="32" y="56" width="38" height="8" rx="3" />
      <rect className="c ink" x="32" y="70" width="22" height="8" rx="3" />
    </P>
  ),
  handshake: () => (
    <P>
      <circle className="a ink" cx="28" cy="26" r="10" />
      <path className="a ink" d="M12 62 Q12 40 28 40 Q44 40 44 62 Z" />
      <circle className="e ink" cx="92" cy="26" r="10" />
      <path className="e ink" d="M76 62 Q76 40 92 40 Q108 40 108 62 Z" />
      <rect className="w ink" x="46" y="38" width="28" height="34" rx="3" />
      <path className="ink" d="M52 48 H68 M52 56 H68" />
      <path className="d ink" d="M54 66 L58 70 L66 62" />
    </P>
  ),
  calendar: () => (
    <P>
      <rect className="w ink" x="20" y="16" width="80" height="64" rx="8" />
      <rect className="a ink" x="20" y="16" width="80" height="16" rx="8" />
      <line className="ink" x1="40" y1="8" x2="40" y2="22" />
      <line className="ink" x1="80" y1="8" x2="80" y2="22" />
      {[0, 1, 2, 3, 4].map((c) => [0, 1, 2].map((r) => <circle key={`${c}${r}`} className="ink" cx={32 + c * 14} cy={44 + r * 12} r="2" />))}
      <circle className="c ink" cx="74" cy="56" r="8" fillOpacity="0.55" />
    </P>
  ),
  gym: () => (
    <P>
      <rect className="a ink" x="14" y="26" width="10" height="28" rx="3" />
      <rect className="a ink" x="26" y="20" width="10" height="40" rx="3" />
      <line className="ink" x1="36" y1="40" x2="84" y2="40" strokeWidth="4" />
      <rect className="a ink" x="84" y="20" width="10" height="40" rx="3" />
      <rect className="a ink" x="96" y="26" width="10" height="28" rx="3" />
      <path className="ink" d="M40 74 A14 14 0 1 1 64 80 M64 80 L58 86 M64 80 L70 76" />
    </P>
  ),
  stairs: () => (
    <P>
      <path className="c ink" d="M12 78 V62 H36 V78 Z" />
      <path className="c ink" d="M36 62 V48 H60 V62 Z" fillOpacity="0.7" />
      <path className="a ink" d="M60 48 V34 H84 V48 Z" />
      <path className="a ink" d="M84 34 V20 H108 V34 Z" />
      <circle className="b ink" cx="24" cy="52" r="5" />
    </P>
  ),
  melt: () => (
    <P>
      <path className="b ink" d="M42 48 L60 84 L78 48 Z" />
      <path className="c ink" d="M36 48 A24 24 0 0 1 84 48 Q84 56 78 56 Q74 66 70 56 Q64 62 60 56 Q54 70 50 56 Q44 60 42 56 Q36 56 36 48 Z" />
      <ellipse className="c ink" cx="60" cy="86" rx="22" ry="3" fillOpacity="0.5" />
    </P>
  ),
  swap: () => (
    <P>
      <path className="ink" d="M24 38 A28 24 0 0 1 80 26 M80 26 L72 22 M80 26 L78 35" />
      <path className="ink" d="M96 52 A28 24 0 0 1 40 64 M40 64 L48 68 M40 64 L42 55" />
      <circle className="a ink" cx="24" cy="46" r="9" />
      <circle className="b ink" cx="96" cy="44" r="9" />
    </P>
  ),
  ladder: () => (
    <P>
      <line className="ink" x1="36" y1="8" x2="36" y2="82" strokeWidth="3" />
      <line className="ink" x1="84" y1="8" x2="84" y2="82" strokeWidth="3" />
      {[18, 32, 46, 60, 74].map((y, i) => (
        <line key={y} className="ink" x1="36" y1={y} x2="84" y2={y} strokeWidth={i === 0 ? 6 : 3} />
      ))}
      <circle className="d ink" cx="60" cy="10" r="7" />
    </P>
  ),
  rent: () => (
    <P>
      <rect className="w ink" x="26" y="14" width="56" height="66" rx="4" />
      {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} className="a ink" x={36 + c * 22} y={22 + r * 16} width="12" height="10" rx="2" />))}
      <rect className="b ink" x="48" y="62" width="14" height="18" rx="2" />
      <rect className="e ink" x="84" y="24" width="26" height="16" rx="3" />
      <line className="ink" x1="84" y1="24" x2="82" y2="20" />
    </P>
  ),
  fuel: () => (
    <P>
      <rect className="w ink" x="26" y="12" width="42" height="68" rx="5" />
      <rect className="a ink" x="32" y="20" width="30" height="16" rx="3" />
      <path className="ink" d="M68 30 H80 Q88 30 88 38 V62 Q88 68 94 68 Q100 68 100 60 V40 L92 32" />
      <rect className="b ink" x="20" y="80" width="54" height="6" rx="3" />
    </P>
  ),
};

/** A small drawing for a dictionary term. Decorative, so it is hidden from screen readers. */
export function Art({ k, className }: { k: ArtKey; className?: string }) {
  const draw = DRAW[k];
  return (
    <svg className={`la${className ? ` ${className}` : ""}`} viewBox="0 0 120 90" aria-hidden="true" focusable="false">
      {draw()}
    </svg>
  );
}

export const ART_KEYS = Object.keys(DRAW) as ArtKey[];
