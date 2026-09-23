import { GlowDefs, glow } from "@/components/ui/GlowDefs";

/** Gian trò chơi: lều sọc, dây cờ, bể cá vàng, cọc ném vòng, gấu bông làm quà. viewBox 260 × 240 */
export function GameBooth({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 240" className={className} aria-hidden overflow="visible">
      <GlowDefs />
      <defs>
        <radialGradient id="booth-glow" cx="50%" cy="60%" r="60%">
          <stop offset="0" stopColor="#ff8cc0" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ff8cc0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="booth-water" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#8fe3ff" />
          <stop offset="1" stopColor="#2a7fb8" />
        </radialGradient>
      </defs>
      <ellipse cx="130" cy="150" rx="150" ry="110" fill="url(#booth-glow)" />

      {/* cột lều */}
      <rect x="18" y="46" width="7" height="166" fill="#3a2410" />
      <rect x="235" y="46" width="7" height="166" fill="#3a2410" />

      {/* mái lều sọc hồng - kem */}
      <path d="M4 50 L130 8 L256 50 Z" fill="#8e2358" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${4 + i * 31.5} 50 h31.5 v16 a15.75 12 0 0 1 -31.5 0 z`} fill={i % 2 ? "#fff1cf" : "#d8428f"} />
      ))}
      {/* dây cờ đuôi nheo */}
      <path d="M22 84 Q130 108 238 84" stroke="#1a0f06" strokeWidth="1.2" fill="none" />
      {Array.from({ length: 9 }, (_, i) => {
        const t = (i + 0.5) / 9;
        const x = 22 + 216 * t;
        const y = 84 + 4 * 24 * t * (1 - t);
        const c = ["#ffc45c", "#25b597", "#e8472e"][i % 3];
        return <path key={i} d={`M${x - 7} ${y} h14 l-7 12 z`} fill={c} />;
      })}

      {/* bảng hiệu */}
      <rect x="84" y="102" width="92" height="26" rx="3" fill="#2a1406" />
      <text x="130" y="120" textAnchor="middle" fontSize="14" fontWeight="800" fill="#ffc45c" fontFamily="var(--font-vn)" letterSpacing="1">
        TRÒ CHƠI
      </text>

      {/* quầy */}
      <rect x="10" y="164" width="240" height="48" rx="4" fill="#5a2a10" />
      <rect x="10" y="164" width="240" height="7" fill="#8a4a1c" />

      {/* bể cá vàng */}
      <g>
        <ellipse cx="62" cy="152" rx="40" ry="16" fill="url(#booth-water)" stroke="#bfe9ff" strokeWidth="2" />
        <path d="M44 150 q6 -5 12 0 q-6 5 -12 0 z M56 150 l5 -4 v8 z" fill="#ff7a2e" />
        <path d="M74 156 q6 -5 12 0 q-6 5 -12 0 z M86 156 l5 -4 v8 z" fill="#ffb13d" />
        <ellipse cx="54" cy="146" rx="10" ry="2" fill="#fff" opacity="0.5" />
      </g>

      {/* cọc ném vòng + vòng */}
      <g>
        {[140, 160, 180].map((x, i) => (
          <g key={x}>
            <rect x={x - 2.5} y="136" width="5" height="28" rx="2" fill="#ffd47a" />
            <ellipse cx={x} cy={150 - i * 0} rx="9" ry="3" fill="none" stroke={["#25b597", "#e8472e", "#ffc45c"][i]} strokeWidth="3" opacity={i === 1 ? 1 : 0} />
          </g>
        ))}
      </g>

      {/* gấu bông làm quà */}
      <g transform="translate(218 140)">
        <circle cx="-8" cy="-16" r="5" fill="#c98a4e" />
        <circle cx="8" cy="-16" r="5" fill="#c98a4e" />
        <circle cx="0" cy="-8" r="11" fill="#d99a5c" />
        <ellipse cx="0" cy="12" rx="12" ry="13" fill="#d99a5c" />
        <ellipse cx="0" cy="-4" rx="4" ry="3" fill="#f3d3ae" />
        <circle cx="-4" cy="-10" r="1.5" fill="#2a1406" />
        <circle cx="4" cy="-10" r="1.5" fill="#2a1406" />
        <path d="M-6 2 l6 4 l6 -4" stroke="#e8472e" strokeWidth="3" fill="none" />
      </g>

      {/* đèn ở hai góc */}
      {[22, 238].map((x, i) => (
        <g key={x} className="anim-sway-small" style={{ transformOrigin: `${x}px 64px`, animationDelay: `${-i * 1.3}s` }}>
          <line x1={x} y1="64" x2={x} y2="72" stroke="#1a0f06" strokeWidth="1.2" />
          <circle cx={x} cy="86" r="34" fill={glow("#ff8cc0")} />
          <ellipse cx={x} cy="86" rx="10" ry="12" fill={i ? "#ffc45c" : "#d8428f"} />
        </g>
      ))}
    </svg>
  );
}
