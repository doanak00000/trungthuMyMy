/**
 * Phông nền phố đèn, vẽ như giấy cắt của đèn kéo quân: bóng nhà ống, mái ngói,
 * dây đèn giăng ngang, mặt đường và dòng sông soi bóng. viewBox 1800 × 800.
 */
import { GlowDefs, glow } from "@/components/ui/GlowDefs";

export const STREET_W = 1800;
export const STREET_H = 800;

const LANTERN_COLORS = ["#e8472e", "#ffa028", "#25b597", "#d8428f", "#ffc45c"];

// Hạt giống cố định để lần nào vẽ cũng giống nhau (tránh lệch khi hydrate).
export function rand(seed: number) {
  const x = Math.sin(seed * 999.13) * 43758.5453;
  return x - Math.floor(x);
}

type House = { x: number; w: number; top: number; roof: "tile" | "flat" | "gable" };

const HOUSES: House[] = [
  { x: 260, w: 90, top: 330, roof: "tile" },
  { x: 350, w: 120, top: 280, roof: "flat" },
  { x: 470, w: 100, top: 300, roof: "gable" },
  { x: 570, w: 110, top: 250, roof: "tile" },
  { x: 680, w: 70, top: 340, roof: "flat" },
  { x: 1010, w: 90, top: 300, roof: "gable" },
  { x: 1100, w: 120, top: 260, roof: "tile" },
  { x: 1220, w: 90, top: 320, roof: "flat" },
  { x: 1310, w: 70, top: 360, roof: "tile" },
];

function housePath({ x, w, top, roof }: House) {
  const base = 600;
  if (roof === "tile") {
    return `M${x} ${base} V${top + 26} L${x - 10} ${top + 26} Q${x + w * 0.2} ${top + 10} ${x + w / 2} ${top} Q${x + w * 0.8} ${top + 10} ${x + w + 10} ${top + 26} L${x + w} ${top + 26} V${base} Z`;
  }
  if (roof === "gable") {
    return `M${x} ${base} V${top + 30} L${x + w / 2} ${top} L${x + w} ${top + 30} V${base} Z`;
  }
  return `M${x} ${base} V${top + 8} H${x + 6} V${top} H${x + w - 6} V${top + 8} H${x + w} V${base} Z`;
}

function Windows({ h, seed }: { h: House; seed: number }) {
  const cols = Math.max(1, Math.floor(h.w / 38));
  const rows = Math.floor((600 - h.top - 90) / 58);
  const out = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = rand(seed + r * 7 + c * 13) > 0.35;
      const wx = h.x + 12 + c * ((h.w - 24) / cols) + ((h.w - 24) / cols - 18) / 2;
      const wy = h.top + 48 + r * 58;
      out.push(
        <g key={`${r}-${c}`}>
          <rect x={wx} y={wy} width="18" height="26" rx="9" ry="9" fill={lit ? "#ffb957" : "#1b2058"} opacity={lit ? 0.75 : 1} />
          {lit && <rect x={wx - 3} y={wy + 24} width="24" height="3" fill="#06081e" />}
        </g>,
      );
    }
  }
  return <>{out}</>;
}

/** Một dây đèn võng giữa hai điểm, đèn treo đều nhau */
export function LanternString({ x1, x2, y, sag, seed, count }: { x1: number; x2: number; y: number; sag: number; seed: number; count: number }) {
  const midX = (x1 + x2) / 2;
  const items = [];
  for (let i = 1; i < count; i++) {
    const t = i / count;
    const x = x1 + (x2 - x1) * t;
    const cy = y + 4 * sag * t * (1 - t);
    const color = LANTERN_COLORS[Math.floor(rand(seed + i) * LANTERN_COLORS.length)];
    const star = rand(seed + i * 3) > 0.7;
    items.push(
      <g key={i} transform={`translate(${x} ${cy})`}>
        <line x1="0" y1="0" x2="0" y2="8" stroke="#0a0c24" strokeWidth="1" />
        <circle cx="0" cy="20" r="36" fill={glow(color)} />
        {star ? (
          <path d="M0 8 L3.5 16 L12 16.5 L5.5 21.5 L8 30 L0 25 L-8 30 L-5.5 21.5 L-12 16.5 L-3.5 16 Z" fill={color} />
        ) : (
          <>
            <rect x="-4" y="7" width="8" height="3" fill="#3a1a0c" />
            <ellipse cx="0" cy="19" rx="9" ry="10" fill={color} />
            <ellipse cx="-2.5" cy="16" rx="3" ry="4" fill="#fff4d0" opacity="0.45" />
            <line x1="0" y1="29" x2="0" y2="37" stroke={color} strokeWidth="1.4" />
          </>
        )}
      </g>,
    );
  }
  return (
    <g>
      <path d={`M${x1} ${y} Q${midX} ${y + 2 * sag} ${x2} ${y}`} stroke="#0a0c24" strokeWidth="1.6" fill="none" />
      {items}
    </g>
  );
}

