import { useId } from "react";
import { lanterns, type LanternId } from "@/data/festival";

type Props = {
  id: LanternId;
  className?: string;
  /** Có vẽ quầng sáng phía sau không */
  halo?: boolean;
  /** Có vẽ dây treo phía trên không */
  string?: boolean;
};

/**
 * Năm chiếc đèn giấy kiếng vẽ tay bằng SVG. viewBox 100 × 140, dây treo ở (50, 0).
 */
export function LanternArt({ id, className, halo = true, string = true }: Props) {
  const uid = useId().replace(/:/g, "");
  const lantern = lanterns.find((l) => l.id === id) ?? lanterns[0];
  const g = `lg-${uid}`;
  const h = `lh-${uid}`;

  return (
    <svg viewBox="0 0 100 140" className={className} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={h} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={lantern.glow} stopOpacity="0.7" />
          <stop offset="45%" stopColor={lantern.glow} stopOpacity="0.22" />
          <stop offset="100%" stopColor={lantern.glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={g} cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#fff6d8" />
          <stop offset="35%" stopColor={lantern.glow} />
          <stop offset="100%" stopColor={lantern.color} />
        </radialGradient>
      </defs>

      {halo && <circle cx="50" cy="70" r="70" fill={`url(#${h})`} className="anim-flicker" />}
      {string && <line x1="50" y1="-40" x2="50" y2={STRING_END[id]} stroke="#2a1d10" strokeWidth="1.4" />}

      {id === "star" && <StarBody fill={`url(#${g})`} />}
      {id === "rabbit" && <RabbitBody fill={`url(#${g})`} />}
      {id === "moon" && <MoonBody fill={`url(#${g})`} />}
      {id === "flower" && <FlowerBody fill={`url(#${g})`} />}
      {id === "lulu" && <HeartBody fill={`url(#${g})`} />}
    </svg>
  );
}

const STRING_END: Record<LanternId, number> = { star: 28, rabbit: 60, moon: 30, flower: 38, lulu: 48 };

const STAR =
  "M50 28 L59.99 56.25 L89.94 57.02 L66.17 75.25 L74.69 103.98 L50 87 L25.31 103.98 L33.83 75.25 L10.06 57.02 L40.01 56.25 Z";

function Tassel({ x, y, color = "#e8472e", len = 16 }: { x: number; y: number; color?: string; len?: number }) {
  return (
    <g stroke={color} strokeWidth="1.3" strokeLinecap="round">
      <circle cx={x} cy={y + 2} r="2.4" fill="#ffc45c" stroke="none" />
      <line x1={x} y1={y + 4} x2={x - 2.5} y2={y + len} />
      <line x1={x} y1={y + 4} x2={x} y2={y + len + 2} />
      <line x1={x} y1={y + 4} x2={x + 2.5} y2={y + len} />
    </g>
  );
}

function StarBody({ fill }: { fill: string }) {
  return (
    <g>
      <path d={STAR} fill={fill} stroke="#8a2412" strokeWidth="2" strokeLinejoin="round" />
      <path d={STAR} transform="translate(50 70) scale(0.48) translate(-50 -70)" fill="#fff1c4" opacity="0.55" />
      <g stroke="#ffd47a" strokeWidth="0.9" opacity="0.7">
        <line x1="50" y1="28" x2="50" y2="87" />
        <line x1="10.06" y1="57.02" x2="66.17" y2="75.25" />
        <line x1="89.94" y1="57.02" x2="33.83" y2="75.25" />
      </g>
      <Tassel x={25.31} y={103} />
      <Tassel x={74.69} y={103} />
    </g>
  );
}

function RabbitBody({ fill }: { fill: string }) {
  return (
    <g>
      <g className="anim-ear">
        <path d="M66 50 C 60 30, 62 12, 68 10 C 74 12, 74 32, 72 50 Z" fill={fill} stroke="#8a79b8" strokeWidth="1.5" />
        <path d="M67.5 46 C 64 32, 65 18, 68 15 C 70.5 18, 71 32, 70 46 Z" fill="#ffb3c9" opacity="0.8" />
      </g>
      <path d="M76 52 C 76 32, 82 16, 88 17 C 92 20, 88 38, 81 54 Z" fill={fill} stroke="#8a79b8" strokeWidth="1.5" />
      <ellipse cx="48" cy="84" rx="34" ry="24" fill={fill} stroke="#8a79b8" strokeWidth="1.5" />
      <circle cx="75" cy="62" r="15" fill={fill} stroke="#8a79b8" strokeWidth="1.5" />
      <circle cx="80" cy="60" r="2.3" fill="#d6304a" />
      <circle cx="88.5" cy="65" r="1.6" fill="#ff8fab" />
      <circle cx="15" cy="80" r="6" fill="#fff" stroke="#8a79b8" strokeWidth="1.2" />
      <path d="M58 70 q 6 6 0 14" stroke="#e8472e" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g fill="#2a1d10">
        <circle cx="32" cy="110" r="5" />
        <circle cx="64" cy="110" r="5" />
      </g>
      <Tassel x={48} y={106} len={12} />
    </g>
  );
}

function MoonBody({ fill }: { fill: string }) {
  return (
    <g>
      <rect x="36" y="30" width="28" height="7" rx="2" fill="#8a2412" />
      <ellipse cx="50" cy="70" rx="36" ry="33" fill={fill} stroke="#9c5a14" strokeWidth="1.6" />
      <g stroke="#b5701e" strokeWidth="1" fill="none" opacity="0.55">
        <ellipse cx="50" cy="70" rx="24" ry="33" />
        <ellipse cx="50" cy="70" rx="11" ry="33" />
        <line x1="50" y1="37" x2="50" y2="103" />
      </g>
      <ellipse cx="40" cy="58" rx="9" ry="12" fill="#fff6d8" opacity="0.45" />
      <rect x="36" y="102" width="28" height="7" rx="2" fill="#8a2412" />
      <Tassel x={50} y={108} len={18} />
    </g>
  );
}

function FlowerBody({ fill }: { fill: string }) {
  return (
    <g>
      <path d="M50 38 C 62 52, 64 74, 50 96 C 36 74, 38 52, 50 38 Z" fill={fill} stroke="#8e2358" strokeWidth="1.5" />
      <path d="M50 96 C 30 88, 20 70, 22 50 C 36 56, 46 72, 50 96 Z" fill={fill} stroke="#8e2358" strokeWidth="1.5" />
      <path d="M50 96 C 70 88, 80 70, 78 50 C 64 56, 54 72, 50 96 Z" fill={fill} stroke="#8e2358" strokeWidth="1.5" />
      <path d="M50 97 C 30 99, 12 90, 6 74 C 22 72, 40 82, 50 97 Z" fill={fill} stroke="#8e2358" strokeWidth="1.5" opacity="0.9" />
      <path d="M50 97 C 70 99, 88 90, 94 74 C 78 72, 60 82, 50 97 Z" fill={fill} stroke="#8e2358" strokeWidth="1.5" opacity="0.9" />
      <path d="M50 50 C 55 60, 55 76, 50 88 C 45 76, 45 60, 50 50 Z" fill="#fff0f6" opacity="0.5" />
      <path d="M24 100 q 26 10 52 0" stroke="#25b597" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Tassel x={50} y={104} len={14} color="#25b597" />
    </g>
  );
}

function HeartBody({ fill }: { fill: string }) {
  return (
    <g>
      <path
        d="M50 106 C 18 84, 8 62, 24 46 C 36 35, 47 41, 50 52 C 53 41, 64 35, 76 46 C 92 62, 82 84, 50 106 Z"
        fill={fill}
        stroke="#9c1f33"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M50 96 C 30 82, 22 66, 32 55" stroke="#ffd47a" strokeWidth="1.2" fill="none" opacity="0.8" />
      <text x="50" y="80" textAnchor="middle" fontSize="15" fontWeight="800" fill="#7a1022" opacity="0.8" fontFamily="var(--font-vn)">
        L·M
      </text>
      <Tassel x={50} y={105} len={16} color="#ffc45c" />
    </g>
  );
}
