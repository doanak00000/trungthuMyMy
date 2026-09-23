"use client";

import { motion } from "framer-motion";
import { useId } from "react";

export type CakePattern = "flower" | "lotus" | "egg" | "heart";

const FILLINGS: Record<CakePattern, { filling: string; core?: string }> = {
  flower: { filling: "#8a5a2b", core: "#c9a066" },
  lotus: { filling: "#d8c070" },
  egg: { filling: "#e7cf8f", core: "#ff9d2e" },
  heart: { filling: "#ffb3c6", core: "#ff4d6d" },
};

/** Bánh nướng có viền hoa khế và hoa văn in khuôn. Khi `split` thì bẻ đôi, lộ nhân. viewBox 120 × 120 */
export function Mooncake({ pattern, split = false, className }: { pattern: CakePattern; split?: boolean; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const crust = `crust-${uid}`;
  const left = `cl-${uid}`;
  const right = `cr-${uid}`;
  const special = pattern === "heart";
  const f = FILLINGS[pattern];

  const whole = (
    <g>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return <circle key={i} cx={60 + Math.cos(a) * 44} cy={60 + Math.sin(a) * 44} r="9" fill={`url(#${crust})`} />;
      })}
      <circle cx="60" cy="60" r="46" fill={`url(#${crust})`} />
      <circle cx="60" cy="60" r="34" fill="none" stroke={special ? "#b0344f" : "#8f4d17"} strokeWidth="2" opacity="0.7" />
      <Motif pattern={pattern} />
    </g>
  );

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden overflow="visible">
      <defs>
        <radialGradient id={crust} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor={special ? "#ffcf9e" : "#f3bf6c"} />
          <stop offset="0.6" stopColor={special ? "#e79a6d" : "#d08a3c"} />
          <stop offset="1" stopColor={special ? "#b25a48" : "#9a5a1f"} />
        </radialGradient>
        <clipPath id={left}>
          <path d="M-20 -20 H58 L62 30 L56 60 L63 90 L58 140 H-20 Z" />
        </clipPath>
        <clipPath id={right}>
          <path d="M140 -20 H58 L62 30 L56 60 L63 90 L58 140 H140 Z" />
        </clipPath>
      </defs>

      {split ? (
        <>
          {/* nhân lộ ra giữa hai nửa */}
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 0.6 }} style={{ originX: "60px", originY: "60px" }}>
            {special && <circle cx="60" cy="60" r="46" fill="#ff7b95" opacity="0.35" className="anim-flicker" />}
            <circle cx="60" cy="60" r="30" fill={f.filling} />
            {special ? (
              <path d="M60 80 C 42 68, 36 56, 44 48 C 50 42, 57 45, 60 51 C 63 45, 70 42, 76 48 C 84 56, 78 68, 60 80 Z" fill={f.core} />
            ) : (
              f.core && <circle cx="60" cy="60" r="11" fill={f.core} />
            )}
          </motion.g>
          <motion.g clipPath={`url(#${left})`} initial={{ x: 0, rotate: 0 }} animate={{ x: -30, rotate: -14 }} transition={{ type: "spring", damping: 12, stiffness: 120 }} style={{ originX: "58px", originY: "100px" }}>
            {whole}
          </motion.g>
          <motion.g clipPath={`url(#${right})`} initial={{ x: 0, rotate: 0 }} animate={{ x: 30, rotate: 14 }} transition={{ type: "spring", damping: 12, stiffness: 120 }} style={{ originX: "62px", originY: "100px" }}>
            {whole}
          </motion.g>
        </>
      ) : (
        whole
      )}
    </svg>
  );
}

function Motif({ pattern }: { pattern: CakePattern }) {
  const stroke = pattern === "heart" ? "#9c2a44" : "#8f4d17";
  if (pattern === "heart") {
    return (
      <path
        d="M60 76 C 46 66, 40 57, 46 50 C 51 45, 57 47, 60 52 C 63 47, 69 45, 74 50 C 80 57, 74 66, 60 76 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="2.4"
      />
    );
  }
  if (pattern === "lotus") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="2">
        <path d="M60 44 C 67 52, 67 64, 60 74 C 53 64, 53 52, 60 44 Z" />
        <path d="M60 74 C 50 72, 44 64, 44 54 C 52 56, 58 64, 60 74 Z" />
        <path d="M60 74 C 70 72, 76 64, 76 54 C 68 56, 62 64, 60 74 Z" />
      </g>
    );
  }
  if (pattern === "egg") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="2">
        <circle cx="60" cy="60" r="12" />
        <circle cx="60" cy="60" r="20" strokeDasharray="3 4" />
      </g>
    );
  }
  return (
    <g fill="none" stroke={stroke} strokeWidth="2">
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse key={i} cx="60" cy="49" rx="5" ry="11" transform={`rotate(${i * 60} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="4" fill={stroke} />
    </g>
  );
}