export function StreetScenery() {
  return (
    <svg viewBox={`0 0 ${STREET_W} ${STREET_H}`} className="absolute inset-0 size-full" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <GlowDefs />
      <defs>
        <linearGradient id="st-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15163f" />
          <stop offset="1" stopColor="#0a0b27" />
        </linearGradient>
        <linearGradient id="st-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#121a55" />
          <stop offset="1" stopColor="#070a24" />
        </linearGradient>
        <radialGradient id="st-pool">
          <stop offset="0" stopColor="#ffb54a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffb54a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="st-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#06081e" stopOpacity="0" />
          <stop offset="1" stopColor="#06081e" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* nhà ống bóng giấy */}
      <g fill="#0b0e2e">
        {HOUSES.map((h) => (
          <path key={h.x} d={housePath(h)} />
        ))}
      </g>
      <g>
        {HOUSES.map((h, i) => (
          <Windows key={h.x} h={h} seed={i * 31 + 5} />
        ))}
      </g>
      {/* ban công, mái hiên */}
      <g fill="#070920">
        {HOUSES.filter((_, i) => i % 2 === 0).map((h) => (
          <rect key={h.x} x={h.x - 6} y={h.top + 120} width={h.w + 12} height="6" />
        ))}
      </g>

      {/* cổng phố */}
      <g>
        <rect x="58" y="330" width="18" height="270" fill="#0b0e2e" />
        <rect x="224" y="330" width="18" height="270" fill="#0b0e2e" />
        <path d="M30 336 Q150 300 270 336 L262 316 Q150 280 38 316 Z" fill="#0b0e2e" />
        <rect x="92" y="340" width="116" height="40" rx="3" fill="#8a2412" />
        <rect x="96" y="344" width="108" height="32" rx="2" fill="none" stroke="#ffc45c" strokeWidth="1.2" opacity="0.7" />
        <text x="150" y="367" textAnchor="middle" fontSize="18" fontWeight="800" fill="#ffd47a" fontFamily="var(--font-vn)" letterSpacing="2">
          PHỐ ĐÈN
        </text>
        <line x1="92" y1="380" x2="92" y2="396" stroke="#0a0c24" strokeWidth="1.4" />
        <line x1="208" y1="380" x2="208" y2="396" stroke="#0a0c24" strokeWidth="1.4" />
        <circle cx="92" cy="410" r="46" fill={glow("#e8472e")} />
        <ellipse cx="92" cy="410" rx="11" ry="14" fill="#e8472e" />
        <circle cx="208" cy="410" r="46" fill={glow("#e8472e")} />
        <ellipse cx="208" cy="410" rx="11" ry="14" fill="#e8472e" />
      </g>

      {/* dây đèn */}
      <LanternString x1={0} x2={260} y={250} sag={30} seed={1} count={6} />
      <LanternString x1={260} x2={690} y={300} sag={46} seed={2} count={9} />
      <LanternString x1={680} x2={1030} y={270} sag={60} seed={3} count={8} />
      <LanternString x1={1010} x2={1380} y={280} sag={40} seed={4} count={8} />
      <LanternString x1={1380} x2={1560} y={330} sag={24} seed={5} count={4} />

      {/* cây đa lớn gần cuối phố */}
      <g fill="#080a24">
        <path d="M1420 600 C 1428 540 1424 480 1412 440 L1440 440 C 1446 490 1452 550 1460 600 Z" />
        <path d="M1310 450 C 1300 400 1340 360 1380 368 C 1392 320 1450 300 1490 330 C 1530 310 1590 340 1580 390 C 1620 410 1610 470 1560 470 C 1540 500 1470 492 1450 470 C 1420 490 1350 488 1340 470 C 1310 470 1300 460 1310 450 Z" />
        {[1350, 1372, 1520, 1548].map((x, i) => (
          <path key={x} d={`M${x} 470 q ${i % 2 ? 4 : -4} 50 ${i % 2 ? -2 : 2} 110`} stroke="#080a24" strokeWidth="2" fill="none" />
        ))}
      </g>

      {/* mặt đường + vũng sáng dưới đèn */}
      <rect x="0" y="600" width={STREET_W} height="100" fill="url(#st-road)" />
      <rect x="0" y="598" width={STREET_W} height="3" fill="#232a70" />
      {[150, 460, 860, 1210].map((x) => (
        <ellipse key={x} cx={x} cy="630" rx="180" ry="36" fill="url(#st-pool)" />
      ))}

      {/* bờ kè + sông */}
      <rect x="0" y="692" width={STREET_W} height="10" fill="#1e2466" />
      {Array.from({ length: 45 }, (_, i) => (
        <rect key={i} x={i * 40 + 6} y="682" width="4" height="12" fill="#1e2466" />
      ))}
      <rect x="0" y="702" width={STREET_W} height="98" fill="url(#st-river)" />
      {/* bóng đèn soi dưới sông */}
      <g className="anim-ripple">
        {Array.from({ length: 26 }, (_, i) => {
          const x = 30 + i * 68 + rand(i) * 30;
          const color = LANTERN_COLORS[i % LANTERN_COLORS.length];
          return <rect key={i} x={x} y={718 + (i % 3) * 16} width={18 + rand(i + 9) * 22} height="2.5" rx="1.2" fill={color} opacity="0.45" />;
        })}
      </g>
      <g className="anim-ripple" style={{ animationDelay: "-1.8s" }}>
        {Array.from({ length: 30 }, (_, i) => (
          <rect key={i} x={i * 60 + rand(i + 3) * 40} y={730 + (i % 4) * 15} width={10 + rand(i + 5) * 26} height="1.6" rx="0.8" fill="#8a93e0" opacity="0.28" />
        ))}
      </g>

      {/* đoạn cuối phố tối dần: lối nhỏ bí mật */}
      <rect x="1540" y="0" width="260" height="700" fill="url(#st-fade)" />
      <g fill="#070920">
        <path d="M1580 600 C 1600 560 1650 552 1680 570 C 1710 540 1770 548 1800 574 V600 Z" />
      </g>
    </svg>
  );
}

