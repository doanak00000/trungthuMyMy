import { GlowDefs, glow } from "@/components/ui/GlowDefs";

/** Xe bánh trung thu: mái vải sọc, bảng hiệu, hộp bánh xếp chồng, hai chiếc đèn treo. viewBox 260 × 240 */
export function MooncakeStall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 240" className={className} aria-hidden overflow="visible">
      <GlowDefs />
      <defs>
        <radialGradient id="stall-glow" cx="50%" cy="60%" r="60%">
          <stop offset="0" stopColor="#ffb54a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffb54a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cake" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#f1b765" />
          <stop offset="1" stopColor="#b86b26" />
        </radialGradient>
      </defs>
      <ellipse cx="130" cy="150" rx="150" ry="110" fill="url(#stall-glow)" />

      {/* cột */}
      <rect x="22" y="40" width="7" height="170" fill="#3a2410" />
      <rect x="231" y="40" width="7" height="170" fill="#3a2410" />

      {/* mái sọc có viền lượn */}
      <path d="M8 44 L130 14 L252 44 Z" fill="#8a2412" />
      <g>
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M${8 + i * 30.5} 44 h30.5 v14 a15.25 13 0 0 1 -30.5 0 z`} fill={i % 2 ? "#ffd47a" : "#e8472e"} />
        ))}
      </g>

      {/* bảng hiệu */}
      <rect x="62" y="68" width="136" height="30" rx="3" fill="#2a1406" />
      <text x="130" y="89" textAnchor="middle" fontSize="15" fontWeight="800" fill="#ffc45c" fontFamily="var(--font-vn)" letterSpacing="0.5">
        BÁNH TRUNG THU
      </text>

      {/* quầy */}
      <rect x="14" y="158" width="232" height="54" rx="4" fill="#5a2a10" />
      <rect x="14" y="158" width="232" height="8" fill="#8a4a1c" />
      <g stroke="#3a1a08" strokeWidth="2" opacity="0.6">
        <line x1="72" y1="168" x2="72" y2="210" />
        <line x1="130" y1="168" x2="130" y2="210" />
        <line x1="188" y1="168" x2="188" y2="210" />
      </g>

      {/* hộp bánh xếp chồng */}
      <g>
        <rect x="30" y="126" width="54" height="32" rx="2" fill="#c8261a" />
        <rect x="30" y="126" width="54" height="6" fill="#ffc45c" />
        <rect x="36" y="100" width="42" height="26" rx="2" fill="#ffc45c" />
        <circle cx="57" cy="113" r="7" fill="#c8261a" />
        <rect x="178" y="122" width="58" height="36" rx="2" fill="#1f7f6a" />
        <rect x="178" y="138" width="58" height="5" fill="#ffd47a" />
      </g>

      {/* bánh bày trên quầy */}
      {[100, 130, 160].map((x, i) => (
        <g key={x} transform={`translate(${x} ${146 - (i === 1 ? 8 : 0)})`}>
          <ellipse cx="0" cy="12" rx="17" ry="4" fill="#2a1406" opacity="0.5" />
          <circle cx="0" cy="0" r="15" fill="url(#cake)" />
          <circle cx="0" cy="0" r="9" fill="none" stroke="#8f4d17" strokeWidth="1.4" />
          <path d="M-5 0 h10 M0 -5 v10" stroke="#8f4d17" strokeWidth="1.4" />
        </g>
      ))}

      {/* bánh xe */}
      <circle cx="56" cy="218" r="16" fill="#1a0f06" stroke="#6b4e22" strokeWidth="3" />
      <circle cx="204" cy="218" r="16" fill="#1a0f06" stroke="#6b4e22" strokeWidth="3" />

      {/* đèn treo ở hai góc mái */}
      {[26, 234].map((x, i) => (
        <g key={x} className="anim-sway-small" style={{ transformOrigin: `${x}px 58px`, animationDelay: `${-i * 1.7}s` }}>
          <line x1={x} y1="58" x2={x} y2="68" stroke="#1a0f06" strokeWidth="1.2" />
          <circle cx={x} cy="82" r="36" fill={glow("#ff8a4c")} />
          <ellipse cx={x} cy="82" rx="10" ry="12" fill={i ? "#ffa028" : "#e8472e"} />
          <line x1={x} y1="94" x2={x} y2="104" stroke={i ? "#ffa028" : "#e8472e"} strokeWidth="1.4" />
        </g>
      ))}
    </svg>
  );
}