/** Lớp mái nhà xa, trôi chậm hơn khi vuốt (parallax). */
export function FarRoofs() {
  return (
    <svg viewBox={`0 0 ${STREET_W} ${STREET_H}`} className="absolute inset-0 size-full" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <g fill="#121748">
        <path d="M0 600 V420 L60 400 L120 420 V380 H200 V430 L260 410 L330 440 V360 Q390 330 450 360 V600 Z" />
        <path d="M430 600 V400 L520 380 V350 L600 340 L680 360 V410 L760 390 V430 H840 V600 Z" />
        {/* mái đình cong */}
        <path d="M820 600 V430 L800 430 Q860 410 880 380 Q920 392 960 380 Q980 410 1040 430 L1020 430 V600 Z" />
        <path d="M1000 600 V390 L1080 370 L1160 400 V350 H1240 V420 L1320 400 V600 Z" />
        <path d="M1300 600 V430 L1400 400 L1480 430 V380 L1560 360 L1640 390 V420 L1720 400 L1800 420 V600 Z" />
      </g>
      <g fill="#ffb957" opacity="0.35">
        {Array.from({ length: 40 }, (_, i) => (
          <rect key={i} x={20 + i * 44 + rand(i + 40) * 20} y={440 + rand(i + 80) * 120} width="6" height="8" rx="1" />
        ))}
      </g>
    </svg>
  );
}
